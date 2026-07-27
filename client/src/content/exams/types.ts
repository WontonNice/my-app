export type ExamQuestionType =
  | "multiple_choice"
  | "multi_select"
  | "category_sort"
  | "graph_point_select"
  | "table_match"
  | "inline_dropdown"
  | "math_drag_drop"
  | "number_line_response"
  | "transition_drop"
  | "short_response"
  | "numeric_entry"
  | "grid_in"
  | "essay";

export type ExamPassageSection =
  | "reading"
  | "revising_editing_a";

export type ExamPassageLine = {
  align?: "left" | "center";
  html?: string;
  image?: ExamQuestionImage;
  kind?: "intro" | "title" | "byline" | "image";
  lineNumber?: string;
  text: string;
};

export type ExamPassage = {
  format?: "poem" | "prose" | "sentence_prose";
  id: string;
  lines: ExamPassageLine[];
  sourceNote?: string;
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
  correctValue: number;
  labelStep: number;
  max: number;
  min: number;
  tickStep: number;
};

export type ExamGraphPoint = {
  id: string;
  x: number;
  y: number;
};

export type ExamPointGraph = {
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
  dragDropSlots?: ExamMathDragSlot[];
  dropdownContent?: string[];
  dropdowns?: ExamInlineDropdown[];
  entryLayout?: "fraction" | "plain" | "x_equals";
  graph?: ExamPointGraph;
  id: string;
  image?: ExamQuestionImage;
  instructions?: string;
  instructionsHtml?: string;
  items?: ExamCategoryItem[];
  numberLineResponse?: ExamNumberLineResponse;
  points?: number;
  prompt: string;
  promptHtml?: string;
  requiredPlacements?: number;
  requiredSelections?: number;
  stimulus?: string;
  stimulusHtml?: string;
  tableHeaders?: ExamTableHeaders;
  topic: string;
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
