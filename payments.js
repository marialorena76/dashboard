document.addEventListener('DOMContentLoaded', () => {
  const editForm = document.getElementById('editPaymentForm');
  const addForm = document.getElementById('addPaymentForm');
  const historyBody = document.getElementById('historyBody');
  const searchInput = document.getElementById('paymentSearch');
  const cancelEdit = document.getElementById('cancelEdit');
  const cancelAdd = document.getElementById('cancelAdd');

  let methods = JSON.parse(localStorage.getItem('paymentMethods') || '[]');

  function saveMethods() {
    localStorage.setItem('paymentMethods', JSON.stringify(methods));
  }

  if (methods.length === 0) {
    methods.push({ method: 'Visa', card: '**** **** **** 1234', exp: '12/25' });
    saveMethods();
  }

  function renderCurrent() {
    const current = methods[0];
    editForm.currentMethod.value = current.method;
    editForm.currentCard.value = current.card;
    editForm.currentExp.value = current.exp;
  }

  renderCurrent();

  editForm.addEventListener('submit', e => {
    e.preventDefault();
    methods[0] = {
      method: editForm.currentMethod.value,
      card: editForm.currentCard.value,
      exp: editForm.currentExp.value
    };
    saveMethods();
    alert('Payment method updated');
  });

  cancelEdit.addEventListener('click', () => {
    renderCurrent();
  });

  addForm.addEventListener('submit', e => {
    e.preventDefault();
    const newMethod = {
      method: addForm.newMethod.value,
      card: addForm.newCard.value,
      exp: addForm.newExp.value
    };
    methods.unshift(newMethod);
    saveMethods();
    addForm.reset();
    renderCurrent();
    alert('New payment method added');
  });

  cancelAdd.addEventListener('click', () => {
    addForm.reset();
  });

  const defaultHistory = [
    { date: 'Jan 15, 2025', amount: '$120', status: 'PAID' },
    { date: 'Dec 15, 2024', amount: '$120', status: 'PAID' },
    { date: 'Nov 15, 2024', amount: '$120', status: 'PAID' },
    { date: 'Oct 15, 2024', amount: '$120', status: 'PAID' }
  ];

  const history = JSON.parse(localStorage.getItem('paymentHistory') || JSON.stringify(defaultHistory));

  function renderHistory() {
    historyBody.innerHTML = '';
    history.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.date}</td>
        <td>${item.amount}</td>
        <td><span class="status paid">${item.status}</span></td>
        <td><button class="download-btn">Download</button></td>`;
      historyBody.appendChild(tr);
    });
  }

  renderHistory();

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    historyBody.querySelectorAll('tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  });

  historyBody.addEventListener('click', e => {
    if (e.target.classList.contains('download-btn')) {
      alert('Receipt download not implemented.');
    }
  });
});
