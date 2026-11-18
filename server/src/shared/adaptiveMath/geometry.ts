import { article, clean, deg, family, fmt, num, piTerm, plural, point, signed, tex, tx, type Draft, type Family, type Rng } from './kit';
import { figure, label, polygon, type Point } from '../geometryFigures';

const angleRatios = [[1, 2, 3], [2, 3, 4], [1, 3, 5], [2, 3, 5], [1, 4, 5], [3, 4, 5], [1, 5, 6], [2, 5, 8], [1, 2, 6], [4, 5, 6], [3, 5, 7], [5, 6, 7], [2, 7, 9], [3, 7, 10], [1, 1, 2], [1, 2, 2], [2, 2, 5], [1, 3, 6]];
const triples = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 21, 29], [15, 20, 25], [10, 24, 26], [9, 40, 41], [12, 35, 37], [18, 24, 30], [15, 36, 39]];
const positive = (choices: ReturnType<typeof deg>[]) => choices.filter(choice => choice.value! > 0);

// ---- Lines & Angles (in addition to the existing figure-based angle generators) ----
export const linesAngles: Family[] = [
  family('angle-pair', 'Complementary and supplementary angles', 1, rng => {
    const supplementary = rng.bool(), total = supplementary ? 180 : 90, a = supplementary ? rng.int(25, 155) : rng.int(12, 78);
    return { prompt: `Two angles are ${supplementary ? 'supplementary' : 'complementary'}. One of the angles measures \\(${a}^\\circ\\). What is the measure of the other angle?`, answer: deg(total - a), wrong: positive([deg((supplementary ? 90 : 180) - a), deg(360 - a), deg(a), deg(total - a + 10)]),
      explanation: `${supplementary ? 'Supplementary angles add to \\(180^\\circ\\) (a straight line)' : 'Complementary angles add to \\(90^\\circ\\) (a right angle)'}.\n\\[${total}^\\circ-${a}^\\circ=${total - a}^\\circ.\\]` };
  }),
  family('angle-parallel-lines', 'Parallel lines and a transversal', 1, rng => {
    const a = rng.int(28, 82);
    return { prompt: `Two parallel lines are cut by a transversal. One of the angles formed measures \\(${a}^\\circ\\). What is the measure of each obtuse angle formed by the transversal?`, answer: deg(180 - a), wrong: positive([deg(a), deg(90 - a), deg(360 - a), deg(90 + a)]),
      explanation: `When a transversal crosses parallel lines, only two angle sizes appear: every angle equals \\(${a}^\\circ\\) or its supplement.\nThe obtuse angles measure \\(180^\\circ-${a}^\\circ=${180 - a}^\\circ\\).` };
  }),
  family('angle-supplementary-equation', 'Supplementary angles with an unknown', 2, rng => {
    const k = rng.int(2, 5); let x = Math.round(180 / (k + 1)) + rng.int(-8, 8); if (180 - (k + 1) * x === 0) x += 2;
    const b = 180 - (k + 1) * x, larger = k * x + b;
    return { prompt: `Two angles are supplementary. The measure of the larger angle is ${Math.abs(b)} degrees ${b > 0 ? 'more' : 'less'} than ${k} times the measure of the smaller angle. What is the measure of the larger angle?`, answer: deg(larger), wrong: [deg(x), deg(k * x), deg(Math.round(180 * k / (k + 1))), deg(larger - 2 * b)],
      explanation: `Let the smaller angle be \\(x\\). The larger is \\(${k}x${signed(b)}\\), and together they make \\(180^\\circ\\):\n\\[x+${k}x${signed(b)}=180\\quad\\Rightarrow\\quad ${k + 1}x=${180 - b}\\quad\\Rightarrow\\quad x=${x}.\\]\nThe larger angle is \\(${k}(${x})${signed(b)}=${larger}^\\circ\\). The question asks for the larger angle, not \\(x\\).` };
  }),
  family('angle-around-point', 'Angles around a point', 2, rng => {
    const x = rng.int(25, 60), rest = 360 - 3 * x, first = Math.floor(rest / 2) + rng.int(-25, 25), b = rest - first;
    return { prompt: `Four angles meet at a point and together make a full turn. Their measures are \\(${first}^\\circ\\), \\(${b}^\\circ\\), \\(x^\\circ\\), and \\(2x^\\circ\\). What is the value of \\(x\\)?`, answer: num(x), wrong: [num(3 * x), num(2 * x), num(clean(3 * x / 2)), num(x + 10)],
      explanation: `Angles around a point add to \\(360^\\circ\\):\n\\[${first}+${b}+x+2x=360\\quad\\Rightarrow\\quad 3x=${3 * x}\\quad\\Rightarrow\\quad x=${x}.\\]` };
  }),
  family('angle-ratio-line', 'Angles on a line in a ratio', 3, rng => {
    const [a, b, c] = rng.pick(angleRatios), sum = a + b + c, part = 180 / sum, largest = rng.bool(), parts = largest ? c : a;
    return { prompt: `Three angles lie along a straight line, and their measures are in the ratio ${a}:${b}:${c}. What is the measure of the ${largest ? 'largest' : 'smallest'} angle?`, answer: deg(parts * part), wrong: [deg((largest ? a : c) * part), deg(b * part), deg(part), deg(2 * parts * part)],
      explanation: `Angles on a straight line add to \\(180^\\circ\\). The ratio has \\(${a}+${b}+${c}=${sum}\\) parts, so each part is \\(180\\div${sum}=${part}^\\circ\\).\nThe ${largest ? 'largest' : 'smallest'} angle is ${parts} ${plural(parts, 'part')}: \\(${parts}\\times${part}=${parts * part}^\\circ\\).` };
  }),
];

