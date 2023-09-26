import { IconButton } from '@entur/button'
import { CopyIcon, EditIcon, ExternalIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TBoard } from 'types/settings'
import { useLink } from '../../hooks/useLink'
import { useToast } from '@entur/alert'
import classes from './styles.module.css'
import { DeleteBoardButton } from '../Delete'
import { SortableColumn } from './SortableColumn'

function Actions({ board }: { board: TBoard }) {
    const link = useLink(board.id)
    return (
        <SortableColumn className={classes.actions} column="actions">
            <Edit bid={board.id} />
            <Copy link={link} />
            <Open link={link} />
            <Delete board={board} />
        </SortableColumn>
    )
}

function Edit({ bid }: { bid?: string }) {
    return (
        <Tooltip content="Rediger tavle" placement="bottom">
            <IconButton
                as={Link}
                aria-label="Rediger tavle"
                href={`/edit/${bid}`}
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
    )
}

function Copy({ link }: { link?: string }) {
    const { addToast } = useToast()

    return (
        <Tooltip content="Kopier lenke" placement="bottom">
            <IconButton
                aria-label="Kopier lenke"
                onClick={() => {
                    navigator.clipboard.writeText(link ?? '')
                    addToast('Lenke til Tavla kopiert')
                }}
            >
                <CopyIcon />
            </IconButton>
        </Tooltip>
    )
}

function Open({ link }: { link?: string }) {
    return (
        <Tooltip content="Åpne tavle" placement="bottom">
            <IconButton
                as={Link}
                aria-label="Åpne tavle"
                href={link ?? '/'}
                target="_blank"
            >
                <ExternalIcon />
            </IconButton>
        </Tooltip>
    )
}

function Delete({ board }: { board: TBoard }) {
    return (
        <Tooltip content="Slett tavle" placement="bottom">
            <DeleteBoardButton board={board} />
        </Tooltip>
    )
}

export { Actions }
