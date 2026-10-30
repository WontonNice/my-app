import type { PassageCategory } from "./passageCategories";

export type ExamQuestionType =
  | "multiple_choice"
  | "multi_select"
  | "category_sort"
  | "graph_point_select"
  | "matrix_choice"
  | "table_match"
  | "inline_dropdown"
  | "math_drag_drop"
  | "number_line_response"
  | "transition_drop"
  | "short_response"
  | "numeric_entry"
  | "expression_entry"
  | "grid_in"
  | "essay";

export type ExamPassageSection =
  | "reading"
  | "revising_editing_a";

export type ExamPassageType = "informational" | "literary" | "long_reading" | "poem";

export type ExamSource = {
  sourceFamily?: string;
  sourceFormat?: string;
  /** Original source presentation metadata only. Every exam renders in the shared TestNav player. */
  playerProfile?: string;
  sourceId?: string;
  label?: string;
  url?: string;
  year?: string;
  form?: string;
  edition?: string;
  section?: string;
  sourceQuestion?: string;
  moduleQuestion?: string;
  passageId?: string;
  packageId?: string;
  originalPackageId?: string;
  pages?: number[];
};

export type ExamPassageLine = {
  align?: "left" | "center" | "right" | "justify" | "indent";
  html?: string;
  image?: ExamQuestionImage;
  kind?: "intro" | "title" | "byline" | "heading" | "list" | "image";
  lineNumber?: string;
  numbered?: boolean;
  poetryLine?: boolean;
  text: string;
};

export type ExamPassage = {
  source?: ExamSource;
  passageCategory?: PassageCategory;
  versionLabel?: string;
  coverImage?: ExamQuestionImage;
  format?: "poem" | "prose" | "sentence_prose";
  id: string;
  lines: ExamPassageLine[];
  passageType?: ExamPassageType;
  sourceNote?: string;
  sourceNoteHtml?: string;
  title: string;
};

export type ExamNumberLine = {
  endClosed: boolean;
  extendLeft?: boolean;
  extendRight?: boolean;
  labelStep: number;
  max: number;
  min: number;
  solutionEnd: number;
  solutionStart: number;
  startClosed: boolean;
  tickStep: number;
};

export type ExamNumberLineResponse = {
  correctDirection: "left" | "right";
  correctEndpoint: "closed" | "open";
  correctValue: number | null;
  labelStep: number;
  max: number;
  min: number;
  tickStep: number;
};

export type ExamGraphPoint = {
  id: string;
  sourceX?: number;
  sourceY?: number;
  x: number;
  y: number;
};

export type ExamPointGraph = {
  sourceImage?: ExamQuestionImage & {width:number; height:number};
  points: ExamGraphPoint[];
  title?: string;
  xLabel: string;
  xMax: number;
  xMin: number;
  xStep: number;
  yLabel: string;
  yMax: number;
  yMin: number;
  yStep: number;
};

export type ExamMathDragSlot = {
  correctItemId: string;
  id: string;
};

export type ExamChoice = {
  html?: string;
  id: string;
  image?: ExamQuestionImage;
  math?: string;
  numberLine?: ExamNumberLine;
  text: string;
};

export type ExamCategoryItem = {
  html?: string;
  id: string;
  text: string;
};

export type ExamCategoryTarget = {
  id: string;
  title: string;
};

export type ExamTableHeaders = {
  answer: string;
  row: string;
};

export type ExamDropdownOption = {
  id: string;
  math?: string;
  text: string;
};

export type ExamInlineDropdown = {
  correctChoiceId?: string;
  id: string;
  options: ExamDropdownOption[];
};

export type ExamQuestionImage = {
  alt: string;
  caption?: string;
  src: string;
};

