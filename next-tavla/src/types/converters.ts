import { nanoid } from 'nanoid'
import { TSettings } from './settings'

const latestUpgrade = V4

export function upgradeType(setting: Any): TSettings {
    return latestUpgrade(setting)
}

function previousVersion<T, R>(
    setting: Any,
    version: number,
    converterFunction: (setting: T) => R,
): R {
    let settingToConvert = setting
    if (setting.version !== version) {
        settingToConvert = converterFunction(setting)
    }
    return settingToConvert
}

function V4(setting: Any) {
    const v3 = previousVersion(setting, 3, V3)
    // Do converter things
    const v4 = v3
    return v4
}

function V3(setting: Any) {
    const v2 = previousVersion(setting, 2, V2)
    // Do converter things
    const v3 = v2
    return v3
}

export function V2(setting: TBaseSetting) {
    const v2 = {
        ...setting,
        tiles: setting.tiles.map((tile) => {
            if (tile.type === 'stop_place' || tile.type === 'quay') {
                return {
                    ...tile,
                    columns: tile.columns?.map((column) => ({ type: column })),
                    uuid: nanoid(),
                }
            }
            return tile
        }),
    }
    return v2
}

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
