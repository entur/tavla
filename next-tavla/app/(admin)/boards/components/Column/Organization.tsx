import Link from 'next/link'
import { Column } from './Column'
import { TOrganization } from 'types/settings'

function Organization({ organization }: { organization?: TOrganization }) {
    if (!organization) return <Column column="organization">Privat</Column>

    return (
        <Column column="organization">
            <Link
                href={`/organizations/${organization.id}`}
                className="hidden sm:block hover:underline"
            >
                {organization.name}
            </Link>
            <p className="block sm:hidden">{organization.name}</p>
        </Column>
    )
}

export { Organization }
