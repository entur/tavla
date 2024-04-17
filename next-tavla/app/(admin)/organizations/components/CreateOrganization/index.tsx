'use client'
import { PrimaryButton, SecondarySquareButton } from '@entur/button'
import { AddIcon, CloseIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading2, Label, Paragraph } from '@entur/typography'
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
            <PrimaryButton
                onClick={open}
                className="flex flex-row items-center justify-center"
            >
                Opprett organisasjon
                <AddIcon className="!top-0" />
            </PrimaryButton>
            <Modal
                className="flex flex-col items-center"
                open={isOpen}
                size="small"
                closeLabel="Avbryt oppretting"
            >
                <SecondarySquareButton
                    aria-label="Avbryt oppretting"
                    className="ml-auto"
                    onClick={close}
                >
                    <CloseIcon />
                </SecondarySquareButton>
                <Image src={birds} alt="" className="h-1/2 w-1/2" />
                <Heading2>Opprett organisasjon</Heading2>
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
                    <Label className="font-medium">
                        Sett navn på organisasjonen
                    </Label>
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
                    <SubmitButton
                        variant="primary"
                        className="mt-8"
                        width="fluid"
                        aria-label="Opprett organisasjon"
                    >
                        Opprett
                    </SubmitButton>
                </form>
            </Modal>
        </>
    )
}

export { CreateOrganization }
