import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { ArrowUpRight, Check, Flag, LockKeyhole, Medal, RefreshCw, Sparkles, Star, Target, Trophy, Upload } from "lucide-react";
import { createAuthHeaders, requestApi } from "../../lib/api";
import { defaultAchievementDesign, defaultEnglishAchievementDesign, defaultLoginAchievementDesign, type AchievementDesign, type AchievementProgress, type AchievementResponse, type AchievementEntry, type AchievementCollectionResponse, type AchievementId } from "../../../../server/src/shared/achievements";
import "./achievements.css";

const icons = { trophy: Trophy, star: Star, medal: Medal, sparkles: Sparkles };
const sampleProgress: AchievementProgress = { id: "perfect-math", correct: 43, total: 57, percentage: 43 / 57 * 100, earnedAt: null, examTitle: "Example math test", attempts: 1 };
const formatDays = (value: number) => `${value} ${value === 1 ? "day" : "days"}`;
const formatPercent = (value: number) => value === 100 ? "100" : String(Math.floor(value * 10) / 10);
const subjectFor = (id: AchievementId) => id === "login-week" ? "Login streak" : id === "perfect-english" ? "English" : "Math";
const ruleFor = (id: AchievementId) => id === "login-week" ? "Log in on seven consecutive New York calendar days. Multiple visits on the same day count once. Once earned, the badge stays unlocked." : id === "perfect-english" ? "100% on the complete English section of an official SHSAT practice test. Prestige tests do not count." : "100% on one submitted Math test or complete Math section.";
type StudentAchievement = AchievementEntry & { progress: AchievementProgress };

function BadgeArt({ design, earned, small = false }: { design: AchievementDesign; earned: boolean; small?: boolean }) {
  const Icon = icons[design.icon];
  return <div className={`achievement-emblem ${earned ? "is-unlocked" : "is-locked"} ${small ? "is-small" : ""}`} aria-hidden="true"><span className="achievement-emblem-spark spark-one">✦</span><span className="achievement-emblem-spark spark-two">✧</span><div className="achievement-emblem-shield"><div className="achievement-emblem-face">{design.image ? <img src={design.image} alt="" /> : <Icon size={48} strokeWidth={1.7} />}</div></div><span className="achievement-emblem-seal">{earned ? <Check size={13} /> : <LockKeyhole size={12} />}</span></div>;
}

export function AchievementCard({ design, progress }: { design: AchievementDesign; progress: AchievementProgress }) {
  const earned = Boolean(progress.earnedAt);
  const subject = subjectFor(progress.id);
  const isLogin = progress.id === "login-week";
  return <article className={`achievement-card achievement-card--${design.frame} ${earned ? "is-earned" : ""}`} style={{ "--achievement-accent": design.accent } as CSSProperties}>
    <BadgeArt design={design} earned={earned} />
    <div className="achievement-card-body"><span className="achievement-card-status">{earned ? <><Check size={13} /> Unlocked</> : <><LockKeyhole size={12} /> {progress.attempts || isLogin && progress.correct ? "In progress" : "Ready to begin"}</>}</span><h3>{design.title}</h3><p>{design.description}</p>
      <div className="achievement-progress-label"><span>{isLogin ? "Best login streak" : `Best ${progress.id === "perfect-english" ? "official English" : subject} score`}</span><strong>{isLogin ? formatDays(progress.bestStreak ?? progress.correct) : `${formatPercent(progress.percentage)}%`}</strong></div>
      <progress aria-label={isLogin ? "Progress toward seven consecutive login days" : `Progress toward a perfect ${subject} score`} value={progress.percentage} max={100} />
      {isLogin && <small>Current streak: {formatDays(progress.currentStreak ?? 0)} · Goal: 7 days</small>}
      <small>{earned ? `Earned ${new Date(progress.earnedAt!).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", timeZone: isLogin ? "America/New_York" : undefined })}` : isLogin ? `${progress.correct} of 7 consecutive days reached. Come back each day to keep going.` : progress.total ? `${progress.correct} of ${progress.total} correct on your best test` : progress.id === "perfect-english" ? "Submit an official English practice test to begin." : "Your first submitted Math test starts the journey."}</small>
    </div>
  </article>;
}

