/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { IoClose, IoCartOutline, IoArrowBack, IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Cart = () => {
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [removingIndex, setRemovingIndex] = useState(null);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem("products")) || [];
    setUpdatedProducts(products);
  }, []);

  const writeCart = (next) => {
    setUpdatedProducts(next);
    localStorage.setItem("products", JSON.stringify(next));
    window.dispatchEvent(new Event("cart:updated"));
  };

  const updateQuantity = (index, newQuantity) => {
    const q = Math.max(1, parseInt(newQuantity, 10) || 1);
    const next = [...updatedProducts];

    next[index].quantity = q;
    next[index].point_Quantite = (next[index].point_unitaire || 0) * q;
    next[index].prix_HT_Quantite = (parseFloat(next[index].prix_HT_Unitaire) || 0) * q;
    next[index].somme_tva_Quantite = (parseFloat(next[index].somme_tva_Unitaire) || 0) * q;
    next[index].prix_Quantite = (parseFloat(next[index].prix_Unitaire) || 0) * q;
    next[index].total = (parseFloat(next[index].prix_Unitaire) || 0) * q;

    writeCart(next);
  };

  const calculateTotal = () => {
    const sum = updatedProducts.reduce((total, item) => {
      const t = item?.total != null ? parseFloat(item.total) : 0;
      return total + (isNaN(t) ? 0 : t);
    }, 0);
    return sum.toFixed(3);
  };

  const calculateTotalQuantity = () => {
    const totalQty = updatedProducts.reduce((total, item) => {
      const qty = item?.quantity || 1;
      return total + qty;
    }, 0);
    return totalQty;
  };

  const deleteProduct = (index) => {
    setRemovingIndex(index);
    setTimeout(() => {
      const next = [...updatedProducts];
      next.splice(index, 1);
      writeCart(next);
      setRemovingIndex(null);
    }, 300);
  };

  const itemCount = updatedProducts.length;
  const totalQuantity = calculateTotalQuantity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm mt-[75px] sm:mt-[95px] max-sm:mt-[70px] max-md:mt-[108px] max-lg:mt-[109px] max-xl:mt-[80px]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IoCartOutline className="text-3xl text-[#aacbda]" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Votre Panier</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {totalQuantity} {totalQuantity > 1 ? "articles" : "article"}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Liste des produits  */}
          <div className="xl:col-span-3">
            {updatedProducts && updatedProducts.length !== 0 ? (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header du tableau  */}
                <div className="hidden md:grid grid-cols-12 gap-6 px-8 py-5 bg-gray-50 border-b font-semibold text-gray-700 text-base">
                  <div className="col-span-5">Produit</div>
                  <div className="col-span-2 text-center">Prix Unitaire</div>
                  <div className="col-span-2 text-center">Quantité</div>
                  <div className="col-span-2 text-center">Total</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-gray-100">
                  {updatedProducts.map((item, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-300 ${
                        removingIndex === index
                          ? "opacity-0 translate-x-full"
                          : "opacity-100"
                      }`}
                    >
                      <div className="p-8 hover:bg-gray-50 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                          <div className="col-span-1 md:col-span-5 flex items-center gap-6">
                            <div className="relative flex-shrink-0 w-32 h-32 bg-white rounded-lg border-2 border-gray-100 overflow-hidden group shadow-sm">
                              <img
                                src={process.env.API_URL + item?.photo}
                                alt={item.nom}
                                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 leading-relaxed">
                                {item.nom}
                              </h3>
                              <p className="text-sm text-gray-500 mt-2">
                                Référence: #{index + 1000}
                              </p>
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2 text-center">
                            <span className="inline-block md:hidden font-semibold text-gray-700 mr-2 text-base">
                              Prix:
                            </span>
                            <span className="text-gray-900 font-semibold text-lg">
                              {parseFloat(item?.prix_Unitaire || 0).toFixed(3)} DT
                            </span>
                          </div>

                          <div className="col-span-1 md:col-span-2 flex justify-center items-center">
                            <span className="inline-block md:hidden font-semibold text-gray-700 mr-2 text-base">
                              Quantité:
                            </span>
                            <div className="flex items-center">
                              <button
                                onClick={() =>
                                  updateQuantity(index, (item?.quantity || 1) - 1)
                                }
                                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-lg transition-colors border border-r-0 border-gray-300 text-lg font-semibold"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item?.quantity ?? 1}
                                onChange={(e) => updateQuantity(index, e.target.value)}
                                className="w-20 h-10 text-center border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#aacbda] focus:border-transparent text-lg font-medium"
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(index, (item?.quantity || 1) + 1)
                                }
                                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-lg transition-colors border border-l-0 border-gray-300 text-lg font-semibold"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="col-span-1 md:col-span-2 text-center">
                            <span className="inline-block md:hidden font-semibold text-gray-700 mr-2 text-base">
                              Total:
                            </span>
                            <span className="text-[#aacbda] font-bold text-xl">
                              {(parseFloat(item?.total) || 0).toFixed(3)} DT
                            </span>
                          </div>

                          <div className="col-span-1 md:col-span-1 flex justify-center">
                            <button
                              onClick={() => deleteProduct(index)}
                              className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                              title="Supprimer"
                            >
                              <IoTrashOutline className="text-2xl group-hover:scale-110 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // État vide amélioré
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <IoCartOutline className="text-6xl text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Votre panier est vide
                  </h3>
                  <p className="text-gray-500 mb-8">
                    Découvrez nos produits et ajoutez-les à votre panier
                  </p>
                  <Link to="/">
                    <button className="px-8 py-3 bg-[#aacbda] hover:bg-[#8ab4c9] text-white font-semibold rounded-lg transition-all hover:shadow-lg transform hover:-translate-y-0.5">
                      Découvrir nos produits
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {updatedProducts.length > 0 && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Résumé De Commande
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Articles</span>
                    <span className="font-medium">{totalQuantity}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium">{calculateTotal()} DT</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-[#aacbda] text-xl">{calculateTotal()} DT</span>
                    </div>
                  </div>
                </div>

                <Link to="registre">
                  <button className="w-full bg-[#aacbda] hover:bg-[#8ab4c9] text-white font-bold py-4 rounded-lg transition-all hover:shadow-xl transform hover:-translate-y-0.5 mb-4 text-base">
                    Procéder au paiement
                  </button>
                </Link>

                <Link to="/">
                  <button className="w-full bg-white hover:bg-gray-50 text-[#aacbda] font-semibold py-3 rounded-lg border-2 border-[#aacbda] transition-all text-sm">
                    Continuer mes achats
                  </button>
                </Link>

                {/* Badges de confiance */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Paiement sécurisé</span>
                  </div>
                 
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span>Retours sous 30 jours</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;