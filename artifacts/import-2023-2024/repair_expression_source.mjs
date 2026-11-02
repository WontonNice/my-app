// Reviewed source transcriptions in the existing prompt-import contract.
// This is exam data repair, not a new shared math formatter or renderer.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import katex from 'katex';
import contract from '../../tools/document-import.cjs';
const base=new URL('./',import.meta.url),url='http://127.0.0.1:4319',R=String.raw;
const specs={
 a:{
  60:{html:R`<p>Solve for \(x\):</p><p>\(7x + 3 - 2(2x + 1) = 13\)</p>`},
  61:{variables:['l','n','x']},
  65:{choiceHtml:[R`<p>\(\$20.50\)/hr</p>`,R`<p>\(\$26.75\)/hr</p>`,R`<p>\(\$33.00\)/hr</p>`,R`<p>\(\$37.65\)/hr</p>`]},
  67:{labels:['W','X','Y','Z']},
  68:{html:R`<p>\(\frac{81}{10} = \frac{9}{n}\)</p><p>What value of \(n\) makes the equation above true?</p>`},
  69:{html:R`<p>If \(n\) is an integer and \(3n + 3\) is an even number, which expression must also represent an even number?</p>`,choices:['5n + 1','4n + 5','2n + 3','n + 2']},
  71:{variables:['n']},
  76:{html:R`<p>\(x:35 = 20:28\)</p><p>For what value of \(x\) is the proportion shown above true?</p>`},
  77:{choices:['-60',R`-\frac{17}{3}`,R`\frac{77}{9}`,'68']},
  79:{html:R`<p>The numbers \(m\), \(n\), \(p\), and \(q\) are different, and each is equal to one of the numbers \(1\), \(2\), \(3\), \(6\), or \(12\). If \(2m = 6q = \frac{1}{2}n = p\), what is the value of \(p\)?</p>`},
  80:{replacements:[[R`<p>{\(0.1\), \(0.01\), \(0.001\), \(0.0001\), \(0.00001\)}</p>`,R`<p>\(\{0.1, 0.01, 0.001, 0.0001, 0.00001\}\)</p>`]]},
  81:{labels:['R','T']},
  82:{variables:['j','k','h','x'],labels:['Q']},
  83:{variables:['x'],choices:[R`\frac{1}{x+1} > \frac{1}{x+2}`,R`\frac{1}{x+1} < \frac{1}{x+2}`,R`\frac{1}{x+1} - \frac{1}{x+2} > 1`,R`\frac{1}{x+1} - \frac{1}{x+2} > \frac{1}{x}`]},
  86:{variables:['x'],choices:['2x + 1','3x - 5','4x - 1','4x + 6']},
  88:{labels:['P'],choices:['R','S','T','U']},
  91:{replacements:[['<em>x </em>+ <em>y</em>',R`\(x+y\)`]]},
  92:{labels:['L','JK'],replacements:[[R`JL = \(\frac{2}{3}\) LK`,R`\(JL = \frac{2}{3}LK\)`]]},
  94:{replacements:[['18π',R`\(18\pi\)`]],choiceHtml:[R`<p>\(144\pi\) ft</p>`,R`<p>\(24\pi\) ft</p>`,R`<p>\(18\pi\) ft</p>`,R`<p>\(9\pi\) ft</p>`]},
  95:{html:R`<p>Which graph represents the solution to \(-3x - 7 > -4\)?</p>`},
  96:{labels:['R','S','T']},
  97:{variables:['k','j'],choices:['k - 6 = 2(j + 6)','k - 6 = 2j + 6','2(k - 6) = j','2(k - 6) = j + 6']},
  99:{html:R`<p>\(\{1,2,3,4,5,\ldots,198,199,200\}\)</p><p>How many members of the set shown above are multiples of \(6\) but <strong>not </strong>multiples of \(9\)?</p>`},
  101:{html:R`<p>For what value of \(x\) is the equation \(\frac{x}{5} - 4 = 3(4 - 2x) - 1\) true?</p>`},
  102:{variables:['y'],labels:['RS']},
  113:{variables:['x']},
 },
 b:{
  62:{html:R`<p>Solve the equation for \(x\):</p><p>\(\frac{(21)(14)x}{(49)(48)} = 0.875\)</p>`},
  65:{html:R`<p>Solve for \(x\) in terms of \(y\) if \(2x + 4 = y\).</p>`,choices:[R`x = \frac{y-4}{2}`,'x = 2(y + 4)',R`x = \frac{y+4}{2}`,'x = 2(4 - y)']},
  68:{html:R`<p>\(n = 0.13 + \frac{207}{100}\)</p><p>What is the value of \(n\) expressed as a fraction?</p>`},
  74:{html:R`<p>\(m \cdot t = 72\)</p><p>For the equation above, what is the sum of the values of \(m\) when \(t=1\), when \(t=2\), and when \(t=3\)?</p>`},
  78:{html:R`<p>\[\begin{gathered}-mn\\(-m)(-n)\\|mn|\\|-mn|\\|(-m)(-n)|\end{gathered}\]</p><p>If \(m\) and \(n\) are positive integers, how many of the five expressions above are equivalent to \(mn\)?</p>`},
  84:{replacements:[[R`<p>N = {\(6\), \(7\), . . . , \(21\), \(22\)}</p>`,R`<p>\(N=\{6,7,\ldots,21,22\}\)</p>`]],labels:['N','L']},
  85:{variables:['x','y','z']},
  88:{html:R`<p>If \(xy=30\), what is the value of \(10 \div x\) in terms of \(y\)?</p>`,choices:[R`\frac{1}{10}y`,R`\frac{1}{3}y`,'3y','10y']},
  90:{labels:['W','X','Y']},
  91:{labels:['W','X','Y','Z']},
  93:{labels:['S','T']},
  94:{choices:[R`\frac{1}{2}(x-5)`,R`\frac{1}{2}(x+5)`,R`-\frac{1}{2}(x+23)`,R`-\frac{1}{2}(x-23)`]},
  95:{html:R`<p>How is \(\frac{1}{x} - \frac{1}{2x}\) written as a single fraction? (Assume \(x \ne 0\).)</p>`,choices:[R`\frac{1}{2x}`,R`\frac{1}{3x}`,R`-\frac{1}{x}`,R`-\frac{1}{2x}`]},
  97:{labels:['A','B']},
  98:{choiceHtml:[R`<p>\(33\frac{1}{3}\%\)</p>`,null,null,null]},
  107:{replacements:[[R`<p>{\(3\), \(4\), \(5\), \(6\), \(7\)}</p>`,R`<p>\(\{3,4,5,6,7\}\)</p>`]]},
  108:{variables:['n']},
  109:{choiceHtml:[null,null,R`<p>\(3\pi\)</p>`,R`<p>\(6\pi\)</p>`]},
  113:{variables:['s','t'],replacements:[[R`P (\(3\), \(5\))`,R`\(P\ (3,5)\)`]]},
 }
};
function repair(question,spec){
 const next=structuredClone(question);
 if(spec.html)next.promptHtml=spec.html;
 for(const [before,after] of spec.replacements||[]){assert(next.promptHtml.includes(before)||next.promptHtml.includes(after),`source match ${question.id}: ${before}`);next.promptHtml=next.promptHtml.replace(before,after);}
 for(const variable of spec.variables||[]){
  let count=0;for(const before of [`<em>${variable} </em>`,`<em>${variable}</em>`])while(next.promptHtml.includes(before)){
   next.promptHtml=next.promptHtml.replace(before,`\\(${variable}\\)${before.includes(' </em>')?' ':''}`);count++;
  }assert(count||next.promptHtml.includes(`\\(${variable}\\)`),`source variable ${question.id}: ${variable}`);
 }
 if(spec.labels)next.promptHtml=next.promptHtml.split(/(\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|<[^>]+>)/g).map((part,i)=>i%2?part:part.replace(/\b[A-Z]+\b/g,label=>spec.labels.includes(label)?`\\(${label}\\)`:label)).join('');
 if(spec.choices){assert.equal(next.choices.length,spec.choices.length);next.choices=next.choices.map((c,i)=>{const {html,...choice}=c;return {...choice,math:spec.choices[i]};});}
 if(spec.choiceHtml)next.choices=next.choices.map((c,i)=>spec.choiceHtml[i]?{...c,html:spec.choiceHtml[i]}:c);
 return next;
}
const plain=q=>{
 const next=structuredClone(q);delete next.promptHtml;
 if(next.choices)next.choices=next.choices.map(({html,math,...c})=>c);
 return next;
};
const math=q=>[q.promptHtml,...(q.choices||[]).map(c=>c.html)].filter(Boolean).flatMap(html=>Array.from(html.matchAll(/\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g),m=>m[1]??m[2])).concat((q.choices||[]).map(c=>c.math).filter(Boolean));
const initial=await fetch(url+'/api/state').then(r=>r.json()),orders=initial.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')).map(t=>[t.assessmentId,t.questionOrder]);
const changes=await fs.readFile(new URL('expression-source-repairs.json',base),'utf8').then(JSON.parse).catch(error=>{if(error.code==='ENOENT')return [];throw error;});
for(const form of ['a','b']){
 const state=await fetch(url+'/api/state').then(r=>r.json()),assessmentId=`2023-2024-form-${form}`;
 const test=state.tests.find(t=>t.assessmentId===assessmentId),section=state.mathSections.find(m=>m.fileName===test.mathSectionFileName);
 const questions=section.questions.map(q=>{
  const spec=specs[form][+q.source.sourceQuestion];if(!spec)return q;
  const next=repair(q,spec);assert.deepEqual(plain(next),plain(q),'only authored math presentation changes');
  for(const latex of math(next))katex.renderToString(latex,{throwOnError:true});
  assert.deepEqual(contract.formatImportedMathChoices(next),next,'existing importer preserves this source transcription');
  assert.equal(/<em>|π/.test(next.promptHtml+(next.choices||[]).map(c=>c.html||'').join('')),false,`unconverted source mathematics ${q.id}`);
  const previous=changes.find(c=>c.form===form&&c.questionId===q.id);
  if(previous)previous.after=next;else changes.push({form,sourceQuestion:q.source.sourceQuestion,questionId:q.id,before:q,after:next});return next;
 });
 await fs.writeFile(new URL('expression-source-repairs.json',base),JSON.stringify(changes,null,2));
 const response=await fetch(url+'/api/math',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...section,assessmentId,questions})});
 const result=await response.json();if(!response.ok)throw Error(result.message);
 const after=await fetch(url+'/api/state').then(r=>r.json());assert.deepEqual(after.mathSections.find(m=>m.fileName===section.fileName).questions,questions);
 console.log(form.toUpperCase(),changes.filter(c=>c.form===form).length,'questions saved using existing prompt-import LaTeX fields.');
}
for(const form of ['a','b'])for(const suffix of ['import','math','raw-capture']){
 const path=new URL(`form-${form}-${suffix}.json`,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 data.mathQuestions=data.mathQuestions.map(q=>specs[form][+q.review.sourceQuestion]?repair(q,specs[form][+q.review.sourceQuestion]):q);
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
const after=await fetch(url+'/api/state').then(r=>r.json());
for(const [id,order] of orders)assert.deepEqual(after.tests.find(t=>t.assessmentId===id).questionOrder,order);
await fs.writeFile(new URL('expression-source-specs.json',base),JSON.stringify(specs,null,2));
console.log('Source wording, keys, images, grading fields and English order verified unchanged.');
