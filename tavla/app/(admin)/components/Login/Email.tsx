'use client'
import { ButtonGroup } from '@entur/button'
import { Heading3, Paragraph } from '@entur/typography'
import { SubmitButton } from 'app/(admin)/components/Form/SubmitButton'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import musk from 'assets/illustrations/Musk.png'
import { FirebaseError } from 'firebase/app'
import {
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import Image from 'next/image'
import Link from 'next/link'
import { useActionState, useState } from 'react'
import { getClientApp } from 'src/utils/firebase'
import { FormError } from '../FormError'
import { login } from './actions'
import Google from './Google'
import { TLoginPage } from './types'

function Email() {
    const posthog = usePosthogTracking()
    const [email, setEmail] = useState('')
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
                try {
                    await sendEmailVerification(auth.currentUser)
                } catch (e: unknown) {
                    // if email verification returns too-many-requests, verification email was sent very recently
                    // user should not be shown the too-many-requests feedback
                    if (
                        e instanceof FirebaseError &&
                        e.code != 'auth/too-many-requests'
                    ) {
                        return getFormFeedbackForError(e)
                    }
                }
                return getFormFeedbackForError(error, email)
            }
        } catch (e: unknown) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
        }
    }

    const [state, action] = useActionState(submit, undefined)
    const getPathWithParams = useSearchParamsSetter<TLoginPage>('login')

    return (
        <div className="flex flex-col items-center">
            <Image
                src={musk}
                aria-hidden="true"
                alt=""
                className="h-1/2 w-1/2"
            />
            <Heading3 margin="bottom" as="h1">
                Logg inn med e-post
            </Heading3>
            <form className="flex w-full flex-col gap-4" action={action}>
                <div>
                    <ClientOnlyTextField
                        name="email"
                        label="E-post"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        feedback={
                            getFormFeedbackForField('email', state)?.feedback
                        }
                        variant={
                            getFormFeedbackForField('email', state)?.variant
                        }
                        ariaAlertOnFeedback={true}
                    />
                </div>
                <div>
                    <ClientOnlyTextField
                        name="password"
                        label="Passord"
                        type="password"
                        feedback={
                            getFormFeedbackForField('password', state)?.feedback
                        }
                        variant={
                            getFormFeedbackForField('password', state)?.variant
                        }
                        ariaAlertOnFeedback={true}
                        autoComplete="current-password"
                    />
                </div>
                <FormError {...getFormFeedbackForField('user', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
                <p>
                    <Link
                        className="underline"
                        href={getPathWithParams('reset')}
                        onClick={() =>
                            posthog.capture('user_forgot_password', {
                                location: 'user_modal',
                            })
                        }
                    >
                        Glemt passord?
                    </Link>
                </p>
                <ButtonGroup className="flex flex-col gap-4 pb-4 sm:flex-row">
                    <SubmitButton
                        variant="primary"
                        width="fluid"
                        aria-label="Logg inn"
                        onClick={() => {
                            posthog.capture('user_login_method_selected', {
                                method: 'email',
                                location: 'user_modal',
                                context: 'email',
                            })
                        }}
                    >
                        Logg inn
                    </SubmitButton>
                </ButtonGroup>
            </form>
            <div className="mb-8 mt-4 w-full rounded-sm border-2"></div>
            <Google userTrackingContext="email" />
            <Paragraph className="mt-10 text-center" margin="none">
                Har du ikke en bruker?{' '}
                <Link
                    className="underline"
                    href={getPathWithParams('create')}
                    onClick={() =>
                        posthog.capture('user_create_started', {
                            location: 'user_modal',
                        })
                    }
                >
                    Opprett bruker
                </Link>
            </Paragraph>
        </div>
    )
}

export { Email }
