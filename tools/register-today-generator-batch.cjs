// Batch 2ca3a5eb-8f03-4fb6-a034-56f1ae82edfd. Both requests use exact existing groups.
const {registerBuiltinPractices}=require('./register-practice-generator.cjs');
const {repeatingDecimalDigitsTemplate}=require('../server/src/shared/repeatingDecimalDigits.ts');
const {rectangleAreaPercentTemplate}=require('../server/src/shared/rectangleAreaPercent.ts');
const templates=[repeatingDecimalDigitsTemplate,rectangleAreaPercentTemplate];
if(require.main===module)registerBuiltinPractices(templates).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={templates};
