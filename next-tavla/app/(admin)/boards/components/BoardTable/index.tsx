'use client'
import classes from './styles.module.css'
import { TableHeader } from 'app/(admin)/boards/components/TableHeader'
import { TableRows } from 'app/(admin)/boards/components/TableRows'
import { TBoard } from 'types/settings'
import { isEmpty } from 'lodash'
import { IllustratedInfo } from 'Admin/components/IllustratedInfo'
import { useBoardsSettings } from '../../hooks/useBoardsSettings'

function BoardTable({ boards }: { boards: TBoard[] }) {
    const { columns } = useBoardsSettings()
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
            <TableHeader columns={columns} />
            <TableRows boards={boards} />
        </div>
    )
}
export { BoardTable }
