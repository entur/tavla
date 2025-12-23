import { BoardDB } from 'types/db-types/boards'

export function getBoardLink(bid: BoardDB['id']) {
    const env = process.env.NEXT_PUBLIC_ENV
    const nodeEnv = process.env.NODE_ENV

    const baseUrl =
        nodeEnv === 'development'
            ? `http://localhost:5173/${bid}`
            : env === 'prod'
              ? `https://vis-tavla.entur.no/${bid}`
              : `https://vis-tavla.dev.entur.no/${bid}`

    return `${baseUrl}?v=${Date.now()}`
}
