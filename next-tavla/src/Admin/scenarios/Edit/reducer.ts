import { arrayMove } from '@dnd-kit/sortable'
import { TAnonTiles } from 'Admin/types'
import { clone, filter, xor } from 'lodash'
import { nanoid } from 'nanoid'
import { TColumn } from 'types/column'
import { TTransportMode } from 'types/graphql-schema'
import { TSettings, TTheme } from 'types/settings'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'

export type Action =
    | { type: 'changeTheme'; theme: TTheme }
    | { type: 'addTile'; tile: TAnonTiles }
    | { type: 'removeTile'; tileId: string }
    | { type: 'setTile'; tile: TTile }
    | { type: 'swapTiles'; oldIndex: number; newIndex: number }
    | { type: 'toggleLine'; tileId: string; lineId: string }
    | { type: 'removeLines'; tileId: string; lineIds: string[] }
    | { type: 'setLines'; tileId: string; lines: string[] }
    | {
          type: 'toggleTransportMode'
          tileId: string
          transportMode: TTransportMode
      }
    | { type: 'deleteLines'; tileId: string }
    | { type: 'setColumn'; tileId: string; column: TColumn }

export function settingsReducer(
    settings: TSettings,
    action: Action,
): TSettings {
    function changeTile<T extends TTile>(
        tileId: string,
        changeFunction: (tile: T) => T,
    ): TSettings {
        const originalTileIndex = settings.tiles.findIndex(
            ({ uuid }) => uuid === tileId,
        )
        const originalTile = settings.tiles[originalTileIndex] as T

        const changedTile = changeFunction(originalTile)
        const tilesClone = clone(settings.tiles)
        tilesClone[originalTileIndex] = changedTile

        return {
            ...settings,
            tiles: tilesClone,
        }
    }

    switch (action.type) {
        // Theme operations
        case 'changeTheme': {
            return { ...settings, theme: action.theme }
        }
        // Tile operations
        case 'addTile': {
            return {
                ...settings,
                tiles: [
                    {
                        ...action.tile,
                        uuid: nanoid(),
                        columns: ['line', 'destination', 'time'],
                    },
                    ...settings.tiles,
                ],
            }
        }
        case 'removeTile': {
            return {
                ...settings,
                tiles: settings.tiles.filter(
                    ({ uuid }) => uuid !== action.tileId,
                ),
            }
        }
        case 'setTile': {
            return {
                ...settings,
                tiles: settings.tiles.map((tile) => {
                    if (tile.uuid === action.tile.uuid) return action.tile
                    return tile
                }),
            }
        }
        case 'swapTiles': {
            return {
                ...settings,
                tiles: arrayMove(
                    settings.tiles,
                    action.oldIndex,
                    action.newIndex,
                ),
            }
        }
        // Line operations
        case 'toggleLine': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    if (!tile.whitelistedLines)
                        return { ...tile, whitelistedLines: [action.lineId] }

                    return {
                        ...tile,
                        whitelistedLines: xor(tile.whitelistedLines, [
                            action.lineId,
                        ]),
                    }
                },
            )
        }
        case 'removeLines': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    if (!tile.whitelistedLines) return { ...tile }

                    return {
                        ...tile,
                        whitelistedLines: filter(
                            tile.whitelistedLines,
                            (line) => !action.lineIds.includes(line),
                        ),
                    }
                },
            )
        }
        case 'setLines': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        whitelistedLines: action.lines,
                    }
                },
            )
        }
        case 'deleteLines': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    if (tile.whitelistedLines) delete tile.whitelistedLines
                    return tile
                },
            )
        }
        case 'toggleTransportMode': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    if (!tile.whitelistedTransportModes)
                        return {
                            ...tile,
                            whitelistedTransportModes: [action.transportMode],
                        }
                    return {
                        ...tile,
                        whitelistedTransportModes: xor(
                            tile.whitelistedTransportModes,
                            [action.transportMode],
                        ),
                    }
                },
            )
        }
        case 'setColumn': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        columns: xor(tile.columns, [action.column]),
                    }
                },
            )
        }
    }
}
