import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TBoardID, TOrganizationID } from 'types/settings'

function EditBoard({ bid }: { bid?: TBoardID }) {
    return (
        <Tooltip
            content="Rediger tavle"
            placement="bottom"
            id="tooltip-edit-board"
        >
            <IconButton
                as={Link}
                aria-label="Rediger tavle"
                href={`/tavler/${bid}/rediger`}
            >
                <EditIcon aria-label="Rediger-ikon" />
            </IconButton>
        </Tooltip>
    )
}

function EditFolder({ fid }: { fid?: TOrganizationID }) {
    return (
        <Tooltip
            content="Rediger mappe"
            placement="bottom"
            id="tooltip-edit-board"
        >
            <IconButton
                as={Link}
                aria-label="Rediger mappe"
                href={`/mapper/${fid}/rediger`}
            >
                <EditIcon aria-label="Rediger-ikon" />
            </IconButton>
        </Tooltip>
    )
}

export { EditBoard, EditFolder }
