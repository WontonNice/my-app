import { PassageLastAttempt } from '../client/src/components/PassageLastAttempt';
import { LibraryBookSettings } from '../client/src/components/LibraryBookSettings';
// Isolated QA with real authored questions and fictional accounts/results.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TeacherQuestionReview } from '../client/src/components/TeacherQuestionReview';
import { examLibraryBooks } from '../client/src/content/exams/passageLibrary';
import { CategoryPracticePicker } from '../client/src/features/math-command/CategoryPracticePicker';
import { QuestionGenerators } from '../client/src/features/math-command/QuestionGenerators';
import { PracticeStudioWorkspace } from '../client/src/pages/PracticeStudioPage';
import { ExamCorrectionsPage } from '../client/src/pages/ExamCorrectionsPage';
import { usePracticeCatalog } from '../client/src/features/math-command/usePracticeCatalog';
import type { ExamQuestion } from '../client/src/content/exams/types';
declare const __QA_TEI__: ExamQuestion[];
import '../client/src/styles/global.css';
import '../client/src/styles/learning-plan.css';
import '../client/src/features/math-command/math-player.css';

const request = async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch('/api/infinite-practice' + path, {...options, headers:{'Content-Type':'application/json'}});
  return response.json();
};
function Preview() {
  const [answers,setAnswers]=useState(true), [generator,setGenerator]=useState('');
  const {catalog,taxonomy}=usePracticeCatalog();
  const sourceId = catalog?.generators.find(item=>item.sourceQuestionIds?.length)?.sourceQuestionIds?.[0] ?? '';
  const book=examLibraryBooks.find(book=>/invention of the telegraph/i.test(book.passageSet.passage.title))!;
  if(location.pathname.includes('/corrections/'))return <ExamCorrectionsPage />;
  return <main style={{maxWidth:1200,margin:'24px auto',padding:20}}><h1>Learning management preview</h1><p>Fictional accounts and worksheet results. No production writes.</p><nav style={{display:'flex',gap:20,marginBottom:24}}><a href="/">Question comparison</a><a href="/practice">Mixed practice</a><a href="/generators">Question generators</a><a href="/study-hall/shsat/corrections/qa-worksheet">Worksheet corrections</a></nav>
    {location.pathname==='/access' ? <section aria-label="Access and results"><h2>Grant access · fictional students</h2><p>QA Student<PassageLastAttempt attempts={[{completedAt:'2026-10-01T12:00:00Z'}]} lastTaken={{completedAt:'2026-11-09T15:30:00Z',source:'exam',title:'2026 Form C'}}/><button>Grant access</button></p><p>New student<PassageLastAttempt attempts={[]}/><button>Grant access</button></p></section> : location.pathname==='/tei' ? <TeacherQuestionReview questions={__QA_TEI__} showAnswers/> : location.pathname==='/practice' ? catalog && <CategoryPracticePicker catalog={catalog} taxonomy={taxonomy??[]} /> : location.pathname==='/generators' ? catalog && <><QuestionGenerators questionId={sourceId} request={request} onOpen={setGenerator}/>{generator&&<PracticeStudioWorkspace key={generator} initialGeneratorId={generator} practiceRequest={request}/>}</> : <><h2>{book.passageSet.passage.title}</h2><label><input type="checkbox" checked={answers} onChange={event=>setAnswers(event.target.checked)}/> Show answers</label><LibraryBookSettings bookId={book.id} accessToken="qa" showAnswers={answers}/></>}
  </main>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
