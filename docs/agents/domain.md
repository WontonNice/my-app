# Domain Docs

## Layout

Use one shared glossary and architecture decision directory for this SHSAT application's client and server:

- GLOSSARY.md at the repository root.
- docs/adr/ for architecture decision records.

## Before exploring

Read GLOSSARY.md if it exists, and the ADRs relevant to the area being changed. Also consult the existing PRODUCT.md and DESIGN.md when relevant.

If the glossary or ADR files do not exist, proceed silently. Domain-modeling creates them when terms or decisions are resolved; setup does not create empty placeholders.

Use the glossary's established terminology in issues, designs, code and tests. Reconsider new terminology or note a gap for domain-modeling.

If a proposal conflicts with an existing ADR, identify that conflict explicitly and explain the proposed change.

