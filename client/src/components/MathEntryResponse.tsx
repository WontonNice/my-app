import { useEffect, useRef, useState } from "react";
import { MathfieldElement, type Selector } from "mathlive";
import "mathlive/fonts.css";
import katex from "katex";
import { mathAnswerFromLatex, mathAnswerToLatex } from "../../../server/src/shared/mathAnswer";

MathfieldElement.fontsDirectory = null; // Bundled fonts.css supplies local fonts.
MathfieldElement.soundsDirectory = null;
MathfieldElement.restoreFocusWhenDocumentFocused = false;

type MathKey = { label: string; latex: string; display?: string };
const keys: MathKey[] = [
  ...["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map(value => ({ label: value, latex: value })),
  { label: "Percent", latex: "\\%", display: "\\%" }, { label: "Negative", latex: "-", display: "-" },
  { label: "Decimal point", latex: ".", display: "." },
  { label: "Fraction", latex: "\\frac{#0}{\\placeholder{}}", display: "\\frac{a}{b}" },
  { label: "Mixed number", latex: "#0\\frac{\\placeholder{}}{\\placeholder{}}", display: "1\\frac{a}{b}" },
];
const expressionKeys: MathKey[] = [
  { label: "x", latex: "x" }, { label: "y", latex: "y" },
  { label: "Plus", latex: "+", display: "+" }, { label: "Subtract", latex: "-", display: "-" }, { label: "Multiply", latex: "\\cdot", display: "\\cdot" },
  { label: "Divide", latex: "\\div", display: "\\div" }, { label: "Equals", latex: "=", display: "=" },
  { label: "Less than", latex: "<", display: "<" }, { label: "Greater than", latex: ">", display: ">" },
  { label: "Less than or equal", latex: "\\le", display: "\\le" }, { label: "Greater than or equal", latex: "\\ge", display: "\\ge" },
  { label: "Exponent", latex: "#@^{\\placeholder{}}", display: "x^n" },
  { label: "Square root", latex: "\\sqrt{#0}", display: "\\sqrt{x}" },
  { label: "Nth root", latex: "\\sqrt[\\placeholder{}]{#0}", display: "\\sqrt[n]{x}" },
  { label: "Parentheses", latex: "\\left(#0\\right)", display: "(x)" },
  { label: "Absolute value", latex: "\\left|#0\\right|", display: "|x|" },
  { label: "Pi", latex: "\\pi", display: "\\pi" },
];
const keypadRows = [
  ["1", "2", "3", "4", "5", "x", "y", ""],
  ["6", "7", "8", "9", "0", "Plus", "Subtract", "Square root"],
  ["Percent", "Negative", "Decimal point", "Fraction", "Mixed number", "Multiply", "Divide", "Nth root"],
  ["", "Exponent", "Parentheses", "Less than or equal", "Less than", "Equals", "Greater than", "Greater than or equal"],
  ["Pi", "", "", "", "", "", "", "Absolute value"],
];
const keyByLabel = new Map([...keys, ...expressionKeys].map(key => [key.label, key]));

export function MathEntryResponse({ layout, onChange, value }: {
  layout: "fraction" | "plain" | "x_equals";
  onChange: (value: string) => void;
  value: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const [history, setHistory] = useState({ undo: false, redo: false });
  useEffect(() => { onChangeRef.current = onChange; valueRef.current = value; }, [onChange, value]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const field = new MathfieldElement();
    field.mathVirtualKeyboardPolicy = "manual";
    field.smartFence = true;
    field.smartSuperscript = true;
    field.setAttribute("aria-label", layout === "x_equals" ? "Value of x" : "Math answer");
    field.setAttribute("aria-describedby", "exam-math-entry-hint");
    host.append(field);
    field.menuItems = []; // This property is available after mounting.
    fieldRef.current = field;
    field.value = mathAnswerToLatex(valueRef.current) || (layout === "fraction" ? "\\frac{\\placeholder{}}{\\placeholder{}}" : "");
    const updateHistory = () => setHistory({ undo: field.canUndo(), redo: field.canRedo() });
    const updateAnswer = () => {
      const answer = mathAnswerFromLatex(field.value);
      valueRef.current = answer;
      onChangeRef.current(answer);
      updateHistory();
    };
    field.addEventListener("input", updateAnswer);
    field.addEventListener("undo-state-change", updateHistory);
    return () => {
      field.removeEventListener("input", updateAnswer);
      field.removeEventListener("undo-state-change", updateHistory);
      fieldRef.current = null;
      field.remove();
    };
  }, [layout]);

  useEffect(() => {
    const field = fieldRef.current;
    if (field && mathAnswerFromLatex(field.value) !== value) {
      field.setValue(mathAnswerToLatex(value), { silenceNotifications: true });
    }
  }, [value]);

  function command(action: Selector) {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    field.executeCommand(action);
  }

  function insert(key: MathKey) {
    const field = fieldRef.current;
    if (!field) return;
    field.insert(key.latex, { selectionMode: "placeholder", focus: true, format: "latex" });
  }

  return <div className="exam-math-entry-response">
    <div className={`exam-math-entry-display is-${layout}`}>
      {layout === "x_equals" && <span aria-hidden="true" className="exam-math-entry-prefix">𝑥 =</span>}
      <div className="exam-math-field-host" ref={hostRef} />
    </div>
    <div className="exam-math-keypad" role="group" aria-label="Math answer keypad">
      <div className="exam-math-keypad-tools">
        {([
          ["Move cursor left", "←", "moveToPreviousChar"], ["Move cursor right", "→", "moveToNextChar"],
          ["Undo", "↶", "undo"], ["Redo", "↷", "redo"], ["Backspace", "⌫", "deleteBackward"],
        ] as const).map(([label, icon, action]) => <button aria-label={label} title={label} key={label} type="button" disabled={action === "undo" ? !history.undo : action === "redo" ? !history.redo : false} onMouseDown={event => event.preventDefault()} onClick={() => command(action)}>{icon}</button>)}
        <button aria-label="Clear answer" title="Clear answer" type="button" onMouseDown={event => event.preventDefault()} onClick={() => { fieldRef.current?.select(); command("deleteBackward"); }}>⌧</button>
      </div>
      <div className="exam-math-keypad-grid">
        {keypadRows.flat().map((label, index) => {
          const key = keyByLabel.get(label);
          return key ? <button aria-label={key.label} title={key.label} key={index} type="button" onMouseDown={event => event.preventDefault()} onClick={() => insert(key)}><span aria-hidden="true" dangerouslySetInnerHTML={{ __html: katex.renderToString(key.display ?? key.latex, { throwOnError: false }) }} /></button> : <span aria-hidden="true" className="exam-math-key-blank" key={index} />;
        })}
      </div>
    </div>
    <p id="exam-math-entry-hint" className="exam-math-entry-hint">Use the keys or your keyboard. Tab moves between empty boxes; arrow keys move through your answer.</p>
  </div>;
}
