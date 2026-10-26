import * as THREE from "three";
import { crystalMonsterPosition, type CrystalItem, type CrystalMonsterView, type CrystalView } from "../../../../../server/src/shared/crystalDefense";
import { disposeObject } from "./avatars";
import { makeTextSprite, type Obstacle } from "./scenery";

export const CRYSTAL_PORTAL = { x: 0, z: 12, radius: 1.7 };
export const CRYSTAL_INTERACT_DISTANCE = 3.5;

function sculpt(root: THREE.Group) {
  const palette = new Map<string, THREE.MeshStandardMaterial>();
  const material = (color: string, glow = false) => {
    const key = `${color}:${glow}`;
    if (!palette.has(key)) palette.set(key, new THREE.MeshStandardMaterial({ color, roughness: .65, ...(glow ? { emissive: color, emissiveIntensity: .35 } : {}) }));
    return palette.get(key)!;
  };
  const mesh = (geometry: THREE.BufferGeometry, color: string, x: number, y: number, z: number, glow = false, parent: THREE.Object3D = root) => {
    const object = new THREE.Mesh(geometry, material(color, glow)); object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
  };
  const ball = (color: string, x: number, y: number, z: number, radius: number, parent?: THREE.Object3D) => mesh(new THREE.SphereGeometry(radius, 14, 10), color, x, y, z, false, parent);
  const ring = (color: string, radius: number, tube: number, y: number, glow = false) => { const object = mesh(new THREE.TorusGeometry(radius, tube, 8, 64), color, 0, y, 0, glow); object.rotation.x = Math.PI / 2; return object; };
  return { mesh, ball, ring, material };
}

/** The lobby entrance stays part of the same island and shares its renderer. */
export function createCrystalPortal(parent: THREE.Object3D) {
  const root = new THREE.Group(); root.name = "crystal-defense-portal"; root.position.set(CRYSTAL_PORTAL.x, 0, CRYSTAL_PORTAL.z); parent.add(root);
  const { mesh, ring } = sculpt(root);
  mesh(new THREE.CylinderGeometry(2.9, 3.1, .14, 32), "#a2b4b3", 0, .015, 0);
  mesh(new THREE.CylinderGeometry(2.65, 2.65, .09, 32), "#d1e8da", 0, .1, 0);
  const glow = ring("#71e5de", 2.35, .07, .18, true);
  for (const side of [-1, 1]) {
    mesh(new THREE.BoxGeometry(.65, 2.8, .85), "#b7cbc8", side * 2.3, 1.45, 0);
    mesh(new THREE.BoxGeometry(.82, .24, 1), "#ecf3dd", side * 2.3, 2.9, 0);
    const gem = mesh(new THREE.OctahedronGeometry(.55), "#78e4df", side * 2.3, 3.55, 0, true); gem.scale.y = 1.7;
    mesh(new THREE.BoxGeometry(.12, 1.9, .07), "#72dedc", side * 2.3, 1.6, .46, true);
  }
  const arch = mesh(new THREE.TorusGeometry(2.3, .24, 10, 40, Math.PI), "#7b9da6", 0, 2.85, 0);
  const inner = mesh(new THREE.TorusGeometry(2.3, .075, 8, 40, Math.PI), "#9ff2dc", 0, 2.85, .23, true);
  const veil = new THREE.Mesh(new THREE.CircleGeometry(2.1, 48), new THREE.MeshBasicMaterial({ color: "#78e8e2", transparent: true, opacity: .13, side: THREE.DoubleSide, depthWrite: false }));
  veil.position.set(0, 2.55, 0); root.add(veil);
  const title = makeTextSprite("CRYSTAL DEFENSE", "#264b60", "#edfff2", 4.8); title.position.set(0, 5.5, 0); root.add(title);
  const invitation = makeTextSprite("Walk through to join", "#4d7373", "#f5ffe8", 3.6); invitation.position.set(0, .62, 1.35); root.add(invitation);
  return {
    root,
    obstacles: [-1, 1].map(side => ({ x: CRYSTAL_PORTAL.x + side * 2.3, z: CRYSTAL_PORTAL.z, radius: .48, height: 4 })),
    animate(time: number, reducedMotion: boolean) { glow.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(time * 1.8) * .025); veil.material.opacity = reducedMotion ? .13 : .13 + Math.sin(time * 1.3) * .035; arch.rotation.z = 0; inner.rotation.z = 0; },
  };
}

