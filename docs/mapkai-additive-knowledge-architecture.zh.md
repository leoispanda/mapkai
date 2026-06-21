# MapKAI 增补型知识架构建议

目的: 保持现有 internal base 不动，同时明确公开产品层、内部兼容层和未来可以增加的内容方向。

## 一句话原则

现有 11 大类、57 个 submodules 和 148 个 detailed fields 是 MapKAI 的内部兼容主干。公开产品层优先使用 `11 大类 -> 29 narrow fields -> 80 practical detailed fields`。新的概念、故事、题目、学习路径、项目包，只作为增补层进入，不替换、不重排、不删除现有 code。

## 保持不动的 Base

保持现有内部兼容结构:

```text
11 个大类
  -> 57 个 submodules
    -> 148 个 detailed fields
```

其中 `not further defined`、`not elsewhere classified`、`Inter-disciplinary programmes`、`Field unknown` 等节点属于行政占位或统计兼容节点，不应默认作为普通用户的知识分类展示。

公开产品层建议使用:

```text
11 个 knowledge areas
  -> 29 个 public narrow fields
    -> 80 个 practical detailed fields
      -> concepts / stories / questions / learning paths
```

也就是说:

```text
11 -> 57 -> 148 = Founder / internal compatibility layer
11 -> 29 -> 80 = public learning layer
```

不建议现在新增 `自然世界 / 人类社会 / 人造系统` 作为正式 Level 0。它们可以暂时作为思考素材或未来导航实验，但不进入 base。

## 可增加的四层内容

### A. Detailed Fields

适合加入: 大学专业、稳定学科、职业教育方向。

判断标准:

- 能放进某个现有 submodule。
- 名称稳定，不只是一个热门话题。
- 能继续长出很多概念、人物、案例、方法。

例子:

- 概率论
- 数据分析
- 认知科学
- 公共政策
- 服务设计
- 网络安全

### B. Concept Nodes

适合加入: 概念、理论、方法、模型、工具、常见误解。

判断标准:

- 不值得升成一个 submodule。
- 适合写成概念寓言、机制解释或案例故事。
- 可以被多个 detailed fields 共享。

例子:

- 贝叶斯思维
- 认知负荷
- 路径依赖
- 服务恢复
- 网络效应
- 成长型思维

### C. Story / Project Packs

适合加入: 跨学科主题包、学习路径、项目合集。

判断标准:

- 它不是分类本身，而是把多个分类串起来。
- 可以帮助用户探索一个现实问题。

例子:

- AI 如何改变工作
- 一座城市如何运行
- 一家餐厅背后的知识系统
- 一次公共卫生事件里的知识链

### D. Related Paths

适合加入: 交叉链接，不改变主路径。

判断标准:

- 一个节点主路径只能有一个。
- 但可以通过 `related_paths` 关联其他领域。

例子:

```text
心理学
primary_path: 03 社会科学、新闻与信息 > 031 Social and behavioural sciences
related_paths:
  - 09 健康与福利
  - 05 自然科学、数学与统计 > 051 Biological and related sciences
```

## 父子关系审计规则

外部 prompt 中的 parent-child audit 要求值得吸收，但它在 MapKAI 中应定位为内部治理规则，而不是公开 taxonomy redesign。

### 固定原则

- 不重命名、不重排、不删除现有 11 大类。
- 不重命名、不重排、不删除现有 57 个 submodules。
- 每个 submodule 必须有且只有一个 `primary_parent_code`。
- 跨领域关系只进入 `related_paths`，不能制造多个父级。
- Project packs 不是 taxonomy submodules。
- Detailed fields 不应升格为新 submodule，除非它已经存在于当前 base。
- ISCED-F 2013 只作为 reference logic，不替换 MapKAI 现有 base。

### 审计对象

内部审计对象:

```text
11 categories
  -> 57 submodules
    -> 148 detailed fields
```

公开展示对象:

```text
11 categories
  -> 29 public narrow fields
    -> 80 practical detailed fields
```

