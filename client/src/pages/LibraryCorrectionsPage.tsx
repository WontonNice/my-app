import { useEffect, useState, type FormEvent } from "react";
import { LibraryCorrectionsWorkspace, type CorrectionDraft } from "./AdvancedPassagePage";
import { getExamLibraryPassage } from "../content/exams/passageLibrary";
import { getAdvancedPracticePassage } from "../content/advancedPractice";
import { getBankSet } from "../content/questionBank";
import { getStudentLibraryCorrections, submitStudentLibraryCorrections, type StudentLibraryCorrectionView } from "../lib/api";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { peekActiveSession } from "../lib/sessionCache";
import { appendStudentPreview } from "../lib/studentPreview";
import { libraryCorrectionLocation } from "../lib/correctionNavigation";
import { navigateTo } from "../lib/navigation";

export function LibraryCorrectionsPage() {
  const { accessToken, previewContext, studentName } = useStudentPortalAccess();
  const { bookId, backPath } = libraryCorrectionLocation(window.location.pathname);
  const passageSet = (backPath.startsWith("/advanced-practice/") ? getAdvancedPracticePassage(bookId) : getExamLibraryPassage(bookId))?.passageSet;
  const [view, setView] = useState<StudentLibraryCorrectionView | null>(null), [draft, setDraft] = useState<CorrectionDraft>({});
  const [error, setError] = useState(""), [loading, setLoading] = useState(true), [saving, setSaving] = useState(false), [reload, setReload] = useState(0);
  const noPreviewStudent = previewContext.isPreview && !previewContext.studentId;
  const readOnly = previewContext.isPreview || view?.readOnly === true;
  const draftKey = (attemptId: string) => `library-corrections:${peekActiveSession()?.user.id}:${bookId}:${attemptId}`;
  useEffect(() => {
    if (!accessToken || !bookId || noPreviewStudent) return;
    let active = true;
    getStudentLibraryCorrections(accessToken, bookId, previewContext.isPreview ? previewContext.studentId : undefined).then(data => {
      if (!active) return;
      const submitted = Object.fromEntries(data.correction?.responses.map(item => [item.questionId, item]) ?? []);
      let local: CorrectionDraft = {};
      if (!previewContext.isPreview && !data.readOnly && !data.correction) try { const saved = JSON.parse(localStorage.getItem(`library-corrections:${peekActiveSession()?.user.id}:${bookId}:${data.attempt.id}`) || "{}"); if (saved && typeof saved === "object" && !Array.isArray(saved)) local = saved; } catch { /* Keep the server copy. */ }
      setView(data); setDraft({ ...submitted, ...local }); setError("");
    }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Corrections could not be opened."); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [accessToken, bookId, previewContext.isPreview, previewContext.studentId, noPreviewStudent, reload]);
  const update = (id: string, field: keyof CorrectionDraft[string], value: string) => {
    if (readOnly || view?.correction) return;
    const next = { ...draft, [id]: { whyChosenIncorrect: draft[id]?.whyChosenIncorrect || "", whyCorrectAnswerCorrect: draft[id]?.whyCorrectAnswerCorrect || "", questionType: draft[id]?.questionType || "", [field]: value } };
    setDraft(next); setError("");
    if (view) try { localStorage.setItem(draftKey(view.attempt.id), JSON.stringify(next)); } catch { /* The form remains editable until submission. */ }
  };
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!view || readOnly || view.correction || saving) return;
    const missing = view.attempt.questions.filter(item => !item.isCorrect).find(item => !draft[item.questionId]?.questionType?.trim() || !draft[item.questionId]?.whyChosenIncorrect.trim() || !draft[item.questionId]?.whyCorrectAnswerCorrect.trim());
    if (missing) { setError(`Complete question ${missing.questionNumber}, including its question type, before submitting all corrections.`); return; }
    setSaving(true); setError("");
    try {
      const responses = view.attempt.questions.filter(item => !item.isCorrect).map(item => ({ questionId: item.questionId, ...draft[item.questionId] }));
      const correction = await submitStudentLibraryCorrections(accessToken, bookId, responses);
      setView(current => current ? { ...current, correction } : current);
      try { localStorage.removeItem(draftKey(view.attempt.id)); } catch { /* The submission is stored on the server. */ }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Corrections could not be saved."); }
    finally { setSaving(false); }
  }
  const back = () => navigateTo(appendStudentPreview(backPath, previewContext));
  if (!passageSet || noPreviewStudent) return <main className="library-corrections-page"><button onClick={back}>Back to passage</button><p role="alert">{noPreviewStudent ? "Select a student to preview their corrections." : "This passage could not be found."}</p></main>;
  return <LibraryCorrectionsWorkspace key={`${bookId}:${view?.attempt.id || "loading"}`} passageSet={passageSet} view={view} correctionDraft={draft} correctionError={error} isLoading={loading} isSubmitting={saving} studentName={studentName} collectionLabel={getBankSet(bookId) ? "Practice set" : "Passage"} onBack={back} onRetry={() => { setLoading(true); setReload(value => value + 1); }} onDraftChange={update} onSubmit={submit} readOnly={readOnly} />;
}
