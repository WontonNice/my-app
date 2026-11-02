import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const url='http://127.0.0.1:4319',base=new URL('./',import.meta.url);
const state=await fetch(url+'/api/state').then(r=>r.json());
const passage=state.passages.find(p=>p.id==='letter-from-brooklyn-2023-2024-form-a');
const q=passage.questions[6];assert.match(q.id,/-q024$/);
const intro='Read these lines from the poem.';
const excerpt='I can already see how this will end. (line 1)\n\nHow Brooklyn makes me nostalgic\nfor the moment I am walking inside of. (lines 21–22)';
const followUp='The lines develop a central idea of the poem by';
const prompt=[intro,excerpt,followUp].join('\n\n');
const promptHtml='<p>'+intro+'</p><blockquote><strong>I can already see how this will end.</strong> (line 1)<br><br><strong>How Brooklyn makes me nostalgic<br>for the moment I am walking inside of.</strong> (lines 21–22)</blockquote><p>'+followUp+'</p>';
const questions=passage.questions.map(question=>question.id===q.id?{...question,prompt,promptHtml}:question);
const response=await fetch(url+'/api/passages',{method:'POST',headers:{'Content-Type':'application/json','X-Editor-Token':state.editToken},body:JSON.stringify({...passage,questions,preserveSourceLayout:true,publishNow:true})});
const result=await response.json();if(!response.ok)throw Error(result.message);
const after=await fetch(url+'/api/state').then(r=>r.json());
const saved=after.passages.find(p=>p.id===passage.id);
assert.deepEqual({...saved,sourceHash:undefined,questions:undefined},{...passage,sourceHash:undefined,questions:undefined});
assert.deepEqual(saved.questions,questions);
for(const test of state.tests.filter(t=>t.assessmentId.startsWith('2023-2024-form-')))assert.deepEqual(after.tests.find(t=>t.assessmentId===test.assessmentId).questionOrder,test.questionOrder);
for(const file of ['form-a-import.json','form-a-english.json','form-a-raw-capture.json']){
 const path=new URL(file,base),data=JSON.parse(await fs.readFile(path,'utf8'));
 const poem=data.passages.find(p=>p.title==='Letter from Brooklyn');
 const question=poem.questions.find(q=>q.review.sourceQuestion==='24');
 question.prompt=prompt;question.promptHtml=promptHtml;
 await fs.writeFile(path,JSON.stringify(data,null,2));
}
await fs.writeFile(new URL('brooklyn-question-7-after.json',base),JSON.stringify(saved.questions[6],null,2));
console.log('Question 7 now keeps both quoted excerpts together, including the final verse line, with the source gap after line 1. Choices, answer, passage and display order are unchanged.');
