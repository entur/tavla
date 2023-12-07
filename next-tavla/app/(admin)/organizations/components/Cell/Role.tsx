import { TOrganization, TUserID } from 'types/settings'

function Role({
    organization,
    userId,
}: {
    organization: TOrganization
    userId: TUserID
}) {
    return (
        <div>{organization.owners?.includes(userId) ? 'Eier' : 'Medlem'}</div>
    )
}

export { Role }
