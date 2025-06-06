'use client'
import { useActionState } from 'react'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { confirmPasswordReset, getAuth } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'
import { redirect } from 'next/navigation'
import { getClientApp } from 'utils/firebase'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'

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

    const [state, action] = useActionState(submit, undefined)

    return (
        <form className="flex w-[30%] min-w-40 flex-col gap-4" action={action}>
            <ClientOnlyTextField
                name="password"
                label="Nytt passord"
                type="password"
                {...getFormFeedbackForField('password', state)}
            />
            <ClientOnlyTextField
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
