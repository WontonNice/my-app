// Personal planner batch 0b340ac9-b499-4ce8-8805-c66297658d92.
const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {probabilityBatchPractice:templates}=require('../server/src/shared/probabilityBatchPractice.ts');
if(require.main===module)registerBuiltinPractices(templates).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={templates};
