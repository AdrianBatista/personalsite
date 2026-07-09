# Subproject Layout Guide

## Overview

The subproject layout (`css/subproject.css`) provides a minimal, consistent design system for project showcase pages within `projects/*/`. It inherits design tokens from the main site and reutilizes header/nav components, ensuring brand continuity while keeping individual project pages focused and lightweight.

## When to Use

Create a new subproject page when you want to showcase a specific project with:
- A detailed overview and problem statement
- Technical approach and design decisions
- Links to live demo, repository, or documentation
- Call-to-action back to main portfolio or other projects

## File Structure

Each subproject should follow this directory structure:

```
projects/
  your-project/
    index.html          # Main case study page (uses subproject layout)
    calculator.html     # (Optional) demo/app page
    styles.css          # (Optional) project-specific styles
    README.md           # (Optional) technical documentation
```

## HTML Template

Copy and adapt this structure for new subproject pages:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Project Name — Adrian Felipe Nogueira Batista</title>
  <meta name="description" content="Brief description of the project.">
  <link rel="icon" type="image/svg+xml" href="../../assets/favicon.svg">

  <!-- Always include in this order: tokens → main → subproject -->
  <link rel="stylesheet" href="../../css/tokens.css">
  <link rel="stylesheet" href="../../css/main.css">
  <link rel="stylesheet" href="../../css/subproject.css">
  
  <!-- Include main.js for i18n and nav toggle -->
  <script type="module" src="../../js/main.js"></script>
</head>
<body>
  <!-- Skip link for accessibility -->
  <a class="skip-link" href="#main" data-i18n="nav.skip">Skip to content</a>

  <!-- Header (same as main site) — adjust href attributes for relative path -->
  <header class="site-header" id="site-header">
    <!-- ... copy from main index.html, adjust paths to ../../ -->
  </header>

  <!-- Main content -->
  <main id="main">
    <!-- Project meta section -->
    <section class="subproject-meta">
      <!-- ... use .subproject-breadcrumb, .subproject-title, etc. -->
    </section>

    <!-- Project content sections -->
    <section class="subproject-content">
      <div class="subproject-content-inner">
        <!-- ... use .subproject-section, .subproject-grid, etc. -->
      </div>
    </section>
  </main>

  <!-- Footer (same as main site) -->
  <footer class="site-footer">
    <!-- ... copy from main index.html -->
  </footer>
</body>
</html>
```

## CSS Classes Reference

### Meta Section

**Container:** `.subproject-meta`
Contains breadcrumb, title, subtitle, and tags.

- `.subproject-breadcrumb` — Navigation hint; includes links and separators
- `.subproject-title` — Project name (h1)
- `.subproject-subtitle` — Brief tagline or description
- `.subproject-meta-tags` — Flex container for tags
- `.subproject-tag` — Individual tag chip

**Example:**
```html
<section class="subproject-meta">
  <div class="subproject-meta-inner">
    <div class="subproject-breadcrumb">
      <a href="../../index.html#portfolio">Portfolio</a>
      <span>/</span>
      <span>Category</span>
    </div>
    <div class="subproject-title-wrap">
      <h1 class="subproject-title">Project Name</h1>
      <p class="subproject-subtitle">Tagline</p>
    </div>
    <div class="subproject-meta-tags">
      <span class="subproject-tag">Tag 1</span>
      <span class="subproject-tag">Tag 2</span>
    </div>
  </div>
</section>
```

### Content Section

**Container:** `.subproject-content`
Houses all main content sections with constrained width.

#### Sections

`.subproject-section` — Each major content block (e.g., "Overview", "Key Features", "Technical Details").

- `.subproject-section-title` — Section heading (h2)
- `.subproject-section-content` — Paragraph content with auto-spacing

**Example:**
```html
<section class="subproject-content">
  <div class="subproject-content-inner">
    <div class="subproject-section">
      <h2 class="subproject-section-title">Overview</h2>
      <div class="subproject-section-content">
        <p>Description paragraph 1</p>
        <p>Description paragraph 2</p>
      </div>
    </div>
  </div>
</section>
```

#### Grids

`.subproject-grid` — Auto-layout grid for features, specs, or key points (3 cols on desktop, 1 on mobile).

- `.subproject-grid-item` — Individual card
- `.subproject-grid-item-title` — Label (styled in monospace, accent-green)
- `.subproject-grid-item-value` — Content text

**Example:**
```html
<div class="subproject-grid">
  <div class="subproject-grid-item">
    <div class="subproject-grid-item-title">Feature 1</div>
    <div class="subproject-grid-item-value">Description here</div>
  </div>
  <div class="subproject-grid-item">
    <div class="subproject-grid-item-title">Feature 2</div>
    <div class="subproject-grid-item-value">Description here</div>
  </div>
