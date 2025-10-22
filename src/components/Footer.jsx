import React from "react";
import { Link } from "react-router-dom";
import { BiSolidPhone } from "react-icons/bi";
import { MdOutlineMailOutline, MdLocationOn } from "react-icons/md";
import { GrFacebookOption, GrYoutube, GrInstagram } from "react-icons/gr";

const Footer = () => {
  return (
    <div className="bg-[#031E3B] text-white mt-8 relative isolate overflow-hidden">
      {/* badge SVG */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-y-0 right-8
          w-[55px] h-[96px] bg-[#9f1c21] z-10
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="60"
          height="89"
          viewBox="0 -3 56 84"
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/4 top-6"
        >
          <circle 
            cx="28" 
            cy="49" 
            r="18" 
            stroke="white" 
            strokeWidth="3" 
            fill="none" 
          />
          <path
            d="M10 70 Q 18 76 28 74 Q 38 72 46 78"
            stroke="white"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* bloc principal */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-5 lg:px-20 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center justify-items-center md:justify-items-start min-h-[100px] md:min-h-[120px]">
          <div className="w-full flex justify-center md:justify-start lg:self-center">
            <Link to="/" aria-label="Aller à l'accueil" className="inline-block">
              <img
                src="/images/logo-vn2.png"
                alt="VNOVA"
                className="h-12 sm:h-16 md:h-20 lg:h-20 w-auto max-w-[280px] sm:max-w-[380px] block"
              />
            </Link>
          </div>

          {/* Colonne 2 : INFORMATION */}
          <div className="w-full text-center md:text-left lg:self-start">
            <h2 className="font-semibold text-[14px] sm:text-[16px] text-white pb-2">
              INFORMATIONS
            </h2>
            <nav className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <Link to="a_propos" className="hover:text-white/80 transition-colors">
                A propos
              </Link>
              <Link to="contact" className="hover:text-white/80 transition-colors">
                Contactez-nous
              </Link>
            </nav>
          </div>

          {/* Colonne 3 : CONTACT  */}
          <div className="w-full text-center md:text-left lg:self-start">
            <h2 className="font-semibold text-[14px] sm:text-[16px] text-white pb-2 capitalize">
              CONTACT
            </h2>
            <nav className="flex flex-col gap-1 sm:gap-1.5 text-xs sm:text-sm">
              <span className="flex justify-center md:justify-start items-start">
                <MdLocationOn className="text-sm sm:text-lg mt-[1px] sm:mt-[2px] mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-left">Cité el Mallab Route Akouda</span>
              </span>
              <a
                href={
                  "mailto:helpdesk@vnova.net" +
                  "?subject=" +
                  encodeURIComponent("Demande d'information") +
                  "&body=" +
                  encodeURIComponent("Bonjour VNOVA,\n\n")
                }
                className="flex justify-center md:justify-start items-start hover:text-white/80 transition-colors"
              >
                <MdOutlineMailOutline className="text-sm sm:text-base mt-[1px] sm:mt-[2px] mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-left break-all">helpdesk@vnova.net</span>
              </a>
              <a
                href="tel:+21696355405"
                className="flex justify-center md:justify-start items-start hover:text-white/80 transition-colors"
              >
                <BiSolidPhone className="text-sm sm:text-base mt-[1px] sm:mt-[2px] mr-1 sm:mr-2 flex-shrink-0" />
                <span className="text-left">+216 96 355 405</span>
              </a>
            </nav>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="pt-6">
          <ul className="flex justify-center items-center gap-4">
            <li>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <GrFacebookOption className="text-base text-white/90" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <GrInstagram className="text-base text-white/90" />
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                <GrYoutube className="text-base text-white/90" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="text-center py-3 text-white/70 text-sm">© 2025 VNOVA</p>
      </div>
    </div>
  );
};

export default Footer;