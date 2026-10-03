import json
from pathlib import Path
from collections import Counter

out = Path(__file__).parent
rows = []

def add(number, mode, scene, zh, en, choices):
    prefix = 'lens' if mode == 'knowledge_lens_probe' else 'task'
    qid = f'{prefix}-v2-{number:03d}'
    source = f'{prefix}-{number:03d}'
    ids = [f'{qid}-opt-{code}' for code, *_ in choices]
    profiles = {}
    for oid, (code, label_zh, label_en, goal, reason) in zip(ids, choices):
        profiles[oid] = {
            'subject': code, 'lens': goal,
            'reflectionZh': f'这次你选择了：{label_zh.rstrip("。") }。',
            'reflectionEn': f'This time, you chose to {label_en[0].lower() + label_en[1:].rstrip(".")}.'
        }
    rows.append(({
        'id': qid, 'questionMode': mode, 'scenarioType': scene,
        'optionIds': ids, 'skipAllowed': True,
        'zh': {'question': zh, 'options': [r[1] for r in choices]},
        'en': {'question': en, 'options': [r[2] for r in choices]},
        'optionProfiles': profiles,
    }, {
        'id': qid, 'sourceId': source, 'changeType': 'REPLACE',
        'revisionReason': '重新建立具体且可比较的选择任务，收紧方向映射；使用新题目标识隔离旧版选择证据。',
        'objective': '记录本轮优先调查的信息' if prefix == 'lens' else '记录本轮愿意承担的任务',
        'context': scene, 'optionMappingReasons': {oid: r[4] for oid, r in zip(ids, choices)},
        'comparability': '调查选项均为可取得的资料或观察，不预设真实原因。' if prefix == 'lens' else '各项按题干给定的相近时间、支持和责任条件比较，不作为必须先做的顺序。',
        'resultBoundary': '只描述本次具体选择；不推断知识能力、稳定人格、职业适配或未选领域的长期盲区。',
        'factSources': [], 'status': 'writer-reviewed / awaiting-independent-review',
    }))

L = 'knowledge_lens_probe'
T = 'task_preference_probe'

add(1,L,'phone_use',
'朋友常常刷手机超过原定时间。你们想先收集一种记录；四项都可能有帮助。你最想从哪项开始？',
'A friend often scrolls longer than planned. You want to start with one kind of record; all four may help. Which would you most like to collect first?',[
('06','记录自动连播开关与每次使用时长。','Record autoplay settings and session lengths.','autoplay_design','关注应用功能与交互机制，归计算与技术。'),
('05','记录每次使用时长，查看它们如何分布。','Record session lengths and examine their distribution.','duration_distribution','关注数值分布与变异，归统计描述，而非把所有观察都归科学。'),
('09','记录使用前的疲惫程度和近期休息情况。','Record tiredness before use and recent rest.','fatigue_rest','关注自述健康与恢复状态，不作诊断。'),
('10','记录当时可选的休息活动与实际选择。','Record available ways to rest and the activity chosen.','rest_experience','关注可选休息体验和使用情境，归休闲服务体验。')])

add(2,L,'community_garden',
'社区花园的几个种植区长势不同。你想多了解这件事，四类资料都能查到。你最想先看哪类？',
'Several areas of a community garden are growing differently. All four kinds of information are available. Which would you most like to examine first?',[
('08','比较各区的土壤、植物种类和养护记录。','Compare soil, plant species and care records across areas.','growing_conditions','直接查看植物和栽培条件，归农业与生态。'),
('07','查看灌溉管路的布置与出水位置。','Examine irrigation pipe layouts and outlet positions.','irrigation_layout','关注具体物理设施设计，归工程。'),
('04','查看种苗采购和日常维护的预算分配。','Examine budgets for seedlings and routine maintenance.','garden_budget','关注经营资源与预算配置，归商业管理。'),
('03','了解居民怎样参与、分工和约定共享规则。','Ask how residents participate, share work and agree on rules.','collective_rules','关注参与及集体规范，归社会科学。')])

