import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaHome,
  FaUserFriends,
  FaTools,
  FaNewspaper,
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
import BlogPanel from "../../../Components/panels/BlogPanel";
import ContactPanel from "../../../Components/panels/ContactPanel";
import ProfilePanel from "../../../Components/panels/ProfilePanel";
import EmployeesPanel from "../../../Components/panels/EmployeesPanel";
import { Toaster } from "../../../Components/ui/Toast";
import {
  ConfirmDialogHost,
  confirmDialog,
} from "../../../Components/ui/ConfirmDialog";

const LOGO_BG_SIZE = "auto 200%";
const LOGO_BG_POSITION = "left center";

const BASE_TABS = [
  { id: "welcome", label: "Bem-vindo", icon: FaHome, Component: WelcomePanel },
  { id: "about", label: "Sobre", icon: FaUserFriends, Component: AboutPanel },
  {
    id: "services",
    label: "Serviços",
    icon: FaTools,
    Component: ServicesPanel,
  },
  {
    id: "blog",
    label: "Blog",
    icon: FaNewspaper,
    Component: BlogPanel,
  },
];

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

  const asideRef = useRef(null);
  const [asideHeight, setAsideHeight] = useState(0);

  useEffect(() => {
    const el = asideRef.current;
    if (!el) return;

    const update = () => setAsideHeight(el.offsetHeight);
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [tabs.length]);

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

      <div
        ref={asideRef}
        className="fixed z-30 top-3 left-3 right-3 lg:top-1/2 lg:-translate-y-1/2 lg:left-auto lg:right-auto lg:w-[240px]"
        style={{
          left:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? "max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))"
              : undefined,
        }}
      >
        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 p-3 lg:p-5">
      
          <div className="flex items-center justify-between lg:block">
            <button
              type="button"
              onClick={() => goTo("site")}
              className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-xs font-medium text-zinc-400 hover:text-amber-400 transition lg:mb-5"
            >
              <FaArrowLeft size={10} />
              Voltar ao site
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Terminar sessão"
              className="lg:hidden flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-red-400 transition"
            >
              <FaSignOutAlt size={12} />
              Sair
            </button>
          </div>

          <div className="mt-2 lg:mt-0 flex items-center justify-between lg:block">
            <div className="flex items-baseline gap-1.5 lg:block">
              <p className="text-[10px] lg:text-xs uppercase tracking-[0.15em] text-amber-500 font-medium">
                Painel
              </p>
              <p className="lg:hidden text-[11px] text-zinc-500 truncate">
                {user?.name}
              </p>
            </div>
            <p className="hidden lg:block mt-1 text-sm text-zinc-400 truncate">
              {user?.name}
            </p>
            <p className="hidden lg:block mt-0.5 text-xs text-zinc-500">
              {isAdmin ? "Administrador" : "Funcionário"}
            </p>
          </div>

          <nav className="mt-2 lg:mt-6 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 lg:gap-3 whitespace-nowrap rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-xs lg:text-sm font-medium transition shrink-0 ${
                  activeTab === id
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                <Icon className="text-sm lg:text-base" />
                {label}
              </button>
            ))}
          </nav>

        
          <button
            type="button"
            onClick={handleLogout}
            className="hidden lg:flex mt-6 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-400 hover:bg-red-950/50 hover:text-red-400 transition w-full"
          >
            <FaSignOutAlt />
            Terminar sessão
          </button>
        </div>
      </div>

      <main
        className="relative z-10 max-w-7xl mx-auto px-6 pb-20 lg:pl-[320px]"
        style={{
          paddingTop:
            typeof window !== "undefined" && window.innerWidth >= 1024
              ? "7rem"
              : asideHeight
                ? asideHeight + 20
                : 140,
        }}
      >
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
    </section>
  );
}

export default AdminDashboard;