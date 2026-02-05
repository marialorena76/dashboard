document.addEventListener('DOMContentLoaded', () => {
  const statusEl = document.getElementById('planStatus');
  const coverageEl = document.getElementById('planCoverage');
  const paymentEl = document.getElementById('nextPayment');
  const currentPlanEl = document.getElementById('currentPlan');
  const expireBtn = document.getElementById('expirePlan');
  const upgradeBtns = document.querySelectorAll('.upgrade-btn');
  const updatePaymentMethodBtn = document.getElementById('updatePaymentMethod');
  const exploreUpgradesBtn = document.getElementById('exploreUpgrades');

  const defaults = {
    status: '-',
    coverage: '-',
    nextPayment: '-',
    currentPlan: '-'
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

  if (updatePaymentMethodBtn) {
    updatePaymentMethodBtn.addEventListener('click', () => {
      window.location.href = 'payments.html';
    });
  }

  if (exploreUpgradesBtn) {
    exploreUpgradesBtn.addEventListener('click', () => {
      alert('Explore upgrade options');
    });
  }
});
