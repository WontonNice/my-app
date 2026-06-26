import type { User } from "@supabase/supabase-js";
import type { TeacherAssessment } from "./api";

export type ExamSectionLine = {
  label: string;
  questionCount: number;
};

export const shsatSectionTemplate: ExamSectionLine[] = [
  { label: "General Directions", questionCount: 0 },
  { label: "ELA - Passage Set 1 of 7", questionCount: 7 },
  { label: "ELA - Passage Set 2 of 7", questionCount: 6 },
  { label: "ELA - Passage Set 3 of 7", questionCount: 6 },
  { label: "ELA - Passage Set 4 of 7", questionCount: 9 },
  { label: "ELA - Passage Set 5 of 7", questionCount: 7 },
  { label: "ELA - Passage Set 6 of 7", questionCount: 7 },
  { label: "ELA - Passage Set 7 of 7", questionCount: 5 },
  { label: "ELA - Stand alone items", questionCount: 3 },
  { label: "Math", questionCount: 50 },
];

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
    return shsatSectionTemplate;
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
