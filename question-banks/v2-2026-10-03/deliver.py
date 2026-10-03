"""Document a completed editorial candidate and its actual verification evidence."""
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REVIEW = ROOT / 'review'
VERSION = 'v2-2026-10-03'


def read(path):
    return json.loads(path.read_text())


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


knowledge = read(ROOT / 'map-132.json')
explore = read(ROOT / 'explore-20.json')
records = read(ROOT / 'editorial-knowledge.json')
er = read(ROOT / 'editorial-explore.json')
metrics = read(REVIEW / 'metrics.json')
assert len(knowledge) == len(records) == 132 and len(explore) == len(er) == 20
assert all(r['status'] == 'editorial-reviewed / awaiting-user-tryout' for r in records + er)

# The original blind material stays immutable; revised content has separate rechecks.
for suffix in ('00-03', '04-07', '08-10'):
    peer = read(REVIEW / f'independent-{suffix}.json')
    rows = peer if isinstance(peer, list) else peer['items']
    expected = 36 if suffix == '08-10' else 48
    assert len(rows) == expected
    assert all(r.get('answerAgreement', r.get('blindMatchesAuthorZh', False)) for r in rows)
    assert all(r.get('answerAgreement', r.get('blindMatchesAuthorEn', False)) for r in rows)

original_runtime = read(REVIEW / 'runtime-before.json')
runtime_now = {f: sha(ROOT.parent.parent / f) for f in original_runtime}
assert original_runtime == runtime_now, 'Website files changed during candidate creation'

source_groups = defaultdict(list)
for r in records:
    for s in r['factSources']:
        source_groups[s['url']].append((r['id'], s))
source_lines = ['# 新版题库事实来源', '',
                '来源支持基础机制及必要边界；虚构数值与情境在题面说明。作者核查日期为2026年10月3日，独立复审另核必要来源。计算、给定规则和材料内部推理不机械要求外链。', '']
for url, used in sorted(source_groups.items()):
    source_lines += [f"## [{used[0][1]['title']}]({url})", '',
                     '涉及题目：' + '、'.join(qid for qid, _ in used) + '。', '']
    source_lines += [f"- {qid}：{s['supports']}" for qid, s in used]
    source_lines += ['']
(ROOT / 'sources.zh.md').write_text('\n'.join(source_lines))

specific_format = {
    '01-q3': '三项均为具体学习动作，长度只差一字；是否关上资料与提取回忆是任务区别，不是详略提示。',
    '01-q5': '三项均为先做一项活动、再做一项活动的平行句，没有正确项独占第二层理由。',
    '01-q6': '三个选项都描述材料及用法；正确项英文11词，其他约12词，字符差来自词长。范例与独立任务是题干要求的两个角色，未靠额外因果或限定救答案。',
    '01-q7': '三项均为具体任务，GB与公斤单位不同是跨食品领域目标，中文一字差没有独立猜题价值。',
    '02-v2-q08': '三个选项分别问接收对象、归还地点、改变方式的原因，处于同一叙事信息层级。',
    '02-q12': '三个选项都为视觉线索，正确项没有附加解释；英文仅两字符差。',
    '03-v2-q02': '三个选项均为依据某来源改变公开回答的影响类型，无正确项独占因果链。',
    '03-q6': '三项均保留帖子、核实状态、评论数相同格式，unverified词长造成两字符差；排序必须用评论数。',
    '03-q9': '三项均为抽样框操作，正确项的完整名单与两类总体是考点，英文仅三字符差。',
    '04-q6': '重复来电的共同定义已移入题干，三项是计数指标；英文正确项现在更短，中文只差一字。',
    '04-q9': '低额在题干明确定义，三项均为员工和经理分配规则，英文正确项仅两字符差。',
    '05-q1': '三项均为热感觉的机制句，正确项没有多一层解释，英文仅两字符差。',
    '05-q2': '三项均解释70%的意义，限定地点和时段已在题干；没有正确项独占条件。',
    '05-q3': '三项均包含能否及一条理由，正确项没有双重解释。不同判断来自同时改变两个变量这一证据。',
    '06-q4': '三项均是程序动作，提示文字是规则给定的输出内容；一字差不构成更专业的机制句。',
    '06-q5': '订单同步更新已前置，三项各只描述一种顾客表改动，英文一字符差。',
    '06-q8': '三项均为权限范围或功能，选择单张照片不是靠额外条件限定；英文两字符差。',
    '06-v2-q11': '三个选项均为固定密码加另一验证步骤，因素定义在题干，英文两字符差。',
    '07-q1': '三项均为材料与方向对受力表现的判断，正确项没有追加边界和解释。',
    '07-q2': '三项均为一条结构解释，正确项使用三边与角度关系；词长小差异不含第二机制。',
    '07-q10': '三项均为检查时间减少加一种检出范围判断，只比较内部、外观和两类，英文一字符差。',
    '07-q12': '三项均为出行来源加驾车需求变化的一条机制；正确项7个英语词，另外8和6词，字符差来自同层级词长，无额外因果链或条件句。',
    '08-q1': '三项均包含生长与结果两个表现，正确项没有比其他项多一个维度。',
    '08-q4': '三项均为一种捕捞限制规则；合计上限是共同资源题的目标维度，不在正确项额外补可靠执行条件，执行条件已由题干共同给出。',
    '08-q5': '三项均为一种差异及来源，散热机制由随机对照条件支持，英文仅四字符差。',
    '08-q6': '三项均为一种光水获取机制，不以长篇遗传或气候说明作干扰。',
    '08-q9': '三项均为资源不足到达一个植物部位，pollen一词造成小差异，题干干预决定答案。',
    '09-q3': '三项均为先改变一个安排再做另一个安排，正确项没有新增理由，中文一字差。',
    '09-q4': '三项均为传播路径中一个量或过程，英文正确项11词，另外8和11词，未独占条件限定或因果链；三类机制按明确空气传播材料比较。',
    '09-v2-q05': '三项均为对象对抗生素A作用的关系，英文两字符差，不能靠更长的耐药定义选答案。',
    '09-q12': '三项均为支持类型加两个动作或内容，并非正确项独占两种说明；用题干实际提供的支持判断。',
    '10-q4': '三项均为通道附近的一种流程动作，英文三字符差，最大移走时长由题干数字比较。',
    '10-q12': '三项均为一组内容或呈现属性，正确项没有追加理由；题干已排除单点不清楚，要求查内容矛盾。',
}
by_id = {q['id']: q for q in knowledge}
format_rows = []
for lang in ('zh', 'en'):
    for d in metrics['knowledge'][lang]['correctUniqueLongestItems']:
        assert d['id'] in specific_format
        q = by_id[d['id']]
        format_rows.append({**d, 'language': lang,
                            'wordCounts': [len(o.split()) for o in q[lang]['options']] if lang == 'en' else None,
                            'assessment': specific_format[d['id']],
                            'decision': 'editorial-acceptable / user-tryout-pending'})
