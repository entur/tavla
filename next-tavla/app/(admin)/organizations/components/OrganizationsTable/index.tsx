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
                description="Hvis man oppretter en organisasjon kan man organisere tavler, laste opp logo og invitere andre."
            />
        )
    }

    return (
        <div
            className="grid auto-rows-[2.5rem] gap-y-1 items-center"
            style={{
                gridTemplateColumns: `repeat(${ORGANIZATIONS_COLUMNS.length},auto)`,
            }}
        >
            {ORGANIZATIONS_COLUMNS.map((column) => (
                <div
                    key={column}
                    className="border-b-primary border-b-2 font-medium"
                >
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
