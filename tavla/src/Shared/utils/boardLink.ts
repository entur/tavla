import { BoardDB } from 'types/db-types/boards'

export function getBoardLink(bid: BoardDB['id']) {
    const isLocalDevelopment = process.env.NODE_ENV === 'development'
    const isProductionEnvironment = process.env.COMMON_ENV === 'prd'

    const baseUrl = isLocalDevelopment
        ? `http://localhost:5173/${bid}`
        : isProductionEnvironment
          ? `https://vis-tavla.entur.no/${bid}`
          : `https://vis-tavla.dev.entur.no/${bid}`

    return baseUrl
}

export function getBoardLinkForIframe(bid: BoardDB['id']) {
    const baseUrl = getBoardLink(bid)

    const queryParams = new URLSearchParams({
        v: Date.now().toString(),
        isPreview: 'true',
    })

    return `${baseUrl}?${queryParams.toString()}`
}
