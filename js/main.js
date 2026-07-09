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

document.addEventListener("DOMContentLoaded", () => {
  initI18n();
  initNavToggle();
  initHeaderScrollState();
  initMotion();
});
