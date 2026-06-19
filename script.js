const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const founderToggle = document.getElementById("founderToggle");
const founderIndicator = document.querySelector(".founder-indicator");
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const contactEmail = "hello@mapkai.com";
const appVersion = "0.1.32";
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
    categoriesCopy: "Each lens shows practical fields, everyday examples, and possible learning steps.",
    openCategory: "Open lens",
    categoryScope: "Lens scope",
    categoryCopy: (groups, fields) => `This lens contains ${groups} groups and ${fields} practical fields.`,
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
    categoriesCopy: "分类不是目录，而是观察不同领域如何组织现实的认知镜头。",
    openCategory: "打开镜头",
    categoryScope: "镜头范围",
    categoryCopy: (groups, fields) => `这个知识镜头包含 ${groups} 个组和 ${fields} 个实践领域。`,
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
    title: "The first evening class",
    titleZh: "第一堂晚间课",
    summary: "Before Ren chose a field, a general starter course helped him turn worry into a small learning plan.",
    summaryZh: "在 Ren 还没决定具体方向之前，一门通用入门课先帮他把焦虑整理成一个小小的学习计划。",
    scene: "At 7:10 p.m., Ren sat in a community learning center with a folder of forms, three possible courses, and no clear answer. The mentor did not ask him to choose a profession immediately. She asked what felt difficult this week: reading the course descriptions, counting study hours, sending an email, or explaining his goal to family. Ren circled all four.",
    sceneZh: "晚上七点十分，Ren 坐在社区学习中心，面前是一叠报名表、三个可能的课程方向，以及一个还说不清的答案。导师没有立刻让他决定未来职业，而是问他这一周最难的是什么：读懂课程介绍、估算学习时间、写报名邮件，还是向家人解释自己的目标。Ren 把四项都圈了出来。",
    storyBody: "The class was called a general starter programme, which sounded vague at first. But the vagueness was useful. In the first hour, the group learned how to read a timetable, compare course requirements, mark unknown words, and turn a large wish into next Tuesday's task. Ren noticed that his real first step was not choosing between business, design, or technology. It was learning how to approach any course without freezing. By the end of the evening, he had a two-week plan: one form to complete, one email to send, one budget number to check, and one conversation to have at home.",
    storyBodyZh: "这门课叫“通用入门课程”，一开始听起来有点模糊。但这种模糊反而有用。第一小时里，大家学习如何读时间表、比较课程要求、标记不懂的词，并把一个很大的愿望拆成下周二能做的一件事。Ren 发现，他真正的第一步不是马上在商业、设计和技术之间做选择，而是学会面对任何课程时不僵住。晚上结束时，他有了一个两周计划：填完一张表、发出一封邮件、核对一个预算数字，并和家人认真聊一次。",
    knowledgePoint: "Some knowledge fields are not yet a specialization. They give people the basic map-reading skills needed before a more specific path can make sense.",
    knowledgePointZh: "有些知识领域还不是专业方向，而是进入专业方向之前的“地图阅读能力”：先能看懂要求、整理时间、提出问题，后面才有可能选择得更清楚。",
    reflectionQuestion: "When you feel unsure about a big learning direction, what is the smallest general skill that would make the next choice less intimidating?",
    reflectionQuestionZh: "当你对一个大的学习方向不确定时，哪一个最小的通用能力，能让下一步选择不再那么吓人？",
    tags: ["starter course", "orientation", "learning plan"],
    tagsZh: ["入门课程", "方向探索", "学习计划"],
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
    storyBody: "The philosopher who helped run the school was not satisfied with children only repeating finished answers. He wanted to know what would happen if school began from doing: cooking, sewing, building, measuring, talking, then asking why. A breakfast lesson could become chemistry, number, history, cooperation, and language at once. The classroom was not pretending that every activity was automatically deep. Teachers still had to prepare, observe, connect, and question. But the experiment changed the direction of attention: education was no longer only what adults delivered to children; it was a social situation where children learned by acting, noticing consequences, and making meaning with others.",
    storyBodyZh: "参与这所学校的那位哲学家，并不满足于让孩子只复述已经整理好的答案。他想知道，如果学校从“做事”开始，会发生什么：做饭、缝纫、制作、测量、交谈，然后追问为什么。一节早餐课可以同时牵出化学、数量、历史、合作和语言。教室并不是把所有活动都浪漫化，老师仍然需要准备、观察、连接和提问。但这个实验改变了教育的方向：教育不只是成人把内容交给儿童，而是一个社会性的情境，孩子在行动、后果和共同解释中学习。",
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
    title: "The photograph at dinner",
    titleZh: "餐桌上的旧照片",
    summary: "One old photograph showed how memory, image, and meaning can point in different directions.",
    summaryZh: "一张旧照片让大家看见：记忆、图像和意义并不总是指向同一个方向。",
    scene: "During dinner, Mei found an old photograph tucked inside a cookbook. Her grandmother smiled at it, her brother laughed at the clothes, and her father suddenly became quiet. The same image seemed to belong to three different stories.",
    sceneZh: "晚饭时，Mei 在一本菜谱里翻出一张旧照片。外婆看着它笑了，弟弟笑照片里的衣服，父亲却突然安静下来。同一张照片，好像同时属于三个不同的故事。",
    storyBody: "Nobody argued about what was visible: a small balcony, two chairs, a cake, people standing too formally. But each person gave the image a different weight. Grandmother remembered the first apartment. Her brother noticed the style and joked about how old everything looked. Father remembered the week after the photo, when the family had to move again. Mei wrote the details down and realized the photograph was not only evidence. It was also interpretation. The picture did not speak by itself; people brought time, grief, humor, and memory to it.",
    storyBodyZh: "没有人争论照片里看得见什么：小阳台、两把椅子、一个蛋糕、站得有点拘谨的人。但每个人给这张图的重量不同。外婆记得第一间公寓，弟弟注意到衣服款式，笑它们很旧，父亲想起拍完照片后那一周，全家又不得不搬家。Mei 把这些细节记下来，发现照片不只是证据，也是解释。图像不会自己说话，人会把时间、伤感、幽默和记忆带进去。",
    knowledgePoint: "Arts and humanities ask how meaning is made, preserved, challenged, and reinterpreted through images, language, objects, and stories.",
    knowledgePointZh: "艺术与人文关心意义如何被制造、保存、质疑和重新解释。图像、语言、物件和故事，都可能是理解人的入口。",
    reflectionQuestion: "What ordinary object in your home would tell different stories depending on who explains it?",
    reflectionQuestionZh: "你家里哪一个普通物件，会因为讲述它的人不同，而变成不同的故事？",
    tags: ["meaning", "memory", "interpretation"],
    tagsZh: ["意义", "记忆", "解释"],
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
    storyBodyZh: "邻居们终于在大厅见面时，问题从每个人那里看都不一样。年纪大的住户不常看群聊，新搬来的人不知道侧门也会收快递，快递员因为大厅桌子总是堆满东西，只好把包裹放在摄像头拍不到的位置。楼管有信息，但公告板贴在大家只会匆匆路过的地方。那天他们没有解决所有问题，但把公告板移了位置，简化说明，设了一个共享架子，并约定谁去联系快递公司。丢失的包裹很重要，但更深的问题是：一个小社区如何流动信息和责任。",
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
    storyBodyZh: "他们一开始凭感觉争论。后来 Noura 打开笔记本。维修今天更便宜，但可能很快再坏；换新更贵，却有保修。租房协议覆盖一部分零件，但不覆盖不当使用。每个人使用洗衣机的方式不同，也没人记录过维护。真正改变讨论的是把问题拆开：谁负责、真实成本是多少、能接受什么风险、下次应该有什么规则。最后他们选择维修，建立一个小小的共享维护金，并写下一条更清楚的住户规则。",
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
    storyBodyZh: "接下来的十天，Aria 记录日照时长、浇水量、花盆重量、窗户朝向，以及叶子是在早上还是晚上变软。答案不是某一个戏剧性的原因。阳台早上有阳光，下午风很大；小盆很快干掉；她额外浇水时又可能让根部缺氧。她一次只改一个条件：换大一点的盆、稳定水量、换一个角落。罗勒慢慢好起来。更重要的是，Aria 不再乱猜。她学会问：什么算证据？有多少可能原因可以被测试？",
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
    storyBodyZh: "邻居 Jay 没有一上来就乱点设置。他先问：什么必须安全？什么必须随时拿到？如果手机丢了会发生什么？他们一起检查备份，写下找回步骤，更新联系人，删除不用的应用，并测试机票离线时能不能打开。陈阿姨不需要变成程序员。她需要一个能用的心智模型：手机不是一个单一物件，而是一组账户、网络、文件、权限和恢复路径。",
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
    storyBodyZh: "Mara 想把所有螺丝拧紧就结束。Eli 先停下来，检查地面、墙体、支架角度和重量分布。书架不是某一个地方坏了：地面有点不平，最重的书放得太高，墙锚也不适合这面墙。他们先卸重，再调平底部，换合适的固定件，测试之后才把书放回去。维修比想象中更久，因为真正的任务不是让它直一分钟，而是让受力在大家再次忘记它之后仍然可控。",
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
    storyBodyZh: "Jon 想立刻全部重种。Asha 让他先等一等，仔细看。哪些畦被篱笆挡住了风？哪些土更保温？哪些覆盖物有用，哪些反而积了太多水汽？他们标记受损的行，留下部分植物观察恢复，把更脆弱的幼苗移走，并调整下周的种植计划。花园并不会完全服从种子包装上的日历。它回应的是土壤、温度、水分、暴露程度、病虫害，以及持续照料。",
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
    storyBodyZh: "他们坐下来，面前是药盒、一杯水和预约清单。Elena 一开始只听见风险，父亲听见的却是独立感正在被拿走。最后他们一起改系统：少一点便条，更清楚的时间，一个共同确认点，以及一个在出现副作用或疑惑时可以提问的位置。目标不是控制他一天中的每一分钟，而是在降低危险的同时，保留“生活仍然属于自己”的感觉。",
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
    storyBodyZh: "志愿者一开始只是努力加快速度。后来 Sam 发现，问题不只是慢。湿外套需要放的地方，门口太吵听不清说明，年长来宾需要先坐下再签到。工作人员把队伍分开，把杯子从文件旁移走，设了一个干燥交接点，并让一个志愿者在客人到桌前之前先迎接。服务变好，是因为他们不再只把客人看成一条队伍，而是看见了完整的到达路径。",
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
    id: "001-first-certificate-form",
    categoryCode: "00",
    groupCode: "001",
    groupTitleZh: "基础课程与资格",
    title: "The form nobody wanted to start",
    titleZh: "没人想先动笔的表格",
    summary: "A basic qualification began with the ordinary courage of filling in the first blank box.",
    summaryZh: "一个基础资格的起点，是把第一格空白认真填下去的普通勇气。",
    scene: "Mina kept the application form on her kitchen table for a week. The questions were simple, but every blank space seemed to ask whether she was the kind of person who could return to study.",
    sceneZh: "Mina 把报名表放在厨房桌上一周。问题都很简单，但每一个空格都像是在问：她是不是那种还能重新学习的人。",
    storyBody: "Her neighbor did not explain a profession or a grand plan. He sat with her and read one line at a time: name, address, previous course, preferred schedule. When they finished, Mina realized the form was not only administration. It was a threshold. Basic programmes matter because they help people cross from intention into a recognized learning path.",
    storyBodyZh: "邻居没有给她讲职业规划，也没有谈宏大的目标，只是陪她一行一行读：姓名、地址、以前学过什么、希望什么时间上课。填完以后，Mina 才发现这张表不只是手续，而是一道门槛。基础课程之所以重要，是因为它把一个人的念头带进一个被承认的学习路径。",
    knowledgePoint: "Basic programmes and qualifications turn scattered readiness into an official first step: entry requirements, learning level, schedule, and recognition.",
    knowledgePointZh: "基础课程与资格把零散的准备变成正式第一步：入门要求、学习层级、时间安排，以及被承认的资格。",
    reflectionQuestion: "What small official step might be quietly protecting a much larger personal change?",
    reflectionQuestionZh: "哪一个看似很小的正式步骤，可能正在保护一个更大的个人转变？",
    tags: ["entry level", "qualification", "first step"],
    tagsZh: ["入门层级", "资格", "第一步"],
  },
  {
    id: "002-market-receipt-math",
    categoryCode: "00",
    groupCode: "002",
    groupTitleZh: "读写与算术",
    title: "The receipt at the market",
    titleZh: "菜市场的小票",
    summary: "A receipt error showed why literacy and numeracy are everyday forms of power.",
    summaryZh: "一次小票错误，让人看见读写和算术其实是日常生活里的力量。",
    scene: "At the market, Omar noticed that the total on the receipt felt wrong. He could not name the mistake immediately, but he knew the numbers deserved a second look.",
    sceneZh: "在菜市场，Omar 觉得小票总价不太对。他一时说不出错在哪里，但知道这些数字值得再看一遍。",
    storyBody: "He read the item names, matched weights to prices, and added two lines again. The seller had entered one quantity twice. Nobody was trying to cheat; the stall was simply busy. Still, Omar walked away differently. Reading and counting were not school exercises. They were how he checked reality before accepting it.",
    storyBodyZh: "他读商品名，对照重量和单价，又把两行重新加了一遍。摊主把一个数量输重了。并不是有人故意欺骗，只是摊位太忙。但 Omar 离开时感觉不同了。读写和算术不是学校练习，而是在接受现实之前先核对现实的方法。",
    knowledgePoint: "Literacy and numeracy help people decode forms, prices, instructions, quantities, and claims before those claims shape their choices.",
    knowledgePointZh: "读写与算术帮助人理解表格、价格、说明、数量和各种说法，在它们影响选择之前先把它们读懂。",
    reflectionQuestion: "Where does a number in your day quietly ask you to trust it?",
    reflectionQuestionZh: "你一天里哪一个数字，正在悄悄要求你相信它？",
    tags: ["reading", "numbers", "daily judgment"],
    tagsZh: ["阅读", "数字", "日常判断"],
  },
  {
    id: "003-before-the-interview",
    categoryCode: "00",
    groupCode: "003",
    groupTitleZh: "个人技能与发展",
    title: "The minute before the interview",
    titleZh: "面试前的一分钟",
    summary: "A shaky interview moment became practice in self-management, confidence, and growth.",
    summaryZh: "一次面试前的紧张，变成了自我管理、信心和成长的练习。",
    scene: "Jae arrived ten minutes early and then spent nine minutes imagining everything that could go wrong. His hands were cold. His answers felt too small.",
    sceneZh: "Jae 提前十分钟到达，却用九分钟想象所有可能出错的地方。他手心发冷，觉得自己的回答都太小。",
    storyBody: "A mentor had told him to prepare one sentence for moments like this: name the feeling, name the task, take the next breath. He did not become fearless. He became usable to himself. Personal skills are often invisible because they happen before action: attention, emotion, confidence, listening, and the ability to keep going.",
    storyBodyZh: "导师曾让他为这种时刻准备一句话：说出感受，说出任务，再呼吸一下。他没有突然变得无所畏惧，但他重新能使用自己了。个人技能常常看不见，因为它们发生在行动之前：注意力、情绪、信心、倾听，以及继续下去的能力。",
    knowledgePoint: "Personal skills and development focus on how people manage themselves, communicate, adapt, and build capacity across life situations.",
    knowledgePointZh: "个人技能与发展关注人如何管理自己、沟通、适应，并在不同生活情境中建立能力。",
    reflectionQuestion: "What skill do you only notice when pressure makes it disappear?",
    reflectionQuestionZh: "哪一种能力，只有在压力让它消失时你才会注意到？",
    tags: ["self-management", "confidence", "adaptation"],
    tagsZh: ["自我管理", "信心", "适应"],
  },
  {
    id: "009-odd-learning-path",
    categoryCode: "00",
    groupCode: "009",
    groupTitleZh: "未另分类的通用课程与资格",
    title: "The course with no perfect shelf",
    titleZh: "找不到完美位置的课程",
    summary: "A mixed community course showed why not every useful starting point fits a neat label.",
    summaryZh: "一门混合型社区课程说明：有些有用的起点，并不适合被放进整齐标签。",
    scene: "The library offered a short course on email, appointment forms, basic budgeting, and local services. Everyone asked what subject it belonged to. The librarian shrugged: people needed all of it together.",
    sceneZh: "图书馆开了一门短课，内容包括电子邮件、预约表、基础预算和本地服务。大家都问它属于哪个学科。图书管理员耸耸肩：人们需要的是这些东西放在一起。",
    storyBody: "One learner came for email, another for bills, another because she did not understand online forms. The course was not elegant, but it was useful. Some programmes sit between categories because real life does not wait for a tidy curriculum map.",
    storyBodyZh: "有人为电子邮件来，有人为账单来，还有人只是看不懂网上表格。这门课不优雅，但有用。有些课程处在分类之间，因为现实生活不会等课程目录变得整齐。",
    knowledgePoint: "Not elsewhere classified programmes catch useful general learning that does not fit a standard shelf but still gives people practical access.",
    knowledgePointZh: "未另分类的通用课程收纳那些不容易放进标准格子的通用学习，但它们仍然给人实际进入生活系统的能力。",
    reflectionQuestion: "What useful learning in your life would be harder to find if everything needed a perfect category?",
    reflectionQuestionZh: "如果所有学习都必须有完美分类，你生活中哪种有用学习反而更难被找到？",
    tags: ["mixed course", "access", "practical basics"],
    tagsZh: ["混合课程", "进入能力", "实用基础"],
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
    storyBody: "A young educator heard about the effort and went to see it. What he found was not a finished method but a community trying to rebuild life around children. The school that slowly emerged did not separate learning into tidy boxes. Children drew, built, argued, listened, sculpted, measured, acted, and revisited their own ideas. Teachers documented the process, parents joined the conversation, and the classroom environment itself became part of the teaching. The point was not to add art to education as decoration. It was to admit that children think in many languages, and that education often needs several disciplines before it can hear them clearly.",
    storyBodyZh: "一位年轻教育者听说这件事后，去现场看了看。他看到的不是已经成型的方法，而是一个社区试着围绕孩子重新组织生活。后来慢慢长出来的学校，没有把学习切成整齐的小盒子。孩子们画画、搭建、争论、倾听、塑形、测量、表演，也一次次回到自己的想法。老师记录过程，家长参与讨论，教室环境本身也成了教学的一部分。重点不是把艺术加进教育当装饰，而是承认孩子用很多种语言思考，而教育常常需要好几个学科一起，才听得清这些语言。",
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
    id: "021-window-display-choice",
    categoryCode: "02",
    groupCode: "021",
    groupTitleZh: "艺术",
    title: "The window display choice",
    titleZh: "橱窗里的选择",
    summary: "A small shop window showed how art turns attention, material, and feeling into meaning.",
    summaryZh: "一个小店橱窗说明：艺术如何把注意力、材料和感受转化成意义。",
    scene: "Nia arranged three objects in a shop window: a red scarf, a cracked bowl, and a lamp. Customers stopped, not because the items were expensive, but because the arrangement felt like a question.",
    sceneZh: "Nia 在橱窗里摆了三件东西：红围巾、有裂纹的碗和一盏灯。顾客停下来，不是因为它们昂贵，而是因为这个组合像一个问题。",
    storyBody: "Her colleague wanted to add a discount sign. Nia waited. The window was already doing work: color pulled the eye, texture slowed it down, light made the bowl look cared for rather than broken. Art does not only decorate. It organizes perception so people feel before they explain.",
    storyBodyZh: "同事想加一个折扣牌。Nia 没有急。这个橱窗已经在工作：颜色抓住视线，质感让人慢下来，灯光让那个碗看起来不是破损，而是被珍惜。艺术不只是装饰，它组织感知，让人在解释之前先感受到。",
    knowledgePoint: "Arts work through form, material, image, sound, movement, and composition to shape how people notice and feel.",
    knowledgePointZh: "艺术通过形式、材料、图像、声音、动作和构图，影响人如何注意和感受。",
    reflectionQuestion: "What ordinary arrangement around you is already teaching people how to feel?",
    reflectionQuestionZh: "你身边哪一种普通布置，其实已经在教人如何感受？",
    tags: ["form", "composition", "perception"],
    tagsZh: ["形式", "构图", "感知"],
  },
  {
    id: "022-family-rule-question",
    categoryCode: "02",
    groupCode: "022",
    groupTitleZh: "人文，不含语言",
    title: "The rule at the family table",
    titleZh: "餐桌上的规矩",
    summary: "One family rule opened questions about history, values, duty, and interpretation.",
    summaryZh: "一条家庭规矩打开了关于历史、价值、责任和解释的问题。",
    scene: "Every Sunday, the youngest person had to serve tea first. Lina thought the rule was unfair. Her grandfather said it was respect. Her aunt said it was memory.",
    sceneZh: "每个周日，家里年纪最小的人都要先倒茶。Lina 觉得这条规矩不公平。外公说这是尊重，姑姑说这是记忆。",
    storyBody: "The argument changed when they asked where the rule came from. It had begun when the family first migrated and the children served tea to learn everyone's names. What looked like obedience had once been belonging. Humanities do not simply preserve old answers; they ask what inherited meanings still do to living people.",
    storyBodyZh: "当他们开始问这条规矩从哪里来时，争论变了。它最早出现在全家刚迁居时，孩子们通过倒茶记住每个人的名字。看起来像服从的事，曾经是一种归属。人文并不只是保存旧答案，它追问继承下来的意义今天仍在怎样影响活着的人。",
    knowledgePoint: "Humanities examine history, belief, ethics, religion, philosophy, and cultural memory to understand how meaning is inherited and revised.",
    knowledgePointZh: "人文研究历史、信念、伦理、宗教、哲学和文化记忆，理解意义如何被继承、质疑和修订。",
    reflectionQuestion: "Which rule in your life carries a history nobody explains anymore?",
    reflectionQuestionZh: "你生活里哪条规矩，带着一段已经没人解释的历史？",
    tags: ["history", "ethics", "meaning"],
    tagsZh: ["历史", "伦理", "意义"],
  },
  {
    id: "023-bakery-word",
    categoryCode: "02",
    groupCode: "023",
    groupTitleZh: "语言",
    title: "The word at the bakery",
    titleZh: "面包店里的那个词",
    summary: "A misheard word showed how language carries sound, culture, memory, and use.",
    summaryZh: "一个听错的词说明：语言承载声音、文化、记忆和使用情境。",
    scene: "At a bakery abroad, Theo asked for bread and received a pastry. The clerk smiled kindly, but the mistake embarrassed him more than he expected.",
    sceneZh: "在国外一家面包店，Theo 想买面包，却拿到了一块甜点。店员友善地笑了笑，但这个错误让他比想象中更尴尬。",
    storyBody: "Later he learned that his pronunciation was close to another word. He practiced the sound, then noticed the menu, gestures, polite phrases, and local habit of pointing first. Language was not a list in his notebook. It was a living coordination between mouth, ear, context, and trust.",
    storyBodyZh: "后来他才知道，自己的发音接近另一个词。他练习那个音，又开始注意菜单、手势、礼貌用语，以及当地人先指再说的习惯。语言不是笔记本里的词表，而是嘴、耳朵、语境和信任之间的活协调。",
    knowledgePoint: "Language study includes acquisition, literature, linguistics, communication, and the social contexts that make words usable.",
    knowledgePointZh: "语言学习包括语言习得、文学、语言学、沟通，以及让词语真正可用的社会语境。",
    reflectionQuestion: "When did a word fail because the situation around it was missing?",
    reflectionQuestionZh: "什么时候一个词不是因为词本身，而是因为缺少周围情境而失效？",
    tags: ["language use", "context", "communication"],
    tagsZh: ["语言使用", "语境", "沟通"],
  },
  {
    id: "028-theater-translation-night",
    categoryCode: "02",
    groupCode: "028",
    groupTitleZh: "艺术与人文相关跨学科课程与资格",
    title: "The translated theater night",
    titleZh: "被翻译的戏剧夜",
    summary: "A community performance needed acting, translation, memory, music, and ethics together.",
    summaryZh: "一场社区演出同时需要表演、翻译、记忆、音乐和伦理。",
    scene: "A youth group staged interviews with older residents. Some stories were in one language, songs in another, and gestures carried meanings no subtitle could hold.",
    sceneZh: "一个青年小组把长者访谈搬上舞台。有些故事是一种语言，歌曲是另一种语言，还有些手势承载着字幕放不下的意义。",
    storyBody: "They argued about what to translate literally, what to sing, and what to leave as silence. The performance became more than art class or history class. It asked how communities carry memory when no single medium is enough.",
    storyBodyZh: "他们争论什么要直译，什么要唱出来，什么应该留作沉默。这场演出不只是艺术课，也不只是历史课。它追问的是：当单一媒介不够时，一个社区如何承载记忆。",
    knowledgePoint: "Inter-disciplinary arts and humanities combine media, language, history, performance, and interpretation around shared meaning-making.",
    knowledgePointZh: "艺术与人文跨学科课程把媒介、语言、历史、表演和解释连接起来，共同处理意义如何生成。",
    reflectionQuestion: "What story near you needs more than one medium to be told honestly?",
    reflectionQuestionZh: "你身边哪一个故事，需要不止一种媒介才讲得诚实？",
    tags: ["performance", "translation", "memory"],
    tagsZh: ["表演", "翻译", "记忆"],
  },
  {
    id: "029-unfiled-artifact",
    categoryCode: "02",
    groupCode: "029",
    groupTitleZh: "未另分类的艺术与人文",
    title: "The object nobody could label",
    titleZh: "没人能命名的物件",
    summary: "An unusual handmade object reminded a museum team that meaning can exceed catalog shelves.",
    summaryZh: "一件奇特手作物提醒博物馆团队：意义可能超出目录格子。",
    scene: "The donated object looked like a tool, a toy, and a ritual item at once. The museum database wanted one category. The family who donated it gave three stories.",
    sceneZh: "这件捐赠物看起来既像工具，又像玩具，也像仪式用品。博物馆数据库只想要一个类别，捐赠的家庭却讲了三个故事。",
    storyBody: "The curator resisted forcing it into a neat shelf. She wrote a note about uncertainty, use, and multiple meanings. Some arts and humanities work begins exactly there: at the point where a label would erase what makes the object worth keeping.",
    storyBodyZh: "策展人没有急着把它塞进整齐分类，而是写下关于不确定性、使用方式和多重意义的说明。有些艺术与人文工作恰恰从这里开始：一个标签会抹掉这件物品值得保存之处。",
    knowledgePoint: "Not elsewhere classified arts and humanities preserve ambiguous cultural objects, practices, and questions that do not fit standard categories.",
    knowledgePointZh: "未另分类的艺术与人文保留那些不适合标准分类的文化物件、实践和问题。",
    reflectionQuestion: "What have you understood better by not naming it too quickly?",
    reflectionQuestionZh: "有什么东西，是因为没有太快命名，你反而理解得更深？",
    tags: ["ambiguity", "artifact", "cataloging"],
    tagsZh: ["模糊性", "物件", "编目"],
  },
  {
    id: "031-bus-stop-price",
    categoryCode: "03",
    groupCode: "031",
    groupTitleZh: "社会与行为科学",
    title: "The bus stop price",
    titleZh: "公交站旁的价格",
    summary: "A changed bus fare revealed incentives, behavior, fairness, and public life.",
    summaryZh: "一次公交票价变化，让激励、行为、公平和公共生活浮现出来。",
    scene: "When the bus fare rose, some riders walked, some paid, and some began sharing rides. The city called it a small adjustment. The bus stop told a bigger story.",
    sceneZh: "公交票价上涨后，有人步行，有人继续支付，有人开始拼车。城市说这只是小调整，公交站却讲出更大的故事。",
    storyBody: "A student counted who stopped riding. A shop owner noticed fewer morning customers. A planner saw revenue; riders felt lost time and dignity. Social and behavioural sciences ask how choices are shaped by incentives, norms, institutions, and unequal options.",
    storyBodyZh: "一个学生统计谁不再坐车，店主发现早晨顾客减少，规划者看到收入，乘客感受到失去的时间和尊严。社会与行为科学追问：选择如何被激励、规范、制度和不平等的选项塑造。",
    knowledgePoint: "Social and behavioural sciences study economics, politics, psychology, sociology, and culture as forces shaping human action.",
    knowledgePointZh: "社会与行为科学研究经济、政治、心理、社会和文化如何塑造人的行动。",
    reflectionQuestion: "When a choice looks individual, what shared condition might be quietly choosing with the person?",
    reflectionQuestionZh: "当一个选择看似个人决定时，哪个共同条件可能正在和这个人一起做选择？",
    tags: ["behaviour", "incentives", "society"],
    tagsZh: ["行为", "激励", "社会"],
  },
  {
    id: "032-rumor-before-the-storm",
    categoryCode: "03",
    groupCode: "032",
    groupTitleZh: "新闻与信息",
    title: "The rumor before the storm",
    titleZh: "暴风雨前的传言",
    summary: "A neighborhood rumor showed why information work is about verification, timing, and trust.",
    summaryZh: "一条邻里传言说明：信息工作关乎核实、时机和信任。",
    scene: "Before a storm, a message spread through the neighborhood: the bridge was closed. People cancelled appointments before anyone checked the source.",
    sceneZh: "暴风雨前，一条消息在社区里传开：桥已经封了。还没人核实来源，大家就开始取消预约。",
    storyBody: "Mara called the transport office, checked the city update, and asked who first sent the message. The bridge was open, but one lane was flooded. The corrected message had to be short, clear, and fast. Journalism and information work is not just finding facts; it is helping facts travel before fear does.",
    storyBodyZh: "Mara 打电话给交通部门，查城市公告，又问最早是谁发的消息。桥没有封，只是有一条车道积水。更正消息必须短、清楚、快速。新闻与信息工作不只是找到事实，而是帮助事实在恐惧之前抵达。",
    knowledgePoint: "Journalism and information fields handle reporting, verification, archives, access, and the systems that make public knowledge reliable.",
    knowledgePointZh: "新闻与信息处理报道、核实、档案、获取，以及让公共知识可信的系统。",
    reflectionQuestion: "What information do people around you pass on because it feels urgent rather than because it has been checked?",
    reflectionQuestionZh: "你周围有哪些信息，是因为看起来紧急而被传播，而不是因为已经被核实？",
    tags: ["verification", "reporting", "trust"],
    tagsZh: ["核实", "报道", "信任"],
  },
  {
    id: "038-community-data-project",
    categoryCode: "03",
    groupCode: "038",
    groupTitleZh: "社会科学、新闻与信息相关跨学科课程与资格",
    title: "The map of empty benches",
    titleZh: "空长椅地图",
    summary: "A park project needed observation, interviews, data, and reporting in one frame.",
    summaryZh: "一个公园项目需要把观察、访谈、数据和报道放进同一框架。",
    scene: "Students mapped which park benches stayed empty. The numbers said one thing; interviews with older residents said another.",
    sceneZh: "学生们记录公园里哪些长椅总是空着。数字说了一件事，和老人访谈又说了另一件事。",
    storyBody: "The empty benches were not simply unpopular. Some were too far from shade, some near loud traffic, and some felt unsafe after dusk. The final report combined counting, listening, mapping, and public storytelling. A social question often needs several methods to become visible.",
    storyBodyZh: "空长椅并不只是“不受欢迎”。有些离树荫太远，有些靠近嘈杂车流，有些黄昏后让人不安。最后的报告结合了计数、倾听、制图和公共叙事。一个社会问题常常需要几种方法才会变得可见。",
    knowledgePoint: "Inter-disciplinary social sciences, journalism, and information combine research, communication, data, and public context.",
    knowledgePointZh: "社会科学、新闻与信息跨学科课程结合研究、传播、数据和公共语境。",
    reflectionQuestion: "What public problem near you would change if numbers and stories were read together?",
    reflectionQuestionZh: "你附近哪一个公共问题，如果把数字和故事一起读，会变得不一样？",
    tags: ["data", "interviews", "public context"],
    tagsZh: ["数据", "访谈", "公共语境"],
  },
  {
    id: "039-unusual-community-signal",
    categoryCode: "03",
    groupCode: "039",
    groupTitleZh: "未另分类的社会科学、新闻与信息",
    title: "The signal in the laundry room",
    titleZh: "洗衣房里的信号",
    summary: "A pattern nobody studied formally became a clue about trust in a building.",
    summaryZh: "一个没人正式研究的模式，成了理解楼内信任的线索。",
    scene: "In one apartment building, people left free items in the laundry room. In another, everything disappeared within minutes. Nobody knew what category this habit belonged to.",
    sceneZh: "一栋公寓里，人们会把免费物品放在洗衣房；另一栋里，东西几分钟就消失。没人知道这种习惯该归到哪个类别。",
    storyBody: "A tenant started noting the signs people wrote, how long items stayed, and who greeted whom. The laundry room became a tiny information system and a trust experiment. Some social realities are too local, hybrid, or odd for standard labels, but still worth understanding.",
    storyBodyZh: "一个住户开始记录大家写什么纸条、物品停留多久、谁会和谁打招呼。洗衣房变成了一个小信息系统，也像一次信任实验。有些社会现实太本地、太混合、太奇特，不适合标准标签，但仍值得理解。",
    knowledgePoint: "Not elsewhere classified social and information fields catch unusual public patterns that still reveal behaviour, norms, and communication.",
    knowledgePointZh: "未另分类的社会科学与信息领域收纳那些不典型却能揭示行为、规范和沟通方式的公共模式。",
    reflectionQuestion: "What tiny social habit around you says more than it first appears to?",
    reflectionQuestionZh: "你身边哪一个微小社会习惯，其实说出的东西比表面更多？",
    tags: ["local pattern", "trust", "informal systems"],
    tagsZh: ["本地模式", "信任", "非正式系统"],
  },
  {
    id: "041-cafe-closing-sheet",
    categoryCode: "04",
    groupCode: "041",
    groupTitleZh: "商业与管理",
    title: "The cafe closing sheet",
    titleZh: "咖啡店的收班表",
    summary: "A cafe closing routine showed how records, roles, stock, money, and customers fit together.",
    summaryZh: "咖啡店的收班流程说明：记录、角色、库存、钱和顾客如何连在一起。",
    scene: "At closing time, the cafe looked quiet, but the manager still had three questions: what sold, what was wasted, and who needed to know before morning.",
    sceneZh: "打烊时，咖啡店看起来安静了，但经理还有三个问题：卖了什么、浪费了什么、明早前谁需要知道。",
    storyBody: "The closing sheet connected cash, stock, staff hours, supplier orders, and customer complaints. One missing note about oat milk could become a bad morning. Business and administration are the systems that make work visible before decisions are made.",
    storyBodyZh: "收班表把现金、库存、员工工时、供应商订单和顾客投诉连在一起。一条漏掉的燕麦奶备注，可能变成糟糕的早晨。商业与管理就是在做决策之前，让工作变得可见的系统。",
    knowledgePoint: "Business and administration covers accounting, finance, management, marketing, office work, sales, and work skills as coordinated organizational practice.",
    knowledgePointZh: "商业与管理涵盖会计、金融、管理、营销、办公、销售和工作技能，是组织实践中的协调系统。",
    reflectionQuestion: "What small record keeps a workplace from having to remember everything by panic?",
    reflectionQuestionZh: "哪一个小记录，让一个工作场所不用靠慌张来记住一切？",
    tags: ["management", "records", "operations"],
    tagsZh: ["管理", "记录", "运营"],
  },
  {
    id: "042-bicycle-deposit",
    categoryCode: "04",
    groupCode: "042",
    groupTitleZh: "法律",
    title: "The bicycle deposit",
    titleZh: "自行车押金",
    summary: "A small deposit dispute showed why rules need language, evidence, and fairness.",
    summaryZh: "一次小小的押金争议，让人看见规则需要语言、证据和公平。",
    scene: "Kai rented a bicycle for a weekend. When he returned it, the shop kept part of the deposit for a scratch he said was already there.",
    sceneZh: "Kai 周末租了一辆自行车。还车时，店家因为一道划痕扣了一部分押金，但 Kai 说划痕原本就存在。",
    storyBody: "The argument changed when they looked at the rental agreement, old photos, and what the word damage meant. Law entered the room not as drama, but as a way to ask: what was promised, what can be proven, and what outcome is fair enough to live with?",
    storyBodyZh: "当他们开始看租赁协议、旧照片，以及“损坏”这个词到底指什么，争论就变了。法律进入这个房间，不是戏剧化地出现，而是在问：双方承诺了什么、什么能被证明、什么结果足够公平到可以接受？",
    knowledgePoint: "Law studies rules, rights, responsibilities, evidence, interpretation, and the institutions that settle conflict.",
    knowledgePointZh: "法律研究规则、权利、责任、证据、解释，以及处理冲突的制度。",
    reflectionQuestion: "What agreement in your life depends on a word nobody defined carefully?",
    reflectionQuestionZh: "你生活里哪一个约定，依赖着一个没人仔细定义的词？",
    tags: ["rights", "evidence", "agreement"],
    tagsZh: ["权利", "证据", "约定"],
  },
  {
    id: "048-pop-up-market-rules",
    categoryCode: "04",
    groupCode: "048",
    groupTitleZh: "商业、管理与法律相关跨学科课程与资格",
    title: "The pop-up market rules",
    titleZh: "临时市集的规则",
    summary: "A weekend market needed pricing, permits, roles, contracts, and public safety together.",
    summaryZh: "一个周末市集同时需要定价、许可、角色、合同和公共安全。",
    scene: "A group planned a pop-up market in a courtyard. The first meeting was about tables and music. The second was about permits, payments, insurance, rubbish, and refunds.",
    sceneZh: "一群人计划在院子里办临时市集。第一次会议讨论桌子和音乐，第二次就变成了许可、付款、保险、垃圾和退款。",
    storyBody: "No single person owned the whole problem. The designer saw layout, the treasurer saw risk, the organizer saw vendors, and the lawyer saw liability. The market only became real when those views were coordinated into rules people could follow.",
    storyBodyZh: "没有一个人独自拥有整个问题。设计者看到动线，财务负责人看到风险，组织者看到摊主，懂法律的人看到责任。只有当这些视角被协调成大家能遵守的规则，市集才真正变得可行。",
    knowledgePoint: "Inter-disciplinary business, administration, and law links organizational design, financial decisions, contracts, regulation, and accountability.",
    knowledgePointZh: "商业、管理与法律跨学科课程连接组织设计、财务决策、合同、监管和问责。",
    reflectionQuestion: "When an idea becomes public, what rules must appear before people can safely join it?",
    reflectionQuestionZh: "当一个想法要进入公共空间时，哪些规则必须先出现，别人才能安全参与？",
    tags: ["coordination", "permits", "accountability"],
    tagsZh: ["协调", "许可", "问责"],
  },
  {
    id: "049-strange-side-business",
    categoryCode: "04",
    groupCode: "049",
    groupTitleZh: "未另分类的商业、管理与法律",
    title: "The neighborhood tool library",
    titleZh: "社区工具图书馆",
    summary: "A shared tool shelf behaved like a business, a club, and a contract all at once.",
    summaryZh: "一个共享工具架同时像生意、社团和合同。",
    scene: "Neighbors built a tool library: drills, ladders, sewing kits, and a notebook. Nobody knew whether it was a shop, a charity, or a shared agreement.",
    sceneZh: "邻居们做了一个工具图书馆：电钻、梯子、针线包和一本登记册。没人说得清它是商店、慈善，还是共同协议。",
    storyBody: "They still had to decide deposits, repairs, responsibility, and how to remove someone who never returned things. Some practical arrangements do not fit standard business labels, but they still need administration and rules.",
    storyBodyZh: "他们仍然要决定押金、维修、责任，以及如何处理总是不归还工具的人。有些实用安排不适合标准商业标签，但仍然需要管理和规则。",
    knowledgePoint: "Not elsewhere classified business, administration, and law covers hybrid arrangements that still involve value, responsibility, and governance.",
    knowledgePointZh: "未另分类的商业、管理与法律处理那些混合型安排，它们仍然涉及价值、责任和治理。",
    reflectionQuestion: "What shared thing near you works only because people quietly accept a rule?",
    reflectionQuestionZh: "你身边哪一个共享事物，是因为大家默默接受某条规则才运转的？",
    tags: ["hybrid model", "governance", "responsibility"],
    tagsZh: ["混合模式", "治理", "责任"],
  },
  {
    id: "051-yogurt-on-the-counter",
    categoryCode: "05",
    groupCode: "051",
    groupTitleZh: "生物及相关科学",
    title: "The yogurt on the counter",
    titleZh: "厨房台面上的酸奶",
    summary: "A jar of yogurt made living processes visible in an ordinary kitchen.",
    summaryZh: "一罐酸奶让生命过程在普通厨房里变得可见。",
    scene: "Lea left milk with a spoonful of yogurt near the warm window. By evening, the jar had changed texture, smell, and taste.",
    sceneZh: "Lea 把牛奶和一勺酸奶放在温暖窗边。到晚上，罐子里的质地、气味和味道都变了。",
    storyBody: "Her brother called it cooking. Lea called it a living process. Temperature, microbes, time, and chemistry had worked together while nobody watched. Biology begins when the ordinary fact that things change becomes a question about life.",
    storyBodyZh: "弟弟说这是烹饪，Lea 说这是生命过程。温度、微生物、时间和化学在没人盯着的时候共同工作。生物学常从一个普通事实开始：东西会变化，然后追问生命如何让它变化。",
    knowledgePoint: "Biological and related sciences study living organisms, cells, ecosystems, biochemical processes, and the conditions that sustain life.",
    knowledgePointZh: "生物及相关科学研究生命体、细胞、生态系统、生化过程，以及维持生命的条件。",
    reflectionQuestion: "What living process happens near you so quietly that you rarely call it knowledge?",
    reflectionQuestionZh: "你身边哪一个生命过程安静到你很少把它称为知识？",
    tags: ["biology", "microbes", "living systems"],
    tagsZh: ["生物", "微生物", "生命系统"],
  },
  {
    id: "052-stream-after-rain",
    categoryCode: "05",
    groupCode: "052",
    groupTitleZh: "环境",
    title: "The stream after rain",
    titleZh: "雨后的溪流",
    summary: "A muddy stream revealed the links between land, water, weather, and human use.",
    summaryZh: "一条浑浊溪流显露出土地、水、天气和人类使用之间的联系。",
    scene: "After heavy rain, the small stream behind the school turned brown. Some children blamed the rain. Their teacher asked what the rain had carried with it.",
    sceneZh: "大雨之后，学校后面的小溪变成棕色。有些孩子怪雨，老师问：雨把什么一起带来了？",
    storyBody: "They walked upstream and found bare soil near a construction fence, leaves blocking a drain, and oil colors near the parking lot. The stream was not separate from the neighborhood. Environmental knowledge begins when place is read as a system of exchanges.",
    storyBodyZh: "他们沿溪往上走，看到施工围栏旁裸露的泥土、堵住排水口的树叶，以及停车场附近的油彩。溪流并不与社区分开。环境知识从把地点读成交换系统开始。",
    knowledgePoint: "Environment studies ecosystems, water, wildlife, pollution, climate, and the effects of human activity on natural systems.",
    knowledgePointZh: "环境领域研究生态系统、水、野生生物、污染、气候，以及人类活动对自然系统的影响。",
    reflectionQuestion: "What place near you would look different if you followed what flows through it?",
    reflectionQuestionZh: "如果你追踪流经某地的东西，你身边哪个地方会变得不一样？",
    tags: ["environment", "water", "systems"],
    tagsZh: ["环境", "水", "系统"],
  },
  {
    id: "053-kitchen-ice-and-steam",
    categoryCode: "05",
    groupCode: "053",
    groupTitleZh: "物理科学",
    title: "Ice, steam, and the kettle",
    titleZh: "冰、蒸汽和水壶",
    summary: "A kitchen kettle turned matter, heat, and observation into a small physical science lesson.",
    summaryZh: "一个厨房水壶把物质、热和观察变成了小小的物理科学课。",
    scene: "Noah watched ice melt in a glass while the kettle hissed on the stove. The same water seemed to have three personalities.",
    sceneZh: "Noah 看着杯子里的冰融化，炉子上的水壶发出嘶声。同样的水好像有三种性格。",
    storyBody: "His grandmother asked what changed and what stayed the same. The shape changed, the temperature changed, the movement changed, but the question held together. Physical sciences teach people to look beneath appearances for matter, energy, forces, and patterns.",
    storyBodyZh: "奶奶问他：什么变了，什么没变？形状变了，温度变了，运动变了，但问题把它们连在一起。物理科学教人透过表面，看见物质、能量、力和模式。",
    knowledgePoint: "Physical sciences study chemistry, physics, earth processes, materials, energy, and the observable patterns of the physical world.",
    knowledgePointZh: "物理科学研究化学、物理、地球过程、材料、能量，以及物质世界中可观察的模式。",
    reflectionQuestion: "What everyday change would become more interesting if you asked what stayed the same?",
    reflectionQuestionZh: "哪一个日常变化，如果你追问什么没有变，会变得更有意思？",
    tags: ["matter", "energy", "observation"],
    tagsZh: ["物质", "能量", "观察"],
  },
  {
    id: "054-shared-bill-pattern",
    categoryCode: "05",
    groupCode: "054",
    groupTitleZh: "数学与统计",
    title: "The shared dinner bill",
    titleZh: "合餐账单",
    summary: "A dinner bill showed how numbers can clarify fairness and uncertainty.",
    summaryZh: "一张合餐账单说明数字如何澄清公平和不确定性。",
    scene: "Six friends shared dinner. One ordered only soup, another ordered wine, and someone suggested splitting everything equally.",
    sceneZh: "六个朋友一起吃饭。一个人只点了汤，另一个点了酒，有人提议平均分账。",
    storyBody: "The table became quiet until Ana wrote three options: equal split, itemized split, and shared dishes plus personal extras. The math did not decide their values, but it made the trade-off visible. Mathematics and statistics often help people see the shape of fairness before arguing about it.",
    storyBodyZh: "桌上安静下来，直到 Ana 写出三种方案：平均分、按项目分、共享菜品加个人额外消费。数学没有替他们决定价值观，但让取舍变得可见。数学与统计常常帮助人在争论公平之前，先看清公平的形状。",
    knowledgePoint: "Mathematics and statistics use quantities, patterns, models, probability, and data to reason clearly about problems.",
    knowledgePointZh: "数学与统计使用数量、模式、模型、概率和数据，让人更清楚地推理问题。",
    reflectionQuestion: "Where could a simple model make a difficult conversation less blurry?",
    reflectionQuestionZh: "在哪个困难对话里，一个简单模型能让问题不再模糊？",
    tags: ["models", "fairness", "data"],
    tagsZh: ["模型", "公平", "数据"],
  },
  {
    id: "058-school-air-quality",
    categoryCode: "05",
    groupCode: "058",
    groupTitleZh: "自然科学、数学与统计相关跨学科课程与资格",
    title: "The classroom air question",
    titleZh: "教室空气问题",
    summary: "A stuffy classroom needed sensors, biology, statistics, and environmental thinking together.",
    summaryZh: "一间闷热教室需要传感器、生物、统计和环境思维共同解释。",
    scene: "Students complained that the classroom felt heavy after lunch. The teacher brought a small sensor, opened a spreadsheet, and asked them to track what changed.",
    sceneZh: "学生抱怨午饭后教室空气很闷。老师带来一个小传感器，打开表格，让他们记录什么在变化。",
    storyBody: "They measured carbon dioxide, temperature, window opening, class size, and headaches. Biology explained breathing, environment explained ventilation, statistics helped compare days. The answer belonged to no single subject because the air did not either.",
    storyBodyZh: "他们测量二氧化碳、温度、开窗情况、班级人数和头痛情况。生物解释呼吸，环境解释通风，统计帮助比较不同日期。答案不属于单一学科，因为空气本身也不属于单一学科。",
    knowledgePoint: "Inter-disciplinary natural sciences, mathematics, and statistics combine measurement, models, and evidence across scientific domains.",
    knowledgePointZh: "自然科学、数学与统计跨学科课程把测量、模型和证据连接到多个科学领域。",
    reflectionQuestion: "What problem around you needs both measurement and a story about living bodies?",
    reflectionQuestionZh: "你身边哪一个问题既需要测量，也需要关于生命身体的故事？",
    tags: ["measurement", "science project", "statistics"],
    tagsZh: ["测量", "科学项目", "统计"],
  },
  {
    id: "059-mystery-stain",
    categoryCode: "05",
    groupCode: "059",
    groupTitleZh: "未另分类的自然科学、数学与统计",
    title: "The mystery stain",
    titleZh: "那块神秘污渍",
    summary: "A stain on a wall became a question that refused one neat scientific category.",
    summaryZh: "墙上的一块污渍变成了一个拒绝单一科学分类的问题。",
    scene: "A brown stain appeared near the ceiling. One person blamed rain, another insects, another old paint. Each explanation sounded partly right.",
    sceneZh: "天花板附近出现一块棕色污渍。有人怪雨水，有人说是虫害，还有人怀疑旧油漆。每个解释听起来都有一点道理。",
    storyBody: "They checked humidity, roof angle, pipe location, material age, and the timing of the stain. The problem was too practical to respect subject boundaries. Some science work begins with messy clues that need several tools before they deserve a name.",
    storyBodyZh: "他们检查湿度、屋顶角度、管道位置、材料年限，以及污渍出现的时间。这个问题太实际，不会尊重学科边界。有些科学工作从混乱线索开始，需要几种工具之后才配得到名字。",
    knowledgePoint: "Not elsewhere classified science and statistics catch practical investigations that use scientific reasoning without fitting a standard domain.",
    knowledgePointZh: "未另分类的自然科学与统计收纳那些使用科学推理、但不适合标准领域的实际调查。",
    reflectionQuestion: "What mystery near you is waiting for several kinds of evidence before becoming clear?",
    reflectionQuestionZh: "你身边哪个谜题，需要几种证据一起出现才会变清楚？",
    tags: ["investigation", "evidence", "messy problem"],
    tagsZh: ["调查", "证据", "复杂问题"],
  },
  {
    id: "068-repairing-the-club-website",
    categoryCode: "06",
    groupCode: "068",
    groupTitleZh: "信息与通信技术相关跨学科课程与资格",
    title: "The club website that forgot people",
    titleZh: "忘记人的社团网站",
    summary: "A broken club website needed design, data, writing, access, and technical structure together.",
    summaryZh: "一个出问题的社团网站同时需要设计、数据、写作、可访问性和技术结构。",
    scene: "The community club had a website, but nobody could find the meeting time. The programmer said the page worked. The members said it did not work for them.",
    sceneZh: "社区社团有一个网站，但没人找得到会议时间。程序员说页面能运行，成员们说它对他们没用。",
    storyBody: "They rewrote the text, changed the navigation, checked mobile screens, fixed the calendar feed, and added a plain contact path. The technical problem was also a communication problem and a service problem. ICT often succeeds only when several domains agree on what usable means.",
    storyBodyZh: "他们重写文字，调整导航，检查手机屏幕，修复日历同步，并加上一个简单联系方式。技术问题同时也是沟通问题和服务问题。信息技术常常只有在几个领域共同定义“可用”时才真正成功。",
    knowledgePoint: "Inter-disciplinary ICT connects computing with communication, design, organizational needs, data, and real user contexts.",
    knowledgePointZh: "信息与通信技术跨学科课程把计算、沟通、设计、组织需求、数据和真实用户语境连接起来。",
    reflectionQuestion: "What tool around you technically works but fails the situation it is meant to serve?",
    reflectionQuestionZh: "你身边哪个工具技术上能运行，却没有服务好它原本要服务的情境？",
    tags: ["usability", "data", "communication"],
    tagsZh: ["可用性", "数据", "沟通"],
  },
  {
    id: "071-flickering-hall-light",
    categoryCode: "07",
    groupCode: "071",
    groupTitleZh: "工程与工程行业",
    title: "The flickering hallway light",
    titleZh: "闪烁的走廊灯",
    summary: "A flickering light showed that engineering is diagnosis under constraints.",
    summaryZh: "一盏闪烁的灯说明：工程是在约束中诊断问题。",
    scene: "The hallway light flickered every evening. Residents blamed the bulb, but replacing it did nothing.",
    sceneZh: "走廊灯每天傍晚闪烁。住户都怪灯泡，但换了灯泡也没用。",
    storyBody: "The electrician checked the switch, load, wiring age, and timing. The problem appeared only when several apartments used appliances at once. Engineering was not guessing the most visible part; it was tracing the system until cause and safe repair met.",
    storyBodyZh: "电工检查开关、负载、线路年限和出现时间。问题只在几户同时使用电器时出现。工程不是猜最显眼的部件，而是追踪系统，直到原因和安全修复相遇。",
    knowledgePoint: "Engineering and engineering trades apply technical knowledge to electricity, mechanics, automation, materials, vehicles, and process systems.",
    knowledgePointZh: "工程与工程行业把技术知识应用到电力、机械、自动化、材料、交通工具和流程系统中。",
    reflectionQuestion: "What visible failure might be only the symptom of a hidden system under strain?",
    reflectionQuestionZh: "哪一个显眼故障，可能只是隐藏系统承压后的症状？",
    tags: ["diagnosis", "systems", "technical repair"],
    tagsZh: ["诊断", "系统", "技术修复"],
  },
  {
    id: "072-soup-that-travels",
    categoryCode: "07",
    groupCode: "072",
    groupTitleZh: "制造与加工",
    title: "The soup that had to travel",
    titleZh: "要被送走的汤",
    summary: "A soup recipe changed when it had to become safe, stable, packaged, and repeatable.",
    summaryZh: "当一锅汤必须变得安全、稳定、可包装、可重复时，食谱就变了。",
    scene: "A small restaurant wanted to sell its soup in jars. The chef said the recipe was already perfect. The first delivery leaked and spoiled.",
    sceneZh: "一家小餐馆想把招牌汤装罐售卖。厨师说食谱已经完美。第一次配送却漏了，还变质了。",
    storyBody: "They had to think about heat, sealing, shelf life, labeling, texture, and transport. Manufacturing and processing begin when making one good thing is no longer enough; the thing must survive repetition, storage, movement, and rules.",
    storyBodyZh: "他们必须考虑加热、密封、保质期、标签、口感和运输。制造与加工从这里开始：做出一次好东西不够，它还必须经受重复、储存、移动和规则。",
    knowledgePoint: "Manufacturing and processing transform raw materials into safe, stable, usable products through controlled methods and quality checks.",
    knowledgePointZh: "制造与加工通过受控方法和质量检查，把原材料转化为安全、稳定、可使用的产品。",
    reflectionQuestion: "What changes when a handmade success has to become repeatable?",
    reflectionQuestionZh: "当一次手作成功必须变成可重复流程时，什么会改变？",
    tags: ["processing", "quality", "repeatability"],
    tagsZh: ["加工", "质量", "可重复"],
  },
  {
    id: "073-crosswalk-at-school",
    categoryCode: "07",
    groupCode: "073",
    groupTitleZh: "建筑与施工",
    title: "The crosswalk near school",
    titleZh: "学校旁的人行横道",
    summary: "A dangerous crossing showed how built space shapes movement before anyone decides.",
    summaryZh: "一个危险路口说明：建成空间会在个人决定之前塑造行动。",
    scene: "Parents complained that children ran across the street outside school. The city first blamed impatience, then watched the crossing for one morning.",
    sceneZh: "家长抱怨孩子们总是在学校外面跑过马路。城市一开始怪孩子着急，后来观察了一个早晨。",
    storyBody: "The nearest crosswalk was too far, the corner blocked sightlines, and parked cars narrowed the view. The solution involved curb design, markings, speed, drainage, and construction timing. Architecture and construction turn human movement into physical decisions.",
    storyBodyZh: "最近的人行横道太远，转角遮挡视线，停放车辆又缩小了观察范围。解决方案涉及路缘设计、标线、车速、排水和施工时间。建筑与施工把人的移动转化为物理决策。",
    knowledgePoint: "Architecture and construction plan and build physical environments, from buildings and towns to roads, structures, and civil systems.",
    knowledgePointZh: "建筑与施工规划并建造物理环境，从建筑和城镇到道路、结构和土木系统。",
    reflectionQuestion: "Where does a place near you ask people to behave better than its design allows?",
    reflectionQuestionZh: "你身边哪个地方要求人表现得更好，却没有给出相应设计？",
    tags: ["built environment", "safety", "planning"],
    tagsZh: ["建成环境", "安全", "规划"],
  },
  {
    id: "078-community-kitchen-build",
    categoryCode: "07",
    groupCode: "078",
    groupTitleZh: "工程、制造与建筑相关跨学科课程与资格",
    title: "The community kitchen build",
    titleZh: "社区厨房建设",
    summary: "A shared kitchen needed architecture, equipment, food safety, energy, and workflow together.",
    summaryZh: "一个共享厨房同时需要建筑、设备、食品安全、能源和工作流程。",
    scene: "The community center wanted a kitchen for cooking classes. The first sketch had counters and sinks, but no one had discussed ventilation, storage, power load, or cleaning flow.",
    sceneZh: "社区中心想建一个烹饪教室。第一张草图有台面和水槽，却没人讨论通风、储藏、电力负载或清洁动线。",
    storyBody: "The project changed when the cook, builder, electrician, cleaner, and teacher sat together. A kitchen is a room, a process, a safety system, and a learning environment. Interdisciplinary construction happens when all of those must work at once.",
    storyBodyZh: "当厨师、施工方、电工、清洁人员和老师坐在一起，项目变了。厨房既是房间，也是流程、安全系统和学习环境。跨学科建设发生在这些东西必须同时运转的时候。",
    knowledgePoint: "Inter-disciplinary engineering, manufacturing, and construction combine design, technical systems, materials, safety, and use.",
    knowledgePointZh: "工程、制造与建筑跨学科课程连接设计、技术系统、材料、安全和使用方式。",
    reflectionQuestion: "What space do you use that only works because several technical worlds cooperate invisibly?",
    reflectionQuestionZh: "你使用的哪一个空间，之所以可用，是因为几个技术世界在背后合作？",
    tags: ["integrated design", "safety", "workflow"],
    tagsZh: ["整合设计", "安全", "流程"],
  },
  {
    id: "079-unusual-repair-material",
    categoryCode: "07",
    groupCode: "079",
    groupTitleZh: "未另分类的工程、制造与建筑",
    title: "The bridge made from leftovers",
    titleZh: "用剩料搭起的小桥",
    summary: "A small improvised bridge showed useful engineering outside standard categories.",
    summaryZh: "一座临时小桥说明：有用的工程有时发生在标准分类之外。",
    scene: "After rain, a path flooded behind the garden. Volunteers built a small crossing from leftover boards and stones.",
    sceneZh: "雨后，花园后面的小路积水。志愿者用剩木板和石块搭了一个小过道。",
    storyBody: "It looked informal, but they still tested wobble, water flow, surface grip, and weight. The bridge was not a textbook project, yet it carried real bodies. Some engineering knowledge appears in local repairs where safety and improvisation meet.",
    storyBodyZh: "它看起来很临时，但他们仍然测试晃动、水流、表面防滑和承重。这座小桥不是教材项目，却承载真实身体。有些工程知识出现在本地修补中，在安全和临场创造之间出现。",
    knowledgePoint: "Not elsewhere classified engineering and construction catches practical technical solutions that do not fit a standard industry label.",
    knowledgePointZh: "未另分类的工程与建筑收纳那些不适合标准行业标签、但真实解决技术问题的实践方案。",
    reflectionQuestion: "What improvised fix near you contains more engineering than people admit?",
    reflectionQuestionZh: "你身边哪个临时修补，其实含有比人们承认更多的工程知识？",
    tags: ["improvisation", "repair", "local engineering"],
    tagsZh: ["临场创造", "修补", "本地工程"],
  },
  {
    id: "081-balcony-tomato-plan",
    categoryCode: "08",
    groupCode: "081",
    groupTitleZh: "农业",
    title: "The balcony tomato plan",
    titleZh: "阳台番茄计划",
    summary: "A tomato plant showed how growing food involves soil, timing, pests, and care.",
    summaryZh: "一株番茄说明：种植食物涉及土壤、时机、虫害和照料。",
    scene: "Rafi planted tomatoes on a balcony and watered them whenever he remembered. The plant grew tall, then weak, then covered itself in tiny insects.",
    sceneZh: "Rafi 在阳台种番茄，想起来就浇水。植物先长高，后来变弱，最后叶背爬满小虫。",
    storyBody: "A neighbor asked about pot size, sunlight, feeding, pruning, and air movement. Agriculture was not simply affection for plants. It was the disciplined care of living production under changing conditions.",
    storyBodyZh: "邻居问他盆有多大、日照多久、施肥怎样、有没有修剪、空气是否流通。农业不只是喜欢植物，而是在变化条件下有纪律地照料生命生产。",
    knowledgePoint: "Agriculture studies crop and livestock production, horticulture, soil, pests, feeding, and the systems that produce food and plant life.",
    knowledgePointZh: "农业研究作物与畜牧生产、园艺、土壤、虫害、饲养，以及生产食物和植物生命的系统。",
    reflectionQuestion: "What does care become when the living thing also has to produce?",
    reflectionQuestionZh: "当一个生命还要承担生产时，照料会变成什么？",
    tags: ["production", "soil", "care"],
    tagsZh: ["生产", "土壤", "照料"],
  },
  {
    id: "082-fallen-branch-trail",
    categoryCode: "08",
    groupCode: "082",
    groupTitleZh: "林业",
    title: "The fallen branch on the trail",
    titleZh: "步道上的断枝",
    summary: "A fallen branch opened questions about forests as managed living systems.",
    summaryZh: "一根断枝打开了关于森林作为被管理生命系统的问题。",
    scene: "After wind, a large branch blocked the trail. One walker wanted it removed immediately. Another noticed the insects already gathering under the bark.",
    sceneZh: "大风后，一根大树枝挡住步道。一个路人想立刻清走，另一个注意到树皮下已经有昆虫聚集。",
    storyBody: "The ranger moved part of it for safety and left part nearby for habitat. Forestry is full of such decisions: timber, paths, disease, fire risk, biodiversity, and time scales longer than a single visit.",
    storyBodyZh: "护林员为了安全移走一部分，又把另一部分留在附近作为栖息地。林业充满这类决定：木材、步道、病害、火险、生物多样性，以及比一次游览长得多的时间尺度。",
    knowledgePoint: "Forestry manages forests as ecological, economic, protective, and long-term living systems.",
    knowledgePointZh: "林业把森林作为生态、经济、防护和长期生命系统来管理。",
    reflectionQuestion: "When is leaving something alone also a form of care?",
    reflectionQuestionZh: "什么时候“不动它”也是一种照料？",
    tags: ["forest", "habitat", "long-term care"],
    tagsZh: ["森林", "栖息地", "长期照料"],
  },
  {
    id: "083-fish-market-morning",
    categoryCode: "08",
    groupCode: "083",
    groupTitleZh: "渔业",
    title: "The morning at the fish market",
    titleZh: "鱼市的清晨",
    summary: "A fish stall connected weather, stock, freshness, ecosystems, and livelihoods.",
    summaryZh: "一个鱼摊连接了天气、库存、新鲜度、生态系统和生计。",
    scene: "At dawn, one fish stall was half empty. The seller said the wind changed, the boats stayed close, and the best fish never arrived.",
    sceneZh: "清晨，一个鱼摊只摆了一半。摊主说风向变了，船没有走远，最好的鱼没到。",
    storyBody: "Customers saw missing products. The seller saw tides, fuel, cold storage, regulations, spawning seasons, and families waiting for income. Fisheries knowledge lives between water ecosystems and human supply chains.",
    storyBodyZh: "顾客看到的是缺货，摊主看到的是潮汐、燃油、冷藏、规定、产卵季和等待收入的家庭。渔业知识生活在水域生态和人类供应链之间。",
    knowledgePoint: "Fisheries study aquatic production, harvesting, ecosystems, regulation, preservation, and the communities that depend on them.",
    knowledgePointZh: "渔业研究水产生产、捕捞、生态系统、监管、保鲜，以及依赖它们的社区。",
    reflectionQuestion: "What food on a counter still carries the weather of where it came from?",
    reflectionQuestionZh: "柜台上的哪种食物，仍然带着它来处的天气？",
    tags: ["aquatic systems", "supply", "livelihood"],
    tagsZh: ["水域系统", "供应", "生计"],
  },
  {
    id: "084-dog-that-stopped-eating",
    categoryCode: "08",
    groupCode: "084",
    groupTitleZh: "兽医",
    title: "The dog that stopped eating",
    titleZh: "突然不吃饭的狗",
    summary: "A pet's changed appetite showed how animal care reads body, behavior, and environment.",
    summaryZh: "一只宠物食欲变化说明：动物照护要同时读身体、行为和环境。",
    scene: "Milo the dog skipped breakfast twice. His family blamed picky eating until the vet asked about movement, water, gums, stool, and a new plant in the hallway.",
    sceneZh: "小狗 Milo 两次没吃早饭。家人以为它挑食，直到兽医询问活动、水量、牙龈、粪便，以及走廊里那盆新植物。",
    storyBody: "The diagnosis was not a single dramatic clue. It came from patterns across species knowledge, anatomy, behavior, and household context. Veterinary work listens to patients who cannot explain symptoms in words.",
    storyBodyZh: "诊断不是来自某个戏剧性线索，而是来自物种知识、解剖、行为和家庭环境之间的模式。兽医工作是在倾听无法用语言说明症状的病人。",
    knowledgePoint: "Veterinary studies animal health, disease, treatment, welfare, species differences, and the human systems around animal care.",
    knowledgePointZh: "兽医研究动物健康、疾病、治疗、福利、物种差异，以及围绕动物照护的人类系统。",
    reflectionQuestion: "How do you listen when the one who needs help cannot use your language?",
    reflectionQuestionZh: "当需要帮助的一方不能使用你的语言时，你如何倾听？",
    tags: ["animal health", "diagnosis", "care"],
    tagsZh: ["动物健康", "诊断", "照护"],
  },
  {
    id: "088-farm-visit-class",
    categoryCode: "08",
    groupCode: "088",
    groupTitleZh: "农业、林业、渔业与兽医相关跨学科课程与资格",
    title: "The farm visit lesson",
    titleZh: "农场参访课",
    summary: "A farm visit connected plants, animals, soil, water, food, and responsibility.",
    summaryZh: "一次农场参访连接了植物、动物、土壤、水、食物和责任。",
    scene: "Students visited a small farm expecting cute animals. They left talking about feed, manure, water use, crop rotation, and veterinary visits.",
    sceneZh: "学生们去小农场，以为会看到可爱的动物。离开时，他们讨论的是饲料、粪肥、水使用、轮作和兽医出诊。",
    storyBody: "The farmer explained that no decision stayed in one box. Changing feed affected manure; manure affected soil; soil affected crops; crops affected income. Interdisciplinary land-based learning shows the farm as a web of living consequences.",
    storyBodyZh: "农场主解释，没有一个决定只待在一个格子里。改变饲料会影响粪肥，粪肥影响土壤，土壤影响作物，作物影响收入。土地相关的跨学科学习把农场呈现为一张生命后果之网。",
    knowledgePoint: "Inter-disciplinary agriculture, forestry, fisheries, and veterinary programmes link living production, ecology, animal care, and resource use.",
    knowledgePointZh: "农业、林业、渔业与兽医跨学科课程连接生命生产、生态、动物照护和资源使用。",
    reflectionQuestion: "What decision in a living system travels farther than the person making it expects?",
    reflectionQuestionZh: "生命系统里哪一个决定，会比做决定的人想象中走得更远？",
    tags: ["land systems", "ecology", "interdependence"],
    tagsZh: ["土地系统", "生态", "相互依赖"],
  },
  {
    id: "089-unusual-animal-garden",
    categoryCode: "08",
    groupCode: "089",
    groupTitleZh: "未另分类的农业、林业、渔业与兽医",
    title: "The rooftop beehive",
    titleZh: "屋顶蜂箱",
    summary: "A rooftop beehive sat between gardening, animal care, ecology, and city rules.",
    summaryZh: "一个屋顶蜂箱处在园艺、动物照护、生态和城市规则之间。",
    scene: "A restaurant kept beehives on its roof for herbs and honey. The neighbors loved the idea until someone was stung near the stairwell.",
    sceneZh: "一家餐厅在屋顶养蜂，为香草授粉，也收蜂蜜。邻居们本来喜欢这个想法，直到有人在楼梯间附近被蜇。",
    storyBody: "The owner had to learn bee behavior, plant cycles, allergy risk, signage, and local rules. The project was not simply agriculture or pet care. Some living practices in cities are hybrids that need careful naming.",
    storyBodyZh: "老板必须学习蜜蜂行为、植物周期、过敏风险、提示标识和本地规则。这个项目不只是农业，也不只是养宠物。城市里的某些生命实践是混合体，需要被谨慎命名。",
    knowledgePoint: "Not elsewhere classified land and animal fields include hybrid practices that combine cultivation, animal care, ecology, and local constraints.",
    knowledgePointZh: "未另分类的土地与动物领域包括混合实践，连接种植、动物照护、生态和本地约束。",
    reflectionQuestion: "What living practice around you does not fit the place it happens in?",
    reflectionQuestionZh: "你身边哪一种生命实践，与它发生的地点并不完全匹配？",
    tags: ["urban ecology", "hybrid practice", "local rules"],
    tagsZh: ["城市生态", "混合实践", "本地规则"],
  },
  {
    id: "091-cough-in-the-waiting-room",
    categoryCode: "09",
    groupCode: "091",
    groupTitleZh: "健康",
    title: "The cough in the waiting room",
    titleZh: "候诊室里的咳嗽",
    summary: "A cough showed how health knowledge moves from symptom to body, risk, and treatment.",
    summaryZh: "一次咳嗽说明健康知识如何从症状走向身体、风险和治疗。",
    scene: "In the waiting room, Amir said it was just a cough. The nurse asked how long, what time of day, what work he did, and whether stairs felt harder.",
    sceneZh: "候诊室里，Amir 说这只是咳嗽。护士问持续多久、一天中什么时候、他做什么工作、爬楼是否更吃力。",
    storyBody: "The symptom was small, but the questions widened it into a picture of lungs, environment, habits, infection, and care. Health fields begin where a body signal must be interpreted without reducing the person to the signal.",
    storyBodyZh: "症状很小，但问题把它扩展成肺、环境、习惯、感染和照护的图像。健康领域从这里开始：解释身体信号，同时不把一个人缩小成一个信号。",
    knowledgePoint: "Health includes medicine, nursing, diagnostics, therapy, pharmacy, dentistry, rehabilitation, and complementary approaches to human wellbeing.",
    knowledgePointZh: "健康领域包括医学、护理、诊断、治疗、药学、牙科、康复和补充疗法，共同关注人的身心状态。",
    reflectionQuestion: "What symptom would be misunderstood if nobody asked about the life around it?",
    reflectionQuestionZh: "哪一种症状，如果没人询问它周围的生活，就会被误解？",
    tags: ["symptom", "diagnosis", "wellbeing"],
    tagsZh: ["症状", "诊断", "健康状态"],
  },
  {
    id: "092-key-under-the-mat",
    categoryCode: "09",
    groupCode: "092",
    groupTitleZh: "福利",
    title: "The key under the mat",
    titleZh: "门垫下的钥匙",
    summary: "A hidden spare key revealed care, independence, risk, and social support.",
    summaryZh: "一把备用钥匙显露出照护、独立、风险和社会支持。",
    scene: "After her mother fell once, Sofia wanted a key to the apartment. Her mother hid one under the mat instead and insisted she was fine.",
    sceneZh: "母亲摔倒一次后，Sofia 想要一把公寓钥匙。母亲却把备用钥匙藏在门垫下，坚持说自己没事。",
    storyBody: "The family conversation was not only about safety. It was about privacy, pride, neighbors, emergency plans, and what help should feel like. Welfare work often lives in the space between protecting people and respecting their agency.",
    storyBodyZh: "这场家庭对话不只是安全问题，也关乎隐私、尊严、邻里、应急计划，以及帮助应该是什么感觉。福利工作常常存在于保护一个人和尊重其自主之间。",
    knowledgePoint: "Welfare focuses on care, social work, counselling, child and youth services, elder support, disability support, and social wellbeing.",
    knowledgePointZh: "福利关注照护、社会工作、咨询、儿童与青年服务、老人支持、残障支持和社会福祉。",
    reflectionQuestion: "When does help start to feel like losing control, and how could it be redesigned?",
    reflectionQuestionZh: "帮助什么时候会开始像失去控制？它可以怎样被重新设计？",
    tags: ["support", "agency", "social care"],
    tagsZh: ["支持", "自主", "社会照护"],
  },
  {
    id: "098-after-discharge-plan",
    categoryCode: "09",
    groupCode: "098",
    groupTitleZh: "健康与福利相关跨学科课程与资格",
    title: "The day after discharge",
    titleZh: "出院后的第二天",
    summary: "Leaving hospital required medicine, housing, family support, transport, and follow-up care.",
    summaryZh: "离开医院需要药物、住房、家庭支持、交通和后续照护共同配合。",
    scene: "Rosa was discharged on Friday. The medical note was clear, but the stairs at home, missing groceries, and confused bus route were not in the note.",
    sceneZh: "Rosa 周五出院。医疗说明很清楚，但家里的楼梯、缺少的食物和让人困惑的公交路线，都不在说明里。",
    storyBody: "A nurse, social worker, daughter, pharmacist, and community driver had to coordinate. Recovery was not only a clinical process; it was a living arrangement. Health and welfare meet when care has to survive outside the institution.",
    storyBodyZh: "护士、社工、女儿、药师和社区司机必须协调。恢复不只是临床过程，也是一种生活安排。当照护必须离开机构后继续存在，健康与福利就相遇了。",
    knowledgePoint: "Inter-disciplinary health and welfare connects clinical care, social support, rehabilitation, counselling, access, and everyday living conditions.",
    knowledgePointZh: "健康与福利跨学科课程连接临床照护、社会支持、康复、咨询、可及性和日常生活条件。",
    reflectionQuestion: "What care plan fails if it only works inside a professional building?",
    reflectionQuestionZh: "哪一种照护计划，如果只在专业机构内部有效，就会失败？",
    tags: ["continuity of care", "support systems", "recovery"],
    tagsZh: ["连续照护", "支持系统", "恢复"],
  },
  {
    id: "099-neighborhood-listening-chair",
    categoryCode: "09",
    groupCode: "099",
    groupTitleZh: "未另分类的健康与福利",
    title: "The listening chair",
    titleZh: "那把倾听椅",
    summary: "A simple chair outside a community center became informal care that did not fit a neat service box.",
    summaryZh: "社区中心外的一把椅子，变成了不适合整齐服务分类的非正式照护。",
    scene: "Every afternoon, an older volunteer sat outside the community center. People stopped to talk before they were ready to ask for official help.",
    sceneZh: "每天下午，一位年长志愿者坐在社区中心门口。人们在准备寻求正式帮助之前，会先停下来和她说几句。",
    storyBody: "She did not diagnose, counsel, or process forms. She listened, noticed patterns, and pointed people gently toward services. Some welfare work exists in the doorway before categories: not clinical, not administrative, but still protective.",
    storyBodyZh: "她不诊断，不做正式咨询，也不处理表格。她倾听，注意模式，并温和地把人指向服务。有些福利工作存在于分类之前的门口：不是临床，不是行政，但仍然有保护作用。",
    knowledgePoint: "Not elsewhere classified health and welfare includes informal or hybrid support practices that affect wellbeing but do not fit standard service labels.",
    knowledgePointZh: "未另分类的健康与福利包括那些影响福祉、但不适合标准服务标签的非正式或混合支持实践。",
    reflectionQuestion: "What kind of help becomes possible before someone is ready to enter a system?",
    reflectionQuestionZh: "在一个人准备进入系统之前，哪种帮助已经可能发生？",
    tags: ["informal care", "wellbeing", "access"],
    tagsZh: ["非正式照护", "福祉", "进入服务"],
  },
  {
    id: "101-haircut-before-wedding",
    categoryCode: "10",
    groupCode: "101",
    groupTitleZh: "个人服务",
    title: "The haircut before the wedding",
    titleZh: "婚礼前的理发",
    summary: "A haircut showed how personal services combine skill, trust, timing, and emotion.",
    summaryZh: "一次理发说明个人服务如何结合技能、信任、时机和情绪。",
    scene: "The groom arrived nervous, asking for the same haircut as last time, but his hands kept touching the photo of the wedding suit.",
    sceneZh: "新郎紧张地来到店里，说要和上次一样的发型，但手一直摸着婚礼西装照片。",
    storyBody: "The barber asked about the collar, the weather, the photographs, and how formal he wanted to feel. The service was technical, but also personal. Personal services work close to identity, comfort, and the body's presentation in social life.",
    storyBodyZh: "理发师问他领口、天气、照片效果，以及他想显得多正式。这项服务有技术性，也很私人。个人服务贴近身份、舒适感，以及身体在社会生活中的呈现。",
    knowledgePoint: "Personal services include domestic work, hair and beauty, hospitality, sports, travel, leisure, and other direct experience-based support.",
    knowledgePointZh: "个人服务包括家政、美发美容、酒店餐饮、体育、旅行休闲等直接围绕体验展开的支持。",
    reflectionQuestion: "What service changes how someone enters a room, not just how they look?",
    reflectionQuestionZh: "哪一种服务改变的不只是外表，而是一个人走进房间的方式？",
    tags: ["experience", "identity", "personal care"],
    tagsZh: ["体验", "身份", "个人照护"],
  },
  {
    id: "102-clean-hands-station",
    categoryCode: "10",
    groupCode: "102",
    groupTitleZh: "卫生与职业健康服务",
    title: "The handwashing station",
    titleZh: "洗手站",
    summary: "A temporary handwashing station showed hygiene as design, habit, and workplace safety.",
    summaryZh: "一个临时洗手站说明卫生是设计、习惯和工作安全。",
    scene: "At a street food event, the handwashing station was placed behind a stack of boxes. Staff used it less, even though everyone agreed it mattered.",
    sceneZh: "街头美食活动里，洗手站被放在一堆箱子后面。大家都知道它重要，但工作人员使用得更少。",
    storyBody: "Moving it into the workflow changed behavior faster than another reminder poster. Hygiene and occupational health services often depend on making the safe action the easy action.",
    storyBodyZh: "把它移到工作动线中，比再贴一张提醒海报更快改变行为。卫生与职业健康服务常常取决于让安全行为成为容易发生的行为。",
    knowledgePoint: "Hygiene and occupational health services protect people through sanitation, prevention, safety systems, and healthy work environments.",
    knowledgePointZh: "卫生与职业健康服务通过卫生、预防、安全系统和健康工作环境来保护人。",
    reflectionQuestion: "Where does safety fail because the safer action is inconvenient?",
    reflectionQuestionZh: "哪里安全失败，是因为更安全的行动太不方便？",
    tags: ["hygiene", "workplace safety", "prevention"],
    tagsZh: ["卫生", "职业安全", "预防"],
  },
  {
    id: "103-night-watch-call",
    categoryCode: "10",
    groupCode: "103",
    groupTitleZh: "安全服务",
    title: "The night watch call",
    titleZh: "夜班保安的电话",
    summary: "A late-night noise complaint showed security as judgment, prevention, and proportion.",
    summaryZh: "一次深夜噪声投诉说明：安全服务关乎判断、预防和分寸。",
    scene: "At midnight, a guard received a call about noise in the parking area. It could be teenagers, a car problem, or something more serious.",
    sceneZh: "午夜，保安接到停车区噪声投诉。那可能是年轻人，也可能是车辆问题，或者更严重的事。",
    storyBody: "He checked cameras, called a colleague, approached with light visible, and kept distance before speaking. Security work is not only force. It is assessing risk while avoiding unnecessary escalation.",
    storyBodyZh: "他先看监控，联系同事，打开可见照明，保持距离后再靠近沟通。安全服务不只是力量，而是在评估风险的同时避免不必要升级。",
    knowledgePoint: "Security services include defence, protection of persons and property, risk assessment, preparedness, and safe response.",
    knowledgePointZh: "安全服务包括防务、人身与财产保护、风险评估、准备和安全响应。",
    reflectionQuestion: "When does protection require slowing down instead of reacting fast?",
    reflectionQuestionZh: "什么时候保护需要慢下来，而不是立刻反应？",
    tags: ["risk", "protection", "response"],
    tagsZh: ["风险", "保护", "响应"],
  },
  {
    id: "104-missed-connection",
    categoryCode: "10",
    groupCode: "104",
    groupTitleZh: "运输服务",
    title: "The missed connection",
    titleZh: "错过的换乘",
    summary: "A missed bus connection revealed transport as timing, reliability, access, and coordination.",
    summaryZh: "一次错过换乘说明：运输服务关乎时机、可靠性、可达性和协调。",
    scene: "Marta missed her second bus because the first one arrived six minutes late. The timetable said the route worked; her appointment said otherwise.",
    sceneZh: "Marta 因为第一辆公交晚到六分钟，错过了第二辆。时刻表说路线可行，她的预约却说明并非如此。",
    storyBody: "The transport office looked at transfer windows, wheelchair boarding time, traffic lights, driver breaks, and real passenger patterns. Transport is not movement alone. It is the promise that people and goods can arrive with enough reliability to plan a life around it.",
    storyBodyZh: "交通部门开始看换乘窗口、轮椅上车时间、红绿灯、司机休息和真实乘客模式。运输不只是移动，而是承诺人和物能以足够可靠的方式抵达，让人可以围绕它安排生活。",
    knowledgePoint: "Transport services organize movement through routes, schedules, logistics, safety, reliability, access, and coordination.",
    knowledgePointZh: "运输服务通过路线、时刻、物流、安全、可靠性、可达性和协调来组织移动。",
    reflectionQuestion: "What part of your day depends on a transport promise you rarely see?",
    reflectionQuestionZh: "你一天中的哪一部分，依赖着一个你很少看见的运输承诺？",
    tags: ["mobility", "reliability", "coordination"],
    tagsZh: ["移动", "可靠性", "协调"],
  },
  {
    id: "108-festival-operations-plan",
    categoryCode: "10",
    groupCode: "108",
    groupTitleZh: "服务相关跨学科课程与资格",
    title: "The festival operations plan",
    titleZh: "节日活动运营计划",
    summary: "A small festival needed hospitality, sanitation, transport, security, and customer care together.",
    summaryZh: "一个小型节日活动同时需要接待、卫生、运输、安全和顾客照护。",
    scene: "The festival team first booked musicians. Then came toilets, food queues, lost children, rain plans, delivery trucks, and elderly seating.",
    sceneZh: "节日团队最先预订了乐队。随后出现的是厕所、餐饮排队、走失儿童、雨天方案、配送车辆和老人座位。",
    storyBody: "The event worked only when services were designed as one experience. A clean toilet, a clear sign, a safe exit, and a warm greeting all belonged to the same promise: people should be able to be there without fighting the system.",
    storyBodyZh: "活动只有在服务被当作一个整体体验来设计时才运转起来。干净厕所、清楚标识、安全出口和温暖问候，都属于同一个承诺：人们应该能够在场，而不必和系统搏斗。",
    knowledgePoint: "Inter-disciplinary services coordinate several service domains around a complete user experience and real operating conditions.",
    knowledgePointZh: "服务跨学科课程围绕完整用户体验和真实运营条件，协调多个服务领域。",
    reflectionQuestion: "What event feels easy only because many services are quietly aligned?",
    reflectionQuestionZh: "哪一个活动之所以感觉轻松，是因为许多服务在背后安静对齐？",
    tags: ["operations", "experience", "service systems"],
    tagsZh: ["运营", "体验", "服务系统"],
  },
  {
    id: "109-service-that-had-no-name",
    categoryCode: "10",
    groupCode: "109",
    groupTitleZh: "未另分类的服务",
    title: "The service with no name",
    titleZh: "没有名字的服务",
    summary: "A volunteer at the station helped people in a way no official service label quite captured.",
    summaryZh: "车站里的志愿者提供了一种没有正式服务标签能完全概括的帮助。",
    scene: "At the train station, Lian helped travelers read signs, calm children, find elevators, and decide when to ask staff. Her badge simply said volunteer.",
    sceneZh: "在火车站，Lian 帮旅客看标识、安抚孩子、找电梯、判断什么时候该问工作人员。她的胸牌只写着志愿者。",
    storyBody: "She was not security, transport staff, tourism office, or social worker. Yet the station worked better because she stood between categories. Some services matter precisely because they catch the human needs no single desk owns.",
    storyBodyZh: "她不是安保、不是交通工作人员、不是旅游咨询，也不是社工。但因为她站在几个分类之间，车站变得更好用。有些服务之所以重要，正是因为它接住了没有单一窗口负责的人类需求。",
    knowledgePoint: "Not elsewhere classified services include practical support roles that improve experience but do not fit standard service categories.",
    knowledgePointZh: "未另分类的服务包括那些改善体验、却不适合标准服务类别的实际支持角色。",
    reflectionQuestion: "Where does the most useful help happen between official roles?",
    reflectionQuestionZh: "最有用的帮助，在哪里发生在正式角色之间？",
    tags: ["informal service", "access", "human support"],
    tagsZh: ["非正式服务", "可达性", "人的支持"],
  },
];

