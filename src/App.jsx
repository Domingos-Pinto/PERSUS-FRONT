import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HeroCanvas from "./Components/hero/HeroCanvas";
import Navbar from "./Components/layout/Navbar";
import Home from "./Page/home/Home";
import Login from "./Page/auth/login";
import ForgotPassword from "./Page/auth/ForgotPassword";
import ResetPassword from "./Page/auth/ResetPassword";
import AdminDashboard from "./Page/auth/addmin/AdminDashboard";
import PostDetail from "./Page/blog/PostDetail";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { AdminProvider } from "./context/AdminContext";

function AppContent() {
  const { view, goTo } = useNavigation();
  const { isAuthenticated } = useAuth();

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
    return isAuthenticated ? <AdminDashboard /> : <Login />;
  }

  if (view === "admin") {
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
          <Routes>
            <Route path="/blog/:slug" element={<PostDetail />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </NavigationProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
