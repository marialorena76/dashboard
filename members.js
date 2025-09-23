document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#membersTable tbody');
  if (!tableBody) return;

  const toAddBtn = document.getElementById('toAdd');

  const addForm = document.getElementById('addMemberForm');
  const editForm = document.getElementById('editMemberForm');
  const removeForm = document.getElementById('removeMemberForm');

  const editSelect = document.getElementById('editSelect');
  const removeSelect = document.getElementById('removeSelect');

  const cancelAdd = document.getElementById('cancelAdd');
  const cancelEdit = document.getElementById('cancelEdit');
  const cancelRemove = document.getElementById('cancelRemove');

  const entriesSelect = document.getElementById('entriesSelect');
  const searchInput = document.getElementById('memberSearch');
  const pagination = document.getElementById('membersPagination');
  const countLabel = document.getElementById('membersCount');

  let currentPage = 1;

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const EDIT_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a1.5 1.5 0 0 0 0-2.12l-2.88-2.88a1.5 1.5 0 0 0-2.12 0L3 15v5z"></path><path d="M13.5 6.5l4 4"></path></svg>';
  const DELETE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 7l1-2h4l1 2"></path><path d="M6 7l1 12a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9L18 7"></path></svg>';

  function formatDate(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return dateFormatter.format(date);
  }

  function normalizeMember(member = {}) {
    return {
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      dob: member.dob || '',
      relation: member.relation || '',
      idExpiration: member.idExpiration || member.expiration || '',
      address: member.address || '',
      city: member.city || '',
      state: member.state || '',
      zip: member.zip || '',
      status: member.status || 'Protected'
    };
  }

  function loadMembers() {
    try {
      return (JSON.parse(localStorage.getItem('members') || '[]') || []).map(normalizeMember);
    } catch (error) {
      return [];
    }
  }

  function saveMembers(members) {
    localStorage.setItem('members', JSON.stringify(members.map(normalizeMember)));
  }

  function bootstrapMembers() {
    const stored = localStorage.getItem('members');
    if (!stored || stored === '[]') {
      const seededMembers = [
        {
          firstName: 'Daniel',
          lastName: 'Thompson',
          dob: '1982-03-12',
          relation: 'Spouse',
          idExpiration: '2026-09-15',
          address: '215 Grove Street',
          city: 'Austin',
          state: 'TX',
          zip: '73301',
          status: 'Protected'
        },
        {
          firstName: 'Amelia',
          lastName: 'Thompson',
          dob: '2011-07-04',
          relation: 'Daughter',
          idExpiration: '2028-01-30',
          address: '215 Grove Street',
          city: 'Austin',
          state: 'TX',
          zip: '73301',
          status: 'Protected'
        },
        {
          firstName: 'Andy',
          lastName: 'Thompson',
          dob: '2009-11-18',
          relation: 'Son',
          idExpiration: '2027-06-22',
          address: '215 Grove Street',
          city: 'Austin',
          state: 'TX',
          zip: '73301',
          status: 'Protected'
        },
        {
          firstName: 'José',
          lastName: 'Ramirez',
          dob: '1954-02-09',
          relation: 'Parent',
          idExpiration: '2025-12-01',
          address: '45 Laurel Ave',
          city: 'San Antonio',
          state: 'TX',
          zip: '78205',
          status: 'Protected'
        }
      ];
      saveMembers(seededMembers);
      return;
    }

    const normalized = loadMembers();
    saveMembers(normalized);
  }

  function getMembersWithIndex() {
    return loadMembers().map((member, index) => ({ member, index }));
  }

  function filterMembers(collection) {
    const query = (searchInput?.value || '').trim().toLowerCase();
    if (!query) return collection;
    return collection.filter(({ member }) => {
      const haystack = [
        member.firstName,
        member.lastName,
        member.relation,
        member.status,
        member.city,
        member.state,
        member.zip
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
      emptyCell.colSpan = 4;
      emptyCell.className = 'members-table__empty';

      if (membersCollection.length === 0) {
        emptyCell.textContent = 'No protected members yet.';
        if (countLabel) {
          countLabel.textContent = 'No protected members yet.';
        }
      } else {
        emptyCell.textContent = 'No members match your search.';
        if (countLabel) {
          const query = (searchInput?.value || '').trim();
          countLabel.textContent = query
            ? `No matches found for “${query}”.`
            : 'No members match your search.';
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
      const fullName = `${member.firstName} ${member.lastName}`.trim();
      const statusText = (member.status || 'Protected').toUpperCase();
      const dobDisplay = formatDate(member.dob);
      const expirationDisplay = formatDate(member.idExpiration);
      const metaParts = [];
      if (dobDisplay) metaParts.push(`DOB: ${dobDisplay}`);
      if (expirationDisplay) metaParts.push(`ID Exp: ${expirationDisplay}`);
      const metaText = metaParts.join(' • ');
      row.innerHTML = `
        <td>
          <div class="member-name">${fullName || '—'}</div>
          <div class="member-meta">${metaText}</div>
        </td>
        <td>${member.relation || '—'}</td>
        <td><span class="status-chip">${statusText}</span></td>
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
    if (countLabel) {
      countLabel.textContent = `Showing ${rangeStart}-${rangeEnd} of ${totalFiltered} entries`;
    }

    renderPagination(totalPages);
  }

  function updateSelects(members = loadMembers()) {
    if (!editSelect || !removeSelect) return;
    [editSelect, removeSelect].forEach(sel => {
      sel.innerHTML = '<option value="">Select Member</option>';
codex/editar-solo-datos-columna-derecha-x49oz3
      members.forEach((member, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${member.firstName} ${member.lastName}`.trim() || `Member ${index + 1}`;
        sel.appendChild(option);

      members.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${m.firstName} ${m.lastName}`;
        sel.appendChild(opt);
 main
      });
    });
  }

  bootstrapMembers();
  renderTable();
  updateSelects();

  if (toAddBtn) {
    toAddBtn.addEventListener('click', () => {
      document.getElementById('addMemberSection').scrollIntoView({ behavior: 'smooth' });
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

  // Add Member
 codex/editar-solo-datos-columna-derecha-x49oz3
  if (addForm) {
    addForm.addEventListener('submit', event => {
      event.preventDefault();
      const member = normalizeMember({
        firstName: addForm.firstName.value,
        lastName: addForm.lastName.value,
        dob: addForm.dob.value,
        relation: addForm.relation.value,
        idExpiration: addForm.expiration.value,
        status: 'Protected'
      });
      const members = loadMembers();
      members.push(member);
      saveMembers(members);
      addForm.reset();
      currentPage = 1;
      renderTable();
      updateSelects(members);
    });
  }

  addForm.addEventListener('submit', e => {
    e.preventDefault();
    const member = {
      firstName: addForm.firstName.value,
      lastName: addForm.lastName.value,
      dob: addForm.dob.value,
      relation: addForm.relation.value,
      idExpiration: addForm.expiration.value,
      address: '',
      city: '',
      state: '',
      zip: ''
    };
    const members = loadMembers();
    members.push(member);
    saveMembers(members);
    addForm.reset();
    renderTable();
  });
    main

  if (cancelAdd && addForm) {
    cancelAdd.addEventListener('click', () => {
      addForm.reset();
    });
  }

  // Edit Member
 codex/editar-solo-datos-columna-derecha-x49oz3
  if (editSelect && editForm) {
    editSelect.addEventListener('change', () => {
      const idx = editSelect.value;
      if (idx === '') {
        editForm.reset();
        return;
      }
      const members = loadMembers();
      const member = members[idx];
      if (!member) {
        editForm.reset();
        return;
      }
      editForm.firstName.value = member.firstName;
      editForm.lastName.value = member.lastName;
      editForm.dob.value = member.dob;
      editForm.relation.value = member.relation;
      editForm.address.value = member.address || '';
      editForm.city.value = member.city || '';
      editForm.state.value = member.state || '';
      editForm.zip.value = member.zip || '';
    });
  }

  if (editForm) {
    editForm.addEventListener('submit', event => {
      event.preventDefault();
      const idx = editSelect.value;
      if (idx === '') return;
      const members = loadMembers();
      members[idx] = {
        ...members[idx],
        address: editForm.address.value,
        city: editForm.city.value,
        state: editForm.state.value,
        zip: editForm.zip.value
      };
      saveMembers(members);
      renderTable();
      updateSelects(members);
      editForm.reset();
      editSelect.value = '';
    });
  }

  editSelect.addEventListener('change', () => {
    const idx = editSelect.value;
    if (idx === '') {
      editForm.reset();
      return;
    }
    const members = loadMembers();
    const member = members[idx];
    if (!member) {
      editForm.reset();
      return;
    }
    editForm.firstName.value = member.firstName;
    editForm.lastName.value = member.lastName;
    editForm.dob.value = member.dob;
    editForm.relation.value = member.relation;
    editForm.address.value = member.address || '';
    editForm.city.value = member.city || '';
    editForm.state.value = member.state || '';
    editForm.zip.value = member.zip || '';
  });

  editForm.addEventListener('submit', e => {
    e.preventDefault();
    const idx = editSelect.value;
    if (idx === '') return;
    const members = loadMembers();
    members[idx] = {
      ...members[idx],
      address: editForm.address.value,
      city: editForm.city.value,
      state: editForm.state.value,
      zip: editForm.zip.value
    };
    saveMembers(members);
    renderTable();
    editForm.reset();
    editSelect.value = '';
  });
    main

  if (cancelEdit && editForm) {
    cancelEdit.addEventListener('click', () => {
      editForm.reset();
      editSelect.value = '';
    });
  }

  // Remove Member
  if (removeForm) {
    removeForm.addEventListener('submit', event => {
      event.preventDefault();
      const idx = removeSelect.value;
      if (idx === '') return;
      const members = loadMembers();
      members.splice(Number(idx), 1);
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

  // Table action buttons
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
      document.getElementById('editMemberSection').scrollIntoView({ behavior: 'smooth' });
    }

    if (actionButton.classList.contains('action-delete')) {
      if (removeSelect) {
        removeSelect.value = idx;
      }
      document.getElementById('removeMemberSection').scrollIntoView({ behavior: 'smooth' });
    }
  });
});
