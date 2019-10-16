import { DEFAULT_DISTANCE } from '../constants'
import { Settings } from './index'

export function persist(settings: Settings): void {
    const hash = btoa(JSON.stringify(settings))
    const currentPathname = window.location.pathname

    const urlParts = currentPathname.split('/')
    urlParts[urlParts.length - 1] = hash
    const newPathname = urlParts.join('/')

    window.history.pushState(window.history.state, document.title, newPathname)
}

export function restore(): Settings {
    const settings = window.location.pathname.split('/')[3]
    return (settings) ? JSON.parse(atob(settings)) : {
        hiddenStations: [], hiddenStops: [], hiddenRoutes: {}, distance: DEFAULT_DISTANCE, hiddenModes: [], newStations: [], newStops: [],
    }
}
