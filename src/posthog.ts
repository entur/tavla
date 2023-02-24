import { posthog } from 'posthog-js'

function initalizePosthog() {
    if (process.env.POSTHOG_TOKEN) {
        posthog.init(process.env.POSTHOG_TOKEN, {
            api_host: 'https://eu.posthog.com',
            autocapture: false,
            persistence: 'localStorage',
            capture_pageview: false,
            disable_session_recording: true,
        })
    }
}

function logPageViews() {
    posthog.capture('$pageview')
}

export { initalizePosthog, logPageViews }
