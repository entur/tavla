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
    organizationBoard,
    setNewOrganizationID,
    setIsError,
}: {
    organizationBoard?: TOrganization
    setNewOrganizationID: Dispatch<SetStateAction<TOrganizationID | undefined>>
    setIsError: Dispatch<SetStateAction<boolean>>
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organizationBoard)

    const [personal, setPersonal] = useState(organizationBoard ? false : true)
    const [state, setFormError] = useState<TFormFeedback | undefined>()

    useEffect(() => {
        if (!selectedOrganization && !personal) {
            setFormError(getFormFeedbackForError('create/organization-missing'))
            setIsError(true)
            return
        }
        personal
            ? setNewOrganizationID(undefined)
            : setNewOrganizationID(selectedOrganization?.value.id)
        setFormError(undefined)
        setIsError(false)
    }, [selectedOrganization, personal, setNewOrganizationID, setIsError])

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
