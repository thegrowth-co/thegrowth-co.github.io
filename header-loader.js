document.addEventListener("DOMContentLoaded", async () => {

    const headerPlaceholder = document.getElementById("header-placeholder");
    const footerPlaceholder = document.getElementById("footer-placeholder");

    // Detect current folder depth
    let path = window.location.pathname;

    // Remove filename if present
    path = path.replace(/\/[^/]*$/, "/");

    // Count folder depth
    const depth = path.split("/").filter(Boolean).length;

    // Build relative path back to root
    const basePath = "../".repeat(depth);

    try {

        const response = await fetch(basePath + "header.html");

        if (!response.ok) {
            throw new Error("Could not load header.html");
        }

        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Header
        if (headerPlaceholder) {
            const header = doc.querySelector("header");
            if (header) {
                headerPlaceholder.innerHTML = header.outerHTML;
            }
        }

        // Footer
        if (footerPlaceholder) {
            const footer = doc.querySelector("footer");
            if (footer) {
                footerPlaceholder.innerHTML = footer.outerHTML;
            }
        }

        /* ------------------------
           Active Navigation
        -------------------------*/

        let currentPage = window.location.pathname;

        if (currentPage.endsWith("/")) {
            currentPage += "index.html";
        }

        currentPage = currentPage.split("/").pop();

        document.querySelectorAll(".nav-links a[data-path]").forEach(link => {

            const target = link.dataset.path;

            // Highlight every page inside /blog/
            if (
                window.location.pathname.includes("/blog/") &&
                target === "blog"
            ) {
                link.classList.add("active");
            }

            // Normal pages
            else if (target === currentPage) {
                link.classList.add("active");
            }

        });

        /* ------------------------
           Mobile Navigation
        -------------------------*/

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

        /* ------------------------
           Footer Year
        -------------------------*/

        const year = document.getElementById("year");

        if (year) {
            year.textContent = new Date().getFullYear();
        }

    } catch (err) {

        console.error("Layout load error:", err);

    }

});
