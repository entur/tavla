import {
    DEFAULT_FOLDER_NAME,
    DEFAULT_SORT_COLUMN,
    DEFAULT_SORT_TYPE,
} from 'app/(admin)/utils/constants'

import { TSort, TTableColumn } from 'app/(admin)/utils/types'
import { useCallback } from 'react'
import { TFolder } from 'types/settings'
import { useSearchParam } from './useSearchParam'

function useSortFolderFunction() {
    const value = useSearchParam('sort')
    const sortParams = value?.split(':')

    const sortColumn: TTableColumn =
        (sortParams?.[0] as TTableColumn) || DEFAULT_SORT_COLUMN
    const sortType: TSort = (sortParams?.[1] as TSort) || DEFAULT_SORT_TYPE

    const sortFolders = useCallback(
        (folderA: TFolder, folderB: TFolder) => {
            let sortFunc: () => number
            const compareTitle = () => {
                const titleA =
                    folderA?.name?.toLowerCase() ?? DEFAULT_FOLDER_NAME
                const titleB =
                    folderB?.name?.toLowerCase() ?? DEFAULT_FOLDER_NAME
                return titleB.localeCompare(titleA)
            }

            switch (sortColumn) {
                case 'lastModified':
                    sortFunc = () => {
                        const modifiedA = folderA.lastUpdated ?? 0
                        const modifiedB = folderB.lastUpdated ?? 0
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

    return sortFolders
}

export { useSortFolderFunction }
