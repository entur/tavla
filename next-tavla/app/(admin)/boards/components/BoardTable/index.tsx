'use client'
import classes from './styles.module.css'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'Admin/components/IllustratedInfo'
import { DEFAULT_BOARD_COLUMNS, TBoardsColumn } from 'Admin/types/boards'
import { useSearchParam } from '../../hooks/useSearchParam'

function BoardTable({ boards }: { boards: TBoard[] }) {
    const value = useSearchParam('columns')
    const columns = value?.split(',') ?? DEFAULT_BOARD_COLUMNS
    if (isEmpty(boards))
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du har ikke laget noen Tavler ennå"
            />
        )
    return (
        <div
            className={classes.boardTable}
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
