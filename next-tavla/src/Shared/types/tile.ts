import { TColumnSettings } from './column'
import { TTransportMode } from './graphql-schema'

export type TTileType = TTile['type']

type TBaseTile = {
    placeId: string
    uuid: string
}

export type TQuayTile = {
    stopPlaceId: string
    type: 'quay'
    columns?: TColumnSettings
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
} & TBaseTile

export type TStopPlaceTile = {
    type: 'stop_place'
    columns?: TColumnSettings
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
} & TBaseTile

export type TTile = TStopPlaceTile | TQuayTile
