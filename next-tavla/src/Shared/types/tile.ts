import { TColumn } from './column'
import { TTransportMode, TAuthority } from './graphql-schema'

export type TSharedTile = {
    placeId: string
    name: string
    uuid: string
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
    whitelistedAuthorities?: TAuthority[]
}

export type TColumnTile = {
    columns?: TColumn[]
}

export type TQuayTile = {
    type: 'quay'
    stopPlaceId: string
} & TSharedTile &
    TColumnTile

export type TStopPlaceTile = {
    type: 'stop_place'
} & TSharedTile &
    TColumnTile

export type TTile = TStopPlaceTile | TQuayTile
