# MapKAI 内容严格 Review 报告

日期: 2026-06-21

更新: 这是第一轮 review 记录。根据本报告完成重写后，二轮复审结果见 `docs/mapkai-content-review-report-2026-06-21-round2.zh.md`。

范围:

- `docs/mapkai-subject-origin-stories.zh.md`
- `docs/mapkai-submodule-concept-fable-index.zh.md`
- `docs/mapkai-submodule-concept-fables-00.zh.md`

使用标准:

- `mapkai-story-review`
- `subject-origin-page-standard`
- `mapkai-concept-fable-story` examples and failure patterns
- `concept-fable-review-examples`

## 总判定

这些内容现在已经完成第一轮严格 review。结论是: 学科起源页整体可以进入小修阶段；submodule 概念索引可以作为生产索引继续使用，但要先清理重复和不一致；`00 通用课程与资格` 的概念寓言正文不能直接发布，需要扩写后再复审。

## 1. 学科起源页 Batch Summary

- Number of pages reviewed: 11
- PASS: 7
- PASS / LOCAL EDIT: 4
- LOCAL EDIT: 0
- FAIL: 0

机械检查:

- 11 篇均包含必需栏目: `学科起源`、`一句简介`、`起源故事`、`为什么这个学科需要出现`、`核心转向`、`关键人物 / 事件 / 工具`、`后来长出的分支`、`反思问题 / 小测`。
- 11 篇 `起源故事` 均在约 500-550 字之间，符合 Subject Origin first-pass 的 500-800 字区间。
- 每页总长约 1070-1180 字，符合 900-1500 字标准区间。
- 未发现 first-pass 不应出现的图片 prompt、视觉模块建议或 layout notes。

### 逐篇决定

| 位置 | 学科 | Decision | 主要判断 | 必要修订 |
| --- | --- | --- | --- | --- |
| `docs/mapkai-subject-origin-stories.zh.md:3` | 通用课程与资格 | PASS / LOCAL EDIT | 成人夜校、公共图书馆和基础能力入口的 origin window 成立。弱点是它更像教育类别/资格入口，不是严格意义上的单一学科。 | 在 `核心转向` 或 `为什么这个学科需要出现` 中更明确说明这是“跨专业入口类别”的起源，而不是一门传统学科的起源。 |
| `docs/mapkai-subject-origin-stories.zh.md:45` | 教育 | PASS | Dewey 实验学校、活动材料、教师记录和学习问题转向清楚。故事身体能支撑后文解释。 | 只需微调重复句式，不需要结构改写。 |
| `docs/mapkai-subject-origin-stories.zh.md:87` | 艺术与人文 | PASS / LOCAL EDIT | 文艺复兴手稿、图像、校勘和解释方法的窗口成立。弱点是范围很大，容易从故事滑向总论。 | 增加一个更具体的材料动作，例如抄本差异如何改变解释，减少“人如何理解自己”这类过宽抽象句。 |
| `docs/mapkai-subject-origin-stories.zh.md:129` | 社会科学、新闻与信息 | PASS / LOCAL EDIT | 城市、报纸、统计和公共事实的共同压力清楚。弱点是社会科学、新闻、信息三个方向聚合较重。 | 把共同对象收紧为“公共事实如何被收集、组织、传播和解释”，避免像三个学科简介拼接。 |
| `docs/mapkai-subject-origin-stories.zh.md:171` | 商业、管理与法律 | PASS | 威尼斯贸易、复式记账、契约和陌生人协作的转向清楚。账本不是装饰物，确实推动了问题变化。 | 可发布前做句式微调。 |
| `docs/mapkai-subject-origin-stories.zh.md:213` | 自然科学、数学与统计 | PASS / LOCAL EDIT | Humboldt 山体观察能支撑自然科学中的测量、变量和分布转向。弱点是数学与统计主要在解释段出现，故事段更偏自然史/自然科学。 | 在起源故事里加入更明确的数量化动作，例如把高度、温度、气压和植被带排成可比较记录，让数学/统计方法更早进入故事身体。 |
| `docs/mapkai-subject-origin-stories.zh.md:255` | 信息与通信技术 | PASS | Shannon 的信息论场景能解释从设备/线路到编码、通道、噪声和恢复的对象转向。 | 可发布前做轻微压缩。 |
| `docs/mapkai-subject-origin-stories.zh.md:297` | 工程、制造与建筑 | PASS | Eddystone Lighthouse 让材料、力、环境和公共安全成为设计问题，field-method fit 强。 | 可发布前做轻微压缩。 |
| `docs/mapkai-subject-origin-stories.zh.md:339` | 农业、林业、渔业与兽医 | PASS | Rothamsted 长期试验田很好地支撑长期观察、生命生产和可持续管理。 | 可发布前做轻微压缩。 |
| `docs/mapkai-subject-origin-stories.zh.md:381` | 健康与福利 | PASS | Nightingale 场景锚在 1857 年前后战后统计分析，避免了把 Scutari 病房和伦敦分析混成一个 false scene。 | 可作为这一批的样稿候选。 |
| `docs/mapkai-subject-origin-stories.zh.md:423` | 服务 | PASS | 铁路车站把服务从个人热情转成流程、空间、信息和交接设计，类别起源清楚。 | 可发布前做轻微压缩。 |

