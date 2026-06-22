import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const repoRoot = process.cwd();
const scriptPath = path.join(repoRoot, "script.js");
const outputDir = path.join(repoRoot, "docs", "gpt-story-generation");
const defaultBatchSize = 10;

function noop() {}

function makeElement() {
  return {
    dataset: {},
    style: {},
    hidden: false,
    className: "",
    innerHTML: "",
    textContent: "",
    value: "",
    classList: {
      contains: () => false,
      toggle: noop,
      add: noop,
      remove: noop,
    },
    appendChild: noop,
    remove: noop,
    setAttribute: noop,
    addEventListener: noop,
    querySelectorAll: () => [],
    querySelector: () => null,
    closest: () => null,
    matches: () => false,
    getContext: () => ({
      clearRect: noop,
      drawImage: noop,
      fillRect: noop,
      beginPath: noop,
      arc: noop,
      fill: noop,
      stroke: noop,
      moveTo: noop,
      lineTo: noop,
      closePath: noop,
      save: noop,
      restore: noop,
      translate: noop,
      scale: noop,
      fillText: noop,
      measureText: () => ({ width: 0 }),
    }),
  };
}

function makeStorage() {
  const store = new Map();
  return {
    getItem: (key) => store.get(key) || null,
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
  };
}

function loadSiteData() {
  const localStorage = makeStorage();
  const sessionStorage = makeStorage();
  const context = {
    document: {
      body: makeElement(),
      documentElement: makeElement(),
      querySelectorAll: () => [],
      querySelector: () => null,
      getElementById: () => null,
      createElement: () => makeElement(),
      addEventListener: noop,
    },
    window: {
      addEventListener: noop,
      location: { pathname: "/" },
      history: { pushState: noop, replaceState: noop },
    },
    localStorage,
    sessionStorage,
    console,
    fetch: async () => ({ ok: false, json: async () => ({}) }),
    crypto: { randomUUID: () => "mapkai-export-session" },
    Image: function Image() {},
    setTimeout,
    clearTimeout,
    URLSearchParams,
  };

  const exportCode = `
;globalThis.__mapkaiExport = {
  appVersion,
  categories,
  knowledgeFields,
  knowledgeNarrowFields,
  lensStories,
  conceptFables,
  stories,
  historicalStories
};
`;

  const code = `${fs.readFileSync(scriptPath, "utf8")}\n${exportCode}`;
  vm.createContext(context);
  new vm.Script(code, { filename: "script.js" }).runInContext(context);
  return context.__mapkaiExport;
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeMetaphorMap(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const storyElement = cleanText(item.storyElement || item.image);
      const knowledgeElement = cleanText(item.knowledgeElement || item.meaning);
      if (!storyElement && !knowledgeElement) return null;
      return { storyElement, knowledgeElement };
    })
    .filter(Boolean);
}

function findField(data, code) {
  if (!code) return null;
  return data.knowledgeFields.find((field) => field.code === code || field.id === code) || null;
}

function findCategory(data, code) {
  return data.categories.find((category) => category.code === code) || null;
}

function findGroup(category, code) {
  return category?.groups?.find((group) => group.code === code) || null;
}

function findFieldTitleInCategory(group, fieldCode) {
  const field = group?.fields?.find(([code]) => code === fieldCode);
  return field ? cleanText(field[1]) : "";
}

function getFieldCode(story) {
  if (Array.isArray(story.fieldCodes) && story.fieldCodes.length) return story.fieldCodes[0];
  return story.selectedFieldCode || story.fieldCode || "";
}

function getFieldTitleZh(data, story) {
  if (Array.isArray(story.fieldTitlesZh) && story.fieldTitlesZh[0]) return cleanText(story.fieldTitlesZh[0]);
  const fieldCode = getFieldCode(story);
  const field = findField(data, fieldCode);
  if (field?.titleZh) return cleanText(field.titleZh);
  const category = findCategory(data, story.categoryCode);
  const group = findGroup(category, story.groupCode);
  return cleanText(story.groupTitleZh || category?.chineseTitle || findFieldTitleInCategory(group, fieldCode) || field?.title || "");
}

function getModeHint(story, sourceCollection) {
  if (sourceCollection === "conceptFables") return "concept_fable";
  if (sourceCollection === "historicalStories") return "historical_discovery_story";
  if (sourceCollection === "stories") return "lens_story";

  const sourceText = [story.sceneZh, story.supportZh, story.storyBodyZh].filter(Boolean).join("\n");
  if (/\b(1[5-9]\d{2}|20\d{2})\b|公元|世纪|年|William|John|Mary|Jane|Florence|Benjamin|Cicely|Clara|Aby|Henry|Ed |Janusz/.test(sourceText)) {
    return "historical_discovery_story";
  }
  return "lens_story";
}

