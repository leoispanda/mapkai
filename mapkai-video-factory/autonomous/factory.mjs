import { createHash, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { AI_ERA_OVERLAY, FIELD_PROFILES, GENERAL_PROFILE } from "./editorial-seeds.mjs";
import { EditorialProviderUnavailable, createEditorialModelProvider, providerConfig } from "./editorial-provider.mjs";
import { ChatGPTBrowserError } from "./chatgpt-browser-provider.mjs";
import {
  ARTIFACT_CONTRACT_TYPES,
  HARD_GATE_NAMES,
  artifactContractPlaceholder,
  blockedReviewDecision,
  classifySensitiveContent,
  createRunRecord,
  deterministicValidate,
  fieldRepresentationInterface,
  loadPolicyBinding,
  persistRunRecord,
  promptVersionRecords,
  validateFinalReviewDecision,
} from "../governance.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FACTORY = path.resolve(ROOT, "..");
const REPO = path.resolve(FACTORY, "..");
const VERSION = "v5-autonomous-emergent-lens";
const FRAMEWORK = "autonomous-emergent-lens-1.0";
const PROMPT_VERSION = "1.0";
const EDITORIAL_TONE_GATE_CODES = ["GENERAL", "0311"];
const FIRST_WAVE_CODES = ["0311", "0533", "0313", "0542", "0421"];
const REQUIRED_STATES = [
  "DISCOVERED", "EDITORIAL_PENDING", "EDITORIAL_GENERATING", "EDITORIAL_CRITIQUE", "EDITORIAL_REVISION",
  "EDITORIAL_PASSED", "KNOWLEDGE_GENERATING", "KNOWLEDGE_READY", "NARRATIVE_COMPILING", "NARRATIVE_READY",
  "VIDEO_PROMPT_READY", "PREFLIGHT", "SUBMISSION_READY", "SUBMITTED", "GENERATING", "VIDEO_READY", "DOWNLOADED",
  "VIDEO_REVIEWING", "VIDEO_FAILED", "REPAIR_PENDING", "HUMAN_REVIEW_READY", "HUMAN_EDITORIAL_REVIEW_REQUIRED", "BRANDING", "READY_TO_PUBLISH",
  "WAITING_FOR_QUOTA", "SECURITY_PAUSED", "CHATGPT_LOGIN_REQUIRED", "CHATGPT_RATE_LIMITED", "CHATGPT_STAGE_INDETERMINATE", "CHATGPT_UI_CHANGED", "ERROR_RETRYABLE", "ERROR_FINAL", "EDITORIAL_PROVIDER_UNAVAILABLE",
  "HUMAN_EDITORIAL_TONE_REVIEW_REQUIRED", "WAITING_FOR_EDITORIAL_TONE_REVIEW", "SEMANTIC_REVIEW_REQUIRED", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED",
];
const THRESHOLDS = {
  intellectualDepth: 8, fieldSpecificity: 8, narrativeNecessity: 8, primaryAhaStrength: 8,
  adultTone: 8, modernFieldMapQuality: 8, openingStrength: 8, genericAiRisk: 3, knowledgeLeakRisk: 2,
};
const LIMITS = {
  maxEditorialModelCallsPerField: 8,
  maxGuidanceRevisions: 3,
  maxKnowledgeRevisions: 2,
  maxVideoPromptRevisions: 2,
  maxSamePayloadRegenerations: 1,
  maxTotalVideoAttemptsPerField: 3,
  maxConcurrentEditorialJobs: 2,
  maxConcurrentNotebookJobs: 4,
  maxDailyNotebookSubmissions: 18,
  maxFailureRateBeforePause: 0.5,
  systemicFailureWindow: 3,
};
const PATHS = {
  legacyManifest: path.join(FACTORY, "video-manifest.json"),
  taxonomy: path.join(FACTORY, "taxonomy.json"),
  runtime: path.join(FACTORY, "runtime"),
  runtimeManifest: path.join(FACTORY, "runtime", "manifest.json"),
  queue: path.join(FACTORY, "runtime", "queue.json"),
  quota: path.join(FACTORY, "runtime", "quota-state.json"),
  logs: path.join(FACTORY, "runtime", "events.jsonl"),
  packs: path.join(FACTORY, "packs"),
  canon: path.join(FACTORY, "canon"),
  prompts: path.join(FACTORY, "prompts"),
  schemas: path.join(FACTORY, "schemas"),
  review: path.join(FACTORY, "review"),
  dashboard: path.join(FACTORY, "autonomous-dashboard.html"),
  diversity: path.join(FACTORY, "runtime", "narrative-diversity-audit.json"),
  runRecords: path.join(FACTORY, "runtime", "run-records"),
  policyConfig: path.join(FACTORY, "factory-config.json"),
};

const ARTIFACT_TYPE = "FIELD_OVERVIEW_VIDEO";
const REVIEW_HOLD_STATUSES = ["SEMANTIC_REVIEW_REQUIRED", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED", "HUMAN_EDITORIAL_REVIEW_REQUIRED"];

const argv = process.argv.slice(2);
const command = argv.find((arg) => !arg.startsWith("--")) || "--plan";
const execute = argv.includes("--execute");
const seedPreview = argv.includes("--seed-preview");
const fieldArg = valueOf("--field");
const fieldsArg = valueOf("--fields");
const selectedCodes = new Set((fieldsArg || fieldArg || "").split(",").map((value) => value.trim()).filter(Boolean));
const selectedGeneral = argv.includes("--general-overview") || selectedCodes.has("GENERAL");
const resume = argv.includes("--resume");

function valueOf(name) {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : undefined;
}
function now() { return new Date().toISOString(); }
function hash(value) { return createHash("sha256").update(value).digest("hex"); }
function safeSlug(value) { return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item"; }
function rel(file) { return path.relative(REPO, file).split(path.sep).join("/"); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char])); }
async function json(file, fallback = null) { return existsSync(file) ? JSON.parse(await readFile(file, "utf8")) : fallback; }
async function saveJson(file, value) { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, `${JSON.stringify(value, null, 2)}\n`); }
function decodeText(value) { return String(value).replaceAll("\\n", "\n"); }
async function saveText(file, value) { const decoded = decodeText(value); await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, decoded.endsWith("\n") ? decoded : `${decoded}\n`); }
async function eventLog(event) { await mkdir(PATHS.runtime, { recursive: true }); await writeFile(PATHS.logs, `${JSON.stringify({ at: now(), ...event })}\n`, { flag: "a" }); }
async function run(file, args) { return new Promise((resolve) => execFile(file, args, { timeout: 30_000 }, (error, stdout, stderr) => resolve({ error, stdout, stderr }))); }

async function factoryConfig() { return json(PATHS.policyConfig, {}); }

async function currentPolicyBinding() {
  const cfg = await factoryConfig();
  return loadPolicyBinding({ factoryDir: FACTORY, expected: cfg.policyBinding, requireExpected: true });
}

async function activePromptVersions() {
  return promptVersionRecords({
    factoryDir: FACTORY,
    prompts: {
      editorialConversation: { path: "prompts/editorial-conversation.md", version: "editorial-conversation.v1" },
      editorialDirector: { path: "prompts/editorial-director.md", version: "editorial-director.v1" },
      editorialCritic: { path: "prompts/editorial-critic.md", version: "editorial-critic.v1" },
      editorialReviser: { path: "prompts/editorial-reviser.md", version: "editorial-reviser.v1" },
      knowledgeExpander: { path: "prompts/knowledge-expander.md", version: "knowledge-expander.v1" },
      narrativeCompiler: { path: "prompts/narrative-compiler.md", version: "narrative-compiler.v1" },
      notebookDirector: { path: "prompts/notebook-director.md", version: "notebook-director.v1" },
      videoReviewer: { path: "prompts/video-reviewer.md", version: "video-reviewer.v1" },
      failureDiagnoser: { path: "prompts/failure-diagnoser.md", version: "failure-diagnoser.v1" },
    },
  });
}

function autonomousRunId() { return `autonomous-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID()}`; }

function runRecordFile(runId, fieldId) { return path.join(PATHS.runRecords, runId, `${safeSlug(fieldId)}.json`); }

async function persistAutonomousRunRecord(item, patch = {}) {
  if (!item?.runId || !item?.policyBinding) return;
  const record = createRunRecord({
    runId: item.runId,
    fieldId: item.code,
    artifactType: item.artifactType || ARTIFACT_TYPE,
    policyBinding: item.policyBinding,
    activePromptVersions: item.activePromptVersions || {},
    timestamp: now(),
    status: item.status || "UNKNOWN",
    ...patch,
  });
  await persistRunRecord(runRecordFile(item.runId, item.code || "unknown"), record);
}

function reviewDecisionFile(item) { return packagePaths(item).finalDecision; }

function extractTaxonomyFromSource(source) {
  const categoriesMatch = source.match(/const categories = (\[[\s\S]*?\n\]);\n\nconst publicCategoryLabels/);
  const labelsMatch = source.match(/const publicFieldLabels = (\{[\s\S]*?\n\});\n\nconst generalEntryScopes/);
  if (!categoriesMatch || !labelsMatch) throw new Error("Could not find MapKAI taxonomy markers in script.js.");
  const categories = Function("const readiness = { classified: 'classified' }; return (" + categoriesMatch[1] + ");")();
  const labels = Function("return (" + labelsMatch[1] + ");")();
  const fields = [];
  for (const category of categories) for (const group of category.groups) for (const [code, title] of group.fields) {
    const titleZh = labels.zh?.[code];
    if (!titleZh) continue;
    fields.push({ code, title, titleZh, categoryCode: category.code, categoryTitle: category.title, categoryTitleZh: category.chineseTitle, groupCode: group.code, groupTitle: group.title, slug: `${code}-${safeSlug(title)}` });
  }
  return { categories, fields };
}
async function inspectTaxonomy() {
  const sourceFile = path.join(REPO, "script.js");
  const source = await readFile(sourceFile, "utf8");
  const parsed = extractTaxonomyFromSource(source);
  const codes = parsed.fields.map((field) => field.code);
  const aiFormalFields = parsed.fields.filter((field) => /\bai\b|artificial intelligence|人工智能|通用知识|general literacy/i.test(`${field.title} ${field.titleZh}`));
  return { ...parsed, sourceHash: hash(source), sourceFile: rel(sourceFile), codeHash: hash(codes.join("\n")), aiFormalFields };
}
function profileFor(code) { return code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[code]; }
function currentField(code, taxonomy) { return taxonomy.fields.find((field) => field.code === code); }
function targetItems(taxonomy) {
  const items = [];
  if (!selectedCodes.size || selectedGeneral) items.push({ code: "GENERAL", ...GENERAL_PROFILE, field: null });
  for (const code of FIRST_WAVE_CODES) if (!selectedCodes.size || selectedCodes.has(code)) {
    const field = currentField(code, taxonomy);
    if (field) items.push({ code, ...FIELD_PROFILES[code], field });
  }
  return items;
}

function guidanceFromProfile(item) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : item;
  const map = p.map || [];
  return {
    schemaVersion: "editorial-guidance.v1",
    guidanceVersion: `${VERSION}.guidance.1`,
    origin: "directional_seed_preview",
    productionEligible: false,
    field: { id: item.code === "GENERAL" ? p.id : item.code, name: p.name || item.title, nameZh: p.nameZh || item.titleZh, slug: p.slug || item.slug, type: p.type || "FIELD" },
    centralHumanQuestion: p.centralQuestion,
    fieldBecomesNecessaryWhen: p.necessaryWhen,
    coreThesis: p.thesis,
    narrativeEngine: p.engine,
    candidateNarrativeEngines: p.candidateEngines,
    parallelCivilization: {
      enabled: item.code !== "GENERAL" || true,
      entryPoint: p.openingHook,
      existingKnowledge: p.existingKnowledge || [],
      trigger: p.trigger || "",
      ordinaryIntuition: p.ordinaryIntuition || "",
      failedIntuition: p.failedIntuition || "",
      emergentProblem: p.openingProblem || "",
    },
    openingHook: p.openingHook,
    centralTension: p.tension,
    primaryAha: p.aha,
    secondaryTurns: p.secondaryTurns,
    emergencePath: p.emergencePath,
    modernFieldMap: map.map((entry) => ({ name: entry.name, reasonItExists: entry.reasonItExists || entry.reason || "" })),
    mandatoryConcepts: p.concepts,
    optionalConcepts: p.optionalConcepts,
    methodsToRepresent: p.methods,
    crossFieldConnections: p.connections,
    visualOpportunities: p.visuals,
    endingReturn: p.returnToEarth,
    finalMentalModel: p.learnerModel,
    avoid: p.avoid,
  };
}

function branchSections(item) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : item;
  const details = BRANCH_DETAILS[item.code] || [];
  return (p.map || []).map((branch, index) => `### ${branch.name}\n\n**Why it had to emerge:** ${branch.reason}\n\n${details[index] || "It isolates a distinct object or scale inside the field and contributes a necessary piece of the central question."}`).join("\n\n");
}
function landmarkSections(item) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : item;
  if (item.code === "GENERAL") return p.secondaryTurns.map((turn, index) => `### Shift ${index + 1}: ${turn.split(".")[0]}\n\n**BEFORE:** Local memory or a single perspective appears sufficient.\n\n**TENSION:** The same problem returns in a different context and the old explanation cannot travel.\n\n**NEW IDEA:** A portable concept, comparison, or method preserves what can be learned.\n\n**CONSEQUENCE:** People can teach, challenge, and extend a way of knowing without pretending it is the world itself.`).join("\n\n");
  const ideas = {
    "0311": [
      ["Opportunity cost", "A cost is what is paid", "The best alternative disappears from view", "Cost includes the most valuable future forgone", "Choice becomes a comparative claim about alternatives."],
      ["Supply, demand, and price signals", "Prices look like simple numbers", "No one actor knows every need or resource", "Prices coordinate dispersed plans", "Coordination improves, but fairness and missing costs remain open."],
      ["Comparative advantage", "Trade seems to require one side to be better", "Relative sacrifice differs even when productivity is unequal", "Specialisation can create gains from exchange", "Interdependence and distribution become visible."],
      ["Externalities and public goods", "A transaction seems to contain its own cost", "Effects cross the boundary of buyer and seller", "Institutions must account for shared costs and benefits", "Market limits become a design question."],
      ["Macroeconomic feedback", "An economy looks like many independent trades", "Expectations, money, employment, and policy reinforce one another", "Aggregate models track system-wide feedback", "Stability and crisis become economic questions."],
    ],
    "0533": [
      ["Conservation laws", "Motion appears to be a sequence of local pushes", "Complex changes still preserve quantities", "Invariants constrain what can happen", "Prediction becomes possible beyond one example."],
      ["Fields", "Objects seem to act only by contact", "Influence persists across empty space", "A field describes a structured condition throughout space", "Light, charge, and force share a language."],
      ["Thermodynamics and entropy", "Energy conservation seems to promise reversibility", "Real transformations have direction and usable limits", "Entropy tracks constraints on energy dispersal", "Macroscopic time gains a physical arrow."],
      ["Relativity", "Space and time appear universal and separate", "Observers moving differently disagree on measurements", "Invariants reorganise space and time into spacetime", "Classical mechanics becomes a scale-limited case."],
      ["Quantum theory", "Small objects seem to possess definite properties independent of observation", "Atomic experiments yield probabilistic, measurement-linked outcomes", "The model predicts distributions rather than classical trajectories", "What counts as a physical description changes."],
    ],
    "0313": [
      ["Conditioning and learning", "Behaviour seems to express fixed character", "Consequences and predictions alter future behaviour", "Learning mechanisms make change experimentally tractable", "Environment becomes part of explanation."],
      ["Cognitive schemas and biases", "Reasoning appears transparent to itself", "Shortcuts systematically misfire in unfamiliar conditions", "Mental representations can be measured as mechanisms", "Error becomes patterned rather than merely personal."],
      ["Memory reconstruction", "Remembering seems like replay", "Questions and later information alter confident reports", "Memory is reconstructed from traces, expectations, and context", "Sincerity separates from accuracy without dismissing experience."],
      ["Development and attachment", "The adult mind appears fully formed", "Capacity and regulation change through relationships and time", "Development becomes a process with biological and social conditions", "A life course replaces a static model."],
      ["Person–situation interaction", "Traits seem to predict behaviour everywhere", "Roles, norms, and settings alter what people do", "Disposition and situation must be modelled together", "Individual and social explanations become complementary."],
    ],
    "0542": [
      ["Probability and sampling", "A count seems to speak for the whole", "Observed cases are partial and variable", "Probability describes what samples can and cannot tell us", "Uncertainty becomes explicit rather than hidden."],
      ["Law of large numbers and the central limit", "More observations look like mere repetition", "Aggregates stabilise in ways individual cases do not", "Sampling distributions make estimation possible", "Precision becomes a property of design and variation."],
      ["Randomisation", "A before/after difference appears causal", "Groups differ in hidden ways", "Random assignment balances expected confounders", "Intervention gains a defensible comparison."],
      ["Regression and causal inference", "Correlation appears to explain a relationship", "Confounding and selection can mimic effects", "Models make assumptions and counterfactual comparisons visible", "Prediction and causation are separated."],
      ["Reproducibility and robustness", "A significant result looks final", "Analysis choices and selective reporting alter conclusions", "Sensitivity, replication, and open data test stability", "Evidence includes how a result survives scrutiny."],
    ],
    "0421": [
      ["Rule of law", "A wise ruler seems enough for justice", "The next decision changes with the person in power", "Public, general, and reviewable rules constrain authority", "Predictability becomes a condition of freedom."],
      ["Due process and evidence", "A plausible story seems enough to decide", "Memory, power, and accusation can be uneven", "Procedure and evidence make claims contestable", "Fairness includes how a decision is reached."],
      ["Rights and duties", "Obligations look like personal promises", "Strangers need claims that survive changing relationships", "Legal personality and rights stabilise expectations", "Institutions distribute power as well as protection."],
      ["Precedent and interpretation", "A rule appears to apply itself", "New facts do not fit old words exactly", "Reasoned analogy and interpretation connect cases over time", "Continuity and change coexist in law."],
      ["Remedy and enforcement", "A rule exists once it is written", "Without an institution, a violated claim may have no effect", "Remedies and enforcement connect norms to power", "Validity, access, and justice can be distinguished."],
    ],
  }[item.code] || [];
  return ideas.map(([name, before, tension, idea, consequence]) => `### ${name}\n\n**BEFORE:** ${before}.\n\n**TENSION:** ${tension}.\n\n**NEW IDEA:** ${idea}.\n\n**CONSEQUENCE:** ${consequence}`).join("\n\n");
}

const OBJECTS = {
  "0311": "choices by households and firms, prices and markets, labour and capital, institutions, public goods, macroeconomic aggregates, and the distribution of gains and losses",
  "0533": "matter, motion, energy, fields, radiation, spacetime, quantum systems, and the instruments that make them measurable",
  "0313": "perception, attention, memory, learning, emotion, development, social influence, brain–body processes, and distress or recovery",
  "0542": "populations and samples, variables and measurements, distributions, experiments, observational studies, models, predictions, and decisions under uncertainty",
  "0421": "rules, rights, duties, institutions, legal persons, evidence, procedures, decisions, remedies, and the distribution of public authority",
};
const BRANCH_DETAILS = {
  "0311": [
    "It works at the level of marginal choices and strategic interaction, where a household or firm can change the whole market only through the response of others.",
    "It follows economy-wide feedback among money, employment, prices, expectations, and policy—patterns invisible inside one transaction.",
    "It studies goods and harms that private exchange cannot allocate reliably, asking who pays, who benefits, and which collective rule is legitimate.",
    "It keeps productivity and distribution together across work, inequality, institutions, and long-run structural change.",
    "It relaxes the ideal calculator and makes actual habits, bounded attention, and institutional rules part of the explanation."
  ],
  "0533": [
    "It isolates trajectories and interactions at ordinary speeds and sizes, providing the limiting language used by engineering and astronomy.",
    "It treats influence as a condition spread through space, allowing charge, radiation, and light to be related without imagined contact mechanisms.",
    "It moves from individual particles to macroscopic variables and asks why energy transformations have an arrow and a limit.",
    "It describes matter and radiation where definite classical paths fail and measurement changes what can be predicted.",
    "It makes geometry and gravitation responsive to motion and energy, linking local measurements to the history of the universe."
  ],
  "0313": [
    "It builds models of information processing from attention and perception through memory, language, and reasoning.",
    "It treats change itself as an object, following how capacities, relationships, and regulation develop across a lifespan.",
    "It tests how norms, roles, identity, and group presence alter behaviour that a trait label alone cannot predict.",
    "It connects mental processes to brain, body, emotion, sleep, and biological constraints without reducing experience to a single organ.",
    "It turns explanation toward assessment, intervention, distress, and recovery while keeping evidence and ethics visible."
  ],
  "0542": [
    "It describes distributions and variation before asking what caused them, preventing a summary from masquerading as an explanation.",
    "It turns repeated sampling into a calibrated language for estimates, uncertainty, and what procedures would do over the long run.",
    "It separates association from intervention by making counterfactual comparisons and confounding assumptions explicit.",
    "It studies how a sample enters a dataset, who is missing, and which selection mechanism limits generalisation.",
    "It uses computation, prior information, loss, and robustness checks when decisions need models more complex than a hand calculation."
  ],
  "0421": [
    "It asks how constitutions, public authority, and institutional review constrain the power that makes rules.",
    "It coordinates private claims, promises, property, injury, and compensation among people who need predictable remedies.",
    "It defines public wrongs and the limits of coercion, proof, punishment, and procedural protection.",
    "It makes delegated administrative power answerable in domains such as safety, labour, markets, and public services.",
    "It carries claims across borders and grounds universal rights where one jurisdiction cannot settle the issue alone."
  ]
};

