const {test}=require('node:test'),assert=require('node:assert/strict');
require('./register-practice-generator.cjs');
const {defaultPracticeCatalog,reconcilePracticeTaxonomy,validatePracticeCatalog,practiceModuleKind,managedGeneratorIds,generateCatalogQuestion}=require('../server/src/shared/practiceCatalog.ts');
const {migrateState}=require('./migrate-math-subcategories.cjs');
const taxonomy=require('./math-topics.json');

test('subcategory migration retains practice IDs, content, selections and Foundation placement',()=>{
  const previous=defaultPracticeCatalog();
  previous.videos.push({id:'kept-video',title:'Kept lesson',description:'',url:'https://youtu.be/abcdefghijk',category:'Geometry',topic:'Shapes & Angles',published:false});
  const custom=previous.generators.find(g=>g.id==='probability-ordered-draws-v1');
  Object.assign(custom,{title:'My existing title',skills:['Existing tag'],reviewStatus:'approved'});
  const before=structuredClone(previous);
  const next=validatePracticeCatalog(reconcilePracticeTaxonomy(previous,taxonomy),taxonomy);
  assert.deepEqual(previous,before);
  const strip=item=>{const {category,topic,parentId,...rest}=item;return rest;};
  for(const generator of previous.generators){
    const migrated=next.generators.find(g=>g.id===generator.id);
    assert.deepEqual(strip(migrated),strip(generator));
    const originalQuestion=generateCatalogQuestion(generator,3,'preserved');
    const newQuestion=generateCatalogQuestion(migrated,3,'preserved');
    const questionContent=({topic,subtopic,...question})=>question;
    assert.deepEqual(questionContent(newQuestion),questionContent(originalQuestion));
  }
  for(const module of previous.modules){
    const migrated=next.modules.find(m=>m.id===module.id);
    assert.ok(migrated,module.id);
    assert.equal(migrated.title,module.title);assert.equal(migrated.published,module.published);
    assert.deepEqual(migrated.generatorIds,module.generatorIds);
    if(!practiceModuleKind(module)){
      assert.deepEqual(managedGeneratorIds(migrated,next),managedGeneratorIds(module,previous));
      const previousParent=previous.modules.find(m=>m.id===module.parentId),parent=next.modules.find(m=>m.id===migrated.parentId);
      assert.equal(practiceModuleKind(parent),practiceModuleKind(previousParent));
      assert.equal(parent.topic,migrated.topic);
    }
  }
  assert.equal(next.videos[0].id,'kept-video');assert.equal(next.videos[0].published,false);assert.equal(next.videos[0].topic,'Lines & Angles');
  assert.equal(next.modules.find(m=>m.title==='Listing Outcomes').topic,'Counting & Sets');
  assert.equal(next.modules.find(m=>m.title==='Draws Without Replacement').topic,'Probability');
  for(const category of taxonomy.categories)for(const topic of category.topics)for(const kind of ['foundation','general'])assert.equal(next.modules.filter(m=>m.category===category.label&&m.topic===topic&&practiceModuleKind(m)===kind).length,1);
  assert.deepEqual(validatePracticeCatalog(reconcilePracticeTaxonomy(next,taxonomy),taxonomy),next);
  assert.doesNotThrow(()=>validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy));
});

test('existing skills are only rehomed, retaining IDs, labels, prerequisites and question assignments',()=>{
  const original={metadata:{q:{skilled:'angles'}},skills:[{id:'decimal-operations',label:'Decimal Operations',category:'Arithmetic & Number Sense',subcategory:'Fractions & Decimals',prerequisiteIds:[]}],classificationSkills:[{id:'angles',label:'Angles',category:'Geometry',subcategory:'Shapes & Angles'}]};
  const next=migrateState(original,taxonomy);
  assert.deepEqual(next.metadata,original.metadata);
  assert.deepEqual(next.skills,[{...original.skills[0],subcategory:'Fractions & Decimals'}]);
  assert.deepEqual(next.classificationSkills,[{...original.classificationSkills[0],subcategory:'Lines & Angles'}]);
  assert.deepEqual(migrateState(next,taxonomy),next);
});


test('consolidation merges default parents and preserves focused practice and skill assignments',()=>{
  const category='Statistics and Probability';
  const generators=['Basic Probability','Compound Probability'].map((topic,index)=>({id:'custom-'+index,title:'Existing '+index,description:'',enabled:true,kind:'one-step',settings:require('../server/src/shared/practiceCatalog.ts').defaultGeneratorSettings,category,topic}));
  const previous=require('../server/src/shared/practiceCatalog.ts').ensureTopicPracticeModules({generators,modules:[],videos:[]});
  for(const generator of generators){
    const parent=previous.modules.find(m=>m.topic===generator.topic&&practiceModuleKind(m)==='foundation');
    previous.modules.push({id:'child-'+generator.id,title:generator.title,description:'',category,topic:generator.topic,published:true,includeAll:false,generatorIds:[generator.id],parentId:parent.id});
  }
  const next=validatePracticeCatalog(reconcilePracticeTaxonomy(previous,taxonomy),taxonomy);
  for(const kind of ['foundation','general'])assert.equal(next.modules.filter(m=>m.topic==='Probability'&&practiceModuleKind(m)===kind).length,1);
  for(const child of previous.modules.filter(m=>!practiceModuleKind(m))){
    const current=next.modules.find(m=>m.id===child.id);
    assert.deepEqual(current.generatorIds,child.generatorIds);
    assert.equal(practiceModuleKind(next.modules.find(m=>m.id===current.parentId)),'foundation');
  }
  for(const parent of previous.modules.filter(practiceModuleKind))assert.ok(next.modules.some(m=>m.id===parent.id||m.selectionAliases?.includes(parent.id)));
  assert.deepEqual(validatePracticeCatalog(reconcilePracticeTaxonomy(next,taxonomy),taxonomy),next);
});
