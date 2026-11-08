const {test} = require('node:test');
const assert = require('node:assert/strict');
const {readFileSync} = require('node:fs');
const {join, extname} = require('node:path');
const vm = require('node:vm');
const contract = require('./document-import.cjs');
const html = readFileSync(join(__dirname, 'content-studio.html'), 'utf8');
const options = vm.runInNewContext(html.slice(html.indexOf('    function passageTypeOptions('), html.indexOf('    function passageSectionOptions(')) + '\npassageTypeOptions;', {app:{}});

test('Part A type choices cannot mislabel a passage as a reading genre', () => {
  for (const old of ['', 'informational', 'literary', 'poem', 'long_reading']) {
    assert.equal(options(old, 'revising_editing_a'), '<option selected value="revising_editing">Revising/Editing</option>');
  }
  const reading = options('literary', 'reading');
  assert.match(reading, /selected value="literary"/);
  assert.doesNotMatch(reading, /long_reading|Long reading|revising_editing/);
  assert.deepEqual(contract.schema.passage.passageType, ['informational', 'literary', 'poem', 'revising_editing']);
});

test('imports classify Part A automatically and retain legacy content while retiring Long reading', () => {
  const question = {id:'q', type:'multiple_choice', prompt:'Choose.', choices:[{id:'A',text:'One'},{id:'B',text:'Two'}], correctChoiceId:'B'};
  for (const section of ['reading', 'revising_editing_a']) for (const passageType of ['informational', 'literary', 'poem', 'long_reading', undefined]) {
    const passage = {title:'Keep title', text:'Keep original text.', section, format:'prose', passageType, questions:[question]};
    const before = JSON.stringify(passage);
    const [entry] = contract.parse({format:contract.format, passage});
    assert.equal(entry.content.passageType, section === 'revising_editing_a' ? 'revising_editing' : ['informational','literary','poem'].includes(passageType) ? passageType : 'informational');
    assert.equal(entry.content.text, passage.text);
    assert.equal(entry.content.questions[0].correctChoiceId, 'B');
    assert.equal(JSON.stringify(passage), before);
  }
  assert.equal(contract.normalizePassageType({passageType:'long_reading',format:'poem'}), 'poem');
});

test('the save normalizer accepts old Part A labels and saves the canonical type without changing questions', () => {
  const source = readFileSync(join(__dirname, 'content-studio.mjs'),'utf8');
  const normalize = vm.runInNewContext(source.slice(source.indexOf('function normalizePassage(input,'),source.indexOf('function buildPassageSource(')) + '\nnormalizePassage;', {
    documentImport:contract, requiredText:value=>value || '', slugify:value=>value, extname, identifierFrom:()=> 'passageSet',
    passageFormats:['prose','poem','sentence_prose'], examPassageSections:['reading','revising_editing_a'], passageTypes:contract.schema.passage.passageType,
    normalizeQuestion:q=>q, validateQuestionTopics(){}, normalizePassageImage:value=>value, normalizePassageCategory:value=>value,
    defaultDirectionsForSection:()=>({}), sanitizeRichText:value=>value, passageVersions:{labels:()=>[]}, EditorError:class extends Error {constructor(_code,message){super(message);}},
  });
  const input = {title:'Archerfish',id:'archerfish',text:'Keep passage.',format:'sentence_prose',section:'revising_editing_a',questions:[{id:'q',type:'multiple_choice',prompt:'Choose.',correctChoiceId:'C'}]};
  for (const passageType of ['informational','literary','poem','long_reading',undefined]) {
    const saved = normalize({...input,passageType},{requireExamSection:true});
    assert.equal(saved.passageType,'revising_editing');
    assert.equal(saved.section,input.section); assert.equal(saved.text,input.text);
    assert.equal(saved.questions[0].correctChoiceId,'C');
  }
  assert.equal(normalize({...input,section:'reading',passageType:'long_reading'},{requireExamSection:true}).passageType,'informational');
});
