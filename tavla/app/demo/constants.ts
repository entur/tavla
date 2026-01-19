export const TAVLA_VISNING_ORIGINS = {
    production: 'https://vis-tavla.entur.no',
    development: 'https://vis-tavla.dev.entur.no',
    local: 'http://localhost:5173',
} as const

export function isValidTavlaVisningOrigin(origin: string): boolean {
    return (
        origin === TAVLA_VISNING_ORIGINS.production ||
        origin === TAVLA_VISNING_ORIGINS.development ||
        origin === TAVLA_VISNING_ORIGINS.local
    )
}
