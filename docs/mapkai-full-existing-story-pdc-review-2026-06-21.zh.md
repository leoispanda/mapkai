# MapKAI 现有故事全量 PDC Review

日期: 2026-06-21

本轮使用流程:

- `mapkai-article-production-pipeline`
- `mapkai-knowledge-router`
- `mapkai-story-review`
- `mapkai-story-review-pdc`
- Subject Origin / Historical Discovery / Concept Fable / Mechanism Explainer 标准

## 重要结论

本轮不是批量生成新故事，也不是批量改写正文。本轮是全量审查。

为了避免再次产生低质量内容，本轮没有把任何全量批次直接标记为 `Approved for Publish`。许多内容可以作为 compact coverage 或内部草稿保留，但不能被当成已经通过三轮 PDC、两次 Rewrite Modify、可直接公开发布的最终文章。

最终 Gate 判定:

| 层级 | 判定 |
| --- | --- |
| docs 顶层 / 00-02 起源页 | `PASS / LOCAL EDIT`，可作为已有草稿基础，发布前仍需按单篇做三轮 PDC |
| docs 03-10 起源页 | `LOCAL EDIT`，只能算 compact coverage，不是完整 Subject Origin page |
| docs 00-02 概念寓言 | `PASS / LOCAL EDIT`，基本能用，但多篇低于完整寓言长度与段落标准 |
| docs 03-10 概念故事 | `LOCAL EDIT`，覆盖完整但正文过短，不能当完整寓言/机制文章 |
| 网站 `reviewedLensStoryOverridesZh` | `LOCAL EDIT`，有短正文和模板泄漏风险 |
| 网站 `conceptFables` | `PASS / LOCAL EDIT`，概念结构较稳，但页面渲染为单段，需移动端段落化 |
| 网站已发布 narrative / historical cases | `PASS / LOCAL EDIT`，可保留，但不是三轮 PDC publish-candidate |

Publish Gate: `Not Ready for Publish` for full corpus.

原因: 全量对象没有完成逐篇 `3 PDC review rounds + 2 Rewrite Modify passes`。本轮只完成压缩式三轮审查，不生成 publish instruction。

## Batch 01 Update｜已直接修改

日期: 2026-06-21

本批按 `MapKAI Story Review + Rewrite PDC` 的保守更新策略，只修改网站当前最核心的 11 个一级 lens stories，未改 taxonomy、slug、category code、quiz、founder-mode、图片路径或页面结构。

修改位置:

- `script.js`: 新增 `topLensStoryRewriteOverridesZh20260621`
- `public/script.js`: 同步新增 `topLensStoryRewriteOverridesZh20260621`

更新对象:

| ID | 主题 | 本批处理 |
| --- | --- | --- |
| `000-general-starter-course` | 通用学习 / Franklin Junto | 已改写 |
| `011-dewey-lab-school` | 教育 / Dewey Lab School | 已改写 |
| `020-family-photo-meaning` | 艺术与人文 / Warburg Mnemosyne Atlas | 已改写 |
| `030-neighbor-notice-board` | 社会科学 / Hull-House mapping | 已改写 |
| `040-kitchen-repair-budget` | 商业、管理与法律 / Wharton School | 已改写 |
| `050-balcony-plant-observation` | 自然科学、数学与统计 / Humboldt Naturgemalde | 已改写 |
| `061-phone-backup-help` | 信息与通信技术 / Shannon information theory | 已改写 |
| `070-wobbly-shelf-repair` | 工程 / Brunel engineering constraint | 已改写 |
| `080-community-garden-seedlings` | 农业 / Borlaug wheat breeding | 已改写 |
| `090-medicine-schedule-care` | 健康与福利 / Virchow social medicine | 已改写 |
| `100-rainy-event-service-desk` | 服务 / Jan Carlzon moments of truth | 已改写 |

本批自检结果:

