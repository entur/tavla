import { TransportMode, TransportSubmode, StopPlace, Quay } from '@entur/sdk'

export interface GenericKeyValueObject {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}
export interface LineData {
    id: string
    type: TransportMode
    subType?: TransportSubmode
    time: string
    route: string
    expectedDepartureTime: string
    situation?: string
    hasCancellation?: boolean
    quay?: Quay | undefined
}
export interface Line {
    id: string
    name: string
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    publicCode: string
    pointsOnLink: string
}

export interface DrawableRoute {
    pointsOnLink: string
    mode: string
    lineRef: string
}

export type StopPlaceWithDepartures = StopPlace & {
    departures: LineData[]
}

export type StopPlaceWithLines = StopPlace & { lines: Line[] }

export interface NearestPlaces {
    bikeRentalStationIds: string[]
    stopPlaceIds: string[]
}

export interface TileSubLabel {
    situation?: string
    time: string
    hasCancellation?: boolean
    hasSituation?: boolean
}

export enum Theme {
    DEFAULT = 'default',
    DARK = 'dark',
    LIGHT = 'light',
    GREY = 'grey',
}

export enum IconColorType {
    DEFAULT = 'default',
    CONTRAST = 'contrast',
}

export interface Viewport {
    latitude: number
    longitude: number
    width: string
    height: string
    zoom: number
    maxZoom: number
    minZoom: number
}
