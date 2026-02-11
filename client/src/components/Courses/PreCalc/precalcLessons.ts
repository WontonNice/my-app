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
        title: "Unit Circles",
        filePath: "precalc/chapter-5/unit-circle.json",
    },
];