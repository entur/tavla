import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TBoard } from 'types/settings'
import classes from './styles.module.css'
import { Column } from './Column'
import { Delete } from './Delete'
import {
    CopyButton,
    OpenButton,
} from 'app/(admin)/edit/[id]/components/Buttons'

function Actions({ board }: { board: TBoard }) {
    return (
        <Column column="actions">
            <div className={classes.actions}>
                <Edit bid={board.id} />
                <CopyButton bid={board.id} />
                <OpenButton bid={board.id} />
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

export { Actions }
