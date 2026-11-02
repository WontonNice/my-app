export type MathTextPart = { kind: 'text' | 'inline' | 'display'; value: string };
export type MathTextRun = MathTextPart | { kind: 'word'; parts: MathTextPart[] };

/** Keep source words spanning a LaTeX boundary intact, without joining across spaces. */
export function mathTextRuns(text: string): MathTextRun[] {
  const parts: MathTextPart[] = text.split(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g).filter(Boolean).map(value =>
    value.startsWith('\\[') && value.endsWith('\\]') ? { kind: 'display', value: value.slice(2, -2) }
      : value.startsWith('\\(') && value.endsWith('\\)') ? { kind: 'inline', value: value.slice(2, -2) }
        : { kind: 'text', value });
  const runs: MathTextRun[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.kind !== 'inline') { runs.push(part); continue; }
    const word: MathTextPart[] = [];
    const previous = runs.at(-1);
    if (previous?.kind === 'text') {
      const tail = previous.value.match(/[^\s\u200b\u00ad]+$/u)?.[0];
      if (tail) {
        previous.value = previous.value.slice(0, -tail.length);
        if (!previous.value) runs.pop();
        word.push({ kind: 'text', value: tail });
      }
    }
    word.push(part);
    while (i + 1 < parts.length) {
      const next = parts[i + 1];
      if (next.kind === 'display') break;
      if (next.kind === 'inline') { word.push(next); i++; continue; }
      const head = next.value.match(/^[^\s\u200b\u00ad]+/u)?.[0];
      if (!head) break;
      word.push({ kind: 'text', value: head });
      if (head.length === next.value.length) { i++; continue; }
      next.value = next.value.slice(head.length);
      break;
    }
    runs.push(word.length === 1 ? part : { kind: 'word', parts: word });
  }
  return runs;
}
