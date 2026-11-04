/** Explicit destinations for the October 2026 subcategory reorganization.
 * Skill IDs, labels, question contents, and practice selections are not changed.
 */
export const mathSubcategoryMoves = [
  { category: 'Geometry', from: 'Shapes & Angles', to: 'Lines & Angles' },
  { category: 'Geometry', from: 'Coordinate Geometry', to: 'Coordinates & Segment Relationships' },
  { category: 'Geometry', from: 'Pythagorean Theorem', to: 'Triangles' },
  { category: 'Geometry', from: 'Scale & Transformations', to: 'Similarity & Scale Drawings' },
  { category: 'Statistics and Probability', from: 'Overlapping Groups', to: 'Set Relationships' },
  { category: 'Statistics and Probability', from: 'Probability', to: 'Basic Probability' },
  { category: 'Statistics and Probability', from: 'Counting & Sets', to: 'Counting & Combinations' },
  { category: 'Arithmetic & Number Sense', from: 'Number Properties', to: 'Number Types & Properties' },
  { category: 'Arithmetic & Number Sense', from: 'Fractions & Decimals', to: 'Fractions' },
  { category: 'Arithmetic & Number Sense', from: 'Number Operations', to: 'Integers & Absolute Value' },
  { category: 'Arithmetic & Number Sense', from: 'Counting & Sets', toCategory: 'Statistics and Probability', to: 'Counting & Combinations' },
  { category: 'Ratios and Proportional Relationships', from: 'Units & Conversions', toCategory: 'Arithmetic & Number Sense', to: 'Units & Conversions' },
];

export const mathSubcategoryConsolidations = [
  { category: 'Geometry', from: 'Triangles & Polygons', to: 'Quadrilaterals & Polygons' },
  { category: 'Geometry', from: 'Area & Perimeter', to: 'Perimeter, Area & Composite Figures' },
  { category: 'Geometry', from: 'Coordinates & Segment Relationships', to: 'Coordinate Geometry & Transformations' },
  { category: 'Geometry', from: 'Similarity & Scale Drawings', to: 'Similarity, Scale & Proportional Geometry' },
  {
    "category": "Algebra",
    "from": "Formulas & Rearranging Equations",
    "to": "Equations & Systems"
  },
  {
    "category": "Algebra",
    "from": "Algebraic Word Problems",
    "to": "Equations & Systems"
  },
  {
    "category": "Statistics and Probability",
    "from": "Data Displays",
    "to": "Data Displays & Sampling"
  },
  {
    "category": "Statistics and Probability",
    "from": "Sampling & Predictions",
    "to": "Data Displays & Sampling"
  },
  {
    "category": "Statistics and Probability",
    "from": "Counting & Combinations",
    "to": "Counting & Sets"
  },
  {
    "category": "Statistics and Probability",
    "from": "Set Relationships",
    "to": "Counting & Sets"
  },
  {
    "category": "Statistics and Probability",
    "from": "Basic Probability",
    "to": "Probability"
  },
  {
    "category": "Statistics and Probability",
    "from": "Compound Probability",
    "to": "Probability"
  },
  {
    "category": "Ratios and Proportional Relationships",
    "from": "Proportional Relationships",
    "to": "Ratios & Proportions"
  },
  {
    "category": "Ratios and Proportional Relationships",
    "from": "Percent Change & Applications",
    "to": "Percentages"
  },
  {
    "category": "Arithmetic & Number Sense",
    "from": "Fractions",
    "to": "Fractions & Decimals"
  },
  {
    "category": "Arithmetic & Number Sense",
    "from": "Decimals",
    "to": "Fractions & Decimals"
  }
];

export function consolidatedMathLocation(category: string, topic: string) {
 const move = mathSubcategoryConsolidations.find(item => item.category === category && item.from === topic);
 return {category, topic: move?.to ?? topic};
}

export function migratedMathLocation(category: string, topic: string) {
  const move = mathSubcategoryMoves.find(item => item.category === category && item.from === topic);
  return move ? consolidatedMathLocation(move.toCategory ?? category, move.to) : consolidatedMathLocation(category, topic);
}

/** Rehome existing definitions only; do not add, rename, or assign any skills. */
export function migratedMathSkillLocation(skill: { id: string; category: string; subcategory: string }) {
  const geometrySkills: Record<string,string> = { 'pythagorean-theorem': 'Triangles', 'circles': 'Circles', 'transformations': 'Coordinate Geometry & Transformations' };
  if (skill.category === 'Geometry' && geometrySkills[skill.id]) return {category: skill.category, subcategory: geometrySkills[skill.id]};
  const destination = migratedMathLocation(skill.category, skill.subcategory);
  const splitTopics: Record<string, { from: string; to: string }> = {
    'order-of-operations': { from: 'Number Operations', to: 'Order of Operations' },
    'decimal-operations': { from: 'Fractions & Decimals', to: 'Decimals' },
    'triangles-polygons': { from: 'Shapes & Angles', to: 'Triangles & Polygons' },
    'compound-probability': { from: 'Probability', to: 'Compound Probability' },
  };
  const split = splitTopics[skill.id];
  const final = consolidatedMathLocation(destination.category, split?.from === skill.subcategory ? split.to : destination.topic);
  return { category: final.category, subcategory: final.topic };
}

// Existing focused practice collections retain their membership and names.
export const probabilityPracticeTopics: Record<string, string> = {
  'probability-cube-sum-counts-v1': 'Counting & Combinations',
  'probability-spinner-products-v1': 'Counting & Combinations',
  'probability-unordered-sample-spaces-v1': 'Counting & Combinations',
  'probability-ratio-removal-v1': 'Compound Probability',
  'probability-ordered-draws-v1': 'Compound Probability',
  'probability-same-color-no-replacement-v1': 'Compound Probability',
  'probability-with-replacement-v1': 'Compound Probability',
  'probability-specific-conditional-outcome-v1': 'Compound Probability',
};
