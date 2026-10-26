const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const THREE = require('three');
const { crystalMonsterPosition, crystalTravelMs } = require('../server/src/shared/crystalDefense.ts');
const { disposeObject } = require('../client/src/features/games/world/avatars.ts');
const originalLoad = Module._load;
const sprite = (text, _color, _background, _width, crowned = false) => {
  const label = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.Texture() }));
  label.userData.text = text; label.userData.crowned = crowned; return label;
};
Module._load = function (request, parent, ...rest) {
  if (parent?.filename.endsWith('crystalScene.ts') && request === './scenery') return { makeTextSprite: sprite };
  return originalLoad.call(this, request, parent, ...rest);
};
const { createCrystalArena, createCrystalPortal, CRYSTAL_PORTAL } = require('../client/src/features/games/world/crystalScene.ts');
Module._load = originalLoad;
const monster = (overrides = {}) => ({ id: 'm1', lane: 0, progress: 0, lastMovedAt: 1000, stage: 0, maxStrikes: 3, status: 'active', failedIds: [], changedAt: 1000, ...overrides });
const view = (monsters, overrides = {}) => ({ runId: 'test-run', phase: 'battle', serverNow: 1000, wave: 1, movementPaused: false, participants: [{ id: 'teacher', name: 'Teacher', ready: true, online: true }], monsters, items: [], hearts: 5, ...overrides });

test('personal potions and retry tokens show ownership and dispose when collected or replaced', () => {
  const scene = new THREE.Scene(), arena = createCrystalArena(scene); arena.root.visible = true;
  const speed = { id: 'speed-1', ownerId: 'teacher', kind: 'speed', x: 8, z: 5 };
  const retry = { id: 'retry-1', ownerId: 'maya', kind: 'retry', x: -9, z: 6 };
  try {
    arena.update(view([], { items: [speed, retry] }), 'teacher');
    const own = arena.item(speed.id), other = arena.item(retry.id);
    assert.deepEqual(own.root.position.toArray(), [8, 0, 5]);
    assert.equal(own.label.visible, true); assert.match(own.label.userData.text, /YOURS.*SPEED POTION/);
    assert.equal(other.label.visible, false, 'other players do not see a misleading Yours label');
    assert.equal(own.body.children[0].material.opacity, 1);
    assert.ok(other.body.children[0].material.opacity < .5, 'reserved teammate items are visibly dimmed');
    arena.animate(2, .04, false); assert.notEqual(own.body.position.y, .85);
    arena.animate(3, .04, true); assert.equal(own.body.position.y, .85); assert.equal(own.body.rotation.y, 0);
    arena.update(view([], { items: [speed, retry] }), 'maya');
    assert.equal(own.label.visible, false); assert.equal(other.label.visible, true); assert.match(other.label.userData.text, /RETRY TOKEN/);
    let disposedGeometry = 0, disposedLabel = 0;
    own.body.children[0].geometry.addEventListener('dispose', () => disposedGeometry++);
    own.label.material.map.addEventListener('dispose', () => disposedLabel++);
    arena.update(view([], { items: [{ ...speed, pickedUpAt: 0 }, retry] }), 'maya');
    assert.equal(arena.item(speed.id), undefined); assert.equal(disposedGeometry, 1); assert.equal(disposedLabel, 1);
    let oldRetryDisposed = 0; other.body.children[0].geometry.addEventListener('dispose', () => oldRetryDisposed++);
    arena.update(view([], { wave: 2, items: [{ ...retry, id: 'retry-2' }] }), 'maya');
    assert.equal(oldRetryDisposed, 1); assert.equal(arena.item('retry-1'), undefined);
    const waveTwo = arena.item('retry-2');
    arena.update(view([], { runId: 'new-run', wave: 2, items: [{ ...retry, id: 'retry-2' }] }), 'maya');
    assert.notEqual(arena.item('retry-2'), waveTwo, 'a new run cannot retain an old pickup rig even when an id repeats');
    arena.update(undefined); assert.equal(arena.item('retry-2'), undefined);
  } finally { disposeObject(scene); }
});

