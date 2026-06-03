window.addEventListener("load", () => {
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
});