</div>
```

#### Code Blocks

`.subproject-code-block` — For code examples or technical snippets.

**Example:**
```html
<div class="subproject-code-block">
  <pre><code>const result = calculateSalary(gross);</code></pre>
</div>
```

#### Links / CTAs

`.subproject-links` — Flex container for action buttons or links.

- `.subproject-link` — Styled link with animated arrow on hover

**Example:**
```html
<div class="subproject-links">
  <a href="./calculator.html" class="subproject-link">Open Calculator</a>
  <a href="https://github.com/project-repo" class="subproject-link">GitHub</a>
</div>
```

#### Call-to-Action

`.subproject-cta` — Highlighted box for next steps or related projects.

**Example:**
```html
<div class="subproject-cta">
  <p class="subproject-cta-text">
    Interested in similar work? 
    <strong><a href="../../index.html#portfolio">Explore more projects</a></strong>.
  </p>
</div>
```

## Design Tokens

All subproject pages use the shared design tokens from `css/tokens.css`:

| Token | Purpose | Example |
|-------|---------|---------|
| `--bg` | Main background | `#0b0d10` (dark navy) |
| `--bg-elevated` | Elevated surfaces (cards, blocks) | `#12151a` |
| `--text-primary` | Headings, main text | Light gray |
| `--text-secondary` | Body text, descriptions | Medium gray |
| `--text-muted` | Secondary info, meta | Dim gray |
| `--accent-blue` | Primary interactive, links | `#4f9dff` |
| `--accent-green` | Labels, highlights | `#5fd88f` |
| `--space-*` | Spacing scale (xs–3xl) | `0.25rem` to `9rem` |
| `--font-size-*` | Fluid type scale (sm–2xl) | Responsive, clamp-based |
| `--font-mono` | Code, labels, meta | JetBrains Mono, SFMono |
| `--font-sans` | Body text, UI | System font stack |
| `--duration-fast` | Quick transitions | `0.2s` |
| `--ease-out` | Easing curve | `cubic-bezier(0.16, 1, 0.3, 1)` |

**Do not override these tokens.** If you need project-specific colors or spacing, extend in a project stylesheet (`projects/your-project/styles.css`) rather than modifying shared tokens.

## Internationalization (i18n)

The layout respects the i18n system from the main site. Bilingual strings in the header/footer are automatically translated based on `localStorage` or query parameter (`?language=en`/`?language=pt`).

For project-specific content, use plain text or add entries to `js/i18n.js` if translations are needed.

## Responsive Behavior

The layout is mobile-first and responsive:

- **Desktop (48rem+):** Full layout, 3-column grid, flexbox navigation
- **Tablet (24–48rem):** Adjusted spacing, 2-column grid on some sections
- **Mobile (<24rem):** Single column, stacked navigation, condensed spacing

Motion is automatically disabled on devices that prefer reduced motion (`prefers-reduced-motion: reduce`).

## Common Patterns

### Breadcrumb with Portfolio Link

```html
<div class="subproject-breadcrumb">
  <a href="../../index.html#portfolio">Portfolio</a>
  <span>/</span>
  <span>Software Engineering</span>
</div>
```

### Grouped Links

```html
<div class="subproject-links">
  <a href="./demo.html" class="subproject-link">Live Demo</a>
  <a href="https://github.com/username/repo" class="subproject-link">Source Code</a>
  <a href="../../index.html" class="subproject-link">Back Home</a>
</div>
```

### Feature Comparison Grid

```html
<div class="subproject-grid">
  <div class="subproject-grid-item">
    <div class="subproject-grid-item-title">Accuracy</div>
    <div class="subproject-grid-item-value">Up-to-date tax rules and algorithms</div>
  </div>
  <div class="subproject-grid-item">
    <div class="subproject-grid-item-title">Speed</div>
    <div class="subproject-grid-item-value">Client-side calculations, instant results</div>
  </div>
</div>
```

## Best Practices

1. **Keep it simple:** Use the provided classes; avoid adding custom wrappers.
2. **Maintain consistency:** Use section headings (h2) within `.subproject-section`, not arbitrary heading levels.
3. **Semantic HTML:** Use `<strong>` for emphasis in text, not `<b>`.
4. **Accessibility:** Include meaningful link text, descriptive `alt` attributes on images, and semantic headings.
5. **Relative paths:** Always use `../../` to reference main site assets (css, js, index.html).
6. **No overrides:** Extend with a project stylesheet if needed; don't modify `subproject.css` directly.

## Example Project

See [projects/net-salary-calculator/index.html](../projects/net-salary-calculator/index.html) for a complete example showcasing all available components.

## Questions or Improvements?

If you encounter issues or want to extend the layout, discuss changes in a pull request and update both this guide and the live example project.
