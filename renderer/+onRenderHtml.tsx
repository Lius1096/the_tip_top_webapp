import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router-dom/server'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { store } from '../src/Redux/Store'
export default onRenderHtml



async function onRenderHtml(pageContext) {
  const { Page, pageProps, urlPathname } = pageContext
  const pageHtml = renderToString(
    <StaticRouter location={urlPathname}>
      <Page {...pageContext} />
    </StaticRouter>
  )
  return escapeInject`<!DOCTYPE html>
<html lang="fr">

  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description"
      content="Web site created using create-react-app"
      data-rh="true" />
    <link rel="apple-touch-icon" href="favicon.ico" />

    <link rel="manifest" href="manifest.json" />
    <title>Thé Tip Top Saisissez votre tasse, préparez-vous à l'aventure</title>
    <meta
      name="description"
      content="Participez à notre Grand Jeu Concours de Thé et découvrez des saveurs inédites." />
    <link rel="canonical"
      href="https://staging.thetiptop.dsp5-archi-o22a-15m-g3.site/" />

    <!-- Google Tag Manager -->
    <script>(function (w, d, s, l, i) {
      w[l] = w[l] || []; w[l].push({
        'gtm.start':
          new Date().getTime(), event: 'gtm.js'
      }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
          'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-MCNPFPVV');</script>
    <!-- End Google Tag Manager -->
  </head>

  <body>

    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe
        src="https://www.googletagmanager.com/ns.html?id=GTM-MCNPFPVV"
        height="0" width="0"
        style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->

    <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>

  </body>

</html>`
}
