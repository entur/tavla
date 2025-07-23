import {
    DEFAULT_BOARD_NAME,
    DEFAULT_FOLDER_NAME,
} from 'app/(admin)/utils/constants'
import { DEFAULT_BOARD_COLUMNS, TTableColumn } from 'app/(admin)/utils/types'
import { Fragment } from 'react'
import { TBoard, TFolder } from 'types/settings'
import { useSearchParam } from '../../hooks/useSearchParam'
import {
    useSortBoardFunction,
    useSortFolderFunction,
} from '../../hooks/useSortBoardFunction'
import { Column } from '../Column'

function TableRows({
    folders,
    boards,
}: {
    folders: TFolder[]
    boards: TBoard[]
}) {
    const search = useSearchParam('search') ?? ''
    const sortBoardFunction = useSortBoardFunction()
    const sortFolderFunction = useSortFolderFunction()
    const searchFilters = search
        .split(' ')
        .map((part) => new RegExp(part.replace(/[^a-z/Wæøå0-9- ]+/g, ''), 'i'))

    const filterByBoardName = (board: TBoard) =>
        searchFilters
            .map((filter) =>
                filter.test(board.meta.title ?? DEFAULT_BOARD_NAME),
            )
            .every((e) => e === true)

    const filterByFolderName = (folder: TFolder) =>
        searchFilters
            .map((filter) => filter.test(folder.name ?? DEFAULT_FOLDER_NAME))
            .every((e) => e === true)

    const sortedBoards = boards
        .filter(filterByBoardName)
        .sort(sortBoardFunction)

    const sortedFolders = folders
        .filter(filterByFolderName)
        .sort(sortFolderFunction)
    return (
        <>
            {sortedFolders.map((folder: TFolder) => (
                <FolderTableRow key={folder.id} folder={folder} />
            ))}
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

function FolderTableRow({ folder }: { folder: TFolder }) {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <Fragment key={folder.id}>
            {columns.map((column: TTableColumn) => (
                <Column key={column} folder={folder} column={column} />
            ))}
        </Fragment>
    )
}

export { TableRows }
