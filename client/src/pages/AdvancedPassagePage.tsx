import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdvancedPracticePassage } from "../content/advancedPractice/passages";
import { getSupabaseClient, isSupabaseConfigured } from "../lib/supabase";

function getPassageIdFromPath() {
  return window.location.pathname.split("/").filter(Boolean)[1] ?? "";
}

export function AdvancedPassagePage() {
  const passage = getAdvancedPracticePassage(getPassageIdFromPath());
  const [isCheckingSession, setIsCheckingSession] = useState(isSupabaseConfigured);
  const searchParams = new URLSearchParams(window.location.search);
  const hasTeacherPreviewTools =
    searchParams.get("preview") === "student" && searchParams.get("teacherTools") === "1";
  const previewQuery = hasTeacherPreviewTools ? "&preview=student&teacherTools=1" : "";
  const backHref = `/study-hall?section=advanced${previewQuery}`;
  const practiceHref = passage
    ? `/practice/${passage.practiceSlug}${hasTeacherPreviewTools ? "?preview=student&teacherTools=1" : ""}`
    : "/study-hall?section=advanced";

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    getSupabaseClient().auth.getSession().then(({ data }) => {
      if (!data.session) {
        window.location.assign("/login");
        return;
      }

      setIsCheckingSession(false);
    });
  }, []);

  if (isCheckingSession) {
    return <main className="loading-shell">Loading passage...</main>;
  }

  if (!passage) {
    return (
      <main className="advanced-passage-page">
        <section className="advanced-passage-missing">
          <BookOpen aria-hidden="true" size={28} />
          <h1>Passage not found</h1>
          <a href={backHref}>Return to Advanced Practice</a>
        </section>
      </main>
    );
  }

  return (
    <main className="advanced-passage-page">
      <header className="advanced-passage-reader-header">
        <a href={backHref}>
          <ArrowLeft aria-hidden="true" size={17} />
          Advanced Practice
        </a>
        <span>Nathan Tutors Reading Lab</span>
      </header>

      <article className="advanced-passage-document" aria-labelledby="advanced-passage-title">
        <header>
          <h1 id="advanced-passage-title">{passage.title}</h1>
          <p>by {passage.author}</p>
        </header>

        <div className="advanced-passage-copy">
          {passage.paragraphs.map((paragraph, index) => (
            <p key={paragraph}>
              <span aria-hidden="true">{index + 1}</span>
              {paragraph}
            </p>
          ))}
        </div>

        <footer>
          <div>
            <strong>Finished reading?</strong>
            <p>Continue into focused questions for the main skill connected to this passage.</p>
          </div>
          <a href={practiceHref}>
            Continue to questions <ArrowRight aria-hidden="true" size={17} />
          </a>
        </footer>
      </article>
    </main>
  );
}
