const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });
}

// Persist the visitor's theme preference.
const themeButton = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("binyam-theme");
if (savedTheme === "dark") document.body.classList.add("dark-theme");
function updateThemeButton() {
  if (!themeButton) return;
  const dark = document.body.classList.contains("dark-theme");
  themeButton.textContent = dark ? "☀" : "☾";
  themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  themeButton.title = dark ? "Switch to light theme" : "Switch to dark theme";
}
updateThemeButton();
if (themeButton) themeButton.addEventListener("click", () => {
  const dark = document.body.classList.toggle("dark-theme");
  localStorage.setItem("binyam-theme", dark ? "dark" : "light");
  updateThemeButton();
});

// Reveal sections as they enter the viewport.
document.documentElement.classList.add("js-ready");
const revealTargets = document.querySelectorAll(".hero-copy, .hero-art, .trust-inner, .section-heading, .project-card, .honesty-note, .service-card, .process-list article, .contact-inner");
revealTargets.forEach((el, index) => {
  el.classList.add("reveal-on-scroll");
  if (el.classList.contains("service-card")) el.style.transitionDelay = `${(index % 3) * 90}ms`;
});
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach(el => revealObserver.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add("is-visible"));
}

// Tap/click gallery screenshots to view them in an accessible lightbox.
const lightbox = document.querySelector(".lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxCaption = document.querySelector(".lightbox-caption");
const galleryImages = Array.from(document.querySelectorAll(".project-gallery img"));
let activeImageIndex = 0;
let lastFocusedElement = null;
function showImage(index) {
  if (!galleryImages.length) return;
  activeImageIndex = (index + galleryImages.length) % galleryImages.length;
  const source = galleryImages[activeImageIndex];
  lightboxImage.src = source.currentSrc || source.src;
  lightboxImage.alt = source.alt;
  lightboxCaption.textContent = source.closest("figure")?.querySelector("figcaption")?.textContent || source.alt;
  document.querySelector(".lightbox-prev").hidden = galleryImages.length < 2;
  document.querySelector(".lightbox-next").hidden = galleryImages.length < 2;
}
function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showImage(index);
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  document.querySelector(".lightbox-close").focus();
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lightboxImage.removeAttribute("src");
  if (lastFocusedElement) lastFocusedElement.focus();
}
galleryImages.forEach((img, index) => {
  img.setAttribute("tabindex", "0");
  img.setAttribute("role", "button");
  img.setAttribute("aria-label", `View larger image: ${img.alt}`);
  img.addEventListener("click", () => openLightbox(index));
  img.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openLightbox(index); }
  });
});
document.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
document.querySelector(".lightbox-prev")?.addEventListener("click", () => showImage(activeImageIndex - 1));
document.querySelector(".lightbox-next")?.addEventListener("click", () => showImage(activeImageIndex + 1));
lightbox?.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showImage(activeImageIndex - 1);
  if (event.key === "ArrowRight") showImage(activeImageIndex + 1);
});
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