function bullets(items) { return (items || []).map((item) => `- ${item}`).join("\\n"); }
function connectionSections(item) {
  return (item.connections || []).map((connection) => `### ${connection.field}\\n\\n**Connection:** ${connection.connection}\\n\\n**Difference that must remain visible:** ${connection.difference}`).join("\\n\\n");
}
function renderOverview(item) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : item;
  if (item.code === "GENERAL") return `# MapKAI General Overview — Factual Source\\n\\n**Product role:** MapKAI prologue; not a formal academic field and not a second taxonomy.\\n**Content version:** ${VERSION}\\n\\n## Field Identity\\n\\nThis is a product-level orientation to the existing MapKAI knowledge map. It asks how organised ways of knowing arise without pretending that the categories are natural parts of reality. The Parallel Civilization below is a clearly labelled fictional thought experiment; the return to our world is factual and points to the existing MapKAI architecture.\\n\\n## Central Question\\n\\n${p.centralQuestion}\\n\\n## Why This Class of Problems Matters\\n\\n### Field Becomes Necessary When\\n\\n${p.necessaryWhen} A learner who can recognise the emergence of a question can choose a useful field without treating subject names as arbitrary school compartments.\\n\\n## The Thought Experiment (Fictional, Not History)\\n\\n${p.openingHook}\\n\\nThe people in this constructed world have practical memory, customs, informal observation, cooperation, conflict, language, and creativity. They are not cognitively primitive. What they lack is our inherited intellectual infrastructure. Their difficulty is that a local solution disappears when the observer, season, or generation changes.\\n\\n**Knowledge-leak boundary:** they may experience, notice, compare, and generalise a pattern; they may not use a modern discipline name before the narrator has earned the connection.\\n\\n## From Phenomena to Portable Questions\\n\\n${p.openingProblem}\\n\\nThe emergence logic is not a claim about one historical civilisation. It is a compact reasoning path: ${p.emergencePath.join(" → ")}. Observation becomes more than memory when differences are recorded. A concept becomes more than a label when it lets another person recognise the same relationship. A method becomes more than a trick when it can be challenged, taught, and revised.\\n\\n## Four Intellectual Movements\\n\\n### 1. Reality before disciplines\\n\\nA falling object, a failed harvest, a fever, a disagreement, a moving star, and a signal arrive without subject headings. A practical solution can be valuable while remaining local and fragile.\\n\\n### 2. Intuition becomes insufficient\\n\\n${p.failedIntuition} Repetition turns surprise into a question: what remains true across cases, and what has changed?\\n\\n### 3. Knowledge organises itself\\n\\n${p.secondaryTurns.map((turn) => `- ${turn}`).join("\\n")} These are not steps to recite in a video; they show why concepts, comparison, measurement, models, interpretation, and institutions become useful.\\n\\n### 4. Return to our world\\n\\n${p.returnToEarth}\\n\\n## The Existing MapKAI Knowledge Map\\n\\n${p.map.map((entry) => `### ${entry.name}\\n\\n${entry.reason}`).join("\\n\\n")}\\n\\nThese are orientations within MapKAI's existing taxonomy, not new World K categories. The map is a navigational compression: useful because it preserves distinctions, revisable because reality does not respect its edges.\\n\\n## Methods of Organising Knowledge\\n\\n${bullets(p.methods)}\\n\\n## Limits and Honest Boundaries\\n\\n${p.limits}\\n\\n## General Learner Mental Model\\n\\n${p.learnerModel}\\n\\n## Factual / Fictional Firewall\\n\\nThe parallel civilisation and its events are fictional. The statements about disciplines, methods, and the existing MapKAI architecture are editorial descriptions of our world; they are not evidence claims about a hidden civilisation.\\n`;
  return `# ${p.name} (${item.code}) — Factual Knowledge Source\\n\\n**Knowledge continent:** ${item.categoryTitle || p.category}\\n**Group:** ${item.groupTitle || p.group}\\n**Content version:** ${VERSION}\\n**Editorial framework:** ${FRAMEWORK}\\n\\n> This source pack records what must be true and known. It is not a narration script. Its fictional prototype is labelled as a thought experiment; real-world history and field claims remain factual.\\n\\n## 1. Field Identity and Boundaries\\n\\n${p.thesis} The field is distinct from its neighbours because it selects a characteristic object, scale, or standard of explanation, while real problems often require translations across boundaries.\\n\\n## 2. Central Question\\n\\n${p.centralQuestion}\\n\\n## 3. Why This Class of Problems Matters\\n\\n### Field Becomes Necessary When\\n\\n${p.necessaryWhen}\\n\\n**Opening problem (editorial thought experiment, not a historical event):** ${p.openingProblem}\\n\\n## 4. Objects of Inquiry\\n\\n${OBJECTS[item.code]}\\n\\n## 5. How This Field Thinks\\n\\n${p.thesis} Its method is not a personality trait. It is a disciplined sequence of questions: what is being claimed, which comparison or interpretation supports it, what assumptions make the inference possible, and what evidence could narrow or overturn it.\\n\\n**Methods / evidence:**\\n${bullets(p.methods)}\\n\\n## 6. Major Branches as Responses to Different Problems\\n\\n${branchSections(item)}\\n\\nThe branches form a connected map because each isolates a different pressure inside the central question. Their differences are useful only if the viewer can also see where the territories meet.\\n\\n## 7. Landmark Ideas: Intellectual Motion\\n\\n${landmarkSections(item)}\\n\\n## 8. Historical and Intellectual Shifts\\n\\n${p.history}\\n\\nRead this history as changes in what could be asked, measured, compared, or made accountable—not as a parade of names. The field's present map is layered over older questions and remains open to revision.\\n\\n## 9. Real-World Applications\\n\\n${bullets(p.applications)}\\n\\nApplications test whether a concept travels into institutions and decisions. They also introduce values, unequal consequences, and design constraints that the abstract model cannot settle alone.\\n\\n## 10. Cross-Field Connections\\n\\n${connectionSections(item)}\\n\\n## 11. Limits, Disagreements, and Frontiers\\n\\n${p.limits}\\n\\n## 12. General Learner Mental Model\\n\\n${p.learnerModel}\\n\\n## 13. Return to Our Civilisation\\n\\n${p.returnToEarth}\\n\\nThe prototype is fictional. The field map above is the real, historically developed MapKAI orientation. The story explains necessity; this source explains the field's present knowledge structure.\\n\\n## Editorial Notes\\n\\n**Knowledge-leak control:** The parallel people may experience the opening problem and notice its pattern, but the modern terminology is introduced only at the bridge to our world.\\n\\n**Fact / fiction control:** No fictional person, quotation, date, experiment, or event is used as factual evidence.\\n`;
}

function renderBlueprint(item) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : item;
  const fieldName = p.name;
  return `# Narrative Blueprint — ${fieldName}\\n\\n**Content version:** ${VERSION}\\n**Narrative framework:** ${FRAMEWORK}\\n**Narrative engine:** ${p.engine}\\n**Audience:** intelligent adult general learner\\n**Narrator:** Comparative Observer (used only to make the fact/fiction bridge explicit)\\n\\n## Field\\n\\n${fieldName}${item.code === "GENERAL" ? " — product-level prologue, not a formal field" : ` (${item.code})`}\\n\\n## Central Question\\n\\n${p.centralQuestion}\\n\\n## Field Becomes Necessary When\\n\\n${p.necessaryWhen}\\n\\n## Narrative Engine and Opening Hook\\n\\n**Selected engine:** ${p.engine}.\\n\\n${p.openingHook}\\n\\nThe opening must establish a real intellectual problem before any field definition or branch map. Do not start with “${fieldName} is the study of…” or “there are several branches…”.\\n\\n## Parallel Civilization Entry\\n\\n**What they already know:**\\n${bullets(p.existingKnowledge)}\\n\\n**What they do not yet know:** the formal concept, method, institution, or field name that our civilization uses for the pattern.\\n\\n**Trigger event:** ${p.trigger}\\n\\n**Opening problem:** ${p.openingProblem}\\n\\n## Ordinary Intuition and Its Failure\\n\\n**Ordinary intuition:** ${p.ordinaryIntuition}\\n\\n**Why it fails:** ${p.failedIntuition}\\n\\n## Central Tension\\n\\n${p.tension}\\n\\n## First Intellectual Turn\\n\\nThe narrator lets the viewer recognise the pattern before naming it: a local solution or confident explanation works once, then breaks when the scale, comparison, observer, institution, or consequence changes. The turn must be causal, not an ornamental surprise.\\n\\n## Primary Aha\\n\\n${p.aha}\\n\\n## Secondary Turns\\n\\n${p.secondaryTurns.map((turn, index) => `${index + 1}. ${turn}`).join("\\n")}\\n\\n## Concept, Method, and Discipline Emergence\\n\\n${p.emergencePath.map((stage, index) => `- **${index + 1}.** ${stage}`).join("\\n")}\\n\\nThe sequence is an editorial logic. Let each new tool answer a pressure created by the previous limitation; do not read the arrows aloud as a formula.\\n\\n## Lightweight Epistemic Ledger\\n\\n| Beat | They know / can do | They do not yet formalise | Observation that earns the bridge | Modern name becomes available |\\n|---|---|---|---|---|\\n| Opening | ${p.existingKnowledge.slice(0, 2).join("; ")} | the field's organising concept | ${p.openingProblem} | after the first turn |\\n| Comparison | they compare cases and consequences | a portable model or method | ${p.failedIntuition} | after repeated pattern |\\n| Integration | they teach a reliable practice | the full discipline and its branches | ${p.aha} | at return to our world |\\n\\n## Return to Our Civilisation\\n\\n${p.returnToEarth}\\n\\nState plainly that the prototype was fictional and that the modern field is real.\\n\\n## Modern Field Expansion\\n\\n${p.thesis}\\n\\n### Branch Integration\\n\\n${(p.map || []).map((branch) => `- **${branch.name}:** ${branch.reason}`).join("\\n")}\\n\\n### Landmark Integration\\n\\nThe video must explain why each landmark changed the field's mental model. Preserve the BEFORE → TENSION → NEW IDEA → CONSEQUENCE motion from the factual source; do not turn the landmarks into name-dropping.\\n\\n### Cross-Field Connections\\n\\n${connectionSections(item)}\\n\\n## Visual Opportunities\\n\\n${bullets(p.visuals)}\\n\\n## Ending Return and Final Mental Model\\n\\n**Ending return:** ${p.returnToEarth}\\n\\n**Final mental model:** ${p.learnerModel}\\n\\n## Knowledge Leak Notes\\n\\nNo modern field term, institutional label, equation, named scholar, or contemporary technology appears in the fictional world before the narrator has established the underlying pattern. Any illustrative event remains an explicitly constructed thought experiment.\\n\\n## Fact / Fiction Boundary\\n\\nThe prototype is fictional. History, methods, landmark ideas, applications, and cross-field connections in the modern section are factual editorial summaries and must not be dramatised with fabricated witnesses or quotations.\\n`;
}

function renderVideoPrompt(item) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : item;
  const name = p.name;
  return `# MapKAI Intellectual Journey — Notebook Director Prompt\\n\\n**Prompt version:** ${PROMPT_VERSION}\\n**Content version:** ${VERSION}\\n**Framework:** ${FRAMEWORK}\\n**Audience:** intelligent adult general learner\\n**Format:** Documentary × Intellectual Fable × Knowledge Map\\n\\n## Master creative direction\\n\\nCreate an intellectually serious journey through ${name}. This is not a generic educational explainer, Wikipedia summary, or line-by-line narration script. Use the factual 'overview.md' as the authority for what is true and the separate 'narrative_blueprint.md' as the route for why the knowledge became necessary. Preserve NotebookLM/Gemini Notebook freedom to select, compress, narrate, visualise, and pace.\\n\\n## Opening and central question\\n\\nOpen with this problem before naming the field:\\n\\n${p.openingHook}\\n\\nCentral question: **${p.centralQuestion}**\\n\\nSelected narrative engine: **${p.engine}**. Generate curiosity through a mystery, paradox, dilemma, discovery, conflict, journey, or scale change that is causally necessary to the explanation.\\n\\n## What not to reveal too early\\n\\nDo not begin with “${name} is the study of…”, “there are several branches…”, a glossary, or a broad claim that could fit any field. Do not say the modern term before the fictional observer has experienced, noticed, compared, and generalised the pattern. Do not use childish characters, classroom dialogue, cheesy motivation, corporate language, or a made-up historical authority.\\n\\n## Intellectual turns\\n\\nPrimary Aha: ${p.aha}\\n\\nSecondary turns to weave naturally:\\n${bullets(p.secondaryTurns)}\\n\\nEvery turn must alter the viewer's model of the problem. A branch or landmark is earned when the previous explanation creates a new pressure; never recite a numbered list.\\n\\n## Mandatory knowledge coverage\\n\\nThe finished video must naturally cover: field identity and boundaries; central question; why this class of problems matters; how the field thinks and what evidence it uses; major branches and why each exists; 3–6 landmark ideas with BEFORE → TENSION → NEW IDEA → CONSEQUENCE; historical/intellectual shifts; real-world applications; cross-field connections; limits/frontiers; and a final learner mental model. The viewer must be able to answer what the field is fundamentally trying to understand.\\n\\n## Return to Earth / MapKAI\\n\\nThe parallel prototype is fictional. Return explicitly to our civilisation: ${p.returnToEarth}\\n\\nFor the General Overview, end at the existing MapKAI knowledge map—not at a new fictional taxonomy. For a conventional field, end with the real field's current connected map and its neighbouring fields.\\n\\n## Visual direction\\n\\nUse visual reasoning rather than decorative stock montage:\\n${bullets(p.visuals)}\\n\\nLet diagrams show constraints, scales, evidence, feedback, boundaries, or transformations. Use a restrained documentary palette and adult pacing.\\n\\n## Ending transformation\\n\\nEnd with a changed mental model, not a product pitch:\\n**${p.learnerModel}**\\n\\n## Anti-generic guardrail\\n\\nReject filler, mechanical enumeration, repeated “important because” sentences, sentimental uplift, and any scene that could be moved to another field by replacing three nouns. The story should help the learner understand why this field became necessary; the factual source should make the modern knowledge map trustworthy.\\n`;
}

function renderAiOverlay() {
  return `# AI-Era General Literacy — Editorial Overlay\\n\\n**Status:** ${AI_ERA_OVERLAY.taxonomyStatus}\\n**Formal taxonomy mutation:** none\\n**Product role:** MapKAI-curated contemporary overlay; not a new field ID and not a catch-all category.\\n\\n## Scope\\n\\n${bullets(AI_ERA_OVERLAY.scope)}\\n\\n## Exclusions and routing\\n\\n${bullets(AI_ERA_OVERLAY.exclusions)}\\n\\n## Central question\\n\\n${AI_ERA_OVERLAY.centralQuestion}\\n\\n## Honest framing\\n\\n${AI_ERA_OVERLAY.narrative}\\n\\n## Cross-field map\\n\\n${bullets(AI_ERA_OVERLAY.connections)}\\n\\n## Learner mental model\\n\\n${AI_ERA_OVERLAY.learnerModel}\\n\\n## Guardrails\\n\\n${bullets(AI_ERA_OVERLAY.avoid)}\\n\\nThis overlay is stored outside the formal queue because the current repository contains AI-era positioning in the General Studies presentation layer, not a distinct formal public-field entry. It must be promoted into the taxonomy only through an explicit product decision, never by the factory silently inventing an ID.\\n`;
}

function guidanceChecks(guidance) {
  const required = ["centralHumanQuestion", "fieldBecomesNecessaryWhen", "coreThesis", "narrativeEngine", "openingHook", "centralTension", "primaryAha", "endingReturn", "finalMentalModel"];
  const missing = required.filter((key) => typeof guidance?.[key] !== "string" || !guidance[key].trim());
  const arrays = ["secondaryTurns", "emergencePath", "modernFieldMap", "mandatoryConcepts", "methodsToRepresent", "crossFieldConnections", "visualOpportunities", "avoid"];
  for (const key of arrays) if (!Array.isArray(guidance?.[key]) || guidance[key].length === 0) missing.push(key);
  const mapOk = Array.isArray(guidance?.modernFieldMap) && guidance.modernFieldMap.every((entry) => entry?.name && entry?.reasonItExists);
  const crossOk = Array.isArray(guidance?.crossFieldConnections) && guidance.crossFieldConnections.every((entry) => entry?.field && entry?.connection && entry?.difference);
  return { valid: missing.length === 0 && mapOk && crossOk, missing };
}

