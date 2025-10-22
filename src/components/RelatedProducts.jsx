/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { IoCartOutline } from "react-icons/io5";

/* ---- API base ---- */
const API = (
  process.env.API_URL ||
  (import.meta?.env && import.meta.env.VITE_API_URL) ||
  "https://api.vnova.tn/api"
).replace(/\/+$/, "");
const ORIGIN = API.replace(/\/api$/, "");

/* ---- images ---- */
const buildImg = (raw) => {
  const v =
    raw?.photo ||
    raw?.image ||
    raw?.img ||
    (Array.isArray(raw?.images) ? raw.images[0] : "") ||
    raw?.url_image ||
    "";
  if (!v) return "/images/placeholder.svg";
  if (/^https?:\/\//i.test(v)) return v;
  const path = v.startsWith("/") ? v : `/${v}`;
  return `${API}${path}`;
};
const onImgError = (e) => {
  try {
    const u = new URL(e.currentTarget.src);
    if (u.pathname.startsWith("/api/")) {
      e.currentTarget.src = `${ORIGIN}${u.pathname.replace(/^\/api/, "")}`;
      return;
    }
  } catch { }
  e.currentTarget.src = "/images/placeholder.svg";
};

/* ---- utils ---- */
const strip = (s = "") =>
  String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const tokenize = (s = "") =>
  strip(s)
    .split(/[\s\-_/.,;:()]+/)
    .filter(
      (t) =>
        t &&
        t.length > 2 &&
        !["pour", "avec", "les", "des", "aux", "nos", "votre", "and", "the", "du", "de", "la", "le", "et"].includes(t)
    );

export default function RelatedProducts({ libelle, currentId, seedName = "", limit = 6 }) {
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qtyById, setQtyById] = useState({});

  const catLabel = useMemo(() => {
    if (!libelle) return "";
    return typeof libelle === "string" ? libelle : libelle?.libelle || libelle?.name || "";
  }, [libelle]);

  const catKey = strip(catLabel);
  const nameTok = useMemo(() => tokenize(seedName), [seedName]);

  const refreshQuantitiesFromStorage = () => {
    try {
      const list = JSON.parse(localStorage.getItem("products")) || [];
      const map = {};
      list.forEach((p) => (map[p._id] = p.quantity || 1));
      setQtyById(map);
    } catch {
      setQtyById({});
    }
  };

  useEffect(() => {
    refreshQuantitiesFromStorage();
    const onUpdated = () => refreshQuantitiesFromStorage();
    window.addEventListener("cart:updated", onUpdated);
    return () => window.removeEventListener("cart:updated", onUpdated);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      let list = [];

      for (const u of [`${API}/produit`, `${API}/produit/`]) {
        try {
          const r = await axios.get(u);
          const d = r?.data;
          const arr = Array.isArray(d?.result) ? d.result : (Array.isArray(d) ? d : []);
          if (arr?.length) { list = arr; break; }
        } catch { }
      }

      if (!list.length) {
        try {
          const cached = sessionStorage.getItem("vnova:last-grid");
          const arr = JSON.parse(cached || "[]");
          if (Array.isArray(arr) && arr.length) list = arr;
        } catch { }
      }

      if (!mounted) return;

      list = Array.isArray(list) ? list.filter(p => String(p?._id) !== String(currentId)) : [];

      setPool(list);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [currentId]);

  // Add to cart function
  const adjustCart = (product, delta) => {
    const list = JSON.parse(localStorage.getItem("products")) || [];
    const idx = list.findIndex((x) => x._id === product._id);

    const buildRow = (p, q) => ({
      photo: p.photo,
      quantity: q,
      _id: p._id,
      nom: p.nom,
      reference: p.reference,
      point_unitaire: p.point_Produit,
      point_Quantite: (p.point_Produit || 0) * q,
      prix_HT_Unitaire: p?.prix_HT?.$numberDecimal,
      prix_HT_Quantite: (parseFloat(p?.prix_HT?.$numberDecimal) || 0) * q,
      tva: p?.tva?.valeur,
      somme_tva_Unitaire: p?.somme_tva_catalogue?.$numberDecimal,
      somme_tva_Quantite: (parseFloat(p?.somme_tva_catalogue?.$numberDecimal) || 0) * q,
      prix_Unitaire: p?.prix_TTC_catalogue?.$numberDecimal,
      prix_Quantite: (parseFloat(p?.prix_TTC_catalogue?.$numberDecimal) || 0) * q,
      total: parseFloat(p?.prix_TTC_catalogue?.$numberDecimal || 0) * q,
    });

    if (idx === -1 && delta > 0) {
      list.push(buildRow(product, 1));
    } else if (idx !== -1) {
      const nextQ = (list[idx].quantity || 1) + delta;
      if (nextQ <= 0) list.splice(idx, 1);
      else list[idx] = buildRow(product, nextQ);
    }

    localStorage.setItem("products", JSON.stringify(list));
    window.dispatchEvent(new Event("cart:updated"));
    refreshQuantitiesFromStorage();
  };

  const addToCart = (product) => adjustCart(product, +1);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white rounded-xl shadow-md p-4">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!pool.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Aucun produit disponible</p>
      </div>
    );
  }

  let candidates = pool;
  if (catKey) {
    const catTok = tokenize(catLabel);
    candidates = pool.filter((p) => {
      const name = strip(p?.nom || p?.libelle || "");
      const desc = strip(p?.description || "");
      const cat = strip(p?.categorie?.libelle || p?.gamme || p?.collection || p?.categorie || "");
      return (
        name.includes(catKey) ||
        desc.includes(catKey) ||
        cat.includes(catKey) ||
        catTok.some((t) => t && (name.includes(t) || desc.includes(t) || cat.includes(t)))
      );
    });
    if (!candidates.length) candidates = pool;
  }

  const scored = candidates.map((p) => {
    const name = strip(p?.nom || p?.libelle || "");
    const desc = strip(p?.description || "");
    const cat = strip(p?.categorie?.libelle || p?.gamme || p?.collection || p?.categorie || "");
    let score = 0;

    if (catKey && (cat.includes(catKey) || name.includes(catKey) || desc.includes(catKey))) score += 2;
    score += nameTok.reduce((acc, t) => acc + (name.includes(t) || desc.includes(t) ? 1 : 0), 0);
    if (nameTok.length && name.startsWith(nameTok[0])) score += 1;
    score += Number(p?.point_Produit || 0) / 1000;

    return { p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const final = scored.map(x => x.p).slice(0, limit);

  const toShow =
    final.length ? final : [...pool].sort((a, b) => (b?.point_Produit || 0) - (a?.point_Produit || 0)).slice(0, limit);

  if (!toShow.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <p className="text-gray-500">Aucun produit similaire trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
      {toShow.map((item, i) => {
        const src = buildImg(item);
        const title = item?.nom || "Produit";
        const price = parseFloat(item?.prix_TTC_catalogue?.$numberDecimal || 0);
        const qty = qtyById[item?._id] || 0;

        return (
          <div
            key={(item?._id || i) + "-rel"}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          >
            {/* Image  */}
            <Link to="/product_details" state={{ item }}>
              <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white overflow-hidden">
                <img
                  src={src}
                  alt={title}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={onImgError}
                />
              </div>
            </Link>

            {/* Content */}
            <div className="p-4">
              <Link to="/product_details" state={{ item }}>
                <h3 className="font-semibold text-gray-900 text-sm min-h-[2.5rem] line-clamp-2 mb-3 hover:text-[#aacbda] transition-colors">
                  {title}
                </h3>
              </Link>

              <div className="flex items-center justify-between">
                <span className="text-[#aacbda] font-bold text-base">
                  {price.toFixed(3)} DT
                </span>

                {qty <= 0 ? (
                  <button
                    className="p-2 bg-[#aacbda] hover:bg-[#8ab4c9] text-white rounded-lg transition-all"
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(item);
                    }}
                    title="Ajouter au panier"
                  >
                    <IoCartOutline className="text-lg" />
                  </button>
                ) : (
                  <div className="flex items-center bg-[#aacbda] text-white rounded-lg px-2 py-1.5 gap-2">
                    <button
                      className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded transition-colors text-sm font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        adjustCart(item, -1);
                      }}
                    >
                      –
                    </button>
                    <span className="min-w-[16px] text-center text-xs font-semibold">{qty}</span>
                    <button
                      className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded transition-colors text-sm font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        adjustCart(item, +1);
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
