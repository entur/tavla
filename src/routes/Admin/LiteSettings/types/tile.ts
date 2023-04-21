// Change to import from generated graphql later
type TTransportMode =
    | 'air'
    | 'bus'
    | 'cableway'
    | 'coach'
    | 'funicular'
    | 'lift'
    | 'metro'
    | 'monorail'
    | 'rail'
    | 'tram'
    | 'trolleybus'
    | 'unknown'
    | 'water'

export type TColumn = 'line' | 'time' | 'destination' | 'platform'

type TBaseTile = {
    placeId: string
}

export type TQuayTile = {
    type: 'quay'
    columns?: TColumn[]
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
} & TBaseTile

export type TStopPlaceTile = {
    type: 'stop_place'
    columns?: TColumn[]
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
} & TBaseTile

export type TMapTile = {
    type: 'map'
} & TBaseTile

export type TTile = TStopPlaceTile | TMapTile | TQuayTile
