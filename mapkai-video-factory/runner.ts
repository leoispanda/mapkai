import { mkdir, readFile, writeFile, readdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  artifactContractPlaceholder,
  blockedReviewDecision,
  classifySensitiveContent,
  createRunRecord,
  deterministicValidate,
  fieldRepresentationInterface,
  loadPolicyBinding,
  persistRunRecord,
  promptVersionRecords,
} from "./governance.mjs";

type Field = {
  code: string;
  title: string;
  titleZh: string;
  categoryCode: string;
  categoryTitle: string;
  categoryTitleZh: string;
  groupCode: string;
  groupTitle: string;
  slug: string;
};

type Status = "PENDING" | "CONTENT_INCOMPLETE" | "NARRATIVE_INCOMPLETE" | "EDITORIAL_REVIEW_REQUIRED" | "SEMANTIC_REVIEW_REQUIRED" | "SENSITIVE_TOPIC_REVIEW_REQUIRED" | "POLICY_CLARIFICATION_REQUIRED" | "GENERATING" | "VIDEO_READY" | "VIDEO_DOWNLOADED" | "HUMAN_REVIEW_PENDING" | "BRANDING" | "READY_TO_PUBLISH" | "FAILED" | "WAITING_QUOTA";
type Item = Field & {
  status: Status;
  packPath: string;
  promptPath: string;
  blueprintPath?: string;
  validationPath?: string;
  contentVersion?: string;
  generationContentVersion?: string;
  generationArchivePath?: string;
  narrativeEngine?: NarrativeEngine;
  videoMode?: "Explainer" | "Cinematic" | "Short" | "UNKNOWN";
  notebookUrl?: string;
  submittedAt?: string;
  completedAt?: string;
  downloadedPath?: string;
  attempts: number;
  runId?: string;
  artifactType?: string;
  policyBinding?: any;
  activePromptVersions?: Record<string, any>;
  deterministicValidationPath?: string;
  reviewRecordPath?: string;
  finalDecisionPath?: string;
  finalReviewDecision?: string;
  fieldRepresentationPath?: string;
  artifactContractPath?: string;
  sensitiveContent?: any;
  nextAttemptAt?: string;
  lastError?: string;
};
type Manifest = { schemaVersion: number; generatedAt: string | null; runId?: string; policyBinding?: any; activePromptVersions?: Record<string, any>; items: Item[] };
type Config = {
  policyBinding?: any;
  maxVideoPerDay: number;
  maxConcurrentGenerations: number;
  retryLimit: number;
  retryBackoffMinutes: number;
  chromeCdpUrl: string;
  notebookHomeUrl: string;
  branding: {
    logoPath: string | null;
    tagline: string;
    holdSeconds: number;
  };
};
type Spine = {
  definition: string;
  centralQuestion: string;
  whyItExists: string;
  howItThinks: string;
  branches: string[];
  landmarkIdeas: string[];
  history: string;
  applications: string[];
  connections: string[];
  learnerOutcome: string;
  narrativeDevice: string;
};

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(ROOT, "..");
const execFileAsync = promisify(execFile);
const PILOT_CODES = ["0533", "0311", "0313"];
const PATHS = {
  config: path.join(ROOT, "factory-config.json"),
  taxonomy: path.join(ROOT, "taxonomy.json"),
  manifest: path.join(ROOT, "video-manifest.json"),
  masterPrompt: path.join(ROOT, "prompts", "master_video_director.md"),
  packs: path.join(ROOT, "packs"),
  downloads: path.join(ROOT, "downloads"),
  runRecords: path.join(ROOT, "runtime", "run-records"),
  diversityAudit: path.join(ROOT, "diversity_audit.json"),
  review: path.join(ROOT, "review", "pilots"),
  dashboard: path.join(ROOT, "dashboard.html"),
};

const command = process.argv[2] ?? "plan";
const args = process.argv.slice(3);
const execute = args.includes("--execute");
const requestedCodes = option("--fields")?.split(",").map((value) => value.trim()).filter(Boolean);
const limit = numberOption("--limit");

function option(name: string) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}
function numberOption(name: string) {
  const value = option(name);
  return value && Number.isFinite(Number(value)) ? Number(value) : undefined;
}
function now() { return new Date().toISOString(); }
function dateKey(date = new Date()) { return date.toISOString().slice(0, 10); }
function safeSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "field";
}
function pause(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }

async function json<T>(file: string): Promise<T> { return JSON.parse(await readFile(file, "utf8")); }
async function saveJson(file: string, value: unknown) {
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}
async function config() { return json<Config>(PATHS.config); }
async function manifest(): Promise<Manifest> { return json<Manifest>(PATHS.manifest); }
async function saveManifest(value: Manifest) {
  value.generatedAt = now();
  await saveJson(PATHS.manifest, value);
  for (const item of value.items || []) await writeLegacyRunRecord(item, { status: item.status, manifestUpdatedAt: value.generatedAt });
  await dashboard(value);
}

const LEGACY_ARTIFACT_TYPE = "FIELD_OVERVIEW_VIDEO";

async function policyBinding(cfg?: Config) {
  const loaded = cfg ?? await config();
  // A formal run must fail closed when the configured lock is missing or the
  // canonical policy bytes no longer match it. The policy text itself is never
  // copied into prompts or runtime records.
  return loadPolicyBinding({ factoryDir: ROOT, expected: loaded.policyBinding, requireExpected: true });
}

async function activeLegacyPromptVersions() {
  return promptVersionRecords({
    factoryDir: ROOT,
    prompts: {
      masterVideoDirector: { path: "prompts/master_video_director.md", version: "legacy-master-video-director.v1" },
    },
  });
}

function legacyRunId() { return `legacy-${dateKey()}-${randomUUID()}`; }

function runRecordPath(runId: string, fieldId: string) {
  return path.join(PATHS.runRecords, runId, `${safeSlug(fieldId)}.json`);
}

async function writeLegacyRunRecord(item: Partial<Item>, patch: Record<string, unknown> = {}) {
  if (!item.runId || !item.policyBinding) return;
  const record = createRunRecord({
    runId: item.runId,
    fieldId: item.code,
    artifactType: item.artifactType || LEGACY_ARTIFACT_TYPE,
    policyBinding: item.policyBinding,
    activePromptVersions: item.activePromptVersions || {},
    status: item.status || "UNKNOWN",
    ...patch,
  });
  await persistRunRecord(runRecordPath(item.runId, item.code || "unknown"), record);
}

function legacyReviewPath(item: Item) { return path.join(REPO, item.reviewRecordPath || path.join("mapkai-video-factory", "packs", item.slug, "final_review_decision.json")); }
function legacyDeterministicPath(item: Item) { return path.join(REPO, item.deterministicValidationPath || path.join("mapkai-video-factory", "packs", item.slug, "deterministic_validation.json")); }

/** The site taxonomy remains the source of truth; this creates a portable factory copy. */
async function extractTaxonomy(): Promise<Field[]> {
  const source = await readFile(path.join(REPO, "script.js"), "utf8");
  const categoriesMatch = source.match(/const categories = (\[[\s\S]*?\n\]);\n\nconst publicCategoryLabels/);
  const labelsMatch = source.match(/const publicFieldLabels = (\{[\s\S]*?\n\});\n\nconst generalEntryScopes/);
  if (!categoriesMatch || !labelsMatch) throw new Error("Could not find the MapKAI taxonomy in script.js.");
  // This evaluates only the repository's own object literals, to avoid duplicating a taxonomy by hand.
  const categories = Function("const readiness = { classified: 'classified' }; return (" + categoriesMatch[1] + ");")() as Array<any>;
  const labels = Function("return (" + labelsMatch[1] + ");")() as { zh: Record<string, string> };
  const fields: Field[] = [];
  for (const category of categories) {
    for (const group of category.groups) {
      for (const [code, title] of group.fields) {
        const titleZh = labels.zh[code];
        if (!titleZh) continue; // Only MapKAI's named formal fields, excluding catch-all taxonomy entries.
        fields.push({
          code, title, titleZh, categoryCode: category.code, categoryTitle: category.title,
          categoryTitleZh: category.chineseTitle, groupCode: group.code, groupTitle: group.title,
          slug: `${code}-${safeSlug(title)}`,
        });
      }
    }
  }
  return fields;
}

async function fablesByField() {
  const directory = path.join(REPO, "content", "field-fables", "batches");
  const entries = (await readdir(directory)).filter((file) => file.endsWith(".json"));
  const grouped = new Map<string, any[]>();
  for (const entry of entries) {
    const batch = await json<{ articles: any[] }>(path.join(directory, entry));
    for (const article of batch.articles ?? []) {
      if (article.status !== "approved" || !article.fieldCode) continue;
      grouped.set(article.fieldCode, [...(grouped.get(article.fieldCode) ?? []), article]);
    }
  }
  return grouped;
}

