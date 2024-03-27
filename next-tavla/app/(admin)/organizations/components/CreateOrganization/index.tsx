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
                className="flexColumn alignCenter"
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
                <Image src={birds} alt="" className="h-50 w-50" />
                <Heading2>Opprett organisasjon</Heading2>
                <Paragraph className="mt-2 textCenter">
                    Organisasjonen gir deg mulighet til å samarbeide om tavler
                    med andre. Tavlene vil også organiseres etter organisasjon i
                    tavleoversikten.
                </Paragraph>
                <form
                    className="flexColumn w-100"
                    action={formAction}
                    aria-live="polite"
                    aria-relevant="all"
                >
                    <Label className="weight500">
                        Sett navn på organisasjonen
                    </Label>
                    <TextField
                        size="medium"
                        label="Organisasjonsnavn"
                        className="w-100"
                        id="name"
                        name="name"
                        required
                        aria-required
                        {...getFormFeedbackForField('name', state)}
                    />
                    <FormError {...getFormFeedbackForField('general', state)} />
                    <PrimaryButton
                        className="mt-4"
                        type="submit"
                        width="fluid"
                        aria-label="Opprett organisasjon"
                    >
                        Opprett
                    </PrimaryButton>
                </form>
            </Modal>
        </>
    )
}

export { CreateOrganization }
