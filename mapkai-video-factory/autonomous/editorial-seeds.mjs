// Directional seeds are deliberately limited to the controlled pilot. They are
// not a silent replacement for the configured Editorial Model Provider.
export const GENERAL_PROFILE = {
  id: "MAPKAI-GENERAL-OVERVIEW",
  name: "MapKAI General Overview",
  nameZh: "MapKAI 知识地图总览",
  slug: "general-overview",
  type: "GENERAL_OVERVIEW",
  category: "Product-level prologue",
  centralQuestion: "If reality is continuous, why did human knowledge become organised into disciplines?",
  necessaryWhen: "A capable community encounters recurring problems that cannot be solved by local memory or one person's intuition, and needs ways of noticing, comparing, recording, testing, and teaching that can travel across generations.",
  thesis: "Reality contains phenomena, not academic departments. Disciplines are organised ways human beings learned to investigate recurring kinds of questions; MapKAI maps those ways of seeing without pretending the map is the world.",
  engine: "journey",
  candidateEngines: ["journey", "thought experiment", "discovery"],
  openingHook: "Imagine another Earth with familiar physical laws and human minds, but no inherited textbooks, universities, or names for subjects. Nothing is labelled; a falling object, a failed harvest, a disagreement, a fever, and a moving star simply happen.",
  openingProblem: "A community keeps solving the same kinds of problems locally, yet the solutions disappear when the observer, season, or generation changes. The problem is not a lack of intelligence; it is the absence of portable ways to know.",
  existingKnowledge: ["practical memory", "customs and stories", "informal observation", "cooperation and argument", "tools made for immediate use"],
  trigger: "The same pattern returns across different people and settings, and local explanations no longer coordinate action.",
  ordinaryIntuition: "If a person has seen a phenomenon before, a confident story about it should be enough to guide the next decision.",
  failedIntuition: "Memory and custom work locally but cannot reliably compare cases, expose hidden variables, preserve a method, or settle disagreement at scale.",
  tension: "How can a continuous world become intelligible without carving it into arbitrary boxes?",
  aha: "Disciplines are not pieces of reality waiting to be found. They are durable agreements about which recurring questions deserve specialised concepts, evidence, methods, and boundaries.",
  secondaryTurns: [
    "A repeated practical problem becomes a pattern only when someone records differences instead of merely remembering outcomes.",
    "A useful concept makes a hidden relationship portable: people can teach it, challenge it, and apply it beyond the original case.",
    "A boundary is a tool for attention, not a wall around reality; difficult problems cross several fields at once.",
    "A map becomes valuable when it helps a learner choose a next question without confusing the map with the territory."
  ],
  emergencePath: ["phenomena are encountered", "recurring problems resist local intuition", "comparisons and records make patterns portable", "concepts and methods stabilise what can be asked", "bodies of knowledge become teachable traditions", "disciplines and institutions preserve, contest, and extend those traditions"],
  map: [
    { name: "Natural sciences, mathematics and statistics", reason: "Recurring questions about matter, change, measurement, and uncertainty need models that can be checked against the world." },
    { name: "Social sciences, journalism and information", reason: "Choices become patterned when people coordinate, conflict, communicate, and build institutions." },
    { name: "Arts and humanities", reason: "Meaning, memory, language, interpretation, and value cannot be exhausted by measurement alone." },
    { name: "Business, administration and law", reason: "Cooperation at scale needs records, exchange, governance, and enforceable expectations." },
    { name: "Computing, engineering, health, ecology and services", reason: "Knowledge becomes an instrument when systems, bodies, environments, and journeys must be designed, repaired, and cared for." }
  ],
  concepts: ["phenomenon versus question", "portable concepts", "measurement and comparison", "models and evidence", "disciplinary boundary as a tool", "connected knowledge map"],
  optionalConcepts: ["institutions of inquiry", "translation across scales", "epistemic humility"],
  methods: ["observation and recording", "comparison and classification", "measurement and modelling", "experiment, interpretation, and argument", "teaching, criticism, and revision"],
  history: "Human communities have always made practical distinctions, but the modern landscape grew through long transitions: oral memory to writing; craft and ritual to systematic observation; philosophical questions to specialised methods; local schools to universities, laboratories, archives, and public institutions. The result is not a finished hierarchy. It is a historical accumulation of ways of asking better questions.",
  applications: ["choosing a next field of study", "reading interdisciplinary public problems", "understanding why evidence standards differ", "finding the right MapKAI route from an everyday question to deeper learning"],
  connections: [
    { field: "All MapKAI fields", connection: "Every field is a response to a recurring class of questions in the same continuous world.", difference: "The map preserves different objects, methods, and standards rather than flattening them into one method." },
    { field: "AI-era General Literacy", connection: "People now need to organise knowledge while new human–AI practices are still forming.", difference: "It is a curated contemporary overlay, not a replacement for mature disciplines." },
    { field: "Education", connection: "A map becomes useful only when it can be learned and passed on.", difference: "Education studies the transmission of knowledge; the overview explains the landscape being transmitted." }
  ],
  limits: "Any map compresses. Categories can clarify a route while hiding overlap, power, history, or new knowledge that has not yet acquired a stable name. MapKAI must remain revisable and must show boundaries as useful, conditional instruments.",
  learnerModel: "After the overview, a learner should be able to ask: what recurring problem is this field built to clarify, what evidence does it trust, what territory does it cover, what neighbours does it need, and what question should I explore next?",
  returnToEarth: "The parallel civilization was a lens, not our history. Our civilization has already built this vast, revisable landscape. MapKAI is the existing map through which a learner can enter it.",
  visuals: ["an unlabeled landscape of falling objects, crops, conversations, bodies, stars, and signals", "a single practical notebook becoming a shared record", "patterns linking observation to concept to method", "continents of the existing MapKAI map lighting up without becoming a new taxonomy", "a final zoom from one learner's question to the real knowledge landscape"],
  avoid: ["no fake academic field called World K", "no new taxonomy or future department", "no product advertisement", "no mechanical list of subjects", "no claim that the fictional civilization is historical", "no childish characters or classroom dialogue"]
};

