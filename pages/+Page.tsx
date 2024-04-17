import React from "react";
import { Provider } from "react-redux";
import {  store } from "../src/Redux/Store";
// import { PersistGate } from "redux-persist/integration/react";
import RoutesOverlay from "../src/Routes";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

export default Page

function Page() {
  return (
    <HelmetProvider>
    <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistor}> */}
      <RoutesOverlay />
      <div className="bg-first">
      <Toaster position='top-center'  />

      </div>
    {/* </PersistGate> */}
  </Provider>
  </HelmetProvider>
  )
}

