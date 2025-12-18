document.addEventListener('DOMContentLoaded', () => {
  if (typeof DASH_USER === 'undefined') return;

  const fullName =
    (DASH_USER.first_name || DASH_USER.last_name)
      ? `${DASH_USER.first_name || ''} ${DASH_USER.last_name || ''}`.trim()
      : (DASH_USER.display_name || DASH_USER.email || 'User');

  const label = DASH_USER.company_name || fullName;

  // 1) Sidebar label (Business name / user name)
  const nameLabelEl = document.getElementById('businessNameLabel');
  if (nameLabelEl) nameLabelEl.textContent = label;

  // 2) Sidebar initials
  const initialsEl = document.getElementById('businessInitials');
  if (initialsEl) initialsEl.textContent = makeInitials(label);

  // 3) “Welcome back, ____” (si existe)
  // Usá cualquiera de estos IDs/clases según tu HTML (te dejo soportados varios)
  const welcomeNameEl =
        document.getElementById('businessWelcomeName') ||   // <-- TU CASO
        document.getElementById('welcomeName') ||
        document.querySelector('[data-welcome-name]') ||
        document.querySelector('.welcome-name');

  if (welcomeNameEl) welcomeNameEl.textContent = fullName;
});

function makeInitials(text = '') {
  const t = text.trim();
  if (!t) return 'U';
  const parts = t.split(/\s+/).slice(0, 2);
  const initials = parts.map(p => p[0]?.toUpperCase() || '').join('');
  return initials || 'U';
}
