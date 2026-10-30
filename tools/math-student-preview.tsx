import { useEffect, useRef, useState, type ComponentProps } from 'react';
import { createRoot } from 'react-dom/client';
import { ExamToolbar } from '../client/src/pages/ExamSessionPage';
import { ExamMathQuestion } from '../client/src/components/ExamMathQuestion';
import type { ExamQuestion } from '../server/src/shared/examTypes';
import type { SelectedAnswer } from '../server/src/shared/examGrading';
import '../client/src/styles/global.css';

type Preview = { question: ExamQuestion; index: number; count: number; title: string };
const editorOrigin = new URL(document.baseURI).origin;
function StudentPreview() {
  const [preview, setPreview] = useState<Preview>();
  const [answer, setAnswer] = useState<SelectedAnswer>('');
  const [tool, setTool] = useState<'pointer' | 'eliminator' | 'notepad' | 'pencil'>('pointer');
  const [eliminated, setEliminated] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const [timer, setTimer] = useState(false);
  const questionKey = useRef('');
  const [drawings, setDrawings] = useState<NonNullable<ComponentProps<typeof ExamToolbar>['pencilStorage']>['drawings']>({});
  const [redoStacks, setRedoStacks] = useState<typeof drawings>({});
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== editorOrigin || event.source !== parent || event.data?.type !== 'studio:math-preview') return;
      const next = event.data.preview as Preview;
      if (!next?.question || typeof next.question.id !== 'string') return;
      const key = next.question.id + ':' + next.question.type;
      if (questionKey.current !== key) { setAnswer(''); setEliminated([]); setTool('pointer'); questionKey.current = key; }
      setPreview(next);
    };
    window.addEventListener('message', receive);
    parent.postMessage({ type: 'studio:math-preview-ready' }, editorOrigin);
    return () => window.removeEventListener('message', receive);
  }, []);
  if (!preview) return <p role="status">Loading student player…</p>;
  return <main className="exam-session-shell is-math-session" data-player-profile={preview.question.source?.playerProfile || 'testnav'}>
    <ExamToolbar assessmentLabel={preview.title} breadcrumbMiddle="MATH" breadcrumbCurrent={`${preview.index + 1} OF ${preview.count}`} studentName="Preview"
      showReviewTools={false} showExhibits activeTool={tool} canEliminate={['multiple_choice','multi_select','graph_point_select'].includes(preview.question.type)} isPreviousActive={preview.index > 0} isNextActive={preview.index + 1 < preview.count}
      onPrevious={() => parent.postMessage({ type: 'studio:math-preview-navigate', delta: -1 }, editorOrigin)}
      onNext={() => parent.postMessage({ type: 'studio:math-preview-navigate', delta: 1 }, editorOrigin)}
      onSelectTool={next => setTool(current => current === next ? 'pointer' : next)} isNotepadOpen={tool === 'notepad'}
      isTimerVisible={timer} onToggleTimer={() => setTimer(value => !value)} isUserMenuOpen={userMenu} onToggleUserMenu={() => setUserMenu(value => !value)} pencilKey={preview.question.id}
      pencilStorage={{drawings, setDrawings, redoStacks, setRedoStacks}} />
    <ExamMathQuestion key={preview.question.id + preview.question.type} question={preview.question} answer={answer} onChange={value => { setAnswer(value); const selected = Array.isArray(value) ? value : typeof value === 'string' ? [value] : []; setEliminated(current => current.filter(id => !selected.includes(id))); }} eliminatedIds={eliminated}
      onEliminatePoint={tool === 'eliminator' ? id => setEliminated(current => current.includes(id) ? current.filter(item => item !== id) : [...current,id]) : undefined}
      onChoiceLabelClick={(event,id) => { if (tool !== 'eliminator') return; event.preventDefault(); setEliminated(current => current.includes(id) ? current.filter(item => item !== id) : [...current,id]); }} />
    {tool === 'notepad' && <section className="exam-notepad-window" aria-label="Notepad"><header><h2>Notepad</h2><button aria-label="Close notepad" onClick={() => setTool('pointer')}>×</button></header><textarea aria-label="Notes" value={note} onChange={event => setNote(event.target.value)} /></section>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<StudentPreview />);
