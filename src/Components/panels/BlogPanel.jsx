import { useEffect, useRef, useState } from "react";
import {
  FaTrash,
  FaPlus,
  FaImage,
  FaTimes,
  FaPen,
  FaEye,
  FaEyeSlash,
  FaNewspaper,
} from "react-icons/fa";
import {
  listPostsAdmin,
  createPost,
  updatePost,
  deletePost,
} from "../../service/postsApi";
import { assetUrl } from "../../config/api";
import { toast } from "../ui/Toast";
import { confirmDialog } from "../ui/ConfirmDialog";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  status: "draft",
};

function PostForm({ initial, onSaved, onCancelEdit }) {
  const isEditing = Boolean(initial);
  const [form, setForm] = useState(() => ({
    title: initial?.title || "",
    excerpt: initial?.excerpt || "",
    content: initial?.content || "",
    status: initial?.status || "draft",
  }));
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!coverFile) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error("Indica pelo menos o título e o conteúdo.");
      return;
    }
    setSubmitting(true);
    try {
      if (isEditing) {
        const updated = await updatePost(initial.id, {
          ...form,
          coverImage: coverFile,
        });
        onSaved(updated, true);
        toast.success("Artigo atualizado.");
      } else {
        const created = await createPost({ ...form, coverImage: coverFile });
        onSaved(created, false);
        setForm(EMPTY_FORM);
        setCoverFile(null);
        toast.success("Artigo publicado com sucesso.");
      }
    } catch (err) {
      toast.error(err.message || "Não foi possível guardar o artigo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-50 rounded-xl border border-dashed border-zinc-300 p-5 space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Título do artigo"
          value={form.title}
          onChange={set("title")}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
        />

        <select
          value={form.status}
          onChange={set("status")}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition bg-white"
        >
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
        </select>
      </div>

      <textarea
        placeholder="Resumo curto (aparece nos cartões do blog)"
        value={form.excerpt}
        onChange={set("excerpt")}
        rows={2}
        maxLength={500}
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
      />

      <textarea
        placeholder="Conteúdo completo do artigo"
        value={form.content}
        onChange={set("content")}
        rows={6}
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 text-sm font-medium rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-700 hover:border-amber-400 hover:text-amber-600 transition"
        >
          <FaImage />
          {coverFile ? "Trocar imagem de capa" : "Escolher imagem de capa"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        {(preview || initial?.cover_image) && (
          <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
            <img
              src={preview || assetUrl(initial.cover_image)}
              alt=""
              className="w-full h-full object-cover"
            />
            {coverFile && (
              <button
                type="button"
                onClick={() => setCoverFile(null)}
                aria-label="Remover imagem"
                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <FaTimes size={8} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          <FaPlus />
          {submitting
            ? "A guardar..."
            : isEditing
              ? "Guardar alterações"
              : "Publicar artigo"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-medium text-zinc-500 hover:text-zinc-800 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}

function BlogPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    listPostsAdmin()
      .then(setPosts)
      .catch(() => toast.error("Não foi possível carregar os artigos."))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (post) => {
    setPosts((prev) => [post, ...prev]);
    setShowNewForm(false);
  };

  const handleUpdated = (post) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)));
    setEditingId(null);
  };

  const handleDelete = async (post) => {
    const ok = await confirmDialog({
      title: "Apagar artigo",
      message: `"${post.title}" será removido definitivamente. Esta ação não pode ser desfeita.`,
      confirmText: "Apagar",
      danger: true,
    });
    if (!ok) return;

    try {
      await deletePost(post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Artigo apagado.");
    } catch (err) {
      toast.error(err.message || "Não foi possível apagar o artigo.");
    }
  };

  const toggleStatus = async (post) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    try {
      const updated = await updatePost(post.id, { status: nextStatus });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? updated : p)));
      toast.success(
        nextStatus === "published"
          ? "Artigo publicado."
          : "Artigo despublicado.",
      );
    } catch (err) {
      toast.error(err.message || "Não foi possível atualizar o estado.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-sm text-zinc-600 max-w-xl">
          Os artigos publicados aqui aparecem automaticamente na secção "Blog"
          do site. Rascunhos ficam guardados mas invisíveis para os visitantes.
        </p>

        {!showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2.5 text-black transition hover:brightness-110 shrink-0"
            style={{ backgroundColor: "#D9A94E" }}
          >
            <FaPlus />
            Novo artigo
          </button>
        )}
      </div>

      {showNewForm && (
        <PostForm
          onSaved={handleCreated}
          onCancelEdit={() => setShowNewForm(false)}
        />
      )}

      {loading && (
        <p className="text-sm text-zinc-400">A carregar artigos...</p>
      )}

      {!loading && posts.length === 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-10 text-center">
          <FaNewspaper className="mx-auto text-2xl text-zinc-300" />
          <p className="mt-3 text-sm text-zinc-400">
            Ainda não publicaste nenhum artigo.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) =>
          editingId === post.id ? (
            <PostForm
              key={post.id}
              initial={post}
              onSaved={handleUpdated}
              onCancelEdit={() => setEditingId(null)}
            />
          ) : (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col sm:flex-row"
            >
              <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-zinc-100">
                {post.cover_image ? (
                  <img
                    src={assetUrl(post.cover_image)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <FaNewspaper size={22} />
                  </div>
                )}
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide rounded-full px-2.5 py-1 ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {post.status === "published" ? "Publicado" : "Rascunho"}
                    </span>
                    {post.author?.name && (
                      <span className="text-[11px] text-zinc-400">
                        por {post.author.name}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-medium text-zinc-900">{post.title}</p>
                  {post.excerpt && (
                    <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleStatus(post)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-amber-600 transition"
                  >
                    {post.status === "published" ? <FaEyeSlash /> : <FaEye />}
                    {post.status === "published" ? "Despublicar" : "Publicar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(post.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-amber-600 transition"
                  >
                    <FaPen />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-red-600 transition"
                  >
                    <FaTrash />
                    Apagar
                  </button>
                </div>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export default BlogPanel;
