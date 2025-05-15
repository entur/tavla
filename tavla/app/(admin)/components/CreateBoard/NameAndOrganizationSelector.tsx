'use client'
import { Paragraph, Label, Heading2 } from '@entur/typography'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState } from 'react'
import { createBoard } from './actions'
import { FormError } from '../FormError'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { TOrganization } from 'types/settings'
import { Dropdown } from '@entur/dropdown'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'

function NameAndOrganizationSelector({ folder }: { folder?: TOrganization }) {
    const [state, action] = useActionState(createBoard, undefined)

    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(folder)

    return (
        <form action={action} className="md:px-10">
            <Heading2 as="h1">Opprett tavle</Heading2>
            <Paragraph className="!mb-4">
                Gi tavlen et navn og legg den til i en mappe. Velger du en mappe
                vil alle i mappen ha tilgang til tavlen.
            </Paragraph>
            <Label>Gi tavlen et navn</Label>
            <ClientOnlyTextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                maxLength={50}
                required
                autoComplete="off"
                {...getFormFeedbackForField('name', state)}
            />

            <div className="mt-4">
                <Label>Legg til i en mappe</Label>
                <Dropdown
                    items={organizations}
                    label="Dine mapper"
                    selectedItem={selectedOrganization}
                    onChange={setSelectedOrganization}
                    aria-required="true"
                    className="mb-4"
                />
                <HiddenInput id="oid" value={selectedOrganization?.value.id} />
            </div>
            <div className="mt-4">
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>

            <div className="flex flex-row mt-8 justify-start">
                <SubmitButton variant="primary" className="max-sm:w-full">
                    Opprett tavle
                </SubmitButton>
            </div>
        </form>
    )
}

export { NameAndOrganizationSelector }
