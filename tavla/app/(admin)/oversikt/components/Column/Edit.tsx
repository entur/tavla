import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { BoardDB } from 'src/types/db-types/boards'
import { FolderDB } from 'src/types/db-types/folders'

function EditBoard({ board }: { board?: BoardDB }) {
    const ariaLabel = board?.meta?.title
        ? `Rediger tavle ${board.meta.title}`
        : 'Rediger tavle'
    return (
        <Tooltip
            content="Rediger tavle"
            placement="bottom"
            id="tooltip-edit-board"
        >
            <IconButton
                as={Link}
                aria-label={ariaLabel}
                href={`/tavler/${board?.id}/rediger`}
            >
                <EditIcon aria-label="Rediger-ikon" />
            </IconButton>
        </Tooltip>
    )
}

function EditFolder({ fid, name }: { fid?: FolderDB['id']; name?: string }) {
    const ariaLabel = name ? `Rediger mappe ${name}` : 'Rediger mappe'
    return (
        <Tooltip
            content="Rediger mappe"
            placement="bottom"
            id="tooltip-edit-board"
        >
            <IconButton
                as={Link}
                aria-label={ariaLabel}
                href={`/mapper/${fid}`}
            >
                <EditIcon aria-label="Rediger-ikon" />
            </IconButton>
        </Tooltip>
    )
}

export { EditBoard, EditFolder }
