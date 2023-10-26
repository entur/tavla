import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import Link from 'next/link'
import { TOrganization, TUserID } from 'types/settings'
import { Cell } from './Cell'

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
        <Cell>
            {organization.owners?.includes(userId) && (
                <Edit oid={organization.id} />
            )}
        </Cell>
    )
}

export { Actions }