type MonsterRig = { root: THREE.Group; body: THREE.Group; shield: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>; feet: THREE.Mesh[]; label: THREE.Sprite; labelText: string; data: CrystalMonsterView; target: THREE.Vector3; resolvedAt?: number; sparks: THREE.Group };
type ItemRig = { root: THREE.Group; body: THREE.Group; label: THREE.Sprite; data: CrystalItem; own: boolean };

function makeItem(data: CrystalItem): ItemRig {
  const root = new THREE.Group(); root.name = `crystal-item-${data.id}`; root.userData.itemId = data.id;
  const body = new THREE.Group(); body.position.y = .85; root.add(body);
  const { mesh, ring } = sculpt(root);
  const speed = data.kind === "speed", accent = speed ? "#60f0c3" : "#ffd978";
  ring(accent, .55, .035, .11, true);
  if (speed) {
    const flask = mesh(new THREE.SphereGeometry(.29, 12, 8), "#5cdcc8", 0, 0, 0, true, body); flask.scale.y = .9;
    mesh(new THREE.CylinderGeometry(.105, .13, .21, 10), "#c3fff0", 0, .28, 0, false, body);
    mesh(new THREE.CylinderGeometry(.14, .14, .11, 10), "#e3b46c", 0, .43, 0, false, body);
    const bolt = new THREE.Shape(); bolt.moveTo(.025, .19); bolt.lineTo(-.11, -.01); bolt.lineTo(-.015, -.01); bolt.lineTo(-.045, -.18); bolt.lineTo(.13, .055); bolt.lineTo(.025, .055); bolt.closePath();
    const icon = mesh(new THREE.ShapeGeometry(bolt), "#fff6b4", 0, .01, .285, true, body); icon.material.side = THREE.DoubleSide;
  } else {
    const coin = mesh(new THREE.CylinderGeometry(.29, .29, .09, 16), "#f7cc66", 0, 0, 0, true, body); coin.rotation.x = Math.PI / 2;
    mesh(new THREE.TorusGeometry(.28, .045, 6, 20), "#fff0ac", 0, 0, .055, true, body);
    mesh(new THREE.TorusGeometry(.135, .032, 6, 18, Math.PI * 1.6), "#6678b9", 0, 0, .065, false, body);
    const arrow = mesh(new THREE.ConeGeometry(.07, .14, 3), "#6678b9", .06, -.13, .08, false, body); arrow.rotation.z = Math.PI / 2;
  }
  const label = makeTextSprite(speed ? "YOURS · SPEED POTION" : "YOURS · RETRY TOKEN", speed ? "#1d7169" : "#886522", speed ? "#e2fff2" : "#fff4ca", 2.9);
  label.position.y = 1.75; root.add(label);
  root.position.set(data.x, 0, data.z);
  root.traverse(object => { if (object instanceof THREE.Mesh) { object.castShadow = false; object.receiveShadow = false; } });
  return { root, body, label, data, own: false };
}

function setItemOwner(rig: ItemRig, selfId: string | undefined) {
  const own = rig.data.ownerId === selfId;
  if (rig.root.userData.own === own) return;
  rig.own = own; rig.label.visible = rig.own;
  rig.root.userData.own = rig.own;
  rig.root.traverse(object => {
    if (!(object instanceof THREE.Mesh)) return;
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      if (material instanceof THREE.MeshStandardMaterial) {
        material.transparent = true; material.opacity = rig.own ? 1 : .28;
        material.depthWrite = rig.own; material.emissiveIntensity = rig.own ? .5 : .04;
      }
    }
  });
}

