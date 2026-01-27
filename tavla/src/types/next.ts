import { IncomingMessage } from 'http'

export type IncomingNextMessage = {
    cookies: { [key: string]: string }
} & IncomingMessage
