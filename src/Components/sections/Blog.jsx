import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegCalendar,
  FaRegNewspaper,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
} from "react-icons/fa";
import { useReveal } from "../../hooks/useReveal";
import EditableText from "../admin/EditableText";
import { listPosts } from "../../service/postsApi";
import { assetUrl } from "../../config/api";

const PAGE_SIZE = 4;
const COLLAGE_LIMIT = 8;

function formatDate(value) {
  if (!value) return null;
  try {
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return null;
  }
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(post) {
  if (post.read_time) return post.read_time;
  const source = stripHtml(post.content) || post.excerpt || "";
  if (!source) return null;
  const words = source.split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function authorInitials(name) {
  if (!name) return "";
  const parts = name.trim().split(" ").filter(Boolean);
  const initials = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || "");
  return initials.join("");
}

function handleCardClick(e, onSelect, post) {
  if (e.defaultPrevented) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return; 
  }
  e.preventDefault();
  onSelect(post);
}


const COLLAGE_SLOTS = [
  { area: "col-start-1 row-start-1", rotate: "-rotate-6" },
  { area: "col-start-2 row-start-1", rotate: "rotate-3" },
  { area: "col-start-1 row-start-2", rotate: "rotate-2" },
  { area: "col-start-2 row-start-2", rotate: "-rotate-3" },
  { area: "col-start-5 row-start-1", rotate: "rotate-4" },
  { area: "col-start-6 row-start-1", rotate: "-rotate-2" },
  { area: "col-start-5 row-start-2", rotate: "-rotate-4" },
  { area: "col-start-6 row-start-2", rotate: "rotate-2" },
];

function BlogHero({
  heroTitle,
  heroSubtitle,
  onEditTitle,
  onEditSubtitle,
  images,
  onCta,
}) {
  const [tagRef, tagVisible] = useReveal();

  return (
    <div
      ref={tagRef}
      className={`relative mx-auto max-w-5xl px-6 pt-4 pb-14 md:pb-20 transition-all duration-700 ${
        tagVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {images.length > 0 && (
        <div className="grid grid-cols-6 grid-rows-2 gap-3 md:gap-4">
          {COLLAGE_SLOTS.map((slot, i) => {
            const src = images[i];
            if (!src) return <div key={i} className={slot.area} />;
            return (
              <div
                key={i}
                className={`${slot.area} ${slot.rotate} aspect-square rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            );
          })}
        </div>
      )}

      {}
      <div
        className={`${
          images.length > 0 ? "absolute inset-0" : "relative"
        } flex items-center justify-center px-4`}
      >
        <div className="text-center max-w-xs sm:max-w-sm md:max-w-xl">
          <EditableText
            as="h2"
            value={heroTitle}
            onChange={onEditTitle}
            className="font-serif text-2xl sm:text-3xl md:text-6xl text-zinc-900 leading-[1.1]"
            style={{ fontWeight: 500 }}
          />
          <EditableText
            as="p"
            value={heroSubtitle}
            onChange={onEditSubtitle}
            className="mt-3 md:mt-5 text-zinc-500 text-xs sm:text-sm md:text-lg leading-relaxed"
          />
          <button
            type="button"
            onClick={onCta}
            className="mt-0 md:mt-8 inline-flex items-center gap-2 rounded-full px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 transition"
          >
            Ver artigos
            <FaArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}