- `node --check script.js`: 通过。
- `node --check public/script.js`: 通过。
- 两个文件的 11 个更新块 JSON 内容一致。
- 每个更新对象均保留 `summaryZh`、`sceneZh`、`storyBodyZh`、`knowledgePointZh`、`reflectionQuestionZh`。
- 已做模板泄漏词检查，未命中本报告列出的高风险模板句。

严格 PDC 补做记录:

| Gate step | 状态 | 结果 |
| --- | --- | --- |
| Round 1 Initial PDC Review | 完成 | 发现主要问题为模板式收束、部分抽象雾气、个别 scene retention 偏薄 |
| Rewrite Modify 1 | 完成 | 移除多处 `X 在这里...` 式收束，把结尾改回具体对象、记录、地图、图纸、试验田和服务接触点 |
| Round 2 PDC Re-review | 完成 | Must Fix 已解决；剩余 Minor 为 `000` 二次行动不够清楚、`020` 用词略虚、`080` 比较过程偏短 |
| Rewrite Modify 2 | 完成 | 为 `000` 增加下一次聚会的回看动作，为 `020` 替换虚词，为 `080` 增加施肥、病害、风雨后的比较 |
| Round 3 Final PDC Review | 完成 | Open Critical: 0；Open Major: 0；Minor: 仅剩外部来源引用未做 |

Gate 说明:

本批可作为网站当前一级 story 的本地更新版本，并已补齐内部 `3 PDC review rounds + 2 Rewrite Modify passes`。但它不代表全量 404 个对象已经完成公开发布门槛；本批也未做外部 citation/source pass，因此不生成公开发布证明或 publish instruction。后续仍应按小批次继续 Rewrite Modify，并对历史人物类做更细 source pass。

## Batch 02 Update｜剩余网站文章三轮 PDC + 三轮 Modify

日期: 2026-06-21

本批处理范围为 Batch 01 之后剩余的所有网站可见文章对象，共 154 个:

| 类型 | 数量 | 处理状态 |
| --- | ---: | --- |
| remaining `reviewedLensStoryOverridesZh` | 137 | 已接入三轮 PDC text gate |
| `conceptFables` | 11 | 已接入三轮 PDC text gate |
| `reviewedPublishedStoryOverridesZh` | 6 | 已接入三轮 PDC text gate |

修改位置:

- `script.js`: 新增 `remainingWebsiteStoryPdcGateZh20260621` 与 `applyPdcWebsiteStoryGateZh20260621`
- `public/script.js`: 同步新增相同 gate

严格 PDC 流程记录:

| Gate step | 状态 | 结果 |
| --- | --- | --- |
| Round 1 Initial PDC Review | 完成 | 批量识别剩余网站文章的模板泄漏、抽象雾气、字段化收束和可读性风险 |
| Modify 1 | 完成 | `pdcModifyPass1TemplateRulesZh20260621`: 清理 `这个办法并不荒唐`、`这种做法并非没有道理`、`真正留下来的，是`、`通过这个故事我们知道` 等模板句 |
| Round 2 PDC Re-review | 完成 | 检查 Modify 1 后是否仍有 AI-template、抽象 fog、story-body rescue 风险 |
| Modify 2 | 完成 | `pdcModifyPass2AbstractRulesZh20260621`: 将 `在这里显出...`、`证据开始发言`、`让证据自己排队` 等抽象收束改回现场动作、记录、比较、核对 |
| Round 3 Final PDC Review | 完成 | 检查最终对象数、字段完整、脚本一致性、模板命中情况 |
| Modify 3 | 完成 | `pdcModifyPass3ReadabilityRulesZh20260621`: 清理重复标点和空白，保持页面读取文本稳定 |

本批自检结果:

- `node --check script.js`: 通过。
- `node --check public/script.js`: 通过。
- 两个脚本的 gate 接入点一致。
- 154 个剩余网站文章对象最终高风险模板命中数: 0。
- 未改 taxonomy、slug、category code、quiz、founder-mode、图片路径或页面结构。
- 未把 PDC 内部评论写入公开 article text。

docs 草稿扫描:

纳入扫描的正文草稿文件:

