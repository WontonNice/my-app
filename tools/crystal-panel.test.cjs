const { test } = require('node:test');
const assert = require('node:assert/strict');
const { resolve } = require('node:path');
const { runInNewContext } = require('node:vm');
const { build } = require('esbuild');
const { webcrypto } = require('node:crypto');

let renderer;
async function loadRenderer() {
  if (!renderer) renderer = (async () => {
    const result = await build({
      stdin: { contents: `
        import React from 'react';
        import { renderToStaticMarkup } from 'react-dom/server';
        import { CrystalDefensePanel } from './client/src/features/games/world/CrystalDefensePanel';
        export { gameExamContent } from './client/src/features/games/gameExamContent';
        import { TeacherWorldControls, SpectatorCameraControls } from './client/src/features/games/world/TeacherWorldControls';
        export function renderTeacher(mode) { return renderToStaticMarkup(<><TeacherWorldControls mode={mode} busy={false} onMode={() => {}} /><SpectatorCameraControls players={[{ id: 'maya', name: 'Maya' }]} followId='maya' onFollow={() => {}} /></>); }
        export function renderPanel({ teacher = true, mode = 'playtest', phase = 'battle', question = false, busy = false, shield = false, retry = 'none', speedStacks = 0, pickup, detailsOpen, pending = false, infinite = false } = {}) {
          const id = teacher ? 'teacher' : 'student';
          const crystal = {
            runId: 'qa-run', config: { source: infinite ? { kind: 'infinite-math', moduleId: 'all' } : { kind: 'exam-math', assessmentId: 'all' } },
            sourceTitle: 'Fictional math', phase, wave: phase === 'lobby' ? 0 : 6, waveSize: 2,
            hearts: phase === 'defeat' ? 0 : 5, participants: [{ id, name: 'Tester', ready: true, score: 100, lastSeen: 1000, online: true, spectating: teacher && mode === 'spectate',
              speedStacks, retryReady: retry === 'ready', pickedItemWave: pickup ? 6 : undefined, pendingMonsterId: pending ? 'm1' : undefined,
              lastPickup: pickup ? { itemId: 'item-1', kind: pickup, at: 1000 } : undefined,
              lastResult: retry === 'used' ? { monsterId: 'm1', correct: false, retry: true, at: 1000, points: 0 } : undefined }],
            hostId: id, isHost: true, canAdmin: teacher && mode === 'playtest', teacherMode: mode, teamShieldActive: shield,
            serverNow: 1000, movementPaused: phase !== 'battle', questionCount: 3,
            questionsRemaining: 2, totalPoints: 100, activePlayers: 1, defeated: 1,
            items: [{ id: 'item-1', ownerId: id, kind: 'speed', x: 8, z: 0, pickedUpAt: pickup ? 1000 : undefined }],
            monsters: [{ id: 'm1', status: question || pending ? 'challenged' : 'active', claimedBy: question ? id : pending ? 'teammate' : undefined, failedIds: [], stage: 0, retryAvailableFor: retry === 'active' ? id : undefined }],
            challenges: question ? [{ playerId: id, monsterId: 'm1', attemptId: 'attempt-1', question: { subject: 'Math', question: {
              id: 'q1', type: 'multiple_choice', prompt: 'What is 1 + 1?', topic: 'Addition',
              choices: [{ id: 'A', text: '2' }, { id: 'B', text: '3' }],
            } } }] : [],
          };
          return renderToStaticMarkup(<CrystalDefensePanel room={{ id: 'qa-room', isHost: teacher, serverNow: 1000, crystal }}
            accessToken="fictional-token" actorId={id} act={async () => true} busy={busy} error=""
            open={detailsOpen ?? (phase === 'lobby' || phase === 'battle' && !question)} setOpen={() => {}}
            arena={phase !== 'lobby'} onMonster={() => {}} focusWorld={() => {}} />);
        }
      `, resolveDir: resolve(__dirname, '..'), loader: 'tsx' },
      platform: 'node', format: 'cjs', bundle: true, write: false, jsx: 'automatic',
      loader: { '.css': 'empty' }, define: { 'import.meta.env': '{}' },
      plugins: [{ name: 'browser-only-mathfield', setup(plugin) {
        plugin.onResolve({ filter: /^mathlive$/ }, () => ({ path: 'mathlive', namespace: 'mathfield-stub' }));
        plugin.onLoad({ filter: /.*/, namespace: 'mathfield-stub' }, () => ({ contents: 'export class MathfieldElement {}', loader: 'js' }));
      } }],
    });
    const module = { exports: {} };
    runInNewContext(result.outputFiles[0].text, {
      module, exports: module.exports, require, console, process, crypto: webcrypto, URL, URLSearchParams,
      setTimeout, clearTimeout, TextEncoder, TextDecoder, Buffer, queueMicrotask,
      setImmediate, clearImmediate, AbortController, ReadableStream, WritableStream, TransformStream,
      window: { location: { pathname: '/games', search: '', origin: 'http://qa.test' },
        localStorage: { getItem: () => null }, sessionStorage: { getItem: () => null } },
    }, { filename: 'crystal-panel-render.cjs' });
    return module.exports;
  })();
  return renderer;
}