// ---- Triangles ----
export const triangles: Family[] = [
  family('triangle-third-angle', 'Third angle of a triangle', 1, rng => {
    const a = rng.int(25, 95), b = rng.int(20, 150 - a), c = 180 - a - b;
    return { prompt: `Two angles of a triangle measure \\(${a}^\\circ\\) and \\(${b}^\\circ\\). What is the measure of the third angle?`, answer: deg(c), wrong: [deg(360 - a - b), deg(180 - a), deg(a + b), deg(180 - b)],
      explanation: `The angles of a triangle add to \\(180^\\circ\\):\n\\[180-${a}-${b}=${c}^\\circ.\\]` };
  }),
  family('triangle-angle-ratio', 'Triangle angles in a ratio', 2, rng => {
    const [a, b, c] = rng.pick(angleRatios), sum = a + b + c, part = 180 / sum, largest = rng.bool();
    return { prompt: `The measures of the angles of a triangle are in the ratio ${a}:${b}:${c}. What is the measure of the ${largest ? 'largest' : 'smallest'} angle?`, answer: deg((largest ? c : a) * part), wrong: [deg((largest ? a : c) * part), deg(b * part), deg(part), deg(2 * (largest ? c : a) * part)],
      explanation: `The angles add to \\(180^\\circ\\), and the ratio has \\(${a}+${b}+${c}=${sum}\\) parts. Each part is \\(180\\div${sum}=${part}^\\circ\\).\nThe angles are \\(${a * part}^\\circ\\), \\(${b * part}^\\circ\\), and \\(${c * part}^\\circ\\). The ${largest ? 'largest' : 'smallest'} is \\(${(largest ? c : a) * part}^\\circ\\).` };
  }),
  family('triangle-isosceles', 'Angles of an isosceles triangle', 2, rng => {
    if (rng.bool()) { const vertex = 2 * rng.int(10, 70), base = (180 - vertex) / 2;
      return { prompt: `In an isosceles triangle, the angle between the two equal sides measures \\(${vertex}^\\circ\\). What is the measure of each of the other two angles?`, answer: deg(base), wrong: positive([deg(180 - vertex), deg(vertex / 2), deg(90 - vertex), deg(base + 10)]),
        explanation: `The two base angles of an isosceles triangle are equal. Together they measure \\(180^\\circ-${vertex}^\\circ=${180 - vertex}^\\circ\\), so each is \\(${180 - vertex}\\div2=${base}^\\circ\\).` }; }
    const base = rng.int(25, 80), vertex = 180 - 2 * base;
    return { prompt: `Each of the two equal angles of an isosceles triangle measures \\(${base}^\\circ\\). What is the measure of the third angle?`, answer: deg(vertex), wrong: positive([deg(180 - base), deg(90 - base), deg(2 * base), deg(vertex + 10)]),
      explanation: `The two equal angles total \\(2\\times${base}^\\circ=${2 * base}^\\circ\\). The third angle is \\(180^\\circ-${2 * base}^\\circ=${vertex}^\\circ\\).` };
  }),
  family('triangle-exterior-angle', 'Exterior angle of a triangle', 2, rng => {
    const a = rng.int(25, 80), b = rng.int(25, 80), exterior = a + b;
    return { prompt: `In triangle ABC, the exterior angle at vertex C measures \\(${exterior}^\\circ\\), and angle A measures \\(${a}^\\circ\\). What is the measure of angle B?`, answer: deg(b), wrong: positive([deg(180 - exterior), deg(180 - a), deg(180 - b), deg(exterior + a - 180)]),
      explanation: `An exterior angle of a triangle equals the sum of the two interior angles that are not next to it:\n\\[\\angle A+\\angle B=${exterior}^\\circ\\quad\\Rightarrow\\quad \\angle B=${exterior}^\\circ-${a}^\\circ=${b}^\\circ.\\]\n(The interior angle at C is \\(180^\\circ-${exterior}^\\circ=${180 - exterior}^\\circ\\), and \\(${a}+${b}+${180 - exterior}=180\\).)` };
  }),
  family('triangle-pythagorean', 'Right triangle side lengths', 2, rng => {
    const [a, b, c] = rng.pick(triples), form = rng.int(0, 2);
    if (form === 0) return { prompt: `A ${c}-foot ladder leans against a vertical wall. The bottom of the ladder is ${a} feet from the base of the wall. How many feet above the ground does the ladder touch the wall?`, answer: num(b), wrong: [num(c - a), num(c + a), num(Math.round(Math.sqrt(c * c + a * a))), num(b + 2)],
      explanation: `The ladder, wall, and ground form a right triangle with the ladder as the hypotenuse:\n\\[${a}^2+h^2=${c}^2\\quad\\Rightarrow\\quad h^2=${tx(c * c)}-${tx(a * a)}=${tx(b * b)}\\quad\\Rightarrow\\quad h=${b}.\\]\nSubtract the squares; the ladder is the longest side.` };
    if (form === 1) return { prompt: `A rectangle is ${a} centimeters wide and ${b} centimeters long. What is the length, in centimeters, of a diagonal of the rectangle?`, answer: num(c), wrong: [num(a + b), num(2 * (a + b)), num(c + 2), num(Math.round(c * 1.5))],
      explanation: `A diagonal splits the rectangle into two right triangles with legs ${a} and ${b}:\n\\[d^2=${a}^2+${b}^2=${tx(a * a)}+${tx(b * b)}=${tx(c * c)}\\quad\\Rightarrow\\quad d=${c}.\\]` };
    return { prompt: `A hiker walks ${a} miles due north and then ${b} miles due east. How many miles is the hiker from the starting point?`, answer: num(c), wrong: [num(a + b), num(Math.abs(b - a)), num(c + 2), num(Math.round(c * 1.5))],
      explanation: `North and east are perpendicular, so the two legs of the walk form a right triangle:\n\\[d^2=${a}^2+${b}^2=${tx(a * a)}+${tx(b * b)}=${tx(c * c)}\\quad\\Rightarrow\\quad d=${c}.\\]\nThe straight-line distance is shorter than the \\(${a}+${b}=${a + b}\\) miles walked.` };
  }),
  family('triangle-possible-side', 'A possible third side', 2, rng => {
    const a = rng.int(4, 12), b = a + rng.int(2, 9), low = b - a, high = a + b, valid = rng.int(low + 1, high - 1);
    return { prompt: `Two sides of a triangle are ${a} centimeters and ${b} centimeters long. Which of the following could be the length, in centimeters, of the third side?`, answer: num(valid), wrong: [num(low), num(high), num(high + rng.int(1, 6)), num(low - 1)].filter(choice => choice.value! > 0),
      explanation: `The third side must be longer than the difference of the other two sides and shorter than their sum:\n\\[${b}-${a}<\\text{third side}<${b}+${a}\\quad\\Rightarrow\\quad ${low}<\\text{third side}<${high}.\\]\nOnly ${valid} is strictly between ${low} and ${high}. A side of exactly ${low} or ${high} would make the triangle collapse flat.` };
  }),
  family('triangle-side-count', 'Counting possible third sides', 3, rng => {
    const a = rng.int(3, 11), b = a + rng.int(1, 8), count = 2 * a - 1;
    return { prompt: `Two sides of a triangle have lengths ${a} and ${b}. The length of the third side is a whole number. How many different lengths are possible for the third side?`, answer: num(count), wrong: [num(2 * a), num(2 * a + 1), num(a + b - 1), num(b - a + 1)],
      explanation: `The third side must be greater than \\(${b}-${a}=${b - a}\\) and less than \\(${b}+${a}=${a + b}\\).\nThe whole numbers from ${b - a + 1} through ${a + b - 1} work: \\(${a + b - 1}-${b - a + 1}+1=${count}\\) lengths.` };
  }),
];