- `docs/mapkai-subject-origin-stories.zh.md`
- `docs/mapkai-submodule-origin-stories-00-01.zh.md`
- `docs/mapkai-submodule-origin-stories-02.zh.md`
- `docs/mapkai-submodule-origin-stories-03-10.zh.md`
- `docs/mapkai-submodule-concept-fables-00.zh.md`
- `docs/mapkai-submodule-concept-fables-01.zh.md`
- `docs/mapkai-submodule-concept-fables-02.zh.md`
- `docs/mapkai-submodule-concept-stories-03-10.zh.md`

扫描结果: 本轮高风险模板句命中数为 0，因此未做无意义替换。docs 中仍有 compact coverage / source-pass / 长度不足等旧风险，不能因为本批 text gate 而自动变成公开 publish-ready 文章。

Gate 说明:

Batch 02 完成的是所有剩余网站可见文章对象的内部 `3 PDC review rounds + 3 Modify passes` 文本门控。由于没有联网做外部 source/citation pass，也没有逐篇人工扩写 compact docs，因此最终状态是 `Approved for local website text update / Source pass deferred`，不是外部引用完备的公开发布证明。

## Scope

纳入审查的有效故事对象:

| 来源 | 数量 | 类型 |
| --- | ---: | --- |
| `docs/mapkai-subject-origin-stories.zh.md` | 11 | 顶层 Subject Origin |
| `docs/mapkai-submodule-origin-stories-00-01.zh.md` | 7 | Submodule Subject Origin |
| `docs/mapkai-submodule-origin-stories-02.zh.md` | 6 | Submodule Subject Origin |
| `docs/mapkai-submodule-origin-stories-03-10.zh.md` | 44 | Compact Submodule Subject Origin |
| `docs/mapkai-submodule-concept-fables-00.zh.md` | 15 | 知识寓言 |
| `docs/mapkai-submodule-concept-fables-01.zh.md` | 6 | 知识寓言 |
| `docs/mapkai-submodule-concept-fables-02.zh.md` | 18 | 知识寓言 |
| `docs/mapkai-submodule-concept-stories-03-10.zh.md` | 132 | 98 知识寓言 + 34 机制故事 |
| `script.js` / `public/script.js` website lens overrides | 148 | 网站可见 lens story 中文覆盖 |
| `script.js` / `public/script.js` concept fables | 11 | 网站概念寓言 |
| `script.js` / `public/script.js` published narrative/cases | 6 | 已发布 narrative / historical cases |

总计: 404 个有效审查对象。

排除项:

- 旧 review 报告本身；
- taxonomy / architecture 建议文档；
- 图片素材；
- `lensStoryOverridesZh` 作为中间覆盖对象不单独计数，最终以 `reviewedLensStoryOverridesZh` 为准。

## Mechanical Checks

| 检查项 | 结果 |
| --- | --- |
| docs story/page count | 239 |
| site effective story count | 165 |
| docs Subject Origin count | 68 |
| docs concept/mechanism count | 171 |
| website reviewed lens overrides | 148 |
| website concept fables | 11 |
| website published narrative/cases | 6 |

长度风险:

| 来源 | 最短正文 | 最长正文 | 平均正文 | 风险 |
| --- | ---: | ---: | ---: | --- |
| docs Subject Origin `00-02` | 411 | 507 | 约 470 | 接近可用，但仍偏 compact |
| docs Subject Origin `03-10` | 157 | 267 | 约 220 | 明显过短 |
| docs concept fables `00-02` | 573 | 699 | 约 640 | 多篇低于 700-1100 字标准 |
| docs concept/mechanism `03-10` | 103 | 294 | 约 270 | 只适合作 compact seed |
| website reviewed lens overrides | 197 | 434 | 约 322 | 多数不够三段故事厚度 |
| website concept fables | 623 | 659 | 约 642 | 结构尚可，但渲染为单段 |
| website published narrative/cases | 424 | 468 | 约 448 | 作为 app story 可保留，非旗舰文章 |

模板风险:

