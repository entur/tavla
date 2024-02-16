'use client'
import Image from 'next/image'
import musk from 'assets/illustrations/Musk.png'
import { Heading3 } from '@entur/typography'
import { PrimaryButton } from '@entur/button'
import { login, create } from './actions'
import { TextField } from '@entur/form'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { auth } from 'utils/firebase'
import { revalidatePath } from 'next/cache'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { FirebaseError } from 'firebase/app'
import { useFormState } from 'react-dom'
import { FormError } from '../FormError'

function Create() {
    const submit = async (p: TFormFeedback | undefined, data: FormData) => {
        const email = data.get('email') as string
        const password = data.get('password') as string
        const repeat = data.get('repeat_password') as string
        if (password !== repeat)
            return {
                form_type: 'repeat_password',
                variant: 'warning',
                feedback: 'Passordene er ikke like.',
            } as TFormFeedback

        try {
            const credential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
            )
            const uid = await credential.user.getIdToken()
            await create(credential.user.uid)
            await login(uid)
            revalidatePath('/')
        } catch (e) {
            if (e instanceof FirebaseError) {
                return getFormFeedbackForError(e)
            }
        }
    }
    const [state, action] = useFormState(submit, undefined)
    return (
        <div className="textCenter">
            <Image src={musk} aria-hidden="true" alt="" className="h-50 w-50" />
            <Heading3>Logg inn med e-post</Heading3>
            <form className="flexColumn g-2" action={action}>
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
                <TextField
                    name="repeat_password"
                    label="Gjenta passord"
                    type="password"
                    {...getFormFeedbackForField('repeat_password', state)}
                />

                <FormError {...getFormFeedbackForField('user', state)} />
                <FormError {...getFormFeedbackForField('general', state)} />
                <PrimaryButton type="submit">Opprett ny bruker</PrimaryButton>
            </form>
        </div>
    )
}

export { Create }
