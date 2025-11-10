import { NetworkError } from '../utils/errors.js';


export const api = {
async get(url) {
try {
const response = await fetch(url);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
return await response.json();
} catch (err) {
throw new NetworkError('Failed to fetch data');
}
}
};