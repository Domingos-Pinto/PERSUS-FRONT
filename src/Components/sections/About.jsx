import { useEffect, useRef, useState } from "react";
import { useReveal } from "../../hooks/useReveal";
import EditableText from "../admin/EditableText";
import { getSettings } from "../../service/settingsApi";
import { assetUrl } from "../../config/api";
import iconMissao from "../../assets/icons/icon-missao.png";
import iconVisao from "../../assets/icons/icon-visao.png";
import iconValores from "../../assets/icons/icon-valores.png";

const PILLAR_GOLD = "#C9A227";

function TeamPhoto({ src }) {
  const wrapperRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [parallax, setParallax] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function onScroll() {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const centerOffset = (rect.top + rect.height / 2 - vh / 2) / vh;
      setParallax(centerOffset * 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <style>{`
        @keyframes teamPhotoKenBurns {
          0%   { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
          50%  { transform: scale(1.2) translate3d(1.5%, 1%, 0); }
          100% { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
        }
      `}</style>

      <div
        className="relative overflow-hidden rounded-2xl shadow-2xl w-full aspect-[4/5] bg-zinc-100"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible
            ? `translate3d(0, ${parallax}px, 0)`
            : "scale(1.08) translateY(24px)",
          filter: visible ? "blur(0px)" : "blur(6px)",
          transition:
            "opacity 1100ms cubic-bezier(0.16,1,0.3,1), transform 500ms linear, filter 900ms ease-out",
          willChange: "transform",
        }}
      >
        {src ? (
          <img
            src={src}
            alt="Equipa Persus"
            className="w-full h-full object-contain object-center"
            style={{
              animation: visible
                ? "teamPhotoKenBurns 16s ease-in-out infinite"
                : "none",
            }}
          />
        ) : (
          <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs text-center px-6">
            Foto profissional da equipa uniformizada
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(227,199,126,0.25), rgba(0,0,0,0) 40%)",
            opacity: visible ? 0 : 1,
            transition: "opacity 900ms ease-out 100ms",
          }}
        />
      </div>
    </div>
  );
}

function ValueBlock({ icon, title, children, delayMs = 0 }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className="flex items-start gap-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms, transform 700ms cubic-bezier(0.16,1,0.3,1) ${delayMs}ms`,
      }}
    >
      <div
        className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center border-2"
        style={{
          borderColor: PILLAR_GOLD,
          backgroundColor: "rgba(201,162,39,0.10)",
        }}
      >
        <img src={icon} alt="" className="w-8 h-8" />
      </div>
      <div>
        <h3
          className="font-serif uppercase tracking-wide text-base text-zinc-900"
          style={{ fontWeight: 600 }}
        >
          {title}
        </h3>
        <div className="mt-1 text-zinc-600 leading-relaxed text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

function About() {
  const [tagRef, tagVisible] = useReveal();
  const [headingRef, headingVisible] = useReveal();

  const [description, setDescription] = useState(
    "A PERSUS é uma empresa do sector imobiliário especializada em acabamentos e design de interiores. Contamos com uma equipe de profissionais altamente capacitados, preparados para responder a desafios que vão desde os mais simples até os de elevada complexidade. O nosso compromisso assenta em dois pilares fundamentais: a sustentabilidade dos projectos e a total satisfação dos nossos clientes.",
  );
  const [missao, setMissao] = useState(
    "Dar vida aos sonhos de cada cliente, criando ambientes que acolhem, inspiram e contam histórias. Enfrentamos qualquer desafio com a paixão de quem acredita que um espaço bem-feito transforma vidas.",
  );
  const [visao, setVisao] = useState(
    "Ser a alma criativa do mercado imobiliário em Angola, onde cada projecto entregue é uma relação de confiança que dura para sempre.",
  );
  const [valores, setValores] = useState([
    "Paixão pelo detalhe",
    "Evolução contínua",
    "Competência Técnica",
    "Foco na excelência",
  ]);
  const [teamImage, setTeamImage] = useState(null);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (settings?.about_image) setTeamImage(assetUrl(settings.about_image));
      })
      .catch(() => {});
  }, []);

  const updateValor = (index, text) => {
    setValores((prev) => prev.map((v, i) => (i === index ? text : v)));
  };

  return (
    <section id="sobre" className="w-full bg-white py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <span
              ref={tagRef}
              className={`inline-block text-xs tracking-[0.2em] uppercase font-medium transition-all duration-700 ${
                tagVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
              style={{ color: PILLAR_GOLD }}
            >
              Quem Somos
            </span>

            <h2
              ref={headingRef}
              className={`mt-4 font-serif uppercase tracking-tight text-3xl md:text-4xl text-zinc-900 leading-[1.15] transition-all duration-700 ${
                headingVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ fontWeight: 500 }}
            >
              Feito Em Luanda, Feito Para Durar
            </h2>

            <EditableText
              value={description}
              onChange={setDescription}
              className="mt-4 text-zinc-600 leading-relaxed"
            />

            <div className="mt-10 flex flex-col gap-7">
              <ValueBlock icon={iconMissao} title="Missão">
                <EditableText as="span" value={missao} onChange={setMissao} />
              </ValueBlock>

              <ValueBlock icon={iconVisao} title="Visão" delayMs={100}>
                <EditableText as="span" value={visao} onChange={setVisao} />
              </ValueBlock>

              <ValueBlock icon={iconValores} title="Valores" delayMs={200}>
                <ul className="list-disc list-inside space-y-1">
                  {valores.map((valor, i) => (
                    <li key={i}>
                      <EditableText
                        as="span"
                        value={valor}
                        onChange={(text) => updateValor(i, text)}
                      />
                    </li>
                  ))}
                </ul>
              </ValueBlock>
            </div>
          </div>

          <div className="lg:sticky lg:top-28">
            <TeamPhoto src={teamImage} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;