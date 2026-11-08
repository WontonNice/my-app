const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const { webcrypto } = require('node:crypto');
const { build } = require('esbuild');
const reactAliases = require('./react-build-aliases.cjs');

let renderer;
async function loadRenderer() {
  if (!renderer) renderer = (async () => {
    const result = await build({
      stdin: {
        contents: `
          import React from 'react';
          import { renderToStaticMarkup } from 'react-dom/server';
          import { ExamSessionPage } from './client/src/pages/ExamSessionPage';
          import { LibraryBookSession } from './client/src/components/LibraryBookSession';
          export function renderLibrary(book) {
            return renderToStaticMarkup(<LibraryBookSession book={book} revision="qa" accessToken="" studentName="Teacher preview" preview teacher backHref="/study-hall/shsat/materials?entry=reading" onComplete={() => {}} />);
          }
          import { createExamPreviewSession } from './tools/exam-preview-content';
          import { resolveExamContent } from './client/src/content/exams';
          export { getExamSectionAccess, getOpenExamSubject, getExamResumePosition } from './client/src/lib/examSessionProgress';
          export { createAssessmentSectionLines } from './client/src/lib/exam';
          export { resolveExamContent };
          export { generalDirectionsParts } from './client/src/components/ExamGeneralDirections';
          import assessments from './server/data/assessments.json';
          import worksheets from './server/data/worksheets.json';
          export { assessments, worksheets };
          export function renderStudioPreview(id, subject) {
            const assessment = [...assessments, ...worksheets].find(item => item.id === id);
            const content = {...resolveExamContent(assessment), previewMetadata:{durationMinutes:assessment.durationMinutes,studyHallWorksheet:assessment.studyHallWorksheet}};
            const session = createExamPreviewSession(content, subject, () => {});
            return renderToStaticMarkup(<ExamSessionPage previewSession={session} />);
          }
          export function renderExam(id, screen, transform = content => content, sessionOptions = {}) {
            const assessment = { ...assessments.find(item => item.id === id), sectionAccess: { english: true, math: true } };
            const content = transform(resolveExamContent(assessment));
            return renderToStaticMarkup(<ExamSessionPage gameSession={{
              assessment, content, screen, studentName: 'QA Student', answers: {},
              onAnswersChange() {}, onSubmit: async () => true,
              timerText: '3:00:00', subjectPosition: { current: 1, total: 57 }, ...sessionOptions,
            }} />);
          }
        `,
        resolveDir: resolve(__dirname, '..'), loader: 'tsx',
      },
      platform: 'node', format: 'cjs', bundle: true, write: false,
      // Resolve the renderer and components to the same workspace React copy.
      alias: reactAliases(resolve(__dirname, '..')),
      jsx: 'automatic', loader: { '.css': 'empty' }, define: { 'import.meta.env': '{}' },
      plugins: [{ name: 'browser-only-mathfield', setup(plugin) {
        plugin.onResolve({ filter: /^mathlive$/ }, () => ({ path: 'mathlive', namespace: 'mathfield-stub' }));
        plugin.onLoad({ filter: /.*/, namespace: 'mathfield-stub' }, () => ({
          contents: 'export class MathfieldElement {}', loader: 'js',
        }));
      } }],
    });
    const module = { exports: {} };
    runInNewContext(result.outputFiles[0].text, {
      module, exports: module.exports, require, console, process, crypto: webcrypto,
      URL, URLSearchParams, setTimeout, clearTimeout, TextEncoder, TextDecoder,
      Buffer, queueMicrotask, setImmediate, clearImmediate, AbortController,
      ReadableStream, WritableStream, TransformStream,
      window: { location: { pathname: '/exam/2021-2022-form-a/session', search: '', origin: 'http://qa.test' },
        localStorage: { getItem: () => null }, sessionStorage: { getItem: () => null } },
    }, { filename: 'exam-session-render.cjs' });
    return module.exports;
  })();
  return renderer;
}

test('Content Studio mounts the student player with isolated teacher navigation and answer controls', async () => {
  const { renderStudioPreview } = await loadRenderer();
  for (const subject of ['english', 'math']) {
    const html = renderStudioPreview('2026-2027-form-b', subject);
    assert.match(html, /data-player-profile="testnav"/);
    assert.match(html, /Specialized High Schools Admissions Test/);
    assert.match(html, /Next item/);
    assert.match(html, /Notepad tool/);
    assert.doesNotMatch(html, /Supabase auth is not configured/);
    assert.match(html, /Jump to question/);
    assert.match(html, /Reveal correct answer/);
    assert.match(html, /Math 50/);
  }
});

