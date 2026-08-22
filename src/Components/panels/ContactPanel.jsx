import { useEffect, useState } from "react";
import {
  getSettings,
  updateSettings,
  updateSettingsImages,
} from "../../service/settingsApi";
import { assetUrl } from "../../config/api";
import ImageSlot from "../ImageSlot";
import { toast } from "../ui/Toast";

// type/autoComplete corretos por campo — sem isto, o browser não sabe
// o que cada campo é e, num formulário com telefone/email/morada ao
// lado, alguns browsers tentam "ajudar" preenchendo TODOS os campos
// com dados de contacto guardados (foi assim que o email acabou
// dentro dos campos de Instagram/WhatsApp/Facebook).
const FIELDS = [
  {
    key: "phone",
    label: "Telefone",
    placeholder: "+244 900 000 000",
    type: "tel",
    autoComplete: "tel",
  },
  {
    key: "email",
    label: "Email",
    placeholder: "contacto@prohigienizar.ao",
    type: "email",
    autoComplete: "email",
  },
  {
    key: "address",
    label: "Morada",
    placeholder: "Luanda, Angola",
    type: "text",
    autoComplete: "street-address",
  },
  {
    key: "whatsapp_link",
    label: "Link do WhatsApp",
    placeholder: "https://wa.me/244900000000",
    type: "url",
    autoComplete: "off",
  },
  {
    key: "instagram_link",
    label: "Link do Instagram",
    placeholder: "https://instagram.com/...",
    type: "url",
    autoComplete: "off",
  },
  {
    key: "facebook_link",
    label: "Link do Facebook",
    placeholder: "https://facebook.com/...",
    type: "url",
    autoComplete: "off",
  },
];

// Estes 3 têm de começar por http:// ou https:// — nunca mailto:, tel:, etc.
const LINK_KEYS = ["whatsapp_link", "instagram_link", "facebook_link"];

// Só estes campos + maintenance_mode pertencem a este formulário.
// Importante: NÃO reenviar o objeto de settings inteiro no submit — ele
// também traz welcome_hero_image/welcome_secondary_image/about_image/
// footer_image_left/footer_image_right (strings com o caminho já
// guardado), e a validação do backend rejeita esses campos quando não
// vêm como um ficheiro de imagem de verdade.
const TEXT_KEYS = [
  "phone",
  "email",
  "address",
  "whatsapp_link",
  "instagram_link",
  "facebook_link",
  "maintenance_mode",
];

// NOTA BACKEND: footer_image_left e footer_image_right têm de ser
// aceites pelo endpoint PUT /api/settings como ficheiros (fillable +
// validação no SettingController).

function ContactPanel() {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingImageKey, setSavingImageKey] = useState(null);

  useEffect(() => {
    getSettings()
      .then((data) => setForm(data))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificação rápida antes de enviar: evita voltar a guardar um
    // "mailto:..." ou qualquer outra coisa nestes 3 campos.
    const invalidLink = LINK_KEYS.find((key) => {
      const value = (form[key] || "").trim();
      return value && !/^https?:\/\//i.test(value);
    });
    if (invalidLink) {
      const field = FIELDS.find((f) => f.key === invalidLink);
      toast.error(`${field.label} tem de começar por http:// ou https://`);
      return;
    }

    setSaving(true);
    try {
      const payload = {};
      TEXT_KEYS.forEach((key) => {
        payload[key] = form[key];
      });

      const updated = await updateSettings(payload);
      setForm((prev) => ({ ...prev, ...updated }));
      toast.success("Contactos atualizados.");
    } catch (err) {
      toast.error(err.message || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (field, file) => {
    setSavingImageKey(field);
    try {
      const updated = await updateSettingsImages({ [field]: file });
      setForm((prev) => ({ ...prev, ...updated }));
      toast.success("Imagem do rodapé publicada.");
    } catch (err) {
      toast.error(err.message || "Não foi possível publicar a imagem.");
    } finally {
      setSavingImageKey(null);
    }
  };

  if (loading) return <p className="text-sm text-zinc-400">A carregar...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FIELDS.map(({ key, label, placeholder, type, autoComplete }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-zinc-500 mb-2">
                {label}
              </label>
              <input
                type={type}
                name={key}
                autoComplete={autoComplete}
                value={form[key] || ""}
                onChange={handleChange(key)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>
          ))}
        </div>

        <label className="flex items-center gap-3 text-sm text-zinc-600">
          <input
            type="checkbox"
            checked={!!form.maintenance_mode}
            onChange={(e) =>
              setForm((f) => ({ ...f, maintenance_mode: e.target.checked }))
            }
            className="w-4 h-4 accent-amber-500"
          />
          Ativar modo de manutenção
        </label>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 text-sm font-semibold rounded-full px-6 py-2.5 text-black transition hover:brightness-110 disabled:opacity-60"
          style={{ backgroundColor: "#D9A94E" }}
        >
          {saving ? "A guardar..." : "Guardar contactos"}
        </button>
      </form>

      <div className="bg-zinc-50 rounded-2xl border border-zinc-100 p-6">
        <p className="text-sm text-zinc-600 mb-6">
          Estas duas imagens aparecem a decorar o rodapé do site (uma de cada
          lado do bloco de contactos).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ImageSlot
            label="Foto do rodapé — esquerda"
            currentUrl={assetUrl(form?.footer_image_left)}
            saving={savingImageKey === "footer_image_left"}
            onUpload={(file) => handleImageUpload("footer_image_left", file)}
          />
          <ImageSlot
            label="Foto do rodapé — direita"
            currentUrl={assetUrl(form?.footer_image_right)}
            saving={savingImageKey === "footer_image_right"}
            onUpload={(file) => handleImageUpload("footer_image_right", file)}
          />
        </div>
      </div>
    </div>
  );
}

export default ContactPanel;
