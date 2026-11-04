// MapKAI FD Context + LinkedIn Copilot & Knowledge Learning Data

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
        nameZh: "管理与组织流程重构",
        relevance: "Firms require organizational redesign, KPI restructuring, and managerial process re-engineering rather than superficial chatbot adoption.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0412",
        name: "Finance, Banking and Insurance",
        nameZh: "公司金融与投资评估",
        relevance: "Evaluating capital expenditures (CapEx), return on invested capital (ROIC), and opportunity cost of delayed technology modernization.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0613",
        name: "Software & Applications Development",
        nameZh: "软件工程与应用开发",
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
      "General-purpose computing has run out of steam. CPU scaling has slowed, yet computing demand continues to skyrocket exponentially. Accelerated computing <a class='k-chip' href='/categories/07' title='ISCED 0714: Electronics & Automation'>0714 Electronics &amp; Automation ↗</a> is the only path forward.",
      "The next wave is Physical AI: systems that understand physical dynamics, interacting with the real world through robotics, autonomous transport, and digital twins in Omniverse <a class='k-chip' href='/categories/06' title='ISCED 0611: Computer Science'>0611 Computer Science ↗</a>.",
      "Crucially, the scale of gigawatt clusters has shifted the critical path to energy infrastructure: <a class='k-chip' href='/categories/07' title='ISCED 0713: Electricity & Energy'>0713 Electricity &amp; Energy ↗</a>. Silicon design alone is no longer the sole determining bottleneck."
    ],
    linkedDomains: [
      {
        code: "ISCED 0714",
        name: "Electronics and Automation",
        nameZh: "电子工程、半导体与自动化",
        relevance: "Hardware architecture shifts from scalar CPUs to tensor cores, high-bandwidth memory (HBM), and heterogeneous supercomputers.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0611",
        name: "Computer Science & AI Simulation",
        nameZh: "计算机仿真与物理模拟",
        relevance: "Physics-informed neural networks and Omniverse synthetic data generation for industrial robotics.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0713",
        name: "Electricity and Energy",
        nameZh: "电力与能源系统工程",
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
      { name: "Lisa Su", title: "CEO @ AMD", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" },
      { name: "Tim Cook", title: "CEO @ Apple", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" },
      { name: "Andy Jassy", title: "CEO @ Amazon", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "18,920",
    metrics: { like: 12100, celebrate: 3400, insightful: 6200, love: 1800 },
    ceoComments: [
      {
        name: "Lisa Su",
        rank: "Fortune 500 #300",
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
        nameZh: "系统安全与端侧智能架构",
        relevance: "Zero-knowledge proof, client-side quantization, and ephemeral enclave execution.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0612",
        name: "Distributed Network Design",
        nameZh: "分布式网络与云端调度",
        relevance: "Verifiable server image attestation, stateless container orchestration, and low-latency packet routing.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0421",
        name: "Law and Data Governance",
        nameZh: "数据合规、隐私法与主权治理",
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
      { name: "Sundar Pichai", title: "CEO @ Google", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
      { name: "Jensen Huang", title: "CEO @ NVIDIA", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "14,500",
    metrics: { like: 9400, celebrate: 2100, insightful: 4800, love: 1200 },
    ceoComments: [
      {
        name: "Sundar Pichai",
        rank: "Fortune 500 #8",
        title: "CEO @ Alphabet and Google",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
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
        nameZh: "数据库与事务控制架构",
        relevance: "ACID transactions, idempotency guards, and state machine consistency during autonomous agent actions.",
        link: "/categories/06"
      },
      {
        code: "ISCED 0413",
        name: "Management & Workforce Strategy",
        nameZh: "人力资源组织与数字劳动协作",
        relevance: "Redesigning staffing models, employee-to-agent supervision ratios, and frontline tier-1 support roles.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0414",
        name: "Marketing & Customer Lifecycle",
        nameZh: "营销工程与客户生命周期",
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
      { name: "Brian Chesky", title: "CEO @ Airbnb", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "11,200",
    metrics: { like: 7800, celebrate: 1900, insightful: 3900, love: 1100 },
    ceoComments: [
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
        nameZh: "电力工程、核能与电网系统",
        relevance: "High-voltage transmission interconnection queues, baseload capacity factors, and SMR small modular nuclear reactor thermodynamics.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0714",
        name: "Electronics & High-Density Power",
        nameZh: "电力电子与高压配电",
        relevance: "Megawatt-per-row power distribution units (PDUs), 48V to 1V step-down conversion on motherboards, and direct-to-chip liquid cooling.",
        link: "/categories/07"
      },
      {
        code: "ISCED 0533",
        name: "Applied Physics & Thermodynamics",
        nameZh: "应用物理学与热力学极限",
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
      { name: "Andy Jassy", title: "CEO @ Amazon", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" },
      { name: "Jensen Huang", title: "CEO @ NVIDIA", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "16,400",
    metrics: { like: 10400, celebrate: 2600, insightful: 5800, love: 1400 },
    ceoComments: [
      {
        name: "Andy Jassy",
        rank: "Fortune 500 #2",
        title: "President & CEO @ Amazon",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
        quote: "We reached the limit of regional utility interconnect queues. Co-locating next to zero-carbon SMRs is the only path to guarantee gigawatts of unconstrained 24/7 computing for AWS customers.",
        likes: "2,140",
        time: "2h ago"
      },
      {
        name: "Jensen Huang",
        rank: "Fortune 500 #65",
        title: "Founder & CEO @ NVIDIA",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
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
        nameZh: "公司金融与资本成本评估",
        relevance: "Weighted average cost of capital (WACC), discounted cash flow (DCF) under high technological obsolescence, and return on invested capital (ROIC).",
        link: "/categories/04"
      },
      {
        code: "ISCED 0411",
        name: "Accounting and Taxation",
        nameZh: "财务会计与资产折旧摊销",
        relevance: "Accelerated depreciation schedules for 3-year GPU lifecycles and capitalized R&D software asset recognition under GAAP/IFRS.",
        link: "/categories/04"
      },
      {
        code: "ISCED 0311",
        name: "Macroeconomics and Labor Markets",
        nameZh: "宏观经济学与要素替代生产函数",
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
      { name: "David Solomon", title: "CEO @ Goldman Sachs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
      { name: "Marc Benioff", title: "CEO @ Salesforce", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80" }
    ],
    execLikesCount: "13,800",
    metrics: { like: 8900, celebrate: 2100, insightful: 4700, love: 1100 },
    ceoComments: [
      {
        name: "David Solomon",
        rank: "Fortune 500 #55",
        title: "Chairman and CEO @ Goldman Sachs",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
        quote: "Boards are shifting from 'FOMO CapEx' to disciplined hurdle rates. CFOs must demand verified cash-flow generation before approving the next $10B infrastructure debt issuance.",
        likes: "2,350",
        time: "3h ago"
      },
      {
        name: "Satya Nadella",
        rank: "Fortune 500 #13",
        title: "Chairman and CEO @ Microsoft",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
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
  }
];

// 2. Dashboard Sector & Category Data (7 Categories, Total 499 Stories)
const categoriesData = [
  {
    id: "cat-ai",
    filterGroup: "tech",
    name: "Generative AI & Core Models",
    nameZh: "生成式 AI 与大模型基建",
    icon: "💻",
    count: 142,
    percentage: 28.5,
    growth: "+18%",
    isHot: true,
    color: "#d95328",
    activeCeos: [
      { name: "Jensen Huang", title: "NVIDIA CEO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "Microsoft CEO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" },
      { name: "Sundar Pichai", title: "Google CEO", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "Why has AI investment not yet delivered expected productivity gains?",
    topStoryId: 0,
    executiveTakeaway: "92% of enterprise leaders shifting from chatbot experiments to autonomous multi-agent systems with transactional permissions."
  },
  {
    id: "cat-chips",
    filterGroup: "tech",
    name: "Semiconductors & Compute",
    nameZh: "半导体、算力硬件与物理 AI",
    icon: "⚡",
    count: 98,
    percentage: 19.6,
    growth: "+24%",
    isHot: true,
    color: "#b45309",
    activeCeos: [
      { name: "Jensen Huang", title: "NVIDIA CEO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Lisa Su", title: "AMD CEO", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" },
      { name: "Andy Jassy", title: "Amazon CEO", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "NVIDIA: The $1 Trillion Accelerated Shift and Age of Physical AI",
    topStoryId: 1,
    executiveTakeaway: "General-purpose CPU scaling exhausted; Physical AI simulation and Omniverse digital twins driving $1T data center overhaul."
  },
  {
    id: "cat-saas",
    filterGroup: "enterprise",
    name: "Enterprise Software & Digital Labor",
    nameZh: "企业级软件与数字劳动力",
    icon: "☁️",
    count: 76,
    percentage: 15.2,
    growth: "+12%",
    isHot: false,
    color: "#0a66c2",
    activeCeos: [
      { name: "Marc Benioff", title: "Salesforce CEO", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80" },
      { name: "Brian Chesky", title: "Airbnb CEO", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "Salesforce: Autonomous Digital Labor Replacing Legacy FAQ Chatbots",
    topStoryId: 3,
    executiveTakeaway: "First-gen chat widgets discarded; agents executing actual write actions inside CRM databases deliver 70%+ backlog reduction."
  },
  {
    id: "cat-consumer",
    filterGroup: "tech",
    name: "Consumer Platforms & Edge Devices",
    nameZh: "消费电子平台与端侧智能",
    icon: "📱",
    count: 64,
    percentage: 12.8,
    growth: "+9%",
    isHot: false,
    color: "#475569",
    activeCeos: [
      { name: "Tim Cook", title: "Apple CEO", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80" },
      { name: "Sundar Pichai", title: "Google CEO", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "Apple: On-Device Private Cloud Intelligence Architecture",
    topStoryId: 2,
    executiveTakeaway: "Silicon-level cryptographic privacy and on-device neural engines solve enterprise data leak anxiety."
  },
  {
    id: "cat-energy",
    filterGroup: "hot",
    name: "Energy, Nuclear & Datacenter Utilities",
    nameZh: "能源电力、核能与数据中心公用事业",
    icon: "🔋",
    count: 48,
    percentage: 9.6,
    growth: "+31%",
    isHot: true,
    color: "#15803d",
    activeCeos: [
      { name: "Andy Jassy", title: "Amazon CEO", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80" },
      { name: "Satya Nadella", title: "Microsoft CEO", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "Hyperscalers Turn to Nuclear SMRs: The Gigawatt Energy Race for AI Data Centers",
    topStoryId: 4,
    executiveTakeaway: "Gigawatt-scale AI computing creates unprecedented baseload energy demand, triggering nuclear revitalisation."
  },
  {
    id: "cat-finance",
    filterGroup: "enterprise",
    name: "Capital Markets & Tech M&A",
    nameZh: "资本市场、科技并购与估值",
    icon: "🏦",
    count: 42,
    percentage: 8.4,
    growth: "+6%",
    isHot: false,
    color: "#6366f1",
    activeCeos: [
      { name: "David Solomon", title: "Goldman Sachs CEO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Marc Benioff", title: "Salesforce CEO", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "The Cost of Capital in the Age of Autonomous AI: Balancing $50B CapEx with ROI Metrics",
    topStoryId: 5,
    executiveTakeaway: "Balance sheets deployed aggressively to acquire specialized engineering teams and proprietary datasets."
  },
  {
    id: "cat-robotics",
    filterGroup: "tech",
    name: "Industrial Robotics & Automation",
    nameZh: "实体工业自动化与人形机器人",
    icon: "🤖",
    count: 29,
    percentage: 5.8,
    growth: "+15%",
    isHot: false,
    color: "#0891b2",
    activeCeos: [
      { name: "Jensen Huang", title: "NVIDIA CEO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80" },
      { name: "Lisa Su", title: "AMD CEO", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80" }
    ],
    topHeadline: "Factory Deployment of Bipedal Robots Accelerates Across Tier-1 Assembly",
    topStoryId: 1,
    executiveTakeaway: "Sim-to-real transfer models allow robotics hardware to train in virtual factories before physical landing."
  }
];

// 3. MapKAI Knowledge Architecture Overview Data (Dashboard Cross-Map)
const overviewKnowledgeDomains = [
  {
    code: "ISCED 0613",
    name: "Software & Applications",
    nameZh: "软件开发与应用系统",
    connections: 184,
    link: "/categories/06",
    focus: "Multi-agent pipelines, database transactions, API security"
  },
  {
    code: "ISCED 0413",
    name: "Management & Strategy",
    nameZh: "管理战略与组织流程",
    connections: 156,
    link: "/categories/04",
    focus: "Workflow re-engineering, digital labor management, KPI redesign"
  },
  {
    code: "ISCED 0714",
    name: "Electronics & Automation",
    nameZh: "电子工程与半导体自动化",
    connections: 128,
    link: "/categories/07",
    focus: "GPU architectures, high-bandwidth memory, robotics kinematics"
  },
  {
    code: "ISCED 0412",
    name: "Finance, Banking & Capital",
    nameZh: "金融、银行与资本运作",
    connections: 98,
    link: "/categories/04",
    focus: "WACC, ROIC hurdle rates, infrastructure leasebacks, debt financing"
  },
  {
    code: "ISCED 0713",
    name: "Electricity & Energy Systems",
    nameZh: "电力工程与能源系统",
    connections: 74,
    link: "/categories/07",
    focus: "SMR nuclear power, megawatt datacenter grids, baseload cooling"
  }
];

// 4. Executive Leaderboard Data
const executiveLeaderboard = [
  { name: "Jensen Huang", rank: "Fortune 500 #65", title: "CEO @ NVIDIA", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80", commentsCount: 48, likesCount: "14.2k", topTopic: "Physical AI & Accelerated Computing" },
  { name: "Satya Nadella", rank: "Fortune 500 #13", title: "CEO @ Microsoft", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80", commentsCount: 39, likesCount: "11.5k", topTopic: "Enterprise Context & Agentic Workflow" },
  { name: "David Solomon", rank: "Fortune 500 #55", title: "CEO @ Goldman Sachs", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80", commentsCount: 34, likesCount: "12.8k", topTopic: "Cost of Capital & ROIC Hurdle Rates" },
  { name: "Marc Benioff", rank: "Fortune 500 #127", title: "CEO @ Salesforce", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=80", commentsCount: 31, likesCount: "8.9k", topTopic: "Autonomous Digital Workers (Agentforce)" },
  { name: "Andy Jassy", rank: "Fortune 500 #2", title: "CEO @ Amazon", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80", commentsCount: 29, likesCount: "10.4k", topTopic: "Nuclear SMRs & Cloud Power Infrastructure" },
  { name: "Tim Cook", rank: "Fortune 500 #3", title: "CEO @ Apple", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80", commentsCount: 27, likesCount: "9.4k", topTopic: "Private Cloud Compute & On-Device Neural" }
];

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
          <div class="overview-zh-name">${d.nameZh}</div>
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
          <img class="leader-avatar" src="${ceo.avatar}" alt="${ceo.name}">
          <div class="leader-meta">
            <strong>${ceo.name} <small style="color:var(--fd-muted); font-weight:normal;">(${ceo.rank})</small></strong>
            <span>${ceo.title}</span>
          </div>
        </div>
        <div class="leader-right">
          <span class="leader-topic">${ceo.topTopic}</span>
          <span class="leader-stats">💬 ${ceo.commentsCount} quotes • 👍 ${ceo.likesCount}</span>
        </div>
      </div>
    `).join("");
  }
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
              <span>${c.nameZh}</span>
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
          <span class="cat-ceos-label">Key Executive Voices:</span>
          <div class="cat-ceos-stack">
            ${c.activeCeos.map(ceo => `
              <img src="${ceo.avatar}" alt="${ceo.name}" title="${ceo.name} (${ceo.title})">
            `).join("")}
          </div>
        </div>

        <div class="cat-headline-box">
          <strong>TRENDING EXECUTIVE REPORT</strong>
          "${c.topHeadline}"
        </div>
      </div>

      <button type="button" class="cat-action-btn" data-story-id="${c.topStoryId}">
        <span>Read Story &amp; Copilot</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  `).join("");

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
            <strong>${d.name} <small style="color:var(--fd-muted); font-weight:normal;">(${d.nameZh})</small></strong>
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
      `<img src="${exec.avatar}" alt="${exec.name}" title="${exec.name} (${exec.title})">`
    ).join("");
  }

  const likesTextEl = document.querySelector("#exec-likes-text");
  if (likesTextEl) {
    likesTextEl.innerHTML = `
      Liked by <strong>${story.execLikes[0].name}</strong>, <strong>${story.execLikes[1]?.name || 'peer CEOs'}</strong>, and <strong>${story.execLikesCount} other executives</strong>
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
    `;
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
});
