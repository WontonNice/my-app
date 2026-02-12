import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { AuthUser } from "../../../authStorage";
import type { PrecalcLessonSummary } from "./precalcLessons";
import DesmosBlock, {
    getDesmosBlockId,
    getRequiredDesmosBlockIndexes,
    hasCompletedRequiredDesmosGraphing,
} from "./DesmosBlock";
import KatexExpression from "./Katex";
import {
    appendUnitCircleLatexSnippet,
    getSpecialTriangleSideLabels,
    getUnitCircleRadiansHint,
    isUnitCircleSpecialTrianglesPage,
    renderLessonHint,
    renderLessonText,
    renderUnitCircleCoordinatePreview,
    renderUnitCircleQuestionTools,
    type ActiveQuestionInput,
    type UnitCircleInputCursor,
} from "./UnitCircle";
import {
    createLessonProgressStorageKey,
    readLessonProgressFromStorage,
    writeLessonProgressToStorage,
} from "./SessionSave";

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
        calculatorUrl?: string;
        requireStudentGraphBeforeAdvance?: boolean;
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

function normalizePointAnswer(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/π/g, "\\pi")
        .replace(/\\left|\\right/g, "")
        .replace(/\\dfrac|\\tfrac/g, "\\frac")
        .replace(/\\sqrt(?!\{)([a-z0-9]+)/g, "\\sqrt{$1}")
        .replace(/^p\(/, "(")
        .replace(/\s+/g, "");
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
                                    calculatorUrl: typeof blockCandidate.calculatorUrl === "string"
                                        ? blockCandidate.calculatorUrl
                                        : undefined,
                                    requireStudentGraphBeforeAdvance: Boolean(
                                        blockCandidate.requireStudentGraphBeforeAdvance,
                                    ),
                                } as LessonBlock;
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
    const [activeQuestionInput, setActiveQuestionInput] = useState<ActiveQuestionInput | null>(null);
    const [visibleHints, setVisibleHints] = useState<Record<string, boolean>>({});
    const [questionResults, setQuestionResults] = useState<Record<string, { isCorrect: boolean; submitted: boolean }>>({});
    const [desmosGraphStatus, setDesmosGraphStatus] = useState<Record<string, boolean>>({});
    const [desmosGraphStates, setDesmosGraphStates] = useState<Record<string, Record<string, unknown>>>({});
    const [inputCursorByQuestion, setInputCursorByQuestion] = useState<Record<string, UnitCircleInputCursor>>({});

    const lessonProgressStorageKey = createLessonProgressStorageKey(authUser.username, lesson.filePath);

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

                    const savedProgress = readLessonProgressFromStorage(
                        lessonProgressStorageKey,
                        Math.max((parsed.pages?.length || 1) - 1, 0),
                    );

                    setPageIndex(savedProgress?.pageIndex || 0);
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

        writeLessonProgressToStorage(lessonProgressStorageKey, {
            pageIndex,
            questionAnswers,
            visibleHints,
            questionResults,
            desmosGraphStatus,
            desmosGraphStates,
        });
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

    const displayTitle = lessonPayload?.title ?? lesson.title;

    const currentPage = lessonPayload?.pages?.[pageIndex];
    const requiredQuestions = currentPage?.blocks.filter(
        (block): block is Extract<LessonBlock, { type: "question" }> =>
            block.type === "question" && block.requireCorrectBeforeAdvance === true,
    ) || [];
    const requiredDesmosBlockIndexes = getRequiredDesmosBlockIndexes(currentPage?.blocks);
    const hasCompletedRequiredGraphing = currentPage
        ? hasCompletedRequiredDesmosGraphing(requiredDesmosBlockIndexes, currentPage.id, desmosGraphStatus)
        : true;
    const canAdvancePage =
        (requiredQuestions.length === 0 || requiredQuestions.every((question) => Boolean(questionResults[question.id]?.isCorrect))) &&
        hasCompletedRequiredGraphing;

    const insertLatexIntoActiveInput = (snippet: string) => {
        if (!activeQuestionInput) return;

        const cursorKey = `${activeQuestionInput.questionId}:${activeQuestionInput.coordinate}`;
        const cursor = inputCursorByQuestion[cursorKey];

        setQuestionAnswers((previous) =>
            appendUnitCircleLatexSnippet(
                lesson.filePath,
                previous,
                activeQuestionInput,
                snippet,
                inputCursorByQuestion,
            ),
        );

        if (!cursor) return;

        const nextCaretPosition = cursor.start + snippet.length;
        setInputCursorByQuestion((previous) => ({
            ...previous,
            [cursorKey]: {
                start: nextCaretPosition,
                end: nextCaretPosition,
            },
        }));
    };

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

    const updateActiveInputCursor = (questionId: string, coordinate: "x" | "y", target: HTMLInputElement) => {
        const selectionStart = target.selectionStart ?? target.value.length;
        const selectionEnd = target.selectionEnd ?? selectionStart;

        setActiveQuestionInput({ questionId, coordinate });
        setInputCursorByQuestion((previous) => ({
            ...previous,
            [`${questionId}:${coordinate}`]: {
                start: selectionStart,
                end: selectionEnd,
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
                                    return <p key={`text-${index}`}>{renderLessonText(lesson.filePath, block.text)}</p>;
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
                                    const isUnitCircleMathInput = isUnitCircleSpecialTrianglesPage(
                                        lesson.filePath,
                                        currentPage.id,
                                    );
                                    const specialTriangleSideLabels = getSpecialTriangleSideLabels(
                                        lesson.filePath,
                                        currentPage.id,
                                        block.prompt,
                                    );

                                    return (
                                        <section key={block.id}>
                                            <p>{renderLessonText(lesson.filePath, block.prompt)}</p>
                                            {renderUnitCircleQuestionTools(
                                                lesson.filePath,
                                                currentPage.id,
                                                block.id,
                                                insertLatexIntoActiveInput,
                                            )}
                                            {getUnitCircleRadiansHint(lesson.filePath) && (
                                                <p style={{ marginTop: 0 }}>{getUnitCircleRadiansHint(lesson.filePath)}</p>
                                            )}
                                            {renderUnitCircleCoordinatePreview(
                                                lesson.filePath,
                                                currentPage.id,
                                                answer,
                                                specialTriangleSideLabels,
                                            )}
                                            <form
                                                onSubmit={(event) => handleQuestionSubmit(event, block)}
                                                style={{
                                                    display: "flex",
                                                    alignItems: specialTriangleSideLabels ? "flex-start" : "center",
                                                    flexDirection: specialTriangleSideLabels ? "column" : "row",
                                                    flexWrap: "wrap",
                                                    gap: 8,
                                                }}
                                            >
                                                {specialTriangleSideLabels ? (
                                                    <>
                                                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                            <span>{specialTriangleSideLabels.xLabel} =</span>
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
                                                                onFocus={(event) =>
                                                                    updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                                }
                                                                onClick={(event) =>
                                                                    updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                                }
                                                                onSelect={(event) =>
                                                                    updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                                }
                                                                onKeyUp={(event) =>
                                                                    updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                                }
                                                                aria-label={`${specialTriangleSideLabels.xLabel} for question ${block.id}`}
                                                                style={{
                                                                    width: 170,
                                                                    minHeight: 46,
                                                                    borderRadius: 14,
                                                                    border: "1px solid #c7d2fe",
                                                                    padding: "8px 12px",
                                                                    fontSize: 20,
                                                                }}
                                                            />
                                                        </label>
                                                        <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                            <span>{specialTriangleSideLabels.yLabel} =</span>
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
                                                                onFocus={(event) =>
                                                                    updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                                }
                                                                onClick={(event) =>
                                                                    updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                                }
                                                                onSelect={(event) =>
                                                                    updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                                }
                                                                onKeyUp={(event) =>
                                                                    updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                                }
                                                                aria-label={`${specialTriangleSideLabels.yLabel} for question ${block.id}`}
                                                                style={{
                                                                    width: 170,
                                                                    minHeight: 46,
                                                                    borderRadius: 14,
                                                                    border: "1px solid #c7d2fe",
                                                                    padding: "8px 12px",
                                                                    fontSize: 20,
                                                                }}
                                                            />
                                                        </label>
                                                    </>
                                                ) : (
                                                    <>
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
                                                            onFocus={(event) =>
                                                                updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                            }
                                                            onClick={(event) =>
                                                                updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                            }
                                                            onSelect={(event) =>
                                                                updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                            }
                                                            onKeyUp={(event) =>
                                                                updateActiveInputCursor(block.id, "x", event.currentTarget)
                                                            }
                                                            aria-label={`x-coordinate for question ${block.id}`}
                                                            style={
                                                                isUnitCircleMathInput
                                                                    ? {
                                                                        width: 170,
                                                                        minHeight: 46,
                                                                        borderRadius: 14,
                                                                        border: "1px solid #c7d2fe",
                                                                        padding: "8px 12px",
                                                                        fontSize: 20,
                                                                    }
                                                                    : { width: 56 }
                                                            }
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
                                                            onFocus={(event) =>
                                                                updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                            }
                                                            onClick={(event) =>
                                                                updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                            }
                                                            onSelect={(event) =>
                                                                updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                            }
                                                            onKeyUp={(event) =>
                                                                updateActiveInputCursor(block.id, "y", event.currentTarget)
                                                            }
                                                            aria-label={`y-coordinate for question ${block.id}`}
                                                            style={
                                                                isUnitCircleMathInput
                                                                    ? {
                                                                        width: 170,
                                                                        minHeight: 46,
                                                                        borderRadius: 14,
                                                                        border: "1px solid #c7d2fe",
                                                                        padding: "8px 12px",
                                                                        fontSize: 20,
                                                                    }
                                                                    : { width: 56 }
                                                            }
                                                        />
                                                        <span>)</span>
                                                    </>
                                                )}
                                                <button type="submit" style={{ marginLeft: specialTriangleSideLabels ? 0 : 8 }}>
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
                                                    {isHintVisible && <p>{renderLessonHint(lesson.filePath, `Hint: ${block.explanation}`)}</p>}
                                                </>
                                            )}
                                        </section>
                                    );
                                }

                                const desmosBlockId = getDesmosBlockId(currentPage.id, index);

                                return (
                                    <section key={`desmos-${index}`}>
                                        {block.title && <h3>{block.title}</h3>}
                                        {block.calculatorUrl ? (
                                            <iframe
                                                src={block.calculatorUrl}
                                                title={block.title || "Desmos graph"}
                                                style={{ width: "100%", height: 520, border: "1px solid #ddd", borderRadius: 8 }}
                                                allowFullScreen
                                            />
                                        ) : (
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
                                        )}
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