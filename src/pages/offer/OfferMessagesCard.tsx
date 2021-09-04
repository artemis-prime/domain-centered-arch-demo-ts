import React from 'react'

import { MessagesView } from 'components'
import messages from 'domain/fixtures/dummyOfferMessages'

import './offerMessagesCard.scss'

const OfferMessagesCard: React.FC<{}> = () => (
  <div className='offer-messages-card card-outer'>
    <MessagesView messages={messages} allowAttachments allowDelete allowEdit/>
  </div>
)

export default OfferMessagesCard