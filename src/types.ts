import { LegMode, TransportSubmode, StopPlace } from '@entur/sdk'

export interface Settings {
    hiddenStations: Array<string>,
    hiddenStops: Array<string>,
    hiddenRoutes: Array<string>,
    hiddenModes: Array<LegMode>,
    distance?: number,
    newStations?: Array<string>,
    newStops?: Array<string>,
}

export interface LineData {
    type: LegMode,
    subType: TransportSubmode,
    time: string,
    route: string,
}

export type StopPlaceWithDepartures = StopPlace & { departures?: Array<LineData> }
