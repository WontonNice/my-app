# Classroom restaurant gallery and Wonton companion

Mode: Operate. Code-led implementation of the user's supplied restaurant-list and featured-item screenshots. No separate concept tournament or generated UI comp: the user pinned the layout pattern.

## Direction contract

Preserve the student and teacher shells. Inside meals, use photo-first restaurant cards, compact ratings/review metadata, red offer labels, a restaurant cover and item grid, and an adjacent selection summary that stacks on phones. Teacher controls mirror restaurant and item structure with explicit upload/paste fields. Ratings and review counts are manually entered facts, never fabricated.

The October 28 follow-up supersedes the earlier bitmap-only Wonton constraint. Wonton is now a small, full-body, transparent animated companion, faithful to the black cube, white dot eyes, and white outline of the original robot. Idle/blink, wave, and walking poses use an eight-frame sprite sheet. The floating companion opens the meal link and offers pause; reduced motion disables animation.

The user explicitly chose **display-only** Buy 1, get 1 free tags. Tags never multiply quantities, discount prices, or claim automatic Uber promotions. Quotes stay server-priced teacher estimates. Uploaded/pasted images are resized locally and saved in the existing menu JSON; no new database migration or external image host is required.

## Raster provenance

`client/public/images/wonton-sprites.png` was generated with the built-in image tool from the original user Wonton reference. Prompt: preserve the black cube head, thick white front/top/right outlines, two white dot eyes and straight mouth; complete a chibi torso, arms, hands, legs and feet; transparent 4-column × 2-row sheet with idle, blink, two wave, two walk, bounce and head-tilt poses; consistent scale, no clipping or text. The generated original is preserved under the Codex generated_images directory. No food pictures are prepopulated into production. Browser QA uploads used the user's provided screenshots strictly as local test images, so nested text in the test thumbnails is fixture content, not product UI.

## Verification scope

Local build, changed frontend ESLint, nine backend feature tests, desktop and 390px phone render checks. Paste, upload, save/reload, rating metadata, multi-restaurant selection, teacher receipt, notes, offer-only pricing, legacy menu compatibility, role restrictions, and optimistic revision conflicts are covered. Preview uses fictional data and does not access production student records.
