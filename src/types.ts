import { FieldValue, Timestamp } from 'firebase/firestore'

import { TransportMode, TransportSubmode, StopPlace } from '@entur/sdk'

import { Settings } from './settings'

export interface LineData {
    id: string
    type: TransportMode
    subType?: TransportSubmode
    time: string
    departureTime: Date
    route: string
    expectedDepartureTime: string
    situation?: string
    hasCancellation?: boolean
    quay?: {
        id: string
        name: string
        publicCode: string
    }
}
export interface Line {
    id: string
    name: string
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    publicCode: string
    pointsOnLink?: string
}

export interface DrawableRoute {
    pointsOnLink: string
    mode: string
    lineRef: string
}

export type StopPlaceWithDepartures = StopPlace & {
    departures: NonEmpty<LineData>
}

export type StopPlaceWithLines = StopPlace & { lines: Line[] }

export interface NearestPlaces {
    bikeRentalStationIds: string[]
    stopPlaceIds: string[]
}

export interface TileSubLabel {
    situation?: string
    time: string
    departureTime: Date
    hasCancellation?: boolean
    hasSituation?: boolean
}

export enum Theme {
    DEFAULT = 'default',
    DARK = 'dark',
    LIGHT = 'light',
    GREY = 'grey',
}

export enum Direction {
    STANDARD = 'standard',
    ROTERT = 'rotert',
}

export enum IconColorType {
    DEFAULT = 'default',
    CONTRAST = 'contrast',
}

export type CustomTileType = 'qr' | 'image'
export interface CustomTile {
    id: string
    type: CustomTileType
    displayName: string
    sourceUrl: string
    description?: string
    displayHeader?: string
}
export interface BoardOwnersData {
    uid: string
    email: string
}

export interface Board {
    data: Settings
    id: string
    lastmodified: Timestamp
    created: Timestamp
}

export interface SharedBoard {
    id: string
    boardName: string
    sharedBy: string
    theme: Theme
    dashboard: string
    isScheduledForDelete: boolean
    timeIssued: Timestamp
}

export interface Invite {
    receiver: string
    sender: string
    timeIssued: FieldValue
    boardId?: string
}
export interface Viewport {
    latitude: number
    longitude: number
    width: string
    height: string
    zoom: number
    maxZoom: number
    minZoom: number
}

export type NonEmpty<A> = [A, ...A[]]
