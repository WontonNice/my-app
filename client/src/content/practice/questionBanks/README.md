# Adaptive practice question banks

Each topic owns one folder. Questions are split by difficulty so the banks can grow without turning into oversized files.

```text
questionBanks/
  authorsPointOfView/
    easy.ts
    medium.ts
    hard.ts
    elite.ts
    index.ts
```

Add new questions directly to the matching difficulty file. Keep every question `id` unique across the entire practice system. The topic `index.ts` combines all four levels for the existing quiz interface; page-level code should import the topic folder, not an individual difficulty file.

## Paste-friendly question editor

From the repository root, run:

```bash
npm run question-editor
```

The local editor opens in your browser. Choose the topic and difficulty, paste the passage, question, four answers, correct-answer explanation, and three wrong-answer explanations, then preview and write. It validates required fields and duplicate IDs before appending a `PracticeQuestion` to the selected `.ts` file.

For an all-at-once paste, use the editor's labeled template:

```text
PASSAGE:
...
QUESTION:
...
A: ...
B: ...
C: ...
D: ...
CORRECT: B
EXPLANATION:
...
WRONG A:
...
WRONG C:
...
WRONG D:
...
```
