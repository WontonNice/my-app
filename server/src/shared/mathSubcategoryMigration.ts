/** Explicit destinations for the October 2026 subcategory reorganization.
 * Skill IDs, labels, question contents, and practice selections are not changed.
 */
export const mathSubcategoryMoves = [
  { category: 'Geometry', from: 'Shapes & Angles', to: 'Lines & Angles' },
  { category: 'Geometry', from: 'Coordinate Geometry', to: 'Coordinates & Segment Relationships' },
  { category: 'Geometry', from: 'Pythagorean Theorem', to: 'Triangles & Polygons' },
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

export function migratedMathLocation(category: string, topic: string) {
  const move = mathSubcategoryMoves.find(item => item.category === category && item.from === topic);
  return move ? { category: move.toCategory ?? category, topic: move.to } : { category, topic };
}

/** Rehome existing definitions only; do not add, rename, or assign any skills. */
export function migratedMathSkillLocation(skill: { id: string; category: string; subcategory: string }) {
  const destination = migratedMathLocation(skill.category, skill.subcategory);
  const splitTopics: Record<string, { from: string; to: string }> = {
    'order-of-operations': { from: 'Number Operations', to: 'Order of Operations' },
    'decimal-operations': { from: 'Fractions & Decimals', to: 'Decimals' },
    'triangles-polygons': { from: 'Shapes & Angles', to: 'Triangles & Polygons' },
    'compound-probability': { from: 'Probability', to: 'Compound Probability' },
  };
  const split = splitTopics[skill.id];
  return { category: destination.category, subcategory: split?.from === skill.subcategory ? split.to : destination.topic };
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
