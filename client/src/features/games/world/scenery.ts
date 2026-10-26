import * as THREE from "three";

export type Obstacle = { x: number; z: number; radius: number; height: number };
export function makeTextSprite(text: string, color = "#284345", background = "#fffdf2", width = 4, crowned = false) {
  const canvas = document.createElement("canvas"); canvas.width = 768; canvas.height = 144;
  const context = canvas.getContext("2d")!;
  context.fillStyle = background; context.beginPath(); context.roundRect(6, 6, 756, 130, 40); context.fill();
  if (crowned) {
    // Draw the badge ourselves so every device shows the same gold crown.
    context.fillStyle = "#edb939"; context.strokeStyle = "#a57319"; context.lineWidth = 5;
    context.beginPath(); context.moveTo(35, 49); context.lineTo(58, 68); context.lineTo(81, 34);
    context.lineTo(104, 68); context.lineTo(127, 49); context.lineTo(116, 99); context.lineTo(46, 99);
    context.closePath(); context.fill(); context.stroke();
    context.fillStyle = "#ffe58b"; context.fillRect(48, 103, 66, 10);
  }
  context.font = "600 64px system-ui, sans-serif"; context.textAlign = "center"; context.textBaseline = "middle"; context.fillStyle = color;
  context.fillText(text, crowned ? 448 : 384, 70, crowned ? 582 : 710);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: true, transparent: true, toneMapped: false }));
  sprite.userData.text = text; sprite.userData.crowned = crowned;
  sprite.scale.set(width, width * 144 / 768, 1); return sprite;
}

