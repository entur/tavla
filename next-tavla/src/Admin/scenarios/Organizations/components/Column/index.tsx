import { TOrganizationsColumn } from 'Admin/types/organizations'
import { TOrganization, TUserID } from 'types/settings'
import { Name } from './Name'
import { Actions } from './Actions'
import { Role } from './Role'

function Column({
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
            return <Name name={organization.name ?? ''} />
        case 'actions':
            return <Actions {...{ organization, userId }} />
        case 'role':
            return <Role {...{ organization, userId }} />
        default:
            return <div>Ukjent kolonne</div>
    }
}

export { Column }
