import { additionalNotes, drawAdditional } from './library.js?v=0.1.291';
// Original vector redraws with publication-based attribution and explicit editorial scope.
const bi = (zh, en) => ({ zh, en });
const part = (key, zh, en, zhBody, enBody) => ({ key, label: bi(zh, en), body: bi(zhBody, enBody) });
export const diagramNotes = {
  'strategic-control': {
    basis: bi("MapKAI 综合图解 · 依据 Kerr（1975）与组织架构研究", "MapKAI synthesis · Based on Kerr (1975) and organizational architecture research"),
    reading: bi('从上方顺时针读：重要事项被衡量，指标影响行动，奖励又强化优先事项。四者始终围绕战略目标。', 'Read clockwise: priorities are measured, measures influence action, and rewards reinforce priorities. Strategic goals anchor the cycle.'),
    parts: [
      part('goals','战略|目标','Strategic|goals','中心是组织要达到的战略目标。外围四项安排都应支持它。','The strategic goals anchor all four surrounding arrangements.'),
      part('priorities','重要|事项','What|matters','明确哪些事情真正重要，并检查日常优先级是否与战略一致。','Identify what matters and compare daily priorities with strategy.'),
      part('measures','衡量|指标','What gets|measured','用指标观察重要事项，同时检查未被衡量的工作是否被忽视。','Observe priorities through measures and check what those measures leave out.'),
      part('actions','实际|行动','What gets|done','指标要影响资源投入和实际行为；看数字改善是否来自正确行动。','Connect measures to resources and behavior; examine how results were achieved.'),
      part('rewards','奖励|激励','What gets|rewarded','奖励传递真实优先级。检查奖金、晋升与认可是否鼓励了所需行为。','Rewards communicate real priorities. Check what bonuses, promotion and recognition encourage.'),
    ],
  },
  'three-legged-stool': {
    basis: bi("Brickley、Smith 与 Zimmerman（1995）· 三要素图解", "Brickley, Smith & Zimmerman (1995) · Three-element sketch"),
    reading: bi('三条腿共同支撑管理控制。只改考核或奖金而不检查决策权，容易让系统失衡。', 'The three legs support one system. Changing measures or rewards requires checking the authority people actually have.'),
    parts: [
      part('fit','一致的|管理控制','Aligned|control','决策权、衡量与激励需要相互匹配。图中的三条腿没有固定权重。','Authority, evaluation and incentives need to fit together. The legs have no fixed numerical weights.'),
      part('rights','决策权','Decision|rights','谁有权作出哪些决定？责任应考虑其能够控制的资源与结果。','Who can decide what? Accountability should reflect controllable resources and outcomes.'),
      part('measurement','绩效衡量','Performance|measurement','用什么证据评价表现？衡量应与承担的责任对应，并可解释、可核实。','What evidence evaluates performance? Measures should match responsibility and be verifiable.'),
      part('rewards','激励奖励','Rewards','哪些表现获得回报？激励要与目标及评价标准一致。','What performance is rewarded? Incentives should agree with objectives and evaluation.'),
    ],
  },
  'balanced-scorecard': {
    basis: bi("Kaplan 与 Norton（1992）· 四视角简图", "Kaplan & Norton (1992) · Four-perspective sketch"),
    reading: bi('从战略向四个视角展开目标与指标。连线表示围绕同一战略协调，不代表已经验证了因果关系。', 'Translate strategy into objectives and measures across four perspectives. Connections show alignment, not a proven causal relationship.'),
    parts: [
      part('strategy','愿景与|战略','Vision &|strategy','四个视角共同解释战略，而不是四份互不相干的 KPI 清单。','The perspectives explain one strategy rather than four unrelated KPI lists.'),
      part('financial','财务','Financial','战略希望取得哪些财务结果？例如现金流、回报和盈利质量。','What financial outcomes should the strategy deliver, such as cash flow and return?'),
      part('customer','客户','Customer','客户从我们的产品与服务中获得什么？可以观察满意度、留存与交付体验。','What do customers receive? Examine satisfaction, retention and delivery experience.'),
      part('process','内部流程','Internal|processes','哪些流程必须做得好，才能支持客户价值与财务表现？','Which processes must work well to support customer value and financial outcomes?'),
      part('learning','创新与|学习','Innovation|& learning','持续改进能力、知识与创新，支持未来表现。','Develop capabilities, knowledge and innovation to support future performance.'),
    ],
  },
  'coso-erm': {
    basis: bi("COSO（2017）· 五组件关系简图", "COSO (2017) · Simplified component relationships"),
    reading: bi('治理与文化、信息沟通贯穿全过程。战略与目标、绩效、复核修正相互连接；这是关系简图，五组件并非五个顺序步骤。', 'Governance and information run throughout. Strategy, performance and review connect with each other; the five components are not five sequential steps.'),
    parts: [
      part('governance','治理与文化','Governance & culture','明确监督、责任、价值观与行为期望，为整个系统提供基础。','Oversight, responsibilities and expected behavior provide the foundation.'),
      part('strategy','战略与|目标设定','Strategy &|objectives','比较战略选择，明确风险偏好，并制定相配合的业务目标。','Compare strategies, define risk appetite and set compatible objectives.'),
      part('performance','风险与|绩效','Risk &|performance','识别、评估、排序并应对风险，形成企业整体的组合视角。','Identify, assess, prioritize and respond to risks using a portfolio view.'),
      part('review','复核与|修正','Review &|revision','在重大变化与实际表现出现后，重新检查风险判断和管理安排。','Reconsider risk judgments and arrangements as conditions and performance change.'),
      part('information','信息、沟通与报告','Information, communication & reporting','让可靠信息在各层级流动，支持风险、文化与绩效方面的决策。','Reliable information flows across levels to inform decisions about risk, culture and performance.'),
    ],
  },
  'coso-internal-control': {
    basis: bi("COSO（2013）· 三维结构简图", "COSO (2013) · Simplified three-dimensional structure"),
    reading: bi('顶面是三类目标，正面是五项组件，侧面是组织层级。选择任一目标与层级，都要考虑五项组件。', 'Read three dimensions: objectives on top, components on the front, organizational levels on the side. Consider all five components for each objective and level.'),
    parts: [
      part('objectives','运营 · 报告 · 合规','Operations · Reporting · Compliance','内部控制支持运营、报告和合规三类目标，提供合理保证。','Controls support operational, reporting and compliance objectives with reasonable assurance.'),
      part('environment','控制环境','Control environment','组织的诚信、监督、责任与能力，为其他控制提供基础。','Integrity, oversight, responsibility and capability underpin other controls.'),
      part('risk','风险评估','Risk assessment','识别和评估可能妨碍目标实现的风险。','Identify and assess risks to objectives.'),
      part('activities','控制活动','Control activities','通过审批、核对、职责分离等安排，执行应对风险的措施。','Approvals, checks and segregation of duties put risk responses into practice.'),
      part('information','信息与沟通','Information & communication','获取并交流履行控制责任所需的信息。','Obtain and share information needed for control responsibilities.'),
      part('monitoring','监控活动','Monitoring activities','持续或定期检查控制是否存在并有效运行，反馈缺陷。','Check whether controls are present and working, and report deficiencies.'),
      part('organization','组织层级','Organizational levels','从整个企业到分部、运营单位与职能，控制应在各层级落实。','Apply controls across the entity, divisions, operating units and functions.'),
    ],
  },
  'three-lines': {
    basis: bi("IIA（2026）· 角色关系简图", "IIA (2026) · Simplified role relationships"),
    reading: bi('向上汇报、向下授权，横向协作。一线和二线属于管理职责；内部审计保持独立，并向治理机构提供保证。', 'Authority and reporting connect the roles vertically; collaboration connects them horizontally. Internal audit maintains independence from management.'),
    parts: [
      part('board','治理机构 / 董事会','Governing body / board','负责监督，并获取关于风险与控制的可靠信息。','Oversees the organization and obtains reliable risk and control information.'),
      part('management','管理层','Management','组织业务与风险管理，明确责任和资源。','Organizes operations and risk management, assigning responsibilities and resources.'),
      part('first','一线|业务','First line|Operations','在经营中承担并管理风险，设计与运行相关控制。','Owns and manages risks in operations and runs controls.'),
      part('second','二线|风险与合规','Second line|Risk & compliance','提供专业支持、监测和质询，帮助管理风险。','Provides expertise, support, monitoring and challenge.'),
      part('third','三线|内部审计','Third line|Internal audit','提供独立保证与建议，不接管管理层的风险责任。','Provides independent assurance and advice without taking management responsibility.'),
    ],
  },
  'levers-of-control': {
    basis: bi("Simons（1995）· 四杠杆结构简图", "Simons (1995) · Four-lever structure sketch"),
    reading: bi('以战略为中心，四种控制同时发挥作用。环形连接表示相互配合，没有先后执行顺序。', 'Four controls work together around strategy. The ring indicates coordination rather than a sequence of steps.'),
    parts: [
      part('strategy','战略','Strategy','四种控制共同服务于战略实施与战略学习。','All four controls support strategy implementation and learning.'),
      part('belief','信念|系统','Belief|systems','说明组织的核心价值与方向，鼓励成员发现机会。','Communicate core values and direction, encouraging people to seek opportunities.'),
      part('boundary','边界|系统','Boundary|systems','明确不可越过的行为与战略边界，说明应避免的风险。','Set behavioral and strategic limits, identifying risks to avoid.'),
      part('interactive','互动|控制','Interactive|controls','管理者持续参与重大不确定性的讨论，促进学习与新战略形成。','Management engages with strategic uncertainties to encourage learning and emerging strategy.'),
      part('diagnostic','诊断|控制','Diagnostic|controls','用目标、指标和偏差追踪既定战略的执行。','Track intended strategy through targets, measures and deviations.'),
    ],
  },
  'double-materiality': {
    basis: bi("EFRAG IG 1（2024）· 双向关系图", "EFRAG IG 1 (2024) · Two-direction sketch"),
    reading: bi('从两个方向分别判断。只要影响重要性或财务重要性任一成立，该议题就可能是重大议题。', 'Assess each direction separately. A matter can be material through impact, financial effects, or both.'),
    parts: [
      part('company','企业','Company','企业的经营与价值链活动，是观察两个方向的起点。','The company and its value chain provide the context for both directions.'),
      part('world','人和|环境','People &|environment','关注受到企业影响的人和环境，也关注可持续议题带来的变化。','Consider affected people and the environment, alongside sustainability-related changes.'),
      part('impact','影响重要性','Impact materiality','向外看：企业对人和环境的实际或潜在影响是否重大？','Look outward: are the company’s actual or potential impacts material?'),
      part('financial','财务重要性','Financial materiality','向内看：可持续议题带来的风险和机会是否影响企业财务前景？','Look inward: do sustainability risks or opportunities materially affect financial prospects?'),
    ],
  },
  'strategic-project-ranking': {
    basis: bi("MapKAI 综合图解 · 依据多目标决策研究与项目排序案例", "MapKAI synthesis · Based on multiple-objective decision research and a ranking case"),
    reading: bi('先明确项目要实现的目标，再比较回报、风险与证据。排序应说明取舍，并通过结果复盘修正判断。', 'Clarify objectives before comparing returns, risks and evidence. Explain trade-offs and use outcomes to improve future judgments.'),
    parts: [
      part('proposals','投资提案','Investment proposals','先明确提案要解决的问题及其战略贡献。','Clarify the problem each proposal solves and its strategic contribution.'),
      part('returns','收益','Returns','检查预期收益的假设、时间范围与证据。','Examine assumptions, timing and evidence behind expected returns.'),
      part('risk','风险','Risk','检查结果的不确定性、资源约束和情景变化。','Examine uncertainty, resource constraints and changing scenarios.'),
      part('credibility','可信度','Credibility','质询估计和数据的可靠性，以及提案人的信息优势与激励。','Challenge estimates, evidence and the proposer’s information and incentives.'),
      part('judgment','综合判断与排序','Judgment & ranking','将定量初筛与战略讨论结合，说明关键取舍与例外。','Combine quantitative screening with strategic discussion and explain trade-offs.'),
      part('review','实施后复盘','Review after implementation','比较假设与结果，让未来的投资判断从经验中学习。','Compare assumptions with outcomes to improve future decisions.'),
    ],
  },
  'real-options': {
    basis: bi("MapKAI 机制图解 · 实物期权决策树", "MapKAI explanatory sketch · Real-options decision tree"),
    reading: bi('先决定现在投入还是等待，再依据新信息选择扩大、继续等待或退出。图中的分支不带假设概率或收益。', 'Choose whether to invest or wait, then use new information to expand, wait further or exit. Branches have no assumed probabilities or payoffs.'),
    parts: [
      part('choice','现在的|选择','Decision|today','把立即投入和保留选择权放在一起比较。','Compare immediate investment with retaining flexibility.'),
      part('invest','立即投入','Invest now','立即行动可能获得收益，也会占用资本并减少后续选择。','Acting now may create value but commits capital and can reduce flexibility.'),
      part('learn','等待 / 小规模试点','Wait / pilot','等待或小规模试点可以获得信息，但也存在时间与试点成本。','Waiting or a pilot can reveal information, with costs and delay.'),
      part('expand','扩大投入','Expand','当新增证据支持关键假设时，行使扩大投入的选择。','Expand when new evidence supports the key assumptions.'),
      part('wait','继续等待','Wait further','当信息仍不充分且选择权仍可保留时，考虑继续等待。','Consider waiting when uncertainty remains and flexibility is still available.'),
      part('exit','停止 / 退出','Stop / exit','当继续投入的依据消失时，保留停止或退出的可能。','Retain the ability to stop when the case for further investment weakens.'),
    ],
  },
  'purpose-driven-organization': {
    basis: bi("MapKAI 机制图解 · 依据 Quinn 与 Thakor（2018）", "MapKAI synthesis · Based on Quinn & Thakor (2018)"),
    reading: bi('沿箭头观察共同使命如何连接工作意义、投入与价值创造。下方反馈表示日常决定与领导行为会影响使命的可信度。', 'Follow the connections from shared purpose to meaning, engagement and value. The feedback shows how daily decisions affect the credibility of that purpose.'),
    parts: [
      part('purpose','共同使命','Shared|purpose','说明组织为谁创造什么价值，让成员理解工作的意义。','Explain whom the organization serves and the value it creates.'),
      part('meaning','工作意义','Meaning','把日常工作与对他人的价值联系起来。','Connect everyday work with value for others.'),
      part('engagement','投入与协作','Engagement','共同意义可以支持主动投入、协作和学习。','Shared meaning can support effort, collaboration and learning.'),
      part('value','创造价值','Value|creation','检验组织是否在真实行动中实现了所声称的价值。','Examine whether actual actions deliver the stated value.'),
      part('actions','领导行为与经营决定','Leadership & business decisions','资源分配、晋升和风险取舍应体现使命，行动反馈决定其可信度。','Allocation, promotion and risk choices should reflect purpose and determine its credibility.'),
    ],
  },
};

