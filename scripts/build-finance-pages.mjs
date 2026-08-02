import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

await import("../content/management-column.js");
await import("../content/management-lesson-stories.js");
await import("../content/management-lesson-references.js");

const root = resolve(new URL("..", import.meta.url).pathname);
const outRoot = resolve(root, "public");
const course = globalThis.MAPKAI_MANAGEMENT_COLUMN;
const stories = globalThis.MAPKAI_MANAGEMENT_STORIES || {};
const references = globalThis.MAPKAI_MANAGEMENT_REFERENCES || {};
const site = "https://www.mapkai.com";
const ogImage = `${site}/assets/finance-course-og.png`;

const copy = {
  en: {
    locale: "en", prefix: "", languageName: "English", alternateName: "中文", themeLight: "Light", themeDark: "Dark",
    nav: ["Home", "Explore", "Knowledge Map", "Learning", "PDC", "About"],
    original: "MapKAI Original Learning Path", courseTitle: "Corporate Finance Essentials",
    subtitle: "Learn how value, cash, risk, governance, and performance come together in real company decisions.",
    description: "This five-day course explains corporate finance through business situations, stories, decision questions, and practical frameworks. It is designed for learners who need financial understanding, not financial jargon.",
    metadata: ["5 days", "20–30 minutes per day", "Beginner friendly", "Free", "English and Chinese"],
    start: "Start Day 1", continue: "Continue Learning", who: "Who this course is for",
    audiences: ["Non-finance managers", "Engineers and technical leaders", "Project and product managers", "Founders and business owners", "Professionals preparing for broader leadership roles"],
    noBackground: "No accounting or finance background is required.", abilitiesTitle: "By the end of the course, you will be able to",
    abilities: ["Explain why profit and cash are not the same.", "Identify the relevant cash flows behind an investment.", "Assess how risk affects value and financing decisions.", "Recognize the role of accounting, governance, and control.", "Connect financial decisions with strategy and operations.", "Ask more useful questions before approving a proposal."],
    outline: "Five-day course outline", howTitle: "How you will learn",
    how: ["Begin with a business situation", "Reveal the financial logic", "Connect the idea to a practical framework", "Apply it through reflection and decision questions"],
    method: "The course focuses on interpretation and decision-making rather than formula memorisation.",
    whyTitle: "Why this course was created", whyCopy: "Corporate finance is often taught as a collection of formulas. In practice, managers need to understand how financial ideas connect with strategy, operations, risk, governance, and human judgment. This learning path was created to make those connections easier to see.",
    creator: "Created by the MapKAI editorial team for professionals who need practical financial judgment across functions.",
    reviewed: "Last reviewed: August 2026", references: "View course references", referencesTitle: "Course references",
    finalTitle: "Start with one business question", finalCopy: "You do not need to master finance in one day. Begin by learning how value is created and how investment choices should be examined.",
    privacy: "Your learning progress and reflection drafts are stored only on this device. No account is required.",
    completed: (n) => `${n} of 5 days completed`, startDay: (n) => `Start Day ${n}`, continueDay: (n) => `Continue Day ${n}`,
    dayOf: (n) => `Day ${n} of 5`, estimated: "Estimated time: 25 minutes", today: "Today you will learn to", startLesson: "Start Lesson",
    overview: "Course Overview", previous: "Previous Day", next: "Next Day", completeCourse: "Complete the Course",
    opening: "Opening story or business situation", problem: "The decision problem", concepts: "Core concepts", framework: "Visual framework", example: "Practical example", mistake: "Common misunderstanding", reflection: "Reflection questions", takeaways: "Key takeaways", check: "Knowledge check", nextLesson: "Next lesson",
    decisionQuestion: "Decision question", commonMistake: "Common mistake", whyMatters: "Why it matters", businessExample: "Business example", yourReflection: "Write your reflection", savedLocal: "Saved on this device",
    markComplete: "Mark as complete", dayComplete: (n) => `Day ${n} completed. Your progress is saved on this device.`, back: "Back to course overview",
    read: "Read the lesson", watch: "Watch the lesson", listen: "Listen to the podcast", subtitles: "Subtitles available where provided", referenceNotes: "Reference notes",
    completionTitle: "You completed Corporate Finance Essentials", completionCopy: "You have explored how value, cash, risk, governance, control, and strategic judgment come together in company decisions.",
    reviewMap: "Review Your Learning Map", usePdc: "Use PDC for a Business Decision", completedItems: ["Value and capital allocation", "Financing and risk", "Accounting and governance", "Performance and control", "Integrated decision-making"],
    footer: "Discover how you think. Learn across fields. Make better decisions.", lowData: "Free · No account · Low-data by design",
  },
  zh: {
    locale: "zh-CN", prefix: "/zh", languageName: "中文", alternateName: "English", themeLight: "浅色", themeDark: "深色",
    nav: ["首页", "探索", "知识地图", "学习路径", "PDC", "关于"],
    original: "MapKAI 原创学习路径", courseTitle: "公司金融核心课程",
    subtitle: "理解价值、现金、风险、治理与绩效如何汇入真实的公司决定。",
    description: "这门五天课程通过商业情境、故事、决策问题和实用框架解释公司金融。它面向需要金融理解、而不是金融术语的学习者。",
    metadata: ["5天", "每天20–30分钟", "适合初学者", "免费", "中英文"],
    start: "开始第一天", continue: "继续学习", who: "这门课程适合谁",
    audiences: ["非金融背景的管理者", "工程师与技术负责人", "项目与产品经理", "创业者与经营者", "准备承担更广泛领导职责的专业人士"],
    noBackground: "无需会计或金融背景。", abilitiesTitle: "完成课程后，你将能够",
    abilities: ["解释利润与现金为什么不同。", "识别投资决定中真正相关的现金流。", "评估风险如何影响价值与融资决定。", "识别会计、治理和控制的作用。", "把金融决定与战略及运营连接起来。", "在批准提案前提出更有用的问题。"],
    outline: "五天课程大纲", howTitle: "你将如何学习",
    how: ["从一个商业情境开始", "揭示背后的金融逻辑", "把概念连接到实用框架", "通过反思与决策问题应用"],
    method: "课程强调解释与决策，而不是记忆公式。",
    whyTitle: "为什么创建这门课程", whyCopy: "公司金融常被讲成一组公式。真实管理工作中，人们需要看见金融概念如何与战略、运营、风险、治理和人的判断连接。这条学习路径就是为了让这些联系更容易被看见。",
    creator: "由 MapKAI 编辑团队为需要跨职能金融判断的专业人士开发。",
    reviewed: "最近复核：2026年8月", references: "查看课程参考资料", referencesTitle: "课程参考资料",
    finalTitle: "从一个商业问题开始", finalCopy: "你不需要在一天内掌握金融。先从价值如何创造，以及投资选择应如何被审视开始。",
    privacy: "学习进度和反思草稿仅保存在当前设备，无需注册账户。",
    completed: (n) => `已完成 ${n}/5 天`, startDay: (n) => `开始第 ${n} 天`, continueDay: (n) => `继续第 ${n} 天`,
    dayOf: (n) => `第 ${n} 天，共 5 天`, estimated: "预计学习时间：25分钟", today: "今天你将学会", startLesson: "开始本课",
    overview: "课程总览", previous: "上一天", next: "下一天", completeCourse: "完成课程",
    opening: "开场故事或商业情境", problem: "决策问题", concepts: "核心概念", framework: "视觉框架", example: "实用案例", mistake: "常见误解", reflection: "反思问题", takeaways: "关键要点", check: "知识检查", nextLesson: "下一课",
    decisionQuestion: "决策问题", commonMistake: "常见错误", whyMatters: "为什么重要", businessExample: "商业例子", yourReflection: "写下你的反思", savedLocal: "已保存在当前设备",
    markComplete: "标记为完成", dayComplete: (n) => `第 ${n} 天已完成，进度已保存在当前设备。`, back: "返回课程总览",
    read: "阅读课程", watch: "观看课程", listen: "收听播客", subtitles: "如素材提供，可使用字幕", referenceNotes: "参考资料说明",
    completionTitle: "你已完成公司金融核心课程", completionCopy: "你已经探索了价值、现金、风险、治理、控制和战略判断如何汇入公司决定。",
    reviewMap: "回顾我的知识地图", usePdc: "用 PDC 分析一个商业决定", completedItems: ["价值与资本配置", "融资与风险", "会计与治理", "绩效与控制", "综合决策"],
    footer: "发现你的思考方式，建立跨领域知识，做出更清晰的决定。", lowData: "免费 · 无需账户 · 低数据设计",
  },
};

