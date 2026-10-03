// Publication-grounded explanatory diagrams. Layouts are original, with their scope identified below.
const bi = (zh, en) => ({ zh, en });
const p = (key, zh, en, zhBody, enBody) => ({ key, label: bi(zh, en), body: bi(zhBody, enBody) });
export const additions = [];
export const additionalNotes = {};
function add(id, zh, en, credit, category, basis, basisEn, summary, summaryEn, use, useEn, reading, readingEn, parts, layout) {
  additions.push({ id, name: bi(zh,en), alias: en, credit, category, summary: bi(summary,summaryEn), use: bi(use,useEn), tags: bi([zh,category],[en,category]), source: { label: basis } });
  additionalNotes[id] = { basis: bi(basis,basisEn), reading: bi(reading,readingEn), parts, layout };
}
add('kolb-cycle','Kolb 经验学习循环','Kolb’s Experiential Learning Cycle','David A. Kolb · 1984','learning',
  "Kolb（1984）· 经验学习循环简图","Kolb (1984) · Experiential learning cycle",
  '把经历转化为学习：经历具体情境，反思发生了什么，形成解释，再通过行动检验解释。','Turn experience into learning through reflection, conceptual understanding and experimentation.',
  '复盘项目、练习领导行为，或设计一轮有反馈的学习。','Reviewing a project or designing a learning activity with feedback.',
  '沿箭头读一轮；新的试验产生下一次经历。它是学习过程，不是给人贴固定学习风格标签。','Follow the cycle. Experiments create fresh experiences; the diagram describes a process, not fixed learner types.',[
    p('experience','具体经历','Concrete|experience','先记录具体发生了什么。','Start with a specific experience.'),
    p('reflect','反思观察','Reflective|observation','回看行动、感受和结果之间的关系。','Review actions, reactions and outcomes.'),
    p('concept','抽象概念','Abstract|conceptualization','提出能够解释经历的概念或假设。','Develop a concept or hypothesis that explains the experience.'),
    p('test','主动试验','Active|experimentation','在下一次行动中检验新理解。','Test the new understanding in action.'),
  ],'cycle');
add('listening-levels','Scharmer 四层倾听','Four Levels of Listening','C. Otto Scharmer · Theory U','learning',
  "Scharmer · Theory U · 四层倾听简图","Scharmer · Theory U · Four listening levels",
  '从确认已有判断，逐渐转向听见新事实、理解对方处境，再共同发现新的可能。','Move from confirming familiar views toward noticing facts, understanding another person and sensing emerging possibilities.',
  '团队访谈、教练对话，或发现会议总在重复原有立场时。','Interviews, coaching and meetings stuck in familiar positions.',
  '向下表示注意力的转变，不是给他人打分。生成式倾听需要对话双方的参与。','Read downward as a shift in attention, not a rating of other people.',[
    p('download','1 · 下载式倾听','1 · Downloading','主要听见自己已经相信的内容。','Hear what confirms existing judgments.'),
    p('factual','2 · 事实式倾听','2 · Factual listening','开放头脑，注意与预期不同的事实。','Notice facts that challenge expectations.'),
    p('empathic','3 · 共情式倾听','3 · Empathic listening','开放心态，尝试从对方的位置理解。','Understand the situation from the other person’s perspective.'),
    p('generative','4 · 生成式倾听','4 · Generative listening','开放意志，让新的共同方向浮现。','Allow a new shared possibility to emerge.'),
  ],'levels');
add('three-voices','开放学习的三种阻力','Three Voices That Block Openness','C. Otto Scharmer · Theory U','learning',
  "Scharmer · Theory U · 开放与阻力的关系","Scharmer · Theory U · Openness and its barriers",
  '判断、犬儒和恐惧会分别妨碍开放头脑、开放心态与开放意志。识别它们，帮助自己停下自动反应。','Judgment, cynicism and fear can obstruct an open mind, heart and will. Recognizing them helps interrupt habitual reactions.',
  '面对不同意见、改变或试验时，辨认自己为何不愿继续探索。','Reflecting on resistance to disagreement, change or experimentation.',
  '每行是阻力与对应的开放方向，不表示消除情绪就一定成功。','Each row pairs a barrier with an orientation toward openness.',[
    p('judgment','判断 → 开放头脑','Judgment → Open mind','暂缓“我已经知道”，继续询问事实。','Suspend certainty and keep investigating.'),
    p('cynicism','犬儒 → 开放心态','Cynicism → Open heart','从疏离或否定，转向理解对方经验。','Move from dismissal toward understanding another person.'),
    p('fear','恐惧 → 开放意志','Fear → Open will','承认不确定性，为新的行动留出空间。','Acknowledge uncertainty and make room for a new action.'),
  ],'threeRows');