const NS = 'http://www.w3.org/2000/svg';
Object.assign(diagramNotes, additionalNotes);
const element = (name, attrs = {}, content) => {
  const el = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  if (content !== undefined) el.textContent = content;
  return el;
};

export function drawDiagram(id, language, { interactive = false, onSelect, instance = 'card' } = {}) {
  const spec = diagramNotes[id];
  const zh = language === 'zh';
  const uid = `${instance}-${id}`;
  const svg = element('svg', { viewBox: '0 0 640 420', class: 'framework-diagram', role: interactive ? 'group' : 'img', 'aria-labelledby': `${uid}-title ${uid}-desc` });
  svg.append(element('title', { id: `${uid}-title` }, zh ? '框架结构图' : 'Framework diagram'), element('desc', { id: `${uid}-desc` }, spec.reading[language]));
  const defs = element('defs');
  const marker = element('marker', { id: `${uid}-arrow`, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
  marker.append(element('path', { d: 'M 1 1 L 9 5 L 1 9 Z', class: 'diagram-arrowhead' })); defs.append(marker); svg.append(defs);
  const line = (d, arrow = true, both = false, dashed = false) => {
    const attrs = { d, class: `diagram-line${dashed ? ' dashed' : ''}`, fill: 'none' };
    if (arrow) attrs['marker-end'] = `url(#${uid}-arrow)`;
    if (both) attrs['marker-start'] = `url(#${uid}-arrow)`;
    const el = element('path', attrs); svg.append(el); return el;
  };
  const text = (parent, x, y, labels, small = false) => {
    const rows = (Array.isArray(labels) ? labels : labels.split('|'));
    const t = element('text', { x, y, class: small ? 'diagram-small' : 'diagram-label', 'text-anchor': 'middle' });
    rows.forEach((s, i) => t.append(element('tspan', { x, dy: i === 0 ? -((rows.length - 1) * 12) : 24 }, s)));
    parent.append(t); return t;
  };
  const note = (x, y, z, e) => text(svg, x, y, zh ? z : e, true);
  const group = (key, tone) => {
    const p = spec.parts.find(p => p.key === key);
    const g = element('g', { class: `diagram-node tone-${tone}`, 'data-part': key });
    if (interactive) {
      g.setAttribute('role', 'button'); g.setAttribute('tabindex', '0'); g.setAttribute('aria-pressed', 'false');
      g.setAttribute('aria-label', p.label[language].replaceAll('|', ' '));
      const select = () => {
        svg.querySelectorAll('[data-part]').forEach(el => { el.classList.toggle('is-selected', el === g); el.setAttribute('aria-pressed', String(el === g)); });
        onSelect?.(p);
      };
      g.addEventListener('click', select);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); } });
    }
    g.append(element('title', {}, p.body[language])); svg.append(g); return { g, p };
  };
  const box = (key, x, y, w, h, tone = 'blue', label) => {
    const { g, p } = group(key, tone);
    g.append(element('rect', { x, y, width: w, height: h, rx: 12, class: 'diagram-shape' }));
    text(g, x + w / 2, y + h / 2 + 6, label || p.label[language]); return g;
  };
  const circle = (key, x, y, radius, tone = 'blue') => {
    const { g, p } = group(key, tone);
    g.append(element('circle', { cx: x, cy: y, r: radius, class: 'diagram-shape' }));
    text(g, x, y + 6, p.label[language]); return g;
  };
  const radial = (keys, center, arrows = false) => {
    if (arrows) {
      line('M 384 62 Q 518 62 524 148'); line('M 524 272 Q 518 358 384 358');
      line('M 256 358 Q 122 358 116 272'); line('M 116 148 Q 122 62 256 62');
    } else {
      svg.append(element('ellipse', { cx: 320, cy: 210, rx: 204, ry: 150, class: 'diagram-ring' }));
    }
    [[320,60],[524,210],[320,360],[116,210]].forEach(([x,y],i) => circle(keys[i],x,y,55,['blue','teal','plum','amber'][i]));
    circle(center,320,210,72,'core');
  };

  switch (id) {
    case 'strategic-control': radial(['priorities','measures','actions','rewards'],'goals',true); break;
    case 'levers-of-control': radial(['belief','boundary','interactive','diagnostic'],'strategy'); break;
    case 'balanced-scorecard':
      line('M 320 110 L 320 146',false); line('M 398 210 L 430 210',false); line('M 320 274 L 320 310',false); line('M 210 210 L 242 210',false);
      box('financial',224,28,192,80,'blue'); box('customer',434,166,184,88,'teal'); box('learning',215,312,210,86,'plum'); box('process',22,166,184,88,'amber'); circle('strategy',320,210,72,'core'); break;
    case 'three-legged-stool':
      line('M 225 151 L 154 293',false); line('M 320 171 L 320 305',false); line('M 415 151 L 486 293',false);
      svg.querySelectorAll('.diagram-line').forEach(el => el.classList.add('stool-leg'));
      box('fit',166,65,308,106,'core');
      box('rights',24,296,182,92,'blue'); box('measurement',229,306,182,92,'teal'); box('rewards',434,296,182,92,'plum');
      break;
    case 'coso-erm':
      line('M 320 97 L 320 155',false); line('M 211 214 L 233 214',true,true); line('M 407 214 L 429 214',true,true);
      line('M 125 97 L 125 155',false); line('M 515 97 L 515 155',false);
      line('M 125 266 L 125 320',true,true); line('M 320 266 L 320 320',true,true); line('M 515 266 L 515 320',true,true);
      box('governance',38,25,564,70,'amber'); box('strategy',38,157,171,108,'blue'); box('performance',235,157,170,108,'teal'); box('review',431,157,171,108,'plum');
      box('information',38,324,564,70,'blue'); break;
    case 'coso-internal-control': {
      const top = group('objectives','blue');
      top.g.append(element('path',{d:'M 76 120 L 196 30 L 568 30 L 448 120 Z',class:'diagram-shape'}));
      [200,324].forEach(x=>top.g.append(element('path',{d:`M ${x} 120 L ${x+120} 30`,class:'diagram-cube-grid'})));
      ['运营','报告','合规'].forEach((label,i)=>text(top.g,198+i*124,79,zh?label:['Operations','Reporting','Compliance'][i],!zh));
      const side=group('organization','teal');
      side.g.append(element('path',{d:'M 448 120 L 568 30 L 568 290 L 448 380 Z',class:'diagram-shape'}));
      [1,2,3].forEach(i=>side.g.append(element('path',{d:`M ${448+i*30} ${120-i*22.5} L ${448+i*30} ${380-i*22.5}`,class:'diagram-cube-grid'})));
      (zh?['企业','分部','运营单位','职能']:['Entity','Division','Operating unit','Function']).forEach((label,i)=>{
        const t=text(side.g,466+i*30,244-i*22.5,label,true);t.setAttribute('transform',`rotate(-90 ${466+i*30} ${244-i*22.5})`);
      });
      ['environment','risk','activities','information','monitoring'].forEach((key,i)=>{
        const g=box(key,76,120+i*52,372,52,['blue','teal','amber','plum','blue'][i]);
        g.querySelector('rect').setAttribute('rx','0');
      });
      note(274,408,'三类目标 × 五项组件 × 组织层级','Objectives × Components × Organization'); break;
    }
    case 'three-lines':
      line('M 218 90 L 218 129',true,true); line('M 521 91 L 521 211',true,true);
      line('M 131 187 L 131 224',true,true); line('M 311 187 L 311 224',true,true);
      line('M 207 277 L 228 277',true,true); line('M 393 277 L 425 277',true,true,true);
      box('board',40,24,560,66,'core'); box('management',44,134,350,52,'blue');
      box('first',44,227,160,100,'blue'); box('second',232,227,162,100,'teal'); box('third',430,214,176,126,'plum');
      note(216,350,'一线与二线：管理职责','First & second: management roles');
      note(320,396,'各线协作，内部审计保持独立','Coordinate while preserving audit independence'); break;
    case 'double-materiality':
      line('M 179 172 L 455 172'); line('M 457 258 L 180 258');
      box('company',20,172,151,111,'core'); box('world',465,172,153,111,'teal');
      box('impact',201,49,238,73,'blue'); box('financial',201,300,238,73,'plum');
      note(320,154,'企业对外部的影响','Company → outside impacts');
      note(320,239,'议题对企业的财务影响','Sustainability → financial effects');
      note(320,407,'任一方向重要，或两者都重要','Material in either direction, or both'); break;
    case 'strategic-project-ranking':
      line('M 320 79 L 320 102 L 119 102 L 119 128'); line('M 320 79 L 320 128'); line('M 320 102 L 521 102 L 521 128');
      line('M 119 205 L 119 231 L 320 231 L 320 250'); line('M 320 205 L 320 250'); line('M 521 205 L 521 231 L 320 231',false);
      line('M 320 315 L 320 340');
      box('proposals',172,15,296,65,'core'); box('returns',40,130,158,74,'blue'); box('risk',241,130,158,74,'amber'); box('credibility',442,130,158,74,'plum');
      box('judgment',133,252,374,64,'teal'); box('review',181,344,278,58,'blue'); break;
    case 'real-options':
      line('M 125 169 L 125 78 L 255 78'); line('M 194 216 L 255 216');
      line('M 438 216 L 470 216 L 470 146 L 495 146'); line('M 438 216 L 495 245'); line('M 470 216 L 470 349 L 495 349');
      circle('choice',124,217,68,'core'); box('invest',259,43,192,72,'blue'); box('learn',259,174,183,90,'teal');
      box('expand',499,112,130,72,'blue'); box('wait',499,209,130,72,'amber'); box('exit',499,312,130,72,'plum');
      note(335,310,'新信息 → 新决策','New information → new decision'); break;
    case 'purpose-driven-organization':
      line('M 156 154 L 177 154'); line('M 303 154 L 325 154'); line('M 451 154 L 473 154');
      line('M 139 329 L 89 329 L 89 199'); line('M 548 198 L 548 321 L 501 321');
      box('purpose',24,111,132,86,'core'); box('meaning',179,111,123,86,'blue'); box('engagement',328,111,123,86,'teal'); box('value',476,111,140,86,'plum');
      box('actions',140,292,360,74,'amber'); note(320,253,'行动使使命可信','Actions make purpose credible');
      note(320,48,'共同意义如何进入工作','How shared meaning enters work'); break;
    default: drawAdditional(spec, { box, circle, line, note });
  }
  return svg;
}
