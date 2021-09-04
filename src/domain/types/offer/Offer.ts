import type { Message } from 'domain/types/messages'

export default interface Offer {
  id: string,
  messages: Message[]
}