add('psychological-safety','心理安全与绩效标准','Psychological Safety & Performance Standards','Amy C. Edmondson','learning',
  "Edmondson · The Fearless Organization · 图 1.1 简化重绘","Edmondson · The Fearless Organization · Simplified Figure 1.1",
  '同时看团队是否敢表达，以及是否有高标准。安全感与责任要求共同支持学习；只有其中一个，容易落入舒适或焦虑。','Consider both speaking-up safety and performance standards. Their combination supports learning; either alone creates a different team climate.',
  '复盘沉默、避责或高压团队，讨论如何兼顾坦诚与要求。','Discussing silence, low accountability or anxiety in a team.',
  '纵轴为心理安全，横轴为绩效标准。四象限来自后来的著作；1999 年论文提供研究基础。','Safety increases upward; standards increase to the right. The later book supplies the matrix; the 1999 paper supplies the research foundation.',[
    p('comfort','舒适区','Comfort zone','高安全、低标准：相处轻松，但挑战不足。','High safety, low standards: ease without enough challenge.'),
    p('learning','学习区','Learning zone','高安全、高标准：敢说问题，也对工作质量负责。','High safety and standards: candid discussion with accountability.'),
    p('apathy','冷漠区','Apathy zone','低安全、低标准：既不愿发言，也缺少投入。','Low safety and standards: withdrawal and limited engagement.'),
    p('anxiety','焦虑区','Anxiety zone','低安全、高标准：要求很高，却不敢提问或暴露问题。','Low safety, high standards: pressure without freedom to speak up.'),
  ],'matrix');
add('seci','SECI 知识创造循环','SECI Knowledge Creation','Ikujiro Nonaka · 1994','learning',
  "Nonaka（1994）· 四种知识转换简图","Nonaka (1994) · Four knowledge conversions",
  '知识在共同实践、表达经验、整合信息和实际运用之间转换，让个人经验成为可共享、可继续发展的组织知识。','Knowledge develops through shared practice, articulation, recombination and use, linking individual experience with organizational learning.',
  '把个人诀窍变成团队可传递的经验，并检验文档是否真正被用起来。','Sharing practical expertise and checking whether documented knowledge becomes usable.',
  '顺时针读 S→E→C→I。“隐性”难以完整说出，“显性”可用语言或文件表达。反复转换可使知识在个人与组织之间发展。','Read S→E→C→I clockwise. Tacit knowledge is difficult to articulate; explicit knowledge can be expressed. Repeated conversions connect individual and organizational learning.',[
    p('social','S · 社会化','S · Socialization','隐性到隐性：通过共同经历和观察分享诀窍。','Tacit to tacit through shared experience and observation.'),
    p('external','E · 外显化','E · Externalization','隐性到显性：把经验表达为概念、比喻或模型。','Tacit to explicit through concepts, metaphors and models.'),
    p('combine','C · 组合化','C · Combination','显性到显性：重新组织已有的概念、数据和文档。','Explicit to explicit by reorganizing concepts and information.'),
    p('internal','I · 内化','I · Internalization','显性到隐性：通过实践把知识转为自己的能力。','Explicit to tacit as knowledge becomes practical ability.'),
  ],'cycle');
add('learning-70-20-10','70–20–10 领导力发展','70–20–10 Development','Center for Creative Leadership','learning',
  "CCL · 70–20–10 发展指引","CCL · 70–20–10 development guideline",
  '用挑战性经历、发展性关系和正式学习共同支持成长。70、20、10 是领导力发展的经验指引，并非每个人都适用的精确比例。','Combine challenging experience, developmental relationships and formal learning. The proportions are a development guideline, not a universal measurement.',
  '制定成长计划时，把真实任务、他人反馈与课程学习一起安排。','Planning development through work, feedback and structured study.',
  '色带只表示这条经验规则的比例，不表示学习保留率，也不意味着可以省略课程。','The band depicts the guideline, not knowledge-retention rates or a reason to remove formal learning.',[
    p('experience','70 · 挑战经历','70 · Experience','承担真实挑战，并安排反思和反馈。','Learn through challenging work, reflection and feedback.'),
    p('people','20 · 发展关系','20 · Relationships','从导师、同事、榜样和教练获得支持。','Learn with mentors, peers, role models and coaches.'),
    p('formal','10 · 正式学习','10 · Formal learning','通过课程、阅读和培训建立可用于实践的知识。','Build usable knowledge through courses, reading and training.'),
  ],'proportions');
add('inner-development-goals','IDG 内在发展五维','Inner Development Goals','Inner Development Goals','learning',
  "Inner Development Goals · 五维框架简图","Inner Development Goals · Five-dimensional sketch",
  '从自我关系、思考、关怀关系、合作与行动五个维度，观察实现复杂目标所需要的内在能力。','Reflect on inner capacities for complex goals through being, thinking, relating, collaborating and acting.',
  '领导力反思或个人发展计划中，发现能力的薄弱环节。','Identifying areas for reflection and personal development.',
  '五维彼此配合，没有固定先后。选择一个当前需要发展的维度，再结合具体行为制定行动。','The dimensions interact without a fixed sequence. Choose an area to develop and connect it to specific actions.',[
    p('being','存在','Being','观察自我意识、内在方向和对自身的关系。','Consider self-awareness and the relationship to oneself.'),
    p('thinking','思考','Thinking','扩展理解复杂性、审视问题与看待长远的能力。','Develop perspectives for complexity and longer-term understanding.'),
    p('relating','关系','Relating','关注他人和世界，发展关怀与连接。','Cultivate care and connection with others and the world.'),
    p('collaborating','合作','Collaborating','跨差异协作，形成共同工作的能力。','Work across differences and build collective capacity.'),
    p('acting','行动','Acting','把理解转为有持续性的行动。','Translate understanding into sustained action.'),
  ],'five');
