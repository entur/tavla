import semver from 'semver'
import { UAParser } from 'ua-parser-js'

/* Browser helpers */

// Minimum versions for each browser
// If lower version, the page will refresh every 60 seconds
const MIN_VERSIONS: { [key: string]: string } = {
    chrome: '60',
    firefox: '55',
    edge: '80',
    safari: '11.1',
}

// Function to get browser name and version
export function getBrowserInfo(ua: string) {
    const parser = UAParser(ua)
    const browser = parser.browser || {}

    const name = browser.name ? browser.name.toLowerCase() : 'unknown'
    const versionString = browser.version || '0.0.0'
    const version = semver.coerce(versionString)

    return {
        name,
        version: version?.version || '0.0.0',
    }
}

// Function to check if the browser is unsupported for running the board
export function isUnsupportedBrowser(ua: string): boolean {
    const { name, version } = getBrowserInfo(ua)

    if (name in MIN_VERSIONS) {
        const minVersion = MIN_VERSIONS[name]
        if (minVersion && isVersionLower(version, minVersion)) {
            return true
        }
    }

    return false
}

// Function to compare versions of browsers
function isVersionLower(currentVersion: string, minVersion: string): boolean {
    const current = semver.coerce(currentVersion)
    const min = semver.coerce(minVersion)

    if (current && min) {
        return semver.lt(current, min) // Returns true if current < min
    }

    return false
}
