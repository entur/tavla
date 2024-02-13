'use client'
import { Dropdown } from '@entur/dropdown'
import { Heading4, Paragraph } from '@entur/typography'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { HiddenInput } from 'components/Form/HiddenInput'

function Organization() {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()
    return (
        <div className="">
            <Heading4>Legg tavla til en organisasjon</Heading4>
            <Paragraph>
                Hvis du ikke velger en organisasjon, vil tavla bli lagret under
                din private bruker. Det er kun du som kan administrere tavla som
                opprettes.
            </Paragraph>
            <Dropdown
                items={organizations}
                label="Dine organisasjoner"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
                clearable
            />
            <HiddenInput
                id="organization"
                value={selectedOrganization?.value}
            />
        </div>
    )
}

export { Organization }
