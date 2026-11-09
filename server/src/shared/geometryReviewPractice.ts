import type { ExamQuestion } from './examTypes';
import { probabilitySequence } from './probabilityPractice';
import { arc, circle, figure, label, line, numberLine, polygon, prism, type Point } from './geometryFigures';

type Parameters = Record<string,number>;
const category='Geometry';
const topics={angles:'Lines & Angles',coordinate:'Coordinate Geometry & Transformations',polygons:'Quadrilaterals & Polygons',scale:'Similarity, Scale & Proportional Geometry',area:'Perimeter, Area & Composite Figures',circles:'Circles',volume:'Surface Area & Volume'};
const range=(start:number,end:number,step=1)=>Array.from({length:Math.floor((end-start)/step)+1},(_,i)=>start+i*step);
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
function fraction(n:number,d=1){const g=gcd(n,d);return d/g===1?String(n/g):`${n/g}/${d/g}`;}
const latex=(value:string)=>value.includes('/')?`\\frac{${value.split('/')[0]}}{${value.split('/')[1]}}`:value.replace('π','\\pi');
const math=(text:string)=>`\\(${text}\\)`;
function domain(values:Record<string,number[]>,original:Parameters,valid:(p:Parameters)=>boolean=()=>true){
  let rows:Parameters[]=[{}];
  for(const [key,options] of Object.entries(values))rows=rows.flatMap(row=>options.map(value=>({...row,[key]:value})));
  const same=(p:Parameters)=>Object.keys(original).every(key=>p[key]===original[key]);
  if(!valid(original))throw Error('Invalid geometry source example.');
  return [original,...rows.filter(p=>valid(p)&&!same(p))];
}
function spec(key:string,sourceId:string,title:string,topic:string,parameters:Parameters[],typed=false,module=key){
  return {id:`geometry-${key}-v1`,key,sourceId,title,description:`Practice ${title.toLowerCase()} with generated figures and worked solutions.`,category,topic,parameters,distinctCount:parameters.length,typed,moduleId:`geometry-${module}`};
}
export const geometryReviewTemplates=[
  spec('wheel-revolutions','2021-2022-form-a-q106','Wheel Revolutions',topics.area,domain({r:range(1,6),turns:range(140,980,70),diameter:[0,1]},{r:1,turns:700,diameter:0})),
  spec('fractional-number-line','2021-2022-form-a-q111','Fractional Distances on a Number Line',topics.coordinate,domain({k:[-13,3,15,25],jk:[12,20,28,36],kl:[17,25,33,41],lm:[5,9,13]},{k:3,jk:28,kl:41,lm:9})),
  spec('parallelogram-angles','2021-2022-form-a-q58','Parallelogram and Full-turn Angles',topics.polygons,domain({a:range(30,80,2),base:[170,210,250]},{a:72,base:210}),true),
  spec('scale-perimeter','2020-2021-form-b-math-3','Scale Drawings: Composite Perimeters',topics.scale,domain({w:range(10,18,2),h:range(5,9),cut:[2,3,4],depth:[2,3],shape:[0,1,2],scale:[1.5,2,2.5,3]},{w:13,h:6,cut:5,depth:3,shape:0,scale:2.5}),true),
  spec('cube-building','2020-2021-form-b-q108','Building Larger Cubes',topics.volume,domain({n:range(2,9),unit:[.5,1,1.5,2]},{n:5,unit:1}),false,'cube-edges'),
  spec('floor-tiles','2020-2021-form-b-q111','Square Tiles and Floor Area',topics.area,domain({nx:range(8,20,2),ny:range(6,14,2),tile:[.25,.5,.75,1],shape:[0,1]},{nx:16,ny:10,tile:.75,shape:0},p=>p.nx>p.ny)),
  spec('circle-area-difference','2020-2021-form-b-q89','Differences of Circle Areas',topics.circles,domain({r:range(4,12),s:range(2,9),diameter:[0,1]},{r:9,s:6,diameter:1},p=>p.r>p.s)),
  spec('cube-volume-edge','2020-2021-form-b-q91','Cube Volume to Edge Length',topics.volume,domain({edge:range(2,15),units:[0,1,2]},{edge:8,units:0}),false,'cube-edges'),
  spec('box-surface-area','2020-2021-form-b-q96','Surface Area of Closed Boxes',topics.volume,domain({l:[8,12,20,30,40,50],w:[3,5,10,20,40],h:[2,4,8,20]},{l:50,w:40,h:20},p=>p.l>=p.w&&p.w>=p.h&&p.l<=6*p.h)),
  spec('rectangle-transversal','2019-2020-form-a-q102','Rectangle Transversal Angles',topics.angles,domain({given:range(115,155,5),height:[120,160,190]},{given:130,height:160}),false,'angle-relationships'),
  spec('similar-rectangle-area','2019-2020-form-a-q106','Similar Rectangles: Perimeter to Area',topics.scale,domain({l:range(4,12),w:range(2,7),inner:range(1,5)},{l:4,w:3,inner:2},p=>p.l>p.w&&p.inner<p.w)),
  spec('mixed-unit-volume','2019-2020-form-a-q107','Volume with Mixed Length Units',topics.volume,domain({l:[12,18,24,30,36],w:[4,6,8,10],thick:[3,6,9,12]},{l:30,w:8,thick:6})),
  spec('perpendicular-transversal','2019-2020-form-a-q61','Perpendicular Lines and a Transversal',topics.angles,domain({a:range(20,70),size:[100,130,160]},{a:35,size:130}),true,'angle-relationships'),
  spec('intersecting-lines','2019-2020-form-a-q82','Intersecting Lines: Triangle Angles',topics.angles,domain({exterior:range(110,150,5),other:range(70,110,5)},{exterior:135,other:100},p=>p.exterior-p.other>=20&&p.exterior-p.other<=65)),
  spec('number-line-ratio','2019-2020-form-a-q92','Dividing a Number-line Segment in a Ratio',topics.coordinate,domain({j:range(-12,2,2),a:range(1,4),b:range(2,5),step:range(1,4)},{j:-4,a:2,b:3,step:2},p=>gcd(p.a,p.b)===1)),
  spec('prism-cross-section','digital-shsat-practice-test-adaptive-10-hard-satcc-9cc827afe5f992f7af37-math-1','Prism Cross Sections: Volume to Perimeter',topics.area,domain({w:range(3,10),ratio:range(2,5),h:range(6,20,2)},{w:6,ratio:2,h:14})),
];

