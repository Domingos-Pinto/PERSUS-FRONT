import { useEffect, useState } from "react";
import ImageSlot from "../ImageSlot";
import { getSettings, updateSettingsImages } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";
import { toast } from "../ui/Toast";

function WelcomePanel() {
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
      toast.success("Imagem publicada na secção Bem-vindo.");
    } catch (err) {
      toast.error(err.message || "Não foi possível publicar a imagem.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-6 max-w-3xl">
      <p className="text-sm text-zinc-600 mb-6">
        Estas imagens aparecem na secção "Bem-vindo", logo abaixo da introdução,
        na página inicial do site.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <ImageSlot
          label="Espaço em destaque"
          hint="Sala com painel de TV planeado, Luanda."
          currentUrl={assetUrl(settings?.welcome_hero_image)}
          saving={savingKey === "welcome_hero_image"}
          onUpload={(file) => handleUpload("welcome_hero_image", file)}
        />
        <ImageSlot
          label="Móvel em destaque"
          hint="Um dos móveis planeados, produzido em Luanda."
          currentUrl={assetUrl(settings?.welcome_secondary_image)}
          saving={savingKey === "welcome_secondary_image"}
          onUpload={(file) => handleUpload("welcome_secondary_image", file)}
        />
      </div>
    </div>
  );
}

export default WelcomePanel;
