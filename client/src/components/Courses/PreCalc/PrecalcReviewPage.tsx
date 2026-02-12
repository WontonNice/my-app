import { useMemo, useState } from "react";
import type { AuthUser } from "../../../authStorage";
import type { PrecalcLessonSummary } from "./precalcLessons";
import KatexExpression from "./Katex";

type PrecalcReviewPageProps = {
    authUser: AuthUser;
    lesson: PrecalcLessonSummary;
    onBack: () => void;
    onLogout: () => void;
};

type Quadrant = "I" | "II" | "III" | "IV";
type FunctionName = "sin" | "cos" | "tan" | "csc" | "sec" | "cot";
type SignType = "positive" | "negative";

type FunctionSignsByQuadrant = Record<Quadrant, { positive: FunctionName[]; negative: FunctionName[] }>;

type SpecialTrigRow = {
    angle: string;
    values: Record<FunctionName, string>;
};

const FUNCTION_NAMES: FunctionName[] = ["sin", "cos", "tan", "csc", "sec", "cot"];
const KATEX_SNIPPET_OPTIONS = [
    { label: "π", snippet: "\\pi" },
    { label: "fraction", snippet: "\\frac{}{}" },
    { label: "square root", snippet: "\\sqrt{}" },
    { label: "power", snippet: "^{}" },
    { label: "parentheses", snippet: "()" },
    { label: "minus", snippet: "-" },
];

const SPECIAL_TRIG_ROWS: SpecialTrigRow[] = [
    { angle: "0", values: { sin: "0", cos: "1", tan: "0", csc: "undefined", sec: "1", cot: "undefined" } },
    {
        angle: "π/6",
        values: { sin: "1/2", cos: "√3/2", tan: "√3/3", csc: "2", sec: "2√3/3", cot: "√3" },
    },
    { angle: "π/4", values: { sin: "√2/2", cos: "√2/2", tan: "1", csc: "√2", sec: "√2", cot: "1" } },
    {
        angle: "π/3",
        values: { sin: "√3/2", cos: "1/2", tan: "√3", csc: "2√3/3", sec: "2", cot: "√3/3" },
    },
    { angle: "π/2", values: { sin: "1", cos: "0", tan: "undefined", csc: "1", sec: "undefined", cot: "0" } },
    { angle: "π", values: { sin: "0", cos: "-1", tan: "0", csc: "undefined", sec: "-1", cot: "undefined" } },
    { angle: "3π/2", values: { sin: "-1", cos: "0", tan: "undefined", csc: "-1", sec: "undefined", cot: "0" } },
];

const EXPECTED_SIGNS: FunctionSignsByQuadrant = {
    I: { positive: ["sin", "cos", "tan", "csc", "sec", "cot"], negative: [] },
    II: { positive: ["sin", "csc"], negative: ["cos", "sec", "tan", "cot"] },
    III: { positive: ["tan", "cot"], negative: ["sin", "csc", "cos", "sec"] },
    IV: { positive: ["cos", "sec"], negative: ["sin", "csc", "tan", "cot"] },
};

function normalizeValue(value: string) {
    const trimmed = value.trim().toLowerCase();
    return trimmed
        .replace(/\s+/g, "")
        .replace(/π/g, "pi")
        .replace(/sqrt/g, "√")
        .replace(/\u221a/g, "√")
        .replace(/inf|infinity|undefined|undef|--|—/g, "undefined");
}

function normalizeQuadrantLabel(value: string) {
    return value.trim().toUpperCase().replace(/^Q/, "");
}

function getDraggedFunctionName(dataTransfer: DataTransfer): FunctionName | null {
    const rawPayload = dataTransfer.getData("application/json");
    if (rawPayload) {
        try {
            const parsedPayload = JSON.parse(rawPayload) as { functionName?: string };
            if (parsedPayload.functionName && FUNCTION_NAMES.includes(parsedPayload.functionName as FunctionName)) {
                return parsedPayload.functionName as FunctionName;
            }
        } catch {
            // Ignore malformed payload and fall back to plain text format.
        }
    }

    const droppedFunctionName = dataTransfer.getData("text/function-name") as FunctionName;
    return FUNCTION_NAMES.includes(droppedFunctionName) ? droppedFunctionName : null;
}

