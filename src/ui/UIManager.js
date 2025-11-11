import { Toast } from '../ui/Toast.js';

export class UIManager {
  #manager;
  #els;

  constructor(userManager) {
    this.#manager = userManager;
    this.#els = {
      form: document.getElementById('user-form'),
      id: document.getElementById('user-id'),
      name: document.getElementById('name'),
      email: document.getElementById('email'),
      age: document.getElementById('age'),
      submit: document.getElementById('submit-btn'),
      tableBody: document.querySelector('#users-table tbody')
    };

    this.#bindEvents();
    this.render();
  }

  #bindEvents() {
    this.#els.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const payload = {
          name: this.#els.name.value.trim(),
          email: this.#els.email.value.trim(),
          age: Number(this.#els.age.value)
        };
        const editingId = this.#els.id.value;

        if (editingId) {
          await this.#manager.updateUser(Number(editingId), payload);
          Toast.success('User updated');
        } else {
          await this.#manager.addUser(payload);
          Toast.success('User added');
        }

        this.clearForm();
        this.render();
      } catch (err) {
        Toast.error(err?.message ?? 'Operation failed');
      }
    });

    this.#els.tableBody.addEventListener('click', async (e) => {
      const btn = e.target.closest('button[data-action]');
      if (!btn) return;
      const id = btn.dataset.id;
      const action = btn.dataset.action;

      if (action === 'edit') {
        this.editUser(id);
      } else if (action === 'delete') {
        this.confirmDelete(id);
      }
    }); 
  }

  render() {
    const users = this.#manager.getAll();
    this.#els.tableBody.innerHTML = users.map(u => `
      <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.age}</td>
        <td>
          <button data-action="edit" data-id="${u.id}">Edit</button>
          <button data-action="delete" data-id="${u.id}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  editUser(id) {
    try {
      const u = this.#manager.getUser(id);
      this.#els.id.value = u.id;
      this.#els.name.value = u.name;
      this.#els.email.value = u.email;
      this.#els.age.value = u.age;
      this.#els.submit.textContent = 'Update User';
      Toast.info(`Editing user #${u.id}`);
    } catch (err) {
      Toast.error(err?.message ?? 'Could not load user');
    }
  }

  async confirmDelete(id) {
    try {
      const u = this.#manager.getUser(id);
      const ok = confirm(`Delete user #${u.id} (${u.name})?`);
      if (!ok) return;
      await this.#manager.deleteUser(id);
      Toast.success('User deleted');
      this.render();
      if (this.#els.id.value === String(id)) this.clearForm();
    } catch (err) {
      Toast.error(err?.message ?? 'Delete failed');
    }
  }

  clearForm() {
    this.#els.id.value = '';
    this.#els.name.value = '';
    this.#els.email.value = '';
    this.#els.age.value = '';
    this.#els.submit.textContent = 'Add User';
  }
}
