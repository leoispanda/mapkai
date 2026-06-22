import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, "docs", "gpt-story-generation");
const resultsDir = path.join(outputDir, "results");
const sourceFiles = ["script.js", "public/script.js"];
const generatedBlockStart = "// BEGIN GPT website story overrides 20260622";
const generatedBlockEnd = "// END GPT website story overrides 20260622";

const requiredFields = [
  "id",
  "mode",
  "titleZh",
  "summaryZh",
  "sceneZh",
  "storyBodyZh",
  "knowledgePointZh",
  "reflectionQuestionZh",
  "metaphorMapZh",
  "sourceWarnings",
  "qualityGate",
];

const forbiddenPatterns = [
  "旧办法并不荒唐",
  "这个办法并不荒唐",
  "这种做法并非没有道理",
  "真正留下来的，是",
  "普通场景慢慢变成了知识的入口",
  "后来人看见的是领域名称",
  "通过这个故事我们知道",
  "这说明",
  "证据开始发言",
  "让证据自己排队",
  "现场细节开始获得发言权",
  "在这里显出",
  "在这里获得",
  "在这里学会",
];

function nextNonWhitespace(text, startIndex) {
  for (let index = startIndex; index < text.length; index += 1) {
    if (!/\s/.test(text[index])) return text[index];
  }
  return "";
}

function normalizeSmartQuotedJson(raw) {
  let output = "";
  let inString = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];

    if (!inString) {
      if (char === "“" || char === "”") {
        output += "\"";
        inString = true;
      } else {
        output += char;
      }
      continue;
    }

    if (char === "\\") {
      output += char;
      if (index + 1 < raw.length) {
        index += 1;
        output += raw[index];
      }
      continue;
    }

    if (char === "\"") {
      output += "\\\"";
      continue;
    }

    if (char === "“") {
      output += char;
      continue;
    }

    if (char === "”") {
      const next = nextNonWhitespace(raw, index + 1);
      if ([",", "}", "]", ":"].includes(next)) {
        output += "\"";
        inString = false;
      } else {
        output += char;
      }
      continue;
    }

    output += char;
  }

  return output.replace(/^\uFEFF/, "").trim();
}

function parseGptOutput(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const normalized = normalizeSmartQuotedJson(raw);
  return JSON.parse(normalized);
}

function loadExpectedBatch(batchId) {
  const batchPath = path.join(outputDir, `${batchId}.json`);
  if (!fs.existsSync(batchPath)) return null;
  return JSON.parse(fs.readFileSync(batchPath, "utf8"));
}