test('host name tags draw a gold crown without depending on emoji fonts', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const paths = [], text = [], colors = [];
  const context = { beginPath() {}, roundRect() {}, fill() { colors.push(this.fillStyle); }, stroke() {}, moveTo(x, y) { paths.push([x, y]); }, lineTo(x, y) { paths.push([x, y]); }, closePath() {}, fillRect() {}, fillText(...args) { text.push(args); } };
  globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => context }) };
  const { makeTextSprite } = require('../client/src/features/games/world/scenery.ts');
  let host, ordinary;
  try {
    host = makeTextSprite('Teacher', '#234', '#fff', 2.5, true);
    assert.equal(host.userData.crowned, true); assert.equal(host.userData.text, 'Teacher');
    assert.ok(colors.includes('#edb939'), 'the crown is explicitly gold');
    assert.equal(paths.length, 7, 'a complete crown silhouette is drawn');
    assert.deepEqual(text.at(-1), ['Teacher', 448, 70, 582], 'text leaves clear space for the badge');
    ordinary = makeTextSprite('Maya', '#234', '#fff', 2.5);
    assert.equal(ordinary.userData.crowned, false);
    assert.equal(paths.length, 7, 'ordinary name tags do not draw another crown');
    assert.deepEqual(text.at(-1), ['Maya', 384, 70, 710]);
  } finally {
    if (host) disposeObject(host); if (ordinary) disposeObject(ordinary);
    if (previous) Object.defineProperty(globalThis, 'document', previous); else delete globalThis.document;
  }
});

test('the portal has an open walkable entrance and every monster appears in the arena', () => {
  const scene = new THREE.Scene(), portal = createCrystalPortal(scene), arena = createCrystalArena(scene);
  try {
    assert.ok(portal.root.children.length > 8);
    assert.equal(portal.root.position.z, CRYSTAL_PORTAL.z);
    assert.ok(portal.obstacles.every(obstacle => Math.hypot(obstacle.x - CRYSTAL_PORTAL.x, obstacle.z - CRYSTAL_PORTAL.z) > obstacle.radius + CRYSTAL_PORTAL.radius));
    arena.update(view(Array.from({ length: 64 }, (_, i) => monster({ id: 'monster-' + i, lane: i * 2.4 }))));
    assert.equal(arena.root.children.filter(child => child.name.startsWith('crystal-monster-')).length, 64, 'the full wave is visible even with more monsters than players');
    assert.equal(arena.targets().length, 64, 'every approaching monster can be challenged');
    assert.equal(arena.root.children.filter(child => child.isSprite).some(label => /reserve/i.test(label.userData.text)), false);
  } finally { disposeObject(scene); }
});

test('monsters walk continuously, freeze for a question, and resume without jumping after a wrong answer', () => {
  let clock = 0;
  const scene = new THREE.Scene(), arena = createCrystalArena(scene, () => clock); arena.root.visible = true;
  try {
    let data = monster(); arena.update(view([data]));
    const rig = arena.monster(data.id), before = rig.root.position.clone();
    clock = 10000; arena.animate(10, 1, false);
    assert.ok(rig.root.position.z < before.z, 'an unclaimed monster keeps walking while players answer elsewhere');
    assert.notEqual(rig.feet[0].rotation.x, 0, 'the feet show the walking motion');
    const firstPosition = rig.root.position.z;
    clock = 20000; arena.update(view([data])); arena.animate(20, 1, false);
    assert.ok(rig.root.position.z < firstPosition, 'presence-only rerenders cannot reset the server clock anchor');
    const expected = crystalMonsterPosition(data, 21000, 1);
    assert.ok(Math.abs(rig.root.position.z - expected.z) < .001);
    data = { ...data, status: 'challenged', claimedBy: 'teacher', progress: 20000 / crystalTravelMs(1), lastMovedAt: 21000 };
    arena.update(view([data], { serverNow: 21000 }));
    const frozen = rig.root.position.clone();
    clock = 140000; arena.animate(140, 1, false);
    assert.equal(rig.shield.visible, true);
    assert.deepEqual(rig.root.position.toArray(), frozen.toArray(), 'the challenged monster remains still for the full two-minute solve');
    assert.equal(rig.feet[0].rotation.x, 0);
    data = { ...data, status: 'active', claimedBy: undefined, failedIds: ['teacher'], stage: 1, lastMovedAt: 141000 };
    arena.update(view([data], { serverNow: 141000 })); arena.animate(140, .016, false);
    assert.deepEqual(rig.root.position.toArray(), frozen.toArray(), 'a wrong answer resumes from the same position without a jump');
    assert.equal(rig.resolvedAt, undefined, 'a wrong answer never kills or breaches the monster');
    assert.equal(rig.shield.visible, false);
    assert.equal(rig.label.userData.text, '!', 'a monster needing help displays an exclamation mark');
    clock = 150000; arena.animate(150, 1, false);
    assert.ok(rig.root.position.z < frozen.z, 'the monster walks again and can be rescued');
    let disposed = 0; rig.body.children[0].geometry.addEventListener('dispose', () => disposed++);
    data = { ...data, status: 'defeated', progress: data.progress + 10000 / crystalTravelMs(1), lastMovedAt: 151000 }; arena.update(view([data], { serverNow: 151000 })); arena.animate(151.1, .016, false);
    assert.equal(arena.monster(data.id), undefined);
    assert.equal(disposed, 1);
    arena.update(view([data])); assert.equal(arena.monster(data.id), undefined, 'later presence refreshes do not resurrect defeated enemies');
  } finally { disposeObject(scene); }
});