export type ExamQuestion = {
  source?: ExamSource;
  /** Stable ID in the teacher-managed Skilled registry; absent means TBD. */
  skilled?: string;
  /** Explicit text matching for captured answer sheets; legacy exams keep their existing defaults. */
  textMatchMode?: "exact" | "normalized";
  allowReuse?: boolean;
  categories?: ExamCategoryTarget[];
  categoryCapacity?: 1;
  choices?: ExamChoice[];
  correctChoiceId?: string;
  correctChoiceIds?: string[];
  correctPointIds?: string[];
  correctPlacements?: Record<string, string>;
  correctTextAnswers?: string[];
  dragDropContent?: string[];
  dragDropContentHtml?: string;
  /** Compact black tiles or blue outlined tiles; independent of answer reuse. */
  dragDropStyle?: "compact" | "outlined";
  dragDropSlots?: ExamMathDragSlot[];
  dropdownContent?: string[];
  dropdownContentHtml?: string;
  dropdowns?: ExamInlineDropdown[];
  entryLayout?: "fraction" | "plain" | "x_equals";
  /** Source input appearance for compatible string answers; never changes grading type. */
  entryControl?: "numeric" | "expression" | "text";
  /** Letter displayed before = in the calculator input; defaults to x. */
  entryVariable?: string;
  explanation?: string;
  explanationHtml?: string;
  graph?: ExamPointGraph;
  id: string;
  image?: ExamQuestionImage;
  instructions?: string;
  instructionsHtml?: string;
  items?: ExamCategoryItem[];
  /** Passage/table evidence matrix with square selectors and bold statement rows. */
  matrixStyle?: "evidence";
  numberLineResponse?: ExamNumberLineResponse;
  points?: number;
  prompt: string;
  promptHtml?: string;
  /** Selectable source phrases stay inside their original paragraph. */
  selectionHtml?: string;
  requiredPlacements?: number;
  requiredSelections?: number;
  stimulus?: string;
  stimulusHtml?: string;
  tableHeaders?: ExamTableHeaders;
  topic: string;
  /** Detailed math skill within the main topic; absent on legacy and English questions. */
  subtopic?: string;
  transitionBlankAfter?: string;
  transitionBlankBefore?: string;
  transitionSentenceNumber?: string;
  type: ExamQuestionType;
};

export type ExamPassageDirections = {
  body: string;
  breadcrumbLabel?: string;
  subject: string;
  title: string;
};

export type ExamPassageSet = {
  duplicateOf?: string;
  versionLabels?: string[];
  directions: ExamPassageDirections;
  id: string;
  label?: string;
  passage: ExamPassage;
  questionCount: number;
  questions: ExamQuestion[];
  section?: ExamPassageSection;
  showDirectionsBefore?: boolean;
};

export type ExamStandaloneSection = {
  directions: ExamPassageDirections;
  id: string;
  label: string;
  questionCount: number;
  questions: ExamQuestion[];
};

export type ExamMathDirections = {
  body: string;
  breadcrumbLabel?: string;
  notes: string[];
  subject: string;
  title: string;
};

export type ExamMathSection = {
  directions: ExamMathDirections;
  id: string;
  label: string;
  questionCount: number;
  questions: ExamQuestion[];
};

export type ExamContent = {
  assessmentId: string;
  source?: ExamSource;
  questionOrder?: string[];
  /** Source-specific display snapshots; canonical library records and IDs remain intact. */
  presentationOverrides?: {
    questions?: Record<string, {base:ExamQuestion; question:ExamQuestion}>;
    passages?: Record<string, {baseLines:ExamPassageLine[]; passage:ExamPassage}>;
  };
  mathSection?: ExamMathSection;
  passageSections?: Record<string, ExamPassageSection>;
  passageSets: ExamPassageSet[];
  standaloneSection?: ExamStandaloneSection;
  title: string;
};

export type AssessmentContentSource = {
  id: string;
  passageOrder?: string[];
  passages: {
    passageCategory?: PassageCategory;
    versionLabel?: string;
    id: string;
    text: string;
    title: string;
  }[];
  questions: {
    answer: string;
    choices: string[];
    id: string;
    points: number;
    prompt: string;
    topic: string;
    type: ExamQuestionType;
  }[];
  title: string;
};

