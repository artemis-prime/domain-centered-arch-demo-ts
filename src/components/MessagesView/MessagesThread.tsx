import React from 'react'

import Linkify from 'react-linkify'

import { Button } from 'reactstrap'


import type { Message } from 'domain/types/messages'

import DateTimeFormat from 'components/formatters/DateTimeFormat'
import { ProfilePhoto } from 'components'

const MessageView: React.FC<{ 
  message: Message,
  index: number,
  editing: boolean,
  onEditStart(index: number): void,
  onDelete(index: number): void
}> = ({ 
  message,
  index,
  editing,
  onEditStart,
  onDelete
}) => {
  
  const _onEdit = () => {
    onEditStart(index)
  }

  const _onDelete = () => {
    onDelete(index)
  }
  
  return (
    <div className={`message-outer ${editing ? 'message-editing' : ''}`}>
      <div className='message-header-photo'>
        <ProfilePhoto stacked size='xs' />
      </div>
      <div className='message-main'>
        <div className="message-header">
          <span className='message-author'>
            {message.author.firstName} {message.author.lastName}
          </span>
          <DateTimeFormat date={message.timestamp} />
          {message.edited && (
            <span className='message-edited'>(edited)</span>
          )}
        </div>
        <div className='message-content'>
          {/* :aa leave _blank */}
          <Linkify  >{message.content}</Linkify>
          <div className='edit-message-buttons-outer'>
            <Button onClick={_onDelete} className='edit-message-button edit-message-button-delete'>
              <i className="fa fa-md fa-trash" />
            </Button>
            <Button onClick={_onEdit} className='edit-message-button edit-message-button-edit'>
              <i className="fas fa-md fa-pencil-alt" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MessagesThread: React.FC<{
  messages: Message[],
  editingIndex: number,
  onEditStart(index: number): void,
  onDelete(index: number): void
}> = ({
  messages,
  editingIndex,
  onEditStart,
  onDelete
}) => (
  <div className='message-thread'>
    {messages && messages.map((message, index) => (
      <MessageView 
        key={index} 
        index={index} 
        message={message} 
        editing={editingIndex === index} 
        onEditStart={onEditStart}
        onDelete={onDelete}
      />
    ))}
  </div>
)

export default MessagesThread