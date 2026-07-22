# MapKAI 正式小学科知识寓言工程

## 目标

- 覆盖 MapKAI 当前公开的 80 个正式小学科。
- 每个小学科选择 3 个最核心、最能代表该学科思维方式的 topic 或概念。
- 每个概念创作一篇中文寓言和一篇严格对应的英文版本，共 240 组双语文章。
- 文章通过审核后，放入对应的正式小学科页面。

## 公开文章结构

每篇文章只显示以下结构，不增加其他解释模块：

1. 学科
2. 标题
3. 寓言故事
4. 揭示的概念
5. 概念解释

不在公开正文中显示：隐喻对应、类比边界、反思问题、编辑评论、PDC 审稿记录。

## 写作要求

- 先完整讲完故事，概念名称只在故事之后的“揭示的概念”中出现。
- 必须有具体地点、人物、物件、规则或任务。
- 旧做法起初必须合理，不能把人物写成明显愚蠢。
- 每篇只保留一个主要目标、一个核心冲突和一次自然转折；不为满足结构清单堆叠事故与损失。
- 人物的行动必须来自生计、家人、责任、时间或关系等现实原因，不能只是概念演示。
- 转折通过动作、对话或现场证据发生，不由叙述者替读者总结原理。
- 结尾用一个具体动作收束，不写格言式寓意或强行升华。
- 冲突和反转必须来自概念本身，不能依靠偶然事故硬造戏剧。
- 面向好奇的成年人和高阶学生，清晰但不幼稚，研究生读者仍能看见准确的知识结构。
- 中文寓言故事通常约 700-1000 字，使用 5-7 个可在移动端顺畅阅读的段落；英文通常约 420-620 词，不是摘要，必须与中文在事件、信息、顺序和语气上逐段对应。
- 每篇集中保留一个主要目标、一个有现实理由的错误判断、一条持续升级的冲突、一次有代价的关键选择，以及一个在前文出现过的结尾物件或动作。
- 概念解释中文通常控制在 100-180 字，只负责准确定义、核心机制、主要误区与必要边界，不重复讲述故事。
- 英文保持自然文章质感，不逐字硬译，也不增删情节或论点。
- 正文避免“这说明”“真正重要的是”“他终于明白”等总结句，也避免为了文学感制造金句。

## 批次

- 共 16 批，每批 5 个正式小学科、15 组双语文章。
- `topic-plan.tsv` 是唯一选题总表。
- `batches/batch-XXX.json` 保存通过审核的文章。
- `progress.json` 是唯一续跑记录；恢复任务时先读取它，再从首个未完成批次继续。

## 单篇数据字段

```json
{
  "id": "0011-prerequisite-structure",
  "batchId": "batch-001",
  "categoryCode": "00",
  "fieldCode": "0011",
  "fieldTitle": "Basic programmes and qualifications",
  "fieldTitleZh": "基础课程与资格",
  "title": "English title",
  "titleZh": "中文标题",
  "summary": "One-sentence English teaser",
  "summaryZh": "一句中文简介",
  "storyParagraphs": ["English story paragraph 1", "English story paragraph 2"],
  "storyParagraphsZh": ["中文故事第 1 段", "中文故事第 2 段"],
  "conceptName": "Concept name",
  "conceptNameZh": "概念名称",
  "explanationParagraphs": ["English concept explanation"],
  "explanationParagraphsZh": ["中文概念解释"],
  "mode": "concept-fable",
  "status": "approved",
  "qualityGate": {
    "reviewRounds": 3,
    "rewriteRounds": 2,
    "openCritical": 0,
    "openMajor": 0
  }
}
```

## 审核门槛

- 每篇完成 3 轮压缩 PDC 审核和至少 2 次 Rewrite Modify。
- 批量审核只在内部记录问题状态，不把审稿过程写进网站。
- 检查故事独立性、概念准确性、反转是否成立、抽象雾气、AI 模板感、双语对应、移动端段落长度和公开发布风险。
- 医学、药学、法律、安全等高风险内容必须保持教育性，不给个人诊断、治疗或法律建议；涉及可变或高风险事实时使用权威来源复核。
- 只有 `status: approved` 且 Critical/Major 问题均为 0 的文章才进入网站数据包。
