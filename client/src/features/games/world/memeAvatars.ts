import * as THREE from "three";
import type { AvatarRig } from "./avatars";

type MemeCharacter = "tung-tung" | "le-sunshine" | "mike" | "pepe";

/** Sculpted proportions and faces follow the classroom's supplied references.
 * Each character has its own silhouette, with shared articulated limb controls. */
export function createMemeAvatar(character: MemeCharacter, dispose: (root: THREE.Object3D) => void): AvatarRig {
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body); root.name = `avatar-${character}`;
  const palette = new Map<string, THREE.MeshStandardMaterial>();
  function material(color: string) {
    if (!palette.has(color)) palette.set(color, new THREE.MeshStandardMaterial({ color, roughness: .69 }));
    return palette.get(color)!;
  }
  function mesh(parent: THREE.Object3D, geometry: THREE.BufferGeometry, color: string, x: number, y: number, z: number, name?: string) {
    const object = new THREE.Mesh(geometry, material(color)); object.position.set(x, y, z); object.castShadow = true; object.receiveShadow = true;
    if (name) object.name = name; parent.add(object); return object;
  }
  const ball = (parent: THREE.Object3D, color: string, x: number, y: number, z: number, sx: number, sy = sx, sz = sx, name?: string) => {
    const object = mesh(parent, new THREE.SphereGeometry(1, 24, 18), color, x, y, z, name); object.scale.set(sx, sy, sz); return object;
  };
  function curve(parent: THREE.Object3D, color: string, points: number[][], radius: number, name?: string) {
    return mesh(parent, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point as [number, number, number]))), 18, radius, 7, false), color, 0, 0, 0, name);
  }
  const wood = "#b46a2c", green = character === "mike" ? "#9fbd34" : "#608f3e", skin = character === "tung-tung" ? wood : character === "le-sunshine" ? "#754122" : green;
  const shoulder = character === "mike" ? .65 : character === "pepe" ? .43 : .39;
  const shoulderY = character === "mike" ? 1.32 : 1.29;
  const armLength = character === "mike" ? .62 : .59;
  const armRadius = character === "mike" ? .047 : .065;
  const leftArm = new THREE.Group(), rightArm = new THREE.Group(), leftLeg = new THREE.Group(), rightLeg = new THREE.Group();
  [leftArm, rightArm].forEach((arm, i) => {
    const side = i ? 1 : -1; arm.name = `${i ? "right" : "left"}-arm`; arm.position.set(side * shoulder, shoulderY, 0); body.add(arm);
    ball(arm, skin, 0, 0, 0, armRadius);
    curve(arm, skin, [[0, 0, 0], [side * .035, -armLength * .46, .035], [0, -armLength + .04, .06]], armRadius);
    ball(arm, skin, 0, -armLength, .065, .085, .105, .05, `${i ? "right" : "left"}-hand`);
    for (let finger = 0; finger < 3; finger++) {
      curve(arm, skin, [[(finger - 1) * .05, -armLength - .04, .065], [(finger - 1) * .057, -armLength - .13, .09]], .021);
    }
    ball(arm, skin, side * .08, -armLength, .08, .026, .06, .026).rotation.z = -side * .6;
  });
  const legX = character === "mike" ? .34 : character === "pepe" ? .29 : .18;
  [leftLeg, rightLeg].forEach((leg, i) => {
    leg.name = `${i ? "right" : "left"}-leg`; leg.position.set(i ? legX : -legX, .69, 0); body.add(leg);
    curve(leg, skin, [[0, character === "tung-tung" ? .17 : .04, 0], [0, -.28, -.025], [.015, -.55, .04]], character === "mike" ? .045 : .07);
    const shoe = character === "le-sunshine" ? "#f3e5ca" : skin;
    ball(leg, shoe, 0, -.6, .11, .13, .075, .21);
    if (character !== "le-sunshine") for (let toe = 0; toe < 3; toe++) ball(leg, character === "mike" ? "#e2dcb9" : skin, (toe - 1) * .075, -.61, .27, .035, .028, .07);
  });

  if (character === "tung-tung") {
    const trunk = mesh(body, new THREE.CylinderGeometry(.355, .37, 1.34, 40, 32), wood, 0, 1.48, 0, "wooden-trunk");
    const positions = trunk.geometry.getAttribute("position"), colors: number[] = [], base = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const angle = Math.atan2(positions.getZ(i), positions.getX(i));
      const grain = Math.sin(angle * 32 + Math.sin(positions.getY(i) * 5) * .8) * .035;
      base.setHSL(.075 + grain * .12, .63, .38 + grain + positions.getY(i) * .045).convertSRGBToLinear(); colors.push(base.r, base.g, base.b);
    }
    trunk.geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    trunk.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .53 });
    for (const radius of [.13, .23, .31]) { const ring = mesh(body, new THREE.TorusGeometry(radius, .007, 5, 36), "#8e5429", 0, 2.152, 0); ring.rotation.x = Math.PI / 2; }
    for (const side of [-1, 1]) {
      ball(body, "#b87c45", side * .17, 1.82, .30, .18, .225, .11);
      ball(body, "#f8e6ca", side * .17, 1.84, .39, .135, .16, .072, "sahur-eye");
      ball(body, "#7b512e", side * .17, 1.84, .455, .074, .089, .025);
      ball(body, "#23170e", side * .17, 1.84, .476, .042, .055, .014);
      ball(body, "#ffffff", side * .17 - .016, 1.875, .489, .019);
      curve(body, "#392318", [[side * .065, 2.005, .35], [side * .17, 2.065, .36], [side * .29, 2.025, .3]], .035, "heavy-brow");
    }
    ball(body, "#c1844b", 0, 1.64, .355, .068, .135, .105);
    ball(body, "#c88c53", 0, 1.565, .4, .1, .056, .09);
    ball(body, "#372319", 0, 1.41, .345, .232, .075, .031, "sahur-smile");
    curve(body, "#e4bf8c", [[-.19, 1.44, .376], [0, 1.405, .387], [.19, 1.45, .375]], .018);
    curve(body, "#9e502c", [[-.2, 1.402, .36], [0, 1.353, .379], [.2, 1.42, .36]], .02);
    const bat = new THREE.Group(); bat.name = "wooden-bat"; bat.position.set(-.025, -armLength, .08); bat.rotation.z = -.22; leftArm.add(bat);
    mesh(bat, new THREE.CylinderGeometry(.027, .04, .3, 12), "#b76b25", 0, -.03, 0);
    mesh(bat, new THREE.CylinderGeometry(.04, .095, .55, 16), "#bd712b", 0, -.43, 0);
    ball(bat, "#a85b25", 0, -.73, 0, .095, .13, .095);
  } else if (character === "mike") {
    ball(body, green, 0, 1.28, 0, .65, .73, .47, "round-monster-body");
    for (const side of [-1, 1]) {
      const horn = mesh(body, new THREE.ConeGeometry(.09, .24, 14), "#d9d1ad", side * .4, 1.94, -.05, "horn"); horn.rotation.z = -side * .36;
    }
    ball(body, "#769f28", 0, 1.52, .384, .39, .4, .17, "eyelid-rim");
    ball(body, "#ffffe9", 0, 1.51, .476, .33, .34, .12, "single-eye");
    ball(body, "#209585", .025, 1.49, .586, .145, .158, .021, "turquoise-iris");
    for (let i = 0; i < 24; i++) {
      const angle = i / 24 * Math.PI * 2;
      curve(body, i % 2 ? "#185d55" : "#53b29c", [[.025 + Math.cos(angle) * .092, 1.49 + Math.sin(angle) * .101, .606], [.025 + Math.cos(angle) * .137, 1.49 + Math.sin(angle) * .149, .602]], .004);
    }
    ball(body, "#081b18", .025, 1.49, .612, .079, .099, .014);
    ball(body, "#ffffff", -.012, 1.55, .628, .03); ball(body, "#d3fff1", .065, 1.45, .628, .012);
    ball(body, "#526b23", 0, .98, .407, .427, .235, .087, "smile-rim");
    ball(body, "#1e2715", 0, .99, .472, .37, .18, .03, "open-grin");
    ball(body, "#b0ad5a", 0, .865, .5, .19, .043, .018);
    for (let i = 0; i < 7; i++) {
      const x = (i - 3) * .093, edge = Math.abs(i - 3) / 3;
      ball(body, "#fff6cc", x, 1.091 - edge * .045, .51, .044, .058, .018, "upper-tooth");
      ball(body, "#e6dda9", x * .87, .867 + edge * .034, .507, .035, .035, .015, "lower-tooth");
    }
  } else if (character === "pepe") {
    ball(body, "#0747e7", 0, 1.02, 0, .4, .34, .28, "blue-shirt");
    for (const side of [-1, 1]) ball(body, "#0747e7", side * .3, 1.22, 0, .16, .13, .18, "shirt-sleeve");
    mesh(body, new THREE.CylinderGeometry(.33, .37, .22, 24), "#b51d2c", 0, .75, 0, "red-shorts-waist");
    for (const side of [-1, 1]) { const shorts = mesh(body, new THREE.CapsuleGeometry(.19, .16, 5, 18), "#b51d2c", side * .22, .6, 0, "red-shorts"); shorts.scale.z = 1.05; }
    ball(body, green, 0, 1.66, .025, .56, .39, .34, "wide-frog-head");
    for (const side of [-1, 1]) {
      ball(body, green, side * .245, 1.93, .035, .29, .26, .28);
      ball(body, "#121a0e", side * .235, 1.86, .278, .268, .185, .075, "eye-outline");
      const eye = ball(body, "#fffef1", side * .235, 1.86, .302, .25, .164, .067); eye.rotation.z = side * .1;
      ball(body, "#080d09", side * .217, 1.845, .364, .105, .14, .027);
      ball(body, "#ffffff", side * .217 - .028, 1.903, .391, .04); ball(body, "#ffffff", side * .217 + .027, 1.827, .393, .019);
      curve(body, "#456e2c", [[side * .035, 1.95, .31], [side * .21, 2.025, .31], [side * .44, 1.98, .265]], .036, "heavy-frog-lid");
    }
    ball(body, "#355725", 0, 1.51, .285, .51, .137, .089);
    ball(body, "#ad613a", 0, 1.51, .357, .47, .112, .05, "wide-orange-lips");
    curve(body, "#4f2f1c", [[-.43, 1.526, .379], [-.24, 1.49, .402], [0, 1.475, .411], [.25, 1.493, .401], [.43, 1.54, .377]], .014, "pepe-smile");
    curve(body, "#cb8956", [[-.38, 1.458, .382], [0, 1.425, .398], [.38, 1.474, .383]], .013);
  } else {
    ball(body, "#fff4cf", 0, 1.03, 0, .32, .4, .22, "basketball-jersey");
    for (const side of [-1, 1]) {
      curve(body, "#6c3998", [[side * .27, 1.29, .12], [side * .29, 1.02, .17], [side * .26, .78, .15]], .034);
      ball(body, skin, side * .35, 1.32, 0, .1, .13, .11);
      mesh(body, new THREE.CapsuleGeometry(.145, .16, 5, 16), "#ffc547", side * .17, .64, 0);
      ball(body, skin, side * .345, 1.75, .015, .075, .11, .05);
    }
    const collar = mesh(body, new THREE.TorusGeometry(.155, .024, 8, 24), "#7739a2", 0, 1.375, .015); collar.rotation.x = Math.PI / 2;
    ball(body, skin, 0, 1.7, .025, .345, .43, .3, "sunshine-head");
    const fallbackFace = new THREE.Group(); body.add(fallbackFace);
    ball(fallbackFace, "#2a1a14", 0, 1.48, .14, .28, .21, .19, "beard");
    ball(fallbackFace, "#37241a", 0, 2.055, .015, .26, .06, .235, "hairline");
    for (const side of [-1, 1]) { ball(fallbackFace, "#271b16", side * .13, 1.82, .299, .055, .027, .017); curve(fallbackFace, "#312018", [[side * .06, 1.889, .292], [side * .14, 1.903, .286], [side * .22, 1.877, .26]], .018); }
    ball(fallbackFace, "#996142", 0, 1.69, .29, .062, .084, .069);
    ball(fallbackFace, "#fff8dc", 0, 1.552, .311, .14, .034, .018);
    // Use the supplied meme itself for facial likeness, mapped onto a curved
    // front surface. The source image is copied intact, not re-created.
    if (typeof document !== "undefined" && typeof document.createElementNS === "function") {
      const texture = new THREE.TextureLoader().load("/world-characters/le-sunshine.png", () => { fallbackFace.visible = false; face.visible = true; }); texture.colorSpace = THREE.SRGBColorSpace;
      // Project the photograph across the front instead of wrapping spherical
      // UVs, which squeeze the eyes and mouth toward the middle of the head.
      const geometry = new THREE.PlaneGeometry(.70, .86, 24, 28);
      const positions = geometry.getAttribute("position");
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i), y = positions.getY(i), yn = y / .43;
        positions.setXYZ(i, x * Math.sqrt(1 - .32 * yn * yn), y, .34 * Math.sqrt(Math.max(.02, 1 - .8 * (x / .35) ** 2 - .18 * yn * yn)));
      }
      geometry.computeVertexNormals();
      const uv = geometry.getAttribute("uv");
      for (let i = 0; i < uv.count; i++) uv.setXY(i, .24 + uv.getX(i) * .51, .16 + uv.getY(i) * .78);
      const face = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
      face.name = "reference-face"; face.visible = false; face.position.set(0, 1.72, .035); body.add(face);
    }
    const aura = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), new THREE.MeshBasicMaterial({ color: "#ffce42", transparent: true, opacity: .12, depthWrite: false }));
    aura.name = "sunshine-glow"; aura.position.set(0, 1.77, -.08); aura.scale.set(.53, .72, .42); body.add(aura);
    const halo = mesh(body, new THREE.TorusGeometry(.37, .024, 8, 36), "#ffe36d", 0, 2.28, 0, "sunshine-halo"); halo.rotation.x = Math.PI / 2;
    halo.material = new THREE.MeshBasicMaterial({ color: "#ffdf74" }) as unknown as THREE.MeshStandardMaterial;
  }

  return {
    root,
    animate(time, moving, emote) {
      const stride = moving ? Math.sin(time * 10) * .47 : 0;
      leftLeg.rotation.x = stride; rightLeg.rotation.x = -stride;
      leftArm.rotation.set(-stride * .65, 0, -.18); rightArm.rotation.set(stride * .65, 0, .18);
      body.position.y = moving ? Math.abs(Math.sin(time * 10)) * .035 : Math.sin(time * 2) * .012; body.rotation.set(0, 0, 0);
      if (!moving && (emote === "wave" || emote === "hello")) { rightArm.rotation.z = 2.05 + Math.sin(time * 10) * .18; rightArm.rotation.x = -.16; }
      if (!moving && emote === "cheer") { leftArm.rotation.z = -2.05; rightArm.rotation.z = 2.05; body.position.y += Math.abs(Math.sin(time * 6)) * .12; }
      if (!moving && emote === "dance") { body.rotation.z = Math.sin(time * 6) * .1; body.rotation.y = Math.sin(time * 4) * .18; leftArm.rotation.z = -1.25 - Math.sin(time * 6) * .27; rightArm.rotation.z = 1.25 - Math.sin(time * 6) * .27; leftLeg.rotation.x = Math.sin(time * 6) * .3; rightLeg.rotation.x = -leftLeg.rotation.x; }
    },
    dispose: () => { dispose(root); palette.forEach(value => value.dispose()); },
  };
}
