window.addEventListener("load", () => {
  const isMobile = window.matchMedia("(max-width: 639px)").matches;
  initGallerySwiper();
  if (isMobile) return;

  initProjectAnimation();
  initPeacockAnimation();
});

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
