import type { User } from "@supabase/supabase-js";
import { resolveExamContent } from "../content/exams";
import type { TeacherAssessment } from "./api";

export type ExamSectionLine = {
  label: string;
  questionCount: number;
};

export function getAssessmentIdFromPath(pathname: string) {
  return pathname.split("/").filter(Boolean)[1] ?? "";
}

export function getDisplayName(user: User | null) {
  const metadataName = user?.user_metadata.full_name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  if (user?.email) {
    return user.email.split("@")[0];
  }

  return "Student";
}

export function formatDuration(minutes: number) {
  if (minutes >= 60 && minutes % 60 === 0) {
    const hours = minutes / 60;
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} ${hours === 1 ? "hour" : "hours"} and ${remainingMinutes} minutes`;
  }

  return `${minutes} minutes`;
}

export function createAssessmentSectionLines(assessment: TeacherAssessment) {
  if (assessment.classId === "shsat") {
    const content = resolveExamContent(assessment);
    const sections: ExamSectionLine[] = [
      { label: "General Directions", questionCount: 0 },
      ...content.passageSets.map((passage, index) => ({
        label: `ELA - Passage Set ${index + 1} of ${content.passageSets.length}`,
        questionCount: passage.questions.length,
      })),
    ];
    if (content.standaloneSection?.questions.length) {
      sections.push({ label: "ELA - Revising/Editing Part B", questionCount: content.standaloneSection.questions.length });
    }
    if (content.mathSection?.questions.length) {
      sections.push({ label: "Math", questionCount: content.mathSection.questions.length });
    }
    return sections;
  }

  const passageSections = assessment.passages.map((passage, index) => ({
    label: passage.title || `Passage Set ${index + 1}`,
    questionCount: Math.max(1, Math.ceil(assessment.questions.length / Math.max(1, assessment.passages.length))),
  }));

  return [
    { label: "General Directions", questionCount: 0 },
    ...passageSections,
    { label: "Mixed Questions", questionCount: assessment.questions.length },
  ];
}
