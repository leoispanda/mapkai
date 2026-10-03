"""Assemble bilingual candidates and report editorial checks, never activate runtime."""
import copy
import hashlib
import json
import itertools
import math
import random
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PARTS = ROOT / 'parts'
REVIEW = ROOT / 'review'
VERSION = 'v2-2026-10-03'
SUBJECTS = {
    '00': ('通用学习', 'General Studies'),
    '01': ('教育', 'Education'),
    '02': ('艺术与人文', 'Arts & Humanities'),
    '03': ('社会科学', 'Social Sciences'),
    '04': ('商业与法律', 'Business & Law'),
    '05': ('自然科学', 'Natural Sciences'),
    '06': ('计算与技术', 'Computing & Technology'),
    '07': ('工程与建造', 'Engineering & Construction'),
    '08': ('农业与生态', 'Agriculture & Ecology'),
    '09': ('健康与医学', 'Health & Medicine'),
    '10': ('服务与运输', 'Services & Transport'),
}


def read(path):
    return json.loads(path.read_text())


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def length(value):
    return len(''.join(value.split()))


def stable_order(qid, ids):
    return sorted(range(len(ids)), key=lambda i: hashlib.sha256(
        f'{VERSION}|{qid}|{ids[i]}'.encode()).hexdigest())


def explore_orders(items):
    """Balance opportunities across positions without using people's choices."""
    rng = random.Random(int(hashlib.sha256(VERSION.encode()).hexdigest()[:16], 16))
    permutations = list(itertools.permutations(range(4)))
    domains = [[q['optionProfiles'][oid]['subject'] for oid in q['optionIds']] for q in items]
    groups = [q['questionMode'] for q in items]
    orders = [stable_order(q['id'], q['optionIds']) for q in items]

    def score(candidate):
        counts = defaultdict(Counter)
        for j, order in enumerate(candidate):
            for pos, old in enumerate(order):
                counts[(groups[j], domains[j][old])][pos] += 1
                counts[('all', domains[j][old])][pos] += 1
        return sum(sum(v*v for v in c.values()) * (1 if group == 'all' else 5)
                   for (group, _), c in counts.items())

    current = score(orders)
    best, best_score = copy.deepcopy(orders), current
    for step in range(16000):
        j = rng.randrange(len(items))
        before = orders[j]
        orders[j] = list(rng.choice(permutations))
        proposed = score(orders)
        temperature = max(0.08, 3.5 * (1-step/16000))
        if proposed <= current or rng.random() < math.exp((current-proposed)/temperature):
            current = proposed
            if current < best_score:
                best, best_score = copy.deepcopy(orders), current
        else:
            orders[j] = before
        if best_score == 592:
            break
    return {q['id']: order for q, order in zip(items, best)}


def mechanical(items, lang):
    result = {'answerPositions': Counter(), 'uniqueLongestCorrect': 0,
              'uniqueShortestCorrect': 0, 'longestTies': 0, 'shortestTies': 0,
              'chooseLongestFirstDisplayTie': 0, 'chooseShortestFirstDisplayTie': 0,
              'correctUniqueLongestItems': [], 'bySubject': {}}
    for q in items:
        d = q[lang]
        lens = [length(o) for o in d['options']]
        ai = d['options'].index(d['answer'])
        result['answerPositions']['ABC'[ai]] += 1
        hi, lo = max(lens), min(lens)
        result['longestTies'] += lens.count(hi) > 1
        result['shortestTies'] += lens.count(lo) > 1
        result['chooseLongestFirstDisplayTie'] += lens.index(hi) == ai
        result['chooseShortestFirstDisplayTie'] += lens.index(lo) == ai
        result['uniqueShortestCorrect'] += lens.count(lo) == 1 and lens[ai] == lo
        if lens.count(hi) == 1 and lens[ai] == hi:
            result['uniqueLongestCorrect'] += 1
            result['correctUniqueLongestItems'].append({
                'id': q['id'], 'lengths': lens,
                'gapToSecondLongest': hi - sorted(lens)[-2],
            })
    for s in SUBJECTS:
        subset = [q for q in items if q['subject'] == s]
        if subset:
            result['bySubject'][s] = {
                'count': len(subset),
                'chooseLongestFirstDisplayTie': sum(
                    [length(o) for o in q[lang]['options']].index(
                        max(length(o) for o in q[lang]['options']))
                    == q[lang]['options'].index(q[lang]['answer']) for q in subset),
            }
    return result


