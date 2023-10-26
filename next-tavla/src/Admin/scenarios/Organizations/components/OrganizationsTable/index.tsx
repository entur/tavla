import {
    ORGANIZATIONS_COLUMNS,
    OrganizationsColumns,
} from 'Admin/types/organizations'
import classes from './styles.module.css'
import { TOrganization, TUserID } from 'types/settings'
import { Cell } from '../Cell'
import { LeadParagraph } from '@entur/typography'

function OrganizationsTable({
    organizations,
    userId,
}: {
    organizations: TOrganization[]
    userId: TUserID
}) {
    if (!organizations || organizations.length === 0) {
        return (
            <LeadParagraph>
                Du er ikke medlem av noen organisasjoner.
            </LeadParagraph>
        )
    }

    return (
        <div
            className={classes.organizations}
            style={{
                gridTemplateColumns: `repeat(${ORGANIZATIONS_COLUMNS.length},auto)`,
            }}
        >
            {ORGANIZATIONS_COLUMNS.map((column) => (
                <div key={column} className={classes.header}>
                    {OrganizationsColumns[column]}
                </div>
            ))}
            {organizations.map((organization) =>
                ORGANIZATIONS_COLUMNS.map((column) => (
                    <Cell
                        key={column}
                        column={column}
                        organization={organization}
                        userId={userId}
                    />
                )),
            )}
        </div>
    )
}

export { OrganizationsTable }