test('later waves walk faster, disconnected games pause, and breach effects happen at the crystal', () => {
  let clock = 0;
  const scene = new THREE.Scene(), slow = createCrystalArena(scene, () => clock), fast = createCrystalArena(scene, () => clock);
  slow.root.visible = true; fast.root.visible = true;
  try {
    let data = monster(); slow.update(view([data])); fast.update(view([data], { wave: 6 }));
    clock = 10000; slow.animate(10, 1, false); fast.animate(10, 1, false);
    assert.ok(fast.monster(data.id).root.position.z < slow.monster(data.id).root.position.z, 'later waves visibly approach faster');
    data = { ...data, progress: 10000 / crystalTravelMs(1), lastMovedAt: 11000, moving: false };
    slow.update(view([data], { serverNow: 11000, movementPaused: true })); slow.animate(11, 1, false);
    const paused = slow.monster(data.id).root.position.clone();
    clock = 60000; slow.animate(60, 1, false);
    assert.ok(slow.monster(data.id).root.position.distanceTo(paused) < .001, 'an offline pause does not extrapolate movement');
    data = { ...data, status: 'breached', progress: 1, lastMovedAt: 61000 };
    slow.update(view([data], { serverNow: 61000, hearts: 4 })); slow.animate(60.05, .05, false);
    const rig = slow.monster(data.id);
    assert.equal(rig.resolvedAt, undefined, 'a delayed breach snapshot does not make the monster vanish far from the crystal');
    let arrived = false;
    for (let i = 2; i < 100 && slow.monster(data.id); i++) {
      slow.animate(60 + i * .05, .05, false);
      if (rig.resolvedAt !== undefined) {
        arrived = true; assert.equal(rig.root.position.length(), 1, 'the monster reaches the crystal before its fade');
      }
    }
    assert.equal(arrived, true); assert.equal(slow.monster(data.id), undefined);
  } finally { disposeObject(scene); }
});

test('reinforcements coexist with failed monsters, shield rates stay continuous, and admin restarts clear old rigs', () => {
  let clock = 0;
  const scene = new THREE.Scene(), arena = createCrystalArena(scene, () => clock); arena.root.visible = true;
  try {
    const failed = monster({ id: 'missed', failedIds: ['teacher'], stage: 1, progress: .2, travelMs: 150000 });
    arena.update(view([failed]));
    const old = arena.monster('missed'); let disposed = 0;
    old.body.children[0].geometry.addEventListener('dispose', () => disposed++);
    clock = 12000;
    const reinforcement = monster({ id: 'fresh', lane: 1, lastMovedAt: 13000, changedAt: 13000, travelMs: 150000 });
    const advanced = { ...failed, progress: .28, lastMovedAt: 13000 };
    arena.update(view([advanced, reinforcement], { serverNow: 13000 })); arena.animate(12, 1, false);
    assert.equal(arena.targets().length, 2, 'a new target appears without replacing the missed enemy');
    assert.equal(arena.monster('missed'), old, 'the missed monster keeps its existing rig');
    assert.ok(Math.abs(arena.monster('fresh').root.position.length() - 17) < .001);
    const shieldedRate = { ...advanced, travelMs: 300000 };
    arena.update(view([shieldedRate, { ...reinforcement, status: 'challenged', claimedBy: 'teacher', moving: false }], { serverNow: 13000, teamShieldActive: true }));
    assert.equal(arena.root.getObjectByName('crystal-team-shield').visible, true);
    clock = 22000; arena.animate(22, 1, false);
    const slowPoint = crystalMonsterPosition(shieldedRate, 23000, 1);
    assert.ok(Math.abs(old.root.position.z - slowPoint.z) < .001, 'the displayed team shield uses the server movement rate');
    arena.update(view([shieldedRate, reinforcement], { phase: 'defeat', serverNow: 23000, hearts: 0, movementPaused: true })); arena.animate(23, .016, false);
    assert.equal(arena.root.getObjectByName('crystal-core').visible, false, 'destroying the crystal removes its intact core');
    assert.equal(arena.root.getObjectByName('crystal-team-shield').visible, false);
    arena.update(view([monster({ id: 'restart', travelMs: 100000 })], { runId: 'new-admin-run', wave: 6, serverNow: 23000 }));
    assert.equal(disposed, 1, 'jumping waves disposes the old live monsters');
    assert.equal(arena.monster('missed'), undefined); assert.equal(arena.monster('fresh'), undefined);
    assert.equal(arena.targets().length, 1);
    assert.equal(arena.root.getObjectByName('crystal-core').visible, true, 'restarting after defeat restores the crystal');
  } finally { disposeObject(scene); }
});

