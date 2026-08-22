import { useMemo, useState } from "react";
import {
  FaHome,
  FaUserFriends,
  FaTools,
  FaPhoneAlt,
  FaSignOutAlt,
  FaUserCog,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";
import logo from "../../../assets/logo.png";
import { useAuth } from "../../../context/AuthContext";
import { useNavigation } from "../../../context/NavigationContext";
import WelcomePanel from "../../../Components/panels/WelcomePanel";
import AboutPanel from "../../../Components/panels/AboutPanel";
import ServicesPanel from "../../../Components/panels/ServicesPanel";
import ContactPanel from "../../../Components/panels/ContactPanel";
import ProfilePanel from "../../../Components/panels/ProfilePanel";
import EmployeesPanel from "../../../Components/panels/EmployeesPanel";
import { Toaster } from "../../../Components/ui/Toast";
import {
  ConfirmDialogHost,
  confirmDialog,
} from "../../../Components/ui/ConfirmDialog";

// Zoom/posição do logo de fundo — ajusta estes 2 valores até ficar bem:
const LOGO_BG_SIZE = "auto 200%";
const LOGO_BG_POSITION = "left center";

// Tabs que tanto o admin como o editor veem.
const BASE_TABS = [
  { id: "welcome", label: "Bem-vindo", icon: FaHome, Component: WelcomePanel },
  { id: "about", label: "Sobre", icon: FaUserFriends, Component: AboutPanel },
  {
    id: "services",
    label: "Serviços",
    icon: FaTools,
    Component: ServicesPanel,
  },
];

// Tabs só para admin: contactos/redes sociais/manutenção do site, e gestão de funcionários.
const ADMIN_TABS = [
  {
    id: "contact",
    label: "Contacto",
    icon: FaPhoneAlt,
    Component: ContactPanel,
  },
  {
    id: "employees",
    label: "Funcionários",
    icon: FaUsers,
    Component: EmployeesPanel,
  },
];

// "Meu Perfil" fica sempre por último, para admin e editor.
const PROFILE_TAB = {
  id: "profile",
  label: "Meu Perfil",
  icon: FaUserCog,
  Component: ProfilePanel,
};

function AdminDashboard() {
  const { user, logout } = useAuth();
  const { goTo } = useNavigation();
  const isAdmin = user?.role === "admin";

  const tabs = useMemo(
    () =>
      isAdmin
        ? [...BASE_TABS, ...ADMIN_TABS, PROFILE_TAB]
        : [...BASE_TABS, PROFILE_TAB],
    [isAdmin],
  );

  const [activeTab, setActiveTab] = useState("welcome");
  const active = tabs.find((t) => t.id === activeTab) || tabs[0];
  const ActivePanel = active.Component;

  const handleLogout = async () => {
    const ok = await confirmDialog({
      title: "Terminar sessão",
      message: "Tens a certeza que queres terminar a sessão?",
      confirmText: "Terminar sessão",
      cancelText: "Cancelar",
      danger: false,
    });
    if (!ok) return;

    await logout();
    goTo("site");
  };

  return (
    <section
      className="relative min-h-screen w-full bg-black"
      style={{ fontFamily: "'Garet', 'Poppins', sans-serif" }}
    >
      <Toaster />
      <ConfirmDialogHost />

      <div
        aria-hidden="true"
        className="fixed inset-0 opacity-20 pointer-events-none select-none"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: LOGO_BG_SIZE,
          backgroundPosition: LOGO_BG_POSITION,
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-5">
            {/* voltar à página inicial do site */}
            <button
              type="button"
              onClick={() => goTo("site")}
              className="mb-5 flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-amber-400 transition"
            >
              <FaArrowLeft size={11} />
              Voltar ao site
            </button>

            <p className="text-xs uppercase tracking-[0.15em] text-amber-500 font-medium">
              Painel
            </p>
            <p className="mt-1 text-sm text-zinc-400 truncate">{user?.name}</p>
            <p className="mt-0.5 text-xs text-zinc-500">
              {isAdmin ? "Administrador" : "Funcionário"}
            </p>

            <nav className="mt-6 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition ${
                    activeTab === id
                      ? "bg-amber-500/10 text-amber-400"
                      : "text-zinc-400 hover:bg-zinc-800"
                  }`}
                >
                  <Icon className="text-base" />
                  {label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-950/50 hover:text-red-400 transition w-full"
            >
              <FaSignOutAlt />
              Terminar sessão
            </button>
          </div>
        </aside>

        <main>
          <div className="mb-8">
            <span className="inline-block text-xs tracking-[0.2em] uppercase text-amber-500 font-medium">
              [ {active.label} ]
            </span>
            <h1
              className="mt-3 font-serif uppercase tracking-tight text-3xl md:text-4xl text-white"
              style={{ fontWeight: 500 }}
            >
              Gerir {active.label}
            </h1>
          </div>

          <ActivePanel />
        </main>
      </div>
    </section>
  );
}

export default AdminDashboard;
