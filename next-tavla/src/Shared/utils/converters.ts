import { TSettings } from 'types/settings'

export function upgradeSettings(settings: TSettingsVersions): TSettings {
    if (!settings.version) settings.version = 1

    return settings
}

type TColumnBase = 'destination' | 'line' | 'time' | 'platform' | 'via'

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
    uuid: string
    whitelistedLines?: string[]
    whitelistedTransportModes?: TTransportModeBase[]
}

type TColumnTileBase = {
    columns?: TColumnBase[]
}

type TQuayTileBase = {
    type: 'quay'
    stopPlaceId: string
} & TSharedTileBase &
    TColumnTileBase

type TStopPlaceTileBase = {
    type: 'stop_place'
} & TSharedTileBase &
    TColumnTileBase

type TTileBase = TQuayTileBase | TStopPlaceTileBase

type TSettingsBase = {
    tiles: TTileBase[]
    theme?: TThemeBase
    version?: number
}

type TSettingsV1 = {
    version: 1
} & TSettingsBase

export type TSettingsVersions = TSettingsBase | TSettingsV1
