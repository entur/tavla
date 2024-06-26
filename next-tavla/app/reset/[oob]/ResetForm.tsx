'use client'

import { TextField } from '@entur/form'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { confirmPasswordReset, getAuth } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { useFormState } from 'react-dom'
import { redirect } from 'next/navigation'
import { getClientApp } from 'utils/firebase'

function ResetForm({ oob }: { oob: string }) {
    const submit = async (
        previousState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const password = data.get('password') as string
        const repeatPassword = data.get('repeat_password') as string

        if (password !== repeatPassword)
            return getFormFeedbackForError('auth/password-no-match')

        try {
            const app = await getClientApp()
            const auth = getAuth(app)

            await confirmPasswordReset(auth, oob, password)
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                return getFormFeedbackForError(error)
            }
        }
        redirect('/?login=email')
    }

    const [state, action] = useFormState(submit, undefined)

    return (
        <form className="flex flex-col gap-4 w-[30%]" action={action}>
            <TextField
                name="password"
                label="Nytt passord"
                type="password"
                {...getFormFeedbackForField('password', state)}
            />
            <TextField
                name="repeat_password"
                label="Gjenta passord"
                type="password"
                {...getFormFeedbackForField('repeat_password', state)}
            />
            <SubmitButton variant="primary">Tilbakestill passord</SubmitButton>
        </form>
    )
}

export { ResetForm }