const categoryThinking: Record<string, Pick<Spine, "whyItExists" | "howItThinks" | "landmarkIdeas" | "history" | "applications" | "narrativeDevice">> = {
  "00": { whyItExists: "People need reliable foundations before they can enter specialised work; this field makes those foundations visible and teachable.", howItThinks: "It looks for transferable capabilities, prerequisites, feedback, and the conditions that let a person act independently.", landmarkIdeas: ["prerequisite structure", "literacy and numeracy", "transfer of learning", "deliberate practice", "self-regulation"], history: "It moved from informal apprenticeship and basic schooling toward modern ideas of general education, learning science, and lifelong capability.", applications: ["bridging programmes", "adult learning", "workplace training", "learning design"], narrativeDevice: "A traveller discovers that the map is useless until they can read its symbols." },
  "01": { whyItExists: "Societies cannot pass knowledge, skills, and judgment to another generation by accident.", howItThinks: "It studies learning as a process shaped by attention, development, teaching, curriculum, evidence, and institutions.", landmarkIdeas: ["learning by doing", "development", "curriculum", "assessment", "instructional design"], history: "It developed from family teaching and apprenticeship through mass schooling, teacher education, psychology, and modern learning research.", applications: ["schools", "teacher development", "assessment", "educational technology"], narrativeDevice: "A craft survives only when its master can make another person see what their own hands cannot yet see." },
  "02": { whyItExists: "Human experience, memory, language, and meaning cannot be reduced to physical measurement alone.", howItThinks: "It interprets works, traces context, compares forms, and asks how symbols, stories, and practices make meaning.", landmarkIdeas: ["representation", "form", "interpretation", "historical context", "cultural memory"], history: "It grew from oral traditions, religious and civic learning, archives, museums, universities, and critical methods.", applications: ["media", "design", "heritage", "cultural institutions"], narrativeDevice: "An old object changes meaning each time it is placed beside a different object." },
  "03": { whyItExists: "Individual choices become intelligible only when we can also see institutions, incentives, groups, power, and public information.", howItThinks: "It connects observation, comparison, theory, measurement, and interpretation to explain patterned human behaviour.", landmarkIdeas: ["institutions", "incentives", "social structure", "evidence", "collective action"], history: "It emerged from political philosophy and moral inquiry, then gained surveys, statistics, experiments, and modern social research.", applications: ["public policy", "organisations", "markets", "media and information"], narrativeDevice: "A city appears chaotic until a map reveals the rules that quietly organise its movement." },
  "04": { whyItExists: "Cooperation at scale needs ways to create value, keep records, allocate resources, and make responsibility enforceable.", howItThinks: "It follows flows of resources, incentives, information, authority, contracts, and accountability.", landmarkIdeas: ["value creation", "accounting", "risk", "governance", "contracts"], history: "It developed from trade, bookkeeping, markets, courts, and public administration into modern organisations and regulatory systems.", applications: ["companies", "financial systems", "public administration", "legal practice"], narrativeDevice: "A promise between strangers becomes possible only when money, records, and rules begin to agree." },
  "05": { whyItExists: "Natural patterns often resist intuition; disciplined observation lets people distinguish what seems true from what survives evidence.", howItThinks: "It makes phenomena measurable, forms models, tests predictions, quantifies uncertainty, and revises explanations under evidence.", landmarkIdeas: ["measurement", "model", "experiment", "conservation", "uncertainty"], history: "It moved from observation of nature through mathematical description and experiment to instruments, specialised laboratories, and large research networks.", applications: ["medicine", "energy", "environment", "technology"], narrativeDevice: "A familiar event becomes a mystery when the first explanation fails a careful measurement." },
  "06": { whyItExists: "Information must be represented, transformed, stored, and shared reliably before people and machines can act on it at scale.", howItThinks: "It decomposes problems, formalises information, designs algorithms and systems, and tests trade-offs in reliability, security, and usability.", landmarkIdeas: ["algorithm", "data representation", "network", "abstraction", "security"], history: "It grew from calculation and communication tools through programmable computers, networks, software engineering, and digital platforms.", applications: ["software", "data systems", "cybersecurity", "digital services"], narrativeDevice: "A message travels farther than its sender, but only because invisible agreements keep it from becoming noise." },
  "07": { whyItExists: "Ideas must survive contact with materials, forces, time, cost, safety, and real users before they become useful things.", howItThinks: "It designs, models, builds, tests, measures failure, and iterates under constraints.", landmarkIdeas: ["design under constraints", "materials", "systems", "safety factor", "feedback"], history: "It developed from craft practice and construction through industrialisation, standards, scientific engineering, and lifecycle design.", applications: ["infrastructure", "manufacturing", "energy", "built environments"], narrativeDevice: "A bridge can look perfect on paper and still have to negotiate with wind, weight, and time." },
  "08": { whyItExists: "Food, animal health, forests, and waters depend on living systems that can be productive without being exhausted.", howItThinks: "It follows cycles of soil, water, organisms, climate, disease, management, and ecological limits.", landmarkIdeas: ["ecosystem", "yield", "soil health", "animal welfare", "sustainability"], history: "It moved from accumulated local practice through agricultural and veterinary science toward ecology, food systems, and sustainable management.", applications: ["food security", "forestry", "fisheries", "animal care"], narrativeDevice: "A harvest appears to come from one field, until we notice every unseen relationship that made it possible." },
  "09": { whyItExists: "Illness, disability, care, and vulnerability require knowledge that connects bodies, evidence, treatment, relationships, and institutions.", howItThinks: "It combines observation, diagnosis, testing, intervention, care records, ethics, and attention to lived experience.", landmarkIdeas: ["diagnosis", "evidence", "prevention", "care", "rehabilitation"], history: "It developed from healing traditions and caregiving through anatomy, clinical science, public health, welfare systems, and evidence-based practice.", applications: ["clinical care", "public health", "rehabilitation", "social support"], narrativeDevice: "A symptom looks like one problem until a careful diagnosis reveals a whole network of causes and care." },
  "10": { whyItExists: "People, goods, safety, and care must move through real journeys where trust can fail at any hand-off.", howItThinks: "It maps journeys, people, processes, environments, risk, and recovery from the user's point of view.", landmarkIdeas: ["service journey", "trust", "coordination", "safety", "experience"], history: "It grew from hospitality, trade, protection, sanitation, and transport into modern service operations, safety systems, and experience design.", applications: ["transport", "tourism", "public safety", "personal and community services"], narrativeDevice: "A routine journey reveals its hidden choreography only when one small hand-off fails." },
};

const pilotSpines: Record<string, Spine> = {
  "0533": {
    definition: "Physics studies the most general patterns governing matter, energy, motion, space, time, and fundamental interactions. It asks what remains true when we strip a phenomenon down to its underlying relations.",
    centralQuestion: "How can a few deep principles explain both a falling apple and the behaviour of stars, atoms, light, and time?",
    whyItExists: "Everyday intuition is powerful but local. Physics exists because motion, heat, electricity, and light repeatedly demand explanations that are more precise, transferable, and testable than common sense.",
    howItThinks: "Physics begins by isolating a phenomenon, measuring it carefully, expressing relationships mathematically, and testing whether a model predicts new observations. A good law is not a slogan: it survives contact with experiments and reveals where it stops applying.",
    branches: ["Classical mechanics — motion, force, momentum, and gravity at ordinary scales.", "Electromagnetism and optics — fields, charges, waves, and light.", "Thermodynamics and statistical physics — energy, heat, disorder, and many-particle systems.", "Quantum physics — matter and radiation at atomic scales.", "Relativity and cosmology — spacetime, gravity, and the large-scale universe."],
    landmarkIdeas: ["Conservation laws: quantities such as energy and momentum constrain what can happen.", "Fields: objects can influence one another through structured conditions spread across space.", "Thermodynamics: energy transformations have direction and limits.", "Relativity: measurements of space and time depend on motion, while the speed of light remains invariant.", "Quantum theory: prediction at small scales is probabilistic and depends on how systems are measured."],
    history: "Physics shifted from qualitative natural philosophy to mathematical laws of motion in the seventeenth century; from mechanical pictures to field theories in the nineteenth; and from classical certainty to relativity and quantum theory in the twentieth. Its history is a repeated lesson that a successful model may still be only a special case.",
    applications: ["engineering and energy systems", "medical imaging and radiation therapy", "electronics, lasers, and communication", "climate and Earth observation", "spaceflight and navigation"],
    connections: ["Mathematics (0541) supplies the language of models and proof.", "Chemistry (0531) applies physical laws to matter and reactions.", "Earth sciences (0532) and environmental sciences (0521) use physical models of complex systems.", "Electronics and automation (0714) turns physical principles into technology."],
    learnerOutcome: "A general learner should see physics as a disciplined search for invariants: identify what changes, what is conserved, what can be measured, and which model is adequate at this scale.",
    narrativeDevice: "A beam of light races beside a moving train: if both observers measure the same speed of light, what must give way—distance, time, or common sense?"
  },
  "0311": {
    definition: "Economics studies how people, organisations, and societies allocate scarce resources among competing uses—and how the resulting choices shape production, exchange, income, power, and wellbeing.",
    centralQuestion: "When every useful choice has an opportunity cost, how do individual decisions become prices, markets, institutions, and social outcomes?",
    whyItExists: "Resources, time, information, and attention are limited, while needs and ambitions are not. Economics exists to make the trade-offs visible, including the trade-offs hidden inside rules, markets, and public policy.",
    howItThinks: "Economics starts from incentives and constraints, then examines how choices interact. It combines models, data, causal inference, historical comparison, and institutional analysis. Its strongest habit is to ask: compared with what alternative, for whom, and over what time horizon?",
    branches: ["Microeconomics — households, firms, prices, competition, and market design.", "Macroeconomics — growth, inflation, employment, money, and business cycles.", "Public economics — taxation, public goods, welfare, and collective choices.", "Development and labour economics — productivity, inequality, work, and long-run change.", "Behavioural and institutional economics — bounded decision-making and the rules that shape markets."],
    landmarkIdeas: ["Opportunity cost: choosing one use of a resource means giving up another.", "Supply and demand: prices coordinate dispersed decisions but do not automatically make outcomes fair.", "Comparative advantage: exchange can create gains even when one side is more productive in everything.", "Externalities and public goods: private choices can impose costs or create benefits that prices miss.", "Incentives and institutions: rules change behaviour, and behaviour changes the outcomes rules can sustain."],
    history: "Economics evolved from moral and political reflection on trade and wealth to classical political economy, marginal analysis, national income accounting, Keynesian macroeconomics, modern econometrics, behavioural research, and renewed attention to institutions, inequality, and climate constraints.",
    applications: ["pricing and competition policy", "central banking and inflation analysis", "tax, welfare, and public investment", "labour markets and organisational decisions", "climate and environmental policy"],
    connections: ["Finance, banking and insurance (0412) applies economic reasoning to capital and risk.", "Management and administration (0413) studies organisational choices within firms.", "Political sciences and civics (0312) explains how collective rules are made.", "Statistics (0542) helps distinguish correlation, causation, and uncertainty in economic evidence."],
    learnerOutcome: "A general learner should leave able to see an economic argument as a claim about trade-offs, incentives, distribution, and institutions—not merely a chart about money.",
    narrativeDevice: "A town discovers that its cheapest bread is not actually cheap once the cost is carried by a river, future taxpayers, and workers with no bargaining power."
  },
  "0313": {
    definition: "Psychology studies mind and behaviour: how people perceive, learn, remember, feel, decide, develop, relate to others, and change across situations and time.",
    centralQuestion: "Why can the same person sincerely think, feel, and act differently when attention, memory, biology, relationships, and situation change?",
    whyItExists: "Introspection reveals experience but cannot reliably explain it. Psychology exists because behaviour is shaped by mechanisms that are partly hidden from the person experiencing them, yet can be studied with evidence.",
    howItThinks: "Psychology combines careful measurement of behaviour and experience with experiments, observation, longitudinal studies, clinical evidence, and statistical reasoning. It asks both what pattern appears and which mechanism could plausibly produce it.",
    branches: ["Cognitive psychology — attention, perception, memory, language, and reasoning.", "Developmental psychology — change across the lifespan.", "Social psychology — influence, identity, groups, and situations.", "Biological and neuropsychology — brain, body, emotion, and behaviour.", "Clinical and counselling psychology — distress, assessment, intervention, and recovery."],
    landmarkIdeas: ["Learning and conditioning: behaviour changes when consequences and predictions change.", "Cognitive schemas and biases: mental shortcuts are useful but can systematically mislead.", "Memory reconstruction: remembering is an active reconstruction, not a perfect recording.", "Attachment and development: early relationships help shape later expectations and regulation.", "Person–situation interaction: stable dispositions matter, but situations can strongly alter behaviour."],
    history: "Psychology separated from philosophy in the nineteenth century through laboratories and measurement; then moved through behaviourism, psychoanalytic and humanistic traditions, cognitive science, neuroscience, and increasingly rigorous replication and open-science reforms.",
    applications: ["mental-health assessment and therapy", "learning and educational design", "health behaviour and rehabilitation", "workplace and organisational design", "human-centred technology and safety"],
    connections: ["Education science (0111) applies accounts of learning and development.", "Medicine (0912) and therapy and rehabilitation (0915) connect psychological and bodily health.", "Sociology and cultural studies (0314) extends explanation from individuals to social structures.", "Software and applications development (0613) increasingly needs psychological insight for humane interfaces."],
    learnerOutcome: "A general learner should understand psychology as disciplined humility about the mind: subjective confidence is data, but it is not automatically evidence of how a mechanism works.",
    narrativeDevice: "A credible witness remembers a decisive detail with absolute confidence—until a small change in the question reveals how memory may have been rebuilt rather than replayed."
  }
};

function relatedFields(field: Field, allFields: Field[]) {
  return allFields.filter((candidate) => candidate.categoryCode === field.categoryCode && candidate.code !== field.code).slice(0, 4)
    .map((candidate) => `${candidate.title} (${candidate.code})`);
}

