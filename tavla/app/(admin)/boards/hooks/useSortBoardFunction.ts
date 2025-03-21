import { TBoard } from 'types/settings'
import { useCallback } from 'react'
import { useSearchParam } from './useSearchParam'

import {
    DEFAULT_BOARD_NAME,
    DEFAULT_SORT_COLUMN,
    DEFAULT_SORT_TYPE,
} from 'app/(admin)/utils/constants'
import { useSortFolderFunction } from './useSortFolderFunction'
import { TTableColumn, TSort } from 'app/(admin)/utils/types'

function useSortBoardFunction() {
    const value = useSearchParam('sort')
    const sortParams = value?.split(':')

    const sortColumn: TTableColumn =
        (sortParams?.[0] as TTableColumn) || DEFAULT_SORT_COLUMN
    const sortType: TSort = (sortParams?.[1] as TSort) || DEFAULT_SORT_TYPE

    const sortBoards = useCallback(
        (boardA: TBoard, boardB: TBoard) => {
            let sortFunc: () => number
            const compareTitle = () => {
                const titleA =
                    boardA?.meta?.title?.toLowerCase() ?? DEFAULT_BOARD_NAME
                const titleB =
                    boardB?.meta?.title?.toLowerCase() ?? DEFAULT_BOARD_NAME
                return titleB.localeCompare(titleA)
            }

            switch (sortColumn) {
                case 'lastModified':
                    sortFunc = () => {
                        const modifiedA = boardA.meta?.dateModified ?? 0
                        const modifiedB = boardB.meta?.dateModified ?? 0
                        return modifiedB - modifiedA
                    }
                    break
                default:
                    sortFunc = () => {
                        return compareTitle()
                    }
                    break
            }
            switch (sortType) {
                case 'ascending':
                    return -sortFunc()
                case 'descending':
                    return sortFunc()
                default:
                    return 0
            }
        },
        [sortColumn, sortType],
    )

    return sortBoards
}

export { useSortBoardFunction, useSortFolderFunction }