const dayDetails = [
  {
    question: { en: "How can a company know whether an investment will create value?", zh: "公司如何判断一项投资是否真正创造价值？" },
    topics: { en: ["Cash flow", "NPV", "Cost of capital", "Real options"], zh: ["现金流", "净现值", "资本成本", "实物期权"] },
    outcomes: { en: ["identify relevant cash flows", "understand the logic of NPV", "distinguish value creation from accounting profit", "recognize the value of keeping future options open"], zh: ["识别相关现金流", "理解净现值的逻辑", "区分价值创造与会计利润", "认识保留未来选择权的价值"] },
    mistake: { en: "Using total company revenue instead of incremental project cash flow.", zh: "用公司总收入代替项目带来的增量现金流。" },
    reflections: { en: ["Which cash flows would change only if the company accepts this project?", "Which assumption would most quickly change your recommendation?"], zh: ["哪些现金流只会在公司接受项目后发生变化？", "哪一个假设最可能迅速改变你的建议？"] },
  },
  {
    question: { en: "How should a company finance and protect its future?", zh: "公司应该如何融资并保护未来？" },
    topics: { en: ["Financing", "Liquidity", "Risk", "Hedging"], zh: ["融资", "流动性", "风险", "对冲"] },
    outcomes: { en: ["compare debt and equity constraints", "identify liquidity pressure before it becomes a crisis", "separate protection from speculation", "connect trust with continued access to capital"], zh: ["比较债务与股权的约束", "在危机前识别流动性压力", "区分保护与投机", "把信任与持续融资能力连接起来"] },
    mistake: { en: "Treating a clean checklist as proof that controls and commitments work in practice.", zh: "把一张全是勾的检查表当作控制和承诺真正有效的证据。" },
    reflections: { en: ["Which promise gives your organisation its licence to operate?", "What evidence shows that this promise is kept when pressure rises?"], zh: ["哪一项承诺构成了组织持续经营的资格？", "压力上升时，什么证据能说明这项承诺仍被兑现？"] },
  },
  {
    question: { en: "What do the numbers reveal, and what might they hide?", zh: "数字揭示了什么，又可能隐藏什么？" },
    topics: { en: ["Accounting", "Working capital", "Risk management", "Governance"], zh: ["会计", "营运资本", "风险管理", "治理"] },
    outcomes: { en: ["read profit alongside cash and operating facts", "turn risk indicators into action thresholds", "assign decision rights before pressure peaks", "connect governance with usable evidence"], zh: ["把利润与现金及经营事实一起阅读", "把风险指标转成行动阈值", "在压力高峰前分配决策权", "把治理与可用证据连接起来"] },
    mistake: { en: "Reporting a red risk without naming who can act and what happens next.", zh: "报告一个红色风险，却没有说明谁能行动以及下一步是什么。" },
    reflections: { en: ["Which operating fact is missing from your most important report?", "Who has the authority to stop or change the process?"], zh: ["最重要的报告中缺少哪一个经营事实？", "谁有权叫停或改变流程？"] },
  },
  {
    question: { en: "How do measures and controls shape business behaviour?", zh: "指标和控制如何塑造商业行为？" },
    topics: { en: ["Performance measurement", "Management control", "Incentives"], zh: ["绩效衡量", "管理控制", "激励"] },
    outcomes: { en: ["see how measures redirect attention", "distinguish learning metrics from outcome metrics", "recognize gaming and double counting", "use controls to support strategy rather than replace judgment"], zh: ["看见指标如何改变注意力", "区分学习指标与结果指标", "识别博弈和重复计量", "让控制支持战略而不是替代判断"] },
    mistake: { en: "Optimising the metric while quietly damaging the purpose it was meant to serve.", zh: "优化了指标，却悄悄损害了指标原本要服务的目标。" },
    reflections: { en: ["What behaviour does your current KPI reward?", "Which early learning signal matters before financial results arrive?"], zh: ["当前 KPI 实际奖励了什么行为？", "财务结果出现前，哪一个早期学习信号最重要？"] },
  },
  {
    question: { en: "How should leaders combine value, risk, strategy, and judgment?", zh: "领导者应如何综合价值、风险、战略与判断？" },
    topics: { en: ["Integration", "Leadership judgment", "Decision presentation"], zh: ["整合", "领导判断", "决策呈现"] },
    outcomes: { en: ["compare evidence on a fair basis", "state the limits of a benchmark", "present a recommendation that can be challenged", "name the evidence that would change the decision"], zh: ["在公平基础上比较证据", "说明基准的边界", "提出可被质疑的建议", "指出什么证据会改变决定"] },
    mistake: { en: "Presenting the highest number as the best choice without checking risk, fees, context, or suitability.", zh: "把最高数字直接当成最佳选择，却不检查风险、费用、语境和适用性。" },
    reflections: { en: ["Are the options being compared on the same basis?", "What evidence would make you reverse your recommendation?"], zh: ["这些选项是否在同一基础上比较？", "什么证据会让你推翻当前建议？"] },
  },
];