function buildKnownFacts(story, sourceCollection) {
  const parts = [];
  if (story.supportZh) parts.push(`已有事实支持：${cleanText(story.supportZh)}`);
  if (story.conceptNameZh) parts.push(`概念名：${cleanText(story.conceptNameZh)}`);
  if (story.explanationZh) parts.push(`概念解释：${cleanText(story.explanationZh)}`);
  if (story.insightZh) parts.push(`现有洞见：${cleanText(story.insightZh)}`);
  if (Array.isArray(story.tagsZh) && story.tagsZh.length) parts.push(`现有标签：${story.tagsZh.map(cleanText).filter(Boolean).join("、")}`);
  parts.push(`来源集合：${sourceCollection}`);
  return parts.join("\n");
}

function buildUncertainInfo(sourceCollection) {
  if (sourceCollection === "conceptFables") {
    return "寓言可虚构场景，但不得虚构真实人物、真实机构、真实历史事件或精确来源。若要引用学者或理论来源，请只使用输入中已给出的概念名。";
  }
  return "未附外部来源全文；不得新增精确日期、地点、人物对话、私人心理、因果断言或历史首次性。若现有事实不足，请在 sourceWarnings 标出 NEEDS_SOURCE_CHECK。";
}

function toGptInputItem(data, story, sourceCollection) {
  const category = findCategory(data, story.categoryCode);
  const group = findGroup(category, story.groupCode);
  const fieldCode = getFieldCode(story);
  return {
    id: story.id,
    sourceCollection,
    sourceLocator: {
      file: "script.js",
      collection: sourceCollection,
      id: story.id,
    },
    categoryCode: story.categoryCode || "",
    categoryTitleZh: cleanText(category?.chineseTitle || ""),
    groupCode: story.groupCode || "",
    groupTitleZh: cleanText(story.groupTitleZh || group?.title || ""),
    fieldCode,
    fieldTitleZh: getFieldTitleZh(data, story),
    currentTitleZh: cleanText(story.titleZh),
    currentSummaryZh: cleanText(story.summaryZh),
    currentSceneZh: cleanText(story.sceneZh),
    currentStoryBodyZh: cleanText(story.storyBodyZh),
    currentKnowledgePointZh: cleanText(story.knowledgePointZh || story.explanationZh || story.insightZh),
    currentReflectionQuestionZh: cleanText(story.reflectionQuestionZh || story.miniQuestionZh),
    currentMetaphorMapZh: normalizeMetaphorMap(story.metaphorMapZh),
    knownFacts: buildKnownFacts(story, sourceCollection),
    uncertainInfo: buildUncertainInfo(sourceCollection),
    preferredMode: getModeHint(story, sourceCollection),
  };
}

function buildItems(data) {
  const collections = [
    ["lensStories", data.lensStories],
    ["conceptFables", data.conceptFables],
    ["stories", data.stories],
    ["historicalStories", data.historicalStories],
  ];

  return collections.flatMap(([sourceCollection, stories]) =>
    stories.map((story) => toGptInputItem(data, story, sourceCollection))
  );
}

function chunk(items, size) {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}

function promptTemplate() {
  return `# MapKAI GPT 故事正文生成主提示词

你是 MapKAI 的知识故事写作模型。你的任务不是写普通科普文，而是根据输入 JSON 生成可被 Codex 导入网站的 MapKAI 故事正文包。

只输出 JSON。不要输出解释、寒暄、Markdown、PDC 会议记录或排版建议。

## 必须内部完成

1. 知识类型路由。
2. 初稿。
3. 第 1 轮 PDC review。
4. 第 1 轮 modify。
5. 第 2 轮 PDC review。
6. 第 2 轮 modify。
7. 第 3 轮 PDC review。
8. 第 3 轮 modify。
9. 最终清理。

最终输出里不要写详细 PDC 过程，只保留正文和必要结构。

## 输出模式

你会收到一个对象：

\`\`\`json
{
  "batchId": "batch-001",
  "items": []
}
\`\`\`

请返回：

\`\`\`json
{
  "batchId": "batch-001",
  "items": [
    {
      "id": "",
      "mode": "",
      "titleZh": "",
      "summaryZh": "",
      "sceneZh": "",
      "storyBodyZh": "",
      "knowledgePointZh": "",
      "reflectionQuestionZh": "",
      "metaphorMapZh": [
        {
          "storyElement": "",
          "knowledgeElement": ""
        }
      ],
      "sourceWarnings": [],
      "qualityGate": {
        "pdcReviewRounds": 3,
        "modifyRounds": 3,
        "status": "APPROVED | NEEDS_SOURCE_CHECK | NEEDS_LOCAL_EDIT | NEEDS_FULL_REWRITE",
        "remainingRisk": ""
      }
    }
  ]
}
\`\`\`

必须保持每个 item 的 id 不变。不要新增、删除或改写 id。

## mode 选择

- historical_discovery_story：真实人物、发现、发明、改革、历史事件。必须有时间/地点/人物动作/工具或记录/旧问题/证据压力/新问题。不要写成传记。
- concept_fable：抽象概念、管理学、心理学、教育学、社会学、哲学、组织理论。必须是严肃寓言。概念名不要太早出现。
- mechanism_explainer：数学、统计、算法、经济学、金融、计算机、公式型概念。必须解释机制，必要时给最小公式和小例子。
- lens_story：一种看问题的镜头。结构是日常场景 -> 普通理解 -> 镜头转变 -> 隐藏结构出现 -> 回到场景提出更好的问题。
- case_pattern_story：商业、组织、技术、社会里的重复模式。必须有具体组织处境、旧解释失效、模式逻辑、实际启发。
- misconception_correction_story：纠正常见误解。结构是常见相信 -> 它为什么看起来对 -> 反例或矛盾 -> 修正 -> 更好的心智模型。
- subject_origin：学科起源/领域起源页。

preferredMode 是提示，不是绝对命令；如果它明显不适合，请选择更合适的 mode，并在 sourceWarnings 里说明。

## 正文要求

- storyBodyZh 必须是最终正文，不要写 review 意见。
- 中文故事正文通常 700-1100 字，除非现有文章明显是短卡片。
- 用 4-7 个短段落，段落之间用 \\n\\n。
- 历史故事必须谨慎，不确定的事实不要写成确定。
- 寓言故事必须严肃、有具体场景、有重复摩擦，不能像儿童故事。
- 机制故事必须可检查，不能只讲漂亮比喻。
- 不要写百科，不要鸡汤，不要 AI 总结句。
- 不要编造史实、人物对话、精确日期、私人情绪、现场细节。

## 禁用句式

不要使用这些句式或近似句式：

- 旧办法并不荒唐
- 这个办法并不荒唐
- 这种做法并非没有道理
- 真正留下来的，是
- 普通场景慢慢变成了知识的入口
- 后来人看见的是领域名称
- 通过这个故事我们知道
- 这说明
- 证据开始发言
- 让证据自己排队
- 现场细节开始获得发言权
- 在这里显出……
- 在这里获得……
- 在这里学会……
`;
}

