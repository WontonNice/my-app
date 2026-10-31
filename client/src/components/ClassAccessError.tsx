export function ClassAccessError({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <main className="student-classroom-page">
      <section className="student-classroom-card" aria-labelledby="class-access-error-title">
        <h1 id="class-access-error-title">Classroom access couldn’t be checked</h1>
        <span role="alert">{message || "The server may be temporarily unavailable. Retry to check your existing enrollment."}</span>
        <form onSubmit={(event) => { event.preventDefault(); onRetry(); }}>
          <button type="submit">Retry classroom access</button>
        </form>
        <a href="/login">Return to sign in</a>
      </section>
    </main>
  );
}
