import { TBoard, TBoardID } from 'types/settings'

export function upgradeBoard(settings: TBoardVersions): TBoard {
    if (!settings.version) settings.version = 1

    return settings
}

type TColumnBase =
    | 'aimedTime'
    | 'arrivalTime'
    | 'destination'
    | 'transportMethod'
    | 'line'
    | 'time'
    | 'platform'
    | 'realtime'
    | 'deviations'

type TTransportModeBase =
    | 'air'
    | 'bus'
    | 'cableway'
    | 'coach'
    | 'funicular'
    | 'lift'
    | 'metro'
    | 'monorail'
    | 'rail'
    | 'tram'
    | 'trolleybus'
    | 'unknown'
    | 'water'

type TThemeBase = 'entur' | 'dark' | 'light'

type TSharedTileBase = {
    placeId: string
    name: string
    uuid: string
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportModeBase[]
}

type TColumnTileBase = {
    columns?: TColumnBase[]
}

type TQuayTileBase = {
    type: 'quay'
} & TSharedTileBase &
    TColumnTileBase

type TStopPlaceTileBase = {
    type: 'stop_place'
} & TSharedTileBase &
    TColumnTileBase

type TTileBase = TQuayTileBase | TStopPlaceTileBase

type TBoardBase = {
    id?: TBoardID
    tiles: TTileBase[]
    theme?: TThemeBase
    version?: number
}

type TBoardV1 = {
    version: 1
} & TBoardBase

export type TBoardVersions = TBoardBase | TBoardV1