因此，审计 57 个 submodules 的目的不是让它们全部公开展示，而是确认它们在内部结构中的父子关系、可见性和维护状态。

### 推荐审计字段

```text
category_code
category_name_en
category_name_zh
submodule_code
submodule_name_en
submodule_name_zh
primary_parent_code
primary_parent_name
relationship_status
issue_type
relationship_reason
possible_related_paths
recommended_action
visibility_layer
source_file_path
notes
```

`relationship_status` 可以是:

```text
clear
ambiguous
missing_parent
needs_review
```

`issue_type` 可以是:

```text
none
cross-disciplinary
too_broad
too_detailed
duplicate_or_overlapping
project_pack_not_submodule
unclear_name
administrative_placeholder
```

`visibility_layer` 可以是:

```text
public_navigation
founder_only
internal_compatibility
project_pack
needs_review
```

### 行政占位项处理

行政占位项不应改名或删除，因为它们保留了官方统计兼容性；但它们应默认隐藏在普通用户导航之外。

处理建议:

- `not further defined`: 标记为 `administrative_placeholder`，用于资料不足或只知道大方向的情况。
- `not elsewhere classified`: 标记为 `administrative_placeholder`，用于官方分类没有合适位置的特殊内容。
- `Inter-disciplinary programmes`: 不作为普通 submodule 展示，优先转为 `project_pack` 或 `related_paths`。
- `Field unknown`: 标记为 `needs_review` 或 `internal_compatibility`，只用于导入、纠错和缺失数据处理。

如确实需要在 Founder 或调试层显示，可以使用用户可懂的辅助标签，但不得替换原始 code 和官方名称:

```text
not further defined -> Overview / General Entry
not elsewhere classified -> Other Topics / Special Topics
Inter-disciplinary programmes -> Cross-field Path / Integrated Studies
Field unknown -> Needs Review
```

### Public General Entry 规则

`not further defined` 不应直接作为公开名称展示，但可以为每个大类派生一个公开的 `General Entry`。它不是 undefined，也不是其他分类的垃圾桶，而是这个大类的总论入口，用来承接基础概念、总览故事、入门问题和未来内容生产的起点。

这样做的目的:

- 防止只按 29/80 生产内容时漏掉总论型知识。
- 给每个大类保留一个清楚的入门页。
- 让 broad-category stories、概念总览、学习准备内容有稳定位置。
- 避免把 `not further defined` 暴露给普通用户。

规则:

- Public 名称使用 `General Entry`、`Overview` 或中文 `总览入口`，不使用 `not further defined`。
- 每个 General Entry 必须有明确限定门类，不能无限收纳所有内容。
- General Entry 不替代 29 narrow fields 和 80 practical detailed fields。
- 如果内容能放入具体 detailed field，优先放入具体 detailed field。
- General Entry 适合放基础框架、总览故事、跨本大类的共同问题、学习前置概念。
- General Entry 不适合放新兴热门主题、跨领域项目包、已经有明确 field 的专业内容。

推荐字段:

```text
node_type: general_entry
visibility_layer: public_navigation
source_admin_code: original not further defined code if available
primary_parent_code: category code
allowed_scope_tags: limited generation lanes
fallback_rule: use only when no more specific public narrow/detailed field fits
```

## 11 个 General Entry 的限定门类

### 00 General Studies / 通用学习总览

限定门类:

- 学习如何学习: 元认知、学习策略、自我调节。
- 基础能力: 读写、数量感、表达、提问。
- 学习准备: 学习信心、环境、工具、时间安排。
- 知识导航: 知识地图、迁移、资格与能力信号。

不要放:

- 已经属于具体学科的专业内容。
- 完整教育学理论，应放 `01 Education`。

### 01 Education / 教育总览

限定门类:

- 学习发生机制: 动机、反馈、支架、最近发展区。
- 教学与课程: 课程目标、课堂设计、教学方法。
- 评价与证据: 形成性评价、学习证据、测评公平。
- 教育系统: 学校、教师、学习环境、教育机会。

