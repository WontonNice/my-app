const { test } = require('node:test');
const assert = require('node:assert/strict');
const { fixture } = require('./automation-fixture.cjs');
const { envelope, identity, merge } = require('./queue.js');
const auto = { reveal: true, advance: true, allowSubmit: true };

test('temporary A reveals official B, saves full text and wrong-choice explanations before Next, then stops', async () => {
  const { controller, state } = fixture();
  const result = await controller.run(auto);
  assert.equal(result.question.correctChoiceId, 'B'); assert.equal(result.advanced, true);
  assert.deepEqual(state.events, ['choice-A', 'submit', 'show', 'save', 'next']);
  assert.equal(state.queue.length, 1); assert.equal(state.number, 2); assert.equal(state.revealed, false);
  assert.deepEqual(result.question.incorrectChoiceExplanations, { A: 'Why A is wrong.', C: 'Why C is wrong.', D: 'Why D is wrong.' });
  assert.equal(result.question.passage.text, 'First paragraph.\n\n    A preserved second line.');
  const { importCaptures } = await import('../../tools/question-bank.mjs');
  const bank = importCaptures({ revision: 0, questions: [], sets: [] }, envelope(state.queue)).bank;
  assert.equal(bank.questions[0].correctChoiceId, 'B'); assert.equal(bank.questions[0].status, 'draft');
});
test('automation requires explicit consent before any DOM inspection', async () => {
  const { controller, document, state } = fixture(); document.querySelectorAll = () => { throw new Error('Must not inspect'); };
  await assert.rejects(controller.run({ reveal: true, advance: true }), /consent/);
  assert.deepEqual(state.events, []);
});
test('Math, tests, foreign pages rejected before any DOM inspection or answer action', async () => {
  for (const url of ['https://www.shsatlab.com/units/unit-17/practice', 'https://www.shsatlab.com/test', 'https://other.com/units/unit-1/practice']) {
    const { controller, document, state } = fixture({ url }); document.querySelectorAll = () => { throw new Error('Must not inspect'); };
    await assert.rejects(controller.run(auto), /ELA practice/); assert.deepEqual(state.events, []);
  }
});
test('manual capture remains read-only with missing key and explanation saved as a draft', async () => {
  const { controller, state } = fixture(); const result = await controller.run();
  assert.deepEqual(state.events, ['save']); assert.equal(result.question.correctChoiceId, ''); assert.equal(result.question.explanation, ''); assert.equal(result.advanced, false);
});
test('already revealed key is never resubmitted; Reveal & capture stays on the item', async () => {
  const { controller, state } = fixture({ revealed: true });
  const result = await controller.run({ reveal: true, allowSubmit: true });
  assert.deepEqual(state.events, ['show', 'save']); assert.equal(result.question.correctChoiceId, 'B'); assert.equal(state.number, 1);
});
test('key or explanation timeout stops without saving or advancing; retries do not resubmit revealed answer', async () => {
  for (const option of [{ noReveal: true }, { noExplanation: true }]) {
    const { controller, state } = fixture(option);
    await assert.rejects(controller.run(auto), /complete revealed/);
    assert.ok(!state.events.includes('next')); assert.ok(!state.events.includes('save'));
    if (state.revealed) {
      state.noExplanation = false;
      await controller.run(auto);
      assert.equal(state.events.filter(e => e === 'submit').length, 1);
    }
  }
});
test('save failure returns recovery JSON and never clicks Next', async () => {
  const { controller, state } = fixture({ failSave: true }); const result = await controller.run(auto);
  assert.equal(result.saved, false); assert.match(result.error, /NOT advanced/);
  assert.equal(result.question.correctChoiceId, 'B'); assert.ok(!state.events.includes('next')); assert.equal(state.queue.length, 0);
});
test('conflicting source signals and a collapsed passage fail before an answer selection', async () => {
  for (const options of [{ revealed: true, conflict: true }, { passageHidden: true }]) {
    const { controller, state } = fixture(options);
    await assert.rejects(controller.run(auto), /disagree|collapsed/); assert.deepEqual(state.events, []);
  }
});
test('missing Submit or disabled choices cause no temporary answer selection', async () => {
  for (const options of [{ noSubmit: true }, { choicesDisabled: true }]) {
    const { controller, state } = fixture(options);
    await assert.rejects(controller.run(auto), /Submit|already submitting/); assert.deepEqual(state.events, []);
  }
});
test('source URL/question change while revealing aborts without capture or Next', async () => {
  for (const onSubmit of [s => { s.url = 'https://www.shsatlab.com/units/unit-17/practice'; }, s => { s.number++; }]) {
    const { controller, state } = fixture({ onSubmit });
    await assert.rejects(controller.run(auto), /ELA practice|question changed/); assert.ok(!state.events.includes('next')); assert.equal(state.queue.length, 0);
  }
});
test('concurrent click rejected and capture waits for durable save before Next', async () => {
  let release; let started;
  const saving = new Promise(resolve => { started = resolve; });
  const gate = new Promise(resolve => { release = resolve; });
  const { controller, state } = fixture({ onSave: async () => { started(); await gate; } });
  const first = controller.run(auto); await saving;
  assert.ok(!state.events.includes('next'));
  await assert.rejects(controller.run(auto), /already running/);
  release(); await first; assert.equal(state.events.filter(e => e === 'submit').length, 1); assert.equal(state.events.filter(e => e === 'next').length, 1);
});
test('source changed after save, missing Next, or unchanged Next retains capture without another attempt', async () => {
  for (const options of [{ onSave: s => { s.number++; } }, { noNext: true }, { nextStuck: true }]) {
    const { controller, state } = fixture(options); const result = await controller.run(auto);
    assert.equal(result.saved, true); assert.equal(result.advanced, false); assert.ok(result.nextError);
    assert.equal(state.queue.length, 1); assert.ok(state.events.filter(e => e === 'next').length <= 1);
  }
});
test('explanation changed during save stops Next even though the visible item identity is unchanged', async () => {
  const f = fixture({ revealed: true, expanded: true });
  f.state.onSave = () => { f.headings[1].card.value += '\nA late correction.'; };
  const result = await f.controller.run(auto);
  assert.equal(result.saved, true); assert.equal(result.advanced, false); assert.match(result.nextError, /explanation changed/);
  assert.ok(!f.state.events.includes('next'));
});
test('verified Try Another variant works; repeated revealed captures enrich without duplication', async () => {
  const { controller, state } = fixture({ nextLabel: 'Try Another', revealed: true, expanded: true });
  await controller.run({ reveal: true, allowSubmit: true });
  const result = await controller.run(auto);
  assert.equal(result.updated, true); assert.equal(result.advanced, true); assert.equal(state.queue.length, 1);
});
test('Next may update a query on the same verified unit, but another unit stops the workflow', async () => {
  const same = fixture({ onNext: s => { s.url = 'https://www.shsatlab.com/units/unit-1/practice?question=next'; } });
  assert.equal((await same.controller.run(auto)).advanced, true);
  const other = fixture({ onNext: s => { s.url = 'https://www.shsatlab.com/units/unit-2/practice'; } });
  const stopped = await other.controller.run(auto); assert.equal(stopped.saved, true); assert.equal(stopped.advanced, false); assert.match(stopped.nextError, /navigated away/);
});
test('queue enrichment is immutable; contradictory recapture rejects without altering old key', () => {
  const { document, reader } = fixture({ revealed: true, expanded: true });
  const q = reader.read(document, 'https://www.shsatlab.com/units/unit-1/practice'); const queue = [q];
  assert.throws(() => merge(queue, { ...q, correctChoiceId: 'A' }), /Conflicting/);
  assert.equal(queue[0].correctChoiceId, 'B'); assert.equal(identity(q), identity({ ...q, capturedAt: 'later' }));
  const draft = { ...q, correctChoiceId: '', explanation: '', reviewNotes: ['No revealed correct answer was visible.', 'No revealed explanation was visible.'] };
  const enriched = merge(queue, draft).queue[0]; assert.equal(enriched.correctChoiceId, 'B'); assert.ok(enriched.explanation); assert.deepEqual(enriched.reviewNotes, []);
});
