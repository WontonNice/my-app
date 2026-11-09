const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {geometryReviewTemplates}=require('../server/src/shared/geometryReviewPractice.ts');
registerBuiltinPractices(geometryReviewTemplates,{id:'geometry-review',title:'Geometry Review',module:{id:'geometry-figures-mixed-review',title:'Geometry: Mixed Figure Practice',generatorIds:geometryReviewTemplates.map(t=>t.id),published:true}}).catch(error=>{console.error(error.message);process.exitCode=1;});
