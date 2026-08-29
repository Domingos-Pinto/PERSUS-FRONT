import { useEffect, useState } from "react";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaCheck,
} from "react-icons/fa";
import EditableText from "../admin/EditableText";
import { getSettings } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";
import persusLogoWhite from "../../assets/persus-logo-white.png";

const Anchor = "a";

function ContactItem(props) {
  const Icon = props.icon;
  const href = props.href;
  const value = props.value;
  const onChange = props.onChange;

  return (
    <Anchor
      href={href}
      target={props.external ? "_blank" : undefined}
      rel="noreferrer"
      className="flex items-center gap-2 text-sm text-zinc-300 hover:text-amber-400 transition"
    >
      <Icon className="text-amber-500 shrink-0" />
      <EditableText
        as="span"
        value={value}
        onChange={onChange}
        className="text-zinc-300 hover:text-amber-400 transition"
      />
    </Anchor>
  );
}

function CopyableContactItem(props) {
  const Icon = props.icon;
  const value = props.value;
  const copyValue = props.copyValue ?? value;
  const onChange = props.onChange;
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="relative flex items-center gap-2 text-sm text-zinc-300 hover:text-amber-400 transition"
    >
      <Icon className="text-amber-500 shrink-0" />
      <EditableText
        as="span"
        value={value}
        onChange={onChange}
        className="text-zinc-300 hover:text-amber-400 transition"
      />

      <span
        className={`absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 whitespace-nowrap rounded-md bg-zinc-800 px-2.5 py-1 text-[11px] text-white shadow-lg transition-all duration-200 ${
          copied
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-1 pointer-events-none"
        }`}
      >
        <FaCheck size={9} className="text-emerald-400" />
        Copiado!
      </span>
    </button>
  );
}

function SocialIcon(props) {
  const href = props.href;
  const Icon = props.icon;
  return (
    <Anchor
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center w-11 h-11 rounded-full border border-zinc-700 text-zinc-400 hover:text-amber-400 hover:border-amber-400 transition"
    >
      <Icon size={18} />
    </Anchor>
  );
}

function FooterPhotoDesktop({ src, side }) {
  if (!src) return <div className="hidden lg:block" />;
  return (
    <div
      className={`hidden lg:block rounded-2xl overflow-hidden ${
        side === "left" ? "justify-self-end" : "justify-self-start"
      }`}
      style={{ width: "100%", maxWidth: "260px" }}
    >
      <div className="w-full h-full" style={{ aspectRatio: "3 / 4" }}>
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

function FooterPhotosMobile({ imageLeft, imageRight }) {
  if (!imageLeft && !imageRight) return null;
  return (
    <div className="flex lg:hidden justify-center gap-4 mb-2">
      {imageLeft && (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden">
          <img src={imageLeft} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {imageRight && (
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden">
          <img src={imageRight} alt="" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

function Contact() {
  const [phone, setPhone] = useState("+244 900 000 000");
  const [email, setEmail] = useState("contacto@persus.ao");
  const [address, setAddress] = useState("Luanda, Angola");
  const [whatsappLink, setWhatsappLink] = useState(
    "https://wa.me/244900000000",
  );
  const [instagramLink, setInstagramLink] = useState(
    "https://instagram.com/persus",
  );
  const [facebookLink, setFacebookLink] = useState(
    "https://facebook.com/persus",
  );
  const [imageLeft, setImageLeft] = useState(null);
  const [imageRight, setImageRight] = useState(null);

  useEffect(function () {
    getSettings()
      .then(function (data) {
        if (!data) return;
        if (data.phone) setPhone(data.phone);
        if (data.email) setEmail(data.email);
        if (data.address) setAddress(data.address);
        if (data.whatsapp_link) setWhatsappLink(data.whatsapp_link);
        if (data.instagram_link) setInstagramLink(data.instagram_link);
        if (data.facebook_link) setFacebookLink(data.facebook_link);
        if (data.footer_image_left)
          setImageLeft(assetUrl(data.footer_image_left));
        if (data.footer_image_right)
          setImageRight(assetUrl(data.footer_image_right));
      })
      .catch(function () {});
  }, []);

  const year = new Date().getFullYear();

  return (
    <footer
      id="contacto"
      className="w-full bg-zinc-900 text-white py-20 md:py-28"
      style={{ fontFamily: "'Garet', 'Poppins', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[260px_1fr_260px] gap-10 items-center">
        <FooterPhotoDesktop src={imageLeft} side="left" />

        <div className="flex flex-col items-center text-center gap-10">
          <FooterPhotosMobile imageLeft={imageLeft} imageRight={imageRight} />

          <div>
            <span className="text-xs tracking-[0.2em] uppercase text-amber-500 font-medium"></span>
            <img
              src={persusLogoWhite}
              alt="Persus"
              className="mt-3 h-8 md:h-10 w-auto mx-auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <CopyableContactItem
              icon={FaPhoneAlt}
              value={phone}
              onChange={setPhone}
            />
            <CopyableContactItem
              icon={FaEnvelope}
              value={email}
              onChange={setEmail}
            />
            <ContactItem
              icon={FaMapMarkerAlt}
              value={address}
              onChange={setAddress}
            />
            <ContactItem
              icon={FaWhatsapp}
              href={whatsappLink}
              external
              value="WhatsApp"
              onChange={function () {}}
            />
          </div>

          <div className="flex gap-4">
            <SocialIcon href={instagramLink} icon={FaInstagram} />
            <SocialIcon href={facebookLink} icon={FaFacebookF} />
          </div>

          <div className="pt-8 border-t border-zinc-800 w-full text-xs text-zinc-500">
            © {year} Persus. Todos os direitos reservados.
          </div>
        </div>

        <FooterPhotoDesktop src={imageRight} side="right" />
      </div>
    </footer>
  );
}

export default Contact;