// MapKAI FD Context + LinkedIn Copilot Data & Logic
const storiesData = [
  {
    id: "story-0",
    tag: "TECHNOLOGY & BUSINESS",
    readTime: "Concept article · 5 min read",
    title: "Why has AI investment not yet delivered the expected productivity gains?",
    dek: "Companies have moved from experiments to deployment. The question is shifting from access to AI toward the harder work of redesigning processes, measuring returns, and managing uncertainty.",
    body: [
      "The answer cannot be found in one quarter or one company’s result. It requires context: what businesses expected, what they implemented, which constraints emerged, and how evidence changed over time.",
      "Buying AI tools does not automatically make a company more productive. Teams also need to change how work is organised. Moving beyond isolated prompt experiments to deeply integrated operational pipelines is where the true margin expansion begins."
    ],
    execLikes: [
      { name: "Jensen Huang", title: "CEO @ NVIDIA", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
      { name: "Tim Cook", title: "CEO @ Apple", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" },
      { name: "Sundar Pichai", title: "CEO @ Google", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "8,420",
    metrics: { like: 4821, celebrate: 1240, insightful: 3410, love: 980 },
    ceoComments: [
      {
        name: "Jensen Huang",
        rank: "Fortune 500 #65",
        title: "Founder, President & CEO @ NVIDIA",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
        quote: "The reason productivity gains feel delayed is that enterprises are trying to graft AI onto 1990s CPU workflows. Once you modernize data centers with accelerated computing and Omniverse digital twins, the return is immediate.",
        likes: "1,420",
        time: "1h ago"
      },
      {
        name: "Satya Nadella",
        rank: "Fortune 500 #13",
        title: "Chairman and CEO @ Microsoft",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
        quote: "Exactly, Jensen. In our customer deployments, task-level copilots delivered a 20% speedup, but the real productivity leap happened when multi-agent orchestrations were given permissioned access to internal enterprise context.",
        likes: "1,105",
        time: "45m ago"
      },
      {
        name: "Marc Benioff",
        rank: "Fortune 500 #127",
        title: "Chair and CEO @ Salesforce",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80",
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
      "General-purpose computing has run out of steam. CPU scaling has slowed, yet computing demand continues to skyrocket exponentially. Accelerated computing is the only path forward.",
      "The next wave is Physical AI: AI that understands the laws of physics, interacting with the real world through robotics, autonomous vehicles, and industrial digital twins in Omniverse."
    ],
    execLikes: [
      { name: "Lisa Su", title: "CEO @ AMD", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" },
      { name: "Tim Cook", title: "CEO @ Apple", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" },
      { name: "Andy Jassy", title: "CEO @ Amazon", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "18,920",
    metrics: { like: 12100, celebrate: 3400, insightful: 6200, love: 1800 },
    ceoComments: [
      {
        name: "Lisa Su",
        rank: "Fortune 500",
        title: "Chair and CEO @ AMD",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80",
        quote: "Couldn't agree more, Jensen. The sheer compute density required to simulate physical environments in real time demands architectural breakthroughs from silicon to system software.",
        likes: "1,840",
        time: "3h ago"
      },
      {
        name: "Andy Jassy",
        rank: "Fortune 500 #2",
        title: "President & CEO @ Amazon",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
        quote: "We are seeing this transformation firsthand across AWS. Enterprises aren't just training models; they are transforming supply chains, robotics, and logistics with continuous simulation.",
        likes: "1,210",
        time: "2h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 3.5m (~85%)",
      tldr: "NVIDIA CEO Jensen Huang forecasts that $1T in data centers must convert to accelerated AI factories, and Physical AI (robotics validated in simulation before touching hardware) will drive industrial intelligence.",
      consensus: "96%",
      takeaways: [
        { title: "End of CPU Scaling", desc: "Energy constraints make general-purpose CPU expansion non-viable for modern generative workloads." },
        { title: "Sim-to-Real Digital Twins", desc: "Training robots and factory workflows in virtual physics engines saves years of hardware trial-and-error." },
        { title: "Sovereign AI Infrastructure", desc: "Nations and enterprises must own their local compute pipelines to protect proprietary operational knowledge." }
      ],
      playbook: "If developing in physical automation: Adopt simulation-first (Sim-to-Real) testing pipelines to compress your physical hardware iteration cycles by 3x.",
      replies: [
        { tone: "Insightful", text: "Physical AI grounded in virtual simulation is the definitive bridge from language models to tangible real-world robotics." },
        { tone: "Founder Perspective", text: "Simulating our robotic fleet in digital twins cut our prototype iteration time from 9 months to 3 weeks." }
      ]
    }
  },
  {
    id: "story-2",
    tag: "CONSUMER TECH & PRIVACY",
    readTime: "Executive share · 3.5 min read",
    title: "Apple: Personal Intelligence, On-Device Silicon, and the Non-Negotiable Standard of Privacy",
    dek: "Tim Cook outlines Apple’s AI standard: personal context without ad tracking, local Neural Engine execution, and verifiable Private Cloud Compute.",
    body: [
      "Technology is at its best when it enriches people's everyday lives in ways so intuitive they disappear into the background.",
      "The most private data is the data that never leaves your device. Apple silicon handles requests locally, while Private Cloud Compute provides mathematically verifiable zero-data retention."
    ],
    execLikes: [
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
      { name: "Marc Benioff", title: "CEO @ Salesforce", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80" },
      { name: "Brian Chesky", title: "CEO @ Airbnb", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "15,420",
    metrics: { like: 9800, celebrate: 2100, insightful: 4100, love: 1600 },
    ceoComments: [
      {
        name: "Satya Nadella",
        rank: "Fortune 500 #13",
        title: "Chairman and CEO @ Microsoft",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
        quote: "Verifiable security and edge-cloud hybrid architectures are the exact standard enterprise CIOs demand. Privacy and zero-retention guarantees are foundational for scaling trusted AI.",
        likes: "1,105",
        time: "4h ago"
      },
      {
        name: "Demis Hassabis",
        rank: "CEO @ DeepMind",
        title: "CEO @ Google DeepMind",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
        quote: "Crucial emphasis on verifiable compute. As models get deeply embedded into daily decision loops, mathematically verifiable cryptographic boundaries will become standard protocol.",
        likes: "920",
        time: "3h ago"
      }
    ],
    copilot: {
      timeBadge: "⏱️ Saved 3.0m (~85%)",
      tldr: "Apple CEO Tim Cook establishes that personal AI must be grounded in on-device neural silicon and publicly auditable, zero-retention cloud servers. Privacy is treated as the foundational product moat.",
      consensus: "94%",
      takeaways: [
        { title: "No Profile Harvesting", desc: "AI must interpret personal messages and calendar context without commercializing user profile data." },
        { title: "Local Neural Processing", desc: "Local silicon computation guarantees instant response times and absolute data residency." },
        { title: "Verifiable Zero-Retention Cloud", desc: "Complex reasoning tasks run on servers that independent security researchers can cryptographically audit." }
      ],
      playbook: "Design privacy into your software architecture upfront: enterprise buyers will reject products that store raw client context in untrusted cloud logs.",
      replies: [
        { tone: "Insightful", text: "Publicly verifiable Private Cloud Compute resets expectations across cloud computing. Cryptographic trust is the new baseline." },
        { tone: "Founder Perspective", text: "Guaranteeing local on-device processing doubled our enterprise pipeline speed. Security is the best sales accelerator." }
      ]
    }
  },
  {
    id: "story-3",
    tag: "ENTERPRISE SAAS & AUTOMATION",
    readTime: "Executive share · 3 min read",
    title: "Salesforce: The Death of DIY Chatbots and the Dawn of Autonomous Digital Labor",
    dek: "Marc Benioff argues that first-wave AI chatbots were informational toys. Enterprises must deploy transactional autonomous workforces to see actual financial returns.",
    body: [
      "Let's be completely honest: The world spent billions of dollars building DIY chatbots that essentially acted as glorified FAQ search bars with hallucination problems.",
      "Enterprises need an autonomous digital workforce that diagnoses billing discrepancies, executes database refunds, and synchronizes pipeline forecasts in real time under human governance."
    ],
    execLikes: [
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
      { name: "Brian Chesky", title: "CEO @ Airbnb", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" },
      { name: "Andy Jassy", title: "CEO @ Amazon", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "9,840",
    metrics: { like: 6200, celebrate: 1400, insightful: 3100, love: 890 },
    ceoComments: [
      {
        name: "Satya Nadella",
        rank: "Fortune 500 #13",
        title: "Chairman and CEO @ Microsoft",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
        quote: "Completely agree, Marc. The era of proof-of-concept experiments has passed; enterprise buyers are measuring AI strictly by revenue expansion and customer support case resolution speed.",
        likes: "940",
        time: "7h ago"
      },
      {
        name: "Brian Chesky",
        rank: "Fortune 500 #450",
        title: "Co-Founder & CEO @ Airbnb",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80",
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
  }
];

let activeStoryIndex = 0;

function renderStory(index) {
  const story = storiesData[index];
  if (!story) return;

  activeStoryIndex = index;

  // Header pills state
  document.querySelectorAll(".story-pill").forEach((pill, i) => {
    const isCur = i === index;
    pill.classList.toggle("active", isCur);
    pill.setAttribute("aria-selected", String(isCur));
  });

  // Story Metadata
  document.querySelector("#story-tag").textContent = story.tag;
  document.querySelector("#story-read-time").textContent = story.readTime;
  document.querySelector("#story-title").textContent = story.title;
  document.querySelector("#story-dek").textContent = story.dek;

  // Story Body
  const bodyEl = document.querySelector("#story-body");
  bodyEl.innerHTML = story.body.map(p => `<p>${p}</p>`).join("");

  // Executive Likes Social Proof
  const stackEl = document.querySelector("#exec-avatar-stack");
  stackEl.innerHTML = story.execLikes.map(exec => 
    `<img src="${exec.avatar}" alt="${exec.name}" title="${exec.name} (${exec.title})">`
  ).join("");

  document.querySelector("#exec-likes-text").innerHTML = `
    Liked by <strong>${story.execLikes[0].name}</strong>, <strong>${story.execLikes[1]?.name || 'peer CEOs'}</strong>, and <strong>${story.execLikesCount} other executives</strong>
  `;

  // Counters
  document.querySelector("#count-like").textContent = story.metrics.like.toLocaleString();

  // CEO Comments
  const commentsEl = document.querySelector("#ceo-comments-list");
  commentsEl.innerHTML = story.ceoComments.map(c => `
    <div class="ceo-comment-card">
      <div class="ceo-header-row">
        <img class="ceo-avatar" src="${c.avatar}" alt="${c.name}">
        <div class="ceo-meta-text">
          <div class="ceo-name-line">
            <span>${c.name}</span>
            <span class="in-icon">in</span>
            <span class="f500-tag">${c.rank}</span>
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

  // Copilot Panel
  document.querySelector("#copilot-time-badge").textContent = story.copilot.timeBadge;
  document.querySelector("#copilot-tldr-text").textContent = story.copilot.tldr;
  document.querySelector(".sentiment-val").textContent = story.copilot.consensus;

  // Takeaways
  const takeawaysEl = document.querySelector("#copilot-takeaways-list");
  takeawaysEl.innerHTML = story.copilot.takeaways.map((t, idx) => `
    <li>
      <strong>${idx + 1}. ${t.title}</strong>
      <span>${t.desc}</span>
    </li>
  `).join("");

  // Playbook
  document.querySelector("#copilot-playbook-box").innerHTML = `
    <p><strong>🚀 Actionable Playbook:</strong> ${story.copilot.playbook}</p>
  `;

  // Smart Replies
  const repliesEl = document.querySelector("#smart-replies-list");
  repliesEl.innerHTML = story.copilot.replies.map(r => `
    <div class="reply-card">
      <div class="reply-card-header">
        <span class="reply-tone-pill">${r.tone}</span>
        <button type="button" class="btn-copy-draft" data-text="${encodeURIComponent(r.text)}">Copy Draft</button>
      </div>
      <div class="reply-text">"${r.text}"</div>
    </div>
  `).join("");

  // Rebind copy buttons
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

  // Reset answer box
  const ansBox = document.querySelector("#answer-box");
  ansBox.hidden = true;
  ansBox.innerHTML = "";
}

// Story Selector Pill click handlers
document.querySelectorAll(".story-pill").forEach(pill => {
  pill.addEventListener("click", () => {
    const idx = Number(pill.dataset.story);
    renderStory(idx);
  });
});

// Copilot Tabs Handler (TL;DR, Takeaways, Playbook)
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

// Interactive Reactions Handlers
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

// Quick Batch Like All
document.querySelector("#btn-batch-like")?.addEventListener("click", () => {
  const likeBtn = document.querySelector("#btn-like");
  if (likeBtn && !likeBtn.classList.contains("active")) {
    likeBtn.click();
  }
  const btn = document.querySelector("#btn-batch-like");
  if (btn) {
    btn.textContent = "⚡ Batch Liked (4/4) ✓";
    btn.style.background = "#15803d";
    setTimeout(() => {
      btn.textContent = "⚡ Batch Like All";
      btn.style.background = "";
    }, 2500);
  }
});

// Ask Copilot Handler
function submitAsk(question) {
  const ansBox = document.querySelector("#answer-box");
  ansBox.hidden = false;
  ansBox.innerHTML = `<em>Copilot thinking...</em>`;

  const curStory = storiesData[activeStoryIndex];

  setTimeout(() => {
    let reply = "";
    const qLower = question.toLowerCase();
    if (qLower.includes("flaw") || qLower.includes("counter")) {
      reply = `From a critical analysis perspective, ${curStory.title} assumes enterprise workflows can be cleanly restructured without operational resistance. In practice, legacy ERP and permissioned compliance silos account for 80% of real-world friction.`;
    } else if (qLower.includes("startup") || qLower.includes("10-person")) {
      reply = `Startup Playbook: Skip complex multi-month roadmaps. Pick a single high-friction task (e.g., invoice reconciliation or customer triage), wire a specialized agent directly to your database, and iterate daily with real users.`;
    } else {
      reply = `Executive Quote: "${curStory.ceoComments[0].name}: Accelerated compute and deep permissioned context integration are the only sustainable moats when raw code generation is commoditized."`;
    }

    ansBox.innerHTML = `<strong>Q: ${question}</strong><p style="margin-top:4px;">${reply}</p>`;
  }, 350);
}

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

// Initial Render
document.addEventListener("DOMContentLoaded", () => {
  renderStory(0);
});
