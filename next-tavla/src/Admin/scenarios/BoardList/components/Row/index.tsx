import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { TSettings } from 'types/settings'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import classes from './styles.module.css'
import { useEffect, useState } from 'react'
import { Cell } from 'Admin/scenarios/BoardList/components/Cell'

function Row({ board }: { board: { id: string; settings?: TSettings } }) {
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
            <Cell>
                <IconButton aria-label="Rediger tavle" onClick={editBoard}>
                    <EditIcon />
                </IconButton>
            </Cell>
        </div>
    )
}

export { Row }
