import { TBoardsColumn } from 'Admin/types/boards'
import { useBoardsSettings } from '../../utils/context'
import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'

function TableRows() {
    const settings = useBoardsSettings()
    const sortFunction = useSortBoardFunction()

    const filter = new RegExp(settings.search, 'i')
    return (
        <>
            {settings.boards
                .filter((board: TBoard) =>
                    filter.test(board?.meta?.title ?? DEFAULT_BOARD_NAME),
                )
                .sort(sortFunction)
                .map((board: TBoard) => (
                    <Fragment key={board.id}>
                        {settings.columns.map((column: TBoardsColumn) => (
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
