import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import { LegMode, Coordinates, ScooterOperator } from '@entur/sdk'

import { Theme } from '../types'
import { getSettings } from '../services/firebase'
import { getDocumentId } from '../utils'
import { useFirebaseAuthentication } from '../auth'

import {
    persist as persistToUrl,
    restore as restoreFromUrl,
} from './UrlStorage'
import { persist as persistToFirebase, FieldTypes } from './FirestoreStorage'

export type Mode = 'bysykkel' | 'kollektiv' | 'sparkesykkel'

export interface Settings {
    boardName?: string
    coordinates?: Coordinates
    hiddenOperators: ScooterOperator[]
    hiddenStations: string[]
    hiddenStops: string[]
    hiddenModes: Mode[]
    hiddenStopModes: { [stopPlaceId: string]: LegMode[] }
    hiddenRoutes: {
        [stopPlaceId: string]: string[]
    }
    distance?: number
    zoom?: number
    newStations?: string[]
    newStops?: string[]
    dashboard?: string | void
    owners?: string[]
    theme?: Theme
    logo?: string
    logoSize?: string
    description?: string
}

interface SettingsSetters {
    setBoardName: (boardName: string) => void
    setHiddenOperators: (hiddenOperators: ScooterOperator[]) => void
    setHiddenStations: (hiddenStations: string[]) => void
    setHiddenStops: (hiddenStops: string[]) => void
    setHiddenStopModes: (hiddenModes: {
        [stopPlaceId: string]: LegMode[]
    }) => void
    setHiddenModes: (modes: Mode[]) => void
    setHiddenRoutes: (hiddenModes: { [stopPlaceId: string]: string[] }) => void
    setDistance: (distance: number) => void
    setZoom: (zoom: number) => void
    setNewStations: (newStations: string[]) => void
    setNewStops: (newStops: string[]) => void
    setDashboard: (dashboard: string) => void
    setOwners: (owners: string[]) => void
    setTheme: (theme: Theme) => void
    setLogo: (url: string | null) => void
    setLogoSize: (size: string) => void
    setDescription: (description: string) => void
}

export const SettingsContext = createContext<
    [Settings | null, SettingsSetters]
>([
    null,
    {
        setBoardName: (): void => undefined,
        setHiddenOperators: (): void => undefined,
        setHiddenStations: (): void => undefined,
        setHiddenStops: (): void => undefined,
        setHiddenStopModes: (): void => undefined,
        setHiddenModes: (): void => undefined,
        setHiddenRoutes: (): void => undefined,
        setDistance: (): void => undefined,
        setZoom: (): void => undefined,
        setNewStations: (): void => undefined,
        setNewStops: (): void => undefined,
        setDashboard: (): void => undefined,
        setOwners: (): void => undefined,
        setTheme: (): void => undefined,
        setLogo: (): void => undefined,
        setLogoSize: (): void => undefined,
        setDescription: (): void => undefined,
    },
])

export function useSettingsContext(): [Settings | null, SettingsSetters] {
    return useContext(SettingsContext)
}

const DEFAULT_SETTINGS: Partial<Settings> = {
    description: '',
    logoSize: '32px',
    theme: Theme.DEFAULT,
    owners: [] as string[],
    hiddenStopModes: {},
}

