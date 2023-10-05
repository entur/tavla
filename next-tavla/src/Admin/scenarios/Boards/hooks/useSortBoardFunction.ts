import { TBoard } from 'types/settings'
import { useBoardsSettings } from '../utils/context'
import { useCallback } from 'react'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'

function useSortBoardFunction() {
    const settings = useBoardsSettings()

    const sortBoards = useCallback(
        (boardA: TBoard, boardB: TBoard) => {
            let sortFunc: () => number

            switch (settings.sort.column) {
                case 'lastModified':
                    sortFunc = () => {
                        const modifiedA = boardA.meta?.dateModified ?? 0
                        const modifiedB = boardB.meta?.dateModified ?? 0
                        return modifiedB - modifiedA
                    }
                    break
                default:
                    sortFunc = () => {
                        const titleA =
                            boardA?.meta?.title?.toLowerCase() ??
                            DEFAULT_BOARD_NAME
                        const titleB =
                            boardB?.meta?.title?.toLowerCase() ??
                            DEFAULT_BOARD_NAME
                        return titleB.localeCompare(titleA)
                    }
                    break
            }
            switch (settings.sort.type) {
                case 'ascending':
                    return -sortFunc()
                case 'descending':
                    return sortFunc()
                default:
                    return 0
            }
        },
        [settings.sort],
    )

    return sortBoards
}

export { useSortBoardFunction }
