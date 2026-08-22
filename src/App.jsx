import { useEffect } from "react";
import HeroCanvas from "./Components/hero/HeroCanvas";
import Navbar from "./Components/layout/Navbar";
import Home from "./Page/home/Home";
import Login from "./Page/auth/login";
import ForgotPassword from "./Page/auth/ForgotPassword";
import ResetPassword from "./Page/auth/ResetPassword";
import AdminDashboard from "./Page/auth/addmin/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { AdminProvider } from "./context/AdminContext";

function AppContent() {
  const { view, goTo } = useNavigation();
  const { isAuthenticated } = useAuth();

  // Se o utilizador abrir o link do email de recuperação (?token=...&email=...),
  // manda logo para o ecrã de redefinição, seja qual for o estado atual.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (
      window.location.pathname === "/redefinir-senha" ||
      params.get("token")
    ) {
      goTo("reset-password");
    }
  }, [goTo]);

  if (view === "forgot-password") {
    return <ForgotPassword />;
  }

  if (view === "reset-password") {
    return <ResetPassword />;
  }

  if (view === "login") {
    // se já estiver autenticado, não faz sentido mostrar o login de novo
    return isAuthenticated ? <AdminDashboard /> : <Login />;
  }

  if (view === "admin") {
    // protege a rota: sem sessão, manda para o login em vez de mostrar o painel
    return isAuthenticated ? <AdminDashboard /> : <Login />;
  }

  return (
    <>
      <Navbar />
      <HeroCanvas />
      <Home />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
