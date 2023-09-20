import { useCallback } from 'react'
import { TBoardsColumn } from '../../utils/reducer'
import classes from './styles.module.css'

function TableHeader({ columns }: { columns: TBoardsColumn[] }) {
    const title = useCallback((column: TBoardsColumn) => {
        switch (column) {
            case 'name':
                return 'Navn på tavle'
            case 'url':
                return 'Lenke'
            case 'actions':
                return 'Valg'
            case 'modified':
                return 'Sist oppdatert'
        }
    }, [])

    return (
        <>
            {columns.map((column) => (
                <div className={classes.title}>{title(column)}</div>
            ))}
        </>
    )
}

export { TableHeader }
