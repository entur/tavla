import { Heading2, LeadParagraph } from '@entur/typography'
import { CreateOrganization } from './components/CreateOrganization'
import { TOrganization, TUserID } from 'types/settings'
import { TableHeader } from './components/TableHeader/index'
import { TableRow } from './components/TableRow/index'
import {
    OrganizationsColumns,
    TOrganizationsColumn,
} from 'Admin/types/organizations'

function Organizations({
    organizations,
    userId,
}: {
    organizations: TOrganization[]
    userId: TUserID
}) {
    const columns = Object.keys(OrganizationsColumns) as TOrganizationsColumn[]

    return (
        <div>
            <CreateOrganization />
            <div className="mt-4">
                <Heading2>Mine organisasjoner</Heading2>

                {organizations.length > 0 ? (
                    <div
                        className="grid w-30"
                        style={{
                            gridTemplateColumns: `repeat(${columns.length},auto)`,
                        }}
                    >
                        <TableHeader columns={columns} />
                        {organizations.map((organization) => (
                            <TableRow
                                organization={organization}
                                userId={userId}
                                key={organization.id}
                                columns={columns}
                            />
                        ))}
                    </div>
                ) : (
                    <LeadParagraph>
                        Det ser ikke ut til at du er med i noen organisasjoner
                        enda.
                    </LeadParagraph>
                )}
            </div>
        </div>
    )
}
export { Organizations }
