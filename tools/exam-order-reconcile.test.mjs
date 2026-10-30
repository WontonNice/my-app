import {test} from 'node:test';
import assert from 'node:assert/strict';
import {reconcileExamQuestionOrder,selectionOrderChanged} from './exam-order-reconcile.mjs';
import assignment from './passage-exam-assignment.cjs';

test('publishing into an ordered exam reconciles an inherited order and preserves Math order',()=>{
  const draft={readingPassageIds:['old'],questionOrder:['old-2','old-1','math-2','math-1']};
  const next=assignment.assign(draft,{id:'new',section:'reading'},[]);
  assert.deepEqual(next.readingPassageIds,['old','new']);
  const result=reconcileExamQuestionOrder({requestedOrder:next.questionOrder,existingOrder:draft.questionOrder,englishIds:['old-1','old-2','new-1'],mathIds:['math-1','math-2']});
  assert.deepEqual(result,['old-2','old-1','new-1','math-2','math-1']);
  assert.deepEqual(draft.questionOrder,['old-2','old-1','math-2','math-1']);
  assert.deepEqual(reconcileExamQuestionOrder({existingOrder:result,englishIds:['old-1','new-1'],mathIds:['math-1','math-2']}),['old-1','new-1','math-2','math-1']);
});

test('new explicit source orders remain strict and take precedence over builder reordering',()=>{
  const base={existingOrder:['q1','q2','m1'],englishIds:['q1','q2','q3'],mathIds:['m1']};
  for(const requestedOrder of [['q1','q2','q2','m1'],['q1','q2','m1','unknown'],['q1','m1'],'q1']) assert.throws(()=>reconcileExamQuestionOrder({...base,requestedOrder}),/every selected question exactly once/);
  assert.deepEqual(reconcileExamQuestionOrder({...base,requestedOrder:['q3','q1','q2','m1'],reorderedEnglishGroups:[[['q2'],['q1'],['q3']]]}),['q3','q1','q2','m1']);
});

test('manual passage and standalone reorders are honored without discarding other source positions',()=>{
  assert.equal(selectionOrderChanged(['a','b'],['a','new','b']),false);
  assert.equal(selectionOrderChanged(['a','b'],['b','a']),true);
  assert.equal(selectionOrderChanged(['a','b'],['b']),false);
  const order=['standalone-1','a1','a2','standalone-2','b1','m1'];
  assert.deepEqual(reconcileExamQuestionOrder({requestedOrder:order,existingOrder:order,englishIds:['b1','a1','a2','standalone-2','standalone-1'],mathIds:['m1'],reorderedEnglishGroups:[[['b1'],['a1','a2']],[['standalone-2'],['standalone-1']]]}),['standalone-2','b1','standalone-1','a1','a2','m1']);
  assert.equal(reconcileExamQuestionOrder({englishIds:['q1'],mathIds:[]}),undefined);
});
