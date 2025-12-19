const STATUS_MAP = {
  uploaded: { label: 'Uploaded', className: 'status-success' },
  expiring: { label: 'Expiring Soon', className: 'status-warning' },
  pending: { label: 'Not Submitted', className: 'status-pending' }
};

const USER_TYPE_PREFIX = 'mallow-individual-';

document.addEventListener('DOMContentLoaded', () => {
  const formConfigs = [
    { id: 'personalForm', storageKey: 'personalDetails', successMessage: 'Personal details updated' },
    { id: 'beneficiaryForm', storageKey: 'beneficiaryDetails', successMessage: 'Beneficiary information saved' },
    { id: 'documentsForm', storageKey: 'documentDetails', successMessage: 'Document details updated' }
  ];

  formConfigs.forEach(setupForm);
  setupStatusPills();
  setupLanguagePreference();
});

function setupForm({ id, storageKey, successMessage }) {
  const form = document.getElementById(id);
  if (!form) return;

  const fullStorageKey = `${USER_TYPE_PREFIX}${storageKey}`;
  const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
  let savedData = readStoredData(fullStorageKey);

  inputs.forEach(input => {
    if (input.type === 'file') {
      const output = getFileOutput(form, input);
      const savedName = savedData[input.name];
      if (output) {
        const placeholder = output.dataset.placeholder || output.textContent || 'No document uploaded';
        output.dataset.placeholder = placeholder;
        output.textContent = savedName || placeholder;
      }
      input.value = '';
    } else {
      if (Object.prototype.hasOwnProperty.call(savedData, input.name)) {
        input.value = savedData[input.name];
      }
      input.defaultValue = input.value;
    }
  });

  inputs
    .filter(input => input.type === 'file')
    .forEach(input => {
      const output = getFileOutput(form, input);
      input.addEventListener('change', () => {
        if (!output) return;
        if (input.files.length) {
          output.textContent = input.files[0].name;
        } else {
          const savedName = savedData[input.name];
          output.textContent = savedName || output.dataset.placeholder || 'No document uploaded';
        }
      });
    });

  const cancelBtn = form.querySelector('[data-action="cancel"]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      inputs.forEach(input => {
        if (input.type === 'file') {
          input.value = '';
          const output = getFileOutput(form, input);
          if (output) {
            const savedName = savedData[input.name];
            output.textContent = savedName || output.dataset.placeholder || 'No document uploaded';
          }
        } else {
          input.value = input.defaultValue;
          if (input.tagName === 'SELECT' && input.dataset.statusPill) {
            input.dispatchEvent(new Event('change'));
          }
        }
      });
    });
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const updated = {};

    inputs.forEach(input => {
      if (input.type === 'file') {
        const output = getFileOutput(form, input);
        if (input.files.length) {
          const fileName = input.files[0].name;
          updated[input.name] = fileName;
          if (output) {
            output.textContent = fileName;
          }
        } else if (savedData[input.name]) {
          updated[input.name] = savedData[input.name];
          if (output) {
            output.textContent = savedData[input.name];
          }
        } else if (output) {
          output.textContent = output.dataset.placeholder || 'No document uploaded';
        }
        input.value = '';
      } else {
        updated[input.name] = input.value;
        input.defaultValue = input.value;
        if (input.tagName === 'SELECT' && input.dataset.statusPill) {
          input.dispatchEvent(new Event('change'));
        }
      }
    });

    savedData = updated;
    try {
      localStorage.setItem(fullStorageKey, JSON.stringify(updated));
    } catch (error) {
      console.error('Unable to persist form data', error);
    }

    alert(successMessage || 'Changes saved');
  });
}

function setupStatusPills() {
  const selects = document.querySelectorAll('select[data-status-pill]');
  selects.forEach(select => {
    const pill = document.querySelector(`[data-status-pill-target="${select.dataset.statusPill}"]`);
    if (!pill) return;

    const applyStatus = value => {
      const status = STATUS_MAP[value] || STATUS_MAP.pending;
      pill.textContent = status.label;
      pill.classList.remove('status-success', 'status-warning', 'status-pending');
      pill.classList.add(status.className);
    };

    applyStatus(select.value);
    select.addEventListener('change', () => applyStatus(select.value));
  });
}

function setupLanguagePreference() {
  const languageSelect = document.getElementById('languageSelect');
  const updateLangBtn = document.getElementById('updateLang');
  if (!languageSelect || !updateLangBtn) {
    return;
  }

  const savedLang = localStorage.getItem(`${USER_TYPE_PREFIX}language`);
  if (savedLang) {
    languageSelect.value = savedLang;
  }

  updateLangBtn.addEventListener('click', () => {
    localStorage.setItem(`${USER_TYPE_PREFIX}language`, languageSelect.value);
    alert('Language preference updated');
  });
}

function readStoredData(key) {
  if (!key) return {};
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn('Unable to parse stored data for', key, error);
    return {};
  }
}

function getFileOutput(form, input) {
  const target = input.dataset.fileOutput;
  if (!target) return null;
  return form.querySelector(`[data-file-name="${target}"]`);
}

// Enable file upload for documents
document.addEventListener('DOMContentLoaded', () => {
  const docButtons = document.querySelectorAll('.doc-button');
  docButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const fileInput = document.getElementById(targetId);
      if (fileInput) fileInput.click();
    });
  });

  const docInputs = document.querySelectorAll('#documentsForm input[type="file"]');
  docInputs.forEach(input => {
    input.addEventListener('change', () => {
      if (input.files.length) {
        // Display file name
        const fileName = input.files[0].name;
        const outputSpan = document.querySelector(`[data-file-name="${input.dataset.fileOutput}"]`);
        if (outputSpan) outputSpan.textContent = fileName;
        // Update status badge to "Uploaded"
        const row = input.closest('.documents-row');
        const statusBadge = row.querySelector('.status-badge');
        if (statusBadge) {
          statusBadge.textContent = 'Uploaded';
          statusBadge.classList.remove('status-pending');
          statusBadge.classList.add('status-success');
        }
        // OPTIONAL: Upload to backend via fetch
        // const formData = new FormData();
        // formData.append('document', input.files[0]);
        // formData.append('type', input.name);
        // fetch('/api/upload-document', { method: 'POST', body: formData })
        //   .then(response => response.json())
        //   .then(data => console.log('Upload success:', data))
        //   .catch(err => console.error('Upload error:', err));
      }
    });
  });
});