export const FIELD_PROFILES = {
  "0311": {
    name: "Economics", nameZh: "经济学", category: "Social Sciences, Journalism and Information", group: "Social and behavioural sciences", engine: "paradox", candidateEngines: ["paradox", "dilemma", "system cascade"],
    centralQuestion: "When every useful choice has an opportunity cost, how do individual decisions become prices, markets, institutions, and social outcomes?",
    necessaryWhen: "People must allocate scarce time, land, labour, capital, and attention among competing futures, and the consequences of one choice spill beyond the person who made it.",
    thesis: "Economics begins before money: it is the disciplined study of trade-offs, incentives, coordination, distribution, and the institutions that turn scarce productive capacity into lived outcomes.",
    openingHook: "A settlement wakes after a mysterious windfall: every household has twice as many tokens in its chest, but there are no extra homes, bread ovens, doctors, tools, or hours in the day. Has the settlement become twice as rich?",
    openingProblem: "One reservoir can irrigate food, cool workshops, or protect a wetland. Every use is defensible, but choosing one closes another future. Private judgement no longer explains the result seen by the whole settlement.",
    existingKnowledge: ["counting stores", "customary exchange", "personal bargaining", "practical knowledge of seasons and tools", "trust between known neighbours"],
    trigger: "Scarcity and interdependence make separate household decisions alter prices, access, power, and future capacity for strangers.",
    ordinaryIntuition: "A choice costs whatever money is paid, and more money or more trade must make everyone better off.",
    failedIntuition: "Money can change claims without creating real resources; an exchange can hide an opportunity abandoned, a cost shifted to others, or a public benefit no buyer can own.",
    tension: "How can a society coordinate millions of competing plans when no single person can see all resources, needs, or consequences?",
    aha: "The first economic fact is not a price tag but a forgone possibility: the cost of a choice is the best alternative that choice prevents, and institutions determine who carries that loss or receives the gain.",
    secondaryTurns: [
      "Prices can coordinate dispersed information without guaranteeing justice or revealing every external cost.",
      "Specialisation and exchange can make a larger total possible even when abilities are unequal, but distribution remains a separate question.",
      "Private incentives can produce public problems when pollution, knowledge, or infrastructure crosses the boundary of a transaction.",
      "The economy is a feedback system: expectations, money, employment, policy, and institutions can amplify or dampen local choices."
    ],
    emergencePath: ["multiple legitimate uses compete for a scarce resource", "foregone alternatives become visible", "exchange and prices coordinate dispersed decisions", "specialisation creates gains and dependence", "externalities and public goods expose market boundaries", "macro institutions and policy address economy-wide feedback"],
    map: [
      { name: "Microeconomics", reason: "Households, firms, and markets require models of choice, incentives, prices, and strategic interaction." },
      { name: "Macroeconomics", reason: "Inflation, employment, money, growth, and crises create feedback no single transaction can explain." },
      { name: "Public economics", reason: "Taxes, public goods, welfare, and externalities ask what private exchange cannot coordinate alone." },
      { name: "Development and labour economics", reason: "Productivity, work, inequality, and long-run change make distribution and institutions central." },
      { name: "Behavioural and institutional economics", reason: "Real decisions depart from perfect calculation, and rules shape the incentives people face." }
    ],
    concepts: ["scarcity and opportunity cost", "supply, demand, and price signals", "comparative advantage", "externalities and public goods", "incentives and institutions", "aggregate feedback"],
    optionalConcepts: ["bounded rationality", "game theory", "monetary policy", "distributional incidence"],
    methods: ["models with explicit assumptions", "national accounts and market data", "natural and randomised experiments", "historical and institutional comparison", "causal inference and distributional analysis"],
    history: "Political economy grew from reflection on trade, household management, taxation, and wealth. Classical arguments about division of labour and markets were reshaped by marginal analysis, industrial capitalism, national income accounting, Keynesian macroeconomics, econometrics, behavioural research, and renewed work on institutions, inequality, and climate constraints. Each shift widened what counted as an economic consequence.",
    applications: ["pricing and competition policy", "central banking and inflation analysis", "tax, welfare, and public investment", "labour markets and organisational decisions", "climate and environmental policy"],
    connections: [
      { field: "Statistics (0542)", connection: "Economic claims about effects and forecasts require sampling, uncertainty, and causal evidence.", difference: "Statistics supplies inference tools; economics supplies theories of incentives, allocation, and institutions." },
      { field: "Finance, banking and insurance (0412)", connection: "Capital, risk, and intertemporal claims are economic choices made through financial institutions.", difference: "Finance focuses on valuation and risk instruments; economics asks how the wider system allocates and distributes." },
      { field: "Political sciences and civics (0312)", connection: "Rules and coalitions determine which economic institutions are possible.", difference: "Politics explains authority and collective choice; economics traces incentives and resource consequences." },
      { field: "Law (0421)", connection: "Contracts, property, liability, and regulation set the rules within which exchange occurs.", difference: "Law gives claims institutional form; economics tests behavioural and welfare consequences." }
    ],
    limits: "Models simplify motives, power, time, and institutions. Prices can omit care, ecological damage, unpaid work, or future risk; causal evidence is difficult when people and policies adapt to being observed. A mature economic claim names its comparison, distribution, horizon, and assumptions.",
    learnerModel: "See every economic argument as a claim about trade-offs, incentives, distribution, coordination, and institutions—not merely as a chart about money.",
    returnToEarth: "The settlement's doubled tokens were a thought experiment. In our world, economics is the developed set of models, evidence, and institutional questions used to understand how scarce resources become social outcomes.",
    visuals: ["one reservoir branching into food, workshop, and wetland futures", "tokens doubling while real goods remain fixed", "price signals travelling through a supply network", "an externality crossing a transaction boundary", "distribution and macro feedback loops"],
    avoid: ["do not equate economics with personal finance", "do not present markets as automatically fair", "do not repeat a generic prosperity story", "do not use GDP as the whole field", "do not make the settlement a historical claim"]
  },
  "0533": {
    name: "Physics", nameZh: "物理学", category: "Natural Sciences, Mathematics and Statistics", group: "Physical sciences", engine: "mystery", candidateEngines: ["mystery", "scale shift", "tool changes observability"],
    centralQuestion: "How can a few deep principles explain both a falling stone and the behaviour of stars, atoms, light, and time?",
    necessaryWhen: "Local descriptions of motion, heat, light, and matter repeatedly disagree, and reliable prediction requires relationships that hold beyond one place, object, or observer.",
    thesis: "Physics searches for invariant structure beneath changing phenomena by isolating systems, measuring them, modelling relationships, and testing where a model succeeds or breaks.",
    openingHook: "A stone leaves a hand and falls. The Moon remains overhead. They look like opposite motions—but what if the Moon is falling too?",
    openingProblem: "A community can describe nearby motion by habit, yet the same rules must guide a bridge, a projectile, a lamp, and a planet. Local appearances do not reveal which quantities remain stable across scale.",
    existingKnowledge: ["measuring length and time for craft", "watching shadows and seasons", "practical balance and lever knowledge", "informal experiments with heat and light", "navigation by visible stars"],
    trigger: "The same apparent event behaves differently when distance, speed, temperature, or observer changes, exposing the limits of everyday categories.",
    ordinaryIntuition: "Earthly falling and celestial motion belong to separate kinds of nature, and time and distance are the same for every observer.",
    failedIntuition: "A single local frame can hide a common law; at extreme speed, gravity, small scale, or low temperature, inherited pictures of space, time, matter, and certainty stop working.",
    tension: "What can remain true when everything we see seems to change with scale, motion, and measurement?",
    aha: "The Moon is also falling: its sideways motion continually misses Earth. The first unification is not a new object but an invariant relationship beneath two different appearances.",
    secondaryTurns: [
      "Conservation laws show that change can be constrained even when motion looks complicated.",
      "Fields replace the idea of isolated pushes with structured conditions spread through space.",
      "Thermodynamics reveals that energy can be conserved while useful transformations still have direction and limits.",
      "Relativity and quantum theory make the observer, measurement, scale, and probability part of the model rather than footnotes."
    ],
    emergencePath: ["practical motion and shadows are recorded", "repeated measurements reveal regularities", "mathematical laws unify terrestrial and celestial cases", "fields and energy describe interactions beyond contact", "relativity revises space and time", "quantum theory revises what prediction and measurement mean"],
    map: [
      { name: "Classical mechanics", reason: "Motion, force, momentum, and gravity need a transferable framework at ordinary scales." },
      { name: "Electromagnetism and optics", reason: "Light, charge, and fields cannot be explained as only contact between solid objects." },
      { name: "Thermodynamics and statistical physics", reason: "Heat and many-particle systems introduce energy direction, probability, and macroscopic order." },
      { name: "Quantum physics", reason: "Atomic-scale matter and radiation force a probabilistic account tied to measurement." },
      { name: "Relativity and cosmology", reason: "High speed, strong gravity, and the universe require a geometry of spacetime rather than fixed absolute backgrounds." }
    ],
    concepts: ["measurement and model", "conservation laws", "fields", "energy and entropy", "relativity", "quantum probability"],
    optionalConcepts: ["symmetry", "standard model", "statistical ensembles", "cosmological expansion"],
    methods: ["controlled experiment", "mathematical modelling", "instrument calibration", "dimensional and scale analysis", "prediction, replication, and anomaly hunting"],
    history: "Natural philosophy became mathematical physics through early modern studies of motion and experiment. The nineteenth century added field theory, thermodynamics, and statistical reasoning. Twentieth-century relativity and quantum theory showed that classical laws are powerful limits rather than the final picture. Contemporary physics joins precision instruments, computation, laboratories, and cosmological observation to test where present models meet their boundaries.",
    applications: ["engineering and energy systems", "medical imaging and radiation therapy", "electronics, lasers, and communication", "climate and Earth observation", "spaceflight and navigation"],
    connections: [
      { field: "Mathematics (0541)", connection: "Equations, geometry, probability, and symmetry make physical relationships precise.", difference: "Mathematics explores formal possibility; physics constrains models through measurement of the world." },
      { field: "Chemistry (0531)", connection: "Physical laws explain the structure and transformation of matter.", difference: "Chemistry organises reactive substances and emergent properties; physics seeks more general underlying relations." },
      { field: "Statistics (0542)", connection: "Measurement noise, uncertainty, and model comparison are unavoidable in experiments.", difference: "Statistics formalises inference under uncertainty; physics supplies hypotheses about natural mechanisms." },
      { field: "Engineering and construction (07)", connection: "Physical models become designs that must survive material and safety constraints.", difference: "Engineering optimises artefacts under constraints; physics tests general laws and limits." }
    ],
    limits: "Models gain power by simplifying. They can fail at interacting scales, uncertain measurements, complex many-body behaviour, or unresolved theoretical boundaries. A physics claim is mature when its domain of validity, idealisations, and possible falsifying observations are visible.",
    learnerModel: "Think of physics as a search for invariants: identify what changes, what is conserved, what can be measured, and which model is adequate at this scale.",
    returnToEarth: "The falling stone and Moon were an editorial thought experiment, not a newly discovered event. Our real field is the expanding, testable map of laws and models that now reaches from atoms to galaxies.",
    visuals: ["stone trajectory becoming an orbital curve", "force, momentum, and energy diagrams", "heat moving through a machine", "field lines and pulses of light", "spacetime grids and quantum probability", "a scale transition from atom to galaxy"],
    avoid: ["do not stop at Newton", "do not portray equations as decoration", "do not claim quantum ideas are mystical proof", "do not collapse physics into engineering", "do not present the parallel observer as a historical witness"]
  },
  "0313": {
    name: "Psychology", nameZh: "心理学", category: "Social Sciences, Journalism and Information", group: "Social and behavioural sciences", engine: "intellectual conflict", candidateEngines: ["intellectual conflict", "mystery", "discovery"],
    centralQuestion: "Why can the same person sincerely think, feel, and act differently when attention, memory, biology, relationships, and situation change?",
    necessaryWhen: "Introspection and moral judgement cannot reliably explain patterned behaviour, yet decisions about learning, care, work, and relationships depend on mechanisms that people cannot fully observe from inside themselves.",
    thesis: "Psychology studies minds in bodies and situations by treating experience as meaningful evidence while testing confidence, mechanism, development, and context with methods stronger than introspection alone.",
    openingHook: "Several witnesses remember the same event with complete sincerity. Then one small change in the question alters a detail they were certain they saw. Is the mind a recorder—or an active constructor?",
    openingProblem: "A person can explain their own action convincingly after the fact, but the same behaviour changes with attention, reward, sleep, social pressure, bodily state, and the way a choice is framed.",
    existingKnowledge: ["first-person experience", "stories about character", "customs for teaching and care", "observation of habits", "informal knowledge of emotion and relationships"],
    trigger: "Sincere reports, repeated behaviour patterns, and failed predictions show that subjective certainty is not a complete window into mental mechanisms.",
    ordinaryIntuition: "People know why they acted and memories replay what happened; behaviour is mainly a stable expression of character.",
    failedIntuition: "Memory is reconstructed, attention is selective, behaviour is situational, and biological and social processes can influence a person without becoming conscious explanations.",
    tension: "How can a mind scientifically study a mind that does not fully understand itself?",
    aha: "The reversal is not that people are irrational or dishonest. It is that an adaptive, predictive mind can be sincere while its confidence is produced by mechanisms that still need independent evidence.",
    secondaryTurns: [
      "A useful mental shortcut can produce a systematic bias when the environment changes.",
      "Learning is not only storage; consequences and predictions reshape future behaviour.",
      "Development changes what a person can perceive, regulate, and remember across a life.",
      "A situation can make a disposition visible, mute it, or create behaviour no trait label predicted."
    ],
    emergencePath: ["people notice experience and behaviour", "stories and character explanations meet recurring anomalies", "measurement separates report, behaviour, and mechanism", "learning and cognition become experimental objects", "social and biological levels are integrated", "clinical practice links explanation to care and accountability"],
    map: [
      { name: "Cognitive psychology", reason: "Attention, perception, memory, language, and reasoning need models of information processing." },
      { name: "Developmental psychology", reason: "Change across the lifespan cannot be explained by a static adult mind." },
      { name: "Social psychology", reason: "Influence, identity, groups, and situations alter behaviour beyond individual traits." },
      { name: "Biological and neuropsychology", reason: "Brains, bodies, emotion, and behaviour constrain and enable mental processes." },
      { name: "Clinical and counselling psychology", reason: "Distress, assessment, intervention, and recovery test how explanation becomes care." }
    ],
    concepts: ["attention and perception", "learning and conditioning", "memory reconstruction", "schemas and biases", "person–situation interaction", "development and attachment"],
    optionalConcepts: ["neuroplasticity", "measurement reliability", "replication", "psychometrics"],
    methods: ["controlled experiments", "behavioural measurement", "longitudinal and developmental studies", "clinical evidence and case formulation", "statistical modelling and replication"],
    history: "Psychology separated from philosophy through nineteenth-century laboratories and measurement. Behaviourism made observable learning central; psychoanalytic and humanistic traditions foregrounded meaning and distress; the cognitive revolution returned attention to internal processes; neuroscience linked mind to brain and body. Replication and open-science reforms now ask which effects are robust, contextual, and practically useful.",
    applications: ["mental-health assessment and therapy", "learning and educational design", "health behaviour and rehabilitation", "workplace and organisational design", "human-centred technology and safety"],
    connections: [
      { field: "Education science (0111)", connection: "Learning, development, attention, and motivation shape how knowledge is taught.", difference: "Psychology studies mechanisms; education designs social practices and institutions around learning." },
      { field: "Medicine and health (09)", connection: "Mental and bodily health influence each other and require integrated care.", difference: "Medicine diagnoses and treats bodily conditions; psychology explains mental and behavioural mechanisms and interventions." },
      { field: "Sociology and cultural studies (0314)", connection: "Individuals develop inside norms, institutions, identities, and unequal structures.", difference: "Psychology focuses on person-level mechanisms; sociology traces patterned relations and institutions." },
      { field: "Statistics (0542)", connection: "Measurement reliability, uncertainty, and replication determine what psychological evidence can support.", difference: "Statistics provides inference tools; psychology supplies theories and measures of mind and behaviour." }
    ],
    limits: "Mental mechanisms are inferred, not directly watched. Measures can be culturally narrow, effects can be context-sensitive, and clinical categories carry ethical and institutional consequences. Confidence, vividness, and statistical significance are not identical to truth or usefulness.",
    learnerModel: "Treat experience as important evidence but never the whole explanation; ask what mechanism, comparison, context, and independent measure could support a psychological claim.",
    returnToEarth: "The witnesses were an editorial thought experiment. Our psychology is the real, imperfect, evidence-seeking field that studies minds as biological, developmental, social, and clinical processes.",
    visuals: ["ambiguous images and selective attention", "a memory timeline being revised", "prediction and consequence loops", "a developmental sequence across life", "individual and group influence diagrams", "evidence and replication graphics"],
    avoid: ["do not reduce psychology to personality labels", "do not diagnose fictional witnesses", "do not present introspection as proof", "do not make the field a list of branches", "do not use childish therapy dialogue"]
  },
  "0542": {
    name: "Statistics", nameZh: "统计学", category: "Natural Sciences, Mathematics and Statistics", group: "Mathematics and statistics", engine: "discovery", candidateEngines: ["discovery", "paradox", "tool changes observability"],
    centralQuestion: "How can we infer reliable patterns about a population or process from noisy, incomplete, and potentially biased observations?",
    necessaryWhen: "Variation becomes too large for anecdote and intuition, decisions concern groups rather than only observed cases, and evidence must carry uncertainty instead of hiding it.",
    thesis: "Statistics is the disciplined design and analysis of evidence under variation: it makes uncertainty, sampling, comparison, prediction, and decision visible rather than pretending noise is a nuisance that can be ignored.",
    openingHook: "A town announces a miraculous improvement: the average recovery time has fallen by half. Then the denominator changes. The miracle was not entirely false—but the comparison was answering a different question.",
    openingProblem: "A small sample contains real signals mixed with measurement error, selection, missing cases, and chance. People must decide whether a pattern will travel beyond the observations that first revealed it.",
    existingKnowledge: ["counting harvests and births", "keeping ledgers", "comparing repeated measurements", "practical judgement about unusual cases", "probabilistic games and risk intuition"],
    trigger: "Institutions must act on populations and uncertain futures, while the available observations are partial, dependent, or collected by different rules.",
    ordinaryIntuition: "A larger number of observations automatically gives a truer answer, and a striking difference must have a meaningful cause.",
    failedIntuition: "More data can reproduce a biased sample; random variation can look like a pattern; measurement and comparison choices determine what an estimate means.",
    tension: "What does the data justify when the world never hands us a noiseless, complete view?",
    aha: "Statistical reliability is not a property of a pile of numbers. It is a relationship among a question, a sampling process, a comparison, a model, and the uncertainty each introduces.",
    secondaryTurns: [
      "Averages can compress meaningful variation and conceal who bears a risk or benefit.",
      "Randomisation creates a comparison that can make causal differences more visible than clever storytelling.",
      "A confidence interval is not a probability that one fixed hypothesis is true; it is a calibrated statement about a procedure and repeated samples.",
      "Prediction and explanation can need different models, even when they use the same data."
    ],
    emergencePath: ["counts and records reveal variability", "samples stand in for inaccessible populations", "probability formalises repeated uncertainty", "experimental design protects comparisons", "inference and models separate signal from noise", "computing expands scale while making bias and reproducibility more visible"],
    map: [
      { name: "Descriptive statistics", reason: "Distributions, summaries, and visualisations make variation visible before explanation." },
      { name: "Probability and statistical inference", reason: "Uncertainty about samples and populations needs a formal language." },
      { name: "Regression and causal inference", reason: "Relationships, confounding, and interventions require explicit comparisons and assumptions." },
      { name: "Survey and sampling methodology", reason: "Who is observed, who is missing, and how units are selected determine what can generalise." },
      { name: "Bayesian, computational, and decision statistics", reason: "Complex models and decisions update beliefs while keeping loss, prior information, and computation visible." }
    ],
    concepts: ["variation and distribution", "sampling and representativeness", "probability", "randomisation", "estimation and uncertainty", "confounding and causality"],
    optionalConcepts: ["Bayes' theorem", "likelihood", "regularisation", "reproducibility"],
    methods: ["measurement design", "random and stratified sampling", "experiments and quasi-experiments", "regression and probabilistic models", "sensitivity, calibration, and robustness checks"],
    history: "Statistics grew from censuses, state records, insurance, astronomy, and error analysis. Least-squares methods and probability made noisy observations tractable; twentieth-century experimental design and inference formalised comparison and decision; computers expanded simulation, data collection, and model complexity. Current practice increasingly confronts missingness, selection, causal assumptions, reproducibility, and algorithmic bias.",
    applications: ["clinical trials and public health", "quality control and engineering", "surveys and elections", "scientific measurement", "policy evaluation, forecasting, and machine learning"],
    connections: [
      { field: "Mathematics (0541)", connection: "Probability and inference rely on formal structures and proofs.", difference: "Mathematics studies abstract relationships; statistics asks what uncertain data can justify in a context." },
      { field: "Economics (0311)", connection: "Economic claims need causal and distributional evidence under uncertainty.", difference: "Statistics supplies evidence design and inference; economics supplies theories of allocation and incentives." },
      { field: "Psychology (0313)", connection: "Psychological constructs need reliable measurement and replication.", difference: "Statistics tests patterns and uncertainty; psychology defines the mechanisms and measures." },
      { field: "Computer science and AI (06)", connection: "Algorithms learn patterns from data and must be evaluated under shift and bias.", difference: "Statistics foregrounds sampling, uncertainty, and inference; computing foregrounds representation, algorithms, and systems." }
    ],
    limits: "No procedure removes the assumptions built into measurement, sampling, model choice, or decision loss. Statistical significance can coexist with trivial effect, and prediction can succeed without causal understanding. A responsible analysis reports uncertainty, missingness, sensitivity, and the population to which the claim applies.",
    learnerModel: "Ask what was measured, who or what was observed, what comparison was made, what uncertainty remains, and which decision the analysis is meant to support.",
    returnToEarth: "The town's miracle was a thought experiment. Our statistics is the developed practice of designing and analysing evidence when variation and incomplete information make certainty impossible.",
    visuals: ["a distribution widening as hidden cases appear", "the same average with different underlying populations", "randomisation reshuffling comparison groups", "a causal diagram with confounders", "uncertainty intervals widening and narrowing with design choices", "a dashboard revealing missingness rather than hiding it"],
    avoid: ["do not equate statistics with dashboards", "do not imply more data cures bias", "do not present p-values as truth probabilities", "do not use a fake election or medical result as evidence", "do not reduce the field to formulas without decisions"]
  },
  "0421": {
    name: "Law", nameZh: "法律", category: "Business, Administration and Law", group: "Law", engine: "dilemma", candidateEngines: ["dilemma", "competing explanations", "journey"],
    centralQuestion: "How can a community turn conflict into rules that are publicly knowable, contestable, and enforceable even when the people involved disagree?",
    necessaryWhen: "Custom, personal wisdom, and informal power no longer provide predictable coordination among strangers, repeated disputes, property, harm, authority, and responsibility.",
    thesis: "Law is an institutional technology for making claims, duties, procedures, and remedies more predictable and contestable; it orders power without eliminating interpretation, disagreement, or injustice.",
    openingHook: "Two people bring the same injury before two equally wise judges. One judge values intention, the other consequence. Both are sincere. Can a community call the result stable law if the rule changes with the person who happens to decide?",
    openingProblem: "A small group can rely on memory, reputation, and a respected elder. As scale grows, strangers need to know what counts as a promise, an offence, evidence, a remedy, and a fair process before conflict occurs.",
    existingKnowledge: ["custom and reputation", "restorative negotiation", "oaths and promises", "shared prohibitions", "practical ideas of harm and repair"],
    trigger: "The same dispute recurs across strangers and institutions, and personal judgement alone cannot make expectations public, reviewable, or consistent.",
    ordinaryIntuition: "A wise decision is enough; if the outcome seems fair to the current authority, a stable rule has been created.",
    failedIntuition: "Without public rules, procedure, evidence, and review, authority becomes unpredictable and unequal; a fair outcome today cannot be relied on tomorrow.",
    tension: "How can rules constrain power while still leaving room to interpret facts, context, and changing values?",
    aha: "A rule becomes institutional when people can know it before the dispute, challenge how it was applied, and seek a remedy beyond the private will of the decision-maker.",
    secondaryTurns: [
      "Procedure is not decorative delay; it is how a claim becomes auditable by people who were not present at the original conflict.",
      "Rights and contracts make future action predictable, but they also distribute power and risk rather than merely recording neutral facts.",
      "Precedent connects one decision to later cases while interpretation keeps rules responsive to new facts.",
      "Public law and regulation arise when private agreements cannot govern collective power, safety, or shared resources."
    ],
    emergencePath: ["custom handles familiar conflicts", "repeated disputes demand public memory", "rules classify claims, harms, and duties", "procedure and evidence make decisions reviewable", "institutions separate authority, adjudication, and enforcement", "rights and regulation adapt law to complex societies"],
    map: [
      { name: "Constitutional and public law", reason: "Authority itself needs limits, allocation, and review." },
      { name: "Private and civil law", reason: "Promises, property, liability, and remedies coordinate relationships among people and organisations." },
      { name: "Criminal law", reason: "A community defines public wrongs, state power, proof, and proportionate punishment." },
      { name: "Administrative and regulatory law", reason: "Modern institutions need accountable rules for delegated power, safety, markets, and public services." },
      { name: "International and human-rights law", reason: "Cross-border relations and universal claims exceed one sovereign's ordinary jurisdiction." }
    ],
    concepts: ["rule of law", "due process and evidence", "rights and duties", "precedent and interpretation", "contract and legal personality", "remedy and enforcement"],
    optionalConcepts: ["jurisdiction", "proportionality", "legal pluralism", "regulatory governance"],
    methods: ["textual and purposive interpretation", "precedent and analogy", "fact-finding and evidence rules", "adversarial and inquisitorial procedure", "institutional and comparative analysis"],
    history: "Customary norms and early codes made obligations more public; Roman legal concepts and later common-law reasoning developed durable categories and precedent. Constitutionalism, rights discourse, administrative states, international institutions, and modern regulation expanded law's reach while exposing its relationship to power, exclusion, and social change. Legal systems remain historical institutions, not neutral algorithms.",
    applications: ["contracts and commerce", "criminal justice and due process", "constitutional rights", "regulation of safety, labour, and markets", "digital privacy, liability, and cross-border governance"],
    connections: [
      { field: "Political sciences and civics (0312)", connection: "Law allocates authority and turns political choices into institutions.", difference: "Politics studies power and collective choice; law studies the valid forms, procedures, and remedies that structure them." },
      { field: "Economics (0311)", connection: "Property, contract, liability, and regulation alter incentives and distribution.", difference: "Economics models behavioural and welfare consequences; law determines claims, duties, and enforceability." },
      { field: "Psychology (0313)", connection: "Witness memory, judgement, deterrence, and rehabilitation depend on human behaviour.", difference: "Psychology studies mechanisms and evidence; law must make an institutional decision under procedural constraints." },
      { field: "Computing and information (06)", connection: "Digital systems create new evidence, privacy, identity, and liability problems.", difference: "Computing builds and analyses systems; law decides which rights and responsibilities attach to their use." }
    ],
    limits: "Law can make power visible and contestable, but it can also encode exclusion, procedural inequality, or outdated categories. Text does not eliminate interpretation; formal equality does not guarantee equal access. A mature legal analysis separates validity, evidence, institutional power, remedy, and justice.",
    learnerModel: "When facing a legal claim, ask what rule applies, who has standing, what evidence and procedure make it reviewable, which institution can remedy it, and whose power the rule distributes.",
    returnToEarth: "The two judges were a constructed dilemma. Our law is the real, historically layered system of rules, institutions, interpretation, procedure, and remedies through which societies try—imperfectly—to make conflict governable.",
    visuals: ["a dispute branching under two private judgements", "custom becoming a public record", "a rule, evidence, hearing, decision, and appeal loop", "rights and duties connecting strangers", "a regulatory network spanning markets, bodies, and data", "a final zoom from one dispute to legal institutions"],
    avoid: ["do not present law as morality with penalties", "do not treat statutes as self-executing code", "do not invent a real court case", "do not make fairness identical to consistency", "do not reduce the map to criminal law"]
  }
};

