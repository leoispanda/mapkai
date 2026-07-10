# Batch 010 压缩 PDC 审核记录

审核范围：`0713`、`0714`、`0715`、`0716`、`0721`，共 15 组双语寓言。

## Article Context Card（批次共用）

- 当前标题与简介：以各文章 `title`、`titleZh`、`summary`、`summaryZh` 为准
- 所属大类：工程制造与建造
- 所属领域：电力与能源、电子与自动化、机械与金属工艺、机动车船舶与航空器、食品加工
- 页面位置：对应正式小学科详情页
- 语言版本：中文与英文严格对应版本
- 发布状态：第十批候选
- 核心知识概念：15 个 topic-plan 指定概念
- 关联学科：控制、材料、船舶、能源系统、食品科学、安全工程与计量
- 读者读完后应该理解：系统性能由边界、时标、状态、失效方式、测量与验证共同决定，不能只看一个峰值、额定值、部件数或最终抽检
- 读者暂时不需要理解：完整控制方程、断裂力学推导、船舶稳性法规计算、热加工申报参数或企业 HACCP 计划
- 概念难度：Intermediate 到 Advanced，部分机制达到研究生入门层次
- 故事类型：机制寓言与概念寓言
- 目标读者：好奇的成年人、高阶学生、工程师、管理者与终身学习者
- 读者可能的困惑：把能量等同于功率、把刚度等同于强度、把冗余等同于复制、把含水量等同于水分活度、把最终检验等同于预防控制
- 这批故事为什么值得读：每篇都以一次看似合理却失败的工程判断，揭示单指标思维遗漏的机制
- 读者下一步行动：回到知识地图继续查看同领域其他正式小学科与概念
- MapKAI 匹配要求：故事先行、冲突至少两次、概念迟揭示、解释简短、中英文信息对应
- 公开网站发布要求：6 个故事段落、2 个解释段落、移动端可读、无内部审稿模块
- 修改边界：不增加隐喻对应、类比边界、反思问题、编辑评论或 PDC 内容到公开正文
- 输出要求：每领域 3 篇，中文 650–1250 字、英文 450–950 词
- 不确定信息：虚构人物与地点均为故事装置；涉及真实设备的具体安全限值必须由适用法规、标准与合格专业人员决定

## Round 1｜Initial PDC Review

压缩 council 重点角色：Vera Path、Dr. Lin Evidence、Aesop Maker、Clara Clear、Eleanor Guard、Julian Source、Anti-AI Voice、Mira Edit。

### Blue Whale Round 1

批次的共同优点是冲突清晰、概念未提前泄露，且每篇都有角色采取行动。共同风险是初稿把正确概念压得过短：工程条件、测量边界和失效组合不足，容易让读者把一个漂亮反转误当成完整机制。

