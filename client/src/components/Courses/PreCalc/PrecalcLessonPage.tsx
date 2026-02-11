import { useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../../../authStorage";
import type { PrecalcLessonSummary } from "./precalcLessons";

type LessonPayload = {
    title?: string;
    chapter?: string;
    objectives?: string[];
    sections?: Array<{
        heading?: string;
        content?: string;
    }>;
};

type PrecalcLessonPageProps = {
    authUser: AuthUser;
    lesson: PrecalcLessonSummary;
    onBack: () => void;
    onLogout: () => void;
};

function toLessonPayload(value: unknown): LessonPayload {
    if (typeof value !== "object" || !value) return {};

    const candidate = value as LessonPayload;

    return {
        title: typeof candidate.title === "string" ? candidate.title : undefined,
        chapter: typeof candidate.chapter === "string" ? candidate.chapter : undefined,
        objectives: Array.isArray(candidate.objectives)
            ? candidate.objectives.filter((objective): objective is string => typeof objective === "string")
            : [],
        sections: Array.isArray(candidate.sections)
            ? candidate.sections.map((section) => ({
                heading: typeof section.heading === "string" ? section.heading : undefined,
                content: typeof section.content === "string" ? section.content : undefined,
            }))
            : [],
    };
}

function PrecalcLessonPage({ authUser, lesson, onBack, onLogout }: PrecalcLessonPageProps) {
    const [lessonPayload, setLessonPayload] = useState<LessonPayload | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadLesson() {
            setErrorMessage("");
            setLessonPayload(null);

            try {
                const response = await fetch(`/lessons/${lesson.filePath}`);
                if (!response.ok) {
                    setErrorMessage(`Could not load lesson file ${lesson.filePath} (HTTP ${response.status})`);
                    return;
                }

                const parsed = toLessonPayload(await response.json());
                if (isMounted) setLessonPayload(parsed);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                if (isMounted) setErrorMessage(`Could not load lesson file ${lesson.filePath}. ${message}`);
            }
        }

        void loadLesson();

        return () => {
            isMounted = false;
        };
    }, [lesson.filePath]);

    const displayTitle = useMemo(() => {
        if (lessonPayload?.title) return lessonPayload.title;
        return lesson.title;
    }, [lesson.title, lessonPayload?.title]);

    return (
        <>
            <h1>{displayTitle}</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>
            <p>{lessonPayload?.chapter || lesson.chapter}</p>

            {errorMessage && <p aria-live="polite">{errorMessage}</p>}

            {!errorMessage && !lessonPayload && <p>Loading lesson...</p>}

            {lessonPayload && (
                <>
                    {lessonPayload.objectives && lessonPayload.objectives.length > 0 && (
                        <>
                            <h2>Objectives</h2>
                            <ul>
                                {lessonPayload.objectives.map((objective) => (
                                    <li key={objective}>{objective}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {lessonPayload.sections && lessonPayload.sections.length > 0 && (
                        <>
                            <h2>Lesson Content</h2>
                            {lessonPayload.sections.map((section, index) => (
                                <section key={`${section.heading || "section"}-${index}`}>
                                    {section.heading && <h3>{section.heading}</h3>}
                                    {section.content && <p>{section.content}</p>}
                                </section>
                            ))}
                        </>
                    )}
                </>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={onBack}>
                    Back to Precalculus home
                </button>
                <button type="button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </>
    );
}

export default PrecalcLessonPage;