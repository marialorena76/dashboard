const STATUS_CONFIG = {
  paid: { label: 'Paid', className: 'status-pill--success' },
  processing: { label: 'Processing', className: 'status-pill--info' },
  overdue: { label: 'Overdue', className: 'status-pill--danger' },
  refunded: { label: 'Refunded', className: 'status-pill--warning' }
};

const BILLING_HISTORY = [
  {
    date: '2025-04-15',
    invoice: 'INV-2098',
    amount: 4820,
    status: 'paid'
  },
  {
    date: '2025-03-15',
    invoice: 'INV-2086',
    amount: 4820,
    status: 'paid'
  },
  {
    date: '2025-02-15',
    invoice: 'INV-2072',
    amount: 4795,
    status: 'paid'
  },
  {
    date: '2025-01-15',
    invoice: 'INV-2059',
    amount: 4795,
    status: 'processing'
  },
  {
    date: '2024-12-15',
    invoice: 'INV-2041',
    amount: 4750,
    status: 'overdue'
  },
  {
    date: '2024-11-15',
    invoice: 'INV-2028',
    amount: 4750,
    status: 'paid'
  }
];

const billingState = {
  autopay: true,
  summary: {
    methodName: 'Corporate Visa',
    cardholder: 'LegacyBridge Benefits',
    cardNumber: '4321432143214321',
    expiry: '11/27',
    nextInvoiceDate: '2025-05-15',
    invoiceAmount: 4820,
    address: '4100 Market Street, Suite 1200 · Denver, CO 80205'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const overviewSection = document.getElementById('billingOverview');
  const formsSection = document.getElementById('billingForms');
  const feedback = document.getElementById('billingFeedback');
  const autopayButton = document.querySelector('[data-toggle-autopay]');
  const autopayPills = document.querySelectorAll('[data-autopay-pill]');
  const summaryMethod = document.querySelector('[data-summary-method]');
  const summaryMeta = document.querySelector('[data-summary-meta]');
  const summaryNext = document.querySelector('[data-summary-next]');
  const summaryAddress = document.querySelector('[data-summary-address]');
  const openFormButtons = document.querySelectorAll('[data-open-forms]');
  const closeButtons = document.querySelectorAll('[data-close-forms]');
  const editForm = document.getElementById('editBillingForm');
  const addForm = document.getElementById('addBillingForm');
  const historyBody = document.getElementById('billingHistoryBody');
  const historySearch = document.getElementById('billingHistorySearch');

  if (!overviewSection || !formsSection) {
    return;
  }

  let feedbackTimeoutId;

  renderSummary();
  renderHistory();
  updateAutopayUI(billingState.autopay);

  openFormButtons.forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.openForms || 'edit';
      openForms(mode);
    });
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      closeForms();
    });
  });

  if (autopayButton) {
    autopayButton.addEventListener('click', () => {
      billingState.autopay = !billingState.autopay;
      updateAutopayUI(billingState.autopay);
      const select = document.getElementById('editAutopay');
      if (select) {
        select.value = billingState.autopay ? 'enabled' : 'paused';
      }
      showFeedback(
        billingState.autopay
          ? 'Autopay resumed. Future invoices will process automatically.'
          : 'Autopay paused. We will send reminders before each invoice.',
        billingState.autopay ? 'success' : 'info'
      );
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(editForm);
      billingState.summary.methodName = formData.get('method')?.toString().trim() || billingState.summary.methodName;
      billingState.summary.cardholder = formData.get('cardholder')?.toString().trim() || billingState.summary.cardholder;
      billingState.summary.cardNumber = sanitizeNumber(formData.get('cardNumber')) || billingState.summary.cardNumber;
      billingState.summary.expiry = formData.get('expiry')?.toString().trim() || billingState.summary.expiry;
      billingState.summary.nextInvoiceDate = formData.get('nextPayment') || billingState.summary.nextInvoiceDate;
      const amountValue = parseFloat(formData.get('invoiceAmount'));
      billingState.summary.invoiceAmount = Number.isFinite(amountValue)
        ? amountValue
        : billingState.summary.invoiceAmount;
      billingState.summary.address = formData.get('billingAddress')?.toString().trim() || billingState.summary.address;
      billingState.autopay = formData.get('autopay') !== 'paused';

      renderSummary();
      updateAutopayUI(billingState.autopay);
      showFeedback('Payment method updated successfully.');
      closeForms();
    });
  }

  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(addForm);
      const label = (formData.get('method') || 'New payment method').toString().trim();
      const usage = formData.get('preferredUsage');
      showFeedback(
        `Backup method "${label}" saved for ${describeUsage(usage)}.`,
        'success'
      );
      addForm.reset();
      closeForms();
    });
  }

  if (historySearch) {
    historySearch.addEventListener('input', () => {
      renderHistory(historySearch.value);
    });
  }

  if (historyBody) {
    historyBody.addEventListener('click', event => {
      const button = event.target.closest('[data-receipt]');
      if (!button) return;
      const invoiceId = button.dataset.receipt;
      showFeedback(`Receipt for ${invoiceId} is downloading now.`, 'info');
    });
  }

  function openForms(mode) {
    formsSection.hidden = false;
    overviewSection.hidden = true;
    formsSection.dataset.mode = mode;
    if (editForm) {
      editForm.classList.toggle('is-active', mode === 'edit');
    }
    if (addForm) {
      addForm.classList.toggle('is-active', mode === 'add');
    }
    if (mode === 'edit') {
      prefillEditForm();
      const focusTarget = editForm?.querySelector('input, select, textarea');
      focusTarget?.focus();
    } else if (mode === 'add') {
      addForm?.reset();
      const focusTarget = addForm?.querySelector('input, select, textarea');
      focusTarget?.focus();
    }
    formsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeForms() {
    formsSection.hidden = true;
    overviewSection.hidden = false;
    formsSection.dataset.mode = '';
    if (editForm) {
      editForm.classList.remove('is-active');
    }
    if (addForm) {
      addForm.classList.remove('is-active');
    }
    overviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function renderSummary() {
    const lastFour = getLastFour(billingState.summary.cardNumber);
    if (summaryMethod) {
      summaryMethod.textContent = `${billingState.summary.methodName} •••• ${lastFour}`;
    }
    if (summaryMeta) {
      summaryMeta.textContent = `${billingState.summary.cardholder} · Exp ${billingState.summary.expiry}`;
    }
    if (summaryNext) {
      summaryNext.textContent = `${formatDate(billingState.summary.nextInvoiceDate)} · ${formatCurrency(
        billingState.summary.invoiceAmount
      )}`;
    }
    if (summaryAddress) {
      summaryAddress.textContent = billingState.summary.address;
    }
  }

  function prefillEditForm() {
    if (!editForm) return;
    const method = editForm.querySelector('#editMethod');
    const cardholder = editForm.querySelector('#editCardholder');
    const cardNumber = editForm.querySelector('#editCard');
    const expiry = editForm.querySelector('#editExpiry');
    const nextPayment = editForm.querySelector('#editNextPayment');
    const amount = editForm.querySelector('#editAmount');
    const address = editForm.querySelector('#editAddress');
    const autopay = editForm.querySelector('#editAutopay');

    if (method) method.value = billingState.summary.methodName;
    if (cardholder) cardholder.value = billingState.summary.cardholder;
    if (cardNumber) cardNumber.value = billingState.summary.cardNumber;
    if (expiry) expiry.value = billingState.summary.expiry;
    if (nextPayment) nextPayment.value = billingState.summary.nextInvoiceDate;
    if (amount) amount.value = billingState.summary.invoiceAmount;
    if (address) address.value = billingState.summary.address;
    if (autopay) autopay.value = billingState.autopay ? 'enabled' : 'paused';
  }

  function renderHistory(filterText = '') {
    if (!historyBody) return;
    const query = filterText.trim().toLowerCase();
    const filtered = BILLING_HISTORY.filter(entry => {
      const dateLabel = formatDate(entry.date).toLowerCase();
      return (
        entry.invoice.toLowerCase().includes(query) ||
        dateLabel.includes(query) ||
        formatCurrency(entry.amount).toLowerCase().includes(query) ||
        STATUS_CONFIG[entry.status]?.label.toLowerCase().includes(query)
      );
    });

    historyBody.innerHTML = '';

    if (filtered.length === 0) {
      const emptyRow = document.createElement('tr');
      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.className = 'table-empty';
      cell.textContent = 'No invoices match your search just yet.';
      emptyRow.appendChild(cell);
      historyBody.appendChild(emptyRow);
      return;
    }

    filtered.forEach(entry => {
      const row = document.createElement('tr');
      const status = STATUS_CONFIG[entry.status] || STATUS_CONFIG.processing;
      row.innerHTML = `
        <td>${formatDate(entry.date)}</td>
        <td>${entry.invoice}</td>
        <td>${formatCurrency(entry.amount)}</td>
        <td><span class="status-pill ${status.className}">${status.label}</span></td>
        <td><button type="button" class="payment-history__receipt billing-history__download" data-receipt="${entry.invoice}">Download</button></td>
      `;
      historyBody.appendChild(row);
    });
  }

  function updateAutopayUI(isEnabled) {
    autopayPills.forEach(pill => {
      pill.textContent = isEnabled ? 'Autopay Enabled' : 'Autopay Paused';
      pill.classList.toggle('business-badge--success', isEnabled);
      pill.classList.toggle('business-badge--warning', !isEnabled);
      pill.classList.toggle('business-badge--muted', false);
    });
    if (autopayButton) {
      autopayButton.textContent = isEnabled ? 'Pause autopay' : 'Resume autopay';
    }
  }

  function showFeedback(message, variant = 'success') {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.hidden = false;
    feedback.classList.remove('page-feedback--success', 'page-feedback--info', 'page-feedback--error');
    feedback.classList.add(`page-feedback--${variant}`);
    clearTimeout(feedbackTimeoutId);
    feedbackTimeoutId = window.setTimeout(() => {
      feedback.hidden = true;
    }, 6000);
  }
});

function formatCurrency(amount) {
  const value = typeof amount === 'number' ? amount : parseFloat(amount || '0');
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function formatDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function getLastFour(value) {
  const digits = sanitizeNumber(value);
  return digits ? digits.slice(-4) : '0000';
}

function sanitizeNumber(value) {
  return value ? value.toString().replace(/\D+/g, '') : '';
}

function describeUsage(usage) {
  switch (usage) {
    case 'manual':
      return 'manual one-time payments';
    case 'split':
      return 'split invoices with the primary method';
    default:
      return 'backup coverage';
  }
}