test('2021–2022 Form A renders a math question independently of its English passages', async () => {
  const { renderExam } = await loadRenderer();
  // Use the plain-text question here; diagram HTML is exercised in browser QA.
  const html = renderExam('2021-2022-form-a', 'mathQuestion', content => ({
    ...content, mathSection: { ...content.mathSection, questions: content.mathSection.questions.slice(1).map(q => ({ ...q, promptHtml: undefined, choices: q.choices?.map(choice => ({ ...choice, html: undefined })) })) },
  }));
  assert.match(html, /2021-2022 FORM A/);
  assert.match(html, /owner of a tree farm/);
  assert.match(html, /2021-2022-form-a-q59/);
});

test('a math-only exam selects math and still respects teacher locks', async () => {
  const { worksheets, resolveExamContent, getExamSectionAccess, getOpenExamSubject } = await loadRenderer();
  // This catalog now includes English in Form A; use the actual math-only worksheet.
  const content = resolveExamContent(worksheets.find(item => item.id === 'grade-9-2018-2019'));
  const access = getExamSectionAccess(content, { english: true, math: true });
  assert.equal(access.english, false);
  assert.equal(access.math, true);
  assert.equal(getOpenExamSubject('english', access), 'math');
  assert.equal(getOpenExamSubject('english', getExamSectionAccess(content, { english: true, math: false })), null);
});

test('launch summary reflects the actual math-only exam content', async () => {
  const { worksheets, createAssessmentSectionLines } = await loadRenderer();
  const sections = createAssessmentSectionLines(worksheets.find(item => item.id === 'grade-9-2018-2019'));
  assert.equal(sections.length, 2);
  assert.equal(sections[1].label, 'Math');
  assert.equal(sections[1].questionCount, 13);
});

test('registered exams render their available section introductions', async () => {
  const { assessments, resolveExamContent, renderExam } = await loadRenderer();
  for (const assessment of assessments) {
    const content = resolveExamContent(assessment);
    if (content.mathSection?.questions.length) assert.doesNotThrow(() => renderExam(assessment.id, 'mathIntro'), assessment.id);
    if (content.passageSets.length) assert.doesNotThrow(() => renderExam(assessment.id, 'passageIntro'), assessment.id);
  }
});

test('Form D whispering-gallery standalone renders its bank, sentence and saved placement', async () => {
  const { renderExam } = await loadRenderer();
  const { load } = require('cheerio');
  const id = 'official-shsat-2026-d-48';
  const isolate = content => ({ ...content, passageSets: [], mathSection: undefined,
    standaloneSection: { ...content.standaloneSection,
      // Node has no DOMParser. Exercise the equivalent plain sentence here;
      // the authored rich response layout is checked in the browser preview.
      questions: content.standaloneSection.questions.filter(question => question.id === id)
        .map(question => ({ ...question, dragDropContentHtml: undefined })), questionCount: 1 },
    questionOrder: [id],
  });
  const empty = load(renderExam('2026-2027-form-d', 'standaloneQuestion', isolate));
  assert.deepEqual(empty('.exam-math-drag-bank button').map((_, el) => empty(el).text()).get(), [
    'guide the sound waves in a specific direction',
    'focus the sound waves to travel through the space',
    'direct the sound waves to move along the curves of the arches',
    'transfer the sound waves to a variety of different locations',
  ]);
  assert.equal(empty('[data-answer-slot="slot-1"]').length, 1);
  assert.match(empty('[data-answer-slot="slot-1"]').attr('style'), /width:475px/);
  assert.match(empty('.exam-math-drag-lines').text(), /because the tiled archways/);
  assert.equal(empty('h1 blockquote u').text(), 'send the sound through the environment');
  const filled = load(renderExam('2026-2027-form-d', 'standaloneQuestion', isolate, {
    answers: { [id]: { 'slot-1': 'item-3' } },
  }));
  assert.equal(filled('.exam-math-drag-bank button').length, 3);
  assert.equal(filled('[data-answer-slot="slot-1"]').text(), 'direct the sound waves to move along the curves of the arches');
});

