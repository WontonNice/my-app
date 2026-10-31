const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const contentCode = readFileSync(join(__dirname, 'content.js'), 'utf8');
const popupCode = readFileSync(join(__dirname, 'popup.js'), 'utf8');

test('reader labels the digital English standalone section even when it has supporting paragraph text',async()=>{
  const result=await fixture({count:50,start:47}).scan({includeAnswer:true,includePassageQuestions:false,includeExplanations:false});
  assert.equal(result.ok,true);
  assert.equal(result.data.testPreview.question.contentRole,'standalone');
});

// Synthetic DOM fixtures use the selectors and BACK/NEXT behavior observed on the live preview.
// No site content, cookies, React state, or private endpoints are needed for these regressions.
function fixture({ count = 10, start = 1, visible = false, groupEnd = 7,
  passage = true, ids = true, stuckNext = false, stuckBack = false,
  explanationVisible = false, explanationDelay = 0, missingExplanations = [], explanationControl = true } = {}) {
  const state = { number: start, visible, clock: 0, clicks: [], explanationVisible, explanationOpenedAt: 0, explanationNumber: start };
  let listener;
  class Element {
    constructor(text = '', children = {}) {
      this.innerText = this.textContent = text;
      this.children = children;
      this.nodeType = 1; this.tagName = 'DIV';
      this.id = '';
      this.disabled = false;
    }
    querySelector(selector) { return this.children[selector] || null; }
    querySelectorAll(selector) { return this.children[selector] || []; }
    getAttribute() { return null; }
    getClientRects() { return [{}]; }
    contains() { return false; }
  }
  const empty = new Element();
  const button = (label, action, disabled = false) => {
    const result = new Element(label);
    result.disabled = disabled;
    result.click = () => { state.clicks.push(label); action(); };
    return result;
  };
  const buttons = () => [
    button(state.visible ? 'Hide answer' : 'Show answer', () => { state.visible = !state.visible; }),
    ...(explanationControl ? [button('Explanation', () => {
      state.explanationVisible = !state.explanationVisible;
      if (state.explanationVisible) { state.explanationOpenedAt = state.clock; state.explanationNumber = state.number; }
    })] : []),
    button('BACK', () => { if (!stuckBack) state.number--; }, state.number === 1),
    button('NEXT', () => { if (!stuckNext) state.number++; }, state.number === count),
  ];
  const explanationBox = () => state.explanationVisible
    ? new Element(missingExplanations.includes(state.explanationNumber) ? '' : state.clock - state.explanationOpenedAt < explanationDelay ? 'Loading...' : `Explanation ${state.explanationNumber}`)
    : null;
  const preview = new Element();
  preview.querySelectorAll = (selector) => {
    if (selector === 'button') return buttons();
    if (selector === '.testSHSATPreview__questionChoiceWrapper') {
      return ['A', 'B', 'C', 'D'].map((label) => new Element('', {
        '.testSHSATPreview__choiceText': new Element(`${label}.`),
        '.testSHSATPreview__questionChoiceText': new Element(`Choice ${label} for ${state.number}`),
        '.testSHSATPreview__radioButton--selected': state.visible && label === 'B' ? empty : null,
      }));
    }
    return [];
  };
  preview.querySelector = (selector) => {
    if (selector === '.testSHSATPreview__navigatorToggle') return new Element(`Question ${state.number}/${count}`);
    if (selector === '.testSHSATPreview__moduleSelect') return new Element('English Language Arts');
    if (selector === '.testSHSATPreview__questionQuestion') return new Element(`Prompt ${state.number}`);
    if (selector === '.testSHSATPreview__questionNumber') return new Element(String(state.number));
    if (selector === '.testSHSATPreview__explanationBox') return explanationBox();
    if (selector.includes('passage')) {
      if (!passage) return null;
      const group = state.number <= groupEnd ? 1 : 2;
      const result = new Element(`Passage ${group}`);
      result.id = ids ? `passage group-${group}` : '';
      return result;
    }
    return null;
  };
  const document = {
    title: 'Test preview', body: empty,
    querySelector: (selector) => selector === '.testSHSATPreview__popup--explanation' ? state.explanationVisible ? empty : null :
      selector === '.testSHSATPreview__explanationBox' ? explanationBox() : selector === '.testSHSATPreview' ? preview :
      selector === '.testSHSATPreview__moduleSelect' ? new Element('English Language Arts') : null,
    querySelectorAll: () => [],
  };
  class ClockDate extends Date { static now() { return state.clock; } }
  vm.runInNewContext(contentCode, {
    document, HTMLElement: Element, Date: ClockDate, URL, NathanSatRichText: require('./rich-text.js'),
    location: { href: 'https://tutor.thesatcrashcourse.com/tests/digital-shsat/example',
      origin: 'https://tutor.thesatcrashcourse.com', pathname: '/tests/digital-shsat/example' },
    getComputedStyle: () => ({ display: 'block', visibility: 'visible', opacity: '1' }),
    setTimeout: (callback, ms) => { state.clock += ms; queueMicrotask(callback); },
    chrome: { runtime: { onMessage: { addListener: (callback) => { listener = callback; } } } },
  });
  const scan = (options = {}) => new Promise((resolve) => {
    listener({ type: 'SAT_READER_SCAN', options }, {}, resolve);
  });
  return { state, scan };
}

