import { TBoard } from 'types/settings'
import { Actions } from './Actions'
import { LastModified } from './LastModified'
import { Link } from './Link'
import { Name } from './Name'
import { TBoardsColumn } from 'Admin/types/boards'
import { ReactNode } from 'react'

function Column({ board, column }: { board: TBoard; column: TBoardsColumn }) {
    const columnComponents: Record<TBoardsColumn, ReactNode> = {
        name: <Name name={board.meta?.title} />,
        url: <Link bid={board.id} />,
        actions: <Actions board={board} />,
        lastModified: <LastModified timestamp={board.meta?.dateModified} />,
    }
    return <>{columnComponents[column]}</>
}

export { Column }
