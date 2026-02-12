export type PrecalcLessonSummary = {
    id: string;
    chapter: string;
    title: string;
    paths: {
        learn: string;
        review: string;
        study: string;
    };
};

function createModulePaths(chapterPath: string, moduleFileName: string) {
    return {
        learn: `precalc/${chapterPath}/${moduleFileName}.json`,
        review: `precalc/${chapterPath}/${moduleFileName}.review.json`,
        study: `precalc/${chapterPath}/${moduleFileName}.study.json`,
    };
}

export const PRECALC_LESSONS: PrecalcLessonSummary[] = [
    {
        id: "chapter-5-unit-circle",
        chapter: "Chapter 5",
        title: "The Unit Circle",
        paths: createModulePaths("chapter-5", "unit-circle"),
    },
    {
        id: "chapter-5-trig-functions-real-numbers",
        chapter: "Chapter 5",
        title: "Trigonometric Functions of Real Numbers",
        paths: createModulePaths("chapter-5", "trig-functions-real-numbers"),
    },
    {
        id: "chapter-5-trigonometric-graphs",
        chapter: "Chapter 5",
        title: "Trigonometric Graphs",
        paths: createModulePaths("chapter-5", "trigonometric-graphs"),
    },
    {
        id: "chapter-5-more-trigonometric-graphs",
        chapter: "Chapter 5",
        title: "More Trigonometric Graphs",
        paths: createModulePaths("chapter-5", "more-trigonometric-graphs"),
    },
    {
        id: "chapter-5-inverse-trigonometric-functions",
        chapter: "Chapter 5",
        title: "Inverse Trigonometric Functions and Their Graphs",
        paths: createModulePaths("chapter-5", "inverse-trigonometric-functions"),
    },
    {
        id: "chapter-5-modeling-harmonic-motion",
        chapter: "Chapter 5",
        title: "Modeling Harmonic Motion",
        paths: createModulePaths("chapter-5", "modeling-harmonic-motion"),
    },
];

export const PRECALC_LESSONS_BY_ID = new Map(PRECALC_LESSONS.map((lesson) => [lesson.id, lesson]));