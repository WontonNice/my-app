const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../client/src/lib/mathTextRuns.ts'),'utf8');
const exportsForTest={};
vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports:exportsForTest});
const runs=text=>JSON.parse(JSON.stringify(exportsForTest.mathTextRuns(text)));
const restorePart=p=>p.kind==='text'?p.value:p.kind==='display'?'\\['+p.value+'\\]':'\\('+p.value+'\\)';
const restore=r=>r.map(p=>p.kind==='word'?p.parts.map(restorePart).join(''):restorePart(p)).join('');

test('ordinals, hyphenated terms and punctuation stay attached to inline math',()=>{
 const source=String.raw`What is the \(391\)st digit? A \(5\)-digit number costs $\(12\). Solve (\(x\))?`;
 const result=runs(source);
 assert.deepEqual(result.filter(r=>r.kind==='word').map(r=>r.parts.map(restorePart).join('')),[String.raw`\(391\)st`,String.raw`\(5\)-digit`,String.raw`$\(12\).`,String.raw`(\(x\))?`]);
 assert.equal(restore(result),source);
});
test('ordinary whitespace remains a wrapping opportunity and display math stays separate',()=>{
 const source=String.raw`Use \(391\) items and \(x\) plus \(y\). Then \[x+y=3\] continue.`;
 const result=runs(source);
 assert.equal(result.filter(r=>r.kind==='word').length,1);
 assert.equal(result.find(r=>r.kind==='display').value,'x+y=3');
 assert.equal(restore(result),source);
});
test('adjacent expressions form one word without losing Unicode, spacing or LaTeX',()=>{
 for(const source of [String.raw`pré\(x\)ème`,String.raw`\(3\)\(x\)th`,String.raw`\(x\)/\(y\), next`, 'before\t\\(2\\)nd\nline',String.raw`**Keep** \(\frac{1}{2}\) and *emphasis*.`])assert.equal(restore(runs(source)),source);
 assert.equal(runs(String.raw`\(3\)\(x\)th`)[0].kind,'word');
});
test('plain text, incomplete delimiters and explicit break opportunities are preserved',()=>{
 for(const source of ['plain text','\\(unfinished','x\u200b\\(2\\)nd','x\u00ad\\(2\\)nd'])assert.equal(restore(runs(source)),source);
 assert.equal(runs('x\u200b\\(2\\)nd')[0].value,'x\u200b');
});
