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
export type TColumnSetting = { type: TColumn; size?: number }

export type TTileType = TTile['type']

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
