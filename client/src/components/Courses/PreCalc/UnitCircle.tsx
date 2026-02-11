import { Fragment } from "react";
import type { ReactNode } from "react";
import KatexExpression from "./Katex";

const UNIT_CIRCLE_LESSON_FILE_PATH = "precalc/chapter-5/unit-circle.json";

export const UNIT_CIRCLE_QUESTION_TOOLS = [
    { snippet: "\\pi", label: "π" },
    { snippet: "\\sqrt{}", label: "√{}" },
    { snippet: "\\frac{}{}", label: "frac{}{}" },
    { snippet: "^2", label: "^2" },
];

export function isUnitCircleLesson(filePath: string) {
    return filePath === UNIT_CIRCLE_LESSON_FILE_PATH;
}

export function renderUnitCircleTextWithInlineLatex(text: string): ReactNode {
    const segments = text.split(/(\$[^$]+\$)/g).filter((segment) => segment.length > 0);

    return segments.map((segment, index) => {
        if (segment.startsWith("$") && segment.endsWith("$")) {
            return (
                <Fragment key={`math-${index}`}>
                    <KatexExpression expression={segment.slice(1, -1)} displayMode={false} />
                </Fragment>
            );
        }

        return <Fragment key={`text-${index}`}>{segment}</Fragment>;
    });
}

export function renderUnitCircleRadiansHint() {
    return renderUnitCircleTextWithInlineLatex("Hint: $2\\pi = 360^\\circ$. Write radians in terms of $\\pi$.");
}