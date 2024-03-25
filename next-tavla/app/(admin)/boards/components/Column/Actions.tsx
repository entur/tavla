import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TBoard } from 'types/settings'
import { useLink } from '../../../../../src/Shared/hooks/useLink'
import classes from './styles.module.css'
import { Column } from './Column'
import { Delete } from './Delete'
import {
    CopyButton,
    OpenButton,
} from 'app/(admin)/edit/[id]/components/Buttons'

function Actions({ board }: { board: TBoard }) {
    const link = useLink(board.id)
    return (
        <Column column="actions">
            <div className={classes.actions}>
                <Edit bid={board.id} />
                <Copy link={link} />
                <Open link={link} />
                <Delete board={board} />
            </div>
        </Column>
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

function Copy({ link, type }: { link?: string; type?: 'button' | 'icon' }) {
    return (
        <Tooltip content="Kopier lenke" placement="bottom">
            <CopyButton link={link} type={type} />
        </Tooltip>
    )
}

function Open({ link, type }: { link?: string; type?: 'button' | 'icon' }) {
    return (
        <Tooltip content="Åpne tavle" placement="bottom">
            <OpenButton link={link} type={type} />
        </Tooltip>
    )
}

export { Actions, Open, Copy }
