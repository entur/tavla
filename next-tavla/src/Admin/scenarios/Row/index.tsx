import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import classes from './styles.module.css'
import { useEffect, useState } from 'react'
import { Board } from 'types/board'

function Row({ board }: { board: Board }) {
    const { addToast } = useToast()
    const router = useRouter()
    const [link, setLink] = useState('')

    useEffect(() => {
        setLink(window.location.origin + '/' + board.id)
    }, [board.id])

    async function editBoard() {
        await router.push('/edit/' + board.id)
    }

    return (
        <div className={classes.tableRow}>
            <div className={classes.dataCell}>
                {board.settings?.title ?? 'Tavla'}
            </div>
            <div className={classes.dataCell}>
                <div className={classes.link}>
                    {link}
                    <IconButton
                        aria-label="Kopier lenke"
                        onClick={() => {
                            navigator.clipboard.writeText(link)
                            addToast('Lenke til Tavla kopiert')
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </div>
            </div>
            <div className={`${classes.dataCell} ${classes.options}`}>
                <IconButton aria-label="Rediger tavle" onClick={editBoard}>
                    <EditIcon />
                </IconButton>
            </div>
            <div className={classes.dataCell}></div>
        </div>
    )
}

export { Row }
