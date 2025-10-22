/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { IoMegaphoneOutline } from "react-icons/io5";
import { AiOutlineFieldTime } from "react-icons/ai";
import axios from "axios";

import Markdown from "react-markdown";
import gfm from "remark-gfm";
const Conditiongenerale = () => {
  const [title, SetTite] = useState("");
  const [description, SetDescription] = useState("");
  const [image, SetImage] = useState("");

  const getConditionGenerale = async () => {
    try {
      // eslint-disable-next-line no-undef
      await axios
        .get(process.env.API_URL + "/page_condition")
        .then((response) => {
          SetTite(response.data.title);
          SetDescription(response.data.description);
          SetImage(response.data.imgUrl);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConditionGenerale();
  }, []);

  return (
    <>
      <div className="py-5 bg-[#f8f8f8] mt-[90px] max-sm:mt-[80px] max-md:mt-[108px] max-lg:mt-[109px] max-xl:mt-[80px]">
        <Markdown className="text-xl uppercase text-start ml-[4%]">
          {title}
        </Markdown>
        {/* <h3 className="text-xl uppercase text-start ml-[4%]">A PROPOS</h3> */}
      </div>
      <div>
        <div className="p-20 max-sm:p-3 max-md:p-5">
          <img src={process.env.API_URL + image} alt="" className="mb-10" />

          <Markdown remarkPlugins={[gfm]}>{description}</Markdown>

          <div className="mt-[85px] border-t-2 border-b-2">
            <div className="flex flex-col grid lg:grid-cols-3 max-md:grid-cols-3 max-lg:grid-cols-3 max-sm:grid-cols-1 gap-10 max-sm:gap-0 max-md:gap-5 p-12 max-sm:p-3 max-md:p-5">
              <div className="flex flex-row lg:border-r-2 max-md:border-r-2 max-sm:border-r-0 max-sm:border-b-2 hover:text-[#f0b54d]">
                <TbTruckDelivery className="text-[5rem] max-sm:text-[2rem] text-[#f0b54d] max-sm:my-[18px]" />
                <div className="flex flex-col max-sm:text-[18px] max-md:text-[10px] ml-3 mt-4 max-sm:my-4 max-sm:space-y-2">
                  <span>Livraison Gratuite</span>
                  <span>Livraison Gratuite à partir de 300 DT</span>
                </div>
              </div>
              <div className="flex flex-row lg:border-r-2 max-md:border-r-2 max-sm:border-r-0 max-sm:border-b-2 hover:text-[#f0b54d]">
                <AiOutlineFieldTime className="text-[5rem] max-sm:text-[2rem] text-[#f0b54d] max-sm:my-[18px]" />
                <div className="flex flex-col max-sm:text-[18px] max-md:text-[10px] ml-3 mt-4 max-sm:my-4 max-sm:space-y-2">
                  <span>24 X 7 Service</span>
                  <span>Service Disponible de 24 x 7</span>
                </div>
              </div>
              <div className="flex flex-row  hover:text-[#f0b54d]">
                <IoMegaphoneOutline className="text-[5rem] max-sm:text-[2rem] text-[#f0b54d] max-sm:my-[18px]" />
                <div className="flex flex-col max-sm:text-[18px] max-md:text-[10px] ml-3 mt-4 max-sm:my-4 max-sm:space-y-2">
                  <span>Offre Special</span>
                  <span>Des Nouveaux Offres Specieaux</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default Conditiongenerale;
