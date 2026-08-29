import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaRegCalendar, FaArrowLeft, FaRegNewspaper } from "react-icons/fa";
import { getPostBySlug } from "../../service/postsApi";
import { assetUrl } from "../../config/api";

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

function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getPostBySlug(slug)
      .then((data) => setPost(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const goToBlog = () => {
    navigate("/");
    setTimeout(() => {
      const target = document.querySelector("#blog");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <h1 className="font-serif text-3xl text-zinc-900">
          Publicacao nao encontrada
        </h1>
        <button
          type="button"
          onClick={goToBlog}
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700"
        >
          <FaArrowLeft size={12} /> Voltar ao blog
        </button>
      </div>
    );
  }

  const dateLabel = formatDate(post.published_at || post.created_at);
  const coverUrl = post.cover_image ? assetUrl(post.cover_image) : null;
  const pageUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <>
      <Helmet>
        <title>{post.title} | PERSUS</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.excerpt || post.title}
        />
        {coverUrl && <meta property="og:image" content={coverUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero com imagem de fundo, overlay e titulo sobreposto */}
        <div className="relative w-full h-[55vh] md:h-[68vh] overflow-hidden bg-zinc-900">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-700">
              <FaRegNewspaper size={40} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

          <button
            type="button"
            onClick={goToBlog}
            className="absolute top-24 left-5 md:left-8 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition"
          >
            <FaArrowLeft size={11} /> Voltar
          </button>

          <div className="absolute inset-x-0 bottom-0 px-6 md:px-14 pb-10 md:pb-14 max-w-4xl mx-auto">
            <span className="text-xs tracking-[0.2em] uppercase text-amber-400 font-medium">
              Blog
            </span>

            {dateLabel && (
              <p className="mt-3 flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-zinc-200">
                <FaRegCalendar size={11} />
                {dateLabel}
                {post.author?.name && <span>&middot; por {post.author.name}</span>}
              </p>
            )}

            <h1
              className="mt-4 font-serif text-3xl md:text-5xl text-white leading-tight"
              style={{ fontWeight: 500 }}
            >
              {post.title}
            </h1>
          </div>
        </div>

        {/* Conteudo */}
        <div className="max-w-3xl mx-auto px-6 py-14">
          {post.excerpt && (
            <p className="text-lg md:text-xl text-zinc-500 leading-relaxed italic border-l-2 border-amber-400 pl-5 mb-10">
              {post.excerpt}
            </p>
          )}

          <div className="space-y-5">
            {post.content
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((paragraph, i) => (
                <p
                  key={i}
                  className="text-zinc-700 text-base md:text-lg leading-relaxed whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
          </div>

          <button
            type="button"
            onClick={goToBlog}
            className="mt-14 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 hover:text-amber-700 transition"
          >
            <FaArrowLeft size={11} /> Voltar ao blog
          </button>
        </div>
      </div>
    </>
  );
}

export default PostDetail;
