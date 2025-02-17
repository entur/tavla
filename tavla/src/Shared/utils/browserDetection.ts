import semver from 'semver'
import { UAParser } from 'ua-parser-js'

/* Browser helpers */

// Minimum versions for each browser and engine in full semver format
const MIN_VERSIONS: { [key: string]: string } = {
    chrome: '45.0.0',
    firefox: '49.0.0',
    safari: '8.1.0',
}

// Map engine names to browser names for minimum version lookup
const ENGINE_TO_BROWSER: { [key: string]: string } = {
    blink: 'chrome',
    webkit: 'webkit',
    gecko: 'firefox',
}

// Function to check if the browser is unsupported
export function isUnsupportedBrowser(ua: string): boolean {
    const parser = UAParser(ua)
    const browserName = parser.browser?.name?.toLowerCase() || 'unknown'
    const browserVersion = parser.browser?.version || '0.0.0'
    const engineName = parser.engine?.name?.toLowerCase() || 'unknown'
    const engineVersion = parser.engine?.version || '0.0.0'

    // Initialize minVersion and currentVersion
    let minVersion = MIN_VERSIONS[browserName]
    let currentVersion = browserVersion

    // If minVersion not found using browserName, try engineName
    if (!minVersion) {
        const mappedBrowserName = ENGINE_TO_BROWSER[engineName]
        if (mappedBrowserName) {
            minVersion = MIN_VERSIONS[mappedBrowserName]
            currentVersion = engineVersion
        }
    }

    // Compare the current version with the minimum required version
    if (minVersion) {
        return isVersionLower(currentVersion, minVersion)
    }

    // Default to supported if no minimum version info is found
    return false
}

// Function to compare versions of browsers or engines
function isVersionLower(currentVersion: string, minVersion: string): boolean {
    const current = semver.coerce(currentVersion)
    const min = semver.coerce(minVersion)

    if (current && min) {
        return semver.lt(current, min) // Returns true if current < min
    }

    return false
}
