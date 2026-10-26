/** The expression-response palette observed on TestNav Form D, question 5. */
export type AdvancedMathKey = {
  label: string;
  latex: string;
  text?: string;
  icon?: "fraction" | "mixed" | "square-root" | "root" | "exponent";
  number?: boolean;
};

const digit = (text: string): AdvancedMathKey => ({ label: text, latex: text, text, number: true });
export const advancedMathKeypad: (AdvancedMathKey | null)[][] = [
  [...["1", "2", "3", "4", "5"].map(digit), null, null, null],
  [...["6", "7", "8", "9", "0"].map(digit),
    { label: "Add", latex: "+", text: "+" },
    { label: "Subtract", latex: "-", text: "−" },
    { label: "Square root", latex: "\\sqrt{\\placeholder{}}", icon: "square-root" }],
  [{ label: "Percent", latex: "\\%", text: "%" },
    { label: "Negative", latex: "-", text: "−" },
    { label: "Decimal point", latex: ".", text: "." },
    { label: "Fraction", latex: "\\frac{#@}{\\placeholder{}}", icon: "fraction" },
    { label: "Mixed number", latex: "#@\\frac{\\placeholder{}}{\\placeholder{}}", icon: "mixed" },
    { label: "Multiply dot", latex: "\\cdot", text: "·" },
    { label: "Divide", latex: "\\div", text: "÷" },
    { label: "General root", latex: "\\sqrt[\\placeholder{}]{\\placeholder{}}", icon: "root" }],
  [null,
    { label: "Exponent", latex: "#@^{\\placeholder{}}", icon: "exponent" },
    { label: "Parentheses", latex: "\\left(\\placeholder{}\\right)", text: "( )" },
    { label: "Less than or equal", latex: "\\le", text: "≤" },
    { label: "Less than", latex: "<", text: "<" },
    { label: "Equal", latex: "=", text: "=" },
    { label: "Greater than", latex: ">", text: ">" },
    { label: "Greater than or equal", latex: "\\ge", text: "≥" }],
  [{ label: "Pi", latex: "\\pi", text: "π" }, null, null, null, null, null, null,
    { label: "Absolute value", latex: "\\left|\\placeholder{}\\right|", text: "| |" }],
];

function entryLetter(variable?: string) {
  const value = variable?.trim().normalize('NFKC');
  return value && /^\p{L}$/u.test(value) ? value : undefined;
}

/** A variable key is opt-in; captured calculator-only palettes keep their layout. */
export function advancedMathKeypadForVariable(variable?: string) {
  const letter = entryLetter(variable);
  if (!letter) return advancedMathKeypad;
  return advancedMathKeypad.map((row, index) => index === 0
    ? row.map((key, column) => column === 5 ? { label: `Variable ${letter}`, latex: letter, text: letter } : key)
    : row);
}

export function isAdvancedMathCharacter(key: string, variable?: string) {
  return /^[\d.+\-−%/*×·÷^()=<>|π≤≥]$/.test(key) || key === entryLetter(variable);
}
