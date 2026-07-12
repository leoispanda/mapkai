import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const contentRoot = path.join(repoRoot, "content", "field-fables");
const planPath = path.join(contentRoot, "topic-plan.tsv");
const progressPath = path.join(contentRoot, "progress.json");
const batchesDir = path.join(contentRoot, "batches");

const expectedColumns = [
  "batch_id",
  "category_code",
  "field_code",
  "field_title_en",
  "field_title_zh",
  "slot",
  "story_id",
  "concept_en",
  "concept_zh",
  "mode",
  "story_anchor_zh",
  "status",
];

const requiredArticleFields = [
  "id",
  "batchId",
  "categoryCode",
  "fieldCode",
  "fieldTitle",
  "fieldTitleZh",
  "title",
  "titleZh",
  "summary",
  "summaryZh",
  "storyParagraphs",
  "storyParagraphsZh",
  "conceptName",
  "conceptNameZh",
  "explanationParagraphs",
  "explanationParagraphsZh",
  "mode",
  "status",
  "qualityGate",
];

const forbiddenPublicFields = [
  "metaphorMap",
  "metaphorMapZh",
  "analogyBoundary",
  "analogyBoundaryZh",
  "reflectionQuestion",
  "reflectionQuestionZh",
  "editorialComments",
  "pdcNotes",
];

function fail(message) {
  throw new Error(message);
}

function parsePlan() {
  const lines = fs.readFileSync(planPath, "utf8").trim().split(/\r?\n/);
  const header = lines.shift().split("\t");
  if (header.join("\t") !== expectedColumns.join("\t")) {
    fail(`Unexpected topic-plan.tsv header: ${header.join(" | ")}`);
  }

  return lines.map((line, index) => {
    const values = line.split("\t");
    if (values.length !== expectedColumns.length) {
      fail(`topic-plan.tsv line ${index + 2} has ${values.length} columns; expected ${expectedColumns.length}`);
    }
    return Object.fromEntries(expectedColumns.map((column, columnIndex) => [column, values[columnIndex]]));
  });
}

