const {test} = require('node:test');
const assert = require('node:assert/strict');
const {resolve} = require('node:path');
const {runInNewContext} = require('node:vm');
const {webcrypto} = require('node:crypto');
const {build} = require('esbuild');

let renderer;
async function loadRenderer() {
  if (!renderer) renderer = (async () => {
    const result = await build({stdin:{contents:`
      import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';
      import {PracticeStats,PracticeFeedback} from './client/src/features/math-command/PracticeFeedback';
      import {InequalityPractice} from './client/src/features/math-command/InequalityPractice';
      import {generatorPreviewCatalog} from './client/src/features/math-command/generatorPreview';
      import {ExamMathQuestion} from './client/src/components/ExamMathQuestion';
      import {generateInequality} from './server/src/shared/inequalityPractice';
      import {defaultPracticeCatalog} from './server/src/shared/practiceCatalog';
      import {createPracticeState,checkPracticeAnswer,nextPracticeQuestion} from './client/src/features/math-command/inequalitySession';
      export function renderFeedback(correct) {
        const question=generateInequality(0,'feedback-test').question;
        let state=createPracticeState('inequalities','test');
        for(let i=0;i<2;i++)state=nextPracticeQuestion(checkPracticeAnswer({...state,answer:'A'},true));
        state=checkPracticeAnswer({...state,answer:'A'},correct);
        return renderToStaticMarkup(<><PracticeStats state={state} correct={correct}/><PracticeFeedback question={question} correct={correct}/></>);
      }
      export function renderChoices(feedback) {
        const question=generateInequality(0,'choice-test').question;
        const wrong=question.choices.find(choice=>choice.id!==question.correctChoiceId).id;
        return renderToStaticMarkup(<ExamMathQuestion question={question} answer={feedback==='correct'?question.correctChoiceId:wrong} answerFeedback={feedback} onChange={()=>{}}/>);
      }
      export function renderPreview(presentation='fullscreen') {
        const catalog=generatorPreviewCatalog(defaultPracticeCatalog().generators[1]);
        return renderToStaticMarkup(<InequalityPractice initialModuleId="generator-preview" catalog={catalog} previewOnly presentation={presentation}/>);
      }
    `,resolveDir:resolve(__dirname,'..'),loader:'tsx'},platform:'node',format:'cjs',bundle:true,write:false,jsx:'automatic',loader:{'.css':'empty'},define:{'import.meta.env':'{}'},plugins:[{name:'browser-only-mathfield',setup(plugin){plugin.onLoad({filter:/ExamReviewQuestion\.tsx$/},()=>({contents:'import React from "react"; export function ExamText({text}) { return <span>{text}</span>; } export function ExamAnswer({answer}) { return <span>{answer}</span>; }',loader:'tsx'}));plugin.onResolve({filter:/^mathlive$/},()=>({path:'mathlive',namespace:'stub'}));plugin.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export class MathfieldElement {}',loader:'js'}));}}]});
    const module={exports:{}};
    runInNewContext(result.outputFiles[0].text,{module,exports:module.exports,require,console,process,crypto:webcrypto,structuredClone,URL,URLSearchParams,setTimeout,clearTimeout,TextEncoder,TextDecoder,Buffer,queueMicrotask,setImmediate,clearImmediate,AbortController,ReadableStream,WritableStream,TransformStream,window:{location:{pathname:'/teacher/practice-studio',search:'',origin:'http://qa.test'},localStorage:{getItem:()=>null},sessionStorage:{getItem:()=>null}}});
    return module.exports;
  })();
  return renderer;
}

test('answer feedback distinguishes correct/incorrect results and retains best streak after a miss', async () => {
  const {renderFeedback}=await loadRenderer();
  const correct=renderFeedback(true),incorrect=renderFeedback(false);
  assert.match(correct,/mc-practice-feedback is-correct/);assert.match(correct,/Correct/);
  assert.match(incorrect,/mc-practice-feedback is-incorrect/);assert.match(incorrect,/Incorrect/);
  assert.match(correct,/Best streak <strong>3<\/strong>/);
  assert.match(incorrect,/Streak <strong>0<\/strong>/);assert.match(incorrect,/Best streak <strong>2<\/strong>/);
});

test('checked choices identify the correct answer and a wrong selection without coloring an unanswered question', async () => {
  const {renderChoices}=await loadRenderer();
  assert.match(renderChoices('incorrect'),/is-answer-correct/);assert.match(renderChoices('incorrect'),/is-answer-incorrect/);
  assert.match(renderChoices('correct'),/is-answer-correct/);assert.doesNotMatch(renderChoices('correct'),/is-answer-incorrect/);
  assert.doesNotMatch(renderChoices(undefined),/is-answer-correct|is-answer-incorrect/);
});

test('generator preview renders the existing exam toolbar, question, drawing tool and streak statistics', async () => {
  const {renderPreview}=await loadRenderer(),html=renderPreview();
  assert.match(html,/exam-session-shell/);assert.match(html,/Exam controls/);
  assert.match(html,/Next item/);assert.match(html,/Pencil tool/);assert.match(html,/Best streak/);
  assert.match(html,/PREVIEW:/);assert.doesNotMatch(html,/ps-sample|CORRECT ANSWER/);
});

test('mini preview retains the exam controls in a bounded nonmodal region',async()=>{
 const {renderPreview}=await loadRenderer(),html=renderPreview('mini');
 assert.match(html,/mc-exam-mini mc-infinite-page/);assert.match(html,/mc-mini-viewport/);
 assert.match(html,/role="region"/);assert.match(html,/Close question preview/);
 assert.doesNotMatch(html,/mc-exam-viewer|aria-modal|role="dialog"/);
 assert.match(html,/Next item/);assert.match(html,/Pencil tool/);assert.match(html,/Best streak/);
});
