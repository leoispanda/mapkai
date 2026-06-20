const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const founderToggle = document.getElementById("founderToggle");
const founderIndicator = document.querySelector(".founder-indicator");
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const contactEmail = "hello@mapkai.com";
const appVersion = "0.1.45";
const messageBoardKey = "mapkaiMessageBoard";
const visitorIdKey = "mapkaiVisitorId";
const languageKey = "mapkaiLanguage";
const themeKey = "mapkaiTheme";
const founderModeKey = "mapkaiFounderMode";
const founderStoriesKey = "mapkaiFounderStories";
const founderConsoleTabKey = "mapkaiFounderConsoleTab";
const languageButtons = Array.from(document.querySelectorAll("[data-language]"));
const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
const supportedLanguages = ["en", "zh"];
const supportedThemes = ["light", "dark"];
let currentLanguage = supportedLanguages.includes(localStorage.getItem(languageKey)) ? localStorage.getItem(languageKey) : "en";
let currentTheme = supportedThemes.includes(localStorage.getItem(themeKey)) ? localStorage.getItem(themeKey) : "light";
let lastVisitStats = null;
const activeCategorySubmodules = {};
const activeCategoryFields = {};

const readiness = {
  mapOnly: "Map only",
  classified: "Classified",
  pathReady: "Path ready",
  quizReady: "Quiz ready",
  validated: "Validated",
};

const masteryLevels = {
  ocean: { label: "Unknown", mapLabel: "Unknown", color: "#2f86b5" },
  snow: { label: "Emerging", mapLabel: "Emerging", color: "#e8f6f7" },
  land: { label: "Familiar", mapLabel: "Familiar", color: "#d6a947" },
  green: { label: "Active", mapLabel: "Active", color: "#7fc76f" },
};

const masteryLabels = {
  en: {
    ocean: "Unknown",
    snow: "Emerging",
    land: "Familiar",
    green: "Active",
  },
  zh: {
    ocean: "未探索的知识海洋",
    snow: "初步理解的雪山",
    land: "能够解释的陆地",
    green: "更熟练掌握的绿地",
  },
};

const routeMeta = {
  "/": {
    title: "MapKAI — AI-Native Knowledge Mapping and Decision Systems",
    description: "MapKAI helps people and teams turn scattered ideas into structured knowledge maps, reflective thinking systems, and clearer AI-assisted decisions.",
  },
  "/stories": {
    title: "MapKAI Stories — Knowledge Mapping Through Real Scenarios",
    description: "Read everyday scenarios that show how practical knowledge fields, reflection, and learning signals connect inside the MapKAI knowledge map.",
  },
  "/concept-fables": {
    title: "MapKAI Concept Fables — Advanced Ideas Through Hidden Stories",
    description: "Read short fables that quietly unfold advanced knowledge concepts before revealing the concept and its metaphors.",
  },
  "/explore": {
    title: "MapKAI Explore — Start an AI-Native Knowledge Map",
    description: "Answer a few everyday questions and reveal early active, quiet, and unexplored areas in your personal knowledge map.",
  },
  "/pdc": {
    title: "MapKAI PDC — AI Decision Council for Structured Reflection",
    description: "Use a structured AI council to think through decisions with trade-offs, disagreement, uncertainty, and timing pressure.",
  },
  "/pdc-pilot": {
    title: "MapKAI PDC — AI Decision Council for Structured Reflection",
    description: "Use a structured AI council to think through decisions with trade-offs, disagreement, uncertainty, and timing pressure.",
    robots: "noindex, nofollow",
  },
  "/map": {
    title: "MapKAI Knowledge Map — Explore 11 Knowledge Lenses",
    description: "Explore MapKAI's knowledge lenses and see which fields are unknown, emerging, familiar, or active in a learning map.",
  },
  "/map-challenge": {
    title: "MapKAI Map Challenge — Open the Knowledge Map",
    description: "Answer MapKAI challenge questions and gradually reveal snowy mountains, land, and green oases on the knowledge map.",
  },
  "/categories": {
    title: "MapKAI Knowledge Lenses — Explore Practical Fields",
    description: "Browse MapKAI's knowledge lenses and practical fields, organized as a calm map for learning and reflection.",
  },
  "/lens-stories": {
    title: "MapKAI Lens Stories — Everyday Knowledge Scenarios",
    description: "Read everyday knowledge stories connected to MapKAI lens subcategories and practical fields.",
  },
  "/learning": {
    title: "MapKAI Learning Paths — Connect Fields Into Next Steps",
    description: "Explore how MapKAI can connect knowledge fields into practical learning paths and clearer next steps.",
  },
  "/about": {
    title: "About MapKAI — Knowledge Mapping for the AI Era",
    description: "Learn how MapKAI helps people and teams navigate knowledge, reflection, learning, and decisions in the AI era.",
  },
  "/privacy": {
    title: "MapKAI Privacy — Low-Data Knowledge Exploration",
    description: "Learn how MapKAI keeps the public knowledge exploration low-data, account-free, and free from advertising tracking.",
  },
  "/responsible-use": {
    title: "MapKAI Responsible Use — Reflection and Learning Support",
    description: "Understand how to use MapKAI as reflection and learning support while keeping final judgment with you.",
  },
  "/cookies": {
    title: "MapKAI Cookies — Browser Storage and Tracking",
    description: "Read how MapKAI uses browser storage and avoids advertising or tracking cookies in the current public experience.",
  },
  "/terms": {
    title: "MapKAI Terms — Free Knowledge Initiative",
    description: "Review the basic terms for using MapKAI as a free knowledge and reflection initiative.",
  },
};

const uiText = {
  en: {
    navHome: "Home",
    navStories: "Stories",
    navExplore: "Explore",
    navMap: "Knowledge Map",
    navPdc: "PDC",
    navCategories: "Lens",
    navLearning: "Learning",
    navAbout: "About",
    storiesEyebrow: "Stories",
    storiesTitle: "Historical cases. Larger maps.",
    storiesCopy: "Real events with conflict, debate, and conclusions across multiple knowledge lenses.",
    conceptFablesEyebrow: "Concept fables",
    conceptFablesTitle: "Advanced ideas, hidden inside fables.",
    conceptFablesCopy: "Each domain hides one graduate-level concept inside a story. Read first; the concept appears only near the end.",
    conceptFablesAction: "Read concept fables",
    conceptFableRead: "Read fable",
    conceptFableBack: "Back to concept fables",
    conceptFableStoryLabel: "Fable",
    conceptFableRevealLabel: "Reveal",
    conceptFableExplanationLabel: "Concept explained",
    conceptFableMetaphorLabel: "Metaphor map",
    conceptFableReflectionLabel: "Reflection",
    conceptFableNotFoundTitle: "Concept fable not found",
    conceptFableNotFoundCopy: "This concept fable is not available yet.",
    readStory: "Read story",
    readLensStory: "Read everyday story",
    backToLens: "Back to Lens",
    lensStoryEyebrow: "Lens Story",
    lensStorySceneLabel: "Story scene",
    lensStoryKnowledgeLabel: "Knowledge hidden inside",
    lensStorySupportLabel: "Historical anchors",
    lensStoryTryLabel: "Try this reflection",
    lensStoryFieldLabel: "Connected field",
    lensStoryNotFoundTitle: "Story not found",
    lensStoryNotFoundCopy: "This lens story is not available yet.",
    lensStoryShelfEyebrow: "Knowledge story collection",
    lensStoryShelfTitle: "Each lens opens into a story set.",
    lensStoryShelfCopy: "Start with one entry story here, then open a lens to find a focused story for every sublens inside it.",
    lensStoryShelfLens: "Lens",
    backToStories: "Back to Stories",
    storyInsightTitle: "Conclusion",
    storyPerspectivesTitle: "Historical debate",
    storyPerspectivesCopy: "Actual arguments, role trade-offs, and a few counterfactual seats at the table.",
    storyFocusLabel: "Focus",
    homeEyebrow: "MapKAI",
    homeTitle: "Map your knowledge with AI",
    homeCopy: "Answer three everyday questions. See which areas feel active, quiet, or worth exploring next.",
    homePrimary: "Start exploration",
    homeMapAction: "View Knowledge Map",
    homePdcAction: "Try PDC",
    homeQuickMirrorHint: "No login. No account. Just a quiet starting point.",
    homeQuickMirrorSupport: "Includes a 30-sec Quick Mirror for first-time explorers.",
    mapStartTrust: "Explore freely. No account, name, or email required. Your quiz progress is not linked to a personal profile.",
    contactTrust: "Contact is optional. Please avoid sharing highly sensitive personal information. If you send us a message, we use it only to respond to you.",
    reflectionSupportNote: "Use this as reflection and learning support, not as professional advice.",
    homeLearning: "View Knowledge Map",
    homeCategories: "Browse Domains",
    coreEyebrow: "Core exploration loop",
    coreTitle: "Explore, answer, reveal, reflect.",
    exploreCardTitle: "Explore - Answer questions",
    exploreCardCopy: "Begin the active exploration loop with pattern-recognition questions.",
    exploreCardLink: "Start exploring",
    mapCardTitle: "Map - See revealed territory",
    mapCardCopy: "Watch your knowledge world light up as exploration progresses.",
    mapCardLink: "Open map",
    mapChallengeAction: "Start Map Challenge",
    mapLensAction: "Try Lens Explore",
    mapChallengeEyebrow: "Map Challenge",
    mapChallengeTitle: "Open the knowledge map.",
    mapChallengeCopy: "Answer challenge questions from the original MapKAI question bank. Correct answers gradually reveal snowy mountains, land, and green oases.",
    mapChallengeViewMap: "View Map",
    mapChallengeProgress: (current, total, subject) => `Question ${current}/${total} · ${subject}`,
    mapChallengeCompleteTitle: "Challenge complete.",
    mapChallengeCompleteCopy: "You explored the original MapKAI question bank. The map now reflects your correct answers by knowledge area.",
    mapChallengeRestart: "Restart Challenge",
    mapChallengeRestartShort: "Restart",
    mapChallengeNext: "Next question",
    mapChallengeCorrect: "Correct",
    mapChallengeIncorrect: "Not this time",
    mapChallengeStatus: (correct, answered, snow, land, green) => `${correct}/${answered} correct · ${snow} emerging · ${land} familiar · ${green} active`,
    mapChallengeSource: (subjectCode, subjectName, questionId) => `Source: ${subjectCode} · ${subjectName} · ${questionId}`,
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
    mapEyebrow: "Knowledge Map",
    mapTitle: "Your knowledge map.",
    mapCopy: "Answer questions. Watch unknown ocean turn into land.",
    mapStatesTitle: "Map states",
    mapStateOcean: "Ocean Unknown",
    mapStateSnow: "Snow Emerging",
    mapStateLand: "Land Active",
    goCategories: "Continue Exploring",
    goLearning: "Browse Domains",
    quickMirrorTitle: "Quick Mirror",
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
    challengeEyebrow: "",
    challengeTitle: "",
    challengeCopy: "",
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
    pdcEntryTitle: "Navigate Your Thinking with a Structured Council",
    pdcEntrySubtitle: "Think through a decision before you act.",
    pdcEntryDescription: "PDC helps you examine one real decision through structured disagreement, then turn the discussion into a clearer decision memo.",
    pdcHowEyebrow: "How it works",
    pdcHowTitle: "How it works",
    pdcStepOneTitle: "Bring one real question",
    pdcStepOneCopy: "Start with a decision, tension, or trade-off you actually face.",
    pdcStepTwoTitle: "Open, challenge, and compare perspectives",
    pdcStepTwoCopy: "The council surfaces assumptions, risks, opportunities, and competing priorities.",
    pdcStepThreeTitle: "Leave with a clearer decision memo",
    pdcStepThreeCopy: "Blue Whale summarizes the strongest views, remaining tensions, and practical next steps.",
    pdcAccessEyebrow: "Private Access",
    pdcAccessTitle: "Enter your one-time PDC access code",
    pdcAccessDescription: "Use the one-time code shared with you to enter the private PDC experience.",
    pdcAccessLabel: "Access code",
    pdcAccessPlaceholder: "Paste your one-time access code",
    pdcAccessButton: "Enter PDC Experience",
    categoriesEyebrow: "Knowledge Lenses",
    categoriesTitle: "Eleven lenses for seeing what you know.",
    categoriesCopy: "Choose a lens first, then open its submodules to read focused stories and concept fables.",
    openCategory: "Open lens",
    categoryScope: "Lens scope",
    categoryCopy: (groups, fields) => `This lens contains ${groups} groups and ${fields} practical fields.`,
    submoduleLabel: "Module",
    submoduleIntroStory: "Module overview",
    detailedFieldLabel: "Detailed field",
    fieldIntroStory: "Field overview",
    importantConceptStories: "Key concept",
    advancedConceptStory: "Advanced concept fable",
    openSubmodule: "Open submodule",
    openDetailedField: "Open field",
    openStory: "Open story",
    noStoryReady: "This story is still being prepared.",
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
    navHome: "首页",
    navStories: "故事",
    navExplore: "探索",
    navMap: "知识地图",
    navPdc: "PDC",
    navCategories: "知识镜头",
    navLearning: "学习路径",
    navAbout: "关于",
    storiesEyebrow: "故事",
    storiesTitle: "真实历史，更大的知识地图。",
    storiesCopy: "用真实发生的事件，呈现冲突、讨论过程，以及多重知识视角下的结论。",
    conceptFablesEyebrow: "概念寓言",
    conceptFablesTitle: "把高级概念藏进故事里。",
    conceptFablesCopy: "每个领域先随机挑一个研究生水平概念，用寓言讲完，直到故事末尾才揭示它是什么。",
    conceptFablesAction: "阅读概念寓言",
    conceptFableRead: "阅读寓言",
    conceptFableBack: "返回概念寓言",
    conceptFableStoryLabel: "寓言故事",
    conceptFableRevealLabel: "揭示",
    conceptFableExplanationLabel: "概念解释",
    conceptFableMetaphorLabel: "隐喻对应",
    conceptFableReflectionLabel: "思考一下",
    conceptFableNotFoundTitle: "没有找到这篇概念寓言",
    conceptFableNotFoundCopy: "这篇概念寓言还没有开放。",
    readStory: "阅读故事",
    readLensStory: "阅读生活故事",
    backToLens: "返回知识镜头",
    lensStoryEyebrow: "知识故事",
    lensStorySceneLabel: "故事场景",
    lensStoryKnowledgeLabel: "藏在里面的知识",
    lensStorySupportLabel: "历史支撑",
    lensStoryTryLabel: "试着这样反思",
    lensStoryFieldLabel: "关联领域",
    lensStoryNotFoundTitle: "故事未找到",
    lensStoryNotFoundCopy: "这个知识故事还没有开放。",
    lensStoryShelfEyebrow: "知识故事集",
    lensStoryShelfTitle: "每个 Lens 里面都有一组故事。",
    lensStoryShelfCopy: "这里保留每个 Lens 的入口故事；进入任一 Lens 后，每个 sublens 都可以打开一个针对性小故事。",
    lensStoryShelfLens: "镜头",
    backToStories: "返回故事",
    storyInsightTitle: "结论",
    storyPerspectivesTitle: "当时的讨论",
    storyPerspectivesCopy: "真实争论、角色权衡，以及几个“如果他在场会怎样”的反事实席位。",
    storyFocusLabel: "关注点",
    homeEyebrow: "MapKAI",
    homeTitle: "用 AI 映射你的知识",
    homeCopy: "回答三个日常问题，看看哪些区域活跃、安静，或值得继续探索。",
    homePrimary: "开始探索",
    homeMapAction: "查看知识地图",
    homePdcAction: "试试 PDC",
    homeQuickMirrorHint: "无需登录，无需账号。只是一个安静的起点。",
    homeQuickMirrorSupport: "包含一个适合第一次体验的 30秒思维镜像。",
    mapStartTrust: "自由探索。无需账户、姓名或邮箱。你的答题进度不会绑定到个人档案。",
    contactTrust: "联系是可选的。请避免提交高度敏感的个人信息。如果你发送留言，我们只会用它来回复你。",
    reflectionSupportNote: "请把它作为反思与学习支持，而不是专业建议。",
    homeLearning: "查看知识地图",
    homeCategories: "浏览领域",
    coreEyebrow: "核心探索循环",
    coreTitle: "探索、回答、显现、反思。",
    exploreCardTitle: "探索 - 回答问题",
    exploreCardCopy: "从模式识别问题开始，进入主动探索循环。",
    exploreCardLink: "开始探索",
    mapCardTitle: "地图 - 看见已显现的领域",
    mapCardCopy: "随着探索推进，看见你的知识世界逐步点亮。",
    mapCardLink: "打开地图",
    mapChallengeAction: "开始地图挑战",
    mapLensAction: "试试视角探索",
    mapChallengeEyebrow: "地图挑战",
    mapChallengeTitle: "开启你的知识地图。",
    mapChallengeCopy: "回答 MapKAI 原始题库里的挑战题。答对后，雪山、大陆和绿洲会逐步显现。",
    mapChallengeViewMap: "查看地图",
    mapChallengeProgress: (current, total, subject) => `第 ${current}/${total} 题 · ${subject}`,
    mapChallengeCompleteTitle: "挑战完成。",
    mapChallengeCompleteCopy: "你已经探索了 MapKAI 原始题库。地图会根据每个知识领域的答对情况呈现进度。",
    mapChallengeRestart: "重新挑战",
    mapChallengeRestartShort: "重来",
    mapChallengeNext: "下一题",
    mapChallengeCorrect: "答对了",
    mapChallengeIncorrect: "这次不是",
    mapChallengeStatus: (correct, answered, snow, land, green) => `${correct}/${answered} 答对 · ${snow} 初现 · ${land} 熟悉 · ${green} 激活`,
    mapChallengeSource: (subjectCode, subjectName, questionId) => `来源：${subjectCode} · ${subjectName} · ${questionId}`,
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
    mapEyebrow: "知识地图",
    mapTitle: "你的知识地图。",
    mapCopy: "回答问题，看未知海洋逐渐变成陆地。",
    mapStatesTitle: "地图状态",
    mapStateOcean: "海洋 未知",
    mapStateSnow: "雪山 初现",
    mapStateLand: "陆地 激活",
    goCategories: "继续探索",
    goLearning: "浏览领域",
    quickMirrorTitle: "30秒思维镜像",
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
    challengeEyebrow: "",
    challengeTitle: "",
    challengeCopy: "",
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
    pdcEntryTitle: "Navigate Your Thinking with a Structured Council",
    pdcEntrySubtitle: "在行动之前，先把一个决定想清楚。",
    pdcEntryDescription: "PDC 帮你通过结构化分歧审视一个真实决定，并把讨论整理成更清晰的决策备忘录。",
    pdcHowEyebrow: "它如何运作",
    pdcHowTitle: "它如何运作",
    pdcStepOneTitle: "带来一个真实问题",
    pdcStepOneCopy: "从一个你真实面对的决定、张力或取舍开始。",
    pdcStepTwoTitle: "打开、挑战并比较视角",
    pdcStepTwoCopy: "委员会会呈现假设、风险、机会和相互竞争的优先级。",
    pdcStepThreeTitle: "带走一份更清晰的决策备忘录",
    pdcStepThreeCopy: "Blue Whale 会总结最强观点、仍然存在的张力和可执行的下一步。",
    pdcAccessEyebrow: "私人访问",
    pdcAccessTitle: "输入你的一次性 PDC 访问码",
    pdcAccessDescription: "使用与你分享的一次性访问码，进入私人 PDC 体验。",
    pdcAccessLabel: "访问码",
    pdcAccessPlaceholder: "粘贴你的一次性访问码",
    pdcAccessButton: "进入 PDC 体验",
    categoriesEyebrow: "认知领域",
    categoriesTitle: "每个领域都有自己的思考方式。",
    categoriesCopy: "先选择一个 Lens，再进入它的 submodule，阅读对应的介绍故事和概念寓言。",
    openCategory: "打开镜头",
    categoryScope: "镜头范围",
    categoryCopy: (groups, fields) => `这个知识镜头包含 ${groups} 个组和 ${fields} 个实践领域。`,
    submoduleLabel: "模块",
    submoduleIntroStory: "模块概览",
    detailedFieldLabel: "细分条目",
    fieldIntroStory: "条目概览",
    importantConceptStories: "重要概念",
    advancedConceptStory: "高级概念寓言",
    openSubmodule: "打开子模块",
    openDetailedField: "打开条目",
    openStory: "打开故事",
    noStoryReady: "这个故事还在准备中。",
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

const mapAssetPath = "/assets/map-v2/";
const mapComponentSets = {
  snow: ["snow_01.png", "snow_02.png", "snow_03.png", "snow_04.png"],
  land: ["land_01.png", "land_02.png", "land_03.png", "land_04.png"],
  green: ["oasis_01.png", "oasis_02.png", "oasis_03.png", "oasis_04.png"],
};
const mapComponentPlacements = {
  "00": { x: 72, y: 70, width: 235, variant: 0 },
  "01": { x: 360, y: 46, width: 250, variant: 1 },
  "02": { x: 722, y: 80, width: 225, variant: 2 },
  "03": { x: 170, y: 230, width: 230, variant: 1 },
  "04": { x: 495, y: 220, width: 245, variant: 0 },
  "05": { x: 800, y: 248, width: 230, variant: 2 },
  "06": { x: 75, y: 405, width: 225, variant: 1 },
  "07": { x: 355, y: 390, width: 225, variant: 0 },
  "08": { x: 630, y: 402, width: 210, variant: 2 },
  "09": { x: 862, y: 430, width: 190, variant: 3 },
  "10": { x: 500, y: 510, width: 170, variant: 3 },
};
const mapFounderLabelPositions = {
  "00": [190, 150],
  "01": [485, 138],
  "02": [835, 158],
  "03": [285, 314],
  "04": [615, 304],
  "05": [915, 326],
  "06": [185, 485],
  "07": [470, 475],
  "08": [735, 474],
  "09": [958, 500],
  "10": [585, 584],
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

const baseLensStories = [
  {
    id: "000-general-starter-course",
    categoryCode: "00",
    groupCode: "000",
    groupTitle: "Generic programmes and qualifications not further defined",
    groupTitleZh: "未进一步细分的通用课程与资格",
    fieldCodes: ["0000"],
    fieldTitlesZh: {
      "0000": "未进一步细分的通用课程与资格",
    },
    image: "/assets/stories/000-general-starter-course.png",
    imageAlt: "An adult learner and a mentor planning a general starter course in a community learning center.",
    imageAltZh: "一位成年学习者和导师在社区学习中心规划通用入门课程。",
    title: "The leather-apron evening",
    titleZh: "皮围裙俱乐部的夜晚",
    summary: "A small club of workers and readers showed why general learning often begins before a formal subject name appears.",
    summaryZh: "一群工匠、店员和读书人组成的小社团，让人看见通用学习常常早于正式学科名称出现。",
    scene: "In 1727 Philadelphia, a young printer closed the shop, wiped ink from his hands, and walked to an evening meeting where no one was earning a degree.",
    sceneZh: "1727 年的费城，一个年轻印刷工收好铅字，擦掉手上的油墨，走去参加一场没有学位、没有正式课表的夜间聚会。",
    storyBody: "He was only in his early twenties and still close enough to poverty to know that books, conversation, and reliable friends could change a life. The people who gathered were not all scholars. There were tradesmen, clerks, surveyors, makers, and men trying to get better at business, morals, politics, and the natural world. They brought questions instead of exams: what useful thing had you learned this week, what mistake should the city avoid, which book should we borrow next, who needs help finding work? Out of those evenings grew habits that looked too broad for any single course: reading together, arguing with evidence, improving speech, pooling books, and turning private curiosity into public projects. This person was Benjamin Franklin, whose Junto mutual-improvement club helped make civic discussion, shared books, and self-education part of the history of general learning.",
    storyBodyZh: "他二十出头，离贫穷还不远，所以很清楚：书、谈话和可靠的朋友，真的可能改变一个人的命运。来聚会的人并不都是学者，有工匠、店员、测量员、制造者，也有人只是想把生意、品格、政治和自然知识弄明白一点。他们带来的不是考试，而是问题：这周你学到什么有用的东西？城市应该避免什么错误？下一本书借什么？谁需要帮忙找工作？这些夜晚慢慢长出一种很难被单一学科命名的能力：共同阅读、用证据争论、练习表达、共享书籍，把私人的好奇心变成公共项目。通用课程与资格的意义就在这里：人在还没有确定专业之前，先学会如何学习、如何提问、如何和别人一起把知识变成行动。这个人叫 Benjamin Franklin，他发起 Junto 互助学习社群，并推动图书馆、公民讨论和自我教育成为现代通用学习的重要源头。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是通用课程与资格能够提供的基础：进入具体道路之前的基础能力：方向感、阅读习惯、共同探究，以及把知识转成行动的信心。这让今天的学习者回到一个很实际的问题：在选择具体道路之前，先怎样练习提问、表达和与别人一起学习。",
    support: "The Junto, founded in Philadelphia in 1727, was a mutual-improvement club associated with Benjamin Franklin. It brought together people from different occupations to discuss morals, politics, natural philosophy, business, books, and civic projects.",
    supportZh: "Junto 于 1727 年在费城成立，通常被视为 Benjamin Franklin 发起的互助改进社群。成员来自不同职业，讨论道德、政治、自然哲学、商业、读书和城市公共事务，也影响了后来的图书馆与公民学习实践。",
    knowledgePoint: "Generic programmes give learners orientation, reading habits, shared inquiry, and practical confidence before a narrower subject path is chosen.",
    knowledgePointZh: "通用课程与资格提供的是进入具体道路之前的基础能力：方向感、阅读习惯、共同探究，以及把知识转成行动的信心。",
    reflectionQuestion: "Before you choose a major direction, what kind of learning community would help you become less afraid of learning itself?",
    reflectionQuestionZh: "在你选择一个具体方向之前，什么样的学习共同体会让你不再害怕学习本身？",
    tags: ["mutual improvement", "general learning", "civic inquiry"],
    tagsZh: ["互助改进", "通用学习", "公民探究"],
  },
  {
    id: "011-dewey-lab-school",
    categoryCode: "01",
    groupCode: "011",
    groupTitle: "Education",
    groupTitleZh: "教育",
    fieldCodes: ["0110"],
    fieldTitlesZh: {
      "0110": "未进一步细分的教育",
    },
    image: "/assets/stories/011-after-school-reading-plan.png",
    imageAlt: "A teacher and children working around a classroom table in an early progressive school.",
    imageAltZh: "一位老师和孩子们围着教室桌子做活动，像早期进步教育学校里的场景。",
    title: "The classroom that tried breakfast",
    titleZh: "孩子们做早餐的教室",
    summary: "A school experiment in Chicago made education less like recitation and more like life being studied together.",
    summaryZh: "芝加哥的一次学校实验，让教育不再只是背诵，而像是把生活拿到教室里一起研究。",
    scene: "In 1896 Chicago, a classroom table held flour, cloth, wood, measuring tools, and questions that did not fit neatly into one textbook.",
    sceneZh: "1896 年的芝加哥，一张教室桌上放着面粉、布料、木头、量具，还有一些很难塞进单本课本里的问题。",
    storyBody: "The philosopher who helped run the school had spent years asking a plain question: why did school so often separate thinking from living? He had studied philosophy and psychology, then came to Chicago wanting to test ideas in a real classroom rather than leave them in lecture notes. He watched children work with cooking, sewing, building, measuring, and conversation, and noticed that a breakfast lesson could become chemistry, number, history, cooperation, and language at once. The classroom was not pretending that every activity was automatically deep. Teachers still had to prepare, observe, connect, and question. But the experiment changed the direction of attention: education was no longer only what adults delivered to children; it was a social situation where children learned by acting, noticing consequences, and making meaning with others. This person was John Dewey, whose University of Chicago Laboratory School helped make learning by doing and progressive education part of modern educational thought.",
    storyBodyZh: "参与这所学校的那位哲学家，原本研究哲学和心理学。他一直被一个很朴素的问题困住：为什么学校常常把“会思考”和“会生活”分开？来到芝加哥以后，他不想只在讲稿里谈教育，而是想把想法放进真实教室里试一试。他看孩子做饭、缝纫、制作、测量、交谈，然后追问为什么。一节早餐课可以同时牵出化学、数量、历史、合作和语言。教室并不是把所有活动都浪漫化，老师仍然需要准备、观察、连接和提问。但这个实验改变了教育的方向：教育不只是成人把内容交给儿童，而是一个社会性的情境，孩子在行动、后果和共同解释中学习。这个人叫 John Dewey，他创办芝加哥大学实验学校，让“做中学”和进步教育成为现代教育的重要线索。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是未进一步细分的教育，是追问教育目的、学习情境设计，以及学校如何把知识和生活要练习的连接能力：起来的宽镜头。所以它不只是教育史的一页，也是在提醒老师和学生：先观察学习怎样发生，再决定怎样介入。",
    support: "John Dewey founded the University of Chicago Laboratory Schools in 1896. The school served as a laboratory for testing educational ideas connected to progressive education and learning through experience.",
    supportZh: "John Dewey 于 1896 年创办 University of Chicago Laboratory Schools。这所学校被用作教育思想实验场，和进步教育、经验学习、学校作为社会共同体等观念紧密相关。",
    knowledgePoint: "Education not further defined is the broad lens for asking what education is for, how learning situations are designed, and how school connects knowledge with life.",
    knowledgePointZh: "未进一步细分的教育，是追问教育目的、学习情境设计，以及学校如何把知识和生活连接起来的宽镜头。",
    reflectionQuestion: "If a classroom starts from a real activity instead of a finished answer, what kind of learning becomes possible?",
    reflectionQuestionZh: "如果一间教室从真实活动开始，而不是从标准答案开始，哪一种学习会变得可能？",
    tags: ["progressive education", "learning by doing", "school design"],
    tagsZh: ["进步教育", "做中学", "学校设计"],
  },
  {
    id: "020-family-photo-meaning",
    categoryCode: "02",
    groupCode: "020",
    groupTitle: "Arts and humanities not further defined",
    groupTitleZh: "未进一步细分的艺术与人文",
    fieldCodes: ["0200"],
    fieldTitlesZh: {
      "0200": "未进一步细分的艺术与人文",
    },
    image: "/assets/stories/020-family-photo-meaning.png",
    imageAlt: "A family at a dinner table interpreting an old photograph together.",
    imageAltZh: "一家人在餐桌旁一起解读一张旧照片。",
    title: "The black cloth full of pictures",
    titleZh: "黑布上的一千张图片",
    summary: "An unfinished image atlas showed how art and humanities can trace memory across objects, gestures, books, and public life.",
    summaryZh: "一部未完成的图像图谱，让人看见艺术与人文如何追踪物件、姿势、书籍和公共生活里的记忆。",
    scene: "In Hamburg, a young man from a wealthy banking family kept choosing books, images, and strange visual echoes instead of the expected life of finance.",
    sceneZh: "在汉堡，一个出身银行家家庭的年轻人，没有把全部人生放进金融账本里，反而总被书、图像和那些奇怪的视觉回声吸引。",
    storyBody: "He was not satisfied when a painting was described only by its artist, date, and style. A lifted arm in a Renaissance picture reminded him of an ancient sculpture; a goddess on a coin seemed to reappear in a newspaper image; a festival costume, an astrological diagram, and a political poster could all carry old gestures into new lives. Late in life, he pinned hundreds of reproductions onto black cloth panels and kept moving them around. There were few captions, because the point was not to give the viewer one neat explanation. The point was to let images think next to each other, so hidden paths of memory, fear, desire, ritual, and power could become visible. This person was Aby Warburg, whose unfinished Mnemosyne Atlas shaped later visual culture studies through image memory, cultural history, and interdisciplinary art history.",
    storyBodyZh: "他不满足于只用作者、年代和风格来解释一幅画。文艺复兴图像里抬起的手臂，会让他想起古代雕像；硬币上的女神，好像又出现在报纸图片里；节庆服装、占星图、政治海报，可能都把古老的姿势带进新的生活。晚年，他把几百张复制图钉在黑布板上，一次次挪动位置。图谱上几乎没有说明文字，因为重点不是给观众一个整齐答案，而是让图像彼此靠近，让记忆、恐惧、欲望、仪式和权力的暗线浮现出来。未进一步细分的艺术与人文正像这种工作：它不急着把意义分进固定盒子，而是先问图像、文本、物件和人的经验如何互相照亮。这个人叫 Aby Warburg，他创作未完成的 Mnemosyne Atlas，并以图像记忆、文化史和跨学科艺术史影响了后来的视觉文化研究。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是艺术与人文追问图像、文本、仪式、物件和记忆如何生产意义，尤其最核心的问题之一：那些尚未能被单一学科收拢的意义关系。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。",
    support: "Aby Warburg's unfinished Mnemosyne Atlas, begun in the late 1920s, arranged hundreds of images on black panels to study visual memory, classical survivals, emotion, and cultural transmission.",
    supportZh: "Aby Warburg 在 1920 年代后期开始制作未完成的 Mnemosyne Atlas，把大量图像钉在黑布板上，研究视觉记忆、古典传统的延续、情感姿势与文化传递。",
    knowledgePoint: "Arts and humanities ask how images, texts, rituals, objects, and memory produce meaning before those meanings settle into a single discipline.",
    knowledgePointZh: "艺术与人文追问图像、文本、仪式、物件和记忆如何生产意义，尤其关注那些尚未能被单一学科收拢的意义关系。",
    reflectionQuestion: "What image from today's life might secretly carry an older human gesture inside it?",
    reflectionQuestionZh: "今天生活里哪一张图像，可能悄悄带着更古老的人类姿势？",
    tags: ["image memory", "interpretation", "humanities"],
    tagsZh: ["图像记忆", "解释", "人文"],
  },
  {
    id: "030-neighbor-notice-board",
    categoryCode: "03",
    groupCode: "030",
    groupTitle: "Social sciences, journalism and information not further defined",
    groupTitleZh: "未进一步细分的社会科学、新闻与信息",
    fieldCodes: ["0300"],
    fieldTitlesZh: {
      "0300": "未进一步细分的社会科学、新闻与信息",
    },
    image: "/assets/stories/030-neighbor-notice-board.png",
    imageAlt: "Neighbors in an apartment lobby discussing a shared notice board and group messages.",
    imageAltZh: "邻居们在公寓大厅讨论公告板和群消息。",
    title: "The notice board problem",
    titleZh: "公告板上的问题",
    summary: "A missing package complaint turned into a small map of incentives, information, and community trust.",
    summaryZh: "一次包裹丢失的抱怨，慢慢变成了一张关于动机、信息和社区信任的小地图。",
    scene: "The apartment group chat had been arguing all morning. Someone's package was missing, another neighbor blamed delivery drivers, and the building manager posted a new notice that nobody seemed to read.",
    sceneZh: "公寓群聊吵了一上午。有人说包裹不见了，有人怪快递员，楼管贴了新公告，却好像没人真正读到。",
    storyBody: "When the neighbors finally met in the lobby, the problem looked different from every side. Older residents did not check the group chat often. New tenants did not know the side entrance was used for deliveries. Drivers left parcels where the camera could not see them because the lobby table was always full. The manager had information, but the notice board was placed where people only passed by in a hurry. They did not solve everything that day. They moved the board, simplified the instructions, created a shared shelf, and agreed on who would call the delivery company. The missing package mattered, but the deeper issue was how a small community moved information and responsibility.",
    storyBodyZh: "邻居们终于在大厅见面时，问题从每个人那里看都不一样。年纪大的住户不常看群聊，新搬来的人不知道侧门也会收快递，快递员因为大厅桌子总是堆满东西，只好把包裹放在摄像头拍不到的位置。楼管有信息，但公告板贴在大家只会匆匆路过的地方。那天他们没有解决所有问题，但把公告板移了位置，简化说明，设了一个共享架子，并约定谁去联系快递公司。丢失的包裹很重要，但更深的问题是：一个小社区如何流动信息和责任。这个小小大厅提醒学生，社会问题常常不是谁对谁错，而是信息、空间和责任有没有被安排得足够清楚。",
    knowledgePoint: "Social sciences, journalism, and information study how people behave in context, how information travels, and how shared realities are formed.",
    knowledgePointZh: "社会科学、新闻与信息研究人在具体语境中如何行动，信息如何传播，以及共同现实如何被形成。",
    reflectionQuestion: "When a group conflict looks like one person's mistake, what information channels or hidden incentives might be shaping it?",
    reflectionQuestionZh: "当一个群体冲突看起来像某个人的错误时，背后可能有哪些信息渠道或隐藏动机在塑造它？",
    tags: ["community", "information", "social context"],
    tagsZh: ["社区", "信息", "社会语境"],
  },
  {
    id: "040-kitchen-repair-budget",
    categoryCode: "04",
    groupCode: "040",
    groupTitle: "Business, administration and law not further defined",
    groupTitleZh: "未进一步细分的商业、管理与法律",
    fieldCodes: ["0400"],
    fieldTitlesZh: {
      "0400": "未进一步细分的商业、管理与法律",
    },
    image: "/assets/stories/040-kitchen-repair-budget.png",
    imageAlt: "Housemates at a kitchen table comparing repair costs and responsibilities for a broken washing machine.",
    imageAltZh: "合租室友在厨房桌边比较坏掉洗衣机的维修费用和责任分配。",
    title: "The washing machine decision",
    titleZh: "洗衣机维修决定",
    summary: "A broken appliance became a small business case about cost, risk, rules, and responsibility.",
    summaryZh: "一台坏掉的洗衣机，变成了关于成本、风险、规则和责任的小型商业案例。",
    scene: "The washing machine stopped mid-cycle on Sunday night. Four housemates stood around wet laundry, each hoping the solution would be cheap, fair, and quick.",
    sceneZh: "周日晚上，洗衣机洗到一半停了。四个室友围着一盆湿衣服，都希望解决方案便宜、公平、而且快。",
    storyBody: "They first argued from feelings. Then Noura opened a notebook. Repair was cheaper today, but might fail again. Replacement cost more, but came with a warranty. The landlord's agreement covered some parts, but not misuse. Everyone used the machine differently, and nobody had tracked maintenance. The decision changed when they separated questions: who is responsible, what is the real cost, what risk can they accept, and what rule should exist next time? They chose repair, created a small shared maintenance fund, and wrote down a clearer household rule.",
    storyBodyZh: "他们一开始凭感觉争论。后来 Noura 打开笔记本。维修今天更便宜，但可能很快再坏；换新更贵，却有保修。租房协议覆盖一部分零件，但不覆盖不当使用。每个人使用洗衣机的方式不同，也没人记录过维护。真正改变讨论的是把问题拆开：谁负责、真实成本是多少、能接受什么风险、下次应该有什么规则。最后他们选择维修，建立一个小小的共享维护金，并写下一条更清楚的住户规则。这也是商业、管理与法律在生活里出现的方式：不是先背概念，而是在共同承担后果之前，把成本、规则和责任摆到桌面上。",
    knowledgePoint: "Business, administration, and law make decisions visible: resources, incentives, contracts, duties, and trade-offs become things people can compare.",
    knowledgePointZh: "商业、管理与法律让决策变得可见：资源、激励、合同、义务和取舍，都需要被摆出来比较。",
    reflectionQuestion: "In a shared decision, which part is money, which part is risk, and which part is fairness?",
    reflectionQuestionZh: "在一次共同决策里，哪一部分是钱，哪一部分是风险，哪一部分其实是公平？",
    tags: ["cost", "responsibility", "trade-off"],
    tagsZh: ["成本", "责任", "取舍"],
  },
  {
    id: "050-balcony-plant-observation",
    categoryCode: "05",
    groupCode: "050",
    groupTitle: "Natural sciences, mathematics and statistics not further defined",
    groupTitleZh: "未进一步细分的自然科学、数学与统计",
    fieldCodes: ["0500"],
    fieldTitlesZh: {
      "0500": "未进一步细分的自然科学、数学与统计",
    },
    image: "/assets/stories/050-balcony-plant-observation.png",
    imageAlt: "A person observing balcony basil plants with a notebook, measuring cup, and sunlight.",
    imageAltZh: "一个人在阳台用笔记本、量杯和日照观察罗勒盆栽。",
    title: "Why the basil kept wilting",
    titleZh: "罗勒为什么总是蔫",
    summary: "A balcony plant problem became a small experiment in evidence, variables, and uncertainty.",
    summaryZh: "一个阳台植物问题，变成了关于证据、变量和不确定性的小实验。",
    scene: "Every week, Aria bought a new basil plant. Every week, it drooped by Friday. She blamed herself, then the plant shop, then the weather, until a friend asked one simple question: what have you actually measured?",
    sceneZh: "Aria 每周买一盆新罗勒。每周到周五，它就开始发蔫。她先怪自己，再怪花店，又怪天气，直到朋友问了一个简单问题：你到底记录过什么？",
    storyBody: "For ten days, Aria wrote down sunlight hours, watering amounts, pot weight, window direction, and whether the leaves looked soft in the morning or evening. The answer was not one dramatic cause. The balcony was sunny in the morning but windy in the afternoon; the small pot dried fast; her extra watering sometimes drowned the roots. She changed one thing at a time: a larger pot, steadier water, a different corner. The basil improved slowly. More important, Aria stopped guessing wildly. She learned to ask what counted as evidence and how many possible causes could be tested.",
    storyBodyZh: "接下来的十天，Aria 记录日照时长、浇水量、花盆重量、窗户朝向，以及叶子是在早上还是晚上变软。答案不是某一个戏剧性的原因。阳台早上有阳光，下午风很大；小盆很快干掉；她额外浇水时又可能让根部缺氧。她一次只改一个条件：换大一点的盆、稳定水量、换一个角落。罗勒慢慢好起来。更重要的是，Aria 不再乱猜。她学会问：什么算证据？有多少可能原因可以被测试？这个阳台实验不大，却很像科学训练的开始：先停止猜测，再让记录、比较和一次只改一个条件来帮助判断。",
    knowledgePoint: "Natural sciences, mathematics, and statistics turn curiosity into models: observe, measure, compare, and stay honest about uncertainty.",
    knowledgePointZh: "自然科学、数学与统计把好奇心变成模型：观察、测量、比较，并诚实面对不确定性。",
    reflectionQuestion: "What everyday problem would look different if you recorded one small variable for a week?",
    reflectionQuestionZh: "如果你连续一周记录一个小变量，哪个日常问题会变得不一样？",
    tags: ["evidence", "variables", "observation"],
    tagsZh: ["证据", "变量", "观察"],
  },
  {
    id: "061-phone-backup-help",
    categoryCode: "06",
    groupCode: "061",
    groupTitle: "Information and Communication Technologies (ICTs)",
    groupTitleZh: "信息与通信技术",
    fieldCodes: ["0610"],
    fieldTitlesZh: {
      "0610": "未进一步细分的信息与通信技术",
    },
    image: "/assets/stories/061-phone-backup-help.png",
    imageAlt: "A younger adult helping an older neighbor organize phone settings, backups, and passwords before a trip.",
    imageAltZh: "年轻人帮助年长邻居在出行前整理手机设置、备份和密码。",
    title: "The phone before the trip",
    titleZh: "出发前的手机",
    summary: "A neighbor's travel worry revealed how systems, accounts, devices, and trust fit together.",
    summaryZh: "邻居出行前的一点担心，让系统、账户、设备和信任之间的关系显露出来。",
    scene: "Before flying to visit her sister, Mrs. Chen worried that her phone would stop working abroad. She had photos, tickets, contacts, passwords, and one confusing message about storage.",
    sceneZh: "去看妹妹之前，陈阿姨担心手机到了国外不能用。里面有照片、机票、联系人、密码，还有一条让人看不懂的存储提醒。",
    storyBody: "Her neighbor Jay did not start by pressing random settings. He asked what needed to be safe, what needed to be reachable, and what would happen if the phone was lost. Together they checked backups, wrote down recovery steps, updated contact information, removed unused apps, and tested whether tickets could open offline. Mrs. Chen did not need to become a programmer. She needed a working mental model: the phone was not one object, but a bundle of accounts, networks, files, permissions, and recovery paths.",
    storyBodyZh: "邻居 Jay 没有一上来就乱点设置。他先问：什么必须安全？什么必须随时拿到？如果手机丢了会发生什么？他们一起检查备份，写下找回步骤，更新联系人，删除不用的应用，并测试机票离线时能不能打开。陈阿姨不需要变成程序员。她需要一个能用的心智模型：手机不是一个单一物件，而是一组账户、网络、文件、权限和恢复路径。这样的帮助让 ICT 从抽象设备回到生活：真正重要的是人在丢失、离线、误删和被锁住时，是否仍有路可以回来。",
    knowledgePoint: "ICT is about systems people use every day: tools, data, networks, software, security, and the invisible assumptions that connect them.",
    knowledgePointZh: "信息与通信技术关心人每天使用的系统：工具、数据、网络、软件、安全，以及把它们连接起来的隐性假设。",
    reflectionQuestion: "Which digital tool do you use as if it were simple, even though it depends on several hidden systems?",
    reflectionQuestionZh: "你每天使用的哪一个数字工具，看起来很简单，其实依赖好几个看不见的系统？",
    tags: ["digital systems", "backup", "security"],
    tagsZh: ["数字系统", "备份", "安全"],
  },
  {
    id: "070-wobbly-shelf-repair",
    categoryCode: "07",
    groupCode: "070",
    groupTitle: "Engineering, manufacturing and construction not further defined",
    groupTitleZh: "未进一步细分的工程、制造与建筑",
    fieldCodes: ["0700"],
    fieldTitlesZh: {
      "0700": "未进一步细分的工程、制造与建筑",
    },
    image: "/assets/stories/070-wobbly-shelf-repair.png",
    imageAlt: "Two adults measuring and securing a leaning bookshelf in a living room.",
    imageAltZh: "两位成年人在客厅测量并固定一组倾斜的书架。",
    title: "The shelf that leaned",
    titleZh: "歪掉的书架",
    summary: "A leaning shelf turned into a lesson about load, constraint, materials, and safe execution.",
    summaryZh: "一个歪掉的书架，变成了关于载荷、约束、材料和安全执行的小课。",
    scene: "The bookshelf had leaned for months, but everyone only noticed when the top shelf began to pull away from the wall. A stack of books, a plant, and one loose bracket had turned decoration into a small engineering problem.",
    sceneZh: "书架歪了好几个月，直到最上层开始离墙，大家才真正注意到。几摞书、一盆植物、一个松动的支架，让一个装饰问题变成了小小的工程问题。",
    storyBody: "Mara wanted to tighten every screw and call it done. Eli stopped her and checked the floor, wall, bracket angle, and weight distribution. The shelf was not failing in one place. The floor was slightly uneven, the heaviest books sat high, and the wall anchor had never matched the wall material. They removed weight, leveled the base, chose a better anchor, and tested the shelf before putting books back. The repair took longer than expected because the real task was not to make it look straight for one minute. It was to make the forces stay manageable after everyone forgot about it again.",
    storyBodyZh: "Mara 想把所有螺丝拧紧就结束。Eli 先停下来，检查地面、墙体、支架角度和重量分布。书架不是某一个地方坏了：地面有点不平，最重的书放得太高，墙锚也不适合这面墙。他们先卸重，再调平底部，换合适的固定件，测试之后才把书放回去。维修比想象中更久，因为真正的任务不是让它直一分钟，而是让受力在大家再次忘记它之后仍然可控。这个小维修让工程变得可见：不是把表面弄正，而是理解材料、受力、固定方式和未来反复使用时的风险。",
    knowledgePoint: "Engineering, manufacturing, and construction ask how ideas survive contact with materials, constraints, safety, and repeated use.",
    knowledgePointZh: "工程、制造与建筑关心想法如何经受材料、约束、安全和反复使用的考验。",
    reflectionQuestion: "Where in your daily life do you see a small design choice carrying more load than people realize?",
    reflectionQuestionZh: "你的日常生活里，哪里有一个小设计，其实承受着比人们意识到更多的负荷？",
    tags: ["constraints", "materials", "safety"],
    tagsZh: ["约束", "材料", "安全"],
  },
  {
    id: "080-community-garden-seedlings",
    categoryCode: "08",
    groupCode: "080",
    groupTitle: "Agriculture, forestry, fisheries and veterinary not further defined",
    groupTitleZh: "未进一步细分的农业、林业、渔业与兽医",
    fieldCodes: ["0800"],
    fieldTitlesZh: {
      "0800": "未进一步细分的农业、林业、渔业与兽医",
    },
    image: "/assets/stories/080-community-garden-seedlings.png",
    imageAlt: "Two neighbors checking young seedlings in a community garden after a cold night.",
    imageAltZh: "两位邻居在冷夜之后查看社区花园里的幼苗。",
    title: "The seedlings after the cold night",
    titleZh: "冷夜后的幼苗",
    summary: "A frosty morning showed why living systems require patience, timing, and field conditions.",
    summaryZh: "一个有霜的早晨，让人看见生命系统为什么需要耐心、时机和现场条件。",
    scene: "The community garden looked silver in the morning frost. Some seedlings stood upright; others had collapsed. Nobody had planned for the cold night to arrive after such a warm week.",
    sceneZh: "清晨的社区花园结着一层银白的霜。有些幼苗还直立着，有些已经伏倒。没人想到，在那样温暖的一周之后，会突然来这么冷的一晚。",
    storyBody: "Jon wanted to replant everything immediately. Asha asked him to wait and look closely. Which beds were sheltered by the fence? Which soil stayed warmer? Which covers worked, and which trapped too much moisture? They marked the damaged rows, left some plants to recover, moved the tender seedlings, and changed next week's planting plan. The garden did not obey the calendar printed on a seed packet. It answered to soil, temperature, water, exposure, pests, and care over time.",
    storyBodyZh: "Jon 想立刻全部重种。Asha 让他先等一等，仔细看。哪些畦被篱笆挡住了风？哪些土更保温？哪些覆盖物有用，哪些反而积了太多水汽？他们标记受损的行，留下部分植物观察恢复，把更脆弱的幼苗移走，并调整下周的种植计划。花园并不会完全服从种子包装上的日历。它回应的是土壤、温度、水分、暴露程度、病虫害，以及持续照料。花园教人的不是急着控制生命，而是先看现场条件怎样说话，再决定哪些行动能保护接下来的生长。",
    knowledgePoint: "Agriculture, forestry, fisheries, and veterinary fields work with living systems, where timing, ecology, care, and local conditions matter.",
    knowledgePointZh: "农业、林业、渔业与兽医面对的是生命系统。时机、生态、照料和现场条件，都会影响结果。",
    reflectionQuestion: "What living system around you changes too slowly or too subtly to be managed by impatience?",
    reflectionQuestionZh: "你身边哪一个生命系统变化太慢或太细微，不能靠急躁来管理？",
    tags: ["ecology", "care", "field conditions"],
    tagsZh: ["生态", "照料", "现场条件"],
  },
  {
    id: "090-medicine-schedule-care",
    categoryCode: "09",
    groupCode: "090",
    groupTitle: "Health and welfare not further defined",
    groupTitleZh: "未进一步细分的健康与福利",
    fieldCodes: ["0900"],
    fieldTitlesZh: {
      "0900": "未进一步细分的健康与福利",
    },
    image: "/assets/stories/090-medicine-schedule-care.png",
    imageAlt: "A caregiver and an older adult organizing a weekly medicine schedule at a kitchen table.",
    imageAltZh: "照护者和年长者在厨房桌边整理一周的服药安排。",
    title: "The medicine note on the fridge",
    titleZh: "冰箱上的服药便条",
    summary: "A household medicine routine revealed how care balances risk, dignity, and human limits.",
    summaryZh: "一个家庭服药安排，让人看见照护如何在风险、尊严和人的边界之间平衡。",
    scene: "After her father missed a dose twice in one week, Elena wanted to cover the fridge with reminders. Her father pushed the notes aside and said he did not want his kitchen to look like a clinic.",
    sceneZh: "父亲一周内两次忘记服药后，Elena 想把冰箱贴满提醒。父亲把便条推到一边，说他不想让自己的厨房看起来像诊所。",
    storyBody: "They sat down with the pill organizer, a glass of water, and the appointment list. Elena first heard only risk. Her father heard loss of independence. They changed the system together: fewer notes, clearer times, one shared check-in, and a place for questions after side effects or confusion. The goal was not to control every minute of his day. It was to reduce danger while preserving the feeling that his life was still his own.",
    storyBodyZh: "他们坐下来，面前是药盒、一杯水和预约清单。Elena 一开始只听见风险，父亲听见的却是独立感正在被拿走。最后他们一起改系统：少一点便条，更清楚的时间，一个共同确认点，以及一个在出现副作用或疑惑时可以提问的位置。目标不是控制他一天中的每一分钟，而是在降低危险的同时，保留“生活仍然属于自己”的感觉。这个安排最难的地方，不是多贴几张提醒，而是让安全和尊严同时留下位置。",
    knowledgePoint: "Health and welfare fields deal with risk, care, bodies, vulnerability, and the ethical boundary between helping and taking over.",
    knowledgePointZh: "健康与福利处理风险、照护、身体、脆弱性，以及帮助和接管之间的伦理边界。",
    reflectionQuestion: "When care is necessary, how can a system protect someone without making them feel smaller?",
    reflectionQuestionZh: "当照护是必要的，怎样的系统既能保护一个人，又不让他觉得自己被缩小了？",
    tags: ["care", "risk", "dignity"],
    tagsZh: ["照护", "风险", "尊严"],
  },
  {
    id: "100-rainy-event-service-desk",
    categoryCode: "10",
    groupCode: "100",
    groupTitle: "Services not further defined",
    groupTitleZh: "未进一步细分的服务",
    fieldCodes: ["1000"],
    fieldTitlesZh: {
      "1000": "未进一步细分的服务",
    },
    image: "/assets/stories/100-rainy-event-service-desk.png",
    imageAlt: "Event staff coordinating check-in at a community event entrance on a rainy day.",
    imageAltZh: "雨天里，活动工作人员在社区活动入口协调签到。",
    title: "The rainy check-in table",
    titleZh: "雨天的签到桌",
    summary: "A rainy event entrance showed that service is the design of experience under real conditions.",
    summaryZh: "一个雨天活动入口，让人看见服务是在真实条件下设计体验。",
    scene: "The community event opened just as heavy rain began. Umbrellas crowded the doorway, the sign-in sheet became damp, and the line bent around the coat rack.",
    sceneZh: "社区活动刚开始，大雨就落下来。雨伞挤在门口，签到纸变潮，队伍绕到了衣架旁边。",
    storyBody: "At first, the volunteers tried to work faster. Then Sam noticed that speed was not the only issue. Wet coats needed a place to go. People could not hear instructions near the door. The elderly guests needed seats before checking in. The staff split the line, moved the cups away from the paperwork, created a dry handoff point, and sent one volunteer to greet people before they reached the desk. The service improved because they stopped seeing guests as a queue and started seeing the whole path of arrival.",
    storyBodyZh: "志愿者一开始只是努力加快速度。后来 Sam 发现，问题不只是慢。湿外套需要放的地方，门口太吵听不清说明，年长来宾需要先坐下再签到。工作人员把队伍分开，把杯子从文件旁移走，设了一个干燥交接点，并让一个志愿者在客人到桌前之前先迎接。服务变好，是因为他们不再只把客人看成一条队伍，而是看见了完整的到达路径。这样的服务设计从来不只发生在柜台后面；它发生在雨水、噪声、队伍、身体和人抵达现场的整条路径里。",
    knowledgePoint: "Services focus on coordination, experience, timing, and the practical reality of helping people in the moment.",
    knowledgePointZh: "服务关注协调、体验、时机，以及在具体时刻帮助人的现实条件。",
    reflectionQuestion: "In a familiar service experience, where does the real difficulty happen before anyone reaches the counter?",
    reflectionQuestionZh: "在一个熟悉的服务体验里，真正的困难是不是早在抵达柜台之前就已经发生了？",
    tags: ["experience", "coordination", "service flow"],
    tagsZh: ["体验", "协调", "服务流程"],
  },
];

const sublensStoryDrafts = [
  {
    id: "001-birkbeck-evening-lecture",
    categoryCode: "00",
    groupCode: "001",
    groupTitleZh: "基础课程与资格",
    title: "The mechanics after work",
    titleZh: "下工后的力学课",
    summary: "A free evening lecture for working men showed how basic programmes turn curiosity into recognized access.",
    summaryZh: "一堂给工人开的免费晚课，让基础课程从“想学”变成了可以进入的公共通道。",
    scene: "Around 1799 in Glasgow, a teacher noticed that the men who handled tools all day were often kept outside the rooms where science was explained.",
    sceneZh: "1799 年前后的格拉斯哥，一位教师注意到：白天真正使用工具的人，常常被挡在讲解科学的房间外面。",
    storyBody: "He had trained in medicine and taught natural philosophy, but the factory floor made him uneasy in a productive way. Skilled mechanics could repair machines, judge materials, and feel force through their hands, yet many had no affordable path into the scientific language that described the work they already touched. So he began offering lectures after work, using apparatus, demonstrations, and plain explanations of heat, motion, chemistry, and machinery. The point was not to turn every worker into a university scholar overnight. It was to build a first rung: a place where practical people could enter formal knowledge without pretending they were already prepared. From that rung grew mechanics' institutes, evening classes, libraries, and a larger idea that basic qualifications should open doors instead of guarding them. This person was George Birkbeck, whose lectures helped inspire the mechanics' institute movement and the later institution known as Birkbeck, University of London.",
    storyBodyZh: "他受过医学训练，也教自然哲学，但工厂现场让他产生了一种不安。那些熟练工人能修机器、判断材料、用手感受力，却常常没有一条负担得起的路，去学习描述这些经验的科学语言。于是他把课放到下工之后，用仪器、演示和朴素解释讲热、运动、化学和机械。重点不是让每个工人一夜之间变成大学学者，而是搭出第一阶台阶：让有实践经验的人，不必假装已经准备好，也能进入正式知识。后来，从这一级台阶长出了 mechanics' institutes、晚间课程、图书馆，以及一种更大的观念：基础资格不应该只是守门，也应该开门。这个人叫 George Birkbeck，他的工人讲座推动了 mechanics' institute 运动，也成为后来的 Birkbeck, University of London 的重要源头。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是基础课程与资格需要认真追问的问题：基础课程与资格搭建的是实践准备与正式学习之间的第一座被承认的桥。所以它不只是历史人物的小传，也是一种提醒：基础能力常常在正式学科名称出现以前就开始生长。",
    support: "George Birkbeck's lectures at the Andersonian Institution in Glasgow are widely linked to the mechanics' institute movement, which offered technical and scientific education to working men through lectures, libraries, and practical apparatus.",
    supportZh: "George Birkbeck 在格拉斯哥 Andersonian Institution 的讲座通常被视为 mechanics' institute 运动的重要源头。这类机构通过讲座、图书馆和实验器具，为工人提供技术与科学教育。",
    knowledgePoint: "Basic programmes and qualifications create the first recognized bridge between practical readiness and formal learning.",
    knowledgePointZh: "基础课程与资格搭建的是实践准备与正式学习之间的第一座被承认的桥。",
    reflectionQuestion: "Who around you already has real experience, but still needs a first rung into formal knowledge?",
    reflectionQuestionZh: "你身边谁已经有真实经验，却仍然需要进入正式知识的第一阶台阶？",
    tags: ["mechanics institute", "basic access", "adult learning"],
    tagsZh: ["机械学院", "基础通道", "成人学习"],
  },
  {
    id: "002-braille-raised-dots",
    categoryCode: "00",
    groupCode: "002",
    groupTitleZh: "读写与算术",
    title: "The dots under a fingertip",
    titleZh: "指尖下的六个凸点",
    summary: "A boy in a blind school turned reading from a slow performance into something a hand could do privately and quickly.",
    summaryZh: "一所盲校里的少年，把阅读从缓慢的展示，变成了指尖可以独立完成的行动。",
    scene: "In a small French village, a child injured his eye in his father's harness workshop. By the time he was sent to school in Paris, books had become heavy objects he could not truly use like other children.",
    sceneZh: "法国一个小村庄里，一个孩子在父亲的马具作坊里伤到眼睛。等他被送到巴黎读书时，书对他来说已经变成了沉重却不够自由的物件。",
    storyBody: "The school had raised-letter books, but they were slow, bulky, and gave blind students very little chance to write back. Then a soldier's night-writing code arrived: dots pressed into paper so messages could be read by touch in darkness. The boy tried it, but the system was too large for one fingertip and too clumsy for everyday reading. He kept reducing, testing, and rearranging until a tiny cell of six raised dots could hold letters, punctuation, numbers, and later music. The discovery was not only technical. It changed the dignity of literacy: a person could read silently, write privately, review a line again, and enter knowledge without waiting for someone else's voice. This person was Louis Braille, who developed the braille reading and writing system that became a foundation of literacy for blind and visually impaired people around the world.",
    storyBodyZh: "学校里有凸字书，但它们厚重、缓慢，也很少给盲学生真正“写回去”的机会。后来，一个士兵发明的夜间书写法传到学校：把点压进纸里，让人能在黑暗中摸读信息。这个少年试了试，却发现那套点太大，一个指尖很难一次读完，也不适合日常阅读。于是他不断缩小、测试、重新排列，直到六个凸点组成的小格子可以表达字母、标点、数字，后来还可以表达音乐。这个发现不只是技术，它改变了读写的尊严：一个人可以安静地读、私下地写、反复回看一行字，不必永远等待别人的声音带自己进入知识。这个人叫 Louis Braille，他发展出的 braille 读写系统，成为全球盲人和视障者基础读写能力的重要支柱。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是读写与算术需要认真追问的问题：读写与算术不只是学校基础，它们让人独立进入信息、符号、数量、记忆和社会参与。这让今天的学习者回到一个很实际的问题：在选择具体道路之前，先怎样练习提问、表达和与别人一起学习。",
    support: "Louis Braille was blinded after a childhood accident and later studied at the Royal Institute for Blind Youth in Paris. Inspired by Charles Barbier's raised-dot night writing, he developed a compact six-dot tactile system while still a student.",
    supportZh: "Louis Braille 幼年因意外失明，后来进入巴黎 Royal Institute for Blind Youth 学习。他受到 Charles Barbier 凸点夜间书写法启发，在学生时期发展出更紧凑的六点触读系统。",
    knowledgePoint: "Literacy and numeracy are not only school basics; they are ways of gaining independent access to information, symbols, counting, memory, and participation.",
    knowledgePointZh: "读写与算术不只是学校基础，它们让人独立进入信息、符号、数量、记忆和社会参与。",
    reflectionQuestion: "When a tool lets someone read without asking permission, what kind of freedom has quietly appeared?",
    reflectionQuestionZh: "当一种工具让人不必请求别人就能阅读时，哪一种自由已经悄悄出现了？",
    tags: ["literacy", "accessibility", "braille"],
    tagsZh: ["读写", "可及性", "盲文"],
  },
  {
    id: "003-carnegie-speaking-class",
    categoryCode: "00",
    groupCode: "003",
    groupTitleZh: "个人技能与发展",
    title: "The salesman who feared the room",
    titleZh: "害怕站到众人面前的推销员",
    summary: "A public-speaking class showed that personal development is often learned in the gap between fear and practice.",
    summaryZh: "一门演讲课说明：个人发展常常发生在恐惧和练习之间的那段距离里。",
    scene: "In early twentieth-century New York, a young man who had grown up far from polished boardrooms found that many adults were not defeated by lack of knowledge, but by the moment they had to speak.",
    sceneZh: "20 世纪初的纽约，一个从乡村背景走出来的年轻人发现，很多成年人不是败在没有知识，而是败在必须开口的那一刻。",
    storyBody: "He had tried selling, acting, and teaching, and he knew embarrassment from the inside. In evening classes, he watched clerks, salesmen, engineers, and managers arrive after work with the same hidden problem: they had something to say, but their bodies treated a roomful of people like danger. Instead of giving them elegant theories first, he made them stand up, tell a small true story, listen to one another, remember names, praise specifically, and try again next week. Gradually the subject widened. Speaking was not just voice; it was attention, confidence, empathy, memory, and the ability to make another person feel seen. Personal skills became trainable not because personality could be manufactured, but because courage could be practiced in small public acts. This person was Dale Carnegie, whose public-speaking and human-relations courses led to How to Win Friends and Influence People and shaped modern personal development training.",
    storyBodyZh: "他做过销售，试过表演，也教过课，所以很懂那种从身体里冒出来的尴尬。晚间课程里，他看见店员、推销员、工程师和经理下班后赶来，身上带着同一种隐秘难题：他们有话可说，可一站到众人面前，身体就像遇到危险。于是他没有先讲漂亮理论，而是让他们站起来，讲一个真实小故事，倾听别人，记住名字，具体地赞美，再下周继续试。慢慢地，这门课变宽了。表达不只是声音，它还包括注意力、信心、同理心、记忆，以及让另一个人感觉自己被看见的能力。个人技能之所以可以被训练，不是因为人格可以被制造，而是因为勇气可以在一个个小小的公开行动里练习。这个人叫 Dale Carnegie，他的公众演讲和人际关系课程发展出《How to Win Friends and Influence People》，也影响了现代个人发展训练。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是个人技能与发展最核心的问题之一：自我管理、沟通、信心、倾听、适应，以及人在社会场景中的可练习能力。所以它不只是历史人物的小传，也是一种提醒：基础能力常常在正式学科名称出现以前就开始生长。",
    support: "Dale Carnegie began teaching business, public-speaking, and human-relations courses in New York in 1912. His 1936 book How to Win Friends and Influence People grew out of those courses and became a major text in self-development and communication training.",
    supportZh: "Dale Carnegie 1912 年开始在纽约教授商业、公众演讲和人际关系课程。1936 年出版的《How to Win Friends and Influence People》源自这些课程，后来成为自我发展与沟通训练的重要文本。",
    knowledgePoint: "Personal skills and development focus on self-management, communication, confidence, listening, adaptation, and social practice.",
    knowledgePointZh: "个人技能与发展关注自我管理、沟通、信心、倾听、适应，以及人在社会场景中的可练习能力。",
    reflectionQuestion: "Which ability in your life would change fastest if it were practiced publicly but gently every week?",
    reflectionQuestionZh: "你生活里的哪一种能力，如果每周被温和地公开练习，会最快发生变化？",
    tags: ["communication", "confidence", "personal development"],
    tagsZh: ["沟通", "信心", "个人发展"],
  },
  {
    id: "009-brownsea-scout-camp",
    categoryCode: "00",
    groupCode: "009",
    groupTitleZh: "未另分类的通用课程与资格",
    title: "The island with no school bell",
    titleZh: "没有上课铃的小岛",
    summary: "An experimental camp showed why some general programmes matter precisely because they do not fit one classroom label.",
    summaryZh: "一次实验营地说明：有些通用学习之所以重要，正因为它不属于单一课堂标签。",
    scene: "In August 1907, boys from different social backgrounds arrived on Brownsea Island to camp, cook, observe, signal, play games, and learn in patrols.",
    sceneZh: "1907 年 8 月，来自不同社会背景的男孩来到 Brownsea Island，露营、做饭、观察、打信号、做游戏，并以小队方式学习。",
    storyBody: "The organizer had been a soldier, but the camp was not simply military training. He had seen boys take responsibility as messengers, helpers, and observers, and he wondered whether ordinary young people could learn courage, service, outdoor judgment, teamwork, and civic responsibility through practice rather than lectures. The days mixed skills that no tidy timetable could easily separate: knots, tracking, first aid, woodcraft, storytelling, discipline, games, and care for the group. Some parts now feel historically dated and need thoughtful critique, but the deeper educational form remains recognizable: a mixed programme where character, practical skills, community, and self-reliance are learned together. This person was Robert Baden-Powell, whose Brownsea Island experiment helped launch the Scout movement and a large family of general youth programmes outside ordinary school categories.",
    storyBodyZh: "组织者曾是军人，但这次营地并不只是军事训练。他曾见过少年担任信使、助手和观察者，也开始想：普通年轻人能不能通过实践，而不是只听讲，学会勇气、服务、户外判断、团队合作和公民责任？营地每天混合着很难被整齐课表分开的内容：绳结、追踪、急救、野外技能、讲故事、纪律、游戏，以及对小队的照看。有些历史语境今天需要被审慎批判，但它留下的教育形式仍然清楚：一种混合型课程，把品格、实用技能、共同体和自立放在一起学习。这个人叫 Robert Baden-Powell，他在 Brownsea Island 的实验推动了 Scout movement，也开启了许多不属于普通学校分类的通用青少年课程。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的通使用的方法：用课程保留那些混合型学习形式，把实用技能、品格、进入能力和社会参与放在一起。这让今天的学习者回到一个很实际的问题：在选择具体道路之前，先怎样练习提问、表达和与别人一起学习。",
    support: "The 1907 Brownsea Island experimental camp tested ideas later published in Scouting for Boys. It involved boys from different backgrounds and activities such as camping, observation, woodcraft, lifesaving, and patrol organization.",
    supportZh: "1907 年 Brownsea Island 实验营地用于测试后来写入《Scouting for Boys》的想法。参与者来自不同背景，活动包括露营、观察、野外技能、救助和小队组织等。",
    knowledgePoint: "Not elsewhere classified generic programmes preserve mixed learning forms that combine practical skill, character, access, and social participation.",
    knowledgePointZh: "未另分类的通用课程保留那些混合型学习形式，把实用技能、品格、进入能力和社会参与放在一起。",
    reflectionQuestion: "Which important life skill becomes harder to learn when every lesson must belong to one neat subject?",
    reflectionQuestionZh: "当每一节课都必须属于一个整齐学科时，哪一种重要生活能力反而更难学习？",
    tags: ["mixed learning", "youth programme", "practical skills"],
    tagsZh: ["混合学习", "青少年课程", "实用技能"],
  },
  {
    id: "018-reggio-emilia-school",
    categoryCode: "01",
    groupCode: "018",
    groupTitleZh: "教育相关跨学科课程与资格",
    title: "The school rebuilt from broken streets",
    titleZh: "废墟旁边重新搭起的学校",
    summary: "In postwar Reggio Emilia, parents and an educator turned childcare into a community, art, language, and research project.",
    summaryZh: "战后的 Reggio Emilia，家长和一位教育者把儿童照护变成社区、艺术、语言和研究共同参与的项目。",
    scene: "After World War II, a group of parents near Reggio Emilia wanted a school before they had anything that looked like a complete school system.",
    sceneZh: "第二次世界大战后，Reggio Emilia 附近的一群家长想先给孩子建一所学校，哪怕他们还没有一个完整的学校系统。",
    storyBody: "The young educator had grown up around Reggio Emilia and studied pedagogy while war was changing the world around him. In 1945, he saw parents in a damaged village begin building a school for children, not as a neat government project but as a way to say that the future still belonged to them. What he found was not a finished method but a community trying to rebuild life around children. The school that slowly emerged did not separate learning into tidy boxes. Children drew, built, argued, listened, sculpted, measured, acted, and revisited their own ideas. Teachers documented the process, parents joined the conversation, and the classroom environment itself became part of the teaching. The point was not to add art to education as decoration. It was to admit that children think in many languages, and that education often needs several disciplines before it can hear them clearly. This person was Loris Malaguzzi, who helped develop the Reggio Emilia approach as an interdisciplinary educational experience built from community, art, documentation, and children's expression.",
    storyBodyZh: "那位年轻教育者在 Reggio Emilia 一带长大，战争期间仍在学习教育学。1945 年，他听说一个受战争破坏的村庄里，家长们正在为孩子建学校，就去看了看。那不是一个整齐的官方项目，更像是一群普通人用砖块和手艺告诉孩子：未来还没有被夺走。他看到的不是已经成型的方法，而是一个社区试着围绕孩子重新组织生活。后来慢慢长出来的学校，没有把学习切成整齐的小盒子。孩子们画画、搭建、争论、倾听、塑形、测量、表演，也一次次回到自己的想法。老师记录过程，家长参与讨论，教室环境本身也成了教学的一部分。重点不是把艺术加进教育当装饰，而是承认孩子用很多种语言思考，而教育常常需要好几个学科一起，才听得清这些语言。这个人叫 Loris Malaguzzi，他和家长们发展出 Reggio Emilia 教育取向，让跨学科、社区、艺术和儿童表达成为同一套学习经验。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是教育相关跨学科课程把不同学习目标要练习的连接能力：起来，让学习者一起使用知识，而不是把知识分开存放。所以它不只是教育史的一页，也是在提醒老师和学生：先观察学习怎样发生，再决定怎样介入。",
    support: "The Reggio Emilia approach developed after World War II through Loris Malaguzzi and parents around Reggio Emilia, Italy. It is known for project work, documentation, parent/community involvement, atelier practice, and the idea that children have many languages of expression.",
    supportZh: "Reggio Emilia approach 在第二次世界大战后由 Loris Malaguzzi 和意大利 Reggio Emilia 周边家长共同发展。它强调项目学习、过程记录、家长和社区参与、atelier 艺术工作室，以及儿童拥有多种表达语言。",
    knowledgePoint: "Inter-disciplinary education connects learning goals across subjects so learners can use knowledge together instead of storing it separately.",
    knowledgePointZh: "教育相关跨学科课程把不同学习目标连接起来，让学习者一起使用知识，而不是把知识分开存放。",
    reflectionQuestion: "If a child has more than one language for thinking, which disciplines need to stand nearby to hear it?",
    reflectionQuestionZh: "如果一个孩子不只用一种语言思考，哪些学科需要站在旁边，才能真正听见他？",
    tags: ["interdisciplinary", "Reggio Emilia", "documentation"],
    tagsZh: ["跨学科", "Reggio Emilia", "学习记录"],
  },
  {
    id: "021-bauhaus-workshop",
    categoryCode: "02",
    groupCode: "021",
    groupTitleZh: "艺术",
    title: "The workshop after the war",
    titleZh: "战后工坊里的新学校",
    summary: "A postwar school tried to put art, craft, design, and architecture back into one working room.",
    summaryZh: "一所战后学校试图把艺术、手工、设计和建筑重新放回同一个工作间。",
    scene: "After the First World War, a young architect in Weimar inherited a divided world: fine art on one side, craft and industry on the other.",
    sceneZh: "第一次世界大战后，魏玛的一位年轻建筑师面对的是一个分裂的世界：一边是纯艺术，一边是手工和工业。",
    storyBody: "He did not want students to treat beauty as a museum decoration or making as a lower kind of labor. In the new school, students began with materials, color, form, tools, and workshops before specializing. Painters, weavers, metalworkers, typographers, stage designers, and architects were asked to learn near one another, because modern life was no longer made by isolated arts. A chair, a poster, a lamp, a building, a stage costume, and a letterform all carried the same question: how should form serve life without losing imagination? The school struggled with politics, money, hierarchy, and its own exclusions, but it changed the vocabulary of modern art education by insisting that art could be thought through making. This person was Walter Gropius, who founded the Bauhaus in 1919 and helped make the unity of art, craft, design, and architecture a defining idea of modern arts education.",
    storyBodyZh: "他不希望学生把美只当作博物馆装饰，也不希望制作被看成较低级的劳动。在这所新学校里，学生先学习材料、色彩、形式、工具和工坊，再进入具体方向。画家、织物设计者、金属工、字体设计者、舞台设计者和建筑师被放到彼此附近学习，因为现代生活已经不再由孤立的艺术制造。一把椅子、一张海报、一盏灯、一栋建筑、一件舞台服装、一个字形，都在问同一个问题：形式怎样服务生活，同时不失去想象力？这所学校经历了政治、经费、等级和自身排斥问题，但它改变了现代艺术教育的词汇：艺术可以通过制作来思考。这个人叫 Walter Gropius，他于 1919 年创办 Bauhaus，让艺术、手工、设计和建筑的统一成为现代艺术教育的重要理念。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是艺术真正要追问的问题：形式、材料、图像、声音、动作、制作和感知如何塑造人的经验。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。",
    support: "The Bauhaus was founded by Walter Gropius in Weimar in 1919. It combined crafts and fine arts, worked through workshops, and became highly influential in modern design, architecture, and art education.",
    supportZh: "Bauhaus 于 1919 年由 Walter Gropius 在魏玛创办，强调工坊、手工与美术的结合，并深刻影响现代设计、建筑和艺术教育。",
    knowledgePoint: "Arts study form, material, image, sound, movement, making, and perception as ways of shaping human experience.",
    knowledgePointZh: "艺术研究形式、材料、图像、声音、动作、制作和感知如何塑造人的经验。",
    reflectionQuestion: "What object around you would change if its maker had to think like both an artist and a craftsperson?",
    reflectionQuestionZh: "你身边哪一个物件，如果制作者同时像艺术家和工匠一样思考，会变得不一样？",
    tags: ["Bauhaus", "workshop", "modern art"],
    tagsZh: ["Bauhaus", "工坊", "现代艺术"],
  },
  {
    id: "022-petrarch-mountain-letter",
    categoryCode: "02",
    groupCode: "022",
    groupTitleZh: "人文，不含语言",
    title: "The mountain climbed for a view",
    titleZh: "为了一眼风景爬上山的人",
    summary: "A famous mountain letter made the humanities feel like a turn toward memory, self-examination, and ancient voices.",
    summaryZh: "一封著名的登山信，让人文像是一次转身：面向记忆、自我审视和古代声音。",
    scene: "On 26 April 1336, a poet climbed Mont Ventoux with his brother, not because the road required it, but because he wanted to see from above.",
    sceneZh: "1336 年 4 月 26 日，一位诗人和兄弟登上 Mont Ventoux，不是因为路必须经过那里，而是因为他想从高处看一眼世界。",
    storyBody: "He had spent years loving old books, copying letters, searching for ancient authors, and feeling that the past was not dead if a living reader could answer it. On the mountain, the outside view became an inward disturbance. He opened a small book by Augustine and read words that seemed to accuse him of chasing the world while forgetting the soul. Whether every detail of the letter is literal history matters less than the kind of attention it staged: landscape, classical memory, Christian self-examination, friendship, ambition, and the feeling of being a person stretched between ages. Humanities begin in that tension. They ask how old texts, beliefs, histories, and inward questions still form a living person. This person was Francesco Petrarca, often called Petrarch, whose recovery of classical texts and self-reflective writing made him a central figure of Renaissance humanism.",
    storyBodyZh: "他多年热爱旧书，抄写书信，寻找古代作者，也越来越觉得：过去并没有死，只要仍有人带着自己的生命去回应它。登山时，外面的风景变成了内心的震动。他翻开随身带着的 Augustine 小书，读到的话仿佛在提醒他：人为何追逐世界，却忘了自己的灵魂。那封信的每个细节是否都完全符合现代历史标准，并不影响它呈现出的注意力：风景、古典记忆、基督教式自省、友谊、野心，以及一个人被拉在不同时代之间的感觉。人文就从这种张力里开始：古老文本、信念、历史和内心问题，怎样仍在塑造活着的人。这个人叫 Francesco Petrarca，通常被称为 Petrarch，他整理和重新发现古典文本，并以自我反思的写作成为文艺复兴人文主义的关键人物。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是人文真正要追问的问题：历史、宗教、哲学、伦理、文化记忆和内在生活，理解人如何继承并修订意义。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。",
    support: "Petrarch's letter about climbing Mont Ventoux, traditionally dated 26 April 1336, is often discussed as a symbolic text of Renaissance humanism, combining landscape, classical reading, Christian introspection, and self-conscious authorship.",
    supportZh: "Petrarch 关于登 Mont Ventoux 的书信传统上标为 1336 年 4 月 26 日，常被讨论为文艺复兴人文主义的象征性文本，连接风景、古典阅读、基督教自省和自我意识写作。",
    knowledgePoint: "Humanities examine history, religion, philosophy, ethics, cultural memory, and inner life as ways people inherit and revise meaning.",
    knowledgePointZh: "人文研究历史、宗教、哲学、伦理、文化记忆和内在生活，理解人如何继承并修订意义。",
    reflectionQuestion: "Which old text, place, or memory might change you because it lets you see your own life from above?",
    reflectionQuestionZh: "哪一本旧书、哪一个地点或哪段记忆，可能因为让你从高处看见自己，而改变你？",
    tags: ["humanism", "memory", "self-examination"],
    tagsZh: ["人文主义", "记忆", "自我审视"],
  },
  {
    id: "023-rosetta-cartouche",
    categoryCode: "02",
    groupCode: "023",
    groupTitleZh: "语言",
    title: "The oval around a royal name",
    titleZh: "王名外面的椭圆框",
    summary: "A young language scholar followed repeated names across scripts until a silent civilization began to speak again.",
    summaryZh: "一位年轻语言学者追踪不同文字里的重复王名，终于让沉默的古文明重新发声。",
    scene: "In nineteenth-century France, a boy who loved languages grew up under political uncertainty, copying scripts and listening for patterns long before he had a secure career.",
    sceneZh: "19 世纪的法国，一个热爱语言的少年在政治动荡中长大，还没有稳定事业时，就已经在抄写文字、寻找不同文字之间的模式。",
    storyBody: "The stone that fascinated Europe carried the same decree in several scripts, but the hieroglyphs still resisted readers. He did not treat the signs as decoration. He compared royal names, especially the names inside oval cartouches, with Greek letters and with Coptic, a later Egyptian language he knew could preserve older sounds. A sign that looked symbolic in one place began to behave like sound in another. The breakthrough was slow, competitive, and not the work of one mind alone, but his step changed everything: the signs were not merely sacred pictures; they could also record language. Once that became clear, monuments, tombs, names, prayers, and official records began to re-enter history. This person was Jean-Francois Champollion, who announced a decisive decipherment of Egyptian hieroglyphs in 1822 and became a founding figure of Egyptology.",
    storyBodyZh: "那块让欧洲学者着迷的石碑，用几种文字写着同一份诏令，可象形文字仍然拒绝被读懂。他没有把那些符号只当作装饰，而是反复比较王名，尤其是椭圆框里的名字，把它们同希腊字母、以及他熟悉的科普特语联系起来。一个在某处看似图画的符号，在另一处开始表现得像声音。突破很慢，也充满竞争，而且并不是一个人凭空完成的；但他的关键一步改变了一切：这些符号不只是神圣图像，也能记录语言。一旦这一点被确认，纪念碑、墓葬、名字、祷文和官方记录，开始重新进入历史。这个人叫 Jean-Francois Champollion，他在 1822 年宣布对埃及象形文字的决定性破译，并成为 Egyptology 的奠基人物之一。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是语言真正要追问的问题：连接文字、声音、语法、意义、翻译，以及让语言重新可读的历史条件。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。",
    support: "Champollion's 1822 breakthrough used comparisons among Greek, hieroglyphic cartouches, demotic, and Coptic to show that Egyptian hieroglyphs combined phonetic and ideographic elements.",
    supportZh: "Champollion 1822 年的突破通过比较希腊文、象形文字王名框、世俗体文字和科普特语，说明埃及象形文字同时包含表音和表意成分。",
    knowledgePoint: "Language study connects scripts, sounds, grammar, meaning, translation, and the historical conditions that make words readable.",
    knowledgePointZh: "语言研究连接文字、声音、语法、意义、翻译，以及让语言重新可读的历史条件。",
    reflectionQuestion: "What changes when a mark on stone stops being decoration and becomes a sentence?",
    reflectionQuestionZh: "当石头上的符号不再只是装饰，而变成一句话，世界会怎样改变？",
    tags: ["decipherment", "scripts", "Egyptology"],
    tagsZh: ["破译", "文字系统", "埃及学"],
  },
  {
    id: "028-black-mountain-studio",
    categoryCode: "02",
    groupCode: "028",
    groupTitleZh: "艺术与人文相关跨学科课程与资格",
    title: "The college without tidy borders",
    titleZh: "没有整齐边界的学院",
    summary: "A small American college turned exile, craft, philosophy, music, poetry, and materials into one experimental education.",
    summaryZh: "美国一所小学院把流亡、工艺、哲学、音乐、诗歌和材料放进同一个实验教育里。",
    scene: "In 1933, after the Bauhaus was shut down in Germany, a teacher and his wife arrived in North Carolina with boxes, habits of workshop teaching, and no interest in keeping art safely separate from life.",
    sceneZh: "1933 年，Bauhaus 在德国被关闭后，一位教师和妻子带着行李、工坊教学习惯和一种不愿把艺术同生活分开的信念，来到北卡罗来纳。",
    storyBody: "The college they joined was small enough that students helped make institutional decisions, lived close to teachers, worked with materials, read philosophy, built things, performed, argued, cooked, and sometimes failed without a conventional map. The teacher's famous course in materials and form did not begin with masterpieces. It began with paper, color, glass, leaves, wire, pressure, balance, and the discipline of really seeing. Around that practice gathered dancers, poets, composers, painters, weavers, architects, and thinkers. Cross-disciplinary arts and humanities here did not mean adding extra topics. It meant treating making, reading, living, and perceiving as one education. This person was Josef Albers, whose teaching at Black Mountain College helped make interdisciplinary arts education a living experiment rather than a slogan.",
    storyBodyZh: "他们加入的那所学院很小，小到学生会参与学校决策，和老师一起生活，处理材料，读哲学，建造东西，表演，争论，做饭，也常常在没有传统地图的情况下失败。那位教师著名的材料与形式课程，并不是从名作开始，而是从纸、颜色、玻璃、树叶、金属丝、压力、平衡，以及真正看见东西的纪律开始。围绕这些练习，舞者、诗人、作曲家、画家、织物艺术家、建筑师和思想者彼此靠近。艺术与人文的跨学科在这里不是多加几个主题，而是把制作、阅读、生活和感知当成同一种教育。这个人叫 Josef Albers，他在 Black Mountain College 的教学让跨学科艺术教育成为真实实验，而不只是口号。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是艺术与人文跨学科课程要完成的转换：把制作、解释、历史、语言、表演和生活经验放进同一个探究场域。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。",
    support: "Black Mountain College opened in 1933 in North Carolina. Josef Albers, formerly of the Bauhaus, became a key teacher there, and the college became famous for experimental, interdisciplinary arts and liberal education.",
    supportZh: "Black Mountain College 于 1933 年在北卡罗来纳创办。原 Bauhaus 教师 Josef Albers 是关键教师之一；这所学院以实验性、跨学科的艺术和通识教育闻名。",
    knowledgePoint: "Inter-disciplinary arts and humanities combine making, interpretation, history, language, performance, and lived experience into one field of inquiry.",
    knowledgePointZh: "艺术与人文跨学科课程把制作、解释、历史、语言、表演和生活经验放进同一个探究场域。",
    reflectionQuestion: "What would you learn differently if your classroom included tools, books, meals, arguments, and performance at the same time?",
    reflectionQuestionZh: "如果课堂同时包含工具、书、饭桌、争论和表演，你会以什么不同方式学习？",
    tags: ["Black Mountain College", "interdisciplinary", "materials"],
    tagsZh: ["Black Mountain College", "跨学科", "材料"],
  },
  {
    id: "029-lomax-field-recorder",
    categoryCode: "02",
    groupCode: "029",
    groupTitleZh: "未另分类的艺术与人文",
    title: "The heavy recorder in the trunk",
    titleZh: "后备箱里的沉重录音机",
    summary: "A field recorder showed why some cultural knowledge sits between music, archive, oral history, politics, and memory.",
    summaryZh: "一台田野录音机说明：有些文化知识横跨音乐、档案、口述史、政治和记忆。",
    scene: "In the 1930s and 1940s, a young collector drove long distances with recording equipment heavy enough to shape the whole trip.",
    sceneZh: "20 世纪三四十年代，一个年轻采集者带着沉重到足以改变整趟行程的录音设备，开车穿过很长的路。",
    storyBody: "He sat in prisons, porches, churches, kitchens, fields, and small rooms where people sang songs that rarely entered official culture. At first glance, he seemed to be collecting music. But the recordings also carried accents, work rhythms, jokes, local histories, racial violence, migration, memory, and the pride of people who had often been treated as raw material rather than authors of culture. The work did not fit neatly into one shelf. It was musicology, folklore, archive building, oral history, documentary practice, and a political argument that every community deserves to hear itself preserved. Not elsewhere classified arts and humanities live in exactly this kind of borderland, where the category is less important than the care taken with fragile human expression. This person was Alan Lomax, whose field recordings and cultural equity work helped preserve and reframe folk music and oral traditions across the United States and beyond.",
    storyBodyZh: "他坐进监狱、门廊、教堂、厨房、田野和小房间，录下那些很少进入官方文化的歌声。乍看之下，他是在采集音乐；但录音里也有口音、劳动节奏、玩笑、地方历史、种族暴力、迁徙、记忆，以及那些常被当成文化素材而不是文化作者的人所保有的尊严。这项工作很难放进一个格子。它既是音乐学，也是民俗学、档案建设、口述史、纪录实践，更是一种政治主张：每个共同体都应该有机会听见自己被保存。未另分类的艺术与人文，正生活在这种边界地带，分类不如对脆弱人类表达的照护重要。这个人叫 Alan Lomax，他的田野录音和 cultural equity 工作保存并重新解释了美国及世界各地的民间音乐与口述传统。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的艺术与人文需要认真追问的问题：未另分类的艺术与人文保护那些跨越音乐、记忆、档案、口述史、媒介和公共意义的混合文化实践。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。",
    support: "Alan Lomax made extensive field recordings of folk music and oral traditions, including work for the Library of Congress Archive of Folk Song. His later idea of cultural equity argued for the public value of diverse local expressive traditions.",
    supportZh: "Alan Lomax 大量采集民间音乐和口述传统录音，曾参与 Library of Congress Archive of Folk Song 工作。他后来提出 cultural equity，强调不同地方表达传统的公共价值。",
    knowledgePoint: "Not elsewhere classified arts and humanities protect hybrid cultural practices that cross music, memory, archives, oral history, media, and public meaning.",
    knowledgePointZh: "未另分类的艺术与人文保护那些跨越音乐、记忆、档案、口述史、媒介和公共意义的混合文化实践。",
    reflectionQuestion: "Whose voice near you might disappear if no one treats it as culture before it becomes famous?",
    reflectionQuestionZh: "你身边谁的声音，如果没人先把它当作文化来对待，可能还没出名就消失？",
    tags: ["field recording", "oral history", "cultural memory"],
    tagsZh: ["田野录音", "口述史", "文化记忆"],
  },
  {
    id: "031-bus-stop-price",
    categoryCode: "03",
    groupCode: "031",
    groupTitleZh: "社会与行为科学",
    title: "The bus stop price",
    titleZh: "王朝为什么会衰弱",
    summary: "A changed bus fare revealed incentives, behavior, fairness, and public life.",
    summaryZh: "一个在动荡时代观察部落、城市和政权的人，试着把社会行为写成有规律的历史。",
    scene: "When the bus fare rose, some riders walked, some paid, and some began sharing rides. The city called it a small adjustment. The bus stop told a bigger story.",
    sceneZh: "14 世纪北非，一个年轻官员在宫廷、部落营地和监狱之间辗转，亲眼看见权力如何上升又崩塌。",
    storyBody: "A student counted who stopped riding. A shop owner noticed fewer morning customers. A planner saw revenue; riders felt lost time and dignity. Social and behavioural sciences ask how choices are shaped by incentives, norms, institutions, and unequal options.",
    storyBodyZh: "他的人生并不安稳，家族经历瘟疫，仕途几次卷入政治风浪。他开始怀疑，历史书里只记谁胜谁败是不够的。为什么一些群体能团结起来，为什么进入富裕城市后又慢慢松散，为什么税收、奢侈、教育、地理和共同体精神会一起改变政权命运？他把亲身见过的部落联盟、城市官僚和王朝循环放在一起分析，试着找出社会行为背后的力量。社会与行为科学的雏形就在这种追问里出现：人不是孤立行动，群体的凝聚、制度和环境会共同塑造历史。这个人叫 Ibn Khaldun，他在《Muqaddimah》中提出关于社会组织、王朝循环和 asabiyyah 的分析，被视为社会科学思想的重要先驱之一。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是社会与行为科学真正要追问的问题：人的选择、群体、制度、文化和环境如何共同塑造行动。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    knowledgePoint: "Social and behavioural sciences study economics, politics, psychology, sociology, and culture as forces shaping human action.",
    knowledgePointZh: "社会与行为科学研究人的选择、群体、制度、文化和环境如何共同塑造行动。",
    reflectionQuestion: "When a choice looks individual, what shared condition might be quietly choosing with the person?",
    reflectionQuestionZh: "当一个团队变弱时，你会只责怪个人，还是追问共同体的结构发生了什么？",
    tags: ["behaviour", "incentives", "society"],
    tagsZh: ["社会行为", "历史规律", "群体"],
  },
  {
    id: "032-rumor-before-the-storm",
    categoryCode: "03",
    groupCode: "032",
    groupTitleZh: "新闻与信息",
    title: "The rumor before the storm",
    titleZh: "世界知识的抽屉",
    summary: "A neighborhood rumor showed why information work is about verification, timing, and trust.",
    summaryZh: "一座纸卡片构成的知识宫殿，让新闻与信息不只是报道，也包括组织和检索世界。",
    scene: "Before a storm, a message spread through the neighborhood: the bridge was closed. People cancelled appointments before anyone checked the source.",
    sceneZh: "19 世纪末的布鲁塞尔，一个年轻律师坐在堆满纸卡片的房间里，想象全世界的知识都能被找到。",
    storyBody: "Mara called the transport office, checked the city update, and asked who first sent the message. The bridge was open, but one lane was flooded. The corrected message had to be short, clear, and fast. Journalism and information work is not just finding facts; it is helping facts travel before fear does.",
    storyBodyZh: "他关心的不是某一条新闻，而是人类怎样保存和共享所有已经写下来的东西。书、论文、报告、图片、剪报、统计表，如果不能被分类、编号、引用和检索，就像散在地上的碎片。他和同伴设计通用十进分类法，建立庞大的卡片目录，试图让任何地方的人都能提出问题并获得相关资料。这个梦想有时代局限，也带着欧洲中心的阴影，但它抓住了信息工作的核心：公共知识不是自然流动的，它需要索引、标准、媒介、机构和持续维护。这个人叫 Paul Otlet，他创建 Mundaneum 并推动文献学、知识组织和信息科学早期发展，被后世视为现代信息组织思想的重要先驱之一。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是新闻与信息领域最核心的问题之一：报道、保存、检索、组织和传播，让公共知识能够被找到、核实和使用。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    knowledgePoint: "Journalism and information fields handle reporting, verification, archives, access, and the systems that make public knowledge reliable.",
    knowledgePointZh: "新闻与信息领域关注报道、保存、检索、组织和传播，让公共知识能够被找到、核实和使用。",
    reflectionQuestion: "What information do people around you pass on because it feels urgent rather than because it has been checked?",
    reflectionQuestionZh: "如果一条重要信息无法被找到，它还算真正进入公共生活了吗？",
    tags: ["verification", "reporting", "trust"],
    tagsZh: ["信息组织", "文献", "公共知识"],
  },
  {
    id: "038-community-data-project",
    categoryCode: "03",
    groupCode: "038",
    groupTitleZh: "社会科学、新闻与信息相关跨学科课程与资格",
    title: "The map of empty benches",
    titleZh: "水泵周围的黑点",
    summary: "A park project needed observation, interviews, data, and reporting in one frame.",
    summaryZh: "一张疾病地图把社会调查、数据、地方访谈和公共信息放进同一个判断。",
    scene: "Students mapped which park benches stayed empty. The numbers said one thing; interviews with older residents said another.",
    sceneZh: "1854 年伦敦 Soho 的街道上，霍乱病例不断增加，一位医生拿着地址和地图追踪死亡的位置。",
    storyBody: "The empty benches were not simply unpopular. Some were too far from shade, some near loud traffic, and some felt unsafe after dusk. The final report combined counting, listening, mapping, and public storytelling. A social question often needs several methods to become visible.",
    storyBodyZh: "当时许多人仍相信坏空气是主要原因。他却把注意力放到人喝了什么水、住在哪里、谁离开、谁留下，以及哪些看似例外其实有共同解释。他不是一个人完成全部调查；当地牧师和居民提供了关键访问线索。病例被标到地图上后，Broad Street 水泵周围的黑点越来越密。这个判断既是医学问题，也是社会信息问题：数据要来自街道，访谈要校正地图，地图又要说服公共机构采取行动。跨学科的社会科学、新闻与信息在这里很清楚：证据要能穿过学科边界，才可能改变一个城市的决定。这个人叫 John Snow，他通过 Broad Street 霍乱调查和地图分析推动了流行病学、公共卫生和数据可视化的经典实践。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是社会科学、新闻与信息的跨学科课程把社会调查、数据、地图、访谈和公共传播要练习的连接能力：起来。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    knowledgePoint: "Inter-disciplinary social sciences, journalism, and information combine research, communication, data, and public context.",
    knowledgePointZh: "社会科学、新闻与信息的跨学科课程把社会调查、数据、地图、访谈和公共传播连接起来。",
    reflectionQuestion: "What public problem near you would change if numbers and stories were read together?",
    reflectionQuestionZh: "一个公共问题什么时候需要地图、访谈和行动同时出现？",
    tags: ["data", "interviews", "public context"],
    tagsZh: ["跨学科", "数据地图", "公共卫生"],
  },
  {
    id: "039-unusual-community-signal",
    categoryCode: "03",
    groupCode: "039",
    groupTitleZh: "未另分类的社会科学、新闻与信息",
    title: "The signal in the laundry room",
    titleZh: "渔民为什么没有把湖耗尽",
    summary: "A pattern nobody studied formally became a clue about trust in a building.",
    summaryZh: "一个长期观察共同资源的人发现，真实社区常常比简单理论更会发明规则。",
    scene: "In one apartment building, people left free items in the laundry room. In another, everything disappeared within minutes. Nobody knew what category this habit belonged to.",
    sceneZh: "20 世纪后半叶，一个研究者读到许多关于森林、灌溉渠和渔场的案例，发现它们并不总按课本预言崩坏。",
    storyBody: "A tenant started noting the signs people wrote, how long items stayed, and who greeted whom. The laundry room became a tiny information system and a trust experiment. Some social realities are too local, hybrid, or odd for standard labels, but still worth understanding.",
    storyBodyZh: "流行说法常把公共资源讲成两种结局：要么被市场私有化，要么由国家统一管理，否则人人都会多拿一点直到系统崩溃。她不满足于这个太整齐的故事。她和同伴比较世界各地的灌溉社群、渔业、牧场和森林，发现有些社区会自己制定边界、监测、惩罚、冲突解决和分层规则。它们不是完美乌托邦，也会失败，但它们证明社会现实比二分法复杂。未另分类的社会科学、新闻与信息需要这种耐心：有些制度知识藏在地方规则、口头协议和长期观察里，不一定属于单一学科。这个人叫 Elinor Ostrom，她通过共同池资源研究和制度分析获得诺贝尔经济学奖，改变了人们对集体治理的理解。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未另分类的社会科学、新闻与信息需要保留下来的边界问题：那些跨越制度、行为、地方知识和公共信息的复杂社会现象。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    knowledgePoint: "Not elsewhere classified social and information fields catch unusual public patterns that still reveal behaviour, norms, and communication.",
    knowledgePointZh: "未另分类的社会科学、新闻与信息收纳那些跨越制度、行为、地方知识和公共信息的复杂社会现象。",
    reflectionQuestion: "What tiny social habit around you says more than it first appears to?",
    reflectionQuestionZh: "你身边哪一套非正式规则，其实比外人想象得更精密？",
    tags: ["local pattern", "trust", "informal systems"],
    tagsZh: ["共同资源", "制度", "地方知识"],
  },
  {
    id: "041-cafe-closing-sheet",
    categoryCode: "04",
    groupCode: "041",
    groupTitleZh: "商业与管理",
    title: "The cafe closing sheet",
    titleZh: "公司不是一台机器",
    summary: "A cafe closing routine showed how records, roles, stock, money, and customers fit together.",
    summaryZh: "一次对大企业的长期观察，让管理学开始把组织看成由人、目标和责任组成的社会机构。",
    scene: "At closing time, the cafe looked quiet, but the manager still had three questions: what sold, what was wasted, and who needed to know before morning.",
    sceneZh: "20 世纪中期，一个年轻管理思想者走进大型汽车公司，发现真正难的不是画组织图，而是理解组织为什么行动。",
    storyBody: "The closing sheet connected cash, stock, staff hours, supplier orders, and customer complaints. One missing note about oat milk could become a bad morning. Business and administration are the systems that make work visible before decisions are made.",
    storyBodyZh: "他不是工程师出身，也不是只看财务报表的人。他关心一个更朴素的问题：当公司越来越大，谁在决定目标？经理人的责任是什么？员工是不是只是一颗螺丝？顾客、社会和长期生存又放在哪里？他观察通用汽车这样的组织，发现管理不是命令链条那么简单，而是让知识、权责、绩效、创新和人的尊严保持可工作的关系。商业与行政在这里变成一门关于“组织如何有目的地行动”的学问。它既要看数字，也要看人；既要看效率，也要看责任。这个人叫 Peter Drucker，他通过《Concept of the Corporation》等作品奠定现代管理学的重要语言，被称为现代管理思想的重要奠基人之一。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是商业与行政真正要追问的问题：组织、流程、责任、协调、绩效和决策如何让集体工作可持续运转。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    knowledgePoint: "Business and administration covers accounting, finance, management, marketing, office work, sales, and work skills as coordinated organizational practice.",
    knowledgePointZh: "商业与行政研究组织、流程、责任、协调、绩效和决策如何让集体工作可持续运转。",
    reflectionQuestion: "What small record keeps a workplace from having to remember everything by panic?",
    reflectionQuestionZh: "一个组织如果只追效率，却说不清自己的责任，会在哪些地方开始失灵？",
    tags: ["management", "records", "operations"],
    tagsZh: ["管理学", "组织", "行政"],
  },
  {
    id: "042-bicycle-deposit",
    categoryCode: "04",
    groupCode: "042",
    groupTitleZh: "法律",
    title: "The bicycle deposit",
    titleZh: "学生第一次听懂普通法",
    summary: "A small deposit dispute showed why rules need language, evidence, and fairness.",
    summaryZh: "一个讲课者把散落判例和法律传统整理成可学习的体系，让法律教育走向公共语言。",
    scene: "Kai rented a bicycle for a weekend. When he returned it, the shop kept part of the deposit for a scratch he said was already there.",
    sceneZh: "18 世纪的牛津，一个年轻律师面对学生，试着把复杂的普通法讲成一套有次序的课程。",
    storyBody: "The argument changed when they looked at the rental agreement, old photos, and what the word damage meant. Law entered the room not as drama, but as a way to ask: what was promised, what can be proven, and what outcome is fair enough to live with?",
    storyBodyZh: "当时普通法常被认为只能在律师事务所和法院里慢慢熬出来，外人很难进入。判例、惯例、术语和程序像一片森林，既保护权利，也让许多人迷路。他开始公开讲授英格兰法律，把权利、财产、私人侵害和公共犯罪整理成系统叙述。后来他的书影响巨大，也带着时代局限，尤其在殖民和社会等级问题上需要被批判阅读。但法律作为学科的一个关键变化已经出现：规则不只是专业圈的秘密技术，也可以被讲解、出版、争论和教学。这个人叫 William Blackstone，他的《Commentaries on the Laws of England》成为普通法教育和英美法律思想史上的经典文本。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是法律真正要追问的问题：规则、权利、责任、证据、解释和处理冲突的制度。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    knowledgePoint: "Law studies rules, rights, responsibilities, evidence, interpretation, and the institutions that settle conflict.",
    knowledgePointZh: "法律研究规则、权利、责任、证据、解释和处理冲突的制度。",
    reflectionQuestion: "What agreement in your life depends on a word nobody defined carefully?",
    reflectionQuestionZh: "如果规则只被少数专业人士听懂，普通人还怎样保护自己的权利？",
    tags: ["rights", "evidence", "agreement"],
    tagsZh: ["法律", "普通法", "法律教育"],
  },
  {
    id: "048-pop-up-market-rules",
    categoryCode: "04",
    groupCode: "048",
    groupTitleZh: "商业、管理与法律相关跨学科课程与资格",
    title: "The pop-up market rules",
    titleZh: "一份关于便宜保险的报告",
    summary: "A weekend market needed pricing, permits, roles, contracts, and public safety together.",
    summaryZh: "一个律师把商业数据、行政制度和法律公共性放在一起，试图保护普通人的金融生活。",
    scene: "A group planned a pop-up market in a courtyard. The first meeting was about tables and music. The second was about permits, payments, insurance, rubbish, and refunds.",
    sceneZh: "20 世纪初的波士顿，一个律师听见工薪家庭买不起可靠保险，也看见金融公司如何利用信息不对称。",
    storyBody: "No single person owned the whole problem. The designer saw layout, the treasurer saw risk, the organizer saw vendors, and the lawyer saw liability. The market only became real when those views were coordinated into rules people could follow.",
    storyBodyZh: "他并不把法律只看成诉讼技巧。对他来说，法律、商业和行政必须一起回答一个问题：普通人在复杂市场里怎样不被制度性弱势吞掉？他研究保险成本、公司利润、储蓄银行制度和公共监管，提出通过 savings bank life insurance 让普通家庭获得更便宜、更透明的人寿保险。这个方案不是单一学科能完成的：需要金融计算、法律授权、行政执行和公共说服。商业、管理与法律的跨学科意义就在这里，市场不是天然公平，规则也不是自动有效，它们必须被设计成能服务真实生活。这个人叫 Louis Brandeis，他推动 savings bank life insurance 等公共改革，并以律师、改革者和美国最高法院大法官身份影响了商业监管与法律公共责任。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是商业、管理与法律跨学科课程要练习的连接能力：组织设计、金融决策、合同、监管、行政执行和问责。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    knowledgePoint: "Inter-disciplinary business, administration, and law links organizational design, financial decisions, contracts, regulation, and accountability.",
    knowledgePointZh: "商业、管理与法律跨学科课程连接组织设计、金融决策、合同、监管、行政执行和问责。",
    reflectionQuestion: "When an idea becomes public, what rules must appear before people can safely join it?",
    reflectionQuestionZh: "当一种产品太复杂，普通人无法判断风险时，法律和管理应该怎样介入？",
    tags: ["coordination", "permits", "accountability"],
    tagsZh: ["跨学科", "商业监管", "公共责任"],
  },
  {
    id: "049-strange-side-business",
    categoryCode: "04",
    groupCode: "049",
    groupTitleZh: "未另分类的商业、管理与法律",
    title: "The neighborhood tool library",
    titleZh: "小店里的再装瓶",
    summary: "A shared tool shelf behaved like a business, a club, and a contract all at once.",
    summaryZh: "一家护肤小店把商业、伦理、供应链和行动主义混在一起，让分类变得不够用。",
    scene: "Neighbors built a tool library: drills, ladders, sewing kits, and a notebook. Nobody knew whether it was a shop, a charity, or a shared agreement.",
    sceneZh: "1970 年代英国海边小城，一个女性创业者开了一家小店，顾客拿着空瓶回来重新灌装。",
    storyBody: "They still had to decide deposits, repairs, responsibility, and how to remove someone who never returned things. Some practical arrangements do not fit standard business labels, but they still need administration and rules.",
    storyBodyZh: "她没有按当时化妆品行业的常规走。包装可以简单，动物测试可以被质疑，原料故事可以告诉顾客，商业也可以公开站在环保和人权议题旁边。她的做法后来同样需要复杂评价：品牌扩张、供应链、并购和市场叙事都会让理想变得不纯粹。但这个案例说明，未另分类的商业、管理与法律常常出现在边界上：一件商品既是买卖，也是价值主张、合同关系、劳动条件、生态选择和公共传播。这个人叫 Anita Roddick，她创办 The Body Shop，并以环保、反动物测试和 ethical consumerism 影响了商业伦理与品牌行动主义。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的商业、管理与法律必须面对的问题：那些跨越商业模式、伦理、监管、社区和公共价值的混合安排。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    knowledgePoint: "Not elsewhere classified business, administration, and law covers hybrid arrangements that still involve value, responsibility, and governance.",
    knowledgePointZh: "未另分类的商业、管理与法律处理那些跨越商业模式、伦理、监管、社区和公共价值的混合安排。",
    reflectionQuestion: "What shared thing near you works only because people quietly accept a rule?",
    reflectionQuestionZh: "当一个品牌说自己有价值立场时，你会看广告语，还是看它怎样组织供应链和责任？",
    tags: ["hybrid model", "governance", "responsibility"],
    tagsZh: ["商业伦理", "品牌", "混合安排"],
  },
  {
    id: "051-yogurt-on-the-counter",
    categoryCode: "05",
    groupCode: "051",
    groupTitleZh: "生物及相关科学",
    title: "The yogurt on the counter",
    titleZh: "小岛上的鸟嘴",
    summary: "A jar of yogurt made living processes visible in an ordinary kitchen.",
    summaryZh: "一场漫长航行让生物学问题从物种分类，转向生命如何随环境变化。",
    scene: "Lea left milk with a spoonful of yogurt near the warm window. By evening, the jar had changed texture, smell, and taste.",
    sceneZh: "1830 年代，一位年轻博物学者在船上晕船、采集标本，也在岛屿之间注意到鸟、龟和植物的细微差异。",
    storyBody: "Her brother called it cooking. Lea called it a living process. Temperature, microbes, time, and chemistry had worked together while nobody watched. Biology begins when the ordinary fact that things change becomes a question about life.",
    storyBodyZh: "他出发时还不是一个准备推翻传统观念的人，更像一个爱观察的年轻人：写笔记、收集昆虫、寄回标本、和船员一起经历风浪。真正改变他的不是某一个瞬间，而是大量小差异慢慢堆在一起：相近的岛屿有不同的鸟嘴，化石和现生动物彼此呼应，人工育种显示性状可以被选择。多年后，他才把这些线索组织成一个更大的解释：生命不是固定陈列，而是在变异、遗传、环境和选择中逐渐改变。生物及相关科学在这里不再只是给生命命名，也开始追问生命为什么会成为现在这样。这个人叫 Charles Darwin，他通过《On the Origin of Species》提出自然选择理论，成为现代进化生物学的重要奠基人。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是生物及相关科学真正要追问的问题：生命、物种、遗传、适应、演化和生命系统之间的关系。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。",
    knowledgePoint: "Biological and related sciences study living organisms, cells, ecosystems, biochemical processes, and the conditions that sustain life.",
    knowledgePointZh: "生物及相关科学研究生命、物种、遗传、适应、演化和生命系统之间的关系。",
    reflectionQuestion: "What living process happens near you so quietly that you rarely call it knowledge?",
    reflectionQuestionZh: "当你看到两个相似生命的细微差别时，你会把它当偶然，还是当成环境留下的线索？",
    tags: ["biology", "microbes", "living systems"],
    tagsZh: ["生物学", "演化", "自然选择"],
  },
  {
    id: "052-stream-after-rain",
    categoryCode: "05",
    groupCode: "052",
    groupTitleZh: "环境",
    title: "The stream after rain",
    titleZh: "春天为什么安静了",
    summary: "A muddy stream revealed the links between land, water, weather, and human use.",
    summaryZh: "一本关于鸟鸣消失的书，让环境问题从局部害虫控制变成整个生态系统的警报。",
    scene: "After heavy rain, the small stream behind the school turned brown. Some children blamed the rain. Their teacher asked what the rain had carried with it.",
    sceneZh: "20 世纪中期的美国，一个海洋生物学家收到越来越多来信：鸟少了，鱼死了，喷洒后的土地不对劲。",
    storyBody: "They walked upstream and found bare soil near a construction fence, leaves blocking a drain, and oil colors near the parking lot. The stream was not separate from the neighborhood. Environmental knowledge begins when place is read as a system of exchanges.",
    storyBodyZh: "她原本写过海洋，也擅长把科学写给普通读者。面对杀虫剂，她没有只问它能不能杀死目标害虫，而是追问它进入土壤、水、昆虫、鸟、鱼和人体之后会怎样移动。她阅读研究、整理案例、承受化工行业攻击，也小心避免把复杂生态写成简单恐吓。环境领域在这里变得清楚：人类技术不是只作用于一个点，它会穿过食物链、公共政策、商业利益和日常家庭。一个“有效”的工具，如果看不到长期代价，就可能把春天本身变安静。这个人叫 Rachel Carson，她的《Silent Spring》推动现代环境运动和农药监管讨论，成为环境科学与公共环保意识的重要经典。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是环境领域真正要追问的问题：生态系统、水、污染、气候、资源和人类活动之间的关系。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    knowledgePoint: "Environment studies ecosystems, water, wildlife, pollution, climate, and the effects of human activity on natural systems.",
    knowledgePointZh: "环境领域研究生态系统、水、污染、气候、资源和人类活动之间的关系。",
    reflectionQuestion: "What place near you would look different if you followed what flows through it?",
    reflectionQuestionZh: "一种技术解决了眼前问题以后，你会不会继续追问它去了哪里？",
    tags: ["environment", "water", "systems"],
    tagsZh: ["环境", "生态", "农药"],
  },
  {
    id: "053-kitchen-ice-and-steam",
    categoryCode: "05",
    groupCode: "053",
    groupTitleZh: "物理科学",
    title: "Ice, steam, and the kettle",
    titleZh: "斜面上的小球",
    summary: "A kitchen kettle turned matter, heat, and observation into a small physical science lesson.",
    summaryZh: "一个滚下斜面的小球，让物理科学开始用实验、测量和数学追问运动。",
    scene: "Noah watched ice melt in a glass while the kettle hissed on the stove. The same water seemed to have three personalities.",
    sceneZh: "17 世纪意大利，一个教师让小球沿斜面滚下，用水钟和刻度记录它怎样加速。",
    storyBody: "His grandmother asked what changed and what stayed the same. The shape changed, the temperature changed, the movement changed, but the question held together. Physical sciences teach people to look beneath appearances for matter, energy, forces, and patterns.",
    storyBodyZh: "他并不满足于背诵古代权威关于重物下落的说法。真实下落太快，不容易测；于是他把斜面变成放慢运动的工具，让时间、距离和速度之间的关系可以被观察。小球每次滚动都像在提醒他：自然不是只能被辩论，也可以被设计实验来询问。物理科学的精神在这里显现：把看似普通的运动拆成可测量关系，用数学表达规律，再让实验反复挑战直觉。这个人叫 Galileo Galilei，他通过落体、斜面和天文观察等研究推动近代物理科学和实验方法的发展。学生在实验室里重复这种动作时，学到的不只是公式，而是怎样让自然用可检查的方式回答问题。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是物理科学真正要追问的问题：物质、能量、运动、力、材料和自然规律如何在可观察现象中表现出来。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。那颗小球滚下去的时间很短，却把科学学习拉长了：人开始愿意为了看清关系而重新设计问题。",
    knowledgePoint: "Physical sciences study chemistry, physics, earth processes, materials, energy, and the observable patterns of the physical world.",
    knowledgePointZh: "物理科学研究物质、能量、运动、力、材料和自然规律如何在可观察现象中表现出来。",
    reflectionQuestion: "What everyday change would become more interesting if you asked what stayed the same?",
    reflectionQuestionZh: "当一个现象太快看不清时，你能不能设计一种方法让它慢下来回答你？",
    tags: ["matter", "energy", "observation"],
    tagsZh: ["物理科学", "实验", "运动"],
  },
  {
    id: "054-shared-bill-pattern",
    categoryCode: "05",
    groupCode: "054",
    groupTitleZh: "数学与统计",
    title: "The shared dinner bill",
    titleZh: "算术书里的陌生数字",
    summary: "A dinner bill showed how numbers can clarify fairness and uncertainty.",
    summaryZh: "一本关于计算的书让数学与统计从地方技巧走向可传播的符号系统。",
    scene: "Six friends shared dinner. One ordered only soup, another ordered wine, and someone suggested splitting everything equally.",
    sceneZh: "9 世纪的巴格达，一个学者在智慧宫附近整理印度数字、方程和实际计算问题。",
    storyBody: "The table became quiet until Ana wrote three options: equal split, itemized split, and shared dishes plus personal extras. The math did not decide their values, but it made the trade-off visible. Mathematics and statistics often help people see the shape of fairness before arguing about it.",
    storyBodyZh: "他面对的不是纯粹游戏，而是继承、贸易、测量、税收和土地分配中的真实计算。旧方法可以算，但不够统一，也不容易传播。他把印度数字和十进位计算介绍给阿拉伯语读者，又系统讨论线性和二次方程的解法。数学与统计的基础意义在这里很清楚：符号一旦变得可写、可教、可复用，复杂关系就能离开个人头脑，成为社会共同工具。这个人叫 Muhammad ibn Musa al-Khwarizmi，他的代数学著作和关于印度数字的作品影响了 algebra 与 algorithm 等概念的历史发展。后来无数课堂、账本和程序都沿着这条路继续走：先把关系写清楚，更多人才能一起检查、改进和使用它。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未进一步细分的数学与统计最核心的问题之一：数量、结构、符号、模型和数据如何帮助人推理。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    knowledgePoint: "Mathematics and statistics use quantities, patterns, models, probability, and data to reason clearly about problems.",
    knowledgePointZh: "未进一步细分的数学与统计关注数量、结构、符号、模型和数据如何帮助人推理。",
    reflectionQuestion: "Where could a simple model make a difficult conversation less blurry?",
    reflectionQuestionZh: "一种更好的符号，怎样让原本困难的问题开始被更多人共同解决？",
    tags: ["models", "fairness", "data"],
    tagsZh: ["数学", "代数", "符号"],
  },
  {
    id: "058-school-air-quality",
    categoryCode: "05",
    groupCode: "058",
    groupTitleZh: "自然科学、数学与统计相关跨学科课程与资格",
    title: "The classroom air question",
    titleZh: "星星亮度里的尺子",
    summary: "A stuffy classroom needed sensors, biology, statistics, and environmental thinking together.",
    summaryZh: "一个在照片底片上比较星光的人，把天文学、数学和统计连成测量宇宙距离的方法。",
    scene: "Students complained that the classroom felt heavy after lunch. The teacher brought a small sensor, opened a spreadsheet, and asked them to track what changed.",
    sceneZh: "20 世纪初的哈佛天文台，一位女性计算员坐在成排玻璃底片前，逐颗比较变星的亮度。",
    storyBody: "They measured carbon dioxide, temperature, window opening, class size, and headaches. Biology explained breathing, environment explained ventilation, statistics helped compare days. The answer belonged to no single subject because the air did not either.",
    storyBodyZh: "她的工作头衔并不显赫，很多女性计算员被安排做重复而精细的记录。可她在麦哲伦云的变星中发现一种关系：某些造父变星变化周期越长，真实亮度越高。这个关系像一把宇宙尺子，只要知道周期，就能推算亮度，再进一步估计距离。自然科学、数学与统计在这里完全交织：天文观测提供材料，数学关系组织模式，统计比较让规律浮现。她的发现后来帮助人类测量银河系之外的距离。这个人叫 Henrietta Swan Leavitt，她发现造父变星周期-光度关系，成为现代宇宙距离尺度的重要基础。这也是数据和自然科学相遇时最动人的地方：微小记录不会自动说话，但耐心比较能让它们变成尺度。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是自然科学、数学与统计跨学科课程把观察、模型、测量和数据推断要练习的连接能力：起来。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。她面对的是一张张安静底片，但真正困难的是在重复记录中相信微小差别值得被认真比较。",
    knowledgePoint: "Inter-disciplinary natural sciences, mathematics, and statistics combine measurement, models, and evidence across scientific domains.",
    knowledgePointZh: "自然科学、数学与统计跨学科课程把观察、模型、测量和数据推断连接起来。",
    reflectionQuestion: "What problem around you needs both measurement and a story about living bodies?",
    reflectionQuestionZh: "一张照片底片里的小点，怎样可能变成测量宇宙的尺子？",
    tags: ["measurement", "science project", "statistics"],
    tagsZh: ["跨学科", "天文学", "统计"],
  },
  {
    id: "059-mystery-stain",
    categoryCode: "05",
    groupCode: "059",
    groupTitleZh: "未另分类的自然科学、数学与统计",
    title: "The mystery stain",
    titleZh: "海岸线到底有多长",
    summary: "A stain on a wall became a question that refused one neat scientific category.",
    summaryZh: "一个关于海岸线的问题，让自然、数学和统计之间出现了新的粗糙尺度。",
    scene: "A brown stain appeared near the ceiling. One person blamed rain, another insects, another old paint. Each explanation sounded partly right.",
    sceneZh: "20 世纪中期，一个数学家盯着地图上的海岸线，发现尺子越短，量出的长度越长。",
    storyBody: "They checked humidity, roof angle, pipe location, material age, and the timing of the stain. The problem was too practical to respect subject boundaries. Some science work begins with messy clues that need several tools before they deserve a name.",
    storyBodyZh: "传统几何喜欢光滑线条，可真实世界的云、山、树、河流和海岸都不那么听话。用大尺子量，很多弯曲被忽略；用小尺子量，细节不断冒出来，长度似乎没有稳定终点。他把这种粗糙、重复、自相似的形状发展成新的数学语言。这个方向既不像普通几何，也不只是物理或统计，却能帮助人描述自然界大量不规则形态。未另分类的自然科学、数学与统计就适合保存这种边界问题：分类暂时跟不上现象，但现象已经在要求新工具。这个人叫 Benoit Mandelbrot，他发展 fractal geometry，使分形成为理解自然形态、复杂系统和尺度问题的重要数学语言。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的自然科学、数学与统计需要保留下来的边界问题：那些跨越自然形态、数学结构、数据和模型的边界问题。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    knowledgePoint: "Not elsewhere classified science and statistics catch practical investigations that use scientific reasoning without fitting a standard domain.",
    knowledgePointZh: "未另分类的自然科学、数学与统计收纳那些跨越自然形态、数学结构、数据和模型的边界问题。",
    reflectionQuestion: "What mystery near you is waiting for several kinds of evidence before becoming clear?",
    reflectionQuestionZh: "如果一个东西越仔细看越复杂，你会把它当噪声，还是当成需要新数学的信号？",
    tags: ["investigation", "evidence", "messy problem"],
    tagsZh: ["分形", "尺度", "复杂性"],
  },
  {
    id: "068-repairing-the-club-website",
    categoryCode: "06",
    groupCode: "068",
    groupTitleZh: "信息与通信技术相关跨学科课程与资格",
    title: "The club website that forgot people",
    titleZh: "防空炮为什么总慢半拍",
    summary: "A broken club website needed design, data, writing, access, and technical structure together.",
    summaryZh: "一个关于控制和反馈的问题，把计算、工程、生物和通信连成新的跨学科语言。",
    scene: "The community club had a website, but nobody could find the meeting time. The programmer said the page worked. The members said it did not work for them.",
    sceneZh: "第二次世界大战期间，一位数学家研究防空炮如何预测飞机位置，发现机器必须根据误差不断修正自己。",
    storyBody: "They rewrote the text, changed the navigation, checked mobile screens, fixed the calendar feed, and added a plain contact path. The technical problem was also a communication problem and a service problem. ICT often succeeds only when several domains agree on what usable means.",
    storyBodyZh: "他看到的不是单一工程问题。雷达给出信息，炮塔需要动作，目标在移动，系统根据误差反馈调整；类似过程也出现在神经系统、动物运动、通信网络和自动控制里。于是他把“控制与通信”作为共同问题来思考，提出 feedback、信息和系统调节的语言。ICT 的跨学科意义在这里出现：计算不只是电脑，通信不只是电线，控制不只是机器，而是生命、技术和组织都可能共享的结构。这个人叫 Norbert Wiener，他创立 cybernetics，使控制、通信、反馈和系统思想成为信息技术、自动化和跨学科研究的重要基础。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是信息与通信技术跨学科课程要练习的连接能力：计算、通信、控制、系统、工程和人的使用场景。所以它不只是会不会操作机器，而是在训练人把想法清楚地交给系统，也能检查系统怎样回应。一旦系统能听见误差，机器就不再只是执行命令；它开始在偏差里学习怎样回到可控状态。",
    knowledgePoint: "Inter-disciplinary ICT connects computing with communication, design, organizational needs, data, and real user contexts.",
    knowledgePointZh: "信息与通信技术跨学科课程连接计算、通信、控制、系统、工程和人的使用场景。",
    reflectionQuestion: "What tool around you technically works but fails the situation it is meant to serve?",
    reflectionQuestionZh: "一个系统能学习修正自己之前，必须先听见哪一种反馈？",
    tags: ["usability", "data", "communication"],
    tagsZh: ["控制论", "反馈", "跨学科ICT"],
  },
  {
    id: "071-flickering-hall-light",
    categoryCode: "07",
    groupCode: "071",
    groupTitleZh: "工程与工程行业",
    title: "The flickering hallway light",
    titleZh: "屋顶为什么不能只靠图纸漂亮",
    summary: "A flickering light showed that engineering is diagnosis under constraints.",
    summaryZh: "一个工程师在复杂建筑里证明，工程不是给建筑补强，而是和形式一起思考可能性。",
    scene: "The hallway light flickered every evening. Residents blamed the bulb, but replacing it did nothing.",
    sceneZh: "20 世纪的悉尼，一座歌剧院的壳形屋顶让建筑师、政府和工程团队都陷入难题。",
    storyBody: "The electrician checked the switch, load, wiring age, and timing. The problem appeared only when several apartments used appliances at once. Engineering was not guessing the most visible part; it was tracing the system until cause and safe repair met.",
    storyBodyZh: "他面对的不是普通计算题。建筑形态大胆，预算和政治压力不断增加，原本的曲面难以制造和支撑。工程团队必须把美学愿望、几何规则、预制构件、受力路径和施工方法重新组合，直到壳体可以被分解、制造和安装。这个过程并不完美，也伴随争议，但它说明工程行业的核心不只是按图施工。真正的工程要在愿望与现实之间翻译：哪些形状能被建造，哪些材料能承受，哪些步骤能让危险变小。这个人叫 Ove Arup，他领导 Sydney Opera House 工程工作，并推动结构工程与建筑设计深度协作的现代实践。今天任何大胆设计落地时，都还要经过类似翻译：把愿望拆进材料、预算、工期、责任和可以被检验的安全边界里。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是工程及工程行业真正要追问的问题：结构、材料、系统、施工、维护和技术约束如何让设计变成可靠现实。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    knowledgePoint: "Engineering and engineering trades apply technical knowledge to electricity, mechanics, automation, materials, vehicles, and process systems.",
    knowledgePointZh: "工程及工程行业研究结构、材料、系统、施工、维护和技术约束如何让设计变成可靠现实。",
    reflectionQuestion: "What visible failure might be only the symptom of a hidden system under strain?",
    reflectionQuestionZh: "当一个想法看起来很美，你会从哪里开始判断它能不能被建成？",
    tags: ["diagnosis", "systems", "technical repair"],
    tagsZh: ["工程", "结构", "建筑协作"],
  },
  {
    id: "072-soup-that-travels",
    categoryCode: "07",
    groupCode: "072",
    groupTitleZh: "制造与加工",
    title: "The soup that had to travel",
    titleZh: "汽车底盘自己走过来",
    summary: "A soup recipe changed when it had to become safe, stable, packaged, and repeatable.",
    summaryZh: "一条移动装配线让制造从手工作坊转向节拍、标准化和大规模生产。",
    scene: "A small restaurant wanted to sell its soup in jars. The chef said the recipe was already perfect. The first delivery leaked and spoiled.",
    sceneZh: "1913 年的底特律工厂里，汽车底盘不再静静等工人围上来，而是沿着线缓慢移动。",
    storyBody: "They had to think about heat, sealing, shelf life, labeling, texture, and transport. Manufacturing and processing begin when making one good thing is no longer enough; the thing must survive repetition, storage, movement, and rules.",
    storyBodyZh: "他想解决的不是单台汽车能不能造出来，而是怎样让更多人买得起、怎样让每一步工作稳定重复。装配线把任务拆小，把零件标准化，把节拍固定，也把工人的动作纳入严格流程。这个方法提高产量、降低成本，同时也带来劳动单调、控制和工人压力等问题。制造与加工在这里变得现代：产品不是只由技术发明决定，还由流程、时间、供应链、工人技能和管理制度共同决定。这个人叫 Henry Ford，他在 Highland Park 工厂推广移动装配线，使汽车大规模生产成为 20 世纪制造业的重要范式。今天看一条生产线，也不能只看产量；还要看节拍怎样改变劳动、质量、价格，以及人和机器之间的关系。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是制造与加工最核心的问题之一：原料、流程、标准化、质量、储存、运输和重复生产。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。",
    knowledgePoint: "Manufacturing and processing transform raw materials into safe, stable, usable products through controlled methods and quality checks.",
    knowledgePointZh: "制造与加工关注原料、流程、标准化、质量、储存、运输和重复生产。",
    reflectionQuestion: "What changes when a handmade success has to become repeatable?",
    reflectionQuestionZh: "当一件商品变得便宜，是谁的时间、动作和自由被重新安排了？",
    tags: ["processing", "quality", "repeatability"],
    tagsZh: ["制造", "装配线", "标准化"],
  },
  {
    id: "073-crosswalk-at-school",
    categoryCode: "07",
    groupCode: "073",
    groupTitleZh: "建筑与施工",
    title: "The crosswalk near school",
    titleZh: "建筑必须站得住、用得上、看得动人",
    summary: "A dangerous crossing showed how built space shapes movement before anyone decides.",
    summaryZh: "一本古老建筑书把结构、功能和美感放在一起，成为建筑与施工的长久问题。",
    scene: "Parents complained that children ran across the street outside school. The city first blamed impatience, then watched the crossing for one morning.",
    sceneZh: "古罗马时期，一个建筑师和工程师回顾神庙、水道、机械和城市空间，试图把建造经验写给后来的人。",
    storyBody: "The nearest crosswalk was too far, the corner blocked sightlines, and parked cars narrowed the view. The solution involved curb design, markings, speed, drainage, and construction timing. Architecture and construction turn human movement into physical decisions.",
    storyBodyZh: "他不把建筑只看成墙和屋顶，也不把美当成表面装饰。一个建筑物必须坚固，能服务人的使用，也要有比例和秩序带来的美感。材料、地基、方向、公共用途、机械和人体尺度，都被放进同一套思考。建筑与施工的基础问题在这里很早就被说清：建造不是堆东西，而是在安全、用途、技术、气候、身体和文化之间达成一种可持久的安排。这个人叫 Vitruvius，他的《De architectura》提出 firmitas、utilitas、venustas 等思想，深刻影响建筑理论和建筑教育。学生读建筑时真正要练习的，正是这种同时看见结构、使用者和城市生活的能力。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未进一步细分的建筑与施工最核心的问题之一：空间、结构、材料、使用、施工和长期维护。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    knowledgePoint: "Architecture and construction plan and build physical environments, from buildings and towns to roads, structures, and civil systems.",
    knowledgePointZh: "未进一步细分的建筑与施工关注空间、结构、材料、使用、施工和长期维护。",
    reflectionQuestion: "Where does a place near you ask people to behave better than its design allows?",
    reflectionQuestionZh: "一座建筑如果只好看，却不好用或不安全，它还算真正完成了吗？",
    tags: ["built environment", "safety", "planning"],
    tagsZh: ["建筑", "施工", "Vitruvius"],
  },
  {
    id: "078-community-kitchen-build",
    categoryCode: "07",
    groupCode: "078",
    groupTitleZh: "工程、制造与建筑相关跨学科课程与资格",
    title: "The community kitchen build",
    titleZh: "一个圆顶能不能少用材料",
    summary: "A shared kitchen needed architecture, equipment, food safety, energy, and workflow together.",
    summaryZh: "一个几何圆顶把工程、制造、建筑和资源问题连接成同一个实验。",
    scene: "The community center wanted a kitchen for cooking classes. The first sketch had counters and sinks, but no one had discussed ventilation, storage, power load, or cleaning flow.",
    sceneZh: "20 世纪美国，一个总爱画结构线和地图的人，反复问怎样用更少材料覆盖更大空间。",
    storyBody: "The project changed when the cook, builder, electrician, cleaner, and teacher sat together. A kitchen is a room, a process, a safety system, and a learning environment. Interdisciplinary construction happens when all of those must work at once.",
    storyBodyZh: "他不是只想做奇特造型，而是着迷于效率：张力怎样分布，三角形为什么稳定，球面结构如何把重量分散，临时住房和大型空间能不能更轻、更快、更省。geodesic dome 把数学几何、结构工程、制造节点、建筑空间和资源伦理放在一起。它也不是万能答案，实际使用会遇到防水、维护、舒适和成本问题；但跨学科工程的价值正是在这里显现：一个形状同时要求几何、材料、建造、居住和社会理想共同受检验。这个人叫 Buckminster Fuller，他推广 geodesic dome，并以系统设计和“doing more with less”的思想影响工程、建筑和设计教育。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是工程、制造与建筑跨学科课程把结构、材料、生产、空间、资源和使使用的方法：用者需求放在同一问题里。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。圆顶的问题看似像几何游戏，真正牵动的却是住房、材料浪费和人类怎样更轻地占用世界。",
    knowledgePoint: "Inter-disciplinary engineering, manufacturing, and construction combine design, technical systems, materials, safety, and use.",
    knowledgePointZh: "工程、制造与建筑跨学科课程把结构、材料、生产、空间、资源和使用者需求放在同一问题里。",
    reflectionQuestion: "What space do you use that only works because several technical worlds cooperate invisibly?",
    reflectionQuestionZh: "一个结构如果更轻、更省，是否也必须更认真回答它怎样被人使用？",
    tags: ["integrated design", "safety", "workflow"],
    tagsZh: ["跨学科工程", "圆顶", "系统设计"],
  },
  {
    id: "079-unusual-repair-material",
    categoryCode: "07",
    groupCode: "079",
    groupTitleZh: "未另分类的工程、制造与建筑",
    title: "The bridge made from leftovers",
    titleZh: "臭味背后的城市系统",
    summary: "A small improvised bridge showed useful engineering outside standard categories.",
    summaryZh: "一次城市污水工程说明，未另分类的工程常在公共健康、土木、政治和日常生活之间展开。",
    scene: "After rain, a path flooded behind the garden. Volunteers built a small crossing from leftover boards and stones.",
    sceneZh: "1858 年伦敦夏天，泰晤士河臭气冲进议会，城市终于无法继续假装污水问题只是气味问题。",
    storyBody: "It looked informal, but they still tested wobble, water flow, surface grip, and weight. The bridge was not a textbook project, yet it carried real bodies. Some engineering knowledge appears in local repairs where safety and improvisation meet.",
    storyBodyZh: "他面对的是一个被城市增长放大的系统性麻烦：厕所、河流、潮汐、疾病、街道、预算、政治拖延和公众恐惧全缠在一起。解决方案不是清理一条水沟，而是设计截流下水道、泵站和排放系统，把污水从城市生活核心转移出去。今天我们会继续追问污染被转移到哪里、谁承担环境代价，但这个工程确实让现代城市意识到，基础设施决定公共健康。未另分类的工程、制造与建筑常常就发生在这种边界：它既是土木工程，也是卫生、行政、政治和城市生活的重新组织。这个人叫 Joseph Bazalgette，他设计伦敦现代下水道系统，成为城市基础设施和公共卫生工程史上的重要人物。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的工程、制造与建筑必须面对的问题：跨越基础设施、公共健康、材料、施工和治理的复杂项目。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    knowledgePoint: "Not elsewhere classified engineering and construction catches practical technical solutions that do not fit a standard industry label.",
    knowledgePointZh: "未另分类的工程、制造与建筑处理跨越基础设施、公共健康、材料、施工和治理的复杂项目。",
    reflectionQuestion: "What improvised fix near you contains more engineering than people admit?",
    reflectionQuestionZh: "一个城市最重要的工程，为什么常常是在你闻不到、看不见时才算成功？",
    tags: ["improvisation", "repair", "local engineering"],
    tagsZh: ["基础设施", "下水道", "公共健康"],
  },
  {
    id: "081-balcony-tomato-plan",
    categoryCode: "08",
    groupCode: "081",
    groupTitleZh: "农业",
    title: "The balcony tomato plan",
    titleZh: "种子不再随手撒出去",
    summary: "A tomato plant showed how growing food involves soil, timing, pests, and care.",
    summaryZh: "一台播种机让农业从凭经验撒播，转向行距、深度和效率的系统管理。",
    scene: "Rafi planted tomatoes on a balcony and watered them whenever he remembered. The plant grew tall, then weak, then covered itself in tiny insects.",
    sceneZh: "18 世纪英国农田里，一个农场主看见种子被随手撒开，很多被鸟吃掉，很多落在不合适的深度。",
    storyBody: "A neighbor asked about pot size, sunlight, feeding, pruning, and air movement. Agriculture was not simply affection for plants. It was the disciplined care of living production under changing conditions.",
    storyBodyZh: "他并不是只想做一台新机器，而是对土地上的浪费感到不安。种子如果能按固定深度、固定间距进入土壤，就更容易发芽，也便于后续除草和管理。他改进 seed drill，让播种变得更有秩序。今天看来，机械化也带来单一化和土地管理的新的问法，但这个故事说明农业的基础问题从来不是“把种子扔进地里”这么简单。它涉及工具、土壤、时间、劳动力和对生命条件的精确安排。这个人叫 Jethro Tull，他推广播种机和条播思想，成为英国农业改良史上的重要人物。今天的农业技术也常在同一个问题里打转：怎样提高效率，同时不把土地、种子多样性和人的判断都交给单一工具。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未进一步细分的农业最核心的问题之一：土地、作物、工具、劳动、产量和长期照料条件。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。",
    knowledgePoint: "Agriculture studies crop and livestock production, horticulture, soil, pests, feeding, and the systems that produce food and plant life.",
    knowledgePointZh: "未进一步细分的农业关注土地、作物、工具、劳动、产量和长期照料条件。",
    reflectionQuestion: "What does care become when the living thing also has to produce?",
    reflectionQuestionZh: "一个种子能否发芽，取决于运气，还是取决于人怎样安排它进入土地？",
    tags: ["production", "soil", "care"],
    tagsZh: ["农业", "播种机", "农艺"],
  },
  {
    id: "082-fallen-branch-trail",
    categoryCode: "08",
    groupCode: "082",
    groupTitleZh: "林业",
    title: "The fallen branch on the trail",
    titleZh: "森林不能只按木材计算",
    summary: "A fallen branch opened questions about forests as managed living systems.",
    summaryZh: "一个林务改革者让森林管理从砍伐收益，转向长期公共资源和专业治理。",
    scene: "After wind, a large branch blocked the trail. One walker wanted it removed immediately. Another noticed the insects already gathering under the bark.",
    sceneZh: "19 世纪末的美国，一个年轻人到欧洲学习林学后回国，看到大片森林被短期砍伐逻辑支配。",
    storyBody: "The ranger moved part of it for safety and left part nearby for habitat. Forestry is full of such decisions: timber, paths, disease, fire risk, biodiversity, and time scales longer than a single visit.",
    storyBodyZh: "他并不是反对使用森林，而是反对只把森林当作一次性矿藏。木材、水源、土壤、火灾、野生动物和地方经济都需要长期管理。他推动专业林务、国家森林和持续产出思想，主张为了公共利益管理自然资源。今天我们也会批判早期保护主义里对原住民和地方社区的忽视，但林业作为学科的一个核心问题由此凸显：森林的时间尺度比商业周期长得多。这个人叫 Gifford Pinchot，他是美国林务改革重要人物，首任 U.S. Forest Service 局长，并推动 conservation 林业理念。今天谈资源管理时，这个提醒仍然尖锐：如果只看眼前收益，森林很容易在账本里变短，在现实里变空。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是林业最核心的问题之一：森林资源、木材、生态、水土保持、火险、生物多样性和长期管理。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    knowledgePoint: "Forestry manages forests as ecological, economic, protective, and long-term living systems.",
    knowledgePointZh: "林业关注森林资源、木材、生态、水土保持、火险、生物多样性和长期管理。",
    reflectionQuestion: "When is leaving something alone also a form of care?",
    reflectionQuestionZh: "如果一片森林的生命超过几代人，谁有资格替它做短期决定？",
    tags: ["forest", "habitat", "long-term care"],
    tagsZh: ["林业", "森林管理", "保护"],
  },
  {
    id: "083-fish-market-morning",
    categoryCode: "08",
    groupCode: "083",
    groupTitleZh: "渔业",
    title: "The morning at the fish market",
    titleZh: "每一代人都以为海一直这么空",
    summary: "A fish stall connected weather, stock, freshness, ecosystems, and livelihoods.",
    summaryZh: "一个渔业科学家的警告让人看见，海洋资源的衰退常被记忆本身遮住。",
    scene: "At dawn, one fish stall was half empty. The seller said the wind changed, the boats stayed close, and the best fish never arrived.",
    sceneZh: "20 世纪后期，一个研究鱼类的人听到年轻渔民说收获还算正常，却在旧记录里看到完全不同的海。",
    storyBody: "Customers saw missing products. The seller saw tides, fuel, cold storage, regulations, spawning seasons, and families waiting for income. Fisheries knowledge lives between water ecosystems and human supply chains.",
    storyBodyZh: "他意识到一个危险：每一代人都把自己年轻时见到的鱼群数量当成“正常”。如果基准不断下降，大家就会在越来越贫瘠的海里继续觉得情况还可以。他提出 shifting baseline 的概念，提醒渔业不能只看今年和去年，还要看更长的生态记忆。渔业研究在这里不只是捕多少鱼，也要理解种群、食物网、捕捞压力、政策和人类记忆如何共同影响海洋。这个人叫 Daniel Pauly，他提出 shifting baseline syndrome，并通过全球渔业数据研究影响了现代渔业科学和海洋保护。这也是许多环境问题难被察觉的原因：失去不是一次发生的，而是在一代代“正常”的习惯里慢慢被接受。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是渔业最核心的问题之一：水域生态、鱼类种群、捕捞、养殖、冷链、政策和食物供应。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。",
    knowledgePoint: "Fisheries study aquatic production, harvesting, ecosystems, regulation, preservation, and the communities that depend on them.",
    knowledgePointZh: "渔业关注水域生态、鱼类种群、捕捞、养殖、冷链、政策和食物供应。",
    reflectionQuestion: "What food on a counter still carries the weather of where it came from?",
    reflectionQuestionZh: "你以为正常的自然状态，会不会其实已经是上一代衰退后的结果？",
    tags: ["aquatic systems", "supply", "livelihood"],
    tagsZh: ["渔业", "海洋", "基线"],
  },
  {
    id: "084-dog-that-stopped-eating",
    categoryCode: "08",
    groupCode: "084",
    groupTitleZh: "兽医",
    title: "The dog that stopped eating",
    titleZh: "第一所兽医学校的病马",
    summary: "A pet's changed appetite showed how animal care reads body, behavior, and environment.",
    summaryZh: "一次牲畜疫病危机让兽医从民间经验走向系统教育和公共经济安全。",
    scene: "Milo the dog skipped breakfast twice. His family blamed picky eating until the vet asked about movement, water, gums, stool, and a new plant in the hallway.",
    sceneZh: "18 世纪法国，牛马疫病不断造成损失，一个关心马术和动物疾病的人看见农业和军队都被牵动。",
    storyBody: "The diagnosis was not a single dramatic clue. It came from patterns across species knowledge, anatomy, behavior, and household context. Veterinary work listens to patients who cannot explain symptoms in words.",
    storyBodyZh: "动物生病不是只影响一个主人。马牵动交通和军队，牛牵动耕作、食物和家庭收入。传统马医经验有价值，却缺少系统解剖、病理、教学和公共防疫。他推动建立专门学校，让动物医学成为可训练、可研究、可传承的专业。兽医领域在这里清楚出现：它既照料动物个体，也保护畜群、食品、农业经济和人与动物共同生活的安全。这个人叫 Claude Bourgelat，他在 Lyon 创办世界最早的兽医学校之一，被视为现代兽医学教育的重要奠基人。今天的兽医工作也仍在这个交叉点上：一只动物的健康，常常连着食物安全、公共卫生和人与动物相处的伦理。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是兽医真正要追问的问题：动物疾病、诊断、治疗、公共卫生、畜群健康和人与动物关系。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    knowledgePoint: "Veterinary studies animal health, disease, treatment, welfare, species differences, and the human systems around animal care.",
    knowledgePointZh: "兽医研究动物疾病、诊断、治疗、公共卫生、畜群健康和人与动物关系。",
    reflectionQuestion: "How do you listen when the one who needs help cannot use your language?",
    reflectionQuestionZh: "当一头动物生病时，影响的只是它自己，还是整个食物和生活系统？",
    tags: ["animal health", "diagnosis", "care"],
    tagsZh: ["兽医", "动物健康", "兽医教育"],
  },
  {
    id: "088-farm-visit-class",
    categoryCode: "08",
    groupCode: "088",
    groupTitleZh: "农业、林业、渔业与兽医相关跨学科课程与资格",
    title: "The farm visit lesson",
    titleZh: "她看见牛害怕的影子",
    summary: "A farm visit connected plants, animals, soil, water, food, and responsibility.",
    summaryZh: "一个自闭症女性设计者把动物行为、工程、畜牧和福利放进同一套现场观察。",
    scene: "Students visited a small farm expecting cute animals. They left talking about feed, manure, water use, crop rotation, and veterinary visits.",
    sceneZh: "20 世纪后期的牧场和屠宰场里，一个年轻女性站在牲畜通道旁，注意到牛会被反光、阴影和突然的转角吓住。",
    storyBody: "The farmer explained that no decision stayed in one box. Changing feed affected manure; manure affected soil; soil affected crops; crops affected income. Interdisciplinary land-based learning shows the farm as a web of living consequences.",
    storyBodyZh: "她的感知方式和许多人不同，也让她更容易注意到动物在空间里的恐惧。她没有只责怪动物不听话，而是蹲到它们的视线高度，看光线、声音、地面、防滑、转弯和人的动作。她设计弧形通道和更低压力的处理系统，把动物行为学、工程设计、畜牧生产和伦理关怀放在一起。这个跨学科领域不只问怎样提高效率，也问人在利用动物时怎样减少恐惧和痛苦。这个人叫 Temple Grandin，她以畜牧设施设计和动物福利倡导闻名，推动农业、工程、兽医和动物行为之间的跨学科实践。学生从这里能学到，真正的专业不是把生命系统压服，而是愿意从另一个身体的位置重新检查设计。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是农业、林业、渔业与兽医跨学科课程要练习的连接能力：生产、生态、工程、动物健康、福利和资源管理。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。这条通道也把伦理带进工程：如果设计能减少恐惧，效率就不该建立在忽略恐惧之上。",
    knowledgePoint: "Inter-disciplinary agriculture, forestry, fisheries, and veterinary programmes link living production, ecology, animal care, and resource use.",
    knowledgePointZh: "农业、林业、渔业与兽医跨学科课程连接生产、生态、工程、动物健康、福利和资源管理。",
    reflectionQuestion: "What decision in a living system travels farther than the person making it expects?",
    reflectionQuestionZh: "如果从动物的视角重新看一条通道，人类的效率会不会也必须重新定义？",
    tags: ["land systems", "ecology", "interdependence"],
    tagsZh: ["跨学科", "动物福利", "畜牧工程"],
  },
  {
    id: "089-unusual-animal-garden",
    categoryCode: "08",
    groupCode: "089",
    groupTitleZh: "未另分类的农业、林业、渔业与兽医",
    title: "The rooftop beehive",
    titleZh: "冰山里的种子库",
    summary: "A rooftop beehive sat between gardening, animal care, ecology, and city rules.",
    summaryZh: "一个全球种子库说明，农业相关知识有时既是遗传保护，也是未来风险管理。",
    scene: "A restaurant kept beehives on its roof for herbs and honey. The neighbors loved the idea until someone was stung near the stairwell.",
    sceneZh: "21 世纪初的挪威斯瓦尔巴群岛，一群人把来自世界各地的种子样本送进冻土山体里的库房。",
    storyBody: "The owner had to learn bee behavior, plant cycles, allergy risk, signage, and local rules. The project was not simply agriculture or pet care. Some living practices in cities are hybrids that need careful naming.",
    storyBodyZh: "这个项目看起来像仓库，却不只是储藏。每一份种子都代表一种作物遗传资源，也代表某个地区的农业记忆和未来适应可能。战争、灾害、气候变化、病害和市场单一化，都可能让种子多样性消失。未另分类的农业、林业、渔业与兽医领域正需要这种边界意识：它不完全是种植，也不只是科研或外交，而是食物系统为未来保留选择。这个人叫 Cary Fowler，他长期推动作物多样性保护，并作为 Svalbard Global Seed Vault 的关键倡导者之一影响了全球种质资源保存。今天气候和供应链都变得不稳定时，这样的保存不只是科学工程，也是一种面向未来的责任安排。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的农业、林业、渔业与兽医需要保留下来的边界问题：跨越种质资源、食物安全、生态风险和长期保护的实践。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    knowledgePoint: "Not elsewhere classified land and animal fields include hybrid practices that combine cultivation, animal care, ecology, and local constraints.",
    knowledgePointZh: "未另分类的农业、林业、渔业与兽医收纳跨越种质资源、食物安全、生态风险和长期保护的实践。",
    reflectionQuestion: "What living practice around you does not fit the place it happens in?",
    reflectionQuestionZh: "为未来保存一粒种子，究竟是在保存食物，还是保存选择权？",
    tags: ["urban ecology", "hybrid practice", "local rules"],
    tagsZh: ["种子库", "食物安全", "遗传资源"],
  },
  {
    id: "091-cough-in-the-waiting-room",
    categoryCode: "09",
    groupCode: "091",
    groupTitleZh: "健康",
    title: "The cough in the waiting room",
    titleZh: "病床旁边的观察",
    summary: "A cough showed how health knowledge moves from symptom to body, risk, and treatment.",
    summaryZh: "古代医生把治疗从神秘解释拉向观察、记录和职业伦理。",
    scene: "In the waiting room, Amir said it was just a cough. The nurse asked how long, what time of day, what work he did, and whether stairs felt harder.",
    sceneZh: "古希腊的岛屿和城邦之间，一位医生走近发热、疼痛和呼吸困难的病人，先看他们实际怎样变化。",
    storyBody: "The symptom was small, but the questions widened it into a picture of lungs, environment, habits, infection, and care. Health fields begin where a body signal must be interpreted without reducing the person to the signal.",
    storyBodyZh: "他所处的时代，疾病常被解释成神灵惩罚或神秘力量。可他和传统中的同伴把注意力放到更具体的地方：症状何时开始，脉象和呼吸如何，饮食、季节、地点和体质有什么关系，医生应怎样谨慎判断而不伤害病人。许多文本并非都出自同一人之手，也带有时代局限；但健康领域的一个重要转向已经出现：照护身体需要观察、经验、记录和伦理约束，而不是只靠巫术或权威。这个人叫 Hippocrates，他所代表的 Hippocratic tradition 成为西方医学观察、临床伦理和医生职业形象的重要源头。这也是医学学习最早要守住的东西：先把人当作会变化的身体来看见，再谨慎决定知识该怎样介入。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未进一步细分的健康最核心的问题之一：身体状态、疾病、预防、照护、风险和健康判断。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    knowledgePoint: "Health includes medicine, nursing, diagnostics, therapy, pharmacy, dentistry, rehabilitation, and complementary approaches to human wellbeing.",
    knowledgePointZh: "未进一步细分的健康关注身体状态、疾病、预防、照护、风险和健康判断。",
    reflectionQuestion: "What symptom would be misunderstood if nobody asked about the life around it?",
    reflectionQuestionZh: "当一个人说不舒服时，最负责任的第一步是解释，还是观察？",
    tags: ["symptom", "diagnosis", "wellbeing"],
    tagsZh: ["健康", "医学传统", "观察"],
  },
  {
    id: "092-key-under-the-mat",
    categoryCode: "09",
    groupCode: "092",
    groupTitleZh: "福利",
    title: "The key under the mat",
    titleZh: "从摇篮到坟墓的报告",
    summary: "A hidden spare key revealed care, independence, risk, and social support.",
    summaryZh: "一份战时报告让福利从零散救济，转向覆盖人生风险的社会制度设计。",
    scene: "After her mother fell once, Sofia wanted a key to the apartment. Her mother hid one under the mat instead and insisted she was fine.",
    sceneZh: "1942 年的英国，战争仍在继续，一个经济学家把贫困、疾病、失业和养老放进同一份报告。",
    storyBody: "The family conversation was not only about safety. It was about privacy, pride, neighbors, emergency plans, and what help should feel like. Welfare work often lives in the space between protecting people and respecting their agency.",
    storyBodyZh: "他面对的不是某个家庭的一次困难，而是社会中反复出现的风险：没有工作、生病、年老、孩子多、收入不足。过去的救济常常零散、羞辱性强，也难以覆盖人生不同阶段。他提出更系统的社会保险和福利国家设想，试图对抗所谓“五大巨人”：贫困、疾病、无知、肮脏和失业。福利在这里不是施舍，而是现代社会如何共同分担风险、保障最低安全和人的尊严。这个人叫 William Beveridge，他的 1942 年 Beveridge Report 深刻影响英国福利国家和现代社会保障制度。今天讨论福利时，争论仍不只关于钱，而是一个人跌倒、生病、老去或失业时，社会愿不愿意留下承接他的结构。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未进一步细分的福利最核心的问题之一：社会支持、风险分担、尊严、照护和基本生活保障。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    knowledgePoint: "Welfare focuses on care, social work, counselling, child and youth services, elder support, disability support, and social wellbeing.",
    knowledgePointZh: "未进一步细分的福利关注社会支持、风险分担、尊严、照护和基本生活保障。",
    reflectionQuestion: "When does help start to feel like losing control, and how could it be redesigned?",
    reflectionQuestionZh: "一个社会怎样证明它不是只在成功时承认一个人？",
    tags: ["support", "agency", "social care"],
    tagsZh: ["福利", "社会保障", "风险"],
  },
  {
    id: "098-after-discharge-plan",
    categoryCode: "09",
    groupCode: "098",
    groupTitleZh: "健康与福利相关跨学科课程与资格",
    title: "The day after discharge",
    titleZh: "疼痛不是最后才处理的事",
    summary: "Leaving hospital required medicine, housing, family support, transport, and follow-up care.",
    summaryZh: "一位医生听见临终病人的整体痛苦，让健康与福利重新理解照护的终点。",
    scene: "Rosa was discharged on Friday. The medical note was clear, but the stairs at home, missing groceries, and confused bus route were not in the note.",
    sceneZh: "20 世纪英国，一位曾做护士和社工、后来学医的女性，坐在临终病人床边，认真听他们说疼痛和孤独。",
    storyBody: "A nurse, social worker, daughter, pharmacist, and community driver had to coordinate. Recovery was not only a clinical process; it was a living arrangement. Health and welfare meet when care has to survive outside the institution.",
    storyBodyZh: "她发现病人的痛苦并不只在身体里。疼痛、恐惧、家庭关系、宗教疑问、经济压力和被遗弃感会叠在一起。如果医学只在治愈失败后才想起照护，就太晚了。她提出 total pain 的理解，建立 hospice 照护，把症状控制、心理支持、家属陪伴、社会工作和尊严放在同一套体系里。健康与福利的跨学科意义在这里非常清楚：人不是一组器官，也不是一张福利表格，而是在生命末端仍需要被完整看见。这个人叫 Cicely Saunders，她创办 St Christopher's Hospice，并奠定现代 hospice 和 palliative care 的重要基础。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是健康与福利跨学科课程要练习的连接能力：医学、护理、心理、社会支持、家庭和人的尊严。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    knowledgePoint: "Inter-disciplinary health and welfare connects clinical care, social support, rehabilitation, counselling, access, and everyday living conditions.",
    knowledgePointZh: "健康与福利跨学科课程连接医学、护理、心理、社会支持、家庭和人的尊严。",
    reflectionQuestion: "What care plan fails if it only works inside a professional building?",
    reflectionQuestionZh: "当治愈不再可能时，照护还能怎样继续保护一个人的完整性？",
    tags: ["continuity of care", "support systems", "recovery"],
    tagsZh: ["跨学科", "临终关怀", "姑息治疗"],
  },
  {
    id: "099-neighborhood-listening-chair",
    categoryCode: "09",
    groupCode: "099",
    groupTitleZh: "未另分类的健康与福利",
    title: "The listening chair",
    titleZh: "她把战场护理带回和平时期",
    summary: "A simple chair outside a community center became informal care that did not fit a neat service box.",
    summaryZh: "一个战时救护组织者让健康与福利边界出现灾害、志愿服务和公共应急的混合实践。",
    scene: "Every afternoon, an older volunteer sat outside the community center. People stopped to talk before they were ready to ask for official help.",
    sceneZh: "美国南北战争期间，一个女性在战场附近分发物资、寻找伤员，也给家属传递生死消息。",
    storyBody: "She did not diagnose, counsel, or process forms. She listened, noticed patterns, and pointed people gently toward services. Some welfare work exists in the doorway before categories: not clinical, not administrative, but still protective.",
    storyBodyZh: "她不是只做临时善事。战争让她看到，伤员护理、物资协调、失踪人员信息、志愿者组织和灾后救援需要长期制度，而不该每次都从混乱开始。战后，她继续推动建立更稳定的人道救援组织，使救护从战争现场延伸到灾害、公共应急和社会支持。未另分类的健康与福利常常就站在这种边界：它既不是普通医院，也不是单一福利机构，而是在危机里把照护、信息、物资和组织能力接起来。这个人叫 Clara Barton，她创办 American Red Cross，并推动美国加入国际红十字人道救援体系。今天的灾害救援和社区支持仍在延续这条线：善意如果没有训练、记录和协调，很容易在真正紧急时散开。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的健康与福利必须面对的问题：那些跨越医疗、救援、信息、志愿组织和公共应急的支持实践。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    knowledgePoint: "Not elsewhere classified health and welfare includes informal or hybrid support practices that affect wellbeing but do not fit standard service labels.",
    knowledgePointZh: "未另分类的健康与福利处理那些跨越医疗、救援、信息、志愿组织和公共应急的支持实践。",
    reflectionQuestion: "What kind of help becomes possible before someone is ready to enter a system?",
    reflectionQuestionZh: "一场危机之后，怎样把临时善意变成下次能更快保护人的制度？",
    tags: ["informal care", "wellbeing", "access"],
    tagsZh: ["红十字", "救援", "健康福利"],
  },
  {
    id: "101-haircut-before-wedding",
    categoryCode: "10",
    groupCode: "101",
    groupTitleZh: "个人服务",
    title: "The haircut before the wedding",
    titleZh: "美容院里的红门",
    summary: "A haircut showed how personal services combine skill, trust, timing, and emotion.",
    summaryZh: "一个女性创业者把个人服务从私密修饰，变成品牌、培训和现代消费体验。",
    scene: "The groom arrived nervous, asking for the same haircut as last time, but his hands kept touching the photo of the wedding suit.",
    sceneZh: "20 世纪初的纽约，一个年轻女性在美容院里学习护肤、销售和顾客沟通，发现服务身体也在服务身份。",
    storyBody: "The barber asked about the collar, the weather, the photographs, and how formal he wanted to feel. The service was technical, but also personal. Personal services work close to identity, comfort, and the body's presentation in social life.",
    storyBodyZh: "她明白顾客来这里不只是买一瓶霜。她们想被认真接待，想学习如何照顾自己，也想进入一种新的城市女性形象。她建立美容院、培训销售人员、统一产品和服务话术，把个人服务组织成可复制的体验系统。这个过程当然也和消费主义、阶层和审美压力纠缠在一起；但它说明个人服务并不是低级边角行业，而是身体、情绪、身份、信任和商业组织相遇的地方。这个人叫 Elizabeth Arden，她建立全球美容品牌和 salon 服务体系，深刻影响现代个人护理和美容服务业。今天许多个人服务也是这样：看似处理外表或小需求，实际常在处理信任、身份、身体边界和被尊重的感觉。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是个人服务最核心的问题之一：身体、形象、舒适、沟通、身份和贴近日常生活的服务体验。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    knowledgePoint: "Personal services include domestic work, hair and beauty, hospitality, sports, travel, leisure, and other direct experience-based support.",
    knowledgePointZh: "个人服务关注身体、形象、舒适、沟通、身份和贴近日常生活的服务体验。",
    reflectionQuestion: "What service changes how someone enters a room, not just how they look?",
    reflectionQuestionZh: "当一个服务直接接触身体时，它是否也在接触一个人的自我想象？",
    tags: ["experience", "identity", "personal care"],
    tagsZh: ["个人服务", "美容", "品牌"],
  },
  {
    id: "102-clean-hands-station",
    categoryCode: "10",
    groupCode: "102",
    groupTitleZh: "卫生与职业健康服务",
    title: "The handwashing station",
    titleZh: "城市空气、污水和实验室",
    summary: "A temporary handwashing station showed hygiene as design, habit, and workplace safety.",
    summaryZh: "一位卫生学家把公共卫生训练制度化，让卫生服务成为城市和工作场所的专业知识。",
    scene: "At a street food event, the handwashing station was placed behind a stack of boxes. Staff used it less, even though everyone agreed it mattered.",
    sceneZh: "19 世纪德国城市里，人口密集、污水和传染病让医学无法只待在病床旁。",
    storyBody: "Moving it into the workflow changed behavior faster than another reminder poster. Hygiene and occupational health services often depend on making the safe action the easy action.",
    storyBodyZh: "他关心空气、水、住房、排污和城市环境，也建立实验和教学体系，让卫生不只是日常清洁习惯，而成为可研究、可训练、可争论的公共专业。他的某些理论后来被修正，特别是在病菌理论发展后；但他推动卫生学进入大学、实验室和城市治理的努力，说明卫生与职业健康服务的基础意义：预防必须发生在疾病出现之前，发生在水、空气、建筑、工作和制度中。这个人叫 Max von Pettenkofer，他建立慕尼黑卫生学研究传统，被视为现代 hygiene 和公共卫生教育的重要先驱之一。今天的卫生服务依然需要这种宽视角：空气、水、垃圾、实验室和制度如果分开处理，风险就会从缝隙里回来。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未进一步细分的卫生与职业健康服务最核心的问题之一：预防、环境、工作场所、清洁和群体健康条件。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    knowledgePoint: "Hygiene and occupational health services protect people through sanitation, prevention, safety systems, and healthy work environments.",
    knowledgePointZh: "未进一步细分的卫生与职业健康服务关注预防、环境、工作场所、清洁和群体健康条件。",
    reflectionQuestion: "Where does safety fail because the safer action is inconvenient?",
    reflectionQuestionZh: "真正的卫生服务，是在你生病后出现，还是在你没生病前就已经工作？",
    tags: ["hygiene", "workplace safety", "prevention"],
    tagsZh: ["卫生", "公共卫生", "预防"],
  },
  {
    id: "103-night-watch-call",
    categoryCode: "10",
    groupCode: "103",
    groupTitleZh: "安全服务",
    title: "The night watch call",
    titleZh: "警察为什么应该穿制服",
    summary: "A late-night noise complaint showed security as judgment, prevention, and proportion.",
    summaryZh: "一个内政改革者把安全服务从临时镇压，推向可识别、可约束的公共警务。",
    scene: "At midnight, a guard received a call about noise in the parking area. It could be teenagers, a car problem, or something more serious.",
    sceneZh: "19 世纪伦敦街头，城市快速扩张，犯罪、贫困、拥挤和公众恐惧让旧式治安方式越来越不够。",
    storyBody: "He checked cameras, called a colleague, approached with light visible, and kept distance before speaking. Security work is not only force. It is assessing risk while avoiding unnecessary escalation.",
    storyBodyZh: "他要解决的不是单次抓捕，而是一个城市怎样在不变成军营的情况下维持公共秩序。新警察需要可识别的制服、巡逻、纪律、预防原则和公众信任。这个制度也一直伴随权力滥用、阶级控制和监督问题，必须被批判地看；但现代安全服务的一个核心矛盾已经出现：保护公众需要权力，而权力又必须被规则、透明和责任约束。这个人叫 Robert Peel，他创立 London Metropolitan Police，并使现代公共警务原则成为安全服务史上的重要起点。今天谈公共安全时，这个问题仍然没有过时：制服让权力可见，也要求权力被规则、责任和公众信任约束。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未进一步细分的安全服务最核心的问题之一：风险识别、预防、响应、秩序、信任和权力约束。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    knowledgePoint: "Security services include defence, protection of persons and property, risk assessment, preparedness, and safe response.",
    knowledgePointZh: "未进一步细分的安全服务关注风险识别、预防、响应、秩序、信任和权力约束。",
    reflectionQuestion: "When does protection require slowing down instead of reacting fast?",
    reflectionQuestionZh: "一个安全系统怎样既保护人，又不让保护人的权力失去边界？",
    tags: ["risk", "protection", "response"],
    tagsZh: ["安全服务", "警务", "公共秩序"],
  },
  {
    id: "104-missed-connection",
    categoryCode: "10",
    groupCode: "104",
    groupTitleZh: "运输服务",
    title: "The missed connection",
    titleZh: "地铁线路为什么可以弯成图",
    summary: "A missed bus connection revealed transport as timing, reliability, access, and coordination.",
    summaryZh: "一张地铁图让运输服务从真实距离，转向乘客能不能迅速做出决定。",
    scene: "Marta missed her second bus because the first one arrived six minutes late. The timetable said the route worked; her appointment said otherwise.",
    sceneZh: "1930 年代伦敦，一个工程制图员看着复杂地铁线路，发现按真实地理画出的地图让乘客很难读。",
    storyBody: "The transport office looked at transfer windows, wheelchair boarding time, traffic lights, driver breaks, and real passenger patterns. Transport is not movement alone. It is the promise that people and goods can arrive with enough reliability to plan a life around it.",
    storyBodyZh: "他大胆舍弃精确距离，把线路画成水平、垂直和 45 度角，把站点间距简化，让换乘关系变得清楚。这个图一开始并不符合传统地图直觉，却更符合乘客在运输系统里的真实需要：我在哪，去哪换，下一站怎么走。运输服务在这里不仅是车辆移动，也包括信息设计、时间承诺、可达性和人在压力下的判断。一个系统如果让人看不懂，再准时也会让人迷失。这个人叫 Harry Beck，他设计 London Underground diagram，成为现代交通信息设计和运输服务体验的经典案例。今天的交通系统也一样：真正好用的不只是车会动，而是人在匆忙、陌生和压力下仍能做出清楚选择。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是运输服务最核心的问题之一：人和物的移动、换乘、可靠性、信息设计、安全和时间协调。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    knowledgePoint: "Transport services organize movement through routes, schedules, logistics, safety, reliability, access, and coordination.",
    knowledgePointZh: "运输服务关注人和物的移动、换乘、可靠性、信息设计、安全和时间协调。",
    reflectionQuestion: "What part of your day depends on a transport promise you rarely see?",
    reflectionQuestionZh: "一个交通系统真正好用，是因为路短，还是因为人在压力下也能看懂？",
    tags: ["mobility", "reliability", "coordination"],
    tagsZh: ["运输", "地图", "信息设计"],
  },
  {
    id: "108-festival-operations-plan",
    categoryCode: "10",
    groupCode: "108",
    groupTitleZh: "服务相关跨学科课程与资格",
    title: "The festival operations plan",
    titleZh: "服务蓝图背后的看不见动作",
    summary: "A small festival needed hospitality, sanitation, transport, security, and customer care together.",
    summaryZh: "一个营销学者把服务拆成前台、后台和证据，让跨学科服务可以被设计和改进。",
    scene: "The festival team first booked musicians. Then came toilets, food queues, lost children, rain plans, delivery trucks, and elderly seating.",
    sceneZh: "20 世纪 80 年代，一位研究者观察服务现场，发现顾客看到的只是整个系统露出水面的部分。",
    storyBody: "The event worked only when services were designed as one experience. A clean toilet, a clear sign, a safe exit, and a warm greeting all belonged to the same promise: people should be able to be there without fighting the system.",
    storyBodyZh: "一次酒店入住、银行开户或维修预约，看起来是几句对话，背后却有表格、系统、培训、库存、授权、等待时间和失败补救。她提出 service blueprint，把顾客行为、前台接触、后台流程和有形证据画在一起。这样，服务不再只是态度好不好，而成为可以分析、设计和跨部门协调的系统。服务跨学科课程也由此清楚：运营、心理、空间、信息、人员和技术必须同时工作。这个人叫 G. Lynn Shostack，她提出 service blueprinting，成为服务设计和服务营销中的重要方法来源。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是服务跨学科课程要练习的连接能力：运营、体验、人员、空间、信息、技术和质量管理。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。如果只评价前台那一句话，很多服务失败就会被误判；真正要看的，是前台背后有没有足够清楚的流程在托住它。",
    knowledgePoint: "Inter-disciplinary services coordinate several service domains around a complete user experience and real operating conditions.",
    knowledgePointZh: "服务跨学科课程连接运营、体验、人员、空间、信息、技术和质量管理。",
    reflectionQuestion: "What event feels easy only because many services are quietly aligned?",
    reflectionQuestionZh: "一次服务失败时，问题真的在前台那个人身上，还是在蓝图里早就埋好了？",
    tags: ["operations", "experience", "service systems"],
    tagsZh: ["服务设计", "蓝图", "跨学科"],
  },
  {
    id: "109-service-that-had-no-name",
    categoryCode: "10",
    groupCode: "109",
    groupTitleZh: "未另分类的服务",
    title: "The service with no name",
    titleZh: "电话那头先不急着劝",
    summary: "A volunteer at the station helped people in a way no official service label quite captured.",
    summaryZh: "一个倾听热线说明，有些服务最重要的动作，是在正式分类之前先接住人。",
    scene: "At the train station, Lian helped travelers read signs, calm children, find elevators, and decide when to ask staff. Her badge simply said volunteer.",
    sceneZh: "1950 年代伦敦，一个牧师在报纸上看到年轻人因孤立和羞耻而走向绝望，开始想象一条任何人都能拨打的电话线。",
    storyBody: "She was not security, transport staff, tourism office, or social worker. Yet the station worked better because she stood between categories. Some services matter precisely because they catch the human needs no single desk owns.",
    storyBodyZh: "他发现，许多人并不是一开始就能走进医院、警局、福利机构或教堂。他们可能只需要一个不审判、不急着训诫、愿意在深夜听完的人。于是志愿者被训练去接电话，重点不是立刻给答案，而是让来电者在最危险、最孤单的时刻不再独自承受。这样的服务很难归类：它不是普通医疗，也不是正式咨询，不是安保，也不是家政；但它在许多系统之间守住了一条细小通道。未另分类的服务正需要容纳这种看似无名却极其关键的支持。这个人叫 Chad Varah，他创立 Samaritans，让危机倾听热线成为现代志愿服务和情绪支持服务的重要形式。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的服务需要认真追问的问题：未另分类的服务包括那些跨越医疗、咨询、社区、志愿和即时支持的实践角色。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    knowledgePoint: "Not elsewhere classified services include practical support roles that improve experience but do not fit standard service categories.",
    knowledgePointZh: "未另分类的服务包括那些跨越医疗、咨询、社区、志愿和即时支持的实践角色。",
    reflectionQuestion: "Where does the most useful help happen between official roles?",
    reflectionQuestionZh: "一种服务如果只是先听你说完，它为什么仍然可能改变一个夜晚的结局？",
    tags: ["informal service", "access", "human support"],
    tagsZh: ["未分类服务", "倾听", "志愿服务"],
  },
];

const fieldStoryDetailsZh = {
  "0111": ["教育科学", "孩子们自己搬动的小椅子", "1907 年，罗马圣洛伦佐一栋普通公寓里，一群白天无人照看的孩子被带进一间新教室。", "教育科学用观察、证据和设计研究学习如何发生，而不只是规定别人应该怎样学。", "如果一个孩子没有学进去，你会先要求他更努力，还是先检查环境有没有给他进入学习的路？", "来接手这间教室的女医生，年轻时并没有把“当老师”当成唯一出路。她先学工程，后来转向医学，进入当时很少有女性能进入的医学院；在医院和精神病院工作时，她看见一些被认为“学不会”的孩子，其实只是长期缺少适合他们动手、感知和尝试的环境。到了这间公寓教室，她没有急着把孩子排成整齐队伍。小椅子、小桌子、一个炉子、一些被锁在柜子里的材料，孩子们有的擦桌子，有的照看小花园，有的反复摸一块字母板。她站在旁边看：哪个材料会被孩子拿起，什么时候他们能安静很久，什么时候大人的一句打断反而让学习散掉。她慢慢发现，孩子并不是等待灌满的空杯子；桌椅的高度、材料的顺序、身体能不能自由移动、成人愿不愿意先观察，都会改变学习的发生方式。这个人叫 Maria Montessori，她在罗马开办 Casa dei Bambini，发展出蒙台梭利教育，让“观察儿童、准备环境、尊重发展节奏”成为教育科学的重要线索。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是教育科学用观察、证据和设计真正要追问的问题：学习如何发生，而不只是规定别人应该怎样学。所以它不只是教育史的一页，也是在提醒老师和学生：先观察学习怎样发生，再决定怎样介入。", "一间普通公寓里的小椅子，让教育从命令孩子学习，转向观察学习如何发生。", "Maria Montessori 原是医生；第一所 Casa dei Bambini 于 1907 年 1 月 6 日在罗马 San Lorenzo 开办；她通过观察儿童自由活动、调整材料和环境，逐步形成后来影响世界的 Montessori 教育方法。"],
  "0112": ["学前教师培养", "木球滚到孩子手边", "1837 年，德国 Bad Blankenburg 的一间小屋里，一个教育者把木球、积木、纸片和花园活动摆到孩子面前。", "学前教师培养关注幼儿发展、照护、安全、游戏、早期学习，以及成人如何陪伴孩子进入世界。", "当一个小孩在玩，你看见的是消遣，还是一种需要被理解和引导的学习？", "很多大人看见孩子玩，只会觉得那是消遣。那个教育者却没有急着把孩子拉回所谓正经学习。他看见一个孩子握住木球，又把它滚出去；另一个孩子把方块叠起来，再推倒重来；还有孩子把线穿过纸面，像是在用手指慢慢理解形状、方向和秩序。他停下来，看得比别人久了一点。他年轻时并不是一路从学校走向学校的人。他接触过自然、矿物、建筑和测量，也曾学习儿童教育思想。也许正因为这样，他看幼儿时，不只看见“不懂事的小孩”，还看见身体、材料、空间和节奏正在一起工作。问题开始变得不一样了：孩子真的只是在玩吗？还是正在用手、眼睛、声音和身体，练习理解世界？后来，他开始设计一套材料和活动，让孩子可以通过游戏感知形状、数量、关系和自然，也让照看孩子的成人学会怎样陪伴，而不是急着打断。很多年后，人们回头谈幼儿园的起点，常会提到这个名字：Friedrich Froebel。藏在这个故事里的，是学前教师培养最核心的问题之一：幼儿不是等着被灌输知识的小人，他们通过游戏、材料、动作和关系进入世界。成人的专业，不只是看住孩子，而是看懂孩子正在怎样学习，并为这种学习准备安全、丰富、合适的环境。", "一只木球让幼儿教育从“看管孩子”，走向理解游戏、材料和早期发展。", "Friedrich Froebel 于 1837 年在 Bad Blankenburg 开办面向幼儿的 play and activity institute，并在 1840 年使用 Kindergarten 一词。他设计的 Froebel Gifts 包括几何积木等材料，强调唱歌、舞蹈、园艺、自主游戏和儿童活动的教育价值。"],
  "0113": ["无学科专门化教师培养", "只有三名学生的师范学校", "1839 年 7 月，马萨诸塞州 Lexington 的一所新学校开门时，第一批学生少到几乎不像一所学校。", "无学科专门化教师培养训练通用教学能力、课堂组织、学习观察、反馈、沟通和儿童发展理解。", "什么样的教学能力不属于任何一门课，却决定所有课能不能发生？", "这所学校的第一位负责人，原本长期在学校和教会之间工作。他在岛上办过学校，也做过牧师，见过太多真实课堂里的小麻烦：孩子会走神，会害怕，会同时处在不同进度，课堂也会因为一个问题没有说清楚而乱掉。那时很多人以为，只要一个人会读、会算、有品行，就自然能当老师。可他越来越明白，教师不是临时站上讲台的人，而是要学习怎样提问、怎样安排一节课、怎样观察学生是否真的明白、怎样让纪律不是恐惧，而是学习可以继续发生的秩序。最初只有少数学生，反而让这个实验更像是一次安静的试问：老师是不是也需要被系统训练？这个人叫 Cyrus Peirce，他受 Horace Mann 邀请主持 Lexington normal school，让无学科专门化教师培养从“会知识的人去教”转向“教师本身需要被训练”。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是无学科专门化教师培养要培养的能力：通用教学能力、课堂组织、学习观察、反馈、沟通和儿童发展理解。所以它不只是教育史的一页，也是在提醒老师和学生：先观察学习怎样发生，再决定怎样介入。", "一所只有少数学生起步的师范学校，让教师培养从“会知识的人去教”，走向“教师本身需要被训练”。", "1839 年 7 月，Massachusetts 在 Lexington 建立实验性 normal school，常被称为美国第一所公立师范学校；Cyrus Peirce 是第一任负责人，Horace Mann 是 Massachusetts 公共教育改革的重要推动者。学校初期学生很少，后来发展为 Framingham State University 的历史源头。"],
  "0114": ["有学科专门化教师培养", "教授把高等数学带回中学课堂", "20 世纪初的 Göttingen，一个数学教授发现，中学数学老师常站在两座桥之间：一边是大学数学，一边是学生眼前的题。", "有学科专门化教师培养把深层学科理解和教学方法结合起来，让老师知道怎样把一门学科教给第一次进入它的人。", "懂一门学科和教会一门学科，中间究竟隔着哪一种知识？", "这位数学家年轻时已经在几何研究里很出名，后来在 Göttingen 组织讲座、研讨班和研究机构。他越接近大学数学的深处，越觉得中学数学不该只是被切碎的公式。一个函数、一条曲线、一个证明，在专家眼里已经很自然，在学生眼里却可能像一堵墙。老师如果只会做更难的题，并不一定会教会学生；但如果老师能看见学校数学背后的结构、联系和来处，就能把抽象知识翻译成学生一步步能进入的路径。于是他把“从更高观点看初等数学”的想法带给教师，不是为了炫耀难度，而是为了让学科深度回到课堂。这个人叫 Felix Klein，他推动数学教师教育和国际数学教育改革，让有学科专门化的教师培养意识到：老师要知道答案，也要知道学生怎样抵达答案。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是有学科专门化教师培养要完成的转换：把深层学科理解和教学方法结合起来，让老师知道怎样把一门学科教给第一次进入它的人。这让今天的教室重新变得具体：学习不是把内容倒进学生脑子里，而是在环境、材料、关系和节奏中慢慢发生。", "Felix Klein 让学科教师培养看见：真正会教一门课，需要把学科深度翻译成学生能进入的路径。", "Felix Klein 在 Göttingen 推动数学教育改革；1893 年 Göttingen 设立数学教育相关讲席；ICMI 于 1908 年成立，Klein 成为首任主席。他的《Elementary Mathematics from an Advanced Standpoint》于 1908、1909 年出版，影响了数学教师如何连接高等数学与学校数学。"],
  "0119": ["未另分类的教育", "工人把自己的词写上黑板", "1963 年，巴西 Angicos 的夜晚，一些甘蔗工人下班后坐进识字班，黑板上写的不是陌生例句，而是他们生活里的词。", "未另分类的教育收纳那些真实支持学习、但不适合标准学校、课程或学科标签的教育形式。", "哪些学习发生在正式课程之外，却真正改变了一个人看世界的方式？", "这位教育者小时候也经历过贫困和饥饿，他后来回忆，学不会有时不是因为一个人笨，而是因为生活条件把注意力和尊严都压得太低。长大后，他先做语言教师，又在成人教育里工作，越来越不相信那种把学生当空罐子的课堂。传统识字课常从课本句子开始，像是把世界先关在门外。他反过来做：先听人们平时说什么，工作里用什么词，害怕什么，想改变什么，再把这些词变成识字和讨论的入口。学习字母的同时，人也开始讨论土地、劳动、权利和沉默。识字不再只是技术，它变成一种重新说出自己生活的能力。这个人叫 Paulo Freire，他用 Angicos 成人识字实践和《Pedagogy of the Oppressed》影响了成人教育、批判教育学和社区学习。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是未另分类的教育需要保留下来的边界问题：那些真实支持学习、但不适合标准学校、课程或学科标签的教育形式。所以它不只是教育史的一页，也是在提醒老师和学生：先观察学习怎样发生，再决定怎样介入。", "Angicos 的夜校让教育不只是识字技术，也成为人重新命名生活和参与社会的入口。", "Paulo Freire 在巴西东北部发展成人识字方法。1963 年 Angicos 实验中，约 300 名甘蔗工人在短期课程中学习读写；Freire 后来提出“banking model of education”的批判，并在 1968 年出版《Pedagogy of the Oppressed》，成为批判教育学的重要文本。"],
  "0211": ["视听技术与媒体制作", "工厂门口走出来的人群", "1895 年，法国一家照相器材厂门口，工人们下班离开，画面普通到几乎不像一件大事。", "视听技术与媒体制作关注影像、声音、剪辑、设备、传播和技术如何共同制造可感知的现实。", "当一个普通瞬间被机器记录下来，它还是原来的瞬间吗？", "那对兄弟从小生活在摄影工业里，家里做感光材料和照相器材。他们并不是一开始就想拍大片，也没有明星、剧情和宏大布景。真正让人震动的是一个很小的技术问题：怎样让连续照片被拍下、显影、放映，并让一群陌生人同时看见“时间在动”。他们把机器、胶片、放映和公开观看连在一起，让工厂门口、火车进站、婴儿吃饭这些普通场面突然有了新的力量。观众不是只看图像，而是在黑暗房间里共同经历运动、时间和注意力。视听技术从这里变得清楚：技术不是冷冰冰的设备，它会改变人如何记住一件事、相信一件事、一起观看一件事。这个人叫 Auguste Lumiere 和 Louis Lumiere，他们改进并推广 cinematograph，1895 年的放映实践成为电影和视听媒体史上的关键起点。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是视听技术与媒体制作最核心的问题之一：影像、声音、剪辑、设备、传播和技术如何共同制造可感知的现实。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一段普通工厂门口的影像，让电影从技术实验变成集体观看经验。", "Lumiere 兄弟在 1895 年公开放映多部短片，其中包括 Workers Leaving the Factory。cinematograph 兼具摄影机、洗印和放映相关功能，被视为早期电影技术和公共放映史的重要节点。"],
  "0212": ["时装、室内与工业设计", "墙纸上的野草", "19 世纪英国，一个爱读诗、爱看中世纪故事的年轻人，走进工业时代的房间，却总觉得日用品正在失去人的手。", "时装、室内与工业设计把身体、空间、材料、功能、生产和审美放在同一个问题里。", "你每天使用的东西，是只被制造出来，还是也被认真理解过？", "他不是单纯反对机器，而是反对人和物之间的关系被粗糙地切断。漂亮不该只属于画廊，桌布、墙纸、椅子、书页、窗帘和房间的比例，也会影响一个人怎样生活。于是他开始研究染料、织物、木工、印刷和图案，让植物的枝叶重新爬上墙面，让手工的节奏回到家庭内部。他的理想有矛盾：手工产品常常昂贵，未必真的能让普通人都买得起。但他提出的问题仍然尖锐：如果生活中的物件都没有尊严，人怎么在日常里学习美感和自由？设计从这里不再只是“好看”，而是追问材料、劳动、使用者和社会理想之间的关系。这个人叫 William Morris，他是 Arts and Crafts movement 的核心人物之一，用家具、墙纸、纺织和书籍设计影响了现代室内与工业设计观念。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是时装、室内与工业设计要完成的转换：把身体、空间、材料、功能、生产和审美放在同一个问题里。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。", "一张墙纸上的植物纹样，让设计不再只是装饰，而是关于劳动、生活和尊严的问题。", "William Morris 是英国 Arts and Crafts movement 的关键人物。他创办设计公司，制作家具、墙纸、纺织品和书籍等，强调手工、材料、自然图案和日常生活中的美。"],
  "0213": ["美术", "苹果为什么总是画不稳", "法国南部一个银行家家庭的儿子，本来被期待走向稳定职业，却一次次回到画布前，盯着苹果、桌布和一座山。", "美术训练观察、构图、色彩、材料、形式和对可见世界的重新解释。", "当你反复看同一个苹果，它会不会开始动摇你对“看见”的理解？", "他在巴黎受过冷落，也被展览体系拒绝过很久。别人画苹果，可能追求像；他画苹果，却像是在追问视觉本身为什么不稳定。桌面微微倾斜，盘子好像要滑落，色块彼此推挤，山体在光里变成结构。很多人起初看不懂，觉得这些画笨拙、不完整、不够讨好。可是他慢慢让后来者看见：绘画不必只是复制眼前物，也可以把观看拆开，重新组织成形、色、重量和时间。美术在这里变成一种极其诚实的训练：我到底看见了什么？我用什么方式把它放到画面上？这个人叫 Paul Cezanne，他通过静物、风景和结构化的观看影响了现代绘画，被后来的艺术家视为通往现代主义的重要桥梁。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是美术要培养的能力：观察、构图、色彩、材料、形式和对可见世界的重新解释。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一只反复被观看的苹果，让美术从再现世界转向研究观看本身。", "Paul Cezanne 长期以静物、人物和 Mont Sainte-Victoire 等主题作画。他对形体结构、色块关系和观看方式的探索深刻影响立体主义和现代艺术，常被称为现代绘画的重要先驱。"],
  "0214": ["手工艺", "一只无名陶碗", "20 世纪初，日本城市快速现代化时，一个年轻思想者在朝鲜陶器和普通民间器物面前停了下来。", "手工艺连接材料、手感、传统、功能、地域经验和日常美感。", "一件没有作者签名的碗，为什么仍然可能改变审美史？", "他看到的不是昂贵古董，也不是宫廷珍品，而是普通人使用过的碗、盘、织物和木器。它们常常没有署名，价格不高，用途明确，形状朴素，却有一种无法被炫耀替代的安静力量。在工业化和精英艺术的夹缝里，他开始为这些“无名之物”辩护：手工艺的美不只是技巧表演，而是材料、用途、地方传统和长期重复劳动共同沉淀出来的东西。这种观点也需要今天继续批判地阅读，因为“民艺”容易浪漫化劳动者；但它至少提醒我们，知识不只在大师签名里，也在手掌、窑火、工具和日常使用的磨痕里。这个人叫 Yanagi Soetsu，他提出 mingei 理念并推动日本民艺运动，让普通人的手工艺成为现代审美和文化研究的重要对象。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是手工艺要练习的连接能力：材料、手感、传统、功能、地域经验和日常美感。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。", "一只无名陶碗，让手工艺从小技能变成关于材料、劳动和日常美的思想。", "Yanagi Soetsu 是日本 mingei 民艺运动的核心思想者，强调普通民众日用手工艺中的美，并于 1936 年推动建立日本民艺馆。mingei 理念关注匿名工匠、自然材料、功能性和地域传统。"],
  "0215": ["音乐与表演艺术", "演员为什么不该只朝观众喊", "19 世纪末的莫斯科，一个热爱舞台的年轻人站在剧场里，越来越受不了那种夸张、空洞、只顾展示嗓门的表演。", "音乐与表演艺术关注声音、身体、节奏、角色、现场、训练和观众之间的关系。", "一次表演什么时候开始像真实生活，而不只是熟练展示？", "他出身并不贫寒，家里有条件让他接触剧场，也正因此，他早早看见舞台上最虚假的部分。演员站到台口，等提词人喂词，再用漂亮声音把台词甩给观众；角色之间并不真的互相听见。于是他开始记录自己的失败：什么时候情绪是装出来的，什么时候身体先于理解，什么时候一个角色有目标，表演才不再散掉。他把排练室当实验室，让演员追问“我在这个时刻想要什么”，练习注意力、行动、动机和真实交流。表演艺术在这里不再只是天赋和嗓音，而是一套可以反复训练的内在行动。这个人叫 Konstantin Stanislavski，他共同创办 Moscow Art Theatre，并发展出影响现代戏剧与电影表演训练的 Stanislavski system。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是音乐与表演艺术最核心的问题之一：声音、身体、节奏、角色、现场、训练和观众之间的关系。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一个演员对空洞表演的不满，发展成现代演员训练的重要方法。", "Konstantin Stanislavski 于 1898 年与 Vladimir Nemirovich-Danchenko 共同创办 Moscow Art Theatre。他发展出的 Stanislavski system 强调行动、动机、注意力、真实体验和系统化排练，对现代戏剧及后来的表演训练影响深远。"],
  "0219": ["未另分类的艺术", "被转过方向的小便池", "1917 年纽约，一个艺术家把一件普通洁具换了方向，签上化名，送去一个号称开放的展览。", "未另分类的艺术容纳跨媒介、观念性、临时性和难以归档的创作。", "如果一件东西没有被手工制作，却迫使你重新定义艺术，它还算作品吗？", "他年轻时已经厌倦了只靠手艺和风格来判断艺术。那件东西不是雕刻出来的，也没有传统意义上的美；它的冲击来自选择、挪用、命名、展示位置和制度反应。展览规则说付费即可展出，但作品没有被摆出来。争论由此开始：艺术到底在物体里，还是在艺术家的选择、观众的判断、展览制度和问题本身里？未另分类的艺术常常就站在这个尴尬位置上。它让目录不舒服，却也迫使目录承认，有些作品的重要性不来自“像不像艺术”，而来自它让艺术边界暴露出来。这个人叫 Marcel Duchamp，他以 Fountain 和 readymade 观念深刻改变了 20 世纪艺术对作品、作者和制度的理解。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是未另分类的艺术需要认真追问的问题：未另分类的艺术容纳跨媒介、观念性、临时性和难以归档的创作。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。", "一件被移位的日用品，让艺术边界本身变成作品的一部分。", "Marcel Duchamp 于 1917 年以 R. Mutt 名义提交 Fountain，这件 readymade 作品由普通小便池构成，被视为 20 世纪观念艺术和先锋艺术的重要转折点之一。"],
  "0221": ["宗教与神学", "修士写给主教的一封信", "1517 年的德意志，一个年轻神学教师听见普通人谈论赎罪券，心里越来越不安。", "宗教与神学研究信仰、仪式、经典文本、教义、共同体、救赎和终极意义。", "当一种宗教实践让普通信徒误解信仰本身时，神学应该保持沉默吗？", "他原本是修道院里极其认真的人，对罪、良心和救赎有近乎痛苦的敏感。他不是一开始就想制造席卷欧洲的风暴，而是先从牧灵问题出发：如果人们以为钱可以买到灵魂的安心，那么悔改、信心、恩典和教会权威到底被理解成了什么？于是他写下用于学术辩论的条目，寄给教会高层，也很快被印刷和传播。接下来的历史远比他最初能控制的复杂，带来了信仰更新，也带来冲突、政治利用和痛苦分裂。宗教与神学在这里显示出重量：它不是抽象词语，而是普通人的恐惧、希望、权威和文本解释如何组织生活。这个人叫 Martin Luther，他的 Ninety-five Theses 成为 Protestant Reformation 的标志性起点之一，也深刻改变了欧洲宗教、教育和公共文化。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是宗教与神学真正要追问的问题：信仰、仪式、经典文本、教义、共同体、救赎和终极意义。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一封关于赎罪券的神学质疑，让宗教问题从讲坛走向公共历史。", "Martin Luther 1517 年写下 Ninety-five Theses，质疑赎罪券相关实践和教义理解。文本经印刷传播后成为宗教改革的重要标志之一，长期影响基督教神学、教会制度和欧洲社会。"],
  "0222": ["历史与考古", "台阶下的封门", "1922 年，埃及帝王谷的尘土里，一个长期做发掘工作的男人几乎快要失去资助，却仍让工人继续清理一片看似普通的地面。", "历史与考古通过证据、遗迹、时间、材料和叙述理解过去，并谨慎处理过去被带回现在的方式。", "发现过去时，我们是在拥有它，还是开始承担解释它的责任？", "他并不是从大学讲台一路走来的学者，年轻时先靠绘画能力进入埃及考古现场，临摹壁画、记录细节、学习如何在沙土中保护易碎证据。多年寻找让人疲惫，资助人也接近放弃。直到工人发现一级石阶，清理继续向下，一道封门出现。洞口打开时，里面不是一个简单答案，而是成千上万件需要编号、保护、研究和搬运的物品。那一刻常被记成一句惊叹，但真正的考古不止是看见“奇迹”，还包括在兴奋之后缓慢、克制、系统地让过去说话。这个人叫 Howard Carter，他在 1922 年领导发现 Tutankhamun 墓，让近乎完整的古埃及王室墓葬震动世界，也让考古保护、记录和公众想象进入新的阶段。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是历史与考古通过证据、遗迹、时间、材料和叙述理解过去，并谨慎必须面对的问题：过去被带回现在的方式。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。", "一道封门背后不是单个宝藏，而是一整套关于证据、保护和过去如何进入现在的问题。", "Howard Carter 领导的团队于 1922 年在帝王谷发现 Tutankhamun 墓。墓中有数千件物品，保存和移出过程需要长期记录、保护和研究，是现代考古史上最著名发现之一。"],
  "0223": ["哲学与伦理", "市场里那个不停追问的人", "公元前 5 世纪的雅典，一个出身普通工匠家庭的人，常在市场、体育场和宴席间同人谈话。", "哲学与伦理研究价值、理由、责任、知识、善、正义和行动背后的假设。", "当你说“我知道”时，是否真的知道自己知道什么？", "他没有留下自己的书，也不像收学费的教师那样提供一套现成答案。他更像一个让人不舒服的邻居：将军说勇敢，他问勇敢是什么；政治人物说正义，他问正义能不能自相矛盾；年轻人说想过好生活，他问好生活是否只是成功和名声。许多人被他问得恼火，因为问题会把漂亮话拆开，让人看见自己其实没有想清楚。哲学与伦理在这里不是远离生活的抽象游戏，而是把日常判断带回理由面前：我凭什么这样活？我怎样对别人负责？我愿不愿意让自己的观念接受追问？这个人叫 Socrates，他以持续问答形成 Socratic method，成为西方哲学和伦理探究的重要源头人物。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是哲学与伦理真正要追问的问题：价值、理由、责任、知识、善、正义和行动背后的假设。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一个不停追问的人，让哲学从答案的展示变成理由的检验。", "Socrates 活跃于古雅典，未留下亲笔著作，主要通过 Plato、Xenophon 等人的文本被后世认识。Socratic method 以问答检验信念的一致性和理由，对哲学、伦理和教育产生长期影响。"],
  "0229": ["未另分类的人文学科", "她把家乡的故事重新听了一遍", "20 世纪 20 年代，一个从美国南方小镇走出去的年轻女性，带着人类学训练回到熟悉的门廊和街角。", "未另分类的人文学科处理那些关于意义、文本、民俗、记忆和人的经验但难以放入单一门类的问题。", "当一个人研究自己的文化时，她是旁观者，还是也在重新听见自己？", "她小时候听过许多故事：玩笑、传说、夸张的比喻、夜晚的闲谈、宗教和日常混在一起的声音。离开家乡后，她进入学术世界，学会访谈、记录和分析；可真正困难的是回到那些熟人之间时，既不能把他们当成标本，也不能只凭怀旧替他们说话。她坐在门廊上，跟人聊天、听笑话、记方言，也把自己的位置写进文本里。那些材料既像文学，又像民俗学、民族志、历史和语言研究，无法被单一标签收拢。未另分类的人文学科正需要这种敏感：有些知识必须从活人说话的声音里进入。这个人叫 Zora Neale Hurston，她以 Mules and Men 等作品记录非裔美国民俗，把文学、人类学和口述传统连接成独特的人文实践。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未另分类的人文学科必须面对的问题：那些关于意义、文本、民俗、记忆和人的经验但难以放入单一门类的问题。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。", "一个回到家乡倾听的人，让门廊上的笑话和传说进入人文学术记忆。", "Zora Neale Hurston 是作家、人类学家和民俗采集者。她在 Eatonville、Florida 及其他地区采集非裔美国民俗，1935 年出版 Mules and Men，把民间故事、民族志和文学叙事结合起来。"],
  "0231": ["语言习得", "一只叫 Wug 的小怪物", "20 世纪中期，一位年轻研究者坐在孩子面前，拿出一张画着陌生小动物的图片。", "语言习得关注人如何在输入、使用、规则、错误、反馈和社会情境中获得语言。", "孩子说错的时候，是否可能正在证明自己已经学会了规则？", "她没有先问孩子会不会背语法术语，而是给他们一个从未听过的词。图上只有一只小动物，她说这是一个 Wug；再出现一只，她问：现在有两个，叫两个什么？如果孩子回答出复数形式，就说明他们不是只在模仿听过的词，而是在把规则带到新情境里。这个实验简单得像游戏，却击中了语言习得的核心：孩子并不是被动复印成人话语，他们会从语言环境中抽出模式，再用到从未遇见过的词上。错误、发明词和犹豫，反而能让我们看见语言正在生长。这个人叫 Jean Berko Gleason，她设计的 Wug Test 成为儿童语言习得研究的经典实验之一。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是语言习得最核心的问题之一：人如何在输入、使用、规则、错误、反馈和社会情境中获得语言。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一只不存在的小动物，让研究者看见孩子不是背语言，而是在生成规则。", "Jean Berko Gleason 于 1958 年发表与 Wug Test 相关的研究，用虚构词测试儿童是否能把英语形态规则应用到新词上，成为语言习得研究中的经典范例。"],
  "0232": ["文学与语言学", "一个词不是贴在东西上的标签", "20 世纪初的日内瓦，一位语言教师在课堂上反复提醒学生：语言不是一堆物体名称的清单。", "文学与语言学研究文本、叙事、声音、符号、结构、意义和语言规则。", "如果一个词的意义来自它和其他词的差异，你还能把语言当成词典列表吗？", "他早年研究印欧语言，熟悉古老音变和比较语法；可到了普通语言学讲课时，他把问题推得更深。一个词为什么有意义？不是因为它天然连着某个物体，而是因为声音形式和概念在语言系统里被社会约定地连在一起，又因为它和其他词不同而能被识别。这个看法听起来安静，却改变巨大：文学里的意象、日常里的称呼、诗歌里的节奏、社会里的身份，都可以被看成符号关系的一部分。语言学不再只是追踪词源，也开始研究系统、差异和意义如何生成。这个人叫 Ferdinand de Saussure，他的学生整理出版 Course in General Linguistics，使 signifier/signified 和结构语言学成为 20 世纪语言与文学理论的重要基础。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是文学与语言学真正要追问的问题：文本、叙事、声音、符号、结构、意义和语言规则。所以它不只是艺术史或人文史，而是在训练人看见作品、物件和生活经验之间的暗线。", "一次关于词语关系的课堂，让语言从名称清单变成意义系统。", "Ferdinand de Saussure 是瑞士语言学家。《Course in General Linguistics》由学生根据其讲课笔记整理出版，提出语言符号、能指/所指、语言系统和差异关系等思想，影响结构主义、语言学和文学理论。"],
  "0239": ["未另分类的语言", "会说话的树叶", "19 世纪初，一个切罗基银匠看见白人士兵用纸传递消息，觉得那些纸像会说话的树叶。", "未另分类的语言关注不适合标准语种课程、主流文字传统或单一语言标签的语言实践。", "如果一个没有文字传统的共同体突然能书写自己的语言，会发生什么？", "他起初并不会读写任何现成文字，却被一个问题抓住：为什么纸上的痕迹能让远方的人听见消息，而自己的族人却必须依靠口头传递？身边人嘲笑他，甚至怀疑那是巫术；家里的生活也被他长时间的试验拖累。他先想给每个词画一个符号，后来发现太多，记不住。慢慢地，他转向声音，把语言拆成音节，为每个音节设计符号。经过多年试验，系统终于足够简洁，普通人可以很快学会。它让法律、书信、报纸、宗教文本和家族消息以本族语言流动，也让语言在压力巨大的历史中多了一条保存自己的路。这个人叫 Sequoyah，他创造 Cherokee syllabary，使 Cherokee Nation 在 1820 年代获得自己的书写系统，并成为语言史上极少数由个人成功发明文字体系的经典案例。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的语言最核心的问题之一：不适合标准语种课程、主流文字传统或单一语言标签的语言实践。这让今天的作品、文本和日常物件重新变得可读：意义不是直接摆在表面，而是在反复观看和解释里慢慢出现。", "一个银匠追问纸为什么会说话，最终让一个民族拥有了书写自己语言的方式。", "Sequoyah 于 1821 年完成 Cherokee syllabary，Cherokee Nation 于 1825 年正式采用。该音节文字迅速传播，使 Cherokee 语能够用于书信、法律、宗教材料和 Cherokee Phoenix 报纸等。"],
  "0311": ["经济学", "那枚小小的别针", "18 世纪的苏格兰，一个常在街上散步的教授，对商店、工坊和港口里的普通交易越来越着迷。", "经济学研究稀缺、分工、价格、激励、交换和资源如何在社会中被安排。", "当你看到一件很便宜的小东西时，会不会想到它背后有多少人的分工和协调？", "他原本教的是道德哲学，并不是坐在账房里算利润的人。可他总觉得，面包为什么会到餐桌上，工资为什么会这样定，一件小商品为什么能卖到远方，这些问题并不只是商人的私事。他在书里写下一个很不起眼的例子：一枚别针。如果一个人从拉铁丝、切断、磨尖到装盒全都自己做，产量很有限；如果许多人把工作拆开，各做一小步，速度会突然变得惊人。这个例子后来常被记住，因为它让人看见，财富不是凭空出现的，也不是单靠某个聪明人创造的。它来自分工、工具、市场大小、价格信号，以及许多陌生人之间并不亲密却持续发生的合作。后来，这个人叫 Adam Smith，是苏格兰道德哲学家和经济学家。他在 1776 年出版的《国富论》被认为是现代经济学的重要起点。今天，经济学已经扩展到家庭选择、平台市场、公共政策、行为偏差、贫困、环境和技术变化，但那个别针问题还在：一个社会如何让有限资源经过人的选择，变成可被共享的生活。", "一枚别针让经济学从抽象财富，落到分工、价格和陌生人的合作。", "Adam Smith 是苏格兰哲学家和经济学家，曾在 Glasgow 教授道德哲学；《国富论》出版于 1776 年；书中著名的别针制造例子用来说明分工如何提高生产力，并成为古典经济学的重要起点之一。"],
  "0312": ["政治科学与公民学", "小区要不要开放停车位，争论最后变成规则、代表和公共利益的问题。", "政治科学与公民学关注公共决策、权力、制度、参与和责任。", "当大家都说为了公共利益时，谁来定义公共？"],
  "0313": ["心理学", "朋友总在重要邮件发出前反复检查，问题不只是细心，而是焦虑在指挥注意力。", "心理学研究行为、情绪、认知、发展和人与环境的互动。", "你最近一个习惯背后，可能藏着什么心理需求？"],
  "0314": ["社会学与文化研究", "同一栋楼里，年轻人觉得群聊方便，老人却觉得通知贴在门口才算正式。", "社会学与文化研究关注规范、身份、群体、文化差异和社会结构。", "一个简单通知为什么会因为群体不同而变成不同现实？"],
  "0319": ["未另分类的社会与行为科学", "志愿者发现社区里的孤独感既不是心理问题，也不只是邻里关系问题。", "未另分类的社会与行为科学处理跨越行为、群体和制度的复杂现象。", "哪些人的问题其实是关系和环境共同制造的？"],
  "0321": ["新闻与报道", "暴雨夜里，同一张积水照片被转发成三种说法，记者先去确认地点和时间。", "新闻与报道关注事实核查、采访、叙事、公共信息和责任。", "在转发之前，你愿意为一个事实多问哪一个问题？"],
  "0322": ["图书馆、信息与档案研究", "老人想找一张几十年前的毕业照，管理员从标签、年份和捐赠记录一路追踪。", "图书馆、信息与档案研究关注信息组织、保存、检索和长期记忆。", "如果信息找不到，它和不存在有什么区别？"],
  "0329": ["未另分类的新闻与信息", "社区建立了一个失物消息板，既不是新闻，也不是档案，却让信息开始可信地流动。", "未另分类的新闻与信息关注不适合标准媒体或档案标签的信息实践。", "什么样的信息系统小到不起眼，却支撑着信任？"],
  "0411": ["会计与税务", "小店月底发现现金不少却利润很低，账本第一次把感觉变成事实。", "会计与税务让收入、成本、税务和责任变得可记录、可解释。", "没有记录的钱，真的能被管理吗？"],
  "0412": ["金融、银行与保险", "朋友买保险时只看价格，直到有人问他真正害怕的风险是什么。", "金融、银行与保险研究时间、风险、信用、保护和资金选择。", "你付出的每一笔钱，是在买收益、买便利，还是买安心？"],
  "0413": ["管理与行政", "活动当天每个人都很努力，却没人知道谁负责钥匙。", "管理与行政关注组织、流程、责任、协调和执行。", "一个团队失败时，问题一定是人不努力吗？"],
  "0414": ["市场营销与广告", "海报写满优点却没人停下，换成一句真实痛点后才有人询问。", "市场营销与广告研究需求、定位、传播、注意力和信任。", "你是在告诉别人你有什么，还是在回应别人为什么在意？"],
  "0415": ["秘书与办公事务", "会议顺利结束不是因为讨论少，而是有人提前整理了议程、资料和后续事项。", "秘书与办公事务关注文档、沟通、日程、流程和组织记忆。", "哪些看不见的准备，让一个组织看起来很顺？"],
  "0416": ["批发与零售销售", "水果摊老板把最熟的桃放在前面，因为他知道今天谁会先来买。", "批发与零售销售关注库存、陈列、定价、顾客关系和流通。", "一个货架的顺序，怎样改变人的选择？"],
  "0417": ["工作技能", "实习生技术不差，却总错过交付时间，导师先教他确认任务边界。", "工作技能关注沟通、协作、时间、责任和职业场景中的基本能力。", "什么能力不写在职位名称里，却决定你能不能可靠地完成事？"],
  "0419": ["未另分类的商业与行政", "朋友经营一个临时市集，既要招商、排班、收款，又要处理投诉。", "未另分类的商业与行政收纳混合型经营和组织实践。", "哪些真实工作因为太混合，反而很难被一个岗位名称说清？"],
  "0511": ["生物学", "窗台上的豆苗总向光弯曲，孩子第一次把生命看成会回应环境的系统。", "生物学研究生命、细胞、物种、遗传、适应和生态关系。", "你观察一个生命时，看到的是物体，还是正在调节的过程？"],
  "0512": ["生物化学", "面团发酵失败后，厨师开始关心温度、酶和微小反应。", "生物化学研究生命里的分子、反应、能量和物质变化。", "一个看不见的反应，怎样改变你能看见的结果？"],
  "0519": ["未另分类的生物相关科学", "水族箱里的藻类突然暴增，原因横跨光照、营养和微生物。", "未另分类的生物相关科学处理不适合单一生物门类的生命现象。", "哪些生命问题需要几个尺度一起看？"],
  "0521": ["环境科学", "学校操场旁的空气检测值总比公园高，学生开始怀疑采样位置。", "环境科学研究污染、资源、气候、生态和人类活动之间的关系。", "当你说环境变好了，你测量的是哪一个环境？"],
  "0522": ["自然环境与野生动物", "夜里路灯太亮，花园里的昆虫少了，孩子以为只是天气变了。", "自然环境与野生动物关注栖息地、物种行为、保护和生态平衡。", "一个方便人的改变，会怎样悄悄改变其他生命？"],
  "0529": ["未另分类的环境", "社区池塘变浑浊，原因既不像单纯污染，也不像普通生态问题。", "未另分类的环境处理跨越水、土、气候、社区使用的复杂环境现象。", "什么环境问题被分门别类以后反而看不清？"],
  "0531": ["化学", "清洁剂混用后刺鼻气味出现，大家才意识到物质会彼此反应。", "化学研究物质组成、性质、反应和变化条件。", "你身边哪件小事其实是物质关系在起作用？"],
  "0532": ["地球科学", "雨后坡道总积水，邻居从土壤、坡度和地下排水开始找答案。", "地球科学研究岩石、水、气候、地形和地球系统。", "脚下的地面为什么从来不是静止背景？"],
  "0533": ["物理学", "电梯突然停住时，孩子第一次认真感到速度、力和惯性。", "物理学研究运动、能量、力、物质和自然规律。", "哪些日常感觉其实是物理规律在提醒你？"],
  "0539": ["未另分类的物理科学", "厨房里一个奇怪的结晶现象，说不清属于化学、物理还是材料问题。", "未另分类的物理科学收纳跨越物质、能量和实验现象的研究。", "当现象不听分类安排时，你会先观察还是先命名？"],
  "0541": ["数学", "合租账单分摊时，大家发现公平不是平均这么简单。", "数学用数量、结构、模式和推理澄清关系。", "什么时候一个数字不是答案，而是重新提问的工具？"],
  "0542": ["统计学", "他开始数街上的人", "19 世纪初，布鲁塞尔的夜空常常不够清楚，年轻的天文学家只能等云散开，再把星星的位置记在纸上。", "统计学研究数据收集、变化、不确定性、推断、偏差，以及大量个体记录背后的模式。", "你看到一个平均数时，最想知道它帮你看见了什么，又遮住了什么？", "天文观测总有误差。这个年轻人慢慢学会，不必把每一个偏差都当成失败；很多偏差放在一起，反而会显出一种分布。后来，他把这种耐心从天空带回城市。出生、死亡、婚姻、身高、犯罪记录，这些原本散在登记册里的数字，被他一列一列整理出来。一个人的一生不能被表格解释，但很多人的记录放在一起，会露出某种社会的形状。他提出“平均人”的想法，试着用平均值理解社会规律。这个想法很有启发，也很危险：平均值能让混乱变得可读，却也可能把真实的人压平，把差异、不公平和例外藏起来。后来，这个人叫 Adolphe Quetelet，是比利时天文学家、数学家和统计学家。他把统计方法引入社会现象研究，也留下了后来被称为 Quetelet Index 的身体质量指数源头。今天，统计学已经进入医学试验、公共卫生、经济决策、城市治理、AI 评估和体育分析，但它最重要的提醒仍然朴素：数字不是现实本身，它是我们学习如何诚实接近现实的一种工具。", "一个仰望星空的人转身整理城市登记册，让统计学成为理解社会模式的工具。", "Adolphe Quetelet 是比利时天文学家、数学家、统计学家和社会学先驱；他创办并主持 Brussels Observatory；1835 年出版关于社会物理学和“平均人”的重要著作；他把统计方法应用到犯罪、婚姻、死亡等社会现象，并提出后来影响 BMI 的 Quetelet Index。"],
  "0611": ["计算机使用", "妈妈学会保存文件后，终于不再把重要文档只放在聊天窗口里。", "计算机使用关注基本数字工具、文件、账户、安全和日常操作能力。", "一个人不会用工具时，问题是工具复杂，还是学习入口太少？"],
  "0612": ["数据库与网络设计及管理", "社团名单存在三个人手机里，活动前一天没人知道哪个版本最新。", "数据库与网络设计及管理关注数据结构、连接、权限、可靠性和维护。", "当信息必须被多人同时信任时，它该住在哪里？"],
  "0613": ["软件与应用开发及分析", "她看见机器不只会算数", "1833 年的伦敦，客厅里有人低声交谈。桌上的纸页和茶杯旁，一台由齿轮、轴杆和金属片组成的机器吸引着来客。", "软件与应用开发及分析关心的不只是写代码，而是把需求、逻辑、符号、界面、测试和改进连成一套可靠过程，让机器能够执行人的想法。", "当机器开始执行人的想法时，最难的部分是机器足够聪明，还是人能不能把自己的想法说清楚？", "那个女孩才十七岁。她站在机器旁边，看着人们围过来，听他们谈论计算、速度和精确。那时的计算表常靠人一点点手算，出错并不稀奇。如果机器能替人算得更快，已经足够让很多人兴奋。可她停得久了一点。她想的不是这台机器能算多少，而是另一个问题：如果数字不只代表数量，也能代表音符、图案、关系和规则，那么机器处理的，真的只是数字吗？这个问题没有马上变成答案。几年后，她翻译一篇介绍 Analytical Engine 的文章。翻译本来只需要转述原文，她却把注释越写越长，试着说明机器怎样一步一步计算 Bernoulli numbers：先取什么数，再做什么运算，什么时候重复，什么时候停止。那些表格不像今天的代码，却已经很接近把人的意图拆成机器可以执行的步骤。很多年后，人们回头寻找计算机程序最早的影子，常会翻到那篇译文和后面的 Notes。署名处的名字，是 Ada Lovelace。藏在这个故事里的，其实是软件与应用开发最核心的问题：怎样把一个模糊的人类想法，写成机器可以理解、执行、检查和改进的步骤。对学生来说，信息技术不是只会操作工具，而是看懂工具背后有哪些假设、路径和责任。", "在一台尚未建成的机器旁，Ada Lovelace 看见了指令、符号和可执行想法的早期影子。", "Ada Lovelace 于 1843 年翻译 Luigi Menabrea 关于 Analytical Engine 的文章，并加入长篇 Notes。其中 Note G 描述了计算 Bernoulli numbers 的方法，常被视为最早公开发表的计算机程序之一。Analytical Engine 在当时并未真正建成。"],
  "0619": ["未另分类的信息与通信技术", "社区用二维码、纸表和群消息混合登记老人需求，系统很小但很有效。", "未另分类的信息技术收纳不适合标准软件或网络标签的数字实践。", "哪些数字解决方案重要，不是因为先进，而是因为贴合现场？"],
  "0711": ["化学工程与工艺", "洗衣液小厂换了配方，泡沫少了，管道却更稳定。", "化学工程与工艺把化学反应转化为安全、可控、可规模化的流程。", "从实验成功到稳定生产，中间需要哪些看不见的控制？"],
  "0712": ["环境保护技术", "餐馆装了油烟过滤器后，邻居投诉少了，但维护记录也变得重要。", "环境保护技术用工程方法减少污染、处理废物和保护环境。", "一个环保设备如果没人维护，还算解决方案吗？"],
  "0713": ["电力与能源", "停电那晚，整栋楼才意识到冰箱、电梯和网络都依赖同一条能源链。", "电力与能源关注发电、输配、效率、储能和安全使用。", "你最依赖的日常便利，背后是哪一种能源安排？"],
  "0714": ["电子与自动化", "自动门总在高峰期误开，工程师调整的不只是传感器，还有人流逻辑。", "电子与自动化研究电路、控制、传感、机器和自动系统。", "当机器自动行动时，它到底读懂了什么信号？"],
  "0715": ["机械与金属行业", "自行车刹车吱响，修车师傅听声音就知道摩擦面出了问题。", "机械与金属行业关注结构、部件、加工、维修和力的传递。", "哪些声音是在告诉你材料和结构正在求救？"],
  "0716": ["机动车、船舶与航空器", "渡船延迟不是因为船慢，而是风、载重、燃油和安全规则一起改变了计划。", "机动车、船舶与航空器关注交通工具的设计、维护、运行和安全。", "移动得更快之前，系统必须先保证什么？"],
  "0719": ["未另分类的工程行业", "维修队用非标准零件解决了老设备问题，但先做了临时安全测试。", "未另分类的工程行业处理不适合标准工程分支的技术实践。", "临场修复什么时候是创造，什么时候是风险？"],
  "0721": ["食品加工", "招牌汤要装瓶出售后，味道、保质期和密封都成了问题。", "食品加工把原料变成安全、稳定、可运输和可销售的食品。", "一份好吃的食物，怎样才能经得起时间和距离？"],
  "0722": ["材料：玻璃、纸、塑料与木材", "搬家纸箱看似一样，有的能承重，有的遇潮就塌。", "材料学习关注玻璃、纸、塑料、木材等材料的性质、加工和用途。", "你选择材料时，是在选择外观，还是在选择它能承受什么？"],
  "0723": ["纺织品：服装、鞋类与皮革", "雨天鞋底打滑，设计师重新看了纹路、材料和走路姿势。", "纺织品与服装鞋类关注纤维、结构、舒适、安全和制作工艺。", "贴近身体的东西，为什么需要同时理解材料和动作？"],
  "0724": ["采矿与开采", "一块手机电池让学生追问金属从哪里来，答案一路走到矿区。", "采矿与开采关注资源发现、提取、安全、环境和供应链。", "一个产品看起来很干净时，它的原料故事去了哪里？"],
  "0729": ["未另分类的制造与加工", "手工肥皂作坊逐渐接到订单，配方、包装和批次记录都需要重新设计。", "未另分类的制造与加工收纳混合型生产和加工实践。", "当兴趣变成生产，哪些细节会突然变成责任？"],
  "0731": ["建筑与城镇规划", "新广场很漂亮，却没有阴影，午后几乎没人停留。", "建筑与城镇规划关注空间、动线、公共生活、安全和长期使用。", "一个地方是给照片看的，还是给人生活的？"],
  "0732": ["建筑与土木工程", "学校门口积水多年，修路队发现问题在坡度、排水和地基。", "建筑与土木工程把结构、道路、水、电和公共安全落到实体系统。", "一条路的问题，为什么可能藏在地下？"],
  "0811": ["作物与畜牧生产", "农场主换了饲料，鸡蛋产量变了，粪肥和菜地也跟着变化。", "作物与畜牧生产关注种植、饲养、产量、健康和食物系统。", "一个农场决定怎样在多个生命之间传递后果？"],
  "0812": ["园艺", "阳台花盆换了位置后，香草终于不再徒长。", "园艺关注观赏植物、果蔬、土壤、修剪、光照和空间照料。", "照料植物时，你是在控制它，还是在学习它的条件？"],
  "0819": ["未另分类的农业", "社区堆肥项目既像种植，也像环保，还像邻里协作。", "未另分类的农业收纳不适合标准农业标签的土地与生产实践。", "哪些食物相关知识发生在田地和城市之间？"],
  "0911": ["牙科研究", "孩子害怕看牙，牙医先让他摸一摸小镜子，再谈蛀牙。", "牙科研究关注口腔健康、牙齿结构、预防、治疗和患者体验。", "一次治疗能否成功，为什么也取决于恐惧被怎样处理？"],
  "0912": ["医学", "老人说胸口不舒服，医生没有只听一个症状，而是追问时间、用药和风险。", "医学研究疾病、诊断、治疗、预防和人体系统。", "什么时候一个小症状不能被当成小事？"],
  "0913": ["护理与助产", "夜里那盏灯", "1850 年代的军医院里，走廊潮湿、床位拥挤，伤兵身上的问题不只来自战场。", "护理与助产关注持续观察、照护、卫生、安全、生命过程和人在脆弱时刻的尊严。", "真正的照护，是等医生下指令，还是在细节恶化之前先看见变化？", "刚到医院时，她看到的不是传说里的英雄场面，而是一连串很具体的麻烦：脏床单、通风差、排水糟糕、物资混乱，病人有时不是死于伤口，而是死于伤口之后的环境。她带人清洁、整理供应、改善卫生，也一遍遍记录死亡原因和病房情况。夜里，她提着灯巡视，不只是为了安慰伤兵，更是在看呼吸、疼痛、发热和恐惧有没有改变。后来，人们记住了那盏灯，但真正重要的不是浪漫的光，而是她把照护变成一种有纪律的专业：观察、记录、卫生、训练和制度。这个人叫 Florence Nightingale，是现代护理的重要奠基人，也是一位使用统计推动公共卫生改革的人。今天，护理与助产已经发展到重症监护、社区护理、产前产后照护、慢病管理和临终关怀，但核心仍然很近：在别人最脆弱的时候，有人持续、准确、尊重地看见他。", "一盏夜巡的灯背后，是现代护理把善意变成专业训练、卫生制度和持续观察的开始。", "Florence Nightingale 在 Crimean War 期间管理和训练护士，改善 Scutari 军医院的卫生与照护条件；1860 年她在 London 的 St Thomas' Hospital 建立 Nightingale Training School；她也用统计图表和数据推动公共卫生改革，被广泛视为现代护理奠基人。"],
  "0914": ["医学诊断与治疗技术", "影像检查没有直接给出答案，技术员的操作质量影响了医生能看见什么。", "医学诊断与治疗技术关注设备、检测、影像、治疗支持和质量控制。", "一项技术检查背后，人的判断还在哪里起作用？"],
  "0915": ["治疗与康复", "摔伤后的第一次下楼梯，比检查报告更能说明恢复到了哪里。", "治疗与康复关注功能恢复、训练、适应、疼痛和长期支持。", "恢复是不是回到过去，还是学会新的生活方式？"],
  "0916": ["药学", "同一种药饭前饭后效果不同，药师把说明书翻成了生活安排。", "药学研究药物作用、剂量、安全、相互作用和用药指导。", "一粒药真正进入生活时，需要哪些知识保护它的效果？"],
  "0917": ["传统与补充医学及疗法", "邻居推荐草药，医生没有立刻否定，而是先问成分、剂量和正在服用的药。", "传统与补充医学关注传统疗法、身体经验、安全边界和证据对话。", "尊重传统和保护安全，如何同时发生？"],
  "0919": ["未另分类的健康", "跑步社群发现新手受伤多，问题不只是运动医学，也涉及习惯和风险沟通。", "未另分类的健康收纳不适合标准医疗门类的健康实践。", "什么健康问题太生活化，以至于很难放进诊室？"],
  "0921": ["老人和残障成人照护", "楼梯边多装一个扶手，让老人终于敢自己下楼买菜。", "老人和残障成人照护关注尊严、能力支持、安全和日常生活质量。", "帮助一个人时，怎样避免把他的自主性也拿走？"],
  "0922": ["儿童照护与青少年服务", "少年活动室里，一张安静角落的桌子比更多规则更有用。", "儿童照护与青少年服务关注保护、发展、陪伴、边界和成长环境。", "年轻人需要的是管理，还是一个能安全试错的空间？"],
  "0923": ["社会工作与咨询", "欠租通知背后，是失业、照护压力和羞耻感缠在一起。", "社会工作与咨询连接个人困难、家庭关系、资源系统和支持过程。", "当一个人求助时，你能看见问题背后的系统吗？"],
  "0929": ["未另分类的福利", "社区冰箱解决的不只是食物，也是不知道向谁开口的难处。", "未另分类的福利收纳不适合标准福利服务标签的支持实践。", "什么样的帮助因为太朴素，反而最接近人的真实需要？"],
  "1011": ["家政服务", "家里请人整理后，真正改变的是老人能更安全地在厨房转身。", "家政服务关注清洁、整理、照护辅助、家庭运行和生活安全。", "一个家变得好用，背后有哪些服务知识？"],
  "1012": ["美发与美容服务", "婚礼前的发型沟通花了半小时，因为顾客要的不只是好看，还有安心。", "美发与美容服务关注形象、身体、审美、沟通和信任。", "服务身体外表时，为什么也在服务情绪？"],
  "1013": ["酒店、餐厅与餐饮", "餐厅满座时，最难的不是上菜，而是让等待的人仍然感觉被看见。", "酒店、餐厅与餐饮关注接待、食物、流程、卫生和体验。", "一次用餐体验，哪些部分不是食物却决定记忆？"],
  "1014": ["体育", "社区球赛里，裁判先解释规则，比赛反而更激烈也更安全。", "体育关注训练、规则、身体表现、团队和公平竞争。", "竞争什么时候会让人变好，什么时候会让人受伤？"],
  "1015": ["旅行、旅游与休闲", "游客迷路后记住的不是景点，而是有人如何帮他重新找到路线。", "旅行、旅游与休闲关注目的地、体验设计、文化接触和安全协调。", "旅行中的自由，为什么常常依赖别人设计好的秩序？"],
  "1019": ["未另分类的个人服务", "有人专门陪老人办理手机套餐，这项服务很难命名，却很必要。", "未另分类的个人服务收纳改善个人生活但不适合标准服务类别的实践。", "哪些服务因为太贴近生活，反而没有正式名字？"],
  "1021": ["社区卫生", "小区垃圾点换了位置后，异味少了，投诉也少了。", "社区卫生关注废弃物、水、清洁、公共空间和群体健康。", "干净是个人习惯，还是共同系统？"],
  "1022": ["职业健康与安全", "仓库新员工总撞到同一个货架，主管终于重画了通道线。", "职业健康与安全关注工作场所风险、预防、设备和安全行为。", "如果一个错误重复发生，问题在个人还是在现场设计？"],
  "1029": ["未另分类的卫生与职业健康服务", "夜市摊位临时增加洗手点，既是卫生措施，也是经营安排。", "未另分类的卫生与职业健康服务处理混合型公共卫生和工作安全实践。", "哪些安全措施小到不起眼，却改变了整个现场？"],
  "1031": ["军事与国防", "停电演练里，队伍最先检查的不是武器，而是通信和补给。", "军事与国防关注安全、组织、战略、训练、资源和风险准备。", "真正的防御只是力量，还是系统性的准备？"],
  "1032": ["人身与财产保护", "商店装了摄像头后，店主还调整了灯光和入口视线。", "人身与财产保护关注风险识别、预防、响应和安全环境设计。", "安全感来自监控，还是来自一个更难被误用的环境？"],
  "1039": ["未另分类的安全服务", "音乐节的失物和走散儿童由同一组志愿者处理，安全服务变得很难归类。", "未另分类的安全服务收纳非标准但真实保护人的现场支持。", "哪些保护工作只有在事情差点出错时才被看见？"],
};

function makeSublensStory(draft) {
  const category = categories.find((item) => item.code === draft.categoryCode);
  const group = category?.groups.find((item) => item.code === draft.groupCode);
  const sourceStory = baseLensStories.find((story) => story.categoryCode === draft.categoryCode) || baseLensStories[0];
  const primaryField = group?.fields?.[0];
  const fieldCodes = draft.fieldCodes || (primaryField ? [primaryField[0]] : []);
  const fieldTitlesZh = draft.fieldTitlesZh || (primaryField && draft.groupTitleZh ? { [primaryField[0]]: draft.groupTitleZh } : {});
  return {
    groupTitle: group?.title || draft.groupTitle || draft.groupCode,
    fieldCodes,
    fieldTitlesZh,
    image: sourceStory.image,
    imageAlt: sourceStory.imageAlt,
    imageAltZh: sourceStory.imageAltZh,
    storyLevel: "group",
    ...draft,
    groupTitleZh: draft.groupTitleZh || group?.title || draft.groupCode,
  };
}

function slugifyLensStory(value) {
  return String(value || "story")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "story";
}

const groupLensStories = [
  ...baseLensStories.map((story) => ({ ...story, storyLevel: "group" })),
  ...sublensStoryDrafts.map(makeSublensStory),
];

function makeFieldLensStory(category, group, code, title) {
  const detail = fieldStoryDetailsZh[code] || [];
  const [fieldTitleZh, titleZh, sceneZh, knowledgePointZh, reflectionQuestionZh, storyBodyZh, summaryZh, supportZh] = detail;
  const sourceStory =
    groupLensStories.find((story) => story.categoryCode === category.code && story.groupCode === group.code) ||
    groupLensStories.find((story) => story.categoryCode === category.code) ||
    groupLensStories[0];
  const zhFieldTitle = fieldTitleZh || title;
  return {
    id: `${code}-${slugifyLensStory(title)}`,
    storyLevel: "field",
    categoryCode: category.code,
    groupCode: group.code,
    groupTitle: group.title,
    groupTitleZh: sourceStory?.groupTitleZh || group.title,
    fieldCodes: [code],
    fieldTitlesZh: {
      [code]: zhFieldTitle,
    },
    image: sourceStory?.image || "/assets/stories/000-general-starter-course.png",
    imageAlt: sourceStory?.imageAlt || "An everyday learning scene connected to a MapKAI knowledge lens.",
    imageAltZh: sourceStory?.imageAltZh || "一个与 MapKAI 知识镜头相关的日常学习场景。",
    imageInheritedFromGroup: true,
    title: `When ${title.toLowerCase()} becomes visible`,
    titleZh: titleZh || `${zhFieldTitle}的小故事`,
    summary: `An everyday moment shows how ${title.toLowerCase()} works in real life.`,
    summaryZh: summaryZh || `${sceneZh || `一个普通场景让${zhFieldTitle}变得具体。`}这则故事把${zhFieldTitle}放回日常生活。`,
    scene: `Someone notices a practical situation where ${title.toLowerCase()} matters more than expected.`,
    sceneZh: sceneZh || `一个普通场景让${zhFieldTitle}变得具体。`,
    storyBody: `At first, the situation looks like a small inconvenience. As people ask what changed, who is affected, and how better choices could be tested, the field becomes concrete. ${title} helps turn the moment into a question that can be studied, designed, improved, or cared for.`,
    storyBodyZh: storyBodyZh || `一开始，旁观者只看到一个小麻烦。后来有人继续追问：谁受影响，什么条件在起作用，怎样判断改变真的有效。问题慢慢露出更深的一层：${knowledgePointZh || `${zhFieldTitle}帮助人把现实问题拆成可以理解和改进的部分。`}藏在这个故事里的，是${zhFieldTitle}这副镜头：它让人把零散细节放回真实处境，理解行动、材料、规则和后果怎样连在一起。`,
    support: "",
    supportZh: supportZh || "",
    knowledgePoint: `${title} focuses on a practical part of ${group.title.toLowerCase()} and helps people see what has to be learned, designed, measured, or cared for.`,
    knowledgePointZh: knowledgePointZh || `${zhFieldTitle}帮助人把现实问题拆成可以理解和改进的部分。`,
    reflectionQuestion: `Where have you seen ${title.toLowerCase()} quietly shaping an ordinary decision?`,
    reflectionQuestionZh: reflectionQuestionZh || `你身边哪个普通决定，其实正被${zhFieldTitle}悄悄塑造？`,
    tags: [title, group.title, "everyday knowledge"],
    tagsZh: [zhFieldTitle, "生活场景", "知识点"],
  };
}

const groupStoryFieldCodes = new Set(
  groupLensStories.flatMap((story) => Array.isArray(story.fieldCodes) ? story.fieldCodes : []),
);

const fieldLensStories = categories.flatMap((category) =>
  category.groups.flatMap((group) =>
    group.fields
      .filter(([code]) => !groupStoryFieldCodes.has(code))
      .map(([code, title]) => makeFieldLensStory(category, group, code, title)),
  ),
);

const lensStories = [
  ...groupLensStories,
  ...fieldLensStories,
];

const lensStoryOverridesZh = {
  "0300": {
    titleZh: "街区地图上的贫困颜色",
    summaryZh: "一张街区地图让社会科学、新闻与信息从抽象议题变成可被公共讨论的证据。",
    sceneZh: "19 世纪末的芝加哥，一个年轻女性每天走过移民家庭、工厂、学校和拥挤出租屋之间的街道。",
    storyBodyZh: "她不是从安静书房里开始理解社会的。她住进一个工人和移民聚居的街区，听见母亲为孩子找托管，工人为工资争论，年轻人想学英语，病人不知道去哪里求助。问题看起来分散：贫困、语言、教育、卫生、劳动、住房、信息不通。她和同伴开始做调查、画地图、办课程、写报告，把街坊的生活经验变成城市能看见的公共知识。社会科学、新闻与信息在这里交汇：不是替别人说故事，而是把隐藏在日常里的结构、数据和声音放到同一张桌面上。这个人叫 Jane Addams，她创办 Hull House，并用社会调查、公共写作和社区实践推动美国社会科学、社会改革和公共信息工作的发展。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未进一步细分的社会科学、新闻与信息最核心的问题之一：社会现实如何被观察、记录、解释和传达给公共生活。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "Jane Addams 1889 年在芝加哥创办 Hull House。Hull House Maps and Papers 结合街区调查、地图和社会分析，记录移民社区、劳动、工资和居住情况，是早期社会调查和公共改革的重要案例。",
    knowledgePointZh: "未进一步细分的社会科学、新闻与信息关注社会现实如何被观察、记录、解释和传达给公共生活。",
    reflectionQuestionZh: "如果把你所在街区的一种困难画成地图，谁的生活会第一次被看见？",
    tagsZh: ["社会调查", "公共信息", "社区"],
  },
  "0310": {
    titleZh: "王朝为什么会衰弱",
    summaryZh: "一个在动荡时代观察部落、城市和政权的人，试着把社会行为写成有规律的历史。",
    sceneZh: "14 世纪北非，一个年轻官员在宫廷、部落营地和监狱之间辗转，亲眼看见权力如何上升又崩塌。",
    storyBodyZh: "他的人生并不安稳，家族经历瘟疫，仕途几次卷入政治风浪。他开始怀疑，历史书里只记谁胜谁败是不够的。为什么一些群体能团结起来，为什么进入富裕城市后又慢慢松散，为什么税收、奢侈、教育、地理和共同体精神会一起改变政权命运？他把亲身见过的部落联盟、城市官僚和王朝循环放在一起分析，试着找出社会行为背后的力量。社会与行为科学的雏形就在这种追问里出现：人不是孤立行动，群体的凝聚、制度和环境会共同塑造历史。这个人叫 Ibn Khaldun，他在《Muqaddimah》中提出关于社会组织、王朝循环和 asabiyyah 的分析，被视为社会科学思想的重要先驱之一。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是社会与行为科学真正要追问的问题：人的选择、群体、制度、文化和环境如何共同塑造行动。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "Ibn Khaldun 于 14 世纪写作《Muqaddimah》，讨论历史方法、社会凝聚、政权兴衰、经济、教育和地理环境等主题，常被后世视为社会学、史学和社会科学的早期重要思想源头。",
    knowledgePointZh: "社会与行为科学研究人的选择、群体、制度、文化和环境如何共同塑造行动。",
    reflectionQuestionZh: "当一个团队变弱时，你会只责怪个人，还是追问共同体的结构发生了什么？",
    tagsZh: ["社会行为", "历史规律", "群体"],
  },
  "0311": {
    titleZh: "那枚小小的别针",
    summaryZh: "一枚别针让经济学从抽象财富，落到分工、价格和陌生人的合作。",
    sceneZh: "18 世纪的苏格兰，一个常在街上散步的道德哲学教授，对商店、工坊和港口里的普通交易越来越着迷。",
    storyBodyZh: "他并不是坐在账房里只想着利润的人。可他总觉得，面包为什么会到餐桌上，工资为什么会这样定，一件小商品为什么能卖到远方，这些问题并不只是商人的私事。他在书里写下一个很不起眼的例子：一枚别针。如果一个人从拉铁丝、切断、磨尖到装盒全都自己做，产量很有限；如果许多人把工作拆开，各做一小步，速度会突然变得惊人。这个例子后来常被记住，因为它让人看见，财富不是凭空出现的，也不是单靠某个聪明人创造的。它来自分工、工具、市场大小、价格信号，以及许多陌生人之间并不亲密却持续发生的合作。这个人叫 Adam Smith，他在 1776 年出版《The Wealth of Nations》，成为现代经济学的重要奠基人物之一。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是经济学真正要追问的问题：稀缺、分工、价格、激励、交换和资源如何在社会中被安排。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "Adam Smith 曾在 Glasgow 教授道德哲学；1776 年出版《The Wealth of Nations》。书中著名的别针制造例子用来说明分工如何提高生产力，是古典经济学的重要起点之一。",
    knowledgePointZh: "经济学研究稀缺、分工、价格、激励、交换和资源如何在社会中被安排。",
    reflectionQuestionZh: "当你看到一件便宜小物时，会不会想到它背后有多少陌生人的合作？",
    tagsZh: ["经济学", "分工", "市场"],
  },
  "0312": {
    titleZh: "镇会里的民主细节",
    summaryZh: "一个外国观察者在美国小镇会议里看见，政治不只是选举，也是不停练习公共生活。",
    sceneZh: "1830 年代的美国，一个年轻法国贵族坐在地方会议旁边，认真听普通居民怎样争论道路、学校和税。",
    storyBodyZh: "他本来是来考察监狱制度，却很快被更小的场景吸引。人们在教堂、报纸、协会和镇会里组织自己，争吵也合作；他们对政府保持警惕，却又愿意为了公共事务花时间。他看到民主不是一句口号，而是一整套习惯：结社、发言、妥协、地方自治、对多数权力的担忧，以及普通人学习公共判断的笨拙过程。政治科学与公民学在这里变得具体，因为制度不是只写在宪法上，也活在公民如何参加会议、读新闻、组织协会和约束权力里。这个人叫 Alexis de Tocqueville，他在《Democracy in America》中分析美国民主、结社生活和多数暴政问题，成为政治科学与公民研究的重要经典。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是政治科学与公民学最核心的问题之一：公共决策、权力、制度、参与、权利和责任如何组织共同生活。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    supportZh: "Alexis de Tocqueville 1831 年赴美国考察监狱制度，随后写成《Democracy in America》。该书分析地方自治、结社、民主习惯、平等和多数暴政等主题。",
    knowledgePointZh: "政治科学与公民学关注公共决策、权力、制度、参与、权利和责任如何组织共同生活。",
    reflectionQuestionZh: "如果民主不是只在投票日发生，你今天在哪个小地方练习过公共判断？",
    tagsZh: ["政治科学", "公民", "民主"],
  },
  "0313": {
    titleZh: "实验室里的节拍器",
    summaryZh: "一个小小节拍器让心理学从哲学沉思走向可被训练和测量的实验。",
    sceneZh: "1879 年的莱比锡，一间房里有计时器、节拍器、反应键和一群被要求仔细报告经验的学生。",
    storyBodyZh: "那位教师原本受过医学和生理学训练，也熟悉哲学问题。他关心意识，但不满足于只在书本里争论心灵是什么。他让学生听声音、看光点、按键、记录反应时间，并练习把自己的感觉描述得尽量准确。今天看来，这些方法有局限，也和现代心理学差距很大；但关键转向已经发生：心理活动可以进入实验室，可以被设计任务、记录时间、比较差异，也可以被看作身体和经验共同发生的过程。心理学不再只是关于灵魂的抽象谈论，而开始成为研究注意、感觉、反应和意识的经验科学。这个人叫 Wilhelm Wundt，他在莱比锡建立实验心理学实验室，被广泛视为现代实验心理学的重要奠基人。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是心理学真正要追问的问题：行为、情绪、认知、发展和人与环境的互动，也研究人的经验如何被观察和测量。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "Wilhelm Wundt 1879 年在 Leipzig 建立实验心理学实验室，使用反应时、感觉、注意和内省训练等方法推动心理学从哲学领域走向实验研究。",
    knowledgePointZh: "心理学研究行为、情绪、认知、发展和人与环境的互动，也研究人的经验如何被观察和测量。",
    reflectionQuestionZh: "你以为只属于内心的一个反应，能不能被时间、情境和身体一起解释？",
    tagsZh: ["心理学", "实验", "注意"],
  },
  "0314": {
    titleZh: "费城街区的一户户人家",
    summaryZh: "一项城市调查让社会学看见，偏见不能替代挨家挨户的证据。",
    sceneZh: "19 世纪末的费城，一个年轻学者拿着表格和笔，走进被许多人用刻板印象谈论的黑人社区。",
    storyBodyZh: "他知道，如果只听报纸和政客的说法，这个社区会被简化成问题本身。于是他做了一件慢事：访问家庭、记录职业、收入、教育、住房、迁徙和邻里关系，把地图、统计和生活叙述放在一起。他不是把人当成数字，而是用数字抵抗懒惰的偏见；也不是把贫困归咎于某个群体，而是追问工作机会、歧视、居住条件和城市制度如何制造后果。社会学与文化研究在这里有了锋利的现实感：文化和社会结构不是空词，它们会落到哪条街、哪份工作、哪间屋子和哪一次被拒绝的机会里。这个人叫 W. E. B. Du Bois，他的《The Philadelphia Negro》成为美国城市社会学、实证社会研究和种族研究的重要经典。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是社会学与文化研究最核心的问题之一：规范、身份、群体、文化差异和社会结构如何塑造人的机会与生活。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    supportZh: "W. E. B. Du Bois 1899 年出版《The Philadelphia Negro》，基于对费城第七区黑人社区的详细调查，结合访谈、统计、地图和社会分析，是美国城市社会学的重要早期作品。",
    knowledgePointZh: "社会学与文化研究关注规范、身份、群体、文化差异和社会结构如何塑造人的机会与生活。",
    reflectionQuestionZh: "你对一个群体的判断里，有多少来自证据，又有多少只是被反复听来的说法？",
    tagsZh: ["社会学", "城市调查", "文化"],
  },
  "0319": {
    titleZh: "孩子们的食物地图",
    summaryZh: "一个关于儿童营养的项目说明，有些行为问题必须同时看家庭、学校、社区和政策。",
    sceneZh: "1930 年代的美国南方，一位研究者走进学校和家庭，发现孩子的午餐盒里藏着比营养更多的社会线索。",
    storyBodyZh: "她受过心理学和人类学训练，却越来越不愿把人的行为拆成孤立变量。孩子吃什么，不只取决于母亲是否知道营养，也取决于收入、种族隔离、学校制度、地方食物习惯、农场生产和政府项目。她做访谈、观察餐桌、记录家庭安排，也研究政策怎样进入厨房。这个工作很难只归入心理学、社会学、教育或公共卫生，因为它关心的是行为在真实社会生态中如何发生。未另分类的社会与行为科学正需要这样的眼睛：当问题横跨个人、家庭、机构和文化时，分类要服务理解，而不是挡住理解。这个人叫 Margaret Mead，她把人类学、儿童发展、食物习惯和社会政策连接起来，影响了社会行为研究对文化和日常生活的理解。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是未另分类的社会与行为科学必须面对的问题：那些跨越心理、文化、家庭、制度和政策的复杂行为现象。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "Margaret Mead 是美国人类学家，研究文化、儿童发展、性别、教育和日常生活实践。她参与过关于食物习惯、营养和社会行为的研究与公共讨论，把社会与行为科学的问题意识带进日常生活。",
    knowledgePointZh: "未另分类的社会与行为科学处理那些跨越心理、文化、家庭、制度和政策的复杂行为现象。",
    reflectionQuestionZh: "一个看似个人习惯的问题，背后可能有多少层社会条件在一起行动？",
    tagsZh: ["行为科学", "文化", "日常生活"],
  },
  "0320": {
    titleZh: "世界知识的抽屉",
    summaryZh: "一座纸卡片构成的知识宫殿，让新闻与信息不只是报道，也包括组织和检索世界。",
    sceneZh: "19 世纪末的布鲁塞尔，一个年轻律师坐在堆满纸卡片的房间里，想象全世界的知识都能被找到。",
    storyBodyZh: "他关心的不是某一条新闻，而是人类怎样保存和共享所有已经写下来的东西。书、论文、报告、图片、剪报、统计表，如果不能被分类、编号、引用和检索，就像散在地上的碎片。他和同伴设计通用十进分类法，建立庞大的卡片目录，试图让任何地方的人都能提出问题并获得相关资料。这个梦想有时代局限，也带着欧洲中心的阴影，但它抓住了信息工作的核心：公共知识不是自然流动的，它需要索引、标准、媒介、机构和持续维护。这个人叫 Paul Otlet，他创建 Mundaneum 并推动文献学、知识组织和信息科学早期发展，被后世视为现代信息组织思想的重要先驱之一。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是新闻与信息领域最核心的问题之一：报道、保存、检索、组织和传播，让公共知识能够被找到、核实和使用。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    supportZh: "Paul Otlet 与 Henri La Fontaine 创建 Mundaneum，并发展 Universal Decimal Classification。Otlet 的文献组织、卡片索引和全球知识网络设想，被视为现代信息科学和知识组织史的重要源头。",
    knowledgePointZh: "新闻与信息领域关注报道、保存、检索、组织和传播，让公共知识能够被找到、核实和使用。",
    reflectionQuestionZh: "如果一条重要信息无法被找到，它还算真正进入公共生活了吗？",
    tagsZh: ["信息组织", "文献", "公共知识"],
  },
  "0321": {
    titleZh: "她查每一个名字",
    summaryZh: "一个记者对暴力名单的逐项核实，让报道成为对公共谎言的抵抗。",
    sceneZh: "19 世纪末的美国南方，一个年轻女教师兼报人听说朋友被私刑杀害，愤怒之外先做了一件慢事：查证。",
    storyBodyZh: "她没有满足于当时白人报纸常用的说法，也没有把恐惧写成空泛控诉。她收集报纸剪报，核对姓名、地点和借口，比较案件，追问所谓“罪名”怎样被制造出来为暴力辩护。她写文章、发表小册子、演讲，也因此遭到威胁，被迫离开原来的城市。新闻与报道在她手里不是中立地重复权力话语，而是在证据、勇气和公共责任之间建立联系。真正的记者工作，有时就是在多数人已经接受谎言的时候，仍然逐条核对事实。这个人叫 Ida B. Wells，她以反私刑调查报道和公共倡议成为美国调查新闻、民权运动和新闻责任史上的重要人物。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是新闻与报道最核心的问题之一：事实核查、采访、证据、叙事、公共信息和对权力的责任。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    supportZh: "Ida B. Wells 是美国记者、教育者和民权活动家。1890 年代她发表反私刑调查文章和小册子，如 Southern Horrors，通过收集案件、核对报道和公开演讲揭露私刑暴力。",
    knowledgePointZh: "新闻与报道关注事实核查、采访、证据、叙事、公共信息和对权力的责任。",
    reflectionQuestionZh: "当一个社会已经习惯某种说法时，谁还愿意逐条核对它？",
    tagsZh: ["调查报道", "事实核查", "公共责任"],
  },
  "0322": {
    titleZh: "每本书都该找到它的读者",
    summaryZh: "一位图书馆员把图书馆从藏书仓库重新想象成会主动连接人的公共系统。",
    sceneZh: "20 世纪 20 年代的印度，一个年轻数学教师转到图书馆工作，发现书架整齐并不等于知识真正被使用。",
    storyBodyZh: "他看到很多图书馆像安静仓库，书被保护得很好，却不一定抵达需要它的人。数学训练让他喜欢秩序，但图书馆现场让他明白，秩序必须服务读者。他提出几条朴素却深刻的原则：书是为了使用的；每个读者有他的书；每本书有它的读者；节省读者时间；图书馆是生长的有机体。这些话听起来温和，其实改变了信息工作的重心：编目、分类、借阅、开放时间和馆员服务，都不只是内部技术，而是让社会记忆和个人问题相遇的方式。这个人叫 S. R. Ranganathan，他提出 Five Laws of Library Science，并发展 Colon Classification，成为图书馆与信息科学的重要奠基人物之一。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是图书馆、信息与档案研究最核心的问题之一：信息组织、保存、检索、可达性和长期公共记忆。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "S. R. Ranganathan 是印度图书馆学家，1931 年出版《The Five Laws of Library Science》，并发展 Colon Classification。他的思想强调读者、使用、分类和图书馆作为生长系统。",
    knowledgePointZh: "图书馆、信息与档案研究关注信息组织、保存、检索、可达性和长期公共记忆。",
    reflectionQuestionZh: "一个系统是为了保存资料，还是为了让需要资料的人及时找到它？",
    tagsZh: ["图书馆学", "信息检索", "档案"],
  },
  "0329": {
    titleZh: "危机地图上的第一条短信",
    summaryZh: "一次临时搭起的信息平台说明，公共信息有时会出现在新闻、技术和社区行动之间。",
    sceneZh: "2007 年肯尼亚选举后，街头暴力和传言同时扩散，一个年轻律师在网上写下想法：能不能让人们报告身边发生的事？",
    storyBodyZh: "她看到的问题不是传统报纸能独自解决的。事件分散，消息混乱，很多人有手机却没有安全渠道把地点、危险和求助信息送到公共视野。于是开发者、志愿者和公民一起搭起平台，把短信、网页报告和地图连起来。它不等同于新闻社，也不只是技术产品，更不是政府档案；它在危机中把零散目击转为可视化信息，同时也暴露出核实、偏差和安全的难题。未另分类的新闻与信息正存在于这种边界地带：当现实太快、太分散、太危险，公共知识需要新的容器。这个人叫 Ory Okolloh，她提出并推动 Ushahidi 的早期构想，使众包危机地图成为新闻、信息技术和公民行动交汇的重要案例。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的新闻与信息最核心的问题之一：那些不完全属于传统媒体、档案或标准信息系统的新型公共信息实践。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    supportZh: "Ushahidi 源于 2007-2008 年肯尼亚选举后暴力事件中的众包报告与地图项目。Ory Okolloh 是早期关键发起者之一，平台后来被用于多种危机、选举和灾害信息收集场景。",
    knowledgePointZh: "未另分类的新闻与信息关注那些不完全属于传统媒体、档案或标准信息系统的新型公共信息实践。",
    reflectionQuestionZh: "在混乱时刻，怎样的信息既能快速出现，又不放弃核实和保护人的责任？",
    tagsZh: ["众包信息", "危机地图", "公共信息"],
  },
  "0388": {
    titleZh: "水泵周围的黑点",
    summaryZh: "一张疾病地图把社会调查、数据、地方访谈和公共信息放进同一个判断。",
    sceneZh: "1854 年伦敦 Soho 的街道上，霍乱病例不断增加，一位医生拿着地址和地图追踪死亡的位置。",
    storyBodyZh: "当时许多人仍相信坏空气是主要原因。他却把注意力放到人喝了什么水、住在哪里、谁离开、谁留下，以及哪些看似例外其实有共同解释。他不是一个人完成全部调查；当地牧师和居民提供了关键访问线索。病例被标到地图上后，Broad Street 水泵周围的黑点越来越密。这个判断既是医学问题，也是社会信息问题：数据要来自街道，访谈要校正地图，地图又要说服公共机构采取行动。跨学科的社会科学、新闻与信息在这里很清楚：证据要能穿过学科边界，才可能改变一个城市的决定。这个人叫 John Snow，他通过 Broad Street 霍乱调查和地图分析推动了流行病学、公共卫生和数据可视化的经典实践。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是社会科学、新闻与信息的跨学科课程把社会调查、数据、地图、访谈和公共传播要练习的连接能力：起来。所以它不只是关于社会的大词，而是在训练人判断信息从哪里来、谁被听见、谁被漏掉。",
    supportZh: "John Snow 在 1854 年伦敦 Soho 霍乱暴发中分析病例分布和饮水来源，并与 Henry Whitehead 等当地调查结合，Broad Street 水泵案例成为流行病学、公共卫生地图和证据决策的经典事件。",
    knowledgePointZh: "社会科学、新闻与信息的跨学科课程把社会调查、数据、地图、访谈和公共传播连接起来。",
    reflectionQuestionZh: "一个公共问题什么时候需要地图、访谈和行动同时出现？",
    tagsZh: ["跨学科", "数据地图", "公共卫生"],
  },
  "0399": {
    titleZh: "渔民为什么没有把湖耗尽",
    summaryZh: "一个长期观察共同资源的人发现，真实社区常常比简单理论更会发明规则。",
    sceneZh: "20 世纪后半叶，一个研究者读到许多关于森林、灌溉渠和渔场的案例，发现它们并不总按课本预言崩坏。",
    storyBodyZh: "流行说法常把公共资源讲成两种结局：要么被市场私有化，要么由国家统一管理，否则人人都会多拿一点直到系统崩溃。她不满足于这个太整齐的故事。她和同伴比较世界各地的灌溉社群、渔业、牧场和森林，发现有些社区会自己制定边界、监测、惩罚、冲突解决和分层规则。它们不是完美乌托邦，也会失败，但它们证明社会现实比二分法复杂。未另分类的社会科学、新闻与信息需要这种耐心：有些制度知识藏在地方规则、口头协议和长期观察里，不一定属于单一学科。这个人叫 Elinor Ostrom，她通过共同池资源研究和制度分析获得诺贝尔经济学奖，改变了人们对集体治理的理解。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未另分类的社会科学、新闻与信息需要保留下来的边界问题：那些跨越制度、行为、地方知识和公共信息的复杂社会现象。这让今天的新闻、数据和公共讨论重新变得具体：事实要被收集，也要被组织、解释，并让被忽略的人有机会被看见。",
    supportZh: "Elinor Ostrom 研究 common-pool resources 和制度治理，1990 年出版《Governing the Commons》。她通过大量案例说明社区可通过规则、监测和协商管理共享资源，2009 年获诺贝尔经济学奖。",
    knowledgePointZh: "未另分类的社会科学、新闻与信息收纳那些跨越制度、行为、地方知识和公共信息的复杂社会现象。",
    reflectionQuestionZh: "你身边哪一套非正式规则，其实比外人想象得更精密？",
    tagsZh: ["共同资源", "制度", "地方知识"],
  },
  "0400": {
    titleZh: "第一所商学院的疑问",
    summaryZh: "一个实业家把商业教育从家族经验和学徒习惯，推向大学里的系统训练。",
    sceneZh: "19 世纪后期的费城，一个在工业和金融世界工作多年的男人，越来越担心商业只靠机灵和家传经验是不够的。",
    storyBodyZh: "他见过铁路、制造、银行和贸易如何改变美国，也见过市场扩张带来的混乱。账目、合同、组织、法律、货币、运输和公共责任纠缠在一起，年轻人却常常只能靠店铺学徒或家族关系慢慢摸索。他提出一个当时并不自然的想法：商业也应该进入大学，被系统研究和训练。商业、管理与法律在这里并不是赚钱技巧，而是一套关于组织如何行动、承担责任、处理风险和遵守规则的知识。后来商学院有过许多争议，也不断被重新批判，但这个起点说明，现代商业已经复杂到需要制度化学习。这个人叫 Joseph Wharton，他资助建立 University of Pennsylvania 的 Wharton School，使商业教育成为现代大学体系中的重要领域之一。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未进一步细分的商业、管理与法律最核心的问题之一：组织、市场、制度、责任和规则如何共同塑造经济生活。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "Joseph Wharton 是美国实业家和慈善家，1881 年资助建立 University of Pennsylvania 的 Wharton School，通常被视为世界最早的大学商学院之一。",
    knowledgePointZh: "未进一步细分的商业、管理与法律关注组织、市场、制度、责任和规则如何共同塑造经济生活。",
    reflectionQuestionZh: "当一个行业越来越复杂，哪些经验必须从个人诀窍变成公开训练？",
    tagsZh: ["商业教育", "组织", "规则"],
  },
  "0410": {
    titleZh: "公司不是一台机器",
    summaryZh: "一次对大企业的长期观察，让管理学开始把组织看成由人、目标和责任组成的社会机构。",
    sceneZh: "20 世纪中期，一个年轻管理思想者走进大型汽车公司，发现真正难的不是画组织图，而是理解组织为什么行动。",
    storyBodyZh: "他不是工程师出身，也不是只看财务报表的人。他关心一个更朴素的问题：当公司越来越大，谁在决定目标？经理人的责任是什么？员工是不是只是一颗螺丝？顾客、社会和长期生存又放在哪里？他观察通用汽车这样的组织，发现管理不是命令链条那么简单，而是让知识、权责、绩效、创新和人的尊严保持可工作的关系。商业与行政在这里变成一门关于“组织如何有目的地行动”的学问。它既要看数字，也要看人；既要看效率，也要看责任。这个人叫 Peter Drucker，他通过《Concept of the Corporation》等作品奠定现代管理学的重要语言，被称为现代管理思想的重要奠基人之一。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是商业与行政真正要追问的问题：组织、流程、责任、协调、绩效和决策如何让集体工作可持续运转。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    supportZh: "Peter Drucker 1946 年出版《Concept of the Corporation》，基于对 General Motors 的研究，讨论大企业、分权、经理责任和组织目的。其后作品深刻影响现代管理学和组织实践。",
    knowledgePointZh: "商业与行政研究组织、流程、责任、协调、绩效和决策如何让集体工作可持续运转。",
    reflectionQuestionZh: "一个组织如果只追效率，却说不清自己的责任，会在哪些地方开始失灵？",
    tagsZh: ["管理学", "组织", "行政"],
  },
  "0411": {
    titleZh: "商人账本里的两边",
    summaryZh: "一本算术书里的记账章节，让交易从记忆和信任走向可检查的系统。",
    sceneZh: "文艺复兴时期的意大利，一个修士兼数学教师看到商人的账本里，货物、债务和现金总在流动。",
    storyBodyZh: "城市贸易越来越复杂，单靠脑子记住谁欠谁、货从哪里来、钱到哪里去，已经很危险。他把商人实际使用的复式记账方法写进书里，说明每笔交易都要从两个方向进入账本：一边记录来源，一边记录去向。这个方法不是让商业变得道德完美，却让错误、欺骗、成本和责任更容易被发现。会计与税务的核心由此显露：数字不是单纯记录财富，而是在社会中建立可解释、可核对、可承担责任的证据。这个人叫 Luca Pacioli，他在 1494 年《Summa de arithmetica》中系统介绍复式记账，被后世称为会计学的重要奠基人物之一。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是会计与税务需要认真追问的问题：会计与税务让收入、成本、资产、负债、税务和责任变得可记录、可解释、可检查。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    supportZh: "Luca Pacioli 1494 年出版《Summa de arithmetica, geometria, proportioni et proportionalita》，其中介绍威尼斯商人使用的复式记账方法，对现代会计史影响深远。",
    knowledgePointZh: "会计与税务让收入、成本、资产、负债、税务和责任变得可记录、可解释、可检查。",
    reflectionQuestionZh: "当一笔钱进入账本两边，它是不是也进入了责任之中？",
    tagsZh: ["会计", "复式记账", "责任"],
  },
  "0412": {
    titleZh: "死亡表里的保险问题",
    summaryZh: "一位天文学家整理城市死亡记录，让风险、时间和金钱第一次被更可靠地放在同一张表里。",
    sceneZh: "17 世纪末，一个习惯计算彗星轨道的人，开始认真阅读一座城市的出生和死亡记录。",
    storyBodyZh: "他关心的不是个体命运能不能被预测，而是许多人的寿命放在一起，会不会呈现可用于公共判断的规律。年金和保险长期依赖粗略估计，价格常常不公平。于是他整理 Breslau 的年龄与死亡数据，计算不同年龄的人还能活多久的概率。这个工作让金融、银行与保险中的核心问题变得清楚：钱不只在空间里流动，也在时间和风险里流动。保险不是消灭不确定性，而是用大量记录、概率和合同把不确定性分担开来。这个人叫 Edmond Halley，他制作的生命表成为精算科学和人寿保险定价史上的重要早期成果。今天保险、养老金和公共预算仍在面对同一件事：没有人能预知个人命运，但群体数据会改变社会分担风险的方式。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是金融、银行与保险真正要追问的问题：时间、风险、信用、资金流动和保护机制如何影响选择。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "Edmond Halley 1693 年根据 Breslau 出生与死亡记录发表生命表研究，用于估算不同年龄的死亡概率和年金价格，被视为精算科学和保险数学的重要早期成果。",
    knowledgePointZh: "金融、银行与保险研究时间、风险、信用、资金流动和保护机制如何影响选择。",
    reflectionQuestionZh: "你买一份保险时，真正买的是钱、时间，还是对不确定性的共同分担？",
    tagsZh: ["金融", "保险", "风险"],
  },
  "0413": {
    titleZh: "她不想让工人只服从命令",
    summaryZh: "一个在社区中心和工厂之间思考的人，把管理从控制他人转向共同解决问题。",
    sceneZh: "20 世纪初的波士顿，一个女性社会思想者在社区工作、企业会议和公共事务之间来回走动。",
    storyBodyZh: "她看到冲突常被处理成输赢：老板命令，工人服从；部门争资源，谁声音大谁赢。可她越来越相信，真正的管理不该只是压制冲突，而要把不同经验组织起来，让问题本身把人带向新的解决方案。她提出“power with”而不是“power over”，强调协调、参与、情境判断和共同责任。她的思想一度不如科学管理那样显眼，却在后来影响组织行为、领导力和协作管理。管理与行政在她这里不是冷冰冰的流程，而是把人的经验、权力和目标重新安排到可合作的结构中。这个人叫 Mary Parker Follett，她以关于协作、权力和冲突整合的思想成为现代管理学的重要先驱之一。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是管理与行政最核心的问题之一：组织、流程、责任、协调、执行和人在共同目标中的合作方式。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    supportZh: "Mary Parker Follett 是 20 世纪初管理和社会思想家，提出 power with、integration、情境领导等思想，对组织行为、管理理论和协作实践产生长期影响。",
    knowledgePointZh: "管理与行政关注组织、流程、责任、协调、执行和人在共同目标中的合作方式。",
    reflectionQuestionZh: "面对冲突时，你是在寻找谁赢，还是寻找问题本身要求大家怎样改变？",
    tagsZh: ["管理", "协作", "组织行为"],
  },
  "0414": {
    titleZh: "牙膏广告里的一个小习惯",
    summaryZh: "一次关于牙膏的推广，让营销从夸张口号转向测试、心理触发和可重复行动。",
    sceneZh: "20 世纪初的美国，一个广告人盯着报纸版面和销售数字，越来越不相信只靠漂亮句子就能卖出东西。",
    storyBodyZh: "他把广告当作可以测试的实验，而不是纯粹灵感。他关心标题能不能让人停下，优惠券能不能追踪回应，产品承诺是不是能进入人的日常习惯。推广牙膏时，广告不只是说产品好，而是抓住“牙齿表面那层膜”的感觉，让人每天用舌头确认自己是否需要清洁。这个方法后来也必须被批判，因为营销可以帮助人理解需求，也可以制造焦虑和欲望。但它确实让市场营销与广告的学科特征显出来：注意力、证据、行为触发、信任和伦理边界总是缠在一起。这个人叫 Claude Hopkins，他以《Scientific Advertising》和 Pepsodent 推广案例影响了现代广告测试、直效营销和消费行为传播。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是市场营销与广告真正要追问的问题：需求、定位、传播、注意力、行为、信任和商业伦理。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "Claude C. Hopkins 是美国广告人，1923 年出版《Scientific Advertising》，强调测试、优惠券、回应追踪和具体卖点。Pepsodent 牙膏推广常被作为习惯形成与广告策略的经典案例讨论。",
    knowledgePointZh: "市场营销与广告研究需求、定位、传播、注意力、行为、信任和商业伦理。",
    reflectionQuestionZh: "一个广告是在帮你看见真实需求，还是在替你制造一个新焦虑？",
    tagsZh: ["营销", "广告", "习惯"],
  },
  "0415": {
    titleZh: "键盘把办公室重新排了一遍",
    summaryZh: "一台打字机让办公事务从手写书信变成速度、格式、复制和职业角色的系统。",
    sceneZh: "19 世纪美国，一个报纸编辑兼发明者反复调试一台会卡键的机器，想让文字能更快落到纸上。",
    storyBodyZh: "他面对的不是浪漫的文学问题，而是办公室里极普通的痛点：信件太多，手写难读，副本难做，速度跟不上商业往来。早期机器笨重又不稳定，键位也不断调整。可一旦打字机进入办公室，文件格式、通信速度、记录保存、秘书职业和性别化劳动分工都被改变了。秘书与办公事务不是“杂活”的集合，而是组织记忆、沟通节奏和文件可靠性的基础设施。每一份议程、备忘录、合同副本和来往信件，都在帮助组织不用只靠个人记忆运转。这个人叫 Christopher Latham Sholes，他参与发明并推广早期实用打字机，长期影响现代办公室文书和秘书工作。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是秘书与办公事务最核心的问题之一：文档、沟通、日程、流程、记录和组织记忆如何支持日常运转。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。从那以后，办公室里的速度变快了，但人们也不得不重新安排谁记录、谁校对、谁保存组织记忆。",
    supportZh: "Christopher Latham Sholes 是美国发明者和报人，参与发明 Sholes and Glidden typewriter，并发展 QWERTY 键盘布局。打字机改变了办公通信、文书处理和秘书职业结构。",
    knowledgePointZh: "秘书与办公事务关注文档、沟通、日程、流程、记录和组织记忆如何支持日常运转。",
    reflectionQuestionZh: "一个组织里哪些看似琐碎的文件，实际是在保护大家不被混乱吞掉？",
    tagsZh: ["办公事务", "打字机", "组织记忆"],
  },
  "0416": {
    titleZh: "顾客自己拿货的商店",
    summaryZh: "一家自助杂货店改变了货架、价格标签和顾客行动，也改变了零售业的基本想象。",
    sceneZh: "1916 年的孟菲斯，一个杂货商看着柜台后的店员不停替顾客取货，觉得整套流程太慢也太贵。",
    storyBodyZh: "当时买东西常由店员在柜台后取货，顾客说，店员拿，价格和选择都被柜台隔开。他反过来设计商店动线：让顾客推开转门，沿着货架自己拿商品，看清包装和价格，最后到出口结账。这个改变不是简单节省人力，它重写了批发与零售销售的现场逻辑：陈列、包装、冲动购买、库存、价格标签、防盗和收银都变成同一套系统。顾客获得更多自由，也被新的货架设计影响选择。这个人叫 Clarence Saunders，他创办 Piggly Wiggly，把自助式超市模式推向商业实践，深刻影响现代零售销售。今天零售设计仍在问类似问题：顾客自己完成一部分服务时，便利、成本、信任和被监控的感觉怎样重新分配。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是批发与零售销售最核心的问题之一：商品流通、陈列、定价、库存、顾客关系和购买现场如何被设计。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "Clarence Saunders 1916 年在 Memphis 创办 Piggly Wiggly，通常被认为是早期自助式杂货店模式的重要开端，改变了零售动线、包装、陈列和结账方式。",
    knowledgePointZh: "批发与零售销售关注商品流通、陈列、定价、库存、顾客关系和购买现场如何被设计。",
    reflectionQuestionZh: "当你以为自己自由选择商品时，货架已经替你做了哪些安排？",
    tagsZh: ["零售", "自助商店", "销售"],
  },
  "0417": {
    titleZh: "砖头该怎样拿才不累",
    summaryZh: "一对研究工作动作的人让工作技能从吃苦耐劳，转向可观察、可改进、可保护身体的实践。",
    sceneZh: "20 世纪初的工地和厨房里，一对夫妻拿着秒表和摄像机，认真观察人怎样伸手、弯腰、拿起工具。",
    storyBodyZh: "他们不是只想让人更快工作。真正的问题是，为什么同样的任务有人疲惫，有人顺手；为什么工人要做那么多多余动作；为什么家庭劳动也被当成不值得研究的自然习惯。他们拍摄砌砖动作，分析手的路径，也研究厨房高度、工具摆放和休息。今天我们会警惕效率研究被用来压榨劳动者，但他们留下的一个重要提醒仍然成立：工作技能不是天生会的，也不只是态度好。它包括动作、工具、时间、沟通、身体保护和学习反馈。这个人叫 Frank Gilbreth 和 Lillian Gilbreth，他们通过 motion study 和工作流程研究影响了工业工程、人体工效和现代工作技能训练。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是工作技能最核心的问题之一：沟通、协作、时间、任务边界、工具使用和职业场景中的可靠行动。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    supportZh: "Frank and Lillian Gilbreth 以 motion study、工作动作分析和效率改进闻名，也研究疲劳、工具布置、家庭管理和人体工效，对工业工程和工作设计产生影响。",
    knowledgePointZh: "工作技能关注沟通、协作、时间、任务边界、工具使用和职业场景中的可靠行动。",
    reflectionQuestionZh: "你觉得自己不够努力的时候，有没有可能只是动作、工具或流程需要被重新设计？",
    tagsZh: ["工作技能", "动作研究", "人体工效"],
  },
  "0419": {
    titleZh: "一张小额贷款的桌子",
    summaryZh: "一次乡村小额贷款实验让商业与行政越过传统银行、慈善和社区组织的边界。",
    sceneZh: "20 世纪 70 年代的孟加拉，一个经济学教师走到村里，发现课本里的贫困理论解释不了一张竹凳的债务。",
    storyBodyZh: "他看到一些手工劳动者每天辛苦，却因为借原料的钱来自高利贷，永远被锁在极小利润里。传统银行嫌他们没有抵押，慈善又未必改变生产关系。于是他试着借出很小的钱，观察人们是否能通过互助小组、还款纪律和本地信任建立新的可能。这个模式后来受到广泛赞扬，也面对关于债务压力、性别负担和商业化的批评；但它确实说明，有些商业与行政实践很难放入标准格子。它既像金融，也像发展项目、社会组织和制度实验。这个人叫 Muhammad Yunus，他创立 Grameen Bank 并推动 microcredit，使社会企业和小额金融成为商业与行政边界上的重要案例。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未另分类的商业与行政需要保留下来的边界问题：那些跨越金融、组织、发展、社区和治理的混合实践。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "Muhammad Yunus 1970 年代在孟加拉发展小额贷款实践，1983 年 Grameen Bank 正式成立。他与 Grameen Bank 于 2006 年获诺贝尔和平奖；microcredit 后来也受到关于债务和效果的持续讨论。",
    knowledgePointZh: "未另分类的商业与行政收纳那些跨越金融、组织、发展、社区和治理的混合实践。",
    reflectionQuestionZh: "一个商业工具什么时候是在打开机会，什么时候又可能制造新的依赖？",
    tagsZh: ["小额贷款", "社会企业", "混合实践"],
  },
  "0421": {
    titleZh: "学生第一次听懂普通法",
    summaryZh: "一个讲课者把散落判例和法律传统整理成可学习的体系，让法律教育走向公共语言。",
    sceneZh: "18 世纪的牛津，一个年轻律师面对学生，试着把复杂的普通法讲成一套有次序的课程。",
    storyBodyZh: "当时普通法常被认为只能在律师事务所和法院里慢慢熬出来，外人很难进入。判例、惯例、术语和程序像一片森林，既保护权利，也让许多人迷路。他开始公开讲授英格兰法律，把权利、财产、私人侵害和公共犯罪整理成系统叙述。后来他的书影响巨大，也带着时代局限，尤其在殖民和社会等级问题上需要被批判阅读。但法律作为学科的一个关键变化已经出现：规则不只是专业圈的秘密技术，也可以被讲解、出版、争论和教学。这个人叫 William Blackstone，他的《Commentaries on the Laws of England》成为普通法教育和英美法律思想史上的经典文本。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是法律真正要追问的问题：规则、权利、责任、证据、解释和处理冲突的制度。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "William Blackstone 18 世纪在 Oxford 讲授普通法，1765-1769 年出版《Commentaries on the Laws of England》。该书系统介绍英格兰普通法，对英美法律教育和法律文化影响深远。",
    knowledgePointZh: "法律研究规则、权利、责任、证据、解释和处理冲突的制度。",
    reflectionQuestionZh: "如果规则只被少数专业人士听懂，普通人还怎样保护自己的权利？",
    tagsZh: ["法律", "普通法", "法律教育"],
  },
  "0488": {
    titleZh: "一份关于便宜保险的报告",
    summaryZh: "一个律师把商业数据、行政制度和法律公共性放在一起，试图保护普通人的金融生活。",
    sceneZh: "20 世纪初的波士顿，一个律师听见工薪家庭买不起可靠保险，也看见金融公司如何利用信息不对称。",
    storyBodyZh: "他并不把法律只看成诉讼技巧。对他来说，法律、商业和行政必须一起回答一个问题：普通人在复杂市场里怎样不被制度性弱势吞掉？他研究保险成本、公司利润、储蓄银行制度和公共监管，提出通过 savings bank life insurance 让普通家庭获得更便宜、更透明的人寿保险。这个方案不是单一学科能完成的：需要金融计算、法律授权、行政执行和公共说服。商业、管理与法律的跨学科意义就在这里，市场不是天然公平，规则也不是自动有效，它们必须被设计成能服务真实生活。这个人叫 Louis Brandeis，他推动 savings bank life insurance 等公共改革，并以律师、改革者和美国最高法院大法官身份影响了商业监管与法律公共责任。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是商业、管理与法律跨学科课程要练习的连接能力：组织设计、金融决策、合同、监管、行政执行和问责。所以它不只是商业技巧，而是在训练人把共同承担的后果提前摆到桌面上。",
    supportZh: "Louis Brandeis 是美国律师和最高法院大法官，早年作为公共利益律师参与反垄断、劳工和保险改革。Massachusetts savings bank life insurance 运动把金融、法律和行政改革放在同一个问题里。",
    knowledgePointZh: "商业、管理与法律跨学科课程连接组织设计、金融决策、合同、监管、行政执行和问责。",
    reflectionQuestionZh: "当一种产品太复杂，普通人无法判断风险时，法律和管理应该怎样介入？",
    tagsZh: ["跨学科", "商业监管", "公共责任"],
  },
  "0499": {
    titleZh: "小店里的再装瓶",
    summaryZh: "一家护肤小店把商业、伦理、供应链和行动主义混在一起，让分类变得不够用。",
    sceneZh: "1970 年代英国海边小城，一个女性创业者开了一家小店，顾客拿着空瓶回来重新灌装。",
    storyBodyZh: "她没有按当时化妆品行业的常规走。包装可以简单，动物测试可以被质疑，原料故事可以告诉顾客，商业也可以公开站在环保和人权议题旁边。她的做法后来同样需要复杂评价：品牌扩张、供应链、并购和市场叙事都会让理想变得不纯粹。但这个案例说明，未另分类的商业、管理与法律常常出现在边界上：一件商品既是买卖，也是价值主张、合同关系、劳动条件、生态选择和公共传播。这个人叫 Anita Roddick，她创办 The Body Shop，并以环保、反动物测试和 ethical consumerism 影响了商业伦理与品牌行动主义。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的商业、管理与法律必须面对的问题：那些跨越商业模式、伦理、监管、社区和公共价值的混合安排。这让今天的组织、合同、账本和价格重新变得具体：合作要持续，就必须有人把成本、责任和风险说清楚。",
    supportZh: "Anita Roddick 1976 年在英国 Brighton 创办 The Body Shop。品牌以简约包装、反动物测试、环保和公平贸易等公共议题闻名，是 ethical consumerism 和品牌行动主义的重要案例。",
    knowledgePointZh: "未另分类的商业、管理与法律处理那些跨越商业模式、伦理、监管、社区和公共价值的混合安排。",
    reflectionQuestionZh: "当一个品牌说自己有价值立场时，你会看广告语，还是看它怎样组织供应链和责任？",
    tagsZh: ["商业伦理", "品牌", "混合安排"],
  },
  "0500": {
    titleZh: "山坡上的自然图",
    summaryZh: "一张山体剖面图，让被压在标本夹里的叶片重新回到海拔、温度和位置中。",
    sceneZh: "1802 年前后，南美安第斯山的山坡上，仪器盒、气压计和压花纸被潮气打湿。",
    storyBodyZh: "山脚还带着热气，压花纸到了高处却被冷雾弄软。一个旅行者把叶片夹进纸里，照习惯写下名称；这种办法很有用，标本能被带回欧洲，别人也能知道它属于哪一类。可山坡没有只留下名字。低处的阔叶旁写着一个温度，再往上，硬叶灌木、草本和苔藓挤在更低的气压数字旁；同一页笔记里，植物像是沿着高度换了队形。他停下来重抄记录，把海拔、气温、气压和植物名排成同一列，又把南美山坡同欧洲高山、热带低地的旧记录放在一起比较。原来的问题是“这株植物叫什么”。笔记把问题推向另一处：为什么相似的植物总在相似的高度、冷暖和水汽条件下出现？当这些数字和叶片被画进一座山的剖面，山不再只是采集背景，而变成一张能检查生命分布的图。后来，这位旅行者名叫 Alexander von Humboldt。",
    supportZh: "Alexander von Humboldt 1799-1804 年在美洲考察，测量气候、地理、植物分布等。他的 Chimborazo Naturgemalde 把海拔、植物带和环境数据综合在一张图中，被视为生态和综合自然科学思想的重要象征。",
    knowledgePointZh: "未进一步细分的自然科学、数学与统计在这里出现的关键转向，是把标本名称、海拔、温度、气压和位置放到同一张可检查的图里，让自然从孤立事实变成可比较的分布。",
    reflectionQuestionZh: "当你记录一个现象时，你是在给它取名，还是也在画出它和哪些条件一起出现？",
    tagsZh: ["自然科学", "综合观察", "Humboldt"],
  },
  "0510": {
    titleZh: "小岛上的鸟嘴",
    summaryZh: "一场漫长航行让生物学问题从物种分类，转向生命如何随环境变化。",
    sceneZh: "1830 年代，一位年轻博物学者在船上晕船、采集标本，也在岛屿之间注意到鸟、龟和植物的细微差异。",
    storyBodyZh: "他出发时还不是一个准备推翻传统观念的人，更像一个爱观察的年轻人：写笔记、收集昆虫、寄回标本、和船员一起经历风浪。真正改变他的不是某一个瞬间，而是大量小差异慢慢堆在一起：相近的岛屿有不同的鸟嘴，化石和现生动物彼此呼应，人工育种显示性状可以被选择。多年后，他才把这些线索组织成一个更大的解释：生命不是固定陈列，而是在变异、遗传、环境和选择中逐渐改变。生物及相关科学在这里不再只是给生命命名，也开始追问生命为什么会成为现在这样。这个人叫 Charles Darwin，他通过《On the Origin of Species》提出自然选择理论，成为现代进化生物学的重要奠基人。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是生物及相关科学真正要追问的问题：生命、物种、遗传、适应、演化和生命系统之间的关系。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。",
    supportZh: "Charles Darwin 1831-1836 年随 HMS Beagle 航行，观察地质、生物和岛屿差异；1859 年出版《On the Origin of Species》，系统提出自然选择理论。",
    knowledgePointZh: "生物及相关科学研究生命、物种、遗传、适应、演化和生命系统之间的关系。",
    reflectionQuestionZh: "当你看到两个相似生命的细微差别时，你会把它当偶然，还是当成环境留下的线索？",
    tagsZh: ["生物学", "演化", "自然选择"],
  },
  "0511": {
    titleZh: "雨水里的小动物",
    summaryZh: "一滴看似清亮的水，在小透镜下把自然的尺度往下推了一层。",
    sceneZh: "1670 年代的 Delft，窗边桌上放着一枚自制单透镜、一根细针和一滴存放过的雨水。",
    storyBodyZh: "窗玻璃把北方的光磨得很薄，黄铜小板被手指捏得发热。这个做布料生意的人原先磨镜片，是为了看清纱线粗细、纤维断口和布面瑕疵。清水在肉眼里只是清水；若变浑了，人们也多半说它放坏了。那天，他把一滴存放过的雨水挑到针尖旁，贴近小透镜，先调光，再屏住呼吸找焦点。水滴里忽然有细小的点在转，有的像在划水，有的猛地一闪又躲开。原来的问题很简单：这水干不干净。可如果清亮的水里也有东西在动，肉眼的清楚就不再等于世界的全部。他换另一份水样，又等几天再看，把不同小东西的形状和游动方式写进信里。问题慢慢改口：不是只问水有没有变坏，而是问看不见的生命能不能被工具、样本和重复观察拉到证据面前。那些信后来寄到 Royal Society；署名是 Antonie van Leeuwenhoek。",
    supportZh: "Antonie van Leeuwenhoek 是 17 世纪 Delft 的布商和显微观察者。他使用自制单透镜显微镜观察水样、牙垢、血液、精子等，并在 1670 年代起通过信件向 Royal Society 报告被译为 animalcules 的微小生物观察。",
    knowledgePointZh: "生物学在这里出现的关键转向，是生命不只存在于肉眼能直接确认的尺度里；当工具改变观察尺度，微小生命也能通过样本、重复观察、形态和运动记录进入可检查的自然世界。",
    reflectionQuestionZh: "如果一个东西小到肉眼看不见，你会用什么重复动作让它从猜想变成证据？",
    tagsZh: ["生物学", "显微镜", "微生物"],
  },
  "0512": {
    titleZh: "没有活细胞也会发酵",
    summaryZh: "一瓶被压碎的酵母汁让生物化学看见，生命过程也可以由分子机器推动。",
    sceneZh: "19 世纪末的柏林，一个研究者把酵母细胞磨碎过滤，本来只想保存提取物，却发现液体自己开始冒泡。",
    storyBodyZh: "当时很多人认为发酵必须依赖完整活细胞。可那瓶无细胞酵母汁仍然把糖变成酒精和二氧化碳，像是在提醒人们：生命活动背后还有更小的化学执行者。他反复确认不是污染，也不是残余细胞在偷偷工作。这个发现把问题从“细胞是否活着”推向“细胞内部是什么在催化反应”。生物化学的门由此被推开：生命不是脱离物质的神秘力量，它由酶、分子、能量和反应网络持续维持。这个人叫 Eduard Buchner，他发现无细胞发酵并推动酶学发展，因这项工作获得 1907 年诺贝尔化学奖。今天的生物技术仍在延续这个转念：生命过程可以被研究成反应系统，但每一次应用都要重新问安全和边界。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是生物化学真正要追问的问题：生命里的分子、酶、反应、能量转换和物质变化。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Eduard Buchner 1897 年发现无细胞酵母提取液仍可发酵糖，证明发酵可由细胞内化学物质催化；他因此获得 1907 年诺贝尔化学奖。",
    knowledgePointZh: "生物化学研究生命里的分子、酶、反应、能量转换和物质变化。",
    reflectionQuestionZh: "当生命现象被拆到分子层面，它是变得更冷，还是变得更精细？",
    tagsZh: ["生物化学", "酶", "发酵"],
  },
  "0519": {
    titleZh: "玉米籽粒上的颜色跳动",
    summaryZh: "一个长期被低估的玉米实验，让生命科学看见基因并不总是安静地待在原位。",
    sceneZh: "20 世纪中期的玉米田里，一位女科学家一粒粒观察籽粒颜色，记录那些像斑点一样变化的图案。",
    storyBodyZh: "她的工作很安静，也很孤独。显微镜下的染色体、田里的玉米穗、纸上的谱系图，被她年复一年地连在一起。许多人期待基因像固定位置上的字母，她却从异常颜色和断裂模式里看到另一种可能：某些遗传因子会移动，会调控别的基因表达。这个发现一开始并没有被充分理解，因为它超出了当时主流想象。未另分类的生物相关科学常常就在这种边缘发现中出现：问题横跨遗传、细胞、发育和调控，暂时没有舒服的格子。这个人叫 Barbara McClintock，她发现 transposable elements，后来获得 1983 年诺贝尔生理学或医学奖。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未另分类的生物相关科学必须面对的问题：那些跨越遗传、细胞、发育、生态或生命尺度的复杂现象。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。一粒玉米籽上的斑点很小，却让她意识到基因并不总像固定文字那样安静排列。",
    supportZh: "Barbara McClintock 通过玉米遗传学研究发现 transposable elements，也称 jumping genes。她的发现起初未被广泛理解，后来成为理解基因调控和基因组动态的重要线索，并获 1983 年诺贝尔生理学或医学奖。",
    knowledgePointZh: "未另分类的生物相关科学处理那些跨越遗传、细胞、发育、生态或生命尺度的复杂现象。",
    reflectionQuestionZh: "如果一个异常现象多年没人相信，你还会不会继续认真看它？",
    tagsZh: ["遗传学", "转座子", "生命科学"],
  },
  "0520": {
    titleZh: "春天为什么安静了",
    summaryZh: "一本关于鸟鸣消失的书，让环境问题从局部害虫控制变成整个生态系统的警报。",
    sceneZh: "20 世纪中期的美国，一个海洋生物学家收到越来越多来信：鸟少了，鱼死了，喷洒后的土地不对劲。",
    storyBodyZh: "她原本写过海洋，也擅长把科学写给普通读者。面对杀虫剂，她没有只问它能不能杀死目标害虫，而是追问它进入土壤、水、昆虫、鸟、鱼和人体之后会怎样移动。她阅读研究、整理案例、承受化工行业攻击，也小心避免把复杂生态写成简单恐吓。环境领域在这里变得清楚：人类技术不是只作用于一个点，它会穿过食物链、公共政策、商业利益和日常家庭。一个“有效”的工具，如果看不到长期代价，就可能把春天本身变安静。这个人叫 Rachel Carson，她的《Silent Spring》推动现代环境运动和农药监管讨论，成为环境科学与公共环保意识的重要经典。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是环境领域真正要追问的问题：生态系统、水、污染、气候、资源和人类活动之间的关系。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Rachel Carson 1962 年出版《Silent Spring》，批判 DDT 等农药对生态系统和公共健康的影响。该书促进美国环境运动和后续监管讨论，被视为现代环境意识的重要文本。",
    knowledgePointZh: "环境领域研究生态系统、水、污染、气候、资源和人类活动之间的关系。",
    reflectionQuestionZh: "一种技术解决了眼前问题以后，你会不会继续追问它去了哪里？",
    tagsZh: ["环境", "生态", "农药"],
  },
  "0521": {
    titleZh: "山顶仪器画出的曲线",
    summaryZh: "一个长期测量二氧化碳的人，让环境科学用一条曲线看见整个地球的呼吸。",
    sceneZh: "1958 年的夏威夷 Mauna Loa 山上，一个年轻化学家把空气样本送进仪器，关心小数点后的稳定性。",
    storyBodyZh: "他做的事看起来枯燥：校准仪器，排除局地污染，重复测量，保存长期记录。可正是这种近乎执拗的精确，让大气中二氧化碳逐年上升的趋势变得无法忽视。那条曲线还带着季节性起伏，像地球植被呼吸的节律：春夏下降，秋冬上升。环境科学在这里显示出力量，不是靠一次戏剧性灾难，而是靠持续、可比、可信的数据，把看不见的全球变化变成公共证据。这个人叫 Charles David Keeling，他建立的 Mauna Loa 二氧化碳长期记录形成 Keeling Curve，成为气候变化科学的核心证据之一。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是环境科学真正要追问的问题：污染、资源、气候、生态和人类活动之间的关系，并依赖长期测量与模型判断变化。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Charles David Keeling 从 1958 年开始在 Mauna Loa Observatory 持续测量大气二氧化碳浓度，形成著名 Keeling Curve，显示 CO2 长期上升和季节性变化，是气候科学的重要证据。",
    knowledgePointZh: "环境科学研究污染、资源、气候、生态和人类活动之间的关系，并依赖长期测量与模型判断变化。",
    reflectionQuestionZh: "什么样的变化只有被测量很多年，才终于让人无法继续忽略？",
    tagsZh: ["环境科学", "气候", "长期测量"],
  },
  "0522": {
    titleZh: "黑猩猩手里的草茎",
    summaryZh: "一次野外观察让人重新理解野生动物行为，也让保护不再只是一张物种清单。",
    sceneZh: "1960 年的坦桑尼亚森林里，一个年轻女性坐在树下，长时间等待黑猩猩愿意靠近。",
    storyBodyZh: "她一开始没有传统博士训练，带着笔记本、望远镜和极大的耐心进入森林。很多天里，动物只是远远躲开。后来她看到一只黑猩猩把草茎伸进白蚁丘，再把沾满白蚁的草茎送入口中。这个小动作意义巨大：工具使用不再能轻易被说成只有人类才会。更重要的是，长期观察让每只动物有了个体性格、亲属关系、冲突、照料和学习。自然环境与野生动物研究因此不只是数有多少只动物，也要理解栖息地、行为、社会关系和人类干扰。这个人叫 Jane Goodall，她在 Gombe 的黑猩猩长期研究改变了灵长类行为学和野生动物保护的公众理解。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是自然环境与野生动物最核心的问题之一：栖息地、物种行为、保护、生态平衡和人类活动影响。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。那根草茎很轻，却让“会不会使用工具”这个问题变得沉重起来。它要求观察者把耐心放在判断之前。",
    supportZh: "Jane Goodall 1960 年开始在 Gombe Stream 观察黑猩猩，记录工具使用、社会行为、亲属关系和个体差异。她的长期研究深刻影响灵长类动物学和野生动物保护。",
    knowledgePointZh: "自然环境与野生动物关注栖息地、物种行为、保护、生态平衡和人类活动影响。",
    reflectionQuestionZh: "当你发现一种动物也会学习和使用工具，你对“人类特殊性”的想法会怎样改变？",
    tagsZh: ["野生动物", "行为观察", "保护"],
  },
  "0529": {
    titleZh: "树苗和妇女手里的水桶",
    summaryZh: "一场种树运动说明，环境问题常常同时是土地、水、性别、民主和社区组织问题。",
    sceneZh: "1970 年代的肯尼亚，一个受过生物学训练的女性听见乡村妇女说，柴火远了，水少了，土也越来越薄。",
    storyBodyZh: "她没有把这些抱怨当作零散生活困难。树被砍掉，水源变差，土壤流失，妇女走更远的路找燃料，家庭和地方政治都被牵动。于是她从最朴素的动作开始：组织妇女育苗、种树、照看树，也让种树变成教育、收入、社区权利和民主参与的入口。未另分类的环境领域常常这样出现：它不只是生态学，也不只是扶贫、女性权益或政治改革，而是这些东西在同一片土地上纠缠。这个人叫 Wangari Maathai，她创立 Green Belt Movement，并因环境保护、妇女赋权和民主行动获得 2004 年诺贝尔和平奖。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未另分类的环境领域必须面对的问题：跨越水、土、生态、社区、政策和社会公平的复杂环境实践。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Wangari Maathai 1977 年在肯尼亚创立 Green Belt Movement，组织社区尤其是妇女种树，连接环境恢复、社区发展、妇女赋权和民主倡议。她于 2004 年获诺贝尔和平奖。",
    knowledgePointZh: "未另分类的环境领域处理跨越水、土、生态、社区、政策和社会公平的复杂环境实践。",
    reflectionQuestionZh: "一棵树什么时候不只是树，而是水、时间、收入和公共权利的交点？",
    tagsZh: ["环境", "社区", "种树"],
  },
  "0530": {
    titleZh: "斜面上的小球",
    summaryZh: "一个滚下斜面的小球，让物理科学开始用实验、测量和数学追问运动。",
    sceneZh: "17 世纪意大利，一个教师让小球沿斜面滚下，用水钟和刻度记录它怎样加速。",
    storyBodyZh: "他并不满足于背诵古代权威关于重物下落的说法。真实下落太快，不容易测；于是他把斜面变成放慢运动的工具，让时间、距离和速度之间的关系可以被观察。小球每次滚动都像在提醒他：自然不是只能被辩论，也可以被设计实验来询问。物理科学的精神在这里显现：把看似普通的运动拆成可测量关系，用数学表达规律，再让实验反复挑战直觉。这个人叫 Galileo Galilei，他通过落体、斜面和天文观察等研究推动近代物理科学和实验方法的发展。学生在实验室里重复这种动作时，学到的不只是公式，而是怎样让自然用可检查的方式回答问题。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是物理科学真正要追问的问题：物质、能量、运动、力、材料和自然规律如何在可观察现象中表现出来。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。那颗小球滚下去的时间很短，却把科学学习拉长了：人开始愿意为了看清关系而重新设计问题。",
    supportZh: "Galileo Galilei 研究落体和斜面运动，使用实验与数学分析运动规律；他也通过望远镜天文观察挑战传统宇宙观，被视为近代科学革命的重要人物。",
    knowledgePointZh: "物理科学研究物质、能量、运动、力、材料和自然规律如何在可观察现象中表现出来。",
    reflectionQuestionZh: "当一个现象太快看不清时，你能不能设计一种方法让它慢下来回答你？",
    tagsZh: ["物理科学", "实验", "运动"],
  },
  "0531": {
    titleZh: "燃烧后少了什么",
    summaryZh: "一次关于燃烧和称量的坚持，让化学从旧术语转向质量、元素和反应。",
    sceneZh: "18 世纪巴黎，一个税务官兼科学家在实验室里反复称量金属、空气和燃烧后的残留物。",
    storyBodyZh: "当时流行的燃素说把燃烧解释成某种东西逃走。可他的天平总把问题拉回物质本身：如果燃烧后质量增加，是否说明空气中的某部分加入了反应？他和同伴改进仪器、命名氧气和氢气、整理元素概念，也推动化学语言从含混传统走向更可核对的体系。化学在这里不是神秘炼金，而是精确称量、封闭系统、命名规则和反应关系。这个人叫 Antoine Lavoisier，他通过燃烧理论、质量守恒和化学命名改革成为现代化学的重要奠基人之一。学生第一次认真看一个反应时，学到的不只是物质名称，而是守恒、测量和证据如何一起改变解释。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是化学真正要追问的问题：物质组成、性质、反应、能量变化和变化条件。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。称量让解释变得克制。它把“好像消失了”的感觉，变成了可以追问空气、物质和反应关系的证据。",
    supportZh: "Antoine Lavoisier 18 世纪通过燃烧和氧化研究推翻燃素说，提出质量守恒思想，并参与现代化学命名体系改革，常被称为现代化学奠基人之一。",
    knowledgePointZh: "化学研究物质组成、性质、反应、能量变化和变化条件。",
    reflectionQuestionZh: "当你改变一个物质时，你会只看结果，还是追问每一部分去了哪里？",
    tagsZh: ["化学", "燃烧", "质量守恒"],
  },
  "0532": {
    titleZh: "大陆像拼图一样裂开",
    summaryZh: "一位气象学家的地图直觉，让地球科学重新想象大陆、海洋和深时间。",
    sceneZh: "20 世纪初，一个研究天气和极地的科学家看着世界地图，注意到南美和非洲海岸像可以拼合的边缘。",
    storyBodyZh: "他不是地质学正统圈里的权威人物。除了海岸线，他还比较化石分布、岩层、古气候痕迹和冰川证据，提出大陆曾经连在一起，后来漂移分开。许多地质学家一开始反对，尤其因为他无法解释大陆移动的可靠机制。这个理论长期被冷落，直到海底扩张、古地磁和板块构造证据出现，才重新获得力量。地球科学在这里显示出耐心：一条好问题有时先于完整机制出现，而地球的历史远比脚下的静止感更活跃。这个人叫 Alfred Wegener，他提出 continental drift 理论，为后来板块构造学说的发展提供了关键思想前身。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是地球科学真正要追问的问题：岩石、水、气候、地形、地球内部和地球系统在长时间尺度上的变化。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Alfred Wegener 1912 年提出大陆漂移思想，1915 年出版《The Origin of Continents and Oceans》。他的理论起初因缺少机制受批评，后在海底扩张和板块构造证据出现后被重新评价。",
    knowledgePointZh: "地球科学研究岩石、水、气候、地形、地球内部和地球系统在长时间尺度上的变化。",
    reflectionQuestionZh: "你脚下看似稳定的地面，可能在多长的时间里一直移动？",
    tagsZh: ["地球科学", "大陆漂移", "板块"],
  },
  "0533": {
    titleZh: "苹果和月亮之间",
    summaryZh: "一个关于坠落的普通问题，把地上的运动和天上的轨道放进同一套物理规则。",
    sceneZh: "17 世纪英格兰，一位年轻学者在瘟疫期间离开大学回到乡下，继续独自思考光、运动和数学。",
    storyBodyZh: "故事常被讲成苹果砸头的瞬间，其实更重要的是他愿意把两个世界连起来：苹果为什么落下，月亮为什么不直线飞走，而是绕着地球？如果同一种吸引力既作用在地面物体，也作用在天体上，那么自然界就不是由两套规则管理。他用数学表达运动定律和万有引力，把经验、几何和天文观测组织成新的体系。物理学由此展现出一种强大想象：最普通的下落，可能和宇宙尺度的运行属于同一个问题。这个人叫 Isaac Newton，他在《Philosophiae Naturalis Principia Mathematica》中提出运动定律和万有引力理论，奠定经典力学基础。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是物理学真正要追问的问题：运动、能量、力、物质和自然规律，用模型解释从日常到宇宙尺度的现象。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。",
    supportZh: "Isaac Newton 1687 年出版《Principia》，系统提出三大运动定律和万有引力理论，统一解释地面运动与天体运动，是经典物理学的重要奠基成果。",
    knowledgePointZh: "物理学研究运动、能量、力、物质和自然规律，用模型解释从日常到宇宙尺度的现象。",
    reflectionQuestionZh: "你身边哪一个普通动作，可能和更大的自然规律连在一起？",
    tagsZh: ["物理学", "运动定律", "引力"],
  },
  "0539": {
    titleZh: "磁针旁边的电流",
    summaryZh: "一次讲台上的偏转让物理科学边界松动，电和磁开始成为同一个故事。",
    sceneZh: "1820 年的哥本哈根，一个教师在课堂演示中发现，通电导线旁的磁针突然偏转。",
    storyBodyZh: "他原本想展示的是电学实验，却被一个看似偶然的小动作抓住：电流经过时，磁针不再安静指北。这个现象说明电和磁之间可能有深层联系。后来更多实验者接过问题，把电流、磁场、感应和力的关系逐渐展开。未另分类的物理科学常出现在这样的交界处：它不完全属于旧的电学，也不完全属于磁学，而是在现象逼迫分类改变时出现。科学进展有时不是给旧抽屉再贴标签，而是承认抽屉本身需要重做。这个人叫 Hans Christian Oersted，他发现电流的磁效应，推动电磁学作为统一研究领域的发展。今天许多新领域也这样出现：一个小现象先让旧分类不舒服，然后才慢慢逼出新的问题和新的语言。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的物理科学收纳跨越物质、能量、场、实验现象和学科边界的真正要追问的问题：。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Hans Christian Oersted 1820 年发现电流可使磁针偏转，显示电与磁之间存在联系。该发现开启了电磁学发展，影响 Ampere、Faraday、Maxwell 等后续研究。",
    knowledgePointZh: "未另分类的物理科学收纳跨越物质、能量、场、实验现象和学科边界的研究。",
    reflectionQuestionZh: "当一个小偏转让两个领域突然相遇，你会先修正实验，还是修正分类？",
    tagsZh: ["电磁学", "物理科学", "实验"],
  },
  "0540": {
    titleZh: "算术书里的陌生数字",
    summaryZh: "一本关于计算的书让数学与统计从地方技巧走向可传播的符号系统。",
    sceneZh: "9 世纪的巴格达，一个学者在智慧宫附近整理印度数字、方程和实际计算问题。",
    storyBodyZh: "他面对的不是纯粹游戏，而是继承、贸易、测量、税收和土地分配中的真实计算。旧方法可以算，但不够统一，也不容易传播。他把印度数字和十进位计算介绍给阿拉伯语读者，又系统讨论线性和二次方程的解法。数学与统计的基础意义在这里很清楚：符号一旦变得可写、可教、可复用，复杂关系就能离开个人头脑，成为社会共同工具。这个人叫 Muhammad ibn Musa al-Khwarizmi，他的代数学著作和关于印度数字的作品影响了 algebra 与 algorithm 等概念的历史发展。后来无数课堂、账本和程序都沿着这条路继续走：先把关系写清楚，更多人才能一起检查、改进和使用它。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未进一步细分的数学与统计最核心的问题之一：数量、结构、符号、模型和数据如何帮助人推理。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Muhammad ibn Musa al-Khwarizmi 是 9 世纪巴格达学者，著有关于代数学的《Al-jabr wa'l muqabala》及介绍印度数字和十进位计算的作品，其名字和著作影响了 algebra 与 algorithm 的词源和数学史。",
    knowledgePointZh: "未进一步细分的数学与统计关注数量、结构、符号、模型和数据如何帮助人推理。",
    reflectionQuestionZh: "一种更好的符号，怎样让原本困难的问题开始被更多人共同解决？",
    tagsZh: ["数学", "代数", "符号"],
  },
  "0541": {
    titleZh: "从一点到一座几何世界",
    summaryZh: "一本从定义和公设开始的书，让数学成为可一步步证明的共同建筑。",
    sceneZh: "公元前 3 世纪的亚历山大，一个教师面对学生，把点、线、圆和角整理成一条严格道路。",
    storyBodyZh: "他没有从最华丽的图形讲起，而是从最小的东西开始：什么是点，什么是线，什么可以被假定，什么必须证明。一个命题接一个命题，像砖块一样搭起几何体系。重要的不只是结论，而是任何人都可以沿着理由回走，检查每一步是否成立。数学在这里显示出独特力量：它把直觉变成证明，把图形变成结构，把个人聪明变成可共享的推理秩序。这个人叫 Euclid，他编写《Elements》，成为几何学、证明传统和数学教育史上最重要的经典之一。今天学习证明仍有这种价值：它让人不只得到答案，也学会把相信建立在别人可以回走检查的理由上。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是数学使用的方法：用数量、结构、空间、模式和证明澄清关系。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。几何从点和线开始，却把人带到一种更大的训练里：每一步都要能被别人沿着理由重新走一遍。",
    supportZh: "Euclid 活跃于公元前 3 世纪左右的 Alexandria。《Elements》系统整理平面几何、数论和比例等内容，以定义、公设和证明组织数学知识，对数学教育和证明传统影响极深。",
    knowledgePointZh: "数学用数量、结构、空间、模式和证明澄清关系。",
    reflectionQuestionZh: "当一个结论必须一步步被证明，它会不会也训练你更诚实地相信？",
    tagsZh: ["数学", "几何", "证明"],
  },
  "0542": {
    titleZh: "他开始数街上的人",
    summaryZh: "一个仰望星空的人转身整理城市登记册，让统计学成为理解社会模式的工具。",
    sceneZh: "19 世纪初的布鲁塞尔，夜空常常不够清楚，一个年轻天文学家只能等云散开，再把星星位置记在纸上。",
    storyBodyZh: "天文观测总有误差。这个年轻人慢慢学会，不必把每个偏差都当成失败；很多偏差放在一起，反而会显出一种分布。后来，他把这种耐心从天空带回城市。出生、死亡、婚姻、身高、犯罪记录，这些原本散在登记册里的数字，被他一列一列整理出来。一个人的一生不能被表格解释，但很多人的记录放在一起，会露出某种社会形状。他提出“平均人”的想法，启发很大，也很危险：平均值能让混乱变得可读，却也可能压平真实差异。这个人叫 Adolphe Quetelet，他把统计方法引入社会现象研究，并留下后来影响 BMI 的 Quetelet Index 源头。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是统计学真正要追问的问题：数据收集、变化、不确定性、推断、偏差，以及大量个体记录背后的模式。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Adolphe Quetelet 是比利时天文学家、数学家、统计学家和社会学先驱；1835 年出版关于社会物理学和“平均人”的重要著作，并将统计方法应用到犯罪、婚姻、死亡等社会现象。",
    knowledgePointZh: "统计学研究数据收集、变化、不确定性、推断、偏差，以及大量个体记录背后的模式。",
    reflectionQuestionZh: "你看到一个平均数时，最想知道它帮你看见了什么，又遮住了什么？",
    tagsZh: ["统计学", "平均数", "社会数据"],
  },
  "0588": {
    titleZh: "星星亮度里的尺子",
    summaryZh: "一个在照片底片上比较星光的人，把天文学、数学和统计连成测量宇宙距离的方法。",
    sceneZh: "20 世纪初的哈佛天文台，一位女性计算员坐在成排玻璃底片前，逐颗比较变星的亮度。",
    storyBodyZh: "她的工作头衔并不显赫，很多女性计算员被安排做重复而精细的记录。可她在麦哲伦云的变星中发现一种关系：某些造父变星变化周期越长，真实亮度越高。这个关系像一把宇宙尺子，只要知道周期，就能推算亮度，再进一步估计距离。自然科学、数学与统计在这里完全交织：天文观测提供材料，数学关系组织模式，统计比较让规律浮现。她的发现后来帮助人类测量银河系之外的距离。这个人叫 Henrietta Swan Leavitt，她发现造父变星周期-光度关系，成为现代宇宙距离尺度的重要基础。这也是数据和自然科学相遇时最动人的地方：微小记录不会自动说话，但耐心比较能让它们变成尺度。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是自然科学、数学与统计跨学科课程把观察、模型、测量和数据推断要练习的连接能力：起来。所以它不只是科学史，而是在训练人慢下来，让自然用可检查的方式回答问题。她面对的是一张张安静底片，但真正困难的是在重复记录中相信微小差别值得被认真比较。",
    supportZh: "Henrietta Swan Leavitt 在 Harvard College Observatory 工作，1912 年发表关于小麦哲伦云造父变星周期与光度关系的研究。该关系成为测量宇宙距离的重要方法基础。",
    knowledgePointZh: "自然科学、数学与统计跨学科课程把观察、模型、测量和数据推断连接起来。",
    reflectionQuestionZh: "一张照片底片里的小点，怎样可能变成测量宇宙的尺子？",
    tagsZh: ["跨学科", "天文学", "统计"],
  },
  "0599": {
    titleZh: "海岸线到底有多长",
    summaryZh: "一个关于海岸线的问题，让自然、数学和统计之间出现了新的粗糙尺度。",
    sceneZh: "20 世纪中期，一个数学家盯着地图上的海岸线，发现尺子越短，量出的长度越长。",
    storyBodyZh: "传统几何喜欢光滑线条，可真实世界的云、山、树、河流和海岸都不那么听话。用大尺子量，很多弯曲被忽略；用小尺子量，细节不断冒出来，长度似乎没有稳定终点。他把这种粗糙、重复、自相似的形状发展成新的数学语言。这个方向既不像普通几何，也不只是物理或统计，却能帮助人描述自然界大量不规则形态。未另分类的自然科学、数学与统计就适合保存这种边界问题：分类暂时跟不上现象，但现象已经在要求新工具。这个人叫 Benoit Mandelbrot，他发展 fractal geometry，使分形成为理解自然形态、复杂系统和尺度问题的重要数学语言。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的自然科学、数学与统计需要保留下来的边界问题：那些跨越自然形态、数学结构、数据和模型的边界问题。这让今天的实验和自然观察重新变得具体：一个现象不会自己变成证据，必须有人愿意测量、比较、记录和修正解释。",
    supportZh: "Benoit Mandelbrot 1967 年发表关于英国海岸线长度的论文，后来系统发展 fractal geometry。分形几何用于描述自相似、粗糙和尺度相关的自然及数学形态。",
    knowledgePointZh: "未另分类的自然科学、数学与统计收纳那些跨越自然形态、数学结构、数据和模型的边界问题。",
    reflectionQuestionZh: "如果一个东西越仔细看越复杂，你会把它当噪声，还是当成需要新数学的信号？",
    tagsZh: ["分形", "尺度", "复杂性"],
  },
  "0610": {
    titleZh: "信息像硬币一样可以计量",
    summaryZh: "一个电话实验室里的年轻数学家，把通信问题变成现代信息时代的基础语言。",
    sceneZh: "20 世纪 40 年代的 Bell Labs，一个年轻研究员面对电报、电话和噪声，问一个奇怪问题：信息到底能不能被测量？",
    storyBodyZh: "他不先关心消息内容是情书、新闻还是订单，而是问信号如何通过带噪声的通道，怎样编码，怎样减少不确定性，怎样在有限带宽里可靠传输。这个抽象看似冷，却非常有力：信息可以用 bit 计量，通信可以用数学模型分析，冗余、噪声、编码和容量都能被系统研究。信息与通信技术在这里不只是设备集合，而是一整套关于信息如何表示、传输、压缩和保护的思想。这个人叫 Claude Shannon，他在 1948 年发表《A Mathematical Theory of Communication》，奠定现代信息论基础。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未进一步细分的信息与通信技术最核心的问题之一：信息表示、传输、计算、工具、网络和数字系统如何协同工作。这让今天的软件、网络、数据和 AI 工具重新变得具体：工具背后总有路径、假设、权限和责任。",
    supportZh: "Claude Shannon 1948 年发表《A Mathematical Theory of Communication》，提出 bit、entropy、channel capacity 等核心思想，被视为现代信息论奠基人。",
    knowledgePointZh: "未进一步细分的信息与通信技术关注信息表示、传输、计算、工具、网络和数字系统如何协同工作。",
    reflectionQuestionZh: "当一条消息穿过噪声抵达你面前，中间有多少不可见的设计在保护它？",
    tagsZh: ["信息论", "通信", "ICT"],
  },
  "0611": {
    titleZh: "鼠标第一次指向屏幕",
    summaryZh: "一次公开演示让计算机使用从输入命令，转向人与屏幕、指针和协作工具的互动。",
    sceneZh: "1968 年旧金山，一个工程师坐在舞台控制台前，屏幕上出现文字、窗口、链接和一个会移动的光标。",
    storyBodyZh: "他关心的不是让机器替人炫技，而是怎样增强人的思考和协作能力。打字、指向、编辑、共享屏幕、远程协作、超文本链接，这些今天看似普通的动作，当时像是从未来提前出现。他把计算机使用理解为人和工具共同构成的工作环境：手怎样移动，眼睛怎样寻找，团队怎样共享文档，想法怎样被外化和修改。计算机使用从此不只是会不会操作机器，而是怎样让数字工具进入人的认知、沟通和日常工作。这个人叫 Douglas Engelbart，他在 1968 年的 Mother of All Demos 中展示鼠标、窗口、超文本和协作计算等关键思想。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是计算机使用最核心的问题之一：基本数字工具、文件、账户、安全、界面和日常操作能力。所以它不只是会不会操作机器，而是在训练人把想法清楚地交给系统，也能检查系统怎样回应。",
    supportZh: "Douglas Engelbart 1968 年在 Fall Joint Computer Conference 进行著名演示，后来被称为 Mother of All Demos，展示鼠标、图形交互、超文本、视频会议和协作编辑等技术。",
    knowledgePointZh: "计算机使用关注基本数字工具、文件、账户、安全、界面和日常操作能力。",
    reflectionQuestionZh: "一个好工具是在替你思考，还是让你更容易看见并改写自己的思考？",
    tagsZh: ["计算机使用", "鼠标", "人机交互"],
  },
  "0612": {
    titleZh: "表格为什么应该彼此有关系",
    summaryZh: "一个数据库研究者把数据从杂乱文件中解放出来，让表、关系和查询成为可靠系统。",
    sceneZh: "20 世纪 60 年代末，一位 IBM 研究员看着企业数据系统，发现程序和数据像缠在一起的线团。",
    storyBodyZh: "当时许多数据系统依赖复杂文件结构，应用程序必须知道数据怎样存放，改一点结构就可能牵动一片代码。他提出用关系模型表示数据：把数据看作表，把关系和约束说清楚，再用更高层的语言查询，而不是让每个程序都迷失在存储细节里。数据库与网络设计及管理的核心由此变得清楚：多人共享信息时，结构、独立性、一致性和查询能力比临时保存更重要。这个人叫 Edgar F. Codd，他提出 relational model，奠定关系型数据库理论基础，深刻影响 SQL 和现代数据管理系统。今天每个共享表格、账号系统和应用后台都还在回应这个问题：数据怎样才能不靠记忆，而靠结构被多人信任。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是数据库与网络设计及管理最核心的问题之一：数据结构、连接、权限、可靠性、查询和维护。这让今天的软件、网络、数据和 AI 工具重新变得具体：工具背后总有路径、假设、权限和责任。",
    supportZh: "Edgar F. Codd 1970 年发表论文《A Relational Model of Data for Large Shared Data Banks》，提出关系模型，对关系型数据库和 SQL 发展产生基础性影响。",
    knowledgePointZh: "数据库与网络设计及管理关注数据结构、连接、权限、可靠性、查询和维护。",
    reflectionQuestionZh: "当很多人必须同时信任同一份数据时，它应该靠记忆，还是靠结构？",
    tagsZh: ["数据库", "关系模型", "数据管理"],
  },
  "0613": {
    titleZh: "她看见机器不只会算数",
    summaryZh: "在一台尚未建成的机器旁，Ada Lovelace 看见了指令、符号和可执行想法的早期影子。",
    sceneZh: "1833 年的伦敦，客厅里有人低声交谈。桌上的纸页和茶杯旁，一台由齿轮、轴杆和金属片组成的机器吸引着来客。",
    storyBodyZh: "那个女孩才十七岁。她站在机器旁边，看着人们围过来，听他们谈论计算、速度和精确。那时的计算表常靠人一点点手算，出错并不稀奇。如果机器能替人算得更快，已经足够让很多人兴奋。可她停得久了一点。她想的不是这台机器能算多少，而是另一个问题：如果数字不只代表数量，也能代表音符、图案、关系和规则，那么机器处理的，真的只是数字吗？这个问题没有马上变成答案。几年后，她翻译一篇介绍 Analytical Engine 的文章。翻译本来只需要转述原文，她却把注释越写越长，试着说明机器怎样一步一步计算 Bernoulli numbers：先取什么数，再做什么运算，什么时候重复，什么时候停止。那些表格不像今天的代码，却已经很接近把人的意图拆成机器可以执行的步骤。很多年后，人们回头寻找计算机程序最早的影子，常会翻到那篇译文和后面的 Notes。署名处的名字，是 Ada Lovelace。藏在这个故事里的，其实是软件与应用开发最核心的问题：怎样把一个模糊的人类想法，写成机器可以理解、执行、检查和改进的步骤。对学生来说，信息技术不是只会操作工具，而是看懂工具背后有哪些假设、路径和责任。",
    supportZh: "Ada Lovelace 于 1843 年翻译 Luigi Menabrea 关于 Analytical Engine 的文章，并加入长篇 Notes。其中 Note G 描述了计算 Bernoulli numbers 的方法，常被视为最早公开发表的计算机程序之一。Analytical Engine 在当时并未真正建成。",
    knowledgePointZh: "软件与应用开发及分析关心的不只是写代码，而是把需求、逻辑、符号、界面、测试和改进连成一套可靠过程，让机器能够执行人的想法。",
    reflectionQuestionZh: "当机器开始执行人的想法时，最难的部分是机器足够聪明，还是人能不能把自己的想法说清楚？",
    tagsZh: ["软件", "程序", "Ada Lovelace"],
  },
  "0619": {
    titleZh: "钢琴卷纸和编译器",
    summaryZh: "一位海军数学家把程序语言从机器细节中拉近人类表达，也让 ICT 边界更宽。",
    sceneZh: "20 世纪中期，一位女性数学家在早期计算机旁工作，看到程序员被机器码和接线细节困住。",
    storyBodyZh: "她喜欢把抽象问题讲得可操作，也相信计算机不该只属于少数能背机器指令的人。她推动自动编程和编译器思想，让人可以用更接近英语的方式表达商业计算任务，再由机器翻译成可执行指令。许多人起初怀疑机器怎么可能理解这种语言，但这条路改变了软件生产和普通组织使用计算机的可能。未另分类的信息与通信技术常常容纳这种跨界发明：它既是语言设计，也是工具、教育、商业流程和计算文化。这个人叫 Grace Hopper，她推动早期编译器和 COBOL 发展，成为现代编程语言和计算普及史上的关键人物。今天的低代码工具和 AI 编程仍在延续这条线：技术入口变低以后，更重要的是让更多人清楚表达、检查和负责。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的信息技术需要保留下来的边界问题：那些不适合标准软件、网络或使用标签的数字实践和工具创新。这让今天的软件、网络、数据和 AI 工具重新变得具体：工具背后总有路径、假设、权限和责任。",
    supportZh: "Grace Hopper 是美国计算机科学家和海军军官，参与早期编译器、FLOW-MATIC 和 COBOL 相关工作，推动更接近自然语言的商业编程语言发展。",
    knowledgePointZh: "未另分类的信息技术收纳那些不适合标准软件、网络或使用标签的数字实践和工具创新。",
    reflectionQuestionZh: "当工具语言更接近人的语言，谁会第一次被允许进入技术世界？",
    tagsZh: ["编译器", "编程语言", "ICT"],
  },
  "0688": {
    titleZh: "防空炮为什么总慢半拍",
    summaryZh: "一个关于控制和反馈的问题，把计算、工程、生物和通信连成新的跨学科语言。",
    sceneZh: "第二次世界大战期间，一位数学家研究防空炮如何预测飞机位置，发现机器必须根据误差不断修正自己。",
    storyBodyZh: "他看到的不是单一工程问题。雷达给出信息，炮塔需要动作，目标在移动，系统根据误差反馈调整；类似过程也出现在神经系统、动物运动、通信网络和自动控制里。于是他把“控制与通信”作为共同问题来思考，提出 feedback、信息和系统调节的语言。ICT 的跨学科意义在这里出现：计算不只是电脑，通信不只是电线，控制不只是机器，而是生命、技术和组织都可能共享的结构。这个人叫 Norbert Wiener，他创立 cybernetics，使控制、通信、反馈和系统思想成为信息技术、自动化和跨学科研究的重要基础。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是信息与通信技术跨学科课程要练习的连接能力：计算、通信、控制、系统、工程和人的使用场景。所以它不只是会不会操作机器，而是在训练人把想法清楚地交给系统，也能检查系统怎样回应。一旦系统能听见误差，机器就不再只是执行命令；它开始在偏差里学习怎样回到可控状态。",
    supportZh: "Norbert Wiener 1948 年出版《Cybernetics: Or Control and Communication in the Animal and the Machine》，提出控制、通信、反馈等跨生物、机器和社会系统的思想，对信息技术和系统科学影响深远。",
    knowledgePointZh: "信息与通信技术跨学科课程连接计算、通信、控制、系统、工程和人的使用场景。",
    reflectionQuestionZh: "一个系统能学习修正自己之前，必须先听见哪一种反馈？",
    tagsZh: ["控制论", "反馈", "跨学科ICT"],
  },
  "0700": {
    titleZh: "铁桥、隧道和一艘大船",
    summaryZh: "一个总把约束推到极限的工程师，让工程、制造与建筑成为现代世界的骨架。",
    sceneZh: "19 世纪英国，一个年轻工程师站在泥泞河岸、铁路工地和造船厂之间，面对的从来不是单一难题。",
    storyBodyZh: "桥要跨得更远，隧道要穿过更危险的地层，铁路要让城市和港口重新连接，船要在大西洋上承受风浪、燃料和钢铁结构的限制。他常常大胆到让人害怕，也并非每个项目都顺利；成本、事故、健康和公众信任不断压过来。但正是在这种现实压力里，工程、制造与建筑的共同本质显出来：把材料、力、资金、时间、风险和人的移动需求组织成可运行的实体世界。这个人叫 Isambard Kingdom Brunel，他通过 Great Western Railway、Thames Tunnel、Clifton Suspension Bridge 和大型蒸汽船等项目成为工业时代工程史的重要人物。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是未进一步细分的工程、制造与建筑最核心的问题之一：材料、结构、流程、风险、执行和真实世界约束如何共同形成可用系统。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。",
    supportZh: "Isambard Kingdom Brunel 是 19 世纪英国工程师，参与 Thames Tunnel，设计 Great Western Railway、Clifton Suspension Bridge，并建造 SS Great Western、SS Great Britain、SS Great Eastern 等船舶。",
    knowledgePointZh: "未进一步细分的工程、制造与建筑关注材料、结构、流程、风险、执行和真实世界约束如何共同形成可用系统。",
    reflectionQuestionZh: "一个宏大工程背后，最难的到底是想象力，还是把想象放进材料和风险里？",
    tagsZh: ["工程", "制造", "建筑"],
  },
  "0710": {
    titleZh: "屋顶为什么不能只靠图纸漂亮",
    summaryZh: "一个工程师在复杂建筑里证明，工程不是给建筑补强，而是和形式一起思考可能性。",
    sceneZh: "20 世纪的悉尼，一座歌剧院的壳形屋顶让建筑师、政府和工程团队都陷入难题。",
    storyBodyZh: "他面对的不是普通计算题。建筑形态大胆，预算和政治压力不断增加，原本的曲面难以制造和支撑。工程团队必须把美学愿望、几何规则、预制构件、受力路径和施工方法重新组合，直到壳体可以被分解、制造和安装。这个过程并不完美，也伴随争议，但它说明工程行业的核心不只是按图施工。真正的工程要在愿望与现实之间翻译：哪些形状能被建造，哪些材料能承受，哪些步骤能让危险变小。这个人叫 Ove Arup，他领导 Sydney Opera House 工程工作，并推动结构工程与建筑设计深度协作的现代实践。今天任何大胆设计落地时，都还要经过类似翻译：把愿望拆进材料、预算、工期、责任和可以被检验的安全边界里。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是工程及工程行业真正要追问的问题：结构、材料、系统、施工、维护和技术约束如何让设计变成可靠现实。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Ove Arup 是结构工程师和 Arup 公司创始人。他的团队参与 Sydney Opera House 复杂壳体结构工程，项目成为建筑与工程协作史上的重要案例。",
    knowledgePointZh: "工程及工程行业研究结构、材料、系统、施工、维护和技术约束如何让设计变成可靠现实。",
    reflectionQuestionZh: "当一个想法看起来很美，你会从哪里开始判断它能不能被建成？",
    tagsZh: ["工程", "结构", "建筑协作"],
  },
  "0711": {
    titleZh: "工厂里的化学不再只是烧瓶",
    summaryZh: "一个讲授工业流程的人，让化学工程从实验室反应走向可放大的生产系统。",
    sceneZh: "19 世纪英国的化工厂旁，一个顾问和教师看见酸、碱、气体和设备在大规模生产里变得危险又昂贵。",
    storyBodyZh: "实验室里反应成功，不等于工厂就能稳定、安全、便宜地生产。温度、压力、流量、腐蚀、废气、管道和工人安全都会改变结果。他开始把不同化工行业中的共同操作抽出来讲：蒸馏、吸收、过滤、传热、物料平衡。这个思路让化学工程有了自己的对象：不是单个化学反应，而是把反应变成连续、可控、可规模化流程的全部条件。这个人叫 George E. Davis，他通过化学工程讲座和《A Handbook of Chemical Engineering》推动 chemical engineering 作为独立工程领域形成。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是化学工程与工艺要完成的转换：把化学反应转化为安全、可控、可规模化和可维护的生产流程。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。从实验室到工厂，成功不只是反应发生了，而是反应能不能被稳定、可控、可维护地重复。",
    supportZh: "George E. Davis 是英国化学工程先驱，1887 年在 Manchester 开设化学工程系列讲座，1901 年出版《A Handbook of Chemical Engineering》，强调工业化学过程和单元操作思想。",
    knowledgePointZh: "化学工程与工艺把化学反应转化为安全、可控、可规模化和可维护的生产流程。",
    reflectionQuestionZh: "从烧瓶成功到工厂稳定，中间有哪些条件会突然变成真正的问题？",
    tagsZh: ["化学工程", "工艺", "规模化"],
  },
  "0712": {
    titleZh: "水龙头里的安全",
    summaryZh: "一位公共卫生工程师让净水技术成为城市看不见却最重要的保护系统之一。",
    sceneZh: "20 世纪初的美国城市里，自来水进入家庭，但病菌、管网和消毒剂剂量仍然让人不安。",
    storyBodyZh: "他关心的不只是把水变清，而是怎样让数十万人每天喝到足够安全的水。氯能杀菌，但剂量、接触时间、味道、管网污染和公众信任都要被精确处理。环境保护技术在这里不是某个漂亮设备，而是一整套工程判断：检测、消毒、输送、监测和维护，必须长期稳定地工作。人们最好永远不要想起它，因为想起它时往往已经出事。这个人叫 Abel Wolman，他与 Linn Enslow 发展供水氯化剂量控制方法，推动现代城市饮用水消毒和公共卫生工程。今天任何保护环境的技术都必须经过这一步：装置不是答案本身，长期运行、维护和责任才决定它是否真的保护了人。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是环境保护技术用工程方法减少污染、必须面对的问题：废物、保护水气土壤和公共健康。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。一杯清水看起来普通，背后却有剂量、管网、病菌和公众信任共同维持的脆弱平衡。",
    supportZh: "Abel Wolman 与 Linn Enslow 于 1919 年提出供水氯化剂量控制方法，对城市饮用水消毒和公共卫生工程影响深远。Wolman 后来成为环境工程和公共卫生工程重要人物。",
    knowledgePointZh: "环境保护技术用工程方法减少污染、处理废物、保护水气土壤和公共健康。",
    reflectionQuestionZh: "一个环保技术如果每天都成功，你是不是反而最容易忘记它存在？",
    tagsZh: ["环境保护", "水处理", "公共卫生工程"],
  },
  "0713": {
    titleZh: "交流电的长路",
    summaryZh: "一个总在脑中旋转机器的人，让电力从局部照明走向远距离能源系统。",
    sceneZh: "19 世纪末，一个移民工程师在美国工厂和实验室之间工作，脑子里不断想着旋转磁场。",
    storyBodyZh: "直流系统可以点亮城市的一部分，但远距离输电困难。这个年轻人想象电流可以周期性改变方向，利用变压器升压降压，让电能走得更远。他的交流电机和多相系统并不是只解决一个机器问题，而是改变了发电、输电、工业动力和家庭用电的基础结构。电力与能源从这里显出系统性：能源不是插座里的瞬间便利，而是一张由发电机、线路、标准、商业竞争和公共安全组成的网络。这个人叫 Nikola Tesla，他的交流电机和多相交流系统专利对现代交流电力系统发展产生关键影响。今天能源系统的争论仍类似：发电方式、输送距离、标准、成本和安全，都会决定一种技术能不能进入普通生活。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是电力与能源最核心的问题之一：发电、输配、效率、储能、安全和能源系统如何支撑生活与产业。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。",
    supportZh: "Nikola Tesla 1880 年代获得交流电机和多相交流系统相关专利，后来与 Westinghouse 交流电系统推广相关。交流输电成为现代电力系统的重要基础。",
    knowledgePointZh: "电力与能源关注发电、输配、效率、储能、安全和能源系统如何支撑生活与产业。",
    reflectionQuestionZh: "你按下开关时，背后是哪一整套能源系统在替你工作？",
    tagsZh: ["电力", "交流电", "能源系统"],
  },
  "0714": {
    titleZh: "蒸汽机自己调节速度",
    summaryZh: "一个旋转的调速器让自动化第一次显得像机器在听自己的状态。",
    sceneZh: "18 世纪的工坊里，蒸汽机一会儿太快一会儿太慢，工人必须不断照看速度。",
    storyBodyZh: "他改进蒸汽机时面对的不只是功率问题，还有稳定性。机器如果负载变化就失控，工厂就无法可靠运转。离心调速器通过旋转球感知速度变化，速度快时收小蒸汽，速度慢时放开，让机器根据自身状态自动修正。这个装置看似机械，却包含自动化的核心思想：传感、反馈、调节和控制。电子与自动化后来进入电路、传感器和软件，但这个早期机械反馈已经说明，机器可以不只是执行命令，也可以持续比较目标和现实。这个人叫 James Watt，他改进蒸汽机并使用离心调速器，使反馈控制成为自动化和控制工程史上的经典例子。今天从恒温器到自动驾驶都还在处理同一个核心：系统必须看见自己的偏差，才可能在危险前修正动作。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是电子与自动化真正要追问的问题：电路、控制、传感、机器和自动系统如何感知并行动。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "James Watt 对蒸汽机作出关键改进，并在蒸汽机中使用离心调速器控制速度。离心调速器常被作为反馈控制和自动化史上的重要早期装置。",
    knowledgePointZh: "电子与自动化研究电路、控制、传感、机器和自动系统如何感知并行动。",
    reflectionQuestionZh: "当机器能根据自己的误差调整行为，它和普通工具之间的界线在哪里？",
    tagsZh: ["自动化", "反馈", "控制"],
  },
  "0715": {
    titleZh: "螺丝终于可以彼此替换",
    summaryZh: "一台车床让机械与金属加工从手工配合走向标准化和可重复制造。",
    sceneZh: "18 世纪末的伦敦工坊里，一个年轻机械师反复改进车床，想让螺纹不再只靠师傅手感。",
    storyBodyZh: "在精密制造之前，零件常常要手工修配，坏了也难以替换。螺丝看起来小，却决定机器能不能被拆装、维修和复制。他改进螺纹车床，让螺纹加工更准确、更一致，也推动机床成为制造其他机器的“母机器”。机械与金属行业在这里显出基础性：现代工业不只是发明一台机器，而是让零件、标准、工具和工人的技能形成可重复的制造体系。这个人叫 Henry Maudslay，他发展精密螺纹车床和机床技术，被视为英国机床工业和精密机械制造的重要奠基人物之一。今天制造业里的标准件也在提醒人：效率不只来自机器更快，还来自许多部件能被可靠地替换、检查和协作。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是机械与金属行业最核心的问题之一：结构、部件、加工、维修、精度和力的传递。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。标准化听起来冷，但它让陌生零件可以彼此配合，也让维修、制造和安全不再完全依赖个人手感。",
    supportZh: "Henry Maudslay 是英国机械师和发明者，改进螺纹车床和精密机床，对标准螺纹、可互换零件和机床工业发展具有重要影响。",
    knowledgePointZh: "机械与金属行业关注结构、部件、加工、维修、精度和力的传递。",
    reflectionQuestionZh: "一个小螺丝如果不能被可靠复制，整台机器会失去什么？",
    tagsZh: ["机械", "金属加工", "机床"],
  },
  "0716": {
    titleZh: "沙丘上的十二秒",
    summaryZh: "一次短暂飞行让交通工具设计同时面对升力、控制、发动机和人的判断。",
    sceneZh: "1903 年北卡罗来纳的沙丘上，两位自行车店出身的兄弟把木架、布翼和发动机推向海风。",
    storyBodyZh: "他们并不是只把发动机装到翅膀上。此前他们做风洞实验，测试翼型，研究滑翔，尤其盯住一个关键问题：飞起来之后怎样控制？许多失败让他们明白，航空器不是单一部件的胜利，而是升力、推力、结构重量、操纵面和飞行员身体判断的协调。机动车、船舶与航空器领域正是这样：移动系统必须把速度、稳定、安全、材料和环境放在一起。那十二秒并不长，却证明有动力、可控、持续的重于空气飞行成为可能。这个人叫 Orville Wright 和 Wilbur Wright，他们完成 1903 年 Kitty Hawk 飞行，成为航空器发展史上的关键人物。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是机动车、船舶与航空器最核心的问题之一：交通工具设计、维护、运行、安全和环境约束。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Wright brothers 1903 年 12 月 17 日在 Kitty Hawk 附近完成有动力、可控、持续的重于空气飞行。他们此前通过滑翔机、风洞和控制系统研究逐步改进设计。",
    knowledgePointZh: "机动车、船舶与航空器关注交通工具设计、维护、运行、安全和环境约束。",
    reflectionQuestionZh: "移动得更快之前，一个交通工具必须先学会怎样不失控？",
    tagsZh: ["航空", "交通工具", "控制"],
  },
  "0719": {
    titleZh: "战斗机咳嗽了一下",
    summaryZh: "一个小金属垫圈说明，未另分类的工程实践常在现场故障和快速修复之间出现。",
    sceneZh: "第二次世界大战期间，一位女工程师听飞行员抱怨：战斗机俯冲后发动机会短暂失力。",
    storyBodyZh: "问题并不适合被慢慢放进整齐研发流程。飞行员在空中需要立即可靠的动力，发动机在负 G 机动中供油异常，完整改造又来不及。她研究化油器问题，设计一个简单节流装置，让燃油流量在关键时刻不至于失控。这个小零件不是华丽发明，却让飞机在等待更彻底方案前获得实用改善。未另分类的工程行业常常这样：现场约束、临时修复、安全验证和制造可行性一起逼迫工程师作出足够可靠的判断。这个人叫 Beatrice Shilling，她设计的 R.A.E. restrictor 帮助缓解 Merlin 发动机负 G 供油问题，成为航空工程现场解决方案的经典故事。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未另分类的工程行业必须面对的问题：不适合标准工程分支、但需要安全、制造和现场判断的技术实践。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。她听见的不是抱怨，而是机器在极端动作里暴露出的限制；真正的修复从愿意相信现场声音开始。",
    supportZh: "Beatrice Shilling 是英国工程师。二战期间她设计的 R.A.E. restrictor，俗称 Miss Shilling's orifice，用于缓解早期 Merlin 发动机在负 G 机动中燃油供应问题。",
    knowledgePointZh: "未另分类的工程行业处理不适合标准工程分支、但需要安全、制造和现场判断的技术实践。",
    reflectionQuestionZh: "临时修复什么时候是冒险，什么时候是经过约束检验后的工程智慧？",
    tagsZh: ["工程", "航空", "现场修复"],
  },
  "0720": {
    titleZh: "汽车底盘自己走过来",
    summaryZh: "一条移动装配线让制造从手工作坊转向节拍、标准化和大规模生产。",
    sceneZh: "1913 年的底特律工厂里，汽车底盘不再静静等工人围上来，而是沿着线缓慢移动。",
    storyBodyZh: "他想解决的不是单台汽车能不能造出来，而是怎样让更多人买得起、怎样让每一步工作稳定重复。装配线把任务拆小，把零件标准化，把节拍固定，也把工人的动作纳入严格流程。这个方法提高产量、降低成本，同时也带来劳动单调、控制和工人压力等问题。制造与加工在这里变得现代：产品不是只由技术发明决定，还由流程、时间、供应链、工人技能和管理制度共同决定。这个人叫 Henry Ford，他在 Highland Park 工厂推广移动装配线，使汽车大规模生产成为 20 世纪制造业的重要范式。今天看一条生产线，也不能只看产量；还要看节拍怎样改变劳动、质量、价格，以及人和机器之间的关系。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是制造与加工最核心的问题之一：原料、流程、标准化、质量、储存、运输和重复生产。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。",
    supportZh: "Henry Ford 的 Highland Park 工厂于 1913 年引入移动装配线，大幅缩短 Model T 生产时间，成为大规模生产和制造流程标准化史上的重要案例。",
    knowledgePointZh: "制造与加工关注原料、流程、标准化、质量、储存、运输和重复生产。",
    reflectionQuestionZh: "当一件商品变得便宜，是谁的时间、动作和自由被重新安排了？",
    tagsZh: ["制造", "装配线", "标准化"],
  },
  "0721": {
    titleZh: "瓶子里的汤为什么没有坏",
    summaryZh: "一场为军队供食的竞赛，让食品加工从厨房经验走向保存、密封和时间管理。",
    sceneZh: "19 世纪初的法国，一个糖果师把食物装进玻璃瓶，加热、密封，再观察它能保存多久。",
    storyBodyZh: "他并不知道后来微生物理论会怎样解释这一切。他面对的是更实际的问题：军队和远航需要食物不那么快腐坏。经过多年试验，他发现把食物放入瓶中、加热、密封，可以显著延长保存时间。食品加工在这里出现为一门关于时间和安全的技术：味道只是开始，真正困难的是微生物、温度、容器、密封、运输和可重复流程。这个人叫 Nicolas Appert，他发明早期罐藏保存方法，并于 1810 年出版相关实践，成为食品保存和加工史上的重要先驱。今天食品加工仍在这条线上工作：好吃只是开始，安全、时间、运输、标签和信任决定食物能不能离开厨房。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是食品加工要完成的转换：把原料变成安全、稳定、可运输、可储存和可销售的食品。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Nicolas Appert 通过加热密封容器保存食物，1810 年出版《L'Art de conserver...》，被称为罐藏食品保存法的重要发明者，早于 Pasteur 对微生物机制的解释。",
    knowledgePointZh: "食品加工把原料变成安全、稳定、可运输、可储存和可销售的食品。",
    reflectionQuestionZh: "一份好吃的食物，要怎样才能经得起时间、距离和看不见的生命？",
    tagsZh: ["食品加工", "保存", "罐藏"],
  },
  "0722": {
    titleZh: "橡胶不再怕热和冷",
    summaryZh: "一次偶然加热让材料从黏糊糊的麻烦变成现代工业可依赖的部件。",
    sceneZh: "19 世纪美国，一个负债累累的发明者反复摆弄天然橡胶，冬天变硬，夏天发黏的问题总解决不了。",
    storyBodyZh: "他不是在整洁实验室里顺利推进，而是在失败、贫困和执念里不断尝试。天然橡胶有弹性，却太受温度影响，难以成为可靠工业材料。后来橡胶与硫在加热条件下发生变化，材料变得更稳定、更耐用、更适合制造。材料领域的关键就在这里：玻璃、纸、塑料、木材或橡胶都不是只有外观，它们有结构、性能、加工条件和使用环境。一个材料被真正理解，意味着人知道它在压力、温度、时间和反复使用中会怎样。这个人叫 Charles Goodyear，他发现橡胶硫化工艺，使橡胶成为现代工业中更稳定可用的材料。今天材料选择也常这样改变生活：一个配方调整，可能让轮胎、电线、鞋底和医疗用品都获得新的可靠性。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是材料学习最核心的问题之一：玻璃、纸、塑料、木材等材料的性质、加工、性能和用途。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。",
    supportZh: "Charles Goodyear 19 世纪发现橡胶 vulcanization 硫化工艺，通过加热橡胶和硫改善天然橡胶的耐热、弹性和稳定性，对材料和工业制品影响深远。",
    knowledgePointZh: "材料学习关注玻璃、纸、塑料、木材等材料的性质、加工、性能和用途。",
    reflectionQuestionZh: "你选择材料时，是在选择它看起来怎样，还是选择它在压力下会怎样？",
    tagsZh: ["材料", "橡胶", "硫化"],
  },
  "0723": {
    titleZh: "织机读懂了打孔卡",
    summaryZh: "一台会按卡片织花的机器，让纺织品、自动化和后来计算思想意外相遇。",
    sceneZh: "19 世纪初的里昂，一个织工之子看见复杂花纹需要大量人力，也让纺织生产昂贵缓慢。",
    storyBodyZh: "他改进织机，让打孔卡片控制经线抬起的顺序。卡片上的孔不是花纹本身，却像一套可执行指令，告诉机器何时让哪根线通过。纺织品领域在这里不只是衣料和皮革，也包括纤维结构、图案、机器、劳动和可重复生产。这个发明带来效率，也引发工人对失业的恐惧；技术进步从来不只是机器更聪明，也会改变人的工作。这个人叫 Joseph Marie Jacquard，他推广 Jacquard loom，使复杂织物图案可通过打孔卡控制，也影响了自动化和早期计算思想。今天编程和自动化仍能听见这台织机的回声：当图案被写成指令，手工、机器和符号之间的边界就变了。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是纺织品、服装、鞋类与皮革最核心的问题之一：纤维、结构、舒适、安全、工艺和贴近身体的材料。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Joseph Marie Jacquard 1804-1805 年推广使用打孔卡控制的 Jacquard loom，使复杂花纹织造自动化。该机制后来常被提及为可编程机器和计算史的重要前身。",
    knowledgePointZh: "纺织品、服装、鞋类与皮革关注纤维、结构、舒适、安全、工艺和贴近身体的材料。",
    reflectionQuestionZh: "当图案变成机器可以读取的指令，工艺和计算之间的距离还剩多远？",
    tagsZh: ["纺织", "织机", "打孔卡"],
  },
  "0724": {
    titleZh: "矿井里的木梯和空气",
    summaryZh: "一本关于矿业的书让采矿从经验秘方，走向可记录的技术、风险和环境知识。",
    sceneZh: "16 世纪中欧矿区，一个医生兼学者下到矿井附近，观察矿工怎样通风、排水、支护和冶炼。",
    storyBodyZh: "他看到的不是地下宝藏的浪漫，而是危险劳动：塌方、毒气、积水、矿石分类、冶炼烟尘和工具磨损。于是他把采矿、地质、机械、冶金和劳动现场写成系统知识，配上图像，让经验可以被传递和讨论。采矿与开采的核心由此显现：资源从地下进入社会，必须经过发现、提取、安全、环境和供应链，每一步都有代价。这个人叫 Georgius Agricola，他的《De Re Metallica》系统记录 16 世纪矿业与冶金实践，成为采矿工程史上的经典著作。今天谈资源开采，仍不能只问能不能挖出来；还要问人在地下怎样呼吸，土地怎样恢复，风险由谁承担。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是采矿与开采最核心的问题之一：资源发现、提取、安全、环境影响和供应链。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。矿井里的每个决定都贴着身体：一根木梯、一股空气、一点水位变化，都可能决定人能不能安全回来。",
    supportZh: "Georgius Agricola 1556 年出版《De Re Metallica》，系统描述采矿、矿物、冶金、通风、排水、机械和矿工劳动，是矿业和冶金史的重要经典。",
    knowledgePointZh: "采矿与开采关注资源发现、提取、安全、环境影响和供应链。",
    reflectionQuestionZh: "一个产品看起来很干净时，它的地下故事被谁承担了？",
    tagsZh: ["采矿", "冶金", "资源"],
  },
  "0729": {
    titleZh: "工厂为什么要停下来",
    summaryZh: "一种看似反直觉的生产方式，让制造从盲目多做转向持续发现浪费。",
    sceneZh: "20 世纪日本汽车工厂里，一个工程师看到库存堆得很高，却并不代表流程健康。",
    storyBodyZh: "传统直觉会觉得机器不停才有效率，库存多才安全。他反过来观察：过量生产会掩盖问题，等待会吞掉时间，搬运和返工会消耗人。生产线如果出现异常，应该让问题显露出来，而不是继续把缺陷向后推。他推动 just-in-time、看板和持续改进等实践，让制造不只是加工物品，也是在设计学习系统。未另分类的制造与加工常常处理这种跨流程、管理、现场技能和质量的混合知识。这个人叫 Taiichi Ohno，他发展 Toyota Production System，长期影响精益生产和现代制造管理。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的制造与加工需要保留下来的边界问题：那些跨越生产流程、质量、现场管理和混合加工实践的问题。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。让工厂停下来并不是浪费时间，有时正是为了让被库存和速度遮住的问题终于露出来。",
    supportZh: "Taiichi Ohno 是 Toyota Production System 的关键发展者，推动 just-in-time、kanban、jidoka 和持续改进等思想，对 lean manufacturing 和制造管理影响深远。",
    knowledgePointZh: "未另分类的制造与加工收纳那些跨越生产流程、质量、现场管理和混合加工实践的问题。",
    reflectionQuestionZh: "一个工厂什么时候应该追求不停运转，什么时候应该停下来让问题出现？",
    tagsZh: ["制造", "精益生产", "流程"],
  },
  "0730": {
    titleZh: "建筑必须站得住、用得上、看得动人",
    summaryZh: "一本古老建筑书把结构、功能和美感放在一起，成为建筑与施工的长久问题。",
    sceneZh: "古罗马时期，一个建筑师和工程师回顾神庙、水道、机械和城市空间，试图把建造经验写给后来的人。",
    storyBodyZh: "他不把建筑只看成墙和屋顶，也不把美当成表面装饰。一个建筑物必须坚固，能服务人的使用，也要有比例和秩序带来的美感。材料、地基、方向、公共用途、机械和人体尺度，都被放进同一套思考。建筑与施工的基础问题在这里很早就被说清：建造不是堆东西，而是在安全、用途、技术、气候、身体和文化之间达成一种可持久的安排。这个人叫 Vitruvius，他的《De architectura》提出 firmitas、utilitas、venustas 等思想，深刻影响建筑理论和建筑教育。学生读建筑时真正要练习的，正是这种同时看见结构、使用者和城市生活的能力。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未进一步细分的建筑与施工最核心的问题之一：空间、结构、材料、使用、施工和长期维护。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Vitruvius 是古罗马建筑师和工程师，著有《De architectura》。其中关于坚固、实用、美观的思想长期影响建筑理论，并在文艺复兴后被广泛重新阅读。",
    knowledgePointZh: "未进一步细分的建筑与施工关注空间、结构、材料、使用、施工和长期维护。",
    reflectionQuestionZh: "一座建筑如果只好看，却不好用或不安全，它还算真正完成了吗？",
    tagsZh: ["建筑", "施工", "Vitruvius"],
  },
  "0731": {
    titleZh: "她站在街角看人行道",
    summaryZh: "一个普通街区观察者让城市规划重新看见人行道、邻里和日常安全。",
    sceneZh: "20 世纪中期的纽约，一个写作者推着婴儿车走在街上，注意到孩子、店主、邻居和陌生人怎样共享人行道。",
    storyBodyZh: "当时许多规划者迷恋大尺度清除、分区和高速道路，觉得旧街区混乱低效。她却从日常生活里看到另一套秩序：小店的眼睛、短街区的穿行、混合用途带来的活力、不同时间出现的人群，以及邻里之间不必认识也能互相照看的关系。建筑与城镇规划在这里从鸟瞰图回到人的身体高度。城市不是只给汽车、模型和开发指标看的，它首先是人们不断相遇、停留、绕行、照看和争论的生活场。这个人叫 Jane Jacobs，她的《The Death and Life of Great American Cities》改变了现代城市规划对街道、社区和混合用途的理解。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是建筑与城镇规划最核心的问题之一：空间、动线、公共生活、安全、使用者和城市长期发展。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。街角不是抽象规划单位，而是孩子、老人、店主和路人每天互相确认安全感的地方。",
    supportZh: "Jane Jacobs 1961 年出版《The Death and Life of Great American Cities》，批判自上而下的城市更新，强调人行道生活、混合用途、短街区和社区自组织，对城市规划影响深远。",
    knowledgePointZh: "建筑与城镇规划关注空间、动线、公共生活、安全、使用者和城市长期发展。",
    reflectionQuestionZh: "你熟悉的一条街，是被规划图救活的，还是被每天使用它的人救活的？",
    tagsZh: ["城市规划", "街道", "公共生活"],
  },
  "0732": {
    titleZh: "桥上的钢缆和病床旁的笔记",
    summaryZh: "一座大桥的建成说明，土木工程不仅是结构计算，也是长期组织和现场责任。",
    sceneZh: "19 世纪纽约，一座跨越 East River 的大桥开工后，主工程师病倒，工地却不能停。",
    storyBodyZh: "她原本不是官方意义上的工程师，却在丈夫因减压病无法到现场后，承担起传递计算、材料、索缆、沉箱和施工指令的工作。她学习技术细节，和工人、政界、工程团队沟通，也在质疑声中维护项目连续性。建筑与土木工程在这里不是单个天才的图纸，而是结构力学、材料、施工风险、公共资金、疾病和沟通共同组成的长期承诺。桥真正跨越的不只是河流，还有设计和现实之间的漫长距离。这个人叫 Emily Warren Roebling，她在 Brooklyn Bridge 建设后期发挥关键工程协调作用，成为土木工程史上重要女性人物。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是建筑与土木工程要完成的转换：把结构、道路、桥梁、水、电和公共安全落到实体系统。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Brooklyn Bridge 由 John A. Roebling 设计，Washington Roebling 主持施工；Washington 因减压病受限后，Emily Warren Roebling 在沟通、技术学习和项目协调中发挥关键作用，1883 年大桥开放。",
    knowledgePointZh: "建筑与土木工程把结构、道路、桥梁、水、电和公共安全落到实体系统。",
    reflectionQuestionZh: "一座桥建成时，除了钢和石头，还有谁的学习、照护和坚持被埋进结构里？",
    tagsZh: ["土木工程", "桥梁", "施工"],
  },
  "0788": {
    titleZh: "一个圆顶能不能少用材料",
    summaryZh: "一个几何圆顶把工程、制造、建筑和资源问题连接成同一个实验。",
    sceneZh: "20 世纪美国，一个总爱画结构线和地图的人，反复问怎样用更少材料覆盖更大空间。",
    storyBodyZh: "他不是只想做奇特造型，而是着迷于效率：张力怎样分布，三角形为什么稳定，球面结构如何把重量分散，临时住房和大型空间能不能更轻、更快、更省。geodesic dome 把数学几何、结构工程、制造节点、建筑空间和资源伦理放在一起。它也不是万能答案，实际使用会遇到防水、维护、舒适和成本问题；但跨学科工程的价值正是在这里显现：一个形状同时要求几何、材料、建造、居住和社会理想共同受检验。这个人叫 Buckminster Fuller，他推广 geodesic dome，并以系统设计和“doing more with less”的思想影响工程、建筑和设计教育。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是工程、制造与建筑跨学科课程把结构、材料、生产、空间、资源和使使用的方法：用者需求放在同一问题里。所以它不只是把东西做出来，而是在训练人让设计经得起真实压力。圆顶的问题看似像几何游戏，真正牵动的却是住房、材料浪费和人类怎样更轻地占用世界。",
    supportZh: "Buckminster Fuller 推广 geodesic dome，并在结构、设计、资源效率和系统思维方面产生广泛影响。geodesic dome 使用三角网格分布受力，以较少材料覆盖较大空间。",
    knowledgePointZh: "工程、制造与建筑跨学科课程把结构、材料、生产、空间、资源和使用者需求放在同一问题里。",
    reflectionQuestionZh: "一个结构如果更轻、更省，是否也必须更认真回答它怎样被人使用？",
    tagsZh: ["跨学科工程", "圆顶", "系统设计"],
  },
  "0799": {
    titleZh: "臭味背后的城市系统",
    summaryZh: "一次城市污水工程说明，未另分类的工程常在公共健康、土木、政治和日常生活之间展开。",
    sceneZh: "1858 年伦敦夏天，泰晤士河臭气冲进议会，城市终于无法继续假装污水问题只是气味问题。",
    storyBodyZh: "他面对的是一个被城市增长放大的系统性麻烦：厕所、河流、潮汐、疾病、街道、预算、政治拖延和公众恐惧全缠在一起。解决方案不是清理一条水沟，而是设计截流下水道、泵站和排放系统，把污水从城市生活核心转移出去。今天我们会继续追问污染被转移到哪里、谁承担环境代价，但这个工程确实让现代城市意识到，基础设施决定公共健康。未另分类的工程、制造与建筑常常就发生在这种边界：它既是土木工程，也是卫生、行政、政治和城市生活的重新组织。这个人叫 Joseph Bazalgette，他设计伦敦现代下水道系统，成为城市基础设施和公共卫生工程史上的重要人物。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的工程、制造与建筑必须面对的问题：跨越基础设施、公共健康、材料、施工和治理的复杂项目。这让今天的工厂、工地和机器重新变得具体：想法只有经过材料、流程、安全和长期使用，才算真正站得住。",
    supportZh: "Joseph Bazalgette 19 世纪为 London 设计大型下水道系统，Great Stink of 1858 后工程获得推动。该系统改善城市污水处理，对公共卫生和现代城市基础设施影响深远。",
    knowledgePointZh: "未另分类的工程、制造与建筑处理跨越基础设施、公共健康、材料、施工和治理的复杂项目。",
    reflectionQuestionZh: "一个城市最重要的工程，为什么常常是在你闻不到、看不见时才算成功？",
    tagsZh: ["基础设施", "下水道", "公共健康"],
  },
  "0800": {
    titleZh: "麦田里的矮秆",
    summaryZh: "一片小麦试验田让农业、生态、育种和公共饥饿问题连成同一个世界。",
    sceneZh: "20 世纪中期的墨西哥试验田里，一个植物病理学家弯腰查看小麦，关心的是茎秆为什么会倒伏。",
    storyBodyZh: "他面对的不是一株植物的漂亮问题，而是饥饿、病害、产量、土壤、灌溉、肥料和国家粮食政策。高产小麦如果太高，施肥后容易倒伏；如果抗病性不足，一场病害就能毁掉收成。他和团队反复杂交、筛选、试种，把矮秆、高产和抗病性结合起来。农业、林业、渔业与兽医的宽镜头在这里很清楚：人类照料生命并不是只追产量，还要面对生态代价、社会分配和长期可持续。这个人叫 Norman Borlaug，他推动半矮秆高产小麦育种和绿色革命，因对粮食增产的贡献获得 1970 年诺贝尔和平奖。今天再谈粮食安全时，这个问题还在：增产不能只算亩产，也要把土壤、水、农民处境和生态风险一起放进账本。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未进一步细分的农业、林业、渔业与兽医最核心的问题之一：人如何在生态、生产、健康和资源限制中照料生命。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    supportZh: "Norman Borlaug 在墨西哥推动抗病、高产半矮秆小麦育种，相关品种在绿色革命中发挥重要作用。他于 1970 年获诺贝尔和平奖；绿色革命也持续面临关于生态和社会影响的讨论。",
    knowledgePointZh: "未进一步细分的农业、林业、渔业与兽医关注人如何在生态、生产、健康和资源限制中照料生命。",
    reflectionQuestionZh: "当一种作物救了很多人，它的生态和社会代价也应该怎样被认真看见？",
    tagsZh: ["农业", "育种", "粮食"],
  },
  "0810": {
    titleZh: "种子不再随手撒出去",
    summaryZh: "一台播种机让农业从凭经验撒播，转向行距、深度和效率的系统管理。",
    sceneZh: "18 世纪英国农田里，一个农场主看见种子被随手撒开，很多被鸟吃掉，很多落在不合适的深度。",
    storyBodyZh: "他并不是只想做一台新机器，而是对土地上的浪费感到不安。种子如果能按固定深度、固定间距进入土壤，就更容易发芽，也便于后续除草和管理。他改进 seed drill，让播种变得更有秩序。今天看来，机械化也带来单一化和土地管理的新的问法，但这个故事说明农业的基础问题从来不是“把种子扔进地里”这么简单。它涉及工具、土壤、时间、劳动力和对生命条件的精确安排。这个人叫 Jethro Tull，他推广播种机和条播思想，成为英国农业改良史上的重要人物。今天的农业技术也常在同一个问题里打转：怎样提高效率，同时不把土地、种子多样性和人的判断都交给单一工具。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未进一步细分的农业最核心的问题之一：土地、作物、工具、劳动、产量和长期照料条件。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。",
    supportZh: "Jethro Tull 是 18 世纪英国农业改良者，推广 seed drill 播种机和条播等方法，1731 年出版《Horse-Hoeing Husbandry》，影响农业机械化和播种管理。",
    knowledgePointZh: "未进一步细分的农业关注土地、作物、工具、劳动、产量和长期照料条件。",
    reflectionQuestionZh: "一个种子能否发芽，取决于运气，还是取决于人怎样安排它进入土地？",
    tagsZh: ["农业", "播种机", "农艺"],
  },
  "0811": {
    titleZh: "花生不是穷作物",
    summaryZh: "一个从艰难童年走出的植物学家，让作物生产和土地恢复成为同一个问题。",
    sceneZh: "20 世纪初的美国南方，一个农业教师走进被棉花耗累的土地，手里拿着花生、甘薯和土样。",
    storyBodyZh: "他知道农民不是不努力，而是被单一作物、贫困和土壤退化困住。棉花长期消耗土地，也让农户收入脆弱。他研究豆科作物、轮作、土壤改良和可替代用途，向农民推广花生、甘薯等作物的种植和加工方法。作物与畜牧生产在这里不只是产量竞赛，而是土地、营养、市场、家庭收入和生态恢复的关系。这个人叫 George Washington Carver，他在 Tuskegee Institute 推动作物轮作、土壤改良和花生等作物用途研究，成为美国农业教育史上的重要人物。今天作物与畜牧生产也需要这种眼光：一种作物不是单独存在，它和土壤、市场、营养、病虫害和农民收入一起变化。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是作物与畜牧生产最核心的问题之一：种植、饲养、产量、健康、土壤和食物系统。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。",
    supportZh: "George Washington Carver 在 Tuskegee Institute 工作，推广作物轮作、花生和甘薯等替代作物，帮助南方农民改善土壤和收入结构。他的推广教育对农业实践影响广泛。",
    knowledgePointZh: "作物与畜牧生产关注种植、饲养、产量、健康、土壤和食物系统。",
    reflectionQuestionZh: "一种被看低的作物，什么时候可能成为土地和家庭重新恢复的入口？",
    tagsZh: ["作物", "土壤", "农业教育"],
  },
  "0812": {
    titleZh: "一棵李树开出太多可能",
    summaryZh: "一个植物育种者让园艺从照看花园，走向选择、杂交和长期耐心。",
    sceneZh: "19 世纪末的加州，一个年轻人从东部来到气候温和的土地上，开始试验果树、花卉和种子。",
    storyBodyZh: "他没有把园艺只当作把植物养漂亮。每一株植物都有差异，哪一株更甜，哪一株更耐寒，哪一株花色更特别，哪一株适合当地市场，都需要被观察、选择和繁殖。他培育李子、马铃薯、仙人掌和许多观赏植物，也留下关于育种商业化和科学严谨性的争议。园艺在这里显出双重性：它既是审美和照料，也是遗传、环境、市场和时间共同塑造植物的实践。这个人叫 Luther Burbank，他以大量植物育种和园艺新品种闻名，影响了美国园艺和植物改良文化。今天园艺仍保留这种耐心：修剪、嫁接和选育不是控制生命，而是在许多季节里和植物条件慢慢协商。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是园艺最核心的问题之一：观赏植物、果蔬、土壤、修剪、繁殖、光照和空间照料。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    supportZh: "Luther Burbank 是美国园艺家和植物育种者，培育 Burbank potato、Shasta daisy、plum 等众多植物品种。他的工作影响园艺和植物改良，也伴随科学记录严谨性等争议。",
    knowledgePointZh: "园艺关注观赏植物、果蔬、土壤、修剪、繁殖、光照和空间照料。",
    reflectionQuestionZh: "当你照料一株植物时，你是在让它服从，还是在和它的可能性合作？",
    tagsZh: ["园艺", "育种", "植物"],
  },
  "0819": {
    titleZh: "一根稻草也可以是一种哲学",
    summaryZh: "一个农民的长期试验让农业边界出现自然农法、生态和生活方式的混合问题。",
    sceneZh: "20 世纪日本乡间，一个受过植物病理学训练的人回到家乡田地，开始怀疑现代农业是否越做越复杂。",
    storyBodyZh: "他并不是因为不懂科学才反对过度干预，恰恰相反，他见过病理学和农业技术如何解释植物，也看到农民越来越依赖耕作、化肥、农药和劳力。他在稻田里试验不耕作、覆盖稻草、混播、减少外部投入，让田地成为一个更自我调节的生态系统。这个方法并不适合被简单神化，也需要根据地区和产量现实审慎判断；但它说明未另分类的农业经常处在科学、哲学、生态和生活实践之间。这个人叫 Masanobu Fukuoka，他提出 natural farming，并通过《The One-Straw Revolution》影响了生态农业和永续农业思潮。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未另分类的农业需要保留下来的边界问题：那些跨越种植、生态、社区、哲学和土地实践的农业形式。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。他退回田里，不是为了拒绝知识，而是为了问知识是否还能听见土地自己的节奏。",
    supportZh: "Masanobu Fukuoka 是日本农民和思想者，提出 natural farming，强调不耕作、覆盖、少投入和顺应生态过程。其《The One-Straw Revolution》对生态农业和 permaculture 思潮有影响。",
    knowledgePointZh: "未另分类的农业收纳那些跨越种植、生态、社区、哲学和土地实践的农业形式。",
    reflectionQuestionZh: "少做一件事，什么时候不是偷懒，而是对生态过程的信任？",
    tagsZh: ["自然农法", "生态农业", "土地"],
  },
  "0821": {
    titleZh: "森林不能只按木材计算",
    summaryZh: "一个林务改革者让森林管理从砍伐收益，转向长期公共资源和专业治理。",
    sceneZh: "19 世纪末的美国，一个年轻人到欧洲学习林学后回国，看到大片森林被短期砍伐逻辑支配。",
    storyBodyZh: "他并不是反对使用森林，而是反对只把森林当作一次性矿藏。木材、水源、土壤、火灾、野生动物和地方经济都需要长期管理。他推动专业林务、国家森林和持续产出思想，主张为了公共利益管理自然资源。今天我们也会批判早期保护主义里对原住民和地方社区的忽视，但林业作为学科的一个核心问题由此凸显：森林的时间尺度比商业周期长得多。这个人叫 Gifford Pinchot，他是美国林务改革重要人物，首任 U.S. Forest Service 局长，并推动 conservation 林业理念。今天谈资源管理时，这个提醒仍然尖锐：如果只看眼前收益，森林很容易在账本里变短，在现实里变空。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是林业最核心的问题之一：森林资源、木材、生态、水土保持、火险、生物多样性和长期管理。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    supportZh: "Gifford Pinchot 是美国林业家和政治人物，曾任 U.S. Forest Service 首任局长，主张以科学管理和公共利益原则管理森林资源，是美国 conservation 运动重要人物。",
    knowledgePointZh: "林业关注森林资源、木材、生态、水土保持、火险、生物多样性和长期管理。",
    reflectionQuestionZh: "如果一片森林的生命超过几代人，谁有资格替它做短期决定？",
    tagsZh: ["林业", "森林管理", "保护"],
  },
  "0831": {
    titleZh: "每一代人都以为海一直这么空",
    summaryZh: "一个渔业科学家的警告让人看见，海洋资源的衰退常被记忆本身遮住。",
    sceneZh: "20 世纪后期，一个研究鱼类的人听到年轻渔民说收获还算正常，却在旧记录里看到完全不同的海。",
    storyBodyZh: "他意识到一个危险：每一代人都把自己年轻时见到的鱼群数量当成“正常”。如果基准不断下降，大家就会在越来越贫瘠的海里继续觉得情况还可以。他提出 shifting baseline 的概念，提醒渔业不能只看今年和去年，还要看更长的生态记忆。渔业研究在这里不只是捕多少鱼，也要理解种群、食物网、捕捞压力、政策和人类记忆如何共同影响海洋。这个人叫 Daniel Pauly，他提出 shifting baseline syndrome，并通过全球渔业数据研究影响了现代渔业科学和海洋保护。这也是许多环境问题难被察觉的原因：失去不是一次发生的，而是在一代代“正常”的习惯里慢慢被接受。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是渔业最核心的问题之一：水域生态、鱼类种群、捕捞、养殖、冷链、政策和食物供应。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。",
    supportZh: "Daniel Pauly 是渔业科学家，1995 年提出 shifting baseline syndrome 概念，指出每代研究者或渔民可能以自己早年经验作为资源正常状态，导致长期衰退被低估。",
    knowledgePointZh: "渔业关注水域生态、鱼类种群、捕捞、养殖、冷链、政策和食物供应。",
    reflectionQuestionZh: "你以为正常的自然状态，会不会其实已经是上一代衰退后的结果？",
    tagsZh: ["渔业", "海洋", "基线"],
  },
  "0841": {
    titleZh: "第一所兽医学校的病马",
    summaryZh: "一次牲畜疫病危机让兽医从民间经验走向系统教育和公共经济安全。",
    sceneZh: "18 世纪法国，牛马疫病不断造成损失，一个关心马术和动物疾病的人看见农业和军队都被牵动。",
    storyBodyZh: "动物生病不是只影响一个主人。马牵动交通和军队，牛牵动耕作、食物和家庭收入。传统马医经验有价值，却缺少系统解剖、病理、教学和公共防疫。他推动建立专门学校，让动物医学成为可训练、可研究、可传承的专业。兽医领域在这里清楚出现：它既照料动物个体，也保护畜群、食品、农业经济和人与动物共同生活的安全。这个人叫 Claude Bourgelat，他在 Lyon 创办世界最早的兽医学校之一，被视为现代兽医学教育的重要奠基人。今天的兽医工作也仍在这个交叉点上：一只动物的健康，常常连着食物安全、公共卫生和人与动物相处的伦理。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是兽医真正要追问的问题：动物疾病、诊断、治疗、公共卫生、畜群健康和人与动物关系。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    supportZh: "Claude Bourgelat 于 1761 年在 Lyon 创办兽医学校，常被视为世界最早的现代兽医学校之一。其工作推动兽医学从经验性动物医治走向专业教育和公共畜牧健康。",
    knowledgePointZh: "兽医研究动物疾病、诊断、治疗、公共卫生、畜群健康和人与动物关系。",
    reflectionQuestionZh: "当一头动物生病时，影响的只是它自己，还是整个食物和生活系统？",
    tagsZh: ["兽医", "动物健康", "兽医教育"],
  },
  "0888": {
    titleZh: "她看见牛害怕的影子",
    summaryZh: "一个自闭症女性设计者把动物行为、工程、畜牧和福利放进同一套现场观察。",
    sceneZh: "20 世纪后期的牧场和屠宰场里，一个年轻女性站在牲畜通道旁，注意到牛会被反光、阴影和突然的转角吓住。",
    storyBodyZh: "她的感知方式和许多人不同，也让她更容易注意到动物在空间里的恐惧。她没有只责怪动物不听话，而是蹲到它们的视线高度，看光线、声音、地面、防滑、转弯和人的动作。她设计弧形通道和更低压力的处理系统，把动物行为学、工程设计、畜牧生产和伦理关怀放在一起。这个跨学科领域不只问怎样提高效率，也问人在利用动物时怎样减少恐惧和痛苦。这个人叫 Temple Grandin，她以畜牧设施设计和动物福利倡导闻名，推动农业、工程、兽医和动物行为之间的跨学科实践。学生从这里能学到，真正的专业不是把生命系统压服，而是愿意从另一个身体的位置重新检查设计。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是农业、林业、渔业与兽医跨学科课程要练习的连接能力：生产、生态、工程、动物健康、福利和资源管理。所以它不只是生产技术，而是在训练人读懂时机、条件和长期后果。这条通道也把伦理带进工程：如果设计能减少恐惧，效率就不该建立在忽略恐惧之上。",
    supportZh: "Temple Grandin 是动物科学家和畜牧设施设计者，关注牲畜行为、低压力处理系统和动物福利。她的弧形通道等设计广泛影响畜牧处理设施。",
    knowledgePointZh: "农业、林业、渔业与兽医跨学科课程连接生产、生态、工程、动物健康、福利和资源管理。",
    reflectionQuestionZh: "如果从动物的视角重新看一条通道，人类的效率会不会也必须重新定义？",
    tagsZh: ["跨学科", "动物福利", "畜牧工程"],
  },
  "0899": {
    titleZh: "冰山里的种子库",
    summaryZh: "一个全球种子库说明，农业相关知识有时既是遗传保护，也是未来风险管理。",
    sceneZh: "21 世纪初的挪威斯瓦尔巴群岛，一群人把来自世界各地的种子样本送进冻土山体里的库房。",
    storyBodyZh: "这个项目看起来像仓库，却不只是储藏。每一份种子都代表一种作物遗传资源，也代表某个地区的农业记忆和未来适应可能。战争、灾害、气候变化、病害和市场单一化，都可能让种子多样性消失。未另分类的农业、林业、渔业与兽医领域正需要这种边界意识：它不完全是种植，也不只是科研或外交，而是食物系统为未来保留选择。这个人叫 Cary Fowler，他长期推动作物多样性保护，并作为 Svalbard Global Seed Vault 的关键倡导者之一影响了全球种质资源保存。今天气候和供应链都变得不稳定时，这样的保存不只是科学工程，也是一种面向未来的责任安排。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未另分类的农业、林业、渔业与兽医需要保留下来的边界问题：跨越种质资源、食物安全、生态风险和长期保护的实践。这让今天的花园、农场、森林、海洋和动物照护重新变得具体：生命系统不会完全照着人的计划走。",
    supportZh: "Svalbard Global Seed Vault 于 2008 年启用，用于备份全球作物种子样本。Cary Fowler 是作物多样性保护的重要倡导者，也是该种子库建立过程中的关键人物之一。",
    knowledgePointZh: "未另分类的农业、林业、渔业与兽医收纳跨越种质资源、食物安全、生态风险和长期保护的实践。",
    reflectionQuestionZh: "为未来保存一粒种子，究竟是在保存食物，还是保存选择权？",
    tagsZh: ["种子库", "食物安全", "遗传资源"],
  },
  "0900": {
    titleZh: "斑疹伤寒为什么也是社会问题",
    summaryZh: "一位医生在疫区看到，健康与福利不能只靠药，也要面对贫困、住房和政治。",
    sceneZh: "1848 年的上西里西亚，一位年轻医生被派去调查斑疹伤寒疫情，却很快发现病床之外的问题更大。",
    storyBodyZh: "他看到的不只是病原体和症状。饥饿、恶劣住房、缺乏教育、贫困、政治无力和公共卫生缺位，都在让疾病扩散。单纯开药无法解决这种病，因为病人回到同样的生活条件，风险还在那里。他把报告写成一种更尖锐的医学判断：医学是一门社会科学，政治不过是大规模的医学。健康与福利在这里被连接起来：人的身体状态常常是社会制度写在皮肤、肺和血液里的结果。这个人叫 Rudolf Virchow，他通过上西里西亚斑疹伤寒报告和社会医学思想，成为公共卫生、病理学和健康社会决定因素思想的重要人物。今天的公共卫生仍常遇到同样的难题：药物能处理一部分痛苦，但住房、教育、收入和信任也会决定疾病是否反复回来。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未进一步细分的健康与福利最核心的问题之一：身体、照护、风险、社会支持和人的生活条件如何彼此影响。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    supportZh: "Rudolf Virchow 1848 年调查 Upper Silesia 斑疹伤寒疫情，报告强调贫困、教育、民主参与和公共卫生条件。他也被称为现代病理学重要奠基人，并与社会医学思想密切相关。",
    knowledgePointZh: "未进一步细分的健康与福利关注身体、照护、风险、社会支持和人的生活条件如何彼此影响。",
    reflectionQuestionZh: "当一种疾病反复出现，你会只找药，还是也去看病人回到什么样的生活里？",
    tagsZh: ["健康", "福利", "社会医学"],
  },
  "0910": {
    titleZh: "病床旁边的观察",
    summaryZh: "古代医生把治疗从神秘解释拉向观察、记录和职业伦理。",
    sceneZh: "古希腊的岛屿和城邦之间，一位医生走近发热、疼痛和呼吸困难的病人，先看他们实际怎样变化。",
    storyBodyZh: "他所处的时代，疾病常被解释成神灵惩罚或神秘力量。可他和传统中的同伴把注意力放到更具体的地方：症状何时开始，脉象和呼吸如何，饮食、季节、地点和体质有什么关系，医生应怎样谨慎判断而不伤害病人。许多文本并非都出自同一人之手，也带有时代局限；但健康领域的一个重要转向已经出现：照护身体需要观察、经验、记录和伦理约束，而不是只靠巫术或权威。这个人叫 Hippocrates，他所代表的 Hippocratic tradition 成为西方医学观察、临床伦理和医生职业形象的重要源头。这也是医学学习最早要守住的东西：先把人当作会变化的身体来看见，再谨慎决定知识该怎样介入。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未进一步细分的健康最核心的问题之一：身体状态、疾病、预防、照护、风险和健康判断。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    supportZh: "Hippocrates 与 Hippocratic Corpus 代表古希腊医学传统，强调观察、自然原因、预后和医生伦理。Hippocratic Oath 也长期影响医学职业伦理，虽然文本来源复杂。",
    knowledgePointZh: "未进一步细分的健康关注身体状态、疾病、预防、照护、风险和健康判断。",
    reflectionQuestionZh: "当一个人说不舒服时，最负责任的第一步是解释，还是观察？",
    tagsZh: ["健康", "医学传统", "观察"],
  },
  "0911": {
    titleZh: "牙医不该只是拔牙的人",
    summaryZh: "一本牙科书让口腔治疗从手艺和止痛，走向结构、预防和专业训练。",
    sceneZh: "18 世纪巴黎，一个外科医生面对牙痛、假牙、蛀牙和口腔感染，发现街头拔牙远远不够。",
    storyBodyZh: "当时很多牙病由理发师、游医或拔牙匠处理，常常只在疼痛无法忍受时才动手。他把牙齿解剖、龋齿原因、牙周问题、矫治、假牙和器械整理成系统知识，强调保存牙齿、清洁和专业判断。牙科研究在这里变得清楚：口腔不是身体之外的小零件，牙齿结构、疼痛、营养、感染、说话和人的尊严都连在一起。这个人叫 Pierre Fauchard，他出版《Le Chirurgien Dentiste》，被广泛称为现代牙科学的重要奠基人之一。今天牙科仍在这个转弯处工作：治疗一颗牙，也要处理疼痛、恐惧、卫生习惯和一个人敢不敢再次走进诊室。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是牙科研究最核心的问题之一：口腔健康、牙齿结构、预防、治疗、修复和患者体验。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。牙痛把人带到椅子上，但真正的牙科还要处理恐惧、预防、工具和长期卫生习惯。",
    supportZh: "Pierre Fauchard 1728 年出版《Le Chirurgien Dentiste》，系统讨论牙齿解剖、龋齿、牙周、修复、矫治和器械，被称为现代牙科学之父。",
    knowledgePointZh: "牙科研究关注口腔健康、牙齿结构、预防、治疗、修复和患者体验。",
    reflectionQuestionZh: "如果牙齿影响吃饭、说话和自尊，为什么口腔健康不该被当成小事？",
    tagsZh: ["牙科", "口腔健康", "专业化"],
  },
  "0912": {
    titleZh: "产房里的洗手盆",
    summaryZh: "一个医生发现洗手能救命，却也见识到证据进入制度有多困难。",
    sceneZh: "19 世纪维也纳的产科病房里，一个年轻医生发现两个产房的产妇死亡率差得让人无法安心。",
    storyBodyZh: "他没有先把死亡归咎于命运，而是比较班次、人员、流程和尸检接触。他注意到医生和学生从解剖室进入产房，可能把看不见的致命物质带到产妇身边。要求用含氯石灰洗手后，死亡率显著下降。可是这个发现并没有立刻得到欢迎，因为它暗示医生自己的手可能造成伤害。医学在这里显出痛苦的一面：正确证据如果挑战职业自尊和制度习惯，仍然会被抵抗。这个人叫 Ignaz Semmelweis，他提出产科洗手消毒可降低产褥热死亡率，成为感染控制和医学证据史上的关键人物。今天医学安全文化常回到这只洗手盆前：一个简单动作背后，是证据、权威、习惯和承认错误的困难。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是医学真正要追问的问题：疾病、诊断、治疗、预防、人体系统和临床证据如何保护生命。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    supportZh: "Ignaz Semmelweis 1840 年代在 Vienna General Hospital 发现含氯石灰洗手可显著降低产褥热死亡率。其发现起初遭遇抵抗，后被视为感染控制史上的重要事件。",
    knowledgePointZh: "医学研究疾病、诊断、治疗、预防、人体系统和临床证据如何保护生命。",
    reflectionQuestionZh: "当证据说明问题可能出在自己手上，你还能不能接受它？",
    tagsZh: ["医学", "感染控制", "洗手"],
  },
  "0913": {
    titleZh: "夜里那盏灯",
    summaryZh: "一盏夜巡的灯背后，是护理把善意变成专业训练、卫生制度和持续观察的开始。",
    sceneZh: "1850 年代的军医院里，走廊潮湿、床位拥挤，伤兵身上的问题不只来自战场。",
    storyBodyZh: "刚到医院时，她看到的不是传说里的英雄场面，而是一连串很具体的麻烦：脏床单、通风差、排水糟糕、物资混乱，病人有时不是死于伤口，而是死于伤口之后的环境。她带人清洁、整理供应、改善卫生，也一遍遍记录死亡原因和病房情况。夜里，她提着灯巡视，不只是为了安慰伤兵，更是在看呼吸、疼痛、发热和恐惧有没有改变。真正重要的不是浪漫的光，而是她把照护变成一种有纪律的专业：观察、记录、卫生、训练和制度。这个人叫 Florence Nightingale，她建立现代护理训练的重要传统，并用统计和公共卫生改革改变了护理与助产的专业地位。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是护理与助产最核心的问题之一：持续观察、照护、卫生、安全、生命过程和人在脆弱时刻的尊严。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    supportZh: "Florence Nightingale 在 Crimean War 期间改善 Scutari 军医院卫生与照护；1860 年在 St Thomas' Hospital 建立 Nightingale Training School。她也用统计图表推动公共卫生改革，被视为现代护理奠基人。",
    knowledgePointZh: "护理与助产关注持续观察、照护、卫生、安全、生命过程和人在脆弱时刻的尊严。",
    reflectionQuestionZh: "真正的照护，是等医生下指令，还是在细节恶化之前先看见变化？",
    tagsZh: ["护理", "助产", "照护"],
  },
  "0914": {
    titleZh: "手骨第一次出现在照片里",
    summaryZh: "一次意外荧光让医学诊断进入影像时代，也带来技术安全的新责任。",
    sceneZh: "1895 年的德国实验室里，一个物理学家研究阴极射线管，忽然发现远处涂层在黑暗中发光。",
    storyBodyZh: "他没有把异常当成干扰丢掉，而是反复遮挡、测试、记录，发现一种未知射线能穿过纸板和软组织，却被骨头和金属阻挡。他拍下妻子的手，骨骼和戒指清晰显现。医学诊断与治疗技术由此被彻底改变：医生可以不用切开身体就看见内部结构。可是技术也带来新风险，早期 X 光使用曾因不了解辐射伤害而造成损害。这个领域因此一直同时包含设备、图像、质量控制和安全边界。这个人叫 Wilhelm Conrad Rontgen，他发现 X-rays，并于 1901 年获得首届诺贝尔物理学奖。今天每一次影像检查都还在问同样的问题：看见更多并不自动等于更安全，技术必须和防护、解释、质量一起前进。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是医学诊断与治疗技术最核心的问题之一：设备、检测、影像、治疗支持、质量控制和安全使用。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    supportZh: "Wilhelm Conrad Rontgen 1895 年发现 X-rays，并拍摄著名手部 X 光影像。X 光迅速进入医学诊断，同时也推动后来的辐射防护和医学影像技术发展。",
    knowledgePointZh: "医学诊断与治疗技术关注设备、检测、影像、治疗支持、质量控制和安全使用。",
    reflectionQuestionZh: "当技术让身体变得可见，它同时让哪些风险也必须被看见？",
    tagsZh: ["医学影像", "诊断技术", "X光"],
  },
  "0915": {
    titleZh: "病人不是出院就结束了",
    summaryZh: "一位医生把康复从附属护理，变成帮助人重新生活的现代医学领域。",
    sceneZh: "第二次世界大战后，许多伤兵和病人活了下来，却发现活下来不等于能重新走路、工作和生活。",
    storyBodyZh: "他看到医院常把治疗重点放在疾病消失或伤口愈合，却没有充分回答之后怎么办。一个人可能需要重新训练肌肉、学习使用辅助器具、处理疼痛、调整家庭和工作环境，也要重新获得尊严。他推动 rehabilitation medicine，把物理治疗、作业治疗、心理支持、社会安排和长期目标放在同一个计划里。治疗与康复因此不只是把人恢复到过去，而是在新的身体条件下重新组织生活能力。这个人叫 Howard A. Rusk，他推动现代康复医学发展，被称为康复医学的重要奠基人物之一。今天康复计划也从这里开始：病历上的好转只有走进楼梯、厨房、公交和工作岗位时，才真正接受生活的检验。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是治疗与康复最核心的问题之一：功能恢复、训练、适应、疼痛管理、辅助技术和长期支持。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    supportZh: "Howard A. Rusk 是美国医生，二战期间和战后推动 rehabilitation medicine，将物理治疗、职业治疗、心理和社会支持整合进康复体系，被视为现代康复医学重要人物。",
    knowledgePointZh: "治疗与康复关注功能恢复、训练、适应、疼痛管理、辅助技术和长期支持。",
    reflectionQuestionZh: "恢复是不是回到过去，还是学会带着新的身体条件继续生活？",
    tagsZh: ["康复", "治疗", "功能"],
  },
  "0916": {
    titleZh: "药房不只是卖药的柜台",
    summaryZh: "一个药剂师把药房工作推向教育、标准和专业责任。",
    sceneZh: "19 世纪费城，一个年轻药剂师在柜台后调配药物，也看见药品质量、剂量和训练并不总可靠。",
    storyBodyZh: "药物能救人，也能伤人。粉末、酊剂、植物提取物和处方如果没有标准，病人很难知道自己真正拿到什么。他不满足于药剂师只靠师徒经验和商业买卖，而是推动药学教育、专业组织、药典标准和伦理责任。药学在这里从“把药交出去”变成一门保护药物效果和安全的专业：成分、剂量、相互作用、储存、说明和患者理解都重要。这个人叫 William Procter Jr.，他推动美国药学教育和专业化，被称为美国药学的重要奠基人物之一。今天药师的角色仍在扩大：不是把盒子递出去就结束，而是帮助药物在真实生活里被正确、安全地使用。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是药学真正要追问的问题：药物作用、剂量、安全、相互作用、质量标准和用药指导。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。药学真正进入生活时，药盒只是开始；说明、剂量、相互作用和患者是否理解，都会改变治疗结果。",
    supportZh: "William Procter Jr. 是 19 世纪美国药剂师和教育者，参与 Philadelphia College of Pharmacy 和 American Pharmaceutical Association 等发展，被称为美国药学之父。",
    knowledgePointZh: "药学研究药物作用、剂量、安全、相互作用、质量标准和用药指导。",
    reflectionQuestionZh: "一粒药真正进入生活时，需要哪些知识保护它不被误用？",
    tagsZh: ["药学", "药房", "专业标准"],
  },
  "0917": {
    titleZh: "药草书里的长期修订",
    summaryZh: "一位明代医者花几十年整理本草，让传统医学成为经验、文本和安全边界的持续对话。",
    sceneZh: "16 世纪中国，一个医生走访山野、市场和旧书，发现许多药名、产地和用法彼此混乱。",
    storyBodyZh: "他没有把传统当成一成不变的权威。相反，他反复校对古书，记录产地，辨别同名异物，补充民间经验，也纠正前人错误。这个过程说明传统与补充医学最严肃的部分不是神秘化，而是长期积累、辨伪、剂量、适应症和风险边界。今天看传统疗法，更需要尊重历史经验，也需要现代证据和安全评估。这个人叫 Li Shizhen，他编写《本草纲目》，系统整理药物知识，成为中国本草学和传统医学史上的重要人物。今天面对传统疗法时，最负责任的态度也许正是这种耐心：既不轻易嘲笑经验，也不停止核对风险和证据。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是传统与补充医学最核心的问题之一：传统疗法、身体经验、安全边界、文本传承和现代证据对话。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。传统如果值得被尊重，就更值得被认真核对；辨名、辨物、辨剂量，本身就是保护人的一部分。",
    supportZh: "Li Shizhen 明代医药学家，历时多年编写《本草纲目》，1596 年刊行。该书整理大量药物、性味、产地、用法和辨误，对中国本草学影响深远。",
    knowledgePointZh: "传统与补充医学关注传统疗法、身体经验、安全边界、文本传承和现代证据对话。",
    reflectionQuestionZh: "尊重传统时，怎样同时保留追问证据和保护安全的勇气？",
    tagsZh: ["传统医学", "本草", "安全"],
  },
  "0919": {
    titleZh: "老鼠为什么生病了",
    summaryZh: "一次实验室里的异常反应，让健康研究看见压力也能成为身体问题。",
    sceneZh: "20 世纪 30 年代，一个年轻研究者给实验动物注射不同提取物，却发现它们出现相似身体反应。",
    storyBodyZh: "他一开始以为自己在研究某种特定物质的作用。可是无论注射什么，动物都出现胃溃疡、肾上腺变化、免疫组织萎缩等相似反应。他开始怀疑，身体可能是在对各种有害刺激作出一种一般性反应。这个想法后来发展为 stress 的生理研究，也经历过概念扩张和争议。未另分类的健康领域常常这样出现：问题不完全属于单一疾病，也不只是心理或社会，而是身体、环境、情绪和长期负荷交织。这个人叫 Hans Selye，他提出 general adaptation syndrome 并推动 stress 进入现代健康研究。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未另分类的健康需要保留下来的边界问题：那些不适合标准医疗门类、却影响身体和生活质量的健康现象。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。实验动物的反应让问题变得不舒服：身体里的缺乏有时不是单一器官的问题，而是一整套营养关系。",
    supportZh: "Hans Selye 20 世纪 30 年代起研究 stress 和 general adaptation syndrome，观察机体对不同有害刺激的非特异性反应，对压力生理学和健康研究产生广泛影响。",
    knowledgePointZh: "未另分类的健康收纳那些不适合标准医疗门类、却影响身体和生活质量的健康现象。",
    reflectionQuestionZh: "当你说自己只是累了，身体会不会其实已经在长期报警？",
    tagsZh: ["健康", "压力", "身体反应"],
  },
  "0920": {
    titleZh: "从摇篮到坟墓的报告",
    summaryZh: "一份战时报告让福利从零散救济，转向覆盖人生风险的社会制度设计。",
    sceneZh: "1942 年的英国，战争仍在继续，一个经济学家把贫困、疾病、失业和养老放进同一份报告。",
    storyBodyZh: "他面对的不是某个家庭的一次困难，而是社会中反复出现的风险：没有工作、生病、年老、孩子多、收入不足。过去的救济常常零散、羞辱性强，也难以覆盖人生不同阶段。他提出更系统的社会保险和福利国家设想，试图对抗所谓“五大巨人”：贫困、疾病、无知、肮脏和失业。福利在这里不是施舍，而是现代社会如何共同分担风险、保障最低安全和人的尊严。这个人叫 William Beveridge，他的 1942 年 Beveridge Report 深刻影响英国福利国家和现代社会保障制度。今天讨论福利时，争论仍不只关于钱，而是一个人跌倒、生病、老去或失业时，社会愿不愿意留下承接他的结构。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未进一步细分的福利最核心的问题之一：社会支持、风险分担、尊严、照护和基本生活保障。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    supportZh: "William Beveridge 1942 年发布 Beveridge Report，提出从 cradle to grave 的社会保险和福利改革设想，影响英国战后福利国家建设和 NHS 等制度背景。",
    knowledgePointZh: "未进一步细分的福利关注社会支持、风险分担、尊严、照护和基本生活保障。",
    reflectionQuestionZh: "一个社会怎样证明它不是只在成功时承认一个人？",
    tagsZh: ["福利", "社会保障", "风险"],
  },
  "0921": {
    titleZh: "他想自己决定几点睡",
    summaryZh: "一个坐轮椅的大学生把照护问题改写成独立生活和自主权问题。",
    sceneZh: "20 世纪 60 年代的加州，一个重度残障青年想上大学，却被安排住在校医院，而不是普通宿舍。",
    storyBodyZh: "别人常把他的需求理解成护理和保护，他却不断追问：为什么帮助必须以失去自主为代价？他和同伴争取校园无障碍、个人助理、住房选择和自我决定权，后来推动独立生活运动。老人和残障成人照护在这里发生了重要转向：照护不只是替人做事，也不是把人安置到方便管理的地方，而是支持一个人尽可能掌握自己的生活节奏、关系和选择。这个人叫 Ed Roberts，他推动 Berkeley Independent Living Movement，成为残障权利和独立生活运动的重要人物。今天谈无障碍和长期照护时，这个追问仍然锋利：帮助如果不能增加选择，它就可能只是换了一种方式管理别人。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是老人和残障成人照护最核心的问题之一：尊严、能力支持、安全、日常生活质量和自主性。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    supportZh: "Ed Roberts 是美国残障权利运动人物，1960 年代进入 University of California, Berkeley 后推动校园无障碍和独立生活理念，参与建立 Center for Independent Living。",
    knowledgePointZh: "老人和残障成人照护关注尊严、能力支持、安全、日常生活质量和自主性。",
    reflectionQuestionZh: "帮助一个人时，怎样确保你没有顺手拿走他的决定权？",
    tagsZh: ["照护", "残障权利", "独立生活"],
  },
  "0922": {
    titleZh: "孩子也有自己的共和国",
    summaryZh: "一位儿科医生兼教育者把儿童照护从管理孩子，推向尊重孩子作为人的权利。",
    sceneZh: "20 世纪初的华沙，一位照顾孤儿的医生在院舍里设置儿童议会、法庭和报纸。",
    storyBodyZh: "他并不把孩子只看成等待成人塑造的半成品。孩子会恐惧，会犯错，会需要规则，也有被认真倾听的尊严。他在孤儿院里让孩子参与自治，处理冲突，表达意见，练习责任。后来在纳粹占领和犹太隔都的极端处境中，他仍尽力保护孩子的尊严。儿童照护与青少年服务在这里不是简单看管，而是创造一个年轻人能够被保护、被听见、能学习承担责任的环境。这个人叫 Janusz Korczak，他以儿童权利思想、孤儿院实践和最后陪伴孩子进入 Treblinka 的选择，成为儿童照护与教育伦理的重要人物。今天的儿童服务仍需要这种提醒：保护不是让年轻人永远沉默，而是给他们能表达、犯错、修正和被认真对待的空间。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是儿童照护与青少年服务最核心的问题之一：保护、发展、陪伴、边界、参与和成长环境。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    supportZh: "Janusz Korczak 是波兰犹太医生、教育者和作家，经营孤儿院，提倡儿童权利和儿童自治。1942 年他与孤儿院儿童一起被送往 Treblinka，成为儿童尊严与照护伦理的象征人物。",
    knowledgePointZh: "儿童照护与青少年服务关注保护、发展、陪伴、边界、参与和成长环境。",
    reflectionQuestionZh: "当成年人说“为了孩子好”时，孩子自己的声音在哪里？",
    tagsZh: ["儿童照护", "儿童权利", "青年服务"],
  },
  "0923": {
    titleZh: "她先画出家庭和邻里关系",
    summaryZh: "一位社会工作者把求助从施舍，变成对人、家庭和资源系统的细致理解。",
    sceneZh: "19 世纪末的美国城市里，一个慈善组织工作者面对求助家庭，发现简单发放物资常常不够。",
    storyBodyZh: "她看到贫困背后可能有失业、疾病、亲属关系、住房、债务、羞耻和制度缺口。帮助如果只看眼前请求，很容易误解人，也容易重复失败。她强调调查、访谈、记录、家庭和社区资源，把个案工作变成有方法的专业实践。今天我们会更敏感地批判早期慈善中的阶级眼光和道德判断，但她推动的一个转向仍然重要：社会工作与咨询必须理解一个人所处的关系网，而不是只评价个人。这个人叫 Mary Ellen Richmond，她通过《Social Diagnosis》等作品奠定现代社会个案工作的重要方法基础。今天个案工作仍不该只停在表面请求上；它要把人的困难放回家庭、社区、制度和可获得资源的网里看。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是社会工作与咨询要练习的连接能力：个人困难、家庭关系、资源系统、支持过程和专业伦理。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    supportZh: "Mary Ellen Richmond 是美国社会工作先驱，1917 年出版《Social Diagnosis》，强调调查、个案记录、家庭和社会环境分析，对 social casework 专业化影响深远。",
    knowledgePointZh: "社会工作与咨询连接个人困难、家庭关系、资源系统、支持过程和专业伦理。",
    reflectionQuestionZh: "当一个人求助时，你能不能看见问题背后的关系和制度？",
    tagsZh: ["社会工作", "咨询", "个案"],
  },
  "0929": {
    titleZh: "战场上的红十字臂章",
    summaryZh: "一个旅行者在战场边组织救助，让福利实践越过国界、军队和普通慈善分类。",
    sceneZh: "1859 年意大利 Solferino 战场附近，一个瑞士商人偶然看见成千上万伤兵无人照料。",
    storyBodyZh: "他原本不是来创办组织的，却被眼前场面困住：不同国家的士兵一样流血，医疗力量远远不足，平民临时参与救助。他组织当地人照顾伤员，后来把经历写成书，提出建立中立救援组织和国际规则。未另分类的福利正像这种实践：它不只是医院，不只是军队，也不只是慈善，而是在灾难、战争、法律和人道责任之间为脆弱者开出一条保护通道。这个人叫 Henry Dunant，他推动 International Committee of the Red Cross 和 Geneva Convention 的形成，并成为现代人道主义救援的重要奠基人。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未另分类的福利需要保留下来的边界问题：那些跨越救助、人道、社区、法律和紧急支持的实践。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。战场把照护问题推到最残酷的地方：如果没人组织善意，善意就可能来得太晚。",
    supportZh: "Henry Dunant 目睹 1859 年 Battle of Solferino 后写作《A Memory of Solferino》，倡议中立救援组织和战时伤员保护，推动 ICRC 与 Geneva Convention 形成，1901 年获首届诺贝尔和平奖。",
    knowledgePointZh: "未另分类的福利收纳那些跨越救助、人道、社区、法律和紧急支持的实践。",
    reflectionQuestionZh: "当一个人受伤时，为什么他的阵营不该决定他是否值得被救？",
    tagsZh: ["福利", "人道救援", "红十字"],
  },
  "0988": {
    titleZh: "疼痛不是最后才处理的事",
    summaryZh: "一位医生听见临终病人的整体痛苦，让健康与福利重新理解照护的终点。",
    sceneZh: "20 世纪英国，一位曾做护士和社工、后来学医的女性，坐在临终病人床边，认真听他们说疼痛和孤独。",
    storyBodyZh: "她发现病人的痛苦并不只在身体里。疼痛、恐惧、家庭关系、宗教疑问、经济压力和被遗弃感会叠在一起。如果医学只在治愈失败后才想起照护，就太晚了。她提出 total pain 的理解，建立 hospice 照护，把症状控制、心理支持、家属陪伴、社会工作和尊严放在同一套体系里。健康与福利的跨学科意义在这里非常清楚：人不是一组器官，也不是一张福利表格，而是在生命末端仍需要被完整看见。这个人叫 Cicely Saunders，她创办 St Christopher's Hospice，并奠定现代 hospice 和 palliative care 的重要基础。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是健康与福利跨学科课程要练习的连接能力：医学、护理、心理、社会支持、家庭和人的尊严。所以它不只是专业机构里的知识，而是在训练人准确看见脆弱时刻里的真实需要。",
    supportZh: "Cicely Saunders 曾接受护理、社会工作和医学训练，1967 年创办 St Christopher's Hospice。她提出 total pain 概念，推动现代临终关怀和 palliative care 发展。",
    knowledgePointZh: "健康与福利跨学科课程连接医学、护理、心理、社会支持、家庭和人的尊严。",
    reflectionQuestionZh: "当治愈不再可能时，照护还能怎样继续保护一个人的完整性？",
    tagsZh: ["跨学科", "临终关怀", "姑息治疗"],
  },
  "0999": {
    titleZh: "她把战场护理带回和平时期",
    summaryZh: "一个战时救护组织者让健康与福利边界出现灾害、志愿服务和公共应急的混合实践。",
    sceneZh: "美国南北战争期间，一个女性在战场附近分发物资、寻找伤员，也给家属传递生死消息。",
    storyBodyZh: "她不是只做临时善事。战争让她看到，伤员护理、物资协调、失踪人员信息、志愿者组织和灾后救援需要长期制度，而不该每次都从混乱开始。战后，她继续推动建立更稳定的人道救援组织，使救护从战争现场延伸到灾害、公共应急和社会支持。未另分类的健康与福利常常就站在这种边界：它既不是普通医院，也不是单一福利机构，而是在危机里把照护、信息、物资和组织能力接起来。这个人叫 Clara Barton，她创办 American Red Cross，并推动美国加入国际红十字人道救援体系。今天的灾害救援和社区支持仍在延续这条线：善意如果没有训练、记录和协调，很容易在真正紧急时散开。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的健康与福利必须面对的问题：那些跨越医疗、救援、信息、志愿组织和公共应急的支持实践。这让今天的诊室、家庭照护和社区支持重新变得具体：保护身体的同时，也要保护人的尊严和选择。",
    supportZh: "Clara Barton 在美国南北战争期间组织护理和物资救援，战后推动失踪士兵信息工作。1881 年她创办 American Red Cross，并长期领导该组织参与灾害救援。",
    knowledgePointZh: "未另分类的健康与福利处理那些跨越医疗、救援、信息、志愿组织和公共应急的支持实践。",
    reflectionQuestionZh: "一场危机之后，怎样把临时善意变成下次能更快保护人的制度？",
    tagsZh: ["红十字", "救援", "健康福利"],
  },
  "1000": {
    titleZh: "真相时刻在登机口",
    summaryZh: "一个航空公司管理者把服务理解成每一次人与系统相遇的瞬间。",
    sceneZh: "20 世纪 80 年代的斯堪的纳维亚航空，一名乘客在柜台前等待，真正评价公司的时刻可能只有几十秒。",
    storyBodyZh: "他意识到，服务不是总部文件里的承诺，而是旅客和员工相遇的每一个瞬间：电话是否被接起，柜台是否有权解决问题，延误时信息是否诚实，员工是否被信任去判断现场。于是他强调 moments of truth，让组织把权力下放到前线，把服务体验看成无数接触点共同形成的结果。服务领域在这里变得具体：体验不是微笑装饰，而是流程、信息、权限、情绪和时间是否对齐。这个人叫 Jan Carlzon，他在 Scandinavian Airlines 推动服务管理转型，并以 moments of truth 思想影响现代服务管理。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未进一步细分的服务最核心的问题之一：体验、协调、接触点、时间和人在现场获得帮助的条件。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Jan Carlzon 曾任 Scandinavian Airlines CEO，1980 年代推动以顾客接触点和前线员工授权为核心的服务管理转型，并在《Moments of Truth》中传播相关思想。",
    knowledgePointZh: "未进一步细分的服务关注体验、协调、接触点、时间和人在现场获得帮助的条件。",
    reflectionQuestionZh: "一个服务真正被评价的瞬间，是广告出现时，还是问题需要被解决时？",
    tagsZh: ["服务", "体验", "管理"],
  },
  "1010": {
    titleZh: "美容院里的红门",
    summaryZh: "一个女性创业者把个人服务从私密修饰，变成品牌、培训和现代消费体验。",
    sceneZh: "20 世纪初的纽约，一个年轻女性在美容院里学习护肤、销售和顾客沟通，发现服务身体也在服务身份。",
    storyBodyZh: "她明白顾客来这里不只是买一瓶霜。她们想被认真接待，想学习如何照顾自己，也想进入一种新的城市女性形象。她建立美容院、培训销售人员、统一产品和服务话术，把个人服务组织成可复制的体验系统。这个过程当然也和消费主义、阶层和审美压力纠缠在一起；但它说明个人服务并不是低级边角行业，而是身体、情绪、身份、信任和商业组织相遇的地方。这个人叫 Elizabeth Arden，她建立全球美容品牌和 salon 服务体系，深刻影响现代个人护理和美容服务业。今天许多个人服务也是这样：看似处理外表或小需求，实际常在处理信任、身份、身体边界和被尊重的感觉。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是个人服务最核心的问题之一：身体、形象、舒适、沟通、身份和贴近日常生活的服务体验。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    supportZh: "Elizabeth Arden 20 世纪初在 New York 开设美容院，发展护肤、化妆品销售、培训和红门 salon 品牌体系，成为现代美容产业重要人物。",
    knowledgePointZh: "个人服务关注身体、形象、舒适、沟通、身份和贴近日常生活的服务体验。",
    reflectionQuestionZh: "当一个服务直接接触身体时，它是否也在接触一个人的自我想象？",
    tagsZh: ["个人服务", "美容", "品牌"],
  },
  "1011": {
    titleZh: "厨房里的化学课",
    summaryZh: "一位化学家把家庭清洁、饮食和通风变成可研究的家政服务知识。",
    sceneZh: "19 世纪末的美国，一位女性化学家走进厨房、水槽和餐桌，发现家庭生活里到处都是科学问题。",
    storyBodyZh: "她不把家务看成天生会做的女性本能。水质、污水、通风、食物营养、清洁剂、厨房动线和家庭预算，都需要知识和标准。她推动 domestic science 和 home economics，把家庭运行放进教育和公共卫生视野。今天我们会警惕家政知识被用来固定性别分工，但她的工作也提醒我们：一个家是否安全、健康、好用，背后有化学、卫生、营养和管理。这个人叫 Ellen Swallow Richards，她是美国早期女性化学家和 home economics 重要奠基人物之一。今天家政服务也可以被这样重新理解：它不是低声消失的劳动，而是让家庭系统更安全、更健康、更可持续的知识。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是家政服务最核心的问题之一：清洁、整理、照护辅助、家庭运行、营养、安全和生活环境质量。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Ellen Swallow Richards 是 MIT 首位女性毕业生之一，也是化学家和公共卫生改革者。她推动 domestic science、sanitary chemistry 和 home economics，把家庭生活与科学、卫生和教育连接起来。",
    knowledgePointZh: "家政服务关注清洁、整理、照护辅助、家庭运行、营养、安全和生活环境质量。",
    reflectionQuestionZh: "一个家变得好用，是因为有人天生会做，还是因为有一整套被忽略的知识？",
    tagsZh: ["家政", "家庭科学", "卫生"],
  },
  "1012": {
    titleZh: "她把头发护理做成事业",
    summaryZh: "一个洗衣女工出身的创业者，让美发美容服务连接技术、尊严和黑人女性经济机会。",
    sceneZh: "20 世纪初的美国，一个曾长期为脱发烦恼的女性，开始试验护发产品，并挨家挨户向顾客讲解。",
    storyBodyZh: "她知道头发不只是外表，也关系到工作、自尊、种族压力和女性互助。她开发产品、培训销售代理、开办美容学校，让许多黑人女性通过美发和美容服务获得收入与社群地位。今天我们也会讨论当时审美标准与种族政治的复杂性，但她的故事说明，美发与美容服务不是简单“变好看”，而是技术、身体、身份、商业和社会机会交织的行业。这个人叫 Madam C. J. Walker，她建立护发美容企业和培训体系，成为美国黑人女性创业和美容服务史上的标志性人物。今天美发美容服务仍在这条线上：技术贴着身体发生，所以也会贴着尊严、审美压力和经济机会发生。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是美发与美容服务最核心的问题之一：形象、身体、审美、技术、沟通和信任。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    supportZh: "Madam C. J. Walker 是美国企业家，发展护发产品、销售网络和美容培训体系，常被称为美国首位白手起家的女性百万富翁之一，对黑人美容产业和女性就业影响深远。",
    knowledgePointZh: "美发与美容服务关注形象、身体、审美、技术、沟通和信任。",
    reflectionQuestionZh: "一次发型服务，什么时候也在处理尊严、身份和经济机会？",
    tagsZh: ["美发", "美容", "创业"],
  },
  "1013": {
    titleZh: "厨房像军队一样有秩序",
    summaryZh: "一位厨师把豪华厨房重组为分工、菜单和服务节奏的现代餐饮系统。",
    sceneZh: "19 世纪末的欧洲酒店厨房里，炉火、锅具、侍者和订单交错，一个厨师发现混乱会毁掉最好的菜。",
    storyBodyZh: "他并不只追求菜品精致，也关心厨房怎样在高压下稳定交付。谁负责酱汁，谁负责烤肉，谁负责冷盘，菜单怎样简化，服务怎样按节奏送到餐桌，都需要组织。他把 brigade de cuisine 和现代菜单、酒店餐饮服务结合起来，让餐饮从个人手艺扩展成团队系统。酒店、餐厅与餐饮在这里变得清楚：食物只是体验的一部分，卫生、时间、分工、前后台协作和顾客感受同样决定记忆。这个人叫 Auguste Escoffier，他改革专业厨房组织和现代法餐服务，被视为现代餐饮管理和厨艺体系的重要人物。今天任何餐饮现场都能看到这套系统：客人记住的往往不是一道菜，而是混乱被怎样悄悄整理好。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是酒店、餐厅与餐饮最核心的问题之一：接待、食物、流程、卫生、团队分工和体验。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Auguste Escoffier 是法国厨师和餐饮管理改革者，推广 kitchen brigade system，简化菜单和服务流程，与 César Ritz 等合作塑造现代酒店餐饮服务。",
    knowledgePointZh: "酒店、餐厅与餐饮关注接待、食物、流程、卫生、团队分工和体验。",
    reflectionQuestionZh: "一次好用餐，哪些部分不是味道，却决定你会不会记住它？",
    tagsZh: ["餐饮", "酒店", "厨房组织"],
  },
  "1014": {
    titleZh: "冬天室内也能玩的球",
    summaryZh: "一个体育教师用两个桃篮和一只球，发明了兼顾规则、身体和公平竞争的新运动。",
    sceneZh: "1891 年马萨诸塞的冬天，一个体育教师面对一群精力旺盛却不能总在户外训练的学生。",
    storyBodyZh: "他需要一种室内运动，既能消耗体力，又不至于像橄榄球那样冲撞受伤。他把桃篮钉高，用足球传递，写下十三条规则，强调传球、空间、目标和限制身体接触。体育在这里不是随便竞争，而是通过规则设计让身体、团队、公平和安全同时存在。一个好运动并不只是让人赢，还要让人愿意反复练习、合作、遵守边界并在限制中创造。这个人叫 James Naismith，他于 1891 年发明 basketball，使篮球成为全球重要体育项目。今天设计体育活动时，这个原则仍然有用：好的限制不是减少自由，而是让身体、合作和公平能安全地出现。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是体育最核心的问题之一：训练、规则、身体表现、团队合作、公平竞争和安全边界。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。桃篮被钉上墙的那一刻，规则也被钉进了运动里：限制冲撞，留下配合，让身体在边界内创造。",
    supportZh: "James Naismith 1891 年在 International YMCA Training School 发明 basketball，最初使用桃篮和足球，并写下十三条基本规则，目标是在室内进行较安全的团队运动。",
    knowledgePointZh: "体育关注训练、规则、身体表现、团队合作、公平竞争和安全边界。",
    reflectionQuestionZh: "一条好规则，是限制了运动，还是让更好的运动成为可能？",
    tagsZh: ["体育", "篮球", "规则"],
  },
  "1015": {
    titleZh: "一张火车票里的旅行社",
    summaryZh: "一次禁酒会旅行让旅游从个人冒险，变成组织路线、价格和体验的服务业。",
    sceneZh: "1841 年英国，一个木工出身的传教士组织数百人乘火车去参加集会，必须处理票价、时间和秩序。",
    storyBodyZh: "他面对的不是远方风景，而是让一群普通人安全、便宜、有计划地抵达目的地。火车票、团体价格、行程安排、住宿、说明和陪同服务慢慢连成一个新行业。旅行、旅游与休闲在这里不再只是富人的个人游历，而成为被组织出来的体验：路线怎样设计，风险怎样降低，地方文化怎样被介绍，游客自由又怎样依赖别人提前安排。这个人叫 Thomas Cook，他组织早期团体旅行并创办旅行服务企业，成为现代旅游业和旅行社服务的重要先驱。今天旅游服务也在平衡这件事：让人感觉自由，同时用路线、信息、保险和应急安排托住看不见的风险。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是旅行、旅游与休闲最核心的问题之一：目的地、行程、体验设计、文化接触、安全和服务协调。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。旅行服务最微妙的地方就在这里：它让人走向陌生地方，却必须先把许多陌生风险安排好。",
    supportZh: "Thomas Cook 1841 年组织 Leicester 到 Loughborough 的团体火车旅行，后来发展旅行社业务，提供团体游、票务、住宿和旅行安排，被视为现代旅游业先驱之一。",
    knowledgePointZh: "旅行、旅游与休闲关注目的地、行程、体验设计、文化接触、安全和服务协调。",
    reflectionQuestionZh: "旅行里的自由，为什么常常依赖别人已经设计好的秩序？",
    tagsZh: ["旅游", "旅行社", "服务"],
  },
  "1019": {
    titleZh: "一个陌生人替他看见标签",
    summaryZh: "一款志愿协助服务让个人服务跨过标准分类，进入数字、残障支持和日常小困难之间。",
    sceneZh: "21 世纪，一个视障用户在厨房拿起一罐食品，却不确定标签上写的到底是什么。",
    storyBodyZh: "传统服务窗口很难覆盖这种小而急的需求：不是医疗，不是旅游，不是家政，也不是普通客服。一个人只需要另一个可靠的人通过手机摄像头看一眼，告诉他颜色、文字、按钮或路线。这样的服务把志愿者、视频通话、无障碍和个人日常支持连接起来，也提醒我们服务价值不一定来自复杂流程，有时来自在正确时刻补上一点人的感知。这个人叫 Hans Jorgen Wiberg，他创立 Be My Eyes，使志愿者通过视频协助视障者处理日常视觉问题，成为未另分类个人服务的现代案例。今天数字服务越多，这类小帮助越重要：技术真正有温度的时候，常常是它补上了一个人刚好缺少的感知。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未另分类的个人服务需要保留下来的边界问题：改善个人生活但不适合标准服务类别的实践。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    supportZh: "Hans Jorgen Wiberg 创立 Be My Eyes，这是一款通过视频连接志愿者和视障用户的应用，用于识别物品、标签、路线等日常视觉任务，是数字无障碍服务的重要案例。",
    knowledgePointZh: "未另分类的个人服务收纳改善个人生活但不适合标准服务类别的实践。",
    reflectionQuestionZh: "哪一种帮助小到不容易命名，却刚好让一个人能继续独立生活？",
    tagsZh: ["个人服务", "无障碍", "数字服务"],
  },
  "1020": {
    titleZh: "城市空气、污水和实验室",
    summaryZh: "一位卫生学家把公共卫生训练制度化，让卫生服务成为城市和工作场所的专业知识。",
    sceneZh: "19 世纪德国城市里，人口密集、污水和传染病让医学无法只待在病床旁。",
    storyBodyZh: "他关心空气、水、住房、排污和城市环境，也建立实验和教学体系，让卫生不只是日常清洁习惯，而成为可研究、可训练、可争论的公共专业。他的某些理论后来被修正，特别是在病菌理论发展后；但他推动卫生学进入大学、实验室和城市治理的努力，说明卫生与职业健康服务的基础意义：预防必须发生在疾病出现之前，发生在水、空气、建筑、工作和制度中。这个人叫 Max von Pettenkofer，他建立慕尼黑卫生学研究传统，被视为现代 hygiene 和公共卫生教育的重要先驱之一。今天的卫生服务依然需要这种宽视角：空气、水、垃圾、实验室和制度如果分开处理，风险就会从缝隙里回来。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是未进一步细分的卫生与职业健康服务最核心的问题之一：预防、环境、工作场所、清洁和群体健康条件。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Max von Pettenkofer 是德国卫生学家，19 世纪在 Munich 推动 hygiene 研究、教学和城市公共卫生改革。虽然其部分疾病理论后来被修正，但他对卫生学制度化有重要影响。",
    knowledgePointZh: "未进一步细分的卫生与职业健康服务关注预防、环境、工作场所、清洁和群体健康条件。",
    reflectionQuestionZh: "真正的卫生服务，是在你生病后出现，还是在你没生病前就已经工作？",
    tagsZh: ["卫生", "公共卫生", "预防"],
  },
  "1021": {
    titleZh: "贫民区的排水沟",
    summaryZh: "一份关于劳动者卫生的报告，让社区卫生从个人干净转向城市基础设施问题。",
    sceneZh: "19 世纪英国工业城市里，一个改革者调查工人居住区，看到污水、拥挤住房和疾病紧紧相连。",
    storyBodyZh: "他发现，责怪穷人不爱干净很容易，却忽略了他们生活在怎样的街道、水源和排污条件里。污水横流、垃圾堆积、饮水污染和住房拥挤，让疾病传播成为结构性后果。他的报告推动公共卫生改革，也带着当时阶级眼光和治理控制的问题，需要被批判阅读。但社区卫生的核心已经清楚：干净不是只靠个人习惯，而要靠供水、排水、垃圾处理、住房和公共制度。这个人叫 Edwin Chadwick，他的 1842 年《Report on the Sanitary Condition of the Labouring Population》推动英国公共卫生和城市卫生改革。从这个角度看，知识不是被贴上去的标签，而是人在现场为了少一点误解、多一点判断而发展出的工具。藏在这个故事里的，是社区卫生最核心的问题之一：废弃物、水、清洁、公共空间、住房条件和群体健康。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Edwin Chadwick 1842 年发表关于英国劳动人口卫生状况的报告，强调排水、供水、垃圾和住房条件对疾病的影响，对 Public Health Act 1848 等公共卫生改革有重要推动作用。",
    knowledgePointZh: "社区卫生关注废弃物、水、清洁、公共空间、住房条件和群体健康。",
    reflectionQuestionZh: "当一个地方不干净，你会先责怪个人，还是先看系统给了他们什么条件？",
    tagsZh: ["社区卫生", "排水", "公共卫生"],
  },
  "1022": {
    titleZh: "铅尘落在工人的衣服上",
    summaryZh: "一个医生走进工厂，把职业病从个人不幸变成可调查、可预防的工作场所风险。",
    sceneZh: "20 世纪初的美国，一位女医生进入铅厂、橡胶厂和油漆车间，询问工人头痛、麻木和中毒症状。",
    storyBodyZh: "她没有只在诊室等待病人，而是去看病人工作的地方。毒物在哪里产生，粉尘怎样被吸入，通风是否足够，工人有没有防护，雇主是否隐瞒风险？这些问题让职业健康与安全成为一门现场科学。工作场所的伤害不是“粗心”两个字能解释的，它常常来自材料、设备、节奏、权力和缺乏监管。这个人叫 Alice Hamilton，她开创美国职业医学和工业毒理调查传统，推动工作场所健康与安全改革。今天的职业安全仍要抵抗一句轻飘飘的责怪：如果危险总在同一处重复，问题很可能已经写进流程和权力关系里。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是职业健康与安全最核心的问题之一：工作场所风险、预防、设备、防护、制度和安全行为。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。职业安全最怕把反复出现的伤害说成个人不小心；如果危险总在同一处出现，现场本身就在说话。",
    supportZh: "Alice Hamilton 是美国职业医学先驱，研究铅、汞、苯等工业毒物对工人的影响，1919 年成为 Harvard Medical School 首位女性教员之一，对职业健康和工业安全影响深远。",
    knowledgePointZh: "职业健康与安全关注工作场所风险、预防、设备、防护、制度和安全行为。",
    reflectionQuestionZh: "如果一个工伤反复出现，它是个人失误，还是现场在重复制造危险？",
    tagsZh: ["职业健康", "安全", "工业毒理"],
  },
  "1029": {
    titleZh: "工厂火灾后的出口门",
    summaryZh: "一场灾难让卫生与职业安全边界上的法规、劳动权利和公共责任同时浮现。",
    sceneZh: "1911 年纽约 Triangle Shirtwaist Factory 火灾后，一个年轻社会改革者站在悲痛和愤怒之间，追问为什么门会被锁上。",
    storyBodyZh: "那场火灾暴露的不只是一个工厂的事故，而是逃生通道、工时、童工、消防检查、雇主责任和政府监管的失败。她后来参与调查和改革，推动工厂安全、最低工资、失业保险等劳动保护制度。未另分类的卫生与职业健康服务常常出现在这种交界处：它不是单一卫生措施，也不是单个安全培训，而是法律、工作现场、公共行政和人的生命价值如何被重新安排。这个人叫 Frances Perkins，她在 Triangle 火灾后推动劳动与安全改革，后来成为美国首位女性内阁部长并参与 New Deal 社会保障制度建设。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是未另分类的卫生与职业健康服务必须面对的问题：混合型公共卫生、工作安全、法规和现场保护实践。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Frances Perkins 目睹 1911 年 Triangle Shirtwaist Factory fire 后投入劳动安全改革，后任 Franklin D. Roosevelt 劳工部长，推动 Social Security Act、工时和劳动保护等 New Deal 政策。",
    knowledgePointZh: "未另分类的卫生与职业健康服务处理混合型公共卫生、工作安全、法规和现场保护实践。",
    reflectionQuestionZh: "一个出口门被锁上时，锁住的是通道，还是整个社会对劳动者生命的想象？",
    tagsZh: ["职业安全", "劳动", "法规"],
  },
  "1030": {
    titleZh: "警察为什么应该穿制服",
    summaryZh: "一个内政改革者把安全服务从临时镇压，推向可识别、可约束的公共警务。",
    sceneZh: "19 世纪伦敦街头，城市快速扩张，犯罪、贫困、拥挤和公众恐惧让旧式治安方式越来越不够。",
    storyBodyZh: "他要解决的不是单次抓捕，而是一个城市怎样在不变成军营的情况下维持公共秩序。新警察需要可识别的制服、巡逻、纪律、预防原则和公众信任。这个制度也一直伴随权力滥用、阶级控制和监督问题，必须被批判地看；但现代安全服务的一个核心矛盾已经出现：保护公众需要权力，而权力又必须被规则、透明和责任约束。这个人叫 Robert Peel，他创立 London Metropolitan Police，并使现代公共警务原则成为安全服务史上的重要起点。今天谈公共安全时，这个问题仍然没有过时：制服让权力可见，也要求权力被规则、责任和公众信任约束。那个小问题没有马上变成答案，却改变了提问方式：不是急着给结论，而是先弄清楚什么正在影响结果。藏在这个故事里的，是未进一步细分的安全服务最核心的问题之一：风险识别、预防、响应、秩序、信任和权力约束。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    supportZh: "Robert Peel 1829 年推动建立 London Metropolitan Police。Peelian principles 强调预防犯罪、公众合作、有限使用武力和警察责任，虽历史归属和表述复杂，但与现代公共警务传统密切相关。",
    knowledgePointZh: "未进一步细分的安全服务关注风险识别、预防、响应、秩序、信任和权力约束。",
    reflectionQuestionZh: "一个安全系统怎样既保护人，又不让保护人的权力失去边界？",
    tagsZh: ["安全服务", "警务", "公共秩序"],
  },
  "1031": {
    titleZh: "胜利之前先计算代价",
    summaryZh: "一部古老兵书让军事与国防从勇武叙事，转向战略、信息和避免无谓消耗。",
    sceneZh: "古代中国的战乱时代，一个军事思想者看见军队、粮草、地形、间谍和君主情绪如何决定生死。",
    storyBodyZh: "他并不把战争写成单纯勇敢。真正的将领要先计算代价，理解地形，保存士气，使用信息，避免被愤怒驱动，也要知道不战而屈人之兵有时高于硬碰硬。军事与国防在这里显出冷静的一面：力量不是全部，组织、补给、情报、时间、心理和政治目标共同决定安全。古代文本不能直接替代现代伦理和国际法，但它提醒我们，防御和战争从来不是单纯武器问题。这个人叫 Sun Tzu，他的《The Art of War》成为军事战略、组织竞争和安全思考史上的经典文本。今天军事与国防的学习也必须保留这种冷静：知道怎样行动重要，知道怎样避免无谓行动同样重要。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是军事与国防最核心的问题之一：安全、组织、战略、训练、资源、情报和风险准备。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。真正的克制不是软弱，而是知道每一次行动都会带来补给、士气、政治和生命的代价。",
    supportZh: "Sun Tzu 及《The Art of War》通常被置于中国春秋战国军事思想传统中，强调战略、情报、地形、士气、欺敌和避免无谓战争，对军事与战略思想影响广泛。",
    knowledgePointZh: "军事与国防关注安全、组织、战略、训练、资源、情报和风险准备。",
    reflectionQuestionZh: "真正的防御只是拥有力量，还是知道什么时候不该使用力量？",
    tagsZh: ["军事", "国防", "战略"],
  },
  "1032": {
    titleZh: "每一次接触都会留下痕迹",
    summaryZh: "一个法医学实验室让保护人身与财产不只靠巡逻，也靠证据和可验证的调查。",
    sceneZh: "20 世纪初的法国里昂，一个年轻法医学者在实验室里研究灰尘、纤维、玻璃和指纹。",
    storyBodyZh: "他相信犯罪现场不是沉默的。鞋底带走泥土，衣袖留下纤维，玻璃碎片交换微粒，人与物只要接触就会互相留下痕迹。这个思想改变了安全服务：保护人身与财产不只是锁门、巡逻和抓人，也包括保存现场、分析证据、重建事件和让判断经得起法庭检验。证据工作也必须受程序和权利约束，否则技术会变成新的不公。这个人叫 Edmond Locard，他建立 Lyon police laboratory，并提出 Locard's exchange principle，成为现代法医学和犯罪调查的重要人物。今天的调查技术越精密，越需要这条边界：证据能保护人，也必须被程序和权利保护起来。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是人身与财产保护最核心的问题之一：风险识别、预防、证据、响应和安全环境设计。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Edmond Locard 是法国法医学先驱，1910 年建立 Lyon 警方实验室，提出接触会产生物质交换的 Locard's exchange principle，对现代犯罪现场调查和法医学影响深远。",
    knowledgePointZh: "人身与财产保护关注风险识别、预防、证据、响应和安全环境设计。",
    reflectionQuestionZh: "如果每一次接触都会留下痕迹，安全判断为什么必须同时尊重证据和权利？",
    tagsZh: ["安全", "法医学", "证据"],
  },
  "1039": {
    titleZh: "罪犯变成了侦探",
    summaryZh: "一个身份复杂的人把犯罪经验、调查、档案和私人安保混成新的安全实践。",
    sceneZh: "19 世纪巴黎，一个曾多次入狱又熟悉地下世界的人，开始替警方辨认骗术、伪装和犯罪网络。",
    storyBodyZh: "他的经历并不适合简单歌颂，也充满道德复杂性。正因为熟悉犯罪现场的语言和习惯，他能从细节里看出伪装，建立档案，使用卧底和线人，把调查从单纯巡逻变成信息工作。后来他创办私人侦探机构，使安全服务出现警务、商业调查、情报和个人委托之间的灰色地带。未另分类的安全服务正需要审慎处理这种边界：有效信息、合法权力和隐私风险总是同时存在。这个人叫 Eugene Francois Vidocq，他从罪犯转为侦探并创办侦探机构，被视为现代侦探和私人调查史上的重要人物。今天许多安全服务仍在类似灰区里工作：经验可能有用，但只有被法律、伦理和监督驯服后，才不会伤到人。这就是故事的发动机：大家以为事情只是照旧发生，主人公却看见背后还有一套正在运转的系统。藏在这个故事里的，是未另分类的安全服务需要保留下来的边界问题：那些跨越调查、保护、情报、现场支持和非标准风险管理的实践。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。",
    supportZh: "Eugene Francois Vidocq 是法国犯罪者、警方线人和侦探，曾领导 Surete 相关工作并创办私人侦探机构。他长期影响刑侦档案、卧底实践和侦探形象。",
    knowledgePointZh: "未另分类的安全服务收纳那些跨越调查、保护、情报、现场支持和非标准风险管理的实践。",
    reflectionQuestionZh: "当安全工作依赖灰色经验时，谁来划定有效与越界的边界？",
    tagsZh: ["安全服务", "侦探", "调查"],
  },
  "1041": {
    titleZh: "地铁线路为什么可以弯成图",
    summaryZh: "一张地铁图让运输服务从真实距离，转向乘客能不能迅速做出决定。",
    sceneZh: "1930 年代伦敦，一个工程制图员看着复杂地铁线路，发现按真实地理画出的地图让乘客很难读。",
    storyBodyZh: "他大胆舍弃精确距离，把线路画成水平、垂直和 45 度角，把站点间距简化，让换乘关系变得清楚。这个图一开始并不符合传统地图直觉，却更符合乘客在运输系统里的真实需要：我在哪，去哪换，下一站怎么走。运输服务在这里不仅是车辆移动，也包括信息设计、时间承诺、可达性和人在压力下的判断。一个系统如果让人看不懂，再准时也会让人迷失。这个人叫 Harry Beck，他设计 London Underground diagram，成为现代交通信息设计和运输服务体验的经典案例。今天的交通系统也一样：真正好用的不只是车会动，而是人在匆忙、陌生和压力下仍能做出清楚选择。真正的转弯发生在这里：别人可能只看见眼前的麻烦，故事里的人却把它拆成可以观察、记录和调整的问题。藏在这个故事里的，是运输服务最核心的问题之一：人和物的移动、换乘、可靠性、信息设计、安全和时间协调。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Harry Beck 1931 年设计 London Underground schematic map，使用简化线路、固定角度和非地理比例强调换乘关系。该图成为全球交通线路图设计的经典范式。",
    knowledgePointZh: "运输服务关注人和物的移动、换乘、可靠性、信息设计、安全和时间协调。",
    reflectionQuestionZh: "一个交通系统真正好用，是因为路短，还是因为人在压力下也能看懂？",
    tagsZh: ["运输", "地图", "信息设计"],
  },
  "1088": {
    titleZh: "服务蓝图背后的看不见动作",
    summaryZh: "一个营销学者把服务拆成前台、后台和证据，让跨学科服务可以被设计和改进。",
    sceneZh: "20 世纪 80 年代，一位研究者观察服务现场，发现顾客看到的只是整个系统露出水面的部分。",
    storyBodyZh: "一次酒店入住、银行开户或维修预约，看起来是几句对话，背后却有表格、系统、培训、库存、授权、等待时间和失败补救。她提出 service blueprint，把顾客行为、前台接触、后台流程和有形证据画在一起。这样，服务不再只是态度好不好，而成为可以分析、设计和跨部门协调的系统。服务跨学科课程也由此清楚：运营、心理、空间、信息、人员和技术必须同时工作。这个人叫 G. Lynn Shostack，她提出 service blueprinting，成为服务设计和服务营销中的重要方法来源。问题没有停在表面。有人多看了一会儿，开始追问条件、关系和后果，于是一个普通场景慢慢变成了知识的入口。藏在这个故事里的，是服务跨学科课程要练习的连接能力：运营、体验、人员、空间、信息、技术和质量管理。所以它不只是态度好不好，而是在训练人把混乱的现场整理成能被人顺利使用的经验。如果只评价前台那一句话，很多服务失败就会被误判；真正要看的，是前台背后有没有足够清楚的流程在托住它。",
    supportZh: "G. Lynn Shostack 1980 年代提出 service blueprinting，用图示方式呈现顾客接触、前台、后台和支持流程，对服务设计、服务营销和运营管理影响深远。",
    knowledgePointZh: "服务跨学科课程连接运营、体验、人员、空间、信息、技术和质量管理。",
    reflectionQuestionZh: "一次服务失败时，问题真的在前台那个人身上，还是在蓝图里早就埋好了？",
    tagsZh: ["服务设计", "蓝图", "跨学科"],
  },
  "1099": {
    titleZh: "电话那头先不急着劝",
    summaryZh: "一个倾听热线说明，有些服务最重要的动作，是在正式分类之前先接住人。",
    sceneZh: "1950 年代伦敦，一个牧师在报纸上看到年轻人因孤立和羞耻而走向绝望，开始想象一条任何人都能拨打的电话线。",
    storyBodyZh: "他发现，许多人并不是一开始就能走进医院、警局、福利机构或教堂。他们可能只需要一个不审判、不急着训诫、愿意在深夜听完的人。于是志愿者被训练去接电话，重点不是立刻给答案，而是让来电者在最危险、最孤单的时刻不再独自承受。这样的服务很难归类：它不是普通医疗，也不是正式咨询，不是安保，也不是家政；但它在许多系统之间守住了一条细小通道。未另分类的服务正需要容纳这种看似无名却极其关键的支持。这个人叫 Chad Varah，他创立 Samaritans，让危机倾听热线成为现代志愿服务和情绪支持服务的重要形式。重要的不是那一刻立刻出现了答案，而是注意力换了方向：从责怪个人，转向检查材料、规则、环境和选择。藏在这个故事里的，是未另分类的服务需要认真追问的问题：未另分类的服务包括那些跨越医疗、咨询、社区、志愿和即时支持的实践角色。这让今天的车站、餐厅、活动入口和服务台重新变得具体：人经历的是一整条路径，不只是某个窗口。",
    supportZh: "Chad Varah 于 1953 年在 London 创立 Samaritans，最初提供面向自杀危机和深度孤独者的电话倾听服务。Samaritans 后来发展为重要的志愿情绪支持组织。",
    knowledgePointZh: "未另分类的服务包括那些跨越医疗、咨询、社区、志愿和即时支持的实践角色。",
    reflectionQuestionZh: "一种服务如果只是先听你说完，它为什么仍然可能改变一个夜晚的结局？",
    tagsZh: ["未分类服务", "倾听", "志愿服务"],
  },
};

lensStories.forEach((story) => {
  const code = Array.isArray(story.fieldCodes) ? story.fieldCodes[0] : "";
  const override = lensStoryOverridesZh[code];
  if (override) Object.assign(story, override);
});

const reviewedLensStoryOverridesZh = {
  "000-general-starter-course": {
    "titleZh": "皮围裙俱乐部的夜晚",
    "summaryZh": "一个入门现场让学习先从问题、同伴和练习开始。",
    "sceneZh": "1727 年的费城，一个年轻印刷工收好铅字，擦掉手上的油墨，走去参加一场没有学位、没有正式课表的夜间聚会。",
    "storyBodyZh": "起初，人们往往先这样处理：把这些练习当成进入正式道路前的零散准备：会读一点、会说一点、会做一点，就算够用。它的好处是门槛低，任何人都能先坐下来试一试。可眼前的细节开始把问题推回来：有人带着真实问题进来，却不知道该从哪一扇门开始；单靠课程表，接不住这种犹豫。它的边界也在这里显出来：读、问、表达和互助之间的连接会被当成个人运气。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先把问题写在纸边，再让不同经验的人轮流补充，又把书、练习、工具和同伴反馈放在一起核对。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一句话要看它有没有让别人接上，一本书要看它是否把问题带回行动。最早的问题是“先学哪一门内容”。问题慢慢变成“怎样先练出读、问、表达和共同判断的能力”。新的问法让纸页、练习和彼此的回应连在一起。从这里开始，那些小练习开始像一座入口，而不是一张等待盖章的清单。",
    "knowledgePointZh": "关键转向：人在进入具体道路前，先练习怎样读、问、表达和共同判断。",
    "reflectionQuestionZh": "在你选择一个具体方向之前，什么样的学习共同体会让你不再害怕学习本身？"
  },
  "011-dewey-lab-school": {
    "titleZh": "孩子们做早餐的教室",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "1896 年的芝加哥，一张教室桌上放着面粉、布料、木头、量具，还有一些很难塞进单本课本里的问题。",
    "storyBodyZh": "最初，当时更顺手的做法是：把学习看成教师按顺序交付内容，学生把答案带走。这套办法有用，因为让课堂有秩序，也方便检查进度。但眼前的材料没有顺着这个解释走：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。问题也在这里露出来：学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。原来的问题是“这一课教完了吗”。新的问法逐渐清楚“什么样的情境会让学习者自己把经验和知识接起来”。问题在这里变得明确：接下来必须顺着证据继续查。它没有把答案一下子交出来，却让活动、记录和追问被放回同一张桌上。于是，课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "如果一间教室从真实活动开始，而不是从标准答案开始，哪一种学习会变得可能？"
  },
  "020-family-photo-meaning": {
    "titleZh": "黑布上的一千张图片",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1920 年代后期的 Hamburg，一块黑布板前，图像被一次次取下又钉回去。",
    "storyBodyZh": "刚进入现场时，最容易被采用的入口是：按作者、年代、风格和流派把作品、文本或物件放进格子。它并不是空想，原因在于防止观看完全散掉，也给初学者一条进入作品的路。偏偏有一处细节不肯归入原来的说法：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。这套做法开始显出边界：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。第一层问题是“它属于哪一种作品或传统”。问题被推向另一句更难的话“它把哪些记忆、材料和观看方式带到了现在”。变化不是突然完成的，但它已经让相隔很远的物件被放到同一条视线上。到这一步，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "今天生活里哪一张图像，可能悄悄带着更古老的人类姿势？"
  },
  "030-neighbor-notice-board": {
    "titleZh": "街区地图上的贫困颜色",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "19 世纪末的芝加哥，一个年轻女性每天走过移民家庭、工厂、学校和拥挤出租屋之间的街道。",
    "storyBodyZh": "在最早的判断里，现场最先出现的判断是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它能先撑住局面，因为快速形成判断，也让复杂争论先有一个入口。这时，一个小小的不匹配把问题往前推：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。原来的解释在这里变窄：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原来的问法是“谁的说法对”。后来真正留下来的问题是“什么证据能让被分散的生活进入公共讨论”。到这里，新的问法不是口号，而是被材料逼出来的下一步。答案还没有封口，材料已经让记录、位置和人的声音被一起比较。后来再回看，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "如果把你所在街区的一种困难画成地图，谁的生活会第一次被看见？"
  },
  "040-kitchen-repair-budget": {
    "titleZh": "第一所商学院的疑问",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "19 世纪后期的费城，一个在工业和金融世界工作多年的男人，越来越担心商业只靠机灵和家传经验是不够的。",
    "storyBodyZh": "事情刚被记录下来时，很多人会先这么做：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。这种办法的价值在于让人先做决定，也能把责任表面上固定下来。原来的做法刚要收口，新的证据就露出缝隙：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。原来的做法到这里不够用了：责任、风险、激励、权利和后果会被推给后来承受的人。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。一开始能说出口的问题是“哪一种选择最划算”。这时，问题换了形状“哪些责任、风险和规则必须先被摆到桌面上”。新的问法让人不能只带着原来的解释离开现场。这一步没有结束争论，却让账本、合同和人的后果被放在一起读。真正留下来的变化是：选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "当一个行业越来越复杂，哪些经验必须从个人诀窍变成公开训练？"
  },
  "050-balcony-plant-observation": {
    "titleZh": "山坡上的自然图",
    "summaryZh": "一张山体剖面图，让被压在标本夹里的叶片重新回到海拔、温度和位置中。",
    "sceneZh": "1802 年前后，南美安第斯山的山坡上，仪器盒、气压计和压花纸被潮气打湿。",
    "storyBodyZh": "山脚还带着热气，压花纸到了高处却被冷雾弄软。一个旅行者把叶片夹进纸里，照习惯写下名称；这种办法很有用，标本能被带回欧洲，别人也能知道它属于哪一类。可山坡没有只留下名字。低处的阔叶旁写着一个温度，再往上，硬叶灌木、草本和苔藓挤在更低的气压数字旁；同一页笔记里，植物像是沿着高度换了队形。他停下来重抄记录，把海拔、气温、气压和植物名排成同一列，又把南美山坡同欧洲高山、热带低地的旧记录放在一起比较。原来的问题是“这株植物叫什么”。笔记把问题推向另一处：为什么相似的植物总在相似的高度、冷暖和水汽条件下出现？当这些数字和叶片被画进一座山的剖面，山不再只是采集背景，而变成一张能检查生命分布的图。后来，这位旅行者名叫 Alexander von Humboldt。",
    "knowledgePointZh": "未进一步细分的自然科学、数学与统计在这里出现的关键转向，是把标本名称、海拔、温度、气压和位置放到同一张可检查的图里，让自然从孤立事实变成可比较的分布。",
    "reflectionQuestionZh": "当你记录一个现象时，你是在给它取名，还是也在画出它和哪些条件一起出现？"
  },
  "061-phone-backup-help": {
    "titleZh": "信息像硬币一样可以计量",
    "summaryZh": "一个机器现场让信息的表示、通道和错误变得可见。",
    "sceneZh": "20 世纪 40 年代的 Bell Labs，一个年轻研究员面对电报、电话和噪声，问一个奇怪问题：信息到底能不能被测量？",
    "storyBodyZh": "按当时的习惯，一开始能撑住局面的办法是：把机器或工具看成完成任务的黑箱：能算、能传、能存，就算有用。它让人不至于完全乱掉，因为让人先使用系统，不必一开始就拆开所有内部结构。但眼前的材料没有顺着这个解释走：噪声、重复、错误或数据混乱一出现，单靠更快的机器并不能让结果可靠。现场把原来的做法推到边缘：信息怎样被表示、传输、组织、恢复，以及人在失败时怎样找回路径，会被藏在界面后面。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先把输入和输出分开检查，再标出错误出现的位置，又重新设计编码、结构、通道或恢复步骤。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一个输入要看它怎样被编码，一个错误要看系统能否把人带回来。原来的框架里，问题是“机器能不能完成这件事”。问题开始转向“信息怎样被组织，才经得起噪声、错误和人的使用”。问题变准以后，现场开始让符号、通道、规则和恢复路径被一起检查。原来的问法退后时，工具问题变成了信息结构问题。",
    "knowledgePointZh": "关键转向：信息可以先被拆成可计量的选择，再讨论它怎样穿过噪声、编码和通道抵达另一端。",
    "reflectionQuestionZh": "当一条消息穿过噪声抵达你面前，中间有多少不可见的设计在保护它？"
  },
  "070-wobbly-shelf-repair": {
    "titleZh": "铁桥、隧道和一艘大船",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪英国，一个年轻工程师站在泥泞河岸、铁路工地和造船厂之间，面对的从来不是单一难题。",
    "storyBodyZh": "按普通做法，先被拿出来的解释是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它看起来可靠，是因为让想法先落地，也让团队知道要朝哪个形状努力。偏偏有一处细节不肯归入原来的说法：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。原来的框架在这里开始松动：材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。刚开始的问题是“能不能把它做出来”。更锋利的问题出现了“怎样让它在材料、使用和风险面前长期站得住”。到这里，最重要的不是结论，而是图纸、现场和测试结果互相校正。新的方法出现时，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个宏大工程背后，最难的到底是想象力，还是把想象放进材料和风险里？"
  },
  "080-community-garden-seedlings": {
    "titleZh": "麦田里的矮秆",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "20 世纪中期的墨西哥试验田里，一个植物病理学家弯腰查看小麦，关心的是茎秆为什么会倒伏。",
    "storyBodyZh": "照旧处理时，眼前最方便的处理方式是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它给了现场一个入口：回应眼前的饥饿、收入和供应压力。这时，一个小小的不匹配把问题往前推：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。麻烦不是原来的做法全错：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。原先的问题是“怎样马上得到更多产出”。真正需要回答的变成“哪些生命条件会让结果持续变好或变坏”。这个改变先带来的，是让地块、动物、天气和人的决定被放在同一条时间线上。现场的意义变成：照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "当一种作物救了很多人，它的生态和社会代价也应该怎样被认真看见？"
  },
  "090-medicine-schedule-care": {
    "titleZh": "斑疹伤寒为什么也是社会问题",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "1848 年的上西里西亚，一位年轻医生被派去调查斑疹伤寒疫情，却很快发现病床之外的问题更大。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它能被接受，是因为让紧急状况先被处理，也能让照护有明确入口，原来的做法刚要收口，新的证据就露出缝隙：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。这个细节把原来的问题拉长了：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。最容易先问的是“这个症状或需求该怎么处理”。问题不再停在原处，而是变成“怎样在风险、证据和人的生活之间作出可靠照护”。等材料被这样处理后，记录、身体反应和人的处境被一起看见。那一刻之后，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：照护不是把人缩成症状，而是在身体风险、生活条件、制度支持和尊严之间寻找可持续的安排。",
    "reflectionQuestionZh": "当一种疾病反复出现，你会只找药，还是也去看病人回到什么样的生活里？"
  },
  "100-rainy-event-service-desk": {
    "titleZh": "真相时刻在登机口",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "20 世纪 80 年代的斯堪的纳维亚航空，一名乘客在柜台前等待，真正评价公司的时刻可能只有几十秒。",
    "storyBodyZh": "先把混乱收住时，人们往往先这样处理：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它能先让人行动，因为让工作先被分配，也让现场不至于失去秩序。可眼前的细节开始把问题推回来：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。原来的解释可以开头，却不能收尾：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。最初被抓住的问题是“这项服务有没有做完”。新的压力把问题改成“整条路径怎样让人安全、清楚并被看见”。新的问法让前台、后台、空间和人的感受被画到同一条路径上。再看同一件事时，一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：好的服务把流程、空间、信息、权限和人的感受连成一条可走的路径。",
    "reflectionQuestionZh": "一个服务真正被评价的瞬间，是广告出现时，还是问题需要被解决时？"
  },
  "001-birkbeck-evening-lecture": {
    "titleZh": "下工后的力学课",
    "summaryZh": "一个入门现场让学习先从问题、同伴和练习开始。",
    "sceneZh": "1799 年前后的格拉斯哥，一位教师注意到：白天真正使用工具的人，常常被挡在讲解科学的房间外面。",
    "storyBodyZh": "先把事情收进一个格子里，确实能带来秩序：把这些练习当成进入正式道路前的零散准备：会读一点、会说一点、会做一点，就算够用。它的短处不在一开始，正因为门槛低，任何人都能先坐下来试一试。但眼前的材料没有顺着这个解释走：有人带着真实问题进来，却不知道该从哪一扇门开始；单靠课程表，接不住这种犹豫。事情没有停在原来的入口：问题在于，读、问、表达和互助之间的连接会被当成个人运气。如果把不合适的部分剪掉，故事会顺滑，却不会变聪明。接下来的动作很朴素：先把问题写在纸边，再让不同经验的人轮流补充，又把书、练习、工具和同伴反馈放在一起核对。现场没有立刻变清楚，但原来的问题已经站不稳。记录之间开始出现可以追问的缝：一句话要看它有没有让别人接上，一本书要看它是否把问题带回行动。一开始的问题是“先学哪一门内容”。这些材料把问题推向“怎样先练出读、问、表达和共同判断的能力”。它没有把答案一下子交出来，却让纸页、练习和彼此的回应连在一起。这让人开始承认：那些小练习开始像一座入口，而不是一张等待盖章的清单。",
    "knowledgePointZh": "关键转向：人在进入具体道路前，先练习怎样读、问、表达和共同判断。",
    "reflectionQuestionZh": "你身边谁已经有真实经验，却仍然需要进入正式知识的第一阶台阶？"
  },
  "002-braille-raised-dots": {
    "titleZh": "指尖下的六个凸点",
    "summaryZh": "一个入门现场让学习先从问题、同伴和练习开始。",
    "sceneZh": "1810 年代的法国乡村和巴黎学校之间，一个失明少年摸着厚重凸字书，发现读写仍被别人控制。",
    "storyBodyZh": "在第一层问题里，当时更顺手的做法是：把这些练习当成进入正式道路前的零散准备：会读一点、会说一点、会做一点，就算够用。它至少做到了一点：门槛低，任何人都能先坐下来试一试。偏偏有一处细节不肯归入原来的说法：有人带着真实问题进来，却不知道该从哪一扇门开始；单靠课程表，接不住这种犹豫。原来的做法开始漏掉关键部分：问题在于，读、问、表达和互助之间的连接会被当成个人运气。如果只保留已经会说的话，新的问法就没有地方长出来。真正有用的是这些慢动作：先把问题写在纸边，再让不同经验的人轮流补充，又把书、练习、工具和同伴反馈放在一起核对。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一句话要看它有没有让别人接上，一本书要看它是否把问题带回行动。最先出现的问题是“先学哪一门内容”。这几步把问题改写成“怎样先练出读、问、表达和共同判断的能力”。变化不是突然完成的，但它已经让纸页、练习和彼此的回应连在一起。最后留下的是：那些小练习开始像一座入口，而不是一张等待盖章的清单。",
    "knowledgePointZh": "关键转向：人在进入具体道路前，先练习怎样读、问、表达和共同判断。",
    "reflectionQuestionZh": "当一种工具让人不必请求别人就能阅读时，哪一种自由已经悄悄出现了？"
  },
  "003-carnegie-speaking-class": {
    "titleZh": "害怕站到众人面前的推销员",
    "summaryZh": "一个入门现场让学习先从问题、同伴和练习开始。",
    "sceneZh": "20 世纪初的纽约，一个从乡村背景走出来的年轻人发现，很多成年人不是败在没有知识，而是败在必须开口的那一刻。",
    "storyBodyZh": "旁人最容易先问的是：把这些练习当成进入正式道路前的零散准备：会读一点、会说一点、会做一点，就算够用。它保留了一种秩序：门槛低，任何人都能先坐下来试一试。这时，一个小小的不匹配把问题往前推：有人带着真实问题进来，却不知道该从哪一扇门开始；单靠课程表，接不住这种犹豫。这个不匹配让人慢下来：问题在于，读、问、表达和互助之间的连接会被当成个人运气。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先把问题写在纸边，再让不同经验的人轮流补充，又把书、练习、工具和同伴反馈放在一起核对。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一句话要看它有没有让别人接上，一本书要看它是否把问题带回行动。原来的解释保护的问题是“先学哪一门内容”。现场让人不得不改问“怎样先练出读、问、表达和共同判断的能力”。到这里，新的问法不是口号，而是被材料逼出来的下一步。答案还没有封口，材料已经让纸页、练习和彼此的回应连在一起。由此，那些小练习开始像一座入口，而不是一张等待盖章的清单。",
    "knowledgePointZh": "关键转向：人在进入具体道路前，先练习怎样读、问、表达和共同判断。",
    "reflectionQuestionZh": "你生活里的哪一种能力，如果每周被温和地公开练习，会最快发生变化？"
  },
  "009-brownsea-scout-camp": {
    "titleZh": "没有上课铃的小岛",
    "summaryZh": "一个入门现场让学习先从问题、同伴和练习开始。",
    "sceneZh": "1907 年 8 月，来自不同社会背景的男孩来到 Brownsea Island，露营、做饭、观察、打信号、做游戏，并以小队方式学习。",
    "storyBodyZh": "现场最先给出的办法是：把这些练习当成进入正式道路前的零散准备：会读一点、会说一点、会做一点，就算够用。它让判断先有落点：门槛低，任何人都能先坐下来试一试，原来的做法刚要收口，新的证据就露出缝隙：有人带着真实问题进来，却不知道该从哪一扇门开始；单靠课程表，接不住这种犹豫。这套办法越有效，边界也越清楚：问题在于，读、问、表达和互助之间的连接会被当成个人运气。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先把问题写在纸边，再让不同经验的人轮流补充，又把书、练习、工具和同伴反馈放在一起核对。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一句话要看它有没有让别人接上，一本书要看它是否把问题带回行动。还没转向前，人们问的是“先学哪一门内容”。原来的问法被迫让出位置给“怎样先练出读、问、表达和共同判断的能力”。这一步没有结束争论，却让纸页、练习和彼此的回应连在一起。慢慢地，那些小练习开始像一座入口，而不是一张等待盖章的清单。",
    "knowledgePointZh": "关键转向：人在进入具体道路前，先练习怎样读、问、表达和共同判断。",
    "reflectionQuestionZh": "当每一节课都必须属于一个整齐学科时，哪一种重要生活能力反而更难学习？"
  },
  "018-reggio-emilia-school": {
    "titleZh": "废墟旁边重新搭起的学校",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "第二次世界大战后，Reggio Emilia 附近的一群家长想先给孩子建一所学校，哪怕他们还没有一个完整的学校系统。",
    "storyBodyZh": "人们先抓住的办法是：把学习看成教师按顺序交付内容，学生把答案带走。它不是随便来的，因为让课堂有秩序，也方便检查进度。可眼前的细节开始把问题推回来：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。一旦继续看下去，问题就变了：问题在于，学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。第一眼的问题是“这一课教完了吗”。接下来能继续工作的问法是“什么样的情境会让学习者自己把经验和知识接起来”。原来的问题仍有用，新的问法让判断多了一层检查。新的理解先从这里长出来：活动、记录和追问被放回同一张桌上。更稳的判断是：课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "如果一个孩子不只用一种语言思考，哪些学科需要站在旁边，才能真正听见他？"
  },
  "021-bauhaus-workshop": {
    "titleZh": "战后工坊里的新学校",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "第一次世界大战后，魏玛的一位年轻建筑师面对的是一个分裂的世界：一边是纯艺术，一边是手工和工业。",
    "storyBodyZh": "一开始能用的办法是：按作者、年代、风格和流派把作品、文本或物件放进格子。它先帮人抓住了边界：防止观看完全散掉，也给初学者一条进入作品的路。但眼前的材料没有顺着这个解释走：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。现场没有接受太快的收束：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原本的问题是“它属于哪一种作品或传统”。被证据推出来的问题是“它把哪些记忆、材料和观看方式带到了现在”。问题变准以后，现场开始让相隔很远的物件被放到同一条视线上。真正被打开的是：分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "你身边哪一个物件，如果制作者同时像艺术家和工匠一样思考，会变得不一样？"
  },
  "022-petrarch-mountain-letter": {
    "titleZh": "为了一眼风景爬上山的人",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1336 年 4 月 26 日，一位诗人和兄弟登上 Mont Ventoux，不是因为路必须经过那里，而是因为他想从高处看一眼世界。",
    "storyBodyZh": "人们先抓住的办法是：按作者、年代、风格和流派把作品、文本或物件放进格子。它让旁人能跟上，因为防止观看完全散掉，也给初学者一条进入作品的路。偏偏有一处细节不肯归入原来的说法：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。差异没有被原来的做法完全收住：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原来的做法留下的问题是“它属于哪一种作品或传统”。这时更重要的问题变成“它把哪些记忆、材料和观看方式带到了现在”。到这里，最重要的不是结论，而是相隔很远的物件被放到同一条视线上。从这个动作往后，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "哪一本旧书、哪一个地点或哪段记忆，可能因为让你从高处看见自己，而改变你？"
  },
  "023-rosetta-cartouche": {
    "titleZh": "王名外面的椭圆框",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "19 世纪的法国，一个热爱语言的少年在政治动荡中长大，还没有稳定事业时，就已经在抄写文字、寻找不同文字之间的模式。",
    "storyBodyZh": "那时最稳妥的入口是：按作者、年代、风格和流派把作品、文本或物件放进格子。它能先压住混乱，因为防止观看完全散掉，也给初学者一条进入作品的路。这时，一个小小的不匹配把问题往前推：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。证据开始要求更多耐心：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。最初的入口是“它属于哪一种作品或传统”。原来的解释无法收住的问题是“它把哪些记忆、材料和观看方式带到了现在”。这个改变先带来的，是让相隔很远的物件被放到同一条视线上。问题换形以后，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "当石头上的符号不再只是装饰，而变成一句话，世界会怎样改变？"
  },
  "028-black-mountain-studio": {
    "titleZh": "没有整齐边界的学院",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1933 年，Bauhaus 在德国被关闭后，一位教师和妻子带着行李、工坊教学习惯和一种不愿把艺术同生活分开的信念，来到北卡罗来纳。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：按作者、年代、风格和流派把作品、文本或物件放进格子。它的合理性在于防止观看完全散掉，也给初学者一条进入作品的路，原来的做法刚要收口，新的证据就露出缝隙：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。原来的整理方式开始失去弹性：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原来的问题是“它属于哪一种作品或传统”。最后能带着人继续走的问题是“它把哪些记忆、材料和观看方式带到了现在”。等材料被这样处理后，相隔很远的物件被放到同一条视线上。最后，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "如果课堂同时包含工具、书、饭桌、争论和表演，你会以什么不同方式学习？"
  },
  "029-lomax-field-recorder": {
    "titleZh": "后备箱里的沉重录音机",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "20 世纪三四十年代，一个年轻采集者带着沉重到足以改变整趟行程的录音设备，开车穿过很长的路。",
    "storyBodyZh": "起初，最容易被采用的入口是：按作者、年代、风格和流派把作品、文本或物件放进格子。它的好处是防止观看完全散掉，也给初学者一条进入作品的路。可眼前的细节开始把问题推回来：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。它的边界也在这里显出来：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。最早的问题是“它属于哪一种作品或传统”。问题慢慢变成“它把哪些记忆、材料和观看方式带到了现在”。新的问法让相隔很远的物件被放到同一条视线上。从这里开始，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "你身边谁的声音，如果没人先把它当作文化来对待，可能还没出名就消失？"
  },
  "031-bus-stop-price": {
    "titleZh": "王朝为什么会衰弱",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "14 世纪北非，一个年轻官员在宫廷、部落营地和监狱之间辗转，亲眼看见权力如何上升又崩塌。",
    "storyBodyZh": "最初，现场最先出现的判断是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。这套办法有用，因为快速形成判断，也让复杂争论先有一个入口。但眼前的材料没有顺着这个解释走：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。问题也在这里露出来：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原来的问题是“谁的说法对”。新的问法逐渐清楚“什么证据能让被分散的生活进入公共讨论”。问题在这里变得明确：接下来必须顺着证据继续查。它没有把答案一下子交出来，却让记录、位置和人的声音被一起比较。这层停顿让后面的判断多了一点重量。于是，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "当一个团队变弱时，你会只责怪个人，还是追问共同体的结构发生了什么？"
  },
  "032-rumor-before-the-storm": {
    "titleZh": "世界知识的抽屉",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "19 世纪末的布鲁塞尔，一个年轻律师坐在堆满纸卡片的房间里，想象全世界的知识都能被找到。",
    "storyBodyZh": "刚进入现场时，很多人会先这么做：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它并不是空想，原因在于快速形成判断，也让复杂争论先有一个入口。偏偏有一处细节不肯归入原来的说法：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。这套做法开始显出边界：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。第一层问题是“谁的说法对”。问题被推向另一句更难的话“什么证据能让被分散的生活进入公共讨论”。原来的问题没有消失，但新的问法已经改变了下一步该看哪里。变化不是突然完成的，但它已经让记录、位置和人的声音被一起比较。到这一步，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "如果一条重要信息无法被找到，它还算真正进入公共生活了吗？"
  },
  "038-community-data-project": {
    "titleZh": "水泵周围的黑点",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "1854 年伦敦 Soho 的街道上，霍乱病例不断增加，一位医生拿着地址和地图追踪死亡的位置。",
    "storyBodyZh": "在最早的判断里，一开始能撑住局面的办法是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它能先撑住局面，因为快速形成判断，也让复杂争论先有一个入口。这时，一个小小的不匹配把问题往前推：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。原来的解释在这里变窄：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原来的问法是“谁的说法对”。后来真正留下来的问题是“什么证据能让被分散的生活进入公共讨论”。到这里，新的问法不是口号，而是被材料逼出来的下一步。答案还没有封口，材料已经让记录、位置和人的声音被一起比较。后来再回看，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "一个公共问题什么时候需要地图、访谈和行动同时出现？"
  },
  "039-unusual-community-signal": {
    "titleZh": "渔民为什么没有把湖耗尽",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "20 世纪后半叶，一个研究者读到许多关于森林、灌溉渠和渔场的案例，发现它们并不总按课本预言崩坏。",
    "storyBodyZh": "事情刚被记录下来时，先被拿出来的解释是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。这种办法的价值在于快速形成判断，也让复杂争论先有一个入口。原来的做法刚要收口，新的证据就露出缝隙：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。原来的做法到这里不够用了：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。一开始能说出口的问题是“谁的说法对”。这时，问题换了形状“什么证据能让被分散的生活进入公共讨论”。新的问法让人不能只带着原来的解释离开现场。这一步没有结束争论，却让记录、位置和人的声音被一起比较。真正留下来的变化是：公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "你身边哪一套非正式规则，其实比外人想象得更精密？"
  },
  "041-cafe-closing-sheet": {
    "titleZh": "公司不是一台机器",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "20 世纪中期，一个年轻管理思想者走进大型汽车公司，发现真正难的不是画组织图，而是理解组织为什么行动。",
    "storyBodyZh": "第一眼看过去，眼前最方便的处理方式是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它先解决了一个问题：让人先做决定，也能把责任表面上固定下来。可眼前的细节开始把问题推回来：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。真正的卡点从这里出现：责任、风险、激励、权利和后果会被推给后来承受的人。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。起初，人们问“哪一种选择最划算”。问题继续往前推“哪些责任、风险和规则必须先被摆到桌面上”。这让材料继续抵抗原来的解释，也让后面的判断更稳。新的理解先从这里长出来：账本、合同和人的后果被放在一起读。这以后，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "一个组织如果只追效率，却说不清自己的责任，会在哪些地方开始失灵？"
  },
  "042-bicycle-deposit": {
    "titleZh": "学生第一次听懂普通法",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "18 世纪的牛津，一个年轻律师面对学生，试着把复杂的普通法讲成一套有次序的课程。",
    "storyBodyZh": "按当时的习惯，人们往往先这样处理：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它让人不至于完全乱掉，因为让人先做决定，也能把责任表面上固定下来。但眼前的材料没有顺着这个解释走：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。现场把原来的做法推到边缘：责任、风险、激励、权利和后果会被推给后来承受的人。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。原来的框架里，问题是“哪一种选择最划算”。问题开始转向“哪些责任、风险和规则必须先被摆到桌面上”。问题变准以后，现场开始让账本、合同和人的后果被放在一起读。它让问题的形状更清楚，也让后面的理解更稳。原来的问法退后时，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "如果规则只被少数专业人士听懂，普通人还怎样保护自己的权利？"
  },
  "048-pop-up-market-rules": {
    "titleZh": "一份关于便宜保险的报告",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "20 世纪初的波士顿，一个律师听见工薪家庭买不起可靠保险，也看见金融公司如何利用信息不对称。",
    "storyBodyZh": "按普通做法，当时更顺手的做法是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它看起来可靠，是因为让人先做决定，也能把责任表面上固定下来。偏偏有一处细节不肯归入原来的说法：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。原来的框架在这里开始松动：责任、风险、激励、权利和后果会被推给后来承受的人。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。刚开始的问题是“哪一种选择最划算”。更锋利的问题出现了“哪些责任、风险和规则必须先被摆到桌面上”。这时，新的问法把注意力从结论拉回证据。到这里，最重要的不是结论，而是账本、合同和人的后果被放在一起读。新的方法出现时，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "当一种产品太复杂，普通人无法判断风险时，法律和管理应该怎样介入？"
  },
  "049-strange-side-business": {
    "titleZh": "小店里的再装瓶",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "1970 年代英国海边小城，一个女性创业者开了一家小店，顾客拿着空瓶回来重新灌装。",
    "storyBodyZh": "照旧处理时，最容易被采用的入口是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它给了现场一个入口：让人先做决定，也能把责任表面上固定下来。这时，一个小小的不匹配把问题往前推：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。麻烦不是原来的做法全错：责任、风险、激励、权利和后果会被推给后来承受的人。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。原先的问题是“哪一种选择最划算”。真正需要回答的变成“哪些责任、风险和规则必须先被摆到桌面上”。这个改变先带来的，是让账本、合同和人的后果被放在一起读。这层停顿让后面的判断多了一点重量。现场的意义变成：选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "当一个品牌说自己有价值立场时，你会看广告语，还是看它怎样组织供应链和责任？"
  },
  "051-yogurt-on-the-counter": {
    "titleZh": "小岛上的鸟嘴",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "1830 年代，一位年轻博物学者在船上晕船、采集标本，也在岛屿之间注意到鸟、龟和植物的细微差异。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：把现象先命名、分类或记成单个结果。它能被接受，是因为让观察不至于散乱，也能让别人知道你正在看什么，原来的做法刚要收口，新的证据就露出缝隙：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。这个细节把原来的问题拉长了：数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。最容易先问的是“这个现象叫什么”。问题不再停在原处，而是变成“它在什么条件、尺度和重复模式下出现或改变”。等材料被这样处理后，数字、位置和形状被放进同一张可检查的图里。那一刻之后，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：生命要在尺度、遗传、环境和行为的关系里被理解，而不只是被命名。",
    "reflectionQuestionZh": "当你看到两个相似生命的细微差别时，你会把它当偶然，还是当成环境留下的线索？"
  },
  "052-stream-after-rain": {
    "titleZh": "春天为什么安静了",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "20 世纪中期的美国，一个海洋生物学家收到越来越多来信：鸟少了，鱼死了，喷洒后的土地不对劲。",
    "storyBodyZh": "先把混乱收住时，现场最先出现的判断是：把现象先命名、分类或记成单个结果。它能先让人行动，因为让观察不至于散乱，也能让别人知道你正在看什么。可眼前的细节开始把问题推回来：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。原来的解释可以开头，却不能收尾：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。最初被抓住的问题是“这个现象叫什么”。新的压力把问题改成“它在什么条件、尺度和重复模式下出现或改变”。新的问法让数字、位置和形状被放进同一张可检查的图里。再看同一件事时，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：环境问题常常沿着水、土、空气、食物链和制度一起移动，不能只在一个点上处理。",
    "reflectionQuestionZh": "一种技术解决了眼前问题以后，你会不会继续追问它去了哪里？"
  },
  "053-kitchen-ice-and-steam": {
    "titleZh": "斜面上的小球",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "17 世纪意大利，一个教师让小球沿斜面滚下，用水钟和刻度记录它怎样加速。",
    "storyBodyZh": "先把事情收进一个格子里，确实能带来秩序：把现象先命名、分类或记成单个结果。它的短处不在一开始，正因为让观察不至于散乱，也能让别人知道你正在看什么。但眼前的材料没有顺着这个解释走：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。事情没有停在原来的入口：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果把不合适的部分剪掉，故事会顺滑，却不会变聪明。接下来的动作很朴素：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。现场没有立刻变清楚，但原来的问题已经站不稳。记录之间开始出现可以追问的缝：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。一开始的问题是“这个现象叫什么”。这些材料把问题推向“它在什么条件、尺度和重复模式下出现或改变”。它没有把答案一下子交出来，却让数字、位置和形状被放进同一张可检查的图里。这让人开始承认：好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：物质、运动和地球变化需要实验、测量和模型一起逼近，而不是只靠直觉争论。",
    "reflectionQuestionZh": "当一个现象太快看不清时，你能不能设计一种方法让它慢下来回答你？"
  },
  "054-shared-bill-pattern": {
    "titleZh": "算术书里的陌生数字",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "9 世纪的巴格达，一个学者在智慧宫附近整理印度数字、方程和实际计算问题。",
    "storyBodyZh": "在第一层问题里，很多人会先这么做：把现象先命名、分类或记成单个结果。它至少做到了一点：让观察不至于散乱，也能让别人知道你正在看什么。偏偏有一处细节不肯归入原来的说法：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。原来的做法开始漏掉关键部分：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果只保留已经会说的话，新的问法就没有地方长出来。它让人看见，真正有用的是这些慢动作：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。最先出现的问题是“这个现象叫什么”。这几步把问题改写成“它在什么条件、尺度和重复模式下出现或改变”。变化不是突然完成的，但它已经让数字、位置和形状被放进同一张可检查的图里。最后留下的是：好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：数量和数据最有用的地方，是让关系、偏差、不确定性和推理路径被看见。",
    "reflectionQuestionZh": "一种更好的符号，怎样让原本困难的问题开始被更多人共同解决？"
  },
  "058-school-air-quality": {
    "titleZh": "星星亮度里的尺子",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "20 世纪初的哈佛天文台，一位女性计算员坐在成排玻璃底片前，逐颗比较变星的亮度。",
    "storyBodyZh": "旁人最容易先问的是：把现象先命名、分类或记成单个结果。它保留了一种秩序：让观察不至于散乱，也能让别人知道你正在看什么。这时，一个小小的不匹配把问题往前推：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。这个不匹配让人慢下来：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。原来的解释保护的问题是“这个现象叫什么”。现场让人不得不改问“它在什么条件、尺度和重复模式下出现或改变”。答案还没有封口，材料已经让数字、位置和形状被放进同一张可检查的图里。由此，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：观察、模型和数据推断需要彼此校正，单独一个记录还不能自动成为尺度。",
    "reflectionQuestionZh": "一张照片底片里的小点，怎样可能变成测量宇宙的尺子？"
  },
  "059-mystery-stain": {
    "titleZh": "海岸线到底有多长",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "20 世纪中期，一个数学家盯着地图上的海岸线，发现尺子越短，量出的长度越长。",
    "storyBodyZh": "现场最先给出的办法是：把现象先命名、分类或记成单个结果。它让判断先有落点：让观察不至于散乱，也能让别人知道你正在看什么，原来的做法刚要收口，新的证据就露出缝隙：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。这套办法越有效，边界也越清楚：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。还没转向前，人们问的是“这个现象叫什么”。原来的问法被迫让出位置给“它在什么条件、尺度和重复模式下出现或改变”。这一步没有结束争论，却让数字、位置和形状被放进同一张可检查的图里。慢慢地，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：有些现象先打破分类，后来才逼出新的模型、尺度和语言。",
    "reflectionQuestionZh": "如果一个东西越仔细看越复杂，你会把它当噪声，还是当成需要新数学的信号？"
  },
  "068-repairing-the-club-website": {
    "titleZh": "防空炮为什么总慢半拍",
    "summaryZh": "一个机器现场让信息的表示、通道和错误变得可见。",
    "sceneZh": "第二次世界大战期间，一位数学家研究防空炮如何预测飞机位置，发现机器必须根据误差不断修正自己。",
    "storyBodyZh": "人们先抓住的办法是：把机器或工具看成完成任务的黑箱：能算、能传、能存，就算有用。它不是随便来的，因为让人先使用系统，不必一开始就拆开所有内部结构。可眼前的细节开始把问题推回来：噪声、重复、错误或数据混乱一出现，单靠更快的机器并不能让结果可靠。一旦继续看下去，问题就变了：问题在于，信息怎样被表示、传输、组织、恢复，以及人在失败时怎样找回路径，会被藏在界面后面。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先把输入和输出分开检查，再标出错误出现的位置，又重新设计编码、结构、通道或恢复步骤。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一个输入要看它怎样被编码，一个错误要看系统能否把人带回来。第一眼的问题是“机器能不能完成这件事”。接下来能继续工作的问法是“信息怎样被组织，才经得起噪声、错误和人的使用”。新的理解先从这里长出来：符号、通道、规则和恢复路径被一起检查。更稳的判断是：工具问题变成了信息结构问题。",
    "knowledgePointZh": "关键转向：控制、通信和计算连接在一起时，关键不只是执行命令，而是根据反馈修正行动。",
    "reflectionQuestionZh": "一个系统能学习修正自己之前，必须先听见哪一种反馈？"
  },
  "071-flickering-hall-light": {
    "titleZh": "屋顶为什么不能只靠图纸漂亮",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "20 世纪的悉尼，一座歌剧院的壳形屋顶让建筑师、政府和工程团队都陷入难题。",
    "storyBodyZh": "一开始能用的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它先帮人抓住了边界：让想法先落地，也让团队知道要朝哪个形状努力。但眼前的材料没有顺着这个解释走：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。现场没有接受太快的收束：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原本的问题是“能不能把它做出来”。被证据推出来的问题是“怎样让它在材料、使用和风险面前长期站得住”。问题变准以后，现场开始让图纸、现场和测试结果互相校正。它让人看见，真正被打开的是：想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "当一个想法看起来很美，你会从哪里开始判断它能不能被建成？"
  },
  "072-soup-that-travels": {
    "titleZh": "汽车底盘自己走过来",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "1913 年的底特律工厂里，汽车底盘不再静静等工人围上来，而是沿着线缓慢移动。",
    "storyBodyZh": "人们先抓住的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它让旁人能跟上，因为让想法先落地，也让团队知道要朝哪个形状努力。偏偏有一处细节不肯归入原来的说法：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。差异没有被原来的做法完全收住：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原来的解释没有消失，但已经不能替所有证据说话。原来的做法留下的问题是“能不能把它做出来”。这时更重要的问题变成“怎样让它在材料、使用和风险面前长期站得住”。到这里，最重要的不是结论，而是图纸、现场和测试结果互相校正。从这个动作往后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "当一件商品变得便宜，是谁的时间、动作和自由被重新安排了？"
  },
  "073-crosswalk-at-school": {
    "titleZh": "建筑必须站得住、用得上、看得动人",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "古罗马时期，一个建筑师和工程师回顾神庙、水道、机械和城市空间，试图把建造经验写给后来的人。",
    "storyBodyZh": "那时最稳妥的入口是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它能先压住混乱，因为让想法先落地，也让团队知道要朝哪个形状努力。这时，一个小小的不匹配把问题往前推：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。证据开始要求更多耐心：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最初的入口是“能不能把它做出来”。原来的解释无法收住的问题是“怎样让它在材料、使用和风险面前长期站得住”。这个改变先带来的，是让图纸、现场和测试结果互相校正。这让证据继续发力，而不是被原来的解释盖住。问题换形以后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一座建筑如果只好看，却不好用或不安全，它还算真正完成了吗？"
  },
  "078-community-kitchen-build": {
    "titleZh": "一个圆顶能不能少用材料",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "20 世纪美国，一个总爱画结构线和地图的人，反复问怎样用更少材料覆盖更大空间。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它的合理性在于让想法先落地，也让团队知道要朝哪个形状努力，原来的做法刚要收口，新的证据就露出缝隙：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。原来的整理方式开始失去弹性：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原来的问题是“能不能把它做出来”。最后能带着人继续走的问题是“怎样让它在材料、使用和风险面前长期站得住”。等材料被这样处理后，图纸、现场和测试结果互相校正。原来的做法仍有价值，只是不能再假装完整。最后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个结构如果更轻、更省，是否也必须更认真回答它怎样被人使用？"
  },
  "079-unusual-repair-material": {
    "titleZh": "臭味背后的城市系统",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "1858 年伦敦夏天，泰晤士河臭气冲进议会，城市终于无法继续假装污水问题只是气味问题。",
    "storyBodyZh": "起初，一开始能撑住局面的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它的好处是让想法先落地，也让团队知道要朝哪个形状努力。可眼前的细节开始把问题推回来：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。它的边界也在这里显出来：材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最早的问题是“能不能把它做出来”。问题慢慢变成“怎样让它在材料、使用和风险面前长期站得住”。这个补上的细节不大，却让下一步不能再照旧走。新的问法把图纸、现场和测试结果互相校正。从这里开始，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个城市最重要的工程，为什么常常是在你闻不到、看不见时才算成功？"
  },
  "081-balcony-tomato-plan": {
    "titleZh": "种子不再随手撒出去",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "18 世纪英国农田里，一个农场主看见种子被随手撒开，很多被鸟吃掉，很多落在不合适的深度。",
    "storyBodyZh": "最初，先被拿出来的解释是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。这套办法有用，因为回应眼前的饥饿、收入和供应压力。但眼前的材料没有顺着这个解释走：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。问题也在这里露出来：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。原来的问题是“怎样马上得到更多产出”。新的问法逐渐清楚“哪些生命条件会让结果持续变好或变坏”。它没有把答案一下子交出来，却让地块、动物、天气和人的决定被放在同一条时间线上。于是，照料变成了对生命系统的长期判断。。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "一个种子能否发芽，取决于运气，还是取决于人怎样安排它进入土地？"
  },
  "082-fallen-branch-trail": {
    "titleZh": "森林不能只按木材计算",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "19 世纪末的美国，一个年轻人到欧洲学习林学后回国，看到大片森林被短期砍伐逻辑支配。",
    "storyBodyZh": "刚进入现场时，眼前最方便的处理方式是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它并不是空想，原因在于回应眼前的饥饿、收入和供应压力。偏偏有一处细节不肯归入原来的说法：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。这套做法开始显出边界：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。第一层问题是“怎样马上得到更多产出”。问题被推向另一句更难的话“哪些生命条件会让结果持续变好或变坏”。变化不是突然完成的，但它已经让地块、动物、天气和人的决定被放在同一条时间线上。到这一步，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "如果一片森林的生命超过几代人，谁有资格替它做短期决定？"
  },
  "083-fish-market-morning": {
    "titleZh": "每一代人都以为海一直这么空",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "20 世纪后期，一个研究鱼类的人听到年轻渔民说收获还算正常，却在旧记录里看到完全不同的海。",
    "storyBodyZh": "在最早的判断里，人们往往先这样处理：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它能先撑住局面，因为回应眼前的饥饿、收入和供应压力。这时，一个小小的不匹配把问题往前推：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。原来的解释在这里变窄：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。原来的问法是“怎样马上得到更多产出”。后来真正留下来的问题是“哪些生命条件会让结果持续变好或变坏”。答案还没有封口，材料已经让地块、动物、天气和人的决定被放在同一条时间线上。后来再回看，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "你以为正常的自然状态，会不会其实已经是上一代衰退后的结果？"
  },
  "084-dog-that-stopped-eating": {
    "titleZh": "第一所兽医学校的病马",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "18 世纪法国，牛马疫病不断造成损失，一个关心马术和动物疾病的人看见农业和军队都被牵动。",
    "storyBodyZh": "事情刚被记录下来时，当时更顺手的做法是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。这种办法的价值在于回应眼前的饥饿、收入和供应压力。原来的做法刚要收口，新的证据就露出缝隙：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。原来的做法到这里不够用了：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。一开始能说出口的问题是“怎样马上得到更多产出”。这时，问题换了形状“哪些生命条件会让结果持续变好或变坏”。这一步没有结束争论，却让地块、动物、天气和人的决定被放在同一条时间线上。真正留下来的变化是：照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "当一头动物生病时，影响的只是它自己，还是整个食物和生活系统？"
  },
  "088-farm-visit-class": {
    "titleZh": "她看见牛害怕的影子",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "20 世纪后期的牧场和屠宰场里，一个年轻女性站在牲畜通道旁，注意到牛会被反光、阴影和突然的转角吓住。",
    "storyBodyZh": "第一眼看过去，最容易被采用的入口是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它先解决了一个问题：回应眼前的饥饿、收入和供应压力。可眼前的细节开始把问题推回来：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。真正的卡点从这里出现：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。起初，人们问“怎样马上得到更多产出”。问题继续往前推“哪些生命条件会让结果持续变好或变坏”。这让材料继续抵抗原来的解释，也让后面的判断更稳。新的理解先从这里长出来：地块、动物、天气和人的决定被放在同一条时间线上。这以后，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "如果从动物的视角重新看一条通道，人类的效率会不会也必须重新定义？"
  },
  "089-unusual-animal-garden": {
    "titleZh": "冰山里的种子库",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "21 世纪初的挪威斯瓦尔巴群岛，一群人把来自世界各地的种子样本送进冻土山体里的库房。",
    "storyBodyZh": "按当时的习惯，现场最先出现的判断是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它让人不至于完全乱掉，因为回应眼前的饥饿、收入和供应压力。但眼前的材料没有顺着这个解释走：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。现场把原来的做法推到边缘：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。原来的框架里，问题是“怎样马上得到更多产出”。问题开始转向“哪些生命条件会让结果持续变好或变坏”。问题变准以后，现场开始让地块、动物、天气和人的决定被放在同一条时间线上。原来的问法退后时，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "为未来保存一粒种子，究竟是在保存食物，还是保存选择权？"
  },
  "091-cough-in-the-waiting-room": {
    "titleZh": "病床旁边的观察",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "古希腊的岛屿和城邦之间，一位医生走近发热、疼痛和呼吸困难的病人，先看他们实际怎样变化。",
    "storyBodyZh": "按普通做法，很多人会先这么做：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它看起来可靠，是因为让紧急状况先被处理，也能让照护有明确入口。偏偏有一处细节不肯归入原来的说法：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。原来的框架在这里开始松动：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。刚开始的问题是“这个症状或需求该怎么处理”。更锋利的问题出现了“怎样在风险、证据和人的生活之间作出可靠照护”。这时，新的问法把注意力从结论拉回证据。到这里，最重要的不是结论，而是记录、身体反应和人的处境被一起看见。新的方法出现时，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "当一个人说不舒服时，最负责任的第一步是解释，还是观察？"
  },
  "092-key-under-the-mat": {
    "titleZh": "从摇篮到坟墓的报告",
    "summaryZh": "一个求助现场让帮助从补缺口变成保留人的选择。",
    "sceneZh": "1942 年的英国，战争仍在继续，一个经济学家把贫困、疾病、失业和养老放进同一份报告。",
    "storyBodyZh": "照旧处理时，一开始能撑住局面的办法是：把求助看成单个困难：缺钱、缺照护、缺住处，先补上一项就好。它给了现场一个入口：让危险先降下来，也让支持尽快抵达。这时，一个小小的不匹配把问题往前推：同一个人常常同时被家庭、制度、身体和羞耻感拉住；只补一项，另一处又会断开。麻烦不是原来的做法全错：人的选择、关系和长期参与会被善意一起拿走。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先听完整条生活路径，再标出家庭、机构和资源之间的断点，又重新安排支持、边界和选择权。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一次帮助要看它接住了什么，也要看它有没有制造新的依赖。原先的问题是“这个人缺什么帮助”。真正需要回答的变成“怎样支持他，同时不夺走他的选择和位置”。这个改变先带来的，是让个人需要、家庭关系和制度入口被放到同一张图上。它把原来的解释留住，同时也让原来的解释退后一步。现场的意义变成：福利不再只是发放，而是在脆弱时刻保留人的参与。",
    "knowledgePointZh": "关键转向：福利和照护要托住脆弱时刻，同时尽量保留人的选择、尊严和参与。",
    "reflectionQuestionZh": "一个社会怎样证明它不是只在成功时承认一个人？"
  },
  "098-after-discharge-plan": {
    "titleZh": "疼痛不是最后才处理的事",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "20 世纪英国，一位曾做护士和社工、后来学医的女性，坐在临终病人床边，认真听他们说疼痛和孤独。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它能被接受，是因为让紧急状况先被处理，也能让照护有明确入口，原来的做法刚要收口，新的证据就露出缝隙：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。这个细节把原来的问题拉长了：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。最容易先问的是“这个症状或需求该怎么处理”。问题不再停在原处，而是变成“怎样在风险、证据和人的生活之间作出可靠照护”。等材料被这样处理后，记录、身体反应和人的处境被一起看见。那一刻之后，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：照护不是把人缩成症状，而是在身体风险、生活条件、制度支持和尊严之间寻找可持续的安排。",
    "reflectionQuestionZh": "当治愈不再可能时，照护还能怎样继续保护一个人的完整性？"
  },
  "099-neighborhood-listening-chair": {
    "titleZh": "她把战场护理带回和平时期",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "美国南北战争期间，一个女性在战场附近分发物资、寻找伤员，也给家属传递生死消息。",
    "storyBodyZh": "先把混乱收住时，先被拿出来的解释是：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它能先让人行动，因为让紧急状况先被处理，也能让照护有明确入口。可眼前的细节开始把问题推回来：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。原来的解释可以开头，却不能收尾：问题在于，身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。最初被抓住的问题是“这个症状或需求该怎么处理”。新的压力把问题改成“怎样在风险、证据和人的生活之间作出可靠照护”。这时，新的问法已经压过原来的解释。新的问法让记录、身体反应和人的处境被一起看见。再看同一件事时，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：照护不是把人缩成症状，而是在身体风险、生活条件、制度支持和尊严之间寻找可持续的安排。",
    "reflectionQuestionZh": "一场危机之后，怎样把临时善意变成下次能更快保护人的制度？"
  },
  "101-haircut-before-wedding": {
    "titleZh": "美容院里的红门",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "20 世纪初的纽约，一个年轻女性在美容院里学习护肤、销售和顾客沟通，发现服务身体也在服务身份。",
    "storyBodyZh": "先把事情收进一个格子里，确实能带来秩序：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它的短处不在一开始，正因为让工作先被分配，也让现场不至于失去秩序。但眼前的材料没有顺着这个解释走：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。事情没有停在原来的入口：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果把不合适的部分剪掉，故事会顺滑，却不会变聪明。接下来的动作很朴素：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。现场没有立刻变清楚，但原来的问题已经站不稳。记录之间开始出现可以追问的缝：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。一开始的问题是“这项服务有没有做完”。这些材料把问题推向“整条路径怎样让人安全、清楚并被看见”。它没有把答案一下子交出来，却让前台、后台、空间和人的感受被画到同一条路径上。这让人开始承认：一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "当一个服务直接接触身体时，它是否也在接触一个人的自我想象？"
  },
  "102-clean-hands-station": {
    "titleZh": "城市空气、污水和实验室",
    "summaryZh": "一个安全现场让风险从个人小心转向环境安排。",
    "sceneZh": "19 世纪德国城市里，人口密集、污水和传染病让医学无法只待在病床旁。",
    "storyBodyZh": "在第一层问题里，眼前最方便的处理方式是：把卫生和安全看成清理现场或提醒个人小心。它至少做到了一点：快速减少眼前混乱，也容易分配责任。偏偏有一处细节不肯归入原来的说法：垃圾、水、毒物、通道、通风或出口一旦反复出事，就说明问题不只在某个人身上。原来的做法开始漏掉关键部分：问题在于，环境、流程、材料、制度和权力关系会继续制造同样风险。如果只保留已经会说的话，新的问法就没有地方长出来。它让人看见，真正有用的是这些慢动作：先检查现场路径和暴露点，再记录事故或投诉重复出现的位置，又改变设备、流程、标识或责任安排。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一个事故要看它重复在哪里，一条规则要看它能否改变现场行为。最先出现的问题是“谁没有小心或哪里不干净”。这几步把问题改写成“什么环境安排一直在制造风险”。变化不是突然完成的，但它已经让现场、材料和人的行动被一起检查。最后留下的是：安全从提醒个人变成了设计环境。",
    "knowledgePointZh": "关键转向：卫生和职业安全要看环境、流程、材料、制度和权力关系怎样一起制造或降低风险。",
    "reflectionQuestionZh": "真正的卫生服务，是在你生病后出现，还是在你没生病前就已经工作？"
  },
  "103-night-watch-call": {
    "titleZh": "警察为什么应该穿制服",
    "summaryZh": "一个保护现场让力量必须接受证据和程序的约束。",
    "sceneZh": "19 世纪伦敦街头，城市快速扩张，犯罪、贫困、拥挤和公众恐惧让旧式治安方式越来越不够。",
    "storyBodyZh": "旁人最容易先问的是：把安全看成巡逻、锁门、抓人或快速反应。它保留了一种秩序：让危险先被压住，也能给公众一个可见的秩序。这时，一个小小的不匹配把问题往前推：现场留下的痕迹、权力边界和人的权利并不会因为危险过去就消失。这个不匹配让人慢下来：问题在于，证据、程序、合法性和监督会被有效率的行动盖住。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先保存现场细节，再核对痕迹、目击和记录，又把证据链与权力边界一起检查。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一次接触要看留下了什么痕迹，一次行动要看权力是否被约束。原来的解释保护的问题是“怎样尽快控制危险”。现场让人不得不改问“什么证据和程序能让保护不变成新的伤害”。答案还没有封口，材料已经让痕迹、记录和程序被放在同一条证据链上。这层停顿让后面的判断多了一点重量。由此，保护不再只靠力量，也要靠能被检验的证据和边界。这让保护不只停在反应速度上，也开始接受记录和责任的检查。",
    "knowledgePointZh": "关键转向：保护人需要力量，也需要证据、边界、责任和能约束权力的程序。",
    "reflectionQuestionZh": "一个安全系统怎样既保护人，又不让保护人的权力失去边界？"
  },
  "104-missed-connection": {
    "titleZh": "地铁线路为什么可以弯成图",
    "summaryZh": "一个移动现场让路线、时间和信息一起被检查。",
    "sceneZh": "1930 年代伦敦，一个工程制图员看着复杂地铁线路，发现按真实地理画出的地图让乘客很难读。",
    "storyBodyZh": "现场最先给出的办法是：把运输看成把人或物从一处送到另一处。它让判断先有落点：让路线、车辆和时间表先运转起来，原来的做法刚要收口，新的证据就露出缝隙：陌生、拥挤、换乘、延误或信息不清一出现，移动本身就不再等于到达。这套办法越有效，边界也越清楚：问题在于，人在压力下怎样判断路线、时间和风险会被当成个人问题。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先沿着出发到抵达的路径走一遍，再标出换乘、等待和误读的位置，又重新安排图示、节奏或安全提示。差异没有被删掉，新的问法才有地方出现。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一条路线要看换乘，一张图要看人在匆忙时能不能读懂。还没转向前，人们问的是“路能不能走通”。原来的问法被迫让出位置给“人在不熟悉和有压力时怎样仍能做出清楚选择”。这一步没有结束争论，却让路线、时间、信息和身体移动被一起检查。慢慢地，移动开始包括信息、可靠性和人的判断。",
    "knowledgePointZh": "关键转向：运输不只是让人或物移动，还要让路径、时间、信息和安全在压力下仍然可读。",
    "reflectionQuestionZh": "一个交通系统真正好用，是因为路短，还是因为人在压力下也能看懂？"
  },
  "108-festival-operations-plan": {
    "titleZh": "服务蓝图背后的看不见动作",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "20 世纪 80 年代，一位研究者观察服务现场，发现顾客看到的只是整个系统露出水面的部分。",
    "storyBodyZh": "人们先抓住的办法是：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它不是随便来的，因为让工作先被分配，也让现场不至于失去秩序。可眼前的细节开始把问题推回来：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。一旦继续看下去，问题就变了：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。第一眼的问题是“这项服务有没有做完”。接下来能继续工作的问法是“整条路径怎样让人安全、清楚并被看见”。新的理解先从这里长出来：前台、后台、空间和人的感受被画到同一条路径上。更稳的判断是：一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：跨部门服务要把前台体验、后台流程、技术、人员和质量证据放在同一张蓝图里。",
    "reflectionQuestionZh": "一次服务失败时，问题真的在前台那个人身上，还是在蓝图里早就埋好了？"
  },
  "109-service-that-had-no-name": {
    "titleZh": "电话那头先不急着劝",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "1950 年代伦敦，一个牧师在报纸上看到年轻人因孤立和羞耻而走向绝望，开始想象一条任何人都能拨打的电话线。",
    "storyBodyZh": "一开始能用的办法是：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它先帮人抓住了边界：让工作先被分配，也让现场不至于失去秩序。但眼前的材料没有顺着这个解释走：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。现场没有接受太快的收束：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。原本的问题是“这项服务有没有做完”。被证据推出来的问题是“整条路径怎样让人安全、清楚并被看见”。问题变准以后，现场开始让前台、后台、空间和人的感受被画到同一条路径上。真正被打开的是：一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：有些支持很难归类，但它们守住的是人在正式系统之间最容易掉落的时刻。",
    "reflectionQuestionZh": "一种服务如果只是先听你说完，它为什么仍然可能改变一个夜晚的结局？"
  },
  "0111-education-science": {
    "titleZh": "孩子们自己搬动的小椅子",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "1907 年，罗马圣洛伦佐一栋普通公寓里，一群白天无人照看的孩子被带进一间新教室。",
    "storyBodyZh": "人们先抓住的办法是：把学习看成教师按顺序交付内容，学生把答案带走。它让旁人能跟上，因为让课堂有秩序，也方便检查进度。偏偏有一处细节不肯归入原来的说法：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。差异没有被原来的做法完全收住：问题在于，学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。原来的解释没有消失，但已经不能替所有证据说话。原来的做法留下的问题是“这一课教完了吗”。这时更重要的问题变成“什么样的情境会让学习者自己把经验和知识接起来”。到这里，最重要的不是结论，而是活动、记录和追问被放回同一张桌上。从这个动作往后，课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "如果一个孩子没有学进去，你会先要求他更努力，还是先检查环境有没有给他进入学习的路？"
  },
  "0112-training-for-pre-school-teachers": {
    "titleZh": "木球滚到孩子手边",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "1837 年，德国 Bad Blankenburg 的一间小屋里，一个教育者把木球、积木、纸片和花园活动摆到孩子面前。",
    "storyBodyZh": "那时最稳妥的入口是：把学习看成教师按顺序交付内容，学生把答案带走。它能先压住混乱，因为让课堂有秩序，也方便检查进度。这时，一个小小的不匹配把问题往前推：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。证据开始要求更多耐心：问题在于，学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。最初的入口是“这一课教完了吗”。原来的解释无法收住的问题是“什么样的情境会让学习者自己把经验和知识接起来”。原来的问题仍能开门，新的问法把人带进更深处。这个改变先带来的，是让活动、记录和追问被放回同一张桌上。问题换形以后，课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "当一个小孩在玩，你看见的是消遣，还是一种需要被理解和引导的学习？"
  },
  "0113-teacher-training-without-subject-specialisation": {
    "titleZh": "只有三名学生的师范学校",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "1839 年 7 月，马萨诸塞州 Lexington 的一所新学校开门时，第一批学生少到几乎不像一所学校。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：把学习看成教师按顺序交付内容，学生把答案带走。它的合理性在于让课堂有秩序，也方便检查进度，原来的做法刚要收口，新的证据就露出缝隙：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。原来的整理方式开始失去弹性：问题在于，学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。原来的问题是“这一课教完了吗”。最后能带着人继续走的问题是“什么样的情境会让学习者自己把经验和知识接起来”。等材料被这样处理后，活动、记录和追问被放回同一张桌上。最后，课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "什么样的教学能力不属于任何一门课，却决定所有课能不能发生？"
  },
  "0114-teacher-training-with-subject-specialisation": {
    "titleZh": "教授把高等数学带回中学课堂",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "20 世纪初的 Göttingen，一个数学教授发现，中学数学老师常站在两座桥之间：一边是大学数学，一边是学生眼前的题。",
    "storyBodyZh": "起初，人们往往先这样处理：把学习看成教师按顺序交付内容，学生把答案带走。它的好处是让课堂有秩序，也方便检查进度。可眼前的细节开始把问题推回来：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。它的边界也在这里显出来：学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。最早的问题是“这一课教完了吗”。问题慢慢变成“什么样的情境会让学习者自己把经验和知识接起来”。新的问法让活动、记录和追问被放回同一张桌上。从这里开始，课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "懂一门学科和教会一门学科，中间究竟隔着哪一种知识？"
  },
  "0119-education-not-elsewhere-classified": {
    "titleZh": "工人把自己的词写上黑板",
    "summaryZh": "一个教室现场让教学从交付答案转向安排理解发生。",
    "sceneZh": "1963 年，巴西 Angicos 的夜晚，一些甘蔗工人下班后坐进识字班，黑板上写的不是陌生例句，而是他们生活里的词。",
    "storyBodyZh": "最初，当时更顺手的做法是：把学习看成教师按顺序交付内容，学生把答案带走。这套办法有用，因为让课堂有秩序，也方便检查进度。但眼前的材料没有顺着这个解释走：桌上的材料没有按课本边界站队，一个小活动会同时牵出数量、语言、身体、合作和判断。问题也在这里露出来：学生的卡顿会被误认为不用功，而不是任务和情境需要调整。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先观察学生先碰什么，再记录他们在哪里卡住，又重新安排材料、提问和同伴讨论。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个活动要看学生如何接住，一个错误要看它暴露了哪种理解断点。原来的问题是“这一课教完了吗”。新的问法逐渐清楚“什么样的情境会让学习者自己把经验和知识接起来”。问题在这里变得明确：接下来必须顺着证据继续查。它没有把答案一下子交出来，却让活动、记录和追问被放回同一张桌上。于是，课堂不再只是传递答案，而是在安排理解发生的条件。",
    "knowledgePointZh": "关键转向：教学的关键不是把答案搬给学生，而是设计一种能让经验、行动和解释相遇的情境。",
    "reflectionQuestionZh": "哪些学习发生在正式课程之外，却真正改变了一个人看世界的方式？"
  },
  "0211-audio-visual-techniques-and-media-production": {
    "titleZh": "工厂门口走出来的人群",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1895 年，法国一家照相器材厂门口，工人们下班离开，画面普通到几乎不像一件大事。",
    "storyBodyZh": "刚进入现场时，最容易被采用的入口是：按作者、年代、风格和流派把作品、文本或物件放进格子。它并不是空想，原因在于防止观看完全散掉，也给初学者一条进入作品的路。偏偏有一处细节不肯归入原来的说法：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。这套做法开始显出边界：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。第一层问题是“它属于哪一种作品或传统”。问题被推向另一句更难的话“它把哪些记忆、材料和观看方式带到了现在”。变化不是突然完成的，但它已经让相隔很远的物件被放到同一条视线上。到这一步，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "当一个普通瞬间被机器记录下来，它还是原来的瞬间吗？"
  },
  "0212-fashion-interior-and-industrial-design": {
    "titleZh": "墙纸上的野草",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "19 世纪英国，一个爱读诗、爱看中世纪故事的年轻人，走进工业时代的房间，却总觉得日用品正在失去人的手。",
    "storyBodyZh": "在最早的判断里，现场最先出现的判断是：按作者、年代、风格和流派把作品、文本或物件放进格子。它能先撑住局面，因为防止观看完全散掉，也给初学者一条进入作品的路。这时，一个小小的不匹配把问题往前推：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。原来的解释在这里变窄：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原来的问法是“它属于哪一种作品或传统”。后来真正留下来的问题是“它把哪些记忆、材料和观看方式带到了现在”。答案还没有封口，材料已经让相隔很远的物件被放到同一条视线上。后来再回看，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "你每天使用的东西，是只被制造出来，还是也被认真理解过？"
  },
  "0213-fine-arts": {
    "titleZh": "苹果为什么总是画不稳",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "19 世纪后期的法国南部，一个本该走向稳定职业的人反复回到画布前，盯着苹果、桌布和一座山。",
    "storyBodyZh": "事情刚被记录下来时，很多人会先这么做：按作者、年代、风格和流派把作品、文本或物件放进格子。这种办法的价值在于防止观看完全散掉，也给初学者一条进入作品的路。原来的做法刚要收口，新的证据就露出缝隙：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。原来的做法到这里不够用了：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。一开始能说出口的问题是“它属于哪一种作品或传统”。这时，问题换了形状“它把哪些记忆、材料和观看方式带到了现在”。这一步没有结束争论，却让相隔很远的物件被放到同一条视线上。真正留下来的变化是：分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "当你反复看同一个苹果，它会不会开始动摇你对“看见”的理解？"
  },
  "0214-handicrafts": {
    "titleZh": "一只无名陶碗",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "20 世纪初，日本城市快速现代化时，一个年轻思想者在朝鲜陶器和普通民间器物面前停了下来。",
    "storyBodyZh": "第一眼看过去，一开始能撑住局面的办法是：按作者、年代、风格和流派把作品、文本或物件放进格子。它先解决了一个问题：防止观看完全散掉，也给初学者一条进入作品的路。可眼前的细节开始把问题推回来：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。真正的卡点从这里出现：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。起初，人们问“它属于哪一种作品或传统”。问题继续往前推“它把哪些记忆、材料和观看方式带到了现在”。这让材料继续抵抗原来的解释，也让后面的判断更稳。新的理解先从这里长出来：相隔很远的物件被放到同一条视线上。这以后，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "一件没有作者签名的碗，为什么仍然可能改变审美史？"
  },
  "0215-music-and-performing-arts": {
    "titleZh": "演员为什么不该只朝观众喊",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "19 世纪末的莫斯科，一个热爱舞台的年轻人站在剧场里，越来越受不了那种夸张、空洞、只顾展示嗓门的表演。",
    "storyBodyZh": "按当时的习惯，先被拿出来的解释是：按作者、年代、风格和流派把作品、文本或物件放进格子。它让人不至于完全乱掉，因为防止观看完全散掉，也给初学者一条进入作品的路。但眼前的材料没有顺着这个解释走：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。现场把原来的做法推到边缘：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原来的框架里，问题是“它属于哪一种作品或传统”。问题开始转向“它把哪些记忆、材料和观看方式带到了现在”。问题变准以后，现场开始让相隔很远的物件被放到同一条视线上。原来的问法退后时，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "一次表演什么时候开始像真实生活，而不只是熟练展示？"
  },
  "0219-arts-not-elsewhere-classified": {
    "titleZh": "被转过方向的小便池",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1917 年纽约，一个艺术家把一件普通洁具换了方向，签上化名，送去一个号称开放的展览。",
    "storyBodyZh": "按普通做法，眼前最方便的处理方式是：按作者、年代、风格和流派把作品、文本或物件放进格子。它看起来可靠，是因为防止观看完全散掉，也给初学者一条进入作品的路。偏偏有一处细节不肯归入原来的说法：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。原来的框架在这里开始松动：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。刚开始的问题是“它属于哪一种作品或传统”。更锋利的问题出现了“它把哪些记忆、材料和观看方式带到了现在”。到这里，最重要的不是结论，而是相隔很远的物件被放到同一条视线上。新的方法出现时，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "如果一件东西没有被手工制作，却迫使你重新定义艺术，它还算作品吗？"
  },
  "0221-religion-and-theology": {
    "titleZh": "修士写给主教的一封信",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1517 年的德意志，一个年轻神学教师听见普通人谈论赎罪券，心里越来越不安。",
    "storyBodyZh": "照旧处理时，人们往往先这样处理：按作者、年代、风格和流派把作品、文本或物件放进格子。它给了现场一个入口：防止观看完全散掉，也给初学者一条进入作品的路。这时，一个小小的不匹配把问题往前推：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。麻烦不是原来的做法全错：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原先的问题是“它属于哪一种作品或传统”。真正需要回答的变成“它把哪些记忆、材料和观看方式带到了现在”。这个改变先带来的，是让相隔很远的物件被放到同一条视线上。现场的意义变成：分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "当一种宗教实践让普通信徒误解信仰本身时，神学应该保持沉默吗？"
  },
  "0222-history-and-archaeology": {
    "titleZh": "台阶下的封门",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "1922 年，埃及帝王谷的尘土里，一个长期做发掘工作的男人几乎快要失去资助，却仍让工人继续清理一片看似普通的地面。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：按作者、年代、风格和流派把作品、文本或物件放进格子。它能被接受，是因为防止观看完全散掉，也给初学者一条进入作品的路，原来的做法刚要收口，新的证据就露出缝隙：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。这个细节把原来的问题拉长了：姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。最容易先问的是“它属于哪一种作品或传统”。问题不再停在原处，而是变成“它把哪些记忆、材料和观看方式带到了现在”。等材料被这样处理后，相隔很远的物件被放到同一条视线上。那一刻之后，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "发现过去时，我们是在拥有它，还是开始承担解释它的责任？"
  },
  "0223-philosophy-and-ethics": {
    "titleZh": "市场里那个不停追问的人",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "公元前 5 世纪的雅典，一个出身普通工匠家庭的人，常在市场、体育场和宴席间同人谈话。",
    "storyBodyZh": "先把混乱收住时，当时更顺手的做法是：按作者、年代、风格和流派把作品、文本或物件放进格子。它能先让人行动，因为防止观看完全散掉，也给初学者一条进入作品的路。可眼前的细节开始把问题推回来：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。原来的解释可以开头，却不能收尾：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。最初被抓住的问题是“它属于哪一种作品或传统”。新的压力把问题改成“它把哪些记忆、材料和观看方式带到了现在”。新的问法让相隔很远的物件被放到同一条视线上。再看同一件事时，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "当你说“我知道”时，是否真的知道自己知道什么？"
  },
  "0229-humanities-except-languages-not-elsewhere-classified": {
    "titleZh": "她把家乡的故事重新听了一遍",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "20 世纪 20 年代，一个从美国南方小镇走出去的年轻女性，带着人类学训练回到熟悉的门廊和街角。",
    "storyBodyZh": "先把事情收进一个格子里，确实能带来秩序：按作者、年代、风格和流派把作品、文本或物件放进格子。它的短处不在一开始，正因为防止观看完全散掉，也给初学者一条进入作品的路。但眼前的材料没有顺着这个解释走：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。事情没有停在原来的入口：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果把不合适的部分剪掉，故事会顺滑，却不会变聪明。接下来的动作很朴素：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。现场没有立刻变清楚，但原来的问题已经站不稳。记录之间开始出现可以追问的缝：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。一开始的问题是“它属于哪一种作品或传统”。这些材料把问题推向“它把哪些记忆、材料和观看方式带到了现在”。它没有把答案一下子交出来，却让相隔很远的物件被放到同一条视线上。这让人开始承认：分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "当一个人研究自己的文化时，她是旁观者，还是也在重新听见自己？"
  },
  "0231-language-acquisition": {
    "titleZh": "一只叫 Wug 的小怪物",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "20 世纪中期，一位年轻研究者坐在孩子面前，拿出一张画着陌生小动物的图片。",
    "storyBodyZh": "在第一层问题里，最容易被采用的入口是：按作者、年代、风格和流派把作品、文本或物件放进格子。它至少做到了一点：防止观看完全散掉，也给初学者一条进入作品的路。偏偏有一处细节不肯归入原来的说法：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。原来的做法开始漏掉关键部分：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果只保留已经会说的话，新的问法就没有地方长出来。它让人看见，真正有用的是这些慢动作：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。最先出现的问题是“它属于哪一种作品或传统”。这几步把问题改写成“它把哪些记忆、材料和观看方式带到了现在”。变化不是突然完成的，但它已经让相隔很远的物件被放到同一条视线上。最后留下的是：分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "孩子说错的时候，是否可能正在证明自己已经学会了规则？"
  },
  "0232-literature-and-linguistics": {
    "titleZh": "一个词不是贴在东西上的标签",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "20 世纪初的日内瓦，一位语言教师在课堂上反复提醒学生：语言不是一堆物体名称的清单。",
    "storyBodyZh": "旁人最容易先问的是：按作者、年代、风格和流派把作品、文本或物件放进格子。它保留了一种秩序：防止观看完全散掉，也给初学者一条进入作品的路。这时，一个小小的不匹配把问题往前推：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。这个不匹配让人慢下来：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。原来的解释保护的问题是“它属于哪一种作品或传统”。现场让人不得不改问“它把哪些记忆、材料和观看方式带到了现在”。答案还没有封口，材料已经让相隔很远的物件被放到同一条视线上。由此，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "如果一个词的意义来自它和其他词的差异，你还能把语言当成词典列表吗？"
  },
  "0239-languages-not-elsewhere-classified": {
    "titleZh": "会说话的树叶",
    "summaryZh": "一个观看现场让作品从标签转向记忆、材料和解释。",
    "sceneZh": "19 世纪初，一个切罗基银匠看见白人士兵用纸传递消息，觉得那些纸像会说话的树叶。",
    "storyBodyZh": "现场最先给出的办法是：按作者、年代、风格和流派把作品、文本或物件放进格子。它让判断先有落点：防止观看完全散掉，也给初学者一条进入作品的路，原来的做法刚要收口，新的证据就露出缝隙：同一个手势、符号或声音在不同物件之间反复出现；标签能收好它，却解释不了它为什么回来。这套办法越有效，边界也越清楚：问题在于，姿势、材料、记忆、权力和观看方式之间的暗线会被剪断。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先把图像、文字或物件并排放开，再移动它们的位置重新比较，又查看相似处和差异处到底指向什么经验。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一个图像要看它旁边放着什么，一个姿势要看它从哪里来又去了哪里。还没转向前，人们问的是“它属于哪一种作品或传统”。原来的问法被迫让出位置给“它把哪些记忆、材料和观看方式带到了现在”。这一步没有结束争论，却让相隔很远的物件被放到同一条视线上。慢慢地，分类开始变成解释关系的工作。",
    "knowledgePointZh": "关键转向：作品、文本和物件不是孤立陈列，它们会带着记忆、权力、材料和观看方式一起生产意义。",
    "reflectionQuestionZh": "如果一个没有文字传统的共同体突然能书写自己的语言，会发生什么？"
  },
  "0311-economics": {
    "titleZh": "那枚小小的别针",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "18 世纪的苏格兰，一个常在街上散步的道德哲学教授，对商店、工坊和港口里的普通交易越来越着迷。",
    "storyBodyZh": "人们先抓住的办法是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它不是随便来的，因为快速形成判断，也让复杂争论先有一个入口。可眼前的细节开始把问题推回来：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。一旦继续看下去，问题就变了：问题在于，谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。第一眼的问题是“谁的说法对”。接下来能继续工作的问法是“什么证据能让被分散的生活进入公共讨论”。原来的问题仍有用，新的问法让判断多了一层检查。新的理解先从这里长出来：记录、位置和人的声音被一起比较。更稳的判断是：公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "当你看到一件便宜小物时，会不会想到它背后有多少陌生人的合作？"
  },
  "0312-political-sciences-and-civics": {
    "titleZh": "镇会里的民主细节",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "1830 年代的美国，一个年轻法国贵族坐在地方会议旁边，认真听普通居民怎样争论道路、学校和税。",
    "storyBodyZh": "一开始能用的办法是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它先帮人抓住了边界：快速形成判断，也让复杂争论先有一个入口。但眼前的材料没有顺着这个解释走：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。现场没有接受太快的收束：问题在于，谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原本的问题是“谁的说法对”。被证据推出来的问题是“什么证据能让被分散的生活进入公共讨论”。新的问法出现后，这些动作不再只是整理材料。问题变准以后，现场开始让记录、位置和人的声音被一起比较。真正被打开的是：公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "如果民主不是只在投票日发生，你今天在哪个小地方练习过公共判断？"
  },
  "0313-psychology": {
    "titleZh": "实验室里的节拍器",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "1879 年的莱比锡，一间房里有计时器、节拍器、反应键和一群被要求仔细报告经验的学生。",
    "storyBodyZh": "人们先抓住的办法是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它让旁人能跟上，因为快速形成判断，也让复杂争论先有一个入口。偏偏有一处细节不肯归入原来的说法：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。差异没有被原来的做法完全收住：问题在于，谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原来的做法留下的问题是“谁的说法对”。这时更重要的问题变成“什么证据能让被分散的生活进入公共讨论”。到这里，最重要的不是结论，而是记录、位置和人的声音被一起比较。从这个动作往后，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "你以为只属于内心的一个反应，能不能被时间、情境和身体一起解释？"
  },
  "0314-sociology-and-cultural-studies": {
    "titleZh": "费城街区的一户户人家",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "19 世纪末的费城，一个年轻学者拿着表格和笔，走进被许多人用刻板印象谈论的黑人社区。",
    "storyBodyZh": "那时最稳妥的入口是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它能先压住混乱，因为快速形成判断，也让复杂争论先有一个入口。这时，一个小小的不匹配把问题往前推：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。证据开始要求更多耐心：问题在于，谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。最初的入口是“谁的说法对”。原来的解释无法收住的问题是“什么证据能让被分散的生活进入公共讨论”。原来的问题仍能开门，新的问法把人带进更深处。这个改变先带来的，是让记录、位置和人的声音被一起比较。问题换形以后，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "你对一个群体的判断里，有多少来自证据，又有多少只是被反复听来的说法？"
  },
  "0319-social-and-behavioural-sciences-not-elsewhere-classified": {
    "titleZh": "孩子们的食物地图",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "1930 年代的美国南方，一位研究者走进学校和家庭，发现孩子的午餐盒里藏着比营养更多的社会线索。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它的合理性在于快速形成判断，也让复杂争论先有一个入口，原来的做法刚要收口，新的证据就露出缝隙：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。原来的整理方式开始失去弹性：问题在于，谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原来的问题是“谁的说法对”。最后能带着人继续走的问题是“什么证据能让被分散的生活进入公共讨论”。等材料被这样处理后，记录、位置和人的声音被一起比较。最后，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "一个看似个人习惯的问题，背后可能有多少层社会条件在一起行动？"
  },
  "0321-journalism-and-reporting": {
    "titleZh": "她查每一个名字",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "19 世纪末的美国南方，一个年轻女教师兼报人听说朋友被私刑杀害，愤怒之外先做了一件慢事：查证。",
    "storyBodyZh": "起初，现场最先出现的判断是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它的好处是快速形成判断，也让复杂争论先有一个入口。可眼前的细节开始把问题推回来：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。它的边界也在这里显出来：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。最早的问题是“谁的说法对”。问题慢慢变成“什么证据能让被分散的生活进入公共讨论”。这个补上的细节不大，却让下一步不能再照旧走。新的问法让记录、位置和人的声音被一起比较。从这里开始，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "当一个社会已经习惯某种说法时，谁还愿意逐条核对它？"
  },
  "0322-library-information-and-archival-studies": {
    "titleZh": "每本书都该找到它的读者",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "20 世纪 20 年代的印度，一个年轻数学教师转到图书馆工作，发现书架整齐并不等于知识真正被使用。",
    "storyBodyZh": "最初，很多人会先这么做：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。这套办法有用，因为快速形成判断，也让复杂争论先有一个入口。但眼前的材料没有顺着这个解释走：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。问题也在这里露出来：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。原来的问题是“谁的说法对”。新的问法逐渐清楚“什么证据能让被分散的生活进入公共讨论”。问题在这里变得明确：接下来必须顺着证据继续查。它没有把答案一下子交出来，却让记录、位置和人的声音被一起比较。于是，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "一个系统是为了保存资料，还是为了让需要资料的人及时找到它？"
  },
  "0329-journalism-and-information-not-elsewhere-classified": {
    "titleZh": "危机地图上的第一条短信",
    "summaryZh": "一个公共现场让意见变成需要被记录和核对的证据。",
    "sceneZh": "2007 年肯尼亚选举后，街头暴力和传言同时扩散，一个年轻律师在网上写下想法：能不能让人们报告身边发生的事？",
    "storyBodyZh": "刚进入现场时，一开始能撑住局面的办法是：把社会问题当成意见冲突：谁说得更响，谁看起来就更接近事实。它并不是空想，原因在于快速形成判断，也让复杂争论先有一个入口。偏偏有一处细节不肯归入原来的说法：同一件事在不同人那里留下完全不同的版本；单听一个声音，反而会把问题弄窄。这套做法开始显出边界：谁被记录、谁被漏掉、信息怎样进入公共判断，都会退到视线外。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先记下地点、时间和人物，再把几组说法互相核对，又把名单、地图、档案或案例摊在同一张桌上。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个数字要看谁被统计进去，一张地图要看哪些生活被留在边缘。第一层问题是“谁的说法对”。问题被推向另一句更难的话“什么证据能让被分散的生活进入公共讨论”。原来的问题没有消失，但新的问法已经改变了下一步该看哪里。变化不是突然完成的，但它已经让记录、位置和人的声音被一起比较。到这一步，公共事实不再像现成物，而像一套需要被制作和校验的证据。",
    "knowledgePointZh": "关键转向：公共事实要靠记录、核对、解释和传播被做出来，也要不断追问谁在资料里出现，谁被排除。",
    "reflectionQuestionZh": "在混乱时刻，怎样的信息既能快速出现，又不放弃核实和保护人的责任？"
  },
  "0411-accounting-and-taxation": {
    "titleZh": "商人账本里的两边",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "文艺复兴时期的意大利，一个修士兼数学教师看到商人的账本里，货物、债务和现金总在流动。",
    "storyBodyZh": "在最早的判断里，先被拿出来的解释是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它能先撑住局面，因为让人先做决定，也能把责任表面上固定下来。这时，一个小小的不匹配把问题往前推：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。原来的解释在这里变窄：责任、风险、激励、权利和后果会被推给后来承受的人。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。原来的问法是“哪一种选择最划算”。后来真正留下来的问题是“哪些责任、风险和规则必须先被摆到桌面上”。到这里，新的问法不是口号，而是被材料逼出来的下一步。答案还没有封口，材料已经让账本、合同和人的后果被放在一起读。原来的解释仍在桌上，只是不再拥有最后一句话。后来再回看，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "当一笔钱进入账本两边，它是不是也进入了责任之中？"
  },
  "0412-finance-banking-and-insurance": {
    "titleZh": "死亡表里的保险问题",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "17 世纪末，一个习惯计算彗星轨道的人，开始认真阅读一座城市的出生和死亡记录。",
    "storyBodyZh": "事情刚被记录下来时，眼前最方便的处理方式是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。这种办法的价值在于让人先做决定，也能把责任表面上固定下来。原来的做法刚要收口，新的证据就露出缝隙：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。原来的做法到这里不够用了：责任、风险、激励、权利和后果会被推给后来承受的人。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。一开始能说出口的问题是“哪一种选择最划算”。这时，问题换了形状“哪些责任、风险和规则必须先被摆到桌面上”。新的问法让人不能只带着原来的解释离开现场。这一步没有结束争论，却让账本、合同和人的后果被放在一起读。它让问题的形状更清楚，也让后面的理解更稳。真正留下来的变化是：选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "你买一份保险时，真正买的是钱、时间，还是对不确定性的共同分担？"
  },
  "0413-management-and-administration": {
    "titleZh": "她不想让工人只服从命令",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "20 世纪初的波士顿，一个女性社会思想者在社区工作、企业会议和公共事务之间来回走动。",
    "storyBodyZh": "第一眼看过去，人们往往先这样处理：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它先解决了一个问题：让人先做决定，也能把责任表面上固定下来。可眼前的细节开始把问题推回来：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。真正的卡点从这里出现：责任、风险、激励、权利和后果会被推给后来承受的人。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。起初，人们问“哪一种选择最划算”。问题继续往前推“哪些责任、风险和规则必须先被摆到桌面上”。这让材料继续抵抗原来的解释，也让后面的判断更稳。新的理解先从这里长出来：账本、合同和人的后果被放在一起读。这以后，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "面对冲突时，你是在寻找谁赢，还是寻找问题本身要求大家怎样改变？"
  },
  "0414-marketing-and-advertising": {
    "titleZh": "牙膏广告里的一个小习惯",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "20 世纪初的美国，一个广告人盯着报纸版面和销售数字，越来越不相信只靠漂亮句子就能卖出东西。",
    "storyBodyZh": "按当时的习惯，当时更顺手的做法是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它让人不至于完全乱掉，因为让人先做决定，也能把责任表面上固定下来。但眼前的材料没有顺着这个解释走：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。现场把原来的做法推到边缘：责任、风险、激励、权利和后果会被推给后来承受的人。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。原来的框架里，问题是“哪一种选择最划算”。问题开始转向“哪些责任、风险和规则必须先被摆到桌面上”。问题变准以后，现场开始让账本、合同和人的后果被放在一起读。原来的问法退后时，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "一个广告是在帮你看见真实需求，还是在替你制造一个新焦虑？"
  },
  "0415-secretarial-and-office-work": {
    "titleZh": "键盘把办公室重新排了一遍",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "19 世纪美国，一个报纸编辑兼发明者反复调试一台会卡键的机器，想让文字能更快落到纸上。",
    "storyBodyZh": "按普通做法，最容易被采用的入口是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它看起来可靠，是因为让人先做决定，也能把责任表面上固定下来。偏偏有一处细节不肯归入原来的说法：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。原来的框架在这里开始松动：责任、风险、激励、权利和后果会被推给后来承受的人。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。刚开始的问题是“哪一种选择最划算”。更锋利的问题出现了“哪些责任、风险和规则必须先被摆到桌面上”。这时，新的问法把注意力从结论拉回证据。到这里，最重要的不是结论，而是账本、合同和人的后果被放在一起读。这层停顿让后面的判断多了一点重量。新的方法出现时，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "一个组织里哪些看似琐碎的文件，实际是在保护大家不被混乱吞掉？"
  },
  "0416-wholesale-and-retail-sales": {
    "titleZh": "顾客自己拿货的商店",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "1916 年的孟菲斯，一个杂货商看着柜台后的店员不停替顾客取货，觉得整套流程太慢也太贵。",
    "storyBodyZh": "照旧处理时，现场最先出现的判断是：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它给了现场一个入口：让人先做决定，也能把责任表面上固定下来。这时，一个小小的不匹配把问题往前推：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。麻烦不是原来的做法全错：责任、风险、激励、权利和后果会被推给后来承受的人。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。原先的问题是“哪一种选择最划算”。真正需要回答的变成“哪些责任、风险和规则必须先被摆到桌面上”。这个改变先带来的，是让账本、合同和人的后果被放在一起读。这让证据继续发力，而不是被原来的解释盖住。现场的意义变成：选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "当你以为自己自由选择商品时，货架已经替你做了哪些安排？"
  },
  "0417-work-skills": {
    "titleZh": "砖头该怎样拿才不累",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "20 世纪初的工地和厨房里，一对夫妻拿着秒表和摄像机，认真观察人怎样伸手、弯腰、拿起工具。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它能被接受，是因为让人先做决定，也能把责任表面上固定下来，原来的做法刚要收口，新的证据就露出缝隙：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。这个细节把原来的问题拉长了：责任、风险、激励、权利和后果会被推给后来承受的人。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。最容易先问的是“哪一种选择最划算”。问题不再停在原处，而是变成“哪些责任、风险和规则必须先被摆到桌面上”。等材料被这样处理后，账本、合同和人的后果被放在一起读。原来的做法仍有价值，只是不能再假装完整。那一刻之后，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "你觉得自己不够努力的时候，有没有可能只是动作、工具或流程需要被重新设计？"
  },
  "0419-business-and-administration-not-elsewhere-classified": {
    "titleZh": "一张小额贷款的桌子",
    "summaryZh": "一个决策现场让成本、规则和责任一起浮出桌面。",
    "sceneZh": "20 世纪 70 年代的孟加拉，一个经济学教师走到村里，发现课本里的贫困理论解释不了一张竹凳的债务。",
    "storyBodyZh": "先把混乱收住时，很多人会先这么做：把选择当成一笔账：价格低、效率高、合同签完，事情就算安排好了。它能先让人行动，因为让人先做决定，也能把责任表面上固定下来。可眼前的细节开始把问题推回来：看似便宜或顺手的安排一旦出错，就会暴露没人负责、规则不清或成本被藏起来。原来的解释可以开头，却不能收尾：问题在于，责任、风险、激励、权利和后果会被推给后来承受的人。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先列出成本和承诺，再追踪谁承担风险，又把规则、账目和后果放在一起比较。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一笔成本要看谁承担，一条规则要看它怎样改变别人的选择。最初被抓住的问题是“哪一种选择最划算”。新的压力把问题改成“哪些责任、风险和规则必须先被摆到桌面上”。这时，新的问法已经压过原来的解释。新的问法让账本、合同和人的后果被放在一起读。再看同一件事时，选择不再只是个人聪明，而成了共同承担之前必须说清的安排。",
    "knowledgePointZh": "关键转向：组织和交易不是只靠意愿运行，资源、责任、风险和规则必须被摆出来比较。",
    "reflectionQuestionZh": "一个商业工具什么时候是在打开机会，什么时候又可能制造新的依赖？"
  },
  "0511-biology": {
    "titleZh": "雨水里的小动物",
    "summaryZh": "一滴看似清亮的水，在小透镜下把自然的尺度往下推了一层。",
    "sceneZh": "1670 年代的 Delft，窗边桌上放着一枚自制单透镜、一根细针和一滴存放过的雨水。",
    "storyBodyZh": "窗玻璃把北方的光磨得很薄，黄铜小板被手指捏得发热。这个做布料生意的人原先磨镜片，是为了看清纱线粗细、纤维断口和布面瑕疵。清水在肉眼里只是清水；若变浑了，人们也多半说它放坏了。那天，他把一滴存放过的雨水挑到针尖旁，贴近小透镜，先调光，再屏住呼吸找焦点。水滴里忽然有细小的点在转，有的像在划水，有的猛地一闪又躲开。原来的问题很简单：这水干不干净。可如果清亮的水里也有东西在动，肉眼的清楚就不再等于世界的全部。他换另一份水样，又等几天再看，把不同小东西的形状和游动方式写进信里。问题慢慢改口：不是只问水有没有变坏，而是问看不见的生命能不能被工具、样本和重复观察拉到证据面前。那些信后来寄到 Royal Society；署名是 Antonie van Leeuwenhoek。",
    "supportZh": "Antonie van Leeuwenhoek 是 17 世纪 Delft 的布商和显微观察者。他使用自制单透镜显微镜观察水样、牙垢、血液、精子等，并在 1670 年代起通过信件向 Royal Society 报告被译为 animalcules 的微小生物观察。",
    "knowledgePointZh": "生物学在这里出现的关键转向，是生命不只存在于肉眼能直接确认的尺度里；当工具改变观察尺度，微小生命也能通过样本、重复观察、形态和运动记录进入可检查的自然世界。",
    "reflectionQuestionZh": "如果一个东西小到肉眼看不见，你会用什么重复动作让它从猜想变成证据？"
  },
  "0512-biochemistry": {
    "titleZh": "没有活细胞也会发酵",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "19 世纪末的柏林，一个研究者把酵母细胞磨碎过滤，本来只想保存提取物，却发现液体自己开始冒泡。",
    "storyBodyZh": "在第一层问题里，一开始能撑住局面的办法是：把现象先命名、分类或记成单个结果。它至少做到了一点：让观察不至于散乱，也能让别人知道你正在看什么。偏偏有一处细节不肯归入原来的说法：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。原来的做法开始漏掉关键部分：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果只保留已经会说的话，新的问法就没有地方长出来。真正有用的是这些慢动作：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。最先出现的问题是“这个现象叫什么”。这几步把问题改写成“它在什么条件、尺度和重复模式下出现或改变”。变化不是突然完成的，但它已经让数字、位置和形状被放进同一张可检查的图里。最后留下的是：好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：生命要在尺度、遗传、环境和行为的关系里被理解，而不只是被命名。",
    "reflectionQuestionZh": "当生命现象被拆到分子层面，它是变得更冷，还是变得更精细？"
  },
  "0519-biological-and-related-sciences-not-elsewhere-classified": {
    "titleZh": "玉米籽粒上的颜色跳动",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "20 世纪中期的玉米田里，一位女科学家一粒粒观察籽粒颜色，记录那些像斑点一样变化的图案。",
    "storyBodyZh": "旁人最容易先问的是：把现象先命名、分类或记成单个结果。它保留了一种秩序：让观察不至于散乱，也能让别人知道你正在看什么。这时，一个小小的不匹配把问题往前推：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。这个不匹配让人慢下来：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。原来的解释保护的问题是“这个现象叫什么”。现场让人不得不改问“它在什么条件、尺度和重复模式下出现或改变”。答案还没有封口，材料已经让数字、位置和形状被放进同一张可检查的图里。由此，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：生命要在尺度、遗传、环境和行为的关系里被理解，而不只是被命名。",
    "reflectionQuestionZh": "如果一个异常现象多年没人相信，你还会不会继续认真看它？"
  },
  "0521-environmental-sciences": {
    "titleZh": "山顶仪器画出的曲线",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "1958 年的夏威夷 Mauna Loa 山上，一个年轻化学家把空气样本送进仪器，关心小数点后的稳定性。",
    "storyBodyZh": "现场最先给出的办法是：把现象先命名、分类或记成单个结果。它让判断先有落点：让观察不至于散乱，也能让别人知道你正在看什么，原来的做法刚要收口，新的证据就露出缝隙：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。这套办法越有效，边界也越清楚：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。还没转向前，人们问的是“这个现象叫什么”。原来的问法被迫让出位置给“它在什么条件、尺度和重复模式下出现或改变”。这一步没有结束争论，却让数字、位置和形状被放进同一张可检查的图里。慢慢地，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：环境问题常常沿着水、土、空气、食物链和制度一起移动，不能只在一个点上处理。",
    "reflectionQuestionZh": "什么样的变化只有被测量很多年，才终于让人无法继续忽略？"
  },
  "0522-natural-environments-and-wildlife": {
    "titleZh": "黑猩猩手里的草茎",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "1960 年的坦桑尼亚森林里，一个年轻女性坐在树下，长时间等待黑猩猩愿意靠近。",
    "storyBodyZh": "人们先抓住的办法是：把现象先命名、分类或记成单个结果。它不是随便来的，因为让观察不至于散乱，也能让别人知道你正在看什么。可眼前的细节开始把问题推回来：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。一旦继续看下去，问题就变了：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。第一眼的问题是“这个现象叫什么”。接下来能继续工作的问法是“它在什么条件、尺度和重复模式下出现或改变”。新的理解先从这里长出来：数字、位置和形状被放进同一张可检查的图里。更稳的判断是：好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：环境问题常常沿着水、土、空气、食物链和制度一起移动，不能只在一个点上处理。",
    "reflectionQuestionZh": "当你发现一种动物也会学习和使用工具，你对“人类特殊性”的想法会怎样改变？"
  },
  "0529-environment-not-elsewhere-classified": {
    "titleZh": "树苗和妇女手里的水桶",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "1970 年代的肯尼亚，一个受过生物学训练的女性听见乡村妇女说，柴火远了，水少了，土也越来越薄。",
    "storyBodyZh": "一开始能用的办法是：把现象先命名、分类或记成单个结果。它先帮人抓住了边界：让观察不至于散乱，也能让别人知道你正在看什么。但眼前的材料没有顺着这个解释走：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。现场没有接受太快的收束：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。原本的问题是“这个现象叫什么”。被证据推出来的问题是“它在什么条件、尺度和重复模式下出现或改变”。问题变准以后，现场开始让数字、位置和形状被放进同一张可检查的图里。真正被打开的是：好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：环境问题常常沿着水、土、空气、食物链和制度一起移动，不能只在一个点上处理。",
    "reflectionQuestionZh": "一棵树什么时候不只是树，而是水、时间、收入和公共权利的交点？"
  },
  "0531-chemistry": {
    "titleZh": "燃烧后少了什么",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "18 世纪巴黎，一个税务官兼科学家在实验室里反复称量金属、空气和燃烧后的残留物。",
    "storyBodyZh": "人们先抓住的办法是：把现象先命名、分类或记成单个结果。它让旁人能跟上，因为让观察不至于散乱，也能让别人知道你正在看什么。偏偏有一处细节不肯归入原来的说法：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。差异没有被原来的做法完全收住：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。原来的做法留下的问题是“这个现象叫什么”。这时更重要的问题变成“它在什么条件、尺度和重复模式下出现或改变”。到这里，最重要的不是结论，而是数字、位置和形状被放进同一张可检查的图里。从这个动作往后，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：物质、运动和地球变化需要实验、测量和模型一起逼近，而不是只靠直觉争论。",
    "reflectionQuestionZh": "当你改变一个物质时，你会只看结果，还是追问每一部分去了哪里？"
  },
  "0532-earth-sciences": {
    "titleZh": "大陆像拼图一样裂开",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "20 世纪初，一个研究天气和极地的科学家看着世界地图，注意到南美和非洲海岸像可以拼合的边缘。",
    "storyBodyZh": "那时最稳妥的入口是：把现象先命名、分类或记成单个结果。它能先压住混乱，因为让观察不至于散乱，也能让别人知道你正在看什么。这时，一个小小的不匹配把问题往前推：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。证据开始要求更多耐心：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。最初的入口是“这个现象叫什么”。原来的解释无法收住的问题是“它在什么条件、尺度和重复模式下出现或改变”。这个改变先带来的，是让数字、位置和形状被放进同一张可检查的图里。问题换形以后，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：物质、运动和地球变化需要实验、测量和模型一起逼近，而不是只靠直觉争论。",
    "reflectionQuestionZh": "你脚下看似稳定的地面，可能在多长的时间里一直移动？"
  },
  "0533-physics": {
    "titleZh": "苹果和月亮之间",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "17 世纪英格兰，一位年轻学者在瘟疫期间离开大学回到乡下，继续独自思考光、运动和数学。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：把现象先命名、分类或记成单个结果。它的合理性在于让观察不至于散乱，也能让别人知道你正在看什么，原来的做法刚要收口，新的证据就露出缝隙：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。原来的整理方式开始失去弹性：问题在于，数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。原来的问题是“这个现象叫什么”。最后能带着人继续走的问题是“它在什么条件、尺度和重复模式下出现或改变”。等材料被这样处理后，数字、位置和形状被放进同一张可检查的图里。最后，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：物质、运动和地球变化需要实验、测量和模型一起逼近，而不是只靠直觉争论。",
    "reflectionQuestionZh": "你身边哪一个普通动作，可能和更大的自然规律连在一起？"
  },
  "0539-physical-sciences-not-elsewhere-classified": {
    "titleZh": "磁针旁边的电流",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "1820 年的哥本哈根，一个教师在课堂演示中发现，通电导线旁的磁针突然偏转。",
    "storyBodyZh": "起初，先被拿出来的解释是：把现象先命名、分类或记成单个结果。它的好处是让观察不至于散乱，也能让别人知道你正在看什么。可眼前的细节开始把问题推回来：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。它的边界也在这里显出来：数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。最早的问题是“这个现象叫什么”。问题慢慢变成“它在什么条件、尺度和重复模式下出现或改变”。这个补上的细节不大，却让下一步不能再照旧走。新的问法让数字、位置和形状被放进同一张可检查的图里。从这里开始，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：物质、运动和地球变化需要实验、测量和模型一起逼近，而不是只靠直觉争论。",
    "reflectionQuestionZh": "当一个小偏转让两个领域突然相遇，你会先修正实验，还是修正分类？"
  },
  "0541-mathematics": {
    "titleZh": "从一点到一座几何世界",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "公元前 3 世纪的亚历山大，一个教师面对学生，把点、线、圆和角整理成一条严格道路。",
    "storyBodyZh": "最初，眼前最方便的处理方式是：把现象先命名、分类或记成单个结果。这套办法有用，因为让观察不至于散乱，也能让别人知道你正在看什么。但眼前的材料没有顺着这个解释走：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。问题也在这里露出来：数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。原来的问题是“这个现象叫什么”。新的问法逐渐清楚“它在什么条件、尺度和重复模式下出现或改变”。它没有把答案一下子交出来，却让数字、位置和形状被放进同一张可检查的图里。这个补上的细节不大，却让下一步不能再照旧走。于是，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：数量和数据最有用的地方，是让关系、偏差、不确定性和推理路径被看见。",
    "reflectionQuestionZh": "当一个结论必须一步步被证明，它会不会也训练你更诚实地相信？"
  },
  "0542-statistics": {
    "titleZh": "他开始数街上的人",
    "summaryZh": "一个观察现场让名称变成测量、比较和可检查的图形。",
    "sceneZh": "19 世纪初的布鲁塞尔，夜空常常不够清楚，一个年轻天文学家只能等云散开，再把星星位置记在纸上。",
    "storyBodyZh": "刚进入现场时，人们往往先这样处理：把现象先命名、分类或记成单个结果。它并不是空想，原因在于让观察不至于散乱，也能让别人知道你正在看什么。偏偏有一处细节不肯归入原来的说法：单个记录看起来完整，放到另一组记录旁边却露出不一致；尺度、次数、位置或时间一变，答案也跟着变。这套做法开始显出边界：数量、尺度、位置、时间和重复观察怎样让结果变成证据，会被当成背景。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先重新测量数值，再把样本、地点或时间排成可比较的顺序，又画成表、图、尺度或分布来检查。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个数字要看旁边的尺度，一次观察要看它能不能在别处重复。第一层问题是“这个现象叫什么”。问题被推向另一句更难的话“它在什么条件、尺度和重复模式下出现或改变”。变化不是突然完成的，但它已经让数字、位置和形状被放进同一张可检查的图里。到这一步，好奇心被推向测量、比较和可反驳的解释。",
    "knowledgePointZh": "关键转向：数量和数据最有用的地方，是让关系、偏差、不确定性和推理路径被看见。",
    "reflectionQuestionZh": "你看到一个平均数时，最想知道它帮你看见了什么，又遮住了什么？"
  },
  "0611-computer-use": {
    "titleZh": "鼠标第一次指向屏幕",
    "summaryZh": "一个机器现场让信息的表示、通道和错误变得可见。",
    "sceneZh": "1968 年旧金山，一个工程师坐在舞台控制台前，屏幕上出现文字、窗口、链接和一个会移动的光标。",
    "storyBodyZh": "在最早的判断里，当时更顺手的做法是：把机器或工具看成完成任务的黑箱：能算、能传、能存，就算有用。它能先撑住局面，因为让人先使用系统，不必一开始就拆开所有内部结构。这时，一个小小的不匹配把问题往前推：噪声、重复、错误或数据混乱一出现，单靠更快的机器并不能让结果可靠。原来的解释在这里变窄：信息怎样被表示、传输、组织、恢复，以及人在失败时怎样找回路径，会被藏在界面后面。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先把输入和输出分开检查，再标出错误出现的位置，又重新设计编码、结构、通道或恢复步骤。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个输入要看它怎样被编码，一个错误要看系统能否把人带回来。原来的问法是“机器能不能完成这件事”。后来真正留下来的问题是“信息怎样被组织，才经得起噪声、错误和人的使用”。答案还没有封口，材料已经让符号、通道、规则和恢复路径被一起检查。后来再回看，工具问题变成了信息结构问题。",
    "knowledgePointZh": "关键转向：信息要被机器处理，必须先被表示、组织、传输、检查，并且能在失败时恢复。",
    "reflectionQuestionZh": "一个好工具是在替你思考，还是让你更容易看见并改写自己的思考？"
  },
  "0612-database-and-network-design-and-administration": {
    "titleZh": "表格为什么应该彼此有关系",
    "summaryZh": "一个机器现场让信息的表示、通道和错误变得可见。",
    "sceneZh": "20 世纪 60 年代末，一位 IBM 研究员看着企业数据系统，发现程序和数据像缠在一起的线团。",
    "storyBodyZh": "事情刚被记录下来时，最容易被采用的入口是：把机器或工具看成完成任务的黑箱：能算、能传、能存，就算有用。这种办法的价值在于让人先使用系统，不必一开始就拆开所有内部结构。原来的做法刚要收口，新的证据就露出缝隙：噪声、重复、错误或数据混乱一出现，单靠更快的机器并不能让结果可靠。原来的做法到这里不够用了：信息怎样被表示、传输、组织、恢复，以及人在失败时怎样找回路径，会被藏在界面后面。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先把输入和输出分开检查，再标出错误出现的位置，又重新设计编码、结构、通道或恢复步骤。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一个输入要看它怎样被编码，一个错误要看系统能否把人带回来。一开始能说出口的问题是“机器能不能完成这件事”。这时，问题换了形状“信息怎样被组织，才经得起噪声、错误和人的使用”。这一步没有结束争论，却让符号、通道、规则和恢复路径被一起检查。真正留下来的变化是：工具问题变成了信息结构问题。",
    "knowledgePointZh": "关键转向：信息要被机器处理，必须先被表示、组织、传输、检查，并且能在失败时恢复。",
    "reflectionQuestionZh": "当很多人必须同时信任同一份数据时，它应该靠记忆，还是靠结构？"
  },
  "0613-software-and-applications-development-and-analysis": {
    "titleZh": "她看见机器不只会算数",
    "summaryZh": "一个机器现场让信息的表示、通道和错误变得可见。",
    "sceneZh": "1833 年的伦敦，客厅里有人低声交谈。桌上的纸页和茶杯旁，一台由齿轮、轴杆和金属片组成的机器吸引着来客。",
    "storyBodyZh": "第一眼看过去，现场最先出现的判断是：把机器或工具看成完成任务的黑箱：能算、能传、能存，就算有用。它先解决了一个问题：让人先使用系统，不必一开始就拆开所有内部结构。可眼前的细节开始把问题推回来：噪声、重复、错误或数据混乱一出现，单靠更快的机器并不能让结果可靠。真正的卡点从这里出现：信息怎样被表示、传输、组织、恢复，以及人在失败时怎样找回路径，会被藏在界面后面。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先把输入和输出分开检查，再标出错误出现的位置，又重新设计编码、结构、通道或恢复步骤。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一个输入要看它怎样被编码，一个错误要看系统能否把人带回来。起初，人们问“机器能不能完成这件事”。问题继续往前推“信息怎样被组织，才经得起噪声、错误和人的使用”。新的理解先从这里长出来：符号、通道、规则和恢复路径被一起检查。这以后，工具问题变成了信息结构问题。",
    "knowledgePointZh": "关键转向：信息要被机器处理，必须先被表示、组织、传输、检查，并且能在失败时恢复。",
    "reflectionQuestionZh": "当机器开始执行人的想法时，最难的部分是机器足够聪明，还是人能不能把自己的想法说清楚？"
  },
  "0619-information-and-communication-technologies-icts-not-elsewhere-classified": {
    "titleZh": "钢琴卷纸和编译器",
    "summaryZh": "一个机器现场让信息的表示、通道和错误变得可见。",
    "sceneZh": "20 世纪中期，一位女性数学家在早期计算机旁工作，看到程序员被机器码和接线细节困住。",
    "storyBodyZh": "按当时的习惯，很多人会先这么做：把机器或工具看成完成任务的黑箱：能算、能传、能存，就算有用。它让人不至于完全乱掉，因为让人先使用系统，不必一开始就拆开所有内部结构。但眼前的材料没有顺着这个解释走：噪声、重复、错误或数据混乱一出现，单靠更快的机器并不能让结果可靠。现场把原来的做法推到边缘：信息怎样被表示、传输、组织、恢复，以及人在失败时怎样找回路径，会被藏在界面后面。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先把输入和输出分开检查，再标出错误出现的位置，又重新设计编码、结构、通道或恢复步骤。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一个输入要看它怎样被编码，一个错误要看系统能否把人带回来。原来的框架里，问题是“机器能不能完成这件事”。问题开始转向“信息怎样被组织，才经得起噪声、错误和人的使用”。问题变准以后，现场开始让符号、通道、规则和恢复路径被一起检查。原来的问法退后时，工具问题变成了信息结构问题。",
    "knowledgePointZh": "关键转向：信息要被机器处理，必须先被表示、组织、传输、检查，并且能在失败时恢复。",
    "reflectionQuestionZh": "当工具语言更接近人的语言，谁会第一次被允许进入技术世界？"
  },
  "0711-chemical-engineering-and-processes": {
    "titleZh": "工厂里的化学不再只是烧瓶",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪英国的化工厂旁，一个顾问和教师看见酸、碱、气体和设备在大规模生产里变得危险又昂贵。",
    "storyBodyZh": "按普通做法，一开始能撑住局面的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它看起来可靠，是因为让想法先落地，也让团队知道要朝哪个形状努力。偏偏有一处细节不肯归入原来的说法：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。原来的框架在这里开始松动：材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。刚开始的问题是“能不能把它做出来”。更锋利的问题出现了“怎样让它在材料、使用和风险面前长期站得住”。到这里，最重要的不是结论，而是图纸、现场和测试结果互相校正。原来的解释没有消失，但已经不能替所有证据说话。新的方法出现时，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "从烧瓶成功到工厂稳定，中间有哪些条件会突然变成真正的问题？"
  },
  "0712-environmental-protection-technology": {
    "titleZh": "水龙头里的安全",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "20 世纪初的美国城市里，自来水进入家庭，但病菌、管网和消毒剂剂量仍然让人不安。",
    "storyBodyZh": "照旧处理时，先被拿出来的解释是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它给了现场一个入口：让想法先落地，也让团队知道要朝哪个形状努力。这时，一个小小的不匹配把问题往前推：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。麻烦不是原来的做法全错：材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原先的问题是“能不能把它做出来”。真正需要回答的变成“怎样让它在材料、使用和风险面前长期站得住”。这个改变先带来的，是让图纸、现场和测试结果互相校正。它让问题的形状更清楚，也让后面的理解更稳。现场的意义变成：想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个环保技术如果每天都成功，你是不是反而最容易忘记它存在？"
  },
  "0713-electricity-and-energy": {
    "titleZh": "交流电的长路",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪末，一个移民工程师在美国工厂和实验室之间工作，脑子里不断想着旋转磁场。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它能被接受，是因为让想法先落地，也让团队知道要朝哪个形状努力，原来的做法刚要收口，新的证据就露出缝隙：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。这个细节把原来的问题拉长了：材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最容易先问的是“能不能把它做出来”。问题不再停在原处，而是变成“怎样让它在材料、使用和风险面前长期站得住”。等材料被这样处理后，图纸、现场和测试结果互相校正。那一刻之后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "你按下开关时，背后是哪一整套能源系统在替你工作？"
  },
  "0714-electronics-and-automation": {
    "titleZh": "蒸汽机自己调节速度",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "18 世纪的工坊里，蒸汽机一会儿太快一会儿太慢，工人必须不断照看速度。",
    "storyBodyZh": "先把混乱收住时，眼前最方便的处理方式是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它能先让人行动，因为让想法先落地，也让团队知道要朝哪个形状努力。可眼前的细节开始把问题推回来：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。原来的解释可以开头，却不能收尾：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最初被抓住的问题是“能不能把它做出来”。新的压力把问题改成“怎样让它在材料、使用和风险面前长期站得住”。新的问法把图纸、现场和测试结果互相校正。这层停顿让后面的判断多了一点重量。再看同一件事时，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "当机器能根据自己的误差调整行为，它和普通工具之间的界线在哪里？"
  },
  "0715-mechanics-and-metal-trades": {
    "titleZh": "螺丝终于可以彼此替换",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "18 世纪末的伦敦工坊里，一个年轻机械师反复改进车床，想让螺纹不再只靠师傅手感。",
    "storyBodyZh": "先把事情收进一个格子里，确实能带来秩序：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它的短处不在一开始，正因为让想法先落地，也让团队知道要朝哪个形状努力。但眼前的材料没有顺着这个解释走：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。事情没有停在原来的入口：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果把不合适的部分剪掉，故事会顺滑，却不会变聪明。接下来的动作很朴素：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。现场没有立刻变清楚，但原来的问题已经站不稳。记录之间开始出现可以追问的缝：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。一开始的问题是“能不能把它做出来”。这些材料把问题推向“怎样让它在材料、使用和风险面前长期站得住”。它没有把答案一下子交出来，却让图纸、现场和测试结果互相校正。这让人开始承认：想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个小螺丝如果不能被可靠复制，整台机器会失去什么？"
  },
  "0716-motor-vehicles-ships-and-aircraft": {
    "titleZh": "沙丘上的十二秒",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "1903 年北卡罗来纳的沙丘上，两位自行车店出身的兄弟把木架、布翼和发动机推向海风。",
    "storyBodyZh": "在第一层问题里，人们往往先这样处理：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它至少做到了一点：让想法先落地，也让团队知道要朝哪个形状努力。偏偏有一处细节不肯归入原来的说法：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。原来的做法开始漏掉关键部分：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果只保留已经会说的话，新的问法就没有地方长出来。它让人看见，真正有用的是这些慢动作：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最先出现的问题是“能不能把它做出来”。这几步把问题改写成“怎样让它在材料、使用和风险面前长期站得住”。变化不是突然完成的，但它已经让图纸、现场和测试结果互相校正。最后留下的是：想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "移动得更快之前，一个交通工具必须先学会怎样不失控？"
  },
  "0719-engineering-and-engineering-trades-not-elsewhere-classified": {
    "titleZh": "战斗机咳嗽了一下",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "第二次世界大战期间，一位女工程师听飞行员抱怨：战斗机俯冲后发动机会短暂失力。",
    "storyBodyZh": "旁人最容易先问的是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它保留了一种秩序：让想法先落地，也让团队知道要朝哪个形状努力。这时，一个小小的不匹配把问题往前推：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。这个不匹配让人慢下来：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原来的解释保护的问题是“能不能把它做出来”。现场让人不得不改问“怎样让它在材料、使用和风险面前长期站得住”。答案还没有封口，材料已经让图纸、现场和测试结果互相校正。原来的解释仍在桌上，只是不再拥有最后一句话。由此，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "临时修复什么时候是冒险，什么时候是经过约束检验后的工程智慧？"
  },
  "0721-food-processing": {
    "titleZh": "瓶子里的汤为什么没有坏",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪初的法国，一个糖果师把食物装进玻璃瓶，加热、密封，再观察它能保存多久。",
    "storyBodyZh": "现场最先给出的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它让判断先有落点：让想法先落地，也让团队知道要朝哪个形状努力，原来的做法刚要收口，新的证据就露出缝隙：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。这套办法越有效，边界也越清楚：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。它让问题的形状更清楚，也让后面的理解更稳。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。还没转向前，人们问的是“能不能把它做出来”。原来的问法被迫让出位置给“怎样让它在材料、使用和风险面前长期站得住”。这一步没有结束争论，却让图纸、现场和测试结果互相校正。慢慢地，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一份好吃的食物，要怎样才能经得起时间、距离和看不见的生命？"
  },
  "0722-materials-glass-paper-plastic-and-wood": {
    "titleZh": "橡胶不再怕热和冷",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪美国，一个负债累累的发明者反复摆弄天然橡胶，冬天变硬，夏天发黏的问题总解决不了。",
    "storyBodyZh": "人们先抓住的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它不是随便来的，因为让想法先落地，也让团队知道要朝哪个形状努力。可眼前的细节开始把问题推回来：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。一旦继续看下去，问题就变了：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。第一眼的问题是“能不能把它做出来”。接下来能继续工作的问法是“怎样让它在材料、使用和风险面前长期站得住”。新的理解先从这里长出来：图纸、现场和测试结果互相校正。更稳的判断是：想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "你选择材料时，是在选择它看起来怎样，还是选择它在压力下会怎样？"
  },
  "0723-textiles-clothes-footwear-and-leather": {
    "titleZh": "织机读懂了打孔卡",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪初的里昂，一个织工之子看见复杂花纹需要大量人力，也让纺织生产昂贵缓慢。",
    "storyBodyZh": "一开始能用的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它先帮人抓住了边界：让想法先落地，也让团队知道要朝哪个形状努力。但眼前的材料没有顺着这个解释走：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。现场没有接受太快的收束：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原本的问题是“能不能把它做出来”。被证据推出来的问题是“怎样让它在材料、使用和风险面前长期站得住”。问题变准以后，现场开始让图纸、现场和测试结果互相校正。这层停顿让后面的判断多了一点重量。真正被打开的是：想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "当图案变成机器可以读取的指令，工艺和计算之间的距离还剩多远？"
  },
  "0724-mining-and-extraction": {
    "titleZh": "矿井里的木梯和空气",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "16 世纪中欧矿区，一个医生兼学者下到矿井附近，观察矿工怎样通风、排水、支护和冶炼。",
    "storyBodyZh": "人们先抓住的办法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它让旁人能跟上，因为让想法先落地，也让团队知道要朝哪个形状努力。偏偏有一处细节不肯归入原来的说法：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。差异没有被原来的做法完全收住：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原来的解释没有消失，但已经不能替所有证据说话。原来的做法留下的问题是“能不能把它做出来”。这时更重要的问题变成“怎样让它在材料、使用和风险面前长期站得住”。到这里，最重要的不是结论，而是图纸、现场和测试结果互相校正。从这个动作往后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个产品看起来很干净时，它的地下故事被谁承担了？"
  },
  "0729-manufacturing-and-processing-not-elsewhere-classified": {
    "titleZh": "工厂为什么要停下来",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "20 世纪日本汽车工厂里，一个工程师看到库存堆得很高，却并不代表流程健康。",
    "storyBodyZh": "那时最稳妥的入口是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它能先压住混乱，因为让想法先落地，也让团队知道要朝哪个形状努力。这时，一个小小的不匹配把问题往前推：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。证据开始要求更多耐心：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最初的入口是“能不能把它做出来”。原来的解释无法收住的问题是“怎样让它在材料、使用和风险面前长期站得住”。这个改变先带来的，是让图纸、现场和测试结果互相校正。这个小停顿把证据和行动接在了一起。问题换形以后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一个工厂什么时候应该追求不停运转，什么时候应该停下来让问题出现？"
  },
  "0731-architecture-and-town-planning": {
    "titleZh": "她站在街角看人行道",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "20 世纪中期的纽约，一个写作者推着婴儿车走在街上，注意到孩子、店主、邻居和陌生人怎样共享人行道。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它的合理性在于让想法先落地，也让团队知道要朝哪个形状努力，原来的做法刚要收口，新的证据就露出缝隙：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。原来的整理方式开始失去弹性：问题在于，材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。原来的问题是“能不能把它做出来”。最后能带着人继续走的问题是“怎样让它在材料、使用和风险面前长期站得住”。等材料被这样处理后，图纸、现场和测试结果互相校正。最后，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "你熟悉的一条街，是被规划图救活的，还是被每天使用它的人救活的？"
  },
  "0732-building-and-civil-engineering": {
    "titleZh": "桥上的钢缆和病床旁的笔记",
    "summaryZh": "一个建造现场让图纸接受材料、流程和风险的检验。",
    "sceneZh": "19 世纪纽约，一座跨越 East River 的大桥开工后，主工程师病倒，工地却不能停。",
    "storyBodyZh": "起初，当时更顺手的做法是：把图纸变成实物：只要造出来、跑起来、看起来对，就算成功。它的好处是让想法先落地，也让团队知道要朝哪个形状努力。可眼前的细节开始把问题推回来：真实世界不会按图纸保持安静；热、冷、磨损、重量、流量或人的操作会把弱点推出来。它的边界也在这里显出来：材料、负载、流程、维护、安全边界和反复使用会等到失败时才开口。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先检查材料和尺寸，再记录失效或卡住的位置，又调整结构、流程或测试条件后再试一次。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个尺寸要看负载，一次成功要看下一次使用会不会让它失效。最早的问题是“能不能把它做出来”。问题慢慢变成“怎样让它在材料、使用和风险面前长期站得住”。这个补上的细节不大，却让下一步不能再照旧走。新的问法把图纸、现场和测试结果互相校正。从这里开始，想法开始接受真实约束的检验。",
    "knowledgePointZh": "关键转向：想法只有经过材料、结构、流程、维护和风险的检验，才会成为可靠的实体系统。",
    "reflectionQuestionZh": "一座桥建成时，除了钢和石头，还有谁的学习、照护和坚持被埋进结构里？"
  },
  "0811-crop-and-livestock-production": {
    "titleZh": "花生不是穷作物",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "20 世纪初的美国南方，一个农业教师走进被棉花耗累的土地，手里拿着花生、甘薯和土样。",
    "storyBodyZh": "最初，最容易被采用的入口是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。这套办法有用，因为回应眼前的饥饿、收入和供应压力。但眼前的材料没有顺着这个解释走：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。问题也在这里露出来：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。原来的问题是“怎样马上得到更多产出”。新的问法逐渐清楚“哪些生命条件会让结果持续变好或变坏”。它没有把答案一下子交出来，却让地块、动物、天气和人的决定被放在同一条时间线上。于是，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "一种被看低的作物，什么时候可能成为土地和家庭重新恢复的入口？"
  },
  "0812-horticulture": {
    "titleZh": "一棵李树开出太多可能",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "19 世纪末的加州，一个年轻人从东部来到气候温和的土地上，开始试验果树、花卉和种子。",
    "storyBodyZh": "刚进入现场时，现场最先出现的判断是：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它并不是空想，原因在于回应眼前的饥饿、收入和供应压力。偏偏有一处细节不肯归入原来的说法：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。这套做法开始显出边界：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。第一层问题是“怎样马上得到更多产出”。问题被推向另一句更难的话“哪些生命条件会让结果持续变好或变坏”。变化不是突然完成的，但它已经让地块、动物、天气和人的决定被放在同一条时间线上。到这一步，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "当你照料一株植物时，你是在让它服从，还是在和它的可能性合作？"
  },
  "0819-agriculture-not-elsewhere-classified": {
    "titleZh": "一根稻草也可以是一种哲学",
    "summaryZh": "一个生命现场让产出问题变成长期条件的判断。",
    "sceneZh": "20 世纪日本乡间，一个受过植物病理学训练的人回到家乡田地，开始怀疑现代农业是否越做越复杂。",
    "storyBodyZh": "在最早的判断里，很多人会先这么做：把土地、作物或动物先当成产出问题：多种一点、多养一点、收成好一点。它能先撑住局面，因为回应眼前的饥饿、收入和供应压力。这时，一个小小的不匹配把问题往前推：产量、病害或动物反应并不按人的愿望走；一个地方的改动，会在另一处显出后果。原来的解释在这里变窄：土壤、水、疾病、季节、动物行为和长期照料会被推到下一季。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先标记地块、品种或动物反应，再记录天气、病害、饲料或土壤变化，又把不同季节和处理方式放在一起比较。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个收成要看土壤和季节，一次照料要看它把后果推向哪里。原来的问法是“怎样马上得到更多产出”。后来真正留下来的问题是“哪些生命条件会让结果持续变好或变坏”。答案还没有封口，材料已经让地块、动物、天气和人的决定被放在同一条时间线上。后来再回看，照料变成了对生命系统的长期判断。",
    "knowledgePointZh": "关键转向：照料生命不能只看眼前产出，还要看土壤、水、疾病、动物、人和长期风险怎样互相牵动。",
    "reflectionQuestionZh": "少做一件事，什么时候不是偷懒，而是对生态过程的信任？"
  },
  "0911-dental-studies": {
    "titleZh": "牙医不该只是拔牙的人",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "18 世纪巴黎，一个外科医生面对牙痛、假牙、蛀牙和口腔感染，发现街头拔牙远远不够。",
    "storyBodyZh": "事情刚被记录下来时，一开始能撑住局面的办法是：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。这种办法的价值在于让紧急状况先被处理，也能让照护有明确入口。原来的做法刚要收口，新的证据就露出缝隙：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。原来的做法到这里不够用了：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。一开始能说出口的问题是“这个症状或需求该怎么处理”。这时，问题换了形状“怎样在风险、证据和人的生活之间作出可靠照护”。新的问法让人不能只带着原来的解释离开现场。这一步没有结束争论，却让记录、身体反应和人的处境被一起看见。真正留下来的变化是：处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "如果牙齿影响吃饭、说话和自尊，为什么口腔健康不该被当成小事？"
  },
  "0912-medicine": {
    "titleZh": "产房里的洗手盆",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "19 世纪维也纳的产科病房里，一个年轻医生发现两个产房的产妇死亡率差得让人无法安心。",
    "storyBodyZh": "第一眼看过去，先被拿出来的解释是：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它先解决了一个问题：让紧急状况先被处理，也能让照护有明确入口。可眼前的细节开始把问题推回来：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。真正的卡点从这里出现：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。起初，人们问“这个症状或需求该怎么处理”。问题继续往前推“怎样在风险、证据和人的生活之间作出可靠照护”。这让材料继续抵抗原来的解释，也让后面的判断更稳。新的理解先从这里长出来：记录、身体反应和人的处境被一起看见。这以后，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "当证据说明问题可能出在自己手上，你还能不能接受它？"
  },
  "0913-nursing-and-midwifery": {
    "titleZh": "夜里那盏灯",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "1850 年代的军医院里，走廊潮湿、床位拥挤，伤兵身上的问题不只来自战场。",
    "storyBodyZh": "按当时的习惯，眼前最方便的处理方式是：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它让人不至于完全乱掉，因为让紧急状况先被处理，也能让照护有明确入口。但眼前的材料没有顺着这个解释走：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。现场把原来的做法推到边缘：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。原来的框架里，问题是“这个症状或需求该怎么处理”。问题开始转向“怎样在风险、证据和人的生活之间作出可靠照护”。问题变准以后，现场开始让记录、身体反应和人的处境被一起看见。原来的问法退后时，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "真正的照护，是等医生下指令，还是在细节恶化之前先看见变化？"
  },
  "0914-medical-diagnostic-and-treatment-technology": {
    "titleZh": "手骨第一次出现在照片里",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "1895 年的德国实验室里，一个物理学家研究阴极射线管，忽然发现远处涂层在黑暗中发光。",
    "storyBodyZh": "按普通做法，人们往往先这样处理：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它看起来可靠，是因为让紧急状况先被处理，也能让照护有明确入口。偏偏有一处细节不肯归入原来的说法：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。原来的框架在这里开始松动：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。刚开始的问题是“这个症状或需求该怎么处理”。更锋利的问题出现了“怎样在风险、证据和人的生活之间作出可靠照护”。这时，新的问法把注意力从结论拉回证据。到这里，最重要的不是结论，而是记录、身体反应和人的处境被一起看见。新的方法出现时，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：看见身体内部并不自动带来安全；影像、解释、剂量和防护必须一起进入判断。",
    "reflectionQuestionZh": "当技术让身体变得可见，它同时让哪些风险也必须被看见？"
  },
  "0915-therapy-and-rehabilitation": {
    "titleZh": "病人不是出院就结束了",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "第二次世界大战后，许多伤兵和病人活了下来，却发现活下来不等于能重新走路、工作和生活。",
    "storyBodyZh": "照旧处理时，当时更顺手的做法是：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它给了现场一个入口：让紧急状况先被处理，也能让照护有明确入口。这时，一个小小的不匹配把问题往前推：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。麻烦不是原来的做法全错：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果只保留最省事的解释，材料之间的冲突就没有机会说话。那个人先把手伸向材料：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。事情在这里慢了一拍，原来的解释也因此露出空隙。几组细节被放在一起后，问题变得更窄也更锋利：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。原先的问题是“这个症状或需求该怎么处理”。真正需要回答的变成“怎样在风险、证据和人的生活之间作出可靠照护”。这个改变先带来的，是让记录、身体反应和人的处境被一起看见。现场的意义变成：处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "恢复是不是回到过去，还是学会带着新的身体条件继续生活？"
  },
  "0916-pharmacy": {
    "titleZh": "药房不只是卖药的柜台",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "19 世纪费城，一个年轻药剂师在柜台后调配药物，也看见药品质量、剂量和训练并不总可靠。",
    "storyBodyZh": "在原来的框架里，这种做法并非没有道理：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它能被接受，是因为让紧急状况先被处理，也能让照护有明确入口，原来的做法刚要收口，新的证据就露出缝隙：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。这个细节把原来的问题拉长了：身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果停在第一层答案，真正能改变行动的线索会被落下。问题开始通过动作移动：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。材料被重新摆放后，原来的问法不再够用。证据不再分散时，旧解释开始接受检查：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。最容易先问的是“这个症状或需求该怎么处理”。问题不再停在原处，而是变成“怎样在风险、证据和人的生活之间作出可靠照护”。等材料被这样处理后，记录、身体反应和人的处境被一起看见。那一刻之后，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "一粒药真正进入生活时，需要哪些知识保护它不被误用？"
  },
  "0917-traditional-and-complementary-medicine-and-therapy": {
    "titleZh": "药草书里的长期修订",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "16 世纪中国，一个医生走访山野、市场和旧书，发现许多药名、产地和用法彼此混乱。",
    "storyBodyZh": "先把混乱收住时，最容易被采用的入口是：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它能先让人行动，因为让紧急状况先被处理，也能让照护有明确入口。可眼前的细节开始把问题推回来：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。原来的解释可以开头，却不能收尾：问题在于，身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果太快完成分类，现场就只剩标签，不再留下证据压力。证据被一点点整理出来：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。这时，动作比判断更重要，因为判断还需要被校正。材料一旦互相照面，隐藏的关系就不再安静：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。最初被抓住的问题是“这个症状或需求该怎么处理”。新的压力把问题改成“怎样在风险、证据和人的生活之间作出可靠照护”。这时，新的问法已经压过原来的解释。新的问法让记录、身体反应和人的处境被一起看见。再看同一件事时，处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "尊重传统时，怎样同时保留追问证据和保护安全的勇气？"
  },
  "0919-health-not-elsewhere-classified": {
    "titleZh": "老鼠为什么生病了",
    "summaryZh": "一个照护现场让症状背后的风险、证据和尊严同时出现。",
    "sceneZh": "20 世纪 30 年代，一个年轻研究者给实验动物注射不同提取物，却发现它们出现相似身体反应。",
    "storyBodyZh": "先把事情收进一个格子里，确实能带来秩序：把健康问题先看成一个症状、一次治疗或一个需要被照看的对象。它的短处不在一开始，正因为让紧急状况先被处理，也能让照护有明确入口。但眼前的材料没有顺着这个解释走：同样的症状、护理需求或身体反应在不同处境里会走向不同后果；只处理眼前一项，问题很快又回来。事情没有停在原来的入口：问题在于，身体变化、环境、风险、解释、尊严和持续支持会留在记录之外。如果把不合适的部分剪掉，故事会顺滑，却不会变聪明。接下来的动作很朴素：先观察变化的时间和细节，再核对记录、环境和人的感受，又调整照护、治疗、解释或支持安排。现场没有立刻变清楚，但原来的问题已经站不稳。记录之间开始出现可以追问的缝：一个症状要看时间和处境，一次帮助要看它是否保住人的选择。一开始的问题是“这个症状或需求该怎么处理”。这些材料把问题推向“怎样在风险、证据和人的生活之间作出可靠照护”。它没有把答案一下子交出来，却让记录、身体反应和人的处境被一起看见。这让人开始承认：处理身体的动作开始带上判断和尊严。",
    "knowledgePointZh": "关键转向：身体照护要把证据、技术、风险、解释和人的处境放在一起判断。",
    "reflectionQuestionZh": "当你说自己只是累了，身体会不会其实已经在长期报警？"
  },
  "0921-care-of-the-elderly-and-of-disabled-adults": {
    "titleZh": "他想自己决定几点睡",
    "summaryZh": "一个求助现场让帮助从补缺口变成保留人的选择。",
    "sceneZh": "20 世纪 60 年代的加州，一个重度残障青年想上大学，却被安排住在校医院，而不是普通宿舍。",
    "storyBodyZh": "在第一层问题里，现场最先出现的判断是：把求助看成单个困难：缺钱、缺照护、缺住处，先补上一项就好。它至少做到了一点：让危险先降下来，也让支持尽快抵达。偏偏有一处细节不肯归入原来的说法：同一个人常常同时被家庭、制度、身体和羞耻感拉住；只补一项，另一处又会断开。原来的做法开始漏掉关键部分：问题在于，人的选择、关系和长期参与会被善意一起拿走。如果只保留已经会说的话，新的问法就没有地方长出来。它让人看见，真正有用的是这些慢动作：先听完整条生活路径，再标出家庭、机构和资源之间的断点，又重新安排支持、边界和选择权。证据被放慢之后，差异才有机会显出来。这些细节合在一起，才让判断有了落点：一次帮助要看它接住了什么，也要看它有没有制造新的依赖。最先出现的问题是“这个人缺什么帮助”。这几步把问题改写成“怎样支持他，同时不夺走他的选择和位置”。变化不是突然完成的，但它已经让个人需要、家庭关系和制度入口被放到同一张图上。最后留下的是：福利不再只是发放，而是在脆弱时刻保留人的参与。",
    "knowledgePointZh": "关键转向：福利和照护要托住脆弱时刻，同时尽量保留人的选择、尊严和参与。",
    "reflectionQuestionZh": "帮助一个人时，怎样确保你没有顺手拿走他的决定权？"
  },
  "0922-child-care-and-youth-services": {
    "titleZh": "孩子也有自己的共和国",
    "summaryZh": "一个求助现场让帮助从补缺口变成保留人的选择。",
    "sceneZh": "20 世纪初的华沙，一位照顾孤儿的医生在院舍里设置儿童议会、法庭和报纸。",
    "storyBodyZh": "旁人最容易先问的是：把求助看成单个困难：缺钱、缺照护、缺住处，先补上一项就好。它保留了一种秩序：让危险先降下来，也让支持尽快抵达。这时，一个小小的不匹配把问题往前推：同一个人常常同时被家庭、制度、身体和羞耻感拉住；只补一项，另一处又会断开。这个不匹配让人慢下来：问题在于，人的选择、关系和长期参与会被善意一起拿走。如果把麻烦推回背景，下一步决策仍会踩在同一个洞上。他把解释暂时放下：先听完整条生活路径，再标出家庭、机构和资源之间的断点，又重新安排支持、边界和选择权。这些细节没有直接给答案，却开始限制答案能怎么说。材料被重新安排后，现场多出一层读法：一次帮助要看它接住了什么，也要看它有没有制造新的依赖。原来的解释保护的问题是“这个人缺什么帮助”。现场让人不得不改问“怎样支持他，同时不夺走他的选择和位置”。到这里，新的问法不是口号，而是被材料逼出来的下一步。答案还没有封口，材料已经让个人需要、家庭关系和制度入口被放到同一张图上。由此，福利不再只是发放，而是在脆弱时刻保留人的参与。",
    "knowledgePointZh": "关键转向：福利和照护要托住脆弱时刻，同时尽量保留人的选择、尊严和参与。",
    "reflectionQuestionZh": "当成年人说“为了孩子好”时，孩子自己的声音在哪里？"
  },
  "0923-social-work-and-counselling": {
    "titleZh": "她先画出家庭和邻里关系",
    "summaryZh": "一个求助现场让帮助从补缺口变成保留人的选择。",
    "sceneZh": "19 世纪末的美国城市里，一个慈善组织工作者面对求助家庭，发现简单发放物资常常不够。",
    "storyBodyZh": "现场最先给出的办法是：把求助看成单个困难：缺钱、缺照护、缺住处，先补上一项就好。它让判断先有落点：让危险先降下来，也让支持尽快抵达，原来的做法刚要收口，新的证据就露出缝隙：同一个人常常同时被家庭、制度、身体和羞耻感拉住；只补一项，另一处又会断开。这套办法越有效，边界也越清楚：问题在于，人的选择、关系和长期参与会被善意一起拿走。如果这个解释立刻胜出，最值得核对的细节就会失去重量。她把现场重新过了一遍：先听完整条生活路径，再标出家庭、机构和资源之间的断点，又重新安排支持、边界和选择权。到这一步，问题从口头争论变成了可检查的安排。几次比较之后，判断有了可回头检查的地方：一次帮助要看它接住了什么，也要看它有没有制造新的依赖。还没转向前，人们问的是“这个人缺什么帮助”。原来的问法被迫让出位置给“怎样支持他，同时不夺走他的选择和位置”。这一步没有结束争论，却让个人需要、家庭关系和制度入口被放到同一张图上。慢慢地，福利不再只是发放，而是在脆弱时刻保留人的参与。",
    "knowledgePointZh": "关键转向：福利和照护要托住脆弱时刻，同时尽量保留人的选择、尊严和参与。",
    "reflectionQuestionZh": "当一个人求助时，你能不能看见问题背后的关系和制度？"
  },
  "0929-welfare-not-elsewhere-classified": {
    "titleZh": "战场上的红十字臂章",
    "summaryZh": "一个求助现场让帮助从补缺口变成保留人的选择。",
    "sceneZh": "1859 年意大利 Solferino 战场附近，一个瑞士商人偶然看见成千上万伤兵无人照料。",
    "storyBodyZh": "人们先抓住的办法是：把求助看成单个困难：缺钱、缺照护、缺住处，先补上一项就好。它不是随便来的，因为让危险先降下来，也让支持尽快抵达。可眼前的细节开始把问题推回来：同一个人常常同时被家庭、制度、身体和羞耻感拉住；只补一项，另一处又会断开。一旦继续看下去，问题就变了：问题在于，人的选择、关系和长期参与会被善意一起拿走。如果急着下结论，现场里的差异就会被盖住。他们让材料先排好队：先听完整条生活路径，再标出家庭、机构和资源之间的断点，又重新安排支持、边界和选择权。原来的解释还在桌上，但它已经不能独自解释全部材料。材料不再只是背景时，问题也换了重量：一次帮助要看它接住了什么，也要看它有没有制造新的依赖。第一眼的问题是“这个人缺什么帮助”。接下来能继续工作的问法是“怎样支持他，同时不夺走他的选择和位置”。原来的问题仍有用，新的问法让判断多了一层检查。新的理解先从这里长出来：个人需要、家庭关系和制度入口被放到同一张图上。原来的解释还可以开头，却不能再独自收尾。更稳的判断是：福利不再只是发放，而是在脆弱时刻保留人的参与。",
    "knowledgePointZh": "关键转向：福利和照护要托住脆弱时刻，同时尽量保留人的选择、尊严和参与。",
    "reflectionQuestionZh": "当一个人受伤时，为什么他的阵营不该决定他是否值得被救？"
  },
  "1011-domestic-services": {
    "titleZh": "厨房里的化学课",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "19 世纪末的美国，一位女性化学家走进厨房、水槽和餐桌，发现家庭生活里到处都是科学问题。",
    "storyBodyZh": "一开始能用的办法是：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它先帮人抓住了边界：让工作先被分配，也让现场不至于失去秩序。但眼前的材料没有顺着这个解释走：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。现场没有接受太快的收束：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果急着把它写成常识，证据就不再逼人改变问题。接下来不是宣布答案：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。真正的变化不是灵感，而是证据位置变了。证据被放进同一条线上后，原来的说法必须让路：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。原本的问题是“这项服务有没有做完”。被证据推出来的问题是“整条路径怎样让人安全、清楚并被看见”。问题变准以后，现场开始让前台、后台、空间和人的感受被画到同一条路径上。真正被打开的是：一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "一个家变得好用，是因为有人天生会做，还是因为有一整套被忽略的知识？"
  },
  "1012-hair-and-beauty-services": {
    "titleZh": "她把头发护理做成事业",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "20 世纪初的美国，一个曾长期为脱发烦恼的女性，开始试验护发产品，并挨家挨户向顾客讲解。",
    "storyBodyZh": "人们先抓住的办法是：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它让旁人能跟上，因为让工作先被分配，也让现场不至于失去秩序。偏偏有一处细节不肯归入原来的说法：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。差异没有被原来的做法完全收住：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果把材料收得太齐，人的判断会失去校正机会。有人开始把问题拆开：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。这几次核对让人看见，问题不只在表面。被核对过的细节开始逼近新的问法：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。原来的做法留下的问题是“这项服务有没有做完”。这时更重要的问题变成“整条路径怎样让人安全、清楚并被看见”。到这里，最重要的不是结论，而是前台、后台、空间和人的感受被画到同一条路径上。从这个动作往后，一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "一次发型服务，什么时候也在处理尊严、身份和经济机会？"
  },
  "1013-hotel-restaurants-and-catering": {
    "titleZh": "厨房像军队一样有秩序",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "19 世纪末的欧洲酒店厨房里，炉火、锅具、侍者和订单交错，一个厨师发现混乱会毁掉最好的菜。",
    "storyBodyZh": "那时最稳妥的入口是：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它能先压住混乱，因为让工作先被分配，也让现场不至于失去秩序。这时，一个小小的不匹配把问题往前推：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。证据开始要求更多耐心：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果让原来的做法独自收尾，后果通常会在别处重新出现。现场的工作变得可见：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。现场仍然复杂，但复杂不再只是混乱。现场材料慢慢形成一个可以追问的面：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。最初的入口是“这项服务有没有做完”。原来的解释无法收住的问题是“整条路径怎样让人安全、清楚并被看见”。这个改变先带来的，是让前台、后台、空间和人的感受被画到同一条路径上。问题换形以后，一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "一次好用餐，哪些部分不是味道，却决定你会不会记住它？"
  },
  "1014-sports": {
    "titleZh": "冬天室内也能玩的球",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "1891 年马萨诸塞的冬天，一个体育教师面对一群精力旺盛却不能总在户外训练的学生。",
    "storyBodyZh": "事情还没复杂起来时，这种做法并非没有道理：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它的合理性在于让工作先被分配，也让现场不至于失去秩序，原来的做法刚要收口，新的证据就露出缝隙：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。原来的整理方式开始失去弹性：问题在于，前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果只留下方便说出口的解释，真正需要改变的条件会被留下。下一步先落在手上：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。材料一旦排开，问题就很难回到原来的样子。几样东西靠近以后，答案不能再只靠直觉：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。原来的问题是“这项服务有没有做完”。最后能带着人继续走的问题是“整条路径怎样让人安全、清楚并被看见”。等材料被这样处理后，前台、后台、空间和人的感受被画到同一条路径上。最后，一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "一条好规则，是限制了运动，还是让更好的运动成为可能？"
  },
  "1015-travel-tourism-and-leisure": {
    "titleZh": "一张火车票里的旅行社",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "1841 年英国，一个木工出身的传教士组织数百人乘火车去参加集会，必须处理票价、时间和秩序。",
    "storyBodyZh": "起初，很多人会先这么做：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。它的好处是让工作先被分配，也让现场不至于失去秩序。可眼前的细节开始把问题推回来：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。它的边界也在这里显出来：前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果只保留这个解释，现场会被整理得很快，却也会把最该追问的差异压平。于是，接下来的动作落到手上：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。判断在这里慢下来，先把记录逐项摆开。被重新摆放以后，这些记录被放到一起：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。最早的问题是“这项服务有没有做完”。问题慢慢变成“整条路径怎样让人安全、清楚并被看见”。新的问法让前台、后台、空间和人的感受被画到同一条路径上。从这里开始，一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "旅行里的自由，为什么常常依赖别人已经设计好的秩序？"
  },
  "1019-personal-services-not-elsewhere-classified": {
    "titleZh": "一个陌生人替他看见标签",
    "summaryZh": "一个服务现场让前台动作背后的整条路径显出来。",
    "sceneZh": "21 世纪，一个视障用户在厨房拿起一罐食品，却不确定标签上写的到底是什么。",
    "storyBodyZh": "最初，一开始能撑住局面的办法是：把服务看成完成一个动作：递交、接待、清洁、运输、保护或回应。这套办法有用，因为让工作先被分配，也让现场不至于失去秩序。但眼前的材料没有顺着这个解释走：当人真正抵达现场，噪声、排队、误解、风险或身体限制会让“完成了”变得不够。问题也在这里露出来：前台动作背后的流程、空间、信息、权限、等待和感受会被算成顾客自己的问题。如果这时急着收口，最刺眼的差异反而会被当成杂音。接下来，工作不再停在想法上：先沿着人的路径走一遍，再标出卡住、等待或误解的位置，又重新安排流程、空间、提示或责任。结论暂时退到后面，细节开始改变判断。材料放到同一处之后，彼此开始校正：一个动作要看前后路径，一次接待要看等待、权限和误解在哪里发生。原来的问题是“这项服务有没有做完”。新的问法逐渐清楚“整条路径怎样让人安全、清楚并被看见”。它没有把答案一下子交出来，却让前台、后台、空间和人的感受被画到同一条路径上。于是，一个动作变成了可设计、可协调、可改进的体验。",
    "knowledgePointZh": "关键转向：贴身服务从来不只是完成一个动作，它还牵动身体感受、身份、信任和机会。",
    "reflectionQuestionZh": "哪一种帮助小到不容易命名，却刚好让一个人能继续独立生活？"
  },
  "1021-community-sanitation": {
    "titleZh": "贫民区的排水沟",
    "summaryZh": "一个安全现场让风险从个人小心转向环境安排。",
    "sceneZh": "19 世纪英国工业城市里，一个改革者调查工人居住区，看到污水、拥挤住房和疾病紧紧相连。",
    "storyBodyZh": "刚进入现场时，先被拿出来的解释是：把卫生和安全看成清理现场或提醒个人小心。它并不是空想，原因在于快速减少眼前混乱，也容易分配责任。偏偏有一处细节不肯归入原来的说法：垃圾、水、毒物、通道、通风或出口一旦反复出事，就说明问题不只在某个人身上。这套做法开始显出边界：环境、流程、材料、制度和权力关系会继续制造同样风险。如果把这个解释当作终点，现场里真正麻烦的部分就会退回背景。真正推动问题变化的，是一连串动作：先检查现场路径和暴露点，再记录事故或投诉重复出现的位置，又改变设备、流程、标识或责任安排。这不是给原来的解释换个说法，而是让材料先互相核对。证据排开以后，细节之间有了新的距离：一个事故要看它重复在哪里，一条规则要看它能否改变现场行为。第一层问题是“谁没有小心或哪里不干净”。问题被推向另一句更难的话“什么环境安排一直在制造风险”。变化不是突然完成的，但它已经让现场、材料和人的行动被一起检查。阻力因此留在故事里，新的问法也不再悬空。到这一步，安全从提醒个人变成了设计环境。",
    "knowledgePointZh": "关键转向：卫生和职业安全要看环境、流程、材料、制度和权力关系怎样一起制造或降低风险。",
    "reflectionQuestionZh": "当一个地方不干净，你会先责怪个人，还是先看系统给了他们什么条件？"
  },
  "1022-occupational-health-and-safety": {
    "titleZh": "铅尘落在工人的衣服上",
    "summaryZh": "一个安全现场让风险从个人小心转向环境安排。",
    "sceneZh": "20 世纪初的美国，一位女医生进入铅厂、橡胶厂和油漆车间，询问工人头痛、麻木和中毒症状。",
    "storyBodyZh": "在最早的判断里，眼前最方便的处理方式是：把卫生和安全看成清理现场或提醒个人小心。它能先撑住局面，因为快速减少眼前混乱，也容易分配责任。这时，一个小小的不匹配把问题往前推：垃圾、水、毒物、通道、通风或出口一旦反复出事，就说明问题不只在某个人身上。原来的解释在这里变窄：环境、流程、材料、制度和权力关系会继续制造同样风险。如果只求快速归类，证据里最有用的裂缝会被抹平。他没有靠一句判断收尾：先检查现场路径和暴露点，再记录事故或投诉重复出现的位置，又改变设备、流程、标识或责任安排。故事在这里停了一下，把注意力交给那些不肯合拢的细节。几项记录靠近以后，原来的解释不能随便跳过：一个事故要看它重复在哪里，一条规则要看它能否改变现场行为。原来的问法是“谁没有小心或哪里不干净”。后来真正留下来的问题是“什么环境安排一直在制造风险”。答案还没有封口，材料已经让现场、材料和人的行动被一起检查。原来的解释仍在桌上，只是不再拥有最后一句话。后来再回看，安全从提醒个人变成了设计环境。",
    "knowledgePointZh": "关键转向：卫生和职业安全要看环境、流程、材料、制度和权力关系怎样一起制造或降低风险。",
    "reflectionQuestionZh": "如果一个工伤反复出现，它是个人失误，还是现场在重复制造危险？"
  },
  "1029-hygiene-and-occupational-health-services-not-elsewhere-classified": {
    "titleZh": "工厂火灾后的出口门",
    "summaryZh": "一个安全现场让风险从个人小心转向环境安排。",
    "sceneZh": "1911 年纽约 Triangle Shirtwaist Factory 火灾后，一个年轻社会改革者站在悲痛和愤怒之间，追问为什么门会被锁上。",
    "storyBodyZh": "事情刚被记录下来时，人们往往先这样处理：把卫生和安全看成清理现场或提醒个人小心。这种办法的价值在于快速减少眼前混乱，也容易分配责任。原来的做法刚要收口，新的证据就露出缝隙：垃圾、水、毒物、通道、通风或出口一旦反复出事，就说明问题不只在某个人身上。原来的做法到这里不够用了：环境、流程、材料、制度和权力关系会继续制造同样风险。如果不继续追问，整齐记录会遮住还在活动的问题。她没有把答案写死：先检查现场路径和暴露点，再记录事故或投诉重复出现的位置，又改变设备、流程、标识或责任安排。这一步让人先留在证据旁边，而不是急着收成结论。材料被按顺序放好以后，差异有了形状：一个事故要看它重复在哪里，一条规则要看它能否改变现场行为。一开始能说出口的问题是“谁没有小心或哪里不干净”。这时，问题换了形状“什么环境安排一直在制造风险”。这一步没有结束争论，却让现场、材料和人的行动被一起检查。真正留下来的变化是：安全从提醒个人变成了设计环境。",
    "knowledgePointZh": "关键转向：卫生和职业安全要看环境、流程、材料、制度和权力关系怎样一起制造或降低风险。",
    "reflectionQuestionZh": "一个出口门被锁上时，锁住的是通道，还是整个社会对劳动者生命的想象？"
  },
  "1031-military-and-defence": {
    "titleZh": "胜利之前先计算代价",
    "summaryZh": "一个保护现场让力量必须接受证据和程序的约束。",
    "sceneZh": "古代中国的战乱时代，一个军事思想者看见军队、粮草、地形、间谍和君主情绪如何决定生死。",
    "storyBodyZh": "第一眼看过去，当时更顺手的做法是：把安全看成巡逻、锁门、抓人或快速反应。它先解决了一个问题：让危险先被压住，也能给公众一个可见的秩序。可眼前的细节开始把问题推回来：现场留下的痕迹、权力边界和人的权利并不会因为危险过去就消失。真正的卡点从这里出现：证据、程序、合法性和监督会被有效率的行动盖住。如果马上宣布结论，后面的行动就只是在维护原来的说法。他们把结论往后放了一步：先保存现场细节，再核对痕迹、目击和记录，又把证据链与权力边界一起检查。到这里，问题没有被解决，反而变得更准确。同一张桌上的材料开始互相提醒：一次接触要看留下了什么痕迹，一次行动要看权力是否被约束。起初，人们问“怎样尽快控制危险”。问题继续往前推“什么证据和程序能让保护不变成新的伤害”。这让材料继续抵抗原来的解释，也让后面的判断更稳。新的理解先从这里长出来：痕迹、记录和程序被放在同一条证据链上。这个补上的细节不大，却让下一步不能再照旧走。这以后，保护不再只靠力量，也要靠能被检验的证据和边界。",
    "knowledgePointZh": "关键转向：力量不是单独存在的答案；补给、地形、情报、士气和政治目标会一起决定行动是否值得。",
    "reflectionQuestionZh": "真正的防御只是拥有力量，还是知道什么时候不该使用力量？"
  },
  "1032-protection-of-persons-and-property": {
    "titleZh": "每一次接触都会留下痕迹",
    "summaryZh": "一个保护现场让力量必须接受证据和程序的约束。",
    "sceneZh": "20 世纪初的法国里昂，一个年轻法医学者在实验室里研究灰尘、纤维、玻璃和指纹。",
    "storyBodyZh": "按当时的习惯，最容易被采用的入口是：把安全看成巡逻、锁门、抓人或快速反应。它让人不至于完全乱掉，因为让危险先被压住，也能给公众一个可见的秩序。但眼前的材料没有顺着这个解释走：现场留下的痕迹、权力边界和人的权利并不会因为危险过去就消失。现场把原来的做法推到边缘：证据、程序、合法性和监督会被有效率的行动盖住。如果只让这套做法工作，现场会安静下来，问题却没有真的消失。现场需要的不是口号，而是动作：先保存现场细节，再核对痕迹、目击和记录，又把证据链与权力边界一起检查。这几步让现场从背景变成了推理的一部分。这些记录不再只是记录：一次接触要看留下了什么痕迹，一次行动要看权力是否被约束。原来的框架里，问题是“怎样尽快控制危险”。问题开始转向“什么证据和程序能让保护不变成新的伤害”。问题变准以后，现场开始让痕迹、记录和程序被放在同一条证据链上。它让人看见，原来的问法退后时，保护不再只靠力量，也要靠能被检验的证据和边界。",
    "knowledgePointZh": "关键转向：保护人需要力量，也需要证据、边界、责任和能约束权力的程序。",
    "reflectionQuestionZh": "如果每一次接触都会留下痕迹，安全判断为什么必须同时尊重证据和权利？"
  },
  "1039-security-services-not-elsewhere-classified": {
    "titleZh": "罪犯变成了侦探",
    "summaryZh": "一个保护现场让力量必须接受证据和程序的约束。",
    "sceneZh": "19 世纪巴黎，一个曾多次入狱又熟悉地下世界的人，开始替警方辨认骗术、伪装和犯罪网络。",
    "storyBodyZh": "按普通做法，现场最先出现的判断是：把安全看成巡逻、锁门、抓人或快速反应。它看起来可靠，是因为让危险先被压住，也能给公众一个可见的秩序。偏偏有一处细节不肯归入原来的说法：现场留下的痕迹、权力边界和人的权利并不会因为危险过去就消失。原来的框架在这里开始松动：证据、程序、合法性和监督会被有效率的行动盖住。如果把差异当作例外丢开，下一次同样的卡点还会回来。判断被拆成几步：先保存现场细节，再核对痕迹、目击和记录，又把证据链与权力边界一起检查。证据还没有给出结论，却已经改变了提问的方向。材料的位置一变，判断也跟着变慢：一次接触要看留下了什么痕迹，一次行动要看权力是否被约束。刚开始的问题是“怎样尽快控制危险”。更锋利的问题出现了“什么证据和程序能让保护不变成新的伤害”。到这里，最重要的不是结论，而是痕迹、记录和程序被放在同一条证据链上。新的方法出现时，保护不再只靠力量，也要靠能被检验的证据和边界。这让保护不只停在反应速度上，也开始接受记录和责任的检查。",
    "knowledgePointZh": "关键转向：保护人需要力量，也需要证据、边界、责任和能约束权力的程序。",
    "reflectionQuestionZh": "当安全工作依赖灰色经验时，谁来划定有效与越界的边界？"
  }
};

lensStories.forEach((story) => {
  const override = reviewedLensStoryOverridesZh[story.id];
  if (override) Object.assign(story, override);
});

const conceptFables = [
  {
    id: "00-the-library-of-mirrors",
    categoryCode: "00",
    selectedFieldCode: "0031",
    title: "The Library of Mirrors",
    titleZh: "镜子图书馆",
    summary: "A traveler learns to study by watching how he gets lost, not by collecting more maps.",
    summaryZh: "一个旅人不是靠收集更多地图，而是靠看见自己怎样迷路，学会了学习。",
    storyBody: "A traveler entered a city where every gate led to a different library. In the first hall he copied every map he found, but the streets still confused him. In the second hall he memorized the names of famous roads, yet he kept returning to the same fountain. An old librarian finally gave him a blank notebook and asked him to mark three things each night: where he thought he was going, where he actually turned, and what sign made him change his mind. The traveler was annoyed. He wanted a better map, not homework about his mistakes. After a week, the notebook looked uselessly small beside the city's shelves, but something had changed. He began to notice that he rushed past unfamiliar symbols, trusted wide roads too quickly, and avoided alleys where his map had no labels. The city had not become simpler. He had become able to watch his own searching while he searched. Only near the final gate did he understand that the hidden lesson was metacognitive regulation: monitoring one's own understanding, choosing strategies, and changing course when learning fails.",
    storyBodyZh: "一个旅人走进一座城，城里的每一道门都通向一间不同的图书馆。第一间大厅里，他抄下所有地图，可街道依然让他迷糊。第二间大厅里，他背熟了名路的名字，却总是绕回同一座喷泉。最后，一位老馆员递给他一本空白小册子，只让他每天晚上记三件事：自己原本以为要去哪儿，实际在哪儿转错了弯，是什么标记让他改变判断。旅人很不耐烦。他想要更好的地图，不想写关于自己错误的作业。可一周以后，那本薄薄的小册子虽然比不上满城书架，却让某件事变了。他发现自己总是急着跳过陌生符号，总是太相信宽阔大路，也总是避开地图没有标注的小巷。城市没有变简单，他却开始能一边寻找，一边看见自己是怎样寻找的。直到最后一扇门前，他才明白，藏在这个故事里的，是元认知调节：学习者监控自己的理解、选择策略，并在学习失效时主动改路。",
    reveal: "The traveler did not become wiser because he owned more maps. He became wiser because he learned to observe his own learning.",
    revealZh: "旅人不是因为拥有更多地图而变聪明，而是因为他学会了观察自己的学习。",
    conceptName: "Metacognitive regulation",
    conceptNameZh: "元认知调节",
    explanation: "Metacognitive regulation is the learner's ability to plan, monitor, evaluate, and adjust learning strategies. At graduate level, it matters because expertise is not only knowing content; it is knowing how one's own attention, confusion, evidence, and strategy are behaving.",
    explanationZh: "元认知调节指学习者对自己学习过程的计划、监控、评估和调整能力。研究生水平的学习不只是“知道更多内容”，更是知道自己的注意力、困惑、证据和策略正在怎样运作。",
    metaphorMap: [
      { image: "The city", meaning: "A broad learning landscape with many possible paths." },
      { image: "Copied maps", meaning: "Information gathered without self-monitoring." },
      { image: "The blank notebook", meaning: "Reflection logs and strategy monitoring." },
      { image: "Wrong turns", meaning: "Learning failures that become data." },
    ],
    metaphorMapZh: [
      { image: "城市", meaning: "庞大的学习世界，路径很多但不自动清晰。" },
      { image: "抄来的地图", meaning: "只收集信息，却没有监控自己如何使用信息。" },
      { image: "空白小册子", meaning: "反思记录、策略记录和学习过程监控。" },
      { image: "转错的弯", meaning: "学习失败本身也可以成为可分析的数据。" },
    ],
    reflectionQuestion: "When you get stuck, do you only look for more information, or do you also look at how you are looking?",
    reflectionQuestionZh: "当你卡住时，你只是寻找更多资料，还是也会观察自己是怎样寻找的？",
    tags: ["learning", "self-monitoring", "strategy"],
    tagsZh: ["学习", "自我监控", "策略"],
  },
  {
    id: "01-the-bridge-too-short",
    categoryCode: "01",
    selectedFieldCode: "0111",
    title: "The Bridge Too Short",
    titleZh: "太短的桥",
    summary: "A teacher in a mountain village learns that help must stop at the right distance.",
    summaryZh: "山村里的老师发现，真正的帮助必须停在刚刚好的距离。",
    storyBody: "In a mountain village, children crossed a stream on stones to reach school. When the water rose, the smallest child froze halfway. The village carpenter offered to carry her every morning. The child stayed dry, but she learned nothing about crossing. A merchant proposed a permanent bridge from bank to bank. The child crossed safely, but soon she never looked at the water, stones, or current. The teacher tried a third thing. She placed a narrow plank only across the hardest part, stood beside the stream, and asked the child to choose the first and last stones herself. Each week the plank grew shorter. At first the child still needed a hand near her elbow. Later she needed only a reminder to look where the current split. One day the plank was gone, and the child crossed slowly, naming the safe stones as if teaching someone behind her. Only then did the village understand that the lesson was the zone of proximal development with scaffolding: the space between what a learner can do alone and what she can do with carefully withdrawn support.",
    storyBodyZh: "山村里的孩子每天踩着石头过溪去上学。涨水以后，最小的孩子走到一半就僵住了。木匠说，干脆每天早上把她抱过去。孩子鞋子干了，却没有学会过溪。商人说，不如直接修一座从岸到岸的大桥。孩子安全了，却再也不看水流、石头和深浅。老师试了第三种办法。她只在最难的一段放一块窄木板，自己站在溪边，让孩子自己选第一块和最后一块石头。每过一周，木板就短一点。开始时，孩子还需要有人扶着胳膊；后来，她只需要一句提醒：看水流分开的地方。终于有一天，木板撤掉了，孩子慢慢走过去，还能把安全的石头一块块说给身后的人听。直到这时，村里人才明白，藏在这个故事里的，是最近发展区与支架式教学：学习者独自能做到的事和在恰当支持下能做到的事之间，有一段需要被看见、支持并逐步撤离的距离。",
    reveal: "The right bridge was not the longest bridge. It was the bridge that disappeared at the learner's pace.",
    revealZh: "真正好的桥不是最长的桥，而是能按照学习者的节奏慢慢消失的桥。",
    conceptName: "Zone of proximal development and scaffolding",
    conceptNameZh: "最近发展区与支架式教学",
    explanation: "The zone of proximal development names the gap between independent performance and performance possible with guidance. Scaffolding is temporary support that helps the learner act beyond current ability, then withdraws as competence grows.",
    explanationZh: "最近发展区指学习者“独立完成水平”和“在帮助下可完成水平”之间的空间。支架式教学则是在这个空间里提供临时支持，并随着能力形成逐步撤离。",
    metaphorMap: [
      { image: "The stream", meaning: "A learning task with real difficulty." },
      { image: "Being carried", meaning: "Over-helping that removes the learning demand." },
      { image: "The permanent bridge", meaning: "A solution that bypasses the learner's development." },
      { image: "The shrinking plank", meaning: "Support that fades as competence grows." },
    ],
    metaphorMapZh: [
      { image: "溪流", meaning: "真实有难度的学习任务。" },
      { image: "被抱过去", meaning: "过度帮助，任务消失了，学习也消失了。" },
      { image: "永久大桥", meaning: "绕开学习者发展的替代方案。" },
      { image: "逐渐变短的木板", meaning: "随能力增长而撤离的临时支持。" },
    ],
    reflectionQuestion: "Where are you carrying someone when you should be building a plank that can later disappear?",
    reflectionQuestionZh: "你在哪件事上正在“抱着别人过河”，而不是搭一块以后可以撤掉的木板？",
    tags: ["education", "guidance", "learning support"],
    tagsZh: ["教育", "指导", "学习支持"],
  },
  {
    id: "02-the-tapestry-without-a-front",
    categoryCode: "02",
    selectedFieldCode: "0223",
    title: "The Tapestry Without a Front",
    titleZh: "没有正面的挂毯",
    summary: "A museum apprentice learns that the whole picture and each thread keep changing each other.",
    summaryZh: "博物馆学徒发现，整幅图和每一根线会不断互相改变。",
    storyBody: "A museum received an old tapestry with no label. The apprentice wanted to hang it at once, but no one could tell which side was the front. From far away it looked like a storm at sea. Up close, one thread looked like a road, another like a river, another like the sleeve of a person bending down. Each time the apprentice stepped back, the whole scene changed; each time the whole scene changed, the tiny threads meant something different. He became frustrated and asked the curator for the correct answer. The curator laughed softly and told him to keep walking between the wall and the cloth. After many days, he stopped asking for one final front. He learned to let the whole guide the parts and let the parts disturb the whole. Only in the last note of his catalog did he realize that the hidden method was the hermeneutic circle: interpretation moves between parts and whole until meaning becomes richer, never simply extracted from one side.",
    storyBodyZh: "一家博物馆收到一张没有标签的旧挂毯。学徒急着把它挂起来，可没人说得清哪一面才是正面。远看像海上的风暴，近看却有一根线像路，一根线像河，还有一小片颜色像一个弯腰人的袖口。学徒每退后一步，整幅画面就变了；而整幅画面一变，细小线头的意思也跟着变。他很烦，跑去问馆长到底哪一个答案才对。馆长只是笑笑，让他继续在墙和织物之间来回走。很多天以后，他不再急着找一个最终正面。他学会让整体照亮局部，也允许局部反过来打扰整体。直到在目录最后写下注释时，他才意识到，藏在这个故事里的，是诠释循环：理解会在部分与整体之间来回移动，意义不是从某一面直接取出来，而是在反复往返中变得更深。",
    reveal: "The apprentice did not solve the tapestry by choosing one distance. He learned to think by moving between distances.",
    revealZh: "学徒不是靠选定一个观看距离解开挂毯，而是学会在不同距离之间移动地思考。",
    conceptName: "Hermeneutic circle",
    conceptNameZh: "诠释循环",
    explanation: "The hermeneutic circle is a core idea in interpretation theory: we understand parts through the whole, and the whole through its parts. In advanced humanities work, interpretation is iterative rather than a one-time decoding.",
    explanationZh: "诠释循环是解释学中的核心观念：我们通过整体理解局部，又通过局部重新理解整体。高阶人文研究中的理解不是一次性解码，而是反复往返、不断修正的过程。",
    metaphorMap: [
      { image: "The unlabeled tapestry", meaning: "A text, image, ritual, or artifact without self-evident meaning." },
      { image: "Stepping close", meaning: "Attention to details, words, marks, and fragments." },
      { image: "Stepping back", meaning: "Attention to form, context, genre, and historical whole." },
      { image: "No final front", meaning: "Interpretation remains revisable and context-sensitive." },
    ],
    metaphorMapZh: [
      { image: "没有标签的挂毯", meaning: "意义不自动显现的文本、图像、仪式或物件。" },
      { image: "走近看", meaning: "关注词句、痕迹、碎片和局部细节。" },
      { image: "退后看", meaning: "关注形式、语境、类型和历史整体。" },
      { image: "没有唯一正面", meaning: "解释具有可修正性，也依赖语境。" },
    ],
    reflectionQuestion: "What are you trying to understand from too close, or from too far away?",
    reflectionQuestionZh: "你正在理解的哪件事，是因为看得太近或太远，才一直看不清？",
    tags: ["interpretation", "meaning", "humanities"],
    tagsZh: ["解释", "意义", "人文"],
  },
  {
    id: "03-the-village-paths-that-walked-back",
    categoryCode: "03",
    selectedFieldCode: "0314",
    title: "The Paths That Walked Back",
    titleZh: "会反过来走人的小路",
    summary: "A village learns that its paths are made by footsteps, and footsteps are guided by paths.",
    summaryZh: "一个村庄发现，小路由脚步踩出来，脚步又被小路带着走。",
    storyBody: "In a village between two hills, people crossed the grass to reach the well. At first there was no road, only guesses. The shortest walkers cut through the meadow, the careful walkers went around the wet ground, and children followed whoever seemed confident. After a season, pale lines appeared in the grass. Newcomers treated those lines as rules, though no elder had written them. The miller complained that the lines made people pass too close to his door, so he placed flowerpots by the edge. Soon the path curved. A young woman opened a bread stall beside the curve, and the curve grew busier because bread now waited there. Years later, villagers argued whether the path had forced them to walk that way or whether they had made the path themselves. The answer was hidden in their own feet: the path shaped the walking, and the walking kept remaking the path. Only at the end did they realize that the story was structuration theory: social practices are produced by human action while also becoming the rules and resources that shape future action.",
    storyBodyZh: "两座山之间有个村庄，村民每天穿过草地去井边打水。起初没有路，只有各自的猜测。赶时间的人抄近道，谨慎的人绕开湿地，孩子们跟着看起来最有把握的大人走。一个季节以后，草地上出现了浅浅的线。新来的人把这些线当成规矩，虽然没有长老写过任何告示。磨坊主抱怨小路离他门口太近，就在边上摆了几盆花。没多久，小路弯了一下。一个年轻女人又在弯道旁摆了面包摊，弯道于是越来越热闹，因为那里开始有热面包等着人。多年后，村民争论：到底是小路逼大家这样走，还是大家自己踩出了小路？答案藏在他们自己的脚下：小路塑造脚步，脚步又继续改写小路。直到故事结束，他们才意识到，藏在这个故事里的，是结构化理论：社会实践由人的行动生产出来，同时又变成规则和资源，反过来塑造未来行动。",
    reveal: "The village had no invisible ruler over the grass. Its order lived in repeated action.",
    revealZh: "草地上没有看不见的统治者，村庄的秩序藏在重复行动里。",
    conceptName: "Structuration theory",
    conceptNameZh: "结构化理论",
    explanation: "Structuration theory, associated with Anthony Giddens, argues that social structures are both the medium and the outcome of social practices. People act within rules and resources, but their repeated actions also reproduce or alter those rules and resources.",
    explanationZh: "结构化理论通常与 Anthony Giddens 相关。它认为社会结构既是社会实践的媒介，也是社会实践的结果。人们在规则和资源中行动，但重复行动也会复制或改变这些规则和资源。",
    metaphorMap: [
      { image: "The grass", meaning: "An open social field before routines harden." },
      { image: "Footsteps", meaning: "Everyday actions and choices." },
      { image: "The visible path", meaning: "Stabilized social rules and expectations." },
      { image: "Flowerpots and bread stall", meaning: "Interventions that redirect practices and create new incentives." },
    ],
    metaphorMapZh: [
      { image: "草地", meaning: "惯例尚未稳定之前的社会场域。" },
      { image: "脚步", meaning: "日常行动与选择。" },
      { image: "显现出来的小路", meaning: "稳定下来的规则、期待和惯例。" },
      { image: "花盆和面包摊", meaning: "改变实践路径的新资源与新激励。" },
    ],
    reflectionQuestion: "Which path in your life feels natural only because many people have kept walking it?",
    reflectionQuestionZh: "你生活里哪条“理所当然”的路，其实只是因为很多人一直这样走？",
    tags: ["society", "practice", "structure"],
    tagsZh: ["社会", "实践", "结构"],
  },
  {
    id: "04-the-market-with-three-doors",
    categoryCode: "04",
    selectedFieldCode: "0413",
    title: "The Market With Three Doors",
    titleZh: "三道门的集市",
    summary: "A town discovers that a price is not the whole cost of getting work done.",
    summaryZh: "一个小镇发现，标价并不是完成一件事的全部成本。",
    storyBody: "A town needed winter coats for every child. The first door led to the open market, where sellers shouted low prices. The second led to a guild workshop, where coats cost more but every stitch was inspected. The third led to a long hallway of clerks who wrote promises, penalties, delivery dates, cloth standards, and rules for what counted as a warm coat. The mayor first chose the cheapest stall, but the sleeves tore and no one could prove whose fault it was. Then she chose the guild, but the town became dependent on one slow workshop. Finally she sat with the clerks, sellers, parents, and tailors and asked what had really been expensive: searching for honest sellers, checking quality, settling disputes, guarding against delay, and writing promises that would survive bad weather. The town did not learn that markets were bad or workshops were good. It learned that every way of organizing exchange carries hidden frictions. Near the last snowfall, the mayor understood that the story was transaction cost economics: institutions exist partly because exchange requires searching, bargaining, monitoring, enforcing, and protecting against opportunism.",
    storyBodyZh: "一个小镇要给所有孩子准备冬衣。第一道门通向开放集市，卖家吆喝着最低价格。第二道门通向行会工坊，衣服贵一些，但每一道针脚都有人检查。第三道门后是一条长廊，文书们写下承诺、罚则、交货日期、布料标准，以及什么才算真正保暖。镇长起初选了最便宜的摊位，结果袖口很快裂开，却没人说得清责任在哪儿。后来她选了行会，质量稳了，小镇却被一个动作很慢的工坊卡住。最后，她让文书、卖家、父母和裁缝坐在一起，重新问：真正昂贵的到底是什么？是寻找可靠卖家，检查质量，处理争议，防止拖延，以及把承诺写到坏天气也能撑住。小镇学到的不是集市坏、工坊好，而是任何组织交换的方式都有看不见的摩擦。直到最后一场雪落下，镇长才明白，藏在这个故事里的，是交易成本经济学：制度之所以存在，部分原因是交换需要搜索、谈判、监督、执行，并防止机会主义。",
    reveal: "The cheapest coat was not cheapest once the town counted the work needed to make the promise real.",
    revealZh: "当小镇把“让承诺真正成立”的工作也算进去，最便宜的外套就不再便宜了。",
    conceptName: "Transaction cost economics",
    conceptNameZh: "交易成本经济学",
    explanation: "Transaction cost economics studies why firms, contracts, markets, and institutions take different forms. It asks what costs arise around exchange beyond the price itself: search, bargaining, monitoring, enforcement, asset specificity, uncertainty, and opportunism.",
    explanationZh: "交易成本经济学研究企业、合同、市场和制度为什么会呈现不同形式。它关注价格之外的交换成本：搜索、谈判、监督、执行、资产专用性、不确定性和机会主义。",
    metaphorMap: [
      { image: "The three doors", meaning: "Market, hierarchy, and contractual governance options." },
      { image: "Low-price stalls", meaning: "Market exchange that may hide quality and enforcement problems." },
      { image: "Guild workshop", meaning: "Internal or hierarchical control that improves reliability but reduces flexibility." },
      { image: "The clerks' hallway", meaning: "Contracts and governance mechanisms." },
    ],
    metaphorMapZh: [
      { image: "三道门", meaning: "市场、层级组织和合同治理三种安排。" },
      { image: "低价摊位", meaning: "看似便宜但可能隐藏质量与执行问题的市场交换。" },
      { image: "行会工坊", meaning: "更可靠但灵活性较低的内部化或层级控制。" },
      { image: "文书长廊", meaning: "合同、标准、罚则和治理机制。" },
    ],
    reflectionQuestion: "In a decision that looks cheap, what hidden work is required to make the promise dependable?",
    reflectionQuestionZh: "一个看起来便宜的选择，需要哪些隐藏工作才能让承诺变得可靠？",
    tags: ["organization", "contracts", "governance"],
    tagsZh: ["组织", "合同", "治理"],
  },
  {
    id: "05-the-lighthouse-and-the-fog",
    categoryCode: "05",
    selectedFieldCode: "0542",
    title: "The Lighthouse and the Fog",
    titleZh: "灯塔与雾",
    summary: "A harbor keeper learns to revise belief without waiting for certainty.",
    summaryZh: "一个守港人学会在没有绝对确定之前修正判断。",
    storyBody: "A harbor keeper kept a chart of storms. When clouds gathered over the western cliffs, ships usually delayed departure. One morning the cliffs were hidden, but the wind smelled dry and the gulls flew low. The younger sailors demanded a yes-or-no answer: storm or no storm. The keeper refused to pretend the world owed them a clean word. He placed pebbles on the table. Some pebbles stood for old seasons, some for new signs, some for how reliable each sign had been. A dark cloud moved one pebble, a dry wind moved another back, a falling barometer moved three more. The pile did not become certainty, but it leaned. When a messenger arrived from the outer island reporting rough water, the keeper shifted the pile again and closed the harbor for heavy boats while allowing small local craft to stay near shore. That evening the storm brushed the coast but did not strike directly. The sailors thought he had guessed. He had not. At the end, he explained that the hidden idea was Bayesian inference: begin with a prior belief, update it with evidence according to reliability, and make decisions under uncertainty.",
    storyBodyZh: "守港人有一本记录风暴的旧册子。西边悬崖上聚云时，船通常会延后出发。一天早晨，悬崖被雾遮住了，可风里有干燥气味，海鸥又飞得很低。年轻水手逼他给一句干脆话：会不会有风暴？守港人不肯假装世界欠他们一个干净的词。他把一把小石子摆在桌上。有些代表旧季节的经验，有些代表今天的新迹象，还有些代表每个迹象过去有多可靠。乌云把石子推向一边，干风又把几颗推回来，气压下降则让三颗石子一起移动。那堆石子没有变成绝对确定，只是慢慢倾斜。外岛信使赶来，说远海浪变粗了，守港人又移动石子，最后关闭大船出港，只允许小船留在近岸。傍晚，风暴擦过海岸，并没有正面击中。水手以为他是猜中了，其实不是。到最后他才说，藏在这个故事里的，是贝叶斯推断：先带着一个初始信念，再根据证据及其可靠性不断更新，并在不确定中做决定。",
    reveal: "The keeper's wisdom was not certainty. It was disciplined revision.",
    revealZh: "守港人的智慧不是绝对确定，而是有纪律地修正判断。",
    conceptName: "Bayesian inference",
    conceptNameZh: "贝叶斯推断",
    explanation: "Bayesian inference treats knowledge as updateable degrees of belief. A prior belief is revised by new evidence, weighted by how likely that evidence would be under different hypotheses. It is central to modern statistics, machine learning, scientific modeling, and decision-making under uncertainty.",
    explanationZh: "贝叶斯推断把知识看作可以更新的信念程度。初始信念会被新证据修正，而证据的影响取决于它在不同假设下出现的可能性。它是现代统计、机器学习、科学建模和不确定决策的重要基础。",
    metaphorMap: [
      { image: "Old storm chart", meaning: "Prior belief based on past data." },
      { image: "Cloud, wind, gulls, barometer", meaning: "New evidence with different reliability." },
      { image: "Moving pebbles", meaning: "Updating belief weights." },
      { image: "Different rules for large and small boats", meaning: "Decision-making under uncertainty and risk tolerance." },
    ],
    metaphorMapZh: [
      { image: "旧风暴册子", meaning: "来自历史数据的初始信念。" },
      { image: "云、风、海鸥、气压计", meaning: "可靠程度不同的新证据。" },
      { image: "移动石子", meaning: "更新信念权重。" },
      { image: "大船和小船的不同安排", meaning: "在不确定和风险承受能力下做决策。" },
    ],
    reflectionQuestion: "What belief are you treating as fixed when it should be updated by new evidence?",
    reflectionQuestionZh: "你把哪一个判断当成固定答案，其实它应该随着新证据被更新？",
    tags: ["statistics", "uncertainty", "evidence"],
    tagsZh: ["统计", "不确定性", "证据"],
  },
  {
    id: "06-the-islands-with-one-ledger",
    categoryCode: "06",
    selectedFieldCode: "0612",
    title: "The Islands With One Ledger",
    titleZh: "群岛上的同一本账",
    summary: "Several islands try to keep one record while messages arrive late, twice, or not at all.",
    summaryZh: "几个岛屿想维护同一本账，却不断遇到迟到、重复和丢失的消息。",
    storyBody: "Five islands shared a fishing ledger. Each evening, boats returned to different harbors, and each harbor wrote down the catch. At first the islands trusted the fastest messenger. Whoever arrived first declared the day's total. Then a storm delayed one messenger, another copied the wrong number, and two islands sold fish from different versions of the ledger. The elders tried sending louder messengers, but shouting across water did not cure delay. They tried keeping every version, but merchants stopped trusting any record. Finally they agreed on a ritual. One island would propose the next page number, others would confirm whether they had seen the same earlier pages, and no page became official until enough islands had accepted it. If the proposer vanished in fog, another island waited, then proposed. The ritual felt slow, but trade became possible again because the ledger could survive late messages and missing boats. Only after the first calm season did the elders name what they had invented: distributed consensus, the problem of getting separate machines to agree on one state despite delays, failures, and partial views.",
    storyBodyZh: "五个岛共用一本渔获账。每天傍晚，船会回到不同港口，每个港口都记下当天捕到多少鱼。起初，岛民相信最快的信使：谁先到，谁就宣布当天总数。后来一场风暴拖住了一个信使，另一个抄错了数字，两座岛还按照不同版本的账卖出了鱼。长老们试过派嗓门更大的信使，可隔海喊话并不能治好延迟。他们也试过保留所有版本，但商人很快不再相信任何记录。最后，长老们定下一套仪式：由一座岛提出下一页页码，其他岛确认自己是否见过相同的前文，只有足够多岛接受后，这一页才算正式。如果提出者消失在雾里，另一座岛就等待片刻后接手提出。这个仪式很慢，但贸易重新变得可能，因为账本终于能承受迟到的消息和失联的小船。第一个平静季节结束后，长老们才给它命名：藏在这个故事里的，是分布式共识，也就是让彼此分离的机器在延迟、故障和局部视野中仍能同意同一个状态。",
    reveal: "The islands did not remove uncertainty from the sea. They built a rule that could keep agreement alive inside it.",
    revealZh: "群岛没有消除海上的不确定性，而是建出了一套能在不确定中维持共同记录的规则。",
    conceptName: "Distributed consensus",
    conceptNameZh: "分布式共识",
    explanation: "Distributed consensus is the family of problems and algorithms that let multiple nodes agree on a shared state even when messages are delayed, duplicated, reordered, or some nodes fail. It underlies replicated databases, blockchains, coordination systems, and fault-tolerant services.",
    explanationZh: "分布式共识指一类问题和算法：多个节点在消息延迟、重复、乱序或部分节点失效时，仍然就同一个状态达成一致。它支撑复制数据库、区块链、协调系统和容错服务。",
    metaphorMap: [
      { image: "Islands", meaning: "Separate nodes or servers." },
      { image: "Messengers across water", meaning: "Network messages that may be delayed or lost." },
      { image: "Ledger pages", meaning: "A replicated log or shared state." },
      { image: "Enough islands accepting", meaning: "Quorum-based agreement." },
    ],
    metaphorMapZh: [
      { image: "岛屿", meaning: "彼此分离的节点或服务器。" },
      { image: "跨海信使", meaning: "可能延迟、丢失或重复的网络消息。" },
      { image: "账本页码", meaning: "复制日志或共享状态。" },
      { image: "足够多岛接受", meaning: "基于法定多数的确认机制。" },
    ],
    reflectionQuestion: "Where does a group you know need a shared record more than it needs the fastest messenger?",
    reflectionQuestionZh: "你熟悉的哪个团队，比起最快发声的人，更需要一份可靠的共同记录？",
    tags: ["systems", "databases", "coordination"],
    tagsZh: ["系统", "数据库", "协调"],
  },
  {
    id: "07-the-mill-that-listened-to-wind",
    categoryCode: "07",
    selectedFieldCode: "0714",
    title: "The Mill That Listened to Wind",
    titleZh: "会听风的磨坊",
    summary: "A miller learns that strength without correction tears the machine apart.",
    summaryZh: "磨坊主发现，只有力量没有修正，机器迟早会把自己撕坏。",
    storyBody: "On a windy ridge, a miller built the strongest mill in the valley. In gentle weather it ground grain beautifully. In sudden gusts, the stones spun too fast, flour burned, belts snapped, and villagers blamed the wind. The miller first ordered thicker belts. They snapped later, but when they snapped, the damage was worse. He then hired a boy to shout whenever the sails turned too quickly. The boy shouted well, but by the time the miller heard him, the stones had already raced ahead. One winter, the miller tied a small set of swinging weights to the turning shaft. When the shaft sped up, the weights moved outward and pulled the sails back. When the shaft slowed, they relaxed. The mill no longer fought the wind with brute force; it listened to its own motion and corrected itself before disaster. At the final harvest, the miller understood that the hidden principle was feedback control: measure a system's output, compare it with a desired state, and feed that difference back into action to keep the system stable.",
    storyBodyZh: "山脊上有一座全谷最结实的磨坊。天气温和时，它把谷物磨得很好；一遇上突来的强风，磨石就转得太快，面粉发焦，皮带断裂，村民都怪风太坏。磨坊主先换了更厚的皮带。皮带确实晚一点才断，可一断起来损失更大。后来他雇了一个男孩，只要帆转得太快就大喊。男孩喊得很及时，但等磨坊主听见时，磨石已经冲过头了。一个冬天，磨坊主在转轴上绑了一组会摆开的重锤。转轴一快，重锤就向外甩，把帆拉回一点；转轴一慢，重锤又收回来。磨坊不再用蛮力对抗风，而是听见自己的运动，并在灾难之前修正自己。到最后一次秋收时，磨坊主才明白，藏在这个故事里的，是反馈控制：测量系统输出，把它与目标状态比较，再把差异送回行动，让系统保持稳定。",
    reveal: "The mill survived not because it became stronger, but because it became responsive.",
    revealZh: "磨坊活下来，不是因为它更强壮，而是因为它开始会回应自己的变化。",
    conceptName: "Feedback control",
    conceptNameZh: "反馈控制",
    explanation: "Feedback control is central to engineering and automation. A controller observes output, compares it to a reference or target, and adjusts inputs to reduce error. It appears in thermostats, engines, robotics, process control, and biological regulation.",
    explanationZh: "反馈控制是工程与自动化的核心思想。控制器观察输出，把输出与目标状态比较，再调整输入以减少误差。恒温器、发动机、机器人、工业过程控制和生物调节里都能看到它。",
    metaphorMap: [
      { image: "Wind", meaning: "External disturbance." },
      { image: "Grinding speed", meaning: "System output." },
      { image: "Swinging weights", meaning: "Sensor and controller mechanism." },
      { image: "Pulling sails back", meaning: "Corrective input based on measured error." },
    ],
    metaphorMapZh: [
      { image: "风", meaning: "外部扰动。" },
      { image: "磨石速度", meaning: "系统输出。" },
      { image: "甩开的重锤", meaning: "传感与控制机制。" },
      { image: "把帆拉回", meaning: "基于误差的修正输入。" },
    ],
    reflectionQuestion: "Which system around you is being made stronger when it actually needs better feedback?",
    reflectionQuestionZh: "你身边哪个系统一直在被加固，其实它真正需要的是更好的反馈？",
    tags: ["engineering", "automation", "stability"],
    tagsZh: ["工程", "自动化", "稳定性"],
  },
  {
    id: "08-the-orchard-that-kept-notebooks",
    categoryCode: "08",
    selectedFieldCode: "0811",
    title: "The Orchard That Kept Notebooks",
    titleZh: "会记笔记的果园",
    summary: "An orchard keeper learns to manage living land by treating action as experiment.",
    summaryZh: "果园主人学会把每一次行动都当成实验，来管理有生命的土地。",
    storyBody: "An orchard sat at the edge of a dry plain. Some years the apples were sweet, some years they cracked before harvest, and some years insects arrived as if invited by a secret letter. The keeper first demanded a permanent rule: always water on the same day, always prune in the same month, always spray when the first leaf opened. The orchard obeyed for one season and rebelled the next. A neighbor told him to stop treating the trees like furniture. So he divided the orchard into small plots. In one, he mulched early; in another, he delayed pruning; in a third, he planted flowers to draw insects away from fruit. He wrote down weather, soil moisture, pests, yield, and which mistakes were worth repeating more carefully. The orchard did not hand him a perfect answer. It taught him through response. After several seasons, he no longer asked for a rule that would never change. He asked how each decision could teach the next one. Near the final harvest, he realized the hidden concept was adaptive management: managing ecological systems through deliberate action, monitoring, learning, and adjustment under uncertainty.",
    storyBodyZh: "一片果园长在干旱平原边上。有些年份苹果很甜，有些年份还没到收获就裂开，还有些年份虫子像收到了秘密邀请一样突然到来。果园主人起初想要一条永久规则：永远同一天浇水，永远同一个月修枝，永远第一片叶子出来就喷药。果园只顺从了一个季节，下一年就完全变了脸。邻居提醒他，别把树当家具。于是他把果园分成小块：一块早早覆盖草屑，一块推迟修枝，一块种花来吸引虫子离开果实。他记录天气、土壤湿度、虫害、产量，也记录哪些错误值得更谨慎地再试一次。果园没有给他完美答案，而是用反应教他。几个季节之后，他不再追问一条永不改变的规则，而是问：每个决定怎样能教会下一个决定？到最后一次收获时，他才意识到，藏在这个故事里的，是适应性管理：在不确定的生态系统中，通过有意行动、监测、学习和调整来管理。",
    reveal: "The orchard was not a puzzle solved once. It was a conversation across seasons.",
    revealZh: "果园不是一次解开的谜题，而是一场跨越季节的对话。",
    conceptName: "Adaptive management",
    conceptNameZh: "适应性管理",
    explanation: "Adaptive management is a structured approach for managing complex ecological and resource systems when uncertainty is unavoidable. Decisions are treated as learning opportunities: act, monitor outcomes, compare with expectations, and adjust future action.",
    explanationZh: "适应性管理是一种面对复杂生态与资源系统的结构化方法。它承认不确定性无法完全消除，把决策当成学习机会：行动、监测结果、与预期比较，再调整下一步。",
    metaphorMap: [
      { image: "Variable seasons", meaning: "Ecological uncertainty and changing conditions." },
      { image: "Small orchard plots", meaning: "Management experiments or treatment areas." },
      { image: "Notebook records", meaning: "Monitoring and evidence collection." },
      { image: "Changing next season's practice", meaning: "Learning-based adjustment." },
    ],
    metaphorMapZh: [
      { image: "变化的季节", meaning: "生态不确定性和不断变化的条件。" },
      { image: "分成小块的果园", meaning: "管理实验或不同处理区域。" },
      { image: "记录本", meaning: "监测与证据收集。" },
      { image: "下一季改变做法", meaning: "基于学习的调整。" },
    ],
    reflectionQuestion: "Where are you demanding a fixed rule from a living system that can only teach through response?",
    reflectionQuestionZh: "你在哪个生命系统里要求一条固定规则，而它其实只能通过反应慢慢教你？",
    tags: ["ecology", "learning", "resource management"],
    tagsZh: ["生态", "学习", "资源管理"],
  },
  {
    id: "09-the-town-with-three-fevers",
    categoryCode: "09",
    selectedFieldCode: "0919",
    title: "The Town With Three Fevers",
    titleZh: "三种发热的小镇",
    summary: "A clinic learns that illnesses can strengthen one another when hardship links them.",
    summaryZh: "一家诊所发现，当困境把疾病连在一起时，疾病会彼此加重。",
    storyBody: "A town clinic treated coughs in one room, sadness in another, and hunger at the charity desk near the back door. Each room kept neat records. The cough room counted infections, the quiet room counted sleepless nights, and the desk counted empty cupboards. Yet the same families appeared in all three lines. A child with a cough missed school, the mother missed work, rent fell behind, meals became thinner, and the grandmother's old illness worsened. The doctors first tried to improve each room separately. More cough medicine helped some days. More counseling helped some nights. More food parcels helped some weeks. But the town kept producing the same braided suffering. Finally, the clinic moved the records onto one wall. Lines began connecting damp housing, unstable work, infection, stress, hunger, and delayed care. The staff saw that the illnesses were not merely neighbors; under social pressure, they were feeding one another. Only after the wall filled with lines did the clinic name the hidden idea: syndemic theory, the study of interacting epidemics or conditions that cluster and intensify through social and structural forces.",
    storyBodyZh: "小镇诊所把咳嗽放在一间屋里，把悲伤放在另一间屋里，把饥饿放在后门旁的救济桌上。每个房间都有整齐记录：咳嗽房记录感染，安静房记录失眠，救济桌记录空掉的橱柜。可同一批家庭总是出现在三条队伍里。孩子咳嗽请假，母亲缺工，房租拖欠，饭菜变少，祖母的旧病也跟着加重。医生一开始试着分别改善每个房间。更多止咳药能帮几天，更多咨询能帮几个夜晚，更多食物包能帮几周。但小镇仍然不断生产同一串缠在一起的痛苦。最后，诊所把所有记录贴到同一面墙上。潮湿住房、不稳定工作、感染、压力、饥饿和延迟就医之间，一条条线开始连起来。工作人员发现，这些病不是简单相邻；在社会压力下，它们正在互相喂养。直到那面墙被连线填满，诊所才说出隐藏的概念：藏在这个故事里的，是协同流行病理论，也就是研究多种疾病或健康困境如何在社会结构力量中聚集、互动并彼此加重。",
    reveal: "The clinic did not discover a fourth fever. It discovered the relationships among the first three.",
    revealZh: "诊所发现的不是第四种发热，而是前三种发热之间的关系。",
    conceptName: "Syndemic theory",
    conceptNameZh: "协同流行病理论",
    explanation: "Syndemic theory examines how two or more diseases or health conditions cluster, interact, and worsen each other within social conditions such as poverty, discrimination, housing insecurity, violence, or limited access to care.",
    explanationZh: "协同流行病理论研究两种或多种疾病或健康困境，如何在贫困、歧视、住房不稳、暴力、医疗可达性不足等社会条件中聚集、互动并彼此加重。",
    metaphorMap: [
      { image: "Separate clinic rooms", meaning: "Siloed health categories and services." },
      { image: "Same families in every line", meaning: "Clustering of conditions in vulnerable groups." },
      { image: "Lines on one wall", meaning: "Interaction between biological, psychological, and social forces." },
      { image: "Braided suffering", meaning: "Mutually reinforcing health burdens." },
    ],
    metaphorMapZh: [
      { image: "分开的诊室", meaning: "被切开的健康分类和服务。" },
      { image: "同一批家庭反复排队", meaning: "弱势群体中的健康困境聚集。" },
      { image: "同一面墙上的连线", meaning: "生物、心理与社会力量之间的互动。" },
      { image: "缠在一起的痛苦", meaning: "彼此强化的健康负担。" },
    ],
    reflectionQuestion: "Which problem are you treating alone even though it is being strengthened by its neighbors?",
    reflectionQuestionZh: "你正在把哪个问题单独处理，可它其实正被旁边的问题一起加重？",
    tags: ["public health", "welfare", "social conditions"],
    tagsZh: ["公共健康", "福利", "社会条件"],
  },
  {
    id: "10-the-restaurant-with-no-menu",
    categoryCode: "10",
    selectedFieldCode: "1013",
    title: "The Restaurant With No Menu",
    titleZh: "没有菜单的餐馆",
    summary: "A restaurant owner learns that value is not handed over like a plate.",
    summaryZh: "餐馆老板发现，价值不是像盘子一样单方面递过去的。",
    storyBody: "A restaurant owner believed service meant delivering perfect dishes. He polished plates, trained waiters to move silently, and printed a menu as thick as a small book. Guests still left confused. Some wanted a quiet place to talk, some needed quick food before a train, some cared about allergies, some wanted help choosing because the menu embarrassed them. The owner grew angry: the kitchen had done everything right. One evening the menu printer broke, and the head server had to ask each table what kind of evening they needed. A tired father wanted soup first so his child would calm down. Two travelers wanted a shared dish they could finish in fifteen minutes. An elderly guest wanted the same flavor she remembered but less salt. The kitchen did not become less skilled; it became more connected to use. By closing time, the owner saw that the meal was not created in the kitchen alone. It emerged from ingredients, staff, room, timing, memory, choice, and the guest's own purpose. Only then did he realize the hidden concept was service-dominant logic: value is co-created through use, interaction, and relationships rather than simply embedded in a product and handed to a passive customer.",
    storyBodyZh: "一家餐馆老板相信，服务就是把完美菜品端出去。他擦亮盘子，训练服务员安静移动，还印了一本厚得像小书的菜单。客人却仍然常常困惑。有人想要安静聊天，有人赶火车前只想快点吃完，有人担心过敏，有人只是因为菜单太复杂而不好意思开口。老板很生气：厨房明明已经做对了一切。某天傍晚，菜单打印机坏了，领班只好一桌桌问客人：你今晚真正需要的是怎样的一顿饭？疲惫的父亲想先来一碗汤，让孩子安静下来；两个旅人想要十五分钟内能分着吃完的菜；一位老人想要记忆里的味道，但盐少一点。厨房没有因此变得不专业，反而更接近真实使用。打烊时，老板终于看见，一顿饭不是厨房单独制造出来的，它来自食材、员工、房间、时间、记忆、选择，以及客人自己的目的。直到这时，他才明白，藏在这个故事里的，是服务主导逻辑：价值不是被装进产品再交给被动顾客，而是在使用、互动和关系中共同创造出来的。",
    reveal: "The restaurant did not lose its menu. It found the guests inside the meal.",
    revealZh: "餐馆不是失去了菜单，而是在一顿饭里重新找到了客人。",
    conceptName: "Service-dominant logic",
    conceptNameZh: "服务主导逻辑",
    explanation: "Service-dominant logic is a marketing and service theory arguing that service, not goods alone, is the fundamental basis of exchange. Value is co-created with users through use, context, interaction, knowledge, and relationships.",
    explanationZh: "服务主导逻辑是服务与营销理论中的重要观点，认为交换的基础不是孤立商品，而是服务过程。价值由用户在使用情境、互动、知识和关系中共同创造。",
    metaphorMap: [
      { image: "The thick menu", meaning: "A product-centered view that assumes value is prepackaged." },
      { image: "The broken printer", meaning: "A disruption that forces direct interaction." },
      { image: "Asking what evening guests need", meaning: "Understanding context of use." },
      { image: "Meal emerging from room, timing, memory, and purpose", meaning: "Value co-creation." },
    ],
    metaphorMapZh: [
      { image: "厚菜单", meaning: "以产品为中心，默认价值已经被预先包装好。" },
      { image: "坏掉的打印机", meaning: "迫使服务回到直接互动的意外中断。" },
      { image: "询问客人今晚需要什么", meaning: "理解真实使用情境。" },
      { image: "由空间、时间、记忆和目的共同形成的一顿饭", meaning: "价值共创。" },
    ],
    reflectionQuestion: "Where are you trying to deliver value without first understanding how the other person will use it?",
    reflectionQuestionZh: "你在哪件事上急着交付价值，却还没理解对方会怎样使用它？",
    tags: ["service", "value", "co-creation"],
    tagsZh: ["服务", "价值", "共创"],
  },
];

const fieldPlainMeanings = {
  "0111-education-science": "How people learn, how teaching works, and how learning systems can be designed.",
  "0223-philosophy-and-ethics": "How people reason about values, duties, meaning, right action, and the assumptions behind judgment.",
  "0231-language-acquisition": "How people acquire language through use, practice, context, and feedback.",
  "0311-economics": "How scarcity, prices, incentives, and trade-offs shape everyday choices.",
  "0312-political-sciences-and-civics": "How groups make public decisions, distribute responsibility, and handle disagreement.",
  "0314-sociology-and-cultural-studies": "How culture, norms, identity, and social patterns shape community life.",
  "0411-accounting-and-taxation": "How records, costs, taxes, and financial reports make money flows visible.",
  "0416-wholesale-and-retail-sales": "How goods move from producers to sellers to customers, including pricing and stock.",
  "0521-environmental-sciences": "How natural systems, water, climate, pollution, and human use affect each other.",
  "0541-mathematics": "How numbers, patterns, quantities, and models help people reason clearly.",
  "0613-software-and-applications-development-and-analysis": "How software tools and applications are designed, built, tested, and improved.",
  "0721-food-processing": "How raw food becomes safe, stable, transportable, and sellable.",
  "0732-building-and-civil-engineering": "How roads, wells, bridges, buildings, and other physical systems are planned and maintained.",
  "0811-crop-and-livestock-production": "How crops and livestock are grown, cared for, and connected to food supply.",
  "1021-community-sanitation": "How communities keep shared spaces healthy through water, waste, and sanitation systems.",
};

const specialKnowledgeCategory = {
  code: "99",
  title: "Field unknown",
  chineseTitle: "未知领域",
  status: "Internal",
  readiness: readiness.classified,
  groups: [
    {
      code: "999",
      title: "Field unknown",
      chineseTitle: "未知领域",
      fields: [["9999", "Field unknown", "未知领域"]],
    },
  ],
};

const knowledgeCoordinateCategories = [...categories, specialKnowledgeCategory];
const administrativeFieldPattern = /not further defined|not elsewhere classified|inter-disciplinary programmes|field unknown/i;

function makeCoordinateId(code, title) {
  return `${code}-${String(title)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

function isAdministrativeCoordinate(title) {
  return administrativeFieldPattern.test(title || "");
}

function makePlainMeaning(title) {
  return `${title} in everyday life: the situations, tools, people, trade-offs, and decisions this field helps explain.`;
}

const knowledgeAreas = knowledgeCoordinateCategories.map((area, index) => ({
  id: makeCoordinateId(area.code, area.title),
  code: area.code,
  title: area.title,
  titleZh: area.chineseTitle || "",
  description: `${area.title} as a broad knowledge area in the MapKAI coordinate system.`,
  sortOrder: index,
}));

const knowledgeNarrowFields = knowledgeCoordinateCategories.flatMap((area) => {
  const areaId = makeCoordinateId(area.code, area.title);
  return area.groups.map((group, index) => ({
    id: makeCoordinateId(group.code, group.title),
    code: group.code,
    areaId,
    title: group.title,
    titleZh: group.chineseTitle || "",
    description: `${group.title} as a narrow field inside ${area.title}.`,
    sortOrder: index,
  }));
});

const knowledgeFields = knowledgeCoordinateCategories.flatMap((area) => {
  const areaId = makeCoordinateId(area.code, area.title);
  return area.groups.flatMap((group) => {
    const narrowFieldId = makeCoordinateId(group.code, group.title);
    return group.fields.map(([code, title, titleZh = ""], index) => {
      const id = makeCoordinateId(code, title);
      const isAdministrative = isAdministrativeCoordinate(title);
      return {
        id,
        code,
        areaId,
        narrowFieldId,
        title,
        titleZh,
        plainMeaning: fieldPlainMeanings[id] || makePlainMeaning(title),
        officialDescription: "",
        isPractical: !isAdministrative,
        isAdministrative,
        sortOrder: index,
      };
    });
  });
});

const characters = [
  { id: "mira", name: "Mira", nameZh: "米拉", role: "Town water keeper", tone: "calm, practical" },
  { id: "otto", name: "Otto", nameZh: "奥托", role: "Baker", tone: "warm, stubborn about fairness" },
  { id: "lina", name: "Lina", nameZh: "莉娜", role: "School teacher", tone: "curious, careful" },
  { id: "ren", name: "Ren", nameZh: "任", role: "Young mapmaker", tone: "observant, systems-minded" },
  { id: "sana", name: "Sana", nameZh: "萨娜", role: "Clinic helper", tone: "protective, human-first" },
  { id: "maro", name: "Maro", nameZh: "马洛", role: "Market coordinator", tone: "fast, trade-focused" },
  { id: "beatrice", name: "Beatrice", nameZh: "贝娅", role: "Archivist", tone: "precise, memory-oriented" },
  { id: "toma", name: "Toma", nameZh: "托马", role: "Farmer", tone: "patient, field-tested" },
  { id: "niko", name: "Niko", nameZh: "尼科", role: "Workshop builder", tone: "hands-on, constraint-aware" },
  { id: "aya", name: "Aya", nameZh: "阿雅", role: "Council mediator", tone: "balanced, civic-minded" },
  { id: "pim", name: "Pim", nameZh: "皮姆", role: "Street reporter", tone: "alert, narrative-driven" },
  { id: "blue-whale", name: "Blue Whale", nameZh: "蓝鲸", role: "Town reflection guide", tone: "slow, integrative" },
];

const stories = [
  {
    id: "well-runs-low",
    title: "The Well Runs Dry",
    titleZh: "井水变浅了",
    episode: "Episode 1",
    eventType: "resource pressure",
    mainField: "0521-environmental-sciences",
    activatedFields: [
      "0811-crop-and-livestock-production",
      "0732-building-and-civil-engineering",
      "0312-political-sciences-and-civics",
      "1021-community-sanitation",
    ],
    characters: ["mira", "toma", "niko", "aya", "blue-whale"],
    coreConcepts: ["scarcity", "shared resources", "maintenance", "public rules"],
    summary: "When the town well falls silent, people first argue over water. Then they discover the real shortage is shared attention.",
    summaryZh: "井水突然变浅，镇上的人先争水，后来才发现真正稀缺的是共同注意力。",
    storyBody: "The well did not run dry in one morning. It had been whispering for months: slower taps, damp stones near the old pipe, gardens needing more water than before. Nobody put the signs together until the bakery alarm rang and there was not enough pressure to fill the hose. Toma wanted water for seedlings. Sana wanted water for the clinic. Niko unfolded a repair sketch he had carried for weeks, but no one had wanted to close the road. Aya asked everyone to stop defending their own bucket and name the system they were standing inside. That was when the argument changed. The problem was not only water. It was memory, maintenance, priority, and trust. The town had treated the well like background scenery until it became the whole story.",
    storyBodyZh: "井水不是某个早晨突然消失的。它已经低声提醒了很久：水龙头越来越慢，老水管旁的石头总是潮湿，菜园需要的水也越来越多。只是没人把这些信号连起来，直到面包店的警报响起，水压却不够接上消防软管。托马想给幼苗留水，萨娜想先保证诊所，尼科摊开一张他带了好几周的维修图，但之前没有人愿意为修路停工。阿雅让大家先停止保护自己的水桶，说出他们共同站在哪个系统里。争论就在那一刻变了。问题不只是水，而是记忆、维护、优先级和信任。镇上的人一直把井当作背景，直到它变成了整个故事。等人们愿意把这些线索放到同一张桌上，水井才不只是资源问题，也成了一堂关于系统记忆的课。",
    insight: "A visible crisis is often the last chapter of an invisible system. The same dry well can be read as a broken pipe, a weak rule, a health risk, a crop threat, or a failure of collective memory. The deeper lesson is that people do not only disagree because they want different outcomes. They often disagree because their attention is trained by different knowledge maps.",
    insightZh: "一个看得见的危机，常常是一个看不见系统的最后一章。同一口变浅的井，可以被看成水管问题、规则问题、健康风险、农作物威胁，或者共同记忆失效。更深的道理是：人们产生分歧，不只是因为想要不同结果，也常常是因为他们的注意力被不同的知识地图训练过。",
    perspectives: [
      {
        lens: "Mira sees an environmental signal",
        lensZh: "米拉看见的是环境信号",
        focus: "The well changed slowly before it failed suddenly. Her focus is the long pattern, not only the emergency.",
        focusZh: "井不是突然坏掉，而是先慢慢改变。她关注长期信号，而不只是当天的危机。",
      },
      {
        lens: "Niko sees a maintenance debt",
        lensZh: "尼科看见的是维护欠账",
        focus: "The pipe was ignored because repair felt inconvenient. His focus is how invisible infrastructure becomes visible only when it breaks.",
        focusZh: "水管之前被忽视，因为维修太麻烦。他关注的是：看不见的基础设施，往往只在坏掉时才被看见。",
      },
      {
        lens: "Sana sees unequal vulnerability",
        lensZh: "萨娜看见的是脆弱程度不同",
        focus: "A water shortage does not hurt everyone in the same way. Her focus is who becomes unsafe first.",
        focusZh: "缺水不会以同样方式伤害所有人。她关注的是谁会最先变得不安全。",
      },
      {
        lens: "Aya sees public rules",
        lensZh: "阿雅看见的是公共规则",
        focus: "The town needs more than kindness. Her focus is how a shared resource needs shared rules before fear takes over.",
        focusZh: "小镇不能只靠善意。她关注的是：共享资源需要共享规则，否则恐惧会接管局面。",
      },
    ],
    miniQuestion: "When a shared resource runs low, should a town first limit demand, repair supply, or redesign the rules?",
    miniQuestionZh: "当共享资源变少时，一个社区应该先限制需求、修复供给，还是重新设计规则？",
    isPublished: true,
    createdAt: "2026-05-30",
    updatedAt: "2026-05-30",
  },
  {
    id: "bread-price-debate",
    title: "The Bread Price Debate",
    titleZh: "面包价格之争",
    episode: "Episode 2",
    eventType: "market tension",
    mainField: "0311-economics",
    activatedFields: [
      "0411-accounting-and-taxation",
      "0416-wholesale-and-retail-sales",
      "0721-food-processing",
      "0312-political-sciences-and-civics",
    ],
    characters: ["otto", "maro", "beatrice", "aya", "pim"],
    coreConcepts: ["price signals", "cost structure", "supply chains", "fairness"],
    summary: "A price tag becomes a mirror: cost, fear, fairness, and trust all appear in the same loaf of bread.",
    summaryZh: "一个价格牌变成了一面镜子：成本、恐惧、公平和信任都藏在同一块面包里。",
    storyBody: "Otto raised the bread price before sunrise and hoped the town would read it as math. They read it as betrayal. Pim photographed the new sign. Beatrice asked for the ledger. Maro traced the flour route from the mill to the cart to the bakery shelf. The numbers explained part of the increase, but not all of it. Otto finally said the quiet part: he had added extra because he was afraid the next delivery would be worse. That sentence changed the room. A price was no longer a number on a board. It was a compressed story about cost, risk, bargaining power, and the fear of being the person blamed when tomorrow arrives.",
    storyBodyZh: "奥托天还没亮就改了面包价格，希望镇上的人把它理解成算术。大家却把它理解成背叛。皮姆拍下新价格，贝娅要看账本，马洛追踪面粉从磨坊到推车再到面包架的路径。数字解释了一部分涨价，但不是全部。最后奥托说出了没写在牌子上的那部分：他多加了一点，因为他害怕下一批货会更糟。房间里的气氛因此改变。价格不再只是木板上的数字，而是一段被压缩的故事，里面有成本、风险、议价能力，以及害怕明天来临时自己成为被责怪的那个人。从那以后，镇上的人再看价格牌时，会多停一秒：数字看起来冷，其实常常带着人的处境和对未来的判断。",
    insight: "Fairness cannot be judged from the surface alone. A price is a tiny public symbol that compresses many private realities: cost, uncertainty, bargaining power, reputation, and fear. The deeper question is not simply whether Otto is greedy or the town is emotional. It is which hidden layer each person treats as the real story.",
    insightZh: "公平不能只从表面判断。价格是一个很小的公共符号，却压缩了许多私人现实：成本、不确定性、议价能力、声誉和恐惧。更深的问题不是奥托是不是贪心，也不是镇民是不是情绪化，而是每个人把哪一层隐藏结构当成了真正的故事。",
    perspectives: [
      {
        lens: "Pim sees public trust",
        lensZh: "皮姆看见的是公共信任",
        focus: "A changed price without explanation feels like a broken relationship. Pim focuses on how a signal spreads through people.",
        focusZh: "没有解释的涨价，会像关系被破坏一样被感知。皮姆关注一个信号如何在人群中扩散。",
      },
      {
        lens: "Beatrice sees evidence",
        lensZh: "贝娅看见的是证据",
        focus: "Anger may be real, but it still needs a ledger. Her focus is separating facts from suspicion.",
        focusZh: "愤怒可能是真的，但仍然需要账本。她关注的是把事实和猜疑分开。",
      },
      {
        lens: "Maro sees the supply chain",
        lensZh: "马洛看见的是供应链",
        focus: "The loaf is the last stop, not the whole process. Maro focuses on transport, delays, payment terms, and upstream pressure.",
        focusZh: "面包只是最后一站，不是全过程。马洛关注运输、延误、付款条件和上游压力。",
      },
      {
        lens: "Otto sees tomorrow's risk",
        lensZh: "奥托看见的是明天的风险",
        focus: "His extra markup is partly fear disguised as pricing. His focus is survival under uncertainty.",
        focusZh: "他多加的价格，有一部分是伪装成定价的恐惧。他关注的是不确定性里的生存。",
      },
    ],
    miniQuestion: "What information should a town look at before deciding whether a price increase is unfair?",
    miniQuestionZh: "在判断一次涨价是否不公平之前，社区应该先看哪些信息？",
    isPublished: true,
    createdAt: "2026-05-30",
    updatedAt: "2026-05-30",
  },
  {
    id: "school-curriculum-debate",
    title: "The School Curriculum Debate",
    titleZh: "学校课程之辩",
    episode: "Episode 3",
    eventType: "learning design",
    mainField: "0111-education-science",
    activatedFields: [
      "0231-language-acquisition",
      "0541-mathematics",
      "0613-software-and-applications-development-and-analysis",
      "0223-philosophy-and-ethics",
      "0314-sociology-and-cultural-studies",
    ],
    characters: ["lina", "ren", "sana", "blue-whale", "aya"],
    coreConcepts: ["curriculum design", "transfer", "language", "ethics", "tools"],
    summary: "A school meeting asks a harder question than what to teach: what should a learner be able to notice?",
    summaryZh: "一次学校会议问出了比“教什么”更难的问题：一个学习者应该能看见什么？",
    storyBody: "Lina brought three lesson plans and expected a tidy vote. Ren brought a different kind of evidence: students who could recite definitions, but froze in front of a broken bus schedule, a medicine label, or a rumor spreading through a class chat. Someone said school should not become life itself. Sana answered softly that life had already entered the building. Lina erased the agenda and wrote one sentence on the board: \"What should a child be able to notice?\" The room became quieter. Facts still mattered. Tools still mattered. But the question had moved underneath them. A curriculum is not only a list of content. It is a training ground for attention: what learners see, what they miss, and what they learn to connect before the world asks them to act.",
    storyBodyZh: "莉娜带来了三份教案，以为会议会很快投票结束。任带来的却是另一种证据：学生能背定义，却在面对坏掉的公交时刻表、看不懂的药品标签、班级群里扩散的谣言时停住。有人说学校不应该变成现实生活本身。萨娜轻声回答，现实生活早就走进了教学楼。莉娜擦掉议程，在白板上写下一句话：“一个孩子应该能看见什么？”房间安静下来。事实仍然重要，工具仍然重要。但问题已经移到更深处。课程不只是内容清单，它是在训练注意力：学习者会看见什么，会忽略什么，又能在世界要求他们行动之前，把什么连接起来。那天之后，课程表没有立刻变得完美，但老师们开始少问一点“这一章教完了吗”，多问一点“学生能把它带到哪里”。",
    insight: "Learning is not just storing answers. It is building attention. A curriculum quietly decides what counts as worth noticing, what can be ignored, and what connections a learner is allowed to make. MapKAI treats knowledge as a map because real problems rarely arrive with subject labels attached. They arrive as messy situations, and the learner's first advantage is knowing which lens to bring forward.",
    insightZh: "学习不只是储存答案，而是在建立注意力。课程会悄悄决定什么值得被看见，什么可以被忽略，一个学习者被允许建立哪些连接。MapKAI 把知识当作地图，是因为真实问题很少带着学科标签出现。它们通常以混乱情境的形式到来，而学习者最早的优势，是知道该把哪个视角带到前面。",
    perspectives: [
      {
        lens: "Lina sees transfer",
        lensZh: "莉娜看见的是迁移能力",
        focus: "Students know definitions but cannot move knowledge into real situations. Her focus is whether learning can travel.",
        focusZh: "学生知道定义，却不能把知识带到真实情境里。她关注的是学习能不能迁移。",
      },
      {
        lens: "Ren sees mapping",
        lensZh: "任看见的是地图结构",
        focus: "The issue is not one missing lesson. Ren focuses on how fields connect when life refuses to stay inside one subject.",
        focusZh: "问题不是少了一节课。任关注的是：当生活不待在单一学科里时，知识领域如何连接。",
      },
      {
        lens: "Sana sees human limits",
        lensZh: "萨娜看见的是人的边界",
        focus: "Tools and facts are not enough if students cannot handle fear, pressure, or confusion. Her focus is care and judgment.",
        focusZh: "如果学生无法处理恐惧、压力和混乱，工具和事实还不够。她关注的是照护和判断。",
      },
      {
        lens: "Aya sees social purpose",
        lensZh: "阿雅看见的是社会目的",
        focus: "A curriculum shapes what kind of citizen someone becomes. Her focus is the public consequence of private learning.",
        focusZh: "课程会塑造一个人成为什么样的社会成员。她关注的是私人学习背后的公共后果。",
      },
    ],
    miniQuestion: "If school time is limited, what should a curriculum protect first: facts, tools, judgment, or character?",
    miniQuestionZh: "如果学校时间有限，课程最应该优先保护什么：事实、工具、判断力，还是人格？",
    isPublished: true,
    createdAt: "2026-05-30",
    updatedAt: "2026-05-30",
  },
];

const historicalStories = [
  {
    id: "broad-street-pump",
    title: "The Broad Street Pump",
    titleZh: "布罗德街水泵",
    episode: "Historical Case 1",
    eventType: "public health",
    mainField: "1021-community-sanitation",
    activatedFields: [
      "0521-environmental-sciences",
      "0312-political-sciences-and-civics",
      "0542-statistics",
      "0732-building-and-civil-engineering",
    ],
    characters: ["john-snow", "henry-whitehead", "st-james-guardians", "soho-residents"],
    coreConcepts: ["epidemiology", "public health", "evidence mapping", "infrastructure"],
    summary: "In 1854 London, John Snow had to argue against the dominant miasma theory while deaths clustered around one water pump.",
    summaryZh: "1854 年伦敦，约翰·斯诺必须在“瘴气说”占主导的时代，用病例地图说服人们重新看待一口水泵。",
    storyBody: "In late August 1854, cholera tore through Soho near Broad Street. The dominant explanation was still miasma: bad air, foul smells, poisoned atmosphere. John Snow looked elsewhere. With help from local knowledge, including the work of Reverend Henry Whitehead, he traced where people lived, which pump they used, who had fled, who had stayed, and which apparent exceptions were not exceptions at all. The discussion was not polite theory. To officials, removing a public pump handle meant disrupting a neighborhood on evidence that did not yet fit accepted medicine. To Snow, waiting for perfect proof meant letting a hidden water system keep acting. He met the St James parish authorities on September 7 and argued from pattern: deaths gathered around the Broad Street pump, while some nearby groups using other water sources were spared. The handle was removed the next day. The outbreak was already declining, so the handle did not magically end the epidemic by itself. Its deeper historical force was different: the case showed that a city could be read as data, infrastructure, habit, and disease pathway at the same time.",
    storyBodyZh: "1854 年 8 月底，霍乱在伦敦 Soho 的 Broad Street 附近爆发。当时主流解释仍是“瘴气”：坏空气、臭味、有毒的环境。约翰·斯诺把目光转向别处。在当地知识的帮助下，包括牧师 Henry Whitehead 的走访，他追踪人们住在哪里、喝哪口水泵、谁已经逃离、谁留下，以及哪些看似反例其实并不是反例。这场讨论不是温和的学术争论。对官员来说，拆掉公共水泵把手，意味着用尚未被主流医学接受的证据打断一个社区的日常供水。对斯诺来说，等待完美证明，等于让隐藏的供水系统继续行动。9 月 7 日，他向 St James 教区管理者陈述病例模式：死亡集中在 Broad Street 水泵周围，而附近一些使用其他水源的人群相对幸免。第二天，水泵把手被拆除。疫情当时已经在下降，所以把手并不是“神奇终结”疫情的单一原因。它真正深刻的历史意义在于：这件事证明，一座城市可以同时被读成数据、基础设施、生活习惯和疾病路径。",
    insight: "Conclusion: the breakthrough was not only removing a pump handle. It was changing what counted as evidence. Snow's case turned scattered deaths into a spatial argument, and it showed that public health decisions often happen before every mechanism is fully accepted. The MapKAI lesson: a real problem may only become visible when evidence, infrastructure, local memory, and institutional authority are mapped together.",
    insightZh: "结论：真正的突破不只是拆掉一个水泵把手，而是改变了“什么算证据”。斯诺把分散的死亡变成空间论证，也说明公共卫生决策常常必须发生在机制被完全接受之前。对 MapKAI 来说，这个故事的结论是：真实问题往往只有把证据、基础设施、地方记忆和制度权力放在同一张图上，才会变得可见。",
    perspectives: [
      {
        lens: "Medical orthodoxy asked: is the air poisoned?",
        lensZh: "主流医学问：是不是空气有毒？",
        focus: "Miasma theory made smell and atmosphere feel like the obvious cause. That lens protected the old explanation but missed the water route.",
        focusZh: "瘴气说让气味和空气看起来像显而易见的原因。这个视角保护了旧解释，却错过了水源路径。",
      },
      {
        lens: "Snow asked: where do the cases cluster?",
        lensZh: "斯诺问：病例聚集在哪里？",
        focus: "His argument treated streets, pumps, deaths, and exceptions as one evidence system. The map became a reasoning tool, not decoration.",
        focusZh: "他的论证把街道、水泵、死亡和反例放进同一个证据系统。地图成了推理工具，而不是装饰。",
      },
      {
        lens: "Local knowledge asked: who actually drank from the pump?",
        lensZh: "地方知识问：谁真的喝了那口水？",
        focus: "Household habits, workhouse wells, brewery beer, and people who crossed streets for preferred water mattered as much as formal data.",
        focusZh: "家庭习惯、济贫院自己的井、啤酒厂的啤酒、以及特意跨街取水的人，都和正式数据一样重要。",
      },
      {
        lens: "Authorities asked: can we act before certainty?",
        lensZh: "管理者问：没有绝对确定前能不能行动？",
        focus: "The pump handle decision was a governance problem: how much evidence is enough when delay has a human cost?",
        focusZh: "拆水泵把手是一个治理问题：当拖延会带来生命代价时，多少证据才足够？",
      },
      {
        lens: "If the water supplier had a stronger seat",
        lensZh: "如果供水方拥有更强席位",
        focus: "It might have framed the case as reputation risk, property concern, and insufficient proof. Its likely move would be to demand more testing while resisting blame for a citywide sanitation problem.",
        focusZh: "它可能会把事件定义为声誉风险、产权问题和证据不足。它最可能的操作，是要求更多检测，同时拒绝为全城卫生系统问题单独背责。",
      },
      {
        lens: "If Bazalgette's infrastructure lens entered early",
        lensZh: "如果巴泽尔杰特式基础设施视角提前进入",
        focus: "The discussion would move beyond one pump: cesspits, sewers, river intake, street density, and future city design. The intervention would be expensive, slow, and politically harder than removing a handle.",
        focusZh: "讨论会越过单一水泵，转向粪坑、下水道、河流取水、街区密度和未来城市设计。这个操作更昂贵、更慢，也比拆把手更难获得政治支持。",
      },
      {
        lens: "If a grieving family spoke in the room",
        lensZh: "如果遇难家庭在场发言",
        focus: "The standard of proof would feel different. The family would likely ask why uncertainty protects the institution more quickly than it protects the living.",
        focusZh: "证据标准会立刻变得不同。家属很可能会问：为什么“不确定性”总是更快保护机构，而不是更快保护活着的人？",
      },
    ],
    miniQuestion: "When evidence is strong but not yet culturally accepted, should public action wait, persuade, or intervene?",
    miniQuestionZh: "当证据已经很强、但还没被文化接受时，公共行动应该等待、说服，还是先介入？",
    isPublished: true,
    createdAt: "2026-06-13",
    updatedAt: "2026-06-13",
  },
  {
    id: "challenger-launch-decision",
    title: "The Challenger Launch Decision",
    titleZh: "挑战者号发射决策",
    episode: "Historical Case 2",
    eventType: "engineering risk",
    mainField: "0716-motor-vehicles-ships-and-aircraft",
    activatedFields: [
      "0714-electronics-and-automation",
      "0613-software-and-applications-development-and-analysis",
      "0413-management-and-administration",
      "1022-occupational-health-and-safety",
      "0223-philosophy-and-ethics",
    ],
    characters: ["roger-boisjoly", "allan-mcdonald", "morton-thiokol", "nasa-managers", "challenger-crew"],
    coreConcepts: ["engineering ethics", "risk communication", "organizational pressure", "safety margins"],
    summary: "The night before Challenger launched, engineers warned that cold could make the O-rings unsafe. The organization still found a way to say yes.",
    summaryZh: "挑战者号发射前夜，工程师警告低温可能让 O 型密封圈失效，但组织最后仍然找到了说“可以发射”的方式。",
    storyBody: "On January 27, 1986, the argument was already inside the system before the shuttle was on the pad. Forecasts pointed to unusually low temperatures at Kennedy Space Center. Morton Thiokol engineers worried that the rubber O-rings in the solid rocket booster joints would not seal properly in the cold. In the teleconference with NASA, the engineering recommendation was not to launch below the previous experience base of 53 degrees Fahrenheit. Then the discussion shifted. NASA managers challenged the data. Thiokol managers went off-line, reconsidered, and reversed the recommendation. The burden of proof quietly changed: instead of proving it was safe to launch, engineers felt pushed to prove beyond doubt that it was unsafe. Challenger launched the next morning and broke apart 73 seconds after liftoff. The Rogers Commission later concluded that the immediate cause was failure of the right solid rocket motor joint seals, but the deeper cause was a flawed decision process: incomplete communication, management judgment overriding engineering concern, and safety information failing to reach the people who could have stopped the launch.",
    storyBodyZh: "1986 年 1 月 27 日，挑战者号还没有升空，争论已经在系统内部发生。肯尼迪航天中心预计会出现异常低温。Morton Thiokol 的工程师担心，固体火箭助推器接缝里的橡胶 O 型密封圈在低温下无法及时密封。在与 NASA 的电话会议中，工程建议是：不要在低于既有飞行经验基础 53 华氏度的条件下发射。随后讨论发生了转向。NASA 管理者质疑数据，Thiokol 管理层离线内部讨论后推翻了原来的建议。举证责任悄悄改变：不再是证明“发射安全”，而变成工程师必须证明“绝对不安全”。第二天早晨，挑战者号发射，并在升空 73 秒后解体。罗杰斯委员会后来认定，直接原因是右侧固体火箭发动机接缝密封失效；更深的原因则是决策过程有严重缺陷：信息沟通不完整，管理判断压过工程担忧，安全信息没有抵达真正能叫停发射的人。",
    insight: "Conclusion: Challenger was not simply a machine failure. It was a knowledge-routing failure. A fact that stays inside the wrong meeting is not yet organizational knowledge. The MapKAI lesson is severe: in high-risk systems, the question is not only whether someone knows the danger, but whether the structure lets that knowledge interrupt momentum.",
    insightZh: "结论：挑战者号不只是机器失效，而是知识流动路径失效。一个事实如果只停留在错误的会议里，就还没有成为组织知识。对 MapKAI 来说，这个教训很严厉：在高风险系统里，问题不只是有没有人知道危险，而是组织结构是否允许这个知识打断惯性。",
    perspectives: [
      {
        lens: "Engineers asked: are we outside the data?",
        lensZh: "工程师问：我们是否已经超出数据范围？",
        focus: "The 53-degree threshold was not superstition. It marked the lowest previous O-ring experience and the boundary of confidence.",
        focusZh: "53 华氏度不是迷信，而是此前 O 型密封圈飞行经验的最低边界，也是信心边界。",
      },
      {
        lens: "Managers asked: is the evidence conclusive?",
        lensZh: "管理者问：证据是否足够确定？",
        focus: "The fatal move was treating uncertainty as permission. In safety work, uncertainty often means slow down, not proceed.",
        focusZh: "致命转向在于把“不确定”当作“可以继续”。在安全系统里，不确定常常意味着减速，而不是推进。",
      },
      {
        lens: "The organization asked: who owns the no?",
        lensZh: "组织问：谁拥有说“不”的权力？",
        focus: "A system can contain warnings and still launch if warnings do not have a protected path to authority.",
        focusZh: "一个系统可以拥有警告，却仍然发射；如果警告没有受保护的上行通道，它就无法改变结果。",
      },
      {
        lens: "The public saw progress",
        lensZh: "公众看见的是进步叙事",
        focus: "The mission carried national confidence, education symbolism, and schedule pressure. That made the technical doubt harder to hear.",
        focusZh: "这次任务承载着国家信心、教育象征和进度压力，这让技术疑虑更难被听见。",
      },
      {
        lens: "If Feynman had been in the launch call",
        lensZh: "如果费曼在发射前电话会议里",
        focus: "He would likely force the abstraction into a physical question: show me what cold does to the seal. That move changes debate from managerial confidence to observable behavior.",
        focusZh: "他很可能会把抽象争论变成物理问题：给我看低温会对密封圈做什么。这个动作会把讨论从管理信心转向可观察行为。",
      },
      {
        lens: "If the crew's family had a translated-risk seat",
        lensZh: "如果宇航员家属拥有“风险翻译”席位",
        focus: "The question would become: can you explain this uncertainty in ordinary language to the people who bear the irreversible cost?",
        focusZh: "问题会变成：你能不能用普通语言，把这个不确定性解释给那些承担不可逆代价的人？",
      },
      {
        lens: "If a schedule owner argued honestly",
        lensZh: "如果进度负责人诚实陈述",
        focus: "The schedule pressure would not disappear, but it would become visible. The room could then compare schedule loss against loss of crew, vehicle, public trust, and program legitimacy.",
        focusZh: "进度压力不会消失，但会变得可见。会议室才能把延期损失与人员、飞行器、公共信任和项目合法性的损失放在同一张桌上比较。",
      },
    ],
    miniQuestion: "In a high-risk decision, who should carry the burden of proof: the person warning, or the system wanting to proceed?",
    miniQuestionZh: "在高风险决策里，举证责任应该落在发出警告的人身上，还是落在想继续推进的系统身上？",
    isPublished: true,
    createdAt: "2026-06-13",
    updatedAt: "2026-06-13",
  },
  {
    id: "cuban-missile-crisis-excomm",
    title: "Thirteen Days at the Edge",
    titleZh: "核边缘的十三天",
    episode: "Historical Case 3",
    eventType: "crisis governance",
    mainField: "0312-political-sciences-and-civics",
    activatedFields: [
      "0311-economics",
      "0222-history-and-archaeology",
      "1031-military-and-defence",
      "0314-sociology-and-cultural-studies",
      "0231-language-acquisition",
    ],
    characters: ["john-f-kennedy", "nikita-khrushchev", "excomm", "robert-kennedy", "military-advisers"],
    coreConcepts: ["deterrence", "crisis negotiation", "communication", "strategic restraint"],
    summary: "In October 1962, Kennedy's advisers debated air strikes, invasion, and blockade while the world moved close to nuclear war.",
    summaryZh: "1962 年 10 月，肯尼迪的顾问们在空袭、入侵和封锁之间争论，世界一度走到核战争边缘。",
    storyBody: "In October 1962, U-2 photographs showed Soviet nuclear missile sites under construction in Cuba. President Kennedy did not announce the discovery immediately. He met secretly with advisers in what became ExComm, and the room divided around different kinds of fear. Some argued for air strikes or invasion: act fast, remove the missiles, show resolve. Others warned that a strike could miss missiles, kill Soviet personnel, invite retaliation in Berlin, or close the door to a negotiated exit. The chosen move was a naval quarantine, deliberately framed as less escalatory than an immediate attack while still forcing the crisis into public view. On October 22, Kennedy addressed the nation and demanded removal of the missiles. Then came the harder discussion: how to read Khrushchev's signals, whether to answer the softer message or the harder one, and what could be traded without appearing to trade. The public settlement was Soviet removal of missiles from Cuba in exchange for a US pledge not to invade. A separate US commitment to remove Jupiter missiles from Turkey stayed secret for more than twenty-five years. The crisis ended, but the arms race did not. The aftermath produced a hotline and helped lead toward the Limited Nuclear Test Ban Treaty, because both sides had seen how fragile command, language, and time could become.",
    storyBodyZh: "1962 年 10 月，U-2 侦察照片显示苏联正在古巴建设核导弹基地。肯尼迪总统没有立刻公开，而是秘密召集顾问会议，也就是后来的 ExComm。会议室里的分歧不是简单的强硬与软弱，而是不同类型的恐惧。有人主张空袭或入侵：迅速行动，摧毁导弹，展示决心。也有人警告，空袭可能漏掉导弹，可能杀死苏联人员，可能引发柏林方向的报复，也可能关上谈判出口。最后选择的是海上“隔离”，它被刻意设计成比直接攻击更低级别的升级，但又足以把危机推到公开场域。10 月 22 日，肯尼迪向全国发表电视讲话，要求苏联拆除导弹。随后更困难的讨论开始了：如何解读赫鲁晓夫的信号，回复较温和的信息还是较强硬的信息，哪些让步可以做但不能公开成交易。公开协议是苏联拆除古巴导弹，美国承诺不入侵古巴。另一项美国撤出土耳其 Jupiter 导弹的承诺，则保密了二十多年。危机结束了，但军备竞赛没有结束。后续的美苏热线和《部分禁止核试验条约》，都来自一个共同认识：指挥、语言和时间在核危机里都脆弱得可怕。",
    insight: "Conclusion: the deepest achievement was not victory but controlled ambiguity. Kennedy needed enough force to be believed and enough flexibility to leave the opponent a way out. The MapKAI lesson is that crisis decisions are rarely solved by one lens. Military capability, political signaling, historical memory, language, timing, and public legitimacy all act at once.",
    insightZh: "结论：最深的成就不是胜利，而是被控制住的模糊性。肯尼迪既需要足够的力量让对方相信美国认真，又需要足够的弹性给对手留下退路。对 MapKAI 来说，这个故事说明：危机决策很少能靠单一视角解决。军事能力、政治信号、历史记忆、语言、时间和公共合法性会同时行动。",
    perspectives: [
      {
        lens: "The military lens asked: can force remove the threat?",
        lensZh: "军事视角问：武力能否清除威胁？",
        focus: "Air strikes promised decisiveness but risked escalation if missiles survived or Soviet personnel were killed.",
        focusZh: "空袭看起来果断，但如果导弹残留或苏联人员死亡，升级风险会急剧上升。",
      },
      {
        lens: "The diplomatic lens asked: can the opponent retreat?",
        lensZh: "外交视角问：对手是否还有退路？",
        focus: "A deal had to remove missiles without making Khrushchev's retreat look like simple humiliation.",
        focusZh: "协议必须拆除导弹，同时不能让赫鲁晓夫的退让显得只是被羞辱。",
      },
      {
        lens: "The communication lens asked: which message is real?",
        lensZh: "沟通视角问：哪条信息才是真正信号？",
        focus: "The crisis turned letters, public speeches, private channels, and silence into strategic instruments.",
        focusZh: "危机把信件、公开讲话、秘密渠道和沉默都变成了战略工具。",
      },
      {
        lens: "The historical lens asked: what happens after the thirteen days?",
        lensZh: "历史视角问：十三天之后会留下什么？",
        focus: "The immediate settlement ended the missile crisis, but it also exposed the need for better crisis communication and nuclear restraint.",
        focusZh: "即时协议结束了导弹危机，但也暴露了危机沟通和核克制机制的必要性。",
      },
      {
        lens: "If Castro had been in the room",
        lensZh: "如果卡斯特罗在会议室里",
        focus: "The crisis would not look like only a US-Soviet chessboard. Cuba's invasion memory, sovereignty claim, and fear of abandonment would force a different definition of security.",
        focusZh: "危机就不会只像美苏棋盘。古巴的被入侵记忆、主权诉求和被抛弃恐惧，会迫使会议重新定义什么叫安全。",
      },
      {
        lens: "If Turkey or NATO allies had a visible seat",
        lensZh: "如果土耳其或北约盟友公开在场",
        focus: "The secret Jupiter missile trade would become harder. Kennedy's room would need to balance alliance trust against crisis exit, not simply bargain privately with Moscow.",
        focusZh: "秘密撤出 Jupiter 导弹的交易会变得更困难。肯尼迪的会议室必须同时权衡盟友信任和危机出口，而不只是与莫斯科私下交易。",
      },
      {
        lens: "If a UN mediator controlled the tempo",
        lensZh: "如果联合国调停者控制节奏",
        focus: "The likely move would be to slow public humiliation, create inspection language, and turn military movement into verifiable steps. That helps peace, but may weaken direct presidential control.",
        focusZh: "最可能的操作，是降低公开羞辱、设计核查语言，并把军事动作转成可验证步骤。这有利于和平，但也会削弱总统直接控制节奏的能力。",
      },
    ],
    miniQuestion: "When a crisis needs both firmness and an exit ramp, how should leaders decide what to make public and what to keep private?",
    miniQuestionZh: "当危机同时需要强硬和退路时，领导者应该如何决定什么公开、什么保密？",
    isPublished: true,
    createdAt: "2026-06-13",
    updatedAt: "2026-06-13",
  },
];

function getKnowledgeAreas() {
  return knowledgeAreas
    .filter((area) => area.code !== "99")
    .map((area) => ({
      ...area,
      title: getAreaDisplayTitle(area),
      fieldCount: getPracticalFieldsForArea(area.id).length,
    }));
}

function getKnowledgeFields() {
  return knowledgeFields.filter((field) => field.isPractical);
}

function getPracticalFieldsForArea(areaIdOrCode) {
  return getKnowledgeFields().filter((field) => field.areaId === areaIdOrCode || field.areaId.startsWith(`${areaIdOrCode}-`));
}

function getFieldById(fieldIdOrCode) {
  return knowledgeFields.find((field) => field.id === fieldIdOrCode || field.code === fieldIdOrCode);
}

function getFieldByCode(code) {
  return getFieldById(code);
}

function getAreaById(areaId) {
  return knowledgeAreas.find((area) => area.id === areaId);
}

function getNarrowFieldById(narrowFieldId) {
  return knowledgeNarrowFields.find((narrowField) => narrowField.id === narrowFieldId);
}

function getAreaDisplayTitle(area) {
  return currentLanguage === "zh" ? area.titleZh || area.title : area.title;
}

function getFieldDisplayTitle(field) {
  return currentLanguage === "zh" ? field.titleZh || field.title : field.title;
}

function getCharacterById(id) {
  return characters.find((character) => character.id === id);
}

function getCharacterName(id) {
  const character = getCharacterById(id);
  if (!character) return id;
  return currentLanguage === "zh" ? character.nameZh || character.name : character.name;
}

function getPublishedStories() {
  const builtInStories = historicalStories.filter((story) => story.isPublished);
  if (!document.body.classList.contains("founder-mode")) return builtInStories;
  return [...builtInStories, ...getFounderStories().filter((story) => story.isPublished)];
}

function getFounderStories() {
  try {
    const stored = JSON.parse(localStorage.getItem(founderStoriesKey) || "[]");
    return Array.isArray(stored) ? stored.filter((story) => story && typeof story === "object") : [];
  } catch {
    return [];
  }
}

const reviewedPublishedStoryOverridesZh = {
  "well-runs-low": {
    "storyBodyZh": "井水不是某个早晨突然消失的。先是水龙头出水变慢，接着老水管旁的石头总是潮湿，菜园浇水的桶数也越来越多。镇上的这种做法并非没有道理：谁先缺水，谁先去井边取；谁的事情更急，谁就多说几句。它能让一天勉强运转，却把维护、优先级和共同记忆都推到旁边。直到面包店警报响起，水压却不够接上消防软管，原来的做法才顶不住了。托马想给幼苗留水，萨娜先问诊所还能撑多久，尼科摊开那张带了好几周的维修图，阿雅让大家把各自水桶放到桌下，先沿着水管、井口、菜园和消防栓画一遍。原来的做法最危险的地方，是让每个人都以为自己只是在保护一桶水。可井不是私人物件，它把厨房、诊所、菜园、消防和道路施工拴在一起。只要这些关系不被画出来，下一次警报仍会把大家推回互相争抢。阿雅又让人把过去三次维修、两次停水和消防演练日期写在井旁石板上。那些原本只是抱怨的日期排在一起，才显出维护被一再推迟。问题不再只是“谁现在最需要水”，而变成“这口井怎样同时支撑食物、健康、生计和安全”。当漏水点、用水高峰和维修延误被放在同一张图上，井才从背景变成证据：危机不是突然来临，而是系统很久以前就开始低声提醒。于是，分水不再是临时善意，而变成要被记录、维修和共同复盘的公共安排。",
    "insightZh": "一场看得见的危机，常常是看不见系统的最后一章。水井可以被看成资源、维护、健康、农业、消防和信任的交汇点；真正的判断不是谁更急，而是哪一条关系已经长期没有被看见。"
  },
  "bread-price-debate": {
    "storyBodyZh": "奥托天还没亮就改了面包价格，木牌上的新数字被雨水打湿了一角。原来的做法很简单：顾客看价格，店主给理由，大家用贵不贵来判断公平。这个办法并不荒唐，价格确实能把面粉、人工和租金压缩成一个数。可当天早晨，数字没有结束争论，反而点燃了它。皮姆拍下新价格，贝娅要求看最近三周的面粉账，马洛沿着磨坊、推车、烤炉和货架追了一遍，才发现涨价里有真实成本，也有没写出来的恐惧。奥托承认，他多加了一点，因为下一批面粉可能更贵，而他害怕到时候所有人只责怪他。原来的做法最容易漏掉的是时间。今天的价格不只来自昨天的面粉，也来自店主对下一批货、下一场雨和下一次指责的预判。镇民不必接受所有涨价，但他们需要知道自己反对的是哪一层：真实成本、风险转嫁，还是没有说出口的恐惧。贝娅把账本翻到上个月，皮姆把价格照片按日期排开，马洛在纸上画出磨坊到面包架的路线。争论终于有了可以检查的顺序。问题不再只是“这个面包是不是太贵”，而变成“一个价格里，哪些是成本，哪些是风险，哪些是议价能力，哪些是对未来的判断”。当账本、路线和害怕被摊开，价格牌不再只是算术；它变成一段公共关系，要求人们同时看见事实和处境。从那以后，镇民看价格牌时会多停一秒：他们要问的不是数字冷不冷，而是数字藏了什么。",
    "insightZh": "公平不能只从表面数字判断。价格压缩了成本、不确定性、议价能力、声誉和恐惧；把这些层次拆开，争论才不只是情绪，也不只是账本。"
  },
  "school-curriculum-debate": {
    "storyBodyZh": "莉娜带来三份教案，以为会议会很快投票结束。原来的做法看起来可靠：课程按章节排列，目标写清楚，考试能检查学生记住了什么。学校需要这种秩序，否则每个人都会把课堂拉向自己的关心。可任带来的不是另一份教案，而是一叠小记录：学生能背定义，却在坏掉的公交时刻表前停住；能说出健康概念，却看不懂药品标签；能复述媒体素养，却在班级群谣言里不知道先核对什么。有人说学校不该变成现实生活本身。萨娜没有反驳口号，只把几张记录贴到白板上。莉娜擦掉原来的议程，写下：“一个孩子应该能看见什么？”原来的做法的局限，不是事实不重要，而是事实被放得太整齐。学生在真实生活里遇到的从来不是“第几章”的问题，而是同时带着文字、数字、身体、信任和判断的混合情境。课程若不训练这种迁移，答案就会留在纸上。任没有用一句“生活很复杂”压过别人，而是把三个学生卡住的瞬间逐条读出来：读不懂、不会查、不敢判断。会议因此有了证据压力。问题不再只是“这一章要不要加入课程”，而变成“课程训练学生注意什么、连接什么、在混乱里先检查什么”。事实仍然重要，工具仍然重要；只是它们不再躺在清单里，而要能跟着学生走出教室。那一刻，课程表没有变成答案，却开始像一张地图：它要告诉孩子遇到混乱时先看哪里。",
    "insightZh": "学习不只是储存答案，而是在建立注意力。课程会悄悄决定什么值得被看见，什么可以被忽略，以及学习者能不能把事实、工具和判断带到真实情境里。"
  },
  "broad-street-pump": {
    "storyBodyZh": "1854 年 9 月初，London Soho 的 Broad Street 附近，门牌号和死亡姓名被一行行记进纸上。那时许多人先看空气：臭沟、潮湿、腐败气味，好像已经足够解释霍乱。这个解释并非没有道理，气味确实常和污水、拥挤和疾病站在一起。可一个医生把地址标到地图上时，纸面开始不听气味的指挥。某些气味重的地方死亡不多，某些离街口远的人却喝过同一口水；济贫院和啤酒厂的例外，也需要被重新核对。他没有只画黑点，而是敲门询问水从哪里来，借助 Henry Whitehead 等地方知识追查习惯、路径和反例。旧解释的吸引力在于它很直观：臭味人人看得见、闻得到，也和贫穷街区的污水相连。地图的困难则在于，它要求人暂时相信一条看不见的路径。病例、门牌、水泵和例外被一起核对时，水才从日常用品变成可以干预的传播线索。这不是一张漂亮地图。每一个黑点背后都有地址、家庭习惯和取水路线；每一个反例都必须被追问，否则图形很容易变成另一种偏见。问题不再只是“哪片空气最脏”，而变成“哪些身体把同一口水带进了生活”。9 月 7 日，他向 St James 教区管理者陈述这种病例模式；第二天水泵把手被拆除。疫情当时已经在下降，把手不是神奇终点，但那张地图和走访让公共卫生看见：城市疾病可以沿着水源、街道、习惯和基础设施被追问。",
    "insightZh": "真正的转向不只是拆掉水泵把手，而是改变什么可以成为公共证据。分散死亡被放回地图、供水和生活习惯里，公共卫生才不再只盯着气味和恐惧。"
  },
  "challenger-launch-decision": {
    "storyBodyZh": "1986 年 1 月 27 日夜里，发射台还没有火焰，争论已经挤进电话会议。桌上有温度预报、旧飞行记录和几张 O 型密封圈图。原来的做法看起来像工程会议的常规动作：拿出数据，说明风险，管理层判断是否继续。它并非没有秩序；航天项目每天都要在复杂证据和进度压力之间做选择。可这一次，低温把旧秩序顶住了。Morton Thiokol 工程师担心橡胶密封圈在异常寒冷条件下无法及时封住固体火箭助推器接缝，并提出不要在低于既有经验边界 53 华氏度的条件下发射。随后问题被悄悄换了方向。会议不再追问“系统是否证明安全”，而变成工程师要证明“它一定不安全”。管理层离线重议后推翻建议，第二天挑战者号升空，并在 73 秒后解体。后来的调查指出右侧固体火箭发动机接缝密封失效，也指出决策过程本身失效：警告存在，却没有获得足够清楚、受保护、能叫停行动的路径。旧流程的可怕之处，是它看起来仍像正常流程。有人提数据，有人问证据，有人负责进度，每一步都能被解释成工作需要。真正改变问题的，是举证责任被调换以后，风险不再需要证明自己不存在；警告反而必须证明灾难必然发生。这让风险管理从技术判断变成组织问题：谁能把坏消息送到真正能停下按钮的人面前。",
    "insightZh": "挑战者号不只是机器失效，也是知识流动路径失效。高风险系统真正要问的不是有没有人知道危险，而是警告有没有权力打断惯性。"
  },
  "cuban-missile-crisis-excomm": {
    "storyBodyZh": "1962 年 10 月，U-2 侦察照片摊在会议桌上，黑白影像里的发射场还在建设。原来的问题似乎很直接：怎样把古巴的苏联导弹拿掉。这个问法并不幼稚，因为导弹真实存在，时间也在收紧。可每一种快答案都带着下一步危险。空袭可能漏掉导弹，入侵可能杀死苏联人员，强硬公开表态可能关上谈判出口，软弱又可能让威慑失去可信度。肯尼迪没有立刻公开，而是召集 ExComm 反复比较军事动作、措辞、时间和对方还能后退的余地。原来的问题的危险，是它把对方也当成没有内部压力的棋子。会议室真正难处理的，是每个动作都会被莫斯科、哈瓦那、盟友、军方和公众同时阅读。危机管理因此不只是选择工具，而是设计一串还能被对方接受、被自己解释的信号。照片只是入口。顾问们还要比较舰队位置、公开讲话、私下渠道和赫鲁晓夫信件里的语气。每一项都可能改变下一步的读法。问题不再只是“怎样清除威胁”，而变成“怎样施压，同时给对手留下可接受的退路”。最后选择的海上“隔离”比直接攻击低一级，却把危机推到公开场域。后来的解决方案包括苏联撤出古巴导弹、美国承诺不入侵古巴，以及秘密撤出土耳其 Jupiter 导弹。危机结束后，热线和核试验限制谈判继续出现，因为双方都看见了指挥、语言和时间在核危机里有多脆弱。",
    "insightZh": "这场危机最深的成就不是胜利，而是把升级控制在还能谈判的范围内。军事能力、政治信号、历史记忆、语言、时间和公众合法性同时行动，任何单一视角都不足以解释房间里的选择。"
  }
};

[...stories, ...historicalStories].forEach((story) => {
  const override = reviewedPublishedStoryOverridesZh[story.id];
  if (override) Object.assign(story, override);
});

function saveFounderStories(nextStories) {
  localStorage.setItem(founderStoriesKey, JSON.stringify(nextStories));
}

function getStoryTitle(story) {
  return currentLanguage === "zh" ? story.titleZh || story.title : story.title;
}

function getStorySummary(story) {
  return currentLanguage === "zh" ? story.summaryZh || story.summary || getStoryTeaser(story) : story.summary || getStoryTeaser(story);
}

function getStoryBody(story) {
  return currentLanguage === "zh" ? story.storyBodyZh || story.storyBody || story.summaryZh || story.summary : story.storyBody || story.summary;
}

function getStoryInsight(story) {
  return currentLanguage === "zh" ? story.insightZh || story.insight || "" : story.insight || "";
}

function getStoryMiniQuestion(story) {
  return currentLanguage === "zh" ? story.miniQuestionZh || story.miniQuestion || "" : story.miniQuestion || "";
}

function getStoryPerspectives(story) {
  return Array.isArray(story.perspectives) ? story.perspectives : [];
}

function getStoryPerspectiveLens(perspective) {
  return currentLanguage === "zh" ? perspective.lensZh || perspective.lens || "" : perspective.lens || "";
}

function getStoryPerspectiveFocus(perspective) {
  return currentLanguage === "zh" ? perspective.focusZh || perspective.focus || "" : perspective.focus || "";
}

function getLensStoryById(storyId) {
  return lensStories.find((story) => story.id === storyId);
}

function getLensStoryForGroup(categoryCode, groupCode) {
  return lensStories.find((story) => story.categoryCode === categoryCode && story.groupCode === groupCode && story.storyLevel !== "field");
}

function getLensStoryForField(categoryCode, groupCode, fieldCode) {
  return lensStories.find((story) =>
    story.categoryCode === categoryCode &&
    story.groupCode === groupCode &&
    Array.isArray(story.fieldCodes) &&
    story.fieldCodes.includes(fieldCode),
  );
}

function getLensStoryValue(story, key) {
  if (!story) return "";
  if (currentLanguage === "zh") return story[`${key}Zh`] || story[key] || "";
  return story[key] || "";
}

function getLensStoryList(story, key) {
  if (!story) return [];
  if (currentLanguage === "zh") return story[`${key}Zh`] || story[key] || [];
  return story[key] || [];
}

function getLensStoryFieldTitle(story, code, fallbackTitle) {
  if (currentLanguage === "zh") return story?.fieldTitlesZh?.[code] || fallbackTitle;
  return fallbackTitle;
}

function getConceptFableById(fableId) {
  return conceptFables.find((fable) => fable.id === fableId);
}

function getConceptFableForCategory(categoryCode) {
  return conceptFables.find((fable) => fable.categoryCode === categoryCode);
}

function getConceptFableValue(fable, key) {
  if (!fable) return "";
  if (currentLanguage === "zh") return fable[`${key}Zh`] || fable[key] || "";
  return fable[key] || "";
}

function getConceptFableList(fable, key) {
  if (!fable) return [];
  if (currentLanguage === "zh") return fable[`${key}Zh`] || fable[key] || [];
  return fable[key] || [];
}

function getConceptFableCategoryTitle(fable) {
  const category = categories.find((item) => item.code === fable.categoryCode);
  if (!category) return fable.categoryCode || "";
  return getCategoryTitle(category);
}

function getStoryFieldCodes(story) {
  return Array.from(new Set([story.mainField, ...(story.activatedFields || [])].filter(Boolean)));
}

function getValidatedStoryFields(story) {
  const allFieldIds = getStoryFieldCodes(story);
  const matched = [];
  const unmatched = [];
  allFieldIds.forEach((fieldId) => {
    const field = getFieldById(fieldId);
    if (field) matched.push(field);
    else unmatched.push(fieldId);
  });
  return { matched, unmatched };
}

function getStoryUnmatchedFields(story) {
  return getValidatedStoryFields(story).unmatched;
}

function getStoriesForField(fieldIdOrCode) {
  const field = getFieldById(fieldIdOrCode);
  if (!field) return [];
  return getPublishedStories().filter((story) => getStoryFieldCodes(story).includes(field.id));
}

function getStoryById(storyId) {
  return getPublishedStories().find((story) => story.id === storyId);
}

function getStoryTeaser(story) {
  const body = story.storyBody || story.summary || "";
  const firstSentence = body.match(/^[^.!?。！？]+[.!?。！？]/)?.[0] || body;
  return firstSentence.length > 180 ? `${firstSentence.slice(0, 177).trim()}...` : firstSentence;
}

function getStoryPublicTags(story) {
  if (story.id === "broad-street-pump") return ["Public Health", "Evidence", "Infrastructure", "Governance"];
  if (story.id === "challenger-launch-decision") return ["Engineering", "Risk", "Management", "Ethics"];
  if (story.id === "cuban-missile-crisis-excomm") return ["Crisis", "Diplomacy", "Military", "Communication"];
  return (story.coreConcepts || []).slice(0, 4).map((tag) => tag.replace(/\b\w/g, (letter) => letter.toUpperCase()));
}

function getLitFieldCodes() {
  return new Set(
    getPublishedStories()
      .flatMap((story) => getValidatedStoryFields(story).matched)
      .map((field) => field.id)
  );
}

function getConnectedFields(fieldIdOrCode) {
  const field = getFieldById(fieldIdOrCode);
  if (!field) return [];
  const connected = new Set();
  getStoriesForField(field.id).forEach((story) => {
    getStoryFieldCodes(story).forEach((code) => {
      if (code !== field.id) connected.add(code);
    });
  });
  return Array.from(connected).map(getFieldById).filter(Boolean);
}

function getCoverageStats() {
  const fields = getKnowledgeFields();
  const litFields = getLitFieldCodes();
  const published = getPublishedStories();
  const activatedTotal = published.reduce((total, story) => total + getValidatedStoryFields(story).matched.length, 0);
  return {
    officialAreas: knowledgeAreas.filter((area) => area.code !== "99").length,
    areasIncludingSpecial: knowledgeAreas.length,
    narrowFields: knowledgeNarrowFields.length,
    detailedFieldsExcludingUnknown: knowledgeFields.filter((field) => field.code !== "9999").length,
    detailedFieldsIncludingUnknown: knowledgeFields.length,
    totalPracticalFields: fields.length,
    administrativeFields: knowledgeFields.filter((field) => field.isAdministrative).length,
    litFields: fields.filter((field) => litFields.has(field.id)).length,
    unlitFields: fields.filter((field) => !litFields.has(field.id)).length,
    publishedStories: published.length,
    averageActivatedFields: published.length ? activatedTotal / published.length : 0,
    unmatchedStoryFields: published.flatMap(getStoryUnmatchedFields),
  };
}

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
const mapChallengeState = Object.fromEntries(challengeSubjects.map((code) => [code, {
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
const mapChallengeProgress = Object.fromEntries(challengeSubjects.map((code) => [code, "ocean"]));
let activeChallengeSubject = challengeSubjects[0];
let activeChallengeQuestion = null;
let currentAnsweredQuestion = null;
let challengeHistory = [];
let challengeReviewIndex = null;
let challengeQuestionPool = [];
let challengePoolIndex = 0;
let activeMapChallengeSubject = challengeSubjects[0];
let activeMapChallengeQuestion = null;
let currentMapChallengeResult = null;
let mapChallengeHistory = [];
let mapChallengeQuestionPool = [];
let mapChallengePoolIndex = 0;
let mapChallengeComplete = false;
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
let founderConsoleTab = localStorage.getItem(founderConsoleTabKey) || "messages";
let storyStudioInput = "";
let storyStudioValidation = null;
let pdcState = createPdcBaseState();
const pdcMaxNormalRound = 5;
let pdcPlaybackTimer = null;
let pdcWarmupTimer = null;
let pdcFounderSummary = null;
let pdcFounderStatus = { state: "idle", detail: "" };
const pdcAccessSessionKey = "mapkaiPdcAccessValidated";
const pdcFounderAccessSessionKey = "mapkaiPdcFounderAccessValidated";

function createPdcBaseState(overrides = {}) {
  return {
    pass: "",
    accessSessionReady: false,
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
    en: "Prepared PDC case. The council does not simply support or reject the checklist. It narrows the decision into a bounded next step: publish the checklist if it measures one concrete user response, can be maintained calmly for three weeks, and includes a stop condition before the team commits to a full product.",
    zh: "PDC 案例演示。这个委员会没有简单支持或反对清单，而是把问题压缩成一个有边界的下一步：如果清单能衡量一个具体用户反应、三周内可以平稳维护，并且在团队投入完整产品前有明确停止条件，就可以发布。",
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
    label: normalizePdcDemoLabel(round.label, round.roundNumber, round.phaseType),
    phaseLabel: normalizePdcDemoLabel(round.label, round.roundNumber, round.phaseType),
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
    placeholderNotice: "Prepared PDC case. / PDC 案例演示。",
    councilRoom: {
      title: "PDC Council Room",
      subtitle: "Prepared PDC case. / PDC 案例演示。",
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
      decisionFrame: demoScript.topic?.en || "Demo question",
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

function normalizePdcDemoLabel(label, roundNumber, phaseType) {
  if (typeof label === "string" && label.trim()) return label.trim();
  const english = label?.en || "";
  const chinese = label?.zh || "";
  const combined = [english, chinese].filter(Boolean).join(" / ");
  return combined || getPdcPhaseLabel(roundNumber, phaseType);
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
      <div class="founder-console founder-only" data-founder-console></div>
      <div class="pdc-founder-panel founder-only" data-pdc-founder-panel></div>
    </section>`;
}

function renderContactSections() {
  pages.forEach((page) => {
    if (page.dataset.page !== "/about") {
      page.querySelector(".contact-section")?.remove();
      return;
    }
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
      <p class="site-version">Version v${appVersion}</p>
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
  renderFounderConsole();
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
    const data = await validatePdcPassForSession(normalizedCode);
    if (data.founder_preview === true) {
      sessionStorage.setItem(pdcFounderAccessSessionKey, "true");
      sessionStorage.removeItem(pdcAccessSessionKey);
      localStorage.setItem(founderModeKey, "true");
      window.location.href = "/pdc-pilot?founderPreview=1";
      return;
    }
    sessionStorage.removeItem(pdcFounderAccessSessionKey);
    sessionStorage.setItem(pdcAccessSessionKey, "true");
    window.location.href = "/pdc-pilot";
  } catch (error) {
    if (status) status.textContent = error.message || "This PDC access code is no longer available.";
  }
}

async function validatePdcPassForSession(pass) {
  const response = await fetch("/api/pdc/validate-pass", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pass }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.valid !== true) {
    throw new Error(data.message || "This PDC access code is no longer available.");
  }
  return data;
}

async function validatePdcFounderPreviewSession() {
  const response = await fetch("/api/pdc/validate-pass?founderPreview=1", { cache: "no-store" });
  const data = await response.json().catch(() => ({}));
  return response.ok && data.valid === true && data.founder_preview === true;
}

function hasPdcAccessSession() {
  return sessionStorage.getItem(pdcAccessSessionKey) === "true";
}

function replacePdcPilotUrl() {
  if (window.location.pathname === "/pdc-pilot" && window.location.search) {
    window.history.replaceState({}, "", "/pdc-pilot");
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

async function initPdcPilotPage() {
  if (normalizeRoute(window.location.pathname) !== "/pdc-pilot") return;
  clearPdcPlaybackTimer();
  clearPdcWarmupTimer();
  const pass = getCurrentPdcPass();
  const params = new URLSearchParams(window.location.search);
  const founderPreviewRequested = params.get("founderPreview") === "1" && !pass;
  const founderPreviewAllowed = founderPreviewRequested ? await validatePdcFounderPreviewSession() : false;
  const accessSessionReady = !pass && !founderPreviewRequested && hasPdcAccessSession();
  if (
    pdcState.pass === pass
    && pdcState.founderPreview === founderPreviewAllowed
    && pdcState.accessSessionReady === accessSessionReady
    && pdcState.status !== "idle"
  ) {
    if (!pass && !founderPreviewAllowed && !accessSessionReady && pdcState.status === "ready") {
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
    accessSessionReady,
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
  if (accessSessionReady) {
    pdcState.valid = true;
    pdcState.status = "ready";
    pdcState.entryView = "standard";
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
    sessionStorage.removeItem(pdcFounderAccessSessionKey);
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
    await validatePdcPassForSession(pass);
    sessionStorage.setItem(pdcAccessSessionKey, "true");
    sessionStorage.removeItem(pdcFounderAccessSessionKey);
    replacePdcPilotUrl();
    pdcState.pass = "";
    pdcState.accessSessionReady = true;
    pdcState.valid = true;
    pdcState.status = "ready";
    pdcState.entryView = "standard";
    pdcState.message = "";
    renderPdcPilot();
  } catch (error) {
    sessionStorage.removeItem(pdcAccessSessionKey);
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
  const showPdcBackOption = !pdcState.pass && !pdcState.founderPreview && !pdcState.accessSessionReady;
  root.innerHTML = pdcShellTemplate(`
    ${isFullFunction ? `
      <section class="pdc-entry-option">
        <p class="eyebrow">Founder Full Function / Founder 完整高质量版本</p>
        <h2>Founder Full Function</h2>
        <p>Run the full high-quality council with 5.5 for all rounds.</p>
        <p>全部轮次使用 5.5，用于重要展示和内部验证。</p>
        <p class="trust-note">phaseModel = gpt-5.5 · finalModel = gpt-5.5</p>
      </section>` : ""}
    ${!pdcState.pass && !pdcState.founderPreview && !pdcState.accessSessionReady ? `
      <label class="pdc-question-label">
        <span>PDC access code</span>
        <input data-pdc-start-pass type="text" autocomplete="off" maxlength="80" placeholder="Enter access code">
      </label>` : ""}
    <label class="pdc-question-label">
      <span>Question</span>
      <textarea data-pdc-question maxlength="1200" rows="7" placeholder="Write one question you want to examine.">${escapeHtml(pdcState.question)}</textarea>
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
        <p>Explore a prepared PDC case before entering your own question.</p>
        <p class="pdc-demo-note">Best for decisions with trade-offs, competing priorities, or visible disagreement.</p>
        <p>先看一个 PDC 案例，再进入你自己的问题。</p>
        <button class="button secondary" type="button" data-pdc-watch-demo>Watch Demo / 观看 Demo</button>
      </section>
      <section class="pdc-entry-option">
        <p class="eyebrow">Access Code / 访问码</p>
        <h2>Enter PDC</h2>
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
  return `<section class="pdc-result"><p class="pdc-placeholder-notice">Prepared PDC case. / PDC 案例演示。</p></section>`;
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
            <p>${escapeHtml(pdcState.question || "Question")}</p>
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
      ${pdcState.founderPreview ? `<p class="pdc-founder-preview-label">Preview mode</p>` : ""}
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
      <p>Preview mode</p>
      <button class="button secondary" type="button" data-pdc-founder-reset>Start another preview</button>
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
        <p>${pdcState.demoMode ? "Prepared PDC case. / PDC 案例演示。" : "The council reviews your decision in structured rounds."}</p>
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
            <p>${escapeHtml(room.decisionOnTable || pdcState.question || "Question")}</p>
          </div>
          <div class="pdc-round-status">
            <strong>${escapeHtml(isWarmupPhase ? "Preparing the council" : currentRound.label || "Round 1 — Opening Views")}</strong>
            <span>${isWarmupPhase ? "Council is thinking · Local warm-up" : fullDialogue.length ? `${fullDialogue.length} active council statements` : "No dialogue lines available"}</span>
          </div>
          ${renderPdcPlaybackStatus(currentRound, playback, thinkingLine)}
          ${renderPdcDialogue(dialogue, activeSpeakerId, thinkingLine, showPhaseAfterPlayback, isWarmupPhase, currentRound)}
          ${showPhaseAfterPlayback ? renderPdcRoundSummary(currentRound, facilitator) : ""}
          ${showPhaseAfterPlayback ? renderPdcVotingSnapshot(currentRound) : ""}
          ${showPhaseAfterPlayback ? renderPdcRoundOutcome(currentRound) : ""}
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
  const hasContributionVote = Boolean(line.contributionVote?.targetSpeakerName || line.contributionVote?.targetSpeakerId || line.contributionVote?.reason);
  const hasConcernVote = Boolean(line.concernVote?.targetSpeakerName || line.concernVote?.targetSpeakerId || line.concernVote?.reason);
  const shouldShowVoteDetails = hasContributionVote || hasConcernVote;
  return `
    <div class="pdc-voting-line">
      <p>${escapeHtml(line.text || "Voting rationale recorded.")}</p>
      ${shouldShowVoteDetails ? `
        <div class="pdc-vote-chip-row">
          ${hasContributionVote ? `<span>Contribution: ${escapeHtml(line.contributionVote?.targetSpeakerName || line.contributionVote?.targetSpeakerId || "Recorded")}</span>` : ""}
          ${hasConcernVote ? `<span>Concern: ${escapeHtml(line.concernVote?.targetSpeakerName || line.concernVote?.targetSpeakerId || "Recorded")}</span>` : ""}
        </div>
        <dl>
          ${hasContributionVote ? `<dt>Contribution reason</dt><dd>${escapeHtml(line.contributionVote?.reason || "Recorded in round vote summary.")}</dd>` : ""}
          ${hasConcernVote ? `<dt>Concern reason</dt><dd>${escapeHtml(line.concernVote?.reason || "Recorded in round vote summary.")}</dd>` : ""}
        </dl>` : ""}
    </div>`;
}

function renderPdcRelationLabel(line) {
  const stanceType = String(line.stanceType || "").toLowerCase();
  const targetName = line.targetSpeakerName || "";
  if (!targetName) return "";
  const labelByType = {
    support: "Supports",
    challenge: "Challenges",
    clarify: "Clarifies",
    build: "Builds on",
  };
  const label = labelByType[stanceType] || "Challenges";
  return `<em class="pdc-relation-label">${label} ${escapeHtml(targetName)}</em>`;
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

function renderPdcRoundOutcome(round) {
  if (!round || round.phaseType !== "B") return "";
  const summary = round.voteSummary || {};
  const pressureRows = getPdcRoundPressureRows(round);
  const promoted = summary.leadingContributor || summary.starContributor || summary.operatingModelLead || null;
  const observerMove = round.rosterUpdate?.shouldArchivePerspective ? round.rosterUpdate : null;
  const reintroduced = round.reintroducedPerspective || null;
  const hasOutcome = pressureRows.length || promoted || observerMove || reintroduced;
  if (!hasOutcome) return "";
  return `
    <section class="pdc-round-outcome" aria-label="Round outcome">
      <h3>Round Outcome</h3>
      <div class="pdc-outcome-grid">
        <div>
          <strong>Attack / Defense Focus</strong>
          ${pressureRows.length ? `<ul>${pressureRows.map((row) => `<li><span>${escapeHtml(row.name)}</span><small>${Number(row.count)} challenge${row.count === 1 ? "" : "s"}</small></li>`).join("")}</ul>` : `<p>No direct challenge target recorded.</p>`}
        </div>
        <div>
          <strong>Promoted Contribution</strong>
          <p>${escapeHtml(promoted?.speakerName || promoted?.targetSpeakerName || "-")}${promoted?.count ? ` · ${Number(promoted.count)} support votes` : ""}</p>
          ${promoted?.reasonSummary || promoted?.reason ? `<small>${escapeHtml(promoted.reasonSummary || promoted.reason)}</small>` : ""}
        </div>
        <div>
          <strong>Moved to Observer</strong>
          <p>${escapeHtml(observerMove?.archivedSpeakerName || "-")}</p>
          ${observerMove?.archivedStance || observerMove?.reason ? `<small>${escapeHtml(observerMove.archivedStance || observerMove.reason)}</small>` : ""}
        </div>
        ${reintroduced ? `
          <div>
            <strong>Reintroduced Perspective</strong>
            <p>${escapeHtml(reintroduced.speakerName || "-")}${reintroduced.chosenBySpeakerName ? ` · chosen by ${escapeHtml(reintroduced.chosenBySpeakerName)}` : ""}</p>
            ${reintroduced.reason ? `<small>${escapeHtml(reintroduced.reason)}</small>` : ""}
          </div>` : ""}
      </div>
    </section>`;
}

function getPdcRoundPressureRows(round) {
  const counts = new Map();
  (Array.isArray(round.dialogue) ? round.dialogue : []).forEach((line) => {
    const targetId = line.targetSpeakerId || "";
    const targetName = line.targetSpeakerName || "";
    if (!targetId && !targetName) return;
    const key = targetId || targetName;
    const current = counts.get(key) || { id: targetId, name: targetName || targetId, count: 0 };
    current.count += 1;
    if (targetName) current.name = targetName;
    counts.set(key, current);
  });
  return Array.from(counts.values()).sort((a, b) => b.count - a.count || String(a.name).localeCompare(String(b.name)));
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
      decisionOnTable: pdcState.question || "Question",
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
    .replace(/[.,!?;:'"()[\]{}。！？；：“”‘’（）【】《》、\s]/g, "")
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
  if (!pdcState.founderPreview && !pdcState.pass && !inlinePass && !pdcState.accessSessionReady) {
    pdcState.message = "Please enter your PDC access code.";
    renderPdcPilot();
    return;
  }
  if (nextQuestion.length < 8) {
    pdcState.message = "Please enter a question before starting.";
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
    if (!pdcState.founderPreview) {
      sessionStorage.setItem(pdcAccessSessionKey, "true");
      pdcState.accessSessionReady = true;
      pdcState.pass = "";
    }
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
          ${entries.map((entry) => {
            const important = Number(entry.is_important || 0) === 1;
            return `
            <li>
              <time>${formatBoardTime(entry.created_at || entry.createdAt)}</time>
              <p>${escapeHtml(entry.message)}</p>
              <dl>
                <dt>Name</dt><dd>${escapeHtml(entry.name || "-")}</dd>
                <dt>Email</dt><dd>${escapeHtml(entry.email || "-")}</dd>
                <dt>Page</dt><dd>${escapeHtml(entry.page_path || "-")}</dd>
                <dt>Language</dt><dd>${escapeHtml(entry.language || "-")}</dd>
                <dt>Status</dt><dd>${escapeHtml(entry.status || "new")}${important ? " · Important" : ""}</dd>
              </dl>
              <div class="message-manager-controls">
                <label>Status
                  <select data-message-status="${entry.id || ""}">
                    ${["new", "reviewed", "replied", "archived"].map((value) => `<option value="${value}" ${(entry.status || "new") === value ? "selected" : ""}>${value}</option>`).join("")}
                  </select>
                </label>
                <label class="message-important"><input type="checkbox" data-message-important="${entry.id || ""}" ${important ? "checked" : ""}> Important</label>
                <label>Founder note
                  <textarea rows="2" data-message-note="${entry.id || ""}" placeholder="Internal note">${escapeHtml(entry.founder_note || "")}</textarea>
                </label>
                <button class="button secondary" type="button" data-save-message="${entry.id || ""}">Save update</button>
              </div>
            </li>`;
          }).join("")}
        </ul>` : `<p>${t("noMessages")}</p>`}`;
  });
}

async function saveMessageUpdate(messageId) {
  const statusEl = document.querySelector(`[data-message-status="${messageId}"]`);
  const importantEl = document.querySelector(`[data-message-important="${messageId}"]`);
  const noteEl = document.querySelector(`[data-message-note="${messageId}"]`);
  founderMessageStatus = { state: "saving", loaded: founderMessages.length, detail: "" };
  renderFounderMessages(founderMessages, founderMessageStatus);
  try {
    const response = await fetch("/api/contact-messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "X-MapKAI-Founder": "true" },
      body: JSON.stringify({
        id: Number(messageId),
        status: statusEl?.value || "new",
        is_important: importantEl?.checked ? 1 : 0,
        founder_note: noteEl?.value || "",
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.ok !== true) throw new Error(data.error || `HTTP ${response.status}`);
    await loadFounderMessages();
  } catch (error) {
    founderMessageStatus = { state: "failed", loaded: founderMessages.length, detail: error.message || "Could not update message." };
    renderFounderMessages(founderMessages, founderMessageStatus);
  }
}

function renderFounderConsole() {
  const consoles = Array.from(document.querySelectorAll("[data-founder-console]"));
  if (!consoles.length) return;
  const tabs = [
    ["messages", "Messages"],
    ["story-studio", "Story Studio"],
    ["knowledge-graph", "Knowledge Graph"],
    ["coverage", "Coverage"],
    ["debug", "Debug"],
  ];
  consoles.forEach((target) => {
    target.innerHTML = `
      <div class="founder-console-head">
        <p class="eyebrow">Founder Console</p>
        <h3>Internal MapKAI Console</h3>
      </div>
      <div class="founder-console-tabs" role="tablist">
        ${tabs.map(([id, label]) => `<button type="button" data-founder-console-tab="${id}" class="${founderConsoleTab === id ? "active" : ""}">${label}</button>`).join("")}
      </div>
      <div class="founder-console-panel">${renderFounderConsolePanel(founderConsoleTab)}</div>
    `;
  });
}

function renderFounderConsolePanel(tab) {
  if (tab === "story-studio") return renderStoryStudioPanel();
  if (tab === "knowledge-graph") return renderKnowledgeGraphPanel();
  if (tab === "coverage") return renderCoveragePanel();
  if (tab === "debug") return renderFounderDebugPanel();
  return renderMessageManagerPanel();
}

function renderMessageManagerPanel() {
  return `
    <section class="founder-console-section">
      <h4>Message Manager</h4>
      <p>Use the message controls above to mark status, importance, and founder notes. Updates use the contact message API when the D1 management columns are available.</p>
    </section>`;
}

function renderStoryStudioPanel() {
  const sample = storyStudioInput || JSON.stringify(createStoryStudioSample(), null, 2);
  return `
    <section class="founder-console-section story-studio">
      <div>
        <h4>Story Studio</h4>
        <p>Paste one story JSON object, validate field links against knowledgeFields, then save as draft or published in Founder localStorage.</p>
      </div>
      <textarea data-story-studio-input rows="14" spellcheck="false">${escapeHtml(sample)}</textarea>
      <div class="story-studio-actions">
        <button class="button secondary" type="button" data-story-validate>Validate JSON</button>
        <button class="button secondary" type="button" data-story-save-draft>Save Draft</button>
        <button class="button primary" type="button" data-story-save-published>Publish / Save Published</button>
        <button class="button secondary" type="button" data-story-clear>Clear</button>
      </div>
      <div class="story-studio-preview">${renderStoryStudioValidation(storyStudioValidation)}</div>
      <div class="local-story-list">
        <h5>Founder localStorage stories</h5>
        ${getFounderStories().length ? getFounderStories().map((story) => `<article><strong>${escapeHtml(story.title || story.id)}</strong><span>${story.isPublished ? "published" : "draft"}</span></article>`).join("") : "<p>No local founder stories yet.</p>"}
      </div>
    </section>`;
}

function createStoryStudioSample() {
  const now = new Date().toISOString();
  return {
    id: "market-roof-repair",
    episode: "Founder Draft",
    title: "The Market Roof Repair",
    titleZh: "市场屋顶维修",
    summary: "Rain leaks into the market, forcing the town to compare short-term patching with a full rebuild.",
    storyBody: "A sudden storm exposes weak beams above the market stalls. Niko wants to repair the structure properly, while Maro worries about closing the market for too long.",
    eventType: "infrastructure trade-off",
    mainField: "0732-building-and-civil-engineering",
    activatedFields: ["0413-management-and-administration", "0312-political-sciences-and-civics"],
    characters: ["niko", "maro", "aya"],
    coreConcepts: ["maintenance", "downtime", "public trade-offs"],
    miniQuestion: "When is a quick patch more expensive than a full repair?",
    isPublished: false,
    createdAt: now,
    updatedAt: now,
  };
}

function renderStoryStudioValidation(validation) {
  if (!validation) return "<p>Validation preview will appear here.</p>";
  const story = validation.story || {};
  return `
    <article class="story-studio-result ${validation.ok ? "is-valid" : "is-invalid"}">
      <h5>${validation.ok ? "Valid story JSON" : "Needs attention"}</h5>
      ${validation.errors.length ? `<ul>${validation.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>` : ""}
      <h4>${escapeHtml(story.title || "Untitled story")}</h4>
      <p>${escapeHtml(story.summary || "")}</p>
      ${story.storyBody ? `<p>${escapeHtml(story.storyBody)}</p>` : ""}
      <dl class="story-meta">
        <div><dt>Main field</dt><dd>${fieldLink(validation.mainField)}</dd></div>
        <div><dt>Matched fields</dt><dd>${validation.matchedFields.map(fieldLink).join("") || "-"}</dd></div>
        <div><dt>Unmatched fields</dt><dd>${validation.unmatchedFields.length ? validation.unmatchedFields.map((fieldId) => `<span class="unmatched-field">${escapeHtml(fieldId)}</span>`).join("") : "None"}</dd></div>
        <div><dt>Characters</dt><dd>${(story.characters || []).map(escapeHtml).join(", ")}</dd></div>
        <div><dt>Core concepts</dt><dd>${(story.coreConcepts || []).map(escapeHtml).join(", ")}</dd></div>
        <div><dt>Mini question</dt><dd>${escapeHtml(story.miniQuestion || "-")}</dd></div>
      </dl>
    </article>`;
}

function validateStoryJson(rawValue) {
  const errors = [];
  let story = null;
  try {
    story = JSON.parse(rawValue);
  } catch (error) {
    return { ok: false, errors: [`Invalid JSON: ${error.message}`], story: null, mainField: null, matchedFields: [], unmatchedFields: [] };
  }
  const required = ["id", "episode", "title", "summary", "storyBody", "mainField", "activatedFields", "characters", "coreConcepts", "isPublished"];
  required.forEach((key) => {
    if (story[key] === undefined || story[key] === null || story[key] === "") errors.push(`Missing required field: ${key}`);
  });
  if (!Array.isArray(story.activatedFields)) errors.push("activatedFields must be an array.");
  if (!Array.isArray(story.characters)) errors.push("characters must be an array.");
  if (!Array.isArray(story.coreConcepts)) errors.push("coreConcepts must be an array.");
  const mainField = getFieldById(story.mainField);
  const activatedFieldIds = Array.isArray(story.activatedFields) ? story.activatedFields : [];
  const matchedFields = [mainField, ...activatedFieldIds.map(getFieldById)].filter(Boolean);
  const unmatchedFields = [
    ...(mainField ? [] : [story.mainField].filter(Boolean)),
    ...activatedFieldIds.filter((fieldId) => !getFieldById(fieldId)),
  ];
  if (!mainField && story.mainField) errors.push(`mainField does not match knowledgeFields.id: ${story.mainField}`);
  if (unmatchedFields.length) errors.push(`Unmatched field IDs: ${unmatchedFields.join(", ")}`);
  return {
    ok: errors.length === 0,
    errors,
    story,
    mainField,
    matchedFields: Array.from(new Map(matchedFields.map((field) => [field.id, field])).values()),
    unmatchedFields,
  };
}

function saveStoryStudioStory(forcePublished = false) {
  const input = document.querySelector("[data-story-studio-input]");
  const rawValue = input?.value || "";
  storyStudioInput = rawValue;
  const validation = validateStoryJson(rawValue);
  storyStudioValidation = validation;
  if (!validation.story || validation.errors.length) {
    renderFounderConsole();
    return;
  }
  const now = new Date().toISOString();
  const nextStory = {
    ...validation.story,
    isPublished: forcePublished ? true : Boolean(validation.story.isPublished),
    updatedAt: now,
    createdAt: validation.story.createdAt || now,
  };
  const stored = getFounderStories().filter((story) => story.id !== nextStory.id);
  saveFounderStories([...stored, nextStory]);
  storyStudioValidation = validateStoryJson(JSON.stringify(nextStory, null, 2));
  renderStories();
  renderStoryMap();
  renderFounderConsole();
}

function renderKnowledgeGraphPanel() {
  return `
    <section class="founder-console-section">
      <h4>Knowledge Graph</h4>
      <div class="knowledge-graph-views">
        <article>
          <h5>Tree View</h5>
          ${renderFounderKnowledgeGraph()}
        </article>
        <article>
          <h5>Table View</h5>
          <div class="founder-table-wrap">${renderKnowledgeFieldTable()}</div>
        </article>
      </div>
    </section>`;
}

function renderKnowledgeFieldTable() {
  const litFields = getLitFieldCodes();
  return `
    <table class="founder-knowledge-table">
      <thead><tr><th>Code</th><th>Title</th><th>Title Zh</th><th>Area</th><th>Narrow field</th><th>Type</th><th>Light</th><th>Stories</th></tr></thead>
      <tbody>
        ${knowledgeFields.map((field) => {
          const area = getAreaById(field.areaId);
          const narrow = getNarrowFieldById(field.narrowFieldId);
          const storiesForField = getStoriesForField(field.id);
          return `<tr>
            <td>${field.code}</td>
            <td>${escapeHtml(field.title)}</td>
            <td>${escapeHtml(field.titleZh || "-")}</td>
            <td>${escapeHtml(area?.title || "-")}</td>
            <td>${escapeHtml(narrow?.title || "-")}</td>
            <td>${field.isAdministrative ? "admin" : "practical"}</td>
            <td>${litFields.has(field.id) ? "lit" : "unlit"}</td>
            <td>${storiesForField.length}</td>
          </tr>`;
        }).join("")}
      </tbody>
    </table>`;
}

function renderCoveragePanel() {
  const stats = getCoverageStats();
  return `
    <section class="founder-console-section">
      <h4>Coverage</h4>
      <div class="coverage-founder-grid">
        <span>Total detailed fields <strong>${stats.detailedFieldsIncludingUnknown}</strong></span>
        <span>Practical fields <strong>${stats.totalPracticalFields}</strong></span>
        <span>Administrative fields <strong>${stats.administrativeFields}</strong></span>
        <span>Lit practical fields <strong>${stats.litFields}</strong></span>
        <span>Unlit practical fields <strong>${stats.unlitFields}</strong></span>
        <span>Published stories <strong>${stats.publishedStories}</strong></span>
        <span>Average fields/story <strong>${stats.averageActivatedFields.toFixed(1)}</strong></span>
      </div>
    </section>`;
}

function renderFounderDebugPanel() {
  const stats = getCoverageStats();
  return `
    <section class="founder-console-section">
      <h4>Debug</h4>
      <pre>${escapeHtml(JSON.stringify({
        route: window.location.pathname,
        coordinateCounts: stats,
        localFounderStories: getFounderStories().length,
        messageApiStatus: founderMessageStatus,
        pdcStatus: pdcState.status,
      }, null, 2))}</pre>
    </section>`;
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

function applyTheme() {
  document.body.dataset.theme = currentTheme;
  themeButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.themeOption === currentTheme));
  });
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", currentTheme === "dark" ? "#03050a" : "#f8fafc");
}

function setTheme(theme) {
  if (!supportedThemes.includes(theme)) return;
  currentTheme = theme;
  localStorage.setItem(themeKey, theme);
  applyTheme();
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
  setText('.nav-links a[data-route="/"]', t("navHome"));
  setText('.nav-links a[data-route="/stories"]', t("navStories"));
  setText('.nav-links a[data-route="/explore"]', t("navExplore"));
  setText('.nav-links a[data-route="/map"]', t("navMap"));
  setText('.nav-links a[data-route="/pdc"]', t("navPdc"));
  setText('.nav-links a[data-route="/categories"]', t("navCategories"));
  setText('.nav-links a[data-route="/learning"]', t("navLearning"));
  setText('.nav-links a[data-route="/about"]', t("navAbout"));
  setText(".stories-page .stories-hero .eyebrow", t("storiesEyebrow"));
  setText(".stories-page .stories-hero h1", t("storiesTitle"));
  setText(".stories-page .stories-hero p:not(.eyebrow)", t("storiesCopy"));
  setText(".story-back-link", t("backToStories"));

  setText(".home-page .hero .eyebrow", t("homeEyebrow"));
  setText(".home-page .hero h1", t("homeTitle"));
  setText(".home-page .hero-copy", t("homeCopy"));
  setAllText(".home-page .hero-actions .button", [t("homePrimary"), t("homeMapAction")]);
  setText(".home-page .hero-microcopy", t("homeQuickMirrorHint"));

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
  setText(".map-how-panel h2", t("mapStatesTitle"));
  const mapStateItems = document.querySelectorAll(".map-how-panel li");
  const mapStateLabels = [
    t("mapStateOcean"),
    t("mapStateSnow"),
    t("mapStateLand"),
  ];
  mapStateItems.forEach((item, index) => {
    const [label, ...rest] = mapStateLabels[index].split(" ");
    item.innerHTML = `<strong>${escapeHtml(label || "")}</strong> ${escapeHtml(rest.join(" "))}`;
  });
  setAllText(".map-page .intro-copy .button", [t("mapChallengeAction"), t("mapLensAction"), t("goLearning")]);
  setText("#mapChallenge .stories-hero .eyebrow", t("mapChallengeEyebrow"));
  setText("#mapChallenge .stories-hero h1", t("mapChallengeTitle"));
  setText("#mapChallenge .stories-hero p:not(.eyebrow)", t("mapChallengeCopy"));
  setAllText("#mapChallenge .stories-hero .button", [t("mapChallengeViewMap"), t("mapLensAction")]);
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
  renderStories();
  renderConceptFables();
  const activeStory = normalizeRoute(window.location.pathname).match(/^\/stories\/([a-z0-9-]+)$/);
  if (activeStory) renderStoryDetail(activeStory[1]);
  const activeConceptFable = normalizeRoute(window.location.pathname).match(/^\/concept-fables\/([a-z0-9-]+)$/);
  if (activeConceptFable) renderConceptFableDetail(activeConceptFable[1]);
  const activeLensStory = normalizeRoute(window.location.pathname).match(/^\/lens-stories\/([a-z0-9-]+)$/);
  if (activeLensStory) renderLensStoryDetail(activeLensStory[1]);
  renderStoryMap();
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
  renderMapChallenge();
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
  if (target === "/knowledge-graph") {
    target = "/categories";
    replace = true;
    if (window.location.protocol !== "file:") {
      history.replaceState({ route: "/categories" }, "", "/categories");
    }
  }
  const visibleTarget = target;
  document.body.classList.toggle("pdc-public-route", visibleTarget === "/pdc" || visibleTarget === "/pdc-pilot");
  setFounderMode(isFounderMode());
  const categoryMatch = visibleTarget.match(/^\/categories\/(\d{2})$/);
  const fieldMatch = visibleTarget.match(/^\/fields\/([a-z0-9-]+)$/);
  const storyMatch = visibleTarget.match(/^\/stories\/([a-z0-9-]+)$/);
  const conceptFableMatch = visibleTarget.match(/^\/concept-fables\/([a-z0-9-]+)$/);
  const lensStoryMatch = visibleTarget.match(/^\/lens-stories\/([a-z0-9-]+)$/);
  if (categoryMatch) renderCategoryDetail(categoryMatch[1]);
  if (fieldMatch) renderFieldDetail(fieldMatch[1]);
  if (storyMatch) renderStoryDetail(storyMatch[1]);
  if (conceptFableMatch) renderConceptFableDetail(conceptFableMatch[1]);
  if (lensStoryMatch) renderLensStoryDetail(lensStoryMatch[1]);
  const activePage = categoryMatch
    ? "/categories/detail"
    : fieldMatch
      ? "/fields/detail"
      : storyMatch
        ? "/stories/detail"
        : conceptFableMatch
          ? "/concept-fables/detail"
          : lensStoryMatch
            ? "/lens-stories/detail"
            : visibleTarget;

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
      (linkRoute === "/stories" && (visibleTarget.startsWith("/stories") || visibleTarget.startsWith("/concept-fables"))) ||
      (linkRoute === "/categories" && (visibleTarget.startsWith("/categories") || visibleTarget.startsWith("/lens-stories/"))) ||
      (linkRoute === "/map" && (visibleTarget.startsWith("/fields/") || visibleTarget === "/map-challenge")) ||
      (linkRoute === "/learning" && visibleTarget.startsWith("/learning")) ||
      (linkRoute === "/about" && visibleTarget === "/about") ||
      (linkRoute === "/privacy" && visibleTarget === "/privacy") ||
      (linkRoute === "/responsible-use" && visibleTarget === "/responsible-use") ||
      (linkRoute === "/cookies" && visibleTarget === "/cookies") ||
      (linkRoute === "/terms" && visibleTarget === "/terms");
    link.classList.toggle("is-current", isCurrent);
  });

  if (visibleTarget === "/pdc-pilot") initPdcPilotPage();
  updateRouteMeta(visibleTarget);
  if (replace) return;
  if (window.location.protocol === "file:") {
    window.location.hash = target;
  } else {
    history.pushState({ route: target }, "", target);
  }
}

function updateRouteMeta(route) {
  const key = route.startsWith("/stories/")
    ? "/stories"
    : route.startsWith("/concept-fables/")
      ? "/concept-fables"
    : route.startsWith("/fields/")
      ? "/map"
      : route.startsWith("/lens-stories/")
        ? "/lens-stories"
        : route.startsWith("/categories/")
          ? "/categories"
          : route.startsWith("/learning/")
            ? "/learning"
            : routeMeta[route] ? route : "/";
  const meta = routeMeta[key] || routeMeta["/"];
  const canonicalRoute = key === "/" ? "/" : key;
  const canonicalUrl = `https://www.mapkai.com${canonicalRoute === "/" ? "/" : canonicalRoute}`;
  document.title = meta.title;
  const description = document.querySelector('meta[name="description"]');
  const robots = document.querySelector('meta[name="robots"]');
  const canonical = document.querySelector('link[rel="canonical"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (description) description.setAttribute("content", meta.description);
  if (robots) robots.setAttribute("content", meta.robots || "index, follow");
  if (canonical) canonical.setAttribute("href", canonicalUrl);
  if (ogTitle) ogTitle.setAttribute("content", meta.title);
  if (ogDescription) ogDescription.setAttribute("content", meta.description);
  if (ogUrl) ogUrl.setAttribute("content", canonicalUrl);
  if (ogImage) ogImage.setAttribute("content", "https://www.mapkai.com/assets/mapkai-og-image.png");
  if (twitterTitle) twitterTitle.setAttribute("content", meta.title);
  if (twitterDescription) twitterDescription.setAttribute("content", meta.description);
  if (twitterImage) twitterImage.setAttribute("content", "https://www.mapkai.com/assets/mapkai-og-image.png");
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

function renderStories() {
  const target = document.getElementById("storiesGrid");
  if (!target) return;
  const visibleStories = getPublishedStories();
  target.innerHTML = (document.body.classList.contains("founder-mode") ? visibleStories : visibleStories.slice(0, 3))
    .map((story) => {
      const tags = getStoryPublicTags(story).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      return `
        <a class="story-card story-entry-card" href="/stories/${story.id}" data-route="/stories/${story.id}">
          <div class="story-card-topline">
            <span>${escapeHtml(story.eventType || t("storiesEyebrow"))}</span>
          </div>
          <h2>${escapeHtml(getStoryTitle(story))}</h2>
          <p>${escapeHtml(getStorySummary(story))}</p>
          <div class="story-tag-row">${tags}</div>
          <strong>${escapeHtml(t("readStory"))}</strong>
        </a>`;
    })
    .join("");
}

function renderConceptFables() {
  const target = document.getElementById("conceptFableGrid");
  if (!target) return;
  target.innerHTML = conceptFables
    .map((fable) => {
      const href = `/concept-fables/${fable.id}`;
      const tags = getConceptFableList(fable, "tags").slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
      return `
        <a class="story-card story-entry-card concept-fable-card" href="${href}" data-route="${href}">
          <div class="story-card-topline">
            <span>${escapeHtml(t("conceptFablesEyebrow"))}</span>
            <span>${escapeHtml(getConceptFableCategoryTitle(fable))}</span>
          </div>
          <h2>${escapeHtml(getConceptFableValue(fable, "title"))}</h2>
          <p>${escapeHtml(getConceptFableValue(fable, "summary"))}</p>
          <div class="story-tag-row">${tags}</div>
          <strong>${escapeHtml(t("conceptFableRead"))}</strong>
        </a>`;
    })
    .join("");
}

function renderStoryDetail(storyId) {
  const target = document.getElementById("storyReader");
  if (!target) return;
  const story = getStoryById(storyId);
  if (!story) {
    target.innerHTML = `
      <h1>Story not found</h1>
      <p class="story-body">This story is not available yet.</p>`;
    return;
  }
  const insight = getStoryInsight(story);
  const miniQuestion = getStoryMiniQuestion(story);
  const perspectives = getStoryPerspectives(story)
    .map((perspective) => {
      const lens = getStoryPerspectiveLens(perspective);
      const focus = getStoryPerspectiveFocus(perspective);
      if (!lens && !focus) return "";
      return `
        <article>
          ${lens ? `<h3>${escapeHtml(lens)}</h3>` : ""}
          ${focus ? `<p><span>${escapeHtml(t("storyFocusLabel"))}</span> ${escapeHtml(focus)}</p>` : ""}
        </article>`;
    })
    .filter(Boolean)
    .join("");
  target.innerHTML = `
    <h1>${escapeHtml(getStoryTitle(story))}</h1>
    <p class="story-body">${escapeHtml(getStoryBody(story))}</p>
    ${insight ? `
      <aside class="story-insight">
        <span>${escapeHtml(t("storyInsightTitle"))}</span>
        <p>${escapeHtml(insight)}</p>
        ${miniQuestion ? `<strong>${escapeHtml(miniQuestion)}</strong>` : ""}
      </aside>` : ""}
    ${perspectives ? `
      <section class="story-perspectives" aria-label="${escapeHtml(t("storyPerspectivesTitle"))}">
        <div class="story-perspectives-heading">
          <span>${escapeHtml(t("storyPerspectivesTitle"))}</span>
          <p>${escapeHtml(t("storyPerspectivesCopy"))}</p>
        </div>
        <div class="story-perspective-grid">${perspectives}</div>
      </section>` : ""}`;
}

function renderConceptFableDetail(fableId) {
  const target = document.getElementById("conceptFableReader");
  if (!target) return;
  const fable = getConceptFableById(fableId);
  if (!fable) {
    target.innerHTML = `
      <h1>${escapeHtml(t("conceptFableNotFoundTitle"))}</h1>
      <p class="story-body">${escapeHtml(t("conceptFableNotFoundCopy"))}</p>`;
    return;
  }
  const categoryTitle = getConceptFableCategoryTitle(fable);
  const metaphorRows = getConceptFableList(fable, "metaphorMap")
    .map((item) => `
      <article>
        <strong>${escapeHtml(item.image || "")}</strong>
        <p>${escapeHtml(item.meaning || "")}</p>
      </article>`)
    .join("");
  const tags = getConceptFableList(fable, "tags").map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  target.innerHTML = `
    <div class="story-card-topline lens-story-topline">
      <span>${escapeHtml(t("conceptFablesEyebrow"))}</span>
      <span>${escapeHtml(categoryTitle)}</span>
    </div>
    <h1>${escapeHtml(getConceptFableValue(fable, "title"))}</h1>
    <p class="lens-story-summary">${escapeHtml(getConceptFableValue(fable, "summary"))}</p>
    <section class="lens-story-section concept-fable-story">
      <span>${escapeHtml(t("conceptFableStoryLabel"))}</span>
      <p>${escapeHtml(getConceptFableValue(fable, "storyBody"))}</p>
    </section>
    <aside class="story-insight lens-story-insight concept-fable-reveal">
      <span>${escapeHtml(t("conceptFableRevealLabel"))}</span>
      <h2>${escapeHtml(getConceptFableValue(fable, "conceptName"))}</h2>
      <p>${escapeHtml(getConceptFableValue(fable, "reveal"))}</p>
    </aside>
    <section class="lens-story-section lens-story-support">
      <span>${escapeHtml(t("conceptFableExplanationLabel"))}</span>
      <p>${escapeHtml(getConceptFableValue(fable, "explanation"))}</p>
    </section>
    <section class="concept-metaphor-section" aria-label="${escapeHtml(t("conceptFableMetaphorLabel"))}">
      <span>${escapeHtml(t("conceptFableMetaphorLabel"))}</span>
      <div class="concept-metaphor-grid">${metaphorRows}</div>
    </section>
    <aside class="story-insight lens-story-insight">
      <span>${escapeHtml(t("conceptFableReflectionLabel"))}</span>
      <strong>${escapeHtml(getConceptFableValue(fable, "reflectionQuestion"))}</strong>
    </aside>
    ${tags ? `<div class="lens-story-meta concept-fable-meta"><div><span>${escapeHtml(t("storyFocusLabel"))}</span><p class="story-tag-row">${tags}</p></div></div>` : ""}`;
}

function renderStoryMap() {
  renderCoverageSummary();
  renderAreaLayer();
  renderFieldLayer();
  renderMapStoryLayer();
}

function renderCoverageSummary() {
  const target = document.getElementById("coverageSummary");
  const founderTarget = document.getElementById("coverageFounderDashboard");
  const stats = getCoverageStats();
  if (target) {
    target.innerHTML = `
      <article><span>Areas</span><strong>${stats.officialAreas}</strong></article>
      <article><span>Practical fields</span><strong>${stats.totalPracticalFields}</strong></article>
      <article><span>Lit by stories</span><strong>${stats.litFields}</strong></article>
      <article><span>Still quiet</span><strong>${stats.unlitFields}</strong></article>
      <article><span>Published stories</span><strong>${stats.publishedStories}</strong></article>
    `;
  }
  if (founderTarget) {
    founderTarget.innerHTML = `
      <h3>Founder coverage dashboard</h3>
      <div class="coverage-founder-grid">
        <span>Official areas <strong>${stats.officialAreas}</strong></span>
        <span>Areas incl. 99 <strong>${stats.areasIncludingSpecial}</strong></span>
        <span>Narrow fields <strong>${stats.narrowFields}</strong></span>
        <span>Detailed fields excl. 9999 <strong>${stats.detailedFieldsExcludingUnknown}</strong></span>
        <span>Detailed fields incl. 9999 <strong>${stats.detailedFieldsIncludingUnknown}</strong></span>
        <span>Total practical fields <strong>${stats.totalPracticalFields}</strong></span>
        <span>Admin fields <strong>${stats.administrativeFields}</strong></span>
        <span>Lit fields <strong>${stats.litFields}</strong></span>
        <span>Unlit fields <strong>${stats.unlitFields}</strong></span>
        <span>Published stories <strong>${stats.publishedStories}</strong></span>
        <span>Average activated fields/story <strong>${stats.averageActivatedFields.toFixed(1)}</strong></span>
      </div>
      ${stats.unmatchedStoryFields.length ? `<p class="unmatched-field-note">Unmatched story field IDs: ${stats.unmatchedStoryFields.map(escapeHtml).join(", ")}</p>` : `<p class="unmatched-field-note">Story validation: all published story field IDs match knowledgeFields.</p>`}
      <details class="founder-knowledge-graph">
        <summary>Founder Knowledge Graph: full coordinate tree</summary>
        ${renderFounderKnowledgeGraph()}
      </details>
    `;
  }
}

function renderAreaLayer() {
  const target = document.getElementById("areaLayer");
  if (!target) return;
  const litFields = getLitFieldCodes();
  target.innerHTML = getKnowledgeAreas()
    .map((area) => {
      const areaFields = getPracticalFieldsForArea(area.id);
      const litCount = areaFields.filter((field) => litFields.has(field.id)).length;
      return `
        <article class="area-card ${litCount ? "is-lit" : "is-unlit"}">
          <span class="internal-code">${area.code}</span>
          <h4>${escapeHtml(area.title)}</h4>
          <p>${litCount}/${area.fieldCount} fields lit</p>
        </article>`;
    })
    .join("");
}

function renderFieldLayer() {
  const target = document.getElementById("fieldLayer");
  if (!target) return;
  const litFields = getLitFieldCodes();
  target.innerHTML = getKnowledgeFields()
    .map((field) => {
      const connectedStories = getStoriesForField(field.id);
      const isLit = litFields.has(field.id);
      const storyLinks = connectedStories.length
        ? connectedStories.map((story) => `<span>${escapeHtml(getStoryTitle(story))}</span>`).join("")
        : "<span>No story yet</span>";
      return `
        <article class="field-card ${isLit ? "is-lit" : "is-unlit"}">
          <div class="field-card-head">
            <span class="internal-code">${field.code}</span>
            <span>${isLit ? "Lit" : "Unlit"}</span>
          </div>
          <h4>${escapeHtml(getFieldDisplayTitle(field))}</h4>
          <p>${escapeHtml(field.plainMeaning)}</p>
          <div class="connected-story-row">${storyLinks}</div>
          <a href="/fields/${field.id}" data-route="/fields/${field.id}">Open field</a>
        </article>`;
    })
    .join("");
}

function renderMapStoryLayer() {
  const target = document.getElementById("mapStoryLayer");
  if (!target) return;
  target.innerHTML = getPublishedStories()
    .map((story) => `
      <article class="map-story-card">
        <span>${escapeHtml(story.eventType || t("storiesEyebrow"))}</span>
        <h4>${escapeHtml(getStoryTitle(story))}</h4>
        <p>
          ${getValidatedStoryFields(story).matched.map(fieldLink).join("")}
          ${getStoryUnmatchedFields(story).map((fieldId) => `<span class="unmatched-field">${escapeHtml(fieldId)}</span>`).join("")}
        </p>
      </article>`)
    .join("");
}

function renderFieldDetail(code) {
  const target = document.getElementById("fieldDetailCard");
  if (!target) return;
  const field = getFieldById(code);
  if (!field) {
    target.innerHTML = `<h1>Field not found</h1><p>This field is not available in the public map yet.</p>`;
    return;
  }
  const storiesForField = getStoriesForField(field.id);
  const connectedFields = getConnectedFields(field.id);
  const area = getAreaById(field.areaId);
  const narrowField = getNarrowFieldById(field.narrowFieldId);
  const isLit = getLitFieldCodes().has(field.id);
  target.innerHTML = `
    <p class="eyebrow">Field detail</p>
    <div class="field-detail-title">
      <span class="internal-code">${field.code}</span>
      <h1>${escapeHtml(getFieldDisplayTitle(field))}</h1>
    </div>
    <p>${escapeHtml(field.plainMeaning)}</p>
    <dl class="story-meta">
      <div><dt>Area</dt><dd>${escapeHtml(area ? getAreaDisplayTitle(area) : "Not available")}</dd></div>
      <div><dt>Narrow field</dt><dd>${escapeHtml(narrowField?.title || "Not available")}</dd></div>
      <div><dt>Status</dt><dd>${field.isAdministrative ? "Administrative" : "Practical"}</dd></div>
      <div><dt>Light status</dt><dd>${isLit ? "Lit by stories" : "Waiting for a story"}</dd></div>
      <div><dt>Stories that activated this field</dt><dd>${storiesForField.length ? storiesForField.map((story) => escapeHtml(getStoryTitle(story))).join(", ") : "No published story yet"}</dd></div>
      <div><dt>Connected fields</dt><dd>${connectedFields.length ? connectedFields.map(fieldLink).join("") : "No connected fields yet"}</dd></div>
    </dl>
  `;
}

function fieldLink(field) {
  if (!field) return "";
  return `<a class="field-pill" href="/fields/${field.id}" data-route="/fields/${field.id}"><span class="internal-code">${field.code}</span>${escapeHtml(getFieldDisplayTitle(field))}</a>`;
}

function renderFounderKnowledgeGraph() {
  return knowledgeAreas
    .map((area) => {
      const narrowFields = knowledgeNarrowFields.filter((narrowField) => narrowField.areaId === area.id);
      return `
        <section class="founder-graph-area">
          <h4><span class="internal-code">${area.code}</span>${escapeHtml(area.title)}</h4>
          ${narrowFields.map((narrowField) => {
            const fields = knowledgeFields.filter((field) => field.narrowFieldId === narrowField.id);
            return `
              <div class="founder-graph-narrow">
                <h5><span class="internal-code">${narrowField.code}</span>${escapeHtml(narrowField.title)}</h5>
                <div class="founder-graph-fields">
                  ${fields.map((field) => `<span class="${field.isAdministrative ? "is-admin" : "is-practical"}"><strong>${field.code}</strong>${escapeHtml(field.title)}</span>`).join("")}
                </div>
              </div>`;
          }).join("")}
        </section>`;
    })
    .join("");
}

function renderCategories() {
  const shelf = document.getElementById("lensStoryShelf");
  if (shelf) shelf.innerHTML = "";
  const grid = document.getElementById("categoryGrid");
  const categoryButtons = categories
    .map((category) => {
      const href = `/categories/${category.code}`;
      const fieldCount = category.groups.reduce((total, group) => total + group.fields.length, 0);
      return `
        <a class="category-button" href="${href}" data-route="${href}" aria-label="${escapeHtml(t("openCategory"))} ${escapeHtml(getCategoryTitle(category))}">
          <strong>${escapeHtml(getCategoryTitle(category))}</strong>
          <span>${escapeHtml(getCategoryThinking(category.code))}</span>
          <small>${category.groups.length} ${escapeHtml(t("groups"))} · ${fieldCount} ${escapeHtml(t("detailedFields"))}</small>
        </a>`;
    })
    .join("");
  if (grid) grid.innerHTML = categoryButtons;
}

function renderLensStoryShelf() {
  const target = document.getElementById("lensStoryShelf");
  if (!target) return;
  const shelfStories = baseLensStories;
  if (!shelfStories.length) {
    target.innerHTML = "";
    return;
  }
  const cards = shelfStories.map((story) => {
    const category = categories.find((item) => item.code === story.categoryCode);
    const categoryTitle = category ? getCategoryTitle(category) : t("lensStoryShelfLens");
    const href = `/lens-stories/${story.id}`;
    return `
      <a class="lens-story-sample-card" href="${href}" data-route="${href}">
        <img src="${escapeHtml(story.image)}" alt="${escapeHtml(getLensStoryValue(story, "imageAlt"))}" loading="lazy" />
        <span class="lens-story-sample-content">
          <small>${escapeHtml(t("lensStoryShelfLens"))} · ${escapeHtml(categoryTitle)}</small>
          <strong>${escapeHtml(getLensStoryValue(story, "title"))}</strong>
          <em>${escapeHtml(getLensStoryValue(story, "summary"))}</em>
          <b>${escapeHtml(t("readLensStory"))}</b>
        </span>
      </a>`;
  }).join("");
  target.innerHTML = `
    <div class="lens-story-shelf-heading">
      <span>${escapeHtml(t("lensStoryShelfEyebrow"))}</span>
      <h2>${escapeHtml(t("lensStoryShelfTitle"))}</h2>
      <p>${escapeHtml(t("lensStoryShelfCopy"))}</p>
    </div>
    <div class="lens-story-sample-grid">${cards}</div>`;
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
        <h2>${t("quickMirrorTitle")}</h2>
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
    <h2 class="challenge-question">${questionContent.question}</h2>
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

function getMapChallengeMasteryFromCorrect(subjectCode) {
  const subject = questionBank[subjectCode];
  const state = mapChallengeState[subjectCode];
  const correct = state?.correct || 0;
  const rule = subject?.unlockRule || { snow: 2, land: 4, green: 6 };
  if (correct >= rule.green) return "green";
  if (correct >= rule.land) return "land";
  if (correct >= rule.snow) return "snow";
  return "ocean";
}

function syncMapChallengeProgress(subjectCode) {
  if (subjectCode) {
    mapChallengeProgress[subjectCode] = getMapChallengeMasteryFromCorrect(subjectCode);
    return;
  }
  challengeSubjects.forEach((code) => {
    mapChallengeProgress[code] = getMapChallengeMasteryFromCorrect(code);
  });
}

function getAllMapChallengeQuestions() {
  return Object.entries(questionBank).flatMap(([subjectCode, subject]) => {
    return subject.questions.map((question) => ({ subjectCode, question }));
  });
}

function getMapChallengeTotalQuestionCount() {
  return getAllMapChallengeQuestions().length;
}

function getMapChallengeAnsweredCount() {
  return mapChallengeHistory.length;
}

function getMapChallengeCorrectCount() {
  return Object.values(mapChallengeState).reduce((total, state) => total + state.correct, 0);
}

function refillMapChallengeQuestionPool() {
  mapChallengeQuestionPool = shuffleQuestions(getAllMapChallengeQuestions());
  mapChallengePoolIndex = 0;
}

function setRandomMapChallengeQuestion() {
  if (mapChallengeComplete) {
    activeMapChallengeQuestion = null;
    return null;
  }
  if (!mapChallengeQuestionPool.length) refillMapChallengeQuestionPool();
  if (mapChallengePoolIndex >= mapChallengeQuestionPool.length) {
    mapChallengeComplete = true;
    activeMapChallengeQuestion = null;
    currentMapChallengeResult = null;
    return null;
  }
  const nextItem = mapChallengeQuestionPool[mapChallengePoolIndex];
  mapChallengePoolIndex += 1;
  activeMapChallengeSubject = nextItem.subjectCode;
  activeMapChallengeQuestion = nextItem.question;
  currentMapChallengeResult = null;
  return nextItem;
}

function resetMapChallenge() {
  challengeSubjects.forEach((code) => {
    mapChallengeState[code].correct = 0;
    mapChallengeState[code].answered = [];
    mapChallengeProgress[code] = "ocean";
  });
  activeMapChallengeSubject = challengeSubjects[0];
  activeMapChallengeQuestion = null;
  currentMapChallengeResult = null;
  mapChallengeHistory = [];
  mapChallengeQuestionPool = [];
  mapChallengePoolIndex = 0;
  mapChallengeComplete = false;
  setRandomMapChallengeQuestion();
  renderMapChallenge();
  drawKnowledgeMap();
}

function renderMapChallenge() {
  const target = document.getElementById("mapChallengeCard");
  if (!target) return;
  if (!activeMapChallengeQuestion && !mapChallengeComplete) setRandomMapChallengeQuestion();

  const answered = getMapChallengeAnsweredCount();
  const total = getMapChallengeTotalQuestionCount();
  const correct = getMapChallengeCorrectCount();
  const openedCounts = challengeSubjects.reduce((counts, code) => {
    counts[mapChallengeProgress[code] || "ocean"] += 1;
    return counts;
  }, { ocean: 0, snow: 0, land: 0, green: 0 });

  if (mapChallengeComplete) {
    target.innerHTML = `
      <div class="challenge-progress-line">${escapeHtml(t("mapChallengeEyebrow"))}</div>
      <h2 class="challenge-question">${escapeHtml(t("mapChallengeCompleteTitle"))}</h2>
      <p>${escapeHtml(t("mapChallengeCompleteCopy"))}</p>
      <div class="challenge-status is-green">${escapeHtml(t("mapChallengeStatus", correct, answered, openedCounts.snow, openedCounts.land, openedCounts.green))}</div>
      <div class="hero-actions">
        <a class="button primary" href="/map" data-route="/map">${escapeHtml(t("mapChallengeViewMap"))}</a>
        <button class="button secondary" type="button" data-map-challenge-reset>${escapeHtml(t("mapChallengeRestart"))}</button>
      </div>`;
    return;
  }

  const question = activeMapChallengeQuestion;
  const questionContent = getQuestionContent(question);
  const options = Array.isArray(questionContent.options) ? questionContent.options : [];
  const answeredCurrent = Boolean(currentMapChallengeResult);
  const subjectName = getSubjectTitle(activeMapChallengeSubject);
  target.innerHTML = `
    <div class="challenge-progress-line">${escapeHtml(t("mapChallengeProgress", answered + 1, total, subjectName))}</div>
    <h2 class="challenge-question">${escapeHtml(questionContent.question || "")}</h2>
    <div class="answer-grid">
      ${options.map((option, index) => {
        const selected = currentMapChallengeResult?.selectedIndex === index;
        const correctOption = answeredCurrent && option === questionContent.answer;
        const className = correctOption ? "is-correct" : selected ? "is-wrong" : "";
        return `<button class="${className}" type="button" data-map-challenge-answer="${index}" ${answeredCurrent ? "disabled" : ""}>${escapeHtml(option)}</button>`;
      }).join("")}
    </div>
    ${currentMapChallengeResult ? `
      <div class="challenge-result ${currentMapChallengeResult.correct ? "is-correct" : "is-incorrect"}">
        <strong>${escapeHtml(currentMapChallengeResult.correct ? t("mapChallengeCorrect") : t("mapChallengeIncorrect"))}</strong>
        <p>${escapeHtml(questionContent.explanation || "")}</p>
      </div>` : ""}
    <div class="challenge-status">${escapeHtml(t("mapChallengeStatus", correct, answered, openedCounts.snow, openedCounts.land, openedCounts.green))}</div>
    <div class="hero-actions">
      ${answeredCurrent ? `<button class="button primary" type="button" data-map-challenge-next>${escapeHtml(t("mapChallengeNext"))}</button>` : ""}
      <a class="button secondary" href="/map" data-route="/map">${escapeHtml(t("mapChallengeViewMap"))}</a>
      <button class="button secondary" type="button" data-map-challenge-reset>${escapeHtml(t("mapChallengeRestartShort"))}</button>
    </div>
    <div class="founder-note internal-code">${escapeHtml(t("mapChallengeSource", activeMapChallengeSubject, subjectName, question.id || ""))}</div>`;
}

function answerMapChallenge(optionIndex) {
  const question = activeMapChallengeQuestion;
  const subjectCode = activeMapChallengeSubject;
  const state = mapChallengeState[subjectCode];
  const questionContent = getQuestionContent(question);
  const options = Array.isArray(questionContent.options) ? questionContent.options : [];
  const selectedOption = options[optionIndex];
  if (!question || !state || selectedOption === undefined || currentMapChallengeResult) return;
  const isCorrect = selectedOption === questionContent.answer;
  state.answered.push(question.id);
  if (isCorrect) state.correct += 1;
  syncMapChallengeProgress(subjectCode);
  currentMapChallengeResult = { selectedIndex: optionIndex, correct: isCorrect };
  mapChallengeHistory.push({ subjectCode, questionId: question.id, selectedOption, correct: isCorrect });
  renderMapChallenge();
  drawKnowledgeMap();
}

function moveToNextMapChallengeQuestion() {
  setRandomMapChallengeQuestion();
  renderMapChallenge();
  drawKnowledgeMap();
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
  if (!category.groups.length) {
    target.innerHTML = "";
    return;
  }
  const savedGroupCode = activeCategorySubmodules[category.code];
  const activeGroup = category.groups.find((group) => group.code === savedGroupCode) || category.groups[0];
  activeCategorySubmodules[category.code] = activeGroup.code;
  const activeGroupStory = getLensStoryForGroup(category.code, activeGroup.code);
  const fieldStateKey = `${category.code}:${activeGroup.code}`;
  const savedFieldCode = activeCategoryFields[fieldStateKey];
  const activeField = savedFieldCode ? activeGroup.fields.find(([fieldCode]) => fieldCode === savedFieldCode) : null;
  const activeFieldCode = activeField?.[0] || "";
  const activeFieldFallbackTitle = activeField?.[1] || "";
  if (savedFieldCode && !activeFieldCode) delete activeCategoryFields[fieldStateKey];
  const activeFieldStory = activeFieldCode ? getLensStoryForField(category.code, activeGroup.code, activeFieldCode) : null;
  const activeFieldTitle = activeFieldCode ? getLensStoryFieldTitle(activeFieldStory || activeGroupStory, activeFieldCode, activeFieldFallbackTitle) : "";
  const submoduleButtons = category.groups
    .map((group) => {
      const groupStory = getLensStoryForGroup(category.code, group.code);
      const groupTitle = getLensStoryValue(groupStory, "groupTitle") || group.title;
      const isActive = group.code === activeGroup.code;
      return `
        <button class="submodule-button ${isActive ? "is-active" : ""}" type="button" data-submodule-select="${escapeHtml(category.code)}:${escapeHtml(group.code)}" aria-pressed="${isActive}">
          <span>${escapeHtml(groupTitle)}</span>
        </button>`;
    })
    .join("");
  const fieldButtons = activeGroup.fields
    .map(([fieldCode, fieldTitle]) => {
      const fieldStory = getLensStoryForField(category.code, activeGroup.code, fieldCode);
      const displayTitle = getLensStoryFieldTitle(fieldStory || activeGroupStory, fieldCode, fieldTitle);
      const isActive = fieldCode === activeFieldCode;
      return `
        <button class="detailed-field-button ${isActive ? "is-active" : ""}" type="button" data-field-select="${escapeHtml(category.code)}:${escapeHtml(activeGroup.code)}:${escapeHtml(fieldCode)}" aria-pressed="${isActive}">
          <span>${escapeHtml(displayTitle)}</span>
        </button>`;
    })
    .join("");
  const conceptFable = getConceptFableForCategory(category.code);
  const fieldIntroStory = activeFieldStory
    ? `<a class="submodule-story-button is-field" href="/lens-stories/${activeFieldStory.id}" data-route="/lens-stories/${activeFieldStory.id}">
        <span>${escapeHtml(activeFieldTitle)}</span>
        <em>${escapeHtml(t("fieldIntroStory"))}</em>
      </a>`
    : activeFieldCode ? `<div class="submodule-story-button is-empty">
        <span>${escapeHtml(activeFieldTitle || t("detailedFieldLabel"))}</span>
        <small>${escapeHtml(t("noStoryReady"))}</small>
      </div>` : "";
  const conceptFableMatchesField = conceptFable && conceptFable.selectedFieldCode === activeFieldCode;
  const conceptFableButton = conceptFableMatchesField
    ? `<a class="submodule-story-button is-concept" href="/concept-fables/${conceptFable.id}" data-route="/concept-fables/${conceptFable.id}">
        <span>${escapeHtml(getConceptFableValue(conceptFable, "conceptName"))}</span>
        <em>${escapeHtml(t("importantConceptStories"))}</em>
      </a>`
    : "";
  const fieldStoryActions = `${fieldIntroStory}${conceptFableButton}`.trim();
  target.innerHTML = `
    <div class="submodule-browser">
      <div class="hierarchy-layer module-layer">
        <span class="hierarchy-layer-label">${escapeHtml(t("submoduleLabel"))}</span>
        <div class="submodule-button-row" role="tablist" aria-label="${escapeHtml(t("submoduleLabel"))}">
          ${submoduleButtons}
        </div>
      </div>
      <section class="submodule-compact-panel" aria-live="polite">
        <div class="hierarchy-layer nested-field-layer">
          <span class="hierarchy-layer-label">${escapeHtml(t("detailedFieldLabel"))}</span>
          <div class="detailed-field-button-list" role="tablist" aria-label="${escapeHtml(t("detailedFieldLabel"))}">
            ${fieldButtons}
          </div>
        </div>
        ${fieldStoryActions ? `<div class="field-story-actions">${fieldStoryActions}</div>` : ""}
       </section>
    </div>`;
}

function renderLensStoryDetail(storyId) {
  const target = document.getElementById("lensStoryReader");
  if (!target) return;
  const story = getLensStoryById(storyId);
  if (!story) {
    target.innerHTML = `
      <h1>${escapeHtml(t("lensStoryNotFoundTitle"))}</h1>
      <p class="story-body">${escapeHtml(t("lensStoryNotFoundCopy"))}</p>`;
    return;
  }
  const category = categories.find((item) => item.code === story.categoryCode);
  const group = category?.groups.find((item) => item.code === story.groupCode);
  const categoryTitle = category ? getCategoryTitle(category) : t("lensStoryShelfLens");
  const shouldShowFigure = story.image && !story.imageInheritedFromGroup;
  const backLink = document.getElementById("lensStoryBack");
  if (backLink) {
    const categoryHref = `/categories/${story.categoryCode}`;
    backLink.textContent = t("backToLens");
    backLink.setAttribute("href", categoryHref);
    backLink.dataset.route = categoryHref;
  }
  const tags = getLensStoryList(story, "tags").map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const support = getLensStoryValue(story, "support");
  const fieldRows = (group?.fields || [])
    .filter(([code]) => story.fieldCodes.includes(code))
    .map(([code, title]) => `
      <span>
        <strong class="internal-code">${escapeHtml(code)}</strong>
        ${escapeHtml(getLensStoryFieldTitle(story, code, title))}
      </span>`)
    .join("");
  target.innerHTML = `
    ${shouldShowFigure ? `
    <figure class="lens-story-figure">
      <img src="${escapeHtml(story.image)}" alt="${escapeHtml(getLensStoryValue(story, "imageAlt"))}" loading="lazy" />
    </figure>` : ""}
    <div class="story-card-topline lens-story-topline">
      <span>${escapeHtml(t("lensStoryEyebrow"))}</span>
      <span>${escapeHtml(categoryTitle)}</span>
    </div>
    <h1>${escapeHtml(getLensStoryValue(story, "title"))}</h1>
    <p class="lens-story-summary">${escapeHtml(getLensStoryValue(story, "summary"))}</p>
    <section class="lens-story-section">
      <span>${escapeHtml(t("lensStorySceneLabel"))}</span>
      <p>${escapeHtml(getLensStoryValue(story, "scene"))}</p>
      <p>${escapeHtml(getLensStoryValue(story, "storyBody"))}</p>
    </section>
    ${support ? `
    <section class="lens-story-section lens-story-support">
      <span>${escapeHtml(t("lensStorySupportLabel"))}</span>
      <p>${escapeHtml(support)}</p>
    </section>` : ""}
    <aside class="story-insight lens-story-insight">
      <span>${escapeHtml(t("lensStoryKnowledgeLabel"))}</span>
      <p>${escapeHtml(getLensStoryValue(story, "knowledgePoint"))}</p>
      <strong>${escapeHtml(getLensStoryValue(story, "reflectionQuestion"))}</strong>
    </aside>
    <div class="lens-story-meta">
      ${fieldRows ? `<div><span>${escapeHtml(t("lensStoryFieldLabel"))}</span><p>${fieldRows}</p></div>` : ""}
      ${tags ? `<div><span>${escapeHtml(t("storyFocusLabel"))}</span><p class="story-tag-row">${tags}</p></div>` : ""}
    </div>`;
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
  drawMapRouteOverlay(width, height);

  const founderMode = document.body.classList.contains("founder-mode");

  categories.forEach((category) => {
    const level = mapChallengeProgress[category.code] || "ocean";
    drawMapComponent(category.code, level, width, height);
  });

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

function drawMapComponent(categoryCode, level, width, height) {
  const placement = mapComponentPlacements[categoryCode];
  if (!placement) return false;
  const isUnknown = level === "ocean";
  const componentLevel = isUnknown ? "land" : level === "green" ? "green" : level;
  const files = mapComponentSets[componentLevel] || mapComponentSets.land;
  const fileName = files[placement.variant % files.length];
  const image = loadMapAsset(fileName);
  if (!image.complete || !image.naturalWidth) return false;

  const scaleX = width / 1100;
  const scaleY = height / 619;
  const targetWidth = placement.width * scaleX;
  const targetHeight = image.height * (targetWidth / image.width);
  const x = placement.x * scaleX;
  const y = placement.y * scaleY;

  ctx.save();
  if (isUnknown) {
    ctx.globalAlpha = 0.34;
  }
  ctx.drawImage(image, x, y, targetWidth, targetHeight);
  ctx.restore();
  return true;
}

function drawMapRouteOverlay(width, height) {
  const routes = [
    ["00", "01", "02"],
    ["03", "04", "05"],
    ["06", "07", "08", "09"],
    ["04", "10"],
  ];
  const scaleX = width / 1100;
  const scaleY = height / 619;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 250, 224, 0.38)";
  ctx.lineWidth = Math.max(1.2, width / 820);
  ctx.setLineDash([7 * scaleX, 14 * scaleX]);
  ctx.lineCap = "round";
  routes.forEach((route) => {
    const points = route
      .map((code) => mapFounderLabelPositions[code])
      .filter(Boolean)
      .map(([x, y]) => [x * scaleX, y * scaleY]);
    if (points.length < 2) return;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let index = 1; index < points.length; index += 1) {
      const previous = points[index - 1];
      const current = points[index];
      const controlX = (previous[0] + current[0]) / 2;
      const controlY = (previous[1] + current[1]) / 2 - 18 * scaleY;
      ctx.quadraticCurveTo(controlX, controlY, current[0], current[1]);
    }
    ctx.stroke();
  });
  ctx.restore();
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
  const position = mapFounderLabelPositions[activeMapChallengeSubject];
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
  const themeOption = event.target.closest("[data-theme-option]");
  if (themeOption) {
    setTheme(themeOption.dataset.themeOption);
    return;
  }
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
  const mapChallengeAnswer = event.target.closest("[data-map-challenge-answer]");
  if (mapChallengeAnswer) {
    answerMapChallenge(Number(mapChallengeAnswer.dataset.mapChallengeAnswer));
    return;
  }
  if (event.target.closest("[data-map-challenge-next]")) {
    moveToNextMapChallengeQuestion();
    return;
  }
  if (event.target.closest("[data-map-challenge-reset]")) {
    resetMapChallenge();
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
  const messageSave = event.target.closest("[data-save-message]");
  if (messageSave) {
    saveMessageUpdate(messageSave.dataset.saveMessage);
    return;
  }
  const consoleTab = event.target.closest("[data-founder-console-tab]");
  if (consoleTab) {
    founderConsoleTab = consoleTab.dataset.founderConsoleTab;
    localStorage.setItem(founderConsoleTabKey, founderConsoleTab);
    renderFounderConsole();
    return;
  }
  if (event.target.closest("[data-story-validate]")) {
    const input = document.querySelector("[data-story-studio-input]");
    storyStudioInput = input?.value || "";
    storyStudioValidation = validateStoryJson(storyStudioInput);
    renderFounderConsole();
    return;
  }
  if (event.target.closest("[data-story-save-draft]")) {
    saveStoryStudioStory(false);
    return;
  }
  if (event.target.closest("[data-story-save-published]")) {
    saveStoryStudioStory(true);
    return;
  }
  if (event.target.closest("[data-story-clear]")) {
    storyStudioInput = "";
    storyStudioValidation = null;
    renderFounderConsole();
    return;
  }
  const founderExit = event.target.closest("[data-founder-exit]");
  if (founderExit) {
    event.preventDefault();
    exitFounderMode();
    return;
  }
  const submoduleSelect = event.target.closest("[data-submodule-select]");
  if (submoduleSelect) {
    event.preventDefault();
    const [categoryCode, groupCode] = submoduleSelect.dataset.submoduleSelect.split(":");
    const category = categories.find((item) => item.code === categoryCode);
    if (category && category.groups.some((group) => group.code === groupCode)) {
      if (activeCategorySubmodules[categoryCode] !== groupCode) delete activeCategoryFields[`${categoryCode}:${groupCode}`];
      activeCategorySubmodules[categoryCode] = groupCode;
      renderCategoryTree(category);
    }
    return;
  }
  const fieldSelect = event.target.closest("[data-field-select]");
  if (fieldSelect) {
    event.preventDefault();
    const [categoryCode, groupCode, fieldCode] = fieldSelect.dataset.fieldSelect.split(":");
    const category = categories.find((item) => item.code === categoryCode);
    const group = category?.groups.find((item) => item.code === groupCode);
    if (category && group && group.fields.some(([code]) => code === fieldCode)) {
      activeCategorySubmodules[categoryCode] = groupCode;
      activeCategoryFields[`${categoryCode}:${groupCode}`] = fieldCode;
      renderCategoryTree(category);
    }
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
themeButtons.forEach((button) => {
  button.addEventListener("click", () => setTheme(button.dataset.themeOption));
});

window.addEventListener("popstate", () => goToRoute(normalizeRoute(window.location.pathname), true));
window.addEventListener("hashchange", () => goToRoute(normalizeRoute(window.location.pathname), true));

renderCategories();
renderStories();
renderConceptFables();
renderStoryMap();
renderContactSections();
renderSiteFooters();
registerVisit();
renderPassport("pathPassport", modulePassports.path);
renderField();
renderLearning();
renderChallenge();
renderMapChallenge();
renderReflectionPanel();
drawKnowledgeMap();
applyTheme();
applyLanguage();
const initialRoute = normalizeRoute(window.location.pathname);
goToRoute(initialRoute, true);

function setFounderMode(enabled) {
  document.body.classList.toggle("founder-mode", enabled);
  if (founderIndicator) {
    founderIndicator.hidden = !enabled;
    founderIndicator.innerHTML = enabled
      ? `<span>Founder Mode</span><button type="button" data-founder-exit>Exit</button>`
      : "";
  }
  if (founderToggle) {
    founderToggle.textContent = enabled ? "Founder mode on" : "Founder mode";
    founderToggle.setAttribute("aria-pressed", String(enabled));
  }
  if (enabled) {
    localStorage.setItem(founderModeKey, "true");
  } else {
    localStorage.removeItem(founderModeKey);
    sessionStorage.removeItem(pdcFounderAccessSessionKey);
  }
  renderMessageBoards();
  if (enabled && !document.body.classList.contains("pdc-public-route")) {
    loadFounderMessages();
    if (normalizeRoute(window.location.pathname).startsWith("/pdc")) loadPdcFounderSummary();
  } else {
    pdcFounderSummary = null;
    pdcFounderStatus = { state: "idle", detail: "" };
  }
  drawKnowledgeMap();
  renderStories();
  renderStoryMap();
  renderChallenge();
  renderMapChallenge();
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
