const { addBuiltinPractice, registerBuiltinPractice } = require('./register-practice-generator.cjs');
const { writingInequalitiesTemplate } = require('../server/src/shared/writingInequalities.ts');
const addWritingInequalities = catalog => addBuiltinPractice(catalog, writingInequalitiesTemplate);
module.exports = { addWritingInequalities };
if (require.main === module) registerBuiltinPractice(writingInequalitiesTemplate).catch(error => { console.error(error.message); process.exitCode = 1; });
