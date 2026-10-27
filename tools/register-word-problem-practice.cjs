const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {wordProblemPractice}=require('../server/src/shared/practiceWordProblems.ts');
if(require.main===module)registerBuiltinPractices(wordProblemPractice).catch(error=>{console.error(error.message);process.exitCode=1;});
