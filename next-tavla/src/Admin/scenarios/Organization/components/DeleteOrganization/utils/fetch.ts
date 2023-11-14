import { TavlaError } from 'Admin/types/error'
import { TOrganizationID } from 'types/settings'

export async function fetchDeleteOrganization(oid: TOrganizationID) {
    const response = await fetch('/api/organization', {
        method: 'DELETE',
        body: JSON.stringify({ oid: oid }),
    })

    if (!response.ok) {
        throw new TavlaError({
            code: 'ORGANIZATION',
            message: 'Could not delete organization',
        })
    }
}
