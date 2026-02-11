import { useState } from "react";
import type { AuthUser } from "../../../authStorage";
import { PRECALC_LESSONS_BY_ID } from "./precalcLessons";
import type { PrecalcLessonSummary } from "./precalcLessons";

type PrecalcHomePageProps = {
    authUser: AuthUser;
    onLearn: (lesson: PrecalcLessonSummary) => void;
    onBack: () => void;
    onLogout: () => void;
};

type ChapterModule = {
    name: string;
    lessonId?: string;
};

type Chapter = {
    id: string;
    name: string;
    modules: ChapterModule[];
};

const CHAPTERS: Chapter[] = [
    {
        id: "chapter-1",
        name: "Chapter 1: Fundamentals",
        modules: [{ name: "Functions and Their Graphs", lessonId: "chapter-1-functions" }],
    },
    {
        id: "chapter-2",
        name: "Chapter 2: Functions",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-3",
        name: "Chapter 3: Polynomials and Rational Functions",
        modules: [{ name: "Trigonometric Functions", lessonId: "chapter-3-trig" }],
    },
    {
        id: "chapter-4",
        name: "Chapter 4: Exponential and Logarithmic Functions",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-5",
        name: "Chapter 5: Trigonometric Functions: Unit Circle Approach",
        modules: [
            { name: "The Unit Circle", lessonId: "chapter-5-unit-circle" },
            {
                name: "Trigonometric Functions of Real Numbers",
                lessonId: "chapter-5-trig-functions-real-numbers",
            },
            { name: "Trigonometric Graphs", lessonId: "chapter-5-trigonometric-graphs" },
            { name: "More Trigonometric Graphs", lessonId: "chapter-5-more-trigonometric-graphs" },
            {
                name: "Inverse Trigonometric Functions and Their Graphs",
                lessonId: "chapter-5-inverse-trigonometric-functions",
            },
            { name: "Modeling Harmonic Motion", lessonId: "chapter-5-modeling-harmonic-motion" },
        ],
    },
    {
        id: "chapter-6",
        name: "Chapter 6: Trigonometric Functions: Right Triangle Approach",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-7",
        name: "Chapter 7: Analytic Trigonometry",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-8",
        name: "Chapter 8: Polar Coordinates, Parametric Equations, and Vectors",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-9",
        name: "Chapter 9: Systems of Equations and Inequalities",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-10",
        name: "Chapter 10: Conic Sections",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-11",
        name: "Chapter 11: Sequences and Series",
        modules: [{ name: "Coming Soon" }],
    },
    {
        id: "chapter-12",
        name: "Chapter 12: Limits: A Preview of Calculus",
        modules: [{ name: "Coming Soon" }],
    },
];

type SelectedModule = {
    chapterId: string;
    moduleName: string;
    lesson: PrecalcLessonSummary | null;
};

function PrecalcHomePage({ authUser, onLearn, onBack, onLogout }: PrecalcHomePageProps) {
    const [openChapterIds, setOpenChapterIds] = useState<string[]>([]);
    const [selectedModule, setSelectedModule] = useState<SelectedModule | null>(null);

    function toggleChapter(chapterId: string) {
        setOpenChapterIds((previousOpenChapterIds) =>
            previousOpenChapterIds.includes(chapterId)
                ? previousOpenChapterIds.filter((id) => id !== chapterId)
                : [...previousOpenChapterIds, chapterId]
        );
    }

    return (
        <>
            <h1>Precalculus Home</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>

            <div
                style={{
                    display: "grid",
                    gap: 16,
                    gridTemplateColumns: "minmax(280px, 1fr) minmax(280px, 1fr)",
                    alignItems: "start",
                    marginBottom: 16,
                }}
            >
                <section
                    aria-label="Precalculus chapters"
                    style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
                >
                    <h2 style={{ marginTop: 0 }}>Main Chapters</h2>
                    {CHAPTERS.map((chapter) => {
                        const isOpen = openChapterIds.includes(chapter.id);

                        return (
                            <div key={chapter.id} style={{ marginBottom: 10 }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        toggleChapter(chapter.id);
                                    }}
                                    style={{ width: "100%", textAlign: "left", padding: "8px 10px" }}
                                >
                                    {chapter.name} {isOpen ? "▲" : "▼"}
                                </button>

                                {isOpen && (
                                    <ul style={{ margin: "8px 0 0 12px", paddingLeft: 12 }}>
                                        {chapter.modules.map((module) => {
                                            const isSelected =
                                                selectedModule?.chapterId === chapter.id &&
                                                selectedModule.moduleName === module.name;

                                            return (
                                                <li key={`${chapter.id}-${module.name}`} style={{ marginBottom: 6 }}>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const lesson = module.lessonId
                                                                ? PRECALC_LESSONS_BY_ID.get(module.lessonId) || null
                                                                : null;

                                                            setSelectedModule({
                                                                chapterId: chapter.id,
                                                                moduleName: module.name,
                                                                lesson,
                                                            });
                                                        }}
                                                        style={{ fontWeight: isSelected ? "bold" : "normal" }}
                                                    >
                                                        {module.name}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        );
                    })}
                </section>

                <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
                    <h2 style={{ marginTop: 0 }}>Module Actions</h2>

                    {selectedModule ? (
                        <>
                            <p>
                                <strong>{selectedModule.moduleName}</strong>
                            </p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedModule.lesson) onLearn(selectedModule.lesson);
                                    }}
                                    disabled={!selectedModule.lesson}
                                >
                                    Learn
                                </button>
                                <button type="button" disabled>
                                    Review
                                </button>
                                <button type="button" disabled>
                                    Study
                                </button>
                            </div>
                            {!selectedModule.lesson && <p style={{ marginBottom: 0 }}>Lesson content coming soon.</p>}
                        </>
                    ) : (
                        <p>Please select module to get started.</p>
                    )}
                </section>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={onBack}>
                    Back to student dashboard
                </button>
                <button type="button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </>
    );
}

export default PrecalcHomePage;