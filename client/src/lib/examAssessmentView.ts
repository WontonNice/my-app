import { getStudentAssessment, getTeacherExamReentry } from "./api";

/** Teacher previews must load the selected student's permission, not the teacher's. */
export async function getExamAssessmentForView(accessToken: string, assessmentId: string, previewStudentId = "") {
  const assessment = await getStudentAssessment(accessToken, assessmentId);
  if (!previewStudentId) return assessment;
  const { grant } = await getTeacherExamReentry(accessToken, assessmentId, previewStudentId);
  if (!grant?.remainingSections.length || grant.revokedAt) return { ...assessment, reentry: undefined };
  return {
    ...assessment,
    status: "open" as const,
    reentry: grant,
    resumeContent: undefined,
    canEditSubmittedSections: false,
    sectionAccess: { english: grant.remainingSections.includes("english"), math: grant.remainingSections.includes("math") },
  };
}
