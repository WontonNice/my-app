---
name: Nathan Tutors — Learning Room and classroom meals
description: Recorded visual vocabulary of the existing student portal and shared classroom meal controls.
colors:
  student-ink: "#24382f"
  student-green: "#1f4a3a"
  student-green-2: "#2e7257"
  student-cream: "#f4f0e7"
  student-paper: "#fffdf8"
  student-line: "#ddd6ca"
  student-muted: "#6e756f"
  student-gold: "#f2c66d"
  meal-primary: "#245239"
  meal-primary-hover: "#183d29"
  meal-paper: "#fffefa"
  meal-ink: "#24392e"
  meal-border: "#b8c6b9"
  meal-notice: "#e9eee5"
  white: "#ffffff"
typography:
  student-headline:
    fontFamily: "Georgia, Times New Roman, serif"
    fontSize: "clamp(32px, 4vw, 46px)"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  meal-headline:
    fontFamily: "Georgia, serif"
    fontSize: "clamp(30px, 4vw, 42px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  meal-title:
    fontFamily: "Georgia, serif"
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.25
  student-intro:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
  meal-control:
    fontSize: "14px"
  meal-field:
    fontSize: "15px"
rounded:
  field: "7px"
  control: "8px"
  student-card: "12px"
  meal-card: "14px"
spacing:
  small: "12px"
  medium: "16px"
  large: "24px"
  column: "36px"
components:
  meal-button-primary:
    backgroundColor: "{colors.meal-primary}"
    textColor: "{colors.white}"
    typography: "{typography.meal-control}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  meal-button-primary-hover:
    backgroundColor: "{colors.meal-primary-hover}"
  meal-button-secondary:
    backgroundColor: "{colors.meal-paper}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  meal-field:
    backgroundColor: "{colors.meal-paper}"
    textColor: "{colors.meal-ink}"
    typography: "{typography.meal-field}"
    rounded: "{rounded.field}"
    padding: "11px 12px"
  meal-summary:
    backgroundColor: "{colors.meal-paper}"
    rounded: "{rounded.meal-card}"
    padding: "24px"
---

# Design System: Nathan Tutors — Learning Room and classroom meals

## Overview

**Creative North Star: "The Learning Room"**

This name comes from the existing student navigation, not a new brand workshop. Warm paper, dark green navigation, serif headings, compact sans-serif controls, and quiet dividers define the sampled student experience. This record describes the built overview, results, and shared meal controls; it does not establish a global design system for all Nathan Tutors products.

The teacher meal page keeps the incumbent navy dashboard shell and its cooler canvas. Authentication keeps its separate Instrument Serif/DM Sans scenery composition. Neither is migrated to the student shell by this document. Product-wide audience priorities and brand commitments beyond the Nathan Tutors name remain undecided in PRODUCT.md.

**Key Characteristics:**

- Green navigation and paper surfaces in the student portal.
- Serif page and section headings beside compact sans-serif controls.
- Flat, divided lists and gently rounded functional surfaces.
- Shared meal controls inside each role's existing shell.

## Colors

The student palette pairs muted greens with warm paper; meal controls use closely related local colors already present in their stylesheet.

### Primary

- **Student green:** navigation background; **student green 2:** active navigation marker and supporting links.
- **Meal primary:** submission buttons and the Wonton meal link; its darker hover variant belongs to meal buttons.

### Secondary

- **Student gold:** existing avatar and selected study actions. It is not the shared meal action color.

### Neutral

- **Student cream / paper:** page canvas and sidebar or content surfaces.
- **Student ink / muted / line:** primary copy, supporting copy, and dividers.
- **Meal paper / ink / border / notice:** fields, content, control boundaries, and quiet status panels.

**The Shell Boundary Rule.** Use a surface's existing shell and scoped palette; this record does not recolor teacher navigation or authentication.

## Typography

Student headings use Georgia with a serif fallback; body and controls inherit the Inter/system sans-serif stack. The overview headline and meal headline/title roles are recorded separately because the source values differ. Student results retain the incumbent section-heading ramp, rather than adopting the overview override. Meal labels are compact sans-serif (13px, weight 600); fields are slightly larger than button labels.

