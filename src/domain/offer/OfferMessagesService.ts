import type { Message, MessagesSource } from 'domain/types/messages'
import type { Offer } from 'domain/types/offer'

class OfferMessagesService implements MessagesSource {

  _messagesMap: Map<string, Message[]> = new Map<string, Message[]>()

  constructor(offers: Offer[]) {
    offers.forEach((offer) => {
      this._messagesMap.set(offer.id, offer.messages)
    })
  }

  _getMessages(key: string): Message[] {
    const messages = this._messagesMap.get(key)
    if (!messages) {
      throw new Error(`OfferMessages: no message set found corresponding to key: ${key}!`) 
    }
    return messages
  }
 
  getMessages(key: string): Message[]  {
    return this._getMessages(key)
  }

  addMessage(key: string, newMessage: Message): void {
    const messages = this._getMessages(key)
    messages.push(newMessage)
  }
  
  updateMessage(key: string, message: Message, newContent: string): void {
    const messages = this._getMessages(key)
    const i = getMessageIndex(messages, message)
    if (i === -1) {
      throw new Error(`OfferMessages: no message found matching: \n${JSON.stringify(message, null, 2)}!`) 
    } 
    // A fresh copy of the message will help state mgmt stay on track.
    const copy = [...messages]
    copy.splice(i, 1, {
      ...messages[i],
      content: newContent,
      edited: true
    })
    this._messagesMap.set(key, copy)
  }

  deleteMessage(key: string, message: Message): void {
    const messages = this._getMessages(key)
    const i = getMessageIndex(messages, message)
    if (i === -1) {
      throw new Error(`OfferMessages: no message found matching: \n${JSON.stringify(message, null, 2)}!`) 
    } 
    // A fresh copy of the message will help state mgmt stay on track.
    const copy = [...messages]
    copy.splice(i, 1)
    this._messagesMap.set(key, copy)
  }
}

// If author and timestamp match
const getMessageIndex = (messages: Message[], message: Message) => (
  messages.findIndex(
    (m) => ((m.author.uid === message.author.uid) && (m.timestamp === message.timestamp))
  )
)

/*
export const OfferMessagesProvider = ({})

export const useOfferMessageStore = ({offerMessagesService, children}) => {
  const {store} = useContext(MobXProviderContext)
  return store.userStore
}
*/
export default OfferMessagesService