(function () {
  "use strict";

  /* ---------- Theme ---------- */
  const themeToggle = document.querySelector(".theme-toggle");
  const stored = localStorage.getItem("theme");

  if (stored) {
    document.documentElement.setAttribute("data-theme", stored);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }

  themeToggle.addEventListener("click", function () {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ---------- Hamburger ---------- */
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", function () {
    const open = this.getAttribute("aria-expanded") === "true" ? false : true;
    this.setAttribute("aria-expanded", open);
    navLinks.classList.toggle("open");
  });

  document.addEventListener("click", function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    }
  });

  /* ---------- Smooth scroll & active nav ---------- */
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];

  navAnchors.forEach(function (a) {
    const id = a.getAttribute("href").slice(1);
    const section = document.getElementById(id);
    if (section) sections.push({ el: section, link: a });
  });

  navAnchors.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const id = this.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      hamburger.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
    });
  });

  function updateActiveLink() {
    let current = sections[0];
    const scrollY = window.scrollY + 120;

    sections.forEach(function (item) {
      if (scrollY >= item.el.offsetTop) {
        current = item;
      }
    });

    sections.forEach(function (item) {
      item.link.classList.toggle("active", item === current);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("visible");
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
      const submitButton = form.querySelector('button[type="submit"]');
      let valid = true;

      [name, email, message].forEach(function (field) {
        field.classList.remove("error");
      });

      if (!name.value.trim()) {
        name.classList.add("error");
        valid = false;
      }

      if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
        email.classList.add("error");
        valid = false;
      }

      if (!message.value.trim()) {
        message.classList.add("error");
        valid = false;
      }

      if (!valid) {
        feedback.className = "form-feedback error";
        feedback.textContent = "Por favor completa todos los campos correctamente.";
        return;
      }

      submitButton.disabled = true;
      feedback.className = "form-feedback";
      feedback.textContent = "Enviando mensaje...";

      fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      })
        .then(function (response) {
          return response.json().then(function (data) {
            if (!response.ok || String(data.success) !== "true") {
              throw new Error(data.message || "No se pudo enviar el mensaje.");
            }
          });
        })
        .then(function () {
          feedback.className = "form-feedback success";
          feedback.textContent = "¡Mensaje enviado con éxito! Gracias por contactarme.";
          form.reset();
        })
        .catch(function () {
          feedback.className = "form-feedback error";
          feedback.textContent = "No se pudo enviar el mensaje. Inténtalo nuevamente o escríbeme directamente al correo.";
        })
        .finally(function () {
          submitButton.disabled = false;
        });
    });
  }
})();
