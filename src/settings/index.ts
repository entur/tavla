import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from 'react'
import { useLocation } from 'react-router-dom'
import { Coordinates, TransportMode } from '@entur/sdk'

import { onSnapshot } from 'firebase/firestore'

import { Theme } from '../types'
import { getSettings } from '../services/firebase'
import { getDocumentId } from '../utils'
import { useFirebaseAuthentication } from '../auth'

import {
    persist as persistToUrl,
    restore as restoreFromUrl,
} from './UrlStorage'
import {
    persistSingleField as persistSingleFieldToFirebase,
    persistMultipleFields as persistMultipleFieldsToFirebase,
    FieldTypes,
} from './FirestoreStorage'

export type Mode = 'bysykkel' | 'kollektiv' | 'sparkesykkel'

export interface Settings {
    boardName?: string
    coordinates?: Coordinates
    hiddenMobilityOperators: string[]
    hiddenStations: string[]
    hiddenStops: string[]
    hiddenModes: Mode[]
    hiddenStopModes: { [stopPlaceId: string]: TransportMode[] }
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
    showMap?: boolean
    showWeather?: boolean
    showIcon?: boolean
    showTemperature?: boolean
    showWind?: boolean
    showPrecipitation?: boolean
    hideSituations?: boolean
    hideTracks?: boolean
    hideWalkInfo?: boolean
    hideRealtimeData: boolean
    hiddenRealtimeDataLineRefs: string[]
}

type Setter = (settings: Partial<Settings>) => void

export const SettingsContext = createContext<[Settings | null, Setter]>([
    null,
    (): void => undefined,
])

export function useSettingsContext(): [Settings | null, Setter] {
    return useContext(SettingsContext)
}

const DEFAULT_SETTINGS: Partial<Settings> = {
    description: '',
    logoSize: '32px',
    theme: Theme.DEFAULT,
    owners: [] as string[],
    hiddenStopModes: {},
    hiddenRealtimeDataLineRefs: [],
}

export function useSettings(): [Settings | null, Setter] {
    const [settings, setLocalSettings] = useState<Settings | null>(null)

    const location = useLocation()
    const user = useFirebaseAuthentication()
    const id = getDocumentId()

    useEffect(() => {
        const protectedPath =
            location.pathname == '/' ||
            location.pathname.split('/')[1] == 'permissionDenied' ||
            location.pathname.split('/')[1] == 'privacy' ||
            location.pathname.split('/')[1] == 'tavler'

        if (protectedPath) {
            setLocalSettings(null)
            return
        }

        if (id) {
            return onSnapshot(getSettings(id), (documentSnapshot: any) => {
                if (!documentSnapshot.exists()) {
                    window.location.pathname = '/'
                    return
                }

                const data = documentSnapshot.data() as Settings

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
                            persistSingleFieldToFirebase(
                                id,
                                key,
                                value as FieldTypes,
                            )
                        }
                    })
                }

                setLocalSettings((prevSettings) => {
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

        setLocalSettings({
            ...DEFAULT_SETTINGS,
            ...restoreFromUrl(),
            coordinates: {
                latitude: Number(positionArray[0]),
                longitude: Number(positionArray[1]),
            },
        })
    }, [location, user, id])

    const setSettings = useCallback(
        (newSettings: Partial<Settings>) => {
            const mergedSettings = { ...settings, ...newSettings } as Settings
            setLocalSettings(mergedSettings)

            const docId = getDocumentId()
            if (docId) {
                persistMultipleFieldsToFirebase(docId, mergedSettings)
                return
            }

            persistToUrl(mergedSettings)
        },
        [settings],
    )

    return [settings, setSettings]
}
