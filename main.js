// TheGrowthCo. — unified script
(function () {
  // Mobile nav toggle
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', () => {
      header.classList.toggle('nav-open');
      const expanded = header.classList.contains('nav-open');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => header.classList.remove('nav-open'));
    });
  }

  // Active link based on pathname
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-path]').forEach(a => {
    if (a.getAttribute('data-path') === path) a.classList.add('active');
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Set year in footer
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Contact form (Formspree AJAX)
const form = document.querySelector("form[data-contact]");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = form.querySelector("[data-status]");
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (response.ok) {
        if (status) {
          status.textContent = "✅ Thank you! Your message has been sent successfully.";
        }
        form.reset();
      } else {
        if (status) {
          status.textContent = "❌ Something went wrong. Please try again.";
        }
      }
    } catch (error) {
      if (status) {
        status.textContent = "❌ Network error. Please try again.";
      }
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send message <span class="arrow">↗</span>';
  });
}
    });
  }
})();
