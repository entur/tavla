import { LegMode, TransportSubmode, StopPlace } from '@entur/sdk'

export interface LineData {
    serviceJourneyId: string,
    type: LegMode,
    subType: TransportSubmode,
    time: string,
    route: string,
    expectedDepartureTime: string,
}

export interface Line {
    id: string,
    name: string,
    transportMode: LegMode,
    transportSubmode: TransportSubmode,
}

export type StopPlaceWithDepartures = StopPlace & { departures?: Array<LineData> }

export type StopPlaceWithLines = StopPlace & { lines: Array<Line> }

export interface NearestPlaces {
    bikeRentalStationIds: Array<string>,
    stopPlaceIds: Array<string>,
}
