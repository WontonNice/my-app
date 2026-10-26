const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly:true, project:path.resolve(__dirname,'../server/tsconfig.json'), compilerOptions:{module:'CommonJS',moduleResolution:'Node'},moduleTypes:{'**':'cjs'} });
const { clampNumberLineValue, numberLineTicks } = require('../client/src/lib/numberLineInteraction.ts');
const { content20262027FormAMathSection } = require('../client/src/content/exams/mathSets/2026-2027-form-aMath.ts');
const { isExamQuestionCorrect } = require('../server/src/shared/examGrading.ts');
const question = content20262027FormAMathSection.questions.find(q=>q.id==='2026-2027-form-a-math-item-43');
const config = question.numberLineResponse;

test('question 43 allows continuous endpoints between ticks and clamps at the bounds',()=>{
 assert.equal(clampNumberLineValue(config,0),0);
 assert.equal(clampNumberLineValue(config,1.3),1.3);
 assert.equal(clampNumberLineValue(config,-1.8),-1.8);
 assert.equal(clampNumberLineValue(config,0.125),0.125);
 assert.equal(clampNumberLineValue(config,-100),-5);
 assert.equal(clampNumberLineValue(config,100),5);
 assert.deepEqual(numberLineTicks(config).map(t=>t.value),[-5,-4,-3,-2,-1,0,1,2,3,4,5]);
});
test('tick spacing affects labels without restricting endpoint values',()=>{
 const fractional={min:0,max:0.35,tickStep:0.1,labelStep:0.2};
 assert.equal(clampNumberLineValue(fractional,0.35),0.35);
 assert.equal(clampNumberLineValue(fractional,0.15),0.15);
 assert.equal(clampNumberLineValue(fractional,0.1+0.2),0.3);
 assert.deepEqual(numberLineTicks(fractional),[{value:0,showLabel:true},{value:0.1,showLabel:false},{value:0.2,showLabel:true},{value:0.3,showLabel:false}]);
 assert.equal(clampNumberLineValue({...config,min:2},0),2);
});
test('question 43 grading requires the correct endpoint position, closure and direction',()=>{
 const correct={value:'1',endpoint:'closed',direction:'right'};
 assert.equal(isExamQuestionCorrect(question,correct),true);
 for(const wrong of [{},{...correct,value:'0'},{...correct,endpoint:'open'},{...correct,direction:'left'}]) assert.equal(isExamQuestionCorrect(question,wrong),false);
});