// ---- Quadrilaterals & Polygons ----
export const quadrilateralsPolygons: Family[] = [
  family('quadrilateral-fourth-angle', 'Fourth angle of a quadrilateral', 1, rng => {
    const a = rng.int(80, 120), b = rng.int(60, 110), c = rng.int(50, 100), fourth = 360 - a - b - c;
    return { prompt: `Three angles of a quadrilateral measure \\(${a}^\\circ\\), \\(${b}^\\circ\\), and \\(${c}^\\circ\\). What is the measure of the fourth angle?`, answer: deg(fourth), wrong: positive([deg(a + b + c - 180), deg(540 - a - b - c), deg(360 - a - b), deg(fourth + 20)]),
      explanation: `The angles of any quadrilateral add to \\(360^\\circ\\):\n\\[360-${a}-${b}-${c}=${fourth}^\\circ.\\]` };
  }),
  family('polygon-angle-sum', 'Sum of interior angles', 2, rng => {
    const n = rng.int(5, 20), sum = 180 * (n - 2);
    if (rng.bool()) return { prompt: `The sum of the measures of the interior angles of a polygon is \\(${tx(sum)}^\\circ\\). How many sides does the polygon have?`, answer: num(n), wrong: [num(n - 2), num(n - 1), num(n + 2), num(n + 1)],
      explanation: `A polygon with \\(n\\) sides has an interior angle sum of \\((n-2)\\times180^\\circ\\).\n\\[(n-2)\\times180=${tx(sum)}\\quad\\Rightarrow\\quad n-2=${n - 2}\\quad\\Rightarrow\\quad n=${n}.\\]\nDividing by 180 gives the number of triangles, which is 2 fewer than the number of sides.` };
    return { prompt: `What is the sum of the measures of the interior angles of a polygon with ${n} sides?`, answer: deg(sum), wrong: [deg(180 * n), deg(360), deg(180 * (n - 1)), deg(90 * n)],
      explanation: `A polygon with \\(n\\) sides can be cut into \\(n-2\\) triangles, each with angles adding to \\(180^\\circ\\):\n\\[(${n}-2)\\times180^\\circ=${n - 2}\\times180^\\circ=${tx(sum)}^\\circ.\\]` };
  }),
  family('polygon-regular-angle', 'Angles of a regular polygon', 2, rng => {
    const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), exterior = 360 / n, interior = 180 - exterior, askInterior = rng.bool();
    return { prompt: `What is the measure of each ${askInterior ? 'interior' : 'exterior'} angle of a regular polygon with ${n} sides?`, answer: deg(askInterior ? interior : exterior), wrong: askInterior ? [deg(exterior), deg(180 * (n - 2)), deg(interior - 10), deg(180 - exterior / 2)] : [deg(interior), deg(180 / n), deg(exterior * 2), deg(exterior + 10)],
      explanation: `The exterior angles of any polygon add to \\(360^\\circ\\), and a regular polygon has ${n} equal ones: \\(360\\div${n}=${exterior}^\\circ\\).\n${askInterior ? `Each interior angle is the supplement: \\(180^\\circ-${exterior}^\\circ=${interior}^\\circ\\). (Or \\(\\frac{(${n}-2)\\times180}{${n}}=${interior}\\).)` : `The interior angle next to it is \\(180^\\circ-${exterior}^\\circ=${interior}^\\circ\\), but the question asks for the exterior angle.`}` };
  }),
  family('polygon-sides-from-angle', 'Number of sides from an angle', 3, rng => {
    const n = rng.pick([5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40]), interior = 180 - 360 / n;
    if (rng.bool()) return { prompt: `Each exterior angle of a regular polygon measures \\(${360 / n}^\\circ\\). How many sides does the polygon have?`, answer: num(n), wrong: [num(n - 1), num(n + 1), num(n + 2), num(n * 2)],
      explanation: `The exterior angles of any polygon add to \\(360^\\circ\\). A regular polygon's exterior angles are all equal, so the number of sides is\n\\[360\\div${360 / n}=${n}.\\]` };
    return { prompt: `Each interior angle of a regular polygon measures \\(${interior}^\\circ\\). How many sides does the polygon have?`, answer: num(n), wrong: [num(n - 1), num(n + 1), num(n + 2), num(n * 2)],
      explanation: `Each exterior angle is \\(180^\\circ-${interior}^\\circ=${360 / n}^\\circ\\). The exterior angles of any polygon add to \\(360^\\circ\\), so the number of sides is\n\\[360\\div${360 / n}=${n}.\\]` };
  }),
  family('parallelogram-algebra', 'Parallelogram angles with a variable', 3, rng => {
    let a = 3, b = 10, c = 2, x = 20;
    for (let tries = 0; tries < 60; tries++) { const a0 = rng.int(2, 5), c0 = rng.int(1, 4), x0 = rng.int(8, 26), b0 = rng.int(1, 20), angle = a0 * x0 + b0, d0 = 180 - (a0 + c0) * x0 - b0; if (angle >= 35 && angle <= 145 && angle !== 90 && Math.abs(d0) <= 60 && d0 !== 0) { a = a0; b = b0; c = c0; x = x0; break; } }
    const d = 180 - (a + c) * x - b, angleA = a * x + b;
    return { prompt: `In parallelogram ABCD, the measure of angle A is \\((${a}x+${b})^\\circ\\) and the measure of angle B is \\((${c === 1 ? '' : c}x${signed(d)})^\\circ\\). What is the measure of angle A?`, answer: deg(angleA), wrong: [deg(180 - angleA), deg(x), deg(angleA + 10), deg(Math.abs(angleA - 20))],
      explanation: `Angles A and B are next to each other in a parallelogram, so they are supplementary:\n\\[(${a}x+${b})+(${c === 1 ? '' : c}x${signed(d)})=180\\quad\\Rightarrow\\quad ${a + c}x${b + d === 0 ? '' : signed(b + d)}=180\\quad\\Rightarrow\\quad x=${x}.\\]\nAngle A measures \\(${a}(${x})+${b}=${angleA}^\\circ\\). The value of \\(x\\) is not the final answer.` };
  }),
];

