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
    className?: string
} & TSharedTile &
    TColumnTile

export type TWalkingDistance = {
    distance?: number
    visible?: boolean
}

export type TTile = TStopPlaceTile | TQuayTile
