# Portfolio Revision Design

## Objective

Bring the portfolio from a strong preview to a reliable handoff-ready release by fixing the
confirmed navigation, image treatment, accessibility, validation, dependency, and documentation
problems while adding restrained scroll motion.

## Approved scope

- Add small opacity-and-translation reveals as content enters the viewport.
- Respect `prefers-reduced-motion` and keep all content visible without JavaScript.
- Make case-study section navigation render reliably from explicit content metadata.
- Preserve CAD hero images with the documented `heroContain` option.
- Replace the custom lightbox overlay with an accessible native dialog workflow.
- Improve mobile-menu keyboard and dismissal behavior.
- Configure Astro/TypeScript checking and a static output audit.
- Upgrade Astro and related integrations to supported versions that clear the current npm audit.
- Add continuous integration for check, build, and static output audit.
- Exclude the incomplete FPV page from the sitemap while keeping its preview route available.
- Correct README and handoff instructions, including repository ownership order and live DNS conflicts.
- Add a ready-to-send email draft that discloses the resume issue and says Johaan will replace the
  file when Yash returns a corrected export.

## Explicit exclusions

- Do not edit `public/Yash_Piratla_Resume.pdf`.
- Do not change any wearable-health research claim in the portfolio.
- Do not modify `Rhthm360/telemetry-healthcare` or either personal wearable-health case-study repo.
- Do not change GoDaddy, GitHub, Vercel, DNS, or send email during implementation.
- Do not invent new engineering facts or add unsupported case-study conclusions.

## Technical design

### Motion

A focused `ScrollReveal.astro` component will progressively enhance selected layout elements. It
will add reveal attributes only when `IntersectionObserver` and motion are appropriate, keeping the
baseline DOM visible. Motion will be limited to 10 pixels, approximately 420 milliseconds, and a
small capped stagger for card groups. Reduced-motion users will receive no reveal transition.

### Case navigation and hero treatment

The content schema will gain `heroContain` and an explicit `sections` array. Every MDX case study
will list its existing section IDs and labels in frontmatter. Dynamic route templates will pass the
validated array directly to `CaseLayout`; they will no longer depend on Astro extracting headings
from raw HTML tags.

### Accessible interactions

The lightbox will use `<dialog>.showModal()`, which supplies modal semantics and background
inertness. Zoomable figures will be keyboard-focusable buttons in behavior, support Enter and Space,
move focus into the dialog, and restore focus on close. The mobile menu will close on Escape,
outside clicks, and navigation, with its expanded state and accessible label synchronized.

### Validation

`@astrojs/check` and TypeScript will be installed. A dependency-free Node audit script will inspect
the generated `dist` tree for internal broken links, required case subnavigation, expected hero
classes, accessible lightbox markup, and sitemap exclusion. GitHub Actions will run install, check,
build, and audit on pushes and pull requests.

### Documentation and handoff

README will distinguish the live preview from the planned production domain and document the real
Node requirement and explicit section metadata. HANDOFF will require GitHub ownership transfer
before a new Vercel import, tell Yash to use project-specific Vercel DNS values, remove the existing
conflicting `yash` A record, and preserve Outlook mail records. The email draft will state that the
resume remains unchanged until Yash sends a corrected PDF.

## Acceptance criteria

- `npm run check`, `npm run build`, `npm run test:site`, and `npm audit --omit=dev` succeed.
- Every published case-study route renders a nonempty section navigation.
- Climber and drivebase heroes render with the `contain` class.
- Keyboard users can open and close every zoomable image and regain focus at the trigger.
- Reduced-motion users see no scroll reveal animation.
- The mobile menu closes with Escape and reports correct `aria-expanded` state.
- The FPV preview route remains available but is absent from the sitemap.
- Documentation and email contain no generic hardcoded Vercel CNAME and mention the conflicting
  `yash` A record.
- The resume and research content are byte-for-byte/textually unchanged.
