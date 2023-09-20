import { TBoard } from 'types/settings'
import { useBoardsSettings } from '../utils/context'
import { useCallback } from 'react'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'

function useSortBoardFunction() {
    const settings = useBoardsSettings()

    const sortBoards = useCallback(
        (boardA: TBoard, boardB: TBoard) => {
            const titleA =
                boardA?.meta?.title?.toLowerCase() ?? DEFAULT_BOARD_NAME
            const titleB =
                boardB?.meta?.title?.toLowerCase() ?? DEFAULT_BOARD_NAME

            switch (settings.sort) {
                case 'alphabetical':
                    return titleA.localeCompare(titleB)
                case 'reverse-alphabetical':
                    return titleB.localeCompare(titleA)
                default:
                    return 0
            }
        },
        [settings.sort],
    )

    return sortBoards
}

export { useSortBoardFunction }
