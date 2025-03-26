'use client'
import { Dropdown } from '@entur/dropdown'
import { Heading4 } from '@entur/typography'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TOrganization } from 'types/settings'

function Organization({ organization }: { organization?: TOrganization }) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organization)

    return (
        <div>
            <Heading4 margin="bottom">Mappe</Heading4>
            <Dropdown
                items={organizations}
                label="Dine mapper"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
                aria-required="true"
                className="mb-4"
            />
            <HiddenInput id="oldOid" value={organization?.id} />
            <HiddenInput
                id="newOid"
                value={selectedOrganization?.value.id}
            />{' '}
        </div>
    )
}

export { Organization }
