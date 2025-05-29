const sections = document.querySelectorAll('main section');
const menuToggle = document.querySelector('.menu-toggle');
const navContainer = document.querySelector('.nav-container');
const links = document.querySelectorAll('.nav-link');
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const werdegangButtons = document.querySelectorAll('.werdegang-btn');
const werdegangAbschnitte = document.querySelectorAll('.werdegang-abschnitt');

/* =============================
  Menu öffnen/schliessen
============================= */
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const hidden = navContainer.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', !hidden);
  document.body.classList.toggle('menu-open', !hidden);
});

document.addEventListener('click', (e) => {
  if (!navContainer.contains(e.target) && !menuToggle.contains(e.target)) {
    navContainer.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }
});

links.forEach(link => {
  link.addEventListener('click', () => {
    navContainer.classList.add('hidden');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
});

/* ============================
  Seitenwechsel + Menu-Änderung
============================ */
function showSectionByHash() {
  const id = window.location.hash.substring(1) || 'home';
  const validIds = Array.from(sections).map(sec => sec.id);
  const targetId = validIds.includes(id) ? id : 'home';

  sections.forEach(section => {
    section.hidden = section.id !== targetId;
  });

  links.forEach(link => {
    const isActive = link.getAttribute('href') === `#${targetId}`;
    link.classList.toggle('active', isActive);
    link.setAttribute('aria-current', isActive ? 'page' : '');

    const icon = link.querySelector('img');
    if (icon && icon.dataset.default && icon.dataset.active) {
      icon.src = isActive ? icon.dataset.active : icon.dataset.default;
    }
  });

  localStorage.setItem('lastTab', `#${targetId}`);
}

window.addEventListener('DOMContentLoaded', showSectionByHash);
window.addEventListener('hashchange', showSectionByHash);

/* =============================
  Letzte Seite öffnen (Neuladen)
============================= */
const savedHash = localStorage.getItem('lastTab') || '#home';
if (!location.hash) location.hash = savedHash;

/* ==============================
  Hell-/Dunkelmodus + Speicherung
============================== */
function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  themeIcon.src = mode === 'dark'
    ? 'assets/images/moon.png'
    : 'assets/images/sun.png';
  localStorage.setItem('theme', mode);
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================
  Timeline-Knöpfe + Speicherung
============================ */
function setWerdegang(typ) {
  werdegangButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === typ);
  });
  localStorage.setItem('werdegang', typ);
}

function showWerdegangContent(typ) {
  werdegangAbschnitte.forEach(abschnitt => {
    abschnitt.style.display = abschnitt.dataset.type === typ ? 'block' : 'none';
  });
}

werdegangButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const typ = btn.dataset.type;
    setWerdegang(typ);
    showWerdegangContent(typ);
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const gespeicherterTyp = localStorage.getItem('werdegang') || 'schule';
  setWerdegang(gespeicherterTyp);
  showWerdegangContent(gespeicherterTyp);
});

const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (prefersDark ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);