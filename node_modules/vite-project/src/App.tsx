function App() {
  return (
    <main className="app-shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Nathan Tutors</p>
          <h1 id="hero-title">Clear, focused tutoring for math and computer science.</h1>
          <p className="hero-text">
            Build confidence with practical lessons, patient explanations, and a plan
            that adapts to the way you learn.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="mailto:nathan@example.com">
              Book a session
            </a>
            <a className="button button-secondary" href="#subjects">
              View subjects
            </a>
          </div>
        </div>

        <div className="session-card" aria-label="Tutoring highlights">
          <div>
            <span className="stat">1:1</span>
            <span className="stat-label">personalized sessions</span>
          </div>
          <div>
            <span className="stat">60 min</span>
            <span className="stat-label">focused lesson blocks</span>
          </div>
          <div>
            <span className="stat">Online</span>
            <span className="stat-label">flexible scheduling</span>
          </div>
        </div>
      </section>

      <section id="subjects" className="subjects" aria-label="Subjects">
        {["Algebra", "Calculus", "JavaScript", "React", "Study planning"].map((subject) => (
          <article className="subject-card" key={subject}>
            {subject}
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
