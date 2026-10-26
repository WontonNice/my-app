const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
require(require.resolve('ts-node', { paths: [path.resolve(__dirname, '../server')] })).register({ transpileOnly: true, project: path.resolve(__dirname, '../server/tsconfig.json'), compilerOptions: { module: 'CommonJS', moduleResolution: 'Node' }, moduleTypes: { '**': 'cjs' } });
const THREE = require('three');
const { createAvatar } = require('../client/src/features/games/world/avatars.ts');

for (const character of ['astronaut', 'frog', 'mushroom', 'alien', 'wizard', 'duck', 'tung-tung', 'le-sunshine', 'mike', 'pepe']) {
  test(`${character} emote hands remain outside the body, head, and costume`, () => {
    const avatar = createAvatar(character), body = avatar.root.children[0];
    try {
      for (const emote of ['wave', 'hello', 'cheer', 'dance']) {
        for (let frame = 0; frame <= 120; frame++) {
          avatar.animate(frame / 30, false, emote);
          avatar.root.updateMatrixWorld(true);
          for (const side of emote === 'wave' || emote === 'hello' ? ['right'] : ['left', 'right']) {
            const hand = avatar.root.getObjectByName(`${side}-hand`);
            const transform = new THREE.Matrix4().multiplyMatrices(hand.parent.matrix, hand.matrix);
            const bounds = new THREE.Box3(), vertex = new THREE.Vector3(), vertices = hand.geometry.attributes.position;
            for (let index = 0; index < vertices.count; index++) bounds.expandByPoint(vertex.fromBufferAttribute(vertices, index).applyMatrix4(transform));
            for (const piece of body.children.filter(item => item.isMesh)) {
              piece.geometry.computeBoundingBox();
              const costume = piece.geometry.boundingBox.clone().applyMatrix4(piece.matrix);
              assert.equal(bounds.intersectsBox(costume), false, `${character} ${emote} ${side} hand intersects ${piece.geometry.type} at ${frame / 30}s`);
            }
          }
        }
      }
    } finally { avatar.dispose(); }
  });
}

test('walking immediately takes precedence over a stale emote pose', () => {
  const avatar = createAvatar('frog');
  try {
    const transforms = () => {
      avatar.root.updateMatrixWorld(true);
      const matrices = []; avatar.root.traverse(item => matrices.push(item.matrixWorld.elements.slice())); return matrices;
    };
    avatar.animate(1, true); const walking = transforms();
    for (const emote of ['wave', 'hello', 'cheer', 'dance']) {
      avatar.animate(1, true, emote); assert.deepEqual(transforms(), walking);
    }
  } finally { avatar.dispose(); }
});

