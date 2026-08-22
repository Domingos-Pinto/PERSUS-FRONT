// src/components/admin/EditableText.jsx
import { useAdmin } from "../../context/AdminContext";
import { useEditMode } from "../../context/EditModeContext";

// value + onChange controlados pelo componente pai.
// Por agora o onChange só atualiza o estado local do pai;
// quando ligares ao backend, troca esse onChange por um PATCH/save real.
function EditableText({ value, onChange, as: Tag = "p", className = "" }) {
  const { isAdmin } = useAdmin();
  const isEditMode = useEditMode();

  // Só é editável quando o utilizador É admin E a árvore atual está
  // explicitamente em modo de edição (dentro de uma página do painel
  // /admin que envolve as sections com <EditModeProvider>). No site
  // público isEditMode é sempre false por omissão, mesmo com admin logado.
  const editable = isAdmin && isEditMode;

  const handleBlur = (e) => {
    const text = e.currentTarget.innerText;
    if (text !== value) onChange(text);
  };

  return (
    <Tag
      className={`${className} ${
        editable
          ? "outline-dashed outline-1 outline-amber-400/60 outline-offset-2 focus:outline-amber-500 rounded-sm cursor-text"
          : ""
      }`}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={editable ? handleBlur : undefined}
    >
      {value}
    </Tag>
  );
}

export default EditableText;
