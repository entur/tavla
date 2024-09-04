'use client'
import { TextArea, TextField } from '@entur/form'
import { Heading4, Label, Paragraph } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { postForm } from './actions'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { useEffect, useRef, useState } from 'react'
import { FormError } from 'app/(admin)/components/FormError'
import { useToast } from '@entur/alert'
import { Expandable } from './Expandable'

export function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const { addToast } = useToast()
    const [state, action] = useFormState(postForm, undefined)
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (!formRef.current) return
        if (state?.feedback) {
            setIsOpen(true)
        } else {
            formRef.current?.reset()
            setIsOpen(false)
            addToast('Takk for din tilbakemelding!')
        }
    }, [state, addToast])
    return (
        <div className="flex items-center justify-center w-1/6 h-14">
            <Expandable
                title="Trenger du hjelp?"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <form
                    action={action}
                    ref={formRef}
                    className="flex flex-col gap-4 pt-4 p-6 "
                >
                    <Heading4 margin="none">
                        Har du spørsmål/innspill eller ønsker hjelp med å komme
                        i gang?
                    </Heading4>
                    <div>
                        <Label
                            htmlFor="email"
                            className="font-bold"
                            aria-required
                        >
                            E-post *
                        </Label>

                        <TextField
                            label="E-postadresse"
                            name="email"
                            type="email"
                            aria-required
                            {...getFormFeedbackForField('email', state)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="message" className="font-bold">
                            Melding
                        </Label>
                        <TextArea
                            name="message"
                            id="message"
                            label="Melding"
                            aria-label="Skriv her"
                            required
                            aria-required
                            {...getFormFeedbackForField('user', state)}
                        />
                    </div>
                    <Paragraph margin="none">
                        Hvis du ønsker å legge ved bilder, kan du sende en
                        e-post til tavla@entur.org
                    </Paragraph>
                    <FormError {...getFormFeedbackForField('general', state)} />
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
