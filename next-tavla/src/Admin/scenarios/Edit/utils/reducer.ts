import { arrayMove } from '@dnd-kit/sortable'
import { TAnonTiles } from 'Admin/types'
import { clone, xor } from 'lodash'
import { nanoid } from 'nanoid'
import { TColumn } from 'types/column'
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

export function boardReducer(settings: TBoard, action: Action): TBoard {
    function changeTile<T extends TTile>(
        tileId: string,
        changeFunction: (tile: T) => T,
    ): TBoard {
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
        // Title operations
        case 'setTitle':
            return {
                ...settings,
                meta: {
                    ...settings.meta,
                    title: action.title,
                },
            }

        // Theme operations
        case 'changeTheme': {
            return { ...settings, theme: action.theme }
        }
        // Tile operations
        case 'addTile': {
            return {
                ...settings,
                tiles: [
                    ...settings.tiles,
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
