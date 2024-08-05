import { Dropdown } from '@entur/dropdown'
import { Checkbox } from '@entur/form'
import { Heading3 } from '@entur/typography'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { TOrganization, TOrganizationID } from 'types/settings'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

function Organization({
    setOrg,
    organization,
    setIsError,
}: {
    setOrg: Dispatch<SetStateAction<TOrganizationID | undefined>>
    organization?: TOrganization
    setIsError: Dispatch<SetStateAction<boolean>>
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organization)

    const [personal, setPersonal] = useState(organization ? false : true)
    const [state, setFormError] = useState<TFormFeedback | undefined>()

    useEffect(() => {
        if (!selectedOrganization && !personal) {
            setFormError(getFormFeedbackForError('create/organization-missing'))
            setIsError(true)
            return
        }
        personal ? setOrg(undefined) : setOrg(selectedOrganization?.value.id)
        setFormError(undefined)
        setIsError(false)
    }, [selectedOrganization, personal])

    return (
        <div className="box flex flex-col">
            <Heading3 margin="bottom">Organisasjon</Heading3>
            <Dropdown
                items={organizations}
                label="Dine organisasjoner"
                selectedItem={selectedOrganization}
                onChange={setSelectedOrganization}
                clearable
                className="mb-4"
                aria-required="true"
                disabled={personal}
                {...getFormFeedbackForField('organization', state)}
            />
            <Checkbox
                checked={personal}
                onChange={() => setPersonal(!personal)}
                name="personal"
            >
                Privat tavle
            </Checkbox>
        </div>
    )
}

export { Organization }
