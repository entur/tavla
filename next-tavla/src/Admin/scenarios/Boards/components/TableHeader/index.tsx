import { useCallback } from 'react'
import classes from './styles.module.css'
import { TBoardsColumn } from 'Admin/types/boards'
import { Sort } from '../Sort'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    const title = useCallback((column: TBoardsColumn) => {
        switch (column) {
            case 'name':
                return 'Navn på tavle'
            case 'url':
                return 'Lenke'
            case 'actions':
                return 'Handlinger'
            case 'lastModified':
                return 'Sist oppdatert'
            default:
                return 'Ukjent kolonne'
        }
    }, [])

    return (
        <>
            {columns.map((column) => (
                <div key={column} className={classes.header}>
                    <div className={classes.title}>{title(column)}</div>
                    <Sort column={column} />
                </div>
            ))}
        </>
    )
}

export { TableHeader }
