import React from 'react'
import { FieldValue, Timestamp } from 'firebase/firestore'
import {
    TransportMode,
    TransportSubmode,
} from 'graphql-generated/journey-planner-v3'
import { EstimatedCall } from 'hooks/use-stop-place-with-estimated-calls/types'
import { ToastProvider as _ToastProvider } from '@entur/alert'
import { ToastProviderProps } from '@entur/alert/dist/ToastProvider'
import { Settings } from './settings/settings'

export type Coordinates = {
    latitude: number
    longitude: number
}

export type DrawableRoute = {
    pointsOnLink: string
    mode: string
    lineRef: string
}

export type TileSubLabel = {
    situation?: string
    displayTime: string
    expectedDepartureTime: Date
    hasCancellation?: boolean
    hasSituation?: boolean
}

export type Theme = 'default' | 'dark' | 'light' | 'grey'

export type Direction = 'standard' | 'rotated'

export enum FontChangeAction {
    increase = 1,
    decrease,
}

export type DashboardTypes =
    | 'Timeline'
    | 'Chrono'
    | 'Map'
    | 'BusStop'
    | 'Compact'
    | 'Poster'
    | 'Responsive'

export type IconColorType = 'default' | 'contrast'

export type CustomTileType = 'qr' | 'image'

export type CustomTile = {
    id: string
    type: CustomTileType
    displayName: string
    sourceUrl: string
    description?: string
    displayHeader?: string
}
export type BoardOwnersData = {
    uid: string
    email: string
}

export type Board = {
    data: Settings
    id: string
    lastmodified: Timestamp
    created: Timestamp
}

export type SharedBoard = {
    id: string
    boardName: string
    sharedBy: string
    theme: Theme
    dashboard: string
    isScheduledForDelete: boolean
    timeIssued: Timestamp
}

export type Invite = {
    receiver: string
    sender: string
    timeIssued: FieldValue
    boardId?: string
}
export type Viewport = {
    latitude: number
    longitude: number
    width: string
    height: string
    zoom: number
    maxZoom: number
    minZoom: number
}

export type UserLogin = {
    email: string
    password: string
}

export type EnturLogoStyle = 'white' | 'black' | 'contrast'

export type Departure = {
    id: string
    aimedDepartureTime: Date
    expectedDepartureTime: Date
    formattedAimedDepartureTime: string
    formattedExpectedDepartureTime: string
    delayed: boolean
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    displayTime: string
    publicCode: string
    frontText: string
    route: string
    situations: EstimatedCall['situations']
    cancellation: boolean
    quay: EstimatedCall['quay']
}

export type Line = {
    id: string
    name: string
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    publicCode: string
    pointsOnLink: string
}

/* Augment the proptype of @entur/alert ToastProvider with children definition.
 * This should be deleted when @entur/alert updates to @types/react@18.x and updates their definition
 */
export const ToastProvider = _ToastProvider as React.FC<
    ToastProviderProps & { children: React.ReactNode }
>
