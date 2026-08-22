// src/context/AdminContext.jsx
import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const AdminContext = createContext({ isAdmin: false });

// Mantém a mesma API (useAdmin -> { isAdmin }) que os componentes existentes
// já usam (EditableText, RevealImage, GalleryImage, etc.), mas agora ligada
// à sessão real: só é "admin" quem tiver sessão iniciada.
// Precisa de estar dentro de <AuthProvider>.
export function AdminProvider({ children }) {
  const { isAuthenticated } = useAuth();

  return (
    <AdminContext.Provider value={{ isAdmin: isAuthenticated }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
