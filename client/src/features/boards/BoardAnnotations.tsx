import { useEffect, useRef, useState, type ReactNode } from "react";
import * as Y from "yjs";
import type { BoardHighlight, BoardNode } from "../../../../server/src/shared/boards";
import type { BoardCardContextValue } from "./cardContext";

const colors = ["yellow", "green", "blue", "pink"] as const;
const highlights = new Map<HTMLElement, { color: BoardHighlight["color"]; range: Range }[]>();
function paint() {
  if (typeof Highlight === "undefined" || !CSS.highlights) return;
  for (const color of colors) CSS.highlights.set(`board-${color}`, new Highlight(...[...highlights.values()].flat().filter(mark => mark.color === color).map(mark => mark.range)));
}
function textRange(root: HTMLElement, start: number, end: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), range = document.createRange();
  let offset = 0, foundStart = false;
  while (walker.nextNode()) {
    const node = walker.currentNode, length = node.textContent?.length ?? 0;
    if (!foundStart && start <= offset + length) { range.setStart(node, start - offset); foundStart = true; }
    if (foundStart && end <= offset + length) { range.setEnd(node, end - offset); return range; }
    offset += length;
  }
  return null;
}
export function BoardAnnotations({ card, context, children, revisionKey }: { card: BoardNode; context: BoardCardContextValue; children: ReactNode; revisionKey: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Omit<BoardHighlight, "color"> | null>(null);
  const current = context.session.snapshot();
  const editable = current.ready && current.board.role !== "viewer" && !current.board.archivedAt && current.status !== "Recovery needed" && (!card.locked || current.canManage);
  useEffect(() => {
    const container = host.current; if (!container) return;
    const refresh = () => {
      const ranges: { color: BoardHighlight["color"]; range: Range }[] = [];
      for (const root of container.querySelectorAll<HTMLElement>("[data-board-highlight-key]")) {
        for (const mark of Object.values(card.highlights ?? {})) if (mark.key === root.dataset.boardHighlightKey) {
          const text = root.textContent ?? "";
          let start = mark.start;
          if (text.slice(start, mark.end) !== mark.quote) { start = text.indexOf(mark.quote); if (start < 0 || start !== text.lastIndexOf(mark.quote)) continue; }
          const range = textRange(root, start, start + mark.quote.length); if (range) ranges.push({ color: mark.color, range });
        }
      }
      highlights.set(container, ranges); paint();
    };
    refresh();
    // Re-anchor after sanitized exam content changes or finishes mounting,
    // including the first load after reopening.
    const observer = new MutationObserver(refresh);
    observer.observe(container, { subtree: true, childList: true, characterData: true });
    return () => { observer.disconnect(); highlights.delete(container); paint(); };
  }, [card.highlights, revisionKey]);
  const capture = () => {
    const selected = window.getSelection();
    if (!selected || selected.isCollapsed || !selected.rangeCount || !editable) { setSelection(null); return; }
    const range = selected.getRangeAt(0), element = range.startContainer.parentElement?.closest<HTMLElement>("[data-board-highlight-key]");
    if (!element || !host.current?.contains(element) || !element.contains(range.endContainer)) { setSelection(null); return; }
    const before = range.cloneRange(); before.selectNodeContents(element); before.setEnd(range.startContainer, range.startOffset);
    const start = before.toString().length, quote = range.toString();
    if (!quote || quote.length > 10000) { setSelection(null); return; }
    setSelection({ key: element.dataset.boardHighlightKey!, start, end: start + quote.length, quote });
  };
  const change = (color?: BoardHighlight["color"]) => {
    if (!selection || !editable) return;
    context.session.transaction(() => {
      const node = context.session.doc.getMap<Y.Map<unknown>>("nodes").get(card.id); if (!node) return;
      let marks = node.get("highlights") as Y.Map<BoardHighlight> | undefined;
      if (!marks) { marks = new Y.Map<BoardHighlight>(); node.set("highlights", marks); }
      for (const [id, mark] of marks) if (mark.key === selection.key && mark.start < selection.end && mark.end > selection.start) marks.delete(id);
      if (color) marks.set(crypto.randomUUID(), { ...selection, color });
    });
    window.getSelection()?.removeAllRanges(); setSelection(null);
  };
  return <div ref={host} className="board-annotated nodrag nopan nowheel" onPointerUp={capture} onKeyUp={capture}>
    {children}
    {editable && <div className="board-highlight-tools" onMouseDown={event => event.preventDefault()}><small>{selection ? "Highlight selection" : "Select text to highlight"}</small>{colors.map(color => <button key={color} aria-label={`Highlight ${color}`} title={`Highlight ${color}`} className={`is-${color}`} disabled={!selection} onClick={() => change(color)} />)}<button disabled={!selection} onClick={() => change()}>Remove</button></div>}
  </div>;
}
