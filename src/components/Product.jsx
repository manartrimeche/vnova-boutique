/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Product = () => {
  const navigate = useNavigate();
  const nav = (item) => {
    navigate("/product_details", { state: item });
  };
  const [produits, setproduits] = useState([]);

  const VITE = typeof import.meta !== "undefined" ? import.meta.env : {};
  const API = (VITE?.VITE_API_URL || process.env.API_URL || "https://api.vnova.tn/api").replace(/\/+$/, "");
  const API_ORIGIN = API.replace(/\/api$/, "");

  const buildImg = (raw = "") => {
    if (!raw) return "/images/placeholder.svg";
    if (/^https?:\/\//i.test(raw) || String(raw).startsWith("data:")) return raw;
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `${API_ORIGIN}${path}`;
  };
  const getallproduits = async () => {
    try {
      const url = `${API}/produit_en_stock`;
      await axios.get(url).then((response) => {
        setproduits(response?.data?.result || []);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getallproduits();
  }, []);

  const showToast = () => {
    toast.success("Produit ajouté au panier !");
  };

  const addOrUpdateProduct = (productToAdd) => {
    const data = {
      photo: productToAdd.photo,
      quantity: 1,
      _id: productToAdd._id,
      nom: productToAdd.nom,
      reference: productToAdd.reference,
      point_unitaire: productToAdd.point_Produit,
      point_Quantite: productToAdd.point_Produit,
      prix_HT_Unitaire: productToAdd.prix_HT.$numberDecimal,
      prix_HT_Quantite: productToAdd.prix_HT.$numberDecimal,
      tva: productToAdd.tva.valeur,
      somme_tva_Unitaire: productToAdd.somme_tva_catalogue.$numberDecimal,
      somme_tva_Quantite: productToAdd.somme_tva_catalogue.$numberDecimal,
      prix_Unitaire: productToAdd.prix_TTC_catalogue.$numberDecimal,
      prix_Quantite: productToAdd.prix_TTC_catalogue.$numberDecimal,
      total: productToAdd.prix_TTC_catalogue.$numberDecimal,
    };
    const existingProducts = JSON.parse(localStorage.getItem("products")) || [];

    const existingProductIndex = existingProducts.findIndex(
      (product) => product._id === productToAdd._id
    );
    if (existingProductIndex !== -1) {
      existingProducts[existingProductIndex].quantity += 1;

      existingProducts[existingProductIndex].point_Quantite =
        productToAdd.point_Produit *
        parseInt(existingProducts[existingProductIndex].quantity);

      existingProducts[existingProductIndex].somme_tva_Quantite =
        productToAdd.somme_tva_catalogue.$numberDecimal *
        parseInt(existingProducts[existingProductIndex].quantity);

      existingProducts[existingProductIndex].prix_HT_Quantite =
        productToAdd.prix_HT.$numberDecimal *
        parseInt(existingProducts[existingProductIndex].quantity);

      existingProducts[existingProductIndex].prix_Quantite =
        productToAdd.prix_TTC_catalogue.$numberDecimal *
        parseInt(existingProducts[existingProductIndex].quantity);

      existingProducts[existingProductIndex].total =
        parseFloat(productToAdd.prix_TTC_catalogue.$numberDecimal) *
        parseFloat(existingProducts[existingProductIndex].quantity);
    } else {
      existingProducts.push(data);
    }
    localStorage.setItem("products", JSON.stringify(existingProducts));
  };
  const updatedProducts = JSON.parse(localStorage.getItem("products"));

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      {produits.map((item, index) => (
        <div
          key={index}
          className="w-[90%] sm:w-[80%] md:w-[65%] max-sm:w-[85%] max-sm:mx-auto max-md:mx-auto text-center space-y-1"
        >
          <button onClick={() => nav(item)}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={buildImg(item?.photo)}
                alt=""
                className="h-[50%] w-[80%] justify-center text-center space-y-1"
                style={{ margin: "auto" }}
              />
              <h3 className="text-[#777777] text-[10px] sm:text-[12px] capitalize">
                {item?.nom}
              </h3>
              <h3 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold my-2 sm:my-4">
                {item?.prix_TTC_catalogue?.$numberDecimal}
              </h3>
            </div>
          </button>
          <button
            className="text-[10px] sm:text-[12px] md:text-[14px] max-lg:text-[10px] rounded-none p-2 sm:p-3 bg-[#0b5ed7] text-white uppercase max-sm:text-xs max-sm:rounded-none max-md:rounded-none max-md:text-xs font-semibold max-sm:p-2 max-md:p-3 mx-auto"
            onClick={() => {
              addOrUpdateProduct(item);
              showToast();
            }}
          >
            Ajouter Au Panier
          </button>
        </div>
      ))}
    </>
  );
};
export default Product;
