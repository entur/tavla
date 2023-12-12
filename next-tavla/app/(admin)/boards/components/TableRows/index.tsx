import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'
import { TBoardsColumn } from 'Admin/types/boards'
import { intersection, uniq } from 'lodash'
import { TTag } from 'types/meta'
import { useBoardsSettings } from '../../hooks/useBoardsSettings'

function TableRows({ boards }: { boards: TBoard[] }) {
    const { search, columns, filterTags } = useBoardsSettings()
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
                        filterTags.length === 0 ||
                        intersection(board?.meta?.tags ?? [], filterTags)
                            .length > 0,
                )
                .sort(sortFunction)
                .map((board: TBoard) => (
                    <TableRow
                        key={board.id}
                        board={board}
                        columns={columns}
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
