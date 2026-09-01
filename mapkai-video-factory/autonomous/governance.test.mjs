import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  blockedReviewDecision,
  classifySensitiveContent,
  createRunRecord,
  detectTaxonomyMetadataLeak,
  deterministicValidate,
  loadPolicyBinding,
  validateFinalReviewDecision,
  validateReviewFinding,
} from "../governance.mjs";

const factory = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const cfg = JSON.parse(await readFile(path.join(factory, "factory-config.json"), "utf8"));
const binding = await loadPolicyBinding({ factoryDir: factory, expected: cfg.policyBinding });
assert.equal(binding.creatingPolicy.version, "v1.3");
assert.equal(binding.creatingPolicy.sha256, "5f0967c72bbf224aac87aae2fa3145dc3fde030cb21b5bf185efa2fe57b9d71e");
assert.equal(binding.reviewPolicy.version, "v1.2");
assert.equal(binding.reviewPolicy.sha256, "6df981e71d08c9e5b325aeb93a183f0352408f20120266233f8968360d3b2454");
assert.match(binding.creatingPolicy.sha256, /^[a-f0-9]{64}$/);
assert.match(binding.reviewPolicy.sha256, /^[a-f0-9]{64}$/);
assert.equal(cfg.editorial.conversationGovernance.default, "REUSE_EXISTING");
assert.equal(cfg.editorial.conversationGovernance.maxEffectiveInteractionCyclesBeforeConsideration, 20);
assert.equal(cfg.editorial.conversationGovernance.noStageBasedRotation, true);
assert.deepEqual(cfg.editorial.conversationGovernance.newConversationReasons, [
  "CONTEXT_LENGTH_THRESHOLD",
  "CONTEXT_DEGRADATION",
  "ROLE_CONTAMINATION",
  "PROVIDER_RECOVERY_REQUIRES_NEW_CONTEXT",
  "CONVERSATION_UNAVAILABLE",
]);
assert.equal(cfg.editorial.conversationGovernance.roleSlots.creator, "<field>:creator");
assert.equal(cfg.editorial.conversationGovernance.roleSlots.independent_reviewer, "<field>:independent_reviewer");
const newRunRecord = createRunRecord({ runId: "alignment-run", fieldId: "0311", artifactType: "FIELD_OVERVIEW_VIDEO", policyBinding: binding });
assert.equal(newRunRecord.policyBinding.creatingPolicy.version, "v1.3");
assert.equal(newRunRecord.policyBinding.reviewPolicy.version, "v1.2");

const deterministic = deterministicValidate({
  artifactType: "FIELD_OVERVIEW_VIDEO",
  fieldId: "0311",
  policyBinding: binding,
  requiredFiles: { overview: true, prompt: true },
  evidenceFields: { runId: true, activePromptVersions: true },
  expectedArtifactType: "FIELD_OVERVIEW_VIDEO",
});
assert.equal(deterministic.status, "PASS");
assert.equal(deterministic.productionEligible, false);
assert.equal(deterministic.semanticReviewRequired, true);
assert.equal(deterministic.checks.taxonomyMetadata, "NOT_RUN");
assert.match(deterministic.note, /does not judge Aha/i);

