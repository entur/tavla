import { CreateOrganization } from './components/CreateOrganization.tsx'
import { OrganizationsList } from './components/OrganizationsList'

function Organizations() {
    return (
        <div>
            <CreateOrganization />
            <OrganizationsList />
        </div>
    )
}
export { Organizations }
