import React from 'react'
import reactModal from '@prezly/react-promise-modal'

import {
  Button, 
  Modal, 
  ModalBody, 
  ModalFooter,
  ModalHeader
} from 'reactstrap'

import type { Message } from 'domain/types/messages' 

import { MessagesView } from 'components'
import messages from 'domain/fixtures/dummyOfferMessages'
import firstNWords  from 'util/firstNWords'

import './offerMessagesCard.scss'

const OfferMessagesCard: React.FC<{}> = () => (
  <div className='offer-messages-card card-outer'>
    <MessagesView 
      messages={messages} 
      allowAttachments 
      allowDelete 
      allowEdit 
      confirmDeleteFunction={deleteConfirmed}/>
  </div>
)

const deleteConfirmed = async (message: Message) => (
  
  await reactModal(({ show, onSubmit, onDismiss }) => (
   
    <Modal isOpen={show} toggle={onDismiss} className='offer-messages-card-confirm-delete-modal-outer'>
      <ModalHeader toggle={onDismiss}>Confirm Delete Message</ModalHeader>
      <ModalBody>
        Delete message by <span className='author'>{message.author.firstName} {message.author.lastName}</span> that
        starts with <span className='content'><q>{firstNWords(message.content, 5)}</q></span>...?
      </ModalBody>
    
      <ModalFooter>
        <Button outline color='secondary' onClick={onDismiss}>Cancel</Button>
        <Button color='primary' onClick={onSubmit}>Confirm</Button>
      </ModalFooter>
    </Modal>
  ))
)

export default OfferMessagesCard