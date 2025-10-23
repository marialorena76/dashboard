document.getElementById('loginForm').addEventListener('submit', loginMemora);

async function loginMemora(e) {
  e.preventDefault();

  const email = document.querySelector('#email').value.trim();
  const password = document.querySelector('#password').value.trim();

  const msg = document.getElementById('mensaje');
  msg.innerText = 'Verificando credenciales...';

  try {
    // 1️⃣ Pedimos el token a WordPress
    const res = await fetch('https://memoracare.org/wp-json/jwt-auth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Error al autenticar');

    // 2️⃣ Guardamos el token en localStorage
    localStorage.setItem('token', data.token);

    // 3️⃣ Consultamos el plan del usuario
    const planRes = await fetch('https://memoracare.org/wp-json/memora/v1/me', {
      headers: { Authorization: `Bearer ${data.token}` }
    });

    const planData = await planRes.json();

    // 4️⃣ Redirigir según membresía
    if (planData.plan === 'personal') {
      window.location.href = '/personal/index.html';
    } else if (planData.plan === 'familiar') {
      window.location.href = '/familiar/index.html';
    } else if (planData.plan === 'empresarial') {
      window.location.href = '/empresa/index.html';
    } else {
      msg.innerText = 'No se detectó un plan válido.';
    }

  } catch (err) {
    console.error(err);
    msg.innerText = 'Error: ' + err.message;
  }
}
