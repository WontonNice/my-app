# SAT Crash Course Reader

A read-only Chrome extension for extracting structured information from
`https://tutor.thesatcrashcourse.com/` while using the session that is already signed in
in Chrome.

## What it reads

- Links to individual tests and the surrounding card or table-row text
- Label/value fields found near each test
- Visible tables, headings, links, and optionally all visible page text
- On an SHSAT test preview: the test title, module, canonical passage, glossary terms,
  current question, choices, correct answer, explanation, and media references

The extension does not request Chrome's cookie permission, export cookies, make API
requests, or modify the website.

When **Include the correct answer** is enabled, the extension briefly clicks the preview
page's **Show answer** control, reads the selected choice, and restores the original hidden
answer state. It does not submit an answer or alter the test content.

## Install locally

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select this `sat-crash-course-reader` directory.
5. Open or reload the signed-in Tests page and click the extension icon.
6. Click **Read current page**, then copy or download the result.

Installing an unpacked extension gives its content script access to pages on the host
listed in `manifest.json`. Review the manifest and source before loading it.

## Output

JSON exports preserve all extracted structures. CSV exports use test records when found,
otherwise the first table, and finally the page's links as a fallback.

The page is a JavaScript application and its private DOM may change. If a test is missing
from the export, share a redacted sample of the generated JSON or the relevant page HTML
so the site adapter in `content.js` can be tuned to the exact markup.