### Common Problems

1. Broad-category compression: 顶层学科范围很大，少数页容易把多个领域合并成总论。`艺术与人文`、`社会科学、新闻与信息`、`自然科学、数学与统计` 最明显。
2. Repeated ending pattern: 多篇使用“这成为……入口之一”作为故事收束。不是错误，但连续阅读时会显出模板感。
3. Reflection questions mostly work, but有几篇还可以更紧地回到故事对象，例如表格、手稿、山体图、车站流程。

### Stories That Can Become Samples

- `健康与福利`: 因为时间轴和统计方法最稳。
- `工程、制造与建筑`: 因为对象、阻力和设计方法结合清楚。
- `教育`: 因为课堂行动和学科问题转向自然。

### Next Step

对 4 篇 `PASS / LOCAL EDIT` 做局部小修；对 7 篇 `PASS` 做微型语言清理。完成后可进行第二轮快速复审。

## 2. Submodule 概念寓言索引 Review

Decision: PASS AS PRODUCTION INDEX / LOCAL EDIT BEFORE MASS GENERATION

机械检查:

- 覆盖 57 个 submodules。
- 每个 submodule 配置 3 个概念，共 171 个概念条目。
- 该文件是生产索引，不是 public article，也不是完整寓言正文；不能按故事正文判定 `PASS`。

主要问题:

1. `docs/mapkai-submodule-concept-fable-index.zh.md:30` 使用“基础能力迁移”，但正文文件对应故事 `借出去的梯子` 的揭示概念是“学习迁移”。需要统一概念名，或明确“基础能力迁移”是 learning transfer 的子型。
2. `docs/mapkai-submodule-concept-fable-index.zh.md:193` 和 `docs/mapkai-submodule-concept-fable-index.zh.md:283` 复用“韧性 / 会弯的田埂”。跨领域可以复用概念，但不应复用完全相同标题和核心隐喻，否则后续批量生成会模板化。
3. `docs/mapkai-submodule-concept-fable-index.zh.md:194` 和 `docs/mapkai-submodule-concept-fable-index.zh.md:301` 复用《池塘里的最后一网》，但一个对应“承载力”，一个对应“最大可持续产量”。这两个概念相关但不相同，标题复用会造成概念边界模糊。
4. `可供性`、`瓶颈` 等跨领域复现是合理的，但后续生成时必须让故事对象承担领域差异，避免同一个概念模板换皮。

Next Step:

在继续生成其余 156 篇正文前，先清理重复标题、重复隐喻和概念名不一致。否则批量生成会放大重复结构。

## 3. `00 通用课程与资格` 概念寓言正文 Batch Summary

- Number of stories reviewed: 15
- PASS: 0
- PASS / LOCAL EDIT: 8
- LOCAL EDIT: 7
- FAIL: 0

机械检查:

- 15 篇均包含: `知识寓言`、`寓言故事`、`揭示的概念`、`概念解释`、`隐喻对应`、`类比边界`、`反思问题`。
- 15 篇故事正文均短于 concept fable 正常建议的 700-1100 字。
- 当前正文长度范围约 269-470 字，因此不能给 clean `PASS`。

### 逐篇决定