const fieldStoryDetailsZh = {
  "0111": ["教育科学", "孩子们自己搬动的小椅子", "1907 年，罗马圣洛伦佐一栋普通公寓里，一群白天无人照看的孩子被带进一间新教室。", "教育科学用观察、证据和设计研究学习如何发生，而不只是规定别人应该怎样学。", "如果一个孩子没有学进去，你会先要求他更努力，还是先检查环境有没有给他进入学习的路？", "房间里没有什么宏大的开场。小椅子、小桌子、一个炉子、一些被锁在柜子里的材料，孩子们有的擦桌子，有的照看小花园，有的只是反复摸一块字母板。来接手这间教室的女医生没有急着把孩子排成整齐队伍。她站在旁边看：哪个材料会被孩子拿起，什么时候他们能安静很久，什么时候大人的一句打断反而让学习散掉。她慢慢发现，孩子并不是等待灌满的空杯子。桌椅的高度、材料的顺序、身体能不能自由移动、成人愿不愿意先观察，都会改变学习的发生方式。后来，这个人叫 Maria Montessori，是意大利医生和教育家。她在罗马开办的 Casa dei Bambini 发展出蒙台梭利教育，也把“观察儿童、准备环境、尊重发展节奏”变成教育科学里一条很重要的线索。今天，教育科学继续研究学习环境、反馈、评估和发展阶段怎样帮助一个人真正学会。", "一间普通公寓里的小椅子，让教育从命令孩子学习，转向观察学习如何发生。", "Maria Montessori 原是医生；第一所 Casa dei Bambini 于 1907 年 1 月 6 日在罗马 San Lorenzo 开办；她通过观察儿童自由活动、调整材料和环境，逐步形成后来影响世界的 Montessori 教育方法。"],
  "0112": ["学前教师培养", "木球滚到孩子手边", "1837 年，德国 Bad Blankenburg 的一间小屋里，一个教育者把木球、积木、纸片和花园活动摆到孩子面前。", "学前教师培养关注幼儿发展、照护、安全、游戏、早期学习，以及成人如何陪伴孩子进入世界。", "当一个小孩在玩，你看见的是消遣，还是一种需要被理解和引导的学习？", "他观察到，小孩子并不是等到识字以后才开始学习。孩子握住球、滚动方块、唱歌、种植物、把线穿过纸面时，正在练习空间、节奏、关系和表达。问题是，成人很容易把这些动作看成“只是玩”。于是他开始设计一套材料和活动，让孩子可以在游戏里感知世界，也让照看孩子的成人学会怎样陪伴而不是打断。后来，这个人叫 Friedrich Froebel，是德国教育家。他创办了早期的幼儿园理念，并把 Kindergarten 这个词带进教育史。学前教师培养的核心也在这里：不是提前把小学搬给幼儿，而是训练成人读懂幼儿的身体、游戏、情绪和节奏，让早期学习在安全、自由和有引导的环境里发生。", "一只木球让幼儿教育从“看管孩子”，走向理解游戏、材料和早期发展。", "Friedrich Froebel 于 1837 年在 Bad Blankenburg 开办面向幼儿的 play and activity institute，并在 1840 年使用 Kindergarten 一词。他设计的 Froebel Gifts 包括几何积木等材料，强调唱歌、舞蹈、园艺、自主游戏和儿童活动的教育价值。"],
  "0113": ["无学科专门化教师培养", "只有三名学生的师范学校", "1839 年 7 月，马萨诸塞州 Lexington 的一所新学校开门时，第一批学生少到几乎不像一所学校。", "无学科专门化教师培养训练通用教学能力、课堂组织、学习观察、反馈、沟通和儿童发展理解。", "什么样的教学能力不属于任何一门课，却决定所有课能不能发生？", "那时很多人以为，只要一个人会读、会算、有品行，就自然能当老师。可真实教室并不这么简单：孩子会走神，会害怕，会同时处在不同进度，课堂也会因为一个问题没有说清楚而乱掉。推动这所师范学校的人想改变的正是这一点。他们不是先训练某一门学科的专家，而是训练“怎样成为老师”：怎样提问，怎样安排一节课，怎样观察学生是否真的明白，怎样让纪律不是恐惧，而是学习可以继续发生的秩序。后来，这所学校成为美国公立师范教育的重要起点之一；第一任校长叫 Cyrus Peirce，背后推动改革的人包括 Horace Mann。今天，无学科专门化教师培养仍然在处理同一个问题：在任何内容开始之前，老师要先学会托住一个真实的学习现场。", "一所只有少数学生起步的师范学校，让教师培养从“会知识的人去教”，走向“教师本身需要被训练”。", "1839 年 7 月，Massachusetts 在 Lexington 建立实验性 normal school，常被称为美国第一所公立师范学校；Cyrus Peirce 是第一任负责人，Horace Mann 是 Massachusetts 公共教育改革的重要推动者。学校初期学生很少，后来发展为 Framingham State University 的历史源头。"],
  "0114": ["有学科专门化教师培养", "教授把高等数学带回中学课堂", "20 世纪初的 Göttingen，一个数学教授发现，中学数学老师常站在两座桥之间：一边是大学数学，一边是学生眼前的题。", "有学科专门化教师培养把深层学科理解和教学方法结合起来，让老师知道怎样把一门学科教给第一次进入它的人。", "懂一门学科和教会一门学科，中间究竟隔着哪一种知识？", "他并不认为老师只要会做更难的题，就自然会教会学生。恰恰相反，懂得太远的人有时会忘记初学者为什么卡住。一个函数、一条曲线、一个证明，在专家眼里已经很自然，在学生眼里却可能像一堵墙。于是他试着把高等数学的眼光带回中学内容：不是为了炫耀难度，而是让老师看见学校数学背后的结构、联系和来处。后来，这个人叫 Felix Klein，是德国数学家。他推动数学教育改革，并成为 1908 年成立的 International Commission on Mathematical Instruction 的首任主席。对有学科专门化的教师培养来说，他留下的提醒很清楚：学科知识不能和教学知识分开。老师要知道答案，也要知道学生怎样一步步抵达答案。", "Felix Klein 让学科教师培养看见：真正会教一门课，需要把学科深度翻译成学生能进入的路径。", "Felix Klein 在 Göttingen 推动数学教育改革；1893 年 Göttingen 设立数学教育相关讲席；ICMI 于 1908 年成立，Klein 成为首任主席。他的《Elementary Mathematics from an Advanced Standpoint》于 1908、1909 年出版，影响了数学教师如何连接高等数学与学校数学。"],
  "0119": ["未另分类的教育", "工人把自己的词写上黑板", "1963 年，巴西 Angicos 的夜晚，一些甘蔗工人下班后坐进识字班，黑板上写的不是陌生例句，而是他们生活里的词。", "未另分类的教育收纳那些真实支持学习、但不适合标准学校、课程或学科标签的教育形式。", "哪些学习发生在正式课程之外，却真正改变了一个人看世界的方式？", "传统识字课常从课本句子开始，像是把世界先关在门外。这个教育者反过来做：先听人们平时说什么，工作里用什么词，害怕什么，想改变什么，再把这些词变成识字和讨论的入口。学习字母的同时，人也开始讨论土地、劳动、权利和沉默。识字不再只是技术，它变成一种重新说出自己生活的能力。后来，这个人叫 Paulo Freire，是巴西教育家，后来写下《Pedagogy of the Oppressed》。他的教育实践很难只归入普通学校教育、成人培训或政治讨论，却深刻影响了成人教育、批判教育学和社区学习。未另分类的教育常常就在这里：它长得不像标准课程，但它让人重新获得进入世界的语言。", "Angicos 的夜校让教育不只是识字技术，也成为人重新命名生活和参与社会的入口。", "Paulo Freire 在巴西东北部发展成人识字方法。1963 年 Angicos 实验中，约 300 名甘蔗工人在短期课程中学习读写；Freire 后来提出“banking model of education”的批判，并在 1968 年出版《Pedagogy of the Oppressed》，成为批判教育学的重要文本。"],
  "0211": ["视听技术与媒体制作", "生日视频剪完后，大家才发现同一段素材可以被剪成感谢、告别或广告。", "视听技术与媒体制作关注影像、声音、剪辑、传播和技术表达。", "当你剪掉一秒钟画面时，你是否也改变了意义？"],
  "0212": ["时装、室内与工业设计", "一把椅子看起来漂亮，却让老人起身困难。", "设计把材料、功能、身体、审美和使用情境放在一起思考。", "你身边哪个好看的东西，其实没有认真对待使用者？"],
  "0213": ["美术", "画室里一只普通杯子被画了十几遍，每张都像在问不同的问题。", "美术训练观察、构图、材料、表达和对可见世界的重新解释。", "当你真的看一个普通物件十分钟，会看见什么平时错过的东西？"],
  "0214": ["手工艺", "外婆补衣服时顺手换了针法，破洞变成了一小块图案。", "手工艺连接材料、手感、传统、耐心和实用美感。", "哪些知识只有手慢下来以后才会出现？"],
  "0215": ["音乐与表演艺术", "合唱排练里，声音最大的人反而让整首歌失去方向。", "音乐与表演艺术关注节奏、身体、声音、舞台、合作和现场表达。", "什么时候表达不是更用力，而是更会听？"],
  "0219": ["未另分类的艺术", "街角有人用废弃招牌做了一个会发光的小装置，没人知道该把它归进哪类艺术。", "未另分类的艺术容纳跨媒介、临时性和难以归档的创作。", "如果一个作品没有合适标签，它的价值会变少吗？"],
  "0221": ["宗教与神学", "一家人在节日前争论一道菜该不该保留，后来谈到的不是菜，而是记忆、敬畏和传承。", "宗教与神学研究信仰、仪式、文本、共同体和终极意义。", "哪些日常仪式其实在回答人为什么活着的问题？"],
  "0222": ["历史与考古", "工地挖出一块旧门牌，附近居民忽然开始讲起被遗忘的街道。", "历史与考古通过证据、遗迹、时间和叙述理解过去。", "当一个地方的过去被看见，今天的人会怎样改变走路方式？"],
  "0223": ["哲学与伦理", "朋友捡到钱包，有人说交给警察，有人说先找失主，争论从办法变成了原则。", "哲学与伦理研究价值、责任、理由、判断和行动背后的假设。", "当两个选择都说得通时，你靠什么判断更应该做哪一个？"],
  "0229": ["未另分类的人文学科", "一封没有署名的旧信同时涉及地方传说、家庭记忆和语言习惯。", "未另分类的人文学科处理那些关于意义、文本和人的经验但难以放入单一门类的问题。", "什么样的问题必须从人的故事进入，而不能只从数据进入？"],
  "0231": ["语言习得", "孩子把第二语言里的词用在家乡话句子里，大人笑了，老师却听见了学习正在发生。", "语言习得关注人如何在使用、反馈、环境和身份中获得语言。", "错误有没有可能是语言正在生长的声音？"],
  "0232": ["文学与语言学", "读书会为一个词争了二十分钟，最后发现每个人的理解都来自不同语境。", "文学与语言学研究文本、结构、声音、意义和语言规则。", "一个词为什么能让人同时靠近和误解彼此？"],
  "0239": ["未另分类的语言", "移民市场里出现了混合菜单，三种语言挤在一张小黑板上。", "未另分类的语言关注不适合标准语种或课程标签的语言实践。", "语言什么时候不是考试科目，而是生存方式？"],
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
  "0613": ["软件与应用开发及分析", "她看见机器不只会算数", "1833 年伦敦的一次聚会里，一个十七岁的女孩站在一台复杂机器旁，看齿轮如何试着替人计算。", "软件与应用开发及分析关注需求、逻辑、指令、界面、测试和持续改进，也关注机器能表达什么。", "一个程序真正重要的地方，是它完成了计算，还是它让机器开始执行人的想法？", "那时还没有电脑，更没有屏幕和应用商店。那台机器也没有真正完成，它更多像一个尚未抵达未来的模型。许多人看到的是更快的算术工具，她却被另一个问题吸引：如果数字可以代表数量，也可以代表音符、图案和关系，那么机器是不是不只会算账？多年后，她翻译一篇关于 Analytical Engine 的文章，忍不住在后面写下比原文还长的注释。她把机器如何一步步计算 Bernoulli numbers 写成清楚的操作表，也想象这种机器未来可能处理音乐、图形和更复杂的符号。后来，这个人叫 Ada Lovelace。她常被称为第一位计算机程序员，更谨慎地说，她留下了最早公开发表的程序式算法之一，并很早看见计算机器可能超越单纯算术。今天的软件开发已经进入手机、医疗、金融、教育、交通和 AI，但每一次写代码，仍在回应她当年看见的问题：怎样把人的意图变成机器可以可靠执行的步骤？", "一台未完成的机器旁，Ada Lovelace 看见了软件最早的影子：指令、符号和可执行的想法。", "Ada Lovelace 于 1833 年经 Mary Somerville 认识 Charles Babbage；1843 年她翻译 Menabrea 关于 Analytical Engine 的文章并加入长篇 Notes；其中 Note G 描述了计算 Bernoulli numbers 的方法，常被称为最早公开发表的计算机程序之一；Analytical Engine 当时并未建成。"],
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
    title: `When ${title.toLowerCase()} becomes visible`,
    titleZh: titleZh || `${zhFieldTitle}的小故事`,
    summary: `An everyday moment shows how ${title.toLowerCase()} works in real life.`,
    summaryZh: summaryZh || `${sceneZh || `一个普通场景让${zhFieldTitle}变得具体。`}这则故事把${zhFieldTitle}放回日常生活。`,
    scene: `Someone notices a practical situation where ${title.toLowerCase()} matters more than expected.`,
    sceneZh: sceneZh || `一个普通场景让${zhFieldTitle}变得具体。`,
    storyBody: `At first, the situation looks like a small inconvenience. As people ask what changed, who is affected, and how better choices could be tested, the field becomes concrete. ${title} helps turn the moment into a question that can be studied, designed, improved, or cared for.`,
    storyBodyZh: storyBodyZh || `一开始，旁观者只看到一个小麻烦。后来有人继续追问：谁受影响，什么条件在起作用，怎样判断改变真的有效。答案慢慢指向这个知识点：${knowledgePointZh || `${zhFieldTitle}帮助人把现实问题拆成可以理解和改进的部分。`}这时，${zhFieldTitle}不再只是一个分类名称，而是一副看见现实细节的镜头。`,
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
    storyBodyZh: "井水不是某个早晨突然消失的。它已经低声提醒了很久：水龙头越来越慢，老水管旁的石头总是潮湿，菜园需要的水也越来越多。只是没人把这些信号连起来，直到面包店的警报响起，水压却不够接上消防软管。托马想给幼苗留水，萨娜想先保证诊所，尼科摊开一张他带了好几周的维修图，但之前没有人愿意为修路停工。阿雅让大家先停止保护自己的水桶，说出他们共同站在哪个系统里。争论就在那一刻变了。问题不只是水，而是记忆、维护、优先级和信任。镇上的人一直把井当作背景，直到它变成了整个故事。",
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
    storyBodyZh: "奥托天还没亮就改了面包价格，希望镇上的人把它理解成算术。大家却把它理解成背叛。皮姆拍下新价格，贝娅要看账本，马洛追踪面粉从磨坊到推车再到面包架的路径。数字解释了一部分涨价，但不是全部。最后奥托说出了没写在牌子上的那部分：他多加了一点，因为他害怕下一批货会更糟。房间里的气氛因此改变。价格不再只是木板上的数字，而是一段被压缩的故事，里面有成本、风险、议价能力，以及害怕明天来临时自己成为被责怪的那个人。",
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
    storyBodyZh: "莉娜带来了三份教案，以为会议会很快投票结束。任带来的却是另一种证据：学生能背定义，却在面对坏掉的公交时刻表、看不懂的药品标签、班级群里扩散的谣言时停住。有人说学校不应该变成现实生活本身。萨娜轻声回答，现实生活早就走进了教学楼。莉娜擦掉议程，在白板上写下一句话：“一个孩子应该能看见什么？”房间安静下来。事实仍然重要，工具仍然重要。但问题已经移到更深处。课程不只是内容清单，它是在训练注意力：学习者会看见什么，会忽略什么，又能在世界要求他们行动之前，把什么连接起来。",
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
  const activeStory = normalizeRoute(window.location.pathname).match(/^\/stories\/([a-z0-9-]+)$/);
  if (activeStory) renderStoryDetail(activeStory[1]);
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
  const lensStoryMatch = visibleTarget.match(/^\/lens-stories\/([a-z0-9-]+)$/);
  if (categoryMatch) renderCategoryDetail(categoryMatch[1]);
  if (fieldMatch) renderFieldDetail(fieldMatch[1]);
  if (storyMatch) renderStoryDetail(storyMatch[1]);
  if (lensStoryMatch) renderLensStoryDetail(lensStoryMatch[1]);
  const activePage = categoryMatch
    ? "/categories/detail"
    : fieldMatch
      ? "/fields/detail"
      : storyMatch
        ? "/stories/detail"
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
      (linkRoute === "/stories" && visibleTarget.startsWith("/stories")) ||
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
  renderLensStoryShelf();
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
  target.innerHTML = category.groups
    .map((group) => {
      const groupStory = getLensStoryForGroup(category.code, group.code);
      const groupTitle = getLensStoryValue(groupStory, "groupTitle") || group.title;
      const groupStoryHref = groupStory ? `/lens-stories/${groupStory.id}` : `/categories/${category.code}`;
      const fields = group.fields.map(([code, title]) => {
        const fieldStory = getLensStoryForField(category.code, group.code, code);
        const href = fieldStory ? `/lens-stories/${fieldStory.id}` : `/categories/${category.code}`;
        const fieldTitle = getLensStoryFieldTitle(fieldStory || groupStory, code, title);
        return `<a class="field-chip ${fieldStory ? "has-story" : ""}" href="${href}" data-route="${href}">
          <strong class="internal-code">${escapeHtml(code)}</strong>
          <span class="field-chip-title">${escapeHtml(fieldTitle)}</span>
          ${fieldStory ? `<em>${escapeHtml(t("readLensStory"))}</em>` : ""}
        </a>`;
      }).join("");
      return `
        <section class="tree-group ${groupStory ? "has-story" : ""}">
          ${groupStory ? `
            <a class="tree-group-story-link" href="${groupStoryHref}" data-route="${groupStoryHref}">
              <span class="internal-code">${escapeHtml(group.code)}</span>
              <span>
                <strong>${escapeHtml(groupTitle)}</strong>
                <small>${escapeHtml(getLensStoryValue(groupStory, "summary"))}</small>
              </span>
              <em>${escapeHtml(t("readLensStory"))}</em>
            </a>` : `
            <h2><span class="internal-code">${escapeHtml(group.code)}</span>${escapeHtml(group.title)}</h2>`}
          <div class="field-list">${fields}</div>
        </section>`;
    })
    .join("");
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
    <figure class="lens-story-figure">
      <img src="${escapeHtml(story.image)}" alt="${escapeHtml(getLensStoryValue(story, "imageAlt"))}" loading="lazy" />
    </figure>
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
