import { Heading2 } from '@entur/typography'
import { CreateOrganization } from './components/CreateOrganization'
import { TOrganization, TUserID } from 'types/settings'
import { OrganizationsTable } from './components/OrganizationsTable'

function Organizations(props: {
    organizations: TOrganization[]
    userId: TUserID
}) {
    return (
        <div>
            <CreateOrganization />
            <div className="mt-4">
                <Heading2>Mine organisasjoner</Heading2>
                <OrganizationsTable {...props} />
            </div>
        </div>
    )
}
export { Organizations }