| 位置 | 标题 | 概念 | 字数 | Decision | 主要问题 | 必要修订 |
| --- | --- | --- | ---: | --- | --- | --- |
| `docs/mapkai-submodule-concept-fables-00.zh.md:13` | 三张空白表格 | 元认知 | 470 | PASS / LOCAL EDIT | 结构正确，有多周记录和策略调整，但还不够厚。 | 扩写到 700-900 字，增加一次“错误策略被重新监控”的中段。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:47` | 没有标签的书架 | 知识地图 | 400 | PASS / LOCAL EDIT | 从分类书架到问题入口的隐喻成立，但摩擦只有两类用户，转向偏快。 | 增加第三类学习者或一次“大标签仍失败”的情节，让地图需求更必然。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:81` | 过不去的窄门 | 阈限概念 | 385 | PASS / LOCAL EDIT | 窄门隐喻和转化性理解准确，但进入前的卡顿还可更具体。 | 扩写卡在门前的反复尝试，明确“理解后不可逆地改变后续阅读”。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:115` | 还没点火的炉子 | 学习准备度 | 318 | LOCAL EDIT | 故事正确但像短例子，准备度维度只快速列出。 | 增加不同学员的先备知识、情绪安全、工具经验和环境条件，让准备度不是“慢慢教步骤”。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:147` | 借出去的梯子 | 学习迁移 | 384 | PASS / LOCAL EDIT | 多任务迁移结构成立。 | 扩写一次失败迁移和一次成功迁移，突出表面相似与深层结构差异。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:181` | 盖章的空信封 | 资格信号 | 349 | PASS / LOCAL EDIT | 资格信号与真实能力的分离很好。 | 增加雇主误判或培训中心激励变化，让“信号失真”更有压力。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:215` | 三个记号的市场 | 符号表征 | 274 | LOCAL EDIT | 只有一个市场瞬间，概念被正确命名但故事厚度不足。 | 增加符号误读、共同校准和新符号带来新推理的三个阶段。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:247` | 不一样重的十枚硬币 | 数量感 | 288 | LOCAL EDIT | 数量、单位、重量的对比有效，但太快到概念。 | 增加估算、比例或单位换算情节，让“数量感”不只是“数目不等于重量”。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:279` | 读不懂的药瓶 | 功能性读写 | 291 | LOCAL EDIT | 药瓶场景准确，但只有单一任务。 | 加入处方、日历、重复成分和公共表格的连续行动，展示读写如何转化为安全决策。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:311` | 第一次自己拧紧的螺丝 | 自我效能 | 293 | PASS / LOCAL EDIT | 有具体掌握经验和后续任务迁移，概念 fit 好。 | 扩写 Niko 从回避到尝试的中间阻力，避免“做成一次就有信心”的简化。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:343` | 会留下铅笔印的墙 | 成长型思维 | 273 | LOCAL EDIT | 错误作为反馈的隐喻成立，但故事太薄。 | 增加“固定能力观”旧信念、反馈循环和策略改变，避免只等同于“不怕错误”。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:375` | 自己上锁的柜子 | 自我调节学习 | 347 | PASS / LOCAL EDIT | 控制权逐步返回学习者，外部支持撤离清楚。 | 扩写一次拿错材料后的复盘，让计划、监控、调整三步更完整。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:409` | 总会变长的路 | 终身学习 | 269 | LOCAL EDIT | 通行证和新城隐喻可用，但偏泛，容易解释很多成长类概念。 | 重写中段，让不同人生阶段的任务真实改变，而不是只说“每到新城重新学”。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:441` | 搬到新屋的旧桌子 | 学习迁移 | 277 | LOCAL EDIT | 与 `借出去的梯子` 形成概念重复；故事也偏短。 | 要么合并学习迁移，要么改成“再情境化/远迁移/适应性迁移”等更窄概念。 |
| `docs/mapkai-submodule-concept-fables-00.zh.md:473` | 走廊里的规则 | 隐性课程 | 329 | PASS / LOCAL EDIT | 正式课表和走廊规则的对比清楚，机会分配也可见。 | 扩写一次老师误判和一次学生行为改变，让隐性规则的传播更有过程。 |

### Common Problems

1. Story body too short: 所有 15 篇都低于正式 concept fable 的叙事厚度标准，所以没有 clean `PASS`。
2. Short example + label risk: 多数故事在一个正确场景后很快进入概念名，读者还没完全感到概念“必须出现”。
3. Repeated school/community setting: 夜校、学习中心、老师、学员出现频率高。`00` 类别相关性强，但后续批量生成需要拉开场景，否则 171 篇会显得同一套模板。
4. Concept duplication: `学习迁移` 在 `借出去的梯子` 和 `搬到新屋的旧桌子` 中重复。重复可以保留，但必须说明两者区分，否则应合并或改概念。
5. Boundaries generally better than generic disclaimer: 多数 `类比边界` 没有落入“现实更复杂”的空话，这是优点，扩写时要保留。

### Repeated Pattern Warning

当前批次常见结构是:

```text
学习场景 -> 一个小问题 -> 老师调整方法 -> 后来概念叫 X
```

这会让故事显得正确但轻。正式版需要把中段加厚:

```text
旧办法为什么合理 -> 第一次摩擦还能被解释 -> 第二次摩擦暴露结构 -> 人改变做法 -> 最后画面先让读者感到概念 -> 再揭示概念名
```

### Stories That Can Become Samples

- `三张空白表格`: 扩写后可作为元认知样稿。
- `盖章的空信封`: 信号与能力的分离清楚，容易扩成高质量寓言。
- `自己上锁的柜子`: 支持撤离和控制权回归的结构好。
- `走廊里的规则`: 隐性课程的可见/不可见对比强。

### Stories Requiring Full Rewrite

None. 当前没有概念映射完全错误的故事；问题主要是叙事厚度、重复结构和个别概念边界。

### Next Step

不要继续生成剩余 submodule 正文。先把 `00 通用课程与资格` 这 15 篇扩写到正式 concept fable 质量，再复审。复审通过后，再把该版本作为后续 156 篇的样稿标准。