| Issue ID | 来源角色 | 问题类型 | 问题描述 | 严重程度 | 修改状态 | 下一步 |
|---|---|---|---|---|---|---|
| B010-01 | Dr. Lin Evidence | 电力系统 | 电网平衡须区分瞬时功率、日总能量、响应时标、备用与输电位置 | Major | Resolved | 加入秒到小时的控制链、网络约束与辅助服务 |
| B010-02 | Dr. Lin Evidence | 能效边界 | 等质量燃料不代表相同服务，效率比较须统一服务、边界、天气与辅助能耗 | Major | Resolved | 加入服务定义、测量不确定性、热泵指标和反弹 |
| B010-03 | Julian Source | 储能机制 | 只写容量会遗漏功率、时长、往返损耗、衰减、状态约束和重复承诺 | Major | Resolved | 补入双轴能力、老化、温度、备用与市场承诺 |
| B010-04 | Dr. Lin Evidence | 控制机制 | 反馈故事须处理延迟、增益、偏差、饱和、噪声、前馈与安全模式 | Major | Resolved | 让烤炉经历振荡、传感器偏差与执行器极限 |
| B010-05 | Dr. Lin Evidence | 测量机制 | 信噪比必须声明带宽、功率定义、接收器噪声、干扰与检测阈值 | Major | Resolved | 加入动态范围、匹配检测、误报漏报与相干时间 |
| B010-06 | Eleanor Guard | 功能安全 | “断电关闭”并非普遍安全，须按运行情境、完整能量路径和共因故障判断 | Critical | Resolved | 改为场景化安全状态、受控降级与验证测试 |
| B010-07 | Dr. Lin Evidence | 材料力学 | 刚度、屈服、强度、延性、韧性与结构变形不可合并成“更强” | Major | Resolved | 加入应力—应变曲线、量测位置、局部集中与散布 |
| B010-08 | Julian Source | 疲劳机制 | 静态载荷记录不能证明无疲劳，须交代起裂、载荷谱、检测阈值与临界裂纹 | Major | Resolved | 加入断口、S-N 边界、损伤容限和检查间隔 |
| B010-09 | Dr. Lin Evidence | 制造公差 | 单件合格不保证装配功能，统计叠加也依赖分布、相关性与量测能力 | Major | Resolved | 加入基准、功能量规、最坏情形、Monte Carlo 与过程能力 |
| B010-10 | Dr. Lin Evidence | 船舶稳性 | 初稳性不能外推到大倾角，须检查完整复原力臂、自由液面和货物移动 | Critical | Resolved | 加入小角度边界、进水角、曲线面积与动态载荷 |
| B010-11 | Julian Source | 阻力外推 | 模型试验不能直接等同比例真船，季节性污损也会吞掉设计收益 | Major | Resolved | 加入相似准则、外推不确定性、污损与服务指标 |
| B010-12 | Eleanor Guard | 安全冗余 | 复制件可能共享路径、潜伏失效或被切换逻辑同时击败 | Critical | Resolved | 加入独立性、定期演练、故障注入与剩余控制能力 |
| B010-13 | Eleanor Guard | 食品热加工 | 峰值温度不足以代表致死量，必须保留冷点、完整曲线、设备分布和偏差处置 | Critical | Resolved | 加入存活曲线、升温、封口、排气、冷却与再验证 |
| B010-14 | Dr. Lin Evidence | 食品水分 | 总含水量不等于水分活度，配方历史、温度、相变与迁移会改变结果 | Critical | Resolved | 加入吸湿等温线、滞后、结晶、包装与分布测量 |
| B010-15 | Eleanor Guard | HACCP | 最终抽检不能替代预防体系，且不能把所有重要步骤都称作 CCP | Critical | Resolved | 加入前提方案、决策判断、关键限值、处置、确认与验证 |

### Rewrite Modify 1

- 15 篇都保留原有角色、核心冲突、六段结构与结尾反转，不把故事重写成教科书。
- 每篇在原场景中补足可观察的第二次摩擦、测量步骤、边界条件或失效组合；英文与中文在相同段落同步修改。
- 所有英文正文扩展到至少 450 词，中文仍在项目长度范围内。
- 没有把任何内部分类、审稿意见或操作性安全数值写入公开正文。

## Round 2｜PDC Re-review of Version 1

### Blue Whale Round 2

Round 1 的 15 项 Major/Critical 均已解决。复核发现 10 个更细的边界问题，主要来自术语精度与过度外推；这些问题不要求增加篇幅，而要求改正表达。

| Issue ID | 来源角色 | 问题类型 | 问题描述 | 严重程度 | 修改状态 | 下一步 |
|---|---|---|---|---|---|---|
| B010-16 | Dr. Lin Evidence | 储能碳影响 | 不能只把充电源称作“脏”，应比较充电增加与放电替代的边际发电并计入损耗 | Major | Resolved | 重写充放电两端的碳因果链 |
| B010-17 | Julian Source | 断口证据 | 贝壳纹可能来自载荷或环境变化，不能确定等同于每次停运 | Major | Resolved | 将确定句改为条件性证据 |
| B010-18 | Dr. Lin Evidence | 动态稳性 | “越抗拒运动越安全”会混淆高初稳性、横摇周期、阻尼和操纵性 | Major | Resolved | 改写为短而猛烈横摇与加速度的真实取舍 |
| B010-19 | Dr. Lin Evidence | 水分活度定义 | 应直接写食品与同温纯水的平衡蒸气压比，ERH 是对应测量关系 | Critical | Resolved | 改正定义并在双语中写明 ERH/100 |
| B010-20 | Eleanor Guard | HACCP 术语 | 计划启用前的 validation 与运行中的 verification 不应混在同一动作清单 | Major | Resolved | 分开确认能力与验证持续执行 |
| B010-21 | Dr. Lin Evidence | 电网变量 | 有功不平衡主要映射到频率，电压与线路潮流须说明为相关但不同的控制 | Major | Resolved | 收紧故事揭示与概念解释 |
| B010-22 | Dr. Lin Evidence | 控制延迟 | 噪声滤波并非免费，滤波器也会增加相位延迟并影响稳定裕度 | Major | Resolved | 把滤波设计纳入稳定性检查 |
| B010-23 | Dr. Lin Evidence | 断裂力学术语 | 裂纹增长处应写“裂纹尖端应力强度”，不能只写模糊的局部强度 | Minor | Resolved | 精确替换双语术语 |
| B010-24 | Dr. Lin Evidence | 速度标度 | 阻力平方、功率立方只在密度、面积与阻力系数近似不变的范围成立 | Major | Resolved | 在公式性叙述前加适用条件 |
| B010-25 | Eleanor Guard | 热加工责任 | 高风险计划过程不能暗示由故事角色单独凭经验建立 | Critical | Resolved | 明确与负责的合格工艺权威共同建立和验证 |

