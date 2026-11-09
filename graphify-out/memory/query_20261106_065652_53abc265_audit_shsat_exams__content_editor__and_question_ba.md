---
type: "query"
date: "2026-11-06T06:56:52.348122+00:00"
question: "Audit SHSAT exams, content editor, and question-bank synchronization"
contributor: "graphify"
outcome: "useful"
source_nodes: ["exportExamContent()", "content-studio.mjs"]
---

# Q: Audit SHSAT exams, content editor, and question-bank synchronization

## Answer

Expanded from graph vocabulary: exam content studio question bank standalone math sync export. Current source audit: 30 authored exams and 2895 question records. Found stale assessment summaries because export synchronized only standalone topics. tools/exam-catalog.cjs now derives all registered question summaries and validates per-exam IDs; content-studio saves export immediately; tools/question-catalog.cjs indexes existing records and audits editor membership and references. npm run content:sync:check is read-only. See docs/question-content-sync.md; source files supersede older graph line references.

## Outcome

- Signal: useful

## Source Nodes

- exportExamContent()
- content-studio.mjs