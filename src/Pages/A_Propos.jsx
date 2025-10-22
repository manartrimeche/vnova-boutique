/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState } from "react";
import { Link } from "react-router-dom";


/* ========= Badge Component ========= */
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


/* ========= Icônes inline ========= */
const Icon = {
  Check: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-5 h-5 ${p.className || ""}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Leaf: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-6 h-6 ${p.className || ""}`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21c8 0 14-6 14-14V5h-2C9 5 3 11 3 19v2h2Z" />
    </svg>
  ),
  Flask: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-6 h-6 ${p.className || ""}`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v5m4-5v5" />
      <path d="M6 7h12l-1.8 3.6a2 2 0 0 0-.2.9V18a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3v-6.5a2 2 0 0 0-.2-.9L6 7z" />
    </svg>
  ),
  Shield: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-6 h-6 ${p.className || ""}`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-3 8-10V7l-8-4-8 4v5c0 7 8 10 8 10Z" />
    </svg>
  ),
  Heart: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-6 h-6 ${p.className || ""}`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  ),
  Spark: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-5 h-5 ${p.className || ""}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  ),
  Chevron: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      className={`w-5 h-5 transition-transform duration-300 ${p.className || ""}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
};


/* ========= Badges depuis Formulations ========= */
const BADGES = [
  { src: "/images/icon_1.png", alt: "Natural Extract", scale: 1.0 },
  { src: "/images/icon_2.png", alt: "Vegan", scale: 1.0 },
  { src: "/images/icon_3.png", alt: "Formule Naturelle", scale: 1.0 },
  { src: "/images/icon_4.png", alt: "Testé dermatologiquement", scale: 1.0 },
  { src: "/images/icon_5.png", alt: "PEG Free", scale: 1.0 },
  { src: "/images/icon_6.png", alt: "ISO 22716:2007", scale: 1.0 },
];


const BadgeItem = ({ src, alt, scale, className = "" }) => (
  <li
    className={`aspect-square h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 grid place-items-center ${className} hover:scale-110 transition-transform duration-300`}
    title={alt}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="max-h-[85%] max-w-[85%] object-contain drop-shadow-lg"
      style={{ transform: `scale(${scale})` }}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  </li>
);


/* ========= Sous-composants ========= */
const SectionTitle = ({
  surtitre = "",
  titre = "",
  sousTitre = "",
  center = true
}) => (
  <header className={`${center ? "text-center" : ""} max-w-3xl mx-auto`}>
    {surtitre && (
      <div className="text-[10px] md:text-[12px] uppercase font-normal tracking-[0.6em] text-[#08213f]/60 mb-4">
        {surtitre}
      </div>
    )}
    {titre && (
      <h2 className="text-[26px] md:text-[36px] leading-[1.1] font-semibold uppercase tracking-[0.02em] text-[#08213f]">
        {titre}
      </h2>
    )}
    {sousTitre && (
      <p className="mt-3 md:mt-4 text-[14px] md:text-[18px] leading-[1.1] font-normal uppercase tracking-[0.15em] text-[#08213f]/80">
        {sousTitre}
      </p>
    )}
  </header>
);


/* ========= Composant FAQ Item ========= */
const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);


  return (
    <div className="border-b border-white/20 pb-6 last:border-b-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-start justify-between gap-4 group"
      >
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-white mb-4 group-hover:text-[#aacbda] transition-colors duration-300 leading-tight">
            {q}
          </h3>
        </div>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 ${open ? 'bg-[#aacbda] rotate-180' : ''}`}>
          <Icon.Chevron className={`text-white w-6 h-6 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      <div className={`transition-all duration-300 overflow-hidden ${open ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        <p className="text-xl text-white/90 leading-relaxed font-light tracking-wide">
          {a}
        </p>
      </div>
    </div>
  );
};


