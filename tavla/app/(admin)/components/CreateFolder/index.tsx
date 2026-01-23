'use client'
import { Button, ButtonGroup, IconButton, SecondaryButton } from '@entur/button'
import { CloseIcon, FolderIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import birds from 'assets/illustrations/Birds.png'
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
                <Image src={birds} alt="" className="h-1/2 w-1/2" />
                <Heading3 as="h1">Opprett mappe</Heading3>
                <Paragraph className="mt-8 text-center">
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
                    <SubParagraph className="font-medium">
                        Sett navn på mappen
                    </SubParagraph>
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
                        <div className="w-1/2">
                            <SubmitButton
                                variant="primary"
                                width="fluid"
                                aria-label="Opprett mappe"
                            >
                                Opprett
                            </SubmitButton>
                        </div>

                        <div className="w-1/2">
                            <Button
                                type="button"
                                width="fluid"
                                variant="secondary"
                                aria-label="Avbryt oppretting"
                                onClick={() => setIsOpen(false)}
                            >
                                Avbryt
                            </Button>
                        </div>
                    </ButtonGroup>
                </form>
            </Modal>
        </>
    )
}

export { CreateFolder }