const routes = ["/", "/explore", "/map", "/learning/corporate-finance", "/pdc", "/about"];

function esc(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

function rich(value = "") {
  return esc(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function localized(item, key, lang) {
  return lang === "en" ? item?.[`${key}En`] || item?.[key] || "" : item?.[key] || item?.[`${key}En`] || "";
}

function paragraphs(value = "") {
  return String(value).trim().split(/\n\s*\n/).filter(Boolean).map((p) => `<p>${rich(p)}</p>`).join("");
}

function pathFor(lang, suffix = "") {
  return `${copy[lang].prefix}/learning/corporate-finance${suffix}` || "/learning/corporate-finance";
}

function layout({ lang, title, description, canonicalPath, body, structuredData, robots = "index, follow" }) {
  const c = copy[lang];
  const alternateLang = lang === "en" ? "zh" : "en";
  const alternatePath = canonicalPath.replace(/^\/zh/, "");
  const enPath = lang === "en" ? canonicalPath : alternatePath;
  const zhPath = lang === "zh" ? canonicalPath : `/zh${canonicalPath}`;
  const navLinks = routes.map((route, index) => {
    const href = route === "/learning/corporate-finance" ? pathFor(lang) : route;
    const active = index === 3 ? " is-current" : "";
    return `<a class="${active.trim()}" href="${href}">${esc(c.nav[index])}</a>`;
  }).join("");
  return `<!doctype html>
<html lang="${c.locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="${robots}" />
  <link rel="canonical" href="${site}${canonicalPath}" />
  <link rel="alternate" hreflang="en" href="${site}${enPath}" />
  <link rel="alternate" hreflang="zh-Hans" href="${site}${zhPath}" />
  <link rel="alternate" hreflang="x-default" href="${site}${enPath}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="MapKAI" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${site}${canonicalPath}" />
  <meta property="og:image" content="${ogImage}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <script type="application/ld+json">${JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script>
  <link rel="icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="finance-static-page" data-language="${lang}">
  <header class="topbar finance-topbar">
    <a class="brand" href="/"><img class="brand-mark" src="/mapkai-logo-transparent.png" alt="MapKAI" /></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="finance-nav" aria-label="Menu"><span></span><span></span><span></span></button>
    <div class="nav-panel" id="finance-nav">
      <nav class="nav-links" aria-label="Site">${navLinks}</nav>
      <div class="nav-preferences">
        <a class="finance-language-link" href="${alternateLang === "zh" ? zhPath : enPath}">${esc(c.alternateName)}</a>
        <div class="theme-switch" aria-label="Theme"><button type="button" data-theme-option="light">${esc(c.themeLight)}</button><span>|</span><button type="button" data-theme-option="dark">${esc(c.themeDark)}</button></div>
      </div>
    </div>
  </header>
  ${body}
  <footer class="site-footer finance-footer"><p class="footer-product-promise">${esc(c.footer)}</p><p>${esc(c.lowData)}</p><nav class="footer-links"><a href="/privacy">Privacy</a><a href="/responsible-use">Responsible Use</a><a href="/terms">Terms</a></nav></footer>
  <div class="finance-toast" role="status" aria-live="polite" hidden></div>
  <script src="/finance-course.js"></script>
</body>
</html>`;
}

function courseSchema(lang, canonicalPath) {
  const c = copy[lang];
  return {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Course", name: c.courseTitle, description: c.description, url: `${site}${canonicalPath}`, provider: { "@type": "Organization", name: "MapKAI", sameAs: site }, isAccessibleForFree: true, inLanguage: c.locale, timeRequired: "P5D", educationalLevel: "Beginner" },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: c.nav[0], item: `${site}/` }, { "@type": "ListItem", position: 2, name: c.nav[3], item: `${site}${pathFor(lang)}` }] },
    ],
  };
}

function renderOverview(lang) {
  const c = copy[lang];
  const canonicalPath = pathFor(lang);
  const cards = course.learningModules.map((module, index) => {
    const d = dayDetails[index];
    return `<article class="finance-outline-card" data-course-day-card="${index + 1}">
      <div><span>Day ${index + 1}</span><span data-day-status>${esc(c.startDay(index + 1))}</span></div>
      <h3>${esc(localized(module, "title", lang))}</h3>
      <p class="finance-outline-question">${esc(d.question[lang])}</p>
      <p>${d.topics[lang].map(esc).join(" · ")}</p>
      <small>25 ${lang === "en" ? "minutes" : "分钟"}</small>
      <a class="button secondary" href="${pathFor(lang, `/day-${index + 1}`)}">${esc(c.startDay(index + 1))}</a>
    </article>`;
  }).join("");
  const refs = course.learningModules.flatMap((module) => localized(references[module.id] || {}, "references", lang)).slice(0, 8);
  const body = `<main class="finance-course-main" data-course-overview>
    <section class="finance-course-hero">
      <p class="eyebrow">${esc(c.original)}</p><h1>${esc(c.courseTitle)}</h1><p class="finance-course-subtitle">${esc(c.subtitle)}</p><p>${esc(c.description)}</p>
      <div class="finance-meta-row">${c.metadata.map((item) => `<span>${esc(item)}</span>`).join("")}</div>
      <div class="hero-actions"><a class="button primary" href="${pathFor(lang, "/day-1")}" data-course-start>${esc(c.start)}</a><a class="button secondary" href="#course-outline" data-course-continue hidden>${esc(c.continue)}</a></div>
      <p class="finance-privacy-note">${esc(c.privacy)}</p><p class="finance-progress-copy" data-course-progress>${esc(c.completed(0))}</p>
    </section>
    <section class="finance-course-section"><h2>${esc(c.who)}</h2><div class="finance-audience-grid">${c.audiences.map((item) => `<article>${esc(item)}</article>`).join("")}</div><p class="finance-emphasis">${esc(c.noBackground)}</p></section>
    <section class="finance-course-section"><h2>${esc(c.abilitiesTitle)}</h2><ul class="finance-check-list">${c.abilities.map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
    <section class="finance-course-section" id="course-outline"><h2>${esc(c.outline)}</h2><div class="finance-outline-grid">${cards}</div></section>
    <section class="finance-course-section"><h2>${esc(c.howTitle)}</h2><ol class="finance-method-grid">${c.how.map((item, i) => `<li><span>0${i + 1}</span><strong>${esc(item)}</strong></li>`).join("")}</ol><p>${esc(c.method)}</p></section>
    <section class="finance-course-section finance-creator"><h2>${esc(c.whyTitle)}</h2><p>${esc(c.whyCopy)}</p><p>${esc(c.creator)}</p><p><strong>${esc(c.reviewed)}</strong></p><a href="#course-references">${esc(c.references)}</a></section>
    <section class="finance-course-section" id="course-references"><h2>${esc(c.referencesTitle)}</h2><ol class="finance-reference-list">${refs.map((ref) => `<li><strong>${esc(ref.citation)}</strong>${ref.detail ? `<p>${esc(ref.detail)}</p>` : ""}</li>`).join("")}</ol></section>
    <section class="finance-course-final"><h2>${esc(c.finalTitle)}</h2><p>${esc(c.finalCopy)}</p><a class="button primary" href="${pathFor(lang, "/day-1")}">${esc(c.start)} — ${esc(localized(course.learningModules[0], "title", lang))}</a></section>
  </main>`;
  return layout({ lang, title: lang === "en" ? "Corporate Finance Essentials | Free 5-Day Course | MapKAI" : "公司金融核心课程｜免费五天课程｜MapKAI", description: lang === "en" ? "Learn how companies create value, manage cash, evaluate risk, and make financial decisions in this free five-day course for non-finance professionals." : "面向非金融专业人士的免费五天课程，学习企业如何创造价值、管理现金、评估风险并做出金融决定。", canonicalPath, body, structuredData: courseSchema(lang, canonicalPath) });
}

function renderDay(lang, dayIndex) {
  const c = copy[lang];
  const n = dayIndex + 1;
  const module = course.learningModules[dayIndex];
  const story = { ...module, ...(stories[module.id] || {}), ...(references[module.id] || {}) };
  const d = dayDetails[dayIndex];
  const canonicalPath = pathFor(lang, `/day-${n}`);
  const title = localized(module, "title", lang);
  const storyContent = localized(story, "storyContent", lang);
  const judgment = localized(story, "todayJudgement", lang);
  const knowledge = localized(story, "knowledgeChainContent", lang);
  const refs = localized(story, "references", lang);
  const concepts = d.topics[lang].map((topic, i) => `<article class="finance-concept-card"><span>${esc(topic)}</span><p>${esc(d.outcomes[lang][i] || d.outcomes[lang][0])}</p><strong>${esc(c.whyMatters)}</strong><p>${esc(d.reflections[lang][i % d.reflections[lang].length])}</p></article>`).join("");
  const videoMarkup = (module.videos || []).map((video) => `<article><span>${esc(localized(video, "language", lang))}</span><h3>${esc(localized(video, "title", lang))}</h3><video controls preload="metadata" src="${esc(video.url)}"></video></article>`).join("");
  const nextHref = n === 5 ? pathFor(lang, "/completed") : pathFor(lang, `/day-${n + 1}`);
  const prevHref = n === 1 ? "" : pathFor(lang, `/day-${n - 1}`);
  const breadcrumb = { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: c.nav[0], item: `${site}/` }, { "@type": "ListItem", position: 2, name: c.courseTitle, item: `${site}${pathFor(lang)}` }, { "@type": "ListItem", position: 3, name: title, item: `${site}${canonicalPath}` }] };
  const schema = { "@context": "https://schema.org", "@graph": [{ "@type": "CourseInstance", name: `${c.courseTitle} - Day ${n}: ${title}`, courseMode: "online", isAccessibleForFree: true, inLanguage: c.locale, url: `${site}${canonicalPath}` }, breadcrumb] };
  const body = `<main class="finance-day-main" data-course-day="${n}">
    <nav class="finance-course-nav" aria-label="Course navigation"><a href="${pathFor(lang)}">${esc(c.courseTitle)}</a><span>${esc(c.dayOf(n))}</span><div class="finance-progress-track" aria-label="${n * 20}%"><i style="width:${n * 20}%"></i></div><div class="finance-course-nav-actions"><a href="${pathFor(lang)}">${esc(c.overview)}</a>${prevHref ? `<a href="${prevHref}">${esc(c.previous)}</a>` : ""}<a href="${nextHref}">${esc(n === 5 ? c.completeCourse : c.next)}</a></div></nav>
    <header class="finance-day-hero"><p class="eyebrow">${esc(c.dayOf(n))}</p><h1>${esc(title)}</h1><p class="finance-day-question">${esc(d.question[lang])}</p><p>${esc(c.estimated)}</p><div><strong>${esc(c.today)}</strong><ul>${d.outcomes[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ul></div><a class="button primary" href="#lesson-content" data-start-lesson>${esc(c.startLesson)}</a></header>
    <section class="finance-content-modes" aria-label="Content formats"><button class="is-active" type="button" data-content-mode="read">${esc(c.read)}</button><button type="button" data-content-mode="watch">${esc(c.watch)}</button><button type="button" data-content-mode="listen">${esc(c.listen)}</button></section>
    <section class="finance-media-panel" data-mode-panel="watch" hidden><p>${esc(c.subtitles)}</p><div class="finance-video-grid">${videoMarkup || `<p>${esc(c.watch)} — coming soon</p>`}</div></section>
    <section class="finance-media-panel" data-mode-panel="listen" hidden><h2>${esc(localized(module, "audioTitle", lang) || c.listen)}</h2>${localized(module, "audioUrl", lang) ? `<audio controls preload="metadata" src="${esc(localized(module, "audioUrl", lang))}"></audio>` : `<p>${esc(c.listen)} — coming soon</p>`}</section>
    <article class="finance-lesson-reader" id="lesson-content" data-mode-panel="read">
      <section><p class="finance-section-number">01</p><h2>${esc(c.opening)}</h2><div class="finance-story-content">${paragraphs(storyContent)}</div></section>
      <section><p class="finance-section-number">02</p><h2>${esc(c.problem)}</h2><aside class="finance-decision-question"><span>${esc(c.decisionQuestion)}</span><strong>${esc(d.question[lang])}</strong><p>${esc(judgment)}</p></aside></section>
      <section><p class="finance-section-number">03</p><h2>${esc(c.concepts)}</h2><div class="finance-concept-grid">${concepts}</div></section>
      <section><p class="finance-section-number">04</p><h2>${esc(c.framework)}</h2><div class="finance-framework">${c.how.map((item, i) => `<div><span>0${i + 1}</span><strong>${esc(item)}</strong></div>`).join("")}</div><div class="finance-knowledge-chain">${paragraphs(knowledge)}</div></section>
      <section><p class="finance-section-number">05</p><h2>${esc(c.example)}</h2><div class="finance-practical-example"><strong>${esc(c.businessExample)}</strong><p>${esc(localized(module, "soloCompanyUse", lang))}</p></div></section>
      <section><p class="finance-section-number">06</p><h2>${esc(c.mistake)}</h2><aside class="finance-common-mistake"><span>${esc(c.commonMistake)}</span><strong>${esc(d.mistake[lang])}</strong></aside></section>
      <section><p class="finance-section-number">07</p><h2>${esc(c.reflection)}</h2>${d.reflections[lang].map((question, i) => `<label class="finance-reflection-box"><strong>${esc(question)}</strong><textarea rows="5" data-reflection-id="day-${n}-${i + 1}" placeholder="${esc(c.yourReflection)}"></textarea><span>${esc(c.savedLocal)}</span></label>`).join("")}</section>
      <section><p class="finance-section-number">08</p><h2>${esc(c.takeaways)}</h2><ul class="finance-key-takeaways">${d.outcomes[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ul></section>
      <section><p class="finance-section-number">09</p><h2>${esc(c.check)}</h2><div class="finance-knowledge-check"><p>${esc(d.question[lang])}</p><button type="button" data-check-answer="true">${esc(d.outcomes[lang][0])}</button><button type="button" data-check-answer="false">${esc(d.mistake[lang])}</button><p data-check-result hidden>${lang === "en" ? "Use the decision question to connect evidence with action, not merely to repeat a term." : "用决策问题把证据与行动连接起来，而不是只重复术语。"}</p></div></section>
      <section id="lesson-references"><p class="finance-section-number">10</p><h2>${esc(c.referenceNotes)}</h2><ol class="finance-reference-list">${refs.map((ref) => `<li><strong>${esc(ref.citation)}</strong>${ref.detail ? `<p>${esc(ref.detail)}</p>` : ""}${ref.use ? `<p>${esc(ref.use)}</p>` : ""}</li>`).join("")}</ol></section>
    </article>
    <nav class="finance-day-bottom"><button class="button primary" type="button" data-mark-complete>${esc(c.markComplete)}</button>${prevHref ? `<a class="button secondary" href="${prevHref}">${esc(c.previous)}</a>` : ""}<a class="button secondary" href="${nextHref}">${esc(n === 5 ? c.completeCourse : c.next)}</a><a href="${pathFor(lang)}">${esc(c.back)}</a></nav>
  </main>`;
  const metaDescription = lang === "en" ? `Learn how ${d.topics.en.join(", ")} shape real company decisions in Day ${n} of Corporate Finance Essentials.` : `在公司金融核心课程第 ${n} 天，理解${d.topics.zh.join("、")}如何影响真实公司决定。`;
  return layout({ lang, title: `${title} | Corporate Finance Day ${n} | MapKAI`, description: metaDescription, canonicalPath, body, structuredData: schema });
}