// ---- Circles ----
export const circles: Family[] = [
  family('circle-basic', 'Circumference and area', 1, rng => {
    const r = rng.int(3, 25);
    if (rng.bool()) return { prompt: `A circle has a diameter of ${2 * r} centimeters. What is the area of the circle, in square centimeters?`, answer: piTerm(r * r), wrong: [piTerm(4 * r * r), piTerm(2 * r), piTerm(r), piTerm(2 * r * r)],
      explanation: `The radius is half the diameter: \\(${2 * r}\\div2=${r}\\).\n\\[A=\\pi r^2=\\pi(${r})^2=${r * r}\\pi.\\]\nUsing the diameter in place of the radius gives an area four times too large.` };
    return { prompt: `A circle has a radius of ${r} inches. What is the circumference of the circle, in inches?`, answer: piTerm(2 * r), wrong: [piTerm(r * r), piTerm(r), piTerm(4 * r), piTerm(2 * r * r)],
      explanation: `Circumference is \\(2\\pi r\\) (or \\(\\pi d\\)):\n\\[C=2\\pi(${r})=${2 * r}\\pi.\\]\n\\(\\pi r^2=${r * r}\\pi\\) is the area, not the circumference.` };
  }),
  family('circle-area-circumference', 'From circumference to area', 2, rng => {
    const r = rng.int(3, 25);
    if (rng.bool()) return { prompt: `The circumference of a circle is \\(${2 * r}\\pi\\) meters. What is the area of the circle, in square meters?`, answer: piTerm(r * r), wrong: [piTerm(4 * r * r), piTerm(r), piTerm(2 * r * r), piTerm(2 * r)],
      explanation: `From \\(C=2\\pi r\\): \\(2\\pi r=${2 * r}\\pi\\), so \\(r=${r}\\).\n\\[A=\\pi r^2=${r * r}\\pi.\\]` };
    return { prompt: `The area of a circle is \\(${r * r}\\pi\\) square meters. What is the circumference of the circle, in meters?`, answer: piTerm(2 * r), wrong: [piTerm(r), piTerm(4 * r), piTerm(clean(r * r / 2)), piTerm(r * r)],
      explanation: `From \\(A=\\pi r^2\\): \\(r^2=${r * r}\\), so \\(r=${r}\\).\n\\[C=2\\pi r=${2 * r}\\pi.\\]` };
  }),
  family('circle-semicircle-perimeter', 'Perimeter of a semicircle', 2, rng => {
    const d = 2 * rng.int(2, 30), half = d / 2, shape = rng.pick(['A plaza', 'A garden bed', 'A skating rink', 'A stage']);
    return { prompt: `${shape} has the shape of a semicircle with a diameter of ${d} feet. What is the perimeter of the semicircle, in feet?`, answer: tex(`${half}\\pi+${d}`, `${half}π + ${d}`), wrong: [tex(`${d}\\pi+${d}`, `${d}π + ${d}`), tex(`${half}\\pi`, `${half}π`), tex(`${half}\\pi+${half}`, `${half}π + ${half}`), tex(`${d}\\pi`, `${d}π`)],
      explanation: `The perimeter has two parts: the curved edge and the straight diameter.\nCurved edge: half of the full circumference, \\(\\frac{1}{2}\\times${d}\\pi=${half}\\pi\\).\nStraight edge: ${d}.\n\\[${half}\\pi+${d}\\]` };
  }),
  family('circle-inscribed-square', 'Region between a square and a circle', 3, rng => {
    const s = 2 * rng.int(3, 20), r = s / 2, option = (first: number, second: number) => tex(`${tx(first)}-${tx(second)}\\pi`, `${fmt(first)} - ${fmt(second)}π`);
    return { prompt: `A circle is inscribed in a square with a side length of ${s} inches, so the circle touches all four sides. What is the area, in square inches, of the region inside the square but outside the circle?`, answer: option(s * s, r * r), wrong: [option(s * s, s * s), option(s * s, s), option(4 * s, s), option(s * s, 2 * r * r)],
      explanation: `The circle's diameter equals the side of the square, so its radius is \\(${s}\\div2=${r}\\).\nSquare: \\(${s}^2=${s * s}\\). Circle: \\(\\pi(${r})^2=${r * r}\\pi\\).\n\\[${s * s}-${r * r}\\pi\\]` };
  }),
  family('circle-sector', 'Area of a sector', 3, rng => {
    const r = rng.pick([6, 12, 18, 24]), angle = rng.pick([30, 45, 60, 90, 120, 135, 150]), area = clean(r * r * angle / 360), arc = clean(2 * r * angle / 360);
    if (rng.bool()) return { prompt: `A circle has a radius of ${r} inches. An arc of the circle has a central angle of \\(${angle}^\\circ\\). What is the length of the arc, in inches?`, answer: piTerm(arc), wrong: [piTerm(area), piTerm(2 * r), piTerm(clean(arc * 2)), piTerm(clean(arc / 2))],
      explanation: `The arc is \\(\\frac{${angle}}{360}\\) of the whole circumference. The circumference is \\(2\\pi(${r})=${2 * r}\\pi\\).\n\\[\\frac{${angle}}{360}\\times${2 * r}\\pi=${piTerm(arc).math}.\\]\n(\\(${piTerm(area).math}\\) is the area of the sector, not the arc length.)` };
    return { prompt: `A circle has a radius of ${r} inches. A sector of the circle has a central angle of \\(${angle}^\\circ\\). What is the area of the sector, in square inches?`, answer: piTerm(area), wrong: [piTerm(arc), piTerm(r * r), piTerm(clean(area * 2)), piTerm(clean(area / 2))],
      explanation: `The sector is \\(\\frac{${angle}}{360}\\) of the whole circle. The whole circle's area is \\(\\pi(${r})^2=${r * r}\\pi\\).\n\\[\\frac{${angle}}{360}\\times${r * r}\\pi=${piTerm(area).math}.\\]\n(\\(${piTerm(arc).math}\\) is the length of the arc, not the area.)` };
  }),
];

