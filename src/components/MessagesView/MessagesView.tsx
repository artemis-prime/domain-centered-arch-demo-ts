import React, { useState } from 'react'
import { Form, Button } from 'reactstrap'
import Linkify from 'react-linkify'

import type { Message } from 'domain/types/messages' 

import DateTimeFormat from 'components/formatters/DateTimeFormat'
import { ProfilePhoto } from 'components'

import './messagesView.scss'

const MessagesView : React.FC<{
  messages: Message[],
  allowAttachments?: boolean,
  allowEdit?: boolean,
  allowDelete?: boolean
}> = ({
  messages: _messages,
  allowAttachments,
  allowEdit,
  allowDelete
}) => {
  const [editingIndex, setEditingIndex] = useState<number>(-1)
  const [newMessageContent, setNewMessageContent] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>(_messages)

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!newMessageContent || /^\s*$/.test(newMessageContent)) { return }

    if (newMessageContent) {
      if (editingIndex >= 0) {
        const copy = [...messages]
        console.log('Message update at index: ' + editingIndex)
        copy.splice(editingIndex, 1, {
          ...messages[editingIndex],
          content: newMessageContent,
          edited: true
        })
        setMessages(copy) 
        setNewMessageContent('')
        setEditingIndex(-1) 
      }
      else {
        // prefered method: https://stackoverflow.com/questions/54676966/push-method-in-react-hooks-usestate
        setMessages([...messages, 
          {
            author: {
              firstName: 'Artem',
              lastName: 'Ash',
              uid: 'abcdefg'
            },
            content: newMessageContent,
            timestamp: new Date().toJSON(),
            edited: false
          }
        ])
        setNewMessageContent('')
      }
    }
  }

  const handleTextAreaKeyPress = (e: any) => {
    if(e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  const onTextAreaChange = (e: any) => {
    setNewMessageContent(e.target.value)
  }

  const onAttachmentClick = () => {
    console.log("ATTACHMENT CLICKED")
  }

  const onMessageEditStart = (index: number) => {
    setEditingIndex(index)
    setNewMessageContent(messages[index].content)
    // TODO: grab focus 
  }

  const onMessageDelete = (index: number) => {
    const copy = [...messages]
    console.log('Message deleted at index: ' + index)
    copy.splice(index, 1)
    setMessages(copy) 
    // in case delete was invoked while another message was in edit mode 
    setNewMessageContent('')
    setEditingIndex(-1)
  }

  const textAreaProps = (editingIndex >= 0) ? {autoFocus: true} : {}

  return (
    <div className='messages-view'>
      <div className='message-thread'>
        {messages && messages.map((message, index) => (
          <MessageView 
            key={index} 
            index={index} 
            message={message} 
            editing={editingIndex === index} 
            allowEdit={!!allowEdit}
            allowDelete={!!allowDelete}
            onEditStart={onMessageEditStart}
            onDelete={onMessageDelete}
          />
        ))}
      </div>
      <div className="messages-card-input">
        <Form onSubmit={handleSubmit} style={{position: 'relative'}}>
          <textarea className={`messages-text-area ${(editingIndex >= 0) ? 'messages-text-area-editing' : ''}`}
            value={newMessageContent}
            onChange={onTextAreaChange}
            onKeyPress={handleTextAreaKeyPress}
            placeholder="Type a message here..." 
            {...textAreaProps}
          />
          <div className='messages-view-buttons-outer'>
            {!!allowAttachments && (
            <Button onClick={onAttachmentClick} className='messages-view-button transparent-button attachment-button'>
              <i className="fa fa-md fa-paperclip" style={{ color: '#aaa' }} />
            </Button>
            )}
            {(editingIndex >= 0) ? (
              <Button 
                type="submit" 
                className='messages-view-button submit-button'
                color='primary' 
              >update</Button>
            ) : (
              <Button 
                type="submit" 
                className='messages-view-button submit-button transparent-button' 
              >
                <i className="fa fa-md fa-paper-plane" style={{ color: '#007bff' }} />
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  )
}

// A representation of a single Message (One message bubble)  
const MessageView: React.FC<{ 
  message: Message,
  index: number,
  allowEdit?: boolean,
  allowDelete?: boolean,
  editing: boolean,
  onEditStart?: (index: number) => void,
  onDelete?: (index: number) => void
}> = ({ 
  message,
  index,
  allowEdit,
  allowDelete,
  editing,
  onEditStart,
  onDelete
}) => {
  
  const _onEdit = () => {
    if (allowEdit && !onEditStart) {
      new Error("MessagesView: messages that are passed 'allowEdit' require an onEditStart() callback!")
    }
    onEditStart && onEditStart(index)
  }

  const _onDelete = () => {
    if (allowDelete && !onDelete) {
      new Error("MessagesView: messages that are passed 'allowDelete' require an onDelete() callback!")
    }
    onDelete && onDelete(index)
  }
  
  return (
    <div className={`message-outer ${editing ? 'message-editing' : ''}`}>
      <div className='message-header-photo'>
        <ProfilePhoto stacked size='xs' />
      </div>
      <div className='message-main'>
        <div className="message-header">
          <span className='message-author'>{message.author.firstName} {message.author.lastName}</span>
          <DateTimeFormat date={message.timestamp} />
          {message.edited && (<span className='message-edited'>(edited)</span>)}
        </div>
        <div className={`message-content ${(!allowDelete) ? 'no-delete' : 'allow-delete'} ${(!allowEdit) ? 'no-edit' : 'allow-edit'}`}>
          {/* :aa TODO: _blank didn't work in this version. Explore! */}
          <Linkify  >{message.content}</Linkify>
          <div className='edit-message-buttons-outer'>
            <Button onClick={_onDelete} className='edit-message-button edit-message-button-delete'>
              <i className="fa fa-md fa-trash" />
            </Button>
            <Button onClick={_onEdit} className='edit-message-button edit-message-button-edit'> 
              {/* note 'fas' not 'fa' */}
              <i className="fas fa-md fa-pencil-alt" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesView