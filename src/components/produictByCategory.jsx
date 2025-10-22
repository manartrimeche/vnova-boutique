/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
const Product = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <Link
          to={"/product_details"}
          state={{
            item,
          }}
          className="w-[65%] max-sm:w-[80%] max-sm:mx-auto max-md:mx-auto text-center space-y-1"
          key={index}
        >
          <div>
            <img
              src={process.env.API_URL + item?.photo}
              alt=""
              className="h-[70%]"
            />
            <h3 className="text-[#777777] text-[14px] capitalize">
              {item?.nom}
            </h3>
            <h3 className="text-[18p] font-bold my-4">
              {item?.prix_TTC_catalogue?.$numberDecimal}
            </h3>
            <button className="text-[14px] max-lg:text-[10px] rounded-none p-3 bg-[#0b5ed7] text-white uppercase max-sm:text-xs max-sm:rounded-none max-md:rounded-none max-md:text-xs font-semibold max-sm:p-2 max-md:p-3">
              Ajouter Au Panier
            </button>
          </div>
        </Link>
      ))}
    </>
  );
};

export default Product;
