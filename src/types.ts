import { TransportMode, TransportSubmode, StopPlace, Quay } from '@entur/sdk'

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

export interface CustomTile {
    id: string
    displayName: string
    linkAddress: string
    description: string
}

export interface CustomImageTile extends CustomTile {
    displayHeader: string
}

export type CustomQRTile = CustomTile