test('captures questions 1–7, excludes the next passage, and restores hidden answers', async () => {
  const page = fixture();
  const response = await page.scan({ includeAnswer: true });
  assert.equal(response.ok, true);
  assert.equal(response.data.schemaVersion, 3);
  const result = response.data.testPreview;
  assert.deepEqual(Array.from(result.questions, (q) => q.number), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(result.question.number, 1);
  assert.equal(result.questions[6].correctAnswer.label, 'B');
  assert.equal(result.questions[6].explanation, 'Explanation 7');
  assert.ok(result.questions.every(question => question.explanationStatus === 'captured'));
  assert.equal(result.capture.explanationsRequested, true);
  assert.equal(result.capture.stopReason, 'next-passage');
  assert.equal(result.capture.restoredStartingQuestion, true);
  assert.equal(result.capture.warnings.length, 0);
  assert.equal(page.state.number, 1);
  assert.equal(page.state.visible, false);
  assert.equal(page.state.explanationVisible, false);
});

test('starting midway captures the entire passage, preserving starting question and shown answers', async () => {
  const page = fixture({ start: 4, visible: true });
  const result = (await page.scan({ includeAnswer: true })).data.testPreview;
  assert.deepEqual(Array.from(result.questions, (q) => q.number), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(result.question.number, 4);
  assert.equal(page.state.number, 4);
  assert.equal(page.state.visible, true);
});

test('single-question opt-out does not navigate', async () => {
  const page = fixture({ start: 3 });
  const result = (await page.scan({ includePassageQuestions: false })).data.testPreview;
  assert.equal(result.questions.length, 1);
  assert.ok(!page.state.clicks.includes('BACK') && !page.state.clicks.includes('NEXT'));
});

test('complete ELA mode crosses passage boundaries and restores the starting controls', async () => {
  const page=fixture({count:10,start:4,groupEnd:7,visible:true,explanationVisible:true});
  const result=(await page.scan({captureMode:'ela-all',includeAnswer:true,includeExplanations:true})).data.testPreview;
  assert.deepEqual(Array.from(result.questions,q=>q.number),Array.from({length:10},(_,i)=>i+1));
  assert.equal(result.capture.mode,'ela-all');assert.equal(result.capture.complete,true);assert.equal(result.capture.missingNumbers.length,0);
  assert.equal(page.state.number,4);assert.equal(page.state.visible,true);assert.equal(page.state.explanationVisible,true);
});

test('answer opt-out does not click Show answer', async () => {
  const page = fixture();
  const result = (await page.scan({ includeAnswer: false })).data.testPreview;
  assert.ok(result.questions.every((q) => q.correctAnswer === null));
  assert.ok(!page.state.clicks.includes('Show answer'));
  assert.ok(result.questions.every(question => question.explanation === `Explanation ${question.number}`));
});

test('opens each explanation, waits for delayed text, and avoids the previous question explanation', async () => {
  const page = fixture({ count: 4, groupEnd: 4, explanationDelay: 600 });
  const result = (await page.scan({ includeAnswer: true })).data.testPreview;
  assert.deepEqual(Array.from(result.questions, question => question.explanation), ['Explanation 1', 'Explanation 2', 'Explanation 3', 'Explanation 4']);
  assert.equal(result.capture.warnings.length, 0);
  assert.equal(page.state.explanationVisible, false);
  assert.equal(page.state.visible, false);
  assert.equal(page.state.number, 1);
});

test('explanation-only capture restores an initially open panel on the original question', async () => {
  const page = fixture({ start: 4, explanationVisible: true });
  const result = (await page.scan({ includeAnswer: false })).data.testPreview;
  assert.equal(result.question.explanation, 'Explanation 4');
  assert.ok(result.questions.every(question => question.explanation === `Explanation ${question.number}`));
  assert.equal(page.state.explanationVisible, true);
  assert.equal(page.state.explanationNumber, 4);
  assert.equal(page.state.number, 4);
  assert.equal(page.state.visible, false);
});

test('missing explanations remain blank and do not discard neighboring questions', async () => {
  const page = fixture({ count: 3, groupEnd: 3, missingExplanations: [2] });
  const result = (await page.scan()).data.testPreview;
  assert.equal(result.questions.length, 3);
  assert.equal(result.questions[1].explanation, '');
  assert.equal(result.questions[1].explanationStatus, 'missing');
  assert.equal(result.questions[2].explanation, 'Explanation 3');
  assert.match(result.capture.warnings.join(' '), /Question 2.*left blank/);
  assert.equal(page.state.number, 1);
  assert.equal(page.state.explanationVisible, false);
});

test('missing Explanation controls produce a marked capture without inventing explanations', async () => {
  const page = fixture({ count: 2, groupEnd: 2, explanationControl: false });
  const result = (await page.scan()).data.testPreview;
  assert.equal(result.questions.length, 2);
  assert.ok(result.questions.every(question => question.explanation === '' && question.explanationStatus === 'missing'));
  assert.equal(result.capture.warnings.length, 2);
});

test('explanation opt-out neither opens the panel nor exports an already open explanation', async () => {
  for (const visible of [false, true]) {
    const page = fixture({ explanationVisible: visible });
    const result = (await page.scan({ includePassageQuestions: false, includeExplanations: false })).data.testPreview;
    assert.equal(result.question.explanation, '');
    assert.equal(result.question.explanationStatus, 'not-requested');
    assert.equal(result.capture.explanationsRequested, false);
    assert.ok(!page.state.clicks.includes('Explanation'));
    assert.equal(page.state.explanationVisible, visible);
  }
});

test('stops safely at end of module', async () => {
  const page = fixture({ count: 5, groupEnd: 5 });
  const result = (await page.scan()).data.testPreview;
  assert.equal(result.questions.length, 5);
  assert.equal(result.capture.stopReason, 'end-of-module');
  assert.equal(page.state.number, 1);
});

test('no passage stays on a single question; missing IDs use canonical passage text', async () => {
  const single = fixture({ passage: false });
  const result = (await single.scan()).data.testPreview;
  assert.equal(result.questions.length, 1);
  assert.equal(result.capture.stopReason, 'no-passage');
  const fallback = fixture({ ids: false });
  assert.equal((await fallback.scan()).data.testPreview.questions.length, 7);
});

test('navigation timeout returns a marked partial result without duplicating questions', async () => {
  const page = fixture({ stuckNext: true });
  const result = (await page.scan({ includeAnswer: true })).data.testPreview;
  assert.equal(result.questions.length, 1);
  assert.equal(result.capture.stopReason, 'interrupted');
  assert.match(result.capture.warnings[0], /Timed out/);
  assert.equal(result.capture.restoredStartingQuestion, true);
  assert.equal(page.state.visible, false);
});

test('failed restoration is reported instead of claiming success', async () => {
  const page = fixture({ stuckBack: true, groupEnd: 2 });
  const result = (await page.scan()).data.testPreview;
  assert.equal(result.questions.length, 2);
  assert.equal(result.capture.restoredStartingQuestion, false);
  assert.match(result.capture.warnings[0], /Return to Question 1 manually/);
});

test('safety limit bounds capture and restores position', async () => {
  const page = fixture({ count: 70, groupEnd: 70 });
  const result = (await page.scan()).data.testPreview;
  assert.equal(result.questions.length, 50);
  assert.equal(result.capture.stopReason, 'question-limit');
  assert.equal(result.capture.warnings.length, 1);
  assert.equal(page.state.number, 1);
});

test('concurrent scan is rejected', async () => {
  const page = fixture();
  const running = page.scan();
  const second = await page.scan();
  assert.equal(second.ok, false);
  assert.match(second.error, /already running/);
  assert.equal((await running).ok, true);
});

function popupFixture(data, storage = {}, { failWrites = false, failReads = false } = {}) {
  const elements = new Map();
  let sent;
  const context = vm.createContext({
    document: { querySelector: (selector) => {
      if (!elements.has(selector)) elements.set(selector, {
        checked: true, value: selector === '#capture-mode' ? 'passage' : selector === '#question-range' ? '47-50' : '',
        hidden: selector === '#results', open: false, listeners: {},
        closest() { return {}; },
        addEventListener(type, listener) { (this.listeners[type] ??= []).push(listener); },
      });
      return elements.get(selector);
    } },
    chrome: { storage: { local: {
      get: async () => { if (failReads) throw new Error('Storage unavailable'); return structuredClone(storage); },
      set: async values => { if (failWrites) throw new Error('Quota exceeded'); Object.assign(storage, structuredClone(values)); },
    } }, tabs: {
      query: async () => [{ id: 1, url: 'https://tutor.thesatcrashcourse.com/tests/example' }],
      sendMessage: async (_id, message) => { sent = message; return { ok: true, data }; },
    } },
  });
  vm.runInContext(popupCode, context);
  return { elements, context, get sent() { return sent; } };
}

test('popup requests the group, counts all questions and exports one CSV row per question', async () => {
  const data = (await fixture().scan({ includeAnswer: true })).data;
  const popup = popupFixture(data);
  await vm.runInContext('scanPage()', popup.context);
  assert.equal(popup.sent.options.includePassageQuestions, true);
  assert.equal(popup.sent.options.includeExplanations, true);
  assert.equal(popup.elements.get('#question-count').textContent, '7');
  assert.match(popup.elements.get('#status').textContent, /Questions 1–7/);
  assert.match(popup.elements.get('#explanation-count').textContent, /7 of 7/);
  const csv = vm.runInContext('toCsv(state.data)', popup.context);
  assert.equal(csv.split('\r\n').length, 8);
  assert.match(csv, /Choice B for 7/);
  assert.match(csv, /Explanation 7/);
});

test('popup reports partial explanation capture and preserves opt-out choices', async () => {
  const data = (await fixture({ count: 3, groupEnd: 3, missingExplanations: [2] }).scan()).data;
  const popup = popupFixture(data);
  popup.elements.get('#include-answer').checked = false;
  await vm.runInContext('scanPage()', popup.context);
  assert.equal(popup.sent.options.includeAnswer, false);
  assert.equal(popup.sent.options.includeExplanations, true);
  assert.match(popup.elements.get('#explanation-count').textContent, /2 of 3/);
  assert.match(popup.elements.get('#status').textContent, /Question 2/);
});

test('captured explanations reach the Content Editor unchanged for every question', async () => {
  const data = (await fixture({ explanationDelay: 400 }).scan({ includeAnswer: true })).data;
  const workspaceCode = readFileSync(join(__dirname, '../../tools/content-studio-workspace.js'), 'utf8');
  const ui = vm.runInNewContext(workspaceCode + '\nstudioUI;', { URL });
  const imported = ui.convertSatCrashCourseImport(JSON.stringify(data));
  assert.equal(imported.passage.questions.length, 7);
  for (const [index, question] of imported.passage.questions.entries()) {
    assert.equal(question.explanation, data.testPreview.questions[index].explanation);
    assert.equal(question.correctChoiceId, 'B');
  }
});

test('CSV remains compatible with legacy single-question data and escapes text', async () => {
  const data = (await fixture().scan({ includePassageQuestions: false })).data;
  delete data.testPreview.questions;
  data.testPreview.question.prompt = 'A "quoted", question';
  const popup = popupFixture(data);
  popup.context.data = data;
  const csv = vm.runInContext('toCsv(data)', popup.context);
  assert.equal(csv.split('\r\n').length, 2);
  assert.match(csv, /"A ""quoted"", question"/);
});

test('starting in the second passage excludes the previous passage', async () => {
  const page = fixture({ start: 9 });
  const result = (await page.scan()).data.testPreview;
  assert.deepEqual(Array.from(result.questions, (q) => q.number), [8, 9, 10]);
  assert.equal(page.state.number, 9);
});

test('updated popup rejects old page scripts instead of claiming single-question success', async () => {
  const data = (await fixture().scan()).data;
  delete data.readerVersion;
  delete data.testPreview.questions;
  const popup = popupFixture(data);
  await vm.runInContext('scanPage()', popup.context);
  assert.match(popup.elements.get('#status').textContent, /older reader script/);
  assert.equal(popup.elements.get('#status').className, 'status error');
  assert.equal(popup.elements.get('#results').hidden, true);
  assert.equal(vm.runInContext('state.data', popup.context), null);
});

test('popup retains compatible legacy batch exports but does not claim all-ELA support', async () => {
  const data = (await fixture().scan()).data;
  data.readerVersion = '0.7.1';
  const popup = popupFixture(data);
  popup.elements.get('#capture-mode').value = 'math-all';
  await vm.runInContext('scanPage()', popup.context);
  assert.equal(popup.elements.get('#results').hidden, false);
  assert.equal(popup.elements.get('#question-count').textContent, '7');
  assert.equal(vm.runInContext('state.data', popup.context), data);
  popup.elements.get('#capture-mode').value = 'ela-all';
  await vm.runInContext('scanPage()', popup.context);
  assert.match(popup.elements.get('#status').textContent, /older reader script/);
  assert.equal(popup.elements.get('#results').hidden, true);
});

test('closing and reopening restores the complete scan and CSV without contacting the source tab', async () => {
  const data = (await fixture().scan()).data;
  const storage = {};
  const first = popupFixture(data, storage);
  await vm.runInContext('scanPage()', first.context);
  const originalCsv = vm.runInContext('toCsv(state.data)', first.context);
  const reopened = popupFixture(undefined, storage);
  await vm.runInContext('ready', reopened.context);
  assert.equal(reopened.sent, undefined, 'reopening must never start another scan');
  assert.equal(reopened.elements.get('#results').hidden, false);
  assert.equal(reopened.elements.get('#question-count').textContent, '7');
  assert.equal(reopened.elements.get('#preview').textContent, JSON.stringify(data, null, 2));
  assert.equal(vm.runInContext('toCsv(state.data)', reopened.context), originalCsv);
  assert.match(reopened.elements.get('#status').textContent, /Restored saved scan/);
});

test('capture mode, question range, unchecked settings, and expanded preview survive reopening', async () => {
  const storage = {};
  const first = popupFixture(undefined, storage);
  await vm.runInContext('ready', first.context);
  first.elements.get('#capture-mode').value = 'part-b';
  first.elements.get('#question-range').value = '42-46';
  first.elements.get('#include-explanations').checked = false;
  first.elements.get('#include-answer').checked = false;
  first.elements.get('#results details').open = true;
  await first.elements.get('#question-range').listeners.input[0]();
  const reopened = popupFixture(undefined, storage);
  await vm.runInContext('ready', reopened.context);
  assert.equal(reopened.elements.get('#capture-mode').value, 'part-b');
  assert.equal(reopened.elements.get('#question-range').value, '42-46');
  assert.equal(reopened.elements.get('#include-explanations').checked, false);
  assert.equal(reopened.elements.get('#include-answer').checked, false);
  assert.equal(reopened.elements.get('#question-range-field').hidden, false);
  assert.equal(reopened.elements.get('#scan').textContent, 'Read Part B questions');
  assert.equal(reopened.elements.get('#results details').open, true);
});

test('a failed rescan preserves the previous saved export, while a successful rescan replaces it', async () => {
  const data = (await fixture().scan()).data;
  const storage = {};
  const first = popupFixture(data, storage);
  await vm.runInContext('scanPage()', first.context);
  const stale = popupFixture({ ...data, readerVersion: 'stale' }, storage);
  await vm.runInContext('scanPage()', stale.context);
  assert.equal(storage.satReaderCapture.data.readerVersion, data.readerVersion);
  const replacement = (await fixture({ start: 9 }).scan()).data;
  const second = popupFixture(replacement, storage);
  await vm.runInContext('scanPage()', second.context);
  const reopened = popupFixture(undefined, storage);
  await vm.runInContext('ready', reopened.context);
  assert.equal(reopened.elements.get('#preview').textContent, JSON.stringify(replacement, null, 2));
});

test('storage failures preserve downloadable scan results and explain that they are not saved', async () => {
  const data = (await fixture().scan()).data;
  const popup = popupFixture(data, {}, { failWrites: true, failReads: true });
  await vm.runInContext('scanPage()', popup.context);
  assert.equal(popup.elements.get('#results').hidden, false);
  assert.match(popup.elements.get('#status').textContent, /Download JSON before closing/);
  assert.match(vm.runInContext('toCsv(state.data)', popup.context), /Explanation 7/);
  assert.equal(popup.elements.get('#scan').disabled, false);
});