add(3,L,'interactive_exhibition',
'图书馆准备改进一个小型互动展览。你可以先研究其中一方面，四项资料都可获得。你最想了解哪项？',
'A library is improving a small interactive exhibition. Information is available for each of these areas. Which would you most like to investigate first?',[
('02','查看展品、图像与故事怎样共同表达主题。','Examine how objects, images and stories express the theme.','exhibition_meaning','关注艺术和叙事意义，归艺术人文。'),
('01','观察讲解后，访客能否独立完成互动练习。','Observe whether visitors can do an activity after instruction.','instruction_learning','关注教学后能否独立完成任务，归教育。'),
('00','请访客读一段指引，再说出下一步怎么做。','Ask visitors to read instructions and describe the next step.','instruction_comprehension','关注基础阅读和日常信息理解，归通用学习。'),
('10','观察访客如何进入、等候和寻求现场帮助。','Observe how visitors enter, wait and request on-site help.','visitor_service','关注参观服务过程，归服务。')])

add(4,L,'shared_workspace',
'几位朋友使用同一间工作室，想让它更适合大家使用。你可以先收集一种信息。你最想看哪项？',
'Friends share a workspace and want it to work better for everyone. Which kind of information would you most like to collect first?',[
('07','测量桌面、灯具和通道的空间位置。','Measure the positions of desks, lights and walkways.','physical_layout','关注物理空间尺寸与布局，归工程建造。'),
('09','了解大家工作时的身体不适和休息情况。','Ask about physical discomfort during work and rest breaks.','work_comfort','关注自述身体状态与休息，归健康；不诊断原因。'),
('06','查看共享设备、文件权限与网络连接设置。','Examine shared devices, file permissions and network settings.','shared_technology','关注设备、权限和网络，归计算技术。'),
('04','查看场地成本与使用时段如何分摊。','Examine how space costs and usage periods are shared.','space_costs','关注费用和使用资源分配，归商业管理。')])

add(5,L,'market_stall',
'街区市场准备调整一个食品摊位的展示。四个调查方向都已列入计划，你最想先了解哪项？',
'A neighbourhood market is updating a food stall display. All four investigations are planned. Which would you most like to explore first?',[
('04','查看定价、成本与每笔销售的收益。','Examine pricing, costs and returns from each sale.','stall_economics','关注交易与成本收益，归商业。'),
('08','了解食材怎样种植、收获和保存。','Find out how ingredients are grown, harvested and stored.','ingredient_production','关注农业生产和产后保存，归农业。'),
('02','研究颜色、图案和故事如何表达产地特色。','Study how colours, patterns and stories express local identity.','visual_identity','关注视觉及文化表达，归艺术人文。'),
('05','比较不同时段的客流数量与变化范围。','Compare visitor counts and their variation across time periods.','visitor_counts','关注计数与数值变异，归数学统计。')])

add(6,L,'park_path',
'公园准备改进一条步道。四类资料都能帮助讨论方案，你最想先研究哪类？',
'A park is improving a path. Each kind of information can inform the discussion. Which would you most like to examine first?',[
('08','查看沿线植物、土壤与雨后积水的记录。','Examine records of plants, soil and standing water after rain.','path_ecology','关注沿线生态与土壤环境，归农业生态。'),
('03','了解不同居民群体怎样使用这条步道。','Ask how different resident groups use the path.','community_use','关注群体使用模式，归社会科学。'),
('07','查看坡度、路面材料和排水结构。','Examine slopes, surface materials and drainage structures.','path_structure','关注基础设施构造，归工程。'),
('10','观察路标、休息点与访客问路的情况。','Observe signs, rest stops and visitors asking for directions.','wayfinding_service','关注导航和游览体验，归服务运输。')])