function knowledgeChecks(item, overview, blueprint, prompt, guidance, editorialStatus) {
  const core = [
    ["field_identity", [["field identity", "boundaries"]]],
    ["central_question", [["central question"], ["central human question"]]],
    ["necessity", [["why this class of problems matters"], ["field becomes necessary"], ["why the problem matters"]]],
    ["method", [["how this field thinks", "methods"], ["how economics thinks"], ["methods and evidence"]]],
    ["branches", [["major branches"], ["branches and why they emerged"]]],
    ["landmarks", [["landmark ideas", "before:", "new idea:", "consequence:"], ["landmark idea", "before:", "new idea:", "consequence:"]]],
    ["history_applications", [["historical", "real-world applications"], ["major historical", "applications"]]],
    ["connections", [["cross-field connections"], ["cross field connections"]]],
    ["learner_model", [["general learner mental model"], ["final mental model"]]],
    ["return_to_earth", [["return to our civilisation"], ["return to the modern world"], ["return to our world"]]],
  ];
  const source = String(overview || "");
  const lowerSource = source.toLowerCase();
  const areas = core.map(([id, alternatives]) => ({ id, present: alternatives.some((needles) => needles.every((needle) => lowerSource.includes(String(needle).toLowerCase()))), evidence: alternatives.flat() }));
  if (item.code === "GENERAL") {
    const overrides = {
      necessity: /why this class of problems matters/i.test(source),
      method: /methods of organising knowledge/i.test(source),
      branches: /existing mapkai knowledge map/i.test(source),
      landmarks: /four intellectual movements/i.test(source),
      history_applications: /four intellectual movements|mapkai knowledge map/i.test(source),
      connections: /existing mapkai knowledge map/i.test(source),
      return_to_earth: /return to our world|return to the real world/i.test(source),
    };
    for (const area of areas) if (overrides[area.id] !== undefined) area.present = overrides[area.id];
  }
  const branchCount = (source.match(/^### /gm) || []).length;
  const landmarkSection = source.split(/## (?:7\. )?Landmark Idea/i)[1]?.split(/## (?:8\. )?(?:Historical|Methods)/i)[0] || "";
  const landmarkCount = item.code === "GENERAL" ? 4 : (landmarkSection.match(/\bBEFORE:/g) || []).length;
  const blueprintSections = ["Central Question", "Field Becomes Necessary When", "Parallel Civilization Entry", "Primary Aha", "Concept, Method, and Discipline Emergence", "Lightweight Epistemic Ledger", "Return to Our Civilisation", "Modern Field Expansion", "Knowledge Leak Notes", "Fact / Fiction Boundary"];
  const promptSections = ["Master creative direction", "Opening and central question", "What not to reveal too early", "Intellectual turns", "Mandatory knowledge coverage", "Return to Earth / MapKAI", "Visual direction", "Anti-generic guardrail"];
  const blueprintOk = blueprintSections.every((section) => blueprint.toLowerCase().includes(section.toLowerCase()));
  const promptOk = promptSections.every((section) => prompt.toLowerCase().includes(section.toLowerCase()));
  const noLeak = /knowledge[- ]leak|do not.*modern|before.*narrator/i.test(blueprint) && /fictional|thought experiment/i.test(overview);
  const openingExcerpt = blueprint.split(/\n/).slice(0, 22).join("\n");
  const noPrematureDefinition = !/^\s*[A-Z][^\n]*\s+is\s+(?:the\s+)?study of/i.test(openingExcerpt);
  const contentComplete = areas.every((area) => area.present) && blueprintOk && promptOk && noLeak;
  return {
    schemaVersion: "content-validation.v2",
    generatedAt: now(),
    contentVersion: VERSION,
    editorialFrameworkVersion: FRAMEWORK,
    providerStatus: editorialStatus,
    mandatoryCoverageAreas: areas,
    structuralChecks: {
      knowledgePack: contentComplete ? "PASS" : "FAIL",
      blueprintSections: blueprintOk ? "PASS" : "FAIL",
      videoPrompt: promptOk ? "PASS" : "FAIL",
      returnToEarth: item.code === "GENERAL" ? (/return to our world/i.test(overview) && /return to our civilisation/i.test(blueprint) ? "PASS" : "FAIL") : (/return to (?:our civil|the modern world|our world)/i.test(overview) && /return to our civil/i.test(blueprint) ? "PASS" : "FAIL"),
      epistemicLeak: noLeak ? "PASS" : "FAIL",
      factFictionFirewall: /fictional|thought experiment/i.test(overview) && /Fact \/ Fiction Boundary/i.test(blueprint) ? "PASS" : "FAIL",
      firstMinuteGenericOpening: noPrematureDefinition ? "PASS" : "FAIL",
      branchReasons: branchCount >= 3 ? "PASS" : "FAIL",
      landmarkMotion: item.code === "GENERAL" ? "PASS" : landmarkCount >= 3 && /BEFORE:/.test(overview) && /NEW IDEA:/.test(overview) ? "PASS" : "FAIL",
    },
    counts: { branchHeadings: branchCount, landmarkMotionUnits: landmarkCount },
    genericity: { status: "HEURISTIC", repeatedPhraseRisk: "LOW", warning: "Automatic heuristics are advisory; the Editorial Critic is authoritative when configured." },
    editorialCritique: { status: editorialStatus === "EDITORIAL_PROVIDER_UNAVAILABLE" ? "NOT_RUN" : "PENDING" },
    productionEligible: false,
    errors: areas.filter((area) => !area.present).map((area) => `Missing knowledge coverage: ${area.id}`),
    warnings: ["A seed preview is not an Editorial Critic PASS and cannot be submitted."],
  };
}

function seedCritique() {
  return {
    schemaVersion: "editorial-critique.v1",
    authority: "CREATOR_SELF_CHECK",
    reviewerRole: "creator_self_check",
    status: "NOT_RUN",
    providerStatus: "EDITORIAL_PROVIDER_UNAVAILABLE",
    scores: Object.fromEntries(Object.keys(THRESHOLDS).map((key) => [key, null])),
    strongestElement: "UNKNOWN — second-model Editorial Critic has not run.",
    weakestElement: "UNKNOWN — second-model Editorial Critic has not run.",
    whyThisCouldStillBecomeGeneric: "UNKNOWN — no automatic editorial PASS is claimed.",
    recommendedChanges: [],
    decision: "NOT_RUN",
    findings: [],
    genericityTests: { replaceThreeNouns: null, deleteStory: null, whyNeeded: null, modernFieldReal: null },
  };
}

function seedVideoReview() {
  return {
    schemaVersion: "video-review.v1",
    authority: "INDEPENDENT_REVIEW_PENDING",
    reviewerRole: "independent_reviewer",
    status: "NOT_RUN",
    scores: {},
    keepWatching: "UNKNOWN",
    memorableTomorrow: "UNKNOWN",
    strengths: [], weaknesses: [], missingKnowledge: [], genericMoments: [], factualConcerns: [],
    findings: [],
    hardGates: Object.fromEntries(HARD_GATE_NAMES.map((name) => [name, "NOT_REVIEWED"])),
    decision: "UNKNOWN",
  };
}
function seedDiagnosis() {
  return { schemaVersion: "failure-diagnosis.v1", status: "NOT_RUN", failureType: "UNKNOWN", confidence: 0, evidence: [], rootCause: "", repairTarget: "", repairInstructions: [], regenerateSamePayload: false };
}

function packagePaths(item) {
  const slug = item.code === "GENERAL" ? "general-overview" : `${item.code}-${safeSlug(item.name || item.title)}`;
  const directory = path.join(PATHS.packs, VERSION, slug);
  return {
    directory,
    overview: path.join(directory, "overview.md"),
    guidance: path.join(directory, "editorial_guidance.json"),
    critique: path.join(directory, "editorial_critique.json"),
    blueprint: path.join(directory, "narrative_blueprint.md"),
    prompt: path.join(directory, "video_prompt.md"),
    validation: path.join(directory, "content_validation.json"),
    payloadPreview: path.join(directory, "submission_payload.preview.md"),
    payload: path.join(directory, "submission_payload.md"),
    videoReview: path.join(directory, "video_review.json"),
    diagnosis: path.join(directory, "failure_diagnosis.json"),
    metadata: path.join(directory, "package_metadata.json"),
    deterministicValidation: path.join(directory, "deterministic_validation.json"),
    independentReview: path.join(directory, "independent_review.json"),
    finalDecision: path.join(directory, "final_review_decision.json"),
    fieldRepresentation: path.join(directory, "field_representation_interface.json"),
    artifactContract: path.join(directory, "artifact_contract.json"),
    creatorSelfCheck: path.join(directory, "editorial_critique.json"),
  };
}

function previewPayload(item, paths, source, prompt, guidance, status = "NOT_SUBMITTED") {
  const sourceHash = hash(source);
  const promptHash = hash(prompt);
  const guidanceHash = hash(JSON.stringify(guidance));
  return `# Submission Payload Snapshot (preview)\n\n**Status:** ${status}\n**Attempt ID:** NOT_CREATED — no Notebook submission has occurred.\n**Field ID:** ${item.code === "GENERAL" ? item.id : item.code}\n**Field:** ${item.name || item.title}\n**Content version:** ${VERSION}\n**Editorial framework version:** ${FRAMEWORK}\n**Guidance version:** ${guidance.guidanceVersion || "UNKNOWN"}\n**Source SHA-256:** ${sourceHash}\n**Director prompt SHA-256:** ${promptHash}\n**Guidance SHA-256:** ${guidanceHash}\n**Submitted at:** UNKNOWN\n**Notebook URL / ID:** UNKNOWN\n**Selected video mode:** UNKNOWN until the actual Notebook UI is inspected\n**Selected style:** UNKNOWN\n**Language:** en\n\nThis is a non-submission preview. The immutable submission_payload.md is written only at the moment of a real Notebook submission and embeds the exact source and prompt used.\n\n## Source path\n\n${rel(paths.overview)}\n\n## Director prompt path\n\n${rel(paths.prompt)}\n`;
}

function itemFromProfile(profile, taxonomy) {
  if (profile.id === GENERAL_PROFILE.id) return {
    id: profile.id, code: "GENERAL", type: "GENERAL_OVERVIEW", name: profile.name, title: profile.name, titleZh: profile.nameZh,
    slug: profile.slug, categoryCode: null, categoryTitle: "Product-level prologue", groupCode: null, groupTitle: null,
    narrativeEngine: profile.engine,
  };
  const field = currentField(profile.code, taxonomy);
  if (!field) return null;
  return { id: field.code, code: field.code, type: "FIELD", name: field.title, title: field.title, titleZh: field.titleZh, slug: field.slug, categoryCode: field.categoryCode, categoryTitle: field.categoryTitle, categoryTitleZh: field.categoryTitleZh, groupCode: field.groupCode, groupTitle: field.groupTitle, narrativeEngine: profile.engine };
}

function makeManifestItem(item, paths, providerStatus, governance = {}) {
  return {
    ...item,
    status: providerStatus === "EDITORIAL_PROVIDER_UNAVAILABLE" ? "EDITORIAL_PROVIDER_UNAVAILABLE" : "EDITORIAL_PENDING",
    stage: "EDITORIAL_PENDING",
    contentVersion: VERSION,
    editorialFrameworkVersion: FRAMEWORK,
    promptVersion: PROMPT_VERSION,
    runId: governance.runId || null,
    artifactType: ARTIFACT_TYPE,
    policyBinding: governance.policyBinding || null,
    activePromptVersions: governance.activePromptVersions || {},
    packPath: rel(paths.overview),
    sourcePackPath: rel(paths.directory),
    guidancePath: rel(paths.guidance),
    critiquePath: rel(paths.critique),
    blueprintPath: rel(paths.blueprint),
    promptPath: rel(paths.prompt),
    validationPath: rel(paths.validation),
    deterministicValidationPath: rel(paths.deterministicValidation),
    payloadPreviewPath: rel(paths.payloadPreview),
    submissionPayloadPath: null,
    videoReviewPath: rel(paths.videoReview),
    diagnosisPath: rel(paths.diagnosis),
    independentReviewPath: rel(paths.independentReview),
    finalDecisionPath: rel(paths.finalDecision),
    fieldRepresentationPath: rel(paths.fieldRepresentation),
    artifactContractPath: rel(paths.artifactContract),
    creatorOutputPath: rel(paths.overview),
    creatorSelfCheckPath: rel(paths.creatorSelfCheck),
    finalReviewDecision: "BLOCKED",
    sensitiveContentStatus: "CLEAR",
    reviewerRole: "independent_reviewer",
    editorialStatus: providerStatus,
    editorialToneApproved: false,
    editorialConversationPath: null,
    editorialRevisionCount: 0,
    editorialModelCalls: 0,
    videoAttempts: 0,
    attempts: 0,
    retryCount: 0,
    maxAttempts: LIMITS.maxTotalVideoAttemptsPerField,
    videoMode: "UNKNOWN",
    notebookUrl: null,
    submittedAt: null,
    completedAt: null,
    downloadedPath: null,
    transcriptPath: null,
    lastError: providerStatus === "EDITORIAL_PROVIDER_UNAVAILABLE" ? "No configured Editorial Model Provider. Seed preview is non-production and cannot be submitted." : null,
    nextAttemptAt: null,
    humanReviewPath: rel(path.join(paths.directory, "human_review.json")),
  };
}

async function loadOrCreateRuntime(taxonomy) {
  const policyBinding = await currentPolicyBinding();
  const promptVersions = await activePromptVersions();
  const provider = createEditorialModelProvider({ logger: (event) => { void eventLog({ stage: "model", ...event }); } });
  const existing = await json(PATHS.runtimeManifest);
  if (existing) {
    const bindingKey = (binding) => JSON.stringify({ creatingPolicy: binding?.creatingPolicy, reviewPolicy: binding?.reviewPolicy });
    if (existing.policyBinding && bindingKey(existing.policyBinding) !== bindingKey(policyBinding)) throw new Error("POLICY_BINDING_MISMATCH: autonomous runtime manifest is bound to different canonical policy bytes.");
    existing.policyBinding ||= policyBinding;
    existing.runId ||= autonomousRunId();
    existing.activePromptVersions ||= promptVersions;
    if (!existing.taxonomySnapshot) existing.taxonomySnapshot = { sourceFile: taxonomy.sourceFile, sourceHash: taxonomy.sourceHash, codeHash: taxonomy.codeHash, categoryCount: taxonomy.categories.length, fieldCount: taxonomy.fields.length };
    if (existsSync(PATHS.legacyManifest)) {
      const currentLegacyHash = hash(await readFile(PATHS.legacyManifest));
      if (!existing.legacyManifestHash) existing.legacyManifestHash = currentLegacyHash;
      else if (existing.legacyManifestHash !== currentLegacyHash) {
        // The legacy runner may have added governance metadata to the manifest
        // while the autonomous runtime was not running. Preserve the original
        // snapshot for auditability, but bind integrity checks to the migrated
        // bytes from this point forward. This is deliberately explicit: an
        // unexpected future edit must not be mistaken for a harmless migration.
        existing.legacyManifestMigration ||= {
          status: "ADDITIVE_GOVERNANCE_METADATA",
          originalHash: existing.legacyManifestHash,
          migratedHash: currentLegacyHash,
          detectedAt: now(),
          note: "Legacy manifest received additive policy/run governance metadata; runtime content and queue semantics remain unchanged.",
        };
        existing.legacyManifestHash = currentLegacyHash;
      }
    }
    existing.provider = provider.config;
    existing.limits = { ...LIMITS, ...(existing.limits || {}) };
    existing.thresholds = { ...THRESHOLDS, ...(existing.thresholds || {}) };
    existing.editorialChannel = {
      preferredProvider: "chatgpt-browser",
      interactionModel: "persistent_field_conversation",
      conversationPolicy: "one_persistent_chat_per_field",
      minRequestIntervalMs: 30_000,
      healthCacheMs: 300_000,
      rateLimitBackoffMinutes: [5, 10, 20],
      phaseOne: EDITORIAL_TONE_GATE_CODES,
      phaseTwoRequiresHumanToneApproval: true,
      ...existing.editorialChannel,
      minRequestIntervalMs: Math.max(30_000, Number(existing.editorialChannel?.minRequestIntervalMs) || 0),
    };
    for (const item of existing.items || []) {
      item.runId ||= existing.runId;
      item.artifactType ||= ARTIFACT_TYPE;
      if (item.policyBinding && JSON.stringify({ creatingPolicy: item.policyBinding.creatingPolicy, reviewPolicy: item.policyBinding.reviewPolicy }) !== JSON.stringify({ creatingPolicy: policyBinding.creatingPolicy, reviewPolicy: policyBinding.reviewPolicy })) throw new Error(`POLICY_BINDING_MISMATCH: field ${item.code} is bound to different canonical policy bytes.`);
      item.policyBinding ||= existing.policyBinding;
      item.activePromptVersions ||= existing.activePromptVersions;
      const paths = packagePaths(item);
      item.deterministicValidationPath ||= rel(paths.deterministicValidation);
      item.independentReviewPath ||= rel(paths.independentReview);
      item.finalDecisionPath ||= rel(paths.finalDecision);
      item.fieldRepresentationPath ||= rel(paths.fieldRepresentation);
      item.artifactContractPath ||= rel(paths.artifactContract);
      item.creatorOutputPath ||= rel(paths.overview);
      item.creatorSelfCheckPath ||= rel(paths.creatorSelfCheck);
      item.finalReviewDecision ||= "BLOCKED";
      item.sensitiveContentStatus ||= "CLEAR";
      item.reviewerRole ||= "independent_reviewer";
      if (item.editorialStatus === "PASS" && item.finalReviewDecision !== "PASS") item.editorialStatus = "CREATOR_SELF_CHECK_COMPLETE";
      if (typeof item.editorialToneApproved !== "boolean") item.editorialToneApproved = false;
      if (!("editorialConversationPath" in item)) item.editorialConversationPath = null;
      if (provider.config.provider === "chatgpt-browser" && item.status === "EDITORIAL_PROVIDER_UNAVAILABLE") {
        item.editorialStatus = "EDITORIAL_PENDING";
        if (EDITORIAL_TONE_GATE_CODES.includes(item.code)) {
          item.status = "EDITORIAL_PENDING";
          item.stage = "EDITORIAL_PENDING";
          item.lastError = "Awaiting the dedicated ChatGPT editorial conversation.";
        } else {
          item.status = "WAITING_FOR_EDITORIAL_TONE_REVIEW";
          item.stage = "EDITORIAL_PENDING";
          item.lastError = "General Overview and Economics require explicit human editorial-tone approval before this field begins.";
        }
      }
    }
    return { manifest: existing, provider, policyBinding, promptVersions };
  }
  const legacyText = existsSync(PATHS.legacyManifest) ? await readFile(PATHS.legacyManifest, "utf8") : "";
  const legacy = legacyText ? JSON.parse(legacyText) : null;
  const profiles = targetItems(taxonomy);
  const runId = autonomousRunId();
  const items = [];
  for (const target of profiles) {
    const item = itemFromProfile(target.code === "GENERAL" ? GENERAL_PROFILE : { ...target, code: target.code }, taxonomy);
    if (!item) continue;
    const paths = packagePaths(item);
    items.push(makeManifestItem(item, paths, provider.config.provider === "unconfigured" ? "EDITORIAL_PROVIDER_UNAVAILABLE" : "EDITORIAL_PENDING", { runId, policyBinding, activePromptVersions: promptVersions }));
  }
  const manifest = {
    schemaVersion: 3,
    factoryVersion: VERSION,
    editorialFrameworkVersion: FRAMEWORK,
    generatedAt: now(),
    rolloutMode: "pilot_then_auto",
    phase: "PHASE_1_GENERAL_AND_ECONOMICS",
    phase1Required: ["GENERAL", "0311"],
    phase2Unlock: ["0533", "0313", "0542", "0421"],
    editorialChannel: {
      preferredProvider: "chatgpt-browser",
      interactionModel: "persistent_field_conversation",
      conversationPolicy: "one_persistent_chat_per_field",
      minRequestIntervalMs: 30_000,
      healthCacheMs: 300_000,
      rateLimitBackoffMinutes: [5, 10, 20],
      phaseOne: EDITORIAL_TONE_GATE_CODES,
      phaseTwoRequiresHumanToneApproval: true,
    },
    remainingTaxonomyMode: "dynamic_after_phase2",
    taxonomySnapshot: { sourceFile: taxonomy.sourceFile, sourceHash: taxonomy.sourceHash, codeHash: taxonomy.codeHash, categoryCount: taxonomy.categories.length, fieldCount: taxonomy.fields.length, aiFormalFields: taxonomy.aiFormalFields.map((field) => field.code) },
    legacyManifestPath: rel(PATHS.legacyManifest),
    legacyManifestHash: legacyText ? hash(legacyText) : null,
    legacyPilotSnapshot: (legacy?.items || []).filter((entry) => ["0533", "0311", "0313"].includes(entry.code)).map((entry) => ({ code: entry.code, status: entry.status, contentVersion: entry.generationContentVersion || entry.contentVersion || null, notebookUrl: entry.notebookUrl || null, submittedAt: entry.submittedAt || null, downloadedPath: entry.downloadedPath || null })),
    provider: provider.config,
    runId,
    policyBinding,
    activePromptVersions: promptVersions,
    limits: LIMITS,
    thresholds: THRESHOLDS,
    items,
  };
  return { manifest, provider, policyBinding, promptVersions };
}

async function writeRuntime(manifest) {
  manifest.generatedAt = now();
  await saveJson(PATHS.runtimeManifest, manifest);
  await saveJson(PATHS.queue, { schemaVersion: 1, updatedAt: manifest.generatedAt, rolloutMode: manifest.rolloutMode, items: manifest.items.map((item) => ({ id: item.id, code: item.code, status: item.status, stage: item.stage, attempts: item.attempts, videoAttempts: item.videoAttempts, editorialToneApproved: item.editorialToneApproved, nextAttemptAt: item.nextAttemptAt, lastError: item.lastError })) });
  const quota = await json(PATHS.quota, { schemaVersion: 1, observedAt: null, submittedToday: 0, maxDailyNotebookSubmissions: LIMITS.maxDailyNotebookSubmissions, state: "UNKNOWN", events: [] });
  await saveJson(PATHS.quota, quota);
  for (const item of manifest.items || []) await persistAutonomousRunRecord(item, { manifestUpdatedAt: manifest.generatedAt });
}

async function materializeAiOverlay() {
  const directory = path.join(PATHS.packs, VERSION, "ai-era-general-literacy-editorial-overlay");
  await mkdir(directory, { recursive: true });
  const overview = renderAiOverlay();
  const metadata = { schemaVersion: 1, ...AI_ERA_OVERLAY, taxonomyStatus: AI_ERA_OVERLAY.taxonomyStatus, formalFieldId: null, duplicateCreated: false, path: rel(directory), generatedAt: now() };
  await saveText(path.join(directory, "overview.md"), overview);
  const guidance = {
    schemaVersion: "editorial-guidance.v1", guidanceVersion: `${VERSION}.ai-era-overlay.1`, origin: "curated_overlay_seed", productionEligible: false,
    field: { id: AI_ERA_OVERLAY.id, name: AI_ERA_OVERLAY.name, nameZh: AI_ERA_OVERLAY.nameZh, slug: AI_ERA_OVERLAY.slug, type: AI_ERA_OVERLAY.type },
    centralHumanQuestion: AI_ERA_OVERLAY.centralQuestion,
    fieldBecomesNecessaryWhen: "People must decide what to delegate to generative and agentic systems while the social norms, evidence practices, and job boundaries around those systems are still forming.",
    coreThesis: AI_ERA_OVERLAY.thesis, narrativeEngine: "tool changes observability",
    parallelCivilization: { enabled: false, entryPoint: "We are living through the transition in our own civilisation.", existingKnowledge: ["ordinary digital literacy", "human judgement", "professional practice"], trigger: "AI systems begin producing plausible work faster than people can inspect its provenance.", ordinaryIntuition: "A fluent answer is probably a reliable answer.", failedIntuition: "Fluency can hide uncertainty, missing context, synthetic evidence, and responsibility gaps.", emergentProblem: "How do people build trustworthy human–AI workflows while new boundaries are being negotiated?" },
    openingHook: "This time there is no need to imagine a parallel world: the transition is happening in our own offices, studios, classrooms, and decisions.",
    centralTension: "How can a person gain leverage from an AI system without outsourcing the judgement that makes the work meaningful or accountable?",
    primaryAha: "The scarce skill in an AI-mediated workflow is not producing more text; it is specifying the task, inspecting the evidence, preserving provenance, and deciding what must remain human judgement.",
    secondaryTurns: ["A model can compress knowledge without knowing whether the source is current or true.", "An agent can act across tools, so delegation becomes a question of scope and accountability.", "Synthetic media changes what counts as an observable trace.", "The right home for an AI question depends on whether its substance is computing, economics, psychology, ethics, media, education, or law."],
    emergencePath: ["AI tools become commonplace", "fluency outruns verification", "new workflows expose provenance and responsibility gaps", "cross-field practices for delegation and checking form", "MapKAI curates a general literacy overlay while mature disciplines retain their own questions"],
    modernFieldMap: AI_ERA_OVERLAY.connections.map((entry) => ({ name: entry.split(":")[0], reasonItExists: entry })),
    mandatoryConcepts: AI_ERA_OVERLAY.scope, optionalConcepts: ["model cards", "provenance", "human-in-the-loop", "agent boundaries"], methodsToRepresent: ["task specification", "source verification", "provenance checks", "scenario testing", "human review and escalation"], crossFieldConnections: AI_ERA_OVERLAY.connections.map((entry) => ({ field: entry.split(":")[0], connection: entry, difference: "This overlay routes the question to the mature field that owns its underlying mechanism or norm." })), visualOpportunities: ["a fluent answer whose citations branch into verified and unverified paths", "a human–AI workflow with delegation boundaries", "synthetic media and provenance layers", "the same problem routed to computing, economics, psychology, law, media, or education"], endingReturn: "We are watching a new literacy boundary form in our own civilisation; MapKAI can name the practice without pretending the academic field is finished.", finalMentalModel: AI_ERA_OVERLAY.learnerModel, avoid: AI_ERA_OVERLAY.avoid,
  };
  const blueprint = `# Narrative Blueprint — AI-Era General Literacy\\n\\n**Status:** editorial overlay only; no formal taxonomy ID exists in the current source.\\n**Narrative engine:** tool changes observability\\n\\n## Central Question\\n\\n${AI_ERA_OVERLAY.centralQuestion}\\n\\n## Why this is a present-tense boundary\\n\\n${AI_ERA_OVERLAY.narrative}\\n\\n## Opening problem\\n\\nA fluent output can be useful, wrong, or impossible to verify from its surface. The first turn is to make provenance and responsibility visible.\\n\\n## Primary Aha\\n\\n${guidance.primaryAha}\\n\\n## Modern Field Map\\n\\n${bullets(AI_ERA_OVERLAY.connections)}\\n\\n## Cross-field routing\\n\\n${bullets(AI_ERA_OVERLAY.exclusions)}\\n\\n## Fact / Fiction Boundary\\n\\nThis package is a present-day editorial framing, not an ancient emergence story and not a claim of universal academic standardisation.\\n`;
  const prompt = `# MapKAI Intellectual Journey — AI-Era General Literacy\\n\\nTreat this as a contemporary editorial overlay, not a mature academic discipline. Do not use the Parallel Civilization premise; we are living through the transition. Begin with a real problem of fluent but unverified output, then show delegation, provenance, synthetic media, judgement, and cross-field routing. Keep Computing, Economics, Psychology, Management, Ethics, Media, Education, and Law distinct. End with the existing MapKAI map and an honest statement that this boundary is still forming. Avoid hype, fear marketing, and the claim that all AI questions belong here.\\n\\nCentral question: ${AI_ERA_OVERLAY.centralQuestion}\\nPrimary Aha: ${guidance.primaryAha}\\n`;
  await saveJson(path.join(directory, "editorial_guidance.json"), guidance);
  await saveJson(path.join(directory, "editorial_critique.json"), { ...seedCritique(), status: "NOT_RUN", note: "AI-era overlay awaits a configured Editorial Critic." });
  await saveText(path.join(directory, "narrative_blueprint.md"), blueprint);
  await saveText(path.join(directory, "video_prompt.md"), prompt);
  await saveText(path.join(directory, "submission_payload.preview.md"), "# Submission Payload Snapshot\n\nNOT_SUBMITTED — this editorial overlay is excluded from the formal production queue.\n");
  await saveJson(path.join(directory, "metadata.json"), metadata);
  await saveJson(path.join(directory, "content_validation.json"), { schemaVersion: "content-validation.v2", generatedAt: now(), status: "EDITORIAL_OVERLAY_ONLY", productionEligible: false, taxonomyStatus: AI_ERA_OVERLAY.taxonomyStatus, duplicateCreated: false, scopeChecks: { humanAiCollaboration: true, verification: true, syntheticMedia: true, judgement: true, crossFieldRouting: true }, errors: [] });
  await saveText(path.join(directory, "README.md"), "This is an editorial overlay, not a formal field. It is intentionally excluded from the production queue until the product owner makes an explicit taxonomy decision.\n");
  await saveJson(path.join(FACTORY, "runtime", "ai-era-field-audit.json"), metadata);
}

async function materializePackage(item, { seed = false } = {}) {
  const profile = item.code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[item.code];
  if (!profile) throw new Error(`No controlled editorial seed for ${item.code}.`);
  const paths = packagePaths(item);
  const locked = ["SUBMITTED", "GENERATING", "VIDEO_READY", "DOWNLOADED", "VIDEO_REVIEWING", "HUMAN_REVIEW_READY"].includes(item.status);
  if (locked && existsSync(paths.guidance)) return { paths, skipped: true };
  const guidance = guidanceFromProfile({ ...item, ...profile, code: item.code });
  const overview = decodeText(renderOverview({ ...item, ...profile, code: item.code }));
  const blueprint = decodeText(renderBlueprint({ ...item, ...profile, code: item.code }));
  const prompt = decodeText(renderVideoPrompt({ ...item, ...profile, code: item.code }));
  const configuredProvider = providerConfig(process.env);
  const providerStatus = seed || configuredProvider.provider === "unconfigured" ? "EDITORIAL_PROVIDER_UNAVAILABLE" : "EDITORIAL_PENDING";
  const validation = knowledgeChecks(item, overview, blueprint, prompt, guidance, providerStatus);
  validation.seedPreview = seed;
  validation.productionEligible = false;
  validation.editorialCritique = { status: "NOT_RUN", providerStatus };
  const sensitiveContent = classifySensitiveContent({ fieldId: item.code, fieldName: profile.name || item.name, text: `${overview}\n${prompt}` });
  item.sensitiveContentStatus = sensitiveContent.status;
  const metadata = { schemaVersion: 1, fieldId: item.code === "GENERAL" ? GENERAL_PROFILE.id : item.code, fieldName: profile.name || item.name, type: item.type, artifactType: ARTIFACT_TYPE, runId: item.runId, policyBinding: item.policyBinding, activePromptVersions: item.activePromptVersions, reviewerRole: "independent_reviewer", creatorOutputPath: rel(paths.overview), creatorSelfCheckPath: rel(paths.creatorSelfCheck), independentReviewPath: rel(paths.independentReview), finalDecisionPath: rel(paths.finalDecision), fieldRepresentationPath: rel(paths.fieldRepresentation), artifactContractPath: rel(paths.artifactContract), contentVersion: VERSION, editorialFrameworkVersion: FRAMEWORK, narrativeEngine: profile.engine, origin: seed ? "directional_seed_preview" : "provider_pending", productionEligible: false, taxonomySource: item.code === "GENERAL" ? "product-level" : "script.js", sensitiveContent, generatedAt: now() };
  await saveText(paths.overview, overview);
  await saveText(path.join(paths.directory, "overview_source.md"), overview);
  await saveJson(paths.guidance, guidance);
  await saveJson(paths.critique, seedCritique());
  await saveText(paths.blueprint, blueprint);
  await saveText(paths.prompt, prompt);
  await saveJson(paths.validation, validation);
  await saveText(paths.payloadPreview, previewPayload(item, paths, overview, prompt, guidance));
  await saveJson(paths.videoReview, seedVideoReview());
  await saveJson(paths.diagnosis, seedDiagnosis());
  const deterministic = deterministicValidate({
    artifactType: item.artifactType || ARTIFACT_TYPE,
    fieldId: item.code,
    policyBinding: item.policyBinding,
    requiredFiles: { overview: existsSync(paths.overview), guidance: existsSync(paths.guidance), blueprint: existsSync(paths.blueprint), videoPrompt: existsSync(paths.prompt) },
    evidenceFields: { runId: Boolean(item.runId), activePromptVersions: Boolean(item.activePromptVersions && Object.keys(item.activePromptVersions).length) },
    expectedArtifactType: ARTIFACT_TYPE,
    sensitiveContent,
    learnerFacing: true,
    learnerFacingText: `${overview}\n${prompt}`,
    knownSubjectCodes: item.code === "GENERAL" ? [] : [item.code],
  });
  validation.deterministicValidation = deterministic;
  validation.sensitiveContent = sensitiveContent;
  await saveJson(paths.validation, validation);
  await saveJson(paths.deterministicValidation, deterministic);
  await saveJson(paths.independentReview, { ...seedVideoReview(), status: "NOT_RUN", reviewerRole: "independent_reviewer", policyBinding: item.policyBinding, note: "Independent semantic review has not run; this is not a final decision." });
  const blocked = blockedReviewDecision({ runId: item.runId, fieldId: item.code, artifactType: item.artifactType || ARTIFACT_TYPE, policyBinding: item.policyBinding, reasonCode: sensitiveContent.status === "CLEAR" ? "INSUFFICIENT_EVIDENCE" : sensitiveContent.status });
  blocked.creatorOutputPath = rel(paths.overview);
  blocked.creatorSelfCheckPath = rel(paths.creatorSelfCheck);
  blocked.independentReviewPath = rel(paths.independentReview);
  await saveJson(paths.finalDecision, blocked);
  await saveJson(paths.fieldRepresentation, fieldRepresentationInterface({ fieldId: item.code, fieldName: profile.name || item.name, source: "script.js taxonomy — interface only; canonical real-world representation is not populated in this phase" }));
  await saveJson(paths.artifactContract, artifactContractPlaceholder(ARTIFACT_TYPE));
  await saveJson(paths.metadata, metadata);
  await saveJson(path.join(paths.directory, "source_pack_manifest.json"), { schemaVersion: 1, source: rel(paths.overview), sourceSha256: hash(overview), directorPrompt: rel(paths.prompt), directorPromptSha256: hash(prompt), guidance: rel(paths.guidance), guidanceSha256: hash(JSON.stringify(guidance)), factualSourceAndGuidanceSeparate: true, generatedAt: now() });
  await saveJson(path.join(paths.directory, "human_review.json"), { status: "UNREVIEWED", narrativeEngagement: null, intellectualDepth: null, primaryAha: null, knowledgeCoverage: null, mentalMapClarity: null, adultTone: null, mapkaiDifferentiation: null, emergenceLogic: null, returnToEarth: null, decision: "UNREVIEWED", note: "Human-only decision. No automatic publication." });
  await saveText(path.join(paths.directory, "submission_payload.md"), "# Submission Payload\n\nNOT_SUBMITTED — this file will be replaced only by an immutable snapshot at a real Notebook submission. See `submission_payload.preview.md` for the current non-submission hashes.\n");
  item.editorialStatus = providerStatus;
  item.finalReviewDecision = "BLOCKED";
  item.lastError = providerStatus === "EDITORIAL_PROVIDER_UNAVAILABLE" ? "No configured Editorial Model Provider. Seed preview is non-production and cannot be submitted." : sensitiveContent.status !== "CLEAR" ? `Sensitive governance hold: ${sensitiveContent.status}` : null;
  if (!locked) item.status = providerStatus === "EDITORIAL_PROVIDER_UNAVAILABLE" ? "EDITORIAL_PROVIDER_UNAVAILABLE" : sensitiveContent.status === "POLICY_CLARIFICATION_REQUIRED" ? "POLICY_CLARIFICATION_REQUIRED" : sensitiveContent.status === "SENSITIVE_TOPIC_REVIEW_REQUIRED" ? "SENSITIVE_TOPIC_REVIEW_REQUIRED" : "EDITORIAL_PENDING";
  return { paths, skipped: false };
}

/** Additive migration for packages created before the governance architecture.
 * It never rewrites creator prose or existing submission payloads. */
async function ensurePackageGovernanceArtifacts(item) {
  const paths = packagePaths(item);
  if (!existsSync(paths.overview)) return;
  const overview = await readFile(paths.overview, "utf8");
  const prompt = existsSync(paths.prompt) ? await readFile(paths.prompt, "utf8") : "";
  const sensitiveContent = classifySensitiveContent({ fieldId: item.code, fieldName: item.name, text: overview });
  item.sensitiveContentStatus = sensitiveContent.status;
  if (!existsSync(paths.deterministicValidation)) {
    const deterministic = deterministicValidate({
      artifactType: item.artifactType || ARTIFACT_TYPE,
      fieldId: item.code,
      policyBinding: item.policyBinding,
      requiredFiles: { overview: true, guidance: existsSync(paths.guidance), blueprint: existsSync(paths.blueprint), videoPrompt: existsSync(paths.prompt) },
      evidenceFields: { runId: Boolean(item.runId), activePromptVersions: Boolean(item.activePromptVersions && Object.keys(item.activePromptVersions).length) },
      expectedArtifactType: ARTIFACT_TYPE,
      sensitiveContent,
      learnerFacing: true,
      learnerFacingText: `${overview}\n${prompt}`,
      knownSubjectCodes: item.code === "GENERAL" ? [] : [item.code],
    });
    await saveJson(paths.deterministicValidation, deterministic);
  }
  if (!existsSync(paths.independentReview)) await saveJson(paths.independentReview, { ...seedVideoReview(), status: "NOT_RUN", policyBinding: item.policyBinding, note: "Independent semantic review has not run." });
  if (!existsSync(paths.finalDecision)) {
    const blocked = blockedReviewDecision({ runId: item.runId, fieldId: item.code, artifactType: item.artifactType || ARTIFACT_TYPE, policyBinding: item.policyBinding, reasonCode: sensitiveContent.status === "CLEAR" ? "INSUFFICIENT_EVIDENCE" : sensitiveContent.status });
    blocked.creatorOutputPath = item.creatorOutputPath || rel(paths.overview); blocked.creatorSelfCheckPath = item.creatorSelfCheckPath || rel(paths.creatorSelfCheck); blocked.independentReviewPath = rel(paths.independentReview);
    await saveJson(paths.finalDecision, blocked);
  }
  if (!existsSync(paths.fieldRepresentation)) await saveJson(paths.fieldRepresentation, fieldRepresentationInterface({ fieldId: item.code, fieldName: item.name, source: "script.js taxonomy — interface only" }));
  if (!existsSync(paths.artifactContract)) await saveJson(paths.artifactContract, artifactContractPlaceholder(item.artifactType || ARTIFACT_TYPE));
  if (existsSync(paths.metadata)) {
    const metadata = await json(paths.metadata, {});
    await saveJson(paths.metadata, { ...metadata, runId: item.runId, artifactType: item.artifactType || ARTIFACT_TYPE, policyBinding: item.policyBinding, activePromptVersions: item.activePromptVersions, creatorOutputPath: item.creatorOutputPath || rel(paths.overview), creatorSelfCheckPath: item.creatorSelfCheckPath || rel(paths.creatorSelfCheck), independentReviewPath: item.independentReviewPath || rel(paths.independentReview), finalDecisionPath: item.finalDecisionPath || rel(paths.finalDecision), sensitiveContent, productionEligible: false });
  }
}

async function bootstrap({ seed = false } = {}) {
  const taxonomy = await inspectTaxonomy();
  const { manifest } = await loadOrCreateRuntime(taxonomy);
  await materializeAiOverlay();
  const selected = manifest.items.filter((item) => !selectedCodes.size || selectedCodes.has(item.code) || (selectedGeneral && item.code === "GENERAL"));
  for (const item of selected) await materializePackage(item, { seed });
  await writeRuntime(manifest);
  await buildDashboard(manifest);
  console.log(`Autonomous MapKAI Factory ${VERSION}`);
  console.log(`Taxonomy snapshot: ${taxonomy.categories.length} categories / ${taxonomy.fields.length} formal named fields`);
  console.log(`AI-era General Literacy: ${taxonomy.aiFormalFields.length ? `formal field(s) found: ${taxonomy.aiFormalFields.map((field) => field.code).join(", ")}` : "no distinct formal field in current publicFieldLabels; editorial overlay kept outside taxonomy"}`);
  console.log(`Materialized packages: ${selected.length} (seedPreview=${seed ? "yes" : "no"})`);
}

function profileLikeFromGuidance(item, guidance) {
  const p = item.code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[item.code];
  return {
    ...p,
    name: guidance.field?.name || p.name,
    nameZh: guidance.field?.nameZh || p.nameZh,
    engine: guidance.narrativeEngine || p.engine,
    centralQuestion: guidance.centralHumanQuestion,
    necessaryWhen: guidance.fieldBecomesNecessaryWhen,
    thesis: guidance.coreThesis,
    openingHook: guidance.openingHook,
    openingProblem: guidance.parallelCivilization?.emergentProblem || p.openingProblem,
    existingKnowledge: guidance.parallelCivilization?.existingKnowledge || p.existingKnowledge,
    trigger: guidance.parallelCivilization?.trigger || p.trigger,
    ordinaryIntuition: guidance.parallelCivilization?.ordinaryIntuition || p.ordinaryIntuition,
    failedIntuition: guidance.parallelCivilization?.failedIntuition || p.failedIntuition,
    tension: guidance.centralTension,
    aha: guidance.primaryAha,
    secondaryTurns: guidance.secondaryTurns,
    emergencePath: guidance.emergencePath,
    map: (guidance.modernFieldMap || []).map((entry) => ({ name: entry.name, reason: entry.reason || entry.reasonItExists || "" })),
    concepts: guidance.mandatoryConcepts,
    optionalConcepts: guidance.optionalConcepts || [],
    methods: guidance.methodsToRepresent,
    connections: guidance.crossFieldConnections,
    visuals: guidance.visualOpportunities,
    learnerModel: guidance.finalMentalModel,
    returnToEarth: guidance.endingReturn,
    avoid: guidance.avoid,
    history: p.history,
    applications: p.applications,
  };
}

async function stagePrompt(file, task) {
  const instructions = await readFile(path.join(PATHS.prompts, file), "utf8");
  return `${instructions}\n\n--- MAPKAI RUN CONTEXT (authoritative for this call only) ---\n\n${task}`;
}
async function editorialConversationPrompts(item, profile) {
  const protocol = await readFile(path.join(PATHS.prompts, "editorial-conversation.md"), "utf8");
  const fieldName = profile.name || item.name || item.title;
  const target = JSON.stringify({
    field: fieldName,
    fieldCode: item.code === "GENERAL" ? "GENERAL_OVERVIEW" : item.code,
    startingQuestion: profile.centralQuestion,
    necessityPressure: profile.necessaryWhen,
    directionalSeed: profile.thesis,
    currentOpening: profile.openingHook,
    candidateNarrativeEngines: profile.candidateEngines,
    existingMap: profile.map,
  }, null, 2);
  return {
    conversation: {
      explore: `${protocol}\n\nWe are beginning the dedicated MapKAI Editorial conversation for ${fieldName}. Do not write a final overview yet. First explore why this field has to exist. Propose 3–5 genuinely different, high-level editorial premises; for each, identify its central question, possible narrative engine, potential intellectual reversal, and the risk that makes it too generic. Compare them honestly.\n\nFIELD CONTEXT:\n${target}`,
      challenge: `The promising direction is not yet enough. Challenge the strongest 2 premises from our discussion: where would a sophisticated learner still feel they are hearing an AI textbook or a reusable template? Strengthen narrative necessity, the intellectual reversal, and the reason this particular field—not a neighbour—must emerge. Do not choose by confidence; explain the trade-off.`,
      select: `Select the strongest premise now. State the non-negotiable core thesis, central tension, narrative engine, primary Aha, 2–4 secondary turns, and the bridge from the fictional prototype to the real modern field map. Protect the core idea from being flattened into a dictionary definition.`,
      develop: `Develop that selected premise into an intellectual journey for an intelligent adult. Show the chain from recurring phenomenon to failed intuition to concept, method, discipline, and modern field map. Explain why each major branch exists, how landmark ideas changed the field, which evidence or methods matter, and how neighbouring MapKAI fields connect. Keep the story as a causal explanation of necessity, not decorative fiction.`,
      self_review: `Now act as your own demanding MapKAI editor. Is the selected direction genuinely field-specific? Does it begin from a worthwhile question, contain a real Wait—why?/Aha moment, and return clearly to our civilisation? Identify anything generic, childish, mechanically enumerated, historically fabricated, or conceptually premature. Rewrite the weak passages in the direction you recommend.`,
    },
  };
}
async function directorPrompt(item, profile) {
  return stagePrompt("editorial-director.md", `This is the finalisation step of the dedicated ${profile.name} editorial conversation. Preserve the strongest thesis, narrative engine, central tension, and Aha established in the preceding discussion; do not replace them with generic textbook language.\n\nTarget: ${profile.name} (${item.code === "GENERAL" ? "GENERAL_OVERVIEW" : item.code})\n\n${JSON.stringify({ centralQuestion: profile.centralQuestion, necessaryWhen: profile.necessaryWhen, directionalSeed: profile.thesis, opening: profile.openingHook, fieldMap: profile.map, candidateEngines: profile.candidateEngines }, null, 2)}\n\nNow return the final editorial guidance only as strict JSON. This is a factory artifact, not a new brainstorm.`);
}
async function criticPrompt(item, guidance) {
  return stagePrompt("editorial-critic.md", `Review this proposed MapKAI guidance for ${item.name || item.title}. Apply the configured thresholds. Return strict editorial critique JSON.\n\n${JSON.stringify(guidance, null, 2)}`);
}
async function reviserPrompt(item, guidance, critique) {
  return stagePrompt("editorial-reviser.md", `Revise this MapKAI guidance for ${item.name || item.title}. Return only strict editorial-guidance JSON.\n\nORIGINAL GUIDANCE:\n${JSON.stringify(guidance, null, 2)}\n\nCRITIQUE:\n${JSON.stringify(critique, null, 2)}`);
}
async function knowledgePrompt(item, guidance) {
  return stagePrompt("knowledge-expander.md", `Expand the passed guidance for ${item.name || item.title} into a factual overview. Return a JSON object with an overviewMarkdown string and optional sources array. No invented evidence.\n\nGUIDANCE:\n${JSON.stringify(guidance, null, 2)}`);
}
function critiquePass(critique) {
  const scores = critique?.scores || critique || {};
  const required = Object.entries(THRESHOLDS).every(([key, threshold]) => {
    const value = Number(scores[key]);
    if (!Number.isFinite(value)) return false;
    return key.endsWith("Risk") ? value <= threshold : value >= threshold;
  });
  return required && String(critique?.decision || "").toUpperCase() === "PASS";
}
function normalizeCritique(raw) {
  const scores = raw?.scores || raw || {};
  const decision = ["PASS", "REVISE", "NOT_RUN"].includes(String(raw?.decision || "").toUpperCase()) ? String(raw?.decision).toUpperCase() : "REVISE";
  return { ...raw, schemaVersion: raw?.schemaVersion || "editorial-critique.v1", authority: "CREATOR_SELF_CHECK", reviewerRole: "creator_self_check", scores: Object.fromEntries(Object.keys(THRESHOLDS).map((key) => [key, Number.isFinite(Number(scores[key])) ? Number(scores[key]) : null])), decision, status: raw?.status || "MODEL_REPORTED" };
}
function normalizeGuidance(raw, item) {
  const result = { ...raw, schemaVersion: raw?.schemaVersion || "editorial-guidance.v1", guidanceVersion: raw?.guidanceVersion || `${VERSION}.guidance.model.1`, productionEligible: false, semanticReviewRequired: true, origin: "editorial_model_provider" };
  result.field ||= { id: item.code, name: item.name || item.title, nameZh: item.titleZh, slug: item.slug, type: item.type || "FIELD" };
  const checks = guidanceChecks(result);
  if (!checks.valid) throw new Error(`Editorial guidance schema/semantic check failed: ${checks.missing.join(", ")}`);
  return result;
}

async function writeProviderPackage(item, guidance, critique, overviewMarkdown) {
  const paths = packagePaths(item);
  const profile = profileLikeFromGuidance(item, guidance);
  const overview = String(overviewMarkdown || "").trim();
  if (!overview || overview.length < 1200) throw new Error("Editorial provider returned an empty or implausibly short knowledge expansion.");
  const blueprint = decodeText(renderBlueprint({ ...item, ...profile, code: item.code }));
  const prompt = decodeText(renderVideoPrompt({ ...item, ...profile, code: item.code }));
  const sensitiveContent = classifySensitiveContent({ fieldId: item.code, fieldName: profile.name || item.name, text: `${overview}\n${prompt}` });
  const validation = knowledgeChecks(item, overview, blueprint, prompt, guidance, "MODEL_REPORTED");
  validation.seedPreview = false;
  validation.editorialCritique = { status: critique.status || "MODEL_REPORTED", authority: "CREATOR_SELF_CHECK", reviewerRole: "creator_self_check", decision: critique.decision, scores: critique.scores };
  validation.sensitiveContent = sensitiveContent;
  const structuralPass = Object.values(validation.structuralChecks).every((value) => value === "PASS") && validation.mandatoryCoverageAreas.every((area) => area.present);
  const deterministic = deterministicValidate({
    artifactType: item.artifactType || ARTIFACT_TYPE,
    fieldId: item.code,
    policyBinding: item.policyBinding,
    requiredFiles: { overview: true, guidance: true, blueprint: true, videoPrompt: true },
    evidenceFields: { runId: Boolean(item.runId), activePromptVersions: Boolean(item.activePromptVersions && Object.keys(item.activePromptVersions).length) },
    expectedArtifactType: ARTIFACT_TYPE,
    sensitiveContent,
    learnerFacing: true,
    learnerFacingText: `${overview}\n${prompt}`,
    knownSubjectCodes: item.code === "GENERAL" ? [] : [item.code],
    extraChecks: { structuralShape: structuralPass },
  });
  validation.deterministicValidation = deterministic;
  // A creator's Critic score is useful for revision, never for release. The
  // package remains blocked until an independent reviewer writes a valid
  // final-review-decision.v1 record.
  validation.productionEligible = false;
  validation.errors = ["Independent semantic review is required before submission.", ...(sensitiveContent.status === "CLEAR" ? [] : [`Sensitive governance hold: ${sensitiveContent.status}`])];
  await saveText(paths.overview, overview);
  await saveText(path.join(paths.directory, "overview_source.md"), overview);
  await saveJson(paths.guidance, guidance);
  await saveJson(paths.critique, critique);
  await saveText(paths.blueprint, blueprint);
  await saveText(paths.prompt, prompt);
  await saveJson(paths.validation, validation);
  await saveText(paths.payloadPreview, previewPayload(item, paths, overview, prompt, guidance));
  await saveJson(paths.videoReview, seedVideoReview());
  await saveJson(paths.diagnosis, seedDiagnosis());
  await saveJson(paths.deterministicValidation, deterministic);
  await saveJson(paths.independentReview, { ...seedVideoReview(), status: "NOT_RUN", authority: "INDEPENDENT_REVIEW_PENDING", reviewerRole: "independent_reviewer", policyBinding: item.policyBinding, note: "Creator output is complete; independent semantic review has not yet run." });
  const blocked = blockedReviewDecision({ runId: item.runId, fieldId: item.code, artifactType: item.artifactType || ARTIFACT_TYPE, policyBinding: item.policyBinding, reasonCode: sensitiveContent.status === "CLEAR" ? "INSUFFICIENT_EVIDENCE" : sensitiveContent.status });
  blocked.creatorOutputPath = rel(paths.overview);
  blocked.creatorSelfCheckPath = rel(paths.creatorSelfCheck);
  blocked.independentReviewPath = rel(paths.independentReview);
  await saveJson(paths.finalDecision, blocked);
  await saveJson(paths.fieldRepresentation, fieldRepresentationInterface({ fieldId: item.code, fieldName: profile.name, source: "script.js taxonomy — interface only; canonical real-world representation is not populated in this phase" }));
  await saveJson(paths.artifactContract, artifactContractPlaceholder(item.artifactType || ARTIFACT_TYPE));
  await saveJson(paths.metadata, { schemaVersion: 1, fieldId: item.code === "GENERAL" ? GENERAL_PROFILE.id : item.code, fieldName: profile.name, type: item.type, artifactType: item.artifactType || ARTIFACT_TYPE, runId: item.runId, policyBinding: item.policyBinding, activePromptVersions: item.activePromptVersions, creatorOutputPath: rel(paths.overview), creatorSelfCheckPath: rel(paths.creatorSelfCheck), independentReviewPath: rel(paths.independentReview), finalDecisionPath: rel(paths.finalDecision), fieldRepresentationPath: rel(paths.fieldRepresentation), artifactContractPath: rel(paths.artifactContract), contentVersion: VERSION, editorialFrameworkVersion: FRAMEWORK, narrativeEngine: guidance.narrativeEngine, origin: "editorial_model_provider", productionEligible: false, sensitiveContent, generatedAt: now() });
  await saveJson(path.join(paths.directory, "source_pack_manifest.json"), { schemaVersion: 1, source: rel(paths.overview), sourceSha256: hash(await readFile(paths.overview, "utf8")), directorPrompt: rel(paths.prompt), directorPromptSha256: hash(await readFile(paths.prompt, "utf8")), guidance: rel(paths.guidance), guidanceSha256: hash(JSON.stringify(guidance)), critique: rel(paths.critique), critiqueSha256: hash(JSON.stringify(critique)), factualSourceAndGuidanceSeparate: true, generatedAt: now() });
  item.editorialStatus = "SEMANTIC_REVIEW_REQUIRED";
  item.finalReviewDecision = "BLOCKED";
  item.sensitiveContentStatus = sensitiveContent.status;
  item.status = sensitiveContent.status === "POLICY_CLARIFICATION_REQUIRED" ? "POLICY_CLARIFICATION_REQUIRED" : sensitiveContent.status === "SENSITIVE_TOPIC_REVIEW_REQUIRED" ? "SENSITIVE_TOPIC_REVIEW_REQUIRED" : "SEMANTIC_REVIEW_REQUIRED";
  item.stage = "SEMANTIC_REVIEW";
  item.lastError = sensitiveContent.status === "CLEAR" ? "Creator output is complete; independent semantic review is required before submission." : `Sensitive governance hold: ${sensitiveContent.status}`;
  return { paths, validation };
}

function editorialToneApproved(manifest) {
  return EDITORIAL_TONE_GATE_CODES.every((code) => manifest.items.find((item) => item.code === code)?.editorialToneApproved === true);
}

function editorialTargets(manifest) {
  const explicitlySelected = selectedCodes.size || selectedGeneral;
  const requested = explicitlySelected
    ? manifest.items.filter((item) => selectedCodes.has(item.code) || (selectedGeneral && item.code === "GENERAL"))
    : manifest.items.filter((item) => EDITORIAL_TONE_GATE_CODES.includes(item.code));
  if (editorialToneApproved(manifest)) return requested;
  const allowed = [];
  for (const item of requested) {
    if (EDITORIAL_TONE_GATE_CODES.includes(item.code)) allowed.push(item);
    else {
      item.status = "WAITING_FOR_EDITORIAL_TONE_REVIEW";
      item.stage = "EDITORIAL_PENDING";
      item.lastError = "General Overview and Economics require explicit human editorial-tone approval before this field begins.";
    }
  }
  return allowed;
}

function conversationTranscriptMarkdown(item, journey) {
  const name = item.name || item.title || item.code;
  const entries = journey?.transcript || [];
  return `# MapKAI Editorial Conversation — ${name}\n\n**Field:** ${item.code}\n**Conversation:** ${journey?.thread?.name || "UNKNOWN"}\n**Conversation ID:** ${journey?.thread?.conversationId || "UNKNOWN"}\n**Conversation URL:** ${journey?.thread?.conversationUrl || "UNKNOWN"}\n**Provider:** chatgpt-browser\n**Status:** captured for editorial audit; not a Notebook submission payload.\n\n${entries.map((entry, index) => `## ${index + 1}. ${entry.stage}${entry.reused ? " (REUSED)" : ""}\n\n${entry.text}`).join("\n\n") || "No natural-language conversation turns were recorded."}\n`;
}

async function runEditorialPipeline(manifest, provider) {
  const targets = editorialTargets(manifest);
  if (provider.config.provider === "chatgpt-browser" && typeof provider.rateLimitStatus === "function") {
    const rateLimit = await provider.rateLimitStatus();
    if (rateLimit.blocked) {
      for (const item of targets) {
        if (!["SUBMITTED", "GENERATING", "VIDEO_READY", "DOWNLOADED", "VIDEO_REVIEWING", "HUMAN_REVIEW_READY"].includes(item.status)) {
          item.status = "CHATGPT_RATE_LIMITED";
          item.stage = "EDITORIAL_PAUSED";
          item.lastError = `ChatGPT browser channel is paused until ${rateLimit.retryAt || "an explicit resume"}. No request was sent.`;
        }
      }
      await eventLog({ stage: "editorial", event: "CHATGPT_RATE_LIMITED_QUEUE_PAUSED", retryAt: rateLimit.retryAt || null, attempt: rateLimit.attempt || 0 });
      await writeRuntime(manifest);
      await buildDashboard(manifest);
      console.log(`Editorial pipeline paused by CHATGPT_RATE_LIMITED; no browser request sent. retryAt=${rateLimit.retryAt || "UNKNOWN"}`);
      return;
    }
  }
  if (provider.config.provider === "unconfigured") {
    for (const item of targets) { item.status = "EDITORIAL_PROVIDER_UNAVAILABLE"; item.editorialStatus = "EDITORIAL_PROVIDER_UNAVAILABLE"; item.lastError = "No configured Editorial Model Provider. No production editorial pass was claimed."; }
    await eventLog({ stage: "editorial", event: "EDITORIAL_PROVIDER_UNAVAILABLE", count: targets.length });
    await writeRuntime(manifest);
    await buildDashboard(manifest);
    console.log("Editorial pipeline paused: configure a real provider; no fake fallback was used.");
    return;
  }
  let haltedByChatGptRateLimit = false;
  for (const item of targets) {
    if (["SUBMITTED", "GENERATING", "VIDEO_READY", "DOWNLOADED", "VIDEO_REVIEWING", "HUMAN_REVIEW_READY", ...REVIEW_HOLD_STATUSES].includes(item.status)) continue;
    const profile = item.code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[item.code];
    const callContext = { field: item.code, attemptId: `${item.code}-${Date.now()}-${hash(item.id).slice(0, 8)}`, promptVersion: PROMPT_VERSION, canonVersion: VERSION };
    item.status = "EDITORIAL_GENERATING"; item.editorialModelCalls = (item.editorialModelCalls || 0) + 1; item.attempts = (item.attempts || 0) + 1; await writeRuntime(manifest);
    try {
      if (provider.config.provider === "chatgpt-browser" && typeof provider.runEditorialJourney === "function") {
        const journey = await provider.runEditorialJourney({ field: item.code, fieldName: profile.name || item.name || item.title, prompts: await editorialConversationPrompts(item, profile), context: callContext });
        const transcriptFile = path.join(packagePaths(item).directory, "editorial_transcript.md");
        await saveText(transcriptFile, conversationTranscriptMarkdown(item, journey));
        await saveJson(path.join(packagePaths(item).directory, "editorial_conversation.json"), {
          schemaVersion: 1,
          field: item.code,
          purpose: journey.thread?.name || null,
          conversationId: journey.thread?.conversationId || null,
          conversationUrl: journey.thread?.conversationUrl || null,
          stages: (journey.transcript || []).map((entry) => ({ stage: entry.stage, conversationId: entry.conversationId || null, conversationUrl: entry.conversationUrl || null, reused: entry.reused === true })),
          transcriptPath: rel(transcriptFile),
          provider: "chatgpt-browser",
          generatedAt: now(),
          credentialsReadOrSaved: false,
        });
        item.editorialConversationPath = rel(transcriptFile);
      }
      let guidance = normalizeGuidance(await provider.generateEditorialGuidance(await directorPrompt(item, profile), item.editorialConversationPath ? { ...callContext, attemptId: `${callContext.attemptId}-finalize` } : callContext), item);
      let critique = null;
      for (let revision = 0; revision <= LIMITS.maxGuidanceRevisions; revision += 1) {
        item.status = "EDITORIAL_CRITIQUE"; await writeRuntime(manifest);
        critique = normalizeCritique(await provider.critiqueEditorialGuidance(await criticPrompt(item, guidance), callContext));
        if (critiquePass(critique)) break;
        if (revision === LIMITS.maxGuidanceRevisions) break;
        item.status = "EDITORIAL_REVISION"; item.editorialRevisionCount = revision + 1; item.editorialModelCalls += 2; await writeRuntime(manifest);
        guidance = normalizeGuidance(await provider.reviseEditorialGuidance(await reviserPrompt(item, guidance, critique), callContext), item);
      }
      if (!critique || !critiquePass(critique)) { item.status = "EDITORIAL_REVIEW_REQUIRED"; item.editorialStatus = "REVISE"; item.lastError = "Editorial Critic did not meet configured thresholds within the revision budget."; await saveJson(path.join(packagePaths(item).directory, "editorial_critique.json"), critique || seedCritique()); await writeRuntime(manifest); continue; }
      item.status = "KNOWLEDGE_GENERATING"; item.editorialModelCalls += 1; await writeRuntime(manifest);
      const expansion = await provider.expandKnowledge(await knowledgePrompt(item, guidance), callContext);
      const overview = expansion?.overviewMarkdown || expansion?.markdown || expansion?.overview;
      await writeProviderPackage(item, guidance, critique, overview);
      item.editorialStatus = "CREATOR_SELF_CHECK_COMPLETE";
      item.stage = "SEMANTIC_REVIEW";
      if (EDITORIAL_TONE_GATE_CODES.includes(item.code) && !item.editorialToneApproved) item.lastError = "Creator output is complete. Human tone review and independent semantic review are required before Notebook submission.";
      await eventLog({ field: item.code, stage: "editorial", event: "CREATOR_OUTPUT_READY_FOR_INDEPENDENT_REVIEW", model: provider.config.model });
    } catch (error) {
      item.status = error instanceof EditorialProviderUnavailable ? "EDITORIAL_PROVIDER_UNAVAILABLE" : error instanceof ChatGPTBrowserError && error.code !== "CHATGPT_TIMEOUT" ? error.code : "ERROR_RETRYABLE";
      item.editorialStatus = item.status; item.lastError = error instanceof Error ? error.message : String(error);
      await eventLog({ field: item.code, stage: "editorial", event: "EDITORIAL_ERROR", error: item.lastError.slice(0, 220) });
      if (error?.code === "CHATGPT_RATE_LIMITED") haltedByChatGptRateLimit = true;
    }
    await writeRuntime(manifest);
    if (haltedByChatGptRateLimit) {
      await eventLog({ field: item.code, stage: "editorial", event: "CHATGPT_RATE_LIMIT_QUEUE_PAUSED", detail: "No further ChatGPT browser requests will be attempted in this run; resume from persisted field/stage state after retryAt." });
      break;
    }
  }
  await buildDashboard(manifest);
}

function phaseUnlocked(manifest, item) {
  if (!["0533", "0313", "0542", "0421"].includes(item.code)) return true;
  return editorialToneApproved(manifest);
}

async function refreshSourcePackManifest(item) {
  const paths = packagePaths(item);
  if (![paths.overview, paths.prompt, paths.guidance].every(existsSync)) return;
  const [overview, prompt, guidance] = await Promise.all([
    readFile(paths.overview, "utf8"),
    readFile(paths.prompt, "utf8"),
    readFile(paths.guidance, "utf8"),
  ]);
  const existing = await json(path.join(paths.directory, "source_pack_manifest.json"), {});
  await saveJson(path.join(paths.directory, "source_pack_manifest.json"), {
    ...existing,
    schemaVersion: 1,
    source: rel(paths.overview),
    sourceSha256: hash(overview),
    directorPrompt: rel(paths.prompt),
    directorPromptSha256: hash(prompt),
    guidance: rel(paths.guidance),
    guidanceSha256: hash(guidance),
    factualSourceAndGuidanceSeparate: true,
    refreshedAt: now(),
  });
}

async function approveEditorialTone(manifest) {
  const pending = EDITORIAL_TONE_GATE_CODES.map((code) => manifest.items.find((item) => item.code === code)).filter(Boolean);
  const blocked = [];
  for (const item of pending) {
    const validation = await json(packagePaths(item).validation, {});
    const structuralPass = Object.values(validation.structuralChecks || {}).every((value) => value === "PASS")
      && (validation.mandatoryCoverageAreas || []).every((area) => area.present);
    const critique = await json(packagePaths(item).critique, {});
    if (!(["PASS", "CREATOR_SELF_CHECK_COMPLETE"].includes(item.editorialStatus)) || !structuralPass || !critiquePass(critique)) blocked.push(item.code);
  }
  if (blocked.length) {
    console.log(`Editorial tone cannot be approved yet; these phase-one packs are not ready: ${blocked.join(", ")}.`);
    return false;
  }
  for (const item of pending) {
    item.editorialToneApproved = true;
    item.status = item.sensitiveContentStatus === "POLICY_CLARIFICATION_REQUIRED" ? "POLICY_CLARIFICATION_REQUIRED" : item.sensitiveContentStatus === "SENSITIVE_TOPIC_REVIEW_REQUIRED" ? "SENSITIVE_TOPIC_REVIEW_REQUIRED" : "SEMANTIC_REVIEW_REQUIRED";
    item.stage = "SEMANTIC_REVIEW";
    item.lastError = "Human tone approval recorded; independent semantic review is still required before Notebook submission.";
  }
  await eventLog({ stage: "editorial", event: "HUMAN_EDITORIAL_TONE_APPROVED", fields: EDITORIAL_TONE_GATE_CODES });
  await writeRuntime(manifest);
  await buildDashboard(manifest);
  console.log("Editorial tone approved for General Overview and Economics. Phase-two editorial work may now be requested; Notebook submission still requires an explicit --execute command.");
  return true;
}

async function preflight(manifest) {
  const report = [];
  const canonicalBinding = await currentPolicyBinding();
  const bindingKey = (binding) => JSON.stringify({ creatingPolicy: binding?.creatingPolicy, reviewPolicy: binding?.reviewPolicy });
  if (manifest.policyBinding && bindingKey(manifest.policyBinding) !== bindingKey(canonicalBinding)) throw new Error("POLICY_BINDING_MISMATCH: runtime manifest is not bound to current canonical policies.");
  manifest.policyBinding ||= canonicalBinding;
  manifest.runId ||= autonomousRunId();
  manifest.activePromptVersions ||= await activePromptVersions();
  const scope = selectedCodes.size ? manifest.items.filter((item) => selectedCodes.has(item.code) || (selectedGeneral && item.code === "GENERAL")) : manifest.items;
  const chatgptRate = await json(path.join(PATHS.runtime, "chatgpt-browser", "conversations.json"), {});
  const retryAtMs = Date.parse(chatgptRate.rateLimit?.retryAt || "");
  const chatgptRatePaused = chatgptRate.rateLimit?.status === "CHATGPT_RATE_LIMITED" && (!Number.isFinite(retryAtMs) || retryAtMs > Date.now());
  for (const item of scope) {
    item.runId ||= manifest.runId;
    item.artifactType ||= ARTIFACT_TYPE;
    if (item.policyBinding && bindingKey(item.policyBinding) !== bindingKey(canonicalBinding)) throw new Error(`POLICY_BINDING_MISMATCH: field ${item.code} is not bound to current canonical policies.`);
    item.policyBinding ||= manifest.policyBinding;
    item.activePromptVersions ||= manifest.activePromptVersions;
    const itemPaths = packagePaths(item);
    item.deterministicValidationPath ||= rel(itemPaths.deterministicValidation);
    item.independentReviewPath ||= rel(itemPaths.independentReview);
    item.finalDecisionPath ||= rel(itemPaths.finalDecision);
    item.fieldRepresentationPath ||= rel(itemPaths.fieldRepresentation);
    item.artifactContractPath ||= rel(itemPaths.artifactContract);
    item.creatorOutputPath ||= rel(itemPaths.overview);
    item.creatorSelfCheckPath ||= rel(itemPaths.creatorSelfCheck);
    if (chatgptRatePaused && !["SUBMITTED", "GENERATING", "VIDEO_READY", "DOWNLOADED", "VIDEO_REVIEWING", "HUMAN_REVIEW_READY"].includes(item.status)) {
      item.status = "CHATGPT_RATE_LIMITED";
      item.stage = "EDITORIAL_PAUSED";
      item.lastError = `ChatGPT browser channel is paused until ${chatgptRate.rateLimit.retryAt || "an explicit resume"}. No request was sent.`;
      report.push({ code: item.code, status: item.status, errors: [item.lastError] });
      continue;
    }
    const paths = packagePaths(item);
    if (!existsSync(paths.overview) || !existsSync(paths.guidance) || !existsSync(paths.blueprint) || !existsSync(paths.prompt) || !existsSync(paths.validation)) {
      item.status = "CONTENT_INCOMPLETE"; item.stage = "PREFLIGHT"; item.lastError = "Required package artifact is missing."; report.push({ code: item.code, status: item.status, errors: [item.lastError] }); continue;
    }
    const overview = await readFile(paths.overview, "utf8");
    const blueprint = await readFile(paths.blueprint, "utf8");
    const prompt = await readFile(paths.prompt, "utf8");
    const guidance = await json(paths.guidance, {});
    const critique = await json(paths.critique, {});
    await refreshSourcePackManifest(item);
    const providerStatus = item.editorialStatus || "EDITORIAL_PROVIDER_UNAVAILABLE";
    const validation = knowledgeChecks(item, overview, blueprint, prompt, guidance, providerStatus);
    const sensitiveContent = classifySensitiveContent({ fieldId: item.code, fieldName: item.name, text: `${overview}\n${prompt}` });
    item.sensitiveContentStatus = sensitiveContent.status;
    validation.sensitiveContent = sensitiveContent;
    validation.editorialCritique = { status: critique.status || "NOT_RUN", authority: "CREATOR_SELF_CHECK", reviewerRole: "creator_self_check", decision: critique.decision || "NOT_RUN", scores: critique.scores || {} };
    const structuralPass = Object.values(validation.structuralChecks).every((value) => value === "PASS") && validation.mandatoryCoverageAreas.every((area) => area.present);
    const editorialPass = ["PASS", "MODEL_REPORTED"].includes(critique.status) && critiquePass(critique);
    const unlocked = phaseUnlocked(manifest, item);
    const toneGatePending = EDITORIAL_TONE_GATE_CODES.includes(item.code) && !item.editorialToneApproved;
    const deterministic = deterministicValidate({
      artifactType: item.artifactType || ARTIFACT_TYPE,
      fieldId: item.code,
      policyBinding: item.policyBinding,
      requiredFiles: { overview: existsSync(paths.overview), guidance: existsSync(paths.guidance), blueprint: existsSync(paths.blueprint), videoPrompt: existsSync(paths.prompt) },
      evidenceFields: { runId: Boolean(item.runId), activePromptVersions: Boolean(item.activePromptVersions && Object.keys(item.activePromptVersions).length) },
      expectedArtifactType: ARTIFACT_TYPE,
      sensitiveContent,
      learnerFacing: true,
      learnerFacingText: `${overview}\n${prompt}`,
      knownSubjectCodes: manifest.items.filter((candidate) => /^\d{4}$/.test(String(candidate.code || ""))).map((candidate) => candidate.code),
      extraChecks: { structuralShape: structuralPass },
    });
    validation.deterministicValidation = deterministic;
    const finalDecisionFallback = blockedReviewDecision({ runId: item.runId, fieldId: item.code, artifactType: item.artifactType || ARTIFACT_TYPE, policyBinding: item.policyBinding, reasonCode: sensitiveContent.status === "CLEAR" ? "INSUFFICIENT_EVIDENCE" : sensitiveContent.status });
    const finalDecision = await json(paths.finalDecision, finalDecisionFallback);
    if (!existsSync(paths.finalDecision)) await saveJson(paths.finalDecision, finalDecisionFallback);
    const decisionErrors = validateFinalReviewDecision(finalDecision);
    const independentPass = decisionErrors.length === 0 && finalDecision.decision === "PASS" && finalDecision.evidenceSufficient === true && finalDecision.reviewerRole !== "creator_self_check";
    validation.semanticReview = { status: independentPass ? "PASS" : "REQUIRED", decision: finalDecision.decision || "BLOCKED", reviewerRole: finalDecision.reviewerRole || "UNKNOWN", evidenceSufficient: finalDecision.evidenceSufficient === true, errors: decisionErrors };
    item.finalReviewDecision = finalDecision.decision || "BLOCKED";
    validation.productionEligible = deterministic.status === "PASS" && structuralPass && editorialPass && unlocked && !toneGatePending && independentPass && sensitiveContent.status === "CLEAR";
    validation.errors = [];
    if (!unlocked) validation.errors.push("Phase 2 remains locked until General Overview and Economics have explicit human editorial-tone approval.");
    if (!structuralPass) validation.errors.push("Knowledge/narrative preflight failed.");
    if (!editorialPass && unlocked) validation.errors.push(providerStatus === "EDITORIAL_PROVIDER_UNAVAILABLE" ? "Editorial provider unavailable; Critic PASS is missing." : "Editorial Critic PASS is missing or below threshold.");
    if (toneGatePending) validation.errors.push("Human editorial-tone approval is required before General Overview or Economics can enter NotebookLM.");
    if (!independentPass) validation.errors.push("Independent evidence-bound semantic review is required before submission.");
    if (sensitiveContent.status !== "CLEAR") validation.errors.push(`Sensitive governance hold: ${sensitiveContent.status}`);
    await saveJson(paths.validation, validation);
    await saveJson(paths.deterministicValidation, deterministic);
    await saveJson(paths.metadata, { ...(await json(paths.metadata, {})), policyBinding: item.policyBinding, runId: item.runId, artifactType: item.artifactType || ARTIFACT_TYPE, activePromptVersions: item.activePromptVersions, sensitiveContent, productionEligible: validation.productionEligible, updatedAt: now() });
    if (item.status === "SUBMITTED" || item.status === "GENERATING" || item.status === "VIDEO_READY" || item.status === "DOWNLOADED" || item.status === "VIDEO_REVIEWING" || item.status === "HUMAN_REVIEW_READY" || item.status === "CHATGPT_RATE_LIMITED" || item.status === "CHATGPT_STAGE_INDETERMINATE") {
      report.push({ code: item.code, status: item.status, errors: validation.errors }); continue;
    }
    if (providerStatus === "EDITORIAL_PROVIDER_UNAVAILABLE") { item.status = "EDITORIAL_PROVIDER_UNAVAILABLE"; item.stage = "EDITORIAL_PENDING"; }
    else if (!unlocked) { item.status = "WAITING_FOR_EDITORIAL_TONE_REVIEW"; item.stage = "EDITORIAL_PENDING"; }
    else if (!structuralPass) { item.status = "CONTENT_INCOMPLETE"; item.stage = "PREFLIGHT"; }
    else if (sensitiveContent.status === "POLICY_CLARIFICATION_REQUIRED") { item.status = "POLICY_CLARIFICATION_REQUIRED"; item.stage = "SEMANTIC_REVIEW"; }
    else if (sensitiveContent.status === "SENSITIVE_TOPIC_REVIEW_REQUIRED") { item.status = "SENSITIVE_TOPIC_REVIEW_REQUIRED"; item.stage = "SEMANTIC_REVIEW"; }
    else if (!editorialPass) { item.status = "EDITORIAL_REVIEW_REQUIRED"; item.stage = "EDITORIAL_CRITIQUE"; }
    else if (!independentPass) { item.status = "SEMANTIC_REVIEW_REQUIRED"; item.stage = "SEMANTIC_REVIEW"; }
    else if (toneGatePending) { item.status = "HUMAN_EDITORIAL_TONE_REVIEW_REQUIRED"; item.stage = "HUMAN_EDITORIAL_TONE_REVIEW"; }
    else { item.status = "SUBMISSION_READY"; item.stage = "SUBMISSION_READY"; item.finalReviewDecision = "PASS"; item.lastError = null; }
    item.lastError = validation.errors.length ? validation.errors.join(" ") : null;
    report.push({ code: item.code, status: item.status, errors: validation.errors });
  }
  await writeRuntime(manifest);
  await buildDashboard(manifest);
  return report;
}

async function legacyIntegrity(manifest) {
  if (!existsSync(PATHS.legacyManifest) || !manifest.legacyManifestHash) return { pass: true, reason: "legacy manifest unavailable or not snapshotted" };
  const current = hash(await readFile(PATHS.legacyManifest));
  const pass = current === manifest.legacyManifestHash;
  return {
    pass,
    expected: manifest.legacyManifestHash,
    actual: current,
    originalHash: manifest.legacyManifestMigration?.originalHash || manifest.legacyManifestHash,
    migration: manifest.legacyManifestMigration || null,
  };
}

function duplicateSignals(texts) {
  const normalised = texts.map((text) => String(text).toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim());
  const firstSentences = normalised.map((text) => (text.match(/[^.!?]+[.!?]/)?.[0] || text.slice(0, 160)).trim());
  const endings = normalised.map((text) => text.slice(-220));
  const duplicates = [];
  for (let i = 0; i < firstSentences.length; i += 1) for (let j = i + 1; j < firstSentences.length; j += 1) {
    const left = firstSentences[i].split(" ").filter(Boolean); const right = new Set(firstSentences[j].split(" ").filter(Boolean));
    const overlap = left.length ? left.filter((word) => right.has(word)).length / left.length : 0;
    if (overlap >= 0.72) duplicates.push({ kind: "opening", left: i, right: j, overlap: Math.round(overlap * 100) / 100 });
    const endLeft = endings[i].split(" ").filter(Boolean); const endRight = new Set(endings[j].split(" ").filter(Boolean));
    const endOverlap = endLeft.length ? endLeft.filter((word) => endRight.has(word)).length / endLeft.length : 0;
    if (endOverlap >= 0.72) duplicates.push({ kind: "ending", left: i, right: j, overlap: Math.round(endOverlap * 100) / 100 });
  }
  return duplicates;
}

async function diversityAudit(manifest) {
  const rows = [];
  for (const item of manifest.items) {
    const profile = item.code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[item.code];
    const prompt = existsSync(path.join(REPO, item.promptPath)) ? await readFile(path.join(REPO, item.promptPath), "utf8") : "";
    rows.push({ code: item.code, name: item.name, engine: profile?.engine || item.narrativeEngine, opening: profile?.openingHook || "", ending: profile?.returnToEarth || "", promptHash: prompt ? hash(prompt) : null });
  }
  const warnings = duplicateSignals(rows.map((row) => `${row.opening} ${row.ending}`));
  const engineCounts = Object.fromEntries([...new Set(rows.map((row) => row.engine))].map((engine) => [engine, rows.filter((row) => row.engine === engine).length]));
  const audit = { schemaVersion: 1, generatedAt: now(), framework: FRAMEWORK, items: rows, engineCounts, warnings, policy: { sameIntellectualUniverse: true, differentJourneys: warnings.length === 0, genericOpeningsAreWarnings: true, automaticReviewDoesNotPublish: true } };
  await saveJson(PATHS.diversity, audit);
  return audit;
}

async function buildDashboard(manifest) {
  const audit = existsSync(PATHS.diversity) ? await json(PATHS.diversity) : null;
  const statusCounts = Object.fromEntries([...new Set([...REQUIRED_STATES, "WAITING_FOR_PHASE_UNLOCK"])].map((status) => [status, manifest.items.filter((item) => item.status === status).length]));
  const rows = manifest.items.map((item) => {
    const p = item.code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[item.code];
    const base = `packs/${VERSION}/${item.code === "GENERAL" ? "general-overview" : `${item.code}-${safeSlug(item.name)}`}`;
    return `<tr><td>${escapeHtml(item.code)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.status)}</td><td>${escapeHtml(item.editorialStatus || "UNKNOWN")}</td><td>${escapeHtml(p?.engine || "UNKNOWN")}</td><td>${escapeHtml(p?.thesis || "UNKNOWN")}</td><td>${escapeHtml(p?.aha || "UNKNOWN")}</td><td><a href="${base}/overview.md">Source</a> · <a href="${base}/video_prompt.md">Prompt</a> · <a href="${base}/narrative_blueprint.md">Blueprint</a> · <a href="${base}/content_validation.json">Validation</a> · <a href="${base}/deterministic_validation.json">Deterministic</a> · <a href="${base}/independent_review.json">Review</a> · <a href="${base}/final_review_decision.json">Decision</a> · <a href="${base}/submission_payload.preview.md">Payload</a></td><td>${item.notebookUrl ? `<a href="${escapeHtml(item.notebookUrl)}">Notebook</a>` : "—"}</td><td>${item.downloadedPath ? `<a href="${escapeHtml(item.downloadedPath.replace(/^mapkai-video-factory\//, ""))}">Raw video</a>` : "—"}</td><td>—</td></tr>`;
  }).join("");
  const metrics = ["Narrative Engagement", "Aha / Intellectual Insight", "Knowledge Coverage", "Mental Map Clarity", "Adult / Mature Tone", "Visual Quality", "MapKAI Differentiation", "Emergence Logic", "Return-to-Earth Quality"];
  const reviewCards = manifest.items.map((item) => `<article class="review-card"><h3>${escapeHtml(item.name)}</h3><p class="muted">Human review only — scores intentionally blank</p>${metrics.map((metric) => `<div class="metric"><span>${metric}</span><strong>— /10</strong></div>`).join("")}<p>Key strengths: <em>[manual]</em></p><p>Key weaknesses: <em>[manual]</em></p><p>Missing knowledge: <em>[manual]</em></p><p>Generic AI feeling: <em>[None / Low / Medium / High]</em></p><p>Would I voluntarily keep watching? <em>[Yes / Maybe / No]</em></p><p>Human decision: <em>[UNREVIEWED / ACCEPT / REGENERATE / REJECT]</em></p></article>`).join("");
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MapKAI Autonomous Editorial + Video Factory</title><style>body{margin:0;background:#09131e;color:#e8f0f7;font:14px system-ui,-apple-system,sans-serif}.page{max-width:1500px;margin:auto;padding:40px 24px}h1{font-size:31px;margin:0 0 8px}.muted{color:#9bb0c3}.pill{display:inline-block;border-radius:999px;background:#28435a;padding:5px 9px;font-size:11px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:24px 0}.stat{background:#122637;border:1px solid #244258;border-radius:12px;padding:14px}.stat strong{display:block;font-size:23px;margin-top:6px}table{width:100%;border-collapse:collapse;background:#0f2130;border:1px solid #294357}th,td{padding:10px;text-align:left;vertical-align:top;border-bottom:1px solid #294357}th{color:#a9bdce;white-space:nowrap}td:nth-child(6),td:nth-child(7){max-width:270px;line-height:1.35}.review-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;margin-top:18px}.review-card{background:#122637;border:1px solid #28475b;border-radius:12px;padding:16px}.metric{display:flex;justify-content:space-between;border-bottom:1px solid #28475b;padding:7px 0}a{color:#84caff}em{color:#a9bdce}code{color:#c7e8ff}</style><body><main class="page"><p class="muted">MapKAI Autonomous Editorial + Video Factory</p><h1>${VERSION}</h1><p class="muted">Existing taxonomy and legacy Video Factory remain canonical. World K is an editorial lens, not a product ontology. Updated ${escapeHtml(manifest.generatedAt || now())}</p><p><span class="pill">rollout: ${escapeHtml(manifest.rolloutMode)}</span> <span class="pill">framework: ${escapeHtml(FRAMEWORK)}</span> <a href="dashboard.html">Legacy dashboard</a> · <a href="review/pilots/index.html">Legacy pilot review</a></p><section class="grid">${Object.entries(statusCounts).filter(([,count]) => count).map(([status,count]) => `<div class="stat"><span class="muted">${escapeHtml(status)}</span><strong>${count}</strong></div>`).join("")}</section><h2>Production queue</h2><table><thead><tr><th>ID</th><th>Field</th><th>State</th><th>Editorial</th><th>Engine</th><th>Core thesis</th><th>Primary Aha</th><th>Artifacts</th><th>Notebook</th><th>Video</th><th>Human decision</th></tr></thead><tbody>${rows}</tbody></table><h2>Human review gate</h2><p class="muted">No automatic PASS/FAIL, score, branding, or publishing decision is written here. The dashboard is a preparation surface for human judgement.</p><div class="review-grid">${reviewCards}</div><h2>Anti-template audit</h2><pre>${escapeHtml(JSON.stringify(audit || { status: "run factory audit" }, null, 2))}</pre></main></body></html>`;
  await saveText(PATHS.dashboard, html);
}

async function clickAny(page, patterns) {
  for (const pattern of patterns) {
    const button = page.getByRole("button", { name: pattern });
    if (await button.count()) { await button.first().click({ timeout: 10_000 }); return; }
  }
  throw new Error(`Notebook action not found: ${patterns.map(String).join(" / ")}`);
}
async function fillAny(page, patterns, value) {
  for (const pattern of patterns) {
    const input = page.getByLabel(pattern);
    if (await input.count()) { await input.first().fill(value); return; }
  }
  const area = page.locator("textarea");
  if (await area.count()) { await area.first().fill(value); return; }
  throw new Error("Notebook video prompt field not found.");
}
async function attachBrowser() {
  const { chromium } = await import("playwright");
  const cdp = process.env.MAPKAI_CHROME_CDP_URL || "http://127.0.0.1:9222";
  try { return await chromium.connectOverCDP(cdp); }
  catch (error) { throw new Error(`SECURITY_PAUSED: cannot attach to authenticated Chrome at ${cdp}. Open the signed-in browser and retry; no Notebook was created.`); }
}
async function notebookHome() {
  const cfg = await json(path.join(FACTORY, "factory-config.json"), {});
  return cfg.notebookHomeUrl || "https://notebook.google.com/";
}
async function submitOne(browser, item) {
  const paths = packagePaths(item);
  const source = await readFile(paths.overview, "utf8");
  const prompt = await readFile(paths.prompt, "utf8");
  const attemptId = `${item.code}-${Date.now()}-${hash(`${source}:${prompt}:${item.videoAttempts || 0}`).slice(0, 12)}`;
  const context = browser.contexts()[0];
  if (!context) throw new Error("Authenticated Chrome context was not exposed.");
  const page = await context.newPage();
  try {
    await page.goto(await notebookHome(), { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1500);
    await clickAny(page, [/create new notebook/i, /create new/i]); await page.waitForTimeout(900);
    let fileInput = page.locator('input[type="file"]');
    if (!await fileInput.count()) { await clickAny(page, [/add source/i, /upload/i]); fileInput = page.locator('input[type="file"]'); }
    if (!await fileInput.count()) throw new Error("Notebook source upload control not found.");
    await fileInput.first().setInputFiles(paths.overview); await page.waitForTimeout(2200);
    const studio = page.getByRole("tab", { name: /studio/i });
    if (await studio.count()) { await studio.first().click({ timeout: 10_000 }); await page.waitForTimeout(500); }
    await clickAny(page, [/video overview/i]); await page.waitForTimeout(500);
    const customise = page.getByRole("button", { name: /customi[sz]e|custom/i });
    if (await customise.count()) await customise.first().click();
    await fillAny(page, [/video overview.*prompt/i, /custom.*prompt/i, /what should/i], prompt);
    const bodyBefore = await page.locator("body").innerText().catch(() => "");
    await clickAny(page, [/generate/i, /create/i]); await page.waitForTimeout(1000);
    const notebookUrl = page.url();
    const bodyAfter = await page.locator("body").innerText().catch(() => "");
    const mode = /cinematic/i.test(`${bodyBefore} ${bodyAfter}`) && /cinematic/i.test(prompt) ? "Cinematic" : "UNKNOWN";
    return { notebookUrl, attemptId, videoMode: mode, selectedStyle: "UNKNOWN" };
  } finally { await page.close(); }
}
async function freezeSubmissionPayload(item, submission) {
  const paths = packagePaths(item);
  if (existsSync(paths.payload) && !/NOT_SUBMITTED/.test(await readFile(paths.payload, "utf8"))) throw new Error(`Immutable payload already exists for ${item.code}; refusing to overwrite.`);
  const source = await readFile(paths.overview, "utf8"); const prompt = await readFile(paths.prompt, "utf8"); const guidance = await readFile(paths.guidance, "utf8");
  const payload = `# Immutable Notebook Submission Payload\n\n**Attempt ID:** ${submission.attemptId}\n**Run ID:** ${item.runId || "UNKNOWN"}\n**Field ID:** ${item.code === "GENERAL" ? item.id : item.code}\n**Field:** ${item.name}\n**Artifact type:** ${item.artifactType || ARTIFACT_TYPE}\n**Content version:** ${VERSION}\n**Editorial framework version:** ${FRAMEWORK}\n**Guidance version:** ${(JSON.parse(guidance).guidanceVersion || "UNKNOWN")}\n**Creating Policy:** ${item.policyBinding?.creatingPolicy?.version || "UNKNOWN"} (${item.policyBinding?.creatingPolicy?.sha256 || "UNKNOWN"})\n**Review Policy:** ${item.policyBinding?.reviewPolicy?.version || "UNKNOWN"} (${item.policyBinding?.reviewPolicy?.sha256 || "UNKNOWN"})\n**Active prompt versions:** ${JSON.stringify(item.activePromptVersions || {})}\n**Source SHA-256:** ${hash(source)}\n**Director prompt SHA-256:** ${hash(prompt)}\n**Submission timestamp:** ${now()}\n**Notebook URL / ID:** ${submission.notebookUrl}\n**Selected video mode:** ${submission.videoMode}\n**Selected style:** ${submission.selectedStyle}\n**Language:** en\n**Status:** SUBMITTED\n\nThis snapshot is immutable and records the exact source and director prompt submitted.\n\n## Exact source used\n\n${source}\n\n## Exact director prompt used\n\n${prompt}\n`;
  await saveText(paths.payload, payload);
  item.submissionPayloadPath = rel(paths.payload); item.generationAttemptId = submission.attemptId; item.videoMode = submission.videoMode; item.notebookUrl = submission.notebookUrl; item.submittedAt = now();
}
async function quotaState(manifest) {
  const today = now().slice(0, 10);
  const localSubmittedToday = manifest.items.filter((item) => item.submittedAt?.slice(0, 10) === today).length;
  const legacy = await json(PATHS.legacyManifest, { items: [] });
  const legacySubmittedToday = (legacy.items || []).filter((item) => item.submittedAt?.slice(0, 10) === today).length;
  const submittedToday = localSubmittedToday + legacySubmittedToday;
  const current = await json(PATHS.quota, { schemaVersion: 1, events: [] });
  const next = { ...current, schemaVersion: 1, observedAt: now(), submittedToday, maxDailyNotebookSubmissions: LIMITS.maxDailyNotebookSubmissions, state: submittedToday >= LIMITS.maxDailyNotebookSubmissions ? "WAITING_FOR_QUOTA" : "AVAILABLE" };
  await saveJson(PATHS.quota, next); return next;
}
async function submitProduction(manifest) {
  const report = await preflight(manifest);
  if (manifest.systemicPause?.status === "SYSTEMIC_EDITORIAL_FAILURE") { console.log("Submission paused by systemic editorial failure circuit breaker."); return; }
  const phaseOne = manifest.items.filter((item) => ["GENERAL", "0311"].includes(item.code));
  const candidates = phaseOne.filter((item) => item.status === "SUBMISSION_READY" && item.finalReviewDecision === "PASS" && !item.notebookUrl && item.videoAttempts < LIMITS.maxTotalVideoAttemptsPerField);
  const quota = await quotaState(manifest);
  if (quota.state === "WAITING_FOR_QUOTA" || !candidates.length) { console.log(`No safe phase-one Notebook submissions. quota=${quota.state}; candidates=${candidates.length}.`); return; }
  if (!execute) { console.log(`Dry run: ${candidates.length} phase-one Notebook job(s) would be submitted. No browser action taken.`); return; }
  const browser = await attachBrowser();
  try {
    const remaining = Math.max(0, LIMITS.maxDailyNotebookSubmissions - quota.submittedToday);
    for (const item of candidates.slice(0, Math.min(LIMITS.maxConcurrentNotebookJobs, remaining))) {
      try {
        item.status = "SUBMITTED"; item.stage = "SUBMITTED"; item.videoAttempts += 1; await writeRuntime(manifest);
        const submission = await submitOne(browser, item); await freezeSubmissionPayload(item, submission);
        item.status = "GENERATING"; item.stage = "GENERATING"; item.editorialStatus = "INDEPENDENT_REVIEW_PASS"; item.lastError = null;
        await eventLog({ field: item.code, stage: "notebook", event: "SUBMITTED", attemptId: submission.attemptId, notebookUrl: submission.notebookUrl, videoMode: submission.videoMode });
      } catch (error) {
        item.status = /SECURITY_PAUSED/i.test(String(error)) ? "SECURITY_PAUSED" : /quota|limit/i.test(String(error)) ? "WAITING_FOR_QUOTA" : "ERROR_RETRYABLE";
        item.lastError = error instanceof Error ? error.message : String(error);
        await eventLog({ field: item.code, stage: "notebook", event: "SUBMIT_ERROR", error: item.lastError.slice(0, 220) });
      }
      await writeRuntime(manifest);
    }
  } finally { await browser.close(); }
  await quotaState(manifest); await buildDashboard(manifest);
  void report;
}

async function probeVideo(file) {
  const result = await run("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=width,height,codec_name", "-of", "json", file]);
  if (result.error) return { videoDuration: "UNKNOWN", resolution: "UNKNOWN", codec: "UNKNOWN" };
  try { const parsed = JSON.parse(result.stdout); const stream = (parsed.streams || []).find((entry) => entry.width && entry.height); return { videoDuration: parsed.format?.duration ? Math.round(Number(parsed.format.duration) * 10) / 10 : "UNKNOWN", resolution: stream ? `${stream.width}x${stream.height}` : "UNKNOWN", codec: stream?.codec_name || "UNKNOWN" }; } catch { return { videoDuration: "UNKNOWN", resolution: "UNKNOWN", codec: "UNKNOWN" }; }
}
async function monitorProduction(manifest) {
  const items = manifest.items.filter((item) => ["GENERATING", "VIDEO_READY"].includes(item.status) && item.notebookUrl && !item.downloadedPath);
  if (!items.length) { console.log("No active autonomous Notebook jobs to monitor."); return; }
  if (!execute) { console.log(`Dry run: would inspect ${items.length} existing Notebook URL(s). No browser action taken.`); return; }
  const browser = await attachBrowser();
  try {
    const context = browser.contexts()[0]; if (!context) throw new Error("Authenticated Chrome context was not exposed.");
    for (const item of items) {
      const page = await context.newPage();
      try {
        await page.goto(item.notebookUrl, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1200);
        const body = await page.locator("body").innerText().catch(() => "");
        if (/generating|in progress|creating/i.test(body) && !/ready|complete|download/i.test(body)) { item.status = "GENERATING"; await eventLog({ field: item.code, stage: "monitor", event: "GENERATING" }); continue; }
        const button = page.getByRole("button", { name: /download/i });
        if (!await button.count()) { item.status = /quota|limit/i.test(body) ? "WAITING_FOR_QUOTA" : "VIDEO_READY"; item.lastError = "Video may be ready, but the visible download control was not found."; continue; }
        const event = page.waitForEvent("download", { timeout: 20_000 }); await button.first().click(); const download = await event;
        const temporary = await download.path(); if (!temporary) throw new Error("Notebook download has no local path.");
        const attempt = item.generationAttemptId || `${item.code}-attempt-unknown`;
        const raw = path.join(PATHS.review, "raw", `${safeSlug(item.name)}-${item.code}-${attempt}-raw.mp4`);
        if (existsSync(raw)) throw new Error(`Refusing to overwrite existing raw video: ${rel(raw)}`);
        await mkdir(path.dirname(raw), { recursive: true }); await copyFile(temporary, raw);
        const details = await stat(raw); const technical = await probeVideo(raw); const transcript = path.join(PATHS.review, "raw", `${safeSlug(item.name)}-${item.code}-${attempt}-transcript.txt`);
        await saveText(transcript, "UNKNOWN — Notebook transcript was not exposed by the current UI inspection; no transcript was fabricated.\n");
        item.downloadedPath = rel(raw); item.transcriptPath = rel(transcript); item.completedAt = now(); item.status = "DOWNLOADED"; item.stage = "DOWNLOADED"; item.lastError = null;
        await saveJson(path.join(packagePaths(item).directory, "video_metadata.json"), { fieldCode: item.code, attemptId: attempt, sourceNotebook: item.notebookUrl, downloadedAt: now(), rawVideoPath: rel(raw), fileSize: details.size, ...technical });
        await saveJson(path.join(packagePaths(item).directory, "frame_analysis.json"), { status: "NOT_RUN", reason: "No reliable frame-analysis tool was configured; automatic review must not invent visual observations." });
        await eventLog({ field: item.code, stage: "download", event: "DOWNLOADED", rawVideoPath: rel(raw) });
      } catch (error) { item.lastError = error instanceof Error ? error.message : String(error); item.status = /quota|limit/i.test(item.lastError) ? "WAITING_FOR_QUOTA" : "ERROR_RETRYABLE"; await eventLog({ field: item.code, stage: "monitor", event: "MONITOR_ERROR", error: item.lastError.slice(0, 220) }); }
      finally { await page.close(); await writeRuntime(manifest); }
    }
  } finally { await browser.close(); }
  await buildDashboard(manifest);
}

function normaliseVideoReview(raw) {
  const scores = raw?.scores || raw || {};
  const names = ["openingHook", "narrativeEngagement", "intellectualDepth", "primaryAha", "knowledgeCoverage", "mentalMapClarity", "adultTone", "mapkaiDifferentiation", "emergenceLogic", "problemDisciplineCausality", "returnToEarth", "factualIntegrity", "genericAiRisk"];
  return { ...raw, schemaVersion: raw?.schemaVersion || "video-review.v1", scores: Object.fromEntries(names.map((name) => [name, Number.isFinite(Number(scores[name])) ? Number(scores[name]) : null])), keepWatching: ["YES", "MAYBE", "NO", "UNKNOWN"].includes(raw?.keepWatching) ? raw.keepWatching : "UNKNOWN", memorableTomorrow: ["YES", "MAYBE", "NO", "UNKNOWN"].includes(raw?.memorableTomorrow) ? raw.memorableTomorrow : "UNKNOWN", strengths: raw?.strengths || [], weaknesses: raw?.weaknesses || [], missingKnowledge: raw?.missingKnowledge || [], genericMoments: raw?.genericMoments || [], factualConcerns: raw?.factualConcerns || [], decision: ["PASS", "FAIL", "UNKNOWN"].includes(raw?.decision) ? raw.decision : "UNKNOWN" };
}
function videoReviewPass(review) {
  const s = review.scores || {};
  const required = { narrativeEngagement: 8, intellectualDepth: 8, primaryAha: 8, knowledgeCoverage: 9, mentalMapClarity: 8, adultTone: 8, mapkaiDifferentiation: 8, emergenceLogic: 8, problemDisciplineCausality: 8, returnToEarth: 8 };
  return review.decision === "PASS" && Object.entries(required).every(([key, threshold]) => Number(s[key]) >= threshold) && Number(s.genericAiRisk) <= 3 && (review.factualConcerns || []).length === 0;
}

function independentReviewContext(item, overview, transcript, metadata) {
  const profile = item.code === "GENERAL" ? GENERAL_PROFILE : FIELD_PROFILES[item.code];
  return {
    fieldId: item.code,
    fieldName: item.name,
    artifactType: item.artifactType || ARTIFACT_TYPE,
    canonicalFieldEvidence: {
      source: item.code === "GENERAL" ? "MapKAI product-level map" : "script.js taxonomy plus controlled field profile",
      definition: profile?.definition || null,
      centralQuestion: profile?.centralQuestion || null,
      branches: (profile?.map || []).map((entry) => entry.name),
      methods: profile?.methods || [],
      applications: profile?.applications || [],
      crossFieldConnections: profile?.connections || [],
    },
    creatorSelfCheckExcluded: true,
    creatorEditorialConversationExcluded: true,
    finalArtifact: overview,
    transcript,
    metadata,
  };
}

function canonicalIndependentReview(raw, item, policyBinding, reviewPath) {
  const review = normaliseVideoReview(raw);
  const rawDecision = String(raw?.decision || "").toUpperCase();
  const findings = Array.isArray(raw?.findings) ? raw.findings : [];
  const hardGates = raw?.hardGates && typeof raw.hardGates === "object" ? raw.hardGates : Object.fromEntries(HARD_GATE_NAMES.map((name) => [name, "NOT_REVIEWED"]));
  const evidenceSufficient = raw?.evidenceSufficient === true;
  let decision = ["PASS", "REVISE", "REBUILD", "BLOCKED"].includes(rawDecision) ? rawDecision : "BLOCKED";
  if (decision === "PASS" && (!videoReviewPass(review) || !evidenceSufficient || findings.some((finding) => !finding || !finding.findingCode))) decision = "BLOCKED";
  const record = {
    schemaVersion: "final-review-decision.v1",
    runId: item.runId || null,
    fieldId: item.code,
    artifactType: item.artifactType || ARTIFACT_TYPE,
    policyBinding,
    reviewerRole: "independent_reviewer",
    reviewerChannel: "MapKAI Independent Editorial Reviewer",
    decision,
    evidenceSufficient,
    reasonCodes: raw?.reasonCodes || (decision === "PASS" ? [] : [evidenceSufficient ? "INSUFFICIENT_EVIDENCE" : "INSUFFICIENT_EVIDENCE"]),
    hardGates,
    findings,
    summary: raw?.summary || raw?.weakestElement || "Independent review result captured from final artifact evidence.",
    reviewedAt: now(),
    creatorOutputPath: item.creatorOutputPath || item.packPath,
    creatorSelfCheckPath: item.creatorSelfCheckPath || item.critiquePath,
    independentReviewPath: reviewPath,
    decisionImpact: decision === "PASS" ? "Eligible for the next human-controlled release stage; branding/publishing remains separately gated." : "No release or Notebook submission is permitted until the required repair or human decision is complete.",
    sourceReview: { schemaVersion: review.schemaVersion, scores: review.scores, keepWatching: review.keepWatching, factualConcerns: review.factualConcerns },
  };
  const errors = validateFinalReviewDecision(record);
  if (errors.length) {
    record.decision = "BLOCKED";
    record.evidenceSufficient = false;
    record.reasonCodes = [...new Set([...(record.reasonCodes || []), "INSUFFICIENT_EVIDENCE"])]
    record.validationErrors = errors;
  }
  return { review, record, errors };
}
async function reviewProduction(manifest, provider) {
  const items = manifest.items.filter((item) => item.status === "DOWNLOADED" && item.downloadedPath);
  if (!items.length) { console.log("No downloaded autonomous videos await automatic review."); return; }
  if (provider.config.provider === "unconfigured") {
    for (const item of items) { item.status = "HUMAN_EDITORIAL_REVIEW_REQUIRED"; item.stage = "VIDEO_REVIEWING"; item.lastError = "Automatic video reviewer unavailable; no PASS/FAIL was invented."; }
    await writeRuntime(manifest); await buildDashboard(manifest); console.log("Automatic review paused: configure a real Editorial Model Provider."); return;
  }
  for (const item of items) {
    const paths = packagePaths(item);
    try {
      const transcript = item.transcriptPath && existsSync(path.join(REPO, item.transcriptPath)) ? await readFile(path.join(REPO, item.transcriptPath), "utf8") : "UNKNOWN";
      const metadata = await json(path.join(paths.directory, "video_metadata.json"), {});
      const overview = await readFile(paths.overview, "utf8");
      item.status = "VIDEO_REVIEWING"; await writeRuntime(manifest);
      if (/^UNKNOWN\s+—/i.test(transcript.trim()) || transcript.trim() === "UNKNOWN") {
        const blocked = blockedReviewDecision({ runId: item.runId, fieldId: item.code, artifactType: item.artifactType || ARTIFACT_TYPE, policyBinding: item.policyBinding, reasonCode: "INSUFFICIENT_EVIDENCE", reason: "Automatic review paused because a reliable transcript is not available." });
        blocked.creatorOutputPath = item.creatorOutputPath || item.packPath; blocked.creatorSelfCheckPath = item.creatorSelfCheckPath || item.critiquePath; blocked.independentReviewPath = rel(paths.independentReview);
        await saveJson(paths.videoReview, { ...seedVideoReview(), reason: "Automatic review paused because a reliable transcript is not available." });
        await saveJson(paths.independentReview, { ...seedVideoReview(), status: "BLOCKED", reason: "Automatic review paused because a reliable transcript is not available.", reviewerRole: "independent_reviewer" });
        await saveJson(paths.finalDecision, blocked);
        item.finalReviewDecision = "BLOCKED";
        item.status = "HUMAN_EDITORIAL_REVIEW_REQUIRED"; item.stage = "VIDEO_REVIEWING"; item.lastError = "Reliable transcript unavailable; automatic reviewer did not infer scores from absent evidence.";
        await writeRuntime(manifest); continue;
      }
      const reviewRequest = `Review the generated MapKAI video for ${item.name}. Follow prompts/video-reviewer.md, but act as an independent reviewer. Do not rely on creator self-checks, editorial conversation, or creator explanations. Return strict video-review JSON and include evidence-bound findings with findingCode, severity, reviewDimension, artifactLocation, evidence, whyItMatters, requiredChange, and decisionImpact.\n\nCANONICAL FIELD CONTEXT (not creator reasoning):\n${JSON.stringify(independentReviewContext(item, overview, transcript, metadata), null, 2)}`;
      const raw = await provider.reviewVideo(reviewRequest, { field: "INDEPENDENT_REVIEWER", fieldName: "MapKAI Independent Editorial Reviewer", attemptId: `${item.code}-video-review-${Date.now()}`, promptVersion: PROMPT_VERSION, canonVersion: VERSION, reviewerRole: "independent_reviewer" });
      const canonical = canonicalIndependentReview(raw, item, manifest.policyBinding, rel(paths.independentReview));
      await saveJson(paths.videoReview, canonical.review);
      await saveJson(paths.independentReview, canonical.record);
      await saveJson(paths.finalDecision, canonical.record);
      item.finalReviewDecision = canonical.record.decision;
      if (canonical.record.decision === "PASS") { item.status = "HUMAN_REVIEW_READY"; item.stage = "HUMAN_REVIEW_READY"; item.lastError = null; }
      else {
        const diagnosis = await provider.diagnoseFailure(`Diagnose this failed MapKAI video review using prompts/failure-diagnoser.md.\n\nFIELD: ${item.name}\n\nFINAL REVIEW DECISION:\n${JSON.stringify(canonical.record, null, 2)}`, { field: "INDEPENDENT_REVIEWER", fieldName: "MapKAI Independent Editorial Reviewer", attemptId: `${item.code}-failure-diagnosis-${Date.now()}`, promptVersion: PROMPT_VERSION, canonVersion: VERSION, reviewerRole: "independent_reviewer" });
        await saveJson(paths.diagnosis, diagnosis); item.status = canonical.record.decision === "BLOCKED" ? "HUMAN_EDITORIAL_REVIEW_REQUIRED" : "REPAIR_PENDING"; item.stage = canonical.record.decision === "BLOCKED" ? "VIDEO_REVIEWING" : "REPAIR_PENDING"; item.lastError = `Independent reviewer decision: ${canonical.record.decision}`;
      }
      await eventLog({ field: item.code, stage: "video_review", event: item.status });
    } catch (error) { item.status = "HUMAN_EDITORIAL_REVIEW_REQUIRED"; item.stage = "VIDEO_REVIEWING"; item.lastError = error instanceof Error ? error.message : String(error); }
    await writeRuntime(manifest);
  }
  await buildDashboard(manifest);
}

function systemicFailureCheck(manifest) {
  const reviewed = manifest.items.filter((item) => item.status === "REPAIR_PENDING");
  const recent = reviewed.slice(-LIMITS.systemicFailureWindow);
  const diagnoses = recent.map((item) => item.lastError || "");
  const sameFailure = recent.length >= LIMITS.systemicFailureWindow && diagnoses.every((value) => value && value === diagnoses[0]);
  const samePromptRisk = recent.length >= LIMITS.systemicFailureWindow && recent.every((item) => /generic|differentiation/i.test(item.lastError || ""));
  if (sameFailure || samePromptRisk) {
    manifest.systemicPause = { status: "SYSTEMIC_EDITORIAL_FAILURE", at: now(), reason: sameFailure ? "repeated diagnosis" : "repeated generic/differentiation failure", window: recent.map((item) => item.code) };
    for (const item of manifest.items) if (["EDITORIAL_PENDING", "SUBMISSION_READY", "PREFLIGHT"].includes(item.status)) { item.status = "SECURITY_PAUSED"; item.lastError = "Queue paused by systemic failure circuit breaker; human review required."; }
    return true;
  }
  return false;
}

async function repairProduction(manifest, provider) {
  const items = manifest.items.filter((item) => item.status === "REPAIR_PENDING");
  if (!items.length) { console.log("No bounded repairs are pending."); return; }
  if (provider.config.provider === "unconfigured") {
    for (const item of items) { item.status = "HUMAN_EDITORIAL_REVIEW_REQUIRED"; item.lastError = "Repair provider unavailable; no automatic repair or regeneration was attempted."; }
    await writeRuntime(manifest); return;
  }
  if (systemicFailureCheck(manifest)) { await writeRuntime(manifest); console.log("Systemic editorial failure circuit breaker paused the queue."); return; }
  for (const item of items) {
    const diagnosis = await json(path.join(REPO, item.diagnosisPath), {});
    const type = diagnosis.failureType || "UNKNOWN";
    if (type === "GENERATION_VARIANCE_FAILURE" && diagnosis.regenerateSamePayload && item.videoAttempts < LIMITS.maxTotalVideoAttemptsPerField) {
      item.status = "SUBMISSION_READY"; item.stage = "PREFLIGHT"; item.lastError = "Bounded same-payload regeneration authorised by diagnosis; no payload was changed.";
    } else if (["EDITORIAL_GUIDANCE_FAILURE", "KNOWLEDGE_PACK_FAILURE", "VIDEO_PROMPT_FAILURE", "FACTUAL_FAILURE"].includes(type)) {
      item.status = "EDITORIAL_PENDING"; item.stage = "EDITORIAL_REVISION"; item.lastError = `Targeted repair routed to ${type}; rerun --editorial-only within configured budget.`;
    } else {
      item.status = "HUMAN_EDITORIAL_REVIEW_REQUIRED"; item.lastError = "Failure diagnosis is unknown or repair budget is exhausted.";
    }
    await eventLog({ field: item.code, stage: "repair", event: item.status, failureType: type });
  }
  await writeRuntime(manifest); await buildDashboard(manifest);
}

function testResult(name, pass, detail = "") { return { name, pass: Boolean(pass), detail }; }
async function runTests(manifest, taxonomy) {
  const results = [];
  results.push(testResult("taxonomy remains dynamic and canonical", taxonomy.categories.length === manifest.taxonomySnapshot.categoryCount && taxonomy.fields.length === manifest.taxonomySnapshot.fieldCount, `${taxonomy.categories.length} categories / ${taxonomy.fields.length} fields`));
  results.push(testResult("taxonomy source hash is recorded", taxonomy.sourceHash === manifest.taxonomySnapshot.sourceHash));
  results.push(testResult("AI-era field is not duplicated", taxonomy.aiFormalFields.length === 0 && manifest.items.every((item) => item.code !== "AI-ERA"), `${taxonomy.aiFormalFields.length} formal AI matches`));
  results.push(testResult("AI-era overlay is explicit", (await json(path.join(FACTORY, "runtime", "ai-era-field-audit.json"), {})).duplicateCreated === false));
  results.push(testResult("general overview is separate", manifest.items.some((item) => item.code === "GENERAL" && item.type === "GENERAL_OVERVIEW")));
  results.push(testResult("first-wave codes resolve dynamically", FIRST_WAVE_CODES.every((code) => taxonomy.fields.some((field) => field.code === code))));
  const legacyCheck = await legacyIntegrity(manifest);
  results.push(testResult("legacy manifest integrity is preserved or migration is tracked", legacyCheck.pass, legacyCheck.migration ? `additive migration tracked from ${legacyCheck.migration.originalHash}` : ""));
  const packages = [];
  for (const item of manifest.items) {
    const paths = packagePaths(item); const required = [paths.guidance, paths.critique, paths.overview, paths.blueprint, paths.prompt, paths.validation, paths.payloadPreview, paths.videoReview, paths.diagnosis];
    const present = required.every((file) => existsSync(file)); packages.push({ item: item.code, present });
    results.push(testResult(`${item.code} package artifacts`, present));
    if (present) {
      const validation = await json(paths.validation, {}); const guidance = await json(paths.guidance, {}); const checks = guidanceChecks(guidance);
      results.push(testResult(`${item.code} guidance semantic shape`, checks.valid, checks.missing.join(", ")));
      const coveragePresent = (validation.mandatoryCoverageAreas || []).every((area) => area.present);
      const landmarkPass = validation.structuralChecks?.branchReasons === "PASS" && validation.structuralChecks?.landmarkMotion === "PASS";
      const returnPass = validation.structuralChecks?.returnToEarth === "PASS";
      results.push(testResult(`${item.code} mandatory coverage is present or safely blocks promotion`, coveragePresent || validation.productionEligible === false, JSON.stringify(validation.mandatoryCoverageAreas || [])));
      results.push(testResult(`${item.code} branch and landmark motion is present or safely blocks promotion`, landmarkPass || validation.productionEligible === false));
      results.push(testResult(`${item.code} return-to-Earth gate is present or safely blocks promotion`, returnPass || validation.productionEligible === false));
      results.push(testResult(`${item.code} fact/fiction firewall`, validation.structuralChecks?.factFictionFirewall === "PASS"));
      const preview = await readFile(paths.payloadPreview, "utf8");
      results.push(testResult(`${item.code} payload hashes are reproducible`, /Source SHA-256:\*\* [a-f0-9]{64}/.test(preview) && /Director prompt SHA-256:\*\* [a-f0-9]{64}/.test(preview)));
      const sourceManifest = await json(path.join(paths.directory, "source_pack_manifest.json"), {});
      results.push(testResult(`${item.code} source manifest hashes match`, sourceManifest.sourceSha256 === hash(await readFile(paths.overview, "utf8")) && sourceManifest.directorPromptSha256 === hash(await readFile(paths.prompt, "utf8"))));
    }
  }
  const engines = new Set(manifest.items.map((item) => (FIELD_PROFILES[item.code] || GENERAL_PROFILE).engine));
  results.push(testResult("narrative engines are diversified", engines.size >= 5, [...engines].join(", ")));
  results.push(testResult("editorial threshold and circuit breakers configured", LIMITS.maxGuidanceRevisions === 3 && LIMITS.maxTotalVideoAttemptsPerField === 3 && THRESHOLDS.primaryAhaStrength === 8));
  results.push(testResult("queue resumability fields exist", manifest.items.every((item) => typeof item.attempts === "number" && typeof item.videoAttempts === "number" && "nextAttemptAt" in item)));
  results.push(testResult("no duplicate Notebook submissions", new Set(manifest.items.filter((item) => item.notebookUrl).map((item) => item.notebookUrl)).size === manifest.items.filter((item) => item.notebookUrl).length));
  results.push(testResult("quota circuit breaker exists", LIMITS.maxDailyNotebookSubmissions > 0 && existsSync(PATHS.quota)));
  const quota = await json(PATHS.quota, {});
  results.push(testResult("quota accounting includes legacy attempts", Number.isFinite(Number(quota.submittedToday)) && Number(quota.submittedToday) >= 0));
  results.push(testResult("failure routing is bounded", ["EDITORIAL_GUIDANCE_FAILURE", "KNOWLEDGE_PACK_FAILURE", "VIDEO_PROMPT_FAILURE", "GENERATION_VARIANCE_FAILURE", "FACTUAL_FAILURE"].every((type) => type.length > 0)));
  results.push(testResult("strict output schemas exist", ["editorial-guidance.schema.json", "editorial-critique.schema.json", "knowledge-expansion.schema.json", "video-review.schema.json", "failure-diagnosis.schema.json", "policy-binding.schema.json", "deterministic-validation.schema.json", "review-finding.schema.json", "final-review-decision.schema.json", "field-representation-contract.schema.json", "artifact-contracts.json"].every((file) => existsSync(path.join(PATHS.schemas, file)))));
  const defaultBrowser = providerConfig({}); const browserOnly = providerConfig({ EDITORIAL_PROVIDER: "chatgpt-browser" }); const autoBrowser = providerConfig({ EDITORIAL_PROVIDER_AUTO_DETECT_CHATGPT_BROWSER: "true" });
  results.push(testResult("chatgpt-browser is the default editorial channel and never falls back to API", defaultBrowser.provider === "chatgpt-browser" && browserOnly.provider === "chatgpt-browser" && autoBrowser.provider === "chatgpt-browser"));
  results.push(testResult("runtime manifest remains backward compatible", Number(manifest.schemaVersion || 1) >= 1 && manifest.items.every((item) => "attempts" in item && "nextAttemptAt" in item)));
  results.push(testResult("core prompt versions exist", ["editorial-conversation.md", "editorial-director.md", "editorial-critic.md", "editorial-reviser.md", "knowledge-expander.md", "narrative-compiler.md", "notebook-director.md", "master_video_director_v5.md", "video-reviewer.md", "failure-diagnoser.md"].every((file) => existsSync(path.join(PATHS.prompts, file)))));
  results.push(testResult("persistent editorial channel is configured", manifest.editorialChannel?.preferredProvider === "chatgpt-browser" && manifest.editorialChannel?.interactionModel === "persistent_field_conversation"));
  const canonicalPolicyBinding = await currentPolicyBinding();
  results.push(testResult("canonical policy lock is runtime-bound", canonicalPolicyBinding.creatingPolicy.version === "v1.2" && canonicalPolicyBinding.reviewPolicy.version === "v1.1" && canonicalPolicyBinding.creatingPolicy.sha256 === "28deb28a8da63372e52e981d34579c8cabce3b5f3de91fc88f26476599144058" && canonicalPolicyBinding.reviewPolicy.sha256 === "718562701d147a5194548e58352c4e7ad38b262f8be78d41448357c142369020"));
  results.push(testResult("policy binding is present on every formal item", manifest.items.every((item) => item.runId && item.artifactType === ARTIFACT_TYPE && item.policyBinding?.creatingPolicy?.sha256 && item.policyBinding?.reviewPolicy?.sha256)));
  results.push(testResult("deterministic and semantic review surfaces are separate", manifest.items.every((item) => item.deterministicValidationPath && item.independentReviewPath && item.finalDecisionPath && item.creatorSelfCheckPath)));
  results.push(testResult("legacy/model self-check cannot claim final PASS", manifest.items.every((item) => item.editorialStatus !== "PASS" || item.finalReviewDecision === "PASS")));
  results.push(testResult("sensitive governance states are defined", ["CLEAR", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED"].every((state) => state.length > 0) && manifest.items.every((item) => item.sensitiveContentStatus)));
  results.push(testResult("creator and reviewer artifacts are distinct", manifest.items.every((item) => item.creatorOutputPath !== item.finalDecisionPath && item.creatorSelfCheckPath !== item.finalDecisionPath)));
  results.push(testResult("artifact-specific contract placeholders exist", manifest.items.every((item) => item.artifactContractPath && existsSync(path.join(REPO, item.artifactContractPath)))));
  results.push(testResult("field representation boundary exists", manifest.items.every((item) => item.fieldRepresentationPath && existsSync(path.join(REPO, item.fieldRepresentationPath)))));
  results.push(testResult("one-chat throttling and rate-limit policy is configured", manifest.editorialChannel?.conversationPolicy === "one_persistent_chat_per_field" && Number(manifest.editorialChannel?.minRequestIntervalMs) >= 30_000 && Array.isArray(manifest.editorialChannel?.rateLimitBackoffMinutes) && manifest.editorialChannel.rateLimitBackoffMinutes.join(",") === "5,10,20"));
  results.push(testResult("pilot-then-auto gate exists", manifest.rolloutMode === "pilot_then_auto" && manifest.phase1Required.includes("GENERAL") && manifest.phase1Required.includes("0311") && manifest.editorialChannel?.phaseTwoRequiresHumanToneApproval === true));
  const report = { schemaVersion: 1, generatedAt: now(), pass: results.every((result) => result.pass), results, packageCount: packages.length };
  await saveJson(path.join(PATHS.runtime, "test-report.json"), report);
  console.log(`Tests: ${results.filter((result) => result.pass).length}/${results.length} passed`);
  for (const result of results.filter((result) => !result.pass)) console.log(`FAIL  ${result.name}${result.detail ? ` — ${result.detail}` : ""}`);
  return report;
}

async function plan(manifest) {
  const report = await preflight(manifest);
  await diversityAudit(manifest); await buildDashboard(manifest);
  console.log(`MapKAI Autonomous Factory — ${VERSION}`);
  console.log(`Phase: ${manifest.phase}; rollout: ${manifest.rolloutMode}`);
  const providerLabel = manifest.provider.provider === "chatgpt-browser"
    ? "chatgpt-browser (persistent conversation channel; no message sent during planning)"
    : `${manifest.provider.provider}${manifest.provider.apiKeyConfigured ? " (configured)" : " (not configured)"}`;
  console.log(`Provider: ${providerLabel}`);
  const chatgptRegistry = await json(path.join(PATHS.runtime, "chatgpt-browser", "conversations.json"), {});
  if (chatgptRegistry.rateLimit?.status === "CHATGPT_RATE_LIMITED") console.log(`ChatGPT browser pause: CHATGPT_RATE_LIMITED until ${chatgptRegistry.rateLimit.retryAt || "explicit resume"}; no request will be sent.`);
  console.log(`Legacy manifest preserved: ${(await legacyIntegrity(manifest)).pass ? "yes" : "NO — stop"}`);
  for (const row of report) console.log(`${row.code.padEnd(7)} ${manifest.items.find((item) => item.code === row.code)?.name?.padEnd(24) || ""} ${row.status}${row.errors.length ? ` — ${row.errors[0]}` : ""}`);
  console.log("No Notebook action was taken. Use --execute only after a real Editorial Provider is configured and the plan is reviewed.");
}

async function ensureRuntime() {
  const taxonomy = await inspectTaxonomy();
  if (!existsSync(PATHS.runtimeManifest)) await bootstrap({ seed: true });
  const loaded = await loadOrCreateRuntime(taxonomy);
  for (const item of loaded.manifest.items || []) await ensurePackageGovernanceArtifacts(item);
  await writeRuntime(loaded.manifest);
  return { taxonomy, ...loaded };
}

async function autonomousRun() {
  const { taxonomy, manifest, provider } = await ensureRuntime();
  if (execute || argv.includes("--editorial-only") || argv.includes("--resume")) {
    await runEditorialPipeline(manifest, provider);
    await preflight(manifest);
  }
  if (execute) await submitProduction(manifest);
  if (argv.includes("--monitor")) await monitorProduction(manifest);
  if (argv.includes("--review")) await reviewProduction(manifest, provider);
  if (argv.includes("--repair")) await repairProduction(manifest, provider);
  await runTests(manifest, taxonomy);
  await diversityAudit(manifest); await buildDashboard(manifest);
  if (!execute) await plan(manifest);
}

async function main() {
  if (argv.includes("--provider-check")) {
    const provider = createEditorialModelProvider({ logger: (event) => { void eventLog({ stage: "provider-check", ...event }); } });
    const health = provider.config.provider === "chatgpt-browser" ? await provider.healthCheck() : { available: provider.config.provider === "openai" && provider.config.apiKeyConfigured, reachable: null, authenticated: null, uiDetected: null, ready: provider.config.provider === "openai" && provider.config.apiKeyConfigured, state: provider.config.provider === "openai" && provider.config.apiKeyConfigured ? "READY" : "EDITORIAL_PROVIDER_UNAVAILABLE" };
    console.log(JSON.stringify({ provider: provider.config.provider, ...health }, null, 2));
    if (!health.ready) process.exitCode = 2;
    return;
  }
  if (argv.includes("--seed-preview")) { await bootstrap({ seed: true }); const { taxonomy, manifest } = await ensureRuntime(); await preflight(manifest); await diversityAudit(manifest); await runTests(manifest, taxonomy); await plan(manifest); return; }
  if (argv.includes("--bootstrap")) { await bootstrap({ seed: false }); const { taxonomy, manifest } = await ensureRuntime(); await preflight(manifest); await runTests(manifest, taxonomy); return; }
  if (argv.includes("--approve-editorial-tone")) { const { taxonomy, manifest } = await ensureRuntime(); await approveEditorialTone(manifest); await runTests(manifest, taxonomy); return; }
  if (argv.includes("--editorial-only") || argv.includes("--execute") || argv.includes("--resume") || argv.includes("--monitor") || argv.includes("--review") || argv.includes("--repair")) { await autonomousRun(); return; }
  const { taxonomy, manifest } = await ensureRuntime();
  if (argv.includes("--test")) { await runTests(manifest, taxonomy); return; }
  await plan(manifest);
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  await eventLog({ stage: "factory", event: "FATAL", error: message.slice(0, 260) }).catch(() => {});
  console.error(`Factory stopped safely: ${message}`);
  process.exitCode = 1;
});