### Rewrite Modify 2

- 重写储能排放、电网变量、船舶动态、速度标度与食品安全责任边界。
- 修正水分活度、贝壳纹、裂纹尖端应力强度、滤波延迟和 HACCP confirmation/verification 的术语精度。
- 再次核对中英文的数字、人物、设备、因果顺序和限定词；没有只改单一语言。
- 保留原始故事的物件与行动，不用新增摘要段掩盖问题。

## Round 3｜Final PDC Review

- Mode fit：PASS；机制型 topic 使用机制寓言，关系型 topic 使用概念寓言
- Story body removal test：PASS；移除故事后会失去核心证据链与反转
- Knowledge / mechanism accuracy：PASS
- Evidence boundary：PASS；真实技术规则与虚构场景已分开
- Scene retention：PASS；15 篇中段均保留人物操作、仪表、材料、货物或食品变化
- Abstract fog：PASS；没有靠抽象名词代替可见动作
- AI template risk：PASS；共享栏目结构未造成相同情节或相同结尾
- Bilingual correspondence：PASS；每篇 6 个对应故事段落与 2 个对应解释段落
- Late reveal：PASS；概念首次出现位于正文约 81%–85%
- Length：PASS；英文 450–473 词，中文 778–885 字
- Mobile paragraphing：PASS
- Engineering / food-safety public risk：PASS；不提供可直接替代专业设计或企业控制计划的数值处方
- Copyright risk：PASS；全部场景、人物与表达为原创
- Open Critical：0
- Open Major：0

最终决定：**Approved for integration**

## 核查依据

- ENTSO-E, [Balancing Report 2020](https://eepublicdownloads.entsoe.eu/clean-documents/Publications/Market%20Committee%20publications/ENTSO-E_Balancing_Report_2020.pdf)，负荷频率控制、FCR/FRR/RR 与平衡容量/能量。
- IEA, [Glossary](https://www.iea.org/glossary)，能源效率、储能功率与能量容量的区分。
- U.S. Department of Energy, [Energy Storage](https://www.energy.gov/oe/energy-storage)，储能性能、可靠性、安全与长时储能。
- NIST, [Signal to Noise Ratio](https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/snr.htm) 与带限信号计量资料。
- FAA, [AC 25.1309-1B](https://www.faa.gov/documentLibrary/media/Advisory_Circular/AC_25.1309-1B.pdf)，故障安全、单一故障、潜伏故障与共因故障。
- FAA, [Fatigue and Damage Tolerance](https://www.faa.gov/aircraft/air_cert/step/disciplines/fatigue_damage_tolerance) 与 AC 25.571-1D，循环载荷、裂纹增长、检测阈值与检查间隔。
- NIST, [Uncertainty and Dimensional Calibrations](https://www.nist.gov/publications/uncertainty-and-dimensional-calibrations)，尺寸计量与不确定性。
- IMO, [Ship Design and Stability](https://www.imo.org/en/ourwork/safety/pages/shipdesignandstability-default.aspx)，GM、GZ、自由液面、风浪与完整稳性。
- ITTC, *Recommended Procedures and Guidelines for Resistance and Propulsion Tests*，模型尺度、Froude/Reynolds 相似与外推。
- FDA, [Low-Acid Canned Food Inspection Guide](https://www.fda.gov/guide-inspections-low-acid-canned-food-22)，冷点、热穿透、产品与设备变量。
- FDA, [Water Activity in Foods](https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-technical-guides/water-activity-aw-foods)，蒸气压比、ERH 与吸湿等温线。
- FDA, [HACCP Principles & Application Guidelines](https://www.fda.gov/food/hazard-analysis-critical-control-point-haccp/haccp-principles-application-guidelines)，危害分析、CCP、监测、纠正行动、验证与记录。
- Codex Alimentarius, *General Principles of Food Hygiene (CXC 1-1969, 2022 revision)*，HACCP 前提方案、validation 与 verification。

## 编辑评论（供迭代，不属于正文）

- 批次最大的成功不是术语数量，而是让每篇都从一次“看似足够的单指标判断”进入第二次失败。
- 后续批次继续保持：工程类故事可以专业，但每段必须仍让读者看见谁测了什么、什么改变了、旧判断为何失效。