function assertString(value, label, errors) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${label} is empty`);
}

function paragraphCount(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean).length;
}

function validateItem(item, expectedIds, errors, warnings) {
  requiredFields.forEach((field) => {
    if (!(field in item)) errors.push(`${item.id || "(missing id)"} missing ${field}`);
  });

  assertString(item.id, "id", errors);
  assertString(item.titleZh, `${item.id}.titleZh`, errors);
  assertString(item.summaryZh, `${item.id}.summaryZh`, errors);
  assertString(item.sceneZh, `${item.id}.sceneZh`, errors);
  assertString(item.storyBodyZh, `${item.id}.storyBodyZh`, errors);
  assertString(item.knowledgePointZh, `${item.id}.knowledgePointZh`, errors);
  assertString(item.reflectionQuestionZh, `${item.id}.reflectionQuestionZh`, errors);

  if (expectedIds && !expectedIds.has(item.id)) errors.push(`${item.id} is not in exported input batch`);

  if (!Array.isArray(item.metaphorMapZh)) errors.push(`${item.id}.metaphorMapZh must be an array`);
  if (!Array.isArray(item.sourceWarnings)) errors.push(`${item.id}.sourceWarnings must be an array`);

  const gate = item.qualityGate || {};
  if (gate.pdcReviewRounds < 3) errors.push(`${item.id} has fewer than 3 PDC review rounds`);
  if (gate.modifyRounds < 3) errors.push(`${item.id} has fewer than 3 modify rounds`);
  if (gate.status !== "APPROVED") errors.push(`${item.id} qualityGate.status is ${gate.status}`);

  if (paragraphCount(item.storyBodyZh) < 2) errors.push(`${item.id}.storyBodyZh needs paragraph breaks`);
  if (item.storyBodyZh.length < 260) warnings.push(`${item.id}.storyBodyZh is unusually short`);

  const text = [
    item.titleZh,
    item.summaryZh,
    item.sceneZh,
    item.storyBodyZh,
    item.knowledgePointZh,
    item.reflectionQuestionZh,
    ...(Array.isArray(item.metaphorMapZh)
      ? item.metaphorMapZh.flatMap((entry) => [entry.storyElement, entry.knowledgeElement, entry.image, entry.meaning])
      : []),
  ]
    .filter(Boolean)
    .join("\n");

  forbiddenPatterns.forEach((pattern) => {
    if (text.includes(pattern)) errors.push(`${item.id} contains forbidden pattern: ${pattern}`);
  });
}

function validatePayload(payload) {
  const errors = [];
  const warnings = [];
  if (!payload || typeof payload !== "object") errors.push("payload must be an object");
  if (typeof payload.batchId !== "string" || !payload.batchId) errors.push("batchId is required");
  if (!Array.isArray(payload.items)) errors.push("items must be an array");

  const expectedBatch = payload.batchId ? loadExpectedBatch(payload.batchId) : null;
  const expectedIds = expectedBatch ? new Set(expectedBatch.items.map((item) => item.id)) : null;
  if (expectedBatch && payload.items.length !== expectedBatch.items.length) {
    errors.push(`expected ${expectedBatch.items.length} items, got ${payload.items.length}`);
  }

  const seen = new Set();
  for (const item of payload.items || []) {
    if (seen.has(item.id)) errors.push(`duplicate id: ${item.id}`);
    seen.add(item.id);
    validateItem(item, expectedIds, errors, warnings);
  }

  if (expectedIds) {
    [...expectedIds].forEach((id) => {
      if (!seen.has(id)) errors.push(`missing expected id: ${id}`);
    });
  }

  return { errors, warnings };
}

function normalizeMetaphorMapForSite(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const image = String(entry.image || entry.storyElement || "").trim();
      const meaning = String(entry.meaning || entry.knowledgeElement || "").trim();
      if (!image && !meaning) return null;
      return { image, meaning };
    })
    .filter(Boolean);
}

function toSiteOverride(item) {
  return {
    titleZh: item.titleZh.trim(),
    summaryZh: item.summaryZh.trim(),
    sceneZh: item.sceneZh.trim(),
    storyBodyZh: item.storyBodyZh.trim(),
    knowledgePointZh: item.knowledgePointZh.trim(),
    reflectionQuestionZh: item.reflectionQuestionZh.trim(),
    metaphorMapZh: normalizeMetaphorMapForSite(item.metaphorMapZh),
  };
}

function loadApprovedResults(currentPayload) {
  fs.mkdirSync(resultsDir, { recursive: true });
  const byId = new Map();
  const resultFiles = fs.existsSync(resultsDir)
    ? fs.readdirSync(resultsDir).filter((file) => file.endsWith(".output.json")).sort()
    : [];

  for (const file of resultFiles) {
    const result = JSON.parse(fs.readFileSync(path.join(resultsDir, file), "utf8"));
    for (const item of result.items || []) {
      if (item?.qualityGate?.status === "APPROVED") byId.set(item.id, toSiteOverride(item));
    }
  }

  for (const item of currentPayload.items || []) {
    if (item?.qualityGate?.status === "APPROVED") byId.set(item.id, toSiteOverride(item));
  }

  return Object.fromEntries([...byId.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function buildGeneratedBlock(overrides) {
  const objectLiteral = JSON.stringify(overrides, null, 2);
  return `${generatedBlockStart}