test('teacher controls remain available before starting, during a question, and after defeat', async () => {
  const { renderPanel } = await loadRenderer();
  for (const props of [{ phase: 'lobby' }, {}, { question: true }, { phase: 'defeat' }]) {
    const html = renderPanel(props);
    assert.match(html, /Teacher controls/, JSON.stringify(props));
    assert.match(html, /Jump/, 'teachers can go straight to a chosen wave');
    assert.match(html, /Destroy crystal/, 'teachers can exercise the real defeat state');
  }
});

test('student game hosts cannot see teacher admin controls', async () => {
  const { renderPanel } = await loadRenderer();
  for (const props of [{ phase: 'lobby' }, {}, { question: true }, { phase: 'defeat' }]) {
    const html = renderPanel({ ...props, teacher: false });
    assert.doesNotMatch(html, /Teacher controls|Destroy crystal|Restore 5 hearts/);
  }
});

test('battle UI explains the fastest crossing time and active team protection', async () => {
  const { renderPanel } = await loadRenderer();
  const html = renderPanel({ shield: true });
  assert.match(html, /100s|100 seconds|1m 40s/);
  assert.match(html, /[Tt]eam shield/);
  assert.match(html, /12 seconds|12s/);
});

test('wave items show ownership, capped speed, and a stored retry without exposing pickup buttons', async () => {
  const { renderPanel } = await loadRenderer();
  const waiting = renderPanel({ teacher: false, retry: 'ready' });
  assert.match(waiting, /Your speed potion is on the field\. Walk over it!/);
  assert.match(waiting, /Retry ready for next question/);
  assert.match(waiting, /reserved for you/);
  const collected = renderPanel({ speedStacks: 99, pickup: 'speed' });
  assert.match(collected, /Speed \+30% · MAX/);
  assert.match(collected, /Wave item collected · One per player/);
  assert.doesNotMatch(collected, /Speed \+990/);
});

test('retry feedback keeps the question open and explains the remaining attempt', async () => {
  const { renderPanel } = await loadRenderer();
  const first = renderPanel({ teacher: false, question: true, retry: 'active' });
  assert.match(first, /Retry token active: you get one extra attempt on this question/);
  assert.match(first, /You then answer this same question once more/);
  const retry = renderPanel({ teacher: false, question: true, retry: 'used' });
  assert.match(retry, /retry token kept this monster frozen/);
  assert.match(retry, /Try again/);
  assert.match(retry, /What is 1 \+ 1\?/);
  assert.doesNotMatch(retry, /Monster is walking again/);
});

test('a current question must be answered before another monster can be chosen', async () => {
  const { renderPanel } = await loadRenderer();
  const html = renderPanel({ teacher: false, question: true });
  assert.match(html, /Answer this question before choosing another monster/);
  assert.match(html, /What is 1 \+ 1\?/);
  assert.match(html, /aria-label="Exam controls"/);
  assert.match(html, /aria-label="Pencil tool"/);
  assert.match(html, /aria-label="Next item"/);
  assert.doesNotMatch(html, /Cast your answer|crystal-question-content/);
  assert.doesNotMatch(html, /Release monster|Release this monster|Return to island|Nearby challenges/);
});

test('game content retains authored math markup and structured answer configuration', async () => {
  const { gameExamContent } = await loadRenderer();
  const question = { id: 'shipping', type: 'math_drag_drop', topic: 'Rates', prompt: 'Complete the table.',
    promptHtml: '<p>Shipping <strong>costs</strong></p>', dragDropContent: ['<table><tr><td>2</td><td>{{cost}}</td></tr></table>'],
    dragDropSlots: [{ id: 'cost', correctItemId: 'two' }], choices: [{ id: 'two', text: '2', math: '2' }], dragDropStyle: 'outlined' };
  const session = gameExamContent('room', 'Shipping', [{ subject: 'Mathematics', question }]);
  assert.equal(session.screen, 'mathQuestion');
  assert.equal(session.content.mathSection.questions[0], question, 'shared player receives the original complete question');
  assert.equal(session.content.passageSets.length, 0);
});

