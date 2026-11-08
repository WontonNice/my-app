import { useEffect, useState } from 'react';
import { getExamLibraryPassage } from '../content/exams/passageLibrary';
import { getLibraryBookSettings, saveLibraryBookSettings } from '../lib/api';
import { contentEditorPassageHref } from '../lib/contentEditorLink';
import { libraryBookFingerprint, libraryBookNeedsReview, type LibraryBookSettings as Settings } from '../../../server/src/shared/libraryBooks';
import { ExamText, ExamReviewPassage } from './ExamReviewQuestion';
import { ExamResponse } from './ExamResponse';
import type { SelectedAnswers } from '../lib/examResults';
import '../styles/library-book-settings.css';

export function LibraryBookSettings({ bookId, accessToken }: { bookId: string; accessToken: string }) {
  const book = getExamLibraryPassage(bookId);
  const [settings, setSettings] = useState<Settings>();
  const [selected, setSelected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [version, setVersion] = useState('');
  const [answers, setAnswers] = useState<SelectedAnswers>({});
  useEffect(() => {
    if (!accessToken || !book) return;
    let current = true;
    getLibraryBookSettings(accessToken).then(result => {
      if (!current) return;
      const saved = result.settings[bookId];
      setSettings(saved); setSelected(saved ? saved.questionIds.filter(id => book.passageSet.questions.some(q => q.id === id)) : book.passageSet.questions.map(q => q.id));
      setLoaded(true); setMessage(''); setFailed(false);
      if (window.location.hash === '#book-settings') requestAnimationFrame(() => document.getElementById('book-settings')?.scrollIntoView());
    }).catch(reason => { if (current) { setMessage(reason instanceof Error ? reason.message : 'Settings could not be loaded.'); setFailed(true); } });
    return () => { current = false; };
    // The source catalog is immutable for this loaded app; avoid rebuilding on each render.
  }, [accessToken, bookId, retry]);
  if (!book || bookId.startsWith('lab-set-')) return null;
  const coverPassage = Object.values(book.questionPassages).find(p => p.coverImage) ?? Object.values(book.questionPassages)[0] ?? book.passageSet.passage;
  const questions = book.passageSet.questions.filter(q => !version || book.versions.find(v => v.id === version)?.questionIds?.includes(q.id));
  async function save() {
    if (!book || saving || !selected.length) return;
    setSaving(true); setMessage(''); setFailed(false);
    try {
      const result = await saveLibraryBookSettings(accessToken, bookId, { fingerprint: libraryBookFingerprint(book), questionIds: selected });
      setSettings(result.settings); setMessage('Book questions saved and reviewed. Assessment questions and previous scores are unchanged.');
    } catch (reason) { setFailed(true); setMessage(reason instanceof Error ? reason.message : 'Settings could not be saved.'); }
    finally { setSaving(false); }
  }
  return <section id="book-settings" className="library-book-settings" aria-labelledby="book-settings-title">
    <header><div><h2 id="book-settings-title">Book settings</h2><p>{book.passageSet.passage.title}</p></div><a href="/teacher/study-hall?entry=reading&section=library">Back to library</a></header>
    <div className="library-book-settings-toolbar"><span className={loaded && libraryBookNeedsReview(book, settings) ? 'library-review-badge' : ''}>{!loaded ? 'Loading settings…' : libraryBookNeedsReview(book, settings) ? 'Versions need review' : settings ? 'Questions reviewed' : 'Single version'}</span><a href={`/study-hall/shsat/library/${encodeURIComponent(bookId)}?preview=teacher&teacherTools=1`}>Preview in exam player</a><a href={contentEditorPassageHref(coverPassage.id, true)} target="_blank" rel="noreferrer">Edit uploaded book cover ↗</a></div>
    <p>Choose the questions students see in this book. Matching questions are combined automatically; review the remaining versions for repeats. Each question keeps its original passage. Your exams retain every original question.</p>
    <p className="library-settings-note">The cover uses your uploaded book cover. Without one, the library shows a default title cover.</p>
    {message && <p role={failed ? 'alert' : 'status'}>{message}</p>}
    {!loaded && failed && <button type="button" onClick={() => setRetry(value => value + 1)}>Retry loading settings</button>}
    {loaded && <>
      <div className="library-book-settings-toolbar"><label>Show version <select value={version} onChange={event => setVersion(event.target.value)}><option value="">All versions</option>{book.versions.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}</select></label><span>{selected.length} of {book.passageSet.questions.length} selected</span><button type="button" onClick={() => setSelected(book.passageSet.questions.map(q => q.id))}>Select all</button></div>
      <ol className="library-question-selection">{questions.map(question => <li key={question.id}><label><input type="checkbox" checked={selected.includes(question.id)} onChange={event => setSelected(current => event.target.checked ? [...current, question.id] : current.filter(id => id !== question.id))} /><span><strong>Question {book.passageSet.questions.indexOf(question) + 1}</strong><ExamText text={question.prompt} html={question.promptHtml} /><small>{book.versions.filter(v => v.questionIds?.includes(question.id)).map(v => v.label).join(' · ') || book.passageSet.passage.versionLabel}</small></span></label><details><summary>Preview passage and question</summary><div className="library-settings-question-preview"><ExamReviewPassage passage={book.questionPassages[question.id] ?? book.passageSet.passage} /><div><ExamText text={question.instructions} html={question.instructionsHtml} /><ExamText text={question.stimulus} html={question.stimulusHtml} /><ExamResponse question={question} answer={answers[question.id]} onChange={answer => setAnswers(current => ({ ...current, [question.id]: answer }))} /></div></div></details></li>)}</ol>
      <footer><button type="button" disabled={saving || !selected.length} onClick={() => void save()}>{saving ? 'Saving…' : 'Save book questions'}</button><span>{selected.length ? 'Saving marks these versions as reviewed.' : 'Select at least one question.'}</span></footer>
    </>}
  </section>;
}
