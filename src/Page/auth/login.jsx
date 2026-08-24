import { useState } from "react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "../../context/NavigationContext";

const LOGO_BG_SIZE = "auto 150%";
const LOGO_BG_POSITION = "left center";

function Login() {
  const { login, error } = useAuth();
  const { goTo } = useNavigation();
  const [form, setForm] = useState({ login: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(form.login, form.password);
    setSubmitting(false);
    if (ok) goTo("admin");
  };

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center bg-black px-6 overflow-hidden"
      style={{ fontFamily: "'Garet', 'Poppins', sans-serif" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-90 pointer-events-none select-none"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: LOGO_BG_SIZE,
          backgroundPosition: LOGO_BG_POSITION,
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <h1
            className="mt-4 font-serif uppercase tracking-tight text-3xl md:text-4xl text-white"
            style={{ fontWeight: 500 }}
          >
            Entrar
          </h1>
          <p className="mt-3 text-sm text-zinc-400">
            Acede ao painel para gerir o conteúdo do site.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-8 space-y-5"
        >
          <div>
            <label
              className="block text-xs font-medium text-zinc-400 mb-2"
              htmlFor="login"
            >
              Email ou telefone
            </label>
            <input
              id="login"
              type="text"
              required
              autoComplete="username"
              value={form.login}
              onChange={handleChange("login")}
              placeholder="teste@teste.com ou 959697512"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>

          <div>
            <label
              className="block text-xs font-medium text-zinc-400 mb-2"
              htmlFor="password"
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
            <button
              type="button"
              onClick={() => goTo("forgot-password")}
              className="mt-2 text-xs text-zinc-500 hover:text-amber-500 transition"
            ></button>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full text-black text-sm font-semibold rounded-full px-6 py-3 transition hover:brightness-110 disabled:opacity-60"
            style={{ backgroundColor: "#D9A94E" }}
          >
            {submitting ? "A entrar..." : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => goTo("site")}
          className="mt-6 w-full text-center text-sm text-zinc-400 hover:text-amber-500 transition"
        >
          ← Voltar ao site
        </button>
      </div>
    </section>
  );
}

export default Login;
