document.addEventListener('DOMContentLoaded', () => {
  const headerPlaceholder = document.getElementById('header-placeholder');

  if (headerPlaceholder) {
    fetch('header.html')
      .then(response => response.text())
      .then(data => {
        headerPlaceholder.innerHTML = data;

        // Highlight current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('.nav-links a[data-path]').forEach(link => {
          if (link.dataset.path === currentPage) {
            link.classList.add('active');
          }
        });

        // Mobile toggle
        const toggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (toggle && navLinks) {
          toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';

            toggle.setAttribute('aria-expanded', !expanded);
            navLinks.classList.toggle('open');
          });
        }
      })
      .catch(error => console.error('Header load error:', error));
  }
});