import { apiBaseUrl } from './variables'
interface RuntimeConfig {
    apiBaseUrl: string
}

let runtimeConfig: RuntimeConfig | null = null

export const getRuntimeConfig = () => {
    if (!runtimeConfig) {
        runtimeConfig = {
            apiBaseUrl: apiBaseUrl.value(),
        }
    }

    return runtimeConfig
}
