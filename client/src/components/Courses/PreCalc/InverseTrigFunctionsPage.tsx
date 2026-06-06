import { useMemo, useState } from "react";
import type { AuthUser } from "../../../authStorage";

type InverseTrigFunctionsPageProps = {
    authUser: AuthUser;
    onBack: () => void;
    onLogout: () => void;
};

type InverseTrigFunction = "arcsin" | "arccos" | "arctan";

type InverseTrigPrompt = {
    valueLabel: string;
    answerLabel: string;
};

type Problem = {
    id: number;
    functionName: InverseTrigFunction;
    valueLabel: string;
    answerLabel: string;
};

const INVERSE_TRIG_VALUES: Record<InverseTrigFunction, InverseTrigPrompt[]> = {
    arcsin: [
        { valueLabel: "-1", answerLabel: "-π/2" },
        { valueLabel: "-√3/2", answerLabel: "-π/3" },
        { valueLabel: "-√2/2", answerLabel: "-π/4" },
        { valueLabel: "-1/2", answerLabel: "-π/6" },
        { valueLabel: "0", answerLabel: "0" },
        { valueLabel: "1/2", answerLabel: "π/6" },
        { valueLabel: "√2/2", answerLabel: "π/4" },
        { valueLabel: "√3/2", answerLabel: "π/3" },
        { valueLabel: "1", answerLabel: "π/2" },
    ],
    arccos: [
        { valueLabel: "-1", answerLabel: "π" },
        { valueLabel: "-√3/2", answerLabel: "5π/6" },
        { valueLabel: "-√2/2", answerLabel: "3π/4" },
        { valueLabel: "-1/2", answerLabel: "2π/3" },
        { valueLabel: "0", answerLabel: "π/2" },
        { valueLabel: "1/2", answerLabel: "π/3" },
        { valueLabel: "√2/2", answerLabel: "π/4" },
        { valueLabel: "√3/2", answerLabel: "π/6" },
        { valueLabel: "1", answerLabel: "0" },
    ],
    arctan: [
        { valueLabel: "-√3", answerLabel: "-π/3" },
        { valueLabel: "-1", answerLabel: "-π/4" },
        { valueLabel: "-√3/3", answerLabel: "-π/6" },
        { valueLabel: "0", answerLabel: "0" },
        { valueLabel: "√3/3", answerLabel: "π/6" },
        { valueLabel: "1", answerLabel: "π/4" },
        { valueLabel: "√3", answerLabel: "π/3" },
    ],
};

const INVERSE_TRIG_FUNCTIONS: InverseTrigFunction[] = ["arcsin", "arccos", "arctan"];

function buildProblem(id: number): Problem {
    const functionName = INVERSE_TRIG_FUNCTIONS[Math.floor(Math.random() * INVERSE_TRIG_FUNCTIONS.length)];
    const prompts = INVERSE_TRIG_VALUES[functionName];
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    return {
        id,
        functionName,
        valueLabel: selectedPrompt.valueLabel,
        answerLabel: selectedPrompt.answerLabel,
    };
}

function InverseTrigFunctionsPage({ authUser, onBack, onLogout }: InverseTrigFunctionsPageProps) {
    const [problemId, setProblemId] = useState(1);
    const [showAnswer, setShowAnswer] = useState(false);

    const problem = useMemo(() => buildProblem(problemId), [problemId]);

    return (
        <>
            <h1>Inverse Trigonometric Functions</h1>
            <p>Welcome, {authUser.firstName || authUser.username}</p>

            <section style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, marginBottom: 16, maxWidth: 600 }}>
                <h2 style={{ marginTop: 0 }}>Practice Generator</h2>
                <p style={{ marginBottom: 8 }}>
                    Problem #{problem.id}: Find <strong>{problem.functionName}({problem.valueLabel})</strong>.
                </p>
                <p style={{ marginTop: 0, marginBottom: 8 }}>
                    Give the principal value in radians.
                </p>
                {showAnswer ? (
                    <p style={{ marginTop: 0 }}>
                        Answer: <strong>{problem.answerLabel}</strong>
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

export default InverseTrigFunctionsPage;