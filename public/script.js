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
const emailStep = document.getElementById("emailStep");
const codeStep = document.getElementById("codeStep");
const profileStep = document.getElementById("profileStep");
const codeHint = document.getElementById("codeHint");
const discussionForm = document.getElementById("discussionForm");
const discussionInput = document.getElementById("discussionInput");
const discussionList = document.getElementById("discussionList");
const apiBase = window.location.protocol === "file:" ? "http://127.0.0.1:3000" : "";
const storageKey = "mapkai-state-v1";

const palette = ["#1f7a5c", "#d95d43", "#c9952f", "#406f9f"];
let points = [];
let animationFrame;
let isLoggedIn = false;
let currentUser = {
  email: "",
  name: "Kai Learner",
  avatar: "auto",
};
let savedDiscussions = [];

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  points = createPoints(rect.width, rect.height);
}

function createPoints(width, height) {
  const count = width < 760 ? 22 : 38;
  return Array.from({ length: count }, (_, index) => ({
    x: width * (0.28 + Math.random() * 0.68),
    y: height * (0.08 + Math.random() * 0.82),
    r: 3 + Math.random() * 5,
    color: palette[index % palette.length],
    speed: 0.18 + Math.random() * 0.28,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawNetwork(time = 0) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);

  ctx.lineWidth = 1;
  points.forEach((point, index) => {
    const x = point.x + Math.sin(time * 0.0005 + point.phase) * 12;
    const y = point.y + Math.cos(time * 0.0004 + point.phase) * 10;

    for (let next = index + 1; next < points.length; next += 1) {
      const other = points[next];
      const ox = other.x + Math.sin(time * 0.0005 + other.phase) * 12;
      const oy = other.y + Math.cos(time * 0.0004 + other.phase) * 10;
      const distance = Math.hypot(x - ox, y - oy);

      if (distance < 172) {
        ctx.strokeStyle = `rgba(31, 122, 92, ${0.18 - distance / 1300})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }
    }

    ctx.fillStyle = point.color;
    ctx.beginPath();
    ctx.arc(x, y, point.r, 0, Math.PI * 2);
    ctx.fill();
  });

  animationFrame = requestAnimationFrame(drawNetwork);
}

const paceDurations = {
  quick: ["30 min", "45 min", "2 days", "1 week", "20 min"],
  steady: ["1 day", "2 days", "1 week", "2 weeks", "45 min"],
  deep: ["2 days", "1 week", "2 weeks", "4 weeks", "1 hour"],
};

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
  urgency: {
    explore: "exploring without deadline",
    month: "targeting progress this month",
    "two-weeks": "needs results within two weeks",
    "this-week": "needs movement this week",
    urgent: "has an urgent deadline",
  },
  outputStyle: {
    concepts: "wants concepts first",
    examples: "learns from examples",
    practice: "wants practice tasks",
    project: "wants a project-based route",
    coach: "wants coaching and feedback",
  },
};

// Internal planning method: ADDIE stays behind the scenes.
const addieTemplates = {
  quick: [
    ["Analyze", "Turn the current state into a short gap diagnosis.", "Name the missing skills and blockers."],
    ["Design", "Pick the shortest sequence that can move the goal forward.", "Define one measurable checkpoint."],
    ["Develop", "Create the first practice asset or template.", "Build something rough enough to test."],
    ["Implement", "Run a focused sprint with daily output.", "Complete one visible deliverable."],
    ["Evaluate", "Compare the result with the goal and update the route.", "Keep, change, or remove the next step."],
  ],
  steady: [
    ["Analyze", "Diagnose the gap between the current state and the target outcome.", "List strengths, weak spots, constraints, and success criteria."],
    ["Design", "Turn the gap into a staged learning route.", "Set milestones, practice rhythm, and review points."],
    ["Develop", "Prepare the materials and exercises for each stage.", "Make a checklist, examples, and one guided project."],
    ["Implement", "Follow the route through short build-review cycles.", "Practice, produce, collect feedback, and revise."],
    ["Evaluate", "Measure whether the plan changed the learner's ability.", "Score the output and generate the next version of the map."],
  ],
  deep: [
    ["Analyze", "Build a full learner profile from the initial state.", "Identify prior knowledge, misconceptions, motivation, time, and evidence."],
    ["Design", "Create a rigorous path from foundation to independent performance.", "Define outcomes, assessments, sequencing, and support."],
    ["Develop", "Assemble lessons, drills, projects, rubrics, and reflection prompts.", "Prepare everything needed before execution starts."],
    ["Implement", "Run the plan in phases with feedback after each milestone.", "Use real tasks instead of passive study."],
    ["Evaluate", "Use formative and final review to improve the route.", "Adjust the next cycle based on demonstrated performance."],
  ],
};

const moduleCards = [
  {
    title: "AI Zero to One",
    level: "Simple",
    time: "3 sessions",
    bestFor: ["no-ai", "basic-ai"],
    goal: "Understand what AI can and cannot do.",
    output: "A personal AI starter checklist.",
    exercises: [
      "Ask AI to explain itself in 5 sentences.",
      "Write 3 things AI can help you learn.",
      "Save 1 rule for using AI safely.",
    ],
  },
  {
    title: "Prompt Basics",
    level: "Simple",
    time: "1 week",
    bestFor: ["no-ai", "basic-ai", "uses-ai"],
    goal: "Learn how to ask AI for clear, useful answers.",
    output: "10 reusable prompts for daily learning.",
    exercises: [
      "Rewrite one vague question into a clear prompt.",
      "Ask AI for an example, then a simpler example.",
      "Save your best prompt for tomorrow.",
    ],
  },
  {
    title: "Study Workflow",
    level: "Medium",
    time: "1 week",
    bestFor: ["basic-ai", "uses-ai"],
    goal: "Turn AI into a repeatable learn-practice-review loop.",
    output: "A weekly learning workflow.",
    exercises: [
      "Choose one topic for today.",
      "Ask AI for a 10-minute practice task.",
      "Write what changed after practice.",
    ],
  },
  {
    title: "Project Builder",
    level: "Medium",
    time: "2 weeks",
    bestFor: ["uses-ai", "builds-ai"],
    goal: "Use AI to make one visible project from start to finish.",
    output: "A completed project with review notes.",
    exercises: [
      "Pick one tiny project idea.",
      "Ask AI to split it into 3 steps.",
      "Finish step 1 and ask for feedback.",
    ],
  },
  {
    title: "AI Feedback Coach",
    level: "Advanced",
    time: "2 weeks",
    bestFor: ["uses-ai", "builds-ai", "master-ai"],
    goal: "Use AI to critique work, find gaps, and improve faster.",
    output: "A feedback rubric and revision system.",
    exercises: [
      "Paste one piece of work into AI.",
      "Ask for 2 strengths and 2 fixes.",
      "Revise one part immediately.",
    ],
  },
  {
    title: "Automation Path",
    level: "Complex",
    time: "4 weeks",
    bestFor: ["builds-ai", "master-ai"],
    goal: "Move from using AI manually to building AI-assisted systems.",
    output: "A small automated AI workflow.",
    exercises: [
      "Find one repeated task in your study.",
      "Ask AI to design a simple workflow.",
      "Test the workflow once and note friction.",
    ],
  },
];

function getPlanInput() {
  const data = new FormData(form);
  const goal = String(data.get("goal") || "").trim() || "Build useful AI habits";
  return {
    goal,
    pace: data.get("pace") || "steady",
    aiLevel: data.get("aiLevel") || "basic-ai",
    learningAbility: data.get("learningAbility") || "steady",
    timeAvailable: data.get("timeAvailable") || "thirty-min",
    urgency: data.get("urgency") || "month",
    outputStyle: data.get("outputStyle") || "practice",
  };
}

function renderMap(profile) {
  const { goal, pace } = profile;
  mapGoal.textContent = goal;
  stateSummary.replaceChildren();
  moduleGrid.replaceChildren();
  mapList.replaceChildren();

  const summary = document.createElement("p");
  summary.innerHTML = `<strong>Starting point:</strong> ${buildStartingPoint(profile)}.`;
  const logic = document.createElement("p");
  logic.innerHTML = `<strong>Learning map:</strong> ${escapeHtml(profile.goal)} starts small, practices once, reviews once, then continues.`;
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
    ["Today", `Learn one basic idea for ${profile.goal} and write it in your own words.`, "Ask AI for a simple explanation, then save three key points.", time],
    ["Practice", "Do one small exercise instead of reading more.", "Ask AI to give you one task at your level and complete it.", "1 session"],
    ["Review", "Check what felt easy, confusing, or useful.", "Ask AI to review your answer and suggest one improvement.", "10 min"],
    ["Next step", "Move to a slightly harder task only after the review.", "Ask AI to create tomorrow's task based on today's result.", "Tomorrow"],
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
        <span>${module.level}</span>
        <span>${module.time}</span>
      </div>
      <h3>${module.title}</h3>
      <p>${module.goal}</p>
      <ul class="exercise-list">
        ${module.exercises.map((exercise) => `<li>${exercise}</li>`).join("")}
      </ul>
      <strong>${module.output}</strong>
    `;
    moduleGrid.appendChild(card);
  });
}

function buildStartingPoint(profile) {
  const parts = [
    profileLabels.aiLevel[profile.aiLevel],
    profileLabels.learningAbility[profile.learningAbility],
    profileLabels.timeAvailable[profile.timeAvailable],
    profileLabels.urgency[profile.urgency],
    profileLabels.outputStyle[profile.outputStyle],
  ];

  return parts.join(", ");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderMap(getPlanInput());
  showPage("plan");
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
    codeHint.textContent = result.devCode
      ? `Local dev code: ${result.devCode}`
      : `We sent a login code to ${currentUser.email}.`;
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

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(profileForm);
  currentUser.name = data.get("name").trim() || "Kai Learner";
  currentUser.avatar = data.get("avatar") || "auto";
  isLoggedIn = true;
  renderUser();
  saveState();
  showPage("intro");
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

function addDiscussionMessage(name, avatar, message) {
  const item = document.createElement("article");
  item.className = "discussion-message";
  item.innerHTML = `
    <span>${avatar}</span>
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
  return value
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
  });
}

pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.pageTarget);
  });
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
drawNetwork();
const restored = restoreState();
renderMap(getPlanInput());
if (savedDiscussions.length) {
  savedDiscussions.forEach((entry) => addDiscussionMessage(entry.name, entry.avatar, entry.message));
} else {
  addDiscussionMessage("MapKai", "K", "Welcome. Post one small learning win after you finish today's card.");
}
if (restored) renderUser();
showPage("intro");

window.addEventListener("beforeunload", () => {
  cancelAnimationFrame(animationFrame);
});
