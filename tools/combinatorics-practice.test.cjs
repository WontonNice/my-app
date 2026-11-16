const {test}=require('node:test'),assert=require('node:assert/strict');
require('./register-practice-generator.cjs'); // registers ts-node for the server TypeScript modules
const {combinatoricsPractice:templates}=require('../server/src/shared/combinatoricsPractice.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {defaultPracticeCatalog,validatePracticeCatalog,studentPracticeCatalog,recommendedPracticeCatalog,reviewPracticePublication,generateCatalogQuestion,generatorAvailable}=require('../server/src/shared/practiceCatalog.ts');
const {withRecommendedPractice,combinatoricsRecommendedModuleId,existingCombinatoricsGeneratorIds}=require('../server/src/shared/recommendedPractice.ts');
const taxonomy=require('./math-topics.json');

const fact=n=>n<=1?1:n*fact(n-1),P=(n,r)=>fact(n)/fact(n-r),C=(n,r)=>r<0||r>n?0:P(n,r)/fact(r);
const num=text=>Number(String(text).replace(/[$,]/g,''));
const answerText=q=>q.choices.find(c=>c.id===q.correctChoiceId).text;
// Independent solvers read the numbers shown to the student, not the generator internals.
const solvers={
  'combinatorics-counting-principle-routes-v1':p=>{const [a,b,c]=[...p.matchAll(/There are (\d+)|, (\d+) different|and (\d+) different/g)].map(m=>+(m[1]||m[2]||m[3]));return a*b*c;},
  'combinatorics-one-from-each-group-v1':p=>[...p.matchAll(/\\text\{[^}]+\} & (\d+)/g)].reduce((t,m)=>t*+m[1],1),
  'combinatorics-arrange-all-v1':p=>fact(+p.match(/(\d+)(?:-digit| different books| runners| friends)/)[1]),
  'combinatorics-ordered-selection-v1':p=>{const n=+p.match(/(\d+) (?:different colors|members|students are|letters)/)[1];const r=/window frame|secretary|Gold|using 3/.test(p)?3:2;return P(n,r);},
  'combinatorics-unordered-groups-v1':p=>{const [,n]=p.match(/(\d+) (?:different cookies|different books|different toppings|students to form)/);const r=+p.match(/(?:choose|bring|chooses) (\d+)/)[1];return C(+n,r);},
  'combinatorics-groups-including-one-v1':p=>{const n=+p.match(/(?:one of|of) (\d+) (?:members|students|swimmers)/)[1];const r=/pairs/.test(p)&&!/groups of 3/.test(p)?2:+(p.match(/choose (\d+)/)?.[1]??(/groups of 3/.test(p)?3:/(?:If|pick) (\d+)/.exec(p)[1]));return C(n-1,r-1);},
  'combinatorics-every-pair-cost-v1':p=>{const n=+p.match(/(\d+) (?:brands|teams|different recipes)/)[1],cost=num(p.match(/\$([\d,]+)/)[1]);return C(n,2)*cost;},
  'combinatorics-size-and-toppings-v1':p=>{const [,s,t]=p.match(/choice of (\d+) sizes .*? and (\d+) different/);const k=+p.match(/exactly (\d+) different/)[1];return +s*C(+t,k);},
  'combinatorics-committee-exact-mix-v1':p=>{const n=+p.match(/(?:hired|holds|has) (\d+)/)[1],m=+p.match(/(?:If |: )(\d+) (?:of the|are)/)[1],k=+p.match(/(?:Of these \d+ people, |take |choose )(\d+)/)[1],j=+p.match(/exactly (\d+)/)[1];return C(m,j)*C(n-m,k-j);},
};

