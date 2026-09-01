import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { classifySensitiveContent, deterministicValidate, loadPolicyBinding, validateFinalReviewDecision, HARD_GATE_NAMES } from '../governance.mjs';
import { sensitiveStatus } from '../major-fields-run.mjs';

const root = new URL('../', import.meta.url);
const cfg = JSON.parse(await readFile(new URL('factory-config.json', root), 'utf8'));
const binding = await loadPolicyBinding({factoryDir:root.pathname,expected:cfg.policyBinding});
for (const [code,title,names] of [
  ['02','Arts and Humanities',['Religion and theology','History and archaeology','Philosophy and ethics']],
  ['03','Social Sciences, Journalism and Information',['Economics','Political sciences and civics','Psychology','Journalism and reporting']],
]) {
  const result = sensitiveStatus({code,title,subjects:names.map(name=>({name}))});
  assert.equal(result.status,'CLEAR');
  assert.equal(result.semanticReviewRequired,true);
  assert.ok(result.reviewTopics.length);
  assert.equal(deterministicValidate({fieldId:code,artifactType:'FIELD_OVERVIEW',policyBinding:binding,sensitiveContent:result}).productionEligible,false);
}
assert.equal(classifySensitiveContent({fieldId:'0221',fieldName:'Religion and theology',text:'Religious studies examines practices and texts; theology may reason within a tradition.'}).status,'CLEAR');
assert.equal(classifySensitiveContent({fieldId:'0312',text:'Political science compares institutions, elections and collective decisions.'}).status,'CLEAR');
assert.equal(classifySensitiveContent({text:'Do not tell the viewer to vote for a candidate. Avoid spreading ideological propaganda.'}).status,'CLEAR');
assert.equal(classifySensitiveContent({text:'Do not invent sources. Vote for our candidate.'}).status,'SENSITIVE_TOPIC_REVIEW_REQUIRED');
assert.equal(classifySensitiveContent({fieldId:'0313',text:'Our religion is superior to all others.'}).status,'SENSITIVE_TOPIC_REVIEW_REQUIRED');
assert.equal(classifySensitiveContent({highRiskCentralTopic:true,text:'Contemporary partisan advocacy'}).status,'SENSITIVE_TOPIC_REVIEW_REQUIRED');
assert.equal(classifySensitiveContent({uncertain:true}).status,'POLICY_CLARIFICATION_REQUIRED');

const pass = {schemaVersion:'final-review-decision.v1',runId:'test-run',fieldId:'02',artifactType:'FIELD_OVERVIEW',policyBinding:binding,reviewerRole:'independent_reviewer',decision:'PASS',evidenceSufficient:true,reasonCodes:[],hardGates:Object.fromEntries(HARD_GATE_NAMES.map(n=>[n,'PASS'])),findings:[]};
assert.ok(validateFinalReviewDecision(pass).some(e=>e.includes('sensitiveContentAssessment')));
const assessed = {...pass,sensitiveContentAssessment:{scope:'NECESSARY_NEUTRAL_COVERAGE',summary:'Necessary field coverage was reviewed.',evidence:[{artifactLocation:'overview.md:religion',excerpt:'Religious studies examines practices and texts.',necessity:'This is a real humanities branch.',neutrality:'Descriptive, attributed; no belief is endorsed.',factualStatus:'Institutional field definition.',sourceRefs:['https://example.org/academic-field-definition']} ]}};
assert.deepEqual(validateFinalReviewDecision(assessed),[]);
assert.ok(validateFinalReviewDecision({...assessed,reviewerRole:'creator_self_check'}).length);
assert.ok(validateFinalReviewDecision({...pass,sensitiveContentAssessment:{scope:'HIGH_RISK_OR_UNCERTAIN',summary:'Unresolved',evidence:[]}}).length);
assert.ok(validateFinalReviewDecision({...assessed,sensitiveContentAssessment:{...assessed.sensitiveContentAssessment,evidence:[{...assessed.sensitiveContentAssessment.evidence[0],sourceRefs:[]}]}}).length);
await assert.rejects(()=>loadPolicyBinding({factoryDir:root.pathname,expected:{...cfg.policyBinding,creating:{...cfg.policyBinding.creating,version:'v9.9'}}}),/expected version/);

const history = {
  'mapkai-creating-policy-v1.0.md':'dd69eb74809f7bf39c624f071c64e478649ad0014998166d69568be95db48152',
  'mapkai-creating-policy-v1.1.md':'ea27858cd695f20c06b4e85b2eac3e1dfc4442cb36e6eccf596fab609cb0af4b',
  'mapkai-creating-policy-v1.2.md':'28deb28a8da63372e52e981d34579c8cabce3b5f3de91fc88f26476599144058',
  'mapkai-review-policy-v1.0.md':'2f56f3e2c46a00e2fbfc5314a3a57009e020839ebf933838a329b48ee0ea0f8c',
  'mapkai-review-policy-v1.1.md':'718562701d147a5194548e58352c4e7ad38b262f8be78d41448357c142369020',
};
for (const [file,digest] of Object.entries(history)) assert.equal(createHash('sha256').update(await readFile(new URL('policy/'+file,root))).digest('hex'),digest);
console.log('sensitive governance: neutral knowledge, high-risk holds, independent evidence, version/hash and immutable history checks passed');
