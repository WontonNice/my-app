const fs=require('fs'),path=require('path'),assert=require('assert/strict'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
function norm(v){if(Array.isArray(v))return v.map(norm);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).filter(([k,v])=>v!==undefined).map(([k,v])=>[k,norm(v)]));if(typeof v==='string')return v.replace(/^ +| +$/g,'').replace(/<(\w+)(\s[^>]*?)>/g,(_,tag,attrs)=>'<'+tag+' '+(attrs.match(/[\w-]+="[^"]*"/g)||[]).sort().join(' ')+'>');return v}
const {createSourcePassage}=require('../../client/src/content/exams/formatters.ts');
const exported=JSON.parse(fs.readFileSync('server/data/exam-content.json','utf8')),root=__dirname,report=[];
for(const f of ['a','b']){
 const d=JSON.parse(fs.readFileSync(path.join(root,`form-${f}-parsed.json`))),e=exported[`2021-2022-form-${f}`];
 const actual=[...e.passageSets.flatMap(p=>p.questions),...e.standaloneSection.questions,...e.mathSection.questions];
 assert.equal(actual.length,114);assert.equal(new Set(actual.map(q=>q.id)).size,114);assert.equal(e.questionOrder.length,114);
 const expected=d.flatMap(e=>e.content.questions),byN=new Map(actual.map(q=>[q.source.sourceQuestion,q]));
 for(const q of expected){const s=byN.get(q.review.sourceQuestion);assert(s);assert.equal(s.correctChoiceId,q.correctChoiceId);assert.deepEqual(s.correctTextAnswers||[],q.correctTextAnswers||[]);assert.equal(norm(s.explanationHtml),norm(q.explanationHtml));if(+q.review.sourceQuestion>4){assert.equal(norm(s.promptHtml),norm(q.promptHtml));assert.deepEqual(norm(s.choices||[]),norm(q.choices||[]));}}
 const paragraphs=[];
 for(const p of e.passageSets){const source=d.find(x=>x.kind==='passage'&&x.content.questions[0].review.sourceQuestion===p.questions[0].source.sourceQuestion).content;const expected=createSourcePassage({...source,id:p.passage.id});assert.deepEqual(norm(p.passage.lines),norm(expected.lines));paragraphs.push({title:source.title,numbered:expected.lines.filter(l=>l.lineNumber).length,verseLines:expected.lines.filter(l=>l.poetryLine).length,glossary:(JSON.stringify(expected).match(/data-glossary-definition/g)||[]).length});}
 const assets=[...new Set(JSON.stringify(e).match(/\/exam-images\/[\w.-]+/g)||[])];for(const a of assets)assert(fs.existsSync('client/public'+a),a);
 const first=e.questionOrder.slice(0,53).map(id=>actual.find(q=>q.id===id).source.sourceQuestion);assert.equal(+first[0],f==='a'?10:11);assert.deepEqual(e.questionOrder.slice(53,57).map(id=>actual.find(q=>q.id===id).source.sourceQuestion),['1','2','3','4']);
 report.push({form:f,questions:114,keys:114,explanations:114,formattingMatches:true,assets:assets.length,passages:paragraphs});
}
fs.writeFileSync(path.join(root,'export-verification.json'),JSON.stringify(report,null,2));console.log('Actual exported exams match captured formatting, all 228 keys/explanations, native passage layouts, assets, and required order.');
