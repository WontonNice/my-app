export type Classroom = {
    code: string;
    description: string;
    id: string;
    level: string;
    name: string;
    schedule: string;
};

export type PublicClassroom = Omit<Classroom, "code">;

const classrooms: Classroom[] = [
    {
        code: "SHSAT",
        description: "SHSAT prep room for lessons, practice missions, assessments, and progress checks.",
        id: "shsat",
        level: "Entrance exam prep",
        name: "SHSAT",
        schedule: "Study Hall",
    },
];

export function normalizeClassroomCode(code: string) {
    return code.trim().replace(/\s+/g, "").toUpperCase();
}

export function findClassroomByCode(code: string) {
    const normalizedCode = normalizeClassroomCode(code);

    return classrooms.find((classroom) => normalizeClassroomCode(classroom.code) === normalizedCode);
}

export function getPublicClassrooms(classIds: string[]): PublicClassroom[] {
    const allowedClassIds = new Set(classIds);

    return classrooms
        .filter((classroom) => allowedClassIds.has(classroom.id))
        .map(({ code: _code, ...classroom }) => classroom);
}
