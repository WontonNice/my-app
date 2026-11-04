const {test}=require('node:test'),assert=require('node:assert/strict');
const {templates}=require('./register-algebra-planner.cjs');
const {addBuiltinPractice,enableBuiltinPractices,publishBuiltinDestinations}=require('./register-practice-generator.cjs');
const {defaultPracticeCatalog,managedGeneratorIds,studentPracticeCatalog,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
const {isExamQuestionCorrect}=require('../server/src/shared/examGrading.ts');
const {createPracticeState,parsePracticeState}=require('../client/src/features/math-command/inequalitySession.ts');
const {practiceQuestion}=require('../client/src/features/math-command/practicePreview.ts');

// Independent arithmetic parser, including implicit multiplication. No generator metadata or answers.
function evaluate(raw,vars={}){
 const tokens=raw.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g,'(($1)/($2))').match(/\d+(?:\.\d+)?|[a-z]|[()+*/-]/g)||[];let at=0;
 function atom(){const token=tokens[at++];if(token==='-')return -atom();if(token==='+')return atom();if(token==='('){const v=sum();assert.equal(tokens[at++],')');return v;}if(/^[a-z]$/.test(token)){assert.ok(token in vars);return vars[token];}assert.ok(/^\d/.test(token));return Number(token);}
 function product(){let value=atom();while(at<tokens.length&&tokens[at]!==')'&&tokens[at]!=='+'&&tokens[at]!=='-'){const op=tokens[at];if(op==='*'||op==='/')at++;const next=atom();value=op==='/'?value/next:value*next;}return value;}
 function sum(){let value=product();while(tokens[at]==='+'||tokens[at]==='-'){const op=tokens[at++];value+=(op==='+'?1:-1)*product();}return value;}
 const result=sum();assert.equal(at,tokens.length);return result;
}
const close=(a,b)=>Math.abs(a-b)<1e-8;
const math=q=>[...q.prompt.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g)].map(m=>m[1]??m[2]);
function graph(choice){
 const svg=decodeURIComponent(choice.image.src.split(',').slice(1).join(','));assert.ok(!/<script|https?:|onload=/.test(svg.replace('http://www.w3.org/2000/svg','')));
 const labels=[...svg.matchAll(/<text x="([\d.]+)"[^>]*>(-?\d+)<\/text>/g)].map(m=>({x:+m[1],v:+m[2]}));assert.ok(labels.length>=2);
 const first=labels[0],last=labels.find(p=>p.v!==first.v),unit=(last.x-first.x)/(last.v-first.v),value=x=>first.v+(x-first.x)/unit;
 const circles=[...svg.matchAll(/<circle cx="([\d.]+)"[^>]*fill="([^"]+)"/g)];assert.equal(circles.length,2);
 const segments=[...svg.matchAll(/<path d="M([\d.]+),30H([\d.]+)" stroke="#123b61"/g)];assert.ok([1,2].includes(segments.length));
 const low=Math.round(value(+circles[0][1])),high=Math.round(value(+circles[1][1]));assert.ok(close(low,value(+circles[0][1]))&&close(high,value(+circles[1][1])));assert.ok(low<high);
 const model={low,high,outside:segments.length===2,leftClosed:circles[0][2]!=='white',rightClosed:circles[1][2]!=='white'};
 for(const segment of segments){assert.ok(+segment[1]>=20&&+segment[2]<=380);assert.ok(+segment[1]<+segment[2]);}
 if(model.outside){assert.ok(close(value(+segments[0][2]),low));assert.ok(close(value(+segments[1][1]),high));}
 else{assert.ok(close(value(+segments[0][1]),low));assert.ok(close(value(+segments[0][2]),high));}
 return model;
}
function graphContains(g,x){const l=close(x,g.low),r=close(x,g.high);return g.outside?(x<g.low&&!l||x>g.high&&!r||l&&g.leftClosed||r&&g.rightClosed):((x>g.low||l&&g.leftClosed)&&(x<g.high||r&&g.rightClosed));}
const sourceSeen=new Set();
for(const [family,t]of templates.entries())test(`${t.title}: exhaust ${t.distinctCount} distinct stems and solve displayed inputs independently`,()=>{
 const stems=new Set(),letters=new Set();
 for(let i=0;i<t.distinctCount;i++){
  const q=t.generate(i,'exhaust').question,parts=math(q);assert.ok(!stems.has(q.prompt),q.prompt);stems.add(q.prompt);
  assert.equal(q.topic,t.category);assert.equal(q.subtopic,t.topic);assert.ok(q.explanation.length>80);assert.ok(!/NaN|undefined|Infinity/.test(q.prompt+q.explanation));
  let expected,answers;
  if(family===0){expected=evaluate(parts[0],{x:1})-evaluate(parts[0],{x:0});assert.equal(q.type,'numeric_entry');assert.ok(close(Number(q.correctTextAnswers[0]),expected));assert.ok(isExamQuestionCorrect(q,String(Number(expected.toFixed(4)))));assert.ok(isExamQuestionCorrect(q,Number(expected.toFixed(4)).toFixed(3)));assert.ok(!isExamQuestionCorrect(q,String(expected+1)));if(parts[0]==='\\frac{3}{5}(2x+5)-2x'){sourceSeen.add(family);assert.ok(close(expected,-0.8));}}
  else if(family===1){const k=+parts[0].match(/y=(\d+)x/)[1];answers=q.choices.filter(c=>[-3,0,2].every(x=>close(evaluate(c.math,{x}),evaluate(parts[1],{x,y:k*x})))).map(c=>c.id);if(k===4&&parts[1]==='3y+2(3y+5)-x'){sourceSeen.add(family);assert.ok(q.choices.some(c=>c.math==='35x+10'));}}
  else if(family===2){const [left,relation,right]=parts[0].split(/([<>])/);const lc=evaluate(left,{x:1})-evaluate(left,{x:0}),rc=evaluate(right,{x:1})-evaluate(right,{x:0}),edge=(evaluate(right,{x:0})-evaluate(left,{x:0}))/(lc-rc);const compare=(a,b,op)=>op==='<'?a<b:a>b;
   answers=q.choices.filter(c=>{const m=c.math.match(/^x([<>])(-?\d+)$/);return [edge-2,edge,edge+2,0].every(x=>compare(evaluate(left,{x}),evaluate(right,{x}),relation)===compare(x,+m[2],m[1]));}).map(c=>c.id);if(parts[0]==='6x-20<5x-2(5-3x)'){sourceSeen.add(family);assert.equal(edge,-2);}}
  else if(family===3||family===5){let predicate,edges;
   if(family===3){const m=parts[0].match(/^\|x([+-]\d+)?\|(>|<|\\geq|\\leq)(\d+)$/),h=+(m[1]||0),r=+m[3],relation=m[2];predicate=x=>relation==='>'?Math.abs(x+h)>r:relation==='<'?Math.abs(x+h)<r:relation==='\\geq'?Math.abs(x+h)>=r:Math.abs(x+h)<=r;edges=[-h-r,-h+r];if(h===1&&r===2&&relation==='\\geq')sourceSeen.add(family);}
   else{const m=parts[0].match(/^(-?\d+)(<|\\leq)\\frac\{x\}\{(\d+)\}(<|\\leq)(\d+)$/),a=+m[1],b=+m[5],d=+m[3];predicate=x=>(m[2]==='<'?a<x/d:a<=x/d)&&(m[4]==='<'?x/d<b:x/d<=b);edges=[a*d,b*d];if(a===-4&&b===2&&d===2&&m[2]==='<'&&m[4]==='<')sourceSeen.add(family);}
   const models=q.choices.map(c=>graph(c));assert.equal(new Set(models.map(g=>JSON.stringify(g))).size,4);
   const points=[...new Set([...edges,...models.flatMap(g=>[g.low,g.high])].flatMap(x=>[x-0.25,x,x+0.25]))];
   answers=q.choices.filter((c,j)=>points.every(x=>graphContains(models[j],x)===predicate(x))).map(c=>c.id);
  }
  else if(family===4){const expression=parts[0].replace(/=$/,'');answers=q.choices.filter(c=>[-4,0,3].every(n=>evaluate(c.math,{n})===evaluate(expression,{n}))).map(c=>c.id);if(expression==='7+(3n+6)-(4n+8)'){sourceSeen.add(family);assert.ok(q.choices.some(c=>c.math==='5-n'));}}
  else if(family===6){assert.equal(q.type,'multi_select');assert.equal(q.requiredSelections,2);answers=q.choices.filter(c=>[-3,0,2].every(n=>close(evaluate(c.math,{n}),parts.slice(0,3).reduce((sum,p)=>sum+evaluate(p,{n}),0)))).map(c=>c.id);assert.equal(answers.length,2);assert.ok(isExamQuestionCorrect(q,answers));assert.ok(!isExamQuestionCorrect(q,[answers[0]]));assert.ok(!isExamQuestionCorrect(q,[...answers,q.choices.find(c=>!answers.includes(c.id)).id]));if(parts[0]==='-2(2.5n+4)'&&parts[1]==='5-n'&&parts[2]==='3(2n+7)'){sourceSeen.add(family);assert.ok(q.choices.some(c=>c.math==='18'));}}
  else{const count=+q.prompt.match(/least of (\d+) consecutive/)[1],least=parts[0];answers=q.choices.filter(c=>[-10,0,7].every(value=>evaluate(c.math,{[least]:value})===(value+(value+count-1))/2)).map(c=>c.id);if(count===5&&least==='l')sourceSeen.add(family);}
  if(family!==0){const keys=q.correctChoiceIds??[q.correctChoiceId];assert.deepEqual(answers.sort(),keys.slice().sort());assert.equal(q.choices.length,family===6?6:4);assert.equal(new Set(q.choices.map(c=>c.math??c.image.src)).size,q.choices.length);for(const c of q.choices)if(family!==6)assert.equal(isExamQuestionCorrect(q,c.id),keys.includes(c.id));keys.forEach(k=>letters.add(k));}
 }
 assert.equal(stems.size,t.distinctCount);if(family!==0)assert.equal(letters.size,family===6?6:4);
 const first=t.generate(0,'cycle').question,next=t.generate(t.distinctCount,'cycle').question;assert.equal(first.prompt,next.prompt);assert.deepEqual(first.choices,next.choices);assert.notEqual(first.id,next.id);
 assert.deepEqual(t.generate(13,'seed'),t.generate(13,'seed'));assert.notEqual(t.generate(0,'seed-a').question.prompt,t.generate(0,'seed-b').question.prompt);
 for(const bad of [-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>t.generate(bad));assert.ok(t.generate(Number.MAX_SAFE_INTEGER,'max').question);
});
test('all eight original source scenarios occur in their corresponding families',()=>assert.equal(sourceSeen.size,8));

function fixture(){
 const catalog=defaultPracticeCatalog(require('./math-topics.json')),newIds=new Set(templates.map(t=>t.id));catalog.generators=catalog.generators.filter(g=>!newIds.has(g.id));catalog.modules.forEach(m=>{m.generatorIds=m.generatorIds.filter(id=>!newIds.has(id));});
 for(const t of templates){if(!catalog.modules.some(m=>m.id===t.destination.parentId)){const parent=catalog.modules.find(m=>m.defaultType==='foundation'&&m.category===t.category&&m.topic===t.topic);const previous=parent.id;parent.id=t.destination.parentId;catalog.modules.forEach(m=>{if(m.parentId===previous)m.parentId=parent.id;});}
  if(!t.destination.create&&!catalog.modules.some(m=>m.id===t.moduleId))catalog.modules.push({id:t.moduleId,title:t.destination.moduleTitle,description:'Teacher description',category:t.category,topic:t.topic,parentId:t.destination.parentId,published:false,includeAll:false,generatorIds:[],skilled:t.skilled});
 }
 return catalog;
}
test('batch appends to exact shared modules, enables and publishes all eight, preserves old sessions and is idempotent',()=>{
 const before=fixture(),backup=structuredClone(before),old=createPracticeState('inequalities','old',before),oldQuestion=practiceQuestion(old);
 const apply=c=>publishBuiltinDestinations(enableBuiltinPractices(templates.reduce((next,t)=>addBuiltinPractice(next,t),c),templates),templates),after=apply(before),students=studentPracticeCatalog(after);
 assert.deepEqual(before,backup);assert.deepEqual(apply(after),after);assert.deepEqual(after.videos,before.videos);assert.deepEqual(after.generators.slice(0,before.generators.length),before.generators);
 for(const t of templates){const m=students.modules.find(m=>m.id===t.moduleId),g=students.generators.find(g=>g.id===t.id);assert.ok(m&&g);assert.equal(g.enabled,true);assert.equal(g.reviewStatus,'unreviewed');assert.ok(managedGeneratorIds(m,students).includes(t.id));assert.ok(students.modules.find(p=>p.id===m.parentId)?.published);
  const state=createPracticeState(m.id,'saved',students);assert.deepEqual(parsePracticeState(JSON.stringify(state)),state);const q=generateCatalogQuestion(g,0,'verify',3);assert.ok(isExamQuestionCorrect(q,q.correctChoiceIds??q.correctChoiceId??q.correctTextAnswers[0]));
 }
 assert.equal(after.modules.filter(m=>m.id===templates[0].moduleId).length,1);assert.equal(after.modules.filter(m=>m.id===templates[3].moduleId).length,1);
 assert.deepEqual(practiceQuestion(parsePracticeState(JSON.stringify(old))),oldQuestion);
 const touched=new Set(templates.flatMap(t=>[t.moduleId,t.destination.parentId]));for(const m of before.modules){const next=after.modules.find(n=>n.id===m.id);if(!touched.has(m.id))assert.deepEqual(next,m);else{assert.equal(next.title,m.title);assert.equal(next.description,m.description);assert.ok(m.generatorIds.every(id=>next.generatorIds.includes(id)));}}
 assert.throws(()=>addBuiltinPractice(before,{...templates[0],destination:{...templates[0].destination,parentId:'missing'}}),/Stale destination/);
});