test('game content preserves poem layout, images, HTML, and all questions in a passage', async () => {
  const { gameExamContent } = await loadRenderer();
  const passage = { id: 'poem', title: 'Morning', format: 'poem', lines: [{ text: 'Light', html: '<em>Light</em>', align: 'indent', lineNumber: '5', image: { src: '/diagram.png', alt: 'Sun' } }] };
  const first = { id: 'reading-1', type: 'multiple_choice', prompt: 'Which detail?', topic: 'Reading' };
  const second = { id: 'reading-2', type: 'multi_select', prompt: 'Select two.', topic: 'Reading', requiredSelections: 2 };
  const session = gameExamContent('room', 'Reading', [{ subject: 'English', question: first, passage }, { subject: 'English', question: second, passage }]);
  assert.equal(session.screen, 'passage');
  assert.equal(session.content.passageSets[0].passage, passage);
  assert.equal(session.content.passageSets[0].questions[0], first);
  assert.equal(session.content.passageSets[0].questions[1], second);
  assert.equal(session.content.passageSets[0].questionCount, 2);
  const standalone = gameExamContent('room', 'English', [{ subject: 'English', question: second }]);
  assert.equal(standalone.screen, 'standaloneQuestion');
  assert.equal(standalone.content.standaloneSection.questions[0], second);
  assert.throws(() => gameExamContent('room', 'Empty', []), /at least one question/);
});

test('teacher admin is accessible directly from the arena without a question or details panel', async () => {
  const { renderPanel } = await loadRenderer();
  for (const phase of ['battle', 'intermission']) {
    const html = renderPanel({ phase, detailsOpen: false });
    assert.match(html, /class="crystal-admin-launcher" aria-haspopup="dialog"/);
    assert.match(html, /Teacher controls/);
    assert.doesNotMatch(html, /MONSTER CHALLENGE|aria-label="Crystal Defense lobby"/);
    assert.doesNotMatch(renderPanel({ teacher: false, phase, detailsOpen: false }), /crystal-admin-launcher|Teacher controls/);
  }
});

test('reconnecting defenders see their existing monster assignment while a teammate solves it', async () => {
  const { renderPanel } = await loadRenderer();
  const html = renderPanel({ teacher: false, detailsOpen: false, pending: true });
  assert.match(html, /A teammate is solving your current monster/);
  assert.doesNotMatch(html, /Reinforcements arrive|Walk to a monster, then click/);
});

test('ordinary teacher play and spectating hide admin controls throughout the game', async () => {
  const { renderPanel } = await loadRenderer();
  for (const mode of ['play', 'spectate']) for (const phase of ['lobby', 'battle', 'intermission', 'defeat']) {
    const html = renderPanel({ mode, phase });
    assert.doesNotMatch(html, /Teacher controls|Destroy crystal|Restore 5 hearts|crystal-admin-launcher/);
  }
  const watching = renderPanel({ mode: 'spectate', phase: 'battle' });
  assert.match(watching, /Spectating your class/);
  assert.doesNotMatch(watching, /aria-label="Your wave items"|>Monsters<|Walk to a monster/);
  const lobby = renderPanel({ mode: 'spectate', phase: 'lobby' });
  assert.doesNotMatch(lobby, /I&#x27;m ready|Ready ✓/); assert.match(lobby, /0 active defenders/);
});

test('teacher mode selection and camera following have labeled controls', async () => {
  const { renderTeacher } = await loadRenderer();
  const html = renderTeacher('spectate');
  assert.match(html, /Choose teacher mode/); assert.match(html, /aria-pressed="true"[^>]*>.*?Spectate<\/button>/);
  assert.match(html, />Play<\/button>/); assert.match(html, />Playtest<\/button>/);
  assert.match(html, /Free camera/); assert.match(html, /value="maya" selected="">Follow Maya/);
});

test('configured infinite math displays unlimited generated practice instead of a finite question count', async () => {
  const { renderPanel } = await loadRenderer();
  const html = renderPanel({ infinite: true, phase: 'lobby' });
  assert.match(html, /Unlimited generated practice/);
  assert.doesNotMatch(html, /not available yet|3 questions in rotation/);
});
