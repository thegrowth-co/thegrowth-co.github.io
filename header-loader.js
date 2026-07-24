document.addEventListener("DOMContentLoaded", () => {
  const headerPlaceholder = document.getElementById("header-placeholder");
  const footerPlaceholder = document.getElementById("footer-placeholder");

  fetch("header.html")
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");

      if (headerPlaceholder) {
        const header = doc.querySelector("header");
        if (header) {
          headerPlaceholder.innerHTML = header.outerHTML;
        }
      }

      if (footerPlaceholder) {
        const footer = doc.querySelector("footer");
        if (footer) {
          footerPlaceholder.innerHTML = footer.outerHTML;
        }
      }

      // Highlight current page
      const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

      document.querySelectorAll(".nav-links a[data-path]").forEach(link => {
        if (link.dataset.path === currentPage) {
          link.classList.add("active");
        }
      });

      // Mobile menu
      const toggle = document.querySelector(".nav-toggle");
      const navLinks = document.querySelector(".nav-links");

      if (toggle && navLinks) {
        toggle.addEventListener("click", () => {
          const expanded =
            toggle.getAttribute("aria-expanded") === "true";

          toggle.setAttribute("aria-expanded", !expanded);
          document.body.classList.toggle("nav-open");
        });
      }

      // Footer year
      const year = document.getElementById("year");
      if (year) {
        year.textContent = new Date().getFullYear();
      }
    })
    .catch(err => console.error("Layout load error:", err));
});
