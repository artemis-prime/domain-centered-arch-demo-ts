import React from 'react'

import OfferMessagesService, { 
  OfferMessagesServiceContext 
} from 'domain/offer/OfferMessagesService'

import OfferPage from 'pages/offer/OfferPage'

import messages from 'domain/offer/dummyOfferMessages'
const messagesService = new OfferMessagesService(messages)

import './App.scss'

const App: React.FC<{}> = () => (
  <OfferMessagesServiceContext.Provider value={messagesService} >
  <div className='app-outer'>
    <header className='app-header'>
      Messages Feature Harness
    </header>
    <OfferPage />
  </div>
  </OfferMessagesServiceContext.Provider>
)

export default App