function defaultSpine(field: Field, allFields: Field[]): Spine {
  const domain = categoryThinking[field.categoryCode];
  const neighbours = relatedFields(field, allFields);
  return {
    definition: `${field.title} is a formal field within ${field.groupTitle}. It develops specialised knowledge, methods, and judgment for questions that belong to this part of ${field.categoryTitle}.`,
    centralQuestion: `What must we understand about ${field.title.toLowerCase()} in order to make better explanations, choices, and interventions?`,
    whyItExists: domain.whyItExists,
    howItThinks: domain.howItThinks,
    branches: [`Foundations of ${field.title} — its core concepts and vocabulary.`, `${field.groupTitle} methods — the evidence and practices that make claims testable or interpretable.`, `Applied ${field.title} — using those ideas in real settings.`, `Boundary questions — where ${field.title} needs neighbouring fields to explain the whole problem.`],
    landmarkIdeas: domain.landmarkIdeas,
    history: domain.history,
    applications: domain.applications,
    connections: neighbours.length ? neighbours.map((name) => `${name} is a neighbouring MapKAI field whose questions overlap with this one.`) : [`${field.categoryTitle} provides the wider MapKAI context for this field.`],
    learnerOutcome: `A general learner should be able to recognise the characteristic questions of ${field.title}, identify the kind of evidence it trusts, and know when another field is needed.`,
    narrativeDevice: domain.narrativeDevice,
  };
}

function spineFor(field: Field, allFields: Field[]) { return pilotSpines[field.code] ?? defaultSpine(field, allFields); }
function bullets(items: string[]) { return items.map((item) => `- ${item}`).join("\n"); }

type NarrativeEngine = "mystery" | "paradox" | "dilemma" | "journey" | "discovery" | "thought experiment" | "intellectual conflict";
type Blueprint = { engine: NarrativeEngine; device: string; opening: string; tension: string; firstTurn: string; aha: string; progression: string; integration: string; visuals: string; ending: string; insight: string; };

function scoreSeed(value: string) { return [...value].reduce((total, character) => total + character.charCodeAt(0), 0); }
function selectedEngine(field: Field): NarrativeEngine {
  const candidates: NarrativeEngine[] = ["mystery", "paradox", "dilemma", "journey", "discovery", "thought experiment", "intellectual conflict"];
  if (field.code === "0533") return "mystery";
  if (field.code === "0311") return "paradox";
  if (field.code === "0313") return "intellectual conflict";
  // Selection evaluates several viable engines and rotates the strongest fit by field identity.
  const preferred: Record<string, NarrativeEngine[]> = {
    "00": ["journey", "dilemma", "discovery"], "01": ["dilemma", "discovery", "thought experiment"],
    "02": ["discovery", "intellectual conflict", "journey"], "03": ["paradox", "intellectual conflict", "thought experiment"],
    "04": ["dilemma", "paradox", "intellectual conflict"], "05": ["mystery", "discovery", "thought experiment"],
    "06": ["paradox", "discovery", "mystery"], "07": ["dilemma", "mystery", "journey"],
    "08": ["journey", "discovery", "dilemma"], "09": ["mystery", "dilemma", "discovery"],
    "10": ["dilemma", "journey", "paradox"],
  };
  const options = preferred[field.categoryCode] ?? candidates;
  return options[scoreSeed(`${field.code}-${field.title}`) % options.length];
}

function pilotBlueprint(field: Field): Blueprint | undefined {
  if (field.code === "0533") return { engine: "mystery", device: "A stone falls toward Earth while the Moon appears to remain in the sky. The apparent difference is the mystery that opens the map of physics.", opening: "Open on the ordinary sight of a falling stone, then move outward to the Moon. Do not answer immediately. Ask why one event seems like a fall and the other like an orbit.", tension: "Human intuition separates terrestrial motion from celestial motion. Physics begins when that separation becomes a question rather than an answer.", firstTurn: "The Moon is also falling; it is continuously falling around Earth because its sideways motion keeps missing the ground.", aha: "The reversal is hidden unity: events that look unlike one another can be constrained by the same invariant relationship.", progression: "Move from Newtonian unification to energy and entropy, then fields, relativity, and quantum theory. Each expansion shows a former certainty becoming a special case.", integration: "Mechanics explains motion and orbit; thermodynamics asks what energy transformations permit; electromagnetism links light and force; relativity revises space and time; quantum theory revises predictability. Bring mathematics, chemistry, engineering, and medicine in when those principles cross a boundary.", visuals: "Falling stone and orbital path; force and energy diagrams; heat flowing through a machine; field lines and light; spacetime grids; quantum probability patterns; a scale transition from atom to galaxy.", ending: "Return to the stone and Moon. They were never two unrelated events; they were an invitation to search for deeper rules beneath different appearances.", insight: "Physics is the art of finding invariant structure beneath changing phenomena." };
  if (field.code === "0311") return { engine: "paradox", device: "A city wakes to find every wallet contains twice as much money, yet no extra homes, food, doctors, labour, or productive capacity exist.", opening: "Begin with the apparent good news: everyone has twice as much money. Let the question hang—has the city become twice as rich?", tension: "Money measures and coordinates claims on resources, but it is not the resources themselves. The paradox reveals scarcity, distribution, and institutions.", firstTurn: "If available goods and capacities have not changed, extra money changes claims and prices rather than automatically doubling real wellbeing.", aha: "Economics begins not with greed or arithmetic but with opportunity cost: every allocation uses resources that cannot simultaneously do something else.", progression: "From scarcity and choice, move to prices and markets, then public goods and externalities, macroeconomic coordination, and institutions that shape who receives what.", integration: "Use microeconomics for local choices, macroeconomics for economy-wide coordination, public economics for shared goods, and behavioural and institutional economics for real human decision-making. Connect to politics, finance, management, and statistics at the points where rules, capital, organisations, and evidence enter.", visuals: "City supply chains; fixed quantities of homes and food against changing money; price signals; an externality spreading beyond a transaction; distribution maps; feedback loops between policy and behaviour.", ending: "Return to the doubled wallets. The city was asking not how much money people held, but how a society turns limited productive capacity into lives people can actually live.", insight: "Economics maps the trade-offs, incentives, and institutions that turn scarce resources into social outcomes." };
  if (field.code === "0313") return { engine: "intellectual conflict", device: "A confident witness reports a decisive detail, yet a small change in the question alters the memory. Is the mind a recorder of reality or an active constructor of it?", opening: "Open with the confidence of seeing and remembering directly. Introduce the altered question only after the viewer has accepted that confidence.", tension: "We rely on our minds to know the world, but the same mind filters attention, predicts, fills gaps, learns from others, and cannot fully inspect its own mechanisms.", firstTurn: "Memory is not a replay. It is reconstructed from traces, expectations, emotion, and later information; sincerity is not the same as accuracy.", aha: "The reversal is not that people are irrational. It is that the mind is an adaptive, predictive system whose strengths create characteristic blind spots.", progression: "Move from perception and cognition to learning, development, social influence, biology, and clinical psychology. Each territory explains a different layer of the same problem: how minds become minds in bodies and situations.", integration: "Cognitive psychology explains information processing; development shows change across life; social psychology reveals situational influence; biological psychology connects brain and body; clinical work tests how understanding can become care. Connect to education, medicine, sociology, and human-centred technology where these mechanisms meet institutions and design.", visuals: "Ambiguous images; a memory timeline being revised; attention filters; neural and bodily signals; a child-to-adult developmental sequence; group influence diagrams; evidence and replication graphics.", ending: "Return to the witness. The point is not to distrust every memory, but to understand why a mind capable of meaning and adaptation must be studied with methods stronger than confidence alone.", insight: "Psychology studies the mind by treating experience as important evidence—but never as the whole explanation." };
  return undefined;
}

function blueprintFor(field: Field, spine: Spine): Blueprint {
  const pilot = pilotBlueprint(field); if (pilot) return pilot;
  const engine = selectedEngine(field);
  const openingByEngine: Record<NarrativeEngine, string> = {
    mystery: `Begin with a familiar ${field.title.toLowerCase()} phenomenon that becomes puzzling under a careful question. Delay the definition until the puzzle creates a need for the field.`,
    paradox: `Begin with an apparently sensible claim about ${field.title.toLowerCase()} and show the condition under which it reverses or becomes incomplete.`,
    dilemma: `Begin with a serious choice where two legitimate values cannot all be satisfied. Let the field reveal what the choice hides.`,
    journey: `Begin at one concrete scale of ${field.title.toLowerCase()} and travel through the connected levels required to understand it.`,
    discovery: `Begin with an older practical explanation that works until a stubborn observation demands a new way of seeing.`,
    "thought experiment": `Begin with a minimal, serious hypothetical world in which one ordinary feature of ${field.title.toLowerCase()} is altered. Follow what breaks.`,
    "intellectual conflict": `Begin with two plausible explanations of the same ${field.title.toLowerCase()} problem and let their conflict expose the field's method.`,
  };
  return { engine, device: spine.narrativeDevice, opening: openingByEngine[engine], tension: `The tension is between an intuitive local answer and the broader structure that ${field.title} is designed to reveal.`, firstTurn: `The first turn occurs when the initial explanation fails to account for a consequence, comparison, or boundary case.`, aha: `The aha moment is that the problem is not isolated: it belongs to a system of evidence, constraints, and relationships.`, progression: `Question → investigation → first reversal → expansion into the field's territories → reframing as a connected knowledge map.`, integration: `Let each major branch enter as a response to a distinct part of the central question. Landmark ideas should change the viewer's model, not appear as vocabulary cards.`, visuals: `Use diagrams, scale changes, process views, before/after models, and carefully chosen real-world consequences that make the field's reasoning visible.`, ending: `Return to the opening situation and show why it now carries a different meaning.`, insight: spine.learnerOutcome };
}

function expandBullets(items: string[], purpose: string) { return items.map((item) => `### ${item.split("—")[0].replace(/:.*$/, "")}

${item} In this overview, treat it as ${purpose}: a way the field extends its central question into a region where a different kind of evidence, model, or practical consequence becomes necessary. Its boundary with the other regions matters because no single perspective can carry the whole question alone.`).join("\n\n"); }

