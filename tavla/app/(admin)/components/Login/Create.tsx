'use client'
import { useActionState } from 'react'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import { Heading3 } from '@entur/typography'
import { create } from './actions'
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
} from 'firebase/auth'

import { getClientApp } from 'utils/firebase'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { FormError } from '../FormError'
import { SubmitButton } from 'components/Form/SubmitButton'
import { usePathname } from 'next/navigation'
import { Button, ButtonGroup } from '@entur/button'
import Link from 'next/link'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { handleError } from 'app/(admin)/utils/handleError'

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

            <Heading3 margin="bottom">Opprett ny bruker</Heading3>
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
                <ButtonGroup className="flex flex-row gap-4">
                    <div className="w-1/2">
                        <SubmitButton
                            variant="primary"
                            width="fluid"
                            aria-label="Opprett bruker"
                        >
                            Opprett bruker
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
        </div>
    )
}

export { Create }
