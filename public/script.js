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
const storageKey = "mapkai-state-v3";

const knowledgeDomains = [
  {
    id: "computing-ai",
    label: "Computing & AI",
    icon: "AI",
    type: "Technology",
    x: 0.15,
    y: -0.42,
    color: "#2f8a62",
    summary: "Computer science, software engineering, AI, data systems, security, algorithms, and human-computer interaction.",
    courses: [
      ["University of Amsterdam", "Artificial Intelligence", "Bachelor/Master"],
      ["MIT", "Electrical Engineering and Computer Science", "Undergraduate/Graduate subjects"],
      ["Stanford", "Computer Science", "Department/Courses"],
      ["Oxford", "Advanced Computer Science MSc", "Graduate"],
      ["ETH Zurich", "Computer Science and Data Science", "Bachelor/Master"],
      ["NUS", "Computer Science, Information Security, Business AI Systems", "Undergraduate"],
    ],
    unlocked: true,
  },
  {
    id: "math-data",
    label: "Mathematics & Data",
    icon: "MATH",
    type: "Foundation",
    x: -0.14,
    y: -0.5,
    color: "#4e8e76",
    summary: "Mathematics, statistics, computational science, quantitative modelling, and data analysis as the base layer for modern knowledge.",
    courses: [
      ["MIT", "Mathematics; Computational Science and Engineering", "Undergraduate/Graduate subjects"],
      ["Harvard", "Applied Mathematics; Statistics", "Graduate programs"],
      ["ETH Zurich", "Mathematics/Applied Mathematics; Statistics", "Bachelor/Master"],
      ["University of Tokyo", "Undergraduate/graduate course catalogue", "Course catalogue"],
      ["Tsinghua University", "Science, engineering and cross-disciplinary majors", "Undergraduate/Graduate"],
    ],
    unlocked: true,
  },
  {
    id: "engineering-systems",
    label: "Engineering Systems",
    icon: "ENG",
    type: "Engineering",
    x: 0.38,
    y: -0.22,
    color: "#d2a247",
    summary: "Mechanical, electrical, civil, aerospace, control, robotics, energy, and infrastructure systems.",
    courses: [
      ["Tsinghua University", "Electrical Engineering, Civil Engineering, Automation, Architecture", "Undergraduate/Graduate"],
      ["Yanshan University", "Mechanical Engineering, Electrical Engineering, Control Science, Civil Engineering", "Undergraduate/Graduate"],
      ["MIT", "Mechanical, Civil, Aeronautics, Nuclear, Materials, EECS", "Subjects"],
      ["Stanford", "Aeronautics, Bioengineering, CEE, EE, Mechanical Engineering", "Departments"],
      ["Cambridge", "Engineering postgraduate programmes", "Graduate"],
      ["ETH Zurich", "Engineering Sciences", "Bachelor/Master"],
    ],
    unlocked: false,
  },
  {
    id: "materials-manufacturing",
    label: "Materials & Manufacturing",
    icon: "MAT",
    type: "Engineering",
    x: -0.38,
    y: -0.2,
    color: "#b98945",
    summary: "Materials science, metallurgy, polymer materials, product manufacturing, machining, industrial systems, and quality.",
    courses: [
      ["Yanshan University", "Metal Materials, Polymer Materials, Intelligent Manufacturing, Mechanical Design", "Undergraduate"],
      ["Yanshan University", "Materials Science and Engineering, Mechanical Engineering", "Graduate disciplines"],
      ["MIT", "Materials Science and Engineering; Mechanical Engineering", "Subjects"],
      ["Stanford", "Materials Science and Engineering; Mechanical Engineering", "Departments"],
      ["ETH Zurich", "Materials Science, Mechanical Engineering, Process Engineering", "Bachelor/Master"],
    ],
    unlocked: false,
  },
  {
    id: "built-environment",
    label: "Built Environment",
    icon: "CITY",
    type: "Design/System",
    x: -0.48,
    y: 0.05,
    color: "#e0b85a",
    summary: "Architecture, urban planning, landscape, civil infrastructure, geospatial engineering, and sustainable cities.",
    courses: [
      ["Tsinghua University", "Architecture, Urban Planning, Landscape Architecture", "Undergraduate"],
      ["Oxford", "Architecture, Landscape Architecture, and Urban Planning", "Graduate research area"],
      ["ETH Zurich", "Architecture, Civil Engineering, Environmental Engineering, Geospatial Engineering", "Bachelor/Master"],
      ["Berkeley", "Architecture, City and Regional Planning, Environmental Design", "Undergraduate/Graduate"],
      ["Cambridge", "Engineering and related built-environment postgraduate pathways", "Graduate"],
    ],
    unlocked: false,
  },
  {
    id: "life-health",
    label: "Life & Health",
    icon: "BIO",
    type: "Science",
    x: 0.48,
    y: 0.1,
    color: "#79a86f",
    summary: "Biology, medicine, biomedical engineering, public health, brain sciences, neuroscience, nutrition, and human systems.",
    courses: [
      ["University of Amsterdam", "Biology, Biomedical Sciences, Psychobiology, Brain and Cognitive Sciences", "Bachelor/Master"],
      ["Harvard", "Biological Sciences, Medical Sciences, Life Sciences", "Graduate"],
      ["Oxford", "Medicine, Molecular Cell Biology, Biomedical Sciences", "Graduate"],
      ["Cambridge", "Genomic Medicine and related postgraduate courses", "Graduate"],
      ["ETH Zurich", "Biology, Health Sciences and Technology, Pharmaceutical Sciences", "Bachelor/Master"],
      ["NUS", "Dentistry, Medicine, Food Science & Technology", "Undergraduate"],
    ],
    unlocked: false,
  },
  {
    id: "earth-climate-space",
    label: "Earth, Climate & Space",
    icon: "EAR",
    type: "Science",
    x: 0.17,
    y: 0.32,
    color: "#55a06f",
    summary: "Earth systems, climate science, environmental studies, geophysics, astronomy, planetary science, and space systems.",
    courses: [
      ["University of Amsterdam", "Future Planet Studies; Global Water Challenges", "Bachelor/Minor"],
      ["MIT", "Earth, Atmospheric, and Planetary Sciences", "Subjects"],
      ["Stanford", "Earth Systems, Geophysics, Sustainability", "Departments"],
      ["ETH Zurich", "Earth and Climate Sciences, Environmental Sciences, Space Systems", "Bachelor/Master"],
      ["Tsinghua University", "Astronomy certificate and environmental/new energy graduate programmes", "Undergraduate/Graduate"],
      ["University of Tokyo", "Liberal arts plus faculty-specialized courses", "Undergraduate"],
    ],
    unlocked: false,
  },
  {
    id: "business-economics",
    label: "Business & Economics",
    icon: "ECO",
    type: "Organization",
    x: -0.08,
    y: 0.08,
    color: "#c95f46",
    summary: "Economics, finance, accounting, management, business analytics, operations, public and private-sector organization design.",
    courses: [
      ["University of Amsterdam", "Economics, Econometrics, Actuarial Science, Accountancy", "Bachelor/Master"],
      ["MIT", "Economics, Management, Supply Chain Management", "Subjects"],
      ["Harvard", "Economics, Public Policy, Social Policy", "Graduate"],
      ["Stanford", "Economics, Management Science and Engineering, Graduate School of Business", "Departments"],
      ["NUS", "Business Administration, Business Analytics", "Undergraduate"],
      ["Yanshan University", "Economics and Management College doctoral allocation", "Graduate"],
    ],
    unlocked: false,
  },
  {
    id: "law-policy-society",
    label: "Law, Policy & Society",
    icon: "LAW",
    type: "Society",
    x: 0.36,
    y: 0.42,
    color: "#4e8e76",
    summary: "Law, public policy, political science, sociology, international relations, governance, ethics, and institutions.",
    courses: [
      ["Tsinghua University", "Law, management, social sciences within 11 discipline categories", "Undergraduate"],
      ["Harvard", "Public Policy, Social Policy, Anthropology, Regional Studies", "Graduate"],
      ["Oxford", "Classics, medicine, policy-linked graduate courses", "Graduate"],
      ["Cambridge", "Postgraduate courses across academic disciplines", "Graduate"],
      ["Berkeley", "Political Science, Legal Studies, Public Health, Social Welfare", "Undergraduate/Graduate"],
      ["University of Amsterdam", "Complex Systems and Policy", "Master"],
    ],
    unlocked: false,
  },
  {
    id: "humanities-culture",
    label: "Humanities & Culture",
    icon: "HUM",
    type: "Humanities",
    x: -0.36,
    y: 0.38,
    color: "#b98945",
    summary: "History, literature, languages, philosophy, archaeology, area studies, culture, media, and interpretation.",
    courses: [
      ["University of Amsterdam", "Ancient Studies, Archaeology, American Studies, languages", "Bachelor/Master"],
      ["Oxford", "Ancient History, Classical Languages and Literature", "Graduate"],
      ["Cambridge", "Tripos-based undergraduate study across broad subject areas", "Undergraduate"],
      ["Harvard", "Humanities, Languages, History, Regional Studies", "Graduate"],
      ["MIT", "Humanities, History, Literature, Linguistics and Philosophy", "Subjects"],
      ["Berkeley", "African American Studies, Anthropology, Classics, Art Practice", "Departments"],
    ],
    unlocked: false,
  },
  {
    id: "design-media-arts",
    label: "Design, Media & Arts",
    icon: "ART",
    type: "Creative",
    x: -0.02,
    y: 0.5,
    color: "#e0b85a",
    summary: "Industrial design, media arts, writing, communication, performance, visual arts, and creative production.",
    courses: [
      ["Yanshan University", "Industrial Design, Art and Design", "Undergraduate/Doctoral allocation"],
      ["MIT", "Architecture, Media Arts and Sciences, Music, Theater Arts, Writing", "Subjects"],
      ["Stanford", "Art & Art History, Communication, Theater and Performance Studies, Design", "Departments"],
      ["NUS", "Industrial Design, Landscape Architecture, Humanities & Sciences", "Undergraduate"],
      ["University of Amsterdam", "Information Studies with Human-Computer Interaction track", "Master"],
    ],
    unlocked: false,
  },
  {
    id: "learning-education",
    label: "Learning & Education",
    icon: "EDU",
    type: "Meta-skill",
    x: 0.02,
    y: -0.08,
    color: "#2f8a62",
    summary: "Education, learning science, curriculum, assessment, research methods, knowledge mapping, and self-directed learning.",
    courses: [
      ["Stanford", "Graduate School of Education", "Graduate"],
      ["Harvard", "Graduate degree programs and cross-school learning", "Graduate"],
      ["Cambridge", "Course Directory and postgraduate qualifications", "Graduate"],
      ["University of Tokyo", "MIMA course relationship search", "Course catalogue"],
      ["Tsinghua University", "General education integrated with disciplinary specialization", "Undergraduate"],
    ],
    unlocked: false,
  },
];

