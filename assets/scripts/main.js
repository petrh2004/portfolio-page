const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section');
const menuToggle = document.getElementById('menu-toggle');
const navContainer = document.getElementById('nav-container');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// =============================
// Menü öffnen/schliessen
// =============================
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  navContainer.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', !navContainer.classList.contains('hidden'));
});

// Klick außerhalb schliesst Menü
document.addEventListener('click', (e) => {
  if (!navContainer.contains(e.target) && !menuToggle.contains(e.target)) {
    navContainer.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

// Klick auf Link schliesst Menü
links.forEach(link => {
  link.addEventListener('click', () => {
    navContainer.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// =============================
// Hashbasierte Navigation mit Icon-Wechsel
// =============================
function showSectionByHash() {
  const id = window.location.hash.substring(1) || 'willkommen';
  const validIds = Array.from(sections).map(sec => sec.id);
  const targetId = validIds.includes(id) ? id : 'willkommen';

  // Sections ein-/ausblenden
  sections.forEach(section => {
    section.hidden = section.id !== targetId;
  });

  // Navigation Links aktivieren & Icons wechseln
  links.forEach(link => {
    const isActive = link.getAttribute('href') === `#${targetId}`;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : '');

    const icon = link.querySelector('img');
    if (icon && icon.dataset.default && icon.dataset.active) {
      icon.src = isActive ? icon.dataset.active : icon.dataset.default;
    }
  });
}

window.addEventListener('DOMContentLoaded', showSectionByHash);
window.addEventListener('hashchange', showSectionByHash);

// =============================
// DARK/LIGHT MODE Umschalter
// =============================
function setTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.src = 'assets/images/moon.png';
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.src = 'assets/images/sun.png';
    localStorage.setItem('theme', 'light');
  }
}

// Initiales Theme setzen
const storedTheme = localStorage.getItem('theme');
if (storedTheme) {
  setTheme(storedTheme);
} else {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

// Theme Toggle-Button
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});
