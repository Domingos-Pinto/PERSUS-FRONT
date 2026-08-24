import { createContext, useContext, useState } from "react";

const NavigationContext = createContext(null);

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