// ---- Perimeter, Area & Composite Figures ----
function lShape(rng: Rng, askArea: boolean): Draft {
  const width = rng.int(8, 16), height = rng.int(6, 12), cutWidth = rng.int(2, width - 3), cutHeight = rng.int(2, height - 3), scale = Math.min(300 / width, 180 / height);
  const x0 = (520 - width * scale) / 2, y0 = (280 + height * scale) / 2, at = (x: number, y: number): Point => [x0 + x * scale, y0 - y * scale];
  const corners = [at(0, 0), at(width, 0), at(width, height - cutHeight), at(width - cutWidth, height - cutHeight), at(width - cutWidth, height), at(0, height)];
  const drawing = polygon(corners, '#f6f6f6') + label([x0 + width * scale / 2, y0 + 22], `${width} ft`) + label([x0 - 10, y0 - height * scale / 2 + 5], `${height} ft`, 'end')
    // The notch's width is labeled inside the floor and its height outside, so short notches stay readable.
    + label([x0 + (width - cutWidth / 2) * scale, y0 - (height - cutHeight) * scale + 19], `${cutWidth} ft`) + label([x0 + (width - cutWidth) * scale + 8, y0 - (height - cutHeight / 2) * scale + 5], `${cutHeight} ft`, 'start');
  const image = figure(drawing, `An L-shaped floor: ${article(width)} ${width}-foot by ${height}-foot rectangle with ${article(cutWidth)} ${cutWidth}-foot by ${cutHeight}-foot rectangle removed from one corner.`);
  const area = width * height - cutWidth * cutHeight, perimeter = 2 * (width + height);
  if (askArea) return { image, prompt: `The figure shows the floor plan of a room. All of the angles are right angles. What is the area of the floor, in square feet?`, answer: num(area), wrong: [num(width * height), num((width - cutWidth) * (height - cutHeight)), num(width * height + cutWidth * cutHeight), num(area - cutWidth - cutHeight)],
    explanation: `Think of the floor as ${article(width)} ${width}-by-${height} rectangle with ${article(cutWidth)} ${cutWidth}-by-${cutHeight} corner removed.\n\\[${width}\\times${height}-${cutWidth}\\times${cutHeight}=${width * height}-${cutWidth * cutHeight}=${area}.\\]` };
  return { image, prompt: `The figure shows the floor plan of a room. All of the angles are right angles. What is the perimeter of the floor, in feet?`, answer: num(perimeter), wrong: [num(perimeter - cutWidth - cutHeight), num(width + height + cutWidth + cutHeight), num(perimeter + 2 * (cutWidth + cutHeight)), num(area)],
    explanation: `The two unlabeled sides are \\(${width}-${cutWidth}=${width - cutWidth}\\) feet and \\(${height}-${cutHeight}=${height - cutHeight}\\) feet.\nAdd all six sides: \\(${width}+${height - cutHeight}+${cutWidth}+${cutHeight}+${width - cutWidth}+${height}=${perimeter}\\).\nThe notch moves two sides inward without changing their total length, so the perimeter equals that of the full ${width}-by-${height} rectangle: \\(2(${width}+${height})=${perimeter}\\).` };
}
export const perimeterArea: Family[] = [
  family('area-rectangle-from-perimeter', 'Area from a perimeter', 1, rng => {
    const length = rng.int(6, 20), width = rng.int(2, length - 1), perimeter = 2 * (length + width);
    return { prompt: `A rectangle has a perimeter of ${perimeter} centimeters and a length of ${length} centimeters. What is the area of the rectangle, in square centimeters?`, answer: num(length * width), wrong: [num(length * (perimeter - length)), num(2 * length * width), num(perimeter * length / 2), num(length * (width + 1))],
      explanation: `Half the perimeter is length plus width: \\(${perimeter}\\div2=${length + width}\\), so the width is \\(${length + width}-${length}=${width}\\).\n\\[${length}\\times${width}=${length * width}.\\]` };
  }),
  family('area-triangle-trapezoid', 'Area of a triangle or trapezoid', 2, rng => {
    if (rng.bool()) { const b1 = rng.int(4, 12), b2 = b1 + rng.int(2, 9), h = 2 * rng.int(2, 6), area = (b1 + b2) * h / 2;
      return { prompt: `A trapezoid has parallel bases of ${b1} inches and ${b2} inches and a height of ${h} inches. What is the area of the trapezoid, in square inches?`, answer: num(area), wrong: [num((b1 + b2) * h), num(b1 * b2 * h / 2), num(b2 * h), num(b1 * h)],
        explanation: `The area of a trapezoid is the average of the bases times the height:\n\\[\\frac{${b1}+${b2}}{2}\\times${h}=${(b1 + b2) / 2}\\times${h}=${area}.\\]` }; }
    const base = rng.int(5, 18), h = 2 * rng.int(2, 8), area = base * h / 2;
    return { prompt: `A triangle has a base of ${base} meters and a height of ${h} meters. What is the area of the triangle, in square meters?`, answer: num(area), wrong: [num(base * h), num(base + h), num(2 * base * h), num(area + base)],
      explanation: `A triangle is half of a rectangle with the same base and height:\n\\[\\frac{1}{2}\\times${base}\\times${h}=${area}.\\]` };
  }),
  family('area-walkway', 'Area of a border', 2, rng => {
    const a = rng.int(12, 30), b = rng.int(5, a - 2), w = rng.int(1, 4), answer = (a + 2 * w) * (b + 2 * w) - a * b;
    const story = rng.pick([['pool', 'walkway'], ['garden', 'gravel path'], ['playground', 'rubber border']]);
    return { prompt: `A rectangular ${story[0]} is ${a} feet long and ${b} feet wide. It is surrounded on all four sides by a ${story[1]} that is ${w} ${plural(w, 'foot', 'feet')} wide. What is the area of the ${story[1]}, in square feet?`, answer: num(answer), wrong: [num((a + w) * (b + w) - a * b), num(2 * w * (a + b)), num((a + 2 * w) * (b + 2 * w)), num(w * (a + b))],
      explanation: `The ${story[1]} adds ${w} ${plural(w, 'foot', 'feet')} on each side, so the outer rectangle is \\(${a}+2(${w})=${a + 2 * w}\\) by \\(${b}+2(${w})=${b + 2 * w}\\).\n\\[${a + 2 * w}\\times${b + 2 * w}-${a}\\times${b}=${(a + 2 * w) * (b + 2 * w)}-${a * b}=${answer}.\\]\nThe width is added twice to each dimension, once for each side.` };
  }),
  family('area-l-shape', 'Area of an L-shaped figure', 2, rng => lShape(rng, true)),
  family('perimeter-l-shape', 'Perimeter of an L-shaped figure', 3, rng => lShape(rng, false)),
  family('area-ratio-dimensions', 'Area from related dimensions', 3, rng => {
    const k = rng.pick([2, 3, 4]), w = rng.int(3, 12), perimeter = 2 * (k + 1) * w;
    return { prompt: `The length of a rectangle is ${k} times its width. The perimeter of the rectangle is ${perimeter} inches. What is the area of the rectangle, in square inches?`, answer: num(k * w * w), wrong: [num(w * w), num(k * k * w * w), num(k * w + w), num(perimeter * w)],
      explanation: `Let the width be \\(w\\). The length is \\(${k}w\\), and the perimeter is \\(2(w+${k}w)=${2 * (k + 1)}w\\).\n\\[${2 * (k + 1)}w=${perimeter}\\quad\\Rightarrow\\quad w=${w},\\ \\text{length}=${k * w}.\\]\nArea: \\(${k * w}\\times${w}=${k * w * w}\\).` };
  }),
  family('area-same-perimeter', 'Square and rectangle with equal perimeters', 3, rng => {
    const a = rng.int(3, 12), b = a + 2 * rng.int(1, 6), side = (a + b) / 2;
    return { prompt: `A square and a rectangle have the same perimeter. The rectangle is ${a} centimeters wide and ${b} centimeters long. What is the area of the square, in square centimeters?`, answer: num(side * side), wrong: [num(a * b), num((a + b) ** 2), num(2 * (a + b)), num(4 * side)],
      explanation: `Rectangle's perimeter: \\(2(${a}+${b})=${2 * (a + b)}\\). The square has the same perimeter, so each side is \\(${2 * (a + b)}\\div4=${side}\\).\n\\[${side}^2=${side * side}.\\]\nThe square's area (${side * side}) is larger than the rectangle's (${a * b}) even though the perimeters match.` };
  }),
];