add('pbl-seven-steps','PBL 七步学习法','PBL Seven-Step Approach','Maastricht University','learning',
  "Maastricht University · PBL 七步流程","Maastricht University · PBL seven-step process",
  '围绕一个真实问题，先共同找出已知与未知，再开展自主学习，回到小组比较证据并形成理解。','Start from a problem, identify knowledge gaps together, study independently and return to compare findings.',
  '小组学习新议题，避免直接分工搜索、最后机械拼接。','Organizing group inquiry around shared learning questions.',
  '前三步打开问题，接着整理并形成学习目标；自主学习后再讨论。七步是组织学习的工具，可按情境调整。','Clarify and explore the problem, structure learning goals, study and reconvene. Adapt the sequence to the learning context.',[
    p('terms','1 · 澄清术语','1 · Clarify terms','确认大家对词语与情境的理解。','Clarify unfamiliar terms and context.'),
    p('problem','2 · 界定问题','2 · Define problem','形成共同的问题表述。','Agree on the problem to explore.'),
    p('brainstorm','3 · 头脑风暴','3 · Brainstorm','调用已有知识，提出可能解释。','Generate explanations using existing knowledge.'),
    p('structure','4 · 整理解释','4 · Structure ideas','分析不同解释之间的联系和缺口。','Organize explanations and identify gaps.'),
    p('goals','5 · 学习目标','5 · Learning goals','明确需要继续研究的问题。','Specify questions for further study.'),
    p('study','6 · 自主学习','6 · Self-study','查找和评估与学习目标相关的资料。','Investigate and evaluate relevant sources.'),
    p('share','7 · 讨论整合','7 · Discuss findings','带着证据回到小组，修正共同理解。','Reconvene to discuss evidence and revise understanding.'),
  ],'seven');
add('leadership-perspectives','领导力的三种视角','Three Perspectives on Leadership','Zaar et al. · 2020 / 2026','learning',
  "Zaar 等（2020、2026）· 三种领导力视角的概念图解","Zaar et al. (2020, 2026) · Conceptual sketch of three perspectives",
  '职位视角关注层级和权力，关系视角关注人与人的影响，过程视角关注情境中共同形成的领导活动。','A positional view emphasizes authority; a relational view emphasizes influence; a process view emphasizes leadership emerging in context.',
  '讨论团队如何理解“领导”，检查是否只把领导等同于职位。','Examining how a team understands leadership and authority.',
  '三列是不同理解方式，不是人人必须经过的三个晋升级别。','The columns are perspectives, not mandatory stages of promotion.',[
    p('position','职位视角','Positional','关注层级、指挥与正式权力。','Emphasizes hierarchy, direction and formal authority.'),
    p('relation','关系视角','Relational','关注人与人之间的影响、支持和共同目标。','Emphasizes interpersonal influence, support and shared goals.'),
    p('process','过程视角','Process','关注互动和情境中持续生成的协作与学习。','Emphasizes leadership emerging through interaction, context and learning.'),
  ],'columns');
add('leader-schema-alignment','领导者身份与图式匹配','Leader Identity & Schema Alignment','Zaar · van den Bossche · Gijselaers','learning',
  "Zaar 等（2020、2026）· 图式关系简图","Zaar et al. (2020, 2026) · Schema relationship sketch",
  '把“领导是什么”“领导者是什么样”“我是否是领导者”放在一起看。经验与反思可以拓宽这些理解，并改变它们之间的匹配。','Compare beliefs about leadership, leaders and oneself as a leader. Experience and reflection can broaden these views and change their fit.',
  '角色转换、自我怀疑或领导力发展反思。','Reflecting on role transitions, self-doubt and leader development.',
  '三角形表示三种图式的关系；匹配和视角广度共同影响发展，图形不提供人格评分。','The triangle connects three schemas. Alignment and breadth of perspective support development; it is not a personality score.',[
    p('structure','领导是什么','What is|leadership?','对领导如何发生、如何组织的理解。','Beliefs about how leadership occurs and is organized.'),
    p('person','领导者是什么样','What is|a leader?','对典型领导者的特征与行为的理解。','Beliefs about the qualities and behavior of leaders.'),
    p('self','我作为领导者','Myself as|a leader','如何把自己的经验与领导者身份联系起来。','How one connects personal experience with being a leader.'),
    p('development','经验 · 反思 · 拓宽视角','Experience · Reflection · Broader views','通过观察、尝试和反馈，检查并调整三者的关系。','Use observation, experimentation and feedback to reconsider their fit.'),
  ],'triangle');
