# Plan: Scaffold single-page bilingual personal site

TL;DR: Build the site described in instructions.md as one scrolling `index.html` (Home→About→Portfolio→Publications→Technologies→Experience→Philosophy→Contact), with vanilla JS i18n (EN default, PT-BR via toggle or `?language=pt` param), GSAP+ScrollTrigger+Lenis+SplitType for restrained motion, dark/blue/green themed CSS using custom properties, code-generated SVG/CSS visual motifs (no external image assets), and placeholder content where real specifics (portfolio projects, article links, contact URLs) aren't available. Update AGENTS.md, copilot-instructions.md, README.md, CHANGELOG.md to reflect the scaffolded structure.

## Decisions (confirmed with user)
- Single scrolling page, not multi-page.
- Bilingual: English default + Portuguese (PT-BR). Language resolved via (in priority order): `?language=` query param override → `localStorage` saved choice → browser default → fallback `en`. Also provide a visible EN/PT toggle in nav; toggle updates DOM, `<html lang>`, localStorage, and URL (`history.replaceState`) so the state is shareable via link.
- Use placeholder content for portfolio projects, technical articles, study notes, and contact links (LinkedIn/GitHub/email) — clearly marked as TODO for the user to replace. Real factual content already given in instructions.md (thesis repository link, employer/role names IFSP/UNESP/Hitachi Energy, technology lists) must be used as-is, not placeholder.
- Visual motifs (PCB traces, circuit/system diagrams) generated via inline SVG/CSS, no external image files/bundler needed.
- No framework, no bundler, no package manager — plain HTML/CSS/JS + CDN-loaded GSAP/ScrollTrigger/Lenis/SplitType, per AGENTS.md.

## Steps

### Phase 1 — Foundation
1. Create `index.html`: semantic sections (`<header>`, `<nav>`, `<main>` with one `<section>` per content area + `id`s, `<footer>`), skip-to-content link, single `<h1>` (site name in hero), correct heading nesting per section. Include CDN `<script>` tags for GSAP (+ScrollTrigger plugin), Lenis, SplitType, then local `js/i18n.js` and `js/motion.js`/`js/main.js` as ES modules.
2. Create `css/tokens.css`: `:root` custom properties — dark neutral background, `--accent-blue`, `--accent-green`, text colors, spacing scale, fluid type scale via `clamp()`.
3. Create `css/main.css`: base reset, layout for header/nav/sections/footer, component styles for cards (portfolio), timeline (experience), tag lists (technologies). Only animate `transform`/`opacity`; guard continuous animation in `@media (prefers-reduced-motion: no-preference)`; guard hover-only effects in `@media (hover: hover) and (pointer: fine)`.

### Phase 2 — i18n system (*depends on Phase 1 markup skeleton*)
4. Create `js/i18n.js`: translations object `{ en: {...}, pt: {...} }` covering every UI string (nav labels, hero, about narrative, portfolio categories/cards, publications, technology group labels, experience timeline entries, philosophy quote, contact labels, footer, aria-labels/alt text). Implement `resolveLanguage()` (query param `language` → localStorage `site-lang` → `navigator.language` prefix → `en`), `applyTranslations(lang)` (walks `[data-i18n]` elements, sets textContent, updates `<html lang>`, updates toggle button state), and a change handler wired to the nav toggle that persists to localStorage + updates URL via `history.replaceState`.
5. Tag all HTML copy in `index.html` with `data-i18n="section.key"` attributes matching the translation dictionary keys; add `data-i18n-attr` handling for `alt`/`aria-label` where needed.
6. Add EN/PT toggle control to the nav bar (accessible button, not a link with no href-only anchor).

