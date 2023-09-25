import { useBoardsSettings } from '../../utils/context'
import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'
import { Column } from '../Column'
import { Fragment } from 'react'
import { TBoard } from 'types/settings'

function TableRows() {
    const { boards, columns, search } = useBoardsSettings()
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
                        {columns.includes('name') && (
                            <Column
                                key={'name'}
                                board={board}
                                column={'name'}
                            />
                        )}
                        {columns.includes('url') && (
                            <Column key={'url'} board={board} column={'url'} />
                        )}
                        {columns.includes('actions') && (
                            <Column
                                key={'actions'}
                                board={board}
                                column={'actions'}
                            />
                        )}
                        {columns.includes('lastModified') && (
                            <Column
                                key={'lastModified'}
                                board={board}
                                column={'lastModified'}
                            />
                        )}
                    </Fragment>
                ))}
        </>
    )
}

export { TableRows }
