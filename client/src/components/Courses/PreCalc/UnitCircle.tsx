import type { ReactNode } from "react";
import KatexExpression, { renderTextWithInlineKatex } from "./Katex";

const UNIT_CIRCLE_LESSON_FILE_PATH = "precalc/chapter-5/unit-circle.json";

export const UNIT_CIRCLE_QUESTION_TOOLS = [
    { snippet: "\\pi", label: "π" },
    { snippet: "\\sqrt{}", label: "√{}" },
    { snippet: "\\frac{}{}", label: "frac{}{}" },
    { snippet: "^2", label: "^2" },
];

const UNIT_CIRCLE_PAGE3_QUESTION_TOOLS = [
    { snippet: "\\sqrt{}", label: "√{}" },
    { snippet: "\\frac{}{}", label: "frac{}{}" },
    { snippet: "\\pi", label: "π" },
    { snippet: "e^{}", label: "e^" },
    { snippet: "t", label: "t" },
    { snippet: "(", label: "(" },
    { snippet: ")", label: ")" },
    { snippet: "+", label: "+" },
    { snippet: "-", label: "-" },
    { snippet: "/", label: "/" },
    { snippet: "^", label: "^" },
];

export type ActiveQuestionInput = {
    questionId: string;
    coordinate: "x" | "y";
};

export function isUnitCircleLesson(filePath: string) {
    return filePath === UNIT_CIRCLE_LESSON_FILE_PATH;
}

export function isUnitCircleSpecialTrianglesPage(filePath: string, pageId?: string) {
    return isUnitCircleLesson(filePath) && pageId === "m1-p3";
}

export function renderLessonText(filePath: string, text: string): ReactNode {
    return isUnitCircleLesson(filePath) ? renderUnitCircleTextWithInlineLatex(text) : text;
}

export function renderLessonHint(filePath: string, text: string): ReactNode {
    return isUnitCircleLesson(filePath) ? renderUnitCircleTextWithInlineLatex(text) : text;
}

export function appendUnitCircleLatexSnippet(
    filePath: string,
    previous: Record<string, { x: string; y: string }>,
    activeQuestionInput: ActiveQuestionInput | null,
    snippet: string,
) {
    if (!isUnitCircleLesson(filePath) || !activeQuestionInput) return previous;

    const currentAnswer = previous[activeQuestionInput.questionId] || { x: "", y: "" };
    const currentValue = currentAnswer[activeQuestionInput.coordinate];

    return {
        ...previous,
        [activeQuestionInput.questionId]: {
            ...currentAnswer,
            [activeQuestionInput.coordinate]: `${currentValue}${snippet}`,
        },
    };
}

export function renderUnitCircleQuestionTools(
    filePath: string,
    pageId: string | undefined,
    questionId: string,
    onInsertSnippet: (snippet: string) => void,
): ReactNode {
    if (!isUnitCircleLesson(filePath)) return null;

    const tools = isUnitCircleSpecialTrianglesPage(filePath, pageId)
        ? UNIT_CIRCLE_PAGE3_QUESTION_TOOLS
        : UNIT_CIRCLE_QUESTION_TOOLS;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
            {tools.map((tool) => (
                <button
                    key={`${questionId}-${tool.snippet}`}
                    type="button"
                    onClick={() => onInsertSnippet(tool.snippet)}
                >
                    {tool.label}
                </button>
            ))}
        </div>
    );
}

export function renderUnitCircleCoordinatePreview(
    filePath: string,
    pageId: string | undefined,
    answer: { x: string; y: string },
): ReactNode {
    if (!isUnitCircleSpecialTrianglesPage(filePath, pageId)) return null;

    const xValue = answer.x.trim() || "\\square";
    const yValue = answer.y.trim() || "\\square";

    return (
        <div
            style={{
                border: "1px solid #c7d2fe",
                borderRadius: 14,
                background: "#f8fafc",
                padding: "16px 18px",
                marginTop: 12,
                marginBottom: 14,
            }}
        >
            <p style={{ marginTop: 0, marginBottom: 8, fontWeight: 600 }}>Preview</p>
            <KatexExpression expression={`(${xValue}, ${yValue})`} displayMode />
        </div>
    );
}

export function getUnitCircleRadiansHint(filePath: string): ReactNode | null {
    return isUnitCircleLesson(filePath) ? renderUnitCircleRadiansHint() : null;
}

export function renderUnitCircleTextWithInlineLatex(text: string): ReactNode {
    return renderTextWithInlineKatex(text);
}

export function renderUnitCircleRadiansHint() {
    return renderUnitCircleTextWithInlineLatex("Hint: $2\\pi = 360^\\circ$. Write radians in terms of $\\pi$.");
}