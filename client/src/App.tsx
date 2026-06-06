import { useEffect, useMemo, useState } from "react";
import HomePage from "./components/HomePage";
import PrecalcHomePage from "./components/Courses/PreCalc/PrecalcHomePage";
import PrecalcLessonPage from "./components/Courses/PreCalc/PrecalcLessonPage";
import type { PrecalcLessonSummary } from "./components/Courses/PreCalc/precalcLessons";
import { PRECALC_LESSONS_BY_ID } from "./components/Courses/PreCalc/precalcLessons";
import PrecalcReviewPage from "./components/Courses/PreCalc/PrecalcReviewPage";
import EvaluatingTrigFunctionsPage from "./components/Courses/PreCalc/EvaluatingTrigFunctionsPage";
import InverseTrigFunctionsPage from "./components/Courses/PreCalc/InverseTrigFunctionsPage";
import StudentDashboard from "./components/StudentDashboard";
import TeacherDashboard from "./components/TeacherDashboard";

import { getStoredAuthUser, setStoredAuthUser } from "./authStorage";
import type { AuthUser } from "./authStorage";

type StudentView =
  | "dashboard"
  | "precalc"
  | "precalc-lesson"
  | "precalc-review"
  | "precalc-evaluating-trig-functions"
  | "precalc-inverse-trig-functions";

type StoredStudentNavigation = {
  studentView: StudentView;
  selectedPrecalcLessonId: string | null;
};

function normalizeCourseName(course: string) {
  return course.trim().toLowerCase();
}

function toStoredStudentNavigation(value: unknown): StoredStudentNavigation | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as {
    studentView?: unknown;
    selectedPrecalcLessonId?: unknown;
  };

  const studentView: StudentView =
    candidate.studentView === "precalc" ||
      candidate.studentView === "precalc-lesson" ||
      candidate.studentView === "precalc-review" ||
      candidate.studentView === "precalc-evaluating-trig-functions" ||
      candidate.studentView === "precalc-inverse-trig-functions"
      ? candidate.studentView
      : "dashboard";

  const selectedPrecalcLessonId =
    typeof candidate.selectedPrecalcLessonId === "string" ? candidate.selectedPrecalcLessonId : null;

  return { studentView, selectedPrecalcLessonId };
}

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(getStoredAuthUser);
  const [studentView, setStudentView] = useState<StudentView>("dashboard");
  const [selectedPrecalcLesson, setSelectedPrecalcLesson] = useState<PrecalcLessonSummary | null>(null);
  const [hasHydratedStudentNavigation, setHasHydratedStudentNavigation] = useState(false);

  const studentNavigationStorageKey = useMemo(
    () => (authUser ? `student-navigation:${authUser.username}` : null),
    [authUser],
  );

  useEffect(() => {
    setStoredAuthUser(authUser);
  }, [authUser]);

  useEffect(() => {
    if (!authUser || authUser.role !== "student" || !studentNavigationStorageKey) {
      setHasHydratedStudentNavigation(false);
      return;
    }

    const rawNavigation = window.localStorage.getItem(studentNavigationStorageKey);
    if (!rawNavigation) {
      setHasHydratedStudentNavigation(true);
      return;
    }

    try {
      const parsedNavigation = toStoredStudentNavigation(JSON.parse(rawNavigation));
      if (!parsedNavigation) {
        setHasHydratedStudentNavigation(true);
        return;
      }

      const lesson = parsedNavigation.selectedPrecalcLessonId
        ? PRECALC_LESSONS_BY_ID.get(parsedNavigation.selectedPrecalcLessonId) || null
        : null;

      const hydratedView =
        (parsedNavigation.studentView === "precalc-lesson" || parsedNavigation.studentView === "precalc-review") && !lesson
          ? "precalc"
          : parsedNavigation.studentView;

      setSelectedPrecalcLesson(lesson);
      setStudentView(hydratedView);
    } catch {
      // Ignore corrupted navigation state.
    } finally {
      setHasHydratedStudentNavigation(true);
    }
  }, [authUser, studentNavigationStorageKey]);

  useEffect(() => {
    if (!authUser || authUser.role !== "student" || !studentNavigationStorageKey || !hasHydratedStudentNavigation) return;

    const navigationToStore: StoredStudentNavigation = {
      studentView,
      selectedPrecalcLessonId: selectedPrecalcLesson?.id || null,
    };

    window.localStorage.setItem(studentNavigationStorageKey, JSON.stringify(navigationToStore));
  }, [authUser, hasHydratedStudentNavigation, selectedPrecalcLesson?.id, studentNavigationStorageKey, studentView]);

  const handleLogout = () => {
    if (studentNavigationStorageKey) {
      window.localStorage.removeItem(studentNavigationStorageKey);
    }
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

  const openPrecalcReview = (lesson: PrecalcLessonSummary) => {
    setSelectedPrecalcLesson(lesson);
    setStudentView("precalc-review");
  };

  const openEvaluatingTrigFunctions = () => {
    setSelectedPrecalcLesson(null);
    setStudentView("precalc-evaluating-trig-functions");
  };

  const openInverseTrigFunctions = () => {
    setSelectedPrecalcLesson(null);
    setStudentView("precalc-inverse-trig-functions");
  };

  if (authUser?.role === "student") {
    if (studentView === "precalc") {
      return (
        <PrecalcHomePage
          authUser={authUser}
          onLearn={openPrecalcLesson}
          onBack={() => setStudentView("dashboard")}
          onLogout={handleLogout}
          onReview={openPrecalcReview}
          onOpenEvaluatingTrigFunctions={openEvaluatingTrigFunctions}
          onOpenInverseTrigFunctions={openInverseTrigFunctions}
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
            onReview={openPrecalcReview}
            onOpenEvaluatingTrigFunctions={openEvaluatingTrigFunctions}
            onOpenInverseTrigFunctions={openInverseTrigFunctions}
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

    if (studentView === "precalc-review") {
      if (!selectedPrecalcLesson) {
        return (
          <PrecalcHomePage
            authUser={authUser}
            onLearn={openPrecalcLesson}
            onReview={openPrecalcReview}
            onBack={() => setStudentView("dashboard")}
            onLogout={handleLogout}
            onOpenEvaluatingTrigFunctions={openEvaluatingTrigFunctions}
            onOpenInverseTrigFunctions={openInverseTrigFunctions}
          />
        );
      }

      return (
        <PrecalcReviewPage
          authUser={authUser}
          lesson={selectedPrecalcLesson}
          onBack={() => setStudentView("precalc")}
          onLogout={handleLogout}
        />
      );
    }

    if (studentView === "precalc-evaluating-trig-functions") {
      return (
        <EvaluatingTrigFunctionsPage
          authUser={authUser}
          onBack={() => setStudentView("precalc")}
          onLogout={handleLogout}
        />
      );
    }

    if (studentView === "precalc-inverse-trig-functions") {
      return (
        <InverseTrigFunctionsPage
          authUser={authUser}
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