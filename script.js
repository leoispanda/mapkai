const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const founderToggle = document.getElementById("founderToggle");
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const contactEmail = "hello@mapkai.com";
const messageBoardKey = "mapkaiMessageBoard";
const visitorIdKey = "mapkaiVisitorId";
const languageKey = "mapkaiLanguage";
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
    navMap: "Map",
    navCategories: "Categories",
    navLearning: "Learning",
    homeEyebrow: "MAP knowledge with AI",
    homeTitle: "Map knowledge into paths you can actually follow.",
    homeCopy: "MapKAI helps you turn scattered knowledge into clear maps, structured categories, and guided learning paths.",
    homePrimary: "Explore the Map",
    homeLearning: "View Learning Paths",
    homeCategories: "Browse Categories",
    coreEyebrow: "Three core modules",
    coreTitle: "A simple structure for exploring knowledge.",
    mapCardTitle: "Map - See the knowledge landscape",
    mapCardCopy: "Understand the big picture before choosing what to learn.",
    mapCardLink: "Open map",
    categoriesCardTitle: "Categories - Understand each field",
    categoriesCardCopy: "Explore structured fields and see how knowledge areas connect.",
    categoriesCardLink: "Browse categories",
    learningCardTitle: "Learning - Follow a guided path",
    learningCardCopy: "Follow guided learning paths that help you move from first understanding to clearer explanation and stronger mastery.",
    learningCardLink: "View paths",
    howEyebrow: "How it works",
    howTitle: "How MapKAI works",
    howOneTitle: "See the landscape",
    howOneCopy: "Explore the full knowledge map and understand the big picture.",
    howTwoTitle: "Choose a field",
    howTwoCopy: "Dive into structured categories and see how each field connects.",
    howThreeTitle: "Follow a path",
    howThreeCopy: "Move from curiosity to guided learning with practical next steps.",
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
    goCategories: "Go to categories",
    goLearning: "Go to learning",
    challengeEyebrow: "Knowledge challenge",
    challengeTitle: "Answer questions to light up the map.",
    challengeCopy: "Answer one question at a time. The map will light up as your knowledge grows from ocean into snow mountain, land, and green land.",
    challengeHeading: "Knowledge challenge",
    challengeCompleteEyebrow: "Challenge complete",
    challengeCompleteTitle: "The current map is fully lit.",
    challengeCompleteCopy: "You answered the available questions. Future updates can add more questions inside each subject database without changing this quiz flow.",
    totalCorrect: "Total correct answers",
    correct: "Correct.",
    notYet: "Not yet.",
    correctFeedback: "This answer helped light up the map.",
    wrongFeedback: "This question is still counted, and the explanation shows the better pattern.",
    whyMatters: "Why this matters",
    previous: "Previous",
    next: "Next",
    correctInSubject: "Correct answers in this hidden subject",
    currentMapState: "Current map state",
    categoriesEyebrow: "Knowledge Classification System",
    categoriesTitle: "Eleven categories, one clear structure.",
    categoriesCopy: "Explore the knowledge structure behind MapKAI. Each category shows what the field covers and how it connects to other areas of knowledge.",
    openCategory: "Open category",
    categoryScope: "Category scope",
    categoryCopy: (groups, fields) => `This page shows ${groups} groups and ${fields} detailed fields in this category.`,
    groups: "groups",
    detailedFields: "detailed fields",
    learningEyebrow: "Customized Learning Path",
    learningTitle: "Learning paths connect fields into a usable order.",
    learningCopy: "Follow guided learning paths that help you move from first understanding to clearer explanation and stronger mastery.",
    learningBandEyebrow: "Learning paths",
    learningBandTitle: "Choose a path after choosing a field",
    learningBandCopy: "MapKAI connects categories, fields, and practical next steps as each area becomes ready.",
    browseCategories: "Browse Categories",
    contactEyebrow: "Contact",
    contactTitle: "Need help or want to leave a message?",
    contactCopy: "If you need to contact MapKAI, please leave a message here.",
    messageBoard: "Message board",
    messagePlaceholder: "Tell us what you want to ask, suggest, or build with MapKAI.",
    leaveMessage: "Leave message",
    messageSaved: "Thanks. Your message is saved on this board.",
    founderMessageBoard: "Founder message board",
    noMessages: "No messages yet.",
    footerRights: "© 2026 MapKAI. All rights reserved.",
    footerNotice: "Unauthorized copying, reproduction, redistribution, adaptation, or commercial use of MapKAI content, structure, design, or visual materials is not permitted without prior written permission.",
    viewedMany: "MapKAI has been viewed many times.",
    viewedCount: (count) => `MapKAI has been viewed #${count} times.`,
    uniqueVisitors: (count) => `Unique visitors: #${count}.`,
    thanks: "Thanks for visiting MapKAI.",
  },
  zh: {
    navMap: "地图",
    navCategories: "分类",
    navLearning: "学习路径",
    homeEyebrow: "用 AI 绘制知识地图",
    homeTitle: "把知识整理成可以跟随的路径。",
    homeCopy: "MapKAI 帮助你把零散的知识，整理成清晰的地图、分类系统和可以跟随的学习路径。",
    homePrimary: "探索地图",
    homeLearning: "查看学习路径",
    homeCategories: "浏览分类",
    coreEyebrow: "三个核心模块",
    coreTitle: "用简单结构开始探索知识。",
    mapCardTitle: "地图 - 看见知识全景",
    mapCardCopy: "先理解整体，再决定从哪里开始学习。",
    mapCardLink: "打开地图",
    categoriesCardTitle: "分类 - 理解每个领域",
    categoriesCardCopy: "查看结构化领域，并理解知识之间如何连接。",
    categoriesCardLink: "浏览分类",
    learningCardTitle: "学习 - 跟随一条路径",
    learningCardCopy: "沿着学习路径，从初步理解走向清楚解释和更熟练掌握。",
    learningCardLink: "查看路径",
    howEyebrow: "如何使用",
    howTitle: "MapKAI 如何工作",
    howOneTitle: "看见全景",
    howOneCopy: "先浏览完整的知识地图，理解大方向。",
    howTwoTitle: "选择领域",
    howTwoCopy: "进入结构化分类，看看每个领域如何连接。",
    howThreeTitle: "跟随路径",
    howThreeCopy: "把好奇心变成有步骤的学习行动。",
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
    goCategories: "去分类",
    goLearning: "去学习路径",
    challengeEyebrow: "知识挑战",
    challengeTitle: "回答问题，点亮地图。",
    challengeCopy: "一次回答一道题。随着理解加深，地图会从未探索的知识海洋，逐渐点亮为雪山、陆地和绿地。",
    challengeHeading: "知识挑战",
    challengeCompleteEyebrow: "挑战完成",
    challengeCompleteTitle: "当前地图已经全部点亮。",
    challengeCompleteCopy: "你已经回答完现有题目。以后可以继续在对应领域补充题目，而不改变这套答题流程。",
    totalCorrect: "答对总数",
    correct: "答对了。",
    notYet: "还不对。",
    correctFeedback: "这个答案帮助地图继续点亮。",
    wrongFeedback: "这道题已经记录，解释会展示更好的理解方式。",
    whyMatters: "为什么重要",
    previous: "Previous",
    next: "Next",
    correctInSubject: "当前隐藏领域答对数",
    currentMapState: "当前地图状态",
    categoriesEyebrow: "知识分类系统",
    categoriesTitle: "十一个知识领域，一套清晰结构。",
    categoriesCopy: "探索 MapKAI 背后的知识结构。每个分类都会说明它覆盖什么，以及它如何连接到其他知识领域。",
    openCategory: "打开分类",
    categoryScope: "分类范围",
    categoryCopy: (groups, fields) => `这个页面展示该分类下的 ${groups} 个组和 ${fields} 个具体领域。`,
    groups: "个组",
    detailedFields: "个具体领域",
    learningEyebrow: "定制学习路径",
    learningTitle: "学习路径把领域整理成可跟随的顺序。",
    learningCopy: "沿着学习路径，从初步理解走向清楚解释和更熟练掌握。",
    learningBandEyebrow: "学习路径",
    learningBandTitle: "选择领域后，再选择路径",
    learningBandCopy: "MapKAI 会把分类、领域和实际下一步连接起来。",
    browseCategories: "浏览分类",
    contactEyebrow: "联系",
    contactTitle: "需要帮助，或想留下想法？",
    contactCopy: "如果你想联系 MapKAI，可以在这里留言。",
    messageBoard: "留言板",
    messagePlaceholder: "告诉我们你想询问、建议或一起构建什么。",
    leaveMessage: "留言",
    messageSaved: "谢谢，你的留言已保存在留言板。",
    founderMessageBoard: "Founder 留言板",
    noMessages: "暂时还没有留言。",
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
  ["Beginner Path", "For users who need a first mental map."],
  ["Foundation Path", "For users building stable cross-field basics."],
  ["Exam Preparation Path", "For users preparing around a target syllabus."],
  ["Career-Oriented Path", "For users choosing skills around a job direction."],
  ["Weakness Repair Path", "For users filling specific gaps after questions."],
  ["Founder-Curated Path", "For opinionated routes designed by MapKAI."],
];

