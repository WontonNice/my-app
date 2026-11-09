export type DashboardResourceState = { status: "loading" | "ready" | "error"; error?: string };

export function teacherWorkspaceResources(workspace: string, insight = false): ("accounts" | "requests" | "assessments" | "students")[] {
  if (workspace === "accounts") return ["accounts"];
  if (workspace === "enrollment") return ["requests"];
  if (workspace === "assessments" && !insight) return ["assessments"];
  if (["overview", "students", "assessments"].includes(workspace)) return ["assessments", "students"];
  return workspace === "boards" ? ["students"] : [];
}

// Publish each successful response immediately, even if a sibling request fails.
export async function loadDashboardResource<T>(
  load: () => Promise<T>,
  publish: (data: T) => void,
  update: (state: DashboardResourceState) => void,
) {
  update({ status: "loading" });
  try {
    publish(await load());
    update({ status: "ready" });
  } catch (error) {
    update({ status: "error", error: error instanceof Error ? error.message : "Could not load this section. Please try again." });
  }
}
