import type { ExamQuestion } from '../examTypes';
import { practiceGenerators } from '../infinitePractice';
import { algebraicExpressions, equationsSystems, functionsGraphs, inequalities, patternsSequences } from './algebra';
import { exponentsRoots, fractionsDecimals, integersAbsoluteValue, numberProperties, orderOfOperations, unitsConversions } from './arithmetic';
import { circles, coordinateGeometry, linesAngles, perimeterArea, quadrilateralsPolygons, similarityScale, surfaceAreaVolume, triangles } from './geometry';
import { extraArea, extraAverages, extraCircles, extraCoordinate, extraDataDisplays, extraEquations, extraExponents, extraExpressions, extraFractions, extraFunctions, extraInequalities, extraIntegers, extraNumberProperties, extraOrderOfOperations, extraPercentages, extraPolygons, extraProbability, extraRates, extraRatios, extraSequences, extraSimilarity, extraTriangles, extraUnits } from './foundations';
import type { Family, Level } from './kit';
import { percentages, rates, ratiosProportions } from './ratios';
import { averagesSpread, countingSets, dataDisplays, probability } from './statistics';

/** One SHSAT math topic the adaptive exam tracks. Labels match the shared math taxonomy. */
export type AdaptiveTopic = { id: string; category: string; label: string; /** Relative share of SHSAT math questions. */ weight: number; families: Family[] };

/** Reuse a practice generator students already have; skipped quietly if it is ever retired. */
function existing(id: string, level: Level): Family[] {
  const generator = practiceGenerators.find(item => item.id === id && item.enabled !== false);
  return generator ? [{ id, title: generator.title, level, generate: (index, seed) => generator.generate(index, seed) }] : [];
}
function topic(id: string, category: string, label: string, weight: number, families: Family[]): AdaptiveTopic {
  // Every question reports the exam's own category and topic, whichever generator produced it.
  return { id, category, label, weight, families: families.map(item => ({ ...item, generate: (index, seed): ExamQuestion => ({ ...item.generate(index, seed), topic: category, subtopic: label }) })) };
}

