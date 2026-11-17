import { mapConcurrent } from "./mapConcurrent";
import { supabase } from "./supabase";

/**
 * Exam copies ("snapshots") saved inside exam results, kept in memory by content hash.
 *
 * A saved result embeds the exam it was taken on, and many results share the same copy.
 * The hash comes from the database (student_exam_result_summaries.snapshot_hash), so one
 * hash always means one content: an entry never goes stale and is safe to keep.
 */
type Snapshot = { content: object; json: string };

const maxSnapshots = 400;
const byHash = new Map<string, Snapshot>();
const byContent = new WeakMap<object, { hash: string; json: string }>();

function remember(hash: string, content: object) {
    const snapshot = { content, json: JSON.stringify(content) };
    byHash.set(hash, snapshot);
    byContent.set(content, { hash, json: snapshot.json });
    // Map keeps insertion order, so the first key is the least recently added or used.
    while (byHash.size > maxSnapshots) byHash.delete(byHash.keys().next().value as string);
    return snapshot;
}

function recall(hash: string) {
    const snapshot = byHash.get(hash);
    if (snapshot) { byHash.delete(hash); byHash.set(hash, snapshot); }
    return snapshot;
}

/** The hash and serialized form of a copy handed out by this store, if it is one. */
export function sharedExamSnapshot(content: unknown) {
    return content && typeof content === "object" ? byContent.get(content) : undefined;
}

/**
 * Returns the copy for every requested hash, fetching the ones not yet in memory.
 * `rowIdByHash` names one result row that carries each copy. The hash and the copy are read
 * from the same row in one query, so they always belong together. Returns null when a copy
 * cannot be read under its hash (the row changed meanwhile, or the view is unavailable);
 * callers then read complete rows instead.
 */
export async function resolveExamSnapshots(rowIdByHash: Map<string, string>): Promise<Map<string, object> | null> {
    const resolved = new Map<string, object>();
    const missingIds: string[] = [];
    for (const [hash, rowId] of rowIdByHash) {
        const known = recall(hash);
        if (known) resolved.set(hash, known.content);
        else missingIds.push(rowId);
    }
    // A copy is 0.1 to 1 MB; six per request keeps each response small.
    const batches = Array.from({ length: Math.ceil(missingIds.length / 6) }, (_, i) => missingIds.slice(i * 6, i * 6 + 6));
    const pages = await mapConcurrent(batches, 2, async batch => {
        const page = await supabase.from("student_exam_result_summaries").select("snapshot_hash,snapshot").in("id", batch);
        return page.error ? null : page.data as { snapshot_hash: unknown; snapshot: unknown }[];
    });
    if (pages.some(page => page === null)) return null;
    for (const row of pages.flat()) {
        if (!row || typeof row.snapshot_hash !== "string" || !row.snapshot || typeof row.snapshot !== "object") continue;
        if (rowIdByHash.has(row.snapshot_hash)) resolved.set(row.snapshot_hash, remember(row.snapshot_hash, row.snapshot).content);
    }
    return [...rowIdByHash.keys()].every(hash => resolved.has(hash)) ? resolved : null;
}

/**
 * Serializes the roster with each distinct exam copy written once. A result keeps the hash of
 * its copy in `analysisContentRef` and the copies travel in `examSnapshots`; the client puts
 * them back. Copies that did not come from this store stay inline.
 */
export function stringifyWithSharedExamSnapshots(students: { progress: { examResults: Record<string, unknown>[] } }[]) {
    const used = new Map<string, string>();
    const light = students.map(student => ({
        ...student,
        progress: {
            ...student.progress,
            examResults: student.progress.examResults.map(result => {
                const shared = sharedExamSnapshot(result.analysisContent);
                if (!shared) return result;
                used.set(shared.hash, shared.json);
                return { ...result, analysisContent: undefined, analysisContentRef: shared.hash };
            }),
        },
    }));
    const snapshots = [...used].map(([hash, json]) => `${JSON.stringify(hash)}:${json}`).join(",");
    return `{"students":${JSON.stringify(light)},"examSnapshots":{${snapshots}}}`;
}

/** For tests: forget every stored copy. */
export function clearExamSnapshots() {
    byHash.clear();
}
