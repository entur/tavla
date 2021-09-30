import lz from 'lz-string'

import { DEFAULT_DISTANCE } from '../constants'
import { Theme } from '../types'

import { Settings } from './index'

export const DEFAULT_SETTINGS: Settings = {
    hiddenStations: [],
    hiddenMobilityOperators: [],
    hiddenStops: [],
    hiddenRoutes: {},
    distance: DEFAULT_DISTANCE,
    hiddenModes: ['sparkesykkel'],
    hiddenStopModes: {},
    newStations: [],
    newStops: [],
    dashboard: '',
    coordinates: undefined,
    owners: [],
    theme: Theme.DEFAULT,
    logoSize: '32px',
    description: '',
    hiddenRealtimeDataLineRefs: [],
}

const VERSION_PREFIX_REGEX = /^v(\d)+::/
const CURRENT_VERSION = 1

function migrateFromV0(settings: string): Settings {
    if (!settings) {
        return DEFAULT_SETTINGS
    }
    const parsed = JSON.parse(atob(settings))
    const migratedHiddenRoutes: Settings['hiddenRoutes'] = parsed.hiddenRoutes
        .map((idAndRouteString: string) => idAndRouteString.split('$'))
        .reduce(
            (
                routeMap: Settings['hiddenRoutes'],
                [stopPlaceId, routeName]: [string, string],
            ) => ({
                ...routeMap,
                [stopPlaceId]: [...(routeMap[stopPlaceId] || []), routeName],
            }),
            {} as Settings['hiddenRoutes'],
        )

    return {
        ...parsed,
        hiddenRoutes: migratedHiddenRoutes,
    }
}

function migrate(fromVersion: number, settingsString: string): Settings {
    switch (fromVersion) {
        case 0:
            return migrateFromV0(settingsString)
        default:
            return DEFAULT_SETTINGS
    }
}

export function persist(settings: Settings): void {
    const hash = lz.compressToEncodedURIComponent(JSON.stringify(settings))
    const currentPathname = window.location.pathname

    const urlParts = currentPathname.split('/')
    urlParts[urlParts.length - 1] = `v${CURRENT_VERSION}::${hash}`
    const newPathname = urlParts.join('/')

    window.history.pushState(window.history.state, document.title, newPathname)
}

export function restore(): Settings {
    const settingsString = window.location.pathname.split('/')[3]
    if (!settingsString) {
        return DEFAULT_SETTINGS
    }

    const versionMatch = settingsString.match(VERSION_PREFIX_REGEX)
    const version = versionMatch ? Number(versionMatch[1]) : 0

    if (version !== CURRENT_VERSION) {
        const migratedSettings = migrate(version, settingsString)
        persist(migratedSettings)
        return migratedSettings
    }

    const settingsWithoutVersionPrefix = settingsString.replace(
        VERSION_PREFIX_REGEX,
        '',
    )

    try {
        const decompressed = lz.decompressFromEncodedURIComponent(
            settingsWithoutVersionPrefix,
        )
        if (!decompressed) return DEFAULT_SETTINGS
        const settings = JSON.parse(decompressed)
        return settings
    } catch (error) {
        return DEFAULT_SETTINGS
    }
}
