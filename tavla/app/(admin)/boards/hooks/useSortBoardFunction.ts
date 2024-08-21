import { TBoardWithOrganizaion } from 'types/settings'
import { useCallback } from 'react'
import { useSearchParam } from './useSearchParam'
import { TBoardsColumn, TSort } from 'app/(admin)/utils/types'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'

const DEFAULT_SORT_COLUMN: TBoardsColumn = 'lastModified'
const DEFAULT_SORT_TYPE: TSort = 'descending'

function useSortBoardFunction() {
    const value = useSearchParam('sort')
    const sortParams = value?.split(':')

    const sortColumn: TBoardsColumn =
        (sortParams?.[0] as TBoardsColumn) || DEFAULT_SORT_COLUMN
    const sortType: TSort = (sortParams?.[1] as TSort) || DEFAULT_SORT_TYPE

    const sortBoards = useCallback(
        (boardA: TBoardWithOrganizaion, boardB: TBoardWithOrganizaion) => {
            let sortFunc: () => number
            const compareTitle = () => {
                const titleA =
                    boardA?.board.meta?.title?.toLowerCase() ??
                    DEFAULT_BOARD_NAME
                const titleB =
                    boardB?.board.meta?.title?.toLowerCase() ??
                    DEFAULT_BOARD_NAME
                return titleB.localeCompare(titleA)
            }

            switch (sortColumn) {
                case 'lastModified':
                    sortFunc = () => {
                        const modifiedA = boardA.board.meta?.dateModified ?? 0
                        const modifiedB = boardB.board.meta?.dateModified ?? 0
                        return modifiedB - modifiedA
                    }
                    break
                case 'organization':
                    sortFunc = () => {
                        const orgNameA =
                            boardA.organization?.name?.toLowerCase() ?? 'Privat'
                        const orgNameB =
                            boardB.organization?.name?.toLowerCase() ?? 'Privat'

                        if (orgNameA == orgNameB) {
                            return sortType == 'ascending'
                                ? compareTitle()
                                : -compareTitle()
                        }
                        return orgNameB.localeCompare(orgNameA)
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

export { useSortBoardFunction }
