'use client'
import { SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TOrganizationID } from 'types/settings'

function DeleteButton({ oid }: { oid?: TOrganizationID }) {
    return (
        <Tooltip content="Slett organisasjon" placement="bottom">
            <SecondaryButton
                as={Link}
                href={`?delete=${oid}`}
                aria-label="Slett organisasjon"
            >
                <DeleteIcon />
                Slett
            </SecondaryButton>
        </Tooltip>
    )
}

export { DeleteButton }
