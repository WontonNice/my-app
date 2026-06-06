import { useEffect, useRef } from "react";

type DesmosExpression = {
    id?: string;
    latex?: string;
    label?: string;
    showLabel?: boolean;
};

type DesmosGraphState = Record<string, unknown>;

declare global {
    interface Window {
        Desmos?: {
            GraphingCalculator: (
                elt: HTMLElement,
                options?: { expressions?: boolean; keypad?: boolean; settingsMenu?: boolean },
            ) => {
                setExpression: (expression: { id: string; latex: string; label?: string; showLabel?: boolean }) => void;
                getExpressions: () => DesmosExpression[];
                observeEvent: (eventName: string, callback: () => void) => void;
                setMathBounds: (bounds: { left: number; right: number; bottom: number; top: number }) => void;
                setState: (state: DesmosGraphState) => void;
                getState: () => DesmosGraphState;
                destroy: () => void;
            };
        };
    }
}

const DESMOS_API_KEY = "eae68c10752846c5bf6c8e776563c465";

export type DesmosBlockProps = {
    expressions: Array<
        | string
        | {
            latex: string;
            label?: string;
            showLabel?: boolean;
        }
    >;
    requireStudentGraphBeforeAdvance?: boolean;
    viewport?: { left: number; right: number; bottom: number; top: number };
    onGraphStatusChange?: (hasStudentGraph: boolean) => void;
    savedGraphState?: DesmosGraphState;
    onGraphStateChange?: (graphState: DesmosGraphState) => void;
};

export function getDesmosBlockId(pageId: string, blockIndex: number) {
    return `${pageId}-desmos-${blockIndex}`;
}

export function getRequiredDesmosBlockIndexes(
    blocks: Array<{ type: string; requireStudentGraphBeforeAdvance?: boolean }> | undefined,
) {
    if (!blocks) return [];

    return blocks
        .map((block, index) => ({ block, index }))
        .filter(
            (entry): entry is { block: { type: "desmos"; requireStudentGraphBeforeAdvance?: boolean }; index: number } =>
                entry.block.type === "desmos" && entry.block.requireStudentGraphBeforeAdvance === true,
        )
        .map((entry) => entry.index);
}

export function hasCompletedRequiredDesmosGraphing(
    requiredIndexes: number[],
    pageId: string,
    desmosGraphStatus: Record<string, boolean>,
) {
    return requiredIndexes.length === 0 || requiredIndexes.every((index) => Boolean(desmosGraphStatus[getDesmosBlockId(pageId, index)]));
}

function DesmosBlock({
    expressions,
    requireStudentGraphBeforeAdvance,
    viewport,
    onGraphStatusChange,
    savedGraphState,
    onGraphStateChange,
}: DesmosBlockProps) {
    const calculatorRef = useRef<HTMLDivElement | null>(null);
    const graphStatusCallbackRef = useRef(onGraphStatusChange);
    const graphStateCallbackRef = useRef(onGraphStateChange);
    const savedGraphStateRef = useRef(savedGraphState);
    const lastEmittedGraphStateRef = useRef<string | null>(null);

    useEffect(() => {
        graphStatusCallbackRef.current = onGraphStatusChange;
    }, [onGraphStatusChange]);

    useEffect(() => {
        graphStateCallbackRef.current = onGraphStateChange;
    }, [onGraphStateChange]);

    useEffect(() => {
        savedGraphStateRef.current = savedGraphState;
        try {
            lastEmittedGraphStateRef.current = savedGraphState ? JSON.stringify(savedGraphState) : null;
        } catch {
            lastEmittedGraphStateRef.current = null;
        }
    }, [savedGraphState]);

    useEffect(() => {
        let destroyed = false;
        let calculator:
            | {
                setExpression: (expression: { id: string; latex: string; label?: string; showLabel?: boolean }) => void;
                getExpressions: () => DesmosExpression[];
                observeEvent: (eventName: string, callback: () => void) => void;
                setMathBounds: (bounds: { left: number; right: number; bottom: number; top: number }) => void;
                setState: (state: DesmosGraphState) => void;
                getState: () => DesmosGraphState;
                destroy: () => void;
            }
            | null = null;

        const initializeCalculator = () => {
            if (destroyed || !calculatorRef.current || !window.Desmos?.GraphingCalculator) return;

            calculator = window.Desmos.GraphingCalculator(calculatorRef.current, {
                expressions: true,
                keypad: false,
            });

            if (savedGraphStateRef.current) {
                calculator.setState(savedGraphStateRef.current);
            } else {
                if (viewport) {
                    calculator.setMathBounds(viewport);
                }

                expressions.forEach((expression, index) => {
                    if (typeof expression === "string") {
                        calculator?.setExpression({ id: `exp-${index + 1}`, latex: expression });
                        return;
                    }

                    calculator?.setExpression({
                        id: `exp-${index + 1}`,
                        latex: expression.latex,
                        label: expression.label,
                        showLabel: expression.showLabel,
                    });
                });
            }

            const updateGraphStatus = () => {
                if (!calculator) return;
                const hasStudentGraph = calculator.getExpressions().some((expression) => {
                    if (typeof expression.latex !== "string") return false;
                    const normalizedLatex = expression.latex
                        .replace(/\\/g, "")
                        .replace(/[{}\s]/g, "")
                        .toLowerCase();
                    return normalizedLatex.includes("x^2+y^2=1");
                });
                graphStatusCallbackRef.current?.(hasStudentGraph);
            };

            const updateGraphState = () => {
                if (!calculator) return;

                const nextGraphState = calculator.getState();
                let serializedGraphState: string | null = null;

                try {
                    serializedGraphState = JSON.stringify(nextGraphState);
                } catch {
                    serializedGraphState = null;
                }

                if (serializedGraphState && serializedGraphState === lastEmittedGraphStateRef.current) return;

                lastEmittedGraphStateRef.current = serializedGraphState;
                graphStateCallbackRef.current?.(nextGraphState);
            };

            calculator.observeEvent("change", () => {
                if (requireStudentGraphBeforeAdvance) {
                    updateGraphStatus();
                }
                updateGraphState();
            });

            if (requireStudentGraphBeforeAdvance && graphStatusCallbackRef.current) {
                updateGraphStatus();
            }
            updateGraphState();
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
    }, [expressions, requireStudentGraphBeforeAdvance, viewport]);

    return <div ref={calculatorRef} style={{ width: "100%", height: 420, border: "1px solid #ddd", borderRadius: 8 }} />;
}

export default DesmosBlock;