不要放:

- 普通个人学习技巧，应回到 `00 General Studies`。
- 心理治疗或临床心理，应关联 `09 Health & Medicine`。

### 02 Arts & Humanities / 艺术与人文总览

限定门类:

- 意义与解释: 诠释、文本、图像、符号。
- 创作与媒介: 艺术形式、设计表达、表演与声音。
- 历史与文化记忆: 传统、遗产、时代语境。
- 语言与伦理: 语言理解、价值判断、审美经验。

不要放:

- 市场营销设计，应关联 `04 Business & Law`。
- 纯软件产品设计，应关联 `06 Computing & Technology`。

### 03 Social Sciences / 社会科学总览

限定门类:

- 人与行为: 选择、群体、身份、社会互动。
- 制度与社会结构: 家庭、组织、国家、公共领域。
- 公共事实: 调查、统计、新闻、档案、信息传播。
- 社会变化: 不平等、政策、文化变迁、集体行动。

不要放:

- 单纯商业运营，应放 `04 Business & Law`。
- 临床健康干预，应放 `09 Health & Medicine`。

### 04 Business & Law / 商业与法律总览

限定门类:

- 组织与管理: 分工、决策、流程、激励。
- 钱与记录: 会计、金融、税务、风险。
- 市场与客户: 营销、销售、交易、信任。
- 规则与责任: 法律、合规、合同、权利义务。

不要放:

- 一般社会制度分析，应关联 `03 Social Sciences`。
- 纯技术系统实现，应关联 `06 Computing & Technology`。

### 05 Natural Sciences / 自然科学总览

限定门类:

- 观察与实验: 证据、测量、变量、可重复性。
- 生命系统: 生物、生态、演化、细胞与化学基础。
- 物质与能量: 化学、物理、地球系统。
- 数学与模型: 数量、概率、统计、模型解释。

不要放:

- 工程建造应用，应关联 `07 Engineering & Construction`。
- 医疗照护实践，应关联 `09 Health & Medicine`。

### 06 Computing & Technology / 计算与技术总览

限定门类:

- 信息与数据: 表示、存储、检索、数据质量。
- 程序与软件: 算法、开发、调试、系统设计。
- 网络与安全: 通信、权限、隐私、安全风险。
- 人机使用: 数字工具、交互、自动化、AI 作为工具。

不要放:

- 数学统计原理本身，应关联 `05 Natural Sciences`。
- 商业产品策略，应关联 `04 Business & Law`。

### 07 Engineering & Construction / 工程与建造总览

限定门类:

- 设计-建造-测试: 需求、方案、原型、验证。
- 材料与能量: 强度、传热、用能、约束。
- 机器与系统: 机械、电气、控制、自动化。
- 制造与基础设施: 工厂、建筑、城市、交通设施。

不要放:

- 纯自然规律解释，应关联 `05 Natural Sciences`。
- 纯服务运营流程，应关联 `10 Services & Transport`。

### 08 Agriculture & Ecology / 农业与生态总览

限定门类:

- 食物生产: 作物、畜牧、园艺、渔业。
- 土壤水与资源: 土壤肥力、水、林业、土地管理。
- 生态关系: 生境、虫害、循环、可持续。
- 动物与食物健康: 兽医、食品系统、One Health 入口。

不要放:

- 一般环境科学，应关联 `05 Natural Sciences > Environment`。
- 临床医学和公共卫生主内容，应关联 `09 Health & Medicine`。

### 09 Health & Medicine / 健康与医学总览

限定门类:

- 身体与疾病: 症状、诊断、风险因素、病程。
- 预防与公共健康: 流行病、疫苗、卫生、健康公平。
- 治疗与照护: 医学、护理、药学、康复。
- 福利与支持: 老年照护、儿童服务、社会工作、咨询。

不要放:

- 一般生物学原理，应关联 `05 Natural Sciences`。
- 职业安全流程，应关联 `10 Services & Transport`。

