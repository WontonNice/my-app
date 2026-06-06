import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type KatexExpressionProps = {
    expression: string;
    displayMode?: boolean;
};

type KatexModule = {
    render: (
        expression: string,
        element: HTMLElement,
        options?: {
            displayMode?: boolean;
            throwOnError?: boolean;
            strict?: "ignore" | "warn" | "error";
        },
    ) => void;
};

declare global {
    interface Window {
        katex?: KatexModule;
    }
}

const KATEX_CSS_ID = "katex-cdn-css";
const KATEX_SCRIPT_ID = "katex-cdn-script";
const KATEX_CSS_URL = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css";
const KATEX_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js";

let katexLoader: Promise<KatexModule> | null = null;

function loadKatexFromCdn(): Promise<KatexModule> {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("KaTeX cannot be loaded outside a browser environment."));
    }

    if (window.katex) {
        return Promise.resolve(window.katex);
    }

    if (katexLoader) {
        return katexLoader;
    }

    katexLoader = new Promise((resolve, reject) => {
        const existingCss = document.getElementById(KATEX_CSS_ID) as HTMLLinkElement | null;
        if (!existingCss) {
            const cssLink = document.createElement("link");
            cssLink.id = KATEX_CSS_ID;
            cssLink.rel = "stylesheet";
            cssLink.href = KATEX_CSS_URL;
            cssLink.crossOrigin = "anonymous";
            document.head.appendChild(cssLink);
        }

        const existingScript = document.getElementById(KATEX_SCRIPT_ID) as HTMLScriptElement | null;

        const resolveWhenReady = () => {
            if (window.katex) {
                resolve(window.katex);
            } else {
                reject(new Error("KaTeX script loaded but window.katex was not found."));
            }
        };

        if (existingScript) {
            if (window.katex) {
                resolveWhenReady();
            } else {
                existingScript.addEventListener("load", resolveWhenReady, { once: true });
                existingScript.addEventListener("error", () => reject(new Error("Failed to load KaTeX.")), { once: true });
            }
            return;
        }

        const script = document.createElement("script");
        script.id = KATEX_SCRIPT_ID;
        script.src = KATEX_SCRIPT_URL;
        script.defer = true;
        script.crossOrigin = "anonymous";
        script.onload = resolveWhenReady;
        script.onerror = () => reject(new Error("Failed to load KaTeX."));

        document.head.appendChild(script);
    });

    return katexLoader;
}

function KatexExpression({ expression, displayMode = true }: KatexExpressionProps) {
    const rootRef = useRef<HTMLDivElement | HTMLSpanElement | null>(null);

    const setRootRef = (element: HTMLDivElement | HTMLSpanElement | null) => {
        rootRef.current = element;
    };
    const [loadError, setLoadError] = useState<string | null>(null);

    const fallbackElement = useMemo(() => {
        if (displayMode) {
            return <pre>{expression}</pre>;
        }

        return <code>{expression}</code>;
    }, [displayMode, expression]);

    useEffect(() => {
        let cancelled = false;

        void loadKatexFromCdn()
            .then((katex) => {
                if (cancelled || !rootRef.current) return;

                katex.render(expression, rootRef.current, {
                    displayMode,
                    throwOnError: false,
                    strict: "warn",
                });
                setLoadError(null);
            })
            .catch((error) => {
                if (cancelled) return;
                const message = error instanceof Error ? error.message : "Could not render math expression.";
                setLoadError(message);
            });

        return () => {
            cancelled = true;
        };
    }, [displayMode, expression]);

    if (loadError) {
        return (
            <>
                {fallbackElement}
                <p aria-live="polite">{loadError}</p>
            </>
        );
    }

    if (displayMode) {
        return <div ref={setRootRef} />;
    }

    return <span ref={setRootRef} />;
}

export function renderTextWithInlineKatex(text: string): ReactNode {
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

export default KatexExpression;