export type MathStudyCategory = {label:string;topics:string[]};

export function mathStudyHref(category?: string, topic?: string) {
  const query = new URLSearchParams({ subject: "math" });
  if (category) query.set("category", category);
  if (category && topic) query.set("topic", topic);
  return `/study-hall/shsat/materials?${query}`;
}
