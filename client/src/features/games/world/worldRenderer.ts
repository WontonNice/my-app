import * as THREE from "three";
import { createAvatar, disposeObject, type AvatarRig } from "./avatars";
import { createScenery, makeTextSprite } from "./scenery";
import { createCrystalArena, createCrystalPortal, CRYSTAL_INTERACT_DISTANCE, CRYSTAL_PORTAL } from "./crystalScene";
import type { WorldCharacterId, WorldEmote, WorldPose, WorldPresence } from "../../../../../server/src/shared/gameWorld";
import { CRYSTAL_PICKUP_DISTANCE, crystalSpeedMultiplier, type CrystalView } from "../../../../../server/src/shared/crystalDefense";

export type WorldSceneState = { selfId: string; name: string; character: WorldCharacterId; players: WorldPresence[]; initialPose?: WorldPose; emote?: { id: WorldEmote; at: number }; disabled?: boolean; spectating?: boolean; followId?: string; arena?: "lobby" | "crystal"; crystal?: CrystalView; gameHostId?: string | null };
export type WorldSceneInteractions = { onPortalEnter?: () => void; onMonsterClick?: (id: string) => void; onItemPickup?: (itemId: string, position: { x: number; z: number }) => Promise<boolean>; onHint?: (message: string) => void };
type Remote = { rig: AvatarRig; character: WorldCharacterId; label: THREE.Sprite; name: string; crowned: boolean; target: WorldPresence };

/** An acknowledged pickup stays suppressed until the next actor/wave/run, even if presence rerenders an older room snapshot. */
export function createCrystalPickupCollector(onPickup: NonNullable<WorldSceneInteractions["onItemPickup"]>, monotonicNow: () => number = () => performance.now()) {
  const attempts = new Map<string, number>();
  let context = "", generation = 0, pending = false, disposed = false;
  return {
    step(state: WorldSceneState, position: { x: number; z: number }) {
      if (disposed) return;
      const crystal = state.crystal, nextContext = `${state.selfId}:${crystal?.runId ?? ""}:${crystal?.wave ?? 0}`;
      if (nextContext !== context) { context = nextContext; attempts.clear(); generation++; }
      if (pending || state.spectating || state.disabled || state.arena !== "crystal" || !crystal || !["battle", "intermission"].includes(crystal.phase)) return;
      const participant = crystal.participants.find(player => player.id === state.selfId && !player.left);
      if (!participant || participant.spectating || participant.pickedItemWave === crystal.wave || crystal.monsters.some(monster => monster.status === "challenged" && monster.claimedBy === state.selfId)) return;
      const now = monotonicNow();
      const item = (crystal.items ?? []).find(item => item.ownerId === state.selfId && item.pickedUpAt === undefined && (attempts.get(item.id) ?? 0) <= now && Math.hypot(position.x - item.x, position.z - item.z) <= CRYSTAL_PICKUP_DISTANCE);
      if (!item) return;
      pending = true; attempts.set(item.id, Infinity);
      const startedGeneration = generation, point = { x: position.x, z: position.z };
      void (async () => {
        let ok = false;
        try { ok = await onPickup(item.id, point); } catch { /* A failed request may retry after the connection recovers. */ }
        finally {
          pending = false;
          if (!disposed && generation === startedGeneration) attempts.set(item.id, ok ? Infinity : monotonicNow() + 2000);
        }
      })();
    },
    dispose() { disposed = true; generation++; attempts.clear(); },
  };
}

