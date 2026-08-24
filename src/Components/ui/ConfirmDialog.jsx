import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

let resolver = null;
let openHandler = null;

export function confirmDialog(options) {
  return new Promise((resolve) => {
    resolver = resolve;
    if (openHandler) openHandler(options);
  });
}

export function ConfirmDialogHost() {
  const [state, setState] = useState(null);

  useEffect(() => {
    openHandler = (options) => setState(options);
    return () => {
      openHandler = null;
    };
  }, []);

  const close = (result) => {
    setState(null);
    if (resolver) {
      resolver(result);
      resolver = null;
    }
  };

  useEffect(() => {
    if (!state) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") close(false);
      if (e.key === "Enter") close(true);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [state]);

  if (!state) return null;

  const danger = state.danger !== false;

  return (
    <div
      className="fixed inset-0 z-[310] flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => close(false)}
      />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        style={{ animation: "confirm-in 200ms ease-out" }}
      >
        <style>{`
          @keyframes confirm-in {
            from { opacity: 0; transform: scale(0.96) translateY(4px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>

        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            danger ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-600"
          }`}
        >
          <FaExclamationTriangle />
        </div>

        <h3 className="mt-4 font-serif text-lg text-zinc-900">
          {state.title || "Confirmar ação"}
        </h3>
        {state.message && (
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            {state.message}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => close(false)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-800 transition px-4 py-2"
          >
            {state.cancelText || "Cancelar"}
          </button>
          <button
            type="button"
            onClick={() => close(true)}
            autoFocus
            className={`text-sm font-semibold rounded-full px-5 py-2.5 transition hover:brightness-110 ${
              danger ? "bg-red-600 text-white" : "text-black"
            }`}
            style={danger ? undefined : { backgroundColor: "#D9A94E" }}
          >
            {state.confirmText || "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
