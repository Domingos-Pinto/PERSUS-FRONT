import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loginRequest, logoutRequest, meRequest } from "../service/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await meRequest();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (login, password) => {
    setError(null);
    try {
      const result = await loginRequest({ login, password });
      setUser(result.user);
      return true;
    } catch (err) {
      setError(err.message || "Credenciais erradas");
      return false;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        refresh,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
