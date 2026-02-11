import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { AuthUser } from "../../../authStorage";
import type { PrecalcLessonSummary } from "./precalcLessons";
import DesmosBlock from "./DesmosBlock";
import KatexExpression from "./Katex";
import UnitCircleSpecialTriangleReview from "./Modules/Chapter5/UnitCircleSpecialTriangleReview";

type LessonBlock =
    | {
        type: "text";
        text: string;
    }
    | {
        type: "katex";
        expression: string;
        displayMode?: boolean;
    }
    | {
        type: "image";
        src: string;
        alt: string;
        caption?: string;
        maxWidth?: number;
    }
    | {
        type: "question";
        id: string;
        prompt: string;
        explanation?: string;
        acceptableAnswers?: string[];
        requireCorrectBeforeAdvance?: boolean;
    }
    | {
        type: "desmos";
        title?: string;
        expressions: Array<{ latex: string; label?: string; showLabel?: boolean } | string>;
        viewport?: { left: number; right: number; bottom: number; top: number };
        requireStudentGraphBeforeAdvance?: boolean;
    }
    | {
        type: "specialTriangle45Animation";
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

type LessonProgress = {
    pageIndex: number;
    questionAnswers: Record<string, { x: string; y: string }>;
    visibleHints: Record<string, boolean>;
    questionResults: Record<string, { isCorrect: boolean; submitted: boolean }>;
    desmosGraphStatus: Record<string, boolean>;
    desmosGraphStates: Record<string, Record<string, unknown>>;
};

function normalizePointAnswer(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/^p\(/, "(")
        .replace(/\s+/g, "");
}

function toLessonProgress(value: unknown): LessonProgress | null {
    if (!value || typeof value !== "object") return null;

    const candidate = value as Partial<LessonProgress>;

    const pageIndex =
        typeof candidate.pageIndex === "number" && Number.isInteger(candidate.pageIndex) && candidate.pageIndex >= 0
            ? candidate.pageIndex
            : 0;

    const questionAnswers =
        candidate.questionAnswers && typeof candidate.questionAnswers === "object"
            ? Object.entries(candidate.questionAnswers).reduce<Record<string, { x: string; y: string }>>(
                (accumulator, [questionId, answer]) => {
                    if (!answer || typeof answer !== "object") return accumulator;

                    const answerCandidate = answer as { x?: unknown; y?: unknown };
                    accumulator[questionId] = {
                        x: typeof answerCandidate.x === "string" ? answerCandidate.x : "",
                        y: typeof answerCandidate.y === "string" ? answerCandidate.y : "",
                    };

                    return accumulator;
                },
                {},
            )
            : {};

    const visibleHints =
        candidate.visibleHints && typeof candidate.visibleHints === "object"
            ? Object.entries(candidate.visibleHints).reduce<Record<string, boolean>>((accumulator, [questionId, isVisible]) => {
                accumulator[questionId] = isVisible === true;
                return accumulator;
            }, {})
            : {};

    const questionResults =
        candidate.questionResults && typeof candidate.questionResults === "object"
            ? Object.entries(candidate.questionResults).reduce<Record<string, { isCorrect: boolean; submitted: boolean }>>(
                (accumulator, [questionId, questionResult]) => {
                    if (!questionResult || typeof questionResult !== "object") return accumulator;

                    const resultCandidate = questionResult as { isCorrect?: unknown; submitted?: unknown };
                    accumulator[questionId] = {
                        isCorrect: resultCandidate.isCorrect === true,
                        submitted: resultCandidate.submitted === true,
                    };

                    return accumulator;
                },
                {},
            )
            : {};

    const desmosGraphStatus =
        candidate.desmosGraphStatus && typeof candidate.desmosGraphStatus === "object"
            ? Object.entries(candidate.desmosGraphStatus).reduce<Record<string, boolean>>((accumulator, [blockId, isComplete]) => {
                accumulator[blockId] = isComplete === true;
                return accumulator;
            }, {})
            : {};

    const desmosGraphStates =
        candidate.desmosGraphStates && typeof candidate.desmosGraphStates === "object"
            ? Object.entries(candidate.desmosGraphStates).reduce<Record<string, Record<string, unknown>>>(
                (accumulator, [blockId, graphState]) => {
                    if (graphState && typeof graphState === "object") {
                        accumulator[blockId] = graphState as Record<string, unknown>;
                    }
                    return accumulator;
                },
                {},
            )
            : {};

    return { pageIndex, questionAnswers, visibleHints, questionResults, desmosGraphStatus, desmosGraphStates };
}

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
                                    displayMode: Boolean(blockCandidate.displayMode),
                                } as LessonBlock;
                            }

                            if (blockCandidate.type === "image" && typeof blockCandidate.src === "string") {
                                return {
                                    type: "image",
                                    src: blockCandidate.src,
                                    alt: typeof blockCandidate.alt === "string" ? blockCandidate.alt : undefined,
                                    caption: typeof blockCandidate.caption === "string" ? blockCandidate.caption : undefined,
                                    maxWidth:
                                        typeof blockCandidate.maxWidth === "number" && Number.isFinite(blockCandidate.maxWidth)
                                            ? blockCandidate.maxWidth
                                            : undefined,
                                } as LessonBlock;
                            }

                            if (
                                blockCandidate.type === "question" &&
                                typeof blockCandidate.id === "string" &&
                                typeof blockCandidate.prompt === "string"
                            ) {
                                const acceptableAnswers = Array.isArray(blockCandidate.acceptableAnswers)
                                    ? blockCandidate.acceptableAnswers.filter(
                                        (answer): answer is string => typeof answer === "string" && answer.length > 0,
                                    )
                                    : [];

                                return {
                                    type: "question",
                                    id: blockCandidate.id,
                                    prompt: blockCandidate.prompt,
                                    explanation:
                                        typeof blockCandidate.explanation === "string"
                                            ? blockCandidate.explanation
                                            : undefined,
                                    acceptableAnswers,
                                    requireCorrectBeforeAdvance: Boolean(blockCandidate.requireCorrectBeforeAdvance),
                                } as LessonBlock;
                            }

                            if (blockCandidate.type === "desmos") {
                                const expressions = Array.isArray(blockCandidate.expressions)
                                    ? blockCandidate.expressions
                                        .map((expression) => {
                                            if (typeof expression === "string") return expression;
                                            if (!expression || typeof expression !== "object") return null;

                                            const expressionCandidate = expression as {
                                                latex?: unknown;
                                                label?: unknown;
                                                showLabel?: unknown;
                                            };

                                            if (typeof expressionCandidate.latex !== "string") return null;

                                            const label = typeof expressionCandidate.label === "string"
                                                ? { label: expressionCandidate.label }
                                                : {};
                                            const showLabel = expressionCandidate.showLabel === true
                                                ? { showLabel: true }
                                                : {};

                                            return {
                                                latex: expressionCandidate.latex,
                                                ...label,
                                                ...showLabel,
                                            };
                                        })
                                        .filter((expression) => expression !== null) as Array<
                                            string | { latex: string; label?: string; showLabel?: boolean }
                                        >
                                    : [];

                                const viewportCandidate =
                                    blockCandidate.viewport && typeof blockCandidate.viewport === "object"
                                        ? (blockCandidate.viewport as Record<string, unknown>)
                                        : null;

                                const viewport =
                                    viewportCandidate &&
                                        typeof viewportCandidate.left === "number" &&
                                        typeof viewportCandidate.right === "number" &&
                                        typeof viewportCandidate.bottom === "number" &&
                                        typeof viewportCandidate.top === "number"
                                        ? {
                                            left: viewportCandidate.left,
                                            right: viewportCandidate.right,
                                            bottom: viewportCandidate.bottom,
                                            top: viewportCandidate.top,
                                        }
                                        : undefined;

                                return {
                                    type: "desmos",
                                    title:
                                        typeof blockCandidate.title === "string"
                                            ? blockCandidate.title
                                            : undefined,
                                    expressions,
                                    viewport,
                                    requireStudentGraphBeforeAdvance: Boolean(
                                        blockCandidate.requireStudentGraphBeforeAdvance,
                                    ),
                                } as LessonBlock;
                            }

                            if (blockCandidate.type === "specialTriangle45Animation") {
                                return { type: "specialTriangle45Animation" } as LessonBlock;
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

function PrecalcLessonPage({ authUser, lesson, onBack, onLogout }: PrecalcLessonPageProps) {
    const [lessonPayload, setLessonPayload] = useState<LessonPayload | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState<Record<string, { x: string; y: string }>>({});
    const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});
    const [questionResults, setQuestionResults] = useState<Record<string, { isCorrect: boolean; submitted: boolean }>>({});
    const [desmosGraphStatus, setDesmosGraphStatus] = useState<Record<string, boolean>>({});
    const [desmosGraphStates, setDesmosGraphStates] = useState<Record<string, Record<string, unknown>>>({});

    const lessonProgressStorageKey = useMemo(
        () => `precalc-lesson-progress:${authUser.username}:${lesson.filePath}`,
        [authUser.username, lesson.filePath],
    );

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

                    const savedProgressRaw = window.localStorage.getItem(lessonProgressStorageKey);
                    let savedProgress: LessonProgress | null = null;

                    if (savedProgressRaw) {
                        try {
                            savedProgress = toLessonProgress(JSON.parse(savedProgressRaw));
                        } catch {
                            savedProgress = null;
                        }
                    }

                    setPageIndex(
                        savedProgress ? Math.min(savedProgress.pageIndex, Math.max((parsed.pages?.length || 1) - 1, 0)) : 0,
                    );
                    setQuestionAnswers(savedProgress?.questionAnswers || {});
                    setQuestionResults(savedProgress?.questionResults || {});
                    setVisibleHints(savedProgress?.visibleHints || {});
                    setDesmosGraphStatus(savedProgress?.desmosGraphStatus || {});
                    setDesmosGraphStates(savedProgress?.desmosGraphStates || {});
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
    }, [lesson.filePath, lessonProgressStorageKey]);

    useEffect(() => {
        if (!lessonPayload) return;

        const progressToStore: LessonProgress = {
            pageIndex,
            questionAnswers,
            visibleHints,
            questionResults,
            desmosGraphStatus,
            desmosGraphStates,
        };

        window.localStorage.setItem(lessonProgressStorageKey, JSON.stringify(progressToStore));
    }, [
        desmosGraphStates,
        desmosGraphStatus,
        lessonPayload,
        lessonProgressStorageKey,
        pageIndex,
        questionAnswers,
        questionResults,
        visibleHints,
    ]);

    const displayTitle = useMemo(() => {
        if (lessonPayload?.title) return lessonPayload.title;
        return lesson.title;
    }, [lesson.title, lessonPayload?.title]);

    const currentPage = lessonPayload?.pages?.[pageIndex];
    const requiredQuestions = currentPage?.blocks.filter(
        (block): block is Extract<LessonBlock, { type: "question" }> =>
            block.type === "question" && block.requireCorrectBeforeAdvance === true,
    ) || [];
    const requiredDesmosBlocks = currentPage?.blocks
        .map((block, index) => ({ block, index }))
        .filter(
            (entry): entry is { block: Extract<LessonBlock, { type: "desmos" }>; index: number } =>
                entry.block.type === "desmos" && entry.block.requireStudentGraphBeforeAdvance === true,
        ) || [];
    const hasCompletedRequiredGraphing =
        requiredDesmosBlocks.length === 0 ||
        requiredDesmosBlocks.every(({ index }) => Boolean(desmosGraphStatus[`${currentPage?.id || "page"}-desmos-${index}`]));
    const canAdvancePage =
        (requiredQuestions.length === 0 || requiredQuestions.every((question) => Boolean(questionResults[question.id]?.isCorrect))) &&
        hasCompletedRequiredGraphing;

    const handleQuestionSubmit = (event: FormEvent<HTMLFormElement>, block: Extract<LessonBlock, { type: "question" }>) => {
        event.preventDefault();

        const answerParts = questionAnswers[block.id] || { x: "", y: "" };
        const candidateAnswer = normalizePointAnswer(`(${answerParts.x.trim()},${answerParts.y.trim()})`);
        const acceptableAnswers = (block.acceptableAnswers || []).map((answer) => normalizePointAnswer(answer));
        const isCorrect = acceptableAnswers.length === 0
            ? answerParts.x.trim().length > 0 && answerParts.y.trim().length > 0
            : acceptableAnswers.includes(candidateAnswer);

        setQuestionResults((previous) => ({
            ...previous,
            [block.id]: {
                isCorrect,
                submitted: true,
            },
        }));
    };

    return (
        <>
            <h1>{displayTitle}</h1>

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
                                {`Page ${pageIndex + 1}: ${currentPage.title}`}
                            </h2>
                            {currentPage.blocks.some((block) => block.type === "question") && <h3>Check your understanding</h3>}
                            {currentPage.blocks.map((block, index) => {
                                if (block.type === "text") {
                                    return <p key={`text-${index}`}>{block.text}</p>;
                                }

                                if (block.type === "katex") {
                                    return (
                                        <div key={`katex-${index}`}>
                                            <KatexExpression expression={block.expression} displayMode={block.displayMode ?? true} />
                                        </div>
                                    );
                                }

                                if (block.type === "image") {
                                    return (
                                        <figure key={`image-${index}`} style={{ margin: "16px auto", textAlign: "center" }}>
                                            <img
                                                src={block.src}
                                                alt={block.alt || "Lesson visual"}
                                                style={{ display: "block", width: "100%", maxWidth: block.maxWidth ?? 640, height: "auto", margin: "0 auto" }}
                                            />
                                            {block.caption && <figcaption style={{ whiteSpace: "pre-line", marginTop: 8 }}>{block.caption}</figcaption>}
                                        </figure>
                                    );
                                }

                                if (block.type === "question") {
                                    const answer = questionAnswers[block.id] || { x: "", y: "" };
                                    const questionResult = questionResults[block.id];
                                    const isHintVisible = Boolean(visibleHints[block.id]);

                                    return (
                                        <section key={block.id}>
                                            <p>{block.prompt}</p>
                                            <form onSubmit={(event) => handleQuestionSubmit(event, block)}>
                                                <span>(</span>
                                                <input
                                                    type="text"
                                                    value={answer.x}
                                                    onChange={(event) =>
                                                        setQuestionAnswers((previous) => ({
                                                            ...previous,
                                                            [block.id]: {
                                                                x: event.target.value,
                                                                y: previous[block.id]?.y || "",
                                                            },
                                                        }))
                                                    }
                                                    aria-label={`x-coordinate for question ${block.id}`}
                                                    style={{ width: 56 }}
                                                />
                                                <span>, </span>
                                                <input
                                                    type="text"
                                                    value={answer.y}
                                                    onChange={(event) =>
                                                        setQuestionAnswers((previous) => ({
                                                            ...previous,
                                                            [block.id]: {
                                                                x: previous[block.id]?.x || "",
                                                                y: event.target.value,
                                                            },
                                                        }))
                                                    }
                                                    aria-label={`y-coordinate for question ${block.id}`}
                                                    style={{ width: 56 }}
                                                />
                                                <span>)</span>
                                                <button type="submit" style={{ marginLeft: 8 }}>
                                                    Check answer
                                                </button>
                                            </form>
                                            {questionResult?.submitted && (
                                                <p aria-live="polite">{questionResult.isCorrect ? "Correct." : "Try again."}</p>
                                            )}
                                            {block.explanation && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setVisibleHints((previous) => ({
                                                                ...previous,
                                                                [block.id]: !previous[block.id],
                                                            }))
                                                        }
                                                    >
                                                        {isHintVisible ? "Hide hint" : "Show hint"}
                                                    </button>
                                                    {isHintVisible && <p>{`Hint: ${block.explanation}`}</p>}
                                                </>
                                            )}
                                        </section>
                                    );
                                }

                                if (block.type === "specialTriangle45Animation") {
                                    return <UnitCircleSpecialTriangleReview key={`special-triangle-${index}`} />;
                                }

                                const desmosBlockId = `${currentPage.id}-desmos-${index}`;

                                return (
                                    <section key={`desmos-${index}`}>
                                        {block.title && <h3>{block.title}</h3>}
                                        <DesmosBlock
                                            expressions={block.expressions}
                                            viewport={block.viewport}
                                            requireStudentGraphBeforeAdvance={block.requireStudentGraphBeforeAdvance}
                                            savedGraphState={desmosGraphStates[desmosBlockId]}
                                            onGraphStatusChange={(hasStudentGraph) =>
                                                setDesmosGraphStatus((previous) => ({
                                                    ...(previous[desmosBlockId] === hasStudentGraph
                                                        ? previous
                                                        : {
                                                            ...previous,
                                                            [desmosBlockId]: hasStudentGraph,
                                                        }),
                                                }))
                                            }
                                            onGraphStateChange={(graphState) =>
                                                setDesmosGraphStates((previous) => ({
                                                    ...previous,
                                                    [desmosBlockId]: graphState,
                                                }))
                                            }
                                        />
                                        {block.requireStudentGraphBeforeAdvance && (
                                            <p>Graph the unit circle equation in Desmos before moving to the next page.</p>
                                        )}
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
                                    disabled={pageIndex === (lessonPayload.pages?.length || 1) - 1 || !canAdvancePage}
                                >
                                    Next page
                                </button>
                            </div>
                            {!canAdvancePage && <p aria-live="polite">Complete all required checks before moving to the next page.</p>}
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