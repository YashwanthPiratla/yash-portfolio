# PT2 Portfolio Revision Design

## Purpose

Revise Yashwanth Piratla's existing Astro portfolio to follow the document
`Stacy directions PT2.pdf` while preserving the current engineering-first visual system, Yash's
own pending corrections, the approved Wearable Health Telemetry page, the résumé PDF, and the
working Vercel deployment.

The revision must be accurate about project ownership, use only supplied project media, expose the
engineering work earlier on the homepage, and leave a maintainable handoff for Yash.

## Source-of-truth order

When sources disagree, apply them in this order:

1. Yash's authored corrections in GitHub pull request #1.
2. `Stacy directions PT2.pdf` as the newest portfolio direction document.
3. The original project-description and project-photo documents under the local `FRC` source
   folder.
4. Yash's supplied résumé for biographical and experience facts.
5. Existing site copy only where none of the sources above changes it.

For linked Google photo documents, export the live document immediately before implementation.
A previously downloaded DOCX is a snapshot, not the current source of truth.

No new claim, metric, project responsibility, image, or URL may be invented to make the site feel
more complete.

## Global constraints

- Keep Astro, MDX content collections, the existing component patterns, and Vercel configuration.
- Do not restructure the repository beyond focused additions needed for this revision.
- Do not edit `src/content/research/wearable-health-ml.mdx`, any separate wearable-health
  repository, or `public/Yash_Piratla_Resume.pdf`.
- Preserve the existing restrained color system, typography, light/dark themes, lightbox, sticky
  case navigation, and subtle scroll-reveal behavior.
- Preserve `prefers-reduced-motion` support and ensure content remains visible without JavaScript.
- Treat project-card thumbnails as navigation UI and exempt them from the project-image reuse
  rule. Inside an individual case-study page, an image used as the hero may not appear again in the
  body, and no body image may appear in more than one section.
- Yash's headshot is explicitly exempt from the reuse rule and may appear on Home and About.
- Use only the supplied project photos, CAD, and video. Do not generate or synthesize engineering
  imagery.
- Keep Engineering Projects visually dominant over Research, and Research dominant over the new
  Experience / Leadership section.

## Git and release workflow

Yash's open pull request #1 must be reviewed and merged before implementation begins. Its LinkedIn
URL and drivebase corrections are Yash-authored changes and should retain his commit attribution.
The malformed pull-request value `125.5 lbs lb` must be normalized to `125.5 lb` in a small
follow-up correction.

After the merge and a clean pull of `main`, create `codex/pt2-portfolio-revision`. All portfolio,
documentation, and release-audit work belongs on that branch. Open a pull request and use its
Vercel preview for review rather than pushing an unreviewed revision directly to production.

The failed Vercel status currently attached to Yash's pull request is an integration-authorization
failure, not evidence of an Astro build failure. The implementation still must pass the repository
checks locally before merge.

## Homepage design

### Compact hero

Remove the large elevator photograph and its caption from the homepage hero. Replace the
two-column image-heavy hero with a compact centered composition containing:

- the new headshot embedded in `Stacy directions PT2.pdf`, displayed as a small portrait;
- the eyebrow `Mechanical Engineering — UC Berkeley`;
- `Yashwanth Piratla` as the page heading;
- one concise positioning sentence about mechanical design, robotics, manufacturing, testing, and
  iteration;
- restrained links to Engineering Projects, Research, the résumé, GitHub, LinkedIn, and email.

The new portrait must replace `src/assets/img/headshot.png` so Home and About automatically share
the corrected high-resolution source. It should be rendered responsively through Astro's `Image`
component and cropped only for presentation, without altering the underlying photograph.

At a 1366 × 768 desktop viewport, the beginning of the Engineering Projects section—including its
eyebrow or heading—must be visible without scrolling. On mobile, the hero must remain compact but
may require a small scroll before the first project card.

### Homepage content order

The homepage order will be:

1. Compact hero
2. Engineering Projects
3. Research
4. Experience / Leadership
5. About

