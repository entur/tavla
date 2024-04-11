'use client'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard } from 'types/settings'
import { isEmpty } from 'lodash'
import { useSearchParam } from '../../hooks/useSearchParam'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { DEFAULT_BOARD_COLUMNS, TBoardsColumn } from 'app/(admin)/utils/types'

function BoardTable({ boards }: { boards: TBoard[] }) {
    const value = useSearchParam('columns')
    const columns = value?.split(',') ?? DEFAULT_BOARD_COLUMNS

    if (isEmpty(boards))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen tavler ennå"
            />
        )

    return (
        <div
            className="grid alignCenter"
            style={{
                gridTemplateColumns: `repeat(${columns.length},auto)`,
            }}
        >
            <TableHeader columns={columns as TBoardsColumn[]} />
            <TableRows boards={boards} />
        </div>
    )
}
export { BoardTable }
