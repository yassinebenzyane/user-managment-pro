import { ValidationError } from '../utils/errors.js';


export class User {
#id; #name; #email; #age;


constructor({ id, name, email, age }) {
this.#id = id;
this.#name = name;
this.#email = email;
this.#age = Number(age);
this.validate();
}


validate() {
if (!Number.isInteger(this.#id) || this.#id <= 0) {
throw new ValidationError('Invalid id: must be a positive integer');
}
if (typeof this.#name !== 'string' || this.#name.trim().length < 2) {
throw new ValidationError('Name must be at least 2 characters');
}
if (typeof this.#email !== 'string' || !this.#email.includes('@') || !this.#email.includes('.')) {
throw new ValidationError('Invalid email format');
}
if (!Number.isFinite(this.#age) || this.#age < 1 || this.#age > 120) {
throw new ValidationError('Age must be between 1 and 120');
}
}


update(data = {}) {
const next = {
id: this.#id,
name: data.name ?? this.#name,
email: data.email ?? this.#email,
age: data.age !== undefined ? Number(data.age) : this.#age,
};
const tmp = new User(next);
this.#name = tmp.#name;
this.#email = tmp.#email;
this.#age = tmp.#age;
}


toJSON() { return { id: this.#id, name: this.#name, email: this.#email, age: this.#age }; }


get id() { return this.#id; }
get name() { return this.#name; }
get email() { return this.#email; }
get age() { return this.#age; }
}