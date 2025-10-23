import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* -- DATA -- */
const TABS = [
  {
    key: "capillaire",
    label: "CAPILLAIRE",
    libelle: "NOOR CAPILLAIRE",
    headlineA: "SHAMPOING",
    headlineB: "2en1",
    bullets: [
      { title: "CHEVEUX SECS", sub: "NUTRITION & PROTECTION INTENSE" },
      { title: "CHEVEUX NORMAUX", sub: "SOIN & PROTECTION" },
      { title: "CHEVEUX GRAS", sub: "" },
    ],
    heroImage: "/images/hero-capillaire.png",
  },
  {
    key: "corps",
    label: "CORPS",
    libelle: "NOOR VISAGE ET CORPS",
    headlineA: "HYDRATATION",
    headlineB: "QUOTIDIENNE",
    bullets: [
      { title: "PEAUX SÈCHES", sub: "CONFORT & DOUCEUR" },
      { title: "PEAUX NORMALES", sub: "HYDRATATION ÉQUILIBRÉE" },
      { title: "PEAUX SENSIBLES", sub: "TOLÉRANCE & APAISEMENT" },
    ],
    heroImage: "/images/06.png",
  },
  {
    key: "visage",
    label: "VISAGE",
    libelle: "NOOR VISAGE ET CORPS",
    headlineA: "RITUEL",
    headlineB: "ÉCLAT",
    bullets: [
      { title: "TOUS TYPES DE PEAU", sub: "NETTOIE & ILLUMINE" },
      { title: "PEAUX SÈCHES", sub: "CONFORT & ÉCLAT" },
      { title: "PEAUX MIXTES", sub: "ÉQUILIBRE & PURETÉ" },
    ],
    heroImage: "/images/hero-visage.png",
  },
  {
    key: "pharma",
    label: "PHARMA",
    libelle: "PHARMA",
    headlineA: "HYGIÈNE",
    headlineB: "& BIEN-ÊTRE",
    bullets: [
      { title: "GEL DENTAIRE", sub: "PROTECTION QUOTIDIENNE" },
      { title: "BAIN DE BOUCHE", sub: "HALEINE SAINE" },
      { title: "SOINS SPÉCIFIQUES", sub: "CONFORT & SÉCURITÉ" },
    ],
    heroImage: "/images/hero-pharma.png",
  },
];