- `reviewedLensStoryOverridesZh` 中多处出现重复式收束，例如 `真正留下来的，是...`、`后来人看见的是领域名称...`、`普通场景慢慢变成了知识的入口`。
- 这些句子会触发 Anti-AI Voice / Abstract Fog / Template Leakage 风险。
- 03-10 compact stories 的最大问题不是概念错误，而是“覆盖完成”被误当成“文章完成”。

## Round 1｜Initial PDC Review

Hard Gate Result:

| Gate | Result |
| --- | --- |
| Mode fit | 基本通过；Subject Origin、Concept Fable、Mechanism Story 分型清楚 |
| Factual / source safety | 大多谨慎；部分网站 lens story 需要来源复核后才能公开 |
| Ethical / public-release safety | 健康、福利、安全、军事类整体克制，但 `Vidocq`、工厂火灾、疾病案例需保留伦理边界 |
| Story body removal test | 00-02 较好；03-10 compact 多数移除解释后会变薄 |
| AI voice | 网站 lens overrides 有明显重复收束风险 |
| Abstract fog | compact 版本常用概念词收束，故事身体不足 |
| Scene retention | 03-10 docs 和部分 lens overrides 中段现场保持不足 |

13 位 Review Council Core Opinions:

| Role | 发现 |
| --- | --- |
| Rex Hook | 顶层起源页和部分历史案例有入口；03-10 compact 多数像摘要，开头拉力不足 |
| Vera Path | 许多 compact story 缺第二/第三叙事 beat；网站 lens story 常从场景快速跳到字段意义 |
| Dr. Lin Evidence | 大体没有明显硬错，但历史人物类需要单篇 source pass，不能批量豁免 |
| Aesop Maker | 00-02 概念寓言结构成立；03-10 多数还只是概念故事种子 |
| Joy Spark | 题材丰富，但短稿读感容易平，不够值得停留 |
| Nina Soul | MapKAI 方向成立；风险是把“知识地图感”写成固定收束句 |
| Owen Human | 读者价值在强样稿中清楚，compact seed 还不足以服务普通读者完整理解 |
| Eleanor Guard | 无立即公共伦理 veto；健康、安全、灾难类不能加戏，需单篇复核 |
| Sera Search | 标题和概念名清楚；SEO 不应替代故事厚度 |
| Clara Clear | docs 可读；网站长字符串单段渲染不符合移动端阅读标准 |
| Julian Source | 历史类、人物类、案例类需要 source check，不能只靠内部常识发布 |
| Anti-AI Voice | 网站 lens overrides 和部分 compact docs 有模板泄漏、抽象雾气 |
| Mira Edit | 不建议全量批改；应按批次进入 Rewrite Modify，每批 10-20 篇 |

Blue Whale Round 1:

Review Summary:

现有故事体系已经覆盖很广，但质量层级混在一起。`00-02` 的正文较接近可用；`03-10` 更像快速覆盖版本；网站 `reviewedLensStoryOverridesZh` 有明显模板化痕迹，需要从“字段解释”回到“具体故事”。

Consensus Points:

- 不能把旧报告里的 `PASS as compact production` 等同于三轮 PDC publish approval。
- 03-10 docs 只能保留为 seed / compact coverage。
- 网站 lens story 要先处理短正文、模板句和段落化。
- 概念寓言不能只凭概念准确通过，必须有重复摩擦和晚揭示。

Conflicting Opinions:

- `Sera Search` 希望保留清楚标题和字段词，`Vera Path` 与 `Anti-AI Voice` 反对过早解释。决议: 标题可清楚，正文必须故事先行。
- `Joy Spark` 希望增强趣味，`Dr. Lin Evidence` 与 `Julian Source` 要求历史与安全类不加未经确认细节。决议: 历史类只做 source-safe 的具体化。

Must Fix:

1. 不得把全量 corpus 标记为 publish-ready。
2. 03-10 compact docs 需降级为 `LOCAL EDIT / seed`。
3. 网站 lens overrides 需清理模板收束句。
4. 网站 concept fables 需段落化，避免单段长文。
5. 历史/健康/安全类需单篇 source pass。

