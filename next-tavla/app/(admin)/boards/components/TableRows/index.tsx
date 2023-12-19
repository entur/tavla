import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'
import { DEFAULT_BOARD_COLUMNS, TBoardsColumn } from 'Admin/types/boards'
import { uniq } from 'lodash'
import { TTag } from 'types/meta'
import { useSearchParam } from '../../hooks/useSearchParam'

function TableRows({ boards }: { boards: TBoard[] }) {
    const search = useSearchParam('search') ?? ''
    const filter = useSearchParam('tags')?.split(',') ?? []
    const columns =
        useSearchParam('columns')?.split(',') ?? DEFAULT_BOARD_COLUMNS
    const sortFunction = useSortBoardFunction()
    const searchFilter = new RegExp(search, 'i')
    return (
        <>
            {boards
                .filter((board: TBoard) =>
                    searchFilter.test(board?.meta?.title ?? DEFAULT_BOARD_NAME),
                )
                .filter(
                    (board: TBoard) =>
                        filter.length === 0 ||
                        filter.every((tag) =>
                            (board?.meta?.tags ?? []).includes(tag),
                        ),
                )
                .sort(sortFunction)
                .map((board: TBoard) => (
                    <TableRow
                        key={board.id}
                        board={board}
                        columns={columns as TBoardsColumn[]}
                        tags={uniq(
                            boards.flatMap((board) => board?.meta?.tags ?? []),
                        )}
                    />
                ))}
        </>
    )
}

function TableRow({
    board,
    columns,
    tags,
}: {
    board: TBoard
    columns: TBoardsColumn[]
    tags: TTag[]
}) {
    return (
        <Fragment key={board.id}>
            {columns.map((column: TBoardsColumn) => (
                <Column
                    key={column}
                    board={board}
                    column={column}
                    tags={tags}
                />
            ))}
        </Fragment>
    )
}

export { TableRows }
