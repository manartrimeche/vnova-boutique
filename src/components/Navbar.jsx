/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdKeyboardArrowDown, MdMenu, MdClose } from "react-icons/md";
import { Search } from "lucide-react";
import axios from "axios";

/* === Helpers API & images === */
const API = (process.env.API_URL || "https://api.vnova.tn/api").replace(/\/+$/, "");
const API_ORIGIN = API.replace(/\/api$/, "");
const isAbs = (u = "") => /^https?:\/\//i.test(u);
const imgUrl = (u) => {
  if (!u) return "/images/placeholder.svg";
  if (isAbs(u)) return u;
  
  let path = u;
  if (!path.startsWith("/")) path = `/${path}`;
  
  try { 
    return API_ORIGIN + encodeURI(path).replace(/\/\/+/g, '/');
  } catch { 
    return API_ORIGIN + path; 
  }
};
const priceOf = (p) =>
  p?.prix_TTC_catalogue?.$numberDecimal ??
  p?.prix ??
  p?.price ??
  "";

/* === Icône Sac (double anse) === */
const BagIcon = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4" y="7" width="16" height="13" rx="3" />
    <path d="M9 7v-1a3 3 0 0 1 6 0v1" />
    <path d="M7 7v-1a5 5 0 0 1 10 0v1" />
  </svg>
);

/* === Panier: helpers globaux === */
const getCart = () => {
  try { return JSON.parse(localStorage.getItem("products")) || []; }
  catch { return []; }
};
const computeCount = (arr = []) =>
  arr.reduce((n, p) => n + (parseInt(p?.quantity, 10) || 1), 0);