function overviewFor(field: Field, spine: Spine, stories: any[]) {
  const limits: Record<string, string> = {
    "05": "Models gain power by simplifying. Their limits appear when scales interact, measurements are uncertain, systems are too complex for a tractable model, or current theories disagree at a boundary. A mature learner asks what has been idealised, what range of conditions is covered, and what observation could force revision.",
    "03": "Human systems react to being described and governed. Evidence is incomplete, causal claims are difficult, and values enter the choice of what counts as improvement. The field therefore needs methodological humility as well as explanation.",
    "09": "Bodies and lives do not arrive as clean textbook cases. Evidence must be interpreted with uncertainty, ethics, care relationships, unequal access, and the particular goals of the person receiving support.",
  };
  const frontier = limits[field.categoryCode] ?? `No field sees the entire problem from one vantage point. Its concepts and methods are strongest when their assumptions are visible; they need neighbouring disciplines whenever questions cross levels, values conflict, evidence is incomplete, or a real situation changes faster than a model can follow.`;
  const inspiration = stories.slice(0, 3).map((story) => `- **${story.title}** — ${story.summary ?? "Optional MapKAI narrative inspiration."}`).join("\n");
  return `# MapKAI Editorial Knowledge Pack: ${field.title}

**Formal field:** ${field.title} (${field.titleZh}) · **Code:** ${field.code} · **Group:** ${field.groupTitle} · **Knowledge continent:** ${field.categoryTitle}

## Field Identity

${spine.definition}

The identity of a field is not just a label for subject matter. It is a compact agreement about what counts as a worthwhile question, what evidence deserves trust, and what kinds of explanation are adequate. ${field.title} shares a border with neighbouring disciplines because real problems rarely respect academic boundaries. Its distinctiveness lies in the angle it brings to that shared terrain: it asks the central question below with characteristic tools, then tests or interprets the answers in its own way.

## Central Question

${spine.centralQuestion}

This question is a conceptual anchor, not a quiz prompt. It explains why the field holds together even when its internal territories look different. A learner should keep returning to it while moving through the branches: each branch exists because one version of the question proved difficult enough to demand a more specialised language, method, or model.

## Why This Field Exists

${spine.whyItExists}

Fields become necessary when practical judgment and inherited intuition repeatedly meet a limit. The limit may be a mystery that resists ordinary observation, a collective problem too large for individual experience, a conflict between values, or a process that cannot be controlled without better knowledge. The point is not that earlier people were foolish. Earlier ways of seeing often worked within a smaller range. The discipline emerged when that range became visible—and when people needed explanations that could travel, be challenged, and be improved.

## How This Field Thinks

${spine.howItThinks}

This reasoning style works because it forces a claim to meet something beyond assertion: a measurement, a comparison, a counterexample, a record, a formal relationship, an observed consequence, or a disciplined interpretation. It also has limits. A method can illuminate one level of a problem while hiding another; a clean model can leave out what a real case most needs. Intellectual literacy means learning both the power of a field's method and the conditions under which its confidence should narrow.

## Major Branches: A Connected Field Map

${expandBullets(spine.branches, "one intellectual territory within the larger map")}

Taken together, these territories are not a shelf of unrelated topics. They are a map of the ways the field has learned to divide a large question into answerable parts, then reconnect those parts when a fuller explanation is required.

## Landmark Ideas: Changes in What Can Be Seen

${expandBullets(spine.landmarkIdeas, "a landmark shift in the field's mental model")}

Before a landmark, an older framework can appear complete because it has not yet met its decisive anomaly. After a landmark, the field can ask new questions, build different instruments, or notice consequences that were previously invisible. That is why landmark ideas matter: they are changes in the shape of intelligibility, not famous terms to memorise.

## Historical Development as Intellectual Shifts

${spine.history}

Read this development as a sequence of changed mental models rather than a parade of dates. A durable pattern is old practice or theory → a limitation or anomaly → a new way of reasoning → a changed picture of what the field is about. The past is useful here because it makes present assumptions easier to see. Every mature field carries some questions it has learned to ask and some questions it still does not know how to settle.

## Real-World Applications: From Idea to Consequence

${expandBullets(spine.applications, "a concrete route from abstract reasoning to practical consequence")}

Applications are not an afterthought. They are one way a field discovers whether its concepts travel beyond the page. At the same time, using knowledge in the world adds ethical, institutional, and design questions that the abstract theory alone cannot decide.

## Connections Across the MapKAI Map

${expandBullets(spine.connections, "a boundary where concepts, evidence, or practical problems cross from one field into another")}

These crossings show why broad learning should not confuse a field with an island. A strong mental map preserves distinctions without turning them into walls: it can say what each discipline contributes, what is translated at the boundary, and why some questions require more than one form of expertise.

## Limits, Open Questions and Frontiers

${frontier}

Frontiers are not merely unknown facts waiting to be filled in. They are places where methods meet their assumptions, where evidence is difficult to obtain, where explanations compete, or where a new scale of problem asks the field to revise itself. Knowing this prevents the false impression that a discipline is a finished box of answers.

## General Learner Mental Model

${spine.learnerOutcome}

Carry this forward as a habit of mind. When a new problem appears, ask what this field would notice first, which of its concepts would organise the confusion, what its method could genuinely establish, and where its limits require another way of knowing. That is more durable than remembering a glossary.

## Editorial Orientation

This pack is written for broad intellectual orientation rather than professional qualification. It deliberately compresses a large discipline into a map of questions, methods, turning points, and boundaries. Compression carries a risk: examples can look cleaner than the real research, and branches can seem more separate than they are in practice. Use the pack as a reliable first framework, then let it guide more focused study. The right next question is not “Have I memorised the field?” but “Can I recognise the kind of problem this field was built to make clearer?”

## Reading the Map Beyond This Overview

The most productive way to extend this overview is to follow one route at a time. Start with a central question that remains difficult after the first explanation. Then choose one branch and ask what new evidence, language, or model it had to develop. Follow one landmark idea backward to the assumption it disrupted and forward to a practical consequence it made possible. Finally, cross one boundary into a neighbouring field and notice what is preserved, what is translated, and what becomes newly contestable. This route builds connected understanding rather than a collection of facts.

It is also useful to distinguish three kinds of disagreement. Some disagreements concern evidence: which observations or records are dependable? Others concern models and interpretation: which explanation best accounts for the evidence? Still others concern action: even when a description is accepted, what should people or institutions do with it? A broad learner need not resolve every disagreement, but should be able to recognise which kind is taking place. That recognition prevents technical vocabulary from becoming a substitute for judgment.

The map should remain revisable. New tools can make a previously invisible pattern observable; new contexts can expose a limitation in an old model; and contact with another discipline can reveal that a familiar question was too narrowly framed. The aim of field-level learning is therefore disciplined orientation: enough structure to enter a conversation intelligently, enough humility to know what further depth would require, and enough curiosity to see a knowledge boundary as an invitation rather than a wall.

When the field is encountered in public discussion, resist two opposite mistakes. One is to treat its technical language as a black box that automatically settles a question. The other is to dismiss its methods because they cannot answer every question at once. The more useful stance is conditional trust: ask what the field can establish in this case, which assumptions make that conclusion possible, what alternatives it has considered, and what additional perspectives are needed before a decision is made. This is how a mental map becomes practical intellectual judgment.

It also makes later specialist learning faster, because new detail has somewhere coherent to attach rather than arriving as isolated terminology.

## Optional Narrative Inspiration from MapKAI Fables

${inspiration || "No approved fable is linked to this field. The editorial knowledge pack is complete without one."}

These fables may suggest an opening image, metaphor, or local tension. They never determine the knowledge structure and must not be presented as documentary evidence.
`;
}

function blueprintMarkdown(field: Field, blueprint: Blueprint, spine: Spine) {
  return `# Narrative Blueprint: ${field.title}

**Selected engine:** ${blueprint.engine}

## Central Narrative Device

${blueprint.device}

The device was selected because it can carry the field's central question without pretending that the video is a fiction. It is an intellectual situation: a way to let the viewer encounter the problem before receiving the vocabulary.

## Opening Hook

${blueprint.opening}

The first 20–40 seconds should create curiosity before definition. The viewer should feel the question in concrete form and sense that an ordinary answer is about to become insufficient.

## Central Tension

${blueprint.tension}

This tension remains active throughout the video. It prevents the narrative from becoming a collection of examples and gives the field map a reason to unfold.

## First Intellectual Turn

${blueprint.firstTurn}

The turn must be explained, not simply announced. Show which assumption fails and what form of evidence, model, or comparison makes the failure visible.

## Aha Moment / Intellectual Reversal

${blueprint.aha}

This is the point where the viewer should revise the first mental model. It is a conceptual reversal, not a trivia beat.

## Narrative Progression

${blueprint.progression}

Use a steady movement: question → investigation → discovery → expansion → reframing → field map. Do not force a fixed act structure; let each movement occur because the preceding explanation creates a new question.

## Knowledge Integration

${blueprint.integration}

The underlying spine remains visible to the creator: central question, method, branches, landmark ideas, history, applications, connections, limits, and final model. It should be experienced by the viewer as a coherent journey, not a syllabus.

## Visual Opportunities

${blueprint.visuals}

Choose visuals for explanatory value. Use diagrams, comparisons, timelines, maps, scale transitions, and physical or social processes where they make an idea easier to see. Do not request decorative imagery unrelated to the intellectual move.

## Ending Return

${blueprint.ending}

The return makes the narrative circular in the best sense: the opening question stays the same, but the learner is now able to see why it belonged to an entire field.

## Final Insight

${blueprint.insight}

## Pacing, Tone and Integrity

Keep the movement deliberate enough for an adult viewer to think. The opening creates tension, but the middle must earn each expansion with a genuine explanatory need. When a historical episode, real-world application, or visual transition appears, it should answer the question raised just before it. Avoid making the narrator perform surprise; let the structure of the problem create it.

The narrative device is a guide rather than a script constraint. If one visual or historical contrast explains the central tension more accurately, prefer accuracy and clarity over theatrical continuity. Do not invent a famous anecdote, experiment, quotation, or named discovery merely to make the opening vivid. A clearly framed thought experiment is preferable to a dubious story.

Before ending, test whether the field map has actually formed. The viewer should be able to see why its territories exist, what changed at its landmarks, what passes across its boundaries, and why the opening problem now belongs to a larger intellectual world. The ending returns to the first question only after that map is in view.

Use spoken language that is concrete without becoming casual. A specialised term is welcome when the viewer first encounters the problem it solves; define it through its explanatory work, then allow it to become part of the vocabulary of the journey. If a transition needs a sentence such as “the next branch is,” replace it with the intellectual reason the viewer must now travel there. This protects the distinctive MapKAI experience: one map, many territories, and a route that reveals why they belong together.

Finally, preserve proportion. The opening device should occupy only enough time to make the central tension felt; the intellectual work belongs to the unfolding explanation. Let an unresolved limit or frontier remain genuinely open instead of manufacturing closure. A field overview earns maturity when it can offer a strong final insight while still showing the viewer where confidence should stop and further inquiry should begin.
`;
}

function videoPromptFor(field: Field, spine: Spine, blueprint: Blueprint, master: string) {
  const coverage = `Field identity and boundary: ${spine.definition}\n\nCentral question: ${spine.centralQuestion}\n\nWhy this field exists: ${spine.whyItExists}\n\nHow it thinks: ${spine.howItThinks}\n\nMajor branches to integrate:\n${bullets(spine.branches)}\n\nLandmark ideas to explain as shifts:\n${bullets(spine.landmarkIdeas)}\n\nHistorical shift: ${spine.history}\n\nApplications:\n${bullets(spine.applications)}\n\nCross-field connections:\n${bullets(spine.connections)}\n\nLimits and frontiers: ${field.categoryCode === "05" ? "Clarify model scope, uncertainty, complex systems, and unresolved boundaries." : "Clarify assumptions, incomplete evidence, contested interpretations, and the need for neighbouring fields."}\n\nFinal mental model: ${spine.learnerOutcome}`;
  return `# Compiled MapKAI Video Prompt: ${field.title}

**Content version:** v2-intellectual-journey

## Global MapKAI Creative Direction

${master}

## Field-Specific Narrative Blueprint

**Selected narrative engine:** ${blueprint.engine}

**Central device:** ${blueprint.device}

**Opening:** ${blueprint.opening}

**Tension:** ${blueprint.tension}

**First turn:** ${blueprint.firstTurn}

**Aha moment:** ${blueprint.aha}

**Progression:** ${blueprint.progression}

**Knowledge integration:** ${blueprint.integration}

**Ending return:** ${blueprint.ending}

**Final insight:** ${blueprint.insight}

## Mandatory Coverage Requirements

${coverage}

Create a standard Explainer Video Overview. Do not add branding or an outro; the MapKAI post-production pipeline handles that separately.
`;
}

