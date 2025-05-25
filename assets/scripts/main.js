const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section');
const menuToggle = document.getElementById('menu-toggle');
const navContainer = document.getElementById('nav-container');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// =============================
// Menü öffnen/schliessen + Seite verschieben
// =============================
menuToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const menuIsHidden = navContainer.classList.toggle('hidden');
  menuToggle.setAttribute('aria-expanded', !menuIsHidden);
  document.body.classList.toggle('menu-open', !menuIsHidden);
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

// =============================
// Hashbasierte Navigation mit Icon-Wechsel
// =============================
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

  if (!window.location.hash) {
    window.location.hash = '#home';
  }
}

window.addEventListener('DOMContentLoaded', showSectionByHash);
window.addEventListener('hashchange', showSectionByHash);

// =============================
// DARK/LIGHT MODE mit System-Check + Speicherung
// =============================
function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  themeIcon.src = mode === 'dark'
    ? 'assets/images/moon.png'
    : 'assets/images/sun.png';
  localStorage.setItem('theme', mode);
}

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (storedTheme) {
  setTheme(storedTheme);
} else {
  setTheme(prefersDark.matches ? 'dark' : 'light');
}

if (!storedTheme) {
  prefersDark.addEventListener('change', (e) => {
    setTheme(e.matches ? 'dark' : 'light');
  });
}

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// =============================
// Werdegang-Auswahl speichern & wiederherstellen
// =============================
const werdegangButtons = document.querySelectorAll('.werdegang-btn');
const werdegangAbschnitte = document.querySelectorAll('.werdegang-abschnitt');

function setWerdegang(typ) {
  werdegangButtons.forEach(btn => {
    const isActive = btn.dataset.type === typ;
    btn.classList.toggle('active', isActive);
  });
  localStorage.setItem('werdegang', typ);
}

function showWerdegangContent(typ) {
  werdegangAbschnitte.forEach(abschnitt => {
    const isVisible = abschnitt.dataset.type === typ;
    abschnitt.style.display = isVisible ? 'block' : 'none';
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
  showSectionByHash(); // falls nicht schon separat aufgerufen
  const gespeicherterTyp = localStorage.getItem('werdegang') || 'schule';
  setWerdegang(gespeicherterTyp);
  showWerdegangContent(gespeicherterTyp);
});
