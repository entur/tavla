import { useBoardsSettings } from '../../utils/context'
import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'
import { TBoardsColumn } from 'Admin/types/boards'

function TableRows() {
    const { boards, columnOrder, search } = useBoardsSettings()
    const sortFunction = useSortBoardFunction()

    const filter = new RegExp(search, 'i')
    return (
        <>
            {boards
                .filter((board: TBoard) =>
                    filter.test(board?.meta?.title ?? DEFAULT_BOARD_NAME),
                )
                .sort(sortFunction)
                .map((board: TBoard) => (
                    <Fragment key={board.id}>
                        {columnOrder.map((column: TBoardsColumn) => (
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
