import { subjects, tutoringHighlights } from "../content/landingPage";

export function LandingPage() {
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
          {tutoringHighlights.map((highlight) => (
            <div key={highlight.label}>
              <span className="stat">{highlight.value}</span>
              <span className="stat-label">{highlight.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="subjects" className="subjects" aria-label="Subjects">
        {subjects.map((subject) => (
          <article className="subject-card" key={subject}>
            {subject}
          </article>
        ))}
      </section>
    </main>
  );
}