const gptWebsiteStoryOverridesZh20260622 = ${objectLiteral};

function applyGptWebsiteStoryOverrideZh20260622(story) {
  const override = gptWebsiteStoryOverridesZh20260622[story?.id];
  if (override) Object.assign(story, override);
  return story;
}
${generatedBlockEnd}
`;
}

function upsertGeneratedBlock(source, block) {
  if (source.includes(generatedBlockStart) && source.includes(generatedBlockEnd)) {
    const pattern = new RegExp(`${escapeRegExp(generatedBlockStart)}[\\s\\S]*?${escapeRegExp(generatedBlockEnd)}\\n?`);
    return source.replace(pattern, block);
  }

  const anchor = "const remainingWebsiteStoryPdcGateZh20260621 = {";
  if (!source.includes(anchor)) throw new Error(`Cannot find insertion anchor: ${anchor}`);
  return source.replace(anchor, `${block}\n${anchor}`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function addHookOnce(source, needle, replacement) {
  if (source.includes(replacement)) return source;
  if (!source.includes(needle)) throw new Error(`Cannot find hook anchor: ${needle}`);
  return source.replace(needle, replacement);
}

function ensureApplyHooks(source) {
  source = addHookOnce(
    source,
    `  const override = reviewedLensStoryOverridesZh[story.id];
  if (override) Object.assign(story, override);
});`,
    `  const override = reviewedLensStoryOverridesZh[story.id];
  if (override) Object.assign(story, override);
  applyGptWebsiteStoryOverrideZh20260622(story);
});`
  );

  source = addHookOnce(
    source,
    `conceptFables.forEach((story) => applyPdcWebsiteStoryGateZh20260621(story));`,
    `conceptFables.forEach((story) => {
  applyPdcWebsiteStoryGateZh20260621(story);
  applyGptWebsiteStoryOverrideZh20260622(story);
});`
  );

  source = addHookOnce(
    source,
    `  const override = reviewedPublishedStoryOverridesZh[story.id];
  if (override) Object.assign(story, override);
});`,
    `  const override = reviewedPublishedStoryOverridesZh[story.id];
  if (override) Object.assign(story, override);
  applyGptWebsiteStoryOverrideZh20260622(story);
});`
  );

  return source;
}

function applyOverridesToSourceFiles(overrides) {
  const block = buildGeneratedBlock(overrides);
  for (const file of sourceFiles) {
    const filePath = path.join(repoRoot, file);
    let source = fs.readFileSync(filePath, "utf8");
    source = upsertGeneratedBlock(source, block);
    source = ensureApplyHooks(source);
    fs.writeFileSync(filePath, source);
  }
}

function writeResultFiles(payload, validation, overrides) {
  fs.mkdirSync(resultsDir, { recursive: true });
  const outputPath = path.join(resultsDir, `${payload.batchId}.output.json`);
  const reportPath = path.join(resultsDir, `${payload.batchId}.import-report.json`);

  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  fs.writeFileSync(reportPath, `${JSON.stringify({
    batchId: payload.batchId,
    importedAt: "2026-06-22",
    itemCount: payload.items.length,
    overrideCount: Object.keys(overrides).length,
    validation,
    ids: payload.items.map((item) => item.id),
  }, null, 2)}\n`);

  return { outputPath, reportPath };
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node tools/import-gpt-story-batch.mjs <gpt-output-file>");
  process.exit(1);
}

const payload = parseGptOutput(path.resolve(inputPath));
const validation = validatePayload(payload);
if (validation.errors.length) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

const overrides = loadApprovedResults(payload);
applyOverridesToSourceFiles(overrides);
const resultFiles = writeResultFiles(payload, validation, overrides);

console.log(JSON.stringify({
  batchId: payload.batchId,
  itemCount: payload.items.length,
  overrideCount: Object.keys(overrides).length,
  warnings: validation.warnings,
  resultFiles,
  updated: sourceFiles,
}, null, 2));
