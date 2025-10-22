/* eslint-disable */
import React, { useState, useEffect } from "react";

export default function VideoSpot({
  title = "NOS PRODUITS DE BEAUTÉ EXCLUSIFS",
  subtitle = "CRÉÉ POUR RENDRE VOTRE VIE PLUS BELLE",
  poster = "/images/bonplan-bg.jpg",               
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // YouTube /videos/spot.mp4
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-5 lg:px-10 pt-8 text-center">
        <h2 className="text-[28px] md:text-[36px] font-semibold tracking-[0.04em] text-[#0b2a3b]">
          {title}
        </h2>
        <p className="mt-2 text-[18px] md:text-[22px] tracking-[0.12em] text-[#0b2a3b]/80">
          {subtitle}
        </p>
      </div>

      <div className="w-full mx-auto px-0 lg:px-10 mt-4">
        <div className="relative overflow-hidden">
          <img
            src={poster}
            alt=""
            className="w-full h-[56vw] max-h-[560px] min-h-[320px] object-cover"
            loading="lazy"
          />
          <button
            type="button"
            aria-label="Lire la vidéo"
            onClick={() => setOpen(true)}
            className="absolute inset-0 m-auto h-16 w-16 md:h-20 md:w-20 grid place-items-center rounded-full
                       bg-black/60 hover:bg-black/70 ring-4 ring-white/40 transition"
          >
            <svg width="34" height="34" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-4xl aspect-video bg-black rounded-md overflow-hidden shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/^https?:\/\//.test(videoUrl) ? (
              <iframe
                src={`${videoUrl}${videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
                title="Vidéo"
                className="w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={videoUrl} className="w-full h-full" controls autoPlay />
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Fermer"
            className="absolute top-4 right-4 text-white/90 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
}
