import { arrayMove } from '@dnd-kit/sortable'
import { clone, xor } from 'lodash'
import { TSettings, TTheme } from 'types/settings'
import { TColumn, TQuayTile, TStopPlaceTile, TTile } from 'types/tile'
import { nanoid } from 'nanoid'
import { TColumnSetting } from 'types/tile'
import { TAnonTile } from '../../types'

export type Action =
    | { type: 'changeTheme'; theme: TTheme }
    | { type: 'addTile'; tile: TAnonTile<TTile> }
    | { type: 'removeTile'; tileId: string }
    | { type: 'updateTile'; tileIndex: number; tile: TTile }
    | { type: 'swapTiles'; oldIndex: number; newIndex: number }
    | { type: 'addColumn'; tileId: string; column: TColumn }
    | { type: 'removeColumn'; tileId: string; column: TColumn }
    | {
          type: 'updateColumn'
          tileId: string
          columnSetting: TColumnSetting
      }
    | {
          type: 'swapColumns'
          tileId: string
          oldIndex: number
          newIndex: number
      }
    | { type: 'toggleLine'; tileId: string; lineId: string }
    | {type: 'addFooter'; footer:string}

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
                tiles: [{ ...action.tile, uuid: nanoid() }, ...settings.tiles],
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
        case 'updateTile': {
            const clonedTiles = clone(settings.tiles)
            clonedTiles[action.tileIndex] = action.tile
            return {
                ...settings,
                tiles: clonedTiles,
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
        // Column operations
        case 'addColumn': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        columns: [
                            ...(tile.columns || []),
                            { type: action.column },
                        ],
                    }
                },
            )
        }
        case 'removeColumn': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        columns: tile.columns?.filter(
                            (col) => col.type !== action.column,
                        ),
                    }
                },
            )
        }
        case 'updateColumn': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        columns: tile.columns?.map((col) =>
                            col.type === action.columnSetting.type
                                ? action.columnSetting
                                : col,
                        ),
                    }
                },
            )
        }
        case 'swapColumns': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        columns: arrayMove(
                            tile.columns || [],
                            action.oldIndex,
                            action.newIndex,
                        ),
                    }
                },
            )
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
        case 'addFooter': {
            return {
                ...settings,
                footer: action.footer
            }
        }
    }
}
