/** Authoring validation for the shared coordinate response contract. */
export function normalizeCoordinateResponse(raw, { allowIncomplete = false, image = value => value } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Coordinate graph configuration is required.');
  const num = (value, label, min = -100000, max = 100000) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) throw new Error(`${label} must be a number between ${min} and ${max}.`);
    return value;
  };
  const text = (value, label) => { if (typeof value !== 'string' || !value.trim() || value.length > 100) throw new Error(`${label} is required (up to 100 characters).`); return value.trim(); };
  const id = value => { const s=text(value,'Graph ID'); if(!/^[a-zA-Z][\w-]*$/.test(s)||['__proto__','constructor','prototype'].includes(s))throw new Error('Graph IDs must start with a letter and contain only letters, numbers, underscores or hyphens.');return s; };
  const point = p => ({x:num(p?.x,'Point x'),y:num(p?.y,'Point y'),...(typeof p?.label==='string'?{label:p.label.slice(0,40)}:{})});
  const c = Object.fromEntries(['xMin','xMax','yMin','yMax'].map(k=>[k,num(raw[k],k)]));
  for(const axis of ['x','y']) {
    const range=c[axis+'Max']-c[axis+'Min'];if(range<=0)throw new Error('Graph maximums must be greater than minimums.');
    for(const suffix of ['Step','Snap']) c[axis+suffix]=num(raw[axis+suffix],axis+suffix,0.000001,range);
    if(range/c[axis+'Step']>200)throw new Error('A graph may have at most 200 grid intervals per axis.');
  }
  c.width=num(raw.width,'Graph width',100,1500);c.height=num(raw.height,'Graph height',100,1500);
  c.plot=Object.fromEntries(['left','top','width','height'].map(k=>[k,num(raw.plot?.[k],`Plot ${k}`,['width','height'].includes(k)?10:0,1500)]));
  if(c.plot.left+c.plot.width>c.width||c.plot.top+c.plot.height>c.height)throw new Error('Plot must fit inside the graph.');
  const within = p => p.x>=c.xMin&&p.x<=c.xMax&&p.y>=c.yMin&&p.y<=c.yMax;
  if(raw.background)c.background=image(raw.background);
  for(const k of ['title','xLabel','yLabel'])if(typeof raw[k]==='string')c[k]=raw[k].slice(0,200);
  c.tools=(Array.isArray(raw.tools)?raw.tools:[]).map(t=>{
    if(!['line','point'].includes(t.kind))throw new Error('Graph tools must be line or point.');
    if(!/^#[\da-f]{6}$/i.test(t.color))throw new Error('Graph tool colors must use six-digit hex colors.');
    const pts=Array.isArray(t.correctPoints)?t.correctPoints.map(point):[];
    if(pts.length&&(pts.length!==(t.kind==='line'?2:1)||!pts.every(within)||t.kind==='line'&&pts[0].x===pts[1].x&&pts[0].y===pts[1].y))throw new Error('Each line key needs two distinct points on the grid; a point key needs one.');
    if(!allowIncomplete&&!pts.length)throw new Error('Every graph tool needs an answer key.');
    return {id:id(t.id),label:text(t.label,'Tool label'),kind:t.kind,color:t.color,...(pts.length?{correctPoints:pts}:{})};
  });
  if(c.tools.length>6||new Set(c.tools.map(t=>t.id)).size!==c.tools.length)throw new Error('Use at most six uniquely named graph tools.');
  if(Array.isArray(raw.shapes)&&raw.shapes.length) {
    if(c.tools.length||raw.shapes.length>8)throw new Error('A shape graph uses up to eight orientations and no line tools.');
    c.shapes=raw.shapes.map(s=>{
      if(!Array.isArray(s.vertices)||s.vertices.length<3||s.vertices.length>12)throw new Error('Each polygon needs 3–12 vertices.');
      return {id:id(s.id),vertices:s.vertices.map(point),bankX:num(s.bankX,'Shape bank x',0,c.width),bankY:num(s.bankY,'Shape bank y',0,c.height)};
    });
    if(new Set(c.shapes.map(s=>s.id)).size!==c.shapes.length)throw new Error('Shape IDs must be unique.');
    if(raw.correctShapeId)c.correctShapeId=id(raw.correctShapeId);
    if(raw.correctAnchor)c.correctAnchor=point(raw.correctAnchor);
    const s=c.shapes.find(s=>s.id===c.correctShapeId);
    if(c.correctShapeId&&!s||c.correctAnchor&&s&&!s.vertices.every(p=>within({x:p.x+c.correctAnchor.x,y:p.y+c.correctAnchor.y})))throw new Error('The keyed shape must fit in the grid.');
    if(!allowIncomplete&&(!s||!c.correctAnchor))throw new Error('Choose the correct polygon and its anchor point.');
  }else if(!c.tools.length)throw new Error('A coordinate response needs a line, point or polygon tool.');
  return c;
}

export function normalizeDragDropImage(raw, slots, normalizeImage) {
  const image=normalizeImage(raw);
  if(!image||!Number.isFinite(raw.width)||!Number.isFinite(raw.height)||raw.width<28||raw.height<28||raw.width>1500||raw.height>1500)throw new Error('Drag background needs an image and dimensions between 28 and 1500 pixels.');
  for(const s of slots)if(![s.left,s.top,s.width,s.height].every(Number.isFinite)||s.left<0||s.top<0||s.width<28||s.height<20||s.left+s.width>raw.width||s.top+s.height>raw.height)throw new Error('Every drag box needs dimensions and a position inside the background image.');
  return {...image,width:raw.width,height:raw.height};
}
