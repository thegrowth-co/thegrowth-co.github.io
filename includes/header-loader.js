/* ============================================================
   TheGrowthCo. — sitewide layout loader
   Injects includes/header.html + includes/footer.html into every
   page, then wires up navigation behaviour.

   Usage on any page (any folder depth):
     <div id="header-placeholder"></div>
     ...page content...
     <div id="footer-placeholder"></div>
     <script src="/includes/header-loader.js" defer></script>
   ============================================================ */
(function () {
  "use strict";

  var INCLUDES = "/includes/"; // site root — works at any folder depth

  function loadPart(url, placeholderId) {
    var placeholder = document.getElementById(placeholderId);
    if (!placeholder) return Promise.resolve();

    return fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("Could not load " + url);
        return response.text();
      })
      .then(function (html) {
        placeholder.innerHTML = html;
      });
  }

  /* ---------- Highlight the current page in the nav ---------- */
  function setActiveLink() {
    var path = window.location.pathname;
    var currentPage = path.replace(/\/$/, "/index.html").split("/").pop();
    var inBlog = path.indexOf("/blog/") !== -1;

    document.querySelectorAll(".nav-links a[data-path]").forEach(function (link) {
      var target = link.dataset.path;
      if (inBlog ? target === "blog" : target === currentPage) {
        link.classList.add("active");
      }
    });
  }

  /* ---------- Mobile navigation ---------- */
  function setupMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var navLinks = document.querySelector(".nav-links");
    if (!toggle || !navLinks) return;

    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Footer copyright year ---------- */
  function setYear() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }

  function init() {
    Promise.all([
      loadPart(INCLUDES + "header.html", "header-placeholder"),
      loadPart(INCLUDES + "footer.html", "footer-placeholder"),
    ])
      .then(function () {
        setActiveLink();
        setupMobileNav();
        setYear();
        document.dispatchEvent(new CustomEvent("layout:ready"));
      })
      .catch(function (err) {
        console.error("Layout load error:", err);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