add('merchant-controls','Merchant 四类管理控制','Merchant’s Four Types of Control','Merchant & Van der Stede','strategy',
  "Merchant 与 Van der Stede（2017）· 四类控制简图","Merchant & Van der Stede (2017) · Four control types",
  '从结果、行动、人员和文化四个入口设计控制。衡量什么、怎样做、谁来做，以及群体规范，需要相互配合。','Design controls through results, actions, people and culture, considering how the four approaches work together.',
  '检查只靠绩效指标的管理制度还缺少哪些支持。','Reviewing a system that relies too heavily on outcome measures.',
  '四格是可组合的控制类型，没有固定实施顺序。','The four types can be combined; they do not form a sequence.',[
    p('results','结果控制','Results','设定结果目标，衡量并评价结果。','Set targets and evaluate results.'),
    p('actions','行动控制','Actions','通过流程约束、事前检查和行动责任影响行为。','Use procedures, reviews and action accountability.'),
    p('personnel','人员控制','Personnel','通过选人、培训和工作设计支持自我管理。','Support self-control through selection, training and job design.'),
    p('culture','文化控制','Culture','通过共同价值观、规范与同伴影响协调行动。','Coordinate behavior through shared norms and peer influence.'),
  ],'four');
add('activity-based-costing','ABC 作业成本法','Activity-Based Costing','Cooper & Kaplan · 1988','strategy',
  "Cooper 与 Kaplan（1988）· 成本分配路径","Cooper & Kaplan (1988) · Cost-allocation sketch",
  '先看活动消耗了哪些资源，再看产品、客户或服务消耗了哪些活动，借助成本动因解释间接成本。','Trace resource costs to activities, then activity costs to products, customers or services using cost drivers.',
  '产品复杂度差异大，统一分摊间接费用容易掩盖成本差异时。','When a broad overhead rate hides differences in complexity and resource use.',
  '沿箭头区分资源动因与作业动因；动因需要有可解释的消耗关系。','Distinguish resource drivers from activity drivers and examine their link to consumption.',[
    p('resources','资源成本','Resource costs','归集人员、设备与其他资源的成本。','Collect the costs of people, equipment and other resources.'),
    p('activities','活动 / 作业','Activities','识别订购、设置、检验等活动消耗的资源。','Identify resource use by activities such as ordering, setup and inspection.'),
    p('objects','成本对象','Cost objects','按活动消耗将成本归到产品、服务或客户。','Assign activity costs to products, services or customers.'),
  ],'abc');
add('responsibility-centers','责任中心与可控性','Responsibility Centers','Merchant & Van der Stede','strategy',
  "Merchant 与 Van der Stede（2017）第 7 章 · 责任范围示意","Merchant & Van der Stede (2017), Chapter 7 · Scope of responsibility",
  '成本中心、利润中心和投资中心的责任范围不同。绩效指标应考虑负责人能控制的成本、收入和资产。','Cost, profit and investment centers carry different responsibilities. Evaluation should reflect control over costs, revenues and assets.',
  '分配预算责任、设置事业部考核，或处理“有责任却无权决定”的问题。','Assigning budgets and evaluation where responsibility may exceed authority.',
  '由左至右表示责任范围扩大，不表示所有部门都应该升级为投资中心。','Left to right means a broader scope, not a required progression for every unit.',[
    p('cost','成本中心','Cost center','对可控成本负责，同时检查服务质量和业务约束。','Account for controllable costs alongside quality and operating requirements.'),
    p('profit','利润中心','Profit center','对收入与成本的组合负责。','Account for the combination of revenues and costs.'),
    p('investment','投资中心','Investment|center','在利润之外，还考虑资产投入与资本回报。','Also account for invested assets and returns on capital.'),
  ],'scope');
add('agency-model','委托—代理关系','Principal–Agent Relationship','Jensen & Meckling · 1976','strategy',
  "Jensen 与 Meckling（1976）· 委托—代理关系简图","Jensen & Meckling (1976) · Principal–agent relationship sketch",
  '委托人把决策交给代理人后，目标差异与信息不对称可能带来代理成本。授权、监督和激励应共同设计。','Delegation can create agency costs when interests diverge and information is uneven. Consider authority, monitoring and incentives together.',
  '讨论所有者与经理、总部与事业部的授权及激励安排。','Designing delegation and incentives between owners, managers or business units.',
  '上下两条箭头区分授权激励与行动报告；中间提示双方看到的信息可能不同。','The arrows distinguish delegation and incentives from action and reporting, with possible information differences.',[
    p('principal','委托人','Principal','交付资源与决策权，希望代理人实现约定目标。','Delegates resources and authority in pursuit of agreed objectives.'),
    p('agent','代理人','Agent','掌握行动信息，作出决策并接受评价。','Acts with local information and is evaluated on performance.'),
    p('gap','目标差异 · 信息不对称','Divergent interests · Uneven information','合同、监督与激励可以缓解问题，但本身也有成本。','Contracts, monitoring and incentives can help, while also costing resources.'),
  ],'agency');
