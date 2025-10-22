import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Layouts from "../components/Layouts";
import A_Propos from "../Pages/A_Propos";
import Conditiongenerale from "../Pages/Conditiongenerale";
import Accueil from "../Pages/Accueil";
import Cart from "../Pages/Cart";
import Categories from "../Pages/Categories";
import Registre from "../Pages/Registre";
import Confirmation from "../Pages/Confirmation";
import Product_details from "../Pages/Product_details";
import Contact from "../Pages/Contact";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layouts />,
      children: [
        { index: true, element: <Accueil /> },
        { path: "a_propos", element: <A_Propos /> },
        { path: "conditiongenerale", element: <Conditiongenerale /> },
        { path: "cart", element: <Cart /> },
        { path: "categorie", element: <Categories /> },
        { path: "cart/registre", element: <Registre /> },
        { path: "cart/registre/confirmation", element: <Confirmation /> },
        { path: "contact", element: <Contact /> },
        { path: "product_details", element: <Product_details /> },
     
      ],
    },
  ],
  {
    // Active les comportements v7 côté routeur 
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
      v7_startTransition: true,
    },
  }
);

export default function Routeur() {
  // Déplacer le flag de transition ici supprime l’avertissement dédié
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />;
}
