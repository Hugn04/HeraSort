// Hero title intro plays on every viewport (desktop + mobile). Run it on
// DOMContentLoaded (not load) so it starts as soon as the markup is ready,
// without waiting for the hero video/images — keeps the entrance snappy and
// avoids a long gap where the (CSS-hidden) title is missing.
document.addEventListener("DOMContentLoaded", initHeroTitleAnimation);

window.addEventListener("load", () => {
  const isMobile = window.matchMedia("(max-width: 639px)").matches;
  initGallerySwiper();
  initGalleryFilter();
  if (isMobile) return;

  initProjectAnimation();
  initPeacockAnimation();
  initScrollReveals();
  initLocationGlow();
  initBirdAnimation();
});

function initHeroTitleAnimation() {
  const heroTitle = document.querySelector("#hero-title");
  if (!heroTitle) return;

  const groups = heroTitle.querySelectorAll(".hero-title__group");
  if (!groups.length) return;

  const lines = heroTitle.querySelectorAll(".gradient-title");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Users who prefer reduced motion just get the final state, no movement.
  if (reduceMotion) {
    gsap.set(lines, { autoAlpha: 1, yPercent: 0, filter: "blur(0px)" });
    return;
  }

  // ~1s after the site loads, each line rises up from below the water line,
  // un-blurring and fading in. Left cluster leads, right cluster follows.
  const tl = gsap.timeline({
    delay: 1,
    defaults: { duration: 1.2, ease: "power3.out" },
  });

  groups.forEach((group, i) => {
    const groupLines = group.querySelectorAll(".gradient-title");
    tl.fromTo(
      groupLines,
      { yPercent: 120, autoAlpha: 0, filter: "blur(10px)" },
      { yPercent: 0, autoAlpha: 1, filter: "blur(0px)", stagger: 0.15 },
      // First (left) group starts at 0; the right group starts shortly after
      // the left has begun so the order reads left → right.
      i === 0 ? 0 : "-=0.6"
    );
  });
}

function initProjectAnimation() {
  if (
    !document.querySelector(".project") ||
    !document.querySelector(".logo-text")
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".logo-text", {
    y: 300,
    duration: 1.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".project",
      start: "top 40%",
      // markers: true,
    },
  });
}

function initPeacockAnimation() {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  // Idle shimmer: a soft skew/scale sway anchored at the base of the tail, so
  // the feathers gently quiver rather than the whole image sliding sideways
  // (the previous `x: 0` tween broke the tail's centering). Two layers use
  // slightly different timing for a subtle parallax depth.
  const layers = [
    { el: document.querySelector(".peacock-1"), skew: 1.6, dur: 4 },
    { el: document.querySelector(".peacock-2"), skew: 2.4, dur: 3.4 },
  ];
  layers.forEach(({ el, skew, dur }) => {
    if (!el) return;
    gsap.set(el, { transformOrigin: "50% 100%", force3D: true });
    gsap.to(el, {
      skewX: skew,
      scaleY: 1.02,
      duration: dur,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      force3D: true,
    });
  });

  // Scroll interaction: the whole tail drifts gently as the section scrolls
  // through the viewport. Kept to translate-only (no `rotation`) and forced
  // onto a 3D/GPU layer so the scrub composites instead of repainting this
  // huge image every frame — rotating a ~1664px element on scroll was the
  // source of the stutter.
  const peacock = document.querySelector(".peacock");
  if (peacock) {
    gsap.fromTo(
      peacock,
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: "none",
        force3D: true,
        transformOrigin: "50% 100%",
        scrollTrigger: {
          trigger: ".investment",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      }
    );
  }
}

