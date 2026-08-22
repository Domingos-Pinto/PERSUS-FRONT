import { useState } from "react";
import { forgotPasswordRequest } from "../../service/authApi";
import { useNavigation } from "../../context/NavigationContext";

function ForgotPassword() {
  const { goTo } = useNavigation();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setNotice(null);
    try {
      await forgotPasswordRequest(email);
      setNotice({
        type: "ok",
        text: "Se o email existir, enviámos um link de recuperação.",
      });
    } catch (err) {
      setNotice({
        type: "error",
        text: err.message || "Não foi possível enviar o email.",
      });
    } finally {
      setSending(false);
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
            Recuperar senha
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Indica o teu email e enviamos um link para redefinires a senha.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teu@email.com"
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
          disabled={sending}
          className="w-full inline-flex justify-center items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          {sending ? "A enviar..." : "Enviar link"}
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

export default ForgotPassword;
