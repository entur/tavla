import classes from './styles.module.css'
import { TOrganization, TUserID } from 'types/settings'
import { Cell } from '../Cell'
import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'
import { ORGANIZATIONS_COLUMNS, OrganizationsColumns } from './types'

function OrganizationsTable({
    organizations,
    userId,
}: {
    organizations: TOrganization[]
    userId: TUserID
}) {
    if (!organizations || organizations.length === 0) {
        return (
            <IllustratedInfo
                title="Her var det tomt"
                description="Du må opprette en organisasjon for å kunne organisere tavlene og jobbe med flere."
            />
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
