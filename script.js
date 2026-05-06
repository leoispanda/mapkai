const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");
const form = document.getElementById("mapForm");
const mapGoal = document.getElementById("mapGoal");
const stateSummary = document.getElementById("stateSummary");
const mapList = document.getElementById("mapList");
const moduleGrid = document.getElementById("moduleGrid");
const pageLinks = document.querySelectorAll("[data-page-target]");
const pages = document.querySelectorAll(".page");
const userPill = document.getElementById("userPill");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const emailForm = document.getElementById("emailForm");
const codeForm = document.getElementById("codeForm");
const profileForm = document.getElementById("profileForm");
const authProfileForm = document.getElementById("authProfileForm");
const emailStep = document.getElementById("emailStep");
const codeStep = document.getElementById("codeStep");
const profileStep = document.getElementById("profileStep");
const codeHint = document.getElementById("codeHint");
const discussionForm = document.getElementById("discussionForm");
const discussionInput = document.getElementById("discussionInput");
const discussionList = document.getElementById("discussionList");
const domainList = document.getElementById("domainList");
const selectedCard = document.getElementById("selectedCard");
const masteredCount = document.getElementById("masteredCount");
const atlasProgress = document.getElementById("atlasProgress");
const suggestNextButton = document.getElementById("suggestNextButton");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:3000" : "";
const storageKey = "mapkai-state-v2";

const knowledgeDomains = [
  {
    id: "ai",
    label: "AI Systems",
    icon: "AI",
    type: "Technology",
    x: 0.15,
    y: -0.42,
    color: "#2f8a62",
    summary: "Models, prompts, automation, agents, evaluation, and AI-assisted workflows.",
    unlocked: true,
  },
  {
    id: "business",
    label: "Organizations",
    icon: "ORG",
    type: "Industry",
    x: -0.28,
    y: -0.18,
    color: "#d2a247",
    summary: "Company structures, departments, incentives, operations, strategy, and management.",
    unlocked: true,
  },
  {
    id: "science",
    label: "Science",
    icon: "SCI",
    type: "Discipline",
    x: 0.36,
    y: -0.08,
    color: "#55a06f",
    summary: "Physics, biology, chemistry, research methods, systems thinking, and evidence.",
    unlocked: false,
  },
  {
    id: "finance",
    label: "Finance",
    icon: "FIN",
    type: "Industry",
    x: -0.1,
    y: 0.16,
    color: "#c95f46",
    summary: "Markets, accounting, investing, risk, capital flows, and financial decision-making.",
    unlocked: false,
  },
  {
    id: "health",
    label: "Health",
    icon: "HLT",
    type: "Industry",
    x: 0.44,
    y: 0.26,
    color: "#79a86f",
    summary: "Medicine, nutrition, physiology, public health, care systems, and wellbeing.",
    unlocked: false,
  },
  {
    id: "design",
    label: "Design",
    icon: "DES",
    type: "Practice",
    x: -0.48,
    y: 0.18,
    color: "#e0b85a",
    summary: "Product thinking, visual systems, interaction design, brand, and user experience.",
    unlocked: false,
  },
  {
    id: "law",
    label: "Law & Policy",
    icon: "LAW",
    type: "System",
    x: 0.03,
    y: 0.45,
    color: "#4e8e76",
    summary: "Legal structures, regulation, governance, contracts, rights, and institutions.",
    unlocked: false,
  },
  {
    id: "culture",
    label: "Culture",
    icon: "CUL",
    type: "Humanities",
    x: -0.36,
    y: 0.42,
    color: "#b98945",
    summary: "Language, history, media, art, social patterns, and how meaning travels.",
    unlocked: false,
  },
];

let animationFrame;
let globeRotation = 0;
let selectedDomainId = "ai";
let isLoggedIn = false;
let currentUser = {
  email: "",
  name: "Kai Learner",
  avatar: "auto",
};
let savedDiscussions = [];
let masteredDomains = new Set(knowledgeDomains.filter((domain) => domain.unlocked).map((domain) => domain.id));
let canvasMetrics = { size: 0, cx: 0, cy: 0, radius: 0 };

