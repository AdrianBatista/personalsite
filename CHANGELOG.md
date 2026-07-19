# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Initial repository setup: website vision document ([instructions.md](instructions.md)), AI agent configuration ([AGENTS.md](AGENTS.md), [.github/copilot-instructions.md](.github/copilot-instructions.md)), CI linting workflow, issue/PR templates.
- Scaffolded the site as a single scrolling page (`index.html`) covering Home, About, Engineering Portfolio, Publications & Studies, Technologies, Experience, Philosophy, and Contact, per instructions.md's Site Structure.
- Bilingual EN/PT content via `js/i18n.js`, with language resolved from a `?language=` query param, `localStorage`, or browser locale, plus a nav-bar toggle.
- Dark/blue/green themed CSS design tokens (`css/tokens.css`) and layout/components (`css/main.css`), with `prefers-reduced-motion` and `hover: hover and pointer: fine` guards.
- Restrained scroll motion (`js/motion.js`) using Lenis, GSAP + ScrollTrigger, and SplitType, loaded via CDN.
- Minimal `.stylelintrc.json` so the CI `stylelint` step has a resolvable config; pinned `eslint@8` in `ci.yml` since `eslint@9` dropped the legacy CLI flags the workflow relies on.
- Real Contact links (LinkedIn, GitHub, email) and Open Source portfolio card now point to the real GitHub profile.
- Software/Electrical Engineering portfolio cards now use honest, generic "confidential" descriptions in place of fabricated specifics, since the real projects are private/NDA-protected company work.
- Generated `assets/favicon.svg` (monogram + circuit motif) and `assets/social-preview.svg`, wired up via `<link rel="icon">` and Open Graph/Twitter meta tags with a canonical URL for `adrianbatista.com`.
- Added a profile photo slot in the hero (`assets/profile.jpg`, not yet provided) with a graceful "AB" initials-avatar fallback in `js/main.js` until the real file is added.
- Experience timeline now shows real dates and a 1–2 sentence description per role, sourced from the user's resume: IFSP (Jan 2014 – Jan 2015), UNESP (Jan 2016 – Jan 2021), and three Hitachi Energy roles (Engineering Internship, Mid-level Software Developer, Senior Software Development Analyst) spanning Feb 2021 – Present.
- Added "Creo Toolkit" to the Technologies → Engineering group, per the resume.
- Publications → Academic now shows the real thesis title and a 1–2 sentence summary (EN + translated PT resumo) above the repository link.
- Completed the browser-only Background Remover with drag-and-drop upload, ONNX/IS-Net neural segmentation, WebGPU/CPU fallback, transparent preview, PNG download, bilingual copy, and an implementation article.
- Added a bilingual UUID Generator with local v1, v4 (default), and v7 generation, copy support, project listing, and an article covering UUID history, motivation, versions, and usage.
- Added a bilingual Chess Study Environment that loads local PDFs and annotated multi-game PGNs, provides game/variation navigation on a responsive chessboard, renders two-column books one calibrated column at a time, and restores the active study through IndexedDB.
- Added local chess-diagram recognition to Chess Study: the active PDF page is scanned for printed boards, detected diagrams become accessible overlays, and selected diagrams are matched against indexed PGN positions with automatic high-confidence navigation and an ambiguity fallback.
- Added full client-side chess-piece recognition to Chess Study using a vendored ONNX model. Reliable PDF positions without a PGN match are appended as setup-position games, and a new local PGN is created when no PGN is loaded.
- Added legal move editing to the Chess Study board, including automatic PGN updates, alternative-line creation, promotion selection, and keyboard move input.

### Fixed

- Chess Study now recognizes every game in compact PGN databases that omit conventional blank lines between headers, movetext, or adjacent records, and normalizes common zero-based castling notation (`0-0` / `0-0-0`) before parsing.
- Chess Study PDF clearing, panel-specific drag-and-drop, full-page defaults, and automatic fit behavior now cleanly reset and size the reader.

### Known gaps

- Portfolio project details, technical article links, and study notes remain placeholders flagged with `TODO` comments in `index.html`.
- Real profile photo file (`assets/profile.jpg`) has not been provided yet.
