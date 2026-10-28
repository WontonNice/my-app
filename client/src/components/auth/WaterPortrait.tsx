import { useEffect, useRef } from "react";

const vertexSource = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentSource = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D u_image;
uniform vec2 u_cover;
uniform float u_aspect;
uniform float u_time;
uniform vec4 u_drops[10];
varying vec2 v_uv;
void main() {
  vec2 displacement = vec2(0.0);
  float light = 0.0;
  for (int i = 0; i < 10; i++) {
    float age = u_time - u_drops[i].z;
    if (age >= 0.0 && age < 3.2 && u_drops[i].w > 0.0) {
      vec2 delta = (v_uv - u_drops[i].xy) * vec2(u_aspect, 1.0);
      float distance = length(delta);
      float ring = distance - age * 0.22;
      float envelope = exp(-ring * ring * 95.0) * exp(-age * 1.35);
      float wave = sin(ring * 68.0) * envelope * u_drops[i].w;
      vec2 direction = delta / max(distance, 0.006);
      displacement += direction * wave * 0.026 / vec2(u_aspect, 1.0);
      light += cos(ring * 68.0) * envelope * 0.025 * u_drops[i].w;
    }
  }
  vec2 uv = (v_uv + displacement - 0.5) * u_cover + 0.5;
  vec3 color = texture2D(u_image, clamp(uv, 0.002, 0.998)).rgb;
  gl_FragColor = vec4(color + light, 1.0);
}`;

/** Refraction is local and event-driven; no work runs after the water settles. */
export function WaterPortrait({ motionEnabled }: { motionEnabled: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;
    if (!canvas || !surface || !motionEnabled) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
    if (!gl) return;

    const shaders: WebGLShader[] = [];
    function compile(type: number, source: string) {
      const shader = gl!.createShader(type);
      if (!shader) throw new Error("Shader unavailable");
      shaders.push(shader);
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) throw new Error("Shader unsupported");
      return shader;
    }

    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const texture = gl.createTexture();
    if (!program || !buffer || !texture) {
      if (program) gl.deleteProgram(program);
      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      return;
    }
    try {
      gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Shader unsupported");
    } catch {
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      return;
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);

    const timeLocation = gl.getUniformLocation(program, "u_time");
    const dropsLocation = gl.getUniformLocation(program, "u_drops[0]");
    const coverLocation = gl.getUniformLocation(program, "u_cover");
    const aspectLocation = gl.getUniformLocation(program, "u_aspect");
    const drops = new Float32Array(40);
    const photo = new Image();
    let frame = 0;
    let ready = false;
    let disposed = false;
    let lastDrop = -100;
    let nextDrop = 0;
    let settleAt = 0;
    let inView = true;

    function draw(now: number) {
      frame = 0;
      if (!ready || disposed || document.hidden || !inView) return;
      gl!.uniform1f(timeLocation, now / 1000);
      gl!.uniform4fv(dropsLocation, drops);
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
      canvas!.style.opacity = "1";
      if (now < settleAt) frame = requestAnimationFrame(draw);
    }
    function resize() {
      if (!ready || disposed) return;
      const { width, height } = surface!.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.max(1, Math.round(width * scale));
      canvas!.height = Math.max(1, Math.round(height * scale));
      canvas!.style.opacity = "0";
      gl!.viewport(0, 0, canvas!.width, canvas!.height);
      const aspect = width / Math.max(height, 1);
      const imageAspect = photo.naturalWidth / photo.naturalHeight;
      gl!.uniform2f(coverLocation, Math.min(1, aspect / imageAspect), Math.min(1, imageAspect / aspect));
      gl!.uniform1f(aspectLocation, aspect);
      cancelAnimationFrame(frame);
      draw(performance.now());
    }
    function disturb(event: PointerEvent) {
      const now = performance.now();
      if (!ready || now - lastDrop < 65 || document.hidden) return;
      const rect = surface!.getBoundingClientRect();
      const index = (nextDrop++ % 10) * 4;
      drops.set([(event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height, now / 1000, event.type === "pointerdown" ? 1.4 : 0.85], index);
      lastDrop = now;
      settleAt = now + 3300;
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function visibilityChanged() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!document.hidden) draw(performance.now());
      else canvas!.style.opacity = "0";
    }
    function contextLost(event: Event) {
      event.preventDefault();
      ready = false;
      canvas!.style.opacity = "0";
      cancelAnimationFrame(frame);
    }
    photo.onload = () => {
      if (disposed) return;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, photo);
      ready = true;
      const now = performance.now();
      drops.set([0.5, 0.55, now / 1000, 1.1], 0);
      nextDrop = 1;
      settleAt = now + 3300;
      resize();
    };
    photo.src = "/auth/thinker.png";
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    const intersection = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      cancelAnimationFrame(frame);
      frame = 0;
      if (inView) draw(performance.now());
      else canvas.style.opacity = "0";
    });
    intersection.observe(surface);
    surface.addEventListener("pointermove", disturb, { passive: true });
    surface.addEventListener("pointerdown", disturb, { passive: true });
    document.addEventListener("visibilitychange", visibilityChanged);
    canvas.addEventListener("webglcontextlost", contextLost);
    return () => {
      disposed = true;
      ready = false;
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      surface.removeEventListener("pointermove", disturb);
      surface.removeEventListener("pointerdown", disturb);
      document.removeEventListener("visibilitychange", visibilityChanged);
      canvas.removeEventListener("webglcontextlost", contextLost);
      photo.onload = null;
      canvas.style.opacity = "0";
      shaders.forEach(shader => gl.deleteShader(shader));
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
    };
  }, [motionEnabled]);

  return (
    <div className="na-portrait" ref={surfaceRef}>
      <img src="/auth/thinker.png" alt="Auguste Rodin’s The Thinker in bronze against a blue sky" width="464" height="490" />
      <canvas ref={canvasRef} className="na-water" aria-hidden="true" />
      <div className="na-portrait-caption">
        <p>A little space<br />for a big idea.</p>
        <span>The Thinker · Auguste Rodin</span>
      </div>
    </div>
  );
}
