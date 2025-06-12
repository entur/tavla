'use client'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { TFolder } from 'types/settings'
import { SubmitButton } from 'components/Form/SubmitButton'
import {
    getFormFeedbackForError,
    getFormFeedbackForField,
    TFormFeedback,
} from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { deleteFolderAction } from './actions'
import ducks from 'assets/illustrations/Ducks.png'
import Image from 'next/image'
import { Tooltip } from '@entur/tooltip'
import { useToast } from '@entur/alert'
import { useActionState, useState } from 'react'
import { HiddenInput } from 'components/Form/HiddenInput'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { DeleteButton } from 'app/(admin)/oversikt/components/Column/Delete'
import { useModalWithValues } from 'app/(admin)/oversikt/hooks/useModalWithValue'
import { CloseIcon } from '@entur/icons'

function DeleteFolder({
    folder,
    type,
}: {
    folder: TFolder
    type: 'icon' | 'button'
}) {
    const { addToast } = useToast()

    const [state, deleteFolder] = useActionState(deleteFolderAction, undefined)
    const { isOpen, open, close } = useModalWithValues(
        {
            key: 'slett',
            value: 'mappe',
        },
        {
            key: 'id',
            value: folder.id ?? '',
        },
    )

    const [nameError, setNameError] = useState<TFormFeedback>()

    const submit = async (data: FormData) => {
        const name = data.get('name') as string
        if (name !== folder.name)
            return setNameError(getFormFeedbackForError('folder/name-mismatch'))

        deleteFolder(data)
        addToast('Mappe slettet!')
    }

    return (
        <>
            <Tooltip
                content="Slett mappe"
                placement="bottom"
                id="tooltip-delete-folder"
            >
                <DeleteButton text="Slett mappe" type={type} onClick={open} />
            </Tooltip>

            <Modal
                open={isOpen}
                size="small"
                onDismiss={() => {
                    close()
                    setNameError(undefined)
                }}
                closeLabel="Avbryt sletting"
                className="flex flex-col text-center"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => {
                        close()
                        setNameError(undefined)
                    }}
                    className="absolute top-4 right-4"
                >
                    <CloseIcon />
                </IconButton>
                <Image src={ducks} alt="" className="h-1/2 w-1/2 mx-auto" />
                <Heading3 margin="bottom" as="h1">
                    Slett mappe
                </Heading3>
                <Paragraph>
                    {`Er du sikker på at du vil slette mappen 
                    "${folder.name}"? Alle tavlene i mappen vil også bli slettet.`}
                </Paragraph>
                <SubParagraph className="font-medium text-left">
                    Bekreft ved å skrive inn navnet på mappen
                </SubParagraph>
                <form action={submit} aria-live="polite" aria-relevant="all">
                    <HiddenInput id="oname" value={folder.name} />
                    <HiddenInput id="oid" value={folder.id} />

                    <ClientOnlyTextField
                        name="name"
                        label="Mappenavn"
                        type="text"
                        required
                        aria-required
                        {...getFormFeedbackForField('name', nameError)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="flex flex-row mt-8">
                        <SubmitButton
                            variant="primary"
                            aria-label="Ja, slett"
                            className="w-1/2"
                            width="fluid"
                        >
                            Ja, slett
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={() => {
                                close()
                                setNameError(undefined)
                            }}
                            width="fluid"
                            className="w-1/2"
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

export { DeleteFolder }