test('portal entry, transport, nearby interaction, and camera drags stay separate', () => {
  const saved = new Map(['window', 'document', 'HTMLElement', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const listeners = new Map(); let frameCallback, timestamp = 0, renderer;
  class Element {
    constructor(tagName = 'DIV') { this.tagName = tagName; this.clientWidth = 800; this.clientHeight = 600; this.listeners = new Map(); this.classList = { add() {}, remove() {} }; }
    append() {} setAttribute() {} remove() {} setPointerCapture() {}
    addEventListener(event, handler) { this.listeners.set(event, handler); } removeEventListener(event) { this.listeners.delete(event); }
    getBoundingClientRect() { return { left: 0, top: 0, width: 800, height: 600 }; }
    contains(element) { return this === element; } focus() { document.activeElement = this; }
  }
  class Renderer {
    constructor() { this.domElement = new Element('CANVAS'); this.shadowMap = {}; renderer = this; }
    setPixelRatio() {} setSize() {} dispose() {} forceContextLoss() {}
    render(scene, camera) { this.scene = scene; this.camera = camera; scene.updateMatrixWorld(true); camera.updateMatrixWorld(true); }
  }
  globalThis.HTMLElement = Element;
  globalThis.document = { activeElement: null, addEventListener() {}, removeEventListener() {} };
  globalThis.window = { devicePixelRatio: 1, matchMedia: () => ({ matches: false }), addEventListener: (event, handler) => listeners.set(event, handler), removeEventListener: event => listeners.delete(event) };
  globalThis.ResizeObserver = class { observe() {} disconnect() {} };
  globalThis.requestAnimationFrame = callback => { frameCallback = callback; return 1; }; globalThis.cancelAnimationFrame = () => {};
  Module._load = function (request, parent, ...rest) {
    if (parent?.filename.endsWith('worldRenderer.ts')) {
      if (request === 'three') return { ...THREE, WebGLRenderer: Renderer };
      if (request === './scenery') return { createScenery: scene => { const root = new THREE.Group(); scene.add(root); return { root, obstacles: [], animate() {} }; }, makeTextSprite: sprite };
    }
    return originalLoad.call(this, request, parent, ...rest);
  };
  let runtime;
  try {
    const { createWorldScene } = require('../client/src/features/games/world/worldRenderer.ts');
    const moves = [], claimed = [], hints = []; let entries = 0;
    const host = new Element();
    runtime = createWorldScene(host, pose => moves.push(pose), () => {}, assert.fail, () => {}, { onPortalEnter: () => entries++, onMonsterClick: id => claimed.push(id), onHint: text => hints.push(text) });
    let state = { selfId: 'teacher', name: 'Teacher', character: 'frog', players: [], disabled: false, arena: 'lobby', initialPose: { x: 0, y: 0, z: 12, rotation: 0, moving: false } };
    const frame = () => { timestamp += 40; frameCallback(timestamp); };
    runtime.setState(state); frame(); frame(); assert.equal(entries, 1, 'standing in the portal does not repeatedly join');
    state = { ...state, arena: 'crystal', crystal: view([monster()]) }; runtime.setState(state); frame();
    assert.equal(moves.at(-1).z, 5, 'transport overrides the old lobby position');
    runtime.interactMonster('m1'); assert.equal(claimed.length, 0); assert.match(hints.at(-1), /closer/);
    const nearPose = { x: 0, y: 0, z: 15, rotation: 0, moving: false };
    runtime.setState({ ...state, disabled: true }); runtime.setState({ ...state, initialPose: nearPose });
    for (let i = 0; i < 70; i++) frame();
    listeners.get('keydown')({ code: 'KeyE', target: host, repeat: false, preventDefault() {} });
    assert.deepEqual(claimed, ['m1']);
    const target = new THREE.Vector3(0, 1, 17).project(renderer.camera), point = { clientX: (target.x + 1) * 400, clientY: (1 - target.y) * 300 };
    const pointer = { ...point, pointerId: 4, button: 0, target: renderer.domElement };
    renderer.domElement.listeners.get('pointerdown')(pointer); renderer.domElement.listeners.get('pointerup')(pointer);
    assert.equal(claimed.length, 2, 'clicking a nearby monster challenges it');
    renderer.domElement.listeners.get('pointerdown')(pointer);
    renderer.domElement.listeners.get('pointermove')({ ...pointer, clientX: pointer.clientX + 20 });
    renderer.domElement.listeners.get('pointerup')({ ...pointer, clientX: pointer.clientX + 20 });
    assert.equal(claimed.length, 2, 'orbiting the camera never submits a monster challenge');
    state = { ...state, crystal: view([monster({ failedIds: ['teacher'], stage: 1 })]) }; runtime.setState(state); runtime.interactMonster('m1');
    assert.equal(claimed.length, 2); assert.match(hints.at(-1), /already tried/);
    state = { ...state, crystal: view([monster({ failedIds: ['teacher'], stage: 1 }), monster({ id: 'm2', lane: .1 })]) };
    runtime.setState(state);
    listeners.get('keydown')({ code: 'KeyE', target: host, repeat: false, preventDefault() {} });
    assert.equal(claimed.at(-1), 'm2', 'E chooses an eligible nearby monster over one already failed');
    const pending = { ...state, crystal: view([monster(), monster({ id: 'm2', lane: .1 })], { participants: [{ id: 'teacher', pendingMonsterId: 'm1' }] }) };
    runtime.setState(pending); runtime.interactMonster('m2');
    assert.equal(claimed.length, 3); assert.match(hints.at(-1), /Finish your current monster/);
    listeners.get('keydown')({ code: 'KeyE', target: host, repeat: false, preventDefault() {} });
    assert.equal(claimed.at(-1), 'm1', 'E returns to the assigned question rather than selecting another');
    runtime.setState({ ...pending, crystal: { ...pending.crystal, monsters: [monster({ status: 'challenged', claimedBy: 'maya' }), monster({ id: 'm2', lane: .1 })] } });
    listeners.get('keydown')({ code: 'KeyE', target: host, repeat: false, preventDefault() {} });
    assert.equal(claimed.length, 4); assert.match(hints.at(-1), /teammate is solving/);
    const sentBeforeSpectating = moves.length, claimsBeforeSpectating = claimed.length;
    const spectator = { ...state, spectating: true, players: [{ id: 'maya', name: 'Maya', character: 'frog', pose: { x: 10, y: 0, z: 0, rotation: 0, moving: false } }] };
    runtime.setState(spectator); host.focus();
    for (let i = 0; i < 30; i++) frame();
    const cameraBeforePan = renderer.camera.position.clone();
    listeners.get('keydown')({ code: 'KeyW', target: host, repeat: false, preventDefault() {} });
    for (let i = 0; i < 30; i++) frame();
    listeners.get('keyup')({ code: 'KeyW' });
    assert.ok(renderer.camera.position.distanceTo(cameraBeforePan) > 1, 'spectators pan a free camera');
    runtime.interactMonster('m2'); runtime.jump(); runtime.stop(); frame();
    assert.equal(claimed.length, claimsBeforeSpectating, 'spectators cannot challenge a monster');
    assert.equal(moves.length, sentBeforeSpectating, 'spectator camera movements never publish avatar poses');
    assert.equal(renderer.scene.children.find(child => child.isSprite && child.userData.text?.includes('you')).visible, false, 'spectator avatar name tag is hidden');
    runtime.setState({ ...spectator, followId: 'maya' });
    for (let i = 0; i < 70; i++) frame();
    const cameraFollowing = renderer.camera.position.clone();
    runtime.setState({ ...spectator, followId: 'maya', players: [{ ...spectator.players[0], pose: { ...spectator.players[0].pose, x: 15 } }] });
    for (let i = 0; i < 70; i++) frame();
    assert.ok(Math.abs(renderer.camera.position.x - cameraFollowing.x - 5) < .02, 'camera follows the selected student as they move');
    runtime.setState(state);
    runtime.stop();
    const savedArenaPosition = moves.at(-1);
    runtime.setState({ ...state, selfId: 'test:teacher', arena: 'lobby' });
    runtime.setState(state);
    assert.deepEqual(moves.at(-1), savedArenaPosition, 'switching between teacher/buddy in different worlds preserves the known position');
    runtime.setState({ ...state, arena: 'lobby' }); frame(); assert.equal(moves.at(-1).z, 6);
    runtime.setState({ ...state, arena: 'lobby', disabled: true }); runtime.setState({ ...state, arena: 'lobby', initialPose: { ...nearPose, z: 12 } }); frame();
    assert.equal(entries, 2, 'returning to the portal can join again');
    const labels = () => renderer.scene.children.filter(child => child.isSprite);
    const players = [
      { id: 'maya', name: 'Maya', character: 'frog', pose: nearPose },
      { id: 'test:teacher', name: 'Test buddy', character: 'frog', pose: nearPose },
    ];
    let tags = { ...state, arena: 'lobby', players, gameHostId: 'teacher' };
    runtime.setState(tags); frame();
    assert.equal(labels().length, 3);
    assert.deepEqual(labels().filter(label => label.userData.crowned).map(label => label.userData.text), ['Teacher · you']);
    assert.equal(labels().find(label => label.userData.text === 'Test buddy').userData.crowned, false, 'teacher ownership never crowns the test buddy');
    let disposedMaterials = 0, disposedTextures = 0;
    for (const label of labels().filter(label => label.userData.text !== 'Test buddy')) {
      label.material.addEventListener('dispose', () => disposedMaterials++);
      label.material.map.addEventListener('dispose', () => disposedTextures++);
    }
    tags = { ...tags, gameHostId: 'maya' }; runtime.setState(tags); frame();
    assert.equal(labels().length, 3, 'host transfer replaces existing tags without duplicates');
    assert.deepEqual(labels().filter(label => label.userData.crowned).map(label => label.userData.text), ['Maya']);
    assert.equal(disposedMaterials, 2); assert.equal(disposedTextures, 2, 'old crown and plain tag textures are released');
    tags = { ...tags, players: [{ ...players[0], name: 'Maya Chen' }, players[1]] }; runtime.setState(tags); frame();
    assert.deepEqual(labels().filter(label => label.userData.crowned).map(label => label.userData.text), ['Maya Chen'], 'remote name changes update the tag while retaining the crown');
    tags = { ...tags, gameHostId: null }; runtime.setState(tags); frame();
    assert.equal(labels().length, 3); assert.equal(labels().filter(label => label.userData.crowned).length, 0, 'no host leaves no stray crowns');
    const walkDistance = (stacks, area = 'crystal', phase = 'battle', sprint = false) => {
      const start = { x: 10, y: 0, z: 8, rotation: 0, moving: false };
      const next = { ...state, players: [], arena: area, crystal: view([], { phase, participants: [{ id: 'teacher', online: true, speedStacks: stacks }] }) };
      runtime.setState({ ...next, disabled: true }); runtime.setState({ ...next, initialPose: start, disabled: false });
      if (sprint) listeners.get('keydown')({ code: 'ShiftLeft', target: host, repeat: false, preventDefault() {} });
      runtime.moveTouch(1, 0); frame(); runtime.stop();
      const pose = moves.at(-1); return Math.hypot(pose.x - start.x, pose.z - start.z);
    };
    assert.ok(Math.abs(walkDistance(0) - 4.8 * .04) < 1e-9);
    assert.ok(Math.abs(walkDistance(1) - 4.8 * 1.1 * .04) < 1e-9, 'one potion increases actual walking speed by ten percent');
    assert.ok(Math.abs(walkDistance(99) - 4.8 * 1.3 * .04) < 1e-9, 'movement caps the boost at thirty percent');
    assert.ok(Math.abs(walkDistance(3, 'crystal', 'battle', true) - 7.2 * 1.3 * .04) < 1e-9, 'the capped boost also applies while sprinting');
    assert.ok(Math.abs(walkDistance(3, 'crystal', 'intermission') - 4.8 * 1.3 * .04) < 1e-9);
    assert.ok(Math.abs(walkDistance(3, 'lobby') - 4.8 * .04) < 1e-9, 'expedition buffs never change lobby walking');
    assert.ok(Math.abs(walkDistance(3, 'crystal', 'defeat') - 4.8 * .04) < 1e-9, 'finished expeditions do not retain boosted movement');
  } finally {
    runtime?.dispose(); Module._load = originalLoad;
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  }
});

test('auto-pickup enforces proximity and ownership, suppresses repeated requests, and backs off failures', async () => {
  const { createCrystalPickupCollector } = require('../client/src/features/games/world/worldRenderer.ts');
  let clock = 0, resolvePickup;
  const requests = [], collector = createCrystalPickupCollector((id, position) => { requests.push({ id, position }); return new Promise(resolve => { resolvePickup = resolve; }); }, () => clock);
  const ownItem = { id: 'own', ownerId: 'teacher', kind: 'speed', x: 9, z: 6 };
  const otherItem = { id: 'theirs', ownerId: 'maya', kind: 'retry', x: 1, z: 1 };
  const base = { selfId: 'teacher', arena: 'crystal', disabled: false, crystal: view([], { items: [ownItem, otherItem] }) };
  const near = { x: 9.5, z: 6 };
  const settle = async success => { resolvePickup(success); await Promise.resolve(); await Promise.resolve(); };
  try {
    collector.step(base, { x: 1, z: 1 }); assert.equal(requests.length, 0, 'standing on a teammate item does not submit a request');
    collector.step(base, { x: 10.51, z: 6 }); assert.equal(requests.length, 0, 'the server pickup radius is respected');
    collector.step({ ...base, disabled: true }, near);
    collector.step({ ...base, spectating: true }, near);
    collector.step({ ...base, crystal: { ...base.crystal, participants: [{ id: 'teacher', spectating: true }] } }, near);
    collector.step({ ...base, arena: 'lobby' }, near);
    collector.step({ ...base, crystal: { ...base.crystal, phase: 'defeat' } }, near);
    collector.step({ ...base, crystal: { ...base.crystal, monsters: [monster({ status: 'challenged', claimedBy: 'teacher' })] } }, near);
    assert.equal(requests.length, 0, 'disabled, lobby, finished, and solving players cannot auto-collect');
    collector.step(base, near); collector.step(base, near);
    assert.deepEqual(requests, [{ id: 'own', position: near }]);
    await settle(false);
    clock = 1999; collector.step(base, near); assert.equal(requests.length, 1, 'a failed request waits two seconds before retrying');
    clock = 2000; collector.step(base, near); assert.equal(requests.length, 2);
    await settle(true);
    clock = 10000; for (let i = 0; i < 30; i++) collector.step({ ...base, crystal: { ...base.crystal } }, near);
    assert.equal(requests.length, 2, 'successful requests stay suppressed while room snapshots catch up');
    const nextWave = { ...base, crystal: { ...base.crystal, wave: 2 } };
    collector.step(nextWave, near); assert.equal(requests.length, 3, 'a new wave clears the collection attempt ledger');
    const switched = { ...nextWave, selfId: 'maya', crystal: { ...nextWave.crystal, participants: [{ id: 'maya', online: true }] } };
    collector.step(switched, { x: 1, z: 1 }); assert.equal(requests.length, 3, 'switching characters does not overlap an in-flight request');
    await settle(true);
    collector.step(switched, { x: 1, z: 1 }); assert.equal(requests.at(-1).id, 'theirs'); await settle(true);
    collector.step({ ...switched, crystal: { ...switched.crystal, runId: 'restarted' } }, { x: 1, z: 1 });
    assert.equal(requests.length, 5, 'restarting the same wave resets attempts'); await settle(false);
    const collected = { ...base, crystal: { ...base.crystal, runId: 'collected', items: [{ ...ownItem, pickedUpAt: 0 }] } };
    collector.step(collected, near); assert.equal(requests.length, 5, 'an acknowledged item is never picked again');
    collector.step({ ...base, crystal: { ...base.crystal, participants: [{ id: 'teacher', pickedItemWave: 1 }] } }, near);
    assert.equal(requests.length, 5, 'the personal one-item quota is respected even with a stale item list');
    collector.dispose(); collector.step(nextWave, near); assert.equal(requests.length, 5);
  } finally { collector.dispose(); }
});
