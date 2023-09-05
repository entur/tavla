import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import classes from './styles.module.css'
import { useEffect, useState } from 'react'
import { Cell } from 'Admin/scenarios/BoardList/components/Cell'
import { Tags } from 'Admin/scenarios/Tags'
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
            <Cell>{board.settings?.title ?? 'Tavla'}</Cell>
            <Cell className={classes.link}>
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
            </Cell>
            <Cell className={classes.tags}>
                <Tags boardId={board.id} boardTags={board.settings?.tags} />
            </Cell>
            <Cell className={classes.options}>
                <IconButton aria-label="Rediger tavle" onClick={editBoard}>
                    <EditIcon />
                </IconButton>
            </Cell>
        </div>
    )
}

function TableHeader() {
    return (
        <div className={classes.tableHead}>
            <div className={classes.tableRow}>
                <div className={classes.headerCell}>Navn på tavle</div>
                <div className={classes.headerCell}>Link</div>
                <div className={classes.headerCell}>Tags</div>

                <div
                    className={`${classes.headerCell} ${classes.textCenteredCell}`}
                >
                    <div>Valg</div>
                </div>
            </div>
        </div>
    )
}

export { Row, TableHeader }