def check_language(q, count, knowledge):
    answer_indices = []
    for lang in ('zh', 'en'):
        d = q[lang]
        assert isinstance(d['question'], str) and d['question'].strip(), q['id']
        assert len(d['options']) == count, q['id']
        assert all(isinstance(x, str) and x.strip() for x in d['options']), q['id']
        assert len(set(d['options'])) == count, q['id']
        if knowledge:
            assert d['options'].count(d['answer']) == 1, q['id']
            assert d['explanation'].strip(), q['id']
            assert 'Powered by' not in d['explanation'], q['id']
            assert '实用知识模式' not in d['explanation'], q['id']
            answer_indices.append(d['options'].index(d['answer']))
        else:
            assert 'answer' not in d and 'explanation' not in d, q['id']
    if knowledge:
        assert answer_indices[0] == answer_indices[1], q['id']


def assemble_knowledge():
    items, records = [], []
    for suffix in ('00-03', '04-07', '08-10'):
        items.extend(read(PARTS / f'map-{suffix}.json'))
        records.extend(read(PARTS / f'editorial-{suffix}.json'))
    assert len(items) == len(records) == 132
    assert len({q['id'] for q in items}) == 132
    record_by_id = {r['id']: r for r in records}
    assert len(record_by_id) == 132
    assert len({oid for r in records for oid in r['optionIds']}) == 396
    assert set(record_by_id) == {q['id'] for q in items}
    assert Counter(q['subject'] for q in items) == Counter({s: 12 for s in SUBJECTS})
    assert {r['sourceId'] for r in records} == {
        f'{s}-q{i}' for s in SUBJECTS for i in range(1, 13)}
    questions = {lang: set() for lang in ('zh', 'en')}
    explanations = {lang: set() for lang in ('zh', 'en')}
    for q in items:
        r = record_by_id[q['id']]
        assert set(q) == {'id', 'subject', 'en', 'zh'}, q['id']
        check_language(q, 3, True)
        assert len(r['optionIds']) == len(set(r['optionIds'])) == 3, q['id']
        assert r['answerOptionId'] in r['optionIds'], q['id']
        assert r['optionIds'][q['en']['options'].index(q['en']['answer'])] == r['answerOptionId'], q['id']
        assert len(r['distractors']) == 2, q['id']
        assert {x['optionId'] for x in r['distractors']} == set(r['optionIds']) - {r['answerOptionId']}, q['id']
        for key in ('revisionReason', 'concept', 'objective', 'cognitiveOperation',
                    'context', 'difficultyEstimate', 'difficultyReason', 'answerEvidence'):
            assert r[key] and '待补' not in r[key], (q['id'], key)
        for d in r['distractors']:
            assert d['error'] and d['whyNot'], q['id']
        for source in r['factSources']:
            assert all(source.get(k) for k in ('url', 'title', 'checkedAt', 'supports')), q['id']
        for lang in ('zh', 'en'):
            assert q[lang]['question'] not in questions[lang], q['id']
            assert q[lang]['explanation'] not in explanations[lang], q['id']
            questions[lang].add(q[lang]['question'])
            explanations[lang].add(q[lang]['explanation'])
        order = list(range(3)) if r['keepLogicalOrder'] else stable_order(q['id'], r['optionIds'])
        for lang in ('zh', 'en'):
            q[lang]['options'] = [q[lang]['options'][i] for i in order]
        r['optionIds'] = [r['optionIds'][i] for i in order]
        r['displayOrderRule'] = 'natural-order' if r['keepLogicalOrder'] else 'stable-id-hash'
        r['bankVersion'] = VERSION
    items.sort(key=lambda q: (q['subject'], int(record_by_id[q['id']]['sourceId'].split('-q')[1])))
    records.sort(key=lambda r: (r['sourceId'].split('-q')[0], int(r['sourceId'].split('-q')[1])))
    return items, records


