/** Private planning data. Never part of ExamQuestion or student content. */
export type TeacherLabel = { id: string; name: string; description: string };
export type TeacherQuestionNote = { labelIds: string[]; favorite: boolean; note: string; updatedAt: string };
export type TeacherLabels = { revision: string; labels: TeacherLabel[]; questions: Record<string, TeacherQuestionNote> };
export const emptyTeacherQuestion = (): TeacherQuestionNote => ({ labelIds: [], favorite: false, note: '', updatedAt: '' });
