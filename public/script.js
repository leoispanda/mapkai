const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const founderToggle = document.getElementById("founderToggle");
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const contactEmail = "hello@mapkai.com";

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

const foundationPath = [
  ["1", "See the landscape", "Start by understanding the whole knowledge map before choosing one direction."],
  ["2", "Choose a category", "Pick the category that best matches the question, goal, or field you want to explore."],
  ["3", "Open detailed fields", "Look at the groups and detailed fields to understand what belongs inside the category."],
  ["4", "Follow a path", "Use a learning path to turn selected fields into a practical order."],
  ["5", "Review and expand", "Return to the map, mark what you understand, and choose the next field to explore."],
];

const questionBank = {
  "00": {
    subject: "Generic programmes and qualifications",
    status: "sample",
    levels: {
      easy: {
        unlocks: "snow",
        prompt: "Which skill helps almost every subject because it lets you understand written instructions and basic numbers?",
        options: ["Literacy and numeracy", "Deep-sea navigation", "Film editing"],
        answer: "Literacy and numeracy",
      },
      medium: {
        unlocks: "land",
        prompt: "Why do broad basic programmes belong near the start of a knowledge map?",
        options: ["They build transferable foundations", "They replace all specialist fields", "They only matter for children"],
        answer: "They build transferable foundations",
      },
      hard: {
        unlocks: "green",
        prompt: "When a programme develops broad personal capabilities rather than a profession-specific skill, where should it usually begin?",
        options: ["Generic programmes and qualifications", "Engineering only", "Health only"],
        answer: "Generic programmes and qualifications",
      },
    },
  },
  "01": {
    subject: "Education",
    status: "sample",
    levels: {
      easy: {
        unlocks: "snow",
        prompt: "What is the main goal of education as a field?",
        options: ["Helping people learn and teach", "Selling products", "Building roads"],
        answer: "Helping people learn and teach",
      },
      medium: {
        unlocks: "land",
        prompt: "A course about how people learn, remember, and understand ideas is closest to which field?",
        options: ["Education science", "Banking", "Transport services"],
        answer: "Education science",
      },
      hard: {
        unlocks: "green",
        prompt: "Why is teacher training separated into different detailed fields?",
        options: ["Teaching context and subject focus change the required knowledge", "All teaching is identical", "It only depends on classroom size"],
        answer: "Teaching context and subject focus change the required knowledge",
      },
    },
  },
  "05": {
    subject: "Natural Sciences, Mathematics and Statistics",
    status: "sample",
    levels: {
      easy: {
        unlocks: "snow",
        prompt: "Which field studies patterns, quantities, and logical relationships?",
        options: ["Mathematics", "Retail sales", "Secretarial work"],
        answer: "Mathematics",
      },
      medium: {
        unlocks: "land",
        prompt: "Why are statistics useful in daily life?",
        options: ["They help interpret data and uncertainty", "They make facts unnecessary", "They only apply to weather"],
        answer: "They help interpret data and uncertainty",
      },
      hard: {
        unlocks: "green",
        prompt: "What connects science and statistics in research?",
        options: ["Evidence, measurement, and uncertainty", "Decoration and branding", "Office scheduling"],
        answer: "Evidence, measurement, and uncertainty",
      },
    },
  },
  "06": {
    subject: "Information and Communication Technologies",
    status: "sample",
    levels: {
      easy: {
        unlocks: "snow",
        prompt: "What does ICT mainly help people work with?",
        options: ["Digital information and communication systems", "Only paper books", "Only cooking tools"],
        answer: "Digital information and communication systems",
      },
      medium: {
        unlocks: "land",
        prompt: "Why does coding belong inside ICT?",
        options: ["It gives instructions to digital systems", "It manages bank interest rates", "It studies ancient pottery"],
        answer: "It gives instructions to digital systems",
      },
      hard: {
        unlocks: "green",
        prompt: "Which idea is central to both software and data systems?",
        options: ["Structured representation of information", "Random decoration", "Physical exercise"],
        answer: "Structured representation of information",
      },
    },
  },
};

