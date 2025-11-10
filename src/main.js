import { api } from './services/api.js';
import { UserManager } from './models/UserManager.js';
import { UIManager } from './ui/UIManager.js';
import { Toast } from './ui/Toast.js';


(async function bootstrap() {
const manager = new UserManager();


try {
if (manager.getAll().length === 0) {
const data = await api.get('../data.json').catch(() => null);
await manager.seedIfEmpty(data?.users ?? []);
}
} catch (err) {
Toast.error(err?.message ?? 'Startup error');
}


new UIManager(manager);
})();