export function createScenery(scene: THREE.Scene) {
  const root = new THREE.Group(); scene.add(root);
  const obstacles: Obstacle[] = [];
  const materials = new Map<string, THREE.MeshStandardMaterial>();
  const mat = (color: string) => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .88 }));
    return materials.get(color)!;
  };
  const add = (geometry: THREE.BufferGeometry, color: string, x: number, y: number, z: number, parent: THREE.Object3D = root) => {
    const object = new THREE.Mesh(geometry, mat(color)); object.position.set(x, y, z); object.receiveShadow = true; object.castShadow = true; parent.add(object); return object;
  };
  const ball = (color: string, x: number, y: number, z: number, sx: number, sy = sx, sz = sx, parent?: THREE.Object3D) => {
    const object = add(new THREE.SphereGeometry(1, 16, 12), color, x, y, z, parent); object.scale.set(sx, sy, sz); return object;
  };
  const disk = (color: string, x: number, z: number, r: number, y = .025) => add(new THREE.CylinderGeometry(r, r, .08, 64), color, x, y, z);

  add(new THREE.CylinderGeometry(24, 22.5, 1.5, 80), "#94bb70", 0, -.8, 0);
  add(new THREE.CylinderGeometry(22.7, 18, 3.4, 50), "#b7a583", 0, -3, 0);
  add(new THREE.CylinderGeometry(17.9, 7, 3.6, 30), "#b0a18a", 0, -6.5, 0);
  disk("#b9d98b", 0, 0, 23.95, -.015);
  disk("#e8dfbd", 0, -1, 7.3);
  disk("#f1e8cb", 0, -1, 6.8, .07);
  for (const [x, z, length, angle] of [[0, 12, 15, 0], [-12, -1, 14, Math.PI / 2], [12, -1, 14, Math.PI / 2], [0, -13, 13, 0]]) {
    const path = add(new THREE.BoxGeometry(3.1, .09, length), "#e9dfbf", x, .015, z); path.rotation.y = angle;
  }
  for (let i = 0; i < 17; i++) {
    const angle = i / 17 * Math.PI * 2;
    disk("#d6ccaa", Math.sin(angle) * 7.05, -1 + Math.cos(angle) * 7.05, .12, .08);
  }

  // A bubbling fountain anchors the plaza.
  disk("#c2c9c0", 0, -3.8, 2.35, .11);
  const basin = add(new THREE.TorusGeometry(1.9, .25, 12, 50), "#eeeee0", 0, .36, -3.8); basin.rotation.x = Math.PI / 2;
  const water = disk("#79d3db", 0, -3.8, 1.93, .24);
  add(new THREE.CylinderGeometry(.32, .48, 1.1, 24), "#e5e8db", 0, .8, -3.8);
  const upper = add(new THREE.SphereGeometry(.85, 24, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), "#edf0e3", 0, 1.4, -3.8); upper.scale.y = .4;
  add(new THREE.CylinderGeometry(.12, .2, .55, 16), "#e8eadd", 0, 1.6, -3.8);
  ball("#9edfe2", 0, 1.96, -3.8, .17, .25, .17);
  obstacles.push({ x: 0, z: -3.8, radius: 2.25, height: 2.1 });
  const drops: THREE.Mesh[] = [];
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * Math.PI * 2;
    drops.push(ball("#ace8e6", Math.sin(a) * .7, 1.25, -3.8 + Math.cos(a) * .7, .055, .13, .055));
  }

  function tree(x: number, z: number, size: number, color: string) {
    add(new THREE.CylinderGeometry(.18 * size, .28 * size, 2.2 * size, 10), "#c2a178", x, 1.1 * size, z);
    ball(color, x, 3.1 * size, z, 1.2 * size, 1.5 * size, 1.14 * size);
    ball(color, x - .65 * size, 2.75 * size, z + .14 * size, .74 * size);
    ball(color, x + .64 * size, 2.8 * size, z - .11 * size, .76 * size);
    obstacles.push({ x, z, radius: .42 * size, height: 5 * size });
    ball("#a1c675", x, .08, z, 1.4 * size, .12, 1.3 * size);
  }
  const trees = [[-17, -9, 1.1], [-18, 2, .95], [-12, -16, 1.15], [-5, -19, .85], [5, -18, 1.05], [17, -10, 1.15], [19, 2, .9], [-15, 11, 1], [-7, 18, .8], [14, 13, .9], [18, 7, .72], [9, -13, .8]];
  trees.forEach(([x, z, size], index) => tree(x, z, size, ["#87b97c", "#6cad86", "#a1c784", "#94ba8b"][index % 4]));

  // Open-sided pavilion, pennants, and a little welcome arch.
  const pavilion = new THREE.Group(); pavilion.position.set(-11, 0, -7); root.add(pavilion);
  add(new THREE.CylinderGeometry(3.5, 3.6, .25, 8), "#e8d2b0", 0, .08, 0, pavilion);
  for (const [x, z] of [[-2, -2], [2, -2], [-2, 2], [2, 2]]) add(new THREE.CylinderGeometry(.13, .16, 3.3, 12), "#f4e6d0", x, 1.65, z, pavilion);
  const roof = add(new THREE.ConeGeometry(4.2, 1.9, 4), "#eea29a", 0, 4.1, 0, pavilion); roof.rotation.y = Math.PI / 4;
  add(new THREE.ConeGeometry(3.98, .3, 4), "#f6c5ac", 0, 3.33, 0, pavilion).rotation.y = Math.PI / 4;
  ball("#f5d38a", 0, 5.1, 0, .16, .3, .16, pavilion);
  const pavilionSign = makeTextSprite("THE HANGOUT", "#665852", "#fff7dc", 3.2); pavilionSign.position.set(-11, 2.7, -4.7); root.add(pavilionSign);
  for (const x of [-2.7, 2.7]) add(new THREE.CylinderGeometry(.18, .21, 4.7, 12), "#f4e9cf", x, 2.2, -14);
  const arch = add(new THREE.TorusGeometry(2.7, .21, 10, 40, Math.PI), "#f1d28f", 0, 4.2, -14); arch.rotation.z = 0;
  const archSign = makeTextSprite("LITTLE WORLDS", "#3c695b", "#fff4d7", 5.2); archSign.position.set(0, 4.5, -13.8); root.add(archSign);
  for (let i = 0; i < 9; i++) {
    const flag = add(new THREE.ConeGeometry(.2, .5, 3), ["#e69a8e", "#edc96d", "#9cc7c6"][i % 3], -2.1 + i * .52, 3.7 - Math.sin(i / 8 * Math.PI) * .4, -13.8); flag.rotation.z = Math.PI;
  }

  function mushroom(x: number, z: number, scale: number, color: string) {
    add(new THREE.CylinderGeometry(.25 * scale, .36 * scale, 1.5 * scale, 16), "#f2dfbc", x, .75 * scale, z);
    const cap = add(new THREE.SphereGeometry(1 * scale, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2), color, x, 1.45 * scale, z); cap.scale.y = .7;
    add(new THREE.CylinderGeometry(.97 * scale, .89 * scale, .1 * scale, 24), "#fae7d0", x, 1.47 * scale, z);
    for (let i = 0; i < 5; i++) {
      const angle = i * 1.6;
      const spot = ball("#fff0d6", x + Math.sin(angle) * .59 * scale, 2.025 * scale, z + Math.cos(angle) * .59 * scale, .17 * scale, .025 * scale, .17 * scale);
      spot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(Math.sin(angle) * .59, 1.15, Math.cos(angle) * .59).normalize());
    }
    obstacles.push({ x, z, radius: .4 * scale, height: 2.3 * scale });
  }
  mushroom(11, -6, 1.85, "#e58a86"); mushroom(13.3, -4.3, 1.1, "#efb57e"); mushroom(9.3, -4.4, .75, "#c5a4cc"); mushroom(12, -9, .85, "#d596b0");
  const groveSign = makeTextSprite("MUSHROOM GROVE", "#645659", "#ffefd9", 3.6); groveSign.position.set(11, 3.9, -4); root.add(groveSign);

  // Hop between low, solid stepping stones.
  const stones = [[6, 8, .35], [8.2, 9, .6], [10.1, 7.4, .85], [9.2, 5, 1.15], [6.9, 4.1, .75]];
  stones.forEach(([x, z, height], i) => {
    add(new THREE.CylinderGeometry(.9, 1.06, height, 10), ["#f0d68e", "#d9b8cd", "#a8cdd1", "#dfc79f"][i % 4], x, height / 2, z);
    obstacles.push({ x, z, radius: .94, height });
    const marker = disk("#fff3cf", x, z, .16, height + .02); marker.castShadow = false;
  });
  const stonesSign = makeTextSprite("HOP THIS WAY", "#566666", "#fff3d9", 2.8); stonesSign.position.set(8.7, 2.9, 8.5); root.add(stonesSign);

  // Benches invite students to gather beside the plaza.
  for (const [x, z, angle] of [[-5.2, 4, -.45], [5.3, -.3, 1.4], [-5.1, -5.1, .5]]) {
    const bench = new THREE.Group(); bench.position.set(x, 0, z); bench.rotation.y = angle; root.add(bench);
    add(new THREE.BoxGeometry(2.1, .14, .66), "#cda986", 0, .58, 0, bench);
    add(new THREE.BoxGeometry(2.1, .48, .13), "#d9b895", 0, 1.01, -.31, bench);
    for (const dx of [-.75, .75]) add(new THREE.BoxGeometry(.13, .62, .54), "#749c91", dx, .3, 0, bench);
    obstacles.push({ x, z, radius: 1.05, height: 1.25 });
  }
  // Flowers use tiny instanced meshes so the garden stays inexpensive.
  const flowerStem = new THREE.InstancedMesh(new THREE.CylinderGeometry(.025, .03, .26, 5), mat("#73a36b"), 110);
  const flowerHeads = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(.105, 1), mat("#f4e2a1"), 110);
  const matrix = new THREE.Matrix4(); let seed = 61;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  for (let i = 0; i < 110; i++) {
    const angle = random() * Math.PI * 2, r = 9 + random() * 12;
    let x = Math.sin(angle) * r, z = Math.cos(angle) * r;
    if (Math.abs(x) < 2) x += Math.sign(x || 1) * 3;
    if (Math.abs(z + 1) < 2) z += 3;
    matrix.makeTranslation(x, .13, z); flowerStem.setMatrixAt(i, matrix);
    matrix.makeTranslation(x, .3, z); flowerHeads.setMatrixAt(i, matrix);
    flowerHeads.setColorAt(i, new THREE.Color(["#fff0ac", "#ebaaa4", "#e7d5ef", "#fcf4e7"][i % 4]));
  }
  root.add(flowerStem, flowerHeads);
  for (let i = 0; i < 20; i++) {
    const a = i * 2.4, r = 19 + (i % 3);
    ball("#9bc581", Math.sin(a) * r, .27, Math.cos(a) * r, .8, .42, .7);
  }

  const clouds: THREE.Group[] = [];
  for (const [x, y, z, scale] of [[-30, 9, -32, 1.8], [24, 11, -32, 2.2], [-33, 6, 13, 1.6], [32, 6, 10, 1.7], [0, 13, -40, 1.4]]) {
    const cloud = new THREE.Group(); cloud.position.set(x, y, z); cloud.scale.setScalar(scale); root.add(cloud); clouds.push(cloud);
    ball("#fffaf0", 0, 0, 0, 2.4, .65, .85, cloud); ball("#fffaf0", -.7, .4, 0, 1, .8, .8, cloud); ball("#fffaf0", .6, .65, 0, 1.2, .95, .9, cloud);
  }
  const balloon = new THREE.Group(); root.add(balloon); balloon.position.set(-19, 10, -21);
  ball("#eab5a4", 0, 1.3, 0, 1.15, 1.5, 1.15, balloon);
  add(new THREE.CylinderGeometry(.3, .28, .4, 8), "#cba47c", 0, -1, 0, balloon);
  for (const x of [-.22, .22]) add(new THREE.CylinderGeometry(.012, .012, 1, 5), "#b29d7b", x, -.38, 0, balloon);
  return {
    root, obstacles,
    animate(time: number, reducedMotion: boolean) {
      if (reducedMotion) return;
      drops.forEach((drop, i) => { const cycle = (time * .6 + i / drops.length) % 1; const a = i / drops.length * Math.PI * 2; drop.position.set(Math.sin(a) * (.4 + cycle * .8), 1.68 - cycle * 1.3, -3.8 + Math.cos(a) * (.4 + cycle * .8)); });
      water.scale.setScalar(1 + Math.sin(time * 1.3) * .006);
      balloon.position.y = 10 + Math.sin(time * .35) * .35;
      clouds.forEach((cloud, i) => { cloud.position.x += Math.sin(time * .1 + i) * .0006; });
    },
  };
}
