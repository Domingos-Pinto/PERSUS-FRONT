// src/context/NavigationContext.jsx
import { createContext, useContext, useState } from "react";

const NavigationContext = createContext(null);

// Router leve, sem dependências extra: alterna entre "site", "login" e "admin".
// Se mais tarde quiseres URLs reais (/entrar, /admin), troca por react-router-dom.
export function NavigationProvider({ children }) {
  const [view, setView] = useState("site");

  const goTo = (nextView) => {
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <NavigationContext.Provider value={{ view, goTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  return useContext(NavigationContext);
}