export const AI_ERA_OVERLAY = {
  id: "AI-ERA-GENERAL-LITERACY-EDITORIAL-OVERLAY",
  name: "AI-Era General Literacy",
  nameZh: "AI 时代通识",
  slug: "ai-era-general-literacy-editorial-overlay",
  type: "AI_ERA_GENERAL_LITERACY",
  taxonomyStatus: "NOT_FOUND_AS_A_DISTINCT_FORMAL_FIELD_IN_CURRENT_SCRIPT_JS",
  centralQuestion: "What must a broadly educated person learn to notice, verify, delegate, and decide when AI systems mediate knowledge work?",
  thesis: "AI-era general literacy is a MapKAI-curated contemporary overlay for human–AI collaboration, verification, judgement, synthetic media, learning, work, and creative practice; it is not a claim that a universally standardised academic discipline already exists.",
  scope: ["human–AI collaboration", "agent literacy", "hallucination and verification", "synthetic media literacy", "model literacy for general users", "AI-assisted thinking and learning", "judgement in AI-mediated work", "personal AI systems", "AI-native creative practice"],
  exclusions: ["transformer architecture → Computing / Technology", "monetary impact of AI → Economics", "AI liability doctrine → Law", "statistical model evaluation → Statistics / Computing"],
  narrative: "Unlike mature fields, this package need not pretend to look backward from a completed discipline. The transition is happening in our own civilisation now; the honest story is a boundary forming while people learn how to work with systems that can generate, compress, and mislead.",
  connections: ["Computer science: systems and models", "Economics: incentives and labour", "Psychology: judgement and cognition", "Management: workflows and responsibility", "Ethics and philosophy: values and agency", "Media: synthetic evidence and provenance", "Education: learning and assessment", "Law: rights, liability, and governance"],
  learnerModel: "Treat AI as a powerful, fallible participant in a larger human system: specify the task, inspect provenance, verify consequential claims, preserve judgement, and know which mature field owns the underlying question.",
  avoid: ["do not create a duplicate formal taxonomy field", "do not imply all AI questions belong here", "do not claim universal academic standardisation", "do not make product promises or fear-based marketing"]
};