def assemble_explore():
    items = read(PARTS / 'explore-20.json')
    records = read(PARTS / 'editorial-explore.json')
    assert len(items) == len(records) == 20
    assert len({q['id'] for q in items}) == 20
    assert len({oid for q in items for oid in q['optionIds']}) == 80
    assert Counter(q['questionMode'] for q in items) == {
        'knowledge_lens_probe': 8, 'task_preference_probe': 12}
    assert {r['id'] for r in records} == {q['id'] for q in items}
    record_by_id = {r['id']: r for r in records}
    orders = explore_orders(items)
    for q in items:
        check_language(q, 4, False)
        assert q['skipAllowed'] is True
        assert len(q['optionIds']) == len(set(q['optionIds'])) == 4
        assert set(q['optionProfiles']) == set(q['optionIds'])
        domains = [q['optionProfiles'][oid]['subject'] for oid in q['optionIds']]
        assert len(set(domains)) == 4
        assert set(domains) <= set(SUBJECTS)
        r = record_by_id[q['id']]
        assert set(r['optionMappingReasons']) == set(q['optionIds'])
        order = orders[q['id']]
        for lang in ('zh', 'en'):
            q[lang]['question'] = q[lang]['question'].replace('。 假设', '。假设')
            q[lang]['options'] = [q[lang]['options'][i] for i in order]
        q['optionIds'] = [q['optionIds'][i] for i in order]
        r['bankVersion'] = VERSION
        r['displayOrderRule'] = 'deterministic-exposure-balanced'
    return items, records


def explore_metrics(items):
    report = {}
    for mode in ('knowledge_lens_probe', 'task_preference_probe'):
        subset = [q for q in items if q['questionMode'] == mode]
        opportunities = Counter()
        positions = {s: Counter() for s in SUBJECTS}
        longest = {lang: Counter() for lang in ('zh', 'en')}
        fixed = {letter: Counter() for letter in 'ABCD'}
        for q in subset:
            domains = [q['optionProfiles'][oid]['subject'] for oid in q['optionIds']]
            opportunities.update(domains)
            for i, s in enumerate(domains):
                positions[s]['ABCD'[i]] += 1
                fixed['ABCD'[i]][s] += 1
            for lang in ('zh', 'en'):
                lens = [length(o) for o in q[lang]['options']]
                longest[lang][domains[lens.index(max(lens))]] += 1
        report[mode] = {'questions': len(subset), 'opportunities': opportunities,
                        'positionsBySubject': positions,
                        'fixedLetterChoiceRecords': fixed,
                        'longestOptionChoiceRecordsFirstDisplayTie': longest}
    report['totalOpportunities'] = sum(
        (Counter(report[m]['opportunities']) for m in ('knowledge_lens_probe', 'task_preference_probe')), Counter())
    return report


def md_knowledge(items, records):
    by_id = {r['id']: r for r in records}
    out = ['# MapKAI 知识地图新版题库（132 题）', '',
           f'版本：{VERSION}。双语编辑候选；真实用户试答尚未进行。', '',
           '每题三个选项。答案、解析供审阅；领域分类用于导航，不代表完整学科覆盖。', '']
    for s, (zh, en) in SUBJECTS.items():
        out += [f'## {s} · {zh} / {en}', '']
        for q in (q for q in items if q['subject'] == s):
            r = by_id[q['id']]
            out += [f"### {q['id']} · {r['concept']}", '', q['zh']['question'], '']
            out += [f"- {'ABC'[i]}. {x}" for i, x in enumerate(q['zh']['options'])]
            out += ['', f"**答案：{'ABC'[q['zh']['options'].index(q['zh']['answer'])]}。** {q['zh']['explanation']}", '',
                    q['en']['question'], '']
            out += [f"- {'ABC'[i]}. {x}" for i, x in enumerate(q['en']['options'])]
            out += ['', f"**Answer: {'ABC'[q['en']['options'].index(q['en']['answer'])]}.** {q['en']['explanation']}", '']
            if r['factSources']:
                out += ['事实核对：' + '；'.join(f"[{s['title']}]({s['url']})" for s in r['factSources']) + '。', '']
    (ROOT / 'map-132.zh-en.md').write_text('\n'.join(out))


def md_explore(items, records):
    by_id = {r['id']: r for r in records}
    out = ['# MapKAI 新版探索题（20 题）', '',
           f'版本：{VERSION}。这套题没有知识正确答案；可以选择暂时无法选择／跳过。', '',
           '调查入口和任务选择分别记录，只描述本轮具体选择。映射用于编辑审阅，不宜提前显示并暗示用户选择。', '']
    for mode, title in [('knowledge_lens_probe', '调查视角 · 8 题'), ('task_preference_probe', '任务选择 · 12 题')]:
        out += [f'## {title}', '']
        for q in (q for q in items if q['questionMode'] == mode):
            out += [f"### {q['id']}", '', q['zh']['question'], '']
            out += [f"- {'ABCD'[i]}. {x}" for i, x in enumerate(q['zh']['options'])]
            out += ['- 暂时无法选择／跳过。', '', q['en']['question'], '']
            out += [f"- {'ABCD'[i]}. {x}" for i, x in enumerate(q['en']['options'])]
            out += ['- Unable to choose for now / skip.', '', '**编辑映射**', '']
            for i, oid in enumerate(q['optionIds']):
                s = q['optionProfiles'][oid]['subject']
                out += [f"- {'ABCD'[i]} → {SUBJECTS[s][0]}：{by_id[q['id']]['optionMappingReasons'][oid]}"]
            out += ['']
    (ROOT / 'explore-20.zh-en.md').write_text('\n'.join(out))