function LoginJourney({ progress, collection }: { progress: AchievementProgress; collection: boolean }) {
  return <section className={`achievement-journey ${collection ? "achievement-journey--collection" : ""}`}>
    <div className="achievement-journey-heading"><span><Star size={18} /> Login streak</span><span className="achievement-journey-goal">{progress.correct} / 7 days</span></div>
    <h3>{progress.earnedAt ? "A week of showing up." : "One day at a time."}</h3><p>{ruleFor("login-week")}</p>
    <ol className="achievement-checkpoints" aria-label="Login streak checkpoints">{[1, 3, 5, 7].map(day => <li key={day} className={progress.correct >= day ? "is-reached" : ""}><span>{progress.correct >= day ? <Check size={16} /> : <Star size={14} />}</span><strong>{day} {day === 1 ? "day" : "days"}</strong><small>{progress.correct >= day ? "Reached" : day === 7 ? "Unlock" : "Next step"}</small></li>)}</ol>
    <div className="achievement-best-result"><strong>Current streak: {formatDays(progress.currentStreak ?? 0)}</strong><p>Best streak: {formatDays(progress.bestStreak ?? progress.correct)}. {progress.earnedAt ? "Your badge stays unlocked, even after a missed day." : "A missed day resets your current streak. Your best streak stays saved."}</p></div>
    <p className="achievement-journey-footnote"><LockKeyhole size={13} />Days follow New York time. Refreshing or opening another tab does not add another day.</p>
  </section>;
}

