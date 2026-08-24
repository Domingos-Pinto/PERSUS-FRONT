import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import EditableText from "../admin/EditableText";
import { getSettings } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";

function RevealPhoto({
  src,
  label,
  aspect = "4 / 3",
  className = "",
  delayMs = 0,
}) {
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden rounded-2xl shadow-xl w-full transition-opacity duration-[1200ms] ease-out ${className}`}
      style={{ aspectRatio: aspect, opacity: visible ? 1 : 0 }}
    >
      <div
        className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs transition-transform duration-[1200ms] ease-out"
        style={{ transform: visible ? "scale(1)" : "scale(1.15)" }}
      >
        {src ? (
          <img
            src={src}
            alt={label}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          label
        )}
      </div>
    </div>
  );
}

function About() {
  const [tagRef, tagVisible] = useReveal();
  const [headingRef, headingVisible] = useReveal();
  const [statsRef, statsVisible] = useReveal();

  const [headingLine1, setHeadingLine1] = useState("Feito Em Luanda,");
  const [headingLine2, setHeadingLine2] = useState("Feito Para Durar");
  const [description, setDescription] = useState(
    "Acabamentos e móveis planejados, desenhados e produzidos à medida do teu espaço.",
  );
  const [mainImage, setMainImage] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [stats, setStats] = useState([]);

  const updateStat = (index, field, text) => {
    setStats((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: text } : s)),
    );
  };

  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (settings?.about_image) setMainImage(assetUrl(settings.about_image));
        if (settings?.about_image_2)
          setImage2(assetUrl(settings.about_image_2));
        if (settings?.about_image_3)
          setImage3(assetUrl(settings.about_image_3));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="sobre" className="w-full bg-white py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
          <div>
            <span
              ref={tagRef}
              className={`inline-block text-xs tracking-[0.2em] uppercase text-amber-600 font-medium transition-all duration-700 ${
                tagVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            ></span>

            <h2
              ref={headingRef}
              className={`mt-4 font-serif uppercase tracking-tight text-4xl md:text-5xl text-zinc-900 leading-[1.1] transition-all duration-700 ${
                headingVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ fontWeight: 500 }}
            >
              <EditableText
                as="span"
                value={headingLine1}
                onChange={setHeadingLine1}
                className="block"
              />
              <EditableText
                as="span"
                value={headingLine2}
                onChange={setHeadingLine2}
                className="block"
              />
            </h2>

            <EditableText
              value={description}
              onChange={setDescription}
              className="mt-4 text-zinc-600 leading-relaxed max-w-md"
            />

            {stats.length > 0 && (
              <div
                ref={statsRef}
                className={`mt-8 grid grid-cols-3 gap-6 max-w-md transition-all duration-700 delay-300 ${
                  statsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                }`}
              >
                {stats.map((stat, i) => (
                  <div key={i}>
                    <EditableText
                      as="p"
                      value={stat.value}
                      onChange={(text) => updateStat(i, "value", text)}
                      className="font-serif text-2xl md:text-3xl text-zinc-900"
                    />
                    <EditableText
                      as="p"
                      value={stat.label}
                      onChange={(text) => updateStat(i, "label", text)}
                      className="mt-1 text-xs text-zinc-500 leading-snug"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <RevealPhoto
                src={mainImage}
                label="Imagem principal"
                aspect="16 / 10"
              />
            </div>
            <RevealPhoto
              src={image2}
              label="Imagem secundária"
              aspect="4 / 3"
              delayMs={120}
            />
            <RevealPhoto
              src={image3}
              label="Imagem secundária"
              aspect="4 / 3"
              delayMs={220}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
