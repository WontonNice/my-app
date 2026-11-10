import { contentHasCompleted, type ContentInventory } from './passageOrganization';
import type { PriorContentActivity } from './learningPlan';

export type PassageEncounter = {
  version: ContentInventory[number]['content'];
  activity?: PriorContentActivity;
  at: string | null;
  score: { correct: number; total: number } | null;
  source: string;
  related: boolean;
};

export function passageEncounters(versions: ContentInventory): PassageEncounter[] {
  return versions.flatMap(row => {
    const evidence = [...new Map((row.evidence ?? []).map(activity => [
      JSON.stringify([activity.reference, activity.assessmentId, activity.at, activity.source, activity.coverage, activity.correct, activity.total]), activity,
    ])).values()];
    const entries: PassageEncounter[] = evidence.map(activity => ({
      version: row.content, activity, at: activity.at, related: activity.coverage === 'related',
      source: activity.source, score: validScore(activity) ? {correct: activity.correct!, total: activity.total!} : null,
    }));
    if (!entries.length && (contentHasCompleted(row) || ['In progress', 'Awaiting review'].includes(row.status))) {
      entries.push({version: row.content, at: row.latestScore?.at ?? row.lastCompletedAt ?? null,
        score: validScore(row.latestScore) ? row.latestScore! : null, related: false,
        source: contentHasCompleted(row) ? 'Latest recorded completion' : row.status});
    }
    return entries;
  }).sort((a,b) => timestamp(b.at) - timestamp(a.at) || a.version.id.localeCompare(b.version.id));
}

function timestamp(value: string | null) { const time = Date.parse(value ?? ''); return Number.isFinite(time) ? time : -Infinity; }
function validScore(value: {correct?: number; total?: number} | null | undefined) {
  return !!value && typeof value.correct === 'number' && Number.isFinite(value.correct) && typeof value.total === 'number' && Number.isFinite(value.total) && value.total > 0 && value.correct >= 0 && value.correct <= value.total;
}
