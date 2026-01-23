import { BoardDB } from 'src/types/db-types/boards'

export const VIS_TAVLA_HOST_TARGETS: Record<string, string> = {
    'localhost:3000': 'http://localhost:5173',
    'tavla.dev.entur.no': 'https://vis-tavla.dev.entur.no',
    'tavla.entur.no': 'https://vis-tavla.entur.no',
}

export const DEFAULT_VIS_TAVLA_TARGET = VIS_TAVLA_HOST_TARGETS['tavla.entur.no']

export function resolveVisTavlaBaseUrl(host?: string) {
    const nodeEnv = process.env.NODE_ENV
    const commonEnv = process.env.COMMON_ENV

    if (host) {
        const normalizedHost = host.toLowerCase()
        const baseForHost = VIS_TAVLA_HOST_TARGETS[normalizedHost]
        if (baseForHost) {
            return baseForHost
        }
    }

    if (nodeEnv === 'development') {
        return VIS_TAVLA_HOST_TARGETS['localhost:3000']
    }

    if (commonEnv === 'dev') {
        return VIS_TAVLA_HOST_TARGETS['tavla.dev.entur.no']
    }

    return DEFAULT_VIS_TAVLA_TARGET
}

export function getBoardLinkClient(bid: BoardDB['id']) {
    if (typeof window === 'undefined') {
        return getBoardLinkServer(bid)
    }

    const baseUrl = resolveVisTavlaBaseUrl(window.location.host)
    return `${baseUrl}/${bid}`
}

export function getBoardLinkServer(bid: BoardDB['id'], isPreview = false) {
    const baseUrl = resolveVisTavlaBaseUrl()

    const queryParams = new URLSearchParams({
        v: Date.now().toString(),
        isPreview: 'true',
    })

    if (isPreview) {
        return `${baseUrl}/${bid}?${queryParams.toString()}`
    }

    return `${baseUrl}/${bid}`
}
