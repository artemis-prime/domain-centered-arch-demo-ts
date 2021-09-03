import React from 'react'
import './App.scss'

import OfferPage from 'pages/offers/OfferPage'

const App: React.FC<{}> = () => (
  <div className='app-outer'>
    <header className='app-header'>
      Messages Feature Harness
    </header>
    <OfferPage />
  </div>
)

export default App
