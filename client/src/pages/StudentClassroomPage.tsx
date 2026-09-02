import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, DoorOpen, KeyRound, LogOut, ShieldCheck } from "lucide-react";
import { useStudentPortalAccess } from "../hooks/useStudentPortalAccess";
import { getStudentClassAccess, joinStudentClass, type StudentClassJoinRequest } from "../lib/api";
import { signOutCurrentAccount } from "../lib/accountSwitching";
import { cacheStudentClasses, peekActiveSession } from "../lib/sessionCache";

export function StudentClassroomPage() {
  const { accessToken, isCheckingSession, isSupabaseConfigured, previewContext, studentName } = useStudentPortalAccess();
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(!previewContext.isPreview);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<StudentClassJoinRequest | null>(null);

  useEffect(() => {
    if (!accessToken || previewContext.isPreview) return;
    let isMounted = true;
    getStudentClassAccess(accessToken).then((access) => {
      if (!isMounted) return;
      const userId = peekActiveSession()?.user.id;
      if (userId) cacheStudentClasses(userId, access.classes);
      if (access.classes.some((classroom) => classroom.id === "shsat")) {
        window.location.replace("/study-hall/shsat");
        return;
      }
      setPendingRequest(access.pendingRequests.find((request) => request.classroom.id === "shsat") ?? null);
    }).catch((nextError) => {
      if (isMounted) setError(nextError instanceof Error ? nextError.message : "Classroom access could not be loaded.");
    }).finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => { isMounted = false; };
  }, [accessToken, previewContext.isPreview]);

  async function handleJoin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!accessToken || !classCode.trim() || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    try {
      const result = await joinStudentClass(accessToken, classCode);
      const userId = peekActiveSession()?.user.id;
      if (userId) cacheStudentClasses(userId, result.classes);
      if (result.status === "approved" && result.classes.some((classroom) => classroom.id === "shsat")) {
        window.location.assign("/study-hall/shsat");
        return;
      }
      setPendingRequest(result.request ?? null);
      setClassCode("");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "That classroom code could not be submitted.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    if (isSupabaseConfigured) await signOutCurrentAccount();
    window.location.assign("/");
  }

  if (isCheckingSession || isLoading) return <main className="loading-shell">Checking classroom access…</main>;

  return (
    <main className="student-classroom-page">
      <header><a href="/">Promise Summer School</a><button onClick={handleSignOut} type="button"><LogOut size={15} /> Sign out</button></header>
      <section className="student-classroom-card">
        <div className="student-classroom-icon">{pendingRequest ? <ShieldCheck size={29} /> : <DoorOpen size={29} />}</div>
        <p>Welcome, {studentName}</p>
        <h1>{pendingRequest ? "Your request is waiting" : "Enter your classroom"}</h1>
        {pendingRequest ? (
          <div className="student-classroom-pending">
            <CheckCircle2 size={21} />
            <span><strong>{pendingRequest.classroom.name}</strong><small>Your teacher must approve the request before the class dashboard opens. You can safely sign out and return later.</small></span>
          </div>
        ) : (
          <>
            <span>Use the classroom code provided by your teacher. A new account will not be placed into a class until this step is complete.</span>
            <form onSubmit={handleJoin}>
              <label htmlFor="student-class-code"><KeyRound size={15} /> Classroom code</label>
              <input
                autoCapitalize="characters"
                autoComplete="off"
                autoFocus
                id="student-class-code"
                onChange={(event) => setClassCode(event.target.value.toUpperCase())}
                placeholder="Enter classroom code"
                required
                spellCheck={false}
                value={classCode}
              />
              {error ? <p role="alert">{error}</p> : null}
              <button disabled={isSubmitting || !classCode.trim()} type="submit">{isSubmitting ? "Submitting…" : "Request access"}</button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
