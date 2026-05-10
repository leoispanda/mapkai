const pages = Array.from(document.querySelectorAll("[data-page]"));
const routeLinks = Array.from(document.querySelectorAll("[data-route]"));
const canvas = document.getElementById("knowledgeCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const readiness = {
  mapOnly: "Map only",
  classified: "Classified",
  pathReady: "Path ready",
  quizReady: "Quiz ready",
  validated: "Validated",
};

const categories = [
  ["00", "Generic programmes and qualifications", "通用课程与资格", "Not started", readiness.mapOnly],
  ["01", "Education", "教育", "Draft", readiness.classified],
  ["02", "Arts and Humanities", "艺术与人文", "Draft", readiness.classified],
  ["03", "Social Sciences, Journalism and Information", "社会科学、新闻与信息", "Draft", readiness.classified],
  ["04", "Business, Administration and Law", "商业、管理与法律", "Pilot", readiness.pathReady],
  ["05", "Natural Sciences, Mathematics and Statistics", "自然科学、数学与统计", "Draft", readiness.classified],
  ["06", "Information and Communication Technologies", "信息与通信技术", "Draft", readiness.classified],
  ["07", "Engineering, Manufacturing and Construction", "工程、制造与建筑", "Draft", readiness.classified],
  ["08", "Agriculture, Forestry, Fisheries and Veterinary", "农业、林业、渔业与兽医", "Not started", readiness.mapOnly],
  ["09", "Health and Welfare", "健康与福利", "Draft", readiness.classified],
  ["10", "Services", "服务", "Not started", readiness.mapOnly],
];

const modulePassports = {
  home: {
    name: "Home",
    route: "/",
    purpose: "Global entrance for MapKAI.",
    userValue: "Know what MapKAI is, what to do now, and why to return.",
    founderValue: "Keeps the front door simple while modules expand separately.",
    status: "Pilot",
    relatedModules: "Map, Categories, Learning",
    nextAction: "Measure whether visitors click into Map, Categories, or Learning.",
    doNotTouch: "Do not add account, dashboard, community, or public PDC here.",
  },
  category04: {
    name: "04 Business, Administration and Law",
    route: "/categories/04",
    purpose: "Pilot the classification structure before expanding all categories.",
    userValue: "Understand the business knowledge backbone and where finance fits.",
    founderValue: "Provides a reusable template for the other ten categories.",
    status: "Pilot",
    relatedModules: "0412 field, Business Foundation Path",
    nextAction: "Review whether 0412 is clear enough before adding more detailed field pages.",
    doNotTouch: "Do not complete all categories during this module update.",
  },
  path: {
    name: "Business Foundation Path",
    route: "/learning/business-foundation",
    purpose: "Connect business fields into a beginner-friendly learning order.",
    userValue: "Understand why each field comes next.",
    founderValue: "Tests a semi-manual learning path without building an algorithm.",
    status: "Pilot",
    relatedModules: "04, 0411, 0412, 0413, 0414, 0421",
    nextAction: "Add five basic questions only after the path order is validated.",
    doNotTouch: "Do not build a full question bank or recommendation engine here.",
  },
};

const businessTree = [
  {
    code: "041",
    title: "Business and administration",
    fields: [
      ["0411", "Accounting and taxation"],
      ["0412", "Finance, banking and insurance"],
      ["0413", "Management and administration"],
      ["0414", "Marketing and advertising"],
      ["0415", "Secretarial and office work"],
      ["0416", "Wholesale and retail sales"],
      ["0417", "Work skills"],
    ],
  },
  { code: "042", title: "Law", fields: [["0421", "Law"]] },
  {
    code: "048",
    title: "Inter-disciplinary programmes involving business, administration and law",
    fields: [["0488", "Inter-disciplinary programmes involving business, administration and law"]],
  },
];

