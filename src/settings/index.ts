import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import { LegMode, Coordinates } from '@entur/sdk'

import { useIsFirebaseInitialized } from '../firebase-init'
import {
    persist as persistToFirebase,
    restore as restoreFromFirebase,
    FieldValue,
} from './FirestoreStorage'
import {
    persist as persistToUrl,
    restore as restoreFromUrl,
} from './UrlStorage'

import { getDocumentId } from '../utils'

export interface Settings {
    coordinates?: Coordinates
    hiddenStations: Array<string>
    hiddenStops: Array<string>
    hiddenModes: Array<LegMode>
    hiddenRoutes: {
        [stopPlaceId: string]: Array<string>
    }
    distance?: number
    newStations?: Array<string>
    newStops?: Array<string>
    dashboard?: string | void
}

interface SettingsSetters {
    setHiddenStations: (hiddenStations: Array<string>) => void
    setHiddenStops: (hiddenStops: Array<string>) => void
    setHiddenModes: (hiddenModes: Array<LegMode>) => void
    setHiddenRoutes: (hiddenModes: {
        [stopPlaceId: string]: Array<string>
    }) => void
    setDistance: (distance: number) => void
    setNewStations: (newStations: Array<string>) => void
    setNewStops: (newStops: Array<string>) => void
    setDashboard: (dashboard: string) => void
}

export const SettingsContext = createContext<
    [Settings | null, SettingsSetters]
>([
    null,
    {
        setHiddenStations: (): void => undefined,
        setHiddenStops: (): void => undefined,
        setHiddenModes: (): void => undefined,
        setHiddenRoutes: (): void => undefined,
        setDistance: (): void => undefined,
        setNewStations: (): void => undefined,
        setNewStops: (): void => undefined,
        setDashboard: (): void => undefined,
    },
])

export function useSettingsContext(): [Settings, SettingsSetters] {
    return useContext(SettingsContext)
}

export function useSettings(): [Settings, SettingsSetters] {
    const [settings, setSettings] = useState<Settings>()

    const firebaseInitialized = useIsFirebaseInitialized()

    const location = useLocation()

    useEffect(() => {
        if (location.pathname == '/' || !firebaseInitialized) return

        async function loadSettings(): Promise<Settings> {
            if (getDocumentId()) {
                setSettings(await restoreFromFirebase(getDocumentId()))
                return
            }

            const positionArray = location.pathname
                .split('/')[2]
                .split('@')[1]
                .split('-')
                .join('.')
                .split(/,/)

            setSettings({
                ...restoreFromUrl(),
                coordinates: {
                    latitude: Number(positionArray[0]),
                    longitude: Number(positionArray[1]),
                },
            })
        }

        loadSettings()
    }, [firebaseInitialized, location])

    const set = useCallback(
        <T>(key: string, value: FieldValue): void => {
            const newSettings = { ...settings, [key]: value }
            setSettings(newSettings)

            if (getDocumentId()) {
                persistToFirebase(getDocumentId(), newSettings)
                return
            }
            persistToUrl(newSettings)
        },
        [settings],
    )

    const setHiddenStations = useCallback(
        (newHiddenStations: Array<string>): void => {
            set('hiddenStations', newHiddenStations)
        },
        [set],
    )

    const setHiddenStops = useCallback(
        (newHiddenStops: Array<string>): void => {
            set('hiddenStops', newHiddenStops)
        },
        [set],
    )

    const setHiddenModes = useCallback(
        (newHiddenModes: Array<LegMode>): void => {
            set('hiddenModes', newHiddenModes)
        },
        [set],
    )

    const setHiddenRoutes = useCallback(
        (newHiddenRoutes: { [stopPlaceId: string]: Array<string> }): void => {
            set('hiddenRoutes', newHiddenRoutes)
        },
        [set],
    )

    const setDistance = useCallback(
        (newDistance: number): void => {
            set('distance', newDistance)
        },
        [set],
    )

    const setNewStations = useCallback(
        (newStations: Array<string>): void => {
            set('newStations', newStations)
        },
        [set],
    )

    const setNewStops = useCallback(
        (newStops: Array<string>): void => {
            set('newStops', newStops)
        },
        [set],
    )

    const setDashboard = useCallback(
        (dashboard: string): void => {
            set('dashboard', dashboard)
        },
        [set],
    )

    const setters = {
        setHiddenStations,
        setHiddenStops,
        setHiddenModes,
        setHiddenRoutes,
        setDistance,
        setNewStations,
        setNewStops,
        setDashboard,
    }

    return [settings, setters]
}
