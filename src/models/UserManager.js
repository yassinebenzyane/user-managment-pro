import { User } from '../models/User.js';
import { NotFoundError } from '../utils/errors.js';
import { storage } from '../services/storage.js';

const STORAGE_KEY = 'users-v1';

export class UserManager {
  #users = [];
  #nextId = 1;

  constructor() {
    this.#loadFromStorage();
  }

  getAll() {
    return [...this.#users];
  }

  getUser(id) {
    const uid = Number(id);
    const found = this.#users.find(u => u.id === uid);
    if (!found) throw new NotFoundError(`User ${id} not found`);
    return found;
  }

  async addUser(data) {
    const user = new User({
      id: this.#nextId++,
      name: data.name,
      email: data.email,
      age: Number(data.age)
    });

    this.#users.push(user);
    await this.#save();
    return user;
  }

  async updateUser(id, data) {
    const user = this.getUser(id);
    user.update(data);
    await this.#save();
    return user;
  }

  async deleteUser(id) {
    const uid = Number(id);
    const idx = this.#users.findIndex(u => u.id === uid);
    if (idx === -1) throw new NotFoundError(`User ${id} not found`);
    this.#users.splice(idx, 1);
    await this.#save();
  }

  async seedIfEmpty(seedUsers = []) {
    if (this.#users.length === 0 && Array.isArray(seedUsers) && seedUsers.length) {
      this.#users = seedUsers.map(u => new User(u));
      // compute nextId
      this.#nextId = Math.max(0, ...this.#users.map(u => u.id)) + 1;
      await this.#save();
    }
  }

  async #save() {
    const plain = this.#users.map(u => u.toJSON());
    await storage.set(STORAGE_KEY, { users: plain, nextId: this.#nextId });
  }

  #loadFromStorage() {
    const data = storage.get(STORAGE_KEY);
    if (data && Array.isArray(data.users)) {
      this.#users = data.users.map(u => new User(u));
      this.#nextId = Number.isInteger(data.nextId)
        ? data.nextId
        : Math.max(0, ...this.#users.map(u => u.id)) + 1;
    }
  }
}
