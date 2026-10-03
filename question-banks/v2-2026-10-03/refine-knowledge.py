"""Apply recorded editorial revisions to one completed review group."""
import copy
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
suffix = sys.argv[1]
path = ROOT / 'parts' / f'map-{suffix}.json'
record_path = ROOT / 'parts' / f'editorial-{suffix}.json'
items, records = json.loads(path.read_text()), json.loads(record_path.read_text())
qs, rs = {q['id']: q for q in items}, {r['id']: r for r in records}
changes = []


def revise(qid, zh_question=None, en_question=None, zh_options=None, en_options=None,
           answer_index=None, zh_explanation=None, en_explanation=None,
           distractors=None, evidence=None, concept=None, objective=None, operation=None, reason=None):
    q, r = qs[qid], rs[qid]
    before = copy.deepcopy(q)
    ai = q['zh']['options'].index(q['zh']['answer']) if answer_index is None else answer_index
    for lang, question, options, explanation in [
        ('zh', zh_question, zh_options, zh_explanation),
        ('en', en_question, en_options, en_explanation),
    ]:
        if question is not None:
            q[lang]['question'] = question
        if options is not None:
            q[lang]['options'] = options
            q[lang]['answer'] = options[ai]
        if explanation is not None:
            q[lang]['explanation'] = explanation
    r['answerOptionId'] = r['optionIds'][ai]
    if distractors is not None:
        r['distractors'] = [{'optionId': r['optionIds'][i], 'error': err, 'whyNot': why}
                            for i, err, why in distractors]
    if evidence:
        r['answerEvidence'] = evidence
    if concept:
        r['concept'] = concept
    if objective:
        r['objective'] = objective
    if operation:
        r['cognitiveOperation'] = operation
    r['revisionReason'] += ' 独立复审或主编辑复查后：' + reason
    r['status'] = 'independent-review-completed / revisions-awaiting-recheck'
    if before != q:
        changes.append({'id': qid, 'reason': reason, 'before': before, 'after': copy.deepcopy(q)})


