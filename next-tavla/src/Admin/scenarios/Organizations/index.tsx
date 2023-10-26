import { Heading2, LeadParagraph } from '@entur/typography'
import { CreateOrganization } from './components/CreateOrganization'
import { TOrganization, TUserID } from 'types/settings'
import {
    OrganizationsColumns,
    TOrganizationsColumn,
} from 'Admin/types/organizations'
import { Column } from './components/Column'
import classes from './styles.module.css'

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
                        className="grid"
                        style={{
                            gridTemplateColumns: `repeat(${columns.length},auto)`,
                            gridAutoRows: '2.5em',
                            gap: '0.5em 0',
                        }}
                    >
                        {columns.map((column) => (
                            <div key={column} className={classes.header}>
                                {OrganizationsColumns[column]}
                            </div>
                        ))}
                        {organizations.map((organization) =>
                            columns.map((column) => (
                                <Column
                                    key={column}
                                    {...{ column, organization, userId }}
                                />
                            )),
                        )}
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
