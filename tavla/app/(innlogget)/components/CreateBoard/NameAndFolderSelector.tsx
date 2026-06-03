'use client'
import { Button, ButtonGroup } from '@entur/button'
import { Dropdown, type NormalizedDropdownItemType } from '@entur/dropdown'
import { Heading2, Label, Paragraph } from '@entur/typography'
import { FormError } from 'app/_components/Form/FormError'
import { HiddenInput } from 'app/_components/Form/HiddenInput'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import ClientOnlyTextField from 'app/_components/NoSSR/TextField'
import { useFolderDropdown } from 'app/(innlogget)/hooks/useFolders'
import { getFormFeedbackForField } from 'app/(innlogget)/utils/forms'
import type { Folder } from 'app/(innlogget)/utils/types'
import { FeatureFlags } from 'app/posthog/featureFlags'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import rabbits from 'assets/illustrations/Rabbits.png'
import { isNull } from 'lodash'
import Image from 'next/image'
import { useFeatureFlagEnabled } from 'posthog-js/react'
import { useActionState, useState } from 'react'
import type { FolderDB } from 'src/types/db-types/folders'
import { createBoardAction } from './actions'

type NameAndFolderSelectorProps = {
    folder?: FolderDB
    folders?: Folder[]
    onClose: () => void
}
const DEFAULT_ARRIVAL_DEPARTURE: NormalizedDropdownItemType<boolean> = {
    value: false,
    label: 'Avganger',
}
const arrivalDepartureItems: NormalizedDropdownItemType<boolean>[] = [
    DEFAULT_ARRIVAL_DEPARTURE,
    { value: true, label: 'Ankomster' },
]

function NameAndFolderSelector({
    folder,
    folders,
    onClose,
}: NameAndFolderSelectorProps) {
    const [state, action] = useActionState(createBoardAction, undefined)
    const posthog = usePosthogTracking()
    const isArrivalDepartureFeatureFlagEnabled = useFeatureFlagEnabled(
        FeatureFlags.ARRIVAL_DEPARTURE_BOARD,
    )

    const [selectedArrivalDeparture, setSelectedArrivalDeparture] = useState<
        NormalizedDropdownItemType<boolean>
    >(DEFAULT_ARRIVAL_DEPARTURE)

    const { folderDropdownList, selectedFolder, handleFolderChange } =
        useFolderDropdown(folder, folders)

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
            {isArrivalDepartureFeatureFlagEnabled && (
                <div className="mt-4">
                    <Label>Hva vil du vise?</Label>
                    <Dropdown
                        items={arrivalDepartureItems}
                        label="Hva vil du vise"
                        selectedItem={selectedArrivalDeparture}
                        onChange={(item) => {
                            if (item) setSelectedArrivalDeparture(item)
                        }}
                        className="mb-4"
                    />
                    <HiddenInput
                        id="isArrivals"
                        value={String(selectedArrivalDeparture.value)}
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
