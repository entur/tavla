'use client'
import { IconButton } from '@entur/button'
import { EditIcon } from '@entur/icons'
import Link from 'next/link'
import { TOrganization, TUserID } from 'types/settings'
import { Delete } from 'app/(admin)/components/Delete'
import { Tooltip } from '@entur/tooltip'
import ClientOnlyComponent from 'app/components/NoSSR/ClientOnlyComponent'

function Edit({ oid }: { oid?: string }) {
    return (
        <ClientOnlyComponent>
            <Tooltip content="Rediger organisasjon" placement="bottom">
                <IconButton
                    as={Link}
                    aria-label="Rediger organisasjon"
                    href={`/organizations/${oid}`}
                    size="small"
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
        </ClientOnlyComponent>
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
                    <Delete organization={organization} type="icon" />
                </>
            )}
        </div>
    )
}

export { Actions }
