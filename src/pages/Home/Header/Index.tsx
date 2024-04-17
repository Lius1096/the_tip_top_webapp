import React from "react";
import NavBar from "./NavBar";
import Presentation from "./Presentation";

const IndexHeader = () => {
  return (
    <header
      className="flex flex-col xl:gap-y-8 xl:pb-20" style={{background: "linear-gradient(80deg, rgba(142, 137, 37, 0.29) 42.87%, rgba(255, 255, 255, 0.00) 91.19%)"}}
    >
      <NavBar />
      <Presentation />
    </header>
  );
};

export default IndexHeader;
