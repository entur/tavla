import { FieldValue, Timestamp } from 'firebase/firestore'

import { TransportMode, TransportSubmode, StopPlace, Quay } from '@entur/sdk'

import { Settings } from './settings'

export interface LineData {
    id: string
    type: TransportMode
    subType?: TransportSubmode
    time: string
    route: string
    expectedDepartureTime: string
    situation?: string
    hasCancellation?: boolean
    quay?: Quay | undefined
}
export interface Line {
    id: string
    name: string
    transportMode: TransportMode
    transportSubmode: TransportSubmode
    publicCode: string
    pointsOnLink: string
}

export interface DrawableRoute {
    pointsOnLink: string
    mode: string
    lineRef: string
}

export type StopPlaceWithDepartures = StopPlace & {
    departures: LineData[]
}

export type StopPlaceWithLines = StopPlace & { lines: Line[] }

export interface NearestPlaces {
    bikeRentalStationIds: string[]
    stopPlaceIds: string[]
}

export interface TileSubLabel {
    situation?: string
    time: string
    hasCancellation?: boolean
    hasSituation?: boolean
}

export enum Theme {
    DEFAULT = 'default',
    DARK = 'dark',
    LIGHT = 'light',
    GREY = 'grey',
}

export enum IconColorType {
    DEFAULT = 'default',
    CONTRAST = 'contrast',
}

export interface OwnerRequest {
    recipientUID: string
    requestIssuerUID: string
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
}

export interface Invite {
    reciever: string
    sender: string
    timeIssued: FieldValue
    boardId?: string
}
