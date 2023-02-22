import {
    Coordinates,
    CustomTile,
    DashboardTypes,
    Direction,
    DrawableRoute,
    Theme,
} from 'src/types'
import { TransportMode } from 'graphql-generated/journey-planner-v3'
import { DEFAULT_DISTANCE, DEFAULT_ZOOM } from '../constants'

type Mode = 'bysykkel' | 'kollektiv' | 'sparkesykkel' | 'delebil'

type Settings = {
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
    lastActive: number
    permanentlyVisibleRoutesInMap: DrawableRoute[]
    scooterDistance: { distance: number; enabled: boolean }
    showCustomTiles: boolean
    showMobileAppQrTile: boolean
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
    lastActive: 0,
    permanentlyVisibleRoutesInMap: [],
    scooterDistance: { distance: DEFAULT_DISTANCE, enabled: false },
    showCustomTiles: false,
    showMobileAppQrTile: false,
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
export { DEFAULT_SETTINGS }
export type { Settings, Mode }
