'use client'
import { Button, ButtonGroup, PrimaryButton } from '@entur/button'
import { AddIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph, SubParagraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { useFormState } from 'react-dom'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { FormError } from 'app/(admin)/components/FormError'
import { useModalWithValue } from 'app/(admin)/boards/hooks/useModalWithValue'
import Image from 'next/image'
import birds from 'assets/illustrations/Birds.png'
import { createOrganization } from './actions'
import { SubmitButton } from 'components/Form/SubmitButton'

function CreateOrganization() {
    const { isOpen, open, close } = useModalWithValue('create', '')
    const [state, formAction] = useFormState(createOrganization, undefined)

    return (
        <>
            <PrimaryButton onClick={open}>
                Opprett organisasjon
                <AddIcon />
            </PrimaryButton>
            <Modal
                className="flex flex-col items-center"
                open={isOpen}
                size="small"
                closeLabel="Avbryt oppretting"
            >
                <Image src={birds} alt="" className="h-1/2 w-1/2" />
                <Heading3>Opprett organisasjon</Heading3>
                <Paragraph className="mt-8 text-center">
                    Organisasjonen gir deg mulighet til å samarbeide om tavler
                    med andre. Tavlene vil også organiseres etter organisasjon i
                    tavleoversikten.
                </Paragraph>
                <form
                    className="flex flex-col w-full"
                    action={formAction}
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <SubParagraph className="font-medium">
                        Sett navn på organisasjonen
                    </SubParagraph>
                    <TextField
                        size="medium"
                        label="Organisasjonsnavn"
                        className="w-full"
                        id="name"
                        name="name"
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
                                aria-label="Opprett organisasjon"
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
