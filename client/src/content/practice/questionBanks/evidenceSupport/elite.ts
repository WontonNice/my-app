import type { PracticeQuestion } from "../../types";

export const evidenceSupportEliteQuestions: PracticeQuestion[] = [
  {
    id: "evidence-elite-1", difficulty: "elite", stimulus: "An editorial argues that extending library hours improves academic access for students with after-school responsibilities.",
    prompt: "Which evidence is most relevant and sufficient?",
    choices: [{ id: "A", text: "A librarian says evenings are quiet." }, { id: "B", text: "Attendance records show heavy evening use, and surveys identify work and caregiving as reasons students cannot visit earlier." }, { id: "C", text: "The library purchased new chairs last year." }, { id: "D", text: "Several nearby stores remain open late." }],
    correctChoiceId: "B", explanation: "It combines usage data with evidence connecting late visits to students' responsibilities.",
  },
];
