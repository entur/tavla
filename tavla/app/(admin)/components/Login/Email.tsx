'use client'
import { useActionState } from 'react'
import { useSearchParamsSetter } from 'app/(admin)/hooks/useSearchParamsSetter'
import {
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { getClientApp } from 'utils/firebase'
import { login } from './actions'
import { Heading3, Paragraph } from '@entur/typography'

import { Button, ButtonGroup } from '@entur/button'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from '../../utils'

import { FirebaseError } from 'firebase/app'
import { FormError } from '../FormError'
import { TLoginPage } from './types'
import { SubmitButton } from 'components/Form/SubmitButton'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import Google from './Google'

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
    const pathname = usePathname()

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
            <form className="flex flex-col gap-4 w-full" action={action}>
                <div>
                    <ClientOnlyTextField
                        name="email"
                        label="E-post"
                        type="email"
                        {...getFormFeedbackForField('email', state)}
                    />
                </div>
                <div>
                    <ClientOnlyTextField
                        name="password"
                        label="Passord"
                        type="password"
                        {...getFormFeedbackForField('password', state)}
                    />
                </div>
                <FormError {...getFormFeedbackForField('user', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
                <p>
                    <Link
                        className="underline"
                        href={getPathWithParams('reset')}
                    >
                        Glemt passord?
                    </Link>
                </p>
                <ButtonGroup className="flex flex-row gap-4 pb-4">
                    <div className="w-1/2">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Logg inn"
                        >
                            Logg inn
                        </SubmitButton>
                    </div>

                    <div className="w-1/2">
                        <Button
                            type="button"
                            as={Link}
                            href={pathname ?? '/'}
                            width="fluid"
                            variant="secondary"
                            aria-label="Avbryt"
                        >
                            Avbryt
                        </Button>
                    </div>
                </ButtonGroup>
                <Paragraph className="text-center" margin="none">
                    Har du ikke en bruker?{' '}
                    <Link
                        className="underline"
                        href={getPathWithParams('create')}
                    >
                        Opprett bruker
                    </Link>
                </Paragraph>
            </form>
            <Google />
        </div>
    )
}

export { Email }
