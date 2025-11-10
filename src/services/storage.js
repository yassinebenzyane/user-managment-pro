const DELAY_MS = 100;


export const storage = {
get(key) {
try {
const raw = localStorage.getItem(key);
return raw ? JSON.parse(raw) : null;
} catch {
return null; // corrupted or unavailable
}
},
set(key, value) {
return new Promise((resolve) => {
setTimeout(() => {
localStorage.setItem(key, JSON.stringify(value));
resolve();
}, DELAY_MS);
});
}
};