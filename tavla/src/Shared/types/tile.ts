import { TColumn } from './column'
import { TTransportMode } from './graphql-schema'

export type TSharedTile = {
    placeId: string
    name: string
    uuid: string
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[]
    walkingDistance?: TWalkingDistance
    offset?: number
    displayName?: string
}

export type TColumnTile = {
    columns?: TColumn[]
}

export type TQuayTile = {
    type: 'quay'
} & TSharedTile &
    TColumnTile

export type TStopPlaceTile = {
    type: 'stop_place'
} & TSharedTile &
    TColumnTile

export type TWalkingDistance = {
    distance?: number
    visible?: boolean
}
export type TPlaceId = {
    id: string
    type: 'stop_place' | 'quay'
}
export type TCombinedTile = {
    type: 'combined'
    placeId: TPlaceId[]
} & TSharedTile &
    TColumnTile

export type TTile = TStopPlaceTile | TQuayTile | TCombinedTile
