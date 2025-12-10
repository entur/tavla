import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { Folder } from 'app/(admin)/utils/types'
import { useMemo } from 'react'
import { BoardDB } from 'types/db-types/boards'
import { useSearchParam } from './useSearchParam'
import {
    useSortBoardFunction,
    useSortFolderFunction,
} from './useSortBoardFunction'

interface UseSearchAndFilterProps {
    folders?: Folder[]
    privateBoards?: BoardDB[]
    allBoards: BoardDB[]
    useAllBoardsForDefault?: boolean
}

interface FilteredData {
    folders?: Folder[]
    boards: BoardDB[]
    isSearching: boolean
}

// Utility functions
function createSearchFilters(searchTerm: string): RegExp[] {
    if (!searchTerm.trim()) return []

    return searchTerm
        .split(' ')
        .filter((part) => part.trim().length > 0)
        .map((part) => new RegExp(part.replace(/[^a-z/Wæøå0-9- ]+/g, ''), 'i'))
}

function getItemName(
    item: { name?: string } | { meta?: { title?: string } },
    defaultName: string,
): string {
    if ('name' in item && item.name) return item.name
    if ('meta' in item && item.meta?.title) return item.meta.title
    return defaultName
}

function matchesSearch(
    item: { name?: string } | { meta?: { title?: string } },
    searchFilters: RegExp[],
    defaultName: string,
): boolean {
    if (searchFilters.length === 0) return true

    const name = getItemName(item, defaultName)
    return searchFilters.every((filter) => filter.test(name))
}

/**
 * Custom hook that handles search, filtering, and sorting logic for folders and boards.
 */
export function useSearchAndFilter({
    folders,
    privateBoards,
    allBoards,
    useAllBoardsForDefault = false,
}: UseSearchAndFilterProps): FilteredData {
    const searchTerm = useSearchParam('search') ?? ''
    const sortBoardFunction = useSortBoardFunction()
    const sortFolderFunction = useSortFolderFunction()

    const searchFilters = useMemo(
        () => createSearchFilters(searchTerm),
        [searchTerm],
    )

    const isSearching = searchTerm.trim().length > 0

    const filteredData = useMemo(() => {
        if (isSearching) {
            const matchingBoards = allBoards
                .filter((board) =>
                    matchesSearch(board, searchFilters, DEFAULT_BOARD_NAME),
                )
                .sort(sortBoardFunction)

            const matchingFolders = folders
                ?.filter((folder) =>
                    matchesSearch(folder, searchFilters, DEFAULT_FOLDER_NAME),
                )
                .sort(sortFolderFunction)

            return {
                folders: matchingFolders,
                boards: matchingBoards,
                isSearching: true,
            }
        }

        const boardsToShow = useAllBoardsForDefault
            ? allBoards
            : (privateBoards ?? [])
        const filteredBoards = [...boardsToShow].sort(sortBoardFunction)

        const filteredFolders = [...(folders ?? [])].sort(sortFolderFunction)

        return {
            folders: filteredFolders,
            boards: filteredBoards,
            isSearching: false,
        }
    }, [
        searchFilters,
        isSearching,
        allBoards,
        folders,
        privateBoards,
        sortBoardFunction,
        sortFolderFunction,
        useAllBoardsForDefault,
    ])

    return filteredData
}
