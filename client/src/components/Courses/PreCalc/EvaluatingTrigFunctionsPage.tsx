import { useMemo, useState } from "react";
import type { AuthUser } from "../../../authStorage";

type EvaluatingTrigFunctionsPageProps = {
    authUser: AuthUser;
    onBack: () => void;
    onLogout: () => void;
};

type TrigFunction = "sin" | "cos" | "tan";

type Problem = {
    id: number;
    angleLabel: string;
    radians: number;
    trigFunction: TrigFunction;
    answer: string;
};

const ANGLES = [
    { label: "0", radians: 0 },
    { label: "π/6", radians: Math.PI / 6 },
    { label: "π/4", radians: Math.PI / 4 },
    { label: "π/3", radians: Math.PI / 3 },
    { label: "π/2", radians: Math.PI / 2 },
    { label: "2π/3", radians: (2 * Math.PI) / 3 },
    { label: "3π/4", radians: (3 * Math.PI) / 4 },
    { label: "5π/6", radians: (5 * Math.PI) / 6 },
    { label: "π", radians: Math.PI },
    { label: "7π/6", radians: (7 * Math.PI) / 6 },
    { label: "5π/4", radians: (5 * Math.PI) / 4 },
    { label: "4π/3", radians: (4 * Math.PI) / 3 },
    { label: "3π/2", radians: (3 * Math.PI) / 2 },
    { label: "5π/3", radians: (5 * Math.PI) / 3 },
    { label: "7π/4", radians: (7 * Math.PI) / 4 },
    { label: "11π/6", radians: (11 * Math.PI) / 6 },
];

const TRIG_FUNCTIONS: TrigFunction[] = ["sin", "cos", "tan"];

function simplifyValue(value: number) {
    if (!Number.isFinite(value)) return "undefined";

    const rounded = Math.round(value * 1000000) / 1000000;

    if (Math.abs(rounded) < 0.000001) return "0";
    if (Math.abs(rounded - 1) < 0.000001) return "1";
    if (Math.abs(rounded + 1) < 0.000001) return "-1";

    const sqrt2Over2 = Math.SQRT1_2;
    const sqrt3Over2 = Math.sqrt(3) / 2;

    if (Math.abs(rounded - 0.5) < 0.000001) return "1/2";
    if (Math.abs(rounded + 0.5) < 0.000001) return "-1/2";
    if (Math.abs(rounded - sqrt2Over2) < 0.000001) return "√2/2";
    if (Math.abs(rounded + sqrt2Over2) < 0.000001) return "-√2/2";
    if (Math.abs(rounded - sqrt3Over2) < 0.000001) return "√3/2";
    if (Math.abs(rounded + sqrt3Over2) < 0.000001) return "-√3/2";
    if (Math.abs(rounded - Math.sqrt(3)) < 0.000001) return "√3";
    if (Math.abs(rounded + Math.sqrt(3)) < 0.000001) return "-√3";
    if (Math.abs(rounded - 1 / Math.sqrt(3)) < 0.000001) return "√3/3";
    if (Math.abs(rounded + 1 / Math.sqrt(3)) < 0.000001) return "-√3/3";

    return rounded.toString();
}

function buildProblem(id: number): Problem {
    const angle = ANGLES[Math.floor(Math.random() * ANGLES.length)];
    const trigFunction = TRIG_FUNCTIONS[Math.floor(Math.random() * TRIG_FUNCTIONS.length)];

    const cosineAtAngle = Math.cos(angle.radians);
    const isTangentUndefined = trigFunction === "tan" && Math.abs(cosineAtAngle) < 0.000001;

    const rawAnswer =
        isTangentUndefined
            ? Number.POSITIVE_INFINITY
            : trigFunction === "sin"
                ? Math.sin(angle.radians)
                : trigFunction === "cos"
                    ? Math.cos(angle.radians)
                    : Math.tan(angle.radians);

    return {
        id,
        angleLabel: angle.label,
        radians: angle.radians,
        trigFunction,
        answer: simplifyValue(rawAnswer),
    };
}

function EvaluatingTrigFunctionsPage({ authUser, onBack, onLogout }: EvaluatingTrigFunctionsPageProps) {
    const [problemId, setProblemId] = useState(1);
    const [showAnswer, setShowAnswer] = useState(false);

    const problem = useMemo(() => buildProblem(problemId), [problemId]);

    return (
        <>
            <h1>Evaluating Trigonometric Functions</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>

            <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16, maxWidth: 600 }}>
                <h2 style={{ marginTop: 0 }}>Practice Generator</h2>
                <p style={{ marginBottom: 8 }}>
                    Problem #{problem.id}: Find <strong>{problem.trigFunction}({problem.angleLabel})</strong>.
                </p>
                {showAnswer ? (
                    <p style={{ marginTop: 0 }}>
                        Answer: <strong>{problem.answer}</strong>
                    </p>
                ) : (
                    <p style={{ marginTop: 0 }}>Click “Show Answer” when ready.</p>
                )}

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => setShowAnswer(true)}>
                        Show Answer
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setProblemId((currentProblemId) => currentProblemId + 1);
                            setShowAnswer(false);
                        }}
                    >
                        Generate
                    </button>
                </div>
            </section>

            <div style={{ display: "flex", gap: 8 }}>
                <button type="button" onClick={onBack}>
                    Back to Precalculus Home
                </button>
                <button type="button" onClick={onLogout}>
                    Logout
                </button>
            </div>
        </>
    );
}

export default EvaluatingTrigFunctionsPage;