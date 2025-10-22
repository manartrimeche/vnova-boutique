/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
};

const Layouts = () => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      <Outlet />

      {/* CTA global */}
      <div className="fixed inset-x-0 bottom-4 z-40 px-4 md:px-0">
        <div className="mx-auto max-w-xl rounded-full border border-[#031E3B]/20 bg-white/90 backdrop-blur shadow-lg flex items-center justify-between px-4 py-2">
          <span className="text-sm text-[#031E3B]/90">Besoin d’un conseil personnalisé ?</span>
          <Link
            to="/contact"
            className="cta-write ml-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#031E3B] text-white text-sm font-semibold"
          >
            Écrire maintenant
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layouts;