// ---- Surface Area & Volume ----
export const surfaceAreaVolume: Family[] = [
  family('volume-prism', 'Volume of a rectangular prism', 1, rng => {
    const l = rng.int(3, 12), w = rng.int(2, 9), h = rng.int(2, 9), volume = l * w * h;
    if (rng.bool()) return { prompt: `A rectangular box is ${l} inches long, ${w} inches wide, and ${h} inches high. What is the volume of the box, in cubic inches?`, answer: num(volume), wrong: [num(2 * (l * w + l * h + w * h)), num(l + w + h), num(l * w + h), num(l * w + l * h + w * h)],
      explanation: `Volume of a rectangular prism is length times width times height:\n\\[${l}\\times${w}\\times${h}=${volume}.\\]` };
    return { prompt: `A rectangular box has a volume of ${volume} cubic inches. The box is ${l} inches long and ${w} inches wide. What is the height of the box, in inches?`, answer: num(h), wrong: [num(volume - l * w), num(Math.round(volume / (l + w))), num(w * h), num(h + 1)],
      explanation: `The base has area \\(${l}\\times${w}=${l * w}\\). Volume is base area times height:\n\\[${l * w}\\times h=${volume}\\quad\\Rightarrow\\quad h=${volume}\\div${l * w}=${h}.\\]` };
  }),
  family('volume-tank', 'Remaining volume of a tank', 2, rng => {
    const l = rng.int(4, 12), w = rng.int(3, 10), h = rng.int(5, 12), depth = rng.int(1, h - 2), answer = l * w * (h - depth);
    return { prompt: `A rectangular tank is ${l} feet long, ${w} feet wide, and ${h} feet high. It contains water to a depth of ${depth} ${plural(depth, 'foot', 'feet')}. How many more cubic feet of water are needed to fill the tank?`, answer: num(answer), wrong: [num(l * w * depth), num(l * w * h), num((h - depth) * (l + w)), num(l * w * (h - depth + 1))],
      explanation: `The empty part of the tank is ${l} by ${w} by \\(${h}-${depth}=${h - depth}\\) feet:\n\\[${l}\\times${w}\\times${h - depth}=${answer}.\\]\n(\\(${l * w * depth}\\) cubic feet is the water already in the tank.)` };
  }),
  family('volume-small-cubes', 'Packing cubes into a box', 2, rng => {
    const e = rng.pick([2, 3, 4]), a = rng.int(2, 6), b = rng.int(2, 5), c = rng.int(2, 5), l = a * e, w = b * e, h = c * e;
    return { prompt: `A box is ${l} inches long, ${w} inches wide, and ${h} inches high. How many cubes with an edge length of ${e} inches are needed to fill the box completely?`, answer: num(a * b * c), wrong: [num(l * w * h / e), num(l * w * h / (e * e)), num(l * w * h), num(a + b + c)],
      explanation: `Count how many cubes fit along each edge: \\(${l}\\div${e}=${a}\\), \\(${w}\\div${e}=${b}\\), and \\(${h}\\div${e}=${c}\\).\n\\[${a}\\times${b}\\times${c}=${a * b * c}.\\]\n(Each cube has volume \\(${e}^3=${e ** 3}\\), and \\(${tx(l * w * h)}\\div${e ** 3}=${a * b * c}\\).)` };
  }),
  family('surface-area-prism', 'Surface area of a rectangular prism', 2, rng => {
    const l = rng.int(3, 10), w = rng.int(2, 8), h = rng.int(2, 8), area = 2 * (l * w + l * h + w * h);
    return { prompt: `A closed rectangular box is ${l} centimeters long, ${w} centimeters wide, and ${h} centimeters high. What is the total surface area of the box, in square centimeters?`, answer: num(area), wrong: [num(l * w * h), num(area / 2), num(4 * (l + w + h)), num(area - 2 * l * w)],
      explanation: `The box has three pairs of matching faces:\n\\[2(${l}\\times${w})+2(${l}\\times${h})+2(${w}\\times${h})=${2 * l * w}+${2 * l * h}+${2 * w * h}=${area}.\\]` };
  }),
  family('volume-cube-from-surface', 'Cube: surface area to volume', 3, rng => {
    const e = rng.int(2, 12), surface = 6 * e * e;
    if (rng.bool()) return { prompt: `The volume of a cube is ${tx(e ** 3).replace(/\{,\}/g, ',')} cubic inches. What is the total surface area of the cube, in square inches?`, answer: num(surface), wrong: [num(e * e), num(4 * e * e), num(12 * e), num(6 * e)],
      explanation: `Find the edge first: \\(${e}\\times${e}\\times${e}=${tx(e ** 3)}\\), so each edge is ${e}.\nA cube has 6 square faces, each with area \\(${e}^2=${e * e}\\):\n\\[6\\times${e * e}=${surface}.\\]` };
    return { prompt: `The total surface area of a cube is ${surface} square inches. What is the volume of the cube, in cubic inches?`, answer: num(e ** 3), wrong: [num(e * e), num(6 * e ** 3), num(surface), num((e + 1) ** 3)],
      explanation: `A cube has 6 equal square faces, so each face has area \\(${surface}\\div6=${e * e}\\) and each edge is \\(${e}\\).\n\\[${e}^3=${tx(e ** 3)}.\\]` };
  }),
];

