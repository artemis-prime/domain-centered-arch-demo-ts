import React from 'react'

import OfferMessagesCard from './OfferMessagesCard'

import './offerPage.scss'

  // id has to match the one in the dummy json file
const OfferPage: React.FC<{}> = () => (
  <div className='offer-page-outer'>
    <OfferMessagesCard offerId={'abc123'}/>
  </div>
)

export default OfferPage

