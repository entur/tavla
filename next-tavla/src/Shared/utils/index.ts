export function getBackendUrl() {
    return process.env.KUB_ENV === 'prd'
        ? 'https://tavla-api.entur.no'
        : 'https://tavla-api.dev.entur.no'
}
