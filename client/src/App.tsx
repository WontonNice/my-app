import { lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import { getStudentClasses } from "./lib/api";
import { getUserRole } from "./lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "./lib/supabase";

const AdaptivePracticePage = lazy(() =>
  import("./pages/AdaptivePracticePage").then((module) => ({ default: module.AdaptivePracticePage })),
);
const AdminDashboardPage = lazy(() =>
  import("./pages/AdminDashboardPage").then((module) => ({ default: module.AdminDashboardPage })),
);
const AdvancedPassagePage = lazy(() =>
  import("./pages/AdvancedPassagePage").then((module) => ({ default: module.AdvancedPassagePage })),
);
const AuthPage = lazy(() => import("./pages/AuthPage").then((module) => ({ default: module.AuthPage })));
const ExamLaunchPage = lazy(() =>
  import("./pages/ExamLaunchPage").then((module) => ({ default: module.ExamLaunchPage })),
);
const ExamResultsPage = lazy(() =>
  import("./pages/ExamResultsPage").then((module) => ({ default: module.ExamResultsPage })),
);
const ExamSessionPage = lazy(() =>
  import("./pages/ExamSessionPage").then((module) => ({ default: module.ExamSessionPage })),
);
const StudentDashboardPage = lazy(() =>
  import("./pages/StudentDashboardPage").then((module) => ({ default: module.StudentDashboardPage })),
);
const StaffDashboardPage = lazy(() =>
  import("./pages/StaffDashboardPage").then((module) => ({ default: module.StaffDashboardPage })),
);
const StudyHallPage = lazy(() =>
  import("./pages/StudyHallPage").then((module) => ({ default: module.StudyHallPage })),
);
const TeacherDashboardPage = lazy(() =>
  import("./pages/TeacherDashboardPage").then((module) => ({ default: module.TeacherDashboardPage })),
);
const TopicPracticePage = lazy(() =>
  import("./pages/TopicPracticePage").then((module) => ({ default: module.TopicPracticePage })),
);

function ClassAccessGate({ children }: { children: ReactNode }) {
  const [isChecking, setIsChecking] = useState(isSupabaseConfigured);
  const isTeacherPreview = new URLSearchParams(window.location.search).get("preview") === "student";

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    getSupabaseClient().auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }
      if (getUserRole(data.session.user) !== "student" || isTeacherPreview) {
        setIsChecking(false);
        return;
      }
      try {
        const classes = await getStudentClasses(data.session.access_token);
        if (!classes.some((studentClass) => studentClass.id === "shsat")) {
          window.location.assign("/dashboard");
          return;
        }
        setIsChecking(false);
      } catch {
        window.location.assign("/dashboard");
      }
    });
  }, [isTeacherPreview]);

  return isChecking ? <main className="loading-shell">Checking class access...</main> : children;
}

function withClassAccess(page: ReactNode) {
  return <ClassAccessGate>{page}</ClassAccessGate>;
}

function CurrentPage() {
  const path = window.location.pathname;

  if (path === "/dashboard") {
    return <StudyHallPage />;
  }

  if (path === "/study-hall") {
    return withClassAccess(<AdaptivePracticePage />);
  }

  if (path.startsWith("/study-hall/")) {
    return withClassAccess(<StudentDashboardPage />);
  }

  if (path.startsWith("/advanced-practice/")) {
    return withClassAccess(<AdvancedPassagePage />);
  }

  if (path.startsWith("/practice/")) {
    return withClassAccess(<TopicPracticePage />);
  }

  if (path.startsWith("/exam/") && path.endsWith("/session")) {
    return withClassAccess(<ExamSessionPage />);
  }

  if (path.startsWith("/results/")) {
    return withClassAccess(<ExamResultsPage />);
  }

  if (path.startsWith("/exam/")) {
    return withClassAccess(<ExamLaunchPage />);
  }

  if (path === "/teacher") {
    return <TeacherDashboardPage />;
  }

  if (path === "/admin") {
    return <AdminDashboardPage />;
  }

  if (path === "/staff") {
    return <StaffDashboardPage />;
  }

  if (path === "/login") {
    return <AuthPage mode="login" />;
  }

  if (path === "/signup") {
    return <AuthPage mode="signup" />;
  }

  return <AuthPage mode="login" />;
}

function App() {
  return (
    <Suspense fallback={<main className="loading-shell">Loading...</main>}>
      <CurrentPage />
    </Suspense>
  );
}

export default App;
