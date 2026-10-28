# Restaurant gallery and full-body Wonton — October 28, 2026

This follow-up replaces the overview's cropped Wonton image with a transparent animated sprite companion and expands each meal session into a teacher-managed restaurant gallery. Desktop Wonton floats beside the page; on phones it has a dedicated in-flow dock so it cannot cover study actions. Clicking opens the Uber Eats meal link. Hover/focus greets, idle blinks, periodic walking uses separate poses, and pause/reduced-motion options stop movement.

## Editing menus

Open **Teacher → Classroom meals**. Create or select a session, add a restaurant, and enter its name, Uber Eats link, optional star rating and review count. Upload or paste a cover image. Each restaurant has its own items with name, description, price, availability, image and optional **Buy 1, get 1 free** tag. Save the menu, then open ordering. Photos can be pasted with the Paste button or Ctrl+V/⌘V while the image area is focused.

When no session exists, the page opens a local first-restaurant draft immediately. The first Save menu creates the closed session and saves its restaurant details; it does not require a separate Create session step. Browser verification used the preview harness's `--empty-meals` option and confirmed the first save survives reload.

Each item also has an optional manually entered estimated total after taxes and fees. Blank values display N/A; clearing the field restores N/A. This per-item amount is separate from the calculated cart estimate and is copied into saved request items from the server menu. Browser checks verified entering $15.99, save/reload, student display, and clearing; validation tests cover missing, zero, invalid and forged amounts.

The user explicitly selected display-only promotion tags. A tagged item does not receive a discount, multiply quantities or add a free item. Student and teacher views state that quantities/prices are unchanged. Submitted quotes retain restaurant names and promotion labels with the saved prices; subsequent menu changes do not rewrite historical requests.

## Data and limits

The existing menu JSON supports up to 20 restaurants and 100 items total. Older single-restaurant sessions remain readable and convert on editing. Images are decoded and resized locally to a maximum 1000px edge, then compressed to JPEG (up to 180,000 data-URL characters per image). The server validates raster data URLs, metadata and IDs and caps the complete menu at 8,000,000 characters. Only the teacher-session write route gets a 10MB body limit; other API limits remain unchanged. Images persist inside the menu, so no bucket or schema migration is required. Role checks and revision checks remain authoritative on the server.

## Asset provenance

The built-in image-generation tool created `client/public/images/wonton-sprites.png`, a 4-column × 2-row transparent sprite sheet, from the user's original Wonton robot reference. The original bitmap remains intact. Prompt and design constraints are recorded in `.impeccable/surfaces/restaurant-gallery.md`. No generated or sample food imagery is seeded in production.

## Verification

- Production client and server build; changed frontend ESLint.
- Nine feature tests cover server pricing, tag-only quantities, multiple restaurants, metadata/image validation, permissions, revision conflicts, existing menu compatibility, and the previously shipped homework behavior.
- Fictional browser preview verified clipboard paste, file upload, metadata editing, save/reload, adding a second restaurant and menu item, cross-restaurant selections, notes, teacher receipt, search empty state, pet pause and Escape dismissal.
- Desktop and 390px phone captures in `.impeccable/review/gallery-*.png` and `wonton-pet-*.png`. QA uploaded the supplied screenshots themselves as test images; their nested text is fixture content only.
- Independent review identified and corrected mobile pet overlap and sticky-header clearance on restaurant entry. Scoped review/documentation evidence is recorded alongside the captures.

Uber menu/cart API access is unchanged. Menus, ratings, reviews, prices, taxes and fees are teacher-entered; requests still go to the teacher for manual ordering.
