# 视频工厂领取与续接流程

用户当前指令：先交付已生成的 0222、0223，暂不启动新学科。旧定时任务保持暂停。本次人工指令只覆盖这两个原请求的下载、核验、上传和既有标注预览；不延长昨夜窗口，不重发 Creator、Reviewer 或 Notebook 请求。

## 当前真实入口

本聊天执行入口是 heartbeat / 人工指令进入 Codex，再运行 `overnight-window-20261018.py`，而不是旧 major-fields runner。入口现已接入 `continuation_control.py`。默认调用仍返回昨夜窗口 `EXPIRED`，不会放宽历史窗口。

本次原请求交付前，每次副作用调用：

```sh
python3 review/video-factory-hourly-20261012/overnight-window-20261018.py --continuation --code 0222 --request-id 0222-3e9ff072-ba2a-400e-b04a-4136a679f426 --action upload
```

只认 `manual-continuation-20261019.json` 里固定的两个原 attempt 及四种动作。调用方须解析 JSON 的 `productionAllowed`，拒绝或命令异常即停止，不以进程退出码 0 推断授权。固定范围交付执行器仍核对真实源稿、对象键、字节、共享锁、预算和公开边界；此入口不能替代它们。完成这次人工任务后，将授权记录 `state` 关闭；后续 heartbeat 不能把该文件当作新一轮授权。

## 领取和续接分开

未来恢复新学科须有新的排程授权。整点入口只领取本小时尚未服务的名额；仍须真实共享资源原子锁、每日最多 18 次、每小时最多 2 次、平台限额和授权截止检查。已服务小时不重复，错过小时不补跑。独立 `claim_slot_decision` 已测试这些条件，但本次 `claimNewSubjects:false`，不执行领取，也没有启动新调度。

续接原请求不读取 `nextScheduledLocal` 作阶段门槛。取得真实结果后，在同一活动执行中立即进入下一步：已完成原片 → 下载 → 技术与隐私核验 → 私有上传和远端哈希 → 部署 / 标注预览 → 匿名播放器核验。源稿、视频、人工审核分别保留真实结论。

等待时只保存身份、原请求、阶段和最后真实状态，不重复读知识正文。用小型实际观察文件运行 `--continuation ... --plan --observation <file>`，阶段枚举见模块的 `NEXT_ACTION`：可推进阶段返回 `nextDelaySeconds:0`；平台仍处理中返回最多 60 秒后仅核对原请求状态，并释放不必要的共享写作锁。未知发送结果优先恢复原接收回执，永远不返回重发动作。登录、验证码、额度、实际占锁等保存具体原因，不空转重读大材料。

这是活动 Codex 回合的续接决策，不是新建后台服务。浏览器没有获准的真实完成信号时，用每次不超过 60 秒的低成本等待检查；结果就绪后立即续接，检测延迟上限取决于检查间隔。若活动回合结束或工具不可用，则必须记录需要新的实际触发，不能声称一个未运行的 worker 会继续。当前 automation 暂停，不能为了轮询擅自恢复它。

## 验证

```sh
python3 -m unittest discover -s review/video-factory-hourly-20261012 -p test_continuation_control.py
```

覆盖真实入口接线、默认窗口仍过期、两个原 attempt 与动作白名单、授权关闭 / 扩展拒绝、结果不明不重发、阶段立即续接、轻量等待、整点领取的防重复 / 防补跑 / 截止 / 额度 / 共享资源条件。测试不操作浏览器、外部账号、队列或锁。
