const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section');

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