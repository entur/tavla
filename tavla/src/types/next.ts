import type { IncomingMessage } from 'node:http'

export type IncomingNextMessage = {
    cookies: { [key: string]: string }
} & IncomingMessage
