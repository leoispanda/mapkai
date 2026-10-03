import {readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const outDir=dirname(fileURLToPath(import.meta.url));
const source=readFileSync(resolve(outDir,'../../public/script.js'),'utf8');
const map=JSON.parse(readFileSync(resolve(outDir,'map-132-current.json')));
const explore=JSON.parse(readFileSync(resolve(outDir,'explore-20-current.json')));
const codes=[...new Set(map.map(q=>q.subject))].sort();
const fragment=(from,to)=>{
  const start=source.indexOf(from),end=source.indexOf(to,start);
  if(start<0||end<0)throw new Error(`Missing marker ${from}`);
  return source.slice(start,end);
};
const resultCode=fragment('function getKnowledgeLensResult()', 'function formatLensList(');
const setupResult=`const challengeSubjects=${JSON.stringify(codes)};let challengeHistory=[];function getLensSubjectCode(p){return String(p.subject).match(/^\\d{2}/)[0];}function getKnowledgeLensName(code){return code;}function buildModeSummary(items,type){return {items,type};}`;
const resultContext=vm.createContext({explore});
vm.runInContext(setupResult+'\n'+resultCode,resultContext);
const fixedPosition={};
for(const key of ['A','B','C','D']) {
  resultContext.selectedKey=key;
  vm.runInContext('challengeHistory=explore.map(question=>({question,profile:question.optionProfiles[selectedKey]}));this.result=getKnowledgeLensResult();',resultContext);
  fixedPosition[key]=JSON.parse(JSON.stringify(resultContext.result));
}

const questionBank=Object.fromEntries(codes.map(code=>[code,{questions:map.filter(q=>q.subject===code),unlockRule:{snow:2,land:4,green:6}}]));
const saved={subjects:{'10':{correct:1,answered:['10-q1']}},history:[{subjectCode:'10',questionId:'10-q1',correct:true}]};
let storage=JSON.stringify(saved);
const reloadContext=vm.createContext({questionBank,codes,localStorage:{getItem:()=>storage,setItem:(_key,value)=>{storage=value;}}});
const setupMap=`const challengeSubjects=codes;const mapChallengeKey="test";let mapChallengeState=Object.fromEntries(codes.map(code=>[code,{correct:0,answered:[]}]));let mapChallengeProgress={};let mapChallengeHistory=[];let mapChallengeQuestionPool=[];let mapChallengePoolIndex=0;let mapChallengeComplete=false;let activeMapChallengeSubject=null;let activeMapChallengeQuestion=null;let currentMapChallengeResult=null;function shuffleQuestions(items){return [...items];}function getQuestionContent(q){return q.zh;}function renderMapChallenge(){}function drawKnowledgeMap(){}`;
const mapProgressCode=fragment('function getMapChallengeMasteryFromCorrect(', 'function resetMapChallenge(');
const answerCode=fragment('function answerMapChallenge(', 'function moveToNextMapChallengeQuestion(');
vm.runInContext(setupMap+'\n'+mapProgressCode+'\n'+answerCode,reloadContext);
vm.runInContext('loadMapChallengeProgress();setRandomMapChallengeQuestion();this.before={activeQuestion:activeMapChallengeQuestion.id,correct:mapChallengeState["10"].correct,answered:[...mapChallengeState["10"].answered],historyCount:mapChallengeHistory.length,poolSize:mapChallengeQuestionPool.length};answerMapChallenge(activeMapChallengeQuestion.zh.options.indexOf(activeMapChallengeQuestion.zh.answer));this.after={correct:mapChallengeState["10"].correct,answered:[...mapChallengeState["10"].answered],historyCount:mapChallengeHistory.length,level:mapChallengeProgress["10"]};',reloadContext);
const results={description:'Run selected original pure/runtime functions in isolated VM; no whole-site startup, live DOM, network, real browser storage, or website modifications.',fixedPosition,reloadDuplicateCounterexample:{shuffle:'identity permutation, chosen to make a saved old question be first; the production shuffle can also generate this order',saved,before:JSON.parse(JSON.stringify(reloadContext.before)),after:JSON.parse(JSON.stringify(reloadContext.after))}};
writeFileSync(resolve(outDir,'isolated-runtime-results.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({fixedPosition:Object.fromEntries(Object.entries(fixedPosition).map(([key,result])=>[key,{strongest:result.strongest,quiet:result.quiet}])),reloadDuplicateCounterexample:results.reloadDuplicateCounterexample},null,2));
