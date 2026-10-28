const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {probabilityPractice}=require('../server/src/shared/probabilityPractice.ts');
if(require.main===module)registerBuiltinPractices(probabilityPractice).catch(error=>{console.error(error.message);process.exitCode=1;});
