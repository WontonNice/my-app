import { useRef, useState, type PointerEvent } from "react";
import { correctionInkColors, type CorrectionStroke } from "../../../server/src/shared/examCorrections";

export function CorrectionCanvas({ value = [], onChange, readOnly = false }: {
  value?: CorrectionStroke[]; onChange?: (value: CorrectionStroke[]) => void; readOnly?: boolean;
}) {
  const [color, setColor] = useState<string>(correctionInkColors[0]);
  const [width, setWidth] = useState(4);
  const [erasing, setErasing] = useState(false);
  const [pending, setPending] = useState<CorrectionStroke | null>(null);
  const [history, setHistory] = useState<CorrectionStroke[][]>([]);
  const [redo, setRedo] = useState<CorrectionStroke[][]>([]);
  const stroke = useRef<CorrectionStroke | null>(null);
  const original = useRef(value);
  const erased = useRef(value);
  const pointCount = value.reduce((sum, line) => sum + line.points.length, 0);
  const full = value.length >= 150 || pointCount >= 6000;
  function commit(next: CorrectionStroke[], previous = value) {
    setHistory(current => [...current.slice(-19), previous]); setRedo([]); onChange?.(next);
  }
  function point(event: PointerEvent<SVGSVGElement>): [number, number] {
    const box = event.currentTarget.getBoundingClientRect();
    return [Math.round(Math.max(0, Math.min(900, (event.clientX - box.left) / box.width * 900)) * 10) / 10,
      Math.round(Math.max(0, Math.min(360, (event.clientY - box.top) / box.height * 360)) * 10) / 10];
  }
  function erase(at: [number, number]) {
    erased.current = erased.current.filter(line => !line.points.some(p => Math.hypot(p[0] - at[0], p[1] - at[1]) < 16));
    onChange?.(erased.current);
  }
  function start(event: PointerEvent<SVGSVGElement>) {
    if (readOnly || event.button !== 0 || full && !erasing) return;
    event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId);
    original.current = value; erased.current = value;
    stroke.current = { color, width, points: [point(event)] };
    if (erasing) erase(point(event)); else setPending(stroke.current);
  }
  function move(event: PointerEvent<SVGSVGElement>) {
    if (readOnly || !stroke.current) return;
    const at = point(event);
    if (erasing) { erase(at); return; }
    const previous = stroke.current.points.at(-1)!;
    if (Math.hypot(previous[0] - at[0], previous[1] - at[1]) < 2 || pointCount + stroke.current.points.length >= 6000) return;
    stroke.current = { ...stroke.current, points: [...stroke.current.points, at] }; setPending(stroke.current);
  }
  function finish() {
    if (!stroke.current) return;
    if (erasing) { if (erased.current.length !== original.current.length) commit(erased.current, original.current); }
    else commit([...original.current, stroke.current], original.current);
    stroke.current = null; setPending(null);
  }
  return <section className={`correction-canvas${readOnly ? " is-readonly" : ""}`} aria-label={readOnly ? "Submitted math drawing" : "Math working canvas"}>
    <header><div><strong>{readOnly ? "Student’s handwritten work" : "Draw your steps"}</strong><small>{readOnly ? "Saved with this correction" : "Use a mouse, pen, or touch. Your drawing is included when you submit."}</small></div>
      {!readOnly && <div className="correction-canvas-tools" role="toolbar" aria-label="Drawing tools">
        <button type="button" aria-pressed={!erasing} onClick={() => setErasing(false)}>Pen</button><button type="button" aria-pressed={erasing} onClick={() => setErasing(true)}>Eraser</button>
        {correctionInkColors.map(ink => <button type="button" key={ink} aria-label={`${ink === correctionInkColors[0] ? "Black" : ink === correctionInkColors[1] ? "Blue" : "Red"} ink`} aria-pressed={color === ink && !erasing} style={{ color: ink }} onClick={() => { setColor(ink); setErasing(false); }}>●</button>)}
        <select aria-label="Pen thickness" value={width} onChange={event => setWidth(Number(event.target.value))}><option value={2}>Fine</option><option value={4}>Medium</option><option value={6}>Thick</option></select>
        <button type="button" disabled={!history.length} onClick={() => { const previous = history.at(-1)!; setHistory(history.slice(0, -1)); setRedo(current => [...current, value]); onChange?.(previous); }}>Undo</button>
        <button type="button" disabled={!redo.length} onClick={() => { const next = redo.at(-1)!; setRedo(redo.slice(0, -1)); setHistory(current => [...current, value]); onChange?.(next); }}>Redo</button>
        <button type="button" disabled={!value.length} onClick={() => commit([])}>Clear</button>
      </div>}
    </header>
    <svg viewBox="0 0 900 360" role="img" aria-label={readOnly ? "Submitted handwritten math steps" : "Drawing area"} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} style={{ touchAction: readOnly ? "auto" : "none" }}>
      <title>{readOnly ? "Submitted handwritten math steps" : "Draw math steps using the pen tool"}</title>
      {[...value, ...(pending ? [pending] : [])].map((line, index) => line.points.length === 1
        ? <circle key={index} cx={line.points[0][0]} cy={line.points[0][1]} r={line.width / 2} fill={line.color} />
        : <polyline key={index} points={line.points.map(p => p.join(",")).join(" ")} fill="none" stroke={line.color} strokeWidth={line.width} strokeLinecap="round" strokeLinejoin="round" />)}
    </svg>
    {!readOnly && full && <p role="status">Canvas limit reached. Erase a stroke or undo to keep working.</p>}
  </section>;
}
