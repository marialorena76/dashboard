document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('planStatus');
  const coverageEl = document.getElementById('planCoverage');
  const paymentEl = document.getElementById('nextPayment');
  const currentPlanEl = document.getElementById('currentPlan');
  const expireBtn = document.getElementById('expirePlan');
  const upgradeBtns = document.querySelectorAll('.upgrade-btn');
  const updatePaymentBtn = document.getElementById('updatePayment');

  const defaults = {
    status: 'ACTIVE',
    coverage: 'Up to $100,000',
    nextPayment: '$490.03 due Jan 17, 2025',
    currentPlan: 'Individual Plan'
  };

  const plan = JSON.parse(localStorage.getItem('planInfo') || JSON.stringify(defaults));

  function render() {
    statusEl.textContent = plan.status;
    statusEl.classList.toggle('expired', plan.status !== 'ACTIVE');
    coverageEl.textContent = plan.coverage;
    paymentEl.textContent = plan.nextPayment;
    currentPlanEl.textContent = plan.currentPlan;
  }

  render();

  function save() {
    localStorage.setItem('planInfo', JSON.stringify(plan));
  }

  expireBtn.addEventListener('click', () => {
    plan.status = 'EXPIRED';
    save();
    render();
  });

  upgradeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const newPlan = btn.dataset.plan;
      plan.currentPlan = newPlan;
      plan.status = 'ACTIVE';
      if (newPlan === 'Family Plan') {
        plan.coverage = 'Up to $200,000';
      } else if (newPlan === 'Premium Plan') {
        plan.coverage = 'Up to $500,000';
      }
      save();
      render();
      alert(`Plan upgraded to ${newPlan}`);
    });
  });

  updatePaymentBtn.addEventListener('click', () => {
codex/add-images-and-create-user-dashboard-v85he0
    window.location.href = 'payments.html';

codex/add-images-and-create-user-dashboard-vak73b
    window.location.href = 'payments.html';

    alert('Payment method update not implemented.');
 main
 main
  });
});
