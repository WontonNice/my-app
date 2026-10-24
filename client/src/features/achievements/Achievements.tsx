import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowUpRight, Check, Flag, LockKeyhole, Medal, RefreshCw, Sparkles, Star, Target, Trophy, Upload } from "lucide-react";
import { createAuthHeaders, requestApi } from "../../lib/api";
import { defaultAchievementDesign, type AchievementDesign, type AchievementProgress, type AchievementResponse } from "../../../../server/src/shared/achievements";
import "./achievements.css";

const icons = { trophy: Trophy, star: Star, medal: Medal, sparkles: Sparkles };
const sampleProgress: AchievementProgress = { id: "perfect-math", correct: 43, total: 57, percentage: 43 / 57 * 100, earnedAt: null, examTitle: "Example math test", attempts: 1 };
const formatPercent = (value: number) => value === 100 ? "100" : String(Math.floor(value * 10) / 10);

function BadgeArt({ design, earned, small = false }: { design: AchievementDesign; earned: boolean; small?: boolean }) {
  const Icon = icons[design.icon];
  return <div className={`achievement-emblem ${earned ? "is-unlocked" : "is-locked"} ${small ? "is-small" : ""}`} aria-hidden="true"><span className="achievement-emblem-spark spark-one">✦</span><span className="achievement-emblem-spark spark-two">✧</span><div className="achievement-emblem-shield"><div className="achievement-emblem-face">{design.image ? <img src={design.image} alt="" /> : <Icon size={48} strokeWidth={1.7} />}</div></div><span className="achievement-emblem-seal">{earned ? <Check size={13} /> : <LockKeyhole size={12} />}</span></div>;
}

export function AchievementCard({ design, progress }: { design: AchievementDesign; progress: AchievementProgress }) {
  const earned = Boolean(progress.earnedAt);
  return <article className={`achievement-card achievement-card--${design.frame} ${earned ? "is-earned" : ""}`} style={{ "--achievement-accent": design.accent } as CSSProperties}>
    <div className="achievement-card-top"><span><Sparkles size={12} /> MATH MASTERY</span><span className="achievement-card-number">01</span></div>
    <BadgeArt design={design} earned={earned} />
    <div className="achievement-card-body"><span className="achievement-card-status">{earned ? <><Check size={13} /> Unlocked</> : <><LockKeyhole size={12} /> {progress.attempts ? "In progress" : "Ready to begin"}</>}</span><h3>{design.title}</h3><p>{design.description}</p>
      <div className="achievement-progress-label"><span>Best Math score</span><strong>{formatPercent(progress.percentage)}%</strong></div>
      <progress aria-label="Progress toward a perfect Math score" value={progress.percentage} max={100} />
      <small>{earned ? `Earned ${new Date(progress.earnedAt!).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}` : progress.total ? `${progress.correct} of ${progress.total} correct on your best test` : "Your first submitted Math test starts the journey."}</small>
    </div>
  </article>;
}

