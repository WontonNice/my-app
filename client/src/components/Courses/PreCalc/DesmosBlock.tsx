import { useEffect, useRef } from "react";

declare global {
    interface Window {
        Desmos?: {
            GraphingCalculator: (
                elt: HTMLElement,
                options?: { expressions?: boolean; keypad?: boolean; settingsMenu?: boolean },
            ) => {
                setExpression: (expression: { id: string; latex: string; label?: string; showLabel?: boolean }) => void;
                getExpressions: () => Array<{ latex?: string }>;
                observeEvent: (eventName: string, callback: () => void) => void;
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
    onGraphStatusChange?: (hasStudentGraph: boolean) => void;
};

function DesmosBlock({ expressions, requireStudentGraphBeforeAdvance, onGraphStatusChange }: DesmosBlockProps) {
    const calculatorRef = useRef<HTMLDivElement | null>(null);
    const graphStatusCallbackRef = useRef(onGraphStatusChange);

    useEffect(() => {
        graphStatusCallbackRef.current = onGraphStatusChange;
    }, [onGraphStatusChange]);

    useEffect(() => {
        let destroyed = false;
        let calculator:
            | {
                setExpression: (expression: { id: string; latex: string; label?: string; showLabel?: boolean }) => void;
                getExpressions: () => Array<{ latex?: string }>;
                observeEvent: (eventName: string, callback: () => void) => void;
                destroy: () => void;
            }
            | null = null;

        const initializeCalculator = () => {
            if (destroyed || !calculatorRef.current || !window.Desmos?.GraphingCalculator) return;

            calculator = window.Desmos.GraphingCalculator(calculatorRef.current, {
                expressions: true,
                keypad: false,
            });

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

            if (requireStudentGraphBeforeAdvance && graphStatusCallbackRef.current) {
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

                calculator.observeEvent("change", updateGraphStatus);
                updateGraphStatus();
            }
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
    }, [expressions, requireStudentGraphBeforeAdvance]);

    return <div ref={calculatorRef} style={{ width: "100%", height: 420, border: "1px solid #ddd", borderRadius: 8 }} />;
}

export default DesmosBlock;