function initGallerySwiper() {
  const thumbEl = document.querySelector(".swiper-gallery-thumps");
  const mainEl = document.querySelector(".swiper-gallery-main");

  if (!thumbEl || !mainEl) return;

  const thumbsSwiper = new Swiper(thumbEl, {
    spaceBetween: 16,
    slidesPerView: 3,
    freeMode: true,
    watchSlidesProgress: true,
  });

  new Swiper(mainEl, {
    // spaceBetween: 10,
    navigation: {
      nextEl: ".gallery-button-next",
      prevEl: ".gallery-button-prev",
    },

    thumbs: {
      swiper: thumbsSwiper,
    },
  });
}

// Scroll-driven storytelling for the editorial sections:
//  - the project aerial image zooms gently (boat-prow-approaching feel)
//  - decorative wave graphics drift up/down with scroll
//  - each section's headline reveals first, then its body text
function initScrollReveals() {
  // Respect users who prefer reduced motion: leave everything in its final,
  // fully-visible state and skip the scroll effects.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero project aerial — a slow one-way zoom in to 1.12 that then holds,
  //    so the masterplan feels approached by boat and settles there (no zoom
  //    back). Auto-plays (not scroll-linked) so it is visible on the landing
  //    view. Scale both the video and its fallback image; the title stays put.
  const heroMedia = document.querySelectorAll(".hero-video, .hero .background");
  if (heroMedia.length) {
    gsap.fromTo(
      heroMedia,
      { scale: 1 },
      {
        scale: 1.12,
        transformOrigin: "50% 42%",
        duration: 8,
        ease: "power1.out",
      }
    );
  }

  // 2. Decorative wave graphic — drifts gently up and down, tied to scroll.
  const wave = document.querySelector(".graphic_super");
  if (wave) {
    gsap.fromTo(
      wave,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: wave,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  }

  // 3. Headline-then-body reveals for the three editorial sections.
  revealHeadlineThenBody(
    ".santorini",
    [".stacked-title span"],
    [".section-symbol", ".santorini-copy p"]
  );
  revealHeadlineThenBody(
    ".project",
    [".project-title span", ".project-title small"],
    [".section-symbol", ".project-facts .fact"]
  );
  revealHeadlineThenBody(
    ".location",
    [".location-head span"],
    [".location-slider"]
  );

  // 4. "Bản giao hưởng huyền thoại" quote — its two lines appear in sequence.
  revealHeadlineThenBody(
    ".quote",
    [".quote-copy .subtitle"],
    [".quote-copy .title-xl"]
  );

  // 5. Amenities — heading first, then the image cards rise in one by one.
  revealHeadlineThenBody(
    ".amenities",
    [".amenities-copy h2", ".amenities-copy p"],
    [".amenity-card"]
  );

  // 6. Investment ("Vạn trải nghiệm đa sắc") — heading reveals, then the whole
  //    carousel fades in (its cards are driven by Swiper autoplay, so we fade
  //    the container rather than transform individual slides).
  revealHeadlineThenBody(
    ".investment",
    [".investment-title h2", ".investment-title p"],
    [".investment-swiper"]
  );

  // 7. Gallery ("Hình ảnh" album) — the viewer and its filter ease in.
  revealHeadlineThenBody(
    ".gallery",
    [".gallery-filter"],
    [".gallery-swiper-wrapper"]
  );

  // 8. News — heading then the cards.
  revealHeadlineThenBody(".news", [".news h2"], [".news-card"]);

  // 9. Library — heading then the download cards.
  revealHeadlineThenBody(".library", [".library h2"], [".download-card"]);

  // 10. Partners / distribution units — heading then the logos appear gently.
  revealHeadlineThenBody(".partners", [".partners h2"], [".partner-card"]);
}

// Map "light radiating from the project" — a sonar pulse on the marker:
// a bright core + concentric rings expanding outward, over the ambient glow.
function initLocationGlow() {
  const location = document.querySelector(".location");
  if (!location) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Build the sonar overlay on the project marker (CSS positions it there).
  const pulse = document.createElement("div");
  pulse.className = "location-pulse";
  pulse.setAttribute("aria-hidden", "true");
  const core = document.createElement("span");
  core.className = "location-pulse__core";
  pulse.appendChild(core);
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement("span");
    ring.className = "location-pulse__ring";
    pulse.appendChild(ring);
    rings.push(ring);
  }
  location.appendChild(pulse);

  if (reduceMotion) {
    gsap.set(core, { opacity: 0.9 });
    return;
  }

  // Ambient glow (the ::after) gently breathing underneath.
  // gsap.fromTo(
  //   location,
  //   { "--glow-scale": 0.96, "--glow-opacity": 0.7 },
  //   {
  //     "--glow-scale": 1.08,
  //     "--glow-opacity": 1,
  //     duration: 3,
  //     ease: "sine.inOut",
  //     yoyo: true,
  //     repeat: -1,
  //   }
  // );

  // Bright core pulsing on the marker.
  gsap.to(core, {
    scale: 1.6,
    opacity: 0.6,
    duration: 1.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    transformOrigin: "50% 50%",
  });

  // Sonar rings radiating outward, evenly staggered for a continuous ripple.
  const period = 2.4;
  rings.forEach((ring, i) => {
    gsap.fromTo(
      ring,
      { scale: 0.3, opacity: 0.85 },
      {
        scale: 6,
        opacity: 0,
        duration: period,
        ease: "power1.out",
        repeat: -1,
        delay: (i * period) / rings.length,
        transformOrigin: "50% 50%",
      }
    );
  });
}

