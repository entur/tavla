import { TBoard } from 'types/settings'
import { useCallback, useMemo } from 'react'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { TBoardsColumn, TSort } from 'Admin/types/boards'
import { useSearchParam } from './useSearchParam'

function useSortBoardFunction() {
    const value = useSearchParam('sort')
    const sortParams = value?.split(':')
    const sort = useMemo(() => {
        return {
            column: sortParams?.[0] as TBoardsColumn,
            type: sortParams?.[1] as TSort,
        }
    }, [sortParams])

    const sortBoards = useCallback(
        (boardA: TBoard, boardB: TBoard) => {
            let sortFunc: () => number

            switch (sort.column) {
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
            switch (sort.type) {
                case 'ascending':
                    return -sortFunc()
                case 'descending':
                    return sortFunc()
                default:
                    return 0
            }
        },
        [sort],
    )

    return sortBoards
}

export { useSortBoardFunction }
