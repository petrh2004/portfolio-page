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

/* ============================
  Email.js
============================ */
document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
});

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

function showSuccessMessage(messageText) {
  const box = document.querySelector(".success-box");
  if (!box) return;

  box.textContent = messageText;
  box.style.display = "flex";
  box.style.opacity = "1";

  setTimeout(() => {
    box.style.opacity = "0";
    setTimeout(() => {
      box.style.display = "none";
    }, 300);
  }, 5000);
}

function sendMailWithEmailJS(fields) {
  const serviceID = "service_i3j4cla";
  const templateID = "petrh2";

  const params = {
    name: fields.name.value,
    email: fields.email.value,
    subject: fields.subject.value,
    message: fields.message.value,
  };

  emailjs
    .send(serviceID, templateID, params)
    .then(() => {
      showSuccessMessage("Danke! Deine Nachricht wurde erfolgreich übermittelt. Wir melden uns so bald wie möglich bei dir zurück. ✅ ");
      const form = document.querySelector(".kontakt-form");
      form.reset();
      resetAllStyles(form);
      hasSubmitted = false;
    })
    .catch(() => {
      showSuccessMessage("Fehler beim Senden der Nachricht. ❌ ");
    });
}

function resetAllStyles(form) {
  form.querySelectorAll("input, textarea").forEach((el) => {
    el.classList.remove("valid", "invalid");
  });
  form.querySelectorAll(".icon-status").forEach((icon) => {
    icon.src = "";
    icon.style.display = "none";
  });
  fieldStates.clear();
}

let hasSubmitted = false;
const fieldStates = new Map();

function initContactForm() {
  const form = document.querySelector(".kontakt-form");
  if (!form) return;
  form.setAttribute("novalidate", "");

  const fields = {
    name: form.elements.name,
    email: form.elements.email,
    subject: form.elements.subject,
    message: form.elements.message,
  };

  const rules = [
    { el: fields.name, min: 1 },
    { el: fields.email, email: true },
    { el: fields.subject, min: 1 },
    { el: fields.message, min: 1 },
  ];

  function validateField({ el, min, email }, forceErrorIfEmpty = false) {
    const icon = el.nextElementSibling;
    const value = el.value.trim();
    const isEmpty = value === "";
    const wasInvalid = el.classList.contains("invalid");
    const wasValidBefore = fieldStates.get(el) === true;

    let isValid = true;
    if (email) isValid = isValidEmail(value);
    else if (min) isValid = value.length >= min;

    el.classList.remove("valid", "invalid");
    icon.src = "";
    icon.style.display = "none";

    // 1: Beim ersten Senden und leer → rot
    if (forceErrorIfEmpty && isEmpty) {
      el.classList.add("invalid");
      icon.src = "assets/images/false.png";
      icon.style.display = "block";
      return false;
    }

    // 2: E-Mail bleibt rot, bis korrekt
    if (email && !isValid && !isEmpty) {
      el.classList.add("invalid");
      icon.src = "assets/images/false.png";
      icon.style.display = "block";
      return false;
    }

    // 3: War grün, jetzt leer → rot
    if (wasValidBefore && isEmpty) {
      el.classList.add("invalid");
      icon.src = "assets/images/false.png";
      icon.style.display = "block";
      fieldStates.set(el, false);
      return false;
    }

    // 4: War grün, jetzt teilgelöscht → neutral
    if (wasValidBefore && !isValid && !isEmpty) {
      fieldStates.set(el, false);
      return false;
    }

    // 5: korrekt → grün + Icon
    if (!forceErrorIfEmpty && isValid) {
      el.classList.add("valid");
      icon.src = "assets/images/right.png";
      icon.style.display = "block";
      fieldStates.set(el, true);

      const delay = wasInvalid ? 2000 : 1000;
      setTimeout(() => {
        el.classList.remove("valid");
        icon.src = "";
        icon.style.display = "none";
      }, delay);
    }

    return isValid;
  }

  rules.forEach((rule) => {
    rule.el.addEventListener("input", () => {
      if (hasSubmitted) validateField(rule);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hasSubmitted = true;

    let allValid = true;
    for (const rule of rules) {
      const valid = validateField(rule, true);
      if (!valid && allValid) {
        rule.el.focus();
        allValid = false;
      }
    }

    if (allValid) {
      sendMailWithEmailJS(fields);
    }
  });
}
