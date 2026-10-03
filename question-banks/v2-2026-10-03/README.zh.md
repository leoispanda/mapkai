# MapKAI 新版题库 v2

生成日期：2026年10月3日。依据项目 Principles v3。

两套完整双语候选已完成编辑复审，原题库保留。当前尚未接入网站、未做真实用户试答。

## 阅读题目

- [20道探索题：调查视角8题、任务选择12题](explore-20.zh-en.md)
- [132道知识题：11领域，每科12题，附答案和解析](map-132.zh-en.md)
- [覆盖蓝图](blueprint.zh.md)
- [编辑复审与新旧指标](quality-review.zh.md)
- [事实核对来源](sources.zh.md)

新版把猜原因改成具体调查选择，任务题给出相近的支持、时间与先后条件；知识题补齐判定条件，改掉凑数和形式提示，解析说明证据与机制。20题结果仍只描述本轮选择；132题只反映涉及的具体知识。

“总选最长”的命中题数由旧版中文119/132、英文104/132，降为新版42/132、44/132。该指标用于编辑排查；没有据此宣称实测有效。

## 接入文件

- 知识题：[map-132.json](map-132.json)；记录：[editorial-knowledge.json](editorial-knowledge.json)
- 探索题：[explore-20.json](explore-20.json)；记录：[editorial-explore.json](editorial-explore.json)
- [接入与版本边界](integration-notes.zh.md)；[版本清单](manifest.json)

parts保存最终作者源与修改后的内容，review保存不带答案的初审材料、独立解题、意见、修订和复核证据。assemble.py只生成候选导出，不改网站；refine脚本是分阶段编辑记录，继续维护以当前parts为准，不将早期写作脚本直接重跑覆盖终稿。

本版作为独立候选资料交付至 [MapKAI 仓库](https://github.com/leoispanda/mapkai)。提交与推送状态以 Git 记录为准；网站接入另行执行。
