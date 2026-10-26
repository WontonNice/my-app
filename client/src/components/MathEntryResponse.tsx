import { useEffect, useId, useRef, useState } from "react";
import { MathfieldElement, type Selector } from "mathlive";
import "mathlive/fonts.css";
import katex from "katex";
import { mathAnswerFromLatex, mathAnswerToLatex } from "../../../server/src/shared/mathAnswer";
import { handleNumericBeforeInput, insertNumericNegative } from "../lib/mathEntryInput";
import { advancedMathKeypadForVariable, isAdvancedMathCharacter, type AdvancedMathKey } from "../lib/advancedMathEntry";
import { MathEntryHistory } from "../lib/mathEntryHistory";

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

export function MathEntryResponse({ layout, onChange, value, variable, advanced = false }: {
  advanced?: boolean;
  layout: "fraction" | "plain" | "x_equals";
  onChange: (value: string) => void;
  value: string;
  variable?: string;
}) {
  const normalizedVariable = (variable ?? 'x').trim().normalize("NFKC");
  const displayVariable = /^\p{L}$/u.test(normalizedVariable) ? normalizedVariable : "x";
  const hostRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<MathfieldElement | null>(null);
  const historyRef = useRef<MathEntryHistory | null>(null);
  const syncAnswerRef = useRef<(() => void) | null>(null);
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
    const history = new MathEntryHistory(field);
    historyRef.current = history;
    setHasFraction(/\\(?:d?frac)\b/.test(field.value));

    const updateAnswer = () => {
      historyRef.current?.record();
      setHasFraction(/\\(?:d?frac)\b/.test(field.value));
      const answer = mathAnswerFromLatex(field.value);
      valueRef.current = answer;
      onChangeRef.current(answer);
    };
    syncAnswerRef.current = updateAnswer;
    const restoreHistory = (redo: boolean) => {
      if (redo) historyRef.current?.redo(); else historyRef.current?.undo();
      updateAnswer();
    };
    // Each pad accepts its own symbols. Keep selection, navigation, undo, and
    // paste shortcuts available on both versions.
    const numericKeyboard = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && ["z", "y"].includes(event.key.toLowerCase())) {
        event.preventDefault();
        event.stopImmediatePropagation();
        restoreHistory(event.key.toLowerCase() === "y" || event.shiftKey);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (!advanced && (event.key === "-" || event.key === "−")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        insertNumericNegative(field);
        return;
      }
      if (event.key.length === 1 && !(advanced ? isAdvancedMathCharacter(event.key, variable) : /^[\d.\-−%/]$/.test(event.key))) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const beforeInput = (event: Event) => {
      const input = event as InputEvent;
      if (input.inputType === "historyUndo" || input.inputType === "historyRedo") {
        input.preventDefault();
        restoreHistory(input.inputType === "historyRedo");
        return;
      }
      historyRef.current?.record();
      if (!advanced) handleNumericBeforeInput(field, input);
    };
    field.addEventListener("beforeinput", beforeInput);
    field.addEventListener("keydown", numericKeyboard, true);
    field.addEventListener("input", updateAnswer);
    return () => {
      field.removeEventListener("keydown", numericKeyboard, true);
      field.removeEventListener("beforeinput", beforeInput);
      field.removeEventListener("input", updateAnswer);
      fieldRef.current = null;
      historyRef.current = null;
      syncAnswerRef.current = null;
      field.remove();
    };
  }, [layout, hintId, advanced, variable]);

  useEffect(() => {
    fieldRef.current?.setAttribute("aria-label", layout === "x_equals" ? `Value of ${displayVariable}` : advanced ? "Math expression answer" : "Math answer");
  }, [layout, displayVariable, advanced]);

  useEffect(() => {
    const field = fieldRef.current;
    if (field && mathAnswerFromLatex(field.value) !== value) {
      field.setValue(mathAnswerToLatex(value), { silenceNotifications: true });
      historyRef.current = new MathEntryHistory(field);
      setHasFraction(/\\(?:d?frac)\b/.test(field.value));
    }
  }, [value]);

  function command(action: Selector | "clear") {
    const field = fieldRef.current;
    if (!field) return;
    field.focus();
    if (action === "undo" || action === "redo") {
      historyRef.current?.[action]();
      syncAnswerRef.current?.();
      return;
    }
    historyRef.current?.record();
    if (action === "clear") { field.select(); field.executeCommand("deleteBackward"); }
    else field.executeCommand(action);
  }

  function insert(key: MathKey | AdvancedMathKey) {
    const field = fieldRef.current;
    if (!field) return;
    historyRef.current?.record();
    if (!advanced && key.latex === "-") { field.focus(); insertNumericNegative(field); }
    else field.insert(key.latex, { selectionMode: "placeholder", focus: true, format: "latex" });
  }

  return <div className={"exam-math-entry-response" + (advanced ? " is-advanced" : "")}>
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
        {advanced ? advancedMathKeypadForVariable(variable).map((row, index) => <div className="exam-math-keypad-row" key={index}>
          {row.map((key, column) => key ? <button aria-label={key.label} title={key.label} key={key.label} type="button" className={key.number ? "is-digit" : "is-symbol"} onPointerDown={event => event.preventDefault()} onClick={() => insert(key)}>
            {key.icon === "fraction" || key.icon === "mixed" ? <TemplateIcon mixed={key.icon === "mixed"} />
              : key.icon ? <AdvancedTemplateIcon icon={key.icon} />
              : <span aria-hidden="true" className={key.label === "Negative" ? "is-negative-sign" : key.label === "Multiply dot" ? "is-multiply-dot" : undefined}>{key.text}</span>}
          </button> : <span className="exam-math-keypad-spacer" aria-hidden="true" key={`blank-${column}`} />)}
        </div>) : keypadRows.map((row, index) => <div className="exam-math-keypad-row" key={index}>
          {row.map(key => <button aria-label={key.label} title={key.label} key={key.label} type="button" onPointerDown={event => event.preventDefault()} onClick={() => insert(key)}>
            {key.template ? <TemplateIcon mixed={key.template === "mixed"} /> : <span aria-hidden="true">{key.text}</span>}
          </button>)}
        </div>)}
      </div>
    </div>
    <p id={hintId} className="sr-only">Use the keypad or type your answer. Arrow keys move through your answer; Tab moves between empty boxes.</p>
  </div>;
}

function AdvancedTemplateIcon({ icon }: { icon: "square-root" | "root" | "exponent" }) {
  return <svg className="exam-math-template-icon" viewBox="0 0 30 30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
    {icon === "exponent" ? <><rect x="5" y="11" width="10" height="14" /><rect x="19" y="3" width="6" height="8" /></>
      : <><path d="m6 15 4-2 4 12 6-21h9" />{icon === "root" && <text x="5" y="10" fill="currentColor" stroke="none" fontSize="12" fontStyle="italic" fontFamily="serif">n</text>}</>}
  </svg>;
}
