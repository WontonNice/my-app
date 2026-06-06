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

export type UnitCircleInputCursor = {
    start: number;
    end: number;
};

function buildInputCursorKey(input: ActiveQuestionInput) {
    return `${input.questionId}:${input.coordinate}`;
}

function normalizeLatexForDisplay(value: string) {
    const trimmedValue = value.trim();
    if (!trimmedValue) return "\\square";

    const normalizedSqrt = trimmedValue.replace(/\\sqrt(?!\{)([A-Za-z0-9]+)/g, "\\\\sqrt{$1}");

    if (normalizedSqrt.includes("\\frac")) return normalizedSqrt;
    if (!normalizedSqrt.includes("/")) return normalizedSqrt;

    const slashIndex = normalizedSqrt.indexOf("/");
    const numerator = normalizedSqrt.slice(0, slashIndex).trim();
    const denominator = normalizedSqrt.slice(slashIndex + 1).trim();

    if (!numerator || !denominator) return normalizedSqrt;

    return `\\frac{${numerator}}{${denominator}}`;
}

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
    cursorByInput: Record<string, UnitCircleInputCursor> = {},
) {
    if (!isUnitCircleLesson(filePath) || !activeQuestionInput) return previous;

    const currentAnswer = previous[activeQuestionInput.questionId] || { x: "", y: "" };
    const currentValue = currentAnswer[activeQuestionInput.coordinate];
    const cursorKey = buildInputCursorKey(activeQuestionInput);
    const cursor = cursorByInput[cursorKey];

    if (!cursor) {
        return {
            ...previous,
            [activeQuestionInput.questionId]: {
                ...currentAnswer,
                [activeQuestionInput.coordinate]: `${currentValue}${snippet}`,
            },
        };
    }

    const start = Math.max(0, Math.min(cursor.start, currentValue.length));
    const end = Math.max(start, Math.min(cursor.end, currentValue.length));
    const updatedValue = `${currentValue.slice(0, start)}${snippet}${currentValue.slice(end)}`;

    return {
        ...previous,
        [activeQuestionInput.questionId]: {
            ...currentAnswer,
            [activeQuestionInput.coordinate]: updatedValue,
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
    sideLabels: { xLabel: string; yLabel: string } | null,
): ReactNode {
    if (!isUnitCircleSpecialTrianglesPage(filePath, pageId)) return null;

    const xValue = normalizeLatexForDisplay(answer.x);
    const yValue = normalizeLatexForDisplay(answer.y);

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
            {sideLabels ? (
                <>
                    <KatexExpression expression={`${sideLabels.xLabel}=${xValue}`} displayMode />
                    <KatexExpression expression={`${sideLabels.yLabel}=${yValue}`} displayMode />
                </>
            ) : (
                <KatexExpression expression={`(${xValue}, ${yValue})`} displayMode />
            )}
        </div>
    );
}

export function getUnitCircleRadiansHint(filePath: string): ReactNode | null {
    void filePath;
    return null;
}

export function renderUnitCircleTextWithInlineLatex(text: string): ReactNode {
    return renderTextWithInlineKatex(text);
}

export function getSpecialTriangleSideLabels(
    filePath: string,
    pageId: string | undefined,
    prompt: string,
): { xLabel: string; yLabel: string } | null {
    if (!isUnitCircleSpecialTrianglesPage(filePath, pageId) || !prompt.toLowerCase().includes("triangle")) {
        return null;
    }

    const explicitSideMatch = prompt.match(/\b([A-Z]{2})\b\s+and\s+\b([A-Z]{2})\b/i);
    if (explicitSideMatch) {
        return {
            xLabel: explicitSideMatch[1].toUpperCase(),
            yLabel: explicitSideMatch[2].toUpperCase(),
        };
    }
    const tupleMatch = prompt.match(/\(([^)]+)\)/);
    if (!tupleMatch) return null;

    const labels = tupleMatch[1]
        .split(",")
        .map((label) => label.trim().toUpperCase())
        .filter(Boolean);

    if (labels.length < 2) return null;

    return {
        xLabel: labels[0],
        yLabel: labels[1],
    };
}