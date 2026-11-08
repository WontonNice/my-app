const {test}=require('node:test');
const assert=require('node:assert/strict');
const katex=require('katex');
const {withTypeScript}=require('./exam-catalog.cjs');
const {buildMathCommandCatalog,queryMathCommandCatalog,validateMathCatalogFilters}=withTypeScript(()=>require('../server/src/shared/mathCommandCatalog.ts'));
const {legibleMathExpression}=withTypeScript(()=>require('../server/src/shared/mathPresentation.ts'));
const {sourceFacets}=withTypeScript(()=>require('../server/src/shared/sourceFacets.ts'));
test('level filtering uses source identity, never words about student grades',()=>{
  const source={sourceFamily:'official_shsat',shsatLevel:'9',year:'2008-2009'};
  const question={id:'official9',type:'multiple_choice',prompt:'Find the value.',topic:'Algebra',subtopic:'Equations & Systems',choices:[{id:'A',text:'1'},{id:'B',text:'2'}],correctChoiceId:'A',source};
  const records=[{id:'official9',question,sources:[]},{id:'grade-word',question:{...question,id:'grade-word',prompt:'A grade 9 student has these grades.',source:{sourceFamily:'official_shsat',year:'2017-2018'}},sources:[]}];
  const catalog=buildMathCommandCatalog(records,{categories:[{label:'Algebra',topics:['Equations & Systems']}]});
  const filters=validateMathCatalogFilters({shsatLevel:['9'],publisher:['Official Handbook'],year:['2008-2009']});
  assert.deepEqual(queryMathCommandCatalog(catalog,filters).items.map(item=>item.id),['official9']);
  assert.equal(sourceFacets({form:'Grade 9'}).shsatLevel,'9');assert.equal(sourceFacets({label:'Question about grade 9'}).shsatLevel,'');
});
test('full-size fractions and source prime marks render without changing stored expressions',()=>{
  for(const expression of [String.raw`\frac{1}{6}`,String.raw`\overline{MM\prime}`]){
    const presentation=legibleMathExpression(expression);
    assert.doesNotThrow(()=>katex.renderToString(presentation,{throwOnError:true}));
    assert.equal(legibleMathExpression(presentation),presentation,'Formatting is idempotent.');
  }
  assert.equal(legibleMathExpression(String.raw`M\prime`),String.raw`M^{\prime}`);
  assert.equal(legibleMathExpression(String.raw`\tfrac{1}{2}`),String.raw`\tfrac{1}{2}`,'An explicitly small fraction remains intentional.');
});
