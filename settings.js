const STORAGE_PREFIX = 'ivy-settings-';

function buildStorageKey(input) {
  return `${STORAGE_PREFIX}${input.dataset.storage}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const panels = document.querySelectorAll('.settings-panel');
  const navButtons = document.querySelectorAll('.settings-nav .nav-link');
  const toggleInputs = document.querySelectorAll('input[data-storage]');

  panels.forEach(panel => {
    if (!panel.classList.contains('active')) {
      panel.setAttribute('hidden', 'hidden');
    }
  });

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.classList.contains('active')) return;

      navButtons.forEach(other => {
        const isActive = other === button;
        other.classList.toggle('active', isActive);
        other.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panels.forEach(panel => {
        if (panel.id === button.dataset.target) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', 'hidden');
        }
      });
    });
  });

  toggleInputs.forEach(input => {
    const key = buildStorageKey(input);
    const storedValue = localStorage.getItem(key);
    const fallback = input.defaultChecked ? 'true' : 'false';
    const resolved = storedValue ?? fallback;

    input.checked = resolved === 'true';
    input.dataset.saved = resolved;

    if (input.dataset.autoSave === 'true') {
      input.addEventListener('change', () => {
        localStorage.setItem(key, String(input.checked));
        input.dataset.saved = String(input.checked);
      });
    }
  });

  const notificationsPanel = document.getElementById('notificationsPanel');
  const notificationInputs = notificationsPanel
    ? notificationsPanel.querySelectorAll('input[data-storage]')
    : [];
  const saveNotifications = document.getElementById('saveNotifications');
  const resetNotifications = document.querySelector('[data-action="resetNotifications"]');

  if (saveNotifications) {
    saveNotifications.addEventListener('click', () => {
      notificationInputs.forEach(input => {
        const key = buildStorageKey(input);
        localStorage.setItem(key, String(input.checked));
        input.dataset.saved = String(input.checked);
      });

      window.alert('Notification preferences saved.');
    });
  }

  if (resetNotifications) {
    resetNotifications.addEventListener('click', () => {
      notificationInputs.forEach(input => {
        const saved = input.dataset.saved ?? 'false';
        input.checked = saved === 'true';
      });
    });
  }

  const twoFAButton = document.querySelector('[data-action="toggleTwoFA"]');
  const twoFAStatus = document.querySelector('[data-twofa-status]');
  const twoFAKey = `${STORAGE_PREFIX}twoFA`;

  function updateTwoFAControls() {
    const enabled = localStorage.getItem(twoFAKey) === 'true';

    if (twoFAStatus) {
      twoFAStatus.textContent = enabled ? 'Enabled' : 'Disabled';
      twoFAStatus.classList.toggle('success', enabled);
      twoFAStatus.classList.toggle('neutral', !enabled);
    }

    if (twoFAButton) {
      twoFAButton.textContent = enabled ? 'Disable' : 'Enable';
      twoFAButton.classList.toggle('outline-button', enabled);
      twoFAButton.classList.toggle('solid-button', !enabled);
    }
  }

  if (twoFAButton) {
    if (!localStorage.getItem(twoFAKey)) {
      localStorage.setItem(twoFAKey, 'false');
    }

    updateTwoFAControls();

    twoFAButton.addEventListener('click', () => {
      const enabled = localStorage.getItem(twoFAKey) === 'true';
      localStorage.setItem(twoFAKey, String(!enabled));
      updateTwoFAControls();
      window.alert(`Two-factor authentication ${!enabled ? 'enabled' : 'disabled'}.`);
    });
  } else if (twoFAStatus) {
    updateTwoFAControls();
  }

  const downloadData = document.querySelector('[data-action="downloadData"]');
  if (downloadData) {
    downloadData.addEventListener('click', () => {
      window.alert('We will email you a secure link with your data shortly.');
    });
  }

  const exportStatements = document.querySelector('[data-action="exportStatements"]');
  if (exportStatements) {
    exportStatements.addEventListener('click', () => {
      window.alert('Statement export requested. We will notify you when the files are ready.');
    });
  }

  const deleteAccount = document.querySelector('[data-action="deleteAccount"]');
  if (deleteAccount) {
    deleteAccount.addEventListener('click', () => {
      const confirmed = window.confirm(
        'Request account deletion? This begins a 30-day review before data is permanently removed.'
      );

      if (confirmed) {
        localStorage.clear();
        window.alert('Your deletion request has been submitted. A specialist will contact you shortly.');
      }
    });
  }

  const passwordModal = document.getElementById('passwordModal');
  const passwordForm = document.getElementById('passwordForm');
  const openPasswordButtons = document.querySelectorAll('[data-action="openPasswordModal"]');
  const closePasswordButtons = document.querySelectorAll('[data-action="closePasswordModal"]');

  function openPasswordModal() {
    if (!passwordModal) return;
    passwordModal.removeAttribute('hidden');
    passwordModal.classList.add('open');
    document.body.classList.add('modal-open');
    const currentField = passwordForm?.querySelector('input[name="currentPassword"]');
    if (currentField) {
      currentField.focus();
    }
  }

  function closePasswordModal() {
    if (!passwordModal) return;
    passwordModal.classList.remove('open');
    passwordModal.setAttribute('hidden', 'hidden');
    document.body.classList.remove('modal-open');
    passwordForm?.reset();
  }

  openPasswordButtons.forEach(button => {
    button.addEventListener('click', openPasswordModal);
  });

  closePasswordButtons.forEach(button => {
    button.addEventListener('click', closePasswordModal);
  });

  if (passwordModal) {
    passwordModal.addEventListener('click', event => {
      if (event.target === passwordModal) {
        closePasswordModal();
      }
    });
  }

  if (passwordForm) {
    passwordForm.addEventListener('submit', event => {
      event.preventDefault();
      const current = passwordForm.currentPassword.value.trim();
      const next = passwordForm.newPassword.value.trim();
      const confirmPassword = passwordForm.confirmPassword.value.trim();

      if (!current || !next || !confirmPassword) {
        window.alert('Please complete every password field.');
        return;
      }

      if (next !== confirmPassword) {
        window.alert('New password and confirmation must match.');
        return;
      }

      window.alert('Your password has been updated.');
      closePasswordModal();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && passwordModal?.classList.contains('open')) {
      closePasswordModal();
    }
  });
});
