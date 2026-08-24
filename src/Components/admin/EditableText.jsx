import { useAdmin } from "../../context/AdminContext";
import { useEditMode } from "../../context/EditModeContext";


function EditableText({ value, onChange, as: Tag = "p", className = "" }) {
  const { isAdmin } = useAdmin();
  const isEditMode = useEditMode();

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
