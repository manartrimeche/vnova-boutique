/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API = (process.env.API_URL || "https://api.vnova.tn/api").replace(/\/+$/, "");
const HOST = API.replace(/\/api$/, ""); // sans /api
const isAbs = (u = "") => /^https?:\/\//i.test(u);

const normPath = (raw = "") => {
  if (!raw) return "";
  let p = String(raw).replace(/\\/g, "/");       
  if (!p.startsWith("/")) p = "/" + p;           
  return p;
};

const makeImgCandidates = (raw) => {
  const p = normPath(raw);
  return {
    primary: `${HOST}${p}`, // https://api.vnova.tn/...
    backup:  `${API}${p}`,  // https://api.vnova.tn/api/...
  };
};

const getId = (p, i) => p?._id || p?.id || String(i);
const getTitle = (p) => p?.nom || p?.libelle || p?.name || p?.title || "Produit";
const priceOf = (p) =>
  (p?.prix_TTC_catalogue && p?.prix_TTC_catalogue.$numberDecimal) ||
  p?.prix || p?.price || "";

const PHARMA_KEYS = ["PHARMA","Pharma","NOOR PHARMA","Noor Pharma","PARAPHARMACIE","Parapharmacie","PARAPHARMA","Parapharma"];


async function postForm(url, payload) {
  const body = new URLSearchParams(payload);
  const res = await axios.post(url, body, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  return res?.data;
}

/* Récupère des produits Pharma via /filterproduit */
async function fetchPharmaProducts() {
  const urlCandidates = [`${API}/filterproduit`, `${API}/filterproduit/`];
  for (const lib of PHARMA_KEYS) {
    for (const url of urlCandidates) {
      try {
        const data = await postForm(url, { libelle: lib });
        const arr = data?.result || [];
        if (Array.isArray(arr) && arr.length) return arr;
      } catch {}
    }
  }
  return [];
}

export default function ProduitSpecial() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const pharma = await fetchPharmaProducts();
        let picked = Array.isArray(pharma) ? pharma.slice(0, 4) : [];
        if (picked.length < 4) {
          try {
            const urlCandidates = [`${API}/produit`, `${API}/produit/`];
            let all = [];
            for (const u of urlCandidates) {
              try {
                const r = await axios.get(u);
                const d = r?.data?.result ?? r?.data ?? [];
                if (Array.isArray(d) && d.length) { all = d; break; }
              } catch {}
            }
            if (Array.isArray(all) && all.length) {
              const seen = new Set(picked.map(p => String(p?._id || p?.id)));
              for (const p of all) {
                const id = String(p?._id || p?.id || "");
                if (!id || seen.has(id)) continue;
                picked.push(p);
                seen.add(id);
                if (picked.length >= 4) break;
              }
            }
          } catch {}
        }
        setItems(picked.slice(0, 4));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = useMemo(() => {
    return (items || []).slice(0, 4).map((p, i) => {
      const rawImg = p?.photo || p?.image || p?.imgUrl || p?.imageUrl || "";
      const { primary, backup } = makeImgCandidates(rawImg);
      return {
        id: getId(p, i),
        title: getTitle(p),
        price: priceOf(p) ? `${priceOf(p)} dt` : "",
        imgPrimary: primary,
        imgBackup: backup,
        raw: p,
      };
    });
  }, [items]);

  const cardsToShow = useMemo(() => {
    if (cards.length >= 4) return cards.slice(0, 4);
    const fillers = Array.from({ length: 4 - cards.length }).map((_, i) => ({
      id: `placeholder-${i}`,
      title: "",
      price: "",
      imgPrimary: "",
      imgBackup: "",
      raw: null,
      isPlaceholder: true,
    }));
    return [...cards, ...fillers];
  }, [cards]);

  return (
    <section className="w-full mx-auto px-5 lg:px-10 py-10">
      <div className="text-center mb-8">
        <h2 className="text-[30px] md:text-[36px] font-extrabold tracking-wider text-[#0b2a3b]">
          NOS PRODUITS
        </h2>
        <p className="text-[18px] md:text-[22px] tracking-wide text-[#0b2a3b]/70 -mt-1">PHARMA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
        <div className="rounded-2xl bg-gradient-to-b from-[#e9f2f6] to-white p-8 flex items-center">
          <div className="text-[#0b2a3b] text-2xl md:text-3xl font-extrabold leading-tight">
            VOTRE ALLIÉ<br/>QUOTIDIEN CONTRE<br/>LA DOULEUR<br />&nbsp;L’INCONFORT.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            [0,1,2,3].map((i) => (
              <div key={i} className="animate-pulse border rounded-xl p-3">
                <div className="aspect-square bg-slate-100" />
                <div className="h-4 bg-slate-100 rounded mt-3 w-3/4" />
                <div className="h-4 bg-slate-100 rounded mt-2 w-1/3" />
                <div className="h-9 bg-slate-100 rounded mt-3" />
              </div>
            ))
          ) : cardsToShow.length ? (
            cardsToShow.map((c) => (
              <article key={c.id} className="border rounded-xl overflow-hidden bg-white">
                <div className="aspect-square bg-gray-50">
                  {c.isPlaceholder ? (
                    <div className="w-full h-full grid place-items-center text-gray-300 text-sm">&nbsp;</div>
                  ) : (
                    <img
                      src={c.imgPrimary}
                      alt={c.title}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const triedBackup = e.currentTarget.dataset.triedBackup === "1";
                        if (!triedBackup) {
                          e.currentTarget.dataset.triedBackup = "1";
                          e.currentTarget.src = c.imgBackup;
                        } else {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.innerHTML =
                              '<div class="w-full h-full grid place-items-center text-gray-400 text-sm">Image indisponible</div>';
                          }
                        }
                      }}
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="text-[#0b2a3b] font-semibold leading-snug min-h-[2.5rem]">{c.title}</div>
                  <div className="mt-1 text-sm text-gray-600">{c.price}</div>
                  {!c.isPlaceholder && (
                    <div className="mt-3 flex justify-between items-center">
                      <Link
                        to="/product_details"
                        state={{ item: c.raw }}
                        className="text-[12px] font-bold tracking-wider underline underline-offset-4"
                      >
                        VOIR TOUT
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 text-center text-[#0b2a3b]/70">Aucun produit PHARMA trouvé.</div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(`/categorie?libelle=${encodeURIComponent("Pharma")}`)}
          className="px-5 py-2 rounded-full border border-[#0b2a3b] hover:bg-[#0b2a3b] hover:text-white text-[#0b2a3b] font-extrabold tracking-wider text-[13px]"
        >
          VOIR TOUTE LA CATÉGORIE
        </button>
      </div>
    </section>
  );
}
