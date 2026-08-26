import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { BookOpen, Clock3, GraduationCap } from "lucide-react";
import { AppLink } from "../components/AppLink";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { getStudentClassAccess, joinStudentClass, type StudentClass, type StudentClassJoinRequest } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";
import { cacheStudentClasses, getActiveSession, getCachedStudentClasses, peekActiveSession } from "../lib/sessionCache";
import { getStudentPreviewContext } from "../lib/studentPreview";

export function StudyHallPage() {
  const previewContext = getStudentPreviewContext();
  const initialSession = peekActiveSession();
  const initialMetadata = initialSession?.user.user_metadata as { full_name?: string; name?: string } | undefined;
  const [accessToken, setAccessToken] = useState(initialSession?.access_token ?? "");
  const [classes, setClasses] = useState<StudentClass[]>(() => initialSession ? getCachedStudentClasses(initialSession.user.id) ?? [] : []);
  const [classCode, setClassCode] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured && !initialSession);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [pendingRequests, setPendingRequests] = useState<StudentClassJoinRequest[]>([]);
  const [studentName, setStudentName] = useState(previewContext.studentName || initialMetadata?.full_name || initialMetadata?.name || "Student");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    async function loadStudyHall() {
      const session = await getActiveSession();

      if (!session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(session.user);
      const metadata = session.user.user_metadata as { full_name?: string; name?: string };
      setStudentName(previewContext.studentName || metadata.full_name || metadata.name || "Student");

      if (userRole !== "student" && !(userRole === "teacher" && previewContext.isPreview)) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      if (userRole === "teacher" && previewContext.isPreview) {
        window.location.assign(`/study-hall/shsat${previewContext.query}`);
        return;
      }

      await loadStudentClasses(session);
    }

    async function loadStudentClasses(session: Session) {
      try {
        const { classes: nextClasses, pendingRequests: nextPendingRequests } = await getStudentClassAccess(session.access_token);

        if (!isMounted) {
          return;
        }

        setAccessToken(session.access_token);
        setClasses(nextClasses);
        setPendingRequests(nextPendingRequests);
        cacheStudentClasses(session.user.id, nextClasses);
        if (nextClasses.length === 1) {
          window.location.assign(`/study-hall/${nextClasses[0].id}${previewContext.query}`);
          return;
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setMessage(error instanceof Error ? error.message : "Could not load your classes.");
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    }

    loadStudyHall();

    return () => {
      isMounted = false;
    };
  }, [previewContext.isPreview, previewContext.query, previewContext.studentName]);

  async function handleJoinClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsJoining(true);

    try {
      const result = await joinStudentClass(accessToken, classCode);

      setClasses(result.classes);
      const session = await getActiveSession();
      if (session) cacheStudentClasses(session.user.id, result.classes);
      setClassCode("");
      if (result.status === "pending" && result.request) {
        setPendingRequests((current) => current.some((request) => request.classId === result.request?.classId) ? current : [...current, result.request as StudentClassJoinRequest]);
        setMessage(`Your ${result.request.classroom.name} request was sent to your teacher.`);
      } else if (result.joinedClass) {
        setMessage(`You are already enrolled in ${result.joinedClass.name}.`);
        await getSupabaseClient().auth.refreshSession();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not join that class.");
    } finally {
      setIsJoining(false);
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await signOutCurrentAccount();
    }

    window.location.assign("/");
  }

  if (isCheckingSession) {
    return <main className="loading-shell">Loading study hall...</main>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="loading-shell">
        Supabase auth is not configured. Add your Vite Supabase env vars, then log in.
      </main>
    );
  }

  const navItems = [{ id: "classes", label: "My classes", href: `/dashboard${previewContext.query}`, icon: GraduationCap }];

  return (
    <CorporateDashboardShell
      activeId="classes"
      navItems={navItems}
      onSignOut={handleSignOut}
      profileName={studentName}
      profileRole={previewContext.isPreview ? `Viewing ${studentName}` : "Student account"}
      returnHref={previewContext.isPreview ? previewContext.returnHref : undefined}
      returnLabel="Teacher dashboard"
    >
      <header className="staff-page-heading corporate-page-heading">
        <div><p><BookOpen size={15} /> Student workspace</p><h1>My classes</h1><span>Choose a class to open its assignments, practice, assessments, and progress.</span></div>
      </header>
      {classes.length > 0 ? <ClassList classes={classes} message={message} previewQuery={previewContext.query} /> : (
        <JoinClassPanel classCode={classCode} isJoining={isJoining} message={message} onClassCodeChange={setClassCode} onJoinClass={handleJoinClass} pendingRequest={pendingRequests[0]} />
      )}
    </CorporateDashboardShell>
  );
}

type JoinClassPanelProps = {
  classCode: string;
  isJoining: boolean;
  message: string;
  onClassCodeChange: (value: string) => void;
  onJoinClass: (event: FormEvent<HTMLFormElement>) => void;
  pendingRequest?: StudentClassJoinRequest;
};

function JoinClassPanel({
  classCode,
  isJoining,
  message,
  onClassCodeChange,
  onJoinClass,
  pendingRequest,
}: JoinClassPanelProps) {
  return (
    <section className="staff-panel student-class-panel" aria-labelledby="study-title">
      <div className="student-class-panel-copy">
        <span>Enrollment</span>
        <h2 id="study-title">Join a class</h2>
        <p>{pendingRequest
          ? `Your request to join ${pendingRequest.classroom.name} is waiting for teacher approval. You will see the class here after it is approved.`
          : "Enter the classroom code from your tutor. Your teacher will review the request before the class is added to your account."}</p>

        {pendingRequest ? <div className="study-pending-request" role="status"><Clock3 size={18} /><span><strong>Approval pending</strong><small>Requested {new Date(pendingRequest.requestedAt).toLocaleDateString()}</small></span></div> : <form className="study-code-form" onSubmit={onJoinClass}>
          <label htmlFor="class-code">Classroom code</label>
          <div className="study-code-row">
            <input
              autoComplete="off"
              id="class-code"
              placeholder="Enter your class code"
              required
              type="text"
              value={classCode}
              onChange={(event) => onClassCodeChange(event.target.value)}
            />
            <button disabled={isJoining} type="submit">
              {isJoining ? "Sending request" : "Request access"}
            </button>
          </div>
          {message && <p className="study-message">{message}</p>}
        </form>}
        {pendingRequest && message ? <p className="study-message">{message}</p> : null}
      </div>
    </section>
  );
}

function ClassList({ classes, message, previewQuery }: { classes: StudentClass[]; message: string; previewQuery: string }) {
  return (
    <section className="staff-panel student-class-panel" aria-labelledby="class-list-title">
      <header className="staff-panel-header"><div><p>Current enrollment</p><h2 id="class-list-title">My classes</h2></div><span className="student-class-count">{classes.length} active</span></header>
      <div className="student-class-panel-copy">
        <p>
          You are already enrolled. Pick a room to open its portal, start work, and see
          what is coming next.
        </p>

        <div className="study-class-cards">
          {classes.map((studentClass) => (
            <AppLink className="study-class-card" href={`/study-hall/${studentClass.id}${previewQuery}`} key={studentClass.id}>
              <span>{studentClass.schedule}</span>
              <strong>{studentClass.name}</strong>
              <small>{studentClass.level}</small>
            </AppLink>
          ))}
        </div>

        {message && <p className="study-message">{message}</p>}
      </div>
    </section>
  );
}
