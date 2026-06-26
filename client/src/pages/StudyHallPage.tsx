import { useEffect, useState, type FormEvent } from "react";
import type { Session } from "@supabase/supabase-js";
import { getStudentClasses, joinStudentClass, type StudentClass } from "../lib/api";
import { getUserRole } from "../lib/auth";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

const isStudentPreview = new URLSearchParams(window.location.search).get("preview") === "student";

function getClassPath(studentClass: StudentClass) {
  return `/study-hall/${studentClass.id}`;
}

export function StudyHallPage() {
  const [accessToken, setAccessToken] = useState("");
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [classCode, setClassCode] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");

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

      if (getUserRole(data.session.user) === "teacher" && !isStudentPreview) {
        window.location.assign("/teacher");
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

  return (
    <main className="study-shell">
      <header className="study-header">
        <a className="site-logo study-logo" href="/dashboard">
          Nathan Tutors
        </a>
        <nav className="site-nav" aria-label="Study Hall navigation">
          <a href="/dashboard">Classes</a>
          <a href="/study-hall/shsat">SHSAT</a>
          <a href="/study-hall/shsat">Portal</a>
        </nav>
        {isStudentPreview ? (
          <a className="dashboard-signout study-signout" href="/teacher">
            Teacher dashboard
          </a>
        ) : (
          <button className="dashboard-signout study-signout" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        )}
      </header>

      {classes.length > 0 ? (
        <ClassList classes={classes} message={message} />
      ) : (
        <JoinClassPanel
          classCode={classCode}
          isJoining={isJoining}
          message={message}
          onClassCodeChange={setClassCode}
          onJoinClass={handleJoinClass}
        />
      )}

      <a className="study-close" href="/" aria-label="Return home">
        X
      </a>
    </main>
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
    <section className="study-detail" aria-labelledby="study-title">
      <StudyPreview />

      <div className="study-copy">
        <span className="study-pill">Study Hall</span>
        <h1 id="study-title">Join a class</h1>
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
              placeholder="Try SHSAT"
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
    <section className="study-detail study-detail-list" aria-labelledby="class-list-title">
      <StudyPreview />

      <div className="study-copy study-class-list">
        <span className="study-pill">Your rooms</span>
        <h1 id="class-list-title">Choose a class</h1>
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

function StudyPreview() {
  return (
    <div className="study-preview" aria-hidden="true">
      <div className="study-preview-screen">
        <span className="study-preview-window study-preview-window-one" />
        <span className="study-preview-window study-preview-window-two" />
        <span className="study-preview-window study-preview-window-three" />
        <div className="study-preview-desk">
          <span />
          <span />
          <span />
        </div>
        <div className="study-preview-badge">
          <span>Room</span>
          <strong>SHSAT</strong>
        </div>
      </div>
    </div>
  );
}