const pathTypesZh = [
  ["入门路径", "适合需要先建立第一张知识地图的人。"],
  ["基础路径", "适合想建立稳定跨领域基础的人。"],
  ["备考路径", "适合围绕目标范围准备的人。"],
  ["职业路径", "适合围绕工作方向选择技能的人。"],
  ["补弱路径", "适合答题后发现具体短板的人。"],
  ["Founder 精选路径", "适合由 MapKAI 主动整理的路线。"],
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
  "00": { subject: "Generic programmes and qualifications", theme: "basic life skills", prompts: ["At the supermarket, Emma compares cereal by price per kilo. What everyday superpower is she using?", "A friend learns apps, recipes, and cheaper bills but says he is not a learner. What is the hidden lesson?", "Jin writes a clear refund email for a broken washing machine. Why did writing matter?", "A calculator can split a bill, but why is understanding percentages still useful?", "Why can learning new tools fast be more valuable than knowing one tool today?", "Why are classes in forms, letters, and budgets still real education?"] },
  "01": { subject: "Education", theme: "learning and teaching", prompts: ["You forget someone's name seconds after hearing it. What trick helps most?", "A parent holds a bike seat, then lets go for longer and longer moments. What is happening?", "Sara rereads notes; Tom explains aloud from memory. Who finds weak spots faster?", "A language app reviews words right before forgetting. What is the learning trick?", "Why do weekly phishing simulations beat one long warning lecture?", "Why do examples and structure help beginners facing a blank page?"] },
  "02": { subject: "Arts and Humanities", theme: "meaning and interpretation", prompts: ["A movie villain enters with cold lighting and low music. Why do you feel nervous?", "A cafe changes its menu font and cakes feel homemade. What changed?", "A tiny blue patch in an old painting used a once-costly pigment. What does that reveal?", "Two readers find different evidence-based meanings in one story. What is the best takeaway?", "A simple chair becomes interesting when linked to postwar housing. Why?", "A documentary uses real interviews but very different music and lighting. What should viewers notice?"] },
  "03": { subject: "Social Sciences, Journalism and Information", theme: "people, groups, and information", prompts: ["A free-coffee rumor spreads before anyone checks the cafe page. What should happen first?", "One person yawns and others soon yawn too. What does this show?", "A clickbait headline works even though the story is ordinary. Why?", "A sign says most people take stairs and stair use rises. Why might that work?", "Two polls ask about parks with different wording and get different results. What is happening?", "An algorithm shows more angry posts because they get comments. What risk appears?"] },
  "04": { subject: "Business, Administration and Law", theme: "markets, rules, and organizations", prompts: ["A bakery bundle makes customers buy two croissants instead of one. What is happening?", "A shop sells a lot but costs eat the money. What was confused?", "A gym makes joining easy but cancellation hard. What concern appears?", "A great restaurant is empty because nobody knows it exists. What is the mistake?", "A vague delivery promise causes an argument. What would reduce risk?", "A call center rewards only short calls and problems return. What went wrong?"] },
  "05": { subject: "Natural Sciences, Mathematics and Statistics", theme: "evidence, measurement, and patterns", prompts: ["A metal bench feels colder than a wooden one on the same morning. Why?", "A 70% rain forecast does not rain on your street. What is the better interpretation?", "A smoothie seems to cause energy, but the person also slept nine hours. What should a careful thinker say?", "A shop has a 5-star average from only two reviews. What is the red flag?", "Factory output rises after a new machine, but someone asks about the old machine too. Why?", "A city uses one road-side sensor to judge all pollution. What is wrong?"] },
  "06": { subject: "Information and Communication Technologies", theme: "digital systems and data", prompts: ["Why are software updates not just annoying pop-ups?", "A friend uses one password everywhere. What is the risk?", "Sorting one spreadsheet column makes addresses mismatch names. What happened?", "A coffee machine pours only if it detects a cup. What coding idea is this?", "A delivery app has duplicate customer IDs and shows wrong orders. Why is this serious?", "Invoice automation copies old bad rules and approves strange invoices. What is the lesson?"] },
  "07": { subject: "Engineering, Manufacturing and Construction", theme: "building and design trade-offs", prompts: ["A cardboard tube holds weight upright but crushes sideways. What does this show?", "Why do bridges often use triangles?", "A hard phone case resists scratches but cracks when dropped. What trade-off appears?", "A chair factory divides work into repeated steps. Why might it be faster?", "A glass apartment looks beautiful but overheats in summer. What lesson appears?", "A machine part uses the strongest metal but becomes heavy and costly. What went wrong?"] },
  "08": { subject: "Agriculture, Forestry, Fisheries and Veterinary", theme: "living resources and sustainability", prompts: ["A tomato plant grows leaves but few tomatoes after lots of nitrogen. Why?", "Why wait before driving a tractor onto wet soil?", "Why can changing crops help when pests rise?", "Fishing boats catch more before others do and fish decline. What problem is this?", "Cows produce less milk during a heatwave despite feed. What hidden factor matters?", "Why might a forest manager remove some small trees?"] },
  "09": { subject: "Health and Welfare", theme: "prevention, care, and wellbeing", prompts: ["A friend brushes teeth hard and gums bleed. What is the better habit?", "Someone drinks coffee at midnight and wakes tired. What might be happening?", "A new runner goes hard daily, hurts knees, and quits. What would have been wiser?", "One mildly sick worker comes in and half the office coughs later. What idea appears?", "A patient feels better after antibiotics and wants to stop early. What is the concern?", "An elderly man misses appointments because the bus route changed. What does this reveal?"] },
  "10": { subject: "Services", theme: "experience, safety, and coordination", prompts: ["A tired hotel guest gets water, calm check-in, and clear directions. Why does it matter?", "Why put a warning sign on a wet but clean floor?", "A restaurant serves dessert before soup and guests eat at different times. What is the problem?", "Airport security slows because instructions appear only at the tray. What helps?", "A theme park sells too many fast-track passes and all lines slow. What went wrong?", "Drivers measured only by speed damage parcels and miss instructions. What is the mistake?"] }
};

