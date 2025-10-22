/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useEffect, useMemo, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";


/** --------------------------- CONFIG API --------------------------- */
const VITE = typeof import.meta !== "undefined" ? import.meta.env : {};
const API_URL = (VITE?.VITE_API_URL || process.env.API_URL || "https://api.vnova.tn/api").replace(/\/+$/, "");
const API_ORIGIN = API_URL.replace(/\/api$/, "");


/** --------------------------- HELPERS --------------------------- */
const isAbs = (u = "") => /^https?:\/\//i.test(u);
const makeImgCandidates = (raw = "") => {
  if (!raw) return { primary: "", backup: "" };
  if (isAbs(raw)) return { primary: raw, backup: raw };
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return { primary: `${API_ORIGIN}${path}`, backup: `${API_URL}${path}` };
};


const getId = (p, i) => p?._id || p?.id || String(i);
const getTitle = (p) => p?.libelle || p?.nom || p?.name || "Produit";
const getImage = (p) => p?.image || p?.photo || p?.imgUrl || p?.imageUrl || "";


const rawPrice = (p) =>
  (p?.prix_TTC_catalogue && p?.prix_TTC_catalogue.$numberDecimal) ||
  p?.prix || p?.price || null;


const toPrice = (v) => {
  if (v == null || v === "") return "";
  const n = Number(String(v).replace(",", "."));
  return isFinite(n) ? `${n.toFixed(3)} dt` : "";
};


const FILTER_URLS = [`${API_URL}/filterproduit`, `${API_URL}/filterproduit/`];
const ALL_URLS = [`${API_URL}/produit`, `${API_URL}/produit/`];


const postFormFirst = async (urls, payload, cancelToken) => {
  const body = new URLSearchParams(payload);
  for (const url of urls) {
    try {
      const r = await axios.post(url, body, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        cancelToken,
      });
      const data = r?.data?.result ?? r?.data ?? null;
      if ((Array.isArray(data) && data.length) || (!Array.isArray(data) && data)) return data;
    } catch (e) { if (axios.isCancel(e)) throw e; }
  }
  return null;
};


const getFirstGET = async (urls, cancelToken) => {
  for (const url of urls) {
    try {
      const r = await axios.get(url, { cancelToken });
      const data = r?.data?.result ?? r?.data ?? [];
      if ((Array.isArray(data) && data.length) || (!Array.isArray(data) && data)) return data;
    } catch (e) { if (axios.isCancel(e)) throw e; }
  }
  return [];
};


const libelleCandidates = (filtreLibelle = "NOOR") => {
  const base = String(filtreLibelle || "").trim();
  const U = base.toUpperCase();
  if (!base) return ["NOOR", "NOOR CAPILLAIRE", "NOOR VISAGE ET CORPS", "NOOR CORPS", "NOOR VISAGE"];
  if (U.includes("PHARMA")) return ["Pharma", "PHARMA", "NOOR PHARMA", "Parapharmacie", "PARAPHARMACIE", "Parapharma", "PARAPHARMA"];
  if (U.includes("CAPILLAIRE")) return ["NOOR CAPILLAIRE", "CAPILLAIRE", "NOOR"];
  if (U.includes("VISAGE") || "CORPS") return ["NOOR VISAGE ET CORPS", "NOOR VISAGE", "NOOR CORPS", "NOOR"];
  return [base, "NOOR CAPILLAIRE", "NOOR VISAGE ET CORPS", "NOOR CORPS", "NOOR VISAGE", "NOOR"];
};


const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