const quizLevels = ["simple", "intermediate", "advanced"];
const levelLabels = ["Ocean", "Snow mountain", "Land", "Green land"];
const domainQuizzes = {
  "computing-ai": [
    {
      prompt: "Your phone unlocks by recognizing your face. Which idea is doing the hard work?",
      choices: ["AI pattern recognition", "A tiny mirror inside the screen", "The battery remembering you"],
      answer: 0,
    },
    {
      prompt: "A recipe app gets better after you rate meals. What is it learning from?",
      choices: ["Your examples and feedback", "The oven temperature only", "The app icon color"],
      answer: 0,
    },
    {
      prompt: "In machine learning, why do we keep test data separate from training data?",
      choices: ["To check whether the model generalizes beyond memorized examples", "To make the file names shorter", "To prevent computers from using numbers"],
      answer: 0,
    },
  ],
  "math-data": [
    {
      prompt: "If a shop says 'average wait time is 5 minutes', what is it trying to describe?",
      choices: ["A typical wait", "The loudest customer", "The color of the queue"],
      answer: 0,
    },
    {
      prompt: "You split a pizza fairly among four friends. Which math idea just appeared?",
      choices: ["Fractions", "Volcanology", "Typography"],
      answer: 0,
    },
    {
      prompt: "Why are vectors useful in data science?",
      choices: ["They let many features be represented as positions and directions in a space", "They turn every number into a word", "They remove the need for measurement"],
      answer: 0,
    },
  ],
  "engineering-systems": [
    {
      prompt: "A bridge must be strong, affordable, and not too heavy. What are engineers balancing?",
      choices: ["Trade-offs", "Riddles", "Musical notes"],
      answer: 0,
    },
    {
      prompt: "A thermostat turns heat on and off after reading the room temperature. What is it using?",
      choices: ["Feedback", "A dictionary", "A telescope"],
      answer: 0,
    },
    {
      prompt: "Why do engineers test prototypes before mass production?",
      choices: ["To find failure modes under real constraints before scaling", "To avoid learning anything", "To make every design identical"],
      answer: 0,
    },
  ],
  "materials-manufacturing": [
    {
      prompt: "A raincoat feels different from a frying pan. What explains the difference best?",
      choices: ["They are made from different materials", "They have different birthdays", "They use different alphabets"],
      answer: 0,
    },
    {
      prompt: "Why does a chef choose a metal pan instead of a wooden one for high heat?",
      choices: ["Metal conducts heat well and resists burning", "Wood is always transparent", "Metal is quieter"],
      answer: 0,
    },
    {
      prompt: "Why can heat treatment change the strength of steel?",
      choices: ["It changes microstructure and phase distribution inside the material", "It changes the brand name", "It makes atoms disappear"],
      answer: 0,
    },
  ],
  "built-environment": [
    {
      prompt: "A city adds a bike lane so people can move safely. Which field is most involved?",
      choices: ["Urban planning", "Deep-sea cooking", "Classical violin tuning"],
      answer: 0,
    },
    {
      prompt: "Why do buildings need both beauty and structure?",
      choices: ["People must use them safely and enjoy living or working in them", "Walls only exist for decoration", "Roofs are optional in rain"],
      answer: 0,
    },
    {
      prompt: "What does geospatial analysis add to city planning?",
      choices: ["Location-based evidence about movement, land, risk, and infrastructure", "A way to ignore maps", "A rule that all streets must be straight"],
      answer: 0,
    },
  ],
  "life-health": [
    {
      prompt: "You wash your hands before eating. Which life-health idea are you using?",
      choices: ["Reducing germs and infection risk", "Increasing screen brightness", "Changing gravity"],
      answer: 0,
    },
    {
      prompt: "Why does sleep help learning and health?",
      choices: ["The body repairs, regulates, and consolidates memory", "The brain turns off forever", "It replaces drinking water"],
      answer: 0,
    },
    {
      prompt: "Why are controlled studies important in medicine?",
      choices: ["They help separate treatment effects from chance, bias, and confounding factors", "They guarantee every person reacts the same", "They remove the need for biology"],
      answer: 0,
    },
  ],
  "earth-climate-space": [
    {
      prompt: "Clouds gather, wind changes, and rain begins. Which system are you watching?",
      choices: ["Weather", "Accounting", "Keyboard design"],
      answer: 0,
    },
    {
      prompt: "Why do coastal cities care about sea level?",
      choices: ["It affects flooding, land use, infrastructure, and safety", "It decides phone passwords", "It changes the alphabet"],
      answer: 0,
    },
    {
      prompt: "Why do climate models combine atmosphere, oceans, ice, land, and human activity?",
      choices: ["Those systems exchange energy, matter, and feedback over time", "Because one variable explains everything", "Because maps cannot show oceans"],
      answer: 0,
    },
  ],
  "business-economics": [
    {
      prompt: "You have 10 euros and two things you want. What are you facing?",
      choices: ["Scarcity and choice", "A chemistry reaction", "A lunar eclipse"],
      answer: 0,
    },
    {
      prompt: "A cafe notices croissants sell out every morning. What might it adjust?",
      choices: ["Supply, pricing, or production planning", "The moon's orbit", "The spelling of coffee"],
      answer: 0,
    },
    {
      prompt: "Why can incentives change organization behavior?",
      choices: ["They alter costs, rewards, priorities, and coordination across people", "They make strategy unnecessary", "They prevent measurement"],
      answer: 0,
    },
  ],
  "law-policy-society": [
    {
      prompt: "A crosswalk tells drivers to stop for pedestrians. What kind of social tool is it?",
      choices: ["A rule that organizes behavior", "A recipe", "A mountain range"],
      answer: 0,
    },
    {
      prompt: "Why do societies create public policies?",
      choices: ["To handle shared problems people cannot solve alone", "To name every cloud", "To avoid all decisions"],
      answer: 0,
    },
    {
      prompt: "Why is governance broader than government?",
      choices: ["It includes laws, institutions, norms, incentives, networks, and accountability", "It means rules do not matter", "It is only election day"],
      answer: 0,
    },
  ],
  "humanities-culture": [
    {
      prompt: "An old family photo helps someone tell a story about the past. Which skill is being used?",
      choices: ["Historical interpretation", "Rocket steering", "Circuit soldering"],
      answer: 0,
    },
    {
      prompt: "Why can the same story feel different in another language?",
      choices: ["Words carry culture, context, rhythm, and hidden meanings", "Translation removes all meaning", "Stories do not use language"],
      answer: 0,
    },
    {
      prompt: "Why do humanities scholars examine sources instead of accepting one version of events?",
      choices: ["Sources reveal perspective, bias, context, and contested meaning", "Because evidence is irrelevant", "Because dates never matter"],
      answer: 0,
    },
  ],
  "design-media-arts": [
    {
      prompt: "A door handle is confusing, so people push when they should pull. What failed?",
      choices: ["Design communication", "Ocean chemistry", "Tax policy"],
      answer: 0,
    },
    {
      prompt: "Why do movie posters use color, faces, and big titles carefully?",
      choices: ["To guide attention and signal mood quickly", "To hide the film's existence", "To test bridge strength"],
      answer: 0,
    },
    {
      prompt: "In design critique, why ask what audience a work is for?",
      choices: ["Because effectiveness depends on context, intention, user needs, and interpretation", "Because all audiences are identical", "Because craft cannot be discussed"],
      answer: 0,
    },
  ],
  "learning-education": [
    {
      prompt: "You forget less when you quiz yourself instead of only rereading. What are you using?",
      choices: ["Active recall", "Color theory only", "Weather prediction"],
      answer: 0,
    },
    {
      prompt: "Why does teaching a friend help you learn?",
      choices: ["It exposes gaps and forces clear explanation", "It deletes memory", "It makes examples illegal"],
      answer: 0,
    },
    {
      prompt: "Why can a knowledge map improve learning plans?",
      choices: ["It shows prerequisites, gaps, relationships, and routes through a subject", "It makes every learner the same", "It removes the need for practice"],
      answer: 0,
    },
  ],
};

