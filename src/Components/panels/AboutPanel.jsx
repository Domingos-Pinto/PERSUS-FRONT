import { useEffect, useState } from "react";
import ImageSlot from "../ImageSlot";
import { getSettings, updateSettingsImages } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";
import { toast } from "../ui/Toast";

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
        Esta foto aparece na secção "Sobre" (Quem Somos / Missão / Visão /
        Valores) — usa uma foto profissional da equipa, devidamente
        uniformizada.
      </p>

      <ImageSlot
        label="Foto da equipa"
        hint="Foto profissional, equipa uniformizada — aparece grande, ao lado do texto Quem Somos."
        currentUrl={assetUrl(settings?.about_image)}
        saving={savingKey === "about_image"}
        onUpload={(file) => handleUpload("about_image", file)}
      />
    </div>
  );
}

export default AboutPanel;