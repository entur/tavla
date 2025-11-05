'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { Dropdown } from '@entur/dropdown'
import { ForwardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { useFolderDropdown } from 'app/(admin)/hooks/useFolders'
import { moveBoardAction } from 'app/(admin)/oversikt/utils/actions'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState } from 'react'
import { BoardDB } from 'types/db-types/boards'

function Move({ board }: { board: BoardDB }) {
    const { addToast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [error, setError] = useState<TFormFeedback | undefined>(undefined)

    const submit = async (data: FormData) => {
        const resultingError = await moveBoardAction(data)
        if (resultingError) {
            setError(resultingError)
        } else {
            const toastText =
                selectedFolder?.value && selectedFolder?.value.id
                    ? `Tavlen er flyttet til "${selectedFolder?.value.name}"!`
                    : 'Tavlen er ikke lengre i en mappe!'
            addToast(toastText)
            setError(undefined)
            setIsOpen(false)
        }
    }

    const { folderDropdownList, selectedFolder, handleFolderChange } =
        useFolderDropdown()

    return (
        <>
            <Tooltip
                content="Flytt til en annen mappe"
                placement="bottom"
                id="tooltip-move-board"
            >
                <IconButton
                    aria-label="Flytt til en annen mappe"
                    onClick={() => setIsOpen(true)}
                >
                    <ForwardIcon aria-label="Pil-ikon" />
                </IconButton>
            </Tooltip>
            <Modal
                open={isOpen}
                size="medium"
                onDismiss={() => {
                    setError(undefined)
                    setIsOpen(false)
                }}
                style={{ overflow: 'visible' }}
                closeLabel="Avbryt sletting"
            >
                <Heading3 margin="bottom" as="h1">
                    Flytt tavlen &quot;{board.meta.title}&quot;
                </Heading3>
                <Paragraph className="mb-5">
                    Velg hvilken mappe du vil flytte tavlen til. Vær oppmerksom
                    på at når du flytter en tavle vil tilgangene endres basert
                    på hvem som har tilgang til mappen.
                </Paragraph>
                <form action={submit} className="w-full">
                    <Dropdown
                        items={folderDropdownList}
                        label="Dine mapper"
                        selectedItem={selectedFolder}
                        onChange={handleFolderChange}
                        aria-required="true"
                        className="mb-4"
                    />
                    <HiddenInput id="bid" value={board.id} />
                    <HiddenInput
                        id="newOid"
                        value={selectedFolder?.value?.id}
                    />
                    <FormError {...getFormFeedbackForField('general', error)} />

                    <div className="mt-8 flex flex-row justify-start">
                        <SubmitButton
                            variant="primary"
                            className="max-sm:w-full"
                        >
                            Flytt tavlen
                        </SubmitButton>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export { Move }
