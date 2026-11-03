import { useId, useRef, useState } from "react";
import { scoresAreComparable, type AnalyticsExam } from "../lib/studentAnalytics";
import { rawScore } from "../lib/sessionPreparation";

const dateLabel = (date: string | null) => date ? new Date(date).toLocaleDateString(undefined, { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" }) : "Date unavailable";

export function StudentScorePlot({ exams, metric, inspect }: { exams: AnalyticsExam[]; metric: "overall" | "english" | "math"; inspect: (exam: AnalyticsExam) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const id = useId();
  const popup = useRef<HTMLDivElement>(null);
  const pointRefs = useRef<Record<string, SVGGElement | null>>({});
  const close = () => { if (active && popup.current?.contains(document.activeElement)) pointRefs.current[active]?.focus(); setActive(null); };
  const first = Date.parse(exams[0].date!), last = Date.parse(exams.at(-1)!.date!);
  const points = exams.map(exam => ({ exam, x: first === last ? 330 : 45 + 565 * (Date.parse(exam.date!) - first) / (last - first), y: 120 - exam[metric]! }));
  const selected = points.find(point => point.exam.key === active);
  // Coincident records remain individually inspectable in the same popup.
  const matches = selected ? points.filter(point => point.x === selected.x && point.y === selected.y) : [];
  return <div className="sa-score-plot" onKeyDown={event => { if (event.key === "Escape") close(); }} onMouseLeave={() => { if (!popup.current?.contains(document.activeElement)) setActive(null); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(null); }}>
    <p className="sa-data-note">Hover, tap, or focus a point to see its assessment, date, and exact score.</p>
    <div className="sa-plot-canvas">
      <svg viewBox="0 0 640 160" role="group" aria-label={`${metric} score scatterplot`}>
        {[0, 50, 100].map(value => <g key={value}><line x1="35" y1={120 - value} x2="625" y2={120 - value} stroke="currentColor" opacity=".12" /><text x="0" y={124 - value} fontSize="10" fill="currentColor">{value}%</text></g>)}
        {points.map(({ exam, x, y }) => <g key={exam.key} ref={element => { pointRefs.current[exam.key] = element; }} className="sa-plot-point" role="button" tabIndex={0}
          aria-label={`${exam.title}, ${dateLabel(exam.date)}, ${rawScore(exam, metric)}, ${exam[metric]}%, ${exam.source}. Show score details`}
          aria-expanded={active === exam.key} aria-controls={active === exam.key ? id : undefined}
          onMouseEnter={() => setActive(exam.key)} onFocus={() => setActive(exam.key)} onClick={() => setActive(exam.key)}
          onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActive(exam.key); requestAnimationFrame(() => popup.current?.focus()); } }}>
          <circle cx={x} cy={y} r="13" fill="transparent" />
          <circle className="sa-plot-dot" cx={x} cy={y} r={active === exam.key ? 6 : 4.5} fill={scoresAreComparable(exam, exams.at(-1)!, metric) ? "currentColor" : "var(--sa-plot-bg, #fff)"} stroke="currentColor" strokeWidth="2" />
        </g>)}
        <text x="35" y="150" fontSize="10" fill="currentColor">{dateLabel(exams[0].date)}</text><text x="625" y="150" textAnchor="end" fontSize="10" fill="currentColor">{dateLabel(exams.at(-1)!.date)}</text>
      </svg>
      {selected && <div ref={popup} id={id} className="sa-plot-tooltip" tabIndex={-1} role="region" aria-label="Assessment score details" style={{ left: `${Math.max(0, Math.min(58, selected.x / 640 * 100 - 18))}%`, top: `${Math.max(12, selected.y / 160 * 100)}%` }}>
        <button type="button" className="sa-plot-close" aria-label="Close score details" onClick={close}>×</button>
        {matches.map(({ exam }) => <div key={exam.key}><strong>{exam.title}</strong><span>{dateLabel(exam.date)} · {exam.source}</span><b>{rawScore(exam, metric)} · {exam[metric]}% {metric === "overall" ? "overall" : metric === "english" ? "English" : "Math"}</b><small>{exam.scope} · {scoresAreComparable(exam, exams.at(-1)!, metric) ? "Matches latest question total" : "Different question total from latest"}</small><button type="button" className="sa-link" onClick={() => inspect(exam)}>Open result →</button></div>)}
      </div>}
    </div>
    <div className="sa-chart-points">{exams.map(exam => <button key={exam.key} type="button" onClick={() => inspect(exam)}>{dateLabel(exam.date)} <b>{rawScore(exam, metric)} · {exam[metric]}%</b></button>)}</div>
  </div>;
}
