document.addEventListener('DOMContentLoaded', () => {
  const userType = localStorage.getItem('userType');
  const onProtectedPage = window.location.pathname.includes('-dashboard.html') ||
                          window.location.pathname.includes('my-profile.html') ||
                          window.location.pathname.includes('settings.html') ||
                          window.location.pathname.includes('payments.html') ||
                          window.location.pathname.includes('protected-members.html') ||
                          window.location.pathname.includes('business-plans-billing.html');

  if (onProtectedPage && !userType) {
    window.location.href = 'index.html';
    return;
  }

  const logoutButton = document.querySelector('.logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('userType');
      // Opcional: limpiar todos los datos del usuario
      // localStorage.removeItem('personalDetails');
      // localStorage.removeItem('beneficiaryDetails');
      // ...etc.
      window.location.href = 'index.html';
    });
  }
});