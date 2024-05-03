import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TBoard } from 'types/settings'
import { Column } from './Column'
import { Delete } from './Delete'
import { Open } from 'app/(admin)/edit/[id]/components/Buttons/Open'
import { Copy } from 'app/(admin)/edit/[id]/components/Buttons/Copy'

function Actions({ board }: { board: TBoard }) {
    return (
        <Column column="actions">
            <div className="flex flex-row gap-1">
                <Edit bid={board.id} />
                <Copy bid={board.id} />
                <Open bid={board.id} />
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
