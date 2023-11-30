'use client'
import Image from 'next/image'
import { sendPasswordResetEmail } from 'firebase/auth'
import musk from 'assets/illustrations/Musk.png'
import { Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { PrimaryButton } from '@entur/button'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { auth } from 'utils/firebase'
import { useFormState } from 'react-dom'
import { FirebaseError } from 'firebase/app'
import { UserError } from './UserError'

function Reset() {
    const submit = async (
        previousState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const email = data.get('email') as string
        try {
            await sendPasswordResetEmail(auth, email)
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
        }
    }
    const [state, action] = useFormState(submit, undefined)

    return (
        <div>
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Glemt passord</Heading3>
            <Paragraph>
                Skriv inn e-posten du brukte for å opprette brukeren, så sender
                vi deg en lenke for å tilbakestille passordet ditt.
            </Paragraph>
            <form className="flexColumn g-2" action={action}>
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getFormFeedbackForField('email', state)}
                />
                <UserError {...getFormFeedbackForField('user', state)} />
                <UserError {...getFormFeedbackForField('general', state)} />
                <PrimaryButton type="submit">
                    Tilbakestill passord
                </PrimaryButton>
            </form>
        </div>
    )
}

export { Reset }
