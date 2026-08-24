import { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const AdminContext = createContext({ isAdmin: false });

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