add('iso-31000','ISO 31000 风险管理过程','ISO 31000 Risk Management Process','ISO · 2018','risk',
  "ISO 31000:2018 · 风险管理过程简图","ISO 31000:2018 · Risk-management process sketch",
  '先界定范围、环境和准则，再识别、分析、评价及处置风险。沟通、监测和记录贯穿整个过程。','Set scope, context and criteria; assess and treat risk. Communication, review and recording support the process throughout.',
  '为项目或组织建立一致的风险评估和持续复核方法。','Establishing a consistent risk assessment and review process.',
  '识别、分析和评价合称风险评估。处置后持续复核；沟通、监测与记录贯穿各步。','Identification, analysis and evaluation form risk assessment. Review continues after treatment, with communication, monitoring and recording throughout.',[
    p('context','范围 · 环境 · 准则','Scope · Context · Criteria','先界定目标、边界和评估标准。','Define objectives, boundaries and assessment criteria.'),
    p('identify','识别','Identify','发现风险来源、事件与可能后果。','Identify sources, events and consequences.'),
    p('analyze','分析','Analyze','理解风险特征、可能性与影响。','Understand likelihood, impact and other characteristics.'),
    p('evaluate','评价','Evaluate','对照准则确定优先级和后续行动。','Compare with criteria to guide priorities and action.'),
    p('treat','风险处置','Risk treatment','选择并落实应对安排，复核剩余风险。','Implement responses and examine residual risk.'),
    p('support','沟通协商 · 监测复核 · 记录报告','Consult · Monitor & review · Record & report','在整个过程中交流信息、检查变化并保留依据。','Exchange information, track change and preserve evidence throughout.'),
  ],'risk');
add('integrated-reporting','综合报告的六类资本','Six Capitals of Integrated Reporting','IIRC · 2013 / revised 2021','sustainability',
  "IIRC（2021 修订版）· 六类资本关系简图","IIRC (2021 revision) · Six-capital relationship sketch",
  '把财务、制造、知识、人力、社会关系和自然资本放在同一价值创造视角下，观察经营如何使用、改变和影响它们。','Consider how a business uses and changes financial, manufactured, intellectual, human, social and relationship, and natural capital.',
  '梳理商业模式对多种资源的依赖，以及创造价值时的取舍。','Mapping resource dependencies and trade-offs in a business model.',
  '六类资本是观察维度。经营结果可能增加、减少或改变不同资本，应一起考察长期影响和相互取舍。','The capitals are lenses. Operations can increase, diminish or transform them; examine long-term effects and trade-offs together.',[
    p('financial','财务资本','Financial','可用于经营的资金。','Funds available to the organization.'),
    p('manufactured','制造资本','Manufactured','支持经营的建筑、设备与基础设施。','Buildings, equipment and infrastructure.'),
    p('intellectual','知识资本','Intellectual','知识、系统、流程和知识产权。','Knowledge, systems, processes and intellectual property.'),
    p('human','人力资本','Human','人的能力、经验和参与。','People’s capabilities, experience and motivation.'),
    p('social','社会与关系资本','Social &|relationship','信任、网络和与利益相关方的关系。','Trust, networks and stakeholder relationships.'),
    p('natural','自然资本','Natural','生态资源与支持经营的自然过程。','Environmental resources and natural processes.'),
    p('business','商业模式 · 价值创造与影响','Business model · Value creation & effects','考察资本之间的联系、取舍和随时间发生的变化。','Examine connections, trade-offs and changes over time.'),
  ],'capitals');
add('sustainability-value-chain','可持续议题与价值链','Sustainability & the Value Chain','EFRAG · IG 2 · 2024','sustainability',
  "EFRAG IG 2（2024）· 价值链关系简图","EFRAG IG 2 (2024) · Value-chain relationship sketch",
  '把上游、自身运营和下游放在一起识别影响、风险与机会，避免只看企业直接控制的活动。','Consider upstream relationships, own operations and downstream activities when identifying impacts, risks and opportunities.',
  '开展重要性评估，查找采购、使用或处置环节的遗漏。','Checking whether a materiality assessment misses purchasing, use or disposal.',
  '箭头表示价值链联系，不表示报告必须罗列每一家供应商。应结合具体议题、业务关系与重要性判断。','Arrows show relationships, not a requirement to list every supplier. Consider the issue, business relationships and materiality.',[
    p('upstream','上游','Upstream','关注投入品、供应商及相关业务关系。','Consider inputs, suppliers and related business relationships.'),
    p('own','自身运营','Own operations','关注企业自身的活动与资源使用。','Consider the organization’s activities and resource use.'),
    p('downstream','下游','Downstream','关注分销、使用和产品生命周期末端。','Consider distribution, use and end-of-life activities.'),
    p('assessment','影响 · 风险 · 机会','Impacts · Risks · Opportunities','跨价值链识别实际与潜在影响，以及财务风险和机会。','Assess impacts and financial risks and opportunities across the chain.'),
  ],'valuechain');