function BlogPostModal({ post, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const previousUrl =
      window.location.pathname + window.location.search + window.location.hash;
    window.history.pushState({}, "", `/blog/${post.slug}`);
    return () => {
      window.history.pushState({}, "", previousUrl);
    };
  }, [post.slug]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 220);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

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

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setScrolled(el.scrollTop > 40);
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
  };

  const visible = mounted && !closing;
  const dateLabel = formatDate(post.published_at || post.created_at);
  const readTime = estimateReadTime(post);
  const hasAuthor = Boolean(post.author_name);

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
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
        className={`absolute inset-0 md:inset-6 lg:inset-x-20 lg:inset-y-6 md:rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* barra fixa: navegação + progresso. pointer-events-none no wrapper para
            não bloquear o wheel/scroll do conteúdo que passa visualmente por baixo
            (via -mt-14); só os botões voltam a aceitar eventos. */}
        <div className="relative shrink-0 z-20 pointer-events-none">
          <div
            className={`flex items-center justify-between px-4 md:px-8 h-14 transition-colors duration-300 ${
              scrolled
                ? "bg-white/95 backdrop-blur-sm border-b border-zinc-100 shadow-sm"
                : "bg-transparent"
            }`}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label="Voltar"
              className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition ${
                scrolled
                  ? "text-zinc-700 hover:bg-zinc-100"
                  : "text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm"
              }`}
            >
              <FaArrowLeft size={14} />
            </button>

            <span
              className={`text-xs tracking-[0.2em] uppercase font-semibold truncate max-w-[50%] transition-colors ${
                scrolled ? "text-zinc-600" : "text-white/0"
              }`}
            >
              {post.category || ""}
            </span>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Fechar"
              className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center transition ${
                scrolled
                  ? "text-zinc-700 hover:bg-zinc-100"
                  : "text-white bg-black/30 hover:bg-black/50 backdrop-blur-sm"
              }`}
            >
              <FaTimes size={16} />
            </button>
          </div>

          <div
            className={`absolute left-0 right-0 bottom-0 h-[2px] transition-colors duration-300 ${
              scrolled ? "bg-zinc-100" : "bg-transparent"
            }`}
          >
            <div
              className="h-full bg-amber-500 transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain -mt-14"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {post.cover_image ? (
            <div className="relative w-full h-[42vh] md:h-[52vh] overflow-hidden bg-zinc-950">
              {/* fundo desfocado, para preencher o espaço sem cortar a imagem original */}
              <img
                src={assetUrl(post.cover_image)}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-50"
              />
              
              <img
                src={assetUrl(post.cover_image)}
                alt={post.title}
                className="relative w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 pointer-events-none" />

              <div className="absolute inset-x-0 bottom-0 px-6 md:px-16 pb-8 md:pb-10 max-w-4xl mx-auto pointer-events-none">
                {post.category && (
                  <span className="inline-block rounded-full bg-amber-500 text-zinc-950 text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1">
                    {post.category}
                  </span>
                )}
                <h3
                  className="mt-4 font-serif text-3xl md:text-5xl text-white leading-[1.12]"
                  style={{ fontWeight: 500 }}
                >
                  {post.title}
                </h3>
              </div>
            </div>
          ) : (
            <div className="pt-20 px-6 md:px-16 max-w-4xl mx-auto">
              {post.category && (
                <span className="inline-block rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold tracking-[0.15em] uppercase px-3 py-1">
                  {post.category}
                </span>
              )}
              <h3
                className="mt-4 font-serif text-3xl md:text-5xl text-zinc-900 leading-[1.12]"
                style={{ fontWeight: 500 }}
              >
                {post.title}
              </h3>
            </div>
          )}

          <div className="px-6 md:px-16 py-8 md:py-12 max-w-3xl mx-auto">
            {(hasAuthor || dateLabel) && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pb-6 mb-8 border-b border-zinc-100">
                {hasAuthor && (
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold shrink-0">
                      {post.author_avatar ? (
                        <img
                          src={assetUrl(post.author_avatar)}
                          alt={post.author_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        authorInitials(post.author_name)
                      )}
                    </div>
                    <span className="text-sm font-semibold text-zinc-800">
                      {post.author_name}
                    </span>
                  </div>
                )}
                {dateLabel && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                    <FaRegCalendar size={11} />
                    {dateLabel}
                  </span>
                )}
              </div>
            )}

            {post.excerpt && (
              <p className="font-serif italic text-xl md:text-2xl text-zinc-700 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {post.content && (
              <div
                className={`text-zinc-700 text-base md:text-[17px] leading-[1.85] ${
                  post.excerpt ? "mt-8" : ""
                } [&_p]:mb-5 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-zinc-900 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-zinc-900 [&_h3]:mt-6 [&_h3]:mb-2 [&_img]:rounded-xl [&_img]:my-6 [&_a]:text-amber-600 [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-5 [&_blockquote]:border-l-2 [&_blockquote]:border-amber-500 [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-zinc-600`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, onSelect }) {
  const dateLabel = formatDate(post.published_at || post.created_at);
  const readTime = estimateReadTime(post);
  const hasAuthor = Boolean(post.author_name);

  return (
    <Link
      to={`/blog/${post.slug}`}
      onClick={(e) => handleCardClick(e, onSelect, post)}
      className="group flex flex-col text-left"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100">
        {post.cover_image ? (
          <img
            src={assetUrl(post.cover_image)}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-300">
            <FaRegNewspaper size={22} />
          </div>
        )}
      </div>

      <span className="mt-5 text-xs tracking-[0.2em] uppercase text-amber-600 font-semibold">
        {post.category || "Blog"}
      </span>

      <h3 className="mt-2 font-serif text-xl md:text-2xl text-zinc-900 leading-snug line-clamp-2">
        {post.title}
      </h3>

      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
        {hasAuthor && (
          <>
            <div className="w-6 h-6 rounded-full overflow-hidden bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-semibold shrink-0">
              {post.author_avatar ? (
                <img
                  src={assetUrl(post.author_avatar)}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                authorInitials(post.author_name)
              )}
            </div>
            <span className="font-medium text-zinc-600">
              {post.author_name}
            </span>
          </>
        )}
        {dateLabel && (
          <>
            {hasAuthor && <span className="text-zinc-300">|</span>}
            <span>{dateLabel}</span>
          </>
        )}
      </div>

      {post.excerpt && (
        <p className="mt-3 text-zinc-500 text-sm leading-relaxed line-clamp-2">
          {post.excerpt}
        </p>
      )}
    </Link>
  );
}

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [page, setPage] = useState(0);
  const [heroTitle, setHeroTitle] = useState(
    "Espaços que inspiram, projectos que duram.",
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Ideias, tendências e histórias sobre acabamentos e design de interiores, da PERSUS para o teu espaço.",
  );
  const gridRef = useRef(null);

  useEffect(() => {
    listPosts()
      .then((data) => setPosts(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages - 1) setPage(0);
  }, [totalPages, page]);

  const visiblePosts = useMemo(
    () => posts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [posts, page],
  );


  const collageImages = useMemo(
    () =>
      posts
        .filter((p) => p.cover_image)
        .slice(0, COLLAGE_LIMIT)
        .map((p) => assetUrl(p.cover_image)),
    [posts],
  );

  const showPagination = posts.length > PAGE_SIZE;


  const changePage = (updater) => {
    setPage(updater);
    requestAnimationFrame(() => {
      gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goPrev = () => changePage((p) => Math.max(0, p - 1));
  const goNext = () => changePage((p) => Math.min(totalPages - 1, p + 1));

  if (!loading && posts.length === 0) return null;

  return (
    <section
      id="blog"
      className="w-full bg-white py-14 md:py-20"
      style={{ overflowAnchor: "none" }}
    >
      <BlogHero
        heroTitle={heroTitle}
        heroSubtitle={heroSubtitle}
        onEditTitle={setHeroTitle}
        onEditSubtitle={setHeroSubtitle}
        images={collageImages}
        onCta={() =>
          gridRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      />

      <div ref={gridRef} className="max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-4">
                <div className="aspect-[16/10] rounded-2xl bg-zinc-100 animate-pulse" />
                <div className="h-3 w-20 bg-zinc-100 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-zinc-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {visiblePosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onSelect={setSelectedPost}
                />
              ))}
            </div>

            {showPagination && (
              <div className="mt-12 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={page === 0}
                  aria-label="Artigos anteriores"
                  className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-900 transition hover:bg-zinc-900 hover:text-white hover:border-zinc-900 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <FaChevronLeft size={14} />
                </button>
                <span className="text-xs tracking-[0.15em] uppercase text-zinc-400">
                  {page + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={page === totalPages - 1}
                  aria-label="Próximos artigos"
                  className="w-11 h-11 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-900 transition hover:bg-zinc-900 hover:text-white hover:border-zinc-900 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <FaChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedPost && (
        <BlogPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </section>
  );
}

export default Blog;