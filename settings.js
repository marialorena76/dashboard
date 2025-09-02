document.addEventListener('DOMContentLoaded', () => {
  const notifKeys = ['emailNotif', 'pushNotif', 'smsNotif'];

  notifKeys.forEach(key => {
    const checkbox = document.getElementById(key);
    if (checkbox) {
      const stored = localStorage.getItem(key);
      checkbox.checked = stored === 'true';
    }
  });

  const saveBtn = document.getElementById('saveNotifs');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      notifKeys.forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          localStorage.setItem(key, checkbox.checked);
        }
      });
      alert('Notification settings saved');
    });
  }

  const changePassword = document.getElementById('changePassword');
  if (changePassword) {
    changePassword.addEventListener('click', () => {
      alert('Password change link sent to your email.');
    });
  }

  const toggle2FA = document.getElementById('toggle2FA');
  function update2FABtn() {
    if (!toggle2FA) return;
    const enabled = localStorage.getItem('twoFA') === 'true';
    toggle2FA.textContent = enabled ? 'Disable' : 'Enable';
  }
  if (toggle2FA) {
    update2FABtn();
    toggle2FA.addEventListener('click', () => {
      const enabled = localStorage.getItem('twoFA') === 'true';
      localStorage.setItem('twoFA', !enabled);
      update2FABtn();
      alert(`Two-factor authentication ${!enabled ? 'enabled' : 'disabled'}`);
    });
  }

  const downloadData = document.getElementById('downloadData');
  if (downloadData) {
    downloadData.addEventListener('click', () => {
      alert('Downloading your data...');
    });
  }

  const deleteAccount = document.getElementById('deleteAccount');
  if (deleteAccount) {
    deleteAccount.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete your account?')) {
        localStorage.clear();
        alert('Account removed');
      }
    });
  }
});
