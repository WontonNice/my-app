// Fictional local presentation fixtures; no production credentials or data.
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import { StudentDashboardPage } from '../client/src/pages/StudentDashboardPage';
import { ClassroomMealsPage } from '../client/src/pages/ClassroomMealsPage';
import { TeacherMealsPage } from '../client/src/pages/TeacherMealsPage';
import { StudentResultsPage } from '../client/src/pages/StudentResultsPage';
import { AuthPage } from '../client/src/pages/AuthPage';
import '../client/src/styles/global.css';
function Preview() {
  const [path, setPath] = useState(location.pathname);
  useEffect(() => { const update = () => setPath(location.pathname); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  return path === '/teacher/meals' ? <TeacherMealsPage /> : path.endsWith('/meals') ? <ClassroomMealsPage /> : path.endsWith('/results') ? <StudentResultsPage /> : path === '/login' ? <AuthPage /> : <StudentDashboardPage />;
}
createRoot(document.getElementById('root')!).render(<Preview />);
