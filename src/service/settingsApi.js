// src/services/settingsApi.js
import { http } from "./http";

export function getSettings() {
  return http.get("/settings");
}

// Contactos (telefone, email, morada, redes sociais, modo de manutenção).
// Já funciona com o backend tal como está.
export function updateSettings(data) {
  return http.put("/settings", data);
}

// Imagens das secções Bem-vindo / Sobre.
// IMPORTANTE: isto assume que o endpoint PUT /api/settings foi estendido no
// backend para aceitar os campos "welcome_hero_image", "welcome_secondary_image"
// e "about_image" como ficheiros — ver BACKEND-NOTES.md para o que falta
// acrescentar (migration + fillable + validação no SettingController).
export function updateSettingsImages(files) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  Object.entries(files).forEach(([key, file]) => {
    if (file) formData.append(key, file);
  });
  return http.postForm("/settings", formData);
}