if suffix == '08-10':
    revise('08-q2',
        zh_question='一块湿土被重型拖拉机碾过，轮迹里的土更密实，雨水渗入也更慢。哪个变化最直接解释入渗变慢？',
        en_question='Heavy tractor traffic leaves wet soil denser, and rainwater infiltrates more slowly. Which change most directly explains the slower infiltration?',
        reason='移除题干直接给出的大孔隙答案，保留压实与入渗条件，要求使用机制。')
    revise('08-q3',
        zh_question=qs['08-q3']['zh']['question'].replace('它能在番茄、马铃薯上繁殖', '它能在本题给出的各番茄品种及马铃薯上繁殖'),
        en_question=qs['08-q3']['en']['question'].replace('It reproduces on tomatoes and potatoes', 'It reproduces on every tomato variety offered here and on potatoes'),
        reason='明确候选番茄品种仍是寄主，排除未说明的抗性品种解释。')
    revise('08-q6',
        zh_question='一片拥挤的人工林中，主要树木周围有许多邻树。管理者保留主要树木，选择性移除部分邻树，天气和土壤条件暂不变。这最直接通过哪种机制改善保留树对光和水的获取？',
        en_question='In a crowded plantation, the main trees have many neighbors. Managers retain the main trees and selectively remove some neighbors, with weather and soil conditions unchanged. Which mechanism most directly improves the retained trees’ access to light and water?',
        zh_options=['减少邻树对光和水的竞争', '减少保留树对光和水的需求', '增加保留树所受的林冠遮阴'],
        en_options=['Reducing neighbors’ competition for light and water', 'Reducing retained trees’ need for light and water', 'Increasing canopy shade over the retained trees'],
        zh_explanation='邻树减少，共同争夺光和水的树木也减少，保留树可获得更多资源。获取条件改善不等于它们自身的需求下降；移除邻树也不是增加林冠遮阴。这里限定人工林目标，不能推出所有小树都应移除。',
        en_explanation='Fewer neighboring trees compete for the same light and water, improving access for retained trees. Better access does not mean those trees need less of these resources, and removing neighbors does not increase canopy shade. This plantation goal does not imply that small trees should always be removed.',
        distractors=[(1,'把资源可得性改善混同为生理需求降低','题干改变邻树密度，未改变保留树本身的需求。'),(2,'把间伐与林冠遮阴增加混同','移除邻树减少相关竞争和遮挡，不是增加遮阴。')],
        evidence='天气、土壤和保留树不变，改变的是相邻竞争者数量。',
        reason='把遗传和降雨凑项换成同属光水获取机制的常见混淆，并不在题干先写出竞争答案。')
    revise('09-q1',
        zh_options=['保持轻柔力度，只清洁前牙牙面', '保持轻柔力度，清洁各个牙面', '增加刷牙力度，清洁各个牙面'],
        en_options=['Use gentle pressure and clean only front-tooth surfaces', 'Use gentle pressure and clean each tooth surface', 'Use stronger pressure and clean each tooth surface'],
        distractors=[(0,'把看得见的前牙当成全部牙面','只清洁前牙不满足完整覆盖。'),(2,'把增加力度当成提高清洁质量','题干要求轻柔清洁，不能用加强力度替代。')],
        reason='删除刷到出血的明显凑项，让三项分别比较力度和牙面覆盖。')
    revise('09-q9',
        zh_question='活动应用要鼓励规律活动，也允许用户按已获得的专业建议休息。产品希望这两种情况都能继续积累“连续照护”记录。用户可标记“按专业建议暂停”。哪个规则同时保留这类连续记录，并避免诱导用户违反休息建议？',
        en_question='An activity app encourages regular activity and allows rest based on professional advice a user has already received. It wants both situations to count toward a continuous care record. A user can mark “pause as professionally advised.” Which rule preserves that care streak without encouraging activity against the advice?',
        zh_options=['暂停日仍须完成运动量，才能保留连续记录', '暂停日可登记休息安排，保留连续照护记录', '暂停日保留历史记录，但中断连续照护计数'],
        en_options=['Require the usual activity target on pause days to keep the streak', 'Log advised rest on pause days and keep the care streak', 'Keep the history on pause days but break the care streak'],
        distractors=[(0,'用同一运动量要求维持照护连续性','这会诱导违反已有休息建议。'),(2,'把保留历史与持续照护计数等同','保留历史但中断计数，未满足题干对两种照护行为的连续记录目标。')],
        evidence='两个目标明示为保留连续照护记录，以及遵守已有休息建议。',
        reason='把删除全部历史凑项换成合理的保留历史但中断计数规则，并明确连续照护的产品目标。')
    revise('10-q4',
        zh_options=['在进入处理通道前完成准备', '在处理通道出口外完成检查', '在处理通道入口前增加座椅'],
        reason='中文也明确出口外，与英文条件对齐；各项同为直接流程动作。')
    revise('10-q12',
        zh_question='活动入口的书面路线把访客引向东侧大厅，广播却说活动在西侧大厅；两处各自清楚，但访客不断折返。为了消除这项矛盾，最应联合核对哪一组内容？',
        en_question='An event’s written entrance directions send visitors to the east hall, while the announcement says the event is in the west hall. Each is individually clear, but visitors keep turning back. Which pair of aspects should be checked together to resolve this conflict?',
        zh_options=['书面路线与位置广播的内容', '书面路线的文字字号和排版', '位置广播的播音音量和速度'],
        en_options=['The content of written directions and venue announcements', 'The text size and layout of the written directions', 'The volume and speaking pace of venue announcements'],
        distractors=[(1,'把书面信息更清晰当成内容一致','两处已各自清楚，字号和排版不能修正方向矛盾。'),(2,'把广播更易听清当成内容一致','提高可听清程度不能让东侧与西侧两条方向相同。')],
        reason='用同一到达任务中的内容、书面清晰和播音清晰作比较，删除价格与音乐无关凑项。')