add(7,L,'online_course',
'一个线上短课想改进学习体验。你可以先了解其中一个方面，四项都不要求你已有专业经验。你最想研究哪项？',
'A short online course is improving its learning experience. You can investigate any area without prior specialist experience. Which would you prefer to explore first?',[
('01','观察学习者练习时需要哪些提示和反馈。','Observe what prompts and feedback learners need during practice.','practice_feedback','关注练习支持与教学反馈，归教育。'),
('06','查看播放、检索和保存进度的功能设计。','Examine playback, search and progress-saving functions.','course_software','关注软件功能及交互，归计算技术。'),
('05','比较练习得分的分布与前后变化。','Compare the distribution of practice scores and changes over time.','score_distribution','关注测量结果的分布，归数学统计；不据此直接证明课程因果效果。'),
('02','研究措辞、比喻和画面怎样传达内容。','Study how wording, metaphors and images convey the content.','course_expression','关注语言和视听表达的意义，归艺术人文。')])

add(8,L,'community_walk',
'社区组织免费步行导览，想让报名和参与更顺畅。四类信息都能收集。你最想先了解哪类？',
'A community is organising a free guided walk and wants registration and participation to go smoothly. Which information would you most like to collect first?',[
('00','查看报名者怎样理解表格里的词语和要求。','Examine how applicants understand form wording and requirements.','form_literacy','关注日常表格阅读与信息理解，归通用学习。'),
('01','观察示范一次报名后，新参与者如何再尝试。','Observe how new participants retry registration after a demonstration.','demonstration_learning','关注示范和独立练习，归教育。'),
('03','了解不同居民的可参与时段和出行条件。','Ask about residents’ available times and travel circumstances.','participation_access','关注居民群体参与条件，归社会科学。'),
('09','了解路线体力要求与参加者自述的身体限制。','Examine physical demands and participants’ reported limitations.','activity_health','关注身体活动与健康条件，不做能力或疾病诊断。')])

task_intro_zh = '假设每项任务都有资料或协助，你都能完成，预计用时相近，也没有必须先做哪项的要求。你更愿意负责哪项？'
task_intro_en = 'Assume you have information or help for each task, can complete any of them, and they take similar time. None has to come first. Which would you prefer to take on?'

def task(n, scene, zh, en, choices):
    add(n,T,scene,zh+' '+task_intro_zh,en+' '+task_intro_en,choices)

task(1,'small_exhibition','朋友们一起准备小型社区展览。','Friends are preparing a small community exhibition.',[
('02','选择图像与声音，让展览主题有清楚的表达。','Choose images and sounds that clearly express the theme.','exhibition_art','明确视觉与声音表达，归艺术人文。'),
('00','把参观指引改写成容易读懂的日常语言。','Rewrite visitor instructions in clear everyday language.','plain_instructions','基础阅读和书面沟通，归通用学习。'),
('01','设计一段练习，帮助访客理解一个展览概念。','Design an activity to help visitors learn one exhibition concept.','visitor_learning','设计教学练习，归教育。'),
('10','设计接待和问路方式，让参观过程顺畅。','Design reception and wayfinding for a smooth visit.','visitor_operations','具体参观服务，归服务。')])

task(2,'garden_plan','社区准备一个小型共享花园。','A community is preparing a small shared garden.',[
('08','根据种植资料选择植物和养护安排。','Use growing information to choose plants and care routines.','plant_care','栽培与植物养护，归农业生态。'),
('07','根据图纸检查花箱尺寸和灌溉连接。','Use drawings to check planter dimensions and irrigation connections.','garden_build','物理尺寸与连接检查，归工程。'),
('04','比较采购方案，整理费用和维护预算。','Compare purchases and prepare a maintenance budget.','garden_finance','采购成本与运营预算，归商业管理。'),
('03','整理居民意见，拟定共同使用的约定。','Gather residents’ views and draft shared-use agreements.','garden_governance','集体协商和社区规则，归社会科学。')])

task(3,'lending_cabinet','图书馆试办一个工具借用柜。','A library is piloting a tool-lending cabinet.',[
('06','配置借还记录表单和不同使用者的访问权限。','Configure loan forms and access permissions for different users.','lending_software','软件表单与权限，归计算技术。'),
('05','分析借用数量，画出需求随时间变化的图。','Analyse loan counts and chart how demand changes over time.','loan_statistics','数量分析与统计图，归数学统计。'),
('00','把借还说明整理成清楚的步骤和检查清单。','Turn lending instructions into clear steps and a checklist.','instruction_writing','基础沟通与信息组织，归通用学习。'),
('10','设计取还交接和排队等候的服务流程。','Design handovers and queueing for collection and return.','lending_service','交接与服务流程，归服务运输。')])

