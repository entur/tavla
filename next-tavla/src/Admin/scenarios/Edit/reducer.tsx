import { arrayMove } from '@dnd-kit/sortable'
import { TAnonTiles } from 'Admin/types'
import { clone, xor } from 'lodash'
import { nanoid } from 'nanoid'
import { TColumn } from 'types/column'
import { TSettings, TTheme } from 'types/settings'
import { TQuayTile, TStopPlaceTile, TTile } from 'types/tile'

export type Action =
    | { type: 'changeTheme'; theme: TTheme }
    | { type: 'addTile'; tile: TAnonTiles }
    | { type: 'removeTile'; tileId: string }
    | { type: 'updateTile'; tileIndex: number; tile: TTile }
    | { type: 'swapTiles'; oldIndex: number; newIndex: number }
    | { type: 'toggleLine'; tileId: string; lineId: string }
    | { type: 'setColumn'; tileId: string; column: TColumn; value: boolean }

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
        case 'setColumn': {
            return changeTile<TStopPlaceTile | TQuayTile>(
                action.tileId,
                (tile) => {
                    return {
                        ...tile,
                        columns: {
                            ...tile.columns,
                            ...{ [action.column]: action.value },
                        },
                    }
                },
            )
        }
    }
}