export function useSettings(): [Settings | null, SettingsSetters] {
    const [settings, setSettings] = useState<Settings | null>(null)

    const location = useLocation()
    const user = useFirebaseAuthentication()

    useEffect(() => {
        const protectedPath =
            location.pathname == '/' ||
            location.pathname.split('/')[1] == 'permissionDenied' ||
            location.pathname.split('/')[1] == 'privacy' ||
            location.pathname.split('/')[1] == 'tavler'

        if (protectedPath) {
            setSettings(null)
            return
        }

        const id = getDocumentId()

        if (id) {
            return getSettings(id).onSnapshot((document: any) => {
                if (!document.exists) {
                    window.location.pathname = '/'
                    return
                }

                const data = document.data() as Settings

                const settingsWithDefaults: Settings = {
                    ...DEFAULT_SETTINGS,
                    ...data,
                }

                // The fields under are added if missing, and if the tavle is not locked.
                // If a tavle is locked by a user, you are not allowed to write to
                // tavle unless you are logged in as the user who locked tavla, so we need
                // to check if you have edit access.
                const editAccess =
                    user &&
                    (!data.owners?.length || data.owners.includes(user.uid))

                if (editAccess) {
                    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
                        if (data[key as keyof Settings] === undefined) {
                            persistToFirebase(id, key, value as FieldTypes)
                        }
                    })
                }

                setSettings((prevSettings) => {
                    const onAdmin = location.pathname.split('/')[1] === 'admin'
                    return prevSettings && onAdmin
                        ? prevSettings
                        : settingsWithDefaults
                })
            })
        }

        let positionArray: string[] = []
        try {
            positionArray = location.pathname
                .split('/')[2]
                .split('@')[1]
                .split('-')
                .join('.')
                .split(/,/)
        } catch (error) {
            return
        }

        setSettings({
            ...DEFAULT_SETTINGS,
            ...restoreFromUrl(),
            coordinates: {
                latitude: Number(positionArray[0]),
                longitude: Number(positionArray[1]),
            },
        })
    }, [location, user])

    const set = useCallback(
        (key: string, value: FieldTypes): void => {
            const newSettings = { ...settings, [key]: value } as Settings
            setSettings(newSettings)

            const id = getDocumentId()

            if (id) {
                persistToFirebase(id, key, value)
                return
            }
            persistToUrl(newSettings)
        },
        [settings],
    )

    const setBoardName = useCallback(
        (boardName: string): void => {
            set('boardName', boardName)
        },
        [set],
    )

    const setHiddenOperators = useCallback(
        (newHiddenOperators: ScooterOperator[]): void => {
            set('hiddenOperators', newHiddenOperators)
        },
        [set],
    )

    const setHiddenStations = useCallback(
        (newHiddenStations: string[]): void => {
            set('hiddenStations', newHiddenStations)
        },
        [set],
    )

    const setHiddenStops = useCallback(
        (newHiddenStops: string[]): void => {
            set('hiddenStops', newHiddenStops)
        },
        [set],
    )

    const setHiddenStopModes = useCallback(
        (newHiddenStopModes: { [stopPlaceId: string]: LegMode[] }): void => {
            set('hiddenStopModes', newHiddenStopModes)
        },
        [set],
    )

    const setHiddenModes = useCallback(
        (newHiddenModes: Mode[]): void => {
            set('hiddenModes', newHiddenModes)
        },
        [set],
    )

    const setHiddenRoutes = useCallback(
        (newHiddenRoutes: { [stopPlaceId: string]: string[] }): void => {
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

    const setZoom = useCallback(
        (newZoom: number): void => {
            set('zoom', newZoom)
        },
        [set],
    )

    const setNewStations = useCallback(
        (newStations: string[]): void => {
            set('newStations', newStations)
        },
        [set],
    )

    const setNewStops = useCallback(
        (newStops: string[]): void => {
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

    const setOwners = useCallback(
        (owners: string[]): void => {
            set('owners', owners)
        },
        [set],
    )

    const setTheme = useCallback(
        (theme: Theme): void => {
            set('theme', theme)
        },
        [set],
    )
    const setLogo = useCallback(
        (url: string | null): void => {
            set('logo', url)
        },
        [set],
    )

    const setLogoSize = useCallback(
        (size: string): void => {
            set('logoSize', size)
        },
        [set],
    )

    const setDescription = useCallback(
        (description: string): void => {
            set('description', description)
        },
        [set],
    )

    const setters = {
        setBoardName,
        setHiddenOperators,
        setHiddenStations,
        setHiddenStops,
        setHiddenModes,
        setHiddenStopModes,
        setHiddenRoutes,
        setDistance,
        setZoom,
        setNewStations,
        setNewStops,
        setDashboard,
        setOwners,
        setTheme,
        setLogo,
        setLogoSize,
        setDescription,
    }

    return [settings, setters]
}
