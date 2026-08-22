import { useState } from "react";
import { resetPasswordRequest } from "../../service/authApi";
import { useNavigation } from "../../context/NavigationContext";

function ResetPassword() {
  const { goTo } = useNavigation();
  const params = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({
    token: params.get("token") || "",
    email: params.get("email") || "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      await resetPasswordRequest(form);
      setNotice({
        type: "ok",
        text: "Senha redefinida com sucesso. Já podes entrar.",
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Token inválido ou expirado.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 w-full max-w-sm space-y-5"
      >
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">
            Redefinir senha
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Define a tua nova senha de acesso.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={handleChange("email")}
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">
            Nova senha
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange("password")}
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">
            Confirmar nova senha
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password_confirmation}
            onChange={handleChange("password_confirmation")}
            className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
          />
        </div>

        {notice && (
          <p
            className={`text-sm rounded-lg px-4 py-2.5 border ${
              notice.type === "ok"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {notice.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full inline-flex justify-center items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          {saving ? "A guardar..." : "Redefinir senha"}
        </button>

        <button
          type="button"
          onClick={() => goTo("login")}
          className="w-full text-sm text-zinc-500 hover:text-zinc-800 transition"
        >
          Voltar ao login
        </button>
      </form>
    </section>
  );
}

export default ResetPassword;