/* -- BADGE COMPOSANT -- */
const Badge = ({
  className = "",
  svgClassName = "",
  barColor = "#8fd1f3",
  strokeColor = "white"
}) => {
  return (
    <div
      className={`
        pointer-events-none
        w-[60px] h-[96px] z-10
        ${className}
      `}
      style={{ backgroundColor: barColor }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="89"
        viewBox="0 -3 56 84"
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/4 top-6 ${svgClassName}`}
      >
        <circle
          cx="28"
          cy="49"
          r="18"
          stroke={strokeColor}
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M10 70 Q 18 76 28 74 Q 38 72 46 78"
          stroke={strokeColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default function AcheterParCategories() {
  const navigate = useNavigate();
  const [active, setActive] = useState("capillaire");

  const tab = TABS.find(t => t.key === active) || TABS[0];

  // Fonction pour rendre headlineB avec style conditionnel
  const renderHeadlineB = () => {
    if (tab.headlineB === "2en1") {
      return (
        <>
          <span className="font-semibold">2</span>
          en
          <span className="font-semibold">1</span>
        </>
      );
    } else if (tab.headlineB === "QUOTIDIENNE") {
      return <span className="font-semibold">QUOTIDIENNE</span>;
    } else if (tab.headlineB === "ÉCLAT") {
      return <span className="font-semibold">ÉCLAT</span>;
    } else if (tab.headlineB === "& BIEN-ÊTRE") {
      return (
        <>
          <span className="font-semibold">&</span> BIEN-ÊTRE
        </>
      );
    }
    return tab.headlineB;
  };

  return (
    <section className="w-full mx-auto font-sans">
      {/* ===== Titre "ACHETER PAR / CATÉGORIES" ===== */}
      <div className="w-full bg-white">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-5 lg:px-10 pt-6 md:pt-8 pb-2 md:pb-3 text-center">
          <h2 className="text-[22px] md:text-[26px] lg:text-[36px] leading-[1.1] font-semibold uppercase tracking-[0.02em] text-[#0b2a3b]">
            ACHETER PAR
          </h2>
          <div className="inline-block mt-1 md:mt-1.5">
            <div className="text-[14px] md:text-[16px] lg:text-[22px] font-normal uppercase tracking-[0.25em] md:tracking-[0.30em] text-[#0b2a3b]/80">
              CATÉGORIES
            </div>
          </div>
        </div>
      </div>

      {/* barre d'onglets  */}
      <div className="w-full bg-[#bfd7e3] overflow-x-auto">
        <div className="flex items-center gap-4 md:gap-8 lg:gap-14 px-3 md:px-4 py-2 min-w-max">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-1 md:gap-2 pr-2 md:pr-3 transition-all duration-200 ${active === t.key
                ? "text-white scale-105"
                : "text-white/50 hover:text-white/80"
                }`}
              aria-pressed={active === t.key}
            >
              <span aria-hidden="true" className="text-[18px] md:text-[20px]">{">"}</span>
              <span className={`text-[16px] md:text-[20px] lg:text-[25px] font-bold uppercase tracking-[0.12em] md:tracking-[0.18em] ${active === t.key ? "underline underline-offset-3 md:underline-offset-4 decoration-2" : ""
                }`}>
                {t.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* bloc principal */}
  <div className="h-auto bg-white overflow-hidden lg:min-h-[520px]">
        <div key={active} className="flex flex-col lg:grid lg:grid-cols-[1.08fr_1.52fr] h-full">

     
          <div className="relative min-h-[420px] md:min-h-[500px] lg:h-full bg-[linear-gradient(180deg,#b4bcc4_0%,#e8ecf0_100%)]">

            <Badge className="absolute top-3 md:top-1 left-4 md:left-8 w-[50px] md:w-[60px] h-[80px] md:h-[96px]" />

            <div className="h-full flex flex-col justify-center items-center px-4 md:px-8 lg:px-12 py-8 lg:py-0">

              <div className="mb-4 lg:mb-8 text-center">
                <h3 className="text-[#0b2a3b] leading-none">
                  <span className="text-[28px] md:text-[32px] lg:text-[38px] xl:text-[44px] font-light tracking-wide block">
                    {tab.headlineA}
                  </span>
                  <span className="text-[28px] md:text-[32px] lg:text-[38px] xl:text-[44px] font-light tracking-wide">
                    {renderHeadlineB()}
                  </span>
                </h3>
              </div>

              <div className="relative w-full max-w-md">
                <div className="space-y-6 md:space-y-8 lg:space-y-10">
                  {tab.bullets.map((b, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 md:gap-5">
                      <div className="relative flex flex-col items-center pt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          className="flex-shrink-0 z-10 md:w-[30px] md:h-[30px]"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="white"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>

                        {idx < tab.bullets.length - 1 && (
                          <div
                            className="absolute top-[24px] md:top-[30px] left-1/2 transform -translate-x-1/2 w-[1.5px] md:w-[2px] bg-white z-0 timeline-line"
                            style={{
                              height: 'calc(120% + 2.3rem)'
                            }}
                          />
                        )}
                      </div>

                      <div className="text-[#0b2a3b] flex-1 pt-1">
                        <div className="font-semibold text-[18px] md:text-[22px] lg:text-[24px] xl:text-[26px] leading-tight tracking-wide uppercase">
                          {b.title}
                        </div>
                        {b.sub && (
                          <div className="text-[#0b2a3b]/75 text-[14px] md:text-[16px] lg:text-[18px] xl:text-[19px] leading-tight mt-0.5 md:mt-1 tracking-wide uppercase">
                            {b.sub}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>


          </div>

          <div className="relative h-[400px]  md:h-auto lg:h-full ">
            <img
              src={tab.heroImage}

              alt={tab.label}
              className="w-full h-full object-contain object-center bg-gray-100"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3C/svg%3E';
              }}
            />
            <div className="absolute  inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.12)_48%,rgba(0,0,0,0)_100%)]" />

          
            {active === "capillaire" && (
              <>
                <div className="absolute left-4 md:left-8 top-6 md:top-24 text-white">
                  <h3 className="leading-tight">
                    <div className="text-[18px] md:text-[24px] lg:text-[28px] xl:text-[40px] font-light tracking-[0.03em] md:tracking-[0.05em] uppercase">
                      LA <span className="font-bold">QUINTESSENCE</span>
                    </div>
                    <div className="text-[16px] md:text-[20px] lg:text-[24px] xl:text-[32px] font-light tracking-[0.03em] md:tracking-[0.05em] uppercase">
                      DU SOIN.
                    </div>
                  </h3>
                </div>

                <div className="absolute left-4 md:left-[22%] top-[45%] md:top-[42%] -translate-y-1/2 text-white flex items-end -space-x-1">
                  <div className="text-[10px] md:text-[12px] font-light tracking-[0.06em] md:tracking-[0.08em] leading-relaxed uppercase">
                    <div>SANS SULFATES</div>
                    <div>SANS SILICONE</div>
                    <div>SANS PARABÈN</div>
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 50 50"
                    className="flex-shrink-0 -rotate-90 -mb-2 md:-mb-3 md:w-[32px] md:h-[32px]"
                  >
                    <path
                      d="M 10 10 L 10 40 L 40 40"
                      stroke="#20a19a"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </div>
              </>
            )}

            <div className="absolute right-3 md:right-6 bottom-3 md:bottom-6">
              <button
                onClick={() => navigate(`/categorie?libelle=${encodeURIComponent(tab.libelle)}`)}
                className="px-4 md:px-6 lg:px-8 py-1.5 md:py-2 rounded-lg bg-[#bcd8e5] text-white font-semibold tracking-[0.15em] md:tracking-[0.20em] text-[16px] md:text-[20px] lg:text-[24px] shadow-lg hover:brightness-105 transition-all transform hover:scale-[1.02]"
                aria-label={`Découvrez ${tab.label}`}
              >
                DÉCOUVREZ <span aria-hidden="true" className="ml-1 text-[16px] md:text-[20px] lg:text-[24px] font-bold">{">"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .timeline-line {
            height: calc(100% + 3rem) !important;
          }
        }
      `}</style>
    </section>
  );
}