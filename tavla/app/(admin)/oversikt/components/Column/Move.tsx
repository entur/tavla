'use client'
import { useToast } from '@entur/alert'
import { IconButton } from '@entur/button'
import { ForwardIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TBoard } from 'types/settings'
import { useModalWithValue } from '../../hooks/useModalWithValue'
import { Dropdown } from '@entur/dropdown'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { moveBoardAction } from '../../utils/actions'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import { useState } from 'react'

function Move({ board }: { board: TBoard }) {
    const { addToast } = useToast()

    const { isOpen, open, close } = useModalWithValue('flytt', board.id ?? '')
    const [error, setError] = useState<TFormFeedback | undefined>(undefined)

    const submit = async (data: FormData) => {
        const resultingError = await moveBoardAction(data)
        if (resultingError) {
            setError(resultingError)
        } else {
            const toastText = selectedOrganization?.value.id
                ? `Tavlen er flyttet til "${selectedOrganization?.value.name}"!`
                : 'Tavlen er ikke lengre i en mappe!'
            addToast(toastText)
            setError(undefined)
            close()
        }
    }

    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations()

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
                <Paragraph className="mb-8">
                    Velg hvilken mappe tavlen skal ligge i.
                </Paragraph>
                <form action={submit} className="w-full">
                    <Dropdown
                        items={organizations}
                        label="Dine mapper"
                        selectedItem={selectedOrganization}
                        onChange={setSelectedOrganization}
                        aria-required="true"
                        className="mb-4"
                    />
                    <HiddenInput id="bid" value={board.id} />
                    <HiddenInput
                        id="newOid"
                        value={selectedOrganization?.value.id}
                    />
                    <FormError {...getFormFeedbackForField('general', error)} />

                    <div className="flex flex-row mt-8 justify-start">
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
