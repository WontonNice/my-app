const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {load} = require('cheerio');
const html = fs.readFileSync(require('node:path').join(__dirname,'content-studio.html'),'utf8');
const source = html.slice(html.indexOf('    function topicOptions('),html.indexOf('    function mathTopicOptions('));
const topicOptions = vm.runInNewContext(source+'\ntopicOptions;',{
  questionTopicsForSection:()=>['Sentence Structure','Pronouns','Verbs'],
  escapeHtml:value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),
});
function displayedTopic(value) {
  const $=load('<select>'+topicOptions(value,'revising_editing_b')+'</select>');
  const selected=$('option[selected]');
  return (selected.length?selected:$('option').first()).attr('value');
}
test('an unclassified stand-alone question does not display a topic that was never saved',()=>{
  assert.equal(displayedTopic(''),'');
  assert.match(topicOptions('','revising_editing_b'),/Choose a topic/);
});
test('an unsupported imported topic is shown honestly without selecting the first supported topic',()=>{
  assert.equal(displayedTopic('Imported grammar label'),'');
  assert.match(topicOptions('Imported grammar label','revising_editing_b'),/Imported grammar label/);
});
test('an explicitly selected grammar topic is retained in the dropdown',()=>{
  assert.equal(displayedTopic('Verbs'),'Verbs');
});