### 10 Services & Transport / 服务与运输总览

限定门类:

- 服务体验: 等待、接待、前后台、服务恢复。
- 生活服务: 酒店、餐饮、旅游、体育、休闲。
- 安全与现场保护: 安保、应急、职业健康安全。
- 运输与流动: 交通、物流、路径、最后一公里。

不要放:

- 组织管理理论，应关联 `04 Business & Law`。
- 基础设施建造，应关联 `07 Engineering & Construction`。

## 新知识点生成的 Golden Reference

未来生成新的知识点、概念、故事、题目和学习路径时，golden reference 使用公开学习层，而不是完整内部兼容层。

```text
Golden reference:
11 public categories
  -> 11 General Entries
  -> 29 public narrow fields
    -> 80 practical detailed fields
      -> concepts / stories / questions / learning paths
```

内部兼容层只用于 code 对齐、父子关系审计、导入缓冲和 Founder 维护:

```text
Internal reference:
11 categories -> 57 submodules -> 148 detailed fields
```

### 生成时的选择顺序

1. 优先匹配 `80 practical detailed fields`。如果知识点能明确放进某个 detailed field，就以它作为 `primary_path`。
2. 如果知识点是某一大类的基础总论、共同问题、入门框架或学习前置内容，放入该大类的 `General Entry`。
3. 如果知识点跨多个领域，仍然只选一个 `primary_path`，其他方向进入 `related_paths`。
4. 如果内容是现实问题、任务、案例合集或跨领域探索路线，设为 `project_pack`，不要升格为 submodule。
5. 如果找不到合适位置，不新增 category 或 submodule；标记为 `needs_review`，必要时进入内部兼容层的待分拣状态。

### 判断 primary path 的标准

选择 primary path 时，优先看这个知识点最核心的学习对象，而不是表面应用场景:

- 它主要解释什么对象?
- 它主要依靠什么证据或方法?
- 学习者学完后，最应该进入哪个 field 继续学习?
- 如果删掉某个领域，这个知识点是否还成立?

例子:

```text
AI prompt engineering
primary_path: 06 Computing & Technology > 061 ICT > 0613 Software and applications development and analysis
related_paths: 03 Social Sciences; 04 Business & Law; 02 Arts & Humanities

服务恢复
primary_path: 10 Services & Transport > 101 Personal services or 10 General Entry depending on scope
related_paths: 04 Business & Law; 03 Social Sciences

贝叶斯思维
primary_path: 05 Natural Sciences > 054 Mathematics and statistics > 0542 Statistics
related_paths: 03 Social Sciences; 06 Computing & Technology; 04 Business & Law

一座城市如何运行
node_type: project_pack
primary_path: 10 Services & Transport or 07 Engineering & Construction depending on story focus
related_paths: 03 Social Sciences; 04 Business & Law; 05 Natural Sciences; 07 Engineering & Construction
```

### Source of Truth 分工

```text
内容生成的 golden reference:
docs/mapkai-additive-knowledge-architecture.zh.md

父子关系审计证据:
docs/taxonomy-parent-child-audit.md
taxonomy_parent_child_audit.csv

运行时代码来源:
script.js categories[]
public/script.js categories[] mirror
```

也就是说，未来内容生产先看本文件定义的公开学习层和 General Entry 边界；需要确认 code、parent 或 related-path 风险时，再查 taxonomy audit 和运行时代码。

## 11 大类增补建议

### 00 通用课程与资格

适合增加:

- 学习策略
- 元认知
- 学习迁移
- 终身学习
- 基础读写
- 数量感
- 知识地图
- 自我调节学习

内容形态:

- 概念寓言为主。
- 可以做一组“学习如何学习”的项目包。

不要增加:

- 太专业的学科内容。
- 已经属于教育学或心理学的完整学科。

### 01 教育

适合增加:

- 学习科学
- 课程研究
- 教学设计
- 教育评估
- 教育心理学
- 特殊教育
- 早期教育
- 教师教育

