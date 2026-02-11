import { useEffect, useMemo, useRef, useState } from "react";

type LessonIndexItem = {
    id: string;
    title: string;
    chapter: number;
    summary: string;
    path: string;
};

type LessonIndex = {
    course: string;
    lessons: LessonIndexItem[];
};

type TextBlock = {
    type: "text";
    text: string;
};

type KatexBlock = {
    type: "katex";
    expression: string;
    displayMode?: boolean;
};

type QuestionBlock = {
    type: "question";
    id: string;
    prompt: string;
    acceptableAnswers: string[];
    explanation: string;
    placeholder?: string;
};

type DesmosBlock = {
    type: "desmos";
    title?: string;
    expressions?: string[];
};

type LessonBlock = TextBlock | KatexBlock | QuestionBlock | DesmosBlock;

type LessonPage = {
    id: string;
    title: string;
    blocks: LessonBlock[];
};

type LessonContent = {
    id: string;
    title: string;
    chapter: number;
    estimatedMinutes: number;
    objectives: string[];
    pages: LessonPage[];
};

type PrecalcLearnPageProps = {
    onBack: () => void;
};

type AnswerState = {
    value: string;
    checked: boolean;
    isCorrect: boolean;
};



type KatexApi = {
    render: (expression: string, element: HTMLElement, options?: { throwOnError?: boolean; displayMode?: boolean }) => void;
};

type DesmosCalculator = {
    setExpression: (expression: { id: string; latex: string }) => void;
    destroy: () => void;
};

type DesmosApi = {
    GraphingCalculator: (
        element: HTMLElement,
        options?: { expressions?: boolean; settingsMenu?: boolean }
    ) => DesmosCalculator;
};

declare global {
    interface Window {
        Desmos?: DesmosApi;
        katex?: KatexApi;
    }
}

let desmosScriptPromise: Promise<void> | null = null;
let katexScriptPromise: Promise<void> | null = null;

function loadDesmosScript() {
    if (window.Desmos) {
        return Promise.resolve();
    }

    if (desmosScriptPromise) {
        return desmosScriptPromise;
    }

    desmosScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://www.desmos.com/api/v1.11/calculator.js?apiKey=desmos";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Desmos script."));
        document.body.appendChild(script);
    });

    return desmosScriptPromise;
}



function loadKatexScript() {
    if (window.katex) {
        return Promise.resolve();
    }

    if (katexScriptPromise) {
        return katexScriptPromise;
    }

    katexScriptPromise = new Promise((resolve, reject) => {
        if (!document.querySelector('link[data-katex-css="true"]')) {
            const stylesheet = document.createElement("link");
            stylesheet.rel = "stylesheet";
            stylesheet.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
            stylesheet.setAttribute("data-katex-css", "true");
            document.head.appendChild(stylesheet);
        }

        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load KaTeX script."));
        document.body.appendChild(script);
    });

    return katexScriptPromise;
}

function normalizeAnswer(value: string) {
    return value.trim().toLowerCase().replaceAll(" ", "");
}

function KatexExpression({ expression, displayMode = false }: { expression: string; displayMode?: boolean }) {
    const containerRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function renderExpression() {
            try {
                await loadKatexScript();
                if (!isMounted || !containerRef.current || !window.katex) {
                    return;
                }

                window.katex.render(expression, containerRef.current, {
                    throwOnError: false,
                    displayMode,
                });
            } catch {
                if (containerRef.current) {
                    containerRef.current.innerText = expression;
                }
            }
        }

        renderExpression();

        return () => {
            isMounted = false;
        };
    }, [displayMode, expression]);

    return <span ref={containerRef} />;
}

function DesmosEmbed({ title, expressions = [] }: { title?: string; expressions?: string[] }) {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let isMounted = true;
        let calculator: DesmosCalculator | null = null;

        async function initializeCalculator() {
            try {
                await loadDesmosScript();
                if (!isMounted || !containerRef.current || !window.Desmos) {
                    return;
                }

                calculator = window.Desmos.GraphingCalculator(containerRef.current, {
                    expressions: true,
                    settingsMenu: true,
                });

                expressions.forEach((latex, index) => {
                    calculator?.setExpression({ id: `expr-${index}`, latex });
                });
            } catch {
                if (containerRef.current) {
                    containerRef.current.innerText = "Could not load Desmos right now.";
                }
            }
        }

        initializeCalculator();

        return () => {
            isMounted = false;
            calculator?.destroy();
        };
    }, [expressions]);

    return (
        <div style={{ marginTop: 12 }}>
            {title ? <p><strong>{title}</strong></p> : null}
            <div
                ref={containerRef}
                style={{ width: "100%", maxWidth: 760, height: 360, border: "1px solid #ddd" }}
            />
        </div>
    );
}

