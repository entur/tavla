/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from 'nanoid'
import { TSettings } from './settings'
import { reverse } from 'lodash'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertSettingsVersion(settings: any): TSettings {
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

const versions = [V2, V1] as const

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
