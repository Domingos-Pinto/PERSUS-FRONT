import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import EditableText from "../admin/EditableText";
import { getSettings } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";

// Sub-componente: caixa de imagem com fade + scale ao entrar na tela.
// Só exibe — a publicação de verdade acontece no painel /admin (aba Bem-vindo).
function RevealImage(props) {
  const src = props.src;
  const label = props.label;
  const delayMs = props.delayMs || 0;
  const className = props.className || "";

  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(
    function () {
      const el = wrapperRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        function (entries) {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setTimeout(function () {
              setVisible(true);
            }, delayMs);
            observer.disconnect();
          }
        },
        { threshold: 0.15 },
      );

      observer.observe(el);
      return function () {
        observer.disconnect();
      };
    },
    [delayMs],
  );

  return (
    <div
      ref={wrapperRef}
      className={
        "relative overflow-hidden rounded-2xl shadow-xl w-full transition-opacity duration-[1200ms] ease-out " +
        className
      }
      style={{ aspectRatio: "4 / 3", opacity: visible ? 1 : 0 }}
    >
      <div
        className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-sm transition-transform duration-[1200ms] ease-out"
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

const highlights = [
  "Painéis de TV",
  "Teto Falso",
  "Letras 3D",
  "Placas 3D",
  "Móveis Sob Medida",
];

function OrcamentoLink(props) {
  const linkRef = props.linkRef;
  const visible = props.visible;
  const className =
    "mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-600 border-b border-amber-600/40 pb-0.5 hover:border-amber-600 transition-all duration-700 delay-150 " +
    (visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6");

  return (
    <a ref={linkRef} href="#contacto" className={className}>
      Pede o teu orçamento
      <span aria-hidden="true">→</span>
    </a>
  );
}

function Welcome() {
  const [tagRef, tagVisible] = useReveal();
  const [headingRef, headingVisible] = useReveal();
  const [textRef, textVisible] = useReveal();
  const [chipsRef, chipsVisible] = useReveal();

  const [headingLine1, setHeadingLine1] = useState("O Acabamento Que");
  const [headingLine2, setHeadingLine2] = useState("Transforma O Teu Espaço");
  const [description, setDescription] = useState(
    "Somos uma empresa de acabamentos e mobiliário planeado sediada em Luanda. Cada projeto é desenhado e produzido à medida — painéis de TV, teto falso, letras e placas 3D, móveis sob encomenda — entregue com o rigor de quem, um dia, quer crescer para a construção civil.",
  );
  const [heroImage, setHeroImage] = useState(null);
  const [furnitureImage, setFurnitureImage] = useState(null);

  useEffect(function () {
    getSettings()
      .then(function (settings) {
        if (settings && settings.welcome_hero_image) {
          setHeroImage(assetUrl(settings.welcome_hero_image));
        }
        if (settings && settings.welcome_secondary_image) {
          setFurnitureImage(assetUrl(settings.welcome_secondary_image));
        }
      })
      .catch(function () {});
  }, []);

  return (
    <section className="w-full bg-[#faf8f5] py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <span
          ref={tagRef}
          className={
            "inline-block text-xs tracking-[0.2em] uppercase text-amber-600 font-medium transition-all duration-700 " +
            (tagVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-3")
          }
        ></span>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-end">
          <h2
            ref={headingRef}
            className={
              "font-serif uppercase tracking-tight text-4xl md:text-5xl text-zinc-900 leading-[1.1] transition-all duration-700 " +
              (headingVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6")
            }
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

          <div>
            <EditableText
              value={description}
              onChange={setDescription}
              className={
                "text-zinc-600 leading-relaxed max-w-md transition-all duration-700 delay-150 " +
                (textVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6")
              }
            />

            <OrcamentoLink linkRef={textRef} visible={textVisible} />
          </div>
        </div>

        <div
          ref={chipsRef}
          className={
            "mt-7 flex flex-wrap gap-2 transition-all duration-700 delay-300 " +
            (chipsVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4")
          }
        >
          {highlights.map(function (item) {
            return (
              <span
                key={item}
                className="text-xs tracking-wide text-zinc-600 bg-white border border-zinc-200 rounded-full px-4 py-1.5"
              >
                {item}
              </span>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
            <RevealImage src={heroImage} label="Imagem do espaço em destaque" />
            <p className="mt-3 text-sm text-zinc-500 text-center">
              Sala com painel de TV planeado, Luanda.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <RevealImage
              src={furnitureImage}
              label="Imagem do móvel em destaque"
              delayMs={150}
            />
            <p className="mt-3 text-sm text-zinc-500 text-center">
              Um dos nossos móveis planeados, produzido em Luanda.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
