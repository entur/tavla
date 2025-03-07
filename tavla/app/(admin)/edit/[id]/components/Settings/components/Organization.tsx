'use client'
import { Dropdown } from '@entur/dropdown'
import { Checkbox } from '@entur/form'
import { Heading4 } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { TFormFeedback } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useState } from 'react'
import { TOrganization } from 'types/settings'

function Organization({
    organization,
    feedback,
}: {
    organization?: TOrganization
    feedback?: TFormFeedback
}) {
    const [personal, setPersonal] = useState(organization ? false : true)
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
                clearable
                className="mb-4"
                aria-required="true"
                disabled={personal}
            />

            <Checkbox
                defaultChecked={personal}
                onChange={() => setPersonal(!personal)}
                name="personal"
            >
                Privat tavle
            </Checkbox>
            <HiddenInput id="fromOrg" value={organization?.id ?? ''} />
            <HiddenInput id="toOrg" value={selectedOrganization?.value.id} />
            <div className="mt-4">
                <FormError {...feedback} />
            </div>
        </div>
    )
}

export { Organization }
