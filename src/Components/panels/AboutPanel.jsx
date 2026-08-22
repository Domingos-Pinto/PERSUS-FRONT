import { useEffect, useState } from "react";
import ImageSlot from "../ImageSlot";
import { getSettings, updateSettingsImages } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";
import { toast } from "../ui/Toast";

// NOTA BACKEND: tal como about_image, os campos about_image_2 e
// about_image_3 têm de ser aceites pelo endpoint PUT /api/settings como
// ficheiros (fillable + validação no SettingController), tal como já
// está feito para about_image.

function AboutPanel() {
  const [settings, setSettings] = useState(null);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(() => {});
  }, []);

  const handleUpload = async (field, file) => {
    setSavingKey(field);
    try {
      const updated = await updateSettingsImages({ [field]: file });
      setSettings(updated);
      toast.success("Imagem publicada na secção Sobre.");
    } catch (err) {
      toast.error(err.message || "Não foi possível publicar a imagem.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-6 max-w-3xl">
      <p className="text-sm text-zinc-600 mb-6">
        Estas imagens aparecem na secção "Sobre", ao lado do texto de
        apresentação da empresa — a primeira é a imagem principal (maior), as
        outras duas aparecem lado a lado, mais pequenas.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <ImageSlot
            label="Imagem principal"
            hint="Equipa, oficina ou um trabalho em destaque."
            currentUrl={assetUrl(settings?.about_image)}
            saving={savingKey === "about_image"}
            onUpload={(file) => handleUpload("about_image", file)}
          />
        </div>
        <ImageSlot
          label="Imagem secundária 1"
          hint="Detalhe de um trabalho ou do espaço."
          currentUrl={assetUrl(settings?.about_image_2)}
          saving={savingKey === "about_image_2"}
          onUpload={(file) => handleUpload("about_image_2", file)}
        />
        <ImageSlot
          label="Imagem secundária 2"
          hint="Detalhe de um trabalho ou do espaço."
          currentUrl={assetUrl(settings?.about_image_3)}
          saving={savingKey === "about_image_3"}
          onUpload={(file) => handleUpload("about_image_3", file)}
        />
      </div>
    </div>
  );
}

export default AboutPanel;
