(function() {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu = document.getElementById('navMenu');
  const yearEl = document.getElementById('year');
  const resumeLink = document.getElementById('resumeLink');
  const resumeObject = document.getElementById('resumeObject');

  // Persist theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    if (savedTheme === 'light') root.classList.add('light');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      root.classList.add('light');
    }
  }

  function updateToggleIcon() {
    if (root.classList.contains('light')) {
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  }

  themeToggle?.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem('theme', root.classList.contains('light') ? 'light' : 'dark');
    updateToggleIcon();
  });
  updateToggleIcon();

  // Mobile nav
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navMenu?.classList.toggle('open');
  });

  navMenu?.addEventListener('click', (e) => {
    const target = e.target;
    if (target.tagName === 'A') {
      navMenu.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.length <= 1) return;
      const section = document.querySelector(href);
      if (!section) return;
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    });
  });

  // Year
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const isHttp = location.protocol === 'http:' || location.protocol === 'https:';

  // Resume availability check (button) - only when served over HTTP(S)
  if (isHttp && resumeLink) {
    fetch(resumeLink.href, { method: 'HEAD' }).then((res) => {
      if (!res.ok) throw new Error('Missing');
    }).catch(() => {
      resumeLink.classList.add('is-disabled');
      resumeLink.setAttribute('aria-disabled', 'true');
      resumeLink.removeAttribute('href');
      resumeLink.textContent = 'Resume unavailable';
      resumeLink.title = 'Place Resume.pdf in /resume to enable this link';
    });
  }

  // Resume availability check (embed) - only when served over HTTP(S)
  if (isHttp && resumeObject) {
    const src = resumeObject.getAttribute('data');
    fetch(src, { method: 'HEAD' }).then((res) => {
      if (!res.ok) throw new Error('Missing');
    }).catch(() => {
      const embedContainer = resumeObject.closest('.pdf-embed');
      if (embedContainer) embedContainer.style.display = 'none';
      const fallback = document.querySelector('.pdf-fallback');
      if (fallback) fallback.textContent = 'Resume unavailable. Place Resume.pdf in /resume to enable this section.';
    });
  }
})(); 