save(REVIEW / 'length-cue-recheck.json', {
    'reviewedAt':'2026-10-03', 'method':'逐项比较实际文字，结合独立复审；字符数不充当自动通过线。',
    'sourceSha256':sha(ROOT/'map-132.json'), 'items':format_rows,
    'limitation':'编辑判断未替代目标读者的实际作答；任何新增可猜规律需按反馈再修订。'})

changes = []
for suffix in ('00-03', '04-07', '08-10'):
    old = {q['id']: q for q in read(REVIEW / f'author-map-{suffix}.json')}
    for q in read(ROOT / 'parts' / f'map-{suffix}.json'):
        if q != old[q['id']]:
            changes.append({'id':q['id'],'before':old[q['id']],'after':q,
                            'recheckReference':f'review/recheck-{suffix}.json'})
save(REVIEW / 'knowledge-final-revisions.json', changes)

verification = {
    'version': VERSION, 'date':'2026-10-03',
    'counts': {'knowledge':132,'explore':20,'bilingualItems':152,'stableOptionIds':476},
    'sourceSlots':132, 'bilingualAnswerMappingChecked':132,
    'independentKnowledgeReview':132, 'independentExploreReview':20,
    'knowledgeQuestionsRevisedAfterReview':len(changes),
    'unresolvedRequiredEditorialIssues':0,
    'realUserTryoutPerformed':False,
    'runtimeActivated':False, 'runtimeHashesUnchanged':runtime_now,
    'optionOrder':'中英文与稳定标识同步；24道数值关系题保留自然顺序，其他知识题按标识打散；探索题方向机会在字母位置分散。',
    'generationGit': {'available':False,'committed':False,'pushed':False},
}
save(REVIEW / 'verification.json', verification)

report = ['# 新版题库编辑检查', '',
          '状态：编辑复审完成／待真实用户试答。152道双语候选全部完成；初审发现的问题已修订，再由非作者核对。本报告描述编辑证据，不声称题目难度或偏好测量已经实测有效。', '',
          '## 范围与复审', '',
          '- Explore：8道调查视角、12道任务选择，每题4个合理选项及跳过；20题独立复审，修后再次检查映射与双语。',
          '- Map：11个领域各12题，每题3项与逐题解析；132题先用不带答案的材料双语解答，再核对作者答案与判定依据。',
          f'- 知识题中91项保留主要目标，41项换目标使用新ID；初审后又修正了{len(changes)}道题的具体文字或选项，修后独立核对。',
          '- 初始独立解题与键一致，但仍退回了存在歧义、弱干扰项或形式线索的题，未把“猜中”当成通过。',
          '- 最终内容绑定实际文件校验值；标识、三选一答案精确匹配、两语答案对应、旧题来源位置和逐项映射均已检查。', '',
          '## 机械策略检查', '',
          '长度按去空白Unicode字符计算。最长或最短并列时选择实际显示中最先的一项；所有题都纳入分母。以下是对保存候选排列的编辑检查，接入若改排列必须重新计算。', '',
          '| 指标 | 旧中文 | 新中文 | 旧英文 | 新英文 |', '| --- | ---: | ---: | ---: | ---: |']
