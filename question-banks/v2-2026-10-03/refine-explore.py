"""Resolve independent editorial review; update content, mapping and reflections together."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
P = ROOT / 'parts'
items = json.loads((P / 'explore-20.json').read_text())
records = json.loads((P / 'editorial-explore.json').read_text())
by_id = {q['id']: q for q in items}
record = {r['id']: r for r in records}
changes = []


def option(qid, subject, zh, en, reason=None, lens=None):
    q = by_id[qid]
    oid = next(o for o in q['optionIds'] if q['optionProfiles'][o]['subject'] == subject)
    i = q['optionIds'].index(oid)
    before = {lang: q[lang]['options'][i] for lang in ('zh', 'en')}
    q['zh']['options'][i], q['en']['options'][i] = zh, en
    profile = q['optionProfiles'][oid]
    profile['reflectionZh'] = '这次你选择了：' + zh
    profile['reflectionEn'] = 'This time, you chose to ' + en[0].lower() + en[1:]
    if lens:
        profile['lens'] = lens
    if reason:
        record[qid]['optionMappingReasons'][oid] = reason
    if before != {'zh': zh, 'en': en}:
        changes.append({'id': qid, 'optionId': oid, 'before': before, 'after': {'zh': zh, 'en': en}})


q = by_id['lens-v2-001']
q['zh']['question'] = '朋友看短视频时常常超过原定时间。你们想先收集一种记录；四项都可能有帮助。你最想从哪项开始？'
q['en']['question'] = 'A friend often watches short videos longer than planned. You want to start with one kind of record; all four may help. Which would you most like to collect first?'
option('lens-v2-001', '10', '记录附近休闲设施的开放时间和使用情况。',
       'Record opening hours and use of nearby leisure facilities.',
       '关注休闲设施提供服务的时段与实际使用，归休闲服务；不把个人休息行为直接等同于服务视角。', 'leisure_facility_use')
option('task-v2-004', '09', '根据健康资料，整理活动中的休息提示。',
       'Use health information to prepare rest-break guidance.',
       '把已给健康资料转成活动中的休息提示，归健康；不是核查所有资料或提出个人处方。')
option('task-v2-005', '09', '核对饮水与身体不适提醒的资料。',
       'Check sources for hydration and physical-discomfort guidance.')
option('task-v2-008', '09', '核对疲惫与休息提示的健康资料。',
       'Check health sources behind guidance on tiredness and rest.')
option('task-v2-011', '09', '根据资料，整理进餐前的手卫生提示。',
       'Use supplied guidance to prepare hand-hygiene reminders before eating.',
       '根据已给资料整理进餐前的卫生预防提示，归健康；不把该偏好解释为医学能力。')
option('task-v2-007', '07', '根据图纸检查零件尺寸与装配位置。',
       'Check part sizes and assembly positions using drawings.')
option('task-v2-010', '03', '核对调查覆盖和遗漏的居民群体。',
       'Check which resident groups the survey includes or misses.')
q = by_id['task-v2-012']
q['scenarioType'] = 'shared_gardening_tools'
q['zh']['question'] = q['zh']['question'].replace('一套共享设备借用服务', '一套共享园艺工具借用服务')
q['en']['question'] = q['en']['question'].replace('shared-device lending service', 'shared gardening-tool lending service')
record[q['id']]['context'] = q['scenarioType']
option('task-v2-012', '06', '设置预约时段冲突的自动检查。',
       'Set up automatic checks for conflicting booking times.',
       '配置预约系统中的冲突检查逻辑，归计算技术；与工具柜的表单权限任务不同。', 'booking_conflict_checks')
option('task-v2-012', '08', '整理工具使用对土壤和植物的影响。',
       'Summarise how tool use affects soil and plants.',
       '实际对象是园艺工具对土壤与植物的影响，归农业生态；不再仅凭泛化的生态影响一词归类。', 'soil_plant_effects')
for r in records:
    r['status'] = 'independent-review-completed / revisions-awaiting-recheck'
    r['independentReviewReference'] = 'review/explore-independent-review.json'
    if any(c['id'] == r['id'] for c in changes):
        r['revisionReason'] += ' 独立复审后收紧映射、精简表述或增加操作差异，见修订记录。'
for q in items:
    q['zh']['question'] = q['zh']['question'].replace('。 假设', '。假设')
(P / 'explore-20.json').write_text(json.dumps(items, ensure_ascii=False, indent=2) + '\n')
(P / 'editorial-explore.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n')
(ROOT / 'review/explore-revisions.json').write_text(json.dumps(changes, ensure_ascii=False, indent=2) + '\n')
print('Explore revisions complete:', len(changes), 'options; mapping, bilingual wording and reflection records updated together.')
