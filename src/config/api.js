// src/config/api.js

// Endereço base da API Laravel. Ajusta assim que tiveres o domínio definitivo
// (ex: "https://api.prohigienizar.ao"). Por agora aponta para o teu ambiente local.
export const API_BASE_URL = "http://localhost:8000";
export const API_URL = `${API_BASE_URL}/api`;

// O Sanctum (autenticação por sessão/cookie) exige ir buscar um cookie CSRF
// antes de qualquer login, registo ou pedido que altera dados.
export const CSRF_COOKIE_URL = `${API_BASE_URL}/sanctum/csrf-cookie`;

// Endereço base do MinIO (S3-compatible) onde os ficheiros ficam guardados.
// Composto por AWS_ENDPOINT + AWS_BUCKET do .env do backend, no formato
// "path-style" (AWS_USE_PATH_STYLE_ENDPOINT=true): {endpoint}/{bucket}/{key}
export const STORAGE_BASE_URL = "http://localhost:9000/works";

/**
 * Constrói o URL público de um ficheiro guardado no MinIO/S3.
 * O backend guarda apenas o "path" relativo dentro do bucket
 * (ex: "works/abc123.png" ou "settings/xyz456.png") — aqui juntamos
 * isso ao endereço do MinIO para formar o URL completo da imagem.
 *
 * Se um dia trocares para um bucket público real (AWS, DigitalOcean Spaces)
 * ou passares a usar URLs assinados (presigned), troca só esta função.
 */
export function assetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `${STORAGE_BASE_URL}/${path}`;
}