const profileLabels = {
  aiLevel: {
    "no-ai": "knows almost nothing about AI",
    "basic-ai": "knows basic AI concepts",
    "uses-ai": "already uses AI tools",
    "builds-ai": "can build with AI",
    "master-ai": "has master-level AI fluency",
  },
  learningAbility: {
    struggles: "needs a very guided learning route",
    slow: "learns best with extra repetition",
    steady: "learns at a steady pace",
    fast: "absorbs new material quickly",
    elite: "learns extremely fast",
  },
  timeAvailable: {
    "ten-min": "10 minutes per day",
    "thirty-min": "30 minutes per day",
    "one-hour": "1 hour per day",
    weekends: "weekend blocks",
    "full-focus": "full-focus study time",
  },
  outputStyle: {
    concepts: "wants concepts first",
    examples: "learns from examples",
    practice: "wants practice tasks",
    project: "wants a project-based route",
    coach: "wants coaching and feedback",
  },
};

const moduleCards = [
  {
    title: "AI Zero to One",
    level: "Simple",
    time: "3 sessions",
    bestFor: ["no-ai", "basic-ai"],
    goal: "Understand what AI can and cannot do.",
    output: "A personal AI starter checklist.",
    exercises: ["Ask AI to explain itself in 5 sentences.", "Write 3 things AI can help you learn.", "Save 1 rule for using AI safely."],
  },
  {
    title: "Prompt Basics",
    level: "Simple",
    time: "1 week",
    bestFor: ["no-ai", "basic-ai", "uses-ai"],
    goal: "Learn how to ask AI for clear, useful answers.",
    output: "10 reusable prompts for daily learning.",
    exercises: ["Rewrite one vague question into a clear prompt.", "Ask AI for an example, then a simpler example.", "Save your best prompt for tomorrow."],
  },
  {
    title: "Study Workflow",
    level: "Medium",
    time: "1 week",
    bestFor: ["basic-ai", "uses-ai"],
    goal: "Turn AI into a repeatable learn-practice-review loop.",
    output: "A weekly learning workflow.",
    exercises: ["Choose one topic for today.", "Ask AI for a 10-minute practice task.", "Write what changed after practice."],
  },
  {
    title: "Project Builder",
    level: "Medium",
    time: "2 weeks",
    bestFor: ["uses-ai", "builds-ai"],
    goal: "Use AI to make one visible project from start to finish.",
    output: "A completed project with review notes.",
    exercises: ["Pick one tiny project idea.", "Ask AI to split it into 3 steps.", "Finish step 1 and ask for feedback."],
  },
  {
    title: "AI Feedback Coach",
    level: "Advanced",
    time: "2 weeks",
    bestFor: ["uses-ai", "builds-ai", "master-ai"],
    goal: "Use AI to critique work, find gaps, and improve faster.",
    output: "A feedback rubric and revision system.",
    exercises: ["Paste one piece of work into AI.", "Ask for 2 strengths and 2 fixes.", "Revise one part immediately."],
  },
  {
    title: "Automation Path",
    level: "Complex",
    time: "4 weeks",
    bestFor: ["builds-ai", "master-ai"],
    goal: "Move from using AI manually to building AI-assisted systems.",
    output: "A small automated AI workflow.",
    exercises: ["Find one repeated task in your study.", "Ask AI to design a simple workflow.", "Test the workflow once and note friction."],
  },
];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(280, Math.min(rect.width, rect.height || rect.width));
  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  canvas.style.height = `${size}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  canvasMetrics = {
    size,
    cx: size / 2,
    cy: size / 2,
    radius: size * 0.43,
  };
  drawGlobe();
}

function drawGlobe(time = 0) {
  globeRotation = time * 0.00012;
  const { size, cx, cy, radius } = canvasMetrics;
  ctx.clearRect(0, 0, size, size);

  const ocean = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.42, radius * 0.1, cx, cy, radius);
  ocean.addColorStop(0, "#4c8eb0");
  ocean.addColorStop(0.44, "#1d668a");
  ocean.addColorStop(1, "#12384f");

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  drawOceanGrid(cx, cy, radius);
  drawKnowledgeLinks(cx, cy, radius);
  knowledgeDomains.forEach((domain) => drawDomain(domain, cx, cy, radius));
  ctx.restore();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 250, 240, 0.88)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.76, cx, cy, radius * 1.35);
  glow.addColorStop(0, "rgba(255, 250, 240, 0)");
  glow.addColorStop(1, "rgba(15, 107, 87, 0.22)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 1.28, 0, Math.PI * 2);
  ctx.fill();

  animationFrame = requestAnimationFrame(drawGlobe);
}

function drawOceanGrid(cx, cy, radius) {
  ctx.strokeStyle = "rgba(245, 241, 232, 0.16)";
  ctx.lineWidth = 1;

  for (let i = -2; i <= 2; i += 1) {
    const y = cy + (i * radius) / 3;
    const width = Math.sqrt(Math.max(radius * radius - (y - cy) * (y - cy), 0));
    ctx.beginPath();
    ctx.ellipse(cx, y, width, radius * 0.05, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = -2; i <= 2; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * (0.28 + Math.abs(i) * 0.14), radius, i * 0.18, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawKnowledgeLinks(cx, cy, radius) {
  const points = knowledgeDomains.map((domain) => projectDomain(domain, cx, cy, radius));
  ctx.lineWidth = 1.2;

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const mastered = masteredDomains.has(knowledgeDomains[i].id) && masteredDomains.has(knowledgeDomains[j].id);
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > radius * 0.82) continue;
      ctx.strokeStyle = mastered ? "rgba(255, 250, 240, 0.28)" : "rgba(255, 250, 240, 0.1)";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawDomain(domain, cx, cy, radius) {
  const point = projectDomain(domain, cx, cy, radius);
  const mastered = masteredDomains.has(domain.id);
  const selected = selectedDomainId === domain.id;

  if (mastered) {
    drawLandMass(point.x, point.y, radius * 0.14, domain.color, domain.id);
  } else {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 0.047, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 250, 240, 0.88)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 0.031, 0, Math.PI * 2);
    ctx.fillStyle = "#1d5f82";
    ctx.fill();
  }

  if (selected) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius * 0.088, 0, Math.PI * 2);
    ctx.strokeStyle = "#fffaf0";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.fillStyle = mastered ? "#fffaf0" : "rgba(255, 250, 240, 0.86)";
  ctx.font = `800 ${Math.max(10, radius * 0.045)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(domain.icon, point.x, point.y + radius * 0.002);
}

