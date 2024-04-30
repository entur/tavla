'use client'
import { TOrganization } from 'types/settings'
import { SideNavigation, SideNavigationItem } from '@entur/menu'
import { Heading1 } from '@entur/typography'

function SelectOrganization({
    organizations,
    active,
}: {
    organizations: TOrganization[] | null
    active?: TOrganization
}) {
    return (
        <SideNavigation className="flex flex-col w-full md:w-1/5 g-6 bg-base-primary">
            <Heading1 className="text-[32px]">Tavler</Heading1>
            <div>
                <SideNavigationItem href="/boards" active={!active?.id}>
                    Mine tavler
                </SideNavigationItem>
                {organizations?.map((organization) => (
                    <SideNavigationItem
                        key={organization.id}
                        href={'/boards/' + organization.id}
                        active={active?.id === organization.id}
                    >
                        {organization.name}
                    </SideNavigationItem>
                ))}
            </div>
        </SideNavigation>
    )
}
export { SelectOrganization }
