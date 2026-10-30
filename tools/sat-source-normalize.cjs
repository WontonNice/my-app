const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const {SourceElement,documentFrom}=require('./sat-source-dom.cjs');
const rich=require('../extensions/sat-crash-course-reader/rich-text.js');
const reader=fs.readFileSync(path.join(__dirname,'../extensions/sat-crash-course-reader/content.js'),'utf8');
function read(snapshot,source){
  const document=documentFrom(snapshot.tree),module={exports:{}};
  vm.runInNewContext(reader,{module,document,HTMLElement:SourceElement,URL,NathanSatRichText:rich,getComputedStyle:n=>n.computedStyle,location:new URL(source.url)});
  return module.exports.readCurrentPreviewQuestion();
}
function normalize(capture){
  const questions=capture.records.map(record=>{
    const original=read(record.unkeyed,capture.source),q=read(record.keyed,capture.source);
    if(original.number!==q.number)throw Error('Mismatched original and keyed source question');
    if(q.interaction?.type==='sentence_blank'){q.interaction.options=original.interaction?.options||[];q.interaction.contentHtml=original.interaction?.contentHtml||q.interaction.contentHtml;}
    if(q.interaction){const a=q.interaction.type==='hot_text'?q.interaction.options.filter(x=>x.isCorrect).map(x=>x.text):q.interaction.type==='inline_dropdown'?q.interaction.dropdowns.flatMap(d=>d.options.filter(x=>x.isCorrect).map(x=>x.text)):q.interaction.type==='expression_entry'?[q.interaction.answer].filter(Boolean):(q.interaction.slots||[]).map(x=>x.answer).filter(Boolean);q.correctAnswer=a.length?{label:'',text:a.join(' | ')}:null;}
    if(q.responseType==='multi_select'){const a=q.choices.filter(x=>x.isCorrect);q.correctAnswer=a.length?{label:a.map(x=>x.label).join(', '),text:a.map(x=>x.text).join(' | ')}:null;}
    q.explanationStatus=q.explanation?'captured':'missing';
    q.source={...capture.source,section:capture.module,questionNumber:q.number,sourceQuestionNumber:q.sourceNumber};
    return q;
  });
  const expected=Array.from({length:50},(_,i)=>i+1),missing=expected.filter(n=>!questions.some(q=>q.number===n));
  if(new Set(questions.map(q=>q.number)).size!==questions.length)throw Error('Duplicate source question');
  return {schemaVersion:3,readerVersion:'0.8.0',capturedAt:capture.capturedAt,source:capture.source,testPreview:{testTitle:capture.source.label,module:capture.module==='math'?'Mathematics':'English Language Arts',question:questions[0],questions,capture:{mode:capture.module==='math'?'math-all':'ela-all',method:'rendered-dom-archive',expectedNumbers:expected,complete:!missing.length,missingNumbers:missing,explanationsRequested:true,warnings:questions.flatMap(q=>[...(!q.correctAnswer?[`Question ${q.number}: source key unavailable`]:[]),...(!q.explanation?[`Question ${q.number}: source explanation unavailable`]:[])])}}};
}
if(require.main===module){const [input,output]=process.argv.slice(2);if(!input||!output)throw Error('Usage: node tools/sat-source-normalize.cjs capture.json reader.json');const result=normalize(JSON.parse(fs.readFileSync(input,'utf8')));fs.writeFileSync(output,JSON.stringify(result,null,2));console.log(JSON.stringify({questions:result.testPreview.questions.length,capture:result.testPreview.capture}));}
module.exports={normalize,read};
