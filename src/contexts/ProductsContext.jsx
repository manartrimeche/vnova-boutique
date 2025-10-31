import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const ProductsContext = createContext(null);

export function useProducts() {
  return useContext(ProductsContext);
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const VITE = typeof import.meta !== 'undefined' ? import.meta.env : {};
        const base = (VITE?.VITE_API_URL || process.env.REACT_APP_API_URL || process.env.API_URL || 'https://api.vnova.tn/api').replace(/\/+$/, '');
        const urls = [`${base}/produit`, `${base}/produit/`, `${base}/api/produit`];
        let res = null;
        for (const u of urls) {
          try {
            res = await axios.get(u);
            if (res?.data) break;
          } catch (err) {
            // try next
          }
        }
        const data = res?.data?.result || res?.data || [];
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