Authentication is a separate observed pairing: local “Nathan Auth Serif” is Instrument Serif and “Nathan Auth Sans” is DM Sans. Its heading varies by scene and viewport; these are not portal type tokens.

**The Heading Role Rule.** Preserve the serif-heading/sans-serif-control distinction when extending these surfaces. The recorded Georgia use is an incumbent compatibility fact, not approval to introduce system display faces on unrelated new surfaces.

## Layout

The student shell has a desktop sidebar (264px) and topbar (78px). The overview centers within a maximum width (1300px), with a flexible homework column, classroom rail (305px), and column gap (36px). At 1100px the rail and gap narrow; at 800px the content stacks in document order. Personal homework precedes the classroom rail and optional practice. This composition is specific to the overview, not a universal page template.

Meal pages center within a maximum width (1160px). The student menu uses a flexible list beside a summary (340px); the summary narrows at 1000px and stacks at 700px. Teacher menu fields use two columns, with full-width URL and description rows where specified; below 700px the main fields stack. Results filters wrap, with the search field taking a full row below 540px; result actions move beneath the title at 1100px.

Spacing is component-led, using the recorded recurrent steps rather than a newly imposed mathematical scale. Financial totals and timestamps use tabular numerals where defined in the source.

## Elevation & Depth

The sampled meal and Wonton surfaces are flat at rest. Background tone, borders, whitespace, and dividers separate content. The student's active navigation marker is an inset colored strip, not a lifted shadow. Existing shell popovers are outside this record's component scope; this is not a product-wide ban on shadows.

## Shapes

Controls use modest rounded corners; fields are slightly tighter than buttons. Summary containers and the Wonton panel use broader corners. Existing result cards use the student card radius. The Wonton bitmap keeps its original black-backed drawing and is clipped by the component's rounded image boundary; do not redraw it or infer a general illustration style from it.

## Components

### Buttons

Meal buttons are compact outlined controls with a minimum height (42px). Primary actions have the meal green fill and white text; secondary actions use meal paper and a muted green border. Hover darkens the primary fill and softly tints secondary controls. Disabled controls lower opacity and retain their labels. Focus-visible uses an outline (3px solid #6c9774, offset 3px), without shifting layout.

### Inputs / Fields

Meal inputs, selects, and textareas use the same paper fill, border, and padding. Labels sit above fields with a small gap (7px). Textareas can grow vertically and have a minimum height (100px). Results fields currently use separate fallback colors; do not merge those into the meal palette.

### Cards / Containers

The meal summary is a bordered paper container with comfortable padding, compact item rows, and a separated total. Wonton uses a pale green panel with disclosure content below a divider. Menu items and teacher request rows remain divided lists rather than becoming individual floating cards.

### Navigation

Student links have a minimum height (44px), icon/text alignment, warm hover fill, and a green active strip. Desktop navigation collapses into the existing mobile menu. The teacher page retains CorporateDashboardShell and its existing navigation behavior.

### Status and result chips

Meal status notices use the pale notice fill and ordinary sentence text. Existing result subject summaries use subdued blocks; their colors and typography remain local to the result component. Do not promote legacy uppercase status kickers into a new shared chip primitive.

### Wonton and authentication scenery

Wonton is the unchanged user-provided raster described in `.impeccable/surfaces/classroom-overview.md`. Its gentle idle rotation/lift has a five-second cycle and is disabled for reduced motion. Authentication offers existing water-ripple and meadow/deer scenes with an explicit animation toggle; its reduced-motion stylesheet suppresses transitions and animations. The scene choice is authentication-specific.

## Do's and Don'ts

### Do:

- **Do** preserve each role's incumbent shell and scoped visual vocabulary.
- **Do** keep meal estimates, saved requests, and primary actions legible in their existing hierarchy.
- **Do** use the exact supplied Wonton bitmap and respect reduced-motion preferences.
- **Do** consult the surface contract for overview composition and raster provenance.

### Don't:

- **Don't** apply these sampled tokens as a product-wide redesign mandate.
- **Don't** canonize existing tiny metadata, uppercase kickers, or unrelated color fallbacks as patterns for new screens.
- **Don't** replace preserved authentication assets or invent their original provenance.
