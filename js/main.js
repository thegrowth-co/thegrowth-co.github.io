/* ============================================================
   TheGrowthCo. — page behaviour
   Header/footer/navigation live in includes/header-loader.js.
   This file only handles on-page behaviour.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Reveal elements on scroll ---------- */
  function setupReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!targets.length) return;

    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Contact form (Formspree AJAX) ---------- */
  function setupContactForm() {
    var form = document.querySelector("form[data-contact]");
    if (!form) return;

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      var status = form.querySelector("[data-status]");
      var submitBtn = form.querySelector('button[type="submit"]');

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";

      try {
        var response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });

        if (response.ok) {
          if (status) {
            status.textContent =
              "✅ Thank you! Your message has been sent successfully.";
          }
          form.reset();
        } else if (status) {
          status.textContent = "❌ Something went wrong. Please try again.";
        }
      } catch (error) {
        if (status) status.textContent = "❌ Network error. Please try again.";
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Send message <span class="arrow">↗</span>';
    });
  }

  function init() {
    setupReveal();
    setupContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
