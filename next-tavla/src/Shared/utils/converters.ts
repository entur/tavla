import { nanoid } from 'nanoid'
import { reverse } from 'lodash'
import { TSettings } from 'types/settings'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertSettingsVersion(settings: any): TSettings {
    if (settings.version >= currentVersion) return settings

    const orderedVersions = reverse(versions)

    const upgradedSettings: ReturnType<(typeof versions)[0]> = orderedVersions
        .slice(settings.version)
        .reduce((prevSettings, converters) => {
            return converters(prevSettings)
        }, settings)

    return {
        ...upgradedSettings,
        version: currentVersion,
    }
}

const versions = [V4, V3, V2, V1] as const

export function V4(setting: ReturnType<typeof V3>) {
    return {
        ...setting,
        tiles: setting.tiles.map((tile) => {
            if (tile.type === 'quay') return { ...tile, stopPlaceId: '' }
            return tile
        }),
    }
}

export function V3(setting: ReturnType<typeof V2>) {
    const newSetting = {
        ...setting,
        theme: setting.theme === 'default' ? ('entur' as const) : setting.theme,
    }

    if (!newSetting.theme) delete newSetting.theme

    return newSetting
}

export function V2(setting: ReturnType<typeof V1>) {
    return {
        ...setting,
        tiles: setting.tiles.map((tile) => ({ ...tile, uuid: nanoid() })),
    }
}

export function V1(setting: TBaseSetting) {
    return {
        ...setting,
        tiles: setting.tiles.map((tile) => {
            if (tile.type === 'stop_place' || tile.type === 'quay') {
                return {
                    ...tile,
                    columns: tile.columns?.map((column) => ({
                        type: column,
                    })),
                }
            }
            return tile
        }),
    }
}

export const currentVersion = versions.length

type TBaseColumn = 'destination' | 'line' | 'time' | 'platform'

type TBaseTransportMode =
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

type TBaseTile = {
    placeId: string
}

type TBaseQuayTile = {
    type: 'quay'
    columns?: TBaseColumn[]
    whitelistedLines?: string[]
    whitelistedTransportModes?: TBaseTransportMode[]
} & TBaseTile

type TBaseStopPlaceTile = {
    type: 'stop_place'
    columns?: TBaseColumn[]
    whitelistedLines?: string[]
    whitelistedTransportModes?: TBaseTransportMode[]
} & TBaseTile

type TBaseMapTile = {
    type: 'map'
} & TBaseTile

type TBaseBaseTile = TBaseStopPlaceTile | TBaseMapTile | TBaseQuayTile

type TBaseSetting = {
    tiles: TBaseBaseTile[]
    theme?: 'default' | 'dark' | 'light'
}
