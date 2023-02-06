import React from 'react'
import { FieldValue, Timestamp } from 'firebase/firestore'
import { ToastProvider as _ToastProvider } from '@entur/alert'
import { ToastProviderProps } from '@entur/alert/dist/ToastProvider'
import { Settings } from './settings/settings'

export interface Coordinates {
    latitude: number
    longitude: number
}

export interface DrawableRoute {
    pointsOnLink: string
    mode: string
    lineRef: string
}

export interface TileSubLabel {
    situation?: string
    displayTime: string
    expectedDepartureTime: Date
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
    ROTATED = 'rotated',
}

export enum FontChangeAction {
    increase = 1,
    decrease,
}

export enum DashboardTypes {
    Timeline = 'Timeline',
    Chrono = 'Chrono',
    Map = 'Map',
    BusStop = 'BusStop',
    Compact = 'Compact',
    Poster = 'Poster',
    Responsive = 'Responsive',
    NewBusStop = 'NewBusStop'
}

export enum IconColorType {
    DEFAULT = 'default',
    CONTRAST = 'contrast',
}

export enum CustomTileType {
    QR = 'qr',
    Image = 'image',
}

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

/* Augment the proptype of @entur/alert ToastProvider with children definition.
 * This should be deleted when @entur/alert updates to @types/react@18.x and updates their definition
 */
export const ToastProvider = _ToastProvider as React.FC<
    ToastProviderProps & { children: React.ReactNode }
>
