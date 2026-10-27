# Nathan Tutors

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Nathan Tutors supports SHSAT, PSAT, and SAT preparation and AP classes. SHSAT is one part of the product; future work must account for the broader scope.

## Users

The existing application provides student, teacher, staff, and admin experiences. Primary audience priorities across programs are undecided.

## Operating Context

Repository evidence: the student portal includes practice, assignments, assessments, corrections, materials, and progress tracking. Teacher tools support instruction and content management; staff and admin tools support operations. These describe existing implementation, not a confirmed priority order for future work.

## Capabilities and Constraints

- The existing application uses React, Vite, TypeScript, Express, and Supabase.
- SHSAT workflows are implemented in `client/src/App.tsx` and the student and teacher pages under `client/src/pages/`.
- PSAT, SAT, and AP classes are confirmed product scope. Their intended workflows, AP subjects, and implementation coverage remain to be established; do not assume SHSAT workflows apply unchanged.
- Required workflows, terminology, accessibility requirements, and other binding design constraints are undecided.

## Positioning

Undecided. Do not invent differentiators, outcome guarantees, or proof claims.

## Brand Commitments

The existing product name is Nathan Tutors. Further brand commitments and voice requirements are undecided.

## Evidence on Hand

- `README.md`: application setup, authentication, roles, and operational documentation.
- `client/src/App.tsx`: existing routes and application boundaries.
- `client/src/content/`: existing educational content.
- `docs/`: documentation for implemented learning and classroom tools.
- `client/index.html`: existing metadata mentions personalized math and computer science tutoring; its current relevance to the broader product scope has not been confirmed.

Product priorities, success measures, and evidence for marketing claims remain open decisions.
