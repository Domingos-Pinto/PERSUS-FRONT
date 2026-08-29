import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import persusSymbol from "../../assets/persus-symbol.png";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "../../context/NavigationContext";

function Navbar() {
  const [progress, setProgress] = useState(0); // 0 = totalmente visível | 1 = totalmente escondido
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { goTo, view } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const panelLabel = user?.role === "admin" ? "Admin" : "Funcionário";

  useEffect(() => {
    function onScroll() {
      const fadeEnd = 300;
      const p =
        view === "site" && location.pathname === "/"
          ? Math.min(Math.max(window.scrollY / fadeEnd, 0), 1)
          : 0;
      setProgress(p);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [view, location.pathname]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMobileOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Leva de volta à página inicial (se necessário) e troca a "view" interna
  const goToView = (viewName) => {
    setMobileOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
    }
    goTo(viewName);
  };

  const goToSection = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    goTo("site");

    const scrollToTarget = () => {
      if (href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToTarget, 150);
    } else {
      setTimeout(scrollToTarget, 50);
    }
  };

  const links = [
    { label: "Início", href: "#" },
    { label: "Sobre", href: "#sobre" },
    { label: "Serviços", href: "#servicos" },
    { label: "Blog", href: "#blog" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <nav
      className="w-full fixed top-0 left-0 z-[100] bg-gradient-to-b from-black/60 via-black/20 to-transparent"
      style={{
        fontFamily: "'Garet', 'Poppins', sans-serif",
        opacity: 1 - progress,
        transform: `translateY(${-progress * 100}%)`,
        transition: "opacity 0.1s linear, transform 0.1s linear",
        pointerEvents: progress === 1 ? "none" : "auto",
      }}
    >
      <div className="w-full h-20 flex items-center justify-between px-6 md:px-8">
        {/* símbolo à esquerda */}
        <button
          type="button"
          onClick={() => goToView("site")}
          aria-label="Início"
          className="shrink-0"
        >
          <img src={persusSymbol} alt="Persus" className="h-12 w-auto" />
        </button>

        {/* menu centralizado — só em desktop */}
        <ul className="hidden md:flex gap-8 text-white">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => goToSection(e, link.href)}
                className="hover:text-amber-500 transition"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={() => goToView("admin")}
                className="text-white text-sm font-medium hover:text-amber-400 transition"
              >
                {panelLabel}
              </button>
              <button
                type="button"
                onClick={logout}
                className="text-black text-sm font-semibold rounded-full px-6 py-2.5 transition hover:brightness-110"
                style={{ backgroundColor: "#D9A94E" }}
              >
                Sair
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => goToView("login")}
              className="text-black text-sm font-semibold rounded-full px-10 py-2.5 transition hover:brightness-110"
              style={{ backgroundColor: "#D9A94E" }}
            >
              Entrar
            </button>
          )}
        </div>

        {}
        <button
          type="button"
          className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-full shrink-0 transition-colors"
          style={{
            backgroundColor: mobileOpen
              ? "rgba(255,255,255,0.12)"
              : "transparent",
          }}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
        >
          <span
            className="absolute w-6 h-0.5 rounded-full bg-white transition-all duration-300"
            style={{
              transform: mobileOpen ? "rotate(45deg)" : "translateY(-6px)",
            }}
          />
          <span
            className="absolute w-6 h-0.5 rounded-full bg-white transition-all duration-300"
            style={{ opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            className="absolute w-6 h-0.5 rounded-full bg-white transition-all duration-300"
            style={{
              transform: mobileOpen ? "rotate(-45deg)" : "translateY(6px)",
            }}
          />
        </button>
      </div>

      {}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40"
          style={{ top: "5rem" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {}
      <div
        className="md:hidden absolute top-20 left-0 w-full overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: mobileOpen ? "26rem" : "0px",
          opacity: mobileOpen ? 1 : 0,
        }}
      >
        <div
          className="mx-4 mt-2 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "rgba(15,15,15,0.92)",
            backdropFilter: "blur(16px)",
          }}
        >
          <ul className="flex flex-col py-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => goToSection(e, link.href)}
                  className="block px-6 py-3.5 text-white text-[15px] hover:bg-white/5 hover:text-amber-400 transition"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="px-6 py-4 border-t border-white/10 flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => goToView("admin")}
                  className="flex-1 text-white text-sm font-medium py-2.5 rounded-full border border-white/20 hover:bg-white/5 transition"
                >
                  {panelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="flex-1 text-black text-sm font-semibold rounded-full py-2.5 transition hover:brightness-110"
                  style={{ backgroundColor: "#D9A94E" }}
                >
                  Sair
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => goToView("login")}
                className="w-full text-black text-sm font-semibold rounded-full py-3 transition hover:brightness-110"
                style={{ backgroundColor: "#D9A94E" }}
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