function AchievementCollection({ achievements, preview = false }: { achievements: StudentAchievement[]; preview?: boolean }) {
  const [filter, setFilter] = useState<"all" | "earned" | "progress">("all");
  const earnedCount = achievements.filter(item => item.progress.earnedAt).length;
  const visible = achievements.filter(item => filter === "all" || (filter === "earned" ? Boolean(item.progress.earnedAt) : !item.progress.earnedAt));
  const { design, progress } = achievements.find(item => !item.progress.earnedAt) ?? achievements[0];
  const earned = Boolean(progress.earnedAt), subject = subjectFor(progress.id);
  return <div className={`achievement-collection ${preview ? "is-preview" : ""}`} style={{ "--achievement-accent": design.accent } as CSSProperties}>
    {!preview && <aside className="achievement-profile"><div className="achievement-profile-cover"><Star size={24} /></div><div className="achievement-profile-body"><div className="achievement-collection-ring" style={{ "--collection-fill": `${earnedCount / achievements.length * 100}%` } as CSSProperties}><span><strong>{earnedCount}<small>/ {achievements.length}</small></strong><small>{earnedCount === 1 ? "badge unlocked" : "badges unlocked"}</small></span></div><h3>{earnedCount === achievements.length ? "A perfect finish." : "Great things take practice."}</h3><p>{earnedCount ? "Your milestones have a place in the collection." : "Keep practicing and showing up to earn your next badge."}</p><dl>{achievements.map(item => <div key={item.id}><dt><Target size={15} />{item.id === "login-week" ? "Current login streak" : `Best ${item.id === "perfect-english" ? "official English" : "Math"}`}</dt><dd>{item.id === "login-week" ? formatDays(item.progress.currentStreak ?? 0) : `${formatPercent(item.progress.percentage)}%`}</dd></div>)}<div><dt><Flag size={15} />Qualifying sections</dt><dd>{achievements.reduce((sum, item) => sum + item.progress.attempts, 0)}</dd></div></dl><div className="achievement-profile-note"><Sparkles size={16} /><span>Your achievements stay with you. Keep building on them.</span></div></div></aside>}
    <div className="achievement-gallery"><div className="achievement-gallery-heading"><div><h3>{preview ? "A badge worth earning" : "Small wins. Big milestones."}</h3></div><span className="achievement-count">{achievements.length} available {achievements.length === 1 ? "badge" : "badges"}</span></div>
      <div className="achievement-filters" role="group" aria-label="Filter achievements">{([['all', 'All badges', achievements.length], ['earned', 'Unlocked', earnedCount], ['progress', 'In progress', achievements.length - earnedCount]] as const).map(([value, label, count]) => <button type="button" key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}<span>{count}</span></button>)}</div>
      <div className="achievement-gallery-grid">{visible.length ? visible.map(item => <AchievementCard key={item.id} design={item.design} progress={item.progress} />) : <div className="achievement-filter-empty"><Trophy size={34} /><h3>{filter === "earned" ? "Your first badge is waiting." : "You're all caught up!"}</h3><p>{filter === "earned" ? "Earn a perfect test score or log in seven days in a row." : "You've earned every available badge."}</p><button type="button" onClick={() => setFilter("all")}>View all badges <ArrowUpRight size={14} /></button></div>}
        {progress.id === "login-week" ? <LoginJourney progress={progress} collection={achievements.length > 1} /> : <section className={`achievement-journey ${achievements.length > 1 ? "achievement-journey--collection" : ""}`}><div className="achievement-journey-heading"><span><Target size={18} /> {subject} · {earned ? "MISSION COMPLETE" : "ROAD TO PERFECT"}</span><span className="achievement-journey-goal">100%</span></div><h3>{earned ? "Every question. Every point." : progress.attempts ? "Your next personal best starts here." : "Your collection starts with one test."}</h3><p>{earned ? `You answered every ${subject} question correctly in a qualifying test. This badge is yours.` : `Earn the badge with ${ruleFor(progress.id)}`}</p>
          <ol className="achievement-checkpoints" aria-label={`Best ${subject} score checkpoints`}>{[25, 50, 75, 100].map(point => <li key={point} className={progress.percentage >= point ? "is-reached" : ""}><span>{progress.percentage >= point ? <Check size={16} /> : point === 100 ? <Trophy size={17} /> : <Star size={14} />}</span><strong>{point}%</strong><small>{progress.percentage >= point ? "Reached" : point === 100 ? "Unlock" : "Next step"}</small></li>)}</ol>
          <div className="achievement-best-result"><span>{earned ? "BADGE-EARNING RESULT" : "YOUR BEST RESULT"}</span><strong>{progress.total ? `${progress.correct} / ${progress.total} correct` : `No qualifying ${subject} tests yet`}</strong><p>{progress.examTitle ?? `Submit a complete ${subject} section${progress.id === "perfect-english" ? " on an official practice test" : ""} to begin tracking your progress.`}</p></div>
          <p className="achievement-journey-footnote"><LockKeyhole size={13} />{progress.id === "perfect-english" ? "Only official practice tests count toward the English badge. Prestige tests are excluded." : "Based on submitted tests. Practice games don't change your badge progress."}</p>
        </section>}
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
  const [data, setData] = useState<AchievementEntry[] | null>(null);
  const [selectedId, setSelectedId] = useState<AchievementId>("perfect-math");
  const selectedIdRef = useRef<AchievementId>("perfect-math");
  const [draft, setDraft] = useState<AchievementDesign>(defaultAchievementDesign);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);
  const [earnedPreview, setEarnedPreview] = useState(false);
  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    requestApi<AchievementCollectionResponse>("/api/achievements", { headers: createAuthHeaders(accessToken) }).then(next => { if (active) { setData(next.achievements); setDraft(next.achievements.find(item => item.id === selectedIdRef.current)!.design); setMessage(""); } }).catch(reason => { if (active) setMessage(reason instanceof Error ? reason.message : "Could not load achievements."); });
    return () => { active = false; };
  }, [accessToken, reload]);
  const selected = data?.find(item => item.id === selectedId);
  const defaultDesign = selectedId === "login-week" ? defaultLoginAchievementDesign : selectedId === "perfect-english" ? defaultEnglishAchievementDesign : defaultAchievementDesign;
  const previewProgress: AchievementProgress = selectedId === "login-week" ? { id: selectedId, correct: earnedPreview ? 7 : 4, total: 7, percentage: earnedPreview ? 100 : 4 / 7 * 100, earnedAt: earnedPreview ? new Date().toISOString() : null, examTitle: null, attempts: 0, currentStreak: earnedPreview ? 7 : 4, bestStreak: earnedPreview ? 7 : 4 } : { ...sampleProgress, id: selectedId, examTitle: selectedId === "perfect-english" ? "Example official English practice test" : sampleProgress.examTitle, ...(earnedPreview ? { correct: 57, percentage: 100, earnedAt: new Date().toISOString() } : {}) };
  async function save(event: FormEvent) {
    event.preventDefault(); if (!selected) return;
    setBusy(true); setMessage("");
    try {
      const next = await requestApi<AchievementResponse>(`/api/achievements/${selectedId}/design`, { method: "PUT", headers: createAuthHeaders(accessToken), body: JSON.stringify({ design: draft, revision: selected.revision }) });
      setData(current => current!.map(item => item.id === selectedId ? { ...item, ...next } : item)); setDraft(next.design); setMessage("Design saved. Students will see it in Achievements.");
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : "Could not save the design."); }
    finally { setBusy(false); }
  }
  return <section className="achievements-workspace">
    <header className="achievements-intro"><div><h2>{teacher ? "Achievement studio" : "Your achievements"}</h2><p>{teacher ? "Give your classroom a collection worth working toward. Create a badge, make it yours, and watch students unlock it." : "A little effort. A new personal best. Something worth collecting."}</p></div><button type="button" disabled={busy} onClick={() => setReload(value => value + 1)}><RefreshCw size={14} /> Refresh</button></header>
    {message && <p role="status" className="achievements-message">{message}</p>}
    {!data ? <p>{message ? "Use Reload to try again." : "Loading achievements…"}</p> : teacher ? <div className="achievement-studio-layout">
      <form className="achievement-editor" onSubmit={save}>
        <label>Choose achievement<select value={selectedId} disabled={busy} onChange={event => { const id = event.target.value as AchievementId; selectedIdRef.current = id; setSelectedId(id); setDraft(data.find(item => item.id === id)!.design); setMessage(""); }}>{data.map(item => <option key={item.id} value={item.id}>{item.id === "login-week" ? "Seven-day login streak" : `Perfect ${subjectFor(item.id)} score`}</option>)}</select></label>
        <label>Achievement name<input value={draft.title} required maxLength={80} onChange={event => setDraft({ ...draft, title: event.target.value })} /></label>
        <label>Description<textarea value={draft.description} required maxLength={240} rows={3} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
        <div className="achievement-editor-row"><label>Accent color<input type="color" value={draft.accent} onChange={event => setDraft({ ...draft, accent: event.target.value })} /></label><label>Card style<select value={draft.frame} onChange={event => setDraft({ ...draft, frame: event.target.value as AchievementDesign["frame"] })}><option value="classic">Classic</option><option value="spotlight">Spotlight</option><option value="minimal">Minimal</option></select></label></div>
        <fieldset><legend>Badge icon</legend><div className="achievement-icons">{Object.entries(icons).map(([key, Icon]) => <button type="button" aria-label={key} aria-pressed={draft.icon === key} key={key} onClick={() => setDraft({ ...draft, icon: key as AchievementDesign["icon"] })}><Icon size={22} /></button>)}</div></fieldset>
        <label className="achievement-upload"><span><Upload size={16} /> Custom picture</span><input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={async event => {
          const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
          setBusy(true); try { const image = await preparePicture(file); setDraft(current => ({ ...current, image })); setMessage("Picture ready. Save design to share it with students."); } catch (reason) { setMessage((reason as Error).message); } finally { setBusy(false); }
        }} /><small>PNG, JPEG, or WebP. Automatically fitted to the badge.</small></label>
        {draft.image && <button type="button" onClick={() => setDraft({ ...draft, image: "" })}>Remove picture</button>}
        <p className="achievement-rule">Award rule: {ruleFor(selectedId)} Changing the design keeps this rule and student progress.</p>
        <div className="achievement-editor-actions"><button className="achievement-save" disabled={busy} type="submit">{busy ? "Saving…" : "Save design"}</button><button disabled={busy} type="button" onClick={() => setDraft(defaultDesign)}>Use default design</button></div>
      </form>
      <div className="achievement-preview"><div className="achievement-preview-toggle"><strong>Student preview · Sample progress</strong><label><input type="checkbox" checked={earnedPreview} onChange={event => setEarnedPreview(event.target.checked)} /> Show earned</label></div><AchievementCollection preview achievements={[{ id: selectedId, design: draft, revision: selected?.revision ?? 0, progress: previewProgress }]} /></div>
    </div> : <AchievementCollection achievements={data as StudentAchievement[]} />}
  </section>;
}
