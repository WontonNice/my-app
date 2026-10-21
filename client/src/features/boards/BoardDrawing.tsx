import { useRef, useState, useSyncExternalStore, type PointerEvent } from "react";
import { Panel, ViewportPortal, useReactFlow, useStore, useViewport } from "@xyflow/react";
import { Pencil, Eraser, Undo2, Redo2 } from "lucide-react";
import type { BoardStroke } from "../../../../server/src/shared/boards";
import type { BoardSession } from "./session";
import { boardStrokeHit, boardStrokePath } from "./drawing";

type DrawingTool = "pen" | "eraser";
const colors = [
  ["Black", "#182333"], ["Red", "#c43c3c"], ["Orange", "#d77916"], ["Green", "#27844f"],
  ["Blue", "#287ac4"], ["Purple", "#8052b8"], ["Pink", "#c34b90"], ["White", "#ffffff"],
];

function DrawingSurface({ session, tool, color, width, strokes }: { session: BoardSession; tool: DrawingTool; color: string; width: number; strokes: BoardStroke[] }) {
  const flow = useReactFlow(), viewport = useViewport();
  const canvasWidth = useStore(state => state.width), canvasHeight = useStore(state => state.height);
  const gesture = useRef<{ pointerId: number; stroke: BoardStroke; erased: Set<string> } | null>(null);
  const [draft, setDraft] = useState<BoardStroke | null>(null), [erased, setErased] = useState<Set<string>>(new Set());
  const allowed = () => {
    const current = session.snapshot();
    return current.ready && current.board.role !== "viewer" && !current.board.archivedAt && current.status !== "Recovery needed" && session.doc.getMap("settings").get("drawingEnabled") !== false;
  };
  function sample(event: PointerEvent<SVGRectElement>) {
    const current = gesture.current;
    if (!current || current.pointerId !== event.pointerId) return;
    const point = flow.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    if (tool === "eraser") {
      for (const stroke of strokes) if (boardStrokeHit(stroke, point, 10 / viewport.zoom)) current.erased.add(stroke.id);
      setErased(new Set(current.erased));
    } else {
      const last = current.stroke.points.at(-1);
      if (current.stroke.points.length < 4000 && (!last || Math.hypot(point.x - last.x, point.y - last.y) >= 1 / viewport.zoom)) current.stroke.points.push(point);
      setDraft({ ...current.stroke, points: [...current.stroke.points] });
    }
  }
  function cancel() { gesture.current = null; setDraft(null); setErased(new Set()); }
  return <ViewportPortal><svg className={`board-drawing-layer board-drawing-input is-${tool}`} width="1" height="1" aria-label="Drawing surface">
    {/* Erased strokes are covered only in the preview; the whole gesture commits together. */}
    <style>{[...erased].map(id => `[data-board-stroke="${id}"] { visibility: hidden; }`).join("\n")}</style>
    {draft && <path d={boardStrokePath(draft)} stroke={draft.color} strokeWidth={draft.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    <rect x={-viewport.x / viewport.zoom} y={-viewport.y / viewport.zoom} width={canvasWidth / viewport.zoom} height={canvasHeight / viewport.zoom} fill="transparent" pointerEvents="all" onPointerDown={event => {
      if (event.button !== 0 || !event.isPrimary || !allowed()) return;
      event.preventDefault(); event.stopPropagation(); event.currentTarget.setPointerCapture(event.pointerId);
      gesture.current = { pointerId: event.pointerId, stroke: { id: crypto.randomUUID(), color, width, points: [] }, erased: new Set() };
      sample(event);
    }} onPointerMove={sample} onPointerUp={event => {
      const current = gesture.current; if (!current || current.pointerId !== event.pointerId) return;
      event.preventDefault(); event.stopPropagation(); sample(event);
      if (allowed()) session.transaction(() => {
        const drawings = session.doc.getMap<BoardStroke>("drawings");
        if (tool === "eraser") current.erased.forEach(id => drawings.delete(id));
        else drawings.set(current.stroke.id, current.stroke);
      });
      cancel(); event.currentTarget.releasePointerCapture(event.pointerId);
    }} onPointerCancel={cancel} onLostPointerCapture={cancel} onClick={event => event.stopPropagation()} onDoubleClick={event => event.stopPropagation()} onContextMenu={event => { event.preventDefault(); event.stopPropagation(); }} />
  </svg></ViewportPortal>;
}

export function BoardDrawing({ session, strokes, enabled, editable, tool, onToolChange, showTools }: {
  session: BoardSession; strokes: BoardStroke[]; enabled: boolean; editable: boolean; tool: DrawingTool | null; onToolChange: (tool: DrawingTool | null) => void; showTools: boolean;
}) {
  const state = useSyncExternalStore(session.subscribe, session.snapshot);
  const [color, setColor] = useState(colors[0][1]), [width, setWidth] = useState(4);
  const canDraw = editable && enabled, active = canDraw ? tool : null;
  return <>
    <ViewportPortal><svg className="board-drawing-layer" width="1" height="1" aria-label="Shared drawings">{strokes.map(stroke => <path key={stroke.id} data-board-stroke={stroke.id} d={boardStrokePath(stroke)} stroke={stroke.color} strokeWidth={stroke.width} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}</svg></ViewportPortal>
    {active && <DrawingSurface key={active} session={session} tool={active} color={color} width={width} strokes={strokes} />}
    {showTools && <Panel position="top-left" className="board-drawing-tools" aria-label="Drawing tools">
      <div className="board-drawing-actions"><button aria-label="Draw" title="Draw on the board" aria-pressed={active === "pen"} disabled={!canDraw} onClick={() => onToolChange(tool === "pen" ? null : "pen")}><Pencil size={16} />Draw</button><button aria-label="Erase drawing" title="Erase a whole stroke" aria-pressed={active === "eraser"} disabled={!canDraw} onClick={() => onToolChange(tool === "eraser" ? null : "eraser")}><Eraser size={16} /></button></div>
      {active && <>
        <div className="board-drawing-colors" aria-label="Pen colors">{colors.map(([name, value]) => <button key={name} aria-label={`${name} pen`} title={name} aria-pressed={color === value} style={{ backgroundColor: value }} onClick={() => { setColor(value); onToolChange("pen"); }} />)}</div>
        <label className="board-drawing-size">Stroke size<select aria-label="Stroke size" value={width} onChange={event => setWidth(Number(event.target.value))}><option value={2}>Thin</option><option value={4}>Medium</option><option value={8}>Thick</option></select></label>
        <div className="board-drawing-actions"><button aria-label="Undo drawing" title="Undo drawing" disabled={!state.canUndoDrawing} onClick={() => session.drawingUndo.undo()}><Undo2 size={15} /></button><button aria-label="Redo drawing" title="Redo drawing" disabled={!state.canRedoDrawing} onClick={() => session.drawingUndo.redo()}><Redo2 size={15} /></button><button onClick={() => onToolChange(null)}>Done</button></div>
      </>}
      {state.board.canControlDrawing && <button className="board-drawing-toggle" disabled={!editable || state.status !== "Saved"} aria-pressed={enabled} title="Enable or disable drawing for everyone on this board" onClick={() => { onToolChange(null); session.transaction(() => session.doc.getMap("settings").set("drawingEnabled", !enabled)); }}>{enabled ? "Disable drawing" : "Enable drawing"}</button>}
      {!enabled && <small role="status">Drawing disabled by teacher</small>}
    </Panel>}
  </>;
}