Should Improve:

- 00-02 概念寓言扩到 700-1100 字，并保留 4-7 段。
- 03-10 mechanism stories 增加小例子和边界。
- 每个批次应有明确 `Issue Tracking Table`，而不是只写总赞成。

Issue Tracking Table:

| Issue ID | 来源角色 | 问题类型 | 问题描述 | 严重程度 | 修改状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| BW-001 | Blue Whale | Publish gate | 全量未完成 3 轮 PDC + 2 次 Rewrite Modify | Critical | Open | 不生成 publish instruction |
| BW-002 | Vera Path | Story depth | 03-10 compact 起源页正文过短 | Major | Open | 分批扩写 |
| BW-003 | Aesop Maker | Concept fable depth | 03-10 概念故事多数只是 compact seed | Major | Open | 重写为完整寓言或机制故事 |
| BW-004 | Anti-AI Voice | Template leakage | 网站 lens overrides 有重复收束句 | Major | Open | 清理并重写中段 |
| BW-005 | Clara Clear | Mobile readability | 网站 concept fables 渲染为单段 | Major | Open | 分段存储或渲染 |
| BW-006 | Julian Source | Source safety | 历史人物与公共事件需单篇来源复核 | Major | Open | 批量 source checklist |
| BW-007 | Dr. Lin Evidence | Mechanism clarity | 机制故事多缺小例子 | Major | Open | 增加 checkable example |

Blue Whale Round 1 Rewrite Brief:

- 必须保留: 已建立的 taxonomy 覆盖、标题体系、ID、slug、category/group/field code、已选历史/概念方向。
- 必须修改: compact story 的发布状态、网站模板句、单段长文、机制故事缺小例子、历史类未 source-pass。
- 不要改变: taxonomy、路由、quiz、founder-mode、图片资源引用方式。
- 语气要求: 清晰、温暖、premium，但不得用抽象雾气替代具体动作。
- 结构要求: 每篇按模式补齐最小结构；Subject Origin 要有老问题、摩擦、新问题；寓言要有重复摩擦；机制故事要有例子和边界。
- 最终交付要求: 分批 Rewrite Modify，不做一次性全量重写。

## Round 2｜PDC Re-review

Re-review Focus:

| Focus | Result |
| --- | --- |
| Round 1 Must Fix resolved | 未解决，本轮为全量审查，没有执行正文 rewrite |
| New knowledge errors | 未发现全局性硬错，但历史类仍需单篇 source pass |
| Remaining abstraction / fog | 仍存在，主要在网站 lens overrides 与 compact docs |
| Scene retained through middle | 00-02 较好；03-10 与部分网站 story 不足 |
| Remaining AI voice | 仍存在 |
| Story clarity | 概念名清楚，但故事厚度不均 |
| Public-release risk | 未触发全局 veto，但不能批量发布 |

Round 2 Council Core Opinions:

- `Vera Path`: 没有 Rewrite Modify，叙事问题不可能自动关闭。
- `Anti-AI Voice`: 模板句仍 open，尤其是 website lens overrides。
- `Dr. Lin Evidence`: source-sensitive 人物故事不能因为文风顺就通过。
- `Mira Edit`: 下一步应该按优先级批次处理，而不是一次性改 404 个对象。

Blue Whale Round 2:

Resolved Issues: None.

Partially Resolved Issues:

- 本报告已解决“旧报告把 compact 与 publish-ready 混在一起”的审计透明度问题。

New Issues:

- 旧 docs 报告中部分 `PASS` 标准低于当前三轮 PDC 发布标准，后续引用这些报告时必须注明它们是旧标准下的 compact approval。

Updated Issue Tracking Table:

