import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { BookOpen, GraduationCap } from "lucide-react";
import { CorporateDashboardShell } from "../components/CorporateDashboardShell";
import { getStudentClasses, joinStudentClass, type StudentClass } from "../lib/api";
import { getDashboardPath, getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const isStudentPreview = new URLSearchParams(window.location.search).get("preview") === "student";
const previewQuery = isStudentPreview ? "?preview=student&teacherTools=1" : "";

function getClassPath(studentClass: StudentClass) {
  return `/study-hall/${studentClass.id}${previewQuery}`;
}

export function StudyHallPage() {
  const [accessToken, setAccessToken] = useState("");
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [classCode, setClassCode] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("Student");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    let isMounted = true;

    async function loadStudyHall() {
      const supabase = getSupabaseClient();
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      const userRole = getUserRole(data.session.user);
      const metadata = data.session.user.user_metadata as { full_name?: string; name?: string };
      setStudentName(metadata.full_name ?? metadata.name ?? "Student");

      if (userRole !== "student" && !(userRole === "teacher" && isStudentPreview)) {
        window.location.assign(getDashboardPath(userRole));
        return;
      }

      if (userRole === "teacher" && isStudentPreview) {
        setAccessToken(data.session.access_token);
        setClasses([{
          description: "SHSAT prep room for lessons, practice missions, assessments, and progress checks.",
          id: "shsat",
          level: "Entrance exam prep",
          name: "SHSAT",
          schedule: "Study Hall",
        }]);
        setIsCheckingSession(false);
        return;
      }

      await loadStudentClasses(data.session);
    }

    async function loadStudentClasses(session: Session) {
      try {
        const nextClasses = await getStudentClasses(session.access_token);

        if (!isMounted) {
          return;
        }

        setAccessToken(session.access_token);
        setClasses(nextClasses);
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
  }, []);

  async function handleJoinClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsJoining(true);

    try {
      const { classes: nextClasses, joinedClass } = await joinStudentClass(accessToken, classCode);

      setClasses(nextClasses);
      setClassCode("");
      setMessage(`You joined ${joinedClass.name}.`);
      await getSupabaseClient().auth.refreshSession();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not join that class.");
    } finally {
      setIsJoining(false);
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) {
      await getSupabaseClient().auth.signOut();
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

  const navItems = [{ id: "classes", label: "My classes", href: `/dashboard${previewQuery}`, icon: GraduationCap }];

  return (
    <CorporateDashboardShell
      activeId="classes"
      navItems={navItems}
      onSignOut={handleSignOut}
      profileName={studentName}
      profileRole={isStudentPreview ? "Teacher preview" : "Student account"}
      returnHref={isStudentPreview ? "/teacher" : undefined}
      returnLabel="Teacher dashboard"
    >
      <header className="staff-page-heading corporate-page-heading">
        <div><p><BookOpen size={15} /> Student workspace</p><h1>My classes</h1><span>Choose a class to open its assignments, practice, assessments, and progress.</span></div>
      </header>
      {classes.length > 0 ? <ClassList classes={classes} message={message} /> : (
        <JoinClassPanel classCode={classCode} isJoining={isJoining} message={message} onClassCodeChange={setClassCode} onJoinClass={handleJoinClass} />
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
};

function JoinClassPanel({
  classCode,
  isJoining,
  message,
  onClassCodeChange,
  onJoinClass,
}: JoinClassPanelProps) {
  return (
    <section className="staff-panel student-class-panel" aria-labelledby="study-title">
      <div className="student-class-panel-copy">
        <span>Enrollment</span>
        <h2 id="study-title">Join a class</h2>
        <p>
          Enter the classroom code from your tutor. Once you join, Study Hall becomes your
          class hub for assignments, assessments, and prep missions.
        </p>

        <form className="study-code-form" onSubmit={onJoinClass}>
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
              {isJoining ? "Joining" : "Join"}
            </button>
          </div>
          {message && <p className="study-message">{message}</p>}
        </form>
      </div>
    </section>
  );
}

function ClassList({ classes, message }: { classes: StudentClass[]; message: string }) {
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
            <a className="study-class-card" href={getClassPath(studentClass)} key={studentClass.id}>
              <span>{studentClass.schedule}</span>
              <strong>{studentClass.name}</strong>
              <small>{studentClass.level}</small>
            </a>
          ))}
        </div>

        {message && <p className="study-message">{message}</p>}
      </div>
    </section>
  );
}
