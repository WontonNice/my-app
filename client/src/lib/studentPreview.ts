export type StudentPreviewContext = {
  isPreview: boolean;
  mode: "" | "student" | "teacher";
  query: string;
  returnHref: string;
  studentId: string;
  studentName: string;
};

const previewKeys = ["preview", "teacherTools", "studentId", "studentName", "returnTo"] as const;

export function getStudentPreviewContext(search = window.location.search): StudentPreviewContext {
  const source = new URLSearchParams(search);
  const requestedMode = source.get("preview");
  const mode = requestedMode === "student" || requestedMode === "teacher" ? requestedMode : "";
  const isPreview = Boolean(mode) && source.get("teacherTools") === "1";
  if (!isPreview) {
    return { isPreview: false, mode: "", query: "", returnHref: "/teacher", studentId: "", studentName: "" };
  }

  const previewParams = new URLSearchParams();
  previewKeys.forEach((key) => {
    const value = source.get(key);
    if (value) previewParams.set(key, value);
  });

  const requestedReturnHref = source.get("returnTo") ?? "";
  return {
    isPreview: true,
    mode,
    query: `?${previewParams.toString()}`,
    returnHref: requestedReturnHref.startsWith("/teacher") ? requestedReturnHref : "/teacher",
    studentId: source.get("studentId") ?? "",
    studentName: source.get("studentName") ?? "",
  };
}

export function appendStudentPreview(path: string, context = getStudentPreviewContext()) {
  if (!context.isPreview) return path;
  const url = new URL(path, window.location.origin);
  const previewParams = new URLSearchParams(context.query);
  previewKeys.forEach((key) => {
    const value = previewParams.get(key);
    if (value) url.searchParams.set(key, value);
  });
  return `${url.pathname}${url.search}${url.hash}`;
}