### Phase 3 — Content (*depends on Phase 2 keys existing*)
7. Home/hero: name, title "Electrical Engineer • Software Engineer", main statement, per instructions.md Home section.
8. About: narrative flow (Automation Industrial → Electrical Engineering → Software Development → Engineering Software) as a visual progression (SVG/CSS diagram), not a bulleted résumé.
9. Engineering Portfolio: 4 category groups (Software Engineering / Electrical Engineering / Research / Open Source) each with 2-3 placeholder project cards (title, 1-2 line impact-oriented description, tag chips) — flag as placeholder content via an HTML comment for the user to replace.
10. Publications & Studies: Academic subsection with real thesis link (http://hdl.handle.net/11449/235665), Technical Articles subsection with placeholder article titles (Engineering automation with Python; Industrial software architecture; Building engineering applications; SQL for engineering systems), Study Notes subsection placeholder.
11. Technologies: grouped lists exactly as specified (Programming: Python/PHP/C#/JavaScript; Frameworks: Django/Laravel/React/.NET; Database: SQL Server/MySQL; Engineering: Electrical Engineering/Industrial Automation/Engineering Software; Infrastructure: Linux/Virtualization/Deployment) — grouped by purpose, no logo wall.
12. Experience: timeline using real entities from instructions.md (IFSP → Industrial Automation → UNESP Electrical Engineering → Hitachi Energy: Engineering Internship → Software Developer → Senior Software Development Analyst).
13. Philosophy: dedicated section with the suggested quote verbatim (EN) + PT translation.
14. Contact: minimal — LinkedIn/GitHub/email as placeholder links clearly marked TODO.

### Phase 4 — Motion (*depends on Phase 3 markup existing so selectors are stable*)
15. Create `js/motion.js`: initialize Lenis once globally; register GSAP + ScrollTrigger; use SplitType to split the hero headline into words for a staggered entrance (wrap with `aria-label` containing full text for screen readers); add restrained scroll-triggered fade/translate-in for section headers and portfolio/timeline items (opacity + transform only, small stagger) — explicitly avoid parallax gimmicks, cursor-follow effects, and pinned sections to match instructions.md's "avoid excessive animations/flashy effects."
16. Create `js/main.js` as the module entry point: on `DOMContentLoaded`, call i18n init first (prevents flash of wrong language), then motion init.

### Phase 5 — Docs housekeeping (*can run in parallel with Phase 4*)
17. Update AGENTS.md "Planned (not yet created)" section to reflect the real file list once created.
18. Update .github/copilot-instructions.md "Project Status" section (no longer "no application code exists").
19. Update README.md "Status" section (remove "🚧 Pre-implementation").
20. Add a new entry to CHANGELOG.md under `[Unreleased] > Added` describing the scaffolded site, following existing Keep a Changelog format.

## Relevant files
- `index.html` — new, single-page markup, all sections + nav + footer.
- `css/tokens.css` — new, design tokens (colors, spacing, fluid type).
- `css/main.css` — new, layout/components/animation guards.
- `js/i18n.js` — new, translation dictionary + language resolution/toggle logic.
- `js/motion.js` — new, Lenis/GSAP/ScrollTrigger/SplitType setup.
- `js/main.js` — new, module entry point orchestrating init order.
- `AGENTS.md`, `.github/copilot-instructions.md`, `README.md`, `CHANGELOG.md` — update per maintenance matrix once real structure exists.

## Verification
1. Serve statically (`npx serve .` or Live Server) and manually check: single `<h1>`, heading nesting, all sections present in instructions.md order.
2. Toggle language control switches all visible text EN↔PT; reload page with `?language=pt` in URL and confirm PT loads without needing the toggle; confirm choice persists via localStorage on refresh without the param.
3. Verify reduced-motion (`prefers-reduced-motion: reduce`) disables continuous/entrance animation, and touch/no-hover devices don't get hover-only effects (simulate via DevTools).
4. Run the same lint commands CI uses: `npx --yes html-validate "**/*.html"`, `npx --yes stylelint "**/*.css" --allow-empty-input`, `npx --yes eslint "**/*.js" --no-eslintrc --env browser,es2021 --parser-options=ecmaVersion:2021,sourceType:module`.
5. Confirm no console errors from CDN library loads (GSAP/ScrollTrigger/Lenis/SplitType) and that ES module imports resolve when served over http (not `file://`).

## Further Considerations
1. CDN library versions to pin — recommend GSAP 3.12.x (bundles ScrollTrigger), Lenis 1.x, SplitType 0.3.x; verify latest stable at implementation time since versions shouldn't be hardcoded speculatively without checking.
2. Real contact links/portfolio specifics are still placeholders — user should supply real LinkedIn/GitHub/email and actual project details after scaffolding for a follow-up content pass.
