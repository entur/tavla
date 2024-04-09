'use client'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import {
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { getClientApp } from 'utils/firebase'
import { login } from './actions'
import { Heading3 } from '@entur/typography'
import { TextField } from '@entur/form'
import { Button } from '@entur/button'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from '../../utils'

import Link from 'next/link'
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
            await login(uid)
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
            if (e instanceof Error) {
                if (e.message === 'auth/unverified') {
                    const app = await getClientApp()
                    const auth = getAuth(app)
                    if (auth.currentUser)
                        sendEmailVerification(auth.currentUser)
                }
                return getFormFeedbackForError(e.message)
            }
        }
    }

    const [state, action] = useFormState(submit, undefined)
    const getPathWithParams = useSearchParamsSetter<TLoginPage>('login')

    return (
        <div className="textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn  g-2" action={action}>
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
                <SubmitButton variant="primary">Logg inn</SubmitButton>
                <Button
                    variant="secondary"
                    as={Link}
                    href={getPathWithParams('reset')}
                >
                    Glemt passord?
                </Button>
            </form>
        </div>
    )
}

export { Email }
