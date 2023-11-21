import Image from 'next/image'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import musk from 'assets/illustrations/Musk.png'
import { useFirebaseAuthError } from '../hooks/useFirebaseAuthError'
import { Heading3, Paragraph } from '@entur/typography'
import { SyntheticEvent } from 'react'
import { TextField } from '@entur/form'
import { PrimaryButton } from '@entur/button'
import { FirebaseError } from 'firebase/app'
import { UserError } from './UserError'

function ResetPassword({ popPage }: { popPage: () => void }) {
    const { error, setError, getTextFieldPropsForType } = useFirebaseAuthError()
    const auth = getAuth()

    const submitResetPassword = async (event: SyntheticEvent) => {
        event.preventDefault()

        const data = event.currentTarget as unknown as {
            email: HTMLInputElement
        }

        const email = data.email.value

        try {
            await sendPasswordResetEmail(auth, email)
            popPage()
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                setError(error)
            }
        }
    }

    return (
        <div>
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Glemt passord</Heading3>
            <Paragraph>
                Skriv inn e-posten du brukte for å opprette brukeren, så sender
                vi deg en lenke for å tilbakestille passordet ditt.
            </Paragraph>
            <form className="flexColumn pb-2" onSubmit={submitResetPassword}>
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getTextFieldPropsForType('email')}
                />

                <UserError error={error} />

                <PrimaryButton type="submit">
                    Tilbakestill passord
                </PrimaryButton>
            </form>
        </div>
    )
}

export { ResetPassword }
