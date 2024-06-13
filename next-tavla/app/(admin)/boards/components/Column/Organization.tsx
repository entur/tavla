import Link from 'next/link'
import { Column } from './Column'
import { TOrganization } from 'types/settings'

function Organization({ organization }: { organization?: TOrganization }) {
    if (!organization) return <p>Privat</p>

    return (
        <Column column="organization">
            <Link
                href={`/organizations/${organization.id}`}
                className="hover:underline"
            >
                {organization.name}
            </Link>
        </Column>
    )
}

export { Organization }
