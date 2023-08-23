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

function CreateUser() {
    const { createUser } = useAuth()
    const { error, setError, getTextFieldPropsForType } = useFirebaseAuthError()

    const submitCreateUser = async (event: SyntheticEvent) => {
        event.preventDefault()

        const data = event.currentTarget as unknown as {
            email: HTMLInputElement
            password: HTMLInputElement
            repeat_password: HTMLInputElement
        }

        const email = data.email.value
        const password = data.password.value
        const repeatPassword = data.repeat_password.value

        try {
            await createUser(email, password, repeatPassword)
        } catch (error) {
            if (error instanceof FirebaseError) setError(error)
        }
    }

    return (
        <div>
            <Image src={musk} alt="illustration" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn" onSubmit={submitCreateUser}>
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
                <TextField
                    name="repeat_password"
                    label="Gjenta passord"
                    type="password"
                    {...getTextFieldPropsForType('repeat_password')}
                />
                <UserError error={error} />
                <PrimaryButton type="submit">Opprett ny bruker</PrimaryButton>
            </form>
        </div>
    )
}

export { CreateUser }