const arithmetic = 'Arithmetic & Number Sense', ratios = 'Ratios and Proportional Relationships', algebra = 'Algebra', geometry = 'Geometry', statistics = 'Statistics and Probability';
export const adaptiveTopics: AdaptiveTopic[] = [
  topic('number-properties', arithmetic, 'Number Types & Properties', 3, [...numberProperties, ...extraNumberProperties]),
  topic('integers-absolute-value', arithmetic, 'Integers & Absolute Value', 2, [...integersAbsoluteValue, ...extraIntegers]),
  topic('fractions-decimals', arithmetic, 'Fractions & Decimals', 4, [...fractionsDecimals, ...extraFractions]),
  topic('order-of-operations', arithmetic, 'Order of Operations', 2, [...orderOfOperations, ...extraOrderOfOperations]),
  topic('exponents-roots', arithmetic, 'Exponents, Roots & Scientific Notation', 3, [...exponentsRoots, ...extraExponents]),
  topic('units-conversions', arithmetic, 'Units & Conversions', 2, [...unitsConversions, ...extraUnits]),
  topic('ratios-proportions', ratios, 'Ratios & Proportions', 4, [...ratiosProportions, ...extraRatios, ...existing('ratio-mixture-amounts-v1', 2)]),
  topic('rates', ratios, 'Rates & Unit Rates', 3, [...rates, ...extraRates, ...existing('remaining-reading-time-v1', 2)]),
  topic('percentages', ratios, 'Percentages', 4, [...percentages, ...extraPercentages]),
  topic('algebraic-expressions', algebra, 'Algebraic Expressions', 4, [...algebraicExpressions, ...extraExpressions]),
  topic('equations-systems', algebra, 'Equations & Systems', 5, [...equationsSystems, ...extraEquations]),
  topic('inequalities', algebra, 'Inequalities', 3, [...existing('inequalities-foundation-v1', 1), ...existing('one-step-inequalities-v1', 2), ...inequalities, ...extraInequalities, ...existing('variables-both-sides-inequalities-v1', 3)]),
  topic('functions-graphs', algebra, 'Functions & Graphs', 2, [...functionsGraphs, ...extraFunctions]),
  topic('patterns-sequences', algebra, 'Patterns & Sequences', 2, [...patternsSequences, ...extraSequences]),
  topic('lines-angles', geometry, 'Lines & Angles', 2, [...linesAngles, ...existing('geometry-rectangle-transversal-v1', 2), ...existing('geometry-perpendicular-transversal-v1', 2), ...existing('geometry-intersecting-lines-v1', 3)]),
  topic('triangles', geometry, 'Triangles', 3, [...triangles, ...extraTriangles]),
  topic('quadrilaterals-polygons', geometry, 'Quadrilaterals & Polygons', 2, [...quadrilateralsPolygons, ...extraPolygons, ...existing('geometry-parallelogram-angles-v1', 2)]),
  topic('circles', geometry, 'Circles', 2, [...circles, ...extraCircles, ...existing('geometry-circle-area-difference-v1', 2)]),
  topic('perimeter-area', geometry, 'Perimeter, Area & Composite Figures', 3, [...perimeterArea, ...extraArea, ...existing('geometry-floor-tiles-v1', 2), ...existing('geometry-wheel-revolutions-v1', 3), ...existing('geometry-prism-cross-section-v1', 3)]),
  topic('surface-area-volume', geometry, 'Surface Area & Volume', 2, [...surfaceAreaVolume, ...existing('geometry-cube-volume-edge-v1', 1), ...existing('geometry-cube-building-v1', 2), ...existing('geometry-box-surface-area-v1', 2), ...existing('geometry-mixed-unit-volume-v1', 3)]),
  topic('coordinate-geometry', geometry, 'Coordinate Geometry & Transformations', 2, [...coordinateGeometry, ...extraCoordinate, ...existing('geometry-number-line-ratio-v1', 2), ...existing('geometry-fractional-number-line-v1', 3)]),
  topic('similarity-scale', geometry, 'Similarity, Scale & Proportional Geometry', 2, [...similarityScale, ...extraSimilarity, ...existing('geometry-scale-perimeter-v1', 3), ...existing('geometry-similar-rectangle-area-v1', 3)]),
  topic('data-displays', statistics, 'Data Displays & Sampling', 2, [...dataDisplays, ...extraDataDisplays]),
  topic('averages-spread', statistics, 'Averages & Spread', 4, [...averagesSpread, ...extraAverages]),
  topic('counting-sets', statistics, 'Counting & Sets', 2, [...countingSets, ...existing('combinatorics-counting-principle-routes-v1', 1), ...existing('combinatorics-one-from-each-group-v1', 1), ...existing('combinatorics-arrange-all-v1', 2), ...existing('overlapping-groups-v1', 2), ...existing('combinatorics-ordered-selection-v1', 2), ...existing('combinatorics-unordered-groups-v1', 3), ...existing('combinatorics-groups-including-one-v1', 3), ...existing('combinatorics-every-pair-cost-v1', 3), ...existing('combinatorics-size-and-toppings-v1', 3), ...existing('combinatorics-committee-exact-mix-v1', 3)]),
  topic('probability', statistics, 'Probability', 3, [...probability, ...extraProbability, ...existing('probability-with-replacement-v1', 2), ...existing('probability-cube-sum-counts-v1', 2), ...existing('probability-ratio-removal-v1', 2), ...existing('probability-spinner-products-v1', 2), ...existing('probability-same-color-no-replacement-v1', 3), ...existing('probability-ordered-draws-v1', 3), ...existing('probability-specific-conditional-outcome-v1', 3)]),
];
export const adaptiveCategories = [arithmetic, ratios, algebra, geometry, statistics];
export const adaptiveTopicById = new Map(adaptiveTopics.map(item => [item.id, item]));
export function adaptiveFamily(topicId: string, familyId: string) { return adaptiveTopicById.get(topicId)?.families.find(item => item.id === familyId); }
