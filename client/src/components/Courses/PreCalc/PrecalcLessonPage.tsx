import { useEffect, useMemo, useRef, useState } from "react";
import type { AuthUser } from "../../../authStorage";
import type { PrecalcLessonSummary } from "./precalcLessons";

declare global {
    interface Window {
        Desmos?: {
            GraphingCalculator: (
                elt: HTMLElement,
                options?: { expressions?: boolean; keypad?: boolean; settingsMenu?: boolean },
            ) => {
                setExpression: (expression: { id: string; latex: string }) => void;
                destroy: () => void;
            };
        };
    }
}

const DESMOS_API_KEY = "eae68c10752846c5bf6c8e776563c465";

type LessonBlock =
    | {
        type: "text";
        text: string;
    }
    | {
        type: "katex";
        expression: string;
    }
    | {
        type: "question";
        id: string;
        prompt: string;
        explanation?: string;
    }
    | {
        type: "desmos";
        title?: string;
        expressions: string[];
    };

type LessonPage = {
    id: string;
    title: string;
    blocks: LessonBlock[];
};

type LessonPayload = {
    title?: string;
    chapter?: string | number;
    objectives?: string[];
    sections?: Array<{
        heading?: string;
        content?: string;
    }>;
    pages?: LessonPage[];
};

type PrecalcLessonPageProps = {
    authUser: AuthUser;
    lesson: PrecalcLessonSummary;
    onBack: () => void;
    onLogout: () => void;
};

function toLessonPayload(value: unknown): LessonPayload {
    if (typeof value !== "object" || !value) return {};

    const candidate = value as {
        title?: unknown;
        chapter?: unknown;
        objectives?: unknown;
        sections?: unknown;
        pages?: unknown;
    };

    const pages = Array.isArray(candidate.pages)
        ? candidate.pages
            .map((page, pageIndex) => {
                if (!page || typeof page !== "object") return null;

                const pageCandidate = page as { id?: unknown; title?: unknown; blocks?: unknown };
                const pageBlocks = Array.isArray(pageCandidate.blocks)
                    ? pageCandidate.blocks
                        .map((block) => {
                            if (!block || typeof block !== "object") return null;
                            const blockCandidate = block as Record<string, unknown>;

                            if (blockCandidate.type === "text" && typeof blockCandidate.text === "string") {
                                return { type: "text", text: blockCandidate.text } as LessonBlock;
                            }

                            if (blockCandidate.type === "katex" && typeof blockCandidate.expression === "string") {
                                return {
                                    type: "katex",
                                    expression: blockCandidate.expression,
                                } as LessonBlock;
                            }

                            if (
                                blockCandidate.type === "question" &&
                                typeof blockCandidate.id === "string" &&
                                typeof blockCandidate.prompt === "string"
                            ) {
                                return {
                                    type: "question",
                                    id: blockCandidate.id,
                                    prompt: blockCandidate.prompt,
                                    explanation:
                                        typeof blockCandidate.explanation === "string"
                                            ? blockCandidate.explanation
                                            : undefined,
                                } as LessonBlock;
                            }

                            if (blockCandidate.type === "desmos") {
                                const expressions = Array.isArray(blockCandidate.expressions)
                                    ? blockCandidate.expressions.filter(
                                        (expression): expression is string => typeof expression === "string",
                                    )
                                    : [];

                                if (expressions.length > 0) {
                                    return {
                                        type: "desmos",
                                        title:
                                            typeof blockCandidate.title === "string"
                                                ? blockCandidate.title
                                                : undefined,
                                        expressions,
                                    } as LessonBlock;
                                }
                            }

                            return null;
                        })
                        .filter((block): block is LessonBlock => Boolean(block))
                    : [];

                return {
                    id: typeof pageCandidate.id === "string" ? pageCandidate.id : `page-${pageIndex + 1}`,
                    title: typeof pageCandidate.title === "string" ? pageCandidate.title : `Page ${pageIndex + 1}`,
                    blocks: pageBlocks,
                };
            })
            .filter((page): page is LessonPage => Boolean(page))
        : [];

    return {
        title: typeof candidate.title === "string" ? candidate.title : undefined,
        chapter: typeof candidate.chapter === "string" || typeof candidate.chapter === "number" ? candidate.chapter : undefined,
        objectives: Array.isArray(candidate.objectives)
            ? candidate.objectives.filter((objective): objective is string => typeof objective === "string")
            : [],
        sections: Array.isArray(candidate.sections)
            ? candidate.sections.map((section) => ({
                heading: typeof section.heading === "string" ? section.heading : undefined,
                content: typeof section.content === "string" ? section.content : undefined,
            }))
            : [],
        pages,
    };
}

