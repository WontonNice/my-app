import { resolveExamSnapshots } from "./examSnapshotStore";
import { mapConcurrent } from "./mapConcurrent";
import { supabase } from "./supabase";

export type ProgressRow = Record<string, unknown>;
export type ProgressRows = { data: ProgressRow[] | null; error: { code?: string } | null };
const legacySchemaErrors = new Set(["42P01", "42703", "PGRST204", "PGRST205"]);

type LoadShape = { studentsPerRequest: number; rowsPerPage: number; concurrency: number };
// Small rows: one request per 100 students keeps the query count low.
const lightRows: LoadShape = { studentsPerRequest: 100, rowsPerPage: 500, concurrency: 2 };
// An exam result embeds a full copy of the exam it was taken on, so one row can exceed 1 MB.
// A whole class in one response grew past the database client's 8-second request limit.
// Small batches keep every response well below it; the database, not the network, sets the
// total time, so more than two requests at once only makes each one slower.
// Used only when the summaries view is unavailable; see loadExamRows.
const completeExamResultRows: LoadShape = { studentsPerRequest: 6, rowsPerPage: 20, concurrency: 2 };

// Load each table once per roster batch, rather than four requests per student.
// Pagination prevents Supabase's row cap from silently dropping saved work.
async function loadRows(table: string, columns: string, key: string, ids: string[], shape: LoadShape): Promise<ProgressRows> {
    const batches = Array.from({ length: Math.ceil(ids.length / shape.studentsPerRequest) },
        (_, i) => ids.slice(i * shape.studentsPerRequest, (i + 1) * shape.studentsPerRequest));
    const results = await mapConcurrent(batches, shape.concurrency, async batch => {
        const rows: ProgressRow[] = [];
        for (let start = 0; ; start += shape.rowsPerPage) {
            const result = await supabase.from(table).select(`user_id,${columns}`)
                .in("user_id", batch)
                .order("user_id").order(key).range(start, start + shape.rowsPerPage - 1);
            if (result.error) {
                // Existing deployments may still use metadata/legacy session storage.
                if (legacySchemaErrors.has(result.error.code)) return { data: null, error: result.error };
                throw Object.assign(new Error("Student progress is temporarily unavailable. Please try again."), { status: 503 });
            }
            const page = (result.data ?? []) as unknown as ProgressRow[];
            rows.push(...page);
            if (page.length < shape.rowsPerPage) break;
        }
        return { data: rows, error: null };
    });
    const failure = results.find(result => result.error);
    return failure ?? { data: results.flatMap(result => result.data ?? []), error: null };
}

function loadCompleteExamRows(ids: string[]) {
    return loadRows("student_exam_results", "assessment_id,result", "assessment_id", ids, completeExamResultRows);
}

// The summaries view returns each result without its exam copy, plus the copy's hash. Many
// results share a copy, so each distinct one is read once and then kept in memory. The rows
// returned here have their copy attached again and look exactly like complete rows.
async function loadExamRows(ids: string[]): Promise<ProgressRows> {
    const summaries = await loadRows("student_exam_result_summaries", "id,assessment_id,result,snapshot_hash", "assessment_id", ids, lightRows);
    if (summaries.error) return loadCompleteExamRows(ids);
    const rows = summaries.data ?? [];
    const rowIdByHash = new Map<string, string>();
    for (const row of rows) {
        if (typeof row.snapshot_hash === "string" && typeof row.id === "string" && !rowIdByHash.has(row.snapshot_hash)) rowIdByHash.set(row.snapshot_hash, row.id);
    }
    const snapshots = await resolveExamSnapshots(rowIdByHash).catch(() => null);
    // Never return a result that lost its copy: read complete rows if any copy is unaccounted for.
    if (!snapshots || rows.some(row => typeof row.snapshot_hash === "string" && !snapshots.has(row.snapshot_hash))) return loadCompleteExamRows(ids);
    return {
        data: rows.map(({ id: _id, snapshot_hash: hash, ...row }) => {
            const snapshot = typeof hash === "string" ? snapshots.get(hash) : undefined;
            return snapshot ? { ...row, result: { ...(row.result as Record<string, unknown>), analysisContent: snapshot } } : row;
        }),
        error: null,
    };
}

export async function loadStudentProgressRows(ids: string[]) {
    const [exams, practice, sessions] = await Promise.all([
        loadExamRows(ids),
        loadRows("student_practice_progress", "topic_slug,progress", "topic_slug", ids, lightRows),
        loadRows("student_exam_sessions", "assessment_id,answers,completed_sections,status,updated_at,submitted_at,navigation", "assessment_id", ids, lightRows),
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
