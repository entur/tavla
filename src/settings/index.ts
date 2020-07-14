import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import { LegMode, Coordinates } from '@entur/sdk'

import { persist as persistToFirebase, FieldTypes } from './FirestoreStorage'
import {
    persist as persistToUrl,
    restore as restoreFromUrl,
} from './UrlStorage'
import { getSettings } from '../services/firebase'

import { getDocumentId } from '../utils'

export interface Settings {
    coordinates?: Coordinates
    hiddenStations: string[]
    hiddenStops: string[]
    hiddenModes: LegMode[]
    hiddenRoutes: {
        [stopPlaceId: string]: string[]
    }
    distance?: number
    newStations?: string[]
    newStops?: string[]
    dashboard?: string | void
    owners?: string[]
    logo?: string
    logoSize: string
    description: string
}

interface SettingsSetters {
    setHiddenStations: (hiddenStations: string[]) => void
    setHiddenStops: (hiddenStops: string[]) => void
    setHiddenModes: (hiddenModes: LegMode[]) => void
    setHiddenRoutes: (hiddenModes: { [stopPlaceId: string]: string[] }) => void
    setDistance: (distance: number) => void
    setNewStations: (newStations: string[]) => void
    setNewStops: (newStops: string[]) => void
    setDashboard: (dashboard: string) => void
    setOwners: (owners: string[]) => void
    setLogo: (url: string) => void
    setLogoSize: (size: string) => void
    setDescription: (description: string) => void
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
        setOwners: (): void => undefined,
        setLogo: (): void => undefined,
        setLogoSize: (): void => undefined,
        setDescription: (): void => undefined,
    },
])

export function useSettingsContext(): [Settings, SettingsSetters] {
    return useContext(SettingsContext)
}

export function useSettings(): [Settings, SettingsSetters] {
    const [settings, setSettings] = useState<Settings>()

    const location = useLocation()

    useEffect(() => {
        const protectedPath =
            location.pathname == '/' ||
            location.pathname.split('/')[1] == 'permissionDenied' ||
            location.pathname.split('/')[1] == 'privacy'

        if (protectedPath) return

        const id = getDocumentId()

        if (id) {
            return getSettings(id).onSnapshot((document) => {
                if (document.exists) {
                    const data = document.data()

                    // Handle settings which were initialized before `owners` was introduced.
                    if (data.owners === undefined) {
                        persistToFirebase(getDocumentId(), 'owners', [])
                        data.owners = []
                    }

                    if (data.description === undefined) {
                        persistToFirebase(getDocumentId(), 'description', '')
                        data.description = ''
                    }

                    setSettings(data as Settings)
                } else {
                    window.location.pathname = '/'
                }
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
            ...restoreFromUrl(),
            owners: [],
            coordinates: {
                latitude: Number(positionArray[0]),
                longitude: Number(positionArray[1]),
            },
        })
    }, [location])

    const set = useCallback(
        <T>(key: string, value: FieldTypes): void => {
            const newSettings = { ...settings, [key]: value }
            setSettings(newSettings)

            if (getDocumentId()) {
                persistToFirebase(getDocumentId(), key, value)
                return
            }
            persistToUrl(newSettings)
        },
        [settings],
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

    const setHiddenModes = useCallback(
        (newHiddenModes: LegMode[]): void => {
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

    const setLogo = useCallback(
        (url: string): void => {
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
        setHiddenStations,
        setHiddenStops,
        setHiddenModes,
        setHiddenRoutes,
        setDistance,
        setNewStations,
        setNewStops,
        setDashboard,
        setOwners,
        setLogo,
        setLogoSize,
        setDescription,
    }

    return [settings, setters]
}
