import type { ExamQuestion } from './examTypes';

export type Point = [number, number];
const escape = (value: string | number) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]!));
const rounded = (n: number) => Math.round(n * 100) / 100;
export const line = (a: Point, b: Point, dashed = false) => `<path d="M${a.map(rounded).join(',')} L${b.map(rounded).join(',')}" fill="none"${dashed ? ' stroke-dasharray="5 4"' : ''}/>`;
export const polygon = (points: Point[], fill = '#fff') => `<polygon points="${points.map(p => p.map(rounded).join(',')).join(' ')}" fill="${fill}"/>`;
export const label = (point: Point, text: string | number, anchor = 'middle') => `<text x="${rounded(point[0])}" y="${rounded(point[1])}" text-anchor="${anchor}" fill="#172b3a" stroke="none" font-family="Arial,sans-serif" font-size="15">${escape(text)}</text>`;
export const circle = (center: Point, radius: number) => `<circle cx="${center[0]}" cy="${center[1]}" r="${radius}" fill="#fff"/>`;
export function arc(center: Point, radius: number, start: number, end: number) {
  const at = (angle: number): Point => [center[0] + radius * Math.cos(angle * Math.PI / 180), center[1] + radius * Math.sin(angle * Math.PI / 180)];
  return `<path d="M${at(start).map(rounded).join(',')} A${radius},${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${at(end).map(rounded).join(',')}" fill="none"/>`;
}
export function figure(body: string, description: string): NonNullable<ExamQuestion['image']> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 280" width="520" height="280" role="img"><title>${escape(description)}</title><rect width="520" height="280" fill="white"/><g stroke="#172b3a" stroke-width="1.7" stroke-linejoin="round">${body}</g></svg>`;
  return {src:`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,alt:description,width:520};
}
export function numberLine(points: {name: string; value: number; shown?: string}[]) {
  const low = Math.min(...points.map(p => p.value)), high = Math.max(...points.map(p => p.value));
  const x = (value: number) => 65 + (value - low) / Math.max(1, high - low) * 390;
  return line([30,135],[490,135]) + polygon([[30,135],[39,130],[39,140]],'#172b3a') + polygon([[490,135],[481,130],[481,140]],'#172b3a') + points.map(p => line([x(p.value),129],[x(p.value),141])+label([x(p.value),115],p.name)+(p.shown===undefined?'':label([x(p.value),168],p.shown))).join('');
}
/** Axonometric box: dimensions change the geometry, not just its labels. */
export function prism(length: number, width: number, height: number, labels: [string,string,string], slice = false) {
  const scale = Math.min(250/(length+.55*width),185/(height+.3025*width)), l=length*scale,w=width*scale*.55,h=height*scale;
  const x=(520-l-w)/2, y=(280+h+w*.55)/2;
  const a:Point=[x,y],b:Point=[x+l,y],c:Point=[x+l+w,y-w*.55],d:Point=[x+w,y-w*.55];
  const up=(p:Point):Point=>[p[0],p[1]-h];
  return polygon([a,b,up(b),up(a)],'#f6f6f6')+polygon([b,c,up(c),up(b)],'#e7e7e7')+polygon([up(a),up(b),up(c),up(d)],'#fff')+
    (slice?polygon([a,b,c,d].map(p=>[p[0],p[1]-h*.5] as Point),'#d8e7ee'):'')+
    label([x+l/2,y+23],labels[0])+label([x+l+w*.65+12,y-w*.2+13],labels[1])+label([x-12,y-h/2],labels[2],'end');
}
