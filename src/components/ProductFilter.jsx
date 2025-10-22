import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect,  useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';

const Product = ({libelle , id} ) => {
  const navigate = useNavigate();
  const  nav = (item) => {
    navigate("/product_details"  , {state : 
      item
    });
  
  }
  const [filter , setfilter ] = useState([]);
  const getallproduits = async () => {

    try {
      await axios.post(process.env.API_URL+"/filterproduit/" ,{ libelle : libelle}).then((response) => {
       setfilter(response?.data?.result)
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getallproduits();
  },[]);

  const showToast = () => {
    toast.success('Product added to cart!');
  };
  
  const addOrUpdateProduct = (productToAdd) => {
    const data = {
      id : productToAdd?._id, 
      nom : productToAdd?.nom , 
      prix : productToAdd?.prix_TTC_catalogue?.$numberDecimal , 
      reference : productToAdd?.reference , 
      quantity :  1 , 
      photo : productToAdd?.photo
    }
    const existingProducts = JSON.parse(localStorage.getItem('products')) || [];

    console.log(existingProducts)
    const existingProductIndex = existingProducts.findIndex(product => product.id === productToAdd._id);
    if (existingProductIndex !== -1) {
      existingProducts[existingProductIndex].quantity += 1;
    } else {
      existingProducts.push(data);
    }
      localStorage.setItem('products', JSON.stringify(existingProducts));
  };
  const updatedProducts = JSON.parse(localStorage.getItem('products'));
  console.log(updatedProducts);
  return (
    <>
              <Toaster position="top-right" reverseOrder={true} />

        {filter.map((item, index) => (
          id !== item?._id &&(
            <div key={index} className="w-[65%] max-sm:w-[80%] max-sm:mx-auto max-md:mx-auto text-center space-y-1">
            <button onClick={() => nav(item)}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <img
                  src={process.env.API_URL + item?.photo}
                  alt=""
                  className="h-[50%] w-[80%] justify-center text-center space-y-1"
                  style={{ margin: "auto" }}
                />
                <h3 className="text-[#777777] text-[12px] capitalize">{item?.nom}</h3>
                <h3 className="text-[18px] font-bold my-4">{item?.prix_TTC_catalogue?.$numberDecimal}</h3>
              </div>
            </button>
            <button className="text-[14px] max-lg:text-[10px] rounded-none p-3 bg-[#0b5ed7] text-white uppercase max-sm:text-xs max-sm:rounded-none max-md:rounded-none max-md:text-xs font-semibold max-sm:p-2 max-md:p-3 mx-auto" onClick={()=>{
          addOrUpdateProduct(item)
      showToast()}
    }  >Ajouter Au Panier</button>
          </div>
          )

))}

    </>
  )
}

export default Product