function makeMonster(data: CrystalMonsterView, now: number, wave: number): MonsterRig {
  const root = new THREE.Group(); root.name = `crystal-monster-${data.id}`; root.userData.monsterId = data.id;
  const body = new THREE.Group(); root.add(body);
  const { mesh, ball } = sculpt(body);
  const variant = [...data.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 3;
  const color = ["#b49ad9", "#eea16e", "#8bbaa1"][variant];
  const torso = ball(color, 0, .9, 0, .57); torso.scale.set(1, 1.18, .86);
  const face = ball("#f7e9cb", 0, 1.02, .42, .4); face.scale.set(1, .65, .4);
  for (const side of [-1, 1]) {
    ball("#29394c", side * .15, 1.08, .57, .065);
    ball("#ffffff", side * .15 - .015, 1.1, .623, .018);
    const ear = mesh(variant === 1 ? new THREE.ConeGeometry(.15, .5, 8) : new THREE.OctahedronGeometry(.19), "#f9d788", side * .4, 1.55, -.03); ear.rotation.z = side * -.35;
    const arm = ball(color, side * .58, .75, .05, .19); arm.scale.y = 1.5;
    ball("#e7d5b6", side * .61, .5, .12, .12);
  }
  const feet = [-1, 1].map(side => { const foot = ball("#665e81", side * .25, .15, .13, .2); foot.scale.set(.9, .7, 1.4); return foot; });
  const crest = mesh(new THREE.OctahedronGeometry(.17), "#ffe29a", 0, 1.72, 0, true); crest.scale.y = 1.3;
  const label = makeTextSprite("?", "#664578", "#fff5da", 1.15); label.position.y = 2.25; root.add(label);
  const shield = new THREE.Mesh(new THREE.SphereGeometry(.91, 18, 12), new THREE.MeshBasicMaterial({ color: "#7adcf2", transparent: true, opacity: .19, depthWrite: false, wireframe: true }));
  shield.position.y = 1; root.add(shield); shield.visible = false;
  const sparks = new THREE.Group(); sparks.visible = false; root.add(sparks);
  const sparkMat = new THREE.MeshBasicMaterial({ color: "#fff1a6", transparent: true });
  for (let i = 0; i < 8; i++) { const spark = new THREE.Mesh(new THREE.OctahedronGeometry(.09), sparkMat); sparks.add(spark); }
  root.traverse(item => { item.userData.monsterId = data.id; });
  const point = crystalMonsterPosition(data, now, wave);
  root.position.set(point.x, 0, point.z); root.rotation.y = Math.atan2(-point.x, -point.z);
  return { root, body, shield, feet, label, labelText: "?", data, target: new THREE.Vector3(point.x, 0, point.z), sparks };
}

/** A compact arena with continuous approaches and protected question time. */
export function createCrystalArena(scene: THREE.Scene, monotonicNow: () => number = () => performance.now()) {
  const root = new THREE.Group(); root.name = "crystal-defense-arena"; root.visible = false; scene.add(root);
  const { mesh, ring } = sculpt(root);
  const obstacles: Obstacle[] = [{ x: 0, z: 0, radius: 1.5, height: 5 }];
  mesh(new THREE.CylinderGeometry(24, 21.5, 1.4, 80), "#566975", 0, -.75, 0);
  mesh(new THREE.CylinderGeometry(21.5, 13, 4, 48), "#425865", 0, -3.3, 0);
  mesh(new THREE.CylinderGeometry(13, 4, 3.3, 32), "#364957", 0, -6.9, 0);
  mesh(new THREE.CylinderGeometry(23.7, 23.7, .12, 80), "#768c8d", 0, -.02, 0);
  for (const radius of [6, 11, 17, 22]) ring(radius === 22 ? "#d3ab77" : "#9dc6b4", radius, radius === 22 ? .055 : .035, .06, true);
  for (let i = 0; i < 12; i++) {
    const angle = i / 12 * Math.PI * 2;
    const path = mesh(new THREE.BoxGeometry(.42, .035, 19), "#9bbcaf", Math.sin(angle) * 11.5, .04, Math.cos(angle) * 11.5, true); path.rotation.y = angle;
    const plinth = mesh(new THREE.CylinderGeometry(.55, .8, 1.25, 6), "#627a83", Math.sin(angle) * 23.2, .6, Math.cos(angle) * 23.2);
    const lantern = mesh(new THREE.OctahedronGeometry(.33), "#b4f1d7", plinth.position.x, 1.52, plinth.position.z, true); lantern.scale.y = 1.4;
  }
  mesh(new THREE.CylinderGeometry(2.25, 2.75, .3, 8), "#a1bbb7", 0, .12, 0);
  mesh(new THREE.CylinderGeometry(1.65, 2, .42, 8), "#d0ded0", 0, .45, 0);
  const aura = ring("#8bf1e9", 2.45, .075, .32, true);
  const teamShield = new THREE.Mesh(new THREE.SphereGeometry(3.25, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#8fefff", transparent: true, opacity: .12, wireframe: true, depthWrite: false }));
  teamShield.name = "crystal-team-shield"; teamShield.visible = false; teamShield.position.y = .35; root.add(teamShield);
  const impact = new THREE.Mesh(new THREE.TorusGeometry(1, .1, 8, 48), new THREE.MeshBasicMaterial({ color: "#ffb48f", transparent: true, opacity: 0, depthWrite: false }));
  impact.name = "crystal-impact-pulse"; impact.rotation.x = Math.PI / 2; impact.position.y = .4; impact.visible = false; root.add(impact);
  const crystal = mesh(new THREE.OctahedronGeometry(1.1), "#8aeee9", 0, 2.7, 0, true); crystal.name = "crystal-core"; crystal.scale.set(.8, 1.8, .8); crystal.rotation.y = .4;
  const outline = new THREE.Mesh(crystal.geometry.clone(), new THREE.MeshBasicMaterial({ color: "#eafff0", transparent: true, opacity: .65, wireframe: true })); crystal.add(outline);
  const shards: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; const shard = mesh(new THREE.OctahedronGeometry(.4), "#aff1c7", Math.sin(a) * 1.3, 1.1, Math.cos(a) * 1.3, true); shard.scale.y = 1.6; shard.rotation.z = Math.sin(a) * -.35; shards.push(shard); }
  const hearts = Array.from({ length: 5 }, (_, i) => {
    const heart = mesh(new THREE.OctahedronGeometry(.2), "#f6ab99", (i - 2) * .5, 5.1, 0, true); heart.scale.y = 1.1; return heart;
  });
  const title = makeTextSprite("DEFEND THE CRYSTAL", "#31566a", "#eaffdf", 4.4); title.position.set(0, 5.8, 0); root.add(title);
  const approachLabel = makeTextSprite("Challenge monsters before they reach the crystal", "#31566a", "#eaffdf", 6.2); approachLabel.position.set(0, 2.8, -21); root.add(approachLabel);
  const monsters = new Map<string, MonsterRig>();
  const items = new Map<string, ItemRig>();
  let view: CrystalView | undefined, elapsed = 0, impactAt = -Infinity;
  let clockAnchor: { server: number; local: number } | undefined;
  function serverTime() {
    if (!clockAnchor) return 0;
    return clockAnchor.server + Math.max(0, monotonicNow() - clockAnchor.local);
  }
  function remove(rig: MonsterRig) { root.remove(rig.root); disposeObject(rig.root); monsters.delete(rig.data.id); }
  function removeItem(rig: ItemRig) { root.remove(rig.root); disposeObject(rig.root); items.delete(rig.data.id); }
  return {
    root, obstacles,
    update(next: CrystalView | undefined, selfId?: string) {
      // Presence updates rerender the world much more often than room snapshots.
      // Keep one clock anchor for each new server time, independent of the device clock.
      if (next && (!clockAnchor || next.runId !== view?.runId || next.serverNow !== clockAnchor.server)) clockAnchor = { server: next.serverNow, local: monotonicNow() };
      if (next?.runId !== view?.runId || next?.wave !== view?.wave) for (const rig of items.values()) removeItem(rig);
      view = next;
      hearts.forEach((heart, i) => { heart.visible = i < (view?.hearts ?? 5); });
      const intact = (view?.hearts ?? 5) > 0;
      crystal.visible = intact; aura.visible = intact;
      teamShield.visible = intact && view?.phase === "battle" && Boolean(view.teamShieldActive);
      const visibleItems = (next?.items ?? []).filter(item => item.pickedUpAt === undefined);
      const itemIds = new Set(visibleItems.map(item => item.id));
      for (const rig of items.values()) if (!itemIds.has(rig.data.id)) removeItem(rig);
      for (const data of visibleItems) {
        let rig = items.get(data.id);
        if (!rig) { rig = makeItem(data); items.set(data.id, rig); root.add(rig.root); }
        rig.data = data; rig.root.position.set(data.x, 0, data.z); setItemOwner(rig, selfId);
      }
      const visible = next?.monsters ?? [];
      const ids = new Set(visible.map(monster => monster.id));
      for (const rig of monsters.values()) if (!ids.has(rig.data.id)) remove(rig);
      for (const data of visible) {
        let rig = monsters.get(data.id);
        if (!rig && (data.status === "defeated" || data.status === "breached")) continue;
        if (!rig) { rig = makeMonster(data, serverTime(), view?.wave ?? 1); monsters.set(data.id, rig); root.add(rig.root); }
        if (rig.data.status !== data.status && data.status === "defeated") rig.resolvedAt = elapsed;
        rig.data = data;
        const point = crystalMonsterPosition(data, serverTime(), view?.wave ?? 1); rig.target.set(point.x, 0, point.z);
        if (data.status === "challenged") rig.root.position.copy(rig.target);
        rig.shield.visible = data.status === "challenged";
        const label = data.status === "challenged" ? "SOLVING · SHIELDED" : data.stage > 0 ? "!" : "?  CHALLENGE";
        if (rig.labelText !== label) {
          rig.root.remove(rig.label); disposeObject(rig.label);
          rig.label = makeTextSprite(label, data.stage > 0 ? "#8c4b40" : "#4d5270", data.status === "challenged" ? "#dcfbff" : "#fff1d5", data.status === "challenged" ? 3.4 : 2.6);
          rig.label.position.y = 2.25; rig.label.userData.monsterId = data.id; rig.root.add(rig.label); rig.labelText = label;
        }
        rig.root.scale.setScalar(1);
      }
    },
    monster(id: string) { return monsters.get(id); },
    item(id: string) { return items.get(id); },
    targets() { return [...monsters.values()].filter(rig => rig.data.status === "active" || rig.data.status === "challenged").map(rig => rig.root); },
    animate(time: number, dt: number, reducedMotion: boolean) {
      elapsed = time;
      if (!root.visible) return;
      crystal.rotation.y = reducedMotion ? .4 : time * .22; crystal.position.y = 2.7 + (reducedMotion ? 0 : Math.sin(time * 1.7) * .12);
      aura.scale.setScalar(reducedMotion ? 1 : 1 + Math.sin(time * 1.5) * .035);
      const impactAge = time - impactAt;
      impact.visible = impactAge < .85;
      if (impact.visible) { impact.scale.setScalar(reducedMotion ? 2.5 : 1.4 + impactAge * 4); impact.material.opacity = Math.max(0, .8 - impactAge); }
      shards.forEach((shard, i) => {
        const intact = (view?.hearts ?? 5) > 0;
        shard.position.y = intact ? 1.1 + (reducedMotion ? 0 : Math.sin(time * 1.6 + i) * .06) : .55;
        shard.rotation.z = intact ? Math.sin(i / 4 * Math.PI * 2) * -.35 : Math.PI / 2 + i * .2;
      });
      for (const rig of items.values()) {
        rig.body.rotation.y = reducedMotion ? 0 : time * (rig.own ? 1.25 : .4);
        rig.body.position.y = .85 + (reducedMotion ? 0 : Math.sin(time * 2.3 + rig.data.x) * .09);
      }
      for (const rig of monsters.values()) {
        const now = view?.movementPaused || view?.phase !== "battle" ? view?.serverNow ?? serverTime() : serverTime();
        const point = crystalMonsterPosition(rig.data, now, view?.wave ?? 1); rig.target.set(point.x, 0, point.z);
        const previousX = rig.root.position.x, previousZ = rig.root.position.z;
        if (rig.data.status === "challenged") rig.root.position.copy(rig.target);
        else rig.root.position.lerp(rig.target, reducedMotion ? 1 : 1 - Math.exp(-9 * dt));
        const walking = rig.data.status === "active" && rig.data.moving !== false && !view?.movementPaused && Math.hypot(rig.root.position.x - previousX, rig.root.position.z - previousZ) > .000001;
        rig.root.rotation.y = Math.atan2(-rig.root.position.x, -rig.root.position.z);
        const stride = time * (4 + Math.min(4, (view?.wave ?? 1) * .15));
        rig.body.position.y = reducedMotion || !walking ? 0 : Math.abs(Math.sin(stride + rig.data.lane)) * .05;
        rig.feet.forEach((foot, i) => { foot.rotation.x = reducedMotion || !walking ? 0 : Math.sin(stride + i * Math.PI) * .3; });
        if (rig.data.status === "breached" && rig.resolvedAt === undefined && rig.root.position.distanceTo(rig.target) < .06) {
          rig.root.position.copy(rig.target); rig.resolvedAt = elapsed; impactAt = elapsed;
        }
        if (rig.resolvedAt !== undefined) {
          const age = time - rig.resolvedAt;
          rig.body.scale.setScalar(Math.max(0, 1 - age * 2)); rig.label.visible = false; rig.shield.visible = false;
          rig.sparks.visible = rig.data.status === "defeated" && !reducedMotion;
          rig.sparks.children.forEach((spark, i) => { const a = i / 8 * Math.PI * 2; spark.position.set(Math.sin(a) * age * 2, 1 + Math.sin(age * Math.PI) * .9, Math.cos(a) * age * 2); spark.scale.setScalar(Math.max(0, 1 - age)); });
          if (age > 1) remove(rig);
        }
      }
    },
  };
}
