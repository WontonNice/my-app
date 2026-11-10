import { keepBookQuestion } from '../lib/bookReview';
import { useEffect, useMemo, useState } from 'react';
import { getExamLibraryPassage } from '../content/exams/passageLibrary';
import { getLibraryBookSettings, saveLibraryBookSettings } from '../lib/api';
import { contentEditorPassageHref } from '../lib/contentEditorLink';
import { libraryBookFingerprint, libraryBookNeedsReview, type LibraryBookSettings as Settings } from '../../../server/src/shared/libraryBooks';
import { TeacherQuestionReview } from './TeacherQuestionReview';
import '../styles/library-book-settings.css';

export function LibraryBookSettings({ bookId, accessToken, showAnswers = true }: { bookId: string; accessToken: string; showAnswers?: boolean }) {
  const book = useMemo(() => getExamLibraryPassage(bookId), [bookId]);
  const [settings, setSettings] = useState<Settings>();
  const [selected, setSelected] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  const [version, setVersion] = useState('');

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
  }, [accessToken, bookId, book, retry]);
  if (!book || bookId.startsWith('lab-set-')) return null;
  const coverPassage = Object.values(book.questionPassages).find(p => p.coverImage) ?? Object.values(book.questionPassages)[0] ?? book.passageSet.passage;
  const questions = book.passageSet.questions.filter(q => !version || book.versions.find(v => v.id === version)?.questionIds?.includes(q.id));
  const savedIds = settings ? settings.questionIds.filter(id=>book.passageSet.questions.some(q=>q.id===id)) : book.passageSet.questions.map(q=>q.id);
  const dirty = selected.length !== savedIds.length || selected.some(id=>!savedIds.includes(id));
  async function save() {
    if (!book || saving || !selected.length) return;
    setSaving(true); setMessage(''); setFailed(false);
    try {
      const result = await saveLibraryBookSettings(accessToken, bookId, { fingerprint: libraryBookFingerprint(book), questionIds: selected });
      setSettings(result.settings); setMessage('Book questions saved.');
    } catch (reason) { setFailed(true); setMessage(reason instanceof Error ? reason.message : 'Settings could not be saved.'); }
    finally { setSaving(false); }
  }
  return <section id="book-settings" className="library-book-settings" aria-labelledby="book-settings-title">
    <header><div><h2 id="book-settings-title">Book settings</h2><p>{book.passageSet.passage.title}</p></div><a href="/teacher/study-hall?entry=reading&section=library">Back to library</a></header>
    {!loaded && <p role={failed ? 'alert' : 'status'}>{message || 'Loading settings…'}</p>}
    {!loaded && failed && <button type="button" onClick={() => setRetry(value => value + 1)}>Retry loading settings</button>}
    {loaded && <>
      <div className="library-book-options-row"><span className={libraryBookNeedsReview(book, settings) ? 'library-review-badge' : ''}>{libraryBookNeedsReview(book, settings) ? 'Versions need review' : settings ? 'Questions reviewed' : 'Single version'}</span><details className="library-book-options"><summary>Book options</summary><div className="library-book-settings-toolbar"><a href={`/study-hall/shsat/library/${encodeURIComponent(bookId)}?preview=teacher&teacherTools=1`}>Preview in exam player</a><a href={contentEditorPassageHref(coverPassage.id, true)} target="_blank" rel="noreferrer">Edit book cover ↗</a><label>Filter all-questions list <select value={version} onChange={event => setVersion(event.target.value)}><option value="">All versions</option>{book.versions.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}</select></label><button type="button" disabled={saving} onClick={() => setSelected(book.passageSet.questions.map(q => q.id))}>Enable all questions</button></div><p>Each question keeps its original passage. Book settings do not change exam questions or previous scores.</p></details></div>
      <div className="library-book-savebar" role="region" aria-label="Save book question selection"><strong aria-live="polite">{selected.length} enabled · {book.passageSet.questions.length-selected.length} disabled{dirty ? ' · Unsaved changes' : ''}</strong><button type="button" disabled={saving || !selected.length} onClick={() => void save()}>{saving ? 'Saving…' : 'Save book questions'}</button><button type="button" disabled={saving || !dirty} onClick={()=>{setSelected(savedIds);setMessage('Changes discarded.');setFailed(false);}}>Undo changes</button>{!selected.length && <span role="alert">Keep at least one question enabled.</span>}{message && <span role={failed ? 'alert' : 'status'}>{message}</span>}</div>
      <TeacherQuestionReview questions={book.passageSet.questions} passages={book.questionPassages} showAnswers={showAnswers} visibleQuestionIds={questions.map(q=>q.id)} selection={{ids:selected,disabled:saving,onKeepOnly:(group,keep)=>{setSelected(current=>keepBookQuestion(current,group,keep));setMessage('');setFailed(false);},onToggle:(id,enabled)=>{setSelected(current=>enabled ? [...new Set([...current,id])] : current.filter(value=>value!==id));setMessage('');setFailed(false);}}} />
    </>}
  </section>;
}
