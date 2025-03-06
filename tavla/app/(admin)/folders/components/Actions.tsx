'use client'
import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import Link from 'next/link'
import { TOrganization, TUserID } from 'types/settings'
import { DeleteOrganization } from 'app/(admin)/components/DeleteOrganization'
import { Tooltip } from '@entur/tooltip'

function Edit({ oid }: { oid?: string }) {
    return (
        <Tooltip
            content="Rediger mappe"
            placement="bottom"
            id="tooltip-edit-org"
        >
            <IconButton
                as={Link}
                aria-label="Rediger mappe"
                href={`/folders/${oid}`}
            >
                <EditIcon />
            </IconButton>
        </Tooltip>
    )
}

function Actions({
    organization,
    userId,
}: {
    organization: TOrganization
    userId: TUserID
}) {
    return (
        <div className="flex flex-row gap-2">
            {organization.owners?.includes(userId) && (
                <>
                    <Edit oid={organization.id} />
                    <DeleteOrganization
                        organization={organization}
                        type="icon"
                    />
                </>
            )}
        </div>
    )
}

export { Actions }
