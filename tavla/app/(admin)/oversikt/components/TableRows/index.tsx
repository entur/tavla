import {
    DEFAULT_BOARD_COLUMNS,
    Folder,
    TTableColumn,
} from 'app/(admin)/utils/types'
import { Fragment } from 'react'
import { TBoard, TFolder } from 'types/settings'
import { Column } from '../Column'

type TableRowsProps = {
    folders: Folder[]
    boards: TBoard[]
}

/**
 * Pure rendering component for table rows.
 * Expects pre-filtered and pre-sorted data from parent components.
 */
function TableRows({ folders, boards }: TableRowsProps) {
    return (
        <>
            {folders.map((folder: Folder) =>
                folder.id !== undefined ? (
                    <FolderTableRow
                        key={folder.id}
                        folder={folder}
                        count={folder.boardCount}
                        lastUpdated={folder.lastUpdated}
                    />
                ) : null,
            )}
            {boards.map((board: TBoard) => (
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

function FolderTableRow({
    folder,
    count,
    lastUpdated,
}: {
    folder: TFolder
    count: number
    lastUpdated?: number
}) {
    const columns = DEFAULT_BOARD_COLUMNS
    return (
        <Fragment key={folder.id}>
            {columns.map((column: TTableColumn) => (
                <Column
                    key={column}
                    folder={folder}
                    column={column}
                    folderBoardCount={count}
                    folderLastUpdated={lastUpdated}
                />
            ))}
        </Fragment>
    )
}

export { TableRows }
