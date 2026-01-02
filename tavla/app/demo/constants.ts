export const TAVLA_VISNING_ORIGINS = {
    production: 'https://vis-tavla.entur.no',
    development: 'https://vis-tavla.dev.entur.no',
    local: 'http://localhost:5173',
} as const

export function getTavlaVisningOrigin(hostname: string): string {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return TAVLA_VISNING_ORIGINS.local
    }
    if (
        hostname === 'dev.entur.no' ||
        hostname === 'tavla.dev.entur.no' ||
        hostname.endsWith('.dev.entur.no')
    ) {
        return TAVLA_VISNING_ORIGINS.development
    }
    return TAVLA_VISNING_ORIGINS.production
}

export function isValidTavlaVisningOrigin(origin: string): boolean {
    return (
        origin === TAVLA_VISNING_ORIGINS.production ||
        origin === TAVLA_VISNING_ORIGINS.development ||
        origin === TAVLA_VISNING_ORIGINS.local
    )
}