elif suffix == '04-07':
    revise('04-q9',
        zh_question='某公司的虚构审批要求把“不超过500元”称为低额：低额标准用品订单要当天通过；高额或非标准用品必须经理审批，允许等待经理处理。经理当天无法处理。哪项规则同时满足要求？',
        en_question='A fictional policy defines small orders as no more than 500 yuan. Small standard-supply orders must be approved that day; larger or nonstandard orders require the manager and may wait for that review. The manager is unavailable today. Which rule meets both requirements?',
        reason='定义低额包含500，明确其他订单可等待经理，消除边界与时间解释。')
    revise('05-v2-q07',
        zh_question='两室用一张“水能通过、糖不能通过”的膜隔开，温度相同，膜两侧初始压力相同。一侧是1%糖溶液，另一侧是5%同种糖溶液。刚开始时，水的净移动方向是什么？',
        en_question='Two chambers are separated by a membrane that lets water through but not sugar. Temperature and initial pressure at both sides of the membrane are equal. One side contains 1% sugar and the other 5% of the same sugar. What is the initial net direction of water movement?',
        reason='明示初始两侧压力相同，不用同液面代替决定渗透方向的压力条件。')
    revise('06-q5',
        zh_question='虚构顾客表有两行：顾客ID7、姓名林；顾客ID7、姓名陈。订单按顾客ID关联，当前ID7不能唯一指向一人。若修改顾客ID，订单也会同步写成实际所属顾客的新ID。哪项顾客表修改能消除重复指向？',
        en_question='A fictional customer table has two rows: ID 7, name Lin; ID 7, name Chen. Orders link by customer ID, so ID 7 points to two people. If IDs change, each order will also be updated to its actual customer’s new ID. Which customer-table change removes the duplicate link?',
        zh_options=['给两名顾客分配不同的ID', '给两名顾客设置相同的姓名', '把两名顾客按姓名顺序排列'],
        en_options=['Assign different IDs to the two customers', 'Assign the same name to the two customers', 'Arrange the two customers in name order'],
        reason='共同的订单关联更新放入题干，三项只比较同层级顾客表修改，取消正确项双操作详长提示。')
    revise('06-q6',
        zh_question='虚构发票程序恰好在“金额不超过500元，并且已记录收货”两项同时满足时自动批准，没有其他条件。哪项逻辑条件与这个程序完全等价？',
        en_question='A fictional invoice program automatically approves exactly when both conditions hold: the amount is no more than 500 yuan and receipt is recorded. There are no other conditions. Which logical condition is fully equivalent to this program?',
        evidence='恰好批准金额≤500且已收货的集合；<500遗漏500，或者则包含不符合者。',
        reason='明确充分且必要及完全等价，排除仅满足必要限制的<500也可成立的解释。')
    revise('04-q6',
        zh_options=['通话少于三分钟的件数', '七天内无同问题再来电的件数', '每天接听全部电话的件数'],
        en_options=['The count of calls lasting under three minutes', 'The count of cases with no same-issue repeat call in seven days', 'The count of all calls answered each day'],
        reason='三项都用指标名称，不给正确项追加奖金动作及长因果句。')
    q = qs['05-q3']
    eo = list(q['en']['options'])
    eo[1] = 'Yes, because both the smoothie and sleep changes were recorded'
    revise('05-q3', en_options=eo, reason='英文第二干扰项也保留两种变化均记录的推理，与中文等义。')
    revise('06-q1',
        zh_question='某软件更新说明写道：“修补一个允许未授权账户读取文件的访问检查漏洞。”只根据这条说明，这次更新直接改进了哪项保护？',
        reason='消除修补会让未授权读取的句法误读。')
    revise('06-q3',
        zh_options=['只按姓名排序姓名列', '按姓名排序整行记录', '只按姓名过滤部分行'],
        en_options=['Sort only the name column by name', 'Sort whole records by name', 'Filter some rows by name'],
        reason='选项使用同层级简明操作，不让正确项独占多步说明。')
    revise('07-v2-q05',
        zh_options=['在玻璃外侧设置覆盖它的遮阳板', '在玻璃内侧设置覆盖它的遮阳帘', '用透明双层玻璃替换原来的玻璃'],
        en_options=['An exterior shade covering the glass', 'An interior blind covering the glass', 'Clear double glazing replacing the glass'],
        zh_explanation='外侧遮阳在太阳辐射到达玻璃前就形成遮挡；内侧帘遮挡的是已穿过玻璃的部分。透明双层玻璃可影响传热，却不是在玻璃前遮住直射阳光。本题只比较这条辐射路径，完整设计还需考虑采光、季节和通风。',
        en_explanation='Exterior shading blocks direct sunlight before it reaches the glass. An interior blind acts after sunlight has passed through the glass. Clear double glazing can alter heat transfer but is not a shade in front of the glass. The question concerns this radiation path; a complete design also considers daylight, seasons and ventilation.',
        distractors=[(1,'把室内遮阳等同于窗前阻挡','室内帘位于玻璃之后，不满足穿过玻璃前的目标。'),(2,'把隔热玻璃等同于外侧遮阳','透明玻璃不是在入射玻璃前截断直射路径的遮挡设施。')],
        evidence='明示目标是在直射辐射穿过玻璃之前形成遮挡。',
        reason='用三种实际窗户方案比较辐射路径，移除风扇和墙画凑项。')
    revise('06-v2-q11',
        zh_question='某账户要同时验证“知道的秘密”和“持有的验证器”两种不同因素。固定密码属于前者；只有已登记的手机验证器能生成该账户的一次性码，属于后者。哪项登录规则符合要求？',
        en_question='An account requires two distinct factors: a secret the user knows and an authenticator the user possesses. A fixed password is the first kind; a one-time code generated only by the registered phone authenticator is the second. Which login rule meets this requirement?',
        zh_options=['固定密码加再次输入同一密码', '固定密码加手机验证器的一次性码', '固定密码加另一个不同的固定口令'],
        en_options=['A fixed password plus entering the same password again', 'A fixed password plus a code from the phone authenticator', 'A fixed password plus a different fixed passphrase'],
        zh_explanation='密码验证知道的秘密，手机验证器码验证对已登记验证器的持有，二者属于不同因素。两个固定口令或重复同一密码都仍只验证知道的秘密。多因素认证要区分因素种类，不只是增加输入次数；这个简化例子不保证抵挡所有攻击。',
        en_explanation='The password verifies a known secret; the registered authenticator code verifies possession of that authenticator. Repeating a password or adding another fixed passphrase still tests only known secrets. Multifactor authentication concerns distinct factors, not merely extra entries. This simplified example does not guarantee protection against every attack.',
        distractors=[(0,'把重复输入当成独立因素','同一密码仍只属于知道的秘密。'),(2,'把两个秘密当成两类因素','两个固定口令都属于知道的秘密，没有验证持有的设备。')],
        evidence='题干给出两个不同因素的定义；密码与已登记手机验证器码分别属于一类。',
        objective='按因素类型比较双因素与重复秘密的登录规则', operation='应用',
        reason='从复述缺少哪项改为比较不同因素的组合，区别于条件程序题。')
    rs['06-v2-q11']['factSources'].append({'url':'https://pages.nist.gov/800-63-4/sp800-63/model/',
        'title':'NIST SP 800-63-4 — Digital Identity Model, Authentication and Authenticator Management',
        'checkedAt':'2026-10-03', 'supports':'同类秘密重复仍属单因素；多因素需要不同种类，设备认证器中的密钥可验证持有。'})
    rs['04-v2-q04']['concept'] = '同预算订单产出与转化率'
    rs['04-v2-q04']['cognitiveOperation'] = '比较'
    rs['04-v2-q04']['difficultyReason'] = '区分同额预算订单产出与触达后转化率，计算不复杂。'

