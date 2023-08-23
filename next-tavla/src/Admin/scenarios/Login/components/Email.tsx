import { PrimaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { Heading3 } from '@entur/typography'
import musk from 'assets/illustrations/Musk.png'
import { FirebaseError } from 'firebase/app'
import Image from 'next/image'
import { SyntheticEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useFirebaseAuthError } from '../hooks/useFirebaseAuthError'
import { UserError } from './UserError'

function Email() {
    const { error, setError, getTextFieldPropsForType } = useFirebaseAuthError()
    const { login } = useAuth()

    const submitEmailLogin = async (event: SyntheticEvent) => {
        event.preventDefault()

        const data = event.currentTarget as unknown as {
            email: HTMLInputElement
            password: HTMLInputElement
        }

        const email = data.email.value
        const password = data.password.value

        try {
            await login(email, password)
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                setError(error)
            }
        }
    }

    return (
        <div>
            <Image src={musk} alt="illustration" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn" onSubmit={submitEmailLogin}>
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getTextFieldPropsForType('email')}
                />
                <TextField
                    name="password"
                    label="Passord"
                    type="password"
                    {...getTextFieldPropsForType('password')}
                />

                <UserError error={error} />

                <PrimaryButton type="submit">Logg inn</PrimaryButton>
            </form>
        </div>
    )
}

export { Email }
