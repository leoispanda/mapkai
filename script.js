const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const founderToggle = document.getElementById("founderToggle");
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const contactEmail = "hello@mapkai.com";
const messageBoardKey = "mapkaiMessageBoard";
const visitorIdKey = "mapkaiVisitorId";
const languageKey = "mapkaiLanguage";
const founderModeKey = "mapkaiFounderMode";
const founderModePasscode = "2026leocindy";
const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
const supportedLanguages = ["en", "zh"];
let currentLanguage = supportedLanguages.includes(localStorage.getItem(languageKey)) ? localStorage.getItem(languageKey) : "en";
let lastVisitStats = null;

const readiness = {
  mapOnly: "Map only",
  classified: "Classified",
  pathReady: "Path ready",
  quizReady: "Quiz ready",
  validated: "Validated",
};

const masteryLevels = {
  ocean: { label: "Ocean", mapLabel: "Unknown ocean", color: "#2f86b5" },
  snow: { label: "Snow mountain", mapLabel: "Snow mountain", color: "#e8f6f7" },
  land: { label: "Land", mapLabel: "Land", color: "#d6a947" },
  green: { label: "Green land", mapLabel: "Green land", color: "#7fc76f" },
};

const masteryLabels = {
  en: {
    ocean: "Ocean",
    snow: "Snow mountain",
    land: "Land",
    green: "Green land",
  },
  zh: {
    ocean: "未探索的知识海洋",
    snow: "初步理解的雪山",
    land: "能够解释的陆地",
    green: "更熟练掌握的绿地",
  },
};

const uiText = {
  en: {
    navExplore: "Start Exploring",
    navMap: "Map",
    navPdc: "PDC",
    navCategories: "Categories",
    navLearning: "Learning",
    navAbout: "About",
    homeEyebrow: "",
    homeTitle: "Map your knowledge with AI",
    homeCopy: "As AI generates more answers,\nunderstanding yourself may quietly become more important.",
    homePrimary: "Start Exploring",
    homeQuickMirrorHint: "3 questions · No login · 30 seconds",
    homeQuickMirrorSupport: "Includes a 30-sec Quick Mirror for first-time explorers.",
    homeTrust: "MapKAI is currently a free knowledge initiative. You can explore it without creating an account or providing your name or email.",
    mapStartTrust: "Explore freely. No account, name, or email required. Your quiz progress is not linked to a personal profile.",
    contactTrust: "Contact is optional. Please avoid sharing highly sensitive personal information. If you send us a message, we use it only to respond to you.",
    reflectionSupportNote: "Use this as reflection and learning support, not as professional advice.",
    homeLearning: "View Knowledge Map",
    homeCategories: "Browse Domains",
    reflectionSnippetsTitle: "What exploration begins to reveal",
    reflectionSnippets: [
      "Some questions feel clear before you can explain why.",
      "Some answers reveal\nhow you frame problems.",
      "You begin to notice\nwhich domains you avoid, rush through, or over-control.",
      "Over time, the map becomes\na quieter mirror of your thinking.",
    ],
    coreEyebrow: "Core exploration loop",
    coreTitle: "Explore, answer, reveal, reflect.",
    exploreCardTitle: "Explore - Answer questions",
    exploreCardCopy: "Begin the active exploration loop with pattern-recognition questions.",
    exploreCardLink: "Start exploring",
    mapCardTitle: "Map - See revealed territory",
    mapCardCopy: "Watch your knowledge world light up as exploration progresses.",
    mapCardLink: "Open map",
    categoriesCardTitle: "Categories - Choose domains",
    categoriesCardCopy: "Scan exploration domains, then continue into the question flow.",
    categoriesCardLink: "Browse categories",
    learningCardTitle: "Learning - Follow a guided path",
    learningCardCopy: "Turn revealed patterns into next steps for learning.",
    learningCardLink: "View paths",
    howEyebrow: "How it works",
    howTitle: "How MapKAI works",
    howOneTitle: "Answer questions",
    howOneCopy: "Start with real-world situations, tradeoffs, and knowledge patterns.",
    howTwoTitle: "Reveal patterns",
    howTwoCopy: "Your answers light up regions of the knowledge map over time.",
    howThreeTitle: "Unlock reflection",
    howThreeCopy: "After enough exploration, generate a calm knowledge reflection.",
    audienceEyebrow: "For learners",
    audienceTitle: "Who MapKAI is for",
    studentTitle: "Students",
    studentCopy: "Explore broad knowledge fields before choosing a direction.",
    switcherTitle: "Career switchers",
    switcherCopy: "Build structured understanding when entering a new field.",
    explorerTitle: "New field explorers",
    explorerCopy: "Build a clear starting map before going deeper into any subject.",
    lifelongTitle: "Lifelong learners",
    lifelongCopy: "Turn scattered curiosity into a clear learning journey.",
    categoryBandEyebrow: "Knowledge categories",
    categoryBandTitle: "Explore every field with the same structure",
    categoryBandCopy: "MapKAI organizes eleven broad knowledge areas with a consistent structure, so learners can move from the big picture into specific fields without one area dominating the homepage.",
    whyEyebrow: "Why MapKAI?",
    whyTitle: "Why MapKAI?",
    whyP1: "MapKAI stands for Map Knowledge with AI.",
    whyP2: "In today's world, knowledge is everywhere, but it is often scattered, overwhelming, and hard to navigate.",
    whyP3: "MapKAI explores a simple idea: AI can help us turn broad knowledge into clear maps, meaningful categories, and learning paths we can actually follow.",
    whyMap: "because learning needs direction.",
    whyK: "for knowledge.",
    whyAI: "as a tool to organize, connect, and expand what we learn.",
    whyP4: "MapKAI is about transforming scattered knowledge into a structured learning journey, from unknown ocean to explored land.",
    mapEyebrow: "General Knowledge Map",
    mapTitle: "The ocean is unknown. The land is what you can explain.",
    mapCopy: "In MapKAI, the ocean represents what you have not explored yet. The land represents what you understand well enough to explain. Learning paths help you move from ocean to land.",
    goCategories: "Continue Exploring",
    goLearning: "Browse Domains",
    quickMirrorTitle: "Quick Mirror",
    quickMirrorSubtitle: "Answer 3 everyday situations and see your first thinking signal.",
    quickMirrorMeta: "3 questions · No login · 30 seconds",
    tryQuickMirror: "Try Quick Mirror",
    skipQuickMirror: "Skip and start full exploration",
    quickMirrorQuestionProgress: (current, total) => `${current}/${total}`,
    quickMirrorFirstSignal: "Your first signal",
    quickMirrorBoundary: "This is an early signal, not a personality label.",
    quickMirrorDeeperMap: "A deeper map needs more signals.",
    quickMirrorContinue: "Continue to reveal your deeper map",
    quickMirrorRestart: "Try again",
    quickMirrorInviteZh: "我最近在做 MapKAI，想邀请你做第一批体验者。\n\n它不是心理测试，也不用注册。\n我现在想先测试一个 30 秒思维镜像：3 个日常问题，看它能不能捕捉一个人的第一选择模式。\n\n你愿意帮我试一下吗？\n试完只要告诉我三件事：\n1. 第一眼看懂了吗？\n2. 结果有没有一点像你？\n3. 你会不会想继续探索？",
    quickMirrorInviteEn: "I’m testing a small early experience for MapKAI.\n\nIt is not a personality test and does not require login.\nIt is a 30-second thinking mirror with 3 everyday questions, designed to see whether it can capture a person’s first choice pattern.\n\nWould you be open to trying it and sharing quick feedback?\n\nI’m mainly looking for:\n1. Whether the idea is clear at first glance\n2. Whether the result feels somewhat relevant\n3. Whether you would continue exploring after it",
    challengeEyebrow: "Current Exploration",
    challengeTitle: "Answer one situation at a time.",
    challengeCopy: "Your map and reflection become clearer as exploration accumulates.",
    challengeHeading: "Knowledge Exploration",
    challengeCompleteEyebrow: "Exploration complete",
    challengeCompleteTitle: "Your 20 situations are complete.",
    challengeCompleteCopy: "Generate your local Knowledge Lens Map. MapKAI does not save your result.",
    totalCorrect: "Total selections",
    correct: "Correct.",
    notYet: "Not yet.",
    correctFeedback: "This answer helped light up the map.",
    wrongFeedback: "This question is still counted, and the explanation shows the better pattern.",
    whyMatters: "Why this matters",
    previous: "Previous",
    next: "Next",
    titleUnlockHint: "Answer at least 20 questions to unlock your knowledge titles.",
    accuracyTitle: (title) => `Accuracy title: ${title}`,
    explorerTitleStatus: (title) => `Explorer title: ${title}`,
    titleAccuracy: (answered, accuracy) => `${answered} answered · ${accuracy}% accuracy`,
    titleModalTitle: "New knowledge milestone unlocked!",
    titleModalBody: (answered, accuracy) => `You have answered ${answered} questions with ${accuracy}% accuracy.`,
    accuracyTitleLine: (title) => `Accuracy title: ${title}`,
    explorerTitleLine: (title) => `Explorer title: ${title}`,
    titleModalButton: "Keep exploring",
    grandSlamTitle: "You completed the full knowledge map!",
    grandSlamBody: (total) => `You have answered all ${total} questions in this round.`,
    grandSlamAchievement: "Special achievement: Knowledge Grand Slam",
    grandSlamButton: "Finish",
    roundCompleteStatus: "You have completed this full question round.",
    startNewRound: "Start a new round",
    currentExploration: "Current exploration",
    exploredPatterns: "Explored patterns",
    currentMapState: "Current map state",
    questionProgress: (answered, total) => `${answered}/${total} situations explored`,
    generateLensMap: "Generate Knowledge Lens Map",
    lensResultTitle: "Your Knowledge Lens Map",
    strongestLenses: "Strongest lenses",
    supportingLenses: "Supporting lenses",
    quietAreas: "Quiet areas",
    quietAreasCopy: "These lenses did not appear in your choices this round. They are not weaknesses, but possible areas to explore next.",
    resultSummaryTitle: "Summary",
    continueWithOwnAi: "Get a deeper diagnosis from your own AI",
    copyPrompt: "Copy Diagnosis Prompt",
    copiedPrompt: "Copied",
    resultPrivacyNote: "MapKAI does not save your result. Copy your prompt before leaving.",
    promptConversationNote: "This prompt is designed for a short 2-3 round conversation with your own AI, not a one-time report.",
    knowledgeLensSummaryLabel: "Knowledge Lens Summary",
    actionEnergySummaryLabel: "Action Energy Summary",
    exploreEyebrow: "Explore",
    exploreTitle: "Answer questions to reveal your knowledge patterns.",
    exploreCopy: "Explore is the active MapKAI loop: answer one question at a time, reveal progress across clear knowledge maps, and unlock reflection after enough exploration.",
    startExploring: "Start Exploring",
    viewKnowledgeMap: "View Knowledge Map",
    exploreThisDomain: "Explore This Domain",
    reflectionLockedEyebrow: "Reflection locked",
    reflectionUnlockedEyebrow: "Reflection unlocked",
    reflectionTitle: "Knowledge Reflection",
    reflectionLockedCopy: (answered, remaining) => `${answered} answered. Answer ${remaining} more questions to unlock reflection.`,
    reflectionUnlockedCopy: "You have explored enough to generate a knowledge reflection. It only runs when you choose it.",
    generateReflection: "Generate My Knowledge Reflection",
    reflectionSummaryLabel: "Summary",
    primaryPattern: "Primary Pattern",
    blindSpot: "Blind Spot",
    nextDirection: "Next Direction",
    uncomfortableTruth: "Uncomfortable Truth",
    expandFullReflection: "Expand Full Reflection",
    personalAiTitle: "Continue This Reflection In Your Personal AI",
    personalAiCopy: "As people grow older and become more socially adapted, they often receive fewer truly honest observations about themselves. You can copy this reflection into your own GPT, Claude, Gemini, or other AI. Your personal AI may combine it with your past conversations, recent concerns, and long-term patterns to generate a more personalized reflection.",
    copyDeepPrompt: "Copy Deep Reflection Prompt",
    copiedDeepPrompt: "Copied.",
    reflectionDisclaimer: "MapKAI reflections are exploratory observations generated from knowledge exploration patterns. They are not psychological, medical, or professional evaluations.",
    reflectionGenerating: "Reading your exploration pattern...",
    reflectionAiStatus: "Workers AI status",
    reflectionDebug: "Founder reflection debug",
    founderActivated: "Founder mode activated.",
    aboutEyebrow: "About MapKAI",
    aboutOpening: "MapKAI is a small exploration into knowledge, reflection, and self-understanding in the AI era.",
    aboutWhatTitle: "What MapKAI Is",
    aboutWhatP1: "Map your knowledge with AI.",
    aboutWhatP2: "It helps scattered learning become visible enough to explore, question, and reflect on.",
    aboutMissionTitle: "Mission & Vision",
    aboutMissionBelief: "When answers become abundant, direction becomes the real advantage.",
    aboutMissionLabel: "Mission",
    aboutMissionText: "MapKAI helps people discover their active knowledge areas, notice quiet areas, and choose what to explore next in the AI era.",
    aboutVisionLabel: "Vision",
    aboutVisionText: "MapKAI aims to become a personal knowledge compass for the AI era, helping people move beyond narrow professional boundaries, build a broader picture of knowledge, and gradually turn self-awareness into personalized learning paths.",
    aboutMissionTrust: "Quiet areas are not weaknesses. They are places worth exploring.",
    aboutAiTitle: "The AI Era Problem",
    aboutAiP1: "AI can generate infinite answers. But many people still do not clearly understand how they think, what they repeatedly ignore, or where their blind spots are.",
    aboutAiP2: "Navigate your knowledge before navigating AI.",
    aboutExploreTitle: "Why Explore Matters",
    aboutExploreP1: "Explore is not an intelligence test. It is pattern observation, cognitive exploration, and knowledge mapping.",
    aboutQuestionDesignTitle: "How MapKAI Questions Are Designed",
    aboutQuestionDesignP1: "Inspired by UNESCO ISCED-F knowledge classification, MapKAI questions are built around real-world situations, systems, trade-offs, incentives, and everyday reasoning.",
    aboutQuestionDesignP2: "They are not designed for memorization. Many questions hold more than one reasonable explanation, so the goal is to notice patterns and build clearer mental maps.",
    aboutReflectionTitle: "Reflection Philosophy",
    aboutReflectionP1: "As people grow older and become more socially adapted, they often receive fewer truly honest observations about themselves.",
    aboutReflectionP2: "MapKAI reflections are not judgments. They are structured observations.",
    aboutBoundaryTitle: "Product Boundary",
    aboutBoundaryP1: "MapKAI does not try to become your final AI. It gives you a quieter starting point for the AI tools you already use.",
    aboutBoundaryP2: "MapKAI creates the map. Your personal AI helps you explore it more deeply.",
    aboutClosing: "Not everything meaningful can be fully measured. But some things become clearer once they are finally visible.",
    pdcEntryEyebrow: "PDC Experience",
    pdcEntryTitle: "Partner Decision Council",
    pdcEntrySubtitle: "Think through a decision before you act.",
    pdcEntryDescription: "MapKAI PDC helps you examine one real question through multiple thinking partners, then turn the discussion into a clear decision memo.",
    pdcHowEyebrow: "How it works",
    pdcHowTitle: "How it works",
    pdcStepOneTitle: "Bring one decision",
    pdcStepOneCopy: "Start with one concrete question you want to examine from several angles.",
    pdcStepTwoTitle: "Meet your thinking partners",
    pdcStepTwoCopy: "PDC brings together perspectives such as evidence, risk, desire, timing, and social impact.",
    pdcStepThreeTitle: "Leave with a decision memo",
    pdcStepThreeCopy: "The final output is designed to be easier to scan and act on than a raw chat transcript.",
    pdcAccessEyebrow: "Private Access",
    pdcAccessTitle: "Enter your one-time PDC access code",
    pdcAccessDescription: "Use the one-time code shared with you to enter the private PDC experience.",
    pdcAccessLabel: "Access code",
    pdcAccessPlaceholder: "Paste your one-time access code",
    pdcAccessButton: "Enter PDC Experience",
    categoriesEyebrow: "Cognitive Domains",
    categoriesTitle: "Each field tends to think differently.",
    categoriesCopy: "Categories are not a directory. They are lenses for noticing how different fields structure reality.",
    openCategory: "Open category",
    categoryScope: "Category scope",
    categoryCopy: (groups, fields) => `This page shows ${groups} groups and ${fields} detailed fields in this category.`,
    groups: "groups",
    detailedFields: "detailed fields",
    learningEyebrow: "Cognitive Expansion",
    learningTitle: "Learning is a direction for expanding how you think.",
    learningCopy: "MapKAI learning is not a course list. It suggests cognitive directions after exploration reveals a pattern.",
    learningBandEyebrow: "Suggested expansion",
    learningBandTitle: "Return to Explore before choosing a direction",
    learningBandCopy: "The clearest learning path begins with a visible pattern.",
    browseCategories: "Browse Categories",
    contactEyebrow: "Contact",
    contactTitle: "Need help or want to leave a message?",
    contactCopy: "If you need to contact MapKAI, please leave a message here.",
    messageBoard: "Message board",
    messagePlaceholder: "Tell us what you want to ask, suggest, or build with MapKAI.",
    leaveMessage: "Submit",
    messageSaved: "Thank you. Your message has been received.",
    messageError: "Sorry, your message could not be sent. Please try again.",
    invalidEmail: "Please enter a valid email address.",
    founderMessageBoard: "Founder message board",
    noMessages: "No messages yet.",
    couldNotLoadMessages: "Could not load messages.",
    contactApiStatus: (status) => `Contact API status: ${status}`,
    loadedMessages: (count) => `Loaded messages: ${count}`,
    contactApiConnected: "connected",
    contactApiFailed: "failed",
    footerPrivacy: "Privacy",
    footerResponsibleUse: "Responsible Use",
    footerCookies: "Cookies",
    footerTerms: "Terms",
    privacyEyebrow: "Privacy",
    privacyTitle: "Privacy at MapKAI",
    privacyLead: "MapKAI is low-data by design. For the current experience, you do not need to create an account or provide your name or email. Quiz progress is not linked to a personal profile, and contact is optional.",
    privacyLowTitle: "Low-data by design",
    privacyLowP1: "For the current experience, no account is required. You do not need to provide your name or email to explore MapKAI.",
    privacyLowP2: "MapKAI does not require or build a customer profile for the current exploration flow.",
    privacyLowP3: "We do not use advertising tracking for the current MapKAI experience.",
    privacyQuizTitle: "Quiz and reflection data",
    privacyQuizP1: "Quiz progress is not linked to a personal profile. The current exploration result is generated in your browser and can disappear when you leave or refresh.",
    privacyQuizP2: "Raw quiz records are not stored by default. If temporary quality checks are introduced later, records should be anonymized, aggregated, or deleted regularly, preferably within 30 days.",
    privacyQuizP3: "Aggregated statistics may be used to improve questions and site experience if they are not linked to personal profiles.",
    privacyContactTitle: "Contact is optional",
    privacyContactP1: "If you send a contact message, MapKAI uses it only to respond to you. Contact messages are separate from quiz progress and should be reviewed or deleted periodically.",
    privacyContactP2: "Please avoid sharing highly sensitive personal information in the message box.",
    privacyTechTitle: "Technical processing",
    privacyTechP1: "Basic technical logs may exist through hosting and security providers such as Cloudflare.",
    privacyTechP2: "MapKAI uses browser storage for small product states such as language preference, Founder mode state, and visitor-count continuity. See the Cookies page for more detail.",
    privacyFutureTitle: "Future changes",
    privacyFutureP1: "If MapKAI introduces new features, accounts, or data practices in the future, this page should be updated clearly.",
    responsibleEyebrow: "Responsible Use",
    responsibleTitle: "Responsible use",
    responsibleLead: "MapKAI helps map thinking, not people. Human judgment remains central.",
    responsibleSupportTitle: "What MapKAI supports",
    responsibleSupportP1: "MapKAI supports reflection, learning, knowledge mapping, and option exploration.",
    responsibleSupportP2: "Use it as reflection and learning support, not as professional advice.",
    responsibleLimitsTitle: "What MapKAI does not replace",
    responsibleLimitsP1: "MapKAI does not replace human judgment.",
    responsibleLimitsP2: "MapKAI does not provide legal, medical, financial, psychological, or other qualified professional advice.",
    responsibleLimitsP3: "Important decisions remain your responsibility.",
    responsibleCareTitle: "Careful use",
    responsibleCareP1: "Please avoid submitting highly sensitive personal information.",
    responsibleCareP2: "Treat MapKAI outputs as prompts for thought, conversation, and learning direction.",
    cookiesEyebrow: "Cookies",
    cookiesTitle: "Cookies and browser storage",
    cookiesLead: "We do not use advertising or tracking cookies for the current MapKAI experience. If this changes, we will update this page clearly and request consent where required.",
    cookiesCurrentTitle: "Current approach",
    cookiesCurrentP1: "The current code audit did not find advertising scripts, tracking pixels, or third-party analytics tags.",
    cookiesCurrentP2: "MapKAI uses localStorage for language preference, Founder mode state, a local visitor id used by the visitor counter, and temporary interface state. The audit did not find sessionStorage usage. The repository also includes email-auth endpoints that can set a short-lived login challenge cookie if those endpoints are configured and used; this is not required for the current public exploration flow.",
    cookiesCurrentP3: "Hosting and security providers may still process basic technical logs when pages or API routes are requested.",
    cookiesManageTitle: "Managing storage",
    cookiesManageP1: "You can clear cookies and browser storage through your browser settings. Clearing localStorage may reset language preference, visitor-count continuity, and local interface state.",
    termsEyebrow: "Terms",
    termsTitle: "Terms of use",
    termsLead: "MapKAI is currently a free knowledge initiative. It provides educational and reflection support.",
    termsUseTitle: "Using MapKAI",
    termsUseP1: "MapKAI helps you explore knowledge patterns, quiet areas, and possible learning directions.",
    termsUseP2: "MapKAI does not provide professional advice, and you remain responsible for final decisions.",
    termsAcceptableTitle: "Acceptable use",
    termsAcceptableP1: "Please do not misuse MapKAI, interfere with the site, attempt to access non-public systems, submit harmful content, or copy MapKAI content and design for unauthorized commercial use.",
    termsEvolveTitle: "MapKAI may evolve",
    termsEvolveP1: "MapKAI may change over time. If new features, accounts, or data practices are introduced in the future, relevant pages should be updated clearly.",
    footerRights: "© 2026 MapKAI. All rights reserved.",
    footerNotice: "Unauthorized copying, reproduction, redistribution, adaptation, or commercial use of MapKAI content, structure, design, or visual materials is not permitted without prior written permission.",
    viewedMany: "MapKAI has been viewed many times.",
    viewedCount: (count) => `MapKAI has been viewed #${count} times.`,
    uniqueVisitors: (count) => `Unique visitors: #${count}.`,
    thanks: "Thanks for visiting MapKAI.",
  },
  zh: {
    navExplore: "开始探索",
    navMap: "地图",
    navPdc: "PDC",
    navCategories: "分类",
    navLearning: "学习路径",
    navAbout: "关于",
    homeEyebrow: "",
    homeTitle: "Map your knowledge with AI",
    homeCopy: "As AI generates more answers,\nunderstanding yourself may quietly become more important.",
    homePrimary: "开始探索",
    homeQuickMirrorHint: "3个问题 · 不用注册 · 30秒看结果",
    homeQuickMirrorSupport: "包含一个适合第一次体验的 30秒思维镜像。",
    homeTrust: "MapKAI 目前是一个免费的知识倡议。你无需创建账户，也无需提供姓名或邮箱，就可以开始探索。",
    mapStartTrust: "自由探索。无需账户、姓名或邮箱。你的答题进度不会绑定到个人档案。",
    contactTrust: "联系是可选的。请避免提交高度敏感的个人信息。如果你发送留言，我们只会用它来回复你。",
    reflectionSupportNote: "请把它作为反思与学习支持，而不是专业建议。",
    homeLearning: "查看知识地图",
    homeCategories: "浏览领域",
    reflectionSnippetsTitle: "探索会慢慢显现什么",
    reflectionSnippets: [
      "有些问题，\n你会在解释之前先感觉清楚。",
      "有些答案，\n显现的是你组织问题的方式。",
      "你会慢慢看见\n自己回避、匆忙跳过，或过度控制的领域。",
      "时间久了，地图会变成\n一面更安静的思考镜子。",
    ],
    coreEyebrow: "核心探索循环",
    coreTitle: "探索、回答、显现、反思。",
    exploreCardTitle: "探索 - 回答问题",
    exploreCardCopy: "从模式识别问题开始，进入主动探索循环。",
    exploreCardLink: "开始探索",
    mapCardTitle: "地图 - 看见已显现的领域",
    mapCardCopy: "随着探索推进，看见你的知识世界逐步点亮。",
    mapCardLink: "打开地图",
    categoriesCardTitle: "分类 - 选择探索领域",
    categoriesCardCopy: "浏览知识领域，然后继续进入答题探索。",
    categoriesCardLink: "浏览分类",
    learningCardTitle: "学习 - 跟随一条路径",
    learningCardCopy: "把已经显现的知识模式，转化为下一步学习方向。",
    learningCardLink: "查看路径",
    howEyebrow: "如何使用",
    howTitle: "MapKAI 如何工作",
    howOneTitle: "回答问题",
    howOneCopy: "从真实场景、取舍和知识模式开始。",
    howTwoTitle: "显现模式",
    howTwoCopy: "你的回答会逐步点亮知识地图中的区域。",
    howThreeTitle: "解锁反思",
    howThreeCopy: "完成足够探索后，手动生成一份平静的知识画像。",
    audienceEyebrow: "适合谁",
    audienceTitle: "谁适合使用 MapKAI",
    studentTitle: "学生",
    studentCopy: "在选择方向前，先看清广阔的知识领域。",
    switcherTitle: "转行者",
    switcherCopy: "进入新领域时，先建立稳定的理解框架。",
    explorerTitle: "新领域探索者",
    explorerCopy: "深入之前，先建立一张清晰的起点地图。",
    lifelongTitle: "终身学习者",
    lifelongCopy: "把零散的兴趣整理成清楚的学习旅程。",
    categoryBandEyebrow: "知识分类",
    categoryBandTitle: "用一致结构探索不同领域",
    categoryBandCopy: "MapKAI 将十一个广阔知识领域整理在同一套结构中，让学习者能从全景进入具体领域，而不是让某一个领域占据首页中心。",
    whyEyebrow: "为什么是 MapKAI？",
    whyTitle: "为什么是 MapKAI？",
    whyP1: "MapKAI 代表 Map Knowledge with AI。",
    whyP2: "今天的知识到处都是，但常常零散、拥挤，也不容易找到方向。",
    whyP3: "MapKAI 想探索一个简单想法：AI 能不能帮助我们把广阔知识整理成清晰地图、有意义的分类，以及真正可以跟随的学习路径。",
    whyMap: "因为学习需要方向。",
    whyK: "代表 knowledge，知识。",
    whyAI: "作为工具，帮助我们整理、连接并扩展所学。",
    whyP4: "MapKAI 不只是收集信息，而是把零散知识整理成一段结构清楚的学习旅程，从未探索的知识海洋走向能够解释的陆地。",
    mapEyebrow: "通用知识地图",
    mapTitle: "海洋是未知，陆地是你能解释的知识。",
    mapCopy: "在 MapKAI 里，海洋代表你还没有探索的知识；陆地代表你已经能解释的理解。学习路径会帮助你一步步从海洋走向陆地。",
    goCategories: "继续探索",
    goLearning: "浏览领域",
    quickMirrorTitle: "30秒思维镜像",
    quickMirrorSubtitle: "回答3个日常情境，看看你的第一个思维信号。",
    quickMirrorMeta: "3个问题 · 不用注册 · 30秒看结果",
    tryQuickMirror: "开始30秒思维镜像",
    skipQuickMirror: "跳过，直接开始完整探索",
    quickMirrorQuestionProgress: (current, total) => `${current}/${total}`,
    quickMirrorFirstSignal: "你的第一个信号",
    quickMirrorBoundary: "这只是早期信号，不是人格标签。",
    quickMirrorDeeperMap: "更完整的地图需要更多信号。",
    quickMirrorContinue: "继续探索，生成更完整的自己",
    quickMirrorRestart: "重新体验",
    quickMirrorInviteZh: "我最近在做 MapKAI，想邀请你做第一批体验者。\n\n它不是心理测试，也不用注册。\n我现在想先测试一个 30 秒思维镜像：3 个日常问题，看它能不能捕捉一个人的第一选择模式。\n\n你愿意帮我试一下吗？\n试完只要告诉我三件事：\n1. 第一眼看懂了吗？\n2. 结果有没有一点像你？\n3. 你会不会想继续探索？",
    quickMirrorInviteEn: "I’m testing a small early experience for MapKAI.\n\nIt is not a personality test and does not require login.\nIt is a 30-second thinking mirror with 3 everyday questions, designed to see whether it can capture a person’s first choice pattern.\n\nWould you be open to trying it and sharing quick feedback?\n\nI’m mainly looking for:\n1. Whether the idea is clear at first glance\n2. Whether the result feels somewhat relevant\n3. Whether you would continue exploring after it",
    challengeEyebrow: "当前探索",
    challengeTitle: "一次进入一个情境。",
    challengeCopy: "随着探索积累，你的地图和反思会逐渐清晰。",
    challengeHeading: "知识探索",
    challengeCompleteEyebrow: "探索完成",
    challengeCompleteTitle: "你已经完成 20 个情境。",
    challengeCompleteCopy: "生成你的知识视角地图。MapKAI 不保存你的结果。",
    totalCorrect: "选择总数",
    correct: "答对了。",
    notYet: "还不对。",
    correctFeedback: "这个答案帮助地图继续点亮。",
    wrongFeedback: "这道题已经记录，解释会展示更好的理解方式。",
    whyMatters: "为什么重要",
    previous: "Previous",
    next: "Next",
    titleUnlockHint: "答满 20 题后，解锁你的知识称号。",
    accuracyTitle: (title) => `正确率称号：${title}`,
    explorerTitleStatus: (title) => `探索称号：${title}`,
    titleAccuracy: (answered, accuracy) => `已完成 ${answered} 题 · 正确率 ${accuracy}%`,
    titleModalTitle: "新的知识里程碑已解锁！",
    titleModalBody: (answered, accuracy) => `你已完成 ${answered} 题，正确率 ${accuracy}%。`,
    accuracyTitleLine: (title) => `正确率称号：${title}`,
    explorerTitleLine: (title) => `探索称号：${title}`,
    titleModalButton: "继续探索",
    grandSlamTitle: "你完成了整张知识地图！",
    grandSlamBody: (total) => `你已经完成了本轮全部 ${total} 道题。`,
    grandSlamAchievement: "特殊成就：知识大满贯",
    grandSlamButton: "完成",
    roundCompleteStatus: "你已经完成了本轮全部题目。",
    startNewRound: "开启新一轮",
    currentExploration: "当前探索",
    exploredPatterns: "已探索模式",
    currentMapState: "当前地图状态",
    questionProgress: (answered, total) => `已探索 ${answered}/${total} 个情境`,
    generateLensMap: "生成知识视角地图",
    lensResultTitle: "你的知识视角地图",
    strongestLenses: "你的主要知识视角",
    supportingLenses: "也被激活的视角",
    quietAreas: "安静区域",
    quietAreasCopy: "这些视角在本轮选择中没有被激活。它们不是弱项，只是下一步可以探索的方向。",
    resultSummaryTitle: "简要总结",
    continueWithOwnAi: "复制给你的 AI，获得更深入的问题诊断",
    copyPrompt: "复制诊断 Prompt",
    copiedPrompt: "已复制",
    resultPrivacyNote: "MapKAI 不保存你的结果。离开页面前，请复制你的 Prompt。",
    promptConversationNote: "这段 Prompt 适合和你自己的 AI 进行 2–3 轮深入对话，而不是生成一次性报告。",
    knowledgeLensSummaryLabel: "知识视角总结",
    actionEnergySummaryLabel: "行动能量总结",
    exploreEyebrow: "探索",
    exploreTitle: "通过回答问题，看见你的知识模式。",
    exploreCopy: "Explore 是 MapKAI 的主动循环：一次回答一道题，在地图上显现进度，并在足够探索后解锁反思。",
    startExploring: "开始探索",
    viewKnowledgeMap: "查看知识地图",
    exploreThisDomain: "探索这个领域",
    reflectionLockedEyebrow: "反思未解锁",
    reflectionUnlockedEyebrow: "反思已解锁",
    reflectionTitle: "知识画像",
    reflectionLockedCopy: (answered, remaining) => `已完成 ${answered} 题。再回答 ${remaining} 题即可解锁知识画像。`,
    reflectionUnlockedCopy: "你已经完成足够探索，可以生成知识画像。它只会在你手动点击时生成。",
    generateReflection: "生成我的知识画像",
    reflectionSummaryLabel: "摘要",
    primaryPattern: "主要模式",
    blindSpot: "盲点",
    nextDirection: "下一步方向",
    uncomfortableTruth: "不舒服的事实",
    expandFullReflection: "展开完整反思",
    personalAiTitle: "带到你的个人 AI 继续思考",
    personalAiCopy: "随着人越来越成熟、越来越适应社会，我们反而很少收到真正客观而坦诚的观察。你可以复制下面的内容，放进你自己的 GPT、Claude、Gemini 或其他 AI。你的个人 AI 可以结合你过去的对话、最近关注的问题以及长期行为模式，生成更贴近你的深度观察。",
    copyDeepPrompt: "复制深度成长 Prompt",
    copiedDeepPrompt: "已复制。",
    reflectionDisclaimer: "MapKAI 的反思内容仅基于知识探索模式生成，不构成心理、医疗或专业判断。",
    reflectionGenerating: "正在读取你的探索模式...",
    reflectionAiStatus: "Workers AI 状态",
    reflectionDebug: "Founder 反思调试",
    founderActivated: "Founder mode activated.",
    aboutEyebrow: "关于 MapKAI",
    aboutOpening: "MapKAI is a small exploration into knowledge, reflection, and self-understanding in the AI era.",
    aboutWhatTitle: "MapKAI 是什么",
    aboutWhatP1: "Map your knowledge with AI.",
    aboutWhatP2: "它让零散学习变得可见，从而更容易被探索、追问和反思。",
    aboutMissionTitle: "Mission & Vision",
    aboutMissionBelief: "当答案变得充足，方向才成为真正的优势。",
    aboutMissionLabel: "Mission",
    aboutMissionText: "MapKAI 帮助人们在 AI 时代发现自己的知识活跃区域，留意安静区域，并选择下一步值得探索的方向。",
    aboutVisionLabel: "Vision",
    aboutVisionText: "MapKAI 的愿景，是成为 AI 时代的个人知识指南针，帮助人们突破单一专业边界，建立更完整的知识图景，并逐步把自我认知转化为个性化学习路径。",
    aboutMissionTrust: "安静区域不是弱点，而是值得探索的地方。",
    aboutAiTitle: "AI 时代的问题",
    aboutAiP1: "AI 可以生成无限答案。但很多人仍然不清楚自己如何思考、反复忽略什么、盲点在哪里。",
    aboutAiP2: "Navigate your knowledge before navigating AI.",
    aboutExploreTitle: "为什么 Explore 重要",
    aboutExploreP1: "Explore 不是智力测试。它是模式观察、认知探索和知识地图。",
    aboutQuestionDesignTitle: "MapKAI 的题目如何设计",
    aboutQuestionDesignP1: "MapKAI 的题目灵感来自 UNESCO ISCED-F 知识分类，但并不围绕死记硬背展开。它更关注真实情境中的模式、系统、取舍、激励与日常推理。",
    aboutQuestionDesignP2: "很多问题没有一眼可见的唯一答案。目标不是把人分类，而是帮助你看见隐藏结构，并慢慢建立更清晰的 mental map。",
    aboutReflectionTitle: "反思哲学",
    aboutReflectionP1: "随着人越来越成熟、越来越适应社会，我们反而很少收到真正客观而坦诚的观察。",
    aboutReflectionP2: "MapKAI 的反思不是判断，而是结构化观察。",
    aboutBoundaryTitle: "产品边界",
    aboutBoundaryP1: "MapKAI 不试图成为你的最终 AI。它只是为你已经使用的 AI 工具提供一个更安静的起点。",
    aboutBoundaryP2: "MapKAI 创建地图。你的个人 AI 帮你更深入地探索它。",
    aboutClosing: "不是所有有意义的东西都能被完全测量。但有些东西一旦变得可见，就会更清楚。",
    pdcEntryEyebrow: "PDC 体验",
    pdcEntryTitle: "Partner Decision Council",
    pdcEntrySubtitle: "在行动之前，先把一个决定想清楚。",
    pdcEntryDescription: "MapKAI PDC 会帮你从多个思考伙伴的视角审视一个真实问题，并把讨论整理成清晰的决策备忘录。",
    pdcHowEyebrow: "它如何运作",
    pdcHowTitle: "它如何运作",
    pdcStepOneTitle: "带来一个决定",
    pdcStepOneCopy: "从一个你想认真审视的具体问题开始。",
    pdcStepTwoTitle: "遇见你的思考伙伴",
    pdcStepTwoCopy: "PDC 会汇集证据、风险、真实意愿、时机和关系影响等不同视角。",
    pdcStepThreeTitle: "带走一份决策备忘录",
    pdcStepThreeCopy: "最终输出会比原始聊天记录更容易浏览、比较和行动。",
    pdcAccessEyebrow: "私人访问",
    pdcAccessTitle: "输入你的一次性 PDC 访问码",
    pdcAccessDescription: "使用与你分享的一次性访问码，进入私人 PDC 体验。",
    pdcAccessLabel: "访问码",
    pdcAccessPlaceholder: "粘贴你的一次性访问码",
    pdcAccessButton: "进入 PDC 体验",
    categoriesEyebrow: "认知领域",
    categoriesTitle: "每个领域都有自己的思考方式。",
    categoriesCopy: "分类不是目录，而是观察不同领域如何组织现实的认知镜头。",
    openCategory: "打开分类",
    categoryScope: "分类范围",
    categoryCopy: (groups, fields) => `这个页面展示该分类下的 ${groups} 个组和 ${fields} 个具体领域。`,
    groups: "个组",
    detailedFields: "个具体领域",
    learningEyebrow: "认知扩展",
    learningTitle: "学习是扩展思考方式的方向。",
    learningCopy: "MapKAI 的学习不是课程列表，而是在探索显现模式后，给出认知扩展方向。",
    learningBandEyebrow: "建议扩展",
    learningBandTitle: "先回到 Explore，再选择方向",
    learningBandCopy: "最清晰的学习路径，来自已经显现的模式。",
    browseCategories: "浏览分类",
    contactEyebrow: "联系",
    contactTitle: "需要帮助，或想留下想法？",
    contactCopy: "如果你想联系 MapKAI，可以在这里留言。",
    messageBoard: "留言板",
    messagePlaceholder: "告诉我们你想询问、建议或一起构建什么。",
    leaveMessage: "提交",
    messageSaved: "谢谢，你的留言已收到。",
    messageError: "抱歉，留言发送失败，请稍后再试。",
    invalidEmail: "请输入有效的邮箱地址。",
    founderMessageBoard: "Founder 留言板",
    noMessages: "暂时还没有留言。",
    couldNotLoadMessages: "无法加载留言。",
    contactApiStatus: (status) => `Contact API 状态：${status}`,
    loadedMessages: (count) => `已加载留言：${count}`,
    contactApiConnected: "connected",
    contactApiFailed: "failed",
    footerPrivacy: "隐私",
    footerResponsibleUse: "负责任使用",
    footerCookies: "Cookies",
    footerTerms: "使用条款",
    privacyEyebrow: "隐私",
    privacyTitle: "MapKAI 隐私说明",
    privacyLead: "MapKAI 以低数据为设计原则。在当前体验中，你不需要创建账户，也不需要提供姓名或邮箱。答题进度不会绑定到个人档案，联系也是可选的。",
    privacyLowTitle: "低数据设计",
    privacyLowP1: "在当前体验中，探索 MapKAI 不需要账户，也不需要提供姓名或邮箱。",
    privacyLowP2: "当前探索流程不需要，也不会建立客户档案。",
    privacyLowP3: "当前 MapKAI 体验不使用广告追踪。",
    privacyQuizTitle: "答题与反思数据",
    privacyQuizP1: "答题进度不会绑定到个人档案。当前探索结果在你的浏览器中生成，离开或刷新后可以消失。",
    privacyQuizP2: "默认不保存原始答题记录。如果未来为了质量改进临时收集，应进行匿名化、聚合，或定期删除，最好在 30 天内处理。",
    privacyQuizP3: "如果统计结果不绑定个人档案，MapKAI 可能使用聚合统计来改进题目和网站体验。",
    privacyContactTitle: "联系是可选的",
    privacyContactP1: "如果你发送联系留言，MapKAI 只会用它来回复你。联系留言与答题进度分开，并应定期查看或删除。",
    privacyContactP2: "请避免在留言框中提交高度敏感的个人信息。",
    privacyTechTitle: "技术处理",
    privacyTechP1: "托管和安全服务提供方，例如 Cloudflare，可能产生基础技术日志。",
    privacyTechP2: "MapKAI 使用浏览器存储保存少量产品状态，例如语言偏好、Founder mode 状态、访客计数连续性。更多细节见 Cookies 页面。",
    privacyFutureTitle: "未来变化",
    privacyFutureP1: "如果 MapKAI 未来引入新功能、账户或新的数据实践，本页面应清楚更新。",
    responsibleEyebrow: "负责任使用",
    responsibleTitle: "负责任使用",
    responsibleLead: "MapKAI 帮助映射思考，而不是定义人。人的判断始终是中心。",
    responsibleSupportTitle: "MapKAI 支持什么",
    responsibleSupportP1: "MapKAI 支持反思、学习、知识地图和选项探索。",
    responsibleSupportP2: "请把它作为反思与学习支持，而不是专业建议。",
    responsibleLimitsTitle: "MapKAI 不替代什么",
    responsibleLimitsP1: "MapKAI 不替代人的判断。",
    responsibleLimitsP2: "MapKAI 不提供法律、医疗、财务、心理或其他需要专业资质的建议。",
    responsibleLimitsP3: "重要决定仍由你自己负责。",
    responsibleCareTitle: "谨慎使用",
    responsibleCareP1: "请避免提交高度敏感的个人信息。",
    responsibleCareP2: "请把 MapKAI 输出当作思考、对话和学习方向的起点。",
    cookiesEyebrow: "Cookies",
    cookiesTitle: "Cookies 与浏览器存储",
    cookiesLead: "当前 MapKAI 体验不使用广告或追踪 cookies。如果未来发生变化，我们会清楚更新本页面，并在需要时请求同意。",
    cookiesCurrentTitle: "当前方式",
    cookiesCurrentP1: "当前代码审计没有发现广告脚本、追踪像素或第三方 analytics 标签。",
    cookiesCurrentP2: "MapKAI 使用 localStorage 保存语言偏好、Founder mode 状态、访客计数所需的本地 visitor id，以及临时界面状态。审计未发现 sessionStorage 使用。仓库中也包含邮箱验证端点；如果这些端点被配置并使用，可能设置一个短期 login challenge cookie，但当前公开探索流程不需要它。",
    cookiesCurrentP3: "当页面或 API 路由被请求时，托管和安全服务提供方仍可能处理基础技术日志。",
    cookiesManageTitle: "管理存储",
    cookiesManageP1: "你可以在浏览器设置中清除 cookies 和浏览器存储。清除 localStorage 可能会重置语言偏好、访客计数连续性和本地界面状态。",
    termsEyebrow: "使用条款",
    termsTitle: "使用条款",
    termsLead: "MapKAI 目前是一个免费的知识倡议，提供教育与反思支持。",
    termsUseTitle: "使用 MapKAI",
    termsUseP1: "MapKAI 帮助你探索知识模式、安静区域和可能的学习方向。",
    termsUseP2: "MapKAI 不提供专业建议，最终决定仍由你自己负责。",
    termsAcceptableTitle: "可接受使用",
    termsAcceptableP1: "请不要滥用 MapKAI、干扰网站、尝试访问非公开系统、提交有害内容，或未经授权复制 MapKAI 内容与设计作商业用途。",
    termsEvolveTitle: "MapKAI 会继续变化",
    termsEvolveP1: "MapKAI 可能随时间变化。如果未来引入新功能、账户或新的数据实践，相关页面应清楚更新。",
    footerRights: "© 2026 MapKAI。保留所有权利。",
    footerNotice: "未经事先书面许可，不得复制、转载、改编或商业使用 MapKAI 的内容、结构、设计或视觉材料。",
    viewedMany: "MapKAI 已被浏览很多次。",
    viewedCount: (count) => `MapKAI 已被浏览 #${count} 次。`,
    uniqueVisitors: (count) => `独立访客：#${count}。`,
    thanks: "感谢访问 MapKAI。",
  },
};

function t(key, ...args) {
  const value = uiText[currentLanguage]?.[key] ?? uiText.en[key] ?? key;
  return typeof value === "function" ? value(...args) : value;
}

const quickMirrorQuestions = [
  {
    id: "quick-001",
    en: {
      question: "You and your friends are planning a short weekend trip. What would you naturally want to take care of?",
      options: {
        A: "Managing the budget and deciding what is truly worth spending on",
        B: "Designing the route so time and transport feel smoother",
        C: "Finding places and experiences that feel memorable",
        D: "Taking care of everyone’s rhythm, energy, and comfort",
      },
    },
    zh: {
      question: "你和朋友要策划一次周末短途旅行。你最想负责哪件事？",
      options: {
        A: "控制预算，判断哪些钱花得最值",
        B: "设计路线，让时间和交通更顺",
        C: "找到真正有记忆点的地方和体验",
        D: "照顾大家的节奏、体力和舒适度",
      },
    },
  },
  {
    id: "quick-002",
    en: {
      question: "A small project suddenly becomes messy. Everyone is busy, but the direction is unclear. What would you want to do first?",
      options: {
        A: "Identify the key problem and decide what is most worth focusing on",
        B: "Organize tasks, roles, and next steps so the situation has structure again",
        C: "Suggest a new angle so the team can see different possibilities",
        D: "Align people’s pressure and rhythm first, so the team does not burn out",
      },
    },
    zh: {
      question: "一个小项目突然变得混乱，大家都在忙，但方向不太清楚。你最想先做什么？",
      options: {
        A: "找出最关键的问题，判断哪些事情最值得投入",
        B: "整理任务、角色和下一步，让局面重新有结构",
        C: "提出一个新的切入点，让大家看到不同可能性",
        D: "先和大家对齐压力和节奏，避免团队继续消耗",
      },
    },
  },
  {
    id: "quick-003",
    en: {
      question: "You want to explore a new direction, but you are not sure whether it fits you. What would you usually do first?",
      options: {
        A: "Look up information and examples to judge whether it is truly worth investing in",
        B: "Build a simple plan and clarify the path and steps first",
        C: "Try a small project or small experience to see whether it feels right",
        D: "Talk with people, hear different experiences, and then check your own state",
      },
    },
    zh: {
      question: "你想开始探索一个新方向，但还不确定它是否适合你。你通常会先怎么做？",
      options: {
        A: "查资料和案例，判断它是否真的值得投入",
        B: "搭一个简单计划，先把路径和步骤理出来",
        C: "先尝试一个小作品或小体验，看看有没有感觉",
        D: "找人聊聊，听听不同经验，再判断自己的状态",
      },
    },
  },
];

const quickMirrorResults = {
  A: {
    signalEn: "Evidence / Value",
    signalZh: "价值判断",
    nameEn: "Evidence-Seeking Explorer",
    nameZh: "价值判断型探索者",
    mirrorEn: "Before you invest your energy, you may first look for what is truly worth it.",
    mirrorZh: "在投入精力之前，你可能会先判断什么才真正值得。",
  },
  B: {
    signalEn: "Structure / Systems",
    signalZh: "结构路径",
    nameEn: "Structure-Seeking Explorer",
    nameZh: "结构路径型探索者",
    mirrorEn: "Before you fully trust a path, you may first look for structure, roles, and next steps.",
    mirrorZh: "在真正相信一条路之前，你可能会先寻找结构、角色和下一步。",
  },
  C: {
    signalEn: "Meaning / Possibility",
    signalZh: "可能性创造",
    nameEn: "Possibility-Seeking Explorer",
    nameZh: "可能性创造型探索者",
    mirrorEn: "Before you settle into one direction, you may first look for what feels meaningful, fresh, or worth trying.",
    mirrorZh: "在确定一个方向之前，你可能会先寻找什么是有意义、新鲜、值得尝试的。",
  },
  D: {
    signalEn: "People / Comfort",
    signalZh: "关系节奏",
    nameEn: "People-Aware Explorer",
    nameZh: "关系节奏型探索者",
    mirrorEn: "Before moving forward, you may first notice people’s rhythm, comfort, and shared readiness.",
    mirrorZh: "在继续推进之前，你可能会先注意大家的节奏、舒适度和共同准备状态。",
  },
};

let quickMirrorState = {
  mode: "intro",
  index: 0,
  answers: [],
};

const mapAssetPath = "/assets/map/";
const mapStateLayerNames = {
  ocean: "unknown_ocean",
  snow: "partial_pale_snow",
  land: "golden_land",
  green: "full_green",
};
const mapIslandLayers = {
  "00": "01_island_forest",
  "01": "02_island_snow",
  "02": "03_island_desert",
  "03": "04_island_tropical",
  "04": "05_island_grass_path",
  "05": "06_island_farming",
  "06": "07_island_rocky",
  "07": "08_island_lighthouse",
  "08": "09_island_green_hill",
  "09": "10_island_reserved_empty_01",
  "10": "11_island_reserved_empty_02",
};
const mapFounderLabelPositions = {
  "00": [216, 154],
  "01": [548, 143],
  "02": [878, 158],
  "03": [212, 343],
  "04": [550, 325],
  "05": [882, 341],
  "06": [238, 507],
  "07": [548, 500],
  "08": [880, 493],
  "09": [1006, 244],
  "10": [1014, 405],
};
const mapAssetCache = {};

const categories = [
  {
    code: "00",
    title: "Generic programmes and qualifications",
    chineseTitle: "通用课程与资格",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "000", title: "Generic programmes and qualifications not further defined", fields: [["0000", "Generic programmes and qualifications not further defined"]] },
      { code: "001", title: "Basic programmes and qualifications", fields: [["0011", "Basic programmes and qualifications"]] },
      { code: "002", title: "Literacy and numeracy", fields: [["0021", "Literacy and numeracy"]] },
      { code: "003", title: "Personal skills and development", fields: [["0031", "Personal skills and development"]] },
      { code: "009", title: "Generic programmes and qualifications not elsewhere classified", fields: [["0099", "Generic programmes and qualifications not elsewhere classified"]] },
    ],
  },
  {
    code: "01",
    title: "Education",
    chineseTitle: "教育",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      {
        code: "011",
        title: "Education",
        fields: [
          ["0110", "Education not further defined"],
          ["0111", "Education science"],
          ["0112", "Training for pre-school teachers"],
          ["0113", "Teacher training without subject specialisation"],
          ["0114", "Teacher training with subject specialisation"],
          ["0119", "Education not elsewhere classified"],
        ],
      },
      { code: "018", title: "Inter-disciplinary programmes and qualifications involving education", fields: [["0188", "Inter-disciplinary programmes and qualifications involving education"]] },
    ],
  },
  {
    code: "02",
    title: "Arts and Humanities",
    chineseTitle: "艺术与人文",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "020", title: "Arts and humanities not further defined", fields: [["0200", "Arts and humanities not further defined"]] },
      {
        code: "021",
        title: "Arts",
        fields: [
          ["0210", "Arts not further defined"],
          ["0211", "Audio-visual techniques and media production"],
          ["0212", "Fashion, interior and industrial design"],
          ["0213", "Fine arts"],
          ["0214", "Handicrafts"],
          ["0215", "Music and performing arts"],
          ["0219", "Arts not elsewhere classified"],
        ],
      },
      {
        code: "022",
        title: "Humanities (except languages)",
        fields: [
          ["0220", "Humanities (except languages) not further defined"],
          ["0221", "Religion and theology"],
          ["0222", "History and archaeology"],
          ["0223", "Philosophy and ethics"],
          ["0229", "Humanities (except languages) not elsewhere classified"],
        ],
      },
      {
        code: "023",
        title: "Languages",
        fields: [
          ["0230", "Languages not further defined"],
          ["0231", "Language acquisition"],
          ["0232", "Literature and linguistics"],
          ["0239", "Languages not elsewhere classified"],
        ],
      },
      { code: "028", title: "Inter-disciplinary programmes and qualifications involving arts and humanities", fields: [["0288", "Inter-disciplinary programmes and qualifications involving arts and humanities"]] },
      { code: "029", title: "Arts and humanities not elsewhere classified", fields: [["0299", "Arts and humanities not elsewhere classified"]] },
    ],
  },
  {
    code: "03",
    title: "Social Sciences, Journalism and Information",
    chineseTitle: "社会科学、新闻与信息",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "030", title: "Social sciences, journalism and information not further defined", fields: [["0300", "Social sciences, journalism and information not further defined"]] },
      {
        code: "031",
        title: "Social and behavioural sciences",
        fields: [
          ["0310", "Social and behavioural sciences not further defined"],
          ["0311", "Economics"],
          ["0312", "Political sciences and civics"],
          ["0313", "Psychology"],
          ["0314", "Sociology and cultural studies"],
          ["0319", "Social and behavioural sciences not elsewhere classified"],
        ],
      },
      {
        code: "032",
        title: "Journalism and information",
        fields: [
          ["0320", "Journalism and information not further defined"],
          ["0321", "Journalism and reporting"],
          ["0322", "Library, information and archival studies"],
          ["0329", "Journalism and information not elsewhere classified"],
        ],
      },
      { code: "038", title: "Inter-disciplinary programmes and qualifications involving social sciences, journalism and information", fields: [["0388", "Inter-disciplinary programmes and qualifications involving social sciences, journalism and information"]] },
      { code: "039", title: "Social sciences, journalism and information not elsewhere classified", fields: [["0399", "Social sciences, journalism and information not elsewhere classified"]] },
    ],
  },
  {
    code: "04",
    title: "Business, Administration and Law",
    chineseTitle: "商业、管理与法律",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "040", title: "Business, administration and law not further defined", fields: [["0400", "Business, administration and law not further defined"]] },
      {
        code: "041",
        title: "Business and administration",
        fields: [
          ["0410", "Business and administration not further defined"],
          ["0411", "Accounting and taxation"],
          ["0412", "Finance, banking and insurance"],
          ["0413", "Management and administration"],
          ["0414", "Marketing and advertising"],
          ["0415", "Secretarial and office work"],
          ["0416", "Wholesale and retail sales"],
          ["0417", "Work skills"],
          ["0419", "Business and administration not elsewhere classified"],
        ],
      },
      { code: "042", title: "Law", fields: [["0421", "Law"]] },
      { code: "048", title: "Inter-disciplinary programmes and qualifications involving business, administration and law", fields: [["0488", "Inter-disciplinary programmes and qualifications involving business, administration and law"]] },
      { code: "049", title: "Business, administration and law not elsewhere classified", fields: [["0499", "Business, administration and law not elsewhere classified"]] },
    ],
  },
  {
    code: "05",
    title: "Natural Sciences, Mathematics and Statistics",
    chineseTitle: "自然科学、数学与统计",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "050", title: "Natural sciences, mathematics and statistics not further defined", fields: [["0500", "Natural sciences, mathematics and statistics not further defined"]] },
      {
        code: "051",
        title: "Biological and related sciences",
        fields: [
          ["0510", "Biological and related sciences not further defined"],
          ["0511", "Biology"],
          ["0512", "Biochemistry"],
          ["0519", "Biological and related sciences not elsewhere classified"],
        ],
      },
      {
        code: "052",
        title: "Environment",
        fields: [
          ["0520", "Environment not further defined"],
          ["0521", "Environmental sciences"],
          ["0522", "Natural environments and wildlife"],
          ["0529", "Environment not elsewhere classified"],
        ],
      },
      {
        code: "053",
        title: "Physical sciences",
        fields: [
          ["0530", "Physical sciences not further defined"],
          ["0531", "Chemistry"],
          ["0532", "Earth sciences"],
          ["0533", "Physics"],
          ["0539", "Physical sciences not elsewhere classified"],
        ],
      },
      {
        code: "054",
        title: "Mathematics and statistics",
        fields: [
          ["0540", "Mathematics and statistics not further defined"],
          ["0541", "Mathematics"],
          ["0542", "Statistics"],
        ],
      },
      { code: "058", title: "Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics", fields: [["0588", "Inter-disciplinary programmes and qualifications involving natural sciences, mathematics and statistics"]] },
      { code: "059", title: "Natural sciences, mathematics and statistics not elsewhere classified", fields: [["0599", "Natural sciences, mathematics and statistics not elsewhere classified"]] },
    ],
  },
  {
    code: "06",
    title: "Information and Communication Technologies",
    chineseTitle: "信息与通信技术",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      {
        code: "061",
        title: "Information and Communication Technologies (ICTs)",
        fields: [
          ["0610", "Information and Communication Technologies (ICTs) not further defined"],
          ["0611", "Computer use"],
          ["0612", "Database and network design and administration"],
          ["0613", "Software and applications development and analysis"],
          ["0619", "Information and Communication Technologies (ICTs) not elsewhere classified"],
        ],
      },
      { code: "068", title: "Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs)", fields: [["0688", "Inter-disciplinary programmes and qualifications involving Information and Communication Technologies (ICTs)"]] },
    ],
  },
  {
    code: "07",
    title: "Engineering, Manufacturing and Construction",
    chineseTitle: "工程、制造与建筑",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "070", title: "Engineering, manufacturing and construction not further defined", fields: [["0700", "Engineering, manufacturing and construction not further defined"]] },
      {
        code: "071",
        title: "Engineering and engineering trades",
        fields: [
          ["0710", "Engineering and engineering trades not further defined"],
          ["0711", "Chemical engineering and processes"],
          ["0712", "Environmental protection technology"],
          ["0713", "Electricity and energy"],
          ["0714", "Electronics and automation"],
          ["0715", "Mechanics and metal trades"],
          ["0716", "Motor vehicles, ships and aircraft"],
          ["0719", "Engineering and engineering trades not elsewhere classified"],
        ],
      },
      {
        code: "072",
        title: "Manufacturing and processing",
        fields: [
          ["0720", "Manufacturing and processing not further defined"],
          ["0721", "Food processing"],
          ["0722", "Materials (glass, paper, plastic and wood)"],
          ["0723", "Textiles (clothes, footwear and leather)"],
          ["0724", "Mining and extraction"],
          ["0729", "Manufacturing and processing not elsewhere classified"],
        ],
      },
      {
        code: "073",
        title: "Architecture and construction",
        fields: [
          ["0730", "Architecture and construction not further defined"],
          ["0731", "Architecture and town planning"],
          ["0732", "Building and civil engineering"],
        ],
      },
      { code: "078", title: "Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction", fields: [["0788", "Inter-disciplinary programmes and qualifications involving engineering, manufacturing and construction"]] },
      { code: "079", title: "Engineering, manufacturing and construction not elsewhere classified", fields: [["0799", "Engineering, manufacturing and construction not elsewhere classified"]] },
    ],
  },
  {
    code: "08",
    title: "Agriculture, Forestry, Fisheries and Veterinary",
    chineseTitle: "农业、林业、渔业与兽医",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "080", title: "Agriculture, forestry, fisheries and veterinary not further defined", fields: [["0800", "Agriculture, forestry, fisheries and veterinary not further defined"]] },
      {
        code: "081",
        title: "Agriculture",
        fields: [
          ["0810", "Agriculture not further defined"],
          ["0811", "Crop and livestock production"],
          ["0812", "Horticulture"],
          ["0819", "Agriculture not elsewhere classified"],
        ],
      },
      { code: "082", title: "Forestry", fields: [["0821", "Forestry"]] },
      { code: "083", title: "Fisheries", fields: [["0831", "Fisheries"]] },
      { code: "084", title: "Veterinary", fields: [["0841", "Veterinary"]] },
      { code: "088", title: "Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary", fields: [["0888", "Inter-disciplinary programmes and qualifications involving agriculture, forestry, fisheries and veterinary"]] },
      { code: "089", title: "Agriculture, forestry, fisheries and veterinary not elsewhere classified", fields: [["0899", "Agriculture, forestry, fisheries and veterinary not elsewhere classified"]] },
    ],
  },
  {
    code: "09",
    title: "Health and Welfare",
    chineseTitle: "健康与福利",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "090", title: "Health and welfare not further defined", fields: [["0900", "Health and welfare not further defined"]] },
      {
        code: "091",
        title: "Health",
        fields: [
          ["0910", "Health not further defined"],
          ["0911", "Dental studies"],
          ["0912", "Medicine"],
          ["0913", "Nursing and midwifery"],
          ["0914", "Medical diagnostic and treatment technology"],
          ["0915", "Therapy and rehabilitation"],
          ["0916", "Pharmacy"],
          ["0917", "Traditional and complementary medicine and therapy"],
          ["0919", "Health not elsewhere classified"],
        ],
      },
      {
        code: "092",
        title: "Welfare",
        fields: [
          ["0920", "Welfare not further defined"],
          ["0921", "Care of the elderly and of disabled adults"],
          ["0922", "Child care and youth services"],
          ["0923", "Social work and counselling"],
          ["0929", "Welfare not elsewhere classified"],
        ],
      },
      { code: "098", title: "Inter-disciplinary programmes and qualifications involving health and welfare", fields: [["0988", "Inter-disciplinary programmes and qualifications involving health and welfare"]] },
      { code: "099", title: "Health and welfare not elsewhere classified", fields: [["0999", "Health and welfare not elsewhere classified"]] },
    ],
  },
  {
    code: "10",
    title: "Services",
    chineseTitle: "服务",
    status: "Draft",
    readiness: readiness.classified,
    groups: [
      { code: "100", title: "Services not further defined", fields: [["1000", "Services not further defined"]] },
      {
        code: "101",
        title: "Personal services",
        fields: [
          ["1010", "Personal services not further defined"],
          ["1011", "Domestic services"],
          ["1012", "Hair and beauty services"],
          ["1013", "Hotel, restaurants and catering"],
          ["1014", "Sports"],
          ["1015", "Travel, tourism and leisure"],
          ["1019", "Personal services not elsewhere classified"],
        ],
      },
      {
        code: "102",
        title: "Hygiene and occupational health services",
        fields: [
          ["1020", "Hygiene and occupational health services not further defined"],
          ["1021", "Community sanitation"],
          ["1022", "Occupational health and safety"],
          ["1029", "Hygiene and occupational health services not elsewhere classified"],
        ],
      },
      {
        code: "103",
        title: "Security services",
        fields: [
          ["1030", "Security services not further defined"],
          ["1031", "Military and defence"],
          ["1032", "Protection of persons and property"],
          ["1039", "Security services not elsewhere classified"],
        ],
      },
      { code: "104", title: "Transport services", fields: [["1041", "Transport services"]] },
      { code: "108", title: "Inter-disciplinary programmes and qualifications involving services", fields: [["1088", "Inter-disciplinary programmes and qualifications involving services"]] },
      { code: "109", title: "Services not elsewhere classified", fields: [["1099", "Services not elsewhere classified"]] },
    ],
  },
];

const modulePassports = {
  home: {
    name: "Home",
    route: "/",
    purpose: "Global entrance for MapKAI.",
    userValue: "Know what MapKAI is, what to do now, and why to return.",
    founderValue: "Keeps the front door simple while modules expand separately.",
    status: "Draft",
    relatedModules: "Map, Categories, Learning",
    nextAction: "Measure whether visitors click into Map, Categories, or Learning.",
    doNotTouch: "Do not add account, dashboard, community, or public PDC here.",
  },
  path: {
    name: "Foundation Learning Path",
    route: "/learning/foundation",
    purpose: "Connect a chosen field into a beginner-friendly learning order.",
    userValue: "Understand how to move from broad category to practical next steps.",
    founderValue: "Tests a simple learning path pattern without building an algorithm.",
    status: "Draft",
    relatedModules: "Map, Categories, Learning",
    nextAction: "Choose which category should receive the next detailed learning path.",
    doNotTouch: "Do not build a full question bank or recommendation engine here.",
  },
};

const field0412 = {
  code: "0412",
  title: "Finance, banking and insurance",
  chineseTitle: "金融、银行与保险",
  status: "Draft",
  readiness: readiness.pathReady,
  userLayer: [
    ["What is it?", "Finance is the study of money, risk, time, and trust. It explains saving, borrowing, investing, banking, insurance, and financial decisions."],
    ["Why it matters", "Almost every life and business decision has a money question inside it: price, risk, budget, loan, return, or protection."],
    ["Core topics", "Personal finance, corporate finance, banking, investment, insurance, risk, interest, credit, markets, and financial regulation."],
    ["Common real-life examples", "Choosing a savings account, understanding a mortgage, comparing insurance, judging a company budget, or asking whether an investment return is worth the risk."],
    ["What you can learn", "Read basic financial choices, explain risk and return, understand banking products, and connect finance to accounting, management, marketing, and law."],
    ["Related learning path", "Finance can connect to learning paths when a user chooses a business-related direction."],
  ],
  founderLayer: {
    officialDefinition: "Programmes and qualifications dealing with financial activities, banking, insurance, investment, and risk-related services.",
    inclusions: "Finance, banking, insurance, investment analysis, risk management, financial products.",
    exclusions: "Accounting and taxation should stay in 0411. General management should stay in 0413. Law-heavy regulation should connect to 0421.",
    relatedFields: "0411 Accounting and taxation; 0413 Management; 0414 Marketing; 0421 Law.",
    questionBankTags: "finance-basic, banking-basic, insurance-basic, risk-return, personal-finance, business-finance.",
    founderNotes: "Keep this page practical and life-connected. Advanced professional finance can wait until the green-land question layer.",
    nextAction: "Add a small set of beginner questions after the page structure is tested.",
  },
};

const pathTypes = [
  ["Systems expansion", "For explorers who over-index toward structure and optimization."],
  ["Ambiguity expansion", "Arts and humanities can train interpretation, meaning, and unresolved tension."],
  ["Human-context expansion", "Social and health domains reveal behavior, care, risk, and limits."],
  ["Reality-contact expansion", "Services, agriculture, and engineering pull thinking back into constraints."],
  ["Evidence expansion", "Science and statistics sharpen uncertainty without turning it into certainty."],
  ["Reflection expansion", "Return to Explore before choosing what to deepen next."],
];

const pathTypesZh = [
  ["系统扩展", "适合过度偏向结构、优化和框架的探索者。"],
  ["模糊性扩展", "艺术与人文训练解释、意义和未解决的张力。"],
  ["人类语境扩展", "社会与健康领域显现行为、照护、风险和边界。"],
  ["现实接触扩展", "服务、农业和工程把思考拉回约束现场。"],
  ["证据扩展", "科学与统计帮助你面对不确定性，而不是把它过早变成确定性。"],
  ["反思扩展", "先回到 Explore，再选择下一步深入方向。"],
];

const foundationPath = [
  ["1", "See the landscape", "Start by understanding the whole knowledge map before choosing one direction."],
  ["2", "Choose a category", "Pick the category that best matches the question, goal, or field you want to explore."],
  ["3", "Open detailed fields", "Look at the groups and detailed fields to understand what belongs inside the category."],
  ["4", "Follow a path", "Use a learning path to turn selected fields into a practical order."],
  ["5", "Review and expand", "Return to the map, mark what you understand, and choose the next field to explore."],
];

const foundationPathZh = [
  ["1", "看见全景", "先理解整张知识地图，再选择一个方向。"],
  ["2", "选择分类", "选择最接近你的问题、目标或领域的分类。"],
  ["3", "打开具体领域", "查看组和具体领域，理解它们属于哪里。"],
  ["4", "跟随路径", "用学习路径把选中的领域整理成实际顺序。"],
  ["5", "回顾并扩展", "回到地图，标记你理解的部分，再选择下一个领域。"],
];

const subjectQuestionSeeds = {
  "10": {
    "subject": "Services",
    "theme": "experience, safety, and coordination",
    "prompts": [
      "A tired hotel guest gets water, calm check-in, and clear directions. Why does it matter?",
      "Why put a warning sign on a wet but clean floor?",
      "A restaurant serves dessert before soup and guests eat at different times. What is the problem?",
      "Airport security slows because instructions appear only at the tray. What helps?",
      "A theme park sells too many fast-track passes and all lines slow. What went wrong?",
      "Drivers measured only by speed damage parcels and miss instructions. What is the mistake?",
      "A hotel removes its front desk phone number and replaces everything with automated forms. Operational costs drop, but frustrated guests leave negative reviews after unusual situations occur. What trade-off became visible?",
      "An airline tightly schedules aircraft turnaround times to maximize utilization. The system works smoothly until one small delay causes disruptions across many flights. What system property became visible?",
      "A restaurant trains staff to follow scripts exactly so service feels “consistent.” Later, customers describe interactions as cold and robotic. What may have been lost?",
      "A city adds more ride-sharing cars to improve convenience, but traffic congestion later becomes worse overall. What unintended effect may have appeared?",
      "An emergency response team practices rare disaster scenarios repeatedly, even though most days seem routine. Some outsiders see this as inefficient. Why might the training still matter?",
      "A theme park carefully controls music, scent, staff behavior, waiting lines, and lighting so visitors describe the experience as “magical.” What does this reveal about service design?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Service systems often perform well for predictable situations, but unusual human needs may require flexibility and judgment.",
      "Systems with very little slack may perform efficiently under normal conditions, but small disturbances can spread quickly through tightly connected operations.",
      "Consistency can improve predictability, but overly rigid service systems may reduce spontaneity, empathy, and natural interaction.",
      "Services that improve local convenience can still create larger collective effects when many people change behavior simultaneously.",
      "Resilient systems invest in low-frequency but high-impact situations, even when the value is invisible during normal operations.",
      "Service systems influence perception through accumulated details. Atmosphere, timing, environment, and interaction design can work together to shape emotion."
    ]
  },
  "00": {
    "subject": "Generic programmes and qualifications",
    "theme": "basic life skills",
    "prompts": [
      "At the supermarket, Emma compares cereal by price per kilo. What everyday superpower is she using?",
      "A friend learns apps, recipes, and cheaper bills but says he is not a learner. What is the hidden lesson?",
      "Jin writes a clear refund email for a broken washing machine. Why did writing matter?",
      "A calculator can split a bill, but why is understanding percentages still useful?",
      "Why can learning new tools fast be more valuable than knowing one tool today?",
      "Why are classes in forms, letters, and budgets still real education?",
      "You save articles, podcasts, and videos about many topics, but when someone asks what you learned, everything feels disconnected. What is the most useful next step?",
      "A friend says they want to become better at everything: money, health, communication, and technology. They start ten habits at once and quit after one week. What was probably missing?",
      "Someone watches a documentary about climate, reads a book about economics, and follows news about AI. They feel these topics are unrelated. What question would help them think more deeply?",
      "You keep switching between learning languages, coding, design, and finance. Each topic feels interesting, but none of them becomes usable. What is the likely issue?",
      "A parent wants their child to learn music, math, sports, and public speaking. The child becomes tired and loses curiosity. What is the better way to think about learning?",
      "A team creates a shared knowledge folder, but after a few months nobody can find anything. Files are saved by random names and old versions are mixed with new ones. What is the deeper problem?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "When knowledge is scattered, the problem is often not lack of information but lack of structure. Grouping ideas helps you see patterns, gaps, and useful connections.",
      "Trying to improve everything at once creates overload. A good learning path helps people choose what comes first, what depends on what, and where progress is actually possible.",
      "Broad knowledge becomes more powerful when people look for shared systems, such as resources, incentives, technology, behavior, and long-term consequences.",
      "Exploring many topics can be valuable, but knowledge becomes usable only when some ideas are practiced, connected, and deepened enough to apply.",
      "Learning is not only about adding more subjects. People need enough energy, feedback, and time to turn exposure into real understanding and confidence.",
      "A storage tool does not create knowledge organization by itself. Teams need shared naming, grouping, version habits, and a clear idea of how information should be retrieved."
    ]
  },
  "01": {
    "subject": "Education",
    "theme": "learning and teaching",
    "prompts": [
      "You forget someone's name seconds after hearing it. What trick helps most?",
      "A parent holds a bike seat, then lets go for longer and longer moments. What is happening?",
      "Sara rereads notes; Tom explains aloud from memory. Who finds weak spots faster?",
      "A language app reviews words right before forgetting. What is the learning trick?",
      "Why do weekly phishing simulations beat one long warning lecture?",
      "Why do examples and structure help beginners facing a blank page?",
      "A student gets high scores in practice exercises but struggles badly when problems are written differently in real situations. What may be missing from the learning process?",
      "A company sends employees to many training workshops, but daily work habits barely change afterward. Why can this happen?",
      "A person watches many educational videos at 2x speed and feels highly productive, but remembers little weeks later. What may be happening?",
      "A music student practices only pieces they already play comfortably because it feels rewarding. Improvement slows over time. What pattern may be emerging?",
      "A teacher gives students detailed instructions for every assignment. Students perform well during class, but struggle badly when working independently later. What dependency may have formed?",
      "Two employees attend the same leadership course. Months later, one changed behavior noticeably while the other returned to old habits. What difference may matter most?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "People can become good at recognizing repeated formats without building adaptable mental models that transfer across contexts.",
      "Learning does not happen in isolation. Even useful ideas may disappear if incentives, time pressure, or social norms push people back into old patterns.",
      "Learning is not only exposure. Memory and understanding often require slowing down enough to connect, retrieve, and integrate ideas.",
      "Activities that feel smooth and successful are not always the ones producing adaptation. Growth often requires controlled difficulty and error.",
      "Support systems can improve short-term performance while unintentionally reducing opportunities to practice self-direction and judgment.",
      "Long-term learning often depends less on exposure itself and more on repeated use, feedback, and reinforcement inside daily environments."
    ]
  },
  "02": {
    "subject": "Arts and Humanities",
    "theme": "meaning and interpretation",
    "prompts": [
      "A movie villain enters with cold lighting and low music. Why do you feel nervous?",
      "A cafe changes its menu font and cakes feel homemade. What changed?",
      "A tiny blue patch in an old painting used a once-costly pigment. What does that reveal?",
      "Two readers find different evidence-based meanings in one story. What is the best takeaway?",
      "A simple chair becomes interesting when linked to postwar housing. Why?",
      "A documentary uses real interviews but very different music and lighting. What should viewers notice?",
      "An old neighborhood becomes famous online for its “authentic atmosphere.” Cafes, photo spots, and boutique stores quickly appear. A few years later, longtime residents say the area no longer feels authentic. What most likely changed?",
      "A streaming platform notices viewers skip slow scenes, so writers begin removing quiet moments from new shows. The shows become easier to binge, but many viewers later describe them as “forgettable.” What may have been lost?",
      "A museum redesigns its exhibition labels to be shorter and easier to understand. Visitor numbers rise, but some historians criticize the change. What tension are they probably arguing about?",
      "A famous novel is adapted into a fast-paced movie. New audiences love it, but longtime readers say “the soul is missing.” What are they most likely reacting to?",
      "A city restores an old theater exactly as it looked 100 years ago, including uncomfortable seating and poor airflow. Some people praise the authenticity, others avoid going. What deeper question is hidden here?",
      "An artist intentionally leaves parts of a painting unfinished. Some viewers find it powerful, while others call it incomplete. Why can unfinished work sometimes feel meaningful?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Cultural identity is often produced by lived patterns, relationships, and ordinary routines. When places become optimized for attention, the original social fabric can weaken.",
      "Not every valuable experience maximizes short-term engagement. Slower moments can create tension, memory, atmosphere, and emotional depth.",
      "Cultural institutions often balance openness with complexity. Making ideas easier to enter can sometimes reduce nuance or layered context.",
      "Different media carry meaning differently. Some experiences depend less on plot and more on pacing, atmosphere, ambiguity, and inner perspective.",
      "Cultural preservation often involves trade-offs between historical fidelity, accessibility, comfort, and contemporary expectations.",
      "Not all artistic meaning comes from clarity. Open spaces, uncertainty, and incompleteness can create emotional involvement and multiple readings."
    ]
  },
  "03": {
    "subject": "Social Sciences, Journalism and Information",
    "theme": "people, groups, and information",
    "prompts": [
      "A free-coffee rumor spreads before anyone checks the cafe page. What should happen first?",
      "One person yawns and others soon yawn too. What does this show?",
      "A clickbait headline works even though the story is ordinary. Why?",
      "A sign says most people take stairs and stair use rises. Why might that work?",
      "Two polls ask about parks with different wording and get different results. What is happening?",
      "An algorithm shows more angry posts because they get comments. What risk appears?",
      "A platform notices that posts with outrage get shared faster than balanced explanations. Over time, creators begin sounding more extreme. What is most likely happening?",
      "A news clip goes viral because it looks shocking in isolation. Days later, the full video changes many people’s interpretation completely. What does this reveal?",
      "A company publishes a survey saying “90% of users are satisfied,” but the survey only included active paying customers. Critics say the result is misleading. Why?",
      "A person keeps seeing headlines about crimes in one city and begins believing the city is becoming extremely dangerous, even though long-term crime rates stayed mostly stable. What may explain this gap?",
      "An online community begins with open discussion, but over time members quietly stop expressing disagreement. The group still looks calm and united from the outside. What risk may be emerging?",
      "A journalist spends weeks verifying a complicated investigation, while a rumor account posts instantly and gains millions of views first. Why is this imbalance common?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "People often adapt to the incentives of visibility. When emotional intensity gains reach, communication styles can shift even without anyone explicitly planning it.",
      "Information rarely carries meaning alone. Sequence, framing, timing, and missing details can significantly alter how people interpret events.",
      "Who gets counted can matter as much as the numbers themselves. Sampling choices often shape the story statistics appear to tell.",
      "Events that are vivid, emotional, or repeatedly shown can feel more common than they statistically are.",
      "Groups can appear stable while silently narrowing acceptable opinions. Fear of conflict or exclusion may discourage honest disagreement.",
      "Verification usually requires uncertainty, evidence gathering, and nuance, while emotional certainty spreads quickly through attention systems."
    ]
  },
  "04": {
    "subject": "Business, Administration and Law",
    "theme": "markets, rules, and organizations",
    "prompts": [
      "A bakery bundle makes customers buy two croissants instead of one. What is happening?",
      "A shop sells a lot but costs eat the money. What was confused?",
      "A gym makes joining easy but cancellation hard. What concern appears?",
      "A great restaurant is empty because nobody knows it exists. What is the mistake?",
      "A vague delivery promise causes an argument. What would reduce risk?",
      "A call center rewards only short calls and problems return. What went wrong?",
      "A company keeps reducing customer support time per call. Efficiency reports improve, but more customers return with unresolved problems. What may the company be optimizing incorrectly?",
      "A startup grows rapidly by offering huge discounts. Investors celebrate the user numbers, but the company struggles once discounts shrink. What was probably misunderstood?",
      "A manager introduces many approval layers to reduce mistakes. Serious mistakes decrease slightly, but simple tasks become painfully slow. What trade-off is appearing?",
      "During salary negotiations, one employee focuses only on monthly pay, while another discusses flexibility, learning opportunities, and future role growth. Why might the second conversation create more room for agreement?",
      "A company says it values innovation, but employees notice failed experiments quietly damage promotion chances. Over time, fewer people suggest new ideas. What system effect is likely emerging?",
      "A company keeps adding dashboards so executives can “see everything,” but frontline teams spend more time updating systems than solving customer problems. What may be happening?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Organizations often optimize what is easiest to measure. When metrics become proxies for success, teams can improve numbers while worsening the underlying experience.",
      "Growth can come from subsidies, novelty, or pricing strategies that do not reflect stable long-term behavior.",
      "Control systems can improve consistency while also slowing flexibility, autonomy, and decision speed.",
      "Negotiations become more flexible when both sides discuss multiple priorities instead of treating value as a single number.",
      "People adapt not only to official values, but also to the consequences they observe inside the system.",
      "Information systems can create value, but they can also consume attention, time, and energy that once went into direct execution."
    ]
  },
  "05": {
    "subject": "Natural Sciences, Mathematics and Statistics",
    "theme": "evidence, measurement, and patterns",
    "prompts": [
      "A metal bench feels colder than a wooden one on the same morning. Why?",
      "A 70% rain forecast does not rain on your street. What is the better interpretation?",
      "A smoothie seems to cause energy, but the person also slept nine hours. What should a careful thinker say?",
      "A shop has a 5-star average from only two reviews. What is the red flag?",
      "Factory output rises after a new machine, but someone asks about the old machine too. Why?",
      "A city uses one road-side sensor to judge all pollution. What is wrong?",
      "A health article says “people who drink more coffee live longer.” Some readers immediately conclude coffee causes longer life. What important distinction may be missing?",
      "A weather app predicts a 30% chance of rain, and it rains lightly for ten minutes in one part of the city. Some users say the forecast was “wrong.” What misunderstanding may be involved?",
      "A company tests a new product feature on highly active users first, and results look extremely positive. Later, average users react much less enthusiastically. What may explain the difference?",
      "A city measures air quality using only sensors near parks, then announces pollution levels are improving everywhere. Critics remain skeptical. Why?",
      "A nutrition study with dramatic headlines later fails to replicate in larger studies. What is one reasonable explanation?",
      "A graph showing company growth starts the vertical axis at 95 instead of 0, making a small increase look dramatic. Why might this matter?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Patterns in data can emerge from hidden variables, lifestyle differences, or selection effects rather than direct cause-and-effect relationships.",
      "Scientific models often estimate likelihoods across complex systems rather than guaranteeing identical experiences everywhere.",
      "Results can look misleadingly strong when samples are biased toward unusually engaged or motivated participants.",
      "Scientific conclusions depend heavily on sampling design. Where data comes from influences what patterns become visible.",
      "Early results may appear stronger than they really are due to randomness, small samples, or publication incentives.",
      "Data presentation influences perception. Scale, cropping, and visual emphasis can change how large or important trends appear."
    ]
  },
  "06": {
    "subject": "Information and Communication Technologies",
    "theme": "digital systems and data",
    "prompts": [
      "Why are software updates not just annoying pop-ups?",
      "A friend uses one password everywhere. What is the risk?",
      "Sorting one spreadsheet column makes addresses mismatch names. What happened?",
      "A coffee machine pours only if it detects a cup. What coding idea is this?",
      "A delivery app has duplicate customer IDs and shows wrong orders. Why is this serious?",
      "Invoice automation copies old bad rules and approves strange invoices. What is the lesson?",
      "A company automates customer support with chatbots to reduce costs. Response times improve, but unusual customer problems become harder to solve. What trade-off is appearing?",
      "A person keeps clicking “accept all permissions” without reading because it saves time. Months later, many apps know detailed location and behavior patterns. What deeper issue appeared?",
      "A recommendation algorithm keeps showing users content similar to what they already engage with. Usage time increases, but discovery decreases. What system behavior is emerging?",
      "A team stores important company knowledge inside private chat messages because it feels faster than documenting properly. Months later, new employees struggle badly. What hidden cost appeared?",
      "A developer removes several security checks to make login faster. User experience improves briefly, but risk increases silently. What tension does this reflect?",
      "An AI writing tool helps employees produce reports much faster. Months later, managers notice fewer people can explain the reasoning behind the reports clearly. What concern may be emerging?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Automation often performs well for predictable tasks, but edge cases and ambiguous situations may still require human judgment.",
      "Small individual permissions can combine into extensive behavioral profiles over time.",
      "Systems designed to maximize interaction may gradually reduce diversity and novelty in what people encounter.",
      "Information systems shape organizational memory. Easy informal habits can create future retrieval and coordination problems.",
      "Convenience and protection are often balanced against each other. Systems optimized for speed may become more vulnerable.",
      "Tools can accelerate output while quietly changing how much reflection, synthesis, or reasoning people personally perform."
    ]
  },
  "07": {
    "subject": "Engineering, Manufacturing and Construction",
    "theme": "building and design trade-offs",
    "prompts": [
      "A cardboard tube holds weight upright but crushes sideways. What does this show?",
      "Why do bridges often use triangles?",
      "A hard phone case resists scratches but cracks when dropped. What trade-off appears?",
      "A chair factory divides work into repeated steps. Why might it be faster?",
      "A glass apartment looks beautiful but overheats in summer. What lesson appears?",
      "A machine part uses the strongest metal but becomes heavy and costly. What went wrong?",
      "A factory upgrades to faster machines and increases production speed, but maintenance problems suddenly appear much more often. What may have changed?",
      "A bridge designed for average daily traffic begins failing earlier than expected after years of unusually heavy truck use. What lesson does this highlight?",
      "A building renovation focuses heavily on beautiful materials, but workers later complain the spaces are difficult to clean and maintain. What trade-off may have been underestimated?",
      "A construction company finishes projects faster after reducing safety checks. Deadlines improve for several months, until one serious accident causes major delays. What system behavior appeared?",
      "An engineer simplifies a machine by reducing the number of moving parts. Reliability improves even though the machine becomes less customizable. Why can this happen?",
      "A city adds more traffic lanes to reduce congestion, but traffic becomes heavy again a few years later. What may explain this?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Engineering systems often balance throughput with resilience. Pushing closer to maximum capacity can reduce tolerance for wear, variation, and failure.",
      "Engineering performance depends not only on theoretical design, but also on how systems are actually used over time.",
      "Design choices influence not only appearance, but also long-term usability, maintenance cost, and operational workflow.",
      "Systems can appear more efficient temporarily while quietly accumulating vulnerability that only becomes visible later.",
      "Engineering design often balances flexibility with reliability. More complexity can create more interactions that require maintenance and synchronization.",
      "Infrastructure changes can influence behavior. When systems become easier to use, more people may begin using them."
    ]
  },
  "08": {
    "subject": "Agriculture, Forestry, Fisheries and Veterinary",
    "theme": "living resources and sustainability",
    "prompts": [
      "A tomato plant grows leaves but few tomatoes after lots of nitrogen. Why?",
      "Why wait before driving a tractor onto wet soil?",
      "Why can changing crops help when pests rise?",
      "Fishing boats catch more before others do and fish decline. What problem is this?",
      "Cows produce less milk during a heatwave despite feed. What hidden factor matters?",
      "Why might a forest manager remove some small trees?",
      "A farm plants only one highly productive crop across huge areas. Yields look excellent for years, but one disease later spreads rapidly through the entire system. What weakness became visible?",
      "A fishing area increases boat efficiency so much that fish are caught faster than populations can recover. What system problem is appearing?",
      "A city removes many insects using pesticides to improve public comfort. Later, nearby farms experience lower pollination and weaker harvests. What hidden connection became visible?",
      "A dog owner carefully selects premium food but rarely exercises the dog or provides stimulation. The dog later develops behavioral problems. What may have been overlooked?",
      "A forest area suppresses every small fire immediately for decades. Later, one massive wildfire becomes almost impossible to control. What long-term dynamic may have developed?",
      "A farming community switches to crops that earn more money internationally, but local food prices later become unstable. What trade-off may have emerged?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Biological systems often balance productivity with diversity. Uniform systems can become more vulnerable to shared risks.",
      "Natural systems often regenerate at limited speeds. When harvesting capacity grows faster than recovery, long-term stability can weaken.",
      "Changes in one part of a living system can create indirect effects elsewhere because species and environments are deeply connected.",
      "Living systems are shaped by interaction between nutrition, movement, environment, stimulation, and social experience.",
      "Some systems release pressure gradually through smaller disruptions. Removing all variation can sometimes increase catastrophic vulnerability later.",
      "Economic efficiency and local stability do not always move together. Systems optimized for external markets can become more exposed to outside shocks."
    ]
  },
  "09": {
    "subject": "Health and Welfare",
    "theme": "prevention, care, and wellbeing",
    "prompts": [
      "A friend brushes teeth hard and gums bleed. What is the better habit?",
      "Someone drinks coffee at midnight and wakes tired. What might be happening?",
      "A new runner goes hard daily, hurts knees, and quits. What would have been wiser?",
      "One mildly sick worker comes in and half the office coughs later. What idea appears?",
      "A patient feels better after antibiotics and wants to stop early. What is the concern?",
      "An elderly man misses appointments because the bus route changed. What does this reveal?",
      "A person starts sleeping less to become “more productive.” At first, extra work gets done, but months later concentration, mood, and decision quality decline. What may have been underestimated?",
      "A hospital optimizes schedules so tightly that staff have almost no buffer time between patients. Efficiency improves, but burnout rises sharply. What tension may have been ignored?",
      "A fitness app encourages people to close activity rings every day. Some users become healthier, while others start exercising despite injury or exhaustion. What does this show?",
      "A city invests heavily in emergency treatment but little in prevention programs like exercise access and healthy food environments. Healthcare costs continue rising. What may be happening?",
      "A person constantly checks health data from smart devices and becomes more anxious over small fluctuations. What dynamic may be appearing?",
      "A community creates support groups where people regularly share struggles openly. Participants later report feeling less isolated even though many practical problems remain unsolved. Why can this happen?"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "Health systems often rely on balance. Short-term gains from pushing harder can quietly reduce long-term cognitive and emotional performance.",
      "Systems involving people often require emotional and operational margin. Maximizing utilization can reduce long-term sustainability.",
      "Behavioral systems interact differently with different people. Metrics and incentives can encourage healthy consistency or unhealthy over-optimization.",
      "Health outcomes are often shaped by long-term environmental and behavioral patterns, not only by acute interventions.",
      "Data can support awareness, but excessive monitoring may also amplify uncertainty, stress, and attention toward normal variation.",
      "Wellbeing is influenced not only by external conditions, but also by belonging, emotional validation, and perceived social support."
    ]
  }
};

const questionOptions = {
  "10": [
    [
      "Service experience is shaped by small moments of care",
      "Only the room size matters in hospitality",
      "Guests never remember how they are treated"
    ],
    [
      "A clean floor can still be a safety risk when wet",
      "Signs are only for decoration",
      "Wet floors become safer when ignored"
    ],
    [
      "Coordination and timing are part of service quality",
      "Good taste cancels every service issue",
      "Customers prefer chaos when food is expensive"
    ],
    [
      "Give clear preparation instructions before the bottleneck",
      "Make the trays smaller",
      "Hide the rules until the last second"
    ],
    [
      "The service added priority access without managing total capacity",
      "Fast-track passes create unlimited ride capacity",
      "Lines disappear when prices increase"
    ],
    [
      "The metric rewards speed while ignoring service quality and safety",
      "Customers dislike receiving parcels quickly",
      "Drivers cannot follow any measurement system"
    ],
    [
      "Standardization improved efficiency while weakening exception handling",
      "Guests mainly prefer talking to humans because of habit",
      "Automation only works in technology companies"
    ],
    [
      "Highly optimized systems can become more sensitive to disruption",
      "Air travel mainly fails because passengers arrive late",
      "Efficiency and reliability always increase together"
    ],
    [
      "Human adaptability and authentic social response",
      "The ability to deliver food quickly",
      "Customer expectations for professionalism"
    ],
    [
      "Individual convenience increased total system load",
      "Ride-sharing mainly fails because drivers are inefficient",
      "Traffic problems disappear only with fully autonomous vehicles"
    ],
    [
      "Preparedness is often judged by failures that never happen",
      "Emergency systems mainly exist for public reassurance",
      "Rare events are usually impossible to prepare for anyway"
    ],
    [
      "Experiences are often shaped by many small coordinated signals",
      "People mainly judge services based on ticket price",
      "Entertainment quality depends mostly on architecture alone"
    ]
  ],
  "00": [
    [
      "Basic numeracy for smarter daily choices",
      "Professional accounting knowledge",
      "Brand loyalty"
    ],
    [
      "Everyday life already contains learning",
      "People learn only in classrooms",
      "Learning stops after school"
    ],
    [
      "Clear communication can turn frustration into action",
      "Longer messages always get better results",
      "Emotional anger is the best strategy"
    ],
    [
      "Understanding helps you know what to calculate",
      "Calculators replace understanding",
      "Percentages are only useful for bankers"
    ],
    [
      "Because adaptability often outlasts one specific tool",
      "Because software skills are worthless",
      "Because interviews reward vague answers"
    ],
    [
      "Foundational skills can increase independence and participation",
      "Only university courses count as learning",
      "Adults cannot benefit from basic courses"
    ],
    [
      "Group the ideas into a simple knowledge map",
      "Collect even more materials before thinking",
      "Delete everything and start from zero"
    ],
    [
      "A learning path with priorities",
      "A stronger motivational quote",
      "More apps to track progress"
    ],
    [
      "What hidden systems connect these topics?",
      "Which topic is the most fashionable?",
      "Which one can be ignored first?"
    ],
    [
      "You are sampling knowledge without building depth",
      "You chose topics that are too practical",
      "You need to learn only one topic forever"
    ],
    [
      "Balance exposure, energy, and meaningful progress",
      "Add more classes before motivation drops",
      "Focus only on activities that look impressive"
    ],
    [
      "There is no shared classification habit",
      "The folder needs a more colorful icon",
      "People should stop saving documents"
    ]
  ],
  "01": [
    [
      "Repeat and use the name soon after hearing it",
      "Pretend you heard it clearly",
      "Wait until tomorrow to think about it"
    ],
    [
      "Giving temporary support until independence grows",
      "Testing the child without any help",
      "Making the bike harder to ride"
    ],
    [
      "Tom, because recall exposes weak spots",
      "Sara, because highlighting always proves mastery",
      "Neither, because studying cannot be checked"
    ],
    [
      "Spaced repetition strengthens memory over time",
      "Forgetting means learning has failed completely",
      "Cramming once is always more efficient"
    ],
    [
      "It turns abstract warnings into repeated real decisions",
      "It proves employees do not need rules",
      "It makes cybersecurity purely entertaining"
    ],
    [
      "The task became supported enough to reduce mental overload",
      "Creativity disappeared because examples were shown",
      "Beginners became experts instantly"
    ],
    [
      "The knowledge was optimized for familiar patterns rather than flexible transfer",
      "Practice questions are usually harder than real-world problems",
      "Real situations mainly depend on confidence instead of skill"
    ],
    [
      "The surrounding work system may reward old behavior more than new behavior",
      "Adults usually stop learning after entering the workforce",
      "Training mainly improves motivation rather than skill"
    ],
    [
      "Information consumption is outpacing consolidation and reflection",
      "Fast playback automatically weakens intelligence",
      "Educational content mainly works through repetition alone"
    ],
    [
      "The learner is optimizing for fluency instead of growth",
      "Comfortable practice naturally reduces talent",
      "Advanced skills mainly require longer repetition"
    ],
    [
      "External structure replaced internal decision-making",
      "Independent work mainly depends on personality",
      "Clear instruction naturally weakens intelligence"
    ],
    [
      "One person may have repeatedly applied the ideas in real situations",
      "Leadership courses mainly work for naturally confident people",
      "Behavior change depends mostly on remembering terminology"
    ]
  ],
  "02": [
    [
      "The scene uses artistic signals to shape emotion",
      "The actor has explained the plot",
      "The camera is broken"
    ],
    [
      "The visual style changed the meaning people felt",
      "The cake recipe changed automatically",
      "Fonts cannot influence perception"
    ],
    [
      "Materials can carry social and historical meaning",
      "Old painters chose colors randomly",
      "Blue was invisible in the past"
    ],
    [
      "Good stories can hold multiple evidence-based meanings",
      "Only one reader is allowed to be right",
      "Interpretation means guessing without evidence"
    ],
    [
      "Its design connects to history, society, and human needs",
      "A chair can never be cultural",
      "The label makes the object more expensive"
    ],
    [
      "Real material can still be framed through storytelling choices",
      "Documentaries are automatically neutral",
      "Music has no effect on judgment"
    ],
    [
      "The neighborhood lost some of the everyday life that originally created its identity",
      "Tourism always destroys all cultural value immediately",
      "People only dislike change when prices increase"
    ],
    [
      "Emotional pacing and reflection that gave scenes lasting weight",
      "The technical ability to produce high-resolution video",
      "The legal freedom to write long conversations"
    ],
    [
      "Accessibility versus depth of interpretation",
      "Whether museums should allow visitors to read at all",
      "Whether history becomes inaccurate when simplified once"
    ],
    [
      "The loss of internal reflection and slower emotional development",
      "The movie using modern cameras instead of older ones",
      "The actors speaking more clearly than in the book"
    ],
    [
      "How much preservation should outweigh present-day usability",
      "Whether old buildings should legally remain unchanged forever",
      "Whether comfort reduces artistic appreciation automatically"
    ],
    [
      "Ambiguity can invite viewers to participate in interpretation",
      "People usually prefer art that looks accidental",
      "Incomplete work reduces the need for artistic skill"
    ]
  ],
  "03": [
    [
      "Check the original source before believing it",
      "Share it quickly before the offer ends",
      "Believe it if many people repeat it"
    ],
    [
      "Social behavior can spread through groups",
      "People are never influenced by others",
      "Yawning is a political opinion"
    ],
    [
      "It used curiosity to attract attention",
      "It gave a complete balanced summary",
      "It removed emotion from the story"
    ],
    [
      "People often respond to social norms",
      "People dislike short messages",
      "Signs physically force people to act"
    ],
    [
      "Question wording can shape public opinion data",
      "People have no opinions about parks",
      "Polls always measure reality perfectly"
    ],
    [
      "The platform may amplify outrage because it drives engagement",
      "The platform will automatically improve public debate",
      "Angry posts will disappear because people ignore them"
    ],
    [
      "The platform’s attention system is quietly shaping behavior",
      "People become irrational whenever technology appears",
      "Extreme opinions are always more truthful than moderate ones"
    ],
    [
      "Context can strongly influence social judgment",
      "Short clips are always intentionally deceptive",
      "People should avoid emotional reactions entirely"
    ],
    [
      "The sample may exclude people who already left dissatisfied",
      "Customer satisfaction can never be measured reliably",
      "Large percentages automatically create public distrust"
    ],
    [
      "Frequent visibility can distort perception of frequency",
      "Crime statistics usually hide all meaningful reality",
      "Cities become dangerous whenever media coverage increases"
    ],
    [
      "Social pressure may be reducing viewpoint diversity",
      "Agreement always proves a community is healthy",
      "People naturally stop having opinions in large groups"
    ],
    [
      "Fast emotional content often scales more easily than careful verification",
      "Professional journalism mainly exists to slow information down",
      "People secretly prefer false information when given a choice"
    ]
  ],
  "04": [
    [
      "A bundle changes the perceived deal",
      "The croissants became legally different",
      "Customers forgot how hunger works"
    ],
    [
      "Revenue is not the same as profit",
      "Profit appears before costs",
      "Sales make expenses disappear"
    ],
    [
      "The company may be using friction to keep customers",
      "The company is improving customer freedom",
      "The contract becomes invisible"
    ],
    [
      "Quality alone does not create awareness",
      "Good products should be kept secret",
      "Marketing only matters for bad products"
    ],
    [
      "A clear written agreement on delivery terms",
      "More emojis in the phone call",
      "Avoiding any record of the deal"
    ],
    [
      "The incentive encouraged the wrong behavior",
      "Employees became less human overnight",
      "Customers dislike fast answers in every case"
    ],
    [
      "A visible metric instead of the real customer outcome",
      "Employee friendliness instead of company profit",
      "Long-term contracts instead of short conversations"
    ],
    [
      "Temporary incentives were mistaken for durable demand",
      "Fast growth is always financially dangerous",
      "Customers naturally dislike profitable businesses"
    ],
    [
      "Risk reduction is increasing coordination cost",
      "Employees are becoming less intelligent over time",
      "Organizations work best without any rules"
    ],
    [
      "More dimensions create more possible trade-offs",
      "Employers dislike discussing money directly",
      "Career growth automatically replaces salary needs"
    ],
    [
      "The organization is rewarding caution more than experimentation",
      "Innovation mainly depends on office decoration",
      "Employees naturally stop being creative in large companies"
    ],
    [
      "Visibility systems are beginning to compete with operational work",
      "Digital reporting always improves coordination",
      "Customer problems disappear when data increases"
    ]
  ],
  "05": [
    [
      "Metal pulls heat from your body faster",
      "Metal is always at a lower temperature",
      "Wood secretly produces warmth"
    ],
    [
      "Probability describes uncertainty, not a personal guarantee",
      "The app promised rain on every person",
      "A 70% chance means rain must last 70% of the day"
    ],
    [
      "One experience does not prove cause and effect",
      "The smoothie must be magic",
      "Sleep can never affect energy"
    ],
    [
      "The sample size is too small to trust much",
      "Five stars is mathematically impossible",
      "Averages never describe ratings"
    ],
    [
      "A comparison group helps separate the machine effect from other changes",
      "Scientists dislike useful machines",
      "Output numbers are always fake"
    ],
    [
      "One location may not represent the whole city",
      "Sensors cannot measure air",
      "Busy roads always represent parks"
    ],
    [
      "Correlation does not automatically prove causation",
      "Coffee studies are always scientifically invalid",
      "Long life mainly depends on beverage choice"
    ],
    [
      "Probabilistic predictions describe uncertainty, not certainty for every person",
      "Weather systems should always predict exact street-level outcomes",
      "Rain forecasts mainly exist for emotional reassurance"
    ],
    [
      "Early test groups may not represent the broader population",
      "Average users naturally dislike innovation",
      "Statistics become unreliable whenever products succeed"
    ],
    [
      "Measurement location can shape the conclusion being reported",
      "Parks always produce misleading environmental data",
      "Air quality cannot be measured reliably in cities"
    ],
    [
      "Small early studies can exaggerate unstable patterns",
      "Large studies are usually less scientific than small ones",
      "Replication mainly matters in physics, not health"
    ],
    [
      "Visual framing can strongly affect interpretation of data",
      "Graphs become scientifically invalid unless all axes start at zero",
      "People should avoid charts whenever numbers are emotional"
    ]
  ],
  "06": [
    [
      "They can fix security holes and software problems",
      "They only change the wallpaper",
      "They make hackers more comfortable"
    ],
    [
      "One stolen password can unlock many accounts",
      "Passwords become heavier when reused",
      "Websites refuse all repeated letters"
    ],
    [
      "Only one column was sorted instead of the whole table",
      "The spreadsheet became sentient",
      "Alphabetical order destroys all data"
    ],
    [
      "A condition-based instruction",
      "A random painting technique",
      "A broken database"
    ],
    [
      "Bad data structure can break the system’s logic",
      "Databases are only decoration",
      "Duplicate IDs make delivery faster"
    ],
    [
      "Automation can scale both good rules and bad rules",
      "Automation removes the need for human judgment forever",
      "Old processes become perfect once digitized"
    ],
    [
      "Efficiency is increasing while flexibility is decreasing",
      "Automation only works in manufacturing industries",
      "Customers naturally dislike digital systems"
    ],
    [
      "Convenience decisions accumulated into large data exposure",
      "Location tracking only matters for celebrities",
      "Apps become harmless once many people use them"
    ],
    [
      "Optimization for engagement is narrowing exploration",
      "Algorithms become more objective with repetition",
      "Users stop having curiosity after long internet use"
    ],
    [
      "Short-term convenience weakened long-term knowledge accessibility",
      "Private communication is always inefficient",
      "New employees mainly fail because they ask too many questions"
    ],
    [
      "Reducing friction can sometimes reduce resilience",
      "Security systems mainly exist to annoy users",
      "Fast software eventually becomes secure automatically"
    ],
    [
      "Task completion may be scaling faster than deep understanding",
      "AI tools automatically remove human intelligence",
      "Written reports are becoming unnecessary in organizations"
    ]
  ],
  "07": [
    [
      "Shape and direction affect strength",
      "Cardboard secretly turns into steel",
      "Heavy books become lighter when vertical"
    ],
    [
      "Triangles help keep structures stable under force",
      "Triangles are legally required on bridges",
      "Rectangles cannot be drawn by engineers"
    ],
    [
      "Hardness and toughness are not the same thing",
      "Soft materials always fail",
      "Scratches are more dangerous than drops"
    ],
    [
      "Specialized steps can reduce switching and improve flow",
      "More workers automatically fix all problems",
      "Dividing work makes quality irrelevant"
    ],
    [
      "Design must consider heat, light, and real operating conditions",
      "Beautiful buildings cannot follow physics",
      "Glass always makes buildings cooler"
    ],
    [
      "The design optimized one feature while ignoring system trade-offs",
      "Strong materials are never useful",
      "Repairability has no business value"
    ],
    [
      "The system gained efficiency while losing operational margin",
      "Modern machines are naturally less reliable than older ones",
      "Maintenance teams usually dislike automation projects"
    ],
    [
      "Real-world usage patterns can matter more than ideal design assumptions",
      "Bridges mainly fail because of visual aging",
      "Heavy vehicles should never use shared infrastructure"
    ],
    [
      "Aesthetic decisions can increase operational complexity",
      "Maintenance teams usually resist architectural innovation",
      "Beautiful materials automatically reduce durability"
    ],
    [
      "Short-term optimization increased hidden long-term risk",
      "Safety procedures mainly exist for legal image reasons",
      "Fast construction naturally leads to isolated accidents"
    ],
    [
      "Simpler systems often reduce coordination and failure points",
      "Customization usually damages all engineering quality",
      "Mechanical systems work best when minimal functionality exists"
    ],
    [
      "Increasing capacity can sometimes increase demand for usage",
      "Road construction mainly changes driver emotions",
      "Traffic problems disappear only in very small cities"
    ]
  ],
  "08": [
    [
      "Too much leaf growth can come at the cost of fruit",
      "Nitrogen makes plants forget summer",
      "Tomatoes grow only in tiny pots"
    ],
    [
      "Wet soil can be compacted and damage roots later",
      "Tractors dissolve in wet weather",
      "Rain makes seeds allergic to sunlight"
    ],
    [
      "Crop rotation can interrupt pests and support soil balance",
      "Plants become bored by familiar fields",
      "Different crops cancel the seasons"
    ],
    [
      "Shared resources can be overused when everyone acts alone",
      "Fish dislike teamwork meetings",
      "More boats always create more fish"
    ],
    [
      "Heat stress can reduce animal productivity and welfare",
      "Cows stop needing water in summer",
      "Milk production depends only on feed quantity"
    ],
    [
      "Thinning can reduce competition and improve forest health",
      "Forests grow best when every tree is crowded",
      "Small trees are never useful to ecosystems"
    ],
    [
      "Efficiency gained through uniformity reduced resilience",
      "Large farms are naturally impossible to protect",
      "Plant diseases mainly spread because of weather forecasts"
    ],
    [
      "Technology improved extraction faster than regeneration",
      "Fish populations mainly depend on tourism levels",
      "Efficient equipment automatically reduces sustainability"
    ],
    [
      "Ecological systems contain interdependent relationships",
      "Insects mainly exist to damage agriculture",
      "Urban policies rarely affect surrounding environments"
    ],
    [
      "Animal wellbeing depends on systems of care, not single factors",
      "Premium nutrition usually increases aggression",
      "Behavior problems mainly come from genetics alone"
    ],
    [
      "Preventing small disturbances allowed larger risks to accumulate",
      "Forests naturally become unstable without tourism",
      "Large fires mainly happen because firefighters respond too slowly"
    ],
    [
      "Global market optimization may reduce local resilience",
      "Export crops are always environmentally harmful",
      "Local agriculture mainly fails because of tradition"
    ]
  ],
  "09": [
    [
      "Brush gently and regularly with proper technique",
      "Brush harder until the gums become stronger",
      "Skip brushing when gums bleed"
    ],
    [
      "Caffeine may reduce sleep quality even if you fall asleep",
      "Coffee becomes water after midnight",
      "Feeling tired proves sleep was perfect"
    ],
    [
      "Build up gradually and allow recovery",
      "Start with the hardest routine possible",
      "Ignore pain because motivation fixes injuries"
    ],
    [
      "Individual choices can create group-level health effects",
      "Illness only matters when symptoms are dramatic",
      "Offices protect people from viruses automatically"
    ],
    [
      "Stopping early can leave bacteria behind and contribute to resistance",
      "Feeling better means every bacterium is gone",
      "Antibiotics work better when taken randomly"
    ],
    [
      "Health is shaped by social and practical conditions",
      "Medical care depends only on willpower",
      "Appointments are unrelated to transport"
    ],
    [
      "Human performance depends on recovery, not only output time",
      "Productivity mainly depends on motivation",
      "Sleep problems only affect physical energy"
    ],
    [
      "Human care systems need resilience, not only throughput",
      "Medical workers naturally dislike organized schedules",
      "Burnout mainly comes from insufficient technology"
    ],
    [
      "The same motivational system can support or distort behavior depending on context",
      "Health tracking technology usually causes addiction",
      "Daily exercise goals should never exist"
    ],
    [
      "The system is treating consequences more than underlying drivers",
      "Prevention programs mainly improve public image",
      "Emergency care naturally increases illness rates"
    ],
    [
      "More information can sometimes increase hyper-focus instead of reassurance",
      "Health devices mainly create false measurements",
      "Anxiety disappears when people stop measuring things"
    ],
    [
      "Social connection itself can change how stress is experienced",
      "Talking about problems automatically solves them",
      "Support groups mainly work by giving professional medical treatment"
    ]
  ]
};

const zhSubjectQuestionSeeds = {
  "10": {
    "prompts": [
      "疲惫的酒店客人拿到水、平静入住和清楚指引。为什么这重要？",
      "地板很干净但湿了，为什么还要放警示牌？",
      "餐厅先上甜点再上汤，客人吃饭时间乱了。问题是什么？",
      "机场安检到托盘前才显示规则，队伍变慢。什么能帮忙？",
      "主题公园卖了太多快速通行票，所有队伍都变慢。哪里错了？",
      "司机只按速度考核，结果包裹受损、说明被忽略。问题是什么？",
      "一家酒店取消前台电话，把所有服务改成自动表单。运营成本下降了，但遇到特殊情况的客人开始大量差评。这里暴露了什么取舍？",
      "一家航空公司把飞机周转时间压得非常紧，以提高利用率。平时运行顺畅，但一次小延误却连锁影响了很多航班。这里暴露了什么系统特性？",
      "一家餐厅要求员工严格按固定话术服务，希望体验“更统一”。后来顾客却开始觉得服务很机械。这里最可能失去了什么？",
      "一个城市增加了大量网约车，希望提升出行便利，但整体交通后来反而更堵。这里最可能出现了什么意外效应？",
      "一个应急团队不断演练很少发生的灾难场景，外人觉得“平时根本用不上”。为什么这种训练依然重要？",
      "一个主题乐园会精细控制音乐、气味、员工行为、排队动线和灯光，因此游客觉得“像进入另一个世界”。这说明了什么？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "服务系统通常很擅长处理标准场景，但面对特殊需求时，往往仍需要灵活判断与人类协调。",
      "当系统几乎没有缓冲空间时，平时看起来很高效，但小波动也可能迅速扩散成大范围问题。",
      "标准化能提高一致性，但过度 rigid 的服务系统，也可能削弱真实感、同理心与自然交流。",
      "某些服务会让个体体验更方便，但当很多人同时改变行为时，也可能给整体系统带来额外压力。",
      "有韧性的系统会为低频但高影响事件投入资源，即使这些价值在日常运行时并不明显。",
      "服务系统会通过很多细节共同影响感知。氛围、节奏、环境与互动设计，会一起塑造人的情绪体验。"
    ]
  },
  "00": {
    "prompts": [
      "在超市里，Emma 按每公斤价格比较麦片。她用到的日常能力是什么？",
      "朋友学会了用 App、看菜谱、省账单，却说自己没有在学习。这里藏着什么？",
      "Jin 给坏掉的洗衣机写了一封清楚的退款邮件。为什么写清楚很重要？",
      "计算器可以帮你分账，为什么理解百分比仍然有用？",
      "为什么快速学会新工具，有时比只会一个工具更重要？",
      "为什么表格、信件和预算这类基础课，也是真正的教育？",
      "你收藏了很多文章、播客和视频，主题也很多，但别人问你学到了什么时，你觉得内容都很零散。最有用的下一步是什么？",
      "一个朋友说自己想全面提升：理财、健康、沟通、技术都想学。他同时开始十个习惯，一周后全放弃了。最可能缺少的是什么？",
      "一个人看了气候纪录片、读了经济学书，又关注 AI 新闻。他觉得这些主题彼此无关。哪个问题能帮助他想得更深入？",
      "你不断在语言、编程、设计和理财之间切换。每个主题都很有趣，但最后都没有真正用起来。最可能的问题是什么？",
      "一位家长希望孩子同时学音乐、数学、运动和演讲。孩子越来越累，也慢慢失去好奇心。更好的学习思路是什么？",
      "一个团队建了共享知识文件夹，但几个月后谁也找不到东西。文件名很随意，新旧版本混在一起。更深层的问题是什么？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "知识零散时，问题常常不是信息不够，而是缺少结构。把想法分组，能帮助你看见规律、空白和有用的连接。",
      "同时改进所有事情，很容易造成负担。好的学习路径会帮助人判断什么先学、什么依赖什么，以及哪里最容易产生真实进步。",
      "广泛知识真正有价值时，往往不是因为内容多，而是能看到背后的共同系统，比如资源、激励、技术、行为和长期影响。",
      "探索多个主题本身有价值，但知识要变得可用，需要有一些内容被练习、连接，并深入到可以实际应用的程度。",
      "学习不是简单地增加科目。人需要精力、反馈和时间，才能把接触过的内容变成真正的理解和信心。",
      "存储工具本身不会自动形成知识组织。团队需要共同的命名、分组、版本管理习惯，以及清楚的信息检索方式。"
    ]
  },
  "01": {
    "prompts": [
      "刚听完别人的名字几秒就忘了。什么方法最有帮助？",
      "家长先扶着自行车座，再慢慢放手更久。这是在做什么？",
      "Sara 反复看笔记；Tom 合上笔记讲给自己听。谁更快发现薄弱点？",
      "语言 App 会在你快忘之前复习单词。它用了什么学习方法？",
      "为什么每周一次钓鱼邮件模拟，比一场很长的安全讲座更有效？",
      "新手面对空白页面时，为什么例子和结构会帮上忙？",
      "一个学生刷题成绩很好，但现实场景稍微换个表达方式就不会了。学习过程中最可能缺少了什么？",
      "公司不断安排培训课程，但员工回到工作中后习惯几乎没变化。为什么会这样？",
      "一个人总用 2 倍速看大量知识视频，当下感觉“学了很多”，但几周后几乎记不住。最可能发生了什么？",
      "一个学音乐的人总练自己已经很熟的曲子，因为这样“很有成就感”，结果进步越来越慢。这里可能出现了什么模式？",
      "老师为每项作业都提供非常详细的步骤指导，学生课堂表现很好，但后来独立完成任务时却很困难。这里可能形成了什么依赖？",
      "两个人参加了同一个领导力课程，几个月后，一个人的行为明显改变，另一个却回到了老习惯。最关键的差别可能是什么？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "人可能会越来越擅长识别固定格式，却没有真正建立能跨情境迁移的认知模型。",
      "学习并不是孤立发生的。即使新方法有价值，如果激励、时间压力或团队习惯仍偏向旧方式，人也会回到原本模式。",
      "学习不只是接触信息。记忆与理解通常需要时间进行连接、提取与整合。",
      "让人感觉顺畅的练习，不一定最能带来适应和提升。真正成长通常伴随适度困难与错误。",
      "支持系统能提高短期表现，但也可能减少人练习自主判断与自我组织的机会。",
      "长期学习往往不只取决于“是否听过”，更取决于是否在日常环境里持续实践、获得反馈并不断强化。"
    ]
  },
  "02": {
    "prompts": [
      "电影反派出场时，冷色灯光和低沉音乐让你紧张。为什么？",
      "咖啡馆换了菜单字体，蛋糕忽然显得更像手作。改变了什么？",
      "一幅古画里一小块蓝色用了当年很贵的颜料。这说明什么？",
      "两位读者从同一个故事里读出不同但有证据的意思。最好怎么看？",
      "一把普通椅子和战后住房联系起来后，为什么变得有意思？",
      "纪录片用了真实采访，却配了不同音乐和灯光。观众应该注意什么？",
      "一个老街区因为“很有本地生活感”在网上走红，随后咖啡馆、拍照店和精品店大量出现。几年后，老居民却说这里“不像以前了”。最可能改变了什么？",
      "流媒体平台发现观众会跳过慢节奏片段，于是编剧开始减少安静场景。剧变得更容易“刷完”，但很多人后来觉得“看完就忘”。最可能失去了什么？",
      "一个博物馆把展品说明改得更短、更容易读懂，参观人数上升了，但一些历史学者却不满意。他们最可能在争论什么？",
      "一部经典小说被改编成节奏很快的电影，新观众很喜欢，但老读者却说“灵魂没了”。他们最可能在失落什么？",
      "一个城市把老剧院完全恢复成 100 年前的样子，包括不舒服的座位和很差的通风。有人称赞“原汁原味”，也有人因此不再去。这里隐藏的更深问题是什么？",
      "一个艺术家故意让画的一部分保持“未完成”状态。有人觉得很有力量，也有人觉得只是没画完。为什么“不完整”有时反而会有意义？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "文化感往往来自真实生活关系与长期形成的日常模式。当一个地方开始被“为关注而优化”时，原本的社会纹理可能会慢慢消失。",
      "并不是所有有价值的体验都应该最大化短期互动。缓慢片段有时会创造张力、氛围、记忆与情绪深度。",
      "文化机构常常需要在“更容易接近”与“保留复杂性”之间平衡。降低门槛有时也可能减少细节与层次。",
      "不同媒介承载意义的方式不同。有些作品真正重要的并不是情节本身，而是节奏、氛围、模糊感与内在视角。",
      "文化保留往往涉及历史真实性、可进入性、舒适度与现代需求之间的复杂取舍。",
      "艺术的意义不一定来自绝对清晰。留白、不确定感和开放空间，有时会让观众产生更深的情绪参与和多重解读。"
    ]
  },
  "03": {
    "prompts": [
      "免费咖啡的传言还没人核实就传开了。第一步应该做什么？",
      "一个人打哈欠，旁边的人也跟着打哈欠。这说明什么？",
      "一个标题很吸引人，但内容很普通。它为什么有效？",
      "告示说多数人会走楼梯，后来走楼梯的人变多了。为什么可能有效？",
      "两个关于公园的调查，只是问法不同，结果就不同。发生了什么？",
      "平台因为愤怒内容评论多，就推更多愤怒帖子。风险是什么？",
      "平台发现“愤怒内容”传播比理性分析更快，久而久之，创作者说话也越来越极端。最可能发生了什么？",
      "一个新闻片段因为“太震惊”而疯传，但完整视频出来后，很多人的看法完全改变了。这说明了什么？",
      "一家公司发布调查：“90% 用户满意。” 但调查对象只包含仍在付费的活跃用户。有人认为这个结果有误导性。为什么？",
      "一个人不断刷到某城市的犯罪新闻，于是开始觉得“那里越来越危险”，但长期犯罪率其实变化不大。这个落差最可能来自什么？",
      "一个线上社区最初讨论很开放，但后来大家慢慢不再公开表达不同意见。从外面看，它依然“很团结”。这里可能出现了什么风险？",
      "记者花几周核实复杂调查，而谣言账号几分钟就能发帖并先获得几百万浏览。为什么这种失衡很常见？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "人会逐渐适应“什么更容易被看见”。当情绪化内容更容易获得传播时，表达方式本身也会被系统激励改变。",
      "信息很少能脱离语境独立存在。顺序、 framing、时间点和缺失细节，都会大幅改变人们的理解。",
      "“谁被统计进去”有时和数字本身一样重要。样本选择会影响统计最终讲述的故事。",
      "那些情绪强烈、反复出现、容易记住的事件，常会让人感觉“到处都在发生”，即使统计上并非如此。",
      "一个群体即使看起来稳定，也可能正在悄悄缩小“可被接受的观点范围”。人们可能因为害怕冲突或被排斥而沉默。",
      "核实信息往往需要不确定性、证据与细节，而情绪化的确定表达更容易适应注意力传播机制。"
    ]
  },
  "04": {
    "prompts": [
      "面包店的套餐让顾客从买一个可颂变成买两个。发生了什么？",
      "小店卖得很多，但成本把钱吃掉了。混淆了什么？",
      "健身房加入很容易，取消却很难。这里有什么问题？",
      "餐厅很好吃，却没人知道。错在哪里？",
      "模糊的交付承诺引发争吵。什么能降低风险？",
      "客服中心只奖励通话短，问题却反复回来。哪里出错了？",
      "一家公司不断压缩客服通话时间，效率报表变好了，但客户重复来电却越来越多。公司最可能优化错了什么？",
      "一家创业公司靠大量补贴快速增长，用户数据很好看，但优惠减少后增长立刻放缓。最可能误判了什么？",
      "经理增加了很多审批流程来减少错误。严重错误确实变少了，但简单事情也变得非常慢。这里出现了什么取舍？",
      "谈薪时，一个员工只讨论工资数字，另一个则同时讨论灵活时间、学习机会和未来发展。为什么第二种谈法更容易达成一致？",
      "公司口头上鼓励创新，但员工发现失败项目会悄悄影响晋升。久而久之，很少有人再提新想法。最可能出现了什么系统效应？",
      "公司不断增加 dashboard，希望管理层“看见一切”，但一线团队却越来越多时间花在更新系统，而不是解决客户问题。最可能发生了什么？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "组织很容易优化“最容易测量”的东西。当指标变成目标本身时，数字可能变好，但真实体验却在恶化。",
      "增长有时来自补贴、新鲜感或价格策略，而不一定代表长期稳定的真实需求。",
      "控制系统能提高稳定性，但也可能降低灵活性、自主性和决策速度。",
      "当双方讨论的不只是单一数字，而是多个优先级时，谈判通常会出现更多可协调空间。",
      "人会根据系统里的真实后果行动，而不只是根据口号行动。",
      "信息系统能创造价值，但也可能逐渐消耗原本用于真实执行的注意力、时间和精力。"
    ]
  },
  "05": {
    "prompts": [
      "同一个早晨，金属长椅摸起来比木椅冷。为什么？",
      "天气预报说 70% 会下雨，你家门口却没下。更好的理解是什么？",
      "喝了果昔后很有精神，但那个人也睡了九小时。谨慎的人会怎么说？",
      "一家店只有两条评价，却是五星平均。红旗在哪里？",
      "换新机器后产量上升，有人还想看旧机器数据。为什么？",
      "城市只用路边一个传感器判断全部污染。问题是什么？",
      "一篇健康文章写道：“喝更多咖啡的人平均寿命更长。” 有人立刻得出“咖啡能延寿”的结论。这里最可能忽略了什么？",
      "天气应用 预测“30% 下雨概率”，结果城市一部分地区短暂下雨，有人却说“天气预报错了”。这里最可能存在什么误解？",
      "公司先在最活跃用户中测试新功能，反馈特别好。但正式上线后，普通用户反应平平。这个差异最可能来自什么？",
      "一个城市只在公园附近布置空气传感器，然后宣布“整体污染正在改善”。有人对此保持怀疑。为什么？",
      "一个营养学研究曾被媒体大量报道，但后来的大型研究却没能重复出同样结果。一个合理解释是什么？",
      "一张公司增长图把纵轴从 95 开始，而不是从 0 开始，于是很小的增长看起来非常巨大。为什么这会重要？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "数据中的规律可能来自隐藏变量、生活方式差异或样本选择，而不一定是真正的直接因果。",
      "科学模型很多时候是在复杂系统中估计“可能性”，而不是保证所有地点出现完全相同结果。",
      "如果样本偏向特别活跃或特别投入的人群，结果就可能比真实整体情况更乐观。",
      "科学结论很依赖采样设计。数据从哪里来，会影响最后能看到什么规律。",
      "早期结果有时会因为随机性、小样本或发表激励而显得比真实效果更强。",
      "数据展示方式会影响认知。坐标尺度、裁切与视觉强调，都可能改变人们对趋势大小的感受。"
    ]
  },
  "06": {
    "prompts": [
      "为什么软件更新不只是烦人的弹窗？",
      "朋友所有网站都用同一个密码。风险是什么？",
      "表格只排序了一列，地址和姓名对不上了。发生了什么？",
      "咖啡机只有检测到杯子才出咖啡。这是哪种编程想法？",
      "外卖 App 有重复顾客 ID，结果显示错订单。为什么严重？",
      "发票自动化把旧的坏规则也复制进去，批准了奇怪发票。教训是什么？",
      "公司用聊天机器人自动化客服后，响应速度提高了，但特殊问题反而更难解决。这里出现了什么取舍？",
      "一个人为了方便，总是直接点“同意所有权限”。几个月后，大量应用 已经掌握了详细位置和行为习惯。这里更深层的问题是什么？",
      "推荐算法不断给用户推送“他们已经喜欢的内容”，使用时长提升了，但新发现越来越少。这里出现了什么系统行为？",
      "团队为了省时间，把重要知识都放在私人聊天记录里，而不是正式文档中。几个月后，新员工很难接手工作。这里出现了什么隐藏成本？",
      "开发者为了让登录更快，删掉了几个安全验证步骤。用户体验暂时提升了，但风险也悄悄增加。这里反映了什么张力？",
      "AI 写作工具让员工更快完成报告，但几个月后，管理层发现越来越少人能真正解释报告背后的逻辑。这里可能出现了什么问题？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "自动化通常擅长处理标准化任务，但边缘情况与复杂判断仍可能需要人类参与。",
      "单次授权看起来影响不大，但长期累积后，系统可能建立非常详细的行为画像。",
      "当系统目标是最大化互动时，用户接触到的信息可能会逐渐变得更单一、更缺少新颖性。",
      "信息系统会塑造组织记忆。看似方便的非正式习惯，长期可能造成检索和协作困难。",
      "便利与保护往往需要平衡。过度优化速度的系统，可能会变得更脆弱。",
      "工具能加速产出，但也可能悄悄改变人亲自进行思考、整合与推理的深度。"
    ]
  },
  "07": {
    "prompts": [
      "纸筒竖着能承重，横着却容易压扁。这说明什么？",
      "为什么桥梁常常使用三角形结构？",
      "手机壳很硬，不容易刮花，但一摔就裂。这里有什么取舍？",
      "椅子工厂把工作拆成重复步骤。为什么可能更快？",
      "玻璃公寓很好看，但夏天过热。说明了什么？",
      "机器零件用了最强金属，却又重又贵。问题在哪里？",
      "一家工厂升级了更快的机器，产量提高了，但设备故障也突然变多。最可能发生了什么？",
      "一座按照“平均交通量”设计的桥梁，因为多年重型卡车超负荷使用而提前老化。这里体现了什么？",
      "一个建筑翻新项目大量使用漂亮材料，但后期工作人员却抱怨“很难清洁和维护”。这里最可能低估了什么？",
      "一家建筑公司为了赶工减少安全检查，短期内进度变快了，但后来一次严重事故反而造成巨大延期。这里出现了什么系统行为？",
      "工程师减少了机器里的活动部件数量，结果可靠性提高了，但可定制性下降了。为什么会这样？",
      "一个城市为了缓解堵车不断扩宽道路，但几年后交通又恢复拥堵。最可能的原因是什么？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "工程系统往往需要在效率与韧性之间平衡。当系统越来越接近极限运行时，对磨损、波动和故障的容忍度会下降。",
      "工程表现不仅取决于理论设计，还取决于系统长期在现实中的实际使用方式。",
      "设计选择不仅影响视觉效果，也会影响长期维护成本、使用便利性和实际运营流程。",
      "系统有时会在短期看起来更高效，但实际上正在悄悄积累脆弱性，直到某次失败才暴露出来。",
      "工程设计常常需要在灵活性与可靠性之间平衡。复杂度越高，系统之间需要同步与维护的地方也会更多。",
      "基础设施会反向影响行为。当系统更容易使用时，更多人可能开始依赖它。"
    ]
  },
  "08": {
    "prompts": [
      "番茄施太多氮肥后叶子很多，果实很少。为什么？",
      "为什么湿土上不能急着开拖拉机？",
      "害虫变多时，为什么换种作物可能有帮助？",
      "渔船都抢着多捕一点，最后鱼变少了。这是什么问题？",
      "热浪中奶牛吃得不少，产奶却下降。隐藏因素是什么？",
      "森林管理者为什么会移除一些小树？",
      "一个农场在大片土地上只种一种高产作物，多年产量都很好，但后来一种疾病迅速蔓延整个农场。这里暴露了什么弱点？",
      "一个渔区因为捕捞技术升级，捕鱼速度远远超过鱼群恢复速度。这里出现了什么系统问题？",
      "一个城市大量喷洒农药减少昆虫，让居民更舒服。但后来附近农场授粉下降、收成变差。这里暴露了什么隐藏联系？",
      "一个养狗的人非常重视高端狗粮，但很少遛狗或提供活动刺激。后来狗出现了行为问题。这里最可能忽略了什么？",
      "一片森林几十年里几乎扑灭了所有小火灾，但后来一次超级大火却几乎无法控制。这里可能出现了什么长期动态？",
      "一个农业地区改种国际市场利润更高的作物，但后来本地食品价格开始波动很大。这里可能出现了什么取舍？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "生物系统往往需要在产量与多样性之间平衡。过于统一的系统可能更容易受到共同风险影响。",
      "自然系统通常有自己的恢复节奏。当获取能力增长快于再生能力时，长期稳定性就会下降。",
      "生命系统中的不同部分彼此连接，一个地方的变化可能会在别处产生间接后果。",
      "生命状态通常由营养、活动、环境刺激与社交经验共同影响，而不是单一变量决定。",
      "有些系统会通过小规模扰动逐渐释放压力。完全消除波动，有时反而会增加未来灾难性风险。",
      "经济效率与本地稳定性并不总同步。过度依赖外部市场的系统，可能更容易受到外部波动影响。"
    ]
  },
  "09": {
    "prompts": [
      "朋友刷牙很用力，牙龈出血。更好的习惯是什么？",
      "有人半夜喝咖啡，第二天仍然很累。可能发生了什么？",
      "新跑者每天猛练，膝盖受伤后放弃。更明智的做法是什么？",
      "一个轻微生病的人去上班，后来半个办公室都咳嗽。这说明什么？",
      "病人吃抗生素后感觉好了，想提前停药。担心点是什么？",
      "一位老人因为公交线路改变而错过复诊。这揭示了什么？",
      "一个人为了“更高效”长期减少睡眠，短期工作时间确实增加了，但几个月后专注力、情绪和判断力明显下降。最可能低估了什么？",
      "医院把排班压得非常紧，几乎不给医护人员留缓冲时间。效率提高了，但 burnout 却明显上升。这里最可能忽略了什么？",
      "健身应用 用“每日闭环”激励运动。有些人因此更健康，也有人带伤硬练。这里说明了什么？",
      "一个城市大量投资急救和治疗，但很少建设运动环境或健康饮食支持。医疗支出依然不断上涨。最可能发生了什么？",
      "一个人不断查看智能设备里的健康数据，结果反而越来越焦虑，总担心微小波动。这里可能出现了什么现象？",
      "一个社区建立了互助小组，大家定期分享困难。虽然很多现实问题没有立刻解决，但参与者依然感觉没那么孤独了。为什么会这样？"
    ],
    "explanations": [
      null,
      null,
      null,
      null,
      null,
      null,
      "健康系统往往需要平衡。短期通过“硬撑”获得收益，可能会悄悄削弱长期认知和情绪表现。",
      "涉及人的系统通常需要情绪和运营上的余量。过度追求利用率，可能削弱长期可持续性。",
      "行为激励系统对不同人会产生不同影响。指标和奖励既可能帮助建立习惯，也可能引发过度优化。",
      "健康结果通常由长期生活环境和行为模式塑造，而不仅仅是后期治疗决定。",
      "数据能提高 awareness，但过度监控也可能放大不确定感、压力和对正常波动的敏感度。",
      "幸福感不仅取决于外部条件，也受到归属感、情绪确认和社会支持感影响。"
    ]
  }
};

const zhQuestionOptions = {
  "10": [
    [
      "服务体验由很多小的照顾瞬间组成",
      "酒店只看房间大小",
      "客人不会记得别人怎么对待他"
    ],
    [
      "干净的地板湿了仍有安全风险",
      "告示牌只是装饰",
      "湿地板没人管会更安全"
    ],
    [
      "协调和时间安排也是服务质量的一部分",
      "味道好能抵消所有服务问题",
      "食物越贵客人越喜欢混乱"
    ],
    [
      "在瓶颈前给出清楚准备说明",
      "把托盘做小一点",
      "最后一秒才告诉规则"
    ],
    [
      "服务增加了优先通道，却没有管理总容量",
      "快速票会创造无限容量",
      "涨价后队伍会消失"
    ],
    [
      "指标只奖励速度，忽略服务质量和安全",
      "顾客不喜欢快速收到包裹",
      "司机无法遵守任何衡量标准"
    ],
    [
      "标准化提高了效率，但削弱了处理例外情况的能力",
      "客人只是习惯和真人说话",
      "自动化只适用于科技公司"
    ],
    [
      "高度优化的系统往往也会更容易受扰动影响",
      "航空系统主要因为乘客迟到才失效",
      "效率与稳定性永远同步提升"
    ],
    [
      "人与人之间自然调整和真实互动的能力",
      "快速上菜的能力",
      "顾客对专业感的需求"
    ],
    [
      "个体便利提升后，整体系统负荷也增加了",
      "网约车主要因为司机效率低才堵车",
      "只有完全自动驾驶才能解决交通"
    ],
    [
      "很多准备工作的价值，体现在“事故没有发生”",
      "应急系统主要只是为了让公众安心",
      "低概率事件通常根本无法准备"
    ],
    [
      "体验往往是由大量微小信号共同塑造的",
      "人们主要根据门票价格判断服务质量",
      "娱乐体验主要只取决于建筑"
    ]
  ],
  "00": [
    [
      "用基础数字能力做更聪明的日常选择",
      "专业会计知识",
      "品牌忠诚"
    ],
    [
      "日常生活本身也包含学习",
      "人只会在教室里学习",
      "毕业后学习就停止"
    ],
    [
      "清楚表达能把不满变成行动",
      "信息越长效果越好",
      "愤怒才是最佳策略"
    ],
    [
      "理解能帮你知道该算什么",
      "计算器可以取代理解",
      "百分比只对银行家有用"
    ],
    [
      "适应能力常常比某个工具更持久",
      "软件技能没有价值",
      "面试喜欢模糊回答"
    ],
    [
      "基础能力能提升独立性和参与感",
      "只有大学课程才算学习",
      "成年人学基础课没用"
    ],
    [
      "把这些想法整理成一个简单的知识地图",
      "先继续收集更多材料再说",
      "全部删掉，从零开始"
    ],
    [
      "一个有优先级的学习路径",
      "一句更有力量的励志名言",
      "更多记录进度的 App"
    ],
    [
      "这些主题背后有什么共同系统？",
      "哪个主题现在最流行？",
      "哪个主题可以先忽略？"
    ],
    [
      "你在浅尝知识，但没有形成深度",
      "你选的主题太实用了",
      "你以后只能学一个主题"
    ],
    [
      "平衡接触面、精力和真正的进步",
      "趁动力下降前再多加几门课",
      "只选看起来最有面子的活动"
    ],
    [
      "团队没有共同的分类习惯",
      "文件夹图标不够醒目",
      "大家以后不应该保存文件"
    ]
  ],
  "01": [
    [
      "听到后尽快重复并使用这个名字",
      "假装自己听清了",
      "等到明天再想"
    ],
    [
      "先给临时支持，再让独立能力长出来",
      "完全不帮忙地测试孩子",
      "故意让车更难骑"
    ],
    [
      "Tom，因为回忆会暴露薄弱点",
      "Sara，因为划重点就等于掌握",
      "都不是，因为学习无法检查"
    ],
    [
      "间隔重复能逐步加强记忆",
      "遗忘说明学习完全失败",
      "一次性死记永远更高效"
    ],
    [
      "它把抽象提醒变成反复真实选择",
      "它证明员工不需要规则",
      "它让网络安全只剩娱乐"
    ],
    [
      "任务得到了足够支撑，脑子没那么 overload",
      "看到例子会让创意消失",
      "新手立刻变成专家"
    ],
    [
      "知识更偏向熟悉模式，而不是可迁移理解",
      "练习题通常比现实问题更难",
      "现实场景主要靠自信而不是能力"
    ],
    [
      "周围工作系统可能仍在奖励旧行为",
      "成年人进入职场后通常无法继续学习",
      "培训主要只能提升动力"
    ],
    [
      "信息摄入速度超过了真正整合与沉淀速度",
      "倍速播放会自动降低智力",
      "知识内容主要只能靠重复记忆"
    ],
    [
      "学习者正在优化熟练感，而不是成长",
      "舒适练习会自然降低天赋",
      "高级能力主要靠更长时间重复"
    ],
    [
      "外部结构替代了内部判断能力",
      "独立工作主要取决于性格",
      "清晰指导会自然削弱智力"
    ],
    [
      "其中一个人持续在真实场景中反复应用这些方法",
      "领导力课程主要只对自信的人有效",
      "行为改变主要取决于是否记住术语"
    ]
  ],
  "02": [
    [
      "画面用艺术信号影响情绪",
      "演员已经解释了剧情",
      "摄像机坏了"
    ],
    [
      "视觉风格改变了人们感受到的意义",
      "蛋糕配方自动改变了",
      "字体不会影响感受"
    ],
    [
      "材料也能带有社会和历史意义",
      "老画家都是随便选颜色",
      "过去的人看不见蓝色"
    ],
    [
      "好故事可以容纳多个有证据的理解",
      "只能有一个读者是对的",
      "解读就是没有证据地猜"
    ],
    [
      "它的设计连接了历史、社会和人的需要",
      "椅子不可能有文化意义",
      "标签让椅子变贵"
    ],
    [
      "真实材料也会被叙事方式重新组织",
      "纪录片一定完全中立",
      "音乐不会影响判断"
    ],
    [
      "原本构成街区气质的日常生活结构被削弱了",
      "旅游一定会立刻毁掉所有文化价值",
      "人们只是因为物价上涨才讨厌变化"
    ],
    [
      "让情绪沉淀和记忆形成的节奏感",
      "制作高清视频的技术能力",
      "编写长对话的法律自由"
    ],
    [
      "可进入性与解释深度之间的取舍",
      "博物馆是否应该让观众阅读",
      "历史是否只要被简化一次就会失真"
    ],
    [
      "人物内心变化与情绪沉淀的过程被削弱了",
      "电影使用了现代摄影设备",
      "演员说话比书里更清楚"
    ],
    [
      "历史保留应该在多大程度上优先于现实使用体验",
      "老建筑是否应该 在法律上永远不改变",
      "舒适度是否一定会降低艺术体验"
    ],
    [
      "模糊与留白会让观众主动参与理解",
      "人们通常更喜欢看起来像意外的作品",
      "未完成状态能减少艺术技巧要求"
    ]
  ],
  "03": [
    [
      "先核对原始来源",
      "赶紧分享，别错过",
      "很多人说就相信"
    ],
    [
      "社会行为会在群体中传播",
      "人从不会受别人影响",
      "打哈欠是一种政治观点"
    ],
    [
      "它利用好奇心吸引注意",
      "它给了完整平衡的总结",
      "它去掉了故事里的情绪"
    ],
    [
      "人常会回应社会规范",
      "人不喜欢短句",
      "告示会物理强迫人行动"
    ],
    [
      "问题措辞会影响民意数据",
      "人们对公园没有观点",
      "民调永远完美反映现实"
    ],
    [
      "平台可能因为互动而放大愤怒",
      "平台会自动改善公共讨论",
      "愤怒帖子会因为没人理而消失"
    ],
    [
      "平台的注意力机制正在悄悄塑造行为",
      "只要出现科技，人就一定会失去理性",
      "极端观点永远比温和观点更真实"
    ],
    [
      "背景信息会强烈影响社会判断",
      "短视频永远都是故意误导",
      "人应该完全避免情绪反应"
    ],
    [
      "样本可能排除了已经不满意而离开的人",
      "用户满意度永远无法测量",
      "高百分比天然会引发公众不信任"
    ],
    [
      "高频曝光会扭曲人对发生概率的感知",
      "犯罪统计通常隐藏了所有真实情况",
      "媒体报道越多，城市就一定越危险"
    ],
    [
      "社会压力正在减少观点多样性",
      "意见一致一定代表社区健康",
      "人进入大群体后会自然失去观点"
    ],
    [
      "快速情绪化内容通常比谨慎核实更容易扩散",
      "专业新闻工作的主要作用是减慢信息流动",
      "人们只要有选择就一定更喜欢假消息"
    ]
  ],
  "04": [
    [
      "套餐改变了人们对划算的感觉",
      "可颂在法律上变了",
      "顾客忘了饥饿是什么"
    ],
    [
      "收入不等于利润",
      "利润会在成本前出现",
      "销售会让支出消失"
    ],
    [
      "公司可能在用麻烦留住顾客",
      "公司在提升顾客自由",
      "合同会变透明"
    ],
    [
      "质量本身不会自动带来认知",
      "好产品应该保持神秘",
      "营销只对坏产品有用"
    ],
    [
      "清楚写下交付条件",
      "电话里多发几个表情",
      "不要留下任何记录"
    ],
    [
      "激励鼓励了错误行为",
      "员工一夜之间不近人情",
      "顾客永远讨厌快速回答"
    ],
    [
      "把容易被统计的指标当成了真正结果",
      "把员工友善程度放在利润前面",
      "把长期合同放在了短对话前面"
    ],
    [
      "把短期激励误当成了长期真实需求",
      "快速增长本身一定危险",
      "用户天然讨厌盈利公司"
    ],
    [
      "降低风险的同时增加了协调成本",
      "员工正在逐渐变笨",
      "组织最好完全没有规则"
    ],
    [
      "讨论维度越多，可交换的取舍空间越大",
      "公司天然讨厌直接谈钱",
      "职业成长会自动替代薪资需求"
    ],
    [
      "组织实际上奖励的是“避免风险”而不是实验",
      "创新主要取决于办公室装修",
      "大公司员工天然会失去创造力"
    ],
    [
      "可视化系统开始与真实执行争夺资源",
      "数字化汇报一定会提高协作",
      "数据越多客户问题就会自动消失"
    ]
  ],
  "05": [
    [
      "金属更快带走你身体的热量",
      "金属一定温度更低",
      "木头偷偷发热"
    ],
    [
      "概率描述不确定性，不是个人保证",
      "App 承诺每个人都会淋雨",
      "70% 表示一天会下 70% 的雨"
    ],
    [
      "一次经历不能证明因果关系",
      "果昔一定有魔法",
      "睡眠永远不会影响精力"
    ],
    [
      "样本太小，不太可靠",
      "五星在数学上不可能",
      "平均数从不描述评价"
    ],
    [
      "对照能帮助分辨机器效果和其他因素",
      "科学家不喜欢有用机器",
      "产量数字一定是假的"
    ],
    [
      "一个地点不一定代表全城",
      "传感器不能测空气",
      "繁忙道路永远代表公园"
    ],
    [
      "相关性并不自动等于因果关系",
      "咖啡研究永远不科学",
      "寿命主要由饮料决定"
    ],
    [
      "概率预测描述的是不确定性，而不是每个人的确定结果",
      "天气系统应该精确预测每一条街",
      "天气预报主要是为了情绪安慰"
    ],
    [
      "早期测试样本不一定代表整体人群",
      "普通用户天然讨厌创新",
      "产品成功后统计就会失效"
    ],
    [
      "测量地点本身会影响最终结论",
      "公园天然会制造错误数据",
      "城市空气无法被可靠测量"
    ],
    [
      "小规模早期研究可能会放大不稳定规律",
      "大型研究通常比小研究更不科学",
      "可重复性只对物理学重要"
    ],
    [
      "数据的视觉 framing 会强烈影响理解",
      "所有图表只要不从 0 开始就不科学",
      "只要数字带情绪，人们就不该看图"
    ]
  ],
  "06": [
    [
      "它们能修补安全漏洞和软件问题",
      "它们只会换壁纸",
      "它们让黑客更舒服"
    ],
    [
      "一个被盗密码可能打开很多账号",
      "密码重复会变重",
      "网站拒绝所有重复字母"
    ],
    [
      "只排序了一列，而不是整张表",
      "表格产生了自我意识",
      "字母顺序会毁掉所有数据"
    ],
    [
      "基于条件的指令",
      "随机绘画技巧",
      "坏掉的数据库"
    ],
    [
      "糟糕的数据结构会破坏系统逻辑",
      "数据库只是装饰",
      "重复 ID 会让配送更快"
    ],
    [
      "自动化会同时放大好规则和坏规则",
      "自动化让人类判断永远不需要",
      "旧流程数字化后自动完美"
    ],
    [
      "效率提高了，但灵活性下降了",
      "自动化只适用于制造业",
      "用户天然讨厌数字系统"
    ],
    [
      "很多小的便利选择累积成了大规模数据暴露",
      "位置追踪只会影响名人",
      "应用只要很多人用就一定安全"
    ],
    [
      "对互动的优化正在缩小探索范围",
      "算法重复越多就越客观",
      "人长期上网后会自然失去好奇心"
    ],
    [
      "短期便利削弱了长期知识可访问性",
      "私人沟通永远低效",
      "新员工主要因为问题太多才学不会"
    ],
    [
      "减少 friction 有时会降低系统韧性",
      "安全系统主要是为了烦用户",
      "软件只要够快最终就会自动安全"
    ],
    [
      "任务完成速度正在超过真实理解能力的成长",
      "AI 工具会自动消除人类智力",
      "组织已经不再需要书面报告"
    ]
  ],
  "07": [
    [
      "形状和受力方向会影响强度",
      "纸板偷偷变成钢",
      "书竖起来会变轻"
    ],
    [
      "三角形能帮助结构在受力下稳定",
      "桥梁法律规定必须用三角形",
      "工程师不能画矩形"
    ],
    [
      "硬度和韧性不是一回事",
      "软材料一定失败",
      "刮痕比摔落更危险"
    ],
    [
      "专门化步骤能减少切换、提升流动",
      "人越多一定解决所有问题",
      "分工会让质量不重要"
    ],
    [
      "设计要考虑热、光和真实使用条件",
      "漂亮建筑不能遵守物理",
      "玻璃一定让建筑更凉快"
    ],
    [
      "设计只优化一个特性，却忽略系统取舍",
      "强材料永远没用",
      "可维修性没有商业价值"
    ],
    [
      "系统提高了效率，但减少了运行余量",
      "新机器天然比旧机器更不可靠",
      "维护团队通常讨厌自动化"
    ],
    [
      "真实使用方式有时比理想设计假设更重要",
      "桥梁主要因为外观老化而失效",
      "重型车辆永远不应该使用公共设施"
    ],
    [
      "美观设计可能会增加长期运维复杂度",
      "维护人员通常反对建筑创新",
      "漂亮材料一定不耐用"
    ],
    [
      "短期优化正在累积长期隐藏风险",
      "安全流程主要只是为了法律形象",
      "快速施工天然会带来偶发事故"
    ],
    [
      "更简单的系统通常会减少协调和故障点",
      "可定制性通常会破坏所有工程质量",
      "机械系统功能越少越好"
    ],
    [
      "增加容量有时会反过来增加使用需求",
      "修路主要改变的是司机情绪",
      "交通问题只会出现在大城市"
    ]
  ],
  "08": [
    [
      "叶子长太多可能牺牲结果",
      "氮肥让植物忘记夏天",
      "番茄只能长在小盆里"
    ],
    [
      "湿土容易被压实，之后伤根",
      "拖拉机会在雨里融化",
      "雨水让种子对阳光过敏"
    ],
    [
      "轮作能打断害虫循环并支持土壤平衡",
      "植物会厌倦熟悉的田地",
      "不同作物会抵消季节"
    ],
    [
      "共享资源可能被每个人单独行动而过度使用",
      "鱼不喜欢开团队会议",
      "船越多鱼越多"
    ],
    [
      "热应激会降低动物产出和福利",
      "牛夏天不需要水",
      "产奶只取决于饲料多少"
    ],
    [
      "间伐能减少竞争、改善森林健康",
      "森林越挤长得越好",
      "小树对生态系统没用"
    ],
    [
      "通过单一化获得效率的同时，也降低了韧性",
      "大型农场天然无法防病",
      "植物疾病主要因为天气预报传播"
    ],
    [
      "技术提高了获取速度，却超过了自然恢复速度",
      "鱼类数量主要取决于旅游业",
      "高效设备天然会降低可持续性"
    ],
    [
      "生态系统内部存在高度相互依赖",
      "昆虫主要只会破坏农业",
      "城市政策很少影响周边环境"
    ],
    [
      "动物健康依赖整体照护系统，而不只是单一因素",
      "高端食物通常会增加攻击性",
      "行为问题主要完全来自基因"
    ],
    [
      "长期压制小扰动，让更大风险不断累积",
      "森林没有旅游业就会自然失稳",
      "大型火灾主要因为消防响应太慢"
    ],
    [
      "面向全球市场优化，可能降低本地韧性",
      "出口作物一定更破坏环境",
      "本地农业主要因为传统观念失败"
    ]
  ],
  "09": [
    [
      "用正确方法轻柔、规律地刷",
      "越用力刷牙龈越强",
      "牙龈出血就先不刷"
    ],
    [
      "咖啡因可能降低睡眠质量，即使你睡着了",
      "咖啡半夜会变成水",
      "觉得累证明睡得完美"
    ],
    [
      "循序渐进，并留出恢复时间",
      "一开始就练最难的",
      "疼痛可以靠意志力解决"
    ],
    [
      "个人选择会产生群体层面的健康影响",
      "只有症状严重才算问题",
      "办公室会自动保护人不生病"
    ],
    [
      "提前停止可能留下细菌并增加耐药风险",
      "感觉好就说明细菌全没了",
      "抗生素随便吃效果更好"
    ],
    [
      "健康也受社会和现实条件影响",
      "医疗只取决于意志力",
      "预约和交通无关"
    ],
    [
      "人的表现不仅依赖输出时间，也依赖恢复能力",
      "效率主要只取决于动力",
      "睡眠问题只会影响体力"
    ],
    [
      "照护系统不仅需要效率，也需要韧性空间",
      "医护人员天然讨厌严格排班",
      "职业倦怠主要因为技术不足"
    ],
    [
      "同一种激励系统会因不同情境而产生不同结果",
      "健康追踪技术通常会导致成瘾",
      "每日运动目标永远不应该存在"
    ],
    [
      "系统更偏向处理结果，而不是底层原因",
      "预防项目主要只是提升形象",
      "急救系统会自然增加疾病"
    ],
    [
      "更多信息有时会强化过度关注，而不是安心感",
      "健康设备主要都会制造错误数据",
      "只要停止测量，焦虑就会消失"
    ],
    [
      "社会连接本身会改变人对压力的体验",
      "只要倾诉问题就会自动解决",
      "互助小组主要靠专业医疗起作用"
    ]
  ]
};

function getOptionOrder(index) {
  if (index % 3 === 0) return [0, 1, 2];
  if (index % 3 === 1) return [1, 0, 2];
  return [2, 1, 0];
}

function makeQuestion(code, prompt, difficulty, unlocksToward, index) {
  const optionSet = questionOptions[code][index];
  const zhOptionSet = zhQuestionOptions[code][index];
  const zhPrompt = zhSubjectQuestionSeeds[code].prompts[index];
  const answer = optionSet[0];
  const zhAnswer = zhOptionSet[0];
  const explanation = subjectQuestionSeeds[code].explanations?.[index] || answer + ". This answer turns the everyday scene into a practical knowledge pattern.";
  const zhExplanation = zhSubjectQuestionSeeds[code].explanations?.[index] || zhAnswer + "。这个答案把日常场景变成了一个可以理解的知识模式。";
  const optionOrder = getOptionOrder(index);
  return {
    id: code + "-q" + (index + 1),
    subject: code,
    difficulty,
    unlocksToward,
    optionOrder,
    en: {
      question: prompt,
      options: optionOrder.map((optionIndex) => optionSet[optionIndex]),
      answer,
      explanation: explanation + " Powered by MapKAI - Map Your Knowledge with AI.",
    },
    zh: {
      question: zhPrompt,
      options: optionOrder.map((optionIndex) => zhOptionSet[optionIndex]),
      answer: zhAnswer,
      explanation: zhExplanation + " Powered by MapKAI - Map Your Knowledge with AI.",
    },
  };
}

const questionDifficultyPattern = ["easy", "easy", "medium", "medium", "hard", "hard"];
const questionUnlockPattern = ["snow", "snow", "land", "land", "green", "green"];

const questionBank = Object.fromEntries(Object.entries(subjectQuestionSeeds).map(([code, seed]) => {
  return [code, {
    subject: seed.subject,
    status: "draft",
    unlockRule: { snow: 2, land: 4, green: 6 },
    theme: seed.theme,
    questions: seed.prompts.map((prompt, index) => makeQuestion(
      code,
      prompt,
      questionDifficultyPattern[index % questionDifficultyPattern.length],
      questionUnlockPattern[index % questionUnlockPattern.length],
      index
    ))
  }];
}));

function lensProfile(subject, lens, reflectionZh, reflectionEn) {
  return { subject, lens, reflectionZh, reflectionEn };
}

const mapkaiKnowledgeLensQuestionsV1 = [
  {
    id: "lens-001",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "digital_life",
    zh: { question: "为什么很多人知道要少刷手机，却还是停不下来？", options: { A: "信息流不断降低继续看的阻力。", B: "短内容不断制造即时反馈。", C: "疲惫时更容易选择低成本刺激。", D: "缺少更好的替代休息方式。" } },
    en: { question: "Why do many people keep scrolling even when they know they should stop?", options: { A: "Feeds keep reducing the friction to continue.", B: "Short content creates instant feedback loops.", C: "Tired brains prefer low-effort stimulation.", D: "There are not enough better ways to rest." } },
    optionProfiles: {
      A: lensProfile("06_digital_systems_ai", "feed_friction_design", "倾向于从信息流、平台机制和数字环境理解行为。", "Tends to understand behavior through feeds, platform mechanisms, and digital environments."),
      B: lensProfile("05_evidence_patterns", "feedback_loop", "倾向于从反馈循环、行为规律和刺激机制理解问题。", "Tends to understand issues through feedback loops, behavior patterns, and stimulus mechanisms."),
      C: lensProfile("09_health_recovery", "fatigue_low_effort_stimulation", "倾向于从疲惫、注意力和恢复状态理解行为。", "Tends to understand behavior through fatigue, attention, and recovery state."),
      D: lensProfile("10_services_experience", "alternative_rest_experience", "倾向于从替代体验、休息方式和用户需求理解问题。", "Tends to understand issues through alternative experiences, rest options, and user needs."),
    },
  },
  {
    id: "lens-002",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "health_energy",
    zh: { question: "为什么有人睡够 8 小时，白天还是累？", options: { A: "睡眠质量和生物节律可能不好。", B: "白天小决策和切换太多。", C: "工作和休息边界不清。", D: "环境没有帮助身体恢复。" } },
    en: { question: "Why can someone sleep 8 hours and still feel tired?", options: { A: "Sleep quality and body rhythm may be poor.", B: "Too many small decisions and switches happen daily.", C: "Work and rest boundaries are unclear.", D: "The environment does not support recovery." } },
    optionProfiles: {
      A: lensProfile("09_health_recovery", "sleep_quality_body_rhythm", "倾向于从睡眠质量、生物节律和身体恢复理解问题。", "Tends to understand issues through sleep quality, body rhythm, and physical recovery."),
      B: lensProfile("05_evidence_patterns", "cognitive_load_hidden_variables", "倾向于从隐藏变量、认知负荷和消耗机制理解问题。", "Tends to understand issues through hidden variables, cognitive load, and energy-drain mechanisms."),
      C: lensProfile("04_business_management", "boundary_resource_management", "倾向于从边界、资源分配和时间管理理解问题。", "Tends to understand issues through boundaries, resource allocation, and time management."),
      D: lensProfile("07_engineering_systems", "environment_recovery_design", "倾向于从环境设计、流程和系统条件理解恢复。", "Tends to understand recovery through environmental design, routines, and system conditions."),
    },
  },
  {
    id: "lens-003",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "ai_work",
    zh: { question: "为什么团队用了 AI，产出更多了，决策却没变好？", options: { A: "问题定义没有变清楚。", B: "证据标准没有提高。", C: "输出没有进入评审流程。", D: "团队没有沉淀共同方法。" } },
    en: { question: "Why can AI increase output but not improve decisions?", options: { A: "Problem framing did not become clearer.", B: "Evidence standards did not improve.", C: "Outputs were not built into review processes.", D: "The team did not capture shared methods." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "problem_framing_decision_quality", "倾向于从问题定义、决策质量和价值判断理解 AI 使用。", "Tends to understand AI usage through problem framing, decision quality, and value judgment."),
      B: lensProfile("05_evidence_patterns", "evidence_standard", "倾向于从证据标准、信息噪音和判断可靠性理解问题。", "Tends to understand issues through evidence standards, information noise, and judgment reliability."),
      C: lensProfile("07_engineering_systems", "review_workflow", "倾向于从评审流程、责任结构和系统嵌入理解工具价值。", "Tends to understand tool value through review workflows, responsibility structures, and system integration."),
      D: lensProfile("01_learning_growth", "shared_learning_methods", "倾向于从共同学习、经验沉淀和方法复用理解团队成长。", "Tends to understand team growth through shared learning, experience capture, and reusable methods."),
    },
  },
  {
    id: "lens-004",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "learning",
    zh: { question: "为什么很多人学了很多，却判断力没明显提升？", options: { A: "知识没有形成结构。", B: "观点没有经过真实验证。", C: "只记结论，没看证据。", D: "没有变成自己的表达语言。" } },
    en: { question: "Why do many people learn a lot but not improve their judgment?", options: { A: "Knowledge has not formed a structure.", B: "Ideas have not been tested in reality.", C: "They remember conclusions, not evidence.", D: "They have not turned it into their own language." } },
    optionProfiles: {
      A: lensProfile("01_learning_growth", "knowledge_structure", "倾向于从知识结构、概念连接和学习迁移理解成长。", "Tends to understand growth through knowledge structure, concept connection, and learning transfer."),
      B: lensProfile("07_engineering_systems", "real_world_testing_loop", "倾向于从真实应用、反馈闭环和实践转化理解知识价值。", "Tends to understand knowledge value through real-world application, feedback loops, and practice transfer."),
      C: lensProfile("05_evidence_patterns", "evidence_reasoning_quality", "倾向于从证据、假设和论证质量理解知识。", "Tends to understand knowledge through evidence, assumptions, and reasoning quality."),
      D: lensProfile("02_meaning_expression", "language_expression", "倾向于从语言、表达和意义组织理解知识内化。", "Tends to understand knowledge internalization through language, expression, and meaning organization."),
    },
  },
  {
    id: "lens-005",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "restaurant_service",
    zh: { question: "为什么餐厅好吃，却让人不想再去？", options: { A: "复购场景不清楚。", B: "服务触点不连贯。", C: "缺少可传播的记忆点。", D: "没有进入社交生活场景。" } },
    en: { question: "Why can a good restaurant still fail to make people return?", options: { A: "The repeat-use scenario is unclear.", B: "Service touchpoints feel disconnected.", C: "There is no memorable story to share.", D: "It does not fit social life contexts." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "repeat_use_scenario", "倾向于从定位、复购场景和商业匹配理解问题。", "Tends to understand issues through positioning, repeat-use scenarios, and business fit."),
      B: lensProfile("10_services_experience", "service_touchpoints", "倾向于从服务触点、用户旅程和体验完整性理解问题。", "Tends to understand issues through service touchpoints, user journeys, and experience completeness."),
      C: lensProfile("02_meaning_expression", "memory_symbol_expression", "倾向于从记忆点、表达符号和叙事理解体验价值。", "Tends to understand experiential value through memory points, expressive symbols, and narrative."),
      D: lensProfile("03_society_relationships", "social_context_fit", "倾向于从社交场景、关系需求和群体行为理解消费体验。", "Tends to understand consumption experiences through social context, relational needs, and group behavior."),
    },
  },
  {
    id: "lens-006",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "choice",
    zh: { question: "为什么选择越多，有时反而越难满意？", options: { A: "比较变量太多。", B: "机会成本变高。", C: "真实需求不清楚。", D: "期待被外界放大。" } },
    en: { question: "Why can more choices make people less satisfied?", options: { A: "There are too many variables to compare.", B: "Opportunity cost becomes more visible.", C: "Real needs are not clear.", D: "Expectations are amplified by the outside world." } },
    optionProfiles: {
      A: lensProfile("05_evidence_patterns", "variable_comparison", "倾向于从变量、比较和判断复杂度理解选择困难。", "Tends to understand choice difficulty through variables, comparison, and judgment complexity."),
      B: lensProfile("04_business_management", "opportunity_cost", "倾向于从机会成本、资源取舍和价值判断理解选择。", "Tends to understand choices through opportunity cost, trade-offs, and value judgment."),
      C: lensProfile("00_general_thinking", "real_need_clarity", "倾向于从真实需求、整体判断和情境匹配理解问题。", "Tends to understand issues through real needs, overall judgment, and context fit."),
      D: lensProfile("03_society_relationships", "social_expectation", "倾向于从社会期待、比较压力和群体影响理解满意感。", "Tends to understand satisfaction through social expectations, comparison pressure, and group influence."),
    },
  },
  {
    id: "lens-007",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "consumption",
    zh: { question: "为什么有些贵东西，长期看反而更省钱？", options: { A: "单次使用成本更低。", B: "更容易进入日常使用。", C: "长期看不容易厌倦。", D: "减少重复购买和浪费。" } },
    en: { question: "Why can expensive things cost less over time?", options: { A: "Lower cost per use.", B: "Fits daily routines better.", C: "Stays satisfying for longer.", D: "Reduces repeat buying and waste." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "cost_per_use", "倾向于从长期成本、使用频率和资源分配理解选择。", "Tends to understand choices through long-term cost, usage frequency, and resource allocation."),
      B: lensProfile("07_engineering_systems", "routine_fit", "倾向于从使用场景、流程适配和系统稳定性理解价值。", "Tends to understand value through use-case fit, routine integration, and system stability."),
      C: lensProfile("02_meaning_expression", "lasting_taste", "倾向于从审美、身份和长期生活状态理解价值。", "Tends to understand value through taste, identity, and long-term life state."),
      D: lensProfile("08_natural_systems_sustainability", "waste_reduction", "倾向于从资源节约、重复消费和长期可持续理解选择。", "Tends to understand choices through resource saving, repeat consumption, and sustainability."),
    },
  },
  {
    id: "lens-008",
    subject: "00",
    questionMode: "knowledge_lens_probe",
    scenarioType: "work",
    zh: { question: "为什么一个人很忙，却让人觉得不可靠？", options: { A: "响应很多，交付不清。", B: "工作闭环不稳定。", C: "优先级判断不清。", D: "团队期待没有对齐。" } },
    en: { question: "Why can a busy person still feel unreliable to others?", options: { A: "They respond often, but deliver unclearly.", B: "Their work loop is unstable.", C: "Their priority judgment is unclear.", D: "Team expectations are not aligned." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "delivery_clarity", "倾向于从交付、责任和结果可见性理解可靠性。", "Tends to understand reliability through delivery, ownership, and visible outcomes."),
      B: lensProfile("07_engineering_systems", "work_loop_stability", "倾向于从流程闭环、节奏和系统稳定性理解问题。", "Tends to understand issues through workflow loops, rhythm, and system stability."),
      C: lensProfile("05_evidence_patterns", "priority_signal", "倾向于从信息信号、优先级和判断依据理解问题。", "Tends to understand issues through signals, priorities, and judgment basis."),
      D: lensProfile("03_society_relationships", "team_expectation_alignment", "倾向于从团队期待、关系结构和协作规范理解问题。", "Tends to understand issues through team expectations, relationship structures, and collaboration norms."),
    },
  },
  {
    id: "task-001",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "travel",
    zh: { question: "你和朋友策划周末短途旅行。你最想负责哪件事？", options: { A: "控制预算，判断哪些钱花得最值。", B: "设计路线，让时间和交通更顺。", C: "找到真正有记忆点的地方和体验。", D: "照顾大家的节奏、体力和舒适度。" } },
    en: { question: "You and your friends plan a weekend trip. What would you like to handle?", options: { A: "Manage the budget and judge what is worth it.", B: "Design the route and make transport smoother.", C: "Find memorable places and experiences.", D: "Care for everyone’s pace, energy, and comfort." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "budget_value_judgment", "更愿意负责预算、价值判断和资源分配。", "More willing to handle budget, value judgment, and resource allocation."),
      B: lensProfile("07_engineering_systems", "route_process_optimization", "更愿意负责路线、流程和系统优化。", "More willing to handle routes, processes, and system optimization."),
      C: lensProfile("02_meaning_expression", "memory_experience_design", "更愿意负责体验、记忆点和意义感设计。", "More willing to design experiences, memory points, and meaning."),
      D: lensProfile("09_health_recovery", "energy_comfort_care", "更愿意负责节奏、体力、舒适度和恢复感。", "More willing to care for pace, energy, comfort, and recovery."),
    },
  },
  {
    id: "task-002",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "restaurant",
    zh: { question: "朋友聚餐要选餐厅。你最想负责哪件事？", options: { A: "比较价格、人均和菜品是否值得。", B: "确认订位、交通、时间是否顺畅。", C: "挑一家有氛围、适合聊天的店。", D: "照顾大家口味、限制和舒适度。" } },
    en: { question: "Your friends are choosing a restaurant. What would you like to handle?", options: { A: "Compare price, cost per person, and value.", B: "Check booking, transport, and timing.", C: "Find a place with atmosphere and conversation.", D: "Care for everyone’s tastes, limits, and comfort." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "price_value_fit", "更愿意从价格、价值和匹配度判断选择。", "More willing to judge choices through price, value, and fit."),
      B: lensProfile("07_engineering_systems", "logistics_flow", "更愿意负责安排流程、时间和执行细节。", "More willing to manage flow, timing, and execution details."),
      C: lensProfile("02_meaning_expression", "atmosphere_memory", "更愿意负责氛围、表达和记忆感。", "More willing to handle atmosphere, expression, and memory."),
      D: lensProfile("10_services_experience", "guest_experience", "更愿意关注每个人的体验、需求和舒适度。", "More willing to care about people’s experience, needs, and comfort."),
    },
  },
  {
    id: "task-003",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "work",
    zh: { question: "团队要准备重要汇报。你最想负责哪部分？", options: { A: "明确目标，让内容服务决策。", B: "搭建结构，让逻辑更顺。", C: "打磨表达，让听众记住。", D: "检查数据和结论是否可靠。" } },
    en: { question: "Your team is preparing an important presentation. What would you handle?", options: { A: "Clarify the goal and support decisions.", B: "Build the structure and improve logic.", C: "Polish the message for memory.", D: "Check data and conclusion reliability." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "goal_decision_value", "更愿意负责目标、决策价值和业务重点。", "More willing to handle goals, decision value, and business priorities."),
      B: lensProfile("07_engineering_systems", "structure_logic", "更愿意负责结构、逻辑和系统组织。", "More willing to handle structure, logic, and system organization."),
      C: lensProfile("02_meaning_expression", "message_expression", "更愿意负责表达、叙事和记忆点。", "More willing to handle expression, narrative, and memory points."),
      D: lensProfile("05_evidence_patterns", "evidence_validation", "更愿意负责证据、数据和结论验证。", "More willing to handle evidence, data, and conclusion validation."),
    },
  },
  {
    id: "task-004",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "learning",
    zh: { question: "你和朋友一起学新技能。你最想负责哪件事？", options: { A: "制定目标和阶段成果。", B: "设计练习和反馈节奏。", C: "整理资料，形成知识结构。", D: "找到真实场景，把技能用起来。" } },
    en: { question: "You and a friend learn a new skill. What would you handle?", options: { A: "Set goals and milestone outcomes.", B: "Design practice and feedback rhythm.", C: "Organize materials into knowledge structure.", D: "Find real situations to use the skill." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "goal_milestone", "更愿意负责目标、里程碑和结果管理。", "More willing to handle goals, milestones, and outcome management."),
      B: lensProfile("01_learning_growth", "practice_feedback", "更愿意负责练习、反馈和能力成长。", "More willing to handle practice, feedback, and skill growth."),
      C: lensProfile("01_learning_growth", "knowledge_structure", "更愿意负责资料整理、结构化和理解框架。", "More willing to organize materials, structure, and understanding frameworks."),
      D: lensProfile("10_services_experience", "real_use_context", "更愿意负责真实使用场景和实践体验。", "More willing to create real-use situations and practical experiences."),
    },
  },
  {
    id: "task-005",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "digital_life",
    zh: { question: "你想减少无意识刷手机。你最想先做什么？", options: { A: "分析哪些 App 最消耗时间。", B: "重新设计手机界面和使用流程。", C: "找到更舒服的替代休息方式。", D: "理解自己什么时候最容易刷。" } },
    en: { question: "You want to reduce mindless phone scrolling. What would you start with?", options: { A: "Analyze which apps consume most time.", B: "Redesign the phone interface and flow.", C: "Find better alternative ways to rest.", D: "Understand when scrolling is most likely." } },
    optionProfiles: {
      A: lensProfile("05_evidence_patterns", "usage_data_pattern", "更愿意从数据、规律和使用模式入手。", "More willing to start from data, patterns, and usage behavior."),
      B: lensProfile("06_digital_systems_ai", "interface_information_flow", "更愿意从界面、信息流和数字系统入手。", "More willing to start from interface, information flow, and digital systems."),
      C: lensProfile("09_health_recovery", "rest_replacement", "更愿意从休息、恢复和替代行为入手。", "More willing to start from rest, recovery, and replacement behavior."),
      D: lensProfile("03_society_relationships", "behavior_context", "更愿意从行为情境、压力触发和生活关系入手。", "More willing to start from behavior context, stress triggers, and life relationships."),
    },
  },
  {
    id: "task-006",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "home",
    zh: { question: "你想让家里住起来更舒服。你最想先改哪里？", options: { A: "调整光线、声音和休息区域。", B: "重新规划收纳和动线。", C: "换掉不符合当下状态的物品。", D: "减少每天重复的小麻烦。" } },
    en: { question: "You want your home to feel more comfortable. What would you improve first?", options: { A: "Adjust light, sound, and rest areas.", B: "Redesign storage and movement flow.", C: "Remove items that no longer fit.", D: "Reduce repeated daily frictions." } },
    optionProfiles: {
      A: lensProfile("09_health_recovery", "restorative_environment", "更愿意从恢复、身体感受和休息环境入手。", "More willing to start from recovery, body feeling, and rest environment."),
      B: lensProfile("07_engineering_systems", "space_flow", "更愿意从空间结构、动线和系统整理入手。", "More willing to start from spatial structure, flow, and system organization."),
      C: lensProfile("02_meaning_expression", "identity_space", "更愿意从身份感、审美和生活阶段入手。", "More willing to start from identity, taste, and life stage."),
      D: lensProfile("10_services_experience", "daily_friction", "更愿意从日常触点、体验摩擦和生活便利入手。", "More willing to start from daily touchpoints, experience friction, and convenience."),
    },
  },
  {
    id: "task-007",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "career",
    zh: { question: "你要帮朋友梳理职业方向。你最想先做什么？", options: { A: "分析技能、机会和市场需求。", B: "梳理经历，找到成长主线。", C: "帮他表达清楚优势故事。", D: "了解压力、节奏和生活限制。" } },
    en: { question: "You help a friend think through career direction. What would you do first?", options: { A: "Analyze skills, opportunities, and market demand.", B: "Organize experience and find a growth path.", C: "Help express a clear strengths story.", D: "Understand stress, rhythm, and life limits." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "market_opportunity_fit", "更愿意从能力、机会和市场匹配入手。", "More willing to start from skills, opportunities, and market fit."),
      B: lensProfile("01_learning_growth", "growth_path", "更愿意从成长路径、经验沉淀和发展阶段入手。", "More willing to start from growth path, experience capture, and development stage."),
      C: lensProfile("02_meaning_expression", "personal_narrative", "更愿意从表达、叙事和个人品牌入手。", "More willing to start from expression, narrative, and personal branding."),
      D: lensProfile("09_health_recovery", "life_sustainability", "更愿意从压力、节奏和长期可持续状态入手。", "More willing to start from stress, rhythm, and long-term sustainability."),
    },
  },
  {
    id: "task-008",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "shopping",
    zh: { question: "家里要买一件耐用大件。你最想负责哪部分？", options: { A: "比较价格、保修和长期成本。", B: "研究材料、结构和可靠性。", C: "确认是否适合真实使用习惯。", D: "考虑资源浪费和长期可持续。" } },
    en: { question: "Your family needs a durable household item. What would you handle?", options: { A: "Compare price, warranty, and long-term cost.", B: "Research materials, structure, and reliability.", C: "Check fit with real usage habits.", D: "Consider waste and long-term sustainability." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "total_cost", "更愿意负责价格、保修和长期成本判断。", "More willing to handle price, warranty, and long-term cost judgment."),
      B: lensProfile("07_engineering_systems", "material_reliability", "更愿意负责材料、结构和可靠性判断。", "More willing to handle material, structure, and reliability judgment."),
      C: lensProfile("10_services_experience", "usage_fit", "更愿意负责真实使用习惯和体验适配。", "More willing to handle real usage habits and experience fit."),
      D: lensProfile("08_natural_systems_sustainability", "resource_sustainability", "更愿意负责资源、浪费和长期可持续性。", "More willing to handle resources, waste, and long-term sustainability."),
    },
  },
  {
    id: "task-009",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "event",
    zh: { question: "你们要办一个小型分享活动。你最想负责哪件事？", options: { A: "明确主题和目标人群。", B: "安排流程、时间和现场动线。", C: "设计海报、文案和氛围。", D: "照顾参与者体验和互动。" } },
    en: { question: "You are organizing a small sharing event. What would you handle?", options: { A: "Clarify theme and target audience.", B: "Plan agenda, timing, and movement flow.", C: "Design posters, copy, and atmosphere.", D: "Care for participant experience and interaction." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "audience_goal_positioning", "更愿意负责目标、人群定位和价值判断。", "More willing to handle goals, audience positioning, and value judgment."),
      B: lensProfile("07_engineering_systems", "event_flow_design", "更愿意负责流程、时间和现场系统安排。", "More willing to handle flow, timing, and on-site system arrangement."),
      C: lensProfile("02_meaning_expression", "visual_message_atmosphere", "更愿意负责视觉、文案和氛围表达。", "More willing to handle visuals, copy, and atmosphere."),
      D: lensProfile("10_services_experience", "participant_experience", "更愿意负责参与者体验、互动和服务细节。", "More willing to handle participant experience, interaction, and service details."),
    },
  },
  {
    id: "task-010",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "personal_project",
    zh: { question: "你要启动一个个人项目。你最想先做哪件事？", options: { A: "确认它解决什么真实问题。", B: "搭出最小可行结构。", C: "想清楚它的名字和表达。", D: "找到第一批真实反馈。" } },
    en: { question: "You are starting a personal project. What would you do first?", options: { A: "Clarify what real problem it solves.", B: "Build the smallest workable structure.", C: "Clarify its name and expression.", D: "Find the first real feedback." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "problem_value_fit", "更愿意从真实问题、价值和方向判断入手。", "More willing to start from real problems, value, and direction judgment."),
      B: lensProfile("07_engineering_systems", "minimum_viable_structure", "更愿意从最小结构、系统搭建和落地路径入手。", "More willing to start from minimum structure, system building, and implementation path."),
      C: lensProfile("02_meaning_expression", "naming_expression_identity", "更愿意从命名、表达和身份感入手。", "More willing to start from naming, expression, and identity."),
      D: lensProfile("03_society_relationships", "real_feedback_people", "更愿意从真实反馈、人群反应和关系连接入手。", "More willing to start from real feedback, people’s reactions, and relationship connection."),
    },
  },
  {
    id: "task-011",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "health",
    zh: { question: "你想建立稳定运动习惯。你最想先处理哪件事？", options: { A: "设定清楚目标和进度。", B: "设计低门槛训练流程。", C: "跟踪身体反馈和恢复。", D: "找到能一起坚持的人。" } },
    en: { question: "You want to build a stable exercise habit. What would you handle first?", options: { A: "Set clear goals and progress.", B: "Design a low-friction training routine.", C: "Track body feedback and recovery.", D: "Find people to stay consistent with." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "goal_progress_management", "更愿意从目标、进度和结果管理入手。", "More willing to start from goals, progress, and outcome management."),
      B: lensProfile("07_engineering_systems", "low_friction_routine", "更愿意从低阻力流程和习惯系统入手。", "More willing to start from low-friction routines and habit systems."),
      C: lensProfile("09_health_recovery", "body_feedback_recovery", "更愿意从身体反馈、恢复和长期状态入手。", "More willing to start from body feedback, recovery, and long-term condition."),
      D: lensProfile("03_society_relationships", "social_support_consistency", "更愿意从社交支持、陪伴和群体影响入手。", "More willing to start from social support, companionship, and group influence."),
    },
  },
  {
    id: "task-012",
    subject: "00",
    questionMode: "task_preference_probe",
    scenarioType: "community",
    zh: { question: "你要帮助一个小社群变得更活跃。你最想负责哪部分？", options: { A: "明确社群定位和成员价值。", B: "设计固定活动和参与机制。", C: "观察成员关系和互动习惯。", D: "打磨社群语言和共同记忆。" } },
    en: { question: "You want to make a small community more active. What would you handle?", options: { A: "Clarify positioning and member value.", B: "Design regular activities and participation mechanisms.", C: "Observe relationships and interaction habits.", D: "Shape community language and shared memory." } },
    optionProfiles: {
      A: lensProfile("04_business_management", "community_value_positioning", "更愿意负责定位、成员价值和资源判断。", "More willing to handle positioning, member value, and resource judgment."),
      B: lensProfile("07_engineering_systems", "participation_mechanism", "更愿意负责机制、流程和持续参与设计。", "More willing to handle mechanisms, processes, and sustained participation design."),
      C: lensProfile("03_society_relationships", "relationship_interaction_pattern", "更愿意负责关系结构、互动习惯和群体行为观察。", "More willing to handle relationship structures, interaction habits, and group behavior."),
      D: lensProfile("02_meaning_expression", "shared_language_memory", "更愿意负责共同语言、故事和记忆感。", "More willing to handle shared language, stories, and memory."),
    },
  },
];

const challengeSubjects = categories.map((category) => category.code);
const knowledgeLensLabels = {
  "00": { en: "General Thinking", zh: "综合判断" },
  "01": { en: "Learning & Growth", zh: "学习与成长" },
  "02": { en: "Meaning & Expression", zh: "人文与表达" },
  "03": { en: "Society & Relationships", zh: "社会与关系" },
  "04": { en: "Business & Management", zh: "商务与管理" },
  "05": { en: "Evidence & Patterns", zh: "证据与规律" },
  "06": { en: "Digital Systems & AI", zh: "数字系统与 AI" },
  "07": { en: "Engineering & Systems", zh: "工程与系统" },
  "08": { en: "Natural Systems & Sustainability", zh: "自然系统与可持续" },
  "09": { en: "Health & Recovery", zh: "健康与恢复" },
  "10": { en: "Services & Experience", zh: "服务与体验" },
};
const challengeState = Object.fromEntries(challengeSubjects.map((code) => [code, {
  correct: 0,
  answered: [],
}]));
const knowledgeTitleRules = {
  en: [
    { min: 90, title: "Legendary Mind" },
    { min: 80, title: "All-Round Explorer" },
    { min: 70, title: "Wide-Ranging Thinker" },
    { min: 60, title: "Steady Learner" },
    { min: 50, title: "Knowledge in Progress" },
    { min: 0, title: "Mist Explorer" },
  ],
  zh: [
    { min: 90, title: "绝世天才" },
    { min: 80, title: "全才探索家" },
    { min: 70, title: "博古通今" },
    { min: 60, title: "稳健学习者" },
    { min: 50, title: "知识修炼中" },
    { min: 0, title: "迷雾探索者" },
  ],
};
const explorerTitleRules = {
  en: [
    { min: 1000, title: "Knowledge Map Master" },
    { min: 500, title: "Grand Knowledge Navigator" },
    { min: 200, title: "Full-Spectrum Explorer" },
    { min: 100, title: "Knowledge Voyager" },
    { min: 60, title: "Map Pathfinder" },
    { min: 50, title: "Wide-Angle Thinker" },
    { min: 40, title: "Deep Explorer" },
    { min: 30, title: "Knowledge Walker" },
    { min: 20, title: "Map Starter" },
  ],
  zh: [
    { min: 1000, title: "图谱大师" },
    { min: 500, title: "知识领航者" },
    { min: 200, title: "全域探索者" },
    { min: 100, title: "知识航海家" },
    { min: 60, title: "地图开拓者" },
    { min: 50, title: "广角思考者" },
    { min: 40, title: "深度探索者" },
    { min: 30, title: "知识行者" },
    { min: 20, title: "知识启航者" },
  ],
};
const milestoneModalThresholds = [20, 30, 40, 50, 60, 100, 200, 500, 1000];
const masteryProgress = Object.fromEntries(challengeSubjects.map((code) => [code, "ocean"]));
let activeChallengeSubject = challengeSubjects[0];
let activeChallengeQuestion = null;
let currentAnsweredQuestion = null;
let challengeHistory = [];
let challengeReviewIndex = null;
let challengeQuestionPool = [];
let challengePoolIndex = 0;
let lastTitleModalAt = 0;
let activeTitleModalStats = null;
let challengeRoundComplete = false;
let reflectionOutput = null;
let reflectionStatus = "idle";
let reflectionApiStatus = "not-generated";
let lastReflectionInput = null;
let deepPromptCopied = false;
let lensResultGenerated = false;
let lensPromptCopied = false;
let founderMessages = [];
let founderMessageStatus = { state: "idle", loaded: 0, detail: "" };
let pdcState = createPdcBaseState();
const pdcMaxNormalRound = 5;
let pdcPlaybackTimer = null;
let pdcWarmupTimer = null;
let pdcFounderSummary = null;
let pdcFounderStatus = { state: "idle", detail: "" };
const pdcFounderAccessSessionKey = "mapkaiPdcFounderAccessValidated";

function createPdcBaseState(overrides = {}) {
  return {
    pass: "",
    valid: false,
    status: "idle",
    message: "",
    entryView: "landing",
    selectedMode: "personal",
    question: "",
    recap: null,
    founderPreview: false,
    councilTier: "standard",
    requestedTier: "standard",
    effectiveTier: "standard",
    phaseModel: "",
    finalModel: "",
    founderOnlyFullFunction: false,
    demoMode: false,
    demoFinalVisible: false,
    selectedPersonaId: "",
    activeRoundIndex: 0,
    pdcPhases: [],
    activeRosterIds: [],
    observerRosterIds: [],
    archivedObservers: {},
    finalReintroducedPerspective: null,
    finalRoundPreviewShown: false,
    finalRoundPreviewAccepted: false,
    finalRoundPreviewSelection: "",
    finalReenableSkippedReason: "",
    finalRecapLoading: false,
    advancedAuditLoading: false,
    advancedAudit: null,
    advancedAuditError: "",
    advancedAuditManualTrigger: false,
    advancedAuditDuplicateCallBlocked: false,
    advancedAuditCompletedSessionId: "",
    providerDiagnostics: null,
    userInterventions: [],
    discussionStopped: false,
    phaseLoading: false,
    phaseMessage: "",
    playback: null,
    warmup: null,
    warmupDiagnostics: null,
    memberHistory: {},
    feedbackSubmitted: false,
    finalReenabledObserverMeta: null,
    reEnabledObserverSelectionSource: "",
    reEnabledObserverWasActiveMemberBlocked: false,
    reEnabledObserverCandidateInvalidReason: "",
    pdcSessionId: "",
    sessionResetApplied: false,
    initialRoundNumber: 0,
    initialMeetingMemoryItemCount: 0,
    previousSessionCleared: false,
    ...overrides,
  };
}

function createPdcSessionId() {
  return `pdc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function hasPdcSessionStateToClear() {
  return Boolean(
    pdcState.recap
    || pdcState.warmup
    || pdcState.playback
    || pdcState.providerDiagnostics
    || pdcState.finalReintroducedPerspective
    || pdcState.discussionStopped
    || pdcState.phaseLoading
    || pdcState.finalRecapLoading
    || pdcState.finalRoundPreviewShown
    || pdcState.finalRoundPreviewAccepted
    || pdcState.finalRoundPreviewSelection
    || pdcState.finalReenableSkippedReason
    || (Array.isArray(pdcState.pdcPhases) && pdcState.pdcPhases.length > 0)
    || (Array.isArray(pdcState.activeRosterIds) && pdcState.activeRosterIds.length > 0)
    || (Array.isArray(pdcState.observerRosterIds) && pdcState.observerRosterIds.length > 0)
    || (Array.isArray(pdcState.userInterventions) && pdcState.userInterventions.length > 0)
    || Object.keys(pdcState.archivedObservers || {}).length > 0
    || Object.keys(pdcState.memberHistory || {}).length > 0
  );
}

function resetPdcSessionState({ question = "", status = "ready", message = "" } = {}) {
  clearPdcPlaybackTimer();
  clearPdcWarmupTimer();
  const previousSessionCleared = hasPdcSessionStateToClear() || pdcState.sessionResetApplied === true;
  Object.assign(pdcState, {
    status,
    message,
    question,
    entryView: "standard",
    recap: null,
    demoMode: false,
    demoFinalVisible: false,
    selectedPersonaId: "",
    activeRoundIndex: 0,
    pdcPhases: [],
    activeRosterIds: [],
    observerRosterIds: [],
    archivedObservers: {},
    finalReintroducedPerspective: null,
    finalRoundPreviewShown: false,
    finalRoundPreviewAccepted: false,
    finalRoundPreviewSelection: "",
    finalReenabledObserverMeta: null,
    finalReenableSkippedReason: "",
    reEnabledObserverSelectionSource: "",
    reEnabledObserverWasActiveMemberBlocked: false,
    reEnabledObserverCandidateInvalidReason: "",
    finalRecapLoading: false,
    advancedAuditLoading: false,
    advancedAudit: null,
    advancedAuditError: "",
    advancedAuditManualTrigger: false,
    advancedAuditDuplicateCallBlocked: false,
    advancedAuditCompletedSessionId: "",
    providerDiagnostics: null,
    userInterventions: [],
    discussionStopped: false,
    phaseLoading: false,
    phaseMessage: "",
    playback: null,
    warmup: null,
    warmupDiagnostics: null,
    memberHistory: {},
    feedbackSubmitted: false,
    pdcSessionId: createPdcSessionId(),
    sessionResetApplied: true,
    initialRoundNumber: 1,
    initialMeetingMemoryItemCount: 0,
    previousSessionCleared,
  });
}

const pdcWarmupPersonas = [
  { id: "ethan-shen", englishName: "Rex Velocity", name: "Rex Velocity", role: "Facts & Evidence", responsibility: "Review evidence and missing information." },
  { id: "clara-lin", englishName: "Vera Flow", name: "Vera Flow", role: "Emotion & Inner Desire", responsibility: "Check emotional pressure and desire." },
  { id: "marcus-lu", englishName: "Max Build", name: "Max Build", role: "Risk & Downside", responsibility: "Stress-test downside and cost." },
  { id: "adrian-xu", englishName: "Nina Ember", name: "Nina Ember", role: "Opportunity & Long View", responsibility: "Check long-term opportunity." },
  { id: "felix-jiang", englishName: "Wang Zhibai", name: "Wang Zhibai", role: "Creativity & Third Path", responsibility: "Look for a third path." },
  { id: "iris-song", englishName: "Owen Insight", name: "Owen Insight", role: "Blind Spots & Self-Deception", responsibility: "Check blind spots." },
  { id: "julian-cheng", englishName: "Adrian North", name: "Adrian North", role: "Relationships & Social Impact", responsibility: "Check relationship impact." },
  { id: "caleb-gu", englishName: "Mira Ethos", name: "Mira Ethos", role: "Time, Energy & Sustainability", responsibility: "Check time and energy." },
  { id: "orion-zhuge", englishName: "Orion Zhuge", name: "诸葛观辰", role: "Timing & Momentum", responsibility: "Check timing and momentum." },
];
const PDC_DEMO_SCRIPT = {
  topic: {
    en: "A small team is deciding whether to publish a simple checklist before building a full product. Should they launch the checklist now or wait until the full product is ready?",
    zh: "一个小团队正在决定是否先发布一个简单清单，再开发完整产品。应该现在发布清单，还是等完整产品准备好？",
  },
  rounds: [
    {
      id: "demo-round-1a",
      roundNumber: 1,
      phaseType: "A",
      label: {
        en: "Round 1A — Initial Positions",
        zh: "第 1 轮 A — 初始立场",
      },
      statements: [
        ["ethan-shen", "Rex Velocity", "Facts & Evidence", "The checklist can test whether people actually have the problem before the team spends months building a product."],
        ["clara-lin", "Vera Flow", "Emotion & Inner Desire", "The team should notice whether the checklist feels useful and honest, not like a placeholder pretending to be a product."],
        ["marcus-lu", "Max Build", "Risk & Downside", "Launching a checklist is low risk, but only if the team keeps it narrow and does not quietly turn it into another product."],
        ["adrian-xu", "Nina Ember", "Opportunity & Long View", "A checklist can become a small doorway into the full product if it teaches one repeatable habit."],
        ["felix-jiang", "Wang Zhibai", "Creativity & Third Path", "They could publish the checklist as both a helpful resource and a simple way to learn what users ask for next."],
        ["iris-song", "Owen Insight", "Blind Spots & Self-Deception", "The hidden trap is treating downloads or compliments as proof that a full product is needed."],
        ["julian-cheng", "Adrian North", "Relationships & Social Impact", "A checklist is easy for supporters to share and easier for potential users to understand than an unfinished product promise."],
        ["caleb-gu", "Mira Ethos", "Time, Energy & Sustainability", "This is worth doing only if the checklist can be maintained without distracting from the full-product decision."],
        ["orion-zhuge", "Orion Zhuge", "Timing & Momentum", "The timing favors a small public test because waiting for a full product may hide weak assumptions for too long."],
      ],
    },
    {
      id: "demo-round-1b",
      roundNumber: 1,
      phaseType: "B",
      label: {
        en: "Round 1B — Challenge & Voting",
        zh: "第 1 轮 B — 挑战与投票",
      },
      statements: [
        ["ethan-shen", "Rex Velocity", "Facts & Evidence", "I challenge Owen Insight: the concern is real, but the checklist is exactly how we avoid guessing about demand.", "challenge", "iris-song", "Owen Insight", "marcus-lu", "Max Build", "The risk boundary keeps the experiment honest.", "felix-jiang", "Wang Zhibai", "The learning plan may become too broad for a simple checklist."],
        ["clara-lin", "Vera Flow", "Emotion & Inner Desire", "I challenge Rex Velocity: evidence matters, but the team should define what kind of user response would actually feel meaningful.", "challenge", "ethan-shen", "Rex Velocity", "iris-song", "Owen Insight", "The blind-spot warning prevents false confidence.", "ethan-shen", "Rex Velocity", "Numbers alone may not explain whether the checklist helps."],
        ["marcus-lu", "Max Build", "Risk & Downside", "I challenge Wang Zhibai: learning from users is good, but adding too many questions can make the checklist feel heavier than it needs to be.", "challenge", "felix-jiang", "Wang Zhibai", "caleb-gu", "Mira Ethos", "The maintenance limit protects the team's attention.", "felix-jiang", "Wang Zhibai", "The idea needs a stricter boundary."],
        ["adrian-xu", "Nina Ember", "Opportunity & Long View", "I challenge Max Build: if the checklist is too cautious, it may not teach whether a full product has room to grow.", "challenge", "marcus-lu", "Max Build", "ethan-shen", "Rex Velocity", "The evidence test gives the team a real next signal.", "clara-lin", "Vera Flow", "Emotional fit matters, but it should not block a small test."],
        ["felix-jiang", "Wang Zhibai", "Creativity & Third Path", "I build on Nina Ember: keep the checklist simple, but add one optional question that reveals what users want next.", "build", "adrian-xu", "Nina Ember", "adrian-xu", "Nina Ember", "The long-view bridge keeps the checklist connected to the product.", "marcus-lu", "Max Build", "Risk control could make the checklist too forgettable."],
        ["iris-song", "Owen Insight", "Blind Spots & Self-Deception", "I challenge Adrian North: sharing is useful, but shares should not be mistaken for proof that people need the full product.", "challenge", "julian-cheng", "Adrian North", "caleb-gu", "Mira Ethos", "The energy boundary blocks approval-chasing.", "julian-cheng", "Adrian North", "Social clarity is secondary to actual usefulness."],
        ["julian-cheng", "Adrian North", "Relationships & Social Impact", "I challenge Mira Ethos: if the checklist is too hidden or plain, supporters may not know how to explain it to others.", "challenge", "caleb-gu", "Mira Ethos", "felix-jiang", "Wang Zhibai", "The optional user question can make sharing more informative.", "iris-song", "Owen Insight", "The warning is valid but may underuse the value of easy sharing."],
        ["caleb-gu", "Mira Ethos", "Time, Energy & Sustainability", "I challenge Nina Ember: long-term opportunity is not enough unless the checklist has a clear maintenance limit.", "challenge", "adrian-xu", "Nina Ember", "marcus-lu", "Max Build", "The risk frame gives the launch a sustainable boundary.", "adrian-xu", "Nina Ember", "The opportunity case needs a smaller first commitment."],
        ["orion-zhuge", "Orion Zhuge", "Timing & Momentum", "I clarify Rex Velocity: the right timing is not a full launch; it is a small public signal that reveals whether the problem is real.", "clarify", "ethan-shen", "Rex Velocity", "ethan-shen", "Rex Velocity", "The evidence frame best fits the current uncertainty.", "felix-jiang", "Wang Zhibai", "The learning layer should wait until the first signal is clearer."],
      ],
      voteSummary: {
        leadingContributor: { speakerId: "ethan-shen", speakerName: "Rex Velocity", count: 3, reasonSummary: "The council values the checklist as a simple evidence test." },
        mostPressuredPerspective: { speakerId: "felix-jiang", speakerName: "Wang Zhibai", count: 3, reasonSummary: "The optional learning layer is useful but risks expanding scope too early." },
      },
      blueWhaleSummary: {
        text: "The council is not deciding the full product yet. It is deciding whether a checklist can create a small public evidence test. The strongest tension is between learning enough from users and keeping the checklist simple.",
        convergenceLevel: "medium",
      },
    },
    {
      id: "demo-round-2a",
      roundNumber: 2,
      phaseType: "A",
      label: {
        en: "Round 2A — Updated Positions",
        zh: "第 2 轮 A — 更新立场",
      },
      statements: [
        ["ethan-shen", "Rex Velocity", "Facts & Evidence", "I am more supportive now, but only if the team defines one measurable response: saves, replies, or repeat visits."],
        ["clara-lin", "Vera Flow", "Emotion & Inner Desire", "I can support the checklist if it feels genuinely helpful, not like a thin advertisement for something unfinished."],
        ["marcus-lu", "Max Build", "Risk & Downside", "My position tightens: launch it only with fixed scope, a short review window, and a clear stop condition."],
        ["adrian-xu", "Nina Ember", "Opportunity & Long View", "I still support launching it, but the checklist should teach the one habit the full product may later deepen."],
        ["felix-jiang", "Wang Zhibai", "Creativity & Third Path", "I accept the scope pressure and would reduce my idea to one optional feedback question at the end."],
        ["iris-song", "Owen Insight", "Blind Spots & Self-Deception", "My concern becomes sharper: the team should write what signal would disprove the need for a full product."],
        ["julian-cheng", "Adrian North", "Relationships & Social Impact", "I still see sharing value, but it should come after the checklist is genuinely useful."],
        ["caleb-gu", "Mira Ethos", "Time, Energy & Sustainability", "I can support a first release if the team can maintain it calmly for three weeks without delaying the main decision."],
        ["orion-zhuge", "Orion Zhuge", "Timing & Momentum", "The moment favors a small controlled release, not waiting for a polished full product."],
      ],
    },
    {
      id: "demo-round-2b",
      roundNumber: 2,
      phaseType: "B",
      label: {
        en: "Round 2B — Challenge, Contribution Vote & Concern Vote",
        zh: "第 2 轮 B — 挑战、贡献票与顾虑票",
      },
      statements: [
        ["ethan-shen", "Rex Velocity", "Facts & Evidence", "I challenge Vera Flow: usefulness matters, but the first release still needs behavior evidence, not just a good feeling.", "challenge", "clara-lin", "Vera Flow", "marcus-lu", "Max Build", "The stop condition makes the experiment responsible.", "clara-lin", "Vera Flow", "The emotional filter could slow the test too much."],
        ["clara-lin", "Vera Flow", "Emotion & Inner Desire", "I challenge Rex Velocity: evidence without a clear interpretation can produce numbers that do not answer the product question.", "challenge", "ethan-shen", "Rex Velocity", "iris-song", "Owen Insight", "The disproof signal protects the team from self-deception.", "ethan-shen", "Rex Velocity", "Evidence needs a clearer meaning frame."],
        ["marcus-lu", "Max Build", "Risk & Downside", "I challenge Nina Ember: teaching a future habit is good, but it must fit inside a short review window.", "challenge", "adrian-xu", "Nina Ember", "caleb-gu", "Mira Ethos", "The three-week maintenance limit is the strongest practical guardrail.", "adrian-xu", "Nina Ember", "The long-view habit could invite extra features."],
        ["adrian-xu", "Nina Ember", "Opportunity & Long View", "I build on Max Build: the fixed scope should define the smallest habit that still teaches whether a product is worth building.", "build", "marcus-lu", "Max Build", "ethan-shen", "Rex Velocity", "The measurement frame helps the team learn fast.", "felix-jiang", "Wang Zhibai", "The optional feedback layer remains less essential than proof of need."],
        ["felix-jiang", "Wang Zhibai", "Creativity & Third Path", "I accept observer status if the council needs to narrow; my remaining note is to keep one optional feedback question.", "clarify", "adrian-xu", "Nina Ember", "adrian-xu", "Nina Ember", "The habit bridge keeps the checklist connected to the future product.", "felix-jiang", "Wang Zhibai", "The feedback layer is still easiest to overextend."],
        ["iris-song", "Owen Insight", "Blind Spots & Self-Deception", "I challenge Adrian North: sharing should be treated as a secondary signal after actual usefulness.", "challenge", "julian-cheng", "Adrian North", "marcus-lu", "Max Build", "The stop condition prevents identity-driven overwork.", "julian-cheng", "Adrian North", "Social spread could tempt the team into optimizing the wrong thing."],
        ["julian-cheng", "Adrian North", "Relationships & Social Impact", "I build on Owen Insight: sharing should be allowed but not designed as the main success metric yet.", "build", "iris-song", "Owen Insight", "caleb-gu", "Mira Ethos", "The sustainability frame protects long-term trust.", "felix-jiang", "Wang Zhibai", "The feedback cue should stay minimal."],
        ["caleb-gu", "Mira Ethos", "Time, Energy & Sustainability", "I challenge everyone: if the checklist cannot be maintained calmly, the decision should pause until the scope is smaller.", "challenge", "adrian-xu", "Nina Ember", "marcus-lu", "Max Build", "The fixed boundary turns the checklist from ambition into an experiment.", "felix-jiang", "Wang Zhibai", "The feedback layer remains the clearest maintenance risk."],
        ["orion-zhuge", "Orion Zhuge", "Timing & Momentum", "I clarify the group: the right move is a controlled checklist release with a review point, not an open-ended product commitment.", "clarify", "caleb-gu", "Mira Ethos", "caleb-gu", "Mira Ethos", "The timing signal is strongest when paired with a sustainability limit.", "felix-jiang", "Wang Zhibai", "The feedback layer should move into observer status until the core signal is proven."],
      ],
      voteSummary: {
        leadingContributor: { speakerId: "marcus-lu", speakerName: "Max Build", count: 3, reasonSummary: "The fixed scope and stop condition turn the checklist into a bounded experiment." },
        mostPressuredPerspective: { speakerId: "felix-jiang", speakerName: "Wang Zhibai", count: 4, reasonSummary: "The optional feedback layer is useful later, but it is the most likely source of scope expansion now." },
      },
      rosterUpdate: {
        shouldArchivePerspective: true,
        archivedSpeakerId: "felix-jiang",
        archivedSpeakerName: "Wang Zhibai",
        reason: "the council wants the first checklist to prove practical demand before adding a broader feedback layer",
      },
      blueWhaleSummary: {
        text: "The council has compressed the decision into a conditional yes: release the checklist only if it measures one behavior, stays within a short review window, and has a clear stop condition. Wang Zhibai's feedback layer moves to observer status for now, so the first release does not overextend before usefulness is proven.",
        convergenceLevel: "high",
        shouldConsiderStopping: true,
      },
    },
  ],
  finalRecap: {
    en: "Demo script — no AI used. The council does not simply support or reject the checklist. It narrows the decision into a bounded next step: publish the checklist if it measures one concrete user response, can be maintained calmly for three weeks, and includes a stop condition before the team commits to a full product.",
    zh: "示例演示 — 未使用 AI。这个委员会没有简单支持或反对清单，而是把问题压缩成一个有边界的下一步：如果清单能衡量一个具体用户反应、三周内可以平稳维护，并且在团队投入完整产品前有明确停止条件，就可以发布。",
  },
};
let activePdcDemoScript = PDC_DEMO_SCRIPT;
const pdcWarmupStages = [
  {
    "blue-whale": "Blue Whale is preparing the council...",
    "ethan-shen": "Rex Velocity is reviewing evidence...",
    "clara-lin": "Vera Flow is checking emotional pressure...",
    "marcus-lu": "Max Build is stress-testing downside...",
    "adrian-xu": "Nina Ember is checking long-term opportunity...",
    "felix-jiang": "Wang Zhibai is looking for a third path...",
    "iris-song": "Owen Insight is checking blind spots...",
    "julian-cheng": "Adrian North is checking relationship impact...",
    "caleb-gu": "Mira Ethos is checking time and energy...",
    "orion-zhuge": "Orion Zhuge is checking timing and momentum...",
  },
  {
    "blue-whale": "Blue Whale is aligning the council rhythm...",
    "ethan-shen": "Rex Velocity has found the facts that need checking...",
    "clara-lin": "Vera Flow has sensed the emotional pressure point...",
    "marcus-lu": "Max Build has found the main downside to test...",
    "adrian-xu": "Nina Ember has spotted the long-term opening...",
    "felix-jiang": "Wang Zhibai has found a possible alternative route...",
    "iris-song": "Owen Insight has detected a possible self-deception risk...",
    "julian-cheng": "Adrian North has mapped who may be affected...",
    "caleb-gu": "Mira Ethos has noticed the energy cost...",
    "orion-zhuge": "Orion Zhuge has read the timing signal...",
  },
  {
    "blue-whale": "Blue Whale is organizing the first round...",
    "ethan-shen": "Rex Velocity is building the evidence frame...",
    "clara-lin": "Vera Flow is shaping the inner-desire question...",
    "marcus-lu": "Max Build is arranging the risk warning...",
    "adrian-xu": "Nina Ember is ranking the long-term upside...",
    "felix-jiang": "Wang Zhibai is turning alternatives into options...",
    "iris-song": "Owen Insight is sharpening the mirror question...",
    "julian-cheng": "Adrian North is weighing relationship consequences...",
    "caleb-gu": "Mira Ethos is balancing time and sustainability...",
    "orion-zhuge": "Orion Zhuge is setting the momentum frame...",
  },
  {
    "blue-whale": "Blue Whale is connecting the council to your decision...",
    "ethan-shen": "Rex Velocity is tying evidence back to the question...",
    "clara-lin": "Vera Flow is checking what the choice may emotionally cost...",
    "marcus-lu": "Max Build is checking what could go wrong first...",
    "adrian-xu": "Nina Ember is checking what future this decision may open...",
    "felix-jiang": "Wang Zhibai is checking whether there is a third path...",
    "iris-song": "Owen Insight is checking what assumption may be hidden...",
    "julian-cheng": "Adrian North is checking who else may be affected...",
    "caleb-gu": "Mira Ethos is checking whether the choice can be sustained...",
    "orion-zhuge": "Orion Zhuge is checking whether the timing supports action...",
  },
  {
    "blue-whale": "Blue Whale is identifying the main disagreement...",
    "ethan-shen": "Rex Velocity is preparing a factual challenge...",
    "clara-lin": "Vera Flow is preparing an emotional counterpoint...",
    "marcus-lu": "Max Build is preparing the downside case...",
    "adrian-xu": "Nina Ember is preparing the opportunity case...",
    "felix-jiang": "Wang Zhibai is preparing an alternative option...",
    "iris-song": "Owen Insight is preparing a blind-spot challenge...",
    "julian-cheng": "Adrian North is preparing a relationship check...",
    "caleb-gu": "Mira Ethos is preparing an energy constraint...",
    "orion-zhuge": "Orion Zhuge is preparing a timing challenge...",
  },
  {
    "blue-whale": "Blue Whale is narrowing the first conflict...",
    "ethan-shen": "Rex Velocity is selecting the most useful evidence...",
    "clara-lin": "Vera Flow is separating desire from pressure...",
    "marcus-lu": "Max Build is separating risk from fear...",
    "adrian-xu": "Nina Ember is separating opportunity from fantasy...",
    "felix-jiang": "Wang Zhibai is separating real options from distractions...",
    "iris-song": "Owen Insight is separating insight from self-protection...",
    "julian-cheng": "Adrian North is separating support from social pressure...",
    "caleb-gu": "Mira Ethos is separating ambition from capacity...",
    "orion-zhuge": "Orion Zhuge is separating timing from impatience...",
  },
  {
    "blue-whale": "Blue Whale is preparing the speaking order...",
    "ethan-shen": "Rex Velocity is readying an evidence-based view...",
    "clara-lin": "Vera Flow is readying the emotional signal...",
    "marcus-lu": "Max Build is readying the risk test...",
    "adrian-xu": "Nina Ember is readying the long-view argument...",
    "felix-jiang": "Wang Zhibai is readying the third-path proposal...",
    "iris-song": "Owen Insight is readying the mirror question...",
    "julian-cheng": "Adrian North is readying the social-impact view...",
    "caleb-gu": "Mira Ethos is readying the sustainability check...",
    "orion-zhuge": "Orion Zhuge is readying the timing frame...",
  },
  {
    "blue-whale": "Blue Whale is waiting for the final council synthesis...",
    "ethan-shen": "Rex Velocity is holding the evidence frame...",
    "clara-lin": "Vera Flow is holding the emotional signal...",
    "marcus-lu": "Max Build is holding the downside test...",
    "adrian-xu": "Nina Ember is holding the opportunity frame...",
    "felix-jiang": "Wang Zhibai is holding the alternative path...",
    "iris-song": "Owen Insight is holding the blind-spot mirror...",
    "julian-cheng": "Adrian North is holding the relationship map...",
    "caleb-gu": "Mira Ethos is holding the energy boundary...",
    "orion-zhuge": "Orion Zhuge is holding the timing signal...",
  },
];
const pdcWarmupStageDurationMs = 5000;

function createPdcDemoRecap() {
  const demoScript = activePdcDemoScript || PDC_DEMO_SCRIPT;
  const personas = pdcWarmupPersonas.map((persona) => ({ ...persona }));
  const phases = demoScript.rounds.map((round) => ({
    id: round.id,
    label: `${round.label.en} / ${round.label.zh}`,
    phaseLabel: `${round.label.en} / ${round.label.zh}`,
    roundNumber: round.roundNumber,
    phaseType: round.phaseType,
    provider: "demo",
    dialogue: round.statements.map((item) => {
      const source = Array.isArray(item) ? null : item;
      const [
        speakerId,
        speakerName,
        role,
        text,
        stanceType = "",
        targetSpeakerId = "",
        targetSpeakerName = "",
        contributionTargetId = "",
        contributionTargetName = "",
        contributionReason = "",
        concernTargetId = "",
        concernTargetName = "",
        concernReason = "",
      ] = Array.isArray(item) ? item : [];
      const resolvedSpeakerName = source?.speakerName || speakerName;
      return {
        speakerId: source?.speakerId || speakerId,
        speakerName: resolvedSpeakerName,
        speakerChineseName: resolvedSpeakerName === "Orion Zhuge" ? "诸葛观辰" : "",
        speakerLocalName: resolvedSpeakerName === "Orion Zhuge" ? "诸葛观辰" : "",
        role: source?.role || role,
        text: source?.text || text,
        stanceType: source?.stanceType || stanceType,
        targetSpeakerId: source?.targetSpeakerId || targetSpeakerId,
        targetSpeakerName: source?.targetSpeakerName || targetSpeakerName,
        stanceSummary: source?.stanceSummary || source?.text || text,
        contentSource: "demo-script",
        contributionVote: source?.contributionVote || (contributionTargetId ? { targetSpeakerId: contributionTargetId, targetSpeakerName: contributionTargetName, reason: contributionReason } : null),
        concernVote: source?.concernVote || (concernTargetId ? { targetSpeakerId: concernTargetId, targetSpeakerName: concernTargetName, reason: concernReason } : null),
      };
    }),
    blueWhaleSummary: {
      title: "Blue Whale Summary",
      text: round.blueWhaleSummary?.text || "",
      convergenceLevel: round.blueWhaleSummary?.convergenceLevel || "low",
      shouldConsiderStopping: round.blueWhaleSummary?.shouldConsiderStopping === true,
    },
    meetingMemory: createPdcMeetingMemory({ phaseType: round.phaseType, summaryText: round.blueWhaleSummary?.text || "" }),
    voteSummary: normalizePdcDemoVoteSummary(round.voteSummary, personas),
    rosterUpdate: normalizePdcDemoRosterUpdate(round),
    reintroducedPerspective: round.reintroducedPerspective || null,
    canContinue: true,
    canStopAndSummarize: true,
  }));
  return {
    title: "Public Demo",
    modeId: "demo",
    modeLabel: "Public Demo",
    isDemo: true,
    isPlaceholder: false,
    dialogueProvider: "demo",
    requestedProvider: "demo",
    actualProvider: "demo",
    fallbackUsed: false,
    modelName: "",
    placeholderNotice: "Demo script — no AI used. / 示例演示 — 未使用 AI。",
    councilRoom: {
      title: "PDC Council Room",
      subtitle: "Demo script — no AI used. / 示例演示 — 未使用 AI。",
      decisionOnTable: [demoScript.topic?.en, demoScript.topic?.zh].filter(Boolean).join("\n"),
      personas,
      sessionRoster: personas,
      dialogueProvider: "demo",
      currentRoundLabel: phases[0]?.label || "Round 1A — Initial Positions",
      dialogue: phases[0]?.dialogue || [],
      rounds: phases,
      facilitator: {
        id: "blue-whale",
        name: "蓝鲸",
        englishName: "Blue Whale",
        role: "Facilitator",
        summary: phases[0]?.blueWhaleSummary?.text || "",
        summaryTitle: "Blue Whale Summary",
      },
    },
    recap: {
      decisionFrame: demoScript.topic?.en || "Demo decision question",
      coreTension: demoScript.recap?.coreTension || "Whether the team should move fast with bounded experiments or slow down for careful planning.",
      councilHighlights: [
        ...(Array.isArray(demoScript.recap?.councilHighlights) ? demoScript.recap.councilHighlights : [
          "The council separates fast learning from irreversible commitment.",
          "Contribution votes favor clear criteria, capped downside, and a sustainable review rhythm.",
          "Observer perspectives remain available for final reflection.",
        ]),
      ],
      debateSnapshot: demoScript.recap?.debateSnapshot || "The council narrows the decision into a two-lane model: fast when learning is cheap and reversible, slow when mistakes are expensive and lasting.",
      condensedReview: demoScript.finalRecap?.en || "",
      finalRecommendation: demoScript.recap?.finalRecommendation || "Match the team's pace to the consequence of the decision.",
      nextActions: Array.isArray(demoScript.recap?.nextActions) ? demoScript.recap.nextActions : [
        "Classify the decision as Fast Lane or Careful Lane.",
        "Define one assumption, one signal, one cap, and one decision date.",
        "Review the result before committing to a larger move.",
      ],
      whatNotToDo: Array.isArray(demoScript.recap?.whatNotToDo) ? demoScript.recap.whatNotToDo : [
        "Do not use speed as an identity.",
        "Do not use planning as avoidance.",
        "Do not interpret results after the fact without pre-committed criteria.",
      ],
      reflectionNote: demoScript.finalRecap?.zh || "",
    },
  };
}

function normalizePdcDemoVoteSummary(summary, personas = []) {
  if (!summary) return null;
  if (summary.leadingContributor || summary.mostPressuredPerspective) return summary;
  const toRows = (votes = {}) => Object.entries(votes || {})
    .map(([speakerId, count]) => {
      const persona = personas.find((item) => item.id === speakerId) || {};
      return {
        targetSpeakerId: speakerId,
        targetSpeakerName: persona.englishName || persona.name || speakerId,
        speakerId,
        speakerName: persona.englishName || persona.name || speakerId,
        count: Number(count) || 0,
        reasons: [],
      };
    })
    .sort((a, b) => b.count - a.count);
  const contributionVotes = toRows(summary.contributionVotes || summary.finalContributionVotes);
  const concernVotes = toRows(summary.concernVotes);
  const leading = contributionVotes[0] || summary.starContributor || summary.operatingModelLead || null;
  const pressured = concernVotes[0] || summary.observerMoved || null;
  return {
    ...summary,
    contributionVotes,
    concernVotes,
    leadingContributor: leading ? {
      speakerId: leading.speakerId || leading.targetSpeakerId,
      speakerName: leading.speakerName || leading.targetSpeakerName,
      count: leading.count,
      reasonSummary: leading.reason || leading.reasonSummary || "",
    } : null,
    mostPressuredPerspective: pressured ? {
      speakerId: pressured.speakerId || pressured.targetSpeakerId,
      speakerName: pressured.speakerName || pressured.targetSpeakerName,
      count: pressured.count,
      reasonSummary: pressured.reason || pressured.preservedInsight || pressured.reasonSummary || "",
    } : null,
  };
}

function normalizePdcDemoRosterUpdate(round) {
  if (round.rosterUpdate) return round.rosterUpdate;
  const moved = round.voteSummary?.observerMoved;
  if (!moved?.speakerId) return null;
  return {
    shouldArchivePerspective: true,
    archivedSpeakerId: moved.speakerId,
    archivedSpeakerName: moved.speakerName,
    archivedStance: moved.preservedInsight || "",
    reason: moved.preservedInsight || "the council moved this perspective to Observer status",
  };
}

async function loadPdcDemoScript() {
  try {
    const response = await fetch("/pdc-demo-script.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    if (data?.topic?.en && Array.isArray(data.rounds) && data.rounds.length) {
      activePdcDemoScript = data;
    }
  } catch (error) {
    console.warn("PDC demo script fallback used:", error);
  }
}

async function startPdcDemoMode() {
  await loadPdcDemoScript();
  const demoScript = activePdcDemoScript || PDC_DEMO_SCRIPT;
  clearPdcPlaybackTimer();
  clearPdcWarmupTimer();
  pdcState = createPdcBaseState({
    valid: true,
    status: "ready",
    selectedMode: "personal",
    question: [demoScript.topic?.en, demoScript.topic?.zh].filter(Boolean).join("\n"),
    demoMode: true,
    demoFinalVisible: false,
    recap: createPdcDemoRecap(),
    pdcSessionId: createPdcSessionId(),
  });
  pdcState.pdcPhases = pdcState.recap.councilRoom.rounds.map((phase, index) => normalizePdcPhase(phase, index, pdcState.recap.councilRoom));
  ensurePdcRosterState(pdcState.recap.councilRoom.personas);
  beginPdcPhasePlayback(0);
}

const reviewLog = {
  updatedModule: "Module Architecture MVP",
  whatChanged: "Home, Map, Categories, Learning, and contact sections were shaped as separate modules.",
  whyChanged: "To support one module update, one clear commit, and lower long-term maintenance cost.",
  whatToTest: "Can a visitor move from Home to Map, Categories, or Learning without confusion?",
  nextModule: "Choose one category module when a specific learning path is ready.",
};

function contactSectionTemplate() {
  return `
    <section class="contact-section" aria-labelledby="contact-title">
      <div>
        <p class="eyebrow">${t("contactEyebrow")}</p>
        <h2 id="contact-title">${t("contactTitle")}</h2>
        <p>${t("contactCopy")}</p>
        <p class="trust-note contact-trust-note" data-i18n="contactTrust">${t("contactTrust")}</p>
        <div class="contact-methods">
          <a href="mailto:${contactEmail}">${contactEmail}</a>
        </div>
      </div>
      <form class="contact-form" data-contact-form>
        <label>
          <span>${t("messageBoard")}</span>
          <textarea name="message" rows="4" maxlength="2000" placeholder="${t("messagePlaceholder")}" required></textarea>
        </label>
        <button class="button primary" type="submit">${t("leaveMessage")}</button>
        <p class="contact-status" aria-live="polite"></p>
      </form>
      <div class="message-board founder-only" data-message-board></div>
      <div class="pdc-founder-panel founder-only" data-pdc-founder-panel></div>
    </section>`;
}

function renderContactSections() {
  pages.forEach((page) => {
    if (page.dataset.page === "/") return;
    if (page.dataset.page === "/pdc") return;
    if (page.dataset.page === "/pdc-pilot") return;
    if (page.querySelector(".contact-section")) return;
    page.insertAdjacentHTML("beforeend", contactSectionTemplate());
  });
  renderMessageBoards();
}

function siteFooterTemplate() {
  return `
    <footer class="site-footer" aria-label="Copyright">
      <p class="visitor-count" data-visitor-count>${t("viewedMany")}</p>
      <p class="visitor-count founder-only" data-founder-visitor-count></p>
      <p data-footer-rights>${t("footerRights")}</p>
      <p data-footer-notice>${t("footerNotice")}</p>
      <nav class="footer-links" aria-label="Trust and legal">
        <a href="/privacy" data-route="/privacy" data-i18n="footerPrivacy">${t("footerPrivacy")}</a>
        <a href="/responsible-use" data-route="/responsible-use" data-i18n="footerResponsibleUse">${t("footerResponsibleUse")}</a>
        <a href="/cookies" data-route="/cookies" data-i18n="footerCookies">${t("footerCookies")}</a>
        <a href="/terms" data-route="/terms" data-i18n="footerTerms">${t("footerTerms")}</a>
      </nav>
    </footer>`;
}

function renderSiteFooters() {
  pages.forEach((page) => {
    if (page.querySelector(".site-footer")) return;
    page.insertAdjacentHTML("beforeend", siteFooterTemplate());
  });
}

async function handleContactSubmit(event) {
  const form = event.target.closest("[data-contact-form]");
  if (!form) return;
  event.preventDefault();

  const name = form.elements.name?.value.trim() || "";
  const email = form.elements.email?.value.trim() || "";
  const message = form.elements.message.value.trim();
  const status = form.querySelector(".contact-status");
  if (!message) return;
  if (message === founderModePasscode) {
    localStorage.setItem(founderModeKey, "true");
    status.textContent = t("founderActivated");
    form.reset();
    setFounderMode(true);
    return;
  }
  if (email && !isValidContactEmail(email)) {
    status.textContent = t("invalidEmail");
    return;
  }
  const payload = {
    name,
    email,
    message,
    page_path: window.location.pathname,
    language: currentLanguage,
  };

  try {
    const response = await fetch("/api/contact-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) {
      throw new Error(data.error || `Message submit failed with HTTP ${response.status}`);
    }
    status.textContent = t("messageSaved");
    localStorage.removeItem(messageBoardKey);
    form.reset();
    if (document.body.classList.contains("founder-mode")) {
      loadFounderMessages();
    }
  } catch (error) {
    console.error("POST /api/contact-message failed:", error);
    status.textContent = t("messageError");
  }
}

function isValidContactEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getMessageBoardEntries() {
  try {
    const entries = JSON.parse(localStorage.getItem(messageBoardKey) || "[]");
    return Array.isArray(entries) ? entries.filter((entry) => entry?.message) : [];
  } catch {
    return [];
  }
}

function renderMessageBoards() {
  renderFounderMessages(founderMessages, founderMessageStatus);
  renderPdcFounderPanel();
}

function handlePdcAccessSubmit(event) {
  const form = event.target.closest("[data-pdc-access-form]");
  if (!form) return false;
  event.preventDefault();
  validatePdcAccessForm(form);
  return true;
}

async function validatePdcAccessForm(form) {
  const input = form.elements.pdc_access_code;
  const status = form.querySelector(".pdc-access-status");
  const code = String(input?.value || "").trim();
  if (!code) {
    if (status) status.textContent = "Enter your PDC access code.";
    return;
  }
  const normalizedCode = code.replace(/\s+/g, "");
  if (status) status.textContent = "Checking access code...";
  try {
    const response = await fetch("/api/pdc/validate-pass", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pass: normalizedCode }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.valid !== true) {
      throw new Error(data.message || "This PDC access code is no longer available.");
    }
    if (data.founder_preview === true) {
      sessionStorage.setItem(pdcFounderAccessSessionKey, "true");
      localStorage.setItem(founderModeKey, "true");
      window.location.href = "/pdc-pilot?founderPreview=1";
      return;
    }
    sessionStorage.removeItem(pdcFounderAccessSessionKey);
    window.location.href = `/pdc-pilot?pass=${encodeURIComponent(normalizedCode)}`;
  } catch (error) {
    if (status) status.textContent = error.message || "This PDC access code is no longer available.";
  }
}

async function loadFounderMessages() {
  if (!document.body.classList.contains("founder-mode")) return;
  const boards = Array.from(document.querySelectorAll("[data-message-board]"));
  if (!boards.length) return;
  founderMessageStatus = { state: "loading", loaded: 0, detail: "" };
  renderFounderMessages(founderMessages, founderMessageStatus);
  try {
    const response = await fetch("/api/contact-messages", {
      headers: { "X-MapKAI-Founder": "true" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    founderMessages = Array.isArray(data.messages) ? data.messages : [];
    founderMessageStatus = { state: "connected", loaded: founderMessages.length, detail: "" };
    renderFounderMessages(founderMessages, founderMessageStatus);
  } catch (error) {
    founderMessages = [];
    founderMessageStatus = { state: "failed", loaded: 0, detail: error.message || "Unknown error" };
    console.error("GET /api/contact-messages failed:", error);
    renderFounderMessages(founderMessages, founderMessageStatus);
  }
}

function getCurrentPdcPass() {
  return new URLSearchParams(window.location.search).get("pass") || "";
}

function isPdcFounderPreviewAllowed(pass) {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("founderPreview") === "1" && !pass;
  return requested && sessionStorage.getItem(pdcFounderAccessSessionKey) === "true";
}

async function initPdcPilotPage() {
  if (normalizeRoute(window.location.pathname) !== "/pdc-pilot") return;
  clearPdcPlaybackTimer();
  clearPdcWarmupTimer();
  const pass = getCurrentPdcPass();
  const params = new URLSearchParams(window.location.search);
  const founderPreviewRequested = params.get("founderPreview") === "1" && !pass;
  const founderPreviewAllowed = isPdcFounderPreviewAllowed(pass);
  if (pdcState.pass === pass && pdcState.founderPreview === founderPreviewAllowed && pdcState.status !== "idle") {
    if (!pass && !founderPreviewAllowed && pdcState.status === "ready") {
      pdcState.status = "public";
      pdcState.entryView = "landing";
    }
    renderPdcPilot();
    return;
  }
  pdcState = createPdcBaseState({
    pass,
    status: "validating",
    founderPreview: founderPreviewAllowed,
  });
  renderPdcPilot();
  if (founderPreviewAllowed) {
    pdcState.valid = true;
    pdcState.status = "public";
    pdcState.entryView = "founder-options";
    pdcState.founderPreview = true;
    pdcState.councilTier = "standard";
    pdcState.requestedTier = "standard";
    pdcState.effectiveTier = "standard";
    pdcState.founderOnlyFullFunction = false;
    pdcState.message = "";
    renderPdcPilot();
    return;
  }
  if (!pass && !founderPreviewRequested) {
    pdcState.valid = true;
    pdcState.status = "public";
    pdcState.entryView = "landing";
    pdcState.message = "";
    renderPdcPilot();
    return;
  }
  if (founderPreviewRequested) {
    pdcState.valid = true;
    pdcState.founderPreview = false;
    pdcState.status = "public";
    pdcState.entryView = "landing";
    pdcState.message = "Enter the Founder access code to open Full Function mode.";
    renderPdcPilot();
    return;
  }
  if (!pass) {
    pdcState.status = "invalid";
    pdcState.message = "A valid PDC access link is required.";
    renderPdcPilot();
    return;
  }
  try {
    const response = await fetch(`/api/pdc/validate-pass?pass=${encodeURIComponent(pass)}`);
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.valid !== true) {
      throw new Error(data.message || "This PDC access link is no longer available. It may have already been used or expired.");
    }
    pdcState.valid = true;
    pdcState.status = "ready";
    pdcState.entryView = "standard";
    pdcState.message = "";
    renderPdcPilot();
  } catch (error) {
    pdcState.valid = false;
    pdcState.status = "invalid";
    pdcState.message = error.message || "This PDC access link is no longer available. It may have already been used or expired.";
    renderPdcPilot();
  }
}

function renderPdcPilot() {
  const root = document.querySelector("[data-pdc-root]");
  if (!root) return;
  if (pdcState.status === "validating" || pdcState.status === "idle") {
    root.innerHTML = pdcShellTemplate(`<p class="trust-note">Checking your private access link...</p>`);
    return;
  }
  if (pdcState.status === "invalid") {
    root.innerHTML = pdcShellTemplate(`<p class="pdc-invalid">${escapeHtml(pdcState.message)}</p>`);
    return;
  }
  if (pdcState.status === "public" && pdcState.entryView === "landing") {
    root.innerHTML = pdcShellTemplate(renderPdcPublicEntry());
    return;
  }
  if (pdcState.status === "public" && pdcState.entryView === "founder-options") {
    root.innerHTML = pdcShellTemplate(renderPdcFounderEntry());
    return;
  }
  const visibleRecap = getPdcVisibleRecap();
  if (visibleRecap) {
    root.innerHTML = `
      ${renderPdcCouncilRoom(visibleRecap)}
      ${pdcState.demoMode ? renderPdcDemoNotice() : ""}
      ${pdcState.finalRecapLoading && !pdcState.warmup ? `<section class="pdc-result"><p class="trust-note">Generating Council Recap...</p></section>` : ""}
      ${renderPdcReintroducedPerspective()}
      ${(pdcState.discussionStopped || pdcState.demoFinalVisible) && !pdcState.warmup ? renderPdcRecap(pdcState.recap) : ""}
      ${pdcState.discussionStopped && !pdcState.warmup ? renderPdcAdvancedFinalAudit() : ""}
      ${renderPdcProviderDiagnostics()}
      ${renderPdcFounderPreviewActions()}
      ${pdcState.discussionStopped && !pdcState.warmup && !pdcState.demoMode ? renderPdcFeedbackForm() : ""}
    `;
    return;
  }

  if (pdcState.status === "generating") {
    root.innerHTML = renderPdcPreparingShell("Council is preparing Round 1A...");
    return;
  }

  const remaining = 1200 - pdcState.question.length;
  const isFullFunction = pdcState.founderPreview && pdcState.councilTier === "full_function";
  const showPdcBackOption = !pdcState.pass && !pdcState.founderPreview;
  root.innerHTML = pdcShellTemplate(`
    ${isFullFunction ? `
      <section class="pdc-entry-option">
        <p class="eyebrow">Founder Full Function / Founder 完整高质量版本</p>
        <h2>Founder Full Function</h2>
        <p>Run the full high-quality council with 5.5 for all rounds.</p>
        <p>全部轮次使用 5.5，用于重要展示和内部验证。</p>
        <p class="trust-note">phaseModel = gpt-5.5 · finalModel = gpt-5.5</p>
      </section>` : ""}
    ${!pdcState.pass && !pdcState.founderPreview ? `
      <label class="pdc-question-label">
        <span>PDC access code</span>
        <input data-pdc-start-pass type="text" autocomplete="off" maxlength="80" placeholder="Enter access code">
      </label>` : ""}
    <label class="pdc-question-label">
      <span>Decision question</span>
      <textarea data-pdc-question maxlength="1200" rows="7" placeholder="Write one decision question you want to examine.">${escapeHtml(pdcState.question)}</textarea>
    </label>
    <p class="pdc-count">${remaining} characters left</p>
    <button class="button primary" type="button" data-pdc-start ${pdcState.status === "generating" ? "disabled" : ""}>${pdcState.status === "generating" ? "Preparing Council Recap..." : isFullFunction ? "Start Founder Full Function" : "Start Standard Council"}</button>
    ${showPdcBackOption ? `<button class="button secondary" type="button" data-pdc-back-landing>Back to PDC options</button>` : ""}
    ${pdcState.message ? `<p class="pdc-status">${escapeHtml(pdcState.message)}</p>` : ""}
  `);
}

function renderPdcPublicEntry() {
  return `
    <div class="pdc-entry-grid">
      <section class="pdc-entry-option">
        <p class="eyebrow">Public Demo / Demo 模式</p>
        <h2>Demo Mode</h2>
        <p>Watch a predefined PDC sample. No access code, no AI, no data saved.</p>
        <p>观看一个预设 PDC 样例。不需要体验码，不消耗 AI，不保存数据。</p>
        <button class="button secondary" type="button" data-pdc-watch-demo>Watch Demo / 观看 Demo</button>
      </section>
      <section class="pdc-entry-option">
        <p class="eyebrow">Access Code / 访问码</p>
        <h2>Enter PDC</h2>
        <p>Normal access codes open Standard Council: mini rounds with a 5.5 final recap.</p>
        <p>Founder access opens Full Function: 5.5 for every round.</p>
        <form class="pdc-access-form" data-pdc-access-form>
          <label>
            <span>Access code</span>
            <input name="pdc_access_code" type="text" inputmode="text" autocomplete="off" placeholder="Paste your access code" required />
          </label>
          <button class="button primary" type="submit">Enter PDC / 进入 PDC</button>
          <p class="pdc-access-status" aria-live="polite"></p>
        </form>
      </section>
      ${pdcState.message ? `<p class="pdc-status pdc-entry-status">${escapeHtml(pdcState.message)}</p>` : ""}
    </div>`;
}

function renderPdcFounderEntry() {
  return `
    <div class="pdc-entry-grid">
      <section class="pdc-entry-option">
        <p class="eyebrow">Standard Council</p>
        <h2>Standard Council</h2>
        <p>Run the standard experience: mini rounds with a 5.5 final recap.</p>
        <button class="button primary" type="button" data-pdc-founder-standard>Open Standard Council</button>
      </section>
      <section class="pdc-entry-option">
        <p class="eyebrow">Founder Full Function</p>
        <h2>Full Function</h2>
        <p>Run the full high-quality council with 5.5 for all rounds.</p>
        <button class="button primary" type="button" data-pdc-founder-full>Open Full Function</button>
      </section>
    </div>`;
}

function renderPdcDemoNotice() {
  return `<section class="pdc-result"><p class="pdc-placeholder-notice">Demo script — no AI used. / 示例演示 — 未使用 AI。</p></section>`;
}

function renderPdcPreparingShell(message = "Preparing this phase...") {
  return `
    ${pdcShellTemplate(`
      <section class="pdc-council-room" aria-labelledby="pdc-council-room-title">
        <div class="pdc-room-heading">
          <p class="eyebrow">Council Preview</p>
          <h1 id="pdc-council-room-title">PDC Council Room</h1>
          <p>The council reviews your decision in structured rounds.</p>
        </div>
        <div class="pdc-dialogue-panel">
          <div class="pdc-dialogue-panel-head">
            <div>
              <p class="eyebrow">Current Round</p>
              <h2>Live Council Dialogue</h2>
            </div>
          </div>
          <div class="pdc-table-topic">
            <span>Decision on the table</span>
            <p>${escapeHtml(pdcState.question || "Decision question")}</p>
          </div>
          <p class="pdc-status">${escapeHtml(message)}</p>
        </div>
      </section>
    `)}
  `;
}

function pdcShellTemplate(innerHtml) {
  return `
    <section class="pdc-card" aria-live="polite">
      <p class="eyebrow">PDC Council Rhythm</p>
      <h1>MapKAI PDC</h1>
      ${pdcState.founderPreview ? `<p class="pdc-founder-preview-label">Founder Mode Preview</p>` : ""}
      <p class="pdc-subtitle">A structured council debate for clearer decisions.</p>
      <p class="pdc-trust-line">No account required. One-time access only. Please avoid sensitive or confidential information.</p>
      ${innerHtml}
      <details class="pdc-responsible-use">
        <summary>Responsible use &amp; privacy</summary>
        <div>
          <p>MapKAI is currently a free knowledge initiative.</p>
          <p>You can explore it without creating an account or providing your name or email.</p>
          <p>The final judgment remains yours.</p>
          <p>Please avoid sharing sensitive personal, medical, legal, financial, or confidential business information.</p>
        </div>
      </details>
    </section>`;
}

function renderPdcFounderPreviewActions() {
  if (!pdcState.founderPreview) return "";
  return `
    <section class="pdc-founder-preview-tools">
      <p>Founder Mode Preview</p>
      <button class="button secondary" type="button" data-pdc-founder-reset>Start another Founder Preview</button>
    </section>`;
}

function renderPdcStatusChips(items = []) {
  const rows = items.map((item) => normalizePdcDisplayText(item)).filter(Boolean);
  return rows.length ? `<div class="pdc-status-chips">${rows.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>` : "";
}

function getPdcProviderChips({ provider = "", model = "", strict = false, fallbackUsed = false, founderOnly = false, manualAudit = false } = {}) {
  return [
    provider ? provider.replace(/^openai$/i, "OpenAI") : "",
    model,
    strict ? "Strict" : "",
    fallbackUsed ? "Fallback" : "No fallback",
    founderOnly ? "Founder only" : "",
    manualAudit ? "Manual audit" : "",
  ].filter(Boolean);
}

function getPdcVisibleRecap() {
  return pdcState.warmup?.recap || pdcState.recap;
}

function renderPdcCouncilRoom(recap) {
  const room = recap.councilRoom;
  if (!room) return "";
  const facilitator = room.facilitator || {};
  const rounds = getPdcPhases(room);
  const allPersonas = getPdcRosterPersonas(room, rounds);
  if (!room.isWarmupRoom) ensurePdcRosterState(allPersonas);
  const activePersonas = room.isWarmupRoom ? allPersonas : allPersonas.filter((persona) => pdcState.activeRosterIds.includes(persona.id));
  const observerPersonas = room.isWarmupRoom ? [] : allPersonas.filter((persona) => pdcState.observerRosterIds.includes(persona.id));
  const roundIndex = clampPdcIndex(pdcState.activeRoundIndex, rounds.length);
  const currentRound = rounds[roundIndex] || rounds[0] || { label: "Round 1A — Position Update", dialogue: [] };
  const playback = getPdcPlaybackForRound(currentRound);
  const fullDialogue = Array.isArray(currentRound.dialogue) ? currentRound.dialogue : [];
  const isWarmupPhase = currentRound.isWarmup === true;
  const visibleCount = playback ? Math.min(playback.visibleCount, fullDialogue.length) : fullDialogue.length;
  const dialogue = fullDialogue.slice(0, visibleCount);
  const activeSpeakerId = playback?.activeSpeakerId || "";
  const thinkingLine = playback?.thinkingSpeakerId ? fullDialogue.find((line) => line.speakerId === playback.thinkingSpeakerId) : null;
  const showPhaseAfterPlayback = !isWarmupPhase && (!playback || playback.summaryVisible || playback.complete);
  const selectedPersona = allPersonas.find((persona) => persona.id === pdcState.selectedPersonaId) || null;
  appendPdcMemberHistoryFromPhases(rounds);
  return `
    <section class="pdc-council-room" aria-labelledby="pdc-council-room-title">
      <div class="pdc-room-heading">
        <p class="eyebrow">Council Preview</p>
        <h1 id="pdc-council-room-title">${escapeHtml(room.title || "PDC Council Room")}</h1>
        <p>${pdcState.demoMode ? "Demo script — no AI used. / 示例演示 — 未使用 AI。" : "The council reviews your decision in structured rounds."}</p>
      </div>
      <div class="pdc-live-room ${selectedPersona ? "has-selected-profile" : ""}">
        <aside class="pdc-roster-panel ${selectedPersona ? "has-selected-profile" : ""}" aria-label="Council Members">
          <div class="pdc-facilitator-row">
            <span class="pdc-avatar" aria-hidden="true">${escapeHtml(getPersonaInitials(facilitator))}</span>
            <div>
              <small>Facilitator</small>
              <strong>${escapeHtml(facilitator.englishName || "Blue Whale")}${facilitator.name ? ` / ${escapeHtml(facilitator.name)}` : ""}</strong>
            </div>
          </div>
          <div class="pdc-roster-layout">
            <div class="pdc-roster-main">
              <h2>Council Members</h2>
              <h3>Active Council Members</h3>
              <div class="pdc-roster-list">
                ${activePersonas.map((persona) => renderPdcRosterRow(persona, activeSpeakerId, false, isWarmupPhase, selectedPersona)).join("")}
              </div>
              ${observerPersonas.length ? `
                <h3>Observers</h3>
                <div class="pdc-roster-list pdc-observer-list">
                  ${observerPersonas.map((persona) => renderPdcRosterRow(persona, activeSpeakerId, true, false, selectedPersona)).join("")}
                </div>` : ""}
            </div>
          </div>
        </aside>
        <section class="pdc-dialogue-panel" aria-label="Live Council Dialogue">
          <div class="pdc-dialogue-panel-head">
            <div>
              <p class="eyebrow">Current Round</p>
              <h2>Live Council Dialogue</h2>
            </div>
            ${pdcState.founderPreview && !isWarmupPhase ? renderPdcStatusChips(getPdcProviderChips({
              provider: recap.dialogueProvider,
              model: pdcState.providerDiagnostics?.modelName || "",
              strict: pdcState.providerDiagnostics?.strict === true,
              fallbackUsed: pdcState.providerDiagnostics?.fallbackUsed === true,
              founderOnly: true,
            })) : ""}
          </div>
          <div class="pdc-table-topic">
            <span>Decision on the table</span>
            <p>${escapeHtml(room.decisionOnTable || pdcState.question || "Decision question")}</p>
          </div>
          <div class="pdc-round-status">
            <strong>${escapeHtml(isWarmupPhase ? "Preparing the council" : currentRound.label || "Round 1 — Opening Views")}</strong>
            <span>${isWarmupPhase ? "Council is thinking · Local warm-up" : fullDialogue.length ? `${fullDialogue.length} active council statements` : "No dialogue lines available"}</span>
          </div>
          ${renderPdcPlaybackStatus(currentRound, playback, thinkingLine)}
          ${renderPdcDialogue(dialogue, activeSpeakerId, thinkingLine, showPhaseAfterPlayback, isWarmupPhase, currentRound)}
          ${showPhaseAfterPlayback ? renderPdcRoundSummary(currentRound, facilitator) : ""}
          ${showPhaseAfterPlayback ? renderPdcVotingSnapshot(currentRound) : ""}
          ${showPhaseAfterPlayback ? renderPdcPhaseGuidance(currentRound) : ""}
          ${showPhaseAfterPlayback ? renderPdcFinalRoundPreview(currentRound) : ""}
          ${renderPdcFounderPhaseDebug(currentRound)}
          ${pdcState.demoMode ? renderPdcDemoRoundControls({ hasDialogue: fullDialogue.length > 0, playbackActive: Boolean(playback?.isPlaying), currentIndex: roundIndex, total: rounds.length }) : (!isWarmupPhase ? renderPdcRoundControls({ hasDialogue: fullDialogue.length > 0, playbackActive: Boolean(playback?.isPlaying) }) : `<div class="pdc-round-controls"><span class="pdc-stopped-label">Waiting for OpenAI structured phase...</span></div>`)}
        </section>
      </div>
    </section>`;
}

function getPdcPhases(room) {
  if (room?.isWarmupRoom) return (Array.isArray(room.rounds) ? room.rounds : []).map((phase, index) => normalizePdcPhase(phase, index, room));
  if (Array.isArray(pdcState.pdcPhases) && pdcState.pdcPhases.length) return pdcState.pdcPhases;
  const sourcePhases = Array.isArray(room.rounds) && room.rounds.length ? room.rounds : [{
    id: "round-1a",
    label: room.currentRoundLabel || "Round 1A — Position Update",
    roundNumber: 1,
    phaseType: "A",
    dialogue: Array.isArray(room.dialogue) ? room.dialogue : [],
    blueWhaleSummary: room.facilitator ? { title: "Blue Whale Summary", text: room.facilitator.summary } : null,
  }];
  pdcState.pdcPhases = sourcePhases.map((phase, index) => normalizePdcPhase(phase, index, room));
  return pdcState.pdcPhases;
}

function ensurePdcRosterState(personas) {
  const uniqueIds = dedupePdcIds(personas.map((persona) => persona.id).filter((id) => id && id !== "blue-whale"));
  if (!uniqueIds.length) return;
  if (!pdcState.activeRosterIds.length && !pdcState.observerRosterIds.length) {
    pdcState.activeRosterIds = uniqueIds;
    pdcState.observerRosterIds = [];
    return;
  }
  pdcState.observerRosterIds = dedupePdcIds(pdcState.observerRosterIds).filter((id) => uniqueIds.includes(id));
  pdcState.activeRosterIds = dedupePdcIds(pdcState.activeRosterIds).filter((id) => uniqueIds.includes(id) && !pdcState.observerRosterIds.includes(id));
  if (!pdcState.activeRosterIds.length) {
    pdcState.activeRosterIds = uniqueIds.filter((id) => !pdcState.observerRosterIds.includes(id));
  }
}

function getPdcRosterPersonas(room, rounds = []) {
  const byId = new Map();
  const addPersona = (persona) => {
    if (!persona || !persona.id || persona.id === "blue-whale") return;
    if (!byId.has(persona.id)) byId.set(persona.id, persona);
  };
  (Array.isArray(room.personas) ? room.personas : []).forEach(addPersona);
  (Array.isArray(room.sessionRoster) ? room.sessionRoster : []).forEach(addPersona);
  rounds.forEach((phase) => {
    (Array.isArray(phase.dialogue) ? phase.dialogue : []).forEach((line) => addPersona({
      id: line.speakerId,
      englishName: line.speakerName,
      name: line.speakerChineseName || line.speakerLocalName || line.speakerName,
      role: line.role,
      responsibility: line.role,
      statement: line.stanceSummary || line.text,
    }));
  });
  return Array.from(byId.values());
}

function dedupePdcIds(ids) {
  return Array.from(new Set((ids || []).filter(Boolean)));
}

function normalizePdcPhase(phase, index, room) {
  const fallbackRoundNumber = Math.floor(index / 2) + 1;
  const fallbackPhaseType = index % 2 === 0 ? "A" : "B";
  const roundNumber = Number(phase.roundNumber) > 0 ? Number(phase.roundNumber) : fallbackRoundNumber;
  const phaseType = String(phase.phaseType || fallbackPhaseType).toUpperCase() === "B" ? "B" : "A";
  const label = phase.phaseLabel || phase.label || getPdcPhaseLabel(roundNumber, phaseType);
  const summary = phase.blueWhaleSummary || {};
  return [{
    id: phase.id || `round-${roundNumber}${phaseType.toLowerCase()}`,
    label,
    phaseLabel: label,
    roundNumber,
    phaseType,
    previousSummary: phase.previousSummary || "",
    provider: phase.provider || "",
    userIntervention: phase.userIntervention || "",
    dialogue: Array.isArray(phase.dialogue) ? phase.dialogue : [],
    blueWhaleSummary: {
      title: "Blue Whale Summary",
      text: summary.text || room.facilitator?.summary || "",
      convergenceLevel: summary.convergenceLevel || "low",
      shouldConsiderStopping: summary.shouldConsiderStopping === true,
      suggestedReasonToStop: summary.suggestedReasonToStop || "",
    },
    meetingMemory: phase.meetingMemory || createPdcMeetingMemory({ phaseType, summaryText: summary.text || "" }),
    voteSummary: phase.voteSummary || null,
    rosterUpdate: phase.rosterUpdate || null,
    reintroducedPerspective: phase.reintroducedPerspective || null,
    contentDiagnostics: phase.contentDiagnostics || null,
    isWarmup: phase.isWarmup === true,
    canContinue: phase.canContinue !== false,
    canStopAndSummarize: phase.canStopAndSummarize !== false,
  }][0];
}

function getPdcPhaseLabel(roundNumber, phaseType) {
  const prefix = Number(roundNumber) >= pdcMaxNormalRound ? "Final Round" : `Round ${roundNumber}${phaseType}`;
  return `${prefix} — ${phaseType === "A" ? "Position Update" : "Voting & Pressure Check"}`;
}

function clampPdcIndex(value, length) {
  const index = Number.isFinite(Number(value)) ? Number(value) : 0;
  if (length <= 0) return 0;
  return Math.max(0, Math.min(index, length - 1));
}

function renderPdcRosterRow(persona, activeSpeakerId, isObserver = false, isWarmupThinking = false, selectedPersona = null) {
  const initials = getPersonaInitials(persona);
  const isSelected = pdcState.selectedPersonaId === persona.id;
  const isSpeaking = activeSpeakerId === persona.id || isWarmupThinking;
  return `
    <div class="pdc-roster-item">
      <button class="pdc-roster-row ${isObserver ? "is-observer" : ""} ${isWarmupThinking ? "is-thinking" : ""} ${isSpeaking ? "is-speaking" : ""} ${isSelected ? "is-selected" : ""}" type="button" data-pdc-persona="${escapeHtml(persona.id)}" aria-pressed="${isSelected}">
        <span class="pdc-avatar" aria-hidden="true">${escapeHtml(initials)}</span>
        <span class="pdc-roster-copy">
          <strong>${escapeHtml(persona.englishName || persona.name || "Council member")}</strong>
          ${persona.name && persona.name !== persona.englishName ? `<small>/ ${escapeHtml(persona.name)}</small>` : ""}
          <em>${escapeHtml(persona.role || "Council Member")}</em>
        </span>
      </button>
    </div>
    ${isSelected && selectedPersona ? `<div class="pdc-roster-profile-row">${renderPdcPersonaProfile(selectedPersona)}</div>` : ""}`;
}

function renderPdcPlaybackStatus(round, playback, thinkingLine) {
  if (round?.isWarmup) {
    const debug = getPdcWarmupDebug();
    return `
      <div class="pdc-playback-status is-warmup">
        <p>Local warm-up · Stage ${Number(debug.warmupStage || 1)} of 8</p>
      </div>`;
  }
  if (!playback?.isPlaying) return "";
  const speakerName = thinkingLine?.speakerName || "Council member";
  return `
    <div class="pdc-playback-status">
      <p>${escapeHtml(playback.thinkingSpeakerId ? `${speakerName} is thinking...` : "Preparing this phase...")}</p>
      ${pdcState.founderPreview ? `<button class="button secondary" type="button" data-pdc-show-all-now>Show all now</button>` : ""}
    </div>`;
}

function renderPdcDialogue(dialogue, activeSpeakerId = "", thinkingLine = null, phaseComplete = true, isWarmupPhase = false, round = null) {
  const lines = Array.isArray(dialogue) ? dialogue : [];
  const isBPhase = !isWarmupPhase && String(round?.phaseType || "").toUpperCase() === "B";
  return `
    <div class="pdc-dialogue-board" aria-label="Live Council Dialogue">
      <ol>
        ${lines.map((line) => `
          <li class="${isWarmupPhase ? "is-warmup" : ""} ${line.speakerId === activeSpeakerId ? "is-current" : ""}">
            <span>${escapeHtml(line.speakerName || "Council Member")} ${line.role ? `<small>/ ${escapeHtml(line.role)}</small>` : ""}</span>
            ${renderPdcRelationLabel(line)}
            ${isBPhase ? renderPdcVotingLine(line) : `<p>${escapeHtml(line.text || "")}</p>`}
          </li>`).join("")}
        ${thinkingLine ? `
          <li class="is-current is-thinking">
            <span>${escapeHtml(thinkingLine.speakerName || "Council Member")} ${thinkingLine.role ? `<small>/ ${escapeHtml(thinkingLine.role)}</small>` : ""}</span>
            ${renderPdcRelationLabel(thinkingLine)}
            <p>${escapeHtml(`${thinkingLine.speakerName || "Council member"} is thinking...`)}</p>
          </li>` : ""}
      </ol>
      <p class="pdc-dialogue-note">${isWarmupPhase ? "Warm-up lines are local preparation cues, not final council statements." : phaseComplete ? "This phase is complete." : "Council members are speaking one at a time."}</p>
    </div>`;
}

function renderPdcVotingLine(line) {
  return `
    <div class="pdc-voting-line">
      <p>${escapeHtml(line.text || "Voting rationale recorded.")}</p>
      <div class="pdc-vote-chip-row">
        <span>Contribution: ${escapeHtml(line.contributionVote?.targetSpeakerName || line.contributionVote?.targetSpeakerId || "-")}</span>
        <span>Concern: ${escapeHtml(line.concernVote?.targetSpeakerName || line.concernVote?.targetSpeakerId || "-")}</span>
      </div>
      <dl>
        <dt>Contribution reason</dt><dd>${escapeHtml(line.contributionVote?.reason || "-")}</dd>
        <dt>Concern reason</dt><dd>${escapeHtml(line.concernVote?.reason || "-")}</dd>
      </dl>
    </div>`;
}

function renderPdcRelationLabel(line) {
  const stanceType = String(line.stanceType || "").toLowerCase();
  const targetName = line.targetSpeakerName || "";
  if (!targetName || !["support", "challenge", "clarify", "build"].includes(stanceType)) return "";
  const labelByType = {
    support: "Supports",
    challenge: "Challenges",
    clarify: "Clarifies",
    build: "Builds on",
  };
  return `<em class="pdc-relation-label">${labelByType[stanceType]} ${escapeHtml(targetName)}</em>`;
}

function renderPdcRoundSummary(round, facilitator) {
  const summary = round.blueWhaleSummary?.text || facilitator.summary || "";
  if (!summary) return "";
  const convergenceLevel = round.blueWhaleSummary?.convergenceLevel || "low";
  const shouldSuggestStop = round.blueWhaleSummary?.shouldConsiderStopping === true || convergenceLevel === "high";
  const stopReason = round.blueWhaleSummary?.suggestedReasonToStop || "Blue Whale suggests the discussion is converging. You may stop and summarize now, or continue for another round.";
  return `
    <aside class="pdc-round-summary">
      <strong>Blue Whale Summary</strong>
      <p>${escapeHtml(summary)}</p>
      <div class="pdc-convergence-line">
        <span>Convergence: ${escapeHtml(convergenceLevel)}</span>
      </div>
      ${round.rosterUpdate?.shouldArchivePerspective ? `<p class="pdc-stop-suggestion">Blue Whale moves ${escapeHtml(round.rosterUpdate.archivedSpeakerName || "one perspective")} into Observer status for now because ${escapeHtml(round.rosterUpdate.reason || "the council signaled this perspective needs more pressure")}. Their perspective remains available for final reflection.</p>` : ""}
      ${shouldSuggestStop ? `<p class="pdc-stop-suggestion">${escapeHtml(stopReason)}</p>` : ""}
    </aside>`;
}

function renderPdcVotingSnapshot(round) {
  const summary = round.voteSummary;
  if (!summary || round.phaseType !== "B") return "";
  const supported = summary.leadingContributor;
  const pressured = summary.mostPressuredPerspective;
  return `
    <section class="pdc-vote-snapshot">
      <h3>Council Voting Snapshot</h3>
      <div>
        <strong>Most Supported Contribution</strong>
        <p>${escapeHtml(supported?.speakerName || "-")}${supported?.count ? ` (${Number(supported.count)} support votes)` : ""}</p>
        ${supported?.reasonSummary ? `<small>${escapeHtml(supported.reasonSummary)}</small>` : ""}
      </div>
      <div>
        <strong>Most Pressured Perspective</strong>
        <p>${escapeHtml(pressured?.speakerName || "-")}${pressured?.count ? ` (${Number(pressured.count)} concern votes)` : ""}</p>
        ${pressured?.reasonSummary ? `<small>${escapeHtml(pressured.reasonSummary)}</small>` : ""}
      </div>
      <div>
        <strong>Blue Whale Interpretation</strong>
        <p>${escapeHtml(round.rosterUpdate?.reason || "No clear narrowing consensus yet.")}</p>
      </div>
    </section>`;
}

function renderPdcRoundControls({ hasDialogue, playbackActive = false }) {
  if (!hasDialogue) return "";
  if (playbackActive || pdcState.phaseLoading || pdcState.finalRecapLoading) {
    return `<div class="pdc-round-controls"><span class="pdc-stopped-label">${playbackActive ? "Council is still speaking..." : "Preparing..."}</span></div>`;
  }
  if (pdcState.discussionStopped) {
    return `<div class="pdc-round-controls"><span class="pdc-stopped-label">Discussion stopped. Council Recap is ready.</span></div>`;
  }
  const currentPhase = pdcState.pdcPhases[clampPdcIndex(pdcState.activeRoundIndex, pdcState.pdcPhases.length)] || null;
  if (shouldShowPdcFinalRoundPreview(currentPhase)) {
    return `<div class="pdc-round-controls"><button class="button primary" type="button" data-pdc-enter-final-round>Continue to Final Round</button><button class="button secondary" type="button" data-pdc-stop-summarize>Generate Council Recap</button></div>`;
  }
  if (isPdcFinalPhaseComplete(currentPhase)) {
    return `<div class="pdc-round-controls"><button class="button primary" type="button" data-pdc-stop-summarize>Generate Council Recap</button>${pdcState.founderPreview ? `<button class="button secondary" type="button" data-pdc-continue-phase>Founder: continue beyond final</button>` : ""}</div>`;
  }
  return `
    <div class="pdc-round-controls">
      <button class="button secondary" type="button" data-pdc-continue-phase ${pdcState.phaseLoading ? "disabled" : ""}>${pdcState.phaseLoading ? "Continuing discussion..." : "Continue to next phase"}</button>
      <button class="button primary" type="button" data-pdc-stop-summarize>Stop &amp; Summarize</button>
    </div>`;
}

function renderPdcDemoRoundControls({ hasDialogue, playbackActive = false, currentIndex = 0, total = 0 }) {
  if (!hasDialogue) return "";
  if (playbackActive) return `<div class="pdc-round-controls"><span class="pdc-stopped-label">Demo round is playing...</span></div>`;
  const isLast = currentIndex >= total - 1;
  return `
    <div class="pdc-round-controls">
      ${currentIndex > 0 ? `<button class="button secondary" type="button" data-pdc-demo-prev>Previous demo round</button>` : ""}
      ${isLast
        ? `<button class="button primary" type="button" data-pdc-demo-final>Final Demo Recap</button>`
        : `<button class="button primary" type="button" data-pdc-demo-next>Next demo round</button>`}
    </div>`;
}

function renderPdcPhaseGuidance(currentRound) {
  if (pdcState.discussionStopped) return "";
  if (shouldShowPdcFinalRoundPreview(currentRound) || isPdcFinalPhaseComplete(currentRound)) return "";
  return `
    <div class="pdc-phase-guidance">
      <label>
        <span>Guide the next phase</span>
        <textarea data-pdc-phase-guidance maxlength="500" rows="3" placeholder="Optional: tell the council what to focus on next."></textarea>
      </label>
      <p>The next phase will use Blue Whale's summary, compact meeting memory, and your optional guidance.</p>
      <ul>
        <li>Focus more on physical-world impact.</li>
        <li>Challenge the optimistic view.</li>
        <li>Be more concrete.</li>
        <li>Discuss what happens to ordinary workers.</li>
      </ul>
      ${pdcState.phaseMessage ? `<p class="pdc-status">${escapeHtml(pdcState.phaseMessage)}</p>` : ""}
    </div>`;
}

function shouldShowPdcFinalRoundPreview(phase) {
  return phase && Number(phase.roundNumber) === pdcMaxNormalRound - 1 && String(phase.phaseType).toUpperCase() === "B" && !pdcState.finalRoundPreviewAccepted;
}

function isPdcFinalPhaseComplete(phase) {
  return phase && Number(phase.roundNumber) >= pdcMaxNormalRound && String(phase.phaseType).toUpperCase() === "B";
}

function renderPdcFinalRoundPreview(currentRound) {
  if (!shouldShowPdcFinalRoundPreview(currentRound)) return "";
  const rewarded = getPdcMostRewardedContributor();
  const observers = getPdcFrozenObserverSummaries();
  const existingReenabled = pdcState.finalReenabledObserverMeta;
  const existingStillValid = existingReenabled?.speakerId
    && pdcState.observerRosterIds.includes(existingReenabled.speakerId)
    && !pdcState.activeRosterIds.includes(existingReenabled.speakerId);
  const reenabled = existingStillValid ? existingReenabled : selectPdcFinalReenabledObserver(rewarded, observers, currentRound);
  pdcState.finalRoundPreviewShown = true;
  pdcState.finalReenableSkippedReason = reenabled.skippedReason || "";
  pdcState.reEnabledObserverSelectionSource = reenabled.selectionSource || "observerRoster";
  pdcState.reEnabledObserverWasActiveMemberBlocked = reenabled.activeMemberBlocked === true;
  pdcState.reEnabledObserverCandidateInvalidReason = reenabled.candidateInvalidReason || "";
  pdcState.finalRoundPreviewSelection = reenabled.speakerId || "";
  pdcState.finalReenabledObserverMeta = reenabled.speakerId ? reenabled : null;
  return `
    <section class="pdc-final-preview" aria-label="Final Round Preview">
      <p class="eyebrow">Final Round Preview</p>
      <h2>Next round is the final council round</h2>
      <p>Round ${pdcMaxNormalRound}A and ${pdcMaxNormalRound}B will close the council before the Council Recap.</p>
      <div class="pdc-final-preview-grid">
        <div>
          <strong>Most Rewarded Contributor</strong>
          <p>${escapeHtml(rewarded.name || "No clear leader yet")}${rewarded.count ? ` (${Number(rewarded.count)} contribution votes)` : ""}</p>
          ${rewarded.tie ? `<small>Tie resolved by ${escapeHtml(rewarded.tieResolution || "latest B-phase contribution votes")}.</small>` : ""}
        </div>
        <div>
          <strong>Re-enabled Archived Perspective</strong>
          ${reenabled.speakerId ? `
            <p>${escapeHtml(reenabled.name || reenabled.speakerId)} · ${escapeHtml(reenabled.role || "Archived Perspective")}</p>
            <small>Selected by ${escapeHtml(reenabled.selectedByName || rewarded.name || "Most Rewarded Contributor")}: ${escapeHtml(reenabled.selectionReason || "This archived perspective can improve the final decision.")}</small>
          ` : `<p>${escapeHtml(reenabled.skippedReason || "No archived perspective is available.")}</p>`}
        </div>
      </div>
    </section>`;
}

function renderPdcFounderPhaseDebug(currentRound) {
  if (!pdcState.founderPreview) return "";
  const previousSummary = currentRound.previousSummary || "";
  const diagnostics = currentRound.contentDiagnostics || pdcState.providerDiagnostics?.contentDiagnostics || null;
  const playbackDebug = getPdcPlaybackDebug(currentRound);
  const summary = `Tier: ${pdcState.effectiveTier || pdcState.councilTier || "standard"} · Provider: ${pdcState.recap?.dialogueProvider || currentRound.provider || "placeholder"} · Phase model: ${pdcState.phaseModel || pdcState.providerDiagnostics?.phaseModel || pdcState.providerDiagnostics?.modelName || "-"} · Final model: ${pdcState.finalModel || pdcState.providerDiagnostics?.finalModel || "-"} · Fallback: ${pdcState.providerDiagnostics?.fallbackUsed ? "yes" : "no"} · Strict: ${pdcState.providerDiagnostics?.strict ? "true" : "false"} · Duration: ${Number(diagnostics?.phaseTotalDurationMs || diagnostics?.totalPhaseDurationMs || diagnostics?.phaseOpenAiDurationMs || diagnostics?.openAiDurationMs || 0)}ms · Prompt chars: ${Number(diagnostics?.promptCharLength || 0)}`;
  return `
    <details class="pdc-founder-phase-debug">
      <summary>
        <span>${escapeHtml(summary)}</span>
        <em>Show debug details</em>
      </summary>
      <div class="pdc-debug-details">
        <p>Previous summary: ${previousSummary ? "available" : "missing"} · User intervention: ${currentRound.userIntervention ? "included" : "empty"} · playbackMode: ${playbackDebug.playbackMode} · playbackStatus: ${playbackDebug.playbackStatus} · visibleStatementCount: ${playbackDebug.visibleStatementCount} · totalStatementCount: ${playbackDebug.totalStatementCount} · activeSpeakerId: ${escapeHtml(playbackDebug.activeSpeakerId || "-")}</p>
        <p>councilTier: ${escapeHtml(pdcState.councilTier || "standard")} · requestedTier: ${escapeHtml(pdcState.requestedTier || "standard")} · effectiveTier: ${escapeHtml(pdcState.effectiveTier || "standard")} · phaseModel: ${escapeHtml(pdcState.phaseModel || "-")} · finalModel: ${escapeHtml(pdcState.finalModel || "-")} · founderOnlyFullFunction: ${pdcState.founderOnlyFullFunction ? "true" : "false"}</p>
        <p>warmupMode: ${escapeHtml(playbackDebug.warmupMode || "-")} · warmupStatus: ${escapeHtml(playbackDebug.warmupStatus || "-")} · warmupStage: ${Number(playbackDebug.warmupStage || 0)} · warmupStartedAt: ${escapeHtml(playbackDebug.warmupStartedAt || "-")} · warmupDurationMs: ${Number(playbackDebug.warmupDurationMs || 0)} · sessionResetApplied: ${pdcState.sessionResetApplied ? "true" : "false"} · pdcSessionId: ${escapeHtml(pdcState.pdcSessionId || "-")} · initialRoundNumber: ${Number(pdcState.initialRoundNumber || 0)} · initialMeetingMemoryItemCount: ${Number(pdcState.initialMeetingMemoryItemCount || 0)} · previousSessionCleared: ${pdcState.previousSessionCleared ? "true" : "false"}</p>
        ${diagnostics ? `<p>OpenAI returned: ${Number(diagnostics.modelStatementCount || 0)} · Normalized: ${Number(diagnostics.normalizedStatementCount || 0)} · Defaults injected: ${diagnostics.defaultStatementsInjected ? `yes (${escapeHtml((diagnostics.defaultStatementSpeakerIds || []).join(", "))})` : "no"}${diagnostics.defaultTemplateMatched ? ` · OpenAI output matched default template (${escapeHtml((diagnostics.defaultTemplateMatchedSpeakerIds || []).join(", "))})` : ""}${diagnostics.retryUsed ? " · Retry: yes" : ""}</p>` : ""}
        ${diagnostics ? `<p>duplicateSpeakerIds: ${escapeHtml((diagnostics.duplicateSpeakerIds || []).join(", ") || "-")} · structuredOutputRepairAttempted: ${diagnostics.structuredOutputRepairAttempted ? "true" : "false"} · structuredOutputRepairSucceeded: ${diagnostics.structuredOutputRepairSucceeded ? "true" : "false"} · duplicateSpeakerRecoveryUsed: ${diagnostics.duplicateSpeakerRecoveryUsed ? "true" : "false"} · fallbackReason: ${escapeHtml(pdcState.providerDiagnostics?.fallbackReason || "-")}</p>` : ""}
        ${diagnostics ? `<p>bPhaseVotingOnlyMode: ${diagnostics.bPhaseVotingOnlyMode ? "true" : "false"} · bPhaseAverageTextLength: ${Number(diagnostics.bPhaseAverageTextLength || 0)} · bPhaseVoteReasonCoverage: ${Number(diagnostics.bPhaseVoteReasonCoverage || 0)} · bPhaseLongStatementFilteredCount: ${Number(diagnostics.bPhaseLongStatementFilteredCount || 0)} · bPhaseMissingVoteCount: ${Number(diagnostics.bPhaseMissingVoteCount || 0)} · aPhaseVoteLeakDetected: ${diagnostics.aPhaseVoteLeakDetected ? "true" : "false"}</p>` : ""}
        ${diagnostics ? `<p>phaseOpenAiDurationMs: ${Number(diagnostics.phaseOpenAiDurationMs || diagnostics.openAiDurationMs || 0)} · phaseRetryDurationMs: ${Number(diagnostics.phaseRetryDurationMs || diagnostics.retryDurationMs || 0)} · phaseTotalDurationMs: ${Number(diagnostics.phaseTotalDurationMs || diagnostics.totalPhaseDurationMs || 0)} · promptCharLength: ${Number(diagnostics.promptCharLength || 0)} · approximateInputTokenEstimate: ${Number(diagnostics.approximateInputTokenEstimate || 0)} · outputCharLength: ${Number(diagnostics.outputCharLength || 0)} · activeRosterCount: ${Number(diagnostics.activeRosterCount || 0)} · observerCount: ${Number(diagnostics.observerCount || 0)} · meetingMemoryItemCount: ${Number(diagnostics.meetingMemoryItemCount || 0)} · phaseMaxOutputTokens: ${Number(diagnostics.phaseMaxOutputTokens || diagnostics.maxOutputTokens || 0)} · retryMaxOutputTokens: ${Number(diagnostics.retryMaxOutputTokens || 0)}</p>` : ""}
        ${diagnostics ? `<p>activeRosterPromptCount: ${Number(diagnostics.activeRosterPromptCount || 0)} · observerRosterPromptCount: ${Number(diagnostics.observerRosterPromptCount || 0)} · observerProfilesOmittedFromPrompt: ${diagnostics.observerProfilesOmittedFromPrompt ? "true" : "false"} · archivedSummaryIncluded: ${diagnostics.archivedSummaryIncluded ? "true" : "false"} · estimatedPromptTokenReduction: ${Number(diagnostics.estimatedPromptTokenReduction || 0)} · costOptimizationApplied: ${diagnostics.costOptimizationApplied ? "true" : "false"}</p>` : ""}
        ${diagnostics ? `<p>Template content detected: ${diagnostics.templateContentDetected ? "true" : "false"}${diagnostics.templateMatchedPhrases?.length ? ` (${escapeHtml(diagnostics.templateMatchedPhrases.join(", "))})` : ""} · Content retry: ${diagnostics.contentQualityRetryUsed ? "true" : "false"}</p>` : ""}
      </div>
    </details>`;
}

function getPdcPlaybackForRound(round) {
  if (!round || !pdcState.playback || pdcState.playback.phaseId !== round.id) return null;
  return pdcState.playback;
}

function getPdcPlaybackDebug(round) {
  const dialogue = Array.isArray(round?.dialogue) ? round.dialogue : [];
  const playback = getPdcPlaybackForRound(round);
  const totalStatementCount = round?.isWarmup ? 0 : dialogue.length;
  const visibleStatementCount = round?.isWarmup ? 0 : playback ? Math.min(Number(playback.visibleCount || 0), totalStatementCount) : totalStatementCount;
  let playbackStatus = "idle";
  if (pdcState.phaseLoading || pdcState.status === "generating") {
    playbackStatus = "preparing";
  } else if (playback?.isPlaying) {
    playbackStatus = "playing";
  } else if (playback?.complete) {
    playbackStatus = "completed";
  }
  return {
    playbackMode: round?.isWarmup ? "warmup" : playback ? "progressive" : "instant",
    playbackStatus,
    visibleStatementCount,
    totalStatementCount,
    activeSpeakerId: playback?.activeSpeakerId || playback?.thinkingSpeakerId || "",
    ...getPdcWarmupDebug(),
  };
}

function clearPdcPlaybackTimer() {
  if (pdcPlaybackTimer) {
    clearTimeout(pdcPlaybackTimer);
    pdcPlaybackTimer = null;
  }
}

function clearPdcWarmupTimer() {
  if (pdcWarmupTimer) {
    clearTimeout(pdcWarmupTimer);
    pdcWarmupTimer = null;
  }
}

function beginPdcWarmup({ phaseLabel = "Round 1A — Position Update", roundNumber = 1, phaseType = "A", activePersonas = null } = {}) {
  clearPdcPlaybackTimer();
  clearPdcWarmupTimer();
  const startedAt = Date.now();
  const personas = normalizePdcWarmupPersonas(activePersonas);
  const phase = createPdcWarmupPhase({ phaseLabel, roundNumber, phaseType, startedAt, personas, stage: 1 });
  pdcState.warmup = {
    mode: "local",
    status: "running",
    startedAt,
    stage: 1,
    phaseLabel,
    roundNumber,
    phaseType,
    personas,
    phaseId: phase.id,
    recap: createPdcWarmupRecap(phase, personas),
  };
  pdcState.playback = null;
  renderPdcPilot();
  schedulePdcWarmupStage();
}

function finishPdcWarmup() {
  if (!pdcState.warmup) return pdcState.warmupDiagnostics || null;
  clearPdcWarmupTimer();
  pdcState.warmupDiagnostics = {
    warmupMode: "local",
    warmupStatus: "replaced",
    warmupStage: pdcState.warmup.stage || 1,
    warmupStartedAt: new Date(pdcState.warmup.startedAt).toISOString(),
    warmupDurationMs: Date.now() - pdcState.warmup.startedAt,
  };
  pdcState.warmup = null;
  return pdcState.warmupDiagnostics;
}

function cancelPdcWarmup() {
  clearPdcWarmupTimer();
  if (pdcState.warmup) {
    pdcState.warmupDiagnostics = {
      warmupMode: "local",
      warmupStatus: "completed",
      warmupStage: pdcState.warmup.stage || 1,
      warmupStartedAt: new Date(pdcState.warmup.startedAt).toISOString(),
      warmupDurationMs: Date.now() - pdcState.warmup.startedAt,
    };
  }
  pdcState.warmup = null;
}

function getPdcWarmupDebug() {
  if (pdcState.warmup) {
    return {
      warmupMode: "local",
      warmupStatus: pdcState.warmup.status || "running",
      warmupStage: pdcState.warmup.stage || 1,
      warmupStartedAt: new Date(pdcState.warmup.startedAt).toISOString(),
      warmupDurationMs: Date.now() - pdcState.warmup.startedAt,
    };
  }
  return pdcState.warmupDiagnostics || { warmupMode: "", warmupStatus: "", warmupStage: 0, warmupStartedAt: "", warmupDurationMs: 0 };
}

function schedulePdcWarmupStage() {
  clearPdcWarmupTimer();
  if (!pdcState.warmup) return;
  pdcWarmupTimer = setTimeout(() => {
    if (!pdcState.warmup) return;
    pdcState.warmup.stage = getNextPdcWarmupStage(pdcState.warmup.stage || 1);
    const phase = createPdcWarmupPhase({
      phaseLabel: pdcState.warmup.phaseLabel,
      roundNumber: pdcState.warmup.roundNumber,
      phaseType: pdcState.warmup.phaseType,
      startedAt: pdcState.warmup.startedAt,
      personas: pdcState.warmup.personas,
      stage: pdcState.warmup.stage,
    });
    pdcState.warmup.phaseId = phase.id;
    pdcState.warmup.recap = createPdcWarmupRecap(phase, pdcState.warmup.personas);
    renderPdcPilot();
    schedulePdcWarmupStage();
  }, pdcWarmupStageDurationMs);
}

function getNextPdcWarmupStage(stage) {
  const current = Number(stage) || 1;
  if (current < 8) return current + 1;
  return 6;
}

function normalizePdcWarmupPersonas(activePersonas) {
  const source = Array.isArray(activePersonas) && activePersonas.length ? activePersonas : pdcWarmupPersonas;
  const fallbackById = new Map(pdcWarmupPersonas.map((persona) => [persona.id, persona]));
  return source
    .filter((persona) => persona?.id && persona.id !== "blue-whale")
    .map((persona) => ({ ...(fallbackById.get(persona.id) || {}), ...persona }));
}

function createPdcWarmupPhase({ phaseLabel, roundNumber, phaseType, startedAt, personas, stage = 1 }) {
  const stageMessages = pdcWarmupStages[Math.max(0, Math.min(Number(stage) || 1, 8) - 1)] || pdcWarmupStages[0];
  const dialoguePersonas = [
    { id: "blue-whale", englishName: "Blue Whale", name: "蓝鲸", role: "Facilitator" },
    ...normalizePdcWarmupPersonas(personas),
  ];
  return {
    id: `warmup-${startedAt}`,
    label: phaseLabel,
    phaseLabel,
    roundNumber,
    phaseType,
    provider: "pending",
    isWarmup: true,
    dialogue: dialoguePersonas.map((persona) => ({
      speakerId: persona.id,
      speakerName: persona.englishName || persona.name || "Council member",
      speakerChineseName: persona.name && persona.name !== persona.englishName ? persona.name : "",
      speakerLocalName: persona.name && persona.name !== persona.englishName ? persona.name : "",
      role: persona.role || "Council Member",
      text: stageMessages[persona.id] || `${persona.englishName || persona.name || "Council member"} is preparing a local thinking state...`,
      stanceType: "warmup",
      targetSpeakerId: "",
      targetSpeakerName: "",
      stanceSummary: stageMessages[persona.id] || "",
      contentSource: "local-warmup",
    })),
    blueWhaleSummary: { title: "Blue Whale Summary", text: "", convergenceLevel: "low", shouldConsiderStopping: false },
    meetingMemory: null,
    voteSummary: null,
    rosterUpdate: null,
    canContinue: false,
    canStopAndSummarize: false,
  };
}

function createPdcWarmupRecap(phase, personas) {
  const roster = normalizePdcWarmupPersonas(personas);
  return {
    modeId: "personal",
    modeLabel: "Personal PDC",
    dialogueProvider: "pending",
    councilRoom: {
      isWarmupRoom: true,
      title: "PDC Council Room",
      decisionOnTable: pdcState.question || "Decision question",
      currentRoundLabel: phase.phaseLabel,
      facilitator: { id: "blue-whale", englishName: "Blue Whale", name: "蓝鲸", role: "Facilitator", summary: "" },
      personas: roster,
      sessionRoster: roster,
      rounds: [phase],
    },
  };
}

function beginPdcPhasePlayback(phaseIndex) {
  clearPdcPlaybackTimer();
  const room = getPdcVisibleRecap()?.councilRoom;
  if (!room) return;
  const phases = getPdcPhases(room);
  const phase = phases[clampPdcIndex(phaseIndex, phases.length)];
  const dialogue = Array.isArray(phase?.dialogue) ? phase.dialogue : [];
  if (!phase || !dialogue.length) {
    pdcState.playback = null;
    renderPdcPilot();
    return;
  }
  pdcState.playback = {
    phaseId: phase.id,
    visibleCount: 0,
    activeSpeakerId: "",
    thinkingSpeakerId: "",
    summaryVisible: false,
    complete: false,
    isPlaying: true,
  };
  renderPdcPilot();
  schedulePdcPlaybackStep();
}

function schedulePdcPlaybackStep() {
  clearPdcPlaybackTimer();
  const room = getPdcVisibleRecap()?.councilRoom;
  const phases = room ? getPdcPhases(room) : [];
  const phase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)];
  const playback = getPdcPlaybackForRound(phase);
  const dialogue = Array.isArray(phase?.dialogue) ? phase.dialogue : [];
  if (!playback || !dialogue.length) return;
  if (playback.visibleCount >= dialogue.length) {
    playback.activeSpeakerId = "";
    playback.thinkingSpeakerId = "";
    playback.summaryVisible = true;
    playback.complete = true;
    playback.isPlaying = false;
    renderPdcPilot();
    return;
  }
  const line = dialogue[playback.visibleCount];
  playback.activeSpeakerId = line.speakerId;
  playback.thinkingSpeakerId = line.speakerId;
  renderPdcPilot();
  pdcPlaybackTimer = setTimeout(() => {
    const currentPlayback = getPdcPlaybackForRound(phase);
    if (!currentPlayback || !currentPlayback.isPlaying) return;
    currentPlayback.visibleCount += 1;
    currentPlayback.thinkingSpeakerId = "";
    currentPlayback.activeSpeakerId = line.speakerId;
    renderPdcPilot();
    pdcPlaybackTimer = setTimeout(schedulePdcPlaybackStep, 420);
  }, 720);
}

function completePdcPlaybackNow() {
  const room = getPdcVisibleRecap()?.councilRoom;
  const phases = room ? getPdcPhases(room) : [];
  const phase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)];
  const playback = getPdcPlaybackForRound(phase);
  if (!playback) return;
  clearPdcPlaybackTimer();
  playback.visibleCount = Array.isArray(phase.dialogue) ? phase.dialogue.length : 0;
  playback.activeSpeakerId = "";
  playback.thinkingSpeakerId = "";
  playback.summaryVisible = true;
  playback.complete = true;
  playback.isPlaying = false;
  renderPdcPilot();
}

function isPdcPlaybackActive() {
  return pdcState.playback?.isPlaying === true;
}

function movePdcDemoRound(delta) {
  if (!pdcState.demoMode || isPdcPlaybackActive()) return;
  const room = pdcState.recap?.councilRoom;
  const phases = room ? getPdcPhases(room) : [];
  if (!phases.length) return;
  pdcState.demoFinalVisible = false;
  pdcState.activeRoundIndex = clampPdcIndex((Number(pdcState.activeRoundIndex) || 0) + delta, phases.length);
  rebuildPdcDemoObserverState(phases);
  beginPdcPhasePlayback(pdcState.activeRoundIndex);
}

function showPdcDemoFinalRecap() {
  if (!pdcState.demoMode || isPdcPlaybackActive()) return;
  rebuildPdcDemoObserverState(getPdcPhases(pdcState.recap?.councilRoom || {}));
  pdcState.demoFinalVisible = true;
  pdcState.discussionStopped = true;
  renderPdcPilot();
}

function rebuildPdcDemoObserverState(phases = []) {
  if (!pdcState.demoMode) return;
  const room = pdcState.recap?.councilRoom || {};
  const allIds = getPdcRosterPersonas(room, phases).map((persona) => persona.id).filter(Boolean);
  const observerIds = [];
  phases.slice(0, (Number(pdcState.activeRoundIndex) || 0) + 1).forEach((phase) => {
    const speakerId = phase?.rosterUpdate?.shouldArchivePerspective ? phase.rosterUpdate.archivedSpeakerId : "";
    if (speakerId && !observerIds.includes(speakerId)) observerIds.push(speakerId);
  });
  const currentPhase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)] || null;
  const reintroducedId = currentPhase?.reintroducedPerspective?.speakerId || "";
  if (reintroducedId) {
    pdcState.finalReintroducedPerspective = normalizePdcReintroducedForDisplay({
      speakerId: reintroducedId,
      speakerName: currentPhase.reintroducedPerspective.speakerName,
      role: currentPhase.reintroducedPerspective.role,
      reasonForReintroduction: currentPhase.reintroducedPerspective.reason,
      finalReflection: currentPhase.reintroducedPerspective.reason,
    });
  } else if (!pdcState.demoFinalVisible) {
    pdcState.finalReintroducedPerspective = null;
  }
  pdcState.observerRosterIds = observerIds;
  if (reintroducedId) pdcState.observerRosterIds = pdcState.observerRosterIds.filter((id) => id !== reintroducedId);
  pdcState.activeRosterIds = allIds.filter((id) => !pdcState.observerRosterIds.includes(id));
}

async function continuePdcPhase() {
  const room = pdcState.recap?.councilRoom;
  if (!room || pdcState.discussionStopped || pdcState.phaseLoading || pdcState.finalRecapLoading || isPdcPlaybackActive()) return;
  const phases = getPdcPhases(room);
  const phaseIndex = clampPdcIndex(pdcState.activeRoundIndex, phases.length);
  const currentPhase = phases[phaseIndex];
  if (isPdcFinalPhaseComplete(currentPhase) && !pdcState.founderPreview) return;
  if (shouldShowPdcFinalRoundPreview(currentPhase) && !pdcState.finalRoundPreviewAccepted) return;
  const dialogueLength = Array.isArray(currentPhase?.dialogue) ? currentPhase.dialogue.length : 0;
  if (!dialogueLength) return;
  const nextIndex = phaseIndex + 1;
  const userIntervention = (document.querySelector("[data-pdc-phase-guidance]")?.value || "").trim().slice(0, 500);
  if (userIntervention) pdcState.userInterventions.push(userIntervention);
  pdcState.phaseLoading = true;
  pdcState.phaseMessage = "Preparing this phase...";
  const nextSpec = getNextPdcPhaseSpec(currentPhase);
  const activeWarmupPersonas = getPdcRosterPersonas(room, phases).filter((persona) => pdcState.activeRosterIds.includes(persona.id));
  beginPdcWarmup({ ...nextSpec, activePersonas: activeWarmupPersonas });
  try {
    if (!phases[nextIndex]) {
      phases.push(await requestNextPdcPhase({ previousPhase: currentPhase, room, userIntervention }));
    }
    const warmupDiagnostics = finishPdcWarmup();
    pdcState.activeRoundIndex = nextIndex;
    pdcState.phaseMessage = "";
    if (warmupDiagnostics) {
      if (pdcState.providerDiagnostics?.contentDiagnostics) {
        pdcState.providerDiagnostics.contentDiagnostics = { ...pdcState.providerDiagnostics.contentDiagnostics, ...warmupDiagnostics };
      }
    }
    beginPdcPhasePlayback(nextIndex);
  } catch (error) {
    cancelPdcWarmup();
    pdcState.playback = null;
    pdcState.phaseMessage = error.message || "The next PDC phase could not be generated. Please try again.";
  } finally {
    pdcState.phaseLoading = false;
    renderPdcPilot();
  }
}

async function requestNextPdcPhase({ previousPhase, room, userIntervention }) {
  const nextSpec = getNextPdcPhaseSpec(previousPhase);
  const headers = { "Content-Type": "application/json" };
  if (pdcState.founderPreview) headers["X-MapKAI-Founder"] = "true";
  const response = await fetch("/api/pdc/start", {
    method: "POST",
    headers,
    body: JSON.stringify({
      continue_phase: true,
      pass: pdcState.pass,
      mode_id: "personal",
      user_question: pdcState.question || room.decisionOnTable || "",
      founder_preview: pdcState.founderPreview,
      council_tier: pdcState.councilTier || "standard",
      active_roster_ids: pdcState.activeRosterIds,
      observer_roster_ids: pdcState.observerRosterIds,
      observer_roster_context: (pdcState.observerRosterIds || []).map((speakerId) => {
        const info = getPdcObserverArchiveInfo(speakerId) || {};
        return {
          speakerId,
          archivedStance: info.archivedStance || info.archivedPerspective || "",
          archivedReason: info.reason || "",
          lastContribution: info.lastContribution || "",
          archivedAtPhaseLabel: info.archivedAtPhaseLabel || "",
          archivedAtRoundNumber: info.archivedAtRoundNumber || 0,
        };
      }),
      round_number: nextSpec.roundNumber,
      phase_type: nextSpec.phaseType,
      phase_label: nextSpec.phaseLabel,
      previous_summary: previousPhase?.blueWhaleSummary?.text || "",
      meeting_memory: buildPdcCompactPhaseMemory(previousPhase),
      user_intervention: userIntervention,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok !== true || !data.phase) throw new Error(data.message || "Could not continue PDC phase.");
  pdcState.recap.dialogueProvider = data.provider || pdcState.recap.dialogueProvider;
  pdcState.councilTier = data.effectiveTier || data.councilTier || pdcState.councilTier || "standard";
  pdcState.requestedTier = data.requestedTier || pdcState.requestedTier || "standard";
  pdcState.effectiveTier = data.effectiveTier || pdcState.councilTier || "standard";
  pdcState.phaseModel = data.phaseModel || pdcState.phaseModel || "";
  pdcState.finalModel = data.finalModel || pdcState.finalModel || "";
  pdcState.founderOnlyFullFunction = data.founderOnlyFullFunction === true || pdcState.founderOnlyFullFunction === true;
  pdcState.providerDiagnostics = {
    requestedProvider: data.requestedProvider,
    actualProvider: data.actualProvider || data.provider,
    fallbackUsed: data.fallbackUsed,
    fallbackReason: data.fallbackReason,
    providerErrorShort: data.providerErrorShort,
    jsonParseFailed: data.jsonParseFailed,
    modelName: data.modelName,
    councilTier: pdcState.councilTier,
    requestedTier: pdcState.requestedTier,
    effectiveTier: pdcState.effectiveTier,
    phaseModel: pdcState.phaseModel,
    finalModel: pdcState.finalModel,
    founderOnlyFullFunction: pdcState.founderOnlyFullFunction,
    schemaName: data.schemaName || data.contentDiagnostics?.schemaName || "",
    strict: data.strict === true || data.contentDiagnostics?.strict === true,
    contentDiagnostics: data.contentDiagnostics ? {
      ...data.contentDiagnostics,
      sessionResetApplied: pdcState.sessionResetApplied === true,
      pdcSessionId: pdcState.pdcSessionId,
      initialRoundNumber: pdcState.initialRoundNumber,
      initialMeetingMemoryItemCount: pdcState.initialMeetingMemoryItemCount,
      previousSessionCleared: pdcState.previousSessionCleared === true,
    } : null,
  };
  const phase = normalizePdcPhase({ ...data.phase, provider: data.provider, userIntervention, contentDiagnostics: data.contentDiagnostics || null }, pdcState.pdcPhases.length, room);
  maybeAddPdcFinalReintroducedPerspective(phase);
  appendPdcMemberHistoryFromPhase(phase, pdcState.pdcPhases.length);
  applyPdcRosterUpdate(phase);
  return phase;
}

function buildPdcCompactPhaseMemory(previousPhase) {
  const base = previousPhase?.meetingMemory && typeof previousPhase.meetingMemory === "object" ? previousPhase.meetingMemory : {};
  const summary = previousPhase?.blueWhaleSummary || {};
  return {
    compactSummary: normalizePdcDisplayText(base.compactSummary || summary.text || "").slice(0, 500),
    activeTensions: normalizePdcMemoryList(base.activeTensions),
    strongestViews: normalizePdcMemoryList(base.strongestViews),
    openQuestions: normalizePdcMemoryList(base.openQuestions),
    convergenceSignals: normalizePdcMemoryList(base.convergenceSignals),
    compactMemory: {
      mainTension: normalizePdcDisplayText(base.compactMemory?.mainTension || base.mainTension || summary.strongestDisagreement || "").slice(0, 200),
      strongestDisagreement: normalizePdcDisplayText(base.compactMemory?.strongestDisagreement || summary.strongestDisagreement || "").slice(0, 200),
      whatChangedThisPhase: normalizePdcDisplayText(base.compactMemory?.whatChangedThisPhase || summary.influenceShift || "").slice(0, 200),
      whatNextPhaseShouldExamine: normalizePdcDisplayText(base.compactMemory?.whatNextPhaseShouldExamine || summary.nextFocus || "").slice(0, 200),
    },
    memberStateSummaries: buildPdcMemberStateSummaries(),
    archivedObserverSummaries: getPdcFrozenObserverSummaries(),
  };
}

function normalizePdcMemoryList(value) {
  return Array.isArray(value) ? value.map((item) => normalizePdcDisplayText(item).slice(0, 160)).filter(Boolean).slice(0, 6) : [];
}

function buildPdcMemberStateSummaries() {
  const observerIds = new Set((pdcState.observerRosterIds || []).filter(Boolean));
  const activeIds = new Set((pdcState.activeRosterIds || []).filter((id) => id && !observerIds.has(id)));
  return Array.from(activeIds).map((speakerId) => {
    const history = getPdcMemberHistory(speakerId);
    const latest = history[history.length - 1] || {};
    const previous = history.length > 1 ? history[history.length - 2] : null;
    return {
      speakerId,
      currentStance: normalizePdcDisplayText(latest.stance || latest.text || "").slice(0, 120),
      latestStatementSummary: summarizePdcHistoryText(latest.text || latest.stance || ""),
      latestTargetSummary: latest.targetSpeakerId
        ? normalizePdcDisplayText(`${latest.statementType || "targeted"} ${latest.targetSpeakerName || latest.targetSpeakerId}`).slice(0, 120)
        : "",
      unresolvedTension: summarizePdcHistoryText(latest.stanceShift || latest.historyNote || previous?.text || ""),
    };
  }).filter((item) => item.currentStance || item.latestStatementSummary || item.latestTargetSummary || item.unresolvedTension);
}

function summarizePdcHistoryText(value) {
  const text = normalizePdcDisplayText(value);
  if (!text) return "";
  return text.length > 140 ? `${text.slice(0, 137)}...` : text;
}

function applyPdcRosterUpdate(phase) {
  const update = phase?.rosterUpdate;
  if (!update?.shouldArchivePerspective || !update.archivedSpeakerId) return;
  if (!pdcState.activeRosterIds.includes(update.archivedSpeakerId)) return;
  freezePdcArchivedObserver(update.archivedSpeakerId, phase);
  pdcState.activeRosterIds = pdcState.activeRosterIds.filter((id) => id !== update.archivedSpeakerId);
  if (!pdcState.observerRosterIds.includes(update.archivedSpeakerId)) pdcState.observerRosterIds.push(update.archivedSpeakerId);
}

function freezePdcArchivedObserver(speakerId, phase) {
  if (!speakerId) return null;
  pdcState.archivedObservers ||= {};
  if (pdcState.archivedObservers[speakerId]) return pdcState.archivedObservers[speakerId];
  const line = (Array.isArray(phase?.dialogue) ? phase.dialogue : []).find((item) => item.speakerId === speakerId) || {};
  const update = phase?.rosterUpdate || {};
  const frozen = {
    speakerId,
    name: update.archivedSpeakerName || line.speakerName || findPdcPersonaById(speakerId)?.englishName || speakerId,
    role: line.role || findPdcPersonaById(speakerId)?.role || "",
    archivedAtPhaseLabel: phase?.phaseLabel || phase?.label || "",
    archivedAtRoundNumber: Number(phase?.roundNumber) || 0,
    archivedStance: line.stance || line.stanceSummary || line.text || "",
    archivedLastContribution: line.text || line.stanceSummary || "",
    archivedReason: update.reason || "",
  };
  pdcState.archivedObservers[speakerId] = frozen;
  return frozen;
}

function getNextPdcPhaseSpec(previousPhase) {
  const previousRoundNumber = Number(previousPhase?.roundNumber) || 1;
  const previousPhaseType = String(previousPhase?.phaseType || "A").toUpperCase() === "B" ? "B" : "A";
  const phaseType = previousPhaseType === "A" ? "B" : "A";
  const roundNumber = previousPhaseType === "A" ? previousRoundNumber : previousRoundNumber + 1;
  if (roundNumber > pdcMaxNormalRound && !pdcState.founderPreview) {
    return { roundNumber: pdcMaxNormalRound, phaseType: "B", phaseLabel: getPdcPhaseLabel(pdcMaxNormalRound, "B") };
  }
  const phaseLabel = getPdcPhaseLabel(roundNumber, phaseType);
  return { roundNumber, phaseType, phaseLabel };
}

async function stopAndSummarizePdc() {
  if (!pdcState.recap) return;
  if (pdcState.finalRecapLoading || pdcState.phaseLoading || isPdcPlaybackActive()) return;
  pdcState.finalRecapLoading = true;
  renderPdcPilot();
  try {
    const result = await requestPdcFinalRecap();
    pdcState.councilTier = result.effectiveTier || result.councilTier || pdcState.councilTier || "standard";
    pdcState.requestedTier = result.requestedTier || pdcState.requestedTier || "standard";
    pdcState.effectiveTier = result.effectiveTier || pdcState.councilTier || "standard";
    pdcState.phaseModel = result.phaseModel || pdcState.phaseModel || "";
    pdcState.finalModel = result.finalModel || result.modelName || pdcState.finalModel || "";
    pdcState.founderOnlyFullFunction = result.founderOnlyFullFunction === true || pdcState.founderOnlyFullFunction === true;
    pdcState.recap.recap = normalizePdcRecapSectionsForDisplay(result.recap || pdcState.recap.recap);
    pdcState.recap.finalRecapProvider = result.actualProvider || result.provider || "";
    pdcState.recap.finalRecapFallbackUsed = result.fallbackUsed === true;
    pdcState.recap.placeholderNotice = result.fallbackUsed ? "Placeholder fallback recap — live final recap was unavailable." : "Generated Council Recap";
    pdcState.finalReintroducedPerspective = normalizePdcReintroducedForDisplay(result.finalReintroducedPerspective) || null;
    pdcState.advancedAudit = null;
    pdcState.advancedAuditError = "";
    pdcState.providerDiagnostics = {
      phase: pdcState.providerDiagnostics,
      final: result,
      advancedAudit: null,
    };
  } catch (error) {
    pdcState.recap = applyPdcFinalMemoryToRecap(pdcState.recap);
    pdcState.providerDiagnostics = { fallbackUsed: true, fallbackReason: error.message || "Final recap request failed." };
    pdcState.phaseMessage = error.message || "Final recap request failed.";
  } finally {
    pdcState.finalRecapLoading = false;
    pdcState.discussionStopped = true;
    renderPdcPilot();
  }
}

async function requestPdcFinalRecap() {
  const room = pdcState.recap?.councilRoom || {};
  const phases = getPdcPhases(room);
  const latestPhase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)] || phases[phases.length - 1] || null;
  const headers = { "Content-Type": "application/json" };
  if (pdcState.founderPreview) headers["X-MapKAI-Founder"] = "true";
  const response = await fetch("/api/pdc/start", {
    method: "POST",
    headers,
    body: JSON.stringify({
      final_recap: true,
      pass: pdcState.pass,
      mode_id: "personal",
      user_question: pdcState.question || room.decisionOnTable || "",
      founder_preview: pdcState.founderPreview,
      council_tier: pdcState.councilTier || "standard",
      latest_phase: latestPhase,
      meeting_memory: latestPhase?.meetingMemory || null,
      vote_summary: latestPhase?.voteSummary || null,
      active_roster_ids: pdcState.activeRosterIds.length ? pdcState.activeRosterIds : getPdcRosterPersonas(room, phases).map((persona) => persona.id),
      observer_roster_ids: pdcState.observerRosterIds || [],
      observer_roster_context: (pdcState.observerRosterIds || []).map((speakerId) => {
        const info = getPdcObserverArchiveInfo(speakerId) || {};
        return {
          speakerId,
          archivedStance: info.archivedStance || info.archivedPerspective || "",
          archivedReason: info?.reason || "",
          lastContribution: info?.lastContribution || "",
          archivedAtPhaseLabel: info.archivedAtPhaseLabel || "",
          archivedAtRoundNumber: info.archivedAtRoundNumber || 0,
        };
      }),
      final_reintroduced_perspective: pdcState.finalReintroducedPerspective,
      user_interventions: pdcState.userInterventions,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok !== true) throw new Error(data.message || "Final recap could not be generated.");
  return data;
}

async function runPdcAdvancedFinalAudit() {
  if (!pdcState.founderPreview || !pdcState.recap || pdcState.advancedAuditLoading) return;
  pdcState.advancedAuditManualTrigger = true;
  if (pdcState.advancedAudit?.audit && pdcState.advancedAuditCompletedSessionId === pdcState.pdcSessionId) {
    pdcState.advancedAuditDuplicateCallBlocked = true;
    pdcState.providerDiagnostics = {
      ...(pdcState.providerDiagnostics || {}),
      advancedAudit: {
        ...pdcState.advancedAudit,
        contentDiagnostics: {
          ...(pdcState.advancedAudit.contentDiagnostics || {}),
          advancedAuditAlreadyExists: true,
          advancedAuditDuplicateCallBlocked: true,
          advancedAuditAutoRun: false,
          advancedAuditManualTrigger: true,
          advancedAuditSessionId: pdcState.pdcSessionId || "",
          advancedAuditInFlight: false,
        },
      },
    };
    renderPdcPilot();
    return;
  }
  pdcState.advancedAuditLoading = true;
  pdcState.advancedAuditError = "";
  pdcState.advancedAuditDuplicateCallBlocked = false;
  renderPdcPilot();
  try {
    const result = await requestPdcAdvancedFinalAudit();
    pdcState.advancedAudit = result;
    pdcState.advancedAuditCompletedSessionId = pdcState.pdcSessionId || "";
    pdcState.providerDiagnostics = {
      ...(pdcState.providerDiagnostics || {}),
      advancedAudit: result,
    };
  } catch (error) {
    pdcState.advancedAuditError = error.message || "Advanced Final Audit could not run.";
    pdcState.providerDiagnostics = {
      ...(pdcState.providerDiagnostics || {}),
      advancedAudit: {
        fallbackUsed: true,
        fallbackReason: pdcState.advancedAuditError,
        contentDiagnostics: {
          ...(error.contentDiagnostics || {}),
          advancedAuditAutoRun: false,
          advancedAuditManualTrigger: true,
          advancedAuditSessionId: pdcState.pdcSessionId || "",
          advancedAuditInFlight: false,
        },
      },
    };
  } finally {
    pdcState.advancedAuditLoading = false;
    renderPdcPilot();
  }
}

async function requestPdcAdvancedFinalAudit() {
  const room = pdcState.recap?.councilRoom || {};
  const phases = getPdcPhases(room);
  const latestPhase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)] || phases[phases.length - 1] || null;
  const finalDiagnostics = pdcState.providerDiagnostics?.final || null;
  const phaseDiagnostics = pdcState.providerDiagnostics?.phase || null;
  const headers = { "Content-Type": "application/json", "X-MapKAI-Founder": "true" };
  const response = await fetch("/api/pdc/start", {
    method: "POST",
    headers,
    body: JSON.stringify({
      advanced_final_audit: true,
      advanced_audit_manual_trigger: true,
      pdc_session_id: pdcState.pdcSessionId || "",
      pass: pdcState.pass,
      mode_id: "personal",
      user_question: pdcState.question || room.decisionOnTable || "",
      founder_preview: true,
      council_tier: pdcState.councilTier || "standard",
      final_recap_payload: pdcState.recap?.recap || null,
      phases: phases.map((phase) => ({
        label: phase.label || phase.phaseLabel || "",
        roundNumber: phase.roundNumber,
        phaseType: phase.phaseType,
        blueWhaleSummary: phase.blueWhaleSummary || null,
        voteSummary: phase.voteSummary || null,
        rosterUpdate: phase.rosterUpdate || null,
      })),
      latest_phase: latestPhase,
      meeting_memory: latestPhase?.meetingMemory || null,
      vote_summary: latestPhase?.voteSummary || null,
      active_roster_ids: pdcState.activeRosterIds.length ? pdcState.activeRosterIds : getPdcRosterPersonas(room, phases).map((persona) => persona.id),
      observer_roster_ids: pdcState.observerRosterIds || [],
      observer_roster_context: (pdcState.observerRosterIds || []).map((speakerId) => {
        const info = getPdcObserverArchiveInfo(speakerId) || {};
        return {
          speakerId,
          archivedStance: info.archivedStance || info.archivedPerspective || "",
          archivedReason: info?.reason || "",
          lastContribution: info?.lastContribution || "",
          archivedAtPhaseLabel: info.archivedAtPhaseLabel || "",
          archivedAtRoundNumber: info.archivedAtRoundNumber || 0,
        };
      }),
      final_reintroduced_perspective: pdcState.finalReintroducedPerspective,
      phase_diagnostics: phaseDiagnostics,
      final_diagnostics: finalDiagnostics,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok !== true) {
    const error = new Error(data.message || data.fallbackReason || "Advanced Final Audit could not run.");
    error.contentDiagnostics = data.contentDiagnostics || null;
    throw error;
  }
  return data;
}

function createNextPdcPlaceholderPhase({ previousPhase, room, userIntervention = "" }) {
  const { roundNumber, phaseType } = getNextPdcPhaseSpec(previousPhase);
  const previousSummary = previousPhase?.blueWhaleSummary?.text || "";
  const personas = getPdcRosterPersonas(room, getPdcPhases(room)).filter((persona) => pdcState.activeRosterIds.includes(persona.id));
  const dialogue = personas.map((persona) => createPdcPhaseLine({ persona, roundNumber, phaseType, previousSummary, userIntervention }));
  const summaryText = buildPdcPlaceholderSummary({ modeId: pdcState.recap?.modeId, roundNumber, phaseType, userIntervention });
  const convergenceLevel = roundNumber >= 3 && phaseType === "B" ? "high" : roundNumber >= 2 ? "medium" : "low";
  const shouldConsiderStopping = convergenceLevel === "high";
  const voteSummary = phaseType === "B" ? createClientPdcVoteSummary(dialogue, personas) : null;
  const rosterUpdate = phaseType === "B" && roundNumber < pdcMaxNormalRound ? createClientPdcRosterUpdate(voteSummary) : { shouldArchivePerspective: false, reason: phaseType === "B" ? "Final voting phase closes without another observer transition." : "Position update phase only." };
  return {
    id: `round-${roundNumber}${phaseType.toLowerCase()}`,
    label: getPdcPhaseLabel(roundNumber, phaseType),
    phaseLabel: getPdcPhaseLabel(roundNumber, phaseType),
    roundNumber,
    phaseType,
    previousSummary,
    userIntervention,
    dialogue,
    voteSummary,
    rosterUpdate,
    blueWhaleSummary: {
      title: "Blue Whale Summary",
      text: summaryText,
      convergenceLevel,
      shouldConsiderStopping,
      suggestedReasonToStop: shouldConsiderStopping ? "Blue Whale suggests the discussion is converging. You may stop and summarize now, or continue for another round." : "",
    },
    meetingMemory: createPdcMeetingMemory({ phaseType, summaryText, userIntervention }),
    canContinue: true,
    canStopAndSummarize: true,
  };
}

function createPdcPhaseLine({ persona, roundNumber, phaseType, previousSummary, userIntervention }) {
  const speakerName = persona.englishName || persona.name || "Council Member";
  const role = persona.role || "Council Member";
  const guidance = userIntervention ? `, especially the user's guidance about ${userIntervention}` : "";
  const target = getClientPdcTargetPersona(persona);
  const text = phaseType === "A"
    ? `From the ${role} view${guidance}, I would name one concrete test for the user's current question before the next phase.`
    : `My contribution vote and concern vote identify what should carry forward and what needs pressure next${guidance}.`;
  return {
    speakerId: persona.id,
    speakerName,
    speakerChineseName: persona.name && persona.name !== persona.englishName ? persona.name : "",
    speakerLocalName: persona.name && persona.name !== persona.englishName ? persona.name : "",
    role,
    stanceType: phaseType === "A" ? "update" : "voting_record",
    targetSpeakerId: "",
    targetSpeakerName: "",
    text: previousSummary ? text : text,
    stanceSummary: text,
  };
}

function getClientPdcTargetPersona(persona) {
  const room = pdcState.recap?.councilRoom || {};
  const personas = getPdcRosterPersonas(room, getPdcPhases(room)).filter((item) => pdcState.activeRosterIds.includes(item.id));
  const index = Math.max(0, personas.findIndex((item) => item.id === persona.id));
  return personas[(index + personas.length - 1) % personas.length] || personas[0] || null;
}

function getClientPdcChallengeText({ persona, target, guidance }) {
  const targetName = target?.englishName || target?.name || "that view";
  const map = {
    "marcus-lu": "I challenge Adrian's optimism: if the downside is not survivable, opportunity should wait.",
    "felix-jiang": "Marcus is right about risk, but this does not need a full yes-or-no decision; test a smaller path first.",
    "iris-song": "I challenge Clara's emotional certainty: desire can be real, but it can also hide avoidance.",
    "max-stack": "I challenge Rex's growth-first view: traction is dangerous if cost limits are unclear.",
    "vera-flow": "Max is right about limits, but if users are confused in the first minute, scale will not matter.",
  };
  return `${map[persona.id] || `I would challenge ${targetName}'s assumption and make the next trade-off clearer.`}${guidance}`;
}

function createClientPdcVoteSummary(dialogue, personas) {
  const rows = dialogue.map((line, index) => {
    const contributionTarget = personas[(index + 1) % personas.length] || personas[0];
    const concernTarget = line.targetSpeakerId ? personas.find((persona) => persona.id === line.targetSpeakerId) : personas[(index + 2) % personas.length] || contributionTarget;
    line.contributionVote = {
      targetSpeakerId: contributionTarget?.id || "",
      targetSpeakerName: contributionTarget?.englishName || contributionTarget?.name || "",
      reason: "This contribution sharpened the discussion.",
    };
    line.concernVote = {
      targetSpeakerId: concernTarget?.id || "",
      targetSpeakerName: concernTarget?.englishName || concernTarget?.name || "",
      reason: "This perspective needs more pressure before the next phase.",
    };
    return line;
  });
  const tally = (key) => Object.values(rows.reduce((acc, line) => {
    const vote = line[key] || {};
    if (!vote.targetSpeakerId) return acc;
    acc[vote.targetSpeakerId] ||= { targetSpeakerId: vote.targetSpeakerId, targetSpeakerName: vote.targetSpeakerName, count: 0, reasons: [] };
    acc[vote.targetSpeakerId].count += 1;
    acc[vote.targetSpeakerId].reasons.push(vote.reason);
    return acc;
  }, {})).sort((a, b) => b.count - a.count);
  const contributionVotes = tally("contributionVote");
  const concernVotes = tally("concernVote");
  const leading = contributionVotes[0];
  const pressured = concernVotes[0];
  const tiedConcern = concernVotes[1] && pressured && concernVotes[1].count === pressured.count;
  return {
    contributionVotes,
    concernVotes,
    leadingContributor: leading ? { speakerId: leading.targetSpeakerId, speakerName: leading.targetSpeakerName, count: leading.count, reasonSummary: leading.reasons[0] || "" } : null,
    mostPressuredPerspective: pressured ? { speakerId: pressured.targetSpeakerId, speakerName: pressured.targetSpeakerName, count: pressured.count, reasonSummary: pressured.reasons[0] || "" } : null,
    suggestedArchivedPerspective: pressured && !tiedConcern ? { speakerId: pressured.targetSpeakerId, speakerName: pressured.targetSpeakerName, reason: pressured.reasons[0] || "" } : null,
    shouldArchivePerspective: Boolean(pressured && !tiedConcern),
  };
}

function createClientPdcRosterUpdate(voteSummary) {
  if (!voteSummary?.shouldArchivePerspective || !voteSummary.suggestedArchivedPerspective?.speakerId) return { shouldArchivePerspective: false, reason: "No clear narrowing consensus yet." };
  return {
    shouldArchivePerspective: true,
    archivedSpeakerId: voteSummary.suggestedArchivedPerspective.speakerId,
    archivedSpeakerName: voteSummary.suggestedArchivedPerspective.speakerName,
    reason: voteSummary.suggestedArchivedPerspective.reason,
  };
}

function buildPdcPlaceholderSummary({ modeId, roundNumber, phaseType, userIntervention = "" }) {
  const guidance = userIntervention ? ` The next phase also reflected the user's guidance: ${userIntervention}.` : "";
  if (phaseType === "A") {
    return modeId === "company"
      ? `Blue Whale Summary: Round ${roundNumber}A continued from the prior meeting memory and refreshed the council's positions around user value, trust, execution limits, and timing.${guidance}`
      : `Blue Whale Summary: Round ${roundNumber}A continued from the prior meeting memory and refreshed the council's positions around evidence, desire, risk, energy, relationships, and timing.${guidance}`;
  }
  return `Blue Whale Summary: The council continued from the prior meeting memory, clarified trade-offs, and narrowed the next question.${guidance} You can continue if more contrast is useful, or stop and summarize when the decision frame feels clear.`;
}

function createPdcMeetingMemory({ phaseType, summaryText, userIntervention = "" }) {
  return {
    compactSummary: summaryText,
    activeTensions: phaseType === "A" ? ["current position", "decision criteria"] : ["trade-offs", "blind spots"],
    strongestViews: [],
    openQuestions: userIntervention ? [userIntervention] : phaseType === "A" ? ["Which position should be tested next?"] : ["Which trade-off matters most now?"],
    convergenceSignals: [],
  };
}

function applyPdcFinalMemoryToRecap(recap) {
  const phases = Array.isArray(pdcState.pdcPhases) ? pdcState.pdcPhases : [];
  const latestPhase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)] || phases[phases.length - 1];
  const latestSummary = latestPhase?.blueWhaleSummary?.text || "";
  const recapSections = recap.recap || {};
  return {
    ...recap,
    recap: {
      ...recapSections,
      condensedReview: latestSummary
        ? `Stopped by the user after ${latestPhase.label}. ${latestSummary} This remains a placeholder recap, not live final analysis.`
        : recapSections.condensedReview,
      reflectionNote: "This is a placeholder reflection preview based on the discussion phases you chose to run. The final judgment remains yours.",
    },
  };
}

function renderPdcPersonaProfile(persona) {
  if (!persona) return "";
  const observerInfo = pdcState.observerRosterIds.includes(persona.id) ? getPdcObserverArchiveInfo(persona.id) : null;
  const history = getPdcMemberHistory(persona.id);
  const currentStance = getPdcCurrentMemberStance(persona.id, history);
  return `
    <aside class="pdc-profile-panel pdc-profile-inline is-open" aria-live="polite">
      <h2>Member Profile</h2>
      <dl>
        <dt>Name</dt><dd>${escapeHtml(persona.englishName || persona.name || "-")}${persona.name && persona.name !== persona.englishName ? ` / ${escapeHtml(persona.name)}` : ""}</dd>
        <dt>Role</dt><dd>${escapeHtml(persona.role || "-")}</dd>
        <dt>Responsibility</dt><dd>${escapeHtml(persona.responsibility || "-")}</dd>
        ${currentStance ? `<dt>Current stance</dt><dd>${escapeHtml(currentStance)}</dd>` : ""}
        ${observerInfo ? `
          <dt>Archived Perspective</dt><dd>${escapeHtml(observerInfo.archivedPerspective || persona.role || "-")}</dd>
          <dt>Reason moved to Observer</dt><dd>${escapeHtml(observerInfo.reason || persona.responsibility || "-")}</dd>
          <dt>Last contribution</dt><dd>${escapeHtml(observerInfo.lastContribution || persona.responsibility || "-")}</dd>
          <dt>Archived phase</dt><dd>${escapeHtml(observerInfo.archivedAtPhaseLabel || "-")}</dd>
        ` : ""}
      </dl>
      ${renderPdcPerspectiveTrail(history)}
    </aside>`;
}

function renderPdcPerspectiveTrail(history) {
  const entries = Array.isArray(history) ? history : [];
  if (!entries.length) {
    return `
      <div class="pdc-perspective-trail">
        <h3>Perspective Trail / 观点轨迹</h3>
        <p>This member's perspective trail will appear after the council starts.</p>
      </div>`;
  }
  const groups = [];
  entries.forEach((entry) => {
    const key = `${entry.roundLabel || ""}|${entry.phaseLabel || ""}`;
    let group = groups.find((item) => item.key === key);
    if (!group) {
      group = { key, roundLabel: entry.roundLabel, phaseLabel: entry.phaseLabel, entries: [] };
      groups.push(group);
    }
    group.entries.push(entry);
  });
  return `
    <div class="pdc-perspective-trail">
      <h3>Perspective Trail / 观点轨迹</h3>
      <div class="pdc-trail-list">
        ${groups.map((group) => `
          <section class="pdc-trail-group">
            <h4>${escapeHtml(group.phaseLabel || group.roundLabel || "Council phase")}</h4>
            ${group.entries.map(renderPdcPerspectiveTrailEntry).join("")}
          </section>
        `).join("")}
      </div>
    </div>`;
}

function renderPdcPerspectiveTrailEntry(entry) {
  const shouldShowStance = shouldShowPdcTrailField(entry.stance, entry.text);
  const shouldShowShift = shouldShowPdcTrailField(entry.stanceShift, entry.text) && !isGenericPdcTrailNote(entry.stanceShift);
  const shouldShowNote = shouldShowPdcTrailField(entry.historyNote, entry.text) && !isGenericPdcTrailNote(entry.historyNote);
  const meta = [
    entry.statementType ? formatPdcStatementType(entry.statementType) : "",
    entry.targetSpeakerName ? `Targets ${entry.targetSpeakerName}` : "",
  ].filter(Boolean).join(" · ");
  const voteBits = [
    entry.contributionVoteGiven ? `Contribution vote: ${entry.contributionVoteGiven}` : "",
    entry.concernVoteGiven ? `Concern vote: ${entry.concernVoteGiven}` : "",
  ].filter(Boolean);
  return `
    <article class="pdc-trail-entry">
      ${meta ? `<p class="pdc-trail-meta">${escapeHtml(meta)}</p>` : ""}
      <p>${escapeHtml(entry.text || "")}</p>
      ${shouldShowStance || shouldShowShift || shouldShowNote ? `
        <dl>
          ${shouldShowStance ? `<dt>Stance</dt><dd>${escapeHtml(entry.stance)}</dd>` : ""}
          ${shouldShowShift ? `<dt>Shift / 推进</dt><dd>${escapeHtml(entry.stanceShift)}</dd>` : ""}
          ${shouldShowNote ? `<dt>Note</dt><dd>${escapeHtml(entry.historyNote)}</dd>` : ""}
        </dl>` : ""}
      ${voteBits.length ? `<p class="pdc-trail-votes">${escapeHtml(voteBits.join(" · "))}</p>` : ""}
    </article>`;
}

function shouldShowPdcTrailField(value, statementText) {
  const field = normalizePdcComparableText(value);
  if (!field) return false;
  const statement = normalizePdcComparableText(statementText);
  if (!statement) return true;
  if (field === statement) return false;
  if (field.includes(statement) || statement.includes(field)) return false;
  const shorter = Math.min(field.length, statement.length);
  const longer = Math.max(field.length, statement.length);
  if (shorter >= 24 && shorter / longer > 0.82) {
    const sharedLength = longestSharedSubstringLength(field, statement);
    if (sharedLength / shorter > 0.82) return false;
  }
  return true;
}

function isGenericPdcTrailNote(value) {
  const text = normalizePdcComparableText(value);
  if (!text) return true;
  return /^(无变化|没有变化|暂无变化|保持原观点|保持原立场|继续关注|none|nochange|unchanged|sameposition|sameview|continued)$/.test(text);
}

function normalizePdcComparableText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[.,!?;:'"()[\]{}，。！？；：“”‘’（）【】《》、\s]/g, "")
    .trim();
}

function longestSharedSubstringLength(a, b) {
  if (!a || !b) return 0;
  const previous = new Array(b.length + 1).fill(0);
  let best = 0;
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = 0;
    for (let j = 1; j <= b.length; j += 1) {
      const saved = previous[j];
      previous[j] = a[i - 1] === b[j - 1] ? diagonal + 1 : 0;
      if (previous[j] > best) best = previous[j];
      diagonal = saved;
    }
  }
  return best;
}

function formatPdcStatementType(value) {
  const text = String(value || "").replace(/[_-]+/g, " ").trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function getPdcCurrentMemberStance(personaId, history = null) {
  const entries = Array.isArray(history) ? history : getPdcMemberHistory(personaId);
  const latest = entries[entries.length - 1];
  return latest?.stance || latest?.text || "";
}

function appendPdcMemberHistoryFromPhases(phases = []) {
  (Array.isArray(phases) ? phases : []).forEach((phase, phaseIndex) => appendPdcMemberHistoryFromPhase(phase, phaseIndex));
  return pdcState.memberHistory;
}

function appendPdcMemberHistoryFromPhase(phase, phaseIndex = 0) {
  if (!shouldUsePdcPhaseForHistory(phase)) return;
  (Array.isArray(phase.dialogue) ? phase.dialogue : []).forEach((line, lineIndex) => {
    if (!shouldUsePdcLineForHistory(line)) return;
    if (line.contentSource === "final-reintroduced") return;
    if (pdcState.observerRosterIds.includes(line.speakerId) && phase.rosterUpdate?.archivedSpeakerId !== line.speakerId) return;
    const item = createPdcHistoryItem({ phase, line, phaseIndex, lineIndex });
    if (!item?.speakerId || !item.historyKey) return;
    pdcState.memberHistory ||= {};
    pdcState.memberHistory[item.speakerId] ||= [];
    if (pdcState.memberHistory[item.speakerId].some((existing) => existing.historyKey === item.historyKey)) return;
    pdcState.memberHistory[item.speakerId].push(item);
  });
}

function shouldUsePdcPhaseForHistory(phase) {
  if (!phase || phase.isWarmup) return false;
  const provider = String(phase.provider || phase.contentDiagnostics?.provider || "").toLowerCase();
  if (provider === "demo") return true;
  if (provider !== "openai") return false;
  const visibleCount = Number(phase.contentDiagnostics?.visibleStatementCount || phase.contentDiagnostics?.modelStatementCount || 0);
  const dialogue = Array.isArray(phase.dialogue) ? phase.dialogue : [];
  return visibleCount > 0 || dialogue.some((line) => line?.contentSource === "model");
}

function shouldUsePdcLineForHistory(line) {
  if (!line?.speakerId || !line?.text) return false;
  if (line.contentSource === "final-reintroduced") return false;
  if (line.contentSource === "demo-script") return true;
  if (line.contentSource && line.contentSource !== "model") return false;
  return !isPdcPlaceholderLine(line);
}

function isPdcPlaceholderLine(line) {
  const text = String(line?.text || line?.stanceSummary || "").trim();
  return /placeholder|live PDC generation|Development placeholder/i.test(text);
}

function createPdcHistoryItem({ phase, line, phaseIndex, lineIndex }) {
  const targetName = line.targetSpeakerName || findPdcPersonaById(line.targetSpeakerId)?.englishName || findPdcPersonaById(line.targetSpeakerId)?.name || "";
  const phaseId = phase.id || `${phase.roundNumber || phaseIndex + 1}-${phase.phaseType || ""}-${normalizePdcDisplayText(phase.phaseLabel || phase.label || "")}`;
  const isBPhase = String(phase.phaseType || "").toUpperCase() === "B";
  const contributionVoteGiven = line.contributionVote?.targetSpeakerName || line.contributionVote?.targetSpeakerId || "";
  const concernVoteGiven = line.concernVote?.targetSpeakerName || line.concernVote?.targetSpeakerId || "";
  return {
    phaseId,
    historyKey: `${phaseId}:${line.speakerId}`,
    speakerId: line.speakerId,
    speakerName: line.speakerName || "",
    role: line.role || "",
    roundLabel: phase.label || phase.phaseLabel || "",
    phaseLabel: phase.phaseLabel || phase.label || "",
    statementType: isBPhase ? "voting_record" : line.statementType || line.stanceType || "",
    text: line.text || line.stanceSummary || "",
    targetSpeakerId: line.targetSpeakerId || "",
    targetSpeakerName: targetName,
    stance: isBPhase ? "" : line.stance || line.stanceSummary || "",
    stanceShift: isBPhase ? line.contributionVote?.reason || "" : line.stanceShift || "",
    historyNote: isBPhase ? line.concernVote?.reason || "" : line.historyNote || "",
    contributionVoteGiven,
    concernVoteGiven,
    sequenceIndex: phaseIndex * 100 + lineIndex,
    timestamp: Date.now(),
  };
}

function getPdcMemberHistory(personaId) {
  return Array.isArray(pdcState.memberHistory?.[personaId]) ? pdcState.memberHistory[personaId] : [];
}

function getPdcObserverArchiveInfo(personaId) {
  const frozen = pdcState.archivedObservers?.[personaId];
  if (frozen) {
    return {
      archivedPerspective: frozen.name || personaId,
      archivedStance: frozen.archivedStance || "",
      reason: frozen.archivedReason || "",
      lastContribution: frozen.archivedLastContribution || "",
      archivedAtPhaseLabel: frozen.archivedAtPhaseLabel || "",
      archivedAtRoundNumber: frozen.archivedAtRoundNumber || 0,
    };
  }
  const room = pdcState.recap?.councilRoom || {};
  const phases = getPdcPhases(room);
  const archivePhase = [...phases].reverse().find((phase) => phase.rosterUpdate?.archivedSpeakerId === personaId);
  const lastLine = [...phases].reverse()
    .flatMap((phase) => Array.isArray(phase.dialogue) ? [...phase.dialogue].reverse() : [])
    .find((line) => line.speakerId === personaId);
  if (!archivePhase && !lastLine) return null;
  return {
    archivedPerspective: archivePhase?.rosterUpdate?.archivedSpeakerName || lastLine?.speakerName || personaId,
    reason: archivePhase?.rosterUpdate?.reason || "",
    lastContribution: lastLine?.text || lastLine?.stanceSummary || "",
  };
}

function getPdcFrozenObserverSummaries() {
  return (pdcState.observerRosterIds || []).map((speakerId) => {
    const persona = findPdcPersonaById(speakerId) || {};
    const info = getPdcObserverArchiveInfo(speakerId) || {};
    return {
      speakerId,
      name: info.archivedPerspective || persona.englishName || persona.name || speakerId,
      role: persona.role || "",
      archivedStance: info.archivedStance || info.lastContribution || "",
      lastContribution: info.lastContribution || "",
      reasonArchived: info.reason || "",
      archivedAtPhaseLabel: info.archivedAtPhaseLabel || "",
      archivedAtRoundNumber: info.archivedAtRoundNumber || 0,
    };
  });
}

function getPdcMostRewardedContributor() {
  const counts = new Map();
  const latestCounts = new Map();
  getPdcPhases(pdcState.recap?.councilRoom || {}).filter((phase) => String(phase.phaseType).toUpperCase() === "B").forEach((phase) => {
    latestCounts.clear();
    (phase.voteSummary?.contributionVotes || []).forEach((vote) => {
      const speakerId = vote?.speakerId || vote?.targetSpeakerId;
      if (!speakerId) return;
      counts.set(speakerId, (counts.get(speakerId) || 0) + Number(vote.count || 0));
      latestCounts.set(speakerId, Number(vote.count || 0));
    });
  });
  const rows = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  if (!rows.length) return { speakerId: "", name: "", count: 0, tie: false };
  const topCount = rows[0][1];
  const tiedRows = rows.filter((row) => row[1] === topCount);
  let [speakerId, count] = rows[0];
  let tieResolution = "";
  if (tiedRows.length > 1) {
    const latestSorted = tiedRows.sort((a, b) => (latestCounts.get(b[0]) || 0) - (latestCounts.get(a[0]) || 0));
    speakerId = latestSorted[0][0];
    count = latestSorted[0][1];
    tieResolution = latestSorted[1] && (latestCounts.get(latestSorted[0][0]) || 0) === (latestCounts.get(latestSorted[1][0]) || 0)
      ? "Blue Whale unresolved core tension relevance"
      : "latest B-phase contribution votes";
  }
  const tie = tiedRows.length > 1;
  const persona = findPdcPersonaById(speakerId) || {};
  return { speakerId, name: persona.englishName || persona.name || speakerId, count, tie, tieResolution, cumulativeCounts: Object.fromEntries(counts), latestBPhaseCounts: Object.fromEntries(latestCounts) };
}

function selectPdcFinalReenabledObserver(rewarded, observers, currentRound) {
  if (!Array.isArray(observers) || !observers.length) return { skippedReason: "no_archived_perspective" };
  const activeIds = new Set(pdcState.activeRosterIds || []);
  let activeMemberBlocked = false;
  let candidateInvalidReason = "";
  const validObservers = observers.filter((observer) => {
    if (!observer?.speakerId) {
      candidateInvalidReason ||= "missing_speaker_id";
      return false;
    }
    if (!pdcState.observerRosterIds.includes(observer.speakerId)) {
      candidateInvalidReason ||= "candidate_not_in_observer_roster";
      return false;
    }
    if (activeIds.has(observer.speakerId)) {
      activeMemberBlocked = true;
      candidateInvalidReason ||= "candidate_still_active";
      return false;
    }
    return true;
  });
  if (!validObservers.length) return { skippedReason: "no_valid_archived_perspective", activeMemberBlocked, candidateInvalidReason };
  const coreTension = normalizePdcDisplayText(currentRound?.blueWhaleSummary?.strongestDisagreement || currentRound?.blueWhaleSummary?.text || "");
  const rewardedRole = normalizePdcDisplayText(findPdcPersonaById(rewarded?.speakerId)?.role || "");
  const selected = validObservers
    .map((observer) => {
      const haystack = normalizePdcDisplayText(`${observer.role || ""} ${observer.archivedStance || ""} ${observer.reasonArchived || ""} ${observer.lastContribution || ""}`).toLowerCase();
      const score = ["risk", "evidence", "emotion", "blind", "opportunity", "execution", "user", "trust", "cost", "tension"]
        .reduce((sum, token) => sum + (haystack.includes(token) || coreTension.toLowerCase().includes(token) ? 1 : 0), 0);
      return { observer, score };
    })
    .sort((a, b) => b.score - a.score || a.observer.name.localeCompare(b.observer.name))[0]?.observer;
  if (!selected) return { skippedReason: "no_valid_archived_perspective", activeMemberBlocked, candidateInvalidReason };
  return {
    ...selected,
    selectionSource: "observerRoster",
    activeMemberBlocked,
    candidateInvalidReason,
    selectedById: rewarded?.speakerId || "",
    selectedByName: rewarded?.name || "Most Rewarded Contributor",
    selectionReason: `${rewarded?.name || "The most rewarded contributor"} re-enables this archived perspective to pressure the final decision on ${coreTension || rewardedRole || "the unresolved core tension"}.`,
  };
}

function maybeAddPdcFinalReintroducedPerspective(phase) {
  if (!phase || Number(phase.roundNumber) !== pdcMaxNormalRound || String(phase.phaseType).toUpperCase() !== "A" || pdcState.finalReintroducedPerspective?.added) return;
  const selectedId = pdcState.finalRoundPreviewSelection;
  if (!selectedId) {
    pdcState.finalReenableSkippedReason ||= "no_reintroduced_perspective_selected";
    return;
  }
  if (!pdcState.observerRosterIds.includes(selectedId)) {
    pdcState.finalReenableSkippedReason = "selected_candidate_not_in_observer_roster";
    pdcState.reEnabledObserverCandidateInvalidReason = "candidate_not_in_observer_roster";
    return;
  }
  if ((pdcState.activeRosterIds || []).includes(selectedId)) {
    pdcState.finalReenableSkippedReason = "selected_candidate_still_active";
    pdcState.reEnabledObserverWasActiveMemberBlocked = true;
    pdcState.reEnabledObserverCandidateInvalidReason = "candidate_still_active";
    return;
  }
  const info = getPdcObserverArchiveInfo(selectedId) || {};
  const persona = findPdcPersonaById(selectedId) || {};
  const meta = pdcState.finalReenabledObserverMeta || {};
  const name = persona.englishName || persona.name || selectedId;
  const line = {
    speakerId: selectedId,
    speakerName: name,
    speakerChineseName: persona.name && persona.name !== persona.englishName ? persona.name : "",
    role: persona.role || "Archived Perspective",
    statementType: "final_reintroduced",
    stanceType: "final_reintroduced",
    targetSpeakerId: "",
    targetSpeakerName: "",
    text: `Final Reintroduced Perspective: ${info.lastContribution || info.archivedStance || `${name} asks the council to re-check this archived perspective before the recap.`}`,
    stanceSummary: info.archivedStance || info.lastContribution || "",
    contentSource: "final-reintroduced",
    contributionVote: null,
    concernVote: null,
  };
  phase.dialogue = [line, ...(Array.isArray(phase.dialogue) ? phase.dialogue : [])];
  pdcState.finalReintroducedPerspective = {
    speakerId: selectedId,
    speakerName: name,
    selectionSource: "observerRoster",
    selectedById: meta.selectedById || "",
    selectedByName: meta.selectedByName || "",
    reasonForReintroduction: meta.selectionReason || "Selected automatically in Final Round Preview",
    finalReflection: line.text,
    added: true,
  };
}

function getPersonaInitials(persona) {
  const source = persona.englishName || persona.name || "CM";
  const words = source.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function renderPdcRecap(recap) {
  const recapSections = normalizePdcRecapSectionsForDisplay(recap.recap || recap.sections || {});
  const sections = [
    ["Decision Frame", recapSections.decisionFrame, "frame"],
    ["Core Tension", recapSections.coreTension, "tension"],
    ["Council Highlights", recapSections.councilHighlights, "highlights"],
    ["Debate Snapshot", recapSections.debateSnapshot, "snapshot"],
    ["Condensed Review", recapSections.condensedReview, "review"],
    ["Final Recommendation", recapSections.finalRecommendation, "recommendation"],
    ["Next Actions", recapSections.nextActions, "actions"],
    ["What Not To Do", recapSections.whatNotToDo, "warning"],
    ["Reflection Note", recapSections.reflectionNote, "note"],
  ];
  return `
    <section class="pdc-result pdc-decision-memo">
      <div class="pdc-memo-head">
        <div>
          <p class="eyebrow">${escapeHtml(recap.modeLabel || "PDC")}</p>
          <h1>Council Recap</h1>
          <p class="pdc-memo-subtitle">A polished decision memo distilled from the council discussion.</p>
        </div>
        ${renderPdcStatusChips([
          recap.finalRecapProvider ? recap.finalRecapProvider.replace(/^openai$/i, "OpenAI") : "",
          recap.modelName || "",
          recap.finalRecapStrict || recap.strict ? "Strict" : "",
          recap.finalRecapFallbackUsed ? "Fallback" : "No fallback",
        ])}
      </div>
      ${renderPdcRecapNotice(recap)}
      ${recap.rosterSummary ? `<p class="pdc-roster-note">${escapeHtml(recap.rosterSummary)}</p>` : ""}
      <div class="pdc-recap-sections">
        ${sections.map(([title, value, kind]) => `
          <article class="pdc-recap-section pdc-recap-${kind}">
            <h2>${title}</h2>
            ${Array.isArray(value) ? `<ul>${value.map((item) => `<li>${escapeHtml(normalizePdcDisplayText(item))}</li>`).join("")}</ul>` : `<p>${escapeHtml(normalizePdcDisplayText(value))}</p>`}
          </article>`).join("")}
      </div>
    </section>`;
}

function renderPdcRecapNotice(recap) {
  const provider = recap.finalRecapProvider || "";
  const notice = recap.placeholderNotice || "";
  if ((provider === "cloudflare" || provider === "openai") && !recap.finalRecapFallbackUsed) {
    return `<p class="pdc-placeholder-notice">Generated Council Recap</p>`;
  }
  if (recap.finalRecapFallbackUsed && notice) return `<p class="pdc-placeholder-notice">${escapeHtml(notice)}</p>`;
  if (recap.isPlaceholder) return `<p class="pdc-placeholder-notice">Development placeholder output — live PDC API is not connected yet.</p>`;
  return "";
}

function renderPdcAdvancedFinalAudit() {
  if (!pdcState.founderPreview) return "";
  const audit = pdcState.advancedAudit?.audit || null;
  const diagnostics = pdcState.providerDiagnostics?.advancedAudit?.contentDiagnostics || {};
  const advancedInfo = pdcState.providerDiagnostics?.advancedAudit || {};
  return `
    <section class="pdc-advanced-audit">
      <div class="pdc-audit-head">
        <div>
          <p class="eyebrow">Founder Insight Report</p>
          <h2>Adaptive Final Decision Layer</h2>
          <p>A manually triggered Founder-only layer that chooses the right final answer shape for this decision.</p>
        </div>
        ${renderPdcStatusChips(getPdcProviderChips({
          provider: diagnostics.advancedAuditProvider || advancedInfo.actualProvider || advancedInfo.provider || "OpenAI",
          model: diagnostics.advancedAuditActualModel || advancedInfo.actualModel || advancedInfo.modelName || "GPT-5.5",
          strict: diagnostics.advancedAuditStrict === true || advancedInfo.strict === true,
          fallbackUsed: diagnostics.advancedAuditFallbackUsed === true || advancedInfo.fallbackUsed === true,
          founderOnly: true,
          manualAudit: true,
        }))}
      </div>
      ${audit ? renderPdcAdvancedAuditResult(audit) : `
        <button class="button secondary pdc-audit-button" type="button" data-pdc-run-advanced-audit ${pdcState.advancedAuditLoading ? "disabled" : ""}>${pdcState.advancedAuditLoading ? "Running Advanced Final Audit..." : "Run Advanced Final Audit"}</button>
      `}
      ${pdcState.advancedAuditError ? `<p class="pdc-status">${escapeHtml(pdcState.advancedAuditError)}</p>` : ""}
    </section>`;
}

function renderPdcAdvancedAuditResult(audit) {
  const diagnosis = audit.adaptiveDiagnosis || {};
  const bias = audit.biasAudit || {};
  const judgment = audit.improvedFinalJudgment || {};
  const adaptivePackage = audit.adaptiveFinalPackage || {};
  const display = audit.finalDisplay || {};
  return `
    <div class="pdc-advanced-audit-grid">
      ${display.objectiveConclusion ? `
        <article class="pdc-audit-highlight">
          <h3>Objective Conclusion</h3>
          <p>${escapeHtml(display.objectiveConclusion)}</p>
        </article>` : ""}
      <article>
        <h3>Decision Context</h3>
        <p>${escapeHtml(diagnosis.decisionContext || display.summary || "-")}</p>
      </article>
      <article>
        <h3>Decision Nature</h3>
        <p>${escapeHtml(diagnosis.decisionNature || "-")}</p>
      </article>
      <article>
        <h3>User Real Need</h3>
        <p>${escapeHtml(diagnosis.userRealNeed || "-")}</p>
      </article>
      <article>
        <h3>Main Weakness of Council Recap</h3>
        <p>${escapeHtml(diagnosis.recapMainWeakness || "-")}</p>
      </article>
      <article>
        <h3>Recommended Output Shape</h3>
        <p>${escapeHtml(diagnosis.recommendedOutputShape || adaptivePackage.title || "-")}</p>
      </article>
      <article>
        <h3>Why This Shape Fits</h3>
        <p>${escapeHtml(diagnosis.whyThisShapeFits || "-")}</p>
      </article>
      <article>
        <h3>Bias & Stage Fit</h3>
        <p>${escapeHtml(bias.mainBias || "-")}</p>
        ${bias.stageMismatch ? `<p>${escapeHtml(bias.stageMismatch)}</p>` : ""}
        ${renderPdcAuditList([...normalizePdcDisplayList(bias.overcomplicatedParts), ...normalizePdcDisplayList(bias.falsePrecisionRisks)])}
      </article>
      <article class="pdc-audit-judgment">
        <h3>Improved Final Judgment</h3>
        <p>${escapeHtml(judgment.oneSentenceConclusion || display.objectiveConclusion || "-")}</p>
        ${judgment.why ? `<p>${escapeHtml(judgment.why)}</p>` : ""}
        ${judgment.bestFirstStep ? `<p><strong>Best first step:</strong> ${escapeHtml(judgment.bestFirstStep)}</p>` : ""}
      </article>
      <article class="pdc-advanced-package">
        <h3>Adaptive Final Package</h3>
        ${renderPdcAdaptiveFinalPackage(adaptivePackage)}
      </article>
      <article class="pdc-audit-highlight">
        <h3>Recommended Next Step</h3>
        <p>${escapeHtml(display.recommendedNextStep || judgment.bestFirstStep || "-")}</p>
      </article>
    </div>`;
}

function renderPdcAdaptiveFinalPackage(adaptivePackage) {
  const sections = Array.isArray(adaptivePackage?.sections) ? adaptivePackage.sections : [];
  if (!sections.length) return `<p>${escapeHtml(adaptivePackage?.title || "-")}</p>`;
  return `
    ${adaptivePackage.title ? `<p><strong>${escapeHtml(adaptivePackage.title)}</strong></p>` : ""}
    <div class="pdc-adaptive-package-sections">
      ${sections.map((section) => `
        <section>
          <h4>${escapeHtml(section.heading || "Decision section")}</h4>
          ${section.content ? `<p>${escapeHtml(normalizePdcDisplayText(section.content))}</p>` : ""}
          ${renderPdcAuditList(section.bullets)}
        </section>
      `).join("")}
    </div>`;
}

function renderPdcAuditList(items) {
  const rows = Array.isArray(items) ? items.filter(Boolean) : [];
  return rows.length ? `<ul>${rows.map((item) => `<li>${escapeHtml(normalizePdcDisplayText(item))}</li>`).join("")}</ul>` : `<p>-</p>`;
}

function normalizePdcRecapSectionsForDisplay(sections) {
  const source = sections && typeof sections === "object" ? sections : {};
  const clean = (value) => cleanPdcFinalRecapText(normalizePdcDisplayText(value));
  const cleanList = (value) => normalizePdcDisplayList(value).map(cleanPdcFinalRecapText).filter(Boolean);
  return {
    decisionFrame: clean(source.decisionFrame),
    coreTension: clean(source.coreTension),
    councilHighlights: cleanList(source.councilHighlights),
    debateSnapshot: clean(source.debateSnapshot),
    condensedReview: clean(source.condensedReview),
    finalRecommendation: clean(source.finalRecommendation),
    nextActions: cleanList(source.nextActions),
    whatNotToDo: cleanList(source.whatNotToDo),
    reflectionNote: clean(source.reflectionNote),
  };
}

function normalizePdcDisplayList(value) {
  if (Array.isArray(value)) return value.map((item) => normalizePdcDisplayText(item)).filter(Boolean);
  const text = normalizePdcDisplayText(value);
  return text ? [text] : [];
}

function normalizePdcDisplayText(value) {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value).replace(/\s+/g, " ").trim();
  if (Array.isArray(value)) return value.map((item) => normalizePdcDisplayText(item)).filter(Boolean).join(" ");
  if (value && typeof value === "object") {
    const keys = ["speaker", "speakerName", "name", "title", "role", "action", "warning", "summary", "text", "reason", "why", "detail", "details", "recommendation", "note"];
    const parts = keys.map((key) => normalizePdcDisplayText(value[key])).filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}: ${parts.slice(1).join(" — ")}`;
    if (parts.length === 1) return parts[0];
    try {
      return JSON.stringify(value);
    } catch {
      return "";
    }
  }
  return "";
}

function cleanPdcFinalRecapText(value) {
  let text = String(value || "").replace(/\s+/g, " ").trim();
  if (!text) return "";
  const replacements = [
    [/Rex Velocity\s*\/\s*Rex Velocity|Rex Velocity|Rex Velocity/g, "Rex Velocity"],
    [/Vera Flow\s*\/\s*Vera Flow|Vera Flow|Vera Flow/g, "Vera Flow"],
    [/Max Build\s*\/\s*Max Build|Max Build|Max Build/g, "Max Build"],
    [/Nina Ember\s*\/\s*Nina Ember|Nina Ember|Nina Ember/g, "Nina Ember"],
    [/Wang Zhibai\s*\/\s*(Wang Zhibai|姜飞力)|姜飞力|Wang Zhibai|Wang Zhibai/g, "Wang Zhibai"],
    [/Owen Insight\s*\/\s*Owen Insight|Owen Insight|Owen Insight/g, "Owen Insight"],
    [/Adrian North\s*\/\s*Adrian North|Adrian North|Adrian North/g, "Adrian North"],
    [/Mira Ethos\s*\/\s*Mira Ethos|Mira Ethos|Mira Ethos/g, "Mira Ethos"],
    [/Orion Zhuge\s*\/\s*诸葛观辰|诸葛观辰|Orion Zhuge/g, "Orion Zhuge / 诸葛观辰"],
    [/Blue Whale\s*\/\s*蓝鲸|蓝鲸|Blue Whale/g, "Blue Whale / 蓝鲸"],
    [/牛顿/g, "Blue Whale / 蓝鲸"],
  ];
  replacements.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });
  const phases = Array.isArray(pdcState.pdcPhases) ? pdcState.pdcPhases : [];
  const hasVotes = phases.some((phase) => phase.voteSummary);
  const hasObservers = Array.isArray(pdcState.observerRosterIds) && pdcState.observerRosterIds.length > 0;
  if (hasVotes && /no formal vote|no vote|没有正式投票|未进行投票/i.test(text)) return "";
  if (hasObservers && /no observers|no observer|没有观察者|无观察者/i.test(text)) return "";
  return text;
}

function renderPdcReintroducedPerspective() {
  const item = normalizePdcReintroducedForDisplay(pdcState.finalReintroducedPerspective);
  if (!item) return "";
  return `
    <section class="pdc-reintroduced">
      <p class="eyebrow">Reintroduced Perspective</p>
      <h2>${escapeHtml(item.speakerName || "Archived perspective")}${item.speakerChineseName ? ` / ${escapeHtml(item.speakerChineseName)}` : ""}</h2>
      <p class="pdc-role-line">${escapeHtml(item.role || "")}</p>
      <p>Blue Whale reintroduces one archived perspective for a final reflection before summarizing.</p>
      ${item.reasonForReintroduction ? `<p><strong>Why this perspective returns:</strong> ${escapeHtml(item.reasonForReintroduction)}</p>` : ""}
      ${item.finalReflection ? `<blockquote>${escapeHtml(item.finalReflection)}</blockquote>` : ""}
    </section>`;
}

function normalizePdcReintroducedForDisplay(item) {
  if (!item || typeof item !== "object") return null;
  const persona = findPdcPersonaById(item.speakerId) || findPdcPersonaByName(item.speakerName);
  return {
    speakerId: persona?.id || normalizePdcDisplayText(item.speakerId),
    speakerName: persona?.englishName || normalizePdcDisplayText(item.speakerName) || "Archived perspective",
    speakerChineseName: persona?.name && persona.name !== persona.englishName ? persona.name : normalizePdcDisplayText(item.speakerChineseName),
    role: persona?.role || normalizePdcDisplayText(item.role),
    reasonForReintroduction: normalizePdcDisplayText(item.reasonForReintroduction),
    finalReflection: normalizePdcDisplayText(item.finalReflection),
  };
}

function findPdcPersonaById(personaId) {
  const id = normalizePdcDisplayText(personaId);
  if (!id) return null;
  const room = pdcState.recap?.councilRoom || {};
  return getPdcRosterPersonas(room, getPdcPhases(room)).find((persona) => persona.id === id) || null;
}

function findPdcPersonaByName(name) {
  const normalizedName = normalizePdcDisplayText(name).toLowerCase();
  if (!normalizedName) return null;
  const room = pdcState.recap?.councilRoom || {};
  return getPdcRosterPersonas(room, getPdcPhases(room)).find((persona) => [persona.englishName, persona.name].filter(Boolean).some((value) => value.toLowerCase() === normalizedName)) || null;
}

function renderPdcProviderDiagnostics() {
  if (!pdcState.founderPreview || !pdcState.providerDiagnostics) return "";
  const info = pdcState.providerDiagnostics;
  const phase = info.phase || (!info.final ? info : null);
  const final = info.final || (info.finalReintroducedPerspective || info.recap ? info : null);
  const advancedAudit = info.advancedAudit || null;
  const phaseDiagnostics = phase?.contentDiagnostics || null;
  const finalDiagnostics = final?.contentDiagnostics || null;
  const auditDiagnostics = advancedAudit?.contentDiagnostics || null;
  const lifecycleDiagnostics = getPdcLifecycleDiagnostics(phaseDiagnostics);
  const summary = [
    `councilTier: ${pdcState.effectiveTier || pdcState.councilTier || "standard"}`,
    `phaseModel: ${pdcState.phaseModel || phase?.phaseModel || phase?.modelName || "-"}`,
    `finalModel: ${pdcState.finalModel || final?.finalModel || final?.modelName || "-"}`,
    `Provider: ${phase?.actualProvider || phase?.provider || final?.actualProvider || final?.provider || "-"}`,
    `Fallback: ${(phase?.fallbackUsed || final?.fallbackUsed) ? "yes" : "no"}`,
    `Strict: ${(phase?.strict || phaseDiagnostics?.strict || final?.strict || finalDiagnostics?.finalRecapStrict) ? "true" : "false"}`,
    `Duration: ${Number(phaseDiagnostics?.phaseTotalDurationMs || phaseDiagnostics?.totalPhaseDurationMs || finalDiagnostics?.finalRecapTotalDurationMs || 0)}ms`,
    `Prompt chars: ${Number(phaseDiagnostics?.promptCharLength || finalDiagnostics?.finalRecapPromptCharLength || 0)}`,
  ].join(" · ");
  return `
    <details class="pdc-founder-phase-debug pdc-provider-debug">
      <summary>
        <span>${escapeHtml(summary)}</span>
        <em>Show debug details</em>
      </summary>
      <div class="pdc-debug-details">
      <p>councilTier: ${escapeHtml(pdcState.councilTier || "standard")} · requestedTier: ${escapeHtml(pdcState.requestedTier || "standard")} · effectiveTier: ${escapeHtml(pdcState.effectiveTier || "standard")} · phaseModel: ${escapeHtml(pdcState.phaseModel || phase?.phaseModel || "-")} · finalModel: ${escapeHtml(pdcState.finalModel || final?.finalModel || "-")} · founderOnlyFullFunction: ${pdcState.founderOnlyFullFunction ? "true" : "false"}</p>
      ${phase ? `<p>Phase dialogue provider: ${escapeHtml(phase.actualProvider || phase.provider || "-")} · Requested: ${escapeHtml(phase.requestedProvider || "-")} · Fallback: ${phase.fallbackUsed ? "yes" : "no"}${phase.fallbackReason ? ` · ${escapeHtml(phase.fallbackReason)}` : ""}</p>` : ""}
      ${final ? `<p>Final recap provider: ${escapeHtml(final.actualProvider || final.provider || "-")} · Requested: ${escapeHtml(final.requestedProvider || "-")} · Fallback: ${final.fallbackUsed ? "yes" : "no"}${final.fallbackReason ? ` · ${escapeHtml(final.fallbackReason)}` : ""}</p>` : ""}
      ${phase ? `<p>Phase model: ${escapeHtml(phase.modelName || "-")} · Phase JSON parse failed: ${phase.jsonParseFailed ? "yes" : "no"} · Phase schema: ${escapeHtml(phase.schemaName || phaseDiagnostics?.schemaName || "-")} · Phase strict: ${(phase.strict || phaseDiagnostics?.strict) ? "true" : "false"}${phase.providerErrorShort ? ` · Phase error: ${escapeHtml(phase.providerErrorShort)}` : ""}</p>` : ""}
      ${final ? `<p>Final recap model: ${escapeHtml(final.modelName || "-")} · Final recap JSON parse failed: ${final.jsonParseFailed ? "yes" : "no"} · Final recap schema: ${escapeHtml(final.schemaName || finalDiagnostics?.finalRecapSchemaName || "-")} · Final recap strict: ${(final.strict || finalDiagnostics?.finalRecapStrict) ? "true" : "false"}${final.providerErrorShort ? ` · Final recap error: ${escapeHtml(final.providerErrorShort)}` : ""}</p>` : ""}
      ${phaseDiagnostics ? `<p>Phase speed: phaseOpenAiDurationMs=${Number(phaseDiagnostics.phaseOpenAiDurationMs || phaseDiagnostics.openAiDurationMs || 0)} · phaseRetryDurationMs=${Number(phaseDiagnostics.phaseRetryDurationMs || phaseDiagnostics.retryDurationMs || 0)} · phaseTotalDurationMs=${Number(phaseDiagnostics.phaseTotalDurationMs || phaseDiagnostics.totalPhaseDurationMs || 0)} · promptCharLength=${Number(phaseDiagnostics.promptCharLength || 0)} · approximateInputTokenEstimate=${Number(phaseDiagnostics.approximateInputTokenEstimate || 0)} · outputCharLength=${Number(phaseDiagnostics.outputCharLength || 0)} · activeRosterCount=${Number(phaseDiagnostics.activeRosterCount || 0)} · observerCount=${Number(phaseDiagnostics.observerCount || 0)} · meetingMemoryItemCount=${Number(phaseDiagnostics.meetingMemoryItemCount || 0)} · phaseMaxOutputTokens=${Number(phaseDiagnostics.phaseMaxOutputTokens || phaseDiagnostics.maxOutputTokens || 0)} · retryMaxOutputTokens=${Number(phaseDiagnostics.retryMaxOutputTokens || 0)}</p>` : ""}
      ${phaseDiagnostics ? `<p>Session reset: sessionResetApplied=${phaseDiagnostics.sessionResetApplied ? "true" : "false"} · pdcSessionId=${escapeHtml(phaseDiagnostics.pdcSessionId || "-")} · initialRoundNumber=${Number(phaseDiagnostics.initialRoundNumber || 0)} · initialMeetingMemoryItemCount=${Number(phaseDiagnostics.initialMeetingMemoryItemCount || 0)} · previousSessionCleared=${phaseDiagnostics.previousSessionCleared ? "true" : "false"}</p>` : ""}
      ${phaseDiagnostics ? `<p>Phase cost optimization: activeRosterPromptCount=${Number(phaseDiagnostics.activeRosterPromptCount || 0)} · observerRosterPromptCount=${Number(phaseDiagnostics.observerRosterPromptCount || 0)} · observerProfilesOmittedFromPrompt=${phaseDiagnostics.observerProfilesOmittedFromPrompt ? "true" : "false"} · archivedSummaryIncluded=${phaseDiagnostics.archivedSummaryIncluded ? "true" : "false"} · estimatedPromptTokenReduction=${Number(phaseDiagnostics.estimatedPromptTokenReduction || 0)} · costOptimizationApplied=${phaseDiagnostics.costOptimizationApplied ? "true" : "false"} · allowedSpeakerIdsForPhase=${escapeHtml((phaseDiagnostics.allowedSpeakerIdsForPhase || []).join(", ") || "-")} · generatedSpeakerIds=${escapeHtml((phaseDiagnostics.generatedSpeakerIds || []).join(", ") || "-")}</p>` : ""}
      ${phaseDiagnostics ? `<p>Phase quality: OpenAI returned statement count=${Number(phaseDiagnostics.modelStatementCount || 0)} · Normalized statement count=${Number(phaseDiagnostics.normalizedStatementCount || 0)} · visibleStatementCount=${Number(phaseDiagnostics.visibleStatementCount || 0)} · totalStatementCount=${Number(phaseDiagnostics.totalStatementCount || 0)} · retryUsed=${phaseDiagnostics.retryUsed ? "true" : "false"} · duplicateSpeakerIds=${escapeHtml((phaseDiagnostics.duplicateSpeakerIds || []).join(", ") || "-")} · structuredOutputRepairAttempted=${phaseDiagnostics.structuredOutputRepairAttempted ? "true" : "false"} · structuredOutputRepairSucceeded=${phaseDiagnostics.structuredOutputRepairSucceeded ? "true" : "false"} · duplicateSpeakerRecoveryUsed=${phaseDiagnostics.duplicateSpeakerRecoveryUsed ? "true" : "false"} · fallbackReason=${escapeHtml(phase?.fallbackReason || pdcState.providerDiagnostics?.fallbackReason || "-")} · Default statements injected=${phaseDiagnostics.defaultStatementsInjected ? `yes (${escapeHtml((phaseDiagnostics.defaultStatementSpeakerIds || []).join(", "))})` : "no"}${phaseDiagnostics.defaultTemplateMatched ? ` · OpenAI output matched default template (${escapeHtml((phaseDiagnostics.defaultTemplateMatchedSpeakerIds || []).join(", "))})` : ""} · templateContentDetected=${phaseDiagnostics.templateContentDetected ? "true" : "false"}${phaseDiagnostics.templateMatchedPhrases?.length ? ` (${escapeHtml(phaseDiagnostics.templateMatchedPhrases.join(", "))})` : ""} · contentQualityRetryUsed=${phaseDiagnostics.contentQualityRetryUsed ? "true" : "false"}</p>` : ""}
      ${phaseDiagnostics ? `<p>Phase rhythm: bPhaseVotingOnlyMode=${phaseDiagnostics.bPhaseVotingOnlyMode ? "true" : "false"} · bPhaseAverageTextLength=${Number(phaseDiagnostics.bPhaseAverageTextLength || 0)} · bPhaseVoteReasonCoverage=${Number(phaseDiagnostics.bPhaseVoteReasonCoverage || 0)} · bPhaseLongStatementFilteredCount=${Number(phaseDiagnostics.bPhaseLongStatementFilteredCount || 0)} · bPhaseMissingVoteCount=${Number(phaseDiagnostics.bPhaseMissingVoteCount || 0)} · aPhaseVoteLeakDetected=${phaseDiagnostics.aPhaseVoteLeakDetected ? "true" : "false"}</p>` : ""}
      <p>Lifecycle: frozenObserverCount=${Number(lifecycleDiagnostics.frozenObserverCount || 0)} · observerHistoryUpdateBlockedCount=${Number(lifecycleDiagnostics.observerHistoryUpdateBlockedCount || 0)} · observerCurrentStanceUpdateBlockedCount=${Number(lifecycleDiagnostics.observerCurrentStanceUpdateBlockedCount || 0)} · archivedObserverSummaryCharLength=${Number(lifecycleDiagnostics.archivedObserverSummaryCharLength || 0)} · activeMemberSummaryCount=${Number(lifecycleDiagnostics.activeMemberSummaryCount || 0)} · observerFullTrailIncludedInPrompt=${lifecycleDiagnostics.observerFullTrailIncludedInPrompt ? "true" : "false"} · maxNormalRound=${Number(lifecycleDiagnostics.maxNormalRound || 0)} · currentRoundNumber=${Number(lifecycleDiagnostics.currentRoundNumber || 0)} · currentPhaseType=${escapeHtml(lifecycleDiagnostics.currentPhaseType || "-")} · sessionResetApplied=${lifecycleDiagnostics.sessionResetApplied ? "true" : "false"} · pdcSessionId=${escapeHtml(lifecycleDiagnostics.pdcSessionId || "-")} · initialRoundNumber=${Number(lifecycleDiagnostics.initialRoundNumber || 0)} · initialMeetingMemoryItemCount=${Number(lifecycleDiagnostics.initialMeetingMemoryItemCount || 0)} · previousSessionCleared=${lifecycleDiagnostics.previousSessionCleared ? "true" : "false"} · isFinalRound=${lifecycleDiagnostics.isFinalRound ? "true" : "false"} · finalRoundPreviewShown=${lifecycleDiagnostics.finalRoundPreviewShown ? "true" : "false"} · cumulativeContributionVoteCounts=${escapeHtml(JSON.stringify(lifecycleDiagnostics.cumulativeContributionVoteCounts || {}))} · latestBPhaseContributionVoteCounts=${escapeHtml(JSON.stringify(lifecycleDiagnostics.latestBPhaseContributionVoteCounts || {}))} · mostRewardedTieDetected=${lifecycleDiagnostics.mostRewardedTieDetected ? "true" : "false"} · mostRewardedTieResolution=${escapeHtml(lifecycleDiagnostics.mostRewardedTieResolution || "-")} · mostRewardedContributorId=${escapeHtml(lifecycleDiagnostics.mostRewardedContributorId || "-")} · mostRewardedContributorName=${escapeHtml(lifecycleDiagnostics.mostRewardedContributorName || "-")} · mostRewardedContributionVoteCount=${Number(lifecycleDiagnostics.mostRewardedContributionVoteCount || 0)} · autoReenableApplied=${lifecycleDiagnostics.autoReenableApplied ? "true" : "false"} · reEnabledObserverId=${escapeHtml(lifecycleDiagnostics.reEnabledObserverId || "-")} · reEnabledObserverName=${escapeHtml(lifecycleDiagnostics.reEnabledObserverName || "-")} · reEnabledObserverSelectedBy=${escapeHtml(lifecycleDiagnostics.reEnabledObserverSelectedBy || "-")} · reEnabledObserverSelectionReason=${escapeHtml(lifecycleDiagnostics.reEnabledObserverSelectionReason || "-")} · reEnabledObserverSelectionSource=${escapeHtml(lifecycleDiagnostics.reEnabledObserverSelectionSource || "-")} · reEnabledObserverWasActiveMemberBlocked=${lifecycleDiagnostics.reEnabledObserverWasActiveMemberBlocked ? "true" : "false"} · reEnabledObserverCandidateInvalidReason=${escapeHtml(lifecycleDiagnostics.reEnabledObserverCandidateInvalidReason || "-")} · finalReenableSkippedReason=${escapeHtml(lifecycleDiagnostics.finalReenableSkippedReason || "-")} · continueBeyondFinalAllowed=${lifecycleDiagnostics.continueBeyondFinalAllowed ? "true" : "false"}</p>
      ${final ? `<p>Final recap debug: finalRecapProvider=${escapeHtml(final.actualProvider || final.provider || "-")} · finalRecapOpenAiDurationMs=${Number(finalDiagnostics?.finalRecapOpenAiDurationMs || 0)} · finalRecapTotalDurationMs=${Number(finalDiagnostics?.finalRecapTotalDurationMs || 0)} · finalRecapPromptCharLength=${Number(finalDiagnostics?.finalRecapPromptCharLength || 0)} · finalRecapOutputCharLength=${Number(finalDiagnostics?.finalRecapOutputCharLength || 0)} · finalRecapSchemaName=${escapeHtml(finalDiagnostics?.finalRecapSchemaName || final.schemaName || "-")} · finalRecapStrict=${(finalDiagnostics?.finalRecapStrict || final.strict) ? "true" : "false"} · finalRecapActiveRosterPromptCount=${Number(finalDiagnostics?.finalRecapActiveRosterPromptCount || 0)} · finalRecapObserverSummaryPromptCount=${Number(finalDiagnostics?.finalRecapObserverSummaryPromptCount || 0)} · archivedSummaryIncluded=${finalDiagnostics?.archivedSummaryIncluded ? "true" : "false"}</p>` : ""}
      ${advancedAudit ? `<p>Advanced audit debug: advancedAuditEnabled=${auditDiagnostics?.advancedAuditEnabled ? "true" : "false"} · advancedAuditFounderOnly=${auditDiagnostics?.advancedAuditFounderOnly ? "true" : "false"} · advancedAuditProvider=${escapeHtml(auditDiagnostics?.advancedAuditProvider || advancedAudit.actualProvider || advancedAudit.provider || "-")} · advancedAuditRequestedModel=${escapeHtml(auditDiagnostics?.advancedAuditRequestedModel || advancedAudit.requestedModel || advancedAudit.modelName || "-")} · advancedAuditActualModel=${escapeHtml(auditDiagnostics?.advancedAuditActualModel || advancedAudit.actualModel || advancedAudit.modelName || "-")} · advancedAuditFallbackUsed=${(auditDiagnostics?.advancedAuditFallbackUsed || advancedAudit.fallbackUsed) ? "true" : "false"} · advancedAuditFallbackReason=${escapeHtml(auditDiagnostics?.advancedAuditFallbackReason || advancedAudit.fallbackReason || "-")} · advancedAuditJsonParseFailed=${(auditDiagnostics?.advancedAuditJsonParseFailed || advancedAudit.jsonParseFailed) ? "true" : "false"} · advancedAuditSchemaName=${escapeHtml(auditDiagnostics?.advancedAuditSchemaName || advancedAudit.schemaName || "-")} · advancedAuditStrict=${(auditDiagnostics?.advancedAuditStrict || advancedAudit.strict) ? "true" : "false"} · advancedAuditDurationMs=${Number(auditDiagnostics?.advancedAuditDurationMs || 0)} · advancedAuditPromptCharLength=${Number(auditDiagnostics?.advancedAuditPromptCharLength || 0)} · advancedAuditOutputCharLength=${Number(auditDiagnostics?.advancedAuditOutputCharLength || 0)} · advancedAuditContextCompressed=${auditDiagnostics?.advancedAuditContextCompressed ? "true" : "false"} · advancedAuditAdaptivePackageIncluded=${auditDiagnostics?.advancedAuditAdaptivePackageIncluded ? "true" : "false"} · advancedAuditAutoRun=${auditDiagnostics?.advancedAuditAutoRun ? "true" : "false"} · advancedAuditManualTrigger=${auditDiagnostics?.advancedAuditManualTrigger ? "true" : "false"} · advancedAuditAlreadyExists=${auditDiagnostics?.advancedAuditAlreadyExists ? "true" : "false"} · advancedAuditDuplicateCallBlocked=${auditDiagnostics?.advancedAuditDuplicateCallBlocked ? "true" : "false"} · advancedAuditSessionId=${escapeHtml(auditDiagnostics?.advancedAuditSessionId || pdcState.pdcSessionId || "-")} · advancedAuditInFlight=${(auditDiagnostics?.advancedAuditInFlight || pdcState.advancedAuditLoading) ? "true" : "false"} · advancedAuditDecisionContext=${escapeHtml(auditDiagnostics?.advancedAuditDecisionContext || "-")} · advancedAuditDecisionNature=${escapeHtml(auditDiagnostics?.advancedAuditDecisionNature || "-")} · advancedAuditRecommendedOutputShape=${escapeHtml(auditDiagnostics?.advancedAuditRecommendedOutputShape || "-")} · advancedAuditRecapMainWeakness=${escapeHtml(auditDiagnostics?.advancedAuditRecapMainWeakness || "-")} · advancedAuditCostOptimizationApplied=${auditDiagnostics?.advancedAuditCostOptimizationApplied ? "true" : "false"}</p>` : ""}
      </div>
    </details>`;
}

function getPdcLifecycleDiagnostics(phaseDiagnostics = null) {
  const room = pdcState.recap?.councilRoom || {};
  const phases = getPdcPhases(room);
  const currentPhase = phases[clampPdcIndex(pdcState.activeRoundIndex, phases.length)] || null;
  const rewarded = getPdcMostRewardedContributor();
  const frozenSummaries = getPdcFrozenObserverSummaries();
  const reenabled = pdcState.finalReintroducedPerspective || pdcState.finalReenabledObserverMeta || {};
  return {
    frozenObserverCount: Object.keys(pdcState.archivedObservers || {}).length,
    observerHistoryUpdateBlockedCount: phaseDiagnostics?.observerHistoryUpdateBlockedCount || 0,
    observerCurrentStanceUpdateBlockedCount: phaseDiagnostics?.observerCurrentStanceUpdateBlockedCount || 0,
    archivedObserverSummaryCharLength: JSON.stringify(frozenSummaries).length,
    activeMemberSummaryCount: buildPdcMemberStateSummaries().length,
    observerFullTrailIncludedInPrompt: false,
    maxNormalRound: pdcMaxNormalRound,
    currentRoundNumber: Number(currentPhase?.roundNumber || 0),
    currentPhaseType: currentPhase?.phaseType || "",
    sessionResetApplied: pdcState.sessionResetApplied === true,
    pdcSessionId: pdcState.pdcSessionId || "",
    initialRoundNumber: pdcState.initialRoundNumber || 0,
    initialMeetingMemoryItemCount: pdcState.initialMeetingMemoryItemCount || 0,
    previousSessionCleared: pdcState.previousSessionCleared === true,
    isFinalRound: Number(currentPhase?.roundNumber || 0) >= pdcMaxNormalRound,
    finalRoundPreviewShown: pdcState.finalRoundPreviewShown,
    cumulativeContributionVoteCounts: rewarded.cumulativeCounts || {},
    latestBPhaseContributionVoteCounts: rewarded.latestBPhaseCounts || {},
    mostRewardedTieDetected: rewarded.tie === true,
    mostRewardedTieResolution: rewarded.tieResolution || "",
    mostRewardedContributorId: rewarded.speakerId || "",
    mostRewardedContributorName: rewarded.name || "",
    mostRewardedContributionVoteCount: rewarded.count || 0,
    autoReenableApplied: Boolean(reenabled.speakerId),
    reEnabledObserverId: reenabled.speakerId || "",
    reEnabledObserverName: reenabled.speakerName || reenabled.name || "",
    reEnabledObserverSelectedBy: reenabled.selectedByName || "",
    reEnabledObserverSelectionReason: reenabled.reasonForReintroduction || reenabled.selectionReason || "",
    reEnabledObserverSelectionSource: reenabled.selectionSource || pdcState.reEnabledObserverSelectionSource || "",
    reEnabledObserverWasActiveMemberBlocked: pdcState.reEnabledObserverWasActiveMemberBlocked === true,
    reEnabledObserverCandidateInvalidReason: pdcState.reEnabledObserverCandidateInvalidReason || "",
    finalReenableSkippedReason: pdcState.finalReenableSkippedReason || "",
    continueBeyondFinalAllowed: pdcState.founderPreview === true,
  };
}

function renderPdcFeedbackForm() {
  if (pdcState.founderPreview) {
    return `
      <section class="pdc-feedback">
        <h2>Founder preview feedback</h2>
        <p>Founder preview feedback is optional and is not saved to invited-user feedback summary.</p>
      </section>`;
  }
  if (pdcState.feedbackSubmitted) {
    return `<section class="pdc-feedback"><h2>Thank you.</h2><p>Your anonymous feedback has been received.</p></section>`;
  }
  return `
    <form class="pdc-feedback" data-pdc-feedback-form>
      <h2>Anonymous feedback</h2>
      ${renderPdcRadioGroup("Did this help you think more clearly?", "clarity_rating", ["Yes", "Somewhat", "No"])}
      ${renderPdcRadioGroup("Which part was most useful?", "most_useful_part", ["Council Highlights", "Debate Snapshot", "Final Recommendation", "Next Actions", "What Not To Do", "Other"])}
      ${renderPdcRadioGroup("Would you use this again for a real decision?", "would_use_again", ["Yes", "Maybe", "No"])}
      <label class="pdc-question-label">
        <span>Any short feedback? Max 300 characters.</span>
        <textarea name="short_feedback" maxlength="300" rows="4"></textarea>
      </label>
      <button class="button primary" type="submit">Submit feedback</button>
      <p class="pdc-status" aria-live="polite"></p>
    </form>`;
}

function renderPdcRadioGroup(label, name, options) {
  return `
    <fieldset class="pdc-radio-group">
      <legend>${label}</legend>
      ${options.map((option) => `
        <label>
          <input type="radio" name="${name}" value="${escapeHtml(option)}" required />
          <span>${escapeHtml(option)}</span>
        </label>`).join("")}
    </fieldset>`;
}

async function startPdcExperience() {
  if (!pdcState.valid || pdcState.status === "generating" || pdcState.phaseLoading || pdcState.finalRecapLoading || isPdcPlaybackActive()) return;
  const inlinePass = (document.querySelector("[data-pdc-start-pass]")?.value || "").trim().replace(/\s+/g, "");
  const question = document.querySelector("[data-pdc-question]")?.value.trim() || "";
  const nextQuestion = question.slice(0, 1200);
  if (!pdcState.founderPreview && !pdcState.pass && !inlinePass) {
    pdcState.message = "Please enter your PDC access code.";
    renderPdcPilot();
    return;
  }
  if (nextQuestion.length < 8) {
    pdcState.message = "Please enter a decision question before starting.";
    renderPdcPilot();
    return;
  }
  if (inlinePass) pdcState.pass = inlinePass;
  resetPdcSessionState({ question: nextQuestion, status: "generating", message: "" });
  beginPdcWarmup({ phaseLabel: "Round 1A — Position Update", roundNumber: 1, phaseType: "A" });
  try {
    const headers = { "Content-Type": "application/json" };
    if (pdcState.founderPreview) headers["X-MapKAI-Founder"] = "true";
    const response = await fetch("/api/pdc/start", {
      method: "POST",
      headers,
      body: JSON.stringify({
        pass: pdcState.pass,
        mode_id: "personal",
        user_question: pdcState.question,
        founder_preview: pdcState.founderPreview,
        council_tier: pdcState.councilTier || "standard",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) throw new Error(data.message || "The PDC experience could not be generated. Please try again later.");
    const warmupDiagnostics = finishPdcWarmup();
    pdcState.recap = data.recap;
    pdcState.councilTier = data.effectiveTier || data.councilTier || data.recap?.councilTier || pdcState.councilTier || "standard";
    pdcState.requestedTier = data.requestedTier || data.recap?.requestedTier || pdcState.requestedTier || "standard";
    pdcState.effectiveTier = data.effectiveTier || data.recap?.effectiveTier || pdcState.councilTier || "standard";
    pdcState.phaseModel = data.phaseModel || data.recap?.phaseModel || "";
    pdcState.finalModel = data.finalModel || data.recap?.finalModel || "";
    pdcState.founderOnlyFullFunction = data.founderOnlyFullFunction === true || data.recap?.founderOnlyFullFunction === true;
    pdcState.status = "complete";
    pdcState.selectedPersonaId = "";
    pdcState.activeRoundIndex = 0;
    pdcState.pdcPhases = [];
    pdcState.activeRosterIds = [];
    pdcState.observerRosterIds = [];
    pdcState.memberHistory = {};
    pdcState.finalReintroducedPerspective = null;
    pdcState.finalRecapLoading = false;
    pdcState.providerDiagnostics = data.recap ? {
      requestedProvider: data.recap.requestedProvider,
      actualProvider: data.recap.actualProvider || data.recap.dialogueProvider,
      fallbackUsed: data.recap.fallbackUsed,
      fallbackReason: data.recap.fallbackReason,
      providerErrorShort: data.recap.providerErrorShort,
      jsonParseFailed: data.recap.jsonParseFailed,
      modelName: data.recap.modelName,
      councilTier: pdcState.councilTier,
      requestedTier: pdcState.requestedTier,
      effectiveTier: pdcState.effectiveTier,
      phaseModel: pdcState.phaseModel,
      finalModel: pdcState.finalModel,
      founderOnlyFullFunction: pdcState.founderOnlyFullFunction,
      schemaName: data.recap.schemaName || data.recap.contentDiagnostics?.schemaName || "",
      strict: data.recap.strict === true || data.recap.contentDiagnostics?.strict === true,
      contentDiagnostics: {
        ...(data.recap.contentDiagnostics || {}),
        ...(warmupDiagnostics || {}),
        sessionResetApplied: pdcState.sessionResetApplied === true,
        pdcSessionId: pdcState.pdcSessionId,
        initialRoundNumber: pdcState.initialRoundNumber,
        initialMeetingMemoryItemCount: pdcState.initialMeetingMemoryItemCount,
        previousSessionCleared: pdcState.previousSessionCleared === true,
      },
    } : null;
    pdcState.userInterventions = [];
    pdcState.discussionStopped = false;
    beginPdcPhasePlayback(0);
  } catch (error) {
    clearPdcPlaybackTimer();
    cancelPdcWarmup();
    pdcState.playback = null;
    pdcState.status = "ready";
    pdcState.message = error.message || "The PDC experience could not be generated. Please try again later.";
    renderPdcPilot();
  }
}

function handlePdcFeedbackSubmit(event) {
  const form = event.target.closest("[data-pdc-feedback-form]");
  if (!form) return false;
  event.preventDefault();
  const status = form.querySelector(".pdc-status");
  const payload = {
    pass: pdcState.pass,
    pdc_type: pdcState.selectedMode,
    clarity_rating: form.elements.clarity_rating.value,
    most_useful_part: form.elements.most_useful_part.value,
    would_use_again: form.elements.would_use_again.value,
    short_feedback: form.elements.short_feedback.value.trim().slice(0, 300),
  };
  (async () => {
    try {
      const response = await fetch("/api/pdc/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.ok !== true) throw new Error(data.error || "Feedback could not be submitted.");
      pdcState.feedbackSubmitted = true;
      renderPdcPilot();
    } catch (error) {
      status.textContent = error.message || "Feedback could not be submitted.";
    }
  })();
  return true;
}

async function loadPdcFounderSummary() {
  if (!document.body.classList.contains("founder-mode")) return;
  pdcFounderStatus = { state: "loading", detail: "" };
  renderPdcFounderPanel();
  try {
    const response = await fetch("/api/pdc/founder-summary", {
      headers: { "X-MapKAI-Founder": "true" },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) throw new Error(data.error || `HTTP ${response.status}`);
    pdcFounderSummary = data;
    pdcFounderStatus = { state: "connected", detail: "" };
    renderPdcFounderPanel();
  } catch (error) {
    pdcFounderStatus = { state: "failed", detail: error.message || "Could not load PDC summary." };
    renderPdcFounderPanel();
  }
}

function renderPdcFounderPanel() {
  const panels = Array.from(document.querySelectorAll("[data-pdc-founder-panel]"));
  panels.forEach((panel) => {
    const summary = pdcFounderSummary;
    const passes = summary?.passes || [];
    const unusedLinks = passes.filter((pass) => pass.status === "unused").map((pass) => makePdcLink(pass.pass_code));
    const allLinks = passes.map((pass) => makePdcLink(pass.pass_code));
    panel.innerHTML = `
      <h3>PDC Access Panel</h3>
      <div class="pdc-founder-actions">
        <button class="button primary" type="button" data-pdc-generate>Generate 20 PDC Access Links</button>
        <a class="button secondary" href="/pdc-pilot">Open PDC Entry</a>
        <button class="button secondary" type="button" data-pdc-copy-unused ${unusedLinks.length ? "" : "disabled"}>Copy all unused links</button>
        <button class="button secondary" type="button" data-pdc-copy-all ${allLinks.length ? "" : "disabled"}>Copy all links</button>
      </div>
      <p class="founder-contact-debug">Batch: ${escapeHtml(summary?.batch_id || "current week")} · Status: ${escapeHtml(pdcFounderStatus.state)}</p>
      ${pdcFounderStatus.detail ? `<p>${escapeHtml(pdcFounderStatus.detail)}</p>` : ""}
      ${summary ? renderPdcUsageSummary(summary.usage) : "<p>No PDC summary loaded yet.</p>"}
      ${passes.length ? renderPdcPassTable(passes) : ""}
      ${summary ? renderPdcFeedbackSummary(summary.feedback) : ""}
    `;
  });
}

function renderPdcUsageSummary(usage = {}) {
  return `
    <div class="pdc-usage-grid">
      ${["total", "unused", "in_progress", "used", "expired"].map((key) => `
        <div><span>${key.replace("_", " ")}</span><strong>${Number(usage[key]) || 0}</strong></div>`).join("")}
    </div>`;
}

function renderPdcPassTable(passes) {
  return `
    <div class="pdc-pass-table-wrap">
      <table class="pdc-pass-table">
        <thead><tr><th>pass_code</th><th>status</th><th>created_at</th><th>used_at</th><th>pdc_type</th></tr></thead>
        <tbody>
          ${passes.map((pass) => `
            <tr>
              <td>${escapeHtml(pass.pass_code)}</td>
              <td>${escapeHtml(pass.status)}</td>
              <td>${escapeHtml(pass.created_at || "-")}</td>
              <td>${escapeHtml(pass.used_at || "-")}</td>
              <td>${escapeHtml(pass.pdc_type || pass.mode_id || "-")}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function renderPdcFeedbackSummary(feedback = {}) {
  return `
    <div class="pdc-feedback-summary">
      <h4>Anonymous feedback summary</h4>
      ${renderDistribution("clarity rating", feedback.clarity_rating)}
      ${renderDistribution("most useful part", feedback.most_useful_part)}
      ${renderDistribution("would use again", feedback.would_use_again)}
      <div class="pdc-recent-feedback">
        <strong>Recent short feedback</strong>
        ${(feedback.recent_short_feedback || []).length ? `<ul>${feedback.recent_short_feedback.map((entry) => `<li>${escapeHtml(entry.short_feedback)}</li>`).join("")}</ul>` : "<p>No short feedback yet.</p>"}
      </div>
    </div>`;
}

function renderDistribution(label, rows = []) {
  return `
    <div class="pdc-distribution">
      <strong>${label}</strong>
      ${rows.length ? rows.map((row) => `<span>${escapeHtml(row.value)}: ${Number(row.count) || 0}</span>`).join("") : "<span>No data yet.</span>"}
    </div>`;
}

async function generatePdcPasses() {
  pdcFounderStatus = { state: "generating", detail: "" };
  renderPdcFounderPanel();
  try {
    const response = await fetch("/api/pdc/generate-passes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-MapKAI-Founder": "true" },
      body: JSON.stringify({ count: 20 }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) throw new Error(data.error || `HTTP ${response.status}`);
    pdcFounderStatus = { state: "connected", detail: `Generated ${data.passes?.length || 0} links.` };
    await loadPdcFounderSummary();
  } catch (error) {
    pdcFounderStatus = { state: "failed", detail: error.message || "Could not generate PDC links." };
    renderPdcFounderPanel();
  }
}

function makePdcLink(passCode) {
  return `https://www.mapkai.com/pdc-pilot?pass=${passCode}`;
}

async function copyPdcLinks(kind) {
  const passes = pdcFounderSummary?.passes || [];
  const links = passes
    .filter((pass) => kind === "all" || pass.status === "unused")
    .map((pass) => makePdcLink(pass.pass_code));
  if (!links.length) return;
  await navigator.clipboard.writeText(links.join("\n"));
  pdcFounderStatus = { state: "connected", detail: `Copied ${links.length} ${kind === "all" ? "total" : "unused"} links.` };
  renderPdcFounderPanel();
}

function renderFounderMessages(entries, status = founderMessageStatus) {
  const boards = Array.from(document.querySelectorAll("[data-message-board]"));
  boards.forEach((board) => {
    const isFailed = status.state === "failed";
    const statusLabel = status.state === "connected" ? t("contactApiConnected") : status.state === "failed" ? t("contactApiFailed") : status.state;
    board.innerHTML = `
      <h3>${t("founderMessageBoard")}</h3>
      <div class="founder-contact-debug">
        <p>${t("contactApiStatus", statusLabel)}</p>
        <p>${t("loadedMessages", status.loaded || entries.length || 0)}</p>
        ${status.detail ? `<p>${escapeHtml(status.detail)}</p>` : ""}
      </div>
      ${isFailed ? `<p>${t("couldNotLoadMessages")}</p>` : entries.length ? `
        <ul>
          ${entries.map((entry) => `
            <li>
              <time>${formatBoardTime(entry.created_at || entry.createdAt)}</time>
              <p>${escapeHtml(entry.message)}</p>
              <dl>
                <dt>Name</dt><dd>${escapeHtml(entry.name || "-")}</dd>
                <dt>Email</dt><dd>${escapeHtml(entry.email || "-")}</dd>
                <dt>Page</dt><dd>${escapeHtml(entry.page_path || "-")}</dd>
                <dt>Language</dt><dd>${escapeHtml(entry.language || "-")}</dd>
              </dl>
            </li>`).join("")}
        </ul>` : `<p>${t("noMessages")}</p>`}`;
  });
}

function formatBoardTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Saved message";
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(selector, value) {
  const target = document.querySelector(selector);
  if (target) target.textContent = value;
}

function setAllText(selector, values) {
  document.querySelectorAll(selector).forEach((target, index) => {
    if (values[index] !== undefined) target.textContent = values[index];
  });
}

function updateLanguageButtons() {
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage));
  });
  document.documentElement.lang = currentLanguage === "zh" ? "zh-CN" : "en";
}

function setLanguage(language) {
  if (!supportedLanguages.includes(language)) return;
  currentLanguage = language;
  localStorage.setItem(languageKey, language);
  applyLanguage();
}

function applyLanguage() {
  updateLanguageButtons();
  document.querySelectorAll("[data-i18n]").forEach((target) => {
    const key = target.dataset.i18n;
    if (key) target.textContent = t(key);
  });
  setText('.nav-links a[data-route="/explore"]', t("navExplore"));
  setText('.nav-links a[data-route="/map"]', t("navMap"));
  setText('.nav-links a[data-route="/pdc"]', t("navPdc"));
  setText('.nav-links a[data-route="/categories"]', t("navCategories"));
  setText('.nav-links a[data-route="/learning"]', t("navLearning"));
  setText('.nav-links a[data-route="/about"]', t("navAbout"));

  setText(".home-page .hero .eyebrow", t("homeEyebrow"));
  setText(".home-page .hero h1", t("homeTitle"));
  setText(".home-page .hero-copy", t("homeCopy"));
  setAllText(".home-page .hero-actions .button", [t("homePrimary")]);
  setText(".home-page .hero-microcopy", t("homeQuickMirrorHint"));
  setText("#reflection-snippets-title", t("reflectionSnippetsTitle"));
  setAllText(".reflection-snippets .snippet-list p", t("reflectionSnippets"));

  setText(".module-strip .section-heading .eyebrow", t("coreEyebrow"));
  setText("#core-modules-title", t("coreTitle"));
  setAllText(".module-strip .module-card h3", [t("exploreCardTitle"), t("mapCardTitle"), t("categoriesCardTitle"), t("learningCardTitle")]);
  setAllText(".module-strip .module-card p", [t("exploreCardCopy"), t("mapCardCopy"), t("categoriesCardCopy"), t("learningCardCopy")]);
  setAllText(".module-strip .module-card a", [t("exploreCardLink"), t("mapCardLink"), t("categoriesCardLink"), t("learningCardLink")]);

  setText("#how-title", t("howTitle"));
  setText('[aria-labelledby="how-title"] .eyebrow', t("howEyebrow"));
  setAllText('[aria-labelledby="how-title"] .module-card h3', [t("howOneTitle"), t("howTwoTitle"), t("howThreeTitle")]);
  setAllText('[aria-labelledby="how-title"] .module-card p', [t("howOneCopy"), t("howTwoCopy"), t("howThreeCopy")]);

  setText("#audience-title", t("audienceTitle"));
  setText('[aria-labelledby="audience-title"] .eyebrow', t("audienceEyebrow"));
  setAllText('[aria-labelledby="audience-title"] .module-card h3', [t("studentTitle"), t("switcherTitle"), t("explorerTitle"), t("lifelongTitle")]);
  setAllText('[aria-labelledby="audience-title"] .module-card p', [t("studentCopy"), t("switcherCopy"), t("explorerCopy"), t("lifelongCopy")]);

  setText(".home-page > .preview-band .eyebrow", t("categoryBandEyebrow"));
  setText(".home-page > .preview-band h2", t("categoryBandTitle"));
  setText(".home-page > .preview-band p:not(.eyebrow)", t("categoryBandCopy"));
  setText(".home-page > .preview-band .button", t("startExploring"));

  setText("#why-title", t("whyTitle"));
  setText('[aria-labelledby="why-title"] .eyebrow', t("whyEyebrow"));
  setAllText(".why-copy > p", [t("whyP1"), t("whyP2"), t("whyP3"), t("whyP4")]);
  setAllText(".idea-grid span", [t("whyMap"), t("whyK"), t("whyAI")]);

  setText(".about-page .about-opening .eyebrow", t("aboutEyebrow"));
  setText(".about-page .about-opening h1", t("aboutOpening"));
  setText(".about-page .about-mission-vision h2", t("aboutMissionTitle"));
  setText(".about-page .about-mission-vision .mission-belief", t("aboutMissionBelief"));
  setAllText(".about-page .about-mission-vision .mission-card h3", [
    t("aboutMissionLabel"),
    t("aboutVisionLabel"),
  ]);
  setAllText(".about-page .about-mission-vision .mission-card p", [
    t("aboutMissionText"),
    t("aboutVisionText"),
  ]);
  setText(".about-page .about-mission-vision .mission-trust", t("aboutMissionTrust"));
  setAllText(".about-page .about-block:not(.about-mission-vision) h2", [
    t("aboutWhatTitle"),
    t("aboutAiTitle"),
    t("aboutExploreTitle"),
    t("aboutQuestionDesignTitle"),
    t("aboutReflectionTitle"),
    t("aboutBoundaryTitle"),
  ]);
  setAllText(".about-page .about-block:not(.about-mission-vision) p", [
    t("aboutWhatP1"),
    t("aboutWhatP2"),
    t("aboutAiP1"),
    t("aboutAiP2"),
    t("aboutExploreP1"),
    t("aboutQuestionDesignP1"),
    t("aboutQuestionDesignP2"),
    t("aboutReflectionP1"),
    t("aboutReflectionP2"),
    t("aboutBoundaryP1"),
    t("aboutBoundaryP2"),
  ]);
  setText(".about-page .about-closing p", t("aboutClosing"));
  setText(".about-page .about-closing .button", t("startExploring"));
  const pdcAccessInput = document.querySelector(".pdc-access-form input");
  if (pdcAccessInput) pdcAccessInput.placeholder = t("pdcAccessPlaceholder");

  setText(".map-page .intro-copy .eyebrow", t("mapEyebrow"));
  setText(".map-page .intro-copy h1", t("mapTitle"));
  setText(".map-page .intro-copy p:not(.eyebrow)", t("mapCopy"));
  setAllText(".map-page .intro-copy .button", [t("goCategories"), t("goLearning")]);
  const legendItems = [
    ["ocean", getMasteryLabel("ocean")],
    ["snow", getMasteryLabel("snow")],
    ["pilot", getMasteryLabel("land")],
    ["ready", getMasteryLabel("green")],
  ];
  document.querySelectorAll(".map-legend span").forEach((target, index) => {
    const [className, label] = legendItems[index];
    target.innerHTML = `<i class="${className}"></i> ${label}`;
  });
  setText("#challenge-title", t("challengeTitle"));
  setText(".map-challenge .section-heading .eyebrow", t("challengeEyebrow"));
  setText(".map-challenge .section-heading p:not(.eyebrow)", t("challengeCopy"));

  setText(".categories-page .section-heading .eyebrow", t("categoriesEyebrow"));
  setText(".categories-page .section-heading h1", t("categoriesTitle"));
  setText(".categories-page .section-heading p:not(.eyebrow)", t("categoriesCopy"));

  setText(".learning-page .section-heading .eyebrow", t("learningEyebrow"));
  setText(".learning-page .section-heading h1", t("learningTitle"));
  setText(".learning-page .section-heading p:not(.eyebrow)", t("learningCopy"));
  setText(".learning-page .preview-band .eyebrow", t("learningBandEyebrow"));
  setText(".learning-page .preview-band h2", t("learningBandTitle"));
  setText(".learning-page .preview-band p:not(.eyebrow)", t("learningBandCopy"));
  setText(".learning-page .preview-band .button", t("startExploring"));

  document.querySelectorAll('.route-cta .button.primary[href="/explore"]').forEach((target) => {
    target.textContent = t("startExploring");
  });
  document.querySelectorAll('.route-cta .button.secondary[href="/map"]').forEach((target) => {
    target.textContent = t("viewKnowledgeMap");
  });
  const categoryDetailExplore = document.querySelector('.category-page .route-cta .button.primary[href="/explore"]');
  if (categoryDetailExplore) categoryDetailExplore.textContent = t("exploreThisDomain");

  document.querySelectorAll(".contact-section").forEach((section) => {
    section.querySelector(".eyebrow").textContent = t("contactEyebrow");
    section.querySelector("h2").textContent = t("contactTitle");
    section.querySelector("div > p:not(.eyebrow)").textContent = t("contactCopy");
    const labels = section.querySelectorAll("label span");
    if (labels[0]) labels[0].textContent = t("messageBoard");
    section.querySelector("textarea").placeholder = t("messagePlaceholder");
    section.querySelector("button").textContent = t("leaveMessage");
  });
  document.querySelectorAll("[data-footer-rights]").forEach((target) => {
    target.textContent = t("footerRights");
  });
  document.querySelectorAll("[data-footer-notice]").forEach((target) => {
    target.textContent = t("footerNotice");
  });

  renderCategories();
  if (document.getElementById("categoryDetail")?.classList.contains("is-active")) {
    const match = normalizeRoute(window.location.pathname).match(/^\/categories\/(\d{2})$/);
    if (match) renderCategoryDetail(match[1]);
  }
  renderLearning();
  renderMessageBoards();
  if (document.body.classList.contains("founder-mode")) loadFounderMessages();
  renderPdcPilot();
  renderVisitStats();
  renderQuickMirror();
  renderChallenge();
  renderReflectionPanel();
  renderKnowledgeTitleModal();
}

function normalizeRoute(path) {
  if (window.location.protocol === "file:") {
    return window.location.hash.replace("#", "") || "/";
  }
  return path || "/";
}

function goToRoute(route, replace = false) {
  let target = route || "/";
  if (target === "/leoyangandxinli") {
    target = "/";
    replace = true;
    if (window.location.protocol !== "file:") {
      history.replaceState({ route: "/" }, "", "/");
    }
  }
  const visibleTarget = target;
  document.body.classList.toggle("pdc-public-route", visibleTarget === "/pdc" || visibleTarget === "/pdc-pilot");
  setFounderMode(isFounderMode());
  const categoryMatch = visibleTarget.match(/^\/categories\/(\d{2})$/);
  if (categoryMatch) renderCategoryDetail(categoryMatch[1]);
  const activePage = categoryMatch ? "/categories/detail" : visibleTarget;

  pages.forEach((page) => {
    const active = page.dataset.page === activePage;
    page.classList.toggle("is-active", active);
    page.setAttribute("aria-hidden", String(!active));
  });
  routeLinks.forEach((link) => {
    const linkRoute = link.dataset.route;
    const isCurrent =
      linkRoute === visibleTarget ||
      (linkRoute === "/explore" && visibleTarget === "/explore") ||
      (linkRoute === "/pdc" && (visibleTarget === "/pdc" || visibleTarget === "/pdc-pilot")) ||
      (linkRoute === "/categories" && visibleTarget.startsWith("/categories")) ||
      (linkRoute === "/learning" && visibleTarget.startsWith("/learning")) ||
      (linkRoute === "/about" && visibleTarget === "/about") ||
      (linkRoute === "/privacy" && visibleTarget === "/privacy") ||
      (linkRoute === "/responsible-use" && visibleTarget === "/responsible-use") ||
      (linkRoute === "/cookies" && visibleTarget === "/cookies") ||
      (linkRoute === "/terms" && visibleTarget === "/terms");
    link.classList.toggle("is-current", isCurrent);
  });

  if (visibleTarget === "/pdc-pilot") initPdcPilotPage();
  if (replace) return;
  if (window.location.protocol === "file:") {
    window.location.hash = target;
  } else {
    history.pushState({ route: target }, "", target);
  }
}

function makeStatus(status, ready) {
  return `<div class="status-line founder-only"><span>${status}</span><strong>${ready}</strong></div>`;
}

function getCategory(code) {
  return categories.find((category) => category.code === code);
}

function getCategoryTitle(category) {
  return currentLanguage === "zh" ? category.chineseTitle || category.title : category.title;
}

function getSubjectTitle(code) {
  return questionBank[code]?.subject || getCategory(code)?.title || "Knowledge subject";
}

function getQuestionContent(question) {
  return question?.[currentLanguage] || question?.en || {};
}

function getLensSubjectCode(profileOrSubject) {
  const rawSubject = typeof profileOrSubject === "string" ? profileOrSubject : profileOrSubject?.subject;
  const match = String(rawSubject || "00").match(/^\d{2}/);
  return match ? match[0] : "00";
}

function getKnowledgeLensName(code) {
  const labels = knowledgeLensLabels[code] || knowledgeLensLabels["00"];
  return currentLanguage === "zh" ? labels.zh : labels.en;
}

function getMasteryLabel(level) {
  return masteryLabels[currentLanguage]?.[level] || masteryLabels.en[level] || level;
}

const categoryThinking = {
  en: {
    "00": "foundation / orientation / learning structure",
    "01": "teaching / feedback / human development",
    "02": "ambiguity / interpretation / meaning",
    "03": "society / behavior / context",
    "04": "incentives / tradeoffs / scaling",
    "05": "evidence / models / uncertainty",
    "06": "systems / tools / abstraction",
    "07": "constraints / optimization / implementation",
    "08": "ecology / patience / field conditions",
    "09": "risk / care / human limits",
    "10": "experience / coordination / service reality",
  },
  zh: {
    "00": "基础 / 定向 / 学习结构",
    "01": "教学 / 反馈 / 人的发展",
    "02": "模糊性 / 解释 / 意义",
    "03": "社会 / 行为 / 语境",
    "04": "激励 / 取舍 / 扩张",
    "05": "证据 / 模型 / 不确定性",
    "06": "系统 / 工具 / 抽象",
    "07": "约束 / 优化 / 执行",
    "08": "生态 / 耐心 / 现场条件",
    "09": "风险 / 照护 / 人的边界",
    "10": "体验 / 协调 / 服务现实",
  },
};

function getCategoryThinking(code) {
  const labels = currentLanguage === "zh" ? categoryThinking.zh : categoryThinking.en;
  return labels[code] || labels["00"];
}

function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  const detailCards = categories
    .map((category) => {
      const href = `/categories/${category.code}`;
      const fieldCount = category.groups.reduce((total, group) => total + group.fields.length, 0);
      const scopePreview = category.groups
        .flatMap((group) => group.fields)
        .slice(0, 5)
        .map(([code, title]) => `<li><span class="internal-code">${code}</span>${title}</li>`)
        .join("");
      return `
        <a class="category-card" href="${href}" data-route="${href}" aria-label="${t("openCategory")} ${getCategoryTitle(category)}">
          <span class="internal-code category-code">${category.code}</span>
          <h3>${getCategoryTitle(category)}</h3>
          ${makeStatus(category.status, category.readiness)}
          <p class="thinking-lens">${getCategoryThinking(category.code)}</p>
          <div class="scope-count">${category.groups.length} ${t("groups")} · ${fieldCount} ${t("detailedFields")}</div>
          <ul class="scope-preview">${scopePreview}</ul>
          <span class="card-link">${t("openCategory")}</span>
        </a>`;
    })
    .join("");
  if (grid) grid.innerHTML = detailCards;
}

function getMasteryFromCorrect(subjectCode) {
  const subject = questionBank[subjectCode];
  const state = challengeState[subjectCode];
  const correct = state?.correct || 0;
  const rule = subject?.unlockRule || { snow: 2, land: 4, green: 6 };
  if (correct >= rule.green) return "green";
  if (correct >= rule.land) return "land";
  if (correct >= rule.snow) return "snow";
  return "ocean";
}

function getCurrentQuestion(subjectCode) {
  const subject = questionBank[subjectCode];
  const state = challengeState[subjectCode];
  if (!subject || !state) return null;
  return subject.questions.find((question) => !state.answered.includes(question.id)) || null;
}

function isSubjectComplete(subjectCode) {
  return Boolean(questionBank[subjectCode]) && !getCurrentQuestion(subjectCode);
}

function getAllChallengeQuestions() {
  return mapkaiKnowledgeLensQuestionsV1.map((question) => ({ subjectCode: question.subject || "00", question }));
}

function getTotalQuestionCount() {
  return getAllChallengeQuestions().length;
}

function shuffleQuestions(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function refillChallengeQuestionPool() {
  challengeQuestionPool = shuffleQuestions(getAllChallengeQuestions());
  challengePoolIndex = 0;
}

function setRandomChallengeQuestion() {
  if (challengeRoundComplete) {
    activeChallengeQuestion = null;
    return null;
  }
  if (!challengeQuestionPool.length) {
    refillChallengeQuestionPool();
  }
  if (challengePoolIndex >= challengeQuestionPool.length) {
    completeChallengeRound();
    return null;
  }
  const nextItem = challengeQuestionPool[challengePoolIndex];
  if (!nextItem) {
    activeChallengeQuestion = null;
    return null;
  }
  challengePoolIndex += 1;
  activeChallengeSubject = nextItem.subjectCode;
  activeChallengeQuestion = nextItem.question;
  return nextItem;
}

function moveToNextChallengeQuestion() {
  currentAnsweredQuestion = null;
  challengeReviewIndex = null;
  setRandomChallengeQuestion();
}

function getTotalCorrectAnswers() {
  return Object.values(challengeState).reduce((total, state) => total + state.correct, 0);
}

function getTotalAnsweredQuestions() {
  return challengeHistory.length;
}

function getKnowledgeAccuracy() {
  const answered = getTotalAnsweredQuestions();
  if (!answered) return 0;
  return Math.round((getTotalCorrectAnswers() / answered) * 100);
}

function getKnowledgeTitleForAccuracy(accuracy) {
  const rules = knowledgeTitleRules[currentLanguage] || knowledgeTitleRules.en;
  return rules.find((rule) => accuracy >= rule.min)?.title || rules[rules.length - 1].title;
}

function getExplorerTitleForAnswered(answered) {
  const rules = explorerTitleRules[currentLanguage] || explorerTitleRules.en;
  return rules.find((rule) => answered >= rule.min)?.title || "";
}

function getKnowledgeTitleStats() {
  const answered = getTotalAnsweredQuestions();
  const accuracy = getKnowledgeAccuracy();
  return {
    answered,
    accuracy,
    accuracyTitle: getKnowledgeTitleForAccuracy(accuracy),
    explorerTitle: getExplorerTitleForAnswered(answered),
  };
}

function shouldShowKnowledgeTitleModal(answered) {
  return milestoneModalThresholds.includes(answered) && lastTitleModalAt !== answered;
}

function maybeShowKnowledgeTitleModal() {
  return;
}

function renderKnowledgeTitleStatus() {
  const answered = getTotalAnsweredQuestions();
  const total = getTotalQuestionCount();
  return `<div class="knowledge-title-status ${answered >= total ? "is-unlocked" : ""}">${t("questionProgress", answered, total)}</div>`;
}

function getReflectionUnlockTarget() {
  return 15;
}

function isReflectionUnlocked() {
  return getTotalAnsweredQuestions() >= getReflectionUnlockTarget();
}

const reflectionTagLabels = {
  "00": ["learning direction", "knowledge mapping", "pattern recognition"],
  "01": ["learning design", "feedback loops", "human development"],
  "02": ["arts interpretation", "cultural signals", "meaning making"],
  "03": ["human ambiguity", "social systems", "context reading"],
  "04": ["service tradeoffs", "business systems", "resource judgment"],
  "05": ["social infrastructure", "coordination patterns", "public systems"],
  "06": ["science reasoning", "evidence patterns", "natural systems"],
  "07": ["systems thinking", "technical tradeoffs", "tool impact"],
  "08": ["practical constraints", "environmental signals", "field observation"],
  "09": ["human wellbeing", "risk awareness", "care systems"],
  "10": ["implementation logic", "applied judgment", "real-world constraints"],
};
const reflectionTagLabelsZh = {
  "00": ["学习方向", "知识地图", "模式识别"],
  "01": ["学习设计", "反馈循环", "人的发展"],
  "02": ["艺术理解", "文化信号", "意义建构"],
  "03": ["人类模糊性", "社会系统", "语境判断"],
  "04": ["服务取舍", "商业系统", "资源判断"],
  "05": ["社会基础设施", "协作模式", "公共系统"],
  "06": ["科学推理", "证据模式", "自然系统"],
  "07": ["系统思维", "技术取舍", "工具影响"],
  "08": ["现实约束", "环境信号", "现场观察"],
  "09": ["人的健康", "风险意识", "照护系统"],
  "10": ["执行逻辑", "应用判断", "真实世界约束"],
};

function getReflectionTags(subjectCode) {
  const labels = currentLanguage === "zh" ? reflectionTagLabelsZh : reflectionTagLabels;
  return labels[subjectCode] || (currentLanguage === "zh" ? ["知识模式"] : ["knowledge pattern"]);
}

function addTagCounts(target, tags, amount = 1) {
  tags.forEach((tag) => {
    target[tag] = (target[tag] || 0) + amount;
  });
}

function getTopTags(tagCounts, fallback, limit = 3) {
  const tags = Object.entries(tagCounts || {})
    .sort((left, right) => right[1] - left[1])
    .map(([tag]) => tag)
    .filter(Boolean)
    .slice(0, limit);
  return tags.length ? tags : fallback;
}

function getAnswerDistributions() {
  const emptySummary = {
    difficulty: {},
    mapState: {},
    domains: {},
    correct: 0,
    missed: 0,
  };
  return challengeHistory.reduce((summary, entry) => {
    const difficulty = entry.question?.difficulty || "unknown";
    const mapState = entry.question?.unlocksToward || "unknown";
    const domainTitle = getCategoryTitle(getCategory(entry.subjectCode) || {}) || "Knowledge domain";
    summary.difficulty[difficulty] = (summary.difficulty[difficulty] || 0) + 1;
    summary.mapState[mapState] = (summary.mapState[mapState] || 0) + 1;
    summary.domains[domainTitle] = (summary.domains[domainTitle] || 0) + 1;
    if (entry.correct) summary.correct += 1;
    else summary.missed += 1;
    return summary;
  }, emptySummary);
}

function getReflectionPayload() {
  const summary = getCompressedReflectionSummary();
  return {
    ...summary,
    answered: summary.totalAnswered,
    distributions: getAnswerDistributions(),
  };
}

function getCompressedReflectionSummary() {
  const stats = getKnowledgeTitleStats();
  const strongTagCounts = {};
  const weakTagCounts = {};
  const domainCounts = {};
  challengeHistory.forEach((entry) => {
    const tags = getReflectionTags(entry.subjectCode);
    addTagCounts(entry.correct ? strongTagCounts : weakTagCounts, tags);
    domainCounts[entry.subjectCode] = (domainCounts[entry.subjectCode] || 0) + 1;
  });
  const answered = stats.answered;
  const domainCoverage = Object.keys(domainCounts).length;
  const accuracyRatio = answered ? Number((stats.accuracy / 100).toFixed(2)) : 0;
  const strongFallback = currentLanguage === "zh" ? ["模式识别", "结构化探索"] : ["pattern recognition", "structured exploration"];
  const weakFallback = currentLanguage === "zh" ? ["复杂取舍", "模糊情境"] : ["complex tradeoffs", "ambiguous contexts"];
  return {
    language: currentLanguage,
    totalAnswered: answered,
    accuracy: accuracyRatio,
    strongTags: getTopTags(strongTagCounts, strongFallback),
    weakTags: getTopTags(weakTagCounts, weakFallback),
    thinkingStyle: getThinkingStyleLabel(accuracyRatio, domainCoverage),
    explorationTendency: getExplorationTendencyLabel(domainCoverage, answered),
  };
}

function getThinkingStyleLabel(accuracy, domainCoverage) {
  if (currentLanguage === "zh") {
    if (accuracy >= 0.75 && domainCoverage >= 6) return "结构优先的跨领域探索";
    if (accuracy >= 0.75) return "稳定的模式识别";
    if (domainCoverage >= 6) return "广角扫描式探索";
    return "从直觉走向结构的探索";
  }
  if (accuracy >= 0.75 && domainCoverage >= 6) return "structure-first cross-domain exploration";
  if (accuracy >= 0.75) return "steady pattern recognition";
  if (domainCoverage >= 6) return "wide-angle exploratory scanning";
  return "intuition-to-structure exploration";
}

function getExplorationTendencyLabel(domainCoverage, answered) {
  if (currentLanguage === "zh") {
    if (domainCoverage >= 8) return "广域探索者";
    if (answered >= 30) return "持续推进型探索者";
    return "起步中的知识探索者";
  }
  if (domainCoverage >= 8) return "broad explorer";
  if (answered >= 30) return "persistent explorer";
  return "early-stage knowledge explorer";
}

function getTopDistributionKey(distribution, fallback) {
  const entries = Object.entries(distribution || {});
  if (!entries.length) return fallback;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function buildFallbackReflection(payload = getReflectionPayload()) {
  const summary = payload.totalAnswered ? payload : getCompressedReflectionSummary();
  const topDomain = summary.strongTags?.[0] || getTopDistributionKey(payload.distributions?.domains, currentLanguage === "zh" ? "多个知识领域" : "several knowledge domains");
  const weakTag = summary.weakTags?.[0] || getTopDistributionKey(payload.distributions?.mapState, currentLanguage === "zh" ? "复杂取舍" : "complex tradeoffs");
  const accuracy = summary.accuracy > 1 ? summary.accuracy / 100 : summary.accuracy || 0;
  if (currentLanguage === "zh") {
    const statusSummary = accuracy >= 0.7
      ? `你很少在混乱里停留太久。你会把问题推向结构、模式和取舍，让它变得可读。${weakTag} 可能是需要慢一点的地方：先进入现实，再整理现实。下一步不是追求更完整的解释，而是让自己靠近不够整齐的问题。`
      : `你正在把零散问题慢慢变成可观察的模式。你愿意跨场景，但判断有时还停在第一反应，尤其靠近 ${weakTag} 时更明显。继续探索 ${topDomain}。也保留一些不确定的题目，让地图显示你还没真正进入的地方。`;
    const nextDirection = `继续探索 ${topDomain}。同时进入一些 ${weakTag} 相关问题，不急着把它们整理干净。`;
    return {
      summary: statusSummary,
      primaryPattern: `你会从 ${topDomain} 里寻找秩序。混乱出现时，你很快开始重组它。`,
      blindSpot: `${weakTag} 可能暴露一个盲点：你还没完全进入，就已经开始解释。`,
      nextDirection,
      uncomfortableTruth: "最有用的进步，可能不是更好的框架。是更早进入不够理想的现实。",
      source: "local-fallback",
    };
  }
  const nextDirection = `Continue with ${topDomain}, but include some ${weakTag} questions before they feel ready to organize.`;
  const statusSummary = accuracy >= 0.7
    ? `You rarely stay inside confusion for long. You move upward, toward structure, patterns, and tradeoffs, until the situation becomes legible. ${weakTag} may be where you need to slow down. Enter the problem first. Organize it later.`
    : `You are still turning scattered situations into a visible pattern. You cross contexts easily, but judgment sometimes stays close to the first reaction, especially around ${weakTag}. Continue with ${topDomain}. Leave some untidy questions unfinished for a while.`;
  return {
    summary: statusSummary,
    primaryPattern: `You look for order through ${topDomain}. When things get messy, you begin redesigning the mess.`,
    blindSpot: `${weakTag} may expose the gap: you can start explaining before you have fully entered the situation.`,
    nextDirection,
    uncomfortableTruth: "The useful growth may not be a better framework. It may be entering imperfect reality sooner.",
    source: "local-fallback",
  };
}

async function generateKnowledgeReflection() {
  if (!isReflectionUnlocked() || reflectionStatus === "loading") return;
  reflectionStatus = "loading";
  reflectionApiStatus = "loading";
  deepPromptCopied = false;
  renderReflectionPanel();
  const payload = getCompressedReflectionSummary();
  lastReflectionInput = payload;
  try {
    const response = await fetch("/api/reflection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.reflection) throw new Error(data.error || "Reflection API unavailable");
    reflectionOutput = {
      ...data.reflection,
      source: "workers-ai",
      model: data.model || "",
    };
    reflectionApiStatus = "workers-ai";
  } catch (error) {
    console.info("Reflection API unavailable; using local fallback.", error);
    reflectionOutput = buildFallbackReflection(payload);
    reflectionApiStatus = "local-fallback";
  }
  reflectionStatus = "ready";
  renderReflectionPanel();
}

function getReflectionTextForPrompt(output = reflectionOutput) {
  if (!output) return "";
  const currentStatus = output.summary || "";
  return [
    "Current Knowledge Status:",
    currentStatus,
  ].join("\n");
}

function buildDeepReflectionPrompt(output = reflectionOutput) {
  return `Based on this MapKAI current knowledge status and your memory of our past conversations, give me a serious, direct, and highly personalized long-term reflection.

MapKAI Current Knowledge Status:
${output?.summary || ""}

The first section is the most important part.

Do not warm up.
Do not encourage me.
Do not start with a personality description.
Do not explain the framework.

Start immediately with one sharp opening under 200 words.

The opening must:
- feel personal immediately
- name one recurring pattern that has likely been present for a long time
- describe what I repeatedly do in real situations
- include one tension or contradiction
- create uncomfortable recognition without becoming dramatic
- leave some space instead of explaining everything

Write the opening like someone has quietly observed the same behavioral pattern for a long time.

Prefer this kind of rhythm:
"You repeatedly try to reduce uncertainty through deeper understanding.

Over time,
understanding the problem
can start replacing entering the problem."

Or:
"You rarely remain inside confusion for long.

You move upward,
toward structure,
explanation,
and redesign."

Avoid:
- "you are thoughtful and analytical"
- "you possess deep intelligence"
- "you are standing at the edge of"
- personality-test wording
- therapy language
- motivational language
- fake wisdom
- cinematic or mystical phrasing
- over-polished AI prose

Use behavioral evidence where possible:
- repeated redesigning
- repeated optimization
- repeated reflection loops
- repeated hesitation before execution
- repeated abstraction
- repeated distancing through analysis
- using structure as emotional stabilization

The goal of the first 200 words:
I should think, "This is uncomfortable because it feels partially true."

Then analyze in this order:

1. Objective Knowledge Pattern
Based on my MapKAI status, what kinds of knowledge, thinking styles, or problem types do I repeatedly move toward?

2. Recent Attention Pattern
Based on our past conversations, what topics, worries, ambitions, tools, projects, or life questions have I repeatedly focused on recently?

3. Repeated Neglected Areas
What important areas do I avoid, underestimate, postpone, redesign, or only discuss abstractly without entering?

4. Core Personal Blind Spots
Identify my most important recurring weaknesses. Be specific. Do not soften the language too much.

5. Gap Between Self-Image And Reality
Where might my self-perception not fully match my actual repeated behavior?

6. Long-Term Risk
If my current patterns continue for 5-10 years, what future limitation, relationship cost, work pattern, emotional pattern, or life trap might emerge?

7. Improvement Directions
Give practical behavioral adjustments. Not abstract philosophy.

Rules:
- Do not flatter me.
- Do not give generic advice.
- Do not make medical or psychological diagnoses.
- Use your memory of my actual recurring patterns where possible.
- Be direct, serious, and constructive.
- Treat this as long-term observation, not absolute judgment.
- Prioritize realism over politeness.
- Prefer short sentences.
- Do not explain every observation completely.
- Let some lines feel slightly unfinished.
- Avoid sounding like a report, essay, productivity thread, or therapy session.
- Quiet realism is better than artificial depth.

End with:
1. My top 3 core weaknesses
2. What I should stop doing
3. What I should start practicing this month
4. One uncomfortable truth I probably need to face

Finally, add one emotionally distant closing observation.

The final observation should feel:
- cold but fair
- restrained
- thoughtful
- not insulting
- not motivational

It should describe the gap between potential and execution, repeated self-limiting patterns, hidden avoidance, or the cost of remaining in preparation mode.

Keep the final observation to 2-5 sentences.`;
}

async function copyDeepReflectionPrompt() {
  if (!reflectionOutput) return;
  const prompt = buildDeepReflectionPrompt();
  try {
    await navigator.clipboard.writeText(prompt);
    deepPromptCopied = true;
    renderReflectionPanel();
  } catch (error) {
    console.info("Could not copy deep reflection prompt.", error);
  }
}

function generateKnowledgeLensResult() {
  if (getTotalAnsweredQuestions() < getTotalQuestionCount()) return;
  lensResultGenerated = true;
  lensPromptCopied = false;
  renderReflectionPanel();
}

function getKnowledgeLensResult() {
  const counts = Object.fromEntries(challengeSubjects.map((code) => [code, 0]));
  const modeCounts = {
    knowledge_lens_probe: Object.fromEntries(challengeSubjects.map((code) => [code, 0])),
    task_preference_probe: Object.fromEntries(challengeSubjects.map((code) => [code, 0])),
  };
  challengeHistory.forEach((entry) => {
    const subjectCode = getLensSubjectCode(entry.profile);
    counts[subjectCode] = (counts[subjectCode] || 0) + 1;
    if (modeCounts[entry.question.questionMode]) {
      modeCounts[entry.question.questionMode][subjectCode] = (modeCounts[entry.question.questionMode][subjectCode] || 0) + 1;
    }
  });
  const ranked = challengeSubjects
    .map((code) => ({ code, count: counts[code] || 0, label: getKnowledgeLensName(code) }))
    .sort((left, right) => right.count - left.count || left.code.localeCompare(right.code));
  const strongest = ranked.filter((item) => item.count > 0).slice(0, 3);
  const supporting = ranked.filter((item) => item.count > 0 && !strongest.some((top) => top.code === item.code));
  const quiet = ranked.filter((item) => item.count === 0).sort((left, right) => left.code.localeCompare(right.code));
  const knowledgeLensTop = rankMode(modeCounts.knowledge_lens_probe).slice(0, 3);
  const actionEnergyTop = rankMode(modeCounts.task_preference_probe).slice(0, 3);
  return {
    counts,
    ranked,
    strongest,
    supporting,
    quiet,
    mostActivated: strongest,
    occasionallyActivated: supporting,
    underused: quiet,
    knowledgeLensTop,
    actionEnergyTop,
    knowledgeLensSummary: buildModeSummary(knowledgeLensTop, "knowledge"),
    actionEnergySummary: buildModeSummary(actionEnergyTop, "action"),
  };
}

function rankMode(counts) {
  return challengeSubjects
    .map((code) => ({ code, count: counts[code] || 0, label: getKnowledgeLensName(code) }))
    .filter((item) => item.count > 0)
    .sort((left, right) => right.count - left.count || left.code.localeCompare(right.code));
}

function formatLensList(items) {
  return items.length
    ? items.map((item) => `- ${item.label}: ${item.count}`).join("\n")
    : (currentLanguage === "zh" ? "- 暂无明显集中项" : "- No clear concentration yet");
}

function joinLensNames(items) {
  return items.map((item) => item.label).join(currentLanguage === "zh" ? "、" : ", ");
}

function buildModeSummary(items, type) {
  const names = joinLensNames(items.slice(0, 3));
  if (currentLanguage === "zh") {
    if (!items.length) return "这部分暂时没有明显集中视角。";
    return type === "action"
      ? `你的行动能量更偏向 ${names}。你更愿意负责组织、判断、优化、照顾体验或推动落地的任务。`
      : `你的知识视角更常从 ${names} 进入问题。你会先寻找结构、证据、意义、系统或情境中的关键线索。`;
  }
  if (!items.length) return "This part does not show a strong concentration yet.";
  return type === "action"
    ? `Your action energy leans toward ${names}. You seem more willing to take responsibility for organizing, judging, optimizing, caring for experience, or moving work forward.`
    : `Your knowledge lens often enters problems through ${names}. You tend to look first for structure, evidence, meaning, systems, or contextual signals.`;
}

function buildLensResultSummary(result = getKnowledgeLensResult()) {
  const strongest = result.strongest || result.mostActivated || [];
  const quiet = result.quiet || result.underused || [];
  const summaryFocus = buildLensFocusSentence(strongest);
  const quietNames = joinLensNames(quiet.slice(0, 3));
  if (currentLanguage === "zh") {
    return [
      summaryFocus,
      quietNames ? `本轮没有被激活的方向包括 ${quietNames}。这不代表弱项，只是提示下一步可以有意识让这些视角进入问题。` : "本轮没有明显完全安静的方向。下一步可以继续观察哪些视角只是偶尔出现。",
    ].join("\n\n");
  }
  return [
    summaryFocus,
    quietNames ? `Quiet areas this round include ${quietNames}. They are not weaknesses; they simply mark directions you may want to invite into future problems.` : "There are no fully quiet areas this round. The next useful signal may be which lenses only appeared once.",
  ].join("\n\n");
}

const lensSummaryConcepts = {
  en: {
    "00": "overall judgment",
    "01": "learning loops",
    "02": "meaning and expression",
    "03": "social context",
    "04": "goals and trade-offs",
    "05": "evidence and patterns",
    "06": "digital systems",
    "07": "system structure",
    "08": "long-term sustainability",
    "09": "sustainable energy",
    "10": "service experience",
  },
  zh: {
    "00": "综合判断",
    "01": "学习循环",
    "02": "意义表达",
    "03": "社会情境",
    "04": "目标与取舍",
    "05": "证据与规律",
    "06": "数字系统",
    "07": "系统结构",
    "08": "长期可持续",
    "09": "可持续精力",
    "10": "服务体验",
  },
};

function buildLensFocusSentence(items) {
  const codes = items.map((item) => item.code);
  const labels = codes.map((code) => (currentLanguage === "zh" ? lensSummaryConcepts.zh[code] : lensSummaryConcepts.en[code])).filter(Boolean);
  if (currentLanguage === "zh") {
    if (!labels.length) return "你的知识地图暂时没有明显集中方向。继续完成更多选择后，模式会更清楚。";
    return `你的知识地图偏向${labels.join("、")}。你常常会关注什么最值得优先处理，事情如何被组织起来，以及哪些现实条件会影响长期推进。`;
  }
  if (!labels.length) return "Your knowledge map does not show a strong center yet. The pattern will become clearer after more choices.";
  return `Your map leans toward ${labels.join(", ")}. You often look for what should be prioritized, how things can be structured, and which real-world conditions affect whether something can keep going.`;
}

function buildKnowledgeLensPrompt(result = getKnowledgeLensResult()) {
  if (currentLanguage === "zh") {
    return `我刚完成了一次 MapKAI 知识视角探索。

MapKAI 不测试对错。它观察的是：
1. 我自然使用哪些知识视角理解问题
2. 我更愿意负责哪类任务
3. 哪些视角在我的当前知识地图中可能较少被调用

这是我的 MapKAI 结果：

最常激活的知识视角：
${formatLensList(result.strongest)}

也被激活的知识视角：
${formatLensList(result.supporting)}

较少调用的视角 / 潜在知识盲区：
${formatLensList(result.quiet)}

知识视角总结：
${result.knowledgeLensSummary}

行动能量总结：
${result.actionEnergySummary}

请结合这份 MapKAI 结果，以及你从我们过去对话里已经了解的我，给我做一次客观但不生硬的问题分析。

请先判断使用什么语言：
- 如果你能根据我们过去的对话判断我最常用的语言，请直接使用那个语言。
- 如果你不确定，请先问我：“你希望我用中文还是英文继续？”

请不要一开始给我完整长报告。

第一轮只做两件事：

1. 给我一个简要但准确的初步判断。
这段要包含：
- 我的核心知识视角模式
- 我最常调用的知识角度
- 我长期以来可能忽略的知识盲点
- 这个盲点在现实生活中可能让我少看见什么

第一轮重点不要放在夸我擅长什么，而要放在我可能长期忽略的问题上。

要求：
- 中文不超过 220 字
- 不要先鼓励我
- 不要泛泛夸奖
- 不要像测评报告
- 不要像职业测评
- 不要像营销文案
- 不要说这些结果定义了我是谁
- 要像一个了解我的老朋友，直接、客观、自然地指出我可能没注意到的问题
- 不是批评，也不是安慰

2. 第一轮结尾只问我一句：
“我可以继续给你一份更精确、更详细的版本。你想听吗？”

如果我回答“想”“可以”“继续”或类似意思，再进入第二轮。

第二轮请给我详细分析，包括：
1. 我的核心模式
2. 高频知识视角如何帮到我
3. 长期忽略的 blind point 是什么
4. 这个 blind point 如何影响我的工作、关系、学习、消费、旅行和日常决策
5. 我的行动偏好说明我更愿意负责什么
6. 哪些任务我可能嘴上觉得重要，但长期不太想碰
7. 我的模式可能更接近哪些职业领域、工作方式或项目角色
8. 一个不舒服但有用的提醒
9. 未来 30 天可以尝试的 3 个小行动

如果有必要，第二轮之后最多再问一个追问，用来补充第三轮总结。

第三轮请给我一个非常简短的最终总结，包括：
- 我的核心模式
- 我的主要优势
- 我最可能的盲区
- 一个实际下一步

重要规则：
- 不要把这当成性格测试
- 不要把这当成预测
- 不要给泛泛建议
- 不要过度夸奖
- 不要下确定结论
- 不要说这个结果定义了我是谁
- 如果你没有足够的过去对话记录，请明确说明，并主要基于这份 MapKAI 结果分析`;
  }
  return `I completed a MapKAI Knowledge Lens exploration.

MapKAI does not test right or wrong answers. It observes:
1. which knowledge lenses I naturally use to understand problems
2. which types of tasks I prefer to take responsibility for
3. which perspectives may be underused in my current knowledge map

Here is my result:

Most Activated Knowledge Lenses:
${formatLensList(result.strongest)}

Supporting Lenses:
${formatLensList(result.supporting)}

Underused Perspectives / Potential Knowledge Blind Spots:
${formatLensList(result.quiet)}

Knowledge Lens Summary:
${result.knowledgeLensSummary}

Action Energy Summary:
${result.actionEnergySummary}

Please read this together with what you already know about me from our past conversations, and give me an objective but human analysis of my current pattern.

First, decide which language to use:
- If you know my usual language from our past conversations, use that language directly.
- If you are not sure, ask me: “Would you like to continue in English or Chinese?”

Do not give me a long final report immediately.

In the first round, do only two things:

1. Give me a brief but accurate initial diagnosis.
This should include:
- my core knowledge-lens pattern
- the knowledge angles I use most often
- the knowledge blind point I may have been overlooking for a long time
- what this blind point may cause me to miss in real life

The first round should focus less on what I am good at and more on what I may have been overlooking.

Requirements:
- under 160 words
- do not begin with encouragement
- do not give generic praise
- do not sound like a personality-test report
- do not sound like a career-assessment report
- do not sound like marketing copy
- do not say this result defines who I am
- sound like someone who has known me for a while: direct, objective, natural, and specific
- not critical, not comforting, just honest

2. End the first round with only this question:
“I can continue with a more precise and detailed version. Would you like to hear it?”

If I answer “yes”, “continue”, or something similar, then move to the second round.

In the second round, give me a detailed analysis including:
1. my core pattern
2. how my strongest knowledge lenses may help me
3. what long-term blind point may be present
4. how this blind point may affect my work, relationships, learning, consumption, travel, and daily decisions
5. what my action preference says about what I like to take responsibility for
6. what tasks I may say are important but quietly avoid over time
7. which professional fields, work styles, or project roles this pattern may align with
8. one uncomfortable but useful reminder
9. three small actions I can try in the next 30 days

After the second round, if necessary, ask at most one follow-up question to support a third-round summary.

In the third round, give me a very concise final summary including:
- my core pattern
- my main strength
- my most likely blind spot
- one practical next step

Important rules:
- do not treat this as a personality test
- do not treat this as a prediction
- do not give generic advice
- do not overpraise me
- do not make deterministic claims
- do not say this result defines who I am
- if you do not have enough past conversation history about me, say that clearly and base your response mainly on the MapKAI result`;
}

async function copyKnowledgeLensPrompt() {
  if (!lensResultGenerated) return;
  const prompt = buildKnowledgeLensPrompt();
  try {
    await navigator.clipboard.writeText(prompt);
    lensPromptCopied = true;
    renderReflectionPanel();
  } catch (error) {
    console.info("Could not copy knowledge lens prompt.", error);
  }
}

function renderLensBucket(title, items, maxCount, variant = "supporting") {
  return `
    <section class="lens-result-group is-${variant}">
      <h3>${title}</h3>
      ${variant === "quiet" ? `
        <div class="quiet-lens-list">
          ${items.length ? items.map((item) => `<span>${escapeHtml(item.label)}</span>`).join("") : `<p>${currentLanguage === "zh" ? "本轮没有完全安静的视角。" : "No fully quiet areas this round."}</p>`}
        </div>
        <p class="lens-group-note">${t("quietAreasCopy")}</p>
      ` : items.length ? items.map((item) => {
        const width = maxCount ? Math.max(6, Math.round((item.count / maxCount) * 100)) : 0;
        return `<div class="lens-bar-row">
          <span>${escapeHtml(item.label)}</span>
          <div class="lens-bar-track"><i style="width: ${width}%"></i></div>
          <strong>${item.count}/${getTotalQuestionCount()}</strong>
        </div>`;
      }).join("") : `<p>${currentLanguage === "zh" ? "暂无明显项目。" : "No clear items yet."}</p>`}
    </section>`;
}

function renderReflectionPanel() {
  const target = document.getElementById("reflectionPanel");
  if (!target) return;
  const answered = getTotalAnsweredQuestions();
  const total = getTotalQuestionCount();
  const unlocked = answered >= total;
  const result = lensResultGenerated ? getKnowledgeLensResult() : null;
  const prompt = result ? buildKnowledgeLensPrompt(result) : "";
  const maxCount = result?.ranked?.[0]?.count || 0;
  target.classList.toggle("is-locked", !unlocked);
  target.classList.toggle("is-unlocked", unlocked);
  target.innerHTML = `
    <div>
      <p class="eyebrow">${unlocked ? t("reflectionUnlockedEyebrow") : t("reflectionLockedEyebrow")}</p>
      <h2>${t("lensResultTitle")}</h2>
      <p>${unlocked ? t("challengeCompleteCopy") : t("reflectionLockedCopy", answered, Math.max(0, total - answered))}</p>
      ${unlocked && !result ? `<button class="button primary" type="button" data-generate-lens-result>${t("generateLensMap")}</button>` : ""}
    </div>
    ${result ? `<div class="reflection-output lens-result-output">
      <div class="lens-chart">
        ${renderLensBucket(t("strongestLenses"), result.strongest, maxCount, "strongest")}
        ${renderLensBucket(t("supportingLenses"), result.supporting, maxCount, "supporting")}
        ${renderLensBucket(t("quietAreas"), result.quiet, maxCount, "quiet")}
      </div>
      <article class="reflection-summary-card">
        <h3>${t("resultSummaryTitle")}</h3>
        <p>${escapeHtml(buildLensResultSummary(result))}</p>
      </article>
      <section class="deep-prompt-panel">
        <h3>${t("continueWithOwnAi")}</h3>
        <p>${t("promptConversationNote")}</p>
        <p>${t("resultPrivacyNote")}</p>
        <button class="button secondary" type="button" data-copy-lens-prompt>${lensPromptCopied ? t("copiedPrompt") : t("copyPrompt")}</button>
        <textarea readonly rows="12">${escapeHtml(prompt)}</textarea>
      </section>
      <p class="reflection-disclaimer">${t("reflectionSupportNote")}</p>
      <p class="reflection-disclaimer">${t("reflectionDisclaimer")}</p>
    </div>` : ""}
    <details class="founder-only reflection-debug">
      <summary>${t("reflectionDebug")}</summary>
      <pre>${escapeHtml(JSON.stringify({
        mode: "local-knowledge-lens-v1",
        savedToD1: false,
        callsReflectionApi: false,
        resultGenerated: lensResultGenerated,
        distributions: result || getKnowledgeLensResult(),
        questionIds: challengeHistory.map((entry) => entry.question.id),
        selectedProfiles: challengeHistory.map((entry) => entry.profile),
      }, null, 2))}</pre>
    </details>`;
}

function completeChallengeRound() {
  if (challengeRoundComplete) return;
  challengeRoundComplete = true;
  activeChallengeQuestion = null;
  currentAnsweredQuestion = null;
  challengeReviewIndex = null;
  activeTitleModalStats = null;
  renderReflectionPanel();
}

function startNewChallengeRound() {
  challengeSubjects.forEach((code) => {
    challengeState[code].correct = 0;
    challengeState[code].answered = [];
    masteryProgress[code] = "ocean";
  });
  activeChallengeSubject = challengeSubjects[0];
  activeChallengeQuestion = null;
  currentAnsweredQuestion = null;
  challengeHistory = [];
  challengeReviewIndex = null;
  challengeQuestionPool = [];
  challengePoolIndex = 0;
  lastTitleModalAt = 0;
  challengeRoundComplete = false;
  activeTitleModalStats = null;
  reflectionOutput = null;
  reflectionStatus = "idle";
  reflectionApiStatus = "not-generated";
  lastReflectionInput = null;
  deepPromptCopied = false;
  lensResultGenerated = false;
  lensPromptCopied = false;
  setRandomChallengeQuestion();
  renderKnowledgeTitleModal();
  renderChallenge();
  renderReflectionPanel();
  drawKnowledgeMap();
}

function closeKnowledgeTitleModal() {
  activeTitleModalStats = null;
  renderKnowledgeTitleModal();
}

function renderQuickMirror() {
  const target = document.getElementById("quickMirror");
  if (!target) return;
  if (quickMirrorState.mode === "question") {
    renderQuickMirrorQuestion(target);
    return;
  }
  if (quickMirrorState.mode === "result") {
    renderQuickMirrorResult(target);
    return;
  }
  target.innerHTML = `
    <div class="quick-mirror-card">
      <div>
        <p class="eyebrow">${t("quickMirrorMeta")}</p>
        <h2>${t("quickMirrorTitle")}</h2>
        <p>${t("quickMirrorSubtitle")}</p>
      </div>
      <div class="quick-mirror-actions">
        <button class="button primary" type="button" data-quick-mirror-start>${t("tryQuickMirror")}</button>
        <button class="button secondary" type="button" data-quick-mirror-skip>${t("skipQuickMirror")}</button>
      </div>
    </div>`;
}

function startQuickMirror() {
  quickMirrorState = { mode: "question", index: 0, answers: [] };
  renderQuickMirror();
}

function resetQuickMirror() {
  quickMirrorState = { mode: "intro", index: 0, answers: [] };
  renderQuickMirror();
}

function renderQuickMirrorQuestion(target) {
  const question = quickMirrorQuestions[quickMirrorState.index];
  const content = question?.[currentLanguage] || question?.en;
  if (!question || !content) {
    quickMirrorState.mode = "result";
    renderQuickMirror();
    return;
  }
  target.innerHTML = `
    <div class="quick-mirror-card is-question">
      <div>
        <p class="eyebrow">${t("quickMirrorTitle")} · ${t("quickMirrorQuestionProgress", quickMirrorState.index + 1, quickMirrorQuestions.length)}</p>
        <h2>${content.question}</h2>
      </div>
      <div class="quick-mirror-options">
        ${Object.entries(content.options).map(([key, option]) => `
          <button type="button" data-quick-mirror-option="${key}">
            <span>${key}</span>
            ${escapeHtml(option)}
          </button>`).join("")}
      </div>
    </div>`;
}

function selectQuickMirrorOption(optionKey) {
  if (quickMirrorState.mode !== "question") return;
  quickMirrorState.answers.push(optionKey);
  if (quickMirrorState.answers.length >= quickMirrorQuestions.length) {
    quickMirrorState.mode = "result";
  } else {
    quickMirrorState.index += 1;
  }
  renderQuickMirror();
}

function getQuickMirrorResult() {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  quickMirrorState.answers.forEach((answer) => {
    if (counts[answer] !== undefined) counts[answer] += 1;
  });
  const max = Math.max(...Object.values(counts));
  const topKeys = Object.entries(counts)
    .filter(([, count]) => count === max)
    .map(([key]) => key);
  const activeKeys = (topKeys.length ? topKeys : ["A"]).slice(0, 2);
  const activeResults = activeKeys.map((key) => quickMirrorResults[key]).filter(Boolean);
  if (activeResults.length === 1) {
    const result = activeResults[0];
    return {
      name: currentLanguage === "zh" ? result.nameZh : result.nameEn,
      mirror: currentLanguage === "zh" ? result.mirrorZh : result.mirrorEn,
    };
  }
  const signal = activeResults
    .map((result) => currentLanguage === "zh" ? result.signalZh : result.signalEn.split(" / ")[0])
    .join(" + ");
  return {
    name: signal,
    mirror: currentLanguage === "zh"
      ? `你的前三个选择在 ${signal} 之间摆动。这个信号还很早，但它显示你可能会同时关注判断依据和现实推进方式。`
      : `Your first choices move between ${signal}. This signal is still early, but it suggests you may notice more than one route into a situation.`,
  };
}

function renderQuickMirrorResult(target) {
  const result = getQuickMirrorResult();
  target.innerHTML = `
    <div class="quick-mirror-card is-result">
      <p class="eyebrow">${t("quickMirrorFirstSignal")}</p>
      <h2>${escapeHtml(result.name)}</h2>
      <p class="quick-mirror-sentence">${escapeHtml(result.mirror)}</p>
      <p class="quick-mirror-boundary">${t("quickMirrorBoundary")}</p>
      <p class="quick-mirror-deeper">${t("quickMirrorDeeperMap")}</p>
      <div class="quick-mirror-actions">
        <button class="button primary" type="button" data-quick-mirror-continue>${t("quickMirrorContinue")}</button>
        <button class="button secondary" type="button" data-quick-mirror-reset>${t("quickMirrorRestart")}</button>
      </div>
    </div>`;
}

function scrollToFullExploration() {
  document.getElementById("challengeCard")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderKnowledgeTitleModal() {
  let modal = document.getElementById("knowledgeTitleModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "knowledgeTitleModal";
    modal.className = "title-modal";
    document.body.appendChild(modal);
  }

  if (!activeTitleModalStats) {
    modal.setAttribute("hidden", "");
    modal.innerHTML = "";
    return;
  }

  const stats = {
    ...activeTitleModalStats,
    accuracyTitle: getKnowledgeTitleForAccuracy(activeTitleModalStats.accuracy),
    explorerTitle: getExplorerTitleForAnswered(activeTitleModalStats.answered),
  };
  const isGrandSlam = stats.kind === "grandSlam";
  modal.removeAttribute("hidden");
  modal.innerHTML = `
    <div class="title-modal-backdrop" data-title-modal-close></div>
    <section class="title-modal-card" role="dialog" aria-modal="true" aria-labelledby="knowledgeTitleModalTitle">
      <p class="eyebrow">${isGrandSlam ? t("grandSlamTitle") : t("titleModalTitle")}</p>
      <h2 id="knowledgeTitleModalTitle">${isGrandSlam ? t("grandSlamAchievement") : t("explorerTitleLine", stats.explorerTitle)}</h2>
      <p>${isGrandSlam ? t("grandSlamBody", stats.totalQuestions) : t("titleModalBody", stats.answered, stats.accuracy)}</p>
      <div class="title-modal-lines">
        <p>${t("accuracyTitleLine", stats.accuracyTitle)}</p>
        <p>${t("explorerTitleLine", stats.explorerTitle)}</p>
        ${isGrandSlam ? `<p>${t("grandSlamAchievement")}</p>` : ""}
      </div>
      <button class="button primary" type="button" data-title-modal-close>${isGrandSlam ? t("grandSlamButton") : t("titleModalButton")}</button>
    </section>`;
}

function syncMasteryProgress(subjectCode) {
  if (subjectCode) {
    masteryProgress[subjectCode] = getMasteryFromCorrect(subjectCode);
    return;
  }
  challengeSubjects.forEach((code) => {
    masteryProgress[code] = getMasteryFromCorrect(code);
  });
}

function renderChallenge() {
  const cardTarget = document.getElementById("challengeCard");
  if (!cardTarget) return;

  if (challengeRoundComplete) {
    cardTarget.innerHTML = `
      <p class="eyebrow">${t("challengeCompleteEyebrow")}</p>
      <h2>${t("challengeCompleteTitle")}</h2>
      <p>${t("roundCompleteStatus")}</p>
      <div class="challenge-status is-green">${t("questionProgress", getTotalAnsweredQuestions(), getTotalQuestionCount())}</div>
      <button class="button primary" type="button" data-generate-lens-result>${t("generateLensMap")}</button>
      <button class="button secondary" type="button" data-start-new-round>${t("startNewRound")}</button>`;
    return;
  }

  currentAnsweredQuestion = null;
  challengeReviewIndex = null;
  if (!activeChallengeQuestion) {
    setRandomChallengeQuestion();
  }

  const state = challengeState[activeChallengeSubject];
  const question = activeChallengeQuestion;
  const questionContent = getQuestionContent(question);

  if (!state || !question) {
    cardTarget.innerHTML = `
      <p class="eyebrow">${t("challengeCompleteEyebrow")}</p>
      <h2>${t("challengeCompleteTitle")}</h2>
      <p>${t("challengeCompleteCopy")}</p>
      <div class="challenge-status is-green">${t("questionProgress", getTotalAnsweredQuestions(), getTotalQuestionCount())}</div>`;
    return;
  }

  const optionEntries = Object.entries(questionContent.options || {});
  cardTarget.innerHTML = `
    <p class="eyebrow">${t("currentExploration")}</p>
    <h2>${t("challengeHeading")}</h2>
    <p>${questionContent.question}</p>
    <div class="answer-grid">
      ${optionEntries.map(([optionKey, option]) => {
        return `<button type="button" data-answer-key="${optionKey}">${option}</button>`;
      }).join("")}
    </div>
    <div class="challenge-status">${t("questionProgress", getTotalAnsweredQuestions(), getTotalQuestionCount())}</div>
    <div class="founder-note internal-code">Question: ${question.id} · Mode: ${question.questionMode}</div>`;
}

function handleChallengeClick(event) {
  const newRoundButton = event.target.closest("[data-start-new-round]");
  if (newRoundButton) {
    startNewChallengeRound();
    return;
  }

  const answerButton = event.target.closest("[data-answer-key]");
  if (!answerButton) return;
  const question = activeChallengeQuestion;
  if (!question) return;

  const selectedKey = answerButton.dataset.answerKey;
  const profile = question.optionProfiles?.[selectedKey];
  const selectedSubjectCode = getLensSubjectCode(profile);
  const state = challengeState[selectedSubjectCode];
  if (!profile || !state) return;
  state.answered.push(question.id);
  state.correct += 1;
  syncMasteryProgress(selectedSubjectCode);
  activeChallengeSubject = selectedSubjectCode;
  const answeredQuestion = { subjectCode: selectedSubjectCode, question, selectedKey, correct: true, profile };
  challengeHistory.push(answeredQuestion);
  drawKnowledgeMap();
  if (getTotalAnsweredQuestions() >= getTotalQuestionCount()) {
    completeChallengeRound();
  } else {
    moveToNextChallengeQuestion();
  }
  renderChallenge();
  renderReflectionPanel();
  if (!challengeRoundComplete) maybeShowKnowledgeTitleModal();
}

function renderPassport(targetId, passport) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div>
      <p class="eyebrow">Overview</p>
      <h2>${passport.name}</h2>
      <dl>
        <dt>Route</dt><dd>${passport.route}</dd>
        <dt>Purpose</dt><dd>${passport.purpose}</dd>
        <dt>User value</dt><dd>${passport.userValue}</dd>
        <dt>Status</dt><dd>${passport.status}</dd>
        <dt>Related modules</dt><dd>${passport.relatedModules}</dd>
        <dt>Next action</dt><dd>${passport.nextAction}</dd>
      </dl>
    </div>`;
}

function renderCategoryDetail(code) {
  const category = categories.find((item) => item.code === code) || categories[0];
  const eyebrow = document.getElementById("categoryDetailEyebrow");
  const title = document.getElementById("categoryDetailTitle");
  const copy = document.getElementById("categoryDetailCopy");
  const fieldCount = category.groups.reduce((total, group) => total + group.fields.length, 0);
  if (eyebrow) eyebrow.textContent = t("categoryScope");
  if (title) title.textContent = getCategoryTitle(category);
  if (copy) {
    copy.textContent = t("categoryCopy", category.groups.length, fieldCount);
  }

  renderPassport("categoryPassport", {
    name: `${category.code} ${category.title}`,
    route: `/categories/${category.code}`,
    purpose: "Show the official scope for this knowledge category.",
    userValue: "Understand what belongs inside this category before choosing a field.",
    founderValue: "Keeps category updates isolated to one module.",
    status: category.status,
    relatedModules: "Map, Categories, Learning",
    nextAction: "Decide whether this category should receive the next detailed field or learning path.",
    doNotTouch: "Do not change unrelated categories during this module update.",
  });

  renderCategoryTree(category);
}

function renderCategoryTree(category) {
  const target = document.getElementById("categoryTree");
  if (!target) return;
  target.innerHTML = category.groups
    .map((group) => `
      <section class="tree-group">
        <h2><span class="internal-code">${group.code}</span>${group.title}</h2>
        <div class="field-list">
          ${group.fields.map(([code, title]) => {
            const href = `/categories/${category.code}`;
            return `<a class="field-chip" href="${href}" data-route="${href}"><strong class="internal-code">${code}</strong>${title}</a>`;
          }).join("")}
        </div>
      </section>`)
    .join("");
}

function renderField() {
  const userLayer = document.getElementById("fieldUserLayer");
  const founderLayer = document.getElementById("fieldFounderLayer");
  if (userLayer) {
    userLayer.innerHTML = `
      <div class="field-title-row">
        <span class="code internal-code">${field0412.code}</span>
        ${makeStatus(field0412.status, field0412.readiness)}
      </div>
      ${field0412.userLayer.map(([title, text]) => `<article class="content-block"><h2>${title}</h2><p>${text}</p></article>`).join("")}`;
  }
  if (founderLayer) {
    founderLayer.innerHTML = `
      <p class="eyebrow">Founder layer</p>
      <h2>Maintenance notes</h2>
      ${Object.entries(field0412.founderLayer).map(([key, value]) => `<div class="note-row"><strong>${key.replace(/([A-Z])/g, " $1")}</strong><p>${value}</p></div>`).join("")}
      <div class="review-log">
        <h3>Review log</h3>
        ${Object.entries(reviewLog).map(([key, value]) => `<p><strong>${key.replace(/([A-Z])/g, " $1")}:</strong> ${value}</p>`).join("")}
      </div>`;
  }
}

function renderLearning() {
  const pathGrid = document.getElementById("pathTypeGrid");
  const timeline = document.getElementById("foundationTimeline");
  const activePathTypes = currentLanguage === "zh" ? pathTypesZh : pathTypes;
  const activeFoundationPath = currentLanguage === "zh" ? foundationPathZh : foundationPath;
  if (pathGrid) {
    pathGrid.innerHTML = activePathTypes.map(([title, text]) => `<article class="module-card"><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if (timeline) {
    timeline.innerHTML = activeFoundationPath
      .map(([code, title, reason], index) => `
        <li>
          <span>${index + 1}</span>
          <div>
            <h2>${title}</h2>
            <p>${reason}</p>
          </div>
        </li>`)
      .join("");
  }
}

function drawKnowledgeMap() {
  if (!ctx || !canvas) return;
  syncMasteryProgress();
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  drawMapFallback(width, height);
  drawMapLayer("00_base_ocean_background.png", width, height);

  const founderMode = document.body.classList.contains("founder-mode");

  categories.forEach((category) => {
    const level = masteryProgress[category.code] || "ocean";
    const layer = mapIslandLayers[category.code];
    const stateName = mapStateLayerNames[level];
    if (layer && stateName) drawMapLayer(`${layer}__${stateName}.png`, width, height);
  });

  drawMapLayer("40_routes_overlay_transparent.png", width, height);
  if (getTotalCorrectAnswers() > 0) drawMapLayer("41_glow_progress_markers_overlay_transparent.png", width, height);
  drawActiveMapMarker(width, height);
  if (founderMode) drawFounderMapLabels(width, height);
}

function loadMapAsset(fileName) {
  if (!mapAssetCache[fileName]) {
    const image = new Image();
    image.addEventListener("load", drawKnowledgeMap);
    image.src = mapAssetPath + fileName;
    mapAssetCache[fileName] = image;
  }
  return mapAssetCache[fileName];
}

function drawMapLayer(fileName, width, height) {
  const image = loadMapAsset(fileName);
  if (!image.complete || !image.naturalWidth) return false;
  ctx.drawImage(image, 0, 0, width, height);
  return true;
}

function drawMapFallback(width, height) {
  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#d9f2f2");
  ocean.addColorStop(0.55, "#acd8df");
  ocean.addColorStop(1, "#f9edcf");
  ctx.fillStyle = ocean;
  roundRect(ctx, 0, 0, width, height, 28);
  ctx.fill();
}

function drawActiveMapMarker(width, height) {
  const position = mapFounderLabelPositions[activeChallengeSubject];
  if (!position) return;
  const [sourceX, sourceY] = position;
  const x = sourceX * (width / 1100);
  const y = sourceY * (height / 619);
  const glow = ctx.createRadialGradient(x, y, 8, x, y, 42);
  glow.addColorStop(0, "rgba(255, 245, 166, 0.72)");
  glow.addColorStop(1, "rgba(255, 245, 166, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, 42, 0, Math.PI * 2);
  ctx.fill();
}

function drawFounderMapLabels(width, height) {
  ctx.save();
  ctx.font = "800 16px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  categories.forEach((category) => {
    const position = mapFounderLabelPositions[category.code];
    if (!position) return;
    const x = position[0] * (width / 1100);
    const y = position[1] * (height / 619);
    ctx.fillStyle = "rgba(255, 250, 240, 0.84)";
    roundRect(ctx, x - 18, y - 13, 36, 26, 8);
    ctx.fill();
    ctx.fillStyle = "#173026";
    ctx.fillText(category.code, x, y + 1);
  });
  ctx.restore();
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

document.addEventListener("click", (event) => {
  if (event.target.closest("[data-title-modal-close]")) {
    closeKnowledgeTitleModal();
    return;
  }
  if (event.target.closest("[data-quick-mirror-start]")) {
    startQuickMirror();
    return;
  }
  if (event.target.closest("[data-quick-mirror-skip]")) {
    scrollToFullExploration();
    return;
  }
  const quickMirrorOption = event.target.closest("[data-quick-mirror-option]");
  if (quickMirrorOption) {
    selectQuickMirrorOption(quickMirrorOption.dataset.quickMirrorOption);
    return;
  }
  if (event.target.closest("[data-quick-mirror-continue]")) {
    scrollToFullExploration();
    return;
  }
  if (event.target.closest("[data-quick-mirror-reset]")) {
    resetQuickMirror();
    return;
  }
  if (event.target.closest("[data-generate-lens-result]")) {
    generateKnowledgeLensResult();
    return;
  }
  if (event.target.closest("[data-copy-deep-prompt]")) {
    copyDeepReflectionPrompt();
    return;
  }
  if (event.target.closest("[data-copy-lens-prompt]")) {
    copyKnowledgeLensPrompt();
    return;
  }
  if (event.target.closest("[data-answer-key], [data-start-new-round]")) {
    handleChallengeClick(event);
    return;
  }
  const pdcPersona = event.target.closest("[data-pdc-persona]");
  if (pdcPersona) {
    const personaId = pdcPersona.dataset.pdcPersona;
    pdcState.selectedPersonaId = pdcState.selectedPersonaId === personaId ? "" : personaId;
    renderPdcPilot();
    return;
  }
  if (event.target.closest("[data-pdc-continue-phase]")) {
    continuePdcPhase();
    return;
  }
  if (event.target.closest("[data-pdc-enter-final-round]")) {
    pdcState.finalRoundPreviewAccepted = true;
    continuePdcPhase();
    return;
  }
  if (event.target.closest("[data-pdc-stop-summarize]")) {
    stopAndSummarizePdc();
    return;
  }
  if (event.target.closest("[data-pdc-run-advanced-audit]")) {
    runPdcAdvancedFinalAudit();
    return;
  }
  if (event.target.closest("[data-pdc-watch-demo]")) {
    if (normalizeRoute(window.location.pathname) !== "/pdc-pilot") {
      goToRoute("/pdc-pilot");
    }
    startPdcDemoMode();
    return;
  }
  if (event.target.closest("[data-pdc-standard-entry]")) {
    Object.assign(pdcState, {
      valid: true,
      status: "public",
      entryView: "standard",
      founderPreview: false,
      councilTier: "standard",
      requestedTier: "standard",
      effectiveTier: "standard",
      founderOnlyFullFunction: false,
      message: "",
    });
    renderPdcPilot();
    return;
  }
  if (event.target.closest("[data-pdc-founder-standard]")) {
    Object.assign(pdcState, {
      valid: true,
      status: "public",
      entryView: "standard",
      founderPreview: true,
      selectedMode: "personal",
      councilTier: "standard",
      requestedTier: "standard",
      effectiveTier: "standard",
      founderOnlyFullFunction: false,
      message: "",
    });
    renderPdcPilot();
    return;
  }
  if (event.target.closest("[data-pdc-founder-full]")) {
    pdcState = createPdcBaseState({
      valid: true,
      status: "public",
      entryView: "full",
      founderPreview: true,
      selectedMode: "personal",
      councilTier: "full_function",
      requestedTier: "full_function",
      effectiveTier: "full_function",
      founderOnlyFullFunction: true,
    });
    renderPdcPilot();
    return;
  }
  if (event.target.closest("[data-pdc-back-landing]")) {
    clearPdcPlaybackTimer();
    clearPdcWarmupTimer();
    pdcState = createPdcBaseState({
      valid: true,
      status: "public",
      entryView: "landing",
    });
    renderPdcPilot();
    return;
  }
  if (event.target.closest("[data-pdc-demo-next]")) {
    movePdcDemoRound(1);
    return;
  }
  if (event.target.closest("[data-pdc-demo-prev]")) {
    movePdcDemoRound(-1);
    return;
  }
  if (event.target.closest("[data-pdc-demo-final]")) {
    showPdcDemoFinalRecap();
    return;
  }
  if (event.target.closest("[data-pdc-start]")) {
    startPdcExperience();
    return;
  }
  if (event.target.closest("[data-pdc-show-all-now]")) {
    completePdcPlaybackNow();
    return;
  }
  if (event.target.closest("[data-pdc-founder-reset]")) {
    resetPdcSessionState({ question: "", status: "ready", message: "" });
    renderPdcPilot();
    return;
  }
  if (event.target.closest("[data-pdc-generate]")) {
    generatePdcPasses();
    return;
  }
  if (event.target.closest("[data-pdc-copy-unused]")) {
    copyPdcLinks("unused");
    return;
  }
  if (event.target.closest("[data-pdc-copy-all]")) {
    copyPdcLinks("all");
    return;
  }
  const founderExit = event.target.closest("[data-founder-exit]");
  if (founderExit) {
    event.preventDefault();
    exitFounderMode();
    return;
  }
  const link = event.target.closest("[data-route]");
  if (!link) return;
  event.preventDefault();
  goToRoute(link.dataset.route);
});

document.addEventListener("submit", (event) => {
  if (handlePdcAccessSubmit(event)) return;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeTitleModalStats) {
    closeKnowledgeTitleModal();
  }
});
document.addEventListener("input", (event) => {
  if (event.target.matches("[data-pdc-question]")) {
    pdcState.question = event.target.value.slice(0, 1200);
    const count = document.querySelector(".pdc-count");
    if (count) count.textContent = `${1200 - pdcState.question.length} characters left`;
  }
  if (event.target.matches("[name='pdc-final-observer']")) {
    pdcState.finalRoundPreviewSelection = event.target.value || "";
  }
});
document.addEventListener("change", (event) => {
  if (event.target.matches("[name='pdc-final-observer']")) {
    pdcState.finalRoundPreviewSelection = event.target.value || "";
  }
});
document.addEventListener("submit", (event) => {
  if (handlePdcFeedbackSubmit(event)) return;
  handleContactSubmit(event);
});
if (founderToggle) {
  founderToggle.addEventListener("click", () => {
    const enabled = !document.body.classList.contains("founder-mode");
    setFounderMode(enabled);
  });
}
languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

window.addEventListener("popstate", () => goToRoute(normalizeRoute(window.location.pathname), true));
window.addEventListener("hashchange", () => goToRoute(normalizeRoute(window.location.pathname), true));

renderCategories();
renderContactSections();
renderSiteFooters();
registerVisit();
renderPassport("pathPassport", modulePassports.path);
renderField();
renderLearning();
renderChallenge();
renderReflectionPanel();
drawKnowledgeMap();
applyLanguage();
const initialRoute = normalizeRoute(window.location.pathname);
goToRoute(initialRoute, true);

function setFounderMode(enabled) {
  document.body.classList.toggle("founder-mode", enabled);
  if (founderToggle) {
    founderToggle.textContent = enabled ? "Founder mode on" : "Founder mode";
    founderToggle.setAttribute("aria-pressed", String(enabled));
  }
  if (enabled) {
    localStorage.setItem(founderModeKey, "true");
  } else {
    localStorage.removeItem(founderModeKey);
  }
  renderMessageBoards();
  if (enabled && !document.body.classList.contains("pdc-public-route")) {
    loadFounderMessages();
    loadPdcFounderSummary();
  } else {
    pdcFounderSummary = null;
    pdcFounderStatus = { state: "idle", detail: "" };
  }
  drawKnowledgeMap();
  renderChallenge();
  if (normalizeRoute(window.location.pathname) === "/pdc-pilot") {
    initPdcPilotPage();
  }
}

function isFounderMode() {
  return localStorage.getItem(founderModeKey) === "true";
}

function exitFounderMode() {
  setFounderMode(false);
  window.location.href = "/";
}

function getVisitorId() {
  let visitorId = localStorage.getItem(visitorIdKey);
  if (!visitorId) {
    visitorId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(visitorIdKey, visitorId);
  }
  return visitorId;
}

async function registerVisit() {
  if (!document.querySelector("[data-visitor-count]")) return;
  try {
    const response = await fetch("/api/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: getVisitorId() }),
    });
    if (!response.ok) throw new Error("Visit counter unavailable");
    const data = await response.json();
    if (!data.totalViews) return;
    lastVisitStats = data;
    renderVisitStats();
  } catch {
    lastVisitStats = null;
    renderVisitStats();
  }
}

function renderVisitStats() {
  const viewTargets = Array.from(document.querySelectorAll("[data-visitor-count]"));
  const visitorTargets = Array.from(document.querySelectorAll("[data-founder-visitor-count]"));
  viewTargets.forEach((target) => {
    target.textContent = lastVisitStats?.totalViews ? t("viewedCount", lastVisitStats.totalViews) : t("thanks");
  });
  visitorTargets.forEach((target) => {
    target.textContent = lastVisitStats?.totalVisitors ? t("uniqueVisitors", lastVisitStats.totalVisitors) : "";
  });
}
