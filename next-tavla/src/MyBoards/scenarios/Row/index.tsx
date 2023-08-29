import { TableRow, DataCell } from '@entur/table'
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
        <TableRow>
            <DataCell>{board.settings?.title ?? 'Tavla'}</DataCell>
            <DataCell>
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
            </DataCell>
            <DataCell>
                <div className={classes.iconButtons}>
                    <IconButton aira-label="Rediger tavle" onClick={editBoard}>
                        <EditIcon />
                    </IconButton>
                </div>
            </DataCell>
        </TableRow>
    )
}

export { Row }
