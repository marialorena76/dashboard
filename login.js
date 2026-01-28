document.addEventListener('DOMContentLoaded', () => {
  const individualLoginForm = document.getElementById('individual-login-form');
  const businessLoginForm    = document.getElementById('business-login-form');

  const handleLogin = async (event, form) => {
    event.preventDefault();
    const email    = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
      // 1. Obtener el token
      const tokenResponse = await fetch('https://memoracare.org/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password: password }),
      });
      if (!tokenResponse.ok) throw new Error('Invalid credentials');
      const tokenData = await tokenResponse.json();

      // 2. Guardar token y usuario
      sessionStorage.setItem('memora_token', tokenData.token);
      sessionStorage.setItem('memora_user', JSON.stringify({
        email: tokenData.user_email,
        name:  tokenData.user_nicename,
        display: tokenData.user_display_name,
      }));

      // 3. Consultar plan empresarial
      const planResponse = await fetch('https://memoracare.org/wp-json/memora/v1/business-plan', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
          'Content-Type': 'application/json'
        },
      });
      if (!planResponse.ok) {
        alert('Estamos activando tu plan empresarial. Por favor, intenta iniciar sesión de nuevo en unos minutos.');
        return;
      }
      const planData   = await planResponse.json();
      const planStatus = planData.plan_status;

      if (['active', 'on-hold', 'pending-cancel'].includes(planStatus)) {
        localStorage.setItem('userType', 'business');
        window.location.href = 'business-dashboard.html';
      } else {
        localStorage.setItem('userType', 'individual');
        window.location.href = 'individual-dashboard.html';
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + error.message);
    }
  }; // ← aquí cierras la función handleLogin

  // Estos manejadores de envío van FUERA de handleLogin y fuera del try/catch
  if (individualLoginForm) {
    individualLoginForm.addEventListener('submit', (event) => handleLogin(event, individualLoginForm));
  }
  if (businessLoginForm) {
    businessLoginForm.addEventListener('submit', (event) => handleLogin(event, businessLoginForm));
  }
}); // ← y aquí cierras el DOMContentLoaded