This preserves the hierarchy required by PT2 and keeps the résumé-like content low on the page.

## Experience / Leadership design

Add a focused `ExperienceStrip.astro` component containing four concise cards in this order:

1. **FRC Robotics — President** — led a 40-member team across robot development, mechanical
   design, manufacturing, technical training, outreach, and summer STEM fundraising.
2. **Praevius — Partner** — led social media and applied Stable Diffusion, video editing, and four
   AI outreach systems across work associated with approximately $200K in lifetime revenue.
3. **Evergreen Code Camp — Co-founder** — created Python and Scratch curriculum, taught online and
   in person, and supported 40+ signups and approximately $20K in revenue in association with the
   University of Washington Foster School.
4. **VTseva — Community Service** — founded the Feeding Hope initiative, raised approximately
   $20K for visually challenged students, supported approximately $50K in UTSAV fundraising, sent
   robotics kits, and mentored students for FLL competition.

The cards must not call Yash the founder of Praevius or VTseva. Feeding Hope is an initiative, not
the organization name. The cards are four equal columns on wide desktop screens, wrap on smaller
screens, use short copy, and have a substantially smaller vertical footprint than project cards.
They do not link to detail pages.

## Engineering case-study media

The refreshed linked source documents contain nine elevator images, seven climber images, and four
drivebase images. The revision will use every supplied mechanism image once on its matching case
study and will not imply that any still-unavailable visual exists.

### Three-Stage Cascading Elevator

- Keep `elevator/robot-full-extension.png` as the case-study hero and do not repeat it in the body.
- Use `elevator/cad-iso.png` once in the body beside the architecture and belt-routing explanation.
- Retain the approved technical story: 2025 coral origin, later algae target, approximately 7-foot
  reach, arm-pivot contribution, single motor at 20:1, repurposed synchronization shaft, aluminum
  V-slot, iteration history, and Yash's supported design/assembly responsibilities.
- Do not imply that Yash personally operated every manufacturing machine.
- Add the refreshed belt-routing CAD, installed tensioner close-up, pulley before/after visuals,
  Limelight mount CAD, front testing photo, and top-view integration photo beside their matching
  technical sections.
- Record only the still-missing failed-part and dedicated manufacturing visuals in the handoff.

### Deployable Multi-Level Climbing Mechanism

- Keep `climber/cad-iso.png` as the case-study hero.
- Use `climber/cad-front.png`, `climber/cad-top-transparent.png`, and
  `climber/bench-assembly.png` once each, placed beside the architecture, transmission, and
  assembly/testing narratives respectively.
- Add the refreshed dead-axle close-up, linear-rail CAD, and hook FEA image beside their matching
  architecture subsections.
- Preserve the dead-axle, belt/gear reduction, chain drive, carbon-fiber hook, FEA, packaging, hook
  testing, and final mechanism story already supported by the project documentation.
- Record only the still-missing hook close-up, hook-testing media, and final installed mechanism in
  the handoff.

### MK4 Swerve Drivebase

- Keep `drivebase/cad-iso.png` as the case-study hero and remove its duplicated body figure.
- Use `drivebase/cad-bellypan-electronics.png` once beside electronics packaging.
- Use `drivebase/chassis-build.png` once beside manufacturing, wiring, and assembly.
- Add the refreshed intake/indexer CAD beside the packaging and system-integration narrative.
- Download the supplied drivebase MP4 from
  <https://drive.google.com/drive/folders/1w9hodGHEWQtVi_rFaf40TX6zm7DUHhcp>, retain its original
  content, and publish it as a locally served, controls-enabled, non-autoplaying HTML video with
  `preload="metadata"`.
- Preserve the supported frame-rail, cross-member, bumper, battery, bellypan, intake, wiring,
  packaging, manufacturing, and final-system narrative.
- Record the still-missing bumper, battery, wiring, manufacturing-process, and final-robot visuals
  in the handoff.