function renderCompleted(lang) {
  const c = copy[lang];
  const canonicalPath = pathFor(lang, "/completed");
  const body = `<main class="finance-completion-main" data-course-completed><section class="finance-completion-card"><p class="eyebrow">MapKAI · ${esc(c.courseTitle)}</p><h1>${esc(c.completionTitle)}</h1><p>${esc(c.completionCopy)}</p><ul>${c.completedItems.map((item) => `<li>${esc(item)}</li>`).join("")}</ul><div class="hero-actions"><a class="button primary" href="/map">${esc(c.reviewMap)}</a><a class="button secondary" href="/pdc" data-course-event="pdc_clicked_after_course">${esc(c.usePdc)}</a></div></section></main>`;
  return layout({ lang, title: `${c.completionTitle} | MapKAI`, description: c.completionCopy, canonicalPath, body, robots: "noindex, follow", structuredData: { "@context": "https://schema.org", "@type": "WebPage", name: c.completionTitle, url: `${site}${canonicalPath}` } });
}

async function writeRoute(route, html) {
  const dir = resolve(outRoot, `.${route}`);
  await mkdir(dir, { recursive: true });
  await writeFile(resolve(dir, "index.html"), html);
}

for (const lang of ["en", "zh"]) {
  await writeRoute(pathFor(lang), renderOverview(lang));
  for (let index = 0; index < 5; index += 1) await writeRoute(pathFor(lang, `/day-${index + 1}`), renderDay(lang, index));
  await writeRoute(pathFor(lang, "/completed"), renderCompleted(lang));
}

console.log("Generated Finance course pages in public/learning and public/zh/learning.");
