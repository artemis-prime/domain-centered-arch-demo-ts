import React, { useState } from 'react'
import { Form, Button } from 'reactstrap'

import type { Message } from 'domain/types/messages' 

import MessagesThread from './MessagesThread'

import './messagesView.scss'

const MessagesView : React.FC<{
  messages: Message[],
  allowAttachments?: boolean
}> = ({
  messages: _messages,
  allowAttachments
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
    // grab focus 
  }

  const onMessageDelete = (index: number) => {
    const copy = [...messages]
    console.log('Message deleted at index: ' + index)
    copy.splice(index, 1)
    setMessages(copy)  
  }

  const submitButtonProps = (editingIndex >= 0) ? {primary: true, outline: true} : {}

  return (
    <div className='messages-view'>
      <MessagesThread 
        onEditStart={onMessageEditStart}
        onDelete={onMessageDelete}
        messages={messages} 
        editingIndex={editingIndex} 
      /> 
      <div className="messages-card-input">
        <Form onSubmit={handleSubmit} style={{position: 'relative'}}>
          <textarea className="messages-text-area"
            value={newMessageContent}
            onChange={onTextAreaChange}
            onKeyPress={handleTextAreaKeyPress}
            placeholder="Type a message here..." 
          />
          <div className='messages-view-buttons-outer'>
            {allowAttachments && (
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

export default MessagesView