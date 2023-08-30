import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon } from '@entur/icons'
import { TSettings } from 'types/settings'
import { useToast } from '@entur/alert'
import { useRouter } from 'next/router'
import classes from './styles.module.css'

function Row({
    board,
}: {
    board: { id: string; settings: TSettings | undefined }
}) {
    const link = `https://lite-tavla.web.app/${board.id}`
    const { addToast } = useToast()
    const router = useRouter()

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
                        aira-label="Kopier lenke"
                        onClick={() => {
                            navigator.clipboard.writeText(link)
                            addToast('Lenke til Tavla kopiert')
                        }}
                    >
                        <CopyIcon />
                    </IconButton>
                </div>
            </div>
            <div className={classes.dataCell}>
                <IconButton aira-label="Rediger tavle" onClick={editBoard}>
                    <EditIcon />
                </IconButton>
            </div>
        </div>
    )
}

export { Row }
