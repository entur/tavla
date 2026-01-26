'use client'
import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { Heading3, Paragraph } from '@entur/typography'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import musk from 'assets/illustrations/Musk.png'
import { FirebaseError } from 'firebase/app'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import Image from 'next/image'
import { useActionState } from 'react'
import { getClientApp } from 'src/utils/firebase'
import { FormError } from '../FormError'

function Reset() {
    const submit = async (
        previousState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const email = data.get('email') as string
        try {
            const app = await getClientApp()
            const auth = getAuth(app)
            await sendPasswordResetEmail(auth, email)
            return getFormFeedbackForError('reset/email-sent')
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
        }
    }
    const [state, action] = useActionState(submit, undefined)
    return (
        <div className="flex flex-col items-center text-center">
            <Image
                src={musk}
                aria-hidden="true"
                alt=""
                className="h-1/2 w-1/2"
            />
            <Heading3 margin="bottom" as="h1">
                Glemt passord
            </Heading3>
            <Paragraph>
                Skriv inn e-posten du brukte for å opprette brukeren, så sender
                vi deg en lenke for å tilbakestille passordet ditt.
            </Paragraph>
            <form className="flex w-full flex-col gap-4" action={action}>
                <div>
                    <TextField
                        name="email"
                        label="E-post"
                        aria-label="E-post"
                        type="email"
                        autoComplete="email"
                        {...getFormFeedbackForField('email', state)}
                    />
                </div>
                <FormError {...getFormFeedbackForField('user', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
                <PrimaryButton type="submit" aria-label="Tilbakestill passord">
                    Tilbakestill passord
                </PrimaryButton>
            </form>
        </div>
    )
}

export { Reset }
