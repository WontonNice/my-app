const path = require('node:path');
require(require.resolve('ts-node', {paths: [path.resolve(__dirname, '../server')]})).register({transpileOnly:true, project:path.resolve(__dirname,'../server/tsconfig.json'), compilerOptions:{module:'CommonJS',moduleResolution:'Node'}, moduleTypes:{'**':'cjs'}});
const registry = require('../server/src/shared/teiFormats.json');
const questions = [];
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (value.prompt && registry.formats[value.type]) {questions.push(value); return;}
  for (const item of Object.values(value)) collect(item);
}
for (const form of ['a','b','c','d']) collect(require(`../client/src/content/exams/tests/2026-2027-form-${form}.ts`));
for (const file of ['passageSets/winter-wheat','mathSets/grade-9-mini-formMath','mathSets/digital-shsat-practice-test-adaptive-10-hardMath']) collect(require('../client/src/content/exams/'+file+'.ts'));
const base = {id:'compatibility', prompt:'Compatibility fixture', topic:'Algebra', points:1};
const legacy = {...base, type:'transition_drop', choices:[{id:'A',text:'First'},{id:'B',text:'Second'}], transitionBlankBefore:'Before', transitionBlankAfter:'after.', correctChoiceId:'B'};
const sentence = {...legacy,id:'two-blanks',dragDropContent:['Both {{blank-1}} and {{blank-2}}.'],dragDropContentHtml:'<p>Both {{blank-1}} and <em>{{blank-2}}</em>.</p>',dragDropSlots:[{id:'blank-1',correctItemId:'A'},{id:'blank-2',correctItemId:'B'}]};
delete sentence.correctChoiceId;
const fixtures = Object.keys(registry.formats).filter(type=>registry.formats[type].publishable).map(type => questions.find(q=>q.type===type && !q.selectionHtml && !q.hotSpot)).filter(Boolean);
fixtures.push(legacy,sentence);
for (const type of ['short_response','numeric_entry','expression_entry','grid_in']) if (!fixtures.some(q=>q.type===type)) fixtures.push({...base,id:type,type,correctTextAnswers:['2']});
for (const field of ['selectionHtml','hotSpot']) {const q=questions.find(q=>q[field]);if(q)fixtures.push(q);}
const commaSplice={...sentence,id:'prestige-comma-splice',prompt:'One sentence of the paragraph should be revised to correct a comma splice. Drag the word or phrase into the blank that corrects the error and best shows the relationship between the ideas in that sentence.', choices:[', in that time,','; in that time,','; however,',', although'].map((text,i)=>({id:String.fromCharCode(65+i),text,html:'<p><strong>'+text+'</strong></p>'})),dragDropContent:['The pressing lasts three consecutive weekends{{blank-1}} the volunteers produce nearly four hundred gallons of cider.'],dragDropContentHtml:'<p>The pressing lasts three consecutive weekends{{blank-1}} the volunteers produce nearly four hundred gallons of cider.</p>',dragDropSlots:[{id:'blank-1',correctItemId:'B'}],dragDropStyle:'outlined'};
fixtures.push(commaSplice);
module.exports={fixtures, questions, legacy, sentence, commaSplice};
