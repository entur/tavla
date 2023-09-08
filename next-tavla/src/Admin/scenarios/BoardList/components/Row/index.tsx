import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { TBoard } from 'types/settings'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import classes from './styles.module.css'
import { useEffect, useState } from 'react'
import { Cell } from 'Admin/scenarios/BoardList/components/Cell'
import { Tooltip } from '@entur/tooltip'
import { Info } from 'Admin/scenarios/Info'

function Row({ board }: { board: TBoard }) {
    const { addToast } = useToast()
    const router = useRouter()
    const [link, setLink] = useState('')

    useEffect(() => {
        setLink(window.location.origin + '/' + board.id)
    }, [board.id])

    async function editBoard() {
        await router.push('/edit/' + board.id)
    }

    function toLocaleString(date: Date) {
        return date
            .toLocaleDateString('no-NB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })
            .replace(',', '')
    }

    return (
        <div className={classes.tableRow}>
            <Cell>{board?.meta?.title ?? 'Tavla'}</Cell>
            <Cell className={classes.link}>
                {link}
                <Tooltip content="Kopier lenke" placement="bottom">
                    <IconButton
                        aria-label="Kopier lenke"
                        onClick={() => {
                            navigator.clipboard.writeText(link)
                            addToast('Lenke til Tavla kopiert')
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </Tooltip>
            </Cell>
            <Cell>
                <Info board={board} />
                <Tooltip content="Rediger tavle" placement="bottom">
                    <IconButton aria-label="Rediger tavle" onClick={editBoard}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Cell>
            <Cell>
                {board?.meta?.dateModified &&
                    toLocaleString(new Date(board.meta.dateModified))}
            </Cell>
            <Cell>
                {board?.meta?.created &&
                    toLocaleString(new Date(board.meta.created))}
            </Cell>
            <Cell>
                {board?.meta?.lastActive &&
                    toLocaleString(new Date(board.meta.lastActive))}
            </Cell>
        </div>
    )
}

export { Row }
