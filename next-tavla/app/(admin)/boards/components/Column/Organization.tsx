import Link from 'next/link'
import { Column } from './Column'
import { TOrganization } from 'types/settings'

function Organization({ organization }: { organization: TOrganization }) {
    const orgName = organization.name ?? 'Privat'

    return (
        <Column column="organization">
            {organization.id ? (
                <Link href={`/organizations/${organization.id}`}>
                    {orgName}
                </Link>
            ) : (
                <p>{orgName}</p>
            )}
        </Column>
    )
}

export { Organization }