let selectedDomainId = "computing-ai";
let isLoggedIn = false;
let currentUser = {
  email: "",
  name: "Kai Learner",
  avatar: "auto",
};
let savedDiscussions = [];
let domainProgress = Object.fromEntries(knowledgeDomains.map((domain) => [domain.id, 0]));
let quizLocks = {};
let lastQuizFeedback = {};
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

function drawGlobe() {
  const { size, cx, cy, radius } = canvasMetrics;
  ctx.clearRect(0, 0, size, size);

  const ocean = ctx.createRadialGradient(cx - radius * 0.36, cy - radius * 0.42, radius * 0.1, cx, cy, radius);
  ocean.addColorStop(0, "#7fc1d8");
  ocean.addColorStop(0.5, "#2b82a8");
  ocean.addColorStop(1, "#155777");

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = ocean;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  drawCartoonWaves(cx, cy, radius);
  drawOceanGrid(cx, cy, radius);
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
}

function drawCartoonWaves(cx, cy, radius) {
  ctx.strokeStyle = "rgba(255, 250, 240, 0.2)";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (let row = -3; row <= 3; row += 1) {
    for (let col = -3; col <= 3; col += 1) {
      const x = cx + col * radius * 0.28 + (row % 2) * radius * 0.08;
      const y = cy + row * radius * 0.22;
      if (Math.hypot(x - cx, y - cy) > radius * 0.82) continue;
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.045, Math.PI * 0.08, Math.PI * 0.92);
      ctx.stroke();
    }
  }
}

