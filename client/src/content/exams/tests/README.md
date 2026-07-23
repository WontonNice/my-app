# Registered exams

Every assembled exam definition belongs in this folder. Shared passages, Part B stand-alone questions, and math
sections stay in their neighboring content-bank folders and are imported into these test files.
Each test's `passageSections` keeps Reading Comprehension shuffleable while passage-based Revising/Editing
Part A remains in its saved order. Revising/Editing Part B is the test's `standaloneSection`.

| Assessment ID | Test file | Title |
| --- | --- | --- |
| `2025-2026-form-a` | `formA2025_2026.ts` | 2025-2026 Form A |
| `shsat-diagnostic-1` | `shsatDiagnostic1.ts` | SHSAT Diagnostic 1 |

Each test must also be imported and registered in `../index.ts`, and it needs a matching assessment record
in the server assessment data so it appears on the teacher and student dashboards.
