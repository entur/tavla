import { arrayMove } from '@dnd-kit/sortable'
import { TAnonTiles } from 'Admin/types'
import { clone, xor } from 'lodash'
import { nanoid } from 'nanoid'
import { TColumn } from 'types/column'
import { TFontSize } from 'types/meta'
import { TBoard, TTheme } from 'types/settings'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'

export type Action =
    | { type: 'changeTheme'; theme: TTheme }
    | { type: 'addTile'; tile: TAnonTiles }
    | { type: 'removeTile'; tileId: string }
    | { type: 'setTile'; tile: TTile }
    | { type: 'swapTiles'; oldIndex: number; newIndex: number }
    | { type: 'setLines'; tileId: string; lines?: string[] }
    | { type: 'deleteLines'; tileId: string }
    | { type: 'setColumn'; tileId: string; column: TColumn }
    | { type: 'setTitle'; title?: string }
    | { type: 'changeFontSize'; fontSize?: TFontSize }

export function boardReducer(settings: TBoard, action: Action): TBoard {
    const modifiedSettings = {
        ...settings,
        meta: { ...settings.meta, dateModified: Date.now() },
    }

    const changeTile = <T extends TTile>(
        tileId: string,
        changeFunction: (tile: T) => T,
    ): TBoard => {
        const originalTileIndex = modifiedSettings.tiles.findIndex(
            ({ uuid }) => uuid === tileId,
        )
        const originalTile = modifiedSettings.tiles[originalTileIndex] as T

        const changedTile = changeFunction(originalTile)
        const tilesClone = clone(modifiedSettings.tiles)
        tilesClone[originalTileIndex] = changedTile

        return {
            ...modifiedSettings,
            tiles: tilesClone,
        }
    }

    switch (action.type) {
        // Title operations
        case 'setTitle':
            return {
                ...modifiedSettings,
                meta: {
                    ...modifiedSettings.meta,
                    title: action.title,
                },
            }

        // Theme operations
        case 'changeTheme': {
            return { ...modifiedSettings, theme: action.theme }
        }
        // Fontsize operations
        case 'changeFontSize': {
            return {
                ...modifiedSettings,
                meta: {
                    ...modifiedSettings.meta,
                    fontSize: action.fontSize,
                },
            }
        }
        // Tile operations
        case 'addTile': {
            return {
                ...modifiedSettings,
                tiles: [
                    ...modifiedSettings.tiles,
                    {
                        ...action.tile,
                        uuid: nanoid(),
                        columns: ['line', 'destination', 'time', 'realtime'],
                    },
                ],
            }
        }
        case 'removeTile': {
            return {
                ...modifiedSettings,
                tiles: modifiedSettings.tiles.filter(
                    ({ uuid }) => uuid !== action.tileId,
                ),
            }
        }
        case 'setTile': {
            return {
                ...modifiedSettings,
                tiles: modifiedSettings.tiles.map((tile) => {
                    if (tile.uuid === action.tile.uuid) return action.tile
                    return tile
                }),
            }
        }
        case 'swapTiles': {
            return {
                ...modifiedSettings,
                tiles: arrayMove(
                    modifiedSettings.tiles,
                    action.oldIndex,
                    action.newIndex,
                ),
            }
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
