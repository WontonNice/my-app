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
