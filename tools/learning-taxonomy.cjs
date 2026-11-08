const fs = require('node:fs');
const path = require('node:path');
const { writeExportFile } = require('./write-export-file.cjs');
const slug = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/['’]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/** Labels can change; an explicit rename carries its ID and old aliases forward. */
function syncLearningTaxonomy(root, renames = [], configuration = {}) {
  const file = path.join(root,'server/src/shared/learning-taxonomy.json');
  const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file,'utf8')) : {categories:[]};
  const english = configuration.english ?? JSON.parse(fs.readFileSync(path.join(root,'tools/content-topic-sections.json'),'utf8'));
  const math = configuration.math ?? JSON.parse(fs.readFileSync(path.join(root,'tools/math-topics.json'),'utf8'));
  const categories = previous.categories.map(item=>({...item, active:false, aliases:[...(item.aliases||[])], topics:(item.topics||[]).map(topic=>({...topic,active:false,aliases:[...(topic.aliases||[])]}))}));
  const specialAliases = {'Word & Phrase Meaning':['Vocabulary in Context'],'Evidence & Support':['Supporting Evidence'],'Text Structure & Purpose':['Text Structure']};
  function category(area,label) {
    const rename = renames.find(change=>change.area===area&&change.to===label&&!change.parent);
    let item = categories.find(item=>item.area===area&&(item.label===label||rename&&[item.label,...item.aliases].includes(rename.from)));
    if (!item) {item={id:`${area}:${slug(label)}`,area,label,aliases:specialAliases[label]||[],topics:[],active:true};categories.push(item);}
    if(item.label!==label) {item.aliases=[...new Set([...item.aliases,item.label])];item.label=label;}
    item.active=true;
    return item;
  }
  for(const [area,labels] of Object.entries(english)) for(const label of labels) if(!/^(tbd|unclassified|uncategorized)$/i.test(label)) category(area,label);
  for(const group of math.categories) {
    if(/^(tbd|unclassified|uncategorized)$/i.test(group.label))continue;
    const item=category('math',group.label);
    for(const entry of group.topics) {
      const label=typeof entry==='string'?entry:entry.label;
      if(/^(tbd|unclassified|uncategorized)$/i.test(label))continue;
      const rename=renames.find(change=>change.area==='math'&&change.parent===group.label&&change.to===label);
      let topic=item.topics.find(topic=>topic.label===label||rename&&[topic.label,...topic.aliases].includes(rename.from));
      if(!topic){topic={id:`${item.id}:${slug(label)}`,label,aliases:[],active:true};item.topics.push(topic);}
      if(topic.label!==label){topic.aliases=[...new Set([...topic.aliases,topic.label])];topic.label=label;}
      topic.active=true;
    }
  }
  const next={version:1,categories};
  fs.mkdirSync(path.dirname(file),{recursive:true});
  writeExportFile(file,JSON.stringify(next,null,2)+'\n');
  return next;
}
function loadLearningTaxonomy(root){
  const folder=path.join(root,'server/src/shared');
  for(const name of ['learningTaxonomy.ts','learning-taxonomy.json','question-organization.json'])delete require.cache[require.resolve(path.join(folder,name))];
  return require('./exam-catalog.cjs').withTypeScript(()=>require(path.join(folder,'learningTaxonomy.ts')));
}
module.exports={syncLearningTaxonomy,loadLearningTaxonomy};
if(require.main===module)syncLearningTaxonomy(path.resolve(__dirname,'..'));
