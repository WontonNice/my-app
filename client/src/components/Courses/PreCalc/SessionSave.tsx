export type LessonSessionProgress = {
    pageIndex: number;
    questionAnswers: Record<string, { x: string; y: string }>;
    visibleHints: Record<string, boolean>;
    questionResults: Record<string, { isCorrect: boolean; submitted: boolean }>;
    desmosGraphStatus: Record<string, boolean>;
    desmosGraphStates: Record<string, Record<string, unknown>>;
};

export function createLessonProgressStorageKey(username: string, lessonFilePath: string) {
    return `precalc-lesson-progress:${username}:${lessonFilePath}`;
}

export function readLessonProgressFromStorage(
    storageKey: string,
    maxPageIndex: number,
): LessonSessionProgress | null {
    const savedProgressRaw = window.localStorage.getItem(storageKey);
    if (!savedProgressRaw) return null;

    try {
        const parsed = toLessonSessionProgress(JSON.parse(savedProgressRaw));
        if (!parsed) return null;

        return {
            ...parsed,
            pageIndex: Math.min(parsed.pageIndex, maxPageIndex),
        };
    } catch {
        return null;
    }
}

export function writeLessonProgressToStorage(storageKey: string, progress: LessonSessionProgress) {
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
}

function toLessonSessionProgress(value: unknown): LessonSessionProgress | null {
    if (!value || typeof value !== "object") return null;

    const candidate = value as Partial<LessonSessionProgress>;

    const pageIndex =
        typeof candidate.pageIndex === "number" && Number.isInteger(candidate.pageIndex) && candidate.pageIndex >= 0
            ? candidate.pageIndex
            : 0;

    const questionAnswers =
        candidate.questionAnswers && typeof candidate.questionAnswers === "object"
            ? Object.entries(candidate.questionAnswers).reduce<Record<string, { x: string; y: string }>>(
                (accumulator, [questionId, answer]) => {
                    if (!answer || typeof answer !== "object") return accumulator;

                    const answerCandidate = answer as { x?: unknown; y?: unknown };
                    accumulator[questionId] = {
                        x: typeof answerCandidate.x === "string" ? answerCandidate.x : "",
                        y: typeof answerCandidate.y === "string" ? answerCandidate.y : "",
                    };

                    return accumulator;
                },
                {},
            )
            : {};

    const visibleHints =
        candidate.visibleHints && typeof candidate.visibleHints === "object"
            ? Object.entries(candidate.visibleHints).reduce<Record<string, boolean>>((accumulator, [questionId, isVisible]) => {
                accumulator[questionId] = isVisible === true;
                return accumulator;
            }, {})
            : {};

    const questionResults =
        candidate.questionResults && typeof candidate.questionResults === "object"
            ? Object.entries(candidate.questionResults).reduce<Record<string, { isCorrect: boolean; submitted: boolean }>>(
                (accumulator, [questionId, questionResult]) => {
                    if (!questionResult || typeof questionResult !== "object") return accumulator;

                    const resultCandidate = questionResult as { isCorrect?: unknown; submitted?: unknown };
                    accumulator[questionId] = {
                        isCorrect: resultCandidate.isCorrect === true,
                        submitted: resultCandidate.submitted === true,
                    };

                    return accumulator;
                },
                {},
            )
            : {};

    const desmosGraphStatus =
        candidate.desmosGraphStatus && typeof candidate.desmosGraphStatus === "object"
            ? Object.entries(candidate.desmosGraphStatus).reduce<Record<string, boolean>>((accumulator, [blockId, isComplete]) => {
                accumulator[blockId] = isComplete === true;
                return accumulator;
            }, {})
            : {};

    const desmosGraphStates =
        candidate.desmosGraphStates && typeof candidate.desmosGraphStates === "object"
            ? Object.entries(candidate.desmosGraphStates).reduce<Record<string, Record<string, unknown>>>(
                (accumulator, [blockId, graphState]) => {
                    if (graphState && typeof graphState === "object") {
                        accumulator[blockId] = graphState as Record<string, unknown>;
                    }
                    return accumulator;
                },
                {},
            )
            : {};

    return { pageIndex, questionAnswers, visibleHints, questionResults, desmosGraphStatus, desmosGraphStates };
}
