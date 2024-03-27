import { TOrganization, TUserID } from 'types/settings'
import { Actions } from './Actions'
import { Role } from './Role'
import { TOrganizationsColumn } from '../OrganizationsTable/types'

function Cell({
    column,
    organization,
    userId,
}: {
    column: TOrganizationsColumn
    organization: TOrganization
    userId: TUserID
}) {
    switch (column) {
        case 'name':
            return <div>{organization.name ?? ''}</div>
        case 'actions':
            return <Actions organization={organization} userId={userId} />
        case 'role':
            return <Role organization={organization} userId={userId} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Cell }