function drawOceanGrid(cx, cy, radius) {
  ctx.strokeStyle = "rgba(245, 241, 232, 0.12)";
  ctx.lineWidth = 1;

  for (let i = -1; i <= 1; i += 1) {
    const y = cy + (i * radius) / 3;
    const width = Math.sqrt(Math.max(radius * radius - (y - cy) * (y - cy), 0));
    ctx.beginPath();
    ctx.ellipse(cx, y, width, radius * 0.05, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = -1; i <= 1; i += 1) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * (0.28 + Math.abs(i) * 0.14), radius, i * 0.18, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawKnowledgeLinks(cx, cy, radius) {
  const points = knowledgeDomains.map((domain) => projectDomain(domain, cx, cy, radius));
  ctx.lineWidth = 1;

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i];
      const b = points[j];
      const mastered = getDomainLevel(knowledgeDomains[i].id) > 0 && getDomainLevel(knowledgeDomains[j].id) > 0;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance > radius * 0.82) continue;
      ctx.strokeStyle = mastered ? "rgba(255, 250, 240, 0.18)" : "rgba(255, 250, 240, 0.05)";
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  }
}

function drawDomain(domain, cx, cy, radius) {
  const point = projectDomain(domain, cx, cy, radius);
  const level = getDomainLevel(domain.id);
  const selected = selectedDomainId === domain.id;
  const islandSize = radius * (0.07 + seededRandom(domain.id, 3) * 0.025);

  if (level === 1) {
    drawSnowIsland(point.x, point.y, islandSize, domain);
  } else if (level === 2) {
    drawIsland(point.x, point.y, islandSize, "#c99b58", domain.id, { trees: 0, hills: true });
  } else if (level >= 3) {
    drawIsland(point.x, point.y, islandSize * 1.04, "#42a66b", domain.id, { trees: 3, hills: true });
  } else {
    drawUnknownReef(point.x, point.y, islandSize * 0.72, domain.id);
  }

  if (selected) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, islandSize * 1.45, 0, Math.PI * 2);
    ctx.strokeStyle = "#fffaf0";
    ctx.lineWidth = 2.5;
    ctx.stroke();
  }

  ctx.fillStyle = level > 0 ? "#fffaf0" : "rgba(255, 250, 240, 0.92)";
  ctx.font = `900 ${Math.max(8, islandSize * 0.42)}px Inter, system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(domain.icon, point.x, point.y + islandSize * 0.03);
}

function drawUnknownReef(x, y, size, seed) {
  drawIslandShape(x, y, size, "#1d5f82", seed);
  ctx.strokeStyle = "rgba(255, 250, 240, 0.74)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 250, 240, 0.2)";
  ctx.beginPath();
  ctx.ellipse(x - size * 0.1, y - size * 0.14, size * 0.5, size * 0.24, -0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawSnowIsland(x, y, size, domain) {
  drawIslandShape(x, y, size, "#8fb4bd", domain.id);
  ctx.strokeStyle = "rgba(255, 250, 240, 0.74)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawMountain(x - size * 0.22, y + size * 0.1, size * 0.78, "#d9f2f0", "#7b9aa3");
  drawMountain(x + size * 0.25, y + size * 0.18, size * 0.62, "#f4fbf8", domain.color);
}

function drawIsland(x, y, size, color, seed, options = {}) {
  drawIslandShape(x, y, size, color, seed);
  ctx.strokeStyle = "rgba(255, 250, 240, 0.74)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (options.hills) {
    ctx.fillStyle = "rgba(255, 250, 240, 0.25)";
    ctx.beginPath();
    ctx.ellipse(x - size * 0.18, y - size * 0.12, size * 0.42, size * 0.22, -0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let i = 0; i < (options.trees || 0); i += 1) {
    const dx = -0.36 + i * 0.34 + seededRandom(seed, i + 7) * 0.08;
    const dy = -0.02 + seededRandom(seed, i + 12) * 0.28;
    drawTree(x + dx * size, y + dy * size, size * 0.2);
  }
}

function drawIslandShape(x, y, size, color, seed) {
  ctx.beginPath();
  for (let i = 0; i < 14; i += 1) {
    const angle = (Math.PI * 2 * i) / 14;
    const wobble = 0.72 + seededRandom(seed, i) * 0.38;
    const px = x + Math.cos(angle) * size * wobble;
    const py = y + Math.sin(angle) * size * (0.64 + wobble * 0.22);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawMountain(x, y, size, snowColor, rockColor) {
  ctx.fillStyle = rockColor;
  ctx.beginPath();
  ctx.moveTo(x - size * 0.52, y + size * 0.42);
  ctx.lineTo(x, y - size * 0.5);
  ctx.lineTo(x + size * 0.55, y + size * 0.42);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = snowColor;
  ctx.beginPath();
  ctx.moveTo(x, y - size * 0.5);
  ctx.lineTo(x - size * 0.18, y - size * 0.06);
  ctx.lineTo(x + size * 0.04, y - size * 0.15);
  ctx.lineTo(x + size * 0.18, y + size * 0.03);
  ctx.closePath();
  ctx.fill();
}

function drawTree(x, y, size) {
  ctx.fillStyle = "#7a5a35";
  ctx.fillRect(x - size * 0.12, y, size * 0.24, size * 0.52);
  ctx.fillStyle = "#1f7a5c";
  ctx.beginPath();
  ctx.arc(x, y - size * 0.14, size * 0.34, 0, Math.PI * 2);
  ctx.fill();
}

function projectDomain(domain, cx, cy, radius) {
  return {
    x: cx + domain.x * radius * 1.24,
    y: cy + domain.y * radius * 1.24,
  };
}

function seededRandom(seed, offset = 0) {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i) + offset * 17) % 9973;
  }
  return (Math.sin(value + offset * 101.3) + 1) / 2;
}

function renderDomains() {
  domainList.replaceChildren();
  knowledgeDomains.forEach((domain) => {
    const level = getDomainLevel(domain.id);
    const button = document.createElement("button");
    button.className = `domain-button is-level-${level}${selectedDomainId === domain.id ? " is-selected" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="domain-icon">${escapeHtml(domain.icon)}</span>
      <span class="domain-copy">
        <strong>${escapeHtml(domain.label)}</strong>
        <span>${escapeHtml(domain.type)}</span>
      </span>
      <span class="domain-status">${levelLabels[level]}</span>
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

  const lit = knowledgeDomains.filter((domain) => getDomainLevel(domain.id) > 0).length;
  const progressPoints = knowledgeDomains.reduce((sum, domain) => sum + getDomainLevel(domain.id), 0);
  const progress = Math.round((progressPoints / (knowledgeDomains.length * 3)) * 100);
  masteredCount.textContent = `${lit} lit`;
  atlasProgress.textContent = `${progress}%`;
}