function validationFor(field: Field, overview: string, blueprint: string, prompt: string, engine: NarrativeEngine) {
  const genericPatterns = [/\bX is the study of\b/i, /there are several branches/i, /another important area is/i, /plays an important role in everyday life/i, /^in conclusion/i, /by understanding .+ better understand the world/i];
  const matched = genericPatterns.filter((pattern) => pattern.test(`${blueprint}\n${prompt}`)).map(String);
  return {
    schemaVersion: "content-validation.v3", authority: "LEGACY_NON_AUTHORITATIVE", contentVersion: "v2-intellectual-journey", fieldCode: field.code, artifactType: LEGACY_ARTIFACT_TYPE, narrativeEngine: engine,
    knowledgeCoverage: { status: "LEGACY_NON_AUTHORITATIVE", score: null }, narrativeQuality: { status: "LEGACY_NON_AUTHORITATIVE", score: null },
    intellectualInsight: { status: "LEGACY_NON_AUTHORITATIVE", score: null }, adultTone: { status: "LEGACY_NON_AUTHORITATIVE", score: null }, fieldMapClarity: { status: "LEGACY_NON_AUTHORITATIVE", score: null },
    genericNarrativeWarning: matched.length > 0, notes: matched.length ? [`Generic pattern warning: ${matched.join(", ")}`] : [],
    editorialNote: "Legacy QA fields are retained only for historical compatibility and are not release evidence.", semanticReview: { status: "REQUIRED", decision: "BLOCKED", reasonCode: "INSUFFICIENT_EVIDENCE" },
    wordCounts: { overview: overview.split(/\s+/).length, narrativeBlueprint: blueprint.split(/\s+/).length, videoPrompt: prompt.split(/\s+/).length }
  };
}

async function makePack(field: Field, allFields: Field[], stories: any[], master: string, runContext?: { runId: string; policyBinding: any; activePromptVersions: Record<string, any> }) {
  const folder = path.join(PATHS.packs, field.slug);
  const packPath = path.join(folder, "overview.md");
  const promptPath = path.join(folder, "video_prompt.md");
  const blueprintPath = path.join(folder, "narrative_blueprint.md");
  const validationPath = path.join(folder, "content_validation.json");
  await mkdir(folder, { recursive: true });
  const spine = spineFor(field, allFields);
  const blueprint = blueprintFor(field, spine);
  const overview = overviewFor(field, spine, stories);
  const blueprintText = blueprintMarkdown(field, blueprint, spine);
  const prompt = videoPromptFor(field, spine, blueprint, master);
  await writeFile(packPath, overview);
  await writeFile(blueprintPath, blueprintText);
  await writeFile(promptPath, prompt);
  const baseValidation = validationFor(field, overview, blueprintText, prompt, blueprint.engine);
  const sensitiveContent = classifySensitiveContent({ fieldId: field.code, fieldName: field.title, text: `${overview}\n${prompt}` });
  const deterministic = deterministicValidate({
    artifactType: LEGACY_ARTIFACT_TYPE,
    fieldId: field.code,
    policyBinding: runContext?.policyBinding,
    requiredFiles: { overview, blueprint: blueprintText, videoPrompt: prompt },
    evidenceFields: { runId: Boolean(runContext?.runId), activePromptVersions: Boolean(runContext?.activePromptVersions && Object.keys(runContext.activePromptVersions).length) },
    expectedArtifactType: LEGACY_ARTIFACT_TYPE,
    sensitiveContent,
    learnerFacing: true,
    learnerFacingText: `${overview}\n${prompt}`,
    knownSubjectCodes: [field.code],
  });
  await saveJson(validationPath, { ...baseValidation, deterministicValidation: deterministic, sensitiveContent, productionEligible: false });
  const deterministicPath = path.join(folder, "deterministic_validation.json");
  await saveJson(deterministicPath, deterministic);
  const reviewPath = path.join(folder, "final_review_decision.json");
  await saveJson(reviewPath, blockedReviewDecision({ runId: runContext?.runId, fieldId: field.code, artifactType: LEGACY_ARTIFACT_TYPE, policyBinding: runContext?.policyBinding, reasonCode: sensitiveContent.status === "CLEAR" ? "INSUFFICIENT_EVIDENCE" : sensitiveContent.status }));
  await saveJson(path.join(folder, "field_representation_interface.json"), fieldRepresentationInterface({ fieldId: field.code, fieldName: field.title, source: "taxonomy/script.js — interface only; canonical real-world representation not populated in this phase" }));
  await saveJson(path.join(folder, "artifact_contract.json"), artifactContractPlaceholder(LEGACY_ARTIFACT_TYPE));
  return { packPath, promptPath, blueprintPath, validationPath, deterministicPath, reviewPath, engine: blueprint.engine };
}

function upgradedStatus(prior?: Item): Status {
  if (!prior) return "PENDING";
  // v1 used COMPLETE for both a ready video and a saved download. Split that ambiguity safely.
  if ((prior.status as string) === "COMPLETE") return prior.downloadedPath ? "VIDEO_DOWNLOADED" : "GENERATING";
  return prior.status;
}

async function diversityAudit(items: Item[]) {
  const counts = Object.fromEntries(["mystery", "paradox", "dilemma", "journey", "discovery", "thought experiment", "intellectual conflict"].map((engine) => [engine, items.filter((item) => item.narrativeEngine === engine).length]));
  const total = items.length || 1;
  const warnings = Object.entries(counts).filter(([, count]) => Number(count) / total > 0.3)
    .map(([engine, count]) => `${engine} is used by ${count}/${items.length} fields; review for avoidable repetition.`);
  await saveJson(PATHS.diversityAudit, { contentVersion: "v2-intellectual-journey", generatedAt: now(), narrativeEngineCounts: counts, warnings, note: "This is a diversity signal, not a requirement for equal distribution." });
}

async function bootstrap() {
  await mkdir(PATHS.packs, { recursive: true });
  await mkdir(PATHS.downloads, { recursive: true });
  const fields = await extractTaxonomy();
  const fables = await fablesByField();
  const masterPrompt = await readFile(PATHS.masterPrompt, "utf8");
  const cfg = await config();
  const binding = await policyBinding(cfg);
  const promptVersions = await activeLegacyPromptVersions();
  const runId = legacyRunId();
  await saveJson(PATHS.taxonomy, { generatedAt: now(), source: "script.js", fields });
  const existing = await manifest();
  const byCode = new Map(existing.items.map((item) => [item.code, item]));
  const items: Item[] = [];
  for (const field of fields) {
    const { packPath, promptPath, blueprintPath, validationPath, deterministicPath, reviewPath, engine } = await makePack(field, fields, fables.get(field.code) ?? [], masterPrompt, { runId, policyBinding: binding, activePromptVersions: promptVersions });
    const prior = byCode.get(field.code);
    const itemRunId = prior?.runId || runId;
    const itemBinding = prior?.policyBinding || binding;
    items.push({ ...field, packPath: path.relative(REPO, packPath), promptPath: path.relative(REPO, promptPath), blueprintPath: path.relative(REPO, blueprintPath), validationPath: path.relative(REPO, validationPath), contentVersion: "v2-intellectual-journey", narrativeEngine: engine, status: upgradedStatus(prior), attempts: prior?.attempts ?? 0,
      runId: itemRunId, artifactType: LEGACY_ARTIFACT_TYPE, policyBinding: itemBinding, activePromptVersions: promptVersions,
      deterministicValidationPath: path.relative(REPO, deterministicPath), reviewRecordPath: path.relative(REPO, reviewPath), finalDecisionPath: path.relative(REPO, reviewPath),
      fieldRepresentationPath: path.relative(REPO, path.join(path.dirname(packPath), "field_representation_interface.json")), artifactContractPath: path.relative(REPO, path.join(path.dirname(packPath), "artifact_contract.json")),
      ...(prior?.generationContentVersion ? { generationContentVersion: prior.generationContentVersion } : prior?.status === "GENERATING" ? { generationContentVersion: "v1" } : {}),
      ...(prior?.generationArchivePath ? { generationArchivePath: prior.generationArchivePath } : prior?.status === "GENERATING" && field.code === "0533" ? { generationArchivePath: "mapkai-video-factory/generations/physics-v1" } : {}),
      ...(prior?.videoMode ? { videoMode: prior.videoMode } : {}),
      ...(prior?.notebookUrl ? { notebookUrl: prior.notebookUrl } : {}), ...(prior?.submittedAt ? { submittedAt: prior.submittedAt } : {}),
      ...(prior?.completedAt ? { completedAt: prior.completedAt } : {}), ...(prior?.downloadedPath ? { downloadedPath: prior.downloadedPath } : {}),
      ...(prior?.nextAttemptAt ? { nextAttemptAt: prior.nextAttemptAt } : {}), ...(prior?.lastError ? { lastError: prior.lastError } : {}),
    });
    await writeLegacyRunRecord(items.at(-1), { status: items.at(-1)?.status || "PENDING", runPhase: "BOOTSTRAP" });
  }
  await diversityAudit(items);
  await saveManifest({ schemaVersion: 1, generatedAt: now(), runId, policyBinding: binding, activePromptVersions: promptVersions, items });
  console.log(`MapKAI Video Factory\n✓ Taxonomy loaded: ${fields.length} formal fields\n✓ Knowledge packs ready: ${items.length}\n✓ Dashboard: ${path.relative(REPO, PATHS.dashboard)}`);
}

function selected(items: Item[]) {
  return items.filter((item) => !requestedCodes || requestedCodes.includes(item.code));
}
function quota(item: Item, cfg: Config) {
  return item.attempts >= cfg.retryLimit || (item.nextAttemptAt && new Date(item.nextAttemptAt) > new Date());
}
function available(items: Item[], cfg: Config) {
  const submittedToday = items.filter((item) => item.submittedAt?.startsWith(dateKey())).length;
  const active = items.filter((item) => item.status === "GENERATING").length;
  return Math.max(0, Math.min(cfg.maxVideoPerDay - submittedToday, cfg.maxConcurrentGenerations - active));
}

async function ensurePolicyForManifest(data: Manifest, cfg?: Config) {
  const binding = await policyBinding(cfg);
  const prompts = data.activePromptVersions || await activeLegacyPromptVersions();
  const runId = data.runId || legacyRunId();
  const before = JSON.stringify({ runId: data.runId, policyBinding: data.policyBinding, activePromptVersions: data.activePromptVersions, items: data.items.map((item) => ({ code: item.code, runId: item.runId, policyBinding: item.policyBinding, artifactType: item.artifactType, deterministicValidationPath: item.deterministicValidationPath, reviewRecordPath: item.reviewRecordPath })) });
  data.runId = runId;
  data.policyBinding ||= binding;
  data.activePromptVersions ||= prompts;
  for (const item of data.items) {
    item.runId ||= runId;
    item.artifactType ||= LEGACY_ARTIFACT_TYPE;
    item.policyBinding ||= binding;
    item.activePromptVersions ||= prompts;
    item.deterministicValidationPath ||= path.join("mapkai-video-factory", "packs", item.slug, "deterministic_validation.json");
    item.reviewRecordPath ||= path.join("mapkai-video-factory", "packs", item.slug, "final_review_decision.json");
    item.finalDecisionPath ||= item.reviewRecordPath;
    item.fieldRepresentationPath ||= path.join("mapkai-video-factory", "packs", item.slug, "field_representation_interface.json");
    item.artifactContractPath ||= path.join("mapkai-video-factory", "packs", item.slug, "artifact_contract.json");
  }
  if (data.policyBinding && JSON.stringify({ creatingPolicy: data.policyBinding.creatingPolicy, reviewPolicy: data.policyBinding.reviewPolicy }) !== JSON.stringify({ creatingPolicy: binding.creatingPolicy, reviewPolicy: binding.reviewPolicy })) {
    throw new Error("POLICY_BINDING_MISMATCH: manifest policy binding does not match the canonical policy lock.");
  }
  for (const item of data.items) {
    if (item.policyBinding && JSON.stringify({ creatingPolicy: item.policyBinding.creatingPolicy, reviewPolicy: item.policyBinding.reviewPolicy }) !== JSON.stringify({ creatingPolicy: binding.creatingPolicy, reviewPolicy: binding.reviewPolicy })) {
      throw new Error(`POLICY_BINDING_MISMATCH: field ${item.code} policy binding does not match the canonical policy lock.`);
    }
  }
  const after = JSON.stringify({ runId: data.runId, policyBinding: data.policyBinding, activePromptVersions: data.activePromptVersions, items: data.items.map((item) => ({ code: item.code, runId: item.runId, policyBinding: item.policyBinding, artifactType: item.artifactType, deterministicValidationPath: item.deterministicValidationPath, reviewRecordPath: item.reviewRecordPath })) });
  if (before !== after) await saveManifest(data);
  return binding;
}

