import { useEffect, useRef, type RefObject } from "react";
import walkPoses from "./deerWalkFrames.json";
import idlePoses from "./deerIdleFrames.json";

const FRAME_INTERVAL_MS = 1000 / 24;

// Bounds of the six hand-painted poses in the locally generated sprite sheet.
const poses = [
  { x: 28, width: 307 }, { x: 352, width: 290 }, { x: 633, width: 385 },
  { x: 1019, width: 449 }, { x: 1478, width: 309 }, { x: 1799, width: 363 },
];

function Deer({ stage, index, motionEnabled }: {
  stage: RefObject<HTMLDivElement | null>;
  index: number;
  motionEnabled: boolean;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const startRun = useRef<() => void>(() => {});

  useEffect(() => {
    const element = button.current;
    const paint = canvas.current;
    const field = stage.current;
    if (!element || !paint || !field) return;
    const context = paint.getContext("2d");
    if (!context) return;
    const sprite = new Image();
    const walkSprite = new Image();
    const idleSprite = new Image();
    let idleLoaded = false;
    let walkLoaded = false;
    let loaded = false;
    let disposed = false;
    let frame = 0;
    let lastTime = 0;
    let runUntil = 0;
    let gait = 0;
    let idleTime = index * 0.65;
    let lastPaint = 0;
    let resting = true;
    let phaseRemaining = 2 + index * 2 + Math.random() * 3;
    let walkDuration = 0;
    const strollSpeed = 3 + index * 0.4;
    let inView = false;
    const form = field.closest(".na-shell")?.querySelector("form");
    let direction = index === 0 ? 1 : -1;
    const current = { x: index === 0 ? 0.2 : 0.73, y: index === 0 ? 0.86 : 0.84 };
    let width = field.clientWidth;
    let height = field.clientHeight;
    let artHeight = height;
    let deerWidth = element.offsetWidth;
    let deerHeight = element.offsetHeight;

    function draw(poseIndex = 0, walking = false, chewing = false) {
      if (!loaded || disposed) return;
      const size = index === 0 ? 1 : 0.85;
      context!.clearRect(0, 0, 100, 78);
      context!.save();
      context!.translate(50, 0);
      context!.scale(direction, 1);
      if (idleLoaded && (walking || poseIndex === 0)) {
        const base = idlePoses[0];
        const height = 66 * size;
        const width = base.width / base.height * height;
        const top = 78 - height;
        if (walking && walkLoaded) {
          // Keep one registered torso instead of morphing the head between poses.
          // The separate lower-body layer carries the full reach / plant / lift cycle.
          const legTop = top + height * 0.60;
          context!.save();
          context!.beginPath();
          context!.rect(-50, 0, 100, legTop);
          context!.clip();
          context!.drawImage(idleSprite, base.x, base.y, base.width, base.height, -width / 2, top, width, height);
          context!.restore();
          const pose = walkPoses[Math.floor(gait) % walkPoses.length];
          context!.save();
          context!.beginPath();
          context!.rect(-50, legTop, 100, 78 - legTop);
          context!.clip();
          context!.drawImage(walkSprite, pose.x, pose.y, pose.width, pose.height, -width * 0.54, top, width * 1.08, height);
          context!.restore();
        } else {
          context!.drawImage(idleSprite, base.x, base.y, base.width, base.height, -width / 2, top, width, height);
          // Only the mouth patch changes; planted hooves and the torso stay still.
          const chewPhase = idleTime % 4.8;
          const pose = idlePoses[chewing && chewPhase < 3 ? Math.floor(chewPhase * 8) % idlePoses.length : 0];
          context!.save();
          context!.beginPath();
          const mouthX = -width / 2 + width * 0.76;
          const mouthY = top + height * 0.26;
          context!.rect(mouthX, mouthY, width * 0.25, height * 0.11);
          context!.clip();
          context!.clearRect(mouthX, mouthY, width * 0.25, height * 0.11);
          context!.drawImage(idleSprite, pose.x, pose.y, pose.width, pose.height, -width / 2, top, width, height);
          context!.restore();
        }
      } else {
        const pose = poses[poseIndex];
        const ratio = 0.19 * size;
        context!.drawImage(sprite, pose.x, 180, pose.width, 350, -pose.width * ratio / 2, 78 - 350 * ratio, pose.width * ratio, 350 * ratio);
      }
      context!.restore();
    }
    function position() {
      const x = current.x * (width - deerWidth);
      const y = height - artHeight + current.y * artHeight - deerHeight;
      element!.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      runUntil = 0;
      element!.dataset.running = "false";
      element!.dataset.behavior = "resting";
      draw();
    }
    function rest(seconds = 5 + Math.random() * 9) {
      resting = true;
      phaseRemaining = seconds;
      gait = 0;
      lastTime = 0;
      element!.dataset.running = "false";
      element!.dataset.behavior = "resting";
      draw();
      resume();
    }
    function animate(now: number) {
      frame = 0;
      if (disposed || !loaded || document.hidden || !inView || !motionEnabled || form?.contains(document.activeElement)) { stop(); return; }
      const elapsed = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      const running = now < runUntil;
      if (runUntil && !running) { runUntil = 0; rest(3 + Math.random() * 4); return; }
      if (resting && !running) {
        phaseRemaining -= elapsed;
        idleTime += elapsed;
        element!.dataset.behavior = "chewing";
        if (now - lastPaint >= FRAME_INTERVAL_MS) {
          lastPaint = now - (now - lastPaint) % FRAME_INTERVAL_MS;
          draw(0, false, true);
        }
        if (phaseRemaining <= 0) {
          resting = false;
          phaseRemaining = 4 + Math.random() * 4;
          walkDuration = phaseRemaining;
          gait = 0;
          if (Math.random() < 0.25) direction *= -1;
        }
        frame = requestAnimationFrame(animate);
        return;
      }
      element!.dataset.running = String(running);
      element!.dataset.behavior = running ? "running" : "walking";
      // About one quarter of the former speed, independent of viewport width.
      const pace = Math.min(1, Math.max(0, (walkDuration - phaseRemaining) / 0.5), phaseRemaining / 0.75);
      current.x += direction * (running ? 150 : strollSpeed * pace) * elapsed / Math.max(width - deerWidth, 1);
      const atEdge = current.x > 0.92 || current.x < 0.04;
      if (current.x > 0.92) { current.x = 0.92; direction = -1; }
      if (current.x < 0.04) { current.x = 0.04; direction = 1; }
      gait += elapsed * (running ? 10 : 8 * pace);
      current.y = 0.87 + Math.sin(current.x * Math.PI * 2 + index) * 0.018;
      position();
      if (!running) {
        phaseRemaining -= elapsed;
        if (phaseRemaining <= 0 || atEdge) { rest(); return; }
      }
      if (now - lastPaint >= FRAME_INTERVAL_MS) {
        lastPaint = now - (now - lastPaint) % FRAME_INTERVAL_MS;
        draw(running ? 1 + Math.floor(gait) % 5 : 0, !running);
      }
      frame = requestAnimationFrame(animate);
    }
    function resume() {
      if (frame || !loaded || disposed || document.hidden || !inView || !motionEnabled || form?.contains(document.activeElement)) return;
      frame = requestAnimationFrame(animate);
    }
    startRun.current = () => {
      if (!loaded) return;
      if (!motionEnabled) { direction *= -1; draw(); return; }
      resting = false;
      runUntil = performance.now() + 1000;
      element.dataset.running = "true";
      resume();
    };
    function resize() {
      width = field!.clientWidth;
      height = field!.clientHeight;
      artHeight = field!.querySelector(".na-meadow-art")?.getBoundingClientRect().height || height;
      deerWidth = element!.offsetWidth;
      deerHeight = element!.offsetHeight;
      position();
    }
    function onVisibility() { if (document.hidden) stop(); else resume(); }
    function onFormFocus() { stop(); }
    function onFormBlur() { requestAnimationFrame(resume); }
    sprite.onload = () => { if (!disposed) { loaded = true; draw(); resume(); } };
    sprite.src = "/auth/deer-sprite.webp";
    walkSprite.onload = () => { if (!disposed) { walkLoaded = true; draw(); } };
    walkSprite.src = "/auth/deer-walk.webp";
    idleSprite.onload = () => { if (!disposed) { idleLoaded = true; draw(); } };
    idleSprite.src = "/auth/deer-idle.webp";
    const observer = new ResizeObserver(resize);
    observer.observe(field);
    const intersection = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; if (inView) resume(); else stop(); });
    intersection.observe(element);
    document.addEventListener("visibilitychange", onVisibility);
    form?.addEventListener("focusin", onFormFocus);
    form?.addEventListener("focusout", onFormBlur);
    resize();
    return () => {
      stop();
      disposed = true;
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      form?.removeEventListener("focusin", onFormFocus);
      form?.removeEventListener("focusout", onFormBlur);
      sprite.onload = null;
      walkSprite.onload = null;
      idleSprite.onload = null;
      startRun.current = () => {};
    };
  }, [index, motionEnabled, stage]);

  return (
    <button ref={button} type="button" className="na-deer" aria-label={motionEnabled ? `Let deer ${index + 1} run` : `Greet deer ${index + 1}`} onClick={() => startRun.current()}>
      <canvas ref={canvas} width="100" height="78" aria-hidden="true" />
    </button>
  );
}

export function MeadowScene({ motionEnabled }: { motionEnabled: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <div className="na-meadow" ref={stage}>
      <img className="na-meadow-art" src="/auth/meadow.webp" alt="An illustrated green fairway winding between pine trees and pale sand dunes" width="1536" height="1024" />
      {[0, 1].map(index => <Deer key={index} index={index} stage={stage} motionEnabled={motionEnabled} />)}
    </div>
  );
}