// Seagull glides in from off-screen (upper right) toward the centre of the
// quote section as the user scrolls, then settles. Scroll-linked (scrub).
function initBirdAnimation() {
  const bird = document.querySelector(".bird");
  if (!bird) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) {
    // No flight — just show the gull at its resting spot.
    gsap.set(bird, { autoAlpha: 1 });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Plays once the section scrolls into view — a self-paced glide, NOT tied to
  // scroll velocity (no scrub).
  gsap.fromTo(
    bird,
    { xPercent: 200, yPercent: -100, scale: 0.6, autoAlpha: 0 },
    {
      xPercent: 0,
      yPercent: 0,
      scale: 1,
      autoAlpha: 1,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".quote",
        start: "top 75%",
        once: true,
      },
    }
  );
}

// Reveal a section's headline first, then its body, when it scrolls into view.
// headlineSelectors / bodySelectors are arrays of selectors resolved *within*
// the section, so shared classes (e.g. .section-symbol) stay scoped.
function revealHeadlineThenBody(sectionSelector, headlineSelectors, bodySelectors) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const collect = (selectors) =>
    selectors.flatMap((s) => Array.from(section.querySelectorAll(s)));
  const heads = collect(headlineSelectors);
  const bodies = collect(bodySelectors);
  if (!heads.length && !bodies.length) return;

  const tl = gsap.timeline({
    scrollTrigger: { trigger: section, start: "top 72%", once: true },
    defaults: { ease: "power3.out" },
  });

  if (heads.length) {
    tl.from(heads, { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.14 });
  }
  if (bodies.length) {
    // Body follows shortly after the headline begins to settle.
    tl.from(
      bodies,
      { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.12 },
      "-=0.35"
    );
  }
}

// Gallery "Hình ảnh" album: the sub-tabs (THE HELIOS SIGNATURE, …) act as
// filters. Selecting one marks it active and crossfades the viewer to
// acknowledge the change.
// NOTE: swapping to a *different* image set per tab needs per-tab sources to be
// provided in the markup/data; this wires up the selection + transition.
function initGalleryFilter() {
  const tabs = Array.from(
    document.querySelectorAll(".gallery-filter ul li")
  );
  const viewer = document.querySelector(".gallery-swiper-wrapper");
  if (!tabs.length || !viewer) return;

  const setActive = (active) =>
    tabs.forEach((t) => t.classList.toggle("is-active", t === active));
  setActive(tabs[0]);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      if (tab.classList.contains("is-active")) return;
      setActive(tab);
      gsap.fromTo(
        viewer,
        { autoAlpha: 0.25, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    });
  });
}
