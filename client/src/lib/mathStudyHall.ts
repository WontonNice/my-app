import taxonomy from "../../../tools/math-topics.json";

// Include every managed topic, even before it has published resources.
export const mathStudyCategories = taxonomy.categories;

export function mathStudyHref(category?: string, topic?: string) {
  const query = new URLSearchParams({ subject: "math" });
  if (category) query.set("category", category);
  if (category && topic) query.set("topic", topic);
  return `/study-hall/shsat/materials?${query}`;
}