test('all transferred category-sort screens retain every card, source markup and keyboard target',async()=>{
  const {assessments,resolveExamContent,renderExam}=await loadRenderer();
  const {load}=require('cheerio');
  let official=0,sat=0;
  for(const assessment of assessments.filter(a=>/^2026-2027-form-[abcd]$/.test(a.id)||a.id==='digital-shsat-practice-test-5')) {
    const content=resolveExamContent(assessment);
    const entries=[...content.passageSets.flatMap(set=>set.questions.map(question=>({set,question,screen:'passage'}))),...(content.standaloneSection?.questions||[]).map(question=>({question,screen:'standaloneQuestion'}))];
    for(const {set,question,screen} of entries.filter(e=>e.question.type==='category_sort')) {
      const isolated=c=>({...c,passageSets:set?[{...set,questions:[question],questionCount:1}]:[],standaloneSection:set?undefined:{...c.standaloneSection,questions:[question],questionCount:1},mathSection:undefined,questionOrder:[question.id]});
      const $=load(renderExam(assessment.id,screen,isolated));
      const cards=$('.exam-category-bank button,.exam-standalone-category-bank button');
      assert.equal(cards.length,question.items.length,question.id);
      const targets=$('.exam-category-target,.exam-standalone-category-target');
      assert.equal(targets.length,question.categories.length,question.id);
      targets.each((_,el)=>assert.equal($(el).attr('tabindex'),'0',question.id));
      question.items.forEach((item,index)=>{
        const source=load(item.html||item.text),expected=source.root().text().replace(/\s+/g,' ').trim();
        assert.equal(cards.eq(index).text().replace(/\s+/g,' ').trim(),expected,question.id);
        for(const tag of ['strong','em','u','img'])assert.equal(cards.eq(index).find(tag).length,source(tag).length,`${question.id}: ${tag}`);
      });
      if(assessment.id.startsWith('2026'))official++;else sat++;
    }
  }
  assert.equal(official,4);assert.equal(sat,1);
});


test('corrections use the live player for all three question layouts with bounded review navigation and no exam submission', async () => {
  const { renderExam } = await loadRenderer();
  const question = { id: 'correction-q', type: 'multiple_choice', prompt: 'Review this authored question', topic: 'Inference', choices: [{id:'A',text:'Original answer'}, {id:'B',text:'Another answer'}], correctChoiceId: 'B' };
  const directions = { subject: 'English', title: 'Directions', body: 'Read', notes: [] };
  for (const screen of ['passage', 'standaloneQuestion', 'mathQuestion']) {
    const html = renderExam('2021-2022-form-a', screen, content => ({ ...content,
      passageSets: screen === 'passage' ? [{ id:'p', passage:{id:'p',title:'Passage',format:'prose',lines:[{text:'Preserved passage text.'}]}, directions, questions:[question], questionCount:1 }] : [],
      standaloneSection: {id:'s',label:'English',directions,questions:[question],questionCount:1},
      mathSection: {id:'m',label:'Math',directions,questions:[question],questionCount:1},
    }), { answers:{'correction-q':'A'}, hideTimer:true, correctionReview:{number:12,canPrevious:true,canNext:false,onPrevious(){},onNext(){}} });
    assert.match(html, /CORRECTIONS/);
    assert.match(html, /QUESTION 12/);
    assert.match(html, /Review this authored question/);
    assert.match(html, /Original answer/);
    assert.doesNotMatch(html, /<button[^>]*aria-disabled="true"[^>]*aria-label="Previous item"/);
    assert.match(html, /<button[^>]*aria-disabled="true"[^>]*aria-label="Next item"/);
    assert.doesNotMatch(html, /Show timer|Submit section|Questions answered/);
    if (screen === 'passage') assert.match(html, /Preserved passage text/);
  }
});

test('TestNav revising directions retain full source wording, bold best and Stand Alone Items label', async () => {
  const { renderExam } = await loadRenderer();
  const {load} = require('cheerio');
  const partA=load(renderExam('2026-2027-form-a','readingDirections',content=>({...content,passageSets:content.passageSets.filter(set=>set.directions.title==='REVISING/EDITING PART A')})));
  assert.match(partA('.exam-reading-directions-content').text(),/improve the writing quality of each text and to correct errors/);
  assert.match(partA('.exam-reading-directions-content').text(),/while being mindful of time, before selecting the best answer for each question/);
  assert.equal(partA('.exam-reading-directions-content strong').last().text(),'best');
  const partB=load(renderExam('2026-2027-form-a','standaloneDirections'));
  assert.match(partB('.exam-reading-directions-content').text(),/sentences or short paragraphs follow the conventions of standard written English/);
  assert.match(partB('.exam-reading-directions-content').text(),/use the notepad tool or write on the scrap paper given to you/);
  assert.equal(partB('.exam-reading-directions-content strong').last().text(),'best');
  assert.match(partB('[aria-label="Exam location"]').text(),/ELA - STAND ALONE ITEMS/);
});

