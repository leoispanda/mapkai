# MapKAI 与 Toolbox AI 透明度审查

审查日期：2026 年 10 月 11 日。优先更新英语对话的首次 AI 身份提示，随后补充学科总览、思维框架和 DishKAI 缩略图的来源说明。Music、Explore 和节拍器的现有区分可以保留。

范围为 MapKAI 网站及 Toolbox 中自己的项目。用户浏览器的 Toolbox 显示 9 个内置条目，没有额外自定义卡片。此次已更新 About 与其链接的 AI Transparency 中英说明，并修正 PDC 失败处理的旧静态文案；下表列出其余待办。

欧盟《AI Act》第 50 条已于 2026-08-02 适用。应分别判断直接 AI 交互、生成内容披露和提供者的机器可读标记职责。2026/1744 仅将 2026-08-02 前已上市系统的提供者第 50(2) 条义务宽限至 2026-12-02，不能据此推迟访客披露。[欧盟官方 FAQ](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)、[修订法规](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32026R1744)。

并非所有 AI 内容都属于 deepfake。原创 AI 歌曲、插图以及 AI 辅助代码不能仅凭制作工具直接归类。向公众提供公共利益信息的 AI 文本还须判断人工实质审阅、编辑控制和编辑责任例外；自动多模型审查不能证明人工审核。下面的建议同时考虑法规适用与产品表达准确性，不构成完整欧盟合规认证。[第 50 条官方说明](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-50)。

| 次序 | 项目与现状 | 具体待办 |
| --- | --- | --- |
| 先做 | **Speaking Studio**：开始前说明 Gemini 数据处理，但没有直接说明 Kai 是 AI；AI 标签在对话记录中才出现。 | 在开始按钮前明确“你将与 AI 对话伙伴 Kai 交流，声音由 AI 合成”。回顾、历史回顾和导出保留生成方式说明。文字不足时后台返回固定说明，须与 Gemini 生成回顾区分。 |
| 接着做 | **PDC / ChatPDC**：已有 AI 起草和准备案例标签，失败显示错误与重试。 | 补明委员是 AI 模拟的观点角色，并非真人顾问；实际由同一个 Gemini 服务模拟多个视角。保留 Demo 与实际生成结果的区别。 |
| 先做 | **隐私与数据说明**：DATA_MAP 最后更新于 2026-05-22，未完整覆盖后来上线的工具。 | 对照真实流程补齐 Speaking 的 Google Gemini、DishKAI 转发、PDC 会话及 Music 公共媒体处理；核实保存位置与期限后再写入隐私说明。 |
| 接着做 | **11 个学科起源总览**：公开可读，有文献和边界说明；制作方式主要在通用页脚披露。 | 在文章标题附近加入与实际流程对应的来源标签；不能未经逐篇确认直接写“人工审核”。 |
| 接着做 | **思维框架**：故事标为虚构，图解有作者或 MapKAI 综合图解说明；编辑记录证实曾使用 GPT。 | 加简短 AI 辅助编辑说明；继续区分虚构情节、文献依据和综合图解。固定程序绘制 SVG 不应一律称 AI 生成图像。 |
| 接着做 | **DishKAI 菜单助手**：输入、AI 未核实估计和展开大图已有披露。 | 折叠卡片的缩略图附近也标“AI 参考图”，让用户无需展开就能识别；保留过敏原须向餐厅确认的提示。 |
| 保持并补齐 | **学科实验预览视频**：播放前已标 AI 生成、审核中、尚未正式批准；公开目录校验这些状态。 | 补对应中文说明；核实媒体自身标记与导出传播链，避免视频离开网页后失去来源提示。 |
| 保持 | **MapKAI Music**：每首播放前显示 AI 生成及 ElevenLabs，API 存储来源字段。 | 保持现有标签、分享权利提示及原始音频信息；不能用这些字段声称已满足全部机器标记义务。 |
| 保持 | **知识地图、Explore、Quick Mirror、Knowledge Lens**：按浏览器固定规则计算，已有本地结果说明。 | 保持与实时 AI 输出的区别；用户自行复制到外部 AI 的提示不等于 MapKAI 自动发送。 |
| 保持 | **跑步节拍器**：按固定数学规则合成声音，没有模型调用。 | 无需将节拍音轨改标 AI 生成。 |
| 恢复公开前 | **Finance / EMBA 与大多数旧故事**：课程目前有访问门禁；多数旧故事隐藏，不能把它们写成当前匿名访客问题。 | 课程播放器前逐项确认音频、视频来源并披露；恢复故事时加入文章制作方式，核实实际编辑责任。“自动 reviewRounds”不足以证明人工审核。 |
| 独立项目待办 | **Leo 的 Turnpo 个人主页**：公开页展开的页脚仍写“AI assistance is coming soon”，以及资料目前保存在浏览器。公开主页没有实时生成入口；独立仓库已有 owner AI 导入与 OpenAI 后端，Stock PDC 则有访问码门禁。 | 对照生产启用状态修正介绍和保存位置说明。AI 导入入口补明 OpenAI 接收方及实际发送字段；代码还发送姓名、位置和用户名。公开资料展示与 owner AI 工具需分别说明。 |

