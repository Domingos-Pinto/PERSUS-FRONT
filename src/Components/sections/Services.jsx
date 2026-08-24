import { useEffect, useState } from "react";
import {
  FaTv,
  FaCouch,
  FaLightbulb,
  FaFont,
  FaCube,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { useReveal } from "../../hooks/useReveal";
import EditableText from "../admin/EditableText";
import { listWorks } from "../../service/worksApi";
import { assetUrl } from "../../config/api";

const icons = {
  tv_panel: FaTv,
  custom_furniture: FaCouch,
  false_ceiling: FaLightbulb,
  letters_3d: FaFont,
  signs_3d: FaCube,
};

const initialServices = [
  {
    category: "tv_panel",
    title: "Painéis de TV",
    description: "Painéis modernos sob medida para a tua sala",
  },
  {
    category: "custom_furniture",
    title: "Móveis Planejados",
    description: "Mobiliário desenhado à medida do teu espaço",
  },
  {
    category: "false_ceiling",
    title: "Teto Falso",
    description: "Iluminação e acabamento de teto com design moderno",
  },
  {
    category: "letters_3d",
    title: "Letras 3D",
    description: "Letras em relevo para identidade visual e decoração",
  },
  {
    category: "signs_3d",
    title: "Placas 3D",
    description: "Placas personalizadas para negócios e espaços",
  },
];

function ServiceGalleryModal({ serviceTitle, slides, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [detailIndex, setDetailIndex] = useState(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };

  const goPrev = () =>
    setDetailIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const goNext = () =>
    setDetailIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (detailIndex !== null) setDetailIndex(null);
        else handleClose();
      }
      if (detailIndex !== null && e.key === "ArrowLeft") goPrev();
      if (detailIndex !== null && e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [detailIndex, slides.length]);

  // trava o scroll do body enquanto o modal estiver aberto (funciona bem
  // inclusive no iOS/Safari, onde só "overflow: hidden" não é suficiente)
  useEffect(() => {
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
    };
  }, []);

  const visible = mounted && !closing;
  const slide = detailIndex !== null ? slides[detailIndex] : null;

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={`Imagens de ${serviceTitle}`}
      style={{ touchAction: "pan-y" }}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className={`absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      <div
        className={`absolute inset-3 md:inset-8 lg:inset-12 rounded-3xl bg-zinc-950 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {}
        <div className="flex items-center justify-between px-5 md:px-8 py-4 md:py-5 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            {detailIndex !== null && (
              <button
                type="button"
                onClick={() => setDetailIndex(null)}
                aria-label="Voltar à galeria"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <FaArrowLeft size={14} />
              </button>
            )}
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-amber-400 font-medium">
                {serviceTitle}
              </p>
              {slide?.workTitle && (
                <p className="text-sm text-zinc-400 mt-0.5">
                  {slide.workTitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* corpo: grelha e detalhe empilhados, com crossfade entre os dois */}
        <div className="relative flex-1 overflow-hidden">
          {/* grelha com todas as fotos */}
          <div
            className={`absolute inset-0 overflow-y-auto overscroll-contain p-5 md:p-8 transition-opacity duration-250 ease-out ${
              detailIndex === null
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
            style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {slides.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setDetailIndex(i)}
                  className="group relative aspect-square rounded-xl overflow-hidden bg-zinc-800"
                >
                  <img
                    src={s.src}
                    alt={s.workTitle || serviceTitle}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {s.workTitle && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                      <p className="text-xs text-white truncate">
                        {s.workTitle}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {}
          <div
            className={`absolute inset-0 transition-opacity duration-250 ease-out ${
              detailIndex !== null
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {slide && (
              <>
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover scale-110 blur-3xl opacity-50"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                <img
                  src={slide.src}
                  alt={slide.workTitle || serviceTitle}
                  className="relative w-full h-full object-contain p-4 md:p-10"
                />

                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goPrev}
                      aria-label="Imagem anterior"
                      className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition"
                    >
                      <FaChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Próxima imagem"
                      className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition"
                    >
                      <FaChevronRight size={14} />
                    </button>
                  </>
                )}

                <div className="absolute inset-x-0 bottom-0 px-5 md:px-10 pb-6 md:pb-10">
                  {slide.workTitle && (
                    <h3
                      className="font-serif text-xl md:text-3xl text-white max-w-2xl"
                      style={{ fontWeight: 500 }}
                    >
                      {slide.workTitle}
                    </h3>
                  )}
                  {slide.workDescription && (
                    <p className="mt-2 text-sm md:text-base text-zinc-200 max-w-xl leading-relaxed">
                      {slide.workDescription}
                    </p>
                  )}
                  {slides.length > 1 && (
                    <p className="mt-3 text-xs text-zinc-400">
                      {detailIndex + 1} / {slides.length}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceCard({
  service,
  thumbnail,
  onSelect,
  isSelected,
  onEdit,
  index,
}) {
  const Icon = icons[service.category];

  if (thumbnail) {
    return (
      <button
        type="button"
        onClick={() => onSelect(service.category)}
        className={`shrink-0 w-[78%] sm:w-[300px] snap-start group relative text-left rounded-2xl overflow-hidden bg-zinc-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
          isSelected ? "ring-2 ring-amber-500" : ""
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={thumbnail}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
        </div>

        <div className="absolute top-5 left-5 w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white text-lg">
          <Icon />
        </div>

        <div className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white flex items-center justify-center text-zinc-900 transition-transform duration-500 ease-out group-hover:rotate-45">
          <FaArrowRight size={14} />
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6">
          <EditableText
            as="h3"
            value={service.title}
            onChange={(text) => onEdit(index, "title", text)}
            className="font-serif text-2xl md:text-3xl text-white"
          />
          <EditableText
            as="p"
            value={service.description}
            onChange={(text) => onEdit(index, "description", text)}
            className="mt-2 text-zinc-200 text-base leading-relaxed"
          />
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase text-amber-400">
            Ver galeria
            <FaArrowRight
              size={10}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(service.category)}
      className={`shrink-0 w-[78%] sm:w-[300px] snap-start group text-left bg-white rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 p-8 ${
        isSelected ? "ring-2 ring-amber-500" : ""
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 text-lg group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
        <Icon />
      </div>
      <EditableText
        as="h3"
        value={service.title}
        onChange={(text) => onEdit(index, "title", text)}
        className="mt-6 font-serif text-2xl text-zinc-900"
      />
      <EditableText
        as="p"
        value={service.description}
        onChange={(text) => onEdit(index, "description", text)}
        className="mt-2 text-zinc-600 text-base leading-relaxed"
      />
    </button>
  );
}

function Services() {
  const [tagRef, tagVisible] = useReveal();
  const [headingRef, headingVisible] = useReveal();
  const [services, setServices] = useState(initialServices);
  const [selected, setSelected] = useState(null);
  const [works, setWorks] = useState([]);
  const [loadingWorks, setLoadingWorks] = useState(true);

  useEffect(() => {
    listWorks()
      .then((data) => setWorks(data || []))
      .catch(() => {})
      .finally(() => setLoadingWorks(false));
  }, []);

  const updateService = (index, field, value) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    );
  };

  const selectedService = services.find((s) => s.category === selected);

  const selectedSlides = selected
    ? works
        .filter((w) => w.category === selected)
        .flatMap((w) =>
          (w.images || []).map((img) => ({
            src: assetUrl(img.path),
            workTitle: w.title,
            workDescription: w.description,
          })),
        )
    : [];

  const thumbnailByCategory = services.reduce((acc, s) => {
    const work = works.find(
      (w) => w.category === s.category && (w.images || []).length > 0,
    );
    acc[s.category] = work ? assetUrl(work.images[0].path) : null;
    return acc;
  }, {});

  return (
    <section id="servicos" className="w-full bg-zinc-50 py-14 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
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
            Os Nossos Serviços
          </h2>
        </div>

        <div className="mt-12 flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">
          {services.map((service, index) => (
            <ServiceCard
              key={service.category}
              service={service}
              thumbnail={thumbnailByCategory[service.category]}
              index={index}
              onSelect={setSelected}
              isSelected={selected === service.category}
              onEdit={updateService}
            />
          ))}
        </div>

        {selectedService && !loadingWorks && selectedSlides.length > 0 && (
          <ServiceGalleryModal
            serviceTitle={selectedService.title}
            slides={selectedSlides}
            onClose={() => setSelected(null)}
          />
        )}

        {selectedService && !loadingWorks && selectedSlides.length === 0 && (
          <div
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-sm text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="font-serif text-lg text-zinc-900">
                {selectedService.title}
              </p>
              <p className="mt-2 text-sm text-zinc-500">
                Ainda sem imagens publicadas nesta categoria.
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-5 text-sm font-semibold rounded-full px-5 py-2.5 text-black transition hover:brightness-110"
                style={{ backgroundColor: "#D9A94E" }}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Services;