import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from 'Admin/components/Tooltip'
import { Delete } from 'app/(admin)/components/Delete'
import Link from 'next/link'
import { TOrganization, TUserID } from 'types/settings'

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
                    <Delete organization={organization} />
                </>
            )}
        </div>
    )
}

export { Actions }
