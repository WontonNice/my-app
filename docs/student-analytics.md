# Student analytics workstation

The existing Student Progress route, roster fetch, paper-score API, grading, saved responses, sessions, and practice workflows remain in place. The selected student's record now uses `StudentAnalyticsWorkstation`; calculations live in `studentAnalytics.ts`.

## Data inventory

| Field | Availability | Source / limitations |
| --- | --- | --- |
| Overall / correct / tested / date / source | Available for stored results | Existing result records; section-only submissions do not become completed tests. Invalid dates are excluded from progression. |
| English / Math | Partial | Stored subject breakdowns, or existing grading fallback. Missing sections show no score, not zero. |
| Exact response / correct answer / skill / passage / interaction type | Partial | Saved answer map plus matching current exam content and existing shared grader. Summary-only paper records have no response evidence. |
| Skill summaries without responses | Partial | Stored subject topic totals, falling back to stored topic totals. Their evidence coverage is shown; incorrect versus unanswered is unknown. |
| Timing | Partial | Only finite stored per-question timings. Never estimated. |
| Explanation / question image / passage format | Partial | Existing content renderer; shown only when authored. |
| Response-change history / flagged status / difficulty | Unavailable in this snapshot | Not presented or inferred. |
| Weighted per-question points | Not used by existing result grading | Counts are labeled correct / tested, rather than invented weighted points. |

## Calculations and limits

- Overall and section averages are arithmetic means of measured assessment percentages. Missing measurements are excluded. Existing stored overall scores are not overwritten.
- First-to-latest progression requires dated records with equal question totals and, for overall progression, equal English/Math totals. Section trends compare that section's totals. Equal totals do not establish equal test difficulty; the chart explicitly warns about this limitation.
- Recent overall = last up to three compatible assessments. Its change is shown only with six compatible assessments, comparing two nonoverlapping three-test windows.
- Skill accuracy = correct / tested questions. Recent skill accuracy pools the last up to three dated assessments testing that skill; change compares the preceding up to three, when available. Blank responses lower accuracy but have their own status.
- Targets require accuracy below 75%, five or more tested questions, and two or more assessments. Sort by lowest accuracy, then most missed questions. Strengths require at least 80% with the same sample minimum. Smaller samples are labeled limited data.
- Clicking a skill includes all available response evidence, not only incorrect answers. A coverage count explains summary records with no answer-level evidence. Passage/type summaries use individual evidence only.
- Response grading uses current matching content; if content was edited after submission, reconstructed question statuses may differ from immutable stored totals. The interface labels this limitation.
- When a section's current question count differs from its stored total, only explicitly saved response IDs are shown for that section. Missing IDs are not invented as historical unanswered questions. Deleted questions without matching content cannot be reconstructed.
- Recent mistakes exclude undated records; all such responses remain accessible in the question table. Filters paginate forty responses, with pagination reset when criteria/order change. Aggregation is memoized and does not issue per-question requests.

## Verification

- `node --test server/tests/student-analytics.test.cjs server/tests/exam-review.test.cjs server/tests/exam-presentation.test.cjs`
- `npm run typecheck`, `npm run lint:client`, `npm run build`
- Isolated visual fixture: `node tools/preview-student-analytics.cjs`, then open `http://127.0.0.1:4323`. `/legacy` bundles the original dashboard from Git HEAD for the same-viewport comparison. Fictional QA records are never written to student storage; the paper-save callback is a no-op.
- Browser checks cover zero/one/two/many records, mixed/paper/digital, missing English/Math, correct/incorrect/unanswered filters, skill/assessment/passage/type drill-down, pagination, question modal, comparison, existing paper form, and individual analytics.
- At 1440 × 1000, the fixture overview shows five assessment rows and six skill rows together with progression and focus areas. The original view reaches only two assessment entries and has no longitudinal overview. Fixture page height falls from 3,877px to 1,511px (about 61%); this is a local fixture comparison, not a guarantee for all records.
- At 390px wide, the statistics become two columns, panels stack, tables scroll within their containers, and the document has no horizontal overflow.

Live production account mutations, deployment, and live authentication were not exercised. Existing paper API/grading regression tests verify the server workflow without altering student accounts.