const field0412 = {
  code: "0412",
  title: "Finance, banking and insurance",
  chineseTitle: "金融、银行与保险",
  status: "Pilot",
  readiness: readiness.pathReady,
  userLayer: [
    ["What is it?", "Finance is the study of money, risk, time, and trust. It explains saving, borrowing, investing, banking, insurance, and financial decisions."],
    ["Why it matters", "Almost every life and business decision has a money question inside it: price, risk, budget, loan, return, or protection."],
    ["Core topics", "Personal finance, corporate finance, banking, investment, insurance, risk, interest, credit, markets, and financial regulation."],
    ["Common real-life examples", "Choosing a savings account, understanding a mortgage, comparing insurance, judging a company budget, or asking whether an investment return is worth the risk."],
    ["What you can learn", "Read basic financial choices, explain risk and return, understand banking products, and connect finance to accounting, management, marketing, and law."],
    ["Related learning path", "Business Foundation Path uses finance after management and marketing, before accounting and law."],
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

const businessPath = [
  ["0413", "Management and administration", "First understand how organizations coordinate people, goals, and decisions."],
  ["0414", "Marketing and advertising", "Then understand how demand is created, described, and communicated."],
  ["0412", "Finance, banking and insurance", "Next learn how money flows, risk is priced, and resources are allocated."],
  ["0411", "Accounting and taxation", "Then learn how financial activity is recorded, reported, and taxed."],
  ["0421", "Law", "Finally understand the rules that constrain and protect business activity."],
];

const reviewLog = {
  updatedModule: "Module Architecture MVP",
  whatChanged: "Home, Map, Categories, 04, 0412, Learning, and Business Foundation Path were shaped as separate modules.",
  whyChanged: "To support one module update, one clear commit, and lower long-term maintenance cost.",
  whatToTest: "Can a visitor move from Home to 0412 and understand the learning path?",
  nextModule: "Validate 0412, then add a small finance question set.",
};

function normalizeRoute(path) {
  if (window.location.protocol === "file:") {
    return window.location.hash.replace("#", "") || "/";
  }
  return path || "/";
}

function goToRoute(route, replace = false) {
  const target = route || "/";
  pages.forEach((page) => {
    const active = page.dataset.page === target;
    page.classList.toggle("is-active", active);
    page.setAttribute("aria-hidden", String(!active));
  });
  routeLinks.forEach((link) => link.classList.toggle("is-current", link.dataset.route === target));

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

function renderCategories() {
  const grid = document.getElementById("categoryGrid");
  const preview = document.getElementById("mapCategoryPreview");
  const cards = categories
    .map(([code, title, chineseTitle, status, ready]) => {
      const href = code === "04" ? "/categories/04" : "/categories";
      return `
        <article class="category-card ${code === "04" ? "is-pilot" : ""}">
          <div class="code">${code}</div>
          <h3>${title}</h3>
          <p>${chineseTitle}</p>
          ${makeStatus(status, ready)}
          <a href="${href}" data-route="${href}">${code === "04" ? "Open pilot" : "View in system"}</a>
        </article>`;
    })
    .join("");
  if (grid) grid.innerHTML = cards;
  if (preview) preview.innerHTML = cards;
}

function renderPassport(targetId, passport) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = `
    <div>
      <p class="eyebrow">Module Passport</p>
      <h2>${passport.name}</h2>
      <dl>
        <dt>Route</dt><dd>${passport.route}</dd>
        <dt>Purpose</dt><dd>${passport.purpose}</dd>
        <dt>User value</dt><dd>${passport.userValue}</dd>
        <dt>Founder value</dt><dd>${passport.founderValue}</dd>
        <dt>Status</dt><dd>${passport.status}</dd>
        <dt>Related modules</dt><dd>${passport.relatedModules}</dd>
        <dt>Next action</dt><dd>${passport.nextAction}</dd>
        <dt>Do not touch</dt><dd>${passport.doNotTouch}</dd>
      </dl>
    </div>`;
}

function renderBusinessTree() {
  const target = document.getElementById("businessTree");
  if (!target) return;
  target.innerHTML = businessTree
    .map((group) => `
      <section class="tree-group">
        <h2>${group.code} ${group.title}</h2>
        <div class="field-list">
          ${group.fields.map(([code, title]) => {
            const href = code === "0412" ? "/categories/04/0412" : "/categories/04";
            return `<a class="field-chip ${code === "0412" ? "is-active" : ""}" href="${href}" data-route="${href}"><strong>${code}</strong>${title}</a>`;
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
  const timeline = document.getElementById("businessTimeline");
  if (pathGrid) {
    pathGrid.innerHTML = pathTypes.map(([title, text]) => `<article class="module-card"><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if (timeline) {
    timeline.innerHTML = businessPath
      .map(([code, title, reason], index) => `
        <li>
          <span>${index + 1}</span>
          <div>
            <h2>${code} ${title}</h2>
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
    [240, 170, 110, 74, "#e4d36d", "06 ICT"],
    [470, 180, 130, 86, "#8bc96f", "04 Pilot"],
    [650, 285, 100, 68, "#f0b85d", "07 Eng"],
    [280, 365, 118, 76, "#9ed177", "05 Science"],
    [545, 425, 130, 74, "#7fc76f", "Learning"],
  ];
  islands.forEach(([x, y, w, h, color, label], index) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((index - 2) * 0.08);
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ellipseBlob(w + 32, h + 22);
    ctx.fill();
    ctx.fillStyle = color;
    ellipseBlob(w, h);
    ctx.fill();
    ctx.fillStyle = "#fff6dd";
    ctx.beginPath();
    ctx.arc(-w * 0.2, -h * 0.18, Math.min(w, h) * 0.2, 0, Math.PI * 2);
    ctx.fill();
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

routeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    goToRoute(link.dataset.route);
  });
});

window.addEventListener("popstate", () => goToRoute(normalizeRoute(window.location.pathname), true));
window.addEventListener("hashchange", () => goToRoute(normalizeRoute(window.location.pathname), true));

renderCategories();
renderPassport("categoryPassport", modulePassports.category04);
renderPassport("pathPassport", modulePassports.path);
renderBusinessTree();
renderField();
renderLearning();
drawKnowledgeMap();
goToRoute(normalizeRoute(window.location.pathname), true);
