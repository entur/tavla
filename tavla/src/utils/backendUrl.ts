export function getBackendUrl() {
    return process.env.COMMON_ENV === 'prd'
        ? 'https://tavla-api.entur.no'
        : 'https://tavla-api.dev.entur.no'
}
