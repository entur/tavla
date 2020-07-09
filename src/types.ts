import { LegMode, TransportSubmode, StopPlace } from '@entur/sdk'

export interface LineData {
    id: string
    type: LegMode
    subType: TransportSubmode
    time: string
    route: string
    expectedDepartureTime: string
    situation?: string
    hasCancellation?: boolean
}

export interface Line {
    id: string
    name: string
    transportMode: LegMode
    transportSubmode: TransportSubmode
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
    time: string
    hasCancellation?: boolean
    hasSituation?: boolean
}

export type ThemeType = 'default' | 'dark' | 'light' | 'grey'
