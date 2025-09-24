const STATUS_MAP = {
  approved: { label: 'Approved', className: 'status-success' },
  review: { label: 'In Review', className: 'status-warning' },
  requested: { label: 'Requested', className: 'status-pending' }
};

const LANGUAGE_DATA = {
  en: { label: 'English (US)', button: 'English' },
  es: { label: 'Español (LatAm)', button: 'Español' },
  pt: { label: 'Português (Brasil)', button: 'Português' }
};

const USER_TYPE_PREFIX = 'mallow-business-';

document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('.business-main');
  if (!main) return;

  const viewToggle = document.getElementById('businessViewToggle');
  const panels = Array.from(document.querySelectorAll('[data-business-panel]'));

  const setView = view => {
    const nextView = view === 'edit' ? 'edit' : 'overview';
    main.dataset.view = nextView;
    panels.forEach(panel => {
      panel.classList.toggle('is-active', panel.dataset.businessPanel === nextView);
    });

    if (viewToggle) {
      if (nextView === 'edit') {
        viewToggle.textContent = 'Back to overview';
        viewToggle.classList.remove('business-button--primary');
        viewToggle.classList.add('business-button--ghost');
        viewToggle.setAttribute('aria-pressed', 'true');
      } else {
        viewToggle.textContent = 'Edit details';
        viewToggle.classList.add('business-button--primary');
        viewToggle.classList.remove('business-button--ghost');
        viewToggle.setAttribute('aria-pressed', 'false');
      }
    }
  };

  setView(main.dataset.view || 'overview');

  if (viewToggle) {
    viewToggle.addEventListener('click', () => {
      const current = main.dataset.view === 'edit' ? 'overview' : 'edit';
      setView(current);
    });
  }

  setupStatusPills();
  setupForms(setView);
  setupLanguageControls();
});

function setupStatusPills() {
  const selects = document.querySelectorAll('select[data-status-pill]');
  selects.forEach(select => {
    const pill = document.querySelector(`[data-status-pill-target="${select.dataset.statusPill}"]`);
    if (!pill) return;

    const applyStatus = value => {
      const status = STATUS_MAP[value] || STATUS_MAP.review;
      pill.textContent = status.label;
      pill.classList.remove('status-success', 'status-warning', 'status-pending');
      pill.classList.add(status.className);
    };

    applyStatus(select.value);
    select.addEventListener('change', () => applyStatus(select.value));
  });
}

function setupForms(setView) {
  const forms = document.querySelectorAll('.business-form');
  forms.forEach(form => {
    const storageKey = `${USER_TYPE_PREFIX}${form.id}`;
    const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
    let savedData = readStoredData(storageKey);

    inputs.forEach(input => {
      if (Object.prototype.hasOwnProperty.call(savedData, input.name)) {
        input.value = savedData[input.name];
      }
      input.defaultValue = input.value;
    });

    const cancelButton = form.querySelector('[data-action="cancel"]');
    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        form.reset();
        inputs.forEach(input => {
            input.value = input.defaultValue;
        });
        setView('overview');
      });
    }

    form.addEventListener('submit', event => {
      event.preventDefault();
      const updated = {};
      inputs.forEach(input => {
        updated[input.name] = input.value;
        input.defaultValue = input.value;
      });

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (error) {
        console.error('Unable to persist form data', error);
      }

      if (form.id === 'businessLanguageForm') {
        const select = form.querySelector('select[name="preferredLanguage"]');
        if (select) {
          updateLanguageDisplay(select.value);
        }
      }
      alert('Business profile updated successfully.');
      setView('overview');
    });
  });
}

function setupLanguageControls() {
  const languageButtons = document.querySelectorAll('[data-language-option]');
  const languageSelect = document.getElementById('languageSelect');
  const storageKey = `${USER_TYPE_PREFIX}language`;
  let savedLang = localStorage.getItem(storageKey);

  if (languageSelect) {
      if(savedLang) {
        languageSelect.value = savedLang;
      }
      languageSelect.addEventListener('change', () => {
        savedLang = languageSelect.value;
        localStorage.setItem(storageKey, savedLang);
        updateLanguageDisplay(savedLang);
      });
  }

  languageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.languageOption;
      if (!value) {
        return;
      }
      savedLang = value;
      localStorage.setItem(storageKey, savedLang);
      updateLanguageDisplay(value);
      if (languageSelect) {
        languageSelect.value = value;
      }
    });
  });

  updateLanguageDisplay(savedLang || 'en');
}

function updateLanguageDisplay(code) {
  const display = document.querySelector('[data-language-display]');
  const buttons = document.querySelectorAll('[data-language-option]');
  const data = LANGUAGE_DATA[code] || LANGUAGE_DATA.en;

  if (display) {
    display.textContent = data.label;
  }

  buttons.forEach(button => {
    if (button.dataset.languageOption === code) {
      button.classList.add('is-selected');
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
    }
  });
}

function readStoredData(key) {
    if (!key) return {};
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      console.warn('Unable to parse stored data for', key, error);
      return {};
    }
}