add('npv-decision','NPV 投资决策','Net Present Value Decision','Berk · DeMarzo · Harford','finance',
  "Berk、DeMarzo 与 Harford · 净现值决策图解","Berk, DeMarzo & Harford · NPV decision sketch",
  '把未来增量现金流按合适的机会成本折回今天，再扣除初始投入。净现值帮助判断项目是否创造价值。','Discount incremental cash flows at an appropriate opportunity cost and subtract the initial investment to assess value creation.',
  '比较投入与回报发生在不同时间的投资方案。','Comparing an investment’s costs and benefits across time.',
  '这是现金流时间线；正 NPV 的判断依赖预测和折现率。互斥项目、预算约束及实物期权还需另行考虑。','This is a cash-flow timeline. Decisions depend on forecasts and discount rates; mutually exclusive choices, constraints and options require further analysis.',[
    p('today','t = 0|初始投入','t = 0|Investment','记录今天需要付出的增量现金流。','Record the incremental cash outlay today.'),
    p('future','t = 1…T|未来现金流','t = 1…T|Cash flows','预测相关的未来增量现金流，而非只看会计利润。','Forecast relevant incremental cash flows rather than accounting profit alone.'),
    p('discount','按机会成本折现','Discount at opportunity cost','使现金流的风险、币种、期限与折现率口径相配。','Match the discount rate to the cash flows’ risk, currency and timing.'),
    p('npv','NPV = 未来现值 − 初始投入','NPV = PV of future flows − Initial outlay','在模型假设成立时，正净现值表示相对于机会成本创造了价值。','A positive NPV indicates value above the opportunity cost under the model’s assumptions.'),
  ],'npv');
add('capm','CAPM 资本资产定价','Capital Asset Pricing Model','William F. Sharpe · 1964','finance',
  "Sharpe（1964）· CAPM 公式关系图","Sharpe (1964) · CAPM formula sketch",
  '用无风险利率与市场风险溢价，结合资产对市场的敏感度 beta，估计模型中的预期收益要求。','Combine the risk-free rate, market risk premium and beta to estimate the model’s expected return requirement.',
  '理解权益资本成本与系统性风险的关系。','Understanding equity cost of capital and systematic risk.',
  'beta 衡量对市场的敏感度，不能替代全部风险。公式是模型关系，不是对实际未来收益的承诺。','Beta measures market sensitivity, not every risk. The equation is a model, not a promise of realized returns.',[
    p('riskfree','无风险利率','Risk-free rate','选择与估值口径相配的无风险基准。','Use a risk-free benchmark consistent with the valuation.'),
    p('beta','β · 市场敏感度','β · Market sensitivity','衡量资产收益相对于市场变动的敏感度。','Measures sensitivity of asset returns to market movements.'),
    p('premium','市场风险溢价','Market risk premium','市场预期收益与无风险利率的差。','Expected market return above the risk-free rate.'),
    p('return','E(Ri) = Rf + βi × [E(Rm) − Rf]','E(Ri) = Rf + βi × [E(Rm) − Rf]','模型只对承担系统性风险给出收益补偿关系。','The model links expected compensation to systematic risk.'),
  ],'capm');
add('altman-z-score','Altman Z-score','Altman Z-score','Edward I. Altman · 1968','finance',
  "Altman（1968）· 原始 Z-score 的五项输入","Altman (1968) · Five inputs to the original Z-score",
  '将流动性、累计盈利、经营盈利、权益对债务和资产周转五项比率加权，形成财务困境分类分数。','Combine five ratios for liquidity, accumulated profit, operating profit, equity relative to debt and asset turnover into a distress classification score.',
  '理解基于报表的信用筛查，并比较不同模型的输入与适用范围。','Understanding accounting-based credit screening and model scope.',
  '这里是 1968 年原始模型的输入结构，基于美国制造业样本。Z 分数不是违约概率，不能把阈值直接套给所有公司。','This shows inputs to the 1968 model based on US manufacturers. A Z-score is not a default probability; thresholds are not universal.',[
    p('liquidity','X1 · 营运资本 / 总资产','X1 · Working capital / Assets','观察短期资源缓冲。','Captures short-term resource capacity.'),
    p('retained','X2 · 留存收益 / 总资产','X2 · Retained earnings / Assets','观察累积盈利。','Captures accumulated profitability.'),
    p('ebit','X3 · EBIT / 总资产','X3 · EBIT / Assets','观察经营盈利。','Captures operating profitability.'),
    p('equity','X4 · 权益市值 / 债务账面值','X4 · Equity value / Book debt','比较权益市场价值与债务。','Compares market equity value with book debt.'),
    p('sales','X5 · 销售收入 / 总资产','X5 · Sales / Assets','观察资产周转。','Captures asset turnover.'),
    p('score','Z · 加权分类分数','Z · Weighted classification score','用原研究估计的权重形成分类分数，应用前需核对模型版本。','Use estimated weights for classification, checking the model version before application.'),
  ],'score');
