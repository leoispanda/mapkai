# 题库规范修改示范候选

日期：2026-10-02。以下仅为两道示范候选，帮助检查题库规则是否可落实；尚未替换正式题库，也不代表 20 道探索题或 132 道知识题已完成修改。

知识题要求在题干明示的条件下有唯一正确答案。错误选项可以对应真实的误解，但不能靠增加题外条件变成本题的另一正确答案。探索题可以有多个合理调查入口，必须明确问读者想先调查什么，不把选择判成事实上的正确原因。

## 示范一：把能力标签改成可计算的单位价格题

来源：`map-132-current.json` 中的 `00-q1`。旧题问 Emma 按每公斤价格比较麦片时用到了什么能力。正确选项比其他选项更长、带有正面评价；读者还没有实际进行单位价格比较。

候选学习目标：把包装重量换算为公斤，求每公斤价格，避免把一包的售价直接当成单位价格。

### 中文候选

超市有两包麦片：A 包 600 克，售价 3.60 欧元；B 包 900 克，售价 4.95 欧元。标价就是结账价。要按每公斤价格比较，B 包的单位价格应写成多少？

| 选项编号 | 选项 |
| --- | --- |
| opt-1 | 4.95 欧元／公斤 |
| opt-2 | 5.50 欧元／公斤 |
| opt-3 | 6.00 欧元／公斤 |

正确答案：`opt-2`。

解析：900 克等于 0.9 公斤，因此 B 包每公斤价格为 4.95 ÷ 0.9 = 5.50 欧元。4.95 欧元是一整包的售价，没有换算重量；6.00 欧元是 A 包的单位价格，3.60 ÷ 0.6 = 6.00。比较后可知 B 包每公斤便宜 0.50 欧元。

### English candidate

A supermarket sells two packs of cereal. Pack A weighs 600 g and costs €3.60; Pack B weighs 900 g and costs €4.95. The listed prices are the checkout prices. To compare the price per kilogram, what unit price should you use for Pack B?

| Option ID | Option |
| --- | --- |
| opt-1 | €4.95 per kilogram |
| opt-2 | €5.50 per kilogram |
| opt-3 | €6.00 per kilogram |

Correct answer: `opt-2`.

Explanation: 900 g is 0.9 kg, so Pack B costs €4.95 ÷ 0.9 = €5.50 per kilogram. €4.95 is the price of the whole pack without adjusting for weight. €6.00 is Pack A’s unit price: €3.60 ÷ 0.6 = €6.00. Pack B therefore costs €0.50 less per kilogram.

### 候选自检

- 三个选项都是价格，单位、语法结构和长度相近；正确项没有额外解释或褒义词。
- 两个错误项各有清楚来源：漏做单位换算，以及取错包装的数据。
- 无需假设品牌、质量、折扣或读者偏好。本题只问数值，不问综合购买决策。
- 遮住选项仍可计算出 5.50 欧元／公斤。任意调换显示位置不会改变正确答案。
- 中文和英文使用完全相同的重量、价格、任务与答案。
- 解析中的比较结论可核算：6.00 − 5.50 = 0.50。

## 示范二：把因果判断改成调查入口选择

来源：`explore-20-current.json` 中的 `lens-001`。旧题问“为什么很多人知道要少刷手机，却还是停不下来”，四个选项分别给出平台、反馈、疲惫和替代休息方面的原因。题干没有提供能区分这些原因的观察；它们也可能同时出现。

候选用途：记录读者这一次比较想先了解哪类信息。无正确答案，不据此认定真实原因或长期人格特征。

### 中文候选

朋友想弄清自己为什么经常刷手机超过原定时间。你们可以先收集一类记录。你比较想从哪一项开始？

| 选项编号 | 选项 |
| --- | --- |
| opt-feed | 记录有无自动连播时，每次使用的时长。 |
| opt-patterns | 记录每次使用的时长，查看它们如何分布。 |
| opt-energy | 记录使用前的疲惫程度，以及每次使用时长。 |
| opt-alternatives | 记录休息时有哪些替代活动，以及最后选了什么。 |

另提供“暂时没有偏好／跳过”，不算作上述四个选项之一。

### English candidate

A friend wants to understand why they often scroll longer than planned. You can begin by collecting one type of record. Which would you prefer to look into first?

| Option ID | Option |
| --- | --- |
| opt-feed | Record session length with autoplay on and off. |
| opt-patterns | Record session lengths and examine their distribution. |
| opt-energy | Record tiredness before each session and how long the session lasts. |
| opt-alternatives | Record other available ways to rest and which activity they choose. |

