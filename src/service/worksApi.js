// src/services/worksApi.js
import { http } from "./http";

export function listWorks() {
  return http.get("/works");
}

export function createWork({ title, category, description, images }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  if (description) formData.append("description", description);
  images.forEach((file) => formData.append("images[]", file));
  return http.postForm("/works", formData);
}

export function updateWork(id, { title, category, description, images }) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  if (title !== undefined) formData.append("title", title);
  if (category !== undefined) formData.append("category", category);
  if (description !== undefined) formData.append("description", description);
  (images || []).forEach((file) => formData.append("images[]", file));
  return http.postForm(`/works/${id}`, formData);
}

export function deleteWork(id) {
  return http.del(`/works/${id}`);
}