elif suffix == '00-03':
    revise('01-q3',
        zh_options=['合上笔记写出要点，再对照原文。', '看着笔记把要点再抄写一遍。', '看着笔记给要点做标记并朗读。'],
        en_options=['Write the key points with the notes closed, then compare.', 'Copy the key points again while looking at the notes.', 'Mark and read key points aloud while looking at the notes.'],
        distractors=[(1,'把抄写熟悉感当成无提示回忆','抄写时保留原文，不检验无法回忆的内容。'),(2,'把看原文的识别流畅性当成提取','标记朗读仍由原文提示，不能直接检验离开资料后的回忆。')],
        reason='使用可信的抄写、标记朗读学习方式作干扰，删除颜色与朗读速度凑项。')
    revise('01-q6',
        zh_question='初学者要自己写一段说明文。教师想提供可用的结构参考，但不代写这次练习。哪份材料同时符合要求？',
        en_question='A beginner must write an explanatory paragraph independently. The teacher wants to provide a usable structural reference without writing this practice response for the learner. Which material meets both requirements?',
        zh_options=['这次练习的完整全文，供他直接复制提交。', '带结构批注的范例，另给题目由他自己写。', '两页题材背景资料，供他自行寻找结构。'],
        en_options=['The full response to this task, for the learner to copy and submit.', 'An annotated structural example and a separate prompt to write independently.', 'Two pages of topic background, for the learner to find a structure.'],
        zh_explanation='批注范例展示组织结构，另一题仍由学员独立写作。直接复制全文不留下独立任务；只给背景资料则没有提供指定的结构参考。范例和练习承担不同作用。',
        en_explanation='The annotated example shows the structure, while the separate prompt remains an independent writing task. Copying a complete response removes that task; topic background alone does not supply the requested structural reference. The example and practice serve different roles.',
        distractors=[(0,'把完整代写当成支撑独立写作','复制提交没有留下自己完成的练习。'),(2,'把题材资料当成结构范例','背景资料没有给出题干要求的结构参考。')],
        evidence='一个带批注的结构范例加一个独立练习题，分别满足提供参考与保留独立任务。',
        reason='独立任务改为一段并明确范例与另题练习，消除两段要求未被满足的问题。')
    revise('01-q7',
        zh_question='学员会用“价格÷数量”比较食品单位价。要检查他能否把同一原理用于食品之外的领域，下面哪项任务最符合目标？',
        en_question='A learner can use price divided by quantity to compare food unit prices. To check whether they can apply the same principle outside the food domain, which task best meets the goal?',
        reason='明确跨食品领域迁移，不把新麦片也可解释为新情境的第二答案留在题干里。')
    revise('01-v2-q09',
        zh_options=['播放结束时，对自己掌握程度的评分。', '播放过程中，跟读视频字幕的完成比例。', '一周之后，不看资料解释要点的结果。'],
        en_options=['A self-rating of mastery immediately after the video.', 'Subtitle-following completion during the video.', 'An unaided explanation of key points one week later.'],
        zh_explanation='目标同时包含“一周后”和“不看资料解释”，延后独立解释才按这两个条件测量。自信和跟读可以记录，但不能代替指定的独立表现。',
        en_explanation='The target includes both a one-week delay and an explanation without notes. A delayed unaided explanation measures those conditions. Confidence and subtitle-following can be recorded but do not replace the required independent performance.',
        reason='英文统一成表现指标名词短语，中文也明确解释而不是仅复述。')
    q = qs['02-v2-q08']
    revise('02-v2-q08',
        zh_question=q['zh']['question'].replace('她想亲手归还钥匙', '她想亲手把钥匙还给房主'),
        en_question=q['en']['question'].replace('She wants to return a key in person', 'She wants to return a key to the owner in person'),
        reason='保留幕明确接收对象，删除搬走幕只移除改用回收盒的原因，不同时丢失归还对象。')
    revise('02-v2-q09',
        zh_options=['眼前是1690年复制品，原作制于1950年。', '眼前是1950年复制品，原作制于1690年。', '眼前是1690年原作，1950年制有复制品。'],
        en_options=['This object is a 1690 copy of a 1950 original.', 'This object is a 1950 copy of a 1690 original.', 'This object is the 1690 original; a copy was made in 1950.'],
        reason='所有选项明确指称眼前物件，排除第三项被读成只先介绍原作的另一个准确标签。')
    revise('01-v2-q12',
        zh_question='两人上了同一个课程。要比较他们把方法用在新情境的表现，并让两人面对同样任务难度和评分标准，哪项评估最符合目标？',
        en_question='Two people took the same course. You want to compare their use of the method in a new context, giving them the same task difficulty and scoring criteria. Which assessment best meets this goal?',
        zh_options=['两人解决同样的新案例，用同一标准评分。', '两人解决难度不同的新案例，用同一标准评分。', '两人复述同样的课堂旧案例，用同一标准评分。'],
        en_options=['Give both the same new case and use the same scoring criteria.', 'Give them new cases of different difficulty and use the same scoring criteria.', 'Ask both to retell the same old classroom case and use the same scoring criteria.'],
        zh_explanation='相同新案例要求迁移，且两人面对同样任务和评分条件。难度不同的新案例不能按本题要求直接比较；复述旧案例虽条件相同，却没有检验新情境应用。',
        en_explanation='The same new case tests transfer under matching task and scoring conditions. Different-difficulty cases do not meet the stated comparison requirement. Retelling an old case keeps conditions matched but does not test application in a new context.',
        distractors=[(1,'把统一评分当成统一任务条件','案例难度不同，不满足同等任务难度。'),(2,'把熟悉案例复述当成迁移','同一旧案例没有新情境应用。')],
        evidence='两个条件是新情境应用、同样任务难度与评分标准，只有同一新案例同时满足。',
        reason='增加不同难度新案例的实质干扰项，检验迁移评估条件而非仅辨认迁移。')
    revise('02-q12',
        zh_options=['周围线条围成的人形空白。', '人物轮廓内部的明暗细节。', '庭院植物本身的颜色变化。'],
        en_options=['The human-shaped empty space bounded by surrounding lines.', 'The light-and-dark details inside the figure’s outline.', 'The colour changes within the garden plants themselves.'],
        distractors=[(1,'把正形内部的塑造细节当成线索','人形空白没有上色或细节，不靠内部明暗塑形。'),(2,'把植物的颜色当成人形轮廓来源','题干的直接人形线索是周边线条围成的空白。')],
        reason='用同属视觉构图的线索作干扰，删除作画日期无关项。')
    revise('03-q9',
        zh_question='一项调查要了解所有曾经付费用户的体验，包括仍付费和已离开者。目前只从仍付费名单抽样；两类完整名单都可使用。哪项抽样调整把目标人群的两类人都纳入抽样机会？',
        en_question='A survey aims to understand all former or current paying users, including those still paying and those who left. It currently samples only the still-paying list; complete lists of both groups are available. Which change gives both target groups a chance of selection?',
        zh_options=['从全部曾付费名单中随机抽样。', '从仍付费名单中增加随机样本。', '只从已经离开名单中随机抽样。'],
        en_options=['Sample randomly from the full list of everyone who has paid.', 'Increase the random sample from the still-paying list.', 'Sample randomly only from the list of users who left.'],
        zh_explanation='全部曾付费名单同时包含仍付费与已离开者，使两类人都有抽样机会。扩大仍付费样本不能补上已离开者；只抽已离开者又漏掉仍付费者。完整抽样框不保证人人回应，还需另查未回应偏差。',
        en_explanation='The full ever-paid list includes both groups and gives each a chance of selection. A larger still-paying sample leaves departed users out; a departed-only sample leaves current users out. A complete sampling frame does not ensure everyone responds, so nonresponse still needs checking.',
        distractors=[(1,'用增大方便群体样本代替补齐总体覆盖','更多仍付费者仍不能提供已离开者的抽样机会。'),(2,'用全部缺失群体代替完整目标总体','只抽已离开者又排除仍付费者。')],
        evidence='目标总体包括仍付费和已离开，全部曾付费名单覆盖这两类。',
        objective='选择同时覆盖当前与已离开用户的抽样框', operation='应用',
        reason='改为抽样框改进，区别于05-q9界定已记录群体的任务。')
    revise('03-q10',
        zh_explanation='案件数100除以人口10000，对应一年每万人100起，或每100人1起。案件可能涉及同一人多次，不能把这个事件率直接说成1%居民遇案。200篇是报道量；200÷20是报道量倍数，都不是给定定义的案件率。',
        en_explanation='The numerator is 100 cases and the population is 10,000: 100 cases per 10,000 residents that year, or one per 100. Repeated cases may involve the same person, so this is not the percentage of residents affected. The 200 reports and their tenfold increase are different quantities.',
        evidence='题干定义为独立案件数/人口：100/10000，一年每万人100起，未记录独立受影响人数。',
        reason='明确事件率单位，避免将案件数率误解为居民遇案比例。')

else:
    raise ValueError(suffix)

path.write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n')
record_path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
(ROOT / 'review' / f'revisions-{suffix}.json').write_text(json.dumps(changes, ensure_ascii=False, indent=2) + '\n')
print(suffix, 'revised', len(changes), 'knowledge items; preserved option IDs and bilingual answer alignment.')
