// src/context/EditModeContext.jsx
//
// Separa dois conceitos que antes estavam misturados dentro do isAdmin:
//   1. "Este utilizador é admin" (AdminContext / isAdmin) — permanece igual.
//   2. "Esta árvore de componentes está em modo de edição" (este Context).
//
// O EditableText só fica realmente editável quando os DOIS forem verdadeiros.
// Por omissão, isEditMode é false — ou seja, mesmo um admin logado que
// visite o site público (Welcome, About, Services, Contact fora do painel)
// NÃO vê nada editável, porque essas rotas nunca envolvem a árvore com o
// <EditModeProvider>.
//
// Só as páginas reais de edição do painel /admin devem envolver as sections
// com <EditModeProvider value={true}>.

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
