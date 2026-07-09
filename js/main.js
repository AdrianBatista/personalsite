import { initI18n } from "./i18n.js";
import { initMotion } from "./motion.js";

function initNavToggle() {
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeaderScrollState() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const setState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  setState();
  window.addEventListener("scroll", setState, { passive: true });
}

function initHeroPhotoFallback() {
  const photo = document.getElementById("hero-photo");
  const fallback = document.getElementById("hero-photo-fallback");
  if (!photo || !fallback) return;

  const showFallback = () => {
    photo.hidden = true;
    fallback.hidden = false;
  };

  // The image may have already failed to load by the time this module runs
  // (deferred scripts execute after the initial HTML parse), so the "error"
  // event could have fired before a listener was attached. Check the
  // already-settled state first, then listen for future failures too.
  if (photo.complete && photo.naturalWidth === 0) {
    showFallback();
  } else {
    photo.addEventListener("error", showFallback);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initNavToggle();
  initHeaderScrollState();
  initHeroPhotoFallback();
  initMotion();
});
