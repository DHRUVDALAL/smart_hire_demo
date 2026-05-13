function setupMobileNavigation() {
  const nav = document.querySelector(".saas-nav");
  const toggle = document.querySelector(".saas-nav-mobile-toggle");
  const menu = document.querySelector(".saas-nav-menu");

  if (!nav || !toggle || !menu) return;

  const closeMenu = () => {
    nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  };

  const openMenu = () => {
    nav.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("menu-open");
    if (isOpen) {
      closeMenu();
      return;
    }
    openMenu();
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  menu.setAttribute("aria-hidden", "true");
}

function setupScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.1,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNavigation();
  setupScrollReveal();
});
