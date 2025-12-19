document.addEventListener('DOMContentLoaded', () => {
  const individualLoginForm = document.getElementById('individual-login-form');
  const businessLoginForm = document.getElementById('business-login-form');

  const handleLogin = async (event, form) => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;

    try {
      // Step 1: Get the JWT token
      const tokenResponse = await fetch('/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Invalid credentials');
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.token;

      if (!tokenData.token) {
        throw new Error('Token not found in response');
      }

      sessionStorage.setItem('memora_token', tokenData.token);

      const user = {
        email: tokenData.user_email,
        name: tokenData.user_nicename,
        display: tokenData.user_display_name,
      };

      sessionStorage.setItem('memora_user', JSON.stringify(user));

      // Step 2: Determine user type
      const planResponse = await fetch('/wp-json/memora/v1/business-plan', {
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
        },
      });

      if (!planResponse.ok) {
        // If this endpoint fails, we assume it's an individual user.
        localStorage.setItem('userType', 'individual');
        window.location.href = 'individual-dashboard.html';
        return;
      }

      const planData = await planResponse.json();
      const { plan_status, employee_limit } = planData;

      if (['active', 'on-hold', 'pending-cancel'].includes(plan_status) && employee_limit > 0) {
        localStorage.setItem('userType', 'business');
        window.location.href = 'business-dashboard.html';
      } else {
        localStorage.setItem('userType', 'individual');
        window.location.href = 'individual-dashboard.html';
      }

    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  if (individualLoginForm) {
    individualLoginForm.addEventListener('submit', (event) => handleLogin(event, individualLoginForm));
  }

  if (businessLoginForm) {
    businessLoginForm.addEventListener('submit', (event) => handleLogin(event, businessLoginForm));
  }
});