function readmeText(total, batchCount, batchSize) {
  return `# MapKAI GPT Story Generation Inputs

这组文件是从现有网站内容自动导出的 GPT 输入包，用来让 GPT 负责正文生成，Codex 负责校验、导入、排版和 push。

- 总条目数：${total}
- batch 数：${batchCount}
- 每批最多：${batchSize}

## 使用方式

1. 打开 \`mapkai-gpt-story-master-prompt.zh.md\`，把整段主提示词复制给 GPT。
2. 再复制一个 \`batch-XXX.json\` 的完整内容给 GPT。
3. 让 GPT 只返回 JSON。
4. 把 GPT 返回的 JSON 发回 Codex。
5. Codex 会校验字段、扫描禁用句式、写入网站文件、验证并按你的要求 push。

## 文件说明

- \`manifest.json\`：导出总览和每个 batch 的条目数量。
- \`batch-001.json\` 等：真实故事输入，每条包含 id、原正文、知识点、事实材料、mode hint。

注意：这些输入不等于外部来源核查。历史类故事如果需要公开发布级别的事实安全，GPT 应该在 \`sourceWarnings\` 中保留 source check 风险，而不是硬编。
`;
}

function writeExport(data, items, batchSize) {
  fs.mkdirSync(outputDir, { recursive: true });
  const batches = chunk(items, batchSize);
  const manifest = {
    generatedAt: "2026-06-22",
    appVersion: data.appVersion,
    sourceFile: "script.js",
    totalItems: items.length,
    batchSize,
    batches: batches.map((batchItems, index) => ({
      batchId: `batch-${String(index + 1).padStart(3, "0")}`,
      file: `batch-${String(index + 1).padStart(3, "0")}.json`,
      count: batchItems.length,
      firstId: batchItems[0]?.id || "",
      lastId: batchItems.at(-1)?.id || "",
    })),
    sourceCollections: {
      lensStories: data.lensStories.length,
      conceptFables: data.conceptFables.length,
      stories: data.stories.length,
      historicalStories: data.historicalStories.length,
    },
  };

  fs.writeFileSync(path.join(outputDir, "mapkai-gpt-story-master-prompt.zh.md"), promptTemplate());
  fs.writeFileSync(path.join(outputDir, "README.zh.md"), readmeText(items.length, batches.length, batchSize));
  fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

  batches.forEach((batchItems, index) => {
    const batchId = `batch-${String(index + 1).padStart(3, "0")}`;
    const payload = {
      batchId,
      instruction: "把本 batch 的每个 item 改写成 MapKAI 可导入正文包。只返回 JSON，保持 id 不变。",
      items: batchItems,
    };
    fs.writeFileSync(path.join(outputDir, `${batchId}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  });

  return manifest;
}

const batchSizeArg = Number.parseInt(process.argv[2] || "", 10);
const batchSize = Number.isFinite(batchSizeArg) && batchSizeArg > 0 ? batchSizeArg : defaultBatchSize;
const data = loadSiteData();
const items = buildItems(data);
const manifest = writeExport(data, items, batchSize);

console.log(JSON.stringify({
  outputDir,
  totalItems: manifest.totalItems,
  batchSize: manifest.batchSize,
  batchCount: manifest.batches.length,
  sourceCollections: manifest.sourceCollections,
}, null, 2));
