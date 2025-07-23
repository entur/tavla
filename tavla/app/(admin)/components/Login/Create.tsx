'use client'
import { Heading3, Paragraph } from '@entur/typography'
import musk from 'assets/illustrations/Musk.png'
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
} from 'firebase/auth'
import Image from 'next/image'
import { useActionState } from 'react'
import { create } from './actions'

import { Button, ButtonGroup } from '@entur/button'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { handleError } from 'app/(admin)/utils/handleError'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { SubmitButton } from 'components/Form/SubmitButton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getClientApp } from 'utils/firebase'
import { FormError } from '../FormError'
import Google from './Google'

function Create() {
    const submit = async (p: TFormFeedback | undefined, data: FormData) => {
        const email = data.get('email') as string
        const password = data.get('password') as string
        const repeat = data.get('repeat_password') as string
        if (password !== repeat)
            return getFormFeedbackForError('auth/password-no-match')

        try {
            const app = await getClientApp()
            const auth = getAuth(app)
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )
            await create(credential.user.uid)
            await sendEmailVerification(credential.user)
            return getFormFeedbackForError('auth/create', email)
        } catch (e) {
            return handleError(e)
        }
    }
    const [state, action] = useActionState(submit, undefined)
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
                Opprett ny bruker
            </Heading3>
            <form className="flex w-full flex-col gap-4" action={action}>
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
                <div>
                    <ClientOnlyTextField
                        name="repeat_password"
                        label="Gjenta passord"
                        type="password"
                        {...getFormFeedbackForField('repeat_password', state)}
                    />
                </div>
                <FormError {...getFormFeedbackForField('user', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
                <ButtonGroup className="flex flex-row gap-4 pb-4">
                    <div className="w-1/2">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Opprett bruker"
                        >
                            Opprett
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
            </form>
            <div className="mb-8 mt-4 w-full rounded-sm border-2"></div>
            <Google />
            <Paragraph className="mt-10 text-center" margin="none">
                Har du allerede en bruker?{' '}
                <Link className="underline" href="?login=email">
                    Logg inn
                </Link>
            </Paragraph>
        </div>
    )
}

export { Create }
