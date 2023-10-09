import { useBoardsSettings } from '../../utils/context'
import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'
import { TBoardsColumn } from 'Admin/types/boards'
import { intersection } from 'lodash'

function TableRows() {
    const { boards, columns, search, filterTags } = useBoardsSettings()
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
                        intersection(board?.meta?.tags ?? [], filterTags)
                            .length > 0 || filterTags.length === 0,
                )
                .sort(sortFunction)
                .map((board: TBoard) => (
                    <Fragment key={board.id}>
                        {columns.map((column: TBoardsColumn) => (
                            <Column
                                key={column}
                                board={board}
                                column={column}
                            />
                        ))}
                    </Fragment>
                ))}
        </>
    )
}

export { TableRows }
