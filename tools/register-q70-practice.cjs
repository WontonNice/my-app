const { addBuiltinPractice, registerBuiltinPractice } = require('./register-practice-generator.cjs');
const { variablesBothSidesTemplate } = require('../server/src/shared/inequalityPractice.ts');
const addQ70Practice = catalog => addBuiltinPractice(catalog, variablesBothSidesTemplate);
module.exports = { addQ70Practice };
if (require.main === module) registerBuiltinPractice(variablesBothSidesTemplate).catch(error => { console.error(error.message); process.exitCode = 1; });