test('world input cancels an emote once and actor switches use the new character position', () => {
  const originalLoad = Module._load;
  const saved = new Map(['window', 'document', 'HTMLElement', 'ResizeObserver', 'requestAnimationFrame', 'cancelAnimationFrame'].map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const listeners = new Map(); let frameCallback, frameId = 0, timestamp = 0;
  class Element {
    constructor(tagName = 'DIV') { this.tagName = tagName; this.clientWidth = 800; this.clientHeight = 600; this.classList = { add() {}, remove() {} }; }
    append() {} setAttribute() {} addEventListener() {} removeEventListener() {} setPointerCapture() {} remove() {}
    contains(element) { return this === element; }
    focus() { document.activeElement = this; }
  }
  class Renderer {
    constructor() { this.domElement = new Element('CANVAS'); this.shadowMap = {}; }
    setPixelRatio() {} setSize() {} render() {} dispose() {} forceContextLoss() {}
  }
  globalThis.HTMLElement = Element;
  globalThis.document = { activeElement: null, addEventListener() {}, removeEventListener() {} };
  globalThis.window = { devicePixelRatio: 1, matchMedia: () => ({ matches: false }), addEventListener: (event, handler) => listeners.set(event, handler), removeEventListener: event => listeners.delete(event) };
  globalThis.ResizeObserver = class { observe() {} disconnect() {} };
  globalThis.requestAnimationFrame = callback => { frameCallback = callback; return ++frameId; };
  globalThis.cancelAnimationFrame = () => {};
  Module._load = function (request, parent, ...rest) {
    if (parent?.filename.endsWith('worldRenderer.ts')) {
      if (request === 'three') return { ...THREE, WebGLRenderer: Renderer };
      if (request === './scenery') return { createScenery: () => ({ root: new THREE.Group(), obstacles: [{ x: 3, z: 2, radius: 1, height: .7 }], animate() {} }), makeTextSprite: () => new THREE.Sprite(new THREE.SpriteMaterial()) };
      if (request === './crystalScene') return { createCrystalPortal: () => ({ obstacles: [], animate() {} }), createCrystalArena: () => ({ root: new THREE.Group(), obstacles: [], update() {}, animate() {}, monster() {}, targets: () => [] }), CRYSTAL_INTERACT_DISTANCE: 3.5, CRYSTAL_PORTAL: { x: 0, z: 12, radius: 1.7 } };
    }
    return originalLoad.call(this, request, parent, ...rest);
  };
  let runtime;
  try {
    const { createWorldScene } = require('../client/src/features/games/world/worldRenderer.ts');
    const moves = []; let cancellations = 0;
    const host = new Element();
    runtime = createWorldScene(host, pose => moves.push(pose), () => {}, assert.fail, () => { cancellations++; });
    let state = { selfId: 'teacher', name: 'Teacher', character: 'frog', players: [], disabled: false, emote: { id: 'wave', at: Date.now() } };
    runtime.setState(state);
    const key = (code, target = host) => listeners.get('keydown')({ code, target, repeat: false, preventDefault() {} });
    const frame = () => { timestamp += 40; frameCallback(timestamp); };
    key('KeyW'); frame(); frame(); assert.equal(cancellations, 1);
    runtime.setState({ ...state }); frame(); assert.equal(cancellations, 1, 'stale React state must not restart cancellation');
    listeners.get('keyup')({ code: 'KeyW' });
    state = { ...state, emote: { id: 'dance', at: state.emote.at + 1 } }; runtime.setState(state);
    key('Space'); frame(); assert.equal(cancellations, 2);
    state = { ...state, emote: { id: 'cheer', at: state.emote.at + 1 } }; runtime.setState(state);
    key('Escape'); key('Escape'); assert.equal(cancellations, 3);
    state = { ...state, emote: { id: 'wave', at: state.emote.at + 1 } }; runtime.setState(state);
    document.activeElement = new Element('INPUT'); key('KeyW', document.activeElement); frame(); assert.equal(cancellations, 3, 'typing outside the world is ignored');
    runtime.moveTouch(1, 0); frame(); assert.equal(cancellations, 4);
    assert.ok(moves.at(-1).y > 0, 'the teacher is mid-jump');
    runtime.stop();
    assert.equal(moves.at(-1).y, 0, 'stop settles the outgoing teacher on the ground');
    assert.equal(moves.at(-1).moving, false);
    const buddyPose = { x: 8, y: 0, z: -4, rotation: .7, moving: false };
    const beforeSwitch = moves.length;
    runtime.setState({ ...state, selfId: 'test:teacher', disabled: true, players: [{ id: 'test:teacher', name: 'Test buddy', character: 'frog', pose: buddyPose }], emote: undefined });
    assert.equal(moves.length, beforeSwitch, 'switching must not send the old position to the new socket');
    runtime.setState({ ...state, selfId: 'test:teacher', players: [{ id: 'test:teacher', name: 'Test buddy', character: 'frog', pose: buddyPose }], emote: undefined });
    for (let index = 0; index < 4; index++) frame();
    assert.deepEqual(moves.at(-1), buddyPose, 'the selected buddy retains its position with old input cleared');
    const readyPose = { x: 12, y: 0, z: 5, rotation: 1.2, moving: false };
    runtime.setState({ ...state, selfId: 'test:teacher', disabled: true, emote: undefined });
    runtime.setState({ ...state, selfId: 'test:teacher', initialPose: readyPose, emote: undefined });
    for (let index = 0; index < 4; index++) frame();
    assert.deepEqual(moves.at(-1), readyPose, 'ready restores the authoritative pose even when the actor id is unchanged');
    runtime.setState({ ...state, selfId: 'teacher', initialPose: { x: 3, y: 1.4, z: 2, rotation: 0, moving: false }, emote: undefined });
    runtime.stop();
    assert.deepEqual(moves.at(-1), { x: 3, y: .7, z: 2, rotation: 0, moving: false }, 'stop settles onto a raised platform instead of through it');
  } finally {
    runtime?.dispose(); Module._load = originalLoad;
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; }
  }
});
