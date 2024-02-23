import { IconButton } from '@entur/button'
import { DeleteIcon, EditIcon } from '@entur/icons'
import { Tooltip } from 'Admin/components/Tooltip'
import Link from 'next/link'
import { TOrganization, TOrganizationID, TUserID } from 'types/settings'
import { Delete as DeleteModal } from 'app/(admin)/components/Delete'

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

function Delete({ oid }: { oid?: TOrganizationID }) {
    return (
        <Tooltip content="Slett organisasjon" placement="bottom">
            <IconButton
                as={Link}
                href={`?delete=${oid}`}
                aria-label="Slett organisasjon"
            >
                <DeleteIcon />
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
                    <DeleteModal organization={organization}>
                        <Delete oid={organization.id} />
                    </DeleteModal>
                </>
            )}
        </div>
    )
}

export { Actions }
