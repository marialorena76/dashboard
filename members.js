document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#membersTable tbody');
  const toAddBtn = document.getElementById('toAdd');

  const addForm = document.getElementById('addMemberForm');
  const editForm = document.getElementById('editMemberForm');
  const removeForm = document.getElementById('removeMemberForm');

  const editSelect = document.getElementById('editSelect');
  const removeSelect = document.getElementById('removeSelect');

  const cancelAdd = document.getElementById('cancelAdd');
  const cancelEdit = document.getElementById('cancelEdit');
  const cancelRemove = document.getElementById('cancelRemove');

  toAddBtn.addEventListener('click', () => {
    document.getElementById('addMemberSection').scrollIntoView({ behavior: 'smooth' });
  });

  function loadMembers() {
    return JSON.parse(localStorage.getItem('members') || '[]');
  }

  function saveMembers(members) {
    localStorage.setItem('members', JSON.stringify(members));
  }

  function renderTable() {
    const members = loadMembers();
    tableBody.innerHTML = '';
    members.forEach((m, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${m.firstName} ${m.lastName}</td>
        <td>${m.dob}</td>
        <td>${m.relation}</td>
        <td>${m.idExpiration || ''}</td>
        <td>
          <button class="edit-btn" data-index="${idx}">Edit</button>
          <button class="delete-btn" data-index="${idx}">Delete</button>
        </td>`;
      tableBody.appendChild(tr);
    });
    updateSelects();
  }

  function updateSelects() {
    const members = loadMembers();
    [editSelect, removeSelect].forEach(sel => {
      sel.innerHTML = '<option value="">Select Member</option>';
      members.forEach((m, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = `${m.firstName} ${m.lastName}`;
        sel.appendChild(opt);
      });
    });
  }

  renderTable();

  // Add Member
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

  cancelAdd.addEventListener('click', () => {
    addForm.reset();
  });

  // Edit Member
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

  cancelEdit.addEventListener('click', () => {
    editForm.reset();
    editSelect.value = '';
  });

  // Remove Member
  removeForm.addEventListener('submit', e => {
    e.preventDefault();
    const idx = removeSelect.value;
    if (idx === '') return;
    const members = loadMembers();
    members.splice(idx, 1);
    saveMembers(members);
    renderTable();
    removeForm.reset();
    removeSelect.value = '';
  });

  cancelRemove.addEventListener('click', () => {
    removeForm.reset();
    removeSelect.value = '';
  });

  // Table action buttons
  tableBody.addEventListener('click', e => {
    if (e.target.classList.contains('edit-btn')) {
      const idx = e.target.dataset.index;
      editSelect.value = idx;
      editSelect.dispatchEvent(new Event('change'));
      document.getElementById('editMemberSection').scrollIntoView({ behavior: 'smooth' });
    }
    if (e.target.classList.contains('delete-btn')) {
      const idx = e.target.dataset.index;
      removeSelect.value = idx;
      document.getElementById('removeMemberSection').scrollIntoView({ behavior: 'smooth' });
    }
  });
});