/* Normalisation sans accents en minuscule */
const norm = (s = "") => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/* POST urlencoded robuste */
const postForm = async (url, payload, timeout = 8000) => {
  const params = new URLSearchParams();
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v !== null && v !== undefined) {
      params.append(k, String(v));
    }
  });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      signal: controller.signal,
      timeout: timeout
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Timeout sur ${url}`);
      throw new Error(`Timeout: La requête a pris trop de temps`);
    }
    throw error;
  }
};

const Navbar = () => {
  /* Compteur panier (somme des quantités) + synchro */
  const [cartCount, setCartCount] = useState(() => computeCount(getCart()));
  useEffect(() => {
    const onChange = () => setCartCount(computeCount(getCart()));
    window.addEventListener("cart:updated", onChange);
    const onStorage = (e) => { if (e.key === "products") onChange(); };
    window.addEventListener("storage", onStorage);
    onChange();
    return () => {
      window.removeEventListener("cart:updated", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  /* Scroll banner (bandeau bleu si proche du haut) */
  const [showBanner, setShowBanner] = useState(true);
  useEffect(() => {
    const onScroll = () => setShowBanner(window.scrollY < 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = useNavigate();

  /* Recherche (produits uniquement) */
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [cats, setCats] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [prodResults, setProdResults] = useState([]);
  const [loadingProd, setLoadingProd] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // refs pour click extérieur + autofocus
  const searchWrapRef = useRef(null);
  const inputRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);

  // charge catégories (uniquement pour le menu)
  useEffect(() => {
    (async () => {
      try {
        const r = await axios.get(`${API}/categorie`);
        setCats(r?.data?.result || []);
      } catch {
        setCats([]);
      }
    })();
  }, []);
  
  // Charger TOUS les produits au démarrage
  useEffect(() => {
    const loadAllProducts = async () => {
      setInitialLoad(true);
      try {
        console.log("🔄 Chargement initial de tous les produits...");
        
        const endpoints = [
          `${API}/produit`,
          `${API}/produit/`,
          `${API}/filterproduit`,
          `${API}/filterproduit/`
        ];
        
        let allProductsData = [];
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Tentative endpoint: ${endpoint}`);
            let response;
            
            if (endpoint.includes('filterproduit')) {
              response = await postForm(endpoint, {});
            } else {
              response = await axios.get(endpoint);
            }
            
            let products = [];
            
            if (Array.isArray(response?.data?.result)) {
              products = response.data.result;
            } else if (Array.isArray(response?.data)) {
              products = response.data;
            } else if (Array.isArray(response?.result)) {
              products = response.result;
            }
            
            console.log(`📦 Produits récupérés de ${endpoint}:`, products.length);
            
            if (products.length > 0) {
              allProductsData = products;
              break;
            }
          } catch (error) {
            console.error(`Erreur endpoint ${endpoint}:`, error);
            continue;
          }
        }
        
        // Fallback: charger par catégories principales
        if (allProductsData.length === 0) {
          console.log("🔄 Aucun produit trouvé, tentative avec catégories...");
          
          const mainCategories = ["NOOR CAPILLAIRE", "NOOR VISAGE ET CORPS", "Pharma"];
          const categoryProducts = [];
          
          for (const category of mainCategories) {
            try {
              const response = await postForm(`${API}/filterproduit`, { libelle: category });
              let products = [];
              
              if (Array.isArray(response?.data?.result)) {
                products = response.data.result;
              } else if (Array.isArray(response?.data)) {
                products = response.data;
              }
              
              if (products.length > 0) {
                categoryProducts.push(...products);
              }
            } catch (error) {
              console.error(`Erreur catégorie ${category}:`, error);
            }
          }
          
          allProductsData = categoryProducts;
        }
        
        // Filtrer les produits valides
        const validProducts = allProductsData.filter(p => 
          p && (p.nom || p.libelle || p.name) && (p._id || p.id)
        );
        
        console.log(`✅ ${validProducts.length} produits chargés pour recherche instantanée`);
        setAllProducts(validProducts);
        
      } catch (error) {
        console.error("Erreur chargement initial produits:", error);
        setAllProducts([]);
      } finally {
        setInitialLoad(false);
      }
    };

    loadAllProducts();
  }, []);

  // Debounce rapide pour recherche instantanée
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(norm(searchTerm)), 150);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fonction pour fermer la recherche
  const closeSearch = () => {
    setShowSearch(false);
    setSearchTerm("");
    setProdResults([]);
  };

  useEffect(() => {
    if (!showSearch) {
      setProdResults([]);
      return;
    }

    if (!debouncedSearchTerm) {
      setProdResults([]);
      return;
    }

    console.log("🔍 Recherche instantanée pour:", debouncedSearchTerm);

    const performSearch = () => {
      const searchTermLower = debouncedSearchTerm.toLowerCase();
      
      let results = [];
      
      if (allProducts.length > 0) {
        results = allProducts
          .filter(product => {
            const name = norm(product?.nom || product?.libelle || product?.name || "");
            const description = norm(product?.description || "");
            const reference = norm(product?.reference || "");
            
            return name.startsWith(searchTermLower) || 
                   name.includes(searchTermLower) ||
                   description.includes(searchTermLower) ||
                   reference.includes(searchTermLower);
          })
          .slice(0, 5);
      }
      
      console.log(" Produits trouvés:", results.length);
      setProdResults(results);
      setLoadingProd(false);
    };

    setLoadingProd(true);
    setTimeout(performSearch, 100);
  }, [debouncedSearchTerm, showSearch, allProducts]);

  const handleSubmitSearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const q = searchTerm.trim();
    if (!q) {
      closeSearch();
      return;
    }

    if (prodResults.length > 0) {
      const item = prodResults[0];
      closeSearch();
      navigate("/product_details", { state: { item } });
      return;
    }

    closeSearch();
  };

  // menu Produits
  const productCats = useMemo(() => {
    const wanted = ["CAPILLAIRE", "CORPS", "VISAGE", "PHARMA"];
    const filtered = (cats || []).filter((c) => {
      const L = (c?.libelle || "").toUpperCase();
      return wanted.some((w) => L.includes(w));
    });
    const order = { CAPILLAIRE: 0, CORPS: 1, VISAGE: 2, PHARMA: 3 };
    filtered.sort((a, b) => {
      const A = (a?.libelle || "").toUpperCase();
      const B = (b?.libelle || "").toUpperCase();
      const keyA = ["CAPILLAIRE", "CORPS", "VISAGE", "PHARMA"].find((w) => A.includes(w));
      const keyB = ["CAPILLAIRE", "CORPS", "VISAGE", "PHARMA"].find((w) => B.includes(w));
      return (order[keyA] ?? 99) - (order[keyB] ?? 99);
    });
    if (!filtered.length) {
      return [
        { _id: "cap", libelle: "NOOR CAPILLAIRE" },
        { _id: "corpsvisage", libelle: "NOOR VISAGE ET CORPS" },
        { _id: "pharma", libelle: "Pharma" },
      ];
    }
    return filtered;
  }, [cats]);

  const shortLabel = (libelle) => {
    const L = (libelle || "").toUpperCase();
    if (L.includes("CAPILLAIRE")) return "CAPILLAIRE";
    if (L.includes("CORPS") || L.includes("VISAGE")) return "CORPS & VISAGE";
    if (L.includes("PHARMA")) return "PHARMA";
    return libelle || "";
  };

  const [showProductsSmall, setShowProductsSmall] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileProducts, setShowMobileProducts] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileMenu &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false);
        setShowMobileProducts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileMenu]);

  /* ---------- Gestion ouverture/fermeture stable de la recherche ---------- */
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [showSearch]);

  useEffect(() => {
    if (!showSearch) return;
    
    const onMouseDown = (e) => {
      if (!searchWrapRef.current?.contains(e.target)) {
        closeSearch();
      }
    };
    
    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };
    
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [showSearch]);

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
    setShowMobileProducts(false);
  };

  return (
    <>
      <div className="h-[3px] w-full bg-[#aacbda]" />

      {showBanner && (
        <div className="w-full bg-[#aacbda]">
          <div className="max-w-screen-2xl mx-auto px-4">
            <p className="py-1 text-center text-[13px] leading-6 text-[#0b2a3b] font-medium tracking-wide banner-line">
              <span className="shimmer-text">Votre beauté est unique</span>, vos besoins aussi.{" "}
              <span className="underline-draw">Découvrez le soin</span> qui vous correspond.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="border-b border-black/5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="max-w-screen-2xl mx-auto h-16 lg:h-20 px-4 lg:px-6 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img src="/images/logo-vn.png" alt="VNOVA" className="h-8 lg:h-12 w-auto" />
            </Link>

            {/* MENU PRINCIPAL */}
            <nav className="hidden lg:flex items-center gap-2 uppercase text-[12.5px] font-semibold tracking-[0.18em] text-[#0b2a3b]">
              <Link
                to="/"
                title="Accueil"
                className="px-3 pb-1 border-b-2 border-transparent hover:border-[#aacbda] transition-colors focus:outline-none focus-visible:border-[#aacbda]"
              >
                Accueil
              </Link>

              <Link
                to="a_propos"
                title="À propos"
                className="px-3 pb-1 border-b-2 border-transparent hover:border-[#aacbda] transition-colors focus:outline-none focus-visible:border-[#aacbda]"
              >
                À&nbsp;Propos
              </Link>

              <div
                className="relative group"
                onMouseEnter={() => setShowProductsSmall(true)}
                onMouseLeave={() => setShowProductsSmall(false)}
                onFocus={() => setShowProductsSmall(true)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setShowProductsSmall(false); }}
              >
                <button
                  type="button"
                  title="Produits"
                  onClick={() => setShowProductsSmall((v) => !v)}
                  className="px-3 pb-1 border-b-2 border-transparent hover:border-[#aacbda] transition-colors focus:outline-none focus-visible:border-[#aacbda] flex items-center gap-1"
                  aria-haspopup="menu"
                  aria-expanded={showProductsSmall}
                >
                  PRODUITS <MdKeyboardArrowDown className="mt-[2px]" />
                </button>

                <ul
                  className={`${showProductsSmall ? "visible opacity-100" : "invisible opacity-0"} group-hover:visible group-hover:opacity-100 transition-all duration-150 absolute top-full right-0 mt-3 bg-white text-[#121521] border-t-2 border-t-hoverColor shadow w-[240px] py-1`}
                  role="menu"
                  aria-label="Catégories produits"
                >
                  {productCats.map((c) => (
                    <li key={c?._id}>
                      <button
                        type="button"
                        title={c?.libelle}
                        onMouseDown={() => {
                          navigate(`/categorie?libelle=${encodeURIComponent(c?.libelle)}`);
                        }}
                        className="w-full text-left px-4 py-2 pb-1 border-b-2 border-transparent hover:border-[#aacbda] hover:bg-gray-50 focus:outline-none focus-visible:border-[#aacbda] transition"
                        role="menuitem"
                      >
                        {shortLabel(c?.libelle)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="contact"
                title="Contact"
                className="px-3 pb-1 border-b-2 border-transparent hover:border-[#aacbda] transition-colors focus:outline-none focus-visible:border-[#aacbda]"
              >
                CONTACT
              </Link>
            </nav>

            <div className="flex items-center gap-3 lg:gap-6 text-[#0b2a3b]">
              {/* Recherche */}    
              <button
               type="button"
               aria-label="Rechercher"
               title="Rechercher"
               onClick={() => setShowSearch(true)}
               className="p-1.5 lg:p-2 rounded-lg inline-flex items-center justify-center hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#aacbda]">
                <Search className="w-4 h-4 lg:w-5 lg:h-5" />
              </button>
        
              {/* Panier */}
              <Link
                to="cart"
                aria-label="Panier"
                title="Panier"
                className="relative p-1.5 lg:p-2 rounded-lg inline-flex items-center justify-center hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#aacbda]">
                <BagIcon className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="sr-only">Panier</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 h-3 w-3 lg:h-4 lg:min-w-4 px-0.5 lg:px-1 rounded-full bg-[#f0b54d] text-[8px] lg:text-[10px] leading-3 lg:leading-4 text-[#0b2a3b] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Login */}
              <a
                href="https://adherant.vnova.tn/auth/sign-in"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Se connecter"
                title="Se connecter"
                className="p-1.5 lg:p-2 rounded-lg inline-flex items-center justify-center hover:bg-gray-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#aacbda]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="lg:w-5 lg:h-5">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 20a8 8 0 0 1 16 0v1H4v-1z"></path>
                </svg>
                <span className="sr-only">Se connecter</span>
              </a>
            </div>

            {/* MENU HAMBURGER */}
            <button
              ref={hamburgerButtonRef}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Menu"
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? (
                <MdClose className="w-6 h-6 text-[#0b2a3b]" />
              ) : (
                <MdMenu className="w-6 h-6 text-[#0b2a3b]" />
              )}
            </button>

            <div className="hidden" />
          </div>

          {/* Barre de recherche  */}
          {showSearch && (
            <div
              ref={searchWrapRef}
              className="absolute inset-x-0 top-full z-50 bg-white/95 backdrop-blur border-t border-black/5"
            >
              <div className="max-w-screen-md mx-auto px-4 py-3 relative">
                <form
                  onSubmit={handleSubmitSearch}
                  className="flex items-center gap-3"
                >
                  <Search className="opacity-70 shrink-0 w-5 h-5" />
                  <input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Quel secret de beauté souhaitez-vous découvrir ?"
                    className="w-full outline-none bg-transparent placeholder:text-gray-400 text-gray-900"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="text-sm text-gray-500 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                </form>

                {(loadingProd || prodResults.length > 0 || debouncedSearchTerm) && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-black/10 rounded-md shadow-sm overflow-hidden"
                       onMouseDown={(e) => e.stopPropagation()}>
                    
                    {initialLoad && (
                      <div className="px-4 py-6 text-center">
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#aacbda]"></div>
                          Chargement des produits...
                        </div>
                      </div>
                    )}

                    {!initialLoad && (
                      <>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b flex items-center justify-between">
                          <span>
                            {debouncedSearchTerm ? `Résultat : "${debouncedSearchTerm}"` : 'Produits'}
                          </span>
                          {loadingProd && (
                            <span className="text-xs text-[#aacbda] animate-pulse">Recherche...</span>
                          )}
                        </div>

                        {loadingProd ? (
                          <div className="px-4 py-6 text-center">
                            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#aacbda]"></div>
                              Recherche en cours...
                            </div>
                          </div>
                        ) : prodResults.length > 0 ? (
                          <ul className="max-h-80 overflow-auto">
                            {prodResults.map((p, i) => (
                              <li key={(p?._id || p?.id || `prod-${i}`)} className="border-b last:border-b-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    closeSearch();
                                    navigate("/product_details", { state: { item: p } });
                                  }}
                                  className="w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors group"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                      {p?.nom || p?.libelle || p?.name || "Produit sans nom"}
                                    </div>
                                    <div className="text-xs text-gray-500 line-clamp-1">
                                      {priceOf(p) ? `${parseFloat(priceOf(p)).toFixed(3)} DT` : "Prix non disponible"}
                                    </div>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : debouncedSearchTerm && !loadingProd ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-500">
                            <div>Aucun produit ne commence par "{debouncedSearchTerm}"</div>
                            <div className="text-xs mt-1">Essayez avec un autre terme</div>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                )}

                {!debouncedSearchTerm && !initialLoad && (
                  <div className="absolute left-0 right-0 mt-2 bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                    <div className="text-sm text-gray-600">
                      Entrez le nom de votre élixir beauté.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="h-[2px] w-full bg-gradient-to-r from-[#aacbda] via-[#aacbda]/60 to-[#aacbda]" />
        </div>

        <div
          ref={mobileMenuRef}
          className={`
            lg:hidden absolute top-full left-0 right-0 bg-white border-b border-black/10 shadow-lg
            transform transition-all duration-300 ease-in-out overflow-hidden
            ${showMobileMenu ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'}
          `}
        >
          <div className="px-4 py-4">
            <nav className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#0b2a3b] font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                Accueil
              </Link>

              <Link
                to="a_propos"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#0b2a3b] font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                À propos
              </Link>

              <div className="px-4 py-3">
                <div
                  onClick={() => setShowMobileProducts(!showMobileProducts)}
                  className="flex items-center justify-between text-[#0b2a3b] font-semibold cursor-pointer"
                >
                  <span className="text-sm uppercase tracking-wide">Produits</span>
                  <MdKeyboardArrowDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      showMobileProducts ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <div className={`
                  pl-4 space-y-1 transition-all duration-300 ease-in-out overflow-hidden
                  ${showMobileProducts ? 'max-h-[200px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
                `}>
                  {productCats.map((c) => (
                    <button
                      key={c?._id}
                      onMouseDown={() => {
                        closeMobileMenu();
                        navigate(`/categorie?libelle=${encodeURIComponent(c?.libelle)}`);
                      }}
                      className="block w-full text-left px-4 py-2 text-[#0b2a3b]/80 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                    >
                      {shortLabel(c?.libelle)}
                    </button>
                  ))}
                </div>
              </div>

              <Link
                to="contact"
                onClick={closeMobileMenu}
                className="px-4 py-3 text-[#0b2a3b] font-medium hover:bg-gray-50 rounded-lg transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="hidden" />
    </>
  );
};

export default Navbar;