task(4,'making_workshop','朋友们准备一次桌面制作活动。','Friends are preparing a tabletop making workshop.',[
('01','设计示范和练习，帮助新手逐步独立制作。','Design demonstrations and practice so beginners can work independently.','making_instruction','新手教学与支持渐撤，归教育。'),
('02','选择作品的色彩和图形，表达活动主题。','Choose colours and shapes that express the workshop theme.','making_expression','视觉艺术表达，归艺术人文。'),
('07','用尺寸资料检查底座与零件是否匹配。','Use measurements to check that bases and parts fit.','component_fit','部件尺寸与配合，归工程。'),
('09','查阅健康资料，拟定桌面活动的休息提示。','Use health information to prepare rest-break guidance.','workshop_rest','健康与恢复资料，不凭偏好认定医学能力。')])

task(5,'guided_walk','社区准备一次短距离步行导览。','A community is preparing a short guided walk.',[
('10','整理集合、路线指引和散场的服务安排。','Plan meeting points, route guidance and departure arrangements.','walk_operations','导览接待和运输导航，归服务。'),
('09','核对活动中的饮水和身体不适提醒所依据的资料。','Check sources for hydration and physical-discomfort guidance.','walk_health','健康提示的事实判断，归健康；不进行个体治疗。'),
('03','整理不同居民对路线和参与方式的意见。','Gather different residents’ views on routes and participation.','walk_participation','群体意见与参与条件，归社会科学。'),
('08','根据观察资料，准备沿线植物与生境介绍。','Use observations to prepare notes on plants and habitats along the route.','walk_ecology','植物生境认识，归农业生态。')])

task(6,'market_pop_up','朋友准备试办一天的小型集市摊位。','Friends are preparing a one-day market stall.',[
('00','换算不同包装材料的单位价格，整理比较表。','Convert packaging prices to unit prices and make a comparison table.','unit_price_comparison','基础数值换算与日常比较，归通用学习；不是利润或运营决策。'),
('06','设置库存表单的输入检查和自动汇总。','Set up input checks and automatic totals in an inventory form.','inventory_automation','计算工具配置与数据输入规则，归计算技术。'),
('02','设计展示的图像和文字，让主题有一致表达。','Design display images and wording that express a consistent theme.','stall_visuals','图文表达与设计，归艺术人文。'),
('05','分析已有客流记录，比较时段间的数量差异。','Analyse visitor records and compare counts across time periods.','stall_statistics','统计数量差异，归数学统计。')])

task(7,'repair_demo','社区准备一个物品维修示范台。','A community is preparing an object-repair demonstration station.',[
('07','根据样件和图纸检查零件尺寸与装配位置。','Check component dimensions and assembly positions against samples and drawings.','repair_fit','具体构件配合与装配，归工程。'),
('00','把使用说明改成清楚的步骤和常见问答。','Rewrite instructions as clear steps and common questions.','repair_instructions','日常信息理解与写作，归通用学习。'),
('04','比较供货报价，整理材料和耗材成本。','Compare supplier quotes and organise material costs.','repair_costing','采购和成本管理，归商业。'),
('06','设置查询记录的数据库字段和访问权限。','Set up database fields and permissions for record searches.','repair_database','数据库组织与权限，归计算技术。')])

task(8,'study_video','朋友们准备一段关于学习时休息的短视频。','Friends are preparing a short video about rest during study.',[
('01','设计一个观看后能独立完成的学习练习。','Design an activity viewers can complete independently after watching.','video_learning','教学练习与独立应用，归教育。'),
('02','调整画面、配音和节奏，让内容表达清楚。','Adjust images, narration and rhythm to convey the content clearly.','video_expression','视听表达，归艺术人文。'),
('05','把匿名使用记录整理成分布图和比较表。','Summarise anonymous usage records in distribution charts and comparisons.','video_statistics','数量分布和比较，归数学统计。'),
('09','核对视频中的疲惫和休息提示所引的健康资料。','Check health sources behind guidance on tiredness and rest.','video_health','明确健康主题的证据核查，归健康医学。')])