function englishWordCount(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

function assertNonEmptyString(value, label, errors) {
  if (typeof value !== "string" || !value.trim()) errors.push(`${label} must be a non-empty string`);
}

function validatePlan(rows, progress, errors) {
  if (rows.length !== progress.targetBilingualArticles) {
    errors.push(`topic plan has ${rows.length} rows; expected ${progress.targetBilingualArticles}`);
  }

  const ids = new Set();
  const fields = new Map();
  const batches = new Map();
  const progressFieldToBatch = new Map(
    progress.batches.flatMap((batch) => batch.fieldCodes.map((fieldCode) => [fieldCode, batch.id]))
  );

  rows.forEach((row) => {
    if (ids.has(row.story_id)) errors.push(`duplicate story id: ${row.story_id}`);
    ids.add(row.story_id);

    if (!/^\d{4}-[a-z0-9-]+$/.test(row.story_id)) errors.push(`invalid story id: ${row.story_id}`);
    if (!/^\d{4}$/.test(row.field_code)) errors.push(`invalid field code: ${row.field_code}`);
    if (!/^batch-\d{3}$/.test(row.batch_id)) errors.push(`invalid batch id: ${row.batch_id}`);
    if (!row.concept_en || !row.concept_zh || !row.story_anchor_zh) errors.push(`${row.story_id} has incomplete topic metadata`);
    if (!Number.isInteger(Number(row.slot)) || Number(row.slot) < 1 || Number(row.slot) > 3) {
      errors.push(`${row.story_id} has invalid slot ${row.slot}`);
    }
    if (progressFieldToBatch.get(row.field_code) !== row.batch_id) {
      errors.push(`${row.story_id} is in ${row.batch_id}, expected ${progressFieldToBatch.get(row.field_code) || "no batch"}`);
    }

    if (!fields.has(row.field_code)) fields.set(row.field_code, []);
    fields.get(row.field_code).push(row);
    if (!batches.has(row.batch_id)) batches.set(row.batch_id, []);
    batches.get(row.batch_id).push(row);
  });

  if (fields.size !== progress.targetFields) errors.push(`topic plan has ${fields.size} fields; expected ${progress.targetFields}`);
  fields.forEach((fieldRows, fieldCode) => {
    if (fieldRows.length !== progress.topicsPerField) errors.push(`${fieldCode} has ${fieldRows.length} topics`);
    const slots = fieldRows.map((row) => Number(row.slot)).sort().join(",");
    if (slots !== "1,2,3") errors.push(`${fieldCode} slots are ${slots}`);
    const titlesEn = new Set(fieldRows.map((row) => row.field_title_en));
    const titlesZh = new Set(fieldRows.map((row) => row.field_title_zh));
    if (titlesEn.size !== 1 || titlesZh.size !== 1) errors.push(`${fieldCode} has inconsistent field titles`);
  });

  progress.batches.forEach((batch) => {
    const batchRows = batches.get(batch.id) || [];
    if (batchRows.length !== batch.fieldCodes.length * progress.topicsPerField) {
      errors.push(`${batch.id} has ${batchRows.length} planned topics; expected ${batch.fieldCodes.length * progress.topicsPerField}`);
    }
  });
}

function validateArticle(article, planned, errors, warnings) {
  requiredArticleFields.forEach((field) => {
    if (!(field in article)) errors.push(`${article.id || "(missing id)"} missing ${field}`);
  });
  forbiddenPublicFields.forEach((field) => {
    if (field in article) errors.push(`${article.id || "(missing id)"} includes forbidden public field ${field}`);
  });

  [
    "id",
    "batchId",
    "categoryCode",
    "fieldCode",
    "fieldTitle",
    "fieldTitleZh",
    "title",
    "titleZh",
    "summary",
    "summaryZh",
    "conceptName",
    "conceptNameZh",
    "mode",
    "status",
  ].forEach((field) => assertNonEmptyString(article[field], `${article.id || "(missing id)"}.${field}`, errors));

  ["storyParagraphs", "storyParagraphsZh", "explanationParagraphs", "explanationParagraphsZh"].forEach((field) => {
    if (!Array.isArray(article[field]) || !article[field].length) {
      errors.push(`${article.id || "(missing id)"}.${field} must be a non-empty array`);
      return;
    }
    article[field].forEach((paragraph, index) => {
      assertNonEmptyString(paragraph, `${article.id || "(missing id)"}.${field}[${index}]`, errors);
    });
  });

  if (!planned) {
    errors.push(`${article.id} is not in topic-plan.tsv`);
    return;
  }
  if (article.batchId !== planned.batch_id) errors.push(`${article.id} batchId does not match plan`);
  if (article.categoryCode !== planned.category_code) errors.push(`${article.id} categoryCode does not match plan`);
  if (article.fieldCode !== planned.field_code) errors.push(`${article.id} fieldCode does not match plan`);
  if (article.fieldTitle !== planned.field_title_en) errors.push(`${article.id} fieldTitle does not match plan`);
  if (article.fieldTitleZh !== planned.field_title_zh) errors.push(`${article.id} fieldTitleZh does not match plan`);
  if (article.conceptName !== planned.concept_en) errors.push(`${article.id} conceptName does not match plan`);
  if (article.conceptNameZh !== planned.concept_zh) errors.push(`${article.id} conceptNameZh does not match plan`);
  if (article.mode !== planned.mode) errors.push(`${article.id} mode does not match plan`);

  const zhParagraphs = article.storyParagraphsZh?.length || 0;
  const enParagraphs = article.storyParagraphs?.length || 0;
  if (zhParagraphs < 4 || zhParagraphs > 8) errors.push(`${article.id} Chinese story has ${zhParagraphs} paragraphs; expected 4-8`);
  if (enParagraphs !== zhParagraphs) errors.push(`${article.id} paragraph mismatch: zh=${zhParagraphs}, en=${enParagraphs}`);
  if ((article.explanationParagraphsZh?.length || 0) !== (article.explanationParagraphs?.length || 0)) {
    errors.push(`${article.id} explanation paragraph mismatch`);
  }
  const storyBodyZh = (article.storyParagraphsZh || []).join("\n\n");
  const storyBody = (article.storyParagraphs || []).join("\n\n");
  if (storyBodyZh.length < 280 || storyBodyZh.length > 600) {
    warnings.push(`${article.id} Chinese story length is ${storyBodyZh.length}`);
  }
  const enWords = englishWordCount(storyBody);
  if (enWords < 170 || enWords > 360) warnings.push(`${article.id} English story word count is ${enWords}`);

  const zhRevealIndex = storyBodyZh.indexOf(article.conceptNameZh);
  const enRevealIndex = storyBody.toLowerCase().indexOf(article.conceptName.toLowerCase());
  if (zhRevealIndex >= 0) errors.push(`${article.id} reveals the Chinese concept inside the story body`);
  if (enRevealIndex >= 0) errors.push(`${article.id} reveals the English concept inside the story body`);
  if (article.titleZh.includes(article.conceptNameZh) || article.title.toLowerCase().includes(article.conceptName.toLowerCase())) {
    errors.push(`${article.id} title reveals the concept`);
  }

  const gate = article.qualityGate || {};
  if (article.status !== "approved") errors.push(`${article.id} status is ${article.status}`);
  if (gate.reviewRounds < 3) errors.push(`${article.id} has fewer than 3 review rounds`);
  if (gate.rewriteRounds < 2) errors.push(`${article.id} has fewer than 2 rewrite rounds`);
  if (gate.openCritical !== 0) errors.push(`${article.id} has open Critical issues`);
  if (gate.openMajor !== 0) errors.push(`${article.id} has open Major issues`);
}

function validateBatches(rows, errors, warnings) {
  const planById = new Map(rows.map((row) => [row.story_id, row]));
  const files = fs.existsSync(batchesDir)
    ? fs.readdirSync(batchesDir).filter((file) => /^batch-\d{3}\.json$/.test(file)).sort()
    : [];
  const articleIds = new Set();

  files.forEach((file) => {
    const payload = JSON.parse(fs.readFileSync(path.join(batchesDir, file), "utf8"));
    const expectedBatchId = file.replace(/\.json$/, "");
    if (payload.batchId !== expectedBatchId) errors.push(`${file} payload batchId is ${payload.batchId}`);
    if (!Array.isArray(payload.articles)) {
      errors.push(`${file} articles must be an array`);
      return;
    }
    payload.articles.forEach((article) => {
      if (articleIds.has(article.id)) errors.push(`duplicate article id across batches: ${article.id}`);
      articleIds.add(article.id);
      validateArticle(article, planById.get(article.id), errors, warnings);
    });
  });

  return { files, articleIds };
}

const progress = JSON.parse(fs.readFileSync(progressPath, "utf8"));
const rows = parsePlan();
const errors = [];
const warnings = [];

validatePlan(rows, progress, errors);
const batchResult = validateBatches(rows, errors, warnings);

const integratedRows = rows.filter((row) => row.status === "integrated");
const approvedRows = rows.filter((row) => row.status === "approved" || row.status === "integrated");
const nextPlannedRow = rows.find((row) => !["approved", "integrated"].includes(row.status));
if (progress.plannedTopics !== rows.length) errors.push(`progress plannedTopics is ${progress.plannedTopics}; expected ${rows.length}`);
if (progress.integrated !== integratedRows.length) errors.push(`progress integrated is ${progress.integrated}; plan has ${integratedRows.length}`);
if (progress.approved !== approvedRows.length) errors.push(`progress approved is ${progress.approved}; plan has ${approvedRows.length}`);
if (progress.draftedZh !== progress.approved || progress.translatedEn !== progress.approved) {
  errors.push("progress draftedZh and translatedEn must match approved at a completed checkpoint");
}
if (batchResult.articleIds.size !== progress.approved) {
  errors.push(`approved batch files contain ${batchResult.articleIds.size} articles; progress says ${progress.approved}`);
}
if (nextPlannedRow) {
  if (progress.currentBatch !== nextPlannedRow.batch_id) {
    errors.push(`currentBatch is ${progress.currentBatch}; expected ${nextPlannedRow.batch_id}`);
  }
  if (progress.nextStoryId !== nextPlannedRow.story_id) {
    errors.push(`nextStoryId is ${progress.nextStoryId}; expected ${nextPlannedRow.story_id}`);
  }
}

progress.batches.forEach((batch) => {
  const batchArticleCount = rows.filter((row) => row.batch_id === batch.id && ["approved", "integrated"].includes(row.status)).length;
  if (batch.approved !== batchArticleCount) errors.push(`${batch.id} approved count is ${batch.approved}; plan has ${batchArticleCount}`);
  const integratedCount = rows.filter((row) => row.batch_id === batch.id && row.status === "integrated").length;
  if (batch.integrated !== integratedCount) errors.push(`${batch.id} integrated count is ${batch.integrated}; plan has ${integratedCount}`);
  if (batch.status === "complete" && (batch.approved !== 15 || batch.integrated !== 15)) {
    errors.push(`${batch.id} is complete without 15 approved and integrated articles`);
  }
});

if (errors.length) {
  console.error(`Field fable validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  if (warnings.length) {
    console.error(`Warnings (${warnings.length}):`);
    warnings.forEach((warning) => console.error(`- ${warning}`));
  }
  process.exitCode = 1;
} else {
  console.log(`Topic plan: ${rows.length} topics across ${new Set(rows.map((row) => row.field_code)).size} fields.`);
  console.log(`Approved batch files: ${batchResult.files.length}; approved articles validated: ${batchResult.articleIds.size}.`);
  if (warnings.length) {
    console.log(`Warnings (${warnings.length}):`);
    warnings.forEach((warning) => console.log(`- ${warning}`));
  }
}