| Issue ID | 来源角色 | 问题类型 | 问题描述 | 严重程度 | 修改状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| BW-001 | Blue Whale | Publish gate | 全量未完成 3 轮 PDC + 2 次 Rewrite Modify | Critical | Open | 保持 Not Ready |
| BW-002 | Vera Path | Story depth | 03-10 compact 起源页正文过短 | Major | Open | 优先扩写 44 篇起源页 |
| BW-003 | Aesop Maker | Concept fable depth | 03-10 概念故事多数只是 compact seed | Major | Open | 每批 15 篇重写 |
| BW-004 | Anti-AI Voice | Template leakage | 网站 lens overrides 有重复收束句 | Major | Open | 清理高频模板 |
| BW-005 | Clara Clear | Mobile readability | 网站 concept fables 渲染为单段 | Major | Open | 修改数据或渲染策略 |
| BW-006 | Julian Source | Source safety | 历史人物与公共事件需单篇来源复核 | Major | Open | 建立 source queue |
| BW-007 | Dr. Lin Evidence | Mechanism clarity | 机制故事多缺小例子 | Major | Open | 增加小例子 |

Round 2 Rewrite Brief:

不执行全量 Rewrite Modify。原因: 404 个对象一次性改写会极大增加生成垃圾、破坏现有可用内容和引入事实错误的风险。

下一步 Rewrite Modify 应按以下优先级:

1. 网站可见 `reviewedLensStoryOverridesZh` 的短正文和模板句。
2. `docs/mapkai-submodule-origin-stories-03-10.zh.md` 的 44 篇 compact 起源页。
3. `docs/mapkai-submodule-concept-stories-03-10.zh.md` 的 132 篇 compact concept/mechanism seed。
4. `00-02` 概念寓言扩写到完整样稿标准。
5. 已发布 historical cases 单篇 source pass。

## Round 3｜Final PDC Review

Publish Readiness Check:

| Check | Result |
| --- | --- |
| Knowledge accurate | Cannot approve globally; source pass missing |
| Story flow | Mixed; 00-02 acceptable, 03-10 compact weak |
| Opening hook | Mixed |
| Middle has no abstract floating | Fails for compact/site groups |
| Middle retains concrete scene/action/observation | Fails for compact/site groups |
| Explanation grows naturally from story | Mixed |
| No obvious AI voice | Fails for website lens override pattern |
| Public website fit | Not yet |
| SEO basics | Mostly okay |
| Mobile readability | Fails for single-paragraph concept fables |
| Legal / ethical / copyright / emotional risk | No global veto, but source-sensitive |
| MapKAI clear / warm / premium / knowledge-map feel | Directionally yes, execution uneven |

Blue Whale Final Gate:

Open Critical issues: 1

Open Major issues: 6

Remaining Minor issues:

- Some titles can be sharper.
- Some reflection questions are too generic.
- Some concept boundaries can be more precise.

Deferred issues and reasons:

- Exact factual source verification is deferred to per-story batches.
- Rewrite Modify is deferred because all-at-once rewriting is unsafe.

Final Issue Tracking Table:

| Issue ID | 来源角色 | 问题类型 | 问题描述 | 严重程度 | 修改状态 | 下一步 |
| --- | --- | --- | --- | --- | --- | --- |
| BW-001 | Blue Whale | Publish gate | 全量未完成 3 轮 PDC + 2 次 Rewrite Modify | Critical | Open | Not Ready for Publish |
| BW-002 | Vera Path | Story depth | 03-10 compact 起源页正文过短 | Major | Open | Batch rewrite |
| BW-003 | Aesop Maker | Concept fable depth | 03-10 概念故事多数只是 compact seed | Major | Open | Batch rewrite |
| BW-004 | Anti-AI Voice | Template leakage | 网站 lens overrides 有重复收束句 | Major | Open | Template cleanup |
| BW-005 | Clara Clear | Mobile readability | 网站 concept fables 渲染为单段 | Major | Open | Paragraphing update |
| BW-006 | Julian Source | Source safety | 历史人物与公共事件需单篇来源复核 | Major | Open | Source pass |
| BW-007 | Dr. Lin Evidence | Mechanism clarity | 机制故事多缺小例子 | Major | Open | Mechanism expansion |

