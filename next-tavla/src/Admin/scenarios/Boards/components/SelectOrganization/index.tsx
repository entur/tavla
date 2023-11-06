import { Dropdown } from '@entur/dropdown'
import { useOrganizationsDropdown } from '../../hooks/useOrganizationsDropdown'
import { TOrganization } from 'types/settings'

function SelectOrganization({
    organizations,
}: {
    organizations: TOrganization[]
}) {
    const { dropdownItems, selectedOrganization, redirectToOrganization } =
        useOrganizationsDropdown(organizations)
    return (
        <Dropdown
            className="w-30"
            label="Vis tavler for organisasjon"
            items={dropdownItems}
            selectedItem={selectedOrganization}
            onChange={redirectToOrganization}
        />
    )
}
export { SelectOrganization }