test('TestNav standalone items have forward-only navigation and no Review or Bookmark tools', async () => {
  const {renderExam}=await loadRenderer();
  const {load}=require('cheerio');
  const page=load(renderExam('2026-2027-form-a','standaloneQuestion'));
  assert.match(page('[aria-label="Exam location"]').text(),/ELA - STAND ALONE ITEMS/);
  assert.equal(page('progress').length,0);
  assert.equal(page('.exam-session-progress').length,0);
  assert.equal(page('button[aria-label="Previous item"]').attr('aria-disabled'),'true');
  assert.notEqual(page('button[aria-label="Next item"]').attr('aria-disabled'),'true');
  assert.equal(page('.exam-session-review-tools').length,0);
  assert.equal(page('[aria-label="Review questions"]').length,0);
  assert.equal(load(renderExam('2026-2027-form-a','standaloneDirections'))('.exam-session-review-tools').length,0);
  const passage=load(renderExam('2026-2027-form-a','passage'));
  assert.equal(passage('.exam-session-review-tools').length,1,'Passage questions still allow review within their set');
});

test('Form B standalone question three retains its boxed paragraph and four sentence cards before its single target', async () => {
  const {renderExam}=await loadRenderer(),{load}=require('cheerio');
  const page=load(renderExam('2026-2027-form-b','standaloneQuestion',content=>({...content,standaloneSection:{...content.standaloneSection,questions:[content.standaloneSection.questions[2]]}})));
  assert.equal(page('.exam-standalone-document.is-category-sort').length,1);
  assert.match(page('[data-boxed="true"]').text(),/On the evening of July 13, 2019/);
  assert.deepEqual(page('.exam-standalone-category-bank button').toArray().map(el=>page(el).text()),['Sentence 1','Sentence 2','Sentence 3','Sentence 4']);
  assert.equal(page('.exam-standalone-category-target h2').text(),'Contains an error in construction');
  const children=page('.exam-standalone-category-sort').children();
  assert.ok(children.eq(0).hasClass('exam-standalone-category-bank'));
  assert.ok(children.eq(1).hasClass('exam-standalone-category-target-grid'));
});

test('TestNav math directions retain all four full notes, selective emphasis and notepad directions', async () => {
  const {renderExam}=await loadRenderer();
  const {load}=require('cheerio');
  const page=load(renderExam('2026-2027-form-a','mathDirections'));
  const notes=page('.exam-math-directions-page li');
  assert.equal(notes.length,4);
  assert.equal(notes.eq(0).text(),'Formulas and definitions of mathematical terms and symbols are not provided.');
  assert.match(notes.eq(1).text(),/Do not assume any relationship in a diagram unless it is specifically stated or can be determined from the information given\./);
  assert.equal(notes.eq(2).text(),'Assume that a diagram is in one plane unless the question specifically states that it is not.');
  assert.match(notes.eq(3).text(),/concurrent lines, straight lines, collinear points, right angles, etc\./);
  assert.equal(notes.find('strong').length,2);
  assert.equal(notes.eq(1).find('strong').text(),'not');
  assert.equal(notes.eq(2).find('strong').length,0);
  assert.match(page('.exam-math-directions-page > p').text(),/When you are solving problems, you can use the online notepad tool or write on the scrap paper given to you\./);
  assert.equal(page('.exam-session-progress').length,0);
});

test('every exam uses shared math directions, including older and SAT Crash Course exams', async () => {
  const {renderExam,assessments,resolveExamContent}=await loadRenderer();
  const {load}=require('cheerio');
  let checked=0;
  for(const assessment of assessments){
    const content=resolveExamContent(assessment);
    if(!content.mathSection?.questions.length)continue;
    assert.match(content.mathSection.directions.notes[3],/collinear points, right angles, etc\./,assessment.id);
    const page=load(renderExam(assessment.id,'mathDirections'));
    assert.equal(page('.exam-math-directions-page li').length,4,assessment.id);
    assert.equal(page('.exam-math-directions-page li strong').length,2,assessment.id);
    assert.match(page('.exam-math-directions-page > p').text(),/online notepad tool or write on the scrap paper given to you\./,assessment.id);
    checked++;
  }
  assert.ok(checked>4,'Must cover the full catalog beyond A-D');
  const imported=load(renderExam('2026-2027-form-a','mathDirections',content=>({...content,source:{playerProfile:'sat_crash_course'},mathSection:{...content.mathSection,directions:{subject:'Old',title:'Old',notes:['Old imported note'],body:'Old imported directions'}}})));
  assert.equal(imported('.exam-math-directions-page li').length,4,'Old imported snapshots also receive shared directions');
  assert.match(imported('.exam-math-directions-page > p').text(),/online notepad tool/);
});

