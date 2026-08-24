import { http, ensureCsrfCookie } from "./http";

export async function loginRequest({ login, password }) {
  await ensureCsrfCookie();
  return http.post("/login", { login, password });
}

export async function logoutRequest() {
  return http.post("/logout");
}

export async function meRequest() {
  return http.get("/me");
}

export async function registerRequest(data) {
  await ensureCsrfCookie();
  return http.post("/register", data);
}

export async function updateProfileRequest(data) {
  return http.put("/me", data);
}

export async function forgotPasswordRequest(email) {
  await ensureCsrfCookie();
  return http.post("/forgot-password", { email });
}

export async function resetPasswordRequest(data) {
  await ensureCsrfCookie();
  return http.post("/reset-password", data);
}

export function listEmployeesRequest() {
  return http.get("/employees");
}

export function createEmployeeRequest(data) {
  return http.post("/employees", data);
}

export function blockUserRequest(id) {
  return http.post(`/users/${id}/block`);
}

export function unblockUserRequest(id) {
  return http.post(`/users/${id}/unblock`);
}