for label, key in [('正确项唯一最长','uniqueLongestCorrect'),('始终选最长的命中题数','chooseLongestFirstDisplayTie'),('始终选最短的命中题数','chooseShortestFirstDisplayTie')]:
    b, n = metrics['baselineKnowledge'], metrics['knowledge']
    report += [f"| {label} | {b['zh'][key]}/132 | {n['zh'][key]}/132 | {b['en'][key]}/132 | {n['en'][key]}/132 |"]
report += ['', '新中文选最长为31.8%，新英文为33.3%；旧版分别为90.2%和78.8%。固定A/B/C分别命中51/47/34题；这只是机械策略成绩，没有据此设通过率、难度或能力界线。数值关系选项保留自然顺序，未为了字母均衡打乱。', '',
           '所有正确项独占最长的题都完成逐项形式检查；新中文12项均只比第二长多1字。英文另检查实际词数、句式和限定，修掉正确项独占命令句、双动作或完整长条件的情况。相近长度本身不证明干扰项有效。记录见 `review/length-cue-recheck.json`。', '',
           '## 覆盖与实际局限', '',
           '- 每个探索方向调查题有2–3次、任务题4–5次可选机会，全套7–8次。任务题中各方向均出现于A/B/C/D，调查题每个方向的机会分散在不同位置。机会分散只减少编辑结构偏差。',
           '- 健康任务由全部核查资料改为核查及整理提醒，但仍主要抽样健康信息工作；没有据此推断完整医学兴趣或能力。部分社区场景可能对读者不适用，保留跳过。',
           '- 132题以基础到进阶的小任务为主，涉及计算、比较、机制、证据和应用；11个宽领域各12题不覆盖完整学科，也不能据此估计单一总能力。',
           '- 45道知识题附必要事实来源，共43个不同网址；其余主要依据明示虚构数据、规则、材料和可直接核算的关系。法律只解读给定条款，健康不生成个人治疗方案。',
           '- 未进行真实用户试答。尚不能宣称经过验证的难度、信度、区分度、稳定偏好或长期掌握；后续试答应检查理解过程与具体错误，而不只看总体正确率。', '',
           '## 本次交付边界', '',
           '生成时副本的script.js、index.html、styles.css与生成前校验值一致。原运行题库、地图与历史进度未替换；旧重复首次计分问题仍需在接入时处理。候选内容和接口边界见 `integration-notes.zh.md`。仓库交付只提交候选资料，提交与远端状态以 Git 记录为准。', '',
           '依据：项目 Principles v3。复审过程和原始盲解保存在 review；知识题与编辑记录分开，真实用户试答另行记录。', '']
(ROOT / 'quality-review.zh.md').write_text('\n'.join(report))

(ROOT / 'README.zh.md').write_text('''# MapKAI 新版题库 v2

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
''')

deliverables = ['README.zh.md','explore-20.zh-en.md','map-132.zh-en.md','blueprint.zh.md',
                'quality-review.zh.md','sources.zh.md','integration-notes.zh.md',
                'explore-20.json','map-132.json','editorial-explore.json','editorial-knowledge.json']
manifest = {
    'version':VERSION,'generatedAt':'2026-10-03','principles':'Principles v3 (2026-10-02)',
    'status':'editorial-reviewed / awaiting-user-tryout', 'counts':verification['counts'],
    'knowledgeLineage':{'sameObjectiveRetainedId':91,'changedObjectiveNewId':41},
    'realUserTryoutPerformed':False,'runtimeActivated':False,
    'generationGit':{'available':False,'committed':False,'pushed':False},
    'repository':'https://github.com/leoispanda/mapkai',
    'publicationStatusSource':'Git commit history and remote branch, not generation metadata',
    'sourceRuntimeHashScope':'Original generation copy; not the repository publication checkout',
    'files':{fn:{'sha256':sha(ROOT/fn),'bytes':(ROOT/fn).stat().st_size} for fn in deliverables},
    'verificationFile':'review/verification.json','reviewMetricsFile':'review/metrics.json',
    'sourceRuntimeHashes':runtime_now,
}
save(ROOT/'manifest.json',manifest)
print(json.dumps({'version':VERSION,'items':152,'requiredIssuesRemaining':0,
                  'sourceQuestionsRevisedAfterReview':len(changes),'sourceCheckedQuestions':45,
                  'status':manifest['status'],'websiteUnchanged':True},ensure_ascii=False,indent=2))