Existing `.split`, figure, caption, and full-width patterns should be used to vary layout. Add a
small video wrapper only if the existing figure styles cannot provide correct sizing and captions.

## FPV drone behavior

The FPV drone must be presented as a group project whose detailed case study will live on a
separate group-built website.

- Keep the card fourth in Engineering Projects.
- Replace `personal`, `built solo`, and any implication that Yash independently designed and built
  the complete drone.
- Use `View Case Study →` as the card action.
- Keep a minimal local placeholder route while no external URL exists. The route must explain that
  the external group case study is forthcoming and must not contain a detailed solo narrative.
- Keep the placeholder route out of the sitemap.
- Add an optional external case-study URL field to project metadata. When Yash supplies the URL,
  the card should use it without requiring component or routing changes.
- Do not link to an unrelated repository or invented URL.

## Wearable Health Telemetry protection

The approved research page is immutable for this revision. Add a content-integrity check based on
the current source file's SHA-256 digest so `npm run test:site` fails if
`src/content/research/wearable-health-ml.mdx` changes accidentally. This guard protects the page
during the PT2 work; a future intentional edit must update the digest in the same reviewed change.

## Handoff changes

Revise `HANDOFF.md` without weakening its current GitHub-transfer, Vercel, DNS, mail-record, HTTPS,
or troubleshooting guidance.

The updated handoff must:

- describe Yash's fork-and-pull-request workflow and require syncing from the updated original
  `main` before new work;
- state that thumbnails may repeat on cards but case-study media may not repeat within a page;
- replace the old FPV description/photo request with a request for the final external group
  case-study URL;
- state that Wearable Health Telemetry and the current résumé remain unchanged;
- list the missing elevator, climber, and drivebase visuals described above;
- explain how to replace the drivebase video without changing page structure;
- retain `npm run check` and `npm run test:site` as mandatory release checks;
- explain that pull requests should be reviewed through Vercel previews before production merge.

The already-sent email is not silently treated as accurate after this revision. After deployment,
prepare a short corrective follow-up that links the updated preview/production site, retracts the
request for FPV description/photos, requests only the future group-case-study URL and missing
project imagery, and explains what PT2 changed. Sending that email requires separate explicit
authorization.

## Verification design

Extend the existing static-site audit rather than introducing a new test framework. The audit must
verify:

- the homepage contains the four leadership roles in the required order;
- the homepage no longer contains the large elevator hero figure;
- the Engineering Projects heading remains immediately after the compact hero in document order;
- the FPV card uses `View Case Study`, and the FPV placeholder contains group-project language but
  none of the forbidden solo wording;
- each published engineering case page has no duplicate content-image URL within that page;
- the FPV placeholder remains excluded from the sitemap;
- the Wearable Health Telemetry source digest is unchanged;
- existing internal-link, case-navigation, CAD-containment, lightbox, and sitemap checks continue
  to pass.

Run:

```bash
npm run check
npm run test:site
```

Then inspect the Vercel preview at desktop and mobile sizes for initial-viewport hierarchy,
four-card wrapping, dark mode, keyboard focus, lightbox behavior, reduced motion, and drivebase
video playback.

## Acceptance criteria

The revision is ready to merge when all of the following are true:

- Yash's pull request #1 is represented in the branch history and its malformed weight unit is
  corrected.
- The homepage immediately identifies Yash, Mechanical Engineering, and Engineering Projects.
- The new headshot is sharp and modestly sized.
- Engineering Projects, Research, Experience / Leadership, and About follow the approved hierarchy.
- All four leadership cards are accurate, compact, ordered correctly, and subordinate to projects.
- Project media is not duplicated within a case study, and absent imagery is documented rather
  than fabricated.
- The drivebase video plays through native controls.
- FPV is clearly a group project with a future external case-study destination.
- Wearable Health Telemetry and the résumé PDF are byte-for-byte unchanged by the implementation.
- The handoff reflects the actual maintenance workflow and remaining asset requests.
- Automated checks pass and the Vercel preview passes responsive and accessibility review.
