const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {algebraPlannerPractice:templates}=require('../server/src/shared/algebraPlannerPractice.ts');
if(require.main===module)registerBuiltinPractices(templates).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={templates};
