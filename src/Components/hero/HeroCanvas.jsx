import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";

const FRAME_COUNT = 50;
const frameSrc = (n) =>
  `/src/assets/hero-frames/webp/${String(n).padStart(4, "0")}.webp`;

const PRELOAD_PRIORITY = 6;

const IMAGE_CONTRAST = 1.12;
const IMAGE_ZOOM = 1.2;
const IMAGE_POSITION_Y = 100; // 0-100 — 100 = mostra o chão, 0 = mostra o teto

const MOBILE_IMAGE_ZOOM = 1.0;
const MOBILE_IMAGE_POSITION_Y = 65; // um pouco mais alto que no desktop

const SCROLL_LENGTH_VH = 300;

const DISSOLVE_WINDOW = 0.6;

function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

function HeroCanvas() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollOverlayRef = useRef(null);
  const framesRef = useRef([]);
  const progressRef = useRef(0);

  const [loadedCount, setLoadedCount] = useState(0);
  const [ready, setReady] = useState(false);
  const [firstFrameSharp, setFirstFrameSharp] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 640px)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const handleChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    let releasedReady = false;

    function markLoaded(i, img) {
      if (cancelled) return;
      loaded += 1;
      framesRef.current[i] = img;
      setLoadedCount(loaded);

      if (!releasedReady && loaded >= Math.min(PRELOAD_PRIORITY, FRAME_COUNT)) {
        releasedReady = true;
        setReady(true);
      }
    }

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);

      if (img.decode) {
        img.decode().then(
          () => markLoaded(i, img),
          () => markLoaded(i, img), // mesmo em erro de decode, não bloqueia o preload
        );
      } else {
        img.onload = img.onerror = () => markLoaded(i, img);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setFirstFrameSharp(true), 60);
    return () => clearTimeout(t);
  }, [ready]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.2,
    });

    let lenisRafId;
    function lenisLoop(time) {
      lenis.raf(time);
      lenisRafId = requestAnimationFrame(lenisLoop);
    }
    lenisRafId = requestAnimationFrame(lenisLoop);

    return () => {
      cancelAnimationFrame(lenisRafId);
      lenis.destroy();
    };
  }, []);
  useEffect(() => {
    if (!ready) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let running = true;
    let rafId;

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const { clientWidth, clientHeight } = canvas;
      const targetWidth = Math.round(clientWidth * dpr);
      const targetHeight = Math.round(clientHeight * dpr);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => resizeCanvas());
      ro.observe(canvas);
    }

    function drawCover(img, alpha) {
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const zoom = isMobile ? MOBILE_IMAGE_ZOOM : IMAGE_ZOOM;
      const positionY = isMobile ? MOBILE_IMAGE_POSITION_Y : IMAGE_POSITION_Y;
      const scale = Math.max(cw / iw, ch / ih) * zoom;

      const drawW = iw * scale;
      const drawH = ih * scale;
      const offsetX = (cw - drawW) / 2;
      const offsetY = (ch - drawH) * (positionY / 100);

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }

    const halfWindow = DISSOLVE_WINDOW / 2;
    const windowStart = 0.5 - halfWindow;
    const windowEnd = 0.5 + halfWindow;

    let lastGoodBaseIndex = 1;

    function tick() {
      if (!running) return;

      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollableHeight = section.offsetHeight - window.innerHeight;
        progressRef.current = Math.min(
          Math.max(-rect.top / scrollableHeight, 0),
          1,
        );
      }

      const progress = progressRef.current;
      const floatIndex = 1 + progress * (FRAME_COUNT - 1);
      const baseIndex = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.floor(floatIndex)),
      );
      const nextIndex = Math.min(FRAME_COUNT, baseIndex + 1);
      const rawBlend = floatIndex - baseIndex;

      let blend;
      if (rawBlend <= windowStart) {
        blend = 0;
      } else if (rawBlend >= windowEnd) {
        blend = 1;
      } else {
        const t = (rawBlend - windowStart) / DISSOLVE_WINDOW;
        blend = smoothstep(t);
      }

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      ctx.clearRect(0, 0, cw, ch);

      const baseImg = framesRef.current[baseIndex];
      const drawIndex =
        baseImg && baseImg.complete && baseImg.naturalWidth
          ? baseIndex
          : lastGoodBaseIndex;
      if (drawIndex === baseIndex) lastGoodBaseIndex = baseIndex;

      drawCover(framesRef.current[drawIndex], 1);
      if (drawIndex === baseIndex && blend > 0.001) {
        drawCover(framesRef.current[nextIndex], blend);
      }
      ctx.globalAlpha = 1;

      if (scrollOverlayRef.current) {
        const maxDark = 0.08;
        scrollOverlayRef.current.style.opacity =
          maxDark * (1 - Math.min(progress * 2, 1));
      }

      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      if (ro) ro.disconnect();
    };
  }, [ready, isMobile]);

  const loadingPercent = Math.round((loadedCount / FRAME_COUNT) * 100);

  return (
    <section
      ref={sectionRef}
      style={{
        width: "100%",
        height: `${SCROLL_LENGTH_VH}vh`,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100svh",
          minHeight: isMobile ? "auto" : "48rem",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          paddingTop: "4rem",
          paddingBottom: "8rem",
          paddingLeft: isMobile ? "1.5rem" : "4rem",
          position: "sticky",
          top: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          {ready && (
            <canvas
              ref={canvasRef}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                filter: `contrast(${IMAGE_CONTRAST}) blur(${firstFrameSharp ? 0 : 14}px)`,
                transition: "filter 700ms ease-out",
                willChange: "filter",
              }}
            />
          )}

          {!ready && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: "0.9rem",
                fontFamily: "sans-serif",
              }}
            >
              A carregar animação... {loadingPercent}%
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "65%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.03) 75%, transparent 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
            background:
              "linear-gradient(transparent 35%, rgba(0,0,0,0.03) 62%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "48vh",
            minHeight: "380px",
            zIndex: 2,
            pointerEvents: "none",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            background:
              "linear-gradient(transparent, rgba(22,22,22,0.28) 40%, rgba(22,22,22,0.7) 100%)",
            maskImage:
              "linear-gradient(transparent 0%, rgba(0,0,0,0.15) 20%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(transparent 0%, rgba(0,0,0,0.15) 20%, black 100%)",
          }}
        />

        <div
          ref={scrollOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            pointerEvents: "none",
            background: "black",
            opacity: 0,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 3,
            textAlign: "left",
            pointerEvents: "none",
            fontFamily: "'Garet', 'Poppins', sans-serif",
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 500,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#D9A94E",
              marginBottom: "0.75rem",
            }}
          >
            [ Luanda, Angola ]
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3.25rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "-0.01em",
              lineHeight: 1,
              margin: 0,
            }}
          >
            PERSUS
          </h1>

          <p
            style={{
              marginTop: "0.6rem",
              maxWidth: "24rem",
              fontSize: "1.15rem",
              fontStyle: "italic",
              fontWeight: 500,
              color: "#D9A94E",
            }}
          >
            Acabamentos e móveis planejados
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroCanvas;
