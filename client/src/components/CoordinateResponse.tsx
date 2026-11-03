import { useId, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import type { CoordinatePoint, CoordinateShape, ExamQuestion } from '../../../server/src/shared/examTypes';
import type { SelectedAnswer } from '../../../server/src/shared/examGrading';
import { clippedCoordinateLine, coordinateInBounds, coordinatePlacements, coordinatePoints } from '../../../server/src/shared/coordinateResponse';
import './CoordinateResponse.css';

type Drag = { pointerId: number; id: string; index?: number; shape?: CoordinateShape; offset?: CoordinatePoint; moved: boolean };
export function CoordinateResponse({ question, answer, onChange, readOnly = false }: {
  question: ExamQuestion; answer?: SelectedAnswer; onChange?: (answer: Record<string, string>) => void; readOnly?: boolean;
}) {
  const c = question.coordinateResponse!;
  const value = coordinatePlacements(answer), svg = useRef<SVGSVGElement>(null), drag = useRef<Drag | undefined>(undefined);
  const [active, setActive] = useState(c.tools[0]?.id ?? c.shapes?.[0]?.id ?? '');
  const [focusPoint, setFocusPoint] = useState<CoordinatePoint>({ x: Math.max(c.xMin,0), y: Math.max(c.yMin,0) });
  const [notice,setNotice] = useState('');
  const uid = useId().replace(/:/g,'');
  const sx = c.plot.width/(c.xMax-c.xMin), sy = c.plot.height/(c.yMax-c.yMin);
  const px = (x: number) => c.plot.left + (x-c.xMin)*sx;
  const py = (y: number) => c.plot.top + (c.yMax-y)*sy;
  const emit = (next: Record<string,string>) => { if (!readOnly) onChange?.(next); };
  const snap = (p: CoordinatePoint) => ({ x: +Math.min(c.xMax,Math.max(c.xMin,c.xMin+Math.round((p.x-c.xMin)/c.xSnap)*c.xSnap)).toFixed(8), y: +Math.min(c.yMax,Math.max(c.yMin,c.yMin+Math.round((p.y-c.yMin)/c.ySnap)*c.ySnap)).toFixed(8) });
  function pointerPoint(event: PointerEvent): CoordinatePoint | undefined {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    return { x: c.xMin+((event.clientX-box.left)*c.width/box.width-c.plot.left)/sx, y: c.yMax-((event.clientY-box.top)*c.height/box.height-c.plot.top)/sy };
  }
  function putPoint(id: string, p: CoordinatePoint, index?: number) {
    const tool = c.tools.find(t=>t.id===id); if (!tool) return;
    const points = coordinatePoints(answer,id), point = snap(p);
    if (tool.kind==='point') emit({...value,[id]:JSON.stringify([point])});
    else {
      const next = [...points];
      const target = index ?? (next.length<2 ? next.length : 1);
      if (next.some((q,i)=>i!==target && q.x===point.x && q.y===point.y)) return;
      next[target]=point; emit({...value,[id]:JSON.stringify(next)});
    }
    setNotice(`${tool.label}: (${point.x}, ${point.y}).`);
  }
  function putShape(shape: CoordinateShape, p: CoordinatePoint) {
    const anchor = snap(p);
    if (shape.vertices.every(v=>coordinateInBounds(c,{x:anchor.x+v.x,y:anchor.y+v.y}))) {
      emit({shape:shape.id,anchor:JSON.stringify([anchor])});
      setNotice(`Triangle placed at (${anchor.x}, ${anchor.y}).`);
    }
  }
  function start(event: PointerEvent<SVGElement>, id: string, index?: number, shape?: CoordinateShape, anchor?: CoordinatePoint) {
    if (readOnly || event.button!==0 || !event.isPrimary) return;
    event.preventDefault(); event.stopPropagation(); setActive(id);
    const p=pointerPoint(event);
    drag.current={pointerId:event.pointerId,id,index,shape,moved:false,offset:p&&anchor?{x:p.x-anchor.x,y:p.y-anchor.y}:undefined};
    svg.current?.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent<SVGSVGElement>) {
    const d=drag.current,p=pointerPoint(event); if(!d||d.pointerId!==event.pointerId||!p)return;
    d.moved=true;
    if(d.shape) putShape(d.shape,{x:p.x-(d.offset?.x??0),y:p.y-(d.offset?.y??0)});
    else putPoint(d.id,p,d.index);
  }
  function end(event: PointerEvent<SVGSVGElement>) {
    const d=drag.current,p=pointerPoint(event); if(!d||d.pointerId!==event.pointerId)return;
    if(d.shape&&p&&d.moved) {
      if(coordinateInBounds(c,p))putShape(d.shape,{x:p.x-(d.offset?.x??0),y:p.y-(d.offset?.y??0)});
      else if(value.shape===d.shape.id)emit({});
    }
    drag.current=undefined; if(svg.current?.hasPointerCapture(event.pointerId))svg.current.releasePointerCapture(event.pointerId);
  }
  function remove(id: string, index?: number) {
    if(c.shapes?.length) {emit({});return;}
    const next={...value},points=coordinatePoints(answer,id); if(index==null)delete next[id];else {points.splice(index,1);if(points.length)next[id]=JSON.stringify(points);else delete next[id];} emit(next);
  }
  function keyPoint(event: KeyboardEvent<SVGElement>, id: string, index: number) {
    if(readOnly)return;
    if(['Backspace','Delete'].includes(event.key)){event.preventDefault();remove(id,index);return;}
    const p=coordinatePoints(answer,id)[index];if(!p)return;
    const delta = keyDelta(event.key); if(delta){event.preventDefault();putPoint(id,{x:p.x+delta.x,y:p.y+delta.y},index);}
  }
  function keyDelta(key: string) {
    return ({ArrowLeft:{x:-c.xSnap,y:0},ArrowRight:{x:c.xSnap,y:0},ArrowUp:{x:0,y:c.ySnap},ArrowDown:{x:0,y:-c.ySnap}} as Record<string,CoordinatePoint>)[key];
  }
  const anchor=coordinatePoints(answer,'anchor')[0];
  function shapeMarkup(shape: CoordinateShape, placed: boolean) {
    const points=shape.vertices.map(v=>({x:placed?px(v.x+anchor.x):shape.bankX+v.x*sx,y:placed?py(v.y+anchor.y):shape.bankY-v.y*sy}));
    const cx=points.reduce((n,p)=>n+p.x,0)/points.length,cy=points.reduce((n,p)=>n+p.y,0)/points.length;
    return <g key={`${shape.id}-${placed}`} role="button" tabIndex={readOnly?-1:0} aria-label={`${placed?'Placed triangle':'Triangle orientation '+((c.shapes?.indexOf(shape)??0)+1)}. ${shape.vertices.map(v=>v.label).join(', ')}. Drag to position; arrow keys move a placed triangle; Delete returns it.`}
      aria-pressed={active===shape.id} className="coordinate-shape" onPointerDown={event=>{const p=pointerPoint(event);const bankAnchor={x:c.xMin+(shape.bankX-c.plot.left)/sx,y:c.yMax-(shape.bankY-c.plot.top)/sy};start(event,shape.id,undefined,shape,placed?anchor:p?bankAnchor:undefined);}}
      onKeyDown={event=>{if(readOnly)return;const d=keyDelta(event.key);if(placed&&d){event.preventDefault();putShape(shape,{x:anchor.x+d.x,y:anchor.y+d.y});}else if(['Delete','Backspace'].includes(event.key)&&placed){event.preventDefault();remove(shape.id);}else if(['Enter',' '].includes(event.key)){event.preventDefault();setActive(shape.id);svg.current?.querySelector<SVGRectElement>('[data-coordinate-grid]')?.focus();}}}>
      <polygon points={points.map(p=>`${p.x},${p.y}`).join(' ')} fill="#0000ff" stroke="#000" strokeWidth="2" />
      {points.map((p,i)=><text key={i} x={p.x+(p.x<cx?-11:11)} y={p.y+(p.y<cy?-11.5:16)} textAnchor="middle" fontSize="16" fontFamily="Arial" fill="#000" stroke="#fff" strokeWidth="4" paintOrder="stroke">{shape.vertices[i].label}</text>)}
    </g>;
  }
  return <div className={`coordinate-response${c.tools.length>1?' has-tools':''}`} style={{width:c.width+(c.tools.length>1?208:0),maxWidth:'calc(100vw - 80px)'}}>
    <span className="sr-only" aria-live="polite">{notice}</span>
    {c.tools.length>1&&<div className="coordinate-tools" role="toolbar" aria-label="Graph tools">{c.tools.map(t=><div className={`coordinate-tool${active===t.id?' is-active':''}`} key={t.id} style={{'--tool-color':t.color} as React.CSSProperties}>
      <button type="button" disabled={readOnly} aria-pressed={active===t.id} onClick={()=>setActive(t.id)}>{t.label}</button>
    </div>)}</div>}
    <div className="coordinate-canvas" style={{width:c.width,maxWidth:'100%'}}>
      {c.title&&<h4>{c.title}</h4>}
      <svg ref={svg} viewBox={`0 0 ${c.width} ${c.height}`} width={c.width} height={c.height} role="group" aria-label="Interactive coordinate plane" onPointerMove={move} onPointerUp={end} onPointerCancel={()=>{drag.current=undefined;}}>
        <defs>{c.tools.map(t=><marker key={t.id} id={`${uid}-${t.id}`} orient="auto-start-reverse" markerWidth="12" markerHeight="12" refX="6" refY="6" markerUnits="userSpaceOnUse"><path d="M0,0 L12,6 L0,12 Z" fill={t.color}/></marker>)}</defs>
        {c.background?<image href={c.background.src} width={c.width} height={c.height} />:<g>
          <rect x={c.plot.left} y={c.plot.top} width={c.plot.width} height={c.plot.height} fill="white" stroke="black" strokeWidth="2"/>
          {Array.from({length:Math.floor((c.xMax-c.xMin)/c.xStep)+1},(_,i)=>c.xMin+i*c.xStep).map(x=><g key={`x${x}`}><path d={`M${px(x)},${c.plot.top}v${c.plot.height}`} stroke="#888"/><text x={px(x)} y={py(Math.max(c.yMin,0))+13} fontSize="9" textAnchor="middle">{x}</text></g>)}
          {Array.from({length:Math.floor((c.yMax-c.yMin)/c.yStep)+1},(_,i)=>c.yMin+i*c.yStep).map(y=><g key={`y${y}`}><path d={`M${c.plot.left},${py(y)}h${c.plot.width}`} stroke="#888"/><text x={px(Math.max(c.xMin,0))-5} y={py(y)+3} fontSize="9" textAnchor="end">{y}</text></g>)}
        </g>}
        <rect data-coordinate-grid tabIndex={readOnly?-1:0} role="button" aria-label="Plot on the coordinate grid. Use arrow keys to choose a location and Enter to plot." x={c.plot.left} y={c.plot.top} width={c.plot.width} height={c.plot.height} fill="transparent" onPointerDown={event=>{
          if(readOnly)return;const p=pointerPoint(event);if(!p)return;setFocusPoint(snap(p));const shape=c.shapes?.find(s=>s.id===active);if(shape)putShape(shape,p);else putPoint(active,p);
        }} onKeyDown={event=>{if(readOnly)return;const delta=keyDelta(event.key);if(delta){event.preventDefault();setFocusPoint(snap({x:focusPoint.x+delta.x,y:focusPoint.y+delta.y}));setNotice(`Cursor (${snap({x:focusPoint.x+delta.x,y:focusPoint.y+delta.y}).x}, ${snap({x:focusPoint.x+delta.x,y:focusPoint.y+delta.y}).y}).`);}else if(['Enter',' '].includes(event.key)){event.preventDefault();const shape=c.shapes?.find(s=>s.id===active);if(shape)putShape(shape,focusPoint);else putPoint(active,focusPoint);}else if(['Delete','Backspace'].includes(event.key)){event.preventDefault();remove(active);}}}/>
        {c.tools.map(t=>{const pts=coordinatePoints(answer,t.id),line=clippedCoordinateLine(c,pts);return <g key={t.id}>
          {t.kind==='line'&&line.length===2&&<line x1={px(line[0].x)} y1={py(line[0].y)} x2={px(line[1].x)} y2={py(line[1].y)} stroke={t.color} strokeWidth="3" pointerEvents="none" markerStart={`url(#${uid}-${t.id})`} markerEnd={`url(#${uid}-${t.id})`}/>}
          {pts.map((p,i)=><g key={i}>
            {!readOnly&&active===t.id&&<circle cx={px(p.x)} cy={py(p.y)} r="38" fill={t.color} opacity="0.1" aria-hidden="true" onPointerDown={event=>start(event,t.id,i)} className="coordinate-point-halo"/>}
            <circle cx={px(p.x)} cy={py(p.y)} r="8" fill={t.color} stroke="#000" strokeWidth="1" role="button" tabIndex={readOnly?-1:0} pointerEvents={active===t.id?'auto':'none'} aria-label={`${t.label} point ${i+1}: (${p.x}, ${p.y}). Drag or use arrow keys to move. Delete removes.`} onPointerDown={event=>start(event,t.id,i)} onKeyDown={event=>keyPoint(event,t.id,i)} className="coordinate-point"/>
          </g>)}
        </g>})}
        {c.shapes?.filter(s=>s.id!==value.shape).map(s=>shapeMarkup(s,false))}
        {anchor&&c.shapes?.filter(s=>s.id===value.shape).map(s=>shapeMarkup(s,true))}
      </svg>
    </div>
  </div>;
}
