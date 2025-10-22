/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Country } from "country-state-city";

import "react-country-state-city/dist/react-country-state-city.css";

import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import Gouvernerat from "../utils/Gouvernerat.json";
import { useNavigate } from "react-router-dom";
const Registre = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const navigate = useNavigate();
  const [Gouvernerats, SetGouvernerats] = useState(Gouvernerat);
  const [NomGouvernerat, SetNomGouvernerat] = useState("");
  const [cities, setCities] = useState([
    {
      Nom: "",
      value: "",
    },
  ]);
  const products = JSON.parse(localStorage.getItem("products")) || [];

  let [timber, Setimber] = useState(0);
  const [countryid, setCountryid] = useState(0);
  const [stateid, setstateid] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "",
    isoCode: "",
  });

  const [Adresse, SetAdresse] = useState({
    pays: "",
    Gouvernorat: "",
    Ville: "",
    adresse: "",
    numeroTel: "",
  });
  const [modelivraisons, SetModeLivraisons] = useState([]);
  const [Transporteurs, SetTransporteurs] = useState([]);
  const [viewFindAdherent, SetViewAdherent] = useState(true);
  const [viewAdresse, SetViewAdresse] = useState(false);
  const [viewSucces, SetViewSecces] = useState(false);
  const [Identifiant, SetIdentiafiant] = useState("");
  const [adherent, SetAdherent] = useState();
  const findAdherentByIdentifiant = async () => {
    try {
      await axios
        .post(process.env.API_URL + "/identifiant", {
          identifiant: Identifiant,
        })
        .then((response) => {
          if (response?.status == 200 && response?.statusText == "OK") {
            SetAdherent(response?.data?.result);
            SetViewAdresse(true);
          }
        });
    } catch (error) {
      if (error?.response?.data?.msg == "adherent n'existe pas") {
        console.log(error?.response?.data?.msg);
        toast.error("adherent n'existe pas !");
        SetAdherent("");
        SetViewAdresse(false);
      }
    }
  };

  const [commande, SetCommande] = useState({
    nature_Commande: "vente en ligne",
    adherent: "",
    client: "",
    nom: "",
    prenom: "",
    email: "",
    numero_Tel1_Inscrit: "",
    adresse_livraison: {},
    mode_livraison: "",
    mode_paiement: "",
    livreur: "",
    item: [],
    total: 0,
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;

    SetCommande({ ...commande, [name]: value });

    if (name === "numero_Tel1_Inscrit") {
      Adresse.numeroTel = value;
    }
  };

  const handleGouvernoratChange = (event) => {
    const selectedGouv = event.target.value;
    Adresse.Gouvernorat = event.target.value;
    SetNomGouvernerat(selectedGouv);
    let gouvernorat = Gouvernerats.Gouvernorat.find(
      (g) => g.Nom === selectedGouv
    );
    setCities(gouvernorat ? gouvernorat?.Villes : []);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let findTimber = async () => {
    try {
      await axios
        .get(process.env.API_URL + "/timberby_etat")
        .then((response) => {
          Setimber(response?.data?.result?.valeur.$numberDecimal);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllTransport = async () => {
    try {
      await axios.get(process.env.API_URL + "/livreur").then((response) => {
        SetTransporteurs(response?.data?.result);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    if (value.length != 0) {
      getModeLivraisonById(value);
      SetCommande({ ...commande, [name]: value });
    }
  };

  const [FraisTransport, SetFraisTransport] = useState(0);
  const [viewTransporteur, SetViewTransporteur] = useState(false);
  const [MontanTotal, SetMontantTotal] = useState(0);
  const [modePaiement, SetModePaiement] = useState([]);
  const getModeLivraisonById = async (id) => {
    try {
      await axios
        .get(process.env.API_URL + "/modelivraison/" + id)
        .then((response) => {
          if (response?.data?.result.nom === "Siège") {
            SetFraisTransport(0);
            SetViewTransporteur(false);
            SetMontantTotal(
              parseFloat(
                parseFloat(MontanTotal) - parseFloat(FraisTransport)
              ).toFixed(3)
            );
          }
          if (response?.data?.result.nom === "Transporteur") {
            SetViewTransporteur(true);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = () => {
    let s = 0;
    for (let i = 0; i < products.length; i++) {
      s = s + parseFloat(products[i].total);
    }

    SetMontantTotal(parseFloat(parseFloat(s) + parseFloat(timber)).toFixed(3));
  };

  const calculateTotalItem = () => {
    return products.reduce(
      (total, item) =>
        parseFloat(parseFloat(total) + parseFloat(item.total)).toFixed(3),
      0
    );
  };

  const findAllModLivraison = async () => {
    try {
      await axios
        .get(process.env.API_URL + "/modelivraison")
        .then((response) => {
          SetModeLivraisons(response?.data?.result);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllModePaiement = async () => {
    try {
      await axios
        .get(process.env.API_URL + "/mode_paiement_boutique")
        .then((response) => {
          SetModePaiement(response?.data?.result);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    //SetMontantTotal(cartContext.cartTotal + parseFloat(timber));
    setSelectedCountry(Country.getAllCountries()[223]);
    Adresse.pays = Country.getAllCountries()[223].name;
    setCountryid(224);
    findAllModLivraison();
    getAllTransport();
    getAllModePaiement();
    calculateTotal();
    findTimber();
  }, [timber]);

  const getTransporteurById = async (id) => {
    try {
      let frais = 0;
      await axios
        .get(process.env.API_URL + "/livreur/" + id)
        .then((response) => {
          SetFraisTransport(
            response?.data?.result.livraison_TTC.$numberDecimal
          );
          frais = parseFloat(
            response?.data?.result.livraison_TTC.$numberDecimal
          );

          SetMontantTotal(
            parseFloat(parseFloat(MontanTotal) + parseFloat(frais)).toFixed(3)
          );
        });
    } catch (error) {
      alert(error);
    }
  };

  const onChangeSelectPaiement = (e) => {
    const { name, value } = e.target;

    if (value.length === 0) return false;
    SetCommande({ ...commande, [name]: value });
  };

  const onChangeSelectTransporteur = (e) => {
    const { name, value } = e.target;

    if (value.length === 0) return false;
    getTransporteurById(value);
    SetCommande({ ...commande, [name]: value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    commande.adresse_livraison = Adresse;
    commande.item = products;
    commande.total = MontanTotal;
    commande.adherent = adherent._id;
    commande.client = commande.nom;
    setIsDisabled(true);
    try {
      await axios
        .post(process.env.API_URL + "/vente_enligne", {
          client: commande.nom,
          nom: commande.nom,
          prenom: commande.prenom,
          email: commande.email,
          numero_Tel1_Inscrit: commande.numero_Tel1_Inscrit,
          adherent: adherent._id,
          mode_livraison: commande.mode_livraison,
          mode_paiement: commande.mode_paiement,
          livreur: commande.livreur,
          item: products,
          adresse_livraison: Adresse,
        })
        .then((response) => {
          SetViewAdherent(false);
          SetViewAdresse(false);
          SetViewSecces(true);
          localStorage.removeItem("products");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>


      {viewFindAdherent && (
        <div>
          <div className="p-10 max-sm:p-4">
            <h3 className="text-start font-medium text-2xl my-3 uppercase">
              Informations
            </h3>
            <div className=" border border-slate-200">
              <div className=" uppercase grid grid-cols-2 max-sm:grid-cols-1 p-[30px] lg:space-x-3 max-md:space-x-3 max-sm:space-x-0 max-lg:space-x-3 ">
                <div>
                  <label htmlFor="identifiant">Identifiant Adherent</label>
                  <input
                    type="text"
                    name="identifiant"
                    id="identifiant"
                    placeholder="Identifiant Adherent"
                    onChange={(e) => SetIdentiafiant(e.target.value)}
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                </div>
                <div>
                  <button
                    onClick={() => {
                      findAdherentByIdentifiant();
                    }}
                    className="uppercase lg:mt-[34px] max-md:mt-[34px] max-lg:mt-[34px] max-sm:w-full max-sm:text-xs bg-[#aacbda] hover:bg-[#fff] hover:text-[#000] max-sm:px-2 max-sm:py-3 px-5 py-[9px] text-white border-2 border-[#aacbda] uppercase font-bold"
                    style={{ borderRadius: "15px" }}
                  >
                    Verifier Adherent
                  </button>
                </div>
              </div>
              <div className="uppercase grid grid-cols-2 max-sm:grid-cols-1 px-[30px] mt-[-20px] pb-[30px] lg:space-x-3 max-md:space-x-3 max-sm:space-x-0 max-lg:space-x-3">
                <div>
                  <label htmlFor="nom-adh" className="font-medium">
                    Nom Adherent
                  </label>
                  <input
                    type="text"
                    id="nom-adh"
                    placeholder="Nom Adherent"
                    name="nom-adh"
                    disabled
                    defaultValue={adherent?.nom}
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-[#e9ecef] text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                </div>
                <div>
                  <label htmlFor="prenom-adh" className="font-medium uppercase">
                    Prenom Adherent
                  </label>
                  <input
                    type="text"
                    placeholder="Prenom Adherent"
                    disabled
                    id="prenom-adh"
                    name="prenom-adh"
                    defaultValue={adherent?.prenom}
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-[#e9ecef] text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                </div>
              </div>
            </div>
            <ToastContainer position="top-left" />
          </div>
        </div>
      )}

      {/* details */}
      {viewAdresse && (
        <div className="p-10 max-sm:p-4 max-md:p-4">
          <div className="grid grid-cols-2 max-sm:grid-cols-1 max-md:grid-cols-1">
            <div className="px-10 max-sm:px-4 max-md:px-4">
              <h3 className="text-xl uppercase text-start py-3">
                Billing Details
              </h3>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 my-4 lg:space-x-3 max-md:space-x-3 max-lg:space-x-3 max-sm:space-x-0">
                <div>
                  <label htmlFor="nom" className="font-medium">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    onChange={onChangeInput}
                    placeholder="Nom "
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                  <span className="error-message">
                    {errors.nom && "nom est obligatoire"}
                  </span>
                </div>
                <div>
                  <label htmlFor="prenom" className="font-medium">
                    Prenom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    placeholder="Prenom "
                    onChange={onChangeInput}
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                  <span className="error-message">
                    {errors.prenom && "prenom est obligatoire"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 max-sm:grid-cols-1 my-4 lg:space-x-3 max-md:space-x-3 max-lg:space-x-3 max-sm:space-x-0">
                <div>
                  <label htmlFor="telephone" className="font-medium my-2">
                    Numero Telephone
                  </label>
                  <input
                    type="tel"
                    name="numero_Tel1_Inscrit"
                    placeholder="Numero Telephone"
                    onChange={onChangeInput}
                    pattern="[0-9]{2}[0-9]{3}[0-9]{3}"
                    required
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                  <span className="error-message">
                    {errors.numero_Tel1_Inscrit &&
                      "Numero téléphone est obligatoire"}
                  </span>
                </div>
                <div>
                  <label htmlFor="email" className="font-medium my-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={onChangeInput}
                    className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                    style={{ borderRadius: "15px" }}
                  />
                  <span className="error-message">
                    {errors.email && "email est obligatoire"}
                  </span>
                </div>
              </div>
              <div className="my-4">
                <label>Gouvernorat</label>

                <select
                  className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                  style={{ borderRadius: "15px" }}
                  onChange={handleGouvernoratChange}
                  id="Gouvernorat"
                  value={NomGouvernerat}
                >
                  <option value=""> Selectionnez votre Gouvernorat</option>

                  {Gouvernerats.Gouvernorat.map((item, index) => (
                    <option key={index} value={item.Nom}>
                      {item.Nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-4">
                <label>Ville</label>
                <select
                  className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                  style={{ borderRadius: "15px" }}
                  onChange={(e) => {
                    Adresse.Ville = e.target.value;
                  }}
                  name="ville"
                >
                  <option value=""> Selectionnez votre Ville</option>

                  {cities.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.Nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-4">
                <label htmlFor="address" className="font-medium my-2">
                  Adresse et Code Postal
                </label>
                <input
                  type="text"
                  placeholder="Adresse et Code Postal"
                  name="adresse"
                  {...register("state", { required: true })}
                  onChange={(e) => {
                    Adresse.adresse = e.target.value;
                  }}
                  className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                  style={{ borderRadius: "15px" }}
                />
                <span className="error-message">
                  {errors.state && "adresse est obligatoire"}
                </span>
              </div>
            </div>

            {products && products.length > 0 ? (
              <div className="p-10 max-sm:p-4 border border-slate-200 bg-[#f9f9f9]">
                <ul className="flex flex-row max-sm:space-x-16 space-x-52 max-md:space-x-44 max-lg:space-x-24 max-xl:space-x-32 border-b-2 pb-5">
                  <li>Photo</li>
                  <li>Produit</li>
                  <li>Totale</li>
                </ul>

                {products.map((item, index) => (
                  <ul
                    key={index}
                    className="flex flex-row border-b-2 py-[5px] max-sm:space-x-14 space-x-48 max-md:space-x-[148px] max-lg:space-x-[60px] max-xl:space-x-[100px]"
                  >
                    <li>
                      <img
                        src={process.env.API_URL + item.photo}
                        alt="img"
                        className="w-[75px] max-sm:w-[40px]"
                      />
                    </li>
                    <li className="my-auto">
                      {item.nom} × {item.quantity}
                    </li>
                    <li className="my-auto">
                      {parseFloat(item.total).toFixed(3)}
                    </li>
                  </ul>
                ))}

                <ul className="border-b-2 pb-5">
                  <li className="pt-5 space-x-[440px] max-sm:space-x-32 max-md:space-x-96 max-lg:space-x-40 max-xl:space-x-72 flex flex-row">
                    <span>Sous Total</span>
                    <span className="text-[#ff4c3b]">
                      {" "}
                      {calculateTotalItem()} DT
                    </span>
                  </li>
                  <li className="pt-5 space-x-60 max-sm:space-y-5 max-md:space-x-48 max-sm:space-x-0 max-lg:space-x-9 max-xl:space-x-32 flex flex-row max-sm:flex-col">
                    <span className="my-auto">Mode de Livraison</span>
                    <p className="grid w-[100%] xl:w-[40%] lg:w-[40%] ">
                      <select
                        className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                        style={{ borderRadius: "15px" }}
                        onChange={handleChangeInput}
                        name="mode_livraison"
                      >
                        <option value="">Mode de Livraison</option>
                        {modelivraisons.map((m) => (
                          <option value={m._id} key={m._id}>
                            {m.nom}
                          </option>
                        ))}
                      </select>
                    </p>
                  </li>

                  {viewTransporteur && (
                    <>
                      <li className="pt-5 space-x-60 max-sm:space-y-5 max-md:space-x-48 max-sm:space-x-0 max-lg:space-x-9 max-xl:space-x-32 flex flex-row max-sm:flex-col">
                        <span className="my-auto"> Transporteur</span>
                        <p className="grid w-[100%] xl:w-[40%] lg:w-[40%] ">
                          <select
                            className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                            style={{ borderRadius: "15px" }}
                            onChange={onChangeSelectTransporteur}
                            name="livreur"
                          >
                            <option value="">Mode de transport</option>
                            {Transporteurs.map((m) => (
                              <option value={m._id} key={m._id}>
                                {m.nom_Livreur}
                              </option>
                            ))}
                          </select>
                        </p>
                      </li>

                      <li className="py-5 space-x-[440px] max-sm:space-x-40 max-md:space-x-96 max-lg:space-x-44 max-xl:space-x-[310px] flex flex-row">
                        <span> Frais de Transport</span>
                        <span className="text-[#ff4c3b]">
                          {" "}
                          {FraisTransport} DT
                        </span>
                      </li>
                    </>
                  )}
                  <li className="pt-5 space-x-[236px] max-sm:space-y-5 max-md:space-x-48 max-sm:space-x-0 max-lg:space-x-7 max-xl:space-x-32 flex flex-row max-sm:flex-col">
                    <span className="my-auto">Mode de Paiement</span>
                    <p className="grid w-[100%] xl:w-[40%] lg:w-[40%] ">
                      <select
                        className="my-3 MuiInput-input w-full text-sm leading-5 px-3 py-3 rounded-none shadow-md dark:shadow-slate-900  focus:shadow-lg border border-solid border-slate-300 focus:border-darkmode-500 dark:focus:border-darkmode-500 dark:border-slate-600 bg-white text-black  focus-visible:outline-0"
                        style={{ borderRadius: "15px" }}
                        onChange={onChangeSelectPaiement}
                        name="mode_paiement"
                      >
                        <option value="">Mode de Paiement</option>
                        {modePaiement.map((m) => (
                          <option value={m._id} key={m._id}>
                            {m.mode}
                          </option>
                        ))}
                      </select>
                    </p>
                  </li>
                </ul>
                <ul>
                  <li className="py-5 space-x-[440px] max-sm:space-x-40 max-md:space-x-96 max-lg:space-x-44 max-xl:space-x-[310px] flex flex-row">
                    <span>Timber</span>
                    <span className="text-[#ff4c3b]">{timber} DT</span>
                  </li>
                  <li className="pb-5 space-x-[455px] max-sm:space-x-44 max-md:space-x-[400px] max-lg:space-x-48 max-xl:space-x-80 flex flex-row">
                    <span>Total</span>
                    <span className="text-[#ff4c3b]">{MontanTotal}DT</span>
                  </li>
                </ul>
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex lg:justify-between max-md:justify-between max-lg:justify-between max-sm:space-x-5 max-md:space-x-12 max-lg:space-x-12 max-sm:p-2 max-md:p-2 max-lg:p-4 max-xl:p-4 px-10 mt-3">
            <div>
              <button
                onClick={() => {
                  navigate("/");
                }}
                style={{ borderRadius: "15px" }}
                className="max-sm:px-2 hover:bg-white hover:text-black text-white border-[#ff4c3b] border-2 px-7 py-2 bg-[#ff4c3b]"
              >
                Precendent
              </button>
            </div>
            <div>
              <button
                disabled={isDisabled}
                style={{ borderRadius: "15px" }}
                className="max-sm:px-2 hover:bg-white hover:text-black text-white border-[#ff4c3b] border-2 px-7 py-2 bg-[#ff4c3b]"
                onClick={onSubmit}
              >
                Passer la commande
              </button>
               <Link to="confirmation">
             
              </Link> 
            </div>
          </div>
        </div>
      )}

      {viewSucces && (
        <div className="p-20">
          <div className="flex flex-col text-center space-y-5  bg-[#f9f9f9] p-32">
            <h3 className="text-center">
              <FaCheckCircle className="mx-auto text-4xl text-[#4ead4e]" />
            </h3>
            <h3 className="text-4xl font-medium uppercase">Merci</h3>
            <p className="text-[#777777] text-xl">
              Votre commande a bien été enregistrée !
            </p>
            <p className="text-[#777777] text-xl">
              Attendez-vous la validation de l'adherent {adherent.nom}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Registre;
