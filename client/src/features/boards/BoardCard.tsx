import { memo, useContext, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Handle, NodeResizer, Position, type Node, type NodeProps } from "@xyflow/react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { markdown } from "@codemirror/lang-markdown";
import { defaultKeymap } from "@codemirror/commands";
import { yCollab, yUndoManagerKeymap } from "y-codemirror.next";
import * as Y from "yjs";
import ReactMarkdown from "react-markdown";
import { FileText, LockKeyhole, ExternalLink } from "lucide-react";
import { ExamText } from "../../components/ExamReviewQuestion";
import { boardApi, type BoardContent } from "./api";
import { BoardCardContext, type BoardCardContextValue } from "./cardContext";
import type { BoardNode } from "../../../../server/src/shared/boards";
import { BoardPassageViewer } from "./BoardPassageViewer";
import { BoardAnnotations } from "./BoardAnnotations";

export type CanvasCard = Node<{ card: BoardNode; textType?: Y.Text; editing: boolean; mayEdit: boolean; collaborator: string; color: string }, "card">;

function CollaborativeEditor({ card, context, textType }: { card: BoardNode; context: BoardCardContextValue; textType?: Y.Text }) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<EditorView | null>(null);
  useEffect(() => {
    const node = context.session.doc.getMap<Y.Map<unknown>>("nodes").get(card.id), text = textType ?? node?.get("text");
    if (!(text instanceof Y.Text) || !host.current) return;
    let growthTimer = 0;
    const view = new EditorView({ parent: host.current, state: EditorState.create({ doc: text.toString(), extensions: [
      markdown(), EditorView.lineWrapping, placeholder(card.type === "group" ? "Group title" : "Write together… Markdown and math supported"),
      yCollab(text, undefined, { undoManager: context.session.undo }), keymap.of([...(card.type === "group" ? [{ key: "Enter", run: () => { context.edit(null); return true; } }] : []), ...yUndoManagerKeymap, ...defaultKeymap]),
      EditorView.theme({ "&": { height: "100%", fontSize: "14px" }, ".cm-scroller": { fontFamily: "inherit", overflow: "auto" }, ".cm-content": { padding: "12px" }, "&.cm-focused": { outline: "none" } }),
      EditorView.updateListener.of(update => { if (update.docChanged && card.type !== "group") { window.clearTimeout(growthTimer); growthTimer = window.setTimeout(() => { const map = context.session.doc.getMap<Y.Map<unknown>>("nodes").get(card.id); if (!map) return; const height = Math.min(3000, Math.ceil(view.contentHeight + 65)); if (height > Number(map.get("height"))) { context.session.doc.transact(() => map.set("height", height), "board-local"); } }, 400); } }),
      EditorView.domEventHandlers({ keydown: event => { if (event.key === "Escape" || card.type === "group" && event.key === "Enter" && !event.shiftKey) { event.preventDefault(); context.edit(null); return true; } return false; } }),
    ] }) });
    editor.current = view; view.focus();
    return () => { window.clearTimeout(growthTimer); editor.current = null; view.destroy(); };
  }, [card.id, card.type, context, textType]);
  const wrap = (prefix: string, suffix = prefix) => { const view = editor.current; if (!view) return; const { from, to } = view.state.selection.main; view.dispatch({ changes: { from, to, insert: prefix + view.state.sliceDoc(from, to) + suffix }, selection: { anchor: from + prefix.length, head: to + prefix.length } }); view.focus(); };
  return <div className="board-editor nodrag nopan nowheel" onDoubleClick={event => event.stopPropagation()}>
    {card.type !== "group" && <div className="board-editor-tools"><button aria-label="Bold" onMouseDown={event => event.preventDefault()} onClick={() => wrap("**")}>B</button><button aria-label="Italic" onMouseDown={event => event.preventDefault()} onClick={() => wrap("*")}><i>I</i></button><button aria-label="Heading" onMouseDown={event => event.preventDefault()} onClick={() => wrap("## ", "")}>H</button><button aria-label="List" onMouseDown={event => event.preventDefault()} onClick={() => wrap("- ", "")}>☷</button><button aria-label="Highlight text" onMouseDown={event => event.preventDefault()} onClick={() => wrap("==")}>Highlight</button><button aria-label="Inline math" onMouseDown={event => event.preventDefault()} onClick={() => wrap("\\(", "\\)")}>∑</button><button aria-label="Finish editing" onClick={() => context.edit(null)}>Done</button></div>}
    <div ref={host} className="board-editor-host" />
  </div>;
}
function MathMarkdown({ text }: { text: string }) {
  const html = useMemo(() => {
    // Render one Markdown tree so inline math remains inside its paragraph.
    // Protect notation during Markdown parsing, then let the existing ExamText
    // sanitizer and KaTeX renderer handle every expression.
    let prefix = "CANVASMATHTOKEN"; while (text.includes(prefix)) prefix += "X";
    const expressions: string[] = [];
    const markdown = text.replace(/(\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\)|\$\$[\s\S]+?\$\$|(?<![\\$])\$(?!\s)[^\n$]*[^\s\n$]\$(?![\d$]))/g, expression => { const index = expressions.length; expressions.push(expression.startsWith("$") && !expression.startsWith("$$") ? `\\(${expression.slice(1, -1)}\\)` : expression); return `${prefix}${index}END`; });
    const rendered = renderToStaticMarkup(<ReactMarkdown components={{ a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>, img: ({ alt }) => <span>[{alt || "Image"} — use an image card to attach media]</span> }}>{markdown}</ReactMarkdown>);
    return rendered.replace(/==([^<\n]+?)==/g, "<mark>$1</mark>").replace(new RegExp(`${prefix}(\\d+)END`, "g"), (_token, index) => expressions[Number(index)].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;"));
  }, [text]);
  return <div className="board-markdown"><ExamText html={html} /></div>;
}
function ContentCard({ card, context, selected, editing, mayEdit, textType }: { card: BoardNode; context: BoardCardContextValue; selected: boolean; editing: boolean; mayEdit: boolean; textType?: Y.Text }) {
  const [source, setSource] = useState<BoardContent | null>(null), [error, setError] = useState("");
  const sourceKey = JSON.stringify(card.reference);
  useEffect(() => { let active = true, retries = 0, timer = 0; const load = async () => { try { const item = await boardApi(context.token).source(context.session.snapshot().board.id, card.id); if (active) { setSource(item); setError(""); } } catch (error) { if (!active) return; if (retries++ < 4) timer = window.setTimeout(() => void load(), 400 * 2 ** retries); else setError(error instanceof Error ? error.message : "Source unavailable."); } }; void load(); return () => { active = false; window.clearTimeout(timer); }; }, [card.id, sourceKey, context.token, context.session]);
  if (source?.viewer) return <div className="board-source-screen"><BoardPassageViewer source={source} card={card} context={context} />{card.reference?.questionId && <section className="board-extracted-notes nodrag nopan nowheel" onClick={event => event.stopPropagation()}><header><strong>Reasoning & notes</strong>{mayEdit && !editing && <button onClick={() => context.edit(card.id)}>Edit note</button>}</header>{editing && mayEdit ? <CollaborativeEditor card={card} context={context} textType={textType} /> : <div onDoubleClick={event => { event.stopPropagation(); if (mayEdit) context.edit(card.id); }}>{card.text ? <MathMarkdown text={card.text} /> : <small>Add your reasoning here.</small>}</div>}</section>}</div>;
  return <div className={`board-source ${selected ? "nowheel" : ""}`}><small>{card.type.replace("-", " ")}</small><strong className="board-card-drag-handle">{source?.title ?? card.text}</strong>{error ? <p>{error}</p> : source ? <><BoardAnnotations card={card} context={context} revisionKey={source.passage || source.prompt || ""}><div data-board-highlight-key="source"><ExamText text={source.passage || source.prompt} />{source.choices?.map(choice => <p key={choice.id}><b>{choice.id}.</b> <ExamText text={choice.text} html={choice.html} /></p>)}</div></BoardAnnotations><a className="nodrag" href={source.href} target="_blank" rel="noopener noreferrer">Open source <ExternalLink size={12} /></a></> : <p>Loading source…</p>}</div>;
}
function AssetCard({ card, context }: { card: BoardNode; context: BoardCardContextValue }) {
  const [asset, setAsset] = useState<{ url: string; name: string; mime: string } | null>(null), [error, setError] = useState("");
  useEffect(() => {
    let active = true; let timer = 0;
    const load = async () => { try { const item = await boardApi(context.token).asset(context.session.snapshot().board.id, card.assetId!); if (active) { setAsset(item); setError(""); timer = window.setTimeout(() => void load(), 50000); } } catch { if (active) setError("Attachment unavailable. Reopen the board to try again."); } };
    if (card.assetId) void load(); return () => { active = false; window.clearTimeout(timer); };
  }, [card.assetId, context.token, context.session]);
  return card.type === "image" ? <><img draggable={false} src={asset?.url} alt={card.text || "Board image"} className="board-image" />{error && <small>{error}</small>}</> : <div className="board-file"><FileText size={30} /><strong>{card.text}</strong>{asset && <a className="nodrag" href={asset.url} target="_blank" rel="noopener noreferrer">Download file</a>}{error && <small>{error}</small>}</div>;
}
export const BoardCard = memo(function BoardCard({ data, selected }: NodeProps<CanvasCard>) {
  const context = useContext(BoardCardContext)!;
  const { card, editing, mayEdit, collaborator } = data;
  const isGroup = card.type === "group";
  return <div className={`board-card ${isGroup ? "board-group" : ""} ${selected ? "is-selected" : ""} ${collaborator ? "is-collaborating" : ""}`} style={{ "--card-color": card.color || "#bac5cf", "--peer-color": data.color || "#4383b0" } as CSSProperties} onDoubleClick={event => { if (mayEdit && ["note", "math", "group", "link"].includes(card.type)) { event.stopPropagation(); context.edit(card.id); } }}>
    <NodeResizer minWidth={isGroup ? 160 : 120} minHeight={isGroup ? 100 : 70} isVisible={selected && mayEdit && !editing} color={card.color || "#28796f"} onResizeEnd={(_event, values) => context.resize(card.id, values)} />
    {card.locked && <span className="board-lock" title="Source card locked"><LockKeyhole size={12} /></span>}
    {collaborator && <span className="board-collaborator">{collaborator}</span>}
    {isGroup ? <div className="board-group-title">{editing ? <CollaborativeEditor card={card} context={context} textType={data.textType} /> : card.text || "Untitled group"}</div> : editing && !card.reference && !card.assetId ? <CollaborativeEditor card={card} context={context} textType={data.textType} /> : card.reference ? <ContentCard card={card} context={context} selected={selected} editing={editing} mayEdit={mayEdit} textType={data.textType} /> : card.assetId ? <AssetCard card={card} context={context} /> : card.type === "link" ? <div className="board-link"><ExternalLink size={18} /><strong>{card.text || (card.url ? new URL(card.url).hostname : "Web link")}</strong><a className="nodrag" href={card.url} target="_blank" rel="noopener noreferrer">{card.url}</a></div> : <><div className="board-note-grip board-card-drag-handle">{card.type === "math" ? "Math note" : "Note"}<span aria-hidden="true">⠿</span></div><BoardAnnotations card={card} context={context} revisionKey={card.text}><div className="board-note-preview" data-board-highlight-key="note">{card.text ? <MathMarkdown text={card.text} /> : <span className="board-note-placeholder">Double-click to write{card.type === "math" ? " a math note" : " a note"}</span>}</div></BoardAnnotations></>}
    {[Position.Top, Position.Right, Position.Bottom, Position.Left].map(position => <Handle key={position} type="source" position={position} id={position} isConnectable={context.session.snapshot().board.role !== "viewer" && !context.session.snapshot().board.archivedAt && context.session.snapshot().status !== "Recovery needed"} />)}
  </div>;
});