const questionOptions = {
  "00": [
    ["Basic numeracy for smarter daily choices", "Professional accounting knowledge", "Brand loyalty"],
    ["Everyday life already contains learning", "People learn only in classrooms", "Learning stops after school"],
    ["Clear communication can turn frustration into action", "Longer messages always get better results", "Emotional anger is the best strategy"],
    ["Understanding helps you know what to calculate", "Calculators replace understanding", "Percentages are only useful for bankers"],
    ["Because adaptability often outlasts one specific tool", "Because software skills are worthless", "Because interviews reward vague answers"],
    ["Foundational skills can increase independence and participation", "Only university courses count as learning", "Adults cannot benefit from basic courses"]
  ],
  "01": [
    ["Repeat and use the name soon after hearing it", "Pretend you heard it clearly", "Wait until tomorrow to think about it"],
    ["Giving temporary support until independence grows", "Testing the child without any help", "Making the bike harder to ride"],
    ["Tom, because recall exposes weak spots", "Sara, because highlighting always proves mastery", "Neither, because studying cannot be checked"],
    ["Spaced repetition strengthens memory over time", "Forgetting means learning has failed completely", "Cramming once is always more efficient"],
    ["It turns abstract warnings into repeated real decisions", "It proves employees do not need rules", "It makes cybersecurity purely entertaining"],
    ["The task became supported enough to reduce mental overload", "Creativity disappeared because examples were shown", "Beginners became experts instantly"]
  ],
  "02": [
    ["The scene uses artistic signals to shape emotion", "The actor has explained the plot", "The camera is broken"],
    ["The visual style changed the meaning people felt", "The cake recipe changed automatically", "Fonts cannot influence perception"],
    ["Materials can carry social and historical meaning", "Old painters chose colors randomly", "Blue was invisible in the past"],
    ["Good stories can hold multiple evidence-based meanings", "Only one reader is allowed to be right", "Interpretation means guessing without evidence"],
    ["Its design connects to history, society, and human needs", "A chair can never be cultural", "The label makes the object more expensive"],
    ["Real material can still be framed through storytelling choices", "Documentaries are automatically neutral", "Music has no effect on judgment"]
  ],
  "03": [
    ["Check the original source before believing it", "Share it quickly before the offer ends", "Believe it if many people repeat it"],
    ["Social behavior can spread through groups", "People are never influenced by others", "Yawning is a political opinion"],
    ["It used curiosity to attract attention", "It gave a complete balanced summary", "It removed emotion from the story"],
    ["People often respond to social norms", "People dislike short messages", "Signs physically force people to act"],
    ["Question wording can shape public opinion data", "People have no opinions about parks", "Polls always measure reality perfectly"],
    ["The platform may amplify outrage because it drives engagement", "The platform will automatically improve public debate", "Angry posts will disappear because people ignore them"]
  ],
  "04": [
    ["A bundle changes the perceived deal", "The croissants became legally different", "Customers forgot how hunger works"],
    ["Revenue is not the same as profit", "Profit appears before costs", "Sales make expenses disappear"],
    ["The company may be using friction to keep customers", "The company is improving customer freedom", "The contract becomes invisible"],
    ["Quality alone does not create awareness", "Good products should be kept secret", "Marketing only matters for bad products"],
    ["A clear written agreement on delivery terms", "More emojis in the phone call", "Avoiding any record of the deal"],
    ["The incentive encouraged the wrong behavior", "Employees became less human overnight", "Customers dislike fast answers in every case"]
  ],
  "05": [
    ["Metal pulls heat from your body faster", "Metal is always at a lower temperature", "Wood secretly produces warmth"],
    ["Probability describes uncertainty, not a personal guarantee", "The app promised rain on every person", "A 70% chance means rain must last 70% of the day"],
    ["One experience does not prove cause and effect", "The smoothie must be magic", "Sleep can never affect energy"],
    ["The sample size is too small to trust much", "Five stars is mathematically impossible", "Averages never describe ratings"],
    ["A comparison group helps separate the machine effect from other changes", "Scientists dislike useful machines", "Output numbers are always fake"],
    ["One location may not represent the whole city", "Sensors cannot measure air", "Busy roads always represent parks"]
  ],
  "06": [
    ["They can fix security holes and software problems", "They only change the wallpaper", "They make hackers more comfortable"],
    ["One stolen password can unlock many accounts", "Passwords become heavier when reused", "Websites refuse all repeated letters"],
    ["Only one column was sorted instead of the whole table", "The spreadsheet became sentient", "Alphabetical order destroys all data"],
    ["A condition-based instruction", "A random painting technique", "A broken database"],
    ["Bad data structure can break the system’s logic", "Databases are only decoration", "Duplicate IDs make delivery faster"],
    ["Automation can scale both good rules and bad rules", "Automation removes the need for human judgment forever", "Old processes become perfect once digitized"]
  ],
  "07": [
    ["Shape and direction affect strength", "Cardboard secretly turns into steel", "Heavy books become lighter when vertical"],
    ["Triangles help keep structures stable under force", "Triangles are legally required on bridges", "Rectangles cannot be drawn by engineers"],
    ["Hardness and toughness are not the same thing", "Soft materials always fail", "Scratches are more dangerous than drops"],
    ["Specialized steps can reduce switching and improve flow", "More workers automatically fix all problems", "Dividing work makes quality irrelevant"],
    ["Design must consider heat, light, and real operating conditions", "Beautiful buildings cannot follow physics", "Glass always makes buildings cooler"],
    ["The design optimized one feature while ignoring system trade-offs", "Strong materials are never useful", "Repairability has no business value"]
  ],
  "08": [
    ["Too much leaf growth can come at the cost of fruit", "Nitrogen makes plants forget summer", "Tomatoes grow only in tiny pots"],
    ["Wet soil can be compacted and damage roots later", "Tractors dissolve in wet weather", "Rain makes seeds allergic to sunlight"],
    ["Crop rotation can interrupt pests and support soil balance", "Plants become bored by familiar fields", "Different crops cancel the seasons"],
    ["Shared resources can be overused when everyone acts alone", "Fish dislike teamwork meetings", "More boats always create more fish"],
    ["Heat stress can reduce animal productivity and welfare", "Cows stop needing water in summer", "Milk production depends only on feed quantity"],
    ["Thinning can reduce competition and improve forest health", "Forests grow best when every tree is crowded", "Small trees are never useful to ecosystems"]
  ],
  "09": [
    ["Brush gently and regularly with proper technique", "Brush harder until the gums become stronger", "Skip brushing when gums bleed"],
    ["Caffeine may reduce sleep quality even if you fall asleep", "Coffee becomes water after midnight", "Feeling tired proves sleep was perfect"],
    ["Build up gradually and allow recovery", "Start with the hardest routine possible", "Ignore pain because motivation fixes injuries"],
    ["Individual choices can create group-level health effects", "Illness only matters when symptoms are dramatic", "Offices protect people from viruses automatically"],
    ["Stopping early can leave bacteria behind and contribute to resistance", "Feeling better means every bacterium is gone", "Antibiotics work better when taken randomly"],
    ["Health is shaped by social and practical conditions", "Medical care depends only on willpower", "Appointments are unrelated to transport"]
  ],
  "10": [
    ["Service experience is shaped by small moments of care", "Only the room size matters in hospitality", "Guests never remember how they are treated"],
    ["A clean floor can still be a safety risk when wet", "Signs are only for decoration", "Wet floors become safer when ignored"],
    ["Coordination and timing are part of service quality", "Good taste cancels every service issue", "Customers prefer chaos when food is expensive"],
    ["Give clear preparation instructions before the bottleneck", "Make the trays smaller", "Hide the rules until the last second"],
    ["The service added priority access without managing total capacity", "Fast-track passes create unlimited ride capacity", "Lines disappear when prices increase"],
    ["The metric rewards speed while ignoring service quality and safety", "Customers dislike receiving parcels quickly", "Drivers cannot follow any measurement system"]
  ]
};

