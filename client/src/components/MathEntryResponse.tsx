import { useEffect, useId, useRef, useState } from "react";
import { MathfieldElement, type Selector } from "mathlive";
import "mathlive/fonts.css";
import katex from "katex";
import { mathAnswerFromLatex, mathAnswerToLatex } from "../../../server/src/shared/mathAnswer";
import { handleNumericBeforeInput, insertNumericNegative } from "../lib/mathEntryInput";

MathfieldElement.fontsDirectory = null; // Bundled fonts.css supplies local fonts.
MathfieldElement.soundsDirectory = null;
MathfieldElement.restoreFocusWhenDocumentFocused = false;

type MathKey = { label: string; latex: string; text?: string; template?: "fraction" | "mixed" };
const keypadRows: MathKey[][] = [
  ["1", "2", "3", "4", "5"].map(text => ({ label: text, latex: text, text })),
  ["6", "7", "8", "9", "0"].map(text => ({ label: text, latex: text, text })),
  [
    { label: "Percent", latex: "\\%", text: "%" },
    { label: "Negative", latex: "-", text: "−" },
    { label: "Decimal point", latex: ".", text: "." },
    // #@ takes the selected or preceding number, or creates an empty slot.
    { label: "Fraction", latex: "\\frac{#@}{\\placeholder{}}", template: "fraction" },
    { label: "Mixed number", latex: "#@\\frac{\\placeholder{}}{\\placeholder{}}", template: "mixed" },
  ],
];

function TemplateIcon({ mixed = false }: { mixed?: boolean }) {
  return <svg className="exam-math-template-icon" viewBox="0 0 30 30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
    {mixed && <rect x="3" y="5" width="9" height="20" />}
    <g transform={mixed ? "translate(7 0)" : undefined}>
      <rect x="10" y="5" width="10" height="6" />
      <path d="M9 15h12" />
      <rect x="10" y="19" width="10" height="6" />
    </g>
  </svg>;
}

