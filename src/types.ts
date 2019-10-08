export interface Coords {
    latitude?: number,
    longitude?: number,
}

export interface Settings {
    hiddenStations: Array<string>,
    hiddenStops: Array<string>,
    hiddenRoutes: Array<string>,
    hiddenModes: Array<string>,
    distance?: number,
    newStations?: Array<string>,
    newStops?: Array<string>,
}