function renderSelectedDomain() {
  const domain = knowledgeDomains.find((item) => item.id === selectedDomainId) || knowledgeDomains[0];
  const level = getDomainLevel(domain.id);
  const locked = Boolean(quizLocks[domain.id]);
  const nextQuestionIndex = Math.min(level, 2);
  const nextQuestion = domainQuizzes[domain.id]?.[nextQuestionIndex];
  const quizMarkup = renderQuizMarkup(domain, level, locked, nextQuestion, nextQuestionIndex);
  const feedback = lastQuizFeedback[domain.id];
  selectedCard.innerHTML = `
    <p class="eyebrow">${escapeHtml(levelLabels[level])}</p>
    <strong>${escapeHtml(domain.label)}</strong>
    <p>${escapeHtml(domain.summary)}</p>
    ${renderLevelTrack(level)}
    ${feedback ? `<div class="quiz-feedback ${feedback.kind}">${escapeHtml(feedback.message)}</div>` : ""}
    ${quizMarkup}
  `;
  selectedCard.querySelectorAll("[data-answer-index]").forEach((button) => {
    button.addEventListener("click", () => {
      answerQuiz(domain.id, Number(button.dataset.answerIndex));
    });
  });
  const retryButton = document.getElementById("retryQuizButton");
  if (retryButton) retryButton.addEventListener("click", () => resetQuiz(domain.id));
}

