import type User from 'domain/types/auth/User'

export default interface Message {
  author: User
  content: string
  timestamp: string // new Date(m.timestamp).toLocaleDateString("sv-SE")
  edited: boolean
}