import { useBoardsSettingsDispatch } from '../utils/context'
import { TBoard } from 'types/settings'

export const useSafeBoardDispatch = () => {
    const dispatch = useBoardsSettingsDispatch()

    return async (newBoard: TBoard, fallBackBoard: TBoard) => {
        dispatch({ type: 'setBoard', board: newBoard })
        fetch('/api/board', {
            method: 'PUT',
            body: JSON.stringify({ board: newBoard }),
        }).then((response) => {
            if (fallBackBoard && response.status !== 200)
                dispatch({ type: 'setBoard', board: fallBackBoard })
        })
    }
}