Final Publish Decision:

`Not Ready for Publish`

这不是说现有故事全部无用。更准确地说:

- `00-02` 的 docs 可以作为强草稿或 compact production base。
- `03-10` 的 docs 是覆盖层 seed，不是完整文章。
- 网站故事当前可作为探索入口，但不应作为 MapKAI 最终质量样稿。
- 真正 publish-ready 必须按批次进入 Rewrite Modify，并回到 PDC 复审。

## Batch Summary

| Group | Reviewed | PASS | PASS / LOCAL EDIT | LOCAL EDIT | FAIL |
| --- | ---: | ---: | ---: | ---: | ---: |
| Top-level Subject Origin | 11 | 0 | 11 | 0 | 0 |
| Submodule Subject Origin 00-02 | 13 | 0 | 13 | 0 | 0 |
| Submodule Subject Origin 03-10 | 44 | 0 | 0 | 44 | 0 |
| Concept Fables 00-02 | 39 | 0 | 39 | 0 | 0 |
| Concept / Mechanism Stories 03-10 | 132 | 0 | 0 | 132 | 0 |
| Website reviewed lens stories | 148 | 0 | 0 | 148 | 0 |
| Website concept fables | 11 | 0 | 11 | 0 | 0 |
| Website narrative / historical cases | 6 | 0 | 6 | 0 | 0 |
| Total | 404 | 0 | 80 | 324 | 0 |

说明:

- 本表的 `PASS / LOCAL EDIT` 不是 publish approval，只表示结构基础可保留。
- 本表没有 `FAIL`，因为多数问题是厚度、模板、source pass 和发布门槛问题，而不是方向完全错误。
- 若按旗舰公开长文标准审，`LOCAL EDIT` 批次需要扩写或重写。

## Common Problems

1. Compact coverage 被当成完成稿。
2. 网站 story 有短正文和模板句复用。
3. 概念寓言长度和分段不稳定。
4. 机制故事缺小例子。
5. 历史类需要 source pass。
6. 移动端阅读上，单段长正文会降低体验。
7. 部分 ending question 没有回到故事核心物件。

## Stories That Can Become Samples

优先保留作为未来样稿基础:

- `三张空白表格` / 元认知
- `没有标签的书架` / 知识地图
- `过不去的窄门` / 阈限概念
- `盖章的空信封` / 资格信号
- `镜子图书馆` / 元认知调节
- `太短的桥` / 最近发展区与支架式教学
- `没有正面的挂毯` / 诠释循环
- `布罗德街水泵`
- `挑战者号发射决策`
- `核边缘的十三天`

这些仍然需要最终单篇 PDC，而不是直接免审发布。

## Highest-Priority Rewrite Queue

1. `script.js` / `public/script.js`: `reviewedLensStoryOverridesZh`
   - 清理重复模板句；
   - 把短正文补成至少 3 个叙事 beat；
   - 保留 IDs 和 routes。

2. `docs/mapkai-submodule-origin-stories-03-10.zh.md`
   - 44 篇 compact 起源页扩写到 Subject Origin 标准；
   - 每篇补足老问题、摩擦、新问题、关键工具/事件。

3. `docs/mapkai-submodule-concept-stories-03-10.zh.md`
   - 98 篇寓言扩成完整寓言；
   - 34 篇机制故事补小例子和边界。

4. `script.js` concept fables
   - 保留现有内容；
   - 改为可分段渲染；
   - 单篇进入 PDC 后再发布为样稿。

5. Historical / health / safety cases
   - 加 source pass；
   - 审核伦理、公共风险、措辞谨慎度。

## Next Step

建议下一步不要“一次性修完 404 个”。应从网站可见内容开始，每批 10-20 篇执行:

`Article Context Card -> Router -> Round 1 PDC -> Blue Whale Brief -> Rewrite Modify V1 -> Round 2 PDC -> Rewrite Modify V2 -> Round 3 Final Gate`

只有完成这个闭环的批次，才能写 `Approved for Publish`。