const REQUIRED_SPINE_SECTIONS = [
  "Field Identity", "Central Question", "Why This Field Exists", "How This Field Thinks", "Major Branches: A Connected Field Map",
  "Landmark Ideas: Changes in What Can Be Seen", "Historical Development as Intellectual Shifts", "Real-World Applications: From Idea to Consequence",
  "Connections Across the MapKAI Map", "Limits, Open Questions and Frontiers", "General Learner Mental Model",
];
const REQUIRED_NARRATIVE_SECTIONS = ["Central Narrative Device", "Opening Hook", "Central Tension", "First Intellectual Turn", "Aha Moment / Intellectual Reversal", "Knowledge Integration", "Ending Return", "Final Insight"];

function section(markdown: string, heading: string) {
  const marker = `## ${heading}\n\n`;
  const start = markdown.indexOf(marker);
  if (start < 0) return "";
  const end = markdown.indexOf("\n## ", start + marker.length);
  return markdown.slice(start + marker.length, end < 0 ? undefined : end).trim();
}
async function sanitizeLegacyValidation(file: string, value: any) {
  if (!value || value.authority === "LEGACY_NON_AUTHORITATIVE") return value;
  const qa = { ...value, schemaVersion: "content-validation.v3", authority: "LEGACY_NON_AUTHORITATIVE", semanticReview: { status: "REQUIRED", decision: "BLOCKED", reasonCode: "INSUFFICIENT_EVIDENCE" } };
  for (const key of ["knowledgeCoverage", "narrativeQuality", "intellectualInsight", "adultTone", "fieldMapClarity"]) {
    if (!qa[key]) continue;
    qa[key] = { ...qa[key], legacyStatus: qa[key].status ?? null, legacyScore: qa[key].score ?? null, status: "LEGACY_NON_AUTHORITATIVE", score: null };
  }
  await saveJson(file, qa);
  return qa;
}
async function validateContent(item: Item) {
  const knowledgeErrors: string[] = [];
  const narrativeErrors: string[] = [];
  const editorialErrors: string[] = [];
  const overview = path.join(REPO, item.packPath);
  const prompt = path.join(REPO, item.promptPath);
  const blueprint = item.blueprintPath && path.join(REPO, item.blueprintPath);
  const validation = item.validationPath && path.join(REPO, item.validationPath);
  if (!existsSync(overview)) knowledgeErrors.push(`Missing overview.md: ${item.packPath}`);
  if (!existsSync(prompt)) knowledgeErrors.push(`Missing video_prompt.md: ${item.promptPath}`);
  if (!blueprint || !existsSync(blueprint)) narrativeErrors.push(`Missing narrative_blueprint.md for ${item.code}`);
  if (!validation || !existsSync(validation)) editorialErrors.push(`Missing content_validation.json for ${item.code}`);
  if (knowledgeErrors.length || narrativeErrors.length || editorialErrors.length) return { knowledgeErrors, narrativeErrors, editorialErrors };
  const markdown = await readFile(overview, "utf8");
  for (const heading of REQUIRED_SPINE_SECTIONS) if (!section(markdown, heading)) knowledgeErrors.push(`Missing Knowledge Spine area: ${heading}`);
  const ideas = section(markdown, "Landmark Ideas: Changes in What Can Be Seen").match(/^### /gm) ?? [];
  if (ideas.length < 3 || ideas.length > 6) knowledgeErrors.push(`Landmark ideas must contain 3–6 items; found ${ideas.length}.`);
  const blueprintMarkdown = await readFile(blueprint, "utf8");
  for (const heading of REQUIRED_NARRATIVE_SECTIONS) if (!section(blueprintMarkdown, heading)) narrativeErrors.push(`Missing narrative blueprint area: ${heading}`);
  const videoPrompt = await readFile(prompt, "utf8");
  for (const phrase of ["Master Creative Direction", "Field-Specific Narrative Blueprint", "Mandatory Coverage Requirements", "Final mental model"]) {
    if (!videoPrompt.toLowerCase().includes(phrase.toLowerCase())) narrativeErrors.push(`video_prompt.md is missing required instruction: ${phrase}`);
  }
  let qa = await json<any>(validation);
  qa = await sanitizeLegacyValidation(validation, qa);
  // Legacy QA fields are retained as historical data only. They cannot be
  // used as evidence for a semantic release decision, even when they contain
  // old 10/9 scores.
  if (qa.authority !== "LEGACY_NON_AUTHORITATIVE") editorialErrors.push("Legacy quality scores are non-authoritative; independent semantic review is required.");
  if (qa.semanticReview?.status !== "REQUIRED") editorialErrors.push("Missing explicit semantic-review hold.");
  const sensitiveContent = qa.sensitiveContent || classifySensitiveContent({ fieldId: item.code, fieldName: item.title, text: `${markdown}\n${videoPrompt}` });
  if (["SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED"].includes(sensitiveContent.status)) editorialErrors.push(`Sensitive governance hold: ${sensitiveContent.status}`);
  const deterministic = deterministicValidate({
    artifactType: item.artifactType || LEGACY_ARTIFACT_TYPE,
    fieldId: item.code,
    policyBinding: item.policyBinding,
    requiredFiles: { overview: existsSync(overview), blueprint: existsSync(blueprint), videoPrompt: existsSync(prompt) },
    evidenceFields: { runId: Boolean(item.runId), activePromptVersions: Boolean(item.activePromptVersions && Object.keys(item.activePromptVersions).length) },
    expectedArtifactType: LEGACY_ARTIFACT_TYPE,
    sensitiveContent,
    learnerFacing: true,
    learnerFacingText: `${markdown}\n${videoPrompt}`,
    knownSubjectCodes: [item.code],
  });
  if (deterministic.status === "FAIL") editorialErrors.push(...deterministic.errors);
  if (item.deterministicValidationPath) await saveJson(path.join(REPO, item.deterministicValidationPath), deterministic);
  if (item.reviewRecordPath && !existsSync(path.join(REPO, item.reviewRecordPath))) await saveJson(path.join(REPO, item.reviewRecordPath), blockedReviewDecision({ runId: item.runId, fieldId: item.code, artifactType: item.artifactType || LEGACY_ARTIFACT_TYPE, policyBinding: item.policyBinding, reasonCode: sensitiveContent.status === "CLEAR" ? "INSUFFICIENT_EVIDENCE" : sensitiveContent.status }));
  return { knowledgeErrors, narrativeErrors, editorialErrors, sensitiveContent, deterministic };
}
async function preflight(data: Manifest, scope = data.items) {
  let changed = false;
  for (const item of scope) {
    if (!["PENDING", "CONTENT_INCOMPLETE", "NARRATIVE_INCOMPLETE", "EDITORIAL_REVIEW_REQUIRED", "SEMANTIC_REVIEW_REQUIRED", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED"].includes(item.status)) continue;
    const results = await validateContent(item);
    const errors = [...results.knowledgeErrors, ...results.narrativeErrors, ...results.editorialErrors];
    const status: Status = results.knowledgeErrors.length ? "CONTENT_INCOMPLETE" : results.narrativeErrors.length ? "NARRATIVE_INCOMPLETE" : results.sensitiveContent?.status === "POLICY_CLARIFICATION_REQUIRED" ? "POLICY_CLARIFICATION_REQUIRED" : results.sensitiveContent?.status === "SENSITIVE_TOPIC_REVIEW_REQUIRED" ? "SENSITIVE_TOPIC_REVIEW_REQUIRED" : results.editorialErrors.length ? "EDITORIAL_REVIEW_REQUIRED" : "PENDING";
    if (status !== "PENDING") {
      if (item.status !== status || item.lastError !== errors.join(" ")) changed = true;
      item.status = status; item.lastError = errors.join(" ");
    } else if (item.status !== "PENDING") {
      item.status = "PENDING"; item.lastError = undefined; changed = true;
    }
  }
  if (changed) await saveManifest(data);
}

async function plan() {
  const [data, cfg] = await Promise.all([manifest(), config()]);
  await ensurePolicyForManifest(data, cfg);
  await preflight(data, selected(data.items));
  const candidates = selected(data.items).filter((item) => item.status === "PENDING" && item.finalReviewDecision === "PASS" && !quota(item, cfg));
  const count = Math.min(limit ?? candidates.length, available(data.items, cfg), candidates.length);
  const blocked = selected(data.items).filter((item) => ["CONTENT_INCOMPLETE", "NARRATIVE_INCOMPLETE", "EDITORIAL_REVIEW_REQUIRED", "SEMANTIC_REVIEW_REQUIRED", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED"].includes(item.status));
  console.log(`MapKAI Video Factory\n\nQuota today: ${cfg.maxVideoPerDay}; active generation cap: ${cfg.maxConcurrentGenerations}\nEditorial preflight: ${blocked.length ? `${blocked.length} blocked` : "passed"}\nReady to submit: ${count}\n`);
  for (const item of candidates.slice(0, count)) console.log(`${item.code}  ${item.title.padEnd(48)} PENDING`);
  for (const item of blocked) console.log(`${item.code}  ${item.title.padEnd(48)} ${item.status}  ${item.lastError}`);
  if (!execute) console.log("\nDry run only. Add --execute to submit to Gemini Notebook.");
}

async function clickAny(page: any, names: RegExp[]) {
  for (const name of names) {
    const button = page.getByRole("button", { name });
    if (await button.count()) { await button.first().click({ timeout: 10_000 }); return; }
  }
  throw new Error(`Could not find action: ${names.map(String).join(" or ")}`);
}
async function fillAny(page: any, labels: RegExp[], value: string) {
  for (const label of labels) {
    const input = page.getByLabel(label);
    if (await input.count()) { await input.first().fill(value); return; }
  }
  const area = page.locator("textarea");
  if (await area.count()) { await area.first().fill(value); return; }
  throw new Error("Could not find the Video Overview prompt field.");
}
async function attachToChrome(cfg: Config) {
  const { chromium } = await import("playwright");
  try { return await chromium.connectOverCDP(cfg.chromeCdpUrl); }
  catch { throw new Error(`Could not connect to Chrome at ${cfg.chromeCdpUrl}. Open Chrome with --remote-debugging-port=9222, sign in to Gemini Notebook, and retry.`); }
}
async function createAndSubmit(browser: any, field: Item, cfg: Config, videoPrompt: string) {
  const context = browser.contexts()[0];
  if (!context) throw new Error("Chrome did not expose a browser context.");
  const page = await context.newPage();
  try {
    await page.goto(cfg.notebookHomeUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await clickAny(page, [/create new notebook/i, /create new/i]);
    await page.waitForTimeout(1000);
    const uploader = page.locator('input[type="file"]');
    if (!await uploader.count()) await clickAny(page, [/add source/i, /upload/i]);
    const fileInput = page.locator('input[type="file"]');
    await fileInput.first().setInputFiles(path.join(REPO, field.packPath));
    await page.waitForTimeout(2500);
    const studio = page.getByRole("tab", { name: /studio/i });
    if (await studio.count()) { await studio.first().click({ timeout: 10_000 }); await page.waitForTimeout(500); }
    await clickAny(page, [/video overview/i]);
    await page.waitForTimeout(500);
    const customise = page.getByRole("button", { name: /customi[sz]e|custom/i });
    if (await customise.count()) await customise.first().click();
    await fillAny(page, [/video overview.*prompt/i, /custom.*prompt/i, /what should/i], videoPrompt);
    await clickAny(page, [/generate/i, /create/i]);
    await page.waitForTimeout(1000);
    return page.url();
  } finally { await page.close(); }
}

async function submit() {
  if (!execute) return plan();
  const [data, cfg] = await Promise.all([manifest(), config()]);
  await ensurePolicyForManifest(data, cfg);
  await preflight(data, selected(data.items));
  const candidates = selected(data.items).filter((item) => item.status === "PENDING" && item.finalReviewDecision === "PASS" && !quota(item, cfg));
  const count = Math.min(limit ?? candidates.length, available(data.items, cfg), candidates.length);
  if (!count) return console.log("No fields are eligible for submission within today's limits.");
  const browser = await attachToChrome(cfg);
  try {
    for (const item of candidates.slice(0, count)) {
      console.log(`${item.code}  ${item.title}  SUBMITTING`);
      try {
        const videoPrompt = await readFile(path.join(REPO, item.promptPath), "utf8");
        item.notebookUrl = await createAndSubmit(browser, item, cfg, videoPrompt);
        item.status = "GENERATING"; item.submittedAt = now(); item.attempts += 1; item.lastError = undefined; item.nextAttemptAt = undefined;
        await writeLegacyRunRecord(item, { status: item.status, submittedAt: item.submittedAt, notebookUrl: item.notebookUrl });
        console.log(`${item.code}  ${item.title}  GENERATING`);
      } catch (error) {
        item.attempts += 1;
        const message = error instanceof Error ? error.message : String(error);
        item.lastError = message;
        if (/quota|limit|try again later/i.test(message)) {
          item.status = "WAITING_QUOTA";
          item.nextAttemptAt = new Date(Date.now() + cfg.retryBackoffMinutes * 60_000).toISOString();
        } else item.status = item.attempts >= cfg.retryLimit ? "FAILED" : "PENDING";
        await writeLegacyRunRecord(item, { status: item.status, error: message });
        console.error(`${item.code}  ${item.title}  ${item.status}: ${message}`);
      }
      await saveManifest(data);
      await pause(700);
    }
  } finally { await browser.close(); }
}

type PilotAudit = {
  attemptId: string; auditFolder: string; rawFileName: string; contentVersion: string;
  narrativeEngine: string; overviewPath: string; promptPath: string; blueprintPath?: string;
};

function pilotAudit(item: Item): PilotAudit {
  const contentVersion = item.generationContentVersion ?? "UNKNOWN";
  const physicsV1 = item.code === "0533" && contentVersion === "v1";
  const base = physicsV1 && item.generationArchivePath ? path.join(REPO, item.generationArchivePath) : REPO;
  const auditFolder = path.join(PATHS.review, `${item.code}-${safeSlug(item.title)}`);
  const version = contentVersion === "v1" ? "v1" : contentVersion === "v2-intellectual-journey" ? "v2" : "unknown";
  return {
    attemptId: `${item.code}-${safeSlug(item.title)}-${(item.submittedAt ?? "UNKNOWN").replace(/[^0-9]/g, "").slice(0, 14) || "UNKNOWN"}`,
    auditFolder, rawFileName: `${safeSlug(item.title)}-${item.code}-${version}-raw.mp4`, contentVersion,
    narrativeEngine: physicsV1 ? "UNKNOWN" : item.narrativeEngine ?? "UNKNOWN",
    overviewPath: physicsV1 ? path.join(base, "overview.md") : path.join(REPO, item.packPath),
    promptPath: physicsV1 ? path.join(base, "video_prompt.md") : path.join(REPO, item.promptPath),
    ...(physicsV1 ? {} : item.blueprintPath ? { blueprintPath: path.join(REPO, item.blueprintPath) } : {}),
  };
}
async function writeOnce(file: string, content: string) { if (!existsSync(file)) await writeFile(file, content); }
async function copyOnce(source: string, destination: string) { if (!existsSync(destination) && existsSync(source)) await copyFile(source, destination); }
function unknown(value: string | undefined) { return value ?? "UNKNOWN"; }
async function reviewLog(event: Record<string, unknown>) {
  await mkdir(PATHS.review, { recursive: true });
  const file = path.join(PATHS.review, "monitor_log.json");
  const prior = existsSync(file) ? await json<any[]>(file) : [];
  prior.push({ at: now(), ...event }); await saveJson(file, prior);
}
async function updatePilotMetadata(item: Item, patch: Record<string, unknown> = {}) {
  const audit = pilotAudit(item); await mkdir(audit.auditFolder, { recursive: true });
  const file = path.join(audit.auditFolder, "generation_metadata.json");
  const prior = existsSync(file) ? await json<Record<string, unknown>>(file) : {};
  const submitted = item.submittedAt ? new Date(item.submittedAt).getTime() : NaN;
  const completed = item.completedAt ? new Date(item.completedAt).getTime() : NaN;
  await saveJson(file, {
    downloadedAt: "UNKNOWN", rawVideoPath: "UNKNOWN", fileSize: "UNKNOWN", videoDuration: "UNKNOWN", resolution: "UNKNOWN", ...prior,
    fieldCode: item.code, fieldName: item.title, notebookUrl: unknown(item.notebookUrl), generationAttemptId: audit.attemptId,
    contentVersion: audit.contentVersion, narrativeEngine: audit.narrativeEngine, videoMode: item.videoMode ?? "UNKNOWN",
    submittedAt: unknown(item.submittedAt), completedAt: item.completedAt ?? "UNKNOWN",
    generationDurationMinutes: Number.isFinite(submitted) && Number.isFinite(completed) ? Math.round((completed - submitted) / 60_000 * 10) / 10 : "UNKNOWN",
    status: item.status, ...patch,
  });
}
async function preparePilotAudit(item: Item) {
  const audit = pilotAudit(item); await mkdir(audit.auditFolder, { recursive: true });
  const overview = existsSync(audit.overviewPath) ? await readFile(audit.overviewPath, "utf8") : "UNKNOWN";
  const prompt = existsSync(audit.promptPath) ? await readFile(audit.promptPath, "utf8") : "UNKNOWN";
  await writeOnce(path.join(audit.auditFolder, "submission_payload.md"), `# Actual Gemini Notebook Submission Payload\n\n- Field: ${item.code} ${item.title}\n- Generation attempt: ${audit.attemptId}\n- Content version: ${audit.contentVersion}\n- Narrative engine: ${audit.narrativeEngine}\n- Video mode: ${item.videoMode ?? "UNKNOWN"}\n- Submitted at: ${unknown(item.submittedAt)}\n- Notebook: ${unknown(item.notebookUrl)}\n\nThis record is frozen for audit. It records the existing submission, not any later editorial revision.\n\n## Submitted source: overview.md\n\n${overview}\n\n## Submitted custom video prompt\n\n${prompt}`);
  await copyOnce(audit.overviewPath, path.join(audit.auditFolder, "overview.md"));
  await copyOnce(audit.promptPath, path.join(audit.auditFolder, "video_prompt.md"));
  if (audit.blueprintPath) await copyOnce(audit.blueprintPath, path.join(audit.auditFolder, "narrative_blueprint.md"));
  else await writeOnce(path.join(audit.auditFolder, "narrative_blueprint.md"), "# Narrative Blueprint\n\nUNKNOWN — this v1 baseline was submitted before the v2 narrative-blueprint system. No field-specific blueprint was used.\n");
  await writeOnce(path.join(audit.auditFolder, "human_review.json"), `${JSON.stringify({ narrativeEngagement: null, ahaIntellectualInsight: null, knowledgeCoverage: null, mentalMapClarity: null, adultMatureTone: null, visualQuality: null, mapkaiDifferentiation: null, keyStrengths: "", keyWeaknesses: "", missingKnowledge: "", genericAiFeeling: "UNDECIDED", wouldKeepWatching: "UNDECIDED", finalDecision: "UNDECIDED", note: "Manual-only calibration review. Do not use this file to auto-publish." }, null, 2)}\n`);
  await updatePilotMetadata(item);
}
async function prepareReview() {
  const data = await manifest(); const pilots = data.items.filter((item) => PILOT_CODES.includes(item.code));
  for (const item of pilots) await preparePilotAudit(item);
  await pilotReviewDashboard(data);
  console.log(`Pilot review materials prepared for ${pilots.length} existing generations. No Gemini action was taken.`);
}
async function probeVideo(file: string) {
  try {
    const { stdout } = await execFileAsync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=width,height", "-of", "json", file]);
    const info = JSON.parse(stdout); const stream = (info.streams ?? []).find((value: any) => value.width && value.height);
    return { videoDuration: info.format?.duration ? Math.round(Number(info.format.duration) * 10) / 10 : "UNKNOWN", resolution: stream ? `${stream.width}x${stream.height}` : "UNKNOWN" };
  } catch { return { videoDuration: "UNKNOWN", resolution: "UNKNOWN" }; }
}
async function receivePilotDownload(item: Item, download: any) {
  const audit = pilotAudit(item); const raw = path.join(PATHS.review, audit.rawFileName); const receipt = path.join(audit.auditFolder, "raw_video_receipt.json");
  if (existsSync(raw)) {
    const prior = existsSync(receipt) ? await json<any>(receipt) : null;
    if (prior?.generationAttemptId !== audit.attemptId) throw new Error(`Refusing to overwrite existing raw video; its generation attempt is unverified or different: ${raw}`);
  } else {
    const temporary = await download.path(); if (!temporary) throw new Error("Browser download did not expose a local temporary file.");
    await copyFile(temporary, raw);
  }
  const auditRaw = path.join(audit.auditFolder, audit.rawFileName); await copyOnce(raw, auditRaw);
  const details = await stat(raw); const technical = await probeVideo(raw); const downloadedAt = now();
  await saveJson(receipt, { generationAttemptId: audit.attemptId, downloadedAt, rawVideoPath: path.relative(REPO, raw), fileSize: details.size });
  item.downloadedPath = path.relative(REPO, raw); item.status = "VIDEO_DOWNLOADED"; item.completedAt ??= downloadedAt; item.lastError = undefined;
  await updatePilotMetadata(item, { downloadedAt, rawVideoPath: item.downloadedPath, fileSize: details.size, ...technical, status: "VIDEO_DOWNLOADED" });
  await reviewLog({ fieldCode: item.code, event: "VIDEO_DOWNLOADED", rawVideoPath: item.downloadedPath });
}
async function monitorPilots() {
  const data = await manifest(); const pilots = data.items.filter((item) => PILOT_CODES.includes(item.code));
  for (const item of pilots) await preparePilotAudit(item);
  if (!execute) { await pilotReviewDashboard(data); return console.log("Dry run only. Existing pilot notebooks would be checked; no Gemini action was taken."); }
  const cfg = await config(); const items = pilots.filter((item) => ["GENERATING", "VIDEO_READY"].includes(item.status) && item.notebookUrl);
  const browser = await attachToChrome(cfg);
  try {
    const context = browser.contexts()[0]; if (!context) throw new Error("Chrome did not expose a browser context.");
    for (const item of items) {
      const page = await context.newPage();
      try {
        await page.goto(item.notebookUrl!, { waitUntil: "domcontentloaded" }); await page.waitForTimeout(1200);
        const content = await page.locator("body").innerText({ timeout: 10_000 });
        const ready = /video.*(ready|complete)|ready.*video/i.test(content) && !/generating.*video|video.*generating/i.test(content);
        if (!ready) { console.log(`${item.code}  ${item.title}  ${item.status}`); await reviewLog({ fieldCode: item.code, event: "GENERATING" }); continue; }
        if (item.status !== "VIDEO_READY") { item.status = "VIDEO_READY"; item.completedAt = now(); await updatePilotMetadata(item); await saveManifest(data); await reviewLog({ fieldCode: item.code, event: "VIDEO_READY" }); }
        const download = page.getByRole("button", { name: /download/i });
        if (!await download.count()) { console.log(`${item.code}  ${item.title}  VIDEO_READY (download control not found)`); continue; }
        const event = page.waitForEvent("download", { timeout: 15_000 }); await download.first().click();
        await receivePilotDownload(item, await event); await saveManifest(data);
        item.status = "HUMAN_REVIEW_PENDING"; await updatePilotMetadata(item, { status: "HUMAN_REVIEW_PENDING" }); await saveManifest(data);
        await reviewLog({ fieldCode: item.code, event: "HUMAN_REVIEW_PENDING" }); console.log(`${item.code}  ${item.title}  HUMAN_REVIEW_PENDING`);
      } catch (error) { item.lastError = error instanceof Error ? error.message : String(error); await reviewLog({ fieldCode: item.code, event: "MONITOR_ERROR", error: item.lastError }); }
      finally { await page.close(); await saveManifest(data); }
    }
  } finally { await browser.close(); }
  await pilotReviewDashboard(data);
}
async function check() { return monitorPilots(); }

function brandingLogoPath(cfg: Config) {
  if (!cfg.branding.logoPath) return null;
  return path.isAbsolute(cfg.branding.logoPath) ? cfg.branding.logoPath : path.join(REPO, cfg.branding.logoPath);
}

async function brand() {
  const [data, cfg] = await Promise.all([manifest(), config()]);
  const items = selected(data.items).filter((item) => ["VIDEO_DOWNLOADED", "BRANDING"].includes(item.status));
  if (!execute) return console.log(`Dry run only. ${items.length} downloaded video(s) are ready for the MapKAI branding pipeline. Add --execute to move them into BRANDING.`);
  const logo = brandingLogoPath(cfg);
  for (const item of items) {
    const decision = item.finalDecisionPath && existsSync(path.join(REPO, item.finalDecisionPath)) ? await json<any>(path.join(REPO, item.finalDecisionPath)) : null;
    if (decision?.decision !== "PASS" || decision?.evidenceSufficient !== true) {
      item.status = "HUMAN_REVIEW_PENDING";
      item.lastError = "Branding is blocked until an evidence-bound final review decision PASS is recorded.";
      await writeLegacyRunRecord(item, { status: item.status, decision: decision?.decision || "BLOCKED" });
      continue;
    }
    item.status = "BRANDING";
    if (!logo || !existsSync(logo)) {
      item.lastError = "Branding is waiting for an approved MapKAI logo. Set branding.logoPath to the real asset before rendering the outro.";
      console.log(`${item.code}  ${item.title}  BRANDING (awaiting approved logo)`);
      continue;
    }
    // The state transition is intentionally reserved until a real outro renderer is configured.
    // No substitute logo or unbranded publication asset is ever created here.
    item.lastError = `Approved logo found at ${path.relative(REPO, logo)}. Outro renderer is the next pipeline integration; target outro: fade in logo + “${cfg.branding.tagline}” for ${cfg.branding.holdSeconds}s, then fade out.`;
    console.log(`${item.code}  ${item.title}  BRANDING (logo ready; outro renderer pending)`);
  }
  await saveManifest(data);
}

async function pilotReviewDashboard(data: Manifest) {
  await mkdir(PATHS.review, { recursive: true });
  const pilots = data.items.filter((item) => PILOT_CODES.includes(item.code));
  const labels: Record<string, string> = {
    "0533": "V1 Baseline", "0311": "V2 Paradox", "0313": "V2 Intellectual Conflict",
  };
  const cards = await Promise.all(pilots.map(async (item) => {
    const audit = pilotAudit(item);
    const metadataFile = path.join(audit.auditFolder, "generation_metadata.json");
    const metadata = existsSync(metadataFile) ? await json<any>(metadataFile) : {};
    const reviewFile = path.join(audit.auditFolder, "human_review.json");
    const raw = item.downloadedPath ? `../../${item.downloadedPath.replace(/^mapkai-video-factory\//, "")}` : "";
    const localLink = raw ? `<a href="${escapeHtml(raw)}">Raw MP4</a>` : "—";
    const source = `../../${item.packPath.replace(/^mapkai-video-factory\//, "")}`;
    const prompt = `../../${item.promptPath.replace(/^mapkai-video-factory\//, "")}`;
    const auditLink = `${item.code}-${safeSlug(item.title)}`;
    const metrics = ["Narrative Engagement", "Aha / Intellectual Insight", "Knowledge Coverage", "Mental Map Clarity", "Adult / Mature Tone", "Visual Quality", "MapKAI Differentiation"];
    return `<article class="card pilot"><p class="eyebrow">${escapeHtml(labels[item.code] ?? item.contentVersion ?? "UNKNOWN")}</p><h2>${escapeHtml(item.title)}</h2><p><span class="status ${item.status.toLowerCase()}">${item.status}</span></p><dl><dt>Content version</dt><dd>${escapeHtml(pilotAudit(item).contentVersion)}</dd><dt>Narrative engine</dt><dd>${escapeHtml(pilotAudit(item).narrativeEngine)}</dd><dt>Video duration</dt><dd>${escapeHtml(String(metadata.videoDuration ?? "UNKNOWN"))}</dd><dt>Generation time</dt><dd>${escapeHtml(String(metadata.generationDurationMinutes ?? "UNKNOWN"))}</dd></dl><p><a href="${item.notebookUrl}">Notebook</a> · ${localLink} · <a href="${escapeHtml(source)}">Source pack</a> · <a href="${escapeHtml(prompt)}">Prompt</a> · <a href="${auditLink}/submission_payload.md">Audit</a></p><section class="review"><h3>Human review — intentionally blank</h3>${metrics.map((metric) => `<div class="metric"><span>${metric}</span><strong>— /10</strong></div>`).join("")}<p>Key strengths: <em>[manual]</em></p><p>Key weaknesses: <em>[manual]</em></p><p>Missing knowledge: <em>[manual]</em></p><p>Generic AI feeling: <em>[None / Low / Medium / High]</em></p><p>Would I voluntarily keep watching? <em>[Yes / Maybe / No]</em></p><p>Final decision: <em>[Undecided / Accept / Regenerate]</em></p><p><a href="${auditLink}/human_review.json">Open manual score sheet</a></p></section></article>`;
  }));
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MapKAI Pilot Review</title><style>body{margin:0;background:#0b1723;color:#e7eef6;font:15px system-ui,-apple-system,sans-serif}.page{max-width:1120px;margin:auto;padding:44px 24px}.muted,.eyebrow,dt{color:#9cb0c5}.eyebrow{text-transform:uppercase;letter-spacing:.08em;font-size:12px}h1{margin:4px 0 8px;font-size:32px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;margin-top:28px}.card{background:#142638;border:1px solid #284156;border-radius:14px;padding:20px}.pilot h2{margin:5px 0 14px}dl{display:grid;grid-template-columns:130px 1fr;gap:8px;margin:18px 0}.status{font-size:11px;font-weight:700;border-radius:50px;padding:5px 9px;background:#1d4d72}.human_review_pending{background:#5b4b83}.video_ready{background:#43615d}.metric{display:flex;justify-content:space-between;border-bottom:1px solid #284156;padding:8px 0}.review{margin-top:22px;border-top:1px solid #284156;padding-top:12px}.review h3{margin:0 0 8px}em{color:#9cb0c5}a{color:#82c9ff}</style><body><main class="page"><p class="eyebrow">MapKAI Content Factory</p><h1>Pilot Review</h1><p class="muted">Calibration samples only. Scores and publication decisions are human-only; this dashboard does not evaluate or publish videos.</p><div class="grid">${cards.join("")}</div></main></body></html>`;
  await writeFile(path.join(PATHS.review, "index.html"), html);
}

async function dashboard(data: Manifest) {
  const totals = Object.fromEntries(["PENDING", "CONTENT_INCOMPLETE", "NARRATIVE_INCOMPLETE", "EDITORIAL_REVIEW_REQUIRED", "SEMANTIC_REVIEW_REQUIRED", "SENSITIVE_TOPIC_REVIEW_REQUIRED", "POLICY_CLARIFICATION_REQUIRED", "GENERATING", "VIDEO_READY", "VIDEO_DOWNLOADED", "HUMAN_REVIEW_PENDING", "BRANDING", "READY_TO_PUBLISH", "FAILED", "WAITING_QUOTA"].map((status) => [status, data.items.filter((item) => item.status === status).length]));
  const coverage = data.items.length ? Math.round((totals.READY_TO_PUBLISH / data.items.length) * 100) : 0;
  const rows = data.items.map((item) => `<tr><td>${item.code}</td><td>${escapeHtml(item.title)}</td><td>${escapeHtml(item.titleZh)}</td><td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td><td>${item.notebookUrl ? `<a href="${item.notebookUrl}">Notebook</a>` : "—"}</td><td>${item.downloadedPath ? escapeHtml(item.downloadedPath) : "—"}</td></tr>`).join("");
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MapKAI Content Factory</title><style>body{margin:0;background:#0b1723;color:#e7eef6;font:14px system-ui,-apple-system,sans-serif}.page{max-width:1200px;margin:0 auto;padding:44px 24px}h1{font-size:30px;margin:0 0 8px}.muted{color:#9cb0c5}.cards{display:flex;gap:12px;flex-wrap:wrap;margin:28px 0}.card{background:#142638;border:1px solid #284156;border-radius:12px;padding:16px;min-width:130px}.number{display:block;font-size:25px;font-weight:700;margin-top:6px}.bar{height:12px;background:#213a4e;border-radius:10px;overflow:hidden;margin:14px 0 30px}.bar>i{display:block;background:#65c5a2;height:100%;width:${coverage}%}table{border-collapse:collapse;width:100%;background:#102131;border-radius:12px;overflow:hidden}th,td{text-align:left;padding:12px;border-bottom:1px solid #263e52}th{color:#9cb0c5;font-weight:600}.status{font-size:11px;font-weight:700;border-radius:50px;padding:4px 8px;background:#33475b}.ready_to_publish{background:#185c4b}.generating{background:#1d4d72}.waiting_quota{background:#715920}.failed,.content_incomplete,.narrative_incomplete,.editorial_review_required{background:#702f3a}a{color:#82c9ff}</style><body><main class="page"><p class="muted">MapKAI Content Factory</p><h1>Overview Coverage ${coverage}%</h1><p class="muted">${totals.READY_TO_PUBLISH} / ${data.items.length} formal fields ready to publish · Updated ${data.generatedAt ?? "not yet"}</p><p><a href="review/pilots/index.html">Open Pilot Review</a></p><div class="bar"><i></i></div><section class="cards">${Object.entries(totals).map(([status, count]) => `<div class="card"><span class="muted">${status}</span><span class="number">${count}</span></div>`).join("")}</section><table><thead><tr><th>Code</th><th>Field</th><th>中文</th><th>Video</th><th>Notebook</th><th>Download</th></tr></thead><tbody>${rows}</tbody></table></main></body></html>`;
  await writeFile(PATHS.dashboard, html);
}
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]!)); }

if (command === "bootstrap") await bootstrap();
else if (command === "plan") await plan();
else if (command === "submit") await submit();
else if (command === "check") await check();
else if (command === "prepare-review") await prepareReview();
else if (command === "monitor-pilots") await monitorPilots();
else if (command === "brand") await brand();
else if (command === "dashboard") await dashboard(await manifest());
else throw new Error(`Unknown command: ${command}. Use bootstrap, plan, submit, check, prepare-review, monitor-pilots, brand, or dashboard.`);
