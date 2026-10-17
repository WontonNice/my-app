import type { MathfieldElement } from "mathlive";

type NumericField = Pick<MathfieldElement, "selection" | "position" | "executeCommand" | "getValue" | "insert">;
const negativeEdits = new WeakSet<NumericField>();

export function handleNumericBeforeInput(field: NumericField, event: InputEvent) {
  if (!negativeEdits.has(field) && (event.data === "-" || event.data === "−")) {
    event.preventDefault();
    insertNumericNegative(field);
  }
}

// TestNav's negative key prefixes the current entry, rather than inserting a
// subtraction operator at the caret. Each fraction slot is its own entry.
export function insertNumericNegative(field: NumericField) {
  const selection = field.selection;
  field.executeCommand("moveToGroupStart");
  const start = field.position;
  const first = field.getValue(start, start + 1, "latex");
  if (first === "-" || first === "−") {
    field.selection = selection;
    return;
  }
  // Group-start is a no-op if the active end of a selection is already there.
  // Collapse explicitly so signing an entry never replaces selected digits.
  field.position = start;
  negativeEdits.add(field);
  try { field.insert("-", { format: "latex", selectionMode: "after", focus: true }); }
  finally { negativeEdits.delete(field); }
  field.selection = {
    ...selection,
    ranges: selection.ranges.map(([from, to]) => [from >= start ? from + 1 : from, to >= start ? to + 1 : to]),
  };
}