test('exam source never changes the shared player, directions, controls or question formatting', async () => {
  const {renderExam}=await loadRenderer();
  const question={id:'shared-question',type:'multiple_choice',prompt:'Shared question',topic:'Inference',choices:[{id:'A',text:'First answer'},{id:'B',text:'Second answer'}],correctChoiceId:'B'};
  const directions={subject:'English Language Arts',title:'READING COMPREHENSION',body:'Legacy source directions'};
  const fixture=(sourceProfile)=>content=>({...content,source:{playerProfile:sourceProfile},questionOrder:undefined,
    passageSets:[{id:'shared-passage',questionCount:1,directions,passage:{id:'p',title:'Shared passage',format:'prose',source:{playerProfile:sourceProfile},lines:[{kind:'title',text:'Shared passage'},{text:'Keep original wording and emphasis.',html:'Keep <strong>original</strong> wording and <em>emphasis</em>.'}]},questions:[{...question,source:{playerProfile:sourceProfile}}]}],
    standaloneSection:{id:'standalone',label:'Old imported label',questionCount:1,directions,questions:[{...question,source:{playerProfile:sourceProfile}}]},
    mathSection:{...content.mathSection,questions:[{...question,source:{playerProfile:sourceProfile}}]},
  });
  for(const screen of ['passage','standaloneQuestion','mathQuestion','readingDirections','standaloneDirections','mathDirections']) {
    const baseline=renderExam('2026-2027-form-a',screen,fixture('testnav'));
    assert.doesNotMatch(baseline,/<progress|exam-session-progress/);
    for(const profile of ['sat_crash_course','prestige','other_source']) {
      const imported=renderExam('2026-2027-form-a',screen,fixture(profile));
      assert.equal(imported,baseline,`${profile}: ${screen} must render exactly the same player`);
    }
  }
});

test('all catalog exam players use the TestNav profile regardless of source', async () => {
  const {renderExam,assessments,resolveExamContent}=await loadRenderer();
  let checked=0;
  for(const assessment of assessments){
    const content=resolveExamContent(assessment);
    const screen=content.passageSets.length ? 'readingDirections' : 'mathDirections';
    const html=renderExam(assessment.id,screen);
    assert.match(html,/data-player-profile="testnav"/,assessment.id);
    assert.doesNotMatch(html,/data-player-profile="sat_crash_course"|<progress|exam-session-progress/,assessment.id);
    checked++;
  }
  assert.ok(checked>4);
});

test('general directions match the TestNav cover and planning text for every exam with actual counts', async () => {
  const {renderExam,assessments,resolveExamContent,generalDirectionsParts}=await loadRenderer();
  const {load}=require('cheerio');
  assert.deepEqual(JSON.parse(JSON.stringify(generalDirectionsParts(50,50,'math'))),[{name:'Mathematics',count:50,start:1,end:50},{name:'English Language Arts',count:50,start:51,end:100}]);
  assert.deepEqual(JSON.parse(JSON.stringify(generalDirectionsParts(0,57,'english'))),[{name:'Mathematics',count:57,start:1,end:57}]);
  for(const assessment of assessments){
    const content=resolveExamContent(assessment),page=load(renderExam(assessment.id,'directions'));
    const total=content.passageSets.reduce((n,p)=>n+p.questions.length,0)+(content.standaloneSection?.questions.length||0)+(content.mathSection?.questions.length||0);
    assert.equal(page('#exam-session-title').text(),'Specialized High Schools Admissions Test');
    assert.match(page('.exam-session-page-header').text(),/The New York City Department of Education/);
    assert.match(page('.exam-session-content-block').first().text(),new RegExp('This test consists of '+total+' questions across'));
    assert.match(page('.exam-general-planning').text(),/In a computer adaptive test \(CAT\), you must answer every question\./);
    assert.match(page('.exam-general-planning').text(),new RegExp('end after '+assessment.durationMinutes+' minutes'));
    assert.equal(page('.exam-general-planning > ul > li').length,content.passageSets.length || content.standaloneSection?.questions.length ? 5 : 4);
    assert.equal(page('.exam-general-planning ul ul li').length,content.passageSets.length || content.standaloneSection?.questions.length ? 1 : 0);
    if(content.passageSets.length || content.standaloneSection?.questions.length) assert.match(page('.exam-general-planning ul ul').text(),/once you advance forward from the last question of that set/);
    assert.doesNotMatch(page.text(),/Your answers stay saved after submission|Your teacher keeps|SHSAT Practice TestGrade/);
    assert.equal(page('progress').length,0);
  }
});