export function createWorldScene(container: HTMLDivElement, onMove: (pose: WorldPose) => void, onInteract: () => void, onError: (message: string) => void, onCancelEmote: () => void = () => {}, interactions: WorldSceneInteractions = {}) {
  let state: WorldSceneState = { selfId: "preview", name: "You", character: "frog", players: [], disabled: true };
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1;
  renderer.domElement.setAttribute("aria-hidden", "true"); container.append(renderer.domElement);
  const scene = new THREE.Scene(); scene.background = new THREE.Color("#b8dce3"); scene.fog = new THREE.Fog("#b8dce3", 33, 95);
  const camera = new THREE.PerspectiveCamera(46, 1, .1, 150);
  scene.add(new THREE.HemisphereLight("#fff9e7", "#a3b1a0", 1.7));
  const sun = new THREE.DirectionalLight("#fff0d1", 2.3); sun.position.set(-16, 28, 16); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -29; sun.shadow.camera.right = 29; sun.shadow.camera.top = 29; sun.shadow.camera.bottom = -29;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 75; sun.shadow.normalBias = .035; sun.shadow.bias = -.00012; scene.add(sun);
  const scenery = createScenery(scene);
  const portal = createCrystalPortal(scenery.root), arena = createCrystalArena(scene);
  const pickups = interactions.onItemPickup ? createCrystalPickupCollector(interactions.onItemPickup) : undefined;
  const lobbyObstacles = [...scenery.obstacles, ...portal.obstacles];
  let activeObstacles = lobbyObstacles, portalInside = false;
  const remotes = new Map<string, Remote>();
  const actorPlaces = new Map<string, WorldPose>();
  const placeKey = (value: WorldSceneState) => `${value.selfId}:${value.spectating ? "spectator" : "player"}:${value.arena ?? "lobby"}:${value.arena === "crystal" ? value.crystal?.runId ?? "" : ""}`;
  let local = createAvatar(state.character); scene.add(local.root);
  let localLabel = makeTextSprite("You", "#2c5c56", "#fff9df", 1.8); scene.add(localLabel);
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(.42, 24), new THREE.MeshBasicMaterial({ color: "#4e715b", transparent: true, opacity: .17, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
  const position = new THREE.Vector3(0, 0, 6), cameraTarget = new THREE.Vector3(0, 1.3, 5);
  let rotation = Math.PI, moving = false, verticalSpeed = 0, grounded = true;
  let yaw = .35, pitch = .46, distance = 13, dragPointer = -1, lastPointer = { x: 0, y: 0 }, pointerTravel = 0, disposed = false;
  let lastTime = 0, lastSend = 0, frame = 0, cameraInitialized = false, elapsed = 0;
  const keys = new Set<string>(), reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let touchX = 0, touchZ = 0, jumpRequested = false;
  let cancelledEmoteAt: number | undefined;
  const moveKeys = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "ShiftLeft", "ShiftRight", "KeyE"];
  const inTextInput = (target: EventTarget | null) => target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
  function cancelEmote() {
    if (!state.emote || state.emote.at === cancelledEmoteAt || Date.now() - state.emote.at >= 4000) return;
    cancelledEmoteAt = state.emote.at;
    onCancelEmote();
  }
  function keydown(event: KeyboardEvent) {
    if (state.disabled || !container.contains(document.activeElement) || inTextInput(event.target)) return;
    if (event.code === "Escape") { cancelEmote(); return; }
    if (!moveKeys.includes(event.code)) return;
    event.preventDefault(); keys.add(event.code);
    if (event.code === "Space" && !event.repeat && !state.spectating) jumpRequested = true;
    if (event.code === "KeyE" && !event.repeat) interactNearest();
  }
  function keyup(event: KeyboardEvent) { keys.delete(event.code); }
  function clearInput() { keys.clear(); touchX = 0; touchZ = 0; jumpRequested = false; }
  function interactMonster(id: string) {
    if (state.disabled || state.spectating || state.arena !== "crystal" || state.crystal?.phase !== "battle") return;
    const monster = arena.monster(id);
    if (!monster || !["active", "challenged"].includes(monster.data.status)) return;
    const pendingId = state.crystal.participants.find(player => player.id === state.selfId)?.pendingMonsterId;
    if (pendingId && pendingId !== id) { interactions.onHint?.("Finish your current monster before choosing another."); return; }
    if (monster.data.failedIds.includes(state.selfId)) { interactions.onHint?.("You already tried this monster. A teammate can rescue it."); return; }
    if (monster.data.claimedBy && monster.data.claimedBy !== state.selfId) { interactions.onHint?.("A teammate is solving this monster. Its shield keeps it frozen."); return; }
    if (Math.hypot(position.x - monster.root.position.x, position.z - monster.root.position.z) > CRYSTAL_INTERACT_DISTANCE) { interactions.onHint?.("Walk closer to the monster, then click it or press E."); return; }
    clearInput(); cancelEmote(); interactions.onMonsterClick?.(id);
  }
  function interactNearest() {
    if (state.spectating) return;
    if (state.arena === "crystal") {
      const pendingId = state.crystal?.participants.find(player => player.id === state.selfId)?.pendingMonsterId;
      if (pendingId) { interactMonster(pendingId); return; }
      const candidates = arena.targets().map(target => ({ id: String(target.userData.monsterId), distance: Math.hypot(position.x - target.position.x, position.z - target.position.z) })).sort((left, right) => left.distance - right.distance);
      const available = candidates.find(candidate => {
        const monster = arena.monster(candidate.id)?.data;
        return candidate.distance <= CRYSTAL_INTERACT_DISTANCE && monster?.status === "active" && !monster.failedIds.includes(state.selfId);
      });
      const nearest = available ?? candidates[0];
      if (nearest) interactMonster(nearest.id); else interactions.onHint?.("New monsters are on their way. Watch the outer ring.");
    } else if (Math.hypot(position.x - CRYSTAL_PORTAL.x, position.z - CRYSTAL_PORTAL.z) < 3) { portalInside = true; clearInput(); interactions.onPortalEnter?.(); }
    else onInteract();
  }
  function pointerdown(event: PointerEvent) {
    if (event.button !== 0 || event.target !== renderer.domElement) return;
    container.focus({ preventScroll: true }); dragPointer = event.pointerId; lastPointer = { x: event.clientX, y: event.clientY }; pointerTravel = 0; renderer.domElement.setPointerCapture(event.pointerId);
    renderer.domElement.classList.add("is-dragging");
  }
  function pointermove(event: PointerEvent) {
    if (dragPointer !== event.pointerId) return;
    pointerTravel += Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
    yaw -= (event.clientX - lastPointer.x) * .006; pitch = THREE.MathUtils.clamp(pitch + (event.clientY - lastPointer.y) * .004, .22, 1.02);
    lastPointer = { x: event.clientX, y: event.clientY };
  }
  function pointerup() { dragPointer = -1; renderer.domElement.classList.remove("is-dragging"); }
  const raycaster = new THREE.Raycaster();
  function pointerclick(event: PointerEvent) {
    if (event.pointerId === dragPointer && pointerTravel < 7 && !state.disabled && state.arena === "crystal") {
      const bounds = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - bounds.left) / bounds.width * 2 - 1, -(event.clientY - bounds.top) / bounds.height * 2 + 1), camera);
      const hit = raycaster.intersectObjects(arena.targets(), true)[0];
      if (hit?.object.userData.monsterId) interactMonster(String(hit.object.userData.monsterId));
    }
    pointerup();
  }
  function wheel(event: WheelEvent) { if (!container.contains(document.activeElement)) return; event.preventDefault(); distance = THREE.MathUtils.clamp(distance + event.deltaY * .008, 7, 22); }
  function contextLost(event: Event) { event.preventDefault(); cancelAnimationFrame(frame); onError("The 3D view lost its graphics connection. Leave and reopen the world to reconnect."); }
  window.addEventListener("keydown", keydown); window.addEventListener("keyup", keyup); window.addEventListener("blur", clearInput);
  document.addEventListener("visibilitychange", clearInput);
  renderer.domElement.addEventListener("pointerdown", pointerdown); renderer.domElement.addEventListener("pointermove", pointermove);
  renderer.domElement.addEventListener("pointerup", pointerclick); renderer.domElement.addEventListener("pointercancel", pointerup); renderer.domElement.addEventListener("lostpointercapture", pointerup);
  renderer.domElement.addEventListener("wheel", wheel, { passive: false }); renderer.domElement.addEventListener("webglcontextlost", contextLost);
  function resize() {
    const width = container.clientWidth, height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(container); resize();
  function floorHeight(x: number, z: number, above: number) {
    let floor = 0;
    for (const obstacle of state.spectating ? [] : activeObstacles) {
      if (obstacle.height < 1.2 && Math.hypot(x - obstacle.x, z - obstacle.z) < obstacle.radius + .15 && above >= obstacle.height - .05) floor = Math.max(floor, obstacle.height);
    }
    return floor;
  }
  function step(dt: number, now: number) {
    const up = Number(keys.has("KeyW") || keys.has("ArrowUp")), down = Number(keys.has("KeyS") || keys.has("ArrowDown"));
    const left = Number(keys.has("KeyA") || keys.has("ArrowLeft")), right = Number(keys.has("KeyD") || keys.has("ArrowRight"));
    const following = state.spectating ? state.players.find(player => player.id === state.followId) : undefined;
    let dx = state.disabled || following ? 0 : right - left + touchX, dz = state.disabled || following ? 0 : down - up + touchZ;
    const magnitude = Math.hypot(dx, dz); moving = magnitude > .01;
    if (moving || jumpRequested && !state.disabled) cancelEmote();
    if (moving) {
      dx /= Math.max(1, magnitude); dz /= Math.max(1, magnitude);
      const participant = state.arena === "crystal" && ["battle", "intermission"].includes(state.crystal?.phase ?? "") ? state.crystal?.participants.find(player => player.id === state.selfId && !player.left) : undefined;
      const speed = (keys.has("ShiftLeft") || keys.has("ShiftRight") ? 7.2 : 4.8) * crystalSpeedMultiplier(participant?.speedStacks);
      const wx = dx * Math.cos(yaw) + dz * Math.sin(yaw), wz = dz * Math.cos(yaw) - dx * Math.sin(yaw);
      let nx = position.x + wx * dt * speed, nz = position.z + wz * dt * speed;
      for (const obstacle of state.spectating ? [] : activeObstacles) {
        const separation = Math.hypot(nx - obstacle.x, nz - obstacle.z), minimum = obstacle.radius + .27;
        if (separation < minimum && position.y < obstacle.height - .04) {
          if (separation > .001) { nx = obstacle.x + (nx - obstacle.x) / separation * minimum; nz = obstacle.z + (nz - obstacle.z) / separation * minimum; }
          else { nx = position.x; nz = position.z; }
        }
      }
      const radius = Math.hypot(nx, nz); if (radius > 22.7) { nx *= 22.7 / radius; nz *= 22.7 / radius; }
      position.x = nx; position.z = nz;
      const targetRotation = Math.atan2(wx, wz), difference = Math.atan2(Math.sin(targetRotation - rotation), Math.cos(targetRotation - rotation));
      rotation += difference * Math.min(1, dt * 14);
      rotation = Math.atan2(Math.sin(rotation), Math.cos(rotation));
    }
    if (jumpRequested && grounded && !state.disabled && !state.spectating) { verticalSpeed = 6.5; grounded = false; }
    jumpRequested = false;
    const floor = floorHeight(position.x, position.z, position.y);
    verticalSpeed -= 16 * dt; position.y += verticalSpeed * dt;
    if (position.y <= floor) { position.y = floor; verticalSpeed = 0; grounded = true; } else grounded = false;
    local.root.position.copy(position); local.root.rotation.y = rotation;
    const emote = state.emote && state.emote.at !== cancelledEmoteAt && Date.now() - state.emote.at < 4000 ? state.emote.id : undefined;
    local.animate(reducedMotion.matches ? 0 : now, moving, emote);
    localLabel.position.set(position.x, position.y + 2.8, position.z);
    shadow.position.set(position.x, .09, position.z); shadow.scale.setScalar(1 - Math.min(.35, position.y * .14));
    if (!state.spectating && !state.disabled && now - lastSend >= .1) { onMove({ x: position.x, y: position.y, z: position.z, rotation, moving }); lastSend = now; }
    if (!state.spectating && state.arena !== "crystal" && !state.disabled) {
      const portalDistance = Math.hypot(position.x - CRYSTAL_PORTAL.x, position.z - CRYSTAL_PORTAL.z);
      if (portalDistance > CRYSTAL_PORTAL.radius + .6) portalInside = false;
      else if (!portalInside && portalDistance < CRYSTAL_PORTAL.radius) { portalInside = true; clearInput(); interactions.onPortalEnter?.(); }
    }
    pickups?.step(state, position);
    remotes.forEach(remote => {
      const pose = remote.target.pose;
      remote.rig.root.position.lerp(new THREE.Vector3(pose.x, pose.y, pose.z), 1 - Math.exp(-14 * dt));
      const difference = Math.atan2(Math.sin(pose.rotation - remote.rig.root.rotation.y), Math.cos(pose.rotation - remote.rig.root.rotation.y));
      remote.rig.root.rotation.y += difference * Math.min(1, dt * 14);
      remote.rig.animate(reducedMotion.matches ? 0 : now, pose.moving, remote.target.emote && Date.now() - (remote.target.emoteAt ?? 0) < 4000 ? remote.target.emote : undefined);
      remote.label.position.copy(remote.rig.root.position).add(new THREE.Vector3(0, 2.8, 0));
    });
    const cameraFocus = following ? remotes.get(following.id)?.rig.root.position ?? following.pose : position;
    cameraTarget.lerp(new THREE.Vector3(cameraFocus.x, cameraFocus.y + 1.15, cameraFocus.z), cameraInitialized ? 1 - Math.exp(-8 * dt) : 1);
    const goal = new THREE.Vector3(cameraTarget.x + Math.sin(yaw) * distance * Math.cos(pitch), cameraTarget.y + Math.sin(pitch) * distance, cameraTarget.z + Math.cos(yaw) * distance * Math.cos(pitch));
    camera.position.lerp(goal, cameraInitialized ? 1 - Math.exp(-10 * dt) : 1); camera.lookAt(cameraTarget); cameraInitialized = true;
    if (state.arena === "crystal") arena.animate(now, dt, reducedMotion.matches);
    else { scenery.animate(now, reducedMotion.matches); portal.animate(now, reducedMotion.matches); }
  }
  function animate(timestamp: number) {
    if (disposed) return;
    const dt = Math.min(.04, (timestamp - lastTime) / 1000 || .016); lastTime = timestamp;
    elapsed += dt;
    step(dt, elapsed); renderer.render(scene, camera); frame = requestAnimationFrame(animate);
  }
  frame = requestAnimationFrame(animate);
  return {
    setState(next: WorldSceneState) {
      const switched = state.selfId !== next.selfId;
      const modeChanged = Boolean(state.spectating) !== Boolean(next.spectating);
      const arenaChanged = (state.arena ?? "lobby") !== (next.arena ?? "lobby") || next.arena === "crystal" && state.crystal?.runId !== next.crystal?.runId;
      if (state.crystal?.runId !== next.crystal?.runId) actorPlaces.clear();
      if (switched || arenaChanged || modeChanged) actorPlaces.set(placeKey(state), { x: position.x, y: position.y, z: position.z, rotation, moving: false });
      activeObstacles = next.arena === "crystal" ? arena.obstacles : lobbyObstacles;
      scenery.root.visible = next.arena !== "crystal"; arena.root.visible = next.arena === "crystal";
      arena.update(next.crystal, next.selfId);
      if (arenaChanged || modeChanged) {
        const angle = (next.crystal?.participants.findIndex(player => player.id === next.selfId) ?? 0) * 2.4;
        const saved = switched || modeChanged ? actorPlaces.get(placeKey(next)) : undefined;
        position.set(saved?.x ?? (next.arena === "crystal" ? Math.sin(angle) * 5 : 0), saved?.y ?? 0, saved?.z ?? (next.arena === "crystal" ? Math.cos(angle) * 5 : 6));
        rotation = saved?.rotation ?? (next.arena === "crystal" ? angle : Math.PI);
        clearInput(); pointerup(); verticalSpeed = 0; grounded = true; moving = false; portalInside = false; cancelledEmoteAt = undefined; cameraInitialized = false;
        if (next.spectating && !saved) position.set(0, 0, 0);
        if (modeChanged) { pitch = next.spectating ? .85 : .46; distance = next.spectating ? 22 : 13; }
        if (!next.spectating) onMove({ x: position.x, y: position.y, z: position.z, rotation, moving: false }); lastSend = elapsed;
        scene.background = new THREE.Color(next.arena === "crystal" ? "#a8becb" : "#b8dce3");
        scene.fog = new THREE.Fog(next.arena === "crystal" ? "#a8becb" : "#b8dce3", 33, 95);
      } else if (switched || state.disabled && !next.disabled && !next.spectating) {
        const pose = next.initialPose ?? next.players.find(player => player.id === next.selfId)?.pose;
        clearInput(); pointerup(); verticalSpeed = 0; moving = false; cancelledEmoteAt = undefined;
        if (pose) { position.set(pose.x, pose.y, pose.z); rotation = pose.rotation; }
        grounded = position.y <= floorHeight(position.x, position.z, position.y);
        lastSend = elapsed;
      }
      if (state.character !== next.character) { scene.remove(local.root); local.dispose(); local = createAvatar(next.character); scene.add(local.root); }
      if (switched || state.name !== next.name || (state.gameHostId === state.selfId) !== (next.gameHostId === next.selfId)) { scene.remove(localLabel); disposeObject(localLabel); localLabel = makeTextSprite(`${next.name.slice(0, 20)} · you`, "#2c5c56", "#fff9df", 2.5, next.gameHostId === next.selfId); scene.add(localLabel); }
      if ((state.disabled || switched) && !next.disabled) container.focus({ preventScroll: true });
      if (!next.spectating && !switched && !arenaChanged && !state.disabled && next.disabled) onMove({ x: position.x, y: position.y, z: position.z, rotation, moving: false });
      if (next.disabled) clearInput();
      local.root.visible = localLabel.visible = shadow.visible = !next.spectating;
      state = next;
      const seen = new Set<string>();
      for (const player of next.players) {
        if (player.id === next.selfId) continue;
        seen.add(player.id); let remote = remotes.get(player.id);
        if (remote && remote.character !== player.character) { scene.remove(remote.rig.root); remote.rig.dispose(); remote.rig = createAvatar(player.character); remote.character = player.character; scene.add(remote.rig.root); remote.rig.root.position.set(player.pose.x, player.pose.y, player.pose.z); }
        if (!remote) {
          const rig = createAvatar(player.character); rig.root.position.set(player.pose.x, player.pose.y, player.pose.z); scene.add(rig.root);
          const label = makeTextSprite(player.name.slice(0, 22), "#38525a", "#fffdf0", 2.35, next.gameHostId === player.id); scene.add(label);
          remote = { rig, character: player.character, label, name: player.name, crowned: next.gameHostId === player.id, target: player }; remotes.set(player.id, remote);
        } else if (remote.name !== player.name || remote.crowned !== (next.gameHostId === player.id)) {
          scene.remove(remote.label); disposeObject(remote.label);
          remote.name = player.name; remote.crowned = next.gameHostId === player.id;
          remote.label = makeTextSprite(player.name.slice(0, 22), "#38525a", "#fffdf0", 2.35, remote.crowned); scene.add(remote.label);
        }
        remote.target = player;
      }
      for (const [id, remote] of remotes) if (!seen.has(id)) { scene.remove(remote.rig.root, remote.label); remote.rig.dispose(); disposeObject(remote.label); remotes.delete(id); }
    },
    interactMonster,
    stop() {
      clearInput(); verticalSpeed = 0; moving = false;
      position.y = floorHeight(position.x, position.z, position.y); grounded = true;
      local.root.position.copy(position);
      if (!state.spectating) onMove({ x: position.x, y: position.y, z: position.z, rotation, moving: false });
      lastSend = elapsed;
    },
    moveTouch(x: number, z: number) { touchX = x; touchZ = z; },
    jump() { if (state.spectating) return; jumpRequested = true; container.focus({ preventScroll: true }); },
    resetCamera() { yaw = .35; pitch = state.spectating ? .85 : .46; distance = state.spectating ? 22 : 13; container.focus({ preventScroll: true }); },
    dispose() {
      disposed = true; pickups?.dispose(); cancelAnimationFrame(frame); resizeObserver.disconnect();
      window.removeEventListener("keydown", keydown); window.removeEventListener("keyup", keyup); window.removeEventListener("blur", clearInput); document.removeEventListener("visibilitychange", clearInput);
      renderer.domElement.removeEventListener("pointerdown", pointerdown); renderer.domElement.removeEventListener("pointermove", pointermove); renderer.domElement.removeEventListener("pointerup", pointerclick); renderer.domElement.removeEventListener("pointercancel", pointerup); renderer.domElement.removeEventListener("lostpointercapture", pointerup);
      renderer.domElement.removeEventListener("wheel", wheel); renderer.domElement.removeEventListener("webglcontextlost", contextLost);
      disposeObject(scene); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
