import theDetox from "./Assets/Icons/theDetox.svg";
import theSignature from "./Assets/Icons/theSignature.svg";
import infuseurAthe from "./Assets/Icons/infuseurAthe.svg";
import coffret1 from "./Assets/Icons/coffret1.svg";
import coffret2 from "./Assets/Icons/coffret2.svg";


var config = {
  uriPath: "https://localhost:8000",

  firebase: {
    apiKey: "AIzaSyBL7HVu71I1x8hXr3mCCZNmcd--q2EIh6w",
    authDomain: "the-tip-top-d1c24.firebaseapp.com",
    projectId: "the-tip-top-d1c24",
    storageBucket: "the-tip-top-d1c24.appspot.com",
    messagingSenderId: "125394483854",
    appId: "1:125394483854:web:b0d9fae81bda9e59a567df",
    measurementId: "G-B6Z3FXQJGK",
  },
  giveAwayIcons: [infuseurAthe, theDetox, theSignature, coffret1, coffret2],
};
console.log(import.meta.env.PUBLIC_ENV__REACT_APP_BUILD_ENV)
switch (import.meta.env.PUBLIC_ENV__REACT_APP_BUILD_ENV) {
  case "main":
    config.uriPath = "https://api.thetiptop.dsp5-archi-o22a-15m-g3.site";
    break
  case "staging":
    config.uriPath = "https://staging.api.thetiptop.dsp5-archi-o22a-15m-g3.site"
    break;

  default:
    config.uriPath = "http://localhost:8000";
    break;
}

export default config;