task(9,'seasonal_food','社区准备介绍当季食材的小活动。','A community is preparing a small event about seasonal ingredients.',[
('08','整理食材的生长条件和收获时节资料。','Gather information on growing conditions and harvest seasons.','seasonal_growing','农业栽培条件与季节，归农业。'),
('10','设计接待、展示和领取材料的服务安排。','Plan reception, displays and material collection.','food_event_service','现场服务流程，归服务。'),
('04','比较采购数量与成本，制定活动预算。','Compare purchase quantities and costs to prepare the event budget.','food_event_budget','采购成本与预算，归商业管理。'),
('00','把报名表和活动说明改成容易读懂的语言。','Rewrite registration forms and event instructions in accessible language.','food_event_literacy','基础表格与说明阅读，归通用学习。')])

task(10,'community_data','居民想展示一份关于社区设施使用的资料。','Residents want to present information about local facility use.',[
('03','检查哪些居民被纳入调查，哪些人可能被遗漏。','Check which residents were surveyed and who may have been missed.','survey_population','关注社会调查代表范围，归社会科学。'),
('06','配置数据表的检索和导出功能。','Configure searching and exporting in the data table.','data_tools','数据工具功能，归计算技术。'),
('05','比较计数、比例和图表尺度是否准确。','Check counts, proportions and chart scales for accuracy.','data_measurement','数学统计表示与尺度，归数学统计。'),
('01','设计一段练习，帮助读者学会读这张图。','Design an activity that teaches readers how to read the chart.','chart_teaching','教读者读图的学习活动，归教育。')])

task(11,'community_lunch','社区准备一场小型午餐活动。','A community is preparing a small lunch event.',[
('09','核对手部卫生与食物接触提示的健康依据。','Check health guidance on hand hygiene and food contact.','lunch_hygiene','明确卫生健康主题，不替代医疗建议。'),
('08','整理食材产地和种植方式的说明资料。','Gather information on ingredient origins and growing methods.','lunch_agriculture','农业来源与生产，归农业生态。'),
('07','根据场地图检查通道宽度和设施摆放。','Use the site plan to check walkway widths and fixture positions.','lunch_layout','物理布局与尺寸检查，归工程；不提供施工安全指令。'),
('10','设计到场、领餐和收拾交接的服务流程。','Design arrival, meal collection and cleanup handovers.','lunch_service','具体服务交接流程，归服务。')])

task(12,'shared_devices','社区想试办一套共享设备借用服务。','A community wants to pilot a shared-device lending service.',[
('04','比较收费和维护支出，整理运营预算。','Compare fees and maintenance costs to prepare an operating budget.','device_finance','收费与成本核算，归商业管理。'),
('06','设置预约系统与设备使用记录的权限。','Set up booking-system permissions and device-use records.','device_booking','系统配置与权限，归计算技术。'),
('08','整理设备使用中涉及的材料来源与生态影响资料。','Gather information on material origins and ecological impacts of device use.','device_ecology','聚焦资源材料的生态影响，归农业生态，不推断该选项代表工程能力。'),
('03','收集不同居民的借用需求和共享规则意见。','Collect residents’ lending needs and views on shared-use rules.','device_governance','参与需求与共同规则，归社会科学。')])

questions=[q for q,e in rows]
editorial=[e for q,e in rows]
assert len(questions)==20
for mode in [L,T]:
    counts=Counter(p['subject'] for q in questions if q['questionMode']==mode for p in q['optionProfiles'].values())
    print(mode,dict(sorted(counts.items())))
for q in questions:
    assert len(q['optionIds'])==4==len(set(q['optionIds']))
    assert len({p['subject'] for p in q['optionProfiles'].values()})==4
for name,data in [('explore-20.json',questions),('editorial-explore.json',editorial)]:
    (out/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
