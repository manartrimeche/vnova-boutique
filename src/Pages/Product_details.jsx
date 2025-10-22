/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  IoChevronForward,
  IoCartOutline,
  IoCheckmarkCircle,
  IoShieldCheckmark,
  IoRocketOutline,
  IoArrowBack
} from "react-icons/io5";
import RelatedProducts from "../components/RelatedProducts";

/* Helpers image: construisent une URL absolue sûre à partir de l'API */
const getApiUrl = () =>
  (process.env.API_URL ||
    (import.meta?.env && import.meta.env.VITE_API_URL) ||
    "https://api.vnova.tn/api"
  ).replace(/\/+$/, "");

const getApiOrigin = () => getApiUrl().replace(/\/api$/, "");

/* On privilégie l'URL AVEC /api (même logique que le panier) */
const buildImageUrl = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const api = getApiUrl();
  const path = p.startsWith("/") ? p : `/${p}`;
  try {
    return api + encodeURI(path);
  } catch {
    return api + path;
  }
};

const STORAGE_KEY = "vnova:last-product";

const Product_details = () => {
  const { state } = useLocation();
  const initial = state?.item || state || null;

  const [product, setProduct] = useState(initial);
  const [activeTab, setActiveTab] = useState("description");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Si on arrive avec state -> on sauvegarde
  useEffect(() => {
    if (initial && initial._id) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      } catch { }
      setProduct(initial);
    }
  }, [initial]);

  // Si on n'a pas de state (refresh, ouverture directe), on relit le cache
  useEffect(() => {
    if (!product) {
      try {
        const cached = sessionStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed._id) setProduct(parsed);
        }
      } catch { }
    }
  }, [product]);

  const addToCart = () => {
    if (!product) return;

    const cartItem = {
      photo: product.photo,
      quantity: 1,
      _id: product._id,
      nom: product.nom,
      reference: product.reference,
      point_unitaire: product.point_Produit,
      point_Quantite: product.point_Produit || 0,
      prix_HT_Unitaire: product?.prix_HT?.$numberDecimal,
      prix_HT_Quantite: parseFloat(product?.prix_HT?.$numberDecimal) || 0,
      tva: product?.tva?.valeur,
      somme_tva_Unitaire: product?.somme_tva_catalogue?.$numberDecimal,
      somme_tva_Quantite: parseFloat(product?.somme_tva_catalogue?.$numberDecimal) || 0,
      prix_Unitaire: product?.prix_TTC_catalogue?.$numberDecimal,
      prix_Quantite: parseFloat(product?.prix_TTC_catalogue?.$numberDecimal) || 0,
      total: parseFloat(product?.prix_TTC_catalogue?.$numberDecimal || 0),
    };

    const currentCart = JSON.parse(localStorage.getItem("products")) || [];
    const existingIndex = currentCart.findIndex(item => item._id === product._id);

    if (existingIndex !== -1) {
      currentCart[existingIndex].quantity += 1;
      const newQty = currentCart[existingIndex].quantity;
      currentCart[existingIndex].point_Quantite = (product.point_Produit || 0) * newQty;
      currentCart[existingIndex].prix_HT_Quantite = (parseFloat(product?.prix_HT?.$numberDecimal) || 0) * newQty;
      currentCart[existingIndex].somme_tva_Quantite = (parseFloat(product?.somme_tva_catalogue?.$numberDecimal) || 0) * newQty;
      currentCart[existingIndex].prix_Quantite = (parseFloat(product?.prix_TTC_catalogue?.$numberDecimal) || 0) * newQty;
      currentCart[existingIndex].total = parseFloat(product?.prix_TTC_catalogue?.$numberDecimal || 0) * newQty;
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem("products", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cart:updated"));

    // Animation de confirmation
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Fallback si aucun produit
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <IoCartOutline className="text-6xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Produit introuvable
            </h3>
            <p className="text-gray-500 mb-8">
              Revenir à la liste et réessayer
            </p>
            <Link to="/">
              <button className="px-6 py-3 bg-[#aacbda] hover:bg-[#8ab4c9] text-white font-semibold rounded-lg transition-all">
                Retour à l'accueil
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const imgSrc = buildImageUrl(product?.photo);
  const price = parseFloat(product?.prix_TTC_catalogue?.$numberDecimal || 0);
  const categoryName = product?.categorie?.libelle || product?.gamme || product?.collection;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section principale produit */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="relative">
              <div className="aspect-square bg-gradient-to-b from-gray-50 to-white rounded-xl overflow-hidden border-2 border-gray-100 relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#aacbda]"></div>
                  </div>
                )}
                <img
                  src={imgSrc || "/images/placeholder.svg"}
                  alt={product?.nom || "Produit"}
                  className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100 hover:scale-105' : 'opacity-0'
                    }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    try {
                      const u = new URL(e.currentTarget.src);
                      if (u.pathname.startsWith("/api/")) {
                        e.currentTarget.src = getApiOrigin() + u.pathname.replace(/^\/api/, "");
                      } else {
                        e.currentTarget.src = "/images/placeholder.svg";
                      }
                    } catch {
                      e.currentTarget.src = "/images/placeholder.svg";
                    }
                  }}
                />
              </div>
            </div>

            {/* Informations produit */}
            <div className="flex flex-col space-y-6">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 mb-3">
                  {product?.nom}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Référence:</span>
                  <span className="text-gray-500">{product?.reference}</span>
                </div>
              </div>

              {/* Prix */}
              <div className="bg-[#aacbda]/10 rounded-xl p-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-[#aacbda]">
                    {price.toFixed(3)}
                  </span>
                  <span className="text-2xl text-gray-600">DT</span>
                </div>
                {product?.point_Produit && (
                  <div className="mt-2 text-sm text-gray-600">
                    Points: <span className="font-semibold">{product.point_Produit}</span>
                  </div>
                )}
              </div>

              {/* Bouton d'ajout au panier */}
              <button
                onClick={addToCart}
                disabled={addedToCart}
                className={`w-full font-bold py-4 rounded-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-lg ${addedToCart
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : 'bg-[#aacbda] hover:bg-[#8ab4c9] text-white'
                  }`}
              >
                {addedToCart ? (
                  <>
                    <IoCheckmarkCircle className="text-2xl" />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <IoCartOutline className="text-2xl" />
                    Ajouter au panier
                  </>
                )}
              </button>

              {/* Badges de confiance */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <IoCheckmarkCircle className="text-2xl text-green-600" />
                  </div>
                  <span className="text-xs text-gray-600">En stock</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <IoShieldCheckmark className="text-2xl text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-600">Paiement sécurisé</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <IoRocketOutline className="text-2xl text-purple-600" />
                  </div>
                  <span className="text-xs text-gray-600">Livraison rapide</span>
                </div>
              </div>
            </div>
          </div>

          {/* Onglets de description */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-8 py-4 font-semibold transition-all ${activeTab === "description"
                  ? "text-[#aacbda] border-b-2 border-[#aacbda]"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`px-8 py-4 font-semibold transition-all ${activeTab === "details"
                  ? "text-[#aacbda] border-b-2 border-[#aacbda]"
                  : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                Détails
              </button>
            </div>

            <div className="p-8">
              {activeTab === "description" && (
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {product?.description || "Aucune description disponible."}
                  </p>
                </div>
              )}

              {activeTab === "details" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Référence</span>
                      <span className="text-gray-600">{product?.reference}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Prix HT</span>
                      <span className="text-gray-600">
                        {parseFloat(product?.prix_HT?.$numberDecimal || 0).toFixed(3)} DT
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">TVA</span>
                      <span className="text-gray-600">{product?.tva?.valeur || "N/A"}%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Prix TTC</span>
                      <span className="text-gray-600">
                        {price.toFixed(3)} DT
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Points</span>
                      <span className="text-gray-600">{product?.point_Produit || "0"}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-semibold text-gray-700">Catégorie</span>
                      <span className="text-gray-600">
                        {categoryName || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="w-1 h-8 bg-[#aacbda] rounded-full"></span>
            Produits Similaires
          </h2>

          <RelatedProducts
            libelle={product?.categorie?.libelle}
            currentId={product?._id}
            seedName={product?.nom}
            limit={6}
          />
        </div>
      </div>
    </div>
  );
};

export default Product_details;
