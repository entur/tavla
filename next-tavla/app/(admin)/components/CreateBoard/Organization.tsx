'use client'

import { Dropdown } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import { useOrganizations } from 'Admin/scenarios/CreateBoard/hooks/useOrganizations'

function Organization() {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()
    return (
        <div className="w-100">
            <Heading4>Legg tavla til en organisasjon</Heading4>
            <Paragraph margin="none">
                Hvis du ikke velger en organisasjon, vil tavla bli lagret under
                din private bruker. Det er kun du som kan administrere tavla som
                opprettes.
            </Paragraph>
            <Dropdown
                className="mb-4"
                items={organizations}
                label="Dine organisasjoner"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
                clearable
            />
        </div>
    )
}

export { Organization }
