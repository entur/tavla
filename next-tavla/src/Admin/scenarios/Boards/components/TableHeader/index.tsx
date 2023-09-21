import { useCallback } from 'react'
import classes from './styles.module.css'
import { TBoardsColumn } from 'Admin/types/boards'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    const title = useCallback((column: TBoardsColumn) => {
        switch (column) {
            case 'name':
                return 'Navn på tavle'
            case 'url':
                return 'Lenke'
            case 'actions':
                return 'Handlinger'
            case 'modified':
                return 'Sist oppdatert'
            default:
                return 'Ukjent kolonne'
        }
    }, [])

    return (
        <>
            {columns.map((column) => (
                <div key={column} className={classes.title}>
                    {title(column)}
                </div>
            ))}
        </>
    )
}

export { TableHeader }
