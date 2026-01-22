'use client'
import { Button, ButtonGroup, IconButton, SecondaryButton } from '@entur/button'
import { CloseIcon, FolderIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading2, Label, Paragraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import birds from 'assets/illustrations/Birds.png'
import { SubmitButton } from 'components/Form/SubmitButton'
import Image from 'next/image'
import { useActionState, useState } from 'react'
import { createFolder } from './actions'

function CreateFolder() {
    const [isOpen, setIsOpen] = useState(false)
    const [state, formAction] = useActionState(createFolder, undefined)

    return (
        <>
            <SecondaryButton onClick={() => setIsOpen(true)}>
                Opprett mappe
                <FolderIcon aria-label="Mappe-ikon" />
            </SecondaryButton>
            <Modal
                className="flex flex-col items-center"
                open={isOpen}
                size="small"
                onDismiss={() => setIsOpen(false)}
                closeLabel="Avbryt oppretting"
            >
                <IconButton
                    aria-label="Lukk"
                    onClick={() => setIsOpen(false)}
                    className="absolute right-4 top-4"
                >
                    <CloseIcon />
                </IconButton>
                <Image
                    src={birds}
                    alt="Illustrasjon av to fugler"
                    className="h-1/2 w-1/2"
                />

                <Heading2 as="h1">Opprett mappe</Heading2>
                <Paragraph className="mb-4 mt-4 text-center">
                    Mappen gir deg mulighet til å samarbeide om tavler med
                    andre. Tavlene vil også organiseres etter mappe i
                    tavleoversikten.
                </Paragraph>
                <form
                    className="flex w-full flex-col"
                    action={formAction}
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <Label>Sett navn på mappen. Feltet er påkrevd.</Label>
                    <ClientOnlyTextField
                        size="medium"
                        label="Mappenavn"
                        className="w-full"
                        id="name"
                        name="name"
                        maxLength={50}
                        required
                        aria-required
                        {...getFormFeedbackForField('name', state)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <ButtonGroup className="mt-8 flex flex-row gap-4">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Opprett mappe"
                            className="!mr-0"
                        >
                            Opprett
                        </SubmitButton>

                        <Button
                            type="button"
                            width="fluid"
                            variant="secondary"
                            aria-label="Avbryt opprett mappe"
                            onClick={() => setIsOpen(false)}
                            className="!mr-0"
                        >
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

export { CreateFolder }