add('ohlson-model','Ohlson 困境概率模型','Ohlson’s Distress Probability Model','James A. Ohlson · 1980','finance',
  "Ohlson（1980）· Logit 模型结构简图","Ohlson (1980) · Logit model structure sketch",
  '把企业规模、财务比率和状态指标放进 logit 模型，用统计估计把它们连接到财务困境概率。','Use size, financial ratios and status indicators in a logit model to estimate financial distress probability.',
  '理解“分类分数”与“模型概率”的区别，以及信用模型为何需要验证。','Distinguishing classification scores from estimated probabilities and understanding validation.',
  '从财务输入，经估计的线性指数，得到模型概率。实际使用需核对预测对象、时间范围、系数和校准。','Follow financial inputs through an estimated linear index to a model probability. Check the prediction target, horizon, coefficients and calibration in application.',[
    p('inputs','规模 · 财务比率 · 状态','Size · Ratios · Status indicators','使用与模型定义一致的会计和状态变量。','Use accounting and status variables defined consistently with the model.'),
    p('index','估计系数 → 线性指数','Estimated weights → Linear index','用样本估计的系数组合输入，而非主观打分。','Combine inputs using sample-estimated coefficients.'),
    p('probability','Logit 转换 → 概率','Logit transform → Probability','把指数映射为概率；可靠性仍取决于样本、口径与校准。','Map the index to probability; reliability depends on data and calibration.'),
  ],'threeRows');
add('merton-model','Merton 结构性信用模型','Merton’s Structural Credit Model','Robert C. Merton · 1974','finance',
  "Merton（1974）· 到期偿付机制图解","Merton (1974) · Maturity payoff sketch",
  '把股权看作对企业资产的看涨期权。在简化模型中，到期资产价值与债务偿付额的比较决定能否足额偿付。','Treat equity as a call option on firm assets. In the simplified model, asset value at maturity determines whether debt can be repaid in full.',
  '理解市场信息如何进入信用风险判断，并与报表模型对照。','Understanding a market-based view of credit risk alongside accounting models.',
  '分支是模型到期状态，不是假设的发生概率；这里只展示机制，不计算违约距离。','Branches are maturity states, not assigned probabilities. This illustrates the mechanism rather than calculating distance to default.',[
    p('assets','到期资产价值 V','Asset value V|at maturity','在模型中比较企业资产价值与应付债务。','Compare firm asset value with debt due.'),
    p('solvent','V ≥ D|足额偿付','V ≥ D|Debt covered','资产足以覆盖债务，股权保留剩余价值。','Assets cover debt and equity receives the residual.'),
    p('default','V < D|偿付不足','V < D|Shortfall','资产不足以足额偿债，股权在简化模型中归零。','Assets cannot cover debt; equity has no payoff in this simplified model.'),
    p('equity','股权到期收益 = max(V − D, 0)','Equity payoff = max(V − D, 0)','这对应一个执行价格为到期债务额 D 的看涨期权。','This matches a call option with strike equal to debt due, D.'),
  ],'merton');

