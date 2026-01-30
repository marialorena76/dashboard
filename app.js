document.addEventListener('DOMContentLoaded', () => {
  const token = sessionStorage.getItem('memora_token');
  const userType = localStorage.getItem('userType');
  const pathname = window.location.pathname;
  const pageName = pathname.split('/').pop(); // extrae sólo el nombre del archivo

  const individualPages = [
    '/individual-dashboard.html',
    '/my-profile.html',
    '/payments.html',
    '/settings.html',
    '/protected-members-individual.html'
  ];

  const businessPages = [
    '/business-dashboard.html',
    '/business-profile.html',
    '/business-plans-billing.html',
    '/employees-covered.html'
  ];

  const individualLoginPage = 'individual-login.html';
  const businessLoginPage = 'business-login.html';

  const isIndividualPage = individualPages.some(page => page.replace('/', '') === pageName);
  const isBusinessPage = businessPages.some(page => page.replace('/', '') === pageName);
  const isProtectedPage = isIndividualPage || isBusinessPage;

  // 1. If on a protected page but no user is logged in, redirect to the correct login.
  if (isProtectedPage && !token) {
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
      // Clear all user-related data from localStorage and sessionStorage
      localStorage.removeItem('userType');
      sessionStorage.removeItem('memora_token');
      sessionStorage.removeItem('memora_user');


      window.location.href = logoutDestination;
    });
  }

  // Enable submenu toggle for My Account
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', event => {
      event.preventDefault();
      const parent = toggle.closest('.has-submenu');
      parent.classList.toggle('open');
    });
  });

  // Highlight current page in sidebar
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a, .submenu a');
  sidebarLinks.forEach(link => {
    if (link.getAttribute('href') === pageName) {
      link.classList.add('active');
      // If it's in a submenu, also open the submenu
      const parentSubmenu = link.closest('.has-submenu');
      if (parentSubmenu) {
        parentSubmenu.classList.add('open');
      }
    }
  });

  // Individual dashboard profile interactions
  const personalEditTrigger = document.querySelector('[data-personal-edit-trigger]');
  const personalDisplay = document.querySelector('[data-personal-display]');
  const personalForm = document.querySelector('[data-personal-form]');
  const personalCancel = document.querySelector('[data-personal-cancel]');

  if (personalEditTrigger && personalDisplay && personalForm) {
    const nameTargets = document.querySelectorAll('[data-user-name]');
    const emailTargets = document.querySelectorAll('[data-user-email]');
    const phoneTargets = document.querySelectorAll('[data-user-phone]');
    const addressTarget = personalDisplay.querySelector('[data-user-address]');

    const showPersonalDisplay = () => {
      personalDisplay.classList.remove('is-hidden');
      personalForm.classList.add('is-hidden');
      personalEditTrigger.classList.remove('is-hidden');
    };

    personalEditTrigger.addEventListener('click', () => {
      personalDisplay.classList.add('is-hidden');
      personalForm.classList.remove('is-hidden');
      personalEditTrigger.classList.add('is-hidden');
    });

    personalCancel?.addEventListener('click', () => {
      if (personalForm instanceof HTMLFormElement) {
        personalForm.reset();
      }
      showPersonalDisplay();
    });

    personalForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!(personalForm instanceof HTMLFormElement)) return;

      const formData = new FormData(personalForm);

      const fullName = (formData.get('personal-full-name') || '').toString().trim();
      const preferredName = (formData.get('personal-preferred-name') || '').toString().trim();
      const email = (formData.get('personal-email') || '').toString().trim();
      const phone = (formData.get('personal-phone') || '').toString().trim();
      const address1 = (formData.get('personal-address-1') || '').toString().trim();
      const address2 = (formData.get('personal-address-2') || '').toString().trim();
      const city = (formData.get('personal-city') || '').toString().trim();
      const state = (formData.get('personal-state') || '').toString().trim();
      const zip = (formData.get('personal-zip') || '').toString().trim();
      const country = (formData.get('personal-country') || '').toString().trim();

      const cityStateZipParts = [];
      if (city) cityStateZipParts.push(city);
      const stateZip = [state, zip].filter(Boolean).join(' ').trim();
      if (stateZip) cityStateZipParts.push(stateZip);
      const cityStateZip = cityStateZipParts.join(', ');

      const addressParts = [address1];
      if (address2) addressParts.push(address2);
      if (cityStateZip) addressParts.push(cityStateZip);
      if (country) addressParts.push(country);
      const formattedAddress = addressParts.filter(Boolean).join(', ');

      const displayName = fullName || preferredName;

      nameTargets.forEach(target => {
        target.textContent = displayName || '—';
      });
      emailTargets.forEach(target => {
        target.textContent = email || '—';
      });
      phoneTargets.forEach(target => {
        target.textContent = phone || '—';
      });
      if (addressTarget) {
        addressTarget.textContent = formattedAddress || '—';
      }

      showPersonalDisplay();
    });
  }

  const beneficiaryCard = document.querySelector('.beneficiary');
  if (beneficiaryCard) {
    const beneficiaryDisplay = beneficiaryCard.querySelector('[data-beneficiary-display]');
    const beneficiaryActions = beneficiaryCard.querySelector('[data-beneficiary-actions]');
    const beneficiaryEditForm = beneficiaryCard.querySelector('[data-beneficiary-edit-form]');
    const beneficiaryAddForm = beneficiaryCard.querySelector('[data-beneficiary-add-form]');
    const beneficiaryEditTrigger = beneficiaryCard.querySelector('[data-beneficiary-edit-trigger]');
    const beneficiaryAddTrigger = beneficiaryCard.querySelector('[data-beneficiary-add-trigger]');
    const beneficiaryCancelButtons = beneficiaryCard.querySelectorAll('[data-beneficiary-cancel]');

    const beneficiaryNameTarget = beneficiaryDisplay?.querySelector('[data-beneficiary-name]');
    const beneficiaryRelationshipTarget = beneficiaryDisplay?.querySelector('[data-beneficiary-relationship]');
    const beneficiaryPhoneTarget = beneficiaryDisplay?.querySelector('[data-beneficiary-phone]');
    const beneficiaryEmailTarget = beneficiaryDisplay?.querySelector('[data-beneficiary-email]');

    const showBeneficiaryView = () => {
      beneficiaryDisplay?.classList.remove('is-hidden');
      beneficiaryActions?.classList.remove('is-hidden');
      beneficiaryEditForm?.classList.add('is-hidden');
      beneficiaryAddForm?.classList.add('is-hidden');
    };

    const openBeneficiaryForm = formType => {
      beneficiaryDisplay?.classList.add('is-hidden');
      beneficiaryActions?.classList.add('is-hidden');
      if (formType === 'edit') {
        beneficiaryAddForm?.classList.add('is-hidden');
        beneficiaryEditForm?.classList.remove('is-hidden');
      } else if (formType === 'add') {
        beneficiaryEditForm?.classList.add('is-hidden');
        if (beneficiaryAddForm instanceof HTMLFormElement) {
          beneficiaryAddForm.reset();
        }
        beneficiaryAddForm?.classList.remove('is-hidden');
      }
    };

    beneficiaryEditTrigger?.addEventListener('click', () => openBeneficiaryForm('edit'));
    beneficiaryAddTrigger?.addEventListener('click', () => openBeneficiaryForm('add'));

    beneficiaryCancelButtons.forEach(button => {
      button.addEventListener('click', () => {
        const form = button.closest('form');
        if (form instanceof HTMLFormElement) {
          form.reset();
        }
        showBeneficiaryView();
      });
    });

    const handleBeneficiaryUpdate = form => {
      const formData = new FormData(form);
      const name = (formData.get('beneficiary-edit-name') || formData.get('beneficiary-add-name') || '').toString().trim();
      const relationship = (formData.get('beneficiary-edit-relationship') || formData.get('beneficiary-add-relationship') || '').toString().trim();
      const phone = (formData.get('beneficiary-edit-phone') || formData.get('beneficiary-add-phone') || '').toString().trim();
      const email = (formData.get('beneficiary-edit-email') || formData.get('beneficiary-add-email') || '').toString().trim();

      if (beneficiaryNameTarget) beneficiaryNameTarget.textContent = name || '—';
      if (beneficiaryRelationshipTarget) beneficiaryRelationshipTarget.textContent = relationship || '—';
      if (beneficiaryPhoneTarget) beneficiaryPhoneTarget.textContent = phone || '—';
      if (beneficiaryEmailTarget) beneficiaryEmailTarget.textContent = email || '—';

      if (beneficiaryEditForm instanceof HTMLFormElement) {
        if (form === beneficiaryAddForm) {
          const editableFields = {
            'beneficiary-edit-name': name,
            'beneficiary-edit-relationship': relationship,
            'beneficiary-edit-phone': phone,
            'beneficiary-edit-email': email
          };
          Object.entries(editableFields).forEach(([fieldName, value]) => {
            const field = beneficiaryEditForm.elements.namedItem(fieldName);
            if (field instanceof HTMLInputElement || field instanceof HTMLSelectElement) {
              field.value = value;
            }
          });
        }
      }

      showBeneficiaryView();
    };

    if (beneficiaryEditForm instanceof HTMLFormElement) {
      beneficiaryEditForm.addEventListener('submit', event => {
        event.preventDefault();
        handleBeneficiaryUpdate(beneficiaryEditForm);
      });
    }

    if (beneficiaryAddForm instanceof HTMLFormElement) {
      beneficiaryAddForm.addEventListener('submit', event => {
        event.preventDefault();
        handleBeneficiaryUpdate(beneficiaryAddForm);
        beneficiaryAddForm.reset();
      });
    }
  }

  // Show/hide the Add Member form on the individual Protected Members page
  const addMemberButton = document.getElementById('toAdd');
  const addMemberSection = document.getElementById('addMemberSection');
  const cancelAddButton = document.getElementById('cancelAdd');

  if (addMemberButton && addMemberSection) {
    addMemberButton.addEventListener('click', () => {
      addMemberSection.classList.remove('is-hidden');
      addMemberSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (cancelAddButton && addMemberSection) {
    cancelAddButton.addEventListener('click', () => {
      addMemberSection.classList.add('is-hidden');
    });
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const nameLabel = document.getElementById("businessNameLabel");
  const welcomeName = document.getElementById("businessWelcomeName");
  const initialsEl = document.getElementById("businessInitials");

  // Si en esta pantalla no existen esos elementos, no hacemos nada
  if (!nameLabel && !welcomeName && !initialsEl) return;

  try {
    const res = await fetch("/wp-json/memora/v1/business-profile", {
      credentials: "include",
    });

    if (!res.ok) {
      console.warn("business-profile fetch failed:", res.status);
      return;
    }

    const data = await res.json();

    const company = (data.company_name || "").trim();
    const contact = (data.primary_contact || "").trim();

    // Prioridad: Empresa > Contacto > fallback
    const displayName = company || contact || "User";

    if (nameLabel) nameLabel.textContent = displayName;
    if (welcomeName) welcomeName.textContent = contact || displayName;

    if (initialsEl) {
      const parts = displayName.split(/\s+/).filter(Boolean);
      const initials =
        (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
      initialsEl.textContent = initials || "U";
    }
  } catch (err) {
    console.error("Error loading business name:", err);
  }
});



document.addEventListener("DOMContentLoaded", function () {
  // Solo ejecutar en el dashboard de empresa
  const planStatusEl = document.getElementById("planStatusPill");
  const totalCoverageEl = document.getElementById("totalCoveragePill");
  const nextPaymentEl = document.getElementById("nextPaymentPill");

  if (!planStatusEl || !totalCoverageEl || !nextPaymentEl) {
    return; // no estamos en esa pantalla
  }

  fetch("/wp-json/memora/v1/business-plan", {
    credentials: "include", // importante para enviar la cookie de sesión de WP
  })
    .then(async (res) => {
       if (!res.ok) {
       throw new Error("HTTP " + res.status);
    }
  return res.json();
})

    .then((data) => {
      // 1) Plan Status
      if (data.plan_status && planStatusEl) {
        const map = {
          active: "ACTIVE",
          "on-hold": "ON HOLD",
          cancelled: "CANCELLED",
          expired: "EXPIRED",
          inactive: "INACTIVE",
        };
        const label = map[data.plan_status] || data.plan_status.toUpperCase();
        planStatusEl.textContent = label;
      }

      // 2) Total Coverage = empleados usados / límite de suscripción
      if (totalCoverageEl) {
        const used = data.employees_used ?? 0;
        const limit = data.employee_limit ?? 0;

        if (limit > 0) {
          totalCoverageEl.textContent = `${used} / ${limit} employees`;
        } else {
          totalCoverageEl.textContent = `${used} employees`;
        }
      }

      // 3) Next Payment
      if (nextPaymentEl) {
        if (data.next_payment) {
          const d = new Date(data.next_payment.replace(" ", "T"));
          const options = { year: "numeric", month: "short", day: "2-digit" };
          const formatted = d
            .toLocaleDateString("en-US", options)
            .toUpperCase(); // tipo JAN 10, 2026
          nextPaymentEl.textContent = formatted;
        } else {
          nextPaymentEl.textContent = "—";
        }
      }
    })
    .catch((err) => {
      console.error("Error al cargar business-plan:", err);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("businessProfileForm");
  if (!form) return; // no estamos en esa sección

  const fields = {
    company_name:      form.querySelector("[name='company_name']"),
    primary_contact:   form.querySelector("[name='primary_contact']"), // si lo querés editable más adelante
    work_email:        form.querySelector("[name='work_email']"),
    work_phone:        form.querySelector("[name='work_phone']"),
    hq_street:         form.querySelector("[name='hq_street']"),
    suite_or_unit:     form.querySelector("[name='suite_or_unit']"),
    city:              form.querySelector("[name='city']"),
    state:             form.querySelector("[name='state']"),
    postal_code:       form.querySelector("[name='postal_code']"),
    tax_id:            form.querySelector("[name='tax_id']"),
    employees_covered: form.querySelector("[name='employees_covered']"),
    billing_cadence:   form.querySelector("[name='billing_cadence']"),
  };

  // 1) Cargar datos desde la API
fetch("/wp-json/memora/v1/business-profile", {
  credentials: "include",
})
.then(async (res) => {
  if (!res.ok) {
    throw new Error("HTTP " + res.status);
  }
  return res.json();
})
.then((data) => {
  console.log("Business profile:", data);
})
.catch((err) => {
  console.error("Error cargando business-profile:", err);
});
  
  // 2) Guardar cambios
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {};
    Object.entries(fields).forEach(([key, input]) => {
      if (!input) return;
      payload[key] = input.value;
    });

    fetch("/wp-json/memora/v1/business-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    })
      .then(res => res.json())
      .then(resp => {
        if (resp && resp.success) {
          alert("Business profile updated successfully.");
        } else {
          console.warn("Respuesta inesperada:", resp);
          alert("There was a problem saving your changes.");
        }
      })
      .catch(err => {
        console.error("Error guardando business-profile:", err);
        alert("There was a problem saving your changes.");
      });
  });


document.addEventListener("DOMContentLoaded", () => {
  const addEmployeeCta = document.querySelector(
    ".enterprise-action[data-i18n-key='add_employee_button']"
  );

  if (addEmployeeCta) {
    addEmployeeCta.addEventListener("click", () => {
      window.location.href = "employees-covered.html#addMemberSection";
    });
  }
});

});


