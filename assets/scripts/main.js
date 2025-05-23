const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section');
const timelineBtns = document.querySelectorAll('#about-contact .timeline-btn');

/** Anzeigen der passenden Section anhand des Hash **/
function showSectionByHash() {
  const id = window.location.hash.substring(1) || 'willkommen';
  const validIds = Array.from(sections).map(sec => sec.id);
  const targetId = validIds.includes(id) ? id : 'willkommen';

  sections.forEach(section => {
    section.hidden = section.id !== targetId;
  });
  links.forEach(link => {
    const isActive = link.getAttribute('href') === `#${targetId}`;
    link.classList.toggle('active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  // Default: Schulischer Werdegang aktiv auf Über-mich
  if (targetId === 'ueber-mich') {
    timelineBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === 0);
    });
  } else {
    timelineBtns.forEach(btn => btn.classList.remove('active'));
  }
}

// Initiale Anzeige
window.addEventListener('DOMContentLoaded', showSectionByHash);
// Auf Hash-Änderungen reagieren (Back/Forward)
window.addEventListener('hashchange', showSectionByHash);

// Klick auf Links verhindern Sprung und Hash setzen (für sanftes Wechseln)
links.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetHash = link.getAttribute('href');
    if (window.location.hash !== targetHash) {
      history.pushState(null, '', targetHash);
      showSectionByHash();
    }
  });
});

// Manuelle Aktivierung der Timeline-Buttons mit Anzeige-Logik
timelineBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const step = btn.dataset.step;
    // Aktive Klasse setzen
    timelineBtns.forEach(b => b.classList.toggle('active', b === btn));
    // Listen anzeigen/verstecken
    // Listen anzeigen/verstecken mit hidden
    document.querySelector('.timeline-school').hidden = step !== 'school';
    document.querySelector('.timeline-career').hidden = step !== 'career';
  });
});
