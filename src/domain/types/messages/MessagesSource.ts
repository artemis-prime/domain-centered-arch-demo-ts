import type Message from './Message'

// 'key' is any unique id, for example offer.id. 
// "Get me the messages associated with X".
export default interface MessagesSource {
  getMessages(key: string): Message[] 
  addMessage(key: string, newMessage: Message): void
  updateMessage(key: string, message: Message, newContent: string): void
  deleteMessage(key: string, message: Message): void
}