const zhSubjectQuestionSeeds = {
  "00": { prompts: ["在超市里，Emma 按每公斤价格比较麦片。她用到的日常能力是什么？", "朋友学会了用 App、看菜谱、省账单，却说自己没有在学习。这里藏着什么？", "Jin 给坏掉的洗衣机写了一封清楚的退款邮件。为什么写清楚很重要？", "计算器可以帮你分账，为什么理解百分比仍然有用？", "为什么快速学会新工具，有时比只会一个工具更重要？", "为什么表格、信件和预算这类基础课，也是真正的教育？"] },
  "01": { prompts: ["刚听完别人的名字几秒就忘了。什么方法最有帮助？", "家长先扶着自行车座，再慢慢放手更久。这是在做什么？", "Sara 反复看笔记；Tom 合上笔记讲给自己听。谁更快发现薄弱点？", "语言 App 会在你快忘之前复习单词。它用了什么学习方法？", "为什么每周一次钓鱼邮件模拟，比一场很长的安全讲座更有效？", "新手面对空白页面时，为什么例子和结构会帮上忙？"] },
  "02": { prompts: ["电影反派出场时，冷色灯光和低沉音乐让你紧张。为什么？", "咖啡馆换了菜单字体，蛋糕忽然显得更像手作。改变了什么？", "一幅古画里一小块蓝色用了当年很贵的颜料。这说明什么？", "两位读者从同一个故事里读出不同但有证据的意思。最好怎么看？", "一把普通椅子和战后住房联系起来后，为什么变得有意思？", "纪录片用了真实采访，却配了不同音乐和灯光。观众应该注意什么？"] },
  "03": { prompts: ["免费咖啡的传言还没人核实就传开了。第一步应该做什么？", "一个人打哈欠，旁边的人也跟着打哈欠。这说明什么？", "一个标题很吸引人，但内容很普通。它为什么有效？", "告示说多数人会走楼梯，后来走楼梯的人变多了。为什么可能有效？", "两个关于公园的调查，只是问法不同，结果就不同。发生了什么？", "平台因为愤怒内容评论多，就推更多愤怒帖子。风险是什么？"] },
  "04": { prompts: ["面包店的套餐让顾客从买一个可颂变成买两个。发生了什么？", "小店卖得很多，但成本把钱吃掉了。混淆了什么？", "健身房加入很容易，取消却很难。这里有什么问题？", "餐厅很好吃，却没人知道。错在哪里？", "模糊的交付承诺引发争吵。什么能降低风险？", "客服中心只奖励通话短，问题却反复回来。哪里出错了？"] },
  "05": { prompts: ["同一个早晨，金属长椅摸起来比木椅冷。为什么？", "天气预报说 70% 会下雨，你家门口却没下。更好的理解是什么？", "喝了果昔后很有精神，但那个人也睡了九小时。谨慎的人会怎么说？", "一家店只有两条评价，却是五星平均。红旗在哪里？", "换新机器后产量上升，有人还想看旧机器数据。为什么？", "城市只用路边一个传感器判断全部污染。问题是什么？"] },
  "06": { prompts: ["为什么软件更新不只是烦人的弹窗？", "朋友所有网站都用同一个密码。风险是什么？", "表格只排序了一列，地址和姓名对不上了。发生了什么？", "咖啡机只有检测到杯子才出咖啡。这是哪种编程想法？", "外卖 App 有重复顾客 ID，结果显示错订单。为什么严重？", "发票自动化把旧的坏规则也复制进去，批准了奇怪发票。教训是什么？"] },
  "07": { prompts: ["纸筒竖着能承重，横着却容易压扁。这说明什么？", "为什么桥梁常常使用三角形结构？", "手机壳很硬，不容易刮花，但一摔就裂。这里有什么取舍？", "椅子工厂把工作拆成重复步骤。为什么可能更快？", "玻璃公寓很好看，但夏天过热。说明了什么？", "机器零件用了最强金属，却又重又贵。问题在哪里？"] },
  "08": { prompts: ["番茄施太多氮肥后叶子很多，果实很少。为什么？", "为什么湿土上不能急着开拖拉机？", "害虫变多时，为什么换种作物可能有帮助？", "渔船都抢着多捕一点，最后鱼变少了。这是什么问题？", "热浪中奶牛吃得不少，产奶却下降。隐藏因素是什么？", "森林管理者为什么会移除一些小树？"] },
  "09": { prompts: ["朋友刷牙很用力，牙龈出血。更好的习惯是什么？", "有人半夜喝咖啡，第二天仍然很累。可能发生了什么？", "新跑者每天猛练，膝盖受伤后放弃。更明智的做法是什么？", "一个轻微生病的人去上班，后来半个办公室都咳嗽。这说明什么？", "病人吃抗生素后感觉好了，想提前停药。担心点是什么？", "一位老人因为公交线路改变而错过复诊。这揭示了什么？"] },
  "10": { prompts: ["疲惫的酒店客人拿到水、平静入住和清楚指引。为什么这重要？", "地板很干净但湿了，为什么还要放警示牌？", "餐厅先上甜点再上汤，客人吃饭时间乱了。问题是什么？", "机场安检到托盘前才显示规则，队伍变慢。什么能帮忙？", "主题公园卖了太多快速通行票，所有队伍都变慢。哪里错了？", "司机只按速度考核，结果包裹受损、说明被忽略。问题是什么？"] }
};

