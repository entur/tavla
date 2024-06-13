import { TBoard, TBoardWithOrganizaion } from 'types/settings'
import { useCallback } from 'react'
import { useSearchParam } from './useSearchParam'
import { TBoardsColumn, TSort } from 'app/(admin)/utils/types'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'

function useSortBoardFunction() {
    const value = useSearchParam('sort')
    const sortParams = value?.split(':')

    const sortBoards = useCallback(
        (boardA: TBoardWithOrganizaion, boardB: TBoardWithOrganizaion) => {
            let sortFunc: () => number
            const sort = {
                column: sortParams?.[0] as TBoardsColumn,
                type: sortParams?.[1] as TSort,
            }
            switch (sort.column) {
                case 'lastModified':
                    sortFunc = () => {
                        const modifiedA = boardA.board.meta?.dateModified ?? 0
                        const modifiedB = boardB.board.meta?.dateModified ?? 0
                        return modifiedB - modifiedA
                    }
                    break
                case 'organization':

                default:
                    sortFunc = () => {
                        const titleA =
                            boardA?.board.meta?.title?.toLowerCase() ??
                            DEFAULT_BOARD_NAME
                        const titleB =
                            boardB?.board.meta?.title?.toLowerCase() ??
                            DEFAULT_BOARD_NAME
                        return titleB.localeCompare(titleA)
                    }
                    break
            }
            switch (sort.type) {
                case 'ascending':
                    return -sortFunc()
                case 'descending':
                    return sortFunc()
                default:
                    return 0
            }
        },
        [sortParams],
    )

    return sortBoards
}

export { useSortBoardFunction }
