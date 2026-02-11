import { useState } from "react";

function UnitCircleSpecialTriangleReview() {
    const [animationSeed, setAnimationSeed] = useState(0);

    return (
        <section
            style={{
                border: "1px solid #d0d7de",
                borderRadius: 10,
                padding: 16,
                margin: "16px 0",
                background: "#f8fafc",
            }}
        >
            <h3>Review: Special Triangles 45°/45°/90°</h3>
            <p>Start with a square of side length 1. Click to animate a diagonal cut and form two congruent right triangles.</p>
            <button type="button" onClick={() => setAnimationSeed((previous) => previous + 1)}>
                Cut the square diagonally
            </button>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
                <svg viewBox="0 0 260 220" width="320" aria-label="Square cut diagonally into two 45-45-90 triangles">
                    <style>
                        {`
                          .diag-line {
                            stroke-dasharray: 200;
                            stroke-dashoffset: 200;
                            animation: diagonal-cut 900ms ease-out forwards;
                          }
                          @keyframes diagonal-cut {
                            from { stroke-dashoffset: 200; }
                            to { stroke-dashoffset: 0; }
                          }
                        `}
                    </style>
                    <rect x="30" y="30" width="160" height="160" fill="#ffffff" stroke="#334155" strokeWidth="2" rx="4" />
                    <path d="M 30 30 L 190 190" className="diag-line" key={animationSeed} stroke="#0ea5e9" strokeWidth="4" fill="none" />

                    <path d="M 42 45 L 42 65 L 62 65" fill="none" stroke="#111827" strokeWidth="2" />

                    <text x="105" y="24" textAnchor="middle" fontSize="15" fill="#1f2937">1</text>
                    <text x="14" y="114" textAnchor="middle" fontSize="15" fill="#1f2937">1</text>
                    <text x="66" y="113" textAnchor="middle" fontSize="13" fill="#1f2937">45°</text>
                    <text x="150" y="170" textAnchor="middle" fontSize="13" fill="#1f2937">45°</text>
                    <text x="170" y="98" textAnchor="middle" fontSize="13" fill="#1f2937">90°</text>
                </svg>
            </div>

            <p><strong>Your turn:</strong> fill in every angle and side length on both triangles.</p>
            <p>Reminder: use the Pythagorean Theorem and that triangle angles add to 180°.</p>
        </section>
    );
}

export default UnitCircleSpecialTriangleReview;