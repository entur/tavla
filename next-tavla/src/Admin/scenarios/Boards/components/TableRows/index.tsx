import { useBoardsSettings } from '../../utils/context'
import { formatDate } from 'utils/time'
import { useSortBoardFunction } from '../../hooks/useSortBoardFunction'
import { DEFAULT_BOARD_NAME } from 'Admin/utils/constants'

function TableRows() {
    const settings = useBoardsSettings()
    const sortFunction = useSortBoardFunction()

    const filter = new RegExp(settings.search, 'i')
    return (
        <>
            {settings.boards
                .filter((board) =>
                    filter.test(board?.meta?.title ?? DEFAULT_BOARD_NAME),
                )
                .sort(sortFunction)
                .map((board) => (
                    <>
                        <div>{board.meta?.title ?? DEFAULT_BOARD_NAME}</div>
                        <div>{board.id}</div>
                        <div>Valg</div>
                        <div>
                            {board?.meta?.dateModified &&
                                formatDate(new Date(board.meta.dateModified))}
                        </div>
                    </>
                ))}
        </>
    )
}

export { TableRows }
