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

### Known gaps

- Portfolio project details, technical article links, study notes, and contact URLs (LinkedIn/GitHub/email) are placeholders flagged with `TODO` comments in `index.html`.
