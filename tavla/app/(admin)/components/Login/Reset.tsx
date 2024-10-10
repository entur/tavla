'use client'
import Image from 'next/image'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import musk from 'assets/illustrations/Musk.png'
import { Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { PrimaryButton } from '@entur/button'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { useFormState } from 'react-dom'
import { FirebaseError } from 'firebase/app'
import { FormError } from '../FormError'
import { getClientApp } from 'utils/firebase'

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
    const [state, action] = useFormState(submit, undefined)
    return (
        <div className="flex flex-col text-center items-center">
            <Image
                src={musk}
                aria-hidden="true"
                alt=""
                className="h-1/2 w-1/2"
            />
            <Heading3>Glemt passord</Heading3>
            <Paragraph>
                Skriv inn e-posten du brukte for å opprette brukeren, så sender
                vi deg en lenke for å tilbakestille passordet ditt.
            </Paragraph>
            <form className="flex flex-col gap-4 w-full" action={action}>
                <div>
                    <TextField
                        name="email"
                        label="E-post"
                        aria-label="E-post"
                        type="email"
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
