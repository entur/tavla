'use client'
import { useActionState } from 'react'
import { Button, ButtonGroup, PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { useModalWithValue } from 'app/(admin)/boards/hooks/useModalWithValue'
import Image from 'next/image'
import birds from 'assets/illustrations/Birds.png'
import { createOrganization } from './actions'
import { SubmitButton } from 'components/Form/SubmitButton'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

function CreateOrganization() {
    const { isOpen, open, close } = useModalWithValue('create', '')
    const [state, formAction] = useActionState(createOrganization, undefined)

    return (
        <>
            <PrimaryButton onClick={open}>
                Opprett mappe
                <AddIcon />
            </PrimaryButton>
            <Modal
                className="flex flex-col items-center"
                open={isOpen}
                size="small"
                closeLabel="Avbryt oppretting"
            >
                <Image src={birds} alt="" className="h-1/2 w-1/2" />
                <Heading3 as="h1">Opprett mappe</Heading3>
                <Paragraph className="mt-8 text-center">
                    Mappen gir deg mulighet til å samarbeide om tavler med
                    andre. Tavlene vil også organiseres etter mappe i
                    tavleoversikten.
                </Paragraph>
                <form
                    className="flex flex-col w-full"
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
                    <ButtonGroup className="flex flex-row gap-4 mt-8">
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
                                onClick={close}
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

export { CreateOrganization }
