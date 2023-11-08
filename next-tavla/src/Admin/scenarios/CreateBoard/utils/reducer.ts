import { TAnonTiles } from 'Admin/types'
import { nanoid } from 'nanoid'
import { TBoard } from 'types/settings'

export type Action =
    | { type: 'addTile'; tile: TAnonTiles }
    | { type: 'removeTile'; tileId: string }
    | { type: 'setTitle'; title: string }

export function createBoardReducer(settings: TBoard, action: Action): TBoard {
    const modifiedSettings = {
        ...settings,
        meta: { ...settings.meta, dateModified: Date.now() },
    }

    switch (action.type) {
        case 'addTile':
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
        case 'removeTile':
            return {
                ...modifiedSettings,
                tiles: modifiedSettings.tiles.filter(
                    ({ uuid }) => uuid !== action.tileId,
                ),
            }
        case 'setTitle':
            return {
                ...modifiedSettings,
                meta: {
                    ...modifiedSettings.meta,
                    title: action.title,
                },
            }
    }
}
