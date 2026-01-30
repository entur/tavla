'use client'
import { useToast } from '@entur/alert'
import { Button, ButtonGroup, IconButton } from '@entur/button'
import { CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Tooltip } from '@entur/tooltip'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { HiddenInput } from 'app/(admin)/components/Form/HiddenInput'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { DeleteButton } from 'app/(admin)/oversikt/components/Column/Delete'
import {
    getFormFeedbackForError,
    getFormFeedbackForField,
    TFormFeedback,
} from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import ducks from 'assets/illustrations/Ducks.png'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { FolderDB } from 'src/types/db-types/folders'
import { FormError } from '../FormError'
import { deleteFolderAction } from './actions'

function DeleteFolder({
    folder,
    type,
}: {
    folder: FolderDB
    type: 'icon' | 'button'
}) {
    const { addToast } = useToast()
    const posthog = usePosthogTracking()

    const [state, deleteFolder] = useActionState(deleteFolderAction, undefined)
    const [isOpen, setIsOpen] = useState(false)

    const [nameError, setNameError] = useState<TFormFeedback>()

    const submit = async (data: FormData) => {
        const name = data.get('name') as string
        if (name !== folder.name)
            return setNameError(getFormFeedbackForError('folder/name-mismatch'))

        deleteFolder(data)
        addToast('Mappe slettet!')
    }

    const ariaLabel = folder.name ? `Slett mappe ${folder.name}` : 'Slett mappe'

    return (
        <>
            <Tooltip
                content="Slett mappe"
                placement="bottom"
                id="tooltip-delete-folder"
            >
                <DeleteButton
                    text="Slett mappe"
                    ariaLabel={ariaLabel}
                    type={type}
                    onClick={() => {
                        posthog.capture('folder_delete_started', {
                            location: 'folder',
                            folder_id: folder.id,
                        })
                        setIsOpen(true)
                    }}
                />
            </Tooltip>

            <Modal
                open={isOpen}
                size="small"
                onDismiss={() => {
                    posthog.capture('folder_delete_cancelled', {
                        location: 'folder',
                        folder_id: folder.id,
                        method: 'dismissed',
                    })

                    setIsOpen(false)
                    setNameError(undefined)
                }}
                closeLabel="Avbryt sletting"
                className="flex flex-col text-center"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => {
                        posthog.capture('folder_delete_cancelled', {
                            location: 'folder',
                            folder_id: folder.id,
                            method: 'close_icon',
                        })
                        setIsOpen(false)
                        setNameError(undefined)
                    }}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <Image src={ducks} alt="" className="mx-auto h-1/2 w-1/2" />
                <Heading3 margin="bottom" as="h1">
                    Slett mappe
                </Heading3>
                <Paragraph>
                    {`Er du sikker på at du vil slette mappen 
                    "${folder.name}"? Alle tavlene i mappen vil også bli slettet.`}
                </Paragraph>
                <SubParagraph className="text-left font-medium">
                    Bekreft ved å skrive inn navnet på mappen. Feltet er
                    påkrevd.
                </SubParagraph>
                <form action={submit} aria-live="polite" aria-relevant="all">
                    <HiddenInput id="oname" value={folder.name} />
                    <HiddenInput id="folderid" value={folder.id} />

                    <ClientOnlyTextField
                        name="name"
                        label="Mappenavn"
                        type="text"
                        required
                        aria-required
                        {...getFormFeedbackForField('name', nameError)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="mt-8 flex flex-row">
                        <SubmitButton
                            variant="primary"
                            aria-label="Ja, slett"
                            className="w-1/2"
                            width="fluid"
                            onClick={() => {
                                posthog.capture('folder_deleted', {
                                    location: 'folder',
                                    folder_id: folder.id,
                                })
                            }}
                        >
                            Ja, slett
                        </SubmitButton>
                        <Button
                            type="button"
                            variant="secondary"
                            aria-label="Avbryt sletting"
                            onClick={() => {
                                posthog.capture('folder_delete_cancelled', {
                                    location: 'folder',
                                    folder_id: folder.id,
                                    method: 'cancelled',
                                })
                                setIsOpen(false)
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
