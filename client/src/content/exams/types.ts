export type ExamQuestionType =
  | "multiple_choice"
  | "multi_select"
  | "category_sort"
  | "inline_dropdown"
  | "numeric_entry"
  | "transition_drop"
  | "short_response"
  | "grid_in"
  | "essay";

export type ExamPassageLine = {
  align?: "left" | "center";
  kind?: "intro" | "title" | "byline";
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
  id: string;
  math?: string;
  text: string;
};

export type ExamCategoryItem = {
  id: string;
  text: string;
};

export type ExamCategoryTarget = {
  id: string;
  title: string;
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
  src: string;
};

export type ExamQuestion = {
  categories?: ExamCategoryTarget[];
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
  items?: ExamCategoryItem[];
  points?: number;
  prompt: string;
  requiredPlacements?: number;
  requiredSelections?: number;
  stimulus?: string;
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
  passageSets: ExamPassageSet[];
  standaloneSection?: ExamStandaloneSection;
  title: string;
};

export type AssessmentContentSource = {
  id: string;
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
    type: ExamQuestionType;
  }[];
  title: string;
};
