import { useCallback, useEffect, useState } from 'react'
import { useLocation, useMatch } from 'react-router-dom'
import { DocumentSnapshot, onSnapshot } from 'firebase/firestore'
import { Coordinates, TransportMode } from '@entur/sdk'
import {
    CustomTile,
    DashboardTypes,
    Direction,
    DrawableRoute,
    Theme,
} from '../types'
import { getSettingsReference } from '../services/firebase'
import { useUser } from '../UserProvider'
import { DEFAULT_DISTANCE, DEFAULT_ZOOM } from '../constants'
import {
    FieldTypes,
    persistMultipleFields as persistMultipleFieldsToFirebase,
    persistSingleField as persistSingleFieldToFirebase,
} from './FirestoreStorage'
import type { SettingsSetter } from './SettingsProvider'

type Mode = 'bysykkel' | 'kollektiv' | 'sparkesykkel' | 'delebil'

interface Settings {
    boardName: string
    coordinates: Coordinates
    customImageTiles: CustomTile[]
    customQrTiles: CustomTile[]
    dashboard: DashboardTypes
    description: string
    direction: Direction
    distance: number
    fontScale: number
    hiddenCustomTileIds: string[]
    hiddenMobilityOperators: string[]
    hiddenModes: Mode[]
    hiddenRealtimeDataLineRefs: string[]
    hiddenRoutes: { [stopPlaceId: string]: string[] }
    hiddenStations: string[]
    hiddenStopModes: { [stopPlaceId: string]: TransportMode[] }
    hiddenStops: string[]
    hideRealtimeData: boolean
    hideSituations: boolean
    hideTracks: boolean
    hideWalkInfo: boolean
    isScheduledForDelete: boolean
    logo: string
    logoSize: string
    newStations: string[]
    newStops: string[]
    owners: string[]
    pageRefreshedAt: number
    permanentlyVisibleRoutesInMap: DrawableRoute[]
    scooterDistance: { distance: number; enabled: boolean }
    showCustomTiles: boolean
    showIcon: boolean
    showMap: boolean
    showPrecipitation: boolean
    showRoutesInMap: boolean
    showTemperature: boolean
    showWeather: boolean
    showWind: boolean
    theme: Theme
    zoom: number
}

const DEFAULT_SETTINGS: Settings = {
    boardName: '',
    coordinates: { latitude: 59.91750312241921, longitude: 10.727442837962354 },
    customImageTiles: [],
    customQrTiles: [],
    dashboard: DashboardTypes.Compact,
    description: '',
    direction: Direction.STANDARD,
    distance: DEFAULT_DISTANCE,
    fontScale: 1,
    hiddenCustomTileIds: [],
    hiddenMobilityOperators: [],
    hiddenModes: ['sparkesykkel'],
    hiddenRealtimeDataLineRefs: [],
    hiddenRoutes: {},
    hiddenStations: [],
    hiddenStopModes: {},
    hiddenStops: [],
    hideRealtimeData: true,
    hideSituations: false,
    hideTracks: false,
    hideWalkInfo: false,
    isScheduledForDelete: false,
    logo: '',
    logoSize: '32px',
    newStations: [],
    newStops: [],
    owners: [],
    pageRefreshedAt: 0,
    permanentlyVisibleRoutesInMap: [],
    scooterDistance: { distance: DEFAULT_DISTANCE, enabled: false },
    showCustomTiles: false,
    showIcon: true,
    showMap: false,
    showPrecipitation: true,
    showRoutesInMap: true,
    showTemperature: true,
    showWeather: false,
    showWind: true,
    theme: Theme.DEFAULT,
    zoom: DEFAULT_ZOOM,
}

export function useFirebaseSettings(): [Settings | null, SettingsSetter] {
    const [settings, setLocalSettings] = useState<Settings | null>(null)

    const location = useLocation()
    const user = useUser()

    const documentId = useMatch<'documentId', string>('/:page/:documentId')
        ?.params.documentId

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

        if (documentId) {
            return onSnapshot(
                getSettingsReference(documentId),
                (documentSnapshot: DocumentSnapshot) => {
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
                        Object.entries(DEFAULT_SETTINGS).forEach(
                            ([key, value]) => {
                                if (data[key as keyof Settings] === undefined) {
                                    persistSingleFieldToFirebase(
                                        documentId,
                                        key,
                                        value as FieldTypes,
                                    )
                                }
                            },
                        )
                    }

                    setLocalSettings((prevSettings) => {
                        const onAdmin =
                            location.pathname.split('/')[1] === 'admin'
                        return prevSettings && onAdmin
                            ? prevSettings
                            : settingsWithDefaults
                    })
                },
            )
        }
    }, [location, user, documentId])

    const setSettings = useCallback(
        (newSettings: Partial<Settings>) => {
            const mergedSettings = { ...settings, ...newSettings } as Settings
            setLocalSettings(mergedSettings)
            if (documentId) {
                persistMultipleFieldsToFirebase(documentId, mergedSettings)
            }
        },
        [settings, documentId],
    )

    return [settings, setSettings]
}

export type { Settings, Mode }
export { DEFAULT_SETTINGS }
