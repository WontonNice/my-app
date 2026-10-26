import { useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, type Ref } from "react";
import * as THREE from "three";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { createAvatar } from "./avatars";
import { createWorldScene, type WorldSceneState, type WorldSceneInteractions } from "./worldRenderer";
import type { WorldCharacterId, WorldPose } from "../../../../../server/src/shared/gameWorld";
import "./world-scene.css";

const thumbnails = new Map<WorldCharacterId, string>();
let thumbnailRenderer: THREE.WebGLRenderer | undefined;
let thumbnailCleanup: number | undefined;
function thumbnail(character: WorldCharacterId) {
  if (thumbnails.has(character)) return thumbnails.get(character)!;
  window.clearTimeout(thumbnailCleanup);
  thumbnailRenderer ??= new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  const renderer = thumbnailRenderer;
  renderer.setSize(240, 260); renderer.setPixelRatio(1); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1; renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene(); scene.add(new THREE.HemisphereLight("#fff9ed", "#b9c7b4", 1.8));
  const light = new THREE.DirectionalLight("#fff2d7", 2.3); light.position.set(-3, 6, 5); scene.add(light);
  const camera = new THREE.PerspectiveCamera(30, 240 / 260, .1, 20); camera.position.set(2.1, 1.8, 4.8); camera.lookAt(0, 1.2, 0);
  const avatar = createAvatar(character); avatar.root.rotation.y = .1; scene.add(avatar.root);
  renderer.render(scene, camera); const result = renderer.domElement.toDataURL("image/png"); thumbnails.set(character, result); avatar.dispose();
  thumbnailCleanup = window.setTimeout(() => { thumbnailRenderer?.dispose(); thumbnailRenderer?.forceContextLoss(); thumbnailRenderer = undefined; }, 100);
  return result;
}

export function AvatarPreview({ character }: { character: WorldCharacterId }) {
  const [url, setUrl] = useState<string>(() => thumbnails.get(character) ?? "");
  useEffect(() => { if (character === "le-sunshine") return; try { setUrl(thumbnail(character)); } catch { setUrl(""); } }, [character]);
  if (character === "le-sunshine") return <img className="world-avatar-preview" src="/world-characters/le-sunshine.png" alt="" aria-hidden="true" draggable={false} />;
  return url ? <img className="world-avatar-preview" src={url} alt="" aria-hidden="true" draggable={false} /> : <span className="world-avatar-fallback" aria-hidden="true">{{ astronaut: "🚀", frog: "🐸", mushroom: "🍄", alien: "👽", wizard: "🪄", duck: "🐤", "tung-tung": "🪵", "le-sunshine": "☀️", mike: "👁️", pepe: "🐸" }[character]}</span>;
}

export type WorldSceneHandle = { stop: () => void; interactMonster: (id: string) => void };
export type WorldSceneProps = WorldSceneState & WorldSceneInteractions & { onMove: (pose: WorldPose) => void; onInteract?: () => void; onCancelEmote?: () => void; controlsRef?: Ref<WorldSceneHandle> };
export function WorldScene(props: WorldSceneProps) {
  const host = useRef<HTMLDivElement>(null), runtime = useRef<ReturnType<typeof createWorldScene> | null>(null), current = useRef(props);
  const [error, setError] = useState("");
  current.current = props;
  useImperativeHandle(props.controlsRef, () => ({ stop: () => runtime.current?.stop(), interactMonster: id => runtime.current?.interactMonster(id) }), []);
  useEffect(() => {
    if (!host.current) return;
    try {
      runtime.current = createWorldScene(host.current, pose => current.current.onMove(pose), () => current.current.onInteract?.(), setError, () => current.current.onCancelEmote?.(), {
        onPortalEnter: () => current.current.onPortalEnter?.(),
        onMonsterClick: id => current.current.onMonsterClick?.(id),
        onItemPickup: (id, position) => current.current.onItemPickup?.(id, position) ?? Promise.resolve(false),
        onHint: message => current.current.onHint?.(message),
      });
      runtime.current.setState(current.current);
    } catch {
      setError("This device could not start the 3D view. Enable hardware acceleration or try an up-to-date browser with WebGL support.");
    }
    return () => { runtime.current?.dispose(); runtime.current = null; };
  }, []);
  useLayoutEffect(() => { runtime.current?.setState(props); }, [props]);
  return <div className="world-scene-shell">
    <div ref={host} className="world-scene-canvas" tabIndex={0} role="application" aria-label={props.spectating ? "Spectator camera. W A S D to pan, drag to look around, scroll to zoom." : "3D classroom world. Move with W A S D or arrow keys. Space to jump. Drag to look around. Walk over your labeled item to collect it. E to interact with a nearby monster or portal, or wave."} />
    {error && <div className="world-graphics-error" role="alert"><strong>The 3D view is unavailable</strong><p>{error}</p></div>}
    {!error && <button type="button" className="world-camera-reset" aria-label="Reset camera" title="Reset camera" onClick={() => runtime.current?.resetCamera()}><RotateCcw size={16} /></button>}
    {!props.disabled && !error && <div className="world-touch-controls" aria-label="Touch movement controls">
      <div className="world-direction-pad">{[{ x: 0, z: -1, label: "Move forward", icon: ArrowUp, className: "up" }, { x: -1, z: 0, label: "Move left", icon: ArrowLeft, className: "left" }, { x: 1, z: 0, label: "Move right", icon: ArrowRight, className: "right" }, { x: 0, z: 1, label: "Move backward", icon: ArrowDown, className: "down" }].map(({ x, z, label, icon: Icon, className }) => <button type="button" key={label} aria-label={label} className={className} onPointerDown={event => { event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); runtime.current?.moveTouch(x, z); }} onPointerUp={() => runtime.current?.moveTouch(0, 0)} onPointerCancel={() => runtime.current?.moveTouch(0, 0)} onLostPointerCapture={() => runtime.current?.moveTouch(0, 0)} onContextMenu={event => event.preventDefault()}><Icon size={22} /></button>)}</div>
      {!props.spectating && <button className="world-jump-touch" type="button" onPointerDown={event => { event.preventDefault(); runtime.current?.jump(); }} aria-label="Jump">Jump</button>}
    </div>}
  </div>;
}
