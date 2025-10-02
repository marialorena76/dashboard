document.addEventListener('DOMContentLoaded', () => {
  const userType = localStorage.getItem('userType');
  const pathname = window.location.pathname;

  const individualPages = [
    '/individual-dashboard.html',
    '/my-profile.html',
    '/payments.html',
    '/settings.html'
  ];

  const businessPages = [
    '/business-dashboard.html',
    '/business-profile.html',
    '/business-plans-billing.html',
    '/protected-members.html'
  ];

  const individualLoginPage = 'individual-login.html';
  const businessLoginPage = 'business-login.html';

  const isIndividualPage = individualPages.some(page => pathname.includes(page));
  const isBusinessPage = businessPages.some(page => pathname.includes(page));
  const isProtectedPage = isIndividualPage || isBusinessPage;

  // 1. If on a protected page but no user is logged in, redirect to the correct login.
  if (isProtectedPage && !userType) {
    if (isIndividualPage) {
      window.location.href = individualLoginPage;
    } else if (isBusinessPage) {
      window.location.href = businessLoginPage;
    }
    return;
  }

  // 2. If a user is logged in, check if they are on the correct type of page.
  if (userType) {
    // Individual user on a business page -> redirect
    if (userType === 'individual' && isBusinessPage) {
      window.location.href = 'individual-dashboard.html';
      return;
    }
    // Business user on an individual page -> redirect
    if (userType === 'business' && isIndividualPage) {
      window.location.href = 'business-dashboard.html';
      return;
    }
  }

  // 3. Setup logout button
  const logoutButton = document.querySelector('.logout');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      const logoutDestination = userType === 'business'
        ? businessLoginPage
        : individualLoginPage;
      // Clear all user-related data from localStorage
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('mallow-') || key === 'userType') {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      window.location.href = logoutDestination;
    });
  }
});