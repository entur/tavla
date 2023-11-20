import { TOrganization, TOrganizationID } from 'types/settings'
import { SideNavigation, SideNavigationItem } from '@entur/menu'
import classes from './styles.module.css'
import { Heading1 } from '@entur/typography'

function SelectOrganization({
    organizations,
    activeId,
}: {
    organizations: TOrganization[]
    activeId?: TOrganizationID
}) {
    return (
        <SideNavigation className={classes.sideNav}>
            <Heading1 className="text-rem-4">Tavler</Heading1>
            <div>
                <SideNavigationItem
                    href="/boards"
                    active={activeId === undefined}
                >
                    Mine Tavler
                </SideNavigationItem>
                {organizations.map((organization) => (
                    <SideNavigationItem
                        key={organization.id}
                        href={'/boards/' + organization.id}
                        active={activeId === organization.id}
                    >
                        {organization.name}
                    </SideNavigationItem>
                ))}
            </div>
        </SideNavigation>
    )
}
export { SelectOrganization }