内容形态:

- 概念寓言: 支架式教学、最近发展区、形成性评价。
- 历史故事: Dewey、Montessori、Reggio Emilia 等。
- 真实案例: 课堂、课程改革、学习评价。

### 02 艺术与人文

适合增加:

- 艺术史
- 设计研究
- 美学
- 文学理论
- 语言学
- 翻译研究
- 历史学
- 考古学
- 哲学
- 宗教学
- 文化研究

内容形态:

- 概念寓言: 诠释循环、互文性、文化记忆。
- 历史故事: 文艺复兴、手稿校勘、透视法、博物馆。
- 作品/物件故事: 一幅画、一首歌、一段文本如何改变问题。

注意:

- 设计类可以放在 `02 Arts`，服务设计则更适合 `10 服务` 或作为 related path。

### 03 社会科学、新闻与信息

适合增加:

- 社会学
- 人类学
- 心理学
- 行为科学
- 政治学
- 公共政策
- 国际关系
- 新闻学
- 传播学
- 信息科学
- 图书馆学

内容形态:

- 概念寓言: 社会资本、社会规范、议程设置、框架理论。
- 案例故事: 选举、城市治理、媒体事件、公共舆论。
- 方法故事: 调查、访谈、统计、混合方法。

注意:

- 心理学主路径建议先放这里，健康/神经方向作为 related path。
- 政治与公共政策可以补进现有 `031/038/039`，不要新增大类。

### 04 商业、管理与法律

适合增加:

- 战略管理
- 市场营销
- 人力资源
- 运营管理
- 创业
- 经济学
- 金融
- 会计
- 公司治理
- 合规
- 知识产权
- 数据保护法

内容形态:

- 概念寓言: 交易成本、组织双元性、合法性、代理问题。
- 案例故事: 企业决策、市场进入、监管失败、平台治理。
- 机制解释: 现金流、机会成本、风险组合。

注意:

- 经济学可以放在 `041 Business and administration` 下作为 detailed field 或 concept cluster，不必新开大类。

### 05 自然科学、数学与统计

适合增加:

- 数学
- 应用数学
- 概率论
- 统计学
- 数据分析
- 运筹学
- 物理学
- 化学
- 地球科学
- 环境科学
- 生物学
- 认知科学相关的自然科学部分

内容形态:

- 机制解释: 贝叶斯、假设检验、回归、最优化。
- 历史发现故事: Humboldt、Leeuwenhoek、Keeling、Nightingale 统计部分。
- 概念寓言: 不确定性、模型、控制变量、范式转换。

注意:

- AI 和软件不要放这里，除非是数学/统计底层概念。
- 数据科学可以 related 到 `06 ICT`。

### 06 信息与通信技术

适合增加:

- 计算机科学
- 软件工程
- 算法
- 数据库
- 人机交互
- 网络安全
- 云计算
- AI
- 机器学习
- 数据科学
- 平台系统
- 数字化转型

内容形态:

- 机制解释: 算法、Token、Embedding、过拟合、API。
- 概念寓言: 抽象、协议、模块化、人在回路中。
- 案例故事: 系统故障、数据泄露、平台网络效应。

注意:

- AI 可以作为 `061` 下的 detailed field 或 project pack，不建议单独升成第 12 大类。

### 07 工程、制造与建筑

适合增加:

- 机械工程
- 电气工程
- 土木工程
- 化学工程
- 机器人
- 工业工程
- 供应链工程
- 质量管理
- 建筑学
- 城市规划
- 基础设施

内容形态:

- 概念寓言: 权衡、安全系数、反馈控制、瓶颈。
- 机制解释: 公差、传力路径、优化。
- 历史/案例故事: 灯塔、桥梁、工厂、事故复盘。

注意:

- 城市规划可以在 `073 Architecture and construction` 下，不必挪到服务。

### 08 农业、林业、渔业与兽医

适合增加:

- 食品科学
- 土壤科学
- 动物科学
- 农业生态
- 林业管理
- 渔业资源
- 兽医公共卫生
- 食物系统
- 循环农业

