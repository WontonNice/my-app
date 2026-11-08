const {test} = require('node:test'), assert = require('node:assert/strict');
const {registerExponents, templates} = require('./register-exponents-batch.cjs');
const {defaultPracticeCatalog, reviewPracticePublication, reviewedGeneratorChange, managedGeneratorIds, studentPracticeCatalog, generatorReviewSignature} = require('../server/src/shared/practiceCatalog.ts');
const {isExamQuestionCorrect} = require('../server/src/shared/examGrading.ts');
const {createPracticeState, parsePracticeState, checkPracticeAnswer, nextPracticeQuestion, currentPracticeGeneratorId} = require('../client/src/features/math-command/inequalitySession.ts');
const {practiceQuestion} = require('../client/src/features/math-command/practicePreview.ts');
const {modulePreviewCatalog} = require('../client/src/features/math-command/generatorPreview.ts');
const katex = require('katex');
// Independent rational arithmetic checks displayed scientific notation without binary rounding.
const rational = text => {const [whole, fraction=''] = text.split('.'); return [BigInt(whole + fraction), 10n ** BigInt(fraction.length)];};
function scientific(text) {
  const [,coefficient,exponent] = text.match(/^([\d.]+)\\times10\^\{(-?\d+)\}$/);
  let [n,d] = rational(coefficient), e = Number(exponent);
  assert.ok(Number(coefficient) >= 1 && Number(coefficient) < 10);
  if (e >= 0) n *= 10n ** BigInt(e); else d *= 10n ** BigInt(-e);
  return [n,d];
}
function renderMath(text) {
  for (const match of text.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)) katex.renderToString(match[1] ?? match[2], {throwOnError: true, strict: 'error'});
}
for (const [family,t] of templates.entries()) test(`${t.title}: every variant has unique prompt, correct key, distinct choices and valid math`, () => {
  const stems = new Set(), letters = new Set(), boundaries = new Set(); let sourceSeen = false;
  for (let index=0; index<t.distinctCount; index++) {
    const q = t.generate(index,'exhaust').question;
    assert.ok(!stems.has(q.prompt)); stems.add(q.prompt);
    assert.equal(q.skilled,'TBD'); assert.equal(q.topic,t.category); assert.equal(q.subtopic,t.topic);
    assert.ok(q.explanation.length > 100); assert.doesNotMatch(q.prompt+q.explanation,/undefined|NaN|Infinity/);
    renderMath(q.prompt); renderMath(q.explanation);
    let answer, values;
    if (family===0) {
      const [,a,m,b,n] = q.prompt.match(/(\d+)\^\{(\d+)\}\+(\d+)\^\{(\d+)\}/).map(Number);
      const power = (base, exponent) => Array(exponent).fill(base).reduce((x,y)=>x*y,1);
      answer = power(a,m)+power(b,n); values = q.choices.map(c=>+c.math);
      sourceSeen ||= a===3 && m===4 && b===7 && n===4;
    } else if (family===1) {
      const [,k,a,d,c] = q.prompt.match(/(\d+)\((\d+)\+0\.(\d)\)\^2-(\d+)/).map(Number);
      // Expansion independently checks the missing-cross-term misconception.
      answer = k*a*a + 2*k*a*d/10 + k*d*d/100 - c; values = q.choices.map(c=>+c.math);
      sourceSeen ||= k===100 && a===2 && d===1 && c===100;
      assert.ok(q.explanation.includes(String(answer)));
    } else if (family===2) {
      const [a,b,c] = [...q.prompt.matchAll(/p\^\{(-?\d+)\}/g)].map(m=>+m[1]);
      assert.match(q.prompt,/p\\ne0/); answer = a+b-c;
      values = q.choices.map(c=>+c.math.match(/^p\^\{(-?\d+)\}$/)[1]);
      for (const base of [2,3]) assert.ok(Math.abs((base**a * base**b / base**c) / base**answer - 1) < 1e-10);
      boundaries.add(Math.sign(answer)); if(b===0)boundaries.add('zero-factor'); if(c<0)boundaries.add('negative-denominator');
      sourceSeen ||= a===12 && b===0 && c===-4;
    } else if (family===3) {
      assert.equal(q.type,'short_response'); assert.equal(q.entryControl,'text');
      const [a,b] = [...q.prompt.matchAll(/\\sqrt\{(\d+)\}/g)].map(m=>+m[1]);
      answer = Math.sqrt(a)*Math.sqrt(b); assert.ok(Number.isInteger(answer));
      assert.equal(q.correctTextAnswers[0],String(answer));
      for(const response of [String(answer),` ${answer} `]) assert.equal(isExamQuestionCorrect(q,response),true);
      for(const response of ['',String(-answer),String(answer+1),'NaN','Infinity','1/','abc'])assert.equal(isExamQuestionCorrect(q,response),false);
      sourceSeen ||= a===16 && b===196;
      continue;
    } else {
      const [,x,a,y,b] = q.prompt.match(/\\frac\{([\d.]+)\\times10\^\{(-?\d+)\}\}\{([\d.]+)\\times10\^\{(-?\d+)\}\}/);
      const [xn,xd] = rational(x), [yn,yd] = rational(y), exponent = +a - +b;
      let expectedN=xn*yd, expectedD=xd*yn;
      if(exponent>=0)expectedN*=10n**BigInt(exponent);else expectedD*=10n**BigInt(-exponent);
      values=q.choices.map(c=>scientific(c.math));
      const matches=values.map(([n,d])=>n*expectedD===expectedN*d);
      assert.equal(matches.filter(Boolean).length,1); assert.ok(matches[q.choices.findIndex(c=>c.id===q.correctChoiceId)]);
      for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)assert.notEqual(values[i][0]*values[j][1],values[j][0]*values[i][1]);
      const quotient=Number(x)/Number(y);boundaries.add(quotient<1?'small':quotient>=10?'large':'normal');
      sourceSeen ||= x==='15.3' && a==='-8' && y==='1.5' && b==='4';
    }
    assert.equal(q.type,'multiple_choice'); assert.equal(q.choices.length,4);
    if(family!==4){assert.equal(new Set(values).size,4); assert.equal(values[q.choices.findIndex(c=>c.id===q.correctChoiceId)],answer);}
    for(const choice of q.choices){katex.renderToString(choice.math,{throwOnError:true,strict:'error'});assert.equal(isExamQuestionCorrect(q,choice.id),choice.id===q.correctChoiceId);}
    letters.add(q.correctChoiceId);
  }
  assert.ok(sourceSeen,'Includes original source parameters'); assert.equal(stems.size,t.distinctCount);
  if(family!==3)assert.equal(letters.size,4);
  if(family===2)assert.deepEqual(boundaries,new Set([-1,0,1,'zero-factor','negative-denominator']));
  if(family===4)assert.deepEqual(boundaries,new Set(['small','normal','large']));
});
test('deterministic seeds and documented finite cycles preserve distinct response IDs',()=>{
  for(const t of templates){
    assert.deepEqual(t.generate(17,'replay'),t.generate(17,'replay'));
    const first=t.generate(0,'replay').question,repeated=t.generate(t.distinctCount,'replay').question;
    assert.equal(first.prompt,repeated.prompt);assert.notEqual(first.id,repeated.id);
    assert.notEqual(first.prompt,t.generate(0,'another').question.prompt);
    assert.doesNotThrow(()=>t.generate(Number.MAX_SAFE_INTEGER));
    for(const index of [-1,.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>t.generate(index));
  }
});
test('mixed families do not share an answer-letter sequence or a repeating four-answer pattern',()=>{
  for(const seed of ['student-flow','preview','cohort-practice']){
    const runs=templates.filter(t=>t!==templates[3]).map(t=>Array.from({length:32},(_,i)=>t.generate(i,seed).question.correctChoiceId));
    for(const run of runs){assert.equal(new Set(run).size,4);assert.ok(run.some((letter,i)=>i>=4&&letter!==run[i%4]));}
    for(let i=0;i<runs.length;i++)for(let j=i+1;j<runs.length;j++)assert.notDeepEqual(runs[i],runs[j]);
  }
});
function fixture(){const c=defaultPracticeCatalog(require('./math-topics.json'));c.generators=c.generators.filter(g=>!templates.some(t=>t.id===g.id));return c;}
function approved(c){return {...c,generators:c.generators.map(g=>templates.some(t=>t.id===g.id)?reviewedGeneratorChange(g,{...g,enabled:true},true):g)};}
test('exact registration creates one hidden module, preserves resources, and is idempotent',()=>{
  const before=fixture(),snapshot=structuredClone(before),draft=registerExponents(before),module=draft.modules.find(m=>m.id===templates[0].moduleId);
  assert.deepEqual(before,snapshot);assert.equal(draft.modules.length,before.modules.length+1);assert.equal(module.published,false);
  assert.deepEqual(module.generatorIds,templates.map(t=>t.id));assert.equal(module.skilled,'TBD');
  for(const t of templates){const g=draft.generators.find(g=>g.id===t.id);assert.deepEqual(g.sourceQuestionIds,[t.sourceId]);assert.deepEqual(g.skills,[]);assert.equal(g.enabled,false);assert.equal(g.reviewRequired,true);}
  assert.deepEqual(registerExponents(draft),draft);
  const customized={...draft,modules:draft.modules.map(m=>m.id===module.id?{...m,title:'My custom name',description:'Keep this description'}:m)};
  assert.deepEqual(registerExponents(customized),customized);
  const stale=structuredClone(before);stale.modules=stale.modules.filter(m=>m.id!==templates[0].destination.parentId);assert.throws(()=>registerExponents(stale),/Stale destination/);
});
test('review gate requires matching approval, and hidden reviewed content stays out of both student modes',()=>{
  const before=fixture(),draft=registerExponents(before),unreviewed={...draft,generators:draft.generators.map(g=>templates.some(t=>t.id===g.id)?{...g,enabled:true}:g)};
  assert.throws(()=>reviewPracticePublication(before,unreviewed),/review and approve/);
  const ready=reviewPracticePublication(before,approved(draft));
  for(const t of templates){const g=ready.generators.find(g=>g.id===t.id);assert.equal(g.reviewedSignature,generatorReviewSignature(g));}
  const student=studentPracticeCatalog(ready);assert.ok(!student.modules.some(m=>m.id===templates[0].moduleId));assert.ok(!student.generators.some(g=>templates.some(t=>t.id===g.id)));
  const changed=structuredClone(ready);changed.generators.find(g=>g.id===templates[0].id).settings={minCoefficient:2};assert.throws(()=>reviewPracticePublication(ready,changed),/review and approve/);
});
test('mixed module grades all five families, advances, and resumes saved sessions without changing history',()=>{
  const ready=approved(registerExponents(fixture())),module=ready.modules.find(m=>m.id===templates[0].moduleId),preview=modulePreviewCatalog(module,ready);
  assert.deepEqual(managedGeneratorIds(module,ready),templates.map(t=>t.id));
  let state=createPracticeState('generator-preview','student-flow',preview);const counts=new Map();
  for(let i=0;i<25;i++){
    const q=practiceQuestion(state),id=currentPracticeGeneratorId(state);counts.set(id,(counts.get(id)??0)+1);
    const answer=q.correctChoiceId??q.correctTextAnswers[0];state=checkPracticeAnswer({...state,answer},isExamQuestionCorrect(q,answer));
    assert.equal(state.submitted,true);assert.equal(state.correct,i+1);
    const restored=parsePracticeState(JSON.stringify(state));assert.deepEqual(restored,state);assert.deepEqual(practiceQuestion(restored),q);
    state=nextPracticeQuestion(restored);
  }
  assert.deepEqual([...counts.values()],[5,5,5,5,5]);assert.equal(state.responses.length,25);assert.equal(state.longestStreak,25);
  const old=createPracticeState('inequalities','existing',fixture());assert.deepEqual(practiceQuestion(parsePracticeState(JSON.stringify(old))),practiceQuestion(old));
  const published={...ready,modules:ready.modules.map(m=>m.id===module.id?{...m,published:true}:m)};
  const student=studentPracticeCatalog(reviewPracticePublication(ready,published));assert.ok(createPracticeState(module.id,'launch',student));
  for(const group of student.modules.filter(m=>m.defaultType&&m.topic===module.topic))assert.deepEqual(managedGeneratorIds(group,student),module.generatorIds);
});
