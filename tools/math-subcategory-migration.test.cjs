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
  assert.equal(next.modules.find(m=>m.title==='Listing Outcomes').topic,'Counting & Combinations');
  assert.equal(next.modules.find(m=>m.title==='Draws Without Replacement').topic,'Compound Probability');
  for(const category of taxonomy.categories)for(const topic of category.topics)for(const kind of ['foundation','general'])assert.equal(next.modules.filter(m=>m.category===category.label&&m.topic===topic&&practiceModuleKind(m)===kind).length,1);
  assert.deepEqual(validatePracticeCatalog(reconcilePracticeTaxonomy(next,taxonomy),taxonomy),next);
  assert.doesNotThrow(()=>validatePracticeCatalog(defaultPracticeCatalog(taxonomy),taxonomy));
});

test('existing skills are only rehomed, retaining IDs, labels, prerequisites and question assignments',()=>{
  const original={metadata:{q:{skilled:'angles'}},skills:[{id:'decimal-operations',label:'Decimal Operations',category:'Arithmetic & Number Sense',subcategory:'Fractions & Decimals',prerequisiteIds:[]}],classificationSkills:[{id:'angles',label:'Angles',category:'Geometry',subcategory:'Shapes & Angles'}]};
  const next=migrateState(original,taxonomy);
  assert.deepEqual(next.metadata,original.metadata);
  assert.deepEqual(next.skills,[{...original.skills[0],subcategory:'Decimals'}]);
  assert.deepEqual(next.classificationSkills,[{...original.classificationSkills[0],subcategory:'Lines & Angles'}]);
  assert.deepEqual(migrateState(next,taxonomy),next);
});