// ---- Coordinate Geometry & Transformations ----
export const coordinateGeometry: Family[] = [
  family('coordinate-midpoint', 'Midpoint of a segment', 1, rng => {
    const x1 = rng.int(-8, 6), y1 = rng.int(-8, 6), dx = 2 * rng.int(1, 5), dy = 2 * rng.int(1, 5) * (rng.bool() ? 1 : -1), x2 = x1 + dx, y2 = y1 + dy, mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return { prompt: `What are the coordinates of the midpoint of the segment with endpoints \\((${x1},\\ ${y1})\\) and \\((${x2},\\ ${y2})\\)?`, answer: point(mx, my), wrong: [point(dx / 2, dy / 2), point(x1 + x2, y1 + y2), point(my, mx), point(mx, -my)],
      explanation: `Average the \\(x\\)-coordinates and average the \\(y\\)-coordinates:\n\\[\\left(\\frac{${x1}+(${x2})}{2},\\ \\frac{${y1}+(${y2})}{2}\\right)=(${mx},\\ ${my}).\\]\nSubtracting instead of adding gives half the distance, not the midpoint.` };
  }),
  family('coordinate-rectangle-area', 'Area of a rectangle on the coordinate plane', 2, rng => {
    const a = rng.int(-8, -1), c = rng.int(1, 8), b = rng.int(-6, -1), d = rng.int(1, 7), width = c - a, height = d - b;
    return { prompt: `A rectangle has vertices at \\((${a},\\ ${b})\\), \\((${c},\\ ${b})\\), \\((${c},\\ ${d})\\), and \\((${a},\\ ${d})\\). What is the area of the rectangle, in square units?`, answer: num(width * height), wrong: [num(2 * (width + height)), num(c * d), num(Math.abs((c + a) * (d + b)) || 1), num(width + height)],
      explanation: `Width: from \\(x=${a}\\) to \\(x=${c}\\) is \\(${c}-(${a})=${width}\\) units. Height: from \\(y=${b}\\) to \\(y=${d}\\) is \\(${d}-(${b})=${height}\\) units.\n\\[${width}\\times${height}=${width * height}.\\]\nSubtracting a negative coordinate adds its distance from 0.` };
  }),
  family('coordinate-transform', 'Reflections and translations', 2, rng => {
    const a = rng.int(1, 7) * (rng.bool() ? 1 : -1), b = rng.int(1, 7) * (rng.bool() ? 1 : -1), h = rng.int(1, 6) * (rng.bool() ? 1 : -1), k = rng.int(1, 6) * (rng.bool() ? 1 : -1), overX = rng.bool();
    const reflected = overX ? [a, -b] : [-a, b], other = overX ? [-a, b] : [a, -b];
    return { prompt: `Point P is located at \\((${a},\\ ${b})\\). It is reflected across the \\(${overX ? 'x' : 'y'}\\)-axis, and then the image is translated ${Math.abs(h)} ${plural(Math.abs(h), 'unit')} ${h > 0 ? 'right' : 'left'} and ${Math.abs(k)} ${plural(Math.abs(k), 'unit')} ${k > 0 ? 'up' : 'down'}. What are the coordinates of the final image?`, answer: point(reflected[0] + h, reflected[1] + k), wrong: [point(other[0] + h, other[1] + k), point(a + h, b + k), point(-a + h, -b + k), point(reflected[0] - h, reflected[1] - k)],
      explanation: `Reflecting across the \\(${overX ? 'x' : 'y'}\\)-axis changes the sign of the \\(${overX ? 'y' : 'x'}\\)-coordinate: \\((${reflected[0]},\\ ${reflected[1]})\\).\nThen move ${h > 0 ? 'right' : 'left'} ${Math.abs(h)} (${h > 0 ? 'add to' : 'subtract from'} \\(x\\)) and ${k > 0 ? 'up' : 'down'} ${Math.abs(k)} (${k > 0 ? 'add to' : 'subtract from'} \\(y\\)): \\((${reflected[0] + h},\\ ${reflected[1] + k})\\).` };
  }),
  family('coordinate-number-line-midpoint', 'Finding an endpoint from a midpoint', 3, rng => {
    const p = rng.int(-15, 5), m = p + rng.int(3, 12), q = 2 * m - p;
    return { prompt: `On a number line, point M is the midpoint of segment PQ. Point P is located at \\(${p}\\) and point M is located at \\(${m}\\). At what number is point Q located?`, answer: num(q), wrong: [num(clean((p + m) / 2)), num(m - p), num(m + p), num(2 * m + p)],
      explanation: `The distance from P to M is \\(${m}-(${p})=${m - p}\\). Q is the same distance on the other side of M:\n\\[${m}+${m - p}=${q}.\\]\nAveraging P and M would find a point between them, not Q.` };
  }),
  family('coordinate-triangle-area', 'Area of a triangle on the coordinate plane', 3, rng => {
    const a = rng.int(-7, 0), base = 2 * rng.int(2, 5), c = a + base, b = rng.int(-5, 2), height = rng.int(3, 9), e = rng.int(a - 1, c + 2), f = b + height, area = base * height / 2;
    return { prompt: `A triangle has vertices at \\((${a},\\ ${b})\\), \\((${c},\\ ${b})\\), and \\((${e},\\ ${f})\\). What is the area of the triangle, in square units?`, answer: num(area), wrong: [num(base * height), num(base + height), num(area + base), num(Math.abs(area - height) || area + 1)],
      explanation: `Two vertices share \\(y=${b}\\), so use that side as the base: \\(${c}-(${a})=${base}\\) units.\nThe height is the vertical distance from the third vertex to that side: \\(${f}-(${b})=${height}\\) units.\n\\[\\frac{1}{2}\\times${base}\\times${height}=${area}.\\]` };
  }),
  family('coordinate-distance', 'Distance between two points', 3, rng => {
    const [a, b, c] = rng.pick(triples.slice(0, 9)), x1 = rng.int(-6, 4), y1 = rng.int(-6, 4), swap = rng.bool(), dx = (swap ? b : a) * (rng.bool() ? 1 : -1), dy = (swap ? a : b) * (rng.bool() ? 1 : -1);
    return { prompt: `What is the distance between the points \\((${x1},\\ ${y1})\\) and \\((${x1 + dx},\\ ${y1 + dy})\\) on the coordinate plane?`, answer: num(c), wrong: [num(a + b), num(Math.abs(b - a)), num(a * a + b * b), num(c + 2)],
      explanation: `The horizontal change is ${Math.abs(dx)} and the vertical change is ${Math.abs(dy)}. These are the legs of a right triangle whose hypotenuse is the distance:\n\\[d^2=${Math.abs(dx)}^2+${Math.abs(dy)}^2=${dx * dx}+${dy * dy}=${c * c}\\quad\\Rightarrow\\quad d=${c}.\\]` };
  }),
];