const zhQuestionOptions = {
  "00": [
    ["用基础数字能力做更聪明的日常选择", "专业会计知识", "品牌忠诚"],
    ["日常生活本身也包含学习", "人只会在教室里学习", "毕业后学习就停止"],
    ["清楚表达能把不满变成行动", "信息越长效果越好", "愤怒才是最佳策略"],
    ["理解能帮你知道该算什么", "计算器可以取代理解", "百分比只对银行家有用"],
    ["适应能力常常比某个工具更持久", "软件技能没有价值", "面试喜欢模糊回答"],
    ["基础能力能提升独立性和参与感", "只有大学课程才算学习", "成年人学基础课没用"]
  ],
  "01": [
    ["听到后尽快重复并使用这个名字", "假装自己听清了", "等到明天再想"],
    ["先给临时支持，再让独立能力长出来", "完全不帮忙地测试孩子", "故意让车更难骑"],
    ["Tom，因为回忆会暴露薄弱点", "Sara，因为划重点就等于掌握", "都不是，因为学习无法检查"],
    ["间隔重复能逐步加强记忆", "遗忘说明学习完全失败", "一次性死记永远更高效"],
    ["它把抽象提醒变成反复真实选择", "它证明员工不需要规则", "它让网络安全只剩娱乐"],
    ["任务得到了足够支撑，脑子没那么 overload", "看到例子会让创意消失", "新手立刻变成专家"]
  ],
  "02": [
    ["画面用艺术信号影响情绪", "演员已经解释了剧情", "摄像机坏了"],
    ["视觉风格改变了人们感受到的意义", "蛋糕配方自动改变了", "字体不会影响感受"],
    ["材料也能带有社会和历史意义", "老画家都是随便选颜色", "过去的人看不见蓝色"],
    ["好故事可以容纳多个有证据的理解", "只能有一个读者是对的", "解读就是没有证据地猜"],
    ["它的设计连接了历史、社会和人的需要", "椅子不可能有文化意义", "标签让椅子变贵"],
    ["真实材料也会被叙事方式重新组织", "纪录片一定完全中立", "音乐不会影响判断"]
  ],
  "03": [
    ["先核对原始来源", "赶紧分享，别错过", "很多人说就相信"],
    ["社会行为会在群体中传播", "人从不会受别人影响", "打哈欠是一种政治观点"],
    ["它利用好奇心吸引注意", "它给了完整平衡的总结", "它去掉了故事里的情绪"],
    ["人常会回应社会规范", "人不喜欢短句", "告示会物理强迫人行动"],
    ["问题措辞会影响民意数据", "人们对公园没有观点", "民调永远完美反映现实"],
    ["平台可能因为互动而放大愤怒", "平台会自动改善公共讨论", "愤怒帖子会因为没人理而消失"]
  ],
  "04": [
    ["套餐改变了人们对划算的感觉", "可颂在法律上变了", "顾客忘了饥饿是什么"],
    ["收入不等于利润", "利润会在成本前出现", "销售会让支出消失"],
    ["公司可能在用麻烦留住顾客", "公司在提升顾客自由", "合同会变透明"],
    ["质量本身不会自动带来认知", "好产品应该保持神秘", "营销只对坏产品有用"],
    ["清楚写下交付条件", "电话里多发几个表情", "不要留下任何记录"],
    ["激励鼓励了错误行为", "员工一夜之间不近人情", "顾客永远讨厌快速回答"]
  ],
  "05": [
    ["金属更快带走你身体的热量", "金属一定温度更低", "木头偷偷发热"],
    ["概率描述不确定性，不是个人保证", "App 承诺每个人都会淋雨", "70% 表示一天会下 70% 的雨"],
    ["一次经历不能证明因果关系", "果昔一定有魔法", "睡眠永远不会影响精力"],
    ["样本太小，不太可靠", "五星在数学上不可能", "平均数从不描述评价"],
    ["对照能帮助分辨机器效果和其他因素", "科学家不喜欢有用机器", "产量数字一定是假的"],
    ["一个地点不一定代表全城", "传感器不能测空气", "繁忙道路永远代表公园"]
  ],
  "06": [
    ["它们能修补安全漏洞和软件问题", "它们只会换壁纸", "它们让黑客更舒服"],
    ["一个被盗密码可能打开很多账号", "密码重复会变重", "网站拒绝所有重复字母"],
    ["只排序了一列，而不是整张表", "表格产生了自我意识", "字母顺序会毁掉所有数据"],
    ["基于条件的指令", "随机绘画技巧", "坏掉的数据库"],
    ["糟糕的数据结构会破坏系统逻辑", "数据库只是装饰", "重复 ID 会让配送更快"],
    ["自动化会同时放大好规则和坏规则", "自动化让人类判断永远不需要", "旧流程数字化后自动完美"]
  ],
  "07": [
    ["形状和受力方向会影响强度", "纸板偷偷变成钢", "书竖起来会变轻"],
    ["三角形能帮助结构在受力下稳定", "桥梁法律规定必须用三角形", "工程师不能画矩形"],
    ["硬度和韧性不是一回事", "软材料一定失败", "刮痕比摔落更危险"],
    ["专门化步骤能减少切换、提升流动", "人越多一定解决所有问题", "分工会让质量不重要"],
    ["设计要考虑热、光和真实使用条件", "漂亮建筑不能遵守物理", "玻璃一定让建筑更凉快"],
    ["设计只优化一个特性，却忽略系统取舍", "强材料永远没用", "可维修性没有商业价值"]
  ],
  "08": [
    ["叶子长太多可能牺牲结果", "氮肥让植物忘记夏天", "番茄只能长在小盆里"],
    ["湿土容易被压实，之后伤根", "拖拉机会在雨里融化", "雨水让种子对阳光过敏"],
    ["轮作能打断害虫循环并支持土壤平衡", "植物会厌倦熟悉的田地", "不同作物会抵消季节"],
    ["共享资源可能被每个人单独行动而过度使用", "鱼不喜欢开团队会议", "船越多鱼越多"],
    ["热应激会降低动物产出和福利", "牛夏天不需要水", "产奶只取决于饲料多少"],
    ["间伐能减少竞争、改善森林健康", "森林越挤长得越好", "小树对生态系统没用"]
  ],
  "09": [
    ["用正确方法轻柔、规律地刷", "越用力刷牙龈越强", "牙龈出血就先不刷"],
    ["咖啡因可能降低睡眠质量，即使你睡着了", "咖啡半夜会变成水", "觉得累证明睡得完美"],
    ["循序渐进，并留出恢复时间", "一开始就练最难的", "疼痛可以靠意志力解决"],
    ["个人选择会产生群体层面的健康影响", "只有症状严重才算问题", "办公室会自动保护人不生病"],
    ["提前停止可能留下细菌并增加耐药风险", "感觉好就说明细菌全没了", "抗生素随便吃效果更好"],
    ["健康也受社会和现实条件影响", "医疗只取决于意志力", "预约和交通无关"]
  ],
  "10": [
    ["服务体验由很多小的照顾瞬间组成", "酒店只看房间大小", "客人不会记得别人怎么对待他"],
    ["干净的地板湿了仍有安全风险", "告示牌只是装饰", "湿地板没人管会更安全"],
    ["协调和时间安排也是服务质量的一部分", "味道好能抵消所有服务问题", "食物越贵客人越喜欢混乱"],
    ["在瓶颈前给出清楚准备说明", "把托盘做小一点", "最后一秒才告诉规则"],
    ["服务增加了优先通道，却没有管理总容量", "快速票会创造无限容量", "涨价后队伍会消失"],
    ["指标只奖励速度，忽略服务质量和安全", "顾客不喜欢快速收到包裹", "司机无法遵守任何衡量标准"]
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
      explanation: answer + ". This answer turns the everyday scene into a practical knowledge pattern. Powered by MapKAI - map your knowledge with AI.",
    },
    zh: {
      question: zhPrompt,
      options: optionOrder.map((optionIndex) => zhOptionSet[optionIndex]),
      answer: zhAnswer,
      explanation: zhAnswer + "。这个答案把日常场景变成了一个可以理解的知识模式。Powered by MapKAI - map your knowledge with AI.",
    },
  };
}

