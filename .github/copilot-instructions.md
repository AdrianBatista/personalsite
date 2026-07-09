# Copilot Instructions

This repository hosts the personal website for Adrian Felipe Nogueira Batista. Read [instructions.md](../instructions.md) (brand positioning, tone, content plan) and [AGENTS.md](../AGENTS.md) (stack, structure, build/test) before generating content or code. This file covers coding conventions and the maintenance matrix.

## Project Status

The site is scaffolded: a single scrolling `index.html` with sections for every entry in `instructions.md`'s Site Structure, bilingual EN/PT copy driven by `js/i18n.js` (language resolved from `?language=` query param → `localStorage` → browser locale → `en`), and restrained motion via `js/motion.js`. Portfolio projects, technical article links, study notes, and contact URLs are placeholders flagged with `TODO` comments in `index.html` — replace them with real content before publishing.

## Language-Specific Conventions

### HTML
- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`) — no generic `<div>` soup.
- One `<h1>` per page; heading levels must nest correctly for accessibility.
- All images require meaningful `alt` text; decorative images use `alt=""`.

### CSS
- Use CSS custom properties (`:root { --bg, --accent-blue, --accent-green }`) for the dark theme palette described in instructions.md — neutral dark background, blue and green accents, minimal gradients.
- Prefer `clamp()` for fluid typography scales over fixed breakpoints where practical.
- Only animate `transform` and `opacity`. Never animate `width`, `height`, `top`, `left`, or `margin`.
- Wrap continuous/heavy animations in `@media (prefers-reduced-motion: no-preference)`.
- Wrap hover-only/cursor-follow effects in `@media (hover: hover) and (pointer: fine)`.

### JavaScript
- Vanilla ES modules (`<script type="module">`), no bundler unless explicitly requested.
- Keep animation logic (GSAP timelines, ScrollTrigger, Lenis init) isolated in dedicated modules under `js/` (e.g. `js/motion.js`) rather than inline in HTML.
- No inline `onclick=` handlers — attach listeners in JS modules.

## Framework / Library Patterns

- **GSAP + ScrollTrigger**: use for scroll-driven narrative sections (pinned containers, parallax) per [.github/skills/premium-frontend-ui/SKILL.md](skills/premium-frontend-ui/SKILL.md).
- **Lenis**: initialize once globally for smooth scrolling; don't instantiate per-section.
- **SplitType**: use for headline word/character splitting to enable staggered entrance animations; ensure split text still reads correctly to screen readers (use `aria-label` on the container with the full text).

## Conventions Mined from PR Reviews

None yet — this is a new repository with no PR history. Revisit this section after the first few PRs to capture recurring reviewer feedback.

## Test Conventions

No automated test suite exists yet. Until one is introduced:
- Validate HTML/CSS/JS via the CI lint workflow before merging.
- Manually verify animations respect `prefers-reduced-motion` and that touch devices aren't served hover-only interactions.

## Code Style Notes

- [.stylelintrc.json](../.stylelintrc.json) — minimal config (`{ "rules": {} }`) so `npx stylelint` has a config to resolve; it enforces no rules beyond CSS syntax validity. Tighten it with real rules if stricter CSS linting is desired later.
- No ESLint config exists yet. [ci.yml](workflows/ci.yml) lints JS via `npx --yes eslint@8` with legacy CLI flags (`--no-eslintrc --env browser,es2021 --parser-options=...`) — pinned to v8 because eslint@9 removed those flags in favor of flat config. If an `.eslintrc`/`eslint.config.js` is added later, update `ci.yml` to drop the legacy flags and reference the config here instead of restating rules.

## Asset / Content Rules

- Visual motifs should reinforce the engineering theme: PCB traces, circuit diagrams, code snippets, system diagrams — per instructions.md. Avoid generic stock-photo or marketing-style imagery.
- Content tone: professional, technical, concise, documentation-like. Never use buzzwords or exaggerated self-promotion (see instructions.md § Tone of Voice).
- Portfolio content is grouped by category (Software Engineering / Electrical Engineering / Research / Open Source), never by a flat technology logo wall.

## Subproject Pages

New projects added to `projects/*/index.html` should use the [Subproject Layout Guide](.github/SUBPROJECT_LAYOUT_GUIDE.md). The layout system (`css/subproject.css`) provides:

- Consistent header/nav with the main site
- Breadcrumb and project meta section
- Content containers with proper spacing and hierarchy
- Responsive grid components for features/specs
- Link styling and call-to-action boxes
- Full i18n support via the main site's language system

**Template:** Copy the structure from [projects/net-salary-calculator/index.html](../projects/net-salary-calculator/index.html) when creating a new subproject page.

## Maintenance Matrix

This matrix will grow once the site is scaffolded. Update it whenever a change in one place requires a cascading update elsewhere.

| If you change... | Also update... |
|---|---|
| Brand positioning, tagline, or tone rules | [instructions.md](../instructions.md) first, then any page copy that quotes it, then this file if conventions changed |
| Site navigation / page list | Nav markup on every page (header includes in both [index.html](../index.html) and subproject pages), the "Planned" structure list in [AGENTS.md](../AGENTS.md), and instructions.md's Site Structure section |
| Color palette / theme tokens | `css/tokens.css` custom properties, then any hardcoded colors in inline `<style>` blocks; subproject pages inherit tokens automatically |
| Motion/animation conventions | [.github/skills/premium-frontend-ui/SKILL.md](skills/premium-frontend-ui/SKILL.md) usage notes above, and any existing animation modules under `js/` |
| Subproject layout components | `css/subproject.css`, then update [.github/SUBPROJECT_LAYOUT_GUIDE.md](.github/SUBPROJECT_LAYOUT_GUIDE.md) and test the example in [projects/net-salary-calculator/index.html](../projects/net-salary-calculator/index.html) |
| Lint tooling used in CI | [workflows/ci.yml](workflows/ci.yml) and [workflows/copilot-setup-steps.yml](workflows/copilot-setup-steps.yml) so the agent environment matches CI |

**Note:** trace actual import/registration chains (nav includes, shared partials, build config) once they exist — this table is intentionally forward-looking and should be corrected against real file paths as soon as the site is scaffolded.
