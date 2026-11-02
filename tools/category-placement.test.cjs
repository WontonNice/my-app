const {test}=require('node:test');
const assert=require('node:assert/strict');
const {placeCategoryItem}=require('../client/src/lib/categoryPlacement.ts');
const question={items:['a','b','c'].map(id=>({id})),categories:[{id:'box'}],requiredPlacements:2};
test('two-answer targets reject a third item, preserve answers, and allow replacement after return',()=>{
 const original={a:'box',b:'box'};
 assert.equal(placeCategoryItem(question,original,'c','box'),original);
 assert.deepEqual(placeCategoryItem(question,{b:'box'},'c','box'),{b:'box',c:'box'});
 assert.equal(placeCategoryItem(question,original,'unknown','box'),original);
 assert.equal(placeCategoryItem(question,original,'a','unknown'),original);
});
test('single-capacity targets still replace their occupied item at the total limit',()=>{
 assert.deepEqual(placeCategoryItem({...question,categoryCapacity:1,categories:[{id:'box'},{id:'other'}]},{a:'box',b:'other'},'c','box'),{b:'other',c:'box'});
});
