document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('personalForm');
  const cancelBtn = document.getElementById('cancelBtn');
  const languageSelect = document.getElementById('languageSelect');
  const updateLangBtn = document.getElementById('updateLang');

  if (form) {
    const inputs = form.querySelectorAll('input');
    const saved = JSON.parse(localStorage.getItem('personalDetails') || '{}');

    inputs.forEach(input => {
      if (saved[input.name]) {
        input.value = saved[input.name];
      }
      input.defaultValue = input.value;
    });

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        form.reset();
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {};
      inputs.forEach(input => {
        data[input.name] = input.value;
        input.defaultValue = input.value;
      });
      localStorage.setItem('personalDetails', JSON.stringify(data));
      alert('Changes saved');
    });
  }

  if (languageSelect && updateLangBtn) {
    const savedLang = localStorage.getItem('language') || 'en';
    languageSelect.value = savedLang;

    updateLangBtn.addEventListener('click', () => {
      localStorage.setItem('language', languageSelect.value);
      alert('Language updated');
    });
  }
});
