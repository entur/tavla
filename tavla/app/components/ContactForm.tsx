'use client'
import { SmallAlertBox, useToast } from '@entur/alert'
import { Checkbox, TextArea } from '@entur/form'
import { Label, Paragraph, SubParagraph } from '@entur/typography'
import { FormError } from 'app/(admin)/components/FormError'
import { isEmptyOrSpaces } from 'app/(admin)/tavler/[id]/utils'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { usePostHog } from 'posthog-js/react'
import { useState } from 'react'
import { validEmail } from 'utils/email'
import { postForm } from './actions'
import { Expandable } from './Expandable'
import ClientOnlyTextField from './NoSSR/TextField'

function ContactForm() {
    const posthog = usePostHog()

    const { addToast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [formState, setFormError] = useState<TFormFeedback | undefined>(
        undefined,
    )
    const [disabledEmail, setDisabledEmail] = useState(false)
    const submit = async (data: FormData) => {
        const email = data.get('email') as string
        const message = data.get('message') as string

        if (!disabledEmail && !validEmail(email))
            return setFormError(getFormFeedbackForError('auth/missing-email'))

        if (isEmptyOrSpaces(message))
            return setFormError(
                getFormFeedbackForError('contact/message-missing'),
            )
        const error = await postForm(formState, data)

        if (error) return setFormError(error)
        else {
            setIsOpen(false)
            resetForm()
            addToast('Takk for tilbakemelding!')
        }
    }

    const resetForm = () => {
        setFormError(undefined)
        setDisabledEmail(false)
    }
    return (
        <div className="flex w-full items-center justify-center xl:w-1/6">
            <Expandable
                title="Send oss en melding"
                isOpen={isOpen}
                setIsOpen={(open) => {
                    setIsOpen(open)
                    if (open) posthog.capture('CONTACT_FORM_OPENED')
                }}
            >
                <form
                    action={submit}
                    className="flex flex-col gap-4 p-4 sm:p-6"
                >
                    <Paragraph as="h2" margin="none" className="font-bold">
                        Vi setter stor pris på tilbakemeldinger og innspill, og
                        bistår gjerne hvis du vil ha hjelp til å komme i gang
                        med Tavla.
                    </Paragraph>

                    <div>
                        <Label
                            htmlFor="message"
                            className="font-bold"
                            aria-required
                        >
                            Melding *
                        </Label>
                        <TextArea
                            name="message"
                            id="message"
                            label="Melding"
                            aria-label="Skriv her"
                            aria-required
                            {...getFormFeedbackForField('user', formState)}
                            className="mb-2"
                        />
                        <SubParagraph>
                            Hvis du ønsker å legge ved bilder, kan du sende en
                            e-post til tavla@entur.org.
                        </SubParagraph>
                    </div>
                    <div>
                        <Label htmlFor="email" className="font-bold">
                            E-post
                        </Label>
                        <ClientOnlyTextField
                            label="E-postadresse"
                            name="email"
                            id="email"
                            aria-label="E-postadresse"
                            disabled={disabledEmail}
                            {...getFormFeedbackForField('email', formState)}
                        />
                    </div>
                    <div>
                        <Checkbox
                            className="!items-start"
                            name="disabledEmail"
                            onChange={(e) => setDisabledEmail(e.target.checked)}
                        >
                            Jeg ønsker ikke å oppgi e-postadresse og vil ikke få
                            svar på henvendelsen.
                        </Checkbox>
                        {disabledEmail && (
                            <SmallAlertBox variant="info">
                                Vi kan bare svare på meldingen hvis vi har
                                e-postadressen din.
                            </SmallAlertBox>
                        )}
                    </div>

                    <FormError
                        {...getFormFeedbackForField('general', formState)}
                    />
                    <SubmitButton
                        variant="primary"
                        width="fluid"
                        aria-label="Send"
                    >
                        Send
                    </SubmitButton>
                </form>
            </Expandable>
        </div>
    )
}
export { ContactForm }
