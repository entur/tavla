import { TOrganization, TUserID } from 'types/settings'
import { TOrganizationsColumn } from 'Admin/types/organizations'
import { Column } from '../Column'

function TableRow({
    organization,
    userId,
    columns,
}: {
    organization: TOrganization
    userId: TUserID
    columns: TOrganizationsColumn[]
}) {
    return (
        <>
            {columns.map((column) => (
                <Column key={column} {...{ column, organization, userId }} />
            ))}
        </>
    )
}

export { TableRow }
