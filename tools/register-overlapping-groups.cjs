const { addBuiltinPractice, registerBuiltinPractice } = require('./register-practice-generator.cjs');
const { overlappingGroupsTemplate } = require('../server/src/shared/overlappingGroups.ts');
const addOverlappingGroups = catalog => addBuiltinPractice(catalog, overlappingGroupsTemplate);
module.exports = { addOverlappingGroups };
if (require.main === module) registerBuiltinPractice(overlappingGroupsTemplate).catch(error => { console.error(error.message); process.exitCode = 1; });
