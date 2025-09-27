document.addEventListener('DOMContentLoaded', () => {
  const individualLoginForm = document.getElementById('individual-login-form');
  const businessLoginForm = document.getElementById('business-login-form');

  if (individualLoginForm) {
    individualLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      localStorage.setItem('userType', 'individual');
      window.location.href = 'individual-dashboard.html';
    });
  }

  if (businessLoginForm) {
    businessLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      localStorage.setItem('userType', 'business');
      window.location.href = 'business-dashboard.html';
    });
  }
});