下一步应建一份系统和媒体来源清单，记录谁是 provider、谁是 deployer、系统首次上市日期、输入输出类型、上游标记方案、对外入口和编辑负责人。自有 PDC、Speaking 等应用是否构成下游 AI 系统提供者，应按实际开发、品牌和投放方式判断，不能简单认为只调用外部模型就仅是 deployer。对源媒体保留已有嵌入标记，并核查转码、导出、下载后是否仍可检测；网页标签、`aiGenerated:true` 或原字节保留都不能单独证明鲁棒机器可读标记义务已满足。[欧盟官方 FAQ 所述的生成内容实践准则](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)是自愿工具，不代表 MapKAI 已签署。

主要证据：

- Toolbox 清单：[toolbox/app.js](/Users/leoyang/Documents/mapkai/toolbox/app.js:5)。
- Speaking 开始前提示：[speaking/index.html](/Users/leoyang/Documents/mapkai/speaking/index.html:13)；回顾与导出：[speaking/app.js](/Users/leoyang/Documents/mapkai/speaking/app.js:120)、[导出](/Users/leoyang/Documents/mapkai/speaking/app.js:273)；固定短对话说明与模型调用：[functions/api/speaking/_summary.js](/Users/leoyang/Documents/mapkai/functions/api/speaking/_summary.js:197)。
- PDC 单一 Gemini 服务：[functions/api/pdc/start.js](/Users/leoyang/Documents/mapkai/functions/api/pdc/start.js:29)；准备案例与生成输出标签：[script.js](/Users/leoyang/Documents/mapkai/script.js:12850)。
- 学科总览标题和来源：[script.js](/Users/leoyang/Documents/mapkai/script.js:18150)；旧故事隐藏开关：[script.js](/Users/leoyang/Documents/mapkai/script.js:46)。
- 框架虚构标签：[toolbox/frameworks/app.js](/Users/leoyang/Documents/mapkai/toolbox/frameworks/app.js:144)；GPT 编辑记录：[编辑记录](/Users/leoyang/Documents/mapkai/review/frameworks/everyday-fables-editorial-2026-09-27.md:5)。
- DishKAI 来源区分与缩略图：[toolbox/dishkai/app.js](/Users/leoyang/Documents/mapkai/toolbox/dishkai/app.js:77)；展开大图说明：[同文件](/Users/leoyang/Documents/mapkai/toolbox/dishkai/app.js:103)。
- 视频预览状态：[functions/api/factory/_public.js](/Users/leoyang/Documents/mapkai/functions/api/factory/_public.js:44)；受保护课程的媒体入口：[课程公开资产](/Users/leoyang/Documents/mapkai/public/learning/corporate-finance/day-1/index.html:45)。
- Music 来源字段：[functions/api/music/_shared.js](/Users/leoyang/Documents/mapkai/functions/api/music/_shared.js:107)；节拍固定合成：[节拍器声音实现](/Users/leoyang/Documents/mapkai/toolbox/metronome/app.js:144)；旧数据清单：[DATA_MAP.md](/Users/leoyang/Documents/mapkai/DATA_MAP.md:3)。
- Turnpo 公开入口：[Leo 的个人主页](https://www.turnpo.com/u/leo)；旧页脚声明：[独立项目 index.html](/Users/leoyang/Documents/turnpo/index.html:397)；owner AI 生成入口：[同文件](/Users/leoyang/Documents/turnpo/index.html:575)；AI 导入及发送字段：[独立项目 script.js](/Users/leoyang/Documents/turnpo/script.js:7181)。

课程门禁后的完整体验、具体用户内容以及上游合同和标记能力，需要相应负责人另行核实。
