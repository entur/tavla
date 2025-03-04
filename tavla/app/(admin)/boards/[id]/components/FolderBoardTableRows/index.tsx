'use client'
import { Column } from 'app/(admin)/boards/components/Column'
import { useSearchParam } from 'app/(admin)/boards/hooks/useSearchParam'
import { useSortBoardFunction } from 'app/(admin)/boards/hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import {
    DEFAULT_BOARD_IN_FOLDER_COLUMNS,
    TTableColumn,
} from 'app/(admin)/utils/types'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'

function FolderBoardTableRows({ boards }: { boards: TBoard[] }) {
    const search = useSearchParam('search') ?? ''
    const sortBoardFunction = useSortBoardFunction()

    const searchFilters = search
        .split(' ')
        .map((part) => new RegExp(part.replace(/[^a-z/Wæøå0-9- ]+/g, ''), 'i'))

    const filterByTitleAndOrgName = (board: TBoard) =>
        searchFilters
            .map((filter) =>
                filter.test(board.meta.title ?? DEFAULT_BOARD_NAME),
            )
            .every((e) => e === true)

    const sortedBoards = boards
        .filter(filterByTitleAndOrgName)
        .sort(sortBoardFunction)

    return (
        <>
            {sortedBoards.map((board: TBoard) => (
                <Fragment key={board.id}>
                    <BoardInFolderTableRow board={board} />
                </Fragment>
            ))}
        </>
    )
}

function BoardInFolderTableRow({ board }: { board: TBoard }) {
    const columns = DEFAULT_BOARD_IN_FOLDER_COLUMNS
    return (
        <Fragment key={board.id}>
            {columns.map((column: TTableColumn) => (
                <Column
                    key={column}
                    boardWithoutFolder={board}
                    column={column}
                />
            ))}
        </Fragment>
    )
}

export { FolderBoardTableRows }