type Model={prompt:string;answer:string;traps:(number|string)[];explanation:string;drawing:string;alt:string};
const unitNames=['centimeters','inches','meters'];
function model(key:string,p:Parameters):Model {
  let prompt='',answer='',explanation='',drawing='',alt='';let traps:(number|string)[]=[];
  switch(key){
    case 'wheel-revolutions': {
      const distance=44*p.r*p.turns/7,measure=p.diameter?2*p.r:p.r;
      prompt=`A wheel travels ${distance} feet in 1 minute. Its ${p.diameter?'diameter':'radius'} is ${measure} ${measure===1?'foot':'feet'}. How many complete revolutions does it make? Use ${math('\\pi=22/7')}.`;
      answer=String(p.turns);traps=[p.turns*2,p.turns/2,distance];
      explanation=`The radius is ${p.r} ft. One revolution travels one circumference: (2 × 22/7 × ${p.r}) ft. Divide distance by circumference: ${distance} ÷ (44 × ${p.r}/7) = ${answer} revolutions. Diameter alone is not the distance traveled in one turn.`;
      const r=45+p.r*7;drawing=circle([260,140],r)+line([p.diameter?260-r:260,140],[260+r,140],true)+label([260,128],`${p.diameter?'d':'r'} = ${measure} ft`);alt=`Wheel with ${p.diameter?'diameter':'radius'} ${measure} feet.`;break;
    }
    case 'fractional-number-line': {
      const j=p.k-p.jk,l=p.k+p.kl,m=l+p.lm,jm=p.jk+p.kl+p.lm;
      prompt=`The points occur in the order J, K, L, M. K is at ${math(latex(fraction(p.k,8)))}. JK = ${math(latex(fraction(p.jk,8)))}, JM = ${math(latex(fraction(jm,8)))}, and LM = ${math(latex(fraction(p.lm,8)))}. What is the coordinate of L?`;
      answer=fraction(l,8);traps=[fraction(l+p.lm,8),fraction(l-p.jk,8),fraction(l+2*p.lm,8)];
      explanation=`J = ${fraction(p.k,8)} − ${fraction(p.jk,8)} = ${fraction(j,8)}. M = J + JM = ${fraction(m,8)}. L lies to the left of M, so L = M − LM = ${answer}. Keep signed coordinates separate from positive distances.`;
      drawing=numberLine([{name:'J',value:j},{name:'K',value:p.k,shown:fraction(p.k,8)},{name:'L',value:l},{name:'M',value:m}]);alt=`J, K, L, M in increasing order; K = ${fraction(p.k,8)}. Distances are given in the question.`;break;
    }
    case 'parallelogram-angles': {
      const h=95,dx=h/Math.tan(p.a*Math.PI/180),x=(520-p.base-dx)/2;const P:Point=[x,205],S:Point=[x+p.base,205],Q:Point=[x+dx,110],R:Point=[x+dx+p.base,110];
      answer=String(90+p.a);prompt=`PQRS is a parallelogram. The exterior angle at S is ${p.a}°. The upward ray at Q is perpendicular to QR. Find the marked angle x, in degrees.`;
      traps=[];explanation=`The interior angle at S is 180 − ${p.a} = ${180-p.a}°. Opposite angles of a parallelogram are equal, so angle PQR is also ${180-p.a}°. Angles around Q total 360°: x = 360 − 90 − ${180-p.a} = ${answer}°.`;
      drawing=polygon([P,Q,R,S])+line(S,[S[0]+40,S[1]])+line(Q,[Q[0],Q[1]-65])+line([Q[0],Q[1]-14],[Q[0]+14,Q[1]-14])+line([Q[0]+14,Q[1]-14],[Q[0]+14,Q[1]])+arc(S,25,360-p.a,360)+label([S[0]+40,S[1]-15],`${p.a}°`)+arc(Q,30,180-p.a,270)+label([Q[0]-42,Q[1]-8],'x°')+label([P[0]-10,P[1]+18],'P')+label([S[0],S[1]+23],'S')+label([Q[0]+8,Q[1]+22],'Q')+label([R[0]+12,R[1]],'R');alt=`Parallelogram PQRS, exterior angle S ${p.a}°, a 90° angle between QR and the upward ray at Q, and x between that ray and QP.`;break;
    }
    case 'scale-perimeter': {
      const {w,h,cut,depth,shape,scale}=p,perimeter=2*(w+h)+(shape===2?2*depth:0);
      const points:Point[]=shape===0?[[0,0],[w,0],[w,h-depth],[w-cut,h-depth],[w-cut,h],[0,h]]:shape===1?[[0,0],[w,0],[w,depth],[(w+cut)/2,depth],[(w+cut)/2,h],[(w-cut)/2,h],[(w-cut)/2,depth],[0,depth]]:[[0,0],[(w-cut)/2,0],[(w-cut)/2,depth],[(w+cut)/2,depth],[(w+cut)/2,0],[w,0],[w,h],[0,h]];
      const s=Math.min(320/w,150/h),at=([a,b]:Point):Point=>[90+a*s,55+b*s];
      drawing=polygon(points.map(at),'#edf3f5')+label([90+w*s/2,35],`overall width ${w} cm`)+label([90+w*s/2,248],`overall height ${h} cm`);
      const names=['L-shaped','T-shaped','U-shaped'];
      prompt=`${shape===0?'An':'A'} ${names[shape]} garden is drawn with all boundary corners at right angles. The overall width is ${w} cm and height is ${h} cm. ${shape===0?`A corner rectangle of width ${cut} cm and height ${depth} cm is removed.`:shape===1?`The top bar is ${depth} cm high and the centered stem is ${cut} cm wide.`:`The centered notch is ${cut} cm wide and ${depth} cm deep.`} Each centimeter represents ${scale} meters. What is the actual perimeter, in meters?`;
      answer=String(perimeter*scale);traps=[];explanation=`The drawing perimeter is ${shape===2?`2(${w}+${h}) + 2(${depth})`:`2(${w}+${h})`} = ${perimeter} cm. ${shape===2?'The notch replaces its width along the top but adds two vertical edges.':'The inward steps replace matching lengths of the outer rectangle, so their total boundary length is unchanged.'} Multiply lengths by ${scale}, not its square: ${perimeter} × ${scale} = ${answer} meters.`;
      alt=`${names[shape]} right-angled polygon: overall ${w} by ${h} cm; ${shape===1?'bar height and stem width':'cutout width and depth'} given in the stem. One cm represents ${scale} meters.`;break;
    }
    case 'cube-building': {
      answer=String(p.n*p.unit);prompt=`A large solid cube is built from ${p.n**3} identical small cubes, each with edge length ${p.unit} inch${p.unit===1?'':'es'}. What is the edge length of the large cube, in inches?`;
      traps=[p.n*p.n*p.unit,p.n**3*p.unit,p.n];explanation=`There are ${p.n} small cubes along each edge because ${p.n}³ = ${p.n**3}. The large edge is ${p.n} × ${p.unit} = ${answer} inches. The cube count is a volume count, not an edge count.`;
      drawing=prism(1,1,1,['?','', ''])+label([260,20],`${p.n**3} cubes; small edge ${p.unit} in`);alt=`Solid cube assembled from ${p.n**3} small cubes of edge ${p.unit} inch(es); large edge unknown.`;break;
    }
    case 'floor-tiles': {
      const l=p.nx*p.tile,w=p.ny*p.tile,cx=p.nx/2,cy=p.ny/2,count=p.nx*p.ny-(p.shape?cx*cy:0),s=Math.min(300/p.nx,160/p.ny);
      const points:Point[]=p.shape?[[0,0],[p.nx,0],[p.nx,cy],[cx,cy],[cx,p.ny],[0,p.ny]]:[[0,0],[p.nx,0],[p.nx,p.ny],[0,p.ny]];
      drawing=polygon(points.map(([x,y])=>[90+x*s,50+y*s]),'#edf3f5')+label([240,32],`${l} ft`)+label([70,60+p.ny*s/2],`${w} ft`,'end');
      prompt=`A ${p.shape?'right-angled L-shaped':'rectangular'} floor has overall dimensions ${l} feet by ${w} feet.${p.shape?` A ${cx*p.tile}-foot by ${cy*p.tile}-foot corner rectangle is removed.`:''} Square tiles have side length ${p.tile} foot. How many tiles exactly cover the floor without overlap?`;
      answer=String(count);traps=[count*p.tile,2*(p.nx+p.ny),count*2];explanation=`Floor area = ${l} × ${w}${p.shape?` − ${cx*p.tile} × ${cy*p.tile}`:''} = ${count*p.tile*p.tile} square feet. Each tile covers ${p.tile}² = ${p.tile*p.tile} square feet. Divide areas: ${count*p.tile*p.tile} ÷ ${p.tile*p.tile} = ${count} tiles. Divide by tile area, not tile side length.`;
      alt=`${p.shape?'L-shaped':'Rectangular'} floor, overall ${l} by ${w} feet.${p.shape?` Removed corner ${cx*p.tile} by ${cy*p.tile} feet.`:''}`;break;
    }
    case 'circle-area-difference': {
      const value=p.r*p.r-p.s*p.s;answer=`${value}π`;
      prompt=`Two circular plates have ${p.diameter?'diameters':'radii'} of ${p.diameter?2*p.r:p.r} inches and ${p.diameter?2*p.s:p.s} inches. What is the difference of their areas, in square inches? Give the exact answer in terms of π.`;
      traps=[`${p.r-p.s}π`,`${(p.r-p.s)**2}π`,`${4*value}π`];explanation=`Use radii ${p.r} and ${p.s}. The difference is π(${p.r}² − ${p.s}²) = π(${p.r*p.r} − ${p.s*p.s}) = ${answer} square inches. Subtract the squared radii; do not square their difference.`;
      const scale=85/p.r;drawing=circle([150,140],85)+circle([370,140],p.s*scale)+line([p.diameter?65:150,140],[235,140],true)+line([p.diameter?370-p.s*scale:370,140],[370+p.s*scale,140],true)+label([150,128],`${p.diameter?'d':'r'} = ${p.diameter?2*p.r:p.r} in`)+label([370,128],`${p.diameter?'d':'r'} = ${p.diameter?2*p.s:p.s} in`);alt=`Two circles, ${p.diameter?'diameters':'radii'} ${p.diameter?2*p.r:p.r} and ${p.diameter?2*p.s:p.s} inches.`;break;
    }
    case 'cube-volume-edge': {
      const unit=unitNames[p.units];answer=String(p.edge);prompt=`A cube has volume ${p.edge**3} cubic ${unit}. What is its edge length, in ${unit}?`;
      traps=[p.edge*p.edge,fraction(p.edge**3,6),fraction(p.edge**3,4)];explanation=`For a cube, V = s³. Since ${p.edge} × ${p.edge} × ${p.edge} = ${p.edge**3}, the edge is ${p.edge} ${unit}. Dividing the volume by 6 finds neither an edge nor a face area.`;
      drawing=prism(1,1,1,['s','s','s'])+label([260,20],`V = ${p.edge**3} cubic ${unit}`);alt=`Cube with equal edges s and volume ${p.edge**3} cubic ${unit}.`;break;
    }
    case 'box-surface-area': {
      answer=String(2*(p.l*p.w+p.l*p.h+p.w*p.h));prompt=`A closed rectangular box is ${p.l} cm long, ${p.w} cm wide, and ${p.h} cm high. What is its total surface area, in square centimeters?`;
      traps=[Number(answer)/2,p.l*p.w*p.h,2*(p.l+p.w+p.h)];explanation=`A closed box has three pairs of equal faces. Surface area = 2(lw + lh + wh) = 2(${p.l*p.w} + ${p.l*p.h} + ${p.w*p.h}) = ${answer} cm². Volume multiplies all three lengths and answers a different question.`;
      drawing=prism(p.l,p.w,p.h,[`${p.l} cm`,`${p.w} cm`,`${p.h} cm`]);alt=`Closed rectangular prism with length ${p.l}, width ${p.w}, height ${p.h} centimeters.`;break;
    }
    case 'rectangle-transversal': {
      const acute=180-p.given,top=35,right=355,hitY=top+p.height*.48,rx=right-(hitY-top)/Math.tan(acute*Math.PI/180);answer=String(270-p.given);
      prompt=`Segment RS intersects the top and right sides of a rectangle. The marked angle at R is ${p.given}°. Find the exterior angle y at the right side, in degrees.`;
      traps=[p.given,acute,90-acute];explanation=`The triangle's top angle is 180 − ${p.given} = ${acute}°. Its rectangle corner is 90°, so its third angle is 90 − ${acute} = ${90-acute}°. Angle y is supplementary to that angle: 180 − ${90-acute} = ${answer}°.`;
      drawing=polygon([[70,top],[right,top],[right,top+p.height],[70,top+p.height]])+line([rx,top],[right+50,hitY+50*Math.tan(acute*Math.PI/180)])+arc([rx,top],24,acute,180)+label([rx-26,top+30],`${p.given}°`)+arc([right,hitY],25,270,360+acute)+label([right+33,hitY-5],'y°')+label([rx,top-12],'R')+label([right+60,hitY+50*Math.tan(acute*Math.PI/180)],'S');alt=`Rectangle cut by RS; angle R ${p.given} degrees, exterior angle y at the right edge.`;break;
    }
    case 'similar-rectangle-area': {
      answer=fraction(p.l*p.inner*p.inner,p.w);prompt=`The shaded rectangle is similar to the outer rectangle. The outer length is ${p.l} feet and its perimeter is ${2*(p.l+p.w)} feet. The shaded width is ${p.inner} feet. What is the shaded area, in square feet?`;
      traps=[fraction(p.l*p.inner),fraction(p.inner*p.inner),fraction(p.l*p.w)];explanation=`Outer width = ${2*(p.l+p.w)}/2 − ${p.l} = ${p.w} ft. The scale factor is ${p.inner}/${p.w}, so shaded length = ${fraction(p.l*p.inner,p.w)} ft. Shaded area = ${p.inner} × (${fraction(p.l*p.inner,p.w)}) = ${answer} square feet. Areas scale by the square of the length scale factor.`;
      const s=Math.min(320/p.l,175/p.w),l=p.l*s,w=p.w*s,ratio=p.inner/p.w,x=(520-l)/2,y=(250-w)/2,ix=x+l*(1-ratio)/2,iy=y+w*(1-ratio)/2;
      drawing=polygon([[x,y],[x+l,y],[x+l,y+w],[x,y+w]])+polygon([[ix,iy],[ix+l*ratio,iy],[ix+l*ratio,iy+w*ratio],[ix,iy+w*ratio]],'#d6dee2')+label([260,y+w+23],`${p.l} ft`)+label([ix-8,iy+w*ratio/2],`${p.inner} ft`,'end');alt=`Similar nested rectangles. Outer length ${p.l} feet; shaded width ${p.inner} feet.`;break;
    }
    case 'mixed-unit-volume': {
      answer=String(p.l*p.w*p.thick/12);prompt=`A rectangular concrete slab is ${p.l} feet long, ${p.w} feet wide, and ${p.thick} inches thick. What is its volume, in cubic feet?`;
      traps=[p.l*p.w*p.thick,p.l*p.w,p.l+p.w+p.thick];explanation=`Convert thickness to feet: ${p.thick}/12 = ${fraction(p.thick,12)} ft. Volume = length × width × thickness = ${p.l} × ${p.w} × (${fraction(p.thick,12)}) = ${answer} cubic feet.`;
      drawing=prism(p.l,p.w,Math.max(2,p.thick/2),[`${p.l} ft`,`${p.w} ft`,`${p.thick} in`]);alt=`Rectangular slab ${p.l} feet by ${p.w} feet with thickness ${p.thick} inches. Thickness exaggerated for clarity.`;break;
    }
    case 'perpendicular-transversal': {
      const x0=145,y0=65,d=p.size*Math.tan(p.a*Math.PI/180)*.55,h=p.size*.55,bottom=y0+h;
      answer=String(90-p.a);prompt=`Lines l and n are perpendicular. A transversal makes the marked ${p.a}° angle with l. Find x, the marked acute angle with n, in degrees.`;traps=[];
      explanation=`Vertical angles are equal, so the triangle has an angle of ${p.a}°. Its other known angle is 90° because l is perpendicular to n. Therefore x = 180 − 90 − ${p.a} = ${answer}°.`;
      const upper:Point=[x0+d,y0],lower:Point=[x0,bottom];drawing=line([65,y0],[470,y0])+line([x0,25],[x0,250])+line([x0-d*.16,bottom+h*.16],[upper[0]+d*.16,y0-h*.16])+line([x0+14,y0],[x0+14,y0+14])+line([x0+14,y0+14],[x0,y0+14])+arc(lower,22,90,90+p.a)+label([x0-30,bottom+35],`${p.a}°`)+arc(upper,24,270+p.a,360)+label([upper[0]+32,y0-12],'x°')+label([x0-12,25],'l')+label([480,y0+5],'n');alt=`Perpendicular lines l and n with a transversal; marked angle with l is ${p.a} degrees and acute angle with n is x.`;break;
    }
    case 'intersecting-lines': {
      const A=180-p.exterior,B=p.other,C=p.exterior-p.other,a=A*Math.PI/180,b=B*Math.PI/180,c=C*Math.PI/180;
      const qx=200*Math.sin(b)*Math.cos(a)/Math.sin(c),qy=200*Math.sin(b)*Math.sin(a)/Math.sin(c),scale=Math.min(300/Math.max(200,qx),150/qy),left:Point=[80,220],right:Point=[80+200*scale,220],q:Point=[80+qx*scale,220-qy*scale];
      const extend=(from:Point,to:Point,f:number):Point=>[to[0]+(to[0]-from[0])*f,to[1]+(to[1]-from[1])*f];
      answer=String(C);prompt=`Lines j and k intersect at Q above straight line h. The exterior angle at the left intersection is ${p.exterior}°, and the marked angle vertically opposite the right interior angle is ${B}°. Find x at Q, in degrees.`;
      traps=[A,B,C+20];explanation=`The left interior angle is 180 − ${p.exterior} = ${A}°. The right interior angle is ${B}° by vertical angles. The triangle's top angle, equal to x by vertical angles, is 180 − ${A} − ${B} = ${C}°.`;
      drawing=line([30,220],[490,220])+line(extend(q,left,.12),extend(left,q,.2))+line(extend(q,right,.12),extend(right,q,.2))+arc(left,24,180,360-A)+label([left[0]-12,185],`${p.exterior}°`)+arc(right,24,0,B)+label([right[0]+28,250],`${B}°`)+arc(q,24,180+B,360-A)+label([q[0]+12,q[1]-32],'x°')+label([q[0]-14,q[1]+8],'Q')+label([490,210],'h')+label([left[0]-20,244],'j')+label([right[0]-16,250],'k');alt=`Triangle formed by j, k and horizontal line h, with exterior left angle ${p.exterior}°, vertical right angle ${B}°, and unknown vertical top angle x.`;break;
    }
    case 'number-line-ratio': {
      const k=p.j+(p.a+p.b)*p.step,l=p.j+p.a*p.step;answer=String(l);prompt=`J is at ${p.j} and K is at ${k} on a number line. L lies between them and JL = ${math(latex(fraction(p.a,p.b)))} × LK. What is the coordinate of L?`;
      traps=[p.j+p.b*p.step,p.a*p.step,k-p.a*p.step];explanation=`The total distance JK is ${k-p.j}. The ratio JL : LK is ${p.a} : ${p.b}, so there are ${p.a+p.b} equal parts. Each part is ${p.step} units and JL is ${p.a*p.step}. Starting at J, L = ${p.j} + ${p.a*p.step} = ${l}.`;
      drawing=numberLine([{name:'J',value:p.j,shown:String(p.j)},{name:'K',value:k,shown:String(k)}]);alt=`Number line with J at ${p.j} and K at ${k}. L is not shown.`;break;
    }
    case 'prism-cross-section': {
      const length=p.ratio*p.w,area=length*p.w,volume=area*p.h;answer=String(2*(length+p.w));prompt=`A right rectangular prism has volume ${volume} cubic inches and height ${p.h} inches. A plane parallel to its top forms a rectangular cross section whose length is ${p.ratio} times its width. What is the perimeter of that cross section, in inches?`;
      traps=[length+p.w,area,4*length];explanation=`The cross section has the same area as the base: ${volume} ÷ ${p.h} = ${area} square inches. If width is w, ${p.ratio}w² = ${area}, so w² = ${p.w*p.w} and w = ${p.w}. Length = ${length}. Perimeter = 2(${length}+${p.w}) = ${answer} inches.`;
      drawing=prism(length,p.w,p.h,[`${p.ratio}w`,'w',`${p.h} in`],true);alt=`Rectangular prism sliced parallel to its top, height ${p.h} inches; cross-section sides w and ${p.ratio}w. Diagram not to scale.`;break;
    }
    default:throw Error('Unknown geometry family.');
  }
  return {prompt,answer,traps,explanation,drawing,alt};
}
function choices(answer:string,traps:(number|string)[],variant:number){
  const options=[...new Set([answer,...traps.map(String)])];
  for(let i=1;options.length<4;i++){const fallback=`${i}${answer.endsWith('π')?'π':''}`;if(!options.includes(fallback))options.push(fallback);}
  const four=options.slice(0,4),offset=variant%4,ordered=four.slice(offset).concat(four.slice(0,offset));
  return {choices:ordered.map((text,i)=>({id:'ABCD'[i],text,math:latex(text)})),correctChoiceId:'ABCD'[ordered.indexOf(answer)]};
}
export function generateGeometryReview(id:string,index:number,seed='geometry-review'){
  const template=geometryReviewTemplates.find(t=>t.id===id);if(!template)throw Error('Unknown geometry generator.');
  const variant=probabilitySequence(index,seed,template.distinctCount),parameters=template.parameters[variant],m=model(template.key,parameters);
  const question:ExamQuestion={id:`${id}:${seed}:${index}`,type:template.typed?'short_response':'multiple_choice',points:1,topic:category,subtopic:template.topic,skilled:'TBD',prompt:m.prompt,image:figure(m.drawing,m.alt),explanation:m.explanation,
    ...(template.typed?{entryControl:'numeric' as const,correctTextAnswers:[m.answer]}:choices(m.answer,m.traps,variant))};
  return {question,variant,parameters};
}
export const geometryReviewPractice=geometryReviewTemplates.map(t=>({...t,generate:(index:number,seed:string)=>generateGeometryReview(t.id,index,seed)}));
