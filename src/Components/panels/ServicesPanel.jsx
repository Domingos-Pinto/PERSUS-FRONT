import { useEffect, useRef, useState } from "react";
import {
  FaTv,
  FaCouch,
  FaLightbulb,
  FaFont,
  FaCube,
  FaTrash,
  FaPlus,
  FaImages,
  FaTimes,
} from "react-icons/fa";
import { listWorks, createWork, deleteWork } from "../../service/worksApi";
import { assetUrl } from "../../config/api";
import { toast } from "../ui/Toast";
import { confirmDialog } from "../ui/ConfirmDialog";

const CATEGORIES = [
  { value: "tv_panel", label: "Painéis de TV", icon: FaTv },
  { value: "custom_furniture", label: "Móveis Planejados", icon: FaCouch },
  { value: "false_ceiling", label: "Teto Falso", icon: FaLightbulb },
  { value: "letters_3d", label: "Letras 3D", icon: FaFont },
  { value: "signs_3d", label: "Placas 3D", icon: FaCube },
];

function NewWorkForm({ category, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (picked.length === 0) return;
    setFiles((prev) => [...prev, ...picked]);
    e.target.value = ""; // permite escolher o mesmo ficheiro outra vez depois de remover
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || files.length === 0) {
      toast.error("Indica um título e pelo menos uma imagem.");
      return;
    }
    setSubmitting(true);
    try {
      const work = await createWork({
        title,
        category,
        description,
        images: files,
      });
      onCreated(work);
      setTitle("");
      setDescription("");
      setFiles([]);
      toast.success("Trabalho publicado com sucesso.");
    } catch (err) {
      toast.error(err.message || "Não foi possível publicar o trabalho.");
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
          placeholder="Título do trabalho"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
        />

        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-700 hover:border-amber-400 hover:text-amber-600 transition"
          >
            <FaImages />
            {files.length > 0
              ? `${files.length} imagem(ns) selecionada(s)`
              : "Escolher imagens"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
          />
        </div>
      </div>

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            <div
              key={src}
              className="relative w-16 h-16 rounded-lg overflow-hidden border border-zinc-200 group"
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeFile(i)}
                aria-label="Remover imagem"
                className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              >
                <FaTimes size={9} />
              </button>
            </div>
          ))}
        </div>
      )}

      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
      />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 text-black transition hover:brightness-110 disabled:opacity-60"
        style={{ backgroundColor: "#D9A94E" }}
      >
        <FaPlus />
        {submitting ? "A publicar..." : "Publicar trabalho"}
      </button>
    </form>
  );
}

function ServicesPanel() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState(CATEGORIES[0].value);

  useEffect(() => {
    listWorks()
      .then(setWorks)
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (work) => setWorks((prev) => [work, ...prev]);

  const handleDelete = async (id) => {
    const ok = await confirmDialog({
      title: "Apagar trabalho",
      message:
        "O trabalho e todas as suas imagens serão removidos definitivamente. Esta ação não pode ser desfeita.",
      confirmText: "Apagar",
      danger: true,
    });
    if (!ok) return;

    try {
      await deleteWork(id);
      setWorks((prev) => prev.filter((w) => w.id !== id));
      toast.success("Trabalho apagado.");
    } catch (err) {
      toast.error(err.message || "Não foi possível apagar o trabalho.");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 max-w-xl mb-2">
        Cada trabalho publicado aqui aparece automaticamente na galeria do
        respetivo serviço, na secção "Serviços" do site.
      </p>

      {CATEGORIES.map(({ value, label, icon: Icon }) => {
        const categoryWorks = works.filter((w) => w.category === value);
        const isOpen = openCategory === value;

        return (
          <div
            key={value}
            className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setOpenCategory(isOpen ? null : value)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-zinc-50 transition"
            >
              <span className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <Icon />
                </span>
                <span className="font-medium text-zinc-900 text-sm">
                  {label}
                </span>
                <span className="text-xs text-zinc-400">
                  {categoryWorks.length} trabalho(s)
                </span>
              </span>
              <span className="text-zinc-400 text-xs">
                {isOpen ? "Fechar" : "Abrir"}
              </span>
            </button>

            {isOpen && (
              <div className="px-6 pb-6 space-y-4">
                <NewWorkForm category={value} onCreated={handleCreated} />

                {!loading && categoryWorks.length === 0 && (
                  <p className="text-sm text-zinc-400">
                    Ainda sem trabalhos publicados nesta categoria.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categoryWorks.map((work) => (
                    <div
                      key={work.id}
                      className="rounded-xl border border-zinc-100 overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-0.5 bg-zinc-100">
                        {(work.images || []).slice(0, 3).map((img) => (
                          <img
                            key={img.id}
                            src={assetUrl(img.path)}
                            alt=""
                            className="w-full aspect-square object-cover"
                          />
                        ))}
                      </div>
                      <div className="p-4 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">
                            {work.title}
                          </p>
                          {work.description && (
                            <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                              {work.description}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete(work.id)}
                          className="text-zinc-400 hover:text-red-600 transition p-1"
                          aria-label="Apagar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ServicesPanel;
