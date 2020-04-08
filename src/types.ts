import { LegMode, TransportSubmode, StopPlace } from '@entur/sdk'

export interface LineData {
    id: string
    type: LegMode
    subType: TransportSubmode
    time: string
    route: string
    expectedDepartureTime: string
    hasSituation?: boolean
    hasCancellation?: boolean
}

export interface Line {
    id: string
    name: string
    transportMode: LegMode
    transportSubmode: TransportSubmode
}

export type StopPlaceWithDepartures = StopPlace & {
    departures?: Array<LineData>
}

export type StopPlaceWithLines = StopPlace & { lines: Array<Line> }

export interface NearestPlaces {
    bikeRentalStationIds: Array<string>
    stopPlaceIds: Array<string>
}

export interface TileSubLabel {
    time: string
    hasCancellation?: boolean
    hasSituation?: boolean
}