function PrecalcLearnPage({ onBack }: PrecalcLearnPageProps) {
    const [lessonIndex, setLessonIndex] = useState<LessonIndexItem[]>([]);
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isIndexLoading, setIsIndexLoading] = useState(true);
    const [isLessonLoading, setIsLessonLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, AnswerState>>({});

    useEffect(() => {
        let isMounted = true;

        async function loadLessonIndex() {
            setIsIndexLoading(true);
            setErrorMessage(null);

            try {
                const response = await fetch("/lessons/precalc/index.json");
                if (!response.ok) {
                    throw new Error("Failed to load lesson index.");
                }

                const indexData = (await response.json()) as LessonIndex;
                if (isMounted) {
                    setLessonIndex(indexData.lessons);
                }
            } catch {
                if (isMounted) {
                    setErrorMessage("Could not load lessons. Please refresh and try again.");
                }
            } finally {
                if (isMounted) {
                    setIsIndexLoading(false);
                }
            }
        }

        loadLessonIndex();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleOpenLesson(lesson: LessonIndexItem) {
        setSelectedLessonId(lesson.id);
        setSelectedLesson(null);
        setErrorMessage(null);
        setIsLessonLoading(true);
        setCurrentPageIndex(0);
        setAnswers({});

        try {
            const response = await fetch(lesson.path);
            if (!response.ok) {
                throw new Error("Failed to load lesson.");
            }

            const lessonData = (await response.json()) as LessonContent;
            setSelectedLesson(lessonData);
        } catch {
            setErrorMessage("Could not load this lesson. Please try another lesson.");
        } finally {
            setIsLessonLoading(false);
        }
    }

    const chapterFiveLessons = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return lessonIndex.filter((lesson) => {
            if (lesson.chapter !== 5) {
                return false;
            }

            if (!normalizedSearch) {
                return true;
            }

            return (
                lesson.title.toLowerCase().includes(normalizedSearch) ||
                lesson.summary.toLowerCase().includes(normalizedSearch)
            );
        });
    }, [lessonIndex, searchTerm]);

    const currentPage = selectedLesson?.pages[currentPageIndex] ?? null;

    function updateAnswerValue(questionId: string, value: string) {
        setAnswers((previous) => {
            const existing = previous[questionId];
            return {
                ...previous,
                [questionId]: {
                    value,
                    checked: existing?.checked ?? false,
                    isCorrect: existing?.isCorrect ?? false,
                },
            };
        });
    }

    function checkAnswer(question: QuestionBlock) {
        const currentValue = answers[question.id]?.value ?? "";
        const normalizedValue = normalizeAnswer(currentValue);
        const isCorrect = question.acceptableAnswers
            .map((answer) => normalizeAnswer(answer))
            .includes(normalizedValue);

        setAnswers((previous) => ({
            ...previous,
            [question.id]: {
                value: currentValue,
                checked: true,
                isCorrect,
            },
        }));
    }

    return (
        <div>
            <h2>Precalculus Learn</h2>
            <p>Chapter 5 lesson library using index metadata + lazy lesson loading.</p>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button type="button" onClick={onBack}>
                    Back to Precalculus Home
                </button>
            </div>

            <label htmlFor="chapter-five-search">Search Chapter 5 modules: </label>
            <input
                id="chapter-five-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title or summary"
            />

            {isIndexLoading ? <p>Loading lesson index...</p> : null}
            {errorMessage ? <p>{errorMessage}</p> : null}

            {!isIndexLoading && chapterFiveLessons.length === 0 ? <p>No Chapter 5 lessons found.</p> : null}

            <ul>
                {chapterFiveLessons.map((lesson) => (
                    <li key={lesson.id} style={{ marginBottom: 8 }}>
                        <strong>{lesson.title}</strong> — {lesson.summary}
                        <div>
                            <button type="button" onClick={() => handleOpenLesson(lesson)}>
                                Learn
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {isLessonLoading ? <p>Loading lesson...</p> : null}

            {selectedLesson && currentPage ? (
                <article style={{ border: "1px solid #ddd", padding: 12, marginTop: 16 }}>
                    <h3>
                        {selectedLesson.title} (Chapter {selectedLesson.chapter})
                    </h3>
                    <p>Estimated time: {selectedLesson.estimatedMinutes} minutes</p>
                    <h4>Objectives</h4>
                    <ul>
                        {selectedLesson.objectives.map((objective) => (
                            <li key={objective}>{objective}</li>
                        ))}
                    </ul>

                    <hr />
                    <h4>
                        {currentPage.title} (Page {currentPageIndex + 1} of {selectedLesson.pages.length})
                    </h4>

                    {currentPage.blocks.map((block) => {
                        if (block.type === "text") {
                            return <p key={`${currentPage.id}-${block.text}`}>{block.text}</p>;
                        }

                        if (block.type === "katex") {
                            return (
                                <div key={`${currentPage.id}-${block.expression}`} style={{ marginBottom: 12 }}>
                                    <KatexExpression expression={block.expression} displayMode={block.displayMode} />
                                </div>
                            );
                        }

                        if (block.type === "desmos") {
                            return (
                                <DesmosEmbed
                                    key={`${currentPage.id}-${block.title ?? "desmos"}`}
                                    title={block.title}
                                    expressions={block.expressions}
                                />
                            );
                        }

                        const answer = answers[block.id];

                        return (
                            <div key={`${currentPage.id}-${block.id}`} style={{ marginBottom: 16 }}>
                                <p>
                                    <strong>Check your understanding:</strong> {block.prompt}
                                </p>
                                <input
                                    type="text"
                                    value={answer?.value ?? ""}
                                    onChange={(event) => updateAnswerValue(block.id, event.target.value)}
                                    placeholder={block.placeholder ?? "Type your answer"}
                                />
                                <button type="button" onClick={() => checkAnswer(block)} style={{ marginLeft: 8 }}>
                                    Check answer
                                </button>
                                {answer?.checked ? (
                                    <p>
                                        {answer.isCorrect ? "✅ Correct!" : "❌ Not yet."} {block.explanation}
                                    </p>
                                ) : null}
                            </div>
                        );
                    })}

                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                        <button
                            type="button"
                            onClick={() => setCurrentPageIndex((index) => Math.max(index - 1, 0))}
                            disabled={currentPageIndex === 0}
                        >
                            Previous page
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                setCurrentPageIndex((index) => Math.min(index + 1, selectedLesson.pages.length - 1))
                            }
                            disabled={currentPageIndex >= selectedLesson.pages.length - 1}
                        >
                            Next page
                        </button>
                    </div>
                </article>
            ) : null}
        </div>
    );
}

export default PrecalcLearnPage;