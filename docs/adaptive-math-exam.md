# Adaptive Math Exam

Students open **Assessments → Adaptive Math Exam** (`/study-hall/shsat/assessments/adaptive-math`). It is always available to SHSAT students and does not need to be opened or assigned by a teacher. A teacher previewing the student portal gets a device-only copy that never touches a student's record.

## What students see

- The exam runs in the same player as other math sections. Questions are multiple choice, with some type-in answers, and there is no time limit.
- **Exam mode** (the default) gives no feedback while working. **Practice mode** shows whether the answer was right, the correct answer, and a worked solution when the student presses Next; pressing Next again moves on. The switch is on the start screen and in the exam toolbar, and it can be changed at any time.
- **I don't know — skip** counts the question as missed, so a student does not have to guess.
- **Finish and see report** shows questions answered, percent correct, topics mastered, time spent, topics to focus on, a topic-by-topic report, and the 20 most recent missed questions with solutions. **Continue exam** picks up where the student left off. **Start over** clears the topic progress after confirmation.

## How it adapts

The exam tracks the 26 topics in the shared math taxonomy (`tools/math-topics.json`). Each topic has several question types at three difficulty levels.

- A new topic starts at the standard level. A correct answer raises the level; a miss lowers it and is followed straight away by one easier question on the same topic.
- A running mastery estimate (Bayesian knowledge tracing) weighs each answer by difficulty and by how easy the answer would be to guess. A typed-in answer counts for more than a multiple-choice one.
- A topic is **mastered** after correct answers in a row that include harder questions: two for a student who gets the standard and challenge questions right, more after a miss. The exam then leaves that topic alone except for an occasional spot check, and a missed spot check reopens it.
- A missed topic is marked **needs practice** and keeps coming back until it is mastered. No topic is asked more than twice in a row.
- Until every topic has been tried once, about half of the questions go to untested topics so weak areas are found early. After that, every question goes to a topic that is not yet mastered.

A student who knows everything finishes in about 52 to 60 questions, close to one SHSAT math section. Engine thresholds are in `server/src/shared/adaptiveMath/engine.ts`.

## Questions

Question types live in `server/src/shared/adaptiveMath/` (`arithmetic.ts`, `ratios.ts`, `algebra.ts`, `geometry.ts`, `statistics.ts`, `foundations.ts`) and are assembled per topic in `topics.ts`, which also reuses practice generators that are already enabled for students. Every question type draws its numbers from a seeded random stream, so the same exam seed and index always rebuild the same question for resume and review. To add a question type, add a `family(...)` to the right file and list it under its topic; keep at least two question types per level in every topic.

## Saving

Progress is saved in the browser after every action and copied to the student's account through `GET`/`PUT /api/infinite-practice/adaptive-exam`. The account copy is stored in `math_practice_checkpoints` under the reserved module ID `__adaptive__:math-v1`, so no migration is needed. The copy with more answers wins a sync, and a restarted exam replaces the old one. A new exam cannot be started until the account copy has been checked, so a second device never replaces saved progress. Teachers and admins can read a student's exam with `GET /api/infinite-practice/adaptive-exam?studentId=<id>`; there is no teacher screen for it yet.

## Checks

Run `npm run test:adaptive-exam` for question validity (every question type, 250 variants each), grading, topic coverage, and the adaptive behavior. `npm run preview:adaptive-exam` starts a fictional student with in-memory account storage at `http://127.0.0.1:4336/study-hall/shsat/assessments`; `/qa/seed?count=75` loads a sample exam in progress and `/qa/figures` shows the generated figures.
