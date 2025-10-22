/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Confirmation = () => {
  return (
    <>
      <div className="py-5 bg-[#f8f8f8] mt-[90px]">
        <h3 className="text-xl uppercase text-start ml-[4%]">Registre</h3>
      </div>
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
            Attendez-vous la validation de l'adherent laajimi
          </p>
        </div>
      </div>
    </>
  );
};

export default Confirmation;
