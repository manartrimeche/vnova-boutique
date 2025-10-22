/* eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  IoClose,
  IoFilter,
  IoChevronDown,
  IoChevronUp,
  IoArrowUp,
  IoArrowDown
} from "react-icons/io5";

/* -------------------- helpers URL / API -------------------- */
function getStateFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const libelle = urlParams.get("libelle");
  return { libelle };
}
const API = (process.env.API_URL || "https://api.vnova.tn/api").replace(/\/+$/, "");
const API_ORIGIN = API.replace(/\/api$/, "");

const normalizeLibelle = (input) => {
  const raw = String(input || "").trim();
  const up = raw.toUpperCase();
  if (up.includes("PHARMA")) return "Pharma";
  if (up.includes("CAPILLAIRE")) return "NOOR CAPILLAIRE";
  if (up.includes("CORPS") || up.includes("VISAGE")) return "NOOR VISAGE ET CORPS";
  return raw || "NOOR VISAGE ET CORPS";
};

const saveGridToSession = (arr) => {
  try {
    sessionStorage.setItem("vnova:last-grid", JSON.stringify(Array.isArray(arr) ? arr : []));
  } catch { }
};

/* ---------- Image helpers */
const isAbs = (u = "") => /^https?:\/\//i.test(u) || u.startsWith("//");

