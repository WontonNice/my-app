export type PrecalcLessonSummary = {
    id: string;
    chapter: string;
    title: string;
    filePath: string;
};

export const PRECALC_LESSONS: PrecalcLessonSummary[] = [
    {
        id: "chapter-5-unit-circle",
        chapter: "Chapter 5",
        title: "The Unit Circle",
        filePath: "precalc/chapter-5/unit-circle.json",
    },
    {
        id: "chapter-5-trig-functions-real-numbers",
        chapter: "Chapter 5",
        title: "Trigonometric Functions of Real Numbers",
        filePath: "precalc/chapter-5/trig-functions-real-numbers.json",
    },
    {
        id: "chapter-5-trigonometric-graphs",
        chapter: "Chapter 5",
        title: "Trigonometric Graphs",
        filePath: "precalc/chapter-5/trigonometric-graphs.json",
    },
    {
        id: "chapter-5-more-trigonometric-graphs",
        chapter: "Chapter 5",
        title: "More Trigonometric Graphs",
        filePath: "precalc/chapter-5/more-trigonometric-graphs.json",
    },
    {
        id: "chapter-5-inverse-trigonometric-functions",
        chapter: "Chapter 5",
        title: "Inverse Trigonometric Functions and Their Graphs",
        filePath: "precalc/chapter-5/inverse-trigonometric-functions.json",
    },
    {
        id: "chapter-5-modeling-harmonic-motion",
        chapter: "Chapter 5",
        title: "Modeling Harmonic Motion",
        filePath: "precalc/chapter-5/modeling-harmonic-motion.json",
    },
];

export const PRECALC_LESSONS_BY_ID = new Map(PRECALC_LESSONS.map((lesson) => [lesson.id, lesson]));