const challengeSubjects = categories.map((category) => category.code);
let activeChallengeSubject = challengeSubjects[0];
let activeChallengeLevel = "easy";
const masteryProgress = Object.fromEntries(challengeSubjects.map((code) => [code, "ocean"]));

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
        <p class="eyebrow">Contact</p>
        <h2 id="contact-title">Need help or want to leave a message?</h2>
        <p>If you need to contact MapKAI, please leave a message here.</p>
        <div class="contact-methods">
          <a href="mailto:${contactEmail}">${contactEmail}</a>
        </div>
      </div>
      <form class="contact-form" data-contact-form>
        <label>
          <span>Your email</span>
          <input name="email" type="text" inputmode="email" placeholder="you@example.com" required />
        </label>
        <label>
          <span>Message</span>
          <textarea name="message" rows="4" placeholder="Tell us what you want to ask, suggest, or build with MapKAI." required></textarea>
        </label>
        <button class="button primary" type="submit">Prepare message</button>
        <p class="contact-status" aria-live="polite"></p>
      </form>
    </section>`;
}

function renderContactSections() {
  pages.forEach((page) => {
    if (page.querySelector(".contact-section")) return;
    page.insertAdjacentHTML("beforeend", contactSectionTemplate());
  });
}

function siteFooterTemplate() {
  return `
    <footer class="site-footer" aria-label="Copyright">
      <p>© 2026 MapKAI. All rights reserved.</p>
      <p>Unauthorized copying, reproduction, redistribution, adaptation, or commercial use of MapKAI content, structure, design, or visual materials is not permitted without prior written permission.</p>
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

  const email = form.elements.email.value.trim();
  const message = form.elements.message.value.trim();
  const subject = encodeURIComponent("MapKAI message");
  const body = encodeURIComponent(`From: ${email}\n\n${message}`);
  const status = form.querySelector(".contact-status");
  status.innerHTML = `Thanks. Your message is ready. <a href="mailto:${contactEmail}?subject=${subject}&body=${body}">Send it by email</a>.`;
  form.reset();
}

function normalizeRoute(path) {
  if (window.location.protocol === "file:") {
    return window.location.hash.replace("#", "") || "/";
  }
  return path || "/";
}

