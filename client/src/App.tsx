import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import PrecalcHomePage from "./components/Courses/PreCalc/PrecalcHomePage";
import PrecalcLessonPage from "./components/Courses/PreCalc/PrecalcLessonPage";
import type { PrecalcLessonSummary } from "./components/Courses/PreCalc/precalcLessons";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

import { getStoredAuthUser, setStoredAuthUser } from "./authStorage";
import type { AuthUser } from "./authStorage";

type StudentView = "dashboard" | "precalc" | "precalc-lesson";

function normalizeCourseName(course: string) {
  return course.trim().toLowerCase();
}

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuthUser);
  const [studentView, setStudentView] = useState<StudentView>("dashboard");
  const [selectedPrecalcLesson, setSelectedPrecalcLesson] = useState<PrecalcLessonSummary | null>(null);

  useEffect(() => {
    setStoredAuthUser(authUser);
  }, [authUser]);

  const handleLogout = () => {
    setStudentView("dashboard");
    setSelectedPrecalcLesson(null);
    setAuthUser(null);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setStudentView("dashboard");
    setSelectedPrecalcLesson(null);
    setAuthUser(user);
  };

  const openPrecalcLesson = (lesson: PrecalcLessonSummary) => {
    setSelectedPrecalcLesson(lesson);
    setStudentView("precalc-lesson");
  };

  if (authUser?.role === "student") {
    if (studentView === "precalc") {
      return (
        <PrecalcHomePage
          authUser={authUser}
          onLearn={openPrecalcLesson}
          onBack={() => setStudentView("dashboard")}
          onLogout={handleLogout}
        />
      );
    }

    if (studentView === "precalc-lesson") {
      if (!selectedPrecalcLesson) {
        return (
          <PrecalcHomePage
            authUser={authUser}
            onLearn={openPrecalcLesson}
            onBack={() => setStudentView("dashboard")}
            onLogout={handleLogout}
          />
        );
      }

      return (
        <PrecalcLessonPage
          authUser={authUser}
          lesson={selectedPrecalcLesson}
          onBack={() => setStudentView("precalc")}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <StudentDashboard
        authUser={authUser}
        onOpenCoursePage={(course) => {
          const normalizedCourse = normalizeCourseName(course);
          if (
            normalizedCourse === "precalc" ||
            normalizedCourse === "precalculus" ||
            normalizedCourse === "a"
          ) {
            setStudentView("precalc");
          }
        }}
        onLogout={handleLogout}
      />
    );
  }

  if (authUser?.role === "teacher") {
    return <TeacherDashboard authUser={authUser} onLogout={handleLogout} />;
  }

  return <HomePage onLoginSuccess={handleLoginSuccess} />;
}

export default App;