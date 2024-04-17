import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '../src/index.css'
import CookieConsent from 'react-cookie-consent'

export default onRenderClient

async function onRenderClient(pageContext) {
  const handleAcceptNecessaryCookies = () => {

  }
  const { Page } = pageContext
  hydrateRoot(
    document.getElementById('react-root'),
    <BrowserRouter>
          <Page {...pageContext.pageProps} />
          <CookieConsent
            overlay
            location="bottom"
            buttonText="Accepter tout"
            enableDeclineButton
            declineButtonText="Accepter uniquement les nécessaires"
            cookieName="monConsentementCookie"
            style={{ background: '#2B373B' }}
            buttonStyle={{ color: '#4e503b', fontSize: '13px' }}
            expires={365}
            onDecline={handleAcceptNecessaryCookies}
          >
            Ce site web utilise des cookies pour améliorer l'expérience utilisateur.
          </CookieConsent>

        </BrowserRouter>

  )
}
