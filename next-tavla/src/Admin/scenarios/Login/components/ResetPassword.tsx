import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import { Heading3, Paragraph } from '@entur/typography'
import { useFirebaseAuthError } from '../hooks/useFirebaseAuthError'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { TextField } from '@entur/form'
import { UserError } from './UserError'
import { PrimaryButton } from '@entur/button'
import { SyntheticEvent } from 'react'
import { FirebaseError } from 'firebase/app'

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
            <Image src={musk} alt="illustration" className="h-50 w-50" />
            <Heading3>Glemt passord</Heading3>
            <Paragraph>
                Skriv inn e-postadressen som du registrerte profilen din på, så
                sender vi deg en lenke der du kan lage et nytt passord.
            </Paragraph>
            <form className="flexColumn pb-2" onSubmit={submitResetPassword}>
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getTextFieldPropsForType('email')}
                />

                <UserError error={error} />

                <PrimaryButton type="submit">Send nytt passord</PrimaryButton>
            </form>
        </div>
    )
}

export { ResetPassword }
