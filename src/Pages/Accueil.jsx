/* eslint-disable no-unused-vars */
import React from "react";
import Carousel from "../components/Accueil/Carousel";
import Tutorial from "../components/Accueil/Tutorial";
import Nos_Produits from "../components/Accueil/Nos_Produits";
import ProduitSpecial from "../components/Accueil/ProduitSpecial";
import CoinBonPlan from "../components/Accueil/CoinBonPlan";
import Formulations from "../components/Accueil/Formulations";
import VideoSpot from "../components/Accueil/VideoSpot"; // <— ajout

export default function Accueil() {
  return (
    <>
      <Carousel />

      <Nos_Produits
        titre="NOS PRODUITS COSMÉTIQUES"
        sousTitre="GAMME NOOR"
        filtreLibelle="NOOR"
        limit={6}
      />

      <Tutorial />

      <ProduitSpecial titre="NOS PRODUITS" sousTitre="PHARMA" query="PHARMA" limit={3} />

      <CoinBonPlan />
      <VideoSpot
        poster="/images/cream-on-skin.jpg"
        videoUrl="https://www.youtube.com/embed/xxxxx" // ou "/videos/spot.mp4"
        title="NOS PRODUITS DE BEAUTÉ EXCLUSIFS"
        subtitle="CRÉÉ POUR RENDRE VOTRE VIE PLUS BELLE"
      />
      <Formulations />
    </>
  );
}
