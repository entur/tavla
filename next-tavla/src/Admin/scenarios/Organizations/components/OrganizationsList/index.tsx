import { Heading2, LeadParagraph } from '@entur/typography'
import { useUserOrganizations } from '../../utils/context'
import { OrganizationsListElement } from './OrganizationsListElement'

function OrganizationsList() {
    const { userId, organizations } = useUserOrganizations()

    return (
        <div className="mt-4">
            <Heading2>Mine organisasjoner</Heading2>

            {organizations.length > 0 ? (
                organizations.map((organization) => (
                    <OrganizationsListElement
                        organization={organization}
                        userId={userId}
                        key={organization.id}
                    />
                ))
            ) : (
                <LeadParagraph>
                    Det ser ikke ut til at du er med i noen organisasjoner enda.
                </LeadParagraph>
            )}
        </div>
    )
}

export { OrganizationsList }
