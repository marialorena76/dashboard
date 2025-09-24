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

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const EDIT_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12l-2.88-2.88a1.5 1.5 0 0 0-2.12 0L3 15v5z"></path><path d="M13.5 6.5l4 4"></path></svg>';
  const DELETE_ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 7l1-2h4l1 2"></path><path d="M6 7l1 12a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7"></path></svg>';

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
      coverageStart: '2024-03-01',
      planAccess: 'Health + Vision',
      status: 'Protected'
    },
    {
      firstName: 'Priya',
      lastName: 'Shah',
      email: 'priya.shah@legacybridge.com',
      role: 'Finance Director',
      department: 'Finance',
      coverageStart: '2022-09-12',
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
    return loadMembers().map((member, index) => ({ member, index }));
  }

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return dateFormatter.format(date);
  }

  function getStatusClass(status) {
    const normalized = (status || '').toLowerCase();
    if (normalized === 'invited') return 'status-chip--invited';
    if (normalized === 'pending') return 'status-chip--pending';
    if (normalized === 'suspended') return 'status-chip--suspended';
    return 'status-chip--protected';
  }

  function filterMembers(collection) {
    const query = (searchInput?.value || '').trim().toLowerCase();
    if (!query) return collection;
    return collection.filter(({ member }) => {
      const haystack = [
        member.firstName,
        member.lastName,
        member.email,
        member.role,
        member.department,
        member.planAccess,
        member.status
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';
    if (totalPages <= 1) {
      return;
    }

    const createButton = (label, targetPage, { disabled = false, active = false, ariaLabel } = {}) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
      }
      if (disabled) {
        button.disabled = true;
      } else {
        button.addEventListener('click', () => {
          currentPage = targetPage;
          renderTable();
        });
      }
      if (active) {
        button.classList.add('is-active');
        button.setAttribute('aria-current', 'page');
      }
      return button;
    };

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
      emptyCell.className = 'members-table__empty';

      if (membersCollection.length === 0) {
        emptyCell.textContent = 'No team members yet.';
        if (countLabel) {
          countLabel.textContent = 'No team members yet.';
        }
      } else {
        const query = (searchInput?.value || '').trim();
        emptyCell.textContent = query
          ? `No matches found for “${query}”.`
          : 'No members match your search.';
        if (countLabel) {
          countLabel.textContent = emptyCell.textContent;
        }
      }

      emptyRow.appendChild(emptyCell);
      tableBody.appendChild(emptyRow);
      renderPagination(0);
      return;
    }

    const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * pageSize;
    const pageMembers = filteredMembers.slice(startIndex, startIndex + pageSize);

    tableBody.innerHTML = '';
    pageMembers.forEach(({ member, index }) => {
      const row = document.createElement('tr');
      const fullName = `${member.firstName} ${member.lastName}`.trim() || '—';
      const coverageStart = formatDate(member.coverageStart);
      const coveragePrimary = coverageStart ? `Coverage start ${coverageStart}` : member.planAccess || '—';
      const coverageSecondary = coverageStart ? member.planAccess : '';
      const statusText = member.status || 'Protected';
      const statusClass = getStatusClass(statusText);

      row.innerHTML = `
        <td>
          <div class="member-name">${fullName}</div>
          <div class="member-meta">${member.email || ''}</div>
        </td>
        <td>
          <div class="member-name">${member.role || '—'}</div>
          <div class="member-meta">${member.department || ''}</div>
        </td>
        <td>
          <div class="member-name">${coveragePrimary}</div>
          <div class="member-meta">${coverageSecondary}</div>
        </td>
        <td>
          <span class="status-chip ${statusClass}">${statusText}</span>
        </td>
        <td class="actions-column">
          <div class="table-actions">
            <button type="button" class="table-action action-edit" data-index="${index}" aria-label="Edit ${fullName}">
              ${EDIT_ICON}
            </button>
            <button type="button" class="table-action action-delete danger" data-index="${index}" aria-label="Remove ${fullName}">
              ${DELETE_ICON}
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(row);
    });

    const rangeStart = startIndex + 1;
    const rangeEnd = startIndex + pageMembers.length;
    const labelSuffix = totalFiltered === 1 ? 'team member' : 'team members';
    if (countLabel) {
      countLabel.textContent = `Showing ${rangeStart}-${rangeEnd} of ${totalFiltered} ${labelSuffix}`;
    }

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

  function populateEditForm(index) {
    if (!editForm) return;
    const members = loadMembers();
    const member = members[index];
    if (!member) {
      editForm.reset();
      return;
    }
    editForm.elements.firstName.value = member.firstName;
    editForm.elements.lastName.value = member.lastName;
    editForm.elements.email.value = member.email;
    editForm.elements.role.value = member.role;
    editForm.elements.department.value = member.department;
    editForm.elements.coverageStart.value = member.coverageStart;
    editForm.elements.planAccess.value = member.planAccess;
    editForm.elements.status.value = member.status;
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

  seedMembers();
  renderTable();
  updateSelects();

  if (toAddBtn && addSection) {
    toAddBtn.addEventListener('click', () => {
      addSection.scrollIntoView({ behavior: 'smooth' });
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
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      const members = loadMembers();
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
      members.push(member);
      saveMembers(members);
      addForm.reset();
      currentPage = 1;
      renderTable();
      updateSelects(members);
    });
  }

  if (cancelAdd && addForm) {
    cancelAdd.addEventListener('click', () => {
      addForm.reset();
    });
  }

  if (editSelect && editForm) {
    editSelect.addEventListener('change', () => {
      const idx = editSelect.value;
      if (idx === '') {
        editForm.reset();
        return;
      }
      populateEditForm(Number(idx));
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      const idx = Number(editSelect.value);
      if (Number.isNaN(idx)) {
        return;
      }
      const members = loadMembers();
      if (!members[idx]) {
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
    removeForm.addEventListener('submit', event => {
      event.preventDefault();
      const idx = Number(removeSelect.value);
      if (Number.isNaN(idx)) {
        return;
      }
      const members = loadMembers();
      if (idx < 0 || idx >= members.length) {
        return;
      }
      members.splice(idx, 1);
      saveMembers(members);
      currentPage = 1;
      renderTable();
      updateSelects(members);
      removeForm.reset();
      removeSelect.value = '';
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
    const idx = actionButton.dataset.index;
    if (idx === undefined) return;

    if (actionButton.classList.contains('action-edit')) {
      if (editSelect) {
        editSelect.value = idx;
        editSelect.dispatchEvent(new Event('change'));
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
  });
});