const fieldLeak = detectTaxonomyMetadataLeak({ text: "This orientation starts in Field 00.", audience: "learner-facing" });
assert.equal(fieldLeak.status, "TAXONOMY_METADATA_LEAK");
assert.equal(fieldLeak.findingCode, "TAXONOMY_METADATA_LEAK");
const subjectLeak = detectTaxonomyMetadataLeak({ text: "Subject 0011 is one of the mapped areas.", audience: "learner-facing", knownSubjectCodes: ["0011"] });
assert.equal(subjectLeak.status, "TAXONOMY_METADATA_LEAK");
assert.ok(subjectLeak.identifiers.some((identifier) => identifier.includes("0011")));
assert.equal(detectTaxonomyMetadataLeak({ text: "The knowledge-map coordinate: 0011 is internal.", audience: "learner-facing" }).status, "TAXONOMY_METADATA_LEAK");
assert.equal(detectTaxonomyMetadataLeak({ text: "This lesson explicitly teaches the Field 00 classification.", audience: "learner-facing", approvedEducationalPurpose: true }).status, "PASS");
const backendMetadata = detectTaxonomyMetadataLeak({ text: "Backend mapping: Field 00 / Subject 0011.", audience: "backend", knownSubjectCodes: ["0011"] });
assert.equal(backendMetadata.status, "PASS");
const ordinaryNumbers = detectTaxonomyMetadataLeak({ text: "In 2024, ten learners compare 3 examples.", audience: "learner-facing", knownSubjectCodes: ["0011"] });
assert.equal(ordinaryNumbers.status, "PASS");
assert.equal(detectTaxonomyMetadataLeak({ text: "A physics field 3 calculation uses three vectors.", audience: "learner-facing" }).status, "PASS");
assert.equal(detectTaxonomyMetadataLeak({ text: "The course compares several classification codes used in practice.", audience: "learner-facing" }).status, "PASS");
const deterministicLeak = deterministicValidate({
  artifactType: "FIELD_OVERVIEW_VIDEO",
  fieldId: "0311",
  policyBinding: binding,
  requiredFiles: { overview: true, prompt: true },
  evidenceFields: { runId: true, activePromptVersions: true },
  expectedArtifactType: "FIELD_OVERVIEW_VIDEO",
  learnerFacing: true,
  learnerFacingText: "The learner-facing title is Field 00.",
});
assert.equal(deterministicLeak.status, "FAIL");
assert.equal(deterministicLeak.checks.taxonomyMetadata, "FAIL");
assert.ok(deterministicLeak.errors.some((error) => /TAXONOMY_METADATA_LEAK|taxonomy metadata leak/i.test(error)));

const sensitive = classifySensitiveContent({ fieldId: "0312", fieldName: "Political Sciences and Civics", text: "This example discusses electoral campaigns." });
assert.equal(sensitive.status, "CLEAR");
assert.ok(sensitive.reviewTopics.length > 0);
assert.equal(sensitive.semanticReviewRequired, true);
assert.equal(classifySensitiveContent({ fieldId: "0311", fieldName: "Economics", text: "A household compares rent, prices, and commuting costs." }).status, "CLEAR");

const missing = validateReviewFinding({ findingCode: "WEAK_AHA" });
assert.ok(missing.length > 0);
assert.deepEqual(validateReviewFinding({
  findingCode: "TAXONOMY_METADATA_LEAK",
  severity: "LOW",
  reviewDimension: "learner-facing taxonomy metadata",
  artifactLocation: "overview.md:1",
  evidence: "Field 00",
  whyItMatters: "Internal coordinates add backend metadata to learner-facing prose.",
  requiredChange: "Replace the coordinate with the underlying knowledge.",
  decisionImpact: "REVISE before promotion.",
}), []);
const blocked = blockedReviewDecision({ runId: "run-1", fieldId: "0311", artifactType: "FIELD_OVERVIEW_VIDEO", policyBinding: binding });
assert.equal(validateFinalReviewDecision(blocked).length, 0);
assert.equal(blocked.decision, "BLOCKED");
assert.equal(blocked.evidenceSufficient, false);
assert.ok(validateFinalReviewDecision({ ...blocked, decision: "PASS" }).length > 0);
assert.ok(validateFinalReviewDecision({ ...blocked, decision: "PASS", evidenceSufficient: true, hardGates: {} }).some((error) => /hard gate/i.test(error)));
assert.ok(validateFinalReviewDecision({ ...blocked, policyBinding: null }).some((error) => /policyBinding/i.test(error)));

const temp = await mkdtemp(path.join(os.tmpdir(), "mapkai-policy-binding-"));
const badConfig = { creating: { ...cfg.policyBinding.creating, sha256: "0".repeat(64) }, review: cfg.policyBinding.review };
await assert.rejects(() => loadPolicyBinding({ factoryDir: factory, expected: badConfig }), /POLICY_BINDING_MISMATCH/);
const badReviewConfig = { creating: cfg.policyBinding.creating, review: { ...cfg.policyBinding.review, sha256: "0".repeat(64) } };
await assert.rejects(() => loadPolicyBinding({ factoryDir: factory, expected: badReviewConfig }), /POLICY_BINDING_MISMATCH/);

// Historical run immutability is exercised with self-contained fixtures in
// major-fields-history.test.mjs. Runtime ledgers and provider URLs remain local
// operational data and are intentionally not required by this source test.
await rm(temp, { recursive: true, force: true });
console.log("governance runtime tests passed");
