import {
    useSortBoardFunction,
    useSortFolderFunction,
} from '../../hooks/useSortBoardFunction'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard, TOrganization } from 'types/settings'
import { useSearchParam } from '../../hooks/useSearchParam'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { DEFAULT_BOARD_COLUMNS, TTableColumn } from 'app/(admin)/utils/types'

function TableRows({
    folders,
    boards,
}: {
    folders: TOrganization[]
    boards: TBoard[]
}) {
    const search = useSearchParam('search') ?? ''
    const sortBoardFunction = useSortBoardFunction()
    const sortFolderFunction = useSortFolderFunction()
    const searchFilters = search
        .split(' ')
        .map((part) => new RegExp(part.replace(/[^a-z/Wæøå0-9- ]+/g, ''), 'i'))

    const filterByTitleAndOrgName = (board: TBoard) =>
        searchFilters
            .map((filter) =>
                filter.test(board.meta.title ?? DEFAULT_BOARD_NAME),
            )
            .every((e) => e === true)

    const filterByFolderName = (folder: TOrganization) =>
        searchFilters
            .map((filter) => filter.test(folder.name ?? DEFAULT_BOARD_NAME))
            .every((e) => e === true)

    const sortedBoards = boards
        .filter(filterByTitleAndOrgName)
        .sort(sortBoardFunction)

    const sortedFolders = folders
        .filter(filterByFolderName)
        .sort(sortFolderFunction)
    return (
        <>
            {sortedFolders.map((folder: TOrganization) => (
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

export default function FolderTableRow({ folder }: { folder: TOrganization }) {
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
