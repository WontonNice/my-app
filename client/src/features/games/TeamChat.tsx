import { useEffect, useId, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import type { GameView } from "../../../../server/src/shared/gameRooms";
import "./team-chat.css";

export function TeamChat({ room, act, busy, readOnly = false }: { room: GameView; act: (action: string, body?: Record<string, unknown>) => Promise<boolean>; busy: boolean; readOnly?: boolean }) {
  const fieldId = useId();
  const [draft, setDraft] = useState("");
  const log = useRef<HTMLDivElement>(null);
  const messages = room.teamChat ?? [];
  const lastMessageId = messages.at(-1)?.id;
  const team = room.teams.find(item => item.id === (room.observingTeamId ?? room.me?.teamId));
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages.length, lastMessageId]);
  if (!team) return null;
  return <section className="team-chat" aria-label={`${team.name} chat`}><header><MessageCircle size={21} /><div><h3>{team.name} chat</h3><p>Team members only · Your teacher can view this chat.</p></div></header>
    <div className="team-chat-log" ref={log} role="log" aria-label="Team messages" aria-live="polite" aria-relevant="additions">{messages.length ? messages.map(message => <article key={message.id} className={message.playerId === room.me?.id ? "is-mine" : ""}><header><strong>{message.name}</strong><time dateTime={new Date(message.at).toISOString()}>{new Date(message.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time></header><p>{message.text}</p></article>) : <div className="team-chat-empty"><MessageCircle size={30} /><strong>Work it out together.</strong><p>Ask a question or explain your reasoning to your team.</p></div>}</div>
    {!readOnly && !room.me?.excusedAt ? <form onSubmit={event => { event.preventDefault(); const text = draft.trim(); if (text) void act("chat", { text, messageId: crypto.randomUUID() }).then(ok => { if (ok) setDraft(current => current === draft ? "" : current); }); }}><label htmlFor={fieldId}>Message your team</label><textarea id={fieldId} value={draft} maxLength={500} rows={3} onChange={event => setDraft(event.target.value)} placeholder="What do you think?" /><footer><small>{draft.length}/500 · Last 100 messages kept</small><button disabled={busy || !draft.trim()}><Send size={15} />Send</button></footer></form> : <p className="team-chat-readonly">{readOnly ? "Teacher view · Read only" : "You can read the chat while marked away."}</p>}
  </section>;
}
