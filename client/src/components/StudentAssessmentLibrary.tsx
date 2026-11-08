import { contentEditorQuestionHref } from '../lib/contentEditorLink';
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, Search, X } from "lucide-react";
import type { StudentAssessment } from "../lib/api";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { AppLink } from "./AppLink";
import "../styles/student-assessments.css";
import { ExamLibraryFilters } from "./ExamLibraryFilters";
import { compareExamLibrary, emptyExamLibraryFilter, examLibraryMetadata, matchesExamLibrary, isGrade9MathSample, worksheetPlacement, worksheetLibraryHref } from "../lib/examLibrary";

type AccessFilter = "all" | "open" | "locked";
type Sort = "available" | "year" | "form" | "category" | "name";
type Props = {
  assessments: StudentAssessment[]; previewContext: StudentPreviewContext;
  loading?: boolean; error?: boolean; onRetry?: () => void;
  heading?: string; description?: string; worksheetMode?: boolean; onToggleWorksheet?: (assessment: StudentAssessment) => void; savingWorksheet?: string;
};
function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60), remainder = minutes % 60;
  return hours ? hours + "h" + (remainder ? " " + remainder + "m" : "") : minutes + "m";
}

export function StudentAssessmentLibrary({ assessments, previewContext, loading = false, error = false, onRetry, heading = 'Assessments', description = 'Find your exam by name or year. Your teacher controls which sections are open.', worksheetMode = false, onToggleWorksheet, savingWorksheet }: Props) {
  const noun = worksheetMode ? "worksheet" : "exam";
  const teacherView = previewContext.isPreview && previewContext.mode === 'teacher';
  const initialParams = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(worksheetMode ? initialParams.get("libraryQuery") ?? "" : "");
  const [filter, setFilter] = useState<AccessFilter>(() => worksheetMode && ["open", "locked"].includes(initialParams.get("libraryAccess") ?? "") ? initialParams.get("libraryAccess") as AccessFilter : "all");
  const [sort, setSort] = useState<Sort>(() => worksheetMode && ["year", "form", "category", "name"].includes(initialParams.get("librarySort") ?? "") ? initialParams.get("librarySort") as Sort : "available");
  const [dimensions, setDimensions] = useState(() => worksheetMode ? Object.fromEntries(["year", "form", "category", "publisher", "shsatLevel", "collection"].map(key => [key, initialParams.get("library_" + key) ?? ""])) as typeof emptyExamLibraryFilter : emptyExamLibraryFilter);
  const returnUrl = new URL(window.location.href);
  if (worksheetMode) for (const [key, value] of Object.entries({ libraryQuery: query, libraryAccess: filter === "all" ? "" : filter, librarySort: sort === "available" ? "" : sort, ...Object.fromEntries(Object.entries(dimensions).map(([key,value]) => ["library_" + key, value])) })) {
    if (value) returnUrl.searchParams.set(key, value); else returnUrl.searchParams.delete(key);
  }
  const worksheetReturnHref = returnUrl.pathname + returnUrl.search;
  useEffect(() => {
    if (worksheetMode) window.history.replaceState(window.history.state, "", worksheetReturnHref);
  }, [worksheetMode, worksheetReturnHref]);
  const openCount = assessments.filter(item => item.status === "open").length;
  const matching = assessments.filter(item => (filter === "all" || item.status === filter) && matchesExamLibrary(item, query, dimensions)).sort((a, b) => {
    if (sort === "available") {
      const availability = Number(b.status === "open") - Number(a.status === "open");
      if (availability) return availability;
    }
    return compareExamLibrary(a, b, sort);
  });
  const tabs: { id: AccessFilter; label: string; count: number }[] = [
    { id: "all", label: worksheetMode ? "All worksheets" : "All exams", count: assessments.length },
    { id: "open", label: "Available", count: openCount },
    { id: "locked", label: "Locked", count: assessments.length - openCount },
  ];
  const reset = () => { setQuery(""); setFilter("all"); setDimensions(emptyExamLibraryFilter); };

  return <div className="student-section-page student-exams">
    <header className="student-section-heading"><div>{!worksheetMode && <p>Your exam library</p>}<h1>{heading}</h1><span>{description}</span></div>{!loading && !error && <strong>{openCount} available</strong>}</header>
    <section className="student-exams-library" aria-label={worksheetMode ? "Worksheet library" : "Exam library"} aria-busy={loading}>
      <div className="student-exams-toolbar">
        <div className="student-exams-search"><Search size={17} aria-hidden="true" /><input type="search" aria-label={worksheetMode ? "Search worksheets by name or year" : "Search exams by name or year"} placeholder={`Search by ${noun} name or year…`} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label={`Clear ${noun} search`} onClick={() => setQuery("")}><X size={15} /></button>}</div>
        <label className="student-exams-sort">Sort by<select value={sort} onChange={event => setSort(event.target.value as Sort)}><option value="available">Available first</option><option value="year">Year · newest</option>{!worksheetMode && <option value="form">Form A–Z</option>}<option value="category">Category</option><option value="name">Name A–Z</option></select></label>
      </div>
      <ExamLibraryFilters hideForm={worksheetMode} exams={assessments} value={dimensions} onChange={setDimensions} />
      <div className="student-exams-filterbar"><nav aria-label={`Filter ${noun}s by availability`}>{tabs.map(tab => <button type="button" key={tab.id} aria-pressed={filter === tab.id} onClick={() => setFilter(tab.id)}>{tab.label}<span>{loading || error ? "—" : tab.count}</span></button>)}</nav><span className="student-exams-count" role="status">{!loading && !error && (matching.length + " of " + assessments.length + (worksheetMode ? " worksheets" : " exams"))}</span></div>
      {loading ? <div className="student-exams-empty" role="status"><FileCheck2 size={25} /><h2>Loading your {noun}s…</h2></div>
        : error ? <div className="student-exams-empty" role="alert"><h2>{worksheetMode ? "Worksheets couldn't be loaded" : "Exams couldn't be loaded"}</h2><p>Try again to check which {noun}s are available.</p><button type="button" onClick={onRetry}>Try again</button></div>
          : !assessments.length ? <div className="student-exams-empty"><FileCheck2 size={25} /><h2>No {noun}s yet</h2><p>Your teacher’s {noun}s will appear here when they are ready.</p></div>
            : !matching.length ? <div className="student-exams-empty"><Search size={25} /><h2>{!query.trim() && filter === "open" && openCount === 0 ? `No ${noun}s are open right now` : `No matching ${noun}s`}</h2><p>{!query.trim() && filter === "open" && openCount === 0 ? `Your teacher will open a ${noun} when it’s time to begin.` : `Try a different ${noun} name, year, or availability filter.`}</p><button type="button" onClick={reset}>{!query.trim() && filter === "open" && openCount === 0 ? `View all ${noun}s` : "Clear filters"}</button></div>
              : <table className="student-exams-table">
                <caption className="sr-only">{worksheetMode ? "Worksheets" : "Exams"} with section access, question counts, time limits and availability</caption>
                <thead><tr><th scope="col">{worksheetMode ? "Worksheet / category" : "Exam name / category"}</th><th scope="col">{worksheetMode ? "Year" : "Year / form"}</th><th scope="col">Sections</th><th scope="col">Questions</th><th scope="col">Time</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Open {noun}</span></th></tr></thead>
                <tbody>{matching.map(assessment => {
                  const open = assessment.status === "open", reopened = open && assessment.reentry;
                  const placement = worksheetPlacement(assessment);
                  let href = appendStudentPreview("/exam/" + encodeURIComponent(assessment.id) + (teacherView ? '/session' : ''), previewContext);
                  const metadata = examLibraryMetadata(assessment);
                  if (placement) { const url = new URL(href, "http://local"); url.searchParams.set("worksheetReturn", worksheetMode ? worksheetReturnHref : worksheetLibraryHref(placement)); href = url.pathname + url.search; }
                  return <tr key={assessment.id} className={open ? "is-available" : "is-locked"}>
                    <th scope="row" className="student-exams-name">{open || teacherView ? <AppLink href={href}>{assessment.title}</AppLink> : <span>{assessment.title}</span>}<small>{placement ? [placement.category, placement.topic].filter(Boolean).join(" · ") : metadata.category}</small>{(metadata.publisher||metadata.shsatLevel)&&<small>{[metadata.publisher,metadata.shsatLevel?"SHSAT "+metadata.shsatLevel:""].filter(Boolean).join(" · ")}</small>}{reopened && <small className="is-reopened">{reopened.resetAnswers ? 'Section reset · Ready for a fresh attempt' : 'Reopened · Continue with your saved answers'}</small>}</th>
                    <td className="student-exams-year">{metadata.year || "—"}{!worksheetMode && <small>{metadata.form ? "Form " + metadata.form : "No form"}</small>}</td>
                    <td className="student-exams-sections"><div>{(worksheetPlacement(assessment) ? [worksheetPlacement(assessment)!.subject] : isGrade9MathSample(assessment)?["math"] as const:["english", "math"] as const).map(section => {
                      const available = open && assessment.sectionAccess[section], name = section === "english" ? "English" : "Math";
                      return <span key={section} className={available ? "is-open" : ""} title={name + (available ? " is open" : " is locked")}><span className="sr-only">{available ? "Open section: " : "Locked section: "}</span>{!available && <LockKeyhole size={11} aria-hidden="true" />}{name}</span>;
                    })}</div></td>
                    <td className="student-exams-questions"><strong>{assessment.questionCount}<span className="student-exams-mobile-label"> questions</span></strong>{assessment.passageCount>0&&<small>{assessment.passageCount} {assessment.passageCount === 1 ? "passage" : "passages"}</small>}</td>
                    <td className="student-exams-duration"><span title={assessment.durationMinutes + " minutes"}>{durationLabel(assessment.durationMinutes)}</span></td>
                    <td className="student-exams-status"><span className={open ? "is-open" : ""}>{open ? <CheckCircle2 size={13} aria-hidden="true" /> : <LockKeyhole size={13} aria-hidden="true" />}{reopened ? "Reopened" : open ? "Available" : "Locked"}</span></td>
                    <td className="student-exams-action">{teacherView ? <><AppLink href={href} aria-label={(worksheetMode ? 'Preview worksheet ' : 'View test ') + assessment.title}>{worksheetMode ? 'Preview' : 'View test'}<ArrowRight size={14} aria-hidden="true" /></AppLink>{worksheetMode ? <><button className="student-exams-manage" type="button" role="switch" aria-label={'Student access for ' + assessment.title} aria-checked={open} disabled={savingWorksheet === assessment.id} onClick={() => onToggleWorksheet?.(assessment)}>{savingWorksheet === assessment.id ? 'Saving…' : open ? 'Close student access' : 'Open for students'}</button><a className="student-exams-manage" href={contentEditorQuestionHref('', assessment.id)}>Edit worksheet</a></> : <AppLink className="student-exams-manage" href={'/teacher/assessments?manage=' + encodeURIComponent(assessment.id)} aria-label={'Manage access for ' + assessment.title}>Manage access</AppLink>}</> : open ? <AppLink href={href} aria-label={(reopened ? "Continue " : "Open ") + assessment.title}>{reopened ? "Continue" : "Open"}<ArrowRight size={14} aria-hidden="true" /></AppLink> : <span>Teacher opens</span>}</td>
                  </tr>;
                })}</tbody>
              </table>}
      {!loading && !error && matching.length > 0 && <footer className="student-exams-note"><LockKeyhole size={13} aria-hidden="true" />{teacherView ? worksheetMode ? 'Preview and edit worksheets here, then open student access when ready.' : 'View any test here. Use Manage access to open its sections for students.' : `Locked ${noun}s stay here so you can find them when your teacher opens access.`}</footer>}
    </section>
  </div>;
}