type DesmosBlockProps = {
    expressions: string[];
};

function DesmosBlock({ expressions }: DesmosBlockProps) {
    const calculatorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let destroyed = false;
        let calculator: { setExpression: (expression: { id: string; latex: string }) => void; destroy: () => void } | null = null;

        const initializeCalculator = () => {
            if (destroyed || !calculatorRef.current || !window.Desmos?.GraphingCalculator) return;

            calculator = window.Desmos.GraphingCalculator(calculatorRef.current, {
                expressions: true,
                keypad: false,
            });

            expressions.forEach((expression, index) => {
                calculator?.setExpression({ id: `exp-${index + 1}`, latex: expression });
            });
        };

        const existingScript = document.querySelector<HTMLScriptElement>(`script[data-desmos-api-key="${DESMOS_API_KEY}"]`);

        if (window.Desmos?.GraphingCalculator) {
            initializeCalculator();
        } else if (existingScript) {
            existingScript.addEventListener("load", initializeCalculator, { once: true });
        } else {
            const script = document.createElement("script");
            script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${DESMOS_API_KEY}`;
            script.async = true;
            script.dataset.desmosApiKey = DESMOS_API_KEY;
            script.addEventListener("load", initializeCalculator, { once: true });
            document.body.appendChild(script);
        }

        return () => {
            destroyed = true;
            calculator?.destroy();
        };
    }, [expressions]);

    return <div ref={calculatorRef} style={{ width: "100%", height: 420, border: "1px solid #ddd", borderRadius: 8 }} />;
}

function PrecalcLessonPage({ authUser, lesson, onBack, onLogout }: PrecalcLessonPageProps) {
    const [lessonPayload, setLessonPayload] = useState<LessonPayload | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageIndex, setPageIndex] = useState(0);

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
                if (isMounted) {
                    setLessonPayload(parsed);
                    setPageIndex(0);
                }
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

    const currentPage = lessonPayload?.pages?.[pageIndex];

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

                    {lessonPayload.pages && lessonPayload.pages.length > 0 && currentPage && (
                        <>
                            <h2>
                                Page {pageIndex + 1}: {currentPage.title}
                            </h2>
                            {currentPage.blocks.map((block, index) => {
                                if (block.type === "text") {
                                    return <p key={`text-${index}`}>{block.text}</p>;
                                }

                                if (block.type === "katex") {
                                    return <pre key={`katex-${index}`}>{block.expression}</pre>;
                                }

                                if (block.type === "question") {
                                    return (
                                        <section key={block.id}>
                                            <h3>Check your understanding</h3>
                                            <p>{block.prompt}</p>
                                            {block.explanation && <p>Hint: {block.explanation}</p>}
                                        </section>
                                    );
                                }

                                return (
                                    <section key={`desmos-${index}`}>
                                        {block.title && <h3>{block.title}</h3>}
                                        <DesmosBlock expressions={block.expressions} />
                                    </section>
                                );
                            })}

                            <div style={{ display: "flex", gap: 8 }}>
                                <button
                                    type="button"
                                    onClick={() => setPageIndex((previous) => Math.max(previous - 1, 0))}
                                    disabled={pageIndex === 0}
                                >
                                    Previous page
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPageIndex((previous) =>
                                            Math.min(previous + 1, (lessonPayload.pages?.length || 1) - 1),
                                        )
                                    }
                                    disabled={pageIndex === (lessonPayload.pages?.length || 1) - 1}
                                >
                                    Next page
                                </button>
                            </div>
                        </>
                    )}

                    {(!lessonPayload.pages || lessonPayload.pages.length === 0) && lessonPayload.sections && lessonPayload.sections.length > 0 && (
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