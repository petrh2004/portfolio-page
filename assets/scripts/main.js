const buttons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');

// Funktion zum Anzeigen der gewünschten Section
function showSection(id) {
  sections.forEach(section => {
    section.style.display = 'none';
  });

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'block';
  }

  // Aktiven Button markieren
  buttons.forEach(btn => {
    if (btn.dataset.id === id) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Event Listener für die Navigation
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.dataset.id;

    // URL-Hash aktualisieren
    window.location.hash = targetId;

    // Section anzeigen
    showSection(targetId);
  });
});

// Beim Laden der Seite die passende Section anzeigen
window.addEventListener('DOMContentLoaded', () => {
  let hash = window.location.hash.substring(1); // z. B. "kontakt"

  // Wenn kein Hash vorhanden ist → Standard auf #willkommen
  if (!hash) {
    window.location.hash = 'willkommen';
    hash = 'willkommen';
  }

  const validIds = Array.from(sections).map(sec => sec.id);
  const initialId = validIds.includes(hash) ? hash : 'willkommen';
  showSection(initialId);
});
