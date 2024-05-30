import Link from 'next/link'
import { Column } from './Column'
import { TOrganization } from 'types/settings'

function Organization({ organization }: { organization: TOrganization }) {
    const orgName =
        organization.name == undefined ? 'Privat' : organization.name

    return (
        <Column column="organization">
            <Link href={`/organizations/${organization.id}`}>{orgName}</Link>
        </Column>
    )
}

export { Organization }
