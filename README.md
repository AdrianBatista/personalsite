# Adrian Felipe Nogueira Batista — Personal Website

Personal website positioning Adrian as an Electrical Engineer specialized in software development for engineering — a professional who bridges both disciplines.

> Engineering better solutions through software.

## Status

**Core site is live and functional.** Single scrolling page (`index.html`) with:
- ✅ **About** — narrative journey (Industrial Automation → Electrical Engineering → Software Development → Engineering Software)
- ✅ **Portfolio** — 4 categories (Software Engineering, Electrical Engineering, Research, Open Source) with real project descriptions tied to resume experience
- ✅ **Publications & Studies** — real undergraduate thesis (title, summary, repository link)
- ✅ **Technologies** — grouped by purpose (Programming, Frameworks, Database, Engineering, Infrastructure)
- ✅ **Experience** — 5 employment entries from Jan 2014–Present with actual dates and role descriptions
- ✅ **Philosophy** — engineering ethos statement
- ✅ **Contact** — real LinkedIn, GitHub, and email links
- ✅ **Bilingual (EN/PT)** — language toggle with localStorage persistence

**Known remaining items:**
- Profile photo — slot is ready; awaiting `assets/profile.jpg` (square, ideally 480×480px+) to replace fallback avatar
- Open Source section — placeholder for real GitHub projects
- Live deployment — site ready for Vercel/CDN; custom domain `adrianbatista.com` configured

**Reference docs:**
- [instructions.md](instructions.md) — full brand positioning, content plan, design philosophy, and tone-of-voice guide. **Source of truth** for what the site should say and look like.
- [AGENTS.md](AGENTS.md) — tech stack, repository structure, and conventions for AI coding agents (and humans) working in this repo.

## Tech Stack

Plain HTML5 / CSS3 / vanilla JavaScript (ES modules, no build step or bundler):
- **Motion & scroll interaction:** [GSAP](https://gsap.com/) 3.12.5 (with ScrollTrigger), [Lenis](https://github.com/darkroomengineering/lenis) 1.1.13 for smooth scrolling
- **Typography animation:** [SplitType](https://github.com/lukePeavey/SplitType) 0.3.4 for staggered character/word entrance animations
- **Bilingual (EN/PT):** Custom i18n module (`js/i18n.js`) with language resolution from query param → localStorage → browser locale → default "en"

All libraries loaded via CDN (no npm dependencies). See [.github/skills/premium-frontend-ui/SKILL.md](.github/skills/premium-frontend-ui/SKILL.md) for motion/typography craftsmanship conventions.

## Contributing

1. **Read first** — [instructions.md](instructions.md) and [AGENTS.md](AGENTS.md) define the required tone, structure, content strategy, and tech stack. These are non-negotiable.
2. **Fork and branch** — create a feature branch for your changes.
3. **Lint before PR** — run all three checks locally:
   ```bash
   npx --yes html-validate "index.html"
   npx --yes stylelint "css/*.css" --allow-empty-input
   npx --yes eslint@8 "js/*.js" --no-eslintrc --env browser,es2021 --parser-options=ecmaVersion:2021,sourceType:module
   ```
   (These match the [.github/workflows/ci.yml](.github/workflows/ci.yml) CI pipeline.)
4. **Serve locally** — use `npx serve .` to test in a browser (ES modules require an HTTP server).
5. **Open a PR** — use the provided [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md).

## Running Locally

```bash
# Start a local static server
npx serve .

# Then open http://localhost:3000 in your browser
# To test Portuguese: http://localhost:3000/?language=pt
```

No build step. All changes are visible immediately after refresh.

## License

Not yet decided.
