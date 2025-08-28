'use client'
import { TableHeader } from 'app/(admin)/oversikt/components/TableHeader'
import { TableRows } from 'app/(admin)/oversikt/components/TableRows'
import { TableColumns } from 'app/(admin)/utils/types'
import { TBoard, TFolder } from 'types/settings'

type BoardTableProps = {
    folders?: TFolder[]
    boards: TBoard[]
    folderBoardCounts: Record<string, number>
}

function BoardTable({ folders, boards, folderBoardCounts }: BoardTableProps) {
    const numOfColumns = Object.keys(TableColumns).length

    return (
        <div
            className="grid items-center overflow-x-auto"
            style={{
                gridTemplateColumns: `repeat(${numOfColumns},auto)`,
            }}
        >
            <TableHeader />
            <TableRows
                folders={folders ?? []}
                boards={boards}
                folderBoardCounts={folderBoardCounts}
            />
        </div>
    )
}
export { BoardTable }
