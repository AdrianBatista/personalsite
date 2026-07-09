# AGENTS.md

## Project Overview

This repository will hold the personal website for **Adrian Felipe Nogueira Batista** — an Electrical Engineer specialized in software development for engineering. The site's positioning, tone, content structure, and design philosophy are fully specified in [instructions.md](instructions.md), which is the **source of truth** for scope and messaging. Read it before making any content or structural decision.

**Current state:** the repository contains only planning/vision documentation and AI configuration. No application code, pages, or assets exist yet. Do not assume a `src/`, `public/`, or framework directory layout exists until it has actually been created.

## Tech Stack

- **Frontend:** Plain HTML5 / CSS3 / vanilla JavaScript (ES modules) — no framework (no React/Vue/Next.js).
- **Motion & interaction:** [GSAP](https://gsap.com/) (with `ScrollTrigger`) for scroll-driven animation and timeline sequencing, [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling, [SplitType](https://github.com/lukePeavey/SplitType) for accessible typography chunking — per [.github/skills/premium-frontend-ui/SKILL.md](.github/skills/premium-frontend-ui/SKILL.md).
- **Hosting/build:** not yet decided. Do not introduce a bundler, framework, or package manager speculatively — confirm with the repo owner first if one becomes necessary.

Never hardcode a library version in this file. If dependencies are added, check the actual manifest (e.g. `package.json` once one exists) for the pinned version.

## Repository Structure

```
instructions.md                        # Website vision, brand positioning, content plan (source of truth)
AGENTS.md                              # This file
.github/
  copilot-instructions.md              # Coding conventions and maintenance matrix for AI agents
  skills/
    premium-frontend-ui/SKILL.md       # Motion/visual craftsmanship guidance for the frontend
  workflows/
    ci.yml                             # Lint/validate HTML, CSS, JS
    copilot-setup-steps.yml            # Environment bootstrap for the Copilot coding agent
  ISSUE_TEMPLATE/                      # Bug report / feature request forms
  PULL_REQUEST_TEMPLATE.md
README.md                              # Project summary + contributing instructions
CHANGELOG.md                           # Keep a Changelog-format history
```

**Planned (not yet created)** — once scaffolding begins, expect roughly:

```
index.html            # Home (hero, who/what/why)
about.html             # About — narrative journey (Automation → EE → Software → Engineering Software)
portfolio.html         # Engineering Portfolio (Software / Electrical / Research / Open Source)
publications.html      # Publications & Studies (academic, articles, notes)
technologies.html      # Technologies grouped by purpose, not a logo wall
experience.html        # Experience timeline
philosophy.html        # Philosophy statement
contact.html           # Minimal contact (LinkedIn, GitHub, email)
css/
js/
assets/
```

This may end up as a single scrolling page instead of separate HTML files (the vision document leans toward "cinematic pacing" and narrative flow) — decide deliberately and update this section when the real structure is created.

## Build & Run

No build step exists yet. Once HTML/CSS/JS files are added, they can be served with any static file server (e.g. `npx serve .` or the VS Code Live Server extension). Update this section with the real command as soon as one is established.

## Testing

No automated tests exist yet. CI currently only lints/validates markup, styles, and scripts (see [.github/workflows/ci.yml](.github/workflows/ci.yml)). If interactive/animated components are added, prefer manual QA across breakpoints plus a Lighthouse/accessibility pass before merging, per the performance and accessibility rules in the premium-frontend-ui skill.

## Key Patterns and Conventions

- Follow the brand positioning and tone rules in [instructions.md](instructions.md) exactly — technical, precise, documentation-like; never marketing language or buzzwords.
- Follow the visual/motion craftsmanship rules in [.github/skills/premium-frontend-ui/SKILL.md](.github/skills/premium-frontend-ui/SKILL.md): dark theme, blue/green accents, restrained animation, `transform`/`opacity`-only animations, `prefers-reduced-motion` support, `hover: hover and pointer: fine` guards around cursor/hover-heavy effects.
- Organize portfolio/content by **category** (Software Engineering, Electrical Engineering, Research, Open Source), not by technology/logo wall, as specified in instructions.md.

## Adding a New Page or Section

When adding a new page or major section, update the full chain, not just the new file:

1. Create the page/section markup and its dedicated CSS/JS (if any).
2. Register it in the site navigation (once a nav component exists).
3. Add/update the entry in [instructions.md](instructions.md)'s Site Structure section if the content plan changes.
4. Update the "Planned" structure listing in this file to match reality once real files exist.
5. If the new section introduces a new content category (e.g. a new portfolio type), update the maintenance matrix in [.github/copilot-instructions.md](.github/copilot-instructions.md).

## CI/CD

- [ci.yml](.github/workflows/ci.yml) — lints HTML/CSS/JS on pull requests and pushes. Steps are conditional on matching files existing, since the site has not been scaffolded yet.
- [copilot-setup-steps.yml](.github/workflows/copilot-setup-steps.yml) — bootstraps the environment for the Copilot coding agent (Node.js for lint tooling via `npx`).

## Common Pitfalls

- Do not introduce a framework (React/Next.js/etc.) — the stack decision is plain HTML/CSS/JS.
- Do not add logo-wall style technology lists — group by purpose per instructions.md.
- Do not use marketing language ("I know Python") — use impact-oriented language ("I develop software that improves engineering workflows").
- Do not animate layout-triggering CSS properties (`width`, `height`, `top`, `margin`); only `transform`/`opacity`.
- Do not assume directories like `src/` or `public/` exist — verify with `list_dir` before referencing paths.