/** ============================ COMPONENT ============================ */
const Nos_Produits = ({
  titre = "NOS PRODUITS COSMÉTIQUES",
  sousTitre = "GAMME NOOR",
  filtreLibelle = "NOOR",
  limit = 5,
  featuredIds = [],
  featuredLibelles = [],
  showOnlyFeatured = false,
}) => {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [extraPool, setExtraPool] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageStart, setPageStart] = useState(0);
  const mounted = useRef(true);

  const displayLimit = useMemo(() => {
    return window.innerWidth < 768 ? 2 : limit;
  }, [limit]);


  useEffect(() => {
    mounted.current = true;
    const src = axios.CancelToken.source();


    const fetchData = async () => {
      setLoading(true);
      try {
        let filteredArr = [];
        const libs = libelleCandidates(filtreLibelle);
        for (const L of libs) {
          const res = await postFormFirst(FILTER_URLS, { libelle: L }, src.token);
          if (Array.isArray(res) && res.length) { filteredArr = res; break; }
        }


        const allArr = await getFirstGET(ALL_URLS, src.token);
        if (!filteredArr.length && Array.isArray(allArr) && allArr.length) {
          const term = (filtreLibelle || "").toLowerCase();
          filteredArr = allArr.filter((p) => {
            const name = (p.libelle || p.nom || p.name || "").toLowerCase();
            const gamme = (p.gamme || p.collection || p.categorie || "").toLowerCase();
            const desc = (p.description || "").toLowerCase();
            return term ? name.includes(term) || gamme.includes(term) || desc.includes(term) : !!name;
          });
        }


        const libsExtra = ["NOOR CAPILLAIRE", "NOOR VISAGE ET CORPS"];
        const extra = [];
        for (const L of libsExtra) {
          const r = await postFormFirst(FILTER_URLS, { libelle: L }, src.token);
          if (Array.isArray(r) && r.length) extra.push(...r);
        }


        if (mounted.current) {
          setAll(Array.isArray(allArr) ? allArr : []);
          setFiltered(Array.isArray(filteredArr) ? filteredArr : []);
          setExtraPool(shuffle(extra));
          setPageStart(0);
        }
      } catch (e) {
        if (axios.isCancel(e)) return;
        if (mounted.current) { setAll([]); setFiltered([]); setExtraPool([]); }
      } finally {
        if (mounted.current) setLoading(false);
      }
    };


    fetchData();
    return () => { mounted.current = false; src.cancel("Nos_Produits unmounted"); };
  }, [filtreLibelle, JSON.stringify(featuredIds), JSON.stringify(featuredLibelles)]);


  const featured = useMemo(() => {
    if ((!featuredIds || !featuredIds.length) && (!featuredLibelles || !featuredLibelles.length)) return [];
    const idSet = new Set((featuredIds || []).map(String));
    const nameSet = new Set((featuredLibelles || []).map((s) => (s || "").toLowerCase().trim()));
    const picked = []; const seen = new Set();
    all.forEach((p, i) => {
      const id = String(getId(p, i));
      const name = getTitle(p).toLowerCase().trim();
      if (idSet.has(id) || nameSet.has(name)) { if (!seen.has(id)) { picked.push(p); seen.add(id); } }
    });
    return picked;
  }, [all, featuredIds, featuredLibelles]);


  const fullPool = useMemo(() => {
    const baseList = showOnlyFeatured
      ? featured
      : [...featured, ...filtered.filter((p, i) => !featured.some((f, j) => String(getId(f, j)) === String(getId(p, i))))];
    const combined = [...baseList, ...extraPool];
    const seen = new Set();
    const unique = [];
    combined.forEach((p, i) => {
      const id = String(getId(p, i));
      if (!seen.has(id)) { seen.add(id); unique.push(p); }
    });
    return shuffle(unique);
  }, [featured, filtered, extraPool, showOnlyFeatured]);


  const pageProducts = useMemo(() => {
    if (!fullPool.length) return [];
    const end = pageStart + displayLimit;
    if (end <= fullPool.length) return fullPool.slice(pageStart, end);
    const first = fullPool.slice(pageStart);
    const missing = end - fullPool.length;
    return [...first, ...fullPool.slice(0, Math.min(missing, fullPool.length))];
  }, [fullPool, pageStart, displayLimit]);


  const nextPage = () => fullPool.length && setPageStart((s) => (s + displayLimit) % fullPool.length);
  const prevPage = () => fullPool.length && setPageStart((s) => (s - displayLimit + fullPool.length) % fullPool.length);


  return (
    <section className="w-full mx-auto px-5 lg:px-10 py-6 relative">
      {/* --- HEADER  --- */}
      <div className="text-center mb-8">
        <div className="text-[10px] md:text-[12px] uppercase font-normal tracking-[0.6em] text-[#0b2a3b]/60">
          DéCOUVRIR
        </div>
        <h2 className="text-[26px] md:text-[36px] leading-[1.1] font-semibold uppercase tracking-[0.02em] text-[#0b2a3b]">
          {titre}
        </h2>
        {sousTitre && (
          <p className="mt-1 md:mt-1.5 text-[16px] md:text-[22px] leading-[1.1] font-normal uppercase tracking-[0.30em] text-[#0b2a3b]/80">
            {sousTitre}
          </p>
        )}
      </div>


      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {Array.from({ length: displayLimit }).map((_, i) => (
            <div key={i} className="animate-pulse p-2.5">
              <div className="aspect-[4/3] bg-slate-100" />
              <div className="h-3 bg-slate-100 rounded mt-2 w-3/4" />
              <div className="h-3 bg-slate-100 rounded mt-2 w-1/3" />
            </div>
          ))}
        </div>
      ) : pageProducts.length === 0 ? (
        <div className="text-center py-8 bg-white">
          <p className="text-[#0b2a3b] font-medium">Aucun produit trouvé.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {pageProducts.map((p, i) => {
            const id = getId(p, i);
            const title = getTitle(p);
            const { primary, backup } = makeImgCandidates(getImage(p));
            const price = toPrice(rawPrice(p));
            const isFirst = i === 0;
            const isLast = i === pageProducts.length - 1;
            const showPager = fullPool.length > displayLimit;


            return (
              <article key={id} className="overflow-hidden bg-white">
                <div className="bg-gradient-to-b from-gray-200/60 via-gray-100 to-white">
                  <div className="relative w-full aspect-square overflow-hidden grid place-items-center">
                    {primary ? (
                      <img
                        src={primary}
                        alt={title}
                        className="h-full w-full object-contain"
                        loading="eager"
                        onError={(e) => {
                          const tried = e.currentTarget.dataset.triedBackup === "1";
                          if (!tried && backup && backup !== primary) {
                            e.currentTarget.dataset.triedBackup = "1";
                            e.currentTarget.src = backup;
                          } else {
                            e.currentTarget.src = "/images/placeholder.svg";
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
                        Image indisponible
                      </div>
                    )}


                    {showPager && isFirst && pageStart !== 0 && (
                      <button
                        aria-label="Précédent"
                        onClick={prevPage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-0 bg-transparent opacity-90 hover:opacity-100"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 md:w-10 md:h-10">
                          <path d="M16 4 L8 12 L16 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                    {showPager && isLast && (
                      <button
                        aria-label="Suivant"
                        onClick={nextPage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0 bg-transparent opacity-90 hover:opacity-100"
                      >
                        <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 md:w-10 md:h-10">
                          <path d="M8 4 L16 12 L8 20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>


                {/* CONTENU — gauche = titre, droite = prix/lien */}
                <div className="bg-white px-3 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[12px] font-semibold text-[#0b2a3b] leading-tight uppercase truncate">
                        {title}
                      </h3>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[14px] md:text-[16px] font-extrabold text-black leading-none">
                        {price || "00dt"}
                      </div>
                      <Link
                        to="/product_details"
                        state={{ item: p }}
                        className="mt-1 inline-block text-[11px] font-bold tracking-wider underline underline-offset-4"
                      >
                        VOIR TOUT
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};


export default Nos_Produits;