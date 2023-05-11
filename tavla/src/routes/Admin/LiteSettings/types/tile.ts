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

export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    platform: 'Plattform',
    time: 'Avgangstid',
} as const

export type TColumn = keyof typeof Columns
export type TColumnSetting = { type: TColumn; size?: number }

type TBaseTile = {
    placeId: string
    uuid: string
}

export type TQuayTile = {
    type: 'quay'
    columns?: TColumnSetting[]
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
} & TBaseTile

export type TStopPlaceTile = {
    type: 'stop_place'
    columns?: TColumnSetting[]
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
} & TBaseTile

export type TMapTile = {
    type: 'map'
} & TBaseTile

export type TTile = TStopPlaceTile | TMapTile | TQuayTile
