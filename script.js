"use strict";

/* =========================================================
   MINEURI
   JavaScript principal
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initializeMobileMenu();
  initializeCurrentYear();
  initializeHeaderScroll();
  initializeAnchorLinks();
  initializeWaitlistForm();
});


/* =========================================================
   MENÚ MÓVIL
========================================================= */

function initializeMobileMenu() {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".main-navigation");
  const navigationLinks = document.querySelectorAll(
    ".main-navigation a"
  );

  if (!menuButton || !navigation) {
    return;
  }

  const closeMenu = () => {
    menuButton.classList.remove("is-open");
    navigation.classList.remove("is-open");

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
  };

  const openMenu = () => {
    menuButton.classList.add("is-open");
    navigation.classList.add("is-open");

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Cerrar menú");
  };

  menuButton.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = navigation.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });
}


/* =========================================================
   AÑO AUTOMÁTICO
========================================================= */

function initializeCurrentYear() {
  const yearElement = document.querySelector("#current-year");

  if (!yearElement) {
    return;
  }

  yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   CABECERA AL HACER SCROLL
========================================================= */

function initializeHeaderScroll() {
  const header = document.querySelector(".site-header");

  if (!header) {
    return;
  }

  const updateHeader = () => {
    if (window.scrollY > 20) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true
  });
}


/* =========================================================
   ENLACES INTERNOS
========================================================= */

function initializeAnchorLinks() {
  const internalLinks = document.querySelectorAll(
    'a[href^="#"]:not([href="#"])'
  );

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId) {
        return;
      }

      const targetElement = document.querySelector(targetId);

      if (!targetElement) {
        return;
      }

      event.preventDefault();

      const header = document.querySelector(".site-header");
      const headerHeight = header
        ? header.offsetHeight
        : 0;

      const targetPosition =
        targetElement.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });

      history.replaceState(null, "", targetId);
    });
  });
}


/* =========================================================
   FORMULARIO DE LISTA DE ESPERA
========================================================= */

function initializeWaitlistForm() {
  const form = document.querySelector(".cta-form");

  if (!form) {
    return;
  }

  const emailInput = form.querySelector('input[type="email"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const formNote = document.querySelector(".form-note");

  if (!emailInput || !submitButton) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      showFormMessage(
        formNote,
        "Escribe un correo electrónico válido.",
        "error"
      );

      emailInput.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    window.setTimeout(() => {
      showFormMessage(
        formNote,
        "Gracias. Te avisaremos cuando Mineuri esté disponible.",
        "success"
      );

      form.reset();

      submitButton.disabled = false;
      submitButton.textContent = "Quiero saber más";
    }, 700);
  });
}


/* =========================================================
   VALIDACIÓN DE CORREO
========================================================= */

function isValidEmail(email) {
  const emailPattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  return emailPattern.test(email);
}


/* =========================================================
   MENSAJES DEL FORMULARIO
========================================================= */

function showFormMessage(element, message, type) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.classList.remove(
    "is-success",
    "is-error"
  );

  if (type === "success") {
    element.classList.add("is-success");
  }

  if (type === "error") {
    element.classList.add("is-error");
  }
}
