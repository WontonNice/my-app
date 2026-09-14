// Browser regression fixture. The production exam page, API client, content,
// response state, navigation, persistence, and grading all run unchanged.
import { createRoot } from 'react-dom/client';
import { ExamSessionPage } from '../client/src/pages/ExamSessionPage';
import '../client/src/styles/global.css';
const subject = new URLSearchParams(location.search).get('subject');
if (subject) sessionStorage.setItem(`exam-start-subject:${location.pathname.split('/')[2]}`, subject);
createRoot(document.getElementById('root')!).render(<ExamSessionPage />);