const questionBank = Object.fromEntries(Object.entries(subjectQuestionSeeds).map(([code, seed]) => {
  const difficulties = ["easy", "easy", "medium", "medium", "hard", "hard"];
  const unlocks = ["snow", "snow", "land", "land", "green", "green"];
  return [code, {
    subject: seed.subject,
    status: "draft",
    unlockRule: { snow: 2, land: 4, green: 6 },
    theme: seed.theme,
    questions: seed.prompts.map((prompt, index) => makeQuestion(code, prompt, difficulties[index], unlocks[index], index))
  }];
}));

const challengeSubjects = categories.map((category) => category.code);
const challengeState = Object.fromEntries(challengeSubjects.map((code) => [code, {
  correct: 0,
  answered: [],
}]));
const masteryProgress = Object.fromEntries(challengeSubjects.map((code) => [code, "ocean"]));
let activeChallengeSubject = challengeSubjects[0];
let activeChallengeQuestion = null;
let currentAnsweredQuestion = null;
let challengeHistory = [];
let challengeReviewIndex = null;

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
        <div class="contact-methods">
          <a href="mailto:${contactEmail}">${contactEmail}</a>
        </div>
      </div>
      <form class="contact-form" data-contact-form>
        <label>
          <span>${t("messageBoard")}</span>
          <textarea name="message" rows="4" placeholder="${t("messagePlaceholder")}" required></textarea>
        </label>
        <button class="button primary" type="submit">${t("leaveMessage")}</button>
        <p class="contact-status" aria-live="polite"></p>
      </form>
      <div class="message-board founder-only" data-message-board></div>
    </section>`;
}

function renderContactSections() {
  pages.forEach((page) => {
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
    </footer>`;
}

