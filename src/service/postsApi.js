import { http } from "./http";

export function listPosts() {
  return http.get("/posts");
}

export function listPostsAdmin() {
  return http.get("/posts/admin");
}

export function getPost(id) {
  return http.get(`/posts/${id}`);
}

export function getPostBySlug(slug) {
  return http.get(`/posts/slug/${slug}`);
}

export function createPost({
  title,
  excerpt,
  content,
  status,
  publishedAt,
  coverImage,
}) {
  const formData = new FormData();
  formData.append("title", title);
  if (excerpt) formData.append("excerpt", excerpt);
  formData.append("content", content);
  if (status) formData.append("status", status);
  if (publishedAt) formData.append("published_at", publishedAt);
  if (coverImage) formData.append("cover_image", coverImage);
  return http.postForm("/posts", formData);
}

export function updatePost(
  id,
  { title, excerpt, content, status, publishedAt, coverImage },
) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  if (title !== undefined) formData.append("title", title);
  if (excerpt !== undefined) formData.append("excerpt", excerpt ?? "");
  if (content !== undefined) formData.append("content", content);
  if (status !== undefined) formData.append("status", status);
  if (publishedAt !== undefined && publishedAt)
    formData.append("published_at", publishedAt);
  if (coverImage) formData.append("cover_image", coverImage);
  return http.postForm(`/posts/${id}`, formData);
}

export function deletePost(id) {
  return http.del(`/posts/${id}`);
}