const normPath = (raw = "") => {
  if (!raw) return "";
  let p = String(raw).trim().replace(/\\/g, "/");
  if (!p.startsWith("/")) p = "/" + p;
  p = p.replace(/^\/api\//i, "/");
  return encodeURI(p);
};

const makeImgCandidates = (raw) => {
  let imageUrl = "";
  
  if (raw?.photo) imageUrl = raw.photo;
  else if (raw?.image) imageUrl = raw.image;
  else if (raw?.img) imageUrl = raw.img;
  else if (raw?.url_image) imageUrl = raw.url_image;
  
  else if (Array.isArray(raw?.images) && raw.images.length > 0) {
    const firstImage = raw.images[0];
    if (typeof firstImage === "string") {
      imageUrl = firstImage;
    } else if (firstImage?.url) {
      imageUrl = firstImage.url;
    } else if (firstImage?.secure_url) {
      imageUrl = firstImage.secure_url;
    } else if (firstImage?.path) {
      imageUrl = firstImage.path;
    }
  }
  
  // Cas 3: Structure imbriquée (comme dans l'API)
  else if (raw?.images?.[0]?.url) {
    imageUrl = raw.images[0].url;
  }
  else if (raw?.images?.[0]?.secure_url) {
    imageUrl = raw.images[0].secure_url;
  }

  // Si aucune image trouvée, retourner le placeholder
  if (!imageUrl) {
    return { 
      primary: "/images/placeholder.svg", 
      backup: "/images/placeholder.svg" 
    };
  }

  // Si c'est une URL absolue ou data URL
  if (isAbs(imageUrl) || String(imageUrl).startsWith("data:")) {
    return { 
      primary: imageUrl, 
      backup: "/images/placeholder.svg" 
    };
  }

  // Si c'est un chemin relatif
  const p = normPath(imageUrl);
  
  // Essayer différentes combinaisons d'URL
  return {
    primary: `${API_ORIGIN}${p}`,
    backup: `${API_ORIGIN}/api${p}`,
    fallback: "/images/placeholder.svg"
  };
};

const Categories = () => {
  const [gategorie, SetCategorie] = useState({ description: "", photo: "" });
  const [filter, setfilter] = useState([]);
  const [dataProducts, SetDataProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [imageErrors, setImageErrors] = useState({});

  const [actualPriceRange, setActualPriceRange] = useState({ min: 0, max: 10000 });

  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState({
    sort: true,
    price: false
  });

  const [qtyById, setQtyById] = useState({});
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

  // Gestionnaire d'erreur d'image
  const handleImageError = (productId, primary, backup) => {
    setImageErrors(prev => {
      const currentCount = prev[productId] || 0;
      return {
        ...prev,
        [productId]: currentCount + 1
      };
    });
  };

  const getImageUrl = (productId, primary, backup) => {
    const errorCount = imageErrors[productId] || 0;
    if (errorCount === 0) return primary;
    if (errorCount === 1) return backup;
    return "/images/placeholder.svg";
  };

  /* -------------------- fetch produits & catégorie -------------------- */
  const state = getStateFromURL();
  const baseLib = normalizeLibelle(state.libelle);
  const candidates = Array.from(
    new Set(
      [
        baseLib,
        ...(baseLib === "Pharma"
          ? ["PHARMA", "NOOR PHARMA", "PARAPHARMACIE", "PARAPHARMA", "PHARMACIE"]
          : baseLib === "NOOR CAPILLAIRE"
            ? ["CAPILLAIRE"]
            : ["NOOR CORPS", "NOOR VISAGE"]),
      ].map((s) => s.trim())
    )
  );

  const postFormFirst = async (urls, payload) => {
    const body = new URLSearchParams(payload);
    for (const url of urls) {
      try {
        const r = await axios.post(url, body, { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const res = r?.data?.result ?? r?.data ?? null;
        if ((Array.isArray(res) && res.length) || (!Array.isArray(res) && res)) return res;
      } catch { }
    }
    return null;
  };

  const getFirst = async (urls) => {
    for (const url of urls) {
      try {
        const r = await axios.get(url);
        const res = r?.data?.result ?? r?.data ?? null;
        if ((Array.isArray(res) && res.length) || (!Array.isArray(res) && res)) return res;
      } catch { }
    }
    return null;
  };

  const getallproduits = async () => {
    setLoading(true);
    // Réinitialiser les erreurs d'image quand on charge de nouveaux produits
    setImageErrors({});
    try {
      const FILTER_URLS = [`${API}/filterproduit`, `${API}/filterproduit/`];
      const PROD_URLS = [`${API}/produit`, `${API}/produit/`];

      let out = [];
      for (const L of candidates) {
        const res = await postFormFirst(FILTER_URLS, { libelle: L });
        if (Array.isArray(res) && res.length) {
          out = res;
          break;
        }
      }

      if (!out.length) {
        const all = await getFirst(PROD_URLS);
        if (Array.isArray(all) && all.length) {
          const keys = candidates.map((s) => s.toLowerCase());
          out = all.filter((p) => {
            const name = (p.nom || p.libelle || p.name || "").toLowerCase();
            const gamme = (p.gamme || p.collection || p.categorie || "").toLowerCase();
            const desc = (p.description || "").toLowerCase();
            return keys.some((k) => name.includes(k) || gamme.includes(k) || desc.includes(k));
          });
        }
      }

      setfilter(Array.isArray(out) ? out : []);
      SetDataProducts(Array.isArray(out) ? out : []);
      saveGridToSession(out);

      // Calculer les prix min/max réels
      if (out.length > 0) {
        const prices = out.map(p => parseFloat(p?.prix_TTC_catalogue?.$numberDecimal) || 0).filter(p => p > 0);
        if (prices.length > 0) {
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setActualPriceRange({ min, max });
        }
      }
    } catch {
      setfilter([]);
      SetDataProducts([]);
      saveGridToSession([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    try {
      const CAT_URLS = [`${API}/cat_libelle`, `${API}/cat_libelle/`];
      let cat = null;
      for (const L of candidates) {
        const res = await postFormFirst(CAT_URLS, { libelle: L });
        if (res) {
          cat = res;
          break;
        }
      }
      if (cat) SetCategorie(cat);
    } catch { }
  };

  useEffect(() => {
    getallproduits();
    getCategories();
  }, [state.libelle]);

  /* -------------------- filtrage avancé -------------------- */
  useEffect(() => {
    let filtered = [...filter];

    // Plage de prix
    const min = minPrice === "" ? actualPriceRange.min : parseFloat(minPrice);
    const max = maxPrice === "" ? actualPriceRange.max : parseFloat(maxPrice);

    if (!isNaN(min) || !isNaN(max)) {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p?.prix_TTC_catalogue?.$numberDecimal) || 0;
        const minCheck = isNaN(min) ? true : price >= min;
        const maxCheck = isNaN(max) ? true : price <= max;
        return minCheck && maxCheck;
      });
    }

    // Tri
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => (parseFloat(a?.prix_TTC_catalogue?.$numberDecimal) || 0) - (parseFloat(b?.prix_TTC_catalogue?.$numberDecimal) || 0));
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => (parseFloat(b?.prix_TTC_catalogue?.$numberDecimal) || 0) - (parseFloat(a?.prix_TTC_catalogue?.$numberDecimal) || 0));
    } else if (sortBy === "points-asc") {
      filtered.sort((a, b) => (a.point_Produit || 0) - (b.point_Produit || 0));
    } else if (sortBy === "points-desc") {
      filtered.sort((a, b) => (b.point_Produit || 0) - (a.point_Produit || 0));
    }

    SetDataProducts(filtered);
    saveGridToSession(filtered);

    // Mise à jour des filtres actifs
    const active = [];
    if (sortBy !== "default") active.push({ type: "sort", label: getSortLabel(sortBy), value: sortBy });
    if (minPrice !== "" || maxPrice !== "") {
      const minDisplay = minPrice === "" ? actualPriceRange.min : parseFloat(minPrice);
      const maxDisplay = maxPrice === "" ? actualPriceRange.max : parseFloat(maxPrice);
      active.push({
        type: "price",
        label: `${minDisplay.toFixed(0)} - ${maxDisplay.toFixed(0)} DT`,
        value: { min: minPrice, max: maxPrice }
      });
    }
    setActiveFilters(active);
  }, [sortBy, minPrice, maxPrice, filter, actualPriceRange]);

  const getSortLabel = (value) => {
    const labels = {
      "price-asc": "Prix croissant",
      "price-desc": "Prix décroissant",
      "points-asc": "Points croissants",
      "points-desc": "Points décroissants"
    };
    return labels[value] || value;
  };

  const removeFilter = (filterToRemove) => {
    if (filterToRemove.type === "sort") setSortBy("default");
    if (filterToRemove.type === "price") {
      setMinPrice("");
      setMaxPrice("");
    }
  };

  const clearAllFilters = () => {
    setSortBy("default");
    setMinPrice("");
    setMaxPrice("");
  };

  /* -------------------- panier / stepper -------------------- */
  const buildProductRow = (p, q = 1) => ({
    photo: p.photo,
    quantity: q,
    _id: p._id,
    nom: p.nom,
    reference: p.reference,
    point_unitaire: p.point_Produit,
    point_Quantite: (p.point_Produit || 0) * q,
    prix_HT_Unitaire: p?.prix_HT?.$numberDecimal,
    prix_HT_Quantite: (p?.prix_HT?.$numberDecimal || 0) * q,
    tva: p?.tva?.valeur,
    somme_tva_Unitaire: p?.somme_tva_catalogue?.$numberDecimal,
    somme_tva_Quantite: (p?.somme_tva_catalogue?.$numberDecimal || 0) * q,
    prix_Unitaire: p?.prix_TTC_catalogue?.$numberDecimal,
    prix_Quantite: (p?.prix_TTC_catalogue?.$numberDecimal || 0) * q,
    total: parseFloat(p?.prix_TTC_catalogue?.$numberDecimal || 0) * q,
  });

  const adjustCart = (product, delta) => {
    const list = JSON.parse(localStorage.getItem("products")) || [];
    const idx = list.findIndex((x) => x._id === product._id);
    if (idx === -1 && delta > 0) {
      list.push(buildProductRow(product, 1));
    } else if (idx !== -1) {
      const nextQ = (list[idx].quantity || 1) + delta;
      if (nextQ <= 0) list.splice(idx, 1);
      else list[idx] = buildProductRow(product, nextQ);
    }
    localStorage.setItem("products", JSON.stringify(list));
    window.dispatchEvent(new Event("cart:updated"));
    refreshQuantitiesFromStorage();
  };

  const addToCart = (productToAdd) => adjustCart(productToAdd, +1);

  const toggleFilterSection = (section) => {
    setFiltersOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  /* ============================== RENDER ============================== */
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="sticky top-[64px] z-20 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-[#aacbda] transition-colors">
              Accueil
            </Link>
            <span className="mx-2">›</span>
            <span className="text-[#0b2a3b] font-semibold">Catégorie</span>
            <span className="mx-2">›</span>
            <span className="text-[#aacbda] uppercase">{state.libelle}</span>
          </nav>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 uppercase">{state.libelle}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {dataProducts.length} {dataProducts.length > 1 ? "produits" : "produit"}
              </p>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#aacbda] text-white rounded-lg hover:bg-[#8ab4c9] transition-all"
            >
              <IoFilter />
              <span>Filtres</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <IoFilter className="text-[#aacbda]" />
                  Filtres
                </h2>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              {activeFilters.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Filtres actifs</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map((f, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#aacbda]/10 text-[#aacbda] rounded-full text-xs font-medium"
                      >
                        <span>{f.label}</span>
                        <button
                          onClick={() => removeFilter(f)}
                          className="hover:bg-[#aacbda]/20 rounded-full p-0.5 transition-colors"
                        >
                          <IoClose />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('sort')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  <span>Trier par</span>
                  {filtersOpen.sort ? <IoChevronUp /> : <IoChevronDown />}
                </button>
                {filtersOpen.sort && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setSortBy("default")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${sortBy === "default" ? "bg-[#aacbda] text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      Par défaut
                    </button>
                    <button
                      onClick={() => setSortBy("price-asc")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${sortBy === "price-asc" ? "bg-[#aacbda] text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      <IoArrowUp className="text-sm" />
                      Prix croissant
                    </button>
                    <button
                      onClick={() => setSortBy("price-desc")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${sortBy === "price-desc" ? "bg-[#aacbda] text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      <IoArrowDown className="text-sm" />
                      Prix décroissant
                    </button>
                    <button
                      onClick={() => setSortBy("points-asc")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${sortBy === "points-asc" ? "bg-[#aacbda] text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      <IoArrowUp className="text-sm" />
                      Points croissants
                    </button>
                    <button
                      onClick={() => setSortBy("points-desc")}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${sortBy === "points-desc" ? "bg-[#aacbda] text-white" : "hover:bg-gray-100"
                        }`}
                    >
                      <IoArrowDown className="text-sm" />
                      Points décroissants
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  onClick={() => toggleFilterSection('price')}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-3"
                >
                  <span>Prix (DT)</span>
                  {filtersOpen.price ? <IoChevronUp /> : <IoChevronDown />}
                </button>
                {filtersOpen.price && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                      <div className="flex justify-between mb-1">
                        <span>Prix minimum disponible</span>
                        <span className="font-semibold">{actualPriceRange.min.toFixed(0)} DT</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prix maximum disponible</span>
                        <span className="font-semibold">{actualPriceRange.max.toFixed(0)} DT</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">Prix minimum</label>
                        <input
                          type="number"
                          placeholder={`Min (${actualPriceRange.min.toFixed(0)})`}
                          step="1"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#aacbda] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-gray-700 mb-2 block">Prix maximum</label>
                        <input
                          type="number"
                          placeholder={`Max (${actualPriceRange.max.toFixed(0)})`}
                          step="1"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#aacbda] focus:border-transparent"
                        />
                      </div>
                    </div>

                    {(minPrice !== "" || maxPrice !== "") && (
                      <div className="bg-[#aacbda]/10 rounded-lg p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">Filtrage actif</p>
                        <p className="text-sm font-semibold text-[#aacbda]">
                          {minPrice === "" ? actualPriceRange.min.toFixed(0) : parseFloat(minPrice).toFixed(0)} DT
                          {" - "}
                          {maxPrice === "" ? actualPriceRange.max.toFixed(0) : parseFloat(maxPrice).toFixed(0)} DT
                        </p>
                      </div>
                    )}

                    {(minPrice !== "" || maxPrice !== "") && (
                      <button
                        onClick={() => {
                          setMinPrice("");
                          setMaxPrice("");
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-all text-sm font-semibold"
                      >
                        Réinitialiser le prix
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-xl shadow-md p-4">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : dataProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IoFilter className="text-6xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-500 mb-6">
                  Essaie de modifier tes filtres ou recherche un autre terme
                </p>
                {activeFilters.length > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-[#aacbda] hover:bg-[#8ab4c9] text-white font-semibold rounded-lg transition-all"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {dataProducts.map((item, index) => {
                  const { primary, backup } = makeImgCandidates(item);
                  const title = item?.nom || "Produit";
                  const price = item?.prix_TTC_catalogue?.$numberDecimal;
                  const qty = qtyById[item?._id] || 0;
                  const productId = item?._id || index;

                  return (
                    <Link
                      to={"/product_details"}
                      state={{ item }}
                      key={index}
                      className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                      <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-white p-4">
                        <img
                          src={getImageUrl(productId, primary, backup)}
                          alt={title}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                          onError={() => handleImageError(productId, primary, backup)}
                          loading="lazy"
                        />
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm min-h-[2.5rem] line-clamp-2 mb-3">
                          {title}
                        </h3>

                        <div className="flex items-center justify-between">
                          <span className="text-[#aacbda] font-bold text-lg">
                            {parseFloat(price || 0).toFixed(3)} DT
                          </span>

                          {qty <= 0 ? (
                            <button
                              className="px-4 py-2 bg-[#aacbda] hover:bg-[#8ab4c9] text-white text-xs font-semibold rounded-lg transition-all"
                              onClick={(e) => {
                                e.preventDefault();
                                addToCart(item);
                              }}
                            >
                              Ajouter
                            </button>
                          ) : (
                            <div className="flex items-center bg-[#aacbda] text-white rounded-lg px-3 py-2 gap-3">
                              <button
                                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  adjustCart(item, -1);
                                }}
                              >
                                –
                              </button>
                              <span className="min-w-[20px] text-center font-semibold">{qty}</span>
                              <button
                                className="w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
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
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;