function goToRoute(route, replace = false) {
  const target = route || "/";
  const categoryMatch = target.match(/^\/categories\/(\d{2})$/);
  if (categoryMatch) renderCategoryDetail(categoryMatch[1]);
  const activePage = categoryMatch ? "/categories/detail" : target;

  pages.forEach((page) => {
    const active = page.dataset.page === activePage;
    page.classList.toggle("is-active", active);
    page.setAttribute("aria-hidden", String(!active));
  });
  routeLinks.forEach((link) => {
    const linkRoute = link.dataset.route;
    const isCurrent =
      linkRoute === target ||
      (linkRoute === "/categories" && target.startsWith("/categories")) ||
      (linkRoute === "/learning" && target.startsWith("/learning"));
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
  return `<div class="status-line"><span>${status}</span><strong>${ready}</strong></div>`;
}

function getCategory(code) {
  return categories.find((category) => category.code === code);
}

function getSubjectTitle(code) {
  return questionBank[code]?.subject || getCategory(code)?.title || "Knowledge subject";
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
        <a class="category-card" href="${href}" data-route="${href}" aria-label="Open ${category.title}">
          <span class="internal-code category-code">${category.code}</span>
          <h3>${category.title}</h3>
          ${makeStatus(category.status, category.readiness)}
          <div class="scope-count">${category.groups.length} groups · ${fieldCount} detailed fields</div>
          <ul class="scope-preview">${scopePreview}</ul>
          <span class="card-link">Open category</span>
        </a>`;
    })
    .join("");
  if (grid) grid.innerHTML = detailCards;
}

function getNextChallengeLevel(subjectCode) {
  const progress = masteryProgress[subjectCode];
  if (progress === "ocean") return "easy";
  if (progress === "snow") return "medium";
  if (progress === "land") return "hard";
  return "complete";
}

function renderChallenge() {
  const subjectsTarget = document.getElementById("challengeSubjects");
  const cardTarget = document.getElementById("challengeCard");
  if (!subjectsTarget || !cardTarget) return;

  subjectsTarget.innerHTML = challengeSubjects
    .map((code) => {
      const subjectTitle = getSubjectTitle(code);
      const progress = masteryLevels[masteryProgress[code]];
      const active = code === activeChallengeSubject ? "is-active" : "";
      return `
        <button class="subject-button ${active}" type="button" data-subject="${code}">
          <strong class="internal-code">${code}</strong>
          <span>${subjectTitle}</span>
          <em>${progress.label}</em>
        </button>`;
    })
    .join("");

  activeChallengeLevel = getNextChallengeLevel(activeChallengeSubject);
  const subject = questionBank[activeChallengeSubject];
  const progress = masteryLevels[masteryProgress[activeChallengeSubject]];
  const subjectTitle = getSubjectTitle(activeChallengeSubject);

  if (!subject) {
    cardTarget.innerHTML = `
      <p class="eyebrow">Question set coming soon</p>
      <h2>${subjectTitle}</h2>
      <p>This subject already has a place in the question database architecture. Future updates can add easy, medium, and hard questions only inside this subject code.</p>
      <div class="challenge-status">Current: ${progress.label}</div>
      <div class="founder-note internal-code">Question bank key: ${activeChallengeSubject}</div>`;
    return;
  }

  if (activeChallengeLevel === "complete") {
    cardTarget.innerHTML = `
      <p class="eyebrow">Challenge complete</p>
      <h2>${subjectTitle}</h2>
      <p>This subject is green land for now. Future updates can add more questions inside this subject database.</p>
      <div class="challenge-status is-green">${progress.label}</div>`;
    return;
  }

  const question = subject.levels[activeChallengeLevel];
  cardTarget.innerHTML = `
    <p class="eyebrow">${activeChallengeLevel} question -> ${masteryLevels[question.unlocks].label}</p>
    <h2>${subjectTitle}</h2>
    <p>${question.prompt}</p>
    <div class="answer-grid">
      ${question.options.map((option) => `<button type="button" data-answer="${option}">${option}</button>`).join("")}
    </div>
    <div class="challenge-status">Current: ${progress.label}</div>`;
}

function handleChallengeClick(event) {
  const subjectButton = event.target.closest("[data-subject]");
  if (subjectButton) {
    activeChallengeSubject = subjectButton.dataset.subject;
    renderChallenge();
    return;
  }

  const answerButton = event.target.closest("[data-answer]");
  if (!answerButton) return;
  const question = questionBank[activeChallengeSubject].levels[activeChallengeLevel];
  const cardTarget = document.getElementById("challengeCard");
  const correct = answerButton.dataset.answer === question.answer;

  if (!correct) {
    if (cardTarget) {
      cardTarget.insertAdjacentHTML("beforeend", `<p class="challenge-feedback is-wrong">Not yet. This round ends here. Try the subject again when you are ready.</p>`);
    }
    return;
  }

  masteryProgress[activeChallengeSubject] = question.unlocks;
  drawKnowledgeMap();
  renderChallenge();
  if (cardTarget) {
    cardTarget.insertAdjacentHTML("beforeend", `<p class="challenge-feedback is-correct">Correct. This subject is now ${masteryLevels[question.unlocks].label}.</p>`);
  }
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
  if (eyebrow) eyebrow.textContent = `${category.code} category scope`;
  if (title) title.textContent = category.title;
  if (copy) {
    copy.textContent = `This page shows all ${category.groups.length} groups and ${fieldCount} detailed fields in this category.`;
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
        <h2>${group.code} ${group.title}</h2>
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
        <span class="code">${field0412.code}</span>
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
  if (pathGrid) {
    pathGrid.innerHTML = pathTypes.map(([title, text]) => `<article class="module-card"><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if (timeline) {
    timeline.innerHTML = foundationPath
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
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#78c7e8");
  ocean.addColorStop(0.55, "#2f86b5");
  ocean.addColorStop(1, "#1c567a");
  ctx.fillStyle = ocean;
  roundRect(ctx, 0, 0, width, height, 34);
  ctx.fill();

  const islands = [
    { x: 180, y: 160, w: 110, h: 74, code: "00", label: "00" },
    { x: 360, y: 180, w: 130, h: 86, code: "01", label: "01" },
    { x: 610, y: 210, w: 100, h: 68, code: "06", label: "06 ICT" },
    { x: 300, y: 370, w: 118, h: 76, code: "05", label: "05 Science" },
    { x: 545, y: 425, w: 130, h: 74, code: null, label: "Learning" },
  ];
  islands.forEach(({ x, y, w, h, code, label }, index) => {
    const level = code ? masteryProgress[code] || "ocean" : "green";
    const color = code ? masteryLevels[level].color : "#7fc76f";
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((index - 2) * 0.08);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ellipseBlob(w + 32, h + 22);
    ctx.fill();
    ctx.fillStyle = color;
    ellipseBlob(w, h);
    ctx.fill();
    ctx.fillStyle = level === "snow" ? "#ffffff" : "#fff6dd";
    ctx.beginPath();
    ctx.arc(-w * 0.2, -h * 0.18, Math.min(w, h) * 0.2, 0, Math.PI * 2);
    ctx.fill();
    if (level === "green") {
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.beginPath();
      ctx.arc(w * 0.18, h * 0.05, Math.min(w, h) * 0.14, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#173026";
    ctx.font = "700 22px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, 0, 7);
    ctx.restore();
  });

  ctx.fillStyle = "rgba(255,255,255,0.75)";
  for (let i = 0; i < 60; i += 1) {
    const x = (i * 137) % width;
    const y = (i * 73) % height;
    ctx.beginPath();
    ctx.arc(x, y, (i % 3) + 1, 0, Math.PI * 2);
    ctx.fill();
  }
}

function ellipseBlob(w, h) {
  ctx.beginPath();
  ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
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
  if (event.target.closest("[data-subject], [data-answer]")) {
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

window.addEventListener("popstate", () => goToRoute(normalizeRoute(window.location.pathname), true));
window.addEventListener("hashchange", () => goToRoute(normalizeRoute(window.location.pathname), true));

renderCategories();
renderContactSections();
renderSiteFooters();
renderPassport("pathPassport", modulePassports.path);
renderField();
renderLearning();
renderChallenge();
drawKnowledgeMap();
goToRoute(normalizeRoute(window.location.pathname), true);
setFounderMode(localStorage.getItem("mapkaiFounderMode") === "true");

function setFounderMode(enabled) {
  document.body.classList.toggle("founder-mode", enabled);
  if (founderToggle) {
    founderToggle.textContent = enabled ? "Founder mode on" : "Founder mode";
    founderToggle.setAttribute("aria-pressed", String(enabled));
  }
  localStorage.setItem("mapkaiFounderMode", String(enabled));
}
