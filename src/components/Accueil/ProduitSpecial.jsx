/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const VITE = typeof import.meta !== "undefined" ? import.meta.env : {};
const API_URL = (VITE?.VITE_API_URL || process.env.API_URL || "https://api.vnova.tn/api").replace(/\/+$/, "");
const API_ORIGIN = API_URL.replace(/\/api$/, "");
const isAbs = (u = "") => /^https?:\/\//i.test(u);

const makeImgCandidates = (raw = "") => {
  if (!raw) return { primary: "", backup: "" };
  if (isAbs(raw)) return { primary: raw, backup: raw };
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return { primary: `${API_ORIGIN}${path}`, backup: `${API_URL}${path}` };
};

const getId = (p, i) => p?._id || p?.id || String(i);
const getTitle = (p) => p?.nom || p?.libelle || p?.name || p?.title || "Produit";
const priceRaw = (p) =>
  (p?.prix_TTC_catalogue && p?.prix_TTC_catalogue.$numberDecimal) ||
  p?.prix || p?.price || "";

const toPrice = (v) => {
  if (v == null || v === "") return "";
  const n = Number(String(v).toString().replace(",", "."));
  return isFinite(n) ? `${n.toFixed(3)} dt` : "";
};

const stripIDs = (text, product, index) => {
  let s = String(text || "");
  if (!s) return "";
  const internalId = String(getId(product, index) || "");
  if (internalId && s.includes(internalId)) s = s.split(internalId).join("");
  s = s.replace(/\b[0-9a-f]{24}\b/gi, "");
  s = s.replace(/\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/gi, "");
  s = s.replace(/\b(id|ref|sku|code|cod)\s*[:#-]?\s*[A-Za-z0-9._-]+\b/gi, "");
  s = s.replace(/\b\d{6,}\b/g, "");
  s = s.replace(/^[\s\-:|;/.,]+|[\s\-:|;/.,]+$/g, "");
  s = s.replace(/\s{2,}/g, " ").trim();
  return s;
};

const PHARMA_KEYS = ["PHARMA", "Pharma", "NOOR PHARMA", "Noor Pharma", "PARAPHARMACIE", "Parapharmacie", "PARAPHARMA", "Parapharma"];

async function postForm(url, payload) {
  const body = new URLSearchParams(payload);
  const res = await axios.post(url, body, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  return res?.data;
}

async function fetchPharmaProducts() {
  const urlCandidates = [`${API_URL}/filterproduit`, `${API_URL}/filterproduit/`];
  for (const lib of PHARMA_KEYS) {
    for (const url of urlCandidates) {
      try {
        const data = await postForm(url, { libelle: lib });
        const arr = data?.result || [];
        if (Array.isArray(arr) && arr.length) return arr;
      } catch { }
    }
  }
  return [];
}

export default function ProduitSpecial() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetchPharmaProducts();
        setItems(Array.isArray(res) ? res : []);
      } catch (e) {
        setErr("Impossible de récupérer les produits pour le moment.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = useMemo(() => {
    return (items || []).slice(0, 3).map((p, i) => {
      const rawImg = p?.photo || p?.image || p?.imgUrl || p?.imageUrl || "";
      const { primary, backup } = makeImgCandidates(rawImg);
      const subRaw = p?.sousLibelle || p?.type || p?.categorie || p?.gamme || p?.collection || p?.description || "";
      const sub = stripIDs(subRaw, p, i);
      return {
        idx: i, title: getTitle(p), sub,
        price: toPrice(priceRaw(p)), primary, backup, raw: p,
      };
    });
  }, [items]);

  return (
    <section className="max-w-screen-2xl mx-auto px-5 lg:px-10 py-8">
      {/* Header */}
      <div className="text-center -mb-0">
        <h2 className="text-[26px] md:text-[36px] mt-5 leading-[1.05] font-semibold uppercase tracking-[0.02em] text-[#0b2a3b]">
          NOS PRODUITS
        </h2>
        <p className="mt-4 text-[16px] md:text-[22px] leading-[1] font-normal uppercase tracking-[0.30em] text-[#0b2a3b]/80">
          PHARMA
        </p>
      </div>

      <div className="grid grid-cols-1 mt-3 lg:grid-cols-[1fr_2fr] gap-5 items-stretch">
        {/* Bloc texte*/}
        <div className="rounded-2xl bg-white p-7 flex items-center justify-center">
          <div className="text-left lg:text-center">
            <div className="text-[#0b2a3b] text-2xl md:text-3xl font-light leading-[1.1]">
          
              <div className="hidden lg:block">
                VOTRE ALLIÉ
                <br />
                QUOTIDIEN CONTRE
                <br />
                <span className="font-bold">LA DOULEUR</span>
                <br />
                <span className="font-light">&</span>
                <span className="font-bold"> L'INCONFORT.</span>
              </div>

              <div className="block lg:hidden text-center leading-[1.1]">
                VOTRE ALLIÉ
                <br />
                QUOTIDIEN CONTRE
                <br />
                <span className="font-bold">LA DOULEUR</span>{" "}
                <span className="font-light">&</span>
                <span className="font-bold"> L'INCONFORT.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i} className="p-2">
                <div className="animate-pulse">
                  <div className="aspect-square bg-slate-100 rounded-md" />
                  <div className="h-4 bg-slate-100 rounded mt-2.5 w-3/4" />
                  <div className="h-4 bg-slate-100 rounded mt-1.5 w-1/3" />
                  <div className="h-6 bg-slate-100 rounded mt-3.5" />
                </div>
              </div>
            ))
          ) : err ? (
            <div className="col-span-3 text-center text-rose-600">{err}</div>
          ) : cards.length ? (
            cards.map((c, idx) => (
              <article key={idx} className="overflow-hidden bg-white">
                <div className="bg-gradient-to-b from-gray-200/60 via-gray-100 to-white">
                  <div className="relative w-full aspect-square overflow-hidden grid place-items-center min-w-0 min-h-0">
                    {c.primary ? (
                      <img
                        src={c.primary}
                        alt={c.title}
                        className="block w-full h-full object-contain object-center bg-gray-50"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          try {
                            const el = e.currentTarget;
                            const tried = el.getAttribute('data-tried-backup') === '1';
                            if (!tried && c.backup && c.backup !== c.primary) {
                              el.setAttribute('data-tried-backup', '1');
                              el.src = c.backup;
                            } else {
                              el.src = '/images/placeholder.png';
                            }
                          } catch (err) {
                            e.currentTarget.src = '/images/placeholder.png';
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-gray-400 text-sm">
                        Image indisponible
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-[12px] font-semibold text-[#0b2a3b] leading-tight uppercase truncate">
                        {c.title}
                      </h3>
                      {c.sub && c.sub.toLowerCase() !== c.title.toLowerCase() ? (
                        <p className="mt-[1px] text-[10px] tracking-wide text-black/50 uppercase truncate">
                          {c.sub}
                        </p>
                      ) : null}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] md:text-[12px] font-extrabold text-black leading-none">
                        {c.price || "00.000 dt"}
                      </div>
                      <Link
                        to="/product_details"
                        state={{ item: c.raw }}
                        className="mt-1 inline-block text-[11px] font-bold tracking-wider underline underline-offset-4"
                      >
                        VOIR TOUT
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 text-center text-[#0b2a3b]/70">
              Aucun produit PHARMA trouvé.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
