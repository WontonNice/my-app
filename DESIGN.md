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
  storefront-ink: "#171717"
  storefront-primary: "#111111"
  storefront-primary-hover: "#333333"
  storefront-muted: "#626262"
  storefront-border: "#e1e1e1"
  storefront-search: "#eaeae6"
  meal-offer: "#c90000"
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
  storefront-headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(28px, 3vw, 38px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  storefront-title:
    fontFamily: "Inter, sans-serif"
    fontSize: "25px"
    fontWeight: 700
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
  restaurant-cover: "16px"
  offer-label: "3px"
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
    backgroundColor: "{colors.white}"
    rounded: "{rounded.meal-card}"
    padding: "22px"
  storefront-button-primary:
    backgroundColor: "{colors.storefront-primary}"
    textColor: "{colors.white}"
    typography: "{typography.meal-control}"
    rounded: "{rounded.control}"
    padding: "9px 14px"
  storefront-button-primary-hover:
    backgroundColor: "{colors.storefront-primary-hover}"
  meal-offer:
    backgroundColor: "{colors.meal-offer}"
    textColor: "{colors.white}"
    rounded: "{rounded.offer-label}"
    padding: "3px 6px"
---

# Design System: Nathan Tutors — Learning Room and classroom meals

## Overview

**Creative North Star: "The Learning Room"**

This name comes from the existing student navigation, not a new brand workshop. Warm paper, dark green navigation, serif headings, compact sans-serif controls, and quiet dividers define the sampled student experience. This record describes the built overview, results, classroom storefront, and shared meal controls; it does not establish a global design system for all Nathan Tutors products.

The teacher meal page keeps the incumbent navy dashboard shell and its cooler canvas. Authentication keeps its separate Instrument Serif/DM Sans scenery composition. Neither is migrated to the student shell by this document. Product-wide audience priorities and brand commitments beyond the Nathan Tutors name remain undecided in PRODUCT.md.

The classroom storefront follows the user’s restaurant-card and featured-item references: photo-led browsing, bold sans-serif headings, compact rating metadata, and red offer labels. Wonton is a transparent full-body sprite companion derived from the original robot reference, replacing the earlier cropped-image treatment. These are scoped changes, not a new identity for the whole portal.

**Key Characteristics:**

- Green navigation and paper surfaces in the student portal.
- Serif overview and teacher headings; bold sans-serif storefront headings beside compact controls.
- Flat functional surfaces, photo-led restaurant and item grids, and divided teacher request rows.
- Shared meal controls inside each role's existing shell.

## Colors

The student palette pairs muted greens with warm paper; meal controls use closely related local colors already present in their stylesheet.

### Primary

- **Student green:** navigation background; **student green 2:** active navigation marker and supporting links.
- **Meal primary:** teacher save actions and the Wonton meal link; its darker hover variant belongs to those buttons.
- **Storefront primary:** the black student submission action, with a charcoal hover state.

### Secondary

- **Student gold:** existing avatar and selected study actions. It is not the shared meal action color.
- **Meal offer:** red labels on restaurant covers and menu items. These are display-only tags, not automatic discounts.

### Neutral

- **Student cream / paper:** page canvas and sidebar or content surfaces.
- **Student ink / muted / line:** primary copy, supporting copy, and dividers.
- **Meal paper / ink / border / notice:** teacher fields, shared control boundaries, and quiet status panels.
- **Storefront ink / muted / border / search:** student meal text, metadata, summary boundaries, and search surfaces. White grounds the student selection summary.

**The Shell Boundary Rule.** Use a surface's existing shell and scoped palette; this record does not recolor teacher navigation or authentication.

## Typography

Overview and teacher meal headings use Georgia with a serif fallback; body and controls inherit the Inter/system sans-serif stack. The overview headline and teacher meal headline/title roles are recorded separately because the source values differ. The student storefront instead uses bold Inter headings, with its own headline and title tokens; restaurant titles use 30px, reducing to 26px on phones, and selection-summary headings use 20px. Student results retain the incumbent section-heading ramp, rather than adopting the overview override. Meal labels are compact sans-serif (13px, weight 600); fields are slightly larger than button labels.

Authentication is a separate observed pairing: local “Nathan Auth Serif” is Instrument Serif and “Nathan Auth Sans” is DM Sans. Its heading varies by scene and viewport; these are not portal type tokens.

**The Heading Role Rule.** Keep the overview and teacher serif headings scoped to those surfaces; use the recorded bold sans-serif hierarchy for the photo-led storefront. Neither role is a product-wide display-font mandate.

## Layout

The student shell has a desktop sidebar (264px) and topbar (78px). The overview centers within a maximum width (1300px), with a flexible homework column, classroom rail (305px), and column gap (36px). At 1100px the rail and gap narrow; at 800px the content stacks in document order. Personal homework precedes the classroom rail and optional practice. This composition is specific to the overview, not a universal page template.

Teacher meal pages center within a maximum width (1160px); the student storefront expands to 1320px. Restaurant cards use three columns when no selection summary is present and two beside a summary. Item grids use three columns, reducing to two at 1100px. The student summary is 300px wide, narrows to 275px at 1100px, and stacks at 800px; restaurant cards stack at 540px. The restaurant title has 96px scroll clearance so card navigation does not put it under the sticky header.

Teacher restaurant editing pairs the photo with metadata; item editing pairs a photo, fields, and removal action. These stack at 800px and 540px respectively. The restaurant picker scrolls horizontally within its own row. Wonton floats at the desktop bottom-right, but at 700px and below occupies a normal-flow dock in the classroom column so its persistent hit area does not cover study links. Results filters and result actions retain their existing responsive rules.

Spacing is component-led, using the recorded recurrent steps rather than a newly imposed mathematical scale. Financial totals and timestamps use tabular numerals where defined in the source.

## Elevation & Depth

The meal summary and Wonton disclosure are flat bordered surfaces. Background tone, borders, whitespace, and dividers separate content. White quantity controls lift from food photos with a small offset shadow (0 3px 8px #0002); the pet has a translucent ground oval, not a card shadow. The student's active navigation marker is an inset colored strip, not a lifted shadow. Existing shell popovers are outside this record's component scope; this is not a product-wide ban on shadows.

## Shapes

Controls use modest rounded corners; fields are slightly tighter than buttons. Summary containers, image tiles, and the Wonton disclosure use broader corners. Restaurant detail covers use the wider cover radius. Quantity controls are circular over photos; offer labels have small corners. Existing result cards keep their student card radius. Wonton has a transparent full-body silhouette; it is not clipped into the former black-backed image tile.

## Components

### Buttons

Meal buttons are compact outlined controls with a minimum height (42px). Teacher primary actions have the meal green fill and white text; the student submission action uses storefront black. Secondary actions use meal paper and a muted green border. Hover darkens the primary fill and softly tints secondary controls. Disabled controls lower opacity and retain their labels. Focus-visible uses an outline (3px solid #6c9774, offset 3px), without shifting layout.

### Inputs / Fields

Meal inputs, selects, and textareas use the same paper fill, border, and padding. Labels sit above fields with a small gap (7px). Textareas can grow vertically and have a minimum height (100px). Image fields pair a crop preview with Upload, Paste, and Remove controls. The focusable image area accepts keyboard paste, offers file-upload fallback, and exposes processing/error feedback. Storefront search uses a rounded neutral fill with a search icon. Results fields currently use separate fallback colors; do not merge those into the meal palette.

### Cards / Containers

The student selection summary is a white bordered container with compact item rows and a separated total. Restaurant cards pair wide crop images with names and ratings; menu items pair nearly square photos with names, prices, and optional offer tags. They do not add outer card borders or shadows. Wonton’s disclosure opens above the transparent pet, with a paper background. Teacher request rows remain divided lists.

### Navigation

Student links have a minimum height (44px), icon/text alignment, warm hover fill, and a green active strip. Desktop navigation collapses into the existing mobile menu. The teacher page retains CorporateDashboardShell and its existing navigation behavior.

### Status and result chips

Student meal requests have a prominent status panel above the menu: green with a check for ordered, amber for removed, rose for declined, blue for waiting, and neutral for student cancellation. Each pairs a plain-language heading with the available next step, so color never carries the meaning alone. A native disclosure holds the saved request details. Routine notices retain their pale notice fill. Existing result subject summaries use subdued blocks; their colors and typography remain local to the result component. Do not promote legacy uppercase status kickers into a new shared chip primitive.

### Wonton and authentication scenery

Wonton uses `client/public/images/wonton-sprites.png`, an eight-frame transparent sprite sheet generated with the built-in image tool from the user’s original black-and-white box-robot reference. The source image remains preserved; prompt and provenance are recorded in `.impeccable/surfaces/restaurant-gallery.md`. The new user request supersedes the old bitmap-only rule. Idle/blink/head-tilt/bounce frames run in a seven-second stepped cycle; hover/focus and the open menu use a wave cycle (0.6s), and periodic walking uses two poses (0.5s) with a short three-second stroll. A pause control and reduced-motion rules disable animation. Authentication offers existing water-ripple and meadow/deer scenes with an explicit animation toggle; its reduced-motion stylesheet suppresses transitions and animations. The scene choice is authentication-specific.

## Do's and Don'ts

### Do:

- **Do** preserve each role's incumbent shell and scoped visual vocabulary.
- **Do** keep meal estimates, saved requests, and primary actions legible in their existing hierarchy.
- **Do** preserve Wonton’s full-body black-and-white robot identity, use the recorded sprite asset, and respect pause and reduced-motion preferences.
- **Do** consult the overview and restaurant-gallery surface contracts for scoped composition and raster provenance.
- **Do** keep offer labels display-only and ratings tied to teacher-entered values.

### Don't:

- **Don't** apply these sampled tokens as a product-wide redesign mandate.
- **Don't** canonize existing tiny metadata, uppercase kickers, or unrelated color fallbacks as patterns for new screens.
- **Don't** replace preserved authentication assets or invent their original provenance.
