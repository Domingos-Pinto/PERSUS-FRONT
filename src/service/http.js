import { API_URL, CSRF_COOKIE_URL } from "../config/api";

let csrfReady = false;

export function resetCsrfCookie() {
  csrfReady = false;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function ensureCsrfCookie() {
  if (csrfReady) return;
  await fetch(CSRF_COOKIE_URL, { credentials: "include" });
  csrfReady = true;
}

function notifySessionExpired() {
  window.dispatchEvent(new Event("auth:unauthenticated"));
}

async function request(
  path,
  { method = "GET", body, isMultipart = false } = {},
) {
  if (method !== "GET") await ensureCsrfCookie();

  const headers = { Accept: "application/json" };
  if (!isMultipart) headers["Content-Type"] = "application/json";

  const xsrfToken = getCookie("XSRF-TOKEN");
  if (xsrfToken) headers["X-XSRF-TOKEN"] = xsrfToken;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body: isMultipart ? body : body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null;

  let data = null;
  try {
    data = await response.json();
  } catch {
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 419) {
      resetCsrfCookie();
      notifySessionExpired();
    }

    const error = new Error(
      response.status === 401
        ? "A tua sessão expirou. Inicia sessão novamente."
        : data?.message || "Erro na comunicação com o servidor",
    );
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

export const http = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
  postForm: (path, formData) =>
    request(path, { method: "POST", body: formData, isMultipart: true }),
};