function PrecalcReviewPage({ authUser, lesson, onBack, onLogout }: PrecalcReviewPageProps) {
    const isTrigFunctionsRealNumbersReview = lesson.id === "chapter-5-trig-functions-real-numbers";
    const [page, setPage] = useState(0);
    const [tableAnswers, setTableAnswers] = useState<Record<string, string>>({});
    const [activeTableInputId, setActiveTableInputId] = useState<string | null>(null);
    const [tableChecked, setTableChecked] = useState(false);

    const [quadrantLabels, setQuadrantLabels] = useState<Record<Quadrant, string>>({ I: "", II: "", III: "", IV: "" });
    const [signAssignments, setSignAssignments] = useState<FunctionSignsByQuadrant>({
        I: { positive: [], negative: [] },
        II: { positive: [], negative: [] },
        III: { positive: [], negative: [] },
        IV: { positive: [], negative: [] },
    });
    const [signChecked, setSignChecked] = useState(false);

    const tableIsCorrect = useMemo(() => {
        return SPECIAL_TRIG_ROWS.every((row) =>
            FUNCTION_NAMES.every((funcName) => {
                const key = `${row.angle}:${funcName}`;
                const expected = normalizeValue(row.values[funcName]);
                const actual = normalizeValue(tableAnswers[key] || "");
                return expected === actual;
            }),
        );
    }, [tableAnswers]);

    const signReview = useMemo(() => {
        const labelsCorrect =
            normalizeQuadrantLabel(quadrantLabels.I) === "I" &&
            normalizeQuadrantLabel(quadrantLabels.II) === "II" &&
            normalizeQuadrantLabel(quadrantLabels.III) === "III" &&
            normalizeQuadrantLabel(quadrantLabels.IV) === "IV";

        const signsCorrect = (Object.keys(EXPECTED_SIGNS) as Quadrant[]).every((quadrant) => {
            const expectedPositive = [...EXPECTED_SIGNS[quadrant].positive].sort().join(",");
            const expectedNegative = [...EXPECTED_SIGNS[quadrant].negative].sort().join(",");

            const actualPositive = [...signAssignments[quadrant].positive].sort().join(",");
            const actualNegative = [...signAssignments[quadrant].negative].sort().join(",");

            return expectedPositive === actualPositive && expectedNegative === actualNegative;
        });

        return { labelsCorrect, signsCorrect, isCorrect: labelsCorrect && signsCorrect };
    }, [quadrantLabels, signAssignments]);

    const removeFunctionAssignment = (quadrant: Quadrant, signType: SignType, functionName: FunctionName) => {
        setSignAssignments((previous) => ({
            ...previous,
            [quadrant]: {
                positive:
                    signType === "positive"
                        ? previous[quadrant].positive.filter((name) => name !== functionName)
                        : previous[quadrant].positive,
                negative:
                    signType === "negative"
                        ? previous[quadrant].negative.filter((name) => name !== functionName)
                        : previous[quadrant].negative,
            },
        }));
    };

    const handleFunctionDrop = (quadrant: Quadrant, signType: SignType, droppedFunctionName: FunctionName) => {
        setSignAssignments((previous) => {
            const withoutFunctionEverywhere = (Object.keys(previous) as Quadrant[]).reduce<FunctionSignsByQuadrant>((accumulator, currentQuadrant) => {
                accumulator[currentQuadrant] = {
                    positive: previous[currentQuadrant].positive.filter((name) => name !== droppedFunctionName),
                    negative: previous[currentQuadrant].negative.filter((name) => name !== droppedFunctionName),
                };
                return accumulator;
            }, {
                I: { positive: [], negative: [] },
                II: { positive: [], negative: [] },
                III: { positive: [], negative: [] },
                IV: { positive: [], negative: [] },
            });

            return {
                ...withoutFunctionEverywhere,
                [quadrant]: {
                    positive:
                        signType === "positive"
                            ? [...withoutFunctionEverywhere[quadrant].positive, droppedFunctionName]
                            : withoutFunctionEverywhere[quadrant].positive,
                    negative:
                        signType === "negative"
                            ? [...withoutFunctionEverywhere[quadrant].negative, droppedFunctionName]
                            : withoutFunctionEverywhere[quadrant].negative,
                },
            };
        });
    };

    const insertSnippetIntoActiveInput = (snippet: string) => {
        if (!activeTableInputId) return;

        setTableAnswers((previous) => ({
            ...previous,
            [activeTableInputId]: `${previous[activeTableInputId] || ""}${snippet}`,
        }));
    };

    return (
        <>
            <h1>{lesson.title} Review</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>

            {page === 0 && (
                <section>
                    <h2>Page 1: Special Trig Values</h2>
                    <p>Fill in each value from memory, then check your table.</p>
                    {isTrigFunctionsRealNumbersReview && (
                        <>
                            <p style={{ marginTop: 0 }}>
                                You can enter answers with LaTeX-style math (examples: {"\\frac{\\sqrt{3}}{2}"}, {"\\pi/6"}).
                                Click any answer box first, then use a quick button to insert math symbols/templates.
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                                {KATEX_SNIPPET_OPTIONS.map((option) => (
                                    <button
                                        key={option.label}
                                        type="button"
                                        onClick={() => insertSnippetIntoActiveInput(option.snippet)}
                                        disabled={!activeTableInputId}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ borderCollapse: "collapse", minWidth: 860 }}>
                            <thead>
                                <tr>
                                    <th style={{ border: "1px solid #bbb", padding: 8 }}>t</th>
                                    {FUNCTION_NAMES.map((funcName) => (
                                        <th key={funcName} style={{ border: "1px solid #bbb", padding: 8 }}>
                                            {funcName} t
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {SPECIAL_TRIG_ROWS.map((row) => (
                                    <tr key={row.angle}>
                                        <th style={{ border: "1px solid #bbb", padding: 8 }}>{row.angle}</th>
                                        {FUNCTION_NAMES.map((funcName) => {
                                            const inputId = `${row.angle}:${funcName}`;

                                            return (
                                                <td key={inputId} style={{ border: "1px solid #bbb", padding: 8 }}>
                                                    <div style={{ display: "grid", gap: 6 }}>
                                                        <input
                                                            value={tableAnswers[inputId] || ""}
                                                            onFocus={() => setActiveTableInputId(inputId)}
                                                            onClick={() => setActiveTableInputId(inputId)}
                                                            onChange={(event) =>
                                                                setTableAnswers((previous) => ({
                                                                    ...previous,
                                                                    [inputId]: event.target.value,
                                                                }))
                                                            }
                                                            style={{ width: 92 }}
                                                        />
                                                        {isTrigFunctionsRealNumbersReview && tableAnswers[inputId] && (
                                                            <div style={{ minHeight: 24 }}>
                                                                <KatexExpression expression={tableAnswers[inputId]} displayMode={false} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button type="button" onClick={() => setTableChecked(true)}>
                            Check table
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setTableAnswers({});
                                setActiveTableInputId(null);
                                setTableChecked(false);
                            }}
                        >
                            Reset table
                        </button>
                        <button type="button" onClick={() => setPage(1)}>
                            Next page
                        </button>
                    </div>
                    {tableChecked && <p aria-live="polite">{tableIsCorrect ? "Great work — table is correct." : "Keep going — some entries are not correct yet."}</p>}
                </section>
            )}

            {page === 1 && (
                <section>
                    <h2>Page 2: Signs by Quadrant</h2>
                    <p>Label each quadrant and drag each function into Positive or Negative for that quadrant.</p>

                    <div style={{ marginBottom: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {FUNCTION_NAMES.map((funcName) => (
                            <div
                                key={funcName}
                                draggable
                                onDragStart={(event) => {
                                    event.dataTransfer.setData("text/function-name", funcName);
                                }}
                                style={{ border: "1px solid #777", borderRadius: 999, padding: "6px 10px", cursor: "grab" }}
                            >
                                {funcName}
                            </div>
                        ))}
                    </div>

                    <div
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            const rawPayload = event.dataTransfer.getData("application/json");
                            if (!rawPayload) return;

                            try {
                                const parsedPayload = JSON.parse(rawPayload) as {
                                    sourceQuadrant?: Quadrant;
                                    sourceSignType?: SignType;
                                    functionName?: FunctionName;
                                };

                                if (
                                    parsedPayload.sourceQuadrant &&
                                    parsedPayload.sourceSignType &&
                                    parsedPayload.functionName &&
                                    FUNCTION_NAMES.includes(parsedPayload.functionName)
                                ) {
                                    removeFunctionAssignment(
                                        parsedPayload.sourceQuadrant,
                                        parsedPayload.sourceSignType,
                                        parsedPayload.functionName,
                                    );
                                }
                            } catch {
                                // Ignore malformed payload.
                            }
                        }}
                        style={{
                            border: "1px dashed #777",
                            borderRadius: 8,
                            padding: 10,
                            marginBottom: 12,
                            background: "#fafafa",
                        }}
                    >
                        Drag here to remove a function from a quadrant if you make a mistake.
                    </div>

                    <div style={{ border: "1px solid #bbb", borderRadius: 8, padding: 16, marginBottom: 12 }}>
                        <div style={{ textAlign: "center", fontWeight: 600, marginBottom: 8 }}>Unit Circle Quadrants</div>
                        <div style={{ width: 240, height: 240, margin: "0 auto", position: "relative", border: "2px solid #555", borderRadius: "50%" }}>
                            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 2, background: "#555", transform: "translateX(-50%)" }} />
                            <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: "#555", transform: "translateY(-50%)" }} />
                            <input
                                aria-label="Quadrant I label"
                                placeholder="I"
                                value={quadrantLabels.I}
                                onChange={(event) => setQuadrantLabels((previous) => ({ ...previous, I: event.target.value }))}
                                style={{ position: "absolute", top: 32, right: 38, width: 44, textAlign: "center" }}
                            />
                            <input
                                aria-label="Quadrant II label"
                                placeholder="II"
                                value={quadrantLabels.II}
                                onChange={(event) => setQuadrantLabels((previous) => ({ ...previous, II: event.target.value }))}
                                style={{ position: "absolute", top: 32, left: 38, width: 44, textAlign: "center" }}
                            />
                            <input
                                aria-label="Quadrant III label"
                                placeholder="III"
                                value={quadrantLabels.III}
                                onChange={(event) => setQuadrantLabels((previous) => ({ ...previous, III: event.target.value }))}
                                style={{ position: "absolute", bottom: 32, left: 38, width: 44, textAlign: "center" }}
                            />
                            <input
                                aria-label="Quadrant IV label"
                                placeholder="IV"
                                value={quadrantLabels.IV}
                                onChange={(event) => setQuadrantLabels((previous) => ({ ...previous, IV: event.target.value }))}
                                style={{ position: "absolute", bottom: 32, right: 38, width: 44, textAlign: "center" }}
                            />
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(280px, 1fr))", gap: 12 }}>
                        {(Object.keys(signAssignments) as Quadrant[]).map((quadrant) => (
                            <section key={quadrant} style={{ border: "1px solid #bbb", borderRadius: 8, padding: 10 }}>
                                <h3 style={{ marginTop: 0 }}>Quadrant {quadrant}</h3>
                                {(["positive", "negative"] as const).map((signType) => (
                                    <div
                                        key={`${quadrant}-${signType}`}
                                        onDragOver={(event) => event.preventDefault()}
                                        onDrop={(event) => {
                                            event.preventDefault();
                                            const droppedFunctionName = getDraggedFunctionName(event.dataTransfer);
                                            if (droppedFunctionName) {
                                                handleFunctionDrop(quadrant, signType, droppedFunctionName);
                                            }
                                        }}
                                        style={{
                                            border: "1px dashed #777",
                                            borderRadius: 8,
                                            padding: 8,
                                            minHeight: 70,
                                            marginBottom: 8,
                                            background: signType === "positive" ? "#f4fff3" : "#fff4f4",
                                        }}
                                    >
                                        <strong style={{ textTransform: "capitalize" }}>{signType}</strong>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                                            {signAssignments[quadrant][signType].map((funcName) => (
                                                <div
                                                    key={`${quadrant}-${signType}-${funcName}`}
                                                    draggable
                                                    onDragStart={(event) => {
                                                        event.dataTransfer.setData("application/json", JSON.stringify({
                                                            sourceQuadrant: quadrant,
                                                            sourceSignType: signType,
                                                            functionName: funcName,
                                                        }));
                                                        event.dataTransfer.setData("text/function-name", funcName);
                                                    }}
                                                    style={{
                                                        border: "1px solid #777",
                                                        borderRadius: 999,
                                                        padding: "3px 8px",
                                                        background: "#fff",
                                                        cursor: "grab",
                                                    }}
                                                >
                                                    {funcName}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                        <button type="button" onClick={() => setPage(0)}>
                            Previous page
                        </button>
                        <button type="button" onClick={() => setSignChecked(true)}>
                            Check review
                        </button>
                    </div>
                    {signChecked && (
                        <p aria-live="polite">
                            {signReview.isCorrect
                                ? "Excellent — all quadrant labels and function signs are correct."
                                : "Not quite yet. Make sure each quadrant label is correct and all six functions are placed correctly in Positive/Negative."}
                        </p>
                    )}
                </section>
            )}

            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
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

export default PrecalcReviewPage;