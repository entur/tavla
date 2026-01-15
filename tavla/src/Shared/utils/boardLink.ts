import { BoardDB } from 'types/db-types/boards'

export function getBoardLinkClient(bid: BoardDB['id']) {
    const host = window?.location?.host
    if (!host) {
        return `https://vis-tavla.entur.no/${bid}`
    }
    switch (host) {
        case 'localhost:3000':
            return `http://localhost:5173/${bid}`
        case 'tavla.dev.entur.no':
            return `https://vis-tavla.dev.entur.no/${bid}`
        case 'tavla.entur.no':
        default:
            return `https://vis-tavla.entur.no/${bid}`
    }
}

export function getBoardLinkServer(bid: BoardDB['id'], isPreview = false) {
    const isLocalDevelopment = process.env.NODE_ENV === 'development'
    const isDevEnvironment = process.env.COMMON_ENV === 'dev'

    const baseUrl = isLocalDevelopment
        ? `http://localhost:5173/${bid}`
        : isDevEnvironment
          ? `https://vis-tavla.dev.entur.no/${bid}`
          : `https://vis-tavla.entur.no/${bid}`

    const queryParams = new URLSearchParams({
        v: Date.now().toString(),
        isPreview: 'true',
    })

    if (isPreview) {
        return `${baseUrl}?${queryParams.toString()}`
    }
    return baseUrl
}
