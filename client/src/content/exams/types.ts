export type ExamQuestionType =
  | "multiple_choice"
  | "multi_select"
  | "category_sort"
  | "table_match"
  | "inline_dropdown"
  | "numeric_entry"
  | "transition_drop"
  | "short_response"
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

export type ExamChoice = {
  html?: string;
  id: string;
  math?: string;
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
  categories?: ExamCategoryTarget[];
  categoryCapacity?: 1;
  choices?: ExamChoice[];
  correctChoiceId?: string;
  correctChoiceIds?: string[];
  correctPlacements?: Record<string, string>;
  correctTextAnswers?: string[];
  dropdownContent?: string[];
  dropdowns?: ExamInlineDropdown[];
  id: string;
  image?: ExamQuestionImage;
  instructions?: string;
  instructionsHtml?: string;
  items?: ExamCategoryItem[];
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
