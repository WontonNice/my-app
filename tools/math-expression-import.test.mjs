import assert from 'node:assert/strict';
import {test} from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import katex from 'katex';
import contract from './document-import.cjs';
import batches from './math-import-batch.cjs';

const question={id:'source-algebra',type:'short_response',topic:'Algebra',prompt:'Solve for x:\n\n7x + 3 − 2(2x + 1) = 13',promptHtml:String.raw`<p>Solve for \(x\):</p><p>\(7x + 3 - 2(2x + 1) = 13\)</p>`,correctTextAnswers:['4']};
test('the standard single and batch prompt import preserves complete source expressions',()=>{
 for(const parser of [contract.parse,batches.parse])for(const payload of [{question},{mathQuestions:[question]}]){
  const saved=parser(payload)[0].content.questions[0];
  for(const key of Object.keys(question))assert.deepEqual(saved[key],question[key]);
  const expressions=Array.from(saved.promptHtml.matchAll(/\\\((.*?)\\\)/g),m=>m[1]);
  assert.deepEqual(expressions,['x','7x + 3 - 2(2x + 1) = 13']);
  for(const latex of expressions)assert.doesNotThrow(()=>katex.renderToString(latex,{throwOnError:true}));
 }
});
test('formula-only choices use the existing bare LaTeX math field with unchanged source text and key',()=>{
 const input={...question,type:'multiple_choice',prompt:'Solve for x in terms of y.',promptHtml:String.raw`<p>Solve for \(x\) in terms of \(y\).</p>`,choices:[{id:'A',text:'x = (y−4)/2',math:String.raw`x = \frac{y-4}{2}`},{id:'B',text:'x = 2(y+4)',math:'x = 2(y+4)'}],correctChoiceId:'A'};
 const imported=contract.parse({question:input})[0].content.questions[0];
 assert.deepEqual(imported.choices,input.choices);assert.equal(imported.correctChoiceId,'A');
 for(const choice of imported.choices)katex.renderToString(choice.math,{throwOnError:true});
});
test('native saves retain the same authored expression without reconstructing variables or numbers',async()=>{
 const source=await readFile(new URL('./content-studio.mjs',import.meta.url),'utf8');
 const normalize=vm.runInNewContext(source.slice(source.indexOf('function normalizeMathQuestion('),source.indexOf('function normalizeMathSection('))+'\nnormalizeMathQuestion;',{
  documentImport:contract,EditorError:class extends Error{},requiredText:value=>value,slugify:value=>value,sanitizeRichText:contract.sanitizeRichText,normalizeMathImage:()=>undefined,
 });
 const saved=normalize(question,'exam',0);
 assert.equal(saved.promptHtml,question.promptHtml);assert.equal(saved.prompt,question.prompt);
 assert.deepEqual(Array.from(saved.correctTextAnswers),question.correctTextAnswers);
 assert.deepEqual(contract.formatImportedMathChoices({prompt:'A number n is 3.',choices:[{id:'A',text:'4'}]}),{prompt:'A number n is 3.',choices:[{id:'A',text:'4'}]},'no new number/variable guessing path');
});
