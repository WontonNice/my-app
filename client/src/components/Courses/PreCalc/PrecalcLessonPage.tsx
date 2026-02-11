import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { AuthUser } from "../../../authStorage";
import type { PrecalcLessonSummary } from "./precalcLessons";
import DesmosBlock from "./DesmosBlock";

function escapeForKatexText(value: string): string {
    return value
        .replace(/\\/g, "\\textbackslash{}")
        .replace(/([{}#$%&_~^])/g, "\\$1")
        .replace(/\n/g, "\\\\")
        .replace(/"/g, "''");
}

function renderKatexText(value: string) {
    return <code>{`\\(${`\\text{${escapeForKatexText(value)}}`}\\)`}</code>;
}

function renderKatexExpression(expression: string) {
    return <pre>{`\\[${expression}\\]`}</pre>;
}

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
        acceptableAnswers?: string[];
        requireCorrectBeforeAdvance?: boolean;
    }
    | {
        type: "desmos";
        title?: string;
        expressions: string[];
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
                                    ? blockCandidate.expressions.filter(
                                        (expression): expression is string => typeof expression === "string",
                                    )
                                    : [];

                                return {
                                    type: "desmos",
                                    title:
                                        typeof blockCandidate.title === "string"
                                            ? blockCandidate.title
                                            : undefined,
                                    expressions,
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

function PrecalcLessonPage({ lesson, onBack, onLogout }: PrecalcLessonPageProps) {
    const [lessonPayload, setLessonPayload] = useState<LessonPayload | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
    const [questionResults, setQuestionResults] = useState<Record<string, { isCorrect: boolean; submitted: boolean }>>({});
    const [desmosGraphStatus, setDesmosGraphStatus] = useState<Record<string, boolean>>({});

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
                    setQuestionAnswers({});
                    setQuestionResults({});
                    setDesmosGraphStatus({});
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

        const candidateAnswer = (questionAnswers[block.id] || "").trim().toLowerCase();
        const acceptableAnswers = (block.acceptableAnswers || []).map((answer) => answer.trim().toLowerCase());
        const isCorrect = acceptableAnswers.length === 0 ? candidateAnswer.length > 0 : acceptableAnswers.includes(candidateAnswer);

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
            <h1>{renderKatexText(displayTitle)}</h1>

            {errorMessage && <p aria-live="polite">{renderKatexText(errorMessage)}</p>}

            {!errorMessage && !lessonPayload && <p>{renderKatexText("Loading lesson...")}</p>}

            {lessonPayload && (
                <>
                    {lessonPayload.objectives && lessonPayload.objectives.length > 0 && (
                        <>
                            <h2>{renderKatexText("Objectives")}</h2>
                            <ul>
                                {lessonPayload.objectives.map((objective) => (
                                    <li key={objective}>{renderKatexText(objective)}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {lessonPayload.pages && lessonPayload.pages.length > 0 && currentPage && (
                        <>
                            <h2>
                                {renderKatexText(`Page ${pageIndex + 1}: ${currentPage.title}`)}
                            </h2>
                            {currentPage.blocks.map((block, index) => {
                                if (block.type === "text") {
                                    return <p key={`text-${index}`}>{renderKatexText(block.text)}</p>;
                                }

                                if (block.type === "katex") {
                                    return <div key={`katex-${index}`}>{renderKatexExpression(block.expression)}</div>;
                                }

                                if (block.type === "question") {
                                    const answer = questionAnswers[block.id] || "";
                                    const questionResult = questionResults[block.id];

                                    return (
                                        <section key={block.id}>
                                            <h3>{renderKatexText("Check your understanding")}</h3>
                                            <p>{renderKatexText(block.prompt)}</p>
                                            <form onSubmit={(event) => handleQuestionSubmit(event, block)}>
                                                <input
                                                    type="text"
                                                    value={answer}
                                                    onChange={(event) =>
                                                        setQuestionAnswers((previous) => ({
                                                            ...previous,
                                                            [block.id]: event.target.value,
                                                        }))
                                                    }
                                                    aria-label={`Answer for question ${block.id}`}
                                                />
                                                <button type="submit" style={{ marginLeft: 8 }}>
                                                    {renderKatexText("Check answer")}
                                                </button>
                                            </form>
                                            {questionResult?.submitted && (
                                                <p aria-live="polite">{renderKatexText(questionResult.isCorrect ? "Correct." : "Try again.")}</p>
                                            )}
                                            {block.explanation && <p>{renderKatexText(`Hint: ${block.explanation}`)}</p>}
                                        </section>
                                    );
                                }

                                return (
                                    <section key={`desmos-${index}`}>
                                        {block.title && <h3>{renderKatexText(block.title)}</h3>}
                                        <DesmosBlock
                                            expressions={block.expressions}
                                            requireStudentGraphBeforeAdvance={block.requireStudentGraphBeforeAdvance}
                                            onGraphStatusChange={(hasStudentGraph) =>
                                                setDesmosGraphStatus((previous) => ({
                                                    ...(previous[`${currentPage.id}-desmos-${index}`] === hasStudentGraph
                                                        ? previous
                                                        : {
                                                            ...previous,
                                                            [`${currentPage.id}-desmos-${index}`]: hasStudentGraph,
                                                        }),
                                                }))
                                            }
                                        />
                                        {block.requireStudentGraphBeforeAdvance && (
                                            <p>{renderKatexText("Graph the unit circle equation in Desmos before moving to the next page.")}</p>
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
                                    {renderKatexText("Previous page")}
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
                                    {renderKatexText("Next page")}
                                </button>
                            </div>
                            {!canAdvancePage && <p aria-live="polite">{renderKatexText("Complete all required checks before moving to the next page.")}</p>}
                        </>
                    )}

                    {(!lessonPayload.pages || lessonPayload.pages.length === 0) && lessonPayload.sections && lessonPayload.sections.length > 0 && (
                        <>
                            <h2>{renderKatexText("Lesson Content")}</h2>
                            {lessonPayload.sections.map((section, index) => (
                                <section key={`${section.heading || "section"}-${index}`}>
                                    {section.heading && <h3>{renderKatexText(section.heading)}</h3>}
                                    {section.content && <p>{renderKatexText(section.content)}</p>}
                                </section>
                            ))}
                        </>
                    )}
                </>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={onBack}>
                    {renderKatexText("Back to Precalculus home")}
                </button>
                <button type="button" onClick={onLogout}>
                    {renderKatexText("Logout")}
                </button>
            </div>
        </>
    );
}

export default PrecalcLessonPage;