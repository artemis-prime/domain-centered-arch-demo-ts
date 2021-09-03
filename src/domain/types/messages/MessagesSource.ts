import type Message from './Message'

export default interface MessagesSource {
  getMessages(): Message[]
  addMessage(newMessage: Message): void
  updateMessage(index: number, content: string, timestamp: Date): void
  deleteMessage(index: number): void
}