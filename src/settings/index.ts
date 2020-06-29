import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react'
import { LegMode } from '@entur/sdk'

import { useIsFirebaseInitialized } from '../firebase-init'
import { updateSettingField } from '../services/firebase'
import { persist, restore } from './UrlStorage'

export interface Settings {
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
    setHiddenStations: (
        hiddenStations: Array<string>,
        options?: SetOptions,
    ) => void
    setHiddenStops: (hiddenStops: Array<string>, options?: SetOptions) => void
    setHiddenModes: (hiddenModes: Array<LegMode>, options?: SetOptions) => void
    setHiddenRoutes: (
        hiddenModes: { [stopPlaceId: string]: Array<string> },
        options?: SetOptions,
    ) => void
    setDistance: (distance: number, options?: SetOptions) => void
    setNewStations: (newStations: Array<string>, options?: SetOptions) => void
    setNewStops: (newStops: Array<string>, options?: SetOptions) => void
    setDashboard: (dashboard: string, options?: SetOptions) => void
}

interface SetOptions {
    persist?: boolean
}

type Persistor = () => void

export const SettingsContext = createContext<
    [Settings | null, SettingsSetters, Persistor]
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
    (): void => console.log('Persistor not set up yet'), // eslint-disable-line no-console
])

export function useSettingsContext(): [Settings, SettingsSetters, Persistor] {
    return useContext(SettingsContext)
}

export function useSettings(): [Settings, SettingsSetters, Persistor] {
    const [settings, setSettings] = useState<Settings>()

    const firebaseInitialized = useIsFirebaseInitialized()

    useEffect(() => {
        if (!firebaseInitialized) return

        async function loadSettings() {
            setSettings(await restore())
        }

        loadSettings()
    }, [firebaseInitialized])

    const persistSettings = useCallback(() => {
        persist(settings)
    }, [settings])

    const updateFirebaseSetting = (
        id: string,
        fieldId: string,
        fieldValue:
            | string
            | number
            | Array<string>
            | firebase.firestore.GeoPoint
            | { [key: string]: string[] },
    ): Promise<void> => {
        return updateSettingField(id, fieldId, fieldValue)
    }

    const set = useCallback(
        <T>(key: string, value: T, options?: SetOptions): void => {
            const newSettings = { ...settings, [key]: value }
            setSettings(newSettings)
            if (options && options.persist) {
                persist(newSettings)
            }
        },
        [settings],
    )

    const setHiddenStations = useCallback(
        (newHiddenStations: Array<string>, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23', //TODO: Insert user id state
                'hiddenStations',
                newHiddenStations,
            ).then(() => set('hiddenStations', newHiddenStations, options))
        },
        [set],
    )

    const setHiddenStops = useCallback(
        (newHiddenStops: Array<string>, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'hiddenStops',
                newHiddenStops,
            ).then(() => set('hiddenStops', newHiddenStops, options))
        },
        [set],
    )

    const setHiddenModes = useCallback(
        (newHiddenModes: Array<LegMode>, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'hiddenModes',
                newHiddenModes,
            ).then(() => set('hiddenModes', newHiddenModes, options))
        },
        [set],
    )

    const setHiddenRoutes = useCallback(
        (
            newHiddenRoutes: { [stopPlaceId: string]: Array<string> },
            options?: SetOptions,
        ): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'hiddenRoutes',
                newHiddenRoutes,
            ).then(() => set('hiddenRoutes', newHiddenRoutes, options))
        },
        [set],
    )

    const setDistance = useCallback(
        (newDistance: number, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'distance',
                newDistance,
            ).then(() => set('distance', newDistance, options))
        },
        [set],
    )

    const setNewStations = useCallback(
        (newStations: Array<string>, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'newStations',
                newStations,
            ).then(() => set('newStations', newStations, options))
        },
        [set],
    )

    const setNewStops = useCallback(
        (newStops: Array<string>, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'newStops',
                newStops,
            ).then(() => set('newStops', newStops, options))
        },
        [set],
    )

    const setDashboard = useCallback(
        (dashboard: string, options?: SetOptions): void => {
            // Updates in Firebase
            updateFirebaseSetting(
                'sa1ss23sa1ss23',
                'dashboard',
                dashboard,
            ).then(() => set('dashboard', dashboard, options))
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

    return [settings, setters, persistSettings]
}