def blueprint(records, explore):
    out = ['# 新版题库覆盖蓝图', '',
           '11 个主领域各 12 道知识题，另有 8 道调查、12 道任务选择。此表描述本批涉及的概念，未覆盖完整学科。难度为编辑估计，尚无用户首次作答数据。', '']
    for s, (zh, _) in SUBJECTS.items():
        out += [f'## {s} · {zh}', '', '| ID | 概念与主要任务 | 操作 | 情境 | 难度估计 |', '| --- | --- | --- | --- | --- |']
        for r in (r for r in records if r['sourceId'].startswith(s + '-')):
            out += [f"| {r['id']} | {r['concept']}：{r['objective']} | {r['cognitiveOperation']} | {r['context']} | {r['difficultyEstimate']} |"]
        out += ['']
    out += ['## 探索题方向机会', '', '| 方向 | 调查题机会 | 任务题机会 | 合计 |', '| --- | ---: | ---: | ---: |']
    m = explore_metrics(explore)
    for s, (zh, _) in SUBJECTS.items():
        a = m['knowledge_lens_probe']['opportunities'][s]
        b = m['task_preference_probe']['opportunities'][s]
        out += [f'| {s} {zh} | {a} | {b} | {a+b} |']
    out += ['', '机会数用于检查出题覆盖。个人结果的分母应仅包括其实际回答且包含该方向的题；跳过不计入有效机会，两种题型分别呈现。', '']
    (ROOT / 'blueprint.zh.md').write_text('\n'.join(out))


def main():
    knowledge, kr = assemble_knowledge()
    explore, er = assemble_explore()
    save(ROOT / 'map-132.json', knowledge)
    save(ROOT / 'explore-20.json', explore)
    save(ROOT / 'editorial-knowledge.json', kr)
    save(ROOT / 'editorial-explore.json', er)
    final_unanswered = [{
        'id': q['id'], 'subject': q['subject'], 'optionIds': r['optionIds'],
        'zh': {k: q['zh'][k] for k in ('question', 'options')},
        'en': {k: q['en'][k] for k in ('question', 'options')},
    } for q, r in zip(knowledge, kr)]
    save(REVIEW / 'final-unanswered-map-132.json', final_unanswered)
    if not (REVIEW / 'blind-map-132.json').exists():
        save(REVIEW / 'blind-map-132.json', final_unanswered)
    for suffix, codes in [('00-03', {'00', '01', '02', '03'}),
                          ('04-07', {'04', '05', '06', '07'}),
                          ('08-10', {'08', '09', '10'})]:
        group = [q for q in final_unanswered if q['subject'] in codes]
        save(REVIEW / f'final-unanswered-map-{suffix}.json', group)
        if not (REVIEW / f'blind-map-{suffix}.json').exists():
            save(REVIEW / f'blind-map-{suffix}.json', group)
    metrics = {'version': VERSION, 'lengthMethod': 'Unicode characters with whitespace removed',
               'tieMethod': 'first option in displayed order',
               'structure': {'knowledgeCount': 132, 'exploreCount': 20, 'subjects': {s: 12 for s in SUBJECTS},
                             'bilingualAnswerIndexAgreement': 132, 'sourceSlotsCovered': 132},
               'knowledge': {lang: mechanical(knowledge, lang) for lang in ('zh', 'en')},
               'explore': explore_metrics(explore)}
    old = ROOT.parent.parent / 'review/question-bank-2026-10-02/map-132-current.json'
    if old.exists():
        metrics['baselineKnowledge'] = {lang: mechanical(read(old), lang) for lang in ('zh', 'en')}
    save(REVIEW / 'metrics.json', metrics)
    md_knowledge(knowledge, kr)
    md_explore(explore, er)
    blueprint(kr, explore)
    print(json.dumps({'counts': metrics['structure'], 'mechanical': {
        lang: {k: v for k, v in metrics['knowledge'][lang].items()
               if k not in ('correctUniqueLongestItems', 'bySubject')}
        for lang in ('zh', 'en')}, 'exploreOpportunities': metrics['explore']['totalOpportunities']}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