function EditIcon({ action }: { action: Selector | "clear" }) {
  if (action === "moveToPreviousChar" || action === "moveToNextChar") return <span aria-hidden="true">{action === "moveToPreviousChar" ? "←" : "→"}</span>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="exam-math-edit-icon">
    {action === "undo" || action === "redo" ? <path transform={action === "redo" ? "translate(24 0) scale(-1 1)" : undefined} d="M10 3 2 10l8 7v-5c7-1 10 3 8 9 7-8 2-15-8-15Z" fill="currentColor" />
      : action === "clear" ? <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M4 6h16M9 6V3h6v3M6 8l1 13h10l1-13M10 9v9M14 9v9" /><path d="M5 6h14" /></g>
      : <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"><path d="m2 12 6-7h14v14H8Z" /><path d="m11 9 6 6m0-6-6 6" /></g>}
  </svg>;
}

export function MathEntryResponse({ layout, onChange, value, variable = "x" }: {
  layout: "fraction" | "plain" | "x_equals";
  onChange: (value: string) => void;
  value: string;
  variable?: string;
}) {
  const normalizedVariable = variable.trim().normalize("NFKC");
  const displayVariable = /^\p{L}$/u.test(normalizedVariable) ? normalizedVariable : "x";
  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const onChangeRef = useRef(onChange);
  const valueRef = useRef(value);
  const hintId = useId();
  const [hasFraction, setHasFraction] = useState(false);
  useEffect(() => { onChangeRef.current = onChange; valueRef.current = value; }, [onChange, value]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const field = new MathfieldElement();
    field.mathVirtualKeyboardPolicy = "manual";
    field.defaultMode = "inline-math";
    field.smartFence = false;
    field.smartSuperscript = false;
    field.popoverPolicy = "off";
    field.placeholderSymbol = "⬚";
    field.placeholder = "\\placeholder{}";
    field.setAttribute("aria-describedby", hintId);
    host.append(field);
    field.menuItems = [];
    field.inlineShortcuts = {};
    fieldRef.current = field;
    field.value = mathAnswerToLatex(valueRef.current) || (layout === "fraction" ? "\\frac{\\placeholder{}}{\\placeholder{}}" : "");
    setHasFraction(/\\(?:d?frac)\b/.test(field.value));

    const updateAnswer = () => {
      setHasFraction(/\\(?:d?frac)\b/.test(field.value));
      const answer = mathAnswerFromLatex(field.value);
      valueRef.current = answer;
      onChangeRef.current(answer);
    };
    // Match the numeric response pad: letters and expression operators are not
    // valid keyboard input. Keep selection, navigation, undo, and paste shortcuts.
    const numericKeyboard = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "-" || event.key === "−") {
        event.preventDefault();
        event.stopImmediatePropagation();
        insertNumericNegative(field);
        return;
      }
      if (event.key.length === 1 && !/^[\d.\-−%/]$/.test(event.key)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const beforeInput = (event: Event) => handleNumericBeforeInput(field, event as InputEvent);
    field.addEventListener("beforeinput", beforeInput);
    field.addEventListener("keydown", numericKeyboard, true);
    field.addEventListener("input", updateAnswer);
    return () => {
      field.removeEventListener("keydown", numericKeyboard, true);
      field.removeEventListener("beforeinput", beforeInput);
      field.removeEventListener("input", updateAnswer);
      fieldRef.current = null;
      field.remove();
    };
  }, [layout, hintId]);

  useEffect(() => {
    fieldRef.current?.setAttribute("aria-label", layout === "x_equals" ? `Value of ${displayVariable}` : "Math answer");
  }, [layout, displayVariable]);

  useEffect(() => {
    const field = fieldRef.current;
    if (field && mathAnswerFromLatex(field.value) !== value) {
      field.setValue(mathAnswerToLatex(value), { silenceNotifications: true });
      setHasFraction(/\\(?:d?frac)\b/.test(field.value));
    }
  }, [value]);

  function command(action: Selector | "clear") {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    if (action === "clear") { field.select(); field.executeCommand("deleteBackward"); }
    else field.executeCommand(action);
  }

  function insert(key: MathKey) {
    const field = fieldRef.current;
    if (!field) return;
    if (key.latex === "-") { field.focus(); insertNumericNegative(field); }
    else field.insert(key.latex, { selectionMode: "placeholder", focus: true, format: "latex" });
  }

  return <div className="exam-math-entry-response">
    <div className={"exam-math-entry-display is-" + layout + (hasFraction ? " has-fraction" : "")}>
      {layout === "x_equals" && <span aria-hidden="true" className="exam-math-entry-prefix" dangerouslySetInnerHTML={{ __html: katex.renderToString(`${displayVariable}=`, { throwOnError: false, strict: "ignore" }) }} />}
      <div className="exam-math-field-host" ref={hostRef} />
    </div>
    <div className="exam-math-keypad" role="group" aria-label="Math answer keypad">
      <div className="exam-math-keypad-tools" role="group" aria-label="Edit answer">
        {([
          ["Move cursor left", "moveToPreviousChar"], ["Move cursor right", "moveToNextChar"],
          ["Undo", "undo"], ["Redo", "redo"], ["Backspace", "deleteBackward"], ["Clear answer", "clear"],
        ] as const).map(([label, action]) => <button aria-label={label} title={label} key={label} type="button" onPointerDown={event => event.preventDefault()} onClick={() => command(action)}><EditIcon action={action} /></button>)}
      </div>
      <div className="exam-math-keypad-grid">
        {keypadRows.map((row, index) => <div className="exam-math-keypad-row" key={index}>
          {row.map(key => <button aria-label={key.label} title={key.label} key={key.label} type="button" onPointerDown={event => event.preventDefault()} onClick={() => insert(key)}>
            {key.template ? <TemplateIcon mixed={key.template === "mixed"} /> : <span aria-hidden="true">{key.text}</span>}
          </button>)}
        </div>)}
      </div>
    </div>
    <p id={hintId} className="sr-only">Use the keypad or type your answer. Arrow keys move through your answer; Tab moves between empty boxes.</p>
  </div>;
}
