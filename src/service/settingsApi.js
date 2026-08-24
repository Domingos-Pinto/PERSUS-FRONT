import { http } from "./http";

export function getSettings() {
  return http.get("/settings");
}

export function updateSettings(data) {
  return http.put("/settings", data);
}

export function updateSettingsImages(files) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });
  return http.postForm("/settings", formData);
}
