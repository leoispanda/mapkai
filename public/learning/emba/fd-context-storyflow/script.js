// MapKAI FD Academy + Executive Decision Science & Knowledge Architecture

const peopleLibrary = Object.freeze({
  "Jensen Huang": {
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Raysonho @ Open Grid Scheduler / Scalable Grid Engine",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:JensenHuangSC18.jpg"
  },
  "Satya Nadella": {
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Brian Smale / Microsoft",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:MS-Exec-Nadella-Satya-2017-08-31-22-2.jpg"
  },
  "Tim Cook": {
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Tessa Bury",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Tim_Cook_March_2026_(cropped).jpg"
  },
  "Sundar Pichai": {
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Lukasz Kobus / European Commission",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sundar_Pichai_-_2023_(cropped).jpg"
  },
  "Marc Benioff": {
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Christie Hemm Klok / Salesforce",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Marc_Benioff.jpg"
  },
  "Lisa Su": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Fuzheado",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:SXSW-2024-alih-OB7A0861-Lisa_Su_(cropped).jpg"
  },
  "Andy Jassy": {
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Lisi Mezistrano Wolf",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Andy_Jassy.jpg"
  },
  "Brian Chesky": {
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Celeste Sloman / Airbnb",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Brian_Chesky_2025.jpg"
  },
  "Demis Hassabis": {
    imageUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Christopher Michel (Cmichel67)",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Demis_Hassabis_in_2025_by_Christopher_Michel.jpg"
  },
  "David Solomon": {
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Lisa Ferdinando / U.S. Department of Defense",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:David_Solomon.jpg"
  },
  "Albert Bourla": {
    imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Ehbrooklyn96",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Albert_Bourla_in_2026.png"
  },
  "Bob Iger": {
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Village Global",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:2018_Bob_Iger_(cropped).jpg"
  },
  "C.C. Wei": {
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Office of the President, Taiwan · photo by Wang Yu Ching",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:10.27_%E7%B8%BD%E7%B5%B1%E5%87%BA%E5%B8%AD%E3%80%8C%E7%AC%AC9%E5%B1%86%E5%B7%A5%E6%A5%AD%E6%8A%80%E8%A1%93%E7%A0%94%E7%A9%B6%E9%99%A2%E9%99%A2%E5%A3%AB%E6%8E%88%E8%AD%89%E5%85%B8%E7%A6%AE%E3%80%8D_(50536154856)_(cropped).jpg"
  },
  "David Ricks": {
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Virginia Office of the Governor",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:David_A._Ricks_2025.jpg"
  },
  "Elon Musk": {
    imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Gage Skidmore",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Elon_Musk_by_Gage_Skidmore.jpg"
  },
  "Jeff Bezos": {
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "U.S. Department of Defense · Senior Master Sgt. Adrian Cadiz",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jeff_Bezos_2016_(cropped).jpg"
  },
  "Jim Farley": {
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Bill Cramer / Wonderful Machine",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Jim-farley-by-bill-cramer.jpg"
  },
  "Larry Ellison": {
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Ilan Costica",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Larry_Ellison_CEO_of_Oracle_Corporation.JPG"
  },
  "Lars Fruergaard Jørgensen": {
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "News Øresund · Kristoffer Dahl",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Klimatopm%C3%B8de_Lars_Fruergaard_J%C3%B8rgensen_Lifescience_Christiansborg_290120_(49463914018)_(cropped).jpg"
  },
  "Mary Barra": {
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Homeland Security Council / U.S. Government",
    license: "Public domain (U.S. government work)",
    licenseUrl: "https://commons.wikimedia.org/wiki/Template:PD-USGov",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mary_Barra,_official_portrait,_Homeland_Security_Council.jpg"
  },
  "Pat Gelsinger": {
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "TechCrunch",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Pat_Gelsinger_December_2025_(cropped).jpg"
  },
  "Peter Wennink": {
    imageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "European High-Tech Council Fellow",
    license: "Accredited Fellow",
    sourceUrl: ""
  },
  "Reed Hastings": {
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "J.D. Lasica",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Reed_Hastings_(50184909).jpg"
  },
  "Sam Altman": {
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&h=240&q=85",
    credit: "Village Global",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:%E2%80%9CSam_Altman%E2%80%9D_by_Village_Global_(Cropped).jpg"
  }
});

function getPortraitUrl(name) {
  const person = peopleLibrary[name];
  if (person?.imageUrl) return person.imageUrl;
  return "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&h=240&q=85";
}

function getInitialsPortraitUrl(name) {
  const initials = name.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase();
  const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="#e8e1d4"/><text x="48" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#614b2d">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallbackSvg)}`;
}

function installPortraitFallbacks(root) {
  root.querySelectorAll("img[data-portrait-name]").forEach(img => {
    img.addEventListener("error", () => {
      const name = img.dataset.portraitName;
      img.src = peopleLibrary[name]?.imageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&h=240&q=85";
    }, { once: true });
  });
}

function renderPortraitCredits() {
  const creditsEl = document.querySelector("#portrait-credit-list");
  if (!creditsEl) return;

  creditsEl.innerHTML = Object.entries(peopleLibrary).map(([name, person]) => `
    <li><strong>${name}</strong> — ${person.credit}${person.sourceUrl ? `. <a href="${person.sourceUrl}" target="_blank" rel="noopener noreferrer">Photo source</a> · <a href="${person.licenseUrl}" target="_blank" rel="noopener noreferrer">${person.license}</a>` : ""}</li>
  `).join("");
}

