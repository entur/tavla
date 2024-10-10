'use client'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import {
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { getClientApp } from 'utils/firebase'
import { login } from './actions'
import { Heading3, Link } from '@entur/typography'
import { TextField } from '@entur/form'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from '../../utils'

import { useFormState } from 'react-dom'
import { FirebaseError } from 'firebase/app'
import { FormError } from '../FormError'
import { TLoginPage } from './types'
import { SubmitButton } from 'components/Form/SubmitButton'

function Email() {
    const submit = async (
        previousState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const email = data.get('email') as string
        const password = data.get('password') as string

        try {
            const app = await getClientApp()
            const auth = getAuth(app)

            const credential = await signInWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const uid = await credential.user.getIdToken()
            const error = await login(uid)
            if (error && auth.currentUser) {
                await sendEmailVerification(auth.currentUser)
                return getFormFeedbackForError(error, email)
            }
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
        }
    }

    const [state, action] = useFormState(submit, undefined)
    const getPathWithParams = useSearchParamsSetter<TLoginPage>('login')

    return (
        <div className="flex flex-col items-center">
            <Image
                src={musk}
                aria-hidden="true"
                alt=""
                className="h-1/2 w-1/2"
            />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flex flex-col gap-4 w-full" action={action}>
                <TextField
                    name="email"
                    label="E-post"
                    type="email"
                    {...getFormFeedbackForField('email', state)}
                />
                <TextField
                    name="password"
                    label="Passord"
                    type="password"
                    {...getFormFeedbackForField('password', state)}
                />
                <FormError {...getFormFeedbackForField('user', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
                <p>
                    <Link href={getPathWithParams('reset')}>
                        Glemt passord?
                    </Link>
                </p>
                <SubmitButton variant="primary">Logg inn</SubmitButton>
            </form>
        </div>
    )
}

export { Email }
