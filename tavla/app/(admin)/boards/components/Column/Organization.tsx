import Link from 'next/link'
import { Column } from './Column'
import { TOrganization } from 'types/settings'
import { DEFAULT_ORGANIZATION_NAME } from 'app/(admin)/utils/constants'

function Organization({ organization }: { organization?: TOrganization }) {
    if (!organization)
        return (
            <Column column="organization">{DEFAULT_ORGANIZATION_NAME}</Column>
        )

    return (
        <Column column="organization">
            <Link
                href={`/folders/${organization.id}`}
                className="hidden sm:block hover:underline"
            >
                {organization.name}
            </Link>
            <p className="block sm:hidden">{organization.name}</p>
        </Column>
    )
}

export { Organization }
