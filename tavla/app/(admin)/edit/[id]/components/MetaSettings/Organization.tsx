'use client'
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown'
import { Checkbox } from '@entur/form'
import { Heading4 } from '@entur/typography'
import { useState, Dispatch, SetStateAction, ReactElement } from 'react'
import { TOrganization } from 'types/settings'

function Organization({
    organization,
    organizations,
    selectedOrganization,
    setSelectedOrganization,
    error,
}: {
    organization?: TOrganization
    organizations: () => NormalizedDropdownItemType<TOrganization>[]
    selectedOrganization: NormalizedDropdownItemType<TOrganization> | null
    setSelectedOrganization: Dispatch<
        SetStateAction<NormalizedDropdownItemType<TOrganization> | null>
    >
    error?: ReactElement
}) {
    const [personal, setPersonal] = useState(organization ? false : true)

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

            <div className="mt-4">{error}</div>
        </div>
    )
}

export { Organization }