// 1. Stories Data (6 Full In-depth CEO Stories linked to MapKAI Knowledge Domains)
const storiesData = [
  {
    id: "story-0",
    tag: "TECHNOLOGY & ORGANIZATIONAL DESIGN",
    readTime: "Concept article · 5 min read",
    title: "Why has AI investment not yet delivered the expected productivity gains?",
    dek: "Companies have moved from experiments to deployment. The question is shifting from access to AI toward the harder work of redesigning processes, measuring returns, and managing uncertainty.",
    body: [
      "The answer cannot be found in one quarter or one company’s result. It requires context: what businesses expected, what they implemented, which constraints emerged, and how evidence changed over time.",
      "Buying AI tools does not automatically make an enterprise more productive. Knowledge work requires fundamental restructuring: <a class='k-chip' href='/categories/04' title='ISCED 0413: Management & Administration'>0413 Management &amp; Strategy ↗</a>. Moving beyond isolated prompt experiments to deeply integrated operational pipelines <a class='k-chip' href='/categories/06' title='ISCED 0613: Software & Applications'>0613 Software &amp; Applications ↗</a> is where true margin expansion begins.",
      "Furthermore, boards must calculate clear hurdle rates: <a class='k-chip' href='/categories/04' title='ISCED 0412: Finance & Capital'>0412 Corporate Finance ↗</a>. Without tying generative tools to transactional unit economics, CapEx spending remains unmeasured overhead."
    ],
    linkedDomains: [
      {
        code: "ISCED 0413",
        name: "Management and Administration",
        subfield: "Organizational Process Restructuring",
        relevance: "Firms require organizational redesign, KPI restructuring, and managerial process re-engineering rather than superficial chatbot adoption.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0412",
        name: "Finance, Banking and Insurance",
        subfield: "Corporate Finance & Capital Evaluation",
        relevance: "Evaluating capital expenditures (CapEx), return on invested capital (ROIC), and opportunity cost of delayed technology modernization.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0613",
        name: "Software & Applications Development",
        subfield: "Systems Architecture & Scalability",
        relevance: "Building multi-agent deterministic pipelines with permissioned internal database read/write access.",
        link: "/categories/06"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Process Re-engineering, Total Cost of Ownership (TCO), Agentic Orchestration vs Chatbot Interfaces.",
      recommendedModule: "MapKAI Foundation Course: Management Strategy & Workflow Operations (Day 4: Beyond the KPI Trap).",
      seminarPrompt: "If 80% of routine knowledge tasks can be automated, how should an executive board restructure management incentive bonuses?"
    },
    execLikes: [
      { name: "Jensen Huang", title: "CEO @ NVIDIA" },
      { name: "Satya Nadella", title: "CEO @ Microsoft" },
      { name: "Tim Cook", title: "CEO @ Apple" },
      { name: "Sundar Pichai", title: "CEO @ Google" }
    ],
    execLikesCount: "8,420",
    metrics: { like: 4821, celebrate: 1240, insightful: 3410, love: 980 },
    ceoComments: [
      {
        name: "Jensen Huang",
        rank: "Fortune 500 #65",
        title: "Founder, President & CEO @ NVIDIA",
        quote: "The reason productivity gains feel delayed is that enterprises are trying to graft AI onto 1990s CPU workflows. Once you modernize data centers with accelerated computing and Omniverse digital twins, the return is immediate.",
        likes: "1,420",
        time: "1h ago"
      },
      {
        name: "Satya Nadella",
        rank: "Fortune 500 #13",
        title: "Chairman and CEO @ Microsoft",
        quote: "Exactly, Jensen. In our customer deployments, task-level copilots delivered a 20% speedup, but the real productivity leap happened when multi-agent orchestrations were given permissioned access to internal enterprise context.",
        likes: "1,105",
        time: "45m ago"
      },
      {
        name: "Marc Benioff",
        rank: "Fortune 500 #127",
        title: "Chair and CEO @ Salesforce",
        quote: "The first wave of chatbots failed because they were informational toys. Our Agentforce enterprise customers are seeing real ROI because digital workers can actually execute refunds and close deals inside the database.",
        likes: "890",
        time: "30m ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.2m (~86%)",
      tldr: "Buying AI tools does not automatically boost company-wide output. Generative AI delivers exponential returns only when organizations shift from single-prompt experiments to autonomous multi-agent workflows with deep access to proprietary context.",
      consensus: "92%",
      takeaways: [
        { title: "Orchestration Trumps Monoliths", desc: "Top enterprises orchestrate lightweight specialized models with validation loops rather than relying on one giant model." },
        { title: "Context Is the True Moat", desc: "Foundation models are commoditizing; real defensibility lies in low-latency connection to proprietary CRM and code context." },
        { title: "Exception Handling Builds Trust", desc: "Silent failures destroy customer trust. Transparent reasoning traces and human checkpoints are mandatory." }
      ],
      playbook: "Audit your core operational pipeline: eliminate isolated prompt demos. Give agents transactional access to verified internal databases and measure employee hours saved within the first 48 hours.",
      replies: [
        { tone: "Insightful", text: "Spot on analysis. Shifting focus from raw model scale to permissioned context graphs and validation loops is the true differentiator for enterprise ROI." },
        { tone: "Founder Perspective", text: "We verified this firsthand: moving from conversational chatbots to background task agents with human checkpoints doubled our customer retention." }
      ]
    }
  },
  {
    id: "story-1",
    tag: "SEMICONDUCTORS & INFRASTRUCTURE",
    readTime: "Executive share · 4 min read",
    title: "NVIDIA: The $1 Trillion Accelerated Computing Shift and the Age of Physical AI",
    dek: "Jensen Huang declares general-purpose computing exhausted, forecasting a $1T transition to accelerated AI factories and highlighting Physical AI as the next frontier.",
    body: [
      "General-purpose computing has run out of steam. CPU scaling has slowed, yet computing demand continues to skyrocket exponentially. Accelerated computing <a class='k-chip' href='/categories/07' title='ISCED 0714: Electronics & Automation'>0714 Electronics &amp; Automation ↗</a> is the only path forward.",
      "The next wave is Physical AI: systems that understand physical dynamics, interacting with the real world through robotics, autonomous transport, and digital twins in Omniverse <a class='k-chip' href='/categories/06' title='ISCED 0611: Computer Science'>0611 Computer Science ↗</a>.",
      "Crucially, the scale of gigawatt clusters has shifted the critical path to energy infrastructure: <a class='k-chip' href='/categories/07' title='ISCED 0713: Electricity & Energy'>0713 Electricity &amp; Energy ↗</a>. Silicon design alone is no longer the sole determining bottleneck."
    ],
    linkedDomains: [
      {
        code: "ISCED 0714",
        name: "Electronics and Automation",
        subfield: "Semiconductor Packaging & Robotics",
        relevance: "Hardware architecture shifts from scalar CPUs to tensor cores, high-bandwidth memory (HBM), and heterogeneous supercomputers.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0611",
        name: "Computer Science & AI Simulation",
        subfield: "Digital Twin & Physics Simulation",
        relevance: "Physics-informed neural networks and Omniverse synthetic data generation for industrial robotics.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0713",
        name: "Electricity and Energy",
        subfield: "Datacenter Power Systems & Efficiency",
        relevance: "Megawatt-per-rack power constraints, liquid cooling thermal cycles, and sub-station co-location.",
        link: "/categories/07"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Accelerated Computing, Sim-to-Real Transfer, High-Bandwidth Memory (HBM3e), Thermal Dissipation Limits.",
      recommendedModule: "MapKAI Engineering & Technology Track: Industrial Electronics & Digital Twins.",
      seminarPrompt: "How does a manufacturing enterprise shift capital planning when physical equipment is simulated in software before factory tooling?"
    },
    execLikes: [
      { name: "Lisa Su", title: "CEO @ AMD" },
      { name: "Tim Cook", title: "CEO @ Apple" },
      { name: "Andy Jassy", title: "CEO @ Amazon" }
    ],
    execLikesCount: "18,920",
    metrics: { like: 12100, celebrate: 3400, insightful: 6200, love: 1800 },
    ceoComments: [
      {
        name: "Lisa Su",
        rank: "Fortune 500 #300",
        title: "Chair and CEO @ AMD",
        quote: "Couldn't agree more, Jensen. The sheer compute density required to simulate physical environments in real time demands architectural breakthroughs from silicon to system software.",
        likes: "1,840",
        time: "3h ago"
      },
      {
        name: "Andy Jassy",
        rank: "Fortune 500 #2",
        title: "President & CEO @ Amazon",
        quote: "We are seeing this transformation firsthand across AWS. Enterprises aren't just training models; they are transforming supply chains, robotics, and logistics with continuous simulation.",
        likes: "1,210",
        time: "2h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 3.8m (~84%)",
      tldr: "Jensen Huang outlines how traditional Moore's Law scaling is replaced by accelerated computing pipelines. Physical AI—applying models to robotics and manufacturing via Omniverse simulation—represents the next multitrillion-dollar industrial horizon.",
      consensus: "95%",
      takeaways: [
        { title: "Physical AI Is the Next Horizon", desc: "Software-only agents are step one; applying perception and kinematics models to physical robotics is the real frontier." },
        { title: "Sim-to-Real Acceleration", desc: "Virtual synthetic worlds (Omniverse) allow industrial robots to train through millions of hours before physical deployment." },
        { title: "Energy & Infrastructure Bottlenecks", desc: "Access to gigawatt-scale grid power and cooling capacity is now a greater strategic constraint than raw chip design." }
      ],
      playbook: "Model your data center total cost of ownership (TCO) not per chip, but per token delivered under real workloads. Prioritize domain-specific simulation infrastructure.",
      replies: [
        { tone: "Insightful", text: "Physical AI and industrial digital twins are quietly transitioning from concept to production floors far faster than most analysts projected." },
        { tone: "Founder Perspective", text: "Training our computer vision models inside simulated synthetic environments cut our edge calibration cycle from 6 months to 10 days." }
      ]
    }
  },
  {
    id: "story-2",
    tag: "ENTERPRISE PRIVACY & CLIENT ARCHITECTURE",
    readTime: "Product briefing · 3 min read",
    title: "Apple: On-Device Intelligence and the Private Cloud Security Paradigm",
    dek: "Tim Cook explains Apple's hybrid compute model: running sub-3B parameter models on-device and routing heavy inferences to custom Apple Silicon servers with verifiable cryptographic privacy.",
    body: [
      "Privacy is not an afterthought; it is the foundational architectural pillar. By performing local semantic indexing on client Neural Engines <a class='k-chip' href='/categories/06' title='ISCED 0613: Software & Systems'>0613 Software Systems ↗</a>, sensitive user context never leaves the perimeter.",
      "When multi-step reasoning requires server-scale compute, Private Cloud Compute verifies the OS image cryptographically before decrypting payloads: <a class='k-chip' href='/categories/06' title='ISCED 0612: Distributed Architecture'>0612 Distributed Networks ↗</a>.",
      "This architecture establishes compliance with global corporate governance and regulatory requirements: <a class='k-chip' href='/categories/04' title='ISCED 0421: Law & Compliance'>0421 Law &amp; Data Sovereignty ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0613",
        name: "Software & System Security",
        subfield: "Cryptographic Attestation & On-Device ML",
        relevance: "Zero-knowledge proof, client-side quantization, and ephemeral enclave execution.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0612",
        name: "Distributed Network Design",
        subfield: "Private Cloud Compute & Cloud Scheduling",
        relevance: "Verifiable server image attestation, stateless container orchestration, and low-latency packet routing.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0421",
        name: "Law and Data Governance",
        subfield: "Regulatory Compliance & Sovereignty",
        relevance: "Satisfying GDPR, HIPAA, and cross-border data transfer compliance without sacrificing AI intelligence.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Homomorphic Encryption, Attestation Security, Edge Quantization, Sovereign Cloud Boundaries.",
      recommendedModule: "MapKAI Technology Governance: Enterprise Privacy in the AI Era.",
      seminarPrompt: "Can an enterprise truly claim data compliance when proprietary customer conversations flow through third-party multi-tenant APIs?"
    },
    execLikes: [
      { name: "Sundar Pichai", title: "CEO @ Google" },
      { name: "Satya Nadella", title: "CEO @ Microsoft" },
      { name: "Jensen Huang", title: "CEO @ NVIDIA" }
    ],
    execLikesCount: "14,500",
    metrics: { like: 9400, celebrate: 2100, insightful: 4800, love: 1200 },
    ceoComments: [
      {
        name: "Sundar Pichai",
        rank: "Fortune 500 #8",
        title: "CEO @ Alphabet and Google",
        quote: "The hybrid client-cloud continuum is indeed where the entire industry is converging. Combining on-device Gemini Nano with verifiable cloud inference allows consumer trust at global scale.",
        likes: "1,520",
        time: "4h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 2.8m (~88%)",
      tldr: "Apple's hybrid AI paradigm leverages high-efficiency on-device neural hardware for everyday context, offloading heavier reasoning to cryptographically auditable Private Cloud Compute instances.",
      consensus: "89%",
      takeaways: [
        { title: "Verifiable Privacy as a Differentiator", desc: "Allowing external security researchers to inspect and audit virtual machine images in the cloud creates unprecedented institutional trust." },
        { title: "Silicon-Level Latency Optimization", desc: "Unified memory architectures on client devices enable near-instant token generation without cellular round-trip delays." },
        { title: "Contextual Awareness Without Centralization", desc: "Personal context graphs stay local; only ephemeral encrypted payloads are transmitted for complex queries." }
      ],
      playbook: "Evaluate which 80% of routine customer queries can be solved with lightweight local/edge models before sending unencrypted corporate records to public cloud endpoints.",
      replies: [
        { tone: "Insightful", text: "Verifiable cryptographic privacy in cloud compute is the prerequisite for conservative regulated industries to adopt generative AI." },
        { tone: "Founder Perspective", text: "Deploying edge models for local summarization reduced our cloud inference bill by 60% while eliminating customer data compliance hurdles." }
      ]
    }
  },
  {
    id: "story-3",
    tag: "DIGITAL WORKERS & ENTERPRISE SAAS",
    readTime: "Market analysis · 4 min read",
    title: "Salesforce: Autonomous Digital Labor Replacing Legacy FAQ Chatbots",
    dek: "Marc Benioff declares the first wave of conversational chatbots a failure, unveiling Agentforce to deploy autonomous agents with write permissions inside corporate systems of record.",
    body: [
      "Enterprise software is undergoing its largest structural disruption in thirty years. Read-only search bots were merely a prologue with high error rates.",
      "The real economic inflection point is transactional digital labor: <a class='k-chip' href='/categories/06' title='ISCED 0612: Database & Transactions'>0612 Database Systems ↗</a>. Agents must execute state-changing actions inside core databases with atomic rollback safeguards.",
      "This unlocks dramatic improvements in organizational span-of-control and personnel scalability: <a class='k-chip' href='/categories/04' title='ISCED 0413: Management'>0413 Management &amp; Labor ↗</a>, transforming customer experience pipelines: <a class='k-chip' href='/categories/04' title='ISCED 0414: Marketing & CRM'>0414 Marketing &amp; CRM ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0612",
        name: "Database & System Architecture",
        subfield: "Transactional Database Architecture",
        relevance: "ACID transactions, idempotency guards, and state machine consistency during autonomous agent actions.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0413",
        name: "Management & Workforce Strategy",
        subfield: "Workforce Strategy & Digital Labor",
        relevance: "Redesigning staffing models, employee-to-agent supervision ratios, and frontline tier-1 support roles.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0414",
        name: "Marketing & Customer Lifecycle",
        subfield: "CRM Automation & Lifecycle Marketing",
        relevance: "Automating lead scoring, real-time ticket escalation, and hyper-personalized customer journey nurturing.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Transactional Agency, Idempotent APIs, Workforce Augmentation, Customer Lifetime Value (LTV).",
      recommendedModule: "MapKAI EMBA Strategic Pillar: Digital Transformation & Enterprise Software Operations.",
      seminarPrompt: "If an AI agent makes a $50,000 refund error without human signoff, how should governance and liability be structured?"
    },
    execLikes: [
      { name: "Brian Chesky", title: "CEO @ Airbnb" },
      { name: "Satya Nadella", title: "CEO @ Microsoft" }
    ],
    execLikesCount: "11,200",
    metrics: { like: 7800, celebrate: 1900, insightful: 3900, love: 1100 },
    ceoComments: [
      {
        name: "Brian Chesky",
        rank: "Fortune 500 #450",
        title: "Co-Founder & CEO @ Airbnb",
        quote: "'Glorified FAQ search bars' describes 90% of early AI tools. The real magic happens when agents have transactional authority to solve problems end-to-end.",
        likes: "810",
        time: "6h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 2.5m (~85%)",
      tldr: "Salesforce CEO Marc Benioff critiques the billions wasted on FAQ chatbots, asserting that real business value begins when digital agents execute transactional operations inside core databases.",
      consensus: "88%",
      takeaways: [
        { title: "First-Gen Chatbots Are Dead", desc: "Read-only conversational widgets create user friction and deliver negligible operational return." },
        { title: "Transactional Agency", desc: "Agents must possess scoped authority to modify records, process refunds, and trigger backend workflows." },
        { title: "Human-to-Agent Leverage", desc: "Corporate growth will be determined by how many autonomous digital workers each knowledge worker can supervise." }
      ],
      playbook: "Equip your agent with write-access to transactional APIs. Limit its scope to one deterministic customer task and enforce strict guardrails.",
      replies: [
        { tone: "Insightful", text: "Moving from informational dialog boxes to transactional action execution is the real enterprise turning point." },
        { tone: "Founder Perspective", text: "Giving our agent direct refund authority reduced our tier-1 support backlog by 72% within the first month." }
      ]
    }
  },
  {
    id: "story-4",
    tag: "ENERGY INFRASTRUCTURE & SUPERCOMPUTING",
    readTime: "Infrastructure briefing · 4 min read",
    title: "Hyperscalers Turn to Nuclear SMRs: The Gigawatt Energy Race for AI Data Centers",
    dek: "With regional power grids maxed out, Amazon, Google, and Microsoft strike historic PPAs with Small Modular Reactor developers to guarantee clean, 24/7 baseload power.",
    body: [
      "The ultimate constraint on artificial intelligence scaling is no longer token parameters or silicon supply—it is electricity: <a class='k-chip' href='/categories/07' title='ISCED 0713: Electricity & Energy'>0713 Electricity &amp; Energy ↗</a>. Planning 1-gigawatt AI clusters requires continuous baseload energy that intermittent renewables cannot supply alone.",
      "By signing multi-decade power contracts with advanced nuclear developers, hyperscalers are vertically integrating from silicon chips down to thermal electrons: <a class='k-chip' href='/categories/07' title='ISCED 0714: Electronics & Power Distribution'>0714 Electronics &amp; Automation ↗</a>.",
      "This fundamental physical constraint links thermodynamics directly with capital allocation: <a class='k-chip' href='/categories/05' title='ISCED 0533: Physics & Thermodynamics'>0533 Applied Physics ↗</a>, reshaping the geopolitical map of datacenter real estate."
    ],
    linkedDomains: [
      {
        code: "ISCED 0713",
        name: "Electricity and Energy Engineering",
        subfield: "Nuclear SMRs & Power Grid Engineering",
        relevance: "High-voltage transmission interconnection queues, baseload capacity factors, and SMR small modular nuclear reactor thermodynamics.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0714",
        name: "Electronics & High-Density Power",
        subfield: "High-Voltage Distribution & Power Electronics",
        relevance: "Megawatt-per-row power distribution units (PDUs), 48V to 1V step-down conversion on motherboards, and direct-to-chip liquid cooling.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0533",
        name: "Applied Physics & Thermodynamics",
        subfield: "Thermodynamics & Heat Dissipation Limits",
        relevance: "Carnot efficiency of datacenter cooling, heat rejection density, and nuclear reactor containment physics.",
        link: "/categories/05"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Small Modular Reactors (SMRs), Baseload Power, Power Usage Effectiveness (PUE), Grid Interconnection Constraints.",
      recommendedModule: "MapKAI Engineering Science: Clean Energy Generation and Modern Industrial Power Grids.",
      seminarPrompt: "Should tech companies own and operate nuclear power generation assets directly, or rely on regulated public utilities?"
    },
    execLikes: [
      { name: "Andy Jassy", title: "CEO @ Amazon" },
      { name: "Jensen Huang", title: "CEO @ NVIDIA" },
      { name: "Satya Nadella", title: "CEO @ Microsoft" }
    ],
    execLikesCount: "16,400",
    metrics: { like: 10400, celebrate: 2600, insightful: 5800, love: 1400 },
    ceoComments: [
      {
        name: "Andy Jassy",
        rank: "Fortune 500 #2",
        title: "President & CEO @ Amazon",
        quote: "We reached the limit of regional utility interconnect queues. Co-locating next to zero-carbon SMRs is the only path to guarantee gigawatts of unconstrained 24/7 computing for AWS customers.",
        likes: "2,140",
        time: "2h ago"
      },
      {
        name: "Jensen Huang",
        rank: "Fortune 500 #65",
        title: "Founder & CEO @ NVIDIA",
        quote: "Compute factories require power plants directly co-located with high-density transformer clusters. Energy has officially become the foundational reserve currency of artificial intelligence.",
        likes: "1,980",
        time: "1h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 3.4m (~85%)",
      tldr: "Hyperscalers are signing historic power purchase agreements with Small Modular Reactor developers as regional electric grids fail to meet 1-gigawatt AI datacenter demands without dedicated zero-carbon baseload power.",
      consensus: "94%",
      takeaways: [
        { title: "Energy Is the Real Silicon Ceiling", desc: "Chip delivery times have dropped, but regional utility grid connection queues now extend 5-7 years into the future." },
        { title: "Nuclear SMRs Win Baseload Mandate", desc: "Intermittent wind and solar cannot sustain 99.999% datacenter uptime without uneconomic battery storage." },
        { title: "Vertical Infrastructure Integration", desc: "Leading cloud providers are transforming into integrated energy operators with on-site generation." }
      ],
      playbook: "Audit enterprise datacenter provider contracts for sovereign energy risk. Prefer facilities with dedicated behind-the-meter clean power agreements.",
      replies: [
        { tone: "Insightful", text: "The convergence of advanced nuclear physics and supercomputing is the most consequential industrial realignment of the decade." },
        { tone: "Founder Perspective", text: "Moving our batch training workloads to regions with clean hydro and nuclear power halved our energy costs while eliminating carbon penalties." }
      ]
    }
  },
  {
    id: "story-5",
    tag: "CORPORATE FINANCE & CAPITAL ALLOCATION",
    readTime: "CFO & Board analysis · 5 min read",
    title: "The Cost of Capital in the Age of Autonomous AI: Balancing $50B CapEx with ROI Metrics",
    dek: "As Big Tech CapEx exceeds $200B annually, Wall Street and corporate boards demand rigorous return on invested capital (ROIC) models to replace speculative infrastructure spending.",
    body: [
      "For the past twenty-four months, corporate AI spending was driven by FOMO—fear of missing out on foundation model access. Today, the conversation in boardrooms is dominated by the weighted average cost of capital: <a class='k-chip' href='/categories/04' title='ISCED 0412: Corporate Finance'>0412 Corporate Finance ↗</a>.",
      "CFOs are establishing strict economic hurdle rates: every dollar allocated to GPU clusters must be offset by measurable reduction in operating expenses or verifiable ARR acceleration under GAAP accounting: <a class='k-chip' href='/categories/04' title='ISCED 0411: Accounting & Taxes'>0411 Accounting &amp; Taxation ↗</a>.",
      "This marks the classical transition from the speculative installation phase to the deployment phase in economic technological revolutions: <a class='k-chip' href='/categories/03' title='ISCED 0311: Macroeconomics'>0311 Macroeconomics ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0412",
        name: "Finance, Banking & Capital Markets",
        subfield: "WACC, ROIC & Discounted Cash Flows",
        relevance: "Weighted average cost of capital (WACC), discounted cash flow (DCF) under high technological obsolescence, and return on invested capital (ROIC).",
        link: "/categories/04"
      },
      {
        code: "ISCED 0411",
        name: "Accounting and Taxation",
        subfield: "Depreciation Schedules & CapEx Accounting",
        relevance: "Accelerated depreciation schedules for 3-year GPU lifecycles and capitalized R&D software asset recognition under GAAP/IFRS.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0311",
        name: "Macroeconomics and Labor Markets",
        subfield: "Production Functions & Capital-Labor Substitution",
        relevance: "Cobb-Douglas production functions, capital-labor elasticity of substitution, and macro total factor productivity (TFP).",
        link: "/categories/03"
      }
    ],
    learningRoadmap: {
      coreConcepts: "WACC, ROIC Hurdle Rates, Capitalized R&D, Depreciation Cycles, Capital-Labor Substitution.",
      recommendedModule: "MapKAI Executive Corporate Finance: Day 1 (Cost of Capital) & Day 4 (Capital Allocation).",
      seminarPrompt: "If an AI datacenter cluster depreciates in 3 years instead of 5, what must the internal rate of return (IRR) be to justify bond financing?"
    },
    execLikes: [
      { name: "David Solomon", title: "CEO @ Goldman Sachs" },
      { name: "Satya Nadella", title: "CEO @ Microsoft" },
      { name: "Marc Benioff", title: "CEO @ Salesforce" }
    ],
    execLikesCount: "13,800",
    metrics: { like: 8900, celebrate: 2100, insightful: 4700, love: 1100 },
    ceoComments: [
      {
        name: "David Solomon",
        rank: "Fortune 500 #55",
        title: "Chairman and CEO @ Goldman Sachs",
        quote: "Boards are shifting from 'FOMO CapEx' to disciplined hurdle rates. CFOs must demand verified cash-flow generation before approving the next $10B infrastructure debt issuance.",
        likes: "2,350",
        time: "3h ago"
      },
      {
        name: "Satya Nadella",
        rank: "Fortune 500 #13",
        title: "Chairman and CEO @ Microsoft",
        quote: "Every dollar of datacenter lease commitment is mapped directly against recurring enterprise software ARR expansion. CapEx discipline creates long-term operating leverage.",
        likes: "1,790",
        time: "2h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.1m (~87%)",
      tldr: "Corporate boards are shifting AI evaluation from exploratory tech demonstrations to traditional corporate finance discipline, requiring measurable operating margin expansion to offset surging capital expenditures and rapid chip depreciation.",
      consensus: "91%",
      takeaways: [
        { title: "The 3-Year GPU Depreciation Reality", desc: "Treating server hardware with rapid obsolescence as a 5-year asset inflates stated earnings; CFOs are taking conservative write-downs." },
        { title: "Return on Invested Capital (ROIC)", desc: "Speculative pilot budgets are terminating; ongoing AI spend must demonstrate clear unit margin expansion." },
        { title: "Financing Mix Strategy", desc: "Leading tech firms are utilizing debt issuances and special-purpose vehicle (SPV) leasebacks to fund energy and compute infrastructure." }
      ],
      playbook: "Establish an internal hurdle rate (e.g. 18% ROIC) for every business unit's AI tools budget. Require quarterly verification of headcount savings or new revenue.",
      replies: [
        { tone: "Insightful", text: "Treating AI as an operational efficiency discipline rather than a novelty is where sustainable competitive advantage will be built." },
        { tone: "Founder Perspective", text: "We tied our AI software spend directly to gross margin contribution per customer, cutting our unnecessary SaaS bloat by 38%." }
      ]
    }
  },

  // Story 6: Microsoft & OpenAI
  {
    id: 6,
    tag: "CORPORATE STRATEGY & ALLIANCES",
    readTime: "5.1m read",
    title: "Microsoft's $13 Billion Asymmetric OpenAI Alliance: Restructuring Global Enterprise Cloud",
    dek: "How Satya Nadella outmaneuvered incumbent cloud rivals by trading Azure supercomputing credits for exclusive commercialization rights to frontier AI models.",
    body: [
      "In July 2019, Microsoft CEO Satya Nadella made a calculated gamble that Wall Street initially questioned: injecting $1 billion—and subsequently scaling to $13 billion—into San Francisco research lab OpenAI. Rather than pursuing a standard outright buyout, Microsoft structured an asymmetric partnership trading Azure compute credits for exclusive commercial distribution rights: <a class='k-chip' href='/categories/04' title='ISCED 0413: Management & Strategic Alliances'>0413 Management &amp; Strategy ↗</a>.",
      "Under CTO Kevin Scott, Microsoft fundamentally overhauled Azure's data center fabric, constructing massive supercomputers with tens of thousands of NVIDIA GPUs linked via non-blocking InfiniBand interconnects: <a class='k-chip' href='/categories/06' title='ISCED 0612: Cloud Architecture & High-Performance Networks'>0612 Cloud Infrastructure ↗</a>. This purpose-built infrastructure enabled OpenAI to train GPT-3.5 and GPT-4 at unprecedented scale.",
      "From a corporate valuation standpoint, Microsoft pioneered a profit-capped liquidation waterfall, capturing 75% of operating profits until its capital investment is fully recouped, all while insulating the relationship from immediate antitrust change-of-control triggers: <a class='k-chip' href='/categories/04' title='ISCED 0412: Corporate Valuation & Venture Financing'>0412 Corporate Finance ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0413",
        name: "Management & Strategic Alliances",
        subfield: "Asymmetric Joint Ventures & Governance Firewalls",
        relevance: "Structuring multi-stage corporate alliances, commercial IP licensing, and governance firewalls between corporate sponsors and agile research labs.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0612",
        name: "Cloud Infrastructure & Distributed Networks",
        subfield: "Supercomputing Clusters & InfiniBand Interconnects",
        relevance: "Designing non-blocking fat-tree network topologies and high-throughput fabric latency necessary for synchronized parameter gradient descent.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0412",
        name: "Finance, Banking & Corporate Valuation",
        subfield: "Profit-Capped Equity & Convertible Financing",
        relevance: "Valuing non-voting equity instruments, liquidation waterfalls, and milestone-gated cloud credit financing structures.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Asymmetric Corporate Alliances, Non-Voting Profit Participation, InfiniBand Fabric Latency, First-Mover Cloud Lock-In.",
      recommendedModule: "MapKAI Executive Strategy: M&A, Joint Ventures and High-Tech Strategic Partnerships.",
      seminarPrompt: "When partnering with a fast-moving AI frontier lab, should an incumbent enterprise prioritize exclusive commercial distribution rights or majority equity voting control?"
    },
    execLikes: [
      { name: "Satya Nadella", title: "CEO @ Microsoft" },
      { name: "Sam Altman", title: "CEO @ OpenAI" },
      { name: "Sundar Pichai", title: "CEO @ Google" }
    ],
    execLikesCount: 312,
    metrics: { like: 1840, comment: 426, share: 615 },
    ceoComments: [
      {
        name: "Satya Nadella",
        title: "Chairman & CEO @ Microsoft",
        rank: "Fortune 500 #13",
        quote: "We didn't buy OpenAI; we partnered with them. We brought world-class cloud infrastructure and global enterprise distribution; they brought frontier algorithmic velocity.",
        likes: "3.4k",
        time: "4h ago"
      },
      {
        name: "Sam Altman",
        title: "CEO @ OpenAI",
        rank: "Tech Pioneer",
        quote: "Microsoft built us a dedicated supercomputer that literally did not exist anywhere else on Earth. The Azure infrastructure bet made GPT-4 physically possible.",
        likes: "2.8k",
        time: "2h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.3m (~88%)",
      tldr: "Microsoft's multi-billion dollar alliance with OpenAI demonstrates how incumbent technology leaders can outflank rivals by providing dedicated high-performance compute and enterprise distribution in exchange for exclusive frontier AI intellectual property.",
      consensus: "94%",
      takeaways: [
        { title: "Asymmetric Value Exchange", desc: "Trading internal infrastructure capacity (Azure credits) rather than pure cash preserves liquidity while securing premier model access." },
        { title: "Custom Supercomputing Moat", desc: "Integrating tens of thousands of GPUs over low-latency InfiniBand networks established an infrastructure lead competitors took years to match." },
        { title: "Regulatory Isolation", desc: "Non-voting profit-capped structures allowed rapid operational integration without immediate merger clearance deadlocks." }
      ],
      playbook: "Audit internal cloud and distribution assets to identify where non-monetary strategic joint ventures can secure exclusive early access to disruptive tech startups.",
      replies: [
        { tone: "Strategic", text: "The OpenAI alliance is a textbook masterclass in corporate partnering: commercial exclusivity without bureaucratic absorption." },
        { tone: "Infrastructure", text: "Overhauling Azure's physical networking fabric was the unheralded engineering feat that turned algorithmic potential into commercial reality." }
      ]
    }
  },

  // Story 7: ASML & TSMC EUV Breakthrough
  {
    id: 7,
    tag: "SEMICONDUCTOR FABRICATION & OPTICS",
    readTime: "5.6m read",
    title: "ASML & TSMC: The $10 Billion Extreme Ultraviolet (EUV) Monopolistic Breakthrough",
    dek: "How European precision optics, molten tin laser plasma, and Taiwanese foundries conquered the physical limits of light to enable sub-5nm microchips.",
    body: [
      "For decades, the semiconductor industry faced an insurmountable physical barrier: 193nm deep ultraviolet light could no longer etch transistor gates below 10 nanometers without multi-patterning defects. Under Peter Wennink, Dutch manufacturer ASML embarked on the most complex engineering gamble in industrial history: commercializing Extreme Ultraviolet (EUV) lithography at a 13.5nm wavelength: <a class='k-chip' href='/categories/07' title='ISCED 0714: Semiconductor Nanotechnology'>0714 Electronics &amp; Automation ↗</a>.",
      "The underlying mechanics required commercializing high-power CO2 lasers firing twice at 50,000 molten tin droplets per second in a vacuum chamber, vaporizing tin into EUV-emitting plasma: <a class='k-chip' href='/categories/05' title='ISCED 0533: Optics & Laser Plasma Physics'>0533 Applied Physics &amp; Optics ↗</a>. Partner Carl Zeiss manufactured Bragg mirrors so precise that if scaled to the land area of Germany, the highest bump would measure less than one millimeter.",
      "Strategically, ASML secured customer co-investment from TSMC, Intel, and Samsung, who contributed over $5 billion in direct R&D capital: <a class='k-chip' href='/categories/04' title='ISCED 0413: Monopolistic Supply Chains'>0413 Operations &amp; Supply Chain Strategy ↗</a>. Today, every advanced AI accelerator and smartphone processor in the world depends exclusively on ASML Twinscan EUV systems."
    ],
    linkedDomains: [
      {
        code: "ISCED 0714",
        name: "Electronics and Automation",
        subfield: "Semiconductor Lithography & Sub-5nm Fabrication",
        relevance: "Wafer stage positioning with sub-nanometer interferometric accuracy and photolithographic reticle alignment.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0533",
        name: "Applied Physics & Optics",
        subfield: "Laser-Produced Plasma & Extreme Ultraviolet Optics",
        relevance: "Short-wavelength photon absorption, multilayer molybdenum-silicon dielectric mirrors, and tin droplet fluid dynamics.",
        link: "/categories/05"
      },
      {
        code: "ISCED 0413",
        name: "Management & Operations Strategy",
        subfield: "Monopolistic Supply Chain Integration & Co-Funding",
        relevance: "Customer consortium equity funding models, single-source dependency risk management, and export control geopolitical compliance.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "EUV Photolithography, Tin Plasma Physics, Customer Equity Co-Funding, Monopolistic Moats, Single-Source Resilience.",
      recommendedModule: "MapKAI Industrial Engineering & Geopolitical Supply Chain Strategy.",
      seminarPrompt: "When an entire multi-trillion-dollar global technology ecosystem depends on a single manufacturing facility in Veldhoven, how should multinational tech CEOs hedge sovereign and supply shock risks?"
    },
    execLikes: [
      { name: "Peter Wennink", title: "Former CEO @ ASML" },
      { name: "C.C. Wei", title: "CEO @ TSMC" },
      { name: "Pat Gelsinger", title: "CEO @ Intel" }
    ],
    execLikesCount: 429,
    metrics: { like: 2150, comment: 512, share: 780 },
    ceoComments: [
      {
        name: "Peter Wennink",
        title: "Former President & CEO @ ASML",
        rank: "Global Tech Monopolist",
        quote: "Everyone in the 2000s told us commercial EUV was physically impossible. It succeeded because our customers took existential equity risk alongside our engineering teams.",
        likes: "4.1k",
        time: "6h ago"
      },
      {
        name: "C.C. Wei",
        title: "Chairman & CEO @ TSMC",
        rank: "Fortune Global 500 #186",
        quote: "Without ASML's EUV breakthrough, Moore's Law would have halted dead at 7 nanometers. Yield mastery on EUV scanners is the foundational bedrock of TSMC's manufacturing moat.",
        likes: "3.7k",
        time: "3h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.7m (~87%)",
      tldr: "ASML's 20-year development of Extreme Ultraviolet (EUV) lithography created an unassailable global semiconductor monopoly by combining cutting-edge laser plasma physics with a customer equity co-funding consortium.",
      consensus: "96%",
      takeaways: [
        { title: "Defying Physical Diffraction", desc: "Transitioning from 193nm to 13.5nm wavelengths required commercializing extreme laser-produced tin plasma inside vacuum chambers." },
        { title: "Consortium Risk-Sharing", desc: "TSMC, Intel, and Samsung funded ASML's multi-billion R&D program through minority equity stakes, de-risking capital requirements." },
        { title: "Geopolitical Bottleneck", desc: "A single supplier now manufactures 100% of the world's leading-edge lithography equipment, redefining high-tech sovereignty." }
      ],
      playbook: "When pursuing generational, high-risk industrial R&D, form customer-financed risk sharing consortiums that bind key buyers directly to technological milestones.",
      replies: [
        { tone: "Industrial", text: "EUV proves that true technological moats are forged at the atomic intersection of precision mechanical engineering and applied physics." },
        { tone: "Economic", text: "ASML is the ultimate example of a natural industrial monopoly created not through pricing collusion, but sheer technological preeminence." }
      ]
    }
  },

  // Story 8: Netflix Big Data & Cloud Migration
  {
    id: 8,
    tag: "BIG DATA ANALYTICS & CLOUD RESILIENCE",
    readTime: "4.9m read",
    title: "Netflix's $100M Double Down: The Big Data Greenlight of 'House of Cards' & 100% Cloud Migration",
    dek: "How Reed Hastings decoupled streaming distribution from physical datacenter hardware while using predictive algorithmic analytics to dismantle Hollywood's pilot-season model.",
    body: [
      "In 2011, following a major database corruption event that paralyzed DVD shipments for three days, Netflix co-founder Reed Hastings took an audacious step: dismantle all company-owned server farms and migrate 100% of customer streaming to Amazon Web Services—a direct retail video competitor: <a class='k-chip' href='/categories/06' title='ISCED 0613: Distributed Software Architecture'>0613 Distributed Cloud Systems ↗</a>.",
      "To ensure zero downtime on public cloud instances, Netflix pioneered Chaos Monkey, purposefully terminating production instances during peak hours to mandate fault-tolerant, stateless software designs: <a class='k-chip' href='/categories/06' title='ISCED 0612: Database & Network Reliability'>0612 Database Reliability &amp; Telemetry ↗</a>. This cloud resilience enabled Netflix to absorb tens of millions of concurrent global streaming sessions without buffering.",
      "Simultaneously, Netflix analyzed viewing telemetry from 33 million subscribers, uncovering high overlapping affinity between David Fincher films and British political drama. Bypassing Hollywood's traditional $5 million pilot episode ritual, Netflix made a historic $100 million upfront commitment for two full seasons of 'House of Cards': <a class='k-chip' href='/categories/04' title='ISCED 0414: Marketing Analytics & LTV'>0414 Marketing Analytics &amp; LTV ↗</a>, transforming customer retention economics."
    ],
    linkedDomains: [
      {
        code: "ISCED 0612",
        name: "Database and Network Design",
        subfield: "Big Data Telemetry & Predictive Analytics",
        relevance: "Mining continuous user telemetry, collaborative filtering, completion curve metrics, and low-latency feature stores.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0613",
        name: "Software & Systems Architecture",
        subfield: "Chaos Engineering & Fault-Tolerant Microservices",
        relevance: "Designing resilient distributed microservices capable of surviving spontaneous cloud node termination and region failovers.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0414",
        name: "Marketing and Advertising",
        subfield: "Subscriber Retention & Customer Lifetime Value (LTV)",
        relevance: "Quantifying churn mitigation, CAC payback intervals, and content amortization schedules in recurring subscription models.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Chaos Engineering, Telemetry-Driven Capital Commitments, Subscriber Churn Analytics, Cloud Multi-Tenancy.",
      recommendedModule: "MapKAI Data Science & Product Analytics: Turning Telemetry into Capital Allocations.",
      seminarPrompt: "If predictive big data models can forecast 90% of user demand, under what conditions should executive leadership overrule algorithmic recommendations?"
    },
    execLikes: [
      { name: "Reed Hastings", title: "Executive Chairman @ Netflix" },
      { name: "Jeff Bezos", title: "Executive Chair @ Amazon" },
      { name: "Bob Iger", title: "CEO @ Disney" }
    ],
    execLikesCount: 388,
    metrics: { like: 1950, comment: 462, share: 640 },
    ceoComments: [
      {
        name: "Reed Hastings",
        title: "Co-Founder & Executive Chairman @ Netflix",
        rank: "Fortune 500 #115",
        quote: "We didn't bet $100 million on creative instinct alone. The viewer telemetry demonstrated an unaddressed audience of millions who would binge-watch Fincher and political drama without blinking.",
        likes: "3.2k",
        time: "5h ago"
      },
      {
        name: "Bob Iger",
        title: "CEO @ The Walt Disney Company",
        rank: "Fortune 500 #48",
        quote: "Netflix's mastery of subscriber telemetry forced traditional Hollywood studios to realize that century-old theatrical release windows were no longer defensible.",
        likes: "2.6k",
        time: "2h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.2m (~86%)",
      tldr: "Netflix's dual transformation—migrating completely to AWS cloud while greenlighting 'House of Cards' based on subscriber telemetry—pioneered modern chaos engineering and predictive content investment.",
      consensus: "93%",
      takeaways: [
        { title: "Embracing Cloud Specialization", desc: "Shutting internal datacenters freed thousands of engineers to focus exclusively on recommendation algorithms and user interfaces." },
        { title: "Chaos Monkey Architecture", desc: "Engineering for inevitable hardware failure created a fault-tolerant microservices standard adopted worldwide." },
        { title: "Direct-to-Series Economics", desc: "Replacing speculative pilot seasons with data-backed multi-season commitments maximized subscriber retention while amortizing capital costs." }
      ],
      playbook: "Transition internal IT teams from maintaining generic physical infrastructure to generating proprietary customer data insights that inform high-value capital commitments.",
      replies: [
        { tone: "Architectural", text: "The decision to run an entire entertainment business on your chief competitor's cloud infrastructure was one of the boldest decoupling strategies in corporate history." },
        { tone: "Data-Driven", text: "House of Cards proved that granular subscriber telemetry delivers far higher capital allocation accuracy than creative studio guesswork." }
      ]
    }
  },

  // Story 9: Tesla Production Hell
  {
    id: 9,
    tag: "MANUFACTURING & LIQUIDITY MANAGEMENT",
    readTime: "5.4m read",
    title: "Tesla's 'Production Hell': The Hard Limits of Automation and the Battery Gigafactory Pivot",
    dek: "How Tesla survived weeks from insolvency by recognizing the engineering boundaries between robotic automation and human dexterity on high-throughput assembly lines.",
    body: [
      "In late 2017, Tesla's target of manufacturing 5,000 Model 3 sedans per week collided with mechanical realities. Elon Musk's vision of an 'alien dreadnought'—a factory where robotic arms assembled electric cars at superhuman speeds without human operators—devolved into catastrophic assembly bottlenecks: <a class='k-chip' href='/categories/07' title='ISCED 0716: Automotive Manufacturing'>0716 Motor Vehicles &amp; Manufacturing ↗</a>.",
      "High-speed robotic manipulators failed constantly when threading flexible wiring harnesses, seating rubber weather seals, and aligning complex interior panels—tasks human assemblers accomplish intuitively: <a class='k-chip' href='/categories/07' title='ISCED 0714: Robotics & Automation Kinematics'>0714 Automation &amp; Industrial Robotics ↗</a>. Musk famously conceded on Twitter: 'Yes, excessive automation at Tesla was a mistake. To be precise, my mistake. Humans are underrated.'",
      "Burning over $1 billion per quarter with cash reserves dwindling to weeks of runway, Tesla drastically simplified production, constructed an open-air tent assembly line (GA4) in Fremont to bypass broken automated conveyors, and accelerated battery pack production with Panasonic at the Nevada Gigafactory: <a class='k-chip' href='/categories/04' title='ISCED 0412: Working Capital & Liquidity Management'>0412 Working Capital &amp; Cash Flow ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0716",
        name: "Motor Vehicles, Ships and Aircraft",
        subfield: "High-Throughput Automotive Assembly Lines",
        relevance: "Body-in-white stamping, structural battery pack integration, cycle time bottlenecks, and quality variance control.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0714",
        name: "Electronics and Automation",
        subfield: "Robotics Kinematics & Tactile Automation Limits",
        relevance: "Distinguishing rigid-body robotic handling from deformable object manipulation (rubber gaskets, wire harnesses).",
        link: "/categories/07"
      },
      {
        code: "ISCED 0412",
        name: "Finance, Banking and Insurance",
        subfield: "Working Capital, Cash Runway & Distress Financing",
        relevance: "Managing Days Sales of Inventory (DSI), inventory carrying costs, supplier payment terms, and avoiding debt covenant breaches.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Automation Overkill, Deformable Object Kinematics, Cash Burn Runway, Bottleneck Theory (Theory of Constraints).",
      recommendedModule: "MapKAI Industrial Operations: Manufacturing Throughput & Working Capital Turnaround.",
      seminarPrompt: "How does an operational executive identify when robotic capital expenditure crosses the threshold into negative marginal returns on an assembly line?"
    },
    execLikes: [
      { name: "Elon Musk", title: "CEO @ Tesla" },
      { name: "Mary Barra", title: "CEO @ General Motors" },
      { name: "Jim Farley", title: "CEO @ Ford Motor" }
    ],
    execLikesCount: 465,
    metrics: { like: 2420, comment: 590, share: 810 },
    ceoComments: [
      {
        name: "Elon Musk",
        title: "Technoking & CEO @ Tesla",
        rank: "Fortune 500 #50",
        quote: "We put crazy robotic automation everywhere—conveyor networks inside conveyor networks. We had to take a sledgehammer and rip half of it out to let human workers build the car.",
        likes: "4.8k",
        time: "7h ago"
      },
      {
        name: "Mary Barra",
        title: "Chair & CEO @ General Motors",
        rank: "Fortune 500 #21",
        quote: "Automotive assembly is a brutal physical discipline. Automating for the sake of novelty without respecting tactile ergonomics and tolerance stack-ups will paralyze any factory.",
        likes: "3.5k",
        time: "4h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.6m (~87%)",
      tldr: "Tesla's Model 3 'Production Hell' highlights the operational risks of premature over-automation, proving that rigid industrial robotics cannot easily match human sensory adaptation in deformable assembly tasks.",
      consensus: "95%",
      takeaways: [
        { title: "The Deformable Parts Trap", desc: "Automating rigid steel stamping is solved; handling flexible hoses, seals, and wires with robotic grippers causes catastrophic downtime." },
        { title: "Pragmatic Improvisation", desc: "Erecting an outdoor tent line (GA4) in days bypassed hundreds of millions in stalled automation, restoring factory cash flow." },
        { title: "Vertical Battery Co-Location", desc: "Partnering with Panasonic inside the Gigafactory compressed battery transport lead times from weeks to minutes." }
      ],
      playbook: "When designing high-throughput operations, automate only standardized, rigid steps; deploy human workers where flexible dexterity and visual inspection prevent assembly stalls.",
      replies: [
        { tone: "Operational", text: "Musk's willingness to publicly admit that 'humans are underrated' and scrap broken robots saved Tesla from chapter 11." },
        { tone: "Manufacturing", text: "True lean manufacturing is not about maximizing robot headcount—it is about minimizing takt time variance and bottlenecks." }
      ]
    }
  },

  // Story 10: Amazon AWS Cloud Utility
  {
    id: 10,
    tag: "ENTERPRISE PLATFORMS & FINANCIAL ACCOUNTING",
    readTime: "5.0m read",
    title: "Amazon AWS: Turning an Internal IT Cost Center into a $100 Billion Cloud Utility",
    dek: "How Andy Jassy and Jeff Bezos commercialized standardized compute primitives, fundamentally converting global tech financing from upfront CapEx to variable OpEx.",
    body: [
      "In 2003 at an executive retreat, Amazon leadership examined an internal bottleneck: every retail engineering group was wasting up to three months reinventing basic storage backends and database plumbing before building customer-facing features: <a class='k-chip' href='/categories/04' title='ISCED 0413: Strategic Capability Monetization'>0413 Strategic Process Architecture ↗</a>.",
      "Andy Jassy led a stealth team to isolate fundamental primitives—storage (S3), compute (EC2), and message queues (SQS)—wrapping hardware virtualization in clean REST APIs: <a class='k-chip' href='/categories/06' title='ISCED 0612: Cloud Systems & Virtualization'>0612 Cloud Systems &amp; Virtualization ↗</a>. In March 2006, Simple Storage Service (S3) launched at $0.15 per gigabyte per month.",
      "The true economic inflection was financial: AWS completely transformed technology accounting. Startups and enterprises no longer needed to budget millions in upfront capital expenditures (CapEx) for physical servers; compute became a variable operating expense (OpEx) paid by the minute on a corporate credit card: <a class='k-chip' href='/categories/04' title='ISCED 0412: CapEx to OpEx Accounting'>0412 Financial Accounting &amp; Pricing Models ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0612",
        name: "Database and Network Design",
        subfield: "Multi-Tenant Cloud Virtualization & Distributed Primitives",
        relevance: "Hardware hypervisors, distributed block storage replication, multi-tenant isolation, and elastic load balancing.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0412",
        name: "Finance, Banking and Insurance",
        subfield: "CapEx to OpEx Shift & Marginal Infrastructure Pricing",
        relevance: "Accounting treatment of leased cloud capacity versus capitalized hardware asset depreciation on corporate balance sheets.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0413",
        name: "Management and Administration",
        subfield: "Platform Modularization & Internal Capability Monetization",
        relevance: "Decoupling organizational capability into external two-sided API platforms and managing developer ecosystem flywheel dynamics.",
        link: "/categories/04"
      }
    ],
    learningRoadmap: {
      coreConcepts: "Two-Sided Platform Economics, Infrastructure as a Service (IaaS), CapEx vs OpEx Financial Modeling, API Primitives.",
      recommendedModule: "MapKAI Executive Platform Strategy: Transforming Enterprise Cost Centers into Profit Engines.",
      seminarPrompt: "If cloud computing shifts fixed infrastructure depreciation into variable operating cash outflows, how does this alter a firm's operational leverage and enterprise valuation multiples?"
    },
    execLikes: [
      { name: "Andy Jassy", title: "CEO @ Amazon" },
      { name: "Jeff Bezos", title: "Executive Chair @ Amazon" },
      { name: "Larry Ellison", title: "CTO @ Oracle" }
    ],
    execLikesCount: 512,
    metrics: { like: 2680, comment: 630, share: 890 },
    ceoComments: [
      {
        name: "Andy Jassy",
        title: "President & CEO @ Amazon",
        rank: "Fortune 500 #2",
        quote: "We realized every engineering team was doing the undifferentiated heavy lifting of infrastructure. By providing reliable primitives, we let developers focus entirely on their customer value.",
        likes: "4.3k",
        time: "8h ago"
      },
      {
        name: "Larry Ellison",
        title: "Chairman & CTO @ Oracle",
        rank: "Fortune 500 #82",
        quote: "We initially scoffed at AWS as a toy for cash-poor startups. By the time Fortune 500 banks began migrating mission-critical workloads, Amazon had established a seven-year head start.",
        likes: "3.6k",
        time: "5h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.4m (~88%)",
      tldr: "AWS transformed corporate computing by turning internal IT infrastructure into modular, pay-as-you-go primitives, pioneering cloud multi-tenancy and shifting global IT expenditures from CapEx to OpEx.",
      consensus: "97%",
      takeaways: [
        { title: "Primitive-Based Architecture", desc: "Rather than building complex bespoke applications, offering raw storage, compute, and queuing primitives fostered universal developer adoption." },
        { title: "Financial Model Disruption", desc: "Eliminating multi-million-dollar upfront hardware leases lowered the capital barrier to launch enterprise-grade software to zero." },
        { title: "Monetizing Internal Tooling", desc: "Converting an internal cost center into an external utility created the primary profit engine of a trillion-dollar conglomerate." }
      ],
      playbook: "Identify internal shared services and operational infrastructure within your firm that could be standardized into external APIs or service units.",
      replies: [
        { tone: "Financial", text: "The CapEx to OpEx transition unlocked an entire generation of software startups that could scale to billions without owning a single server rack." },
        { tone: "Strategic", text: "AWS is the gold standard for platform strategy: package your hardest internal operational challenges into external developer primitives." }
      ]
    }
  },

  // Story 11: Novo Nordisk GLP-1 Revolution
  {
    id: 11,
    tag: "PHARMACEUTICAL BIOLOGY & HEALTH ECONOMICS",
    readTime: "5.5m read",
    title: "Novo Nordisk & Eli Lilly: The GLP-1 Metabolic Revolution & Macro Healthcare Economics",
    dek: "How two pharmaceutical giants scaled peptide chemistry into the largest drug class in history, reshaping corporate market capitalizations and sovereign health budgets.",
    body: [
      "In 2021, the US FDA approved semaglutide for chronic weight management under the brand name Wegovy. Developed by Denmark's Novo Nordisk under CEO Lars Fruergaard Jørgensen, the therapeutic peptide mimicked native glucagon-like peptide-1 (GLP-1), stimulating insulin secretion while delaying gastric emptying and signaling satiety directly to the brain: <a class='k-chip' href='/categories/09' title='ISCED 0916: Peptide Drug Formulation'>0916 Pharmaceutical Chemistry ↗</a>.",
      "Landmark clinical trials like SELECT confirmed not only 15% to 20% weight loss, but a 20% reduction in major adverse cardiovascular events (stroke and myocardial infarction): <a class='k-chip' href='/categories/09' title='ISCED 0912: Clinical Medicine & Cardiology'>0912 Clinical Medicine &amp; Epidemiology ↗</a>. The unprecedented global demand prompted Novo Nordisk's controlling foundation to execute a $16.5 billion acquisition of sterile fill-finish manufacturer Catalent.",
      "Economically, the GLP-1 wave triggered ripples across the Fortune 500: Walmart reported shifts in grocery shopping baskets, airlines modeled fuel savings from lighter passenger weights, while sovereign healthcare payers grappled with the fiscal solvency of covering lifelong $1,000-per-month treatments: <a class='k-chip' href='/categories/03' title='ISCED 0311: Macro Health Economics'>0311 Health Economics &amp; Fiscal Policy ↗</a>."
    ],
    linkedDomains: [
      {
        code: "ISCED 0916",
        name: "Pharmacy and Pharmacology",
        subfield: "Peptide Synthesis & Sterile Fill-Finish Manufacturing",
        relevance: "Recombinant DNA peptide expression, lipid acylation for half-life extension, and aseptic autoinjector cartridge filling lines.",
        link: "/categories/09"
      },
      {
        code: "ISCED 0912",
        name: "Clinical Medicine and Surgery",
        subfield: "Metabolic Endocrinology & Cardiovascular Risk",
        relevance: "Neuro-endocrine signaling pathways, visceral adipose reduction, and clinical endpoint trials (MACE-3).",
        link: "/categories/09"
      },
      {
        code: "ISCED 0311",
        name: "Economics and Econometrics",
        subfield: "Health Economics, Payer Solvency & Macro Productivity",
        relevance: "Quality-Adjusted Life Years (QALY), lifetime chronic disease medical cost offsets, and consumer packaged goods consumption elasticity.",
        link: "/categories/03"
      }
    ],
    learningRoadmap: {
      coreConcepts: "GLP-1 Receptor Agonists, Sterile Fill-Finish Supply Chains, QALY Cost-Effectiveness, Consumer Calorie Elasticity.",
      recommendedModule: "MapKAI Life Sciences & Healthcare Strategy: Commercializing Blockbuster Biologics.",
      seminarPrompt: "If a chronic medication reduces national cardiovascular mortality by 20% but consumes 15% of total public healthcare budgets at current pricing, how should governments and insurers negotiate value-based reimbursement?"
    },
    execLikes: [
      { name: "Lars Fruergaard Jørgensen", title: "CEO @ Novo Nordisk" },
      { name: "David Ricks", title: "CEO @ Eli Lilly" },
      { name: "Albert Bourla", title: "CEO @ Pfizer" }
    ],
    execLikesCount: 478,
    metrics: { like: 2310, comment: 540, share: 720 },
    ceoComments: [
      {
        name: "Lars Fruergaard Jørgensen",
        title: "President & CEO @ Novo Nordisk",
        rank: "Europe's Most Valuable Firm",
        quote: "We spent 30 years researching diabetes biology before unlocking obesity. This is not cosmetic; it is an intervention in the biological root cause of chronic metabolic disease.",
        likes: "4.5k",
        time: "6h ago"
      },
      {
        name: "David Ricks",
        title: "Chair & CEO @ Eli Lilly",
        rank: "Fortune 500 #127",
        quote: "GLP-1 and dual GIP agonists represent the largest drug class in pharmaceutical history. Expanding sterile injectable manufacturing capacity is the defining capital challenge.",
        likes: "3.8k",
        time: "3h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 4.9m (~89%)",
      tldr: "Novo Nordisk and Eli Lilly transformed peptide biotechnology into a half-trillion-dollar pharmaceutical industry, proving that addressing biological satiety pathways dramatically reduces cardiovascular disease while disrupting global food and healthcare economics.",
      consensus: "95%",
      takeaways: [
        { title: "Peptide Engineering Breakthrough", desc: "Chemical acylation with fatty acid side chains extended native GLP-1's half-life from two minutes to one week." },
        { title: "Sterile Fill-Finish Bottleneck", desc: "The critical manufacturing constraint is not active pharmaceutical ingredient (API) synthesis, but sterile cartridge injection assembly." },
        { title: "Macroeconomic Cross-Impact", desc: "Reduced caloric intake affects food retail, aviation fuel consumption, and insurance actuarial tables across the economy." }
      ],
      playbook: "Assess how biological interventions in chronic human health and longevity will alter consumer behavior, insurance underwriting, and workforce productivity in your sector.",
      replies: [
        { tone: "Biopharmaceutical", text: "GLP-1 proves that breakthrough commercial success comes from decades of persistent basic biological science before market realization." },
        { tone: "Macroeconomic", text: "The ripple effects on consumer packaged goods and healthcare budget solvency make GLP-1 a macro phenomenon, not just a pharmaceutical drug." }
      ]
    }
  }
];

// 2. Dashboard Sector & Category Data (7 Categories, Total 499 Stories)
const categoriesData = [
  {
    id: "cat-ai",
    filterGroup: "tech",
    name: "Generative AI & Core Models",
    subtitle: "Hyperscale Compute, LLMs & Training Clusters",
    icon: "💻",
    count: 142,
    percentage: 28.5,
    growth: "+18%",
    isHot: true,
    color: "#d95328",
    activeCeos: [
      { name: "Jensen Huang", title: "NVIDIA CEO" },
      { name: "Satya Nadella", title: "Microsoft CEO" },
      { name: "Sundar Pichai", title: "Google CEO" }
    ],
    topHeadline: "Why has AI investment not yet delivered expected productivity gains?",
    topStoryId: 0,
    executiveTakeaway: "92% of enterprise leaders shifting from chatbot experiments to autonomous multi-agent systems with transactional permissions."
  },
  {
    id: "cat-chips",
    filterGroup: "tech",
    name: "Semiconductors & Compute",
    subtitle: "Accelerators, Silicon Packaging & Physical AI",
    icon: "⚡",
    count: 98,
    percentage: 19.6,
    growth: "+24%",
    isHot: true,
    color: "#b45309",
    activeCeos: [
      { name: "Jensen Huang", title: "NVIDIA CEO" },
      { name: "Lisa Su", title: "AMD CEO" },
      { name: "Andy Jassy", title: "Amazon CEO" }
    ],
    topHeadline: "NVIDIA: The $1 Trillion Accelerated Shift and Age of Physical AI",
    topStoryId: 1,
    executiveTakeaway: "General-purpose CPU scaling exhausted; Physical AI simulation and Omniverse digital twins driving $1T data center overhaul."
  },
  {
    id: "cat-saas",
    filterGroup: "enterprise",
    name: "Enterprise Software & Digital Labor",
    subtitle: "Agentic Workflows, SaaS Copilots & Enterprise Systems",
    icon: "☁️",
    count: 76,
    percentage: 15.2,
    growth: "+12%",
    isHot: false,
    color: "#0a66c2",
    activeCeos: [
      { name: "Marc Benioff", title: "Salesforce CEO" },
      { name: "Brian Chesky", title: "Airbnb CEO" }
    ],
    topHeadline: "Salesforce: Autonomous Digital Labor Replacing Legacy FAQ Chatbots",
    topStoryId: 3,
    executiveTakeaway: "First-gen chat widgets discarded; agents executing actual write actions inside CRM databases deliver 70%+ backlog reduction."
  },
  {
    id: "cat-consumer",
    filterGroup: "tech",
    name: "Consumer Platforms & Edge Devices",
    subtitle: "Edge Inference, Neural Engines & Privacy Architecture",
    icon: "📱",
    count: 64,
    percentage: 12.8,
    growth: "+9%",
    isHot: false,
    color: "#475569",
    activeCeos: [
      { name: "Tim Cook", title: "Apple CEO" },
      { name: "Sundar Pichai", title: "Google CEO" }
    ],
    topHeadline: "Apple: On-Device Private Cloud Intelligence Architecture",
    topStoryId: 2,
    executiveTakeaway: "Silicon-level cryptographic privacy and on-device neural engines solve enterprise data leak anxiety."
  },
  {
    id: "cat-energy",
    filterGroup: "hot",
    name: "Energy, Nuclear & Datacenter Utilities",
    subtitle: "Clean Energy, SMR Reactors & Datacenter Utilities",
    icon: "🔋",
    count: 48,
    percentage: 9.6,
    growth: "+31%",
    isHot: true,
    color: "#15803d",
    activeCeos: [
      { name: "Andy Jassy", title: "Amazon CEO" },
      { name: "Satya Nadella", title: "Microsoft CEO" }
    ],
    topHeadline: "Hyperscalers Turn to Nuclear SMRs: The Gigawatt Energy Race for AI Data Centers",
    topStoryId: 4,
    executiveTakeaway: "Gigawatt-scale AI computing creates unprecedented baseload energy demand, triggering nuclear revitalisation."
  },
  {
    id: "cat-finance",
    filterGroup: "enterprise",
    name: "Capital Markets & Tech M&A",
    subtitle: "Tech M&A, VC Allocations & CapEx Depreciation",
    icon: "🏦",
    count: 42,
    percentage: 8.4,
    growth: "+6%",
    isHot: false,
    color: "#6366f1",
    activeCeos: [
      { name: "David Solomon", title: "Goldman Sachs CEO" },
      { name: "Marc Benioff", title: "Salesforce CEO" }
    ],
    topHeadline: "The Cost of Capital in the Age of Autonomous AI: Balancing $50B CapEx with ROI Metrics",
    topStoryId: 5,
    executiveTakeaway: "Balance sheets deployed aggressively to acquire specialized engineering teams and proprietary datasets."
  },
  {
    id: "cat-robotics",
    filterGroup: "tech",
    name: "Industrial Robotics & Automation",
    subtitle: "Industrial Automation, Actuators & Physical Embodiment",
    icon: "🤖",
    count: 29,
    percentage: 5.8,
    growth: "+15%",
    isHot: false,
    color: "#0891b2",
    activeCeos: [
      { name: "Jensen Huang", title: "NVIDIA CEO" },
      { name: "Lisa Su", title: "AMD CEO" }
    ],
    topHeadline: "Tesla's 'Production Hell': The Hard Limits of Automation on Assembly Lines",
    topStoryId: 9,
    executiveTakeaway: "Excessive robotics on flexible components paralyzed factory lines; Tesla's turnaround proved human dexterity remains essential."
  }
];

// 3. MapKAI Knowledge Architecture Overview Data (Dashboard Cross-Map)
const overviewKnowledgeDomains = [
  {
    code: "ISCED 0613",
    name: "Software & Applications",
    subfield: "Applied Software Systems & Agentic Frameworks",
    connections: 184,
    link: "/categories/06",
    focus: "Multi-agent pipelines, database transactions, API security"
  },
  {
    code: "ISCED 0413",
    name: "Management & Strategy",
    subfield: "Strategic Leadership & Process Architecture",
    connections: 156,
    link: "/categories/04",
    focus: "Workflow re-engineering, digital labor management, KPI redesign"
  },
  {
    code: "ISCED 0714",
    name: "Electronics & Automation",
    subfield: "Semiconductor Silicon & Industrial Robotics",
    connections: 128,
    link: "/categories/07",
    focus: "GPU architectures, high-bandwidth memory, robotics kinematics"
  },
  {
    code: "ISCED 0412",
    name: "Finance, Banking & Capital",
    subfield: "Capital Markets, Valuation & Corporate Finance",
    connections: 98,
    link: "/categories/04",
    focus: "WACC, ROIC hurdle rates, infrastructure leasebacks, debt financing"
  },
  {
    code: "ISCED 0713",
    name: "Electricity & Energy Systems",
    subfield: "Nuclear SMRs, Grid Infrastructure & Power Grids",
    connections: 74,
    link: "/categories/07",
    focus: "SMR nuclear power, megawatt datacenter grids, baseload cooling"
  },
  {
    code: "ISCED 0533",
    name: "Applied Physics & Optics",
    subfield: "Laser Plasma, Extreme Ultraviolet & Thermodynamics",
    connections: 62,
    link: "/categories/05",
    focus: "EUV photolithography, sub-nanometer mirrors, datacenter Carnot cooling"
  },
  {
    code: "ISCED 0716",
    name: "Motor Vehicles & Manufacturing",
    subfield: "High-Throughput Automotive & Industrial Assembly",
    connections: 58,
    link: "/categories/07",
    focus: "Factory automation limits, structural battery packs, cycle-time bottlenecks"
  },
  {
    code: "ISCED 0612",
    name: "Cloud & Network Infrastructure",
    subfield: "Distributed Virtualization & High-Throughput Fabrics",
    connections: 88,
    link: "/categories/06",
    focus: "InfiniBand clusters, Chaos Monkey fault-tolerance, multi-tenant IaaS"
  },
  {
    code: "ISCED 0916",
    name: "Pharmacy & Biotechnology",
    subfield: "Peptide Synthesis & Sterile Biologics Formulation",
    connections: 45,
    link: "/categories/09",
    focus: "GLP-1 receptor agonists, aseptic fill-finish lines, recombinant expression"
  },
  {
    code: "ISCED 0311",
    name: "Macroeconomics & Health Policy",
    subfield: "Factor Substitution & Healthcare Solvency",
    connections: 52,
    link: "/categories/03",
    focus: "Capital-labor substitution, QALY cost-effectiveness, consumer calorie shifts"
  }
];

// 4. Executive Leaderboard Data
const executiveLeaderboard = [
  { name: "Jensen Huang", rank: "Fortune 500 #65", title: "CEO @ NVIDIA", commentsCount: 48, likesCount: "14.2k", topTopic: "Physical AI & Accelerated Computing" },
  { name: "Satya Nadella", rank: "Fortune 500 #13", title: "CEO @ Microsoft", commentsCount: 39, likesCount: "11.5k", topTopic: "Enterprise Context & Agentic Workflow" },
  { name: "David Solomon", rank: "Fortune 500 #55", title: "CEO @ Goldman Sachs", commentsCount: 34, likesCount: "12.8k", topTopic: "Cost of Capital & ROIC Hurdle Rates" },
  { name: "Marc Benioff", rank: "Fortune 500 #127", title: "CEO @ Salesforce", commentsCount: 31, likesCount: "8.9k", topTopic: "Autonomous Digital Workers (Agentforce)" },
  { name: "Andy Jassy", rank: "Fortune 500 #2", title: "CEO @ Amazon", commentsCount: 29, likesCount: "10.4k", topTopic: "Nuclear SMRs & Cloud Power Infrastructure" },
  { name: "Tim Cook", rank: "Fortune 500 #3", title: "CEO @ Apple", commentsCount: 27, likesCount: "9.4k", topTopic: "Private Cloud Compute & On-Device Neural" }
];

// 5. FD Academy 5 Executive Learning & Symposia Modules Data
const academyModulesData = [
  {
    id: "webinars",
    name: "Webinars",
    tag: "LIVE BRIEFINGS",
    badge: "Interactive Broadcast",
    icon: "🌐",
    desc: "Direct boardroom dialogues and live interactive briefings addressing urgent technological and regulatory transformations.",
    activities: [
      {
        id: "web-energy",
        moduleType: "Webinar",
        badge: "90-Min Briefing",
        title: "Gigawatt Datacenters & Nuclear SMRs: Energy Transition Realities for Hyperscale AI",
        domainCode: "ISCED 0713",
        domainName: "Electricity & Energy Engineering",
        academicHost: "FD Academy Energy Transition Center",
        enterpriseHost: "Amazon AWS Energy Systems Group",
        date: "December 2, 2026 · 16:00 CET",
        location: "Global Executive Broadcast & Boardroom Q&A",
        faculty: "Andy Jassy (Amazon) & Dr. Kathryn Huff (Advanced Reactor Systems)",
        facultyAvatars: ["Andy Jassy", "Demis Hassabis"],
        format: "Live Interactive Broadcast · Cap 100 Executives",
        seatsLeft: 42,
        linkedStoryId: 4,
        syllabus: [
          "Baseload power capacity factors: advanced nuclear SMRs vs intermittent renewables",
          "Power Purchase Agreement (PPA) contracting models with utility operators",
          "Thermal dissipation, Carnot limits, and grid interconnection queue engineering"
        ]
      },
      {
        id: "web-digital-labor",
        moduleType: "Webinar",
        badge: "Board Briefing",
        title: "The Autonomous Enterprise: Digital Labor Governance, ACID Transactions & Human Supervision",
        domainCode: "ISCED 0612",
        domainName: "Database Systems & Organization",
        academicHost: "FD Academy Institute for Digital Transformation",
        enterpriseHost: "Salesforce Enterprise Architecture Alliance",
        date: "January 8, 2027 · 17:30 CET",
        location: "Virtual Executive Sandbox",
        faculty: "Marc Benioff (Salesforce) & Prof. Shoshana Zuboff (Harvard)",
        facultyAvatars: ["Marc Benioff", "Sundar Pichai"],
        format: "Executive Roundtable & Live Agentic Sandbox Demo",
        seatsLeft: 24,
        linkedStoryId: 3,
        syllabus: [
          "Decoupling informational chatbots from state-changing transactional database agents",
          "Corporate liability, automated audit trails, and financial error containment",
          "Restructuring management spans-of-control and tier-1 workforce supervision ratios"
        ]
      },
      {
        id: "web-media-search",
        moduleType: "Webinar",
        badge: "Executive Briefing",
        title: "AI Search Disruption & Publisher IP Moats: The New Traffic Contract",
        domainCode: "ISCED 0321",
        domainName: "Journalism & Information Law",
        academicHost: "FD Academy Media & Digital Economics Lab",
        enterpriseHost: "Axel Springer & Google Global Partnerships",
        date: "January 22, 2027 · 18:00 CET",
        location: "Digital Executive Studio",
        faculty: "Sundar Pichai (Google) & Mathias Döpfner (Axel Springer)",
        facultyAvatars: ["Sundar Pichai", "Reed Hastings"],
        format: "Interactive Fireside Dialogue & Licensing Case Analysis",
        seatsLeft: 36,
        linkedStoryId: 2,
        syllabus: [
          "Synthesized answers vs referer clickthrough rates: modeling 40% organic traffic contractions",
          "Direct API indexing licensing contracts and collective bargaining frameworks",
          "Building brand attribution and subscriber walled gardens in the zero-click era"
        ]
      }
    ]
  },
  {
    id: "future-leader-masterclass",
    name: "Future Leader Masterclass",
    tag: "COHORT LABS",
    badge: "4-Week Cohort Certificate",
    icon: "🎓",
    desc: "Rigorous case-driven masterclasses designed for next-generation C-suite executives, featuring balance sheet modeling and strategic playbooks.",
    activities: [
      {
        id: "mc-capex",
        moduleType: "Future Leader Masterclass",
        badge: "4-Week Cohort Lab",
        title: "Navigating the $50B AI CapEx Hurdle: Capital Allocation & WACC in the Age of Autonomous AI",
        domainCode: "ISCED 0412",
        domainName: "Corporate Finance & Valuation",
        academicHost: "FD Academy Institute of Advanced Finance",
        enterpriseHost: "Goldman Sachs Global Investment Research",
        date: "November 18, 2026 · 17:00 CET",
        location: "Executive Case Chamber & Virtual Salon",
        faculty: "David Solomon (Goldman Sachs) & Prof. Erik Brynjolfsson (Stanford)",
        facultyAvatars: ["David Solomon", "Satya Nadella"],
        format: "Live Interactive Case Lab · Cap 35 Board Executives",
        seatsLeft: 6,
        linkedStoryId: 5,
        syllabus: [
          "Modeling accelerated 3-year GPU depreciation schedules on stated earnings",
          "WACC hurdle rates vs discounted cash flow (DCF) for $50B hyperscale infrastructure",
          "Structuring debt facilities and special-purpose vehicle (SPV) leasebacks"
        ]
      },
      {
        id: "mc-semiconductors",
        moduleType: "Future Leader Masterclass",
        badge: "Executive Certificate",
        title: "The Semiconductor Supply Chain Fortress: ASML EUV Optics, TSMC Packaging & Sovereign Fabs",
        domainCode: "ISCED 0714",
        domainName: "Electronics & Nanotechnology",
        academicHost: "FD Academy High-Tech Innovation Center",
        enterpriseHost: "European Semiconductor Industry Forum",
        date: "December 12, 2026 · 15:00 CET",
        location: "Hybrid Executive Seminar · Case Monograph Included",
        faculty: "Peter Wennink (ASML Advisory) & Dr. C.C. Wei (TSMC)",
        facultyAvatars: ["Peter Wennink", "C.C. Wei"],
        format: "Hybrid Executive Seminar · Cap 40 Leaders",
        seatsLeft: 9,
        linkedStoryId: 7,
        syllabus: [
          "13.5nm EUV laser-produced tin plasma physics and yield economics",
          "Advanced 2.5D/3D chiplet packaging and CoWoS interconnect scaling limits",
          "Single-source supplier dependency and geopolitical export control compliance"
        ]
      },
      {
        id: "mc-antitrust",
        moduleType: "Future Leader Masterclass",
        badge: "3-Week Advanced Lab",
        title: "Platform Economics & Antitrust in the Multi-Agent Computing Era",
        domainCode: "ISCED 0311",
        domainName: "Economics & Competition Law",
        academicHost: "FD Academy Center for Competition Policy",
        enterpriseHost: "Global Law & Technology Council",
        date: "January 15, 2027 · 16:30 CET",
        location: "Executive Moot Court & Strategy Lab",
        faculty: "Demis Hassabis (Google DeepMind) & Prof. Jean Tirole (Nobel Laureate)",
        facultyAvatars: ["Demis Hassabis", "Sam Altman"],
        format: "Executive Strategy Clinic · Cap 30 Leaders",
        seatsLeft: 12,
        linkedStoryId: 0,
        syllabus: [
          "Network effects in model-to-model agent handoffs and proprietary standard lock-in",
          "Merger control standards applied to minority strategic investments and talent acquisitions",
          "Structuring open foundational ecosystems while defending proprietary IP moats"
        ]
      },
      {
        id: "mc-biopharma",
        moduleType: "Future Leader Masterclass",
        badge: "Executive Certificate",
        title: "Biopharma Capital Deployment: The GLP-1 Obesity Peptide Revolution & IP Moats",
        domainCode: "ISCED 0916",
        domainName: "Pharmacy & Health Systems",
        academicHost: "FD Academy Health Economics Research Center",
        enterpriseHost: "Novo Nordisk & Eli Lilly Executive Suites",
        date: "February 5, 2027 · 17:00 CET",
        location: "Copenhagen Executive Center",
        faculty: "Lars Fruergaard Jørgensen (Novo Nordisk) & David Ricks (Eli Lilly)",
        facultyAvatars: ["Lars Fruergaard Jørgensen", "David Ricks"],
        format: "Executive Cohort Seminar · Cap 35 Leaders",
        seatsLeft: 15,
        linkedStoryId: 10,
        syllabus: [
          "Manufacturing supply-chain bottlenecks for sterile fill-finish injectable peptide pens",
          "Total societal cost-offset calculations: cardiovascular endpoints vs annual drug costs",
          "Patent lifecycle management and generic biosimilar defense strategies"
        ]
      }
    ]
  },
  {
    id: "industry-panels",
    name: "Industry Panels",
    tag: "C-SUITE DIALOGUES",
    badge: "Enterprise Leadership",
    icon: "🏢",
    desc: "High-level symposia convening Fortune 500 chief executives on operational, technological, and market disruptions.",
    activities: [
      {
        id: "panel-labor",
        moduleType: "Industry Panel",
        badge: "Executive Symposium",
        title: "The Autonomous Enterprise: Governance, Liability & Human-Agent Supervision Ratios",
        domainCode: "ISCED 0413",
        domainName: "Management & Corporate Law",
        academicHost: "FD Academy Center for Corporate Governance",
        enterpriseHost: "Salesforce & Airbnb Executive Offices",
        date: "November 25, 2026 · 18:00 CET",
        location: "Zurich Auditorium & Live Global Broadcast",
        faculty: "Prof. Shoshana Zuboff (Harvard) & Marc Benioff (Salesforce)",
        facultyAvatars: ["Marc Benioff", "Brian Chesky", "Sundar Pichai"],
        format: "Executive Roundtable & C-Suite Q&A",
        seatsLeft: 14,
        linkedStoryId: 3,
        syllabus: [
          "Board fiduciary duties in autonomous corporate decision loops",
          "Enterprise insurance policies and algorithmic error indemnity",
          "Measuring operational productivity gains vs talent friction"
        ]
      },
      {
        id: "panel-semiconductors",
        moduleType: "Industry Panel",
        badge: "Executive Symposium",
        title: "Post-Moore Silicon Architecture: Chiplet Packaging, Thermal Limits & Sovereign Fabs",
        domainCode: "ISCED 0714",
        domainName: "Electronics & Applied Physics",
        academicHost: "FD Academy High-Tech Innovation Center",
        enterpriseHost: "ASML, TSMC & Intel Technical Leadership",
        date: "December 8, 2026 · 15:30 CET",
        location: "London Science Museum & Virtual Executive Suite",
        faculty: "Peter Wennink (ASML) & Dr. C.C. Wei (TSMC)",
        facultyAvatars: ["Peter Wennink", "C.C. Wei", "Lisa Su"],
        format: "Roundtable & Sovereign Fab Briefing",
        seatsLeft: 8,
        linkedStoryId: 7,
        syllabus: [
          "Geopolitical capital subsidies vs gross fab margin sustainability",
          "Thermal density challenges in next-generation liquid-cooled chiplets",
          "Foundry customer dual-sourcing feasibility across global fabrication sites"
        ]
      },
      {
        id: "panel-energy-infra",
        moduleType: "Industry Panel",
        badge: "Executive Symposium",
        title: "Energy Transition in Enterprise Computing: Clean Megawatts vs Datacenter CapEx",
        domainCode: "ISCED 0713",
        domainName: "Energy Systems & Power Markets",
        academicHost: "FD Academy Energy Transition Center",
        enterpriseHost: "Amazon AWS & European Power Grid Alliance",
        date: "January 20, 2027 · 16:00 CET",
        location: "Stockholm Energy Pavilion & Global Stream",
        faculty: "Andy Jassy (Amazon) & European Utility Chairmen",
        facultyAvatars: ["Andy Jassy", "Jensen Huang"],
        format: "Executive Roundtable · Chatham House Rule",
        seatsLeft: 20,
        linkedStoryId: 4,
        syllabus: [
          "Behind-the-meter nuclear colocations: regulatory hurdles and grid tariff impacts",
          "Battery energy storage systems (BESS) for hyperscale peak shaving",
          "Balancing corporate net-zero pledges against skyrocketing compute baseloads"
        ]
      }
    ]
  },
  {
    id: "academic-panels",
    name: "Academic Panels",
    tag: "RESEARCH COLLOQUIA",
    badge: "Faculty Research",
    icon: "🔬",
    desc: "Convening world-class university leadership, economists, and researchers grounding modern business dilemmas in foundational science.",
    activities: [
      {
        id: "panel-coase",
        moduleType: "Academic Panel",
        badge: "Faculty Colloquium",
        title: "Algorithmic Governance & Computational Economics: Rewriting Firm Theory (Coase Meets AI)",
        domainCode: "ISCED 0311",
        domainName: "Economics of Information",
        academicHost: "FD Academy of Management & Technology",
        enterpriseHost: "Stanford HAI & MIT Sloan Economics Faculty",
        date: "December 18, 2026 · 14:00 CET",
        location: "Oxford Faculty of Social Sciences & Virtual Salon",
        faculty: "Prof. Erik Brynjolfsson (Stanford) & MIT Sloan Faculty",
        facultyAvatars: ["David Solomon", "Jensen Huang"],
        format: "Academic Seminar & Monograph Discussion",
        seatsLeft: 25,
        linkedStoryId: 0,
        syllabus: [
          "Coasean boundary-of-the-firm models under zero-marginal-cost intelligence",
          "Information asymmetry, agency theory, and automated supervisory monitoring",
          "Empirical measurement of organizational capital accumulation"
        ]
      },
      {
        id: "panel-generative-bio",
        moduleType: "Academic Panel",
        badge: "Faculty Colloquium",
        title: "Deep Generative Chemistry & Drug Design: Validation Protocols & Clinical Trials",
        domainCode: "ISCED 0512",
        domainName: "Biochemistry & Computational Biology",
        academicHost: "FD Academy Health Economics Research Center",
        enterpriseHost: "Cambridge Biomedical Campus & Oxford Health",
        date: "January 12, 2027 · 15:00 CET",
        location: "Cambridge Biomedical Campus",
        faculty: "Demis Hassabis (AlphaFold Co-Creator) & Dr. Albert Bourla",
        facultyAvatars: ["Demis Hassabis", "Albert Bourla"],
        format: "Research Fellows Colloquium · Hybrid",
        seatsLeft: 18,
        linkedStoryId: 10,
        syllabus: [
          "Protein folding de novo vs traditional high-throughput phenotypic screening",
          "Off-target toxicity prediction models and synthetic validation pipelines",
          "Accelerating Phase-1 safety dose-ranging via algorithmic patient stratification"
        ]
      },
      {
        id: "panel-isced-taxonomy",
        moduleType: "Academic Panel",
        badge: "Faculty Colloquium",
        title: "ISCED Foundational Taxonomy in Executive Decision Science: Grounding Business in Science",
        domainCode: "ISCED 0011",
        domainName: "Education & Taxonomy Systems",
        academicHost: "MapKAI Decision Science & Knowledge Lab",
        enterpriseHost: "UNESCO International Education & Higher Ed Forum",
        date: "February 10, 2027 · 16:30 CET",
        location: "Geneva Academic Center & Global Broadcast",
        faculty: "MapKAI Principal Scientists & European Higher Ed Council",
        facultyAvatars: ["Tim Cook", "Satya Nadella"],
        format: "Academic Roundtable & Ontology Demonstration",
        seatsLeft: 30,
        linkedStoryId: 1,
        syllabus: [
          "Mapping unstructured business events into UNESCO ISCED-F disciplinary taxonomy",
          "Cognitive retention in case method education via multi-dimensional knowledge graphs",
          "Cross-disciplinary synthesis: connecting physics, law, and corporate finance"
        ]
      }
    ]
  },
  {
    id: "international-panels",
    name: "International Panels",
    tag: "MULTILATERAL FORUMS",
    badge: "Global Policy",
    icon: "🌍",
    desc: "Cross-border governance, tech sovereignty, and multilateral regulation across global capital and technology markets.",
    activities: [
      {
        id: "panel-transatlantic-ai",
        moduleType: "International Panel",
        badge: "Policy Forum",
        title: "Transatlantic AI Governance & Sovereign Compute Infrastructure Forum",
        domainCode: "ISCED 0421",
        domainName: "International Law & Digital Sovereignty",
        academicHost: "FD Academy Institute for Digital Transformation",
        enterpriseHost: "European Commission AI Office & US Tech Delegation",
        date: "December 4, 2026 · 11:00 CET",
        location: "European Parliament Chambers, Brussels",
        faculty: "EU Digital Commissioner & US Special Envoy on AI",
        facultyAvatars: ["Sundar Pichai", "Satya Nadella"],
        format: "Diplomatic & C-Suite Policy Dialogue",
        seatsLeft: 16,
        linkedStoryId: 1,
        syllabus: [
          "Harmonizing EU AI Act enforcement with US Federal executive frameworks",
          "Cross-border datacenter data-residency laws and sovereign cloud boundaries",
          "Strategic compute reserves as critical national security infrastructure"
        ]
      },
      {
        id: "panel-semiconductor-trade",
        moduleType: "International Panel",
        badge: "Policy Forum",
        title: "Multilateral Semiconductor Export Controls & Bilateral Supply Chains",
        domainCode: "ISCED 0311",
        domainName: "International Trade & Geopolitics",
        academicHost: "FD Academy High-Tech Innovation Center",
        enterpriseHost: "OECD Tech Trade Governance Council",
        date: "January 18, 2027 · 10:00 CET",
        location: "Paris OECD Headquarters & Diplomatic Stream",
        faculty: "OECD Trade Directorate & ASML / TSMC Board Advisors",
        facultyAvatars: ["Peter Wennink", "C.C. Wei"],
        format: "Multilateral Assembly & Trade Briefing",
        seatsLeft: 22,
        linkedStoryId: 7,
        syllabus: [
          "Bilateral export restrictions on DUV/EUV photolithography and wafer inspection tools",
          "Near-shoring fab subsidies and WTO trade distortion assessments",
          "Critical rare-earth element (gallium, germanium) supply chain continuity"
        ]
      },
      {
        id: "panel-global-health",
        moduleType: "International Panel",
        badge: "Policy Forum",
        title: "Global Healthcare Solvency: Cross-Border Drug Pricing & Sovereign Health Funds",
        domainCode: "ISCED 0311",
        domainName: "Health Economics & Public Policy",
        academicHost: "FD Academy Health Economics Research Center",
        enterpriseHost: "World Health Organization & Nordic Health Ministers",
        date: "February 18, 2027 · 14:00 CET",
        location: "Copenhagen UN City & Virtual Chamber",
        faculty: "WHO Health Financing Directorate & Nordic Health Ministers",
        facultyAvatars: ["Lars Fruergaard Jørgensen", "Albert Bourla"],
        format: "Multilateral Roundtable & Fiscal Briefing",
        seatsLeft: 28,
        linkedStoryId: 10,
        syllabus: [
          "Reference pricing frameworks across North America, Europe, and Asia-Pacific",
          "Sovereign wealth fund co-investment in pharmaceutical manufacturing resilience",
          "Public healthcare fiscal solvency under aging demographic trajectories"
        ]
      }
    ]
  }
];

function getAllAcademySessions() {
  return academyModulesData.flatMap(m => m.activities);
}

let activeStoryIndex = 0;
let currentCategoryFilter = "all";

// Switch between Dashboard View and Reader View
function switchView(viewName) {
  const dashBtn = document.querySelector("#btn-view-dashboard");
  const readerBtn = document.querySelector("#btn-view-reader");
  const dashSection = document.querySelector("#view-dashboard-section");
  const readerSection = document.querySelector("#view-reader-section");

  if (viewName === "reader") {
    dashBtn.classList.remove("active");
    dashBtn.setAttribute("aria-selected", "false");
    readerBtn.classList.add("active");
    readerBtn.setAttribute("aria-selected", "true");

    dashSection.hidden = true;
    readerSection.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    readerBtn.classList.remove("active");
    readerBtn.setAttribute("aria-selected", "false");
    dashBtn.classList.add("active");
    dashBtn.setAttribute("aria-selected", "true");

    readerSection.hidden = true;
    dashSection.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// Render Dashboard
function renderDashboard() {
  // 1. Multi-segment Bar
  const segmentBar = document.querySelector("#multi-segment-bar");
  const legendEl = document.querySelector("#bar-legend");
  if (segmentBar) {
    segmentBar.innerHTML = categoriesData.map(c => `
      <div class="segment-item" 
           style="width: ${c.percentage}%; background-color: ${c.color};" 
           title="${c.name}: ${c.count} stories (${c.percentage}%)"
           data-cat-id="${c.id}"></div>
    `).join("");
  }

  if (legendEl) {
    legendEl.innerHTML = categoriesData.map(c => `
      <div class="legend-item" data-cat-id="${c.id}">
        <span class="legend-dot" style="background-color: ${c.color};"></span>
        <span class="legend-label">${c.name}</span>
        <span class="legend-count">${c.count} (${c.percentage}%)</span>
      </div>
    `).join("");

    legendEl.querySelectorAll(".legend-item").forEach(item => {
      item.addEventListener("click", () => {
        const catId = item.dataset.catId;
        renderCategoryCards(catId);
      });
    });
  }

  // 2. Category Cards
  renderCategoryCards("all");

  // 3. Knowledge Domains Cross-Map in Dashboard
  const domainsGridEl = document.querySelector("#domains-overview-grid");
  if (domainsGridEl) {
    domainsGridEl.innerHTML = overviewKnowledgeDomains.map(d => `
      <div class="domain-overview-item">
        <div>
          <span class="overview-code-tag">${d.code}</span>
          <div class="overview-domain-name">${d.name}</div>
          <div class="overview-sub-name">${d.subfield}</div>
          <div class="overview-count-pill">🔗 ${d.connections} News Connections</div>
          <p style="font-size:0.72rem; color:var(--fd-muted); line-height:1.4; margin-bottom:12px;">${d.focus}</p>
        </div>
        <a href="${d.link}" class="overview-link">Explore Map Domain ↗</a>
      </div>
    `).join("");
  }

  // 4. Leaderboard
  const leaderEl = document.querySelector("#leaderboard-list");
  if (leaderEl) {
    leaderEl.innerHTML = executiveLeaderboard.map((ceo, i) => `
      <div class="leaderboard-item">
        <div class="leader-left">
          <span class="leader-rank-num">#${i + 1}</span>
          <img class="leader-avatar" src="${getPortraitUrl(ceo.name)}" data-portrait-name="${ceo.name}" alt="${ceo.name}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
          <div class="leader-meta">
            <strong>${ceo.name}</strong>
            <span>${ceo.title}</span>
          </div>
        </div>
        <div class="leader-right">
          <span class="leader-topic">${ceo.topTopic}</span>
          <span class="leader-stats">Example activity: ${ceo.commentsCount} comments · ${ceo.likesCount} reactions</span>
        </div>
      </div>
    `).join("");
    installPortraitFallbacks(leaderEl);
  }

  // 5. FD Academy 5 Executive Modules & Consortium Strip
  renderAcademyModules("all");
  renderHostsConsortiumStrip();
  initModulesFilter();
}

// Render FD Academy 5 Executive Learning & Symposia Modules
function renderAcademyModules(filter = "all") {
  const gridEl = document.querySelector("#academy-modules-grid");
  if (!gridEl) return;

  const filteredModules = academyModulesData.filter(mod => {
    if (filter === "all") return true;
    return mod.id === filter;
  });

  gridEl.innerHTML = filteredModules.map(mod => {
    return `
      <article class="module-block-card" data-module-id="${mod.id}">
        <div class="module-card-header">
          <div class="module-badge-lockup">
            <span class="module-icon">${mod.icon}</span>
            <span class="module-badge">${mod.badge}</span>
          </div>
          <span class="module-count-pill">${mod.activities.length} Sessions</span>
        </div>

        <div class="module-title-row">
          <h3 class="module-title">${mod.name}</h3>
          <span class="module-tag">${mod.tag}</span>
        </div>
        <p class="module-desc">${mod.desc}</p>

        <!-- Outside Visible Activities List (Visible on Card Exterior) -->
        <div class="module-activities-list">
          ${mod.activities.map(act => `
            <div class="module-activity-item" data-activity-id="${act.id}">
              <div class="activity-top-row">
                <span class="activity-date">📅 ${act.date.split("·")[0].trim()}</span>
                <span class="activity-seats-tag">🟢 ${act.seatsLeft} seats</span>
              </div>
              <h4 class="activity-title">${act.title}</h4>
              <div class="activity-footer-line">
                <div class="activity-avatars-row">
                  ${(act.facultyAvatars || []).map(name => `
                    <img class="speaker-avatar" src="${getPortraitUrl(name)}" data-portrait-name="${name}" alt="${name}" title="${name}" loading="lazy" decoding="async">
                  `).join("")}
                  <span class="activity-speakers-names">${act.faculty.split("&")[0].trim()}</span>
                </div>
                <span class="activity-discipline-chip">${act.domainCode}</span>
              </div>
            </div>
          `).join("")}
        </div>

        <div class="module-card-footer">
          <button type="button" class="btn-open-module" data-module-id="${mod.id}">
            Explore All Masterclasses &amp; Syllabi →
          </button>
        </div>
      </article>
    `;
  }).join("");

  // Attach event click handlers
  gridEl.querySelectorAll(".module-activity-item").forEach(item => {
    item.addEventListener("click", () => {
      const actId = item.dataset.activityId;
      const allSessions = getAllAcademySessions();
      const session = allSessions.find(s => s.id === actId);
      if (session) openEventModal(session);
    });
  });

  gridEl.querySelectorAll(".btn-open-module").forEach(btn => {
    btn.addEventListener("click", () => {
      const modId = btn.dataset.moduleId;
      const mod = academyModulesData.find(m => m.id === modId);
      if (mod && mod.activities.length > 0) {
        openEventModal(mod.activities[0]);
      }
    });
  });

  installPortraitFallbacks(gridEl);
}

// Render Compact Accredited Host Consortium Strip
function renderHostsConsortiumStrip() {
  const stripEl = document.querySelector("#hosts-consortium-strip");
  if (!stripEl) return;

  stripEl.innerHTML = `
    <div class="consortium-strip-inner">
      <div class="consortium-col">
        <span class="consortium-label">ACADEMIC FOUNDING HOST</span>
        <strong>FD Academy of Management &amp; Technology</strong>
        <span class="consortium-note">EQUIS &amp; AACSB Accredited Faculty Governance</span>
      </div>
      <div class="consortium-divider"></div>
      <div class="consortium-col">
        <span class="consortium-label">KNOWLEDGE ARCHITECTURE HOST</span>
        <strong>MapKAI Decision Science &amp; Knowledge Lab</strong>
        <span class="consortium-note">UNESCO ISCED-F Disciplinary Taxonomy Compliant</span>
      </div>
      <div class="consortium-divider"></div>
      <div class="consortium-col">
        <span class="consortium-label">CORPORATE ALLIANCE CONSORTIUM</span>
        <div class="consortium-partner-chips">
          <span class="partner-chip">NVIDIA</span>
          <span class="partner-chip">Microsoft</span>
          <span class="partner-chip">Goldman Sachs</span>
          <span class="partner-chip">ASML</span>
          <span class="partner-chip">Amazon AWS</span>
          <span class="partner-chip">Novo Nordisk</span>
        </div>
      </div>
    </div>
  `;
}

// Initialize Module Filter Pills
function initModulesFilter() {
  const filterBtns = document.querySelectorAll(".module-pill");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const filter = btn.dataset.modFilter;
      renderAcademyModules(filter);
    });
  });
}

// Event Modal Handlers
function openEventModal(eventData) {
  const modal = document.querySelector("#event-modal");
  if (!modal) return;

  const typeEl = document.querySelector("#modal-event-type");
  if (typeEl) typeEl.textContent = (eventData.moduleType || eventData.type || "EXECUTIVE MASTERCLASS").toUpperCase();

  const hostEl = document.querySelector("#modal-event-host");
  if (hostEl) hostEl.textContent = eventData.academicHost || "FD Academy";

  const titleEl = document.querySelector("#modal-event-title");
  if (titleEl) titleEl.textContent = eventData.title;

  const metaEl = document.querySelector("#modal-event-meta");
  if (metaEl) metaEl.textContent = `📅 ${eventData.date} · Location: ${eventData.location || "Executive Virtual Chamber"} · Faculty: ${eventData.faculty}`;

  const domainEl = document.querySelector("#modal-event-domain");
  if (domainEl) domainEl.textContent = `🏛️ Academic Discipline: ${eventData.domainCode} ${eventData.domainName || ''}`;

  const seatsEl = document.querySelector("#modal-seats-count");
  if (seatsEl) {
    seatsEl.textContent = eventData.seatsLeft ? `🟢 ${eventData.seatsLeft} Cohort Seats Remaining · RSVP Open` : "🟢 Limited Cohort Seats Remaining";
  }

  const syllabusBox = document.querySelector("#modal-syllabus-box");
  const syllabusList = document.querySelector("#modal-syllabus-list");
  if (syllabusBox && syllabusList) {
    if (eventData.syllabus && eventData.syllabus.length > 0) {
      syllabusList.innerHTML = eventData.syllabus.map(s => `<li>${s}</li>`).join("");
      syllabusBox.hidden = false;
    } else {
      syllabusBox.hidden = true;
    }
  }

  document.querySelector("#modal-form-view").hidden = false;
  document.querySelector("#modal-success-view").hidden = true;

  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeEventModal() {
  const modal = document.querySelector("#event-modal");
  if (!modal) return;
  modal.hidden = true;
  document.body.style.overflow = "";
}

// Render Category Cards with filtering
function renderCategoryCards(filter) {
  currentCategoryFilter = filter;
  const gridEl = document.querySelector("#category-cards-grid");
  if (!gridEl) return;

  const filtered = categoriesData.filter(c => {
    if (filter === "all") return true;
    if (filter === "hot") return c.isHot;
    if (filter === "tech") return c.filterGroup === "tech";
    if (filter === "enterprise") return c.filterGroup === "enterprise";
    if (filter.startsWith("cat-")) return c.id === filter;
    return true;
  });

  gridEl.innerHTML = filtered.map(c => `
    <div class="category-card" data-cat-id="${c.id}">
      <div>
        <div class="cat-card-top">
          <div class="cat-icon-title">
            <div class="cat-icon-box">${c.icon}</div>
            <div class="cat-title-text">
              <strong>${c.name}</strong>
              <span>${c.subtitle}</span>
            </div>
          </div>
          <div class="cat-badge-wrap">
            <span class="cat-growth-tag">${c.growth}</span>
            ${c.isHot ? '<span class="cat-hot-tag">HOT 🔥</span>' : ''}
          </div>
        </div>

        <div class="cat-count-block">
          <div class="cat-big-number">
            ${c.count} <small>Articles</small>
          </div>
          <div class="cat-share-pct">${c.percentage}% share</div>
        </div>

        <div class="cat-progress-wrap">
          <div class="cat-progress-fill" style="width: ${c.percentage * 2.8}%; background-color: ${c.color};"></div>
        </div>

        <div class="cat-ceos-row">
          <span class="cat-ceos-label">People shown:</span>
          <div class="cat-ceos-stack">
            ${c.activeCeos.map(ceo => `
              <img src="${getPortraitUrl(ceo.name)}" data-portrait-name="${ceo.name}" alt="${ceo.name}" title="${ceo.name} (${ceo.title})" loading="lazy" decoding="async" referrerpolicy="no-referrer">
            `).join("")}
          </div>
        </div>

        <div class="cat-headline-box">
          <strong>FEATURED HISTORICAL CASE</strong>
          "${c.topHeadline}"
        </div>
      </div>

      <button type="button" class="cat-action-btn" data-story-id="${c.topStoryId}">
        <span>Read Story &amp; Copilot</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  `).join("");
  installPortraitFallbacks(gridEl);

  gridEl.querySelectorAll(".cat-action-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const storyId = Number(btn.dataset.storyId || 0);
      renderStory(storyId);
      switchView("reader");
    });
  });
}

// Render Reader Story (including Linked Knowledge Domains & Learning Hub)
function renderStory(index) {
  const story = storiesData[index];
  if (!story) return;

  activeStoryIndex = index;

  // Header story pills state
  document.querySelectorAll(".story-pill").forEach((pill, i) => {
    const isCur = i === index;
    pill.classList.toggle("active", isCur);
    pill.setAttribute("aria-selected", String(isCur));
  });

  // Story Metadata
  const tagEl = document.querySelector("#story-tag");
  if (tagEl) tagEl.textContent = story.tag;
  const timeEl = document.querySelector("#story-read-time");
  if (timeEl) timeEl.textContent = story.readTime;
  const titleEl = document.querySelector("#story-title");
  if (titleEl) titleEl.textContent = story.title;
  const dekEl = document.querySelector("#story-dek");
  if (dekEl) dekEl.textContent = story.dek;

  // Story Body (with in-text knowledge links)
  const bodyEl = document.querySelector("#story-body");
  if (bodyEl) {
    bodyEl.innerHTML = story.body.map(p => `<p>${p}</p>`).join("");
  }

  // Linked Knowledge Domains Box under Story
  const domainsBadgeCount = document.querySelector("#domains-badge-count");
  if (domainsBadgeCount) domainsBadgeCount.textContent = `${story.linkedDomains.length} Academic Fields`;

  const domainsListEl = document.querySelector("#story-linked-domains");
  if (domainsListEl) {
    domainsListEl.innerHTML = story.linkedDomains.map(d => `
      <div class="domain-chip-card">
        <div class="domain-card-left">
          <span class="domain-code-badge">${d.code}</span>
          <div class="domain-text-block">
            <strong>${d.name} <small style="color:var(--fd-muted); font-weight:normal;">· ${d.subfield}</small></strong>
            <span>${d.relevance}</span>
          </div>
        </div>
        <a href="${d.link}" class="domain-explore-btn">
          Explore Domain ↗
        </a>
      </div>
    `).join("");
  }

  // Executive Likes Social Proof
  const stackEl = document.querySelector("#exec-avatar-stack");
  if (stackEl) {
    stackEl.innerHTML = story.execLikes.map(exec => 
      `<img src="${getPortraitUrl(exec.name)}" data-portrait-name="${exec.name}" alt="${exec.name}" title="${exec.name} (${exec.title})" loading="lazy" decoding="async" referrerpolicy="no-referrer">`
    ).join("");
    installPortraitFallbacks(stackEl);
  }

  const likesTextEl = document.querySelector("#exec-likes-text");
  if (likesTextEl) {
    likesTextEl.innerHTML = `
      Profiles featured in this illustrative discussion: <strong>${story.execLikes[0].name}</strong> and <strong>${story.execLikes[1]?.name || 'other executives'}</strong>
    `;
  }

  // Counters
  const countLikeEl = document.querySelector("#count-like");
  if (countLikeEl) countLikeEl.textContent = story.metrics.like.toLocaleString();

  // CEO Comments
  const commentsEl = document.querySelector("#ceo-comments-list");
  if (commentsEl) {
    commentsEl.innerHTML = story.ceoComments.map(c => `
      <div class="ceo-comment-card">
        <div class="ceo-header-row">
          <img class="ceo-avatar" src="${getPortraitUrl(c.name)}" data-portrait-name="${c.name}" alt="${c.name}" loading="lazy" decoding="async" referrerpolicy="no-referrer">
          <div class="ceo-meta-text">
            <div class="ceo-name-line">
              <span>${c.name}</span>
              <span class="in-icon">in</span>
              <span class="f500-tag">Illustrative</span>
            </div>
            <div class="ceo-role-line">${c.title}</div>
          </div>
        </div>
        <div class="ceo-quote-body">"${c.quote}"</div>
        <div class="ceo-actions-line">
          <span>👍 ${c.likes} likes</span> • <span style="cursor:pointer; color:var(--fd-orange-dark); font-weight:600;">Reply</span> • <span>${c.time}</span>
        </div>
      </div>
    `).join("");
    installPortraitFallbacks(commentsEl);
  }

  // Copilot Panel
  const timeBadgeEl = document.querySelector("#copilot-time-badge");
  if (timeBadgeEl) timeBadgeEl.textContent = story.copilot.timeBadge;
  const tldrEl = document.querySelector("#copilot-tldr-text");
  if (tldrEl) tldrEl.textContent = story.copilot.tldr;
  const sentimentEl = document.querySelector(".sentiment-val");
  if (sentimentEl) sentimentEl.textContent = story.copilot.consensus;

  // Takeaways
  const takeawaysEl = document.querySelector("#copilot-takeaways-list");
  if (takeawaysEl) {
    takeawaysEl.innerHTML = story.copilot.takeaways.map((t, idx) => `
      <li>
        <strong>${idx + 1}. ${t.title}</strong>
        <span>${t.desc}</span>
      </li>
    `).join("");
  }

  // Playbook
  const playbookEl = document.querySelector("#copilot-playbook-box");
  if (playbookEl) {
    playbookEl.innerHTML = `
      <p><strong>🚀 Actionable Playbook:</strong> ${story.copilot.playbook}</p>
    `;
  }

  // Learning Hub Pane inside Copilot
  const learningBoxEl = document.querySelector("#copilot-learning-box");
  if (learningBoxEl && story.learningRoadmap) {
    const allSessions = getAllAcademySessions();
    const linkedEvent = allSessions.find(m => m.linkedStoryId === index) || allSessions[0];
    learningBoxEl.innerHTML = `
      <div class="learning-roadmap-card">
        <span class="roadmap-title">🎓 FOUNDATIONAL DISCIPLINE CONCEPTS</span>
        <p>${story.learningRoadmap.coreConcepts}</p>
        <span class="roadmap-title" style="margin-top:10px;">📚 RECOMMENDED MAPKAI TRACK</span>
        <p>${story.learningRoadmap.recommendedModule}</p>
      </div>
      <div class="emba-seminar-prompt">
        <strong>EMBA SEMINAR DISCUSSION PROMPT</strong>
        "${story.learningRoadmap.seminarPrompt}"
      </div>
      <div class="learning-event-recommend-card" style="margin-top:14px; background:#ffffff; border:1px solid #ebd9c0; border-radius:var(--fd-radius); padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:0.68rem; font-weight:800; color:var(--fd-orange-dark); letter-spacing:0.06em;">LINKED MASTERCLASS / LAB</span>
          <span style="font-size:0.68rem; color:#15803d; font-weight:700; background:#dcfce7; padding:2px 7px; border-radius:99px;">RSVP Open</span>
        </div>
        <strong style="display:block; font-size:0.82rem; color:var(--fd-ink); margin-bottom:4px; line-height:1.35;">${linkedEvent.title}</strong>
        <p style="font-size:0.72rem; color:var(--fd-muted); line-height:1.4; margin-bottom:10px;">📅 ${linkedEvent.date} · Faculty: ${linkedEvent.faculty}</p>
        <button type="button" class="btn-rsvp-linked-event" data-event-id="${linkedEvent.id}" style="width:100%; font-size:0.75rem; font-weight:700; color:#ffffff; background:var(--fd-orange); border:none; padding:8px 12px; border-radius:var(--fd-radius); cursor:pointer; transition:background 140ms ease;">
          Register for Masterclass Lab →
        </button>
      </div>
    `;

    learningBoxEl.querySelector(".btn-rsvp-linked-event")?.addEventListener("click", () => {
      openEventModal(linkedEvent);
    });
  }

  // Smart Replies
  const repliesEl = document.querySelector("#smart-replies-list");
  if (repliesEl) {
    repliesEl.innerHTML = story.copilot.replies.map(r => `
      <div class="reply-card">
        <div class="reply-card-header">
          <span class="reply-tone-pill">${r.tone}</span>
          <button type="button" class="btn-copy-draft" data-text="${encodeURIComponent(r.text)}">Copy Draft</button>
        </div>
        <div class="reply-text">"${r.text}"</div>
      </div>
    `).join("");

    repliesEl.querySelectorAll(".btn-copy-draft").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = decodeURIComponent(btn.dataset.text);
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "Copied ✓";
          btn.style.color = "var(--fd-orange-dark)";
          btn.style.borderColor = "var(--fd-orange)";
          setTimeout(() => {
            btn.textContent = "Copy Draft";
            btn.style.color = "";
            btn.style.borderColor = "";
          }, 2000);
        });
      });
    });
  }

  // Reset answer box
  const ansBox = document.querySelector("#answer-box");
  if (ansBox) {
    ansBox.hidden = true;
    ansBox.innerHTML = "";
  }
}

// Ask Copilot Handler
function submitAsk(question) {
  const ansBox = document.querySelector("#answer-box");
  if (!ansBox) return;

  ansBox.hidden = false;
  ansBox.innerHTML = `<em>Copilot thinking...</em>`;

  const curStory = storiesData[activeStoryIndex];

  setTimeout(() => {
    let reply = "";
    const qLower = question.toLowerCase();
    if (qLower.includes("flaw") || qLower.includes("counter")) {
      reply = `From a critical analysis perspective, ${curStory.title} assumes enterprise workflows can be cleanly restructured without operational resistance. In practice, legacy ERP and compliance silos account for 80% of real-world friction.`;
    } else if (qLower.includes("knowledge") || qLower.includes("domain") || qLower.includes("discipline")) {
      const topDomain = curStory.linkedDomains[0];
      reply = `Core Academic Anchor: This business challenge is primarily governed by ${topDomain.code} (${topDomain.name}). Grounding executive decisions in this discipline clarifies the structural trade-offs between short-term CapEx and long-term operating leverage.`;
    } else if (qLower.includes("startup") || qLower.includes("10-person")) {
      reply = `Startup Playbook: Skip complex multi-month roadmaps. Pick a single high-friction task (e.g., invoice reconciliation or customer triage), wire a specialized agent directly to your database, and iterate daily with real users.`;
    } else {
      reply = `Executive Quote: "${curStory.ceoComments[0].name}: Accelerated compute and deep permissioned context integration are the only sustainable moats when raw code generation is commoditized."`;
    }

    ansBox.innerHTML = `<strong>Q: ${question}</strong><p style="margin-top:4px;">${reply}</p>`;
  }, 350);
}

// Initialize all DOM events
document.addEventListener("DOMContentLoaded", () => {
  // 1. Initial Render
  renderPortraitCredits();
  renderDashboard();
  renderStory(0);

  // Check URL param for default view (e.g. ?view=reader)
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get("view");
  if (viewParam === "reader") {
    switchView("reader");
  } else {
    switchView("dashboard");
  }

  // 2. View Toggle Buttons
  document.querySelector("#btn-view-dashboard")?.addEventListener("click", () => switchView("dashboard"));
  document.querySelector("#btn-view-reader")?.addEventListener("click", () => switchView("reader"));
  document.querySelector("#btn-back-dash")?.addEventListener("click", () => switchView("dashboard"));
  document.querySelector("#btn-dashboard-to-reader")?.addEventListener("click", () => {
    renderStory(0);
    switchView("reader");
  });

  // 3. Category Filter Chips in Dashboard
  document.querySelectorAll(".cat-filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".cat-filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      renderCategoryCards(filter);
    });
  });

  // 4. Story Selector Pill click handlers in Reader (all 6 stories)
  document.querySelectorAll(".story-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      const idx = Number(pill.dataset.story);
      renderStory(idx);
    });
  });

  // 5. Copilot Tabs Handler (TL;DR, Takeaways, Playbook, Learning Hub)
  document.querySelectorAll(".copilot-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".copilot-tab").forEach(t => {
        const isCur = t === tab;
        t.classList.toggle("active", isCur);
        t.setAttribute("aria-selected", String(isCur));
      });

      const targetTab = tab.dataset.tab;
      document.querySelectorAll(".tab-pane").forEach(pane => {
        const isTarget = pane.id === `pane-${targetTab}`;
        pane.hidden = !isTarget;
        pane.classList.toggle("active", isTarget);
      });
    });
  });

  // 6. Interactive Reactions Handlers
  document.querySelectorAll(".btn-reaction").forEach(btn => {
    btn.addEventListener("click", () => {
      const isAct = btn.classList.contains("active");
      btn.classList.toggle("active", !isAct);
      const countEl = btn.querySelector(".reaction-count");
      if (countEl) {
        let num = parseInt(countEl.textContent.replace(/,/g, ""), 10);
        if (!isNaN(num)) {
          num = isAct ? num - 1 : num + 1;
          countEl.textContent = num.toLocaleString();
        }
      }
      const statusEl = document.querySelector("#interaction-status");
      if (statusEl) {
        statusEl.textContent = isAct ? "Reaction removed" : "Liked & Engaged ✓";
        statusEl.style.color = isAct ? "var(--fd-muted)" : "var(--fd-orange-dark)";
      }
    });
  });

  // 7. Ask Copilot events
  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.q;
      const input = document.querySelector("#ask-input");
      if (input) input.value = q;
      submitAsk(q);
    });
  });

  document.querySelector("#btn-ask")?.addEventListener("click", () => {
    const input = document.querySelector("#ask-input");
    if (input && input.value.trim()) {
      submitAsk(input.value.trim());
    }
  });

  document.querySelector("#ask-input")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const input = document.querySelector("#ask-input");
      if (input && input.value.trim()) {
        submitAsk(input.value.trim());
      }
    }
  });

  // 8. Event Registration Modal Listeners
  document.querySelector("#btn-close-modal")?.addEventListener("click", closeEventModal);
  document.querySelector("#btn-modal-cancel")?.addEventListener("click", closeEventModal);
  document.querySelector("#btn-modal-done")?.addEventListener("click", closeEventModal);
  document.querySelector("#event-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "event-modal") closeEventModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeEventModal();
  });

  document.querySelector("#event-reg-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formView = document.querySelector("#modal-form-view");
    const successView = document.querySelector("#modal-success-view");
    if (formView && successView) {
      formView.hidden = true;
      successView.hidden = false;
    }
  });
});
