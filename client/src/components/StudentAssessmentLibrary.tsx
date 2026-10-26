import { useState } from "react";
import { ArrowRight, CheckCircle2, FileCheck2, LockKeyhole, Search, X } from "lucide-react";
import type { StudentAssessment } from "../lib/api";
import { appendStudentPreview, type StudentPreviewContext } from "../lib/studentPreview";
import { AppLink } from "./AppLink";
import "../styles/student-assessments.css";
import { ExamLibraryFilters } from "./ExamLibraryFilters";
import { compareExamLibrary, emptyExamLibraryFilter, examLibraryMetadata, matchesExamLibrary } from "../lib/examLibrary";

type AccessFilter = "all" | "open" | "locked";
type Sort = "available" | "year" | "form" | "category" | "name";
type Props = {
  assessments: StudentAssessment[]; previewContext: StudentPreviewContext;
  loading?: boolean; error?: boolean; onRetry?: () => void;
};
function durationLabel(minutes: number) {
  const hours = Math.floor(minutes / 60), remainder = minutes % 60;
  return hours ? hours + "h" + (remainder ? " " + remainder + "m" : "") : minutes + "m";
}

export function StudentAssessmentLibrary({ assessments, previewContext, loading = false, error = false, onRetry }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<AccessFilter>("all");
  const [sort, setSort] = useState<Sort>("available");
  const [dimensions, setDimensions] = useState(emptyExamLibraryFilter);
  const openCount = assessments.filter(item => item.status === "open").length;
  const matching = assessments.filter(item => (filter === "all" || item.status === filter) && matchesExamLibrary(item, query, dimensions)).sort((a, b) => {
    if (sort === "available") {
      const availability = Number(b.status === "open") - Number(a.status === "open");
      if (availability) return availability;
    }
    return compareExamLibrary(a, b, sort);
  });
  const tabs: { id: AccessFilter; label: string; count: number }[] = [
    { id: "all", label: "All exams", count: assessments.length },
    { id: "open", label: "Available", count: openCount },
    { id: "locked", label: "Locked", count: assessments.length - openCount },
  ];
  const reset = () => { setQuery(""); setFilter("all"); setDimensions(emptyExamLibraryFilter); };

  return <div className="student-section-page student-exams">
    <header className="student-section-heading"><div><p>Your exam library</p><h1>Assessments</h1><span>Find your exam by name or year. Your teacher controls which sections are open.</span></div>{!loading && !error && <strong>{openCount} available</strong>}</header>
    <section className="student-exams-library" aria-label="Exam library" aria-busy={loading}>
      <div className="student-exams-toolbar">
        <div className="student-exams-search"><Search size={17} aria-hidden="true" /><input type="search" aria-label="Search exams by name or year" placeholder="Search by exam name or year…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear exam search" onClick={() => setQuery("")}><X size={15} /></button>}</div>
        <label className="student-exams-sort">Sort by<select value={sort} onChange={event => setSort(event.target.value as Sort)}><option value="available">Available first</option><option value="year">Test year · newest</option><option value="form">Form A–Z</option><option value="category">Category</option><option value="name">Name A–Z</option></select></label>
      </div>
      <ExamLibraryFilters exams={assessments} value={dimensions} onChange={setDimensions} />
      <div className="student-exams-filterbar"><nav aria-label="Filter exams by availability">{tabs.map(tab => <button type="button" key={tab.id} aria-pressed={filter === tab.id} onClick={() => setFilter(tab.id)}>{tab.label}<span>{loading || error ? "—" : tab.count}</span></button>)}</nav><span className="student-exams-count" role="status">{!loading && !error && (matching.length + " of " + assessments.length + " exams")}</span></div>
      {loading ? <div className="student-exams-empty" role="status"><FileCheck2 size={25} /><h2>Loading your exams…</h2></div>
        : error ? <div className="student-exams-empty" role="alert"><h2>Exams couldn't be loaded</h2><p>Try again to check which exams are available.</p><button type="button" onClick={onRetry}>Try again</button></div>
          : !assessments.length ? <div className="student-exams-empty"><FileCheck2 size={25} /><h2>No exams yet</h2><p>Your teacher's exams will appear here when they are ready.</p></div>
            : !matching.length ? <div className="student-exams-empty"><Search size={25} /><h2>{!query.trim() && filter === "open" && openCount === 0 ? "No exams are open right now" : "No matching exams"}</h2><p>{!query.trim() && filter === "open" && openCount === 0 ? "Your teacher will open an exam when it's time to begin." : "Try a different exam name, year, or availability filter."}</p><button type="button" onClick={reset}>{!query.trim() && filter === "open" && openCount === 0 ? "View all exams" : "Clear filters"}</button></div>
              : <table className="student-exams-table">
                <caption className="sr-only">Exams with section access, question counts, time limits and availability</caption>
                <thead><tr><th scope="col">Exam name / category</th><th scope="col">Year / form</th><th scope="col">Sections</th><th scope="col">Questions</th><th scope="col">Time</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Open exam</span></th></tr></thead>
                <tbody>{matching.map(assessment => {
                  const open = assessment.status === "open", reopened = open && assessment.reentry;
                  const href = appendStudentPreview("/exam/" + assessment.id, previewContext);
                  const metadata = examLibraryMetadata(assessment);
                  return <tr key={assessment.id} className={open ? "is-available" : "is-locked"}>
                    <th scope="row" className="student-exams-name">{open ? <AppLink href={href}>{assessment.title}</AppLink> : <span>{assessment.title}</span>}<small>{metadata.category}</small>{reopened && <small className="is-reopened">Reopened · Continue with your saved answers</small>}</th>
                    <td className="student-exams-year">{metadata.year || "—"}<small>{metadata.form ? "Form " + metadata.form : "No form"}</small></td>
                    <td className="student-exams-sections"><div>{(["english", "math"] as const).map(section => {
                      const available = open && assessment.sectionAccess[section], name = section === "english" ? "English" : "Math";
                      return <span key={section} className={available ? "is-open" : ""} title={name + (available ? " is open" : " is locked")}><span className="sr-only">{available ? "Open section: " : "Locked section: "}</span>{!available && <LockKeyhole size={11} aria-hidden="true" />}{name}</span>;
                    })}</div></td>
                    <td className="student-exams-questions"><strong>{assessment.questionCount}<span className="student-exams-mobile-label"> questions</span></strong><small>{assessment.passageCount} {assessment.passageCount === 1 ? "passage" : "passages"}</small></td>
                    <td className="student-exams-duration"><span title={assessment.durationMinutes + " minutes"}>{durationLabel(assessment.durationMinutes)}</span></td>
                    <td className="student-exams-status"><span className={open ? "is-open" : ""}>{open ? <CheckCircle2 size={13} aria-hidden="true" /> : <LockKeyhole size={13} aria-hidden="true" />}{reopened ? "Reopened" : open ? "Available" : "Locked"}</span></td>
                    <td className="student-exams-action">{open ? <AppLink href={href} aria-label={(reopened ? "Continue " : "Open ") + assessment.title}>{reopened ? "Continue" : "Open"}<ArrowRight size={14} aria-hidden="true" /></AppLink> : <span>Teacher opens</span>}</td>
                  </tr>;
                })}</tbody>
              </table>}
      {!loading && !error && matching.length > 0 && <footer className="student-exams-note"><LockKeyhole size={13} aria-hidden="true" />Locked exams stay here so you can find them when your teacher opens access.</footer>}
    </section>
  </div>;
}

