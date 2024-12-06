'use client'
import { useToast } from '@entur/alert'
import { Heading3 } from '@entur/typography'
import { getFormFeedbackForField, TFormFeedback } from 'app/(admin)/utils'
import ClientOnlyTextField from 'app/components/NoSSR/TextField'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useActionState } from 'react'
import { saveTitle as saveTitleAction } from './actions'
import { TBoardID } from 'types/settings'

function Title({ bid, title }: { bid: TBoardID; title: string }) {
    const { addToast } = useToast()

    const saveTitle = async (
        state: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const formFeedback = await saveTitleAction(state, bid, data)
        if (!formFeedback) {
            addToast('Navnet på tavlen er lagret!')
        }
        return formFeedback
    }
    const [titleState, saveTitleFormAction] = useActionState(
        saveTitle,
        undefined,
    )
    return (
        <form action={saveTitleFormAction} className="box flex flex-col">
            <Heading3 margin="bottom">Navn</Heading3>
            <div className="h-full">
                <ClientOnlyTextField
                    name="name"
                    className="w-full"
                    defaultValue={title}
                    label="Navn på tavlen"
                    maxLength={50}
                    {...getFormFeedbackForField('name', titleState)}
                />
            </div>
            <div className="flex flex-row justify-end mt-8">
                <SubmitButton variant="secondary" className="max-sm:w-full">
                    Lagre navn
                </SubmitButton>
            </div>
        </form>
    )
}
export { Title }
