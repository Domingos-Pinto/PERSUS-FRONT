
export const API_BASE_URL = "http://localhost:8000";
export const API_URL = `${API_BASE_URL}/api`;

export const CSRF_COOKIE_URL = `${API_BASE_URL}/sanctum/csrf-cookie`;
export const STORAGE_BASE_URL = "http://localhost:9000/works";

export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${STORAGE_BASE_URL}/${path}`;
}
