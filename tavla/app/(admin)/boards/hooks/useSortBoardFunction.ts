import { TBoard, TOrganization } from 'types/settings'
import { useCallback } from 'react'
import { useSearchParam } from './useSearchParam'
import { TTableColumn, TSort } from 'app/(admin)/utils/types'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'

const DEFAULT_SORT_COLUMN: TTableColumn = 'lastModified'
const DEFAULT_SORT_TYPE: TSort = 'descending'

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

function useSortFolderFunction() {
    const value = useSearchParam('sort')
    const sortParams = value?.split(':')

    const sortColumn: TTableColumn =
        (sortParams?.[0] as TTableColumn) || DEFAULT_SORT_COLUMN
    const sortType: TSort = (sortParams?.[1] as TSort) || DEFAULT_SORT_TYPE

    const sortFolders = useCallback(
        (folderA: TOrganization, folderB: TOrganization) => {
            let sortFunc: () => number
            const compareTitle = () => {
                const titleA =
                    folderA?.name?.toLowerCase() ?? DEFAULT_BOARD_NAME
                const titleB =
                    folderB?.name?.toLowerCase() ?? DEFAULT_BOARD_NAME
                return titleB.localeCompare(titleA)
            }

            switch (sortColumn) {
                case 'lastModified':
                    return 0
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

    return sortFolders
}

export { useSortBoardFunction, useSortFolderFunction }
