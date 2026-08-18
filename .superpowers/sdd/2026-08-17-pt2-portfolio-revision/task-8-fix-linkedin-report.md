# Task 8 — Correct Homepage LinkedIn Link

Base commit: `0a4552c4165c95f73156d792b5f29053a401086a`

## Root cause

The compact homepage hero introduced in commit `a5c749f` used
`https://www.linkedin.com/in/yashwanth-piratla-5115b826/`. The approved
profile URL is `https://www.linkedin.com/in/yashwanth-piratla-5115b826a/`,
which was already used by the navigation, footer, contact page, and Person
schema.

## Regression coverage

`scripts/check-site.mjs` now scopes the check to the compact homepage hero.
It fails if the obsolete profile URL appears there and also fails if the
approved profile URL is absent.

RED evidence (`npm run test:site`, before the hero link was corrected):

```text
Site audit failed with 2 issues:
- /: compact hero contains the obsolete LinkedIn profile URL
- /: compact hero is missing the approved LinkedIn profile URL
```

## GREEN verification

- `npm run check` — 0 errors, 0 warnings, 0 hints.
- `npm run test:site` — build completed and site audit passed (12 HTML files,
  2 sitemap files).
- `git diff --check` — clean.
- `rg -n 'https://www\\.linkedin\\.com/in/yashwanth-piratla-5115b826/' src` —
  no matches (exit status 1 as expected for an empty search).
