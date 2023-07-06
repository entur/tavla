import { TTransportMode } from './graphql-schema'

export const Columns = {
    destination: 'Destinasjon',
    line: 'Linje',
    platform: 'Plattform',
    time: 'Avgangstid',
    situations: 'Avvik',
    via: 'Via',
} as const

export type TColumn = keyof typeof Columns
export type TColumnSetting = {
    type: TColumn
    size?: number
}

export const DefaultColumns: readonly TColumnSetting[] = [
    { type: 'line' },
    { type: 'destination', size: 2 },
    { type: 'situations', size: 2 },
    { type: 'time' },
] as const

export type TTileType = TTile['type']

type TBaseTile = {
    placeId: string
    uuid: string
}

export type TQuayTile = {
    stopPlaceId: string
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

export type TTile = TStopPlaceTile | TQuayTile
