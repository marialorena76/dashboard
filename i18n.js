async function setLanguage(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load language file: ${lang}.json`);
    }
    const translations = await response.json();

    document.querySelectorAll('[data-i18n-key]').forEach(element => {
      const key = element.getAttribute('data-i18n-key');
      if (translations[key]) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translations[key];
        } else {
          element.textContent = translations[key];
        }
      }
    });

    localStorage.setItem('language', lang);
    updateLangButtons(lang);

  } catch (error) {
    console.error('Error setting language:', error);
    // Fallback to English if the selected language fails to load
    if (lang !== 'en') {
      setLanguage('en');
    }
  }
}

function updateLangButtons(currentLang) {
  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(button => {
    if (button.getAttribute('data-lang') === currentLang) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'en';

  const langButtons = document.querySelectorAll('[data-lang]');
  langButtons.forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.getAttribute('data-lang');
      setLanguage(lang);
    });
  });

  setLanguage(savedLang);
});