function drawLandMass(x, y, size, color, seed) {
  const hash = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  ctx.beginPath();
  for (let i = 0; i < 12; i += 1) {
    const angle = (Math.PI * 2 * i) / 12;
    const wobble = 0.78 + (((hash + i * 17) % 28) / 100);
    const px = x + Math.cos(angle) * size * wobble;
    const py = y + Math.sin(angle) * size * (0.72 + wobble * 0.18);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 250, 240, 0.58)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function projectDomain(domain, cx, cy, radius) {
  const rotatedX = domain.x * Math.cos(globeRotation) - domain.y * 0.16 * Math.sin(globeRotation);
  const rotatedY = domain.y + Math.sin(globeRotation + domain.x) * 0.035;
  return {
    x: cx + rotatedX * radius * 1.24,
    y: cy + rotatedY * radius * 1.24,
  };
}

function renderDomains() {
  domainList.replaceChildren();
  knowledgeDomains.forEach((domain) => {
    const mastered = masteredDomains.has(domain.id);
    const button = document.createElement("button");
    button.className = `domain-button${mastered ? " is-mastered" : ""}${selectedDomainId === domain.id ? " is-selected" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="domain-icon">${escapeHtml(domain.icon)}</span>
      <span class="domain-copy">
        <strong>${escapeHtml(domain.label)}</strong>
        <span>${escapeHtml(domain.type)}</span>
      </span>
      <span class="domain-status">${mastered ? "Land" : "Ocean"}</span>
    `;
    button.addEventListener("click", () => {
      selectedDomainId = domain.id;
      renderDomains();
      renderSelectedDomain();
      drawGlobe();
      saveState();
    });
    domainList.appendChild(button);
  });

  const mastered = masteredDomains.size;
  const progress = Math.round((mastered / knowledgeDomains.length) * 100);
  masteredCount.textContent = `${mastered} mastered`;
  atlasProgress.textContent = `${progress}%`;
}

function renderSelectedDomain() {
  const domain = knowledgeDomains.find((item) => item.id === selectedDomainId) || knowledgeDomains[0];
  const mastered = masteredDomains.has(domain.id);
  selectedCard.innerHTML = `
    <p class="eyebrow">${mastered ? "Land discovered" : "Unexplored ocean"}</p>
    <strong>${escapeHtml(domain.label)}</strong>
    <p>${escapeHtml(domain.summary)}</p>
    <button class="button ${mastered ? "secondary" : "primary"}" type="button" id="toggleDomainButton">
      ${mastered ? "Mark as ocean" : "Light into land"}
    </button>
  `;
  document.getElementById("toggleDomainButton").addEventListener("click", () => {
    toggleDomain(domain.id);
  });
}

function toggleDomain(id) {
  if (masteredDomains.has(id)) {
    masteredDomains.delete(id);
  } else {
    masteredDomains.add(id);
  }
  selectedDomainId = id;
  renderDomains();
  renderSelectedDomain();
  drawGlobe();
  saveState();
}

function suggestNextDomain() {
  const next = knowledgeDomains.find((domain) => !masteredDomains.has(domain.id)) || knowledgeDomains[0];
  selectedDomainId = next.id;
  renderDomains();
  renderSelectedDomain();
  drawGlobe();
}

function handleCanvasClick(event) {
  const rect = canvas.getBoundingClientRect();
  const scale = canvasMetrics.size / rect.width;
  const x = (event.clientX - rect.left) * scale;
  const y = (event.clientY - rect.top) * scale;
  const hit = knowledgeDomains.find((domain) => {
    const point = projectDomain(domain, canvasMetrics.cx, canvasMetrics.cy, canvasMetrics.radius);
    return Math.hypot(point.x - x, point.y - y) < canvasMetrics.radius * 0.12;
  });
  if (hit) toggleDomain(hit.id);
}

function getPlanInput() {
  const data = new FormData(form);
  const goal = String(data.get("goal") || "").trim() || "Build useful AI habits";
  return {
    goal,
    pace: data.get("pace") || "steady",
    aiLevel: data.get("aiLevel") || "basic-ai",
    learningAbility: data.get("learningAbility") || "steady",
    timeAvailable: data.get("timeAvailable") || "thirty-min",
    outputStyle: data.get("outputStyle") || "practice",
  };
}

function renderMap(profile) {
  const { goal } = profile;
  mapGoal.textContent = goal;
  stateSummary.replaceChildren();
  moduleGrid.replaceChildren();
  mapList.replaceChildren();

  const summary = document.createElement("p");
  summary.innerHTML = `<strong>Starting point:</strong> ${buildStartingPoint(profile)}.`;
  const logic = document.createElement("p");
  logic.innerHTML = `<strong>Module role:</strong> these cards support the selected atlas region without taking over the homepage.`;
  stateSummary.append(summary, logic);
  renderModules(profile);

  getSimplePlan(profile).forEach(([title, description, action, duration], index) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <span class="node-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="node-copy">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
        <span class="node-action">${escapeHtml(action)}</span>
      </span>
      <span class="node-time">${escapeHtml(duration)}</span>
    `;
    mapList.appendChild(item);
  });
}

function getSimplePlan(profile) {
  const time =
    profile.timeAvailable === "ten-min"
      ? "10 min"
      : profile.timeAvailable === "one-hour"
        ? "1 hour"
        : "30 min";

  return [
    ["Select region", `Connect ${profile.goal} to one visible knowledge region on the atlas.`, "Choose the closest industry or discipline.", time],
    ["Proof of knowledge", "Write one explanation or complete one small task that proves the region is understood.", "Use examples, not passive reading.", "1 session"],
    ["Light the land", "Mark the region as mastered once the proof is good enough.", "Turn ocean into land on the globe.", "Today"],
    ["Expand edge", "Pick the next adjacent ocean region and repeat.", "Grow the atlas from demonstrated knowledge.", "Tomorrow"],
  ];
}

function renderModules(profile) {
  const preferred = moduleCards.filter((module) => module.bestFor.includes(profile.aiLevel));
  const fallback = moduleCards.filter((module) => !module.bestFor.includes(profile.aiLevel));
  const modules = [...preferred, ...fallback].slice(0, 4);

  modules.forEach((module) => {
    const card = document.createElement("article");
    card.className = "module-card";
    card.innerHTML = `
      <div class="module-card-top">
        <span>${escapeHtml(module.level)}</span>
        <span>${escapeHtml(module.time)}</span>
      </div>
      <h3>${escapeHtml(module.title)}</h3>
      <p>${escapeHtml(module.goal)}</p>
      <ul class="exercise-list">
        ${module.exercises.map((exercise) => `<li>${escapeHtml(exercise)}</li>`).join("")}
      </ul>
      <strong>${escapeHtml(module.output)}</strong>
    `;
    moduleGrid.appendChild(card);
  });
}

function buildStartingPoint(profile) {
  const parts = [
    profileLabels.aiLevel[profile.aiLevel],
    profileLabels.learningAbility[profile.learningAbility],
    profileLabels.timeAvailable[profile.timeAvailable],
    profileLabels.outputStyle[profile.outputStyle],
  ];

  return parts.join(", ");
}

function updateProfileFromForm(sourceForm) {
  const data = new FormData(sourceForm);
  currentUser.name = String(data.get("name") || "").trim() || "Kai Learner";
  currentUser.avatar = data.get("avatar") || "auto";
  isLoggedIn = true;
  syncProfileForms();
  renderUser();
  saveState();
  showPage("atlas");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderMap(getPlanInput());
  saveState();
});

form.addEventListener("change", () => {
  renderMap(getPlanInput());
  saveState();
});

form.addEventListener("input", () => {
  renderMap(getPlanInput());
  saveState();
});

emailForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(emailForm);
  currentUser.email = data.get("email");

  try {
    const result = await apiPost("/api/auth/start", { email: currentUser.email });
    codeHint.textContent = result.devCode ? `Local dev code: ${result.devCode}` : `We sent a login code to ${currentUser.email}.`;
    emailStep.hidden = true;
    codeStep.hidden = false;
  } catch (error) {
    codeHint.textContent = error.message;
    emailStep.querySelector("p").textContent = error.message;
  }
});

codeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(codeForm);

  try {
    await apiPost("/api/auth/verify", {
      email: currentUser.email,
      code: data.get("code"),
    });
    codeStep.hidden = true;
    profileStep.hidden = false;
  } catch (error) {
    codeHint.textContent = error.message;
  }
});

authProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateProfileFromForm(authProfileForm);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateProfileFromForm(profileForm);
});

discussionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = discussionInput.value.trim();
  if (!message) return;
  addDiscussionMessage(currentUser.name, getAvatarLabel(currentUser), message);
  savedDiscussions.unshift({
    name: currentUser.name,
    avatar: getAvatarLabel(currentUser),
    message,
  });
  savedDiscussions = savedDiscussions.slice(0, 12);
  saveState();
  discussionInput.value = "";
});

function renderUser() {
  userAvatar.textContent = getAvatarLabel(currentUser);
  userName.textContent = currentUser.name;
  userPill.hidden = false;
}

async function apiPost(path, payload) {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Try again.");
  }

  return data;
}

function getAvatarLabel(user) {
  if (user.avatar !== "auto") return user.avatar;
  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "ME";
}

function syncProfileForms() {
  [profileForm, authProfileForm].forEach((targetForm) => {
    targetForm.elements.name.value = currentUser.name;
    const avatar = Array.from(targetForm.elements.avatar).find((input) => input.value === currentUser.avatar);
    if (avatar) avatar.checked = true;
  });
}

function addDiscussionMessage(name, avatar, message) {
  const item = document.createElement("article");
  item.className = "discussion-message";
  item.innerHTML = `
    <span>${escapeHtml(avatar)}</span>
    <div>
      <strong>${escapeHtml(name)}</strong>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
  discussionList.prepend(item);
}

function saveState() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      isLoggedIn,
      currentUser,
      savedDiscussions,
      profile: getPlanInput(),
      selectedDomainId,
      masteredDomains: Array.from(masteredDomains),
    }),
  );
}

