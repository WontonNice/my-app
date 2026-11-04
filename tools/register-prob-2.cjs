// Personal planner batch f764fde9-11e7-4232-9204-d5033921d821.
const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {prob2Practice:templates}=require('../server/src/shared/prob2Practice.ts');
if(require.main===module)registerBuiltinPractices(templates).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={templates};
