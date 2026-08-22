import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

// Sistema de notificações "toast" — substitui os avisos inline (aquelas
// caixas de texto dentro dos formulários) por notificações flutuantes,
// bonitas e consistentes em todo o site (admin + funcionário + público).
//
// Uso, em qualquer componente:
//   import { toast } from "../ui/Toast";
//   toast.success("Guardado com sucesso.");
//   toast.error("Não foi possível guardar.");
//   toast.info("A processar...");
//
// <Toaster /> só precisa de ser montado UMA VEZ, no topo da árvore
// (já está feito no AdminDashboard.jsx). Todas as chamadas a toast.*()
// em qualquer componente aparecem ali.

let listeners = [];
let idCounter = 0;

function emit(type, text, opts = {}) {
  const id = ++idCounter;
  const duration = opts.duration ?? 4000;
  listeners.forEach((fn) => fn({ id, type, text, duration }));
  return id;
}

export const toast = {
  success: (text, opts) => emit("success", text, opts),
  error: (text, opts) => emit("error", text, opts),
  info: (text, opts) => emit("info", text, opts),
};

const STYLES = {
  success: {
    icon: FaCheckCircle,
    iconColor: "text-emerald-500",
    border: "border-l-emerald-500",
  },
  error: {
    icon: FaExclamationCircle,
    iconColor: "text-red-500",
    border: "border-l-red-500",
  },
  info: {
    icon: FaInfoCircle,
    iconColor: "text-amber-500",
    border: "border-l-amber-500",
  },
};

function ToastItem({ item, onDismiss }) {
  const [leaving, setLeaving] = useState(false);
  const { icon: Icon, iconColor, border } = STYLES[item.type] || STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => setLeaving(true), item.duration);
    return () => clearTimeout(timer);
  }, [item.duration]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => onDismiss(item.id), 250);
    return () => clearTimeout(timer);
  }, [leaving, item.id, onDismiss]);

  return (
    <div
      className={`pointer-events-auto w-full max-w-sm bg-white rounded-xl shadow-lg border border-zinc-100 border-l-4 ${border} px-4 py-3.5 flex items-start gap-3 transition-all duration-250 ease-out ${
        leaving ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
      }`}
      style={{ animation: leaving ? undefined : "toast-in 300ms ease-out" }}
      role="status"
    >
      <Icon className={`mt-0.5 shrink-0 text-base ${iconColor}`} />
      <p className="flex-1 text-sm text-zinc-700 leading-snug">{item.text}</p>
      <button
        type="button"
        onClick={() => setLeaving(true)}
        aria-label="Fechar notificação"
        className="shrink-0 text-zinc-300 hover:text-zinc-500 transition mt-0.5"
      >
        <FaTimes size={12} />
      </button>
    </div>
  );
}

export function Toaster() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handler = (item) => setItems((prev) => [...prev, item]);
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((fn) => fn !== handler);
    };
  }, []);

  const dismiss = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div
      className="fixed top-5 right-5 z-[300] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
    >
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      {items.map((item) => (
        <ToastItem key={item.id} item={item} onDismiss={dismiss} />
      ))}
    </div>
  );
}
