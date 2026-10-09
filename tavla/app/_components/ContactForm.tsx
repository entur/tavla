'use client'
import { SmallAlertBox, useToast } from '@entur/alert'
import { Checkbox, TextArea } from '@entur/form'
import { Label, Paragraph, SubParagraph } from '@entur/typography'
import { isEmptyOrSpaces } from 'app/(innlogget)/tavler/[id]/utils'
import {
    getFormFeedbackForError,
    getFormFeedbackForField,
    type TFormFeedback,
} from 'app/(innlogget)/utils/forms'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'
import { validEmail } from 'src/utils/email'
import { postForm } from './actions'
import { FormError } from './Form/FormError'
import { SubmitButton } from './Form/SubmitButton'
import ClientOnlyTextField from './NoSSR/TextField'

function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
    const { capture } = usePosthogTracking()

    const { addToast } = useToast()
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
            resetForm()
            addToast('Takk for tilbakemelding!')
            onSuccess?.()
        }
    }

    const resetForm = () => {
        setFormError(undefined)
        setDisabledEmail(false)
    }

    return (
        <form action={submit} className="flex flex-col gap-4 p-4 sm:p-6">
            <Paragraph as="h2" margin="none" className="font-bold">
                Vi setter stor pris på tilbakemeldinger og innspill, og bistår
                gjerne hvis du vil ha hjelp til å komme i gang med Tavla.
            </Paragraph>

            <div>
                <Label htmlFor="message" className="font-bold">
                    Melding (påkrevd)
                </Label>
                <TextArea
                    name="message"
                    id="message"
                    label="Melding"
                    aria-required
                    required
                    {...getFormFeedbackForField('user', formState)}
                    className="mb-2"
                />
                <SubParagraph>
                    Hvis du ønsker å legge ved bilder, kan du sende en e-post
                    til tavla@entur.org.
                </SubParagraph>
            </div>
            <div>
                <Label htmlFor="email" className="font-bold">
                    E-post
                </Label>

                <div>
                    <Checkbox
                        className="!items-start"
                        name="disabledEmail"
                        onChange={(e) => {
                            setDisabledEmail(e.target.checked)
                            capture('contact_form_email_disabled', {
                                disabled: e.target.checked,
                            })
                        }}
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
            </div>
            {!disabledEmail && (
                <ClientOnlyTextField
                    label="E-postadresse"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-label="E-postadresse"
                    {...getFormFeedbackForField('email', formState)}
                />
            )}

            <FormError {...getFormFeedbackForField('general', formState)} />
            <SubmitButton
                variant="primary"
                width="fluid"
                aria-label="Send"
                onClick={() => capture('contact_form_submitted')}
            >
                Send
            </SubmitButton>
        </form>
    )
}

export { ContactForm }
