import { useState } from "react";
import type { AuthUser } from "../../../authStorage";

type PrecalcHomePageProps = {
    authUser: AuthUser;
    onBack: () => void;
    onLogout: () => void;
};

type Chapter = {
    id: string;
    name: string;
    modules: string[];
};

const CHAPTERS: Chapter[] = [
    {
        id: "chapter-1",
        name: "Chapter 1: Fundamentals",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-2",
        name: "Chapter 2: Functions",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-3",
        name: "Chapter 3: Polynomials and Rational Functions",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-4",
        name: "Chapter 4: Exponential and Logarithmic Functions",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-5",
        name: "Chapter 5: Trigonometric Functions: Unit Circle Approach",
        modules: [
            "The Unit Circle",
            "Trigonometric Functions of Real Numbers",
            "Trigonometric Graphs",
            "More Trigonometric Graphs",
            "Inverse Trigonometric Functions and Their Graphs",
            "Modeling Harmonic Motion",
        ],
    },
    {
        id: "chapter-6",
        name: "Chapter 6: Trigonometric Functions: Right Triangle Approach",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-7",
        name: "Chapter 7: Analytic Trigonometry",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-8",
        name: "Chapter 8: Polar Coordinates, Parametric Equations, and Vectors",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-9",
        name: "Chapter 9: Systems of Equations and Inequalities",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-10",
        name: "Chapter 10: Conic Sections",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-11",
        name: "Chapter 11: Sequences and Series",
        modules: ["Coming Soon"],
    },
    {
        id: "chapter-12",
        name: "Chapter 12: Limits: A Preview of Calculus",
        modules: ["Coming Soon"],
    },
];

function PrecalcHomePage({ authUser, onBack, onLogout }: PrecalcHomePageProps) {
    const [openChapterIds, setOpenChapterIds] = useState<string[]>([]);
    const [selectedModule, setSelectedModule] = useState("");

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
                                        {chapter.modules.map((moduleName) => (
                                            <li key={`${chapter.id}-${moduleName}`} style={{ marginBottom: 6 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedModule(moduleName);
                                                    }}
                                                >
                                                    {moduleName}
                                                </button>
                                            </li>
                                        ))}
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
                                <strong>{selectedModule}</strong>
                            </p>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                <button type="button">Learn</button>
                                <button type="button">Review</button>
                                <button type="button">Study</button>
                            </div>
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