for(const t of templates)test(`${t.title}: every case is unique, correct, and graded`,()=>{
  const stems=new Set();
  assert.equal(t.category,'Statistics and Probability');assert.equal(t.topic,'Counting & Sets');assert.ok(t.sourceQuestionIds.length);
  for(let index=0;index<t.distinctCount;index++){
    const q=t.generate(index,'exhaust').question;
    assert.ok(!stems.has(q.prompt),q.prompt);stems.add(q.prompt);
    assert.equal(q.type,'multiple_choice');assert.equal(q.choices.length,4);
    assert.ok(!/undefined|NaN|Infinity|\[object/.test(q.prompt+q.explanation+JSON.stringify(q.choices)),q.prompt);
    // Stay within 9th-grade SHSAT scope: no factorial or nPr/nCr notation.
    assert.ok(!/\d!|[nr]!|\\binom|_\{?\d*\}?[PC]|[PC]\(\d/.test(q.prompt+q.explanation),q.explanation);
    // Existing generators already cover the original paint and cookie stories.
    assert.ok(!/colors of paint|cookies on a plate/.test(q.prompt),q.prompt);
    assert.equal(new Set(q.choices.map(c=>c.text)).size,4,q.prompt);
    for(const c of q.choices)assert.equal(isExamQuestionCorrect(q,c.id),c.id===q.correctChoiceId);
    if(solvers[t.id])assert.equal(num(answerText(q)),solvers[t.id](q.prompt),q.prompt);
    else{
      const values=q.prompt.match(/\\\{([\d,]+)\\\}/)[1].split(',').map(Number),odds=values.filter(v=>v%2).length,total=C(values.length,2),odd=C(odds,2),want=/are odd/.test(q.prompt)?odd:total-odd;
      const [n,d]=(answerText(q).includes('/')?answerText(q).split('/'):[answerText(q),1]).map(Number);assert.equal(n*total,want*d,q.prompt);
    }
  }
  // The stream keeps going after one full cycle.
  assert.equal(t.generate(t.distinctCount,'exhaust').question.prompt,t.generate(0,'exhaust').question.prompt);
  assert.ok(t.generate(123456,'student-seed').question.prompt);
});

test('Recommended combinatorics module validates, reaches students, and survives a studio save',()=>{
  const stored=defaultPracticeCatalog(taxonomy);
  const injected=withRecommendedPractice(stored);
  const validated=validatePracticeCatalog(injected,taxonomy);
  const module=validated.recommended.flatMap(c=>c.modules).find(m=>m.id===combinatoricsRecommendedModuleId);
  assert.ok(module.published);assert.equal(module.generatorIds.length,existingCombinatoricsGeneratorIds.length+templates.length);
  for(const id of existingCombinatoricsGeneratorIds)assert.ok(module.generatorIds.includes(id),id);
  // A catalog missing one of the existing generators must still validate.
  const trimmed={...stored,generators:stored.generators.filter(g=>g.id!==existingCombinatoricsGeneratorIds[0])};
  assert.ok(!validatePracticeCatalog(withRecommendedPractice(trimmed),taxonomy).recommended.flatMap(c=>c.modules).find(m=>m.id===combinatoricsRecommendedModuleId).generatorIds.includes(existingCombinatoricsGeneratorIds[0]));
  for(const template of templates)assert.ok(generatorAvailable(validated.generators.find(g=>g.id===template.id)));
  const student=studentPracticeCatalog(validated);
  const player=recommendedPracticeCatalog(student,combinatoricsRecommendedModuleId);
  // The default catalog keeps the older batch generators disabled, so only enabled ones reach students.
  assert.equal(player.generators.length,module.generatorIds.filter(id=>generatorAvailable(validated.generators.find(g=>g.id===id))).length);
  for(const [index,generator] of player.generators.entries())assert.equal(generateCatalogQuestion(generator,index,'seed',3).subtopic,'Counting & Sets');
  assert.doesNotThrow(()=>reviewPracticePublication(stored,validated));
  // Idempotent, and a teacher's saved edits win over the shipped defaults.
  assert.deepEqual(withRecommendedPractice(validated),validated);
  const disabled={...validated,generators:validated.generators.map(g=>g.id===templates[0].id?{...g,enabled:false}:g)};
  assert.equal(withRecommendedPractice(disabled).generators.find(g=>g.id===templates[0].id).enabled,false);
});