function AchievementCollection({ design, progress, preview = false }: { design: AchievementDesign; progress: AchievementProgress; preview?: boolean }) {
  const [filter, setFilter] = useState<"all" | "earned" | "progress">("all");
  const earned = Boolean(progress.earnedAt), visible = filter === "all" || (filter === "earned" ? earned : !earned);
  return <div className={`achievement-collection ${preview ? "is-preview" : ""}`} style={{ "--achievement-accent": design.accent } as CSSProperties}>
    {!preview && <aside className="achievement-profile"><div className="achievement-profile-cover"><Star size={24} /><span>YOUR NEXT GREAT THING</span></div><div className="achievement-profile-body"><div className="achievement-collection-ring" style={{ "--collection-fill": earned ? "100%" : "0%" } as CSSProperties}><span><strong>{earned ? 1 : 0}<small>/ 1</small></strong><small>badge unlocked</small></span></div><h3>{earned ? "A perfect finish." : "Great things take practice."}</h3><p>{earned ? "Your perfect Math score has a place in the collection." : "Every test is another chance to get closer to your next badge."}</p><dl><div><dt><Target size={15} />Best Math score</dt><dd>{formatPercent(progress.percentage)}%</dd></div><div><dt><Flag size={15} />Submitted Math tests</dt><dd>{progress.attempts}</dd></div></dl><div className="achievement-profile-note"><Sparkles size={16} /><span>Your best score stays with you. Keep building on it.</span></div></div></aside>}
    <div className="achievement-gallery"><div className="achievement-gallery-heading"><div><span className="achievement-eyebrow">THE COLLECTION</span><h3>{preview ? "A badge worth earning" : "Small wins. Big milestones."}</h3></div><span className="achievement-count">1 available badge</span></div>
      <div className="achievement-filters" role="group" aria-label="Filter achievements">{([['all', 'All badges', 1], ['earned', 'Unlocked', earned ? 1 : 0], ['progress', 'In progress', earned ? 0 : 1]] as const).map(([value, label, count]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{count}</span></button>)}</div>
      <div className="achievement-gallery-grid">{visible ? <AchievementCard design={design} progress={progress} /> : <div className="achievement-filter-empty"><Trophy size={34} /><h3>{filter === "earned" ? "Your first badge is waiting." : "You're all caught up!"}</h3><p>{filter === "earned" ? "A perfect Math test unlocks your first achievement." : "You've earned every available badge."}</p><button type="button" onClick={() => setFilter("all")}>View all badges <ArrowUpRight size={14} /></button></div>}
        <section className="achievement-journey"><div className="achievement-journey-heading"><span><Target size={18} /> {earned ? "MISSION COMPLETE" : "ROAD TO PERFECT"}</span><span className="achievement-journey-goal">100%</span></div><h3>{earned ? "Every question. Every point." : progress.attempts ? "Your next personal best starts here." : "Your collection starts with one test."}</h3><p>{earned ? "You answered every Math question correctly in a submitted test. This badge is yours." : "Earn the badge by answering every question correctly on one submitted Math test or complete Math section."}</p>
          <ol className="achievement-checkpoints" aria-label="Best Math score checkpoints">{[25, 50, 75, 100].map(point => <li key={point} className={progress.percentage >= point ? "is-reached" : ""}><span>{progress.percentage >= point ? <Check size={16} /> : point === 100 ? <Trophy size={17} /> : <Star size={14} />}</span><strong>{point}%</strong><small>{progress.percentage >= point ? "Reached" : point === 100 ? "Unlock" : "Next step"}</small></li>)}</ol>
          <div className="achievement-best-result"><span>{earned ? "BADGE-EARNING RESULT" : "YOUR BEST RESULT"}</span><strong>{progress.total ? `${progress.correct} / ${progress.total} correct` : "No submitted Math tests yet"}</strong><p>{progress.examTitle ?? "Submit a complete Math section to begin tracking your progress."}</p></div>
          <p className="achievement-journey-footnote"><LockKeyhole size={13} />Based on submitted tests. Practice games don't change your badge progress.</p>
        </section>
      </div>
    </div>
  </div>;
}

async function preparePicture(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error("Choose a PNG, JPEG, or WebP image up to 10 MB.");
  const url = URL.createObjectURL(file);
  try {
    const image = new Image(); image.src = url; await image.decode();
    const scale = Math.min(1, 640 / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas"); canvas.width = Math.max(1, Math.round(image.width * scale)); canvas.height = Math.max(1, Math.round(image.height * scale));
    const context = canvas.getContext("2d"); if (!context) throw new Error("Image preparation is unavailable in this browser.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/webp", 0.85);
    if (data.length > 460000) throw new Error("This image is too detailed. Choose a smaller picture.");
    return data;
  } finally { URL.revokeObjectURL(url); }
}

export function Achievements({ accessToken, teacher = false }: { accessToken: string; teacher?: boolean }) {
  const [data, setData] = useState<AchievementResponse | null>(null);
  const [draft, setDraft] = useState<AchievementDesign>(defaultAchievementDesign);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [earnedPreview, setEarnedPreview] = useState(false);
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    requestApi<AchievementResponse>("/api/achievements", { headers: createAuthHeaders(accessToken) }).then(next => { if (active) { setData(next); setDraft(next.design); setMessage(""); } }).catch(reason => { if (active) setMessage(reason instanceof Error ? reason.message : "Could not load achievements."); });
    return () => { active = false; };
  }, [accessToken, reload]);
  async function save(event: FormEvent) {
    event.preventDefault(); if (!data) return;
    setBusy(true); setMessage("");
    try {
      const next = await requestApi<AchievementResponse>("/api/achievements/perfect-math/design", { method: "PUT", headers: createAuthHeaders(accessToken), body: JSON.stringify({ design: draft, revision: data.revision }) });
      setData(next); setDraft(next.design); setMessage("Design saved. Students will see it in Achievements.");
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Could not save the design."); }
    finally { setBusy(false); }
  }
  return <section className="achievements-workspace">
    <header className="achievements-intro"><div><span><Sparkles size={14} /> THE TROPHY ROOM</span><h2>{teacher ? "Achievement studio" : "Your achievements"}</h2><p>{teacher ? "Give your classroom a collection worth working toward. Create a badge, make it yours, and watch students unlock it." : "A little effort. A new personal best. Something worth collecting."}</p></div><button type="button" disabled={busy} onClick={() => setReload(value => value + 1)}><RefreshCw size={14} /> Refresh</button></header>
    {message && <p role="status" className="achievements-message">{message}</p>}
    {!data ? <p>{message ? "Use Reload to try again." : "Loading achievements…"}</p> : teacher ? <div className="achievement-studio-layout">
      <form className="achievement-editor" onSubmit={save}>
        <label>Achievement name<input value={draft.title} required maxLength={80} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label>
        <label>Description<textarea value={draft.description} required maxLength={240} rows={3} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
        <div className="achievement-editor-row"><label>Accent color<input type="color" value={draft.accent} onChange={event => setDraft({ ...draft, accent: event.target.value })} /></label><label>Card style<select value={draft.frame} onChange={event => setDraft({ ...draft, frame: event.target.value as AchievementDesign["frame"] })}><option value="classic">Classic</option><option value="spotlight">Spotlight</option><option value="minimal">Minimal</option></select></label></div>
        <fieldset><legend>Badge icon</legend><div className="achievement-icons">{Object.entries(icons).map(([key, Icon]) => <button type="button" aria-label={key} aria-pressed={draft.icon === key} key={key} onClick={() => setDraft({ ...draft, icon: key as AchievementDesign["icon"] })}><Icon size={22} /></button>)}</div></fieldset>
        <label className="achievement-upload"><span><Upload size={16} /> Custom picture</span><input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={async event => {
          const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
          setBusy(true); try { const image = await preparePicture(file); setDraft(current => ({ ...current, image })); setMessage("Picture ready. Save design to share it with students."); } catch (reason) { setMessage((reason as Error).message); } finally { setBusy(false); }
        }} /><small>PNG, JPEG, or WebP. Automatically fitted to the badge.</small></label>
        {draft.image && <button type="button" onClick={() => setDraft({ ...draft, image: "" })}>Remove picture</button>}
        <p className="achievement-rule">Award rule: 100% on one submitted Math test or complete Math section. Changing the design keeps this rule and student progress.</p>
        <div className="achievement-editor-actions"><button className="achievement-save" disabled={busy} type="submit">{busy ? "Saving…" : "Save design"}</button><button disabled={busy} type="button" onClick={() => setDraft(defaultAchievementDesign)}>Use default design</button></div>
      </form>
      <div className="achievement-preview"><div className="achievement-preview-toggle"><strong>Student preview · Sample progress</strong><label><input type="checkbox" checked={earnedPreview} onChange={event => setEarnedPreview(event.target.checked)} /> Show earned</label></div><AchievementCollection preview design={draft} progress={earnedPreview ? { ...sampleProgress, correct: 57, percentage: 100, earnedAt: new Date().toISOString() } : sampleProgress} /></div>
    </div> : <AchievementCollection design={data.design} progress={data.progress!} />}
  </section>;
}
