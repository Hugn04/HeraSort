// Hero title intro plays on every viewport (desktop + mobile). Run it on
// DOMContentLoaded (not load) so it starts as soon as the markup is ready,
// without waiting for the hero video/images — keeps the entrance snappy and
// avoids a long gap where the (CSS-hidden) title is missing.
document.addEventListener("DOMContentLoaded", initHeroTitleAnimation);

window.addEventListener("load", () => {
  const isMobile = window.matchMedia("(max-width: 639px)").matches;
  if (isMobile) return;

  initProjectAnimation();
  initPeacockAnimation();
  initGallerySwiper();
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
  const peacock1 = document.querySelector(".peacock-1");
  const peacock2 = document.querySelector(".peacock-2");

  if (peacock1) {
    gsap.to(peacock1, {
      x: 0,
      skewX: -8,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  }

  if (peacock2) {
    gsap.to(peacock2, {
      x: 0,
      skewX: -6,
      duration: 2.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
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
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
  });
}