内容形态:

- 概念寓言: 轮作、土壤肥力、综合虫害管理、同一健康。
- 历史故事: Rothamsted、兽医学校、林业制度。
- 系统故事: 一块面包、一片森林、一张渔网。

注意:

- 气候和环境大概念主路径仍建议放 `05 > 052 Environment`，农业这里做应用场景。

### 09 健康与福利

适合增加:

- 医学
- 护理
- 药学
- 公共卫生
- 流行病学
- 康复
- 营养
- 社会工作
- 老年照护
- 健康政策

内容形态:

- 历史发现故事: Nightingale、John Snow。
- 概念寓言: 健康社会决定因素、连续照护、赋权。
- 机制解释: 疫苗、诊断推理、风险因素。

注意:

- 临床医学、公共卫生、福利照护要分清，不要都写成“医生治病”。

### 10 服务

适合增加:

- 服务设计
- 酒店管理
- 旅游管理
- 活动管理
- 体育服务
- 交通服务
- 物流
- 城市服务
- 应急管理
- 安保管理
- 职业安全

内容形态:

- 概念寓言: 服务蓝图、价值共创、排队理论、服务恢复。
- 案例故事: 酒店入住、交通换乘、活动现场、服务失败修复。
- 机制解释: 排队、瓶颈、最后一公里。

注意:

- 服务不是“低层次应用”，它可以作为过程、体验和运营系统的知识入口。

## 建议优先增加的项目

### 第一优先级: 29 narrow fields 和 80 practical detailed fields 的概念故事种子

这是最适合 MapKAI 当前阶段的增补。

现在已有 `00` 的 15 篇正式样稿。下一步可以优先按公开产品层推进:

```text
11 categories
  -> 29 public narrow fields
    -> 80 practical detailed fields
...
```

每批都必须:

- 先生成。
- 再严格 review。
- 不合格就 rewrite。

### 第二优先级: 每个大类 1 篇学科起源页

现在 11 篇已经通过二轮 review，可以作为入口页。

后续可以补:

- 每个 public narrow field 的起源页。
- 每个 practical detailed field 的起源故事。

### 第三优先级: 跨学科项目包

适合做 MapKAI 的探索体验。

候选项目包:

- 一座城市如何运行
- 一家餐厅背后的知识系统
- 一次公共卫生事件里的知识链
- AI 产品背后的知识地图
- 一块农田如何连接生态、经济和健康
- 一次服务失败如何被修复

这些项目包不改变分类，只引用多个 existing paths。

## 不建议现在做的事

- 不要重排 11 大类。
- 不要新增 3 个世界入口作为正式数据层。
- 不要把 AI 单独升成大类。
- 不要把心理学从社会科学里强行搬走。
- 不要把设计、服务、工程混成一个大类。
- 不要为了新概念新增 submodule，除非它真的是稳定学科方向。

## 推荐的数据字段

新增内容可以先用这些字段描述:

```text
id
title_zh
title_en
node_type
category_code
group_code
detailed_field_code
primary_path
related_paths
concept_tags
story_format
difficulty_level
review_status
review_report
visibility_layer
primary_parent_code
```

`node_type` 可以是:

```text
detailed_field
general_entry
concept
theory
method
tool
person
event
historical_story
concept_fable
mechanism_explainer
case_story
project_pack
```

## 最终建议

MapKAI 现在最稳的知识架构是:

```text
Internal base 不动:
11 大类 -> 57 submodules -> 148 detailed fields

Public learning layer:
11 大类 -> 29 narrow fields -> 80 practical detailed fields

增补:
每个 practical detailed field 增加 concept nodes
每个 concept node 生成对应故事
跨领域内容做 project packs / related paths
```

也就是:

```text
内部分类 = 官方兼容骨架
公开分类 = 用户学习货架
新增概念 = 血肉
故事内容 = 体验
project pack = 探索路线
related paths = 横向连接
```
