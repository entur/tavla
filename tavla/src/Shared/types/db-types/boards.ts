import { TTransportMode } from 'types/graphql-schema'

export type BoardDB = {
    id?: BoardIdDB
    meta: BoardMetaDB
    tiles: BoardTileDB[]
    combinedTiles?: CombinedTilesDB[]
    theme?: BoardThemeDB
    footer?: BoardFooterDB
    transportPalette?: TransportPaletteDB
    hideLogo?: boolean
    hideClock?: boolean
    version?: number //Finnes ikke i dag - slette?
}

export type BoardIdDB = string

export type BoardFooterDB = {
    footer?: string
}

export type CombinedTilesDB = { ids: string[] }

export type BoardThemeDB = 'entur' | 'dark' | 'light'
export type TransportPaletteDB = 'default' | 'blue-bus' | 'green-bus'

export type BoardMetaDB = {
    title?: string
    created?: number
    lastActive?: number
    dateModified?: number
    fontSize?: BoardFontSizeDB
    location?: LocationDB
}

export type BoardFontSizeDB = 'small' | 'medium' | 'large'

export type CoordinateDB = { lat: number; lng: number }
export type LocationDB = {
    name?: string
    coordinate?: CoordinateDB
}

export type BaseTileDB = {
    placeId: string
    name: string
    uuid: string
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportMode[] //Denne brukes ikke?
    walkingDistance?: BoardWalkingDistanceDB
    offset?: number
    displayName?: string
    columns?: TileColumnDB[]
}

export const TileColumns = {
    aimedTime: 'Planlagt',
    arrivalTime: 'Ankomst',
    line: 'Linje',
    destination: 'Destinasjon',
    name: 'Stoppested',
    platform: 'Plattform',
    time: 'Forventet',
} as const

export type TileColumnDB = keyof typeof TileColumns

export type QuayTileDB = {
    type: 'quay'
} & BaseTileDB
export type StopPlaceTileDB = {
    type: 'stop_place'
} & BaseTileDB

export type BoardTileDB = StopPlaceTileDB | QuayTileDB

export type BoardWalkingDistanceDB = {
    distance?: number
    visible?: boolean
}
