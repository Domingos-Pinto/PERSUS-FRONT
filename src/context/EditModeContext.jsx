import { createContext, useContext } from "react";

const EditModeContext = createContext(false);

export function EditModeProvider({ value = true, children }) {
  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}

export default EditModeContext;
