import * as THREE from "three";
import type { WorldCharacterId, WorldEmote } from "../../../../../server/src/shared/gameWorld";
import { createMemeAvatar } from "./memeAvatars";

export type AvatarRig = { root: THREE.Group; animate: (time: number, moving: boolean, emote?: WorldEmote) => void; dispose: () => void };

export function disposeObject(root: THREE.Object3D) {
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  root.traverse(object => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Sprite) {
      if (object instanceof THREE.Mesh) geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => {
    if ("map" in material && material.map instanceof THREE.Texture) material.map.dispose();
    material.dispose();
  });
}

/** Original, lightweight toy characters made from smooth geometry. Forward is +Z. */
export function createAvatar(character: WorldCharacterId): AvatarRig {
  if (character === "tung-tung" || character === "le-sunshine" || character === "mike" || character === "pepe") return createMemeAvatar(character, disposeObject);
  const root = new THREE.Group(), body = new THREE.Group();
  root.add(body);
  const colors = {
    astronaut: { skin: "#93d8ef", outfit: "#f3f0e5", pants: "#d8e6e8" },
    frog: { skin: "#badc60", outfit: "#69b64b", pants: "#f5b56c" },
    mushroom: { skin: "#8ad8e6", outfit: "#f7dfb1", pants: "#79c6d7" },
    alien: { skin: "#9cdb75", outfit: "#7cc45c", pants: "#c8dce0" },
    wizard: { skin: "#f6c691", outfit: "#7e8cdd", pants: "#5965ae" },
    duck: { skin: "#ffdc65", outfit: "#58bada", pants: "#459abe" },
  }[character];
  const palette = new Map<string, THREE.MeshStandardMaterial>();
  const material = (color: string, metalness = 0) => {
    const key = `${color}:${metalness}`;
    if (!palette.has(key)) palette.set(key, new THREE.MeshStandardMaterial({ color, roughness: metalness ? .3 : .72, metalness }));
    return palette.get(key)!;
  };
  function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, color: string, x = 0, y = 0, z = 0) {
    const item = new THREE.Mesh(geometry, material(color)); item.position.set(x, y, z); item.castShadow = true; item.receiveShadow = true; parent.add(item); return item;
  }
  function sphere(parent: THREE.Object3D, color: string, x: number, y: number, z: number, sx: number, sy = sx, sz = sx) {
    const item = mesh(parent, new THREE.SphereGeometry(1, 20, 14), color, x, y, z); item.scale.set(sx, sy, sz); return item;
  }
  const torso = mesh(body, new THREE.CapsuleGeometry(.275, .38, 6, 16), colors.outfit, 0, .91, 0);
  torso.scale.z = .8;
  const head = sphere(body, colors.skin, 0, 1.48, .025, .365, .36, .335);
  const leftArm = new THREE.Group(), rightArm = new THREE.Group(), leftLeg = new THREE.Group(), rightLeg = new THREE.Group();
  leftArm.name = "left-arm"; rightArm.name = "right-arm";
  const shoulderWidth = character === "alien" ? .36 : .33;
  const restingArmAngle = character === "alien" ? .85 : .12;
  leftArm.position.set(-shoulderWidth, 1.12, 0); rightArm.position.set(shoulderWidth, 1.12, 0);
  leftLeg.position.set(-.155, .57, 0); rightLeg.position.set(.155, .57, 0);
  body.add(leftArm, rightArm, leftLeg, rightLeg);
  [leftArm, rightArm].forEach((arm, index) => {
    mesh(arm, new THREE.CapsuleGeometry(.105, .27, 4, 12), colors.outfit, 0, -.21, 0);
    sphere(arm, colors.skin, 0, -.42, .015, .115, .12, .1).name = index ? "right-hand" : "left-hand";
    arm.rotation.z = index ? restingArmAngle : -restingArmAngle;
  });
  [leftLeg, rightLeg].forEach(leg => {
    mesh(leg, new THREE.CapsuleGeometry(.105, .27, 4, 12), colors.pants, 0, -.22, 0);
    sphere(leg, character === "astronaut" ? "#a6bfc9" : colors.pants, 0, -.48, .065, .13, .09, .19);
  });
  if (character !== "astronaut") {
    const alien = character === "alien";
    [-1, 1].forEach(side => {
      const eye = sphere(body, "#223647", side * (alien ? .17 : .12), 1.5, .329, alien ? .095 : .046, alien ? .13 : .065, .035);
      eye.rotation.z = alien ? side * -.2 : 0;
      sphere(body, "#ffffff", side * (alien ? .17 : .12) - .013, 1.528, .36, .013);
    });
  }
  if (character === "astronaut") {
    head.material = material("#f6f3e9"); head.scale.set(.43, .43, .4);
    sphere(body, "#234457", 0, 1.49, .28, .345, .32, .14);
    const glint = sphere(body, "#85d5e7", -.17, 1.63, .399, .046, .11, .014); glint.rotation.z = -.35;
    mesh(body, new THREE.BoxGeometry(.34, .33, .13), "#b5cfda", 0, .98, .25);
    sphere(body, "#50c9e8", -.08, 1.02, .33, .048); sphere(body, "#f17666", .08, 1.02, .33, .048);
    mesh(body, new THREE.CapsuleGeometry(.2, .3, 5, 12), "#e7e2d6", 0, 1, -.28);
    mesh(body, new THREE.CylinderGeometry(.035, .035, .32, 8), "#a6c0c5", .2, 1.38, -.2);
    sphere(body, "#ffbe62", .2, 1.55, -.2, .055);
  } else if (character === "frog") {
    sphere(body, "#65b54c", 0, 1.54, -.03, .43, .41, .35);
    sphere(body, colors.skin, 0, 1.46, .19, .3, .29, .21);
    [-1, 1].forEach(side => { sphere(body, "#263b37", side * .11, 1.47, .395, .043, .059, .024); sphere(body, "#ffffff", side * .11 - .012, 1.49, .416, .012); });
    [-1, 1].forEach(side => { sphere(body, "#8ccc5b", side * .29, 1.88, .06, .145); sphere(body, "#e6f1ba", side * .29, 1.9, .17, .097); sphere(body, "#233b39", side * .29, 1.91, .248, .049); });
    sphere(body, "#94d76e", 0, .87, .22, .19, .23, .035);
    mesh(body, new THREE.CylinderGeometry(.012, .012, .44, 6), "#e8efbd", 0, 1.02, .275);
    [-1, 1].forEach(side => sphere(body, "#f6dc8e", side * .075, 1.19, .27, .02, .08, .02));
  } else if (character === "mushroom") {
    head.scale.set(.29, .31, .29); head.position.z = .08;
    const cap = mesh(body, new THREE.SphereGeometry(.66, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), "#ed6b66", 0, 1.7, 0); cap.scale.y = .68;
    mesh(body, new THREE.CylinderGeometry(.66, .58, .065, 28), "#f9e9cf", 0, 1.7, 0);
    for (const [x, z, size] of [[-.27, .36, .105], [.24, .27, .12], [.42, -.12, .085], [-.22, -.1, .11], [.05, .55, .085]]) {
      const y = .66 * .68 * Math.sqrt(1 - (x * x + z * z) / (.66 * .66));
      const spot = sphere(body, "#fff4df", x, 1.71 + y, z, size, .018, size);
      spot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(x, y / (.68 * .68), z).normalize());
    }
    const scarf = mesh(body, new THREE.TorusGeometry(.25, .065, 8, 20), "#74c6cf", 0, 1.22, 0); scarf.rotation.x = Math.PI / 2;
  } else if (character === "alien") {
    head.scale.set(.41, .43, .35);
    const rim = mesh(body, new THREE.TorusGeometry(.43, .11, 10, 28), "#c6e4df", 0, .72, 0); rim.rotation.x = Math.PI / 2;
    mesh(body, new THREE.CylinderGeometry(.42, .29, .18, 24), "#abc7cf", 0, .67, 0);
    for (let i = 0; i < 8; i++) sphere(body, i % 2 ? "#ffdd7a" : "#8bcdd9", Math.sin(i * Math.PI / 4) * .49, .74, Math.cos(i * Math.PI / 4) * .49, .036);
    [-1, 1].forEach(side => { mesh(body, new THREE.CylinderGeometry(.018, .018, .26, 8), "#74ba5c", side * .19, 1.92, 0); sphere(body, "#c9ea8f", side * .19, 2.07, 0, .065); });
  } else if (character === "wizard") {
    mesh(body, new THREE.ConeGeometry(.39, .52, 16), "#8497df", 0, .68, 0);
    mesh(body, new THREE.CylinderGeometry(.48, .48, .07, 24), "#7375c7", 0, 1.76, 0);
    const hat = mesh(body, new THREE.ConeGeometry(.32, .7, 24), "#777acc", -.04, 2.08, 0); hat.rotation.z = .16;
    mesh(body, new THREE.CylinderGeometry(.32, .33, .1, 24), "#f8ce6d", 0, 1.83, 0);
    sphere(body, "#ffe69a", -.14, 2.43, 0, .07);
    const wand = mesh(rightArm, new THREE.CylinderGeometry(.025, .025, .55, 8), "#b69a76", 0, -.29, .13); wand.rotation.x = -.35;
    const star = mesh(rightArm, new THREE.OctahedronGeometry(.12), "#ffe38e", 0, -.04, .23); star.rotation.z = .6;
    sphere(body, "#ffe6a6", 0, 1.17, .26, .07, .07, .035);
  } else if (character === "duck") {
    sphere(body, "#f4a444", 0, 1.39, .39, .2, .075, .16);
    [-1, 1].forEach(side => { sphere(body, "#f4b34e", side * .16, .075, .14, .16, .07, .23); mesh(body, new THREE.BoxGeometry(.065, .39, .06), "#99d9e5", side * .16, 1.1, .23); sphere(body, "#ffe791", side * .16, .94, .28, .038); });
    sphere(body, "#ffea98", .03, 1.85, -.03, .075, .15, .07).rotation.z = -.4;
    sphere(body, "#f7ce55", 0, .83, -.25, .17, .12, .18);
  }
  return {
    root,
    animate(time, moving, emote) {
      const stride = moving ? Math.sin(time * 10) * .55 : 0;
      leftLeg.rotation.x = stride; rightLeg.rotation.x = -stride;
      leftArm.rotation.set(-stride * .8, 0, -restingArmAngle); rightArm.rotation.set(stride * .8, 0, restingArmAngle);
      body.position.y = moving ? Math.abs(Math.sin(time * 10)) * .045 : Math.sin(time * 2) * .018;
      body.rotation.set(0, 0, 0);
      // The arms hang below their shoulders: opposite Z rotations lift the hands outward.
      // Keep raised hands below wide hats and beyond the sides of the head.
      if (!moving && (emote === "wave" || emote === "hello")) { rightArm.rotation.z = 2.05 + Math.sin(time * 12) * .2; rightArm.rotation.x = -.2; }
      if (!moving && emote === "cheer") { leftArm.rotation.z = -2.1; rightArm.rotation.z = 2.1; body.position.y += Math.abs(Math.sin(time * 6)) * .16; }
      if (!moving && emote === "dance") { body.rotation.z = Math.sin(time * 7) * .13; body.rotation.y = Math.sin(time * 4) * .25; leftArm.rotation.z = -1.15 - Math.sin(time * 7) * .35; rightArm.rotation.z = 1.15 - Math.sin(time * 7) * .35; leftLeg.rotation.x = Math.sin(time * 7) * .35; rightLeg.rotation.x = -leftLeg.rotation.x; }
    },
    dispose: () => disposeObject(root),
  };
}
