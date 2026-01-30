'use client'
import { Button, ButtonGroup } from '@entur/button'
import { Dropdown } from '@entur/dropdown'
import { Heading2, Label, Paragraph } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { useFolderDropdown } from 'app/(admin)/hooks/useFolders'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import rabbits from 'assets/illustrations/Rabbits.png'
import { isNull } from 'lodash'
import Image from 'next/image'
import { useActionState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { FormError } from '../FormError'
import { createBoard } from './actions'

type NameAndFolderSelectorProps = {
    folder?: FolderDB
    onClose: () => void
}

function NameAndFolderSelector({
    folder,
    onClose,
}: NameAndFolderSelectorProps) {
    const [state, action] = useActionState(createBoard, undefined)
    const posthog = usePosthogTracking()

    const { folderDropdownList, selectedFolder, handleFolderChange } =
        useFolderDropdown(folder)

    return (
        <form action={action}>
            <div className="flex flex-col items-center">
                <Image
                    src={rabbits}
                    alt="Illustrasjon av to kaniner på en holdeplass"
                    className="h-1/2 w-1/2"
                />

                <Heading2 as="h1">Opprett tavle</Heading2>
                <Paragraph className="mb-4 text-center">
                    Gi tavlen et navn og legg den til i en mappe. Velger du en
                    mappe vil alle i mappen ha tilgang til tavlen.
                </Paragraph>
            </div>
            <Label>Gi tavlen et navn. Feltet er påkrevd.</Label>
            <ClientOnlyTextField
                size="medium"
                label="Navn"
                id="name"
                name="name"
                maxLength={50}
                required
                aria-required
                autoComplete="off"
                {...getFormFeedbackForField('name', state)}
            />
            {folderDropdownList.length > 1 && (
                <div className="mt-4">
                    <Label>Legg til i en mappe</Label>
                    <Dropdown
                        items={folderDropdownList}
                        label="Dine mapper"
                        selectedItem={selectedFolder}
                        onChange={handleFolderChange}
                        aria-required="true"
                        className="mb-4"
                    />
                    <HiddenInput
                        id="folderid"
                        value={selectedFolder?.value?.id}
                    />
                </div>
            )}

            <div className="mt-4">
                <FormError {...getFormFeedbackForField('general', state)} />
            </div>

            <ButtonGroup className="mt-8 flex w-full flex-row gap-4">
                <SubmitButton
                    variant="primary"
                    width="fluid"
                    onClick={() => {
                        posthog.capture('board_created', {
                            folder_selected: !isNull(selectedFolder.value),
                        })
                    }}
                    aria-label="Opprett tavle"
                    className="!mr-0"
                >
                    Opprett tavle
                </SubmitButton>
                <Button
                    type="button"
                    width="fluid"
                    variant="secondary"
                    aria-label="Avbryt opprett tavle"
                    onClick={onClose}
                    className="!mr-0"
                >
                    Avbryt
                </Button>
            </ButtonGroup>
        </form>
    )
}

export { NameAndFolderSelector }
