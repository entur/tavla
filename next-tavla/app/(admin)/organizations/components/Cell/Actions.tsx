'use client'
import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import Link from 'next/link'
import { TOrganization, TUserID } from 'types/settings'
import { Delete } from 'app/(admin)/components/Delete'
import { Tooltip } from '@entur/tooltip'

function Edit({ oid }: { oid?: string }) {
    return (
        <Tooltip content="Rediger organisasjon" placement="bottom">
            <IconButton
                as={Link}
                aria-label="Rediger organisasjon"
                href={`/organizations/${oid}`}
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
        <div className="flexRow">
            {organization.owners?.includes(userId) && (
                <>
                    <Edit oid={organization.id} />
                    <Delete organization={organization} type="icon" />
                </>
            )}
        </div>
    )
}

export { Actions }
