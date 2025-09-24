document.addEventListener('DOMContentLoaded', () => {
  const individualLoginForm = document.querySelector('form');
  const businessLoginForm = document.querySelector('form');

  if (individualLoginForm && window.location.pathname.includes('individual-login.html')) {
    individualLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      localStorage.setItem('userType', 'individual');
      window.location.href = 'individual-dashboard.html';
    });
  }

  if (businessLoginForm && window.location.pathname.includes('business-login.html')) {
    businessLoginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      localStorage.setItem('userType', 'business');
      window.location.href = 'business-dashboard.html';
    });
  }
});