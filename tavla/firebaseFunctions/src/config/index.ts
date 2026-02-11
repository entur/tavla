import { apiBaseUrl, geocoderUrl, quayUrl, stopPlaceUrl } from './variables'
interface RuntimeConfig {
    apiBaseUrl: string
    geocoderUrl: string
    quayUrl: string
    stopPlaceUrl: string
}

let runtimeConfig: RuntimeConfig | null = null

export const getRuntimeConfig = () => {
    if (!runtimeConfig) {
        runtimeConfig = {
            apiBaseUrl: apiBaseUrl.value(),
            stopPlaceUrl: stopPlaceUrl.value(),
            geocoderUrl: geocoderUrl.value(),
            quayUrl: quayUrl.value(),
        }
    }

    return runtimeConfig
}
