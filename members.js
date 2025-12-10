document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#membersTable tbody');
  if (!tableBody) return;

  const toAddBtn = document.getElementById('toAdd');
  const exportButton = document.getElementById('exportRoster');

  const addForm = document.getElementById('addMemberForm');
  const editForm = document.getElementById('editMemberForm');
  const removeForm = document.getElementById('removeMemberForm');

  const addSection = document.getElementById('addMemberSection');
  const editSection = document.getElementById('editMemberSection');
  const removeSection = document.getElementById('removeMemberSection');

  const editSelect = document.getElementById('editSelect');
  const removeSelect = document.getElementById('removeSelect');

  const cancelAdd = document.getElementById('cancelAdd');
  const cancelEdit = document.getElementById('cancelEdit');
  const cancelRemove = document.getElementById('cancelRemove');

  const entriesSelect = document.getElementById('entriesSelect');
  const searchInput = document.getElementById('memberSearch');
  const pagination = document.getElementById('membersPagination');
  const countLabel = document.getElementById('membersCount');

  const STORAGE_KEY = 'businessMembers';
  let currentPage = 1;

  // --- MemoraCare API Backend (WordPress REST) ---
  let employees = [];

  // GET employees from WP
  async function apiFetchEmployees() {
    const res = await fetch('/wp-json/memora/v1/employees', {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Error fetching employees');
    return await res.json();
  }

  // CREATE employee
  async function apiCreateEmployee(employee) {
    const res = await fetch('/wp-json/memora/v1/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(employee)
    });
    if (!res.ok) throw new Error('Error creating employee');
    return await res.json(); // { id: 123 }
  }

  // DELETE employee
  async function apiDeleteEmployee(id) {
    const res = await fetch(`/wp-json/memora/v1/employees/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Error deleting employee');
    return await res.json();
  }

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const EDIT_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4.586a1 1 0 0 0 .707-.293l9.414-9.414a2 2 0 0 0 0-2.828l-1.172-1.172a2 2 0 0 0-2.828 0L5.293 15.707A1 1 0 0 0 5 16.414V20zM17 6l1 1-1.5 1.5-1-1L17 6zM7 17.5l7.793-7.793 1 1L8 18.5H7v-1z"></path></svg>';
  const DELETE_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3a1 1 0 0 0-.894.553L7.382 5H4a1 1 0 0 0 0 2h1l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12h1a1 1 0 0 0 0-2h-3.382l-.724-1.447A1 1 0 0 0 15 3H9zm1.618 2L11 4h2l.382 1H10.618zM9 9a1 1 0 0 1 1.006.894L10.5 17a1 1 0 0 1-1.993.112L8 10a1 1 0 0 1 1-1zm6 0a1 1 0 0 1 1 1l-.5 7a1 1 0 1 1-1.994-.112L14 10a1 1 0 0 1 1-1z"></path></svg>';

  const defaultMembers = [
    {
      firstName: 'Ava',
      lastName: 'Montgomery',
      email: 'ava.montgomery@legacybridge.com',
      role: 'People Operations Lead',
      department: 'People Operations',
      coverageStart: '2023-01-15',
      planAccess: 'Full Coverage',
      status: 'Protected'
    },
    {
      firstName: 'Jordan',
      lastName: 'Lee',
      email: 'jordan.lee@legacybridge.com',
      role: 'Product Manager',
      department: 'Product',
      coverageStart: '2024-02-29',
      planAccess: 'Health + Vision',
      status: 'Protected'
    },
    {
      firstName: 'Priya',
      lastName: 'Shah',
      email: 'priya.shah@legacybridge.com',
      role: 'Finance Director',
      department: 'Finance',
      coverageStart: '2022-09-11',
      planAccess: 'Full Coverage',
      status: 'Protected'
    },
    {
      firstName: 'Noah',
      lastName: 'Garcia',
      email: 'noah.garcia@legacybridge.com',
      role: 'Customer Success Manager',
      department: 'Customer Success',
      coverageStart: '2024-07-08',
      planAccess: 'Health + Dental',
      status: 'Invited'
    },
    {
      firstName: 'Sofía',
      lastName: 'Alvarez',
      email: 'sofia.alvarez@legacybridge.com',
      role: 'HR Coordinator',
      department: 'People Operations',
      coverageStart: '2023-11-20',
      planAccess: 'Dental Only',
      status: 'Pending'
    }
  ];

  function normalizeMember(member = {}) {
    return {
      firstName: (member.firstName || '').trim(),
      lastName: (member.lastName || '').trim(),
      email: (member.email || '').trim(),
      role: (member.role || '').trim(),
      department: (member.department || '').trim(),
      coverageStart: member.coverageStart || '',
      planAccess: member.planAccess || 'Full Coverage',
      status: member.status || 'Protected'
    };
  }

  // Render desde API: toma empleados de WP, los adapta y actualiza la UI
  function renderEmployeesFromWP(apiEmployees = []) {
    try {
      const members = apiEmployees.map(normalizeMember);
      saveMembers(members); // seguimos usando localStorage para el resto del código
      currentPage = 1;
      renderTable();
      updateSelects(members);
    } catch (error) {
      console.error('Error rendering employees from API', error);
    }
  }

  function loadMembers() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map(normalizeMember);
    } catch (error) {
      console.error('Unable to load members from storage', error);
      return [];
    }
  }

  function saveMembers(members) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(members.map(normalizeMember))
    );
  }

  function seedMembers() {
    if (loadMembers().length === 0) {
      saveMembers(defaultMembers);
    }
  }

  function getMembersWithIndex() {
    return loadMembers().map((member, index) => ({ ...member, index }));
  }

  function filterMembers(members) {
    const searchTerm = (searchInput?.value || '').trim().toLowerCase();
    if (!searchTerm) {
      return members;
    }

    return members.filter(member => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const email = (member.email || '').toLowerCase();
      const role = (member.role || '').toLowerCase();
      const department = (member.department || '').toLowerCase();
      const coverage = (member.planAccess || '').toLowerCase();

      return (
        fullName.includes(searchTerm) ||
        email.includes(searchTerm) ||
        role.includes(searchTerm) ||
        department.includes(searchTerm) ||
        coverage.includes(searchTerm)
      );
    });
  }

  function createButton(label, page, { disabled = false, active = false, ariaLabel } = {}) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.disabled = disabled;
    button.className = [
      'pagination-button',
      active ? 'is-active' : '',
      disabled ? 'is-disabled' : ''
    ]
      .filter(Boolean)
      .join(' ');
    button.setAttribute('aria-label', ariaLabel || label);
    button.addEventListener('click', () => {
      if (currentPage !== page && !disabled) {
        currentPage = page;
        renderTable();
      }
    });
    return button;
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';

    if (totalPages <= 1) {
      pagination.style.display = 'none';
      return;
    }

    pagination.style.display = 'flex';

    pagination.appendChild(
      createButton('‹', Math.max(1, currentPage - 1), {
        disabled: currentPage === 1,
        ariaLabel: 'Previous page'
      })
    );

    for (let page = 1; page <= totalPages; page += 1) {
      pagination.appendChild(
        createButton(String(page), page, {
          active: page === currentPage,
          ariaLabel: `Page ${page}`
        })
      );
    }

    pagination.appendChild(
      createButton('›', Math.min(totalPages, currentPage + 1), {
        disabled: currentPage === totalPages,
        ariaLabel: 'Next page'
      })
    );
  }

  function renderTable() {
    const membersCollection = getMembersWithIndex();
    const filteredMembers = filterMembers(membersCollection);
    const totalFiltered = filteredMembers.length;
    const pageSize = parseInt(entriesSelect?.value, 10) || 5;

    if (totalFiltered === 0) {
      tableBody.innerHTML = '';
      const emptyRow = document.createElement('tr');
      const emptyCell = document.createElement('td');
      emptyCell.colSpan = 5;
      emptyCell.textContent = 'No employees found';
      emptyCell.classList.add('empty-state');
      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);

      countLabel.textContent = 'Showing 0 employees';
      renderPagination(1);
      return;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const pageMembers = filteredMembers.slice(
      startIndex,
      startIndex + pageSize
    );

    tableBody.innerHTML = '';

    pageMembers.forEach(member => {
      const {
        index,
        firstName,
        lastName,
        email,
        role,
        department,
        coverageStart,
        planAccess,
        status
      } = member;

      const row = document.createElement('tr');

      const fullName = `${firstName} ${lastName}`.trim() || `Employee ${index + 1}`;
      const date = coverageStart ? dateFormatter.format(new Date(coverageStart)) : 'Not set';

      const statusClass =
        status === 'Protected'
          ? 'status-protected'
          : status === 'Invited'
          ? 'status-invited'
          : 'status-pending';

      const statusText =
        status === 'Protected'
          ? 'Protected'
          : status === 'Invited'
          ? 'Invited'
          : 'Pending';

      row.innerHTML = `
        <td>
          <div class="employee-cell">
            <div class="avatar avatar--small">
              <span class="avatar__initials">
                ${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}
              </span>
            </div>
            <div class="employee-cell__info">
              <div class="employee-cell__name">${fullName}</div>
              <div class="employee-cell__email">${email || ''}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="role-cell">
            <div class="role-cell__title">${role || 'Not assigned'}</div>
            <div class="role-cell__department">${department || ''}</div>
          </div>
        </td>
        <td>
          <div class="coverage-cell">
            <div class="coverage-cell__plan">${planAccess || 'Not assigned'}</div>
            <div class="coverage-cell__date">Coverage start ${date}</div>
          </div>
        </td>
        <td>
          <span class="status-chip ${statusClass}">${statusText}</span>
        </td>
        <td class="actions-column">
          <div class="table-actions">
            <button type="button" class="table-action action-edit" data-index="${index}" aria-label="Edit ${fullName}">
              ${EDIT_ICON}
            </button>

            <button type="button" class="table-action action-delete" data-index="${index}" aria-label="Remove ${fullName}">
              ${DELETE_ICON}
            </button>

            <button type="button" class="table-action action-beneficiary" data-index="${index}">
              ${member.hasBeneficiary ? 'Edit Beneficiary' : 'Add Beneficiary'}
            </button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
    });

    const firstIndex = startIndex + 1;
    const lastIndex = Math.min(startIndex + pageSize, totalFiltered);
    countLabel.textContent = `Showing ${firstIndex}-${lastIndex} of ${totalFiltered} employees`;

    const totalPages = Math.ceil(totalFiltered / pageSize);
    renderPagination(totalPages);
  }

  function updateSelects(members = loadMembers()) {
    if (!editSelect && !removeSelect) return;
    const selects = [editSelect, removeSelect].filter(Boolean);
    selects.forEach(select => {
      const currentValue = select.value;
      select.innerHTML = '<option value="">Select employee</option>';
      members.forEach((member, index) => {
        const option = document.createElement('option');
        option.value = String(index);
        const name = `${member.firstName} ${member.lastName}`.trim();
        option.textContent = name || `Employee ${index + 1}`;
        select.appendChild(option);
      });
      if (currentValue && Number(currentValue) < members.length) {
        select.value = currentValue;
      } else {
        select.value = '';
      }
    });
  }

  function exportRoster() {
    const members = loadMembers();
    const header = ['First Name', 'Last Name', 'Email', 'Role', 'Department', 'Coverage Start', 'Plan Access', 'Status'];
    const rows = members.map(member => [
      member.firstName,
      member.lastName,
      member.email,
      member.role,
      member.department,
      member.coverageStart,
      member.planAccess,
      member.status
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'protected-team.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Carga inicial de empleados desde la API de WordPress
  async function loadEmployeesFromWP() {
    try {
      const apiEmployees = await apiFetchEmployees();
      employees = apiEmployees;
      renderEmployeesFromWP(apiEmployees);
    } catch (error) {
      console.error('Error loading employees from API, fallback to default storage', error);
      // Fallback: si falla la API usamos el flujo anterior basado en localStorage
      seedMembers();
      renderTable();
      updateSelects();
    }
  }

  // INICIALIZACIÓN
  loadEmployeesFromWP();

  if (toAddBtn && addSection) {
    toAddBtn.addEventListener('click', () => {
      addSection.scrollIntoView({ behavior: 'smooth' });
      addForm?.elements.firstName?.focus();
    });
  }

  if (entriesSelect) {
    entriesSelect.addEventListener('change', () => {
      currentPage = 1;
      renderTable();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      currentPage = 1;
      renderTable();
    });
  }

  if (exportButton) {
    exportButton.addEventListener('click', exportRoster);
  }

  if (addForm) {
    addForm.addEventListener('submit', async event => {
      event.preventDefault();
      const member = normalizeMember({
        firstName: addForm.elements.firstName.value,
        lastName: addForm.elements.lastName.value,
        email: addForm.elements.email.value,
        role: addForm.elements.role.value,
        department: addForm.elements.department.value,
        coverageStart: addForm.elements.coverageStart.value,
        planAccess: addForm.elements.planAccess.value,
        status: addForm.elements.status.value
      });

      try {
        await apiCreateEmployee(member);
        addForm.reset();
        await loadEmployeesFromWP(); // recarga todo desde la API
      } catch (error) {
        console.error('Error creating employee', error);
        alert('No se pudo crear el empleado. Intentalo de nuevo.');
      }
    });
  }

  if (cancelAdd && addForm) {
    cancelAdd.addEventListener('click', () => {
      addForm.reset();
    });
  }

  if (editForm && editSelect) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      const members = loadMembers();
      const idx = Number(editSelect?.value || -1);
      if (idx < 0 || idx >= members.length) {
        return;
      }
      members[idx] = normalizeMember({
        firstName: editForm.elements.firstName.value,
        lastName: editForm.elements.lastName.value,
        email: editForm.elements.email.value,
        role: editForm.elements.role.value,
        department: editForm.elements.department.value,
        coverageStart: editForm.elements.coverageStart.value,
        planAccess: editForm.elements.planAccess.value,
        status: editForm.elements.status.value
      });
      saveMembers(members);
      renderTable();
      updateSelects(members);
      editForm.reset();
      editSelect.value = '';
    });
  }

  if (cancelEdit && editForm) {
    cancelEdit.addEventListener('click', () => {
      editForm.reset();
      if (editSelect) {
        editSelect.value = '';
      }
    });
  }

  if (removeForm && removeSelect) {
    removeForm.addEventListener('submit', async event => {
      event.preventDefault();
      const idx = Number(removeSelect.value);
      if (Number.isNaN(idx)) {
        return;
      }
      const members = loadMembers();
      if (idx < 0 || idx >= members.length) {
        return;
      }

      try {
        const apiEmployees = await apiFetchEmployees();
        const employeeToDelete = apiEmployees[idx];
        if (!employeeToDelete || !employeeToDelete.id) {
          throw new Error('Empleado no encontrado en API');
        }

        await apiDeleteEmployee(employeeToDelete.id);
        await loadEmployeesFromWP();
        removeForm.reset();
        removeSelect.value = '';
      } catch (error) {
        console.error('Error deleting employee', error);
        alert('No se pudo eliminar el empleado. Intentalo de nuevo.');
      }
    });
  }

  if (cancelRemove && removeForm) {
    cancelRemove.addEventListener('click', () => {
      removeForm.reset();
      removeSelect.value = '';
    });
  }

  tableBody.addEventListener('click', event => {
    const actionButton = event.target.closest('.table-action');
    if (!actionButton) return;

    const row = actionButton.closest('tr');
    const index = row ? row.rowIndex - 1 : -1;
    if (index < 0) return;

    const members = filterMembers(getMembersWithIndex());
    const member = members[index];
    if (!member) return;

    const fullIndex = member.index;
    const idx = fullIndex;

    if (actionButton.classList.contains('action-edit')) {
      if (editSelect) {
        editSelect.value = idx;
        editSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (editSection) {
        editSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (actionButton.classList.contains('action-delete')) {
      if (removeSelect) {
        removeSelect.value = idx;
      }
      if (removeSection) {
        removeSection.scrollIntoView({ behavior: 'smooth' });
      }
    }

    if (actionButton.classList.contains('action-beneficiary')) {
      alert('Aquí abrís modal o sección de Beneficiary para el empleado #' + idx);
    }
  });
});
