window.addEventListener("load", () => {
  initMobileMenu();
  initHeaderScroll();
});

function initMobileMenu() {
  const siteHeader = document.querySelector(".site-header");
  const btnOpen = document.querySelector(".button-toggle-sidebar");
  const btnClose = document.querySelector(".btn-close-sidebar");

  if (!siteHeader || !btnOpen || !btnClose) return;

  btnOpen.addEventListener("click", () => {
    siteHeader.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  btnClose.addEventListener("click", () => {
    siteHeader.classList.remove("active");
    document.body.style.overflow = "";
  });
}

// Smart header:
//  - scrolling DOWN tucks the bar up out of view, scrolling UP brings it back
//  - once you're past ~500px the bar condenses into a frosted-glass version so
//    the white nav stays readable over any content underneath
// GSAP drives the slide (transform); CSS transitions handle the glass morph
// (animating backdrop-filter is far smoother via CSS than via JS).
function initHeaderScroll() {
  const header = document.querySelector(".header");
  const nav = document.querySelector(".site-header");
  if (!header || !nav || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  const COMPACT_AT = 500; // px scrolled before the bar condenses + frosts over
  const rootFontPx = () =>
    parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;

  // Desktop only — on mobile `.site-header` is the slide-in menu, so we leave
  // it alone. Skipped entirely when the user prefers reduced motion.
  // gsap.matchMedia() auto-tears-down/rebuilds as the viewport crosses 640px.
  gsap.matchMedia().add(
    "(min-width: 640px) and (prefers-reduced-motion: no-preference)",
    () => {
      // `.header` has no intrinsic height (its nav is absolutely positioned),
      // so slide it by a fixed distance (~11rem) that always clears the bar in
      // both its full and condensed states. Function value re-evaluates on
      // refresh so it stays correct when the responsive root font-size changes.
      const hide = gsap.to(header, {
        y: () => -11 * rootFontPx(),
        duration: 0.5,
        ease: "power3.out",
        paused: true,
      });
      const keepDistanceFresh = () => hide.invalidate();
      ScrollTrigger.addEventListener("refresh", keepDistanceFresh);

      const trigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const y = self.scroll();
          // Condense + frosted glass once past the threshold.
          header.classList.toggle("is-compact", y > COMPACT_AT);
          // Near the top (or while the menu is open): always visible.
          // Otherwise hide on scroll-down, reveal on scroll-up.
          if (y <= COMPACT_AT || nav.classList.contains("active")) {
            hide.reverse();
          } else if (self.direction === 1) {
            hide.play();
          } else {
            hide.reverse();
          }
        },
      });

      return () => {
        ScrollTrigger.removeEventListener("refresh", keepDistanceFresh);
        trigger.kill();
        hide.kill();
        gsap.set(header, { clearProps: "transform" });
        header.classList.remove("is-compact");
      };
    }
  );
}
