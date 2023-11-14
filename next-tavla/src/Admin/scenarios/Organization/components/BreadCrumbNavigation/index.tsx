'use client'
import { BreadcrumbItem, BreadcrumbNavigation } from '@entur/menu'
import { TOrganization } from 'types/settings'

function BreadCrumbNavigation({
    organization,
}: {
    organization: TOrganization
}) {
    return (
        <BreadcrumbNavigation>
            <BreadcrumbItem href="/organizations">
                Organisasjoner
            </BreadcrumbItem>
            <BreadcrumbItem href={`/organizations/${organization.id}`}>
                {organization.name}
            </BreadcrumbItem>
        </BreadcrumbNavigation>
    )
}

export { BreadCrumbNavigation }
