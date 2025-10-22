/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

/* -- BADGE COMPOSANT -- */
const Badge = ({ className = "", svgClassName = "", barColor = "#0080bc", strokeColor = "white" }) => {
  return (
    <div
      className={`
        pointer-events-none
        w-[50px] h-[90px] z-10
        ${className}
      `}
      style={{ backgroundColor: barColor }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60"
        height="89"
        viewBox="0 -3 56 84"
        className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-10 ${svgClassName}`}
      >
        <circle cx="28" cy="49" r="18" stroke={strokeColor} strokeWidth="3" fill="none" />
        <path d="M10 70 Q 18 76 28 74 Q 38 72 46 78" stroke={strokeColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default function CoinBonPlan({
  title = "COIN BON PLAN",
  kicker = "",
  headline = "SUN PROTECTION",
  subline = "ÉCRAN SOLAIRE MINÉRAL",
  tag = "50+ SPF",
  discount = "-20%",
  ctaText = "DÉCOUVREZ",
  ctaLibelle = "PHARMA",
  bgImage = "/images/bonplan-bg.png",
  productSearch = "",
}) {
  const navigate = useNavigate();

  const [apiImg, setApiImg] = useState("");
  useEffect(() => {
    let cancel = false;
    (async () => {
      if (!productSearch) return;
      try {
        const url = `${(process.env.API_URL || "").replace(/\/+$/, "")}/produit/search?q=${encodeURIComponent(productSearch)}`;
        const r = await axios.get(url);
        const arr = r?.data?.result || r?.data || [];
        const first = Array.isArray(arr) ? arr[0] : null;
        const raw = first?.photo || first?.image || first?.imgUrl || first?.imageUrl || "";
        if (!cancel && raw) {
          const isAbs = /^https?:\/\//i.test(raw) || raw?.startsWith("/");
          const full = isAbs ? raw : `${process.env.API_URL}${raw}`;
          setApiImg(full);
        }
      } catch {
    
      }
    })();
    return () => { cancel = true; };
  }, [productSearch]);

  const onCTA = () => navigate(`/categorie?libelle=${encodeURIComponent(ctaLibelle)}`);

  return (
    <section className="hidden w-full mx-auto px-5 lg:px-auto pt-5 pb-10">
    </section>
  );
}
