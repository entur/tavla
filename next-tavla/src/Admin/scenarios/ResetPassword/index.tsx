import { Heading3, Paragraph } from '@entur/typography'
import { TextField } from '@entur/form'
import { PrimaryButton } from '@entur/button'
import { SyntheticEvent, useState } from 'react'
import classes from './styles.module.css'
import { UserError } from '../Login/components/UserError'
import { useFirebaseAuthError } from '../Login/hooks/useFirebaseAuthError'
import { confirmPasswordReset } from 'firebase/auth'
import { auth } from 'utils/firebase'
import { FirebaseError } from 'firebase/app'
import { useToast } from '@entur/alert'
import Link from 'next/link'
import dynamic from 'next/dynamic'

function ResetPassword({ oob }: { oob: string }) {
    const { error, setError, getTextFieldPropsForType } = useFirebaseAuthError()
    const { addToast } = useToast()
    const [showForm, setShowForm] = useState(true)

    const submitResetPassword = async (event: SyntheticEvent) => {
        event.preventDefault()
        const data = event.currentTarget as unknown as {
            email: HTMLInputElement
            password: HTMLInputElement
            repeat_password: HTMLInputElement
        }

        const password = data.password.value
        const repeatPassword = data.repeat_password.value

        try {
            if (password !== repeatPassword)
                throw new FirebaseError(
                    'auth/password-no-match',
                    'passwords does not match',
                )
            await confirmPasswordReset(auth, oob, password)
            setShowForm(false)
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                setError(error)
            } else {
                addToast({
                    title: 'Noe gikk galt',
                    content: 'Prøv igjen senere',
                    variant: 'info',
                })
            }
        }
    }

    return (
        <div className={classes.formInput}>
            <Heading3>Tilbakestill passord</Heading3>
            {showForm ? (
                <form
                    className={classes.flexColumn}
                    onSubmit={submitResetPassword}
                >
                    <TextField
                        name="password"
                        label="Nytt passord"
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
                    <PrimaryButton type="submit">
                        Tilbakestill passord
                    </PrimaryButton>
                </form>
            ) : (
                <div>
                    <Paragraph>Passord ble tilbakestilt</Paragraph>
                    <PrimaryButton as={Link} href="/#login">
                        Logg inn
                    </PrimaryButton>
                </div>
            )}
        </div>
    )
}

const NonSSRAdmin = dynamic(() => Promise.resolve(ResetPassword), {
    ssr: false,
})

export { NonSSRAdmin as ResetPassword }
