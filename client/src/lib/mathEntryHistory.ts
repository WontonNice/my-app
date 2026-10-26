import type { MathfieldElement } from "mathlive";

type HistoryField = Pick<MathfieldElement, "value" | "selection" | "setValue">;
type Entry = Pick<HistoryField, "value" | "selection">;
const copy = (field: Entry): Entry => ({ value: field.value, selection: {
  ...field.selection, ranges: field.selection.ranges.map(([from, to]) => [from, to]),
} });

// Keep content and caret together for keypad and keyboard edits. MathLive's
// programmatic deletion history does not reliably retain the post-edit state.
export class MathEntryHistory {
  private entries: Entry[];
  private index = 0;

  constructor(private field: HistoryField) { this.entries = [copy(field)]; }

  record() {
    const entry = copy(this.field);
    if (entry.value === this.entries[this.index].value) {
      this.entries[this.index] = entry;
      return;
    }
    this.entries.splice(this.index + 1);
    this.entries.push(entry);
    if (this.entries.length > 100) this.entries.shift();
    this.index = this.entries.length - 1;
  }

  undo() {
    this.record(); // Includes edits whose deferred input event has not fired yet.
    if (this.index === 0) return false;
    this.restore(--this.index);
    return true;
  }

  redo() {
    this.record();
    if (this.index === this.entries.length - 1) return false;
    this.restore(++this.index);
    return true;
  }

  private restore(index: number) {
    const entry = copy(this.entries[index]);
    this.field.setValue(entry.value, { silenceNotifications: true });
    this.field.selection = entry.selection;
  }
}
