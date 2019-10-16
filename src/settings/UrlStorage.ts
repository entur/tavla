import lz from 'lz-string'

import { DEFAULT_DISTANCE } from '../constants'
import { Settings } from './index'

const DEFAULT_SETTINGS: Settings = {
    hiddenStations: [],
    hiddenStops: [],
    hiddenRoutes: {},
    distance: DEFAULT_DISTANCE,
    hiddenModes: [],
    newStations: [],
    newStops: [],
}

export function persist(settings: Settings): void {
    const hash = lz.compressToEncodedURIComponent(JSON.stringify(settings))
    const currentPathname = window.location.pathname

    const urlParts = currentPathname.split('/')
    urlParts[urlParts.length - 1] = hash
    const newPathname = urlParts.join('/')

    window.history.pushState(window.history.state, document.title, newPathname)
}

export function restore(): Settings {
    const settings = window.location.pathname.split('/')[3]
    if (!settings) {
        return DEFAULT_SETTINGS
    }

    const decompressed = lz.decompressFromEncodedURIComponent(settings)
    return JSON.parse(decompressed)
}
