import type { ExamContent, ExamSource } from "../../../server/src/shared/examTypes";
import type { Evidence, SkillMetric } from "./studentAnalytics";

export const SKILL_AREAS = [
  { value: "reading", label: "Reading comprehension" },
  { value: "editing", label: "Revising / editing" },
  { value: "math", label: "Math question types" },
  { value: "unclassified", label: "Unclassified" },
] as const;
export type SkillArea = typeof SKILL_AREAS[number]["value"];
export type ContentSource = "official" | "prestige" | "other" | "unknown";
const editingTopics = new Set(["sentence structure", "pronouns", "verbs", "modifiers", "punctuation", "word choice & precision", "topic & transitions", "relevance & conclusion"]);
const readingTopics = new Set(["central idea & theme", "author's point of view", "word & phrase meaning", "figurative language & imagery", "tone & mood", "text structure & purpose", "evidence & support", "inference", "supporting evidence", "vocabulary in context", "text structure"]);

export function topicArea(section: string, topic: string): SkillArea {
  if (section === "math") return "math";
  if (section !== "english") return "unclassified";
  const key = topic.trim().toLowerCase();
  return editingTopics.has(key) ? "editing" : readingTopics.has(key) ? "reading" : "unclassified";
}
export function evidenceArea(row: Pick<Evidence, "section" | "question" | "skillArea">): SkillArea {
  return row.skillArea ?? topicArea(row.section, row.question.topic ?? "");
}
export function metricArea(skill: SkillMetric): SkillArea {
  const areas = new Set(skill.evidence.map(evidenceArea));
  return areas.size === 1 ? [...areas][0] : topicArea(skill.section, skill.label);
}
function explicitSource(source?: ExamSource): ContentSource | undefined {
  const family = source?.sourceFamily?.toLowerCase();
  return family === "official_shsat" ? "official" : family?.includes("prestige") ? "prestige" : undefined;
}
function categorySource(category?: string): ContentSource | undefined {
  return category === "official_handbook" ? "official" : category === "prestige" ? "prestige" : category === "miscellaneous" ? "other" : undefined;
}
/** Retain question provenance; inherit a publisher only when the exam's tagged passages agree. */
export function contentScope(content?: ExamContent) {
  const areas = new Map<string, SkillArea>();
  const sources = new Map<string, ContentSource>();
  const taggedSources = new Set<ContentSource>();
  for (const set of content?.passageSets ?? []) {
    const section = content?.passageSections?.[set.id] ?? set.section;
    const source = explicitSource(set.passage.source) ?? categorySource(set.passage.passageCategory);
    if (source) taggedSources.add(source);
    for (const question of set.questions) {
      const questionSection = question.source?.section;
      if (questionSection === "reading" || questionSection === "revising_editing_a") areas.set(question.id, questionSection === "reading" ? "reading" : "editing");
      else if (section) areas.set(question.id, section === "reading" ? "reading" : "editing");
      const publisher = explicitSource(question.source) ?? source;
      if (publisher) sources.set(question.id, publisher);
    }
  }
  const standalone = content?.standaloneSection;
  if (standalone && /revis|edit|grammar/i.test(`${standalone.label} ${standalone.directions?.title}`)) {
    for (const question of standalone.questions) areas.set(question.id, "editing");
  }
  const fallback = explicitSource(content?.source) ?? (taggedSources.size === 1 ? [...taggedSources][0] : undefined);
  return { areas, source: (row: Pick<Evidence, "question" | "passage">): ContentSource => explicitSource(row.question.source) ?? sources.get(row.question.id) ?? explicitSource(row.passage?.source) ?? categorySource(row.passage?.passageCategory) ?? fallback ?? (row.question.source || content?.source ? "other" : "unknown") };
}
export function matchesContentSource(row: Pick<Evidence, "contentSource" | "passage" | "question">, filter: string) {
  const source = row.contentSource ?? explicitSource(row.question.source) ?? categorySource(row.passage?.passageCategory) ?? "unknown";
  return !filter || filter === "all" || (filter === "official_prestige" ? source === "official" || source === "prestige" : source === filter);
}
