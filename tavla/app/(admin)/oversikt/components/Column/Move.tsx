'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { Dropdown } from '@entur/dropdown'
import { ForwardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { useFolders } from 'app/(admin)/hooks/useFolders'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useState } from 'react'
import { TBoard } from 'types/settings'
import { useModalWithValues } from '../../hooks/useModalWithValue'
import { moveBoardAction } from '../../utils/actions'

function Move({ board }: { board: TBoard }) {
    const { addToast } = useToast()

    const { isOpen, open, close } = useModalWithValues({
        key: 'flytt',
        value: board.id ?? '',
    })
    const [error, setError] = useState<TFormFeedback | undefined>(undefined)

    const submit = async (data: FormData) => {
        const resultingError = await moveBoardAction(data)
        if (resultingError) {
            setError(resultingError)
        } else {
            const toastText = selectedFolder?.value.id
                ? `Tavlen er flyttet til "${selectedFolder?.value.name}"!`
                : 'Tavlen er ikke lengre i en mappe!'
            addToast(toastText)
            setError(undefined)
            close()
        }
    }

    const { folders, selectedFolder, setSelectedFolder } = useFolders()

    return (
        <>
            <Tooltip
                content="Flytt til en annen mappe"
                placement="bottom"
                id="tooltip-move-board"
            >
                <IconButton
                    aria-label="Flytt til en annen mappe"
                    onClick={open}
                >
                    <ForwardIcon aria-label="Pil-ikon" />
                </IconButton>
            </Tooltip>
            <Modal
                open={isOpen}
                size="medium"
                onDismiss={() => {
                    setError(undefined)
                    close()
                }}
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
                        items={folders}
                        label="Dine mapper"
                        selectedItem={selectedFolder}
                        onChange={setSelectedFolder}
                        aria-required="true"
                        className="mb-4"
                    />
                    <HiddenInput id="bid" value={board.id} />
                    <HiddenInput id="newOid" value={selectedFolder?.value.id} />
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
