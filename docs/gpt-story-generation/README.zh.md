# MapKAI GPT Story Generation Inputs

这组文件是从现有网站内容自动导出的 GPT 输入包，用来让 GPT 负责正文生成，Codex 负责校验、导入、排版和 push。

- 总条目数：165
- batch 数：17
- 每批最多：10

## 使用方式

1. 打开 `mapkai-gpt-story-master-prompt.zh.md`，把整段主提示词复制给 GPT。
2. 再复制一个 `batch-XXX.json` 的完整内容给 GPT。
3. 让 GPT 只返回 JSON。
4. 把 GPT 返回的 JSON 发回 Codex。
5. Codex 会校验字段、扫描禁用句式、写入网站文件、验证并按你的要求 push。

## 文件说明

- `manifest.json`：导出总览和每个 batch 的条目数量。
- `batch-001.json` 等：真实故事输入，每条包含 id、原正文、知识点、事实材料、mode hint。

注意：这些输入不等于外部来源核查。历史类故事如果需要公开发布级别的事实安全，GPT 应该在 `sourceWarnings` 中保留 source check 风险，而不是硬编。
