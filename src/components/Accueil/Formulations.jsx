/* eslint-disable no-unused-vars */
import React from "react";

const BADGES = [
  { src: "/images/icon_1.png", alt: "Natural Extract", scale: 1.0 },
  { src: "/images/icon_2.png", alt: "Vegan", scale: 1.0 },
  { src: "/images/icon_3.png", alt: "Formule Naturelle", scale: 1.0 },
  { src: "/images/icon_4.png", alt: "Testé dermatologiquement", scale: 1.0 },
  { src: "/images/icon_5.png", alt: "PEG Free", scale: 1.0 },
  { src: "/images/icon_6.png", alt: "ISO 22716:2007", scale: 1.0 },
];

const Badge = ({ src, alt, scale, className = "" }) => (
  <li
    className={`aspect-square h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 grid place-items-center ${className}`}
    title={alt}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="max-h-[85%] max-w-[85%] object-contain"
      style={{ transform: `scale(${scale})` }}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  </li>
);

const Formulations = () => {
  return (
    <section className="w-full mx-auto px-4 sm:px-5 lg:px-10 py-8 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-8 lg:gap-0 items-center">
          <div className="text-center lg:text-left lg:pr-16 lg:translate-x-2">
            <h3 className="text-[#0b2a3b] text-[20px] sm:text-[24px] md:text-[28px] lg:text-[36px] font-light leading-[1.2] tracking-wide">
              NOS FORMULATIONS NE CONTIENNENT 
              <br />
              QUE DES INGRÉDIENTS <span className="font-bold">NATURELS,</span>
              <br />
              <span className="font-bold">SAINS & ESSENTIELS.</span>
            </h3>
            <p className="mt-4 sm:mt-6 text-[#0b2a3b]/80 leading-6 sm:leading-7 text-[14px] sm:text-[16px] md:text-[18px] font-light max-w-2xl mx-auto lg:mx-0">
              CHAQUE PRODUIT <span className="font-bold">VNOVA</span> RÉPOND AUX NORMES
              <br />
              LES PLUS STRICTES DE QUALITÉ ET BÉNÉFICIE
              <br />
              D'UNE <span className="font-bold">CERTIFICATION</span> RECONNUE, GAGE DE TRANSPARENCE,
              <br />
              DE SÉCURITÉ ET DE RESPECT DE VOTRE PEAU.
            </p>
          </div>

          <div className="hidden lg:block h-48 bg-[#0b2a3b] w-1 mx-auto lg:translate-x-8" />

          <div className="flex justify-center lg:justify-start lg:pl-12 lg:-ml-4 lg:translate-x-14">
            <ul className="grid grid-cols-4 gap-2 md:gap-1 lg:gap-1 w-full max-w-md lg:max-w-none">
              {BADGES.slice(0, 4).map((b, i) => (
                <Badge key={i} {...b} />
              ))}
              
              <div className="col-span-4 flex justify-center gap-2 md:gap-1 lg:gap-1 mt-2 md:mt-1">
                {BADGES.slice(4, 6).map((b, i) => (
                  <Badge key={i + 4} {...b} />
                ))}
              </div>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Formulations;