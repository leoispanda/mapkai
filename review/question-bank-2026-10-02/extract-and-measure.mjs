import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import vm from 'node:vm';

const outDir = dirname(fileURLToPath(import.meta.url));
const repo = resolve(outDir, '../..');
const rootSource = readFileSync(resolve(repo, 'script.js'), 'utf8');
const publicSource = readFileSync(resolve(repo, 'public/script.js'), 'utf8');
const source = publicSource;
const section = (text,from,to) => text.slice(text.indexOf(from),text.indexOf(to,text.indexOf(from)));
const start = source.indexOf('const subjectQuestionSeeds =');
const end = source.indexOf('const challengeSubjects =', start);
if (start < 0 || end <= start) throw new Error('Question-bank markers not found');
// Run only the isolated data declarations and pure question construction functions.
// This fragment contains no DOM, storage, fetch, timers, or website startup code.
const context = vm.createContext({});
vm.runInContext(source.slice(start, end) + '\nthis.audit = {questionBank, mapkaiKnowledgeLensQuestionsV1, subjectQuestionSeeds, zhSubjectQuestionSeeds};', context, {timeout: 1000});
const categoryStart = source.indexOf('const categories =');
const categoryEnd = source.indexOf('const publicCategoryLabels =', categoryStart);
vm.runInContext('const readiness = {classified:"classified"};\n' + source.slice(categoryStart, categoryEnd) + '\nthis.audit.categories = categories;', context, {timeout:1000});
const audit = JSON.parse(JSON.stringify(context.audit));
const map = Object.entries(audit.questionBank).flatMap(([subjectCode, subject]) => subject.questions.map(q => ({...q, subjectName: subject.subject, theme: subject.theme, unlockRule: subject.unlockRule})));
const explore = audit.mapkaiKnowledgeLensQuestionsV1;
const codes = Object.keys(audit.questionBank).sort();
const writeJson = (filename, data) => writeFileSync(resolve(outDir, filename), JSON.stringify(data, null, 2) + '\n');
writeJson('map-132-current.json', map);
writeJson('explore-20-current.json', explore);
writeFileSync(resolve(outDir,'source-question-bank.snapshot.js'),source.slice(start,end));
const histogram = (values) => values.reduce((r,k) => (r[k]=(r[k]||0)+1,r),{});
const size = (text, kind) => kind === 'rawCodePoints' ? Array.from(text).length : kind === 'nonWhitespaceCodePoints' ? Array.from(text.replace(/\s/gu,'')).length : kind === 'words' ? (text.match(/[\p{L}\p{N}]+/gu)||[]).length : 0;
const lengthMetrics = (lang, kind) => {
  const details = map.map(q => {
    const options = q[lang].options;
    const lengths = options.map(text => size(text,kind));
    const answerIndex = options.indexOf(q[lang].answer);
    const max = Math.max(...lengths), min = Math.min(...lengths);
    return {id:q.id,lengths,answerIndex:answerIndex+1,strictlyLongest:lengths.filter(n=>n===max).length===1&&lengths[answerIndex]===max,strictlyShortest:lengths.filter(n=>n===min).length===1&&lengths[answerIndex]===min};
  });
  const longestStrategyCorrect = map.filter(q=>{
    const lengths=q[lang].options.map(text=>size(text,kind));
    return lengths.indexOf(Math.max(...lengths))===q[lang].options.indexOf(q[lang].answer);
  }).length;
  return {strictlyLongest:details.filter(q=>q.strictlyLongest).length,strictlyShortest:details.filter(q=>q.strictlyShortest).length,longestStrategyCorrect,details};
};
const mappedCode = p => p.subject.match(/^\d{2}/)?.[0] || '00';
const exploreExposure = Object.fromEntries(codes.map(code=>[code,{total:0,knowledge_lens_probe:0,task_preference_probe:0,positions:{A:0,B:0,C:0,D:0},questionIds:[]} ]));
for (const q of explore) for (const [key,p] of Object.entries(q.optionProfiles)) {
  const row = exploreExposure[mappedCode(p)];
  row.total++;row[q.questionMode]++;row.positions[key]++;row.questionIds.push(q.id);
}
for (const row of Object.values(exploreExposure)) row.offeredQuestionCount = new Set(row.questionIds).size;
const firstPositionCounts = Object.fromEntries(['A','B','C','D'].map(key=>[key,histogram(explore.map(q=>mappedCode(q.optionProfiles[key])))]));
const rank = counts => codes.map(code=>({code,count:counts[code]||0})).sort((a,b)=>b.count-a.count||a.code.localeCompare(b.code));
const fixedPositionExplore = Object.fromEntries(Object.entries(firstPositionCounts).map(([key,counts])=>[key,{counts,ranked:rank(counts),strongest:rank(counts).filter(r=>r.count>0).slice(0,3),quiet:codes.filter(code=>!counts[code])}]));
const answerPositionBySubject = Object.fromEntries(codes.map(code=>[code,histogram(map.filter(q=>q.subject===code).map(q=>q.en.options.indexOf(q.en.answer)+1))]));
const fixedPositionMap = Object.fromEntries([1,2,3].map(position=>[position,{correct:map.filter(q=>q.en.options.indexOf(q.en.answer)+1===position).length,bySubject:Object.fromEntries(codes.map(code=>[code,{correct:answerPositionBySubject[code][position]||0,level:(answerPositionBySubject[code][position]||0)>=6?'green':(answerPositionBySubject[code][position]||0)>=4?'land':(answerPositionBySubject[code][position]||0)>=2?'snow':'ocean'}]))}]));
const choose = (n,k) => {let result=1; for(let i=1;i<=k;i++)result=result*(n-k+i)/i;return result;};
const binomialTail = threshold => Array.from({length:13-threshold},(_,i)=>threshold+i).reduce((sum,k)=>sum+choose(12,k)*(1/3)**k*(2/3)**(12-k),0);
const repeatsWithinMap = ['en','zh'].map(lang=>({lang,promptDuplicates:Object.entries(histogram(map.map(q=>q[lang].question))).filter(([,n])=>n>1),answerDuplicates:Object.entries(histogram(map.map(q=>q[lang].answer))).filter(([,n])=>n>1)}));
const metrics = {
  generatedAt:'2026-10-02',source:{extractedPath:'public/script.js',startLine:source.slice(0,start).split('\n').length,endLine:source.slice(0,end).split('\n').length-1,rootPublicIdentical:rootSource===publicSource,rootPublicQuestionFragmentIdentical:rootSource.slice(rootSource.indexOf('const subjectQuestionSeeds ='),rootSource.indexOf('const challengeSubjects ='))===source.slice(start,end),rootPublicExploreScoringFragmentIdentical:section(rootSource,'function getAllChallengeQuestions()','function renderQuickMirror()')===section(publicSource,'function getAllChallengeQuestions()','function renderQuickMirror()'),rootPublicMapScoringFragmentIdentical:section(rootSource,'function getMapChallengeMasteryFromCorrect(','function moveToNextMapChallengeQuestion(')===section(publicSource,'function getMapChallengeMasteryFromCorrect(','function moveToNextMapChallengeQuestion('),sha256:createHash('sha256').update(source).digest('hex'),rootSha256:createHash('sha256').update(rootSource).digest('hex')},
  map:{total:map.length,bySubject:histogram(map.map(q=>q.subject)),coverage:{broadCategories:audit.categories.length,narrowGroups:audit.categories.flatMap(c=>c.groups).length,detailedFields:audit.categories.flatMap(c=>c.groups.flatMap(g=>g.fields)).length,questionTags:Object.keys(map[0]),questionsWithDetailedFieldMetadata:map.filter(q=>q.field||q.fieldCode||q.detailedField||q.topic||q.learningObjective).length},uniqueIds:new Set(map.map(q=>q.id)).size,answerPositions:histogram(map.map(q=>q.en.options.indexOf(q.en.answer)+1)),answerPositionBySubject,answerPositionLanguagesAgree:map.every(q=>q.en.options.indexOf(q.en.answer)===q.zh.options.indexOf(q.zh.answer)),difficulty:histogram(map.map(q=>q.difficulty)),unlockLabel:histogram(map.map(q=>q.unlocksToward)),difficultyByQuestionIndex:map.filter(q=>q.subject==='00').map(q=>({id:q.id,difficulty:q.difficulty,unlocksToward:q.unlocksToward})),templateExplanationCounts:Object.fromEntries(['en','zh'].map(lang=>[lang,map.filter(q=>q[lang].explanation.includes(lang==='en'?'This answer turns the everyday scene into a practical knowledge pattern.':'这个答案把日常场景变成了一个可以理解的知识模式。')).length])),lengthMetrics:{en:{rawCodePoints:lengthMetrics('en','rawCodePoints'),nonWhitespaceCodePoints:lengthMetrics('en','nonWhitespaceCodePoints'),words:lengthMetrics('en','words')},zh:{rawCodePoints:lengthMetrics('zh','rawCodePoints'),nonWhitespaceCodePoints:lengthMetrics('zh','nonWhitespaceCodePoints')}},fixedPositionMap,randomGuessBaseline:{n:12,p:1/3,expectedCorrect:4,atLeast2:binomialTail(2),atLeast4:binomialTail(4),atLeast6:binomialTail(6),expectedFieldsAtLeast2:11*binomialTail(2),expectedFieldsAtLeast4:11*binomialTail(4),expectedFieldsAtLeast6:11*binomialTail(6)},repeatsWithinMap},
  explore:{total:explore.length,uniqueIds:new Set(explore.map(q=>q.id)).size,modes:histogram(explore.map(q=>q.questionMode)),subjectField:histogram(explore.map(q=>q.subject)),scenarios:histogram(explore.map(q=>q.scenarioType)),profileExposure:exploreExposure,uniformChoiceExpected:Object.fromEntries(codes.map(code=>[code,{expectedCount:exploreExposure[code].total/4,zeroChoiceProbability:explore.reduce((probability,q)=>probability*(1-Object.values(q.optionProfiles).filter(p=>mappedCode(p)===code).length/4),1)}])),fixedPositionExplore,questionOptionsRepeatSameCode:explore.filter(q=>new Set(Object.values(q.optionProfiles).map(mappedCode)).size<4).map(q=>q.id)}
};
writeJson('metrics-current.json',metrics);
console.log(JSON.stringify({source:metrics.source,map:{total:metrics.map.total,answerPositions:metrics.map.answerPositions,answerPositionBySubject,templateExplanationCounts:metrics.map.templateExplanationCounts,longestRaw:{en:metrics.map.lengthMetrics.en.rawCodePoints.strictlyLongest,zh:metrics.map.lengthMetrics.zh.rawCodePoints.strictlyLongest},longestNonWhitespace:{en:metrics.map.lengthMetrics.en.nonWhitespaceCodePoints.strictlyLongest,zh:metrics.map.lengthMetrics.zh.nonWhitespaceCodePoints.strictlyLongest},longestEnglishWords:metrics.map.lengthMetrics.en.words.strictlyLongest,randomGuessBaseline:metrics.map.randomGuessBaseline},explore:{total:metrics.explore.total,modes:metrics.explore.modes,exposures:Object.fromEntries(codes.map(c=>[c,exploreExposure[c].total])),fixedPositionExplore}},null,2));
