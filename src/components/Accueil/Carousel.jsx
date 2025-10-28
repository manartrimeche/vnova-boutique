/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

/* === Utilitaires === */
const resolveImageUrl = (u) => {
  if (!u) return "";
  if (u.startsWith("http") || u.startsWith("/")) return u;
  return `${process.env.API_URL}${u}`;
};

function Carousel() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback locaux
  const LOCAL_SLIDES = [
    { imgUrl: "/images/hero1.svg", title: "welcome to beauty", description: "BEAUTY PRODUCTS", link: "/categorie" },

  ];

  const FORCE_LOCAL =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.REACT_APP_USE_LOCAL_SLIDES === "true") || false;

  useEffect(() => {
    const getSlides = async () => {
      if (FORCE_LOCAL) { setSlides(LOCAL_SLIDES); return; }
      try {
        const r = await axios.get(`${process.env.API_URL}/slide_by_etat`);
        const apiSlides = r?.data?.result || [];
        setSlides(apiSlides.length ? apiSlides : LOCAL_SLIDES);
      } catch {
        setSlides(LOCAL_SLIDES);
      }
    };
    getSlides();
  }, []);  

  const prevSlide = () => setCurrentIndex((i) => (i === 0 ? slides.length - 1 : i - 1));
  const nextSlide = () => setCurrentIndex((i) => (i === slides.length - 1 ? 0 : i + 1));

  return (
    <div
      className="
        relative
        h-[70vh]           /* Desktop par défaut */
        max-md:h-[48vh]    /* Tablette */
        max-sm:h-[36vh]    /* Mobile: encore plus court */
        min-h-[320px]      /* Minimum pour lisibilité */
        w-full overflow-hidden mt-0 -mt-[2px]
      "
    >
      <div className="absolute inset-0 flex justify-center">
        <div className="w-full h-full relative">
          {slides.map((s, i) => (
            <div
              key={i}
              aria-hidden={i !== currentIndex}
              style={{
                backgroundImage: `url(${resolveImageUrl(s.imgUrl)})`,
                opacity: i === currentIndex ? 1 : 0,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
              className={`
                absolute inset-0 transition-opacity duration-700
                /* Mobile: focus un peu plus haut pour garder le cercle */
                bg-[58%_45%]
                /* Desktop: centre */
                md:bg-center
              `}
            />
          ))}
        </div>
      </div>

      <div className="absolute left-[5vw] max-md:left-[4vw] max-sm:left-[3vw] top-[50%] max-md:top-[45%] max-sm:top-[52%] transform -translate-y-1/2 text-white w-[90%] max-md:w-[92%] max-sm:w-[94%] z-10">
        <div className="max-w-[55%] md:max-w-[60%] lg:max-w-[55%]">
          <div className="text-[30px] max-md:text-[34px] max-lg:text-[44px] max-xl:text-[54px] xl:text-[78px] font-semibold tracking-[0.02em] leading-[1.15] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            VNOVA
          </div>

          <div className="mt-3 text-[14px] max-md:text-[14px] max-lg:text-[16px] max-xl:text-[18px] xl:text-[24px] font-elight tracking-[0.02em] leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            L'ALLIANCE DE LA <span className="font-bold">SCIENCE</span> & DE LA <span className="font-bold">NATURE</span>
          </div>

          <div
            className="mt-2 text-[14px] max-md:text-[16px] max-lg:text-[18px] max-xl:text-[22px] xl:text-[24px] font-light tracking-[0.02em] leading-snug text-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
            style={{ textShadow: "0 0 0 transparent" }}
          >
            POUR UNE NOUVELLE GÉNÉRATION DE SOINS
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
