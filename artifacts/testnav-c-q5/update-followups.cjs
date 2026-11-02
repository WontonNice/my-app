const fs = require('node:fs');
const path = require('node:path');
const ts = require(require.resolve('typescript', {paths:[path.resolve('client')]}));
const suffix='excerpt-from-growing-peppers-on-the-iss-is-just-the-start-of-space-farming-2026-2027-form-c';
const changes = {
 [suffix+'-official-shsat-2026-c-40']: q => {q.dragDropSlots=q.dragDropSlots.map(slot=>({...slot,width:300}));},
 'official-shsat-2026-c-55': q => {q.entryVariable='n';},
 'official-shsat-2026-c-58': q => {q.choiceColumns=2;},
 'official-shsat-2026-c-78': q => {q.entryVariable='w';q.entryPrefixVariable='z';},
 'official-shsat-2026-c-79': q => {q.promptHtml=q.promptHtml.replace('<table>', '<table data-table-style="compact">');},
};
for(const file of [`client/src/content/exams/passageSets/${suffix}.ts`,'client/src/content/exams/mathSets/2026-2027-form-cMath.ts','client/src/content/exams/tests/2026-2027-form-c.ts']) {
 let text=fs.readFileSync(file,'utf8');
 const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true),edits=[];
 function visit(node){
  if(ts.isObjectLiteralExpression(node)) {
   const prop=node.properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(source).replaceAll('"','')==='id');
   const id=prop&&ts.isStringLiteral(prop.initializer)?prop.initializer.text:null;
   if(changes[id]) {const start=node.getStart(source),raw=text.slice(start,node.end),q=JSON.parse(raw);changes[id](q);
    const indent=text.slice(text.lastIndexOf('\n',start)+1,start).match(/^\s*/)[0];
    const replacement=raw.includes('\n')?JSON.stringify(q,null,2).replaceAll('\n','\n'+indent):JSON.stringify(q);
    if(replacement!==raw)edits.push({start,end:node.end,replacement});return;}
  }
  ts.forEachChild(node,visit);
 }
 visit(source); for(const edit of edits.sort((a,b)=>b.start-a.start))text=text.slice(0,edit.start)+edit.replacement+text.slice(edit.end);
 if(edits.length)fs.writeFileSync(file,text);
 console.log(file,edits.length,'updated objects');
}
const file='server/data/exam-content.json',text=fs.readFileSync(file,'utf8'),data=JSON.parse(text);
function update(value){if(!value||typeof value!=='object')return;if(changes[value.id])changes[value.id](value);for(const nested of Object.values(value))update(nested);}
update(data['2026-2027-form-c']);
const updated=JSON.stringify(data);if(updated!==text.trim())fs.writeFileSync(file,updated+'\n');
