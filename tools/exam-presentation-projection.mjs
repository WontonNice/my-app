import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const defaultTypesPath = fileURLToPath(new URL('../server/src/shared/examTypes.ts', import.meta.url));

/** Derive the display schema from the player types so new declared fields survive imports. */
export function createExamPresentationProjector(typesPath = defaultTypesPath) {
  const program = ts.createProgram([typesPath], { strict: true, target: ts.ScriptTarget.ES2022, skipLibCheck: true });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(typesPath);
  if (!source) throw new Error(`Exam presentation types were not found: ${typesPath}`);
  const types = new Map(source.statements.filter(ts.isTypeAliasDeclaration).map(node => [node.name.text, checker.getTypeAtLocation(node)]));

  function project(value, declaredType, path, onDropped) {
    if (value === undefined || value === null || typeof value !== 'object') return value;
    const type = checker.getNonNullableType(declaredType);
    if (Array.isArray(value)) {
      if (!checker.isArrayType(type)) throw new TypeError(`${path} must not be an array.`);
      const element = checker.getTypeArguments(type)[0];
      return value.map((item, index) => project(item, element, `${path}[${index}]`, onDropped));
    }
    if (!(type.flags & (ts.TypeFlags.Object | ts.TypeFlags.Intersection))) throw new TypeError(`${path} must not be an object.`);
    if (type.aliasSymbol?.name === 'ExamSource') {
      value = { ...value };
      for (const [canonical, captured] of [['sourceId', 'examId'], ['url', 'sourceUrl'], ['label', 'title']]) {
        if (value[canonical] === undefined && value[captured] !== undefined) value[canonical] = String(value[captured]);
      }
    }
    if (type.aliasSymbol?.name === 'ExamPointGraph' && value.sourceImage) {
      // Captured grids already contain their labels. Empty fallback strings meet
      // the graph schema without adding duplicate or inferred visible labels.
      value = { ...value, xLabel: value.xLabel ?? '', yLabel: value.yLabel ?? '' };
    }
    const properties = new Map(checker.getPropertiesOfType(type).map(symbol => [symbol.name, symbol]));
    const indexType = checker.getIndexTypeOfType(type, ts.IndexKind.String);
    const entries = [];
    for (const [key, item] of Object.entries(value)) {
      const property = properties.get(key);
      const itemType = property ? checker.getTypeOfSymbolAtLocation(property, property.valueDeclaration || property.declarations[0]) : indexType;
      if (!itemType) { onDropped?.({ path: `${path}.${key}`, value: item }); continue; }
      entries.push([key, project(item, itemType, `${path}.${key}`, onDropped)]);
    }
    return Object.fromEntries(entries);
  }

  function projectNamed(value, name, onDropped, path = name) {
    const type = types.get(name);
    if (!type) throw new Error(`Missing declared exam type ${name}.`);
    return project(value, type, path, onDropped);
  }

  return {
    question: (value, onDropped) => projectNamed(value, 'ExamQuestion', onDropped),
    passage: (value, onDropped) => projectNamed(value, 'ExamPassage', onDropped),
    overrides(value, onDropped) {
      if (!value) return value;
      // Baselines are comparison evidence, not display payloads. Never sanitize or
      // project them: doing so could silently change overlay invalidation behavior.
      return {
        ...(value.questions ? { questions: Object.fromEntries(Object.entries(value.questions).map(([id, entry]) => [id, {
          base: entry.base,
          question: projectNamed(entry.question, 'ExamQuestion', onDropped, `questions.${id}.question`),
        }])) } : {}),
        ...(value.passages ? { passages: Object.fromEntries(Object.entries(value.passages).map(([id, entry]) => [id, {
          baseLines: entry.baseLines,
          passage: projectNamed(entry.passage, 'ExamPassage', onDropped, `passages.${id}.passage`),
        }])) } : {}),
      };
    },
  };
}

let defaultProjector;
export function projectExamPresentation(value, onDropped) {
  defaultProjector ||= createExamPresentationProjector();
  return defaultProjector.overrides(value, onDropped);
}
