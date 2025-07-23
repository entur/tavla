'use client'
import { Dropdown } from '@entur/dropdown'
import { Heading2, Label, Paragraph } from '@entur/typography'
import { useFolders } from 'app/(admin)/hooks/useFolders'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState } from 'react'
import { TFolder } from 'types/settings'
import { FormError } from '../FormError'
import { createBoard } from './actions'

function NameAndFolderSelector({ folder }: { folder?: TFolder }) {
    const [state, action] = useActionState(createBoard, undefined)

    const { folders, selectedFolder, setSelectedFolder } = useFolders(folder)

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
                    items={folders}
                    label="Dine mapper"
                    selectedItem={selectedFolder}
                    onChange={setSelectedFolder}
                    aria-required="true"
                    className="mb-4"
                />
                <HiddenInput id="oid" value={selectedFolder?.value.id} />
            </div>
            <div className="mt-4">
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>

            <div className="mt-8 flex flex-row justify-start">
                <SubmitButton variant="primary" className="max-sm:w-full">
                    Opprett tavle
                </SubmitButton>
            </div>
        </form>
    )
}

export { NameAndFolderSelector }
