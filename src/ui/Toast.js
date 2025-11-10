export class Toast {
static #root() {
let root = document.getElementById('toast-root');
if (!root) {
root = document.createElement('div');
root.id = 'toast-root';
document.body.appendChild(root);
}
return root;
}


static #spawn(message, kind = 'info', timeout = 3000) {
const el = document.createElement('div');
el.className = `toast ${kind}`;
el.textContent = message;
this.#root().appendChild(el);
setTimeout(() => el.remove(), timeout);
}


static success(msg) { this.#spawn(msg, 'success'); }
static error(msg) { this.#spawn(msg, 'error'); }
static info(msg) { this.#spawn(msg, 'info'); }
}