/* ========= Composant principal ========= */
const A_Propos = () => {
  return (
    <section className="max-w-screen-2xl mx-auto px-5 lg:px-10 py-10">
      {/* ===== HERO ===== */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-white border border-[#aacbda]/20 shadow-lg">
        <div className="grid lg:grid-cols-1 gap-8 p-8 md:p-12">
          <header className="self-center text-center">
            <p className="text-xs md:text-sm tracking-[0.15em] text-[#08213f]/70 uppercase mb-6">
              Présentation de VNOVA Marketing
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#08213f] leading-tight">
              QUI SOMMES <span className="bg-gradient-to-r from-[#08213f] to-[#1a4a6b] bg-clip-text text-transparent">NOUS</span> ?
            </h1>

            <p className="mt-8 text-[18px] md:text-[22px] leading-relaxed tracking-[0.01em] text-[#08213f]/85 mx-auto max-w-4xl">
              VNOVA, Cosmétique Naturelle Et Haut De Gamme, Certifiée <span className="font-bold text-[#1a4a6b] ">ISO 22716:2007</span>.
              Patrimoine Végétal Tunisien, R&D Moderne Pour Des Soins Efficaces, Sûrs Et Ethiques.
            </p>


            {/* Badges  */}
            <div className="mt-12 flex flex-wrap gap-3 justify-center">
              <span className="inline-flex items-center gap-3 text-[16px] font-bold md:text-[18px] px-6 py-4 rounded-full border border-[#aacbda]/30 text-white bg-gradient-to-r from-[#08213f] to-[#1a4a6b] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Icon.Check className="w-6 h-6" /> ISO 22716:2007 (BPF)
              </span>
              <span className="uppercase inline-flex items-center gap-3 text-[16px] font-bold md:text-[18px] px-6 py-4 rounded-full border border-[#aacbda]/30 text-white bg-gradient-to-r from-[#08213f] to-[#1a4a6b] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🌿 95%+ Formules Naturelles
              </span>
              <span className="uppercase inline-flex items-center gap-3 text-[16px] font-bold md:text-[18px] px-6 py-4 rounded-full border border-[#aacbda]/30 text-white bg-gradient-to-r from-[#08213f] to-[#1a4a6b] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                🧪 Formules Testées
              </span>
            </div>
          </header>
        </div>
      </div>


      <div className="mt-8 overflow-hidden">
        <div className="group flex gap-10 whitespace-nowrap will-change-transform animate-[marquee_22s_linear_infinite] hover:[animation-play-state:paused]">
          {["Figue de barbarie", "Jujuba", "Huile de datte", "Argan", "Grenade", "Aloe vera", "Camomille", "Menthe poivrée", "Romarin", "Huile de lentisque"].map((x, i) => (
            <span key={i} className="inline-flex items-center gap-3 text-[#08213f]/80 font-medium">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#08213f] to-[#1a4a6b]" /> {x}
            </span>
          ))}
          {["Figue de barbarie", "Huile de datte", "Argan", "Grenade", "Aloe vera", "Camomille", "Menthe poivrée", "Romarin"].map((x, i) => (
            <span key={`d${i}`} className="inline-flex items-center gap-3 text-[#08213f]/80 font-medium">
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#08213f] to-[#1a4a6b]" /> {x}
            </span>
          ))}
        </div>
      </div>


      <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
        {[
          { k: "Produits", v: "+23" },
          { k: "Formules Naturelles", v: "95%"  },
          { k: "Contrôles Qualité", v: "100%" },

        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-[#aacbda]/20 bg-white/80 p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold bg-gradient-to-r from-[#08213f] to-[#1a4a6b] bg-clip-text text-transparent">{s.v}</div>
            <div className="text-sm tracking-widest uppercase text-[#08213f]/70 mt-2 font-medium">{s.k}</div>
          </div>
        ))}
      </div>


      <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#aacbda]/60 to-transparent" />


      {/* ===== Labo & Qualité  ===== */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08213f] to-[#1a4a6b] shadow-2xl">
          <Badge className="absolute top-0 right-8" barColor="#aacbda" strokeColor="white" />

          <div className="relative p-8 md:p-10 text-white">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#aacbda] to-[#8bb8d0] text-[#08213f] rounded-full text-sm font-bold uppercase tracking-wider shadow-lg">
                LABO & QUALITÉ
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              DES SOINS CONÇUS <br />
              <span className="text-[#aacbda]">AVEC EXIGENCE</span>
            </h2>

            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              De la sélection des matières premières au conditionnement,
              chaque étape est documentée et tracée.
            </p>

            {/* Liste des points clés */}
            <ul className="space-y-6">
              {[
                { icon: Icon.Flask, txt: "Formulation interne : stabilité & efficacité prouvées" },
                { icon: Icon.Shield, txt: "Conformité ISO 22716:2007 (BPF)" },
                { icon: Icon.Check, txt: "Contrôles microbiologiques & physico-chimiques" },
                { icon: Icon.Heart, txt: "Sans parabène, silicone ni sulfates" },
              ].map(({ icon: I, txt }, idx) => (
                <li key={idx} className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-12 h-12 rounded-full bg-[#aacbda]/20 flex items-center justify-center group-hover:bg-[#aacbda] group-hover:text-[#08213f] transition-all duration-300 shadow-lg">
                    <I className="w-6 h-6" />
                  </span>

                  <span className="text-white/90 group-hover:text-white transition-colors duration-300 pt-2 text-lg">
                    {txt}
                  </span>
                </li>
              ))}
            </ul>

            {/* Badge de certification */}
            <div className="mt-10 pt-6 border-t border-[#aacbda]/30">
              <div className="flex items-center gap-3 text-lg text-[#aacbda] font-medium">
                <Icon.Shield className="w-6 h-6" />
                <span>Certification ISO 22716:2007 • BPF</span>
              </div>
            </div>
          </div>
        </div>


        {/*image */}
        <div className="rounded-3xl overflow-hidden border border-[#aacbda]/20 shadow-2xl group bg-gray-100 min-h-[400px] flex items-center justify-center relative">
          <img
            src="images/avantages_2.png"
            alt="Laboratoire VNOVA"
            className="w-full h-full object-contain  group-hover:scale-105 transition-transform duration-700 bg-gradient-to-br from-[#08213f] to-[#1a4a6b] shadow-2xl"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              const placeholder = document.getElementById('image-placeholder');
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
          <div 
            id="image-placeholder"
            className="hidden items-center justify-center w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 absolute inset-0"
          >
            <div className="text-center p-8">
              <Icon.Flask className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Image du laboratoire</p>
              <p className="text-sm mt-2">VNOVA Cosmetics</p>
            </div>
          </div>
        </div>
      </section>


      <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#aacbda]/60 to-transparent" />


      {/* ===== MARQUES ===== */}
      <section>
        <SectionTitle
          titre="NOS MARQUES"
          sousTitre="Deux univers complémentaires, une seule exigence : l'excellence"
        />


        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "NOOR COSMETIQUES",
              subtitle: "L'Excellence Naturelle",
              description: "Une expérience sensorielle unique alliant patrimoine végétal tunisien et innovation cosmétique. Des soins d'exception pour le visage, les cheveux et le corps, enrichis en actifs naturels et huiles précieuses.",
              highlights: [
                "Extraits naturels tunisiens",
                "Huiles végétales précieuses",
                "Formules certifiées ISO 22716",
                "Texture et parfum d'exception"
              ],
              gradient: "from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
              borderColor: "border-[#aacbda]"
            },
            {
              title: "VNOVA PHARMA",
              subtitle: "Le Bien-être au Quotidien",
              description: "Des solutions complètes d'hygiène et de bien-être pour toute la famille. Une approche scientifique rigoureuse au service de votre santé et de votre confort quotidien.",
              highlights: [
                "Formules douces et sûres",
                "Adapté à tous les âges",
                "Qualité pharmaceutique",
                "Respect de la peau"
              ],
              gradient: "from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]",
              borderColor: "border-[#8bb8d0]"
            },
          ].map((m, i) => (
            <article
              key={i}
              className={`group relative rounded-3xl bg-gradient-to-br ${m.gradient} border-2 ${m.borderColor} shadow-xl
                   transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden`}
            >
              {/* Effet de brillance subtil */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <div className="relative p-8">
                {/* En-tête */}
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#08213f] tracking-wide uppercase leading-tight">
                    {m.title}
                  </h3>
                  <p className="text-lg text-[#1a4a6b] font-medium mt-2">{m.subtitle}</p>
                </div>


                {/* Description */}
                <p className="text-base md:text-lg text-[#08213f]/80 leading-relaxed mb-6 font-light">
                  {m.description}
                </p>


                {/* Points forts */}
                <div className="space-y-3">
                  {m.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Icon.Check className="w-4 h-4 text-[#aacbda] flex-shrink-0" />
                      <span className="text-[#08213f] font-medium">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>


      <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#aacbda]/60 to-transparent" />


      {/* ===== Certifications avec les badges SUR LA MÊME LIGNE ===== */}
      <section>
        <SectionTitle
          titre="CERTIFICATIONS"
          sousTitre="Nos engagements qualité et nos reconnaissances officielles"
        />
        <div className="flex justify-center mt-12">
          <ul className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16">
            {BADGES.map((b, i) => (
              <BadgeItem key={i} {...b} />
            ))}
          </ul>
        </div>
      </section>


      <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#aacbda]/60 to-transparent" />


      {/* ===== FAQ - Même style que le CTA ===== */}
      <section className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08213f] to-[#1a4a6b] shadow-2xl">
        <div className="relative px-8 md:px-16 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">
            {/* Titre principal */}
            <h2 className="text-4xl md:text-5xl font-semibold mb-8 leading-tight">
              QUESTIONS FRÉQUENTES
            </h2>

            {/* Description */}
            <p className="uppercase text-2xl text-white/90 mb-12 leading-relaxed">
              Trouvez rapidement des réponses à vos interrogations sur nos produits et services
            </p>

            {/* Questions avec flèches */}
            <div className="space-y-6 bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              {[
                {
                  q: "Vos produits conviennent-ils aux peaux sensibles ?",
                  a: "Oui. Nos formules sont sans parabène, silicone ni sulfates, et testées dermatologiquement."
                },
                {
                  q: "Les ingrédients sont-ils d'origine naturelle ?",
                  a: "Plus de 95% d'ingrédients d'origine naturelle. Nous privilégions des actifs locaux de haute qualité."
                },
                {
                  q: "Êtes-vous cruelty-free ?",
                  a: "Absolument. Nous ne testons pas sur les animaux et travaillons avec des partenaires partageant cet engagement."
                },
                {
                  q: "Où acheter vos produits ?",
                  a: "Via notre réseau de distribution et sur notre boutique en ligne. Veuillez contacter notre représentant indépendant pour connaître le point le plus proche."
                }
              ].map((item, index) => (
                <FAQItem
                  key={index}
                  q={item.q}
                  a={item.a}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      <div className="my-16 h-px bg-gradient-to-r from-transparent via-[#aacbda]/60 to-transparent" />


      {/* ===== CTA final - Version avec Image ===== */}
      <div className="mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08213f] to-[#1a4a6b] shadow-2xl">
        <div className="relative px-8 md:px-16 py-20 text-center text-white">
          <div className="max-w-4xl mx-auto">


            {/* Titre principal */}
            <h3 className="text-4xl md:text-5xl font-semibold mb-8 leading-tight">
              VOTRE BEAUTÉ, <br />
              <span className="text-[#aacbda]">NOTRE ENGAGEMENT</span>
            </h3>

            {/* Description */}
            <p className="text-2xl text-white/90 mb-12 leading-relaxed uppercase">
              Des soins d'exception nés de la rencontre entre le patrimoine végétal tunisien
              et l'expertise scientifique la plus pointue.
            </p>

            {/* CTA principal */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-4 px-12 py-5 rounded-full bg-gradient-to-r from-[#aacbda] to-[#8bb8d0] text-[#08213f] font-bold text-xl hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 transform"
              >
                <Icon.Spark className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500" />
                Créer mon rituel beauté
                <Icon.Leaf className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </Link>
            </div>

            {/* Appel secondaire */}
            <p className="mt-12 text-white/70 text-lg">
              Contactez-nous pour une consultation gratuite
            </p>
          </div>
        </div>
      </div>


      {/* keyframes for marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};


export default A_Propos;