Also offer “No preference yet / Skip” outside the four options.

### 选项映射与反馈边界

| 选项 | 本次调查入口 | 中文反馈示例 | English feedback example |
| --- | --- | --- | --- |
| opt-feed | 数字系统设计：06 | 你这次想先查看自动连播与使用时长的记录。这个选择说明了你的调查入口；记录结果仍需检查，才能判断它在这个人的使用中起了什么作用。 | This time, you chose to examine autoplay and session length. That identifies your starting point; the records still need to be checked before drawing conclusions about its role in this person’s use. |
| opt-patterns | 数量分布与统计描述：05 | 你这次想先查看使用时长的分布，例如多数记录落在哪个范围。这可以帮助描述记录中的变化，但不能单独解释为什么使用变长。 | This time, you chose to examine the distribution of session lengths, such as the range containing most sessions. That can describe variation in the records, but cannot by itself explain why sessions became longer. |
| opt-energy | 健康与恢复状态：09 | 你这次想先查看疲惫程度与使用时长的记录。记录可能提示进一步调查的方向；仅凭选择不能认定疲惫就是原因。 | This time, you chose to examine tiredness and session length. The records may suggest a direction for further investigation; the choice alone does not establish tiredness as the cause. |
| opt-alternatives | 可选休息体验：10 | 你这次想先查看可选休息活动与实际选择。这个选择没有证明朋友缺少其他活动，也不能说明你长期属于某一种人格。 | This time, you chose to examine available ways to rest and the activity selected. The choice does not establish that your friend lacks alternatives or identify a lasting personality type. |

四个映射用于标记调查内容，不是经验证的心理测量结论。反馈范围只限本次选择。若用户选择跳过，反馈应说明暂时没有选择记录。

### 候选自检

- 四个选项都提出可观察的调查动作，处在同一选择层级；没有一个选项声称已经知道真实原因。
- 四项可以同时有价值，本题允许这种情况，因为询问的是先从哪里了解，不是唯一因果解释。
- 每个选项都保留不同的调查内容，而不是把所有选择写成抽象的性格或领域标签。
- 不把“选择某项”推断为“擅长该领域”，也不把“未选某项”推断为“盲区”。
- 不宣称随机调查一次即可证明因果；后续还需考虑记录质量、混杂因素与重复性。

## 反例审查：原 05-q1 的题设缺口

原题：“同一个早晨，金属长椅摸起来比木椅冷。为什么？”原选项为“木头偷偷发热”“金属一定温度更低”“金属更快带走你身体的热量”。

审查约束：只使用题干给定的事实。不能自行补上“两把椅子温度相同”“都在阴影里”“此前都没有人坐过”等条件。

| 原选项 | 题干能否支持它？ | 审查结果 |
| --- | --- | --- |
| 木头偷偷发热 | 没有给出木椅正在产热的证据。 | 这是容易排除的荒诞干扰项，没有清楚对应的常见误解。 |
| 金属一定温度更低 | “同一个早晨”不意味着两把椅子同温，也没有给出测温结果。“一定”更无法从材料名称推出。 | 此选项的绝对表述不成立；但题干也没有排除两把椅子实际温度不同的可能。 |
| 金属更快带走你身体的热量 | 原题没有给出两椅表面温度、皮肤温度或接触条件，无法仅凭题干确认具体原因。 | 它表达了拟考查的导热解释，但读者必须补入未明示的条件才能把它确定为本题原因。 |

结论：这不是证明原题“三项都正确”。问题是原题让读者猜作者默认的实验条件，而且干扰项过弱。不能因为另两项容易排除，就认为正确项已经得到充分支持。

修复方向：明示两把长椅均为干燥表面、已经测得相同温度，例如 20°C；同一人的手温高于该温度，接触条件相近。随后只问为什么金属表面接触时通常感觉更冷，并用同层级、可区分的传热解释作为选项。正式改题时还应复核材料与接触条件，不用“金属一定更冷”作为偷懒的错误项。

这一方法推广到其他知识题：逐一尝试为每个选项辩护，标记辩护是否增加题外条件。若正确答案也需要额外条件，补题干；若固定条件下另一选项同样成立，改选项或改成允许多种答案的题型。

## 上线前的处理边界

这些候选加强了原题的学习操作，并改变了原题直接要求用户做的判断。发布时需决定是否分配新题目 ID 并退役旧版，不能让旧版作答自动充当新版的完成或理解证据。此文件中的 `opt-*` 是示范选项编号，尚未接入正式题目与计分逻辑。
