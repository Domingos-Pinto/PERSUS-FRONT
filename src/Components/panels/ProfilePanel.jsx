import { useState } from "react";
import { updateProfileRequest } from "../../service/authApi";
import { useAuth } from "../../context/AuthContext";
import { toast } from "../ui/Toast";

function ProfilePanel() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));
  const handlePasswordChange = (key) => (e) =>
    setPasswordForm((f) => ({ ...f, [key]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfileRequest(form);
      await refresh();
      toast.success("Dados atualizados.");
    } catch (err) {
      toast.error(err.message || "Não foi possível guardar.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await updateProfileRequest(passwordForm);
      setPasswordForm({
        current_password: "",
        password: "",
        password_confirmation: "",
      });
      toast.success("Senha alterada com sucesso.");
    } catch (err) {
      toast.error(err.message || "Não foi possível alterar a senha.");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <form
        onSubmit={handleProfileSubmit}
        className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold text-zinc-800">Dados da conta</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Nome
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleProfileChange("name")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleProfileChange("email")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Telefone
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={handleProfileChange("phone")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingProfile}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          {savingProfile ? "A guardar..." : "Guardar dados"}
        </button>
      </form>

      <form
        onSubmit={handlePasswordSubmit}
        className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-5"
      >
        <h2 className="text-sm font-semibold text-zinc-800">Alterar senha</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Senha atual
            </label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange("current_password")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div />
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Nova senha
            </label>
            <input
              type="password"
              minLength={6}
              value={passwordForm.password}
              onChange={handlePasswordChange("password")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
              Confirmar nova senha
            </label>
            <input
              type="password"
              minLength={6}
              value={passwordForm.password_confirmation}
              onChange={handlePasswordChange("password_confirmation")}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={savingPassword}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          {savingPassword ? "A alterar..." : "Alterar senha"}
        </button>
      </form>
    </div>
  );
}

export default ProfilePanel;
