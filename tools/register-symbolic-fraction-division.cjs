const {registerBuiltinPractice}=require('./register-practice-generator.cjs');
const {symbolicFractionDivisionTemplate}=require('../server/src/shared/symbolicFractionDivision.ts');
if(require.main===module)registerBuiltinPractice(symbolicFractionDivisionTemplate).catch(error=>{console.error(error.message);process.exitCode=1;});
