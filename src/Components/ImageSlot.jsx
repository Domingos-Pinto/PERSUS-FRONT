import { useRef, useState } from "react";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";

function ImageSlot({ label, hint, currentUrl, onUpload, saving }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onUpload(file);
  };

  const displaySrc = preview || currentUrl;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center relative">
        {displaySrc ? (
          <img
            src={displaySrc}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-zinc-400 text-sm">Sem imagem</span>
        )}

        {saving && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs">
            A publicar...
          </div>
        )}
      </div>

      <div className="p-5">
        <p className="font-medium text-zinc-900 text-sm">{label}</p>
        {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-4 py-2 text-black transition hover:brightness-110"
            style={{ backgroundColor: "#D9A94E" }}
          >
            <FaCloudUploadAlt />
            {displaySrc ? "Substituir imagem" : "Publicar imagem"}
          </button>

          {preview && !saving && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
              <FaCheckCircle /> Publicado
            </span>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  );
}

export default ImageSlot;