test('Smallest Spark blurb wraps above the title; poem verses retain their source layout', async () => {
  const {renderExam}=await loadRenderer(),{load}=require('cheerio');
  const page=load(renderExam('2026-2027-form-b','passage',content=>({...content,passageSets:content.passageSets.filter(set=>set.passage.title.includes('Smallest Spark'))})));
  const context=page('.exam-poem-line.is-intro');
  assert.equal(context.length,1);
  assert.match(context.text(),/Located underground near Geneva, Switzerland/);
  assert.match(context.text(),/17-mile-long ring/);
  assert.equal(context.find('em').length,1,'Keep original italic emphasis');
  const paragraphs=page('.exam-question-passage-scroll .exam-poem-line');
  assert.ok(paragraphs.toArray().indexOf(context[0]) < paragraphs.toArray().findIndex(e=>page(e).hasClass('is-title')),'Blurb must precede title');
  assert.ok(page('.exam-poem-line:not(.is-context)').toArray().some(e=>page(e).text().includes('There are the things the world is made of')));
});

test('library adapter renders the existing player and each question’s original passage', async () => {
  const { renderLibrary } = await loadRenderer();
  const passage = { id: 'source-version', title: 'Original version title', format: 'prose', lines: [{kind:'title', text:'Original version title'}, {lineNumber:1, text:'The original passage text stays with its question.'}] };
  const question = { id:'library-q', prompt:'Which detail is supported?', type:'multiple_choice', topic:'Inference', choices:[{id:'A',text:'First choice'},{id:'B',text:'Second choice'}], correctChoiceId:'A' };
  const html = renderLibrary({ id:'book-fixture', passageSet:{ id:'book-fixture', passage:{...passage,lines:[{text:'Wrong combined fallback'}]}, questions:[question], questionCount:1, directions:{body:'Read the passage.',title:'Read',subject:'English'} }, versions:[], questionPassages:{'library-q':passage} });
  assert.match(html, /data-player-profile="testnav"/);
  assert.doesNotMatch(html, /game-answer-lock|<fieldset/);
  assert.match(html, /Original version title/); assert.match(html, /original passage text stays/);
  assert.doesNotMatch(html, /Wrong combined fallback/);
  assert.match(html, /Next item/); assert.match(html, /Notepad tool/);
  assert.match(html, /Book settings/); assert.match(html, /Scores saved separately from assessments/);
});

test('worksheet entry bypasses exam introductions and preserves the saved question', async () => {
  const { worksheets, resolveExamContent, getExamResumePosition } = await loadRenderer();
  const worksheet = worksheets.find(item => item.id === 'grade-9-2018-2019');
  const content = resolveExamContent(worksheet);
  assert.equal(getExamResumePosition(content, 'math', null).screen, 'mathIntro');
  assert.equal(getExamResumePosition(content, 'math', null, true).screen, 'mathQuestion');
  const progress = {answers:{}, completedSections:[], navigation:{subject:'math',math:{screen:'mathQuestion',questionId:content.mathSection.questions[1].id}},status:'in_progress',updatedAt:''};
  assert.equal(getExamResumePosition(content, 'math', progress, true).questionIndex, 1);
});

test('worksheet teacher preview opens at a question without student save controls', async () => {
  const {renderStudioPreview}=await loadRenderer();
  const {load}=require('cheerio');
  const page=load(renderStudioPreview('grade-9-2018-2019','math'));
  assert.equal(page('.exam-math-panel').length,1);
  assert.equal(page('.exam-preview-controls').length,1);
  assert.equal(page('.exam-worksheet-exit').length,0);
  assert.equal(page('.exam-general-directions-document').length,0);
});
