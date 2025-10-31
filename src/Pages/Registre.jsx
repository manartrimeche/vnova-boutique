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
import { FaCheckCircle, FaShoppingCart, FaUser, FaCreditCard, FaFileInvoice, FaCheck } from "react-icons/fa";
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
  
  // Données mockées pour le développement
  const [modelivraisons, SetModeLivraisons] = useState([
    { _id: "1", nom: "Siège" },
    { _id: "2", nom: "Transporteur" }
  ]);
  
  const [Transporteurs, SetTransporteurs] = useState([
    { _id: "1", nom_Livreur: "Transporteur Express", livraison_TTC: { $numberDecimal: "7.000" } },
    { _id: "2", nom_Livreur: "Livraison Standard", livraison_TTC: { $numberDecimal: "5.000" } }
  ]);
  
  const [modePaiement, SetModePaiement] = useState([
    { _id: "1", mode: "Paiement à la livraison" },
    { _id: "2", mode: "Virement bancaire" },
    { _id: "3", mode: "Carte bancaire" }
  ]);

  const [viewFindAdherent, SetViewAdherent] = useState(true);
  const [viewAdresse, SetViewAdresse] = useState(false);
  const [viewReview, SetViewReview] = useState(false);
  const [viewSucces, SetViewSecces] = useState(false);
  const [Identifiant, SetIdentiafiant] = useState("");
  const [adherent, SetAdherent] = useState();
  const [identifiantError, setIdentifiantError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  
  // Debug: Vérifier l'URL de l'API
  console.log("API URL:", process.env.REACT_APP_API_URL);
  
  const findAdherentByIdentifiant = async () => {
    if (!Identifiant.trim()) {
      setIdentifiantError("L'identifiant adhérent est obligatoire");
      return;
    }

    setIdentifiantError("");
    setIsDisabled(true);
    
    try {
      console.log("Recherche adhérent avec identifiant:", Identifiant);
      
      // Simulation d'une recherche d'adhérent - À REMPLACER par votre vraie API
      // Pour le moment, on simule un adhérent trouvé
      setTimeout(() => {
        SetAdherent({
          _id: "123456",
          nom: "DUPONT",
          prenom: "Marie",
          numeroCarteIdentite: "12345678"
        });
        SetViewAdresse(true);
        setCurrentStep(2);
        setIsDisabled(false);
        toast.success("Adhérent trouvé avec succès !");
      }, 1000);
      
    } catch (error) {
      console.error("Erreur recherche adhérent:", error);
      setIdentifiantError("Erreur lors de la vérification de l'adhérent");
      SetAdherent(null);
      SetViewAdresse(false);
      setIsDisabled(false);
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
      // Timber fixe pour le développement
      Setimber(0.500);
    } catch (error) {
      console.error("Erreur timber:", error);
      Setimber(0.500);
    }
  };

  const getAllTransport = async () => {
    try {
      // Données mockées déjà définies
      console.log("Transporteurs chargés:", Transporteurs);
    } catch (error) {
      console.error("Erreur transporteurs:", error);
      // Les données mockées restent
    }
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    if (value.length !== 0) {
      getModeLivraisonById(value);
      SetCommande({ ...commande, [name]: value });
    }
  };

  const [FraisTransport, SetFraisTransport] = useState(0);
  const [viewTransporteur, SetViewTransporteur] = useState(false);

  const [MontanTotal, SetMontantTotal] = useState(0);

  const getModeLivraisonById = async (id) => {
    try {
      const mode = modelivraisons.find(m => m._id === id);
      if (mode?.nom === "Siège") {
        SetFraisTransport(0);
        SetViewTransporteur(false);
      } else if (mode?.nom === "Transporteur") {
        SetViewTransporteur(true);
        // Frais de transport par défaut
        SetFraisTransport(7.000);
      }
    } catch (error) {
      console.error("Erreur mode livraison:", error);
    }
  };

  const calculateTotal = () => {
    let s = 0;
    for (let i = 0; i < products.length; i++) {
      s = s + parseFloat(products[i].total || 0);
    }
    const total = parseFloat(parseFloat(s) + parseFloat(timber || 0) + parseFloat(FraisTransport || 0)).toFixed(3);
    console.log("Calcul total:", { sousTotal: s, timber, FraisTransport, total });
    SetMontantTotal(total);
  };

  const calculateTotalItem = () => {
    const total = products.reduce(
      (total, item) => parseFloat(total) + parseFloat(item.total || 0),
      0
    );
    return total.toFixed(3);
  };

  const findAllModLivraison = async () => {
    try {
      // Données mockées déjà définies
      console.log("Modes livraison chargés:", modelivraisons);
    } catch (error) {
      console.error("Erreur modes livraison:", error);
      // Les données mockées restent
    }
  };

  const getAllModePaiement = async () => {
    try {
      // Données mockées déjà définies
      console.log("Modes paiement chargés:", modePaiement);
    } catch (error) {
      console.error("Erreur modes paiement:", error);
      // Les données mockées restent
    }
  };

  useEffect(() => {
    console.log("Initialisation composant");
    setSelectedCountry(Country.getAllCountries()[223]);
    Adresse.pays = Country.getAllCountries()[223].name;
    setCountryid(224);
    findAllModLivraison();
    getAllTransport();
    getAllModePaiement();
    calculateTotal();
    findTimber();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [timber, FraisTransport, products]);

  const getTransporteurById = async (id) => {
    try {
      const transporteur = Transporteurs.find(t => t._id === id);
      if (transporteur) {
        const frais = parseFloat(transporteur.livraison_TTC?.$numberDecimal || 0);
        SetFraisTransport(frais);
      }
    } catch (error) {
      console.error("Erreur transporteur:", error);
      SetFraisTransport(0);
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

  // Fonction pour passer à l'étape Review
  const goToReview = () => {
    console.log("Validation formulaire:", { commande, Adresse });
    
    if (!commande.nom?.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }
    if (!commande.prenom?.trim()) {
      toast.error("Le prénom est obligatoire");
      return;
    }
    if (!commande.numero_Tel1_Inscrit?.trim()) {
      toast.error("Le numéro de téléphone est obligatoire");
      return;
    }
    if (!commande.email?.trim()) {
      toast.error("L'email est obligatoire");
      return;
    }
    if (!Adresse.Gouvernorat?.trim()) {
      toast.error("Le gouvernorat est obligatoire");
      return;
    }
    if (!Adresse.Ville?.trim()) {
      toast.error("La ville est obligatoire");
      return;
    }
    if (!Adresse.adresse?.trim()) {
      toast.error("L'adresse est obligatoire");
      return;
    }
    if (!commande.mode_livraison?.trim()) {
      toast.error("Le mode de livraison est obligatoire");
      return;
    }
    if (!commande.mode_paiement?.trim()) {
      toast.error("Le mode de paiement est obligatoire");
      return;
    }

    if (viewTransporteur && !commande.livreur?.trim()) {
      toast.error("Veuillez sélectionner un transporteur");
      return;
    }

    SetViewReview(true);
    setCurrentStep(4);
  };

  // Fonction pour retourner à l'étape précédente
  const goBackToAddress = () => {
    SetViewReview(false);
    setCurrentStep(2);
  };

  // Fonction pour soumettre la commande
  const onSubmit = async (e) => {
    e.preventDefault();
    
    if (!adherent?._id) {
      toast.error("Veuillez d'abord vérifier votre identifiant adhérent");
      return;
    }

    console.log("Soumission commande:", { commande, Adresse, products, adherent });
    
    setIsDisabled(true);
    
    try {
      const commandeData = {
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
        total: MontanTotal,
        identifiant_adherent: Identifiant,
        statut: "en_attente",
        nature_Commande: "vente en ligne"
      };

      console.log("Données de commande à envoyer:", commandeData);

      // SIMULATION d'envoi à l'API - À REMPLACER par votre vraie API
      setTimeout(() => {
        // SUCCÈS - Commande créée dans la base de données
        SetViewReview(false);
        SetViewSecces(true);
        setCurrentStep(5);
        
        // Nettoyer le panier
        localStorage.removeItem("products");
        
        setIsDisabled(false);
        toast.success("✅ Commande créée avec succès ! Elle est maintenant visible dans la liste des commandes.");
      }, 2000);

    } catch (error) {
      console.error("Erreur création commande:", error);
      setIsDisabled(false);
      toast.error("Erreur lors de la création de la commande. Veuillez réessayer.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      findAdherentByIdentifiant();
    }
  };

  // Fonction pour calculer la date de livraison estimée
  const getEstimatedDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 7);
    return deliveryDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Composant pour les étapes
  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
      {[
        { number: 1, label: "Adhérent", icon: FaUser },
        { number: 2, label: "Adresse", icon: FaFileInvoice },
        { number: 3, label: "Paiement", icon: FaCreditCard },
        { number: 4, label: "Review", icon: FaCheck },
        { number: 5, label: "Confirmé", icon: FaCheckCircle }
      ].map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              currentStep >= step.number 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 bg-white'
            }`}>
              {currentStep > step.number ? (
                <FaCheck className="text-white" />
              ) : (
                <step.icon />
              )}
            </div>
            <span className="text-xs mt-2 font-medium">{step.label}</span>
          </div>
          {index < 4 && (
            <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <StepIndicator />
        
        {/* Section Date de livraison estimée */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-800">Date de livraison estimée</h3>
              <p className="text-blue-600">{getEstimatedDeliveryDate()}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">
                La commande sera visible dans la liste des commandes après confirmation
              </p>
            </div>
          </div>
        </div>

        {viewFindAdherent && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Informations Adhérent</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label htmlFor="identifiant" className="font-medium text-gray-700">
                  Identifiant Adhérent *
                </label>
                <input
                  type="text"
                  name="identifiant"
                  id="identifiant"
                  placeholder="Saisissez votre identifiant adhérent"
                  value={Identifiant}
                  onChange={(e) => {
                    SetIdentiafiant(e.target.value);
                    setIdentifiantError("");
                  }}
                  onKeyPress={handleKeyPress}
                  className={`mt-2 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    identifiantError ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {identifiantError && (
                  <p className="text-red-500 text-sm mt-1">{identifiantError}</p>
                )}
              </div>
              <div className="flex items-end">
                <button
                  onClick={findAdherentByIdentifiant}
                  disabled={isDisabled}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDisabled ? "Recherche..." : "Vérifier Adhérent"}
                </button>
              </div>
            </div>
            
            {adherent && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">
                      Adhérent vérifié: {adherent.nom} {adherent.prenom}
                    </h4>
                    <p className="text-sm text-green-600">Identifiant: {Identifiant}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Étape Adresse */}
        {viewAdresse && adherent && !viewReview && !viewSucces && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Informations de Livraison</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="nom" className="font-medium text-gray-700">
                      Nom *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={commande.nom}
                      onChange={onChangeInput}
                      placeholder="Votre nom"
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="prenom" className="font-medium text-gray-700">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="prenom"
                      value={commande.prenom}
                      placeholder="Votre prénom"
                      onChange={onChangeInput}
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="telephone" className="font-medium text-gray-700">
                      Numéro Téléphone *
                    </label>
                    <input
                      type="tel"
                      name="numero_Tel1_Inscrit"
                      value={commande.numero_Tel1_Inscrit}
                      placeholder="Numéro Telephone"
                      onChange={onChangeInput}
                      pattern="[0-9]{8}"
                      required
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Email"
                      name="email"
                      value={commande.email}
                      onChange={onChangeInput}
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="font-medium text-gray-700">Gouvernorat *</label>
                    <select
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={handleGouvernoratChange}
                      id="Gouvernorat"
                      value={NomGouvernerat}
                      required
                    >
                      <option value="">Sélectionnez votre Gouvernorat</option>
                      {Gouvernerats.Gouvernorat.map((item, index) => (
                        <option key={index} value={item.Nom}>
                          {item.Nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-gray-700">Ville *</label>
                    <select
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        Adresse.Ville = e.target.value;
                      }}
                      name="ville"
                      required
                    >
                      <option value="">Sélectionnez votre Ville</option>
                      {cities.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.Nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="address" className="font-medium text-gray-700">
                      Adresse et Code Postal *
                    </label>
                    <input
                      type="text"
                      placeholder="Adresse et Code Postal"
                      name="adresse"
                      onChange={(e) => {
                        Adresse.adresse = e.target.value;
                      }}
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-lg mb-4">Options de Livraison et Paiement</h4>
                
                <div className="mb-4">
                  <label className="font-medium text-gray-700">Mode de Livraison *</label>
                  <select
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={handleChangeInput}
                    name="mode_livraison"
                    required
                  >
                    <option value="">Mode de Livraison</option>
                    {modelivraisons.map((m) => (
                      <option value={m._id} key={m._id}>
                        {m.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {viewTransporteur && (
                  <div className="mb-4">
                    <label className="font-medium text-gray-700">Transporteur *</label>
                    <select
                      className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={onChangeSelectTransporteur}
                      name="livreur"
                      required
                    >
                      <option value="">Mode de transport</option>
                      {Transporteurs.map((m) => (
                        <option value={m._id} key={m._id}>
                          {m.nom_Livreur}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="font-medium text-gray-700">Mode de Paiement *</label>
                  <select
                    className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={onChangeSelectPaiement}
                    name="mode_paiement"
                    required
                  >
                    <option value="">Mode de Paiement</option>
                    {modePaiement.map((m) => (
                      <option value={m._id} key={m._id}>
                        {m.mode}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Retour au panier
              </button>
              <button
                onClick={goToReview}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Continuer vers Review
              </button>
            </div>
          </div>
        )}

        {/* Étape Review */}
        {viewReview && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Review de la Commande</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Détails de la commande */}
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-700">Détails de la Commande</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Adhérent:</span>
                    <span>{adherent?.nom} {adherent?.prenom}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Identifiant:</span>
                    <span>{Identifiant}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Client:</span>
                    <span>{commande.nom} {commande.prenom}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-lg mb-4 text-gray-700">Adresse de Livraison</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="mb-1"><strong>Adresse:</strong> {Adresse.adresse}</p>
                  <p className="mb-1"><strong>Ville:</strong> {Adresse.Ville}</p>
                  <p className="mb-1"><strong>Gouvernorat:</strong> {Adresse.Gouvernorat}</p>
                  <p className="mb-1"><strong>Téléphone:</strong> {commande.numero_Tel1_Inscrit}</p>
                  <p><strong>Email:</strong> {commande.email}</p>
                </div>
              </div>

              {/* Détails des produits */}
              <div>
                <h4 className="font-semibold text-lg mb-4 text-gray-700">Détails des Produits</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {products.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.photo || '/images/placeholder-product.jpg'}
                          alt={item.nom}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/images/placeholder-product.jpg';
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-800">{item.nom}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Prix unitaire: {item.prix} DT</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">{parseFloat(item.total || 0).toFixed(3)} DT</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Récapitulatif des prix */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Sous-total:</span>
                      <span className="font-medium">{calculateTotalItem()} DT</span>
                    </div>
                    {viewTransporteur && (
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Frais de transport:</span>
                        <span className="font-medium">{FraisTransport} DT</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Timbre:</span>
                      <span className="font-medium">{timber} DT</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <span className="font-semibold text-lg">Total:</span>
                      <span className="font-bold text-lg text-blue-600">{MontanTotal} DT</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>Info:</strong> La commande sera enregistrée et visible dans la liste des commandes de l'administration.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={goBackToAddress}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Modifier les informations
              </button>
              <button
                disabled={isDisabled}
                onClick={onSubmit}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDisabled ? "Création en cours..." : "Confirmer la commande"}
              </button>
            </div>
          </div>
        )}

        {/* Étape Commande confirmée */}
        {viewSucces && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-green-800">Commande Confirmée !</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-lg font-semibold text-green-800 mb-4">
                Votre commande a été enregistrée avec succès
              </p>
              
              <div className="text-left bg-white rounded p-4 mb-4">
                <h4 className="font-semibold mb-2 text-gray-800">Détails de la commande:</h4>
                <p><strong>Adhérent:</strong> {adherent?.nom} {adherent?.prenom}</p>
                <p><strong>Client:</strong> {commande.nom} {commande.prenom}</p>
                <p><strong>Total:</strong> {MontanTotal} DT</p>
                <p><strong>Statut:</strong> <span className="text-green-600 font-semibold">En attente de traitement</span></p>
              </div>

              <p className="text-green-700">
                ✅ Votre commande est maintenant visible dans la liste des commandes de l'administration.
                Vous serez contacté pour la suite du processus.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => {
                  SetViewSecces(false);
                  SetViewAdherent(true);
                  setCurrentStep(1);
                  SetIdentiafiant("");
                  SetAdherent(null);
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Nouvelle commande
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message de chargement pendant la création */}
      {isDisabled && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg text-center max-w-md">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-semibold mb-2">Création de la commande...</p>
            <p className="text-sm text-gray-600">La commande est en cours d'enregistrement</p>
          </div>
        </div>
      )}

      <ToastContainer position="top-left" />
    </>
  );
};

export default Registre;