export function drawAdditional(spec, { box, circle, line, note }) {
  const keys = spec.parts.map(p => p.key);
  const tones = ['blue','teal','plum','amber','blue','teal'];
  switch (spec.layout) {
    case 'cycle': {
      line('M 278 95 H 354'); line('M 472 143 V 257'); line('M 354 315 H 278'); line('M 168 257 V 143');
      [[58,48],[362,48],[362,268],[58,268]].forEach(([x,y],i)=>box(keys[i],x,y,220,94,tones[i]));
      note(320,210,'经历 → 理解 → 再行动','Experience → Understand → Act'); break;
    }
    case 'levels': keys.forEach((k,i)=>{ if(i<3)line(`M 320 ${100+i*90} V ${119+i*90}`); box(k,70+i*22,34+i*90,500-i*44,65,tones[i]); }); break;
    case 'threeRows': keys.forEach((k,i)=>{if(i<2)line(`M 320 ${116+i*120} V ${151+i*120}`);box(k,50,30+i*120,540,86,tones[i]);}); break;
    case 'matrix':
      line('M 78 349 V 57');line('M 78 349 H 607');
      note(175,29,'心理安全 ↑','Psychological safety ↑'); note(363,399,'绩效标准 →','Performance standards →');
      note(42,70,'高','High');note(42,344,'低','Low');note(117,377,'低','Low');note(570,377,'高','High');
      [[103,64],[353,64],[103,218],[353,218]].forEach(([x,y],i)=>box(keys[i],x,y,230,118,tones[i]));break;
    case 'proportions':
      // Exact 70:20:10 widths; labels remain in equally legible detail boxes below.
      box(keys[0],30,40,406,65,'blue','70');box(keys[1],436,40,116,65,'teal','20');box(keys[2],552,40,58,65,'plum','10');
      note(320,157,'挑战经历 · 发展关系 · 正式学习','Experience · Relationships · Formal learning');
      // Only one interactive instance per concept.
      note(320,228,'经验指引，不是学习保留率','A guideline, not a retention-rate formula');
      note(320,293,'让任务、反馈与课程互相支持','Connect work, feedback and structured study');break;
    case 'five': {
      const coords=[[320,60],[535,178],[450,347],[190,347],[105,178]];
      line('M 320 60 L 535 178 L 450 347 L 190 347 L 105 178 Z',false);
      coords.forEach(([x,y],i)=>circle(keys[i],x,y,59,tones[i]));note(320,209,'内在发展','Inner development');break;
    }
    case 'seven': {
      const coords=[[25,24],[229,24],[433,24],[433,157],[229,157],[25,157],[229,290]];
      line('M 207 66 H 227');line('M 411 66 H 431');line('M 524 108 V 155');line('M 433 199 H 413');line('M 229 199 H 209');line('M 116 241 V 332 H 227');
      coords.forEach(([x,y],i)=>box(keys[i],x,y,182,84,tones[i%6]));break;
    }
    case 'columns':keys.forEach((k,i)=>box(k,22+i*206,112,184,150,tones[i]));note(320,335,'同一情境，可以换一个视角','One situation, different perspectives');break;
    case 'triangle':
      line('M 320 97 L 145 224 L 495 224 Z',false);
      box(keys[0],213,28,214,86,'blue');box(keys[1],35,191,218,100,'teal');box(keys[2],387,191,218,100,'plum');box(keys[3],50,332,540,63,'amber');break;
    case 'four':[[40,56],[340,56],[40,246],[340,246]].forEach(([x,y],i)=>box(keys[i],x,y,260,120,tones[i]));break;
    case 'abc':
      line('M 320 112 V 170');line('M 320 250 V 306');
      box(keys[0],135,28,370,84,'blue');box(keys[1],135,171,370,80,'teal');box(keys[2],135,307,370,84,'plum');
      note(478,149,'资源动因','Resource drivers');note(478,287,'作业动因','Activity drivers');break;
    case 'scope':keys.forEach((k,i)=>box(k,22+i*206,190-i*60,184,110+i*60,tones[i]));note(320,367,'成本 → 收入与成本 → 资本投入','Costs → Revenues & costs → Invested capital');break;
    case 'agency':
      line('M 225 123 H 415');line('M 415 230 H 225');note(320,95,'授权与激励','Authority & incentives');note(320,263,'行动与报告','Actions & reporting');
      box(keys[0],24,143,200,82,'blue');box(keys[1],416,143,200,82,'teal');box(keys[2],45,326,550,68,'amber');break;
    case 'risk':
      line('M 320 91 V 108 H 113 V 141');line('M 203 183 H 224');line('M 410 183 H 431');line('M 526 225 V 243 H 320 V 261');
      line('M 490 294 H 622 V 57 H 562',true,false,true);note(360,129,'风险评估','Risk assessment');
      box(keys[0],80,25,480,65,'core');keys.slice(1,4).forEach((k,i)=>box(k,24+i*207,143,179,81,tones[i]));
      box(keys[4],150,263,340,62,'teal');box(keys[5],22,350,596,60,'amber');break;
    case 'capitals':
      keys.slice(0,6).forEach((k,i)=>{let x=22+(i%3)*207,y=28+Math.floor(i/3)*135;box(k,x,y,182,103,tones[i]);});
      line('M 320 269 V 319');box(keys[6],32,323,576,72,'core');break;
    case 'valuechain':
      line('M 206 132 H 227');line('M 413 132 H 434');keys.slice(0,3).forEach((k,i)=>box(k,23+i*207,84,183,96,tones[i]));
      [114,321,528].forEach(x=>line(`M ${x} 183 V 286`,false));box(keys[3],52,289,536,83,'core');break;
    case 'npv':
      line('M 88 180 H 551');note(320,159,'时间 →','Time →');box(keys[0],24,45,235,101,'blue');box(keys[1],381,45,235,101,'teal');
      line('M 500 184 V 245 H 415');box(keys[2],170,215,300,69,'plum');line('M 320 285 V 320');box(keys[3],27,326,586,75,'core');break;
    case 'capm':
      keys.slice(0,3).forEach((k,i)=>box(k,21+i*208,75,182,100,tones[i]));
      note(216,135,'+','+');note(424,135,'×','×');line('M 320 186 V 282');box(keys[3],22,287,596,95,'core');break;
    case 'score':
      keys.slice(0,5).forEach((k,i)=>{line(`M 598 ${39+i*59} H 620`,false);box(k,42,16+i*59,556,47,tones[i]);});
      line('M 620 39 V 369 H 600');box(keys[5],42,337,556,63,'core');break;
    case 'merton':
      line('M 320 117 V 153 H 171 V 184');line('M 320 153 H 473 V 184');box(keys[0],170,28,300,87,'blue');
      box(keys[1],42,187,258,105,'teal');box(keys[2],341,187,258,105,'amber');box(keys[3],30,336,580,68,'core');break;
    default: throw new Error(`Missing diagram layout: ${spec.layout}`);
  }
}
