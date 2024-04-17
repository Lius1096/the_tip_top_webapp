import React from "react";
import IndexHeader from "./Header/Index";
import IndexMain from "./Main/Index";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const IndexHome = () => {
  return (
    <div className="h-screen overflow-y-auto">
      <Helmet>
        <title>Thé Tip Top Saisissez votre tasse, préparez-vous à l'aventure</title>
        <meta
          name="description"
          content="Participez à notre Grand Jeu Concours de Thé et découvrez des saveurs inédites."
        />
        <link rel="canonical" href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/" />
      </Helmet>
      <IndexHeader />
      <IndexMain />
      <Toaster position="top-center" />
      <Footer />
    </div>
  );
};

export default IndexHome;
