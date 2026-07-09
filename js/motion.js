/**
 * motion.js — restrained motion layer: Lenis smooth scroll, GSAP + ScrollTrigger
 * entrance animations, SplitType hero headline split.
 *
 * Per instructions.md ("avoid excessive animations, flashy effects, marketing
 * aesthetics") this intentionally skips parallax, cursor-follow, and pinned
 * sections — only subtle opacity/transform entrances are used.
 */

function initSmoothScroll() {
  if (typeof window.Lenis !== "function") return null;

  const lenis = new window.Lenis({
    duration: 1.1,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.gsap && window.gsap.ticker) {
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  }

  return lenis;
}

function splitHeroHeadline() {
  const heading = document.querySelector(".hero-name");
  if (!heading || typeof window.SplitType !== "function") return;

  const fullText = heading.textContent;
  heading.setAttribute("aria-label", fullText);

  const split = new window.SplitType(heading, { types: "words" });

  if (window.gsap) {
    window.gsap.set(split.words, { opacity: 0, y: "0.4em" });
    window.gsap.to(split.words, {
      opacity: 1,
      y: "0em",
      duration: 0.7,
      stagger: 0.06,
      ease: "power2.out",
      delay: 0.15,
    });
  }
}

function initScrollEntrances() {
  if (!window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  const groups = [
    ".section-heading",
    ".section-intro",
    ".narrative-step",
    ".card",
    ".publications-group",
    ".tech-group",
    ".timeline-item",
    ".philosophy-quote",
  ];

  groups.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      window.gsap.set(el, { opacity: 0, y: 16 });
      window.gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });
  });
}

export function initMotion() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Respect user preference: skip smooth scroll hijacking and entrance
    // animations entirely, content stays fully visible and static.
    return;
  }

  initSmoothScroll();
  splitHeroHeadline();
  initScrollEntrances();
}
