import { Dropdown } from '@entur/dropdown'
import { TextField, Checkbox } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { Heading3, Paragraph, Label } from '@entur/typography'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState } from 'react'
import { TOrganizationID, TBoard } from 'types/settings'
import { create } from './actions'

function NameAndOrganizationSelector({
    formState,
    setFormError,
}: {
    formState: TFormFeedback | undefined
    setFormError: (feedback: TFormFeedback | undefined) => void
}) {
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

    const [personal, setPersonal] = useState<boolean>(false)

    return (
        <form
            action={async (data: FormData) => {
                const name = data.get('name') as string
                if (!name) {
                    return setFormError(
                        getFormFeedbackForError('board/name-missing'),
                    )
                }

                const organization = data.get('organization') as TOrganizationID
                const personal = data.get('personal')
                if (!organization && !personal) {
                    return setFormError(
                        getFormFeedbackForError('create/organization-missing'),
                    )
                }

                const board = {
                    tiles: [],
                    meta: {
                        title: name.substring(0, 50),
                    },
                } as TBoard

                await create(board, organization)
                setFormError(undefined)
            }}
            className="md:px-10"
        >
            <Heading3>Velg navn og organisasjon for tavlen</Heading3>
            <Paragraph className="!mb-4">
                Gi tavlen et navn og legg den til i en organisasjon. Velger du
                en organisasjon vil alle i organisasjonen ha tilgang til tavlen.
            </Paragraph>
            <Label>Gi tavlen et navn</Label>
            <TextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                maxLength={50}
                required
                {...getFormFeedbackForField('name', formState)}
            />

            <div className="mt-4">
                <Label>Legg til i en organisasjon</Label>
                <Dropdown
                    items={organizations}
                    label="Dine organisasjoner"
                    selectedItem={personal ? null : selectedOrganization}
                    onChange={setSelectedOrganization}
                    clearable
                    aria-required="true"
                    className="mb-4"
                    disabled={personal || organizations().length == 0}
                    {...getFormFeedbackForField('organization', formState)}
                />
                <Checkbox
                    checked={personal || organizations().length == 0}
                    onChange={() => {
                        setPersonal(!personal)
                        setFormError(undefined)
                    }}
                    name="personal"
                >
                    Privat tavle
                </Checkbox>
                <HiddenInput
                    id="organization"
                    value={selectedOrganization?.value.id}
                />
            </div>

            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton variant="primary" className="max-sm:w-full">
                    Opprett tavle
                    <AddIcon />
                </SubmitButton>
            </div>
        </form>
    )
}

export { NameAndOrganizationSelector }
