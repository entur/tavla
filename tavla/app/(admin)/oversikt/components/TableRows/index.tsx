import { useSearchParam } from 'app/(admin)/oversikt/hooks/useSearchParam'
import {
    useSortBoardFunction,
    useSortFolderFunction,
} from 'app/(admin)/oversikt/hooks/useSortBoardFunction'
import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import {
    DEFAULT_BOARD_COLUMNS,
    Folder,
    TTableColumn,
} from 'app/(admin)/utils/types'
import { Fragment } from 'react'
import { TBoard, TFolder } from 'types/settings'
import { Column } from '../Column'

type TableRowsProps = {
    folders: Folder[]
    boards: TBoard[]
    allBoards?: TBoard[]
}

function TableRows({ folders, boards, allBoards }: TableRowsProps) {
    const search = useSearchParam('search') ?? ''
    const sortBoardFunction = useSortBoardFunction()
    const sortFolderFunction = useSortFolderFunction()
    const searchFilters = search
        .split(' ')
        .map((part) => new RegExp(part.replace(/[^a-z/Wæøå0-9- ]+/g, ''), 'i'))

    // If there's a search term and we have allBoards, search in all boards
    const isSearching = search.trim().length > 0 && allBoards

    const filterByBoardName = (board: TBoard) =>
        searchFilters
            .map((filter) =>
                filter.test(board.meta.title ?? DEFAULT_BOARD_NAME),
            )
            .every((e) => e === true)

    const filterByFolderName = (folder: Folder) =>
        searchFilters
            .map((filter) => filter.test(folder.name ?? DEFAULT_FOLDER_NAME))
            .every((e) => e === true)

    if (isSearching) {
        const matchingBoards = allBoards!
            .filter(filterByBoardName)
            .sort(sortBoardFunction)

        const matchingFolders = folders
            .filter(filterByFolderName)
            .sort(sortFolderFunction)

        return (
            <>
                {matchingFolders.map((folder: Folder) =>
                    folder.id !== undefined ? (
                        <FolderTableRow
                            key={folder.id}
                            folder={folder}
                            count={folder.boardCount}
                            lastUpdated={folder.lastUpdated}
                        />
                    ) : null,
                )}
                {matchingBoards.map((board: TBoard) => (
                    <BoardTableRow key={board.id} board={board} />
                ))}
            </>
        )
    }

    const sortedBoards = boards
        .filter(filterByBoardName)
        .sort(sortBoardFunction)

    const sortedFolders = folders
        .filter(filterByFolderName)
        .sort(sortFolderFunction)

    return (
        <>
            {sortedFolders.map((folder: Folder) =>
                folder.id !== undefined ? (
                    <FolderTableRow
                        key={folder.id}
                        folder={folder}
                        count={folder.boardCount}
                        lastUpdated={folder.lastUpdated}
                    />
                ) : null,
            )}
            {sortedBoards.map((board: TBoard) => (
                <BoardTableRow key={board.id} board={board} />
            ))}
        </>
    )
}

function BoardTableRow({ board }: { board: TBoard }) {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <Fragment key={board.id}>
            {columns.map((column: TTableColumn) => (
                <Column key={column} board={board} column={column} />
            ))}
        </Fragment>
    )
}

function FolderTableRow({
    folder,
    count,
    lastUpdated,
}: {
    folder: TFolder
    count: number
    lastUpdated?: number
}) {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <Fragment key={folder.id}>
            {columns.map((column: TTableColumn) => (
                <Column
                    key={column}
                    folder={folder}
                    column={column}
                    folderBoardCount={count}
                    folderLastUpdated={lastUpdated}
                />
            ))}
        </Fragment>
    )
}

export { TableRows }
