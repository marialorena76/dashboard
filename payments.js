document.addEventListener('DOMContentLoaded', () => {
  const summaryEls = {
    method: document.querySelector('[data-summary="method"]'),
    meta: document.querySelector('[data-summary="meta"]'),
    autopay: document.querySelector('[data-summary="autopay"]'),
    next: document.querySelector('[data-summary="next"]'),
    address: document.querySelector('[data-summary="address"]')
  };

  const formsSection = document.getElementById('paymentForms');
  const editForm = document.getElementById('editPaymentForm');
  const addForm = document.getElementById('addPaymentForm');
  const openEdit = document.getElementById('openEdit');
  const openAdd = document.getElementById('openAdd');
  const closeButtons = formsSection.querySelectorAll('[data-close-forms]');
  const feedback = document.querySelector('.page-feedback');

  const editFields = {
    method: editForm.querySelector('#editMethod'),
    cardholder: editForm.querySelector('#editCardholder'),
    card: editForm.querySelector('#editCard'),
    expiry: editForm.querySelector('#editExp'),
    autopay: editForm.querySelector('#editAutopay'),
    nextPayment: editForm.querySelector('#editNextPayment'),
    address: editForm.querySelector('#editAddress')
  };

  const addFields = {
    method: addForm.querySelector('#addMethod'),
    cardholder: addForm.querySelector('#addCardholder'),
    card: addForm.querySelector('#addCard'),
    expiry: addForm.querySelector('#addExp'),
    autopay: addForm.querySelector('#addAutopay'),
    nextPayment: addForm.querySelector('#addNextPayment'),
    address: addForm.querySelector('#addAddress')
  };

  const searchInput = document.getElementById('paymentSearch');
  const historyBody = document.getElementById('historyBody');

  const METHOD_STORAGE_KEY = 'dashboard.paymentMethod';
  const HISTORY_STORAGE_KEY = 'dashboard.paymentHistory';

  const defaultMethod = {
    method: 'Visa',
    cardholder: 'Maria Thompson',
    cardNumber: '4242 4242 4242 4321',
    expiry: '09/27',
    autopay: 'active',
    nextPayment: '2025-09-15',
    billingAddress: '123 Garden Avenue, Austin, TX 78704'
  };

  const defaultHistory = [
    { id: 'INV-1098', date: '2025-09-15', amount: 120, status: 'paid' },
    { id: 'INV-1087', date: '2025-08-15', amount: 120, status: 'paid' },
    { id: 'INV-1076', date: '2025-07-15', amount: 120, status: 'processing' },
    { id: 'INV-1065', date: '2025-06-15', amount: 120, status: 'failed' }
  ];

  let currentMethod = loadMethod();
  let history = loadHistory();
  let feedbackTimeout;

  renderSummary();
  populateEditForm();
  renderHistory();

  openEdit.addEventListener('click', () => {
    populateEditForm();
    showForms('edit');
    focusFirstField(editForm);
  });

  openAdd.addEventListener('click', () => {
    if (formsSection.hidden) {
      addForm.reset();
      if (addFields.autopay) {
        addFields.autopay.value = 'active';
      }
      if (addFields.nextPayment) {
        addFields.nextPayment.value = '';
      }
    }
    showForms('add');
    focusFirstField(addForm);
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.closest('form') === addForm) {
        addForm.reset();
      } else {
        populateEditForm();
      }
      hideForms();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !formsSection.hidden) {
      hideForms();
    }
  });

  editForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(editForm);
    const nextMethod = buildMethodFromForm(formData);

    if (!nextMethod) {
      return;
    }

    currentMethod = nextMethod;
    saveMethod();
    renderSummary();
    populateEditForm();
    hideForms();
    announce('Payment method updated successfully.');
  });

  addForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(addForm);
    const nextMethod = buildMethodFromForm(formData, true);

    if (!nextMethod) {
      return;
    }

    currentMethod = nextMethod;
    saveMethod();
    renderSummary();
    populateEditForm();
    addForm.reset();
    hideForms();
    announce('New payment method added and set as current.');
  });

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    const filtered = term ? history.filter(entry => matchesTerm(entry, term)) : history;
    renderHistory(filtered);
  });

  historyBody.addEventListener('click', event => {
    const button = event.target.closest('[data-receipt]');
    if (!button) {
      return;
    }

    const receiptId = button.getAttribute('data-receipt');
    announce(`Receipt ${receiptId} will be available for download soon.`, 'info');
  });

  function showForms(target) {
    formsSection.hidden = false;
    formsSection.classList.add('payment-forms--visible');
    if (target === 'add') {
      addForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function hideForms() {
    formsSection.classList.remove('payment-forms--visible');
    formsSection.hidden = true;
  }

  function focusFirstField(form) {
    const focusable = form.querySelector('input, select, textarea');
    if (focusable) {
      focusable.focus();
    }
  }

  function buildMethodFromForm(formData, isNew = false) {
    const method = formData.get('method').trim();
    const cardholder = formData.get('cardholder').trim();
    const rawCardNumber = formData.get('cardNumber').trim();
    const formattedCardNumber = formatCardNumber(rawCardNumber);
    const expiry = formatExpiry(formData.get('expiry'));
    const autopay = formData.get('autopay');
    let nextPayment = formData.get('nextPayment');
    const billingAddress = formData.get('billingAddress').trim();

    if (!method || !cardholder || !formattedCardNumber || !expiry || (!nextPayment && !isNew) || !billingAddress) {
      announce('Please fill out all required fields before continuing.', 'error');
      return null;
    }

    if (!isValidCardNumber(formattedCardNumber)) {
      announce('Enter a valid card number to continue.', 'error');
      return null;
    }

    if (!isValidExpiry(expiry)) {
      announce('Enter the card expiration in MM/YY format.', 'error');
      return null;
    }

    if (!nextPayment) {
      nextPayment = currentMethod.nextPayment;
    }

    return {
      method,
      cardholder,
      cardNumber: formattedCardNumber,
      expiry,
      autopay,
      nextPayment,
      billingAddress
    };
  }

  function renderSummary() {
    const lastFour = extractLastFour(currentMethod.cardNumber);
    const activeAutopayLabel = summaryEls.autopay?.dataset.labelActive || 'Autopay Active';
    const pausedAutopayLabel = summaryEls.autopay?.dataset.labelPaused || 'Autopay Paused';
    const autopayLabel = currentMethod.autopay === 'active' ? activeAutopayLabel : pausedAutopayLabel;
    const nextPaymentLabel = currentMethod.nextPayment
      ? `Next payment ${formatDate(currentMethod.nextPayment)}`
      : 'Next payment not scheduled';

    if (summaryEls.method) {
      summaryEls.method.textContent = `${currentMethod.method} •••• ${lastFour}`.trim();
    }

    if (summaryEls.meta) {
      summaryEls.meta.textContent = `${currentMethod.cardholder} · Exp ${currentMethod.expiry}`;
    }

    if (summaryEls.autopay) {
      summaryEls.autopay.textContent = autopayLabel;
      summaryEls.autopay.classList.toggle('status-pill--success', currentMethod.autopay === 'active');
      summaryEls.autopay.classList.toggle('status-pill--warning', currentMethod.autopay !== 'active');
    }

    if (summaryEls.next) {
      summaryEls.next.textContent = nextPaymentLabel;
    }

    if (summaryEls.address) {
      summaryEls.address.textContent = currentMethod.billingAddress;
    }
  }

  function populateEditForm() {
    if (!editFields.method) {
      return;
    }

    editFields.method.value = currentMethod.method;
    editFields.cardholder.value = currentMethod.cardholder;
    editFields.card.value = currentMethod.cardNumber;
    editFields.expiry.value = currentMethod.expiry;
    editFields.autopay.value = currentMethod.autopay;
    editFields.nextPayment.value = currentMethod.nextPayment;
    editFields.address.value = currentMethod.billingAddress;
  }

  function renderHistory(list = history) {
    historyBody.innerHTML = '';

    if (list.length === 0) {
      const emptyRow = document.createElement('tr');
      emptyRow.className = 'table-empty';
      emptyRow.innerHTML = '<td colspan="4">No payments match your search right now.</td>';
      historyBody.appendChild(emptyRow);
      return;
    }

    list
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${formatDate(entry.date)}</td>
          <td>${formatCurrency(entry.amount)}</td>
          <td>${renderStatusCell(entry.status)}</td>
          <td><button type="button" class="payment-history__receipt" data-receipt="${entry.id}">Download</button></td>
        `;
        historyBody.appendChild(row);
      });
  }

  function matchesTerm(entry, term) {
    return [
      entry.id,
      formatDate(entry.date),
      formatCurrency(entry.amount),
      statusLabel(entry.status)
    ]
      .join(' ')
      .toLowerCase()
      .includes(term);
  }

  function renderStatusCell(status) {
    const className = statusClass(status);
    return `<span class="status-pill ${className}">${statusLabel(status)}</span>`;
  }

  function statusClass(status) {
    switch (status) {
      case 'paid':
        return 'status-pill--success';
      case 'processing':
        return 'status-pill--info';
      case 'failed':
        return 'status-pill--danger';
      default:
        return 'status-pill--info';
    }
  }

  function statusLabel(status) {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  }

  function extractLastFour(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    return digits.slice(-4) || '0000';
  }

  function formatCardNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 19);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  }

  function formatExpiry(value) {
    const digits = (value || '').replace(/\D/g, '').slice(0, 4);
    if (digits.length < 4) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }

  function isValidCardNumber(value) {
    const digits = value.replace(/\D/g, '');
    return digits.length >= 12 && digits.length <= 19;
  }

  function isValidExpiry(value) {
    if (!/^\d{2}\/\d{2}$/.test(value)) {
      return false;
    }
    const [month, year] = value.split('/').map(Number);
    if (month < 1 || month > 12) {
      return false;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    return year > currentYear || (year === currentYear && month >= currentMonth);
  }

  function announce(message, tone = 'success') {
    if (!feedback) {
      return;
    }

    feedback.textContent = message;
    feedback.classList.remove('page-feedback--success', 'page-feedback--error', 'page-feedback--info');
    feedback.classList.add(`page-feedback--${tone}`);
    feedback.hidden = false;

    if (feedbackTimeout) {
      window.clearTimeout(feedbackTimeout);
    }

    feedbackTimeout = window.setTimeout(() => {
      feedback.hidden = true;
    }, 5000);
  }

  function loadMethod() {
    try {
      const stored = localStorage.getItem(METHOD_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultMethod, ...parsed };
      }

      const legacy = localStorage.getItem('paymentMethods');
      if (legacy) {
        const legacyParsed = JSON.parse(legacy);
        if (Array.isArray(legacyParsed) && legacyParsed.length) {
          const [first] = legacyParsed;
          if (first) {
            return {
              ...defaultMethod,
              method: first.method || defaultMethod.method,
              cardNumber: first.card || defaultMethod.cardNumber,
              expiry: first.exp || defaultMethod.expiry
            };
          }
        }
      }
    } catch (error) {
      console.error('Unable to read stored payment method', error);
    }
    return { ...defaultMethod };
  }

  function saveMethod() {
    try {
      localStorage.setItem(METHOD_STORAGE_KEY, JSON.stringify(currentMethod));
    } catch (error) {
      console.error('Unable to save payment method', error);
    }
  }

  function loadHistory() {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed
            .map(normalizeHistoryEntry)
            .filter(Boolean);
        }
      }
    } catch (error) {
      console.error('Unable to read payment history', error);
    }
    return defaultHistory.map(normalizeHistoryEntry);
  }

  function normalizeHistoryEntry(entry) {
    if (!entry) {
      return null;
    }

    const date = normalizeDate(entry.date);
    const amount = normalizeAmount(entry.amount);
    const status = normalizeStatus(entry.status);
    const safeDate = typeof date === 'string' ? date : String(date);
    const fallbackId = safeDate.replace(/[^0-9]/g, '') || Date.now().toString();
    const id = entry.id || entry.receipt || entry.reference || `INV-${fallbackId}`;

    return {
      id,
      date,
      amount,
      status
    };
  }

  function normalizeDate(value) {
    if (!value) {
      return new Date().toISOString().slice(0, 10);
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toISOString().slice(0, 10);
  }

  function normalizeAmount(value) {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return value;
    }
    const parsed = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  function normalizeStatus(value) {
    const normalized = String(value || '').toLowerCase();
    if (['paid', 'processing', 'failed'].includes(normalized)) {
      return normalized;
    }
    return 'paid';
  }
});