// ---- Similarity, Scale & Proportional Geometry ----
export const similarityScale: Family[] = [
  family('scale-map', 'Map scales', 1, rng => {
    const m = rng.pick([4, 6, 8, 10, 12, 20, 50]), d = rng.int(3, 19) / 2, actual = m * d;
    if (rng.bool()) return { prompt: `On a map, 1 inch represents ${m} miles. Two towns are ${d} inches apart on the map. What is the actual distance between the towns, in miles?`, answer: num(actual), wrong: [num(clean(m + d)), num(actual * 2), num(clean(actual / 2)), num(actual + m)],
      explanation: `Each inch on the map stands for ${m} miles, so multiply:\n\\[${d}\\times${m}=${actual}.\\]` };
    return { prompt: `On a map, 1 inch represents ${m} miles. Two towns are actually ${actual} miles apart. How many inches apart are they on the map?`, answer: num(d), wrong: [num(actual * m), num(clean(d * 2)), num(clean(d + 1)), num(clean(d / 2))],
      explanation: `Divide the actual distance by the number of miles each inch represents:\n\\[${actual}\\div${m}=${d}.\\]` };
  }),
  family('scale-shadow', 'Similar triangles and shadows', 2, rng => {
    const [hn, sn] = rng.pick([[1, 2], [2, 3], [3, 2], [3, 4], [4, 3], [5, 4], [2, 1], [5, 2], [3, 5], [4, 5]]), k1 = rng.int(2, 4), k2 = rng.int(5, 12), h1 = hn * k1, s1 = sn * k1, s2 = sn * k2, answer = hn * k2;
    return { prompt: `${article(h1) === 'an' ? 'An' : 'A'} ${h1}-foot pole casts ${article(s1)} ${s1}-foot shadow. At the same time, a nearby tree casts ${article(s2)} ${s2}-foot shadow. How tall is the tree, in feet?`, answer: num(answer), wrong: [num(h1 + (s2 - s1)), num(Math.round(s2 * s1 / h1)), num(Math.abs(s2 - h1) || answer + 2), num(answer + h1)],
      explanation: `The sun's rays make similar right triangles, so height and shadow are proportional:\n\\[\\frac{${h1}}{${s1}}=\\frac{h}{${s2}}\\quad\\Rightarrow\\quad h=\\frac{${h1}\\times${s2}}{${s1}}=${answer}.\\]\nThe shadows differ by a factor, not by a fixed number of feet.` };
  }),
  family('scale-similar-perimeter', 'Perimeter of a similar triangle', 2, rng => {
    const base = rng.pick([[3, 4, 5], [4, 5, 6], [2, 3, 4], [5, 7, 8], [3, 5, 6], [5, 6, 7]]), q = rng.pick([2, 4]), p = rng.pick([3, 5, 6]), sides = base.map(side => side * q), sum = base[0] + base[1] + base[2];
    return { prompt: `A triangle has side lengths of ${sides[0]}, ${sides[1]}, and ${sides[2]} centimeters. A similar triangle has a shortest side of ${base[0] * p} centimeters. What is the perimeter of the similar triangle, in centimeters?`, answer: num(sum * p), wrong: [num(sum * q + (base[0] * p - base[0] * q) * 1), num(sum * q), num(sum * q + 3 * Math.abs(base[0] * p - base[0] * q)), num(sum * p + base[0])],
      explanation: `The scale factor compares matching sides: \\(${base[0] * p}\\div${sides[0]}=${clean(p / q)}\\).\nEvery side, and so the perimeter, is multiplied by the same factor. The original perimeter is \\(${sides[0]}+${sides[1]}+${sides[2]}=${sum * q}\\).\n\\[${sum * q}\\times${clean(p / q)}=${sum * p}.\\]` };
  }),
  family('scale-area-factor', 'Areas of similar figures', 3, rng => {
    const [a, b] = rng.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4], [4, 5]]), k = rng.int(2, 9), small = a * a * k, large = b * b * k;
    return { prompt: `Two similar triangles have corresponding side lengths in the ratio ${a}:${b}. The area of the smaller triangle is ${small} square centimeters. What is the area of the larger triangle, in square centimeters?`, answer: num(large), wrong: [num(a * b * k), num(small * b * b), num(small * b), num(small + (b - a))],
      explanation: `When lengths are multiplied by a scale factor, areas are multiplied by the square of that factor. The areas are in the ratio \\(${a}^2:${b}^2=${a * a}:${b * b}\\).\n\\[\\frac{${small}}{${a * a}}=${k}\\quad\\Rightarrow\\quad ${k}\\times${b * b}=${large}.\\]` };
  }),
];
