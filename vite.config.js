import react from '@vitejs/plugin-react'
import vike, { ssr } from 'vike/plugin'
import { defineConfig  } from 'vite'
import {cjsInterop} from 'vite-plugin-cjs-interop';
export default defineConfig  ({
  plugins: [react(), vike(),
    ,
    cjsInterop({
      dependencies: [
        "qrcode.react",
        "react-google-recaptcha",
        "react-helmet-async",
        "react-google-places-autocomplete",
        
        
        // "@mui/x-date-pickers/AdapterMoment",
        // "@mui/x-date-pickers/LocalizationProvider"
      ],
    }),
  ],
  // build: {
  //   outDir: 'dist'
  // }

})