function renderLevelTrack(level) {
  return `
    <div class="level-track" aria-label="Knowledge level progress">
      ${levelLabels
        .map(
          (label, index) => `
            <span class="${index === level ? "is-current" : ""}${index < level ? " is-cleared" : ""}">
              <i>${index}</i>
              ${escapeHtml(label)}
            </span>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderQuizMarkup(domain, level, locked, question, questionIndex) {
  if (level >= 3) {
    return `
      <div class="quiz-card is-complete">
        <span>Encyclopedia challenge complete</span>
        <strong>Advanced answered. This region is green land.</strong>
      </div>
    `;
  }

  if (locked) {
    return `
      <div class="quiz-card is-locked">
        <span>Challenge ended</span>
        <strong>One wrong answer stops this round.</strong>
        <button class="button secondary" type="button" id="retryQuizButton">Try this subject again</button>
      </div>
    `;
  }

  if (!question) return "";

  const levelName = quizLevels[questionIndex];
  const reward = levelLabels[questionIndex + 1];
  return `
    <div class="quiz-card">
      <span>${escapeHtml(levelName)} question -> ${escapeHtml(reward)}</span>
      <strong>${escapeHtml(question.prompt)}</strong>
      <div class="answer-grid">
        ${question.choices
          .map((choice, index) => `<button type="button" data-answer-index="${index}">${escapeHtml(choice)}</button>`)
          .join("")}
      </div>
    </div>
  `;
}

function answerQuiz(id, answerIndex) {
  const level = getDomainLevel(id);
  const question = domainQuizzes[id]?.[level];
  if (!question || quizLocks[id]) return;

  if (answerIndex === question.answer) {
    const nextLevel = Math.min(3, level + 1);
    domainProgress[id] = nextLevel;
    lastQuizFeedback[id] = {
      kind: "is-correct",
      message: getCorrectFeedback(nextLevel),
    };
  } else {
    quizLocks[id] = true;
    lastQuizFeedback[id] = {
      kind: "is-wrong",
      message: "Not yet. This island drifts back into the mist. Try again when you're ready.",
    };
  }

  selectedDomainId = id;
  renderDomains();
  renderSelectedDomain();
  drawGlobe();
  saveState();
}

function resetQuiz(id) {
  domainProgress[id] = 0;
  delete quizLocks[id];
  delete lastQuizFeedback[id];
  selectedDomainId = id;
  renderDomains();
  renderSelectedDomain();
  drawGlobe();
  saveState();
}

function getCorrectFeedback(level) {
  if (level === 1) return "Correct. A snow peak rises from the ocean.";
  if (level === 2) return "Correct. The island grows into solid land.";
  return "Correct. Green life spreads across this knowledge island.";
}

function suggestNextDomain() {
  const next = knowledgeDomains.find((domain) => getDomainLevel(domain.id) < 3 && !quizLocks[domain.id]) || knowledgeDomains[0];
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
  if (hit) {
    selectedDomainId = hit.id;
    renderDomains();
    renderSelectedDomain();
    drawGlobe();
    saveState();
  }
}

function getDomainLevel(id) {
  return Math.max(0, Math.min(3, Number(domainProgress[id] || 0)));
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
    ["Answer quiz", "Clear simple, intermediate, and advanced questions to change the region.", "Snow mountain, land, and green land mark your progress.", "Today"],
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
      domainProgress,
      quizLocks,
      lastQuizFeedback,
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
    domainProgress = { ...domainProgress, ...(state.domainProgress || {}) };
    quizLocks = state.quizLocks || {};
    lastQuizFeedback = state.lastQuizFeedback || {};

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
  addDiscussionMessage("MapKAI", "K", "Welcome. Answer a subject quiz to light your first knowledge region.");
}
if (restored) renderUser();
showPage("atlas");
