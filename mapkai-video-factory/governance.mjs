import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Runtime governance primitives.
 *
 * This module deliberately contains no editorial prose. The two policy files
 * remain the canonical source; this code only binds their version and digest,
 * validates machine-checkable facts, and persists evidence-bound review
 * records. It must never make a semantic quality judgement on behalf of a
 * reviewer.
 */

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

export const POLICY_FILES = Object.freeze({
  creating: "policy/mapkai-creating-policy-v1.3.md",
  review: "policy/mapkai-review-policy-v1.2.md",
});

export const FINAL_DECISIONS = Object.freeze(["PASS", "REVISE", "REBUILD", "BLOCKED"]);
export const SENSITIVE_CONTENT_STATES = Object.freeze(["CLEAR", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED"]);
export const REVIEW_SEVERITIES = Object.freeze(["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const HARD_GATE_NAMES = Object.freeze([
  "factualEpistemicIntegrity",
  "realWorldFieldFidelity",
  "artifactIntegrity",
  "sensitiveContentGovernance",
]);
export const TAXONOMY_METADATA_LEAK = "TAXONOMY_METADATA_LEAK";

const DEFAULT_MAJOR_FIELD_IDS = Object.freeze(["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10"]);

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
}

export class PolicyBindingError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "POLICY_BINDING_MISMATCH";
    this.code = "POLICY_BINDING_MISMATCH";
    this.details = details;
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function normalisePath(value) {
  return String(value || "").replaceAll("\\", "/").replace(/^\.\//, "");
}

function policyPath(factoryDir, relativePath) {
  return path.resolve(factoryDir, normalisePath(relativePath));
}

function policyVersion(relativePath, fallback) {
  const match = String(relativePath || "").match(/-(v\d+(?:\.\d+)?)\.md$/i);
  return match?.[1] || fallback;
}

function expectedEntry(expected, name) {
  const raw = expected?.[name] || expected?.[`${name}Policy`] || {};
  return {
    version: raw.version || null,
    path: raw.path || POLICY_FILES[name],
    sha256: raw.sha256 || raw.hash || null,
  };
}

/**
 * Read and verify the canonical policy files. `expected` is normally the
 * policyBinding lock in factory-config.json. A missing lock is an error for a
 * formal run: silently accepting a changed policy would make the run
 * irreproducible.
 */
export async function loadPolicyBinding({ factoryDir = MODULE_DIR, expected = null, requireExpected = true } = {}) {
  const expectedCreating = expectedEntry(expected, "creating");
  const expectedReview = expectedEntry(expected, "review");
  if (requireExpected && (!expectedCreating.sha256 || !expectedReview.sha256)) {
    throw new PolicyBindingError("Runtime policy lock is missing a canonical SHA-256 for Creating Policy or Review Policy.", {
      expectedCreating,
      expectedReview,
    });
  }
  const entries = {};
  const mismatches = [];
  for (const [name, expectedValue] of [["creating", expectedCreating], ["review", expectedReview]]) {
    const relative = normalisePath(expectedValue.path || POLICY_FILES[name]);
    const absolute = policyPath(factoryDir, relative);
    if (!existsSync(absolute)) {
      mismatches.push(`${name}: missing canonical policy file ${relative}`);
      continue;
    }
    const contents = await readFile(absolute);
    const digest = sha256(contents);
    const version = policyVersion(relative, name === "creating" ? "v1.3" : "v1.2");
    entries[name] = {
      version,
      path: relative,
      sha256: digest,
      absolutePath: absolute,
    };
    if (expectedValue.sha256 && digest !== expectedValue.sha256) mismatches.push(`${name}: expected ${expectedValue.sha256}, found ${digest}`);
    if (expectedValue.version && expectedValue.version !== version) mismatches.push(`${name}: expected version ${expectedValue.version}, found ${version}`);
  }
  if (mismatches.length) throw new PolicyBindingError(`Canonical policy binding failed: ${mismatches.join("; ")}`, { mismatches, entries });
  return {
    schemaVersion: "policy-binding.v1",
    creatingPolicy: { version: entries.creating.version, path: entries.creating.path, sha256: entries.creating.sha256 },
    reviewPolicy: { version: entries.review.version, path: entries.review.path, sha256: entries.review.sha256 },
    verifiedAt: new Date().toISOString(),
  };
}

export function flattenPolicyBinding(binding) {
  return {
    creatingPolicyVersion: binding?.creatingPolicy?.version || null,
    creatingPolicySha256: binding?.creatingPolicy?.sha256 || null,
    reviewPolicyVersion: binding?.reviewPolicy?.version || null,
    reviewPolicySha256: binding?.reviewPolicy?.sha256 || null,
  };
}

export function createRunRecord({
  runId,
  fieldId,
  artifactType,
  policyBinding,
  activePromptVersions = {},
  timestamp = new Date().toISOString(),
  status = "STARTED",
  ...extra
} = {}) {
  const flattened = flattenPolicyBinding(policyBinding);
  return {
    schemaVersion: "run-record.v1",
    runId: runId || null,
    fieldId: fieldId || null,
    artifactType: artifactType || null,
    timestamp,
    status,
    policyBinding: policyBinding || null,
    ...flattened,
    activePromptVersions,
    ...extra,
  };
}

export async function persistRunRecord(file, record) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(record, null, 2)}\n`);
  return file;
}

export function validatePolicyBindingShape(binding) {
  const errors = [];
  for (const [label, entry] of [["creatingPolicy", binding?.creatingPolicy], ["reviewPolicy", binding?.reviewPolicy]]) {
    if (!entry?.version) errors.push(`${label}.version is required`);
    if (!entry?.path) errors.push(`${label}.path is required`);
    if (!/^[a-f0-9]{64}$/i.test(String(entry?.sha256 || ""))) errors.push(`${label}.sha256 must be a SHA-256 digest`);
  }
  return errors;
}

export async function promptVersionRecords({ factoryDir = MODULE_DIR, prompts = {} } = {}) {
  const result = {};
  for (const [name, value] of Object.entries(prompts || {})) {
    const entry = typeof value === "string" ? { path: value } : (value || {});
    const relative = normalisePath(entry.path || "");
    const absolute = path.isAbsolute(relative) ? relative : path.resolve(factoryDir, relative);
    const contents = existsSync(absolute) ? await readFile(absolute) : null;
    result[name] = {
      version: entry.version || "UNVERSIONED",
      path: relative || null,
      sha256: contents ? sha256(contents) : null,
      present: Boolean(contents),
    };
  }
  return result;
}

/**
 * Detect explicit internal taxonomy coordinates in learner-facing text.
 *
 * This is intentionally narrow: backend records are out of scope, explicit
 * labels such as "Field 00" are actionable, and bare numbers are only
 * checked when the caller supplies them as known canonical identifiers.
 * Absence of a finding is not a semantic quality judgement.
 */
export function detectTaxonomyMetadataLeak({
  text = "",
  audience = "learner-facing",
  approvedEducationalPurpose = false,
  knownFieldIds = DEFAULT_MAJOR_FIELD_IDS,
  knownSubjectCodes = [],
  knownClassificationIdentifiers = [],
  knownCodes = [],
  knownClassificationCodes = [],
  knownLabels = [],
} = {}) {
  const base = {
    findingCode: null,
    audience,
    approvedEducationalPurpose: Boolean(approvedEducationalPurpose),
    identifiers: [],
    evidence: [],
  };
  if (audience !== "learner-facing") {
    return { ...base, status: "PASS", note: "Backend metadata is allowed to retain canonical taxonomy identifiers." };
  }
  if (approvedEducationalPurpose) {
    return { ...base, status: "PASS", note: "The identifier has an explicitly approved educational purpose." };
  }

  const body = String(text || "");
  const identifiers = new Set();
  const evidence = new Set();
  const record = (identifier, sample) => {
    identifiers.add(String(identifier));
    evidence.add(String(sample));
  };

  // Explicit field labels are unambiguous internal coordinates. Known IDs
  // are also checked in case the label uses "ID", "code", or a separator.
  const fieldLabel = /\b(?:major\s+)?field(?:\s+(?:id|code|identifier))?\s*[:#-]?\s*0\d\b/gi;
  for (const match of body.matchAll(fieldLabel)) record(match[0].replace(/\s+/g, " ").trim(), match[0]);
  for (const rawId of [...new Set([...(knownFieldIds || []), ...DEFAULT_MAJOR_FIELD_IDS])]) {
    const id = String(rawId).trim();
    if (!id) continue;
    const pattern = new RegExp(`\\b(?:major\\s+)?field(?:\\s+(?:id|code|identifier))?\\s*[:#-]?\\s*${escapeRegExp(id)}\\b`, "i");
    const match = body.match(pattern);
    if (match) record(`Field ${id}`, match[0]);
  }

  // Subject/classification labels are caught even when the caller has not
  // supplied a taxonomy snapshot. Bare four-digit values are not caught by
  // these patterns, avoiding ordinary dates, counts, and measurements.
  const subjectLabel = /\bsubject(?:\s+(?:id|code|identifier))?\s*[:#-]?\s*\d{4}\b/gi;
  for (const match of body.matchAll(subjectLabel)) record(match[0].replace(/\s+/g, " ").trim(), match[0]);
  const classificationLabel = /\b(?:classification|taxonomy)\s+(?:code|id|identifier|number|coordinate)\s*(?::|#|-)\s*[A-Za-z0-9_-]+\b|\b(?:classification|taxonomy)\s+(?:code|id|identifier|number|coordinate)\s+\d{2,}\b/gi;
  for (const match of body.matchAll(classificationLabel)) record(match[0].replace(/\s+/g, " ").trim(), match[0]);
  const iscedLabel = /\bISCED(?:-F)?\s*(?:field|subject)?\s*\d{1,4}\b/gi;
  for (const match of body.matchAll(iscedLabel)) record(match[0].replace(/\s+/g, " ").trim(), match[0]);
  const coordinateLabel = /\b(?:internal\s+)?(?:knowledge[- ]map|mapkai)\s+(?:coordinate|id|code)\s*[:#-]\s*[A-Za-z0-9_-]+\b/gi;
  for (const match of body.matchAll(coordinateLabel)) record(match[0].replace(/\s+/g, " ").trim(), match[0]);

  // A bare known canonical code is still a leak: the code list comes from
  // the backend taxonomy, so an ordinary number not in that list is safe.
  for (const rawCode of [...new Set([...(knownSubjectCodes || []), ...(knownClassificationIdentifiers || []), ...(knownCodes || []), ...(knownClassificationCodes || [])])]) {
    const code = String(rawCode).trim();
    if (!code || !/^[A-Za-z0-9_-]{2,}$/.test(code)) continue;
    const pattern = new RegExp(`\\b${escapeRegExp(code)}\\b`, "i");
    const match = body.match(pattern);
    if (match) record(code, match[0]);
  }
  for (const rawLabel of knownLabels || []) {
    const label = String(rawLabel).trim();
    if (!label) continue;
    const pattern = new RegExp(`\\b${escapeRegExp(label)}\\b`, "i");
    const match = body.match(pattern);
    if (match) record(label, match[0]);
  }

  const leak = identifiers.size > 0;
  return {
    ...base,
    status: leak ? TAXONOMY_METADATA_LEAK : "PASS",
    findingCode: leak ? TAXONOMY_METADATA_LEAK : null,
    identifiers: [...identifiers],
    evidence: [...evidence],
    note: leak
      ? "Learner-facing content exposes internal taxonomy metadata; replace it with the underlying knowledge unless an approved educational purpose exists."
      : "No explicit learner-facing taxonomy metadata was detected; semantic review remains required.",
  };
}

export function deterministicValidate({
  artifactType,
  fieldId,
  policyBinding,
  requiredFiles = {},
  evidenceFields = {},
  expectedArtifactType = null,
  forbiddenStatuses = [],
  currentStatus = null,
  sensitiveContent = null,
  learnerFacing = false,
  learnerFacingText = "",
  approvedEducationalPurpose = false,
  knownFieldIds = DEFAULT_MAJOR_FIELD_IDS,
  knownSubjectCodes = [],
  knownClassificationIdentifiers = [],
  knownCodes = [],
  knownClassificationCodes = [],
  knownLabels = [],
  extraChecks = {},
} = {}) {
  const errors = [];
  const checks = {};
  const bindingErrors = validatePolicyBindingShape(policyBinding);
  checks.policyBinding = bindingErrors.length ? "FAIL" : "PASS";
  errors.push(...bindingErrors.map((error) => `policy binding: ${error}`));
  checks.fieldId = fieldId ? "PASS" : "FAIL";
  if (!fieldId) errors.push("fieldId is required");
  checks.artifactType = !expectedArtifactType || artifactType === expectedArtifactType ? "PASS" : "FAIL";
  if (expectedArtifactType && artifactType !== expectedArtifactType) errors.push(`artifactType mismatch: expected ${expectedArtifactType}, found ${artifactType || "UNKNOWN"}`);
  const missingFiles = Object.entries(requiredFiles).filter(([, present]) => !present).map(([name]) => name);
  checks.requiredFiles = missingFiles.length ? "FAIL" : "PASS";
  if (missingFiles.length) errors.push(`missing required files: ${missingFiles.join(", ")}`);
  const missingEvidence = Object.entries(evidenceFields).filter(([, present]) => !present).map(([name]) => name);
  checks.evidenceFields = missingEvidence.length ? "FAIL" : "PASS";
  if (missingEvidence.length) errors.push(`missing deterministic evidence fields: ${missingEvidence.join(", ")}`);
  const forbidden = currentStatus && forbiddenStatuses.includes(currentStatus) ? [currentStatus] : [];
  checks.forbiddenStatus = forbidden.length ? "FAIL" : "PASS";
  if (forbidden.length) errors.push(`forbidden status: ${forbidden.join(", ")}`);
  if (sensitiveContent?.status === "SENSITIVE_TOPIC_REVIEW_REQUIRED" || sensitiveContent?.status === "POLICY_CLARIFICATION_REQUIRED") {
    checks.sensitiveContent = "HOLD";
    errors.push(`sensitive governance hold: ${sensitiveContent.status}`);
  } else checks.sensitiveContent = "PASS";
  const taxonomyMetadata = learnerFacing
    ? detectTaxonomyMetadataLeak({
      text: learnerFacingText,
      audience: "learner-facing",
      approvedEducationalPurpose,
      knownFieldIds,
      knownSubjectCodes,
      knownClassificationIdentifiers,
      knownCodes,
      knownClassificationCodes,
      knownLabels,
    })
    : { status: "NOT_RUN", findingCode: null, identifiers: [], evidence: [], note: "Learner-facing text was not supplied to the deterministic preflight." };
  checks.taxonomyMetadata = learnerFacing ? (taxonomyMetadata.status === TAXONOMY_METADATA_LEAK ? "FAIL" : "PASS") : "NOT_RUN";
  if (taxonomyMetadata.status === TAXONOMY_METADATA_LEAK) {
    errors.push(`${TAXONOMY_METADATA_LEAK}: learner-facing taxonomy metadata leak: ${taxonomyMetadata.identifiers.join(", ")}`);
  }
  for (const [name, result] of Object.entries(extraChecks || {})) {
    checks[name] = result === true || result === "PASS" ? "PASS" : "FAIL";
    if (checks[name] === "FAIL") errors.push(`deterministic check failed: ${name}`);
  }
  return {
    schemaVersion: "deterministic-validation.v1",
    authority: "DETERMINISTIC_VALIDATOR",
    generatedAt: new Date().toISOString(),
    artifactType: artifactType || null,
    fieldId: fieldId || null,
    status: errors.length ? "FAIL" : "PASS",
    productionEligible: false,
    checks,
    errors,
    taxonomyMetadata,
    semanticReviewRequired: true,
    note: "Deterministic validation does not judge Aha, discovery, depth, naturalness, specificity, or mental-model usefulness.",
  };
}

const SENSITIVE_REVIEW_TOPICS = Object.freeze([
  ["religion and theology", /\breligi(?:on|ous)\b|\btheolog\w*\b|宗教|神学/i],
  ["politics and civic institutions", /\bpolitic\w*\b|\bcivics?\b|\belect(?:ion|oral)\w*\b|政治|公民|选举/i],
  ["ideology and contested public issues", /\bideolog\w*\b|\bpropaganda\b|\bextremis\w*\b|culture[- ]war|意识形态|极端主义/i],
]);

// Narrow triage signals, not semantic approval. Ordinary mentions request
// independent review. Field names and backend inventories cannot block a field.
const HIGH_RISK_TREATMENT = Object.freeze([
  ["partisan persuasion", /\b(?:vote for|campaign for|support (?:our|this) (?:party|candidate))\b|请投票支持|为.{0,12}拉票/i],
  ["religious superiority or persuasion", /\b(?:our|this|the only true) (?:religion|faith) is (?:the only|true|superior)|\byou (?:must|should) (?:convert|worship)\b|宗教.{0,8}(?:最优越|唯一真理)|必须皈依/i],
  ["ideological or geopolitical advocacy", /\b(?:promote|produce|spread|advocate) (?:\w+ ){0,3}(?:ideological|geopolitical) (?:propaganda|advocacy)\b|宣扬.{0,8}(?:政治宣传|意识形态)/i],
  ["extremist glorification or recruitment", /\b(?:glorify|praise|recruit for|join) (?:\w+ ){0,3}extremist\b|赞美极端主义|招募.{0,8}极端/i],
  ["high-risk central topic", /\b(?:centred|centered|focus(?:ed)?|revolves?) (?:on|around) (?:\w+ ){0,4}(?:culture[- ]war|contemporary partisan|religious identity conflict)\b/i],
]);

export function classifySensitiveContent({ fieldId = null, fieldName = "", text = "", uncertain = false, inputKind = "artifact", highRiskCentralTopic = false } = {}) {
  const reviewTopics = SENSITIVE_REVIEW_TOPICS.filter(([, pattern]) => pattern.test(fieldName + "\n" + text)).map(([label]) => label);
  const base = {
    fieldId, inputKind, reviewTopics,
    semanticReviewRequired: true,
    signals: [], evidence: [],
    leastSensitiveExampleRule: "Use the least sensitive example that explains the idea equally well.",
    note: "CLEAR means no deterministic scope hold. It is not evidence of necessity, neutrality, quality or release eligibility.",
  };
  if (uncertain) return { ...base, status: "POLICY_CLARIFICATION_REQUIRED", signals: ["caller marked scope uncertain"] };
  if (inputKind === "taxonomy") return { ...base, status: "CLEAR", note: "A taxonomy inventory alone cannot trigger a sensitive-content hold. Actual scope and passages require independent review." };
  if (highRiskCentralTopic) return { ...base, status: "SENSITIVE_TOPIC_REVIEW_REQUIRED", signals: ["declared high-risk central topic"], evidence: [String(text || fieldName)] };
  const sentences = String(text || "").split(/(?<=[.!?。！？;；\n])\s*/u);
  for (const sentence of sentences) {
    for (const [label, pattern] of HIGH_RISK_TREATMENT) {
      const match = pattern.exec(sentence);
      if (!match) continue;
      const prefix = sentence.slice(0, match.index);
      // A protective instruction is not the act it prohibits. Keep the
      // exemption within the matched clause, never the entire artifact.
      if (/(?:\bdo not|\bmust not|\bshould not|\bnever|\bavoid|\bwithout|不得|不要|禁止|避免)[^.!?。！？;；\n]{0,90}$/iu.test(prefix)) continue;
      base.signals.push(label);
      base.evidence.push(sentence.trim());
    }
  }
  return { ...base, status: base.signals.length ? "SENSITIVE_TOPIC_REVIEW_REQUIRED" : "CLEAR", signals: [...new Set(base.signals)], evidence: [...new Set(base.evidence)] };
}

function validateSensitiveReview(record) {
  if (record?.decision !== "PASS") return [];
  const version = record?.policyBinding?.reviewPolicy?.version || "v1.0";
  const [major, minor] = version.replace(/^v/, "").split(".").map(Number);
  if (major < 1 || (major === 1 && minor < 2)) return [];
  const assessment = record.sensitiveContentAssessment;
  if (!assessment || !["NO_MATERIAL_SENSITIVE_CONTENT", "NECESSARY_NEUTRAL_COVERAGE"].includes(assessment.scope)) return ["PASS under Review Policy v1.2+ requires an independent sensitiveContentAssessment with an eligible scope"];
  const errors = [];
  if (!String(assessment.summary || "").trim()) errors.push("sensitiveContentAssessment.summary is required");
  if (!Array.isArray(assessment.evidence)) errors.push("sensitiveContentAssessment.evidence must be an array");
  if (assessment.scope === "NECESSARY_NEUTRAL_COVERAGE") {
    if (!Array.isArray(assessment.evidence) || !assessment.evidence.length) errors.push("necessary neutral coverage requires passage evidence");
    for (const [index, evidence] of (Array.isArray(assessment.evidence) ? assessment.evidence : []).entries()) {
      for (const key of ["artifactLocation", "excerpt", "necessity", "neutrality", "factualStatus"]) {
        if (typeof evidence?.[key] !== "string" || !evidence[key].trim()) errors.push("sensitiveContentAssessment.evidence[" + index + "]." + key + " is required");
      }
      if (!Array.isArray(evidence?.sourceRefs) || !evidence.sourceRefs.length || evidence.sourceRefs.some(value => typeof value !== "string" || !value.trim())) errors.push("sensitiveContentAssessment.evidence[" + index + "].sourceRefs is required");
    }
  }
  return errors;
}

export function validateReviewFinding(finding) {
  const errors = [];
  const required = ["findingCode", "severity", "reviewDimension", "artifactLocation", "evidence", "whyItMatters", "requiredChange", "decisionImpact"];
  for (const key of required) {
    const value = finding?.[key];
    if (value === undefined || value === null || (typeof value === "string" && !value.trim())) errors.push(`${key} is required`);
  }
  if (finding?.severity && !REVIEW_SEVERITIES.includes(finding.severity)) errors.push(`severity must be one of ${REVIEW_SEVERITIES.join(", ")}`);
  if (finding?.artifactLocation && typeof finding.artifactLocation !== "string" && typeof finding.artifactLocation !== "object") errors.push("artifactLocation must be a string or object");
  if (finding?.evidence && typeof finding.evidence !== "string" && typeof finding.evidence !== "object") errors.push("evidence must be a string or object");
  return errors;
}

export function validateFinalReviewDecision(record) {
  const errors = [];
  if (!FINAL_DECISIONS.includes(record?.decision)) errors.push(`decision must be one of ${FINAL_DECISIONS.join(", ")}`);
  if (!record?.runId) errors.push("runId is required");
  if (!record?.fieldId) errors.push("fieldId is required");
  if (!record?.artifactType) errors.push("artifactType is required");
  if (!record?.policyBinding) errors.push("policyBinding is required");
  else for (const error of validatePolicyBindingShape(record.policyBinding)) errors.push(`policyBinding: ${error}`);
  if (!["independent_reviewer", "human_reviewer", "creator_self_check"].includes(record?.reviewerRole)) errors.push("reviewerRole must identify the review authority");
  if (typeof record?.evidenceSufficient !== "boolean") errors.push("evidenceSufficient must be boolean");
  if (!Array.isArray(record?.reasonCodes)) errors.push("reasonCodes must be an array");
  if (!Array.isArray(record?.findings)) errors.push("findings must be an array");
  if (!record?.hardGates || typeof record.hardGates !== "object" || Array.isArray(record.hardGates)) errors.push("hardGates must be an object");
  for (const [index, finding] of (record?.findings || []).entries()) for (const error of validateReviewFinding(finding)) errors.push(`findings[${index}].${error}`);
  if (record?.decision === "PASS" && record?.evidenceSufficient !== true) errors.push("PASS requires evidenceSufficient=true");
  if (record?.decision === "PASS" && HARD_GATE_NAMES.some((name) => record?.hardGates?.[name] !== "PASS")) errors.push("PASS requires every hard gate to be PASS");
  if (record?.reviewerRole === "creator_self_check") errors.push("creator self-check cannot issue a final review decision");
  errors.push(...validateSensitiveReview(record));
  return errors;
}

export function blockedReviewDecision({ runId, fieldId, artifactType, policyBinding, reasonCode = "INSUFFICIENT_EVIDENCE", reason = "Independent semantic review has not produced sufficient evidence.", reviewerRole = "independent_reviewer" } = {}) {
  return {
    schemaVersion: "final-review-decision.v1",
    runId: runId || null,
    fieldId: fieldId || null,
    artifactType: artifactType || null,
    policyBinding: policyBinding || null,
    reviewerRole,
    decision: "BLOCKED",
    evidenceSufficient: false,
    reasonCodes: [reasonCode],
    hardGates: Object.fromEntries(HARD_GATE_NAMES.map((name) => [name, "NOT_REVIEWED"])),
    findings: [],
    summary: reason,
    reviewedAt: null,
    creatorOutputPath: null,
    creatorSelfCheckPath: null,
    independentReviewPath: null,
    decisionImpact: "No release or next-stage promotion is permitted.",
  };
}

export const ARTIFACT_CONTRACT_TYPES = Object.freeze(["GENERAL_OVERVIEW", "OVERVIEW", "FIELD_OVERVIEW", "CURRICULUM", "SUBJECT", "LESSON", "DEEP_DIVE", "FIELD_OVERVIEW_VIDEO"]);

export function artifactContractPlaceholder(type) {
  const artifactType = ARTIFACT_CONTRACT_TYPES.includes(type) ? type : "UNKNOWN";
  return {
    schemaVersion: "artifact-contract.v1",
    artifactType,
    contractStatus: "PLACEHOLDER",
    cognitiveJob: null,
    requiredEvidence: [],
    requiredOutputs: [],
    note: "Artifact-specific review criteria are intentionally not defined in this architecture phase; do not substitute a universal rubric.",
  };
}

export function fieldRepresentationInterface({ fieldId = null, fieldName = null, source = null } = {}) {
  return {
    schemaVersion: "field-representation.v1",
    fieldId,
    fieldName,
    realWorldKnowledgeRepresentation: {
      status: "INTERFACE_ONLY",
      source,
      branches: [],
      subjects: [],
      concepts: [],
      methods: [],
      applications: [],
      crossFieldRelationships: [],
    },
    learnerFacingRepresentation: {
      status: "EDITORIAL_PATH_SEPARATE",
      entryPoint: null,
      narrativeOrder: [],
      discoveryRoute: [],
      cognitiveRevealSequence: [],
    },
    boundary: "MapKAI does not redesign human knowledge; it redesigns the learner's path into human knowledge.",
  };
}