function renderSiteFooters() {
  pages.forEach((page) => {
    if (page.querySelector(".site-footer")) return;
    page.insertAdjacentHTML("beforeend", siteFooterTemplate());
  });
}

function handleContactSubmit(event) {
  const form = event.target.closest("[data-contact-form]");
  if (!form) return;
  event.preventDefault();

  const message = form.elements.message.value.trim();
  const status = form.querySelector(".contact-status");
  if (!message) return;
  const entries = getMessageBoardEntries();
  entries.unshift({
    id: Date.now().toString(36),
    message,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem(messageBoardKey, JSON.stringify(entries.slice(0, 30)));
  status.textContent = t("messageSaved");
  form.reset();
  renderMessageBoards();
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
  const boards = Array.from(document.querySelectorAll("[data-message-board]"));
  if (!boards.length) return;
  const entries = getMessageBoardEntries();
  boards.forEach((board) => {
    board.innerHTML = `
      <h3>${t("founderMessageBoard")}</h3>
      ${entries.length ? `
        <ul>
          ${entries.map((entry) => `
            <li>
              <time>${formatBoardTime(entry.createdAt)}</time>
              <p>${escapeHtml(entry.message)}</p>
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
  setText('.nav-links a[data-route="/map"]', t("navMap"));
  setText('.nav-links a[data-route="/categories"]', t("navCategories"));
  setText('.nav-links a[data-route="/learning"]', t("navLearning"));

  setText(".home-page .hero .eyebrow", t("homeEyebrow"));
  setText(".home-page .hero h1", t("homeTitle"));
  setText(".home-page .hero-copy", t("homeCopy"));
  setAllText(".home-page .hero-actions .button", [t("homePrimary"), t("homeLearning"), t("homeCategories")]);

  setText(".module-strip .section-heading .eyebrow", t("coreEyebrow"));
  setText("#core-modules-title", t("coreTitle"));
  setAllText(".module-strip .module-card h3", [t("mapCardTitle"), t("categoriesCardTitle"), t("learningCardTitle")]);
  setAllText(".module-strip .module-card p", [t("mapCardCopy"), t("categoriesCardCopy"), t("learningCardCopy")]);
  setAllText(".module-strip .module-card a", [t("mapCardLink"), t("categoriesCardLink"), t("learningCardLink")]);

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
  setText(".home-page > .preview-band .button", t("browseCategories"));

  setText("#why-title", t("whyTitle"));
  setText('[aria-labelledby="why-title"] .eyebrow', t("whyEyebrow"));
  setAllText(".why-copy > p", [t("whyP1"), t("whyP2"), t("whyP3"), t("whyP4")]);
  setAllText(".idea-grid span", [t("whyMap"), t("whyK"), t("whyAI")]);

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
  setText(".learning-page .preview-band .button", t("browseCategories"));

  document.querySelectorAll(".contact-section").forEach((section) => {
    section.querySelector(".eyebrow").textContent = t("contactEyebrow");
    section.querySelector("h2").textContent = t("contactTitle");
    section.querySelector("div > p:not(.eyebrow)").textContent = t("contactCopy");
    section.querySelector("label span").textContent = t("messageBoard");
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
  renderVisitStats();
  renderChallenge();
}

function normalizeRoute(path) {
  if (window.location.protocol === "file:") {
    return window.location.hash.replace("#", "") || "/";
  }
  return path || "/";
}

function goToRoute(route, replace = false) {
  const target = route || "/";
  const founderRoute = target === "/leoyangandxinli";
  const visibleTarget = founderRoute ? "/" : target;
  if (founderRoute) setFounderMode(true);
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
      (linkRoute === "/categories" && visibleTarget.startsWith("/categories")) ||
      (linkRoute === "/learning" && visibleTarget.startsWith("/learning"));
    link.classList.toggle("is-current", isCurrent);
  });

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

function getMasteryLabel(level) {
  return masteryLabels[currentLanguage]?.[level] || masteryLabels.en[level] || level;
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

function getNextAvailableChallengeSubject() {
  return challengeSubjects.find((code) => questionBank[code] && !isSubjectComplete(code)) || null;
}

function getAvailableChallengeQuestions(excludedSubjectCode) {
  const allQuestions = challengeSubjects.flatMap((subjectCode) => {
    const subject = questionBank[subjectCode];
    const state = challengeState[subjectCode];
    if (!subject || !state) return [];
    return subject.questions
      .filter((question) => !state.answered.includes(question.id))
      .map((question) => ({ subjectCode, question }));
  });
  const rotatedQuestions = allQuestions.filter((item) => item.subjectCode !== excludedSubjectCode);
  return rotatedQuestions.length ? rotatedQuestions : allQuestions;
}

function setRandomChallengeQuestion(excludedSubjectCode) {
  const availableQuestions = getAvailableChallengeQuestions(excludedSubjectCode);
  if (!availableQuestions.length) {
    activeChallengeQuestion = null;
    return null;
  }
  const nextItem = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  activeChallengeSubject = nextItem.subjectCode;
  activeChallengeQuestion = nextItem.question;
  return nextItem;
}

function moveToNextChallengeQuestion() {
  const previousSubject = activeChallengeSubject;
  currentAnsweredQuestion = null;
  challengeReviewIndex = null;
  setRandomChallengeQuestion(previousSubject);
}

function getTotalCorrectAnswers() {
  return Object.values(challengeState).reduce((total, state) => total + state.correct, 0);
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

  if (challengeReviewIndex !== null) {
    currentAnsweredQuestion = challengeHistory[challengeReviewIndex] || null;
  }

  if (currentAnsweredQuestion) {
    activeChallengeSubject = currentAnsweredQuestion.subjectCode;
    activeChallengeQuestion = currentAnsweredQuestion.question;
  } else if (!activeChallengeQuestion || challengeState[activeChallengeSubject]?.answered.includes(activeChallengeQuestion.id)) {
    setRandomChallengeQuestion(activeChallengeSubject);
    currentAnsweredQuestion = null;
  }

  const subject = questionBank[activeChallengeSubject];
  const state = challengeState[activeChallengeSubject];
  const question = activeChallengeQuestion;
  const questionContent = getQuestionContent(question);
  const progress = masteryLevels[getMasteryFromCorrect(activeChallengeSubject)];
  const subjectTitle = getSubjectTitle(activeChallengeSubject);

  if (!subject || !state || !question) {
    cardTarget.innerHTML = `
      <p class="eyebrow">${t("challengeCompleteEyebrow")}</p>
      <h2>${t("challengeCompleteTitle")}</h2>
      <p>${t("challengeCompleteCopy")}</p>
      <div class="challenge-status is-green">${t("totalCorrect")}: ${getTotalCorrectAnswers()}</div>`;
    return;
  }

  const isAnswered = currentAnsweredQuestion?.question.id === question.id;
  const hasPreviousReview = challengeReviewIndex !== null && challengeReviewIndex > 0;
  const hasNextReview = challengeReviewIndex !== null && challengeReviewIndex < challengeHistory.length - 1;
  const reviewControls = isAnswered ? `
    <div class="challenge-nav">
      <button class="button secondary" type="button" data-review-direction="previous" ${hasPreviousReview ? "" : "disabled"}>${t("previous")}</button>
      <button class="button primary" type="button" data-review-direction="next">${t("next")}</button>
    </div>` : "";
  const feedback = isAnswered ? `
    <p class="challenge-feedback ${currentAnsweredQuestion.correct ? "is-correct" : "is-wrong"}">
      ${currentAnsweredQuestion.correct ? t("correct") : t("notYet")} ${currentAnsweredQuestion.correct ? t("correctFeedback") : t("wrongFeedback")}
    </p>
    ${currentAnsweredQuestion.correct ? "" : `<article class="answer-explanation">
      <h3>${t("whyMatters")}</h3>
      <p>${questionContent.explanation}</p>
    </article>`}
    ${reviewControls}` : "";

  cardTarget.innerHTML = `
    <p class="eyebrow">${question.difficulty} question -> ${getMasteryLabel(question.unlocksToward)}</p>
    <h2>${t("challengeHeading")}</h2>
    <p>${questionContent.question}</p>
    <div class="answer-grid">
      ${questionContent.options.map((option, displayIndex) => {
        const optionKey = String(question.optionOrder[displayIndex]);
        const selected = isAnswered && optionKey === currentAnsweredQuestion.selectedKey;
        const correct = isAnswered && optionKey === "0";
        const stateClass = correct ? " is-correct" : selected ? " is-wrong" : "";
        return `<button type="button" data-answer-key="${optionKey}" class="${stateClass.trim()}" ${isAnswered ? "disabled" : ""}>${option}</button>`;
      }).join("")}
    </div>
    <div class="challenge-status">${t("correctInSubject")}: ${state.correct} / ${subject.questions.length} · ${t("currentMapState")}: ${getMasteryLabel(getMasteryFromCorrect(activeChallengeSubject))}</div>
    <div class="founder-note internal-code">Source: ${activeChallengeSubject} · ${subjectTitle}</div>
    ${feedback}`;
}

function handleChallengeClick(event) {
  const reviewButton = event.target.closest("[data-review-direction]");
  if (reviewButton) {
    const direction = reviewButton.dataset.reviewDirection;
    if (direction === "previous" && challengeReviewIndex !== null && challengeReviewIndex > 0) {
      challengeReviewIndex -= 1;
    } else if (direction === "next" && challengeReviewIndex !== null && challengeReviewIndex < challengeHistory.length - 1) {
      challengeReviewIndex += 1;
    } else if (direction === "next") {
      moveToNextChallengeQuestion();
    }
    renderChallenge();
    drawKnowledgeMap();
    return;
  }

  const answerButton = event.target.closest("[data-answer-key]");
  if (!answerButton || currentAnsweredQuestion) return;
  const question = activeChallengeQuestion;
  const state = challengeState[activeChallengeSubject];
  if (!question || !state) return;

  const selectedKey = answerButton.dataset.answerKey;
  const correct = selectedKey === "0";
  state.answered.push(question.id);
  if (correct) state.correct += 1;
  syncMasteryProgress(activeChallengeSubject);
  const answeredQuestion = { subjectCode: activeChallengeSubject, question, selectedKey, correct };
  challengeHistory.push(answeredQuestion);
  drawKnowledgeMap();
  if (correct) {
    moveToNextChallengeQuestion();
  } else {
    challengeReviewIndex = challengeHistory.length - 1;
    currentAnsweredQuestion = answeredQuestion;
  }
  renderChallenge();
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
  if (event.target.closest("[data-answer-key], [data-review-direction]")) {
    handleChallengeClick(event);
    return;
  }
  const link = event.target.closest("[data-route]");
  if (!link) return;
  event.preventDefault();
  goToRoute(link.dataset.route);
});
document.addEventListener("submit", handleContactSubmit);
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
drawKnowledgeMap();
applyLanguage();
const initialRoute = normalizeRoute(window.location.pathname);
goToRoute(initialRoute, true);
const founderQuery = new URLSearchParams(window.location.search).get("founder") === "1";
setFounderMode(founderQuery || initialRoute === "/leoyangandxinli" || localStorage.getItem("mapkaiFounderMode") === "true");

function setFounderMode(enabled) {
  document.body.classList.toggle("founder-mode", enabled);
  if (founderToggle) {
    founderToggle.textContent = enabled ? "Founder mode on" : "Founder mode";
    founderToggle.setAttribute("aria-pressed", String(enabled));
  }
  localStorage.setItem("mapkaiFounderMode", String(enabled));
  renderMessageBoards();
  drawKnowledgeMap();
  renderChallenge();
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