function restoreState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return false;

  try {
    const state = JSON.parse(raw);
    isLoggedIn = Boolean(state.isLoggedIn);
    currentUser = { ...currentUser, ...(state.currentUser || {}) };
    savedDiscussions = Array.isArray(state.savedDiscussions) ? state.savedDiscussions : [];
    selectedDomainId = state.selectedDomainId || selectedDomainId;
    masteredDomains = new Set(Array.isArray(state.masteredDomains) ? state.masteredDomains : Array.from(masteredDomains));

    if (state.profile) {
      Object.entries(state.profile).forEach(([name, value]) => {
        const field = form.elements[name];
        if (!field) return;
        if (field instanceof RadioNodeList) {
          const option = Array.from(field).find((input) => input.value === value);
          if (option) option.checked = true;
        } else {
          field.value = value;
        }
      });
    }

    return isLoggedIn;
  } catch {
    localStorage.removeItem(storageKey);
    return false;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showPage(pageId) {
  pages.forEach((page) => {
    const isActive = page.id === pageId;
    page.classList.toggle("is-active", isActive);
    page.setAttribute("aria-hidden", String(!isActive));
    if (isActive) page.scrollTo({ top: 0, left: 0 });
  });
  window.scrollTo({ top: 0, left: 0 });
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.pageTarget);
  });
});

window.addEventListener("resize", resizeCanvas);
canvas.addEventListener("click", handleCanvasClick);
suggestNextButton.addEventListener("click", suggestNextDomain);

const restored = restoreState();
syncProfileForms();
renderMap(getPlanInput());
renderDomains();
renderSelectedDomain();
resizeCanvas();
if (savedDiscussions.length) {
  savedDiscussions.forEach((entry) => addDiscussionMessage(entry.name, entry.avatar, entry.message));
} else {
  addDiscussionMessage("MapKAI", "K", "Welcome. Light one knowledge region when you can prove it.");
}
if (restored) renderUser();
showPage("atlas");

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});
