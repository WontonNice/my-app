import { supabase } from "./supabase";

export type ProgressRow = Record<string, unknown>;
export type ProgressRows = { data: ProgressRow[] | null; error: { code?: string } | null };
const legacySchemaErrors = new Set(["42P01", "42703", "PGRST204", "PGRST205"]);

// Load each table once per roster batch, rather than four requests per student.
// Pagination prevents Supabase's row cap from silently dropping saved work.
async function loadRows(table: string, columns: string, key: string, ids: string[]): Promise<ProgressRows> {
    const rows: ProgressRow[] = [];
    for (let offset = 0; offset < ids.length; offset += 100) {
        for (let start = 0; ; start += 500) {
            const result = await supabase.from(table).select(`user_id,${columns}`)
                .in("user_id", ids.slice(offset, offset + 100))
                .order("user_id").order(key).range(start, start + 499);
            if (result.error) {
                // Existing deployments may still use metadata/legacy session storage.
                if (legacySchemaErrors.has(result.error.code)) return { data: null, error: result.error };
                throw Object.assign(new Error("Student progress is temporarily unavailable. Please try again."), { status: 503 });
            }
            const page = (result.data ?? []) as unknown as ProgressRow[];
            rows.push(...page);
            if (page.length < 500) break;
        }
    }
    return { data: rows, error: null };
}

export async function loadStudentProgressRows(ids: string[]) {
    const [exams, practice, sessions] = await Promise.all([
        loadRows("student_exam_results", "assessment_id,result", "assessment_id", ids),
        loadRows("student_practice_progress", "topic_slug,progress", "topic_slug", ids),
        loadRows("student_exam_sessions", "assessment_id,answers,completed_sections,status,updated_at,submitted_at,navigation", "assessment_id", ids),
    ]);
    const index = (result: ProgressRows) => {
        const byUser = new Map<string, ProgressRow[]>();
        for (const row of result.data ?? []) {
            if (typeof row.user_id !== "string") continue;
            const records = byUser.get(row.user_id) ?? [];
            records.push(row);
            byUser.set(row.user_id, records);
        }
        return (id: string): ProgressRows => ({ data: byUser.get(id) ?? [], error: result.error });
    };
    return { exams: index(exams), practice: index(practice), sessions: index(sessions) };
}
